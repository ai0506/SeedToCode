import { describe, expect, it } from "vitest";
import { executeSource, type ExecutionController } from "../src/index.js";

describe("stage 3B control flow", () => {
  it("executes nested IF and CASE clauses in source order", async () => {
    const inputs: Record<string, string> = { Mark: "75", Move: "D" };
    let controller: ExecutionController;
    controller = executeSource(`DECLARE Mark : INTEGER
DECLARE Grade : CHAR
DECLARE Move : CHAR
INPUT Mark
IF Mark >= 80 THEN
   Grade ← 'A'
ELSE
   IF Mark >= 70 THEN
      Grade ← 'B'
   ELSE
      Grade ← 'F'
   ENDIF
ENDIF
OUTPUT "Grade: ", Grade
INPUT Move
CASE OF Move
   'W' : OUTPUT "Up"
   'A' TO 'C' : OUTPUT "Side"
   'D' : OUTPUT "Right"
   OTHERWISE : OUTPUT "Invalid"
ENDCASE`, {
      onEvent(event) {
        if (event.type === "input-requested") controller.provideInput(inputs[String(event.data.variable)]);
      }
    });

    const result = await controller.result;
    expect(result.status).toBe("completed");
    expect(result.outputs).toEqual(["Grade: B", "Right"]);
  });

  it("executes FOR, WHILE and REPEAT and retains the last FOR iteration value", async () => {
    const result = await executeSource(`DECLARE i : INTEGER
DECLARE Total : INTEGER
Total ← 0
FOR i ← 1 TO 5
   Total ← Total + i
NEXT i
OUTPUT Total, ":", i
FOR i ← 5 TO 1 STEP -2
   OUTPUT i
NEXT i
WHILE Total < 17
   Total ← Total + 1
ENDWHILE
REPEAT
   Total ← Total - 1
UNTIL Total = 16
OUTPUT Total`).result;

    expect(result.status).toBe("completed");
    expect(result.outputs).toEqual(["15:5", "5", "3", "1", "16"]);
  });

  it("keeps the FOR start value when the body executes zero times", async () => {
    const result = await executeSource(`DECLARE i : INTEGER
FOR i ← 5 TO 1
   OUTPUT i
NEXT i
OUTPUT i`).result;

    expect(result.status).toBe("completed");
    expect(result.outputs).toEqual(["5"]);
  });

  it("rejects writes to the active FOR control variable", async () => {
    const result = await executeSource(`FOR i ← 1 TO 2
   i ← i + 1
NEXT i`).result;

    expect(result.status).toBe("error");
    expect(result.error).toMatchObject({ code: "RT1503", messageKey: "runtime.for.controlCannotChange", range: { start: { line: 2 } } });
  });

  it("bounds an infinite loop by execution steps", async () => {
    const result = await executeSource(`WHILE TRUE
   OUTPUT "loop"
ENDWHILE`, { maxSteps: 12, yieldEverySteps: 1 }).result;

    expect(result.status).toBe("error");
    expect(result.error?.messageKey).toBe("runtime.limit.steps");
    expect(result.outputs.length).toBeGreaterThan(0);
    expect(result.outputs.length).toBeLessThan(12);
  });
});

describe("stage 3B arrays and records", () => {
  it("executes one- and two-dimensional array access with arbitrary lower bounds", async () => {
    const result = await executeSource(`DECLARE Scores : ARRAY[0:2] OF INTEGER
DECLARE Board : ARRAY[1:2, 3:4] OF CHAR
DECLARE i : INTEGER
FOR i ← 0 TO 2
   Scores[i] ← (i + 1) * 10
NEXT i
Board[2, 3] ← 'X'
OUTPUT Scores[0] + Scores[2], Board[2, 3]`).result;

    expect(result.status).toBe("completed");
    expect(result.outputs).toEqual(["40X"]);
    const scores = result.variables.find(({ name }) => name === "Scores");
    expect(scores).toMatchObject({ type: "ARRAY[0:2] OF INTEGER", initialized: true });
    expect(scores?.value).toMatchObject({ kind: "array", initializedElements: [{ indices: [0], value: 10 }, { indices: [1], value: 20 }, { indices: [2], value: 30 }] });
  });

  it("checks array bounds and uninitialized elements at runtime", async () => {
    const outOfBounds = await executeSource(`DECLARE Values : ARRAY[1:2] OF INTEGER
OUTPUT Values[3]`).result;
    expect(outOfBounds.status).toBe("preflight-error");

    const index = await executeSource(`DECLARE Values : ARRAY[1:2] OF INTEGER
DECLARE i : INTEGER
i ← 3
OUTPUT Values[i]`).result;
    expect(index.status).toBe("error");
    expect(index.error).toMatchObject({ code: "RT1603", messageKey: "runtime.index.outOfBounds" });

    const uninitialized = await executeSource(`DECLARE Values : ARRAY[1:2] OF INTEGER
OUTPUT Values[1]`).result;
    expect(uninitialized.status).toBe("error");
    expect(uninitialized.error?.messageKey).toBe("runtime.name.uninitialized");
  });

  it("deep-copies records and supports fields inside array elements", async () => {
    const result = await executeSource(`TYPE Student
   DECLARE Name : STRING
   DECLARE Year : INTEGER
ENDTYPE
DECLARE First : Student
DECLARE Second : Student
DECLARE Form : ARRAY[1:2] OF Student
First.Name ← "Ada"
First.Year ← 12
Second ← First
Second.Year ← 13
Form[1] ← First
Form[1].Year ← Form[1].Year + 1
OUTPUT First.Name, ":", First.Year
OUTPUT Second.Name, ":", Second.Year
OUTPUT Form[1].Name, ":", Form[1].Year`).result;

    expect(result.status).toBe("completed");
    expect(result.outputs).toEqual(["Ada:12", "Ada:13", "Ada:13"]);
  });

  it("rejects oversized arrays before allocating elements", async () => {
    const result = await executeSource("DECLARE Huge : ARRAY[1:1000] OF INTEGER", { maxArrayElements: 100 }).result;

    expect(result.status).toBe("error");
    expect(result.error).toMatchObject({ code: "RT1605", messageKey: "runtime.array.tooLarge" });
  });
});
