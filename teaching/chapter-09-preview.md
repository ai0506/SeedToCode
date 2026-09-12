# Chapter 9 — 二维数组  `[AS]`

对应 §10.2｜内容预览（不是最终版式，只是把数据平铺出来读）


---

## 9.1　二维数组的形状

<sub>§10.2｜约 9 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`、`assign.simple`、`decl.constant`、`op.arithmetic`、`op.div`、`op.mod`、`op.relational`、`op.and`、`op.or`、`op.not`、`select.if`、`select.if-else`、`select.nested-if`、`select.case`、`select.case-range`、`select.case-otherwise`、`loop.for`、`loop.for-step`、`loop.while`、`loop.repeat`、`loop.nested`、`builtin.length`、`builtin.mid`、`builtin.right`、`builtin.ucase`、`builtin.lcase`、`op.concat`、`builtin.int`、`builtin.rand`、`decl.array-1d`、`array.index`、`decl.array-2d`、`array.index-2d`</sub>

一维数组是一排格子。可有些数据天生是一张**表**：三个学生每人两科成绩、一周七天每天三个时段、一块五行三列的棋盘。硬塞进一排格子也行，但得自己换算「第 2 个学生的第 1 科是第几格」——换算就是出错的地方。

**二维数组（2D array）**直接给你一张表：`DECLARE Marks : ARRAY[1:3, 1:2] OF INTEGER` 是 3 行 2 列，一共 6 个格子。方括号里两组上下界用逗号隔开，每一组的规矩和一维完全一样——两端都算数。

指一个格子要给两个下标：`Marks[2, 1]` 是第 2 行第 1 列。CAIE 的约定是**先行后列**，和读一张表的顺序一致。

行和列具体代表什么由你决定：`ARRAY[1:3, 1:2]` 既可以是「3 个学生 × 2 科」，也可以是「3 天 × 2 个时段」。声明里只有数字，意思在你心里——所以变量名要起得让人看得懂。

> **规则**（CAIE 规定）　二维数组声明为 `DECLARE <identifier> : ARRAY[<lower1>:<upper1>, <lower2>:<upper2>] OF <type>`，访问时两个下标按先行后列的顺序给出（§10.2）。

**示例：一张 3 行 2 列的成绩表**　`Example_9_1_a.pseudocode`

```
DECLARE Marks : ARRAY[1:3, 1:2] OF INTEGER
Marks[1, 1] ← 80
Marks[1, 2] ← 70
Marks[2, 1] ← 55
Marks[2, 2] ← 90
Marks[3, 1] ← 100
Marks[3, 2] ← 40
OUTPUT "Student 1, subject 2: ", Marks[1, 2]
OUTPUT "Student 3, subject 1: ", Marks[3, 1]
OUTPUT "Student 2 total: ", Marks[2, 1] + Marks[2, 2]
```
- 第 1 行：3 行 2 列。第一组上下界管行，第二组管列。
- 2–7 行：六个格子逐个填。行号先写，列号后写。
- 第 10 行：同一行的两个格子加起来，就是这个学生的总分——行号相同、列号不同。

示例运行：

```
Student 1, subject 2: 70
Student 3, subject 1: 100
Student 2 total: 145
```

**关卡**（single-choice）　`DECLARE Grid : ARRAY[1:4, 1:3] OF INTEGER` 一共有多少个格子？

- **A** 7 个
  - ✗ 把两个方向加起来了。表格的格子数是行数乘列数，不是相加。
- **B** 6 个
  - ✗ 少算了两端：1 到 4 是四个数不是三个，1 到 3 是三个数不是两个。
- **C** 43 个
  - ✗ 这是把上界拼在一起了。方括号里的两组数是两个方向的范围，不是一个数字。
- **D** 12 个
  - ✓ 对。4 行乘 3 列等于 12。两组上下界各自都是两端都算数，所以是 4 个乘 3 个。


---

## 9.2　两个下标不能弄反

<sub>§10.2｜约 8 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`、`assign.simple`、`decl.constant`、`op.arithmetic`、`op.div`、`op.mod`、`op.relational`、`op.and`、`op.or`、`op.not`、`select.if`、`select.if-else`、`select.nested-if`、`select.case`、`select.case-range`、`select.case-otherwise`、`loop.for`、`loop.for-step`、`loop.while`、`loop.repeat`、`loop.nested`、`builtin.length`、`builtin.mid`、`builtin.right`、`builtin.ucase`、`builtin.lcase`、`op.concat`、`builtin.int`、`builtin.rand`、`decl.array-1d`、`array.index`、`decl.array-2d`、`array.index-2d`</sub>

两个下标必须**都给，而且按先行后列的顺序给**。少给一个，或者顺序弄反，都是错的——但这两种错被发现的方式不一样。

