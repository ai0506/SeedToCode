# Chapter 8 — 一维数组  `[AS]`

对应 §10.2、G§3｜内容预览（不是最终版式，只是把数据平铺出来读）


---

## 8.1　为什么需要数组

<sub>§10.2、G§3｜约 8 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`、`assign.simple`、`decl.constant`、`op.arithmetic`、`op.div`、`op.mod`、`op.relational`、`op.and`、`op.or`、`op.not`、`select.if`、`select.if-else`、`select.nested-if`、`select.case`、`select.case-range`、`select.case-otherwise`、`loop.for`、`loop.for-step`、`loop.while`、`loop.repeat`、`loop.nested`、`builtin.length`、`builtin.mid`、`builtin.right`、`builtin.ucase`、`builtin.lcase`、`op.concat`、`builtin.int`、`builtin.rand`、`decl.array-1d`、`array.index`</sub>

要记住三个分数，声明三个变量就行。要记住三十个呢？三十个 `DECLARE`、三十行 `INPUT`，想求个总分还得把三十个名字全写一遍。名字一多，代码就没法写了。

**数组（array）**是一排格子，共用一个名字，用编号区分。`Marks[1]`、`Marks[2]`、`Marks[3]` 全都叫 `Marks`，靠方括号里的数字分开。

这一下就解开了名字的死结：编号是个数字，而数字可以用变量装。`Marks[I]` 里的 `I` 每变一次就指向不同的格子——第 5 章的 `FOR` 正好能把 `I` 从 1 数到 30。**一排格子加一个循环，三十个数和三个数写起来一样长。**

格子里放的东西必须是同一种类型：一个 `ARRAY … OF INTEGER` 的每个格子都是 `INTEGER`，不能有一格塞 `STRING`。

> **规则**（CAIE 规定）　数组是一组相同类型的数据，用一个标识符和下标访问（§10.2）。

**对照：记住三个分数，两种写法**

三个的时候差别不大——请一边看一边想「如果是三十个会怎样」。

*自然语言*
```
记下三个分数，然后把它们加起来。
```
> 人说「三个分数」时，脑子里是一组东西，不是三个各自独立的名字。数组就是把这个「一组」直接写进代码。

*伪代码 · 三个各自独立的变量*
```
DECLARE MarkOne : INTEGER
DECLARE MarkTwo : INTEGER
DECLARE MarkThree : INTEGER
MarkOne ← 80
MarkTwo ← 70
MarkThree ← 60
OUTPUT "Total: ", MarkOne + MarkTwo + MarkThree
```
> 三个名字，三行赋值，加起来还要把三个名字再写一遍。换成三十个，这段就要写九十行，而且没有任何办法用循环。

*伪代码 · 一个数组*
```
DECLARE Marks : ARRAY[1:3] OF INTEGER
Marks[1] ← 80
Marks[2] ← 70
Marks[3] ← 60
OUTPUT "Total: ", Marks[1] + Marks[2] + Marks[3]
```
> 一个名字，三个编号。现在把 `3` 改成 `30` 只要改一处——而且编号可以换成变量，那才是真正的好处，8.4 会用上。

*Python*
```python
marks = [80, 70, 60]
print("Total:", marks[0] + marks[1] + marks[2])
```
> 同一个想法。Python 的编号从 0 起，而伪代码的上下界由你自己在声明里写明——下一节就讲这个。

**关卡**（single-choice）　为什么说「三十个分数用三十个变量写不了」？

- **A** 因为三十个变量的类型没法统一
  - ✗ 三十个变量当然可以都声明成 `INTEGER`。数组要求类型统一，反而是它比散变量更严的地方。
- **B** 因为变量的名字没法用循环生成
  - ✓ 对。循环能让一个数字变来变去，但没法让变量的**名字**变来变去。数组把「第几个」变成了一个数字，循环才使得上力。
- **C** 因为伪代码最多只能声明十个变量
  - ✗ 没有这条限制。三十个 `DECLARE` 完全合法，只是写起来没法收拾。
- **D** 因为变量存不下那么多数据
  - ✗ 一个变量存一个数，三十个变量存得下三十个数。问题不在存不存得下，在写不写得动。


---

## 8.2　声明、下标、下界与上界

<sub>§10.2、G§3｜约 10 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`、`assign.simple`、`decl.constant`、`op.arithmetic`、`op.div`、`op.mod`、`op.relational`、`op.and`、`op.or`、`op.not`、`select.if`、`select.if-else`、`select.nested-if`、`select.case`、`select.case-range`、`select.case-otherwise`、`loop.for`、`loop.for-step`、`loop.while`、`loop.repeat`、`loop.nested`、`builtin.length`、`builtin.mid`、`builtin.right`、`builtin.ucase`、`builtin.lcase`、`op.concat`、`builtin.int`、`builtin.rand`、`decl.array-1d`、`array.index`</sub>

