import { describe, expect, it } from "vitest";
import { analyzeSource } from "@caie-pseudocode/language";
import { runWithInputs } from "@caie-pseudocode/exercise";
import { chapter09 } from "../src/chapter-09.js";
import { course } from "../src/course.js";
import { expectedOutputs, sampleTranscripts } from "../src/expected-outputs.js";
import { verifyChapter } from "./shared.js";

verifyChapter({ chapter: chapter09, course: course.chapters, expectedOutputs, sampleTranscripts });

describe("Chapter 9 — 大纲落点", () => {
  it("四节，二维在第一节放开，一维仍然在", () => {
    expect(chapter09.prerequisites).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(chapter09.sections.map((section) => section.id)).toEqual(["9.1", "9.2", "9.3", "9.4"]);
    const taught = chapter09.sections[0].taughtFeatures;
    expect(taught).toEqual(expect.arrayContaining(["decl.array-2d", "array.index-2d", "decl.array-1d", "array.index"]));
  });
});

describe("Chapter 9 — 讲的规则和引擎的行为一致", () => {
  const run = (source: string) => analyzeSource(source).diagnostics;

  it("少给一个下标在运行前就被拦下——9.2 的第一个反例靠这条", () => {
    expect(run("DECLARE G : ARRAY[1:2, 1:3] OF INTEGER\nG[1] ← 5").some((d) => d.ruleId === "ARRAY-004")).toBe(true);
  });

  it("行列反了但两边一样大时，一条提示都没有——9.2 的第二个反例与关卡都靠这条", async () => {
    const source = [
      "DECLARE G : ARRAY[1:3, 1:3] OF INTEGER",
      "G[1, 3] ← 7",
      "G[3, 1] ← 9",
      "OUTPUT G[3, 1]"
    ].join("\n");
    expect(run(source)).toHaveLength(0);
    // 两个格子确实是不同的格子：存 7 的那个和取出来的那个不是一回事
    expect((await runWithInputs(source, [])).outputs).toEqual(["9"]);
  });

  it("行列范围不一样大时，反过来写会被抓住", () => {
    expect(run("DECLARE G : ARRAY[1:3, 1:2] OF INTEGER\nG[2, 3] ← 1").some((d) => d.ruleId === "ARRAY-004")).toBe(true);
    expect(run("DECLARE G : ARRAY[1:3, 1:2] OF INTEGER\nG[3, 2] ← 1")).toHaveLength(0);
  });

  it("清零放错一层会把上一行的结果带下来——9.3 的关卡靠这条", async () => {
    const build = (resetInside: boolean) =>
      [
        "DECLARE G : ARRAY[1:2, 1:2] OF INTEGER",
        "DECLARE Row : INTEGER",
        "DECLARE Col : INTEGER",
        "DECLARE Sum : INTEGER",
        "G[1, 1] ← 1",
        "G[1, 2] ← 2",
        "G[2, 1] ← 3",
        "G[2, 2] ← 4",
        ...(resetInside ? [] : ["Sum ← 0"]),
        "FOR Row ← 1 TO 2",
        ...(resetInside ? ["   Sum ← 0"] : []),
        "   FOR Col ← 1 TO 2",
        "      Sum ← Sum + G[Row, Col]",
        "   NEXT Col",
        "   OUTPUT Sum",
        "NEXT Row"
      ].join("\n");
    expect((await runWithInputs(build(true), [])).outputs).toEqual(["3", "7"]);
    expect((await runWithInputs(build(false), [])).outputs).toEqual(["3", "10"]);
  });

  it("9.T1 的参考解按行算总分、按列算平均", async () => {
    const result = await runWithInputs(chapter09.chapterTasks[0].referenceSolution, ["10", "20", "30", "40", "50", "60"]);
    expect(result.outputs.slice(-5)).toEqual([
      "Student 1 total: 30",
      "Student 2 total: 70",
      "Student 3 total: 110",
      "Subject 1 average: 30",
      "Subject 2 average: 40"
    ]);
  });
});
