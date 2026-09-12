# Chapter 2 — 变量与数据类型  `[AS]`

对应 §10.1、§11.1、G§2｜内容预览（不是最终版式，只是把数据平铺出来读）


---

## 2.1　变量、标识符与声明

<sub>§10.1、G§2.3、G§2.4｜约 8 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`</sub>

上一章的 `INPUT Name` 先把名字读进来，后来 `OUTPUT` 又把它拿出来。中间那个叫 `Name` 的位置，就是**变量（variable）**：它有一个名字，里面放的值可以在程序运行时改变。

给变量起的名字叫**标识符（identifier）**。它必须从字母开始，之后只能用字母、数字或下划线；不能有空格，也不要用带重音的字母。`PlayerName` 可以，`2ndPlayer` 和 `Player Name` 不可以。标识符不区分大小写，所以 `Score` 与 `score` 不能当成两个不同的名字。

在第一次使用变量前，先用**声明（declaration）**告诉读者它叫什么、里面准备放哪种数据：`DECLARE 名字 : 数据类型`。这一步只是准备位置，不是把一个值放进去。

> **规则**（CAIE 规定）　标识符以字母开头，只能含字母、数字和下划线；它们不区分大小写。变量声明写成 `DECLARE <identifier> : <data type>`（Pseudocode Guide §2.3、§2.4）。

**关卡**（single-choice）　下面哪个名字可以作为标识符？

- **A** 2ndPlayer
  - ✗ 不可以。标识符的第一个字符必须是字母，不能从数字开始。
- **B** Player Name
  - ✗ 不可以。空格会把它拆成两个部分；标识符中没有空格。
- **C** Player_Name2
  - ✓ 可以。它从字母开始，后面只用了字母、下划线和数字。
- **D** Player-Name
  - ✗ 不可以。连字符不是标识符允许使用的字符；需要分隔时可以用下划线。


---

## 2.2　六种基本类型

<sub>§10.1、G§2.1｜约 10 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`</sub>

**数据类型（data type）**说明一个位置可以放什么样的值。它让人一眼看出数据的含义，也让编辑器能阻止把不相配的值混在一起。

`INTEGER` 是整数，`REAL` 可以有小数部分；`CHAR` 恰好是一个字符，`STRING` 是零个或多个字符。`BOOLEAN` 只有 `TRUE` 和 `FALSE` 两种值；`DATE` 表示一个有效的日历日期。

类型不是变量名的一部分。`DECLARE Total : REAL` 的 `Total` 是你取的名字，`REAL` 才是在说明它能保存什么。先分清这两个位置，读声明就不会乱。

> **规则**（CAIE 规定）　基本数据类型是 `INTEGER`、`REAL`、`CHAR`、`STRING`、`BOOLEAN` 和 `DATE`（Pseudocode Guide §2.1）。

**示例：把不同的数据放进合适的位置**　`Example_2_2_a.pseudocode`

```
DECLARE Count : INTEGER
DECLARE Price : REAL
DECLARE Initial : CHAR
DECLARE Message : STRING
DECLARE Finished : BOOLEAN
DECLARE StartDate : DATE
OUTPUT "Enter the count"
INPUT Count
OUTPUT Count
```
- 1–2 行：数量通常用 `INTEGER`；可能带小数的价格用 `REAL`。
- 3–4 行：单个字母用 `CHAR`；一句文字或空文字用 `STRING`。
- 5–6 行：只有是或否的状态用 `BOOLEAN`；日历上的日期用 `DATE`。
- 7–9 行：输入前先显示提示。这里读入的内容会放进 `INTEGER` 类型的 `Count`。

示例运行（`>` 开头的那行是输入）：

```
Enter the count
> 12
12
```

**关卡**（single-choice）　要保存“这本书是否已经归还”，哪种类型最合适？

- **A** INTEGER
  - ✗ 整数适合数量或计数；这里需要表达的是两种状态，不是一个数。
- **B** BOOLEAN
  - ✓ 对。归还或未归还是两种状态，正好用 `TRUE` 或 `FALSE` 表示。
- **C** CHAR
  - ✗ 单个字符可以写出 Y 或 N，但那是在用字符代替状态；这里直接用布尔值更贴切。
- **D** DATE
  - ✗ 日期可以记录何时归还，但不能单独回答“是否已经归还”。


---

## 2.3　字面量怎样写

