/*
 * 学习助理底座（server/src/ai.ts）在真实迁移上的行为。
 *
 * D1 就是 SQLite，所以这里用 Node 自带的 node:sqlite 开一个内存库，依次执行
 * server/migrations 下全部真实迁移，再用一层很薄的适配把它包成 D1 的接口，
 * 直接调用 ai.ts 里真正的函数——测的是线上会执行的那几条 SQL，不是另抄一份。
 *
 * 并发：D1 的写入是串行的，单条语句原子。所以「两笔各自放得下、合起来超额」
 * 依次执行，第二笔必须被拒，就足以说明上限检查和写入在同一条语句里；
 * 如果有人把它改回「先查再插」，这里的若干用例会照样过——那一类回归要靠
 * 代码评审和以后接口上线时在 wrangler dev 上的并发实测，这里不冒充能测到。
 */
import { readFileSync, readdirSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { beforeEach, describe, expect, it } from "vitest";
import { PRICE_TABLES, windowAt, type PriceTable } from "../packages/ai-quota/dist/index.js";
import {
  AiError,
  PRIVACY_POLICY_VERSION,
  STALE_RESERVATION_MS,
  aiStatus,
  recordConsent,
  releaseUsage,
  reserveUsage,
  setClassAi,
  settleUsage
} from "../server/src/ai";

/* ---------------- node:sqlite → D1 的最小适配 ---------------- */

type Row = Record<string, unknown>;

function d1(db: DatabaseSync): D1Database {
  const statement = (sql: string, args: unknown[] = []) => ({
    bind: (...next: unknown[]) => statement(sql, next),
    first: async <T>() => ((db.prepare(sql).get(...(args as never[])) as T | undefined) ?? null),
    all: async <T>() => ({ results: db.prepare(sql).all(...(args as never[])) as T[], success: true, meta: {} }),
    run: async () => {
      const result = db.prepare(sql).run(...(args as never[]));
      return { success: true, meta: { changes: Number(result.changes) } };
    }
  });
  return { prepare: (sql: string) => statement(sql) } as unknown as D1Database;
}

function freshDatabase(): DatabaseSync {
  const db = new DatabaseSync(":memory:");
  db.exec("PRAGMA foreign_keys = ON");
  const dir = new URL("../server/migrations/", import.meta.url);
  for (const file of readdirSync(dir).filter((name) => name.endsWith(".sql")).sort()) {
    db.exec(readFileSync(new URL(file, dir), "utf8"));
  }
  return db;
}

/* ---------------- 夹具 ---------------- */

/* 价目表在 packages/ai-quota 里是空的（提供方未定）。测试临时放一张整数价的表：
   每个输入 / 输出 token 记 1 微元，非高峰不打折——这样预留额就等于 token 数，断言好读。 */
const TABLE: PriceTable = {
  version: "test-1", model: "test-model",
  inputCacheHitPerMillion: 1, inputCacheMissPerMillion: 1, outputPerMillion: 1, offPeakFactor: 1
};

/** 上海时间 2026-10-22（周四）10:00，落在 06:00–14:00 那一段。 */
const AT = Date.UTC(2026, 9, 22, 2);

const teacher = { id: "u-teacher", role: "teacher" as const, email: "t@example.test", username: null };
const otherTeacher = { id: "u-teacher2", role: "teacher" as const, email: "t2@example.test", username: null };
const learner = { id: "u-learner", role: "learner" as const, email: "l@example.test", username: null };
const learner2 = { id: "u-learner2", role: "learner" as const, email: "l2@example.test", username: null };
const s1 = { id: "u-s1", role: "student" as const, email: null, username: "s1" };
const s2 = { id: "u-s2", role: "student" as const, email: null, username: "s2" };

let raw: DatabaseSync;
let db: D1Database;

function config(values: Record<string, string>) {
  const stmt = raw.prepare("INSERT INTO service_config (key, value, updated_at) VALUES (?1, ?2, 0) ON CONFLICT(key) DO UPDATE SET value = excluded.value");
  for (const [key, value] of Object.entries(values)) stmt.run(key, value);
}

const FULL_CONFIG = {
  ai_enabled: "1",
  ai_model: "test-model",
  ai_budget_global_daily: "1000000",
  ai_budget_global_monthly: "10000000",
  ai_budget_learner_window: "1000",
  ai_budget_teacher_window: "2000",
  ai_budget_pool_per_student_window: "1000",
  ai_budget_student_window_max: "100000"
};

/** 预留 `units` 微元（测试价目表下 1 token = 1 微元）：输入 units-1、输出 1，两者都必须为正。 */
const reserve = (user: typeof learner | typeof s1 | typeof teacher, id: string, units: number, at = AT) =>
  reserveUsage(db, user, { requestId: "req-" + id + "-0000", mode: "concept", promptTokensUpperBound: units - 1, maxCompletionTokens: 1 }, at);

async function rejection(promise: Promise<unknown>): Promise<AiError> {
  try {
    await promise;
  } catch (caught) {
    if (caught instanceof AiError) return caught;
    throw caught;
  }
  throw new Error("应该被拒，却放行了");
}

beforeEach(() => {
  PRICE_TABLES[TABLE.model] = TABLE;
  raw = freshDatabase();
  db = d1(raw);
  const user = raw.prepare("INSERT INTO users (id, email, username, role, status, created_at, updated_at, password_hash, password_salt) VALUES (?1, ?2, ?3, ?4, 'active', 0, 0, 'h', 's')");
  for (const u of [teacher, otherTeacher, learner, learner2, s1, s2]) user.run(u.id, u.email, u.username, u.role);
  raw.prepare("INSERT INTO classes (id, teacher_id, name, join_code, created_at, updated_at) VALUES ('c1', 'u-teacher', '一班', 'ABC123', 0, 0)").run();
  const member = raw.prepare("INSERT INTO class_members (class_id, user_id, display_name, status, created_at) VALUES ('c1', ?1, ?2, 'active', 0)");
  member.run(s1.id, "甲");
  member.run(s2.id, "乙");
});

/* ---------------- 迁移与默认值 ---------------- */

describe("迁移 0014：默认全部关着", () => {
  it("总开关显式写成 0，额度一行都没有", () => {
    const rows = raw.prepare("SELECT key, value FROM service_config WHERE key LIKE 'ai_%' ORDER BY key").all() as Row[];
    expect(rows).toEqual([{ key: "ai_enabled", value: "0" }]);
  });

  it("新班级默认没有打开学习助理", () => {
    expect((raw.prepare("SELECT ai_enabled_at FROM classes WHERE id = 'c1'").get() as Row).ai_enabled_at).toBeNull();
  });

  it("隐私政策版本常量与 web/privacy.html 的 meta 一致", () => {
    const html = readFileSync(new URL("../web/privacy.html", import.meta.url), "utf8");
    const meta = html.match(/<meta name="seedtocode-privacy-version" content="(\d+)">/);
    expect(Number(meta![1])).toBe(PRIVACY_POLICY_VERSION);
  });
});

describe("门禁：缺任何一样都不可用，而不是放开", () => {
  it("迁移之后：总开关关着", async () => {
    expect((await aiStatus(db, learner, AT)).reason).toBe("disabled");
  });

  it("总开关打开，但额度缺行：未配置", async () => {
    config({ ai_enabled: "1", ai_model: "test-model" });
    expect((await aiStatus(db, learner, AT)).reason).toBe("not_configured");
  });

  it("额度齐了，但价目表里没有这个模型：未配置", async () => {
    config({ ...FULL_CONFIG, ai_model: "no-such-model" });
    expect((await aiStatus(db, learner, AT)).reason).toBe("not_configured");
  });

  it("额度写成非法值（0、小数、空串）等同缺行", async () => {
    for (const bad of ["0", "1.5", ""]) {
      config({ ...FULL_CONFIG, ai_budget_learner_window: bad });
      expect((await aiStatus(db, learner, AT)).reason, bad).toBe("not_configured");
    }
  });

  it("总开关只认 '1'：缺行、'true'、'yes' 都是关", async () => {
    config({ ...FULL_CONFIG });
    raw.prepare("DELETE FROM service_config WHERE key = 'ai_enabled'").run();
    expect((await aiStatus(db, learner, AT)).reason).toBe("disabled");
    for (const value of ["true", "yes", "on"]) {
      config({ ai_enabled: value });
      expect((await aiStatus(db, learner, AT)).reason, value).toBe("disabled");
    }
  });

  it("预留走同一道门禁：界面说不可用的，接口也放不进去", async () => {
    const error = await rejection(reserve(learner, "a", 10));
    expect(error.extra.reason).toBe("disabled");
  });
});

/* ---------------- 同意 ---------------- */

describe("同意记录", () => {
  it("总开关关着时不收同意：在 AI 上线之前，这张表必须是空的", async () => {
    const error = await rejection(recordConsent(db, learner, { policyVersion: PRIVACY_POLICY_VERSION, statement: "adult_or_guardian" }));
    expect(error.extra.reason).toBe("disabled");
    expect(raw.prepare("SELECT COUNT(*) AS n FROM ai_consents").get()).toEqual({ n: 0 });
  });

  describe("总开关打开之后", () => {
  beforeEach(() => config(FULL_CONFIG));

  it("没同意时不可用，同意之后可用", async () => {
    expect((await aiStatus(db, learner, AT)).reason).toBe("consent_required");
    expect((await rejection(reserve(learner, "a", 10))).extra.reason).toBe("consent_required");
    await recordConsent(db, learner, { policyVersion: PRIVACY_POLICY_VERSION, statement: "adult_or_guardian" }, AT);
    const status = await aiStatus(db, learner, AT);
    expect(status.available).toBe(true);
    expect(status.consented).toBe(true);
  });

  it("带着旧版本号来同意：拒绝，并告诉客户端现在是哪一版", async () => {
    const error = await rejection(recordConsent(db, learner, { policyVersion: PRIVACY_POLICY_VERSION - 1, statement: "adult_or_guardian" }));
    expect(error.code).toBe("POLICY_CHANGED");
    expect(error.extra.policyVersion).toBe(PRIVACY_POLICY_VERSION);
  });

  it("声明只有一种；别的内容不收", async () => {
    for (const statement of ["adult", "", undefined]) {
      expect((await rejection(recordConsent(db, learner, { policyVersion: PRIVACY_POLICY_VERSION, statement }))).code).toBe("INVALID_REQUEST");
    }
  });

  it("同一版本重复同意不报错，也只留一条", async () => {
    const body = { policyVersion: PRIVACY_POLICY_VERSION, statement: "adult_or_guardian" };
    await recordConsent(db, learner, body, AT);
    await recordConsent(db, learner, body, AT + 1);
    expect(raw.prepare("SELECT COUNT(*) AS n FROM ai_consents").get()).toEqual({ n: 1 });
  });

  it("同意只记版本、声明和时间，不记年龄", () => {
    const columns = (raw.prepare("PRAGMA table_info(ai_consents)").all() as Row[]).map((c) => c.name);
    expect(columns).toEqual(["user_id", "policy_version", "statement", "consented_at"]);
  });
  });
});

/* ---------------- 个人额度与原子预留 ---------------- */

describe("个人学习者的窗口额度", () => {
  beforeEach(async () => {
    config(FULL_CONFIG);
    for (const u of [learner, learner2, teacher, s1, s2]) {
      await recordConsent(db, u, { policyVersion: PRIVACY_POLICY_VERSION, statement: "adult_or_guardian" }, AT);
    }
  });

  it("预留额按最坏情况：输入全按未命中、输出按上限", async () => {
    const reserved = await reserveUsage(db, learner, { requestId: "req-a-0000", mode: "concept", promptTokensUpperBound: 300, maxCompletionTokens: 200 }, AT);
    expect(reserved.reservedUnits).toBe(500);
  });

  it("两笔各自放得下、合起来超额：第二笔被拒（上限 1000）", async () => {
    await reserve(learner, "a", 600);
    const error = await rejection(reserve(learner, "b", 500));
    expect(error.status).toBe(429);
    expect(error.extra.reason).toBe("exhausted");
    expect(error.extra.nextWindowAt).toBe(windowAt(AT).endsAt);
  });

  it("正好用满可以，多一个微元不行", async () => {
    await reserve(learner, "a", 998);
    await expect(reserve(learner, "b", 3)).rejects.toBeInstanceOf(AiError);
    await expect(reserve(learner, "c", 2)).resolves.toMatchObject({ idempotent: false });
  });

  it("同一个 requestId 重放只扣一次", async () => {
    const first = await reserve(learner, "a", 400);
    const again = await reserve(learner, "a", 400);
    expect(again).toEqual({ ...first, idempotent: true });
    expect(raw.prepare("SELECT COUNT(*) AS n FROM ai_usage_ledger").get()).toEqual({ n: 1 });
  });

  it("别人的 requestId 不许借用", async () => {
    await reserve(learner, "a", 10);
    expect((await rejection(reserve(learner2, "a", 10))).code).toBe("REQUEST_ID_REUSED");
  });

  it("一个人的用量不占另一个人的额度", async () => {
    await reserve(learner, "a", 999);
    await expect(reserve(learner2, "b", 999)).resolves.toMatchObject({ idempotent: false });
  });

  it("换到下一个窗口，个人额度重新开始", async () => {
    await reserve(learner, "a", 999);
    await expect(reserve(learner, "b", 999, windowAt(AT).endsAt)).resolves.toMatchObject({ idempotent: false });
  });

  it("老师本人用自己的额度（2000），与个人学习者分开", async () => {
    await reserve(teacher, "a", 1500);
    expect((await aiStatus(db, teacher, AT)).level).toBe("half");
  });

  it("状态里没有任何用量数字", async () => {
    await reserve(learner, "a", 600);
    const status = await aiStatus(db, learner, AT);
    expect(Object.keys(status).sort()).toEqual(["available", "consented", "level", "nextWindowAt", "policyVersion", "reason"]);
    expect(status.level).toBe("half");
  });
});

describe("结算、归还与过期的预留", () => {
  beforeEach(async () => {
    config(FULL_CONFIG);
    await recordConsent(db, learner, { policyVersion: PRIVACY_POLICY_VERSION, statement: "adult_or_guardian" }, AT);
  });

  it("按实际用量结算后，多预留的部分退回来", async () => {
    await reserve(learner, "a", 900);
    const settled = await settleUsage(db, "req-a-0000", { promptCacheHitTokens: 100, promptCacheMissTokens: 100, completionTokens: 50 }, AT);
    expect(settled).toEqual({ actualUnits: 250, settled: true });
    /* 1000 - 250 = 750 还够 */
    await expect(reserve(learner, "b", 700)).resolves.toMatchObject({ idempotent: false });
  });

  it("重复结算不改第二次", async () => {
    await reserve(learner, "a", 100);
    await settleUsage(db, "req-a-0000", { promptCacheHitTokens: 0, promptCacheMissTokens: 10, completionTokens: 0 }, AT);
    const again = await settleUsage(db, "req-a-0000", { promptCacheHitTokens: 0, promptCacheMissTokens: 90, completionTokens: 0 }, AT);
    expect(again.settled).toBe(false);
    expect(raw.prepare("SELECT actual_units FROM ai_usage_ledger").get()).toEqual({ actual_units: 10 });
  });

  it("提供方失败：归还后额度全部回来；已结算的不能再归还", async () => {
    await reserve(learner, "a", 999);
    expect(await releaseUsage(db, "req-a-0000", AT)).toBe(true);
    await expect(reserve(learner, "b", 999)).resolves.toMatchObject({ idempotent: false });
    await settleUsage(db, "req-b-0000", { promptCacheHitTokens: 0, promptCacheMissTokens: 1, completionTokens: 0 }, AT);
    expect(await releaseUsage(db, "req-b-0000", AT)).toBe(false);
  });

  it("超过 2 分钟没结算的预留不再计入（Worker 中途死掉时不会永远卡住额度）", async () => {
    await reserve(learner, "a", 999);
    await expect(reserve(learner, "b", 999, AT + STALE_RESERVATION_MS - 1)).rejects.toBeInstanceOf(AiError);
    await expect(reserve(learner, "c", 999, AT + STALE_RESERVATION_MS + 1)).resolves.toMatchObject({ idempotent: false });
  });
});

/* ---------------- 全站上限 ---------------- */

describe("全站日 / 月上限", () => {
  beforeEach(async () => {
    config({ ...FULL_CONFIG, ai_budget_global_daily: "1500", ai_budget_global_monthly: "1800", ai_budget_learner_window: "100000" });
    for (const u of [learner, learner2]) {
      await recordConsent(db, u, { policyVersion: PRIVACY_POLICY_VERSION, statement: "adult_or_guardian" }, AT);
    }
  });

  it("个人额度还很多，但全站当日用满：所有人都停，原因是全站而不是他自己", async () => {
    await reserve(learner, "a", 1000);
    const error = await rejection(reserve(learner2, "b", 600));
    expect(error.extra.reason).toBe("global_exhausted");
    await reserve(learner2, "c", 500);
    expect((await aiStatus(db, learner, AT)).reason).toBe("global_exhausted");
  });

  it("日上限按上海日历日换日；月上限不随换日清零", async () => {
    await reserve(learner, "a", 1500);
    /* 要结算掉：只预留不结算的话，到第二天它早已过了 2 分钟，按规则不再计入任何用量 */
    await settleUsage(db, "req-a-0000", { promptCacheHitTokens: 0, promptCacheMissTokens: 1500, completionTokens: 0 }, AT);
    const nextDay = AT + 24 * 60 * 60 * 1000;
    /* 次日：日上限清零（1500 可用），但月上限只剩 1800 - 1500 = 300 */
    await expect(reserve(learner2, "b", 301, nextDay)).rejects.toBeInstanceOf(AiError);
    await expect(reserve(learner2, "c", 300, nextDay)).resolves.toMatchObject({ idempotent: false });
  });
});

/* ---------------- 学生、班级开关与班级池 ---------------- */

describe("学生：班级开关与班级池", () => {
  beforeEach(async () => {
    config(FULL_CONFIG);
    for (const u of [s1, s2]) {
      await recordConsent(db, u, { policyVersion: PRIVACY_POLICY_VERSION, statement: "adult_or_guardian" }, AT);
    }
  });

  it("班级默认没开：学生不可用，原因是班级", async () => {
    expect((await aiStatus(db, s1, AT)).reason).toBe("class_disabled");
    expect((await rejection(reserve(s1, "a", 10))).extra.reason).toBe("class_disabled");
  });

  it("老师打开本班后可用；关掉后立刻不可用", async () => {
    await setClassAi(db, teacher, "c1", { enabled: true }, AT);
    expect((await aiStatus(db, s1, AT)).available).toBe(true);
    await setClassAi(db, teacher, "c1", { enabled: false }, AT);
    expect((await aiStatus(db, s1, AT)).reason).toBe("class_disabled");
  });

  it("只能开关自己的班；学生和个人学习者不能开", async () => {
    expect((await rejection(setClassAi(db, otherTeacher, "c1", { enabled: true }))).code).toBe("NOT_FOUND");
    expect((await rejection(setClassAi(db, s1, "c1", { enabled: true }))).code).toBe("FORBIDDEN");
    expect((await rejection(setClassAi(db, teacher, "c1", { enabled: "yes" }))).code).toBe("INVALID_REQUEST");
  });

  it("单人上限是均分额度的 1.5 倍（1500），池子总量是人数 × 均分（2000）", async () => {
    await setClassAi(db, teacher, "c1", { enabled: true }, AT);
    await expect(reserve(s1, "a", 1501)).rejects.toBeInstanceOf(AiError);
    await reserve(s1, "b", 1500);
    /* 乙自己的份一点没用，但池子只剩 500 */
    const error = await rejection(reserve(s2, "c", 501));
    expect(error.extra.reason).toBe("exhausted");
    await expect(reserve(s2, "d", 500)).resolves.toMatchObject({ idempotent: false });
  });

  it("单人绝对上限比 1.5 倍更紧时，按绝对上限", async () => {
    config({ ai_budget_student_window_max: "1200" });
    await setClassAi(db, teacher, "c1", { enabled: true }, AT);
    await expect(reserve(s1, "a", 1201)).rejects.toBeInstanceOf(AiError);
    await expect(reserve(s1, "b", 1200)).resolves.toMatchObject({ idempotent: false });
  });

  it("学生的用量记在老师的池子上；老师本人的额度不受影响", async () => {
    await setClassAi(db, teacher, "c1", { enabled: true }, AT);
    await recordConsent(db, teacher, { policyVersion: PRIVACY_POLICY_VERSION, statement: "adult_or_guardian" }, AT);
    await reserve(s1, "a", 1500);
    expect(raw.prepare("SELECT pool_teacher_id FROM ai_usage_ledger WHERE user_id = 'u-s1'").get()).toEqual({ pool_teacher_id: "u-teacher" });
    expect((await aiStatus(db, teacher, AT)).level).toBe("plenty");
  });

  it("学生不在任何班级里：不可用", async () => {
    raw.prepare("UPDATE class_members SET status = 'removed' WHERE user_id = 'u-s1'").run();
    expect((await aiStatus(db, s1, AT)).reason).toBe("class_disabled");
  });

  it("班级池相关的额度缺行：学生不可用，但不影响个人学习者", async () => {
    await setClassAi(db, teacher, "c1", { enabled: true }, AT);
    raw.prepare("DELETE FROM service_config WHERE key = 'ai_budget_pool_per_student_window'").run();
    expect((await aiStatus(db, s1, AT)).reason).toBe("not_configured");
    await recordConsent(db, learner, { policyVersion: PRIVACY_POLICY_VERSION, statement: "adult_or_guardian" }, AT);
    expect((await aiStatus(db, learner, AT)).available).toBe(true);
  });
});

/* ---------------- 账本不存正文 ---------------- */

describe("账本里没有正文", () => {
  it("用量账本的列里没有问题、代码或回答", () => {
    const columns = (raw.prepare("PRAGMA table_info(ai_usage_ledger)").all() as Row[]).map((c) => String(c.name));
    for (const name of columns) expect(name, name).not.toMatch(/content|text|question|answer|prompt$|body|code/);
  });
});