声明一个数组写成 `DECLARE Marks : ARRAY[1:30] OF INTEGER`。读作：`Marks` 是一排格子，编号从 1 到 30，每个格子里装一个 `INTEGER`。只用一个编号就指得准一个格子的数组叫**一维数组（1D array）**，第 9 章会见到要两个编号的那一种。

方括号里那两个数就是**下界（lower bound）**和**上界（upper bound）**——第一个格子的编号和最后一个格子的编号。**两端都算数**，所以 `ARRAY[1:30]` 一共 30 个格子。

方括号里用来指格子的那个数叫**下标（index）**。`Marks[7]` 的下标是 7。下标必须是 `INTEGER`，可以是字面量，也可以是变量或算式——但不能是 `REAL`，哪怕它正好是个整数值。

CAIE 要求把上下界**写明白**，不能只写个长度。这样做的好处是编号从几开始由你决定：成绩从 1 数到 30 很自然，而要表示 2020 到 2029 这十年，直接写 `ARRAY[2020:2029]` 比自己换算方便得多。

> **规则**（CAIE 规定）　一维数组声明为 `DECLARE <identifier> : ARRAY[<lower>:<upper>] OF <type>`，上下界都要显式写出，且都包含在内（Pseudocode Guide §3）。

**示例：一排格子，一个一个放**　`Example_8_2_a.pseudocode`

```
DECLARE Marks : ARRAY[1:3] OF INTEGER
DECLARE Where : INTEGER
Marks[1] ← 80
Marks[2] ← 70
Where ← 3
Marks[Where] ← 60
OUTPUT "First: ", Marks[1]
OUTPUT "Last: ", Marks[3]
OUTPUT "Total: ", Marks[1] + Marks[2] + Marks[3]
```
- 第 1 行：下界 1、上界 3，一共三个格子，每格装一个 `INTEGER`。
- 5–6 行：下标可以是变量。这一行和 `Marks[3] ← 60` 是同一件事——正因为如此，循环才能派上用场。
- 第 9 行：取出来的 `Marks[1]` 就是个普通的 `INTEGER`，能加能比，和别的整数没有两样。

示例运行：

```
First: 80
Last: 60
Total: 210
```

**关卡**（single-choice）　`DECLARE Years : ARRAY[2020:2029] OF INTEGER` 一共有几个格子？

- **A** 9 个
  - ✗ 少算了一个。两端都包含，所以是「上界减下界再加一」。
- **B** 2029 个
  - ✗ 2029 是最后一个格子的编号，不是格子的数量。下标不一定从 1 开始。
- **C** 不合法，下界必须是 1
  - ✗ 下界可以是任何整数。让编号直接就是年份，比自己换算成 1 到 10 省事得多。
- **D** 10 个
  - ✓ 对。上下界两端都算数：2029 减 2020 等于 9，再加一就是 10 个格子，编号从 2020 一直到 2029。


### 小节题： 按年份取｜`8.2.1`

一家店记录 2020、2021、2022 三年的销量。写一段伪代码：提示并读入这三年的销量，存进一个**下界就是 2020 的数组**；然后提示读入一个年份，显示那一年的销量，最后显示三年的总和。

- **输入**：四行 `INTEGER`。每次读取之前都要显示提示语，一字不差，依次是：
`Enter sales for 2020`
`Enter sales for 2021`
`Enter sales for 2022`
`Enter a year`
最后读入的年份保证是 2020、2021、2022 之一。
- **输出**：两行：
`Sales in <年份>: <那一年的销量>`
`Total: <三年总和>`
冒号后面都是一个空格。
- **必须用** `decl.array-1d` — 三年的销量是一排同类型的数据，共用一个名字、靠编号区分。
- **必须用** `array.index` — 这道题的关键就在下标上：年份本身就是编号，存和取都直接用它。

