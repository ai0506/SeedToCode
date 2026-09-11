import { describe, expect, it } from "vitest";
import { analyzeSource } from "../src/index.js";

/**
 * 指导提示的行为测试。见 teaching/08-GUIDANCE.md。
 * 每一条都成对写：**该报的要报，不该报的一条都不许冒出来**。
 */
function keysOf(source: string): string[] {
  return analyzeSource(source).diagnostics.map((diagnostic) => diagnostic.messageKey);
}

function first(source: string, messageKey: string) {
  return analyzeSource(source).diagnostics.find((diagnostic) => diagnostic.messageKey === messageKey);
}

describe("指导提示 — 从别的语言带过来的写法", () => {
  it("用 + 接字符串时直接指向 &", () => {
    expect(keysOf('DECLARE Name : STRING\nName ← "Ada"\nOUTPUT "Hi " + Name'))
      .toContain("type.arithmetic.stringPlus");
  });

  it("真正的加法不受影响", () => {
    expect(keysOf("DECLARE A : INTEGER\nDECLARE B : REAL\nA ← 1\nB ← 2.5\nOUTPUT A + B")).toEqual([]);
    expect(keysOf('DECLARE S : STRING\nS ← "a" & "b"\nOUTPUT S')).toEqual([]);
  });

  it("== 只报一条「比较只用一个 =」", () => {
    const keys = keysOf('DECLARE A : INTEGER\nA ← 1\nIF A == 1 THEN\n   OUTPUT "y"\nENDIF');
    expect(keys).toContain("parser.relation.doubleEquals");
    expect(keys).not.toContain("parser.expression.expected");
    expect(keys).not.toContain("parser.if.requiresThen");
  });

  it("单个 = 与 <= >= <> 都不误报", () => {
    for (const operator of ["=", "<=", ">=", "<>", "<", ">"]) {
      expect(keysOf(`DECLARE A : INTEGER\nA ← 1\nIF A ${operator} 1 THEN\n   OUTPUT "y"\nENDIF`),
        `操作符 ${operator}`).toEqual([]);
    }
  });

  it("INPUT 里写提示语时说清楚提示语该放哪儿", () => {
    const keys = keysOf('DECLARE Name : STRING\nINPUT "Enter name", Name');
    expect(keys).toContain("parser.input.promptNotAllowed");
    // 原来会连报「目标不可写」和「语句末尾多了逗号」，两条都不指向该怎么改
    expect(keys).not.toContain("parser.input.requiresWritableTarget");
    expect(keys).not.toContain("parser.statement.unexpectedTrailingToken");
  });

  it("正常的 INPUT 不受影响", () => {
    expect(keysOf('DECLARE Name : STRING\nOUTPUT "Enter name"\nINPUT Name')).toEqual([]);
  });

  it("单引号里写了一整个词时指向双引号", () => {
    const keys = keysOf("DECLARE Name : STRING\nName ← 'Ada'\nOUTPUT Name");
    expect(keys).toEqual(["literal.char.looksLikeString"]);
  });

  it("合法的 CHAR 与空单引号各自照旧", () => {
    expect(keysOf("DECLARE C : CHAR\nC ← 'A'\nOUTPUT C")).toEqual([]);
    expect(keysOf("DECLARE C : CHAR\nC ← ''\nOUTPUT C")).toContain("literal.char.requiresOneCodePoint");
  });
});

describe("指导提示 — 把类型说出来", () => {
  it("比较两边的类型都写进提示", () => {
    const diagnostic = first('DECLARE A : INTEGER\nDECLARE S : STRING\nA ← 1\nS ← "x"\nIF A = S THEN\n   OUTPUT "y"\nENDIF',
      "type.relation.incompatibleOperands");
    expect(diagnostic?.args).toMatchObject({ left: "INTEGER", right: "STRING" });
  });

  it("算术两边的类型都写进提示", () => {
    const diagnostic = first('DECLARE S : STRING\nS ← "x"\nOUTPUT S * 2', "type.arithmetic.requiresNumeric");
    expect(diagnostic?.args).toMatchObject({ left: "STRING", right: "INTEGER" });
  });

  it("条件不是布尔时说出它现在是什么", () => {
    const diagnostic = first('DECLARE A : INTEGER\nA ← 1\nIF A THEN\n   OUTPUT "y"\nENDIF',
      "type.condition.requiresBoolean");
    expect(diagnostic?.args).toMatchObject({ actual: "INTEGER" });
  });
});

