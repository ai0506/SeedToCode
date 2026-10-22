/*
 * 学习助理的额度规则：纯函数，不碰数据库，也不知道提供方是谁。
 *
 * 服务端（server/src/ai.ts）拿这里算出来的窗口、成本和上限去做原子写入；
 * 规则本身的对错在这里单测。计划见 docs/plans/AI_ASSISTANT_PLAN.md §7。
 *
 * 金额一律用整数「微元」（1e-6 元）。浮点数相加会漂，而账本要做「已用 + 本次 ≤ 上限」
 * 这种比较——差一个最低位就是多放或少放一次请求。
 */

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;
/* 中国不实行夏令时，固定 +8 小时，不需要时区库。 */
const SHANGHAI_OFFSET_MS = 8 * HOUR_MS;

/* 上海时间的三段：06–14、14–22、22–次日 06。 */
const WINDOW_STARTS = [6, 14, 22] as const;

export type QuotaWindow = {
  /** 例如 `2026-10-22T14`：这一段开始的上海日期与小时。22–06 那一段属于开始那天。 */
  key: string;
  startsAt: number;
  endsAt: number;
  /** 全局日上限按上海的**日历日**算，不按窗口：跨午夜的那一段在 00:00 换日。 */
  dayKey: string;
  monthKey: string;
};

function pad(value: number): string {
  return value < 10 ? "0" + value : String(value);
}

/** 上海时间下的 Y-M-D 与小时。用 UTC 方法读「平移后的时间戳」，与运行环境的本地时区无关。 */
function shanghaiParts(at: number) {
  const shifted = new Date(at + SHANGHAI_OFFSET_MS);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
    hour: shifted.getUTCHours()
  };
}

function dateKey(parts: { year: number; month: number; day: number }): string {
  return parts.year + "-" + pad(parts.month) + "-" + pad(parts.day);
}

export function windowAt(at: number): QuotaWindow {
  const now = shanghaiParts(at);
  /* 当天上海 00:00 对应的 UTC 时间戳 */
  const midnight = Date.UTC(now.year, now.month - 1, now.day) - SHANGHAI_OFFSET_MS;
  let startHour: number;
  let startDay = midnight;
  if (now.hour < WINDOW_STARTS[0]) {
    /* 00:00–06:00 属于前一天 22:00 开始的那一段 */
    startHour = 22;
    startDay = midnight - DAY_MS;
  } else if (now.hour < WINDOW_STARTS[1]) {
    startHour = 6;
  } else if (now.hour < WINDOW_STARTS[2]) {
    startHour = 14;
  } else {
    startHour = 22;
  }
  const startsAt = startDay + startHour * HOUR_MS;
  const endsAt = startsAt + 8 * HOUR_MS;
  return {
    key: dateKey(shanghaiParts(startsAt)) + "T" + pad(startHour),
    startsAt,
    endsAt,
    dayKey: dateKey(now),
    monthKey: now.year + "-" + pad(now.month)
  };
}

/**
 * 提供方的高峰时段：UTC 01:00–04:00 与 06:00–10:00，仅周一至周五。
 * 按提供方原文用 UTC 判断，不自己换算成上海时间再判——这几段换过去正好落在
 * 上海同一天，但「周几」只有按 UTC 判才和提供方的定义一字不差。
 */
export function isPeak(at: number): boolean {
  const date = new Date(at);
  const weekday = date.getUTCDay();
  if (weekday === 0 || weekday === 6) return false;
  const hour = date.getUTCHours();
  return (hour >= 1 && hour < 4) || (hour >= 6 && hour < 10);
}

/** 一张价目表。价格是**高峰**价，单位「元 / 百万 token」；非高峰按 `offPeakFactor` 折算。 */
export type PriceTable = {
  /** 改价必须换版本号，账本里每一行都记着它按哪张表算的。 */
  version: string;
  model: string;
  inputCacheHitPerMillion: number;
  inputCacheMissPerMillion: number;
  outputPerMillion: number;
  offPeakFactor: number;
};

