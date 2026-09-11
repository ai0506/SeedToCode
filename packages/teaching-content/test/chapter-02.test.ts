import { describe, expect, it } from "vitest";
import { chapter02 } from "../src/chapter-02.js";
import { course as browserCourse } from "../src/browser.js";
import { course } from "../src/course.js";
import { expectedOutputs, sampleTranscripts } from "../src/expected-outputs.js";
import { verifyChapter } from "./shared.js";

verifyChapter({ chapter: chapter02, course: course.chapters, expectedOutputs, sampleTranscripts });

describe("Chapter 2 — 大纲落点", () => {
  it("承接 Chapter 1，并按知识密度合并为五个完整小节", () => {
    expect(chapter02.prerequisites).toEqual([1]);
    expect(chapter02.sections.map((section) => section.id)).toEqual(["2.1", "2.2", "2.3", "2.4", "2.5"]);
    expect(chapter02.chapterTasks).toHaveLength(1);
  });

  it("最后一节覆盖变量、六种基本类型、字面量、赋值与常量", () => {
    expect(chapter02.sections.at(-1)?.taughtFeatures).toEqual(
      expect.arrayContaining([
        "decl.variable", "decl.constant", "assign.simple",
        "type.integer", "type.real", "type.char", "type.string", "type.boolean", "type.date",
        "literal.integer", "literal.real", "literal.char", "literal.string", "literal.boolean", "literal.date"
      ])
    );
  });

  it("浏览器课程数据包含 Chapter 2", () => {
    expect(browserCourse.chapters.map((chapter) => chapter.id)).toContain(2);
  });

  it("章末题预置的常量不可编辑", () => {
    const task = chapter02.chapterTasks[0];
    expect(task.lockedStarterCode).toBe("CONSTANT PassMark = 50");
    expect(task.starterCode).toBe("");
  });
});
