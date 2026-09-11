import { describe, expect, it } from "vitest";
import { TEXT_FILE_CASES } from "@caie-pseudocode/test-cases";
import { analyzeSource, parseSource } from "../src/index.js";

const corpus = Object.fromEntries(TEXT_FILE_CASES.map((testCase) => [testCase.id, testCase]));

describe("text file parsing and typing", () => {
  it("accepts the complete FILE-001 copy-file sample", () => {
    const result = analyzeSource(corpus["FILE-001"].source);
    expect(result.diagnostics).toEqual([]);
    expect(result.program.body).toMatchObject([
      { kind: "DeclareStatement" },
      { kind: "OpenFileStatement", mode: "READ", file: { kind: "LiteralExpression", literalType: "STRING" } },
      { kind: "OpenFileStatement", mode: "WRITE" },
      { kind: "WhileStatement", body: [{ kind: "ReadFileStatement" }, { kind: "IfStatement" }] },
      { kind: "CloseFileStatement" },
      { kind: "CloseFileStatement" }
    ]);
  });

  it("types EOF as a BOOLEAN file intrinsic", () => {
    const result = analyzeSource(`OPENFILE "Data.txt" FOR READ
DECLARE Finished : BOOLEAN
Finished ← EOF("Data.txt")
CLOSEFILE "Data.txt"`);
    expect(result.diagnostics).toEqual([]);
    const eof = result.checking.expressionTypes.find(({ expression }) =>
      expression.kind === "CallExpression"
      && expression.callee.kind === "NameExpression"
      && expression.callee.normalizedName === "EOF");
    expect(eof?.type).toEqual({ kind: "primitive", name: "BOOLEAN" });
  });

  it("accepts APPEND and non-literal STRING file identifiers", () => {
    const result = analyzeSource(`DECLARE FileName : STRING
FileName ← "Log.txt"
OPENFILE FileName FOR APPEND
WRITEFILE FileName, 42
CLOSEFILE FileName`);
    expect(result.diagnostics).toEqual([]);
  });

  it("tracks literal file handles without case sensitivity", () => {
    const result = analyzeSource(`OPENFILE "Log.txt" FOR APPEND
WRITEFILE "LOG.TXT", "next"
CLOSEFILE "log.txt"`);
    expect(result.diagnostics).toEqual([]);
  });

  it("keeps FILE-003 statically valid before runtime rollback handling", () => {
    const result = analyzeSource(corpus["FILE-003"].source);
    expect(result.diagnostics).toEqual([]);
  });
});

