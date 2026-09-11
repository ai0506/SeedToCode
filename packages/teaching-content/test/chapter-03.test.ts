import { describe, expect, it } from "vitest";
import { analyzeSource } from "@caie-pseudocode/language";
import { extractFeatures } from "@caie-pseudocode/exercise";
import { chapter03 } from "../src/chapter-03.js";
import { course as browserCourse } from "../src/browser.js";
import { course } from "../src/course.js";
import { expectedOutputs, sampleTranscripts } from "../src/expected-outputs.js";
import { verifyChapter } from "./shared.js";

verifyChapter({ chapter: chapter03, course: course.chapters, expectedOutputs, sampleTranscripts });

describe("Chapter 3 — 大纲落点", () => {
  it("承接前两章，七个知识点合成五节", () => {
    expect(chapter03.prerequisites).toEqual([1, 2]);
    expect(chapter03.sections.map((section) => section.id)).toEqual(["3.1", "3.2", "3.3", "3.4", "3.5"]);
    expect(chapter03.chapterTasks).toHaveLength(1);
  });

  it("最后一节覆盖算术、整除、比较与三个逻辑运算符", () => {
    expect(chapter03.sections.at(-1)?.taughtFeatures).toEqual(
      expect.arrayContaining([
        "op.arithmetic", "op.div", "op.mod", "op.relational", "op.and", "op.or", "op.not"
      ])
    );
  });

  it("浏览器课程数据和课程索引登记的章节一一对应", () => {
    // 写死章号会让每加一章就来改这里一次。要守的其实是「别漏发布」。
    expect(browserCourse.chapters.map((chapter) => chapter.id)).toEqual(course.chapters.map((chapter) => chapter.id));
  });
});

describe("Chapter 3 — 讲的规则和引擎的行为一致", () => {
  const run = (source: string) => analyzeSource(source).diagnostics;

  it("`/` 的结果是实数，放不进 INTEGER——3.1 与 3.5 都靠这条", () => {
    expect(run("DECLARE N : INTEGER\nN ← 8 / 2").some((d) => d.ruleId === "ASSIGN-002")).toBe(true);
    expect(run("DECLARE R : REAL\nR ← 8 / 2")).toHaveLength(0);
  });

  it("整数可以当实数用，反过来不行——3.5 的单向规则", () => {
    expect(run("DECLARE R : REAL\nR ← 7")).toHaveLength(0);
    expect(run("DECLARE N : INTEGER\nN ← 7.5").some((d) => d.ruleId === "ASSIGN-002")).toBe(true);
  });

  it("比较不能连着写——3.3 的反例靠这条", () => {
    expect(run("DECLARE S : INTEGER\nS ← 1\nOUTPUT 0 < S < 100").some((d) => d.ruleId === "OP-003")).toBe(true);
  });

  it("NOT 抓得比比较紧——3.4 的反例靠这条", () => {
    expect(run("DECLARE S : INTEGER\nS ← 1\nOUTPUT NOT S > 50").some((d) => d.ruleId === "OP-004")).toBe(true);
    expect(run("DECLARE S : INTEGER\nS ← 1\nOUTPUT NOT (S > 50)")).toHaveLength(0);
  });

  it("3.2.1 的参考解确实用到了 DIV 和 MOD，不是拿 / 凑的", () => {
    const task = chapter03.sections
      .flatMap((section) => section.blocks)
      .find((block) => block.kind === "task" && block.id === "3.2.1");
    const features = extractFeatures(analyzeSource((task as { referenceSolution: string }).referenceSolution).program);
    expect([...features]).toEqual(expect.arrayContaining(["op.div", "op.mod"]));
  });
});