提示：
1. 声明时把上下界写成真实的年份，不要从 1 开始——`ARRAY[2020:2022]` 是合法的。
2. 下界写对了，读进来的年份就能直接当下标用，不需要把它换算成「第几个」。
3. 总和那一行三个格子都要用到，下标直接写年份就行。

题面示例：
```
输入：120 / 150 / 90 / 2021
输出：
Enter sales for 2020
Enter sales for 2021
Enter sales for 2022
Enter a year
Sales in 2021: 150
Total: 360
```

<details><summary>参考解（学生看不到）</summary>

```
DECLARE Sales : ARRAY[2020:2022] OF INTEGER
DECLARE Year : INTEGER
OUTPUT "Enter sales for 2020"
INPUT Sales[2020]
OUTPUT "Enter sales for 2021"
INPUT Sales[2021]
OUTPUT "Enter sales for 2022"
INPUT Sales[2022]
OUTPUT "Enter a year"
INPUT Year
OUTPUT "Sales in ", Year, ": ", Sales[Year]
OUTPUT "Total: ", Sales[2020] + Sales[2021] + Sales[2022]
```

判题用例（对学生隐藏，失败时只显示 caseHint）：

- `normal` 输入 10 / 20 / 30 / 2021 — 查询中间那一年。
- `boundary` 输入 7 / 8 / 9 / 2020 — 查询的正是下界那一年。
- `boundary` 输入 4 / 5 / 6 / 2022 — 查询的正是上界那一年。
- `normal` 输入 0 / 0 / 0 / 2020 — 三年都没有卖出东西。
- `extreme` 输入 999999 / 1 / 888888 / 2022 — 掺着很大和很小的销量。

</details>

---

## 8.3　越界与还没放东西的格子

<sub>§10.2、G§3｜约 9 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`、`assign.simple`、`decl.constant`、`op.arithmetic`、`op.div`、`op.mod`、`op.relational`、`op.and`、`op.or`、`op.not`、`select.if`、`select.if-else`、`select.nested-if`、`select.case`、`select.case-range`、`select.case-otherwise`、`loop.for`、`loop.for-step`、`loop.while`、`loop.repeat`、`loop.nested`、`builtin.length`、`builtin.mid`、`builtin.right`、`builtin.ucase`、`builtin.lcase`、`op.concat`、`builtin.int`、`builtin.rand`、`decl.array-1d`、`array.index`</sub>

数组只有声明时说好的那些格子。`ARRAY[1:3]` 没有第 0 格，也没有第 4 格。指一个不存在的格子叫**越界**，程序不会将就着给你一个值，它会停下来。

越界什么时候被发现，取决于下标是什么。**下标写成字面量时，编辑器在运行前就能拦下来**——`Marks[4]` 里的 4 摆在那儿，一看就知道超了。

**下标是变量时就只能等到跑起来**。`Marks[I]` 里的 `I` 是多少，要执行到那一行才知道。循环边界写错一位，前几遍都对，最后一遍才炸——这又是一次「能通过检查不等于能跑完」。

还有一种不是越界但同样会停的情况：格子在范围里，可是**还没往里放过东西**。声明只是划出格子，没有给它们填值，读一个空格子和读一个没赋过值的变量是一回事。

**反例：三种指错格子的方式**

*下标写死了，运行前就拦下*
```
DECLARE Marks : ARRAY[1:3] OF INTEGER
Marks[4] ← 90
```
4 超过了上界 3。这个下标是写死的，编辑器不用跑就知道它不存在。

- 错误（第 2 行）：第 4 个格子不存在——这个数组只有第 1 到第 3 格。

*下标是变量，跑到那一遍才炸*
```
DECLARE Marks : ARRAY[1:3] OF INTEGER
FOR I ← 1 TO 4
   Marks[I] ← I
