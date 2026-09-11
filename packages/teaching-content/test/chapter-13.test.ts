import { describe, expect, it } from "vitest";
import { analyzeSource } from "@caie-pseudocode/language";
import { runWithInputs } from "@caie-pseudocode/exercise";
import { chapter13 } from "../src/chapter-13.js";
import { course } from "../src/course.js";
import { expectedOutputs, sampleTranscripts } from "../src/expected-outputs.js";
import { verifyChapter } from "./shared.js";

verifyChapter({ chapter: chapter13, course: course.chapters, expectedOutputs, sampleTranscripts });

describe("Chapter 13 — 大纲落点", () => {
  it("六节，函数在第一节就放开，过程的写法仍然在", () => {
    expect(chapter13.prerequisites).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(chapter13.sections.map((section) => section.id)).toEqual(["13.1", "13.2", "13.3", "13.4", "13.5", "13.6"]);
    expect(chapter13.sections[0].taughtFeatures).toEqual(
      expect.arrayContaining(["routine.function", "routine.return", "expr.function-call", "routine.procedure", "param.byref"])
    );
  });
});

describe("Chapter 13 — 讲的规则和引擎的行为一致", () => {
  const run = (source: string) => analyzeSource(source).diagnostics;
  const DOUBLE = ["FUNCTION Double(N : INTEGER) RETURNS INTEGER", "   RETURN N * 2", "ENDFUNCTION"];

  it("函数用 CALL 调用被拦下，返回类型对不上也被拦下——13.2 的两个反例靠这条", () => {
    expect(run([...DOUBLE, "CALL Double(5)"].join("\n")).some((d) => d.ruleId === "FUNC-002" && d.range.start.line === 4)).toBe(true);
    const wrongType = ["FUNCTION Double(N : INTEGER) RETURNS INTEGER", '   RETURN "twice"', "ENDFUNCTION", "OUTPUT Double(5)"].join("\n");
    expect(run(wrongType).some((d) => d.ruleId === "FUNC-001" && d.range.start.line === 2)).toBe(true);
  });

  it("有一条路没有 RETURN 时提示落在函数头部——13.3 的反例靠这条", () => {
    const source = [
      "FUNCTION Sign(N : INTEGER) RETURNS STRING",
      "   IF N > 0 THEN",
      '      RETURN "positive"',
      "   ENDIF",
      "ENDFUNCTION",
      "OUTPUT Sign(0)"
    ].join("\n");
    const diagnostic = run(source).find((d) => d.messageKey === "type.function.notAllPathsReturn");
    expect(diagnostic?.range.start.line).toBe(1);
  });

  it("ENDIF 后面直接写 RETURN 和包进 ELSE 行为完全相同——13.3 的关卡靠这条", async () => {
    const flat = [
      "FUNCTION Sign(N : INTEGER) RETURNS STRING",
      "   IF N > 0 THEN",
      '      RETURN "positive"',
      "   ENDIF",
      '   RETURN "zero"',
      "ENDFUNCTION",
      "OUTPUT Sign(5)",
      "OUTPUT Sign(0)"
    ].join("\n");
    const nested = [
      "FUNCTION Sign(N : INTEGER) RETURNS STRING",
      "   IF N > 0 THEN",
      '      RETURN "positive"',
      "   ELSE",
      '      RETURN "zero"',
      "   ENDIF",
      "ENDFUNCTION",
      "OUTPUT Sign(5)",
      "OUTPUT Sign(0)"
    ].join("\n");
    expect(run(flat).filter((d) => d.severity === "error")).toHaveLength(0);
    expect(run(nested).filter((d) => d.severity === "error")).toHaveLength(0);
    expect((await runWithInputs(flat, [])).outputs).toEqual((await runWithInputs(nested, [])).outputs);
  });

  it("函数参数写 BYREF 只是规范提示，程序照样跑并改掉外面的变量——13.4 的反例靠这条", async () => {
    const source = [
      "FUNCTION Bad(BYREF N : INTEGER) RETURNS INTEGER",
      "   N ← N + 1",
      "   RETURN N",
      "ENDFUNCTION",
      "DECLARE X : INTEGER",
      "X ← 1",
      "OUTPUT Bad(X)",
      "OUTPUT X"
    ].join("\n");
    const diagnostics = run(source);
    expect(diagnostics.filter((d) => d.severity === "error")).toHaveLength(0);
    expect(diagnostics.some((d) => d.ruleId === "PARAM-002" && d.severity === "caie")).toBe(true);
    expect((await runWithInputs(source, [])).outputs).toEqual(["2", "2"]);
  });

  it("同一个有副作用的函数换个式子就换个行数——13.5 的关卡靠这条", async () => {
    const noisy = (last: string) =>
      [
        "FUNCTION Noisy(N : INTEGER) RETURNS INTEGER",
        '   OUTPUT "called with ", N',
        "   RETURN N * 2",
        "ENDFUNCTION",
        last
      ].join("\n");
    expect((await runWithInputs(noisy("OUTPUT Noisy(3) + Noisy(4)"), [])).outputs).toHaveLength(3);
    expect((await runWithInputs(noisy("OUTPUT Noisy(3) * 2"), [])).outputs).toEqual(["called with 3", "12"]);
  });

  it("13.T1 的参考解把一个函数的返回值直接当另一次调用的实参", async () => {
    const result = await runWithInputs(chapter13.chapterTasks[0].referenceSolution, ["30", "30", "30", "30", "30"]);
    expect(result.outputs.slice(-2)).toEqual(["Average: 30", "Grade: F"]);
  });
});
