import {
  analyzeSource,
  type ArrayTypeReference,
  type CaseLabel,
  type DateLiteralValue,
  type Diagnostic,
  type EnumTypeDeclaration,
  type Expression,
  type FunctionDeclaration,
  type LiteralType,
  type Program,
  type PointerTypeDeclaration,
  type ProcedureDeclaration,
  type RecordTypeDeclaration,
  type SetTypeDeclaration,
  type SourceRange,
  type Statement,
  type TextFileMode,
  type TypeReference
} from "@caie-pseudocode/language";
import type {
  ArrayRuntimeType,
  ClassRuntimeType,
  EnumRuntimeType,
  ExecutionController,
  ExecutionEvent,
  ExecutionEventType,
  ExecutionProfile,
  ExecutionOptions,
  ExecutionResult,
  ExecutionStatus,
  InputSubmission,
  PrimitiveRuntimeType,
  PointerRuntimeType,
  SetRuntimeType,
  RecordRuntimeType,
  RuntimeArraySnapshot,
  RuntimeDate,
  RuntimeErrorInfo,
  RuntimeFileHandle,
  RuntimeRecordSnapshot,
  RuntimeObjectSnapshot,
  RuntimePrimitive,
  RuntimeEnumSnapshot,
  RuntimeType,
  RuntimeValue,
  RuntimeVariable,
  RuntimeSetSnapshot,
  RuntimeVirtualFile,
  TraceDeclaration,
  TraceColumnState,
  TraceFinish,
  TraceOptions,
  TracePlan,
  TraceRow,
  TraceValue,
  TraceWrite
} from "./types.js";

type Cell = {
  name: string;
  normalizedName: string;
  kind: "variable" | "constant" | "loop-variable" | "field" | "element";
  type: RuntimeType;
  initialized: boolean;
  value?: InternalValue;
  alias?: Cell;
  traceId?: string;
};

type RuntimeArray = { kind: "array"; type: ArrayRuntimeType; elements: Map<string, Cell> };
type RuntimeRecord = { kind: "record"; type: RecordRuntimeType; fields: Map<string, Cell> };
type RuntimeObject = { kind: "object"; type: ClassRuntimeType; fields: Map<string, Cell> };
type RuntimePointer = { kind: "pointer"; type: PointerRuntimeType; target: Cell };
type RuntimeSet = { kind: "set"; type: SetRuntimeType; values: Map<string, InternalValue> };
type RuntimeEnum = { kind: "enum"; type: EnumRuntimeType; member: string };
type InternalValue = number | string | boolean | RuntimeDate | RuntimeArray | RuntimeRecord | RuntimeObject | RuntimePointer | RuntimeSet | RuntimeEnum;
type TypedValue = { type: RuntimeType; value: InternalValue };
type PendingInput = { cell: Cell; range: SourceRange; resolve: () => void; traceBefore?: TraceValue };
type Frame = { id: string; name: string; cells: Map<string, Cell>; returnType?: RuntimeType; receiver?: RuntimeObject; classType?: ClassRuntimeType };
type OpenHandle = { file: RuntimeVirtualFile; mode: TextFileMode; position: number };

const DEFAULTS = {
  profile: "core-2027" as ExecutionProfile,
  maxSteps: 100_000,
  maxActiveTimeMs: 5_000,
  maxOutputLines: 10_000,
  maxOutputBytes: 1024 * 1024,
  maxArrayElements: 100_000,
  maxCallDepth: 256,
  maxFileBytes: 5 * 1024 * 1024,
  maxProjectFileBytes: 25 * 1024 * 1024,
  yieldEverySteps: 128
};

const encoder = new TextEncoder();

/**
 * Delivers a bounded, chronological trace without retaining a full run in
 * memory. The first rows explain setup; the ring buffer preserves the point
 * where a long or runaway run ends.
 */
class TraceCollector {
  private readonly headCapacity: number;
  private readonly tailCapacity: number;
  private readonly tailRows: TraceRow[] = [];
  private state = new Map<string, TraceColumnState>();
  private tailState?: Map<string, TraceColumnState>;
  private semanticSteps = 0;
  private deliveredRows = 0;
  private didTruncate = false;
  private didFinish = false;

  constructor(private readonly options: TraceOptions, private readonly plan: TracePlan) {
    const limit = positiveInteger(options.maxRows, 2_000);
    this.tailCapacity = Math.min(500, Math.max(1, Math.floor(limit / 4)));
    this.headCapacity = Math.max(0, limit - this.tailCapacity);
  }

  start(): void { this.options.sink.started(this.plan); }

  record(row: Omit<TraceRow, "step">): void {
    const complete = { ...row, step: ++this.semanticSteps };
    if (this.semanticSteps <= this.headCapacity) {
      this.options.sink.row(complete);
      this.deliveredRows += 1;
      this.applyState(this.state, complete);
      return;
    }
    if (!this.didTruncate) {
      this.didTruncate = true;
      this.tailState = cloneTraceState(this.state);
      this.options.sink.truncated({ head: this.headCapacity, tailCapacity: this.tailCapacity });
    }
    if (this.tailRows.length === this.tailCapacity) this.applyState(this.tailState!, this.tailRows.shift()!);
    this.tailRows.push(complete);
    if (this.tailRows.length > this.tailCapacity) this.tailRows.shift();
  }

  finish(status: TraceFinish["status"]): void {
    if (this.didFinish) return;
    this.didFinish = true;
    if (this.didTruncate) {
      const skipped = Math.max(0, this.semanticSteps - this.headCapacity - this.tailRows.length);
      this.options.sink.tail({ rows: this.tailRows, skipped, stateBefore: [...this.tailState!.values()] });
    }
    this.options.sink.finished({
      status,
      rows: this.deliveredRows + this.tailRows.length,
      semanticSteps: this.semanticSteps,
      truncated: this.didTruncate
    });
  }

  private applyState(state: Map<string, TraceColumnState>, row: TraceRow): void {
    for (const declaration of row.declarations ?? []) {
      state.set(declaration.variableId, { variableId: declaration.variableId, declared: true, initialized: declaration.value.initialized });
    }
    for (const write of row.writes) {
      state.set(write.variableId, { variableId: write.variableId, declared: true, initialized: write.after.initialized });
    }
  }
}

class RuntimeFault extends Error {
  constructor(readonly info: RuntimeErrorInfo) {
    super(info.messageKey);
    this.name = "RuntimeFault";
  }
}

class Stopped extends Error {}
class Returned extends Error { constructor(readonly value: TypedValue) { super("return"); } }

export class Interpreter {
  readonly runId: string;
  readonly result: Promise<ExecutionResult>;
  private readonly cells = new Map<string, Cell>();
  private readonly frames: Frame[] = [];
  private readonly procedures = new Map<string, ProcedureDeclaration>();
  private readonly functions = new Map<string, FunctionDeclaration>();
  private readonly records = new Map<string, RecordTypeDeclaration>();
  private readonly classes = new Map<string, Extract<Statement, { kind: "ClassDeclaration" }>>();
  private readonly pointers = new Map<string, PointerTypeDeclaration>();
  private readonly resolvedPointers = new Map<string, PointerRuntimeType>();
  private readonly sets = new Map<string, SetTypeDeclaration>();
  private readonly resolvedSets = new Map<string, SetRuntimeType>();
  private readonly enums = new Map<string, EnumTypeDeclaration>();
  private readonly resolvedEnums = new Map<string, EnumRuntimeType>();
  private readonly enumCells = new Map<string, Cell>();
  private readonly resolvedClasses = new Map<string, ClassRuntimeType>();
  private readonly resolvedRecords = new Map<string, RecordRuntimeType>();
  private readonly resolvingRecords = new Set<string>();
  private readonly loopControls = new Map<string, number>();
  private readonly outputs: string[] = [];
  private readonly options: Required<Omit<ExecutionOptions, "onEvent" | "trace" | "virtualFiles">> & Pick<ExecutionOptions, "onEvent" | "trace">;
  private readonly trace?: TraceCollector;
  private readonly initialFiles: RuntimeVirtualFile[];
  private readonly workingFiles: RuntimeVirtualFile[];
  private readonly handles = new Map<string, OpenHandle>();
  private filesChanged = false;
  private sequence = 0;
  private steps = 0;
  private outputBytes = 0;
  private stopped = false;
  private pendingInput?: PendingInput;
  private activeStartedAt?: number;
  private accumulatedActiveMs = 0;

  constructor(private readonly program: Program, options: ExecutionOptions = {}, private readonly diagnostics?: Diagnostic[]) {
    this.runId = makeRunId();
    this.options = {
      profile: options.profile ?? DEFAULTS.profile,
      maxSteps: positiveInteger(options.maxSteps, DEFAULTS.maxSteps),
      maxActiveTimeMs: positiveNumber(options.maxActiveTimeMs, DEFAULTS.maxActiveTimeMs),
      maxOutputLines: positiveInteger(options.maxOutputLines, DEFAULTS.maxOutputLines),
      maxOutputBytes: positiveInteger(options.maxOutputBytes, DEFAULTS.maxOutputBytes),
      maxArrayElements: positiveInteger(options.maxArrayElements, DEFAULTS.maxArrayElements),
      maxCallDepth: positiveInteger(options.maxCallDepth, DEFAULTS.maxCallDepth),
      maxFileBytes: positiveInteger(options.maxFileBytes, DEFAULTS.maxFileBytes),
      maxProjectFileBytes: positiveInteger(options.maxProjectFileBytes, DEFAULTS.maxProjectFileBytes),
      yieldEverySteps: positiveInteger(options.yieldEverySteps, DEFAULTS.yieldEverySteps),
      random: options.random ?? Math.random,
      now: options.now ?? (() => performance.now()),
      onEvent: options.onEvent,
      trace: options.trace
    };
    this.initialFiles = cloneFiles(options.virtualFiles ?? []);
    this.workingFiles = cloneFiles(options.virtualFiles ?? []);
    for (const statement of program.body) {
      if (statement.kind === "RecordTypeDeclaration") this.records.set(statement.normalizedName, statement);
      if (statement.kind === "ProcedureDeclaration") this.procedures.set(statement.normalizedName, statement);
      if (statement.kind === "FunctionDeclaration") this.functions.set(statement.normalizedName, statement);
      if (statement.kind === "ClassDeclaration") this.classes.set(statement.normalizedName, statement);
      if (statement.kind === "PointerTypeDeclaration") this.pointers.set(statement.normalizedName, statement);
      if (statement.kind === "SetTypeDeclaration") this.sets.set(statement.normalizedName, statement);
      if (statement.kind === "EnumTypeDeclaration") this.enums.set(statement.normalizedName, statement);
    }
    for (const declaration of this.enums.values()) {
      const type: EnumRuntimeType = { kind: "enum", name: declaration.name, normalizedName: declaration.normalizedName, members: declaration.members.map(({ name }) => name) };
      this.resolvedEnums.set(declaration.normalizedName, type);
      for (const member of declaration.members) {
        this.enumCells.set(member.normalizedName, {
          name: member.name, normalizedName: member.normalizedName, kind: "constant", type, initialized: true,
          value: { kind: "enum", type, member: member.name }
        });
      }
    }
    this.frames.push({ id: "main", name: "<main>", cells: this.cells });
    if (options.trace) this.trace = new TraceCollector(options.trace, buildTracePlan(program));
    this.activeStartedAt = this.options.now();
    this.result = Promise.resolve().then(() => this.run());
  }

