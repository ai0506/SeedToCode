import { BUILTINS, isBuiltin } from "@caie-pseudocode/caie-spec";
import type {
  ClassDeclaration,
  EnumTypeDeclaration,
  Expression,
  Parameter,
  PointerTypeDeclaration,
  Program,
  RecordTypeDeclaration,
  SetTypeDeclaration,
  Statement,
  TypeReference
} from "./ast.js";
import type {
  BindResult,
  BoundReference,
  ClassMemberType,
  ClassType,
  EnumType,
  PointerType,
  RecordType,
  SetType,
  RoutineParameterType,
  SymbolInfo,
  Type
} from "./semantic-types.js";
import type { Diagnostic } from "./types.js";

export type BindOptions = { maxDiagnostics?: number };
export type NamedTypeResolver = (normalizedName: string) => Type | undefined;

const UNKNOWN_TYPE: Type = Object.freeze({ kind: "unknown" });

function typeFromReference(reference: TypeReference, resolveNamed?: NamedTypeResolver): Type {
  switch (reference.kind) {
    case "PrimitiveTypeReference": return { kind: "primitive", name: reference.name };
    case "NamedTypeReference": return resolveNamed?.(reference.normalizedName)
      ?? { kind: "named", name: reference.name, normalizedName: reference.normalizedName };
    case "ArrayTypeReference": return {
      kind: "array",
      dimensions: reference.dimensions.map(({ lower, upper }) => ({ lower: integerLiteral(lower), upper: integerLiteral(upper) })),
      elementType: typeFromReference(reference.elementType, resolveNamed)
    };
    case "ErrorTypeReference": return UNKNOWN_TYPE;
  }
}

function integerLiteral(expression: Expression): number | undefined {
  return expression.kind === "LiteralExpression" && expression.literalType === "INTEGER" ? expression.value as number : undefined;
}

function constantType(expression: Expression): Type {
  return expression.kind === "LiteralExpression" ? { kind: "primitive", name: expression.literalType } : UNKNOWN_TYPE;
}

function parameterTypes(parameters: Parameter[], resolveNamed: NamedTypeResolver): RoutineParameterType[] {
  return parameters.map((parameter) => ({
    name: parameter.name,
    mode: parameter.mode,
    type: typeFromReference(parameter.typeReference, resolveNamed)
  }));
}

function builtinSymbols(): SymbolInfo[] {
  const symbols: SymbolInfo[] = BUILTINS.map((builtin) => ({
    name: builtin.name,
    normalizedName: builtin.name,
    kind: "function",
    type: {
      kind: "function",
      parameters: builtin.parameters.map((name, index) => ({
        name: `arg${index + 1}`,
        mode: "BYVAL",
        type: { kind: "primitive", name } as Type
      })),
      returns: { kind: "primitive", name: builtin.returns } as Type
    },
    declaration: { start: { offset: 0, line: 1, column: 1 }, end: { offset: 0, line: 1, column: 1 } },
    scopeId: "builtin",
    mutable: false
  }));
  symbols.push({
    name: "EOF",
    normalizedName: "EOF",
    kind: "function",
    type: {
      kind: "function",
      parameters: [{ name: "file", mode: "BYVAL", type: { kind: "primitive", name: "STRING" } }],
      returns: { kind: "primitive", name: "BOOLEAN" }
    },
    declaration: { start: { offset: 0, line: 1, column: 1 }, end: { offset: 0, line: 1, column: 1 } },
    scopeId: "builtin",
    mutable: false
  });
  return symbols;
}

type Scope = { id: string; symbols: Map<string, SymbolInfo>; parent?: Scope };

