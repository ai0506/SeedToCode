# Chapter 4 — 选择  `[AS]`

对应 §11.2、G§6｜内容预览（不是最终版式，只是把数据平铺出来读）


---

## 4.1　`IF … THEN … ENDIF`

<sub>§11.2、G§6｜约 8 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`、`assign.simple`、`decl.constant`、`op.arithmetic`、`op.div`、`op.mod`、`op.relational`、`op.and`、`op.or`、`op.not`、`select.if`</sub>

前三章的程序，每一行都会执行。从上到下走一遍，一句不落。但很多事情要看情况才做：下雨才带伞，及格了才发证书。**选择（selection）**就是让一段代码只在条件成立时才执行。

写法是 `IF <条件> THEN`，接着写条件成立时要做的事，最后用 `ENDIF` 收尾。`IF` 后面那个用来决定走不走的式子叫**条件（condition）**，它就是第 3 章那种算出 `BOOLEAN` 的式子——`Score >= 50` 算出来是 `TRUE` 或 `FALSE`。

算出 `TRUE`，就执行 `THEN` 和 `ENDIF` 之间的部分；算出 `FALSE`，这一整段就跳过，程序从 `ENDIF` 后面接着走。

`ENDIF` 不是装饰，它划出「归这个条件管」的范围。范围里的每一行往右缩进三个空格——缩进在这里第一次真正有了意义：一眼就能看出哪几行是有条件的，哪几行是无论如何都会执行的。

> **规则**（CAIE 规定）　选择结构写作 `IF <condition> THEN … ENDIF`。条件必须是一个 `BOOLEAN` 表达式，结构体要缩进（Pseudocode Guide §6.1）。

**示例：及格才说一句**　`Example_4_1_a.pseudocode`

```
DECLARE Score : INTEGER
OUTPUT "Enter the score"
INPUT Score
IF Score >= 50 THEN
   OUTPUT "Passed"
ENDIF
OUTPUT "Done"
```
- 第 4 行：`Score >= 50` 是一次比较，它的结果是 `BOOLEAN`，正好能当条件。
- 第 5 行：缩进三格，表示它归上面那个条件管。
- 第 7 行：没有缩进，不在 `IF` 的范围里——不管及不及格，这一行都会执行。

示例运行（`>` 开头的那行是输入）：

```
Enter the score
> 72
Passed
Done
```

**关卡**（single-choice）　把上面那段代码的输入换成 40，屏幕上依次显示什么？

```
IF Score >= 50 THEN
   OUTPUT "Passed"
ENDIF
OUTPUT "Done"
```
- **A** 什么都没有
  - ✗ 跳过的只是 `IF` 管着的那一行。`OUTPUT "Done"` 没有缩进，不归它管。
- **B** 只有 Passed
  - ✗ 正好反了：条件不成立时跳过的恰恰是 `Passed` 那一行。
- **C** 只有 Done
  - ✓ 对。`40 >= 50` 算出 `FALSE`，`THEN` 和 `ENDIF` 之间那一行被整个跳过；`OUTPUT "Done"` 不在 `IF` 的范围里，照常执行。
- **D** Passed 和 Done
  - ✗ `Passed` 只在条件成立时才显示。40 不到 50，条件算出来是 `FALSE`。


---

## 4.2　`ELSE`：两条路走一条

<sub>§11.2、G§6｜约 9 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`、`assign.simple`、`decl.constant`、`op.arithmetic`、`op.div`、`op.mod`、`op.relational`、`op.and`、`op.or`、`op.not`、`select.if`、`select.if-else`</sub>

上一节的程序只在条件成立时做一件事，不成立就什么也不做。可现实里更常见的是「否则……」：及格就说 `Passed`，**否则**说 `Failed`。

`ELSE` 就是这个「否则」。写法是在 `IF` 的范围里先写成立时做的事，再写一行 `ELSE`，后面接不成立时做的事，最后仍然用一个 `ENDIF` 收尾。

两条分支**恰好走一条**：不会两条都走，也不会两条都不走。条件算出 `TRUE` 走上面，算出 `FALSE` 走下面，走完之后都从 `ENDIF` 之后继续。

整个结构只有一个 `ENDIF`，`ELSE` 后面不需要再写 `THEN`，也没有 `ENDELSE` 这种东西。`ELSE` 自己和 `IF`、`ENDIF` 对齐，归它管的行才缩进。

