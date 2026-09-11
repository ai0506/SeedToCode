import type {
  Expression,
  Parameter,
  Program,
  Statement,
  TypeReference
} from "@caie-pseudocode/language";

/**
 * 语法特征 ID。
 *
 * 用途有两个：
 *  1. 题目的构造约束（必须用 / 不能用某种写法）；
 *  2. 知识点闸门——教学示例、参考解和学生解答都不得使用当前小节之后才教的特征。
 *
 * 一律从 AST 统计，不做源码文本匹配：注释与字符串里出现 `FOR` 不会被误判。
 *
 * ID 一旦发布不得改名，否则已写好的题目会失效。当前覆盖到 Chapter 1 需要的范围，
 * 其余分类先占位，后续按需补齐提取逻辑（见 teaching/03-EXERCISE_SPEC.md 3.2）。
 */
export const FEATURE_IDS = [
  // 输入输出
  "io.input",
  "io.output",
  // 声明
  "decl.variable",
  "decl.constant",
  "decl.array-1d",
  "decl.array-2d",
  "decl.record-type",
  "decl.enum",
  "decl.pointer",
  "decl.set",
  "decl.class",
  // 基本类型与字面量（Chapter 2 起的知识点闸门）
  "type.integer",
  "type.real",
  "type.char",
  "type.string",
  "type.boolean",
  "type.date",
  "literal.integer",
  "literal.real",
  "literal.char",
  "literal.string",
  "literal.boolean",
  "literal.date",
  // 赋值与表达式
  "assign.simple",
  "expr.function-call",
  "array.index",
  "array.index-2d",
  "record.field-access",
  // 运算
  "op.arithmetic",
  "op.div",
  "op.mod",
  "op.concat",
  "op.relational",
  "op.and",
  "op.or",
  "op.not",
  // 选择
  "select.if",
  "select.if-else",
  "select.nested-if",
  "select.case",
  "select.case-otherwise",
  "select.case-range",
  // 循环
  "loop.for",
  "loop.for-step",
  "loop.while",
  "loop.repeat",
  "loop.nested",
  // 模块
  "routine.procedure",
  "routine.function",
  "routine.call",
  "routine.return",
  "param.byval",
  "param.byref",
  // 内置函数
  "builtin.length",
  "builtin.mid",
  "builtin.right",
  "builtin.lcase",
  "builtin.ucase",
  "builtin.int",
  "builtin.rand",
  "builtin.eof",
  // 文件
  "file.open-read",
  "file.open-write",
  "file.open-append",
  "file.open-random",
  "file.read",
  "file.write",
  "file.close",
  "file.seek",
  "file.getrecord",
  "file.putrecord",
  // 面向对象
  "oop.new",
  "oop.inherits",
  "oop.super",
  "oop.method-call",
  // 其它
  "misc.comment"
] as const;

export type FeatureId = (typeof FEATURE_IDS)[number];

const BUILTIN_FEATURES: Record<string, FeatureId> = {
  length: "builtin.length",
  mid: "builtin.mid",
  right: "builtin.right",
  lcase: "builtin.lcase",
  ucase: "builtin.ucase",
  int: "builtin.int",
  rand: "builtin.rand",
  eof: "builtin.eof"
};

const OPERATOR_FEATURES: Record<string, FeatureId> = {
  "+": "op.arithmetic",
  "-": "op.arithmetic",
  "*": "op.arithmetic",
  "/": "op.arithmetic",
  DIV: "op.div",
  MOD: "op.mod",
  "&": "op.concat",
  "=": "op.relational",
  "<>": "op.relational",
  "<": "op.relational",
  "<=": "op.relational",
  ">": "op.relational",
  ">=": "op.relational",
  AND: "op.and",
  OR: "op.or"
};

const TYPE_FEATURES: Record<string, FeatureId> = {
  INTEGER: "type.integer",
  REAL: "type.real",
  CHAR: "type.char",
  STRING: "type.string",
  BOOLEAN: "type.boolean",
  DATE: "type.date"
};

