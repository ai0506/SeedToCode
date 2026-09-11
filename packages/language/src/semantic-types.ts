import type { Expression, LiteralType } from "./ast.js";
import type { Diagnostic, SourceRange } from "./types.js";

export type PrimitiveType = { kind: "primitive"; name: LiteralType };
export type ArrayDimension = { lower?: number; upper?: number };
export type ArrayType = { kind: "array"; dimensions: ArrayDimension[]; elementType: Type };
export type NamedType = { kind: "named"; name: string; normalizedName: string };
export type RecordFieldType = { name: string; normalizedName: string; type: Type; declaration: SourceRange };
export type RecordType = { kind: "record"; name: string; normalizedName: string; fields: RecordFieldType[] };
export type EnumType = { kind: "enum"; name: string; normalizedName: string; members: string[] };
export type PointerType = { kind: "pointer"; target: Type };
export type SetType = { kind: "set"; name: string; normalizedName: string; elementType: Type };
export type ClassMemberType = {
  name: string;
  normalizedName: string;
  kind: "field" | "procedure" | "function";
  access: "PUBLIC" | "PRIVATE";
  ownerNormalizedName: string;
  type: Type;
  declaration: SourceRange;
};
export type ClassType = {
  kind: "class";
  name: string;
  normalizedName: string;
  members: ClassMemberType[];
  base?: ClassType;
};
export type RoutineParameterType = { name: string; mode: "BYVAL" | "BYREF"; type: Type };
export type FunctionType = { kind: "function"; parameters: RoutineParameterType[]; returns: Type };
export type ProcedureType = { kind: "procedure"; parameters: RoutineParameterType[] };
export type UnknownType = { kind: "unknown" };

export type Type = PrimitiveType | ArrayType | NamedType | RecordType | EnumType | PointerType | SetType | ClassType | FunctionType | ProcedureType | UnknownType;

export type SymbolKind = "variable" | "constant" | "parameter" | "procedure" | "function" | "type" | "field";

export type SymbolInfo = {
  name: string;
  normalizedName: string;
  kind: SymbolKind;
  type: Type;
  declaration: SourceRange;
  scopeId: string;
  mutable: boolean;
};

export type BoundReference = {
  name: string;
  normalizedName: string;
  range: SourceRange;
  symbol?: SymbolInfo;
};

export type BindResult = {
  symbols: SymbolInfo[];
  references: BoundReference[];
  diagnostics: Diagnostic[];
};

export type TypedExpression = {
  expression: Expression;
  type: Type;
};

export type CheckResult = {
  expressionTypes: TypedExpression[];
  diagnostics: Diagnostic[];
};