NEXT I
```
循环多跑了一遍。前三遍都对，第四遍才越界——编辑器一条提示都没有，因为 `I` 是多少要跑起来才知道。

- 运行时（第 3 行，RT1603）：循环跑到第 4 遍，可数组只到第 3 格。检查一下循环的终点。

*格子在，但还是空的*
```
DECLARE Marks : ARRAY[1:3] OF INTEGER
OUTPUT Marks[2]
```
第 2 格确实存在，只是从头到尾没往里放过东西。声明只划格子，不填值。

- 运行时（第 2 行，RT1003）：这个格子还没有值——先给它赋值，或者用 `INPUT` 读一个进去。

**关卡**（single-choice）　`DECLARE A : ARRAY[1:5] OF INTEGER` 之后，哪一种写法编辑器**在运行前就能**发现问题？

- **A** A[6] ← 1
  - ✓ 对。6 是写死在代码里的，和上界 5 一比就知道超了，不用跑起来。
- **B** A[I] ← 1，而 I 这时候是 6
  - ✗ `I` 的值要执行到那一行才知道，所以这种越界只能在运行时发现。
- **C** OUTPUT A[3]，而第 3 格还没赋过值
  - ✗ 第 3 格在范围里，静态检查挑不出毛病；空格子是跑到那一行才停。
- **D** 三种都能在运行前发现
  - ✗ 只有下标写死的那一种可以。另外两种都要等程序真的跑到那一行。


---

## 8.4　用 `FOR` 遍历数组

<sub>§10.2、G§3｜约 9 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`、`assign.simple`、`decl.constant`、`op.arithmetic`、`op.div`、`op.mod`、`op.relational`、`op.and`、`op.or`、`op.not`、`select.if`、`select.if-else`、`select.nested-if`、`select.case`、`select.case-range`、`select.case-otherwise`、`loop.for`、`loop.for-step`、`loop.while`、`loop.repeat`、`loop.nested`、`builtin.length`、`builtin.mid`、`builtin.right`、`builtin.ucase`、`builtin.lcase`、`op.concat`、`builtin.int`、`builtin.rand`、`decl.array-1d`、`array.index`</sub>

把数组的每个格子从头到尾走一遍，叫**遍历（traverse）**。数组的下标是连续的整数，`FOR` 的控制变量也是连续的整数——两者天生是一对。

写法就是让控制变量从下界数到上界，循环体里用它当下标：`FOR I ← 1 TO 5` 配 `Marks[I]`。循环跑几遍，格子就被碰几次。

**循环的边界要和数组的上下界对上。**数组是 `ARRAY[1:5]`，循环就写 `1 TO 5`；写成 `1 TO 6` 会在最后一遍越界，写成 `1 TO 4` 则会安静地漏掉最后一格——后者更麻烦，因为它不报错，只是结果少了一块。

**示例：读进来再倒着显示**　`Example_8_4_a.pseudocode`

```
DECLARE Numbers : ARRAY[1:5] OF INTEGER
FOR I ← 1 TO 5
   OUTPUT "Enter a number"
   INPUT Numbers[I]
NEXT I
FOR I ← 5 TO 1 STEP -1
   OUTPUT Numbers[I]
NEXT I
```
- 2–5 行：第一遍遍历：从下界数到上界，每遍读一个数放进第 `I` 格。
- 第 6 行：第二遍遍历倒着走——起点是上界，终点是下界，配 `STEP -1`（5.2）。
- 第 4 行：`INPUT` 的目标可以直接是数组的某一格，不用先读进一个临时变量再搬过去。

示例运行（`>` 开头的那行是输入）：

```
Enter a number
> 1
Enter a number
> 2
Enter a number
> 3
Enter a number
> 4
Enter a number
> 5
5
4
3
2
1
```

**关卡**（single-choice）　数组是 `ARRAY[1:5]`，循环写成 `FOR I ← 1 TO 4` 会怎样？

- **A** 编辑器会拦下来
  - ✗ 循环少跑一遍完全合法。编辑器没法知道你本来想跑几遍。
- **B** 第 5 格会自动被当成 0
  - ✗ 没有这种自动填值。第 5 格只是保持原样——如果从没赋过值，读它反而会让程序停下来。
- **C** 不报错，但第 5 格被漏掉了
  - ✓ 对。1 到 4 是合法的下标，程序跑得完，只是最后一格从头到尾没被碰过。这种错比越界难发现——它只是结果少了一块。
- **D** 运行时越界，程序停下来
  - ✗ 越界是指了不存在的格子。这里指的格子都存在，只是少指了一个。


