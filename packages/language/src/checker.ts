import { isBuiltin } from "@caie-pseudocode/caie-spec";
import type { Expression, FunctionDeclaration, Program, Statement, TextFileMode, TypeReference } from "./ast.js";
import { typeFromReference, UNKNOWN_TYPE } from "./binder.js";
import type { BindResult, CheckResult, ClassMemberType, ClassType, RoutineParameterType, SymbolInfo, Type } from "./semantic-types.js";
import type { Diagnostic, SourceRange } from "./types.js";

export type CheckOptions = { maxDiagnostics?: number };

const primitive = (name: "INTEGER" | "REAL" | "CHAR" | "STRING" | "BOOLEAN" | "DATE"): Type => ({ kind: "primitive", name });

export function check(program: Program, binding: BindResult, options: CheckOptions = {}): CheckResult {
  const maxDiagnostics = Math.max(1, options.maxDiagnostics ?? 50);
  const diagnostics: Diagnostic[] = [];
  const expressionTypes: CheckResult["expressionTypes"] = [];
  const references = new Map(binding.references.filter(({ symbol }) => symbol).map((reference) => [reference.range.start.offset, reference.symbol!]));
  const typeSymbols = new Map(binding.symbols.filter(({ kind }) => kind === "type").map((symbol) => [symbol.normalizedName, symbol.type]));
  const fileModes = new Map<string, TextFileMode>();
  let currentClass: ClassType | undefined;
  const resolveNamed = (normalizedName: string): Type | undefined => typeSymbols.get(normalizedName);

  const report = (code: string, ruleId: string, messageKey: string, range: SourceRange, origin: Diagnostic["origin"] = "CAIE", args?: Diagnostic["args"], related?: Diagnostic["related"], severity: Diagnostic["severity"] = "error"): void => {
    if (diagnostics.length >= maxDiagnostics) return;
    diagnostics.push({ code, ruleId, severity, origin, messageKey, range, ...(args ? { args } : {}), ...(related ? { related } : {}) });
  };

  const record = (expression: Expression, type: Type): Type => {
    expressionTypes.push({ expression, type });
    return type;
  };

  const infer = (expression: Expression): Type => {
    switch (expression.kind) {
      case "LiteralExpression": return record(expression, primitive(expression.literalType));
      case "NameExpression": return record(expression, references.get(expression.range.start.offset)?.type ?? UNKNOWN_TYPE);
      case "ErrorExpression": return record(expression, UNKNOWN_TYPE);
      case "MemberExpression": {
        const target = infer(expression.target);
        if (target.kind === "unknown") return record(expression, UNKNOWN_TYPE);
        if (target.kind === "class") {
          const member = findClassMember(target, expression.normalizedMember);
          if (!member) {
            report("PC4025", "OOP-004", "type.class.unknownMember", expression.memberRange, "CAIE", {
              class: target.name, member: expression.member
            });
            return record(expression, UNKNOWN_TYPE);
          }
          if (member.access === "PRIVATE" && currentClass?.normalizedName !== member.ownerNormalizedName) {
            report("PC4034", "OOP-001", "type.class.privateMember", expression.memberRange, "CAIE", {
              class: target.name, member: expression.member
            });
          }
          return record(expression, member.type);
        }
        if (target.kind !== "record") {
          report("PC4024", "UDT-005", "type.member.targetMustBeRecord", expression.target.range);
          return record(expression, UNKNOWN_TYPE);
        }
        const field = target.fields.find(({ normalizedName }) => normalizedName === expression.normalizedMember);
        if (!field) {
          report("PC4025", "UDT-005", "type.member.unknownField", expression.memberRange, "CAIE", {
            record: target.name,
            field: expression.member
          });
          return record(expression, UNKNOWN_TYPE);
        }
        return record(expression, field.type);
      }
      case "IndexExpression": {
        const target = infer(expression.target);
        const indexTypes = expression.indices.map(infer);
        if (target.kind === "unknown") return record(expression, UNKNOWN_TYPE);
        if (target.kind !== "array") {
          report("PC4005", "ARRAY-004", "type.index.targetMustBeArray", expression.target.range);
          return record(expression, UNKNOWN_TYPE);
        }
        if (expression.indices.length !== target.dimensions.length) {
          report("PC4006", "ARRAY-004", "type.index.dimensionMismatch", expression.range, "CAIE", {
            expected: target.dimensions.length,
            actual: expression.indices.length
          });
        }
        indexTypes.forEach((type, index) => {
          if (!isPrimitive(type, "INTEGER") && type.kind !== "unknown") {
            report("PC4007", "ARRAY-004", "type.index.requiresInteger", expression.indices[index].range);
          }
          const literal = integerLiteral(expression.indices[index]);
          const dimension = target.dimensions[index];
          if (literal !== undefined && dimension && dimension.lower !== undefined && dimension.upper !== undefined
            && (literal < dimension.lower || literal > dimension.upper)) {
            report("PC4008", "ARRAY-004", "type.index.outOfBounds", expression.indices[index].range, "Editor Runtime", {
              value: literal,
              lower: dimension.lower,
              upper: dimension.upper
            });
          }
        });
        return record(expression, target.elementType);
      }
      case "CallExpression": {
        const calleeType = infer(expression.callee);
        const argumentTypes = expression.arguments.map(infer);
        if (calleeType.kind === "procedure") {
          report("PC4020", "FUNC-002", "type.procedure.cannotBeExpression", expression.callee.range);
          return record(expression, UNKNOWN_TYPE);
        }
        if (calleeType.kind !== "function") {
          if (calleeType.kind !== "unknown") report("PC4035", "OOP-004", "type.call.notCallable", expression.callee.range);
          return record(expression, UNKNOWN_TYPE);
        }
        const isEof = expression.callee.kind === "NameExpression" && expression.callee.normalizedName === "EOF";
        const ruleId = isEof ? "FILE-002"
          : expression.callee.kind === "NameExpression" && isBuiltin(expression.callee.normalizedName) ? "BUILTIN-001" : "PROC-002";
        validateArguments(expression.arguments, argumentTypes, calleeType.parameters, ruleId, report, references, expression.range);
        if (isEof && expression.arguments[0]) checkKnownFileMode(expression.arguments[0], ["READ"], "FILE-002", "type.file.eofRequiresReadMode");
        return record(expression, calleeType.returns);
      }
      case "NewExpression": {
        const classType = resolveNamed(expression.normalizedClassName);
        const argumentTypes = expression.arguments.map(infer);
        if (!classType || classType.kind !== "class") {
          report("PC4032", "OOP-003", "type.class.unknownClass", expression.classNameRange, "CAIE", { name: expression.className });
          return record(expression, UNKNOWN_TYPE);
        }
        const constructor = classType.members.find(({ normalizedName, kind }) => normalizedName === "NEW" && kind === "procedure");
        if (constructor?.type.kind === "procedure") {
          validateArguments(expression.arguments, argumentTypes, constructor.type.parameters, "OOP-003", report, references, expression.range);
        } else if (expression.arguments.length > 0) {
          report("PC4010", "OOP-003", "type.call.argumentCount", expression.range, "CAIE", {
            expected: 0, actual: expression.arguments.length
          });
        }
        return record(expression, classType);
      }
      case "UnaryExpression": {
        const operand = infer(expression.operand);
        if (expression.operator === "^") {
          if (expression.postfix) {
            if (operand.kind === "pointer") return record(expression, operand.target);
            if (operand.kind !== "unknown") report("PC4000", "UDT-002", "type.pointer.dereferenceRequiresPointer", expression.range);
            return record(expression, UNKNOWN_TYPE);
          }
          return record(expression, { kind: "pointer", target: operand });
        }
        if (expression.operator === "NOT") {
          if (!isPrimitive(operand, "BOOLEAN") && operand.kind !== "unknown") {
            report("PC4004", "OP-004", "type.logical.requiresBoolean", expression.range);
          }
          return record(expression, primitive("BOOLEAN"));
        }
        if (!isNumeric(operand) && operand.kind !== "unknown") {
          report("PC4001", "OP-001", "type.arithmetic.requiresNumericOperand", expression.range, "CAIE", {
            actual: displayType(operand)
          });
          return record(expression, UNKNOWN_TYPE);
        }
        return record(expression, operand);
      }
      case "BinaryExpression": {
        const left = infer(expression.left);
        const right = infer(expression.right);
        if (["AND", "OR"].includes(expression.operator)) {
          if ((!isPrimitive(left, "BOOLEAN") && left.kind !== "unknown") || (!isPrimitive(right, "BOOLEAN") && right.kind !== "unknown")) {
            report("PC4004", "OP-004", "type.logical.requiresBoolean", expression.range);
          }
          return record(expression, primitive("BOOLEAN"));
        }
        if (expression.operator === "&") {
          if ((!isPrimitive(left, "STRING") && left.kind !== "unknown") || (!isPrimitive(right, "STRING") && right.kind !== "unknown")) {
            report("PC4003", "OP-005", "type.concatenation.requiresStrings", expression.range);
          }
          return record(expression, primitive("STRING"));
        }
        if ([">", "<", ">=", "<=", "=", "<>"].includes(expression.operator)) {
          if (!areComparable(left, right)) {
            // 两边的类型都已经算出来了，不写进提示里等于让学生自己再推一遍。
            report("PC4002", "OP-003", "type.relation.incompatibleOperands", expression.range, "CAIE", {
              left: displayType(left), right: displayType(right)
            });
          }
          return record(expression, primitive("BOOLEAN"));
        }
        if (["DIV", "MOD"].includes(expression.operator)) {
          if ((!isPrimitive(left, "INTEGER") && left.kind !== "unknown") || (!isPrimitive(right, "INTEGER") && right.kind !== "unknown")) {
            report("PC4001", "OP-001", "type.integerOperator.requiresIntegers", expression.range);
          }
          return record(expression, primitive("INTEGER"));
        }
        if (!isNumeric(left) || !isNumeric(right)) {
          if (left.kind !== "unknown" && right.kind !== "unknown") {
            // `"Hi " + Name` 是从别的语言带过来的写法：`+` 只做加法，接文字要用 `&`。
            const looksLikeConcatenation = expression.operator === "+" &&
              (isPrimitive(left, "STRING") || isPrimitive(right, "STRING") ||
               isPrimitive(left, "CHAR") || isPrimitive(right, "CHAR"));
            if (looksLikeConcatenation) {
              report("PC4003", "OP-005", "type.arithmetic.stringPlus", expression.range);
            } else {
              report("PC4001", "OP-001", "type.arithmetic.requiresNumeric", expression.range, "CAIE", {
                left: displayType(left), right: displayType(right)
              });
            }
          }
          return record(expression, UNKNOWN_TYPE);
        }
        return record(expression, expression.operator === "/" || isPrimitive(left, "REAL") || isPrimitive(right, "REAL")
          ? primitive("REAL")
          : primitive("INTEGER"));
      }
    }
  };

  const requireBoolean = (expression: Expression, ruleId: string): void => {
    const type = infer(expression);
    if (!isPrimitive(type, "BOOLEAN") && type.kind !== "unknown") {
      report("PC4013", ruleId, "type.condition.requiresBoolean", expression.range, "CAIE", {
        actual: displayType(type)
      });
    }
  };

  const requireInteger = (expression: Expression, ruleId: string, messageKey: string): void => {
    const type = infer(expression);
    if (!isPrimitive(type, "INTEGER") && type.kind !== "unknown") report("PC4014", ruleId, messageKey, expression.range);
  };

  const requireString = (expression: Expression, ruleId: string, messageKey: string): Type => {
    const type = infer(expression);
    if (!isPrimitive(type, "STRING") && type.kind !== "unknown") report("PC4027", ruleId, messageKey, expression.range);
    return type;
  };

  function checkKnownFileMode(
    file: Expression,
    allowed: TextFileMode[],
    ruleId: string,
    messageKey: string
  ): void {
    const name = literalFileName(file);
    if (name === undefined) return;
    const actual = fileModes.get(normalizeFileName(name));
    if (!actual || !allowed.includes(actual)) {
      report("PC4029", ruleId, messageKey, file.range, "Editor Runtime", {
        file: name,
        expected: allowed.join(" or "),
        actual: actual ?? "CLOSED"
      });
    }
  }

  const checkWithRestoredFileModes = (callback: () => void, startEmpty = false): void => {
    const saved = new Map(fileModes);
    if (startEmpty) fileModes.clear();
    callback();
    fileModes.clear();
    saved.forEach((mode, name) => fileModes.set(name, mode));
  };

  type RoutineContext = { kind: "procedure" | "function"; returnType?: Type; declaration?: FunctionDeclaration };

  const checkStatements = (statements: Statement[], context?: RoutineContext): void => {
    for (const statement of statements) switch (statement.kind) {
      case "DeclareStatement": checkTypeReference(statement.typeReference, infer, report, resolveNamed); break;
      case "RecordTypeDeclaration": statement.fields.forEach((field) => checkTypeReference(field.typeReference, infer, report, resolveNamed)); break;
      case "PointerTypeDeclaration": checkTypeReference(statement.targetType, infer, report, resolveNamed); break;
      case "EnumTypeDeclaration": break;
      case "SetTypeDeclaration": checkTypeReference(statement.elementType, infer, report, resolveNamed); break;
      case "DefineSetStatement": {
        checkTypeReference(statement.typeReference, infer, report, resolveNamed);
        const setType = typeFromReference(statement.typeReference, resolveNamed);
        if (setType.kind !== "set" && setType.kind !== "unknown") {
          report("PC4036", "UDT-004", "type.set.requiresSetType", statement.typeReference.range);
          statement.values.forEach(infer);
        } else if (setType.kind === "set") {
          for (const value of statement.values) {
            const valueType = infer(value);
            if (!isAssignable(setType.elementType, valueType)) {
              report("PC4036", "UDT-004", "type.set.elementMismatch", value.range, "CAIE", {
                expected: displayType(setType.elementType), actual: displayType(valueType)
              });
            }
          }
        }
        break;
      }
      case "ClassDeclaration": {
        const classType = resolveNamed(statement.normalizedName);
        for (const member of statement.members) {
          if (member.kind === "ClassField") {
            checkTypeReference(member.typeReference, infer, report, resolveNamed);
            continue;
          }
          const previousClass = currentClass;
          currentClass = classType?.kind === "class" ? classType : undefined;
          checkStatements([member], context);
          currentClass = previousClass;
        }
        break;
      }
      case "MethodCallStatement": {
        const calleeType = infer(statement.call.callee);
        const argumentTypes = statement.call.arguments.map(infer);
        if (calleeType.kind === "procedure") {
          validateArguments(statement.call.arguments, argumentTypes, calleeType.parameters, "OOP-004", report, references, statement.call.range);
        } else if (calleeType.kind === "function") {
          report("PC4020", "OOP-004", "type.function.cannotBeStatement", statement.call.callee.range);
          validateArguments(statement.call.arguments, argumentTypes, calleeType.parameters, "OOP-004", report, references, statement.call.range);
        } else if (calleeType.kind !== "unknown") {
          report("PC4035", "OOP-004", "type.call.notCallable", statement.call.callee.range);
        }
        break;
      }
      case "ConstantStatement": infer(statement.value); break;
      case "AssignmentStatement": {
        const target = infer(statement.target);
        const value = infer(statement.value);
        const root = rootSymbol(statement.target, references);
        if (root && !root.mutable) {
          report("PC4009", "ASSIGN-003", "type.assignment.constantTarget", statement.target.range);
        } else if (!isAssignable(target, value)) {
          report("PC4000", "ASSIGN-002", "type.assignment.incompatible", statement.range, "CAIE", {
            target: displayType(target),
            value: displayType(value)
          });
        }
        break;
      }
      case "InputStatement": {
        infer(statement.target);
        const root = rootSymbol(statement.target, references);
        if (root && !root.mutable) report("PC4009", "ASSIGN-003", "type.assignment.constantTarget", statement.target.range);
        break;
      }
      case "OutputStatement": statement.values.forEach(infer); break;
      case "OpenFileStatement": {
        requireString(statement.file, "FILE-001", "type.file.nameRequiresString");
        const name = literalFileName(statement.file);
        if (name !== undefined) {
          const key = normalizeFileName(name);
          const existing = fileModes.get(key);
          if (existing) {
            report("PC4028", "FILE-004", "type.file.alreadyOpen", statement.file.range, "CAIE", {
              file: name,
              mode: existing
            }, undefined, "caie");
          } else {
            fileModes.set(key, statement.mode);
          }
        }
        break;
      }
      case "ReadFileStatement": {
        requireString(statement.file, "FILE-002", "type.file.nameRequiresString");
        const targetType = infer(statement.target);
        if (!isPrimitive(targetType, "STRING") && targetType.kind !== "unknown") {
          report("PC4027", "FILE-002", "type.readFile.targetRequiresString", statement.target.range);
        }
        const root = rootSymbol(statement.target, references);
        if (root && !root.mutable) report("PC4009", "ASSIGN-003", "type.assignment.constantTarget", statement.target.range);
        checkKnownFileMode(statement.file, ["READ"], "FILE-002", "type.file.readRequiresReadMode");
        break;
      }
      case "WriteFileStatement":
        requireString(statement.file, "FILE-003", "type.file.nameRequiresString");
        infer(statement.data);
        checkKnownFileMode(statement.file, ["WRITE", "APPEND"], "FILE-003", "type.file.writeRequiresOutputMode");
        break;
      case "CloseFileStatement": {
        requireString(statement.file, "FILE-003", "type.file.nameRequiresString");
        const name = literalFileName(statement.file);
        if (name !== undefined) {
          const key = normalizeFileName(name);
          if (!fileModes.has(key)) {
            report("PC4029", "FILE-003", "type.file.closeRequiresOpenFile", statement.file.range, "Editor Runtime", { file: name });
          } else {
            fileModes.delete(key);
          }
        }
        break;
      }
      case "SeekStatement": {
        requireString(statement.file, "FILE-005", "type.file.nameRequiresString");
        requireInteger(statement.address, "FILE-005", "type.randomFile.addressRequiresInteger");
        const address = integerLiteral(statement.address);
        if (address !== undefined && address < 1) {
          report("PC4030", "FILE-006", "type.randomFile.addressMustBePositive", statement.address.range, "Editor Runtime", { address });
        }
        checkKnownFileMode(statement.file, ["RANDOM"], "FILE-005", "type.randomFile.requiresRandomMode");
        break;
      }
      case "GetRecordStatement": {
        requireString(statement.file, "FILE-005", "type.file.nameRequiresString");
        const targetType = infer(statement.target);
        if (targetType.kind !== "record" && targetType.kind !== "unknown") {
          report("PC4031", "FILE-005", "type.randomFile.recordRequiresRecord", statement.target.range);
        }
        const root = rootSymbol(statement.target, references);
        if (root && !root.mutable) report("PC4009", "ASSIGN-003", "type.assignment.constantTarget", statement.target.range);
        checkKnownFileMode(statement.file, ["RANDOM"], "FILE-005", "type.randomFile.requiresRandomMode");
        break;
      }
      case "PutRecordStatement": {
        requireString(statement.file, "FILE-005", "type.file.nameRequiresString");
        const dataType = infer(statement.data);
        if (dataType.kind !== "record" && dataType.kind !== "unknown") {
          report("PC4031", "FILE-005", "type.randomFile.recordRequiresRecord", statement.data.range);
        }
        checkKnownFileMode(statement.file, ["RANDOM"], "FILE-005", "type.randomFile.requiresRandomMode");
        break;
      }
      case "IfStatement":
        requireBoolean(statement.condition, "IF-001");
        checkWithRestoredFileModes(() => checkStatements(statement.thenBranch, context));
        checkWithRestoredFileModes(() => checkStatements(statement.elseBranch, context));
        break;
      case "CaseStatement": {
        const selectorType = infer(statement.selector);
        statement.clauses.forEach((clause) => {
          clause.labels.forEach((label) => {
            if (label.kind === "CaseValueLabel") {
              const labelType = infer(label.value);
              if (!areComparable(selectorType, labelType)) report("PC4015", "CASE-001", "type.case.labelMismatch", label.range);
            } else {
              const lowerType = infer(label.lower);
              const upperType = infer(label.upper);
              if (!areComparable(selectorType, lowerType) || !areComparable(selectorType, upperType)) {
                report("PC4015", "CASE-001", "type.case.rangeMismatch", label.range);
              }
            }
          });
          checkWithRestoredFileModes(() => checkStatements(clause.body, context));
        });
        break;
      }
      case "ForStatement": {
        const controlType = infer(statement.control);
        if (!isPrimitive(controlType, "INTEGER") && controlType.kind !== "unknown") {
          report("PC4014", "FOR-001", "type.for.controlRequiresInteger", statement.control.range);
        }
        const controlSymbol = rootSymbol(statement.control, references);
        if (controlSymbol && !controlSymbol.mutable) {
          report("PC4009", "ASSIGN-003", "type.assignment.constantTarget", statement.control.range);
        }
        requireInteger(statement.startValue, "FOR-001", "type.for.startRequiresInteger");
        requireInteger(statement.endValue, "FOR-001", "type.for.endRequiresInteger");
        if (statement.step) {
          requireInteger(statement.step, "FOR-001", "type.for.stepRequiresInteger");
          if (integerLiteral(statement.step) === 0) {
            report("PC4016", "FOR-002", "type.for.stepCannotBeZero", statement.step.range, "Editor Runtime");
          }
        }
        checkWithRestoredFileModes(() => checkStatements(statement.body, context));
        break;
      }
      case "WhileStatement":
        requireBoolean(statement.condition, "WHILE-001");
        checkWithRestoredFileModes(() => checkStatements(statement.body, context));
        break;
      case "RepeatStatement":
        checkWithRestoredFileModes(() => checkStatements(statement.body, context));
        requireBoolean(statement.condition, "REPEAT-001");
        break;
      case "CallStatement": {
        const targetType = infer(statement.target);
        const argumentTypes = statement.arguments.map(infer);
        if (targetType.kind === "function") {
          report("PC4020", "FUNC-002", "type.function.cannotUseCall", statement.target.range);
          validateArguments(statement.arguments, argumentTypes, targetType.parameters, "PROC-002", report, references, statement.range);
        } else if (targetType.kind === "procedure") {
          validateArguments(statement.arguments, argumentTypes, targetType.parameters, "PROC-002", report, references, statement.range);
        }
        break;
      }
      case "ReturnStatement": {
        const valueType = infer(statement.value);
        if (!context || context.kind !== "function" || !context.returnType) {
          report("PC4021", "FUNC-001", "type.return.outsideFunction", statement.range);
        } else if (!isAssignable(context.returnType, valueType)) {
          report("PC4021", "FUNC-001", "type.return.incompatible", statement.value.range, "CAIE", {
            expected: displayType(context.returnType),
            actual: displayType(valueType)
          });
        }
        break;
      }
      case "ProcedureDeclaration":
        statement.parameters.forEach((parameter) => checkTypeReference(parameter.typeReference, infer, report, resolveNamed));
        checkWithRestoredFileModes(() => checkStatements(statement.body, { kind: "procedure" }), true);
        break;
      case "FunctionDeclaration": {
        statement.parameters.forEach((parameter) => checkTypeReference(parameter.typeReference, infer, report, resolveNamed));
        checkTypeReference(statement.returnType, infer, report, resolveNamed);
        const returnType = typeFromReference(statement.returnType, resolveNamed);
        checkWithRestoredFileModes(() => checkStatements(statement.body, { kind: "function", returnType, declaration: statement }), true);
        if (!blockGuaranteesReturn(statement.body)) {
          report(
            "PC4022",
            "FUNC-001",
            "type.function.notAllPathsReturn",
            statement.nameRange,
            "Editor Runtime",
            { name: statement.name },
            [{ messageKey: "type.function.declaration", range: statement.range }]
          );
        }
        break;
      }
      case "ErrorStatement": break;
    }
  };
  checkStatements(program.body);

  return { expressionTypes, diagnostics };
}

