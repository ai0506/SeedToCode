# CAIE 9618 伪代码规则基线

版本：0.1  
适用考试：2027、2028、2029  
权威来源：`pseudocode_guide-9618.pdf`、`syllabus-9618.pdf`

## 1. 文档目的

本文档把 CAIE 9618 的伪代码要求整理为可供编辑器、格式化器、诊断器、解释器和测试共同引用的规则基线。

它不复制整份指南，也不替 Cambridge 补充新的语法。指南没有规定的执行细节统一放入 `runtime-conventions.md`，并标记为 `Editor Runtime`，不得显示为 CAIE 官方要求。

## 2. 来源与适用范围

- `pseudocode_guide-9618.pdf` 是伪代码表面形式、示例和用法的主要来源；本文页码均指 PDF 中印刷页码。
- `syllabus-9618.pdf` 决定考试范围：Paper 2 对应 AS Level 第 9 至 12 节，重点是算法、数据类型与结构、文件、编程和软件开发。
- A Level 第 13、19、20 节包含用户自定义类型、递归、OOP 和进一步编程。Paper 4 要求使用实际编程语言完成任务；不能把 Pseudocode Guide 中出现 OOP 写法解释为 Paper 4 只考伪代码。
- 本项目不是 Cambridge 官方产品。规则说明必须显示版本和来源，不得暗示官方认证。

## 3. 规范用语与诊断映射

| 强度 | 来源措辞或含义 | 编辑器处理 |
|---|---|---|
| `REQUIRED` | 指南给出唯一格式，或使用 `must`、`must not`、明确的类型/结构约束 | 违反后若无法可靠解析或执行，记为阻断错误；否则记为 CAIE 规范问题 |
| `RECOMMENDED` | `good practice`、`usually`、`normally`、`advisable`、`should` 等非绝对要求 | 只给建议或可关闭的规范提醒，不阻断运行 |
| `EXAM-PRESENTATION` | 描述试卷中伪代码通常如何排版，不一定约束学生输入 | 作为格式化默认值；不单独阻断运行 |
| `SYLLABUS-SCOPE` | 考纲要求学生理解或使用的知识范围 | 决定实现优先级，不直接产生诊断 |
| `EDITOR-RUNTIME` | Cambridge 未定义、由本编辑器为了确定性和安全性作出的约定 | 来源必须显示为 `Editor Runtime` |

诊断严重度只有三种：

- `error`：源代码无法建立唯一 AST、名称无法绑定、类型不满足执行要求，或运行时发生错误。
- `caie`：代码可以继续处理，但表面形式与指南给出的明确格式不一致。
- `hint`：良好实践、可读性或考试书写建议。

规则的“CAIE 强度”和“编辑器严重度”不是同一个概念。例如，指南只把显式声明称为良好实践；但程序若引用了从未建立绑定的名称，解释器仍然无法执行。前者是 `hint/CAIE`，后者是 `error/Editor Runtime`。

## 4. 展示、大小写与注释

| 规则 ID | 强度 | 规则 | 来源 | 默认诊断 |
|---|---|---|---|---|
| `FMT-001` | EXAM-PRESENTATION | 伪代码使用一致的等宽字体展示。 | Guide 1.1，p.5 | 无；编辑器默认行为 |
| `FMT-002` | RECOMMENDED | 嵌套行通常缩进三个空格。 | Guide 1.2，p.5 | `hint/CAIE` |
| `FMT-003` | EXAM-PRESENTATION | 使用行号时可以省略缩进；续行可以按可读性对齐。 | Guide 1.2、1.4，pp.5-6 | 不把“非三的倍数”自动判错 |
| `FMT-004` | REQUIRED | 关键字使用大写。 | Guide 1.3，p.5 | `caie/CAIE`，可安全修复 |
| `FMT-005` | RECOMMENDED | 标识符使用能体现单词边界的 mixed case，并优先选用有意义的名称。 | Guide 1.3、2.3，pp.5、7 | `hint/CAIE` |
| `FMT-006` | REQUIRED | 单行注释以 `//` 开始并持续到行尾；多行注释的每一行均使用 `//`。 | Guide 1.5，p.6 | 词法规则；不要求注释必须独占一行 |
| `FMT-007` | RECOMMENDED | 注释通常放在所说明代码之前并保持同层缩进；短注释可以置于行末。 | Guide 1.5，p.6 | `hint/CAIE` |

