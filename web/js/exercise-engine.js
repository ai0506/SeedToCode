"use strict";
var CAIEExercise = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // packages/exercise/src/index.ts
  var index_exports = {};
  __export(index_exports, {
    AHEAD_EXEMPT_FEATURES: () => AHEAD_EXEMPT_FEATURES,
    FEATURE_IDS: () => FEATURE_IDS,
    compareOutputs: () => compareOutputs,
    extractFeatures: () => extractFeatures,
    findCodeNotes: () => findCodeNotes,
    findUnpromptedInputs: () => findUnpromptedInputs,
    grade: () => grade,
    runWithInputs: () => runWithInputs
  });

  // packages/exercise/src/features.ts
  var FEATURE_IDS = [
    // 输入输出
    "io.input",
    "io.output",
    "io.output-variable",
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
  ];
  var AHEAD_EXEMPT_FEATURES = /* @__PURE__ */ new Set(["io.output-variable"]);
  var BUILTIN_FEATURES = {
    length: "builtin.length",
    mid: "builtin.mid",
    right: "builtin.right",
    lcase: "builtin.lcase",
    ucase: "builtin.ucase",
    int: "builtin.int",
    rand: "builtin.rand",
    eof: "builtin.eof"
  };
  var OPERATOR_FEATURES = {
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
  var TYPE_FEATURES = {
    INTEGER: "type.integer",
    REAL: "type.real",
    CHAR: "type.char",
    STRING: "type.string",
    BOOLEAN: "type.boolean",
    DATE: "type.date"
  };
  var LITERAL_FEATURES = {
    INTEGER: "literal.integer",
    REAL: "literal.real",
    CHAR: "literal.char",
    STRING: "literal.string",
    BOOLEAN: "literal.boolean",
    DATE: "literal.date"
  };
  function extractFeatures(program) {
    const found = /* @__PURE__ */ new Set();
    const add = (id) => found.add(id);
    if (program.comments.length > 0) add("misc.comment");
    walkStatements(program.body, add, 0);
    return found;
  }
  function walkStatements(body, add, loopDepth) {
    for (const statement of body) walkStatement(statement, add, loopDepth);
  }
  function walkStatement(statement, add, loopDepth) {
    switch (statement.kind) {
      case "InputStatement":
        add("io.input");
        walkExpression(statement.target, add);
        break;
      case "OutputStatement":
        add("io.output");
        if (statement.values.some((value) => expressionReadsIdentifier(value))) add("io.output-variable");
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
          statement.mode === "READ" ? "file.open-read" : statement.mode === "WRITE" ? "file.open-write" : statement.mode === "APPEND" ? "file.open-append" : "file.open-random"
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
  function containsIf(body) {
    return body.some((statement) => statement.kind === "IfStatement");
  }
  function addParameterFeatures(parameters, add) {
    for (const parameter of parameters) {
      add(parameter.mode === "BYREF" ? "param.byref" : "param.byval");
      addTypeFeatures(parameter.typeReference, add);
    }
  }
  function addTypeFeatures(reference, add) {
    if (reference.kind === "ArrayTypeReference") {
      add(reference.dimensions.length >= 2 ? "decl.array-2d" : "decl.array-1d");
      addTypeFeatures(reference.elementType, add);
      return;
    }
    add("decl.variable");
    if (reference.kind === "PrimitiveTypeReference") add(TYPE_FEATURES[reference.name]);
  }
  function expressionReadsIdentifier(expression) {
    switch (expression.kind) {
      case "NameExpression":
        return true;
      case "BinaryExpression":
        return expressionReadsIdentifier(expression.left) || expressionReadsIdentifier(expression.right);
      case "UnaryExpression":
        return expressionReadsIdentifier(expression.operand);
      case "CallExpression":
        return expression.arguments.some((argument) => expressionReadsIdentifier(argument));
      case "IndexExpression":
        return true;
      case "MemberExpression":
        return true;
      default:
        return false;
    }
  }
  function walkExpression(expression, add) {
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

  // packages/exercise/src/compare.ts
  function normalize(lines, options) {
    const trimmed = lines.map((line) => options.trimEachLine ? line.trim() : line.replace(/\s+$/u, ""));
    while (trimmed.length > 0 && trimmed[trimmed.length - 1] === "") trimmed.pop();
    return options.ignoreCase ? trimmed.map((line) => line.toLowerCase()) : trimmed;
  }
  function sameLine(expected, actual, tolerance) {
    if (expected === actual) return true;
    if (tolerance == null) return false;
    const a = Number(expected);
    const b = Number(actual);
    if (!Number.isFinite(a) || !Number.isFinite(b)) return false;
    return Math.abs(a - b) <= tolerance;
  }
  function skeleton(line, inputs) {
    let slots = 0;
    let text = line;
    for (const value of [...inputs].sort((a, b) => b.length - a.length)) {
      if (!value) continue;
      const parts = text.split(value);
      slots += parts.length - 1;
      text = parts.join("\0");
    }
    return { text, slots };
  }
  function maskNumbers(line) {
    return line.replace(/-?\d+/gu, "#");
  }
  function classify(expectedLine, actualLine, inputs) {
    const e = skeleton(expectedLine, inputs);
    const a = skeleton(actualLine, inputs);
    if (e.text === a.text) return "data";
    if (maskNumbers(expectedLine) === maskNumbers(actualLine)) return "data";
    if (maskNumbers(e.text) === maskNumbers(a.text)) return "data";
    if (e.slots === a.slots) return "literal";
    return "mixed";
  }
  function compareOutputs(expected, actual, options = {}, inputs = []) {
    const left = normalize(expected, options);
    const right = normalize(actual, options);
    const length = Math.max(left.length, right.length);
    let firstDiff = null;
    for (let index = 0; index < length; index += 1) {
      const a = left[index];
      const b = right[index];
      if (a === void 0 || b === void 0 || !sameLine(a, b, options.numericTolerance)) {
        firstDiff = index + 1;
        break;
      }
    }
    if (firstDiff === null) return { matches: true, firstDiffLine: null, diffKind: null };
    if (left.length !== right.length) {
      return { matches: false, firstDiffLine: firstDiff, diffKind: "line-count" };
    }
    return {
      matches: false,
      firstDiffLine: firstDiff,
      diffKind: classify(left[firstDiff - 1], right[firstDiff - 1], inputs)
    };
  }

  // packages/exercise/src/notes.ts
  function findUnpromptedInputs(program) {
    const lines = [];
    const walk = (statements) => {
      statements.forEach((statement, index) => {
        if (statement.kind === "InputStatement") {
          const previous = statements[index - 1];
          const prompted = !!previous && previous.kind === "OutputStatement";
          if (!prompted) lines.push(statement.range.start.line);
        }
        if ("body" in statement && Array.isArray(statement.body)) walk(statement.body);
        if (statement.kind === "IfStatement") {
          walk(statement.thenBranch);
          walk(statement.elseBranch);
        }
        if (statement.kind === "CaseStatement") {
          for (const clause of statement.clauses) walk(clause.body);
        }
      });
    };
    walk(program.body);
    return lines;
  }
  function declaredNames(program) {
    const names = /* @__PURE__ */ new Map();
    const walk = (statements) => {
      for (const statement of statements) {
        if (statement.kind === "DeclareStatement" || statement.kind === "ConstantStatement") {
          names.set(statement.normalizedName.toLowerCase(), statement.name);
        }
        if ("body" in statement && Array.isArray(statement.body)) walk(statement.body);
        if (statement.kind === "IfStatement") {
          walk(statement.thenBranch);
          walk(statement.elseBranch);
        }
        if (statement.kind === "CaseStatement") {
          for (const clause of statement.clauses) walk(clause.body);
        }
      }
    };
    walk(program.body);
    return names;
  }
  function collectLiteralOutputs(statements, found) {
    statements.forEach((statement, index) => {
      if (statement.kind === "OutputStatement") {
        const allLiteral = statement.values.length > 0 && statement.values.every(
          (value) => value.kind === "LiteralExpression" && value.literalType === "STRING"
        );
        if (allLiteral) {
          const next = statements[index + 1];
          found.push({
            text: statement.values.map((value) => String(value.value)).join(""),
            line: statement.range.start.line,
            // 紧跟着一句 INPUT 的，几乎一定是提示语；提示语里出现变量名是正常的
            followedByInput: !!next && next.kind === "InputStatement"
          });
        }
      }
      if ("body" in statement && Array.isArray(statement.body)) {
        collectLiteralOutputs(statement.body, found);
      }
      if (statement.kind === "IfStatement") {
        collectLiteralOutputs(statement.thenBranch, found);
        collectLiteralOutputs(statement.elseBranch, found);
      }
      if (statement.kind === "CaseStatement") {
        for (const clause of statement.clauses) collectLiteralOutputs(clause.body, found);
      }
    });
  }
  function findCodeNotes(program) {
    const declared = declaredNames(program);
    if (declared.size === 0) return [];
    const outputs = [];
    collectLiteralOutputs(program.body, outputs);
    const notes = [];
    for (const output of outputs) {
      if (output.followedByInput) continue;
      const exact = [];
      const loose = [];
      for (const word of output.text.split(/[^A-Za-z0-9_]+/u)) {
        if (!word) continue;
        const original = declared.get(word.toLowerCase());
        if (!original) continue;
        if (original === word) {
          if (!exact.includes(original)) exact.push(original);
        } else if (!loose.includes(original)) {
          loose.push(original);
        }
      }
      const hits = [.../* @__PURE__ */ new Set([...exact, ...loose])];
      if (exact.length === 0 && hits.length < 2) continue;
      notes.push({ kind: "variable-in-string", names: hits, line: output.line });
    }
    return notes;
  }

  // packages/caie-spec/dist/index.js
  var KEYWORDS = [
    "DECLARE",
    "CONSTANT",
    "TYPE",
    "ENDTYPE",
    "DEFINE",
    "SET",
    "OF",
    "ARRAY",
    "INPUT",
    "OUTPUT",
    "IF",
    "THEN",
    "ELSE",
    "ENDIF",
    "CASE",
    "OTHERWISE",
    "ENDCASE",
    "FOR",
    "TO",
    "STEP",
    "NEXT",
    "REPEAT",
    "UNTIL",
    "WHILE",
    "ENDWHILE",
    "PROCEDURE",
    "ENDPROCEDURE",
    "FUNCTION",
    "ENDFUNCTION",
    "RETURN",
    "RETURNS",
    "CALL",
    "BYREF",
    "BYVAL",
    "OPENFILE",
    "READFILE",
    "WRITEFILE",
    "CLOSEFILE",
    "EOF",
    "READ",
    "WRITE",
    "APPEND",
    "RANDOM",
    "SEEK",
    "GETRECORD",
    "PUTRECORD",
    "CLASS",
    "ENDCLASS",
    "INHERITS",
    "NEW",
    "SUPER",
    "PUBLIC",
    "PRIVATE",
    "AND",
    "OR",
    "NOT",
    "DIV",
    "MOD",
    "TRUE",
    "FALSE"
  ];
  var TYPE_NAMES = ["INTEGER", "REAL", "CHAR", "STRING", "BOOLEAN", "DATE"];
  var BUILTINS = [
    { name: "LENGTH", parameters: ["STRING"], returns: "INTEGER" },
    { name: "RIGHT", parameters: ["STRING", "INTEGER"], returns: "STRING" },
    { name: "MID", parameters: ["STRING", "INTEGER", "INTEGER"], returns: "STRING" },
    { name: "LCASE", parameters: ["CHAR"], returns: "CHAR" },
    { name: "UCASE", parameters: ["CHAR"], returns: "CHAR" },
    { name: "INT", parameters: ["REAL"], returns: "INTEGER" },
    { name: "RAND", parameters: ["INTEGER"], returns: "REAL" }
  ];
  var RULE_IDS_BY_STRENGTH = {
    "EXAM-PRESENTATION": ["FMT-001", "FMT-003", "BUILTIN-002"],
    "RECOMMENDED": [
      "FMT-002",
      "FMT-005",
      "FMT-007",
      "LIT-006",
      "DECL-001",
      "CONST-003",
      "ARRAY-003",
      "OP-006",
      "FOR-003",
      "FILE-004"
    ],
    "EDITOR-RUNTIME": ["DECL-002", "FILE-006", "TYPO-001"],
    "SYLLABUS-SCOPE": [],
    "REQUIRED": [
      "FMT-004",
      "FMT-006",
      "TYPE-001",
      "LIT-001",
      "LIT-002",
      "LIT-003",
      "LIT-004",
      "LIT-005",
      "ID-001",
      "ID-002",
      "ID-003",
      "CONST-001",
      "CONST-002",
      "ASSIGN-001",
      "ASSIGN-002",
      "ASSIGN-003",
      "ARRAY-001",
      "ARRAY-002",
      "ARRAY-004",
      "ARRAY-005",
      "UDT-001",
      "UDT-002",
      "UDT-003",
      "UDT-004",
      "UDT-005",
      "IO-001",
      "IO-002",
      "OP-001",
      "OP-002",
      "OP-003",
      "OP-004",
      "OP-005",
      "BUILTIN-001",
      "IF-001",
      "CASE-001",
      "CASE-002",
      "FOR-001",
      "FOR-002",
      "REPEAT-001",
      "WHILE-001",
      "PROC-001",
      "PROC-002",
      "FUNC-001",
      "FUNC-002",
      "PARAM-001",
      "PARAM-002",
      "PARAM-003",
      "FILE-001",
      "FILE-002",
      "FILE-003",
      "FILE-005",
      "OOP-001",
      "OOP-002",
      "OOP-003",
      "OOP-004"
    ]
  };
  var RULE_STRENGTH = Object.freeze(Object.fromEntries(Object.entries(RULE_IDS_BY_STRENGTH).flatMap(([strength, ids]) => ids.map((id) => [id, strength]))));
  var RULE_IDS = Object.freeze(Object.keys(RULE_STRENGTH));
  var keywordSet = new Set(KEYWORDS);
  var typeNameSet = new Set(TYPE_NAMES);
  var builtinSet = new Set(BUILTINS.map(({ name }) => name));
  function isKeyword(value) {
    return keywordSet.has(value.toUpperCase());
  }
  function isTypeName(value) {
    return typeNameSet.has(value.toUpperCase());
  }
  function isBuiltin(value) {
    return builtinSet.has(value.toUpperCase());
  }

  // packages/language/dist/tokenizer.js
  var WORD_OPERATORS = /* @__PURE__ */ new Set(["AND", "OR", "NOT", "DIV", "MOD"]);
  var BOOLEAN_LITERALS = /* @__PURE__ */ new Set(["TRUE", "FALSE"]);
  var TWO_CHARACTER_OPERATORS = /* @__PURE__ */ new Set([">=", "<=", "<>", "<-"]);
  var ONE_CHARACTER_OPERATORS = /* @__PURE__ */ new Set(["\u2190", "+", "-", "*", "/", ">", "<", "=", "&", "^"]);
  var PUNCTUATION = /* @__PURE__ */ new Set(["(", ")", "[", "]", ",", ":", "."]);
  var CHINESE_PUNCTUATION = /* @__PURE__ */ new Set([
    "\uFF0C",
    "\u3002",
    "\uFF1B",
    "\uFF1A",
    "\uFF01",
    "\uFF1F",
    "\uFF08",
    "\uFF09",
    "\u3010",
    "\u3011",
    "\uFF3B",
    "\uFF3D",
    "\uFF5B",
    "\uFF5D",
    "\u3001",
    "\u2018",
    "\u2019",
    "\u201C",
    "\u201D",
    "\u300A",
    "\u300B",
    "\u3008",
    "\u3009"
  ]);
  function copyPosition(position) {
    return { ...position };
  }
  function isAsciiDigit(character) {
    return character !== void 0 && /[0-9]/.test(character);
  }
  function isValidDate(text) {
    const day = Number(text.slice(0, 2));
    const month = Number(text.slice(3, 5));
    const year = Number(text.slice(6, 10));
    if (month < 1 || month > 12 || day < 1)
      return false;
    const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
    return day <= daysInMonth;
  }
  function canStartSignedNumber(previous) {
    if (!previous || previous.kind === "newline")
      return true;
    if (previous.kind === "operator")
      return true;
    if (previous.kind === "punctuation")
      return previous.text !== ")" && previous.text !== "]";
    return previous.kind === "keyword" && ["TO", "STEP", "RETURN", "OUTPUT"].includes(previous.normalized ?? "");
  }
  function tokenize(source, _options = {}) {
    const normalizedSource = source.replace(/\r\n?/g, "\n");
    const tokens = [];
    const diagnostics = [];
    const position = { offset: 0, line: 1, column: 1 };
    const peek = (distance = 0) => normalizedSource[position.offset + distance];
    const advance = () => {
      const codePoint = normalizedSource.codePointAt(position.offset);
      if (codePoint === void 0)
        return "";
      const character = String.fromCodePoint(codePoint);
      position.offset += character.length;
      if (character === "\n") {
        position.line += 1;
        position.column = 1;
      } else {
        position.column += 1;
      }
      return character;
    };
    const addToken = (kind, start, normalized2) => {
      const range = { start, end: copyPosition(position) };
      const token = {
        kind,
        text: normalizedSource.slice(start.offset, position.offset),
        range,
        ...normalized2 === void 0 ? {} : { normalized: normalized2 }
      };
      tokens.push(token);
      return token;
    };
    const addDiagnostic = (code, ruleId, origin, messageKey, range, args) => {
      diagnostics.push({
        code,
        ruleId,
        severity: "error",
        origin,
        messageKey,
        range,
        ...args ? { args } : {}
      });
    };
    const scanNumber = (start, signed) => {
      if (signed)
        advance();
      while (isAsciiDigit(peek()))
        advance();
      if (peek() === ".") {
        advance();
        if (!isAsciiDigit(peek())) {
          const token = addToken("invalid", start);
          addDiagnostic("PC1002", "LIT-002", "CAIE", "literal.real.requiresDigitsAfterPoint", token.range);
          return;
        }
        while (isAsciiDigit(peek()))
          advance();
        addToken("real", start);
        return;
      }
      addToken("integer", start);
    };
    while (position.offset < normalizedSource.length) {
      const start = copyPosition(position);
      const character = peek();
      if (character === " " || character === "	") {
        advance();
        continue;
      }
      if (character === "\n") {
        advance();
        addToken("newline", start);
        continue;
      }
      if (character === "/" && peek(1) === "/") {
        while (peek() !== void 0 && peek() !== "\n")
          advance();
        addToken("comment", start);
        continue;
      }
      if (character === '"' || character === "'") {
        const quote = character;
        advance();
        while (peek() !== void 0 && peek() !== "\n" && peek() !== quote)
          advance();
        if (peek() !== quote) {
          const token3 = addToken("invalid", start);
          addDiagnostic(quote === '"' ? "PC1003" : "PC1004", quote === '"' ? "LIT-004" : "LIT-003", "CAIE", quote === '"' ? "literal.string.unterminated" : "literal.char.unterminated", token3.range);
          continue;
        }
        advance();
        const token2 = addToken(quote === '"' ? "string" : "char", start);
        if (quote === "'") {
          const value = token2.text.slice(1, -1);
          if ([...value].length !== 1) {
            token2.kind = "invalid";
            if ([...value].length > 1) {
              addDiagnostic("PC1005", "LIT-003", "CAIE", "literal.char.looksLikeString", token2.range, { value });
            } else {
              addDiagnostic("PC1005", "LIT-003", "CAIE", "literal.char.requiresOneCodePoint", token2.range);
            }
          }
        }
        continue;
      }
      const dateCandidate = normalizedSource.slice(position.offset).match(/^\d{2}\/\d{2}\/\d{4}(?![A-Za-z0-9_])/)?.[0];
      if (dateCandidate) {
        for (const _ of dateCandidate)
          advance();
        const token2 = addToken("date", start);
        if (!isValidDate(dateCandidate)) {
          addDiagnostic("PC1001", "LIT-006", "Editor Runtime", "literal.date.invalidCalendarDate", token2.range, {
            value: dateCandidate
          });
        }
        continue;
      }
      const invalidLeadingDigitIdentifier = normalizedSource.slice(position.offset).match(/^\d+[\p{L}_][\p{L}\p{N}_]*/u)?.[0];
      if (invalidLeadingDigitIdentifier) {
        for (const _ of invalidLeadingDigitIdentifier)
          advance();
        const token2 = addToken("invalid", start);
        addDiagnostic("PC1007", "ID-001", "CAIE", "identifier.invalidFormat", token2.range, { value: token2.text });
        continue;
      }
      const previous = tokens.at(-1);
      if (isAsciiDigit(character) || character === "-" && isAsciiDigit(peek(1)) && canStartSignedNumber(previous)) {
        scanNumber(start, character === "-");
        continue;
      }
      if (character === "." && isAsciiDigit(peek(1))) {
        advance();
        while (isAsciiDigit(peek()))
          advance();
        const token2 = addToken("invalid", start);
        addDiagnostic("PC1002", "LIT-002", "CAIE", "literal.real.requiresDigitsBeforePoint", token2.range);
        continue;
      }
      const identifierCandidate = normalizedSource.slice(position.offset).match(/^[\p{L}][\p{L}\p{N}_]*/u)?.[0];
      if (identifierCandidate) {
        for (const _ of identifierCandidate)
          advance();
        const text = identifierCandidate;
        if (!/^[A-Za-z][A-Za-z0-9_]*$/.test(text)) {
          const token2 = addToken("invalid", start);
          addDiagnostic("PC1007", "ID-001", "CAIE", "identifier.invalidFormat", token2.range, { value: token2.text });
          continue;
        }
        const normalized2 = text.toUpperCase();
        if (BOOLEAN_LITERALS.has(normalized2))
          addToken("boolean", start, normalized2);
        else if (isTypeName(normalized2))
          addToken("type-name", start, normalized2);
        else if (WORD_OPERATORS.has(normalized2))
          addToken("operator", start, normalized2);
        else if (isKeyword(normalized2))
          addToken("keyword", start, normalized2);
        else
          addToken("identifier", start, normalized2);
        continue;
      }
      const pair = `${character ?? ""}${peek(1) ?? ""}`;
      if (TWO_CHARACTER_OPERATORS.has(pair)) {
        advance();
        advance();
        addToken("operator", start, pair === "<-" ? "\u2190" : pair);
        continue;
      }
      if (character && ONE_CHARACTER_OPERATORS.has(character)) {
        advance();
        addToken("operator", start, character);
        continue;
      }
      if (character && PUNCTUATION.has(character)) {
        advance();
        addToken("punctuation", start, character);
        continue;
      }
      advance();
      const token = addToken("invalid", start);
      addDiagnostic("PC1006", "ID-001", "CAIE", CHINESE_PUNCTUATION.has(token.text) ? "token.chinesePunctuation" : "token.invalidCharacter", token.range, { value: token.text });
    }
    const eofPosition = copyPosition(position);
    tokens.push({ kind: "eof", text: "", range: { start: eofPosition, end: eofPosition } });
    return { normalizedSource, tokens, diagnostics };
  }

  // packages/language/dist/parser.js
  var BINARY_OPERATORS = {
    OR: { precedence: 1 },
    AND: { precedence: 2 },
    ">": { precedence: 3, relation: true },
    "<": { precedence: 3, relation: true },
    ">=": { precedence: 3, relation: true },
    "<=": { precedence: 3, relation: true },
    "=": { precedence: 3, relation: true },
    "<>": { precedence: 3, relation: true },
    "&": { precedence: 4 },
    "+": { precedence: 5 },
    "-": { precedence: 5 },
    "*": { precedence: 6 },
    "/": { precedence: 6 },
    DIV: { precedence: 6 },
    MOD: { precedence: 6 }
  };
  var UNARY_OPERATORS = /* @__PURE__ */ new Set(["-", "NOT", "^"]);
  var BLOCK_BOUNDARIES = /* @__PURE__ */ new Set([
    "ELSE",
    "ENDIF",
    "ENDCASE",
    "NEXT",
    "UNTIL",
    "ENDWHILE",
    "ENDPROCEDURE",
    "ENDFUNCTION",
    "ENDTYPE",
    "ENDCLASS"
  ]);
  function rangeFrom(start, end) {
    return { start: { ...start }, end: { ...end } };
  }
  function emptyRangeAt(position) {
    return rangeFrom(position, position);
  }
  function literalValue(token) {
    switch (token.kind) {
      case "integer":
        return Number(token.text);
      case "real":
        return Number(token.text);
      case "char":
      case "string":
        return token.text.slice(1, -1);
      case "boolean":
        return token.normalized === "TRUE";
      case "date": {
        const [day, month, year] = token.text.split("/").map(Number);
        return { day, month, year };
      }
      default:
        return token.text;
    }
  }
  function literalType(token) {
    const names = {
      integer: "INTEGER",
      real: "REAL",
      char: "CHAR",
      string: "STRING",
      boolean: "BOOLEAN",
      date: "DATE"
    };
    return names[token.kind] ?? "STRING";
  }
  var ExpressionParser = class {
    tokens;
    index = 0;
    diagnostics = [];
    maxDiagnostics;
    constructor(tokens, options, startIndex = 0) {
      this.tokens = tokens;
      this.index = startIndex;
      this.maxDiagnostics = Math.max(1, options.maxDiagnostics ?? 50);
    }
    parse() {
      const result = this.parsePrefix();
      const trailing = this.current();
      if (trailing.kind !== "eof" && trailing.kind !== "newline") {
        this.report("PC2003", "OP-001", "parser.expression.unexpectedToken", trailing.range, { token: trailing.text });
      }
      return { expression: result.expression, diagnostics: this.diagnostics };
    }
    parsePrefix() {
      this.skipComments();
      const expression = this.parseBinary(1);
      this.skipComments();
      return { expression, diagnostics: this.diagnostics, nextIndex: this.index };
    }
    current() {
      return this.tokens[this.index] ?? this.tokens.at(-1) ?? {
        kind: "eof",
        text: "",
        range: emptyRangeAt({ offset: 0, line: 1, column: 1 })
      };
    }
    previous() {
      return this.tokens[this.index - 1] ?? this.current();
    }
    advance() {
      const token = this.current();
      if (token.kind !== "eof")
        this.index += 1;
      return token;
    }
    skipComments() {
      while (this.current().kind === "comment")
        this.advance();
    }
    skipContinuationTrivia() {
      while (this.current().kind === "comment" || this.current().kind === "newline")
        this.advance();
    }
    matches(text) {
      const token = this.current();
      return (token.normalized ?? token.text) === text;
    }
    consume(text) {
      if (!this.matches(text))
        return void 0;
      return this.advance();
    }
    parseBinary(minimumPrecedence) {
      let left = this.parseUnary();
      let hasRelation = false;
      while (true) {
        const token = this.current();
        const operator = token.normalized ?? token.text;
        const info = token.kind === "operator" ? BINARY_OPERATORS[operator] : void 0;
        if (!info || info.precedence < minimumPrecedence)
          break;
        this.advance();
        if (operator === "=" && this.matches("=") && this.current().range.start.offset === token.range.end.offset) {
          const second = this.advance();
          this.report("PC2003", "OP-003", "parser.relation.doubleEquals", rangeFrom(token.range.start, second.range.end), {});
        }
        this.skipContinuationTrivia();
        const right = this.parseBinary(info.precedence + 1);
        const fullRange = rangeFrom(left.range.start, right.range.end);
        if (info.relation && hasRelation) {
          this.report("PC2002", "OP-003", "parser.relation.cannotChain", token.range, { operator });
          left = { kind: "ErrorExpression", reason: "chained-relation", recovered: left, range: fullRange };
          continue;
        }
        const binary = { kind: "BinaryExpression", operator, left, right, range: fullRange };
        left = binary;
        if (info.relation)
          hasRelation = true;
      }
      return left;
    }
    parseUnary() {
      const token = this.current();
      const operator = token.normalized ?? token.text;
      if (token.kind === "operator" && UNARY_OPERATORS.has(operator)) {
        this.advance();
        const operand = this.parseUnary();
        return {
          kind: "UnaryExpression",
          operator,
          operand,
          range: rangeFrom(token.range.start, operand.range.end)
        };
      }
      return this.parsePostfix();
    }
    parsePostfix() {
      let expression = this.parsePrimary();
      while (true) {
        if (this.consume("(")) {
          const opening = this.previous();
          const arguments_ = [];
          this.skipContinuationTrivia();
          if (!this.matches(")")) {
            while (true) {
              arguments_.push(this.parseBinary(1));
              this.skipContinuationTrivia();
              if (!this.consume(","))
                break;
              this.skipContinuationTrivia();
            }
          }
          const closing = this.expectClosing(")", "parser.call.missingClosingParenthesis");
          const call = {
            kind: "CallExpression",
            callee: expression,
            arguments: arguments_,
            range: rangeFrom(expression.range.start, closing?.range.end ?? arguments_.at(-1)?.range.end ?? opening.range.end)
          };
          expression = call;
          continue;
        }
        if (this.consume("[")) {
          const opening = this.previous();
          const indices = [];
          this.skipContinuationTrivia();
          if (this.matches("]")) {
            this.report("PC2001", "ARRAY-004", "parser.index.requiresExpression", this.current().range);
          } else {
            while (true) {
              indices.push(this.parseBinary(1));
              this.skipContinuationTrivia();
              if (!this.consume(","))
                break;
              this.skipContinuationTrivia();
            }
          }
          const closing = this.expectClosing("]", "parser.index.missingClosingBracket");
          const indexExpression = {
            kind: "IndexExpression",
            target: expression,
            indices,
            range: rangeFrom(expression.range.start, closing?.range.end ?? indices.at(-1)?.range.end ?? opening.range.end)
          };
          expression = indexExpression;
          continue;
        }
        if (this.consume(".")) {
          const dot = this.previous();
          const member = this.current();
          if (member.kind !== "identifier" && (member.normalized ?? member.text) !== "NEW") {
            this.report("PC2001", "ID-001", "parser.member.requiresIdentifier", member.range);
            expression = {
              kind: "ErrorExpression",
              reason: "missing-expression",
              recovered: expression,
              range: rangeFrom(expression.range.start, dot.range.end)
            };
            continue;
          }
          this.advance();
          const memberExpression = {
            kind: "MemberExpression",
            target: expression,
            member: member.text,
            normalizedMember: member.normalized ?? member.text.toUpperCase(),
            memberRange: member.range,
            range: rangeFrom(expression.range.start, member.range.end)
          };
          expression = memberExpression;
          continue;
        }
        if (this.consume("^")) {
          const caret = this.previous();
          expression = {
            kind: "UnaryExpression",
            operator: "^",
            postfix: true,
            operand: expression,
            range: rangeFrom(expression.range.start, caret.range.end)
          };
          continue;
        }
        break;
      }
      return expression;
    }
    parsePrimary() {
      const token = this.current();
      if (this.matches("NEW")) {
        const start = this.advance();
        const className = this.current();
        if (className.kind !== "identifier") {
          this.report("PC2001", "OOP-003", "parser.new.requiresClassName", className.range);
          return { kind: "ErrorExpression", reason: "missing-expression", range: rangeFrom(start.range.start, className.range.end) };
        }
        this.advance();
        if (!this.consume("("))
          this.report("PC2004", "OOP-003", "parser.call.requiresOpeningParenthesis", this.current().range);
        const arguments_ = [];
        this.skipContinuationTrivia();
        if (!this.matches(")")) {
          while (true) {
            arguments_.push(this.parseBinary(1));
            this.skipContinuationTrivia();
            if (!this.consume(","))
              break;
            this.skipContinuationTrivia();
          }
        }
        const closing = this.expectClosing(")", "parser.call.missingClosingParenthesis");
        const expression = {
          kind: "NewExpression",
          className: className.text,
          normalizedClassName: className.normalized ?? className.text.toUpperCase(),
          classNameRange: className.range,
          arguments: arguments_,
          range: rangeFrom(start.range.start, closing?.range.end ?? arguments_.at(-1)?.range.end ?? className.range.end)
        };
        return expression;
      }
      if (["integer", "real", "char", "string", "boolean", "date"].includes(token.kind)) {
        this.advance();
        return {
          kind: "LiteralExpression",
          literalType: literalType(token),
          raw: token.text,
          value: literalValue(token),
          range: token.range
        };
      }
      if (token.kind === "identifier" || this.matches("EOF") || this.matches("SUPER")) {
        this.advance();
        const name = {
          kind: "NameExpression",
          name: token.text,
          normalizedName: token.normalized ?? token.text.toUpperCase(),
          range: token.range
        };
        return name;
      }
      if (this.consume("(")) {
        const opening = this.previous();
        this.skipContinuationTrivia();
        const expression = this.parseBinary(1);
        this.skipContinuationTrivia();
        const closing = this.expectClosing(")", "parser.group.missingClosingParenthesis");
        const parenthesisRange = rangeFrom(opening.range.start, closing?.range.end ?? expression.range.end);
        expression.parentheses = [parenthesisRange, ...expression.parentheses ?? []];
        expression.range = parenthesisRange;
        return expression;
      }
      if (token.kind !== "eof" && token.kind !== "newline" && token.kind !== "comment")
        this.advance();
      if ((isKeyword(token.text) || isTypeName(token.text)) && token.kind !== "boolean") {
        this.report("PC2108", "ID-002", "parser.bindingName.cannotBeKeyword", token.range, { name: token.text });
      } else {
        this.report("PC2001", "OP-001", "parser.expression.expected", token.range, { token: token.text });
      }
      const error = {
        kind: "ErrorExpression",
        reason: "missing-expression",
        range: token.kind === "eof" || token.kind === "newline" ? emptyRangeAt(token.range.start) : token.range
      };
      return error;
    }
    expectClosing(text, messageKey) {
      const token = this.consume(text);
      if (token)
        return token;
      this.report("PC2004", text === "]" ? "ARRAY-004" : "OP-006", messageKey, this.current().range);
      return void 0;
    }
    report(code, ruleId, messageKey, range, args) {
      if (this.diagnostics.length >= this.maxDiagnostics)
        return;
      this.diagnostics.push({
        code,
        ruleId,
        severity: "error",
        origin: "Editor Runtime",
        messageKey,
        range,
        ...args ? { args } : {}
      });
    }
  };
  var ProgramParser = class {
    tokens;
    options;
    index = 0;
    diagnostics = [];
    maxDiagnostics;
    constructor(tokens, options) {
      this.tokens = tokens;
      this.options = options;
      this.maxDiagnostics = Math.max(1, options.maxDiagnostics ?? 50);
    }
    parse() {
      const body = [];
      while (!this.isAtEnd()) {
        this.skipSeparators();
        if (this.isAtEnd())
          break;
        body.push(this.parseStatement());
      }
      const first = this.tokens[0]?.range.start ?? { offset: 0, line: 1, column: 1 };
      const end = this.tokens.at(-1)?.range.end ?? first;
      return {
        program: {
          kind: "Program",
          body,
          comments: this.tokens.filter(({ kind }) => kind === "comment"),
          range: rangeFrom(first, end)
        },
        diagnostics: this.diagnostics
      };
    }
    current() {
      return this.tokens[this.index] ?? this.tokens.at(-1) ?? {
        kind: "eof",
        text: "",
        range: emptyRangeAt({ offset: 0, line: 1, column: 1 })
      };
    }
    advance() {
      const token = this.current();
      if (token.kind !== "eof")
        this.index += 1;
      return token;
    }
    isAtEnd() {
      return this.current().kind === "eof";
    }
    matches(text) {
      const token = this.current();
      return (token.normalized ?? token.text) === text;
    }
    consume(text) {
      if (!this.matches(text))
        return void 0;
      return this.advance();
    }
    skipSeparators() {
      while (this.current().kind === "newline" || this.current().kind === "comment")
        this.advance();
    }
    skipContinuationTrivia() {
      this.skipSeparators();
    }
    parseStatement() {
      if (this.matches("DECLARE"))
        return this.parseDeclare();
      if (this.matches("CONSTANT"))
        return this.parseConstant();
      if (this.matches("INPUT"))
        return this.parseInput();
      if (this.matches("OUTPUT"))
        return this.parseOutput();
      if (this.matches("OPENFILE"))
        return this.parseOpenFile();
      if (this.matches("READFILE"))
        return this.parseReadFile();
      if (this.matches("WRITEFILE"))
        return this.parseWriteFile();
      if (this.matches("CLOSEFILE"))
        return this.parseCloseFile();
      if (this.matches("SEEK"))
        return this.parseSeek();
      if (this.matches("GETRECORD"))
        return this.parseGetRecord();
      if (this.matches("PUTRECORD"))
        return this.parsePutRecord();
      if (this.matches("IF"))
        return this.parseIf();
      if (this.matches("CASE"))
        return this.parseCase();
      if (this.matches("FOR"))
        return this.parseFor();
      if (this.matches("WHILE"))
        return this.parseWhile();
      if (this.matches("REPEAT"))
        return this.parseRepeat();
      if (this.matches("TYPE"))
        return this.parseRecordType();
      if (this.matches("DEFINE"))
        return this.parseDefineSet();
      if (this.matches("CLASS"))
        return this.parseClass();
      if (this.matches("PROCEDURE") || (this.matches("PUBLIC") || this.matches("PRIVATE")) && this.peekNormalized(1) === "PROCEDURE") {
        return this.parseProcedure();
      }
      if (this.matches("FUNCTION") || (this.matches("PUBLIC") || this.matches("PRIVATE")) && this.peekNormalized(1) === "FUNCTION") {
        return this.parseFunction();
      }
      if (this.matches("CALL"))
        return this.parseCall();
      if (this.matches("RETURN"))
        return this.parseReturn();
      if (this.current().kind === "identifier") {
        return this.findAssignmentOperator() === -1 ? this.parseMethodCallStatement() : this.parseAssignment();
      }
      if (this.matches("SUPER"))
        return this.parseMethodCallStatement();
      const start = this.current();
      const ruleId = this.ruleForUnsupportedKeyword(start.normalized ?? start.text);
      this.report("PC2100", ruleId, "parser.statement.unsupportedInCurrentStage", start.range, "Editor Runtime", "error", {
        keyword: start.text
      });
      const end = this.recoverLine();
      const statement = {
        kind: "ErrorStatement",
        reason: "unsupported-statement",
        range: rangeFrom(start.range.start, end)
      };
      return statement;
    }
    parseDeclare() {
      const start = this.advance();
      const name = this.parseBindingName(start);
      if (name.kind === "ErrorStatement")
        return name;
      this.expect(":", "DECL-001", "parser.declare.requiresColon");
      const typeReference = this.parseTypeReference();
      const end = typeReference.range.end;
      this.finishStatement("DECL-001");
      return {
        kind: "DeclareStatement",
        name: name.text,
        normalizedName: name.normalized ?? name.text.toUpperCase(),
        nameRange: name.range,
        typeReference,
        range: rangeFrom(start.range.start, end)
      };
    }
    parseConstant() {
      const start = this.advance();
      const name = this.parseBindingName(start);
      if (name.kind === "ErrorStatement")
        return name;
      this.expect("=", "CONST-001", "parser.constant.requiresEquals");
      const value = this.parseExpressionPrefix();
      if (value.kind !== "LiteralExpression" && value.kind !== "ErrorExpression") {
        this.report("PC2105", "CONST-002", "parser.constant.requiresLiteral", value.range, "CAIE");
      }
      const end = value.range.end;
      this.finishStatement("CONST-001");
      return {
        kind: "ConstantStatement",
        name: name.text,
        normalizedName: name.normalized ?? name.text.toUpperCase(),
        nameRange: name.range,
        value,
        range: rangeFrom(start.range.start, end)
      };
    }
    parseRecordType() {
      const start = this.advance();
      const name = this.parseBindingName(start);
      if (name.kind === "ErrorStatement")
        return name;
      if (this.matches("=")) {
        this.advance();
        if (this.consume("(")) {
          const members = [];
          while (!this.matches(")") && !this.isLineEnd()) {
            const member = this.current();
            if (member.kind !== "identifier") {
              this.report("PC2107", "UDT-001", "parser.bindingName.invalidFormat", member.range, "CAIE");
              this.advance();
            } else {
              this.advance();
              members.push({
                name: member.text,
                normalizedName: member.normalized ?? member.text.toUpperCase(),
                nameRange: member.range
              });
            }
            if (!this.consume(","))
              break;
          }
          const closing2 = this.expect(")", "UDT-001", "parser.enum.requiresClosingParenthesis");
          this.finishStatement("UDT-001");
          return {
            kind: "EnumTypeDeclaration",
            name: name.text,
            normalizedName: name.normalized ?? name.text.toUpperCase(),
            nameRange: name.range,
            members,
            range: rangeFrom(start.range.start, closing2?.range.end ?? members.at(-1)?.nameRange.end ?? name.range.end)
          };
        }
        if (this.consume("^")) {
          const targetType = this.parseTypeReference();
          this.finishStatement("UDT-002");
          return {
            kind: "PointerTypeDeclaration",
            name: name.text,
            normalizedName: name.normalized ?? name.text.toUpperCase(),
            nameRange: name.range,
            targetType,
            range: rangeFrom(start.range.start, targetType.range.end)
          };
        }
        if (this.consume("SET")) {
          this.expect("OF", "UDT-004", "parser.set.requiresOf");
          const elementType = this.parseTypeReference();
          this.finishStatement("UDT-004");
          return {
            kind: "SetTypeDeclaration",
            name: name.text,
            normalizedName: name.normalized ?? name.text.toUpperCase(),
            nameRange: name.range,
            elementType,
            range: rangeFrom(start.range.start, elementType.range.end)
          };
        }
        this.report("PC2100", "UDT-001", "parser.statement.unsupportedInCurrentStage", this.current().range, "Editor Runtime", "error", {
          keyword: "TYPE ="
        });
        const end = this.recoverLine();
        return { kind: "ErrorStatement", reason: "unsupported-statement", range: rangeFrom(start.range.start, end) };
      }
      this.finishStatement("UDT-003");
      const fields = [];
      while (!this.isAtEnd()) {
        this.skipSeparators();
        if (this.matches("ENDTYPE") || this.matches("CLASS") || BLOCK_BOUNDARIES.has(this.currentNormalized()))
          break;
        if (!this.matches("DECLARE")) {
          const token = this.current();
          this.report("PC2401", "UDT-003", "parser.record.fieldRequiresDeclare", token.range, "CAIE", "error", {
            token: token.text
          });
          this.recoverLine();
          continue;
        }
        const declaration = this.parseDeclare();
        if (declaration.kind === "ErrorStatement")
          continue;
        fields.push({
          kind: "RecordField",
          name: declaration.name,
          normalizedName: declaration.normalizedName,
          nameRange: declaration.nameRange,
          typeReference: declaration.typeReference,
          range: declaration.range
        });
      }
      const closing = this.consumeBlockEnd("ENDTYPE", "UDT-003", "parser.record.missingEndtype", start);
      return {
        kind: "RecordTypeDeclaration",
        name: name.text,
        normalizedName: name.normalized ?? name.text.toUpperCase(),
        nameRange: name.range,
        fields,
        range: rangeFrom(start.range.start, closing?.range.end ?? fields.at(-1)?.range.end ?? name.range.end)
      };
    }
    parseDefineSet() {
      const start = this.advance();
      const name = this.parseBindingName(start);
      if (name.kind === "ErrorStatement")
        return name;
      this.expect("(", "UDT-004", "parser.set.requiresOpeningParenthesis");
      const values = [];
      if (!this.matches(")")) {
        while (!this.isLineEnd()) {
          values.push(this.parseExpressionPrefix());
          if (!this.consume(","))
            break;
        }
      }
      this.expect(")", "UDT-004", "parser.set.requiresClosingParenthesis");
      this.expect(":", "UDT-004", "parser.set.requiresColon");
      const typeReference = this.parseTypeReference();
      this.finishStatement("UDT-004");
      return {
        kind: "DefineSetStatement",
        name: name.text,
        normalizedName: name.normalized ?? name.text.toUpperCase(),
        nameRange: name.range,
        values,
        typeReference,
        range: rangeFrom(start.range.start, typeReference.range.end)
      };
    }
    parseClass() {
      const start = this.advance();
      const name = this.parseBindingName(start);
      if (name.kind === "ErrorStatement")
        return name;
      let baseName;
      if (this.consume("INHERITS")) {
        if (this.current().kind === "identifier")
          baseName = this.advance();
        else
          this.report("PC2101", "OOP-002", "parser.class.requiresBaseName", this.current().range, "CAIE");
      }
      this.finishStatement("OOP-001");
      const members = [];
      while (!this.isAtEnd()) {
        this.skipSeparators();
        if (this.matches("ENDCLASS") || BLOCK_BOUNDARIES.has(this.currentNormalized()))
          break;
        if (this.matches("PROCEDURE") || (this.matches("PUBLIC") || this.matches("PRIVATE")) && this.peekNormalized(1) === "PROCEDURE") {
          const member = this.parseProcedure();
          if (member.kind !== "ErrorStatement")
            members.push(member);
          continue;
        }
        if (this.matches("FUNCTION") || (this.matches("PUBLIC") || this.matches("PRIVATE")) && this.peekNormalized(1) === "FUNCTION") {
          const member = this.parseFunction();
          if (member.kind !== "ErrorStatement")
            members.push(member);
          continue;
        }
        const memberStart = this.current();
        const access = this.parseAccess() ?? "PUBLIC";
        const fieldName = this.current();
        if (fieldName.kind !== "identifier") {
          this.report("PC2401", "OOP-001", "parser.class.memberExpected", fieldName.range, "CAIE");
          this.recoverLine();
          continue;
        }
        this.advance();
        this.expect(":", "OOP-001", "parser.class.fieldRequiresColon");
        const typeReference = this.parseTypeReference();
        this.finishStatement("OOP-001");
        const field = {
          kind: "ClassField",
          name: fieldName.text,
          normalizedName: fieldName.normalized ?? fieldName.text.toUpperCase(),
          nameRange: fieldName.range,
          access,
          typeReference,
          range: rangeFrom(memberStart.range.start, typeReference.range.end)
        };
        members.push(field);
      }
      const closing = this.consumeBlockEnd("ENDCLASS", "OOP-001", "parser.class.missingEndclass", start);
      return {
        kind: "ClassDeclaration",
        name: name.text,
        normalizedName: name.normalized ?? name.text.toUpperCase(),
        nameRange: name.range,
        ...baseName ? {
          baseName: baseName.text,
          normalizedBaseName: baseName.normalized ?? baseName.text.toUpperCase(),
          baseNameRange: baseName.range
        } : {},
        members,
        range: rangeFrom(start.range.start, closing?.range.end ?? members.at(-1)?.range.end ?? name.range.end)
      };
    }
    parseAssignment() {
      const startIndex = this.index;
      const start = this.current();
      const operatorIndex = this.findAssignmentOperator();
      if (operatorIndex === -1) {
        this.report("PC2101", "ASSIGN-001", "parser.assignment.requiresOperator", start.range, "CAIE");
        const end2 = this.recoverLine();
        return { kind: "ErrorStatement", reason: "invalid-statement", range: rangeFrom(start.range.start, end2) };
      }
      const operator = this.tokens[operatorIndex];
      const target = this.parseExpressionSlice(startIndex, operatorIndex);
      this.index = operatorIndex + 1;
      const value = this.parseExpressionPrefix();
      if (!this.isWritable(target)) {
        this.report("PC2104", "ASSIGN-001", "parser.assignment.requiresWritableTarget", target.range, "CAIE");
      }
      if (operator.text === "=" || operator.text === "<-") {
        this.report(operator.text === "=" ? "PC2102" : "PC2103", "ASSIGN-001", operator.text === "=" ? "parser.assignment.equalsNotAllowed" : "parser.assignment.asciiArrow", operator.range, "CAIE", operator.text === "=" ? "error" : "caie", void 0, { range: operator.range, newText: "\u2190" });
      }
      const end = value.range.end;
      this.finishStatement("ASSIGN-001");
      return {
        kind: "AssignmentStatement",
        target,
        value,
        sourceOperator: operator.text,
        range: rangeFrom(start.range.start, end)
      };
    }
    parseMethodCallStatement() {
      const expression = this.parseExpressionPrefix();
      if (expression.kind !== "CallExpression" || expression.callee.kind !== "MemberExpression") {
        const directRoutine = expression.kind === "CallExpression" && expression.callee.kind === "NameExpression";
        this.report("PC2101", directRoutine ? "PROC-001" : "OOP-004", directRoutine ? "parser.call.requiresCallKeyword" : "parser.methodCall.requiresObjectMethod", expression.range, "CAIE");
        const end = this.recoverLine();
        return { kind: "ErrorStatement", reason: "invalid-statement", range: rangeFrom(expression.range.start, end) };
      }
      this.finishStatement("OOP-004");
      return { kind: "MethodCallStatement", call: expression, range: expression.range };
    }
    parseInput() {
      const start = this.advance();
      if (this.current().kind === "string") {
        const prompt = this.advance();
        this.report("PC2105", "IO-001", "parser.input.promptNotAllowed", prompt.range, "CAIE", "error", { prompt: prompt.text });
        if (this.currentNormalized() === ",")
          this.advance();
      }
      const target = this.parseExpressionPrefix();
      if (!this.isWritable(target)) {
        this.report("PC2104", "IO-001", "parser.input.requiresWritableTarget", target.range, "CAIE");
      }
      const end = target.range.end;
      this.finishStatement("IO-001");
      return { kind: "InputStatement", target, range: rangeFrom(start.range.start, end) };
    }
    parseOutput() {
      const start = this.advance();
      const values = [];
      if (this.current().kind === "newline" || this.current().kind === "comment" || this.current().kind === "eof") {
        this.report("PC2101", "IO-002", "parser.output.requiresExpression", this.current().range, "CAIE");
      } else {
        while (true) {
          values.push(this.parseExpressionPrefix());
          if (!this.consume(","))
            break;
          this.skipContinuationTrivia();
        }
      }
      const end = values.at(-1)?.range.end ?? start.range.end;
      if (values.length > 0 && !this.isLineEnd() && this.startsExpression(this.current())) {
        this.report("PC2107", "IO-002", "parser.output.requiresComma", this.current().range, "CAIE", "error", {
          token: this.current().text
        });
        this.recoverLine();
        return { kind: "OutputStatement", values, range: rangeFrom(start.range.start, end) };
      }
      this.finishStatement("IO-002");
      return { kind: "OutputStatement", values, range: rangeFrom(start.range.start, end) };
    }
    parseOpenFile() {
      const start = this.advance();
      const file = this.parseExpressionPrefix();
      this.expect("FOR", "FILE-001", "parser.openFile.requiresFor");
      const modeToken = this.current();
      let mode = "READ";
      if (this.matches("READ") || this.matches("WRITE") || this.matches("APPEND") || this.matches("RANDOM")) {
        mode = this.currentNormalized();
        this.advance();
      } else {
        this.report("PC2501", "FILE-001", "parser.openFile.invalidMode", modeToken.range, "CAIE", "error", {
          mode: modeToken.text
        });
        if (!this.isLineEnd())
          this.advance();
      }
      const end = this.current().range.start;
      this.finishStatement("FILE-001");
      return { kind: "OpenFileStatement", file, mode, range: rangeFrom(start.range.start, end) };
    }
    parseReadFile() {
      const start = this.advance();
      const file = this.parseExpressionPrefix();
      this.expect(",", "FILE-002", "parser.readFile.requiresComma");
      const target = this.parseExpressionPrefix();
      if (!this.isWritable(target)) {
        this.report("PC2104", "FILE-002", "parser.readFile.requiresWritableTarget", target.range, "CAIE");
      }
      const end = target.range.end;
      this.finishStatement("FILE-002");
      return { kind: "ReadFileStatement", file, target, range: rangeFrom(start.range.start, end) };
    }
    parseWriteFile() {
      const start = this.advance();
      const file = this.parseExpressionPrefix();
      this.expect(",", "FILE-003", "parser.writeFile.requiresComma");
      const data = this.parseExpressionPrefix();
      const end = data.range.end;
      this.finishStatement("FILE-003");
      return { kind: "WriteFileStatement", file, data, range: rangeFrom(start.range.start, end) };
    }
    parseCloseFile() {
      const start = this.advance();
      const file = this.parseExpressionPrefix();
      const end = file.range.end;
      this.finishStatement("FILE-003");
      return { kind: "CloseFileStatement", file, range: rangeFrom(start.range.start, end) };
    }
    parseSeek() {
      const start = this.advance();
      const file = this.parseExpressionPrefix();
      this.expect(",", "FILE-005", "parser.seek.requiresComma");
      const address = this.parseExpressionPrefix();
      this.finishStatement("FILE-005");
      return { kind: "SeekStatement", file, address, range: rangeFrom(start.range.start, address.range.end) };
    }
    parseGetRecord() {
      const start = this.advance();
      const file = this.parseExpressionPrefix();
      this.expect(",", "FILE-005", "parser.getRecord.requiresComma");
      const target = this.parseExpressionPrefix();
      if (!this.isWritable(target)) {
        this.report("PC2104", "FILE-005", "parser.getRecord.requiresWritableTarget", target.range, "CAIE");
      }
      this.finishStatement("FILE-005");
      return { kind: "GetRecordStatement", file, target, range: rangeFrom(start.range.start, target.range.end) };
    }
    parsePutRecord() {
      const start = this.advance();
      const file = this.parseExpressionPrefix();
      this.expect(",", "FILE-005", "parser.putRecord.requiresComma");
      const data = this.parseExpressionPrefix();
      this.finishStatement("FILE-005");
      return { kind: "PutRecordStatement", file, data, range: rangeFrom(start.range.start, data.range.end) };
    }
    parseIf() {
      const start = this.advance();
      const condition = this.parseExpressionPrefix();
      this.expect("THEN", "IF-001", "parser.if.requiresThen");
      this.finishStatement("IF-001");
      const thenBranch = this.parseBlock(["ELSE", "ENDIF"]);
      let elseBranch = [];
      if (this.matches("ELSE")) {
        this.advance();
        this.finishStatement("IF-001");
        elseBranch = this.parseBlock(["ENDIF"]);
      }
      const closing = this.consumeBlockEnd("ENDIF", "IF-001", "parser.if.missingEndif", start);
      return {
        kind: "IfStatement",
        condition,
        thenBranch,
        elseBranch,
        range: rangeFrom(start.range.start, closing?.range.end ?? this.branchEnd(elseBranch, thenBranch, condition.range.end))
      };
    }
    parseCase() {
      const start = this.advance();
      this.expect("OF", "CASE-001", "parser.case.requiresOf");
      const selector = this.parseExpressionPrefix();
      this.finishStatement("CASE-001");
      const clauses = [];
      let sawOtherwise = false;
      while (!this.isAtEnd()) {
        this.skipSeparators();
        if (this.matches("ENDCASE") || BLOCK_BOUNDARIES.has(this.currentNormalized()))
          break;
        const clauseStart = this.current();
        if (this.matches("OTHERWISE")) {
          if (sawOtherwise) {
            this.report("PC2205", "CASE-002", "parser.case.duplicateOtherwise", clauseStart.range, "CAIE");
          }
          sawOtherwise = true;
          this.advance();
          this.expect(":", "CASE-001", "parser.case.otherwiseRequiresColon");
          const body2 = this.parseCaseClauseBody();
          clauses.push({
            kind: "CaseClause",
            labels: [],
            isOtherwise: true,
            body: body2,
            range: rangeFrom(clauseStart.range.start, this.branchEnd(body2, [], clauseStart.range.end))
          });
          continue;
        }
        if (sawOtherwise) {
          this.report("PC2206", "CASE-002", "parser.case.otherwiseMustBeLast", clauseStart.range, "CAIE");
        }
        const labels = this.parseCaseLabels();
        this.expect(":", "CASE-001", "parser.case.clauseRequiresColon");
        const body = this.parseCaseClauseBody();
        clauses.push({
          kind: "CaseClause",
          labels,
          isOtherwise: false,
          body,
          range: rangeFrom(clauseStart.range.start, this.branchEnd(body, labels, clauseStart.range.end))
        });
      }
      const closing = this.consumeBlockEnd("ENDCASE", "CASE-001", "parser.case.missingEndcase", start);
      return {
        kind: "CaseStatement",
        selector,
        clauses,
        range: rangeFrom(start.range.start, closing?.range.end ?? this.branchEnd(clauses, [], selector.range.end))
      };
    }
    parseCaseLabels() {
      const labels = [];
      while (!this.isLineEnd() && !this.matches(":")) {
        const lower = this.parseExpressionPrefix();
        if (this.consume("TO")) {
          const upper = this.parseExpressionPrefix();
          labels.push({ kind: "CaseRangeLabel", lower, upper, range: rangeFrom(lower.range.start, upper.range.end) });
        } else {
          labels.push({ kind: "CaseValueLabel", value: lower, range: lower.range });
        }
        if (!this.consume(","))
          break;
      }
      if (labels.length === 0) {
        this.report("PC2204", "CASE-001", "parser.case.requiresLabel", this.current().range, "CAIE");
      }
      return labels;
    }
    parseCaseClauseBody() {
      if (!this.isLineEnd())
        return [this.parseStatement()];
      this.finishStatement("CASE-001");
      const body = [];
      while (!this.isAtEnd()) {
        this.skipSeparators();
        if (this.matches("ENDCASE") || this.matches("OTHERWISE") || BLOCK_BOUNDARIES.has(this.currentNormalized()) || this.isCaseClauseStart())
          break;
        body.push(this.parseStatement());
      }
      return body;
    }
    parseFor() {
      const start = this.advance();
      const controlToken = this.current();
      const controlIsReserved = isKeyword(controlToken.text) || isTypeName(controlToken.text) || controlToken.kind === "boolean";
      if (controlToken.kind === "identifier")
        this.advance();
      else if (controlIsReserved) {
        this.report("PC2108", "ID-002", "parser.bindingName.cannotBeKeyword", controlToken.range, "CAIE", "error", {
          name: controlToken.text
        });
        this.advance();
      } else
        this.report("PC2201", "FOR-001", "parser.for.requiresControlVariable", controlToken.range, "CAIE");
      const control = {
        kind: "NameExpression",
        name: controlToken.kind === "identifier" ? controlToken.text : "",
        normalizedName: controlToken.kind === "identifier" ? controlToken.normalized ?? controlToken.text.toUpperCase() : "",
        range: controlToken.range
      };
      this.parseLoopArrow("FOR-001");
      const startValue = this.parseExpressionPrefix();
      this.expect("TO", "FOR-001", "parser.for.requiresTo");
      const endValue = this.parseExpressionPrefix();
      let step;
      if (this.consume("STEP"))
        step = this.parseExpressionPrefix();
      this.finishStatement("FOR-001");
      const body = this.parseBlock(["NEXT"]);
      let nextVariable;
      let closing;
      if (this.matches("NEXT")) {
        closing = this.advance();
        if (this.current().kind === "identifier") {
          const name = this.advance();
          nextVariable = {
            name: name.text,
            normalizedName: name.normalized ?? name.text.toUpperCase(),
            range: name.range
          };
          if (nextVariable.normalizedName !== control.normalizedName) {
            this.report("PC2202", "FOR-001", "parser.for.nextVariableMismatch", name.range, "Editor Runtime", "error", {
              expected: control.name,
              actual: name.text
            });
          }
        } else if (isKeyword(this.current().text) || isTypeName(this.current().text) || this.current().kind === "boolean") {
          this.report("PC2108", "ID-002", "parser.bindingName.cannotBeKeyword", this.current().range, "CAIE", "error", {
            name: this.current().text
          });
          this.advance();
        } else {
          this.report("PC2203", "FOR-003", "parser.for.nextVariableRecommended", closing.range, "CAIE", "hint");
        }
        this.finishStatement("FOR-001");
      } else {
        this.reportBlockEnd("NEXT", "FOR-001", "parser.for.missingNext", start);
      }
      return {
        kind: "ForStatement",
        control,
        startValue,
        endValue,
        ...step ? { step } : {},
        body,
        ...nextVariable ? { nextVariable } : {},
        range: rangeFrom(start.range.start, nextVariable?.range.end ?? closing?.range.end ?? this.branchEnd(body, [], endValue.range.end))
      };
    }
    parseWhile() {
      const start = this.advance();
      const condition = this.parseExpressionPrefix();
      this.finishStatement("WHILE-001");
      const body = this.parseBlock(["ENDWHILE"]);
      const closing = this.consumeBlockEnd("ENDWHILE", "WHILE-001", "parser.while.missingEndwhile", start);
      return {
        kind: "WhileStatement",
        condition,
        body,
        range: rangeFrom(start.range.start, closing?.range.end ?? this.branchEnd(body, [], condition.range.end))
      };
    }
    parseRepeat() {
      const start = this.advance();
      this.finishStatement("REPEAT-001");
      const body = this.parseBlock(["UNTIL"]);
      let condition;
      if (this.matches("UNTIL")) {
        this.advance();
        condition = this.parseExpressionPrefix();
        this.finishStatement("REPEAT-001");
      } else {
        this.reportBlockEnd("UNTIL", "REPEAT-001", "parser.repeat.missingUntil", start);
        condition = { kind: "ErrorExpression", reason: "missing-expression", range: emptyRangeAt(this.current().range.start) };
      }
      return {
        kind: "RepeatStatement",
        body,
        condition,
        range: rangeFrom(start.range.start, condition.range.end)
      };
    }
    parseProcedure() {
      const declarationStart = this.current();
      const access = this.parseAccess();
      const start = this.current();
      this.expect("PROCEDURE", "PROC-001", "parser.procedure.requiresKeyword");
      const name = this.current();
      if (name.kind !== "identifier" && (name.normalized ?? name.text) !== "NEW") {
        return this.invalidRoutineHeader(start, "PROC-001", "parser.procedure.requiresName");
      }
      this.advance();
      const parameters = this.parseParameters(false);
      this.finishStatement("PROC-001");
      const body = this.parseBlock(["ENDPROCEDURE"]);
      const closing = this.consumeBlockEnd("ENDPROCEDURE", "PROC-001", "parser.procedure.missingEnd", start);
      return {
        kind: "ProcedureDeclaration",
        name: name.text,
        normalizedName: name.normalized ?? name.text.toUpperCase(),
        nameRange: name.range,
        ...access ? { access } : {},
        parameters,
        body,
        range: rangeFrom(declarationStart.range.start, closing?.range.end ?? this.branchEnd(body, [], name.range.end))
      };
    }
    parseFunction() {
      const declarationStart = this.current();
      const access = this.parseAccess();
      const start = this.current();
      this.expect("FUNCTION", "FUNC-001", "parser.function.requiresKeyword");
      const name = this.current();
      if (name.kind !== "identifier")
        return this.invalidRoutineHeader(start, "FUNC-001", "parser.function.requiresName");
      this.advance();
      const parameters = this.parseParameters(true);
      this.expect("RETURNS", "FUNC-001", "parser.function.requiresReturns");
      const returnType = this.parseTypeReference();
      this.finishStatement("FUNC-001");
      const body = this.parseBlock(["ENDFUNCTION"]);
      const closing = this.consumeBlockEnd("ENDFUNCTION", "FUNC-001", "parser.function.missingEnd", start);
      return {
        kind: "FunctionDeclaration",
        name: name.text,
        normalizedName: name.normalized ?? name.text.toUpperCase(),
        nameRange: name.range,
        ...access ? { access } : {},
        parameters,
        returnType,
        body,
        range: rangeFrom(declarationStart.range.start, closing?.range.end ?? this.branchEnd(body, [], returnType.range.end))
      };
    }
    parseParameters(inFunction) {
      const parameters = [];
      this.expect("(", inFunction ? "FUNC-001" : "PROC-001", "parser.routine.requiresOpeningParenthesis");
      let currentMode = "BYVAL";
      if (!this.matches(")")) {
        while (!this.isLineEnd()) {
          const parameterStart = this.current();
          let explicitMode = false;
          if (this.matches("BYVAL") || this.matches("BYREF")) {
            currentMode = this.currentNormalized();
            explicitMode = true;
            this.advance();
          }
          const name = this.current();
          if (name.kind !== "identifier") {
            this.report("PC2301", "PARAM-001", "parser.parameter.requiresName", name.range, "CAIE");
            break;
          }
          this.advance();
          this.expect(":", "PARAM-001", "parser.parameter.requiresColon");
          const typeReference = this.parseTypeReference();
          parameters.push({
            kind: "Parameter",
            name: name.text,
            normalizedName: name.normalized ?? name.text.toUpperCase(),
            nameRange: name.range,
            mode: currentMode,
            explicitMode,
            typeReference,
            range: rangeFrom(parameterStart.range.start, typeReference.range.end)
          });
          if (inFunction && currentMode === "BYREF") {
            this.report("PC2302", "PARAM-002", "parser.function.byrefParameter", name.range, "CAIE", "caie");
          }
          if (!this.consume(","))
            break;
        }
      }
      this.expect(")", inFunction ? "FUNC-001" : "PROC-001", "parser.routine.requiresClosingParenthesis");
      return parameters;
    }
    parseCall() {
      const start = this.advance();
      const name = this.current();
      if (name.kind !== "identifier") {
        this.report("PC2301", "PROC-001", "parser.call.requiresName", name.range, "CAIE");
        const end2 = this.recoverLine();
        return { kind: "ErrorStatement", reason: "invalid-statement", range: rangeFrom(start.range.start, end2) };
      }
      this.advance();
      const target = {
        kind: "NameExpression",
        name: name.text,
        normalizedName: name.normalized ?? name.text.toUpperCase(),
        range: name.range
      };
      const argumentList = this.parseArgumentList("PROC-001");
      const arguments_ = argumentList.arguments;
      const end = argumentList.end;
      this.finishStatement("PROC-001");
      return { kind: "CallStatement", target, arguments: arguments_, range: rangeFrom(start.range.start, end) };
    }
    parseReturn() {
      const start = this.advance();
      const value = this.parseExpressionPrefix();
      this.finishStatement("FUNC-001");
      return { kind: "ReturnStatement", value, range: rangeFrom(start.range.start, value.range.end) };
    }
    parseArgumentList(ruleId) {
      const arguments_ = [];
      const opening = this.expect("(", ruleId, "parser.call.requiresOpeningParenthesis");
      this.skipContinuationTrivia();
      if (!this.matches(")")) {
        while (true) {
          arguments_.push(this.parseExpressionPrefix());
          this.skipContinuationTrivia();
          if (!this.consume(","))
            break;
          this.skipContinuationTrivia();
        }
      }
      const closing = this.expect(")", ruleId, "parser.call.requiresClosingParenthesis");
      return { arguments: arguments_, end: closing?.range.end ?? arguments_.at(-1)?.range.end ?? opening?.range.end ?? this.current().range.start };
    }
    parseAccess() {
      if (!this.matches("PUBLIC") && !this.matches("PRIVATE"))
        return void 0;
      return this.advance().normalized;
    }
    invalidRoutineHeader(start, ruleId, messageKey) {
      this.report("PC2301", ruleId, messageKey, this.current().range, "CAIE");
      const end = this.recoverLine();
      return { kind: "ErrorStatement", reason: "invalid-statement", range: rangeFrom(start.range.start, end) };
    }
    parseBlock(terminators) {
      const body = [];
      while (!this.isAtEnd()) {
        this.skipSeparators();
        const current = this.currentNormalized();
        if (terminators.includes(current) || BLOCK_BOUNDARIES.has(current))
          break;
        body.push(this.parseStatement());
      }
      return body;
    }
    parseLoopArrow(ruleId) {
      const token = this.current();
      if (!this.matches("\u2190")) {
        this.report("PC2201", ruleId, "parser.loop.requiresAssignmentArrow", token.range, "CAIE");
        return;
      }
      this.advance();
      if (token.text === "<-") {
        this.report("PC2103", "ASSIGN-001", "parser.assignment.asciiArrow", token.range, "CAIE", "caie", void 0, {
          range: token.range,
          newText: "\u2190"
        });
      }
    }
    consumeBlockEnd(expected, ruleId, messageKey, opener) {
      if (!this.matches(expected)) {
        this.reportBlockEnd(expected, ruleId, messageKey, opener);
        return void 0;
      }
      const closing = this.advance();
      this.finishStatement(ruleId);
      return closing;
    }
    reportBlockEnd(expected, ruleId, messageKey, opener) {
      const actual = this.currentNormalized();
      if (BLOCK_BOUNDARIES.has(actual)) {
        this.report("PC2200", ruleId, "parser.block.mismatchedEnd", this.current().range, "Editor Runtime", "error", { expected, actual });
        this.recoverLine();
      } else {
        const range = opener ? opener.range : this.current().range;
        this.report("PC2200", ruleId, messageKey, range, "Editor Runtime", "error", { expected, opener: opener ? opener.normalized ?? opener.text : expected, line: range.start.line });
      }
    }
    currentNormalized() {
      return this.current().normalized ?? this.current().text;
    }
    peekNormalized(distance) {
      const token = this.tokens[this.index + distance];
      return token?.normalized ?? token?.text ?? "";
    }
    isCaseClauseStart() {
      const token = this.current();
      if (!["integer", "real", "char", "string", "boolean", "date", "identifier"].includes(token.kind))
        return false;
      for (let i = this.index; i < this.tokens.length; i += 1) {
        const candidate = this.tokens[i];
        if (candidate.kind === "newline" || candidate.kind === "comment" || candidate.kind === "eof")
          return false;
        if (candidate.text === ":")
          return true;
      }
      return false;
    }
    branchEnd(primary, fallback, defaultEnd) {
      return primary.at(-1)?.range.end ?? fallback.at(-1)?.range.end ?? defaultEnd;
    }
    parseTypeReference() {
      const token = this.current();
      if (token.kind === "type-name") {
        this.advance();
        const primitive3 = {
          kind: "PrimitiveTypeReference",
          name: token.normalized,
          range: token.range
        };
        return primitive3;
      }
      if (token.kind === "identifier") {
        this.advance();
        const named = {
          kind: "NamedTypeReference",
          name: token.text,
          normalizedName: token.normalized ?? token.text.toUpperCase(),
          range: token.range
        };
        return named;
      }
      if (this.matches("ARRAY"))
        return this.parseArrayTypeReference();
      this.report("PC2101", "TYPE-001", "parser.type.expected", token.range, "CAIE");
      if (token.kind !== "newline" && token.kind !== "comment" && token.kind !== "eof")
        this.advance();
      return { kind: "ErrorTypeReference", range: token.range };
    }
    parseArrayTypeReference() {
      const start = this.advance();
      const dimensions = this.parseArrayDimensions();
      this.expect("OF", "ARRAY-002", "parser.arrayType.requiresOf");
      const elementType = this.parseTypeReference();
      return {
        kind: "ArrayTypeReference",
        dimensions,
        elementType,
        range: rangeFrom(start.range.start, elementType.range.end)
      };
    }
    parseArrayDimensions() {
      this.expect("[", "ARRAY-002", "parser.arrayType.requiresOpeningBracket");
      const dimensions = [];
      while (!this.matches("]") && !this.isLineEnd()) {
        const lower = this.parseExpressionPrefix();
        this.expect(":", "ARRAY-002", "parser.arrayType.requiresRangeColon");
        const upper = this.parseExpressionPrefix();
        dimensions.push({
          kind: "ArrayRange",
          lower,
          upper,
          range: rangeFrom(lower.range.start, upper.range.end)
        });
        if (!this.consume(","))
          break;
      }
      this.expect("]", "ARRAY-002", "parser.arrayType.requiresClosingBracket");
      return dimensions;
    }
    parseExpressionPrefix() {
      const parser = new ExpressionParser(this.tokens, {
        ...this.options,
        maxDiagnostics: Math.max(1, this.maxDiagnostics - this.diagnostics.length)
      }, this.index);
      const result = parser.parsePrefix();
      this.index = result.nextIndex;
      this.diagnostics.push(...result.diagnostics.slice(0, this.maxDiagnostics - this.diagnostics.length));
      return result.expression;
    }
    parseExpressionSlice(start, end) {
      const endPosition = this.tokens[end]?.range.start ?? this.current().range.start;
      const eof = { kind: "eof", text: "", range: emptyRangeAt(endPosition) };
      const parser = new ExpressionParser([...this.tokens.slice(start, end), eof], {
        ...this.options,
        maxDiagnostics: Math.max(1, this.maxDiagnostics - this.diagnostics.length)
      });
      const result = parser.parse();
      this.diagnostics.push(...result.diagnostics.slice(0, this.maxDiagnostics - this.diagnostics.length));
      return result.expression;
    }
    findAssignmentOperator() {
      let bracketDepth = 0;
      let parenthesisDepth = 0;
      for (let i = this.index; i < this.tokens.length; i += 1) {
        const token = this.tokens[i];
        if (token.kind === "newline" || token.kind === "comment" || token.kind === "eof")
          break;
        if (token.text === "[")
          bracketDepth += 1;
        else if (token.text === "]")
          bracketDepth -= 1;
        else if (token.text === "(")
          parenthesisDepth += 1;
        else if (token.text === ")")
          parenthesisDepth -= 1;
        else if (bracketDepth === 0 && parenthesisDepth === 0 && ["\u2190", "<-", "="].includes(token.text))
          return i;
      }
      return -1;
    }
    isWritable(expression) {
      if (expression.kind === "NameExpression")
        return true;
      if (expression.kind === "IndexExpression" || expression.kind === "MemberExpression")
        return this.isWritable(expression.target);
      return expression.kind === "UnaryExpression" && expression.postfix === true && expression.operator === "^";
    }
    parseBindingName(start) {
      const token = this.current();
      if (token.kind === "identifier") {
        this.advance();
        if (this.matches("-") && this.tokens[this.index + 1]?.kind === "identifier") {
          const endToken = this.tokens[this.index + 1];
          this.report("PC2107", "ID-001", "parser.bindingName.invalidFormat", rangeFrom(token.range.start, endToken.range.end), "CAIE");
          const end2 = this.recoverLine();
          return { kind: "ErrorStatement", reason: "invalid-statement", range: rangeFrom(start.range.start, end2) };
        }
        return token;
      }
      const keyword = token.kind === "keyword" || token.kind === "type-name" || token.kind === "boolean";
      this.report(keyword ? "PC2108" : "PC2107", keyword ? "ID-002" : "ID-001", keyword ? "parser.bindingName.cannotBeKeyword" : "parser.bindingName.invalidFormat", token.range, "CAIE");
      const end = this.recoverLine();
      return { kind: "ErrorStatement", reason: "invalid-statement", range: rangeFrom(start.range.start, end) };
    }
    expect(text, ruleId, messageKey) {
      const token = this.consume(text);
      if (token)
        return token;
      this.report("PC2101", ruleId, messageKey, this.current().range, "CAIE");
      return void 0;
    }
    finishStatement(ruleId) {
      if (this.current().kind === "comment")
        this.advance();
      if (this.current().kind === "newline") {
        this.advance();
        return;
      }
      if (this.current().kind === "eof")
        return;
      this.report("PC2106", ruleId, "parser.statement.unexpectedTrailingToken", this.current().range, "Editor Runtime", "error", {
        token: this.current().text
      });
      this.recoverLine();
    }
    /** 这个 token 能不能作为一个新表达式的开头。用来识别「本该有逗号」的位置。 */
    startsExpression(token) {
      if (token.kind === "identifier" || token.kind === "string" || token.kind === "char")
        return true;
      if (token.kind === "integer" || token.kind === "real" || token.kind === "date")
        return true;
      if (token.kind === "boolean")
        return true;
      if (token.kind === "keyword")
        return token.normalized === "NOT";
      return token.kind === "operator" && (token.text === "(" || token.text === "-");
    }
    isLineEnd() {
      return this.current().kind === "newline" || this.current().kind === "comment" || this.current().kind === "eof";
    }
    recoverLine() {
      let end = this.current().range.end;
      while (!this.isLineEnd())
        end = this.advance().range.end;
      if (this.current().kind === "comment")
        end = this.advance().range.end;
      if (this.current().kind === "newline")
        this.advance();
      return end;
    }
    ruleForUnsupportedKeyword(keyword) {
      const rules = {
        IF: "IF-001",
        CASE: "CASE-001",
        FOR: "FOR-001",
        REPEAT: "REPEAT-001",
        WHILE: "WHILE-001",
        PROCEDURE: "PROC-001",
        FUNCTION: "FUNC-001",
        CALL: "PROC-001",
        RETURN: "FUNC-001",
        OPENFILE: "FILE-001",
        READFILE: "FILE-002",
        WRITEFILE: "FILE-003",
        CLOSEFILE: "FILE-003",
        SEEK: "FILE-005",
        GETRECORD: "FILE-005",
        PUTRECORD: "FILE-005",
        TYPE: "UDT-003",
        CLASS: "OOP-001"
      };
      return rules[keyword] ?? "OP-001";
    }
    report(code, ruleId, messageKey, range, origin, severity = "error", args, fix) {
      if (this.diagnostics.length >= this.maxDiagnostics)
        return;
      this.diagnostics.push({ code, ruleId, messageKey, range, origin, severity, ...args ? { args } : {}, ...fix ? { fix } : {} });
    }
  };
  function parse(tokens, options = {}) {
    return new ProgramParser(tokens, options).parse();
  }
  function parseSource(source, options = {}) {
    const tokenized = tokenize(source);
    const parsed = parse(tokenized.tokens, options);
    return {
      program: parsed.program,
      diagnostics: [...tokenized.diagnostics, ...parsed.diagnostics].sort((a, b) => a.range.start.offset - b.range.start.offset || a.code.localeCompare(b.code)).filter((diagnostic, index, all) => !all.slice(0, index).some((earlier) => earlier.ruleId === diagnostic.ruleId && earlier.range.start.offset === diagnostic.range.start.offset && earlier.range.end.offset === diagnostic.range.end.offset)).slice(0, Math.max(1, options.maxDiagnostics ?? 50))
    };
  }

  // packages/language/dist/binder.js
  var UNKNOWN_TYPE = Object.freeze({ kind: "unknown" });
  function typeFromReference(reference, resolveNamed) {
    switch (reference.kind) {
      case "PrimitiveTypeReference":
        return { kind: "primitive", name: reference.name };
      case "NamedTypeReference":
        return resolveNamed?.(reference.normalizedName) ?? { kind: "named", name: reference.name, normalizedName: reference.normalizedName };
      case "ArrayTypeReference":
        return {
          kind: "array",
          dimensions: reference.dimensions.map(({ lower, upper }) => ({ lower: integerLiteral(lower), upper: integerLiteral(upper) })),
          elementType: typeFromReference(reference.elementType, resolveNamed)
        };
      case "ErrorTypeReference":
        return UNKNOWN_TYPE;
    }
  }
  function integerLiteral(expression) {
    return expression.kind === "LiteralExpression" && expression.literalType === "INTEGER" ? expression.value : void 0;
  }
  function constantType(expression) {
    return expression.kind === "LiteralExpression" ? { kind: "primitive", name: expression.literalType } : UNKNOWN_TYPE;
  }
  function parameterTypes(parameters, resolveNamed) {
    return parameters.map((parameter) => ({
      name: parameter.name,
      mode: parameter.mode,
      type: typeFromReference(parameter.typeReference, resolveNamed)
    }));
  }
  function builtinSymbols() {
    const symbols = BUILTINS.map((builtin) => ({
      name: builtin.name,
      normalizedName: builtin.name,
      kind: "function",
      type: {
        kind: "function",
        parameters: builtin.parameters.map((name, index) => ({
          name: `arg${index + 1}`,
          mode: "BYVAL",
          type: { kind: "primitive", name }
        })),
        returns: { kind: "primitive", name: builtin.returns }
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
  function bind(program, options = {}) {
    const maxDiagnostics = Math.max(1, options.maxDiagnostics ?? 50);
    const diagnostics = [];
    const symbols = [];
    const references = [];
    const globalScope = { id: "global", symbols: /* @__PURE__ */ new Map() };
    const builtins = new Map(builtinSymbols().map((symbol) => [symbol.normalizedName, symbol]));
    const report = (diagnostic) => {
      if (diagnostics.length < maxDiagnostics)
        diagnostics.push(diagnostic);
    };
    const add = (scope, symbol) => {
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
    const recordTypes = /* @__PURE__ */ new Map();
    const enumTypes = /* @__PURE__ */ new Map();
    const pointerTypes = /* @__PURE__ */ new Map();
    const classTypes = /* @__PURE__ */ new Map();
    const setTypes = /* @__PURE__ */ new Map();
    for (const statement of program.body) {
      if (statement.kind !== "RecordTypeDeclaration" && statement.kind !== "EnumTypeDeclaration" && statement.kind !== "PointerTypeDeclaration" && statement.kind !== "ClassDeclaration" && statement.kind !== "SetTypeDeclaration")
        continue;
      const declaredType = statement.kind === "RecordTypeDeclaration" ? { kind: "record", name: statement.name, normalizedName: statement.normalizedName, fields: [] } : statement.kind === "EnumTypeDeclaration" ? { kind: "enum", name: statement.name, normalizedName: statement.normalizedName, members: statement.members.map(({ normalizedName }) => normalizedName) } : statement.kind === "PointerTypeDeclaration" ? { kind: "pointer", target: UNKNOWN_TYPE } : statement.kind === "ClassDeclaration" ? { kind: "class", name: statement.name, normalizedName: statement.normalizedName, members: [] } : { kind: "set", name: statement.name, normalizedName: statement.normalizedName, elementType: UNKNOWN_TYPE };
      if (add(globalScope, {
        name: statement.name,
        normalizedName: statement.normalizedName,
        kind: "type",
        type: declaredType,
        declaration: statement.nameRange,
        scopeId: "global",
        mutable: false
      })) {
        if (statement.kind === "RecordTypeDeclaration")
          recordTypes.set(statement, declaredType);
        else if (statement.kind === "EnumTypeDeclaration")
          enumTypes.set(statement, declaredType);
        else if (statement.kind === "PointerTypeDeclaration")
          pointerTypes.set(statement, declaredType);
        else if (statement.kind === "ClassDeclaration")
          classTypes.set(statement, declaredType);
        else
          setTypes.set(statement, declaredType);
      }
    }
    const resolveNamed = (normalizedName) => {
      const symbol = globalScope.symbols.get(normalizedName);
      return symbol?.kind === "type" ? symbol.type : void 0;
    };
    for (const [declaration, recordType] of recordTypes) {
      const fieldScope = {
        id: `record:${declaration.normalizedName}@${declaration.nameRange.start.offset}`,
        symbols: /* @__PURE__ */ new Map()
      };
      for (const field of declaration.fields) {
        const fieldType = typeFromReference(field.typeReference, resolveNamed);
        const symbol = {
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
          for (let current = base; current; current = current.base) {
            if (current === classType) {
              circular = true;
              break;
            }
          }
          if (circular) {
            report({
              code: "PC4033",
              ruleId: "OOP-002",
              severity: "error",
              origin: "CAIE",
              messageKey: "binding.class.circularInheritance",
              args: { name: declaration.name },
              range: declaration.baseNameRange ?? declaration.nameRange
            });
          } else
            classType.base = base;
        } else
          report({
            code: "PC4032",
            ruleId: "OOP-002",
            severity: "error",
            origin: "CAIE",
            messageKey: "binding.class.unknownBase",
            args: { name: declaration.baseName ?? "" },
            range: declaration.baseNameRange ?? declaration.nameRange
          });
      }
      for (const member of declaration.members) {
        const memberType = member.kind === "ClassField" ? {
          name: member.name,
          normalizedName: member.normalizedName,
          kind: "field",
          access: member.access,
          ownerNormalizedName: declaration.normalizedName,
          type: typeFromReference(member.typeReference, resolveNamed),
          declaration: member.nameRange
        } : member.kind === "ProcedureDeclaration" ? {
          name: member.name,
          normalizedName: member.normalizedName,
          kind: "procedure",
          access: member.access ?? "PUBLIC",
          ownerNormalizedName: declaration.normalizedName,
          type: { kind: "procedure", parameters: parameterTypes(member.parameters, resolveNamed) },
          declaration: member.nameRange
        } : {
          name: member.name,
          normalizedName: member.normalizedName,
          kind: "function",
          access: member.access ?? "PUBLIC",
          ownerNormalizedName: declaration.normalizedName,
          type: {
            kind: "function",
            parameters: parameterTypes(member.parameters, resolveNamed),
            returns: typeFromReference(member.returnType, resolveNamed)
          },
          declaration: member.nameRange
        };
        if (classType.members.some(({ normalizedName }) => normalizedName === memberType.normalizedName)) {
          report({
            code: "PC3001",
            ruleId: "OOP-001",
            severity: "error",
            origin: "CAIE",
            messageKey: "binding.duplicateDeclaration",
            args: { name: memberType.name },
            range: memberType.declaration
          });
        } else
          classType.members.push(memberType);
      }
    }
    for (const statement of program.body) {
      if (statement.kind !== "ProcedureDeclaration" && statement.kind !== "FunctionDeclaration")
        continue;
      add(globalScope, {
        name: statement.name,
        normalizedName: statement.normalizedName,
        kind: statement.kind === "ProcedureDeclaration" ? "procedure" : "function",
        type: statement.kind === "ProcedureDeclaration" ? { kind: "procedure", parameters: parameterTypes(statement.parameters, resolveNamed) } : {
          kind: "function",
          parameters: parameterTypes(statement.parameters, resolveNamed),
          returns: typeFromReference(statement.returnType, resolveNamed)
        },
        declaration: statement.nameRange,
        scopeId: "global",
        mutable: false
      });
    }
    const declarationSymbol = (statement, scope) => ({
      name: statement.name,
      normalizedName: statement.normalizedName,
      kind: statement.kind === "DeclareStatement" ? "variable" : "constant",
      type: statement.kind === "DeclareStatement" ? typeFromReference(statement.typeReference, resolveNamed) : constantType(statement.value),
      declaration: statement.nameRange,
      scopeId: scope.id,
      mutable: statement.kind === "DeclareStatement"
    });
    const collectOrdinary = (statements, scope) => {
      for (const statement of statements) {
        if (statement.kind === "DeclareStatement" || statement.kind === "ConstantStatement")
          add(scope, declarationSymbol(statement, scope));
        if (statement.kind === "DefineSetStatement")
          add(scope, {
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
    collectOrdinary(program.body.filter((statement) => statement.kind !== "ProcedureDeclaration" && statement.kind !== "FunctionDeclaration" && statement.kind !== "RecordTypeDeclaration" && statement.kind !== "EnumTypeDeclaration" && statement.kind !== "PointerTypeDeclaration" && statement.kind !== "ClassDeclaration" && statement.kind !== "SetTypeDeclaration"), globalScope);
    const routineScopes = /* @__PURE__ */ new Map();
    for (const statement of program.body) {
      if (statement.kind !== "ProcedureDeclaration" && statement.kind !== "FunctionDeclaration")
        continue;
      const scope = { id: `routine:${statement.normalizedName}@${statement.nameRange.start.offset}`, symbols: /* @__PURE__ */ new Map(), parent: globalScope };
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
      const classScope = {
        id: `class:${declaration.normalizedName}@${declaration.nameRange.start.offset}`,
        symbols: /* @__PURE__ */ new Map(),
        parent: globalScope
      };
      const inherited = [];
      for (let base = classType.base; base; base = base.base)
        inherited.push(...base.members);
      for (const member of inherited.reverse()) {
        classScope.symbols.set(member.normalizedName, {
          name: member.name,
          normalizedName: member.normalizedName,
          kind: member.kind === "field" ? "field" : member.kind,
          type: member.type,
          declaration: member.declaration,
          scopeId: classScope.id,
          mutable: member.kind === "field"
        });
      }
      for (const member of classType.members) {
        classScope.symbols.set(member.normalizedName, {
          name: member.name,
          normalizedName: member.normalizedName,
          kind: member.kind === "field" ? "field" : member.kind,
          type: member.type,
          declaration: member.declaration,
          scopeId: classScope.id,
          mutable: member.kind === "field"
        });
      }
      if (classType.base) {
        classScope.symbols.set("SUPER", {
          name: "SUPER",
          normalizedName: "SUPER",
          kind: "variable",
          type: classType.base,
          declaration: declaration.baseNameRange ?? declaration.nameRange,
          scopeId: classScope.id,
          mutable: false
        });
      }
      for (const member of declaration.members) {
        if (member.kind !== "ProcedureDeclaration" && member.kind !== "FunctionDeclaration")
          continue;
        const scope = {
          id: `method:${declaration.normalizedName}.${member.normalizedName}@${member.nameRange.start.offset}`,
          symbols: /* @__PURE__ */ new Map(),
          parent: classScope
        };
        routineScopes.set(member, scope);
        for (const parameter of member.parameters) {
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
        collectOrdinary(member.body, scope);
      }
    }
    const resolve = (name, scope) => {
      for (let current = scope; current; current = current.parent) {
        const symbol = current.symbols.get(name);
        if (symbol && symbol.kind !== "type")
          return symbol;
      }
      return builtins.get(name);
    };
    const visit = (expression, scope) => {
      switch (expression.kind) {
        case "NameExpression": {
          const symbol = resolve(expression.normalizedName, scope);
          references.push({ name: expression.name, normalizedName: expression.normalizedName, range: expression.range, ...symbol ? { symbol } : {} });
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
        case "UnaryExpression":
          visit(expression.operand, scope);
          break;
        case "BinaryExpression":
          visit(expression.left, scope);
          visit(expression.right, scope);
          break;
        case "CallExpression":
          visit(expression.callee, scope);
          expression.arguments.forEach((argument) => visit(argument, scope));
          break;
        case "NewExpression":
          expression.arguments.forEach((argument) => visit(argument, scope));
          break;
        case "IndexExpression":
          visit(expression.target, scope);
          expression.indices.forEach((index) => visit(index, scope));
          break;
        case "MemberExpression":
          visit(expression.target, scope);
          break;
        case "ErrorExpression":
          if (expression.recovered)
            visit(expression.recovered, scope);
          break;
        case "LiteralExpression":
          break;
      }
    };
    const visitTypeReference = (reference, scope) => {
      if (reference.kind !== "ArrayTypeReference")
        return;
      reference.dimensions.forEach(({ lower, upper }) => {
        visit(lower, scope);
        visit(upper, scope);
      });
      visitTypeReference(reference.elementType, scope);
    };
    const bindStatements = (statements, scope) => {
      for (const statement of statements)
        switch (statement.kind) {
          case "AssignmentStatement":
            visit(statement.target, scope);
            visit(statement.value, scope);
            break;
          case "InputStatement":
            visit(statement.target, scope);
            break;
          case "OutputStatement":
            statement.values.forEach((value) => visit(value, scope));
            break;
          case "OpenFileStatement":
            visit(statement.file, scope);
            break;
          case "ReadFileStatement":
            visit(statement.file, scope);
            visit(statement.target, scope);
            break;
          case "WriteFileStatement":
            visit(statement.file, scope);
            visit(statement.data, scope);
            break;
          case "CloseFileStatement":
            visit(statement.file, scope);
            break;
          case "SeekStatement":
            visit(statement.file, scope);
            visit(statement.address, scope);
            break;
          case "GetRecordStatement":
            visit(statement.file, scope);
            visit(statement.target, scope);
            break;
          case "PutRecordStatement":
            visit(statement.file, scope);
            visit(statement.data, scope);
            break;
          case "ConstantStatement":
            visit(statement.value, scope);
            break;
          case "DeclareStatement":
            visitTypeReference(statement.typeReference, scope);
            break;
          case "RecordTypeDeclaration":
            statement.fields.forEach((field) => visitTypeReference(field.typeReference, scope));
            break;
          case "PointerTypeDeclaration":
            visitTypeReference(statement.targetType, scope);
            break;
          case "EnumTypeDeclaration":
            break;
          case "SetTypeDeclaration":
            visitTypeReference(statement.elementType, scope);
            break;
          case "DefineSetStatement":
            statement.values.forEach((value) => visit(value, scope));
            visitTypeReference(statement.typeReference, scope);
            break;
          case "ClassDeclaration":
            statement.members.forEach((member) => {
              if (member.kind === "ClassField")
                visitTypeReference(member.typeReference, scope);
              else {
                const methodScope = routineScopes.get(member);
                if (methodScope)
                  bindStatements(member.body, methodScope);
              }
            });
            break;
          case "MethodCallStatement":
            visit(statement.call, scope);
            break;
          case "IfStatement":
            visit(statement.condition, scope);
            bindStatements(statement.thenBranch, scope);
            bindStatements(statement.elseBranch, scope);
            break;
          case "CaseStatement":
            visit(statement.selector, scope);
            statement.clauses.forEach((clause) => {
              clause.labels.forEach((label) => label.kind === "CaseValueLabel" ? visit(label.value, scope) : (visit(label.lower, scope), visit(label.upper, scope)));
              bindStatements(clause.body, scope);
            });
            break;
          case "ForStatement":
            visit(statement.control, scope);
            visit(statement.startValue, scope);
            visit(statement.endValue, scope);
            if (statement.step)
              visit(statement.step, scope);
            bindStatements(statement.body, scope);
            break;
          case "WhileStatement":
            visit(statement.condition, scope);
            bindStatements(statement.body, scope);
            break;
          case "RepeatStatement":
            bindStatements(statement.body, scope);
            visit(statement.condition, scope);
            break;
          case "CallStatement":
            visit(statement.target, scope);
            statement.arguments.forEach((argument) => visit(argument, scope));
            break;
          case "ReturnStatement":
            visit(statement.value, scope);
            break;
          case "ProcedureDeclaration":
          case "FunctionDeclaration": {
            const routineScope = routineScopes.get(statement);
            if (routineScope)
              bindStatements(statement.body, routineScope);
            break;
          }
          case "ErrorStatement":
            break;
        }
    };
    bindStatements(program.body, globalScope);
    return { symbols, references, diagnostics };
  }

  // packages/language/dist/checker.js
  var primitive = (name) => ({ kind: "primitive", name });
  function check(program, binding, options = {}) {
    const maxDiagnostics = Math.max(1, options.maxDiagnostics ?? 50);
    const diagnostics = [];
    const expressionTypes = [];
    const references = new Map(binding.references.filter(({ symbol }) => symbol).map((reference) => [reference.range.start.offset, reference.symbol]));
    const typeSymbols = new Map(binding.symbols.filter(({ kind }) => kind === "type").map((symbol) => [symbol.normalizedName, symbol.type]));
    const fileModes = /* @__PURE__ */ new Map();
    let currentClass;
    const resolveNamed = (normalizedName) => typeSymbols.get(normalizedName);
    const report = (code, ruleId, messageKey, range, origin = "CAIE", args, related, severity = "error") => {
      if (diagnostics.length >= maxDiagnostics)
        return;
      diagnostics.push({ code, ruleId, severity, origin, messageKey, range, ...args ? { args } : {}, ...related ? { related } : {} });
    };
    const record = (expression, type) => {
      expressionTypes.push({ expression, type });
      return type;
    };
    const infer = (expression) => {
      switch (expression.kind) {
        case "LiteralExpression":
          return record(expression, primitive(expression.literalType));
        case "NameExpression":
          return record(expression, references.get(expression.range.start.offset)?.type ?? UNKNOWN_TYPE);
        case "ErrorExpression":
          return record(expression, UNKNOWN_TYPE);
        case "MemberExpression": {
          const target = infer(expression.target);
          if (target.kind === "unknown")
            return record(expression, UNKNOWN_TYPE);
          if (target.kind === "class") {
            const member = findClassMember(target, expression.normalizedMember);
            if (!member) {
              report("PC4025", "OOP-004", "type.class.unknownMember", expression.memberRange, "CAIE", {
                class: target.name,
                member: expression.member
              });
              return record(expression, UNKNOWN_TYPE);
            }
            if (member.access === "PRIVATE" && currentClass?.normalizedName !== member.ownerNormalizedName) {
              report("PC4034", "OOP-001", "type.class.privateMember", expression.memberRange, "CAIE", {
                class: target.name,
                member: expression.member
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
          if (target.kind === "unknown")
            return record(expression, UNKNOWN_TYPE);
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
            const literal = integerLiteral2(expression.indices[index]);
            const dimension = target.dimensions[index];
            if (literal !== void 0 && dimension && dimension.lower !== void 0 && dimension.upper !== void 0 && (literal < dimension.lower || literal > dimension.upper)) {
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
            if (calleeType.kind !== "unknown")
              report("PC4035", "OOP-004", "type.call.notCallable", expression.callee.range);
            return record(expression, UNKNOWN_TYPE);
          }
          const isEof = expression.callee.kind === "NameExpression" && expression.callee.normalizedName === "EOF";
          const ruleId = isEof ? "FILE-002" : expression.callee.kind === "NameExpression" && isBuiltin(expression.callee.normalizedName) ? "BUILTIN-001" : "PROC-002";
          validateArguments(expression.arguments, argumentTypes, calleeType.parameters, ruleId, report, references, expression.range);
          if (isEof && expression.arguments[0])
            checkKnownFileMode(expression.arguments[0], ["READ"], "FILE-002", "type.file.eofRequiresReadMode");
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
              expected: 0,
              actual: expression.arguments.length
            });
          }
          return record(expression, classType);
        }
        case "UnaryExpression": {
          const operand = infer(expression.operand);
          if (expression.operator === "^") {
            if (expression.postfix) {
              if (operand.kind === "pointer")
                return record(expression, operand.target);
              if (operand.kind !== "unknown")
                report("PC4000", "UDT-002", "type.pointer.dereferenceRequiresPointer", expression.range);
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
            if (!isPrimitive(left, "BOOLEAN") && left.kind !== "unknown" || !isPrimitive(right, "BOOLEAN") && right.kind !== "unknown") {
              report("PC4004", "OP-004", "type.logical.requiresBoolean", expression.range);
            }
            return record(expression, primitive("BOOLEAN"));
          }
          if (expression.operator === "&") {
            if (!isPrimitive(left, "STRING") && left.kind !== "unknown" || !isPrimitive(right, "STRING") && right.kind !== "unknown") {
              report("PC4003", "OP-005", "type.concatenation.requiresStrings", expression.range);
            }
            return record(expression, primitive("STRING"));
          }
          if ([">", "<", ">=", "<=", "=", "<>"].includes(expression.operator)) {
            if ([">", "<", ">=", "<="].includes(expression.operator) && (left.kind === "enum" || right.kind === "enum")) {
              report("PC4037", "UDT-001", "type.enum.orderedComparison", expression.range);
              return record(expression, primitive("BOOLEAN"));
            }
            if (!areComparable(left, right)) {
              report("PC4002", "OP-003", "type.relation.incompatibleOperands", expression.range, "CAIE", {
                left: displayType(left),
                right: displayType(right)
              });
            }
            return record(expression, primitive("BOOLEAN"));
          }
          if (["DIV", "MOD"].includes(expression.operator)) {
            if (!isPrimitive(left, "INTEGER") && left.kind !== "unknown" || !isPrimitive(right, "INTEGER") && right.kind !== "unknown") {
              report("PC4001", "OP-001", "type.integerOperator.requiresIntegers", expression.range);
            }
            return record(expression, primitive("INTEGER"));
          }
          const enumOrdinalArithmetic = left.kind === "enum" && isPrimitive(right, "INTEGER") && (expression.operator === "+" || expression.operator === "-");
          if (enumOrdinalArithmetic)
            return record(expression, left);
          if (!isNumeric(left) || !isNumeric(right)) {
            if (left.kind !== "unknown" && right.kind !== "unknown") {
              const looksLikeConcatenation = expression.operator === "+" && (isPrimitive(left, "STRING") || isPrimitive(right, "STRING") || isPrimitive(left, "CHAR") || isPrimitive(right, "CHAR"));
              if (looksLikeConcatenation) {
                report("PC4003", "OP-005", "type.arithmetic.stringPlus", expression.range);
              } else {
                report("PC4001", "OP-001", "type.arithmetic.requiresNumeric", expression.range, "CAIE", {
                  left: displayType(left),
                  right: displayType(right)
                });
              }
            }
            return record(expression, UNKNOWN_TYPE);
          }
          return record(expression, expression.operator === "/" || isPrimitive(left, "REAL") || isPrimitive(right, "REAL") ? primitive("REAL") : primitive("INTEGER"));
        }
      }
    };
    const requireBoolean = (expression, ruleId) => {
      const type = infer(expression);
      if (!isPrimitive(type, "BOOLEAN") && type.kind !== "unknown") {
        report("PC4013", ruleId, "type.condition.requiresBoolean", expression.range, "CAIE", {
          actual: displayType(type)
        });
      }
    };
    const requireInteger = (expression, ruleId, messageKey) => {
      const type = infer(expression);
      if (!isPrimitive(type, "INTEGER") && type.kind !== "unknown")
        report("PC4014", ruleId, messageKey, expression.range);
    };
    const requireString = (expression, ruleId, messageKey) => {
      const type = infer(expression);
      if (!isPrimitive(type, "STRING") && type.kind !== "unknown")
        report("PC4027", ruleId, messageKey, expression.range);
      return type;
    };
    function checkKnownFileMode(file, allowed, ruleId, messageKey) {
      const name = literalFileName(file);
      if (name === void 0)
        return;
      const actual = fileModes.get(normalizeFileName(name));
      if (!actual || !allowed.includes(actual)) {
        report("PC4029", ruleId, messageKey, file.range, "Editor Runtime", {
          file: name,
          expected: allowed.join(" or "),
          actual: actual ?? "CLOSED"
        });
      }
    }
    const checkWithRestoredFileModes = (callback, startEmpty = false) => {
      const saved = new Map(fileModes);
      if (startEmpty)
        fileModes.clear();
      callback();
      fileModes.clear();
      saved.forEach((mode, name) => fileModes.set(name, mode));
    };
    const checkStatements = (statements, context) => {
      for (const statement of statements)
        switch (statement.kind) {
          case "DeclareStatement":
            checkTypeReference(statement.typeReference, infer, report, resolveNamed);
            break;
          case "RecordTypeDeclaration":
            statement.fields.forEach((field) => checkTypeReference(field.typeReference, infer, report, resolveNamed));
            break;
          case "PointerTypeDeclaration":
            checkTypeReference(statement.targetType, infer, report, resolveNamed);
            break;
          case "EnumTypeDeclaration":
            break;
          case "SetTypeDeclaration":
            checkTypeReference(statement.elementType, infer, report, resolveNamed);
            break;
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
                    expected: displayType(setType.elementType),
                    actual: displayType(valueType)
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
              currentClass = classType?.kind === "class" ? classType : void 0;
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
          case "ConstantStatement":
            infer(statement.value);
            break;
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
            if (root && !root.mutable)
              report("PC4009", "ASSIGN-003", "type.assignment.constantTarget", statement.target.range);
            break;
          }
          case "OutputStatement":
            statement.values.forEach(infer);
            break;
          case "OpenFileStatement": {
            requireString(statement.file, "FILE-001", "type.file.nameRequiresString");
            const name = literalFileName(statement.file);
            if (name !== void 0) {
              const key = normalizeFileName(name);
              const existing = fileModes.get(key);
              if (existing) {
                report("PC4028", "FILE-004", "type.file.alreadyOpen", statement.file.range, "CAIE", {
                  file: name,
                  mode: existing
                }, void 0, "caie");
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
            if (root && !root.mutable)
              report("PC4009", "ASSIGN-003", "type.assignment.constantTarget", statement.target.range);
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
            if (name !== void 0) {
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
            const address = integerLiteral2(statement.address);
            if (address !== void 0 && address < 1) {
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
            if (root && !root.mutable)
              report("PC4009", "ASSIGN-003", "type.assignment.constantTarget", statement.target.range);
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
                  if (!areComparable(selectorType, labelType))
                    report("PC4015", "CASE-001", "type.case.labelMismatch", label.range);
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
              if (integerLiteral2(statement.step) === 0) {
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
              report("PC4022", "FUNC-001", "type.function.notAllPathsReturn", statement.nameRange, "Editor Runtime", { name: statement.name }, [{ messageKey: "type.function.declaration", range: statement.range }]);
            }
            break;
          }
          case "ErrorStatement":
            break;
        }
    };
    checkStatements(program.body);
    return { expressionTypes, diagnostics };
  }
  function checkTypeReference(reference, infer, report, resolveNamed) {
    if (reference.kind === "NamedTypeReference") {
      if (resolveNamed && !resolveNamed(reference.normalizedName)) {
        report("PC4026", "UDT-005", "type.named.unknownType", reference.range, "CAIE", { name: reference.name });
      }
      return;
    }
    if (reference.kind !== "ArrayTypeReference")
      return;
    for (const dimension of reference.dimensions) {
      const lowerType = infer(dimension.lower);
      const upperType = infer(dimension.upper);
      if (!isPrimitive(lowerType, "INTEGER") && lowerType.kind !== "unknown" || !isPrimitive(upperType, "INTEGER") && upperType.kind !== "unknown") {
        report("PC4007", "ARRAY-002", "type.arrayBounds.requireIntegers", dimension.range);
      }
      const lower = integerLiteral2(dimension.lower);
      const upper = integerLiteral2(dimension.upper);
      if (lower !== void 0 && upper !== void 0 && lower > upper) {
        report("PC4012", "ARRAY-002", "type.arrayBounds.invalidOrder", dimension.range, "Editor Runtime", { lower, upper });
      }
    }
    checkTypeReference(reference.elementType, infer, report, resolveNamed);
  }
  function rootSymbol(expression, references) {
    if (expression.kind === "NameExpression")
      return references.get(expression.range.start.offset);
    if (expression.kind === "IndexExpression" || expression.kind === "MemberExpression")
      return rootSymbol(expression.target, references);
    if (expression.kind === "UnaryExpression")
      return rootSymbol(expression.operand, references);
    return void 0;
  }
  function integerLiteral2(expression) {
    return expression.kind === "LiteralExpression" && expression.literalType === "INTEGER" ? expression.value : void 0;
  }
  function literalFileName(expression) {
    return expression.kind === "LiteralExpression" && expression.literalType === "STRING" ? expression.value : void 0;
  }
  function normalizeFileName(name) {
    return name.toLocaleUpperCase("en-US");
  }
  function isPrimitive(type, name) {
    return type.kind === "primitive" && type.name === name;
  }
  function isNumeric(type) {
    return isPrimitive(type, "INTEGER") || isPrimitive(type, "REAL");
  }
  function areComparable(left, right) {
    if (left.kind === "unknown" || right.kind === "unknown")
      return true;
    if (isNumeric(left) && isNumeric(right))
      return true;
    if (left.kind === "enum" && right.kind === "enum")
      return left.normalizedName === right.normalizedName;
    return left.kind === "primitive" && right.kind === "primitive" && left.name === right.name;
  }
  function isAssignable(target, value) {
    if (target.kind === "unknown" || value.kind === "unknown")
      return true;
    if (target.kind === "primitive" && value.kind === "primitive") {
      return target.name === value.name || target.name === "REAL" && value.name === "INTEGER";
    }
    if (target.kind === "named" && value.kind === "named")
      return target.normalizedName === value.normalizedName;
    if (target.kind === "record" && value.kind === "record")
      return target.normalizedName === value.normalizedName;
    if (target.kind === "enum" && value.kind === "enum")
      return target.normalizedName === value.normalizedName;
    if (target.kind === "pointer" && value.kind === "pointer")
      return isAssignable(target.target, value.target);
    if (target.kind === "set" && value.kind === "set")
      return target.normalizedName === value.normalizedName;
    if (target.kind === "class" && value.kind === "class") {
      for (let current = value; current; current = current.base) {
        if (current.normalizedName === target.normalizedName)
          return true;
      }
      return false;
    }
    if (target.kind === "array" && value.kind === "array") {
      return target.dimensions.length === value.dimensions.length && target.dimensions.every((dimension, index) => dimension.lower === value.dimensions[index].lower && dimension.upper === value.dimensions[index].upper) && isAssignable(target.elementType, value.elementType);
    }
    return false;
  }
  function validateArguments(expressions, types, parameters, ruleId, report, references, callSiteRange) {
    const callRange = expressions.length > 0 ? { start: expressions[0].range.start, end: expressions.at(-1).range.end } : callSiteRange;
    if (expressions.length !== parameters.length) {
      report("PC4010", ruleId, "type.call.argumentCount", callRange, "CAIE", { expected: parameters.length, actual: expressions.length });
    }
    expressions.forEach((expression, index) => {
      const parameter = parameters[index];
      if (!parameter)
        return;
      if (parameter.mode === "BYREF") {
        const symbol = rootSymbol(expression, references);
        if (!isWritableExpression(expression) || symbol && !symbol.mutable) {
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
  function isWritableExpression(expression) {
    if (expression.kind === "NameExpression")
      return true;
    if (expression.kind === "IndexExpression" || expression.kind === "MemberExpression")
      return isWritableExpression(expression.target);
    return expression.kind === "UnaryExpression" && expression.postfix === true && expression.operator === "^";
  }
  function blockGuaranteesReturn(statements) {
    return statements.some(statementGuaranteesReturn);
  }
  function statementGuaranteesReturn(statement) {
    if (statement.kind === "ReturnStatement")
      return true;
    if (statement.kind === "IfStatement") {
      return statement.elseBranch.length > 0 && blockGuaranteesReturn(statement.thenBranch) && blockGuaranteesReturn(statement.elseBranch);
    }
    if (statement.kind === "CaseStatement") {
      return statement.clauses.some(({ isOtherwise }) => isOtherwise) && statement.clauses.length > 0 && statement.clauses.every((clause) => blockGuaranteesReturn(clause.body));
    }
    if (statement.kind === "RepeatStatement")
      return blockGuaranteesReturn(statement.body);
    return false;
  }
  function displayType(type) {
    if (type.kind === "primitive")
      return type.name;
    if (type.kind === "named")
      return type.name;
    if (type.kind === "enum")
      return type.name;
    if (type.kind === "pointer")
      return `^${displayType(type.target)}`;
    if (type.kind === "set")
      return type.name;
    if (type.kind === "class")
      return type.name;
    if (type.kind === "record")
      return type.name;
    if (type.kind === "array")
      return "ARRAY";
    if (type.kind === "function")
      return "FUNCTION";
    if (type.kind === "procedure")
      return "PROCEDURE";
    return "UNKNOWN";
  }
  function findClassMember(type, normalizedName) {
    return type.members.find((member) => member.normalizedName === normalizedName) ?? (type.base ? findClassMember(type.base, normalizedName) : void 0);
  }

  // packages/language/dist/formatter.js
  var OPENERS = /* @__PURE__ */ new Set(["IF", "FOR", "WHILE", "REPEAT", "PROCEDURE", "FUNCTION", "TYPE", "CLASS", "CASE"]);
  var CLOSERS = /* @__PURE__ */ new Map([
    ["ENDIF", "IF"],
    ["NEXT", "FOR"],
    ["ENDWHILE", "WHILE"],
    ["UNTIL", "REPEAT"],
    ["ENDPROCEDURE", "PROCEDURE"],
    ["ENDFUNCTION", "FUNCTION"],
    ["ENDTYPE", "TYPE"],
    ["ENDCLASS", "CLASS"],
    ["ENDCASE", "CASE"]
  ]);
  function checkFormatting(source, options = {}) {
    return format(source, options).diagnostics;
  }
  function format(source, options = {}) {
    const tokenized = tokenize(source);
    const normalizedSource = tokenized.normalizedSource;
    const lines = buildLines(normalizedSource, tokenized.tokens);
    assignExpectedDepths(lines);
    const diagnostics = [
      ...keywordCaseDiagnostics(normalizedSource, lines),
      ...indentationDiagnostics(lines, options),
      ...lineLengthDiagnostics(lines, options)
    ];
    const hasParseError = parseSource(normalizedSource).diagnostics.some(({ severity }) => severity === "error");
    const safeMode = hasParseError ? "token-only" : "full";
    const indent = " ".repeat(Math.max(1, options.indentSize ?? 3));
    const formattedLines = lines.map((line) => {
      const replaced = replaceTokensOnLine(line, true);
      if (replaced.trim().length === 0)
        return "";
      if (safeMode === "token-only" || line.continuation)
        return replaced;
      return indent.repeat(line.expectedDepth) + replaced.trimStart();
    });
    const formattedSource = formattedLines.join("\n");
    const changed = formattedSource !== normalizedSource;
    const end = tokenized.tokens.at(-1)?.range.end ?? { offset: normalizedSource.length, line: lines.length, column: 1 };
    return {
      formattedSource,
      diagnostics,
      edits: changed ? [{ range: { start: { offset: 0, line: 1, column: 1 }, end }, newText: formattedSource }] : [],
      changed,
      safeMode
    };
  }
  function buildLines(source, tokens) {
    const rawLines = source.split("\n");
    const starts = [];
    let offset = 0;
    rawLines.forEach((line) => {
      starts.push(offset);
      offset += line.length + 1;
    });
    const byLine = /* @__PURE__ */ new Map();
    for (const token of tokens) {
      if (token.kind === "newline" || token.kind === "eof")
        continue;
      const list = byLine.get(token.range.start.line) ?? [];
      list.push(token);
      byLine.set(token.range.start.line, list);
    }
    return rawLines.map((raw, index) => {
      const lineTokens = byLine.get(index + 1) ?? [];
      return {
        number: index + 1,
        startOffset: starts[index],
        raw,
        tokens: lineTokens,
        codeTokens: lineTokens.filter(({ kind }) => kind !== "comment"),
        expectedDepth: 0,
        continuation: false
      };
    });
  }
  function assignExpectedDepths(lines) {
    const frames = [];
    let delimiterDepth = 0;
    let continuationFromPrevious = false;
    for (const line of lines) {
      const tokens = line.codeTokens;
      if (tokens.length === 0) {
        line.expectedDepth = frames.length;
        line.continuation = continuationFromPrevious || delimiterDepth > 0;
        continue;
      }
      const first = normalized(tokens[0]);
      const structuralFirst = (first === "PUBLIC" || first === "PRIVATE") && tokens[1] ? normalized(tokens[1]) : first;
      line.continuation = continuationFromPrevious || delimiterDepth > 0;
      const isCaseClause = !line.continuation && isCaseClauseLine(tokens, frames);
      if (isCaseClause && frames.at(-1) === "CASE_CLAUSE")
        frames.pop();
      if (!line.continuation && first === "ENDCASE") {
        if (frames.at(-1) === "CASE_CLAUSE")
          frames.pop();
        popThrough(frames, "CASE");
      } else if (!line.continuation && CLOSERS.has(first)) {
        popThrough(frames, CLOSERS.get(first));
      }
      line.expectedDepth = !line.continuation && first === "ELSE" ? Math.max(0, frames.length - 1) : frames.length;
      const isSingleLineType = structuralFirst === "TYPE" && tokens.some(({ text }) => text === "=");
      if (!line.continuation && OPENERS.has(structuralFirst) && !isSingleLineType)
        frames.push(structuralFirst);
      if (isCaseClause && tokens.at(-1)?.text === ":")
        frames.push("CASE_CLAUSE");
      for (const token of tokens) {
        if (token.text === "(" || token.text === "[")
          delimiterDepth += 1;
        else if (token.text === ")" || token.text === "]")
          delimiterDepth = Math.max(0, delimiterDepth - 1);
      }
      const last = tokens.at(-1);
      continuationFromPrevious = delimiterDepth > 0 || last?.text === "," || last?.kind === "operator" && !["\u2190", "<-", "="].includes(last.text);
    }
  }
  function isCaseClauseLine(tokens, frames) {
    if (!frames.includes("CASE"))
      return false;
    const top = frames.at(-1);
    if (top !== "CASE" && top !== "CASE_CLAUSE")
      return false;
    const first = tokens[0];
    if (!(first.kind === "identifier" || ["integer", "real", "char", "string", "boolean", "date"].includes(first.kind) || normalized(first) === "OTHERWISE"))
      return false;
    return tokens.some(({ text }) => text === ":");
  }
  function popThrough(frames, expected) {
    while (frames.length > 0) {
      const frame = frames.pop();
      if (frame === expected)
        return;
    }
  }
  function normalized(token) {
    return token.normalized ?? token.text;
  }
  function isCaseToken(token) {
    return token.kind === "keyword" || token.kind === "type-name" || token.kind === "boolean" || token.kind === "operator" && /^[A-Za-z]+$/.test(token.text);
  }
  function replacement(token) {
    if (token.text === "<-")
      return "\u2190";
    if (isCaseToken(token))
      return normalized(token);
    return token.text;
  }
  function replaceTokensOnLine(line, includeArrow) {
    let output = line.raw;
    const replacements = line.tokens.filter((token) => isCaseToken(token) || includeArrow && token.text === "<-").sort((a, b) => b.range.start.offset - a.range.start.offset);
    for (const token of replacements) {
      const start = token.range.start.offset - line.startOffset;
      const end = token.range.end.offset - line.startOffset;
      output = output.slice(0, start) + replacement(token) + output.slice(end);
    }
    return output;
  }
  function keywordCaseDiagnostics(source, lines) {
    const diagnostics = [];
    for (const line of lines) {
      const mismatches = line.tokens.filter((token) => isCaseToken(token) && token.text !== normalized(token));
      if (mismatches.length === 0)
        continue;
      const first = mismatches[0];
      const last = mismatches.at(-1);
      const range = { start: first.range.start, end: last.range.end };
      diagnostics.push({
        code: "PC5001",
        ruleId: "FMT-004",
        severity: "caie",
        origin: "CAIE",
        messageKey: "format.keyword.requiresUppercase",
        args: { count: mismatches.length },
        range,
        fix: { range, newText: formatRange(source, range, mismatches) }
      });
    }
    return diagnostics;
  }
  function formatRange(source, range, tokens) {
    let output = source.slice(range.start.offset, range.end.offset);
    for (const token of [...tokens].sort((a, b) => b.range.start.offset - a.range.start.offset)) {
      const start = token.range.start.offset - range.start.offset;
      const end = token.range.end.offset - range.start.offset;
      output = output.slice(0, start) + replacement(token) + output.slice(end);
    }
    return output;
  }
  function indentationDiagnostics(lines, options) {
    const mode = options.indentationDiagnostics ?? "recommended";
    if (mode === "off")
      return [];
    const indentSize = Math.max(1, options.indentSize ?? 3);
    for (const line of lines) {
      if (line.continuation || line.codeTokens.length === 0)
        continue;
      const actual = line.raw.match(/^[ \t]*/)?.[0] ?? "";
      const expected = " ".repeat(line.expectedDepth * indentSize);
      if (actual === expected)
        continue;
      const end = line.codeTokens[0]?.range.start ?? {
        offset: line.startOffset + actual.length,
        line: line.number,
        column: actual.length + 1
      };
      const range = { start: { offset: line.startOffset, line: line.number, column: 1 }, end };
      return [{
        code: "PC5002",
        ruleId: "FMT-002",
        severity: mode === "strict" ? "caie" : "hint",
        origin: mode === "strict" ? "Editor Runtime" : "CAIE",
        messageKey: "format.indentation.recommended",
        args: { actual: actual.replace(/\t/g, "\\t"), expected: expected.length },
        range,
        fix: { range, newText: expected }
      }];
    }
    return [];
  }
  function lineLengthDiagnostics(lines, options) {
    if (options.maxLineLength === void 0)
      return [];
    const maximum = Math.max(1, options.maxLineLength);
    return lines.filter(({ raw }) => [...raw].length > maximum).map((line) => {
      const start = line.tokens[0]?.range.start ?? { offset: line.startOffset, line: line.number, column: 1 };
      const range = { start, end: line.tokens.at(-1)?.range.end ?? start };
      return {
        code: "PC5003",
        ruleId: "FMT-003",
        severity: "hint",
        origin: "Editor Runtime",
        messageKey: "format.line.exceedsEditorLimit",
        args: { maximum, actual: [...line.raw].length },
        range
      };
    });
  }

  // packages/language/dist/analyzer.js
  function analyzeBase(source, options) {
    const parsed = parseSource(source, options);
    const binding = bind(parsed.program, options);
    const checking = check(parsed.program, binding, options);
    const formatting = checkFormatting(source, options);
    const limit = Math.max(1, options.maxDiagnostics ?? 50);
    const diagnostics = [...parsed.diagnostics, ...binding.diagnostics, ...checking.diagnostics, ...formatting].sort((a, b) => a.range.start.offset - b.range.start.offset || a.code.localeCompare(b.code)).slice(0, limit);
    return { program: parsed.program, binding, checking, diagnostics };
  }
  function oneSwapAway(left, right) {
    if (left.length !== right.length)
      return false;
    let first = -1;
    for (let index = 0; index < left.length; index += 1) {
      if (left[index] === right[index])
        continue;
      if (first === -1) {
        first = index;
        continue;
      }
      if (index !== first + 1)
        return false;
      return left[first] === right[index] && left[index] === right[first] && left.slice(index + 1) === right.slice(index + 1);
    }
    return false;
  }
  function oneEditAway(left, right) {
    if (Math.abs(left.length - right.length) > 1)
      return false;
    let i = 0, j = 0, edits = 0;
    while (i < left.length && j < right.length) {
      if (left[i] === right[j]) {
        i += 1;
        j += 1;
        continue;
      }
      if (++edits > 1)
        return false;
      if (left.length > right.length)
        i += 1;
      else if (left.length < right.length)
        j += 1;
      else {
        i += 1;
        j += 1;
      }
    }
    return true;
  }
  function overlapsToken(diagnostic, start, end) {
    return diagnostic.range.start.offset < end && diagnostic.range.end.offset > start;
  }
  function keywordTypoHints(source, options, baselineDiagnostics, declaredNames2) {
    const baselineErrors = baselineDiagnostics.filter(({ severity }) => severity === "error").length;
    if (baselineErrors === 0)
      return [];
    const keywordVocabulary = [...KEYWORDS, ...TYPE_NAMES];
    const builtinVocabulary = BUILTINS.map((builtin) => builtin.name);
    const tokens = tokenize(source).tokens;
    return tokens.flatMap((token, tokenIndex) => {
      if (token.kind !== "identifier" || token.text.length < 3)
        return [];
      if (declaredNames2.has(token.text.toUpperCase()))
        return [];
      const upper = token.text.toUpperCase();
      if (keywordVocabulary.includes(upper) || builtinVocabulary.includes(upper))
        return [];
      const near = (word) => oneEditAway(upper, word) || oneSwapAway(upper, word);
      const nextMeaningful = tokens.slice(tokenIndex + 1).find((item) => item.kind !== "comment");
      const isCallPosition = !!nextMeaningful && nextMeaningful.text === "(";
      const candidates = [
        ...keywordVocabulary.filter(near),
        ...isCallPosition ? builtinVocabulary.filter(near) : []
      ];
      if (candidates.length === 0)
        return [];
      const originalAtToken = baselineDiagnostics.filter((diagnostic) => diagnostic.severity === "error" && /^PC[12]/.test(diagnostic.code) && overlapsToken(diagnostic, token.range.start.offset, token.range.end.offset)).length;
      const workable = candidates.filter((candidate) => {
        const corrected = source.slice(0, token.range.start.offset) + candidate + source.slice(token.range.end.offset);
        const correctedDiagnostics = analyzeBase(corrected, options).diagnostics;
        const correctedErrors = correctedDiagnostics.filter(({ severity }) => severity === "error").length;
        const correctedAtToken = correctedDiagnostics.filter((diagnostic) => diagnostic.severity === "error" && /^PC[12]/.test(diagnostic.code) && overlapsToken(diagnostic, token.range.start.offset, token.range.start.offset + candidate.length)).length;
        return correctedErrors < baselineErrors || correctedAtToken < originalAtToken;
      });
      if (workable.length !== 1)
        return [];
      const replacement2 = workable[0];
      return [{
        code: "PC5004",
        ruleId: "TYPO-001",
        severity: "error",
        origin: "Editor Runtime",
        messageKey: "typo.keywordSuggestion",
        args: { actual: token.text, suggested: replacement2 },
        range: token.range,
        fix: { range: token.range, newText: replacement2 }
      }];
    });
  }
  var CAUSE_KEYS_BY_LINE = /* @__PURE__ */ new Set(["token.chinesePunctuation"]);
  var CAUSE_KEYS_BY_TOKEN = /* @__PURE__ */ new Set(["literal.char.looksLikeString"]);
  function suppressFallout(diagnostics) {
    const causes = diagnostics.filter((diagnostic) => CAUSE_KEYS_BY_LINE.has(diagnostic.messageKey) || CAUSE_KEYS_BY_TOKEN.has(diagnostic.messageKey));
    if (causes.length === 0)
      return diagnostics;
    const brokenLines = new Set(causes.filter((cause) => CAUSE_KEYS_BY_LINE.has(cause.messageKey)).map((cause) => cause.range.start.line));
    const brokenTokens = causes.filter((cause) => CAUSE_KEYS_BY_TOKEN.has(cause.messageKey));
    return diagnostics.filter((diagnostic) => {
      if (causes.includes(diagnostic))
        return true;
      if (diagnostic.severity !== "error")
        return true;
      if (/^PC[24]/.test(diagnostic.code) && brokenLines.has(diagnostic.range.start.line))
        return false;
      return !brokenTokens.some((cause) => /^PC2/.test(diagnostic.code) && overlapsToken(diagnostic, cause.range.start.offset, cause.range.end.offset));
    });
  }
  function analyzeSource(source, options = {}) {
    const base = analyzeBase(source, options);
    const declaredNames2 = new Set(base.binding.symbols.map((symbol) => symbol.name.toUpperCase()));
    const typoHints = keywordTypoHints(source, options, base.diagnostics, declaredNames2);
    const diagnostics = suppressFallout([
      // 已经确认「换成这个词错误会减少」，那么落在同一个词上的其它错误都是它的连锁反应。
      // 「找不到自定义类型 STRIGN」和「你想写 STRING 吗」摆在一起只是噪音，后者已经回答了前者。
      ...base.diagnostics.filter((diagnostic) => !typoHints.some((hint) => diagnostic.severity === "error" && overlapsToken(diagnostic, hint.range.start.offset, hint.range.end.offset))),
      ...typoHints
    ]).sort((a, b) => a.range.start.offset - b.range.start.offset || a.code.localeCompare(b.code)).slice(0, Math.max(1, options.maxDiagnostics ?? 50));
    return { ...base, diagnostics };
  }

  // packages/runtime/dist/interpreter.js
  var DEFAULTS = {
    profile: "core-2027",
    maxSteps: 1e5,
    maxActiveTimeMs: 5e3,
    maxOutputLines: 1e4,
    maxOutputBytes: 1024 * 1024,
    maxArrayElements: 1e5,
    maxCallDepth: 256,
    maxFileBytes: 5 * 1024 * 1024,
    maxProjectFileBytes: 25 * 1024 * 1024,
    yieldEverySteps: 128
  };
  var encoder = new TextEncoder();
  var TraceCollector = class {
    options;
    plan;
    headCapacity;
    tailCapacity;
    tailRows = [];
    state = /* @__PURE__ */ new Map();
    tailState;
    semanticSteps = 0;
    deliveredRows = 0;
    didTruncate = false;
    didFinish = false;
    knownColumns = /* @__PURE__ */ new Set();
    maxColumns;
    columnsOmitted = 0;
    constructor(options, plan) {
      this.options = options;
      this.plan = plan;
      const limit = positiveInteger(options.maxRows, 2e3);
      this.tailCapacity = Math.min(500, Math.max(1, Math.floor(limit / 4)));
      this.headCapacity = Math.max(0, limit - this.tailCapacity);
      this.maxColumns = positiveInteger(options.maxColumns, 64);
      for (const column of this.plan.columns)
        this.knownColumns.add(column.variableId);
    }
    start() {
      this.options.sink.started(this.plan);
    }
    /**
     * 运行途中新增列。返回真正建成的那些——调用方要据此决定给不给 cell 挂 traceId：
     * 没建成列的变量如果还记写入，那些写入会落到一个表里不存在的列上，等于丢掉。
     */
    /** 还能再建几列。数组要用它先问一声，避免被上限砍成半个数组。 */
    remainingColumns() {
      return Math.max(0, this.maxColumns - this.knownColumns.size);
    }
    addColumns(candidates) {
      const added = [];
      for (const column of candidates) {
        if (this.knownColumns.has(column.variableId))
          continue;
        if (this.knownColumns.size >= this.maxColumns) {
          this.columnsOmitted += 1;
          continue;
        }
        this.knownColumns.add(column.variableId);
        added.push(column);
      }
      if (added.length > 0)
        this.options.sink.columns(added);
      return added;
    }
    hasColumn(variableId) {
      return this.knownColumns.has(variableId);
    }
    record(row) {
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
      if (this.tailRows.length === this.tailCapacity)
        this.applyState(this.tailState, this.tailRows.shift());
      this.tailRows.push(complete);
      if (this.tailRows.length > this.tailCapacity)
        this.tailRows.shift();
    }
    finish(status) {
      if (this.didFinish)
        return;
      this.didFinish = true;
      if (this.didTruncate) {
        const skipped = Math.max(0, this.semanticSteps - this.headCapacity - this.tailRows.length);
        this.options.sink.tail({ rows: this.tailRows, skipped, stateBefore: [...this.tailState.values()] });
      }
      this.options.sink.finished({
        status,
        rows: this.deliveredRows + this.tailRows.length,
        semanticSteps: this.semanticSteps,
        truncated: this.didTruncate,
        columnsOmitted: this.columnsOmitted
      });
    }
    applyState(state, row) {
      for (const declaration of row.declarations ?? []) {
        state.set(declaration.variableId, { variableId: declaration.variableId, declared: true, initialized: declaration.value.initialized });
      }
      for (const write of row.writes) {
        state.set(write.variableId, { variableId: write.variableId, declared: true, initialized: write.after.initialized });
      }
    }
  };
  var RuntimeFault = class extends Error {
    info;
    constructor(info) {
      super(info.messageKey);
      this.info = info;
      this.name = "RuntimeFault";
    }
  };
  var Stopped = class extends Error {
  };
  var Returned = class extends Error {
    value;
    constructor(value) {
      super("return");
      this.value = value;
    }
  };
  var Interpreter = class {
    program;
    diagnostics;
    runId;
    result;
    cells = /* @__PURE__ */ new Map();
    frames = [];
    procedures = /* @__PURE__ */ new Map();
    functions = /* @__PURE__ */ new Map();
    records = /* @__PURE__ */ new Map();
    classes = /* @__PURE__ */ new Map();
    pointers = /* @__PURE__ */ new Map();
    resolvedPointers = /* @__PURE__ */ new Map();
    sets = /* @__PURE__ */ new Map();
    resolvedSets = /* @__PURE__ */ new Map();
    enums = /* @__PURE__ */ new Map();
    resolvedEnums = /* @__PURE__ */ new Map();
    enumCells = /* @__PURE__ */ new Map();
    resolvedClasses = /* @__PURE__ */ new Map();
    resolvedRecords = /* @__PURE__ */ new Map();
    resolvingRecords = /* @__PURE__ */ new Set();
    loopControls = /* @__PURE__ */ new Map();
    outputs = [];
    options;
    trace;
    initialFiles;
    workingFiles;
    handles = /* @__PURE__ */ new Map();
    filesChanged = false;
    sequence = 0;
    steps = 0;
    outputBytes = 0;
    stopped = false;
    pendingInput;
    activeStartedAt;
    accumulatedActiveMs = 0;
    constructor(program, options = {}, diagnostics) {
      this.program = program;
      this.diagnostics = diagnostics;
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
        if (statement.kind === "RecordTypeDeclaration")
          this.records.set(statement.normalizedName, statement);
        if (statement.kind === "ProcedureDeclaration")
          this.procedures.set(statement.normalizedName, statement);
        if (statement.kind === "FunctionDeclaration")
          this.functions.set(statement.normalizedName, statement);
        if (statement.kind === "ClassDeclaration")
          this.classes.set(statement.normalizedName, statement);
        if (statement.kind === "PointerTypeDeclaration")
          this.pointers.set(statement.normalizedName, statement);
        if (statement.kind === "SetTypeDeclaration")
          this.sets.set(statement.normalizedName, statement);
        if (statement.kind === "EnumTypeDeclaration")
          this.enums.set(statement.normalizedName, statement);
      }
      for (const declaration of this.enums.values()) {
        const type = { kind: "enum", name: declaration.name, normalizedName: declaration.normalizedName, members: declaration.members.map(({ name }) => name) };
        this.resolvedEnums.set(declaration.normalizedName, type);
        for (const member of declaration.members) {
          this.enumCells.set(member.normalizedName, {
            name: member.name,
            normalizedName: member.normalizedName,
            kind: "constant",
            type,
            initialized: true,
            value: { kind: "enum", type, member: member.name }
          });
        }
      }
      this.frames.push({ id: "main", name: "<main>", cells: this.cells });
      if (options.trace) {
        const plan = options.trace.scope === "full" ? { columns: [] } : buildTracePlan(program);
        this.trace = new TraceCollector(options.trace, plan);
      }
      this.activeStartedAt = this.options.now();
      this.result = Promise.resolve().then(() => this.run());
    }
    provideInput(raw) {
      const pending = this.pendingInput;
      if (!pending || this.stopped)
        return { accepted: false, messageKey: "runtime.input.notWaiting" };
      const storage = storageCell(pending.cell);
      if (storage.type.kind !== "primitive")
        return { accepted: false, messageKey: "runtime.input.requiresPrimitive" };
      const parsed = parseInput(raw, storage.type.name);
      if ("messageKey" in parsed) {
        const rejected = { accepted: false, messageKey: parsed.messageKey, ...parsed.args ? { args: parsed.args } : {} };
        this.emit("input-rejected", pending.range, { variable: pending.cell.name, type: typeName(storage.type), ...rejected });
        return rejected;
      }
      this.resumeActiveClock();
      storage.value = cloneValue(parsed.value);
      storage.initialized = true;
      this.pendingInput = void 0;
      this.emit("input-accepted", pending.range, { variable: pending.cell.name, type: typeName(storage.type) });
      this.emitVariable("variable-changed", pending.range, pending.cell);
      this.traceWrite(pending.range, pending.cell, pending.traceBefore, "input", `INPUT ${pending.cell.name}`);
      pending.resolve();
      return { accepted: true };
    }
    stop() {
      if (this.stopped)
        return;
      this.stopped = true;
      if (this.pendingInput) {
        this.resumeActiveClock();
        const { resolve } = this.pendingInput;
        this.pendingInput = void 0;
        resolve();
      }
    }
    getVariables() {
      const current = this.frames[this.frames.length - 1];
      const cells = current && current.id !== "main" ? [...this.cells.values(), ...current.cells.values()] : [...this.cells.values()];
      return cells.map(snapshotCell);
    }
    async run() {
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
    async executeBlock(statements) {
      for (const statement of statements)
        await this.executeStatement(statement);
    }
    async executeStatement(statement) {
      await this.tick(statement.range, "statement-entered", { statement: statement.kind });
      switch (statement.kind) {
        case "DeclareStatement": {
          const type = await this.resolveType(statement.typeReference);
          const composite = instantiateComposite(type);
          const cell = {
            name: statement.name,
            normalizedName: statement.normalizedName,
            kind: "variable",
            type,
            initialized: composite !== void 0,
            ...composite !== void 0 ? { value: composite } : {}
          };
          this.attachTraceId(cell);
          this.currentFrame().cells.set(cell.normalizedName, cell);
          this.emitVariable("variable-declared", statement.range, cell);
          return;
        }
        case "ConstantStatement": {
          const value = await this.evaluate(statement.value);
          const cell = {
            name: statement.name,
            normalizedName: statement.normalizedName,
            kind: "constant",
            type: value.type,
            initialized: true,
            value: cloneValue(value.value)
          };
          this.attachTraceId(cell);
          this.currentFrame().cells.set(cell.normalizedName, cell);
          this.emitVariable("variable-declared", statement.range, cell);
          this.traceConstant(statement.range, cell);
          return;
        }
        case "DefineSetStatement": {
          const type = await this.resolveType(statement.typeReference);
          if (type.kind !== "set")
            this.fail("RT1310", "runtime.set.requiresSetType", statement.typeReference.range);
          const set = { kind: "set", type, values: /* @__PURE__ */ new Map() };
          for (const expression of statement.values) {
            const value = await this.evaluate(expression);
            if (!typesCompatible(type.elementType, value.type))
              this.fail("RT1311", "runtime.set.elementTypeMismatch", expression.range);
            set.values.set(valueKey(value.value), cloneValue(value.value));
          }
          const cell = { name: statement.name, normalizedName: statement.normalizedName, kind: "constant", type, initialized: true, value: set };
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
          this.traceWrite(statement.range, cell, before, "assign", `${cell.name} \u2190`);
          return;
        }
        case "InputStatement": {
          const cell = await this.resolveLocation(statement.target, true);
          if (cell.type.kind !== "primitive")
            this.fail("RT1105", "runtime.input.requiresPrimitive", statement.target.range);
          this.pauseActiveClock();
          await new Promise((resolve) => {
            this.pendingInput = { cell, range: statement.range, resolve, traceBefore: this.traceValueFor(cell) };
            this.emit("input-requested", statement.range, { variable: cell.name, type: typeName(cell.type) });
          });
          this.checkStopped();
          return;
        }
        case "OutputStatement": {
          const parts = [];
          for (const value of statement.values)
            parts.push(formatValue(await this.evaluate(value), value.range));
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
          if (!isPrimitive2(target.type, "STRING"))
            this.fail("RT2001", "runtime.file.readTargetRequiresString", statement.target.range);
          const lines = handle.file.lines ?? [];
          if (handle.position > lines.length)
            this.fail("RT2002", "runtime.file.readPastEnd", statement.range, { file: handle.file.name });
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
          if (handle.position !== lines.length + 1)
            this.fail("RT2003", "runtime.file.invalidTextPosition", statement.range);
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
          if (address < 1)
            this.fail("RT2101", "runtime.random.addressMustBePositive", statement.address.range, { address });
          handle.position = address;
          this.emitFile("file-position-changed", statement.range, handle, {});
          return;
        }
        case "GetRecordStatement": {
          const name = asString(await this.evaluate(statement.file), statement.file.range);
          const handle = this.requireHandle(name, ["RANDOM"], statement.range);
          const target = await this.resolveLocation(statement.target, true);
          if (target.type.kind !== "record")
            this.fail("RT2102", "runtime.random.targetRequiresRecord", statement.target.range);
          const records = handle.file.records ?? [];
          const record = records[handle.position - 1];
          if (!record)
            this.fail("RT2103", "runtime.random.missingRecord", statement.range, { file: handle.file.name, position: handle.position });
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
          if (data.type.kind !== "record" || !isRuntimeRecord(data.value))
            this.fail("RT2105", "runtime.random.dataRequiresRecord", statement.data.range);
          if (handle.file.recordType && normalizeName(handle.file.recordType) !== data.type.normalizedName) {
            this.fail("RT2104", "runtime.random.recordTypeMismatch", statement.data.range, { expected: handle.file.recordType, actual: data.type.name });
          }
          const records = handle.file.records ?? (handle.file.records = []);
          if (handle.position > records.length + 1)
            this.fail("RT2106", "runtime.random.cannotCreateHole", statement.range, { position: handle.position });
          const plain = this.recordToPlain(data.value, statement.data.range);
          if (!handle.file.recordType)
            handle.file.recordType = data.type.name;
          if (handle.position === records.length + 1)
            records.push(plain);
          else
            records[handle.position - 1] = plain;
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
            for (const label of clause.labels)
              matches ||= await this.matchesCaseLabel(selector, label);
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
          if (step === 0)
            this.fail("RT1501", "runtime.for.zeroStep", statement.step?.range ?? statement.range);
          let control = this.lookupCell(statement.control.normalizedName);
          let implicitControl = false;
          if (!control) {
            implicitControl = true;
            control = {
              name: statement.control.name,
              normalizedName: statement.control.normalizedName,
              kind: "loop-variable",
              type: primitive2("INTEGER"),
              initialized: false
            };
            this.attachTraceId(control);
            this.currentFrame().cells.set(control.normalizedName, control);
            this.emitVariable("variable-declared", statement.control.range, control);
          }
          if (control.type.kind !== "primitive" || control.type.name !== "INTEGER") {
            this.fail("RT1502", "runtime.for.controlRequiresInteger", statement.control.range);
          }
          const controlStorage = storageCell(control);
          if (controlStorage.kind === "constant")
            this.fail("RT1005", "runtime.constant.cannotChange", statement.control.range, { name: control.name });
          let candidate = start;
          const initialBefore = implicitControl ? uninitializedTraceValue() : this.traceValueFor(control);
          controlStorage.value = start;
          controlStorage.initialized = true;
          this.emitVariable("variable-changed", statement.range, control);
          this.traceWrite(statement.range, control, initialBefore, "for-init", `FOR ${control.name} \u2190 ${start}`);
          this.lockLoopControl(controlStorage.normalizedName);
          try {
            let iteration = 0;
            while (true) {
              await this.tick(statement.range, "condition-checked", { structure: "FOR", value: candidate });
              const passes = step > 0 ? candidate <= end : candidate >= end;
              this.traceCondition(statement.range, "FOR", passes);
              if (!passes)
                break;
              if (iteration > 0) {
                const before = this.traceValueFor(control);
                controlStorage.value = candidate;
                this.emitVariable("variable-changed", statement.range, control);
                this.traceWrite(statement.range, control, before, "for-next", `${control.name} \u2190 ${candidate}`);
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
            if (!result)
              break;
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
            if (result)
              break;
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
          await this.callMethod(statement.call.callee, statement.call.arguments, statement.range);
          return;
        case "ReturnStatement": {
          const frame = this.currentFrame();
          if (!frame.returnType)
            this.fail("RT1901", "runtime.return.outsideFunction", statement.range);
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
    async evaluate(expression) {
      this.checkLimits(expression.range);
      switch (expression.kind) {
        case "LiteralExpression":
          return { type: primitive2(expression.literalType), value: cloneValue(expression.value) };
        case "NameExpression":
          return this.readCell(await this.resolveLocation(expression, false), expression.range);
        case "IndexExpression":
          return this.readCell(await this.resolveLocation(expression, false), expression.range);
        case "MemberExpression":
          return this.readCell(await this.resolveLocation(expression, false), expression.range);
        case "UnaryExpression": {
          if (expression.operator === "^" && expression.postfix) {
            const pointer = await this.evaluate(expression.operand);
            if (!isPointerValue(pointer.value))
              this.fail("RT1309", "runtime.pointer.requiresPointer", expression.range);
            return this.readCell(pointer.value.target, expression.range);
          }
          if (expression.operator === "^") {
            const target = await this.resolveLocation(expression.operand, false);
            return { type: { kind: "pointer", target: target.type }, value: { kind: "pointer", type: { kind: "pointer", target: target.type }, target: storageCell(target) } };
          }
          const operand = await this.evaluate(expression.operand);
          if (expression.operator === "NOT")
            return { type: primitive2("BOOLEAN"), value: !asBoolean(operand, expression.range) };
          return checkedNumber(-asNumber(operand, expression.range), operand.type, expression.range);
        }
        case "BinaryExpression":
          return this.evaluateBinary(expression);
        case "CallExpression": {
          if (expression.callee.kind === "MemberExpression") {
            const value = await this.callMethod(expression.callee, expression.arguments, expression.range);
            if (!value)
              this.fail("RT4020", "runtime.function.cannotBeExpression", expression.range);
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
              if (method.declaration.kind === "ProcedureDeclaration")
                this.fail("RT4020", "runtime.function.cannotBeExpression", expression.range);
              if (!value)
                this.fail("RT1905", "runtime.function.missingReturn", method.declaration.range, { name: method.declaration.name });
              return value;
            }
          }
          return this.evaluateBuiltin(expression);
        }
        case "NewExpression":
          return this.newObject(expression);
        case "ErrorExpression":
          this.fail("RT1004", "runtime.expression.invalid", expression.range);
        default:
          this.fail("RT1102", "runtime.expression.notSupportedInCurrentStage", expression.range);
      }
    }
    async evaluateBinary(expression) {
      const left = await this.evaluate(expression.left);
      if (expression.operator === "AND" && !asBoolean(left, expression.left.range))
        return typed("BOOLEAN", false);
      if (expression.operator === "OR" && asBoolean(left, expression.left.range))
        return typed("BOOLEAN", true);
      const right = await this.evaluate(expression.right);
      if (left.type.kind === "enum" && isPrimitive2(right.type, "INTEGER") && (expression.operator === "+" || expression.operator === "-")) {
        const index = left.type.members.indexOf(left.value.member);
        const offset = right.value;
        const nextIndex = index + (expression.operator === "+" ? offset : -offset);
        const member = left.type.members[nextIndex];
        if (index < 0 || !member)
          this.fail("RT1312", "runtime.enum.ordinalOutOfRange", expression.range);
        return { type: left.type, value: { kind: "enum", type: left.type, member } };
      }
      switch (expression.operator) {
        case "AND":
          return typed("BOOLEAN", asBoolean(right, expression.right.range));
        case "OR":
          return typed("BOOLEAN", asBoolean(right, expression.right.range));
        case "&":
          return typed("STRING", asString(left, expression.left.range) + asString(right, expression.right.range));
        case "+":
          return numericBinary(left, right, expression.range, (a, b) => a + b);
        case "-":
          return numericBinary(left, right, expression.range, (a, b) => a - b);
        case "*":
          return numericBinary(left, right, expression.range, (a, b) => a * b);
        case "/": {
          const divisor = asNumber(right, expression.right.range);
          if (divisor === 0)
            this.fail("RT1301", "runtime.math.divisionByZero", expression.right.range);
          return checkedNumber(asNumber(left, expression.left.range) / divisor, primitive2("REAL"), expression.range);
        }
        case "DIV":
        case "MOD": {
          const a = asInteger(left, expression.left.range);
          const b = asInteger(right, expression.right.range);
          if (b === 0)
            this.fail("RT1301", "runtime.math.divisionByZero", expression.right.range);
          const quotient = Math.trunc(a / b);
          return typed("INTEGER", checkedInteger(expression.operator === "DIV" ? quotient : a - quotient * b, expression.range));
        }
        case "=":
          return typed("BOOLEAN", compareValues(left, right, expression.range) === 0);
        case "<>":
          return typed("BOOLEAN", compareValues(left, right, expression.range) !== 0);
        case ">":
          return typed("BOOLEAN", this.compareOrdered(left, right, expression.range) > 0);
        case "<":
          return typed("BOOLEAN", this.compareOrdered(left, right, expression.range) < 0);
        case ">=":
          return typed("BOOLEAN", this.compareOrdered(left, right, expression.range) >= 0);
        case "<=":
          return typed("BOOLEAN", this.compareOrdered(left, right, expression.range) <= 0);
      }
    }
    compareOrdered(left, right, range) {
      if (isEnumValue(left.value) || isEnumValue(right.value))
        this.fail("RT1308", "runtime.comparison.incompatible", range);
      return compareValues(left, right, range);
    }
    async evaluateBuiltin(expression) {
      if (expression.callee.kind !== "NameExpression")
        this.fail("RT1102", "runtime.expression.notSupportedInCurrentStage", expression.range);
      const args = [];
      for (const argument of expression.arguments)
        args.push(await this.evaluate(argument));
      switch (expression.callee.normalizedName) {
        case "LENGTH":
          return typed("INTEGER", [...asString(args[0], expression.range)].length);
        case "RIGHT": {
          const chars = [...asString(args[0], expression.range)];
          const length = asInteger(args[1], expression.range);
          if (length < 0 || length > chars.length)
            this.fail("RT1401", "runtime.string.lengthOutOfBounds", expression.range, { length });
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
        case "LCASE":
          return typed("CHAR", transformedChar(asChar(args[0], expression.range), false, expression.range));
        case "UCASE":
          return typed("CHAR", transformedChar(asChar(args[0], expression.range), true, expression.range));
        case "INT":
          return typed("INTEGER", checkedInteger(Math.trunc(asNumber(args[0], expression.range)), expression.range));
        case "RAND": {
          const limit = asInteger(args[0], expression.range);
          if (limit <= 0)
            this.fail("RT1403", "runtime.rand.requiresPositiveInteger", expression.range, { value: limit });
          const random = this.options.random();
          if (!Number.isFinite(random) || random < 0 || random >= 1)
            this.fail("RT1999", "runtime.random.invalidSource", expression.range);
          return typed("REAL", random * limit);
        }
        case "EOF": {
          const name = asString(args[0], expression.range);
          const handle = this.requireHandle(name, ["READ"], expression.range);
          return typed("BOOLEAN", handle.position > (handle.file.lines ?? []).length);
        }
        default:
          this.fail("RT1103", "runtime.call.notSupportedInCurrentStage", expression.range, { name: expression.callee.name });
      }
    }
    async resolveLocation(expression, writable) {
      if (expression.kind === "UnaryExpression" && expression.operator === "^" && expression.postfix) {
        const pointer = await this.evaluate(expression.operand);
        if (!isPointerValue(pointer.value))
          this.fail("RT1309", "runtime.pointer.requiresPointer", expression.range);
        const target = storageCell(pointer.value.target);
        if (writable && target.kind === "constant")
          this.fail("RT1005", "runtime.constant.cannotChange", expression.range, { name: target.name });
        return target;
      }
      if (expression.kind === "NameExpression") {
        const cell = this.lookupCell(expression.normalizedName);
        if (!cell)
          this.fail("RT1002", "runtime.name.notDeclared", expression.range, { name: expression.name });
        const storage = storageCell(cell);
        if (writable && storage.kind === "constant")
          this.fail("RT1005", "runtime.constant.cannotChange", expression.range, { name: cell.name });
        if (writable && (this.loopControls.get(storage.normalizedName) ?? 0) > 0)
          this.fail("RT1503", "runtime.for.controlCannotChange", expression.range, { name: cell.name });
        return cell;
      }
      if (expression.kind === "IndexExpression") {
        const target = await this.referenceValue(expression.target);
        if (target.type.kind !== "array" || target.value.kind !== "array") {
          this.fail("RT1601", "runtime.index.targetRequiresArray", expression.target.range);
        }
        const arrayType = target.type;
        const arrayValue = target.value;
        const indices = [];
        for (const index of expression.indices)
          indices.push(asInteger(await this.evaluate(index), index.range));
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
          const composite = instantiateComposite(arrayType.elementType);
          cell = {
            name: `${locationName(expression.target)}[${indices.join(", ")}]`,
            normalizedName: key,
            kind: "element",
            type: arrayType.elementType,
            initialized: composite !== void 0,
            ...composite !== void 0 ? { value: composite } : {}
          };
          this.attachElementTraceId(arrayValue, cell, key);
          arrayValue.elements.set(key, cell);
        }
        return cell;
      }
      if (expression.kind === "MemberExpression") {
        const target = await this.referenceValue(expression.target);
        if (target.type.kind === "record" && target.value.kind === "record") {
          const cell = target.value.fields.get(expression.normalizedMember);
          if (!cell)
            this.fail("RT1702", "runtime.member.unknownField", expression.memberRange, { field: expression.member, record: target.type.name });
          return cell;
        }
        if (target.type.kind === "class" && target.value.kind === "object") {
          const field = target.type.fields.find(({ normalizedName }) => normalizedName === expression.normalizedMember);
          if (!field)
            this.fail("RT1702", "runtime.member.unknownField", expression.memberRange, { field: expression.member, record: target.type.name });
          if (field.access === "PRIVATE" && this.currentFrame().classType?.normalizedName !== field.owner) {
            this.fail("RT1706", "runtime.class.privateMember", expression.memberRange, { member: expression.member });
          }
          return target.value.fields.get(field.normalizedName);
        }
        this.fail("RT1701", "runtime.member.targetRequiresRecord", expression.target.range);
      }
      this.fail("RT1104", "runtime.target.notSupportedInCurrentStage", expression.range);
    }
    async referenceValue(expression) {
      const cell = await this.resolveLocation(expression, false);
      const storage = storageCell(cell);
      if (!storage.initialized)
        this.fail("RT1003", "runtime.name.uninitialized", expression.range, { name: cell.name });
      if (!storage.value || typeof storage.value !== "object" || !("kind" in storage.value)) {
        this.fail("RT1703", "runtime.value.requiresComposite", expression.range);
      }
      return { type: cell.type, value: storage.value };
    }
    readCell(cell, range) {
      const storage = storageCell(cell);
      if (!storage.initialized)
        this.fail("RT1003", "runtime.name.uninitialized", range, { name: cell.name });
      return { type: cell.type, value: cloneValue(storage.value) };
    }
    async resolveType(reference) {
      switch (reference.kind) {
        case "PrimitiveTypeReference":
          return primitive2(reference.name);
        case "ArrayTypeReference":
          return this.resolveArrayType(reference);
        case "NamedTypeReference": {
          if (this.classes.has(reference.normalizedName))
            return this.resolveClassType(reference.normalizedName, reference.range);
          if (this.pointers.has(reference.normalizedName))
            return this.resolvePointerType(reference.normalizedName, reference.range);
          if (this.sets.has(reference.normalizedName))
            return this.resolveSetType(reference.normalizedName, reference.range);
          if (this.resolvedEnums.has(reference.normalizedName))
            return this.resolvedEnums.get(reference.normalizedName);
          return this.resolveRecordType(reference.normalizedName, reference.range);
        }
        default:
          this.fail("RT1101", "runtime.type.notSupportedInCurrentStage", reference.range);
      }
    }
    async resolveRuntimeType(reference) {
      if (reference.kind === "NamedTypeReference" && this.classes.has(reference.normalizedName)) {
        return this.resolveClassType(reference.normalizedName, reference.range);
      }
      return this.resolveType(reference);
    }
    async resolveClassType(normalizedName, range) {
      const existing = this.resolvedClasses.get(normalizedName);
      if (existing)
        return existing;
      const declaration = this.classes.get(normalizedName);
      if (!declaration)
        this.fail("RT1101", "runtime.type.notSupportedInCurrentStage", range);
      const base = declaration.normalizedBaseName ? await this.resolveClassType(declaration.normalizedBaseName, range) : void 0;
      const type = { kind: "class", name: declaration.name, normalizedName, ...base ? { base } : {}, fields: [] };
      this.resolvedClasses.set(normalizedName, type);
      if (base)
        type.fields.push(...base.fields);
      for (const member of declaration.members) {
        if (member.kind !== "ClassField")
          continue;
        type.fields.push({ name: member.name, normalizedName: member.normalizedName, access: member.access, type: await this.resolveType(member.typeReference), owner: normalizedName });
      }
      return type;
    }
    async resolvePointerType(normalizedName, range) {
      const existing = this.resolvedPointers.get(normalizedName);
      if (existing)
        return existing;
      const declaration = this.pointers.get(normalizedName);
      if (!declaration)
        this.fail("RT1101", "runtime.type.notSupportedInCurrentStage", range);
      const type = { kind: "pointer", target: await this.resolveType(declaration.targetType) };
      this.resolvedPointers.set(normalizedName, type);
      return type;
    }
    async resolveSetType(normalizedName, range) {
      const existing = this.resolvedSets.get(normalizedName);
      if (existing)
        return existing;
      const declaration = this.sets.get(normalizedName);
      if (!declaration)
        this.fail("RT1101", "runtime.type.notSupportedInCurrentStage", range);
      const type = { kind: "set", name: declaration.name, normalizedName, elementType: await this.resolveType(declaration.elementType) };
      this.resolvedSets.set(normalizedName, type);
      return type;
    }
    async resolveArrayType(reference) {
      const dimensions = [];
      for (const dimension of reference.dimensions) {
        const lower = asInteger(await this.evaluate(dimension.lower), dimension.lower.range);
        const upper = asInteger(await this.evaluate(dimension.upper), dimension.upper.range);
        if (lower > upper)
          this.fail("RT1604", "runtime.array.invalidBounds", dimension.range, { lower, upper });
        dimensions.push({ lower, upper });
      }
      const elements = dimensions.reduce((count, { lower, upper }) => count * (upper - lower + 1), 1);
      if (!Number.isSafeInteger(elements) || elements > this.options.maxArrayElements) {
        this.fail("RT1605", "runtime.array.tooLarge", reference.range, { maximum: this.options.maxArrayElements });
      }
      return { kind: "array", dimensions, elementType: await this.resolveType(reference.elementType) };
    }
    async resolveRecordType(normalizedName, range) {
      const existing = this.resolvedRecords.get(normalizedName);
      if (existing)
        return existing;
      const declaration = this.records.get(normalizedName);
      if (!declaration)
        this.fail("RT1101", "runtime.type.notSupportedInCurrentStage", range);
      if (this.resolvingRecords.has(normalizedName))
        this.fail("RT1704", "runtime.record.circularType", range, { name: declaration.name });
      this.resolvingRecords.add(normalizedName);
      const type = { kind: "record", name: declaration.name, normalizedName, fields: [] };
      this.resolvedRecords.set(normalizedName, type);
      for (const field of declaration.fields) {
        type.fields.push({ name: field.name, normalizedName: field.normalizedName, type: await this.resolveType(field.typeReference) });
      }
      this.resolvingRecords.delete(normalizedName);
      return type;
    }
    assign(cell, value, range) {
      if (!typesCompatible(cell.type, value.type)) {
        this.fail("RT1006", "runtime.assignment.typeMismatch", range, { target: typeName(cell.type), value: typeName(value.type) });
      }
      const storage = storageCell(cell);
      storage.value = cloneValue(value.value);
      storage.initialized = true;
    }
    async matchesCaseLabel(selector, label) {
      if (label.kind === "CaseValueLabel")
        return compareValues(selector, await this.evaluate(label.value), label.range) === 0;
      const lower = await this.evaluate(label.lower);
      const upper = await this.evaluate(label.upper);
      return compareValues(selector, lower, label.lower.range) >= 0 && compareValues(selector, upper, label.upper.range) <= 0;
    }
    async newObject(expression) {
      const type = await this.resolveClassType(expression.normalizedClassName, expression.classNameRange);
      const object = { kind: "object", type, fields: /* @__PURE__ */ new Map() };
      for (const field of type.fields) {
        const value = instantiateComposite(field.type);
        object.fields.set(field.normalizedName, {
          name: field.name,
          normalizedName: field.normalizedName,
          kind: "field",
          type: field.type,
          initialized: value !== void 0,
          ...value !== void 0 ? { value } : {}
        });
      }
      const constructor = this.findMethod(type, "NEW");
      if (constructor)
        await this.invokeRoutine(constructor.declaration, expression.arguments, object, constructor.owner);
      else if (expression.arguments.length)
        this.fail("RT1906", "runtime.call.argumentCount", expression.range, { expected: 0, actual: expression.arguments.length });
      return { type, value: object };
    }
    async callMethod(expression, args, range) {
      let object;
      let type;
      if (expression.target.kind === "NameExpression" && expression.target.normalizedName === "SUPER") {
        const frame = this.currentFrame();
        if (!frame.receiver || !frame.classType?.base)
          this.fail("RT1705", "runtime.class.superOutsideMethod", range);
        object = frame.receiver;
        type = frame.classType.base;
      } else {
        const value2 = await this.evaluate(expression.target);
        if (value2.type.kind !== "class" || !isRuntimeObject(value2.value))
          this.fail("RT1705", "runtime.class.methodRequiresObject", expression.target.range);
        object = value2.value;
        type = object.type;
      }
      const method = this.findMethod(type, expression.normalizedMember);
      if (!method)
        this.fail("RT1904", "runtime.function.notFound", expression.memberRange, { name: expression.member });
      if (method.access === "PRIVATE" && this.currentFrame().classType?.normalizedName !== method.owner) {
        this.fail("RT1706", "runtime.class.privateMember", expression.memberRange, { member: expression.member });
      }
      const value = await this.invokeRoutine(method.declaration, args, object, method.owner);
      if (method.declaration.kind === "ProcedureDeclaration")
        return void 0;
      if (!value)
        this.fail("RT1905", "runtime.function.missingReturn", method.declaration.range, { name: method.declaration.name });
      return value;
    }
    findMethod(type, normalizedName) {
      for (let current = type; current; current = current.base) {
        const declaration = this.classes.get(current.normalizedName);
        const member = declaration?.members.find((candidate) => (candidate.kind === "ProcedureDeclaration" || candidate.kind === "FunctionDeclaration") && candidate.normalizedName === normalizedName);
        if (member && (member.kind === "ProcedureDeclaration" || member.kind === "FunctionDeclaration")) {
          return { declaration: member, owner: current.normalizedName, access: member.access ?? "PUBLIC" };
        }
      }
      return void 0;
    }
    async callProcedure(normalizedName, args, range) {
      const declaration = this.procedures.get(normalizedName);
      if (!declaration)
        this.fail("RT1903", "runtime.procedure.notFound", range, { name: normalizedName });
      await this.invokeRoutine(declaration, args);
    }
    async callFunction(normalizedName, args, range) {
      const declaration = this.functions.get(normalizedName);
      if (!declaration)
        this.fail("RT1904", "runtime.function.notFound", range, { name: normalizedName });
      const value = await this.invokeRoutine(declaration, args);
      if (!value)
        this.fail("RT1905", "runtime.function.missingReturn", declaration.range, { name: declaration.name });
      return value;
    }
    async invokeRoutine(declaration, args, receiver, className) {
      if (this.frames.length - 1 >= this.options.maxCallDepth) {
        this.fail("RT1205", "runtime.limit.callDepth", declaration.nameRange, { maximum: this.options.maxCallDepth });
      }
      if (args.length !== declaration.parameters.length) {
        this.fail("RT1906", "runtime.call.argumentCount", declaration.range, { expected: declaration.parameters.length, actual: args.length });
      }
      const parameterCells = /* @__PURE__ */ new Map();
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
      const returnType = declaration.kind === "FunctionDeclaration" ? await this.resolveType(declaration.returnType) : void 0;
      const depth = this.frames.filter((existing) => existing.name === declaration.name).length + 1;
      const scope = `${declaration.normalizedName ?? declaration.name.toLowerCase()}#${depth}`;
      const frame = {
        id: `frame-${this.sequence + 1}`,
        name: declaration.name,
        traceScope: scope,
        traceScopeLabel: depth > 1 ? `${declaration.name}#${depth}` : declaration.name,
        cells: parameterCells,
        ...returnType ? { returnType } : {},
        ...receiver ? { receiver, classType: className ? this.resolvedClasses.get(className) ?? receiver.type : receiver.type } : {}
      };
      this.frames.push(frame);
      for (const cell of parameterCells.values())
        this.attachTraceId(cell);
      this.emit("frame-entered", declaration.range, { name: declaration.name, stack: this.stackNames(), variables: this.getVariables() });
      this.trace?.record({
        range: declaration.range,
        frameId: frame.id,
        kind: "call",
        label: `CALL ${declaration.name}`,
        writes: [],
        call: { name: declaration.name, kind: declaration.kind === "ProcedureDeclaration" ? "procedure" : "function" }
      });
      let returned;
      try {
        await this.executeBlock(declaration.body);
      } catch (error) {
        if (error instanceof Returned)
          returned = error.value;
        else
          throw error;
      } finally {
        this.frames.pop();
        this.emit("frame-exited", declaration.range, { name: declaration.name, stack: this.stackNames(), variables: this.getVariables() });
        this.trace?.record({ range: declaration.range, frameId: frame.id, kind: "return", label: `RETURN ${declaration.name}`, writes: [] });
      }
      if (declaration.kind === "ProcedureDeclaration") {
        if (returned)
          this.fail("RT1909", "runtime.procedure.cannotReturnValue", declaration.range, { name: declaration.name });
        return void 0;
      }
      if (!returned)
        this.fail("RT1905", "runtime.function.missingReturn", declaration.range, { name: declaration.name });
      return returned;
    }
    currentFrame() {
      return this.frames[this.frames.length - 1];
    }
    lookupCell(normalizedName) {
      const current = this.currentFrame();
      return current.cells.get(normalizedName) ?? current.receiver?.fields.get(normalizedName) ?? (current.id === "main" ? this.enumCells.get(normalizedName) : this.cells.get(normalizedName) ?? this.enumCells.get(normalizedName));
    }
    stackNames() {
      return this.frames.map(({ name }) => name);
    }
    openFile(name, mode, range) {
      const normalized2 = validatedFileName(name, range);
      if (this.handles.has(normalized2))
        this.fail("RT2004", "runtime.file.alreadyOpen", range, { file: name });
      let file = this.workingFiles.find((candidate) => normalizeName(candidate.name) === normalized2);
      const created = !file;
      const expectedKind = mode === "RANDOM" ? "records" : "text";
      if (!file) {
        if (mode === "READ")
          this.fail("RT2005", "runtime.file.notFound", range, { file: name });
        file = {
          id: `runtime-file-${Date.now().toString(36)}-${this.workingFiles.length + 1}`,
          name,
          kind: expectedKind,
          ...expectedKind === "text" ? { lines: [] } : { records: [] }
        };
        this.workingFiles.push(file);
        this.filesChanged = true;
      }
      if (file.kind !== expectedKind)
        this.fail("RT2006", "runtime.file.kindMismatch", range, { file: file.name, expected: expectedKind });
      if (mode === "WRITE") {
        file.lines = [];
        this.filesChanged = true;
      }
      const position = mode === "APPEND" ? (file.lines ?? []).length + 1 : 1;
      const handle = { file, mode, position };
      this.handles.set(normalized2, handle);
      this.ensureFileLimit(file, range);
      this.ensureProjectFileLimit(range);
      this.emitFile("file-opened", range, handle, { changed: created || mode === "WRITE" });
    }
    requireHandle(name, modes, range) {
      const normalized2 = validatedFileName(name, range);
      const handle = this.handles.get(normalized2);
      if (!handle)
        this.fail("RT2007", "runtime.file.notOpen", range, { file: name });
      if (!modes.includes(handle.mode)) {
        this.fail("RT2008", "runtime.file.modeMismatch", range, { file: handle.file.name, expected: modes.join("/"), actual: handle.mode });
      }
      return handle;
    }
    closeFile(name, range, automatic) {
      const normalized2 = validatedFileName(name, range);
      const handle = this.handles.get(normalized2);
      if (!handle)
        this.fail("RT2007", "runtime.file.notOpen", range, { file: name });
      this.handles.delete(normalized2);
      this.emitFile("file-closed", range, handle, { automatic });
    }
    closeAllHandles(automatic) {
      for (const [normalized2, handle] of [...this.handles]) {
        this.handles.delete(normalized2);
        this.emitFile("file-closed", this.program.range, handle, { automatic });
      }
    }
    emitFile(type, range, handle, data) {
      this.emit(type, range, {
        ...data,
        handle: { name: handle.file.name, mode: handle.mode, position: handle.position },
        handles: this.handleSnapshots()
      });
    }
    handleSnapshots() {
      return [...this.handles.values()].map(({ file, mode, position }) => ({ name: file.name, mode, position }));
    }
    ensureFileLimit(file, range) {
      const bytes = virtualFileBytes(file);
      if (bytes > this.options.maxFileBytes)
        this.fail("RT2201", "runtime.file.limit.fileBytes", range, { file: file.name, maximum: this.options.maxFileBytes });
      this.ensureProjectFileLimit(range);
    }
    ensureProjectFileLimit(range) {
      const bytes = this.workingFiles.reduce((total, file) => total + virtualFileBytes(file), 0);
      if (bytes > this.options.maxProjectFileBytes)
        this.fail("RT2202", "runtime.file.limit.projectBytes", range, { maximum: this.options.maxProjectFileBytes });
    }
    recordToPlain(record, range) {
      const result = {};
      for (const field of record.fields.values()) {
        if (!field.initialized)
          this.fail("RT2107", "runtime.random.uninitializedField", range, { field: field.name });
        if (field.type.kind === "array")
          this.fail("RT2108", "runtime.random.arrayFieldUnsupported", range, { field: field.name });
        if (field.type.kind === "record") {
          if (!isRuntimeRecord(field.value))
            this.fail("RT2109", "runtime.random.invalidStoredRecord", range, { field: field.name });
          result[field.name] = this.recordToPlain(field.value, range);
        } else {
          result[field.name] = clonePlainValue(field.value);
        }
      }
      return result;
    }
    plainToRecord(plain, type, range) {
      const record = instantiateComposite(type);
      if (!record || record.kind !== "record")
        this.fail("RT2109", "runtime.random.invalidStoredRecord", range);
      for (const field of record.fields.values()) {
        const entry = Object.entries(plain).find(([name]) => normalizeName(name) === field.normalizedName);
        if (!entry)
          this.fail("RT2109", "runtime.random.invalidStoredRecord", range, { field: field.name });
        const raw = entry[1];
        if (field.type.kind === "array")
          this.fail("RT2108", "runtime.random.arrayFieldUnsupported", range, { field: field.name });
        if (field.type.kind === "record") {
          if (!isPlainRecord(raw))
            this.fail("RT2109", "runtime.random.invalidStoredRecord", range, { field: field.name });
          field.value = this.plainToRecord(raw, field.type, range);
        } else {
          if (field.type.kind !== "primitive")
            this.fail("RT2109", "runtime.random.invalidStoredRecord", range, { field: field.name });
          field.value = plainPrimitive(raw, field.type.name, range);
        }
        field.initialized = true;
      }
      return record;
    }
    /** 当前帧的追踪作用域前缀；主程序恒为 `main`。 */
    traceScopeOf(frame) {
      return frame.id === "main" ? "main" : frame.traceScope ?? "";
    }
    /**
     * 给刚建好的 cell 挂上追踪 id，并在需要时就地建列。
     * 主程序标量沿用静态列计划里已有的 id（不重复建列）；数组和局部变量是运行途中才知道的，
     * 建不成列就不挂 id——挂了而没有列，写入会记到一个表里不存在的列上，等于悄悄丢掉。
     */
    attachTraceId(cell) {
      if (!this.trace)
        return;
      const frame = this.currentFrame();
      const scope = this.traceScopeOf(frame);
      if (!scope)
        return;
      const isMain = frame.id === "main";
      const full = this.options.trace?.scope === "full";
      if (cell.type.kind === "primitive") {
        if (!isMain && !full)
          return;
        const id = `${scope}:${cell.normalizedName}`;
        this.trace.addColumns([isMain ? { variableId: id, name: cell.name, normalizedName: cell.normalizedName, kind: "scalar" } : { variableId: id, name: cell.name, normalizedName: cell.normalizedName, kind: "scalar", group: frame.name, scope, scopeLabel: frame.traceScopeLabel ?? frame.name }]);
        if (this.trace.hasColumn(id))
          cell.traceId = id;
        return;
      }
      if (full && cell.type.kind === "array" && cell.value !== void 0 && isComposite(cell.value) && cell.value.kind === "array") {
        this.attachArrayTrace(cell, cell.value, scope, isMain ? void 0 : frame);
      }
    }
    /**
     * 数组展开成列。元素是懒建的，但边界在 `DECLARE` 时就已知，所以整排列在这里一次建完——
     * 否则表头会随着程序第一次碰到某个下标才长出一列，读表的人无法预先看到数组有多大。
     */
    attachArrayTrace(cell, array, scope, frame) {
      if (!this.trace || array.traceBase || array.traceDigestId)
        return;
      const base = `${scope}:${cell.normalizedName}`;
      const limit = positiveInteger(this.options.trace?.maxArrayElements, 32);
      const keys = enumerateArrayKeys(array.type.dimensions, Math.min(limit, this.trace.remainingColumns()));
      const group = cell.name;
      const shared = frame ? { group: `${frame.name}.${cell.name}`, scope, scopeLabel: frame.traceScopeLabel ?? frame.name } : { group };
      if (!keys) {
        const id = `${base}[\u2026]`;
        this.trace.addColumns([{ variableId: id, name: `${cell.name}[\u2026]`, normalizedName: cell.normalizedName, kind: "digest", ...shared }]);
        if (this.trace.hasColumn(id))
          array.traceDigestId = id;
        return;
      }
      const columns = keys.map((indices) => ({
        variableId: `${base}[${indices.join(",")}]`,
        name: `${cell.name}[${indices.join(", ")}]`,
        normalizedName: indices.join(","),
        kind: "element",
        ...shared
      }));
      this.trace.addColumns(columns);
      if (columns.every(({ variableId }) => this.trace.hasColumn(variableId)))
        array.traceBase = base;
    }
    /** 元素 cell 是懒建的，建出来时才能挂 id。 */
    attachElementTraceId(array, cell, key) {
      if (!this.trace)
        return;
      if (array.traceDigestId) {
        cell.traceId = array.traceDigestId;
        cell.traceDigest = true;
        return;
      }
      if (!array.traceBase)
        return;
      const id = `${array.traceBase}[${key}]`;
      if (this.trace.hasColumn(id))
        cell.traceId = id;
    }
    traceValueFor(cell) {
      const storage = storageCell(cell);
      return storage.traceId ? traceValueOf(storage) : void 0;
    }
    /** 常量没有后续写入，其声明是唯一值得在表中呈现的值。 */
    traceConstant(range, cell) {
      const storage = storageCell(cell);
      if (!this.trace || !storage.traceId)
        return;
      const declaration = { variableId: storage.traceId, name: cell.name, value: traceValueOf(storage) };
      this.trace.record({ range, frameId: this.currentFrame().id, kind: "declare", label: `CONSTANT ${cell.name}`, writes: [], declarations: [declaration] });
    }
    traceWrite(range, cell, before, cause, label) {
      const storage = storageCell(cell);
      if (!this.trace || !storage.traceId || !before)
        return;
      const after = traceValueOf(storage);
      const isByRef = this.currentFrame().id !== "main" && storage.traceId.startsWith("main:");
      const write = {
        variableId: storage.traceId,
        name: storage.name,
        before,
        after,
        sameValue: traceValuesEqual(before, after),
        cause: isByRef ? "byref-write" : cause,
        ...isByRef ? { origin: { frameId: this.currentFrame().id, name: cell.name, routine: this.currentFrame().name } } : {}
      };
      this.trace.record({ range, frameId: this.currentFrame().id, kind: "write", label, writes: [write] });
    }
    traceCondition(range, structure, result) {
      if (structure === "FOR")
        return;
      this.trace?.record({ range, frameId: this.currentFrame().id, kind: "condition", label: `${structure} \u2192 ${result ? "TRUE" : "FALSE"}`, writes: [], condition: { structure, result } });
    }
    traceOutput(range, output) {
      this.trace?.record({ range, frameId: this.currentFrame().id, kind: "output", label: `OUTPUT ${output}`, writes: [], output });
    }
    traceError(error) {
      this.trace?.record({ range: error.range, frameId: this.currentFrame()?.id ?? "main", kind: "error", label: error.code, writes: [], error });
    }
    writeOutput(line, range) {
      const bytes = encoder.encode(`${line}
`).byteLength;
      if (this.outputs.length + 1 > this.options.maxOutputLines)
        this.fail("RT1201", "runtime.limit.outputLines", range, { maximum: this.options.maxOutputLines });
      if (this.outputBytes + bytes > this.options.maxOutputBytes)
        this.fail("RT1202", "runtime.limit.outputBytes", range, { maximum: this.options.maxOutputBytes });
      this.outputs.push(line);
      this.outputBytes += bytes;
      this.emit("output-written", range, { text: line, lineNumber: this.outputs.length });
    }
    lockLoopControl(name) {
      this.loopControls.set(name, (this.loopControls.get(name) ?? 0) + 1);
    }
    unlockLoopControl(name) {
      const count = (this.loopControls.get(name) ?? 1) - 1;
      if (count <= 0)
        this.loopControls.delete(name);
      else
        this.loopControls.set(name, count);
    }
    async tick(range, event, data) {
      this.checkStopped();
      this.steps += 1;
      this.checkLimits(range);
      this.emit(event, range, { ...data, step: this.steps });
      if (this.steps % this.options.yieldEverySteps === 0) {
        await new Promise((resolve) => setTimeout(resolve, 0));
        this.checkLimits(range);
      }
    }
    checkLimits(range) {
      this.checkStopped();
      if (this.steps > this.options.maxSteps)
        this.fail("RT1203", "runtime.limit.steps", range, { maximum: this.options.maxSteps });
      if (this.activeTime() > this.options.maxActiveTimeMs)
        this.fail("RT1204", "runtime.limit.activeTime", range, { maximum: this.options.maxActiveTimeMs });
    }
    checkStopped() {
      if (this.stopped)
        throw new Stopped();
    }
    fail(code, messageKey, range, args) {
      throw new RuntimeFault(faultInfo(code, messageKey, range, args));
    }
    emit(type, range, data) {
      this.options.onEvent?.({ type, runId: this.runId, sequence: ++this.sequence, range, frameId: this.currentFrame()?.id ?? "main", data });
    }
    emitVariable(type, range, cell) {
      this.emit(type, range, { variable: snapshotCell(cell), variables: this.getVariables(), stack: this.stackNames() });
    }
    pauseActiveClock() {
      if (this.activeStartedAt === void 0)
        return;
      this.accumulatedActiveMs += Math.max(0, this.options.now() - this.activeStartedAt);
      this.activeStartedAt = void 0;
    }
    resumeActiveClock() {
      if (this.activeStartedAt === void 0)
        this.activeStartedAt = this.options.now();
    }
    activeTime() {
      return this.accumulatedActiveMs + (this.activeStartedAt === void 0 ? 0 : Math.max(0, this.options.now() - this.activeStartedAt));
    }
    finish(status, error) {
      return {
        runId: this.runId,
        status,
        outputs: [...this.outputs],
        variables: this.getVariables(),
        steps: this.steps,
        activeTimeMs: this.activeTime(),
        virtualFiles: cloneFiles(status === "completed" ? this.workingFiles : this.initialFiles),
        fileChangesCommitted: status === "completed",
        ...error ? { error } : {},
        ...this.diagnostics ? { diagnostics: this.diagnostics } : {}
      };
    }
  };
  function executeSource(source, options = {}) {
    const analysis = analyzeSource(source, { maxDiagnostics: 200 });
    return expose(new Interpreter(analysis.program, options, analysis.diagnostics));
  }
  function expose(interpreter) {
    return {
      runId: interpreter.runId,
      result: interpreter.result,
      provideInput: (value) => interpreter.provideInput(value),
      stop: () => interpreter.stop(),
      getVariables: () => interpreter.getVariables()
    };
  }
  function findUnsupportedFeature(program, profile) {
    const visitType = (reference) => {
      if (reference.kind === "ErrorTypeReference")
        return void 0;
      if (reference.kind === "ArrayTypeReference") {
        for (const dimension of reference.dimensions) {
          const found = visitExpression(dimension.lower) ?? visitExpression(dimension.upper);
          if (found)
            return found;
        }
        return visitType(reference.elementType);
      }
      return void 0;
    };
    const visitExpression = (expression) => {
      if (expression.kind === "NewExpression")
        return profile === "advanced-2027" ? void 0 : { feature: "NEW / \u5BF9\u8C61", range: expression.range };
      if (expression.kind === "UnaryExpression" && expression.operator === "^" && profile !== "advanced-2027") {
        return { feature: "\u6307\u9488", range: expression.range };
      }
      if (expression.kind === "CallExpression" && expression.callee.kind === "MemberExpression" && profile !== "advanced-2027") {
        return { feature: "\u5BF9\u8C61\u65B9\u6CD5", range: expression.range };
      }
      switch (expression.kind) {
        case "UnaryExpression":
          return visitExpression(expression.operand);
        case "BinaryExpression":
          return visitExpression(expression.left) ?? visitExpression(expression.right);
        case "CallExpression":
          return expression.arguments.reduce((found, argument) => found ?? visitExpression(argument), void 0);
        case "IndexExpression":
          return visitExpression(expression.target) ?? expression.indices.reduce((found, index) => found ?? visitExpression(index), void 0);
        case "MemberExpression":
          return visitExpression(expression.target);
        default:
          return void 0;
      }
    };
    const visitStatements = (statements) => {
      for (const statement of statements) {
        let found;
        switch (statement.kind) {
          case "EnumTypeDeclaration":
            if (profile !== "advanced-2027")
              found = { feature: "\u679A\u4E3E", range: statement.range };
            break;
          case "PointerTypeDeclaration":
            if (profile !== "advanced-2027")
              found = { feature: "\u6307\u9488", range: statement.range };
            break;
          case "SetTypeDeclaration":
          case "DefineSetStatement":
            if (profile !== "advanced-2027")
              found = { feature: "\u96C6\u5408", range: statement.range };
            break;
          case "ClassDeclaration":
            if (profile !== "advanced-2027")
              found = { feature: "CLASS / \u5BF9\u8C61", range: statement.range };
            break;
          case "MethodCallStatement":
            if (profile !== "advanced-2027")
              found = { feature: "\u5BF9\u8C61\u65B9\u6CD5", range: statement.range };
            break;
          case "DeclareStatement":
            found = visitType(statement.typeReference);
            break;
          case "ConstantStatement":
            found = visitExpression(statement.value);
            break;
          case "AssignmentStatement":
            found = visitExpression(statement.target) ?? visitExpression(statement.value);
            break;
          case "InputStatement":
            found = visitExpression(statement.target);
            break;
          case "OutputStatement":
            found = statement.values.reduce((result, value) => result ?? visitExpression(value), void 0);
            break;
          case "OpenFileStatement":
            found = visitExpression(statement.file);
            break;
          case "ReadFileStatement":
            found = visitExpression(statement.file) ?? visitExpression(statement.target);
            break;
          case "WriteFileStatement":
            found = visitExpression(statement.file) ?? visitExpression(statement.data);
            break;
          case "CloseFileStatement":
            found = visitExpression(statement.file);
            break;
          case "SeekStatement":
            found = visitExpression(statement.file) ?? visitExpression(statement.address);
            break;
          case "GetRecordStatement":
            found = visitExpression(statement.file) ?? visitExpression(statement.target);
            break;
          case "PutRecordStatement":
            found = visitExpression(statement.file) ?? visitExpression(statement.data);
            break;
          case "IfStatement":
            found = visitExpression(statement.condition) ?? visitStatements(statement.thenBranch) ?? visitStatements(statement.elseBranch);
            break;
          case "CaseStatement":
            found = visitExpression(statement.selector) ?? statement.clauses.reduce((result, clause) => result ?? visitStatements(clause.body), void 0);
            break;
          case "ForStatement":
            found = visitExpression(statement.control) ?? visitExpression(statement.startValue) ?? visitExpression(statement.endValue) ?? (statement.step && visitExpression(statement.step)) ?? visitStatements(statement.body);
            break;
          case "WhileStatement":
            found = visitExpression(statement.condition) ?? visitStatements(statement.body);
            break;
          case "RepeatStatement":
            found = visitStatements(statement.body) ?? visitExpression(statement.condition);
            break;
          case "ProcedureDeclaration":
            found = visitStatements(statement.body);
            break;
          case "FunctionDeclaration":
            found = visitType(statement.returnType) ?? visitStatements(statement.body);
            break;
          case "RecordTypeDeclaration":
            found = statement.fields.reduce((result, field) => result ?? visitType(field.typeReference), void 0);
            break;
          case "ReturnStatement":
            found = visitExpression(statement.value);
            break;
          default:
            break;
        }
        if (found)
          return found;
      }
      return void 0;
    };
    return visitStatements(program.body);
  }
  function primitive2(name) {
    return { kind: "primitive", name };
  }
  function typed(type, value) {
    return { type: primitive2(type), value };
  }
  function parseInput(raw, type) {
    const trimmed = raw.trim();
    switch (type) {
      case "STRING":
        return typed(type, raw);
      case "CHAR":
        return [...raw].length === 1 ? typed(type, raw) : { messageKey: "runtime.input.invalidChar" };
      case "INTEGER": {
        if (!/^[+-]?\d+$/.test(trimmed))
          return { messageKey: "runtime.input.invalidInteger" };
        const value = Number(trimmed);
        return Number.isSafeInteger(value) ? typed(type, value) : { messageKey: "runtime.input.invalidInteger" };
      }
      case "REAL": {
        if (!/^[+-]?\d+(?:\.\d+)?$/.test(trimmed))
          return { messageKey: "runtime.input.invalidReal" };
        const value = Number(trimmed);
        return Number.isFinite(value) ? typed(type, value) : { messageKey: "runtime.input.invalidReal" };
      }
      case "BOOLEAN":
        if (/^TRUE$/i.test(trimmed))
          return typed(type, true);
        if (/^FALSE$/i.test(trimmed))
          return typed(type, false);
        return { messageKey: "runtime.input.invalidBoolean" };
      case "DATE": {
        const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(trimmed);
        if (!match)
          return { messageKey: "runtime.input.invalidDate" };
        const value = { day: Number(match[1]), month: Number(match[2]), year: Number(match[3]) };
        return validDate(value) ? typed(type, value) : { messageKey: "runtime.input.invalidDate" };
      }
    }
  }
  function instantiateComposite(type) {
    if (type.kind === "array")
      return { kind: "array", type, elements: /* @__PURE__ */ new Map() };
    if (type.kind === "record") {
      return {
        kind: "record",
        type,
        fields: new Map(type.fields.map((field) => {
          const inner = instantiateComposite(field.type);
          return [field.normalizedName, {
            name: field.name,
            normalizedName: field.normalizedName,
            kind: "field",
            type: field.type,
            initialized: inner !== void 0,
            ...inner !== void 0 ? { value: inner } : {}
          }];
        }))
      };
    }
    if (type.kind === "class") {
      const object = { kind: "object", type, fields: /* @__PURE__ */ new Map() };
      for (const field of type.fields) {
        const value = instantiateComposite(field.type);
        object.fields.set(field.normalizedName, {
          name: field.name,
          normalizedName: field.normalizedName,
          kind: "field",
          type: field.type,
          initialized: value !== void 0,
          ...value !== void 0 ? { value } : {}
        });
      }
      return object;
    }
    return void 0;
  }
  function snapshotCell(cell) {
    const storage = storageCell(cell);
    return {
      name: cell.name,
      normalizedName: cell.normalizedName,
      kind: cell.kind === "constant" ? "constant" : cell.kind === "loop-variable" ? "loop-variable" : "variable",
      type: typeName(cell.type),
      initialized: storage.initialized,
      ...storage.initialized ? { value: snapshotValue(storage.value) } : {},
      displayValue: storage.initialized ? displayValue(storage.value, cell.type) : "<\u672A\u8D4B\u503C>"
    };
  }
  function uninitializedTraceValue() {
    return { initialized: false, displayValue: "<\u672A\u8D4B\u503C>" };
  }
  function traceValueOf(cell) {
    if (!cell.traceDigest)
      return traceValue(cell);
    const inner = traceValue(cell);
    return inner.initialized ? { ...inner, displayValue: `${cell.name} = ${inner.displayValue}` } : inner;
  }
  function traceValue(cell) {
    return cell.initialized ? { initialized: true, displayValue: displayValue(cell.value, cell.type), value: snapshotValue(cell.value) } : uninitializedTraceValue();
  }
  function traceValuesEqual(left, right) {
    return left.initialized === right.initialized && left.displayValue === right.displayValue && JSON.stringify(left.value) === JSON.stringify(right.value);
  }
  function enumerateArrayKeys(dimensions, limit) {
    let total = 1;
    for (const { lower, upper } of dimensions) {
      const span = upper - lower + 1;
      if (span <= 0)
        return void 0;
      total *= span;
      if (total > limit)
        return void 0;
    }
    let keys = [[]];
    for (const { lower, upper } of dimensions) {
      const next = [];
      for (const prefix of keys)
        for (let i = lower; i <= upper; i += 1)
          next.push([...prefix, i]);
      keys = next;
    }
    return keys;
  }
  function cloneTraceState(source) {
    return new Map([...source].map(([id, state]) => [id, { ...state }]));
  }
  function buildTracePlan(program) {
    const columns = /* @__PURE__ */ new Map();
    const add = (name, normalizedName) => {
      if (!columns.has(normalizedName))
        columns.set(normalizedName, { variableId: `main:${normalizedName}`, name, normalizedName, kind: "scalar" });
    };
    const addTarget = (expression) => {
      if (expression.kind === "NameExpression")
        add(expression.name, expression.normalizedName);
    };
    const visit = (statements) => {
      for (const statement of statements) {
        switch (statement.kind) {
          case "DeclareStatement":
            if (statement.typeReference.kind === "PrimitiveTypeReference")
              add(statement.name, statement.normalizedName);
            break;
          case "ConstantStatement":
            add(statement.name, statement.normalizedName);
            break;
          case "AssignmentStatement":
            addTarget(statement.target);
            break;
          case "InputStatement":
            addTarget(statement.target);
            break;
          case "ForStatement":
            add(statement.control.name, statement.control.normalizedName);
            visit(statement.body);
            break;
          case "IfStatement":
            visit(statement.thenBranch);
            visit(statement.elseBranch);
            break;
          case "WhileStatement":
            visit(statement.body);
            break;
          case "RepeatStatement":
            visit(statement.body);
            break;
          case "CaseStatement":
            for (const clause of statement.clauses)
              visit(clause.body);
            break;
          default:
            break;
        }
      }
    };
    visit(program.body);
    return { columns: [...columns.values()] };
  }
  function snapshotValue(value) {
    if (!isComposite(value))
      return cloneValue(value);
    if (value.kind === "array") {
      const snapshot2 = {
        kind: "array",
        dimensions: value.type.dimensions.map((bounds) => ({ ...bounds })),
        elementType: typeName(value.type.elementType),
        initializedElements: []
      };
      for (const [key, cell] of value.elements) {
        if (cell.initialized)
          snapshot2.initializedElements.push({ indices: key.split(",").map(Number), value: snapshotValue(cell.value) });
      }
      return snapshot2;
    }
    if (value.kind === "object") {
      const snapshot2 = {
        kind: "object",
        className: value.type.name,
        fields: [...value.fields.values()].map((field) => ({
          name: field.name,
          initialized: field.initialized,
          ...field.initialized ? { value: snapshotValue(field.value) } : {}
        }))
      };
      return snapshot2;
    }
    if (value.kind === "pointer")
      return { kind: "pointer", target: value.target.name };
    if (value.kind === "set") {
      const snapshot2 = { kind: "set", typeName: value.type.name, values: [...value.values.values()].map((item) => cloneValue(item)) };
      return snapshot2;
    }
    if (value.kind === "enum")
      return { kind: "enum", typeName: value.type.name, member: value.member };
    const snapshot = {
      kind: "record",
      typeName: value.type.name,
      fields: [...value.fields.values()].map((field) => ({
        name: field.name,
        initialized: field.initialized,
        ...field.initialized ? { value: snapshotValue(field.value) } : {}
      }))
    };
    return snapshot;
  }
  function cloneValue(value) {
    if (isRuntimeObject(value))
      return value;
    if (isPointerValue(value))
      return value;
    if (isSetValue(value)) {
      const copy2 = { kind: "set", type: value.type, values: /* @__PURE__ */ new Map() };
      for (const [key, item] of value.values)
        copy2.values.set(key, cloneValue(item));
      return copy2;
    }
    if (isEnumValue(value))
      return value;
    if (!isComposite(value)) {
      if (isDate(value))
        return { day: value.day, month: value.month, year: value.year };
      return value;
    }
    if (value.kind === "array") {
      const copy2 = { kind: "array", type: value.type, elements: /* @__PURE__ */ new Map() };
      for (const [key, cell] of value.elements)
        copy2.elements.set(key, cloneCell(cell));
      return copy2;
    }
    const copy = { kind: "record", type: value.type, fields: /* @__PURE__ */ new Map() };
    for (const [key, cell] of value.fields)
      copy.fields.set(key, cloneCell(cell));
    return copy;
  }
  function cloneCell(cell) {
    return { ...cell, ...cell.initialized ? { value: cloneValue(cell.value) } : {} };
  }
  function isRuntimeObject(value) {
    return isComposite(value) && value.kind === "object";
  }
  function cloneFiles(files) {
    return files.map((file) => ({
      ...file,
      ...file.lines ? { lines: [...file.lines] } : {},
      ...file.records ? { records: file.records.map((record) => clonePlainRecord(record)) } : {}
    }));
  }
  function clonePlainRecord(record) {
    return Object.fromEntries(Object.entries(record).map(([key, value]) => [key, cloneUnknown(value)]));
  }
  function cloneUnknown(value) {
    if (Array.isArray(value))
      return value.map(cloneUnknown);
    if (isPlainRecord(value))
      return clonePlainRecord(value);
    return value;
  }
  function clonePlainValue(value) {
    if (isComposite(value))
      throw new Error("composite value requires explicit serialization");
    return isDate(value) ? { ...value } : value;
  }
  function normalizeName(name) {
    return name.toLocaleUpperCase("en-US");
  }
  function validatedFileName(name, range) {
    const normalized2 = normalizeName(name);
    if (!name.trim() || name.includes("/") || name.includes("\\") || name.includes("..") || /^[A-Za-z][A-Za-z0-9+.-]*:/.test(name)) {
      throw new RuntimeFault(faultInfo("RT2009", "runtime.file.invalidName", range, { file: name }));
    }
    return normalized2;
  }
  function virtualFileBytes(file) {
    if (file.kind === "text")
      return encoder.encode((file.lines ?? []).map((line) => `${line}
`).join("")).byteLength;
    return encoder.encode(JSON.stringify({ recordType: file.recordType ?? null, records: file.records ?? [] })).byteLength;
  }
  function plainPrimitive(value, type, range) {
    switch (type) {
      case "INTEGER":
        if (typeof value === "number" && Number.isSafeInteger(value))
          return value;
        break;
      case "REAL":
        if (typeof value === "number" && Number.isFinite(value))
          return value;
        break;
      case "STRING":
        if (typeof value === "string")
          return value;
        break;
      case "CHAR":
        if (typeof value === "string" && [...value].length === 1)
          return value;
        break;
      case "BOOLEAN":
        if (typeof value === "boolean")
          return value;
        break;
      case "DATE":
        if (isPlainRecord(value)) {
          const date = { day: value.day, month: value.month, year: value.year };
          if (typeof date.day === "number" && typeof date.month === "number" && typeof date.year === "number" && Number.isInteger(date.day) && Number.isInteger(date.month) && Number.isInteger(date.year) && validDate(date))
            return date;
        }
        break;
    }
    throw new RuntimeFault(faultInfo("RT2109", "runtime.random.invalidStoredRecord", range, { expected: type }));
  }
  function storageCell(cell) {
    let current = cell;
    const seen = /* @__PURE__ */ new Set();
    while (current.alias) {
      if (seen.has(current))
        throw new Error("cyclic runtime alias");
      seen.add(current);
      current = current.alias;
    }
    return current;
  }
  function formatValue(value, range) {
    if (isEnumValue(value.value))
      return value.value.member;
    if (value.type.kind !== "primitive")
      throw new RuntimeFault(faultInfo("RT1801", "runtime.output.requiresPrimitive", range));
    if (value.type.name === "BOOLEAN")
      return value.value ? "TRUE" : "FALSE";
    if (value.type.name === "DATE") {
      const date = value.value;
      return `${pad2(date.day)}/${pad2(date.month)}/${String(date.year).padStart(4, "0")}`;
    }
    if (value.type.name === "REAL") {
      const text = String(value.value);
      return text.includes(".") || /e/i.test(text) ? text : `${text}.0`;
    }
    return String(value.value);
  }
  function displayArray(value) {
    const [bounds] = value.type.dimensions;
    const span = bounds ? bounds.upper - bounds.lower + 1 : 0;
    if (value.type.dimensions.length !== 1 || span <= 0 || span > 12) {
      return `${typeName(value.type)} \xB7 ${[...value.elements.values()].filter(({ initialized }) => initialized).length} \u9879\u5DF2\u8D4B\u503C`;
    }
    const parts = [];
    for (let index = bounds.lower; index <= bounds.upper; index += 1) {
      const cell = value.elements.get(String(index));
      parts.push(cell && cell.initialized ? displayValue(cell.value, cell.type) : "?");
    }
    return `[${parts.join(", ")}]`;
  }
  function displayValue(value, type) {
    if (isComposite(value)) {
      if (value.kind === "array")
        return displayArray(value);
      if (value.kind === "pointer")
        return `^${value.target.name}`;
      if (value.kind === "set")
        return `${value.type.name} { ${[...value.values.values()].map((item) => displayValue(item)).join(", ")} }`;
      if (value.kind === "enum")
        return value.member;
      return `${value.type.name} { ${[...value.fields.values()].map((field) => `${field.name}: ${field.initialized ? displayValue(field.value, field.type) : "<\u672A\u8D4B\u503C>"}`).join(", ")} }`;
    }
    if (isDate(value))
      return `${pad2(value.day)}/${pad2(value.month)}/${String(value.year).padStart(4, "0")}`;
    if (isPointerValue(value))
      return `^${value.target.name}`;
    if (typeof value === "boolean")
      return value ? "TRUE" : "FALSE";
    if (type?.kind === "primitive" && type.name === "REAL") {
      const text = String(value);
      return text.includes(".") || /e/i.test(text) ? text : `${text}.0`;
    }
    return String(value);
  }
  function typeName(type) {
    if (type.kind === "primitive")
      return type.name;
    if (type.kind === "record")
      return type.name;
    if (type.kind === "class")
      return type.name;
    if (type.kind === "pointer")
      return `^${typeName(type.target)}`;
    if (type.kind === "set")
      return type.name;
    if (type.kind === "enum")
      return type.name;
    return `ARRAY[${type.dimensions.map(({ lower, upper }) => `${lower}:${upper}`).join(", ")}] OF ${typeName(type.elementType)}`;
  }
  function typesCompatible(target, value) {
    if (target.kind === "primitive" && value.kind === "primitive")
      return target.name === value.name || target.name === "REAL" && value.name === "INTEGER";
    if (target.kind === "record" && value.kind === "record")
      return target.normalizedName === value.normalizedName;
    if (target.kind === "array" && value.kind === "array") {
      return target.dimensions.length === value.dimensions.length && target.dimensions.every((bounds, index) => bounds.lower === value.dimensions[index]?.lower && bounds.upper === value.dimensions[index]?.upper) && sameRuntimeType(target.elementType, value.elementType);
    }
    if (target.kind === "class" && value.kind === "class")
      return isSubclassOf(value, target);
    if (target.kind === "pointer" && value.kind === "pointer")
      return sameRuntimeType(target.target, value.target);
    if (target.kind === "set" && value.kind === "set")
      return target.normalizedName === value.normalizedName;
    if (target.kind === "enum" && value.kind === "enum")
      return target.normalizedName === value.normalizedName;
    return false;
  }
  function isSubclassOf(value, target) {
    for (let current = value; current; current = current.base) {
      if (current.normalizedName === target.normalizedName)
        return true;
    }
    return false;
  }
  function sameRuntimeType(left, right) {
    if (left.kind !== right.kind)
      return false;
    if (left.kind === "primitive" && right.kind === "primitive")
      return left.name === right.name;
    if (left.kind === "record" && right.kind === "record")
      return left.normalizedName === right.normalizedName;
    if (left.kind === "array" && right.kind === "array") {
      return left.dimensions.length === right.dimensions.length && left.dimensions.every((bounds, index) => bounds.lower === right.dimensions[index]?.lower && bounds.upper === right.dimensions[index]?.upper) && sameRuntimeType(left.elementType, right.elementType);
    }
    if (left.kind === "class" && right.kind === "class")
      return left.normalizedName === right.normalizedName;
    if (left.kind === "pointer" && right.kind === "pointer")
      return sameRuntimeType(left.target, right.target);
    if (left.kind === "set" && right.kind === "set")
      return left.normalizedName === right.normalizedName;
    if (left.kind === "enum" && right.kind === "enum")
      return left.normalizedName === right.normalizedName;
    return false;
  }
  function numericBinary(left, right, range, operation) {
    const real = isPrimitive2(left.type, "REAL") || isPrimitive2(right.type, "REAL");
    return checkedNumber(operation(asNumber(left, range), asNumber(right, range)), primitive2(real ? "REAL" : "INTEGER"), range);
  }
  function checkedNumber(value, type, range) {
    if (!Number.isFinite(value) || isPrimitive2(type, "INTEGER") && !Number.isSafeInteger(value))
      throw new RuntimeFault(faultInfo("RT1302", "runtime.math.invalidResult", range));
    return { type, value };
  }
  function checkedInteger(value, range) {
    if (!Number.isSafeInteger(value))
      throw new RuntimeFault(faultInfo("RT1302", "runtime.math.invalidResult", range));
    return value;
  }
  function asNumber(value, range) {
    if (!isPrimitive2(value.type, "INTEGER") && !isPrimitive2(value.type, "REAL") || typeof value.value !== "number")
      throw new RuntimeFault(faultInfo("RT1303", "runtime.type.requiresNumber", range));
    return value.value;
  }
  function asInteger(value, range) {
    if (!value || !isPrimitive2(value.type, "INTEGER") || typeof value.value !== "number")
      throw new RuntimeFault(faultInfo("RT1304", "runtime.type.requiresInteger", range));
    return value.value;
  }
  function asBoolean(value, range) {
    if (!isPrimitive2(value.type, "BOOLEAN") || typeof value.value !== "boolean")
      throw new RuntimeFault(faultInfo("RT1305", "runtime.type.requiresBoolean", range));
    return value.value;
  }
  function asString(value, range) {
    if (!value || !isPrimitive2(value.type, "STRING") || typeof value.value !== "string")
      throw new RuntimeFault(faultInfo("RT1306", "runtime.type.requiresString", range));
    return value.value;
  }
  function asChar(value, range) {
    if (!value || !isPrimitive2(value.type, "CHAR") || typeof value.value !== "string")
      throw new RuntimeFault(faultInfo("RT1307", "runtime.type.requiresChar", range));
    return value.value;
  }
  function compareValues(left, right, range) {
    if (isEnumValue(left.value) && isEnumValue(right.value) && left.type.kind === "enum" && right.type.kind === "enum" && left.type.normalizedName === right.type.normalizedName) {
      return left.type.members.indexOf(left.value.member) - right.type.members.indexOf(right.value.member);
    }
    if (left.type.kind !== "primitive" || right.type.kind !== "primitive")
      throw new RuntimeFault(faultInfo("RT1308", "runtime.comparison.incompatible", range));
    if (left.type.name === "DATE" && right.type.name === "DATE")
      return dateNumber(left.value) - dateNumber(right.value);
    if (typeof left.value === "number" && typeof right.value === "number")
      return left.value - right.value;
    if (typeof left.value === "string" && typeof right.value === "string")
      return left.value < right.value ? -1 : left.value > right.value ? 1 : 0;
    if (typeof left.value === "boolean" && typeof right.value === "boolean")
      return Number(left.value) - Number(right.value);
    throw new RuntimeFault(faultInfo("RT1308", "runtime.comparison.incompatible", range));
  }
  function transformedChar(value, upper, range) {
    const transformed = upper ? value.toLocaleUpperCase("en") : value.toLocaleLowerCase("en");
    if ([...transformed].length !== 1)
      throw new RuntimeFault(faultInfo("RT1404", "runtime.char.caseMappingInvalid", range));
    return transformed;
  }
  function isPrimitive2(type, name) {
    return type.kind === "primitive" && type.name === name;
  }
  function isDate(value) {
    return typeof value === "object" && value !== null && "day" in value && "month" in value && "year" in value;
  }
  function isComposite(value) {
    return typeof value === "object" && value !== null && !isDate(value) && "kind" in value && (value.kind === "array" || value.kind === "record" || value.kind === "object" || value.kind === "pointer" || value.kind === "set" || value.kind === "enum");
  }
  function isRuntimeRecord(value) {
    return isComposite(value) && value.kind === "record";
  }
  function isPointerValue(value) {
    return isComposite(value) && value.kind === "pointer";
  }
  function isSetValue(value) {
    return isComposite(value) && value.kind === "set";
  }
  function isEnumValue(value) {
    return isComposite(value) && value.kind === "enum";
  }
  function valueKey(value) {
    if (isDate(value))
      return `DATE:${value.year}-${value.month}-${value.day}`;
    if (isEnumValue(value))
      return `ENUM:${value.type.normalizedName}:${value.member}`;
    if (typeof value === "string")
      return `STRING:${value}`;
    return `${typeof value}:${String(value)}`;
  }
  function isPlainRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }
  function locationName(expression) {
    return expression.kind === "NameExpression" ? expression.name : expression.kind === "MemberExpression" ? expression.member : "Value";
  }
  function validDate(value) {
    const date = new Date(Date.UTC(value.year, value.month - 1, value.day));
    return date.getUTCFullYear() === value.year && date.getUTCMonth() === value.month - 1 && date.getUTCDate() === value.day;
  }
  function dateNumber(value) {
    return Date.UTC(value.year, value.month - 1, value.day);
  }
  function pad2(value) {
    return String(value).padStart(2, "0");
  }
  function positiveInteger(value, fallback) {
    return Number.isInteger(value) && value > 0 ? value : fallback;
  }
  function positiveNumber(value, fallback) {
    return Number.isFinite(value) && value > 0 ? value : fallback;
  }
  function makeRunId() {
    return `run-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
  }
  function faultInfo(code, messageKey, range, args) {
    return { code, messageKey, range, ...args ? { args } : {} };
  }

  // packages/exercise/src/grade.ts
  var EMPTY = {
    passed: false,
    failedLayer: null,
    diagnostics: [],
    constraintResults: [],
    testResults: [],
    styleNotes: [],
    usedFeatures: [],
    aheadFeatures: [],
    codeNotes: []
  };
  function withEarlierCauses(blocking, others) {
    const firstLine = Math.min(...blocking.map((diagnostic) => diagnostic.range.start.line));
    const causes = others.filter(
      (diagnostic) => diagnostic.range.start.line < firstLine && !diagnostic.ruleId.startsWith("FMT-")
    );
    if (causes.length === 0) return blocking;
    return [...causes, ...blocking].sort((left, right) => left.range.start.line - right.range.start.line);
  }
  async function grade(input) {
    const analysis = analyzeSource(input.source, input.analyze);
    const blocking = analysis.diagnostics.filter((diagnostic) => diagnostic.severity === "error");
    const styleNotes = analysis.diagnostics.filter((diagnostic) => diagnostic.severity !== "error");
    if (blocking.length > 0) {
      return { ...EMPTY, failedLayer: "L0", diagnostics: withEarlierCauses(blocking, styleNotes) };
    }
    const features = extractFeatures(analysis.program);
    const codeNotes = findCodeNotes(analysis.program);
    const aheadFeatures = input.taughtFeatures ? [...features].filter((feature) => !AHEAD_EXEMPT_FEATURES.has(feature) && !input.taughtFeatures.includes(feature)) : [];
    const constraintResults = evaluateConstraints(features, input.constraints);
    if (constraintResults.some((result) => !result.satisfied)) {
      return { ...EMPTY, failedLayer: "L1", constraintResults, styleNotes, usedFeatures: [...features], aheadFeatures, codeNotes };
    }
    const testResults = [];
    for (const testCase of input.tests) {
      testResults.push(await runCase(input, testCase));
    }
    const failed = testResults.some((result) => !result.passed);
    return {
      passed: !failed,
      failedLayer: failed ? "L2" : null,
      diagnostics: [],
      constraintResults,
      testResults,
      styleNotes,
      usedFeatures: [...features],
      aheadFeatures,
      codeNotes
    };
  }
  function evaluateConstraints(features, constraints) {
    if (!constraints) return [];
    const results = [];
    for (const item of constraints.require ?? []) {
      results.push({ feature: item.feature, kind: "require", satisfied: features.has(item.feature), reason: item.reason });
    }
    for (const item of constraints.forbid ?? []) {
      results.push({ feature: item.feature, kind: "forbid", satisfied: !features.has(item.feature), reason: item.reason });
    }
    for (const group of constraints.requireAnyOf ?? []) {
      const satisfied = group.features.some((feature) => features.has(feature));
      results.push({ feature: group.features[0], kind: "requireAnyOf", satisfied, reason: group.reason });
    }
    return results;
  }
  async function runWithInputs(source, inputs, options = {}) {
    let cursor = 0;
    let exhausted = false;
    const transcript = [];
    let pending = "";
    const controller = executeSource(source, {
      maxSteps: 2e5,
      maxOutputLines: 500,
      ...options,
      onEvent(event) {
        options.onEvent?.(event);
        if (event.type === "output-written") {
          transcript.push({ kind: "output", text: String(event.data.text ?? "") });
          return;
        }
        if (event.type === "input-accepted") {
          transcript.push({ kind: "input", text: pending });
          return;
        }
        if (event.type !== "input-requested") return;
        if (cursor >= inputs.length) {
          exhausted = true;
          controller.stop();
          return;
        }
        pending = inputs[cursor];
        const submission = controller.provideInput(pending);
        cursor += 1;
        if (!submission.accepted && cursor >= inputs.length) {
          exhausted = true;
          controller.stop();
        }
      }
    });
    const result = await controller.result;
    const failure = result.error ? {
      code: result.error.code,
      messageKey: result.error.messageKey,
      ...result.error.args ? { args: result.error.args } : {},
      line: result.error.range.start.line
    } : null;
    return { status: result.status, outputs: result.outputs, exhausted, transcript, error: failure };
  }
  async function runCase(input, testCase) {
    const run = await runWithInputs(input.source, testCase.inputs, input.execute);
    const comparison = compareOutputs(testCase.expected, run.outputs, input.comparison, testCase.inputs);
    return {
      id: testCase.id,
      kind: testCase.kind,
      caseHint: testCase.caseHint,
      passed: run.status === "completed" && !run.exhausted && comparison.matches,
      status: run.exhausted ? "input-exhausted" : run.status,
      firstDiffLine: comparison.firstDiffLine,
      diffKind: comparison.diffKind,
      runtimeError: run.error,
      inputs: testCase.inputs,
      expected: testCase.expected,
      actual: run.outputs
    };
  }
  return __toCommonJS(index_exports);
})();
