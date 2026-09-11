# CAIE 9618 编辑器语言规范

当前项目状态统一以 [`PROJECT_STATE.md`](PROJECT_STATE.md) 为准。本规范只定义语言契约；文中的实施顺序和实施状态用于说明规范上下文，不是当前状态的权威来源。

版本：0.1  
状态：阶段 4 已实现  
依赖：`CAIE_RULES.md`、`runtime-conventions.md`

## 1. 目标

本文定义 tokenizer、parser、AST、名称绑定、类型检查、格式化和解释执行之间的共同契约。它不是另一份 CAIE 指南；CAIE 规则引用 `CAIE_RULES.md`，未由 Cambridge 定义的语义引用 `runtime-conventions.md`。

实现应允许添加新的语言 profile，而不复制解析器：

- `core-2027`：Paper 2 所需的核心伪代码。
- `advanced-2027`：在 core 基础上增加枚举、指针、集合、随机文件和 OOP。
- `exam-extension`：题目明确给出的额外函数或约定，只对当前文档生效。

默认 profile 为 `core-2027`。

## 2. 源代码模型

- 编码：UTF-8。
- 逻辑换行：统一为 `\n`。
- 列号：从 1 开始，按 Unicode code point 计数。
- 标识符：ASCII 字母开头，后续为 ASCII 字母、数字或 `_`。
- 关键字与标识符比较不区分大小写；token 保留原始文本。
- 空白不参与语法，但换行和行首缩进必须保留，以支持诊断和格式化。
- `//` 之外没有多行注释语法。
- 每个 token、AST 节点和诊断都保存半开区间源码范围 `[start, end)`，同时保存起止行列。

## 3. Token

```ts
type TokenKind =
  | "keyword" | "identifier" | "type-name"
  | "integer" | "real" | "char" | "string" | "boolean" | "date"
  | "operator" | "punctuation"
  | "newline" | "comment" | "eof" | "invalid";

type SourcePosition = { offset: number; line: number; column: number };
type SourceRange = { start: SourcePosition; end: SourcePosition };

type Token = {
  kind: TokenKind;
  text: string;
  normalized?: string;
  range: SourceRange;
};
```

Tokenizer 必须使用最长匹配，尤其保证 `>=`、`<=`、`<>`、`<-` 不被拆分。`<-` 识别为兼容输入 token，后续产生 `ASSIGN-001` 可修复诊断；规范赋值 token 为 `←`。

## 4. 词法规则

以下 EBNF 是实现基线，不用于替换 Guide 中的示例：

```ebnf
letter       = "A" ... "Z" | "a" ... "z" ;
digit        = "0" ... "9" ;
identifier   = letter, { letter | digit | "_" } ;

integer      = [ "-" ], digit, { digit } ;
real         = [ "-" ], digit, { digit }, ".", digit, { digit } ;
boolean      = "TRUE" | "FALSE" ;
date         = digit, digit, "/", digit, digit, "/",
               digit, digit, digit, digit ;
char         = "'", one-character, "'" ;
string       = '"', { non-quote-character }, '"' ;
comment      = "//", { non-newline-character } ;

assign-op    = "←" | "<-" ;
arith-op     = "+" | "-" | "*" | "/" | "DIV" | "MOD" ;
relation-op  = ">" | "<" | ">=" | "<=" | "=" | "<>" ;
logic-op     = "AND" | "OR" | "NOT" ;
concat-op    = "&" ;
```

DATE 必须在表达式上下文中先于 `/` 运算符尝试匹配，并通过真实日历校验。未闭合字符串、未闭合字符和非法字符各产生独立词法诊断，tokenizer 继续到下一行。

## 5. 语法概览