实现注意：三空格是默认格式化策略，不是“所有非三空格均违反 CAIE”的依据。编辑器可以另设严格格式模式，但其来源必须是 `Editor Runtime`。

## 5. 基本类型、字面量与标识符

| 规则 ID | 强度 | 规则 | 来源 | 默认诊断 |
|---|---|---|---|---|
| `TYPE-001` | REQUIRED | 基本类型关键字为 `INTEGER`、`REAL`、`CHAR`、`STRING`、`BOOLEAN`、`DATE`。 | Guide 2.1，p.7 | 解析/类型规则 |
| `LIT-001` | REQUIRED | 整数字面量使用十进制整数形式，可为负数。 | Guide 2.2，p.7 | `error/CAIE` |
| `LIT-002` | REQUIRED | 实数字面量小数点两侧至少各有一位数字。 | Guide 2.2，p.7 | `error/CAIE` |
| `LIT-003` | REQUIRED | `CHAR` 为由单引号包围的单个字符。 | Guide 2.2，p.7 | `error/CAIE` |
| `LIT-004` | REQUIRED | `STRING` 由双引号包围，可以为空字符串。 | Guide 2.2，p.7 | `error/CAIE` |
| `LIT-005` | REQUIRED | 布尔字面量为 `TRUE` 和 `FALSE`。 | Guide 2.1-2.2，p.7 | `error/CAIE` |
| `LIT-006` | RECOMMENDED | 日期通常写为 `dd/mm/yyyy`；应说明其为 DATE 以及采用的格式。 | Guide 2.2，p.7 | 合法日期不得误报为“非字面量”；格式说明可作 `hint/CAIE` |
| `ID-001` | REQUIRED | 标识符只含英文字母、数字和下划线，且必须以字母开头；不使用重音字母。 | Guide 2.3，p.7 | `error/CAIE` |
| `ID-002` | REQUIRED | 关键字不得作为变量名。相同原则适用于常量、类型、过程、函数、参数和字段名称。 | Guide 2.3，p.7；后半句为一致性扩展 | `error/CAIE` |
| `ID-003` | REQUIRED | 标识符不区分大小写；只改变字母大小写不能形成不同名称。 | Guide 2.3，p.7 | 重复声明为 `error/CAIE` |

## 6. 声明、常量与赋值

| 规则 ID | 强度 | 规则 | 来源 | 默认诊断 |
|---|---|---|---|---|
| `DECL-001` | RECOMMENDED | 使用 `DECLARE name : type` 显式声明变量是良好实践。 | Guide 2.4，p.8 | 单纯缺少声明最多为 `hint/CAIE` |
| `DECL-002` | EDITOR-RUNTIME | 在严格执行模式中，每个被读取或写入的名称必须能绑定到变量、常量、参数、字段或其他已知声明。 | `runtime-conventions.md` | `error/Editor Runtime` |
| `CONST-001` | REQUIRED | 常量写为 `CONSTANT name = literal`。 | Guide 2.5，p.8 | `error/CAIE` |
| `CONST-002` | REQUIRED | 常量值只能是字面量，不能是变量、另一常量或表达式。 | Guide 2.5，p.8 | `error/CAIE` |
| `CONST-003` | RECOMMENDED | 常量通常在代码开头声明，除非需要限制其作用域。 | Guide 2.5，p.8 | `hint/CAIE` |
| `ASSIGN-001` | REQUIRED | 赋值运算符为 `←`，目标必须是可写变量、数组元素或用户自定义类型字段。 | Guide 2.6，p.9 | 错误使用 `=` 赋值为 `error/CAIE`；`<-` 为可修复的 `caie/CAIE` |
| `ASSIGN-002` | REQUIRED | 右侧表达式的结果类型必须与目标类型相容。 | Guide 2.6，p.9 | `error/CAIE` |
| `ASSIGN-003` | REQUIRED | 常量不可再次赋值。 | Guide 2.5-2.6，pp.8-9 | `error/CAIE` |

## 7. 数组与用户自定义类型

