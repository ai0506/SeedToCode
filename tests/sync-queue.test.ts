import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { describe, expect, it } from "vitest";

const source = readFileSync(fileURLToPath(new URL("../web/js/sync-queue.js", import.meta.url)), "utf8");
const engineSource = readFileSync(fileURLToPath(new URL("../web/js/sync-engine.js", import.meta.url)), "utf8");

type Operation = { operationId: string; generation: number; state: string; payload: { source?: string } };
type Queue = {
  bind(userId: string): void;
  enqueue(kind: string, entity: string, payload: Record<string, unknown>): Operation;
  markInFlight(operationId: string): void;
  block(operationId: string, code: string, message: string): void;
  list(): Operation[];
  blocked(): unknown[];
  next(now?: number): Operation | null;
  size(): number;
};

function loadQueue(initial: unknown = null) {
  let stored = initial;
  let sequence = 0;
  const window = {
    CAIEStorage: {
      key: { syncQueue: "sync-queue" },
      get: () => stored,
      set: (_key: string, value: unknown) => { stored = value; }
    }
  };
  vm.runInNewContext(source, {
    window,
    crypto: { randomUUID: () => `operation-${++sequence}` },
    Date,
    Math,
    Number,
    Object,
    Array,
    String,
    Boolean,
    JSON,
    console
  });
  return { queue: (window as unknown as { SyncQueue: Queue }).SyncQueue, stored: () => stored };
}

function startEngine(storage: Record<string, unknown>, userId: string) {
  let sequence = 0;
  const window = {
    CAIEStorage: {
      key: { syncQueue: "sync-queue", syncMeta: "sync-meta" },
      get: (key: string, fallback: unknown) => storage[key] ?? fallback,
      set: (key: string, value: unknown) => { storage[key] = value; }
    },
    AuthStore: { isSignedIn: () => true, userId: () => userId },
    CloudClient: { available: () => true },
    addEventListener: () => undefined
  };
  const context = {
    window,
    crypto: { randomUUID: () => `operation-${++sequence}` },
    Date,
    Math,
    Number,
    Object,
    Array,
    String,
    Boolean,
    JSON,
    console,
    setTimeout: () => 1,
    clearTimeout: () => undefined
  };
  vm.runInNewContext(source, context);
  vm.runInNewContext(engineSource, context);
  (window as unknown as { SyncEngine: { start(): void } }).SyncEngine.start();
}

describe("SyncQueue v2", () => {
  it("迁移 v1 队列并在账号 A → B → A 时保留各自 outbox", () => {
    const { queue, stored } = loadQueue({
      schemaVersion: 1,
      userId: "user-a",
      operations: [{ operationId: "legacy-op", kind: "file.put", entity: "file:p:f", payload: {}, attempts: 0, createdAt: 1, nextAttemptAt: 0 }],
      blocked: []
    });

    queue.bind("user-a");
    expect(queue.list()).toHaveLength(1);
    expect(queue.list()[0]).toMatchObject({ ownerId: "user-a", generation: 1, state: "queued" });

    queue.bind("user-b");
    queue.enqueue("project.put", "project:new", { projectId: "new" });
    expect(queue.list()).toHaveLength(1);

    queue.bind("user-a");
    expect(queue.list()).toHaveLength(1);
    expect(queue.list()[0].operationId).toBe("legacy-op");
    expect(stored()).toMatchObject({ schemaVersion: 2, buckets: { "user-a": expect.any(Object), "user-b": expect.any(Object) } });
  });

  it("发送中的旧 generation 失败时不会阻塞更新后的本地状态", () => {
    const { queue } = loadQueue();
    queue.bind("user-a");
    const oldOperation = queue.enqueue("file.put", "file:p:f", { projectId: "p", fileId: "f" });
    queue.markInFlight(oldOperation.operationId);
    const currentOperation = queue.enqueue("file.put", "file:p:f", { projectId: "p", fileId: "f" });

    queue.block(oldOperation.operationId, "NAME_CONFLICT", "旧请求失败");

    expect(queue.blocked()).toEqual([]);
    expect(queue.list()).toHaveLength(1);
    expect(queue.list()[0]).toMatchObject({ operationId: currentOperation.operationId, generation: 2, state: "queued" });
  });

  it("不可变提交不因同一实体或旧容量而被折叠、截断", () => {
    const { queue } = loadQueue();
    queue.bind("student-a");
    queue.enqueue("submission.post", "submission:lesson", { source: "first" });
    queue.enqueue("submission.post", "submission:lesson", { source: "second" });
    for (let index = 0; index < 2000; index += 1) {
      queue.enqueue("assignment.post", `assignment:${index}`, { source: String(index) });
    }

    expect(queue.size()).toBe(2002);
    expect(queue.list().slice(0, 2).map((operation) => operation.payload.source)).toEqual(["first", "second"]);
  });

  it("刷新后会安全重放尚在飞行的同一 operationId", () => {
    const first = loadQueue();
    first.queue.bind("user-a");
    const operation = first.queue.enqueue("project.put", "project:p", { projectId: "p" });
    first.queue.markInFlight(operation.operationId);

    const reloaded = loadQueue(first.stored());
    reloaded.queue.bind("user-a");
    expect(reloaded.queue.next(0)).toMatchObject({ operationId: operation.operationId, state: "queued" });
  });

  it("同步 metadata 与队列一样按账号分桶，A 回来时保留 revision 映射", () => {
    const storage: Record<string, unknown> = {
      "sync-meta": {
        schemaVersion: 1,
        userId: "user-a",
        projects: { localProject: { serverId: "server-a", revision: 7, name: "A 的项目" } },
        files: {},
        teaching: { progress: {}, drafts: {}, position: null },
        hold: { previousOwner: null, asked: false, projects: {}, files: {}, progress: {}, drafts: {} },
        lastPullAt: 0
      }
    };

    startEngine(storage, "user-a");
    startEngine(storage, "user-b");
    startEngine(storage, "user-a");

    const meta = storage["sync-meta"] as { schemaVersion: number; buckets: Record<string, { projects: Record<string, { revision: number }> }> };
    expect(meta.schemaVersion).toBe(2);
    expect(meta.buckets["user:user-a"].projects.localProject.revision).toBe(7);
    expect(meta.buckets["user:user-b"]).toBeDefined();
  });
});
