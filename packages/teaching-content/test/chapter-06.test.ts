import { describe, expect, it } from "vitest";
import { analyzeSource } from "@caie-pseudocode/language";
import { runWithInputs } from "@caie-pseudocode/exercise";
import { chapter06 } from "../src/chapter-06.js";
import { course } from "../src/course.js";
import { expectedOutputs, sampleTranscripts } from "../src/expected-outputs.js";
import { verifyChapter } from "./shared.js";

verifyChapter({ chapter: chapter06, course: course.chapters, expectedOutputs, sampleTranscripts });

const counterCode = chapter06.sections
  .flatMap((section) => section.blocks)
  .filter((block) => block.kind === "counterExample")
  .flatMap((block) => block.cases)[0].code;

describe("Chapter 6 — 大纲落点", () => {
  it("不引入新写法，只在 6.3 放开嵌套", () => {
    expect(chapter06.prerequisites).toEqual([1, 2, 3, 4, 5]);
    expect(chapter06.sections.map((section) => section.id)).toEqual(["6.1", "6.2", "6.3", "6.4"]);
    const taught = (id: string) => chapter06.sections.find((section) => section.id === id)!.taughtFeatures;
    expect(taught("6.1")).not.toContain("loop.nested");
    expect(taught("6.2")).not.toContain("loop.nested");
    expect(taught("6.3")).toContain("loop.nested");
  });
});

describe("Chapter 6 — 讲的规则和引擎的行为一致", () => {
  it("6.2 的反例确实跑得完、零提示，而且答案是错的", async () => {
    expect(analyzeSource(counterCode).diagnostics).toHaveLength(0);
    const run = await runWithInputs(counterCode, ["5"]);
    expect(run.status).toBe("completed");
    // 只有 5 元却买了一件，余额成了负数——这正是 6.2 要说的那件事
    expect(run.outputs).toEqual(["Enter the balance", "Bought: 1", "Left: -5"]);
  });

  it("挪走条件的那一版在同样输入下是对的", async () => {
    const fixed = chapter06.sections
      .flatMap((section) => section.blocks)
      .find((block) => block.kind === "example" && block.fileName === "Example_6_2_a.pseudocode");
    const run = await runWithInputs((fixed as { code: string }).code, ["5"]);
    expect(run.outputs).toEqual(["Enter the balance", "Bought: 0", "Left: 5"]);
  });

  it("余额够时两种写法结果相同——6.2 的关卡靠这条", async () => {
    const fixed = chapter06.sections
      .flatMap((section) => section.blocks)
      .find((block) => block.kind === "example" && block.fileName === "Example_6_2_a.pseudocode");
    const wrong = await runWithInputs(counterCode, ["25"]);
    const right = await runWithInputs((fixed as { code: string }).code, ["25"]);
    expect(wrong.outputs).toEqual(right.outputs);
  });

  it("嵌套循环的次数是乘积——6.3 的关卡靠这条", async () => {
    const source = [
      "DECLARE I : INTEGER",
      "DECLARE J : INTEGER",
      "DECLARE N : INTEGER",
      "N ← 0",
      "FOR I ← 1 TO 5",
      "   FOR J ← 1 TO 3",
      "      N ← N + 1",
      "   NEXT J",
      "NEXT I",
      'OUTPUT "Ran ", N'
    ].join("\n");
    expect((await runWithInputs(source, [])).outputs).toEqual(["Ran 15"]);
  });
});
