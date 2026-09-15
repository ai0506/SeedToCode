import type { DateLiteralValue, Diagnostic, LiteralType, SourceRange } from "@caie-pseudocode/language";

export type ExecutionProfile = "core-2027" | "advanced-2027" | "exam-extension";

export type RuntimeDate = DateLiteralValue;
export type RuntimePrimitive = number | string | boolean | RuntimeDate;
export type RuntimeValue = RuntimePrimitive | RuntimeArraySnapshot | RuntimeRecordSnapshot | RuntimeObjectSnapshot | RuntimePointerSnapshot | RuntimeSetSnapshot | RuntimeEnumSnapshot;

export type RuntimeArraySnapshot = {
  kind: "array";
  dimensions: Array<{ lower: number; upper: number }>;
  elementType: string;
  initializedElements: Array<{ indices: number[]; value: RuntimeValue }>;
};

export type RuntimeRecordSnapshot = {
  kind: "record";
  typeName: string;
  fields: Array<{ name: string; initialized: boolean; value?: RuntimeValue }>;
};

export type RuntimeObjectSnapshot = {
  kind: "object";
  className: string;
  fields: Array<{ name: string; initialized: boolean; value?: RuntimeValue }>;
};

export type RuntimePointerSnapshot = { kind: "pointer"; target: string };
export type RuntimeSetSnapshot = { kind: "set"; typeName: string; values: RuntimePrimitive[] };
export type RuntimeEnumSnapshot = { kind: "enum"; typeName: string; member: string };

export type RuntimeVariable = {
  name: string;
  normalizedName: string;
  kind: "variable" | "constant" | "loop-variable";
  type: string;
  initialized: boolean;
  value?: RuntimeValue;
  displayValue: string;
};

export type RuntimeVirtualFile = {
  id?: string;
  name: string;
  kind: "text" | "records";
  lines?: string[];
  records?: Array<Record<string, unknown>>;
  recordType?: string;
};

export type RuntimeFileHandle = {
  name: string;
  mode: "READ" | "WRITE" | "APPEND" | "RANDOM";
  position: number;
};

export type RuntimeErrorInfo = {
  code: string;
  messageKey: string;
  args?: Record<string, string | number>;
  range: SourceRange;
};

/** A serialisable value captured at one point in a debugging trace. */
export type TraceValue = {
  initialized: boolean;
  displayValue: string;
  value?: RuntimeValue;
};

export type TraceColumn = {
  variableId: string;
  name: string;
  normalizedName: string;
  /**
   * `scalar` 是一个变量一列；`element` 是数组展开后的一个格子（`Numbers[3]`）；
   * `digest` 是元素太多、放弃展开时该数组共用的那一列，格子里只写本次写入的下标和值。
   */
  kind: "scalar" | "element" | "digest";
  /** 数组名或过程名，供表头分组显示；主程序标量没有。 */
  group?: string;
  /** 局部变量所属的追踪作用域，例如 `bubblesort#1`。主程序是 `main`。 */
  scope?: string;
  /** 过程/函数名，递归时带 `#2` 这样的层次后缀。 */
  scopeLabel?: string;
};

export type TracePlan = { columns: TraceColumn[] };

export type TraceWrite = {
  variableId: string;
  name: string;
  before: TraceValue;
  after: TraceValue;
  sameValue: boolean;
  cause: "assign" | "input" | "for-init" | "for-next" | "byref-write" | "file-read" | "record-read";
  /** BYREF 写入的来源：哪个过程、用的哪个形参名。 */
  origin?: { frameId: string; name: string; routine: string };
};

export type TraceDeclaration = {
  variableId: string;
  name: string;
  value: TraceValue;
};

export type TraceRow = {
  step: number;
  range: SourceRange;
  frameId: string;
  kind: "declare" | "write" | "condition" | "output" | "call" | "return" | "error";
  label: string;
  writes: TraceWrite[];
  declarations?: TraceDeclaration[];
  condition?: { structure: "IF" | "FOR" | "WHILE" | "REPEAT"; result: boolean };
  output?: string;
  call?: { name: string; kind: "procedure" | "function" };
  error?: RuntimeErrorInfo;
};

export type TraceFinish = {
  status: "completed" | "stopped" | "error";
  rows: number;
  semanticSteps: number;
  truncated: boolean;
  /** 因为超过列上限而没有建列的变量个数；大于 0 时前端必须说出来。 */
  columnsOmitted: number;
};

export type TraceColumnState = {
  variableId: string;
  declared: boolean;
  initialized: boolean;
};

