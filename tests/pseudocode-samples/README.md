# 伪代码测试样本集（CAIE 9618 Pseudocode Guide）

- `valid/` — 12 个**合法**样本，解析/校验应全部通过，零报错。
- `invalid/` — 24 个**非法**样本，每个文件聚焦一类错误，文件头注释标注了错误类别。

命名：`Vnn_*.pseudo`（valid）/ `Xnn_*.pseudo`（invalid）。

---

## valid/ 覆盖点

| 文件 | 覆盖的语法特性 |
|---|---|
| V01 | `CONSTANT`、`DECLARE`、六种基本类型（INTEGER/REAL/CHAR/STRING/BOOLEAN/DATE）、`←`、`INPUT`/`OUTPUT` 多参数 |
| V02 | `IF/THEN/ELSE/ENDIF` 多层嵌套、`AND`/`OR`/`NOT`、`CASE OF ... OTHERWISE ... ENDCASE` |
| V03 | `FOR/NEXT`、`STEP` 负步长、嵌套循环、`WHILE...ENDWHILE`、`REPEAT...UNTIL` |
| V04 | 一维/二维数组、自定义下界（`0:9`）、遍历、线性查找 |
| V05 | `PROCEDURE`/`ENDPROCEDURE`、`CALL`、`FUNCTION ... RETURNS`/`RETURN`、`BYREF`/`BYVAL`、无参子程序 |
| V06 | `LENGTH/RIGHT/MID/UCASE/LCASE`、`DIV`/`MOD`、`INT`/`RAND`、`&` 连接 |
| V07 | `TYPE...ENDTYPE` 记录、枚举类型、指针类型 `^`/解引用、记录数组、`.` 字段访问 |
| V08 | `OPENFILE FOR READ/WRITE/APPEND`、`READFILE`/`WRITEFILE`、`EOF()`、`CLOSEFILE` |
| V09 | 随机文件：`FOR RANDOM`、`SEEK`、`GETRECORD`、`PUTRECORD` |
| V10 | `CLASS/ENDCLASS`、`PUBLIC`/`PRIVATE`、构造方法 `NEW`、`INHERITS`、`SUPER`、方法调用 |
| V11 | 综合算法：冒泡排序 + 二分查找（`DIV`、复合条件、数组交换） |
| V12 | 注释（整行/行尾）、空行、缩进、多层括号与复合布尔表达式 |

## invalid/ 期望报错

| 文件 | 类别 | 期望检出的错误 |
|---|---|---|
| X01 | 结构 | `IF` 缺 `ENDIF`，块未闭合至 EOF |
| X02 | 语法 | 条件后缺 `THEN` |
| X03 | 语法 | 用 `=` 作赋值、用 `==` 作比较 |
| X04 | 结构 | `NEXT` 计数器与 `FOR` 不一致；第二个 `FOR` 无 `NEXT` |
| X05 | 语义 | 使用未声明标识符（含拼写错误变量） |
| X06 | 类型 | STRING↔INTEGER/REAL 互赋、多字符赋给 CHAR、数字赋给 BOOLEAN、异类型相加 |
| X07 | 数组 | 下标越界（0、11）、维度数不符、非整数下标、`ARRAY[1:]` 缺上界 |
| X08 | 结构 | `WHILE` 缺 `ENDWHILE`；`REPEAT` 缺 `UNTIL` |
| X09 | 结构 | `CASE OF` 后缺表达式、`OTHERWISE` 不在末尾、缺 `ENDCASE` |
| X10 | 子程序 | `FUNCTION` 缺 `RETURNS`、无 `RETURN` 路径、以 `ENDPROCEDURE` 结束 |
| X11 | 子程序 | 调用过程缺 `CALL`、实参个数过少/过多、实参类型错位、把 PROCEDURE 当函数取值 |
| X12 | 子程序 | `PROCEDURE` 内 `RETURN` 带值；顶层 `RETURN` |
| X13 | 语义 | 常量被赋值；`CONSTANT` 右侧使用变量表达式 |
| X14 | 语义 | 重复声明、缺 `: 类型`、非法类型名、类型名大小写错误 |
| X15 | 字面量 | STRING 用单引号、CHAR 用双引号、字符串未闭合、DATE 格式错误 |
| X16 | 词法 | 数字开头、含空格、含 `$`/`-`、使用保留字作标识符 |
| X17 | 语法 | 圆括号/方括号不配对 |
| X18 | 语法 | `++`、`+=`、`%`、`!=`、`&&`、行尾分号等他语言写法 |
| X19 | 文件 | 非法打开模式、未打开即读写、重复打开、READ 模式下写入 |
| X20 | 结构 | 块结束关键字交叉错配（`NEXT`/`ENDIF`、`ENDFOR`）、多余的结束关键字 |
| X21 | OOP/记录 | `TYPE` 缺 `ENDTYPE`、`FUNCTION` 以 `ENDPROCEDURE` 收尾、访问 `PRIVATE` 成员、未定义方法与未定义类型 |
| X22 | 循环 | `FOR` 缺 `TO`、控制变量非 INTEGER、`STEP 0`、`STEP` 非整数 |
| X23 | 表达式 | 运算符缺操作数、相邻操作数无运算符、除以 0、`OUTPUT`/`INPUT`/赋值右侧为空 |
| X24 | 内建函数 | 参数个数不符、参数类型不符、函数名拼写错误 |

---

## 用法建议

- 回归测试：遍历 `valid/`，断言 `errors.length === 0`；遍历 `invalid/`，断言 `errors.length > 0`。
- 更严格的做法：为每个 `Xnn` 记录期望的错误码/行号快照，避免"报错了但报错原因不对"。
- 多数 `Xnn` 文件包含**多个**同类错误，可用于测试错误恢复（一次解析报出全部错误，而非首个错误即终止）。

## 当前自动化状态

- `packages/language/test/sample-corpus.test.ts` 已回归全部 12 个合法样本与 24 个非法样本，其中 V07/V09/V10 覆盖 Advanced profile。
