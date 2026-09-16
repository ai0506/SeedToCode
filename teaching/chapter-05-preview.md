# Chapter 5 — 三种循环  `[AS]`

对应 §11.2、G§7｜内容预览（不是最终版式，只是把数据平铺出来读）


---

## 5.1　`FOR … TO … NEXT`：次数已经知道

<sub>§11.2、G§7｜约 9 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`、`assign.simple`、`decl.constant`、`op.arithmetic`、`op.div`、`op.mod`、`op.relational`、`op.and`、`op.or`、`op.not`、`select.if`、`select.if-else`、`select.nested-if`、`select.case`、`select.case-range`、`select.case-otherwise`、`loop.for`</sub>

要把同一句话显示五遍，照抄五行 `OUTPUT` 也做得到。但要显示一百遍呢？要改其中一个字呢——得改一百处。**重复（iteration）**让同一段代码跑多次，代码只写一份。

次数事先就知道的时候用 `FOR`。这种「数着遍数跑」的循环叫**计数控制循环（count-controlled loop）**：写成 `FOR <控制变量> ← <起点> TO <终点>`，中间是要重复做的事，最后用 `NEXT <控制变量>` 收尾。

`FOR I ← 1 TO 5` 的意思是：`I` 先取 1 跑一遍循环体，回到 `NEXT` 时 `I` 加 1 变成 2，再跑一遍……直到 `I` 超过 5 就停下来。起点和终点都算在内，所以 `FOR I ← 2 TO 5` 跑的是 2、3、4、5 共四遍——**终点减起点再加一**。

那个数着遍数的变量叫**控制变量（control variable）**，也叫**循环计数器（loop counter）**。它必须是 `INTEGER`，而且**不用事先声明**——`FOR` 那一行本身就把它建立起来了。

`NEXT` 后面要把变量名再写一遍。不写也跑得动，但嵌套循环里写上了才看得出哪个 `NEXT` 收的是哪个 `FOR`。

> **规则**（CAIE 规定）　计数控制循环写作 `FOR <identifier> ← <start> TO <end> … NEXT <identifier>`——语法里 `NEXT` 后面是带变量名的，指南的六个 FOR 示例也都写了；「重复写一遍」被称为 good practice，尤其在嵌套循环里。控制变量必须是 `INTEGER`，起点与终点都包含在内（Pseudocode Guide §7.1）。

> **规则**（CAIE 规定）　指南没有要求先声明控制变量，§7.1 的示例代码也没有声明它。显式声明在指南里只是 good practice（§2.4），不是规则。

**示例：从 1 数到 5**　`Example_5_1_a.pseudocode`

```
FOR I ← 1 TO 5
   OUTPUT "Line ", I
NEXT I
OUTPUT "Done"
```
- 第 1 行：这一行同时做了三件事——定起点、定终点、说清楚用哪个变量计数。
- 第 2 行：循环体缩进三格。每跑一遍 `I` 的值都不一样，所以五行输出互不相同。
- 第 3 行：`NEXT I` 是一遍的终点，程序走到这里就回去加 1 再判断。
- 第 4 行：循环结束之后才执行，只显示一次。

示例运行：

```
Line 1
Line 2
Line 3
Line 4
Line 5
Done
```

**关卡**（single-choice）　`FOR I ← 3 TO 7` 的循环体一共执行几遍？

- **A** 5 遍
  - ✓ 对。`I` 依次取 3、4、5、6、7，两端都包含，所以是「终点减起点再加一」。
- **B** 4 遍
  - ✗ 起点和终点都算在内，别忘了加一：7 减 3 是 4，但 3、4、5、6、7 一共是五个数。
- **C** 7 遍
  - ✗ 7 是终点，不是次数。起点不是 1 的时候，次数和终点不是一回事。
- **D** 3 遍
  - ✗ 3 是起点，它决定从哪儿开始数，不决定数多少个。


### 小节题： 连加｜`5.1.1`

写一段伪代码：提示并读入一个整数 `N`（不会是负数），算出 1 加到 `N` 的和并显示。`N` 是 0 时一个数都不用加，和就是 0。

- **输入**：一行，一个 `INTEGER`。提示语排在读取之前，一字不差：
`Enter a number`
- **输出**：一行，写成 `Sum: <和>`。冒号后面是一个空格。
- **必须用** `loop.for` — 要加多少个数，读进 `N` 的那一刻就已经知道了，这正是计数控制循环的场合。
- **不能用** `loop.while` — 次数已知时用它就得自己管计数器的三件事，这一题要练的是把三件事交给 `FOR`。

提示：
1. 需要一个变量一路攒着和，循环开始之前要先把它设成 0。
2. 循环体里每一遍做的事都一样：把当前的控制变量加进那个变量里。
3. 显示放在循环外面，不然会显示很多遍。

题面示例：
```
输入：4
输出：
Enter a number
Sum: 10
```

<details><summary>参考解（学生看不到）</summary>

```
DECLARE Number : INTEGER
DECLARE Sum : INTEGER
Sum ← 0
OUTPUT "Enter a number"
INPUT Number
FOR I ← 1 TO Number
   Sum ← Sum + I
