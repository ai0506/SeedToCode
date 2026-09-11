import type { SourceRange, Token } from "./types.js";

export type NodeBase = {
  kind: string;
  range: SourceRange;
  /** Outer-to-inner source ranges for parentheses retained by the parser. */
  parentheses?: SourceRange[];
};

export type LiteralType = "INTEGER" | "REAL" | "CHAR" | "STRING" | "BOOLEAN" | "DATE";

export type DateLiteralValue = { day: number; month: number; year: number };

export type LiteralExpression = NodeBase & {
  kind: "LiteralExpression";
  literalType: LiteralType;
  raw: string;
  value: number | string | boolean | DateLiteralValue;
};

export type NameExpression = NodeBase & {
  kind: "NameExpression";
  name: string;
  normalizedName: string;
};

export type UnaryExpression = NodeBase & {
  kind: "UnaryExpression";
  operator: "-" | "NOT" | "^";
  operand: Expression;
  postfix?: boolean;
};

export type BinaryOperator =
  | "OR" | "AND"
  | ">" | "<" | ">=" | "<=" | "=" | "<>"
  | "&" | "+" | "-" | "*" | "/" | "DIV" | "MOD";

export type BinaryExpression = NodeBase & {
  kind: "BinaryExpression";
  operator: BinaryOperator;
  left: Expression;
  right: Expression;
};

export type CallExpression = NodeBase & {
  kind: "CallExpression";
  callee: Expression;
  arguments: Expression[];
};

export type NewExpression = NodeBase & {
  kind: "NewExpression";
  className: string;
  normalizedClassName: string;
  classNameRange: SourceRange;
  arguments: Expression[];
};

export type IndexExpression = NodeBase & {
  kind: "IndexExpression";
  target: Expression;
  indices: Expression[];
};

export type MemberExpression = NodeBase & {
  kind: "MemberExpression";
  target: Expression;
  member: string;
  normalizedMember: string;
  memberRange: SourceRange;
};

export type ErrorExpression = NodeBase & {
  kind: "ErrorExpression";
  reason: "missing-expression" | "chained-relation";
  recovered?: Expression;
};

export type Expression =
  | LiteralExpression
  | NameExpression
  | UnaryExpression
  | BinaryExpression
  | CallExpression
  | NewExpression
  | IndexExpression
  | MemberExpression
  | ErrorExpression;

export type PrimitiveTypeReference = NodeBase & {
  kind: "PrimitiveTypeReference";
  name: LiteralType;
};

export type NamedTypeReference = NodeBase & {
  kind: "NamedTypeReference";
  name: string;
  normalizedName: string;
};

export type ArrayRange = NodeBase & {
  kind: "ArrayRange";
  lower: Expression;
  upper: Expression;
};

export type ArrayTypeReference = NodeBase & {
  kind: "ArrayTypeReference";
  dimensions: ArrayRange[];
  elementType: TypeReference;
};

export type ErrorTypeReference = NodeBase & {
  kind: "ErrorTypeReference";
};

export type TypeReference = PrimitiveTypeReference | NamedTypeReference | ArrayTypeReference | ErrorTypeReference;

export type DeclareStatement = NodeBase & {
  kind: "DeclareStatement";
  name: string;
  normalizedName: string;
  nameRange: SourceRange;
  typeReference: TypeReference;
};

export type ConstantStatement = NodeBase & {
  kind: "ConstantStatement";
  name: string;
  normalizedName: string;
  nameRange: SourceRange;
  value: Expression;
};

export type AssignmentStatement = NodeBase & {
  kind: "AssignmentStatement";
  target: Expression;
  value: Expression;
  sourceOperator: "←" | "<-" | "=";
};

export type InputStatement = NodeBase & {
  kind: "InputStatement";
  target: Expression;
};

export type OutputStatement = NodeBase & {
  kind: "OutputStatement";
  values: Expression[];
};

export type TextFileMode = "READ" | "WRITE" | "APPEND" | "RANDOM";

export type OpenFileStatement = NodeBase & {
  kind: "OpenFileStatement";
  file: Expression;
  mode: TextFileMode;
};

export type ReadFileStatement = NodeBase & {
  kind: "ReadFileStatement";
  file: Expression;
  target: Expression;
};

export type WriteFileStatement = NodeBase & {
  kind: "WriteFileStatement";
  file: Expression;
  data: Expression;
};

export type CloseFileStatement = NodeBase & {
  kind: "CloseFileStatement";
  file: Expression;
};

export type SeekStatement = NodeBase & {
  kind: "SeekStatement";
  file: Expression;
  address: Expression;
};

export type GetRecordStatement = NodeBase & {
  kind: "GetRecordStatement";
  file: Expression;
  target: Expression;
};

export type PutRecordStatement = NodeBase & {
  kind: "PutRecordStatement";
  file: Expression;
  data: Expression;
};

export type IfStatement = NodeBase & {
  kind: "IfStatement";
  condition: Expression;
  thenBranch: Statement[];
  elseBranch: Statement[];
};

export type CaseValueLabel = NodeBase & {
  kind: "CaseValueLabel";
  value: Expression;
};

