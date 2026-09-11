export type LanguageProfile = "core-2027" | "advanced-2027" | "exam-extension";

export type RuleStrength =
  | "REQUIRED"
  | "RECOMMENDED"
  | "EXAM-PRESENTATION"
  | "SYLLABUS-SCOPE"
  | "EDITOR-RUNTIME";

export const KEYWORDS = [
  "DECLARE", "CONSTANT", "TYPE", "ENDTYPE", "DEFINE", "SET", "OF", "ARRAY",
  "INPUT", "OUTPUT", "IF", "THEN", "ELSE", "ENDIF", "CASE", "OTHERWISE",
  "ENDCASE", "FOR", "TO", "STEP", "NEXT", "REPEAT", "UNTIL", "WHILE",
  "ENDWHILE", "PROCEDURE", "ENDPROCEDURE", "FUNCTION", "ENDFUNCTION", "RETURN",
  "RETURNS", "CALL", "BYREF", "BYVAL", "OPENFILE", "READFILE", "WRITEFILE",
  "CLOSEFILE", "EOF", "READ", "WRITE", "APPEND", "RANDOM", "SEEK", "GETRECORD",
  "PUTRECORD", "CLASS", "ENDCLASS", "INHERITS", "NEW", "SUPER", "PUBLIC",
  "PRIVATE", "AND", "OR", "NOT", "DIV", "MOD", "TRUE", "FALSE"
] as const;

export const TYPE_NAMES = ["INTEGER", "REAL", "CHAR", "STRING", "BOOLEAN", "DATE"] as const;

export type BuiltinSignature = {
  readonly name: string;
  readonly parameters: readonly string[];
  readonly returns: string;
};

export const BUILTINS: readonly BuiltinSignature[] = [
  { name: "LENGTH", parameters: ["STRING"], returns: "INTEGER" },
  { name: "RIGHT", parameters: ["STRING", "INTEGER"], returns: "STRING" },
  { name: "MID", parameters: ["STRING", "INTEGER", "INTEGER"], returns: "STRING" },
  { name: "LCASE", parameters: ["CHAR"], returns: "CHAR" },
  { name: "UCASE", parameters: ["CHAR"], returns: "CHAR" },
  { name: "INT", parameters: ["REAL"], returns: "INTEGER" },
  { name: "RAND", parameters: ["INTEGER"], returns: "REAL" }
] as const;

const RULE_IDS_BY_STRENGTH = {
  "EXAM-PRESENTATION": ["FMT-001", "FMT-003", "BUILTIN-002"],
  "RECOMMENDED": [
    "FMT-002", "FMT-005", "FMT-007", "LIT-006", "DECL-001", "CONST-003",
    "ARRAY-003", "OP-006", "FOR-003", "FILE-004"
  ],
  "EDITOR-RUNTIME": ["DECL-002", "FILE-006", "TYPO-001"],
  "SYLLABUS-SCOPE": [],
  "REQUIRED": [
    "FMT-004", "FMT-006", "TYPE-001", "LIT-001", "LIT-002", "LIT-003", "LIT-004",
    "LIT-005", "ID-001", "ID-002", "ID-003", "CONST-001", "CONST-002", "ASSIGN-001",
    "ASSIGN-002", "ASSIGN-003", "ARRAY-001", "ARRAY-002", "ARRAY-004", "ARRAY-005",
    "UDT-001", "UDT-002", "UDT-003", "UDT-004", "UDT-005", "IO-001", "IO-002",
    "OP-001", "OP-002", "OP-003", "OP-004", "OP-005", "BUILTIN-001", "IF-001",
    "CASE-001", "CASE-002", "FOR-001", "FOR-002", "REPEAT-001", "WHILE-001",
    "PROC-001", "PROC-002", "FUNC-001", "FUNC-002", "PARAM-001", "PARAM-002",
    "PARAM-003", "FILE-001", "FILE-002", "FILE-003", "FILE-005", "OOP-001",
    "OOP-002", "OOP-003", "OOP-004"
  ]
} as const satisfies Record<RuleStrength, readonly string[]>;

export const RULE_STRENGTH = Object.freeze(
  Object.fromEntries(
    Object.entries(RULE_IDS_BY_STRENGTH).flatMap(([strength, ids]) =>
      ids.map((id) => [id, strength])
    )
  )
) as Readonly<Record<string, RuleStrength>>;

export const RULE_IDS = Object.freeze(Object.keys(RULE_STRENGTH));

const keywordSet = new Set<string>(KEYWORDS);
const typeNameSet = new Set<string>(TYPE_NAMES);
const builtinSet = new Set(BUILTINS.map(({ name }) => name));

export function isKeyword(value: string): boolean {
  return keywordSet.has(value.toUpperCase());
}

export function isTypeName(value: string): boolean {
  return typeNameSet.has(value.toUpperCase());
}

export function isBuiltin(value: string): boolean {
  return builtinSet.has(value.toUpperCase());
}
