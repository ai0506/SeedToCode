# 术语对照表（种子版）

版本：0.2（章号已同步到 [01-CURRICULUM.md](01-CURRICULUM.md) 0.2 版的连续编号）
规则见 [02-CONTENT_SPEC.md](02-CONTENT_SPEC.md) 第 3 节。**教学正文只能使用本表登记的译法；需要新词先加表。**

## 使用方式

- 「首次出现」写「中文（English）」，每章各算一次首次。
- 伪代码关键字（A 类）**永不翻译**，正文中用行内代码格式。
- 「出现章节」列指该术语**首次教授**的章，同时是知识点闸门的依据。

## A. 伪代码关键字（不翻译，仅登记）

`DECLARE` `CONSTANT` `INTEGER` `REAL` `CHAR` `STRING` `BOOLEAN` `DATE` `ARRAY` `OF`
`IF` `THEN` `ELSE` `ENDIF` `CASE OF` `OTHERWISE` `ENDCASE`
`FOR` `TO` `STEP` `NEXT` `WHILE` `ENDWHILE` `REPEAT` `UNTIL`
`PROCEDURE` `ENDPROCEDURE` `CALL` `FUNCTION` `RETURNS` `RETURN` `ENDFUNCTION` `BYVAL` `BYREF`
`TYPE` `ENDTYPE` `SET OF` `DEFINE`
`OPENFILE` `READ` `WRITE` `APPEND` `RANDOM` `READFILE` `WRITEFILE` `CLOSEFILE` `EOF` `SEEK` `GETRECORD` `PUTRECORD`
`CLASS` `ENDCLASS` `INHERITS` `NEW` `SUPER` `PUBLIC` `PRIVATE`
`AND` `OR` `NOT` `DIV` `MOD` `TRUE` `FALSE`
`LENGTH` `MID` `RIGHT` `LCASE` `UCASE` `INT` `RAND`

## B. 基础概念

| 中文 | English | 出现章节 |
|---|---|---|
| 算法 | algorithm | 1 |
| 自然语言 | natural language | 1 |
| 伪代码 | pseudocode | 1 |
| 顺序 | sequence | 1 |
| 选择 | selection | 4 |
| 重复 | iteration | 5 |
| 缩进 | indentation | 1 |
| 注释 | comment | 1 |
| 变量 | variable | 2 |
| 常量 | constant | 2 |
| 标识符 | identifier | 2 |
| 字面量 | literal | 2 |
| 声明 | declaration | 2 |
| 赋值 | assignment | 2 |
| 数据类型 | data type | 2 |
| 初始化 | initialisation | 2 |
| 表达式 | expression | 3 |
| 运算符 | operator | 3 |
| 关系运算符 | relational operator | 3 |
| 逻辑运算符 | logic operator | 3 |
| 优先级 | precedence | 3 |
| 条件 | condition | 4 |
| 嵌套 | nested | 4 |

## C. 控制结构

| 中文 | English | 出现章节 |
|---|---|---|
| 计数控制循环 | count-controlled loop | 5 |
| 前测循环 | pre-condition loop | 5 |
| 后测循环 | post-condition loop | 5 |
| 循环计数器 | loop counter | 5 |
| 控制变量 | control variable | 5 |
| 死循环 | infinite loop | 5 |
| 嵌套循环 | nested loop | 6 |
| 哨兵 | sentinel | 5 |

## D. 数据结构

| 中文 | English | 出现章节 |
|---|---|---|
| 连接 | concatenation | 7 |
| 数组 | array | 8 |
| 下标 | index | 8 |
| 下界 | lower bound | 8 |
| 上界 | upper bound | 8 |
| 遍历 | traverse | 8 |
| 一维数组 | 1D array | 8 |
| 二维数组 | 2D array | 9 |
| 记录 | record | 11 |
| 字段 | field | 11 |
| 平行数组 | parallel arrays | 11 |
| 记录数组 | array of records | 11 |

## E. 算法

| 中文 | English | 出现章节 |
|---|---|---|
| 线性查找 | linear search | 10 |
| 冒泡排序 | bubble sort | 10 |
| 标志 | flag | 10 |
| 一趟 | pass | 10 |
| 交换 | swap | 10 |
| 二分查找 | binary search | 18 |
| 插入排序 | insertion sort | 18 |
| 时间复杂度 | time complexity | 18 |
| 空间复杂度 | space complexity | 18 |
| 大 O 表示法 | Big O notation | 18 |

## F. 模块化

