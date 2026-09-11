import { describe, expect, it } from "vitest";
import { BASIC_STATEMENT_CASES } from "@caie-pseudocode/test-cases";
import { analyzeSource, parseSource } from "../src/index.js";

const corpus = Object.fromEntries(BASIC_STATEMENT_CASES.map((testCase) => [testCase.id, testCase]));

describe("basic program statements", () => {
  it("parses DECL-001 into declarations, assignments and output", () => {
    const result = parseSource(corpus["DECL-001"].source);
    expect(result.diagnostics).toEqual([]);
    expect(result.program.body.map(({ kind }) => kind)).toEqual([
      "DeclareStatement", "AssignmentStatement", "AssignmentStatement", "OutputStatement"
    ]);
    expect(result.program.body[0]).toMatchObject({
      kind: "DeclareStatement",
      name: "Count",
      normalizedName: "COUNT",
      typeReference: { kind: "PrimitiveTypeReference", name: "INTEGER" }
    });
  });

  it("accepts CONST-001 DATE as a literal", () => {
    const result = parseSource(corpus["CONST-001"].source);
    expect(result.diagnostics).toEqual([]);
    expect(result.program.body[0]).toMatchObject({
      kind: "ConstantStatement",
      value: { kind: "LiteralExpression", literalType: "DATE", value: { day: 2, month: 1, year: 2028 } }
    });
  });

  it("rejects CONST-002 expressions as constant values", () => {
    const result = parseSource(corpus["CONST-002"].source);
    expect(result.program.body).toHaveLength(2);
    expect(result.diagnostics).toMatchObject([
      { code: "PC2105", ruleId: "CONST-002", severity: "error", origin: "CAIE", range: { start: { line: 2 } } }
    ]);
  });

  it("turns ASSIGN-001 equals into a precise fixable diagnostic", () => {
    const result = parseSource(corpus["ASSIGN-001"].source);
    expect(result.program.body[1]).toMatchObject({ kind: "AssignmentStatement", sourceOperator: "=" });
    expect(result.diagnostics).toMatchObject([
      {
        code: "PC2102",
        ruleId: "ASSIGN-001",
        severity: "error",
        origin: "CAIE",
        range: { start: { line: 2, column: 7 }, end: { line: 2, column: 8 } },
        fix: { newText: "←" }
      }
    ]);
  });

  it("accepts the ASCII arrow as a non-blocking fixable CAIE diagnostic", () => {
    const result = parseSource("Score <- 50");
    expect(result.program.body[0]).toMatchObject({ kind: "AssignmentStatement", sourceOperator: "<-" });
    expect(result.diagnostics).toMatchObject([
      { code: "PC2103", ruleId: "ASSIGN-001", severity: "caie", origin: "CAIE", fix: { newText: "←" } }
    ]);
  });

  it("parses INPUT lvalues and comma-separated OUTPUT expressions", () => {
    const result = parseSource(`INPUT Board[Row, Column].Value
OUTPUT "Position", Row + 1, Board[Row, Column].Value`);
    expect(result.diagnostics).toEqual([]);
    expect(result.program.body).toMatchObject([
      { kind: "InputStatement", target: { kind: "MemberExpression" } },
      { kind: "OutputStatement", values: [{ kind: "LiteralExpression" }, { kind: "BinaryExpression" }, { kind: "MemberExpression" }] }
    ]);
  });

  it("parses primitive, named, one-dimensional and two-dimensional type references", () => {
    const result = parseSource(`DECLARE Flag : BOOLEAN
DECLARE Pupil : StudentRecord
DECLARE Names : ARRAY[1:30] OF STRING
DECLARE Board : ARRAY[1:3,1:3] OF CHAR`);
    expect(result.diagnostics).toEqual([]);
    expect(result.program.body.map((statement) => statement.kind === "DeclareStatement" ? statement.typeReference.kind : "")).toEqual([
      "PrimitiveTypeReference", "NamedTypeReference", "ArrayTypeReference", "ArrayTypeReference"
    ]);
    expect(result.program.body[3]).toMatchObject({
      kind: "DeclareStatement",
      typeReference: { kind: "ArrayTypeReference", dimensions: [{}, {}], elementType: { name: "CHAR" } }
    });
  });

  it("rejects array bounds written before the type keyword", () => {
    const result = parseSource("DECLARE names[1:5]: ARRAY OF STRING");
    expect(result.diagnostics[0]).toMatchObject({
      code: "PC2101", ruleId: "DECL-001", messageKey: "parser.declare.requiresColon"
    });
    expect(result.diagnostics).toHaveLength(3);
  });
});

describe("program recovery and source fidelity", () => {
  it("reports each invalid binding name once without a parser error storm", () => {
    const result = parseSource(`DECLARE 2Players : INTEGER
DECLARE Player-Count : INTEGER
DECLARE Élève : STRING
DECLARE WHILE : INTEGER`);
    expect(result.diagnostics).toHaveLength(4);
    expect(result.diagnostics.map(({ ruleId }) => ruleId)).toEqual(["ID-001", "ID-001", "ID-001", "ID-002"]);
    expect(result.diagnostics.map(({ range }) => range.start.line)).toEqual([1, 2, 3, 4]);
    expect(result.program.body.every(({ kind }) => kind === "ErrorStatement")).toBe(true);
  });

  it("recovers at the next line after a malformed statement", () => {
    const result = parseSource(`DECLARE Broken INTEGER extra
OUTPUT 1`);
    expect(result.diagnostics.length).toBeGreaterThan(0);
    expect(result.program.body).toHaveLength(2);
    expect(result.program.body[1]).toMatchObject({ kind: "OutputStatement", range: { start: { line: 2 } } });
  });

  it("retains comment tokens without parsing their contents", () => {
    const result = parseSource(`// DECLARE Fake : INTEGER
OUTPUT "ok" // IF ELSE`);
    expect(result.diagnostics).toEqual([]);
    expect(result.program.body).toHaveLength(1);
    expect(result.program.comments.map(({ text }) => text)).toEqual(["// DECLARE Fake : INTEGER", "// IF ELSE"]);
  });

  it("combines lexical diagnostics with a recovered program", () => {
    const result = parseSource(`CONSTANT BadDate = 31/02/2028
OUTPUT "still parsed"`);
    expect(result.diagnostics).toMatchObject([{ code: "PC1001", ruleId: "LIT-006" }]);
    expect(result.program.body.map(({ kind }) => kind)).toEqual(["ConstantStatement", "OutputStatement"]);
  });
});

