import { analyzeSource, type AnalyzeOptions, type Diagnostic } from "@caie-pseudocode/language";
import { executeSource, type ExecutionOptions } from "@caie-pseudocode/runtime";
import { compareOutputs, type ComparisonOptions, type DiffKind } from "./compare.js";
import { AHEAD_EXEMPT_FEATURES, extractFeatures, type FeatureId } from "./features.js";
import { findCodeNotes, type CodeNote } from "./notes.js";

/**
 * 判题编排：L0 静态阻断错误 → L1 构造约束 → L2 功能测试 → L3 规范建议。
 * 前一层不通过就不进入下一层；L3 永远不影响通过判定。
 * 规则见 teaching/03-EXERCISE_SPEC.md。
 */

export type Constraint = {
  feature: FeatureId;
  /** 至少出现多少次。当前只区分「有 / 没有」，保留字段以便后续按次数判定。 */
  min?: number;
  /** 为什么有这条要求。会原样展示给学生，必填。 */
  reason: string;
};

export type Constraints = {
  require?: Constraint[];
  forbid?: Constraint[];
  requireAnyOf?: Array<{ features: FeatureId[]; reason: string }>;
};

export type TestCase = {
  id: string;
  kind: "normal" | "boundary" | "extreme" | "abnormal";
  inputs: string[];
  /** 描述这组数据在考什么，不含具体数值。失败时展示给学生。 */
  caseHint: string;
  expected: string[];
};

export type GradeInput = {
  source: string;
  constraints?: Constraints;
  tests: TestCase[];
  comparison?: ComparisonOptions;
  analyze?: AnalyzeOptions;
  execute?: ExecutionOptions;
  /** 允许使用的特征；给出时，用到之外的特征只产生提示，不影响判定。 */
  taughtFeatures?: FeatureId[];
};

export type ConstraintResult = {
  feature: FeatureId;
  kind: "require" | "forbid" | "requireAnyOf";
  satisfied: boolean;
  reason: string;
};

export type TestResult = {
  id: string;
  kind: TestCase["kind"];
  caseHint: string;
  passed: boolean;
  status: string;
  firstDiffLine: number | null;
  /** 对不上的是哪一类：文字、数据，还是行数。用来给出有指向的反馈。 */
  diffKind: DiffKind | null;
  /**
   * 程序跑到一半停了时，停在哪儿、为什么。
   * 这说的是学生自己的代码，不泄露判题用的数据——没有它，界面只能说
   * 「程序中途出错了，先看看错误提示」，而学生根本找不到那个提示。
   */
  runtimeError: { code: string; messageKey: string; args?: Record<string, unknown>; line: number } | null;
  /** 下面三项只在揭示阈值到达后才展示；判题本身始终计算。 */
  inputs: string[];
  expected: string[];
  actual: string[];
};

export type GradeResult = {
  passed: boolean;
  failedLayer: "L0" | "L1" | "L2" | null;
  diagnostics: Diagnostic[];
  constraintResults: ConstraintResult[];
  testResults: TestResult[];
  styleNotes: Diagnostic[];
  /** 这份解答实际用到的全部特征。章末大题用它算「建议用到」的覆盖度。 */
  usedFeatures: FeatureId[];
  /** 用到了但当前小节还没教的特征。只提示，不影响判定。 */
  aheadFeatures: FeatureId[];
  /** 语法合法、但很可能不是学生本意的写法。只在没通过时展示，不影响判定。 */
  codeNotes: CodeNote[];
};

const EMPTY: GradeResult = {
  passed: false,
  failedLayer: null,
  diagnostics: [],
  constraintResults: [],
  testResults: [],
  styleNotes: [],
  usedFeatures: [],
  aheadFeatures: [],
  codeNotes: []
};

/**
 * L0 失败时，把「排在第一条阻断错误之前」的规范提示一起交出去。
 *
 * 撞到的情形：写完文件忘了 `CLOSEFILE` 就 `OPENFILE ... FOR READ`。真正的原因
 * （同一个文件还开着，而且是按写的方式开的）只是一条 `caie`，被这里滤掉了；
 * 学生看见的是它的两个下游后果——`EOF` 和 `READFILE` 说「必须处于 READ 模式」，
 * 而那两行本身一点毛病都没有。
 *
 * 排在错误后面的规范提示不带出来：那些是改完这一条之后才轮得到看的。
 * 格式类（`FMT-*`）也不带：缩进和大写从来不会是某个错误的成因，它们属于 L3。
 */
function withEarlierCauses(blocking: Diagnostic[], others: Diagnostic[]): Diagnostic[] {
  const firstLine = Math.min(...blocking.map((diagnostic) => diagnostic.range.start.line));
  const causes = others.filter(
    (diagnostic) => diagnostic.range.start.line < firstLine && !diagnostic.ruleId.startsWith("FMT-")
  );
  if (causes.length === 0) return blocking;
  return [...causes, ...blocking].sort((left, right) => left.range.start.line - right.range.start.line);
}

