/*
 * 学习助理的服务端底座：总开关、额度账本、同意记录、班级开关。
 *
 * 这里**不调用任何 AI 提供方**。以后的 /api/ai/chat 按这个顺序用它：
 *   reserveUsage()（门禁 + 原子预留）→ 调提供方 → settleUsage() 或 releaseUsage()
 * 额度规则（窗口、高峰、成本、班级池）在 packages/ai-quota 里，有单测；
 * 这里只负责把它们变成一次原子的数据库写入。设计见 docs/plans/AI_ASSISTANT_PLAN.md §7。
 */
import {
  PRICE_TABLES,
  isPeak,
  parseBudget,
  poolWindowCap,
  reservationOf,
  costOf,
  studentWindowCap,
  tightestLevel,
  usageLevel,
  windowAt,
  type PriceTable,
  type TokenUsage,
  type UsageLevel
} from "../../packages/ai-quota/dist/index.js";
import type { AuthenticatedUser } from "./auth";

/*
 * 当前隐私政策版本。同意卡片按它判断要不要重新同意。
 * 必须和 web/privacy.html 里的 <meta name="seedtocode-privacy-version"> 相同——
 * tests/ai-foundation.test.ts 核对两者；只改一边的话，要么老同意被当成新同意，要么所有人被无故要求重新同意。
 */
export const PRIVACY_POLICY_VERSION = 1;

/** 超过这么久还没结算的预留不再计入用量：调提供方的超时预算是 20s，留足余量。 */
export const STALE_RESERVATION_MS = 2 * 60 * 1000;

export class AiError extends Error {
  constructor(public readonly code: string, public readonly status: number, message: string, public readonly extra: Record<string, unknown> = {}) {
    super(message);
  }
}

/* ---------------- 配置 ---------------- */

type AiConfig = {
  enabled: boolean;
  table: PriceTable | null;
  globalDaily: number | null;
  globalMonthly: number | null;
  learnerWindow: number | null;
  teacherWindow: number | null;
  poolPerStudentWindow: number | null;
  studentWindowMax: number | null;
};

/*
 * 每个请求现读，不像 serviceEnabled 那样缓存 30 秒：这是花钱的开关，
 * 关掉要立刻生效；多一次按主键的查询不值得省。
 * 缺行、读失败一律当作关闭 / 未配置——与 cloud_sync_enabled「缺行按开启」方向相反，理由见迁移 0014。
 */
export async function readAiConfig(db: D1Database): Promise<AiConfig> {
  const values = new Map<string, string>();
  try {
    const rows = await db.prepare("SELECT key, value FROM service_config WHERE key LIKE 'ai\\_%' ESCAPE '\\'").all<{ key: string; value: string }>();
    for (const row of rows.results ?? []) values.set(row.key, row.value);
  } catch {
    values.clear();
  }
  const model = values.get("ai_model");
  return {
    enabled: values.get("ai_enabled") === "1",
    table: model && Object.prototype.hasOwnProperty.call(PRICE_TABLES, model) ? PRICE_TABLES[model] : null,
    globalDaily: parseBudget(values.get("ai_budget_global_daily")),
    globalMonthly: parseBudget(values.get("ai_budget_global_monthly")),
    learnerWindow: parseBudget(values.get("ai_budget_learner_window")),
    teacherWindow: parseBudget(values.get("ai_budget_teacher_window")),
    poolPerStudentWindow: parseBudget(values.get("ai_budget_pool_per_student_window")),
    studentWindowMax: parseBudget(values.get("ai_budget_student_window_max"))
  };
}

/* ---------------- 主体：这个人按哪几条上限算 ---------------- */

type Subject = {
  userId: string;
  /** 学生所属老师（班级池按老师计，不按班计）；其他身份为 null。 */
  poolTeacherId: string | null;
  /** 学生所在班级是否由老师打开了学习助理；其他身份恒为 true。 */
  classEnabled: boolean;
  userCap: number | null;
  poolCap: number | null;
};

