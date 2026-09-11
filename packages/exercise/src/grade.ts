import { analyzeSource, type AnalyzeOptions, type Diagnostic } from "@caie-pseudocode/language";
import { executeSource, type ExecutionOptions } from "@caie-pseudocode/runtime";
import { compareOutputs, type ComparisonOptions, type DiffKind } from "./compare.js";
import { extractFeatures, type FeatureId } from "./features.js";
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

export async function grade(input: GradeInput): Promise<GradeResult> {
  const analysis = analyzeSource(input.source, input.analyze);
  const blocking = analysis.diagnostics.filter((diagnostic) => diagnostic.severity === "error");
  const styleNotes = analysis.diagnostics.filter((diagnostic) => diagnostic.severity !== "error");

  if (blocking.length > 0) {
    return { ...EMPTY, failedLayer: "L0", diagnostics: blocking };
  }

  const features = extractFeatures(analysis.program);
  const codeNotes = findCodeNotes(analysis.program);
  const aheadFeatures = input.taughtFeatures
    ? [...features].filter((feature) => !input.taughtFeatures!.includes(feature))
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
): Promise<{ status: string; outputs: string[]; exhausted: boolean; transcript: TranscriptEntry[] }> {
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
  return { status: result.status, outputs: result.outputs, exhausted, transcript };
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
    inputs: testCase.inputs,
    expected: testCase.expected,
    actual: run.outputs
  };
}