| 规则 ID | 强度 | 规则 | 来源 | 默认诊断 |
|---|---|---|---|---|
| `ARRAY-001` | REQUIRED | 数组是固定长度、同一元素类型、具有连续整数下标的结构。 | Guide 3，p.10 | 类型/运行规则 |
| `ARRAY-002` | REQUIRED | 一维数组使用 `DECLARE name : ARRAY[lower:upper] OF type`；二维数组在同一对方括号中写两个范围并以逗号分隔。 | Guide 3.1，p.10 | `error/CAIE` |
| `ARRAY-003` | RECOMMENDED | 显式写出下界；指南示例通常使用下界 1，但不把 0 视为非法。 | Guide 3.1，p.10 | `hint/CAIE` |
| `ARRAY-004` | REQUIRED | 数组索引必须是求值为有效整数的字面量或表达式。 | Guide 3.2，p.10 | 类型错误或越界为 `error` |
| `ARRAY-005` | REQUIRED | 同尺寸、同元素类型的整个数组可以相互赋值；不能用范围语法一次引用一组元素。 | Guide 3.2，pp.10-11 | `error/CAIE` |
| `UDT-001` | REQUIRED | 枚举类型写为 `TYPE name = (value1, value2, ...)`。 | Guide 4.1，p.12 | 高级范围 |
| `UDT-002` | REQUIRED | 指针类型写为 `TYPE name = ^type`；指针变量声明时不重复 `^`。 | Guide 4.1，p.12 | 高级范围 |
| `UDT-003` | REQUIRED | 记录由 `TYPE name`、字段 `DECLARE` 和 `ENDTYPE` 构成。 | Guide 4.1，p.13 | `error/CAIE` |
| `UDT-004` | REQUIRED | 集合类型使用 `TYPE name = SET OF type`，集合值使用 `DEFINE`。 | Guide 4.1，p.13 | 高级范围 |
| `UDT-005` | REQUIRED | 用户自定义类型可用于普通变量和数组声明；记录字段使用点号访问。 | Guide 4.2，p.14 | 类型规则 |

## 8. 输入、输出、运算符与内置函数

| 规则 ID | 强度 | 规则 | 来源 | 默认诊断 |
|---|---|---|---|---|
| `IO-001` | REQUIRED | 输入写为 `INPUT target`，目标应为可写变量、数组元素或自定义类型字段。 | Guide 5.1，p.15 | `error/CAIE` |
| `IO-002` | REQUIRED | 输出写为 `OUTPUT value1, value2, ...`，多个值以逗号分隔。 | Guide 5.1，p.15 | `error/CAIE` |
| `OP-001` | REQUIRED | 算术运算符为 `+`、`-`、`*`、`/`、`DIV`、`MOD`；`/` 的结果为 `REAL`。 | Guide 5.2，p.15 | 类型规则 |
| `OP-002` | REQUIRED | `*`、`/`、`DIV`、`MOD` 的优先级高于 `+`、`-`。 | Guide 5.2，p.15 | 解析规则 |
| `OP-003` | REQUIRED | 关系运算符为 `>`、`<`、`>=`、`<=`、`=`、`<>`，结果为 `BOOLEAN`。 | Guide 5.3，p.16 | 类型规则 |
| `OP-004` | REQUIRED | 逻辑运算符仅为 `AND`、`OR`、`NOT`，操作数和结果均为 `BOOLEAN`。 | Guide 5.4，p.16 | 类型规则 |
| `OP-005` | REQUIRED | 字符串连接使用 `&`。 | Guide 5.5，p.17 | 类型规则 |
| `OP-006` | RECOMMENDED | 复杂表达式使用括号明确求值顺序。 | Guide 5.2-5.4，pp.15-16 | `hint/CAIE` |
| `BUILTIN-001` | REQUIRED | 指南列出的基础函数为 `RIGHT`、`LENGTH`、`MID`、`LCASE`、`UCASE`、`INT`、`RAND`，参数与返回类型按指南签名检查。 | Guide 5.5-5.6，pp.16-17 | 参数错误为 `error/CAIE` |
| `BUILTIN-002` | EXAM-PRESENTATION | 考试需要的其他伪代码函数会在试卷中提供。编辑器不能把未知题目函数一概称为“非 CAIE”。 | Guide 5.5，p.16；Syllabus 11.1，p.29 | 未知函数根据模式处理 |

## 9. 选择与循环

