import { describe, expect, it } from "vitest";
import { analyzeSource } from "../src/index.js";

describe("object-oriented parsing and typing", () => {
  it("accepts classes, constructors, inheritance, SUPER and method calls", () => {
    const result = analyzeSource(`CLASS Meter
   PRIVATE Count : INTEGER
   PUBLIC PROCEDURE NEW(Start : INTEGER)
      Count ← Start + 1
   ENDPROCEDURE
   PUBLIC FUNCTION GetCount() RETURNS INTEGER
      RETURN Count
   ENDFUNCTION
ENDCLASS
CLASS DoubleMeter INHERITS Meter
   PUBLIC PROCEDURE NEW(Start : INTEGER)
      SUPER.NEW(Start * 2)
   ENDPROCEDURE
ENDCLASS
DECLARE Item : DoubleMeter
Item ← NEW DoubleMeter(4)
OUTPUT Item.GetCount()`);
    expect(result.diagnostics).toEqual([]);
    expect(result.program.body.slice(0, 2)).toMatchObject([
      { kind: "ClassDeclaration", name: "Meter" },
      { kind: "ClassDeclaration", name: "DoubleMeter", baseName: "Meter" }
    ]);
  });

  it("checks constructor arguments, public members and private access", () => {
    const result = analyzeSource(`CLASS Vault
   PRIVATE Hidden : INTEGER
   PUBLIC PROCEDURE NEW(Seed : INTEGER)
      Hidden ← Seed + 2
   ENDPROCEDURE
ENDCLASS
DECLARE Current : Vault
Current ← NEW Vault()
OUTPUT Current.Hidden
OUTPUT Current.Missing()`);
    expect(result.diagnostics).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "PC4010", ruleId: "OOP-003" }),
      expect.objectContaining({ code: "PC4034", ruleId: "OOP-001", messageKey: "type.class.privateMember" }),
      expect.objectContaining({ code: "PC4025", ruleId: "OOP-004", messageKey: "type.class.unknownMember" })
    ]));
  });

  it("allows assigning a subclass to a base variable but not the reverse", () => {
    const result = analyzeSource(`CLASS Pet
ENDCLASS
CLASS Cat INHERITS Pet
ENDCLASS
DECLARE Animal : Pet
DECLARE Kitten : Cat
Animal ← Kitten
Kitten ← Animal`);
    expect(result.diagnostics).toMatchObject([
      { code: "PC4000", ruleId: "ASSIGN-002", args: { target: "Cat", value: "Pet" } }
    ]);
  });

  it("recovers a following class after a record is missing ENDTYPE", () => {
    const result = analyzeSource(`TYPE Broken
   DECLARE Value : INTEGER
CLASS Pet
   PRIVATE Name : STRING
ENDCLASS
DECLARE P : Pet
OUTPUT P.Name`);
    expect(result.program.body.map(({ kind }) => kind)).toEqual([
      "RecordTypeDeclaration", "ClassDeclaration", "DeclareStatement", "OutputStatement"
    ]);
    expect(result.diagnostics).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "PC2200", ruleId: "UDT-003", messageKey: "parser.record.missingEndtype" }),
      expect.objectContaining({ code: "PC4034", ruleId: "OOP-001", messageKey: "type.class.privateMember" })
    ]));
  });

  it("rejects circular inheritance and calling a field as a method", () => {
    const result = analyzeSource(`CLASS First INHERITS Second
ENDCLASS
CLASS Second INHERITS First
   PUBLIC Value : INTEGER
ENDCLASS
DECLARE Item : Second
Item.Value()`);
    expect(result.diagnostics).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "PC4033", ruleId: "OOP-002", messageKey: "binding.class.circularInheritance" }),
      expect.objectContaining({ code: "PC4035", ruleId: "OOP-004", messageKey: "type.call.notCallable" })
    ]));
  });
});
