import type { AuthenticatedUser } from "./auth";

type ProjectRow = {
  id: string;
  owner_id: string;
  name: string;
  revision: number;
  deleted_at: number | null;
  created_at: number;
  updated_at: number;
};

type FileRow = {
  id: string;
  project_id: string;
  kind: "source" | "runtime";
  name: string;
  content: string;
  revision: number;
  content_hash: string;
  updated_by_device: string;
  deleted_at: number | null;
  created_at: number;
  updated_at: number;
};

type OperationRow = { entity: string };
type BytesRow = { bytes: number };
type CountRow = { count: number };

const textEncoder = new TextEncoder();
const MAX_PROJECT_NAME_LENGTH = 120;
const MAX_FILE_NAME_LENGTH = 180;
const MAX_FILE_BYTES = 256 * 1024;
const MAX_PROJECT_BYTES = 2 * 1024 * 1024;
const MAX_PROJECT_FILES = 200;
const STUDENT_MAX_PROJECTS = 10;
const STANDARD_MAX_PROJECTS = 50;
const STUDENT_MAX_ACCOUNT_BYTES = 5 * 1024 * 1024;
const STANDARD_MAX_ACCOUNT_BYTES = 20 * 1024 * 1024;
const SYNC_WRITE_WINDOW_MS = 15 * 60 * 1000;

export class SyncError extends Error {
  constructor(public readonly code: string, public readonly status: number, message: string, public readonly extra: Record<string, unknown> = {}) {
    super(message);
  }
}

export async function listProjects(db: D1Database, user: AuthenticatedUser) {
  const projects = await db.prepare(
    "SELECT id, owner_id, name, revision, deleted_at, created_at, updated_at FROM projects WHERE owner_id = ?1 ORDER BY created_at ASC"
  ).bind(user.id).all<ProjectRow>();
  const files = await db.prepare(
    `SELECT project_files.id, project_files.project_id, project_files.kind, project_files.name, project_files.content,
            project_files.revision, project_files.content_hash, project_files.updated_by_device, project_files.deleted_at,
            project_files.created_at, project_files.updated_at
       FROM project_files JOIN projects ON projects.id = project_files.project_id
      WHERE projects.owner_id = ?1
      ORDER BY project_files.created_at ASC`
  ).bind(user.id).all<FileRow>();
  const filesByProject = new Map<string, ReturnType<typeof publicFile>[]>();
  for (const file of files.results) {
    const group = filesByProject.get(file.project_id) ?? [];
    group.push(publicFile(file, true));
    filesByProject.set(file.project_id, group);
  }
  return projects.results.map((project) => ({ ...publicProject(project), files: filesByProject.get(project.id) ?? [] }));
}

export async function assertProjectOwner(db: D1Database, user: AuthenticatedUser, projectId: string): Promise<void> {
  await ownedProject(db, user, projectId, false);
}

export async function readFile(db: D1Database, user: AuthenticatedUser, projectId: string, fileId: string) {
  const project = await ownedProject(db, user, projectId, true);
  const file = await db.prepare(
    `SELECT id, project_id, kind, name, content, revision, content_hash, updated_by_device, deleted_at, created_at, updated_at
       FROM project_files WHERE id = ?1 AND project_id = ?2`
  ).bind(fileId, project.id).first<FileRow>();
  if (!file) throw new SyncError("NOT_FOUND", 404, "文件不存在。");
  return publicFile(file, true);
}

