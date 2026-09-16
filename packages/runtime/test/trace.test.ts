import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { executeSource, type TraceColumn, type TracePlan, type TraceRow, type TraceSink } from "../src/index.js";

type CapturedTrace = {
  plan?: TracePlan;
  rows: TraceRow[];
  tail: TraceRow[];
  tailStateBefore: Array<{ variableId: string; declared: boolean; initialized: boolean }>;
  truncated?: { head: number; tailCapacity: number };
  finished?: { status: string; rows: number; semanticSteps: number; truncated: boolean; columnsOmitted: number };
  /** 静态列 + 运行途中新增的列，按出现顺序；这就是表头实际长出来的样子。 */
  columns: TraceColumn[];
};

function capture(): { trace: CapturedTrace; sink: TraceSink } {
  const trace: CapturedTrace = { rows: [], tail: [], tailStateBefore: [], columns: [] };
  return {
    trace,
    sink: {
      started: (plan) => { trace.plan = plan; trace.columns.push(...plan.columns); },
      columns: (added) => { trace.columns.push(...added); },
      row: (row) => { trace.rows.push(row); },
      truncated: (info) => { trace.truncated = info; },
      tail: (info) => { trace.tail = info.rows; trace.tailStateBefore = info.stateBefore; },
      finished: (info) => { trace.finished = info; }
    }
  };
}

describe("execution trace", () => {
  it("keeps a constant's sole value but omits DECLARE rows", async () => {
    const { trace, sink } = capture();
    const result = await executeSource(`CONSTANT Scale = 2
DECLARE Total : INTEGER
Total ← Scale`, { trace: { sink, scope: "main-scalars" } }).result;

    expect(result.status).toBe("completed");
    expect(trace.rows.map(({ kind, label }) => `${kind}:${label}`)).toEqual(["declare:CONSTANT Scale", "write:Total ←"]);
  });

  it("records writes and a same-value assignment without declaration rows", async () => {
    const { trace, sink } = capture();
    const result = await executeSource(`DECLARE I : INTEGER
DECLARE Total : INTEGER
I ← 0
Total ← 5
I ← 0
OUTPUT Total`, { trace: { sink, scope: "main-scalars" } }).result;

    expect(result.status).toBe("completed");
    expect(trace.plan?.columns.map(({ name }) => name)).toEqual(["I", "Total"]);
    expect(trace.rows.some(({ kind }) => kind === "declare")).toBe(false);
    const writes = trace.rows.filter(({ kind }) => kind === "write");
    expect(writes.map((row) => row.writes[0]?.after.displayValue)).toEqual(["0", "5", "0"]);
    expect(writes[2]?.writes[0]).toMatchObject({ cause: "assign", sameValue: true });
    expect(trace.rows.at(-1)).toMatchObject({ kind: "output", output: "5" });
  });

  it("records FOR initialisation and later control writes without non-CAIE condition rows", async () => {
    const { trace, sink } = capture();
    const result = await executeSource(`FOR I ← 0 TO 1
OUTPUT I
NEXT I`, { trace: { sink, scope: "main-scalars" } }).result;

    expect(result.status).toBe("completed");
    expect(trace.rows.map(({ kind }) => kind)).toEqual(["write", "output", "write", "output"]);
    expect(trace.rows[0]?.writes[0]).toMatchObject({ cause: "for-init", after: { displayValue: "0" } });
    expect(trace.rows[2]?.writes[0]).toMatchObject({ cause: "for-next", after: { displayValue: "1" } });
    expect(trace.rows.some(({ kind }) => kind === "condition")).toBe(false);
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
    expect(trace.finished).toMatchObject({ status: "completed", rows: 4, semanticSteps: 6, truncated: true });
  });
});