  provideInput(raw: string): InputSubmission {
    const pending = this.pendingInput;
    if (!pending || this.stopped) return { accepted: false, messageKey: "runtime.input.notWaiting" };
    const storage = storageCell(pending.cell);
    if (storage.type.kind !== "primitive") return { accepted: false, messageKey: "runtime.input.requiresPrimitive" };
    const parsed = parseInput(raw, storage.type.name);
    if ("messageKey" in parsed) {
      const rejected: InputSubmission = { accepted: false, messageKey: parsed.messageKey, ...(parsed.args ? { args: parsed.args } : {}) };
      this.emit("input-rejected", pending.range, { variable: pending.cell.name, type: typeName(storage.type), ...rejected });
      return rejected;
    }
    this.resumeActiveClock();
    storage.value = cloneValue(parsed.value);
    storage.initialized = true;
    this.pendingInput = undefined;
    this.emit("input-accepted", pending.range, { variable: pending.cell.name, type: typeName(storage.type) });
    this.emitVariable("variable-changed", pending.range, pending.cell);
    this.traceWrite(pending.range, pending.cell, pending.traceBefore, "input", `INPUT ${pending.cell.name}`);
    pending.resolve();
    return { accepted: true };
  }

  stop(): void {
    if (this.stopped) return;
    this.stopped = true;
    if (this.pendingInput) {
      this.resumeActiveClock();
      const { resolve } = this.pendingInput;
      this.pendingInput = undefined;
      resolve();
    }
  }

  getVariables(): RuntimeVariable[] {
    const current = this.frames[this.frames.length - 1];
    const cells = current && current.id !== "main" ? [...this.cells.values(), ...current.cells.values()] : [...this.cells.values()];
    return cells.map(snapshotCell);
  }

  private async run(): Promise<ExecutionResult> {
    this.emit("run-started", this.program.range, {});
    this.trace?.start();
    if (this.diagnostics?.some(({ severity }) => severity === "error")) {
      const count = this.diagnostics.filter(({ severity }) => severity === "error").length;
      const error = faultInfo("RT1000", "runtime.preflightFailed", this.program.range, { count });
      this.emit("runtime-error", error.range, { error });
      this.traceError(error);
      this.trace?.finish("error");
      return this.finish("preflight-error", error);
    }
    const unsupported = findUnsupportedFeature(this.program, this.options.profile);
    if (unsupported) {
      const error = faultInfo("RT1106", "runtime.feature.notSupported", unsupported.range, {
        feature: unsupported.feature,
        profile: this.options.profile
      });
      this.emit("runtime-error", error.range, { error });
      this.traceError(error);
      this.trace?.finish("error");
      return this.finish("preflight-error", error);
    }
    try {
      await this.executeBlock(this.program.body);
      this.checkStopped();
      this.ensureProjectFileLimit(this.program.range);
      this.closeAllHandles(true);
      this.pauseActiveClock();
      this.emit("run-completed", this.program.range, { steps: this.steps, activeTimeMs: this.activeTime(), virtualFiles: cloneFiles(this.workingFiles) });
      this.trace?.finish("completed");
      return this.finish("completed");
    } catch (error) {
      this.closeAllHandles(true);
      this.pauseActiveClock();
      if (error instanceof Stopped) {
        this.emit("run-stopped", this.program.range, { steps: this.steps, activeTimeMs: this.activeTime() });
        this.trace?.finish("stopped");
        return this.finish("stopped");
      }
      const fault = error instanceof RuntimeFault ? error.info : faultInfo("RT1999", "runtime.internalError", this.program.range);
      this.emit("runtime-error", fault.range, { error: fault });
      this.traceError(fault);
      this.trace?.finish("error");
      return this.finish("error", fault);
    }
  }

  private async executeBlock(statements: Statement[]): Promise<void> {
    for (const statement of statements) await this.executeStatement(statement);
  }

  private async executeStatement(statement: Statement): Promise<void> {
    await this.tick(statement.range, "statement-entered", { statement: statement.kind });
    switch (statement.kind) {
      case "DeclareStatement": {
        const type = await this.resolveType(statement.typeReference);
        const composite = instantiateComposite(type);
        const cell: Cell = {
          name: statement.name,
          normalizedName: statement.normalizedName,
          kind: "variable",
          type,
          initialized: composite !== undefined,
          ...(composite !== undefined ? { value: composite } : {})
        };
        this.attachMainTraceId(cell);
        this.currentFrame().cells.set(cell.normalizedName, cell);
        this.emitVariable("variable-declared", statement.range, cell);
        this.traceDeclaration(statement.range, cell);
        return;
      }
      case "ConstantStatement": {
        const value = await this.evaluate(statement.value);
        const cell: Cell = {
          name: statement.name,
          normalizedName: statement.normalizedName,
          kind: "constant",
          type: value.type,
          initialized: true,
          value: cloneValue(value.value)
        };
        this.attachMainTraceId(cell);
        this.currentFrame().cells.set(cell.normalizedName, cell);
        this.emitVariable("variable-declared", statement.range, cell);
        this.traceDeclaration(statement.range, cell);
        return;
      }
      case "DefineSetStatement": {
        const type = await this.resolveType(statement.typeReference);
        if (type.kind !== "set") this.fail("RT1310", "runtime.set.requiresSetType", statement.typeReference.range);
        const set: RuntimeSet = { kind: "set", type, values: new Map() };
        for (const expression of statement.values) {
          const value = await this.evaluate(expression);
          if (!typesCompatible(type.elementType, value.type)) this.fail("RT1311", "runtime.set.elementTypeMismatch", expression.range);
          set.values.set(valueKey(value.value), cloneValue(value.value));
        }
        const cell: Cell = { name: statement.name, normalizedName: statement.normalizedName, kind: "constant", type, initialized: true, value: set };
        this.currentFrame().cells.set(cell.normalizedName, cell);
        this.emitVariable("variable-declared", statement.range, cell);
        return;
      }
      case "AssignmentStatement": {
        const cell = await this.resolveLocation(statement.target, true);
        const value = await this.evaluate(statement.value);
        const before = this.traceValueFor(cell);
        this.assign(cell, value, statement.range);
        this.emitVariable("variable-changed", statement.range, cell);
        this.traceWrite(statement.range, cell, before, "assign", `${cell.name} ←`);
        return;
      }
      case "InputStatement": {
        const cell = await this.resolveLocation(statement.target, true);
        if (cell.type.kind !== "primitive") this.fail("RT1105", "runtime.input.requiresPrimitive", statement.target.range);
        this.pauseActiveClock();
        await new Promise<void>((resolve) => {
          this.pendingInput = { cell, range: statement.range, resolve, traceBefore: this.traceValueFor(cell) };
          this.emit("input-requested", statement.range, { variable: cell.name, type: typeName(cell.type) });
        });
        this.checkStopped();
        return;
      }
      case "OutputStatement": {
        const parts: string[] = [];
        for (const value of statement.values) parts.push(formatValue(await this.evaluate(value), value.range));
        const line = parts.join("");
        this.writeOutput(line, statement.range);
        this.traceOutput(statement.range, line);
        return;
      }
      case "OpenFileStatement": {
        const name = asString(await this.evaluate(statement.file), statement.file.range);
        this.openFile(name, statement.mode, statement.range);
        return;
      }
      case "ReadFileStatement": {
        const name = asString(await this.evaluate(statement.file), statement.file.range);
        const handle = this.requireHandle(name, ["READ"], statement.range);
        const target = await this.resolveLocation(statement.target, true);
        if (!isPrimitive(target.type, "STRING")) this.fail("RT2001", "runtime.file.readTargetRequiresString", statement.target.range);
        const lines = handle.file.lines ?? [];
        if (handle.position > lines.length) this.fail("RT2002", "runtime.file.readPastEnd", statement.range, { file: handle.file.name });
        this.assign(target, typed("STRING", lines[handle.position - 1] ?? ""), statement.range);
        handle.position += 1;
        this.emitVariable("variable-changed", statement.range, target);
        this.emitFile("file-position-changed", statement.range, handle, {});
        return;
      }
      case "WriteFileStatement": {
        const name = asString(await this.evaluate(statement.file), statement.file.range);
        const handle = this.requireHandle(name, ["WRITE", "APPEND"], statement.range);
        const data = await this.evaluate(statement.data);
        const line = formatValue(data, statement.data.range);
        const lines = handle.file.lines ?? (handle.file.lines = []);
        if (handle.position !== lines.length + 1) this.fail("RT2003", "runtime.file.invalidTextPosition", statement.range);
        lines.push(line);
        handle.position += 1;
        this.filesChanged = true;
        this.ensureFileLimit(handle.file, statement.range);
        this.emitFile("file-written", statement.range, handle, { text: line });
        return;
      }
      case "CloseFileStatement": {
        const name = asString(await this.evaluate(statement.file), statement.file.range);
        this.closeFile(name, statement.range, false);
        return;
      }
      case "SeekStatement": {
        const name = asString(await this.evaluate(statement.file), statement.file.range);
        const handle = this.requireHandle(name, ["RANDOM"], statement.range);
        const address = asInteger(await this.evaluate(statement.address), statement.address.range);
        if (address < 1) this.fail("RT2101", "runtime.random.addressMustBePositive", statement.address.range, { address });
        handle.position = address;
        this.emitFile("file-position-changed", statement.range, handle, {});
        return;
      }
      case "GetRecordStatement": {
        const name = asString(await this.evaluate(statement.file), statement.file.range);
        const handle = this.requireHandle(name, ["RANDOM"], statement.range);
        const target = await this.resolveLocation(statement.target, true);
        if (target.type.kind !== "record") this.fail("RT2102", "runtime.random.targetRequiresRecord", statement.target.range);
        const records = handle.file.records ?? [];
        const record = records[handle.position - 1];
        if (!record) this.fail("RT2103", "runtime.random.missingRecord", statement.range, { file: handle.file.name, position: handle.position });
        if (handle.file.recordType && normalizeName(handle.file.recordType) !== target.type.normalizedName) {
          this.fail("RT2104", "runtime.random.recordTypeMismatch", statement.target.range, { expected: handle.file.recordType, actual: target.type.name });
        }
        const value = this.plainToRecord(record, target.type, statement.range);
        this.assign(target, { type: target.type, value }, statement.range);
        this.emitVariable("variable-changed", statement.range, target);
        return;
      }
      case "PutRecordStatement": {
        const name = asString(await this.evaluate(statement.file), statement.file.range);
        const handle = this.requireHandle(name, ["RANDOM"], statement.range);
        const data = await this.evaluate(statement.data);
        if (data.type.kind !== "record" || !isRuntimeRecord(data.value)) this.fail("RT2105", "runtime.random.dataRequiresRecord", statement.data.range);
        if (handle.file.recordType && normalizeName(handle.file.recordType) !== data.type.normalizedName) {
          this.fail("RT2104", "runtime.random.recordTypeMismatch", statement.data.range, { expected: handle.file.recordType, actual: data.type.name });
        }
        const records = handle.file.records ?? (handle.file.records = []);
        if (handle.position > records.length + 1) this.fail("RT2106", "runtime.random.cannotCreateHole", statement.range, { position: handle.position });
        const plain = this.recordToPlain(data.value, statement.data.range);
        if (!handle.file.recordType) handle.file.recordType = data.type.name;
        if (handle.position === records.length + 1) records.push(plain);
        else records[handle.position - 1] = plain;
        this.filesChanged = true;
        this.ensureFileLimit(handle.file, statement.range);
        this.emitFile("file-written", statement.range, handle, { record: plain });
        return;
      }
      case "IfStatement": {
        await this.tick(statement.condition.range, "condition-checked", { structure: "IF" });
        const condition = await this.evaluate(statement.condition);
        const result = asBoolean(condition, statement.condition.range);
        this.traceCondition(statement.condition.range, "IF", result);
        await this.executeBlock(result ? statement.thenBranch : statement.elseBranch);
        return;
      }
      case "CaseStatement": {
        const selector = await this.evaluate(statement.selector);
        for (const clause of statement.clauses) {
          let matches = clause.isOtherwise;
          for (const label of clause.labels) matches ||= await this.matchesCaseLabel(selector, label);
          if (matches) {
            await this.executeBlock(clause.body);
            break;
          }
        }
        return;
      }
      case "ForStatement": {
        const start = asInteger(await this.evaluate(statement.startValue), statement.startValue.range);
        const end = asInteger(await this.evaluate(statement.endValue), statement.endValue.range);
        const step = statement.step ? asInteger(await this.evaluate(statement.step), statement.step.range) : 1;
        if (step === 0) this.fail("RT1501", "runtime.for.zeroStep", statement.step?.range ?? statement.range);
        let control = this.lookupCell(statement.control.normalizedName);
        let implicitControl = false;
        if (!control) {
          implicitControl = true;
          control = {
            name: statement.control.name,
            normalizedName: statement.control.normalizedName,
            kind: "loop-variable",
            type: primitive("INTEGER"),
            initialized: false
          };
          this.attachMainTraceId(control);
          this.currentFrame().cells.set(control.normalizedName, control);
          this.emitVariable("variable-declared", statement.control.range, control);
        }
        if (control.type.kind !== "primitive" || control.type.name !== "INTEGER") {
          this.fail("RT1502", "runtime.for.controlRequiresInteger", statement.control.range);
        }
        const controlStorage = storageCell(control);
        if (controlStorage.kind === "constant") this.fail("RT1005", "runtime.constant.cannotChange", statement.control.range, { name: control.name });
        let candidate = start;
        const initialBefore = implicitControl ? uninitializedTraceValue() : this.traceValueFor(control);
        controlStorage.value = start;
        controlStorage.initialized = true;
        this.emitVariable("variable-changed", statement.range, control);
        this.traceWrite(statement.range, control, initialBefore, "for-init", `FOR ${control.name} ← ${start}`);
        this.lockLoopControl(controlStorage.normalizedName);
        try {
          let iteration = 0;
          while (true) {
            await this.tick(statement.range, "condition-checked", { structure: "FOR", value: candidate });
            const passes = step > 0 ? candidate <= end : candidate >= end;
            this.traceCondition(statement.range, "FOR", passes);
            if (!passes) break;
            if (iteration > 0) {
              const before = this.traceValueFor(control);
              controlStorage.value = candidate;
              this.emitVariable("variable-changed", statement.range, control);
              this.traceWrite(statement.range, control, before, "for-next", `${control.name} ← ${candidate}`);
            }
            await this.executeBlock(statement.body);
            candidate = checkedInteger(candidate + step, statement.range);
            iteration += 1;
          }
        } finally {
          this.unlockLoopControl(controlStorage.normalizedName);
        }
        return;
      }
      case "WhileStatement": {
        while (true) {
          await this.tick(statement.condition.range, "condition-checked", { structure: "WHILE" });
          const result = asBoolean(await this.evaluate(statement.condition), statement.condition.range);
          this.traceCondition(statement.condition.range, "WHILE", result);
          if (!result) break;
          await this.executeBlock(statement.body);
        }
        return;
      }
      case "RepeatStatement": {
        do {
          await this.executeBlock(statement.body);
          await this.tick(statement.condition.range, "condition-checked", { structure: "REPEAT" });
          const result = asBoolean(await this.evaluate(statement.condition), statement.condition.range);
          this.traceCondition(statement.condition.range, "REPEAT", result);
          if (result) break;
        } while (true);
        return;
      }
      case "RecordTypeDeclaration":
      case "EnumTypeDeclaration":
      case "PointerTypeDeclaration":
      case "SetTypeDeclaration":
      case "ProcedureDeclaration":
      case "FunctionDeclaration":
      case "ClassDeclaration":
        return;
      case "CallStatement":
        await this.callProcedure(statement.target.normalizedName, statement.arguments, statement.range);
        return;
      case "MethodCallStatement":
        await this.callMethod(statement.call.callee as Extract<Expression, { kind: "MemberExpression" }>, statement.call.arguments, statement.range);
        return;
      case "ReturnStatement": {
        const frame = this.currentFrame();
        if (!frame.returnType) this.fail("RT1901", "runtime.return.outsideFunction", statement.range);
        const value = await this.evaluate(statement.value);
        if (!typesCompatible(frame.returnType, value.type)) {
          this.fail("RT1902", "runtime.return.typeMismatch", statement.value.range, { expected: typeName(frame.returnType), actual: typeName(value.type) });
        }
        throw new Returned({ type: frame.returnType, value: cloneValue(value.value) });
      }
      default:
        this.fail("RT1100", "runtime.statement.notSupportedInCurrentStage", statement.range, { statement: statement.kind });
    }
  }

