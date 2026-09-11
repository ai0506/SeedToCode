import { describe, expect, it } from "vitest";
import { runWithInputs } from "@caie-pseudocode/exercise";
import { chapter15 } from "../src/chapter-15.js";
import { chapter14 } from "../src/chapter-14.js";
import { course } from "../src/course.js";
import { expectedOutputs, sampleTranscripts } from "../src/expected-outputs.js";
import { verifyChapter } from "./shared.js";

verifyChapter({ chapter: chapter15, course: course.chapters, expectedOutputs, sampleTranscripts, conceptOnly: true });

describe("Chapter 15 — 大纲落点", () => {
  it("六节，概念章：整章没有伪代码题，也不引入新特征", () => {
    expect(chapter15.prerequisites).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);
    expect(chapter15.sections.map((section) => section.id)).toEqual(["15.1", "15.2", "15.3", "15.4", "15.5", "15.6"]);
    expect(chapter15.chapterTasks).toHaveLength(0);
    for (const section of chapter15.sections) {
      expect(section.blocks.filter((block) => block.kind === "task"), `${section.id} 不该有伪代码题`).toHaveLength(0);
    }
    const afterChapter14 = [...chapter14.sections.at(-1)!.taughtFeatures].sort();
    for (const section of chapter15.sections) {
      expect([...section.taughtFeatures].sort(), `${section.id} 引入了新特征`).toEqual(afterChapter14);
    }
  });
});

describe("Chapter 15 — 示例真的描述得出那几种结构", () => {
  it("链表按 NextAt 走出来的顺序和它们在数组里的位置无关——15.4 靠这条", async () => {
    const example = chapter15.sections
      .find((section) => section.id === "15.4")!
      .blocks.find((block) => block.kind === "example")!;
    const run = await runWithInputs(example.code, []);
    expect(run.outputs).toEqual(["Ada", "Bob", "Cal"]);
    // 数据放在第 1、4、2 格，顺序完全由 NextAt 决定
    expect(example.code).toContain("NextAt[1] ← 4");
    expect(example.code).toContain("NextAt[4] ← 2");
  });

  it("栈 pop 之后那一格的值还在，只是不再算数——15.5 的第一个示例靠这条", async () => {
    const example = chapter15.sections
      .find((section) => section.id === "15.5")!
      .blocks.filter((block) => block.kind === "example")[0];
    const run = await runWithInputs(example.code, []);
    expect(run.outputs.slice(-2)).toEqual(["After one pop, top holds 20", "Slot 3 still holds 30"]);
  });

  it("队列出队只挪 Front，数据一格都不动——15.5 的第二个示例与关卡靠这条", async () => {
    const example = chapter15.sections
      .find((section) => section.id === "15.5")!
      .blocks.filter((block) => block.kind === "example")[1];
    const run = await runWithInputs(example.code, []);
    expect(run.outputs).toEqual(["Next out: Ada", "Next out: Bob", "Front is 2, Rear is 3"]);
  });
});