/*
 * 生效中的价目表。**现在是空的**：提供方还没定（计划 §8 第 0 步），不能先写一个价格。
 * 服务端找不到 `ai_model` 对应的表，就当作「未配置」，AI 不可用——宁可用不了，
 * 也不按一个编出来的价格记账。
 */
export const PRICE_TABLES: Record<string, PriceTable> = {};

export type TokenUsage = {
  promptCacheHitTokens: number;
  promptCacheMissTokens: number;
  completionTokens: number;
};

/** 成本，单位微元，向上取整：宁可多记一点，不让账本系统性地少算。 */
export function costOf(usage: TokenUsage, table: PriceTable, peak: boolean): number {
  /* 元/百万 token × token 数 = 微元，正好约掉 1e6 */
  const raw = usage.promptCacheHitTokens * table.inputCacheHitPerMillion
    + usage.promptCacheMissTokens * table.inputCacheMissPerMillion
    + usage.completionTokens * table.outputPerMillion;
  return Math.ceil(peak ? raw : raw * table.offPeakFactor);
}

/**
 * 预留额：按最坏情况估——输入全部按未命中缓存算，输出按允许的最大长度算。
 * 预留宁大勿小，拿到 usage 后多退少补；预留小了就可能在并发时越过上限。
 */
export function reservationOf(promptTokensUpperBound: number, maxCompletionTokens: number, table: PriceTable, peak: boolean): number {
  return costOf({ promptCacheHitTokens: 0, promptCacheMissTokens: promptTokensUpperBound, completionTokens: maxCompletionTokens }, table, peak);
}

/**
 * 学生每个窗口能用多少。
 *
 * 班级池按老师名下的活跃学生数均分，再放宽到 1.5 倍：大家不是同时在用，
 * 严格均分会让第一个打开的人很快撞墙。但小班里 1.5 倍可能大得离谱，所以另有绝对上限。
 * 池子本身的总量另行检查——一个人用不完自己的份，并不意味着池子还有余量。
 */
export function studentWindowCap(poolPerStudent: number, absoluteMax: number): number {
  return Math.min(Math.floor(poolPerStudent * 1.5), absoluteMax);
}

export function poolWindowCap(poolPerStudent: number, activeStudents: number): number {
  return poolPerStudent * Math.max(1, activeStudents);
}

/*
 * 给界面的用量档位。界面**不显示数字**（计划 §7），只显示一根条和一句话，
 * 所以这里只给四档，不给比例——比例一旦出接口，迟早有人把它画成百分比。
 */
export type UsageLevel = "plenty" | "half" | "low" | "exhausted";

export function usageLevel(used: number, cap: number): UsageLevel {
  if (cap <= 0 || used >= cap) return "exhausted";
  const ratio = used / cap;
  if (ratio < 0.5) return "plenty";
  if (ratio < 0.85) return "half";
  return "low";
}

const LEVEL_ORDER: UsageLevel[] = ["plenty", "half", "low", "exhausted"];

/** 几个上限同时生效时，界面按最紧的那一个说话。 */
export function tightestLevel(levels: UsageLevel[]): UsageLevel {
  return levels.reduce<UsageLevel>((worst, level) => (LEVEL_ORDER.indexOf(level) > LEVEL_ORDER.indexOf(worst) ? level : worst), "plenty");
}

/**
 * 额度配置的一行。缺行、空串、非正整数、带小数，一律当作「没有配置」并返回 null，
 * 由调用方判为不可用。**这里故意不给默认值**：额度是花钱的边界，默认值一旦写错
 * 就是无上限，而「没配就用不了」至少是明显的。
 */
export function parseBudget(value: string | null | undefined): number | null {
  if (typeof value !== "string" || !/^[1-9][0-9]{0,14}$/.test(value)) return null;
  return Number(value);
}