| 中文 | English | 出现章节 |
|---|---|---|
| 分解 | decomposition | 12 |
| 模块化 | modularity | 12 |
| 过程 | procedure | 12 |
| 参数 | parameter | 12 |
| 实参 | argument | 12 |
| 传值 | by value | 12 |
| 传引用 | by reference | 12 |
| 作用域 | scope | 12 |
| 局部变量 | local variable | 12 |
| 全局变量 | global variable | 12 |
| 函数 | function | 13 |
| 头部 | header | 13 |
| 接口 | interface | 13 |
| 返回值 | return value | 13 |
| 副作用 | side effect | 13 |
| 逐步求精 | stepwise refinement | 16 |
| 标识符表 | identifier table | 16 |
| 结构化英语 | structured English | 16 |
| 流程图 | flowchart | 16 |
| 结构图 | structure chart | 16 |

## G. 文件

| 中文 | English | 出现章节 |
|---|---|---|
| 文本文件 | text file | 14 |
| 文件模式 | file mode | 14 |
| 文件末尾 | end of file | 14 |
| 串行文件 | serial file | 21 |
| 顺序文件 | sequential file | 21 |
| 随机文件 | random file | 21 |
| 键字段 | key field | 21 |
| 记录键 | record key | 21 |
| 顺序访问 | sequential access | 21 |
| 直接访问 | direct access | 21 |
| 散列算法 | hashing algorithm | 21 |
| 碰撞 | collision | 21 |
| 文件指针 | file pointer | 21 |

## H. 抽象数据类型

| 中文 | English | 出现章节 |
|---|---|---|
| 抽象数据类型 | abstract data type, ADT | 15 |
| 栈 | stack | 15 |
| 队列 | queue | 15 |
| 链表 | linked list | 15 |
| 入栈 | push | 15 |
| 出栈 | pop | 15 |
| 入队 | enqueue | 15 |
| 出队 | dequeue | 15 |
| 后进先出 | LIFO | 15 |
| 先进先出 | FIFO | 15 |
| 节点 | node | 15 |
| 空闲链表 | free list | 20 |
| 环形队列 | circular queue | 20 |
| 字典 | dictionary | 20 |
| 二叉树 | binary tree | 20 |
| 图 | graph | 20 |

## I. A Level 类型、递归与范式

| 中文 | English | 出现章节 |
|---|---|---|
| 自定义数据类型 | user-defined data type | 17 |
| 非组合类型 | non-composite type | 17 |
| 组合类型 | composite type | 17 |
| 枚举类型 | enumerated type | 17 |
| 集合 | set | 17 |
| 指针 | pointer | 17 |
| 递归 | recursion | 19 |
| 基本情况 | base case | 19 |
| 递归情况 | recursive case | 19 |
| 调用栈 | call stack | 19 |
| 栈展开 | unwinding | 19 |
| 类 | class | 22 |
| 对象 | object | 22 |
| 实例 | instance | 22 |
| 属性 | property / attribute | 22 |
| 方法 | method | 22 |
| 构造函数 | constructor | 22 |
| 封装 | encapsulation | 22 |
| 继承 | inheritance | 22 |
| 多态 | polymorphism | 22 |
| 包含 / 聚合 | containment / aggregation | 22 |
| 取值方法 | getter | 22 |
| 赋值方法 | setter | 22 |
| 异常 | exception | 23 |
| 异常处理 | exception handling | 23 |
| 编程范式 | programming paradigm | 23 |

## J. 暂不进入主线（待定章 X1 / 将来的 Chapter 24）

下列术语属于「追踪、调试与测试」，已移出主线（见 [00-REVIEW.md](00-REVIEW.md) 决议 2.1、2.2），**主线教学正文不使用**：

| 中文 | English |
|---|---|
| 追踪 | trace |
| 追踪表 | trace table |
| 手工检查 | dry run / desk check |
| 语法错误 | syntax error |
| 运行时错误 | runtime error |
| 逻辑错误 | logic error |
| 测试数据 | test data |
| 正常数据 | normal data |
| 异常数据 | abnormal data |
| 极端数据 | extreme data |
| 边界数据 | boundary data |

其中 normal / abnormal / extreme / boundary 四类仍作为**出题者的内部规则**使用（见 [03-EXERCISE_SPEC.md](03-EXERCISE_SPEC.md) 4.2），只是不出现在学生可见的正文里。

## 待定项

以下译法尚未确定，用到之前需先定：

| English | 候选 | 备注 |
|---|---|---|
| overflow / underflow（栈） | 上溢 / 下溢 | Chapter 20 用到 |
| encapsulation vs information hiding | 封装 vs 信息隐藏 | 考纲只列 encapsulation |
