import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { analyzeSource } from "@caie-pseudocode/language";
import { extractFeatures, findUnpromptedInputs, grade, runWithInputs, type FeatureId } from "@caie-pseudocode/exercise";
import { executeSource } from "@caie-pseudocode/runtime";
import type {
  Block,
  Chapter,
  ChapterTask,
  Example,
  ExpectedOutputs,
  Quiz,
  SampleTranscripts,
  Section,
  Task
} from "../src/types.js";

/**
 * 所有章节共用的内容守门人。
 *
 * 各 chapter-NN.test.ts 只保留大纲断言和该章特有的教学判断；这里守住
 * 所有章节都必须满足的结构、可运行性、题目和写作约束。这样新增章节时
 * 不会复制 Chapter 1 的硬编码测试再让两份规则慢慢分叉。
 */

export type ChapterVerification = {
  chapter: Chapter;
  /** 已按课程顺序登记的章节；用于跨章节的知识点闸门。 */
  course: Chapter[];
  expectedOutputs: ExpectedOutputs;
  sampleTranscripts: SampleTranscripts;
};

const BANNED_PHRASES = [
  "易错",
  "常见错误",
  "容易搞混",
  "常考",
  "必考",
  "必背",
  "考试技巧",
  "考点",
  "引擎校验",
  "语法树",
  "判题用例",
  "Editor Runtime",
  "CI ",
  "软约束",
  "硬约束",
  "L0",
  "L1",
  "L2",
  "L3"
];

type GlossaryEntry = { chinese: string; english: string; firstChapter: number };

function readGlossary(): GlossaryEntry[] {
  const source = readFileSync(fileURLToPath(new URL("../../../teaching/05-GLOSSARY.md", import.meta.url)), "utf8");
  return [...source.matchAll(/^\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*(\d+)\s*\|$/gmu)].map((match) => ({
    chinese: match[1].trim(),
    english: match[2].trim(),
    firstChapter: Number(match[3])
  }));
}

function blocksOf<K extends Block["kind"]>(chapter: Chapter, kind: K): Array<{ section: Section; block: Extract<Block, { kind: K }> }> {
  const items: Array<{ section: Section; block: Extract<Block, { kind: K }> }> = [];
  for (const section of chapter.sections) {
    for (const block of section.blocks) {
      if (block.kind === kind) items.push({ section, block: block as Extract<Block, { kind: K }> });
    }
  }
  return items;
}

function tasksOf(chapter: Chapter): Array<{ section?: Section; task: Task | ChapterTask }> {
  const tasks: Array<{ section?: Section; task: Task | ChapterTask }> = [];
  for (const section of chapter.sections) {
    for (const block of section.blocks) if (block.kind === "task") tasks.push({ section, task: block });
  }
  for (const task of chapter.chapterTasks) tasks.push({ task });
  return tasks;
}

function quizExplanations(quiz: Quiz): string[] {
  if (quiz.type === "click-line") return quiz.lines.map((line) => line.explanation);
  if (quiz.type === "fill-blank") return quiz.bank.map((item) => item.explanation);
  return quiz.options.map((option) => option.explanation);
}

function studentVisibleTexts(chapter: Chapter): string[] {
  const texts: string[] = [];
  const pushTask = (task: Task | ChapterTask) => {
    texts.push(task.title, task.statement, task.ioSpec.input, task.ioSpec.output, ...task.hints);
    for (const test of task.tests) texts.push(test.caseHint);
    if ("constraints" in task && task.constraints) {
      for (const item of task.constraints.require ?? []) texts.push(item.reason);
      for (const item of task.constraints.forbid ?? []) texts.push(item.reason);
      for (const item of task.constraints.requireAnyOf ?? []) texts.push(item.reason);
    }
  };

  for (const section of chapter.sections) {
    texts.push(section.title);
    for (const block of section.blocks) {
      switch (block.kind) {
        case "explanation":
          texts.push(...block.paragraphs, ...(block.callouts ?? []).map((callout) => callout.text));
          break;
        case "example":
          texts.push(block.title, ...block.annotations.map((annotation) => annotation.text));
          break;
        case "counterExample":
          texts.push(block.title, ...block.cases.flatMap((item) => [item.title ?? "", item.note, ...(item.expectDiagnostics ?? []).map((diagnostic) => diagnostic.text), item.expectRuntimeError?.text ?? ""]));
          break;
        case "comparison":
          texts.push(block.title, block.intro ?? "", ...block.panes.map((pane) => pane.note));
          break;
        case "quiz":
          texts.push(block.prompt, ...quizExplanations(block));
          break;
        case "task":
          pushTask(block);
          break;
      }
    }
  }
  for (const task of chapter.chapterTasks) pushTask(task);
  return texts;
}

