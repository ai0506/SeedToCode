import type { Constraints, FeatureId } from "@caie-pseudocode/exercise";

/**
 * 教学内容的数据模型。
 *
 * 内容文件里不出现任何 HTML 或渲染逻辑。正文允许的行内标记只有两种：
 *   `code`   —— 伪代码关键字、标识符、字面量
 *   **bold** —— 术语与规则的强调
 * 规格见 teaching/02-CONTENT_SPEC.md。
 */

export type Level = "AS" | "A";

export type Callout = {
  /**
   * 规则来源，决定标签怎么写：
   *   CAIE       考纲或 Pseudocode Guide 明确规定
   *   convention Guide 没有规定，但正式发布的伪代码范例一律这么写
   *   editor     本编辑器的运行约定（Cambridge 未定义，但程序要跑就得有个说法）
   */
  source: "CAIE" | "convention" | "editor";
  text: string;
};

export type Explanation = {
  kind: "explanation";
  paragraphs: string[];
  callouts?: Callout[];
};

export type Annotation = {
  fromLine: number;
  toLine: number;
  text: string;
};

export type Example = {
  kind: "example";
  title: string;
  fileName: string;
  code: string;
  annotations: Annotation[];
  /** 示例运行。inputs 按顺序喂给 INPUT；outputs 由引擎实跑校验。 */
  sampleRun?: { inputs: string[]; outputs: string[] };
};

/** 反例中的一段独立代码：可在静态检查阶段被拦下，也可在运行时才失败。 */
export type CounterExampleCase = {
  title?: string;
  code: string;
  note: string;
  expectDiagnostics?: Array<{
    severity: "error" | "caie" | "hint";
    ruleId: string;
    /** 出错行（1-based）。 */
    line: number;
    /** 学生看到的说明。 */
    text: string;
  }>;
  /** 代码能通过静态检查、但实际执行到此行才停止的情形。 */
  expectRuntimeError?: {
    code: string;
    /** 出错行（1-based）。 */
    line: number;
    /** 学生看到的说明。 */
    text: string;
  };
};

/** 故意写错的代码。不进「零错误」校验；同一概念可并列几个很短的情形。 */
export type CounterExample = {
  kind: "counterExample";
  title: string;
  cases: CounterExampleCase[];
};

export type Option = {
  key: string;
  label: string;
  correct: boolean;
  /** 每一项都必填，且要能单独成段——学生选中它时会单独展示这一段。 */
  explanation: string;
};

export type QuizLine = {
  code: string;
  answer?: boolean;
  /** 非答案行写「这一行为什么没问题、它的作用是什么」。 */
  explanation: string;
};

export type Quiz =
  | { kind: "quiz"; type: "single-choice" | "true-false"; prompt: string; code?: string; options: Option[] }
  | { kind: "quiz"; type: "click-line"; prompt: string; lines: QuizLine[] }
  | {
      kind: "quiz";
      type: "fill-blank";
      prompt: string;
      /** 用 `__1__`、`__2__` 标出空位。 */
      template: string;
      blanks: Array<{ index: number; answer: string }>;
      bank: Array<{ word: string; explanation: string }>;
    };

export type TaskTest = {
  id: string;
  kind: "normal" | "boundary" | "extreme" | "abnormal";
  inputs: string[];
  /** 描述情形，不给数值。失败时展示给学生。 */
  caseHint: string;
};

export type Task = {
  kind: "task";
  id: string;
  title: string;
  statement: string;
  ioSpec: { input: string; output: string };
  constraints?: Constraints;
  /** 1–3 条，逐条展开；任何一条都不给完整答案。 */
  hints: string[];
  /** 题面示例，公开展示。其输入不得与任何判题用例相同。 */
  examples: Array<{ inputs: string[]; outputs: string[] }>;
  /** 编辑器预先提供且不可修改的代码；提交时自动放在学生作答前。 */
  lockedStarterCode?: string;
  /** 学生可以编辑的初始内容。 */
  starterCode?: string;
  /** 不展示给学生；期望输出由它跑出来。 */
  referenceSolution: string;
  tests: TaskTest[];
};

/** 章末大题只用软约束：通过语法与全部用例即算过，没用到的知识点只提示。 */
export type ChapterTask = Omit<Task, "kind" | "constraints"> & {
  kind: "chapterTask";
  suggestedFeatures: FeatureId[];
};

/**
 * 并排对照：同一件事用不同写法表达。
 * 用来回答「为什么要有伪代码」——参照系是**自然语言**与**真实编程语言**，
 * 不是某一种自然语言（拿中文当参照会把「语言差异」误当成「记法差异」）。
 */
export type Comparison = {
  kind: "comparison";
  title: string;
  intro?: string;
  panes: Array<{
    label: string;
    /**
     * pseudocode 栏会送进引擎校验并受知识点闸门约束；其余栏不校验。
     * `diagram` 是流程图、结构图这类需要等宽字体、一个字都不能换行的图（考纲 §9.2、§12.2
     * 要求会读这两种图）——它和 `natural` 的区别是排版，不是内容：`natural` 是散文，会折行。
     */
    language: "natural" | "pseudocode" | "python" | "diagram";
    code: string;
    note: string;
  }>;
};

/** 保留原始 Markdown 的只读草稿块；它不参与判题。 */
export type Draft = {
  kind: "draft";
  markdown: string;
};

export type Block = Explanation | Example | CounterExample | Comparison | Quiz | Task | Draft;

export type Section = {
  id: string;
  title: string;
  syllabus: string[];
  estimatedMinutes: number;
  /** 学完这一小节之后，学生总共学过的特征。用于知识点闸门。 */
  taughtFeatures: FeatureId[];
  blocks: Block[];
};

export type Chapter = {
  id: number;
  title: string;
  level: Level;
  syllabus: string[];
  /** 前置章节编号。 */
  prerequisites: number[];
  sections: Section[];
  chapterTasks: ChapterTask[];
};

/** 期望输出快照：`${taskId}/${testId}` → 参考解在该组输入下的输出。 */
export type ExpectedOutputs = Record<string, string[]>;

/**
 * 示例代码的运行实录：`${sectionId}/${fileName}` → 输出与输入按真实顺序交错。
 * 由引擎实跑生成，不手写——否则很容易写成「先列输入再列输出」，
 * 而那正好和程序真实的执行顺序相反。
 */
export type SampleTranscripts = Record<string, Array<{ kind: "output" | "input"; text: string }>>;
