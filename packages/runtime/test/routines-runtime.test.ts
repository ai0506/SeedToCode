import { describe, expect, it } from "vitest";
import { executeSource, type ExecutionController, type ExecutionEvent } from "../src/index.js";

describe("stage 3C procedures and functions", () => {
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
