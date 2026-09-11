import { describe, expect, it } from "vitest";
import { FORMAT_CASES } from "@caie-pseudocode/test-cases";
import { analyzeSource, format, parseSource } from "../src/index.js";

const corpus = Object.fromEntries(FORMAT_CASES.map((testCase) => [testCase.id, testCase]));

describe("format diagnostics", () => {
  it("reports one safe FMT-004 fix per affected line", () => {
    const result = analyzeSource(corpus["FMT-001"].source);
    const diagnostics = result.diagnostics.filter(({ ruleId }) => ruleId === "FMT-004");
    expect(diagnostics).toHaveLength(3);
    expect(diagnostics).toMatchObject([
      { code: "PC5001", severity: "caie", origin: "CAIE", fix: { newText: "DECLARE Score : INTEGER" } },
      { code: "PC5001", severity: "caie", origin: "CAIE", fix: { newText: "INPUT" } },
      { code: "PC5001", severity: "caie", origin: "CAIE", fix: { newText: "OUTPUT" } }
    ]);
    const formatted = format(corpus["FMT-001"].source).formattedSource;
    expect(analyzeSource(formatted).diagnostics.filter(({ ruleId }) => ruleId === "FMT-004")).toEqual([]);
  });

  it("keeps two-space indentation non-blocking by default", () => {
    const result = format(corpus["FMT-002"].source);
    expect(result.diagnostics.filter(({ ruleId }) => ruleId === "FMT-002")).toMatchObject([
      { code: "PC5002", severity: "hint", origin: "CAIE", args: { expected: 3 } }
    ]);
    expect(result.diagnostics.some(({ severity }) => severity === "error")).toBe(false);
  });

  it("does not diagnose or reindent aligned continuation lines", () => {
    const source = corpus["FMT-003"].source;
    expect(analyzeSource(source).diagnostics.filter(({ ruleId }) => ruleId === "FMT-002")).toEqual([]);
    expect(format(source).formattedSource).toBe(source);
  });

  it("only reports a line limit as an opt-in Editor Runtime hint", () => {
    const source = corpus["FMT-004"].source;
    expect(analyzeSource(source).diagnostics).toEqual([]);
    expect(format(source, { maxLineLength: 90 }).diagnostics).toMatchObject([
      { code: "PC5003", ruleId: "FMT-003", severity: "hint", origin: "Editor Runtime" }
    ]);
  });
});

describe("formatter", () => {
  it("uppercases syntax and converts ASCII arrows without touching strings or comments", () => {
    const source = `// if value <- 1
declare Message : string
Message <- "if <- output"`;
    expect(format(source).formattedSource).toBe(`// if value <- 1
DECLARE Message : STRING
Message ← "if <- output"`);
  });

  it("formats nested blocks, record fields and CASE clauses with three spaces", () => {
    const source = `TYPE Student
DECLARE Mark : INTEGER
ENDTYPE
CASE OF Mark
0 TO 39 :
OUTPUT "low"
OTHERWISE : OUTPUT "high"
ENDCASE`;
    expect(format(source).formattedSource).toBe(`TYPE Student
   DECLARE Mark : INTEGER
ENDTYPE
CASE OF Mark
   0 TO 39 :
      OUTPUT "low"
   OTHERWISE : OUTPUT "high"
ENDCASE`);
  });

  it("preserves blank lines and comment order while aligning comment-only lines", () => {
    const source = `IF Ready THEN

// explain next line
OUTPUT "yes" // short comment
ENDIF`;
    expect(format(source).formattedSource).toBe(`IF Ready THEN

   // explain next line
   OUTPUT "yes" // short comment
ENDIF`);
  });

  it("is idempotent", () => {
    const once = format(`if Ready then
 output "yes"
else
output "no"
endif`).formattedSource;
    const twice = format(once);
    expect(twice.formattedSource).toBe(once);
    expect(twice.changed).toBe(false);
    expect(twice.edits).toEqual([]);
  });

  it("preserves AST structure for valid programs", () => {
    const source = `TYPE Student
 DECLARE Name : STRING
ENDTYPE
DECLARE Pupil : Student
IF Pupil.Name = "Ada" THEN
 OUTPUT Pupil.Name
ENDIF`;
    const formatted = format(source).formattedSource;
    expect(structure(parseSource(formatted).program)).toEqual(structure(parseSource(source).program));
  });

  it("uses token-only safe mode when parsing is blocked", () => {
    const source = `if Ready
  output "yes"`;
    const result = format(source);
    expect(result.safeMode).toBe("token-only");
    expect(result.formattedSource).toBe(`IF Ready
  OUTPUT "yes"`);
  });
});

function structure(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(structure);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.entries(value as Record<string, unknown>)
    .filter(([key]) => !["range", "nameRange", "memberRange", "parentheses", "comments"].includes(key))
    .map(([key, item]) => [key, structure(item)]));
}