async function resolveSubject(db: D1Database, user: AuthenticatedUser, config: AiConfig): Promise<Subject> {
  if (user.role === "learner") {
    return { userId: user.id, poolTeacherId: null, classEnabled: true, userCap: config.learnerWindow, poolCap: null };
  }
  if (user.role === "teacher") {
    return { userId: user.id, poolTeacherId: null, classEnabled: true, userCap: config.teacherWindow, poolCap: null };
  }
  /* 学生账号都是在某个班里新建的，没有把已有学生加进第二个班的路径，所以至多一行。 */
  const membership = await db.prepare(
    "SELECT classes.teacher_id, classes.ai_enabled_at FROM class_members JOIN classes ON classes.id = class_members.class_id WHERE class_members.user_id = ?1 AND class_members.status = 'active' LIMIT 1"
  ).bind(user.id).first<{ teacher_id: string; ai_enabled_at: number | null }>();
  if (!membership) {
    return { userId: user.id, poolTeacherId: null, classEnabled: false, userCap: null, poolCap: null };
  }
  const perStudent = config.poolPerStudentWindow;
  const absoluteMax = config.studentWindowMax;
  let poolCap: number | null = null;
  if (perStudent !== null) {
    const count = await db.prepare(
      "SELECT COUNT(DISTINCT class_members.user_id) AS count FROM class_members JOIN classes ON classes.id = class_members.class_id JOIN users ON users.id = class_members.user_id WHERE classes.teacher_id = ?1 AND class_members.status = 'active' AND users.status = 'active' AND users.role = 'student'"
    ).bind(membership.teacher_id).first<{ count: number }>();
    poolCap = poolWindowCap(perStudent, count?.count ?? 0);
  }
  return {
    userId: user.id,
    poolTeacherId: membership.teacher_id,
    classEnabled: membership.ai_enabled_at !== null,
    userCap: perStudent !== null && absoluteMax !== null ? studentWindowCap(perStudent, absoluteMax) : null,
    poolCap
  };
}

/* ---------------- 门禁 ---------------- */

export type UnavailableReason =
  | "disabled"          // 总开关关着
  | "not_configured"    // 价目表或某项额度缺失
  | "class_disabled"    // 学生所在班级没有打开学习助理（或学生不在任何班级里）
  | "consent_required"  // 当前政策版本下还没同意
  | "global_exhausted"  // 全站日/月上限到了——不是这个人的问题，界面要这样说
  | "exhausted";        // 这个人（或他所在的班级池）本窗口用完了

/** 门禁放行之后，这几项一定都有值。 */
type ReadyConfig = { table: PriceTable; globalDaily: number; globalMonthly: number };
type ReadySubject = { userId: string; poolTeacherId: string | null; userCap: number; poolCap: number | null };

type Gate =
  | { ok: true; config: ReadyConfig; subject: ReadySubject }
  | { ok: false; reason: Exclude<UnavailableReason, "consent_required" | "global_exhausted" | "exhausted"> };

async function gate(db: D1Database, user: AuthenticatedUser): Promise<Gate> {
  const config = await readAiConfig(db);
  if (!config.enabled) return { ok: false, reason: "disabled" };
  if (!config.table || config.globalDaily === null || config.globalMonthly === null) return { ok: false, reason: "not_configured" };
  const subject = await resolveSubject(db, user, config);
  if (!subject.classEnabled) return { ok: false, reason: "class_disabled" };
  if (subject.userCap === null) return { ok: false, reason: "not_configured" };
  if (subject.poolTeacherId !== null && subject.poolCap === null) return { ok: false, reason: "not_configured" };
  return {
    ok: true,
    config: { table: config.table, globalDaily: config.globalDaily, globalMonthly: config.globalMonthly },
    subject: { userId: subject.userId, poolTeacherId: subject.poolTeacherId, userCap: subject.userCap, poolCap: subject.poolCap }
  };
}

async function hasConsented(db: D1Database, userId: string): Promise<boolean> {
  const row = await db.prepare("SELECT 1 AS ok FROM ai_consents WHERE user_id = ?1 AND policy_version = ?2")
    .bind(userId, PRIVACY_POLICY_VERSION).first<{ ok: number }>();
  return Boolean(row);
}

/* ---------------- 用量 ---------------- */

/*
 * 「已用」的统一口径：已结算的按实际，预留中的按预留（过期的不算），已归还的不算。
 * 预留 SQL 和状态查询用的是同一段，避免两边算法分叉——那样界面会说「还有」而预留却被拒。
 */
const USED = "COALESCE(SUM(CASE WHEN state = 'settled' THEN actual_units WHEN state = 'reserved' AND created_at > :stale THEN reserved_units ELSE 0 END), 0)";

function usedSql(where: string): string {
  return `(SELECT ${USED} FROM ai_usage_ledger WHERE ${where})`;
}