function featuresAvailableBefore(chapter: Chapter, course: Chapter[]): FeatureId[] {
  const prior = course.filter((item) => item.id < chapter.id);
  const last = prior.at(-1)?.sections.at(-1);
  return last ? last.taughtFeatures : [];
}

export function verifyChapter(verification: ChapterVerification): void {
  const { chapter, course, expectedOutputs, sampleTranscripts } = verification;
  const sections = chapter.sections;
  const examples = blocksOf(chapter, "example");
  const counters = blocksOf(chapter, "counterExample");
  const comparisons = blocksOf(chapter, "comparison");
  const quizzes = blocksOf(chapter, "quiz");
  const tasks = tasksOf(chapter);
  const taughtBySection = new Map<string, FeatureId[]>(sections.map((section) => [section.id, section.taughtFeatures]));
  const allTexts = studentVisibleTexts(chapter);

  describe(`Chapter ${chapter.id} — 通用结构`, () => {
    it("每个小节恰好一段讲解、一个关卡，且篇幅受控", () => {
      let paragraphs = 0;
      let blocks = 0;
      let minutes = 0;
      for (const section of sections) {
        const explanations = section.blocks.filter((block) => block.kind === "explanation");
        const sectionQuizzes = section.blocks.filter((block) => block.kind === "quiz");
        expect(explanations, `${section.id} 讲解块数`).toHaveLength(1);
        expect(sectionQuizzes, `${section.id} 关卡数`).toHaveLength(1);
        for (const explanation of explanations) {
          expect(explanation.paragraphs.length, `${section.id} 讲解段落过多`).toBeLessThanOrEqual(5);
          paragraphs += explanation.paragraphs.length;
        }
        blocks += section.blocks.length;
        minutes += section.estimatedMinutes;
      }
      // 整章的三条上限都跟着小节数走，不写死一个数字：前三章的知识密度低，
      // 16 段 / 16 块 / 45 分钟够用；数组、过程、文件这些章本身就更复杂，
      // 定值会逼着后面的章节把该讲的东西挤掉。
      // 真正卡住「用格式撑内容」的是「每节 ≤ 5 段、每节恰好一个关卡」这两条，
      // 它们是按节算的，不会因为章变长而松掉。
      const paragraphBudget = chapter.sections.length * 4;
      const blockBudget = chapter.sections.length * 4;
      const minuteBudget = chapter.sections.length * 10;
      expect(paragraphs, `Chapter ${chapter.id} 讲解段落总数（上限 ${paragraphBudget}）`).toBeLessThanOrEqual(paragraphBudget);
      expect(blocks, `Chapter ${chapter.id} 内容块数（上限 ${blockBudget}）`).toBeLessThanOrEqual(blockBudget);
      expect(minutes, `Chapter ${chapter.id} 预计分钟数（上限 ${minuteBudget}）`).toBeLessThanOrEqual(minuteBudget);
    });

    it("知识点闸门在全课程中只增不减", () => {
      let previous = featuresAvailableBefore(chapter, course);
      for (const section of sections) {
        for (const feature of previous) {
          expect(section.taughtFeatures, `${section.id} 丢掉了先前已教的 ${feature}`).toContain(feature);
        }
        previous = section.taughtFeatures;
      }
    });
  });

  describe(`Chapter ${chapter.id} — 示例与反例`, () => {
    it("每一段示例代码均零阻断错误、零 CAIE 诊断，且不超前", () => {
      expect(examples.length, "示例数量").toBeGreaterThan(0);
      for (const { section, block } of examples) {
        const analysis = analyzeSource(block.code);
        expect(analysis.diagnostics.filter((item) => item.severity === "error"), `${section.id}《${block.title}》`).toHaveLength(0);
        expect(analysis.diagnostics.filter((item) => item.severity === "caie"), `${section.id}《${block.title}》`).toHaveLength(0);
        const ahead = [...extractFeatures(analysis.program)].filter((feature) => !(taughtBySection.get(section.id) ?? []).includes(feature));
        expect(ahead, `${section.id}《${block.title}》提前用到 ${ahead.join(", ")}`).toHaveLength(0);
        expect(findUnpromptedInputs(analysis.program), `${section.id}《${block.title}》有未提示的 INPUT`).toHaveLength(0);
        const lineCount = block.code.split("\n").length;
        for (const annotation of block.annotations) {
          expect(annotation.fromLine).toBeGreaterThanOrEqual(1);
          expect(annotation.toLine).toBeLessThanOrEqual(lineCount);
          expect(annotation.fromLine).toBeLessThanOrEqual(annotation.toLine);
        }
      }
    });

    it("示例运行快照和实录均来自真实执行", async () => {
      for (const { section, block } of examples.filter((item) => item.block.sampleRun)) {
        const run = await runWithInputs(block.code, block.sampleRun!.inputs);
        expect(run.status, `${section.id}《${block.title}》`).toBe("completed");
        expect(run.exhausted).toBe(false);
        expect(run.outputs).toEqual(block.sampleRun!.outputs);
        const transcript = sampleTranscripts[`${section.id}/${block.fileName}`];
        expect(transcript, `${section.id}/${block.fileName} 缺少实录`).toBeDefined();
        if (block.sampleRun!.inputs.length > 0) expect(transcript[0]?.kind).toBe("output");
        expect(transcript.filter((entry) => entry.kind === "output").map((entry) => entry.text)).toEqual(block.sampleRun!.outputs);
      }
    });

    it("每个反例都会在标明的阶段被拦下", async () => {
      for (const { section, block } of counters) {
        expect(block.cases, `${section.id}《${block.title}》没有反例`).not.toHaveLength(0);
        for (const item of block.cases) {
          const diagnostics = analyzeSource(item.code).diagnostics;
          for (const expected of item.expectDiagnostics ?? []) {
            expect(
              diagnostics.some((actual) => actual.ruleId === expected.ruleId && actual.severity === expected.severity && actual.range.start.line === expected.line),
              `${section.id}《${block.title}》缺少 ${expected.severity}/${expected.ruleId}@${expected.line}`
            ).toBe(true);
          }
          if (item.expectRuntimeError) {
            expect(diagnostics.filter((diagnostic) => diagnostic.severity === "error"), `${section.id}《${block.title}》不应有静态错误`).toHaveLength(0);
            const run = await executeSource(item.code).result;
            expect(run.status, `${section.id}《${block.title}》没有在运行时停止`).toBe("error");
            expect(run.error?.code, `${section.id}《${block.title}》运行时错误`).toBe(item.expectRuntimeError.code);
            expect(run.error?.range.start.line, `${section.id}《${block.title}》运行时错误行`).toBe(item.expectRuntimeError.line);
          }
        }
      }
    });

    it("并排对照只校验伪代码栏，并保证三种参照都在", () => {
      for (const { section, block } of comparisons) {
        const languages = block.panes.map((pane) => pane.language);
        expect(languages, `${section.id} 缺自然语言`).toContain("natural");
        expect(languages, `${section.id} 缺伪代码`).toContain("pseudocode");
        expect(languages.some((language) => language !== "natural" && language !== "pseudocode"), `${section.id} 缺真实语言`).toBe(true);
        for (const pane of block.panes) {
          expect(pane.note.trim().length, `${section.id}「${pane.label}」说明过短`).toBeGreaterThanOrEqual(12);
          if (pane.language !== "pseudocode") continue;
          const analysis = analyzeSource(pane.code);
          expect(analysis.diagnostics.filter((item) => item.severity !== "hint"), `${section.id} 对照伪代码`).toHaveLength(0);
          const ahead = [...extractFeatures(analysis.program)].filter((feature) => !(taughtBySection.get(section.id) ?? []).includes(feature));
          expect(ahead, `${section.id} 对照提前用到 ${ahead.join(", ")}`).toHaveLength(0);
        }
      }
    });
  });

  describe(`Chapter ${chapter.id} — 关卡与题目`, () => {
    it("所有关卡都有唯一可解释的答案", () => {
      expect(quizzes.length, "关卡数量").toBeGreaterThan(0);
      for (const { section, block } of quizzes) {
        for (const explanation of quizExplanations(block)) {
          expect(explanation.trim().length, `${section.id} 选项解释过短`).toBeGreaterThanOrEqual(12);
        }
        if (block.type === "single-choice" || block.type === "true-false") {
          expect(block.options.filter((option) => option.correct), `${section.id} 正确项`).toHaveLength(1);
        }
        if (block.type === "click-line") {
          expect(block.lines.filter((line) => line.answer), `${section.id} 答案行`).toHaveLength(1);
        }
        if (block.type === "fill-blank") {
          const words = block.bank.map((item) => item.word);
          for (const blank of block.blanks) {
            expect(words, `${section.id} 缺候选词`).toContain(blank.answer);
            expect(block.template).toContain(`__${blank.index}__`);
          }
        }
      }
    });

    it("参考解、题面示例、快照与判题用例彼此一致", async () => {
      expect(tasks.length, "伪代码题数量").toBeGreaterThan(0);
      for (const { section, task } of tasks) {
        const analysis = analyzeSource(task.referenceSolution);
        expect(analysis.diagnostics.filter((item) => item.severity === "error"), `${task.id} 参考解`).toHaveLength(0);
        const taught = section ? (taughtBySection.get(section.id) ?? []) : sections.at(-1)?.taughtFeatures ?? [];
        const ahead = [...extractFeatures(analysis.program)].filter((feature) => !taught.includes(feature));
        expect(ahead, `${task.id} 参考解提前用到 ${ahead.join(", ")}`).toHaveLength(0);
        expect(findUnpromptedInputs(analysis.program), `${task.id} 参考解有未提示的 INPUT`).toHaveLength(0);
        const tests = task.tests.map((test) => ({ ...test, expected: expectedOutputs[`${task.id}/${test.id}`] ?? [] }));
        const result = await grade({
          source: task.referenceSolution,
          constraints: task.kind === "task" ? task.constraints : undefined,
          tests
        });
        expect(result.passed, `${task.id} 参考解未通过`).toBe(true);
        const testInputs = task.tests.map((test) => JSON.stringify(test.inputs));
        for (const example of task.examples) {
          if (task.tests.some((test) => test.inputs.length > 0)) expect(testInputs).not.toContain(JSON.stringify(example.inputs));
          const run = await runWithInputs(task.referenceSolution, example.inputs);
          expect(run.outputs, `${task.id} 题面示例`).toEqual(example.outputs);
        }
        for (const test of task.tests) {
          expect(test.caseHint.trim().length, `${task.id}/${test.id} caseHint`).toBeGreaterThan(0);
          expect(/[0-9]/u.test(test.caseHint), `${task.id}/${test.id} caseHint 泄露数字`).toBe(false);
          const snapshot = expectedOutputs[`${task.id}/${test.id}`];
          expect(snapshot, `${task.id}/${test.id} 缺快照`).toBeDefined();
          expect((await runWithInputs(task.referenceSolution, test.inputs)).outputs).toEqual(snapshot);
        }
        const hasInput = task.tests.some((test) => test.inputs.length > 0);
        if (hasInput) {
          expect(task.tests.length, `${task.id} 用例数`).toBeGreaterThanOrEqual(4);
          const kinds = new Set(task.tests.map((test) => test.kind));
          expect(kinds.has("normal") && kinds.has("boundary") && kinds.has("extreme"), `${task.id} 用例覆盖`).toBe(true);
        } else {
          expect(task.tests, `${task.id} 无输入题`).toHaveLength(1);
        }
        if (task.kind === "chapterTask") {
          expect(task.suggestedFeatures.length, `${task.id} 建议特征`).toBeGreaterThan(0);
        } else {
          for (const constraint of [...(task.constraints?.require ?? []), ...(task.constraints?.forbid ?? []), ...(task.constraints?.requireAnyOf ?? [])]) {
            expect(constraint.reason.trim().length, `${task.id} 约束理由`).toBeGreaterThan(8);
          }
        }
        const starterCode = [task.lockedStarterCode, task.starterCode].filter((part): part is string => Boolean(part?.trim())).join("\n");
        if (starterCode) {
          // 起始骨架（包括锁定行）会直接参与学生的作答，它自己不能有语法错
          const starter = analyzeSource(starterCode).diagnostics.filter((d) => d.severity === "error");
          expect(starter, `${task.id} 的 starterCode 自带语法错误`).toHaveLength(0);
        }
        // 题目预置的常量代表不可变条件，不能让学生在可编辑区删改它。
        expect(task.starterCode ?? "", `${task.id} 不应在可编辑骨架里预置 CONSTANT`).not.toMatch(/^\s*CONSTANT\s+/mu);
        if (chapter.id < 2) {
          // Chapter 2 才正式教 DECLARE；此前的题可以使用变量，但必须把需要的声明锁定提供。
          const requiredDeclarations = task.referenceSolution.match(/^DECLARE\s+.+$/gmu) ?? [];
          if (requiredDeclarations.length) {
            expect(task.lockedStarterCode, `${task.id} 在讲 DECLARE 前必须锁定提供声明`).toBeDefined();
            expect(task.lockedStarterCode!.split("\n").filter((line) => /^DECLARE\s+/u.test(line))).toEqual(requiredDeclarations);
          }
        }
        expect(task.hints.length, `${task.id} 提示条数`).toBeGreaterThanOrEqual(1);
        expect(task.hints.length, `${task.id} 提示条数`).toBeLessThanOrEqual(3);
      }
    });
  });

  describe(`Chapter ${chapter.id} — 写作与术语`, () => {
    it("学生可见文本不含内部话术、规则 ID 或编造的学情", () => {
      for (const text of allTexts) {
        for (const phrase of BANNED_PHRASES) expect(text.includes(phrase), `「${phrase}」出现在：${text.slice(0, 40)}…`).toBe(false);
        expect(text.match(/\b[A-Z]{2,8}-\d{3}\b/u), `规则 ID 出现在：${text.slice(0, 40)}…`).toBeNull();
      }
    });

    it("每个用中文（English）显式引入的术语都与词汇表唯一对应", () => {
      const glossary = readGlossary();
      for (const text of allTexts) {
        for (const match of text.matchAll(/\*\*([^*（]+)（([^）]+)）\*\*/gu)) {
          const chinese = match[1].trim();
          const english = match[2].trim();
          const entry = glossary.find((item) => item.chinese === chinese && item.english === english);
          expect(entry, `「${chinese}（${english}）」未登记在 teaching/05-GLOSSARY.md`).toBeDefined();
          expect(entry!.firstChapter, `「${chinese}」在 Chapter ${chapter.id} 提前出现`).toBeLessThanOrEqual(chapter.id);
        }
      }
    });
  });
}
