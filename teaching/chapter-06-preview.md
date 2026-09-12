# Chapter 6 — 循环的选择与嵌套  `[AS]`

对应 §11.2｜内容预览（不是最终版式，只是把数据平铺出来读）


---

## 6.1　三种循环怎么挑

<sub>§11.2｜约 9 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`、`assign.simple`、`decl.constant`、`op.arithmetic`、`op.div`、`op.mod`、`op.relational`、`op.and`、`op.or`、`op.not`、`select.if`、`select.if-else`、`select.nested-if`、`select.case`、`select.case-range`、`select.case-otherwise`、`loop.for`、`loop.for-step`、`loop.while`、`loop.repeat`</sub>

第 5 章把三种循环分别讲了一遍。它们能做的事其实大面积重叠——同一个任务往往三种都写得出来。所以真正要学的不是「哪种能做」，而是**哪种最合适**。

只问两个问题就够了。**第一个：开始之前，知道要跑多少遍吗？**知道就用 `FOR`。「显示 10 行」「处理 7 天的数据」「从 1 加到 N」都算知道——`N` 是读进来的也算，因为读到它的那一刻次数就定下来了。

**第二个：如果条件一开始就不成立，应该跑几遍？**该跑 0 遍就用 `WHILE`，该跑 1 遍就用 `REPEAT`。「余额不够就一件也不买」是 0 遍；「不问一次就不知道用户想干什么」是 1 遍。

第一个问题优先。次数已知时 `WHILE` 也做得到，但你得自己写循环计数器的三件事——设初值、写条件、每遍加一。漏掉「每遍加一」，条件就再也变不了，这正是 5.3 说的死循环；漏掉另外两件则是跑错遍数。`FOR` 把这三件事收进了一行，一件都漏不掉。

> **规则**（CAIE 规定）　三种循环结构在 Pseudocode Guide 里是并列的正式写法，哪一种都不是默认；为一个任务挑哪一种，要说得出理由（§11.2）。

**对照：同一件事，不同的代价**

「显示五行」这件事三种循环都做得到，但写出来的东西不一样重。

*自然语言*
```
把这句话显示五遍。
```
> 人听到「五遍」就知道该数到五。程序需要有人把「从哪儿开始、到哪儿结束、每遍怎么变」全都写出来。

*伪代码 · `FOR`*
```
DECLARE I : INTEGER
FOR I ← 1 TO 5
   OUTPUT "Line ", I
NEXT I
```
> 一行说清了三件事：从 1 开始、到 5 结束、每遍加 1。计数器的事全交给结构本身。

*伪代码 · `WHILE`*
```
DECLARE I : INTEGER
I ← 1
WHILE I <= 5
   OUTPUT "Line ", I
   I ← I + 1
ENDWHILE
```
> 同样的结果，但循环计数器的三件事散在三个地方：设初值、写条件、每遍加一。漏掉最后那一行就成了死循环。

*Python*
```python
for i in range(1, 6):
    print("Line", i)
```
> Python 的 `range(1, 6)` 取不到 6，而伪代码的 `TO 5` 取得到 5。两种记法都要数五遍，但端点的规矩不一样。

**关卡**（single-choice）　「一直向用户要一个 1 到 5 的数字，直到他输入合法为止」——该用哪种循环？

- **A** `FOR`
  - ✗ 用户可能一次就输对，也可能输错十次。次数事先不知道，`FOR` 的起点终点没法写。
- **B** `WHILE`
  - ✗ 能写，但别扭：判断条件时手里得先有个值，所以必须在循环前面先问一次，那两行就得写两遍。
- **C** 三种都一样，随便挑
  - ✗ 三种确实都写得出来，但代价不一样：`FOR` 写不出，`WHILE` 要重复两行。挑的就是代价最小的那个。
- **D** `REPEAT`
  - ✓ 对。不问一次就没有值可以检查，所以「至少跑一遍」是这件事的本来面目，条件放在后面正合适。


---

## 6.2　挑错了会怎样

<sub>§11.2｜约 9 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`、`assign.simple`、`decl.constant`、`op.arithmetic`、`op.div`、`op.mod`、`op.relational`、`op.and`、`op.or`、`op.not`、`select.if`、`select.if-else`、`select.nested-if`、`select.case`、`select.case-range`、`select.case-otherwise`、`loop.for`、`loop.for-step`、`loop.while`、`loop.repeat`</sub>