/* D1 只认 ?N 占位；上面用具名写法好读，这里统一替换成编号。 */
const P = { stale: "?1", day: "?2", month: "?3", window: "?4", user: "?5", pool: "?6" } as const;
function bindNames(sql: string): string {
  return sql.replace(/:stale/g, P.stale);
}

async function usedNow(db: D1Database, subject: ReadySubject, at: number) {
  const w = windowAt(at);
  const row = await db.prepare(bindNames(
    `SELECT ${usedSql(`day_key = ${P.day}`)} AS day, ${usedSql(`month_key = ${P.month}`)} AS month,
            ${usedSql(`user_id = ${P.user} AND window_key = ${P.window}`)} AS user,
            ${usedSql(`pool_teacher_id = ${P.pool} AND window_key = ${P.window}`)} AS pool`
  )).bind(at - STALE_RESERVATION_MS, w.dayKey, w.monthKey, w.key, subject.userId, subject.poolTeacherId ?? "")
    .first<{ day: number; month: number; user: number; pool: number }>();
  return { window: w, day: row?.day ?? 0, month: row?.month ?? 0, user: row?.user ?? 0, pool: row?.pool ?? 0 };
}

/* ---------------- 状态（给界面） ---------------- */

export type AiStatus = {
  available: boolean;
  reason: UnavailableReason | null;
  policyVersion: number;
  consented: boolean;
  /** 只有四档，没有数字（计划 §7：界面不显示任何用量数字）。不可用时为 null。 */
  level: UsageLevel | null;
  /** 下一个窗口开始的时刻（毫秒），界面据此说「14:00 后恢复」。 */
  nextWindowAt: number;
};

export async function aiStatus(db: D1Database, user: AuthenticatedUser, at = Date.now()): Promise<AiStatus> {
  const base = { policyVersion: PRIVACY_POLICY_VERSION, nextWindowAt: windowAt(at).endsAt };
  const consented = await hasConsented(db, user.id);
  const g = await gate(db, user);
  if (!g.ok) return { ...base, available: false, reason: g.reason, consented, level: null };
  const used = await usedNow(db, g.subject, at);
  if (used.day >= g.config.globalDaily || used.month >= g.config.globalMonthly) {
    return { ...base, available: false, reason: "global_exhausted", consented, level: null };
  }
  const levels = [usageLevel(used.user, g.subject.userCap)];
  if (g.subject.poolCap !== null) levels.push(usageLevel(used.pool, g.subject.poolCap));
  const level = tightestLevel(levels);
  if (level === "exhausted") return { ...base, available: false, reason: "exhausted", consented, level };
  if (!consented) return { ...base, available: false, reason: "consent_required", consented, level };
  return { ...base, available: true, reason: null, consented, level };
}

/* ---------------- 预留 / 结算 / 归还 ---------------- */

export type ReserveInput = {
  requestId: string;
  mode: string;
  /** 本次发送内容的 token 上界（由调用方按输入上限估算）。 */
  promptTokensUpperBound: number;
  /** 发给提供方的 max_tokens。 */
  maxCompletionTokens: number;
};

export type Reservation = { requestId: string; reservedUnits: number; idempotent: boolean };

const REQUEST_ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{7,127}$/;
const MODE = /^[a-z][a-z-]{1,31}$/;

/**
 * 门禁 + 原子预留。
 *
 * 四条上限（全站日、全站月、个人本窗口、班级池本窗口）写在**同一条** INSERT … SELECT … WHERE 里：
 * 满足才插入，SQLite 保证这一条语句是原子的。不能像 run.ts 的 consumeQuota 那样「先 COUNT 再
 * INSERT」——两个并发请求会都看到「还够」，然后一起越过上限。
 */