export async function grade(input: GradeInput): Promise<GradeResult> {
  const analysis = analyzeSource(input.source, input.analyze);
  const blocking = analysis.diagnostics.filter((diagnostic) => diagnostic.severity === "error");
  const styleNotes = analysis.diagnostics.filter((diagnostic) => diagnostic.severity !== "error");

  if (blocking.length > 0) {
    return { ...EMPTY, failedLayer: "L0", diagnostics: withEarlierCauses(blocking, styleNotes) };
  }

  const features = extractFeatures(analysis.program);
  const codeNotes = findCodeNotes(analysis.program);
  const aheadFeatures = input.taughtFeatures
    ? [...features].filter((feature) => !AHEAD_EXEMPT_FEATURES.has(feature) && !input.taughtFeatures!.includes(feature))
    : [];

  const constraintResults = evaluateConstraints(features, input.constraints);
  if (constraintResults.some((result) => !result.satisfied)) {
    return { ...EMPTY, failedLayer: "L1", constraintResults, styleNotes, usedFeatures: [...features], aheadFeatures, codeNotes };
  }

  const testResults: TestResult[] = [];
  for (const testCase of input.tests) {
    testResults.push(await runCase(input, testCase));
  }

  const failed = testResults.some((result) => !result.passed);
  return {
    passed: !failed,
    failedLayer: failed ? "L2" : null,
    diagnostics: [],
    constraintResults,
    testResults,
    styleNotes,
    usedFeatures: [...features],
    aheadFeatures,
    codeNotes
  };
}

function evaluateConstraints(features: Set<FeatureId>, constraints?: Constraints): ConstraintResult[] {
  if (!constraints) return [];
  const results: ConstraintResult[] = [];
  for (const item of constraints.require ?? []) {
    results.push({ feature: item.feature, kind: "require", satisfied: features.has(item.feature), reason: item.reason });
  }
  for (const item of constraints.forbid ?? []) {
    results.push({ feature: item.feature, kind: "forbid", satisfied: !features.has(item.feature), reason: item.reason });
  }
  for (const group of constraints.requireAnyOf ?? []) {
    const satisfied = group.features.some((feature) => features.has(feature));
    results.push({ feature: group.features[0], kind: "requireAnyOf", satisfied, reason: group.reason });
  }
  return results;
}

/** 一次运行的实录：输出与输入按真实发生顺序排好。 */
export type TranscriptEntry = { kind: "output" | "input"; text: string };

/** 跑一组输入。输入按顺序喂给 INPUT；程序要的比给的多即判失败。 */
export async function runWithInputs(
  source: string,
  inputs: string[],
  options: ExecutionOptions = {}
): Promise<{
  status: string;
  outputs: string[];
  exhausted: boolean;
  transcript: TranscriptEntry[];
  error: { code: string; messageKey: string; args?: Record<string, unknown>; line: number } | null;
}> {
  let cursor = 0;
  let exhausted = false;
  const transcript: TranscriptEntry[] = [];
  // input-accepted 是在 provideInput 内部同步触发的，那时 cursor 还没前进，
  // 所以先把正在提交的值记下来，别去反推下标。
  let pending = "";
  const controller = executeSource(source, {
    maxSteps: 200_000,
    maxOutputLines: 500,
    ...options,
    onEvent(event) {
      options.onEvent?.(event);
      if (event.type === "output-written") {
        transcript.push({ kind: "output", text: String((event.data as { text?: unknown }).text ?? "") });
        return;
      }
      if (event.type === "input-accepted") {
        transcript.push({ kind: "input", text: pending });
        return;
      }
      if (event.type !== "input-requested") return;
      if (cursor >= inputs.length) {
        exhausted = true;
        controller.stop();
        return;
      }
      pending = inputs[cursor];
      const submission = controller.provideInput(pending);
      cursor += 1;
      if (!submission.accepted && cursor >= inputs.length) {
        exhausted = true;
        controller.stop();
      }
    }
  });
  const result = await controller.result;
  const failure = result.error
    ? {
        code: result.error.code,
        messageKey: result.error.messageKey,
        ...(result.error.args ? { args: result.error.args as Record<string, unknown> } : {}),
        line: result.error.range.start.line
      }
    : null;
  return { status: result.status, outputs: result.outputs, exhausted, transcript, error: failure };
}

async function runCase(input: GradeInput, testCase: TestCase): Promise<TestResult> {
  const run = await runWithInputs(input.source, testCase.inputs, input.execute);
  const comparison = compareOutputs(testCase.expected, run.outputs, input.comparison, testCase.inputs);
  return {
    id: testCase.id,
    kind: testCase.kind,
    caseHint: testCase.caseHint,
    passed: run.status === "completed" && !run.exhausted && comparison.matches,
    status: run.exhausted ? "input-exhausted" : run.status,
    firstDiffLine: comparison.firstDiffLine,
    diffKind: comparison.diffKind,
    runtimeError: run.error,
    inputs: testCase.inputs,
    expected: testCase.expected,
    actual: run.outputs
  };
}
