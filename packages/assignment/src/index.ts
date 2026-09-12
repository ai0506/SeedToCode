/*
 * 作业相关的纯逻辑：日期、草稿快照、迟交判定、提交汇总。
 *
 * 这些函数原来锁在 `web/js/assign-page.js` 和 `web/js/teacher-app.js` 的 IIFE 里，
 * 一个都测不到——而它们恰好是最容易错的一类：本地时区的当天结束、周一开头的
 * 月格偏移、跨年换月、草稿存进去再读回来还是不是原来那个、题目多时的计数。
 * 这一轮修掉的三个草稿 bug 全长在这块地里，所以把它们挪出来，让测试够得着。
 *
 * 这个包故意不认识 DOM，也不认识课程内容的类型：它只处理数据。
 * 页面通过 esbuild 打出的 `web/js/assignment-core.js`（全局 `CAIEAssignment`）使用。
 */

/* ---------------- 日期 ---------------- */

/** 周日是 0，和 `Date.getDay()` 对齐。 */
export const WEEKDAY_LABELS = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"] as const;

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

/**
 * 截止时间按**本地**当天结束算：老师选「今天」应当是今天下班前都还能交。
 * 用本地时区而不是 UTC——老师选的是自己日历上的那一天。
 */
export function endOfDay(year: number, month: number, day: number): number {
  return new Date(year, month, day, 23, 59, 59, 0).getTime();
}

/** 时间戳落在哪一天（本地）。 */
export function sameDay(timestamp: number | null, year: number, month: number, day: number): boolean {
  if (!timestamp) return false;
  const date = new Date(timestamp);
  return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day;
}

