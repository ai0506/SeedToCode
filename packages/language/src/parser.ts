import type {
  BinaryExpression,
  BinaryOperator,
  ArrayRange,
  ArrayTypeReference,
  AssignmentStatement,
  CallExpression,
  CallStatement,
  CaseClause,
  CaseLabel,
  CaseStatement,
  ClassDeclaration,
  ClassField,
  ConstantStatement,
  CloseFileStatement,
  DateLiteralValue,
  DeclareStatement,
  DefineSetStatement,
  ErrorStatement,
  ErrorExpression,
  EnumTypeDeclaration,
  Expression,
  ForStatement,
  FunctionDeclaration,
  GetRecordStatement,
  IfStatement,
  IndexExpression,
  InputStatement,
  LiteralExpression,
  LiteralType,
  MemberExpression,
  MethodCallStatement,
  NameExpression,
  NamedTypeReference,
  NewExpression,
  OutputStatement,
  OpenFileStatement,
  Parameter,
  ParameterMode,
  PrimitiveTypeReference,
  ProcedureDeclaration,
  Program,
  PointerTypeDeclaration,
  PutRecordStatement,
  RepeatStatement,
  RecordField,
  RecordTypeDeclaration,
  ReadFileStatement,
  ReturnStatement,
  SeekStatement,
  SetTypeDeclaration,
  Statement,
  TextFileMode,
  TypeReference,
  UnaryExpression,
  WhileStatement,
  WriteFileStatement
} from "./ast.js";
import type { Diagnostic, SourcePosition, SourceRange, Token } from "./types.js";
import { tokenize } from "./tokenizer.js";

export type ParseOptions = { maxDiagnostics?: number };

export type ExpressionParseResult = {
  expression: Expression;
  diagnostics: Diagnostic[];
};

export type ParseResult = {
  program: Program;
  diagnostics: Diagnostic[];
};

type ExpressionPrefixResult = ExpressionParseResult & { nextIndex: number };

type OperatorInfo = { precedence: number; relation?: boolean };