挑错循环，有时候只是代码难看一点，有时候结果会直接错掉，而且程序照跑不误、一条提示都没有。最典型的一种：**该跑 0 遍的事用了 `REPEAT`**。

假设规则是「每件商品 10 元，余额够就买一件，一直买到不够为止」。余额只有 5 元时，正确的行为是一件也不买。

换成 `WHILE`，条件挪到前面，其余一个字不改，结果就对了。注意条件的方向也跟着变：`WHILE` 写的是「什么时候继续」，`REPEAT` 写的是「什么时候停」，两者互为反面。

这类错误有个共同点：**它只在一种输入下露馅**。余额 25 元时两种写法结果一样，都是买 2 件剩 5 元；只有余额本来就不够的时候，差别才出现。

**反例：用 `REPEAT` 写「余额够才买」**

```
DECLARE Balance : INTEGER
DECLARE Bought : INTEGER
Bought ← 0
OUTPUT "Enter the balance"
INPUT Balance
REPEAT
   Balance ← Balance - 10
   Bought ← Bought + 1
UNTIL Balance < 10
OUTPUT "Bought: ", Bought
OUTPUT "Left: ", Balance
```
输入 5，它显示 `Bought: 1` 和 `Left: -5`——只有 5 元却买了一件，余额成了负数。这段代码语法全对、类型全对、跑得完，编辑器**一条提示都没有**。它只是回答了错的问题：`REPEAT` 问的是「做完一次之后要不要再做」，而这里该问的是「到底要不要做」。


**示例：把条件挪到前面**　`Example_6_2_a.pseudocode`

```
DECLARE Balance : INTEGER
DECLARE Bought : INTEGER
Bought ← 0
OUTPUT "Enter the balance"
INPUT Balance
WHILE Balance >= 10
   Balance ← Balance - 10
   Bought ← Bought + 1
ENDWHILE
OUTPUT "Bought: ", Bought
OUTPUT "Left: ", Balance
```
- 第 6 行：条件在循环体之前判断。余额不够时不成立，整个循环体一遍都不跑。
- 6–9 行：和上面那段反例相比，改动只有这一处：条件从末尾挪到开头，方向也跟着反过来。

示例运行（`>` 开头的那行是输入）：

```
Enter the balance
> 5
Bought: 0
Left: 5
```

**关卡**（single-choice）　上面两个版本，输入 25 时结果有区别吗？

- **A** `REPEAT` 版会报错
  - ✗ 两个版本都合法、都跑得完。这正是这类错误麻烦的地方——没有任何提示。
- **B** 没有区别，两个都是买 2 件、剩 5 元
  - ✓ 对。25 元时循环体本来就该跑，「先做再判断」和「先判断再做」得到的是同一串动作。区别只在循环体一遍都不该跑的时候才出现。
- **C** 有，`REPEAT` 版会多买一件
  - ✗ 25 元足够买第一件，两个版本在这里的行为完全一样：买、再判断。
- **D** 有，`WHILE` 版会少买一件
  - ✗ `WHILE` 不会少跑：只要条件成立它就继续，25 到 15 到 5，正好两遍。


---

## 6.3　嵌套循环：外层一遍，内层跑完一整轮

<sub>§11.2｜约 9 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`、`assign.simple`、`decl.constant`、`op.arithmetic`、`op.div`、`op.mod`、`op.relational`、`op.and`、`op.or`、`op.not`、`select.if`、`select.if-else`、`select.nested-if`、`select.case`、`select.case-range`、`select.case-otherwise`、`loop.for`、`loop.for-step`、`loop.while`、`loop.repeat`、`loop.nested`</sub>

循环体里可以再放一个循环，这叫**嵌套循环（nested loop）**。规则只有一条，但要想清楚：**外层每跑一遍，内层就要从头到尾完整跑一轮。**

所以外层 3 遍、内层 4 遍时，最里面那句话执行的是 3 乘 4 等于 12 次，不是 3 加 4 等于 7 次。

两层循环的控制变量必须是两个不同的变量。内层用完自己那个变量后，下一次外层再进来时它会重新从起点开始——这是自动的，不用手动重置。

嵌套也不限于同一种循环：外层 `FOR`、内层 `WHILE` 完全正常。挑哪一种仍然按 6.1 的两个问题问，只不过要**分别问两次**：外层跑多少遍是一个问题，内层跑多少遍是另一个问题。

> **规则**（CAIE 规定）　嵌套的循环每一层都要有自己的控制变量与自己的结束标记，各缩进一级（Pseudocode Guide §7.1）。

**示例：数一数最里面跑了几次**　`Example_6_3_a.pseudocode`

```
DECLARE I : INTEGER
DECLARE J : INTEGER
DECLARE N : INTEGER
N ← 0
FOR I ← 1 TO 3
   FOR J ← 1 TO 4
      N ← N + 1
   NEXT J
