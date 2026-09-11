# CAIE 9618 伪代码测试语料基线

版本：0.1  
依赖：`CAIE_RULES.md`、`LANGUAGE_SPEC.md`、`runtime-conventions.md`

## 1. 目的

本文定义语言引擎第一批验收语料。它先固定“什么应该通过、什么应该报什么级别”，再允许实现 tokenizer、parser、类型检查和解释器。

本文中的代码用于测试本项目，不代表 Cambridge 官方试题。标记为 `caie-derived` 的案例根据 Guide 的格式和语义改写；标记为 `runtime-defined` 的案例验证本编辑器自行规定的行为。

## 2. 测试记录格式

正式测试文件应逐步迁移为下列结构化格式：

```ts
type CorpusCase = {
  id: string;
  profile: "core-2027" | "advanced-2027";
  sourceKind: "caie-derived" | "runtime-defined" | "regression";
  source: string;
  diagnostics: Array<{
    ruleId: string;
    severity: "error" | "caie" | "hint";
    origin: "CAIE" | "Editor Runtime";
    line: number;
    column?: number;
  }>;
  expectedOutput?: string[];
  expectedState?: unknown;
};
```

位置测试至少断言行号；当 token 位置稳定后再全部增加列号和结束位置。

## 3. Tokenizer 与字面量

### `LEX-001` 基本字面量应通过

来源：`caie-derived`  
预期：零诊断。

```text
CONSTANT Whole = -3
CONSTANT Fraction = 4.7
CONSTANT Letter = 'C'
CONSTANT EmptyText = ""
CONSTANT Finished = FALSE
CONSTANT StartDate = 02/01/2028
```

### `LEX-002` DATE 不得按除法拆分

来源：`regression`  
预期：零诊断；`02/01/2028` 是一个 DATE token。

```text
DECLARE StartDate : DATE
StartDate ← 02/01/2028
```

### `LEX-003` 无效日历日期

来源：`runtime-defined`  
预期：`error/Editor Runtime`，关联 `LIT-006`。

```text
DECLARE StartDate : DATE
StartDate ← 31/02/2028
```

### `LEX-004` REAL 必须在小数点两侧有数字

来源：`caie-derived`  
预期：`.5` 和 `5.` 各产生一个 `error/CAIE`，规则 `LIT-002`。

```text
DECLARE A : REAL
DECLARE B : REAL
A ← .5
B ← 5.
```

### `LEX-005` 未闭合字符串恢复

来源：`runtime-defined`  
预期：第 1 行一个词法错误；第 2 行仍能正常解析。

```text
OUTPUT "unfinished
OUTPUT "next line"
```

### `LEX-006` 注释中的关键字不参与解析

来源：`caie-derived`  
预期：零诊断。

```text
// IF ELSE ENDIF DECLARE <-
OUTPUT "// is text"
```

## 4. 格式与标识符

### `FMT-001` 小写关键字可安全修复

来源：`caie-derived`  
预期：三个 `caie/CAIE`，规则 `FMT-004`；修复后为零诊断。

```text
declare Score : integer
input Score
output Score
```

### `FMT-002` 两空格不能默认判为硬错误

来源：`regression`  
预期：无 `error`；默认宽松格式模式至多产生一个 `hint/CAIE`，规则 `FMT-002`。

```text
IF Ready THEN
  OUTPUT "yes"
ENDIF
```

### `FMT-003` 续行允许为可读性对齐

来源：`regression`  
预期：不能仅因缩进不是三的倍数产生 `caie` 或 `error`。

```text
OUTPUT "A long first value",
       "an aligned continuation"
```

在 parser 支持续行前，此案例状态为 `pending-parser`，不能由旧正则诊断冒充通过。

### `ID-001` 非法标识符

来源：`caie-derived`  
预期：每个声明产生 `error/CAIE`，规则 `ID-001`。

```text
DECLARE 2Players : INTEGER
DECLARE Player-Count : INTEGER
DECLARE Élève : STRING
```

### `ID-002` 大小写重复声明

来源：`caie-derived`  
预期：第 2 行 `error/CAIE`，规则 `ID-003`，并关联第 1 行声明。

```text
DECLARE CountDown : INTEGER
DECLARE Countdown : INTEGER
```

### `ID-003` 关键字不能作为名称

来源：`caie-derived`  
预期：`error/CAIE`，规则 `ID-002`。

```text
DECLARE WHILE : INTEGER
```

### `FMT-004` 90 字符阈值不能冒充 CAIE

来源：`regression`  
预期：若启用编辑器行宽建议，来源必须为 `hint/Editor Runtime`；默认可以零诊断。