<sub>G§2.2｜约 8 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`</sub>

直接写在代码里的一个确定值叫**字面量（literal）**。`7` 是整数，`0.5` 是实数；实数的小数点两边都要有数字，所以写 `0.5`，不写 `.5`。

一个 `CHAR` 用单引号包起来，例如 `'A'`；一个 `STRING` 用双引号包起来，例如 `"Ada"`。空字符串也可以写，形式是 `""`。引号告诉读者这是文字，不是一个叫 Ada 的变量。

布尔值直接写 `TRUE` 或 `FALSE`。日期通常写成 `dd/mm/yyyy`，例如 `02/01/2028`；不同地方对日期次序的习惯不同，使用时要说明这里采用的格式。

> **规则**（CAIE 规定）　`CHAR` 用单引号，`STRING` 用双引号，`BOOLEAN` 写成 `TRUE` 或 `FALSE`；`REAL` 的小数点两边都至少有一位数字（Pseudocode Guide §2.2）。

**示例：同样是文字，引号表示的范围不同**　`Example_2_3_a.pseudocode`

```
OUTPUT 'A'
OUTPUT "Ada"
OUTPUT TRUE
OUTPUT 02/01/2028
```
- 第 1 行：`'A'` 是一个字符，所以用单引号。
- 第 2 行：`"Ada"` 是多个字符组成的字符串，所以用双引号。
- 3–4 行：布尔值不加引号；日期按日、月、年的次序写。

示例运行：

```
A
Ada
TRUE
02/01/2028
```

**关卡**（single-choice）　下面哪一个是只含一个字符的 `CHAR` 字面量？

- **A** "A"
  - ✗ 双引号包住的是 `STRING`；即使里面只有一个字符，它的类型仍是字符串。
- **B** 'A'
  - ✓ 对。单引号包住一个字符，就是 `CHAR` 字面量。
- **C** A
  - ✗ 没有引号的 A 会被读作一个名字，不是一个直接写出的字符值。
- **D** ""
  - ✗ 这是空字符串，里面没有任何字符；它属于 `STRING`，不是 `CHAR`。


---

## 2.4　赋值与初始化

<sub>§10.1、G§2.6｜约 9 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`、`assign.simple`</sub>

声明只是准备一个位置；把值放进去要用**赋值（assignment）**。写法是 `名字 ← 值`，箭头表示值从右边放到左边的变量里。这里不能用 `=`；`=` 留给后面 Chapter 3 的比较。

第一次给变量放入一个值叫**初始化（initialisation）**。例如 `Score ← 0` 让一个整数变量从零开始。变量必须先有值，才可以把它拿去 `OUTPUT` 或参与计算；只声明而没有赋值时，里面仍然是空的。

右边的值要和左边变量的数据类型相配。把 `"Ada"` 放进 `STRING` 可以；把一段文字放进 `INTEGER` 不行。编辑器会在真正运行前指出这种不相配。

> **规则**（CAIE 规定）　赋值写成 `<identifier> ← <value>`；左边必须是变量，右边的表达式必须得到相同的数据类型（Pseudocode Guide §2.6）。

> **规则**（编辑器约定）　本编辑器不会替没有赋值的变量猜一个默认内容；读取未初始化变量会停止运行并指出位置。

**示例：准备位置，再放入起始分数**　`Example_2_4_a.pseudocode`

```
DECLARE Score : INTEGER
Score ← 0
OUTPUT Score
```
- 第 1 行：先声明 `Score` 只能保存整数。
- 2–3 行：第 2 行完成初始化；因此第 3 行读取它时，已经有一个明确的值。

示例运行：

```
0
```

**关卡**（single-choice）　哪一行是在把整数变量 `Count` 初始化为零？

- **A** DECLARE Count : INTEGER
  - ✗ 这行只说明 Count 准备保存整数，还没有把任何整数放进去。
- **B** Count = 0
  - ✗ `=` 不是赋值箭头；本课程的赋值要清楚写出 `←`。
- **C** Count ← 0
  - ✓ 对。箭头把右边的整数零放进左边的 Count，正是第一次赋值。
- **D** OUTPUT Count
  - ✗ OUTPUT 是读取并显示现有的值；它不会替变量创建一个值。


### 小节题： 记录起始积分｜`2.4.1`

写一段伪代码：准备一个保存积分的整数变量，把它的起始值设为零，然后显示一行 `Points: 0`。

- **输入**：没有输入。
- **输出**：一行：`Points: 0`。冒号后有一个空格。
- **必须用** `assign.simple` — 本节练习的是先给变量一个值；只把零直接写进 OUTPUT 不能体现初始化。
- **必须用** `io.output-variable` — OUTPUT 要显示的是 Points 变量里的值，不能把 "Points: 0" 整句写成固定文字。