NEXT I
OUTPUT "Body ran ", N, " times"
```
- 第 5 行：外层跑 3 遍，`I` 依次是 1、2、3。
- 第 6 行：每次进到这里，`J` 都重新从 1 开始数到 4。
- 第 7 行：这一句被执行的次数是两层次数的乘积。
- 8–9 行：两个 `NEXT`，各自关掉一层。先关内层，再关外层——顺序不能交叉。

示例运行：

```
Body ran 12 times
```

**关卡**（single-choice）　外层 `FOR I ← 1 TO 5`，内层 `FOR J ← 1 TO 3`，最里面那一句执行多少次？

- **A** 3 次
  - ✗ 3 是内层一轮的遍数，那只是外层第一遍的情况。
- **B** 15 次
  - ✓ 对。外层每一遍都要把内层从 1 到 3 完整跑一轮，所以是 5 乘 3。
- **C** 8 次
  - ✗ 把两层相加，等于把它们当成先后发生的两件事。嵌套不是先后，是包含。
- **D** 5 次
  - ✗ 5 是外层的遍数。外层跑一遍，里面那句话已经执行了 3 次。


---

## 6.4　嵌套循环的两种常见形状

<sub>§11.2｜约 8 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`、`assign.simple`、`decl.constant`、`op.arithmetic`、`op.div`、`op.mod`、`op.relational`、`op.and`、`op.or`、`op.not`、`select.if`、`select.if-else`、`select.nested-if`、`select.case`、`select.case-range`、`select.case-otherwise`、`loop.for`、`loop.for-step`、`loop.while`、`loop.repeat`、`loop.nested`</sub>

嵌套循环看着抽象，实际用途集中在两种形状上。认出形状，代码就写得出来。**第一种是行和列**：外层管行，内层管列。乘法表、日历、成绩表都是这个形状，凡是「一张表格」都是两层循环。

**第二种是内层的次数随外层变**：内层的终点不写死，而是写成外层的控制变量，比如 `FOR J ← 1 TO I`。这样第一行做 1 次、第二行做 2 次……画出来是个三角形。

要留心的是**输出的位置**。写在内层里面，每算一个就显示一行；写在内层外面、外层里面，每行显示一次；写在两层外面，整个过程只显示一次。这三个位置给出的结果完全不同，而缩进正好把位置写得清清楚楚。

**示例：两行乘法表**　`Example_6_4_a.pseudocode`

```
DECLARE I : INTEGER
DECLARE J : INTEGER
FOR I ← 1 TO 2
   FOR J ← 1 TO 3
      OUTPUT I, " x ", J, " = ", I * J
   NEXT J
NEXT I
```
- 第 3 行：外层管行，`I` 是被乘数。
- 第 4 行：内层管列，`J` 从 1 数到 3。
- 第 5 行：这一句在最里层，所以每一对 `I`、`J` 都显示一行，一共 2 乘 3 等于 6 行。

示例运行：

```
1 x 1 = 1
1 x 2 = 2
1 x 3 = 3
2 x 1 = 2
2 x 2 = 4
2 x 3 = 6
```

**关卡**（single-choice）　把上面的 `OUTPUT` 那一行从内层里面挪到 `NEXT J` 的后面（仍在外层里面），会怎样？

- **A** 还是 6 行，只是顺序变了
  - ✗ 显示几行取决于这一句被执行几次。离开内层之后，它一轮只执行一次。
- **B** 一共显示 3 行
  - ✗ 3 是内层的遍数。这一句现在归外层管，和内层跑几遍没关系了。
- **C** 编辑器会拦下来
  - ✗ 两个位置都合法。这正是要小心的地方：位置放错不会报错，只会算错。
- **D** 一共显示 2 行
  - ✓ 对。挪到 `NEXT J` 后面它就归外层管了——外层跑几遍就显示几遍，不再是每一列各一行。


### 小节题： 倒三角｜`6.4.1`