function checkTypeReference(
  reference: TypeReference,
  infer: (expression: Expression) => Type,
  report: (code: string, ruleId: string, messageKey: string, range: SourceRange, origin?: Diagnostic["origin"], args?: Diagnostic["args"], related?: Diagnostic["related"]) => void,
  resolveNamed?: (normalizedName: string) => Type | undefined
): void {
  if (reference.kind === "NamedTypeReference") {
    if (resolveNamed && !resolveNamed(reference.normalizedName)) {
      report("PC4026", "UDT-005", "type.named.unknownType", reference.range, "CAIE", { name: reference.name });
    }
    return;
  }
  if (reference.kind !== "ArrayTypeReference") return;
  for (const dimension of reference.dimensions) {
    const lowerType = infer(dimension.lower);
    const upperType = infer(dimension.upper);
    if ((!isPrimitive(lowerType, "INTEGER") && lowerType.kind !== "unknown")
      || (!isPrimitive(upperType, "INTEGER") && upperType.kind !== "unknown")) {
      report("PC4007", "ARRAY-002", "type.arrayBounds.requireIntegers", dimension.range);
    }
    const lower = integerLiteral(dimension.lower);
    const upper = integerLiteral(dimension.upper);
    if (lower !== undefined && upper !== undefined && lower > upper) {
      report("PC4012", "ARRAY-002", "type.arrayBounds.invalidOrder", dimension.range, "Editor Runtime", { lower, upper });
    }
  }
  checkTypeReference(reference.elementType, infer, report, resolveNamed);
}

