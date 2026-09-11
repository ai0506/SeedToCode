import { describe, expect, it } from "vitest";
import { analyzeSource } from "@caie-pseudocode/language";
import { runWithInputs } from "@caie-pseudocode/exercise";
import { chapter07 } from "../src/chapter-07.js";
import { course } from "../src/course.js";
import { expectedOutputs, sampleTranscripts } from "../src/expected-outputs.js";
import { verifyChapter } from "./shared.js";

verifyChapter({ chapter: chapter07, course: course.chapters, expectedOutputs, sampleTranscripts });

describe("Chapter 7 — 大纲落点", () => {
  it("八个知识点合成六节，闸门逐节放开七个函数", () => {
    expect(chapter07.prerequisites).toEqual([1, 2, 3, 4, 5, 6]);
    expect(chapter07.sections.map((section) => section.id)).toEqual(["7.1", "7.2", "7.3", "7.4", "7.5", "7.6"]);
    const taught = (id: string) => chapter07.sections.find((section) => section.id === id)!.taughtFeatures;
    expect(taught("7.1")).not.toContain("builtin.length");
    expect(taught("7.2")).toEqual(expect.arrayContaining(["builtin.length", "builtin.mid", "builtin.right"]));
    expect(taught("7.2")).not.toContain("builtin.ucase");
    expect(taught("7.3")).toEqual(expect.arrayContaining(["builtin.ucase", "builtin.lcase"]));
    expect(taught("7.3")).not.toContain("op.concat");
    expect(taught("7.4")).toContain("op.concat");
    expect(taught("7.5")).toEqual(expect.arrayContaining(["builtin.int", "builtin.rand"]));
  });
});

describe("Chapter 7 — 讲的规则和引擎的行为一致", () => {
  const run = (source: string) => analyzeSource(source).diagnostics;

  it("长度为 1 的 STRING 既不能赋给 CHAR 也不能和它比——7.1 的两个反例靠这条", () => {
    expect(run('DECLARE C : CHAR\nDECLARE S : STRING\nS ← "a"\nC ← S').some((d) => d.ruleId === "ASSIGN-002")).toBe(true);
    expect(run("DECLARE C : CHAR\nC ← 'a'\nIF C = \"a\" THEN\n   OUTPUT \"x\"\nENDIF").some((d) => d.ruleId === "OP-003")).toBe(true);
  });

  it("MID 还回来的是 STRING，递不进 UCASE——7.3 的核心论断靠这条", () => {
    expect(run('DECLARE S : STRING\nS ← "abc"\nOUTPUT UCASE(MID(S, 1, 1))').some((d) => d.ruleId === "BUILTIN-001")).toBe(true);
    expect(run("DECLARE C : CHAR\nC ← 'a'\nOUTPUT UCASE(C)")).toHaveLength(0);
  });

  it("Guide 里没有 LEFT——7.2 的规则靠这条", () => {
    expect(run('DECLARE S : STRING\nS ← "abc"\nOUTPUT LEFT(S, 2)').some((d) => d.ruleId === "ID-002" || d.messageKey === "binding.unboundName")).toBe(true);
    expect(run('DECLARE S : STRING\nS ← "abc"\nOUTPUT MID(S, 1, 2)')).toHaveLength(0);
  });

  it("& 两边都必须是 STRING——7.4 的关卡靠这条", () => {
    expect(run('DECLARE N : INTEGER\nN ← 7\nOUTPUT "Score: " & N').some((d) => d.ruleId === "OP-005")).toBe(true);
    expect(run('DECLARE N : INTEGER\nN ← 7\nOUTPUT "Score: ", N')).toHaveLength(0);
  });

  it("INT 是截断不是四舍五入——7.5 的示例靠这条", async () => {
    const source = 'DECLARE A : INTEGER\nA ← INT(7.9)\nOUTPUT A';
    expect((await runWithInputs(source, [])).outputs).toEqual(["7"]);
  });

  it("7.T1 的参考解在编号只剩一位数字时也对", async () => {
    const run7 = await runWithInputs(chapter07.chapterTasks[0].referenceSolution, ["QQ1", "z"]);
    expect(run7.outputs).toEqual([
      "Enter the code",
      "Enter the grade",
      "Length: 3",
      "Prefix: QQ",
      "Number: 1",
      "Tag: QQ-1",
      "Grade: Z"
    ]);
  });
});