export async function writeProject(db: D1Database, user: AuthenticatedUser, projectId: string, input: unknown) {
  const body = objectBody(input);
  const entity = `project:${projectId}`;
  const operationId = operationIdOf(body.operationId);
  const expectedRevision = expectedRevisionOf(body.expectedRevision, true);
  const name = projectName(body.name);
  const duplicate = await priorOperation(db, user.id, operationId, entity);
  if (duplicate) {
    const current = await ownedProject(db, user, projectId, true);
    return { project: publicProject(current), idempotent: true };
  }

  const current = await projectById(db, projectId);
  const now = Date.now();
  if (!current) {
    if (expectedRevision !== null) throw new SyncError("SYNC_CONFLICT", 409, "项目版本已变化。", { server: null });
    await checkAccountProjectLimit(db, user);
    try {
      await db.batch([
        operationInsert(db, operationId, user.id, entity, now),
        db.prepare(
          "INSERT INTO projects (id, owner_id, name, revision, created_at, updated_at) VALUES (?1, ?2, ?3, 1, ?4, ?4)"
        ).bind(projectId, user.id, name, now)
      ]);
    } catch (caught) {
      throw mutationError(caught, user);
    }
    return { project: publicProject(await ownedProject(db, user, projectId, false)), idempotent: false };
  }
  if (current.owner_id !== user.id) throw new SyncError("NOT_FOUND", 404, "项目不存在。");
  if (current.deleted_at !== null) throw conflict("SYNC_CONFLICT", "项目已被删除。", publicProject(current));
  if (expectedRevision !== current.revision) throw conflict("SYNC_CONFLICT", "项目版本已变化。", publicProject(current));
  let results: D1Result<unknown>[];
  try {
    results = await db.batch([
      operationInsert(db, operationId, user.id, entity, now),
      db.prepare("UPDATE projects SET name = ?1, revision = revision + 1, updated_at = ?2 WHERE id = ?3 AND revision = ?4")
        .bind(name, now, projectId, expectedRevision)
    ]);
  } catch (caught) {
    throw mutationError(caught, user);
  }
  await ensureMutationApplied(results[1], () => conflict("SYNC_CONFLICT", "项目版本已变化。", publicProject(current)));
  return { project: publicProject(await ownedProject(db, user, projectId, false)), idempotent: false };
}

export async function deleteProject(db: D1Database, user: AuthenticatedUser, projectId: string, input: unknown) {
  const body = objectBody(input);
  const entity = `project:${projectId}`;
  const operationId = operationIdOf(body.operationId);
  const expectedRevision = expectedRevisionOf(body.expectedRevision, false);
  const duplicate = await priorOperation(db, user.id, operationId, entity);
  const current = await ownedProject(db, user, projectId, true);
  if (duplicate) return { project: publicProject(current), idempotent: true };
  if (current.deleted_at !== null) throw conflict("SYNC_CONFLICT", "项目已被删除。", publicProject(current));
  if (expectedRevision !== current.revision) throw conflict("SYNC_CONFLICT", "项目版本已变化。", publicProject(current));
  const now = Date.now();
  let results: D1Result<unknown>[];
  try {
    results = await db.batch([
      operationInsert(db, operationId, user.id, entity, now),
      db.prepare("UPDATE projects SET deleted_at = ?1, revision = revision + 1, updated_at = ?1 WHERE id = ?2 AND revision = ?3")
        .bind(now, projectId, expectedRevision)
    ]);
  } catch (caught) {
    throw mutationError(caught, user);
  }
  await ensureMutationApplied(results[1], async () => conflict("SYNC_CONFLICT", "项目版本已变化。", publicProject(await projectById(db, projectId) ?? current)));
  await reclaimProjectBytes(db, projectId);
  return { project: publicProject(await ownedProject(db, user, projectId, true)), idempotent: false };
}

