import { describe, expect, it } from "vitest";
import { analyzeSource } from "@caie-pseudocode/language";
import { executeSource } from "@caie-pseudocode/runtime";
import { runWithInputs } from "@caie-pseudocode/exercise";
import { chapter05 } from "../src/chapter-05.js";
import { course } from "../src/course.js";
import { expectedOutputs, sampleTranscripts } from "../src/expected-outputs.js";
import { verifyChapter } from "./shared.js";

verifyChapter({ chapter: chapter05, course: course.chapters, expectedOutputs, sampleTranscripts });

describe("Chapter 5 — 大纲落点", () => {
  it("承接前四章，六个知识点合成五节", () => {
    expect(chapter05.prerequisites).toEqual([1, 2, 3, 4]);
    expect(chapter05.sections.map((section) => section.id)).toEqual(["5.1", "5.2", "5.3", "5.4", "5.5"]);
    expect(chapter05.chapterTasks).toHaveLength(1);
  });

  it("闸门按小节逐个放开三种循环", () => {
    const taught = (id: string) => chapter05.sections.find((section) => section.id === id)!.taughtFeatures;
    expect(taught("5.1")).toContain("loop.for");
    expect(taught("5.1")).not.toContain("loop.for-step");
    expect(taught("5.2")).toContain("loop.for-step");
    expect(taught("5.2")).not.toContain("loop.while");
    expect(taught("5.3")).toContain("loop.while");
    expect(taught("5.3")).not.toContain("loop.repeat");
    expect(taught("5.4")).toContain("loop.repeat");
  });
});

describe("Chapter 5 — 讲的规则和引擎的行为一致", () => {
  const run = (source: string) => analyzeSource(source).diagnostics;

  it("方向写反的 FOR 合法但一遍都不跑——5.2 的关卡靠这条", async () => {
    const source = 'DECLARE I : INTEGER\nFOR I ← 10 TO 1\n   OUTPUT I\nNEXT I\nOUTPUT "Done"';
    expect(run(source)).toHaveLength(0);
    expect((await runWithInputs(source, [])).outputs).toEqual(["Done"]);
  });

  it("STEP 0 在运行前就被拦下——5.2 的规则靠这条", () => {
    expect(run("DECLARE I : INTEGER\nFOR I ← 1 TO 3 STEP 0\n   OUTPUT I\nNEXT I").some((d) => d.ruleId === "FOR-002")).toBe(true);
  });

  it("循环体里改控制变量能过检查、跑到那一行才停——5.2 的反例靠这条", async () => {
    const source = "DECLARE I : INTEGER\nFOR I ← 1 TO 3\n   OUTPUT I\n   I ← I + 1\nNEXT I";
    expect(run(source).filter((d) => d.severity === "error")).toHaveLength(0);
    const result = await executeSource(source).result;
    expect(result.status).toBe("error");
    expect(result.error?.code).toBe("RT1503");
  });

  it("WHILE 可能一遍不跑、REPEAT 至少跑一遍——5.3 与 5.4 的对照靠这条", async () => {
    const pre = 'DECLARE C : INTEGER\nC ← 10\nWHILE C < 5\n   OUTPUT "In"\nENDWHILE\nOUTPUT "Done"';
    const post = 'DECLARE C : INTEGER\nC ← 10\nREPEAT\n   OUTPUT "In"\nUNTIL C > 5\nOUTPUT "Done"';
    expect((await runWithInputs(pre, [])).outputs).toEqual(["Done"]);
    expect((await runWithInputs(post, [])).outputs).toEqual(["In", "Done"]);
  });

  it("5.T1 的参考解在第一个就是哨兵时给出「一个都没有」", async () => {
    const task = chapter05.chapterTasks[0];
    expect((await runWithInputs(task.referenceSolution, ["-1"])).outputs).toEqual(["Enter a score", "No scores"]);
  });
});