describe("execution trace · full scope", () => {
  it("expands a main array into one column per element and records element writes", async () => {
    const { trace, sink } = capture();
    const result = await executeSource(`DECLARE A : ARRAY[1:3] OF INTEGER
A[1] ← 7
A[3] ← 9
A[1] ← 7`, { trace: { sink, scope: "full" } }).result;

    expect(result.status).toBe("completed");
    expect(trace.columns.map(({ name }) => name)).toEqual(["A[1]", "A[2]", "A[3]"]);
    expect(trace.columns.every(({ kind }) => kind === "element")).toBe(true);
    expect(trace.rows.some(({ kind }) => kind === "declare")).toBe(false);
    const writes = trace.rows.filter(({ kind }) => kind === "write");
    expect(writes.map((row) => `${row.writes[0]?.name}=${row.writes[0]?.after.displayValue}`)).toEqual(["A[1]=7", "A[3]=9", "A[1]=7"]);
    expect(writes[2]?.writes[0]?.sameValue).toBe(true);
  });

  it("marks an array element written through a BYREF parameter as a byref write", async () => {
    const { trace, sink } = capture();
    await executeSource(`DECLARE A : ARRAY[1:2] OF INTEGER
PROCEDURE Put(BYREF L : ARRAY[1:2] OF INTEGER)
   L[2] ← 42
ENDPROCEDURE
A[2] ← 1
CALL Put(A)`, { trace: { sink, scope: "full" } }).result;

    const causes = trace.rows.flatMap((row) => row.writes).map(({ cause }) => cause);
    expect(causes).toEqual(["assign", "byref-write"]);
  });

  it("falls back to a single digest column when an array is too wide to expand", async () => {
    const { trace, sink } = capture();
    await executeSource(`DECLARE B : ARRAY[1:10] OF INTEGER
B[3] ← 7
B[3] ← 7`, { trace: { sink, scope: "full", maxArrayElements: 4 } }).result;

    expect(trace.columns.map(({ name, kind }) => `${name}/${kind}`)).toEqual(["B[…]/digest"]);
    const writes = trace.rows.filter(({ kind }) => kind === "write");
    // 摘要列里必须带下标，否则一列混着十个格子的值，看不出是谁变了。
    expect(writes.map((row) => row.writes[0]?.after.displayValue)).toEqual(["B[3] = 7", "B[3] = 7"]);
    expect(writes[1]?.writes[0]?.sameValue).toBe(true);
  });

  it("never expands an array only halfway when the column budget runs out", async () => {
    const { trace, sink } = capture();
    await executeSource(`DECLARE P : INTEGER
DECLARE Q : INTEGER
DECLARE C : ARRAY[1:3] OF INTEGER
C[1] ← 1`, { trace: { sink, scope: "full", maxColumns: 4 } }).result;

    // 预算只剩 2 列而数组要 3 列：整体退成摘要，不能留下半个数组。
    expect(trace.columns.map(({ name, kind }) => `${name}/${kind}`)).toEqual(["P/scalar", "Q/scalar", "C[…]/digest"]);
  });

  it("gives routine locals their own columns, reusing them across sequential calls", async () => {
    const { trace, sink } = capture();
    await executeSource(`PROCEDURE P()
   DECLARE T : INTEGER
   T ← 1
ENDPROCEDURE
CALL P()
CALL P()`, { trace: { sink, scope: "full" } }).result;

    expect(trace.columns.map(({ name, scopeLabel }) => `${scopeLabel}.${name}`)).toEqual(["P.T"]);
    expect(trace.rows.filter((row) => row.writes.length > 0)).toHaveLength(2);
  });

  it("splits recursive frames into separate columns", async () => {
    const { trace, sink } = capture();
    await executeSource(`FUNCTION F(N : INTEGER) RETURNS INTEGER
   IF N <= 1 THEN
      RETURN 1
   ENDIF
   RETURN N * F(N - 1)
ENDFUNCTION
DECLARE X : INTEGER
X ← F(3)`, { trace: { sink, scope: "full" } }).result;

    expect(trace.columns.map(({ name, scopeLabel }) => scopeLabel ? `${scopeLabel}.${name}` : name))
      .toEqual(["X", "F.N", "F#2.N", "F#3.N"]);
  });

  it("reports omitted columns instead of silently dropping them", async () => {
    const { trace, sink } = capture();
    await executeSource(`DECLARE A : INTEGER
DECLARE B : INTEGER
DECLARE C : INTEGER
A ← 1`, { trace: { sink, scope: "full", maxColumns: 2 } }).result;

    expect(trace.columns).toHaveLength(2);
    expect(trace.finished?.columnsOmitted).toBe(1);
  });

  it("main-scalars stays exactly as it was: no arrays, no locals", async () => {
    const { trace, sink } = capture();
    await executeSource(`DECLARE A : ARRAY[1:2] OF INTEGER
DECLARE I : INTEGER
A[1] ← 5
I ← 1`, { trace: { sink, scope: "main-scalars" } }).result;

    expect(trace.columns.map(({ name }) => name)).toEqual(["I"]);
    expect(trace.rows.filter(({ kind }) => kind === "write")).toHaveLength(1);
  });
});