### 小节题： 数一数有几个及格｜`8.4.1`

写一段伪代码：提示并读入 5 个分数存进数组，然后数一数其中有几个不低于 50，显示这个数量。

- **输入**：五行，各一个 `INTEGER`。每次读取之前都要显示提示语，一字不差：
`Enter a mark`
- **输出**：一行，写成 `Passed: <个数>`。冒号后面是一个空格。
- **必须用** `decl.array-1d` — 五个分数要先存下来，才能在读完之后再数一遍。
- **必须用** `loop.for` — 格子的编号是连续的整数，次数一开始就知道，交给计数控制循环最省事。
- **必须用** `array.index` — 存进去和数的时候都要指明是第几格。

提示：
1. 读的时候用一个 `FOR` 从下界走到上界，把读到的数放进第 `I` 格。
2. 数的时候需要一个计数变量，循环开始前先设成 0。
3. 「不低于 50」是一次比较，比出来成立就把计数加一。

题面示例：
```
输入：40 / 60 / 50 / 20 / 90
输出：
Enter a mark
Enter a mark
Enter a mark
Enter a mark
Enter a mark
Passed: 3
```

<details><summary>参考解（学生看不到）</summary>

```
DECLARE Marks : ARRAY[1:5] OF INTEGER
DECLARE Passed : INTEGER
Passed ← 0
FOR I ← 1 TO 5
   OUTPUT "Enter a mark"
   INPUT Marks[I]
NEXT I
FOR I ← 1 TO 5
   IF Marks[I] >= 50 THEN
      Passed ← Passed + 1
   ENDIF
NEXT I
OUTPUT "Passed: ", Passed
```

判题用例（对学生隐藏，失败时只显示 caseHint）：

- `normal` 输入 80 / 30 / 70 / 45 / 55 — 及格和不及格混在一起。
- `normal` 输入 10 / 20 / 30 / 40 / 45 — 一个都没及格。
- `boundary` 输入 50 / 50 / 50 / 50 / 50 — 全部正好卡在及格线上。
- `boundary` 输入 49 / 49 / 49 / 49 / 49 — 全部差一分。
- `extreme` 输入 100 / 100 / 100 / 100 / 100 — 全部满分。

</details>

---

## 8.5　先存下来，才做得到的事

<sub>§10.2、G§3｜约 10 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`、`assign.simple`、`decl.constant`、`op.arithmetic`、`op.div`、`op.mod`、`op.relational`、`op.and`、`op.or`、`op.not`、`select.if`、`select.if-else`、`select.nested-if`、`select.case`、`select.case-range`、`select.case-otherwise`、`loop.for`、`loop.for-step`、`loop.while`、`loop.repeat`、`loop.nested`、`builtin.length`、`builtin.mid`、`builtin.right`、`builtin.ucase`、`builtin.lcase`、`op.concat`、`builtin.int`、`builtin.rand`、`decl.array-1d`、`array.index`</sub>

求和、求最大、计数这三件事，第 5 章不用数组也做得到——边读边加、边读边比、边读边数就行。那数组到底多给了什么？

**它多给了「再看一遍」的能力。**边读边算的东西，读完就丢了；存进数组的数据，想看几遍就看几遍。

有些问题非得看两遍不可。比如「有几天的气温高于平均值」：平均值要等全部读完才算得出来，可判断「高于平均」又要回头看每一天。第一遍读入并求和，算出平均，第二遍再回去数——**没有存下来就没有第二遍**。

求最大值有个细节：起点不要写 0。把第一个格子的值当起点，再从第二格开始比，这样即使全是负数也不会出错。

**示例：两遍遍历：先算平均，再数超过的**　`Example_8_5_a.pseudocode`

```
DECLARE Temps : ARRAY[1:4] OF INTEGER
DECLARE Total : INTEGER
DECLARE Average : INTEGER
DECLARE Above : INTEGER
Total ← 0
Above ← 0
Temps[1] ← 18
Temps[2] ← 25
Temps[3] ← 20
Temps[4] ← 21
FOR I ← 1 TO 4
   Total ← Total + Temps[I]
NEXT I
Average ← Total DIV 4
FOR I ← 1 TO 4
   IF Temps[I] > Average THEN
      Above ← Above + 1
   ENDIF