export function bind(program: Program, options: BindOptions = {}): BindResult {
  const maxDiagnostics = Math.max(1, options.maxDiagnostics ?? 50);
  const diagnostics: Diagnostic[] = [];
  const symbols: SymbolInfo[] = [];
  const references: BoundReference[] = [];
  const globalScope: Scope = { id: "global", symbols: new Map() };
  const builtins = new Map(builtinSymbols().map((symbol) => [symbol.normalizedName, symbol]));

  const report = (diagnostic: Diagnostic): void => {
    if (diagnostics.length < maxDiagnostics) diagnostics.push(diagnostic);
  };

  const add = (scope: Scope, symbol: SymbolInfo): boolean => {
    const existing = scope.symbols.get(symbol.normalizedName);
    if (existing) {
      report({
        code: "PC3001",
        ruleId: "ID-003",
        severity: "error",
        origin: "CAIE",
        messageKey: "binding.duplicateDeclaration",
        args: { name: symbol.name },
        range: symbol.declaration,
        related: [{ messageKey: "binding.firstDeclaration", range: existing.declaration }]
      });
      return false;
    }
    if (isBuiltin(symbol.normalizedName) || symbol.normalizedName === "EOF") {
      report({
        code: "PC3002",
        ruleId: "ID-002",
        severity: "error",
        origin: "CAIE",
        messageKey: "binding.reservedName",
        args: { name: symbol.name },
        range: symbol.declaration
      });
      return false;
    }
    scope.symbols.set(symbol.normalizedName, symbol);
    symbols.push(symbol);
    return true;
  };

  const recordTypes = new Map<RecordTypeDeclaration, RecordType>();
  const enumTypes = new Map<EnumTypeDeclaration, EnumType>();
  const pointerTypes = new Map<PointerTypeDeclaration, PointerType>();
  const classTypes = new Map<ClassDeclaration, ClassType>();
  const setTypes = new Map<SetTypeDeclaration, SetType>();
  for (const statement of program.body) {
    if (statement.kind !== "RecordTypeDeclaration"
      && statement.kind !== "EnumTypeDeclaration"
      && statement.kind !== "PointerTypeDeclaration"
      && statement.kind !== "ClassDeclaration"
      && statement.kind !== "SetTypeDeclaration") continue;
    const declaredType: RecordType | EnumType | PointerType | ClassType | SetType = statement.kind === "RecordTypeDeclaration"
      ? { kind: "record", name: statement.name, normalizedName: statement.normalizedName, fields: [] }
      : statement.kind === "EnumTypeDeclaration"
        ? { kind: "enum", name: statement.name, normalizedName: statement.normalizedName, members: statement.members.map(({ normalizedName }) => normalizedName) }
        : statement.kind === "PointerTypeDeclaration"
          ? { kind: "pointer", target: UNKNOWN_TYPE }
          : statement.kind === "ClassDeclaration"
            ? { kind: "class", name: statement.name, normalizedName: statement.normalizedName, members: [] }
            : { kind: "set", name: statement.name, normalizedName: statement.normalizedName, elementType: UNKNOWN_TYPE };
    if (add(globalScope, {
      name: statement.name,
      normalizedName: statement.normalizedName,
      kind: "type",
      type: declaredType,
      declaration: statement.nameRange,
      scopeId: "global",
      mutable: false
    })) {
      if (statement.kind === "RecordTypeDeclaration") recordTypes.set(statement, declaredType as RecordType);
      else if (statement.kind === "EnumTypeDeclaration") enumTypes.set(statement, declaredType as EnumType);
      else if (statement.kind === "PointerTypeDeclaration") pointerTypes.set(statement, declaredType as PointerType);
      else if (statement.kind === "ClassDeclaration") classTypes.set(statement, declaredType as ClassType);
      else setTypes.set(statement, declaredType as SetType);
    }
  }

  const resolveNamed: NamedTypeResolver = (normalizedName) => {
    const symbol = globalScope.symbols.get(normalizedName);
    return symbol?.kind === "type" ? symbol.type : undefined;
  };

  for (const [declaration, recordType] of recordTypes) {
    const fieldScope: Scope = {
      id: `record:${declaration.normalizedName}@${declaration.nameRange.start.offset}`,
      symbols: new Map()
    };
    for (const field of declaration.fields) {
      const fieldType = typeFromReference(field.typeReference, resolveNamed);
      const symbol: SymbolInfo = {
        name: field.name,
        normalizedName: field.normalizedName,
        kind: "field",
        type: fieldType,
        declaration: field.nameRange,
        scopeId: fieldScope.id,
        mutable: true
      };
      if (add(fieldScope, symbol)) {
        recordType.fields.push({
          name: field.name,
          normalizedName: field.normalizedName,
          type: fieldType,
          declaration: field.nameRange
        });
      }
    }
  }

  for (const [declaration, enumType] of enumTypes) {
    for (const member of declaration.members) {
      add(globalScope, {
        name: member.name,
        normalizedName: member.normalizedName,
        kind: "constant",
        type: enumType,
        declaration: member.nameRange,
        scopeId: "global",
        mutable: false
      });
    }
  }

  for (const [declaration, pointerType] of pointerTypes) {
    pointerType.target = typeFromReference(declaration.targetType, resolveNamed);
  }

  for (const [declaration, setType] of setTypes) {
    setType.elementType = typeFromReference(declaration.elementType, resolveNamed);
  }

  for (const [declaration, classType] of classTypes) {
    if (declaration.normalizedBaseName) {
      const base = resolveNamed(declaration.normalizedBaseName);
      if (base?.kind === "class") {
        let circular = false;
        for (let current: ClassType | undefined = base; current; current = current.base) {
          if (current === classType) {
            circular = true;
            break;
          }
        }
        if (circular) {
          report({
            code: "PC4033", ruleId: "OOP-002", severity: "error", origin: "CAIE",
            messageKey: "binding.class.circularInheritance", args: { name: declaration.name },
            range: declaration.baseNameRange ?? declaration.nameRange
          });
        } else classType.base = base;
      }
      else report({
        code: "PC4032", ruleId: "OOP-002", severity: "error", origin: "CAIE",
        messageKey: "binding.class.unknownBase", args: { name: declaration.baseName ?? "" },
        range: declaration.baseNameRange ?? declaration.nameRange
      });
    }
    for (const member of declaration.members) {
      const memberType: ClassMemberType = member.kind === "ClassField"
        ? {
          name: member.name, normalizedName: member.normalizedName, kind: "field", access: member.access,
          ownerNormalizedName: declaration.normalizedName,
          type: typeFromReference(member.typeReference, resolveNamed), declaration: member.nameRange
        }
        : member.kind === "ProcedureDeclaration"
          ? {
            name: member.name, normalizedName: member.normalizedName, kind: "procedure", access: member.access ?? "PUBLIC",
            ownerNormalizedName: declaration.normalizedName,
            type: { kind: "procedure", parameters: parameterTypes(member.parameters, resolveNamed) }, declaration: member.nameRange
          }
          : {
            name: member.name, normalizedName: member.normalizedName, kind: "function", access: member.access ?? "PUBLIC",
            ownerNormalizedName: declaration.normalizedName,
            type: {
              kind: "function", parameters: parameterTypes(member.parameters, resolveNamed),
              returns: typeFromReference(member.returnType, resolveNamed)
            }, declaration: member.nameRange
          };
      if (classType.members.some(({ normalizedName }) => normalizedName === memberType.normalizedName)) {
        report({
          code: "PC3001", ruleId: "OOP-001", severity: "error", origin: "CAIE",
          messageKey: "binding.duplicateDeclaration", args: { name: memberType.name }, range: memberType.declaration
        });
      } else classType.members.push(memberType);
    }
  }

  for (const statement of program.body) {
    if (statement.kind !== "ProcedureDeclaration" && statement.kind !== "FunctionDeclaration") continue;
    add(globalScope, {
      name: statement.name,
      normalizedName: statement.normalizedName,
      kind: statement.kind === "ProcedureDeclaration" ? "procedure" : "function",
      type: statement.kind === "ProcedureDeclaration"
        ? { kind: "procedure", parameters: parameterTypes(statement.parameters, resolveNamed) }
        : {
          kind: "function",
          parameters: parameterTypes(statement.parameters, resolveNamed),
          returns: typeFromReference(statement.returnType, resolveNamed)
        },
      declaration: statement.nameRange,
      scopeId: "global",
      mutable: false
    });
  }

  const declarationSymbol = (statement: Extract<Statement, { kind: "DeclareStatement" | "ConstantStatement" }>, scope: Scope): SymbolInfo => ({
    name: statement.name,
    normalizedName: statement.normalizedName,
    kind: statement.kind === "DeclareStatement" ? "variable" : "constant",
    type: statement.kind === "DeclareStatement" ? typeFromReference(statement.typeReference, resolveNamed) : constantType(statement.value),
    declaration: statement.nameRange,
    scopeId: scope.id,
    mutable: statement.kind === "DeclareStatement"
  });

  const collectOrdinary = (statements: Statement[], scope: Scope): void => {
    for (const statement of statements) {
      if (statement.kind === "DeclareStatement" || statement.kind === "ConstantStatement") add(scope, declarationSymbol(statement, scope));
      if (statement.kind === "DefineSetStatement") add(scope, {
        name: statement.name,
        normalizedName: statement.normalizedName,
        kind: "constant",
        type: typeFromReference(statement.typeReference, resolveNamed),
        declaration: statement.nameRange,
        scopeId: scope.id,
        mutable: false
      });
      if (statement.kind === "ForStatement" && statement.control.normalizedName && !scope.symbols.has(statement.control.normalizedName)) {
        add(scope, {
          name: statement.control.name,
          normalizedName: statement.control.normalizedName,
          kind: "variable",
          type: { kind: "primitive", name: "INTEGER" },
          declaration: statement.control.range,
          scopeId: scope.id,
          mutable: true
        });
      }
      if (statement.kind === "IfStatement") {
        collectOrdinary(statement.thenBranch, scope);
        collectOrdinary(statement.elseBranch, scope);
      } else if (statement.kind === "CaseStatement") {
        statement.clauses.forEach((clause) => collectOrdinary(clause.body, scope));
      } else if (statement.kind === "ForStatement" || statement.kind === "WhileStatement" || statement.kind === "RepeatStatement") {
        collectOrdinary(statement.body, scope);
      }
    }
  };

  collectOrdinary(program.body.filter((statement) =>
    statement.kind !== "ProcedureDeclaration"
    && statement.kind !== "FunctionDeclaration"
    && statement.kind !== "RecordTypeDeclaration"
    && statement.kind !== "EnumTypeDeclaration"
    && statement.kind !== "PointerTypeDeclaration"
    && statement.kind !== "ClassDeclaration"
    && statement.kind !== "SetTypeDeclaration"), globalScope);

  const routineScopes = new Map<Statement, Scope>();
  for (const statement of program.body) {
    if (statement.kind !== "ProcedureDeclaration" && statement.kind !== "FunctionDeclaration") continue;
    const scope: Scope = { id: `routine:${statement.normalizedName}@${statement.nameRange.start.offset}`, symbols: new Map(), parent: globalScope };
    routineScopes.set(statement, scope);
    for (const parameter of statement.parameters) {
      add(scope, {
        name: parameter.name,
        normalizedName: parameter.normalizedName,
        kind: "parameter",
        type: typeFromReference(parameter.typeReference, resolveNamed),
        declaration: parameter.nameRange,
        scopeId: scope.id,
        mutable: true
      });
    }
    collectOrdinary(statement.body, scope);
  }

  for (const [declaration, classType] of classTypes) {
    const classScope: Scope = {
      id: `class:${declaration.normalizedName}@${declaration.nameRange.start.offset}`,
      symbols: new Map(),
      parent: globalScope
    };
    const inherited: ClassMemberType[] = [];
    for (let base = classType.base; base; base = base.base) inherited.push(...base.members);
    for (const member of inherited.reverse()) {
      classScope.symbols.set(member.normalizedName, {
        name: member.name, normalizedName: member.normalizedName,
        kind: member.kind === "field" ? "field" : member.kind,
        type: member.type, declaration: member.declaration, scopeId: classScope.id,
        mutable: member.kind === "field"
      });
    }
    for (const member of classType.members) {
      classScope.symbols.set(member.normalizedName, {
        name: member.name, normalizedName: member.normalizedName,
        kind: member.kind === "field" ? "field" : member.kind,
        type: member.type, declaration: member.declaration, scopeId: classScope.id,
        mutable: member.kind === "field"
      });
    }
    if (classType.base) {
      classScope.symbols.set("SUPER", {
        name: "SUPER", normalizedName: "SUPER", kind: "variable", type: classType.base,
        declaration: declaration.baseNameRange ?? declaration.nameRange,
        scopeId: classScope.id, mutable: false
      });
    }
    for (const member of declaration.members) {
      if (member.kind !== "ProcedureDeclaration" && member.kind !== "FunctionDeclaration") continue;
      const scope: Scope = {
        id: `method:${declaration.normalizedName}.${member.normalizedName}@${member.nameRange.start.offset}`,
        symbols: new Map(), parent: classScope
      };
      routineScopes.set(member, scope);
      for (const parameter of member.parameters) {
        add(scope, {
          name: parameter.name, normalizedName: parameter.normalizedName, kind: "parameter",
          type: typeFromReference(parameter.typeReference, resolveNamed), declaration: parameter.nameRange,
          scopeId: scope.id, mutable: true
        });
      }
      collectOrdinary(member.body, scope);
    }
  }

  const resolve = (name: string, scope: Scope): SymbolInfo | undefined => {
    for (let current: Scope | undefined = scope; current; current = current.parent) {
      const symbol = current.symbols.get(name);
      if (symbol && symbol.kind !== "type") return symbol;
    }
    return builtins.get(name);
  };

  const visit = (expression: Expression, scope: Scope): void => {
    switch (expression.kind) {
      case "NameExpression": {
        const symbol = resolve(expression.normalizedName, scope);
        references.push({ name: expression.name, normalizedName: expression.normalizedName, range: expression.range, ...(symbol ? { symbol } : {}) });
        if (!symbol) {
          report({
            code: "PC3003",
            ruleId: "DECL-002",
            severity: "error",
            origin: "Editor Runtime",
            messageKey: "binding.unboundName",
            args: { name: expression.name },
            range: expression.range
          });
        }
        break;
      }
      case "UnaryExpression": visit(expression.operand, scope); break;
      case "BinaryExpression": visit(expression.left, scope); visit(expression.right, scope); break;
      case "CallExpression": visit(expression.callee, scope); expression.arguments.forEach((argument) => visit(argument, scope)); break;
      case "NewExpression": expression.arguments.forEach((argument) => visit(argument, scope)); break;
      case "IndexExpression": visit(expression.target, scope); expression.indices.forEach((index) => visit(index, scope)); break;
      case "MemberExpression": visit(expression.target, scope); break;
      case "ErrorExpression": if (expression.recovered) visit(expression.recovered, scope); break;
      case "LiteralExpression": break;
    }
  };

  const visitTypeReference = (reference: TypeReference, scope: Scope): void => {
    if (reference.kind !== "ArrayTypeReference") return;
    reference.dimensions.forEach(({ lower, upper }) => { visit(lower, scope); visit(upper, scope); });
    visitTypeReference(reference.elementType, scope);
  };

  const bindStatements = (statements: Statement[], scope: Scope): void => {
    for (const statement of statements) switch (statement.kind) {
      case "AssignmentStatement": visit(statement.target, scope); visit(statement.value, scope); break;
      case "InputStatement": visit(statement.target, scope); break;
      case "OutputStatement": statement.values.forEach((value) => visit(value, scope)); break;
      case "OpenFileStatement": visit(statement.file, scope); break;
      case "ReadFileStatement": visit(statement.file, scope); visit(statement.target, scope); break;
      case "WriteFileStatement": visit(statement.file, scope); visit(statement.data, scope); break;
      case "CloseFileStatement": visit(statement.file, scope); break;
      case "SeekStatement": visit(statement.file, scope); visit(statement.address, scope); break;
      case "GetRecordStatement": visit(statement.file, scope); visit(statement.target, scope); break;
      case "PutRecordStatement": visit(statement.file, scope); visit(statement.data, scope); break;
      case "ConstantStatement": visit(statement.value, scope); break;
      case "DeclareStatement": visitTypeReference(statement.typeReference, scope); break;
      case "RecordTypeDeclaration": statement.fields.forEach((field) => visitTypeReference(field.typeReference, scope)); break;
      case "PointerTypeDeclaration": visitTypeReference(statement.targetType, scope); break;
      case "EnumTypeDeclaration": break;
      case "SetTypeDeclaration": visitTypeReference(statement.elementType, scope); break;
      case "DefineSetStatement":
        statement.values.forEach((value) => visit(value, scope));
        visitTypeReference(statement.typeReference, scope);
        break;
      case "ClassDeclaration":
        statement.members.forEach((member) => {
          if (member.kind === "ClassField") visitTypeReference(member.typeReference, scope);
          else {
            const methodScope = routineScopes.get(member);
            if (methodScope) bindStatements(member.body, methodScope);
          }
        });
        break;
      case "MethodCallStatement": visit(statement.call, scope); break;
      case "IfStatement": visit(statement.condition, scope); bindStatements(statement.thenBranch, scope); bindStatements(statement.elseBranch, scope); break;
      case "CaseStatement":
        visit(statement.selector, scope);
        statement.clauses.forEach((clause) => {
          clause.labels.forEach((label) => label.kind === "CaseValueLabel"
            ? visit(label.value, scope)
            : (visit(label.lower, scope), visit(label.upper, scope)));
          bindStatements(clause.body, scope);
        });
        break;
      case "ForStatement":
        visit(statement.control, scope); visit(statement.startValue, scope); visit(statement.endValue, scope);
        if (statement.step) visit(statement.step, scope);
        bindStatements(statement.body, scope);
        break;
      case "WhileStatement": visit(statement.condition, scope); bindStatements(statement.body, scope); break;
      case "RepeatStatement": bindStatements(statement.body, scope); visit(statement.condition, scope); break;
      case "CallStatement": visit(statement.target, scope); statement.arguments.forEach((argument) => visit(argument, scope)); break;
      case "ReturnStatement": visit(statement.value, scope); break;
      case "ProcedureDeclaration":
      case "FunctionDeclaration": {
        const routineScope = routineScopes.get(statement);
        if (routineScope) bindStatements(statement.body, routineScope);
        break;
      }
      case "ErrorStatement": break;
    }
  };

  bindStatements(program.body, globalScope);
  return { symbols, references, diagnostics };
}

export { UNKNOWN_TYPE, typeFromReference };
