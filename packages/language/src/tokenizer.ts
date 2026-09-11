import { isKeyword, isTypeName } from "@caie-pseudocode/caie-spec";
import type {
  Diagnostic,
  SourcePosition,
  SourceRange,
  Token,
  TokenKind,
  TokenizeOptions,
  TokenizeResult
} from "./types.js";

const WORD_OPERATORS = new Set(["AND", "OR", "NOT", "DIV", "MOD"]);
const BOOLEAN_LITERALS = new Set(["TRUE", "FALSE"]);
const TWO_CHARACTER_OPERATORS = new Set([">=", "<=", "<>", "<-"]);
const ONE_CHARACTER_OPERATORS = new Set(["←", "+", "-", "*", "/", ">", "<", "=", "&", "^"]);
const PUNCTUATION = new Set(["(", ")", "[", "]", ",", ":", "."]);
// 这些符号常由中文输入法或文档复制带入。它们在合法的英文引号字符串内可以出现，
// 但不能担当伪代码的引号、分隔符或括号。
const CHINESE_PUNCTUATION = new Set([
  "，", "。", "；", "：", "！", "？", "（", "）", "【", "】", "［", "］", "｛", "｝", "、",
  "‘", "’", "“", "”", "《", "》", "〈", "〉"
]);

type MutablePosition = { offset: number; line: number; column: number };

function copyPosition(position: MutablePosition): SourcePosition {
  return { ...position };
}

function isAsciiDigit(character: string | undefined): boolean {
  return character !== undefined && /[0-9]/.test(character);
}

function isValidDate(text: string): boolean {
  const day = Number(text.slice(0, 2));
  const month = Number(text.slice(3, 5));
  const year = Number(text.slice(6, 10));
  if (month < 1 || month > 12 || day < 1) return false;
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return day <= daysInMonth;
}

function canStartSignedNumber(previous: Token | undefined): boolean {
  if (!previous || previous.kind === "newline") return true;
  if (previous.kind === "operator") return true;
  if (previous.kind === "punctuation") return previous.text !== ")" && previous.text !== "]";
  return previous.kind === "keyword" && ["TO", "STEP", "RETURN", "OUTPUT"].includes(previous.normalized ?? "");
}

