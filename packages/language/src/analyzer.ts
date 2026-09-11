import { bind, type BindOptions } from "./binder.js";
import { check, type CheckOptions } from "./checker.js";
import { checkFormatting, type FormatOptions } from "./formatter.js";
import { parseSource, type ParseOptions } from "./parser.js";
import { tokenize } from "./tokenizer.js";
import { BUILTINS, KEYWORDS, TYPE_NAMES } from "@caie-pseudocode/caie-spec";
import type { BindResult, CheckResult } from "./semantic-types.js";
import type { Diagnostic } from "./types.js";

export type AnalyzeOptions = ParseOptions & BindOptions & CheckOptions & FormatOptions;

export type AnalyzeResult = {
  program: ReturnType<typeof parseSource>["program"];
  binding: BindResult;
  checking: CheckResult;
  diagnostics: Diagnostic[];
};

function analyzeBase(source: string, options: AnalyzeOptions): AnalyzeResult {
  const parsed = parseSource(source, options);
  const binding = bind(parsed.program, options);
  const checking = check(parsed.program, binding, options);
  const formatting = checkFormatting(source, options);
  const limit = Math.max(1, options.maxDiagnostics ?? 50);
  const diagnostics = [...parsed.diagnostics, ...binding.diagnostics, ...checking.diagnostics, ...formatting]
    .sort((a, b) => a.range.start.offset - b.range.start.offset || a.code.localeCompare(b.code))
    .slice(0, limit);
  return { program: parsed.program, binding, checking, diagnostics };
}

/**
 * 相邻两个字符调换位置——`STRIGN` 之于 `STRING`、`LENGHT` 之于 `LENGTH`。
 * 这是最常见的打字错误之一，但按「插入/删除/替换」算是两次编辑，会被 oneEditAway 漏掉。
 */
function oneSwapAway(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let first = -1;
  for (let index = 0; index < left.length; index += 1) {
    if (left[index] === right[index]) continue;
    if (first === -1) { first = index; continue; }
    if (index !== first + 1) return false;
    return left[first] === right[index] && left[index] === right[first] &&
      left.slice(index + 1) === right.slice(index + 1);
  }
  return false;
}

function oneEditAway(left: string, right: string): boolean {
  if (Math.abs(left.length - right.length) > 1) return false;
  let i = 0, j = 0, edits = 0;
  while (i < left.length && j < right.length) {
    if (left[i] === right[j]) { i += 1; j += 1; continue; }
    if (++edits > 1) return false;
    if (left.length > right.length) i += 1;
    else if (left.length < right.length) j += 1;
    else { i += 1; j += 1; }
  }
  return true;
}

function overlapsToken(diagnostic: Diagnostic, start: number, end: number): boolean {
  return diagnostic.range.start.offset < end && diagnostic.range.end.offset > start;
}

function keywordTypoHints(
  source: string,
  options: AnalyzeOptions,
  baselineDiagnostics: Diagnostic[],
  declaredNames: ReadonlySet<string>
): Diagnostic[] {
  const baselineErrors = baselineDiagnostics.filter(({ severity }) => severity === "error").length;
  if (baselineErrors === 0) return [];
  // 内置函数名也算进来：`LENGHT` 原本只会得到「找不到名称 LENGHT 的声明」，对初学者没有指向
  const keywordVocabulary = [...KEYWORDS, ...TYPE_NAMES];
  const builtinVocabulary = BUILTINS.map((builtin) => builtin.name);
  const tokens = tokenize(source).tokens;
  return tokens.flatMap((token, tokenIndex) => {
    if (token.kind !== "identifier" || token.text.length < 3) return [];
    // 用户自己声明过的名字永远不是拼写错误。`Mix` 是个合法的过程名，
    // 不能因为它离 `MID` 只差一个字母就建议改掉——那会把对的代码说成错的。
    if (declaredNames.has(token.text.toUpperCase())) return [];
    const upper = token.text.toUpperCase();
    // 这个词本身就是一个真名字时，它不可能是错字。`UCASE` 离 `CASE` 只差一个字母，
    // 但它是内置函数；同一行上要是还有别的错误，它就会被当成 `CASE` 的错拼报出来。
    if ((keywordVocabulary as readonly string[]).includes(upper) || builtinVocabulary.includes(upper)) return [];
    const near = (word: string) => oneEditAway(upper, word) || oneSwapAway(upper, word);

    // 内置函数名只在「确实在调用」的位置才作为候选：后面紧跟着左括号。
    // 否则会出这种事——`OUTPUT Int2` 里的 `Int2` 被建议成 `INT`。
    // 之所以骗得过下面那道闸门，是因为引擎接受裸写的内置函数名（`OUTPUT INT` 零诊断），
    // 替换之后错误确实变少了，但建议本身毫无道理。
    const nextMeaningful = tokens.slice(tokenIndex + 1).find((item) => item.kind !== "comment");
    const isCallPosition = !!nextMeaningful && nextMeaningful.text === "(";
    const candidates = [
      ...keywordVocabulary.filter(near),
      ...(isCallPosition ? builtinVocabulary.filter(near) : [])
    ];
    if (candidates.length === 0) return [];

    // 候选可能不止一个（`inpt` 既像 `INPUT` 又像 `INT`）。不要因此放弃——
    // 把每个候选替换回去各分析一遍，只有真的把错误消掉的那个才算数。
    // 恰好剩一个就采纳；剩多个说明确实分不清，宁可不说。
    const originalAtToken = baselineDiagnostics.filter((diagnostic) =>
      diagnostic.severity === "error" && /^PC[12]/.test(diagnostic.code) &&
      overlapsToken(diagnostic, token.range.start.offset, token.range.end.offset)
    ).length;

    const workable = candidates.filter((candidate) => {
      const corrected = source.slice(0, token.range.start.offset) + candidate + source.slice(token.range.end.offset);
      const correctedDiagnostics = analyzeBase(corrected, options).diagnostics;
      const correctedErrors = correctedDiagnostics.filter(({ severity }) => severity === "error").length;
      const correctedAtToken = correctedDiagnostics.filter((diagnostic) =>
        diagnostic.severity === "error" && /^PC[12]/.test(diagnostic.code) &&
        overlapsToken(diagnostic, token.range.start.offset, token.range.start.offset + candidate.length)
      ).length;
      // 原判据是「总错误变少」或「这个词上的解析错误变少」，两者满足其一即可——
      // 类型名与内置函数名拼错时报的是语义错误，不会计入后者。
      return correctedErrors < baselineErrors || correctedAtToken < originalAtToken;
    });
    if (workable.length !== 1) return [];
    const replacement = workable[0];

    return [{
      code: "PC5004", ruleId: "TYPO-001", severity: "error" as const, origin: "Editor Runtime" as const,
      messageKey: "typo.keywordSuggestion", args: { actual: token.text, suggested: replacement }, range: token.range,
      fix: { range: token.range, newText: replacement }
    }];
  });
}

