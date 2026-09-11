import { describe, expect, it } from "vitest";
import { analyzeSource } from "@caie-pseudocode/language";
import { runWithInputs } from "@caie-pseudocode/exercise";
import { chapter11 } from "../src/chapter-11.js";
import { course } from "../src/course.js";
import { expectedOutputs, sampleTranscripts } from "../src/expected-outputs.js";
import { verifyChapter } from "./shared.js";

verifyChapter({ chapter: chapter11, course: course.chapters, expectedOutputs, sampleTranscripts });

describe("Chapter 11 — 大纲落点", () => {
  it("五节，记录在第一节就放开，数组仍然在", () => {
    expect(chapter11.prerequisites).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(chapter11.sections.map((section) => section.id)).toEqual(["11.1", "11.2", "11.3", "11.4", "11.5"]);
    const taught = chapter11.sections[0].taughtFeatures;
    expect(taught).toEqual(
      expect.arrayContaining(["decl.record-type", "record.field-access", "decl.array-1d", "array.index"])
    );
  });
});

describe("Chapter 11 — 讲的规则和引擎的行为一致", () => {
  const TBOOK = ["TYPE TBook", "   DECLARE Title : STRING", "   DECLARE Year : INTEGER", "ENDTYPE"];
  const run = (source: string) => analyzeSource(source).diagnostics;

  it("字段名和普通变量名互不相干——11.3 的示例与关卡都靠这条", async () => {
    const source = [
      ...TBOOK,
      "DECLARE Year : INTEGER",
      "DECLARE Current : TBook",
      "Year ← 2026",
      "Current.Year ← 2020",
      "OUTPUT Year, \" \", Current.Year"
    ].join("\n");
    expect(run(source)).toHaveLength(0);
    expect((await runWithInputs(source, [])).outputs).toEqual(["2026 2020"]);
  });

  it("写了不存在的字段在运行前就被拦下，没赋值的字段要到运行时才停", async () => {
    const unknown = [...TBOOK, "DECLARE Current : TBook", 'Current.Name ← "x"'].join("\n");
    expect(run(unknown).some((d) => d.ruleId === "UDT-005" && d.severity === "error")).toBe(true);

    const unset = [...TBOOK, "DECLARE Current : TBook", 'Current.Title ← "x"', "OUTPUT Current.Year"].join("\n");
    expect(run(unset).filter((d) => d.severity === "error")).toHaveLength(0);
    const result = await runWithInputs(unset, []);
    expect(result.status).toBe("error");
    expect(result.error?.code).toBe("RT1003");
  });

  it("记录数组的一格不必先整格赋值就能往字段里写——11.4 的示例靠这条", async () => {
    const source = [
      ...TBOOK,
      "DECLARE Shelf : ARRAY[1:2] OF TBook",
      'Shelf[2].Title ← "Algorithms"',
      "OUTPUT Shelf[2].Title"
    ].join("\n");
    expect(run(source)).toHaveLength(0);
    expect((await runWithInputs(source, [])).outputs).toEqual(["Algorithms"]);
  });

  it("整条记录一起交换才不会让姓名和分数错位——11.T1 靠这条", async () => {
    const run11T1 = await runWithInputs(chapter11.chapterTasks[0].referenceSolution, [
      "Ada", "80", "Bob", "55", "Cal", "91", "Dee", "70", "Eve", "55"
    ]);
    expect(run11T1.outputs.slice(-5)).toEqual(["Cal 91", "Ada 80", "Dee 70", "Bob 55", "Eve 55"]);
  });

  it("平行数组只换一半时零提示、跑得完——11.5 的关卡靠这条", async () => {
    const source = [
      "DECLARE Names : ARRAY[1:2] OF STRING",
      "DECLARE Marks : ARRAY[1:2] OF INTEGER",
      "DECLARE Temp : INTEGER",
      'Names[1] ← "Ada"',
      'Names[2] ← "Bob"',
      "Marks[1] ← 55",
      "Marks[2] ← 91",
      "Temp ← Marks[1]",
      "Marks[1] ← Marks[2]",
      "Marks[2] ← Temp",
      'OUTPUT Names[1], " ", Marks[1]'
    ].join("\n");
    expect(run(source)).toHaveLength(0);
    // 姓名没跟着换，Ada 拿到了 Bob 的分数——程序本身一点问题都没有
    expect((await runWithInputs(source, [])).outputs).toEqual(["Ada 91"]);
  });
});
