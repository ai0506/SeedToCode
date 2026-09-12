import { describe, expect, it } from "vitest";
import {
  dueLabel,
  emptyDraft,
  endOfDay,
  fillableItems,
  firstIncomplete,
  isLate,
  monthGrid,
  parseDraft,
  sameDay,
  serializeDraft,
  shiftMonth,
  tally,
  type DraftState
} from "../src/index.js";

describe("日期", () => {
  it("截止时间落在本地当天的 23:59:59，不是 UTC", () => {
    const stamp = endOfDay(2026, 8, 17); // 2026-09-17
    const date = new Date(stamp);
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(8);
    expect(date.getDate()).toBe(17);
    expect(date.getHours()).toBe(23);
    expect(date.getMinutes()).toBe(59);
    expect(date.getSeconds()).toBe(59);
  });

  it("按钮上的文字带星期；不限时间时说「不限时间」", () => {
    expect(dueLabel(null)).toBe("不限时间");
    // 2026-09-17 是周四
    expect(dueLabel(endOfDay(2026, 8, 17))).toBe("2026-09-17 周四");
    // 月和日都要补零，否则按钮宽度会随日期变
    expect(dueLabel(endOfDay(2026, 0, 5))).toBe("2026-01-05 周一");
  });

  it("sameDay 只比日期，不比时刻", () => {
    expect(sameDay(endOfDay(2026, 8, 17), 2026, 8, 17)).toBe(true);
    expect(sameDay(new Date(2026, 8, 17, 0, 0, 1).getTime(), 2026, 8, 17)).toBe(true);
    expect(sameDay(endOfDay(2026, 8, 17), 2026, 8, 18)).toBe(false);
    expect(sameDay(null, 2026, 8, 17)).toBe(false);
  });
});

describe("月格", () => {
  it("永远 42 格 6 行——行数会变的话，换月时浮层高度就会跳", () => {
    for (let month = 0; month < 12; month += 1) {
      expect(monthGrid(2026, month)).toHaveLength(42);
    }
    // 2026-02 恰好 28 天且 1 号是周日：最容易出现「只要 4 行」的那种月份
    expect(monthGrid(2026, 1)).toHaveLength(42);
  });

  it("一周从周一起算，和表头「一二三四五六日」对齐", () => {
    // 2026-09-01 是周二，所以它前面应当只补一格（周一，8 月 31 日）
    const grid = monthGrid(2026, 8);
    expect(grid[0]).toMatchObject({ month: 7, day: 31, outside: true });
    expect(grid[1]).toMatchObject({ month: 8, day: 1, outside: false });
    expect(new Date(grid[0]!.stamp).getDay()).toBe(1); // 周一
  });

  it("1 号正好是周一时不补白格", () => {
    // 2026-06-01 是周一
    const grid = monthGrid(2026, 5);
    expect(grid[0]).toMatchObject({ month: 5, day: 1, outside: false });
  });

  it("1 号是周日时要补满 6 格——这是最容易差一的那种", () => {
    // 2026-02-01 是周日
    const grid = monthGrid(2026, 1);
    expect(grid.slice(0, 6).every((cell) => cell.outside)).toBe(true);
    expect(grid[6]).toMatchObject({ month: 1, day: 1, outside: false });
  });

  it("当月的每一天都在格子里，且只出现一次", () => {
    const grid = monthGrid(2026, 1).filter((cell) => !cell.outside);
    expect(grid.map((cell) => cell.day)).toEqual([...Array(28)].map((_, i) => i + 1));
  });

  it("补白格标成 outside，且 stamp 指向它自己那一天", () => {
    const grid = monthGrid(2026, 8);
    const first = grid[0]!;
    expect(sameDay(first.stamp, first.year, first.month, first.day)).toBe(true);
  });

  it("换月跨年", () => {
    expect(shiftMonth(2026, 0, -1)).toEqual({ year: 2025, month: 11 });
    expect(shiftMonth(2026, 11, 1)).toEqual({ year: 2027, month: 0 });
    expect(shiftMonth(2026, 5, 0)).toEqual({ year: 2026, month: 5 });
    expect(shiftMonth(2026, 0, -13)).toEqual({ year: 2024, month: 11 });
  });
});