const LITERAL_FEATURES: Record<string, FeatureId> = {
  INTEGER: "literal.integer",
  REAL: "literal.real",
  CHAR: "literal.char",
  STRING: "literal.string",
  BOOLEAN: "literal.boolean",
  DATE: "literal.date"
};

/** 统计一段程序用到的全部语法特征。 */
export function extractFeatures(program: Program): Set<FeatureId> {
  const found = new Set<FeatureId>();
  const add = (id: FeatureId) => found.add(id);

  if (program.comments.length > 0) add("misc.comment");
  walkStatements(program.body, add, 0);
  return found;
}

function walkStatements(body: Statement[], add: (id: FeatureId) => void, loopDepth: number): void {
  for (const statement of body) walkStatement(statement, add, loopDepth);
}

function walkStatement(statement: Statement, add: (id: FeatureId) => void, loopDepth: number): void {
  switch (statement.kind) {
    case "InputStatement":
      add("io.input");
      walkExpression(statement.target, add);
      break;
    case "OutputStatement":
      add("io.output");
      for (const value of statement.values) walkExpression(value, add);
      break;
    case "DeclareStatement":
      addTypeFeatures(statement.typeReference, add);
      break;
    case "ConstantStatement":
      add("decl.constant");
      break;
    case "AssignmentStatement":
      add("assign.simple");
      walkExpression(statement.target, add);
      walkExpression(statement.value, add);
      break;
    case "IfStatement": {
      add("select.if");
      if (statement.elseBranch.length > 0) add("select.if-else");
      if (containsIf(statement.thenBranch) || containsIf(statement.elseBranch)) {
        add("select.nested-if");
      }
      walkExpression(statement.condition, add);
      walkStatements(statement.thenBranch, add, loopDepth);
      walkStatements(statement.elseBranch, add, loopDepth);
      break;
    }
    case "CaseStatement": {
      add("select.case");
      walkExpression(statement.selector, add);
      for (const clause of statement.clauses) {
        if (clause.isOtherwise) add("select.case-otherwise");
        for (const label of clause.labels) {
          if (label.kind === "CaseRangeLabel") {
            add("select.case-range");
            walkExpression(label.lower, add);
            walkExpression(label.upper, add);
          } else {
            walkExpression(label.value, add);
          }
        }
        walkStatements(clause.body, add, loopDepth);
      }
      break;
    }
    case "ForStatement":
      add("loop.for");
      if (statement.step) add("loop.for-step");
      if (loopDepth > 0) add("loop.nested");
      walkExpression(statement.startValue, add);
      walkExpression(statement.endValue, add);
      if (statement.step) walkExpression(statement.step, add);
      walkStatements(statement.body, add, loopDepth + 1);
      break;
    case "WhileStatement":
      add("loop.while");
      if (loopDepth > 0) add("loop.nested");
      walkExpression(statement.condition, add);
      walkStatements(statement.body, add, loopDepth + 1);
      break;
    case "RepeatStatement":
      add("loop.repeat");
      if (loopDepth > 0) add("loop.nested");
      walkExpression(statement.condition, add);
      walkStatements(statement.body, add, loopDepth + 1);
      break;
    case "ProcedureDeclaration":
      add("routine.procedure");
      addParameterFeatures(statement.parameters, add);
      walkStatements(statement.body, add, loopDepth);
      break;
    case "FunctionDeclaration":
      add("routine.function");
      addParameterFeatures(statement.parameters, add);
      walkStatements(statement.body, add, loopDepth);
      break;
    case "CallStatement":
      add("routine.call");
      for (const argument of statement.arguments) walkExpression(argument, add);
      break;
    case "ReturnStatement":
      add("routine.return");
      if (statement.value) walkExpression(statement.value, add);
      break;
    case "RecordTypeDeclaration":
      add("decl.record-type");
      for (const field of statement.fields) addTypeFeatures(field.typeReference, add);
      break;
    case "EnumTypeDeclaration":
      add("decl.enum");
      break;
    case "PointerTypeDeclaration":
      add("decl.pointer");
      break;
    case "SetTypeDeclaration":
    case "DefineSetStatement":
      add("decl.set");
      break;
    case "ClassDeclaration":
      add("decl.class");
      if (statement.baseName) add("oop.inherits");
      for (const member of statement.members) {
        if (member.kind === "ClassField") addTypeFeatures(member.typeReference, add);
        else walkStatement(member, add, loopDepth);
      }
      break;
    case "MethodCallStatement":
      add("oop.method-call");
      walkExpression(statement.call, add);
      break;
    case "OpenFileStatement":
      add(
        statement.mode === "READ"
          ? "file.open-read"
          : statement.mode === "WRITE"
            ? "file.open-write"
            : statement.mode === "APPEND"
              ? "file.open-append"
              : "file.open-random"
      );
      walkExpression(statement.file, add);
      break;
    case "ReadFileStatement":
      add("file.read");
      walkExpression(statement.file, add);
      walkExpression(statement.target, add);
      break;
    case "WriteFileStatement":
      add("file.write");
      walkExpression(statement.file, add);
      walkExpression(statement.data, add);
      break;
    case "CloseFileStatement":
      add("file.close");
      walkExpression(statement.file, add);
      break;
    case "SeekStatement":
      add("file.seek");
      walkExpression(statement.file, add);
      walkExpression(statement.address, add);
      break;
    case "GetRecordStatement":
      add("file.getrecord");
      walkExpression(statement.file, add);
      walkExpression(statement.target, add);
      break;
    case "PutRecordStatement":
      add("file.putrecord");
      walkExpression(statement.file, add);
      walkExpression(statement.data, add);
      break;
    default:
      break;
  }
}

