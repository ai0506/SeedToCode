import { describe, expect, it } from "vitest";
import { CONTROL_FLOW_CASES } from "@caie-pseudocode/test-cases";
import { analyzeSource, parseSource } from "../src/index.js";

const corpus = Object.fromEntries(CONTROL_FLOW_CASES.map((testCase) => [testCase.id, testCase]));

describe("control-flow parser", () => {
  it("parses nested IF-001 branches without diagnostics", () => {
    const result = analyzeSource(corpus["IF-001"].source);
    expect(result.diagnostics).toEqual([]);
    expect(result.program.body[4]).toMatchObject({
      kind: "IfStatement",
      condition: { kind: "BinaryExpression", operator: ">" },
      thenBranch: [{ kind: "IfStatement", thenBranch: [{ kind: "OutputStatement" }] }],
      elseBranch: [{ kind: "OutputStatement" }]
    });
  });

  it("parses CASE-001 ranges, inline bodies and OTHERWISE", () => {
    const result = analyzeSource(corpus["CASE-001"].source);
    expect(result.diagnostics).toEqual([]);
    expect(result.program.body[2]).toMatchObject({
      kind: "CaseStatement",
      clauses: [
        { labels: [{ kind: "CaseRangeLabel" }], body: [{ kind: "OutputStatement" }] },
        { labels: [{ kind: "CaseRangeLabel" }], body: [{ kind: "OutputStatement" }] },
        { isOtherwise: true, labels: [], body: [{ kind: "OutputStatement" }] }
      ]
    });
  });

  it("supports multiline CASE clause bodies", () => {
    const result = analyzeSource(`DECLARE Mark : INTEGER
Mark ← 1
CASE OF Mark
   1:
      OUTPUT "one"
      Mark ← 2
   2:
      OUTPUT "two"
ENDCASE`);
    expect(result.diagnostics).toEqual([]);
    expect(result.program.body[2]).toMatchObject({
      kind: "CaseStatement",
      clauses: [
        { body: [{ kind: "OutputStatement" }, { kind: "AssignmentStatement" }] },
        { body: [{ kind: "OutputStatement" }] }
      ]
    });
  });

  it("reports CASE-002 when a label follows OTHERWISE", () => {
    const result = analyzeSource(corpus["CASE-002"].source);
    expect(result.diagnostics).toEqual(expect.arrayContaining([
      expect.objectContaining({
        code: "PC2206",
        ruleId: "CASE-002",
        origin: "CAIE",
        range: expect.objectContaining({ start: expect.objectContaining({ line: 3 }) })
      })
    ]));
  });

  it("parses FOR-001 positive, negative-step and zero-run shapes", () => {
    const result = analyzeSource(corpus["FOR-001"].source);
    expect(result.diagnostics).toEqual([]);
    expect(result.program.body.slice(1).map((statement) => statement.kind)).toEqual([
      "ForStatement", "ForStatement", "ForStatement"
    ]);
    expect(result.program.body[2]).toMatchObject({ kind: "ForStatement", step: { kind: "LiteralExpression", value: -1 } });
  });

  it("creates an INTEGER binding for an otherwise undeclared FOR control variable", () => {
    const result = analyzeSource(corpus["FOR-002"].source);
    expect(result.binding.symbols).toMatchObject([{ name: "Row", type: { kind: "primitive", name: "INTEGER" } }]);
    expect(result.diagnostics).toMatchObject([
      { code: "PC2202", ruleId: "FOR-001", origin: "Editor Runtime", range: { start: { line: 3 } } }
    ]);
  });

  it("parses REPEAT and WHILE corpus cases without diagnostics", () => {
    const repeat = analyzeSource(corpus["LOOP-001"].source);
    const whileResult = analyzeSource(corpus["LOOP-002"].source);
    expect(repeat.diagnostics).toEqual([]);
    expect(whileResult.diagnostics).toEqual([]);
    expect(repeat.program.body[2]).toMatchObject({ kind: "RepeatStatement", body: [{ kind: "AssignmentStatement" }] });
    expect(whileResult.program.body[2]).toMatchObject({ kind: "WhileStatement", body: [{ kind: "OutputStatement" }] });
  });
});

describe("control-flow checking and recovery", () => {
  it("requires BOOLEAN conditions", () => {
    const result = analyzeSource(`IF 1 THEN
ENDIF
WHILE "yes"
ENDWHILE
REPEAT
UNTIL 4.5`);
    expect(result.diagnostics.map(({ ruleId }) => ruleId)).toEqual(["IF-001", "WHILE-001", "REPEAT-001"]);
  });

  it("requires INTEGER FOR values and rejects a literal zero STEP", () => {
    const result = analyzeSource(`DECLARE Index : REAL
FOR Index ← 1.5 TO 4 STEP 0
NEXT Index`);
    expect(result.diagnostics.map(({ code }) => code)).toEqual(["PC4014", "PC4014", "PC4016"]);
  });

  it("checks CASE label types against the selector", () => {
    const result = analyzeSource(`DECLARE Mark : INTEGER
CASE OF Mark
   "A" : OUTPUT "bad"
ENDCASE`);
    expect(result.diagnostics).toMatchObject([{ code: "PC4015", ruleId: "CASE-001" }]);
  });

  it("reports one mismatched closer and resumes after it", () => {
    const result = parseSource(`IF TRUE THEN
   OUTPUT "inside"
ENDWHILE
OUTPUT "after"`);
    expect(result.diagnostics).toMatchObject([
      { code: "PC2200", ruleId: "IF-001", args: { expected: "ENDIF", actual: "ENDWHILE" } }
    ]);
    expect(result.program.body).toMatchObject([
      { kind: "IfStatement" },
      { kind: "OutputStatement", range: { start: { line: 4 } } }
    ]);
  });

  it("reports missing block endings without an error storm", () => {
    const result = parseSource(`WHILE TRUE
   OUTPUT "unfinished"`);
    expect(result.diagnostics).toHaveLength(1);
    expect(result.diagnostics[0]).toMatchObject({ code: "PC2200", ruleId: "WHILE-001" });
  });

  it("emits only a hint when NEXT omits its variable", () => {
    const result = analyzeSource(`FOR Index ← 1 TO 2
NEXT`);
    expect(result.diagnostics).toMatchObject([
      { code: "PC2203", ruleId: "FOR-003", severity: "hint", origin: "CAIE" }
    ]);
  });
});