**对照：同一件事的三种写法**

同样一句「及格就说 Passed，否则说 Failed」，三种记法各自把什么写明、什么留给读者补。

*自然语言*
```
如果分数不低于 50，就显示 Passed，否则显示 Failed。
```
> 「否则」在这句话里可以省略不说，读的人自己会补上。程序不会自己补，`ELSE` 必须写出来。

*伪代码*
```
DECLARE Score : INTEGER
Score ← 55
IF Score >= 50 THEN
   OUTPUT "Passed"
ELSE
   OUTPUT "Failed"
ENDIF
```
> 结构的开头和结尾都是明写的：`IF` 开始，`ENDIF` 结束，`ELSE` 把中间切成两半。

*Python*
```python
score = 55
if score >= 50:
    print("Passed")
else:
    print("Failed")
```
> 同一个意思。Python 用冒号和缩进表示范围，没有 `ENDIF`——范围到哪儿结束全靠缩进。伪代码两样都要：缩进给人看，`ENDIF` 把范围写死。

**示例：两条路**　`Example_4_2_a.pseudocode`

```
DECLARE Score : INTEGER
OUTPUT "Enter the score"
INPUT Score
IF Score >= 50 THEN
   OUTPUT "Passed"
ELSE
   OUTPUT "Failed"
ENDIF
OUTPUT "Checked"
```
- 4–8 行：一个完整的选择结构。不管走哪条路，后面的 `Checked` 都会显示。
- 第 6 行：`ELSE` 自己不缩进，它和 `IF`、`ENDIF` 对齐；归它管的那一行才缩进。

示例运行（`>` 开头的那行是输入）：

```
Enter the score
> 50
Passed
Checked
```

**关卡**（single-choice）　`Size` 是 10 时，下面这段显示什么？

```
IF Size > 10 THEN
   OUTPUT "Big"
ELSE
   OUTPUT "Small"
ENDIF
```
- **A** Small
  - ✓ 对。`10 > 10` 算出 `FALSE`——`>` 要求严格大于，相等不算。条件不成立，走 `ELSE`。
- **B** Big
  - ✗ 要显示 `Big`，`Size` 得比 10 大。正好等于 10 时 `>` 给出的是 `FALSE`。
- **C** 两个都显示
  - ✗ `ELSE` 的两条分支恰好走一条。走了上面那条就不会再走下面那条。
- **D** 什么都不显示
  - ✗ 有 `ELSE` 时不存在「两条都不走」：条件的结果不是 `TRUE` 就是 `FALSE`，总有一条要走。


### 小节题： 奇数还是偶数｜`4.2.1`

写一段伪代码：提示并读入一个整数，判断它是奇数还是偶数并显示结果。

- **输入**：一行，一个 `INTEGER`。提示语排在读取之前，一字不差：
`Enter a number`
- **输出**：一行。偶数显示 `Even`，奇数显示 `Odd`。
- **必须用** `select.if-else` — 奇和偶把所有整数分成两半，没有第三种可能，正是两条路走一条。
- **必须用** `op.mod` — 判断能不能被 2 整除，要看的是余数，这就是 `MOD` 的用处。

提示：
1. 一个数能不能被 2 整除，看它除以 2 的余数就知道。
2. 余数只有两种结果，所以判断写成一次比较就够了，不需要把两种情况分别列出来。

题面示例：
```
输入：5
输出：
Enter a number
Odd
```

<details><summary>参考解（学生看不到）</summary>

```
DECLARE Number : INTEGER
OUTPUT "Enter a number"
INPUT Number
IF Number MOD 2 = 0 THEN
   OUTPUT "Even"
ELSE
   OUTPUT "Odd"
ENDIF
```

判题用例（对学生隐藏，失败时只显示 caseHint）：

- `normal` 输入 7 — 一个普通的奇数。
- `normal` 输入 12 — 一个普通的偶数。
- `boundary` 输入 0 — 零——它能被整除吗。
- `extreme` 输入 1000001 — 一个很大的数。

</details>

---

## 4.3　串接与嵌套

