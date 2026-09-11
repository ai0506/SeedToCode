import { describe, expect, it } from "vitest";
import { ROUTINE_CASES } from "@caie-pseudocode/test-cases";
import { analyzeSource, parseSource } from "../src/index.js";

const corpus = Object.fromEntries(ROUTINE_CASES.map((testCase) => [testCase.id, testCase]));

describe("routine parser and binding", () => {
  it("fixes ROUTINE-001 by binding parameters and locals in routine scope", () => {
    const result = analyzeSource(corpus["ROUTINE-001"].source);
    expect(result.diagnostics).toEqual([]);
    expect(result.program.body[4]).toMatchObject({
      kind: "ProcedureDeclaration",
      parameters: [
        { name: "X", mode: "BYREF", explicitMode: true },
        { name: "Y", mode: "BYREF", explicitMode: false }
      ],
      body: [
        { kind: "DeclareStatement" },
        { kind: "AssignmentStatement" },
        { kind: "AssignmentStatement" },
        { kind: "AssignmentStatement" }
      ]
    });
    expect(result.binding.symbols.filter(({ scopeId }) => scopeId.startsWith("routine:SWAP")).map(({ name }) => name)).toEqual([
      "X", "Y", "Temp"
    ]);
  });

  it("uses BYVAL by default for ROUTINE-002", () => {
    const result = analyzeSource(corpus["ROUTINE-002"].source);
    expect(result.diagnostics).toEqual([]);
    expect(result.program.body[2]).toMatchObject({
      kind: "ProcedureDeclaration",
      parameters: [{ name: "Value", mode: "BYVAL", explicitMode: false }]
    });
  });

  it("parses and types ROUTINE-003 function calls in expressions", () => {
    const result = analyzeSource(corpus["ROUTINE-003"].source);
    expect(result.diagnostics).toEqual([]);
    expect(result.program.body).toMatchObject([
      { kind: "FunctionDeclaration", body: [{ kind: "IfStatement" }] },
      { kind: "OutputStatement", values: [{ kind: "CallExpression" }] }
    ]);
    const call = result.checking.expressionTypes.find(({ expression }) => expression.kind === "CallExpression");
    expect(call?.type).toEqual({ kind: "primitive", name: "INTEGER" });
  });

  it("allows local parameters to shadow globals while rejecting same-scope duplicates", () => {
    const valid = analyzeSource(`DECLARE Value : INTEGER
PROCEDURE SetValue(Value : INTEGER)
   Value ← 2
ENDPROCEDURE`);
    expect(valid.diagnostics).toEqual([]);
    const assignmentReference = valid.binding.references.find(({ range }) => range.start.line === 3);
    expect(assignmentReference?.symbol?.scopeId).toMatch(/^routine:SETVALUE/);

    const duplicate = analyzeSource(`PROCEDURE Bad(Value : INTEGER)
   DECLARE value : INTEGER
ENDPROCEDURE`);
    expect(duplicate.diagnostics).toMatchObject([{ code: "PC3001", ruleId: "ID-003" }]);
  });

  it("supports access modifiers without losing declaration range", () => {
    const result = parseSource(`PUBLIC PROCEDURE Show()
ENDPROCEDURE
PRIVATE FUNCTION Hidden() RETURNS INTEGER
   RETURN 1
ENDFUNCTION`);
    expect(result.diagnostics).toEqual([]);
    expect(result.program.body).toMatchObject([
      { kind: "ProcedureDeclaration", access: "PUBLIC", range: { start: { column: 1 } } },
      { kind: "FunctionDeclaration", access: "PRIVATE", range: { start: { column: 1 } } }
    ]);
  });
});

describe("routine diagnostics", () => {
  it("rejects ROUTINE-004 CALL on a function", () => {
    const result = analyzeSource(corpus["ROUTINE-004"].source);
    expect(result.diagnostics).toMatchObject([
      { code: "PC4020", ruleId: "FUNC-002", severity: "error", origin: "CAIE", range: { start: { line: 4 } } }
    ]);
  });

  it("requires ROUTINE-005 BYREF arguments to be writable", () => {
    const result = analyzeSource(corpus["ROUTINE-005"].source);
    expect(result.diagnostics).toMatchObject([
      { code: "PC4023", ruleId: "PARAM-001", severity: "error", origin: "Editor Runtime", range: { start: { line: 4 } } }
    ]);
  });

  it("detects ROUTINE-006 missing return paths and links the function declaration", () => {
    const result = analyzeSource(corpus["ROUTINE-006"].source);
    expect(result.diagnostics).toMatchObject([
      {
        code: "PC4022",
        ruleId: "FUNC-001",
        origin: "Editor Runtime",
        related: [{ messageKey: "type.function.declaration", range: { start: { line: 1 } } }]
      }
    ]);
  });

  it("checks argument counts, BYVAL types and exact BYREF types", () => {
    const result = analyzeSource(`PROCEDURE Mix(BYVAL A : INTEGER, BYREF B : REAL)
ENDPROCEDURE
DECLARE Whole : INTEGER
CALL Mix("wrong", Whole, 3)`);
    expect(result.diagnostics.map(({ code }) => code)).toEqual(["PC4010", "PC4011", "PC4011"]);
  });

  it("rejects procedure calls in expressions and RETURN outside functions", () => {
    const result = analyzeSource(`PROCEDURE Work()
ENDPROCEDURE
OUTPUT Work()
RETURN 1`);
    expect(result.diagnostics.map(({ code }) => code)).toEqual(["PC4020", "PC4021"]);
  });

  it("checks function RETURN values and flags BYREF function parameters", () => {
    const result = analyzeSource(`FUNCTION Bad(BYREF Value : INTEGER) RETURNS STRING
   RETURN Value
ENDFUNCTION`);
    expect(result.diagnostics).toMatchObject([
      { code: "PC2302", ruleId: "PARAM-002", severity: "caie" },
      { code: "PC4021", ruleId: "FUNC-001", args: { expected: "STRING", actual: "INTEGER" } }
    ]);
  });

  it("recovers after a mismatched routine terminator", () => {
    const result = parseSource(`PROCEDURE Broken()
   OUTPUT "inside"
ENDFUNCTION
OUTPUT "after"`);
    expect(result.diagnostics).toMatchObject([
      { code: "PC2200", ruleId: "PROC-001", args: { expected: "ENDPROCEDURE", actual: "ENDFUNCTION" } }
    ]);
    expect(result.program.body.at(-1)).toMatchObject({ kind: "OutputStatement", range: { start: { line: 4 } } });
  });
});