export async function writeFile(db: D1Database, user: AuthenticatedUser, projectId: string, fileId: string, input: unknown) {
  const body = objectBody(input);
  const project = await ownedProject(db, user, projectId, false);
  const entity = `file:${projectId}:${fileId}`;
  const operationId = operationIdOf(body.operationId);
  const expectedRevision = expectedRevisionOf(body.expectedRevision, true);
  const kind = fileKind(body.kind);
  const name = fileName(body.name);
  const deviceId = deviceIdOf(body.deviceId);
  const content = serialiseContent(kind, body.content);
  const contentBytes = textEncoder.encode(content).byteLength;
  if (contentBytes > MAX_FILE_BYTES) throw new SyncError("FILE_TOO_LARGE", 413, "文件过大。", { maxBytes: MAX_FILE_BYTES });
  const duplicate = await priorOperation(db, user.id, operationId, entity);
  if (duplicate) {
    const current = await fileById(db, project.id, fileId);
    if (!current) throw new SyncError("OPERATION_ID_REUSED", 409, "同步操作无法重放。");
    return { file: publicFile(current, true), idempotent: true };
  }

  const current = await fileById(db, project.id, fileId);
  const sameName = await db.prepare(
    "SELECT id FROM project_files WHERE project_id = ?1 AND name = ?2 AND deleted_at IS NULL"
  ).bind(project.id, name).first<{ id: string }>();
  if (sameName && sameName.id !== fileId) throw new SyncError("NAME_CONFLICT", 409, "项目中已存在同名文件。", { fileId: sameName.id });
  await checkProjectLimits(db, project.id, current, contentBytes);
  await checkAccountStorageLimit(db, user, current, contentBytes);
  const now = Date.now();
  const contentHash = await sha256(content);

  if (!current) {
    if (expectedRevision !== null) throw new SyncError("SYNC_CONFLICT", 409, "文件版本已变化。", { server: null });
    try {
      await db.batch([
        operationInsert(db, operationId, user.id, entity, now),
        db.prepare(
          `INSERT INTO project_files (id, project_id, kind, name, content, revision, content_hash, updated_by_device, created_at, updated_at)
           VALUES (?1, ?2, ?3, ?4, ?5, 1, ?6, ?7, ?8, ?8)`
        ).bind(fileId, project.id, kind, name, content, contentHash, deviceId, now)
      ]);
    } catch (caught) {
      throw mutationError(caught, user);
    }
    return { file: publicFile(await requiredFile(db, project.id, fileId), true), idempotent: false };
  }
  if (current.deleted_at !== null) throw conflict("SYNC_CONFLICT", "文件已被删除。", publicFile(current, false));
  if (current.kind !== kind) throw conflict("SYNC_CONFLICT", "文件类型已变化。", publicFile(current, false));
  if (expectedRevision !== current.revision) throw conflict("SYNC_CONFLICT", "文件版本已变化。", publicFile(current, false));
  let results: D1Result<unknown>[];
  try {
    results = await db.batch([
      operationInsert(db, operationId, user.id, entity, now),
      db.prepare(
        `UPDATE project_files
            SET name = ?1, content = ?2, content_hash = ?3, updated_by_device = ?4,
                revision = revision + 1, updated_at = ?5
          WHERE id = ?6 AND project_id = ?7 AND revision = ?8 AND deleted_at IS NULL`
      ).bind(name, content, contentHash, deviceId, now, fileId, project.id, expectedRevision)
    ]);
  } catch (caught) {
    throw mutationError(caught, user);
  }
  await ensureMutationApplied(results[1], async () => conflict("SYNC_CONFLICT", "文件版本已变化。", publicFile(await requiredFile(db, project.id, fileId), false)));
  return { file: publicFile(await requiredFile(db, project.id, fileId), true), idempotent: false };
}

export async function deleteFile(db: D1Database, user: AuthenticatedUser, projectId: string, fileId: string, input: unknown) {
  const body = objectBody(input);
  const project = await ownedProject(db, user, projectId, false);
  const entity = `file:${projectId}:${fileId}`;
  const operationId = operationIdOf(body.operationId);
  const expectedRevision = expectedRevisionOf(body.expectedRevision, false);
  const deviceId = deviceIdOf(body.deviceId);
  const duplicate = await priorOperation(db, user.id, operationId, entity);
  const current = await requiredFile(db, project.id, fileId);
  if (duplicate) return { file: publicFile(current, false), idempotent: true };
  if (current.deleted_at !== null) throw conflict("SYNC_CONFLICT", "文件已被删除。", publicFile(current, false));
  if (expectedRevision !== current.revision) throw conflict("SYNC_CONFLICT", "文件版本已变化。", publicFile(current, false));
  const now = Date.now();
  let results: D1Result<unknown>[];
  try {
    results = await db.batch([
      operationInsert(db, operationId, user.id, entity, now),
      db.prepare(
        /*
         * 连内容一起清空。tombstone 只需要「这个 id 被删过」这件事——拉取时
         * 删除的文件本来就不返回 content（见 publicFile），也没有任何恢复接口。
         * 留着内容的后果是：它仍然占着 D1 的真实字节，却因为配额统计排除了
         * deleted_at 非空的行而不计入用量。传满→删掉→再传满可以无限循环，
         * 账户空间上限等于不存在。
         */
        `UPDATE project_files
            SET deleted_at = ?1, content = '', updated_by_device = ?2, revision = revision + 1, updated_at = ?1
          WHERE id = ?3 AND project_id = ?4 AND revision = ?5 AND deleted_at IS NULL`
      ).bind(now, deviceId, fileId, project.id, expectedRevision)
    ]);
  } catch (caught) {
    throw mutationError(caught, user);
  }
  await ensureMutationApplied(results[1], async () => conflict("SYNC_CONFLICT", "文件版本已变化。", publicFile(await requiredFile(db, project.id, fileId), false)));
  return { file: publicFile(await requiredFile(db, project.id, fileId), false), idempotent: false };
}