```ebnf
program          = { newline | declaration | statement | routine-decl | type-decl | class-decl } ;

declaration      = variable-decl | constant-decl ;
variable-decl    = "DECLARE", identifier, ":", type-ref, newline ;
constant-decl    = "CONSTANT", identifier, "=", literal, newline ;

statement        = assignment | input-stmt | output-stmt | if-stmt | case-stmt
                 | for-stmt | repeat-stmt | while-stmt | call-stmt | return-stmt
                 | openfile-stmt | readfile-stmt | writefile-stmt | closefile-stmt
                 | seek-stmt | getrecord-stmt | putrecord-stmt ;

assignment       = lvalue, "←", expression, newline ;
lvalue           = identifier, { "[", expression, { ",", expression }, "]"
                                  | ".", identifier
                                  | "^" } ;

input-stmt       = "INPUT", lvalue, newline ;
output-stmt      = "OUTPUT", expression, { ",", expression }, newline ;

openfile-stmt    = "OPENFILE", expression, "FOR", ( "READ" | "WRITE" | "APPEND" ), newline ;
readfile-stmt    = "READFILE", expression, ",", lvalue, newline ;
writefile-stmt   = "WRITEFILE", expression, ",", expression, newline ;
closefile-stmt   = "CLOSEFILE", expression, newline ;

if-stmt          = "IF", expression, "THEN", newline,
                   block, [ "ELSE", newline, block ], "ENDIF", newline ;

case-stmt        = "CASE", "OF", identifier, newline,
                   { case-clause }, [ otherwise-clause ], "ENDCASE", newline ;
case-clause      = case-label, { ",", case-label }, ":", block-or-inline ;
case-label       = literal | identifier | literal, "TO", literal ;
otherwise-clause = "OTHERWISE", ":", block-or-inline ;

for-stmt         = "FOR", identifier, "←", expression, "TO", expression,
                   [ "STEP", expression ], newline,
                   block, "NEXT", [ identifier ], newline ;
repeat-stmt      = "REPEAT", newline, block, "UNTIL", expression, newline ;
while-stmt       = "WHILE", expression, newline, block, "ENDWHILE", newline ;

routine-decl     = procedure-decl | function-decl ;
procedure-decl   = [ access ], "PROCEDURE", identifier, parameter-list, newline,
                   block, "ENDPROCEDURE", newline ;
function-decl    = [ access ], "FUNCTION", identifier, parameter-list,
                   "RETURNS", type-ref, newline,
                   block, "ENDFUNCTION", newline ;
parameter-list   = "(", [ parameter, { ",", parameter } ], ")" ;
parameter        = [ "BYVAL" | "BYREF" ], identifier, ":", type-ref ;
call-stmt        = "CALL", identifier, argument-list, newline ;
return-stmt      = "RETURN", expression, newline ;

type-ref         = primitive-type | identifier | array-type ;
array-type       = "ARRAY", "[", range, { ",", range }, "]", "OF", type-ref ;
range            = expression, ":", expression ;
```

`block-or-inline` 同时允许 Guide 中 CASE 示例的单行分支和多行分支。格式化器默认保留单行简单语句；复杂分支可展开，但不得改变语义。

## 6. 用户自定义类型和 OOP 语法

Advanced profile 增加：

```ebnf
type-decl        = enum-decl | pointer-decl | record-decl | set-decl ;
enum-decl        = "TYPE", identifier, "=", "(", identifier,
                   { ",", identifier }, ")", newline ;
pointer-decl     = "TYPE", identifier, "=", "^", type-ref, newline ;
record-decl      = "TYPE", identifier, newline,
                   { variable-decl }, "ENDTYPE", newline ;
set-decl         = "TYPE", identifier, "=", "SET", "OF", type-ref, newline ;
set-value-decl   = "DEFINE", identifier, "(", expression,
                   { ",", expression }, ")", ":", identifier, newline ;

class-decl       = "CLASS", identifier, [ "INHERITS", identifier ], newline,
                   { member-decl }, "ENDCLASS", newline ;
member-decl      = [ access ], ( variable-decl | procedure-decl | function-decl ) ;
access           = "PUBLIC" | "PRIVATE" ;
new-expression   = "NEW", identifier, argument-list ;
method-call      = expression, ".", identifier, argument-list ;
super-call       = "SUPER", ".", identifier, argument-list ;
```

在 Advanced profile 未启用时，这些结构应解析成“当前 profile 不支持”的单一明确诊断，而不是产生大量级联语法错误。

## 7. 表达式语法

解析器使用 Pratt parser 或等价的显式优先级实现：

```ebnf
expression       = or-expression ;
or-expression    = and-expression, { "OR", and-expression } ;
and-expression   = relation-expression, { "AND", relation-expression } ;
relation-expression = concat-expression, [ relation-op, concat-expression ] ;
concat-expression = additive-expression, { "&", additive-expression } ;
additive-expression = multiply-expression, { ( "+" | "-" ), multiply-expression } ;
multiply-expression = unary-expression,
                      { ( "*" | "/" | "DIV" | "MOD" ), unary-expression } ;
unary-expression = [ "-" | "NOT" | "^" ], postfix-expression ;
postfix-expression = primary-expression,
                     { argument-list | "[", expression, { ",", expression }, "]"
                       | ".", identifier | "^" } ;
primary-expression = literal | identifier | "(", expression, ")" | new-expression ;
argument-list    = "(", [ expression, { ",", expression } ], ")" ;
```

关系表达式只允许一个关系运算符，防止把 `A < B < C` 解释成布尔值再与 C 比较。

## 8. AST 契约

```ts
type NodeBase = { kind: string; range: SourceRange };

type Program = NodeBase & {
  kind: "Program";
  body: TopLevelNode[];
};

type Statement =
  | DeclareStatement | ConstantStatement | AssignmentStatement
  | InputStatement | OutputStatement
  | IfStatement | CaseStatement
  | ForStatement | RepeatStatement | WhileStatement
  | CallStatement | ReturnStatement
  | FileStatement;

type Expression =
  | LiteralExpression | NameExpression | UnaryExpression | BinaryExpression
  | CallExpression | IndexExpression | MemberExpression | NewExpression;
```

要求：

- AST 不保存 UI 文案。
- 语法糖 `<-` 在 AST 中规范化为统一的赋值节点，同时保留原 token 供自动修复。
- 括号不改变 AST 运算节点，但保存必要的格式信息，确保格式化不会改变含义。
- 出错位置使用 `ErrorNode` 占位，使解析器可以继续检查后续语句。
- 注释通过 trivia 或独立 comment map 关联到相邻节点，格式化时不得丢失。