function rootSymbol(expression: Expression, references: Map<number, SymbolInfo>): SymbolInfo | undefined {
  if (expression.kind === "NameExpression") return references.get(expression.range.start.offset);
  if (expression.kind === "IndexExpression" || expression.kind === "MemberExpression") return rootSymbol(expression.target, references);
  if (expression.kind === "UnaryExpression") return rootSymbol(expression.operand, references);
  return undefined;
}

function integerLiteral(expression: Expression): number | undefined {
  return expression.kind === "LiteralExpression" && expression.literalType === "INTEGER" ? expression.value as number : undefined;
}

function literalFileName(expression: Expression): string | undefined {
  return expression.kind === "LiteralExpression" && expression.literalType === "STRING" ? expression.value as string : undefined;
}

function normalizeFileName(name: string): string { return name.toLocaleUpperCase("en-US"); }

function isPrimitive(type: Type, name: string): boolean {
  return type.kind === "primitive" && type.name === name;
}

function isNumeric(type: Type): boolean {
  return isPrimitive(type, "INTEGER") || isPrimitive(type, "REAL");
}

function areComparable(left: Type, right: Type): boolean {
  if (left.kind === "unknown" || right.kind === "unknown") return true;
  if (isNumeric(left) && isNumeric(right)) return true;
  if (left.kind === "enum" && right.kind === "enum") return left.normalizedName === right.normalizedName;
  return left.kind === "primitive" && right.kind === "primitive" && left.name === right.name;
}