const BINARY_OPERATORS: Readonly<Record<BinaryOperator, OperatorInfo>> = {
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

const UNARY_OPERATORS = new Set(["-", "NOT", "^"]);
const BLOCK_BOUNDARIES = new Set([
  "ELSE", "ENDIF", "ENDCASE", "NEXT", "UNTIL", "ENDWHILE",
  "ENDPROCEDURE", "ENDFUNCTION", "ENDTYPE", "ENDCLASS"
]);

function rangeFrom(start: SourcePosition, end: SourcePosition): SourceRange {
  return { start: { ...start }, end: { ...end } };
}

function emptyRangeAt(position: SourcePosition): SourceRange {
  return rangeFrom(position, position);
}

function literalValue(token: Token): LiteralExpression["value"] {
  switch (token.kind) {
    case "integer": return Number(token.text);
    case "real": return Number(token.text);
    case "char":
    case "string": return token.text.slice(1, -1);
    case "boolean": return token.normalized === "TRUE";
    case "date": {
      const [day, month, year] = token.text.split("/").map(Number);
      return { day, month, year } satisfies DateLiteralValue;
    }
    default: return token.text;
  }
}

function literalType(token: Token): LiteralType {
  const names: Partial<Record<Token["kind"], LiteralType>> = {
    integer: "INTEGER",
    real: "REAL",
    char: "CHAR",
    string: "STRING",
    boolean: "BOOLEAN",
    date: "DATE"
  };
  return names[token.kind] ?? "STRING";
}

class ExpressionParser {
  private index = 0;
  private readonly diagnostics: Diagnostic[] = [];
  private readonly maxDiagnostics: number;

  constructor(private readonly tokens: readonly Token[], options: ParseOptions, startIndex = 0) {
    this.index = startIndex;
    this.maxDiagnostics = Math.max(1, options.maxDiagnostics ?? 50);
  }

  parse(): ExpressionParseResult {
    const result = this.parsePrefix();
    const trailing = this.current();
    if (trailing.kind !== "eof" && trailing.kind !== "newline") {
      this.report("PC2003", "OP-001", "parser.expression.unexpectedToken", trailing.range, { token: trailing.text });
    }
    return { expression: result.expression, diagnostics: this.diagnostics };
  }

  parsePrefix(): ExpressionPrefixResult {
    this.skipComments();
    const expression = this.parseBinary(1);
    this.skipComments();
    return { expression, diagnostics: this.diagnostics, nextIndex: this.index };
  }

  private current(): Token {
    return this.tokens[this.index] ?? this.tokens.at(-1) ?? {
      kind: "eof",
      text: "",
      range: emptyRangeAt({ offset: 0, line: 1, column: 1 })
    };
  }

  private previous(): Token {
    return this.tokens[this.index - 1] ?? this.current();
  }

  private advance(): Token {
    const token = this.current();
    if (token.kind !== "eof") this.index += 1;
    return token;
  }

  private skipComments(): void {
    while (this.current().kind === "comment") this.advance();
  }

  private skipContinuationTrivia(): void {
    while (this.current().kind === "comment" || this.current().kind === "newline") this.advance();
  }

  private matches(text: string): boolean {
    const token = this.current();
    return (token.normalized ?? token.text) === text;
  }

  private consume(text: string): Token | undefined {
    if (!this.matches(text)) return undefined;
    return this.advance();
  }

  private parseBinary(minimumPrecedence: number): Expression {
    let left = this.parseUnary();
    let hasRelation = false;

    while (true) {
      const token = this.current();
      const operator = (token.normalized ?? token.text) as BinaryOperator;
      const info = token.kind === "operator" ? BINARY_OPERATORS[operator] : undefined;
      if (!info || info.precedence < minimumPrecedence) break;

      this.advance();
      // `A == 1` 是从别的语言带过来的写法。这里报「需要一个表达式：=」对新手没有指向，
      // 直接说清楚：比较只用一个 =。吃掉第二个 = 之后照常解析，后面不会再连报一串。
      if (operator === "=" && this.matches("=") &&
          this.current().range.start.offset === token.range.end.offset) {
        const second = this.advance();
        this.report("PC2003", "OP-003", "parser.relation.doubleEquals",
          rangeFrom(token.range.start, second.range.end), {});
      }
      this.skipContinuationTrivia();
      const right = this.parseBinary(info.precedence + 1);
      const fullRange = rangeFrom(left.range.start, right.range.end);

      if (info.relation && hasRelation) {
        this.report("PC2002", "OP-003", "parser.relation.cannotChain", token.range, { operator });
        left = { kind: "ErrorExpression", reason: "chained-relation", recovered: left, range: fullRange };
        continue;
      }

      const binary: BinaryExpression = { kind: "BinaryExpression", operator, left, right, range: fullRange };
      left = binary;
      if (info.relation) hasRelation = true;
    }
    return left;
  }

  private parseUnary(): Expression {
    const token = this.current();
    const operator = (token.normalized ?? token.text) as UnaryExpression["operator"];
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

  private parsePostfix(): Expression {
    let expression = this.parsePrimary();

    while (true) {
      if (this.consume("(")) {
        const opening = this.previous();
        const arguments_: Expression[] = [];
        this.skipContinuationTrivia();
        if (!this.matches(")")) {
          while (true) {
            arguments_.push(this.parseBinary(1));
            this.skipContinuationTrivia();
            if (!this.consume(",")) break;
            this.skipContinuationTrivia();
          }
        }
        const closing = this.expectClosing(")", "parser.call.missingClosingParenthesis");
        const call: CallExpression = {
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
        const indices: Expression[] = [];
        this.skipContinuationTrivia();
        if (this.matches("]")) {
          this.report("PC2001", "ARRAY-004", "parser.index.requiresExpression", this.current().range);
        } else {
          while (true) {
            indices.push(this.parseBinary(1));
            this.skipContinuationTrivia();
            if (!this.consume(",")) break;
            this.skipContinuationTrivia();
          }
        }
        const closing = this.expectClosing("]", "parser.index.missingClosingBracket");
        const indexExpression: IndexExpression = {
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
        const memberExpression: MemberExpression = {
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

  private parsePrimary(): Expression {
    const token = this.current();
    if (this.matches("NEW")) {
      const start = this.advance();
      const className = this.current();
      if (className.kind !== "identifier") {
        this.report("PC2001", "OOP-003", "parser.new.requiresClassName", className.range);
        return { kind: "ErrorExpression", reason: "missing-expression", range: rangeFrom(start.range.start, className.range.end) };
      }
      this.advance();
      if (!this.consume("(")) this.report("PC2004", "OOP-003", "parser.call.requiresOpeningParenthesis", this.current().range);
      const arguments_: Expression[] = [];
      this.skipContinuationTrivia();
      if (!this.matches(")")) {
        while (true) {
          arguments_.push(this.parseBinary(1));
          this.skipContinuationTrivia();
          if (!this.consume(",")) break;
          this.skipContinuationTrivia();
        }
      }
      const closing = this.expectClosing(")", "parser.call.missingClosingParenthesis");
      const expression: NewExpression = {
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
      const name: NameExpression = {
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
      expression.parentheses = [parenthesisRange, ...(expression.parentheses ?? [])];
      expression.range = parenthesisRange;
      return expression;
    }

    if (token.kind !== "eof" && token.kind !== "newline" && token.kind !== "comment") this.advance();
    this.report("PC2001", "OP-001", "parser.expression.expected", token.range, { token: token.text });
    const error: ErrorExpression = {
      kind: "ErrorExpression",
      reason: "missing-expression",
      range: token.kind === "eof" || token.kind === "newline" ? emptyRangeAt(token.range.start) : token.range
    };
    return error;
  }

  private expectClosing(text: ")" | "]", messageKey: string): Token | undefined {
    const token = this.consume(text);
    if (token) return token;
    this.report("PC2004", text === "]" ? "ARRAY-004" : "OP-006", messageKey, this.current().range);
    return undefined;
  }

  private report(
    code: string,
    ruleId: string,
    messageKey: string,
    range: SourceRange,
    args?: Diagnostic["args"]
  ): void {
    if (this.diagnostics.length >= this.maxDiagnostics) return;
    this.diagnostics.push({
      code,
      ruleId,
      severity: "error",
      origin: "Editor Runtime",
      messageKey,
      range,
      ...(args ? { args } : {})
    });
  }
}

class ProgramParser {
  private index = 0;
  private readonly diagnostics: Diagnostic[] = [];
  private readonly maxDiagnostics: number;

  constructor(private readonly tokens: readonly Token[], private readonly options: ParseOptions) {
    this.maxDiagnostics = Math.max(1, options.maxDiagnostics ?? 50);
  }

  parse(): ParseResult {
    const body: Statement[] = [];
    while (!this.isAtEnd()) {
      this.skipSeparators();
      if (this.isAtEnd()) break;
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

  private current(): Token {
    return this.tokens[this.index] ?? this.tokens.at(-1) ?? {
      kind: "eof",
      text: "",
      range: emptyRangeAt({ offset: 0, line: 1, column: 1 })
    };
  }

  private advance(): Token {
    const token = this.current();
    if (token.kind !== "eof") this.index += 1;
    return token;
  }

  private isAtEnd(): boolean {
    return this.current().kind === "eof";
  }

  private matches(text: string): boolean {
    const token = this.current();
    return (token.normalized ?? token.text) === text;
  }

  private consume(text: string): Token | undefined {
    if (!this.matches(text)) return undefined;
    return this.advance();
  }

  private skipSeparators(): void {
    while (this.current().kind === "newline" || this.current().kind === "comment") this.advance();
  }

  private skipContinuationTrivia(): void {
    this.skipSeparators();
  }

  private parseStatement(): Statement {
    if (this.matches("DECLARE")) return this.parseDeclare();
    if (this.matches("CONSTANT")) return this.parseConstant();
    if (this.matches("INPUT")) return this.parseInput();
    if (this.matches("OUTPUT")) return this.parseOutput();
    if (this.matches("OPENFILE")) return this.parseOpenFile();
    if (this.matches("READFILE")) return this.parseReadFile();
    if (this.matches("WRITEFILE")) return this.parseWriteFile();
    if (this.matches("CLOSEFILE")) return this.parseCloseFile();
    if (this.matches("SEEK")) return this.parseSeek();
    if (this.matches("GETRECORD")) return this.parseGetRecord();
    if (this.matches("PUTRECORD")) return this.parsePutRecord();
    if (this.matches("IF")) return this.parseIf();
    if (this.matches("CASE")) return this.parseCase();
    if (this.matches("FOR")) return this.parseFor();
    if (this.matches("WHILE")) return this.parseWhile();
    if (this.matches("REPEAT")) return this.parseRepeat();
    if (this.matches("TYPE")) return this.parseRecordType();
    if (this.matches("DEFINE")) return this.parseDefineSet();
    if (this.matches("CLASS")) return this.parseClass();
    if (this.matches("PROCEDURE") || ((this.matches("PUBLIC") || this.matches("PRIVATE")) && this.peekNormalized(1) === "PROCEDURE")) {
      return this.parseProcedure();
    }
    if (this.matches("FUNCTION") || ((this.matches("PUBLIC") || this.matches("PRIVATE")) && this.peekNormalized(1) === "FUNCTION")) {
      return this.parseFunction();
    }
    if (this.matches("CALL")) return this.parseCall();
    if (this.matches("RETURN")) return this.parseReturn();
    if (this.current().kind === "identifier") {
      return this.findAssignmentOperator() === -1 ? this.parseMethodCallStatement() : this.parseAssignment();
    }
    if (this.matches("SUPER")) return this.parseMethodCallStatement();

    const start = this.current();
    const ruleId = this.ruleForUnsupportedKeyword(start.normalized ?? start.text);
    this.report("PC2100", ruleId, "parser.statement.unsupportedInCurrentStage", start.range, "Editor Runtime", "error", {
      keyword: start.text
    });
    const end = this.recoverLine();
    const statement: ErrorStatement = {
      kind: "ErrorStatement",
      reason: "unsupported-statement",
      range: rangeFrom(start.range.start, end)
    };
    return statement;
  }

  private parseDeclare(): DeclareStatement | ErrorStatement {
    const start = this.advance();
    const name = this.parseBindingName(start);
    if (name.kind === "ErrorStatement") return name;

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

  private parseConstant(): ConstantStatement | ErrorStatement {
    const start = this.advance();
    const name = this.parseBindingName(start);
    if (name.kind === "ErrorStatement") return name;
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

  private parseRecordType(): RecordTypeDeclaration | EnumTypeDeclaration | PointerTypeDeclaration | SetTypeDeclaration | ErrorStatement {
    const start = this.advance();
    const name = this.parseBindingName(start);
    if (name.kind === "ErrorStatement") return name;
    if (this.matches("=")) {
      this.advance();
      if (this.consume("(")) {
        const members: EnumTypeDeclaration["members"] = [];
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
          if (!this.consume(",")) break;
        }
        const closing = this.expect(")", "UDT-001", "parser.enum.requiresClosingParenthesis");
        this.finishStatement("UDT-001");
        return {
          kind: "EnumTypeDeclaration",
          name: name.text,
          normalizedName: name.normalized ?? name.text.toUpperCase(),
          nameRange: name.range,
          members,
          range: rangeFrom(start.range.start, closing?.range.end ?? members.at(-1)?.nameRange.end ?? name.range.end)
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

    const fields: RecordField[] = [];
    while (!this.isAtEnd()) {
      this.skipSeparators();
      if (this.matches("ENDTYPE") || this.matches("CLASS") || BLOCK_BOUNDARIES.has(this.currentNormalized())) break;
      if (!this.matches("DECLARE")) {
        const token = this.current();
        this.report("PC2401", "UDT-003", "parser.record.fieldRequiresDeclare", token.range, "CAIE", "error", {
          token: token.text
        });
        this.recoverLine();
        continue;
      }

      const declaration = this.parseDeclare();
      if (declaration.kind === "ErrorStatement") continue;
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

  private parseDefineSet(): DefineSetStatement | ErrorStatement {
    const start = this.advance();
    const name = this.parseBindingName(start);
    if (name.kind === "ErrorStatement") return name;
    this.expect("(", "UDT-004", "parser.set.requiresOpeningParenthesis");
    const values: Expression[] = [];
    if (!this.matches(")")) {
      while (!this.isLineEnd()) {
        values.push(this.parseExpressionPrefix());
        if (!this.consume(",")) break;
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

  private parseClass(): ClassDeclaration | ErrorStatement {
    const start = this.advance();
    const name = this.parseBindingName(start);
    if (name.kind === "ErrorStatement") return name;
    let baseName: Token | undefined;
    if (this.consume("INHERITS")) {
      if (this.current().kind === "identifier") baseName = this.advance();
      else this.report("PC2101", "OOP-002", "parser.class.requiresBaseName", this.current().range, "CAIE");
    }
    this.finishStatement("OOP-001");

    const members: ClassDeclaration["members"] = [];
    while (!this.isAtEnd()) {
      this.skipSeparators();
      if (this.matches("ENDCLASS") || BLOCK_BOUNDARIES.has(this.currentNormalized())) break;
      if (this.matches("PROCEDURE") || ((this.matches("PUBLIC") || this.matches("PRIVATE")) && this.peekNormalized(1) === "PROCEDURE")) {
        const member = this.parseProcedure();
        if (member.kind !== "ErrorStatement") members.push(member);
        continue;
      }
      if (this.matches("FUNCTION") || ((this.matches("PUBLIC") || this.matches("PRIVATE")) && this.peekNormalized(1) === "FUNCTION")) {
        const member = this.parseFunction();
        if (member.kind !== "ErrorStatement") members.push(member);
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
      const field: ClassField = {
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
      ...(baseName ? {
        baseName: baseName.text,
        normalizedBaseName: baseName.normalized ?? baseName.text.toUpperCase(),
        baseNameRange: baseName.range
      } : {}),
      members,
      range: rangeFrom(start.range.start, closing?.range.end ?? members.at(-1)?.range.end ?? name.range.end)
    };
  }

  private parseAssignment(): AssignmentStatement | ErrorStatement {
    const startIndex = this.index;
    const start = this.current();
    const operatorIndex = this.findAssignmentOperator();
    if (operatorIndex === -1) {
      this.report("PC2101", "ASSIGN-001", "parser.assignment.requiresOperator", start.range, "CAIE");
      const end = this.recoverLine();
      return { kind: "ErrorStatement", reason: "invalid-statement", range: rangeFrom(start.range.start, end) };
    }

    const operator = this.tokens[operatorIndex];
    const target = this.parseExpressionSlice(startIndex, operatorIndex);
    this.index = operatorIndex + 1;
    const value = this.parseExpressionPrefix();

    if (!this.isWritable(target)) {
      this.report("PC2104", "ASSIGN-001", "parser.assignment.requiresWritableTarget", target.range, "CAIE");
    }
    if (operator.text === "=" || operator.text === "<-") {
      this.report(
        operator.text === "=" ? "PC2102" : "PC2103",
        "ASSIGN-001",
        operator.text === "=" ? "parser.assignment.equalsNotAllowed" : "parser.assignment.asciiArrow",
        operator.range,
        "CAIE",
        operator.text === "=" ? "error" : "caie",
        undefined,
        { range: operator.range, newText: "←" }
      );
    }

    const end = value.range.end;
    this.finishStatement("ASSIGN-001");
    return {
      kind: "AssignmentStatement",
      target,
      value,
      sourceOperator: operator.text as AssignmentStatement["sourceOperator"],
      range: rangeFrom(start.range.start, end)
    };
  }

  private parseMethodCallStatement(): MethodCallStatement | ErrorStatement {
    const expression = this.parseExpressionPrefix();
    if (expression.kind !== "CallExpression" || expression.callee.kind !== "MemberExpression") {
      const directRoutine = expression.kind === "CallExpression" && expression.callee.kind === "NameExpression";
      this.report(
        "PC2101",
        directRoutine ? "PROC-001" : "OOP-004",
        directRoutine ? "parser.call.requiresCallKeyword" : "parser.methodCall.requiresObjectMethod",
        expression.range,
        "CAIE"
      );
      const end = this.recoverLine();
      return { kind: "ErrorStatement", reason: "invalid-statement", range: rangeFrom(expression.range.start, end) };
    }
    this.finishStatement("OOP-004");
    return { kind: "MethodCallStatement", call: expression, range: expression.range };
  }

  private parseInput(): InputStatement {
    const start = this.advance();
    // `INPUT "Enter name", Name` 是别的语言的写法。原来会连报两条
    // （目标不可写 + 语句末尾多了逗号），两条都没说出该怎么改。
    if (this.current().kind === "string") {
      const prompt = this.advance();
      this.report("PC2105", "IO-001", "parser.input.promptNotAllowed", prompt.range, "CAIE", "error",
        { prompt: prompt.text });
      if (this.currentNormalized() === ",") this.advance();
    }
    const target = this.parseExpressionPrefix();
    if (!this.isWritable(target)) {
      this.report("PC2104", "IO-001", "parser.input.requiresWritableTarget", target.range, "CAIE");
    }
    const end = target.range.end;
    this.finishStatement("IO-001");
    return { kind: "InputStatement", target, range: rangeFrom(start.range.start, end) };
  }

  private parseOutput(): OutputStatement {
    const start = this.advance();
    const values: Expression[] = [];
    if (this.current().kind === "newline" || this.current().kind === "comment" || this.current().kind === "eof") {
      this.report("PC2101", "IO-002", "parser.output.requiresExpression", this.current().range, "CAIE");
    } else {
      while (true) {
        values.push(this.parseExpressionPrefix());
        if (!this.consume(",")) break;
        this.skipContinuationTrivia();
      }
    }
    const end = values.at(-1)?.range.end ?? start.range.end;
    // `OUTPUT Name lives in City` 这类写法很常见：漏了逗号，或者把要显示的文字直接裸写。
    // 通用的「语句末尾出现意外内容」对这种情况几乎没有指导意义，所以单独给一条。
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

  private parseOpenFile(): OpenFileStatement {
    const start = this.advance();
    const file = this.parseExpressionPrefix();
    this.expect("FOR", "FILE-001", "parser.openFile.requiresFor");
    const modeToken = this.current();
    let mode: TextFileMode = "READ";
    if (this.matches("READ") || this.matches("WRITE") || this.matches("APPEND") || this.matches("RANDOM")) {
      mode = this.currentNormalized() as TextFileMode;
      this.advance();
    } else {
      this.report("PC2501", "FILE-001", "parser.openFile.invalidMode", modeToken.range, "CAIE", "error", {
        mode: modeToken.text
      });
      if (!this.isLineEnd()) this.advance();
    }
    const end = this.current().range.start;
    this.finishStatement("FILE-001");
    return { kind: "OpenFileStatement", file, mode, range: rangeFrom(start.range.start, end) };
  }

  private parseReadFile(): ReadFileStatement {
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

  private parseWriteFile(): WriteFileStatement {
    const start = this.advance();
    const file = this.parseExpressionPrefix();
    this.expect(",", "FILE-003", "parser.writeFile.requiresComma");
    const data = this.parseExpressionPrefix();
    const end = data.range.end;
    this.finishStatement("FILE-003");
    return { kind: "WriteFileStatement", file, data, range: rangeFrom(start.range.start, end) };
  }

  private parseCloseFile(): CloseFileStatement {
    const start = this.advance();
    const file = this.parseExpressionPrefix();
    const end = file.range.end;
    this.finishStatement("FILE-003");
    return { kind: "CloseFileStatement", file, range: rangeFrom(start.range.start, end) };
  }

  private parseSeek(): SeekStatement {
    const start = this.advance();
    const file = this.parseExpressionPrefix();
    this.expect(",", "FILE-005", "parser.seek.requiresComma");
    const address = this.parseExpressionPrefix();
    this.finishStatement("FILE-005");
    return { kind: "SeekStatement", file, address, range: rangeFrom(start.range.start, address.range.end) };
  }

  private parseGetRecord(): GetRecordStatement {
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

  private parsePutRecord(): PutRecordStatement {
    const start = this.advance();
    const file = this.parseExpressionPrefix();
    this.expect(",", "FILE-005", "parser.putRecord.requiresComma");
    const data = this.parseExpressionPrefix();
    this.finishStatement("FILE-005");
    return { kind: "PutRecordStatement", file, data, range: rangeFrom(start.range.start, data.range.end) };
  }

  private parseIf(): IfStatement {
    const start = this.advance();
    const condition = this.parseExpressionPrefix();
    this.expect("THEN", "IF-001", "parser.if.requiresThen");
    this.finishStatement("IF-001");
    const thenBranch = this.parseBlock(["ELSE", "ENDIF"]);
    let elseBranch: Statement[] = [];
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

  private parseCase(): CaseStatement {
    const start = this.advance();
    this.expect("OF", "CASE-001", "parser.case.requiresOf");
    const selector = this.parseExpressionPrefix();
    this.finishStatement("CASE-001");
    const clauses: CaseClause[] = [];
    let sawOtherwise = false;

    while (!this.isAtEnd()) {
      this.skipSeparators();
      if (this.matches("ENDCASE") || BLOCK_BOUNDARIES.has(this.currentNormalized())) break;

      const clauseStart = this.current();
      if (this.matches("OTHERWISE")) {
        if (sawOtherwise) {
          this.report("PC2205", "CASE-002", "parser.case.duplicateOtherwise", clauseStart.range, "CAIE");
        }
        sawOtherwise = true;
        this.advance();
        this.expect(":", "CASE-001", "parser.case.otherwiseRequiresColon");
        const body = this.parseCaseClauseBody();
        clauses.push({
          kind: "CaseClause",
          labels: [],
          isOtherwise: true,
          body,
          range: rangeFrom(clauseStart.range.start, this.branchEnd(body, [], clauseStart.range.end))
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

  private parseCaseLabels(): CaseLabel[] {
    const labels: CaseLabel[] = [];
    while (!this.isLineEnd() && !this.matches(":")) {
      const lower = this.parseExpressionPrefix();
      if (this.consume("TO")) {
        const upper = this.parseExpressionPrefix();
        labels.push({ kind: "CaseRangeLabel", lower, upper, range: rangeFrom(lower.range.start, upper.range.end) });
      } else {
        labels.push({ kind: "CaseValueLabel", value: lower, range: lower.range });
      }
      if (!this.consume(",")) break;
    }
    if (labels.length === 0) {
      this.report("PC2204", "CASE-001", "parser.case.requiresLabel", this.current().range, "CAIE");
    }
    return labels;
  }

  private parseCaseClauseBody(): Statement[] {
    if (!this.isLineEnd()) return [this.parseStatement()];
    this.finishStatement("CASE-001");
    const body: Statement[] = [];
    while (!this.isAtEnd()) {
      this.skipSeparators();
      if (this.matches("ENDCASE") || this.matches("OTHERWISE") || BLOCK_BOUNDARIES.has(this.currentNormalized()) || this.isCaseClauseStart()) break;
      body.push(this.parseStatement());
    }
    return body;
  }

  private parseFor(): ForStatement {
    const start = this.advance();
    const controlToken = this.current();
    if (controlToken.kind === "identifier") this.advance();
    else this.report("PC2201", "FOR-001", "parser.for.requiresControlVariable", controlToken.range, "CAIE");
    const control: NameExpression = {
      kind: "NameExpression",
      name: controlToken.kind === "identifier" ? controlToken.text : "",
      normalizedName: controlToken.kind === "identifier" ? controlToken.normalized ?? controlToken.text.toUpperCase() : "",
      range: controlToken.range
    };
    this.parseLoopArrow("FOR-001");
    const startValue = this.parseExpressionPrefix();
    this.expect("TO", "FOR-001", "parser.for.requiresTo");
    const endValue = this.parseExpressionPrefix();
    let step: Expression | undefined;
    if (this.consume("STEP")) step = this.parseExpressionPrefix();
    this.finishStatement("FOR-001");
    const body = this.parseBlock(["NEXT"]);

    let nextVariable: ForStatement["nextVariable"];
    let closing: Token | undefined;
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
      ...(step ? { step } : {}),
      body,
      ...(nextVariable ? { nextVariable } : {}),
      range: rangeFrom(start.range.start, nextVariable?.range.end ?? closing?.range.end ?? this.branchEnd(body, [], endValue.range.end))
    };
  }

  private parseWhile(): WhileStatement {
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

  private parseRepeat(): RepeatStatement {
    const start = this.advance();
    this.finishStatement("REPEAT-001");
    const body = this.parseBlock(["UNTIL"]);
    let condition: Expression;
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

  private parseProcedure(): ProcedureDeclaration | ErrorStatement {
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
      ...(access ? { access } : {}),
      parameters,
      body,
      range: rangeFrom(declarationStart.range.start, closing?.range.end ?? this.branchEnd(body, [], name.range.end))
    };
  }

  private parseFunction(): FunctionDeclaration | ErrorStatement {
    const declarationStart = this.current();
    const access = this.parseAccess();
    const start = this.current();
    this.expect("FUNCTION", "FUNC-001", "parser.function.requiresKeyword");
    const name = this.current();
    if (name.kind !== "identifier") return this.invalidRoutineHeader(start, "FUNC-001", "parser.function.requiresName");
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
      ...(access ? { access } : {}),
      parameters,
      returnType,
      body,
      range: rangeFrom(declarationStart.range.start, closing?.range.end ?? this.branchEnd(body, [], returnType.range.end))
    };
  }

  private parseParameters(inFunction: boolean): Parameter[] {
    const parameters: Parameter[] = [];
    this.expect("(", inFunction ? "FUNC-001" : "PROC-001", "parser.routine.requiresOpeningParenthesis");
    let currentMode: ParameterMode = "BYVAL";
    if (!this.matches(")")) {
      while (!this.isLineEnd()) {
        const parameterStart = this.current();
        let explicitMode = false;
        if (this.matches("BYVAL") || this.matches("BYREF")) {
          currentMode = this.currentNormalized() as ParameterMode;
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
        if (!this.consume(",")) break;
      }
    }
    this.expect(")", inFunction ? "FUNC-001" : "PROC-001", "parser.routine.requiresClosingParenthesis");
    return parameters;
  }

  private parseCall(): CallStatement | ErrorStatement {
    const start = this.advance();
    const name = this.current();
    if (name.kind !== "identifier") {
      this.report("PC2301", "PROC-001", "parser.call.requiresName", name.range, "CAIE");
      const end = this.recoverLine();
      return { kind: "ErrorStatement", reason: "invalid-statement", range: rangeFrom(start.range.start, end) };
    }
    this.advance();
    const target: NameExpression = {
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

  private parseReturn(): ReturnStatement {
    const start = this.advance();
    const value = this.parseExpressionPrefix();
    this.finishStatement("FUNC-001");
    return { kind: "ReturnStatement", value, range: rangeFrom(start.range.start, value.range.end) };
  }

  private parseArgumentList(ruleId: string): { arguments: Expression[]; end: SourcePosition } {
    const arguments_: Expression[] = [];
    const opening = this.expect("(", ruleId, "parser.call.requiresOpeningParenthesis");
    this.skipContinuationTrivia();
    if (!this.matches(")")) {
      while (true) {
        arguments_.push(this.parseExpressionPrefix());
        this.skipContinuationTrivia();
        if (!this.consume(",")) break;
        this.skipContinuationTrivia();
      }
    }
    const closing = this.expect(")", ruleId, "parser.call.requiresClosingParenthesis");
    return { arguments: arguments_, end: closing?.range.end ?? arguments_.at(-1)?.range.end ?? opening?.range.end ?? this.current().range.start };
  }

  private parseAccess(): "PUBLIC" | "PRIVATE" | undefined {
    if (!this.matches("PUBLIC") && !this.matches("PRIVATE")) return undefined;
    return this.advance().normalized as "PUBLIC" | "PRIVATE";
  }

  private invalidRoutineHeader(start: Token, ruleId: string, messageKey: string): ErrorStatement {
    this.report("PC2301", ruleId, messageKey, this.current().range, "CAIE");
    const end = this.recoverLine();
    return { kind: "ErrorStatement", reason: "invalid-statement", range: rangeFrom(start.range.start, end) };
  }

  private parseBlock(terminators: string[]): Statement[] {
    const body: Statement[] = [];
    while (!this.isAtEnd()) {
      this.skipSeparators();
      const current = this.currentNormalized();
      if (terminators.includes(current) || BLOCK_BOUNDARIES.has(current)) break;
      body.push(this.parseStatement());
    }
    return body;
  }

  private parseLoopArrow(ruleId: string): void {
    const token = this.current();
    if (!this.matches("←")) {
      this.report("PC2201", ruleId, "parser.loop.requiresAssignmentArrow", token.range, "CAIE");
      return;
    }
    this.advance();
    if (token.text === "<-") {
      this.report("PC2103", "ASSIGN-001", "parser.assignment.asciiArrow", token.range, "CAIE", "caie", undefined, {
        range: token.range,
        newText: "←"
      });
    }
  }

  private consumeBlockEnd(expected: string, ruleId: string, messageKey: string, opener?: Token): Token | undefined {
    if (!this.matches(expected)) {
      this.reportBlockEnd(expected, ruleId, messageKey, opener);
      return undefined;
    }
    const closing = this.advance();
    this.finishStatement(ruleId);
    return closing;
  }

  private reportBlockEnd(expected: string, ruleId: string, messageKey: string, opener?: Token): void {
    const actual = this.currentNormalized();
    if (BLOCK_BOUNDARIES.has(actual)) {
      this.report("PC2200", ruleId, "parser.block.mismatchedEnd", this.current().range, "Editor Runtime", "error", { expected, actual });
      this.recoverLine();
    } else {
      // 缺结束符时报在文件末尾，对长程序等于没报。指回那个没被闭合的开头，
      // 学生要找的就是它；行号也一并写进文案。
      const range = opener ? opener.range : this.current().range;
      this.report("PC2200", ruleId, messageKey, range, "Editor Runtime", "error",
        { expected, opener: opener ? opener.normalized ?? opener.text : expected, line: range.start.line });
    }
  }

  private currentNormalized(): string {
    return this.current().normalized ?? this.current().text;
  }

  private peekNormalized(distance: number): string {
    const token = this.tokens[this.index + distance];
    return token?.normalized ?? token?.text ?? "";
  }

  private isCaseClauseStart(): boolean {
    const token = this.current();
    if (!["integer", "real", "char", "string", "boolean", "date", "identifier"].includes(token.kind)) return false;
    for (let i = this.index; i < this.tokens.length; i += 1) {
      const candidate = this.tokens[i];
      if (candidate.kind === "newline" || candidate.kind === "comment" || candidate.kind === "eof") return false;
      if (candidate.text === ":") return true;
    }
    return false;
  }

  private branchEnd(primary: Array<{ range: SourceRange }>, fallback: Array<{ range: SourceRange }>, defaultEnd: SourcePosition): SourcePosition {
    return primary.at(-1)?.range.end ?? fallback.at(-1)?.range.end ?? defaultEnd;
  }

  private parseTypeReference(): TypeReference {
    const token = this.current();
    if (token.kind === "type-name") {
      this.advance();
      const primitive: PrimitiveTypeReference = {
        kind: "PrimitiveTypeReference",
        name: token.normalized as LiteralType,
        range: token.range
      };
      return primitive;
    }

    if (token.kind === "identifier") {
      this.advance();
      const named: NamedTypeReference = {
        kind: "NamedTypeReference",
        name: token.text,
        normalizedName: token.normalized ?? token.text.toUpperCase(),
        range: token.range
      };
      return named;
    }

    if (this.matches("ARRAY")) return this.parseArrayTypeReference();

    this.report("PC2101", "TYPE-001", "parser.type.expected", token.range, "CAIE");
    if (token.kind !== "newline" && token.kind !== "comment" && token.kind !== "eof") this.advance();
    return { kind: "ErrorTypeReference", range: token.range };
  }

  private parseArrayTypeReference(): ArrayTypeReference {
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

  private parseArrayDimensions(): ArrayRange[] {
    this.expect("[", "ARRAY-002", "parser.arrayType.requiresOpeningBracket");
    const dimensions: ArrayRange[] = [];

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
      if (!this.consume(",")) break;
    }

    this.expect("]", "ARRAY-002", "parser.arrayType.requiresClosingBracket");
    return dimensions;
  }

  private parseExpressionPrefix(): Expression {
    const parser = new ExpressionParser(this.tokens, {
      ...this.options,
      maxDiagnostics: Math.max(1, this.maxDiagnostics - this.diagnostics.length)
    }, this.index);
    const result = parser.parsePrefix();
    this.index = result.nextIndex;
    this.diagnostics.push(...result.diagnostics.slice(0, this.maxDiagnostics - this.diagnostics.length));
    return result.expression;
  }

  private parseExpressionSlice(start: number, end: number): Expression {
    const endPosition = this.tokens[end]?.range.start ?? this.current().range.start;
    const eof: Token = { kind: "eof", text: "", range: emptyRangeAt(endPosition) };
    const parser = new ExpressionParser([...this.tokens.slice(start, end), eof], {
      ...this.options,
      maxDiagnostics: Math.max(1, this.maxDiagnostics - this.diagnostics.length)
    });
    const result = parser.parse();
    this.diagnostics.push(...result.diagnostics.slice(0, this.maxDiagnostics - this.diagnostics.length));
    return result.expression;
  }

  private findAssignmentOperator(): number {
    let bracketDepth = 0;
    let parenthesisDepth = 0;
    for (let i = this.index; i < this.tokens.length; i += 1) {
      const token = this.tokens[i];
      if (token.kind === "newline" || token.kind === "comment" || token.kind === "eof") break;
      if (token.text === "[") bracketDepth += 1;
      else if (token.text === "]") bracketDepth -= 1;
      else if (token.text === "(") parenthesisDepth += 1;
      else if (token.text === ")") parenthesisDepth -= 1;
      else if (bracketDepth === 0 && parenthesisDepth === 0 && ["←", "<-", "="].includes(token.text)) return i;
    }
    return -1;
  }

  private isWritable(expression: Expression): boolean {
    if (expression.kind === "NameExpression") return true;
    if (expression.kind === "IndexExpression" || expression.kind === "MemberExpression") return this.isWritable(expression.target);
    return expression.kind === "UnaryExpression" && expression.postfix === true && expression.operator === "^";
  }

  private parseBindingName(start: Token): Token | ErrorStatement {
    const token = this.current();
    if (token.kind === "identifier") {
      this.advance();
      if (this.matches("-") && this.tokens[this.index + 1]?.kind === "identifier") {
        const endToken = this.tokens[this.index + 1];
        this.report(
          "PC2107",
          "ID-001",
          "parser.bindingName.invalidFormat",
          rangeFrom(token.range.start, endToken.range.end),
          "CAIE"
        );
        const end = this.recoverLine();
        return { kind: "ErrorStatement", reason: "invalid-statement", range: rangeFrom(start.range.start, end) };
      }
      return token;
    }

    const keyword = token.kind === "keyword" || token.kind === "type-name" || token.kind === "boolean";
    this.report(
      keyword ? "PC2108" : "PC2107",
      keyword ? "ID-002" : "ID-001",
      keyword ? "parser.bindingName.cannotBeKeyword" : "parser.bindingName.invalidFormat",
      token.range,
      "CAIE"
    );
    const end = this.recoverLine();
    return { kind: "ErrorStatement", reason: "invalid-statement", range: rangeFrom(start.range.start, end) };
  }

  private expect(text: string, ruleId: string, messageKey: string): Token | undefined {
    const token = this.consume(text);
    if (token) return token;
    this.report("PC2101", ruleId, messageKey, this.current().range, "CAIE");
    return undefined;
  }

  private finishStatement(ruleId: string): void {
    if (this.current().kind === "comment") this.advance();
    if (this.current().kind === "newline") {
      this.advance();
      return;
    }
    if (this.current().kind === "eof") return;
    this.report("PC2106", ruleId, "parser.statement.unexpectedTrailingToken", this.current().range, "Editor Runtime", "error", {
      token: this.current().text
    });
    this.recoverLine();
  }

  /** 这个 token 能不能作为一个新表达式的开头。用来识别「本该有逗号」的位置。 */
  private startsExpression(token: Token): boolean {
    if (token.kind === "identifier" || token.kind === "string" || token.kind === "char") return true;
    if (token.kind === "integer" || token.kind === "real" || token.kind === "date") return true;
    if (token.kind === "boolean") return true;
    if (token.kind === "keyword") return token.normalized === "NOT";
    return token.kind === "operator" && (token.text === "(" || token.text === "-");
  }

  private isLineEnd(): boolean {
    return this.current().kind === "newline" || this.current().kind === "comment" || this.current().kind === "eof";
  }

  private recoverLine(): SourcePosition {
    let end = this.current().range.end;
    while (!this.isLineEnd()) end = this.advance().range.end;
    if (this.current().kind === "comment") end = this.advance().range.end;
    if (this.current().kind === "newline") this.advance();
    return end;
  }

  private ruleForUnsupportedKeyword(keyword: string): string {
    const rules: Record<string, string> = {
      IF: "IF-001", CASE: "CASE-001", FOR: "FOR-001", REPEAT: "REPEAT-001", WHILE: "WHILE-001",
      PROCEDURE: "PROC-001", FUNCTION: "FUNC-001", CALL: "PROC-001", RETURN: "FUNC-001",
      OPENFILE: "FILE-001", READFILE: "FILE-002", WRITEFILE: "FILE-003", CLOSEFILE: "FILE-003",
      SEEK: "FILE-005", GETRECORD: "FILE-005", PUTRECORD: "FILE-005",
      TYPE: "UDT-003", CLASS: "OOP-001"
    };
    return rules[keyword] ?? "OP-001";
  }

  private report(
    code: string,
    ruleId: string,
    messageKey: string,
    range: SourceRange,
    origin: Diagnostic["origin"],
    severity: Diagnostic["severity"] = "error",
    args?: Diagnostic["args"],
    fix?: Diagnostic["fix"]
  ): void {
    if (this.diagnostics.length >= this.maxDiagnostics) return;
    this.diagnostics.push({ code, ruleId, messageKey, range, origin, severity, ...(args ? { args } : {}), ...(fix ? { fix } : {}) });
  }
}

export function parseExpression(tokens: readonly Token[], options: ParseOptions = {}): ExpressionParseResult {
  return new ExpressionParser(tokens, options).parse();
}

export function parse(tokens: readonly Token[], options: ParseOptions = {}): ParseResult {
  return new ProgramParser(tokens, options).parse();
}

export function parseSource(source: string, options: ParseOptions = {}): ParseResult {
  const tokenized = tokenize(source);
  const parsed = parse(tokenized.tokens, options);
  return {
    program: parsed.program,
    diagnostics: [...tokenized.diagnostics, ...parsed.diagnostics]
      .sort((a, b) => a.range.start.offset - b.range.start.offset || a.code.localeCompare(b.code))
      .filter((diagnostic, index, all) => !all.slice(0, index).some((earlier) =>
        earlier.ruleId === diagnostic.ruleId
        && earlier.range.start.offset === diagnostic.range.start.offset
        && earlier.range.end.offset === diagnostic.range.end.offset
      ))
      .slice(0, Math.max(1, options.maxDiagnostics ?? 50))
  };
}
