import { parseSource } from "./parser.js";
import { tokenize } from "./tokenizer.js";
import type { Diagnostic, SourcePosition, SourceRange, TextEdit, Token } from "./types.js";

export type FormatOptions = {
  indentSize?: number;
  indentationDiagnostics?: "off" | "recommended" | "strict";
  maxLineLength?: number;
};

export type FormatResult = {
  formattedSource: string;
  diagnostics: Diagnostic[];
  edits: TextEdit[];
  changed: boolean;
  safeMode: "full" | "token-only";
};

type LineInfo = {
  number: number;
  startOffset: number;
  raw: string;
  tokens: Token[];
  codeTokens: Token[];
  expectedDepth: number;
  continuation: boolean;
};

const OPENERS = new Set(["IF", "FOR", "WHILE", "REPEAT", "PROCEDURE", "FUNCTION", "TYPE", "CLASS", "CASE"]);
const CLOSERS = new Map([
  ["ENDIF", "IF"],
  ["NEXT", "FOR"],
  ["ENDWHILE", "WHILE"],
  ["UNTIL", "REPEAT"],
  ["ENDPROCEDURE", "PROCEDURE"],
  ["ENDFUNCTION", "FUNCTION"],
  ["ENDTYPE", "TYPE"],
  ["ENDCLASS", "CLASS"],
  ["ENDCASE", "CASE"],
]);

export function checkFormatting(source: string, options: FormatOptions = {}): Diagnostic[] {
  return format(source, options).diagnostics;
}

export function format(source: string, options: FormatOptions = {}): FormatResult {
  const tokenized = tokenize(source);
  const normalizedSource = tokenized.normalizedSource;
  const lines = buildLines(normalizedSource, tokenized.tokens);
  assignExpectedDepths(lines);

  const diagnostics = [
    ...keywordCaseDiagnostics(normalizedSource, lines),
    ...indentationDiagnostics(lines, options),
    ...lineLengthDiagnostics(lines, options)
  ];
  const hasParseError = parseSource(normalizedSource).diagnostics.some(({ severity }) => severity === "error");
  const safeMode: FormatResult["safeMode"] = hasParseError ? "token-only" : "full";
  const indent = " ".repeat(Math.max(1, options.indentSize ?? 3));

  const formattedLines = lines.map((line) => {
    const replaced = replaceTokensOnLine(line, true);
    if (replaced.trim().length === 0) return "";
    if (safeMode === "token-only" || line.continuation) return replaced;
    return indent.repeat(line.expectedDepth) + replaced.trimStart();
  });
  const formattedSource = formattedLines.join("\n");
  const changed = formattedSource !== normalizedSource;
  const end = tokenized.tokens.at(-1)?.range.end ?? { offset: normalizedSource.length, line: lines.length, column: 1 };
  return {
    formattedSource,
    diagnostics,
    edits: changed ? [{ range: { start: { offset: 0, line: 1, column: 1 }, end }, newText: formattedSource }] : [],
    changed,
    safeMode
  };
}

function buildLines(source: string, tokens: Token[]): LineInfo[] {
  const rawLines = source.split("\n");
  const starts: number[] = [];
  let offset = 0;
  rawLines.forEach((line) => {
    starts.push(offset);
    offset += line.length + 1;
  });
  const byLine = new Map<number, Token[]>();
  for (const token of tokens) {
    if (token.kind === "newline" || token.kind === "eof") continue;
    const list = byLine.get(token.range.start.line) ?? [];
    list.push(token);
    byLine.set(token.range.start.line, list);
  }
  return rawLines.map((raw, index) => {
    const lineTokens = byLine.get(index + 1) ?? [];
    return {
      number: index + 1,
      startOffset: starts[index],
      raw,
      tokens: lineTokens,
      codeTokens: lineTokens.filter(({ kind }) => kind !== "comment"),
      expectedDepth: 0,
      continuation: false
    };
  });
}

function assignExpectedDepths(lines: LineInfo[]): void {
  const frames: string[] = [];
  let delimiterDepth = 0;
  let continuationFromPrevious = false;

  for (const line of lines) {
    const tokens = line.codeTokens;
    if (tokens.length === 0) {
      line.expectedDepth = frames.length;
      line.continuation = continuationFromPrevious || delimiterDepth > 0;
      continue;
    }
    const first = normalized(tokens[0]);
    const structuralFirst = (first === "PUBLIC" || first === "PRIVATE") && tokens[1]
      ? normalized(tokens[1])
      : first;
    line.continuation = continuationFromPrevious || delimiterDepth > 0;

    const isCaseClause = !line.continuation && isCaseClauseLine(tokens, frames);
    if (isCaseClause && frames.at(-1) === "CASE_CLAUSE") frames.pop();

    if (!line.continuation && first === "ENDCASE") {
      if (frames.at(-1) === "CASE_CLAUSE") frames.pop();
      popThrough(frames, "CASE");
    } else if (!line.continuation && CLOSERS.has(first)) {
      popThrough(frames, CLOSERS.get(first)!);
    }

    line.expectedDepth = !line.continuation && first === "ELSE"
      ? Math.max(0, frames.length - 1)
      : frames.length;

    const isSingleLineType = structuralFirst === "TYPE" && tokens.some(({ text }) => text === "=");
    if (!line.continuation && OPENERS.has(structuralFirst) && !isSingleLineType) frames.push(structuralFirst);
    if (isCaseClause && tokens.at(-1)?.text === ":") frames.push("CASE_CLAUSE");

    for (const token of tokens) {
      if (token.text === "(" || token.text === "[") delimiterDepth += 1;
      else if (token.text === ")" || token.text === "]") delimiterDepth = Math.max(0, delimiterDepth - 1);
    }
    const last = tokens.at(-1);
    continuationFromPrevious = delimiterDepth > 0
      || last?.text === ","
      || (last?.kind === "operator" && !["←", "<-", "="].includes(last.text));
  }
}

