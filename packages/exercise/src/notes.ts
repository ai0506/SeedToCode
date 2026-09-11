import type { Program, Statement } from "@caie-pseudocode/language";

/**
 * 写法提醒。
 *
 * 有一类错误语法完全合法、引擎无话可说，但学生的意图和代码的行为差得很远。
 * 最典型的是把变量名写进引号：
 *
 *   OUTPUT "Name lives in City"
 *
 * 这段代码没有任何毛病，它就是要原样显示这十九个字符；可写的人想的是显示两个变量的值。
 * 判题只会说「输出对不上」，指不到点子上。
 *
 * 这里放的就是这类**针对具体误解的检查**：条件写死、只在判题失败时提示、宁可漏报不可误报。
 * 这是治标——真正治本要能读懂意图。但在能做到之前，一条一条补比什么都不说强得多。
 * 每加一条都必须来自真实撞到的情况，不能凭空想象学生会怎么错。
 */

export type CodeNote =
  | { kind: "variable-in-string"; names: string[]; line: number };

/**
 * 找出「前面没有提示语的 `INPUT`」。
 *
 * 每个 `INPUT` 之前都该先用一句 `OUTPUT` 说明要输入什么——Pseudocode Guide 没有规定这一条，
 * 但正式发布的伪代码范例一律这么写（见 teaching/02-CONTENT_SPEC.md 2.5.8）。
 *
 * 主要用途是**校验教学内容自己**：课文教学生写提示语，题目的期望输出却不含提示行，
 * 学生照做反而判错——这种自相矛盾必须在 CI 里挡住。
 */
export function findUnpromptedInputs(program: Program): number[] {
  const lines: number[] = [];
  const walk = (statements: Statement[]): void => {
    statements.forEach((statement, index) => {
      if (statement.kind === "InputStatement") {
        const previous = statements[index - 1];
        const prompted = !!previous && previous.kind === "OutputStatement";
        if (!prompted) lines.push(statement.range.start.line);
      }
      if ("body" in statement && Array.isArray(statement.body)) walk(statement.body as Statement[]);
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

/** 判断一个词是不是这段程序里声明过的名字（大小写不敏感，与语言本身一致）。 */
function declaredNames(program: Program): Map<string, string> {
  const names = new Map<string, string>();
  const walk = (statements: Statement[]): void => {
    for (const statement of statements) {
      if (statement.kind === "DeclareStatement" || statement.kind === "ConstantStatement") {
        // 引擎把标识符规范成大写，这里统一按小写做键，免得依赖它的具体写法
        names.set(statement.normalizedName.toLowerCase(), statement.name);
      }
      if ("body" in statement && Array.isArray(statement.body)) walk(statement.body as Statement[]);
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

/**
 * 收集「整条语句只有字符串字面量」的 OUTPUT。
 * 只看这一类：写 `OUTPUT "Hello, ", Name` 的人显然已经知道怎么显示变量，
 * 用不着提醒；把整句话塞进一对引号里的才是误解。
 */
type LiteralOutput = { text: string; line: number; followedByInput: boolean };

function collectLiteralOutputs(statements: Statement[], found: LiteralOutput[]): void {
  statements.forEach((statement, index) => {
    if (statement.kind === "OutputStatement") {
      const allLiteral = statement.values.length > 0 && statement.values.every(
        (value) => value.kind === "LiteralExpression" && value.literalType === "STRING"
      );
      if (allLiteral) {
        const next = statements[index + 1];
        found.push({
          text: statement.values.map((value) => String((value as { value: unknown }).value)).join(""),
          line: statement.range.start.line,
          // 紧跟着一句 INPUT 的，几乎一定是提示语；提示语里出现变量名是正常的
          followedByInput: !!next && next.kind === "InputStatement"
        });
      }
    }
    if ("body" in statement && Array.isArray(statement.body)) {
      collectLiteralOutputs(statement.body as Statement[], found);
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

/**
 * 找出「变量名被写进了引号里」。
 *
 * 宁可漏报不可误报——误报会让学生怀疑一段本来没问题的代码。三道闸门：
 *
 *   1. 整条 `OUTPUT` 里只有字符串，一个变量都没有；
 *   2. 后面没有紧跟 `INPUT`（那样多半是提示语，`OUTPUT "Enter the name"` 里出现 `name` 很正常）；
 *   3. 名字大小写完全一致，或者同一句话里命中了两个以上的名字。
 */
export function findCodeNotes(program: Program): CodeNote[] {
  const declared = declaredNames(program);
  if (declared.size === 0) return [];

  const outputs: LiteralOutput[] = [];
  collectLiteralOutputs(program.body, outputs);

  const notes: CodeNote[] = [];
  for (const output of outputs) {
    if (output.followedByInput) continue;

    const exact: string[] = [];
    const loose: string[] = [];
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

    const hits = [...new Set([...exact, ...loose])];
    if (exact.length === 0 && hits.length < 2) continue;
    notes.push({ kind: "variable-in-string", names: hits, line: output.line });
  }
  return notes;
}