<sub>§11.2、G§6｜约 9 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`、`assign.simple`、`decl.constant`、`op.arithmetic`、`op.div`、`op.mod`、`op.relational`、`op.and`、`op.or`、`op.not`、`select.if`、`select.if-else`、`select.nested-if`</sub>

两条路不够用的时候很多：成绩要分 A、Pass、Fail 三档，就得先问一次，再在「否则」里接着问。办法是把下一个 `IF` 放进 `ELSE` 里。一个 `IF` 套在另一个 `IF` 里面，统称**嵌套（nested）**的选择结构，考纲里写作 nested IF；本节把套在 `ELSE` 里的这一种单独叫作串接，是因为它读起来是一串条件依次往下试。

串接的含义是：一串条件按顺序试，**第一个成立的那条就被走掉，后面的不再看**。90 分在第一个条件就停住了，根本不会走到第二个。

正因为是按顺序试的，**顺序不能乱排**。如果把 `Score >= 50` 放在前面，90 分会先撞上它显示 `Pass`，`>= 80` 那条永远轮不到。分档时要么从高往低排，要么从低往高排，不能交错。

有几个 `IF` 就要有几个 `ENDIF`，它们会叠在一起，里面那个关掉里层，外面那个关掉外层；CAIE 的伪代码里没有 `ELSEIF` 这样的合写形式，缩进一层比一层深是正常的。套在 `THEN` 里的那一种长得像但意思不同：它表示两个条件都要成立才做——和第 3 章的 `AND` 是一回事，能用 `AND` 写成一行时通常更清楚。两种都算 nested IF，区别只在套进了哪一支。

> **规则**（CAIE 规定）　嵌套的选择结构每一层都要自己的 `ENDIF`，每一层的结构体各缩进一级（Pseudocode Guide §6.1）。

**示例：三档成绩**　`Example_4_3_a.pseudocode`

```
DECLARE Score : INTEGER
OUTPUT "Enter the score"
INPUT Score
IF Score >= 80 THEN
   OUTPUT "A"
ELSE
   IF Score >= 50 THEN
      OUTPUT "Pass"
   ELSE
      OUTPUT "Fail"
   ENDIF
ENDIF
```
- 第 4 行：先试最高的那一档。成立就走掉，下面整个 `ELSE` 都不看了。
- 第 7 行：能走到这里，说明 `Score >= 80` 已经是 `FALSE` 了——所以这里只需要再问「够不够 50」，不必写成 `Score >= 50 AND Score < 80`。
- 11–12 行：两个 `ENDIF`。里层的关掉第 7 行那个 `IF`，外层的关掉第 4 行那个。

示例运行（`>` 开头的那行是输入）：

```
Enter the score
> 55
Pass
```

**关卡**（single-choice）　把上面两个条件对调，写成「先试 `Score >= 50`，`ELSE` 里再试 `Score >= 80`」。输入 90 会显示什么？

- **A** A
  - ✗ `>= 80` 被放进了 `ELSE` 里，只有第一个条件不成立时才轮得到它。90 让第一个条件成立了。
- **B** A 和 Pass 都显示
  - ✗ 一串 `IF … ELSE` 只会走一条路。走了 `THEN` 就不会再走 `ELSE`。
- **C** Fail
  - ✗ `Fail` 在最里面的 `ELSE` 里，要两个条件都不成立才走得到。
- **D** Pass
  - ✓ 对。串接是按顺序试的：90 撞上第一个 `Score >= 50` 就成立了，显示 `Pass` 之后整个结构结束，`>= 80` 那一条根本没机会被试到。


---

## 4.4　`CASE OF`：一个值对上多种情况

<sub>§11.2、G§6｜约 8 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`、`assign.simple`、`decl.constant`、`op.arithmetic`、`op.div`、`op.mod`、`op.relational`、`op.and`、`op.or`、`op.not`、`select.if`、`select.if-else`、`select.nested-if`、`select.case`</sub>

有一类判断长得很特别：所有分支都在问同一个变量，只是拿它去比不同的值。星期编号有七种可能，用串接 `IF` 写下来会缩进七层，而且 `Day =` 要重复七遍。

`CASE OF` 就是为这种情况准备的。写法是 `CASE OF <变量>` 起头，中间每一行写成 `<值> : <要做的事>`，最后用 `ENDCASE` 收尾——把「同一个值的多种可能」摆成一张表。