describe("text file diagnostics", () => {
  it("detects FILE-002's statically-known mode mismatch", () => {
    const result = analyzeSource(corpus["FILE-002"].source);
    expect(result.diagnostics).toMatchObject([
      {
        code: "PC4029",
        ruleId: "FILE-003",
        origin: "Editor Runtime",
        range: { start: { line: 2 } },
        args: { file: "Input.txt", expected: "WRITE or APPEND", actual: "READ" }
      }
    ]);
  });

  it("requires STRING file identifiers and a writable STRING READFILE target", () => {
    const result = analyzeSource(`DECLARE Number : INTEGER
CONSTANT Label = "fixed"
OPENFILE Number FOR READ
READFILE Number, Number
READFILE "Data.txt", Label
CLOSEFILE Number`);
    expect(result.diagnostics.map(({ code }) => code)).toEqual([
      "PC4027", "PC4027", "PC4027", "PC4029", "PC4009", "PC4027"
    ]);
  });

  it("reports duplicate literal opens as a non-blocking CAIE issue", () => {
    const result = analyzeSource(`OPENFILE "Data.txt" FOR READ
OPENFILE "Data.txt" FOR WRITE`);
    expect(result.diagnostics).toMatchObject([
      { code: "PC4028", ruleId: "FILE-004", severity: "caie", origin: "CAIE", range: { start: { line: 2 } } }
    ]);
  });

  it("reports READ, EOF and CLOSE on statically-known unopened files", () => {
    const result = analyzeSource(`DECLARE Line : STRING
READFILE "Data.txt", Line
OUTPUT EOF("Data.txt")
CLOSEFILE "Data.txt"`);
    expect(result.diagnostics.map(({ code }) => code)).toEqual(["PC4029", "PC4029", "PC4029"]);
  });

  it("checks EOF argument count and type under FILE-002", () => {
    const result = analyzeSource(`OUTPUT EOF()
OUTPUT EOF(1)`);
    expect(result.diagnostics).toMatchObject([
      { code: "PC4010", ruleId: "FILE-002" },
      { code: "PC4011", ruleId: "FILE-002" }
    ]);
  });

  it("does not leak branch-local file modes into following statements", () => {
    const result = analyzeSource(`DECLARE UseInput : BOOLEAN
DECLARE Line : STRING
IF UseInput THEN
   OPENFILE "Data.txt" FOR READ
   READFILE "Data.txt", Line
   CLOSEFILE "Data.txt"
ELSE
   OPENFILE "Data.txt" FOR WRITE
   WRITEFILE "Data.txt", Line
   CLOSEFILE "Data.txt"
ENDIF
OUTPUT "done"`);
    expect(result.diagnostics).toEqual([]);
  });

  it("recovers after an invalid OPENFILE mode", () => {
    const result = parseSource(`OPENFILE "Data.txt" FOR UPDATE
OUTPUT "after"`);
    expect(result.diagnostics).toMatchObject([
      { code: "PC2501", ruleId: "FILE-001", range: { start: { line: 1, column: 25 } } }
    ]);
    expect(result.program.body.at(-1)).toMatchObject({ kind: "OutputStatement", range: { start: { line: 2 } } });
  });

  it("reports missing commas without swallowing the next statement", () => {
    const result = parseSource(`READFILE "Data.txt" Line
WRITEFILE "Data.txt" "value"
OUTPUT "after"`);
    expect(result.diagnostics.map(({ ruleId }) => ruleId)).toEqual(["FILE-002", "FILE-003"]);
    expect(result.program.body.at(-1)).toMatchObject({ kind: "OutputStatement", range: { start: { line: 3 } } });
  });
});

describe("random file parsing and typing", () => {
  it("accepts RANDOM mode with SEEK, GETRECORD and PUTRECORD", () => {
    const result = analyzeSource(`TYPE Item
   DECLARE Code : INTEGER
ENDTYPE
DECLARE Record : Item
OPENFILE "Items.dat" FOR RANDOM
SEEK "Items.dat", 1
GETRECORD "Items.dat", Record
PUTRECORD "Items.dat", Record
CLOSEFILE "Items.dat"`);
    expect(result.diagnostics).toEqual([]);
    expect(result.program.body.slice(-5).map(({ kind }) => kind)).toEqual([
      "OpenFileStatement", "SeekStatement", "GetRecordStatement", "PutRecordStatement", "CloseFileStatement"
    ]);
  });

  it("requires a positive INTEGER address and RANDOM mode", () => {
    const result = analyzeSource(`OPENFILE "Items.dat" FOR READ
SEEK "Items.dat", 0
SEEK "Items.dat", 1.5`);
    expect(result.diagnostics).toMatchObject([
      { code: "PC4029", ruleId: "FILE-005", messageKey: "type.randomFile.requiresRandomMode" },
      { code: "PC4030", ruleId: "FILE-006", messageKey: "type.randomFile.addressMustBePositive" },
      { code: "PC4029", ruleId: "FILE-005", messageKey: "type.randomFile.requiresRandomMode" },
      { code: "PC4014", ruleId: "FILE-005", messageKey: "type.randomFile.addressRequiresInteger" }
    ]);
  });

  it("requires record values and a writable GETRECORD target", () => {
    const result = analyzeSource(`DECLARE Number : INTEGER
CONSTANT Fixed = 1
OPENFILE "Items.dat" FOR RANDOM
GETRECORD "Items.dat", Number
GETRECORD "Items.dat", Fixed
PUTRECORD "Items.dat", Number`);
    expect(result.diagnostics.map(({ code }) => code)).toEqual(["PC4031", "PC4009", "PC4031", "PC4031"]);
  });
});