  private async evaluate(expression: Expression): Promise<TypedValue> {
    this.checkLimits(expression.range);
    switch (expression.kind) {
      case "LiteralExpression": return { type: primitive(expression.literalType), value: cloneValue(expression.value) };
      case "NameExpression": return this.readCell(await this.resolveLocation(expression, false), expression.range);
      case "IndexExpression": return this.readCell(await this.resolveLocation(expression, false), expression.range);
      case "MemberExpression": return this.readCell(await this.resolveLocation(expression, false), expression.range);
      case "UnaryExpression": {
        if (expression.operator === "^" && expression.postfix) {
          const pointer = await this.evaluate(expression.operand);
          if (!isPointerValue(pointer.value)) this.fail("RT1309", "runtime.pointer.requiresPointer", expression.range);
          return this.readCell(pointer.value.target, expression.range);
        }
        if (expression.operator === "^") {
          const target = await this.resolveLocation(expression.operand, false);
          return { type: { kind: "pointer", target: target.type }, value: { kind: "pointer", type: { kind: "pointer", target: target.type }, target: storageCell(target) } };
        }
        const operand = await this.evaluate(expression.operand);
        if (expression.operator === "NOT") return { type: primitive("BOOLEAN"), value: !asBoolean(operand, expression.range) };
        return checkedNumber(-asNumber(operand, expression.range), operand.type, expression.range);
      }
      case "BinaryExpression": return this.evaluateBinary(expression);
      case "CallExpression": {
        if (expression.callee.kind === "MemberExpression") {
          const value = await this.callMethod(expression.callee, expression.arguments, expression.range);
          if (!value) this.fail("RT4020", "runtime.function.cannotBeExpression", expression.range);
          return value;
        }
        if (expression.callee.kind === "NameExpression" && this.functions.has(expression.callee.normalizedName)) {
          return this.callFunction(expression.callee.normalizedName, expression.arguments, expression.range);
        }
        const frame = this.currentFrame();
        if (expression.callee.kind === "NameExpression" && frame.receiver && frame.classType) {
          const method = this.findMethod(frame.classType, expression.callee.normalizedName);
          if (method) {
            const value = await this.invokeRoutine(method.declaration, expression.arguments, frame.receiver, method.owner);
            if (method.declaration.kind === "ProcedureDeclaration") this.fail("RT4020", "runtime.function.cannotBeExpression", expression.range);
            if (!value) this.fail("RT1905", "runtime.function.missingReturn", method.declaration.range, { name: method.declaration.name });
            return value;
          }
        }
        return this.evaluateBuiltin(expression);
      }
      case "NewExpression": return this.newObject(expression);
      case "ErrorExpression": this.fail("RT1004", "runtime.expression.invalid", expression.range);
      default: this.fail("RT1102", "runtime.expression.notSupportedInCurrentStage", (expression as Expression).range);
    }
  }

  private async evaluateBinary(expression: Extract<Expression, { kind: "BinaryExpression" }>): Promise<TypedValue> {
    const left = await this.evaluate(expression.left);
    if (expression.operator === "AND" && !asBoolean(left, expression.left.range)) return typed("BOOLEAN", false);
    if (expression.operator === "OR" && asBoolean(left, expression.left.range)) return typed("BOOLEAN", true);
    const right = await this.evaluate(expression.right);
    if (left.type.kind === "enum" && isPrimitive(right.type, "INTEGER")
      && (expression.operator === "+" || expression.operator === "-")) {
      const index = left.type.members.indexOf((left.value as RuntimeEnum).member);
      const offset = right.value as number;
      const nextIndex = index + (expression.operator === "+" ? offset : -offset);
      const member = left.type.members[nextIndex];
      if (index < 0 || !member) this.fail("RT1312", "runtime.enum.ordinalOutOfRange", expression.range);
      return { type: left.type, value: { kind: "enum", type: left.type, member } };
    }
    switch (expression.operator) {
      case "AND": return typed("BOOLEAN", asBoolean(right, expression.right.range));
      case "OR": return typed("BOOLEAN", asBoolean(right, expression.right.range));
      case "&": return typed("STRING", asString(left, expression.left.range) + asString(right, expression.right.range));
      case "+": return numericBinary(left, right, expression.range, (a, b) => a + b);
      case "-": return numericBinary(left, right, expression.range, (a, b) => a - b);
      case "*": return numericBinary(left, right, expression.range, (a, b) => a * b);
      case "/": {
        const divisor = asNumber(right, expression.right.range);
        if (divisor === 0) this.fail("RT1301", "runtime.math.divisionByZero", expression.right.range);
        return checkedNumber(asNumber(left, expression.left.range) / divisor, primitive("REAL"), expression.range);
      }
      case "DIV":
      case "MOD": {
        const a = asInteger(left, expression.left.range);
        const b = asInteger(right, expression.right.range);
        if (b === 0) this.fail("RT1301", "runtime.math.divisionByZero", expression.right.range);
        const quotient = Math.trunc(a / b);
        return typed("INTEGER", checkedInteger(expression.operator === "DIV" ? quotient : a - quotient * b, expression.range));
      }
      case "=": return typed("BOOLEAN", compareValues(left, right, expression.range) === 0);
      case "<>": return typed("BOOLEAN", compareValues(left, right, expression.range) !== 0);
      case ">": return typed("BOOLEAN", this.compareOrdered(left, right, expression.range) > 0);
      case "<": return typed("BOOLEAN", this.compareOrdered(left, right, expression.range) < 0);
      case ">=": return typed("BOOLEAN", this.compareOrdered(left, right, expression.range) >= 0);
      case "<=": return typed("BOOLEAN", this.compareOrdered(left, right, expression.range) <= 0);
    }
  }

  private compareOrdered(left: TypedValue, right: TypedValue, range: SourceRange): number {
    if (isEnumValue(left.value) || isEnumValue(right.value)) this.fail("RT1308", "runtime.comparison.incompatible", range);
    return compareValues(left, right, range);
  }

  private async evaluateBuiltin(expression: Extract<Expression, { kind: "CallExpression" }>): Promise<TypedValue> {
    if (expression.callee.kind !== "NameExpression") this.fail("RT1102", "runtime.expression.notSupportedInCurrentStage", expression.range);
    const args: TypedValue[] = [];
    for (const argument of expression.arguments) args.push(await this.evaluate(argument));
    switch (expression.callee.normalizedName) {
      case "LENGTH": return typed("INTEGER", [...asString(args[0], expression.range)].length);
      case "RIGHT": {
        const chars = [...asString(args[0], expression.range)];
        const length = asInteger(args[1], expression.range);
        if (length < 0 || length > chars.length) this.fail("RT1401", "runtime.string.lengthOutOfBounds", expression.range, { length });
        return typed("STRING", chars.slice(chars.length - length).join(""));
      }
      case "MID": {
        const chars = [...asString(args[0], expression.range)];
        const start = asInteger(args[1], expression.range);
        const length = asInteger(args[2], expression.range);
        if (start < 1 || length < 0 || start - 1 + length > chars.length) {
          this.fail("RT1402", "runtime.string.midOutOfBounds", expression.range, { start, length });
        }
        return typed("STRING", chars.slice(start - 1, start - 1 + length).join(""));
      }
      case "LCASE": return typed("CHAR", transformedChar(asChar(args[0], expression.range), false, expression.range));
      case "UCASE": return typed("CHAR", transformedChar(asChar(args[0], expression.range), true, expression.range));
      case "INT": return typed("INTEGER", checkedInteger(Math.trunc(asNumber(args[0], expression.range)), expression.range));
      case "RAND": {
        const limit = asInteger(args[0], expression.range);
        if (limit <= 0) this.fail("RT1403", "runtime.rand.requiresPositiveInteger", expression.range, { value: limit });
        const random = this.options.random();
        if (!Number.isFinite(random) || random < 0 || random >= 1) this.fail("RT1999", "runtime.random.invalidSource", expression.range);
        return typed("REAL", random * limit);
      }
      case "EOF": {
        const name = asString(args[0], expression.range);
        const handle = this.requireHandle(name, ["READ"], expression.range);
        return typed("BOOLEAN", handle.position > (handle.file.lines ?? []).length);
      }
      default: this.fail("RT1103", "runtime.call.notSupportedInCurrentStage", expression.range, { name: expression.callee.name });
    }
  }