程序从上往下找第一条对得上的标签，执行它后面的语句，然后**整个 `CASE` 就结束了**，不会继续往下试别的标签。

如果一条都对不上，而且没有写下一节要讲的 `OTHERWISE`，那么这个 `CASE` 什么也不做，程序从 `ENDCASE` 后面继续。这不是错误，但多半不是你想要的结果。

> **规则**（CAIE 规定）　`CASE OF <identifier>` 开始，`ENDCASE` 结束；每个分支写成 `<标签> : <语句>`，标签用字面量（Pseudocode Guide §6.2）。

**示例：把数字变成星期名**　`Example_4_4_a.pseudocode`

```
DECLARE Day : INTEGER
OUTPUT "Enter the day number"
INPUT Day
CASE OF Day
   1 : OUTPUT "Monday"
   2 : OUTPUT "Tuesday"
   3 : OUTPUT "Wednesday"
ENDCASE
OUTPUT "Checked"
```
- 第 4 行：`CASE OF` 后面写要拿去比的那个变量，只写一次。
- 5–7 行：每一行是一个分支，冒号左边是标签，右边是对上之后要做的事。
- 第 9 行：不管有没有对上，这一行都会执行。

示例运行（`>` 开头的那行是输入）：

```
Enter the day number
> 3
Wednesday
Checked
```

**关卡**（single-choice）　给上面那段输入 9（这个 `CASE` 里没有 9 这个标签）会怎样？

- **A** 三条分支都执行
  - ✗ 正相反：`CASE` 最多只执行对上的那一条，执行完就结束。
- **B** 只显示 Checked
  - ✓ 对。一条标签都没对上，这个 `CASE` 什么也不做，程序从 `ENDCASE` 后面接着走。
- **C** 程序停下来报错
  - ✗ 没有匹配不是错误。要让「其它情况」也有着落，得自己写 `OTHERWISE`。
- **D** 显示 Monday
  - ✗ 没有「对不上就用第一条」这种规则。标签必须真的对上才会执行。


---

## 4.5　范围标签与 `OTHERWISE`

<sub>§11.2、G§6｜约 9 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`、`assign.simple`、`decl.constant`、`op.arithmetic`、`op.div`、`op.mod`、`op.relational`、`op.and`、`op.or`、`op.not`、`select.if`、`select.if-else`、`select.nested-if`、`select.case`、`select.case-range`、`select.case-otherwise`</sub>

标签不一定是一个孤零零的值，也可以是一个**范围**，用 `TO` 连起来：`80 TO 100 :`。落在这个区间里的值都算对上。成绩分档这种事，用范围标签写出来比串接 `IF` 短得多。

`OTHERWISE` 是兜底的那一条：前面所有标签都没对上时走它。加上它之后，`CASE` 就不会出现「什么也没做」的情况了。

`OTHERWISE` **必须放在最后**。这是规定，也讲得通：它的意思是「除此之外」，而「除此之外」只有在别的都列完之后才成立。放错位置编辑器会直接拦下来。

范围标签同样是从上往下试第一个对上的，所以区间不要互相重叠——重叠时后面那条永远轮不到，这和上一节串接 `IF` 的顺序问题是同一回事。

> **规则**（CAIE 规定）　标签可以写成 `<下限> TO <上限>` 的范围；`OTHERWISE` 分支如果存在，必须是最后一个（Pseudocode Guide §6.2）。

**示例：用范围分档**　`Example_4_5_a.pseudocode`

```
DECLARE Score : INTEGER
OUTPUT "Enter the score"
INPUT Score
CASE OF Score
   80 TO 100 : OUTPUT "A"
   50 TO 79 : OUTPUT "Pass"
   OTHERWISE : OUTPUT "Fail"
ENDCASE
```
- 5–6 行：两个区间接在一起但不重叠——79 归第二条，80 归第一条。
- 第 7 行：`OTHERWISE` 收下剩下的全部，包括 0 到 49，也包括 101 这种不该出现的值。

示例运行（`>` 开头的那行是输入）：

```
Enter the score
> 73
Pass
```

**反例：`OTHERWISE` 放在了中间**

```
DECLARE Score : INTEGER
Score ← 90
CASE OF Score
   OTHERWISE : OUTPUT "Fail"
   80 TO 100 : OUTPUT "A"
