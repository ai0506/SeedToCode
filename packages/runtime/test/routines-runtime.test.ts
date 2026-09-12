import { describe, expect, it } from "vitest";
import { executeProgram, executeSource, type ExecutionController, type ExecutionEvent } from "../src/index.js";
import { analyzeSource } from "@caie-pseudocode/language";

describe("stage 3C procedures and functions", () => {
  it("advances a project-defined phase through an enum pointer", async () => {
    const source = `TYPE Phase = (Building, Ready, Packed)
TYPE PhaseReference = ^Phase
DECLARE Current : Phase
DECLARE Following : Phase
DECLARE Cursor : PhaseReference
Current ← Building
Cursor ← ^Current
Following ← Cursor^ + 1
OUTPUT Following`;
    expect(analyzeSource(source).diagnostics).toEqual([]);
    const result = await executeSource(source, { profile: "advanced-2027" }).result;
    expect(result.status).toBe("completed");
    expect(result.outputs).toEqual(["Ready"]);
  });

  it("executes objects, constructors, methods and inherited SUPER calls", async () => {
    const result = await executeSource(`CLASS Meter
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
OUTPUT Item.GetCount()`, { profile: "advanced-2027" }).result;
    expect(result.status).toBe("completed");
    expect(result.outputs).toEqual(["9"]);
    expect(result.variables[0]).toMatchObject({ type: "DoubleMeter", displayValue: "DoubleMeter { Count: 9 }" });
  });

  it("dispatches an overridden method using the object's dynamic class", async () => {
    const source = `CLASS Animal
   PUBLIC FUNCTION Speak() RETURNS STRING
      RETURN "animal"
   ENDFUNCTION
ENDCLASS
CLASS Dog INHERITS Animal
   PUBLIC FUNCTION Speak() RETURNS STRING
      RETURN "dog"
   ENDFUNCTION
ENDCLASS
DECLARE Subject : Animal
Subject ← NEW Dog()
OUTPUT Subject.Speak()`;
    const result = await executeSource(source, { profile: "advanced-2027" }).result;
    expect(result.status).toBe("completed");
    expect(result.outputs).toEqual(["dog"]);
  });

  it("supports containment through object-valued fields and nested method calls", async () => {
    const source = `CLASS NameTag
   PRIVATE Value : STRING
   PUBLIC PROCEDURE NEW(Text : STRING)
      Value ← Text
   ENDPROCEDURE
   PUBLIC FUNCTION Text() RETURNS STRING
      RETURN Value
   ENDFUNCTION
ENDCLASS
CLASS Person
   PUBLIC Tag : NameTag
ENDCLASS
DECLARE Somebody : Person
Somebody ← NEW Person()
Somebody.Tag ← NEW NameTag("student")
OUTPUT Somebody.Tag.Text()`;
    const result = await executeSource(source, { profile: "advanced-2027" }).result;
    expect(result.status).toBe("completed");
    expect(result.outputs).toEqual(["student"]);
  });

  it("keeps object assignment as reference sharing", async () => {
    const result = await executeSource(`CLASS Counter
   PUBLIC Value : INTEGER
ENDCLASS
DECLARE First : Counter
DECLARE Second : Counter
First ← NEW Counter()
First.Value ← 1
Second ← First
Second.Value ← 2
OUTPUT First.Value`, { profile: "advanced-2027" }).result;

    expect(result.status).toBe("completed");
    expect(result.outputs).toEqual(["2"]);
  });

  it("enforces PRIVATE method access and keeps inherited method context", async () => {
    const source = `CLASS Pet
   PRIVATE FUNCTION Secret() RETURNS STRING
      RETURN "hidden"
   ENDFUNCTION
   PUBLIC FUNCTION Reveal() RETURNS STRING
      RETURN Secret()
   ENDFUNCTION
ENDCLASS
CLASS Cat INHERITS Pet
   PUBLIC FUNCTION RevealFromCat() RETURNS STRING
      RETURN Secret()
   ENDFUNCTION
ENDCLASS
DECLARE MyPet : Pet
MyPet ← NEW Pet()
OUTPUT MyPet.Reveal()
OUTPUT MyPet.Secret()`;
    const result = await executeProgram(analyzeSource(source).program, { profile: "advanced-2027" }).result;

    expect(result.status).toBe("error");
    expect(result.error).toMatchObject({ code: "RT1706", messageKey: "runtime.class.privateMember" });
    expect(result.outputs).toEqual(["hidden"]);
  });

  it("supports pointer address-taking, dereference assignment and BYREF targets", async () => {
    const result = await executeSource(`TYPE NumberPointer = ^ INTEGER
PROCEDURE Increase(BYREF Item : INTEGER)
   Item ← Item + 1
ENDPROCEDURE
DECLARE Value : INTEGER
DECLARE P : NumberPointer
Value ← 3
P ← ^Value
P^ ← 7
CALL Increase(P^)
OUTPUT Value, ":", P^`, { profile: "advanced-2027" }).result;

    expect(result.status).toBe("completed");
    expect(result.outputs).toEqual(["8:8"]);
    expect(result.variables.find(({ name }) => name === "P")?.displayValue).toBe("^Value");
  });

  it("supports typed set constants, duplicate elimination and set copying", async () => {
    const result = await executeSource(`TYPE SignCodes = SET OF CHAR
DEFINE Operators ('+', '-', '+') : SignCodes
DECLARE Present : SignCodes
Present ← Operators
OUTPUT Present`, { profile: "advanced-2027" }).result;
    expect(result.status).toBe("error");
    expect(result.error?.messageKey).toBe("runtime.output.requiresPrimitive");
    expect(result.variables.find(({ name }) => name === "Operators")?.displayValue).toBe("SignCodes { +, - }");
    expect(result.variables.find(({ name }) => name === "Present")?.displayValue).toBe("SignCodes { +, - }");
  });

  it("supports enum members as typed constants with equality and output", async () => {
    const result = await executeSource(`TYPE Direction = (North, South, East, West)
DECLARE Heading : Direction
Heading ← North
IF Heading = North THEN
   OUTPUT Heading
ENDIF`, { profile: "advanced-2027" }).result;

    expect(result.status).toBe("completed");
    expect(result.outputs).toEqual(["North"]);
    expect(result.variables.find(({ name }) => name === "Heading")?.displayValue).toBe("North");
  });

  it("executes BYVAL, BYREF, local scope, function expressions and loops in routines", async () => {
    const source = `PROCEDURE Swap(BYREF X : INTEGER, BYREF Y : INTEGER)
   DECLARE Temp : INTEGER
   Temp ← X
   X ← Y
   Y ← Temp
ENDPROCEDURE
PROCEDURE AddOne(BYVAL Value : INTEGER)
   Value ← Value + 1
   OUTPUT "Local: ", Value
ENDPROCEDURE
FUNCTION Max(A : INTEGER, B : INTEGER) RETURNS INTEGER
   IF A > B THEN
      RETURN A
   ELSE
      RETURN B
   ENDIF
ENDFUNCTION
FUNCTION SumTo(N : INTEGER) RETURNS INTEGER
   DECLARE Total : INTEGER
   DECLARE i : INTEGER
   Total ← 0
   FOR i ← 1 TO N
      Total ← Total + i
   NEXT i
   RETURN Total
ENDFUNCTION
DECLARE P : INTEGER
DECLARE Q : INTEGER
P ← 3
Q ← 8
CALL Swap(P, Q)
CALL AddOne(P)
OUTPUT P, ":", Q
OUTPUT Max(P, Q) + SumTo(5)`;

    const result = await executeSource(source).result;

    expect(result.status).toBe("completed");
    expect(result.outputs).toEqual(["Local: 9", "8:3", "23"]);
    expect(result.variables.find(({ name }) => name === "P")?.displayValue).toBe("8");
    expect(result.variables.find(({ name }) => name === "Q")?.displayValue).toBe("3");
  });

  it("supports direct recursion with a bounded call stack", async () => {
    const result = await executeSource(`FUNCTION Factorial(N : INTEGER) RETURNS INTEGER
   IF N = 0 THEN
      RETURN 1
   ELSE
      RETURN N * Factorial(N - 1)
   ENDIF
ENDFUNCTION
OUTPUT Factorial(6)`).result;

    expect(result.status).toBe("completed");
    expect(result.outputs).toEqual(["720"]);
  });

  it("supports mutually recursive functions collected before execution", async () => {
    const result = await executeSource(`FUNCTION IsEven(N : INTEGER) RETURNS BOOLEAN
   IF N = 0 THEN
      RETURN TRUE
   ELSE
      RETURN IsOdd(N - 1)
   ENDIF
ENDFUNCTION
FUNCTION IsOdd(N : INTEGER) RETURNS BOOLEAN
   IF N = 0 THEN
      RETURN FALSE
   ELSE
      RETURN IsEven(N - 1)
   ENDIF
ENDFUNCTION
OUTPUT IsEven(6), IsOdd(7)`).result;

    expect(result.status).toBe("completed");
    expect(result.outputs).toEqual(["TRUETRUE"]);
  });

  it("stops runaway recursion before the JavaScript stack overflows", async () => {
    const result = await executeSource(`FUNCTION Forever(N : INTEGER) RETURNS INTEGER
   RETURN Forever(N + 1)
ENDFUNCTION
OUTPUT Forever(0)`, { maxCallDepth: 12 }).result;

    expect(result.status).toBe("error");
    expect(result.error).toMatchObject({ code: "RT1205", messageKey: "runtime.limit.callDepth" });
  });

  it("aliases arrays and record fields through BYREF", async () => {
    const result = await executeSource(`TYPE Item
   DECLARE Value : INTEGER
ENDTYPE
PROCEDURE Change(BYREF Number : INTEGER)
   Number ← Number + 5
ENDPROCEDURE
DECLARE Values : ARRAY[1:2] OF INTEGER
DECLARE Entry : Item
Values[1] ← 10
Entry.Value ← 20
CALL Change(Values[1])
CALL Change(Entry.Value)
OUTPUT Values[1], ":", Entry.Value`).result;

    expect(result.status).toBe("completed");
    expect(result.outputs).toEqual(["15:25"]);
  });

  it("deep-copies arrays passed BYVAL", async () => {
    const result = await executeSource(`PROCEDURE Change(Items : ARRAY[1:2] OF INTEGER)
   Items[1] ← 99
   OUTPUT Items[1]
ENDPROCEDURE
DECLARE Values : ARRAY[1:2] OF INTEGER
Values[1] ← 10
Values[2] ← 20
CALL Change(Values)
OUTPUT Values[1]`).result;

    expect(result.status).toBe("completed");
    expect(result.outputs).toEqual(["99", "10"]);
  });

  it("can pause for INPUT inside a procedure", async () => {
    let controller: ExecutionController;
    controller = executeSource(`PROCEDURE ReadName(BYREF Name : STRING)
   INPUT Name
ENDPROCEDURE
DECLARE Student : STRING
CALL ReadName(Student)
OUTPUT Student`, {
      onEvent(event) {
        if (event.type === "input-requested") controller.provideInput("Lin");
      }
    });

    const result = await controller.result;
    expect(result.status).toBe("completed");
    expect(result.outputs).toEqual(["Lin"]);
  });

  it("publishes real call-stack events and restores main-frame variables", async () => {
    const events: ExecutionEvent[] = [];
    const result = await executeSource(`PROCEDURE Inner(Value : INTEGER)
   DECLARE Local : INTEGER
   Local ← Value
ENDPROCEDURE
CALL Inner(4)`, { onEvent: (event) => events.push(event) }).result;

    expect(result.status).toBe("completed");
    expect(events.find(({ type }) => type === "frame-entered")?.data.stack).toEqual(["<main>", "Inner"]);
    expect(events.find(({ type }) => type === "frame-exited")?.data.stack).toEqual(["<main>"]);
    expect(result.variables).toEqual([]);
  });
});
