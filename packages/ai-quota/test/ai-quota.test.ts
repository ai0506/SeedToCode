import { describe, expect, it } from "vitest";
import {
  costOf,
  isPeak,
  parseBudget,
  poolWindowCap,
  reservationOf,
  studentWindowCap,
  tightestLevel,
  usageLevel,
  windowAt,
  type PriceTable
} from "../src/index.js";

/** 上海时间 → UTC 时间戳。测试里全部按上海时间写，读起来才对得上计划里的「06:00–14:00」。 */
const sh = (y: number, m: number, d: number, h: number, mi = 0, s = 0) => Date.UTC(y, m - 1, d, h - 8, mi, s);

describe("额度窗口（上海时间三段）", () => {
  it("06:00–14:00、14:00–22:00 两段的边界", () => {
    expect(windowAt(sh(2026, 10, 22, 6)).key).toBe("2026-10-22T06");
    expect(windowAt(sh(2026, 10, 22, 13, 59, 59)).key).toBe("2026-10-22T06");
    expect(windowAt(sh(2026, 10, 22, 14)).key).toBe("2026-10-22T14");
    expect(windowAt(sh(2026, 10, 22, 21, 59, 59)).key).toBe("2026-10-22T14");
    expect(windowAt(sh(2026, 10, 22, 22)).key).toBe("2026-10-22T22");
  });

  it("窗口的起止时刻就是界面要说的「几点恢复」", () => {
    const w = windowAt(sh(2026, 10, 22, 10, 30));
    expect(w.startsAt).toBe(sh(2026, 10, 22, 6));
    expect(w.endsAt).toBe(sh(2026, 10, 22, 14));
  });

  it("凌晨属于前一天 22:00 开始的那一段，但日上限已经按新的一天算", () => {
    const w = windowAt(sh(2026, 10, 23, 3));
    expect(w.key).toBe("2026-10-22T22");
    expect(w.startsAt).toBe(sh(2026, 10, 22, 22));
    expect(w.endsAt).toBe(sh(2026, 10, 23, 6));
    expect(w.dayKey).toBe("2026-10-23");
  });

  it("跨月：窗口仍挂在上个月最后一天，月上限已经换月", () => {
    const w = windowAt(sh(2026, 11, 1, 2));
    expect(w.key).toBe("2026-10-31T22");
    expect(w.dayKey).toBe("2026-11-01");
    expect(w.monthKey).toBe("2026-11");
  });

  it("跨年同理", () => {
    const w = windowAt(sh(2027, 1, 1, 0, 30));
    expect(w.key).toBe("2026-12-31T22");
    expect(w.monthKey).toBe("2027-01");
  });

  it("与运行环境的时区无关：结果只由时间戳决定", () => {
    const at = sh(2026, 10, 22, 23);
    expect(windowAt(at)).toEqual(windowAt(at));
    expect(windowAt(at).key).toBe("2026-10-22T22");
  });
});

describe("高峰时段（提供方定义：UTC 01–04、06–10，仅工作日）", () => {
  const utc = (d: number, h: number, mi = 0) => Date.UTC(2026, 9, d, h, mi);

  it("工作日两段的边界（2026-10-22 是周四）", () => {
    expect(isPeak(utc(22, 0, 59))).toBe(false);
    expect(isPeak(utc(22, 1))).toBe(true);
    expect(isPeak(utc(22, 3, 59))).toBe(true);
    expect(isPeak(utc(22, 4))).toBe(false);
    expect(isPeak(utc(22, 5, 59))).toBe(false);
    expect(isPeak(utc(22, 6))).toBe(true);
    expect(isPeak(utc(22, 9, 59))).toBe(true);
    expect(isPeak(utc(22, 10))).toBe(false);
  });

  it("换成上海时间正好是工作日 09–12、14–18", () => {
    expect(isPeak(sh(2026, 10, 22, 9))).toBe(true);
    expect(isPeak(sh(2026, 10, 22, 12))).toBe(false);
    expect(isPeak(sh(2026, 10, 22, 14))).toBe(true);
    expect(isPeak(sh(2026, 10, 22, 18))).toBe(false);
  });

  it("周末全天不是高峰——本计划早先漏掉过这一条", () => {
    expect(isPeak(utc(24, 2))).toBe(false);
    expect(isPeak(utc(25, 7))).toBe(false);
    expect(isPeak(utc(26, 2))).toBe(true);
  });
});

describe("成本（整数微元）", () => {
  const table: PriceTable = {
    version: "test-1", model: "test-model",
    inputCacheHitPerMillion: 0.5, inputCacheMissPerMillion: 2, outputPerMillion: 8, offPeakFactor: 0.5
  };

  it("三档分别计价，高峰按原价、非高峰减半", () => {
    const usage = { promptCacheHitTokens: 1000, promptCacheMissTokens: 2000, completionTokens: 500 };
    expect(costOf(usage, table, true)).toBe(500 + 4000 + 4000);
    expect(costOf(usage, table, false)).toBe(4250);
  });

  it("不足一微元的部分向上取整，结果总是整数", () => {
    expect(costOf({ promptCacheHitTokens: 3, promptCacheMissTokens: 0, completionTokens: 0 }, table, true)).toBe(2);
    expect(Number.isInteger(costOf({ promptCacheHitTokens: 7, promptCacheMissTokens: 3, completionTokens: 1 }, table, false))).toBe(true);
  });

  it("预留按最坏情况：输入全按未命中、输出按上限，所以不小于任何实际成本", () => {
    const reserved = reservationOf(3000, 500, table, true);
    expect(reserved).toBe(3000 * 2 + 500 * 8);
    for (const hit of [0, 1000, 3000]) {
      expect(costOf({ promptCacheHitTokens: hit, promptCacheMissTokens: 3000 - hit, completionTokens: 500 }, table, true)).toBeLessThanOrEqual(reserved);
    }
  });
});

describe("班级池", () => {
  it("单人上限是均分额度的 1.5 倍，但不超过绝对上限", () => {
    expect(studentWindowCap(1000, 100000)).toBe(1500);
    expect(studentWindowCap(1000, 1200)).toBe(1200);
    expect(studentWindowCap(333, 100000)).toBe(499);
  });

  it("池子总量按活跃学生数算，至少按 1 人算", () => {
    expect(poolWindowCap(1000, 30)).toBe(30000);
    expect(poolWindowCap(1000, 0)).toBe(1000);
  });
});

describe("用量档位（界面不显示数字，只给四档）", () => {
  it("档位边界", () => {
    expect(usageLevel(0, 100)).toBe("plenty");
    expect(usageLevel(49, 100)).toBe("plenty");
    expect(usageLevel(50, 100)).toBe("half");
    expect(usageLevel(84, 100)).toBe("half");
    expect(usageLevel(85, 100)).toBe("low");
    expect(usageLevel(100, 100)).toBe("exhausted");
    expect(usageLevel(130, 100)).toBe("exhausted");
  });

  it("上限为 0 视为用完，而不是除以零", () => {
    expect(usageLevel(0, 0)).toBe("exhausted");
  });

  it("几个上限同时生效时取最紧的", () => {
    expect(tightestLevel(["plenty", "low", "half"])).toBe("low");
    expect(tightestLevel([])).toBe("plenty");
  });
});

describe("额度配置：缺了就是没有，不给默认值", () => {
  it("只认正整数", () => {
    expect(parseBudget("100")).toBe(100);
    for (const bad of [undefined, null, "", "0", "-1", "1.5", "01", " 5", "5 ", "1e6", "abc"]) {
      expect(parseBudget(bad as string | null | undefined), String(bad)).toBeNull();
    }
  });
});