ENDCASE
```
编辑器在第 5 行拦下来：`OTHERWISE` 后面又跟了一个分支。这一条不用等运行——光看结构就知道那一条永远没机会被试到。

- 错误（第 5 行）：`OTHERWISE` 必须是最后一个分支。

**关卡**（single-choice）　把示例里 `50 TO 79` 那条挪到 `80 TO 100` 前面，输入 90 会显示什么？

- **A** 编辑器会拦下来
  - ✗ 分支的先后顺序没有规定，只有 `OTHERWISE` 的位置有规定。
- **B** A
  - ✓ 对。90 不落在 `50 TO 79` 里，所以第一条不成立，继续往下试，对上了 `80 TO 100`。这一次调换顺序没出问题，是因为两个区间不重叠——重叠时才会出现「后面那条永远轮不到」。
- **C** Pass
  - ✗ 90 不在 50 到 79 里。范围标签要真的落在区间内才算对上，顺序影响的是「谁先被试」，不是「谁能被对上」。
- **D** Fail
  - ✗ `OTHERWISE` 只在所有标签都没对上时才走。90 会先对上某一条。


### 小节题： 星期几｜`4.5.1`

写一段伪代码：提示并读入一个整数，1 到 7 分别显示 `Monday` 到 `Sunday`，其它任何值显示 `Unknown`。

- **输入**：一行，一个 `INTEGER`。提示语排在读取之前，一字不差：
`Enter the day number`
- **输出**：一行，星期名或者 `Unknown`。
- **必须用** `select.case` — 七种可能都是拿同一个变量比不同的值，这正是 `CASE` 摆一张表的场合。
- **必须用** `select.case-otherwise` — 「其它任何值」不可能一个个列出来，要交给兜底的那一条。
- **不能用** `select.if` — 用串接 `IF` 也能做对，但这一题就是要练 `CASE`——七种可能用 `IF` 会写成七层。

提示：
1. 七个分支加一条兜底，一共八行。
2. 「其它任何值」包括 0、8、-3 这些，不用一个个列。

题面示例：
```
输入：5
输出：
Enter the day number
Friday
```

<details><summary>参考解（学生看不到）</summary>

```
DECLARE Day : INTEGER
OUTPUT "Enter the day number"
INPUT Day
CASE OF Day
   1 : OUTPUT "Monday"
   2 : OUTPUT "Tuesday"
   3 : OUTPUT "Wednesday"
   4 : OUTPUT "Thursday"
   5 : OUTPUT "Friday"
   6 : OUTPUT "Saturday"
   7 : OUTPUT "Sunday"
   OTHERWISE : OUTPUT "Unknown"
ENDCASE
```

判题用例（对学生隐藏，失败时只显示 caseHint）：

- `normal` 输入 3 — 一个落在周中的日子。
- `normal` 输入 6 — 一个落在周末的日子。
- `boundary` 输入 1 — 编号里最小的那一个。
- `boundary` 输入 7 — 编号里最大的那一个。
- `abnormal` 输入 0 — 刚好比最小的还小一点，属于没有定义的编号。
- `extreme` 输入 999 — 一个远远超出范围的编号。

</details>

---

## 4.6　`IF` 还是 `CASE`

<sub>§11.2、G§6｜约 7 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`、`assign.simple`、`decl.constant`、`op.arithmetic`、`op.div`、`op.mod`、`op.relational`、`op.and`、`op.or`、`op.not`、`select.if`、`select.if-else`、`select.nested-if`、`select.case`、`select.case-range`、`select.case-otherwise`</sub>

两种结构常常都写得出来，但各有各顺手的场合。判据只有一条：**看这些分支是不是都在拿同一个东西比不同的值。**

是的话用 `CASE`：星期编号、菜单选项、成绩区间——一个变量，多种取值，一张表摆得清清楚楚。

不是的话用 `IF`：条件里用到了两个不同的变量、条件是几个判断用 `AND` / `OR` / `NOT` 拼起来的、或者每个分支比的根本不是同一个东西。这些 `CASE` 都写不了——它的标签只能是值或区间，放不进一个完整的条件。

两种都写得出来时，选读起来更清楚的那个。三档以上又都在比同一个变量，`CASE` 一般会短很多；只有两条路，`IF … ELSE` 更直接。