/*
 * 项目删除之后把它名下文件的内容清空。
 *
 * 为什么不放进删除那一批：`UPDATE project_files ... WHERE project_id = ?` 会**逐行**
 * 触发 0011 的写入限流（`BEFORE UPDATE OF content`），删一个 200 文件的项目就要吃掉
 * 200 次写配额；一旦撞上上限，触发器 ABORT 会把整个删除一起回滚——用户就再也删不掉
 * 那个项目了。删除是用户要的结果，不能因为回收字节而失败。
 *
 * 所以放在删除成功之后，并且**尽力而为**：失败就让字节先留着，不往上抛。留下来的
 * 那部分由 0012 那种一次性清理兜底。
 */
async function reclaimProjectBytes(db: D1Database, projectId: string): Promise<void> {
  try {
    await db.prepare("UPDATE project_files SET content = '' WHERE project_id = ?1 AND content <> ''")
      .bind(projectId).run();
  } catch {
    // 回收失败不影响删除本身
  }
}

function publicProject(project: ProjectRow) {
  return {
    id: project.id,
    name: project.name,
    revision: project.revision,
    deletedAt: project.deleted_at,
    createdAt: project.created_at,
    updatedAt: project.updated_at
  };
}

function publicFile(file: FileRow, includeContent: boolean) {
  return {
    id: file.id,
    projectId: file.project_id,
    kind: file.kind,
    name: file.name,
    revision: file.revision,
    contentHash: file.content_hash,
    updatedByDevice: file.updated_by_device,
    deletedAt: file.deleted_at,
    createdAt: file.created_at,
    updatedAt: file.updated_at,
    ...(includeContent && file.deleted_at === null ? { content: parseContent(file.kind, file.content) } : {})
  };
}

async function ownedProject(db: D1Database, user: AuthenticatedUser, projectId: string, includeDeleted: boolean): Promise<ProjectRow> {
  const project = await projectById(db, projectId);
  if (!project || project.owner_id !== user.id || (!includeDeleted && project.deleted_at !== null)) {
    throw new SyncError("NOT_FOUND", 404, "项目不存在。");
  }
  return project;
}

async function projectById(db: D1Database, projectId: string): Promise<ProjectRow | null> {
  validateId(projectId, "项目");
  return db.prepare(
    "SELECT id, owner_id, name, revision, deleted_at, created_at, updated_at FROM projects WHERE id = ?1"
  ).bind(projectId).first<ProjectRow>();
}

async function fileById(db: D1Database, projectId: string, fileId: string): Promise<FileRow | null> {
  validateId(fileId, "文件");
  return db.prepare(
    `SELECT id, project_id, kind, name, content, revision, content_hash, updated_by_device, deleted_at, created_at, updated_at
       FROM project_files WHERE id = ?1 AND project_id = ?2`
  ).bind(fileId, projectId).first<FileRow>();
}

async function requiredFile(db: D1Database, projectId: string, fileId: string): Promise<FileRow> {
  const file = await fileById(db, projectId, fileId);
  if (!file) throw new SyncError("NOT_FOUND", 404, "文件不存在。");
  return file;
}

async function priorOperation(db: D1Database, userId: string, operationId: string, entity: string): Promise<boolean> {
  const existing = await db.prepare(
    "SELECT entity FROM sync_operations WHERE operation_id = ?1 AND user_id = ?2"
  ).bind(operationId, userId).first<OperationRow>();
  if (!existing) return false;
  if (existing.entity !== entity) throw new SyncError("OPERATION_ID_REUSED", 409, "同步操作标识已用于其他变更。");
  return true;
}

function operationInsert(db: D1Database, operationId: string, userId: string, entity: string, now: number) {
  return db.prepare(
    "INSERT INTO sync_operations (operation_id, user_id, entity, created_at, processed_at) VALUES (?1, ?2, ?3, ?4, ?4)"
  ).bind(operationId, userId, entity, now);
}