NEXT I
OUTPUT "Average: ", Average
OUTPUT "Above: ", Above
```
- 11–13 行：第一遍：只管加总。到这里还不知道平均值是多少。
- 第 14 行：全部加完才算得出平均值——这就是为什么非要分两遍。
- 15–19 行：第二遍：拿着平均值回头再看每一格。数据还在数组里，所以回得去。

示例运行：

```
Average: 21
Above: 1
```

**关卡**（single-choice）　下面哪件事**必须**把数据先存进数组才做得到？

- **A** 找出读到的数里最大的那个
  - ✗ 边读边比就行：每读一个和目前的最大值比一下，不需要记住所有数。
- **B** 数出有几个数大于 50
  - ✗ 50 是事先就知道的门槛，边读边数就行。要是门槛得等读完才算得出来，那就另说了。
- **C** 数出有几个数高于这一批数的平均值
  - ✓ 对。平均值要全部读完才算得出来，而判断谁高于它又要回头看每一个数。没存下来就回不去了。
- **D** 把读到的数全部加起来
  - ✗ 边读边加就行，加完的数不需要再用第二次。


---


## 章末大题： 一周气温｜`8.T1`

写一段伪代码：读入一周七天的气温存进数组，然后显示总和、最高值、平均值，以及有几天高于平均值。

- **输入**：七行，各一个 `INTEGER`。每次读取之前都要显示提示语，一字不差：
`Enter a temperature`
- **输出**：读完之后显示四行：
`Total: <总和>`
`Highest: <最高值>`
`Average: <平均值>`　（取整数商）
`Above average: <高于平均值的天数>`
每个冒号后面都是一个空格。
- **建议用到**：`decl.array-1d`、`array.index`、`loop.for`、`select.if`、`op.arithmetic`、`op.div`、`op.relational`、`io.input`、`io.output`

提示：
1. 最后那一行是这道题的关键：平均值要等七天全部读完才算得出来，而「高于平均」又要回头看每一天。想清楚这需要走几遍。
2. 求最高值时，起点用第一天的气温，不要用 0——气温是可能低于零的。
3. 总和、最高值、计数各自需要一个变量，都要在对应的循环开始前给好初值。

题面示例：
```
输入：20 / 22 / 19 / 25 / 21 / 18 / 24
输出：
Enter a temperature
Enter a temperature
Enter a temperature
Enter a temperature
Enter a temperature
Enter a temperature
Enter a temperature
Total: 149
Highest: 25
Average: 21
Above average: 3
```

<details><summary>参考解（学生看不到）</summary>

```
DECLARE Temps : ARRAY[1:7] OF INTEGER
DECLARE Total : INTEGER
DECLARE Highest : INTEGER
DECLARE Average : INTEGER
DECLARE Above : INTEGER
Total ← 0
Above ← 0
FOR I ← 1 TO 7
   OUTPUT "Enter a temperature"
   INPUT Temps[I]
   Total ← Total + Temps[I]
NEXT I
Highest ← Temps[1]
FOR I ← 2 TO 7
   IF Temps[I] > Highest THEN
      Highest ← Temps[I]
   ENDIF
NEXT I
Average ← Total DIV 7
FOR I ← 1 TO 7
   IF Temps[I] > Average THEN
      Above ← Above + 1
   ENDIF
NEXT I
OUTPUT "Total: ", Total
OUTPUT "Highest: ", Highest
OUTPUT "Average: ", Average
OUTPUT "Above average: ", Above
```

判题用例（对学生隐藏，失败时只显示 caseHint）：

- `normal` 输入 15 / 18 / 21 / 17 / 19 / 22 / 16 — 一周气温有高有低。
- `boundary` 输入 20 / 20 / 20 / 20 / 20 / 20 / 20 — 七天一模一样——这时候没有哪天高于平均。
- `boundary` 输入 -5 / -3 / -8 / -1 / -6 / -2 / -4 — 整周都在零度以下。
- `normal` 输入 0 / 10 / 0 / 10 / 0 / 10 / 0 — 只有两种值轮流出现。
- `extreme` 输入 40 / 1 / 1 / 1 / 1 / 1 / 1 — 有一天特别热，把平均值拉高了。

</details>