export async function reserveUsage(db: D1Database, user: AuthenticatedUser, input: ReserveInput, at = Date.now()): Promise<Reservation> {
  if (!REQUEST_ID.test(input.requestId)) throw new AiError("INVALID_REQUEST", 400, "请求标识不正确。");
  if (!MODE.test(input.mode)) throw new AiError("INVALID_REQUEST", 400, "请求模式不正确。");
  if (!Number.isInteger(input.promptTokensUpperBound) || input.promptTokensUpperBound <= 0
    || !Number.isInteger(input.maxCompletionTokens) || input.maxCompletionTokens <= 0) {
    throw new AiError("INVALID_REQUEST", 400, "请求内容不正确。");
  }

  /* 重放：同一个 requestId 已经有记录，原样返回，不再扣。别人的 requestId 不许借用。 */
  const existing = await db.prepare("SELECT user_id, reserved_units, state FROM ai_usage_ledger WHERE request_id = ?1")
    .bind(input.requestId).first<{ user_id: string; reserved_units: number; state: string }>();
  if (existing) {
    if (existing.user_id !== user.id) throw new AiError("REQUEST_ID_REUSED", 409, "请求标识已被使用。");
    return { requestId: input.requestId, reservedUnits: existing.reserved_units, idempotent: true };
  }

  const g = await gate(db, user);
  if (!g.ok) throw unavailable(g.reason, at);
  if (!(await hasConsented(db, user.id))) throw unavailable("consent_required", at);

  const w = windowAt(at);
  const peak = isPeak(at);
  const units = reservationOf(input.promptTokensUpperBound, input.maxCompletionTokens, g.config.table, peak);
  const poolCheck = g.subject.poolTeacherId === null
    ? "1"
    : `${usedSql(`pool_teacher_id = ${P.pool} AND window_key = ${P.window}`)} + ?7 <= ?11`;

  const result = await db.prepare(bindNames(
    `INSERT INTO ai_usage_ledger
       (id, request_id, user_id, pool_teacher_id, window_key, day_key, month_key, mode, model, price_version, peak, state, reserved_units, created_at)
     SELECT ?12, ?13, ${P.user}, NULLIF(${P.pool}, ''), ${P.window}, ${P.day}, ${P.month}, ?14, ?15, ?16, ?17, 'reserved', ?7, ?18
     WHERE ${usedSql(`day_key = ${P.day}`)} + ?7 <= ?8
       AND ${usedSql(`month_key = ${P.month}`)} + ?7 <= ?9
       AND ${usedSql(`user_id = ${P.user} AND window_key = ${P.window}`)} + ?7 <= ?10
       AND ${poolCheck}
     ON CONFLICT(request_id) DO NOTHING`
  )).bind(
    at - STALE_RESERVATION_MS, w.dayKey, w.monthKey, w.key, user.id, g.subject.poolTeacherId ?? "",
    units, g.config.globalDaily, g.config.globalMonthly, g.subject.userCap, g.subject.poolCap ?? 0,
    crypto.randomUUID(), input.requestId, input.mode, g.config.table.model, g.config.table.version, peak ? 1 : 0, at
  ).run();

  if ((result.meta?.changes ?? 0) === 1) return { requestId: input.requestId, reservedUnits: units, idempotent: false };

  /* 没插进去：要么是并发的同一个 requestId 抢先插了，要么是某条上限不够。后者再查一次只为了说清是哪一条。 */
  const raced = await db.prepare("SELECT user_id, reserved_units FROM ai_usage_ledger WHERE request_id = ?1")
    .bind(input.requestId).first<{ user_id: string; reserved_units: number }>();
  if (raced) {
    if (raced.user_id !== user.id) throw new AiError("REQUEST_ID_REUSED", 409, "请求标识已被使用。");
    return { requestId: input.requestId, reservedUnits: raced.reserved_units, idempotent: true };
  }
  const used = await usedNow(db, g.subject, at);
  const global = used.day + units > g.config.globalDaily || used.month + units > g.config.globalMonthly;
  throw unavailable(global ? "global_exhausted" : "exhausted", at);
}

function unavailable(reason: UnavailableReason, at: number): AiError {
  const next = windowAt(at).endsAt;
  const messages: Record<UnavailableReason, string> = {
    disabled: "学习助理暂时不可用，其他功能不受影响。",
    not_configured: "学习助理暂时不可用，其他功能不受影响。",
    class_disabled: "你的班级还没有开启学习助理。",
    consent_required: "使用学习助理前，需要先阅读并同意隐私政策。",
    global_exhausted: "学习助理今天暂时不可用，其他功能不受影响。",
    exhausted: "这个时段的额度用完了。"
  };
  const status = reason === "consent_required" ? 403 : reason === "exhausted" || reason === "global_exhausted" ? 429 : 503;
  return new AiError("AI_UNAVAILABLE", status, messages[reason], { reason, nextWindowAt: next });
}

