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
};

export type TracePlan = { columns: TraceColumn[] };

export type TraceWrite = {
  variableId: string;
  name: string;
  before: TraceValue;
  after: TraceValue;
  sameValue: boolean;
  cause: "assign" | "input" | "for-init" | "for-next" | "byref-write" | "file-read" | "record-read";
  origin?: { frameId: string; name: string };
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
};

export type TraceColumnState = {
  variableId: string;
  declared: boolean;
  initialized: boolean;
};

export type TraceSink = {
  started(plan: TracePlan): void;
  row(row: TraceRow): void;
  truncated(info: { head: number; tailCapacity: number }): void;
  tail(info: { rows: TraceRow[]; skipped: number; stateBefore: TraceColumnState[] }): void;
  finished(info: TraceFinish): void;
};

export type TraceOptions = {
  sink: TraceSink;
  maxRows?: number;
  scope: "main-scalars";
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
