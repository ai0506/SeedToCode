import { chapter01 } from "./chapter-01.js";
import { chapter02 } from "./chapter-02.js";
import { chapter03 } from "./chapter-03.js";
import { chapter04 } from "./chapter-04.js";
import { chapter05 } from "./chapter-05.js";
import { chapter06 } from "./chapter-06.js";
import { chapter07 } from "./chapter-07.js";
import { chapter08 } from "./chapter-08.js";
import { chapter09 } from "./chapter-09.js";
import { chapter10 } from "./chapter-10.js";
import { chapter11 } from "./chapter-11.js";
import type { Chapter, ChapterTask, Section, Task } from "./types.js";

/**
 * 课程索引。编号规则见 teaching/01-CURRICULUM.md：
 * 全课程 Chapter 1–23 一条连续编号，AS = 1–16，A Level = 17–23。
 * 这里只登记已经写好的章。
 */
export const course = {
  syllabusVersion: "CAIE 9618 (2027–2029)",
  chapters: [chapter01, chapter02, chapter03, chapter04, chapter05, chapter06, chapter07, chapter08, chapter09, chapter10, chapter11] as Chapter[]
};

export const allChapters = course.chapters;

export function findSection(sectionId: string): { chapter: Chapter; section: Section } | undefined {
  for (const chapter of course.chapters) {
    const section = chapter.sections.find((candidate) => candidate.id === sectionId);
    if (section) return { chapter, section };
  }
  return undefined;
}

/** 全部伪代码题（小节题 + 章末大题），按章节顺序。 */
export function allTasks(): Array<{ chapter: Chapter; section?: Section; task: Task | ChapterTask }> {
  const items: Array<{ chapter: Chapter; section?: Section; task: Task | ChapterTask }> = [];
  for (const chapter of course.chapters) {
    for (const section of chapter.sections) {
      for (const block of section.blocks) {
        if (block.kind === "task") items.push({ chapter, section, task: block });
      }
    }
    for (const task of chapter.chapterTasks) items.push({ chapter, task });
  }
  return items;
}