  private async resolveLocation(expression: Expression, writable: boolean): Promise<Cell> {
    if (expression.kind === "UnaryExpression" && expression.operator === "^" && expression.postfix) {
      const pointer = await this.evaluate(expression.operand);
      if (!isPointerValue(pointer.value)) this.fail("RT1309", "runtime.pointer.requiresPointer", expression.range);
      const target = storageCell(pointer.value.target);
      if (writable && target.kind === "constant") this.fail("RT1005", "runtime.constant.cannotChange", expression.range, { name: target.name });
      return target;
    }
    if (expression.kind === "NameExpression") {
      const cell = this.lookupCell(expression.normalizedName);
      if (!cell) this.fail("RT1002", "runtime.name.notDeclared", expression.range, { name: expression.name });
      const storage = storageCell(cell);
      if (writable && storage.kind === "constant") this.fail("RT1005", "runtime.constant.cannotChange", expression.range, { name: cell.name });
      if (writable && (this.loopControls.get(storage.normalizedName) ?? 0) > 0) this.fail("RT1503", "runtime.for.controlCannotChange", expression.range, { name: cell.name });
      return cell;
    }
    if (expression.kind === "IndexExpression") {
      const target = await this.referenceValue(expression.target);
      if (target.type.kind !== "array" || target.value.kind !== "array") {
        this.fail("RT1601", "runtime.index.targetRequiresArray", expression.target.range);
      }
      const arrayType = target.type as ArrayRuntimeType;
      const arrayValue = target.value as RuntimeArray;
      const indices: number[] = [];
      for (const index of expression.indices) indices.push(asInteger(await this.evaluate(index), index.range));
      if (indices.length !== arrayType.dimensions.length) {
        this.fail("RT1602", "runtime.index.dimensionMismatch", expression.range, { expected: arrayType.dimensions.length, actual: indices.length });
      }
      indices.forEach((index, position) => {
        const bounds = arrayType.dimensions[position];
        if (!bounds || index < bounds.lower || index > bounds.upper) {
          this.fail("RT1603", "runtime.index.outOfBounds", expression.indices[position]?.range ?? expression.range, {
            value: index,
            lower: bounds?.lower ?? 0,
            upper: bounds?.upper ?? 0
          });
        }
      });
      const key = indices.join(",");
      let cell = arrayValue.elements.get(key);
      if (!cell) {
        // 元素本身是记录或数组时，要像 `DECLARE` 一样先把空壳建出来——
        // 否则 `Roster[1].Name ← ...` 会因为「Roster[1] 还没有值」停下来，
        // 而学生并没有漏写任何一步：记录数组的格子天生就该是一条空记录。
        const composite = instantiateComposite(arrayType.elementType);
        cell = {
          name: `${locationName(expression.target)}[${indices.join(", ")}]`,
          normalizedName: key,
          kind: "element",
          type: arrayType.elementType,
          initialized: composite !== undefined,
          ...(composite !== undefined ? { value: composite } : {})
        };
        arrayValue.elements.set(key, cell);
      }
      return cell;
    }
    if (expression.kind === "MemberExpression") {
      const target = await this.referenceValue(expression.target);
      if (target.type.kind === "record" && target.value.kind === "record") {
        const cell = target.value.fields.get(expression.normalizedMember);
        if (!cell) this.fail("RT1702", "runtime.member.unknownField", expression.memberRange, { field: expression.member, record: target.type.name });
        return cell;
      }
      if (target.type.kind === "class" && target.value.kind === "object") {
        const field = target.type.fields.find(({ normalizedName }) => normalizedName === expression.normalizedMember);
        if (!field) this.fail("RT1702", "runtime.member.unknownField", expression.memberRange, { field: expression.member, record: target.type.name });
        if (field.access === "PRIVATE" && this.currentFrame().classType?.normalizedName !== field.owner) {
          this.fail("RT1706", "runtime.class.privateMember", expression.memberRange, { member: expression.member });
        }
        return target.value.fields.get(field.normalizedName)!;
      }
      this.fail("RT1701", "runtime.member.targetRequiresRecord", expression.target.range);
    }
    this.fail("RT1104", "runtime.target.notSupportedInCurrentStage", expression.range);
  }

  private async referenceValue(expression: Expression): Promise<TypedValue & { value: RuntimeArray | RuntimeRecord | RuntimeObject }> {
    const cell = await this.resolveLocation(expression, false);
    const storage = storageCell(cell);
    if (!storage.initialized) this.fail("RT1003", "runtime.name.uninitialized", expression.range, { name: cell.name });
    if (!storage.value || typeof storage.value !== "object" || (!("kind" in storage.value))) {
      this.fail("RT1703", "runtime.value.requiresComposite", expression.range);
    }
    return { type: cell.type, value: storage.value as RuntimeArray | RuntimeRecord | RuntimeObject };
  }

  private readCell(cell: Cell, range: SourceRange): TypedValue {
    const storage = storageCell(cell);
    if (!storage.initialized) this.fail("RT1003", "runtime.name.uninitialized", range, { name: cell.name });
    return { type: cell.type, value: cloneValue(storage.value!) };
  }

  private async resolveType(reference: TypeReference): Promise<RuntimeType> {
    switch (reference.kind) {
      case "PrimitiveTypeReference": return primitive(reference.name);
      case "ArrayTypeReference": return this.resolveArrayType(reference);
      case "NamedTypeReference": {
        if (this.classes.has(reference.normalizedName)) return this.resolveClassType(reference.normalizedName, reference.range);
        if (this.pointers.has(reference.normalizedName)) return this.resolvePointerType(reference.normalizedName, reference.range);
        if (this.sets.has(reference.normalizedName)) return this.resolveSetType(reference.normalizedName, reference.range);
        if (this.resolvedEnums.has(reference.normalizedName)) return this.resolvedEnums.get(reference.normalizedName)!;
        return this.resolveRecordType(reference.normalizedName, reference.range);
      }
      default: this.fail("RT1101", "runtime.type.notSupportedInCurrentStage", reference.range);
    }
  }

  private async resolveRuntimeType(reference: TypeReference): Promise<RuntimeType> {
    if (reference.kind === "NamedTypeReference" && this.classes.has(reference.normalizedName)) {
      return this.resolveClassType(reference.normalizedName, reference.range);
    }
    return this.resolveType(reference);
  }

  private async resolveClassType(normalizedName: string, range: SourceRange): Promise<ClassRuntimeType> {
    const existing = this.resolvedClasses.get(normalizedName);
    if (existing) return existing;
    const declaration = this.classes.get(normalizedName);
    if (!declaration) this.fail("RT1101", "runtime.type.notSupportedInCurrentStage", range);
    const base = declaration.normalizedBaseName ? await this.resolveClassType(declaration.normalizedBaseName, range) : undefined;
    const type: ClassRuntimeType = { kind: "class", name: declaration.name, normalizedName, ...(base ? { base } : {}), fields: [] };
    this.resolvedClasses.set(normalizedName, type);
    if (base) type.fields.push(...base.fields);
    for (const member of declaration.members) {
      if (member.kind !== "ClassField") continue;
      type.fields.push({ name: member.name, normalizedName: member.normalizedName, access: member.access, type: await this.resolveType(member.typeReference), owner: normalizedName });
    }
    return type;
  }

  private async resolvePointerType(normalizedName: string, range: SourceRange): Promise<PointerRuntimeType> {
    const existing = this.resolvedPointers.get(normalizedName);
    if (existing) return existing;
    const declaration = this.pointers.get(normalizedName);
    if (!declaration) this.fail("RT1101", "runtime.type.notSupportedInCurrentStage", range);
    const type: PointerRuntimeType = { kind: "pointer", target: await this.resolveType(declaration.targetType) };
    this.resolvedPointers.set(normalizedName, type);
    return type;
  }

  private async resolveSetType(normalizedName: string, range: SourceRange): Promise<SetRuntimeType> {
    const existing = this.resolvedSets.get(normalizedName);
    if (existing) return existing;
    const declaration = this.sets.get(normalizedName);
    if (!declaration) this.fail("RT1101", "runtime.type.notSupportedInCurrentStage", range);
    const type: SetRuntimeType = { kind: "set", name: declaration.name, normalizedName, elementType: await this.resolveType(declaration.elementType) };
    this.resolvedSets.set(normalizedName, type);
    return type;
  }

  private async resolveArrayType(reference: ArrayTypeReference): Promise<ArrayRuntimeType> {
    const dimensions: Array<{ lower: number; upper: number }> = [];
    for (const dimension of reference.dimensions) {
      const lower = asInteger(await this.evaluate(dimension.lower), dimension.lower.range);
      const upper = asInteger(await this.evaluate(dimension.upper), dimension.upper.range);
      if (lower > upper) this.fail("RT1604", "runtime.array.invalidBounds", dimension.range, { lower, upper });
      dimensions.push({ lower, upper });
    }
    const elements = dimensions.reduce((count, { lower, upper }) => count * (upper - lower + 1), 1);
    if (!Number.isSafeInteger(elements) || elements > this.options.maxArrayElements) {
      this.fail("RT1605", "runtime.array.tooLarge", reference.range, { maximum: this.options.maxArrayElements });
    }
    return { kind: "array", dimensions, elementType: await this.resolveType(reference.elementType) };
  }

  private async resolveRecordType(normalizedName: string, range: SourceRange): Promise<RecordRuntimeType> {
    const existing = this.resolvedRecords.get(normalizedName);
    if (existing) return existing;
    const declaration = this.records.get(normalizedName);
    if (!declaration) this.fail("RT1101", "runtime.type.notSupportedInCurrentStage", range);
    if (this.resolvingRecords.has(normalizedName)) this.fail("RT1704", "runtime.record.circularType", range, { name: declaration.name });
    this.resolvingRecords.add(normalizedName);
    const type: RecordRuntimeType = { kind: "record", name: declaration.name, normalizedName, fields: [] };
    this.resolvedRecords.set(normalizedName, type);
    for (const field of declaration.fields) {
      type.fields.push({ name: field.name, normalizedName: field.normalizedName, type: await this.resolveType(field.typeReference) });
    }
    this.resolvingRecords.delete(normalizedName);
    return type;
  }

  private assign(cell: Cell, value: TypedValue, range: SourceRange): void {
    if (!typesCompatible(cell.type, value.type)) {
      this.fail("RT1006", "runtime.assignment.typeMismatch", range, { target: typeName(cell.type), value: typeName(value.type) });
    }
    const storage = storageCell(cell);
    storage.value = cloneValue(value.value);
    storage.initialized = true;
  }

  private async matchesCaseLabel(selector: TypedValue, label: CaseLabel): Promise<boolean> {
    if (label.kind === "CaseValueLabel") return compareValues(selector, await this.evaluate(label.value), label.range) === 0;
    const lower = await this.evaluate(label.lower);
    const upper = await this.evaluate(label.upper);
    return compareValues(selector, lower, label.lower.range) >= 0 && compareValues(selector, upper, label.upper.range) <= 0;
  }

