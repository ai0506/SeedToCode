import { describe, expect, it } from "vitest";
import { analyzeSource } from "@caie-pseudocode/language";
import { extractFeatures } from "@caie-pseudocode/exercise";
import { chapter04 } from "../src/chapter-04.js";
import { course } from "../src/course.js";
import { expectedOutputs, sampleTranscripts } from "../src/expected-outputs.js";
import { verifyChapter } from "./shared.js";

verifyChapter({ chapter: chapter04, course: course.chapters, expectedOutputs, sampleTranscripts });

describe("Chapter 4 — 大纲落点", () => {
  it("承接前三章，七个知识点合成六节", () => {
    expect(chapter04.prerequisites).toEqual([1, 2, 3]);
    expect(chapter04.sections.map((section) => section.id)).toEqual(["4.1", "4.2", "4.3", "4.4", "4.5", "4.6"]);
    expect(chapter04.chapterTasks).toHaveLength(1);
  });

  it("闸门按小节逐个放开两种选择结构", () => {
    const taught = (id: string) => chapter04.sections.find((section) => section.id === id)!.taughtFeatures;
    expect(taught("4.1")).toContain("select.if");
    expect(taught("4.1")).not.toContain("select.if-else");
    expect(taught("4.2")).toContain("select.if-else");
    expect(taught("4.3")).toContain("select.nested-if");
    expect(taught("4.4")).toContain("select.case");
    expect(taught("4.4")).not.toContain("select.case-range");
    expect(taught("4.5")).toEqual(expect.arrayContaining(["select.case-range", "select.case-otherwise"]));
  });
});

describe("Chapter 4 — 讲的规则和引擎的行为一致", () => {
  const run = (source: string) => analyzeSource(source).diagnostics;

  it("OTHERWISE 不放最后会被拦下——4.5 的反例靠这条", () => {
    const source = [
      "DECLARE S : INTEGER",
      "S ← 1",
      "CASE OF S",
      '   OTHERWISE : OUTPUT "x"',
      '   1 : OUTPUT "one"',
      "ENDCASE"
    ].join("\n");
    expect(run(source).some((d) => d.ruleId === "CASE-002")).toBe(true);
  });

  it("CASE 一条都没对上也不是错误——4.4 的关卡靠这条", () => {
    const source = [
      "DECLARE S : INTEGER",
      "S ← 9",
      "CASE OF S",
      '   1 : OUTPUT "one"',
      "ENDCASE",
      'OUTPUT "after"'
    ].join("\n");
    expect(run(source)).toHaveLength(0);
  });

  it("条件必须是 BOOLEAN——4.1 说的「条件就是第 3 章那种式子」", () => {
    expect(run('DECLARE S : INTEGER\nS ← 1\nIF S THEN\n   OUTPUT "y"\nENDIF').some((d) => d.ruleId === "IF-001")).toBe(true);
    expect(run('DECLARE S : INTEGER\nS ← 1\nIF S = 1 THEN\n   OUTPUT "y"\nENDIF')).toHaveLength(0);
  });

  it("4.5.1 的参考解确实用 CASE 且不掺 IF", () => {
    const task = chapter04.sections
      .flatMap((section) => section.blocks)
      .find((block) => block.kind === "task" && block.id === "4.5.1");
    const features = [...extractFeatures(analyzeSource((task as { referenceSolution: string }).referenceSolution).program)];
    expect(features).toEqual(expect.arrayContaining(["select.case", "select.case-otherwise"]));
    expect(features).not.toContain("select.if");
  });
});