describe("OUTPUT 缺少逗号", () => {
  it("把裸写的文字识别为「缺少逗号 / 缺少引号」，而不是笼统的语句末尾意外内容", () => {
    const { diagnostics } = parseSource("DECLARE Name : STRING\nOUTPUT Name lives here");
    const hit = diagnostics.find((diagnostic) => diagnostic.messageKey === "parser.output.requiresComma");
    expect(hit).toBeDefined();
    expect(hit?.ruleId).toBe("IO-002");
    expect(hit?.severity).toBe("error");
    expect(hit?.args).toMatchObject({ token: "lives" });
  });

  it("后面跟的是块结束符时，仍然走通用的语句末尾诊断", () => {
    const { diagnostics } = parseSource('OUTPUT "x" ENDIF');
    expect(diagnostics.some((d) => d.messageKey === "parser.statement.unexpectedTrailingToken")).toBe(true);
    expect(diagnostics.some((d) => d.messageKey === "parser.output.requiresComma")).toBe(false);
  });
});

describe("拼写建议的覆盖与边界", () => {
  const suggestionsFor = (source: string) =>
    analyzeSource(source).diagnostics
      .filter((diagnostic) => diagnostic.ruleId === "TYPO-001")
      .map((diagnostic) => `${diagnostic.args?.actual}→${diagnostic.args?.suggested}`);

  it("认出相邻字母调换：STRIGN、LENGHT、UCSAE", () => {
    expect(suggestionsFor("DECLARE A : STRIGN")).toEqual(["STRIGN→STRING"]);
    expect(suggestionsFor('DECLARE A : INTEGER\nA ← LENGHT("x")')).toEqual(["LENGHT→LENGTH"]);
    expect(suggestionsFor("DECLARE C : CHAR\nC ← UCSAE('a')")).toEqual(["UCSAE→UCASE"]);
  });

  it("给出建议之后，同一个词上的其它错误不再重复报", () => {
    const codes = analyzeSource("DECLARE A : STRIGN").diagnostics.map(({ ruleId }) => ruleId);
    // 「找不到自定义类型 STRIGN」是这条建议的连锁反应，留着只是噪音
    expect(codes).toEqual(["TYPO-001"]);
  });

  it("用户自己声明过的名字永远不算拼写错误", () => {
    // Mix 离 MID 只差一个字母、Whole 离 WHILE 也只差一个，但它们都是合法的自定义名称
    const source = [
      "PROCEDURE Mix(BYVAL A : INTEGER, BYREF B : REAL)",
      "ENDPROCEDURE",
      "DECLARE Whole : INTEGER",
      'CALL Mix("wrong", Whole, 3)'
    ].join("\n");
    expect(suggestionsFor(source)).toEqual([]);
  });

  it("候选不止一个时靠「换回去试一遍」消歧：inpt 既像 INPUT 又像 INT", () => {
    expect(suggestionsFor("DECLARE A : STRING\ninpt A")).toEqual(["inpt→INPUT"]);
  });

  it("真实打字错误应当积极命中——故意这样命名的人远比打错的人少", () => {
    const cases: Array<[string, string]> = [
      ['outpit "x"', "outpit→OUTPUT"],
      ['oatput "x"', "oatput→OUTPUT"],
      ['ouput "x"', "ouput→OUTPUT"],
      ["declaer A : STRING", "declaer→DECLARE"],
      ["dcelare A : STRING", "dcelare→DECLARE"],
      ["DECLARE A : sting", "sting→STRING"]
    ];
    for (const [source, expected] of cases) {
      expect(suggestionsFor(source), source).toEqual([expected]);
    }
  });

  it("内置函数名只在真的在调用时才作为候选", () => {
    // LENGHT("x") 后面跟着左括号，确实是在调用
    expect(suggestionsFor('DECLARE A : INTEGER\nA ← LENGHT("x")')).toEqual(["LENGHT→LENGTH"]);
    // Int2 只是个没声明的变量名，不该被建议改成内置函数 INT。
    // 它一度能通过「替换后错误变少」的闸门，因为引擎接受裸写的内置函数名。
    expect(suggestionsFor("DECLARE Total : INTEGER\nTotal ← 1\nOUTPUT Int2")).toEqual([]);
  });

  it("换回去不成立的候选一律不给建议", () => {
    // 学生想写的是自己声明的 Data，不是类型名 DATE
    expect(suggestionsFor('DECLARE Data : STRING\nData ← "x"\nOUTPUT Dat')).toEqual([]);
    // Chr 换成 CHAR 之后 `OUTPUT CHAR` 依然不成立
    expect(suggestionsFor("DECLARE C : CHAR\nC ← 'a'\nOUTPUT Chr")).toEqual([]);
  });

  it("完全正确的程序不会得到任何建议", () => {
    expect(suggestionsFor('DECLARE Name : STRING\nOUTPUT "Enter"\nINPUT Name\nOUTPUT "Hi, ", Name')).toEqual([]);
  });
});
