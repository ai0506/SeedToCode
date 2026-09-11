import type { LanguageProfile } from "@caie-pseudocode/caie-spec";

export type TokenKind =
  | "keyword"
  | "identifier"
  | "type-name"
  | "integer"
  | "real"
  | "char"
  | "string"
  | "boolean"
  | "date"
  | "operator"
  | "punctuation"
  | "newline"
  | "comment"
  | "eof"
  | "invalid";

export type SourcePosition = {
  /** UTF-16 offset into normalizedSource, suitable for String.slice. */
  offset: number;
  /** One-based logical line. */
  line: number;
  /** One-based Unicode code-point column. */
  column: number;
};

export type SourceRange = { start: SourcePosition; end: SourcePosition };

export type Token = {
  kind: TokenKind;
  text: string;
  normalized?: string;
  range: SourceRange;
};

export type DiagnosticSeverity = "error" | "caie" | "hint";
export type DiagnosticOrigin = "CAIE" | "Editor Runtime";

export type TextEdit = {
  range: SourceRange;
  newText: string;
};

export type Diagnostic = {
  code: string;
  ruleId: string;
  severity: DiagnosticSeverity;
  origin: DiagnosticOrigin;
  messageKey: string;
  args?: Record<string, string | number>;
  range: SourceRange;
  related?: Array<{ messageKey: string; range: SourceRange }>;
  fix?: TextEdit;
};

export type TokenizeOptions = {
  profile?: LanguageProfile;
};

export type TokenizeResult = {
  normalizedSource: string;
  tokens: Token[];
  diagnostics: Diagnostic[];
};