NEXT I
OUTPUT "Sum: ", Sum
```

判题用例（对学生隐藏，失败时只显示 caseHint）：

- `normal` 输入 5 — 一个很小的数。
- `normal` 输入 10 — 一个普通大小的数。
- `boundary` 输入 1 — 循环只该跑一遍的那个数。
- `boundary` 输入 0 — 循环一遍都不该跑的那个数。
- `extreme` 输入 1000 — 一个会跑很多遍的数。

</details>

---

## 5.2　`STEP`：不是每次都加 1

<sub>§11.2、G§7｜约 8 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`、`assign.simple`、`decl.constant`、`op.arithmetic`、`op.div`、`op.mod`、`op.relational`、`op.and`、`op.or`、`op.not`、`select.if`、`select.if-else`、`select.nested-if`、`select.case`、`select.case-range`、`select.case-otherwise`、`loop.for`、`loop.for-step`</sub>

`FOR` 默认每跑完一遍把控制变量加 1。想换个增量，在后面加 `STEP`：`FOR I ← 0 TO 100 STEP 10` 让 `I` 取 0、10、20……100，一共十一遍。

`STEP` 也可以是负数，这时就是倒着数：`FOR I ← 5 TO 1 STEP -1` 取 5、4、3、2、1。倒着数时起点必须比终点大，而且 `STEP` 必须是负的，两者要配套。

如果写成 `FOR I ← 10 TO 1` 而忘了 `STEP -1`，程序不会报错，但循环体**一遍都不会执行**——`I` 一开始就是 10，已经超过终点 1 了。这种循环的特点是安静地什么都没做。

还有一条：**循环体里不要去改控制变量**。`I` 归 `FOR` 管，它每一遍加多少、什么时候停，都由第一行那三个数决定。想跳着走就用 `STEP`，别自己加。

> **规则**（CAIE 规定）　`STEP <increment>` 指定每遍的增量，可正可负，默认为 1（Pseudocode Guide §7.1）。

> **规则**（编辑器约定）　在循环体内修改控制变量的程序能通过检查，但会在那一行停止。

**示例：倒数**　`Example_5_2_a.pseudocode`

```
FOR I ← 5 TO 1 STEP -1
   OUTPUT I
NEXT I
OUTPUT "Go"
```
- 第 1 行：起点 5 比终点 1 大，配 `STEP -1` 才走得起来。
- 第 2 行：每遍显示当前的 `I`，所以是 5、4、3、2、1。

示例运行：

```
5
4
3
2
1
Go
```

**反例：在循环体里改控制变量**

```
FOR I ← 1 TO 3
   OUTPUT I
   I ← I + 1
NEXT I
```
这段代码类型全对、结构完整，编辑器一条提示都没有。但它跑到第 3 行就会停：控制变量归 `FOR` 管，程序不允许在循环体里动它。**能通过检查不等于能跑完。**

