# Chapter 7 — 字符串与内置函数  `[AS]`

对应 `§11.1`、`G§5.5`、`G§5.6`｜内容草稿（只有文字，尚未写成 `chapter-07.ts`，也没有接入判题）

**小节划分**：考纲草案的 8 个点合并为 6 节。原 7.2（`LENGTH`）和 7.3（`MID`、`RIGHT`）合为本版 7.2——三个函数都在回答「这段文字里有什么」，分开讲要重复同一段铺垫。原 7.7（在表达式里用函数）和 7.8（Guide 之外的函数）合为本版 7.6。

| 小节 | 标题 | 约 |
|---|---|---|
| 7.1 | `CHAR` 与 `STRING`：两种文字 | 8 分钟 |
| 7.2 | `LENGTH`、`MID`、`RIGHT`：把文字拆开 | 10 分钟 |
| 7.3 | `UCASE` 与 `LCASE`：只认单个字符 | 8 分钟 |
| 7.4 | 用 `&` 把文字接起来 | 8 分钟 |
| 7.5 | `INT` 与 `RAND` | 8 分钟 |
| 7.6 | 函数是表达式的一部分 | 7 分钟 |
| 7.T1 | 章末大题：产品编号 | — |

---

## 7.1　`CHAR` 与 `STRING`：两种文字

第 2 章列过六种基本类型，其中有两种是文字：`CHAR` 和 `STRING`。它们的区别看起来很小，实际上很硬。

- `CHAR` 是**恰好一个字符**，字面量写在**单引号**里：`'A'`、`'7'`、`' '`。
- `STRING` 是**一串字符**，可以是零个、一个或很多个，字面量写在**双引号**里：`"A"`、`"Hello"`、`""`。

关键在于：**`"A"` 和 `'A'` 不是同一个东西。** 前者是长度为 1 的 `STRING`，后者是 `CHAR`。它们长得一模一样，类型却不同，所以不能互相赋值，也不能直接比较——编辑器会在运行前就拦下来。

这条规矩有点严，但它是有用的：两类函数要的东西不一样。`LENGTH`、`MID`、`RIGHT` 只收 `STRING`，`UCASE`、`LCASE` 只收 `CHAR`。搞清楚手里拿的是哪一种，才知道能对它做什么。

`INPUT` 读进来的是哪一种，由变量的声明决定：`DECLARE C : CHAR` 后面的 `INPUT C` 只接受恰好一个字符，多打一个就会被退回来。

> **规则**（CAIE 规定）　`CHAR` 用单引号，恰好一个字符；`STRING` 用双引号，长度不限。两者是不同的类型（Pseudocode Guide §5.5）。

**反例：把长度为 1 的 `STRING` 当成 `CHAR`**

```
DECLARE C : CHAR
DECLARE S : STRING
S ← "a"
C ← S
OUTPUT C
```

编辑器在第 4 行就拦下来：不能把 `STRING` 赋给 `CHAR`。`"a"` 里只有一个字母，看着和 `'a'` 没差别，但它的类型是 `STRING`。

同样的道理，下面这段也过不去：

```
DECLARE C : CHAR
C ← 'a'
IF C = "a" THEN
   OUTPUT "same"
ENDIF
```

第 3 行的比较两边一边是 `CHAR` 一边是 `STRING`，类型对不上。要比就两边都用单引号：`C = 'a'`。

**关卡**（单选）　`DECLARE Letter : CHAR` 之后，哪一行是对的？

- **A**　`Letter ← "B"`
  - ✗ 双引号里的是 `STRING`，哪怕只有一个字母。`CHAR` 变量只收 `CHAR`。
- **B**　`Letter ← 'B'`
  - ✓ 对。单引号、恰好一个字符，这就是一个 `CHAR` 字面量。
- **C**　`Letter ← 'AB'`
  - ✗ 单引号里只能放一个字符。两个字符要用双引号，而那就是 `STRING` 了。
- **D**　`Letter ← B`
  - ✗ 不加引号的 `B` 会被当成一个变量名，而不是字母 B 本身。

---

## 7.2　`LENGTH`、`MID`、`RIGHT`：把文字拆开

**函数（function）**是一段写好的、能算出一个值的东西。你给它一些值，它还你一个值。写法是函数名加圆括号，括号里是要给它的值：`LENGTH(Name)`。