  private async newObject(expression: Extract<Expression, { kind: "NewExpression" }>): Promise<TypedValue> {
    const type = await this.resolveClassType(expression.normalizedClassName, expression.classNameRange);
    const object: RuntimeObject = { kind: "object", type, fields: new Map() };
    for (const field of type.fields) {
      const value = instantiateComposite(field.type);
      object.fields.set(field.normalizedName, {
        name: field.name, normalizedName: field.normalizedName, kind: "field", type: field.type,
        initialized: value !== undefined, ...(value !== undefined ? { value } : {})
      });
    }
    const constructor = this.findMethod(type, "NEW");
    if (constructor) await this.invokeRoutine(constructor.declaration, expression.arguments, object, constructor.owner);
    else if (expression.arguments.length) this.fail("RT1906", "runtime.call.argumentCount", expression.range, { expected: 0, actual: expression.arguments.length });
    return { type, value: object };
  }

  private async callMethod(expression: Extract<Expression, { kind: "MemberExpression" }>, args: Expression[], range: SourceRange): Promise<TypedValue | undefined> {
    let object: RuntimeObject;
    let type: ClassRuntimeType;
    if (expression.target.kind === "NameExpression" && expression.target.normalizedName === "SUPER") {
      const frame = this.currentFrame();
      if (!frame.receiver || !frame.classType?.base) this.fail("RT1705", "runtime.class.superOutsideMethod", range);
      object = frame.receiver;
      type = frame.classType.base;
    } else {
      const value = await this.evaluate(expression.target);
      if (value.type.kind !== "class" || !isRuntimeObject(value.value)) this.fail("RT1705", "runtime.class.methodRequiresObject", expression.target.range);
      object = value.value;
      // The variable may have a base-class type while the stored object is a
      // subclass instance. Method lookup must use the object's dynamic type.
      type = object.type;
    }
    const method = this.findMethod(type, expression.normalizedMember);
    if (!method) this.fail("RT1904", "runtime.function.notFound", expression.memberRange, { name: expression.member });
    if (method.access === "PRIVATE" && this.currentFrame().classType?.normalizedName !== method.owner) {
      this.fail("RT1706", "runtime.class.privateMember", expression.memberRange, { member: expression.member });
    }
    const value = await this.invokeRoutine(method.declaration, args, object, method.owner);
    if (method.declaration.kind === "ProcedureDeclaration") return undefined;
    if (!value) this.fail("RT1905", "runtime.function.missingReturn", method.declaration.range, { name: method.declaration.name });
    return value;
  }

  private findMethod(type: ClassRuntimeType, normalizedName: string): { declaration: ProcedureDeclaration | FunctionDeclaration; owner: string; access: "PUBLIC" | "PRIVATE" } | undefined {
    for (let current: ClassRuntimeType | undefined = type; current; current = current.base) {
      const declaration = this.classes.get(current.normalizedName);
      const member = declaration?.members.find((candidate) =>
        (candidate.kind === "ProcedureDeclaration" || candidate.kind === "FunctionDeclaration") && candidate.normalizedName === normalizedName
      );
      if (member && (member.kind === "ProcedureDeclaration" || member.kind === "FunctionDeclaration")) {
        return { declaration: member, owner: current.normalizedName, access: member.access ?? "PUBLIC" };
      }
    }
    return undefined;
  }

  private async callProcedure(normalizedName: string, args: Expression[], range: SourceRange): Promise<void> {
    const declaration = this.procedures.get(normalizedName);
    if (!declaration) this.fail("RT1903", "runtime.procedure.notFound", range, { name: normalizedName });
    await this.invokeRoutine(declaration, args);
  }

  private async callFunction(normalizedName: string, args: Expression[], range: SourceRange): Promise<TypedValue> {
    const declaration = this.functions.get(normalizedName);
    if (!declaration) this.fail("RT1904", "runtime.function.notFound", range, { name: normalizedName });
    const value = await this.invokeRoutine(declaration, args);
    if (!value) this.fail("RT1905", "runtime.function.missingReturn", declaration.range, { name: declaration.name });
    return value;
  }

  private async invokeRoutine(declaration: ProcedureDeclaration | FunctionDeclaration, args: Expression[], receiver?: RuntimeObject, className?: string): Promise<TypedValue | undefined> {
    if (this.frames.length - 1 >= this.options.maxCallDepth) {
      this.fail("RT1205", "runtime.limit.callDepth", declaration.nameRange, { maximum: this.options.maxCallDepth });
    }
    if (args.length !== declaration.parameters.length) {
      this.fail("RT1906", "runtime.call.argumentCount", declaration.range, { expected: declaration.parameters.length, actual: args.length });
    }
    const parameterCells = new Map<string, Cell>();
    for (let index = 0; index < declaration.parameters.length; index += 1) {
      const parameter = declaration.parameters[index];
      const argument = args[index];
      const parameterType = await this.resolveType(parameter.typeReference);
      if (parameter.mode === "BYREF") {
        const target = await this.resolveLocation(argument, true);
        if (!sameRuntimeType(parameterType, target.type)) {
          this.fail("RT1907", "runtime.call.byrefTypeMismatch", argument.range, { expected: typeName(parameterType), actual: typeName(target.type) });
        }
        parameterCells.set(parameter.normalizedName, {
          name: parameter.name,
          normalizedName: parameter.normalizedName,
          kind: "variable",
          type: parameterType,
          initialized: storageCell(target).initialized,
          alias: storageCell(target)
        });
      } else {
        const value = await this.evaluate(argument);
        if (!typesCompatible(parameterType, value.type)) {
          this.fail("RT1908", "runtime.call.argumentTypeMismatch", argument.range, { expected: typeName(parameterType), actual: typeName(value.type) });
        }
        parameterCells.set(parameter.normalizedName, {
          name: parameter.name,
          normalizedName: parameter.normalizedName,
          kind: "variable",
          type: parameterType,
          initialized: true,
          value: cloneValue(value.value)
        });
      }
    }
    const returnType = declaration.kind === "FunctionDeclaration" ? await this.resolveType(declaration.returnType) : undefined;
    const frame: Frame = {
      id: `frame-${this.sequence + 1}`,
      name: declaration.name,
      cells: parameterCells,
      ...(returnType ? { returnType } : {})
      ,...(receiver ? { receiver, classType: className ? this.resolvedClasses.get(className) ?? receiver.type : receiver.type } : {})
    };
    this.frames.push(frame);
    this.emit("frame-entered", declaration.range, { name: declaration.name, stack: this.stackNames(), variables: this.getVariables() });
    this.trace?.record({
      range: declaration.range,
      frameId: frame.id,
      kind: "call",
      label: `CALL ${declaration.name}`,
      writes: [],
      call: { name: declaration.name, kind: declaration.kind === "ProcedureDeclaration" ? "procedure" : "function" }
    });
    let returned: TypedValue | undefined;
    try {
      await this.executeBlock(declaration.body);
    } catch (error) {
      if (error instanceof Returned) returned = error.value;
      else throw error;
    } finally {
      this.frames.pop();
      this.emit("frame-exited", declaration.range, { name: declaration.name, stack: this.stackNames(), variables: this.getVariables() });
      this.trace?.record({ range: declaration.range, frameId: frame.id, kind: "return", label: `RETURN ${declaration.name}`, writes: [] });
    }
    if (declaration.kind === "ProcedureDeclaration") {
      if (returned) this.fail("RT1909", "runtime.procedure.cannotReturnValue", declaration.range, { name: declaration.name });
      return undefined;
    }
    if (!returned) this.fail("RT1905", "runtime.function.missingReturn", declaration.range, { name: declaration.name });
    return returned;
  }

  private currentFrame(): Frame { return this.frames[this.frames.length - 1]; }
  private lookupCell(normalizedName: string): Cell | undefined {
    const current = this.currentFrame();
    return current.cells.get(normalizedName)
      ?? current.receiver?.fields.get(normalizedName)
      ?? (current.id === "main" ? this.enumCells.get(normalizedName) : this.cells.get(normalizedName) ?? this.enumCells.get(normalizedName));
  }
  private stackNames(): string[] { return this.frames.map(({ name }) => name); }

  private openFile(name: string, mode: TextFileMode, range: SourceRange): void {
    const normalized = validatedFileName(name, range);
    if (this.handles.has(normalized)) this.fail("RT2004", "runtime.file.alreadyOpen", range, { file: name });
    let file = this.workingFiles.find((candidate) => normalizeName(candidate.name) === normalized);
    const created = !file;
    const expectedKind = mode === "RANDOM" ? "records" : "text";
    if (!file) {
      if (mode === "READ") this.fail("RT2005", "runtime.file.notFound", range, { file: name });
      file = {
        id: `runtime-file-${Date.now().toString(36)}-${this.workingFiles.length + 1}`,
        name,
        kind: expectedKind,
        ...(expectedKind === "text" ? { lines: [] } : { records: [] })
      };
      this.workingFiles.push(file);
      this.filesChanged = true;
    }
    if (file.kind !== expectedKind) this.fail("RT2006", "runtime.file.kindMismatch", range, { file: file.name, expected: expectedKind });
    if (mode === "WRITE") {
      file.lines = [];
      this.filesChanged = true;
    }
    const position = mode === "APPEND" ? (file.lines ?? []).length + 1 : 1;
    const handle: OpenHandle = { file, mode, position };
    this.handles.set(normalized, handle);
    this.ensureFileLimit(file, range);
    this.ensureProjectFileLimit(range);
    this.emitFile("file-opened", range, handle, { changed: created || mode === "WRITE" });
  }

  private requireHandle(name: string, modes: TextFileMode[], range: SourceRange): OpenHandle {
    const normalized = validatedFileName(name, range);
    const handle = this.handles.get(normalized);
    if (!handle) this.fail("RT2007", "runtime.file.notOpen", range, { file: name });
    if (!modes.includes(handle.mode)) {
      this.fail("RT2008", "runtime.file.modeMismatch", range, { file: handle.file.name, expected: modes.join("/"), actual: handle.mode });
    }
    return handle;
  }

  private closeFile(name: string, range: SourceRange, automatic: boolean): void {
    const normalized = validatedFileName(name, range);
    const handle = this.handles.get(normalized);
    if (!handle) this.fail("RT2007", "runtime.file.notOpen", range, { file: name });
    this.handles.delete(normalized);
    this.emitFile("file-closed", range, handle, { automatic });
  }

  private closeAllHandles(automatic: boolean): void {
    for (const [normalized, handle] of [...this.handles]) {
      this.handles.delete(normalized);
      this.emitFile("file-closed", this.program.range, handle, { automatic });
    }
  }

  private emitFile(type: "file-opened" | "file-position-changed" | "file-written" | "file-closed", range: SourceRange, handle: OpenHandle, data: Record<string, unknown>): void {
    this.emit(type, range, {
      ...data,
      handle: { name: handle.file.name, mode: handle.mode, position: handle.position } satisfies RuntimeFileHandle,
      handles: this.handleSnapshots()
    });
  }

  private handleSnapshots(): RuntimeFileHandle[] {
    return [...this.handles.values()].map(({ file, mode, position }) => ({ name: file.name, mode, position }));
  }

  private ensureFileLimit(file: RuntimeVirtualFile, range: SourceRange): void {
    const bytes = virtualFileBytes(file);
    if (bytes > this.options.maxFileBytes) this.fail("RT2201", "runtime.file.limit.fileBytes", range, { file: file.name, maximum: this.options.maxFileBytes });
    this.ensureProjectFileLimit(range);
  }

  private ensureProjectFileLimit(range: SourceRange): void {
    const bytes = this.workingFiles.reduce((total, file) => total + virtualFileBytes(file), 0);
    if (bytes > this.options.maxProjectFileBytes) this.fail("RT2202", "runtime.file.limit.projectBytes", range, { maximum: this.options.maxProjectFileBytes });
  }

