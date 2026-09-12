import { executeSource, type ExecutionResult, type RuntimeVirtualFile } from "../../packages/runtime/dist/index.js";
import type { AuthenticatedUser } from "./auth";
import { assertProjectOwner } from "./sync";

type SnapshotFile = {
  id: string;
  kind: "source" | "runtime";
  name: string;
  content: unknown;
};

type RunRequest = {
  projectId: string;
  requestId: string;
  runtimeVersion: string;
  inputs: string[];
  snapshot: { entryFileId: string; files: SnapshotFile[] };
};

const encoder = new TextEncoder();
const RUN_WINDOW_MS = 60 * 60 * 1000;
const RUNS_PER_WINDOW = 50;
const MAX_SNAPSHOT_FILES = 200;
const MAX_SNAPSHOT_BYTES = 2 * 1024 * 1024;
const MAX_INPUTS = 1_000;
const MAX_INPUT_BYTES = 64 * 1024;

export class RunError extends Error {
  constructor(public readonly code: string, public readonly status: number, message: string) {
    super(message);
  }
}

export async function runSnapshot(db: D1Database, user: AuthenticatedUser, input: unknown): Promise<ExecutionResult> {
  const request = parseRequest(input);
  await assertProjectOwner(db, user, request.projectId);

  const entry = request.snapshot.files.find((file) => file.id === request.snapshot.entryFileId && file.kind === "source");
  if (!entry || typeof entry.content !== "string") throw new RunError("INVALID_SNAPSHOT", 400, "运行快照不正确。");
  const virtualFiles = request.snapshot.files.filter((file) => file.kind === "runtime").map(toVirtualFile);
  await consumeQuota(db, user.id, request.requestId);

  let inputCursor = 0;
  let inputExhausted = false;
  let inputRange: { start: { line: number; column: number; offset: number }; end: { line: number; column: number; offset: number } } | undefined;
  const controller = executeSource(entry.content, {
    maxSteps: 200_000,
    maxActiveTimeMs: 1_500,
    maxOutputLines: 2_000,
    maxOutputBytes: 256 * 1024,
    maxArrayElements: 100_000,
    maxCallDepth: 128,
    maxFileBytes: 256 * 1024,
    maxProjectFileBytes: MAX_SNAPSHOT_BYTES,
    yieldEverySteps: 64,
    virtualFiles,
    onEvent(event) {
      if (event.type !== "input-requested") return;
      inputRange = event.range;
      if (inputCursor >= request.inputs.length) {
        inputExhausted = true;
        controller.stop();
        return;
      }
      /* 与本地运行一致：类型不匹配只消耗这次错误输入，继续等待下一项，
         让调用方可以在预先提供的序列里放入修正值，而不是直接结束运行。 */
      let accepted = false;
      while (inputCursor < request.inputs.length) {
        const submission = controller.provideInput(request.inputs[inputCursor]);
        inputCursor += 1;
        if (submission.accepted) { accepted = true; break; }
      }
      if (!accepted) {
        inputExhausted = true;
        controller.stop();
      }
    }
  });
  const result = await controller.result;
  if (!inputExhausted) return result;
  return {
    ...result,
    status: "error",
    error: {
      code: "RT1003",
      messageKey: "runtime.input.exhausted",
      range: inputRange ?? { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 1, offset: 0 } }
    },
    fileChangesCommitted: false
  };
}

function parseRequest(input: unknown): RunRequest {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new RunError("INVALID_REQUEST", 400, "请求内容不正确。");
  const value = input as Record<string, unknown>;
  const projectId = identifier(value.projectId, "项目");
  const requestId = identifier(value.requestId, "运行请求");
  const runtimeVersion = stringValue(value.runtimeVersion, "运行时版本", 100);
  if (!Array.isArray(value.inputs) || value.inputs.length > MAX_INPUTS) throw new RunError("INVALID_INPUTS", 400, "输入序列不正确。");
  return {
    projectId,
    requestId,
    runtimeVersion,
    inputs: value.inputs.map((item) => stringValue(item, "输入", MAX_INPUT_BYTES)),
    snapshot: parseSnapshot(value.snapshot)
  };
}