提示：
1. 先想清楚：变量里要保存的是一个没有小数的数量。
2. 把“准备位置”“放入零”“显示结果”按这个顺序写成三步。

题面示例：
```
输出：
Points: 0
```

<details><summary>参考解（学生看不到）</summary>

```
DECLARE Points : INTEGER
Points ← 0
OUTPUT "Points: ", Points
```

判题用例（对学生隐藏，失败时只显示 caseHint）：

- `normal` 程序不读输入，输出只有一种可能，所以只有这一组。

</details>

---

## 2.5　常量与不变的值

<sub>G§2.5｜约 7 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`、`assign.simple`、`decl.constant`</sub>

程序里有些值从开始到结束都不该改变，例如一周的天数。把这种值命名为**常量（constant）**，读代码的人就不用反复猜 `7` 代表什么。

常量写成 `CONSTANT 名字 = 字面量`，并且只能在这里给它一个直接写出的字面量。变量、另一个常量或一段计算都不能放在等号右边；常量一旦写好，后面也不能再赋新值。

判断时很简单：值会随着一次运行而改变，就用变量；它在这段程序中始终代表同一件事，就用常量。两者都要取清楚的名字。

> **规则**（CAIE 规定）　常量写成 `CONSTANT <identifier> = <value>`，右边只能是字面量；用有意义的名字代替字面量可以让伪代码更易读（Pseudocode Guide §2.5）。

**关卡**（single-choice）　下面哪一种情况最适合用常量？

- **A** 玩家本轮得到的分数
  - ✗ 分数会随着输入和计算变化，因此需要一个可重新赋值的变量。
- **B** 本程序采用的一周天数
  - ✓ 对。在同一次运行中它始终代表同一个固定值，给它一个名字会让代码更清楚。
- **C** 用户刚刚输入的姓名
  - ✗ 姓名来自输入，每次运行可能不同；它应保存在变量里。
- **D** 循环中不断累加的总数
  - ✗ 总数会反复改变。常量不能在后面被重新赋值。

**示例：用有意义的名字保存固定值**　`Example_2_5_a.pseudocode`

```
CONSTANT DaysInWeek = 7
OUTPUT "Days: ", DaysInWeek
```
- 第 1 行：常量在这一行给出名字和固定的字面量值。
- 第 2 行：之后可以读取它；名字说明了这里的 7 代表什么。

示例运行：

```
Days: 7
```

**反例：有些错误会在不同阶段被发现**

*把文字放进整数变量*
```
DECLARE Count : INTEGER
Count ← "twelve"
```
第 2 行右边是文字，左边却只能保存整数。编辑器在运行前就能发现这两边不相配。

- 错误（第 2 行）：这里需要整数，不能把一段文字放进 `Count`。

*重新给常量赋值*
```
CONSTANT DaysInWeek = 7
DaysInWeek ← 8
```
第 1 行已经给常量确定了值。第 2 行不能再改变它；这段代码也不会开始运行。

- 错误（第 2 行）：`DaysInWeek` 是常量，不能在后面重新赋值。

*声明后立刻读取*
```
DECLARE Name : STRING
OUTPUT Name
```
这段代码的写法本身没有问题，所以可以开始运行；但 `Name` 还没有内容，运行到第 2 行才会停止。

- 运行时（第 2 行，RT1003）：`Name` 还没有被赋值，不能显示它的内容。


---


## 章末大题： 显示一张分数卡｜`2.T1`

写一段伪代码：用一个常量保存及格线，用一个整数变量保存学生分数，然后显示两行分数卡。

- **输入**：没有输入。
- **输出**：两行：`Pass mark: 50` 和 `Score: 64`，两处冒号后各有一个空格。
- **建议用到**：`decl.constant`、`decl.variable`、`assign.simple`、`io.output`

提示：
1. 这两种数的角色不同：及格线固定，学生分数可以换。
2. 先分别准备固定值和可变位置，再给可变位置放入分数。
3. 每一行 OUTPUT 都由一段文字和一个保存的值拼起来。

题面示例：
```
输出：
Pass mark: 50
Score: 64
```

<details><summary>参考解（学生看不到）</summary>

```
CONSTANT PassMark = 50
DECLARE Score : INTEGER
Score ← 64
OUTPUT "Pass mark: ", PassMark
OUTPUT "Score: ", Score
```

判题用例（对学生隐藏，失败时只显示 caseHint）：

- `normal` 显示固定及格线和已经保存的分数。

</details>