```text
OUTPUT "This deliberately long line exists to verify that an editor threshold is not labelled as a Cambridge rule."
```

## 5. 声明、赋值与名称绑定

### `DECL-001` 显式声明并执行

来源：`caie-derived`  
预期输出：`3`。

```text
DECLARE Count : INTEGER
Count ← 2
Count ← Count + 1
OUTPUT Count
```

### `DECL-002` 真正无法绑定的名称

来源：`runtime-defined`  
预期：第 1 行 `error/Editor Runtime`，规则 `DECL-002`。

```text
Total ← MissingValue + 1
```

### `DECL-003` 未初始化读取

来源：`runtime-defined`  
预期：运行时 `error/Editor Runtime`；不得静默输出 0。

```text
DECLARE Score : INTEGER
OUTPUT Score
```

### `CONST-001` DATE 常量是合法字面量

来源：`regression`  
预期：零诊断。

```text
CONSTANT StartDate = 02/01/2028
```

### `CONST-002` 常量不能使用表达式

来源：`caie-derived`  
预期：第 2 行 `error/CAIE`，规则 `CONST-002`。

```text
CONSTANT Price = 5
CONSTANT DoublePrice = Price * 2
```

### `ASSIGN-001` 错误赋值符号

来源：`caie-derived`  
预期：第 2 行 `error/CAIE`，规则 `ASSIGN-001`；安全修复为 `←`。

```text
DECLARE Score : INTEGER
Score = 50
```

## 6. 数组和记录

### `ARRAY-001` 一维和二维数组

来源：`caie-derived`  
预期输出：`AliX`。

```text
DECLARE StudentNames : ARRAY[1:30] OF STRING
DECLARE Board : ARRAY[1:3,1:3] OF CHAR
StudentNames[1] ← "Ali"
Board[2,3] ← 'X'
OUTPUT StudentNames[1], Board[2,3]
```

### `ARRAY-002` 越界与维度错误

来源：`runtime-defined`  
预期：第 2、3 行分别产生越界和维度 `error`。

```text
DECLARE Board : ARRAY[1:3,1:3] OF CHAR
Board[0,1] ← 'X'
Board[1] ← 'O'
```

### `ARRAY-003` 不支持范围批量赋值

来源：`caie-derived`  
预期：第 2 行 `error/CAIE`，规则 `ARRAY-005`。

```text
DECLARE StudentNames : ARRAY[1:30] OF STRING
StudentNames[1 TO 30] ← ""
```

### `RECORD-001` 记录定义和字段访问

来源：`regression`  
预期输出：`Q`。

```text
TYPE Packet
   DECLARE Code : CHAR
   DECLARE Bytes : INTEGER
ENDTYPE
DECLARE Message : Packet
Message.Code ← 'Q'
Message.Bytes ← 12
OUTPUT Message.Code
```

## 7. 表达式、选择和循环

### `EXPR-001` 算术优先级和整数除法

来源：`caie-derived`  
预期输出依次为 `14`、`3`、`2`、`2.5`。

```text
OUTPUT 2 + 3 * 4
OUTPUT 17 DIV 5
OUTPUT 17 MOD 5
OUTPUT 5 / 2
```

### `EXPR-002` 字符串连接

来源：`caie-derived`  
预期输出：`Summer Pudding`。

```text
OUTPUT "Summer" & " " & "Pudding"
```

### `IF-001` 嵌套 IF

来源：`caie-derived`  
预期：零诊断；条件必须绑定为 BOOLEAN。

```text
DECLARE A : INTEGER
DECLARE B : INTEGER
A ← 4
B ← 3
IF A > B THEN
   IF A > 0 THEN
      OUTPUT "positive maximum"
   ENDIF
ELSE
   OUTPUT "not greater"
ENDIF
```

### `CASE-001` 范围和 OTHERWISE

来源：`caie-derived`  
预期输出：`middle`。

```text
DECLARE Mark : INTEGER
Mark ← 55
CASE OF Mark
   0 TO 39 : OUTPUT "low"
   40 TO 69 : OUTPUT "middle"
   OTHERWISE : OUTPUT "high"
ENDCASE
```

### `CASE-002` OTHERWISE 不是最后分支

来源：`caie-derived`  
预期：`error/CAIE`，规则 `CASE-002`。

```text
CASE OF Move
   OTHERWISE : OUTPUT "other"
   'W' : OUTPUT "up"
ENDCASE
```

### `FOR-001` 正向、反向和零次循环

来源：`caie-derived`  
预期输出依次包含 `123`、`321`，第三个循环无输出。

```text
DECLARE Index : INTEGER
FOR Index ← 1 TO 3
   OUTPUT Index
NEXT Index
FOR Index ← 3 TO 1 STEP -1
   OUTPUT Index
NEXT Index
FOR Index ← 3 TO 1
   OUTPUT "never"
NEXT Index
```

