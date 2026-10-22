import { readFileSync, readdirSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { afterEach, beforeEach, expect, it } from "vitest";
import { runSnapshot } from "../server/src/run";

let raw: DatabaseSync;
let db: D1Database;
const owner = { id: "local-owner", role: "learner" as const, email: null, username: null };
beforeEach(() => {
  raw = new DatabaseSync(":memory:");
  raw.exec("PRAGMA foreign_keys = ON");
  const dir = new URL("../server/migrations/", import.meta.url);
  for (const file of readdirSync(dir).filter((name) => name.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(file, dir), "utf8"));
  raw.prepare("INSERT INTO users(id, role, status, created_at, updated_at) VALUES (?, 'learner', 'active', 0, 0)").run(owner.id);
  raw.prepare("INSERT INTO projects(id, owner_id, name, created_at, updated_at) VALUES ('local-project', ?, 'Local test', 0, 0)").run(owner.id);
  const statement = (sql: string, args: unknown[] = []) => ({
    bind: (...next: unknown[]) => statement(sql, next),
    first: async () => raw.prepare(sql).get(...(args as never[])) ?? null,
    run: async () => {
      const result = raw.prepare(sql).run(...(args as never[]));
      return { success: true, meta: { changes: Number(result.changes) } };
    }
  });
  db = { prepare: (sql: string) => statement(sql) } as unknown as D1Database;
});
afterEach(() => raw.close());

function request(id: string) {
  return { projectId: "local-project", requestId: id, runtimeVersion: "local-test", inputs: [],
    snapshot: { entryFileId: "main", files: [{ id: "main", kind: "source", name: "Main.pseudocode", content: 'OUTPUT "snapshot"' }] } };
}

it("51 个并发请求只接纳 50 个，每个成功结果来自请求快照", async () => {
  const results = await Promise.allSettled(Array.from({ length: 51 }, (_, i) => runSnapshot(db, owner, request("request-" + i))));
  const accepted = results.filter((result) => result.status === "fulfilled") as PromiseFulfilledResult<Awaited<ReturnType<typeof runSnapshot>>>[];
  const rejected = results.filter((result) => result.status === "rejected") as PromiseRejectedResult[];
  expect(accepted).toHaveLength(50);
  expect(rejected).toHaveLength(1);
  expect(rejected[0].reason.code).toBe("SERVER_BUSY");
  expect(raw.prepare("SELECT COUNT(*) AS count FROM run_quota_ledger").get()?.count).toBe(50);
  for (const result of accepted) {
    expect(result.value.status).toBe("completed");
    expect(result.value.outputs).toEqual(["snapshot"]);
  }
});

it("相同 requestId 的并发重放只运行一次", async () => {
  const results = await Promise.allSettled([runSnapshot(db, owner, request("same")), runSnapshot(db, owner, request("same"))]);
  expect(results.filter((result) => result.status === "fulfilled")).toHaveLength(1);
  const rejected = results.find((result) => result.status === "rejected") as PromiseRejectedResult;
  expect(rejected.reason.code).toBe("RUN_ALREADY_REQUESTED");
  expect(raw.prepare("SELECT COUNT(*) AS count FROM run_quota_ledger").get()?.count).toBe(1);
});

it("其他账号不能执行别人的项目，拒绝发生在记账之前", async () => {
  await expect(runSnapshot(db, { ...owner, id: "another-account" }, request("forbidden"))).rejects.toMatchObject({ status: 404 });
  expect(raw.prepare("SELECT COUNT(*) AS count FROM run_quota_ledger").get()?.count).toBe(0);
});