| 规则 ID | 强度 | 规则 | 来源 | 默认诊断 |
|---|---|---|---|---|
| `IF-001` | REQUIRED | `IF condition THEN ... [ELSE ...] ENDIF`；`ELSE` 可省略。 | Guide 6.1，p.18 | 结构或条件类型错误为 `error` |
| `CASE-001` | REQUIRED | `CASE OF identifier` 由按顺序测试的值、范围和可选 `OTHERWISE` 分支组成，以 `ENDCASE` 结束。 | Guide 6.2，p.19 | `error/CAIE` |
| `CASE-002` | REQUIRED | `OTHERWISE` 若存在必须是最后一个分支；第一个匹配分支执行后即离开 CASE。 | Guide 6.2，p.19 | 次序错误为 `error/CAIE` |
| `FOR-001` | REQUIRED | `FOR variable ← start TO end [STEP increment] ... NEXT variable`；控制变量、边界和步长均为 `INTEGER`。 | Guide 7.1，p.20 | `error/CAIE` |
| `FOR-002` | REQUIRED | 未指定 STEP 时按 1 递增，边界包含在循环范围内；初值大于终值且无负步长时循环体不执行。 | Guide 7.1，p.20 | 执行规则 |
| `FOR-003` | RECOMMENDED | `NEXT` 后重复控制变量名，尤其在嵌套循环中。 | Guide 7.1，p.20 | `hint/CAIE` |
| `REPEAT-001` | REQUIRED | `REPEAT ... UNTIL condition` 至少执行一次，条件必须为 `BOOLEAN`，为 TRUE 时结束。 | Guide 7.2，pp.20-21 | `error/CAIE` |
| `WHILE-001` | REQUIRED | `WHILE condition ... ENDWHILE` 在循环体前测试 BOOLEAN 条件，为 FALSE 时结束。 | Guide 7.3，p.21 | `error/CAIE` |

## 10. 过程、函数与参数

| 规则 ID | 强度 | 规则 | 来源 | 默认诊断 |
|---|---|---|---|---|
| `PROC-001` | REQUIRED | 过程由 `PROCEDURE name(parameters)` 和 `ENDPROCEDURE` 定义，以独立语句 `CALL name(arguments)` 调用。 | Guide 8.1，pp.22-23 | `error/CAIE` |
| `PROC-002` | REQUIRED | 实参数量、顺序和类型必须与形参一致。 | Guide 8.1，p.22 | `error/CAIE` |
| `FUNC-001` | REQUIRED | 函数头包含 `RETURNS type`，以 `ENDFUNCTION` 结束，并用 `RETURN value` 返回单个值。 | Guide 8.2，pp.23-24 | `error/CAIE` |
| `FUNC-002` | REQUIRED | 函数调用必须出现在表达式中，不使用 `CALL`。执行 `RETURN` 后立即结束函数。 | Guide 8.2，p.23 | `error/CAIE` |
| `PARAM-001` | REQUIRED | `BYVAL`、`BYREF` 写在形参前；未写时默认 BYVAL；连续相同传递方式的参数可以省略重复关键字。 | Guide 8.3，p.24 | 参数绑定规则 |
| `PARAM-002` | REQUIRED | 函数参数不应以 BYREF 传递。 | Guide 8.3，p.24 | `caie/CAIE`；严格模式可阻断 |
| `PARAM-003` | REQUIRED | 形参在过程或函数体内就是已声明变量，不得报告为未声明名称。 | Guide 8.1，p.22 | 名称绑定规则 |

## 11. 文件处理

| 规则 ID | 强度 | 规则 | 来源 | 默认诊断 |
|---|---|---|---|---|
| `FILE-001` | REQUIRED | 文本文件在操作前使用 `OPENFILE file FOR READ|WRITE|APPEND` 打开。 | Guide 9.1，p.25 | 模式错误为 `error/CAIE` |
| `FILE-002` | REQUIRED | `READFILE file, variable` 的目标应为 `STRING`；`EOF(file)` 返回 BOOLEAN。 | Guide 9.1，p.25 | `error/CAIE` |
| `FILE-003` | REQUIRED | `WRITEFILE file, data` 仅用于 WRITE 或 APPEND 模式；不再使用时以 `CLOSEFILE file` 关闭。 | Guide 9.1，p.25 | 模式错误为 `error/CAIE`；未显式关闭可为建议 |
| `FILE-004` | RECOMMENDED | 同一文件应一次只以一种模式打开。 | Guide 9.1，p.25 | `caie/CAIE`，运行时拒绝重复打开 |
| `FILE-005` | REQUIRED | 随机文件以 RANDOM 模式打开，使用 `SEEK file, integerAddress` 定位，再以 `GETRECORD` 或 `PUTRECORD` 读写匹配类型的记录。 | Guide 9.2，pp.26-27 | 高级范围；类型/模式错误为 `error` |
| `FILE-006` | EDITOR-RUNTIME | 地址基数、越界、写入空洞以及 GET/PUT 后是否自动移动位置由 `runtime-conventions.md` 定义。 | Cambridge 未明确规定 | `Editor Runtime` |