- 运行时（第 3 行，RT1503）：控制变量由 `FOR` 那一行决定怎么变，循环体里不能再改它。

**关卡**（single-choice）　`FOR I ← 10 TO 1`（没写 `STEP`）的循环体会执行几遍？

- **A** 10 遍
  - ✗ 10 是起点不是次数，而且这个循环的方向本身就不对。
- **B** 1 遍
  - ✗ 没有「至少跑一遍」这回事。`FOR` 在每一遍开始前都先检查，第一次检查就没通过。
- **C** 编辑器会拦下来
  - ✗ 这段代码完全合法，编辑器没有任何理由拦它——它只是什么也没做。
- **D** 0 遍
  - ✓ 对。默认增量是 1，`I` 一开始就是 10，已经超过终点 1，循环体一遍都不执行。要倒着数得写 `STEP -1`。


---

## 5.3　`WHILE … ENDWHILE`：先看条件

<sub>§11.2、G§7｜约 9 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`、`assign.simple`、`decl.constant`、`op.arithmetic`、`op.div`、`op.mod`、`op.relational`、`op.and`、`op.or`、`op.not`、`select.if`、`select.if-else`、`select.nested-if`、`select.case`、`select.case-range`、`select.case-otherwise`、`loop.for`、`loop.for-step`、`loop.while`</sub>

`FOR` 的前提是次数事先知道。可有些事没法事先知道要做多少遍：一直读数字直到读到某个值、一直问直到答对。这时候用 `WHILE`：写 `WHILE <条件>`，中间是循环体，最后用 `ENDWHILE` 收尾。

条件写在循环前面，所以它叫**前测循环（pre-condition loop）**。**每一遍开始之前先看条件**：成立就进去跑一遍，跑完回到开头再看一次；不成立就跳过整个循环，从 `ENDWHILE` 后面继续。

因为条件在前面，`WHILE` **可能一遍都不执行**——第一次检查就不成立的话，循环体一次都不会跑。这不是毛病，恰恰是它有用的地方：「一个数都没有」本来就该是合法的情况。

条件里用到的东西，循环体里必须有办法让它变。改不了就成了**死循环（infinite loop）**——条件永远成立，程序停不下来。判断办法很直接：**把条件里出现的每个名字挑出来，看循环体里有没有哪一行会改到它**；一个都没有，那就是死循环。一种常见的写法是**哨兵（sentinel）**：约定一个特殊值表示「到此为止」。要在进入循环前先读一次，循环体的最后再读一次，这样条件每次都是拿最新读到的值去判断。

> **规则**（CAIE 规定）　前测循环（pre-condition loop）写作 `WHILE <condition> … ENDWHILE`。CAIE 的写法里 `WHILE` 后面不写 `DO`（Pseudocode Guide §7.2）。

**示例：读到 -1 为止**　`Example_5_3_a.pseudocode`

```
DECLARE Score : INTEGER
DECLARE Count : INTEGER
Count ← 0
OUTPUT "Enter a score"
INPUT Score
WHILE Score <> -1
   Count ← Count + 1
   OUTPUT "Enter a score"
   INPUT Score
ENDWHILE
OUTPUT "Count: ", Count
```
- 4–5 行：进循环之前先读一次。不先读，下一行的条件就没有值可判断。
- 第 6 行：拿刚读到的值和哨兵比。读到 -1 就结束，-1 本身不算数。
- 8–9 行：循环体的最后再读一次。这一句就是让条件下一轮能变的那一句——少了它条件永远成立。

示例运行（`>` 开头的那行是输入）：

```
Enter a score
> 80
Enter a score
> 95
Enter a score
> -1
Count: 2
```

**关卡**（single-choice）　`Count` 是 10 时，下面这段在屏幕上显示什么？

```
WHILE Count < 5
   OUTPUT "In"