/*
 * 这条语句到底改到目标行了没有。
 *
 * 判据是「至少改到一行」，**不能要求恰好等于 1**：0011 的写入限流触发器会在同一条
 * 语句里再往 `service_rate_limits` 写一行，D1 把触发器造成的写入也算进 `meta.changes`，
 * 于是每次 UPDATE 的 changes 都是 2。此前写成 `!== 1`，结果是**更新文件、删除文件、
 * 重命名项目、删除项目全部返回假的 SYNC_CONFLICT**——写入其实已经生效，客户端却当成
 * 冲突去建云端副本。
 *
 * 反过来，真冲突时一行都匹配不上：UPDATE 的 WHERE 带着 revision 守卫，没匹配到行
 * 时 BEFORE UPDATE 触发器根本不会触发，changes 就是 0。所以 `< 1` 既挡得住真冲突，
 * 又不会被触发器的额外写入误伤。
 */
async function ensureMutationApplied(result: D1Result<unknown>, onConflict: () => SyncError | Promise<SyncError>): Promise<void> {
  if (!result.meta || (result.meta.changes ?? 0) < 1) throw await onConflict();
}

async function checkProjectLimits(db: D1Database, projectId: string, current: FileRow | null, nextBytes: number): Promise<void> {
  if (!current) {
    const count = await db.prepare("SELECT COUNT(*) AS count FROM project_files WHERE project_id = ?1 AND deleted_at IS NULL")
      .bind(projectId).first<CountRow>();
    if ((count?.count ?? 0) >= MAX_PROJECT_FILES) throw new SyncError("PROJECT_FILE_LIMIT", 413, "项目文件数量已达到上限。");
  }
  const total = await db.prepare(
    "SELECT COALESCE(SUM(length(CAST(content AS BLOB))), 0) AS bytes FROM project_files WHERE project_id = ?1 AND deleted_at IS NULL"
  ).bind(projectId).first<BytesRow>();
  const previousBytes = current && current.deleted_at === null ? textEncoder.encode(current.content).byteLength : 0;
  if ((total?.bytes ?? 0) - previousBytes + nextBytes > MAX_PROJECT_BYTES) {
    throw new SyncError("PROJECT_TOO_LARGE", 413, "项目内容超过大小上限。", { maxBytes: MAX_PROJECT_BYTES });
  }
}

function accountLimits(user: AuthenticatedUser): { maxProjects: number; maxBytes: number } {
  return user.role === "student"
    ? { maxProjects: STUDENT_MAX_PROJECTS, maxBytes: STUDENT_MAX_ACCOUNT_BYTES }
    : { maxProjects: STANDARD_MAX_PROJECTS, maxBytes: STANDARD_MAX_ACCOUNT_BYTES };
}

async function checkAccountProjectLimit(db: D1Database, user: AuthenticatedUser): Promise<void> {
  const limits = accountLimits(user);
  const row = await db.prepare("SELECT COUNT(*) AS count FROM projects WHERE owner_id = ?1 AND deleted_at IS NULL")
    .bind(user.id).first<CountRow>();
  if ((row?.count ?? 0) >= limits.maxProjects) {
    throw new SyncError("ACCOUNT_PROJECT_LIMIT", 413, "云端项目数已达到上限。", { maxProjects: limits.maxProjects });
  }
}

async function checkAccountStorageLimit(
  db: D1Database, user: AuthenticatedUser, current: FileRow | null, nextBytes: number
): Promise<void> {
  const limits = accountLimits(user);
  const total = await db.prepare(
    `SELECT COALESCE(SUM(length(CAST(project_files.content AS BLOB))), 0) AS bytes
       FROM project_files JOIN projects ON projects.id = project_files.project_id
      WHERE projects.owner_id = ?1 AND projects.deleted_at IS NULL AND project_files.deleted_at IS NULL`
  ).bind(user.id).first<BytesRow>();
  const previousBytes = current && current.deleted_at === null ? textEncoder.encode(current.content).byteLength : 0;
  if ((total?.bytes ?? 0) - previousBytes + nextBytes > limits.maxBytes) {
    throw new SyncError("ACCOUNT_STORAGE_LIMIT", 413, "云端空间已满。", { maxBytes: limits.maxBytes });
  }
}

