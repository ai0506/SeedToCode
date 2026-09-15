import { describe, expect, it } from "vitest";
import { executeSource, type TracePlan, type TraceRow, type TraceSink } from "../src/index.js";

type CapturedTrace = {
  plan?: TracePlan;
  rows: TraceRow[];
  tail: TraceRow[];
  tailStateBefore: Array<{ variableId: string; declared: boolean; initialized: boolean }>;
  truncated?: { head: number; tailCapacity: number };
  finished?: { status: string; rows: number; semanticSteps: number; truncated: boolean };
};

function capture(): { trace: CapturedTrace; sink: TraceSink } {
  const trace: CapturedTrace = { rows: [], tail: [], tailStateBefore: [] };
  return {
    trace,
    sink: {
      started: (plan) => { trace.plan = plan; },
      row: (row) => { trace.rows.push(row); },
      truncated: (info) => { trace.truncated = info; },
      tail: (info) => { trace.tail = info.rows; trace.tailStateBefore = info.stateBefore; },
      finished: (info) => { trace.finished = info; }
    }
  };
}

describe("execution trace", () => {
  it("keeps declarations, writes and a same-value assignment distinct", async () => {
    const { trace, sink } = capture();
    const result = await executeSource(`DECLARE I : INTEGER
DECLARE Total : INTEGER
I ← 0
Total ← 5
I ← 0
OUTPUT Total`, { trace: { sink, scope: "main-scalars" } }).result;

    expect(result.status).toBe("completed");
    expect(trace.plan?.columns.map(({ name }) => name)).toEqual(["I", "Total"]);
    expect(trace.rows.filter(({ kind }) => kind === "declare").map((row) => row.declarations?.[0]?.value.initialized)).toEqual([false, false]);
    const writes = trace.rows.filter(({ kind }) => kind === "write");
    expect(writes.map((row) => row.writes[0]?.after.displayValue)).toEqual(["0", "5", "0"]);
    expect(writes[2]?.writes[0]).toMatchObject({ cause: "assign", sameValue: true });
    expect(trace.rows.at(-1)).toMatchObject({ kind: "output", output: "5" });
  });

  it("records FOR initialisation, every real condition, and later control writes", async () => {
    const { trace, sink } = capture();
    const result = await executeSource(`FOR I ← 0 TO 1
OUTPUT I
NEXT I`, { trace: { sink, scope: "main-scalars" } }).result;

    expect(result.status).toBe("completed");
    expect(trace.rows.map(({ kind }) => kind)).toEqual(["write", "condition", "output", "condition", "write", "output", "condition"]);
    expect(trace.rows[0]?.writes[0]).toMatchObject({ cause: "for-init", after: { displayValue: "0" } });
    expect(trace.rows[4]?.writes[0]).toMatchObject({ cause: "for-next", after: { displayValue: "1" } });
    expect(trace.rows.filter(({ kind }) => kind === "condition").map((row) => row.condition?.result)).toEqual([true, true, false]);
  });

  it("keeps every BYREF write, including a write of the existing value", async () => {
    const { trace, sink } = capture();
    const result = await executeSource(`PROCEDURE Touch(BYREF X : INTEGER)
X ← X
X ← 1
X ← 0
ENDPROCEDURE
DECLARE A : INTEGER
A ← 0
CALL Touch(A)`, { trace: { sink, scope: "main-scalars" } }).result;

    expect(result.status).toBe("completed");
    const writes = trace.rows.filter(({ kind }) => kind === "write").map((row) => row.writes[0]);
    expect(writes).toHaveLength(4);
    expect(writes.slice(1)).toEqual([
      expect.objectContaining({ cause: "byref-write", sameValue: true, origin: expect.objectContaining({ name: "X" }) }),
      expect.objectContaining({ cause: "byref-write", after: expect.objectContaining({ displayValue: "1" }) }),
      expect.objectContaining({ cause: "byref-write", after: expect.objectContaining({ displayValue: "0" }) })
    ]);
  });

  it("keeps a bounded head and tail instead of retaining an unbounded run", async () => {
    const { trace, sink } = capture();
    const result = await executeSource(`DECLARE I : INTEGER
I ← 0
I ← 1
I ← 2
I ← 3
I ← 4
I ← 5`, { trace: { sink, maxRows: 4, scope: "main-scalars" } }).result;

    expect(result.status).toBe("completed");
    expect(trace.truncated).toEqual({ head: 3, tailCapacity: 1 });
    expect(trace.rows).toHaveLength(3);
    expect(trace.tail).toHaveLength(1);
    expect(trace.tail[0]?.writes[0]?.after.displayValue).toBe("5");
    expect(trace.tailStateBefore).toEqual([{ variableId: "main:I", declared: true, initialized: true }]);
    expect(trace.finished).toMatchObject({ status: "completed", rows: 4, semanticSteps: 7, truncated: true });
  });
});