/** 按实际 usage 结算，多退少补。只结算仍在预留中的那一行；重复调用不会改第二次。 */
export async function settleUsage(db: D1Database, requestId: string, usage: TokenUsage, at = Date.now()): Promise<{ actualUnits: number; settled: boolean }> {
  const row = await db.prepare("SELECT model, price_version, peak FROM ai_usage_ledger WHERE request_id = ?1")
    .bind(requestId).first<{ model: string; price_version: string; peak: number }>();
  if (!row) throw new AiError("NOT_FOUND", 404, "没有这条预留。");
  /* 按预留时那张表结算：中途改了价，这一笔仍按它开始时的价算，账本里的 price_version 才说得通。 */
  const table = Object.values(PRICE_TABLES).find((t) => t.model === row.model && t.version === row.price_version);
  if (!table) throw new AiError("PRICE_TABLE_MISSING", 500, "价目表缺失。");
  const actual = costOf(usage, table, row.peak === 1);
  const result = await db.prepare(
    "UPDATE ai_usage_ledger SET state = 'settled', actual_units = ?2, prompt_cache_hit_tokens = ?3, prompt_cache_miss_tokens = ?4, completion_tokens = ?5, settled_at = ?6 WHERE request_id = ?1 AND state = 'reserved'"
  ).bind(requestId, actual, usage.promptCacheHitTokens, usage.promptCacheMissTokens, usage.completionTokens, at).run();
  return { actualUnits: actual, settled: (result.meta?.changes ?? 0) === 1 };
}

/** 提供方失败或超时：全额归还。已结算的不动。 */
export async function releaseUsage(db: D1Database, requestId: string, at = Date.now()): Promise<boolean> {
  const result = await db.prepare("UPDATE ai_usage_ledger SET state = 'released', settled_at = ?2 WHERE request_id = ?1 AND state = 'reserved'")
    .bind(requestId, at).run();
  return (result.meta?.changes ?? 0) === 1;
}

/* ---------------- 同意 ---------------- */

/**
 * 记录「我已成年，或我的监护人已同意」。客户端要带上它看到的政策版本：
 * 页面打开之后政策恰好升了版，用户同意的是旧文本，不能记成新版本的同意。
 */
export async function recordConsent(db: D1Database, user: AuthenticatedUser, input: unknown, at = Date.now()) {
  const body = input && typeof input === "object" && !Array.isArray(input) ? input as Record<string, unknown> : null;
  if (!body || body.statement !== "adult_or_guardian" || !Number.isInteger(body.policyVersion)) {
    throw new AiError("INVALID_REQUEST", 400, "请求内容不正确。");
  }
  /* 总开关关着时不收：隐私政策在 AI 上线前写的是「没有接入任何 AI 服务」，
     这张表在那之前必须是空的——靠这一行保证，而不是靠「界面还没做，没人会调」。 */
  if (!(await readAiConfig(db)).enabled) throw unavailable("disabled", at);
  if (body.policyVersion !== PRIVACY_POLICY_VERSION) {
    throw new AiError("POLICY_CHANGED", 409, "隐私政策已经更新，请重新阅读后再同意。", { policyVersion: PRIVACY_POLICY_VERSION });
  }
  await db.prepare(
    "INSERT INTO ai_consents (user_id, policy_version, statement, consented_at) VALUES (?1, ?2, 'adult_or_guardian', ?3) ON CONFLICT(user_id, policy_version) DO NOTHING"
  ).bind(user.id, PRIVACY_POLICY_VERSION, at).run();
  return { policyVersion: PRIVACY_POLICY_VERSION, consented: true };
}

/* ---------------- 班级开关 ---------------- */

/** 老师打开 / 关闭本班的学习助理。只能改自己的班。 */
export async function setClassAi(db: D1Database, teacher: AuthenticatedUser, classId: string, input: unknown, at = Date.now()) {
  if (teacher.role !== "teacher") throw new AiError("FORBIDDEN", 403, "只有老师可以执行此操作。");
  if (!/^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/.test(classId)) throw new AiError("INVALID_REQUEST", 400, "班级标识不正确。");
  const body = input && typeof input === "object" && !Array.isArray(input) ? input as Record<string, unknown> : null;
  if (!body || typeof body.enabled !== "boolean") throw new AiError("INVALID_REQUEST", 400, "请求内容不正确。");
  const result = await db.prepare("UPDATE classes SET ai_enabled_at = ?1, updated_at = ?2 WHERE id = ?3 AND teacher_id = ?4")
    .bind(body.enabled ? at : null, at, classId, teacher.id).run();
  if ((result.meta?.changes ?? 0) === 0) throw new AiError("NOT_FOUND", 404, "班级不存在。");
  return { classId, aiEnabled: body.enabled };
}