函数**算出来的值要用掉**——赋给一个变量，或者直接 `OUTPUT`。单独写一行 `LENGTH(Name)` 没有意义，那个值算完就丢了。

这一节的三个函数都在回答「这段文字里有什么」：

| 函数 | 给它什么 | 还你什么 |
|---|---|---|
| `LENGTH(S)` | 一个 `STRING` | 它有几个字符，是 `INTEGER` |
| `MID(S, Start, Count)` | 一个 `STRING` 和两个 `INTEGER` | 从第 `Start` 个字符开始、取 `Count` 个，是 `STRING` |
| `RIGHT(S, Count)` | 一个 `STRING` 和一个 `INTEGER` | 最后 `Count` 个字符，是 `STRING` |

`MID` 的起点**从 1 开始数**，不是从 0。`MID("Computer", 1, 3)` 给出 `"Com"`。

**Pseudocode Guide 里没有 `LEFT`。** 要取开头的几个字符，用 `MID(S, 1, n)`——起点是 1，取 n 个，效果一样。写 `LEFT(...)` 编辑器会说找不到这个名字。

取的范围超出文字本身时，程序会在那一行停下来：`MID("abc", 5, 1)` 从第 5 个字符开始取，可 `"abc"` 只有 3 个。这种错静态检查看不出来——起点是多少要跑起来才知道。

> **规则**（CAIE 规定）　`LENGTH(ThisString : STRING) RETURNS INTEGER`；`MID(ThisString : STRING, x : INTEGER, y : INTEGER) RETURNS STRING`，从第 `x` 个字符起取 `y` 个；`RIGHT(ThisString : STRING, x : INTEGER) RETURNS STRING`（Pseudocode Guide §5.6）。

**示例：拆开一个单词**

```
DECLARE Word : STRING
Word ← "Computer"
OUTPUT "Length: ", LENGTH(Word)
OUTPUT "First three: ", MID(Word, 1, 3)
OUTPUT "Middle two: ", MID(Word, 4, 2)
OUTPUT "Last three: ", RIGHT(Word, 3)
```

- 第 3 行：`LENGTH` 还回来的是 `INTEGER`，可以直接跟在 `OUTPUT` 的逗号后面显示。
- 第 4 行：起点 1、取 3 个，这就是「开头三个字符」的写法。
- 第 5 行：起点 4、取 2 个——`C` `o` `m` 是 1、2、3，所以第 4 个是 `p`。
- 第 6 行：`RIGHT` 从右边数，不用管总长度是多少。

运行实录：

```
Length: 8
First three: Com
Middle two: pu
Last three: ter
```

**关卡**（单选）　`MID("Pseudocode", 3, 4)` 的结果是什么？

- **A**　`"eudo"`
  - ✓ 对。从第 3 个字符开始数：`P` 是 1、`s` 是 2、`e` 是 3。从 `e` 起取 4 个，是 `e` `u` `d` `o`。
- **B**　`"seud"`
  - ✗ 这是从第 2 个字符开始取的结果。`MID` 的起点从 1 数起，第 3 个不是 `s`。
- **C**　`"udoc"`
  - ✗ 这是从第 4 个开始取的。把起点当成「跳过 3 个」就会错一位。
- **D**　`"Pseu"`
  - ✗ 这是 `MID(S, 1, 4)`——开头四个字符。第二个参数是起点，不是个数。

### 小节题：首字母与后缀｜`7.2.1`

写一段伪代码：提示并读入一个单词，显示它的长度、开头两个字符和末尾三个字符。

- **输入**：一行，一个 `STRING`（保证至少 5 个字符）。提示语排在读取之前，一字不差：`Enter a word`。
- **输出**：三行：
  `Length: <长度>`
  `Head: <开头两个字符>`
  `Tail: <末尾三个字符>`
- **必须用** `LENGTH`、`MID`、`RIGHT`。
- **不要用** `LEFT`——Guide 里没有这个函数。

提示：
1. 「开头两个」用 `MID`，起点写 1。
2. 「末尾三个」用 `RIGHT`，不需要先算长度。

示例：输入 `Monday`，显示 `Length: 6`、`Head: Mo`、`Tail: day`。

---

## 7.3　`UCASE` 与 `LCASE`：只认单个字符

这两个函数管大小写：`UCASE` 把字符变成大写，`LCASE` 变成小写。不是字母的字符（数字、空格、标点）原样还回来。