describe("指导提示 — 缺结束符指回开头", () => {
  it("缺 ENDIF 报在 IF 那一行，不是文件末尾", () => {
    const diagnostic = first('DECLARE A : INTEGER\nA ← 1\nIF A = 1 THEN\n   OUTPUT "y"\nOUTPUT "done"',
      "parser.if.missingEndif");
    expect(diagnostic?.range.start.line).toBe(3);
    expect(diagnostic?.args).toMatchObject({ line: 3 });
  });

  it("嵌套时指向真正没闭合的那一个", () => {
    const source = [
      "DECLARE A : INTEGER",
      "A ← 1",
      "IF A = 1 THEN",
      "   IF A = 1 THEN",
      '      OUTPUT "inner"',
      "   ENDIF",
      'OUTPUT "done"'
    ].join("\n");
    expect(first(source, "parser.if.missingEndif")?.range.start.line).toBe(3);
  });

  it("缺 ENDWHILE 与缺 NEXT 同样指回开头", () => {
    expect(first('DECLARE A : INTEGER\nA ← 1\nWHILE A < 3\n   A ← A + 1\nOUTPUT "done"',
      "parser.while.missingEndwhile")?.range.start.line).toBe(3);
    expect(first("DECLARE I : INTEGER\nFOR I ← 1 TO 3\n   OUTPUT I", "parser.for.missingNext")
      ?.range.start.line).toBe(2);
  });
});

describe("指导提示 — 连锁噪音", () => {
  it("中文引号只报标点本身，不报它引发的解析错误", () => {
    expect(keysOf("OUTPUT “hello”")).toEqual(["token.chinesePunctuation", "token.chinesePunctuation"]);
  });

  it("中文括号同样只留原因", () => {
    expect(keysOf("DECLARE A : INTEGER\nA ← （1 + 2）"))
      .toEqual(["token.chinesePunctuation", "token.chinesePunctuation"]);
  });

  it("英文双引号里的中文标点是合法内容，一条都不报", () => {
    expect(keysOf('OUTPUT "你好，世界。"')).toEqual([]);
    expect(keysOf('DECLARE S : STRING\nS ← "（括号）"\nOUTPUT S')).toEqual([]);
  });
});

describe("指导提示 — 拼写建议不碰真名字", () => {
  it("内置函数名本身不会被当成错拼", () => {
    // UCASE 离 CASE 只差一个字母。这一段里 UCASE(MID(...)) 是真错（MID 给的是 STRING），
    // 但错在参数类型，不在拼写——不能顺手把 UCASE 说成 CASE 的错拼。
    const source = [
      "DECLARE S : STRING",
      "DECLARE I : INTEGER",
      'S ← "abc"',
      "FOR I ← 1 TO LENGTH(S)",
      "   OUTPUT UCASE(MID(S, I, 1))",
      "NEXT I"
    ].join("\n");
    expect(keysOf(source)).not.toContain("typo.keywordSuggestion");
    expect(keysOf(source)).toContain("type.call.argumentType");
  });

  it("真打错了还是照报", () => {
    expect(keysOf('DECLARE S : STRING\nS ← "abc"\nOUTPUT LENGHT(S)')).toContain("typo.keywordSuggestion");
    expect(keysOf('OUTPIT "hi"')).toContain("typo.keywordSuggestion");
  });
});

describe("指导提示 — 关键字不能作为标识符", () => {
  it("FOR 控制变量使用关键字时直接说明原因", () => {
    const diagnostics = analyzeSource("FOR CLASS ← 1 TO 3\n   OUTPUT CLASS\nNEXT CLASS").diagnostics;
    expect(diagnostics).toContainEqual(expect.objectContaining({
      code: "PC2108",
      ruleId: "ID-002",
      messageKey: "parser.bindingName.cannotBeKeyword",
      origin: "CAIE",
      args: { name: "CLASS" }
    }));
    expect(diagnostics).not.toContainEqual(expect.objectContaining({ messageKey: "parser.for.requiresControlVariable" }));
    expect(diagnostics.filter((diagnostic) => diagnostic.messageKey === "parser.bindingName.cannotBeKeyword")).toHaveLength(3);
  });

  it("声明名称仍然使用同一条提示，正常 FOR 不受影响", () => {
    expect(keysOf("DECLARE CLASS : INTEGER")).toEqual(["parser.bindingName.cannotBeKeyword"]);
    expect(keysOf("FOR I ← 1 TO 3\n   OUTPUT I\nNEXT I")).toEqual([]);
  });
});