function isAssignable(target: Type, value: Type): boolean {
  if (target.kind === "unknown" || value.kind === "unknown") return true;
  if (target.kind === "primitive" && value.kind === "primitive") {
    return target.name === value.name || (target.name === "REAL" && value.name === "INTEGER");
  }
  if (target.kind === "named" && value.kind === "named") return target.normalizedName === value.normalizedName;
  if (target.kind === "record" && value.kind === "record") return target.normalizedName === value.normalizedName;
  if (target.kind === "enum" && value.kind === "enum") return target.normalizedName === value.normalizedName;
  if (target.kind === "pointer" && value.kind === "pointer") return isAssignable(target.target, value.target);
  if (target.kind === "set" && value.kind === "set") return target.normalizedName === value.normalizedName;
  if (target.kind === "class" && value.kind === "class") {
    for (let current: ClassType | undefined = value; current; current = current.base) {
      if (current.normalizedName === target.normalizedName) return true;
    }
    return false;
  }
  if (target.kind === "array" && value.kind === "array") {
    return target.dimensions.length === value.dimensions.length
      && target.dimensions.every((dimension, index) => dimension.lower === value.dimensions[index].lower && dimension.upper === value.dimensions[index].upper)
      && isAssignable(target.elementType, value.elementType);
  }
  return false;
}