## 12. 面向对象写法

| 规则 ID | 强度 | 规则 | 来源 | 默认诊断 |
|---|---|---|---|---|
| `OOP-001` | REQUIRED | 属性和方法默认 PUBLIC；相关时以 `PUBLIC`、`PRIVATE` 显式标明访问级别。 | Guide 10.1，p.28 | 高级范围 |
| `OOP-002` | REQUIRED | 方法以 `object.Method(arguments)` 调用；构造器是名为 `NEW` 的过程。 | Guide 10.1-10.2，p.28 | 高级范围 |
| `OOP-003` | REQUIRED | 继承使用 `INHERITS`，调用父类成员使用 `SUPER`。 | Guide 10.2，p.28 | 高级范围 |
| `OOP-004` | REQUIRED | 创建对象写为 `target ← NEW Class(arguments)`。 | Guide 10.2，p.29 | 高级范围 |

## 13. 考纲实现优先级

### Core profile：公开 MVP 必须覆盖

依据 Syllabus pp.27-30：

- 输入、处理、输出以及顺序、选择、循环。
- `INTEGER`、`REAL`、`CHAR`、`STRING`、`BOOLEAN`、`DATE`、数组和文件。
- 记录、一维/二维数组、冒泡排序、线性搜索。
- 文本文件。
- 常量、变量、赋值、算术与逻辑表达式、输入输出。
- IF、CASE、FOR、REPEAT、WHILE。
- 过程、函数、参数、BYVAL 和 BYREF。

### Advanced profile：Core 稳定后覆盖

依据 Syllabus p.32、pp.37-38 以及 Guide pp.12-14、26-29：

- 枚举、指针、集合、class/object。
- 递归。
- 随机文件与记录寻址。
- OOP，包括继承、封装、构造器和方法。

栈、队列、链表在 AS Level 要求理解和操作，但考纲明确说明不要求用伪代码实现这些结构。因此它们适合作为学习可视化功能，不应阻塞 Core 语言引擎。

## 14. 当前基础诊断必须修复的偏差

| 偏差 | 相关规则 | 目标行为 |
|---|---|---|
| 任意非三空格缩进都标为 CAIE 问题 | `FMT-002`、`FMT-003` | 默认仅建议；允许行号模式和续行对齐 |
| 未声明名称统一标为 CAIE 阻断错误 | `DECL-001`、`DECL-002` | 区分“建议显式声明”和“运行时无法绑定” |
| 过程/函数参数被当成未声明变量 | `PARAM-003` | 参数进入局部作用域符号表 |
| 合法 `dd/mm/yyyy` 常量被当成非字面量 | `LIT-006`、`CONST-002` | DATE 词法和日历有效性检查独立实现 |
| 超过 90 字符标为 CAIE 来源 | `FMT-003` | 若保留阈值，改为 `hint/Editor Runtime` |
| 只按正则逐行推断结构 | 全部结构规则 | tokenizer、parser、AST 接管阻断诊断 |

## 15. 维护规则

- 规则 ID 一经进入测试不得重新解释或复用；废弃规则保留 ID 并标记状态。
- 每个诊断必须包含：`ruleId`、`severity`、`origin`、源码范围和简短说明。
- `origin: CAIE` 必须能回到本文中的具体 Guide 或 Syllabus 页码。
- `Editor Runtime` 约定不得写入本文件的 CAIE 规则表，只能通过交叉引用出现。
- Cambridge 发布新版 syllabus 或 guide 时，先复制为新的版本化基线，再做差异审查，不直接静默覆盖本版本。