要紧的是它们的类型：**两个函数都只收 `CHAR`，也只还 `CHAR`**。这就是 7.1 那条规矩真正开始起作用的地方。

所以下面这种写法是不成立的：

```
DECLARE S : STRING
S ← "abc"
OUTPUT UCASE(S)
```

`S` 是 `STRING`，而 `UCASE` 要的是 `CHAR`，编辑器在第 3 行拦下来。

也许你会想：那先用 `MID` 取出一个字符再转不就行了？——`MID` 还回来的是 `STRING`，哪怕只取一个字符。所以 `UCASE(MID(S, 1, 1))` 同样过不去。**在 Guide 的这套函数里，没有办法把一个长度为 1 的 `STRING` 变成 `CHAR`。**

这不是编辑器的限制，是 Pseudocode Guide 就这么定的。实际能用上 `UCASE` / `LCASE` 的场合，是手里本来就有一个 `CHAR`：`CHAR` 字面量，或者 `INPUT` 进一个 `CHAR` 变量——比如让用户输入 `Y` 或 `N`，不管他打的是大写还是小写，先统一转成大写再比较。

> **规则**（CAIE 规定）　`UCASE(ThisChar : CHAR) RETURNS CHAR`；`LCASE(ThisChar : CHAR) RETURNS CHAR`。两者都只处理单个字符（Pseudocode Guide §5.6）。

**示例：不管用户打大写还是小写**

```
DECLARE Answer : CHAR
OUTPUT "Continue? Enter Y or N"
INPUT Answer
IF UCASE(Answer) = 'Y' THEN
   OUTPUT "Going on"
ELSE
   OUTPUT "Stopped"
ENDIF
```

- 第 3 行：`Answer` 声明成 `CHAR`，所以读进来的就是一个字符。
- 第 4 行：先转成大写再比。这样 `y` 和 `Y` 都能通过，不用写两个条件。
- 第 4 行的比较两边都是 `CHAR`：左边是 `UCASE` 还回来的 `CHAR`，右边是单引号的 `'Y'`。

输入 `y` 时的运行实录：

```
Continue? Enter Y or N
> y
Going on
```

**关卡**（单选）　`DECLARE S : STRING` 且 `S ← "hello"`，下面哪一行能通过检查？

- **A**　`OUTPUT UCASE(S)`
  - ✗ `S` 是 `STRING`，`UCASE` 只收 `CHAR`。
- **B**　`OUTPUT UCASE(MID(S, 1, 1))`
  - ✗ 看着像绕开了，其实没有：`MID` 还回来的是 `STRING`，哪怕只有一个字符。
- **C**　`OUTPUT UCASE('h')`
  - ✓ 对。`'h'` 是单引号写的 `CHAR` 字面量，正是 `UCASE` 要的东西。
- **D**　`OUTPUT UCASE("h")`
  - ✗ 双引号里的是 `STRING`。这一处差别在这两个函数上是硬性的。

---

## 7.4　用 `&` 把文字接起来

`&` 把两段 `STRING` 接成一段：`"Hello" & " " & "World"` 得到 `"Hello World"`。这叫**连接（concatenation）**。

它和 `OUTPUT` 的逗号看起来效果差不多，但做的是两件事：

- `&` 造出**一个新的 `STRING`**，可以赋给变量、继续接、传给函数。
- `OUTPUT A, B, C` 只是把几个值挨着显示出来，没有造出任何新值。

所以要「显示一句话」两种都行；要「把拼好的东西存起来待会儿用」，只能用 `&`。

`&` 的两边都必须是 `STRING`。`"n=" & 5` 是不成立的——5 是 `INTEGER`，编辑器会拦下来。**要显示数字，用 `OUTPUT` 的逗号形式**，那里什么类型都收。

在循环里一点点接出一段文字是常见做法：先把变量设成空串 `""`，每一遍接上一小段。

> **规则**（CAIE 规定）　`&` 是字符串连接运算符，两边都必须是 `STRING`（Pseudocode Guide §5.5）。

**示例：两种写法各自的用处**

```
DECLARE First : STRING
DECLARE Last : STRING
DECLARE Full : STRING
DECLARE Count : INTEGER
First ← "Ada"
Last ← "Lovelace"
Count ← 2
Full ← First & " " & Last
OUTPUT "Name: ", Full
OUTPUT "Words: ", Count
```