function validateArguments(
  expressions: Expression[],
  types: Type[],
  parameters: RoutineParameterType[],
  ruleId: string,
  report: (code: string, ruleId: string, messageKey: string, range: SourceRange, origin?: Diagnostic["origin"], args?: Diagnostic["args"]) => void,
  references: Map<number, SymbolInfo>,
  /** 一个实参都没写时，提示要落在调用那一行上——否则它会掉到第 1 行去。 */
  callSiteRange: SourceRange
): void {
  const callRange = expressions.length > 0
    ? { start: expressions[0].range.start, end: expressions.at(-1)!.range.end }
    : callSiteRange;
  if (expressions.length !== parameters.length) {
    report("PC4010", ruleId, "type.call.argumentCount", callRange, "CAIE", { expected: parameters.length, actual: expressions.length });
  }
  expressions.forEach((expression, index) => {
    const parameter = parameters[index];
    if (!parameter) return;
    if (parameter.mode === "BYREF") {
      const symbol = rootSymbol(expression, references);
      if (!isWritableExpression(expression) || (symbol && !symbol.mutable)) {
        report("PC4023", "PARAM-001", "type.byref.requiresWritableArgument", expression.range, "Editor Runtime");
        return;
      }
      if (!isAssignable(parameter.type, types[index]) || !isAssignable(types[index], parameter.type)) {
        report("PC4011", ruleId, "type.call.byrefArgumentType", expression.range);
      }
    } else if (!isAssignable(parameter.type, types[index])) {
      report("PC4011", ruleId, "type.call.argumentType", expression.range);
    }
  });
}

