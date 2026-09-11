import { describe, expect, it } from "vitest";
import { TOKENIZER_CASES } from "@caie-pseudocode/test-cases";
import { tokenize } from "../src/index.js";

const corpus = Object.fromEntries(TOKENIZER_CASES.map((testCase) => [testCase.id, testCase]));

describe("CAIE tokenizer corpus", () => {
  it("LEX-001 accepts the basic literal forms", () => {
    const result = tokenize(corpus["LEX-001"].source);
    expect(result.diagnostics).toEqual([]);
    expect(result.tokens.filter(({ kind }) => ["integer", "real", "char", "string", "boolean", "date"].includes(kind)))
      .toMatchObject([
        { kind: "integer", text: "-3" },
        { kind: "real", text: "4.7" },
        { kind: "char", text: "'C'" },
        { kind: "string", text: '""' },
        { kind: "boolean", text: "FALSE", normalized: "FALSE" },
        { kind: "date", text: "02/01/2028" }
      ]);
  });

  it("LEX-002 keeps a DATE literal atomic", () => {
    const result = tokenize(corpus["LEX-002"].source);
    expect(result.diagnostics).toEqual([]);
    expect(result.tokens.filter(({ kind }) => kind === "date")).toMatchObject([
      { text: "02/01/2028", range: { start: { line: 2, column: 13 }, end: { line: 2, column: 23 } } }
    ]);
    expect(result.tokens.filter(({ text }) => text === "/")).toHaveLength(0);
  });

  it("LEX-003 reports an invalid calendar date without splitting it", () => {
    const result = tokenize(corpus["LEX-003"].source);
    expect(result.tokens.filter(({ kind }) => kind === "date")).toHaveLength(1);
    expect(result.diagnostics).toMatchObject([
      { code: "PC1001", ruleId: "LIT-006", severity: "error", origin: "Editor Runtime" }
    ]);
  });

  it("LEX-004 rejects REAL literals missing digits around the point", () => {
    const result = tokenize(corpus["LEX-004"].source);
    expect(result.diagnostics).toMatchObject([
      { ruleId: "LIT-002", origin: "CAIE", range: { start: { line: 3, column: 5 } } },
      { ruleId: "LIT-002", origin: "CAIE", range: { start: { line: 4, column: 5 } } }
    ]);
    expect(result.tokens.filter(({ kind }) => kind === "invalid").map(({ text }) => text)).toEqual([".5", "5."]);
  });

  it("LEX-005 recovers from an unterminated string at the next line", () => {
    const result = tokenize(corpus["LEX-005"].source);
    expect(result.diagnostics).toHaveLength(1);
    expect(result.diagnostics[0]).toMatchObject({ ruleId: "LIT-004", range: { start: { line: 1 } } });
    expect(result.tokens).toEqual(expect.arrayContaining([
      expect.objectContaining({ kind: "keyword", text: "OUTPUT", range: expect.objectContaining({ start: expect.objectContaining({ line: 2 }) }) }),
      expect.objectContaining({ kind: "string", text: '"next line"', range: expect.objectContaining({ start: expect.objectContaining({ line: 2 }) }) })
    ]));
  });

  it("LEX-006 does not tokenize keywords inside comments or strings", () => {
    const result = tokenize(corpus["LEX-006"].source);
    expect(result.diagnostics).toEqual([]);
    expect(result.tokens.filter(({ kind }) => kind === "comment")).toMatchObject([
      { text: "// IF ELSE ENDIF DECLARE <-" }
    ]);
    expect(result.tokens.filter(({ kind }) => kind === "keyword").map(({ text }) => text)).toEqual(["OUTPUT"]);
    expect(result.tokens.filter(({ kind }) => kind === "string")).toMatchObject([{ text: '"// is text"' }]);
  });
});

describe("source ranges and recovery", () => {
  it("keeps every token range sliceable and uses code-point columns", () => {
    const result = tokenize('// 😀\nOUTPUT "ok"');
    for (const token of result.tokens) {
      expect(result.normalizedSource.slice(token.range.start.offset, token.range.end.offset)).toBe(token.text);
    }
    expect(result.tokens.find(({ text }) => text === "OUTPUT")?.range.start).toEqual({ offset: 6, line: 2, column: 1 });
  });

  it("continues tokenizing after an invalid character", () => {
    const result = tokenize("@\nOUTPUT 1");
    expect(result.diagnostics).toHaveLength(1);
    expect(result.tokens.find(({ text }) => text === "OUTPUT")?.range.start.line).toBe(2);
  });

  it("explains that Chinese punctuation must be replaced with English half-width punctuation", () => {
    const result = tokenize("OUTPUT “Hello”\nDECLARE Score ： INTEGER\nOUTPUT 《Score》");
    expect(result.diagnostics).toMatchObject([
      { code: "PC1006", messageKey: "token.chinesePunctuation", args: { value: "“" }, range: { start: { line: 1, column: 8 } } },
      { code: "PC1006", messageKey: "token.chinesePunctuation", args: { value: "”" }, range: { start: { line: 1, column: 14 } } },
      { code: "PC1006", messageKey: "token.chinesePunctuation", args: { value: "：" }, range: { start: { line: 2, column: 15 } } },
      { code: "PC1006", messageKey: "token.chinesePunctuation", args: { value: "《" }, range: { start: { line: 3, column: 8 } } },
      { code: "PC1006", messageKey: "token.chinesePunctuation", args: { value: "》" }, range: { start: { line: 3, column: 14 } } }
    ]);
  });

  it("uses longest-match operators and normalizes the ASCII assignment helper", () => {
    const result = tokenize("A <- B\nC >= D\nE <> F\nG <= H");
    expect(result.tokens.filter(({ kind }) => kind === "operator").map(({ text, normalized }) => [text, normalized]))
      .toEqual([["<-", "←"], [">=", ">="], ["<>", "<>"], ["<=", "<="]]);
  });
});
