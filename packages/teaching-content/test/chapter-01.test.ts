import { describe, expect, it } from "vitest";
import { analyzeSource } from "@caie-pseudocode/language";
import { extractFeatures, grade, type FeatureId } from "@caie-pseudocode/exercise";
import { chapter01 } from "../src/chapter-01.js";
import { allTasks, course } from "../src/course.js";
import type { Task } from "../src/types.js";

import { expectedOutputs, sampleTranscripts } from "../src/expected-outputs.js";
import { verifyChapter } from "./shared.js";

verifyChapter({
  chapter: chapter01,
  course: course.chapters,
  expectedOutputs,
  sampleTranscripts
});

const sections = chapter01.sections;

function blocksOf<K extends Block["kind"]>(kind: K): Array<{ section: Section; block: Extract<Block, { kind: K }> }> {
  const items: Array<{ section: Section; block: Extract<Block, { kind: K }> }> = [];
  for (const section of sections) {
    for (const block of section.blocks) {
      if (block.kind === kind) items.push({ section, block: block as Extract<Block, { kind: K }> });
    }
  }
  return items;
}

/** 小节 id → 学完这一节之后允许使用的特征。 */
const taughtBySection = new Map<string, FeatureId[]>(
  sections.map((section) => [section.id, section.taughtFeatures])
);

/** 学生可见文本里禁止出现的说法，见 teaching/02-CONTENT_SPEC.md 2.1 与 3.4。 */
const BANNED_PHRASES = [
  "易错",
  "常见错误",
  "容易搞混",
  "常考",
  "必考",
  "必背",
  "考试技巧",
  "考点",
  "引擎校验",
  "语法树",
  "判题用例",
  "Editor Runtime",
  "CI ",
  "软约束",
  "硬约束",
  "L0",
  "L1",
  "L2",
  "L3"
];

/** 收集一章里所有会展示给学生的文本。 */
function studentVisibleTexts(): string[] {
  const texts: string[] = [];
  const pushTask = (task: Task | ChapterTask) => {
    texts.push(task.title, task.statement, task.ioSpec.input, task.ioSpec.output, ...task.hints);
    for (const test of task.tests) texts.push(test.caseHint);
    if ("constraints" in task && task.constraints) {
      for (const item of task.constraints.require ?? []) texts.push(item.reason);
      for (const item of task.constraints.forbid ?? []) texts.push(item.reason);
    }
  };

  for (const section of sections) {
    texts.push(section.title);
    for (const block of section.blocks) {
      switch (block.kind) {
        case "explanation":
          texts.push(...block.paragraphs, ...(block.callouts ?? []).map((callout) => callout.text));
          break;
        case "example":
          texts.push(block.title, ...block.annotations.map((annotation) => annotation.text));
          break;
        case "counterExample":
          texts.push(block.title, ...block.cases.flatMap((item) => [item.title ?? "", item.note, ...(item.expectDiagnostics ?? []).map((diagnostic) => diagnostic.text), item.expectRuntimeError?.text ?? ""]));
          break;
        case "comparison":
          texts.push(block.title, block.intro ?? "", ...block.panes.map((pane) => pane.note));
          break;
        case "quiz":
          texts.push(block.prompt, ...quizExplanations(block));
          break;
        case "task":
          pushTask(block);
          break;
      }
    }
  }
  for (const task of chapter01.chapterTasks) pushTask(task);
  return texts;
}

function quizExplanations(quiz: Quiz): string[] {
  if (quiz.type === "click-line") return quiz.lines.map((line) => line.explanation);
  if (quiz.type === "fill-blank") return quiz.bank.map((item) => item.explanation);
  return quiz.options.map((option) => option.explanation);
}

describe("Chapter 1 — 大纲落点", () => {
  it("章与小节的编号、层级和前置关系符合大纲", () => {
    expect(chapter01.id).toBe(1);
    expect(chapter01.level).toBe("AS");
    expect(chapter01.prerequisites).toEqual([]);
    expect(sections.map((section) => section.id)).toEqual(["1.1", "1.2", "1.3", "1.4"]);
    expect(chapter01.chapterTasks).toHaveLength(1);
  });

  it("小节题 1 道 + 章末大题 1 道", () => {
    // 本章新知识只有四块，练一道足够；再多是凑数
    const own = chapter01.sections.flatMap((section) => section.blocks).filter((block) => block.kind === "task");
    expect(own).toHaveLength(1);
  });

  it("整章只用到本章范围内的写法", () => {
    // 本章只教到「读一个字符串、显示出来、写注释」，不该出现别的写法
    const allowed: FeatureId[] = [
      "io.output", "io.input", "decl.variable", "misc.comment", "type.string", "literal.string"
    ];
    expect([...sections[sections.length - 1].taughtFeatures].sort()).toEqual([...allowed].sort());
  });

  it("不使用判不清对错的题型：问「哪一行位置放错了」这类题会有多种说得通的答案", () => {
    // 「INPUT 太早」和「提问太晚」都成立时，就没法指着一个具体的东西说它为什么不对。
    // 这类理解点改成问「运行起来会发生什么」——可观察行为只有一种。
    for (const section of sections) {
      for (const block of section.blocks) {
        if (block.kind !== "quiz" || block.type !== "click-line") continue;
        expect(block.lines.filter((line) => line.answer)).toHaveLength(1);
      }
    }
  });
});