**只给一个下标**，编辑器在运行前就拦下来：这个数组要两个下标，你只给了一个，一看就知道。

**顺序弄反**就麻烦得多。`ARRAY[1:3, 1:2]` 写成 `Marks[2, 3]` 时，第二个下标 3 超出了列的范围 1 到 2，会被抓住；可要是行和列的范围一样大——比如 `ARRAY[1:3, 1:3]`——那 `Marks[2, 1]` 和 `Marks[1, 2]` **都合法**，程序照跑，只是取错了格子。

所以行列顺序不是靠编辑器帮你记的，是靠自己写清楚。一个管用的习惯：控制变量别叫 `I`、`J`，叫 `Row` 和 `Col`，或者叫 `Student` 和 `Subject`——名字一写对，顺序就很难写反。

**反例：两种给错下标的方式**

*只给了一个下标*
```
DECLARE Grid : ARRAY[1:2, 1:3] OF INTEGER
Grid[1] ← 5
```
这个数组要两个下标。少给一个，编辑器在运行前就能看出来。

- 错误（第 2 行）：这是一张表，指一个格子要同时给出行和列。

*行列反了，但两边一样大，所以没人拦得住*
```
DECLARE Grid : ARRAY[1:3, 1:3] OF INTEGER
DECLARE Row : INTEGER
DECLARE Col : INTEGER
Row ← 1
Col ← 3
Grid[Row, Col] ← 7
OUTPUT Grid[Col, Row]
```
存进第 1 行第 3 列，取的却是第 3 行第 1 列——两个都在范围里，所以**这段代码零提示、跑得完**，只是取到的是另一个格子。行列范围一样大的表格，顺序写反不会有任何警告。


**关卡**（single-choice）　`DECLARE T : ARRAY[1:5, 1:5] OF INTEGER` 里，把 `T[2, 4]` 写成了 `T[4, 2]` 会怎样？

- **A** 程序照常跑完，但用的是另一个格子
  - ✓ 对。行和列的范围一样大，所以两个写法都落在表格里，谁也拦不住。这种错只能靠自己把行列的含义写清楚来防。
- **B** 编辑器会拦下来
  - ✗ 两个下标都在 1 到 5 之间，完全合法。编辑器不知道你心里想的是哪个格子。
- **C** 运行时越界，程序停下来
  - ✗ 越界是指了不存在的格子。这里指的格子存在，只是不是你要的那个。
- **D** 两个写法本来就是同一个格子
  - ✗ 除非行号和列号正好相等，否则它们是不同的两个格子。表格不是对称的。


---

## 9.3　用嵌套循环遍历一张表

<sub>§10.2｜约 10 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`、`assign.simple`、`decl.constant`、`op.arithmetic`、`op.div`、`op.mod`、`op.relational`、`op.and`、`op.or`、`op.not`、`select.if`、`select.if-else`、`select.nested-if`、`select.case`、`select.case-range`、`select.case-otherwise`、`loop.for`、`loop.for-step`、`loop.while`、`loop.repeat`、`loop.nested`、`builtin.length`、`builtin.mid`、`builtin.right`、`builtin.ucase`、`builtin.lcase`、`op.concat`、`builtin.int`、`builtin.rand`、`decl.array-1d`、`array.index`、`decl.array-2d`、`array.index-2d`</sub>

一维数组配一层 `FOR`，二维数组配两层——这正是第 6 章那两种嵌套形状里的第一种：外层管行，内层管列。外层跑一遍，内层把那一行的每一列走完。

外层管行、内层管列，叫**行优先**：走的顺序是第 1 行的每一列、第 2 行的每一列……适合「每一行算一个结果」，比如每个学生的总分。

把两层换个位置，外层管列、内层管行，就是**列优先**：适合「每一列算一个结果」，比如每一科的平均分。**同一张表，问的问题不同，两层循环的里外就不同。**

算每行一个结果时，那个累加变量要在**外层循环里面、内层循环外面**清零——位置错一层，上一行的结果就会被带到下一行（第 6 章的章末大题正是这件事）。

**示例：同一张表，两种走法**　`Example_9_3_a.pseudocode`

```
DECLARE Marks : ARRAY[1:2, 1:3] OF INTEGER
DECLARE Row : INTEGER
DECLARE Col : INTEGER
DECLARE Sum : INTEGER
FOR Row ← 1 TO 2
   FOR Col ← 1 TO 3
      Marks[Row, Col] ← Row * Col
   NEXT Col
NEXT Row
FOR Row ← 1 TO 2
   Sum ← 0
   FOR Col ← 1 TO 3
      Sum ← Sum + Marks[Row, Col]
   NEXT Col
   OUTPUT "Row ", Row, " total: ", Sum