function containsIf(body: Statement[]): boolean {
  return body.some((statement) => statement.kind === "IfStatement");
}

function addParameterFeatures(parameters: Parameter[], add: (id: FeatureId) => void): void {
  for (const parameter of parameters) {
    add(parameter.mode === "BYREF" ? "param.byref" : "param.byval");
    addTypeFeatures(parameter.typeReference, add);
  }
}

function addTypeFeatures(reference: TypeReference, add: (id: FeatureId) => void): void {
  if (reference.kind === "ArrayTypeReference") {
    add(reference.dimensions.length >= 2 ? "decl.array-2d" : "decl.array-1d");
    addTypeFeatures(reference.elementType, add);
    return;
  }
  add("decl.variable");
  if (reference.kind === "PrimitiveTypeReference") add(TYPE_FEATURES[reference.name]);
}

function walkExpression(expression: Expression, add: (id: FeatureId) => void): void {
  switch (expression.kind) {
    case "LiteralExpression":
      add(LITERAL_FEATURES[expression.literalType]);
      break;
    case "BinaryExpression": {
      const feature = OPERATOR_FEATURES[expression.operator];
      if (feature) add(feature);
      walkExpression(expression.left, add);
      walkExpression(expression.right, add);
      break;
    }
    case "UnaryExpression":
      if (expression.operator === "NOT") add("op.not");
      else if (expression.operator === "-") add("op.arithmetic");
      walkExpression(expression.operand, add);
      break;
    case "CallExpression": {
      const callee = expression.callee.kind === "NameExpression" ? expression.callee.name.toLowerCase() : "";
      const builtin = BUILTIN_FEATURES[callee];
      if (builtin) add(builtin);
      else add("expr.function-call");
      for (const argument of expression.arguments) walkExpression(argument, add);
      break;
    }
    case "IndexExpression":
      add(expression.indices.length >= 2 ? "array.index-2d" : "array.index");
      walkExpression(expression.target, add);
      for (const index of expression.indices) walkExpression(index, add);
      break;
    case "MemberExpression":
      add("record.field-access");
      walkExpression(expression.target, add);
      break;
    case "NewExpression":
      add("oop.new");
      for (const argument of expression.arguments) walkExpression(argument, add);
      break;
    default:
      break;
  }
}