describe("草稿快照", () => {
  const sample: DraftState = {
    title: "第 3 章 循环练习",
    dueAt: endOfDay(2026, 8, 17),
    legacy: ["3.4"],
    items: [
      { id: "custom:abc", title: "统计及格人数", prompt: "读入 30 个成绩。\n\n换行要留住。", guidance: "想想用什么循环。" },
      { id: null, title: "求最大值", prompt: "读入 10 个整数。", guidance: "" }
    ]
  };

  it("存进去再读回来还是原来那个", () => {
    expect(parseDraft(serializeDraft(sample))).toEqual(sample);
  });

  it("题面里的换行不能丢——老师是按普通文字排版的", () => {
    const back = parseDraft(serializeDraft(sample))!;
    expect(back.items[0]!.prompt).toContain("\n\n");
  });

  it("题目的 id 要原样带回来：丢了 id，学生已交的答案就和题目脱钩", () => {
    const back = parseDraft(serializeDraft(sample))!;
    expect(back.items[0]!.id).toBe("custom:abc");
    expect(back.items[1]!.id).toBeNull();
  });

  it("字段顺序稳定——这串文本同时用来和 baseline 比对，顺序一变就会凭空冒出草稿", () => {
    const reordered: DraftState = {
      items: sample.items,
      legacy: sample.legacy,
      dueAt: sample.dueAt,
      title: sample.title
    } as DraftState;
    expect(serializeDraft(reordered)).toBe(serializeDraft(sample));
  });

  it("没改过的内容序列化后与 baseline 一致", () => {
    const baseline = serializeDraft(emptyDraft());
    expect(serializeDraft(parseDraft(baseline)!)).toBe(baseline);
  });

  it("坏数据返回 null，不抛——草稿读不出来是小事，把整页卡住是大事", () => {
    expect(parseDraft("{ 不是 JSON")).toBeNull();
    expect(parseDraft("")).toBeNull();
    expect(parseDraft(null)).toBeNull();
    expect(parseDraft("null")).toBeNull();
    expect(parseDraft("123")).toBeNull();
  });

  it("缺字段的旧草稿按空值补齐，不会变成 undefined", () => {
    const back = parseDraft('{"title":"只有标题"}')!;
    expect(back).toEqual({ title: "只有标题", dueAt: null, legacy: [], items: [] });
  });

  it("类型不对的字段被挡掉", () => {
    const back = parseDraft('{"title":42,"dueAt":"明天","legacy":[1,"3.4"],"items":[null]}')!;
    expect(back.title).toBe("");
    expect(back.dueAt).toBeNull();
    expect(back.legacy).toEqual(["3.4"]);
    expect(back.items).toEqual([{ id: null, title: "", prompt: "", guidance: "" }]);
  });
});

describe("提交前的校验", () => {
  it("完全空白的那一条不算数", () => {
    const items = [
      { id: null, title: "", prompt: "", guidance: "" },
      { id: null, title: "有标题", prompt: "有题面", guidance: "" }
    ];
    expect(fillableItems(items)).toHaveLength(1);
  });

  it("只写了题面忘了标题的，要留着并报出来，不能悄悄丢掉", () => {
    const items = [{ id: null, title: "", prompt: "写了题面", guidance: "" }];
    expect(fillableItems(items)).toHaveLength(1);
    expect(firstIncomplete(fillableItems(items))).toMatchObject({ index: 0, missing: "title" });
  });

  it("缺题面的报 prompt", () => {
    const items = [{ id: null, title: "有标题", prompt: "", guidance: "提示" }];
    expect(firstIncomplete(items)).toMatchObject({ index: 0, missing: "prompt" });
  });

  it("报的是第几道——老师要靠这个数字找到那道题", () => {
    const items = [
      { id: null, title: "第一题", prompt: "题面", guidance: "" },
      { id: null, title: "第二题", prompt: "题面", guidance: "" },
      { id: null, title: "第三题", prompt: "", guidance: "" }
    ];
    expect(firstIncomplete(items)!.index).toBe(2);
  });

  it("都齐了返回 null", () => {
    expect(firstIncomplete([{ id: null, title: "标题", prompt: "题面", guidance: "" }])).toBeNull();
    expect(firstIncomplete([])).toBeNull();
  });
});

describe("迟交", () => {
  const due = endOfDay(2026, 8, 17);

  it("晚于截止时间才算迟交", () => {
    expect(isLate({ dueAt: due }, { submittedAt: due - 1000 })).toBe(false);
    expect(isLate({ dueAt: due }, { submittedAt: due })).toBe(false);
    expect(isLate({ dueAt: due }, { submittedAt: due + 1000 })).toBe(true);
  });

  it("不限时间的作业永远不迟交", () => {
    expect(isLate({ dueAt: null }, { submittedAt: Date.now() })).toBe(false);
    expect(isLate({}, { submittedAt: Date.now() })).toBe(false);
  });

  it("老师改了截止时间，之前那些提交的迟交与否跟着变", () => {
    const submission = { submittedAt: endOfDay(2026, 8, 18) };
    expect(isLate({ dueAt: due }, submission)).toBe(true);
    expect(isLate({ dueAt: endOfDay(2026, 8, 20) }, submission)).toBe(false);
  });

  it("没有作业或没有提交时不报迟交", () => {
    expect(isLate(null, { submittedAt: 1 })).toBe(false);
    expect(isLate({ dueAt: due }, null)).toBe(false);
  });
});

describe("提交矩阵的汇总", () => {
  const students = ["s1", "s2", "s3"];
  const tasks = ["t1", "t2"];
  // 李华两道都交了，王梅只交了第一道，赵磊没交
  const done = new Set(["s1/t1", "s1/t2", "s2/t1"]);
  const has = (student: string, task: string) => done.has(`${student}/${task}`);

  it("每题交了几个人", () => {
    expect(tally(students, tasks, has).perTask).toEqual([2, 1]);
  });

  it("每个学生交了几道", () => {
    expect(tally(students, tasks, has).perStudent).toEqual([2, 1, 0]);
  });

  it("总数是学生数乘题数，不是提交条数", () => {
    const result = tally(students, tasks, has);
    expect(result.total).toBe(6);
    expect(result.submitted).toBe(3);
  });

  it("没有学生或没有题目时不除零、不报错", () => {
    expect(tally([], tasks, has)).toEqual({ perTask: [0, 0], perStudent: [], submitted: 0, total: 0 });
    expect(tally(students, [], has)).toEqual({ perTask: [], perStudent: [0, 0, 0], submitted: 0, total: 0 });
  });

  it("全交齐时每一格都等于总人数", () => {
    const all = tally(students, tasks, () => true);
    expect(all.perTask).toEqual([3, 3]);
    expect(all.perStudent).toEqual([2, 2, 2]);
    expect(all.submitted).toBe(all.total);
  });
});
