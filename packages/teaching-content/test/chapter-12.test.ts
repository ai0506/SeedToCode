import { describe, expect, it } from "vitest";
import { analyzeSource } from "@caie-pseudocode/language";
import { runWithInputs } from "@caie-pseudocode/exercise";
import { chapter12 } from "../src/chapter-12.js";
import { course } from "../src/course.js";
import { expectedOutputs, sampleTranscripts } from "../src/expected-outputs.js";
import { verifyChapter } from "./shared.js";

verifyChapter({ chapter: chapter12, course: course.chapters, expectedOutputs, sampleTranscripts });

describe("Chapter 12 — 大纲落点", () => {
  it("六节，过程在 12.1 放开、参数在 12.3、BYREF 在 12.5", () => {
    expect(chapter12.prerequisites).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    expect(chapter12.sections.map((section) => section.id)).toEqual(["12.1", "12.2", "12.3", "12.4", "12.5", "12.6"]);
    const taught = (id: string) => chapter12.sections.find((section) => section.id === id)!.taughtFeatures;
    expect(taught("12.1")).toEqual(expect.arrayContaining(["routine.procedure", "routine.call"]));
    expect(taught("12.2")).not.toContain("param.byval");
    expect(taught("12.3")).toContain("param.byval");
    expect(taught("12.4")).not.toContain("param.byref");
    expect(taught("12.5")).toContain("param.byref");
  });
});

describe("Chapter 12 — 讲的规则和引擎的行为一致", () => {
  const run = (source: string) => analyzeSource(source).diagnostics;

  it("定义漏括号和调用漏 CALL 都在运行前被拦下——12.2 的两个反例靠这条", () => {
    const noParens = run(["PROCEDURE Greet", '   OUTPUT "Hello"', "ENDPROCEDURE", "CALL Greet()"].join("\n"));
    expect(noParens.some((d) => d.ruleId === "PROC-001" && d.range.start.line === 1)).toBe(true);
    const noCall = run(["PROCEDURE Greet()", '   OUTPUT "Hello"', "ENDPROCEDURE", "Greet()"].join("\n"));
    expect(noCall.some((d) => d.ruleId === "PROC-001" && d.range.start.line === 4)).toBe(true);
  });

  it("实参个数对不上时，提示落在调用那一行而不是定义那一行", () => {
    // 一个实参都不给时，范围曾经掉到第 1 行去——那儿离学生写错的地方隔着整个过程
    const source = [
      "PROCEDURE ShowRow(Label : STRING, Value : INTEGER)",
      '   OUTPUT Label, ": ", Value',
      "ENDPROCEDURE",
      "CALL ShowRow()"
    ].join("\n");
    const diagnostic = run(source).find((d) => d.messageKey === "type.call.argumentCount");
    expect(diagnostic?.range.start.line).toBe(4);
  });

  it("不写传递方式时默认传值，外面的变量不受影响——12.4 的关卡靠这条", async () => {
    const build = (mode: string) =>
      [
        `PROCEDURE Bump(${mode}N : INTEGER)`,
        "   N ← N + 100",
        "ENDPROCEDURE",
        "DECLARE Score : INTEGER",
        "Score ← 5",
        "CALL Bump(Score)",
        "OUTPUT Score"
      ].join("\n");
    expect((await runWithInputs(build("BYVAL "), [])).outputs).toEqual(["5"]);
    expect((await runWithInputs(build(""), [])).outputs).toEqual(["5"]);
    expect((await runWithInputs(build("BYREF "), [])).outputs).toEqual(["105"]);
  });

  it("连着的参数省略 BYREF 时后一个也是传引用——12.5 的关卡靠这条", async () => {
    const swap = (header: string) =>
      [
        header,
        "   DECLARE Temp : INTEGER",
        "   Temp ← A",
        "   A ← B",
        "   B ← Temp",
        "ENDPROCEDURE",
        "DECLARE P : INTEGER",
        "DECLARE Q : INTEGER",
        "P ← 1",
        "Q ← 2",
        "CALL Swap(P, Q)",
        'OUTPUT P, " ", Q'
      ].join("\n");
    const both = swap("PROCEDURE Swap(BYREF A : INTEGER, BYREF B : INTEGER)");
    const shared = swap("PROCEDURE Swap(BYREF A : INTEGER, B : INTEGER)");
    expect(run(shared).filter((d) => d.severity === "error")).toHaveLength(0);
    expect((await runWithInputs(both, [])).outputs).toEqual(["2 1"]);
    expect((await runWithInputs(shared, [])).outputs).toEqual(["2 1"]);
  });

  it("局部变量出了过程就不存在——12.6 的反例靠这条", () => {
    const source = ["PROCEDURE R()", "   DECLARE Count : INTEGER", "   Count ← 3", "ENDPROCEDURE", "CALL R()", "OUTPUT Count"].join("\n");
    expect(run(source).some((d) => d.ruleId === "DECL-002" && d.range.start.line === 6)).toBe(true);
  });

  it("12.T1 的参考解靠三次 SortTwo 把三个数排好", async () => {
    const run12T1 = async (inputs: string[]) => (await runWithInputs(chapter12.chapterTasks[0].referenceSolution, inputs)).outputs.slice(-3);
    expect(await run12T1(["7", "4", "9"])).toEqual(["4", "7", "9"]);
    expect(await run12T1(["9", "7", "4"])).toEqual(["4", "7", "9"]);
  });
});
