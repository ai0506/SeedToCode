import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { course, type Task, type ChapterTask } from "../packages/teaching-content/dist/index.js";
import { executeSource } from "../packages/runtime/dist/index.js";
import { RECORD_CASES, ROUTINE_CASES } from "../packages/test-cases/dist/index.js";

const read = (name: string) => readFileSync(new URL(name, import.meta.url), "utf8");

describe("公开课程清理边界", () => {
  it("保留原有章节、小节、题目 ID 与关卡位置", () => {
    const before = JSON.parse(read("./fixtures/course-structure.json"));
    const current = course.chapters.map((chapter) => ({
      chapter: chapter.id,
      sections: chapter.sections.map((section) => ({
        id: section.id,
        quizPositions: section.blocks.flatMap((block, index) => block.kind === "quiz" ? [index] : []),
        tasks: section.blocks.filter((block) => block.kind === "task").map((block) => block.id)
      })),
      chapterTasks: chapter.chapterTasks.map((task) => task.id)
    }));
    expect(current).toEqual(before);
  });

  it("局部占位不把可作答题目变成空题", () => {
    const notices = [];
    let tasks = 0;
    for (const chapter of course.chapters) {
      const all: Array<Task | ChapterTask> = [...chapter.chapterTasks];
      for (const section of chapter.sections) {
        for (const block of section.blocks) {
          if (block.kind === "task") all.push(block);
          if (block.kind === "explanation") {
            for (const callout of block.callouts ?? []) {
              if (callout.status === "under-development") notices.push({ section: section.id, text: callout.text });
            }
          }
        }
      }
      for (const task of all) {
        expect(task.statement.trim(), task.id).not.toBe("");
        expect(task.referenceSolution.trim(), task.id).not.toBe("");
        expect(task.tests.length, task.id).toBeGreaterThan(0);
        tasks++;
      }
    }
    expect(tasks).toBeGreaterThan(30);
    expect(notices).toEqual([{ section: "15.5", text: "Content under development" }]);
  });
});

describe("简短自拟测试夹具的独立运行结果", () => {
  it("函数保留条件分支、参数与函数表达式，记录保留成员类型和值", async () => {
    const routine = ROUTINE_CASES.find((item) => item.id === "ROUTINE-003")!;
    const source = routine.source + "\nOUTPUT Adjust(0, 7)";
    const result = await executeSource(source).result;
    expect(result.status).toBe("completed");
    expect(result.outputs).toEqual(["20", "7"]);
    const record = await executeSource(RECORD_CASES[0].source).result;
    expect(record.status).toBe("completed");
    expect(record.outputs).toEqual(["Q"]);
  });

  it("V07 真实文件保持记录数组复制、枚举、日期字符字段和解引用可执行", async () => {
    const result = await executeSource(read("./pseudocode-samples/valid/V07_records_and_types.pseudo"), { profile: "advanced-2027" }).result;
    expect(result.status).toBe("completed");
    expect(result.outputs).toEqual(["23"]);
  });

  it("V10 真实文件保持构造参数、继承、方法更新和派生计算", async () => {
    const result = await executeSource(read("./pseudocode-samples/valid/V10_oop_class.pseudo"), { profile: "advanced-2027" }).result;
    expect(result.status).toBe("completed");
    expect(result.outputs).toEqual(["7:21"]);
  });
});
