import { describe, expect, it } from "vitest";
import { parseExpression, tokenize, type Expression } from "../src/index.js";

function parse(source: string): Expression {
  const tokenized = tokenize(source);
  expect(tokenized.diagnostics).toEqual([]);
  const parsed = parseExpression(tokenized.tokens);
  expect(parsed.diagnostics).toEqual([]);
  return parsed.expression;
}

function compact(expression: Expression): unknown {
  switch (expression.kind) {
    case "LiteralExpression": return [expression.literalType, expression.value];
    case "NameExpression": return ["NAME", expression.normalizedName];
    case "UnaryExpression": return [expression.postfix ? "POSTFIX" : "UNARY", expression.operator, compact(expression.operand)];
    case "BinaryExpression": return [expression.operator, compact(expression.left), compact(expression.right)];
    case "CallExpression": return ["CALL", compact(expression.callee), expression.arguments.map(compact)];
    case "IndexExpression": return ["INDEX", compact(expression.target), expression.indices.map(compact)];
    case "MemberExpression": return ["MEMBER", compact(expression.target), expression.normalizedMember];
    case "ErrorExpression": return ["ERROR", expression.reason];
  }
}

describe("expression precedence", () => {
  it("creates typed AST values for every core literal", () => {
    expect(compact(parse("-3"))).toEqual(["INTEGER", -3]);
    expect(compact(parse("4.7"))).toEqual(["REAL", 4.7]);
    expect(compact(parse("'C'"))).toEqual(["CHAR", "C"]);
    expect(compact(parse('"text"'))).toEqual(["STRING", "text"]);
    expect(compact(parse("FALSE"))).toEqual(["BOOLEAN", false]);
    expect(compact(parse("02/01/2028"))).toEqual(["DATE", { day: 2, month: 1, year: 2028 }]);
  });

  it("implements EXPR-001 arithmetic precedence", () => {
    expect(compact(parse("2 + 3 * 4"))).toEqual([
      "+",
      ["INTEGER", 2],
      ["*", ["INTEGER", 3], ["INTEGER", 4]]
    ]);
    expect(compact(parse("17 DIV 5 MOD 3"))).toEqual([
      "MOD",
      ["DIV", ["INTEGER", 17], ["INTEGER", 5]],
      ["INTEGER", 3]
    ]);
    expect(compact(parse("5 / 2"))).toEqual(["/", ["INTEGER", 5], ["INTEGER", 2]]);
  });

  it("implements EXPR-002 left-associative string concatenation", () => {
    expect(compact(parse('"Summer" & " " & "Pudding"'))).toEqual([
      "&",
      ["&", ["STRING", "Summer"], ["STRING", " "]],
      ["STRING", "Pudding"]
    ]);
  });

  it("orders unary, arithmetic, concatenation, relation and logic operators", () => {
    expect(compact(parse("NOT A OR B AND C = D + E * -2 & F"))).toEqual([
      "OR",
      ["UNARY", "NOT", ["NAME", "A"]],
      [
        "AND",
        ["NAME", "B"],
        [
          "=",
          ["NAME", "C"],
          ["&", ["+", ["NAME", "D"], ["*", ["NAME", "E"], ["INTEGER", -2]]], ["NAME", "F"]]
        ]
      ]
    ]);
  });

  it("lets parentheses override precedence and retains their source range", () => {
    const expression = parse("(2 + 3) * 4");
    expect(compact(expression)).toEqual([
      "*",
      ["+", ["INTEGER", 2], ["INTEGER", 3]],
      ["INTEGER", 4]
    ]);
    if (expression.kind !== "BinaryExpression") throw new Error("expected binary expression");
    expect(expression.left.parentheses).toMatchObject([
      { start: { line: 1, column: 1 }, end: { line: 1, column: 8 } }
    ]);
  });

  it("accepts aligned continuations after operators and delimiters", () => {
    expect(compact(parse("Find(\n   Board[Row,\n         Column],\n   1 +\n      2\n)"))).toEqual([
      "CALL",
      ["NAME", "FIND"],
      [
        ["INDEX", ["NAME", "BOARD"], [["NAME", "ROW"], ["NAME", "COLUMN"]]],
        ["+", ["INTEGER", 1], ["INTEGER", 2]]
      ]
    ]);
  });
});

describe("postfix expressions", () => {
  it("parses calls, multidimensional indices and member access", () => {
    expect(compact(parse("Find(Board[Row, Column].Value, 2)"))).toEqual([
      "CALL",
      ["NAME", "FIND"],
      [
        [
          "MEMBER",
          ["INDEX", ["NAME", "BOARD"], [["NAME", "ROW"], ["NAME", "COLUMN"]]],
          "VALUE"
        ],
        ["INTEGER", 2]
      ]
    ]);
  });

  it("parses prefix and postfix pointer operators without enabling runtime semantics", () => {
    expect(compact(parse("^Pointer^"))).toEqual([
      "UNARY",
      "^",
      ["POSTFIX", "^", ["NAME", "POINTER"]]
    ]);
  });
});

describe("expression diagnostics and recovery", () => {
  it("rejects chained relation operators with one primary diagnostic", () => {
    const parsed = parseExpression(tokenize("A < B < C").tokens);
    expect(parsed.expression.kind).toBe("ErrorExpression");
    expect(parsed.diagnostics).toMatchObject([
      { code: "PC2002", ruleId: "OP-003", severity: "error", origin: "Editor Runtime" }
    ]);
  });

  it("reports a missing operand and remains bounded", () => {
    const parsed = parseExpression(tokenize("A +").tokens);
    expect(parsed.diagnostics).toHaveLength(1);
    expect(parsed.diagnostics[0]).toMatchObject({ code: "PC2001", ruleId: "OP-001" });
  });

  it("reports missing delimiters while retaining a usable partial AST", () => {
    const parsed = parseExpression(tokenize("Items[1 + 2").tokens);
    expect(parsed.expression.kind).toBe("IndexExpression");
    expect(parsed.diagnostics).toMatchObject([{ code: "PC2004", ruleId: "ARRAY-004" }]);
  });
});