  private recordToPlain(record: RuntimeRecord, range: SourceRange): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const field of record.fields.values()) {
      if (!field.initialized) this.fail("RT2107", "runtime.random.uninitializedField", range, { field: field.name });
      if (field.type.kind === "array") this.fail("RT2108", "runtime.random.arrayFieldUnsupported", range, { field: field.name });
      if (field.type.kind === "record") {
        if (!isRuntimeRecord(field.value!)) this.fail("RT2109", "runtime.random.invalidStoredRecord", range, { field: field.name });
        result[field.name] = this.recordToPlain(field.value, range);
      } else {
        result[field.name] = clonePlainValue(field.value!);
      }
    }
    return result;
  }

  private plainToRecord(plain: Record<string, unknown>, type: RecordRuntimeType, range: SourceRange): RuntimeRecord {
    const record = instantiateComposite(type);
    if (!record || record.kind !== "record") this.fail("RT2109", "runtime.random.invalidStoredRecord", range);
    for (const field of record.fields.values()) {
      const entry = Object.entries(plain).find(([name]) => normalizeName(name) === field.normalizedName);
      if (!entry) this.fail("RT2109", "runtime.random.invalidStoredRecord", range, { field: field.name });
      const raw = entry[1];
      if (field.type.kind === "array") this.fail("RT2108", "runtime.random.arrayFieldUnsupported", range, { field: field.name });
      if (field.type.kind === "record") {
        if (!isPlainRecord(raw)) this.fail("RT2109", "runtime.random.invalidStoredRecord", range, { field: field.name });
        field.value = this.plainToRecord(raw, field.type, range);
      } else {
        if (field.type.kind !== "primitive") this.fail("RT2109", "runtime.random.invalidStoredRecord", range, { field: field.name });
        field.value = plainPrimitive(raw, field.type.name, range);
      }
      field.initialized = true;
    }
    return record;
  }

  private attachMainTraceId(cell: Cell): void {
    if (this.currentFrame().id === "main" && cell.type.kind === "primitive") cell.traceId = `main:${cell.normalizedName}`;
  }

  private traceValueFor(cell: Cell): TraceValue | undefined {
    const storage = storageCell(cell);
    return storage.traceId ? traceValue(storage) : undefined;
  }

  private traceDeclaration(range: SourceRange, cell: Cell): void {
    const storage = storageCell(cell);
    if (!this.trace || !storage.traceId) return;
    const declaration: TraceDeclaration = { variableId: storage.traceId, name: cell.name, value: traceValue(storage) };
    this.trace.record({ range, frameId: this.currentFrame().id, kind: "declare", label: `DECLARE ${cell.name}`, writes: [], declarations: [declaration] });
  }

  private traceWrite(range: SourceRange, cell: Cell, before: TraceValue | undefined, cause: TraceWrite["cause"], label: string): void {
    const storage = storageCell(cell);
    if (!this.trace || !storage.traceId || !before) return;
    const after = traceValue(storage);
    const isByRef = cell !== storage && this.currentFrame().id !== "main";
    const write: TraceWrite = {
      variableId: storage.traceId,
      name: storage.name,
      before,
      after,
      sameValue: traceValuesEqual(before, after),
      cause: isByRef ? "byref-write" : cause,
      ...(isByRef ? { origin: { frameId: this.currentFrame().id, name: cell.name } } : {})
    };
    this.trace.record({ range, frameId: this.currentFrame().id, kind: "write", label, writes: [write] });
  }

  private traceCondition(range: SourceRange, structure: "IF" | "FOR" | "WHILE" | "REPEAT", result: boolean): void {
    this.trace?.record({ range, frameId: this.currentFrame().id, kind: "condition", label: `${structure} → ${result ? "TRUE" : "FALSE"}`, writes: [], condition: { structure, result } });
  }

  private traceOutput(range: SourceRange, output: string): void {
    this.trace?.record({ range, frameId: this.currentFrame().id, kind: "output", label: `OUTPUT ${output}`, writes: [], output });
  }

  private traceError(error: RuntimeErrorInfo): void {
    this.trace?.record({ range: error.range, frameId: this.currentFrame()?.id ?? "main", kind: "error", label: error.code, writes: [], error });
  }

  private writeOutput(line: string, range: SourceRange): void {
    const bytes = encoder.encode(`${line}\n`).byteLength;
    if (this.outputs.length + 1 > this.options.maxOutputLines) this.fail("RT1201", "runtime.limit.outputLines", range, { maximum: this.options.maxOutputLines });
    if (this.outputBytes + bytes > this.options.maxOutputBytes) this.fail("RT1202", "runtime.limit.outputBytes", range, { maximum: this.options.maxOutputBytes });
    this.outputs.push(line);
    this.outputBytes += bytes;
    this.emit("output-written", range, { text: line, lineNumber: this.outputs.length });
  }

  private lockLoopControl(name: string): void { this.loopControls.set(name, (this.loopControls.get(name) ?? 0) + 1); }
  private unlockLoopControl(name: string): void {
    const count = (this.loopControls.get(name) ?? 1) - 1;
    if (count <= 0) this.loopControls.delete(name);
    else this.loopControls.set(name, count);
  }

  private async tick(range: SourceRange, event: "statement-entered" | "condition-checked", data: Record<string, unknown>): Promise<void> {
    this.checkStopped();
    this.steps += 1;
    this.checkLimits(range);
    this.emit(event, range, { ...data, step: this.steps });
    if (this.steps % this.options.yieldEverySteps === 0) {
      await new Promise<void>((resolve) => setTimeout(resolve, 0));
      this.checkLimits(range);
    }
  }

  private checkLimits(range: SourceRange): void {
    this.checkStopped();
    if (this.steps > this.options.maxSteps) this.fail("RT1203", "runtime.limit.steps", range, { maximum: this.options.maxSteps });
    if (this.activeTime() > this.options.maxActiveTimeMs) this.fail("RT1204", "runtime.limit.activeTime", range, { maximum: this.options.maxActiveTimeMs });
  }

  private checkStopped(): void { if (this.stopped) throw new Stopped(); }

  private fail(code: string, messageKey: string, range: SourceRange, args?: RuntimeErrorInfo["args"]): never {
    throw new RuntimeFault(faultInfo(code, messageKey, range, args));
  }

  private emit(type: ExecutionEventType, range: SourceRange, data: Record<string, unknown>): void {
    this.options.onEvent?.({ type, runId: this.runId, sequence: ++this.sequence, range, frameId: this.currentFrame()?.id ?? "main", data });
  }

  private emitVariable(type: "variable-declared" | "variable-changed", range: SourceRange, cell: Cell): void {
    this.emit(type, range, { variable: snapshotCell(cell), variables: this.getVariables(), stack: this.stackNames() });
  }

  private pauseActiveClock(): void {
    if (this.activeStartedAt === undefined) return;
    this.accumulatedActiveMs += Math.max(0, this.options.now() - this.activeStartedAt);
    this.activeStartedAt = undefined;
  }

  private resumeActiveClock(): void { if (this.activeStartedAt === undefined) this.activeStartedAt = this.options.now(); }
  private activeTime(): number { return this.accumulatedActiveMs + (this.activeStartedAt === undefined ? 0 : Math.max(0, this.options.now() - this.activeStartedAt)); }

  private finish(status: ExecutionStatus, error?: RuntimeErrorInfo): ExecutionResult {
    return {
      runId: this.runId,
      status,
      outputs: [...this.outputs],
      variables: this.getVariables(),
      steps: this.steps,
      activeTimeMs: this.activeTime(),
      virtualFiles: cloneFiles(status === "completed" ? this.workingFiles : this.initialFiles),
      fileChangesCommitted: status === "completed",
      ...(error ? { error } : {}),
      ...(this.diagnostics ? { diagnostics: this.diagnostics } : {})
    };
  }
}

export function executeProgram(program: Program, options: ExecutionOptions = {}): ExecutionController {
  return expose(new Interpreter(program, options));
}

export function executeSource(source: string, options: ExecutionOptions = {}): ExecutionController {
  const analysis = analyzeSource(source, { maxDiagnostics: 200 });
  return expose(new Interpreter(analysis.program, options, analysis.diagnostics));
}

function expose(interpreter: Interpreter): ExecutionController {
  return {
    runId: interpreter.runId,
    result: interpreter.result,
    provideInput: (value) => interpreter.provideInput(value),
    stop: () => interpreter.stop(),
    getVariables: () => interpreter.getVariables()
  };
}

type UnsupportedFeature = { feature: string; range: SourceRange };

function findUnsupportedFeature(program: Program, profile: ExecutionProfile): UnsupportedFeature | undefined {
  const visitType = (reference: TypeReference): UnsupportedFeature | undefined => {
    if (reference.kind === "ErrorTypeReference") return undefined;
    if (reference.kind === "ArrayTypeReference") {
      for (const dimension of reference.dimensions) {
        const found = visitExpression(dimension.lower) ?? visitExpression(dimension.upper);
        if (found) return found;
      }
      return visitType(reference.elementType);
    }
    return undefined;
  };
  const visitExpression = (expression: Expression): UnsupportedFeature | undefined => {
    if (expression.kind === "NewExpression") return profile === "advanced-2027" ? undefined : { feature: "NEW / 对象", range: expression.range };
    if (expression.kind === "UnaryExpression" && expression.operator === "^" && profile !== "advanced-2027") {
      return { feature: "指针", range: expression.range };
    }
    if (expression.kind === "CallExpression" && expression.callee.kind === "MemberExpression" && profile !== "advanced-2027") {
      return { feature: "对象方法", range: expression.range };
    }
    switch (expression.kind) {
      case "UnaryExpression": return visitExpression(expression.operand);
      case "BinaryExpression": return visitExpression(expression.left) ?? visitExpression(expression.right);
      case "CallExpression": return expression.arguments.reduce<UnsupportedFeature | undefined>((found, argument) => found ?? visitExpression(argument), undefined);
      case "IndexExpression": return visitExpression(expression.target) ?? expression.indices.reduce<UnsupportedFeature | undefined>((found, index) => found ?? visitExpression(index), undefined);
      case "MemberExpression": return visitExpression(expression.target);
      default: return undefined;
    }
  };
  const visitStatements = (statements: Statement[]): UnsupportedFeature | undefined => {
    for (const statement of statements) {
      let found: UnsupportedFeature | undefined;
      switch (statement.kind) {
        case "EnumTypeDeclaration": if (profile !== "advanced-2027") found = { feature: "枚举", range: statement.range }; break;
        case "PointerTypeDeclaration": if (profile !== "advanced-2027") found = { feature: "指针", range: statement.range }; break;
        case "SetTypeDeclaration":
        case "DefineSetStatement": if (profile !== "advanced-2027") found = { feature: "集合", range: statement.range }; break;
        case "ClassDeclaration": if (profile !== "advanced-2027") found = { feature: "CLASS / 对象", range: statement.range }; break;
        case "MethodCallStatement": if (profile !== "advanced-2027") found = { feature: "对象方法", range: statement.range }; break;
        case "DeclareStatement": found = visitType(statement.typeReference); break;
        case "ConstantStatement": found = visitExpression(statement.value); break;
        case "AssignmentStatement": found = visitExpression(statement.target) ?? visitExpression(statement.value); break;
        case "InputStatement": found = visitExpression(statement.target); break;
        case "OutputStatement": found = statement.values.reduce<UnsupportedFeature | undefined>((result, value) => result ?? visitExpression(value), undefined); break;
        case "OpenFileStatement": found = visitExpression(statement.file); break;
        case "ReadFileStatement": found = visitExpression(statement.file) ?? visitExpression(statement.target); break;
        case "WriteFileStatement": found = visitExpression(statement.file) ?? visitExpression(statement.data); break;
        case "CloseFileStatement": found = visitExpression(statement.file); break;
        case "SeekStatement": found = visitExpression(statement.file) ?? visitExpression(statement.address); break;
        case "GetRecordStatement": found = visitExpression(statement.file) ?? visitExpression(statement.target); break;
        case "PutRecordStatement": found = visitExpression(statement.file) ?? visitExpression(statement.data); break;
        case "IfStatement": found = visitExpression(statement.condition) ?? visitStatements(statement.thenBranch) ?? visitStatements(statement.elseBranch); break;
        case "CaseStatement": found = visitExpression(statement.selector) ?? statement.clauses.reduce<UnsupportedFeature | undefined>((result, clause) => result ?? visitStatements(clause.body), undefined); break;
        case "ForStatement": found = visitExpression(statement.control) ?? visitExpression(statement.startValue) ?? visitExpression(statement.endValue) ?? (statement.step && visitExpression(statement.step)) ?? visitStatements(statement.body); break;
        case "WhileStatement": found = visitExpression(statement.condition) ?? visitStatements(statement.body); break;
        case "RepeatStatement": found = visitStatements(statement.body) ?? visitExpression(statement.condition); break;
        case "ProcedureDeclaration": found = visitStatements(statement.body); break;
        case "FunctionDeclaration": found = visitType(statement.returnType) ?? visitStatements(statement.body); break;
        case "RecordTypeDeclaration": found = statement.fields.reduce<UnsupportedFeature | undefined>((result, field) => result ?? visitType(field.typeReference), undefined); break;
        case "ReturnStatement": found = visitExpression(statement.value); break;
        default: break;
      }
      if (found) return found;
    }
    return undefined;
  };
  return visitStatements(program.body);
}

