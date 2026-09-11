import { describe, expect, it } from "vitest";
import { analyzeSource } from "@caie-pseudocode/language";
import { executeSource } from "@caie-pseudocode/runtime";
import { runWithInputs } from "@caie-pseudocode/exercise";
import { chapter08 } from "../src/chapter-08.js";
import { course } from "../src/course.js";
import { expectedOutputs, sampleTranscripts } from "../src/expected-outputs.js";
import { verifyChapter } from "./shared.js";

verifyChapter({ chapter: chapter08, course: course.chapters, expectedOutputs, sampleTranscripts });

describe("Chapter 8 — 大纲落点", () => {
  it("六个知识点合成五节，数组在第一节就放开", () => {
    expect(chapter08.prerequisites).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(chapter08.sections.map((section) => section.id)).toEqual(["8.1", "8.2", "8.3", "8.4", "8.5"]);
    const taught = chapter08.sections[0].taughtFeatures;
    expect(taught).toEqual(expect.arrayContaining(["decl.array-1d", "array.index"]));
    expect(taught).not.toContain("decl.array-2d");
  });
});

describe("Chapter 8 — 讲的规则和引擎的行为一致", () => {
  const run = (source: string) => analyzeSource(source).diagnostics;

  it("下标写死时越界在运行前就被拦下——8.3 的第一个反例靠这条", () => {
    expect(run("DECLARE A : ARRAY[1:3] OF INTEGER\nA[4] ← 1").some((d) => d.ruleId === "ARRAY-004")).toBe(true);
  });

  it("下标是变量时越界要等到运行——8.3 的第二个反例靠这条", async () => {
    const source = "DECLARE A : ARRAY[1:3] OF INTEGER\nDECLARE I : INTEGER\nFOR I ← 1 TO 4\n   A[I] ← I\nNEXT I";
    expect(run(source).filter((d) => d.severity === "error")).toHaveLength(0);
    const result = await executeSource(source).result;
    expect(result.error?.code).toBe("RT1603");
  });

  it("格子在范围里但没赋过值，读它一样会停——8.3 的第三个反例靠这条", async () => {
    const source = "DECLARE A : ARRAY[1:3] OF INTEGER\nOUTPUT A[2]";
    expect(run(source).filter((d) => d.severity === "error")).toHaveLength(0);
    expect((await executeSource(source).result).error?.code).toBe("RT1003");
  });

  it("循环少跑一遍不报错，只是漏掉一格——8.4 的关卡靠这条", async () => {
    const source = [
      "DECLARE A : ARRAY[1:5] OF INTEGER",
      "DECLARE I : INTEGER",
      "DECLARE N : INTEGER",
      "N ← 0",
      "FOR I ← 1 TO 4",
      "   A[I] ← 1",
      "   N ← N + 1",
      "NEXT I",
      'OUTPUT "Touched ", N'
    ].join("\n");
    expect(run(source)).toHaveLength(0);
    expect((await runWithInputs(source, [])).outputs).toEqual(["Touched 4"]);
  });

  it("下界不必从 1 开始——8.2 的关卡靠这条", () => {
    expect(run("DECLARE Y : ARRAY[2020:2029] OF INTEGER\nY[2029] ← 1")).toHaveLength(0);
    expect(run("DECLARE Y : ARRAY[2020:2029] OF INTEGER\nY[2030] ← 1").some((d) => d.ruleId === "ARRAY-004")).toBe(true);
  });

  it("8.T1 的参考解在七天一样时说没有哪天高于平均", async () => {
    const result = await runWithInputs(chapter08.chapterTasks[0].referenceSolution, ["20", "20", "20", "20", "20", "20", "20"]);
    expect(result.outputs.at(-1)).toBe("Above average: 0");
  });
});