- 第 8 行：`&` 把三段接成一个新的 `STRING`，存进 `Full`。存下来之后还能再用。
- 第 9 行：逗号形式，只负责显示。
- 第 10 行：`Count` 是 `INTEGER`，只能走逗号这条路——写成 `"Words: " & Count` 会被拦下来。

运行实录：

```
Name: Ada Lovelace
Words: 2
```

**示例：在循环里接出一行星号**

```
DECLARE I : INTEGER
DECLARE Bar : STRING
Bar ← ""
FOR I ← 1 TO 5
   Bar ← Bar & "*"
NEXT I
OUTPUT Bar
```

- 第 3 行：从空串开始。不先设空串，`Bar` 就没有值可以接。
- 第 5 行：每一遍在原来的基础上接一个星号。
- 第 7 行：显示放在循环外面，所以只显示最后接好的那一整条。

运行实录：

```
*****
```

**关卡**（单选）　`DECLARE N : INTEGER` 且 `N ← 7`，想显示 `Score: 7`，下面哪一行能通过检查？

- **A**　`OUTPUT "Score: " & N`
  - ✗ `&` 两边都得是 `STRING`，`N` 是 `INTEGER`。
- **B**　`OUTPUT "Score: ", N`
  - ✓ 对。`OUTPUT` 的逗号形式对类型没有要求，数字直接显示出来。
- **C**　`OUTPUT "Score: " & "N"`
  - ✗ 这能通过检查，但显示的是 `Score: N` 这几个字母——引号里的 `N` 是文字本身，不是变量的值（第 1 章讲过）。
- **D**　`OUTPUT "Score: " + N`
  - ✗ `+` 是加法，不是连接。接文字用 `&`，而这里连 `&` 都不该用。

---

## 7.5　`INT` 与 `RAND`

除了处理文字，Guide 还给了两个处理数字的函数。

`INT(x)` 把一个 `REAL` 变成 `INTEGER`，做法是**直接砍掉小数部分**，不是四舍五入。`INT(7.9)` 是 7，不是 8；`INT(-7.9)` 是 -7。这正好和第 3 章的 `DIV` 对上：`7 DIV 2` 和 `INT(7 / 2)` 都是 3。

`RAND(x)` 给出一个随机的 `REAL`，范围是 0（含）到 `x`（不含）。参数是 `INTEGER`。

因为 `RAND` 还回来的是 `REAL`，想要一个随机整数就得配合 `INT`。掷骰子（1 到 6）的写法是 `INT(RAND(6)) + 1`：`RAND(6)` 给 0 到 5.999…，砍掉小数得到 0 到 5，再加 1 就是 1 到 6。

用了 `RAND` 的程序**每次跑的结果都不一样**，所以这类题目不会去比对具体输出，只会看范围和写法。

> **规则**（CAIE 规定）　`INT(x : REAL) RETURNS INTEGER`，取整数部分；`RAND(x : INTEGER) RETURNS REAL`，返回 0 到 x 之间的随机实数（Pseudocode Guide §5.6）。

**示例：取整不是四舍五入**

```
DECLARE A : INTEGER
DECLARE B : INTEGER
DECLARE C : INTEGER
A ← INT(7.9)
B ← INT(7.1)
C ← INT(7 / 2)
OUTPUT "A: ", A
OUTPUT "B: ", B
OUTPUT "C: ", C
```

- 第 4–5 行：7.9 和 7.1 砍掉小数都是 7。`INT` 不看小数部分有多大。
- 第 6 行：`7 / 2` 是 `3.5`（第 3 章：`/` 的结果永远是 `REAL`），砍掉小数是 3。

运行实录：

```
A: 7
B: 7
C: 3
```

**关卡**（单选）　想得到一个 1 到 10 之间的随机整数，该怎么写？

- **A**　`RAND(10)`
  - ✗ `RAND` 还回来的是 `REAL`，比如 3.7。而且它可能是 0，不到 1。
- **B**　`INT(RAND(10))`
  - ✗ 取整之后是 0 到 9，差了一位——`RAND(10)` 取不到 10，砍掉小数最大只到 9。
- **C**　`INT(RAND(10)) + 1`
  - ✓ 对。`RAND(10)` 给 0 到 9.999…，取整得 0 到 9，加 1 正好是 1 到 10。
- **D**　`INT(RAND(11))`
  - ✗ 范围是 0 到 10，个数对了但起点不对——会出现 0。

---

## 7.6　函数是表达式的一部分

到这里，七个函数都见过了。最后要说清楚它们**放在哪里**。