describe("Chapter 1 — 约束真的拦得住", () => {
  const taskOf = (id: string) => allTasks().find(({ task }) => task.id === id)!.task as Task;
  const testsOf = (task: Task) =>
    task.tests.map((test) => ({ ...test, expected: expectedOutputs[`${task.id}/${test.id}`] ?? [] }));

  it("把答案写死在 OUTPUT 里会被要求用 INPUT 拦下", async () => {
    const task = taskOf("1.2.1");
    const result = await grade({
      source: 'OUTPUT "Chen lives in Shanghai"',
      constraints: task.constraints,
      tests: testsOf(task)
    });
    expect(result.failedLayer).toBe("L1");
    const unmet = result.constraintResults.filter((item) => !item.satisfied);
    expect(unmet.map((item) => item.feature)).toEqual(["io.input"]);
    expect(unmet[0].reason.length).toBeGreaterThan(8);
  });

  it("1.2.1 锁定两行已给出的声明，学生只需完成本节的输入输出", async () => {
    const task = taskOf("1.2.1");
    expect(task.lockedStarterCode).toBe("DECLARE Name : STRING\nDECLARE City : STRING");
    const studentPart = [
      'OUTPUT "Enter the name"',
      "INPUT Name",
      'OUTPUT "Enter the city"',
      "INPUT City",
      'OUTPUT Name, " lives in ", City'
    ].join("\n");
    const result = await grade({
      source: [task.lockedStarterCode, studentPart].join("\n"),
      constraints: task.constraints,
      tests: testsOf(task)
    });
    expect(result.passed).toBe(true);
  });

  it("章末题也锁定全部声明，不把 Chapter 2 的写法变成前置要求", () => {
    const task = taskOf("1.T1");
    expect(task.lockedStarterCode).toBe([
      "DECLARE Name : STRING",
      "DECLARE Subject : STRING",
      "DECLARE Room : STRING"
    ].join("\n"));
  });

  it("语法错误停在第一层，不再评测后面的东西", async () => {
    const task = taskOf("1.2.1");
    const result = await grade({
      source: "DECLARE Name : STRING\nINPUT Name\nOUTPUT",
      constraints: task.constraints,
      tests: testsOf(task)
    });
    expect(result.failedLayer).toBe("L0");
    expect(result.diagnostics.length).toBeGreaterThan(0);
    expect(result.testResults).toHaveLength(0);
  });

  it("写法不规范只进规范建议，不影响通过", async () => {
    const task = taskOf("1.2.1");
    const sloppy = task.referenceSolution.replace(/DECLARE/gu, "declare");
    const result = await grade({ source: sloppy, constraints: task.constraints, tests: testsOf(task) });
    expect(result.passed).toBe(true);
    expect(result.styleNotes.some((diagnostic) => diagnostic.ruleId === "FMT-004")).toBe(true);
  });

  it("注释按语法结构判定：字符串里的 // 不算注释", () => {
    const real = analyzeSource('// 说明\nOUTPUT "Hi"');
    const fake = analyzeSource('OUTPUT "// not a comment"');
    expect([...extractFeatures(real.program)]).toContain("misc.comment");
    expect([...extractFeatures(fake.program)]).not.toContain("misc.comment");
  });

  it("学生解答用到本章之后才教的写法时只提示，不判错", async () => {
    const task = taskOf("1.2.1");
    const ahead = [
      "DECLARE Name : STRING",
      "DECLARE City : STRING",
      'OUTPUT "Enter the name"',
      "INPUT Name",
      'OUTPUT "Enter the city"',
      "INPUT City",
      "IF TRUE THEN",
      '   OUTPUT Name, " lives in ", City',
      "ENDIF"
    ].join("\n");
    const result = await grade({
      source: ahead,
      constraints: task.constraints,
      tests: testsOf(task),
      taughtFeatures: ["io.output", "io.input", "decl.variable", "misc.comment"]
    });
    expect(result.passed).toBe(true);
    expect(result.aheadFeatures).toContain("select.if");
  });
});