function primitive(name: LiteralType): PrimitiveRuntimeType { return { kind: "primitive", name }; }
function typed(type: LiteralType, value: number | string | boolean | RuntimeDate): TypedValue { return { type: primitive(type), value }; }

function parseInput(raw: string, type: LiteralType): TypedValue | { messageKey: string; args?: Record<string, string | number> } {
  const trimmed = raw.trim();
  switch (type) {
    case "STRING": return typed(type, raw);
    case "CHAR": return [...raw].length === 1 ? typed(type, raw) : { messageKey: "runtime.input.invalidChar" };
    case "INTEGER": {
      if (!/^[+-]?\d+$/.test(trimmed)) return { messageKey: "runtime.input.invalidInteger" };
      const value = Number(trimmed);
      return Number.isSafeInteger(value) ? typed(type, value) : { messageKey: "runtime.input.invalidInteger" };
    }
    case "REAL": {
      if (!/^[+-]?\d+(?:\.\d+)?$/.test(trimmed)) return { messageKey: "runtime.input.invalidReal" };
      const value = Number(trimmed);
      return Number.isFinite(value) ? typed(type, value) : { messageKey: "runtime.input.invalidReal" };
    }
    case "BOOLEAN":
      if (/^TRUE$/i.test(trimmed)) return typed(type, true);
      if (/^FALSE$/i.test(trimmed)) return typed(type, false);
      return { messageKey: "runtime.input.invalidBoolean" };
    case "DATE": {
      const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(trimmed);
      if (!match) return { messageKey: "runtime.input.invalidDate" };
      const value = { day: Number(match[1]), month: Number(match[2]), year: Number(match[3]) };
      return validDate(value) ? typed(type, value) : { messageKey: "runtime.input.invalidDate" };
    }
  }
}

function instantiateComposite(type: RuntimeType): RuntimeArray | RuntimeRecord | RuntimeObject | undefined {
  if (type.kind === "array") return { kind: "array", type, elements: new Map() };
  if (type.kind === "record") {
    return {
      kind: "record",
      type,
      fields: new Map(type.fields.map((field) => {
        // 字段本身又是记录或数组时同样要先建空壳，理由和数组元素那边一样：
        // `X.Born.D ← 7` 里的 `X.Born` 不该被当成「还没有值」。
        const inner = instantiateComposite(field.type);
        return [field.normalizedName, {
          name: field.name,
          normalizedName: field.normalizedName,
          kind: "field" as const,
          type: field.type,
          initialized: inner !== undefined,
          ...(inner !== undefined ? { value: inner } : {})
        }] as const;
      }))
    };
  }
  if (type.kind === "class") {
    const object: RuntimeObject = { kind: "object", type, fields: new Map() };
    for (const field of type.fields) {
      const value = instantiateComposite(field.type);
      object.fields.set(field.normalizedName, {
        name: field.name, normalizedName: field.normalizedName, kind: "field", type: field.type,
        initialized: value !== undefined, ...(value !== undefined ? { value } : {})
      });
    }
    return object;
  }
  return undefined;
}

function snapshotCell(cell: Cell): RuntimeVariable {
  const storage = storageCell(cell);
  return {
    name: cell.name,
    normalizedName: cell.normalizedName,
    kind: cell.kind === "constant" ? "constant" : cell.kind === "loop-variable" ? "loop-variable" : "variable",
    type: typeName(cell.type),
    initialized: storage.initialized,
    ...(storage.initialized ? { value: snapshotValue(storage.value!) } : {}),
    displayValue: storage.initialized ? displayValue(storage.value!, cell.type) : "<未赋值>"
  };
}

function uninitializedTraceValue(): TraceValue { return { initialized: false, displayValue: "<未赋值>" }; }

function traceValue(cell: Cell): TraceValue {
  return cell.initialized
    ? { initialized: true, displayValue: displayValue(cell.value!, cell.type), value: snapshotValue(cell.value!) }
    : uninitializedTraceValue();
}

function traceValuesEqual(left: TraceValue, right: TraceValue): boolean {
  return left.initialized === right.initialized && left.displayValue === right.displayValue
    && JSON.stringify(left.value) === JSON.stringify(right.value);
}

function cloneTraceState(source: Map<string, TraceColumnState>): Map<string, TraceColumnState> {
  return new Map([...source].map(([id, state]) => [id, { ...state }]));
}

function buildTracePlan(program: Program): TracePlan {
  const columns = new Map<string, { variableId: string; name: string; normalizedName: string }>();
  const add = (name: string, normalizedName: string): void => {
    if (!columns.has(normalizedName)) columns.set(normalizedName, { variableId: `main:${normalizedName}`, name, normalizedName });
  };
  const addTarget = (expression: Expression): void => {
    if (expression.kind === "NameExpression") add(expression.name, expression.normalizedName);
  };
  const visit = (statements: Statement[]): void => {
    for (const statement of statements) {
      switch (statement.kind) {
        case "DeclareStatement":
          if (statement.typeReference.kind === "PrimitiveTypeReference") add(statement.name, statement.normalizedName);
          break;
        case "ConstantStatement": add(statement.name, statement.normalizedName); break;
        case "AssignmentStatement": addTarget(statement.target); break;
        case "InputStatement": addTarget(statement.target); break;
        case "ForStatement": add(statement.control.name, statement.control.normalizedName); visit(statement.body); break;
        case "IfStatement": visit(statement.thenBranch); visit(statement.elseBranch); break;
        case "WhileStatement": visit(statement.body); break;
        case "RepeatStatement": visit(statement.body); break;
        case "CaseStatement": for (const clause of statement.clauses) visit(clause.body); break;
        default: break;
      }
    }
  };
  visit(program.body);
  return { columns: [...columns.values()] };
}

function snapshotValue(value: InternalValue): RuntimeValue {
  if (!isComposite(value)) return cloneValue(value) as number | string | boolean | RuntimeDate;
  if (value.kind === "array") {
    const snapshot: RuntimeArraySnapshot = {
      kind: "array",
      dimensions: value.type.dimensions.map((bounds) => ({ ...bounds })),
      elementType: typeName(value.type.elementType),
      initializedElements: []
    };
    for (const [key, cell] of value.elements) {
      if (cell.initialized) snapshot.initializedElements.push({ indices: key.split(",").map(Number), value: snapshotValue(cell.value!) });
    }
    return snapshot;
  }
  if (value.kind === "object") {
    const snapshot: RuntimeObjectSnapshot = {
      kind: "object", className: value.type.name,
      fields: [...value.fields.values()].map((field) => ({
        name: field.name, initialized: field.initialized,
        ...(field.initialized ? { value: snapshotValue(field.value!) } : {})
      }))
    };
    return snapshot;
  }
  if (value.kind === "pointer") return { kind: "pointer", target: value.target.name };
  if (value.kind === "set") {
    const snapshot: RuntimeSetSnapshot = { kind: "set", typeName: value.type.name, values: [...value.values.values()].map((item) => cloneValue(item) as RuntimePrimitive) };
    return snapshot;
  }
  if (value.kind === "enum") return { kind: "enum", typeName: value.type.name, member: value.member } satisfies RuntimeEnumSnapshot;
  const snapshot: RuntimeRecordSnapshot = {
    kind: "record",
    typeName: value.type.name,
    fields: [...value.fields.values()].map((field) => ({
      name: field.name,
      initialized: field.initialized,
      ...(field.initialized ? { value: snapshotValue(field.value!) } : {})
    }))
  };
  return snapshot;
}

function cloneValue<T extends InternalValue>(value: T): T {
  if (isRuntimeObject(value)) return value;
  if (isPointerValue(value)) return value;
  if (isSetValue(value)) {
    const copy: RuntimeSet = { kind: "set", type: value.type, values: new Map() };
    for (const [key, item] of value.values) copy.values.set(key, cloneValue(item));
    return copy as T;
  }
  if (isEnumValue(value)) return value;
  if (!isComposite(value)) {
    if (isDate(value)) return { day: value.day, month: value.month, year: value.year } as T;
    return value;
  }
  if (value.kind === "array") {
    const copy: RuntimeArray = { kind: "array", type: value.type, elements: new Map() };
    for (const [key, cell] of value.elements) copy.elements.set(key, cloneCell(cell));
    return copy as T;
  }
  const copy: RuntimeRecord = { kind: "record", type: value.type, fields: new Map() };
  for (const [key, cell] of value.fields) copy.fields.set(key, cloneCell(cell));
  return copy as T;
}

function cloneCell(cell: Cell): Cell {
  return { ...cell, ...(cell.initialized ? { value: cloneValue(cell.value!) } : {}) };
}

function isRuntimeObject(value: InternalValue): value is RuntimeObject { return isComposite(value) && value.kind === "object"; }

function cloneFiles(files: RuntimeVirtualFile[]): RuntimeVirtualFile[] {
  return files.map((file) => ({
    ...file,
    ...(file.lines ? { lines: [...file.lines] } : {}),
    ...(file.records ? { records: file.records.map((record) => clonePlainRecord(record)) } : {})
  }));
}

function clonePlainRecord(record: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(record).map(([key, value]) => [key, cloneUnknown(value)]));
}

function cloneUnknown(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(cloneUnknown);
  if (isPlainRecord(value)) return clonePlainRecord(value);
  return value;
}

function clonePlainValue(value: InternalValue): unknown {
  if (isComposite(value)) throw new Error("composite value requires explicit serialization");
  return isDate(value) ? { ...value } : value;
}

function normalizeName(name: string): string { return name.toLocaleUpperCase("en-US"); }

function validatedFileName(name: string, range: SourceRange): string {
  const normalized = normalizeName(name);
  if (!name.trim() || name.includes("/") || name.includes("\\") || name.includes("..") || /^[A-Za-z][A-Za-z0-9+.-]*:/.test(name)) {
    throw new RuntimeFault(faultInfo("RT2009", "runtime.file.invalidName", range, { file: name }));
  }
  return normalized;
}

function virtualFileBytes(file: RuntimeVirtualFile): number {
  if (file.kind === "text") return encoder.encode((file.lines ?? []).map((line) => `${line}\n`).join("")).byteLength;
  return encoder.encode(JSON.stringify({ recordType: file.recordType ?? null, records: file.records ?? [] })).byteLength;
}

function plainPrimitive(value: unknown, type: LiteralType, range: SourceRange): InternalValue {
  switch (type) {
    case "INTEGER":
      if (typeof value === "number" && Number.isSafeInteger(value)) return value;
      break;
    case "REAL":
      if (typeof value === "number" && Number.isFinite(value)) return value;
      break;
    case "STRING":
      if (typeof value === "string") return value;
      break;
    case "CHAR":
      if (typeof value === "string" && [...value].length === 1) return value;
      break;
    case "BOOLEAN":
      if (typeof value === "boolean") return value;
      break;
    case "DATE":
      if (isPlainRecord(value)) {
        const date = { day: value.day, month: value.month, year: value.year };
        if (typeof date.day === "number" && typeof date.month === "number" && typeof date.year === "number"
          && Number.isInteger(date.day) && Number.isInteger(date.month) && Number.isInteger(date.year)
          && validDate(date as RuntimeDate)) return date as RuntimeDate;
      }
      break;
  }
  throw new RuntimeFault(faultInfo("RT2109", "runtime.random.invalidStoredRecord", range, { expected: type }));
}