/** 出题页那个日期按钮上的文字。 */
export function dueLabel(timestamp: number | null): string {
  if (!timestamp) return "不限时间";
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${WEEKDAY_LABELS[date.getDay()]}`;
}

export type DayCell = {
  year: number;
  month: number;   // 0–11
  day: number;
  /** 不属于当前月的补白格 */
  outside: boolean;
  /** 这一格代表的时间戳（当天 23:59:59） */
  stamp: number;
};

/**
 * 日期选择器的月格。
 *
 * 永远 42 格 6 行：行数不固定的话，换月时浮层高度会跳一格，
 * 底下的「今天 / 不限时间」跟着上下动（FRONTEND_RULES 第 1 条）。
 * 一周从**周一**起算，和表头「一二三四五六日」对齐；`getDay()` 把周日当 0，
 * 所以要把它挪到末位。
 */
export function monthGrid(year: number, month: number, today: Date = new Date()): DayCell[] {
  void today;
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7;
  const start = new Date(year, month, 1 - offset);
  const cells: DayCell[] = [];
  for (let index = 0; index < 42; index += 1) {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + index);
    cells.push({
      year: date.getFullYear(),
      month: date.getMonth(),
      day: date.getDate(),
      outside: date.getMonth() !== month || date.getFullYear() !== year,
      stamp: endOfDay(date.getFullYear(), date.getMonth(), date.getDate())
    });
  }
  return cells;
}

/** 上一个月 / 下一个月，跨年时年份跟着走。 */
export function shiftMonth(year: number, month: number, delta: number): { year: number; month: number } {
  const total = year * 12 + month + delta;
  return { year: Math.floor(total / 12), month: ((total % 12) + 12) % 12 };
}

/* ---------------- 草稿快照 ---------------- */

export type DraftItem = {
  /** 已有题目的 id（形如 `custom:<uuid>`）；新写的题是 null。 */
  id: string | null;
  title: string;
  prompt: string;
  guidance: string;
};

export type DraftState = {
  title: string;
  dueAt: number | null;
  /** 旧作业里从课程勾选的题号，只读带着走 */
  legacy: string[];
  items: DraftItem[];
};

export function emptyDraft(): DraftState {
  return { title: "", dueAt: null, legacy: [], items: [] };
}

/**
 * 草稿的序列化。**字段顺序是固定的**，因为这串文本同时用来和 baseline 比对
 * 判断「改过没有」——顺序一变，没改过的内容也会被判成改过，草稿就会凭空出现。
 */
export function serializeDraft(state: DraftState): string {
  return JSON.stringify({
    title: state.title,
    dueAt: state.dueAt,
    legacy: state.legacy,
    items: state.items.map((item) => ({
      id: item.id,
      title: item.title,
      prompt: item.prompt,
      guidance: item.guidance
    }))
  });
}

/**
 * 读回草稿。坏数据一律返回 null 而不是抛——草稿读不出来是小事，
 * 把整页卡住才是大事。
 */
export function parseDraft(text: string | null | undefined): DraftState | null {
  if (!text) return null;
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return null;
  }
  if (!raw || typeof raw !== "object") return null;
  const box = raw as Record<string, unknown>;
  const items = Array.isArray(box.items) ? box.items : [];
  return {
    title: typeof box.title === "string" ? box.title : "",
    dueAt: typeof box.dueAt === "number" ? box.dueAt : null,
    legacy: Array.isArray(box.legacy) ? box.legacy.filter((x): x is string => typeof x === "string") : [],
    items: items.map((entry) => {
      const row = (entry && typeof entry === "object" ? entry : {}) as Record<string, unknown>;
      return {
        id: typeof row.id === "string" ? row.id : null,
        title: typeof row.title === "string" ? row.title : "",
        prompt: typeof row.prompt === "string" ? row.prompt : "",
        guidance: typeof row.guidance === "string" ? row.guidance : ""
      };
    })
  };
}

/**
 * 提交前把完全空白的题剔掉：新建时会预置一条空的，老师没填就当没加。
 * 只要三个字段里有一个写过，就算数——否则「写了题面忘了标题」会被悄悄丢掉。
 */
export function fillableItems(items: DraftItem[]): DraftItem[] {
  return items.filter((item) => Boolean(item.title || item.prompt || item.guidance));
}

/** 第一道缺标题或缺题面的题；全都齐了返回 null。 */
export function firstIncomplete(items: DraftItem[]): { index: number; item: DraftItem; missing: "title" | "prompt" } | null {
  for (let index = 0; index < items.length; index += 1) {
    const item = items[index]!;
    if (!item.title) return { index, item, missing: "title" };
    if (!item.prompt) return { index, item, missing: "prompt" };
  }
  return null;
}

/* ---------------- 迟交与汇总 ---------------- */

export type AssignmentLike = { dueAt?: number | null };
export type SubmissionLike = { submittedAt: number };

/**
 * 迟交＝提交时间晚于**当前**截止时间。现算而不是提交时写死：
 * 老师改了截止时间，之前那些提交的迟交与否也应当跟着变。
 */
export function isLate(assignment: AssignmentLike | null | undefined, submission: SubmissionLike | null | undefined): boolean {
  if (!assignment || !submission) return false;
  const due = assignment.dueAt;
  if (!due) return false;
  return submission.submittedAt > due;
}

export type Tally = {
  /** 每道题交了几个人，下标与 taskIds 对齐 */
  perTask: number[];
  /** 每个学生交了几道题，下标与 studentIds 对齐 */
  perStudent: number[];
  /** 已交份数与总格子数 */
  submitted: number;
  total: number;
};

/**
 * 提交矩阵的汇总。题目一多，光有格子数不出「哪道题最多人没交」，
 * 所以行尾和表尾各要一道汇总。
 *
 * `has(studentId, taskId)` 由调用方提供——页面那边是「每人每题取最近一次」的
 * 查找表，这里不关心它怎么来的。
 */
export function tally(
  studentIds: string[],
  taskIds: string[],
  has: (studentId: string, taskId: string) => boolean
): Tally {
  const perTask = taskIds.map(() => 0);
  const perStudent = studentIds.map(() => 0);
  let submitted = 0;
  studentIds.forEach((studentId, studentIndex) => {
    taskIds.forEach((taskId, taskIndex) => {
      if (!has(studentId, taskId)) return;
      perTask[taskIndex]! += 1;
      perStudent[studentIndex]! += 1;
      submitted += 1;
    });
  });
  return { perTask, perStudent, submitted, total: studentIds.length * taskIds.length };
}