function mutationError(caught: unknown, user: AuthenticatedUser): SyncError {
  const message = caught instanceof Error ? caught.message : "";
  const limits = accountLimits(user);
  if (message.includes("SYNC_WRITE_THROTTLED")) {
    return new SyncError(
      "SYNC_WRITE_THROTTLED", 429, "云端同步过于频繁，请稍后自动重试。",
      { retryAfterSeconds: syncRetryAfterSeconds() }
    );
  }
  if (message.includes("ACCOUNT_PROJECT_LIMIT")) {
    return new SyncError("ACCOUNT_PROJECT_LIMIT", 413, "云端项目数已达到上限。", { maxProjects: limits.maxProjects });
  }
  if (message.includes("ACCOUNT_STORAGE_LIMIT")) {
    return new SyncError("ACCOUNT_STORAGE_LIMIT", 413, "云端空间已满。", { maxBytes: limits.maxBytes });
  }
  if (caught instanceof Error) throw caught;
  throw new SyncError("SERVER_DATA_INVALID", 500, "云端数据未保存。");
}

function syncRetryAfterSeconds(): number {
  const now = Date.now();
  const windowEnds = (Math.floor(now / SYNC_WRITE_WINDOW_MS) + 1) * SYNC_WRITE_WINDOW_MS;
  return Math.max(1, Math.ceil((windowEnds - now) / 1000));
}

function objectBody(input: unknown): Record<string, unknown> {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new SyncError("INVALID_REQUEST", 400, "请求内容不正确。");
  return input as Record<string, unknown>;
}

function expectedRevisionOf(value: unknown, mayCreate: boolean): number | null {
  if (mayCreate && (value === null || value === undefined)) return null;
  if (!Number.isSafeInteger(value) || (value as number) < 1) throw new SyncError("INVALID_REVISION", 400, "版本号不正确。");
  return value as number;
}

function operationIdOf(value: unknown): string {
  return identifier(value, "同步操作");
}

function deviceIdOf(value: unknown): string {
  return identifier(value, "设备");
}

function validateId(value: string, label: string): void {
  if (!/^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/.test(value)) throw new SyncError("INVALID_ID", 400, `${label}标识不正确。`);
}

function identifier(value: unknown, label: string): string {
  if (typeof value !== "string") throw new SyncError("INVALID_REQUEST", 400, `${label}标识不正确。`);
  validateId(value, label);
  return value;
}

function projectName(value: unknown): string {
  if (typeof value !== "string") throw new SyncError("INVALID_PROJECT_NAME", 400, "项目名称不正确。");
  const name = value.trim();
  if (!name || name.length > MAX_PROJECT_NAME_LENGTH) throw new SyncError("INVALID_PROJECT_NAME", 400, "项目名称不正确。");
  return name;
}

function fileName(value: unknown): string {
  if (typeof value !== "string") throw new SyncError("INVALID_FILE_NAME", 400, "文件名称不正确。");
  const name = value.trim();
  if (!name || name.length > MAX_FILE_NAME_LENGTH || /[\\/\u0000]/.test(name)) throw new SyncError("INVALID_FILE_NAME", 400, "文件名称不正确。");
  return name;
}

function fileKind(value: unknown): "source" | "runtime" {
  if (value === "source" || value === "runtime") return value;
  throw new SyncError("INVALID_FILE_KIND", 400, "文件类型不正确。");
}

function serialiseContent(kind: "source" | "runtime", value: unknown): string {
  if (kind === "source") {
    if (typeof value !== "string") throw new SyncError("INVALID_FILE_CONTENT", 400, "代码文件内容不正确。");
    return value;
  }
  try {
    const serialised = JSON.stringify(value);
    if (serialised === undefined) throw new Error("undefined");
    return serialised;
  } catch {
    throw new SyncError("INVALID_FILE_CONTENT", 400, "运行时文件内容不正确。");
  }
}

function parseContent(kind: "source" | "runtime", content: string): unknown {
  if (kind === "source") return content;
  try {
    return JSON.parse(content);
  } catch {
    throw new SyncError("SERVER_DATA_INVALID", 500, "服务器文件数据不正确。");
  }
}

async function sha256(value: string): Promise<string> {
  const bytes = await crypto.subtle.digest("SHA-256", textEncoder.encode(value));
  return [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function conflict(code: string, message: string, server: unknown): SyncError {
  return new SyncError(code, 409, message, { server });
}