export type TraceSink = {
  started(plan: TracePlan): void;
  /**
   * 运行途中新出现的列：数组在 `DECLARE` 时展开、局部变量在帧里声明时出现。
   * 表头要就地追加，已经画出的行补空白格——空白按 §3 的契约本来就是
   * 「尚未声明或不在作用域」，对那些行来说这是实话。
   */
  columns(added: TraceColumn[]): void;
  row(row: TraceRow): void;
  truncated(info: { head: number; tailCapacity: number }): void;
  tail(info: { rows: TraceRow[]; skipped: number; stateBefore: TraceColumnState[] }): void;
  finished(info: TraceFinish): void;
};

export type TraceOptions = {
  sink: TraceSink;
  maxRows?: number;
  /**
   * `main-scalars` 只追踪主程序的标量，是最早上线的那一档，保留它是为了不动既有调用方。
   * `full` 追加数组元素与过程/函数局部变量——没有这一档，像 BubbleSort 这种
   * 「值全在数组里、逻辑全在过程里」的程序会得到一张什么都没发生的表。
   */
  scope: "main-scalars" | "full";
  /** 列的总上限，默认 64。超过之后不再建列，并在 `TraceFinish.columnsOmitted` 里报数。 */
  maxColumns?: number;
  /** 单个数组展开成列的元素数上限，默认 32。超过就退成 `digest` 单列。 */
  maxArrayElements?: number;
};

export type ExecutionEventType =
  | "run-started"
  | "statement-entered"
  | "condition-checked"
  | "variable-declared"
  | "variable-changed"
  | "output-written"
  | "input-requested"
  | "input-rejected"
  | "input-accepted"
  | "frame-entered"
  | "frame-exited"
  | "file-opened"
  | "file-position-changed"
  | "file-written"
  | "file-closed"
  | "runtime-error"
  | "run-stopped"
  | "run-completed";

export type ExecutionEvent = {
  type: ExecutionEventType;
  runId: string;
  sequence: number;
  range: SourceRange;
  frameId: string;
  data: Record<string, unknown>;
};

export type ExecutionStatus = "completed" | "stopped" | "error" | "preflight-error";

export type ExecutionResult = {
  runId: string;
  status: ExecutionStatus;
  outputs: string[];
  variables: RuntimeVariable[];
  steps: number;
  activeTimeMs: number;
  error?: RuntimeErrorInfo;
  diagnostics?: Diagnostic[];
  virtualFiles: RuntimeVirtualFile[];
  fileChangesCommitted: boolean;
};

export type InputSubmission =
  | { accepted: true }
  | { accepted: false; messageKey: string; args?: Record<string, string | number> };

export type ExecutionOptions = {
  profile?: ExecutionProfile;
  maxSteps?: number;
  maxActiveTimeMs?: number;
  maxOutputLines?: number;
  maxOutputBytes?: number;
  maxArrayElements?: number;
  maxCallDepth?: number;
  maxFileBytes?: number;
  maxProjectFileBytes?: number;
  yieldEverySteps?: number;
  random?: () => number;
  now?: () => number;
  onEvent?: (event: ExecutionEvent) => void;
  trace?: TraceOptions;
  virtualFiles?: RuntimeVirtualFile[];
};

export type ExecutionController = {
  runId: string;
  result: Promise<ExecutionResult>;
  provideInput(value: string): InputSubmission;
  stop(): void;
  getVariables(): RuntimeVariable[];
};

export type PrimitiveRuntimeType = { kind: "primitive"; name: LiteralType };
export type ArrayRuntimeType = {
  kind: "array";
  dimensions: Array<{ lower: number; upper: number }>;
  elementType: RuntimeType;
};
export type RecordRuntimeType = {
  kind: "record";
  name: string;
  normalizedName: string;
  fields: Array<{ name: string; normalizedName: string; type: RuntimeType }>;
};
export type ClassRuntimeType = {
  kind: "class";
  name: string;
  normalizedName: string;
  base?: ClassRuntimeType;
  fields: Array<{ name: string; normalizedName: string; access: "PUBLIC" | "PRIVATE"; type: RuntimeType; owner: string }>;
};
export type PointerRuntimeType = { kind: "pointer"; target: RuntimeType };
export type SetRuntimeType = { kind: "set"; name: string; normalizedName: string; elementType: RuntimeType };
export type EnumRuntimeType = { kind: "enum"; name: string; normalizedName: string; members: string[] };
export type RuntimeType = PrimitiveRuntimeType | ArrayRuntimeType | RecordRuntimeType | ClassRuntimeType | PointerRuntimeType | SetRuntimeType | EnumRuntimeType;