export function tokenize(source: string, _options: TokenizeOptions = {}): TokenizeResult {
  const normalizedSource = source.replace(/\r\n?/g, "\n");
  const tokens: Token[] = [];
  const diagnostics: Diagnostic[] = [];
  const position: MutablePosition = { offset: 0, line: 1, column: 1 };

  const peek = (distance = 0): string | undefined => normalizedSource[position.offset + distance];

  const advance = (): string => {
    const codePoint = normalizedSource.codePointAt(position.offset);
    if (codePoint === undefined) return "";
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

  const addToken = (kind: TokenKind, start: SourcePosition, normalized?: string): Token => {
    const range = { start, end: copyPosition(position) };
    const token: Token = {
      kind,
      text: normalizedSource.slice(start.offset, position.offset),
      range,
      ...(normalized === undefined ? {} : { normalized })
    };
    tokens.push(token);
    return token;
  };

  const addDiagnostic = (
    code: string,
    ruleId: string,
    origin: Diagnostic["origin"],
    messageKey: string,
    range: SourceRange,
    args?: Diagnostic["args"]
  ): void => {
    diagnostics.push({
      code,
      ruleId,
      severity: "error",
      origin,
      messageKey,
      range,
      ...(args ? { args } : {})
    });
  };

  const scanNumber = (start: SourcePosition, signed: boolean): void => {
    if (signed) advance();
    while (isAsciiDigit(peek())) advance();

    if (peek() === ".") {
      advance();
      if (!isAsciiDigit(peek())) {
        const token = addToken("invalid", start);
        addDiagnostic("PC1002", "LIT-002", "CAIE", "literal.real.requiresDigitsAfterPoint", token.range);
        return;
      }
      while (isAsciiDigit(peek())) advance();
      addToken("real", start);
      return;
    }

    addToken("integer", start);
  };

  while (position.offset < normalizedSource.length) {
    const start = copyPosition(position);
    const character = peek();

    if (character === " " || character === "\t") {
      advance();
      continue;
    }

    if (character === "\n") {
      advance();
      addToken("newline", start);
      continue;
    }

    if (character === "/" && peek(1) === "/") {
      while (peek() !== undefined && peek() !== "\n") advance();
      addToken("comment", start);
      continue;
    }

    if (character === '"' || character === "'") {
      const quote = character;
      advance();
      while (peek() !== undefined && peek() !== "\n" && peek() !== quote) advance();
      if (peek() !== quote) {
        const token = addToken("invalid", start);
        addDiagnostic(
          quote === '"' ? "PC1003" : "PC1004",
          quote === '"' ? "LIT-004" : "LIT-003",
          "CAIE",
          quote === '"' ? "literal.string.unterminated" : "literal.char.unterminated",
          token.range
        );
        continue;
      }
      advance();
      const token = addToken(quote === '"' ? "string" : "char", start);
      if (quote === "'") {
        const value = token.text.slice(1, -1);
        if ([...value].length !== 1) {
          token.kind = "invalid";
          // 单引号里塞了一整个词，几乎一定是想写字符串——说「CHAR 必须恰好一个字符」
          // 只回答了「这里为什么不合法」，没回答「你想做的事该怎么写」。
          if ([...value].length > 1) {
            addDiagnostic("PC1005", "LIT-003", "CAIE", "literal.char.looksLikeString", token.range, { value });
          } else {
            addDiagnostic("PC1005", "LIT-003", "CAIE", "literal.char.requiresOneCodePoint", token.range);
          }
        }
      }
      continue;
    }

    const dateCandidate = normalizedSource.slice(position.offset).match(/^\d{2}\/\d{2}\/\d{4}(?![A-Za-z0-9_])/)?.[0];
    if (dateCandidate) {
      for (const _ of dateCandidate) advance();
      const token = addToken("date", start);
      if (!isValidDate(dateCandidate)) {
        addDiagnostic("PC1001", "LIT-006", "Editor Runtime", "literal.date.invalidCalendarDate", token.range, {
          value: dateCandidate
        });
      }
      continue;
    }

    const invalidLeadingDigitIdentifier = normalizedSource.slice(position.offset)
      .match(/^\d+[\p{L}_][\p{L}\p{N}_]*/u)?.[0];
    if (invalidLeadingDigitIdentifier) {
      for (const _ of invalidLeadingDigitIdentifier) advance();
      const token = addToken("invalid", start);
      addDiagnostic("PC1007", "ID-001", "CAIE", "identifier.invalidFormat", token.range, { value: token.text });
      continue;
    }

    const previous = tokens.at(-1);
    if (isAsciiDigit(character) || (character === "-" && isAsciiDigit(peek(1)) && canStartSignedNumber(previous))) {
      scanNumber(start, character === "-");
      continue;
    }

    if (character === "." && isAsciiDigit(peek(1))) {
      advance();
      while (isAsciiDigit(peek())) advance();
      const token = addToken("invalid", start);
      addDiagnostic("PC1002", "LIT-002", "CAIE", "literal.real.requiresDigitsBeforePoint", token.range);
      continue;
    }

    const identifierCandidate = normalizedSource.slice(position.offset).match(/^[\p{L}][\p{L}\p{N}_]*/u)?.[0];
    if (identifierCandidate) {
      for (const _ of identifierCandidate) advance();
      const text = identifierCandidate;
      if (!/^[A-Za-z][A-Za-z0-9_]*$/.test(text)) {
        const token = addToken("invalid", start);
        addDiagnostic("PC1007", "ID-001", "CAIE", "identifier.invalidFormat", token.range, { value: token.text });
        continue;
      }
      const normalized = text.toUpperCase();
      if (BOOLEAN_LITERALS.has(normalized)) addToken("boolean", start, normalized);
      else if (isTypeName(normalized)) addToken("type-name", start, normalized);
      else if (WORD_OPERATORS.has(normalized)) addToken("operator", start, normalized);
      else if (isKeyword(normalized)) addToken("keyword", start, normalized);
      else addToken("identifier", start, normalized);
      continue;
    }

    const pair = `${character ?? ""}${peek(1) ?? ""}`;
    if (TWO_CHARACTER_OPERATORS.has(pair)) {
      advance();
      advance();
      addToken("operator", start, pair === "<-" ? "←" : pair);
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
    addDiagnostic(
      "PC1006",
      "ID-001",
      "CAIE",
      CHINESE_PUNCTUATION.has(token.text) ? "token.chinesePunctuation" : "token.invalidCharacter",
      token.range,
      { value: token.text }
    );
  }

  const eofPosition = copyPosition(position);
  tokens.push({ kind: "eof", text: "", range: { start: eofPosition, end: eofPosition } });
  return { normalizedSource, tokens, diagnostics };
}