function isWritableExpression(expression: Expression): boolean {
  if (expression.kind === "NameExpression") return true;
  if (expression.kind === "IndexExpression" || expression.kind === "MemberExpression") return isWritableExpression(expression.target);
  return expression.kind === "UnaryExpression" && expression.postfix === true && expression.operator === "^";
}

function blockGuaranteesReturn(statements: Statement[]): boolean {
  return statements.some(statementGuaranteesReturn);
}

function statementGuaranteesReturn(statement: Statement): boolean {
  if (statement.kind === "ReturnStatement") return true;
  if (statement.kind === "IfStatement") {
    return statement.elseBranch.length > 0
      && blockGuaranteesReturn(statement.thenBranch)
      && blockGuaranteesReturn(statement.elseBranch);
  }
  if (statement.kind === "CaseStatement") {
    return statement.clauses.some(({ isOtherwise }) => isOtherwise)
      && statement.clauses.length > 0
      && statement.clauses.every((clause) => blockGuaranteesReturn(clause.body));
  }
  if (statement.kind === "RepeatStatement") return blockGuaranteesReturn(statement.body);
  return false;
}

function displayType(type: Type): string {
  if (type.kind === "primitive") return type.name;
  if (type.kind === "named") return type.name;
  if (type.kind === "enum") return type.name;
  if (type.kind === "pointer") return `^${displayType(type.target)}`;
  if (type.kind === "set") return type.name;
  if (type.kind === "class") return type.name;
  if (type.kind === "record") return type.name;
  if (type.kind === "array") return "ARRAY";
  if (type.kind === "function") return "FUNCTION";
  if (type.kind === "procedure") return "PROCEDURE";
  return "UNKNOWN";
}

function findClassMember(type: ClassType, normalizedName: string): ClassMemberType | undefined {
  return type.members.find((member) => member.normalizedName === normalizedName)
    ?? (type.base ? findClassMember(type.base, normalizedName) : undefined);
}