ENDWHILE
OUTPUT "Done"
```
- **A** 程序会一直跑下去
  - ✗ 一直跑下去的是「条件永远成立」的循环。这里条件一开始就不成立。
- **B** 只有 Done
  - ✓ 对。条件在每一遍开始之前判断，`10 < 5` 第一次就是 `FALSE`，循环体一遍都不跑，直接执行 `ENDWHILE` 后面那一行。
- **C** In 一遍，然后 Done
  - ✗ 那是下一节 `REPEAT` 的行为。`WHILE` 先看条件再决定进不进去。
- **D** 什么都没有
  - ✗ 跳过的只是循环体。`OUTPUT "Done"` 在 `ENDWHILE` 后面，不归循环管。


---

## 5.4　`REPEAT … UNTIL`：先做一次

<sub>§11.2、G§7｜约 8 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`、`assign.simple`、`decl.constant`、`op.arithmetic`、`op.div`、`op.mod`、`op.relational`、`op.and`、`op.or`、`op.not`、`select.if`、`select.if-else`、`select.nested-if`、`select.case`、`select.case-range`、`select.case-otherwise`、`loop.for`、`loop.for-step`、`loop.while`、`loop.repeat`</sub>

有些事必须先做一次才知道要不要再做：先问一遍才知道答案对不对，先读一次才知道这个数合不合格。这时候条件应该放在后面——写 `REPEAT`，中间是循环体，最后一行写 `UNTIL <条件>`。

循环体先跑一遍，跑完再看条件。条件写在后面，所以它叫**后测循环（post-condition loop）**，定义就是这一句：**至少执行一次**。`REPEAT` 没有 `ENDREPEAT`，`UNTIL` 那一行本身就是结尾。

`UNTIL` 和 `WHILE` 的方向正好相反，这一点要盯住：`WHILE <条件>` 是条件成立就继续，`UNTIL <条件>` 是条件成立就停。

所以同一件事写成两种循环时，条件往往要反过来写。「继续读，直到读到 -1」写成 `UNTIL Score = -1`；换成 `WHILE` 就得写 `WHILE Score <> -1`。

> **规则**（CAIE 规定）　后测循环写作 `REPEAT … UNTIL <condition>`，条件成立时结束循环（Pseudocode Guide §7.3）。

**示例：问到合格为止**　`Example_5_4_a.pseudocode`

```
DECLARE Number : INTEGER
REPEAT
   OUTPUT "Enter a number from 1 to 5"
   INPUT Number
UNTIL Number >= 1 AND Number <= 5
OUTPUT "Accepted: ", Number
```
- 2–4 行：不管怎样都要先问一次——不问就没有值可以检查。这正是 `REPEAT` 比 `WHILE` 顺手的地方：不需要在循环前先读一次。
- 第 5 行：条件成立（读到的数落在 1 到 5 之间）就结束；不成立就再来一遍。

示例运行（`>` 开头的那行是输入）：

```
Enter a number from 1 to 5
> 9
Enter a number from 1 to 5
> 0
Enter a number from 1 to 5
> 3
Accepted: 3
```

**关卡**（single-choice）　`Count` 是 10 时，`REPEAT OUTPUT Count UNTIL Count > 5` 会发生什么？

- **A** 编辑器会拦下来
  - ✗ 这段代码合法。`Count` 在循环里没变，但条件第一次就成立，不会出问题。
- **B** 显示一次 10，然后结束
  - ✓ 对。循环体先执行一遍显示 `10`，然后判断 `10 > 5` 成立，于是结束。条件在后面，所以至少跑一遍。
- **C** 什么都不显示，因为 10 已经大于 5
  - ✗ 那是 `WHILE` 的行为。`REPEAT` 把条件放在后面，先跑完一遍才轮到判断。
- **D** 一直显示 10
  - ✗ 一直跑下去要求条件一直不成立。`10 > 5` 第一次判断就成立了。


### 小节题： 攒够为止｜`5.4.1`

写一段伪代码：反复提示并读入一个正整数，把它加到总额上，直到总额达到或超过 100 为止；然后显示最后的总额，以及一共读了几个数。