export type CaseRangeLabel = NodeBase & {
  kind: "CaseRangeLabel";
  lower: Expression;
  upper: Expression;
};

export type CaseLabel = CaseValueLabel | CaseRangeLabel;

export type CaseClause = NodeBase & {
  kind: "CaseClause";
  labels: CaseLabel[];
  isOtherwise: boolean;
  body: Statement[];
};

export type CaseStatement = NodeBase & {
  kind: "CaseStatement";
  selector: Expression;
  clauses: CaseClause[];
};

export type ForStatement = NodeBase & {
  kind: "ForStatement";
  control: NameExpression;
  startValue: Expression;
  endValue: Expression;
  step?: Expression;
  body: Statement[];
  nextVariable?: { name: string; normalizedName: string; range: SourceRange };
};

export type WhileStatement = NodeBase & {
  kind: "WhileStatement";
  condition: Expression;
  body: Statement[];
};

export type RepeatStatement = NodeBase & {
  kind: "RepeatStatement";
  body: Statement[];
  condition: Expression;
};

export type ParameterMode = "BYVAL" | "BYREF";

export type Parameter = NodeBase & {
  kind: "Parameter";
  name: string;
  normalizedName: string;
  nameRange: SourceRange;
  mode: ParameterMode;
  explicitMode: boolean;
  typeReference: TypeReference;
};

export type ProcedureDeclaration = NodeBase & {
  kind: "ProcedureDeclaration";
  name: string;
  normalizedName: string;
  nameRange: SourceRange;
  access?: "PUBLIC" | "PRIVATE";
  parameters: Parameter[];
  body: Statement[];
};

export type FunctionDeclaration = NodeBase & {
  kind: "FunctionDeclaration";
  name: string;
  normalizedName: string;
  nameRange: SourceRange;
  access?: "PUBLIC" | "PRIVATE";
  parameters: Parameter[];
  returnType: TypeReference;
  body: Statement[];
};

export type RecordField = NodeBase & {
  kind: "RecordField";
  name: string;
  normalizedName: string;
  nameRange: SourceRange;
  typeReference: TypeReference;
};

export type RecordTypeDeclaration = NodeBase & {
  kind: "RecordTypeDeclaration";
  name: string;
  normalizedName: string;
  nameRange: SourceRange;
  fields: RecordField[];
};

export type EnumMember = {
  name: string;
  normalizedName: string;
  nameRange: SourceRange;
};

export type EnumTypeDeclaration = NodeBase & {
  kind: "EnumTypeDeclaration";
  name: string;
  normalizedName: string;
  nameRange: SourceRange;
  members: EnumMember[];
};

export type PointerTypeDeclaration = NodeBase & {
  kind: "PointerTypeDeclaration";
  name: string;
  normalizedName: string;
  nameRange: SourceRange;
  targetType: TypeReference;
};

export type SetTypeDeclaration = NodeBase & {
  kind: "SetTypeDeclaration";
  name: string;
  normalizedName: string;
  nameRange: SourceRange;
  elementType: TypeReference;
};

export type DefineSetStatement = NodeBase & {
  kind: "DefineSetStatement";
  name: string;
  normalizedName: string;
  nameRange: SourceRange;
  values: Expression[];
  typeReference: TypeReference;
};

export type ClassField = NodeBase & {
  kind: "ClassField";
  name: string;
  normalizedName: string;
  nameRange: SourceRange;
  access: "PUBLIC" | "PRIVATE";
  typeReference: TypeReference;
};

export type ClassDeclaration = NodeBase & {
  kind: "ClassDeclaration";
  name: string;
  normalizedName: string;
  nameRange: SourceRange;
  baseName?: string;
  normalizedBaseName?: string;
  baseNameRange?: SourceRange;
  members: Array<ClassField | ProcedureDeclaration | FunctionDeclaration>;
};

export type MethodCallStatement = NodeBase & {
  kind: "MethodCallStatement";
  call: CallExpression;
};

export type CallStatement = NodeBase & {
  kind: "CallStatement";
  target: NameExpression;
  arguments: Expression[];
};

export type ReturnStatement = NodeBase & {
  kind: "ReturnStatement";
  value: Expression;
};

export type ErrorStatement = NodeBase & {
  kind: "ErrorStatement";
  reason: "unsupported-statement" | "invalid-statement";
};

export type Statement =
  | DeclareStatement
  | ConstantStatement
  | AssignmentStatement
  | InputStatement
  | OutputStatement
  | OpenFileStatement
  | ReadFileStatement
  | WriteFileStatement
  | CloseFileStatement
  | SeekStatement
  | GetRecordStatement
  | PutRecordStatement
  | IfStatement
  | CaseStatement
  | ForStatement
  | WhileStatement
  | RepeatStatement
  | ProcedureDeclaration
  | FunctionDeclaration
  | RecordTypeDeclaration
  | EnumTypeDeclaration
  | PointerTypeDeclaration
  | SetTypeDeclaration
  | DefineSetStatement
  | ClassDeclaration
  | MethodCallStatement
  | CallStatement
  | ReturnStatement
  | ErrorStatement;

export type Program = NodeBase & {
  kind: "Program";
  body: Statement[];
  comments: Token[];
};