function parseSnapshot(value: unknown): RunRequest["snapshot"] {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new RunError("INVALID_SNAPSHOT", 400, "运行快照不正确。");
  const snapshot = value as Record<string, unknown>;
  const entryFileId = identifier(snapshot.entryFileId, "入口文件");
  if (!Array.isArray(snapshot.files) || !snapshot.files.length || snapshot.files.length > MAX_SNAPSHOT_FILES) {
    throw new RunError("INVALID_SNAPSHOT", 400, "运行快照不正确。");
  }
  let totalBytes = 0;
  const files = snapshot.files.map((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) throw new RunError("INVALID_SNAPSHOT", 400, "运行快照不正确。");
    const file = item as Record<string, unknown>;
    const id = identifier(file.id, "文件");
    const kind = file.kind === "source" || file.kind === "runtime" ? file.kind : null;
    if (!kind) throw new RunError("INVALID_SNAPSHOT", 400, "运行快照不正确。");
    const name = stringValue(file.name, "文件名称", 180);
    const content = kind === "source" ? stringValue(file.content, "代码内容", MAX_SNAPSHOT_BYTES) : cloneRuntimeContent(file.content);
    totalBytes += encoder.encode(typeof content === "string" ? content : JSON.stringify(content)).byteLength;
    return { id, kind, name, content } as SnapshotFile;
  });
  if (totalBytes > MAX_SNAPSHOT_BYTES) throw new RunError("SNAPSHOT_TOO_LARGE", 413, "项目内容超过大小上限。");
  if (new Set(files.map((file) => file.id)).size !== files.length) throw new RunError("INVALID_SNAPSHOT", 400, "运行快照包含重复文件。");
  return { entryFileId, files };
}

function cloneRuntimeContent(value: unknown): unknown {
  try {
    const encoded = JSON.stringify(value);
    if (encoded === undefined) throw new Error("undefined");
    return JSON.parse(encoded);
  } catch {
    throw new RunError("INVALID_SNAPSHOT", 400, "运行时文件内容不正确。");
  }
}

function toVirtualFile(file: SnapshotFile): RuntimeVirtualFile {
  if (!file.content || typeof file.content !== "object" || Array.isArray(file.content)) {
    throw new RunError("INVALID_SNAPSHOT", 400, "运行时文件内容不正确。");
  }
  const content = file.content as Record<string, unknown>;
  if (content.kind !== "text" && content.kind !== "records") throw new RunError("INVALID_SNAPSHOT", 400, "运行时文件内容不正确。");
  const virtualFile: RuntimeVirtualFile = { id: file.id, name: file.name, kind: content.kind };
  if (content.kind === "text") {
    if (content.lines !== undefined && (!Array.isArray(content.lines) || content.lines.some((line) => typeof line !== "string"))) {
      throw new RunError("INVALID_SNAPSHOT", 400, "运行时文件内容不正确。");
    }
    virtualFile.lines = (content.lines as string[] | undefined) ?? [];
  } else {
    if (content.records !== undefined && (!Array.isArray(content.records) || content.records.some((record) => !record || typeof record !== "object" || Array.isArray(record)))) {
      throw new RunError("INVALID_SNAPSHOT", 400, "运行时文件内容不正确。");
    }
    virtualFile.records = (content.records as Array<Record<string, unknown>> | undefined) ?? [];
    if (content.recordType !== undefined && typeof content.recordType !== "string") throw new RunError("INVALID_SNAPSHOT", 400, "运行时文件内容不正确。");
    virtualFile.recordType = content.recordType as string | undefined;
  }
  return virtualFile;
}

async function consumeQuota(db: D1Database, userId: string, requestId: string): Promise<void> {
  const existing = await db.prepare("SELECT id FROM run_quota_ledger WHERE request_id = ?1 AND user_id = ?2")
    .bind(requestId, userId).first<{ id: string }>();
  if (existing) throw new RunError("RUN_ALREADY_REQUESTED", 409, "该运行请求已处理。");
  const now = Date.now();
  const policyWindow = String(Math.floor(now / RUN_WINDOW_MS));
  const count = await db.prepare("SELECT COUNT(*) AS count FROM run_quota_ledger WHERE user_id = ?1 AND policy_window = ?2")
    .bind(userId, policyWindow).first<{ count: number }>();
  if ((count?.count ?? 0) >= RUNS_PER_WINDOW) throw new RunError("SERVER_BUSY", 503, "服务器繁忙，请稍后再试。");
  await db.prepare(
    "INSERT INTO run_quota_ledger (id, user_id, request_id, policy_window, internal_reason, created_at) VALUES (?1, ?2, ?3, ?4, 'accepted', ?5)"
  ).bind(crypto.randomUUID(), userId, requestId, policyWindow, now).run();
}

function identifier(value: unknown, label: string): string {
  if (typeof value !== "string" || !/^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/.test(value)) {
    throw new RunError("INVALID_REQUEST", 400, label + "标识不正确。");
  }
  return value;
}

function stringValue(value: unknown, label: string, maxBytes: number): string {
  if (typeof value !== "string" || encoder.encode(value).byteLength > maxBytes) {
    throw new RunError("INVALID_REQUEST", 400, label + "不正确。");
  }
  return value;
}