- **输入**：若干行，每行一个 `INTEGER`。每读一次之前都要显示一遍提示语，一字不差：
`Enter an amount`
- **输出**：读完之后显示两行：
`Total: <最后的总额>`
`Count: <一共读了几个数>`
冒号后面都是一个空格。
- **必须用** `loop.repeat` — 总额一开始是 0，不先读一个数进来就无从判断够没够。
- **不能用** `loop.while` — 用它得在循环前先读一次，提示和读取那两行就要写两遍。

提示：
1. 总额和个数都要在循环开始之前清零。
2. 循环体里做三件事：提示、读一个数、把它加上去——个数也在这里加一。
3. 结束条件写的是什么时候停，不是什么时候继续。

题面示例：
```
输入：60 / 70
输出：
Enter an amount
Enter an amount
Total: 130
Count: 2
```

<details><summary>参考解（学生看不到）</summary>

```
DECLARE Amount : INTEGER
DECLARE Total : INTEGER
DECLARE Count : INTEGER
Total ← 0
Count ← 0
REPEAT
   OUTPUT "Enter an amount"
   INPUT Amount
   Total ← Total + Amount
   Count ← Count + 1
UNTIL Total >= 100
OUTPUT "Total: ", Total
OUTPUT "Count: ", Count
```

判题用例（对学生隐藏，失败时只显示 caseHint）：

- `normal` 输入 30 / 40 / 50 — 读了几个之后才攒够。
- `boundary` 输入 100 — 第一个数就正好攒够。
- `boundary` 输入 99 / 1 — 差一点，再来一个正好到。
- `normal` 输入 1 / 1 / 1 / 1 / 1 / 1 / 1 / 1 / 1 / 1 / 90 — 一路都是很小的数，最后一个才拉满。
- `extreme` 输入 999999 — 第一个数就远远超过要求。

</details>

---

## 5.5　前测与后测：同一件事的两种写法

<sub>§11.2、G§7｜约 8 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`、`assign.simple`、`decl.constant`、`op.arithmetic`、`op.div`、`op.mod`、`op.relational`、`op.and`、`op.or`、`op.not`、`select.if`、`select.if-else`、`select.nested-if`、`select.case`、`select.case-range`、`select.case-otherwise`、`loop.for`、`loop.for-step`、`loop.while`、`loop.repeat`</sub>

`WHILE` 和 `REPEAT` 都能做「不知道要跑多少遍」的事，区别只在条件放在前面还是后面。把同一个任务的两种写法并排看，区别就很清楚了。

两种写法都对，但它们在一种情况下**结果不一样**：第一个输入就是哨兵。`WHILE` 版条件一开始就不成立，循环体一遍都不跑；`REPEAT` 版循环体先跑一遍，读到的哨兵也会进到循环体里，所以必须多写一个判断把它挡住。

这就是选择的依据：**「一次都不做」是不是一种合法的情况？** 是的话用 `WHILE`，它天生支持跑 0 遍；不是的话（比如「至少要问一次」）用 `REPEAT`，它天生跑至少 1 遍。

**对照：读到 -1 为止，数一数读了几个**

同一个任务，条件放前面和放后面，代价落在不同的地方。

*自然语言*
```
一个一个读数字，读到 -1 就停下来，数一数一共读了几个（-1 不算）。
```
> 这句话没有说「如果第一个就是 -1 怎么办」。人会默认答案是零个，程序不会默认，得由结构本身决定。

*伪代码 · `WHILE`（前测）*
```
DECLARE Score : INTEGER
DECLARE Count : INTEGER
Count ← 0
OUTPUT "Enter a score"
INPUT Score
WHILE Score <> -1
   Count ← Count + 1
   OUTPUT "Enter a score"
   INPUT Score
ENDWHILE
```
> 进循环前要先读一次，否则第一次判断时变量还没有值。代价是提示与读取那两行写了两遍。第一个就读到 -1 时，循环体一遍不跑，结果自然是零个。

*伪代码 · `REPEAT`（后测）*
```
DECLARE Score : INTEGER
DECLARE Count : INTEGER
Count ← 0
REPEAT
   OUTPUT "Enter a score"
   INPUT Score
   IF Score <> -1 THEN
      Count ← Count + 1
   ENDIF
