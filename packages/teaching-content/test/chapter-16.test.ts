import { describe, expect, it } from "vitest";
import { analyzeSource } from "@caie-pseudocode/language";
import { extractFeatures, runWithInputs } from "@caie-pseudocode/exercise";
import { chapter16 } from "../src/chapter-16.js";
import { chapter15 } from "../src/chapter-15.js";
import { course } from "../src/course.js";
import { expectedOutputs, sampleTranscripts } from "../src/expected-outputs.js";
import { verifyChapter } from "./shared.js";

verifyChapter({ chapter: chapter16, course: course.chapters, expectedOutputs, sampleTranscripts });

describe("Chapter 16 — 大纲落点", () => {
  it("七节，AS 的收尾章，不引入任何新写法", () => {
    expect(chapter16.prerequisites).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
    expect(chapter16.sections.map((section) => section.id)).toEqual([
      "16.1", "16.2", "16.3", "16.4", "16.5", "16.6", "16.7"
    ]);
    const afterChapter15 = [...chapter15.sections.at(-1)!.taughtFeatures].sort();
    for (const section of chapter16.sections) {
      expect([...section.taughtFeatures].sort(), `${section.id} 引入了新特征`).toEqual(afterChapter15);
    }
    expect(chapter16.chapterTasks.map((task) => task.id)).toEqual(["16.T1"]);
  });

  it("AS 的十六章到此齐了，编号连续且都登记在课程里", () => {
    const asChapters = course.chapters.filter((chapter) => chapter.level === "AS");
    expect(asChapters.map((chapter) => chapter.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
  });
});

describe("Chapter 16 — 整章那道题真的一步步搭得起来", () => {
  const sectionCode = (id: string, index = 0) => {
    const example = chapter16.sections.find((section) => section.id === id)!
      .blocks.filter((block) => block.kind === "example")[index];
    return example.code;
  };

  it("16.4 的求精结果、16.6 的选型结果、16.7 的完整解算出的是同一个平均分", async () => {
    const marks = ["80", "70", "90", "60", "100"];
    const withNames = ["Ada", "80", "Bob", "70", "Cal", "90", "Dee", "60", "Eve", "100"];
    const refined = await runWithInputs(sectionCode("16.4"), marks);
    const chosen = await runWithInputs(sectionCode("16.6"), withNames);
    const complete = await runWithInputs(chapter16.sections.find((s) => s.id === "16.7")!.blocks.filter((b) => b.kind === "example")[0].code, withNames);
    expect(refined.outputs.at(-1)).toBe("Average: 80");
    expect(chosen.outputs.at(-1)).toBe("Average: 80");
    expect(complete.outputs).toContain("Average: 80");
    expect(complete.outputs.slice(-2)).toEqual(["Cal", "Eve"]);
  });

  it("全班同分时一个人都挑不出来——16.7 的关卡靠这条", async () => {
    const complete = chapter16.sections.find((s) => s.id === "16.7")!.blocks.filter((b) => b.kind === "example")[0].code;
    const run = await runWithInputs(complete, ["Ada", "70", "Bob", "70", "Cal", "70", "Dee", "70", "Eve", "70"]);
    expect(run.status).toBe("completed");
    expect(run.outputs.at(-1)).toBe("Average: 70");
  });

  it("16.5 的对照里三栏说的是同一个算法：伪代码栏跑出来和结构化英语一致", async () => {
    const comparison = chapter16.sections.find((s) => s.id === "16.5")!.blocks.find((b) => b.kind === "comparison")!;
    const pseudo = comparison.panes.find((pane) => pane.language === "pseudocode")!;
    expect(analyzeSource(pseudo.code).diagnostics.filter((d) => d.severity !== "hint")).toHaveLength(0);
    // 结构化英语写的是「重复 3 次」「低于零度」，跑出来就该是 3 次读入、数出 2 天
    const run = await runWithInputs(pseudo.code, ["5", "-2", "-7"]);
    expect(run.outputs).toEqual([
      "Enter a temperature for day 1",
      "Enter a temperature for day 2",
      "Enter a temperature for day 3",
      "Frost days: 2"
    ]);
  });

  it("16.7.1 用的是文件那一套，16.T1 用的是记录数组那一套", () => {
    const features = (source: string) => extractFeatures(analyzeSource(source).program);
    const t1 = features(chapter16.chapterTasks[0].referenceSolution);
    const fileTask = chapter16.sections.find((section) => section.id === "16.7")!
      .blocks.find((block) => block.kind === "task")!;
    const t2 = features(fileTask.referenceSolution);
    expect([...t1]).toEqual(expect.arrayContaining(["decl.record-type", "record.field-access", "routine.function", "param.byref"]));
    expect([...t2]).toEqual(expect.arrayContaining(["file.open-write", "file.open-read", "builtin.eof", "loop.while"]));
  });
});
