import { readFileSync, readdirSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { activateStudent, createPendingStudent, startEmailRegistration, verifyEmailLogin } from "../server/src/auth";

// 真正的 SQLite + 全部迁移；两个调用会在首次 await 前读到同一份未消费行。
// 这样检查的是并发消费的结果，而不是源码里有没有某个 SQL 字符串。
function d1(raw: DatabaseSync): D1Database {
  const statement = (sql: string, args: unknown[] = []) => ({
    bind: (...next: unknown[]) => statement(sql, next),
    first: async () => raw.prepare(sql).get(...(args as never[])) ?? null,
    execute: () => {
      const result = raw.prepare(sql).run(...(args as never[]));
      return { success: true, meta: { changes: Number(result.changes) } };
    },
    run: async () => statement(sql, args).execute()
  });
  return {
    prepare: (sql: string) => statement(sql),
    batch: async (statements: Array<ReturnType<typeof statement>>) => {
      raw.exec("BEGIN");
      try {
        const result = [];
        for (const item of statements) result.push(item.execute());
        raw.exec("COMMIT");
        return result;
      } catch (error) { raw.exec("ROLLBACK"); throw error; }
    }
  } as unknown as D1Database;
}

let raw: DatabaseSync;
let db: D1Database;
const env = { ENVIRONMENT: "development" } as Env;
const password = "Only-for-local-tests-42";
beforeEach(() => {
  raw = new DatabaseSync(":memory:");
  raw.exec("PRAGMA foreign_keys = ON");
  const dir = new URL("../server/migrations/", import.meta.url);
  for (const file of readdirSync(dir).filter((name) => name.endsWith(".sql")).sort()) {
    raw.exec(readFileSync(new URL(file, dir), "utf8"));
  }
  db = d1(raw);
});
afterEach(() => { raw.close(); vi.restoreAllMocks(); });

async function emailInput() {
  const result = await startEmailRegistration(db, env, {
    email: "one-time@example.test", role: "learner", password
  }, "local-test");
  return { token: result.developmentToken! };
}

async function studentInput() {
  const result = await createPendingStudent(db, "one-time-student");
  return { username: result.user.username, activationCode: result.activationCode, password };
}

describe.each([
  ["email", emailInput, (input: unknown) => verifyEmailLogin(db, env, input), "INVALID_TOKEN"],
  ["student", studentInput, (input: unknown) => activateStudent(db, env, input), "INVALID_ACTIVATION_CODE"]
] as const)("一次性凭据：%s", (_label, makeInput, consume, code) => {
  it("两个并发请求只能有一个建立会话；重放不能重置密码或撤销已有会话", async () => {
    const input = await makeInput();
    const results = await Promise.allSettled([consume(input), consume(input)]);
    expect(results.filter((result) => result.status === "fulfilled")).toHaveLength(1);
    const loser = results.find((result) => result.status === "rejected") as PromiseRejectedResult;
    expect(loser.reason.code).toBe(code);
    const before = raw.prepare("SELECT password_hash, password_salt FROM users").get();
    expect(raw.prepare("SELECT COUNT(*) AS count FROM sessions").get()?.count).toBe(1);
    await expect(consume(input)).rejects.toMatchObject({ code });
    expect(raw.prepare("SELECT password_hash, password_salt FROM users").get()).toEqual(before);
    expect(raw.prepare("SELECT COUNT(*) AS count FROM sessions").get()?.count).toBe(1);
  });

  it("过期凭据不能修改密码或建立会话", async () => {
    const input = await makeInput();
    raw.exec("UPDATE auth_tokens SET expires_at = 0");
    await expect(consume(input)).rejects.toMatchObject({ code });
    expect(raw.prepare("SELECT COUNT(*) AS count FROM sessions").get()?.count).toBe(0);
    expect(raw.prepare("SELECT password_hash FROM users").get()?.password_hash).toBeNull();
  });

  it("认领后的数据库故障不会重新开放凭据，仍可通过重发恢复", async () => {
    const input = await makeInput();
    const batch = db.batch.bind(db);
    vi.spyOn(db, "batch").mockRejectedValueOnce(new Error("local injected failure"));
    await expect(consume(input)).rejects.toThrow("local injected failure");
    vi.mocked(db.batch).mockImplementation(batch);
    await expect(consume(input)).rejects.toMatchObject({ code });
    expect(raw.prepare("SELECT COUNT(*) AS count FROM sessions").get()?.count).toBe(0);
    expect(raw.prepare("SELECT password_hash FROM users").get()?.password_hash).toBeNull();
    // 失败保持 pending，管理员重发激活码或邮箱重新注册都有可控恢复出口。
    expect(raw.prepare("SELECT status FROM users").get()?.status).toMatch(/^pending_/);
  });
});

it("邮件错误日志只记录状态，不记录提供方可能回显的请求信息", async () => {
  const log = vi.spyOn(console, "error").mockImplementation(() => {});
  const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(
    JSON.stringify({ message: "Recipient recipient@example.test was rejected" }), { status: 422 }
  ));
  await expect(startEmailRegistration(db, {
    ENVIRONMENT: "production", RESEND_API_KEY: "local-test-placeholder",
    EMAIL_FROM: "noreply@example.test", APP_ORIGIN: "https://example.test"
  } as Env, { email: "one-time@example.test", role: "learner", password }, "local-test")).rejects.toMatchObject({ code: "EMAIL_DELIVERY_FAILED" });
  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(log.mock.calls).toEqual([["resend.send_failed", JSON.stringify({ status: 422 })]]);
});
