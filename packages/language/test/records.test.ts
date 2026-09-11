import { describe, expect, it } from "vitest";
import { RECORD_CASES } from "@caie-pseudocode/test-cases";
import { analyzeSource, parseSource } from "../src/index.js";

describe("record parsing and binding", () => {
  it("accepts RECORD-001 and infers field types", () => {
    const result = analyzeSource(RECORD_CASES[0].source);
    expect(result.diagnostics).toEqual([]);
    expect(result.program.body[0]).toMatchObject({
      kind: "RecordTypeDeclaration", name: "Packet",
      fields: [
        { kind: "RecordField", name: "Code", typeReference: { kind: "PrimitiveTypeReference", name: "CHAR" } },
        { kind: "RecordField", name: "Bytes", typeReference: { kind: "PrimitiveTypeReference", name: "INTEGER" } }
      ]
    });
    expect(result.binding.symbols.map(({ kind, name }) => [kind, name])).toEqual([
      ["type", "Packet"], ["field", "Code"], ["field", "Bytes"], ["variable", "Message"]
    ]);
    const memberTypes = result.checking.expressionTypes
      .filter(({ expression }) => expression.kind === "MemberExpression")
      .map(({ type }) => type.kind === "primitive" ? type.name : type.kind);
    expect(memberTypes).toEqual(["CHAR", "INTEGER", "CHAR"]);
  });

  it("supports arrays and nested records", () => {
    const result = analyzeSource(`TYPE Address
   DECLARE City : STRING
ENDTYPE
TYPE Student
   DECLARE Home : Address
ENDTYPE
DECLARE Pupils : ARRAY[1:3] OF Student
Pupils[1].Home.City ← "Lima"
OUTPUT Pupils[1].Home.City`);
    expect(result.diagnostics).toEqual([]);
  });

  it("allows whole-record assignment only between the same record type", () => {
    const valid = analyzeSource(`TYPE Point
   DECLARE X : INTEGER
ENDTYPE
DECLARE A : Point
DECLARE B : Point
A ← B`);
    expect(valid.diagnostics).toEqual([]);

    const invalid = analyzeSource(`TYPE Point
   DECLARE X : INTEGER
ENDTYPE
TYPE Size
   DECLARE X : INTEGER
ENDTYPE
DECLARE A : Point
DECLARE B : Size
A ← B`);
    expect(invalid.diagnostics).toMatchObject([
      { code: "PC4000", ruleId: "ASSIGN-002", args: { target: "Point", value: "Size" } }
    ]);
  });

  it("passes record types through routine parameters and returns", () => {
    const result = analyzeSource(`TYPE Point
   DECLARE X : INTEGER
ENDTYPE
FUNCTION Copy(Value : Point) RETURNS Point
   RETURN Value
ENDFUNCTION
DECLARE A : Point
DECLARE B : Point
B ← Copy(A)`);
    expect(result.diagnostics).toEqual([]);
  });
});