function isCaseClauseLine(tokens: Token[], frames: string[]): boolean {
  if (!frames.includes("CASE")) return false;
  const top = frames.at(-1);
  if (top !== "CASE" && top !== "CASE_CLAUSE") return false;
  const first = tokens[0];
  if (!(first.kind === "identifier"
    || ["integer", "real", "char", "string", "boolean", "date"].includes(first.kind)
    || normalized(first) === "OTHERWISE")) return false;
  return tokens.some(({ text }) => text === ":");
}

function popThrough(frames: string[], expected: string): void {
  while (frames.length > 0) {
    const frame = frames.pop();
    if (frame === expected) return;
  }
}

function normalized(token: Token): string {
  return token.normalized ?? token.text;
}

function isCaseToken(token: Token): boolean {
  return token.kind === "keyword"
    || token.kind === "type-name"
    || token.kind === "boolean"
    || (token.kind === "operator" && /^[A-Za-z]+$/.test(token.text));
}

function replacement(token: Token): string {
  if (token.text === "<-") return "←";
  if (isCaseToken(token)) return normalized(token);
  return token.text;
}

function replaceTokensOnLine(line: LineInfo, includeArrow: boolean): string {
  let output = line.raw;
  const replacements = line.tokens
    .filter((token) => isCaseToken(token) || (includeArrow && token.text === "<-"))
    .sort((a, b) => b.range.start.offset - a.range.start.offset);
  for (const token of replacements) {
    const start = token.range.start.offset - line.startOffset;
    const end = token.range.end.offset - line.startOffset;
    output = output.slice(0, start) + replacement(token) + output.slice(end);
  }
  return output;
}

function keywordCaseDiagnostics(source: string, lines: LineInfo[]): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  for (const line of lines) {
    const mismatches = line.tokens.filter((token) => isCaseToken(token) && token.text !== normalized(token));
    if (mismatches.length === 0) continue;
    const first = mismatches[0];
    const last = mismatches.at(-1)!;
    const range: SourceRange = { start: first.range.start, end: last.range.end };
    diagnostics.push({
      code: "PC5001",
      ruleId: "FMT-004",
      severity: "caie",
      origin: "CAIE",
      messageKey: "format.keyword.requiresUppercase",
      args: { count: mismatches.length },
      range,
      fix: { range, newText: formatRange(source, range, mismatches) }
    });
  }
  return diagnostics;
}

function formatRange(source: string, range: SourceRange, tokens: Token[]): string {
  let output = source.slice(range.start.offset, range.end.offset);
  for (const token of [...tokens].sort((a, b) => b.range.start.offset - a.range.start.offset)) {
    const start = token.range.start.offset - range.start.offset;
    const end = token.range.end.offset - range.start.offset;
    output = output.slice(0, start) + replacement(token) + output.slice(end);
  }
  return output;
}

function indentationDiagnostics(lines: LineInfo[], options: FormatOptions): Diagnostic[] {
  const mode = options.indentationDiagnostics ?? "recommended";
  if (mode === "off") return [];
  const indentSize = Math.max(1, options.indentSize ?? 3);
  for (const line of lines) {
    if (line.continuation || line.codeTokens.length === 0) continue;
    const actual = line.raw.match(/^[ \t]*/)?.[0] ?? "";
    const expected = " ".repeat(line.expectedDepth * indentSize);
    if (actual === expected) continue;
    const end: SourcePosition = line.codeTokens[0]?.range.start ?? {
      offset: line.startOffset + actual.length,
      line: line.number,
      column: actual.length + 1
    };
    const range: SourceRange = { start: { offset: line.startOffset, line: line.number, column: 1 }, end };
    return [{
      code: "PC5002",
      ruleId: "FMT-002",
      severity: mode === "strict" ? "caie" : "hint",
      origin: mode === "strict" ? "Editor Runtime" : "CAIE",
      messageKey: "format.indentation.recommended",
      args: { actual: actual.replace(/\t/g, "\\t"), expected: expected.length },
      range,
      fix: { range, newText: expected }
    }];
  }
  return [];
}

function lineLengthDiagnostics(lines: LineInfo[], options: FormatOptions): Diagnostic[] {
  if (options.maxLineLength === undefined) return [];
  const maximum = Math.max(1, options.maxLineLength);
  return lines.filter(({ raw }) => [...raw].length > maximum).map((line) => {
    const start = line.tokens[0]?.range.start ?? { offset: line.startOffset, line: line.number, column: 1 };
    const range: SourceRange = { start, end: line.tokens.at(-1)?.range.end ?? start };
    return {
      code: "PC5003",
      ruleId: "FMT-003",
      severity: "hint" as const,
      origin: "Editor Runtime" as const,
      messageKey: "format.line.exceedsEditorLimit",
      args: { maximum, actual: [...line.raw].length },
      range
    };
  });
}