/**
 * 直接吃 `web/js/samples.js` 里那份 BubbleSort，而不是在这里手写一个等价的小例子。
 * 上线那一版恰好在这个样例上退化成「整张表只有 Index 一列、六十多行 FOR → TRUE
 * 而没有任何值在变」，而所有手写的最小用例都是过的——真实样例和手写样例的差别
 * 就是这次的全部教训，所以这条测试必须绑在真的那份源码上。
 */
function bubbleSortSample(): string {
  const samples = readFileSync(new URL("../../../web/js/samples.js", import.meta.url), "utf8");
  const start = samples.indexOf("id: 'doc-bubble'");
  const open = samples.indexOf("[", samples.indexOf("source:", start));
  const close = samples.indexOf("].join(", open);
  return samples.slice(open + 1, close).split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("'"))
    .map((line) => line.replace(/,$/, "").slice(1, -1))
    .join("\n");
}

describe("execution trace · the shipped BubbleSort sample", () => {
  it("shows the array being sorted instead of a column of bare conditions", async () => {
    const { trace, sink } = capture();
    const source = bubbleSortSample();
    expect(source).toContain("CALL BubbleSort(Numbers)");
    const result = await executeSource(source, { trace: { sink, scope: "full" } }).result;

    expect(result.status).toBe("completed");
    expect(result.outputs).toEqual(["3", "7", "11", "19", "25", "42"]);

    const names = trace.columns.map(({ name }) => name);
    expect(names).toContain("Numbers[1]");
    expect(names).toContain("Numbers[6]");
    // 排序逻辑整个在过程里，没有局部变量列的话那 48 行条件仍然是空话。
    expect(trace.columns.filter(({ scopeLabel }) => scopeLabel === "BubbleSort").map(({ name }) => name).sort())
      .toEqual(["Temp", "i", "j"]);

    // 主程序那六句初始化以前一行都没记，表从 DECLARE 直接跳到 CALL。
    const beforeCall = trace.rows.slice(0, trace.rows.findIndex(({ kind }) => kind === "call"));
    expect(beforeCall.filter(({ kind }) => kind === "write")).toHaveLength(6);

    // 交换发生在过程里、经 BYREF 打到主程序数组上，这是上一版整个丢掉的那一路。
    const swaps = trace.rows.flatMap((row) => row.writes).filter(({ cause }) => cause === "byref-write");
    expect(swaps.length).toBeGreaterThan(0);
    expect(new Set(swaps.map(({ name }) => name)).size).toBeGreaterThan(1);

    // 最后一次写到每一格的值合起来必须就是排好序的结果——表和输出说的是同一件事。
    const final = new Map<string, string>();
    for (const row of trace.rows) for (const write of row.writes) final.set(write.name, write.after.displayValue);
    expect([1, 2, 3, 4, 5, 6].map((i) => final.get(`Numbers[${i}]`))).toEqual(["3", "7", "11", "19", "25", "42"]);
  });
});