UNTIL Score = -1
```
> 不用先读，读取只写一遍。代价是循环体里要多一个判断——哨兵本身也会被读进来，不挡住就会被数进去。

*Python*
```python
count = 0
score = int(input())
while score != -1:
    count += 1
    score = int(input())
```
> Python 只有前测的 `while`，没有对应 `REPEAT … UNTIL` 的写法；要「先做一次」得用 `while True` 加 `break` 拼出来。伪代码把两种都作为正式结构提供，所以要自己挑。

**关卡**（single-choice）　哪一种情况**必须**用 `REPEAT`，用 `WHILE` 会别扭？

- **A** 只要还有钱就继续买东西
  - ✗ 一分钱都没有时应该一次都不买。「可能 0 次」正是 `WHILE` 的场合。
- **B** 把一串数字从头到尾走一遍
  - ✗ 次数事先就知道，这种情况连 `WHILE` 都不是首选，`FOR` 才是。
- **C** 显示 1 到 10
  - ✗ 次数已知，用 `FOR` 最直接：起点终点写在一行里。
- **D** 反复要求用户输入密码，直到输对为止
  - ✓ 对。不问一次就没有密码可以检查。用 `WHILE` 也做得到，但必须在循环前先问一次，那一段会重复写两遍。


---


## 章末大题： 分数统计｜`5.T1`

写一段伪代码：反复读入分数，读到 -1 表示输入结束，然后显示这批分数的统计结果。-1 本身不算一个分数。

- **输入**：若干行，每行一个 `INTEGER`。每次读取之前都要显示提示语，一字不差：
`Enter a score`
读到 -1 表示结束。可能第一个读到的就是 -1。
- **输出**：一个分数都没读到时，只显示一行 `No scores`；
否则显示三行：
`Count: <个数>`
`Highest: <最高分>`
`Average: <平均分>`
平均分取整数商。每个冒号后面都是一个空格。
- **建议用到**：`loop.while`、`select.if`、`select.if-else`、`op.relational`、`op.div`、`io.input`、`io.output`

提示：
1. 「一个分数都没有」是一种合法情况，5.5 的判据直接给出了该用哪种循环。
2. 个数、总分、最高分都要一路攒着，三个变量都要在循环开始前先给初值。
3. 求最高分不需要记住所有分数：每读到一个就和目前的最高分比一下，比它大就换掉。第一个分数没有「目前的最高分」可比，直接让它当起点。

题面示例：
```
输入：50 / 70 / -1
输出：
Enter a score
Enter a score
Enter a score
Count: 2
Highest: 70
Average: 60
```

<details><summary>参考解（学生看不到）</summary>

```
DECLARE Score : INTEGER
DECLARE Total : INTEGER
DECLARE Count : INTEGER
DECLARE Highest : INTEGER
Total ← 0
Count ← 0
OUTPUT "Enter a score"
INPUT Score
WHILE Score <> -1
   Total ← Total + Score
   IF Count = 0 THEN
      Highest ← Score
   ELSE
      IF Score > Highest THEN
         Highest ← Score
      ENDIF
   ENDIF
   Count ← Count + 1
   OUTPUT "Enter a score"
   INPUT Score
ENDWHILE
IF Count = 0 THEN
   OUTPUT "No scores"
ELSE
   OUTPUT "Count: ", Count
   OUTPUT "Highest: ", Highest
   OUTPUT "Average: ", Total DIV Count
ENDIF
```

判题用例（对学生隐藏，失败时只显示 caseHint）：

- `normal` 输入 80 / 95 / 60 / -1 — 几个普通的分数，最高的那个排在中间。
- `normal` 输入 70 / -1 — 只读到一个分数。
- `boundary` 输入 -1 — 一上来就结束，一个分数都没有。
- `boundary` 输入 0 / -1 — 唯一的那个分数正好是零。
- `normal` 输入 100 / 100 / 100 / -1 — 所有分数都一样。
- `extreme` 输入 99999 / 1 / -1 — 两个相差非常悬殊的分数。

</details>