/**
 * 有些诊断说的是「原因」，它后面跟着的一串说的是「后果」。
 * 一个中文括号原本会连报四条，其中三条只是噪音；单引号里写了一整个词也会再引发
 * 一条「这里需要一个表达式」。既然原因已经说清楚了，后果就该收起来——
 * 和拼写建议的抑制是同一个道理（08-GUIDANCE 4.5）。
 *
 * 全角标点按整行收（那一行已经解析不出结构了），坏字面量只按它自己那个 token 收。
 */
const CAUSE_KEYS_BY_LINE = new Set(["token.chinesePunctuation"]);
const CAUSE_KEYS_BY_TOKEN = new Set(["literal.char.looksLikeString"]);

function suppressFallout(diagnostics: Diagnostic[]): Diagnostic[] {
  const causes = diagnostics.filter((diagnostic) =>
    CAUSE_KEYS_BY_LINE.has(diagnostic.messageKey) || CAUSE_KEYS_BY_TOKEN.has(diagnostic.messageKey));
  if (causes.length === 0) return diagnostics;
  const brokenLines = new Set(
    causes.filter((cause) => CAUSE_KEYS_BY_LINE.has(cause.messageKey)).map((cause) => cause.range.start.line)
  );
  const brokenTokens = causes.filter((cause) => CAUSE_KEYS_BY_TOKEN.has(cause.messageKey));
  return diagnostics.filter((diagnostic) => {
    if (causes.includes(diagnostic)) return true;
    if (diagnostic.severity !== "error") return true;
    if (/^PC[24]/.test(diagnostic.code) && brokenLines.has(diagnostic.range.start.line)) return false;
    return !brokenTokens.some((cause) =>
      /^PC2/.test(diagnostic.code) &&
      overlapsToken(diagnostic, cause.range.start.offset, cause.range.end.offset));
  });
}

export function analyzeSource(source: string, options: AnalyzeOptions = {}): AnalyzeResult {
  const base = analyzeBase(source, options);
  const declaredNames = new Set(base.binding.symbols.map((symbol) => symbol.name.toUpperCase()));
  const typoHints = keywordTypoHints(source, options, base.diagnostics, declaredNames);
  const diagnostics = suppressFallout([
    // 已经确认「换成这个词错误会减少」，那么落在同一个词上的其它错误都是它的连锁反应。
    // 「找不到自定义类型 STRIGN」和「你想写 STRING 吗」摆在一起只是噪音，后者已经回答了前者。
    ...base.diagnostics.filter((diagnostic) => !typoHints.some((hint) =>
      diagnostic.severity === "error" &&
      overlapsToken(diagnostic, hint.range.start.offset, hint.range.end.offset)
    )),
    ...typoHints
  ])
    .sort((a, b) => a.range.start.offset - b.range.start.offset || a.code.localeCompare(b.code))
    .slice(0, Math.max(1, options.maxDiagnostics ?? 50));
  return { ...base, diagnostics };
}