### `FOR-002` NEXT 名称不匹配

来源：`runtime-defined`  
预期：第 3 行 `error/Editor Runtime`；不是仅给省略名称的建议。

```text
FOR Row ← 1 TO 3
   OUTPUT Row
NEXT Column
```

### `LOOP-001` REPEAT 至少执行一次

来源：`caie-derived`  
预期输出：`1`。

```text
DECLARE Count : INTEGER
Count ← 0
REPEAT
   Count ← Count + 1
UNTIL Count >= 1
OUTPUT Count
```

### `LOOP-002` WHILE 可以执行零次

来源：`caie-derived`  
预期输出：`done`。

```text
DECLARE Count : INTEGER
Count ← 0
WHILE Count > 0
   OUTPUT "never"
ENDWHILE
OUTPUT "done"
```

## 8. 过程、函数和作用域

### `ROUTINE-001` 形参属于已声明变量

来源：`regression`  
预期：零诊断；输出 `21`。不得把 X 或 Y 报告为未声明。

```text
DECLARE A : INTEGER
DECLARE B : INTEGER
A ← 1
B ← 2
PROCEDURE SWAP(BYREF X : INTEGER, Y : INTEGER)
   DECLARE Temp : INTEGER
   Temp ← X
   X ← Y
   Y ← Temp
ENDPROCEDURE
CALL SWAP(A, B)
OUTPUT A, B
```

### `ROUTINE-002` 默认 BYVAL

来源：`caie-derived`  
预期输出：`5`；过程内部赋值不改变 A。

```text
DECLARE A : INTEGER
A ← 5
PROCEDURE Change(Value : INTEGER)
   Value ← 9
ENDPROCEDURE
CALL Change(A)
OUTPUT A
```

### `ROUTINE-003` 函数作为表达式

来源：`regression`  
预期输出：`20`。

```text
FUNCTION Adjust(Count : INTEGER, Fee : INTEGER) RETURNS INTEGER
   IF Count = 0 THEN
      RETURN Fee
   ELSE
      RETURN Count + Fee
   ENDIF
ENDFUNCTION
OUTPUT Adjust(13, 7)
```

### `ROUTINE-004` CALL 不能调用函数

来源：`caie-derived`  
预期：最后一行 `error/CAIE`，规则 `FUNC-002`。

```text
FUNCTION Identity(Value : INTEGER) RETURNS INTEGER
   RETURN Value
ENDFUNCTION
CALL Identity(1)
```

### `ROUTINE-005` BYREF 实参必须可写

来源：`runtime-defined`  
预期：最后一行 `error/Editor Runtime`。

```text
PROCEDURE Increment(BYREF Value : INTEGER)
   Value ← Value + 1
ENDPROCEDURE
CALL Increment(5)
```

### `ROUTINE-006` 函数并非所有路径返回

来源：`runtime-defined`  
预期：`error/Editor Runtime`，诊断关联函数头和缺失返回路径。

```text
FUNCTION PositiveOnly(Value : INTEGER) RETURNS INTEGER
   IF Value > 0 THEN
      RETURN Value
   ENDIF
ENDFUNCTION
```

## 9. 文本文件

### `FILE-001` 复制文本文件

来源：`caie-derived`  
初始文件：`Input.txt = ["A", "", "B"]`。  
预期结束文件：`Output.txt = ["A", "---", "B"]`。

```text
DECLARE LineOfText : STRING
OPENFILE "Input.txt" FOR READ
OPENFILE "Output.txt" FOR WRITE
WHILE NOT EOF("Input.txt")
   READFILE "Input.txt", LineOfText
   IF LineOfText = "" THEN
      WRITEFILE "Output.txt", "---"
   ELSE
      WRITEFILE "Output.txt", LineOfText
   ENDIF
ENDWHILE
CLOSEFILE "Input.txt"
CLOSEFILE "Output.txt"
```

### `FILE-002` 模式不匹配

来源：`runtime-defined`  
预期：第 2 行 `error/Editor Runtime`，文件保持不变。

```text
OPENFILE "Input.txt" FOR READ
WRITEFILE "Input.txt", "bad"
```

### `FILE-003` 失败运行回滚

来源：`runtime-defined`  
初始文件：`Output.txt = ["old"]`。  
预期：运行错误后文件仍为 `["old"]`。

```text
OPENFILE "Output.txt" FOR WRITE
WRITEFILE "Output.txt", "new"
OUTPUT 1 / 0
```

## 10. Advanced profile

### `ADV-001` Core 模式拒绝高级结构但不级联