写一段伪代码：提示并读入一个整数 `N`，显示 `N` 组数字——第一组是 1 个 `1`，第二组是 2 个 `2`，一直到第 `N` 组是 `N` 个 `N`。每个数字各占一行。

- **输入**：一行，一个 `INTEGER`。提示语排在读取之前，一字不差：
`Enter a number`
- **输出**：若干行，每行一个数字。读到的数不是正数时，一行都不显示。
- **必须用** `loop.nested` — 外层管第几组，内层管这一组要显示几个，两件事必须分成两层。
- **必须用** `loop.for` — 两层的次数在进入循环时都已经算得出来，不需要边跑边判断。
- **不能用** `loop.while` — 次数都是已知的，这一题要练的是把计数交给 `FOR` 的两层写法。

提示：
1. 第几组和这一组要显示几个，是同一个数。内层的终点可以直接写外层的控制变量。
2. 每行要显示的内容也是那个数：内层里显示的是外层的控制变量，不是内层的。

题面示例：
```
输入：2
输出：
Enter a number
1
2
2
```

<details><summary>参考解（学生看不到）</summary>

```
DECLARE Number : INTEGER
DECLARE I : INTEGER
DECLARE J : INTEGER
OUTPUT "Enter a number"
INPUT Number
FOR I ← 1 TO Number
   FOR J ← 1 TO I
      OUTPUT I
   NEXT J
NEXT I
```

判题用例（对学生隐藏，失败时只显示 caseHint）：

- `normal` 输入 3 — 一个很小的数。
- `normal` 输入 5 — 一个普通大小的数。
- `boundary` 输入 1 — 只该显示一行的那个数。
- `boundary` 输入 0 — 一行都不该显示的那个数。
- `extreme` 输入 9 — 会显示很多行的一个数。

</details>

---


## 章末大题： 三个班的分数｜`6.T1`

写一段伪代码：依次统计三个班的分数。每个班的人数事先不知道，读到 -1 表示这个班录完了；三个班全部录完后程序结束。某个班可能一个分数都没有。

- **输入**：若干行，每行一个 `INTEGER`。每次读取之前都要显示提示语，一字不差：
`Enter a score`
每个班以 -1 结束，-1 本身不是分数。
- **输出**：每个班录完后立刻显示一行：
`Class <班号>: count <人数> total <总分>`
班号从 1 到 3。一个分数都没有的班显示 `count 0 total 0`。
- **建议用到**：`loop.for`、`loop.while`、`loop.nested`、`op.relational`、`io.input`、`io.output`

提示：
1. 这道题里有两层循环，两层要分别按 6.1 的两个问题挑：班数是事先知道的，人数不是。
2. 每进一个新班，计数和总分都要重新从 0 开始——这两句放在哪一层里，位置很重要。
3. 显示那一行放在内层循环的后面、外层循环的里面，才能做到每班一行。

题面示例：
```
输入：10 / 20 / -1 / 30 / -1 / -1
输出：
Enter a score
Enter a score
Enter a score
Class 1: count 2 total 30
Enter a score
Enter a score
Class 2: count 1 total 30
Enter a score
Class 3: count 0 total 0
```

<details><summary>参考解（学生看不到）</summary>

```
DECLARE ClassNo : INTEGER
DECLARE Score : INTEGER
DECLARE Count : INTEGER
DECLARE Total : INTEGER
FOR ClassNo ← 1 TO 3
   Count ← 0
   Total ← 0
   OUTPUT "Enter a score"
   INPUT Score
   WHILE Score <> -1
      Total ← Total + Score
      Count ← Count + 1
      OUTPUT "Enter a score"
      INPUT Score
   ENDWHILE
   OUTPUT "Class ", ClassNo, ": count ", Count, " total ", Total
NEXT ClassNo
```

判题用例（对学生隐藏，失败时只显示 caseHint）：

- `normal` 输入 80 / 70 / -1 / -1 / 90 / -1 — 中间那个班一个人都没有。
- `normal` 输入 50 / -1 / 60 / 70 / -1 / 80 / -1 — 三个班人数各不相同。
- `boundary` 输入 -1 / -1 / -1 — 三个班一个分数都没有。
- `boundary` 输入 0 / -1 / -1 / 100 / -1 — 出现了最低分和最高分，中间那个班是空的。
- `extreme` 输入 99999 / 1 / -1 / -1 / -1 — 第一个班里有一个非常大的分数。

</details>