NEXT Row
FOR Col ← 1 TO 3
   Sum ← 0
   FOR Row ← 1 TO 2
      Sum ← Sum + Marks[Row, Col]
   NEXT Row
   OUTPUT "Col ", Col, " total: ", Sum
NEXT Col
```
- 5–9 行：先把表格填满：两层循环，行在外、列在内。
- 10–16 行：行优先：每走完一行就报一个结果。`Sum ← 0` 在外层里面，所以每行重新开始。
- 17–23 行：列优先：只是把两层对调，同一张表就按列算了。格子一个没动，问题变了。

示例运行：

```
Row 1 total: 6
Row 2 total: 12
Col 1 total: 3
Col 2 total: 6
Col 3 total: 9
```

**关卡**（single-choice）　把上面那段里的 `Sum ← 0` 从外层循环里面挪到两层循环之前，每行的结果会变成什么？

- **A** 编辑器会拦下来
  - ✗ 两个位置都合法。放错一层不会报错，只会算错——这正是麻烦的地方。
- **B** 没有区别
  - ✗ 有区别，而且只在第二行往后才看得出来。第一行的结果两种写法是一样的。
- **C** 第二行的结果里混进了第一行的数
  - ✓ 对。只清零一次，第一行加完的数还留在 `Sum` 里，第二行接着往上加。结果变成了「到这一行为止的累计」。
- **D** 每行都显示 0
  - ✗ 清零只发生在开头，之后循环照样往里加，不会一直是 0。


### 小节题： 每行的和｜`9.3.1`

写一段伪代码：读入一张 2 行 3 列的整数表格（按行读，先读满第一行再读第二行），然后显示每一行的和。

- **输入**：六行，各一个 `INTEGER`，按先行后列的顺序读入。每次读取之前都要显示提示语，一字不差：
`Enter a number`
- **输出**：两行，写成：
`Row <行号>: <这一行的和>`
冒号后面是一个空格。
- **必须用** `decl.array-2d` — 数据本来就是一张表，用二维数组存下来最直接。
- **必须用** `array.index-2d` — 指一个格子要同时给出行和列。
- **必须用** `loop.nested` — 一张表要两层循环才走得完：外层管行，内层管列。

提示：
1. 读入和求和可以分成两段，也可以在读的同时就把这一行加起来。
2. 每一行都要重新从 0 开始加——清零那一句放在外层循环里面、内层循环外面。
3. 显示那一行放在内层循环的后面、外层循环的里面，才能做到每行一条。

题面示例：
```
输入：1 / 2 / 3 / 10 / 20 / 30
输出：
Enter a number
Enter a number
Enter a number
Enter a number
Enter a number
Enter a number
Row 1: 6
Row 2: 60
```

<details><summary>参考解（学生看不到）</summary>

```
DECLARE Grid : ARRAY[1:2, 1:3] OF INTEGER
DECLARE Row : INTEGER
DECLARE Col : INTEGER
DECLARE Sum : INTEGER
FOR Row ← 1 TO 2
   FOR Col ← 1 TO 3
      OUTPUT "Enter a number"
      INPUT Grid[Row, Col]
   NEXT Col
NEXT Row
FOR Row ← 1 TO 2
   Sum ← 0
   FOR Col ← 1 TO 3
      Sum ← Sum + Grid[Row, Col]
   NEXT Col
   OUTPUT "Row ", Row, ": ", Sum
NEXT Row
```

判题用例（对学生隐藏，失败时只显示 caseHint）：

- `normal` 输入 4 / 5 / 6 / 7 / 8 / 9 — 两行的和不一样。
- `normal` 输入 1 / 1 / 1 / 2 / 2 / 2 — 每一行里的数都相同。
- `boundary` 输入 0 / 0 / 0 / 0 / 0 / 0 — 整张表都是零。
- `boundary` 输入 -1 / -2 / -3 / 1 / 2 / 3 — 一行全是负数，另一行全是正数，两行的和正好相反。
- `extreme` 输入 99999 / 1 / 1 / 1 / 1 / 99999 — 两个很大的数分别落在两行。

</details>

---

## 9.4　一维还是二维

<sub>§10.2｜约 7 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`、`assign.simple`、`decl.constant`、`op.arithmetic`、`op.div`、`op.mod`、`op.relational`、`op.and`、`op.or`、`op.not`、`select.if`、`select.if-else`、`select.nested-if`、`select.case`、`select.case-range`、`select.case-otherwise`、`loop.for`、`loop.for-step`、`loop.while`、`loop.repeat`、`loop.nested`、`builtin.length`、`builtin.mid`、`builtin.right`、`builtin.ucase`、`builtin.lcase`、`op.concat`、`builtin.int`、`builtin.rand`、`decl.array-1d`、`array.index`、`decl.array-2d`、`array.index-2d`</sub>