## 9. 符号与类型检查

```ts
type SymbolKind =
  | "variable" | "constant" | "parameter" | "type"
  | "procedure" | "function" | "field" | "class" | "enum-value";

type SymbolInfo = {
  name: string;
  normalizedName: string;
  kind: SymbolKind;
  type: Type;
  declaration: SourceRange;
  scopeId: string;
  mutable: boolean;
};
```

检查顺序：

1. 收集顶层类型、过程、函数和类名称。
2. 建立全局变量与常量。
3. 为每个过程或函数建立形参和局部作用域。
4. 绑定名称引用，记录声明跳转关系。
5. 推断表达式类型并检查赋值、参数、返回值和条件。
6. 检查控制流：函数所有可达路径是否返回、RETURN 所在上下文等。

必须避免当前逐行正则方案的问题：形参、循环变量、记录字段、数组元素和不同作用域的同名变量不能被简单放入一个全局 Set。

## 10. 诊断契约

```ts
type Diagnostic = {
  code: string;
  ruleId: string;
  severity: "error" | "caie" | "hint";
  origin: "CAIE" | "Editor Runtime";
  messageKey: string;
  args?: Record<string, string | number>;
  range: SourceRange;
  related?: Array<{ messageKey: string; range: SourceRange }>;
  fix?: TextEdit;
};
```

约束：

- `messageKey` 与本地化文案分离。
- `code` 稳定且唯一，例如 `PC1001`；`ruleId` 指向规则基线，例如 `FMT-004`。
- 只有不改变程序含义、范围明确的修改才提供自动修复。
- 同一根因只显示一个主要诊断；恢复产生的后续错误应抑制或降噪。
- 语法检测关闭时可以在内部生成诊断，但 UI 不发布 CAIE 规范问题和建议。
- 运行按钮始终消费 `error`；`caie` 和 `hint` 不阻断运行。

## 11. 格式化器契约

- 关键字转换为大写，标识符保留声明拼写。
- 默认嵌套缩进三个空格。
- 不强制重排续行到三空格倍数；按表达式或参数起始列对齐。
- 保留空行和注释的相对位置。
- 将 `<-` 转换为 `←`。
- 不擅自把 CASE 单行分支改写成不同控制结构。
- 格式化前后 AST 必须结构等价；存在阻断解析错误时只执行局部安全格式化。
- 格式化结果再次格式化必须不发生变化，即满足幂等性。

## 12. 模块接口

```ts
tokenize(source, options) -> TokenizeResult
parse(tokens, options) -> ParseResult
bind(program, options) -> BindResult
check(program, symbols, options) -> CheckResult
format(source, options) -> FormatResult
executeProgram(program, options) -> ExecutionController
executeSource(source, options) -> ExecutionController
```

模块不得直接访问 DOM、localStorage 或 IndexedDB。UI 只通过结构化结果和执行事件与语言引擎交互；虚拟文件通过注入的接口访问。

`ExecutionController` 暴露 `result` Promise、`provideInput(value)`、`stop()` 和只读变量快照。执行事件通过 `options.onEvent` 顺序发布；这保留了可重放事件契约，同时允许 `INPUT` 在同一运行任务中暂停、校验失败后重试并继续。

## 13. Parser 错误恢复

- 词法错误恢复到当前行末，但保留换行 token。
- 普通语句错误同步到下一换行。
- 块内部错误同步到下一换行或当前块的 `ELSE`、`ENDIF`、`ENDCASE`、`NEXT`、`UNTIL`、`ENDWHILE`、`ENDPROCEDURE`、`ENDFUNCTION`、`ENDTYPE`、`ENDCLASS`。
- 遇到错误的结束关键字时，报告实际结束符和仍待关闭的块，不随意弹出多个栈帧。
- 每个源文件设置最大诊断数；达到上限后给出一个截断提示，避免错误风暴。

## 14. 实现顺序

1. Token、位置与基础字面量。
2. 表达式和简单语句。
3. IF、CASE 和三类循环。
4. 声明、名称绑定和基本类型。
5. 数组、记录、过程与函数。
6. 文本文件。
7. 解释执行和事件流。
8. Advanced profile。

每一步必须先让 `TEST_CORPUS.md` 中对应的合法样例通过，再扩展下一组语法。

## 15. 实施状态

最新进度：阶段 4 解释器已接入网页，阶段 2 的 Core 与 Advanced 静态检查保持完整。真实运行除阶段 3C 的基本值、复合值、控制结构和例程外，已覆盖文本文件 READ/WRITE/APPEND、EOF，以及随机文件 SEEK/GETRECORD/PUTRECORD；下一阶段为高级学习功能。

截至 2026-09-09，独立 `packages/runtime` 采用受控异步 AST 遍历且不使用 `eval`。阶段 4 在 3C 的独立 frame、BYVAL/BYREF、RETURN 与递归之上加入内存虚拟文件：文件名安全校验、文本和记录文件类型隔离、handle 模式/位置事件、单文件 5 MiB 与项目 25 MiB 上限，以及成功提交、失败回滚。静态语言与运行测试合计 183 项通过。