函数调用**算出来一个值**，所以凡是需要一个值的地方，都可以放一个函数调用：

- 赋值的右边：`N ← LENGTH(Word)`
- `OUTPUT` 的一项：`OUTPUT "Length: ", LENGTH(Word)`
- 条件里：`IF LENGTH(Word) > 3 THEN`
- 循环的终点：`FOR I ← 1 TO LENGTH(Word)`
- 另一个函数的参数里：`INT(RAND(6))`
- 和运算符混在一起：`RIGHT(Code, LENGTH(Code) - 2)`

最后那一行值得多看一眼：括号里是一个算式，先算出 `LENGTH(Code) - 2`，再把结果交给 `RIGHT`。**参数不必是写死的数字，可以是任何算得出值的表达式。**

反过来，函数调用**不能单独成为一条语句**。写一行 `LENGTH(Word)`，算是算出来了，但没人接着，这个值就丢了。

本编辑器实现的就是 Guide 列出的这七个：`LENGTH`、`MID`、`RIGHT`、`UCASE`、`LCASE`、`INT`、`RAND`。别的名字（比如 `LEFT`、`ROUND`）都会被当成没有声明的名称。真题里偶尔会出现 Guide 之外的函数，那种情况下题目会把它的定义一起给出来。

**示例：函数嵌在各种位置**

```
DECLARE Code : STRING
DECLARE Tail : STRING
Code ← "AB1234"
IF LENGTH(Code) > 4 THEN
   Tail ← RIGHT(Code, LENGTH(Code) - 2)
   OUTPUT "Tail: ", Tail
   OUTPUT "Tail length: ", LENGTH(Tail)
ENDIF
```

- 第 4 行：函数调用当条件的一半，它算出的 `INTEGER` 再拿去比较。
- 第 5 行：`LENGTH(Code) - 2` 先算成 4，再交给 `RIGHT` 当第二个参数。
- 第 7 行：对刚算出来的 `Tail` 再调用一次 `LENGTH`。

运行实录：

```
Tail: 1234
Tail length: 4
```

**关卡**（单选）　下面哪一行是**不成立**的？

- **A**　`FOR I ← 1 TO LENGTH(Word)`
  - ✗ 成立。`LENGTH` 算出 `INTEGER`，正好能当循环的终点。
- **B**　`IF MID(Code, 1, 1) = "A" THEN`
  - ✗ 成立。`MID` 还回来的是 `STRING`，右边 `"A"` 也是 `STRING`，两边类型对得上。
- **C**　`LENGTH(Word)`（单独占一行）
  - ✓ 就是这一行。函数算出了一个值，但没有赋给谁、也没有显示出来，这个值无处可去，所以它不能单独成为一条语句。
- **D**　`OUTPUT MID(Code, 1, LENGTH(Code) - 2)`
  - ✗ 成立。参数可以是算式，先算完再交给函数。

---

## 章末大题：产品编号｜`7.T1`

写一段伪代码：读入一个产品编号和一个等级字母，把编号拆开显示。

**输入**：两行。第一行是产品编号（`STRING`，格式是两个字母加若干数字，比如 `AB1234`，保证至少 3 个字符）。第二行是等级（`CHAR`，一个字母，大小写都可能）。两句提示语各自排在它对应的那次读取之前，一字不差：

```
Enter the code
Enter the grade
```

**输出**：读完之后显示五行：

```
Length: <编号的长度>
Prefix: <编号的前两个字符>
Number: <前两个字符之后的全部内容>
Tag: <前缀>-<数字部分>
Grade: <等级字母的大写>
```

每个冒号后面都是一个空格；`Tag` 那一行的两段中间是一个减号，没有空格。

**建议用到**：`LENGTH`、`MID`、`RIGHT`、`UCASE`、`&`、`INPUT`、`OUTPUT`。

**提示**：
1. 「前两个字符之后的全部内容」有几个字符，取决于编号有多长——先想清楚这个数怎么算出来，再决定用哪个函数取。
2. `Tag` 那一行要的是**一个拼好的 `STRING`**，不是三样东西挨着显示，所以这里该用 `&`。
3. 等级是 `CHAR`，编号是 `STRING`，两者能用的函数不一样，声明的时候就要分清。

**示例**：输入 `AB1234`、`a`，显示

```
Length: 6
Prefix: AB
Number: 1234
Tag: AB-1234
Grade: A
```