判据和第 6 章挑循环一样简单：**这批数据要用几个编号才指得准？**一个编号就够——第几个学生、第几天——用一维；要两个——第几个学生的第几科、第几行的第几列——用二维。

反过来问也一样：**把数据摆在纸上，是一列还是一张表？**考试成绩单是一张表（人 × 科目），一周的气温是一列（只有天）。摆得出来是什么形状，就用什么形状的数组。

二维能做的事一维硬凑也能做——`ARRAY[1:6]` 装 3 个学生 2 科，自己算「第 `S` 个学生的第 `M` 科是第 `(S - 1) * 2 + M` 格」。能跑，但每次访问都要算一遍，算错一次就全乱，而且别人读你的代码要先解开这个公式。**形状对上了，代码就不用做换算。**

> **规则**（CAIE 规定）　一维和二维数组都是 Pseudocode Guide 的正式写法。为一个问题挑哪一种，要说得出理由——理由落在「指准一个数据要几个编号」上（§10.2）。

**关卡**（single-choice）　下面哪种数据**应该**用二维数组？

- **A** 一周七天的最高气温
  - ✗ 只有「第几天」一个编号。摆在纸上是一列，不是一张表。
- **B** 一个学生的姓名
  - ✗ 这只是一个值，连数组都不需要，一个 `STRING` 变量就够了。
- **C** 5 个班各自 4 个小组的人数
  - ✓ 对。要指准一个数得说清「第几班的第几组」，两个编号，正好是一张 5 行 4 列的表。
- **D** 一个班 30 个学生的总分
  - ✗ 一个编号就够了——第几个学生。这是一列，用一维数组。


---


## 章末大题： 成绩表｜`9.T1`

写一段伪代码：读入 3 个学生各 2 科的成绩（按学生逐个读，每个学生先读第 1 科再读第 2 科），然后显示每个学生的总分和每一科的平均分。

- **输入**：六行，各一个 `INTEGER`，按先学生后科目的顺序读入。每次读取之前都要显示提示语，一字不差：
`Enter a mark`
- **输出**：读完之后显示五行——先三行学生总分，再两行科目平均：
`Student <编号> total: <总分>`
`Subject <编号> average: <平均分>`　（取整数商）
每个冒号后面都是一个空格。
- **建议用到**：`decl.array-2d`、`array.index-2d`、`loop.for`、`loop.nested`、`op.arithmetic`、`op.div`、`io.input`、`io.output`

提示：
1. 「每个学生的总分」和「每一科的平均分」走的是同一张表，但两层循环的里外正好相反。
2. 累加变量要在外层循环里面清零——不然上一轮的结果会被带到下一轮。
3. 读入的顺序和后面怎么算无关：存进去的时候行是学生、列是科目，取的时候按需要挑先走哪一层。

题面示例：
```
输入：80 / 70 / 55 / 90 / 100 / 40
输出：
Enter a mark
Enter a mark
Enter a mark
Enter a mark
Enter a mark
Enter a mark
Student 1 total: 150
Student 2 total: 145
Student 3 total: 140
Subject 1 average: 78
Subject 2 average: 66
```

<details><summary>参考解（学生看不到）</summary>

```
DECLARE Marks : ARRAY[1:3, 1:2] OF INTEGER
DECLARE Student : INTEGER
DECLARE Subject : INTEGER
DECLARE Total : INTEGER
FOR Student ← 1 TO 3
   FOR Subject ← 1 TO 2
      OUTPUT "Enter a mark"
      INPUT Marks[Student, Subject]
   NEXT Subject
NEXT Student
FOR Student ← 1 TO 3
   Total ← 0
   FOR Subject ← 1 TO 2
      Total ← Total + Marks[Student, Subject]
   NEXT Subject
   OUTPUT "Student ", Student, " total: ", Total
NEXT Student
FOR Subject ← 1 TO 2
   Total ← 0
   FOR Student ← 1 TO 3
      Total ← Total + Marks[Student, Subject]
   NEXT Student
   OUTPUT "Subject ", Subject, " average: ", Total DIV 3
NEXT Subject
```

判题用例（对学生隐藏，失败时只显示 caseHint）：

- `normal` 输入 90 / 60 / 70 / 80 / 50 / 100 — 三个学生两科成绩各不相同。
- `boundary` 输入 50 / 50 / 50 / 50 / 50 / 50 — 所有成绩一模一样。
- `boundary` 输入 0 / 0 / 0 / 0 / 0 / 1 — 几乎全是零，只有最后一格不是——平均分会被整除截掉。
- `normal` 输入 100 / 0 / 0 / 100 / 100 / 0 — 每个学生都是一科满分一科零分。
- `extreme` 输入 99999 / 1 / 1 / 1 / 1 / 99999 — 两个很大的分数落在不同的学生和科目上。

</details>