**关卡**（single-choice）　下面哪种情况**只能**用 `IF`，不能用 `CASE`？

- **A** 按 1 到 12 的月份编号显示月份名
  - ✗ 同一个变量比十二个不同的值，`CASE` 正合适，比十二层 `IF` 清楚得多。
- **B** 按 0 到 100 的分数分成四档
  - ✗ 同一个变量比四个区间，用范围标签的 `CASE` 写得下。
- **C** 按三个字母分别显示不同的话
  - ✗ 同一个变量比三个字符字面量，`CASE` 写得下——标签写成 `'A' :` 就行。
- **D** 年龄够 18 岁并且买了票才放行
  - ✓ 对。这个条件用到了两个不同的东西，还得用 `AND` 拼起来。`CASE` 的标签只能是值或区间，装不下一个完整的条件。


---


## 章末大题： 电影票｜`4.T1`

写一段伪代码：读入观众的年龄和星期几，算出票价，显示三行票面信息。年龄分档是不满 12 岁 `Child` 票价 20、12 到 59 岁 `Adult` 票价 45、60 岁及以上 `Senior` 票价 25；星期 1 到 5 是 `Weekday`、6 到 7 是 `Weekend`、其它数字是 `Unknown`；`Weekday` 的票价减 5，其余不减。

- **输入**：两行。第一行是年龄（`INTEGER`），第二行是星期编号（`INTEGER`，1 表示周一，7 表示周日）。
两句提示语各自排在它对应的那次读取之前，一字不差：
`Enter the age`
`Enter the day`
- **输出**：读完之后显示三行：
`Age group: <Child 或 Adult 或 Senior>`
`Day type: <Weekday 或 Weekend 或 Unknown>`
`Price: <票价>`
每个冒号后面都是一个空格。
- **建议用到**：`select.if`、`select.if-else`、`select.nested-if`、`select.case`、`select.case-range`、`select.case-otherwise`、`op.relational`、`io.input`、`io.output`

提示：
1. 这道题里有两个判断：一个在比年龄区间，一个在比星期编号。它们适合的结构不一样，4.6 的判据能直接用上。
2. 票价先按年龄定好，再看要不要减 5——不要试图在一个结构里同时处理两件事。
3. 星期分类的结果后面还要用来决定减不减价，所以它得存进一个变量，不能只是显示出来。

题面示例：
```
输入：8 / 3
输出：
Enter the age
Enter the day
Age group: Child
Day type: Weekday
Price: 15
```

<details><summary>参考解（学生看不到）</summary>

```
DECLARE Age : INTEGER
DECLARE Day : INTEGER
DECLARE Price : INTEGER
DECLARE AgeGroup : STRING
DECLARE DayType : STRING
OUTPUT "Enter the age"
INPUT Age
OUTPUT "Enter the day"
INPUT Day
IF Age < 12 THEN
   AgeGroup ← "Child"
   Price ← 20
ELSE
   IF Age < 60 THEN
      AgeGroup ← "Adult"
      Price ← 45
   ELSE
      AgeGroup ← "Senior"
      Price ← 25
   ENDIF
ENDIF
CASE OF Day
   1 TO 5 : DayType ← "Weekday"
   6 TO 7 : DayType ← "Weekend"
   OTHERWISE : DayType ← "Unknown"
ENDCASE
IF DayType = "Weekday" THEN
   Price ← Price - 5
ENDIF
OUTPUT "Age group: ", AgeGroup
OUTPUT "Day type: ", DayType
OUTPUT "Price: ", Price
```

判题用例（对学生隐藏，失败时只显示 caseHint）：

- `normal` 输入 30 / 2 — 一个成年人在周中看电影。
- `normal` 输入 8 / 6 — 一个孩子在周末看电影。
- `boundary` 输入 12 / 5 — 年龄正好踩在孩子和成人的分界上。
- `boundary` 输入 60 / 7 — 年龄正好踩在成人和长者的分界上，而且是周末的最后一天。
- `boundary` 输入 11 / 1 — 年龄差一点就到成人档，日子是周中的第一天。
- `abnormal` 输入 25 / 9 — 星期编号超出了定义的范围。
- `extreme` 输入 120 / 1 — 一个非常大的年龄。

</details>
