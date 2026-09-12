import { describe, expect, it } from "vitest";
import { SEMANTIC_CASES } from "@caie-pseudocode/test-cases";
import { analyzeSource } from "../src/index.js";

const corpus = Object.fromEntries(SEMANTIC_CASES.map((testCase) => [testCase.id, testCase]));

describe("advanced type checks", () => {
  it("rejects ordered comparisons for enumerated values", () => {
    const result = analyzeSource(`TYPE Season = (Spring, Summer)
DECLARE Current : Season
Current ← Spring
IF Current < Summer THEN
   OUTPUT "early"
ENDIF`);
    expect(result.diagnostics.map((diagnostic) => diagnostic.messageKey)).toContain("type.enum.orderedComparison");
  });
});

describe("global name binding", () => {
  it("treats differently-cased names as the same declaration", () => {
    const result = analyzeSource(corpus["ID-002"].source);
    expect(result.binding.symbols).toHaveLength(1);
    expect(result.diagnostics).toMatchObject([
      {
        code: "PC3001",
        ruleId: "ID-003",
        severity: "error",
        origin: "CAIE",
        range: { start: { line: 2 } },
        related: [{ messageKey: "binding.firstDeclaration", range: { start: { line: 1 } } }]
      }
    ]);
  });

  it("rejects built-in function names as ordinary declarations", () => {
    const result = analyzeSource("DECLARE LENGTH : INTEGER");
    expect(result.binding.symbols).toEqual([]);
    expect(result.diagnostics).toMatchObject([
      { code: "PC3002", ruleId: "ID-002", severity: "error", origin: "CAIE" }
    ]);
  });

  it("reports each genuinely unbound name as Editor Runtime", () => {
    const result = analyzeSource(corpus["DECL-002"].source);
    expect(result.diagnostics).toMatchObject([
      { code: "PC3003", ruleId: "DECL-002", origin: "Editor Runtime", args: { name: "Total" } },
      { code: "PC3003", ruleId: "DECL-002", origin: "Editor Runtime", args: { name: "MissingValue" } }
    ]);
  });

  it("binds references case-insensitively to the original declaration", () => {
    const result = analyzeSource(`DECLARE Score : INTEGER
sCoRe ← 5
OUTPUT SCORE`);
    expect(result.diagnostics).toEqual([]);
    expect(result.binding.references.map(({ symbol }) => symbol?.name)).toEqual(["Score", "Score"]);
  });
});

describe("basic type checking", () => {
  it("allows INTEGER to REAL promotion but rejects REAL to INTEGER assignment", () => {
    const result = analyzeSource(`DECLARE Whole : INTEGER
DECLARE Fraction : REAL
Fraction ← Whole
Whole ← 2.5`);
    expect(result.diagnostics).toMatchObject([
      { code: "PC4000", ruleId: "ASSIGN-002", args: { target: "INTEGER", value: "REAL" }, range: { start: { line: 4 } } }
    ]);
  });

  it("rejects writes to constants through assignment and INPUT", () => {
    const result = analyzeSource(`CONSTANT Limit = 10
Limit ← 11
INPUT Limit`);
    expect(result.diagnostics).toMatchObject([
      { code: "PC4009", ruleId: "ASSIGN-003", range: { start: { line: 2 } } },
      { code: "PC4009", ruleId: "ASSIGN-003", range: { start: { line: 3 } } }
    ]);
  });

  it("checks arithmetic, logical and concatenation operand types", () => {
    const result = analyzeSource(`OUTPUT TRUE + 1
OUTPUT NOT 2
OUTPUT "A" & 'B'`);
    expect(result.diagnostics.map(({ ruleId }) => ruleId)).toEqual(["OP-001", "OP-004", "OP-005"]);
  });

  it("checks DIV/MOD separately and infers slash as REAL", () => {
    const result = analyzeSource(`DECLARE Value : REAL
Value ← 5 / 2
OUTPUT 5.0 DIV 2`);
    expect(result.diagnostics).toMatchObject([{ code: "PC4001", ruleId: "OP-001", range: { start: { line: 3 } } }]);
    const slash = result.checking.expressionTypes.find(({ expression }) => expression.kind === "BinaryExpression" && expression.operator === "/");
    expect(slash?.type).toEqual({ kind: "primitive", name: "REAL" });
  });

  it("validates built-in function arguments and return types", () => {
    const valid = analyzeSource(`DECLARE Size : INTEGER
Size ← LENGTH("hello")`);
    expect(valid.diagnostics).toEqual([]);

    const invalid = analyzeSource("OUTPUT LENGTH(5)");
    expect(invalid.diagnostics).toMatchObject([{ code: "PC4011", ruleId: "BUILTIN-001" }]);
  });
});

describe("array semantics", () => {
  it("accepts the valid ARRAY-001 dimensions, indices and element assignments", () => {
    const result = analyzeSource(corpus["ARRAY-001"].source);
    expect(result.diagnostics).toEqual([]);
  });

  it("reports ARRAY-002 out-of-bounds and dimension errors independently", () => {
    const result = analyzeSource(corpus["ARRAY-002"].source);
    expect(result.diagnostics).toMatchObject([
      { code: "PC4008", ruleId: "ARRAY-004", origin: "Editor Runtime", range: { start: { line: 2 } } },
      { code: "PC4006", ruleId: "ARRAY-004", range: { start: { line: 3 } } }
    ]);
  });

  it("requires INTEGER indices and ordered INTEGER bounds", () => {
    const result = analyzeSource(`DECLARE BadBounds : ARRAY[3:1] OF INTEGER
DECLARE Values : ARRAY[1:3] OF INTEGER
Values[1.5] ← 2`);
    expect(result.diagnostics).toMatchObject([
      { code: "PC4012", ruleId: "ARRAY-002", range: { start: { line: 1 } } },
      { code: "PC4007", ruleId: "ARRAY-004", range: { start: { line: 3 } } }
    ]);
  });

  it("requires whole-array assignments to have identical dimensions and element types", () => {
    const result = analyzeSource(`DECLARE A : ARRAY[1:3] OF INTEGER
DECLARE B : ARRAY[1:4] OF INTEGER
DECLARE C : ARRAY[1:3] OF REAL
A ← B
A ← C`);
    expect(result.diagnostics.filter(({ ruleId }) => ruleId === "ASSIGN-002")).toHaveLength(2);
  });
});