来源：`runtime-defined`  
预期：一个“profile 不支持”诊断，不再对 CLASS 内部产生大量错误。

```text
CLASS Pet
   PRIVATE Name : STRING
ENDCLASS
```

### `ADV-002` 随机文件地址为 1-based

来源：`runtime-defined`  
profile：`advanced-2027`。  
预期：SEEK 0 产生 `error/Editor Runtime`。

```text
OPENFILE "Students.dat" FOR RANDOM
SEEK "Students.dat", 0
```

### `ADV-003` 对象构造与方法调用

来源：`regression`  
profile：`advanced-2027`。  
预期输出：`9`。

```text
CLASS Meter
   PRIVATE Count : INTEGER
   PUBLIC PROCEDURE NEW(Start : INTEGER)
      Count ← Start + 1
   ENDPROCEDURE
   PUBLIC FUNCTION GetCount() RETURNS INTEGER
      RETURN Count
   ENDFUNCTION
ENDCLASS
CLASS DoubleMeter INHERITS Meter
   PUBLIC PROCEDURE NEW(Start : INTEGER)
      SUPER.NEW(Start * 2)
   ENDPROCEDURE
ENDCLASS
DECLARE Item : DoubleMeter
Item ← NEW DoubleMeter(4)
OUTPUT Item.GetCount()
```

## 11. 资源与停止行为

### `LIMIT-001` 无限循环可停止

来源：`runtime-defined`  
预期：在步数或时间上限内停止，UI 保持响应，不提交文件修改。

```text
WHILE TRUE
   OUTPUT "loop"
ENDWHILE
```

### `LIMIT-002` 递归深度限制

来源：`runtime-defined`  
预期：调用深度达到限制后产生一个明确运行时错误，不导致浏览器栈溢出。

```text
PROCEDURE Forever()
   CALL Forever()
ENDPROCEDURE
CALL Forever()
```

## 12. 现有阶段 1 诊断的回归清单

在替换 `web/js/lang.js` 前，必须为以下已知问题建立自动测试：

| 回归 | 对应案例 | 当前错误行为 | 目标 |
|---|---|---|---|
| DATE 常量 | `CONST-001` | 报“常量不是字面量” | 零诊断 |
| 过程参数 | `ROUTINE-001` | X、Y 被报未声明并阻断 | 参数进入局部符号表 |
| 两空格缩进 | `FMT-002` | 标为 CAIE 规范问题 | 默认不作硬性判断 |
| 90 字符阈值 | `FMT-004` | 标为 CAIE 来源 | 删除或改为 Editor Runtime |
| 错误块恢复 | 新增 parser 专项测试 | 简单弹栈导致误导信息 | 保留真实未关闭块并继续解析 |

## 13. 阶段验收门槛

### Tokenizer

- `LEX-001` 至 `LEX-006` 全部通过。
- 每个 token 具有准确起止位置。
- 非法字符不会阻止后续行 token 化。

### Parser 与 AST

- 本文所有 core 合法案例均能生成 AST。
- 所有非法案例产生预期主诊断，且没有无关错误风暴。
- AST 序列化快照稳定。

### 名称与类型检查

- 作用域、参数、数组、记录、函数返回和文件模式案例通过。
- 每个诊断包含 `ruleId`、`origin` 和准确源码范围。

### Interpreter

- 所有 `expectedOutput` 和文件结束状态完全一致。
- 用户停止、错误和资源超限均不会锁死页面。
- 失败运行的虚拟文件修改完整回滚。

阶段 4 当前已自动覆盖：3C 的基本值、控制结构、数组、记录、过程/函数、BYVAL/BYREF、RETURN、递归、INPUT 与 frame 事件；文本文件复制、EOF、WRITE 清空、APPEND、文件名大小写混用与不安全路径拒绝；1-based RANDOM 定位、GET/PUT 不自动前移、覆盖/末尾追加/禁止空洞、记录类型固定；运行时错误、用户停止及文件大小超限时完整回滚。共 15 个测试文件、183 项测试通过。

### Formatter

- 格式化幂等。
- 格式化前后 AST 等价。
- 不丢失注释、空行或 DATE 字面量。

## 14. 待扩展测试

- 所有内置函数的正常、边界和错误参数。
- CASE 多值分支、字符范围和重叠范围。
- 多维数组整体赋值。
- 深层记录和数组组合。
- 相互递归、局部遮蔽和大小写混用。
- EOF 空文件、重复打开和关闭的更多组合。
- 枚举、指针、集合、继承、PRIVATE 访问和 SUPER。
- 题目提供的 `exam-extension` 函数签名。
- 中英文输入、emoji CHAR、组合字符和大文件性能。