function storageCell(cell: Cell): Cell {
  let current = cell;
  const seen = new Set<Cell>();
  while (current.alias) {
    if (seen.has(current)) throw new Error("cyclic runtime alias");
    seen.add(current);
    current = current.alias;
  }
  return current;
}

function formatValue(value: TypedValue, range: SourceRange): string {
  if (isEnumValue(value.value)) return value.value.member;
  if (value.type.kind !== "primitive") throw new RuntimeFault(faultInfo("RT1801", "runtime.output.requiresPrimitive", range));
  if (value.type.name === "BOOLEAN") return value.value ? "TRUE" : "FALSE";
  if (value.type.name === "DATE") {
    const date = value.value as RuntimeDate;
    return `${pad2(date.day)}/${pad2(date.month)}/${String(date.year).padStart(4, "0")}`;
  }
  if (value.type.name === "REAL") {
    const text = String(value.value);
    return text.includes(".") || /e/i.test(text) ? text : `${text}.0`;
  }
  return String(value.value);
}

function displayValue(value: InternalValue, type?: RuntimeType): string {
  if (isComposite(value)) {
    if (value.kind === "array") return `${typeName(value.type)} · ${[...value.elements.values()].filter(({ initialized }) => initialized).length} 项已赋值`;
    if (value.kind === "pointer") return `^${value.target.name}`;
    if (value.kind === "set") return `${value.type.name} { ${[...value.values.values()].map((item) => displayValue(item)).join(", ")} }`;
    if (value.kind === "enum") return value.member;
    return `${value.type.name} { ${[...value.fields.values()].map((field) => `${field.name}: ${field.initialized ? displayValue(field.value!, field.type) : "<未赋值>"}`).join(", ")} }`;
  }
  if (isDate(value)) return `${pad2(value.day)}/${pad2(value.month)}/${String(value.year).padStart(4, "0")}`;
  if (isPointerValue(value)) return `^${value.target.name}`;
  if (typeof value === "boolean") return value ? "TRUE" : "FALSE";
  if (type?.kind === "primitive" && type.name === "REAL") {
    const text = String(value);
    return text.includes(".") || /e/i.test(text) ? text : `${text}.0`;
  }
  return String(value);
}

function typeName(type: RuntimeType): string {
  if (type.kind === "primitive") return type.name;
  if (type.kind === "record") return type.name;
  if (type.kind === "class") return type.name;
  if (type.kind === "pointer") return `^${typeName(type.target)}`;
  if (type.kind === "set") return type.name;
  if (type.kind === "enum") return type.name;
  return `ARRAY[${type.dimensions.map(({ lower, upper }) => `${lower}:${upper}`).join(", ")}] OF ${typeName(type.elementType)}`;
}

function typesCompatible(target: RuntimeType, value: RuntimeType): boolean {
  if (target.kind === "primitive" && value.kind === "primitive") return target.name === value.name || (target.name === "REAL" && value.name === "INTEGER");
  if (target.kind === "record" && value.kind === "record") return target.normalizedName === value.normalizedName;
  if (target.kind === "array" && value.kind === "array") {
    return target.dimensions.length === value.dimensions.length
      && target.dimensions.every((bounds, index) => bounds.lower === value.dimensions[index]?.lower && bounds.upper === value.dimensions[index]?.upper)
      && sameRuntimeType(target.elementType, value.elementType);
  }
  if (target.kind === "class" && value.kind === "class") return isSubclassOf(value, target);
  if (target.kind === "pointer" && value.kind === "pointer") return sameRuntimeType(target.target, value.target);
  if (target.kind === "set" && value.kind === "set") return target.normalizedName === value.normalizedName;
  if (target.kind === "enum" && value.kind === "enum") return target.normalizedName === value.normalizedName;
  return false;
}

function isSubclassOf(value: ClassRuntimeType, target: ClassRuntimeType): boolean {
  for (let current: ClassRuntimeType | undefined = value; current; current = current.base) {
    if (current.normalizedName === target.normalizedName) return true;
  }
  return false;
}

function sameRuntimeType(left: RuntimeType, right: RuntimeType): boolean {
  if (left.kind !== right.kind) return false;
  if (left.kind === "primitive" && right.kind === "primitive") return left.name === right.name;
  if (left.kind === "record" && right.kind === "record") return left.normalizedName === right.normalizedName;
  if (left.kind === "array" && right.kind === "array") {
    return left.dimensions.length === right.dimensions.length
      && left.dimensions.every((bounds, index) => bounds.lower === right.dimensions[index]?.lower && bounds.upper === right.dimensions[index]?.upper)
      && sameRuntimeType(left.elementType, right.elementType);
  }
  if (left.kind === "class" && right.kind === "class") return left.normalizedName === right.normalizedName;
  if (left.kind === "pointer" && right.kind === "pointer") return sameRuntimeType(left.target, right.target);
  if (left.kind === "set" && right.kind === "set") return left.normalizedName === right.normalizedName;
  if (left.kind === "enum" && right.kind === "enum") return left.normalizedName === right.normalizedName;
  return false;
}

function numericBinary(left: TypedValue, right: TypedValue, range: SourceRange, operation: (a: number, b: number) => number): TypedValue {
  const real = isPrimitive(left.type, "REAL") || isPrimitive(right.type, "REAL");
  return checkedNumber(operation(asNumber(left, range), asNumber(right, range)), primitive(real ? "REAL" : "INTEGER"), range);
}

function checkedNumber(value: number, type: RuntimeType, range: SourceRange): TypedValue {
  if (!Number.isFinite(value) || (isPrimitive(type, "INTEGER") && !Number.isSafeInteger(value))) throw new RuntimeFault(faultInfo("RT1302", "runtime.math.invalidResult", range));
  return { type, value };
}

function checkedInteger(value: number, range: SourceRange): number {
  if (!Number.isSafeInteger(value)) throw new RuntimeFault(faultInfo("RT1302", "runtime.math.invalidResult", range));
  return value;
}

function asNumber(value: TypedValue, range: SourceRange): number {
  if ((!isPrimitive(value.type, "INTEGER") && !isPrimitive(value.type, "REAL")) || typeof value.value !== "number") throw new RuntimeFault(faultInfo("RT1303", "runtime.type.requiresNumber", range));
  return value.value;
}
function asInteger(value: TypedValue | undefined, range: SourceRange): number {
  if (!value || !isPrimitive(value.type, "INTEGER") || typeof value.value !== "number") throw new RuntimeFault(faultInfo("RT1304", "runtime.type.requiresInteger", range));
  return value.value;
}
function asBoolean(value: TypedValue, range: SourceRange): boolean {
  if (!isPrimitive(value.type, "BOOLEAN") || typeof value.value !== "boolean") throw new RuntimeFault(faultInfo("RT1305", "runtime.type.requiresBoolean", range));
  return value.value;
}
function asString(value: TypedValue | undefined, range: SourceRange): string {
  if (!value || !isPrimitive(value.type, "STRING") || typeof value.value !== "string") throw new RuntimeFault(faultInfo("RT1306", "runtime.type.requiresString", range));
  return value.value;
}
function asChar(value: TypedValue | undefined, range: SourceRange): string {
  if (!value || !isPrimitive(value.type, "CHAR") || typeof value.value !== "string") throw new RuntimeFault(faultInfo("RT1307", "runtime.type.requiresChar", range));
  return value.value;
}

function compareValues(left: TypedValue, right: TypedValue, range: SourceRange): number {
  if (isEnumValue(left.value) && isEnumValue(right.value) && left.type.kind === "enum" && right.type.kind === "enum"
    && left.type.normalizedName === right.type.normalizedName) {
    return left.type.members.indexOf(left.value.member) - right.type.members.indexOf(right.value.member);
  }
  if (left.type.kind !== "primitive" || right.type.kind !== "primitive") throw new RuntimeFault(faultInfo("RT1308", "runtime.comparison.incompatible", range));
  if (left.type.name === "DATE" && right.type.name === "DATE") return dateNumber(left.value as RuntimeDate) - dateNumber(right.value as RuntimeDate);
  if (typeof left.value === "number" && typeof right.value === "number") return left.value - right.value;
  if (typeof left.value === "string" && typeof right.value === "string") return left.value < right.value ? -1 : left.value > right.value ? 1 : 0;
  if (typeof left.value === "boolean" && typeof right.value === "boolean") return Number(left.value) - Number(right.value);
  throw new RuntimeFault(faultInfo("RT1308", "runtime.comparison.incompatible", range));
}

function transformedChar(value: string, upper: boolean, range: SourceRange): string {
  const transformed = upper ? value.toLocaleUpperCase("en") : value.toLocaleLowerCase("en");
  if ([...transformed].length !== 1) throw new RuntimeFault(faultInfo("RT1404", "runtime.char.caseMappingInvalid", range));
  return transformed;
}

function isPrimitive(type: RuntimeType, name: LiteralType): type is PrimitiveRuntimeType { return type.kind === "primitive" && type.name === name; }
function isDate(value: InternalValue): value is DateLiteralValue { return typeof value === "object" && value !== null && "day" in value && "month" in value && "year" in value; }
function isComposite(value: InternalValue): value is RuntimeArray | RuntimeRecord | RuntimeObject | RuntimePointer | RuntimeSet | RuntimeEnum {
  return typeof value === "object" && value !== null && !isDate(value) && "kind" in value
    && (value.kind === "array" || value.kind === "record" || value.kind === "object" || value.kind === "pointer" || value.kind === "set" || value.kind === "enum");
}
function isRuntimeRecord(value: InternalValue): value is RuntimeRecord { return isComposite(value) && value.kind === "record"; }
function isPointerValue(value: InternalValue): value is RuntimePointer { return isComposite(value) && value.kind === "pointer"; }
function isSetValue(value: InternalValue): value is RuntimeSet { return isComposite(value) && value.kind === "set"; }
function isEnumValue(value: InternalValue): value is RuntimeEnum { return isComposite(value) && value.kind === "enum"; }
function valueKey(value: InternalValue): string {
  if (isDate(value)) return `DATE:${value.year}-${value.month}-${value.day}`;
  if (isEnumValue(value)) return `ENUM:${value.type.normalizedName}:${value.member}`;
  if (typeof value === "string") return `STRING:${value}`;
  return `${typeof value}:${String(value)}`;
}
function isPlainRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }
function locationName(expression: Expression): string { return expression.kind === "NameExpression" ? expression.name : expression.kind === "MemberExpression" ? expression.member : "Value"; }
function validDate(value: RuntimeDate): boolean { const date = new Date(Date.UTC(value.year, value.month - 1, value.day)); return date.getUTCFullYear() === value.year && date.getUTCMonth() === value.month - 1 && date.getUTCDate() === value.day; }
function dateNumber(value: RuntimeDate): number { return Date.UTC(value.year, value.month - 1, value.day); }
function pad2(value: number): string { return String(value).padStart(2, "0"); }
function positiveInteger(value: number | undefined, fallback: number): number { return Number.isInteger(value) && value! > 0 ? value! : fallback; }
function positiveNumber(value: number | undefined, fallback: number): number { return Number.isFinite(value) && value! > 0 ? value! : fallback; }
function makeRunId(): string { return `run-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`; }
function faultInfo(code: string, messageKey: string, range: SourceRange, args?: RuntimeErrorInfo["args"]): RuntimeErrorInfo { return { code, messageKey, range, ...(args ? { args } : {}) }; }