describe("record diagnostics", () => {
  it("rejects duplicate fields case-insensitively and links the first declaration", () => {
    const result = analyzeSource(`TYPE Student
   DECLARE Name : STRING
   DECLARE name : INTEGER
ENDTYPE`);
    expect(result.diagnostics).toMatchObject([
      {
        code: "PC3001",
        ruleId: "ID-003",
        range: { start: { line: 3 } },
        related: [{ range: { start: { line: 2 } } }]
      }
    ]);
  });

  it("reports unknown fields and field access on non-record values", () => {
    const unknown = analyzeSource(`TYPE Student
   DECLARE Name : STRING
ENDTYPE
DECLARE Pupil : Student
OUTPUT Pupil.Age`);
    expect(unknown.diagnostics).toMatchObject([
      { code: "PC4025", ruleId: "UDT-005", args: { record: "Student", field: "Age" }, range: { start: { line: 5, column: 14 } } }
    ]);

    const nonRecord = analyzeSource(`DECLARE Count : INTEGER
OUTPUT Count.Value`);
    expect(nonRecord.diagnostics).toMatchObject([
      { code: "PC4024", ruleId: "UDT-005", range: { start: { line: 2, column: 8 } } }
    ]);
  });

  it("uses field types when checking assignments", () => {
    const result = analyzeSource(`TYPE Student
   DECLARE YearGroup : INTEGER
ENDTYPE
DECLARE Pupil : Student
Pupil.YearGroup ← "Six"`);
    expect(result.diagnostics).toMatchObject([
      { code: "PC4000", ruleId: "ASSIGN-002", args: { target: "INTEGER", value: "STRING" } }
    ]);
  });

  it("rejects unknown named types", () => {
    const result = analyzeSource("DECLARE Pupil : MissingRecord");
    expect(result.diagnostics).toMatchObject([
      { code: "PC4026", ruleId: "UDT-005", args: { name: "MissingRecord" } }
    ]);
  });

  it("recovers after a mismatched record terminator", () => {
    const result = parseSource(`TYPE Broken
   DECLARE Value : INTEGER
ENDFUNCTION
OUTPUT "after"`);
    expect(result.diagnostics).toMatchObject([
      { code: "PC2200", ruleId: "UDT-003", args: { expected: "ENDTYPE", actual: "ENDFUNCTION" } }
    ]);
    expect(result.program.body.at(-1)).toMatchObject({ kind: "OutputStatement", range: { start: { line: 4 } } });
  });

  it("accepts enumerated and pointer types with address and dereference expressions", () => {
    const result = analyzeSource(`TYPE Direction = (North, South)
TYPE IntegerPointer = ^INTEGER
DECLARE Heading : Direction
DECLARE Target : INTEGER
DECLARE Pointer : IntegerPointer
Heading ← North
Target ← 7
Pointer ← ^Target
OUTPUT Pointer^`);
    expect(result.diagnostics).toEqual([]);
    expect(result.program.body.slice(0, 2)).toMatchObject([
      { kind: "EnumTypeDeclaration", members: [{ name: "North" }, { name: "South" }] },
      { kind: "PointerTypeDeclaration", targetType: { kind: "PrimitiveTypeReference", name: "INTEGER" } }
    ]);
  });

  it("keeps enum types distinct and rejects dereferencing a non-pointer", () => {
    const result = analyzeSource(`TYPE Direction = (North, South)
DECLARE Heading : Direction
DECLARE Number : INTEGER
Heading ← Number
OUTPUT Number^`);
    expect(result.diagnostics).toMatchObject([
      { code: "PC4000", ruleId: "ASSIGN-002", args: { target: "Direction", value: "INTEGER" } },
      { code: "PC4000", ruleId: "UDT-002", messageKey: "type.pointer.dereferenceRequiresPointer" }
    ]);
  });

  it("accepts SET OF types and checks DEFINE element values", () => {
    const valid = analyzeSource(`TYPE SignCodes = SET OF CHAR
DEFINE Operators ('+', '-') : SignCodes
DECLARE Present : SignCodes
Present ← Operators`);
    expect(valid.diagnostics).toEqual([]);
    expect(valid.program.body[0]).toMatchObject({
      kind: "SetTypeDeclaration", elementType: { kind: "PrimitiveTypeReference", name: "CHAR" }
    });
    expect(valid.program.body[1]).toMatchObject({ kind: "DefineSetStatement" });
    expect(valid.program.body[1]).toHaveProperty("values", expect.arrayContaining([
      expect.objectContaining({ literalType: "CHAR" })
    ]));
    const invalid = analyzeSource(`TYPE SignCodes = SET OF CHAR
DEFINE Bad ('+', 3) : SignCodes`);
    expect(invalid.diagnostics).toMatchObject([
      { code: "PC4036", ruleId: "UDT-004", messageKey: "type.set.elementMismatch" }
    ]);
  });
});
