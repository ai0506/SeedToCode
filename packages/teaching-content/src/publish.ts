import type { Block, Chapter, ChapterTask, ExpectedOutputs, SampleTranscripts, Section, Task } from "./types.js";

/**
 * 发布给浏览器的投影。
 *
 * 导出的课程对象去掉 `referenceSolution` 字段，并把期望输出并进每条用例。
 * 这是运行时的对象投影，不是在构建前移除答案：当前浏览器入口先导入完整章节，
 * 因此生成的 teaching-content.js 仍包含参考解源码，仓库读者和浏览器使用者均可读取。
 * 不能把对象字段剥离当作答案保密措施。
 *
 * 本地判题所需的期望输出也存在浏览器里，开发者工具可以查看。
 * 「用例对学生隐藏」这条约束管的是**界面上不展示**（见 teaching/03-EXERCISE_SPEC.md 4.3），
 * 不是密码学意义上的保密。
 */
export type PublicTest = {
  id: string;
  kind: "normal" | "boundary" | "extreme" | "abnormal";
  inputs: string[];
  caseHint: string;
  expected: string[];
};

export type PublicTask = Omit<Task, "referenceSolution" | "tests"> & { tests: PublicTest[] };
export type PublicChapterTask = Omit<ChapterTask, "referenceSolution" | "tests"> & { tests: PublicTest[] };
/** 示例块另外带上由引擎实跑得到的运行实录，页面直接照它显示。 */
export type PublicExample = Extract<Block, { kind: "example" }> & {
  transcript?: Array<{ kind: "output" | "input"; text: string }>;
};
export type PublicBlock = Exclude<Block, Task | Extract<Block, { kind: "example" }>> | PublicExample | PublicTask;
export type PublicSection = Omit<Section, "blocks"> & { blocks: PublicBlock[] };
export type PublicChapter = Omit<Chapter, "sections" | "chapterTasks"> & {
  sections: PublicSection[];
  chapterTasks: PublicChapterTask[];
};

function publishTests(taskId: string, tests: Task["tests"], expected: ExpectedOutputs): PublicTest[] {
  return tests.map((test) => ({
    id: test.id,
    kind: test.kind,
    inputs: test.inputs,
    caseHint: test.caseHint,
    expected: expected[`${taskId}/${test.id}`] ?? []
  }));
}

export function toPublicChapter(
  chapter: Chapter,
  expected: ExpectedOutputs,
  transcripts: SampleTranscripts = {}
): PublicChapter {
  return {
    ...chapter,
    sections: chapter.sections.map((section) => ({
      ...section,
      blocks: section.blocks.map((block) => {
        if (block.kind === "example") {
          const transcript = transcripts[`${section.id}/${block.fileName}`];
          return transcript ? { ...block, transcript } : block;
        }
        if (block.kind !== "task") return block;
        const { referenceSolution: _hidden, tests, ...rest } = block;
        return { ...rest, tests: publishTests(block.id, tests, expected) } satisfies PublicTask;
      })
    })),
    chapterTasks: chapter.chapterTasks.map((task) => {
      const { referenceSolution: _hidden, tests, ...rest } = task;
      return { ...rest, tests: publishTests(task.id, tests, expected) } satisfies PublicChapterTask;
    })
  };
}
