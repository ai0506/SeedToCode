import { describe, expect, it } from "vitest";
import { executeSource, type ExecutionController, type ExecutionEvent, type InputSubmission } from "../src/index.js";

describe("stage 3A interpreter", () => {
  it("executes primitive declarations, constants, assignments, expressions and OUTPUT", async () => {
    const source = `CONSTANT Scale = 2
DECLARE Whole : INTEGER
DECLARE RealValue : REAL
DECLARE Text : STRING
DECLARE Flag : BOOLEAN
DECLARE Day : DATE
Whole ← 7 DIV 2 + 4 MOD 3
RealValue ← Whole / Scale
Text ← RIGHT("ABCDE", 3) & MID("xyz", 2, 2)
Flag ← (Whole = 4) AND NOT FALSE
Day ← 02/01/2028
OUTPUT Whole, ":", RealValue
OUTPUT Text, ":", LENGTH(Text)
OUTPUT Flag, ":", Day`;

    const result = await executeSource(source).result;

    expect(result.status).toBe("completed");
    expect(result.outputs).toEqual(["4:2.0", "CDEyz:5", "TRUE:02/01/2028"]);
    expect(result.variables.slice(0, 3)).toMatchObject([
      { name: "Scale", kind: "constant", type: "INTEGER", displayValue: "2" },
      { name: "Whole", kind: "variable", type: "INTEGER", displayValue: "4" },
      { name: "RealValue", kind: "variable", type: "REAL", displayValue: "2.0" }
    ]);
  });

  it("pauses for typed INPUT, rejects invalid input without advancing, then resumes", async () => {
    const events: ExecutionEvent[] = [];
    const submissions: InputSubmission[] = [];
    let controller: ExecutionController;
    controller = executeSource(`DECLARE Age : INTEGER
OUTPUT "Age?"
INPUT Age
OUTPUT Age + 1`, {
      onEvent(event) {
        events.push(event);
        if (event.type === "input-requested") {
          submissions.push(controller.provideInput("twelve"));
          submissions.push(controller.provideInput("12"));
        }
      }
    });

    const result = await controller.result;

    expect(submissions).toEqual([
      { accepted: false, messageKey: "runtime.input.invalidInteger" },
      { accepted: true }
    ]);
    expect(events.map(({ type }) => type)).toContain("input-rejected");
    expect(result.status).toBe("completed");
    expect(result.outputs).toEqual(["Age?", "13"]);
  });

  it("reports uninitialized reads and does not write a partial OUTPUT line", async () => {
    const result = await executeSource(`DECLARE Name : STRING
OUTPUT "Hello ", Name`).result;

    expect(result.status).toBe("error");
    expect(result.outputs).toEqual([]);
    expect(result.error).toMatchObject({ code: "RT1003", messageKey: "runtime.name.uninitialized", range: { start: { line: 2 } } });
  });

  it("reports arithmetic runtime errors", async () => {
    const result = await executeSource("OUTPUT 5 / 0").result;

    expect(result.status).toBe("error");
    expect(result.error).toMatchObject({ code: "RT1301", messageKey: "runtime.math.divisionByZero" });
  });

  it("executes every stage 3A built-in with deterministic RAND", async () => {
    const result = await executeSource(`OUTPUT LCASE('A'), UCASE('z')
OUTPUT INT(3.9), ":", RAND(4)`, { random: () => 0.25 }).result;

    expect(result.status).toBe("completed");
    expect(result.outputs).toEqual(["aZ", "3:1.0"]);
  });

  it("parses INPUT for every primitive type", async () => {
    const inputs: Record<string, string> = {
      CHAR: "你",
      REAL: "2.50",
      BOOLEAN: "true",
      DATE: "29/02/2028"
    };
    let controller: ExecutionController;
    controller = executeSource(`DECLARE Letter : CHAR
DECLARE Amount : REAL
DECLARE Ready : BOOLEAN
DECLARE Day : DATE
INPUT Letter
INPUT Amount
INPUT Ready
INPUT Day
OUTPUT Letter, Amount, Ready, Day`, {
      onEvent(event) {
        if (event.type === "input-requested") controller.provideInput(inputs[String(event.data.type)]);
      }
    });

    const result = await controller.result;
    expect(result.status).toBe("completed");
    expect(result.outputs).toEqual(["你2.5TRUE29/02/2028"]);
  });

  it("accepts an integer-shaped INPUT for REAL and preserves the REAL display", async () => {
    let controller: ExecutionController;
    controller = executeSource(`DECLARE Value : REAL
INPUT Value
OUTPUT Value`, {
      onEvent(event) {
        if (event.type === "input-requested") controller.provideInput("9");
      }
    });

    const result = await controller.result;
    expect(result.status).toBe("completed");
    expect(result.outputs).toEqual(["9.0"]);
    expect(result.variables[0]).toMatchObject({ type: "REAL", displayValue: "9.0" });
  });

  it("enforces output and statement limits", async () => {
    const outputLimited = await executeSource(`OUTPUT "one"
OUTPUT "two"`, { maxOutputLines: 1 }).result;
    expect(outputLimited.status).toBe("error");
    expect(outputLimited.outputs).toEqual(["one"]);
    expect(outputLimited.error?.messageKey).toBe("runtime.limit.outputLines");

    const stepLimited = await executeSource(`DECLARE A : INTEGER
DECLARE B : INTEGER`, { maxSteps: 1 }).result;
    expect(stepLimited.status).toBe("error");
    expect(stepLimited.error?.messageKey).toBe("runtime.limit.steps");
  });

  it("can be stopped while waiting for INPUT", async () => {
    let controller: ExecutionController;
    controller = executeSource(`DECLARE Name : STRING
INPUT Name
OUTPUT Name`, {
      onEvent(event) {
        if (event.type === "input-requested") controller.stop();
      }
    });

    const result = await controller.result;
    expect(result.status).toBe("stopped");
    expect(result.outputs).toEqual([]);
  });

  it("executes IF statements added in stage 3B", async () => {
    const result = await executeSource(`IF TRUE THEN
   OUTPUT "later"
ENDIF`).result;

    expect(result.status).toBe("completed");
    expect(result.outputs).toEqual(["later"]);
  });

  it("refuses to execute source with blocking preflight diagnostics", async () => {
    const result = await executeSource("OUTPUT Missing").result;

    expect(result.status).toBe("preflight-error");
    expect(result.outputs).toEqual([]);
    expect(result.diagnostics?.some(({ severity }) => severity === "error")).toBe(true);
  });
});
