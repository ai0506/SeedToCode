# Chapter 10 — 线性查找与冒泡排序  `[AS]`

对应 §10.2｜内容预览（不是最终版式，只是把数据平铺出来读）


---

## 10.1　线性查找

<sub>§10.2｜约 9 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`、`assign.simple`、`decl.constant`、`op.arithmetic`、`op.div`、`op.mod`、`op.relational`、`op.and`、`op.or`、`op.not`、`select.if`、`select.if-else`、`select.nested-if`、`select.case`、`select.case-range`、`select.case-otherwise`、`loop.for`、`loop.for-step`、`loop.while`、`loop.repeat`、`loop.nested`、`builtin.length`、`builtin.mid`、`builtin.right`、`builtin.ucase`、`builtin.lcase`、`op.concat`、`builtin.int`、`builtin.rand`、`decl.array-1d`、`array.index`、`decl.array-2d`、`array.index-2d`</sub>

到目前为止对数组做的事都要把每一格走到：求和、求最大、找出高于平均的。查找不一样——**要找的东西可能在第 1 格，可能在最后一格，也可能根本不在里面**。

最直接的做法就叫**线性查找（linear search）**：从第一格开始，拿它跟要找的值比一比，不是就看下一格，一格一格往下走。「线性」说的就是这条路线——排着队走过去，不跳。

用 `FOR` 就能把这条路线写出来：走遍每一格，相等就报出来。但这样写有个代价——**它非把每一格都走完不可**。要找的东西在第 1 格，后面 99 格照样白比一遍。

而且报出来的不只是「有」。停在哪一格，那个下标本身就是答案的一部分：你多半不只想知道在不在，还想知道在第几格。

> **规则**（CAIE 规定）　线性查找是考纲点名的两个标准算法之一：从第一格开始逐格比对，直到比中或者走完（§10.2）。

**示例：走遍每一格，比中就报**　`Example_10_1_a.pseudocode`

```
CONSTANT Size = 5
DECLARE Scores : ARRAY[1:Size] OF INTEGER
DECLARE Target : INTEGER
Scores[1] ← 30
Scores[2] ← 80
Scores[3] ← 45
Scores[4] ← 80
Scores[5] ← 12
Target ← 80
FOR I ← 1 TO Size
   IF Scores[I] = Target THEN
      OUTPUT "Found at ", I
   ENDIF
NEXT I
```
- 第 9 行：要找的值。把它单独放进一个变量，换个目标只要改这一行。
- 10–14 行：从第 1 格走到第 5 格，每一格都跟 `Target` 比一次。
- 11–13 行：相等就报出下标。注意这里报完还接着走——`FOR` 不会因为找到了就停。

示例运行：

```
Found at 2
Found at 4
```

**关卡**（single-choice）　把上面那段里的 `Target` 改成 `99`（数组里没有这个数），运行之后屏幕上会看到什么？

- **A** 什么都没有，程序正常结束
  - ✓ 对。`IF` 一次都没成立，`OUTPUT` 就一次都没执行。程序跑完了，只是什么也没说——「没找到」和「程序没跑」在屏幕上长得一模一样。
- **B** 显示 `Found at 0`
  - ✗ 不会。`OUTPUT` 只写在 `IF` 里面，条件没成立它就不执行，不存在一个「表示没找到」的默认输出。
- **C** 程序在运行时停下来报错
  - ✗ 没有任何一步出错：下标始终在 1 到 5 之间，比较也合法。找不到不是错误，只是结果。
- **D** 编辑器在运行前就拦下来
  - ✗ 这段代码的写法完全正确。编辑器不知道数组里将来会放什么值，也就无从判断找不找得到。


---

## 10.2　找不到的情况怎么写

<sub>§10.2｜约 11 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`、`assign.simple`、`decl.constant`、`op.arithmetic`、`op.div`、`op.mod`、`op.relational`、`op.and`、`op.or`、`op.not`、`select.if`、`select.if-else`、`select.nested-if`、`select.case`、`select.case-range`、`select.case-otherwise`、`loop.for`、`loop.for-step`、`loop.while`、`loop.repeat`、`loop.nested`、`builtin.length`、`builtin.mid`、`builtin.right`、`builtin.ucase`、`builtin.lcase`、`op.concat`、`builtin.int`、`builtin.rand`、`decl.array-1d`、`array.index`、`decl.array-2d`、`array.index-2d`</sub>

上一节那段有两处要补：找到了还接着把剩下的格子走完，而找不到的时候屏幕上一个字都没有。要补这两处，只需要一个 `BOOLEAN` 变量。

这种「记录某件事有没有发生过」的变量叫**标志（flag）**。开始时设成 `FALSE`，一旦比中就改成 `TRUE`。循环结束之后看它一眼，就知道到底找没找到——这句话，屏幕上必须有。

有了标志，循环的条件就写得出来了：`WHILE Found = FALSE AND Position <= Size`——**还没找到、而且还没走完**，才继续走。两个条件里任何一个不成立，循环立刻停。这正是第 5 章说的「次数事先不知道」：走几格取决于数据。标志本身就是一个布尔值，所以这个条件有两种写法：`Found = FALSE` 是拿它和 `FALSE` 比一次，`NOT Found` 是直接把它反过来，**两种意思完全一样，考试都接受**；这里写成 `Found = FALSE` 是因为它把「在比什么」摆在明面上，而别人的代码里 `NOT Found` 更常见，要认得出来。

`Position` 停在哪里也是结果的一部分：找到时它停在那一格上，没找到时它已经越过上界。所以**先看标志，再决定 `Position` 能不能拿来用**——顺序反了就会报出一个根本不存在的位置。

**示例：带标志的线性查找**　`Example_10_2_a.pseudocode`

```
CONSTANT Size = 5
DECLARE Scores : ARRAY[1:Size] OF INTEGER
DECLARE Position : INTEGER
DECLARE Target : INTEGER
DECLARE Found : BOOLEAN
Scores[1] ← 30
Scores[2] ← 80
Scores[3] ← 45
Scores[4] ← 80
Scores[5] ← 12
Target ← 99
Found ← FALSE
Position ← 1
WHILE Found = FALSE AND Position <= Size
   IF Scores[Position] = Target THEN
      Found ← TRUE
   ELSE
      Position ← Position + 1
   ENDIF
ENDWHILE
IF Found = TRUE THEN
   OUTPUT "Found at ", Position
ELSE
   OUTPUT "Not in the list"
ENDIF
```
- 12–13 行：两个起点：还没找到，从第 1 格开始。这两行少一行，循环第一次就判断不了。
- 第 14 行：两个继续条件。找到了，或者走过头了，都停。
- 15–19 行：比中就把标志立起来——注意这时**不再加 1**，`Position` 要停在命中的那一格上。没比中才往前走。
- 21–25 行：循环之后先看标志。这段 `ELSE` 就是上一节缺的那句话。

示例运行：

```
Not in the list
```

**关卡**（single-choice）　把 `Position ← Position + 1` 从 `ELSE` 里挪出来、放到 `ENDIF` 后面（也就是每一轮都加一），找得到的时候会发生什么？

- **A** 会变成找不到
  - ✗ `Found` 照样被设成 `TRUE`，所以走的还是「找到了」那一支，只是报出来的格子不对。
- **B** 运行时越界停下来
  - ✗ 多加的那一次发生在循环体的末尾，加完循环就判断条件并退出，不会再拿这个下标去取格子。
- **C** 报出来的位置比真实位置大一
  - ✓ 对。比中的那一轮把标志立起来之后又多加了一次，`Position` 已经越过命中的格子。第 3 格命中会报成第 4 格。
- **D** 结果不变，只是多走一步
  - ✗ 循环确实立刻就停了，但停下来时 `Position` 的值已经被改过，而这个值正是要报出来的答案。


### 小节题： 在名单里找一个数｜`10.2.1`

写一段伪代码：先读入 6 个整数存进数组，再读入一个要找的数，显示它在数组里的位置；不在里面就说一声。同一个数出现两次时，报**第一次**出现的位置。

- **输入**：先六行，各一个 `INTEGER`；再一行，是要找的数。每次读取之前都要显示提示语，一字不差：
前六次是 `Enter a number`，最后一次是 `Enter the number to find`
- **输出**：一行。找到时写成：
`Found at <位置>`
找不到时写成：
`Not found`
`Found at` 和位置之间是一个空格。
- **必须用** `decl.array-1d` — 六个数要先全部存下来，才谈得上在里面找。
- **必须用** `loop.while` — 找到就该停下来，走几格事先不知道——这正是 `WHILE` 的场合。
- **必须用** `select.if-else` — 找到和找不到都要有交代，屏幕上不能什么都不显示。

提示：
1. 用一个 `BOOLEAN` 记住「找到了没有」，循环之前先把它设成 `FALSE`。
2. 循环的继续条件有两个：还没找到，而且还没走过上界。
3. 比中的那一轮不要再让下标往前走，否则报出来的位置会多一格。

题面示例：
```
输入：30 / 80 / 45 / 80 / 12 / 7 / 45
输出：
Enter a number
Enter a number
Enter a number
Enter a number
Enter a number
Enter a number
Enter the number to find
Found at 3
```

<details><summary>参考解（学生看不到）</summary>

```
DECLARE Values : ARRAY[1:6] OF INTEGER
DECLARE Target : INTEGER
DECLARE Found : BOOLEAN
FOR Position ← 1 TO 6
   OUTPUT "Enter a number"
   INPUT Values[Position]
NEXT Position
OUTPUT "Enter the number to find"
INPUT Target
Found ← FALSE
Position ← 1
WHILE Found = FALSE AND Position <= 6
   IF Values[Position] = Target THEN
      Found ← TRUE
   ELSE
      Position ← Position + 1
   ENDIF
ENDWHILE
IF Found = TRUE THEN
   OUTPUT "Found at ", Position
ELSE
   OUTPUT "Not found"
ENDIF
```

判题用例（对学生隐藏，失败时只显示 caseHint）：

- `normal` 输入 5 / 9 / 2 / 8 / 4 / 1 / 8 — 要找的数在中间某一格，只出现一次。
- `boundary` 输入 5 / 9 / 2 / 8 / 4 / 1 / 5 — 要找的数就在第一格。
- `boundary` 输入 5 / 9 / 2 / 8 / 4 / 1 / 1 — 要找的数在最后一格，要一直走到头才碰到。
- `abnormal` 输入 5 / 9 / 2 / 8 / 4 / 1 / 7 — 要找的数根本不在这批数里。
- `normal` 输入 3 / 7 / 3 / 7 / 3 / 7 / 7 — 要找的数出现了好几次，应当报最靠前的那一次。
- `extreme` 输入 -99999 / 0 / 0 / 0 / 0 / 99999 / 99999 — 一批数里混着很大和很小的值，要找的是最大的那个。

</details>

---

## 10.3　冒泡排序的思路

<sub>§10.2｜约 10 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`、`assign.simple`、`decl.constant`、`op.arithmetic`、`op.div`、`op.mod`、`op.relational`、`op.and`、`op.or`、`op.not`、`select.if`、`select.if-else`、`select.nested-if`、`select.case`、`select.case-range`、`select.case-otherwise`、`loop.for`、`loop.for-step`、`loop.while`、`loop.repeat`、`loop.nested`、`builtin.length`、`builtin.mid`、`builtin.right`、`builtin.ucase`、`builtin.lcase`、`op.concat`、`builtin.int`、`builtin.rand`、`decl.array-1d`、`array.index`、`decl.array-2d`、`array.index-2d`</sub>

查找是从一排数里挑一个，排序是把整排重新摆好。**冒泡排序（bubble sort）**的办法出奇地笨：它一次只看**相邻的两格**，前面那格比后面那格大，就把这两个值**交换（swap）**过来。

交换两个格子要**借第三个变量**。直接写 `A ← B` 再写 `B ← A` 是不行的：第一句一执行，A 原来的值就被盖掉了，第二句再写回去，两边就都成了 B。所以先把 A 存进一个临时变量，再腾地方。

从头到尾这样比一遍，叫走了**一趟（pass）**。一趟走完，最大的那个数一定被推到了最后一格——它每次比较都比对方大，于是一路往右挪到头，像气泡一样浮上去，名字就是这么来的。

但一趟只安顿了一个数。剩下的还乱着，所以要再走一趟把第二大的送到倒数第二格，再走一趟送第三大的……下一节就把这些趟数套起来。

**示例：只走一趟**　`Example_10_3_a.pseudocode`

```
CONSTANT Size = 5
DECLARE Values : ARRAY[1:Size] OF INTEGER
DECLARE Temp : INTEGER
Values[1] ← 3
Values[2] ← 9
Values[3] ← 1
Values[4] ← 7
Values[5] ← 5
FOR J ← 1 TO Size - 1
   IF Values[J] > Values[J + 1] THEN
      Temp ← Values[J]
      Values[J] ← Values[J + 1]
      Values[J + 1] ← Temp
   ENDIF
NEXT J
FOR J ← 1 TO Size
   OUTPUT Values[J]
NEXT J
```
- 第 9 行：五格只比四对：第 5 格没有右邻居，所以终点是 4 而不是 5。
- 10–14 行：只比相邻的两格。整个冒泡排序就只做这一件事，别的都是重复它。
- 11–13 行：三步交换：先把左边的值存起来，再把右边的搬过来，最后把存着的那个放到右边。
- 16–18 行：一趟之后的样子：最大的 9 已经在最后一格了，前面几个还乱着。

示例运行：

```
3
1
7
5
9
```

**反例：不借临时变量的「交换」**

```
DECLARE Values : ARRAY[1:2] OF INTEGER
Values[1] ← 3
Values[2] ← 9
Values[1] ← Values[2]
Values[2] ← Values[1]
OUTPUT Values[1]
OUTPUT Values[2]
```
两行看着像是把值对调，跑出来却是两个 9。第一行把 `Values[1]` 原来的 3 盖掉了，第二行再取 `Values[1]` 时取到的已经是刚搬进去的 9。**这段代码零提示、跑得完**——只是 3 没了。


**关卡**（single-choice）　一排 6 个数，走完**第一趟**之后，下面哪一件事一定成立？

- **A** 整排已经排好了
  - ✗ 只有碰巧的时候才会。一趟安顿的是末尾那一个，前面的顺序仍然可能是乱的。
- **B** 至少发生了一次交换
  - ✗ 本来就已经排好的一排，走一趟一次也不会换。下一节末尾正是利用这一点提前收工。
- **C** 最大的那个数已经在最后一格
  - ✓ 对。最大的数无论从哪一格出发，每一次比较都会赢，于是被一路往右换到头。这是一趟唯一能保证的事。
- **D** 最小的那个数已经在第一格
  - ✗ 不一定。小的数每趟最多往左挪一格：它只有在跟左邻居比的那一次才会被换过去。


---

## 10.4　写出冒泡排序

<sub>§10.2｜约 11 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`、`assign.simple`、`decl.constant`、`op.arithmetic`、`op.div`、`op.mod`、`op.relational`、`op.and`、`op.or`、`op.not`、`select.if`、`select.if-else`、`select.nested-if`、`select.case`、`select.case-range`、`select.case-otherwise`、`loop.for`、`loop.for-step`、`loop.while`、`loop.repeat`、`loop.nested`、`builtin.length`、`builtin.mid`、`builtin.right`、`builtin.ucase`、`builtin.lcase`、`op.concat`、`builtin.int`、`builtin.rand`、`decl.array-1d`、`array.index`、`decl.array-2d`、`array.index-2d`</sub>

一趟送一个数到位，那就多走几趟：**外层数趟数，内层走一趟**——又是一对嵌套循环，只不过这回内层做的事是比较和交换。

5 个数要走几趟？4 趟。前四趟把最大的四个依次安顿好，剩下的那一个自然就在第一格了——**n 个数最多走 n-1 趟**。

内层的终点每趟都往回缩一格：第 `I` 趟开始时，末尾已经有 `I - 1` 个到位了，不必再碰。写成 `FOR J ← 1 TO Size - I`，随着趟数递增自动缩短。

为什么内层的终点要减 `I`，而不是每趟都走到底？因为内层比的是 `Values[J]` 和 `Values[J + 1]`：J 走到哪儿，右边那一格就得还在数组里。终点写成 `Size`，第一趟 J 就会走到最后一格，而它右边那一格根本不存在——程序会在那一行停下来。顺便看一眼示例的第一行：格子数写成了常量 `Size`，于是数组的上界、外层的趟数、内层的终点、最后显示那一圈全都跟着它走——要改成 10 个数，只动第一行。

> **规则**（CAIE 规定）　冒泡排序是考纲点名的另一个标准算法：反复比较相邻两项并交换，每一趟把剩下的最大值送到末尾（§10.2）。

**示例：完整的冒泡排序**　`Example_10_4_a.pseudocode`

```
CONSTANT Size = 5
DECLARE Values : ARRAY[1:Size] OF INTEGER
DECLARE Temp : INTEGER
Values[1] ← 3
Values[2] ← 9
Values[3] ← 1
Values[4] ← 7
Values[5] ← 5
FOR I ← 1 TO Size - 1
   FOR J ← 1 TO Size - I
      IF Values[J] > Values[J + 1] THEN
         Temp ← Values[J]
         Values[J] ← Values[J + 1]
         Values[J + 1] ← Temp
      ENDIF
   NEXT J
NEXT I
FOR I ← 1 TO Size
   OUTPUT Values[I]
NEXT I
```
- 第 9 行：外层只管数趟数：5 个数走 4 趟。`I` 在循环体里不用来取格子，它只是「第几趟」。
- 第 10 行：内层的终点跟着趟数缩：第 1 趟比到第 4 对，第 4 趟只比第 1 对。
- 11–15 行：和上一节那段一模一样。整个排序的力气全在这五行上。

示例运行：

```
1
3
5
7
9
```

**关卡**（single-choice）　把内层写成 `FOR J ← 1 TO 5`（忘了减趟数），运行会怎样？

- **A** 第一趟走到最后一对时越界，程序停下来
  - ✓ 对。`J` 走到 5 时要取 `Values[J + 1]`，也就是第 6 格，而数组只有 5 格。程序停在比较那一行。
- **B** 排序结果正确，只是多比了几次
  - ✗ 多比几次本身不影响结果，但这里多出来的那一次要读一个不存在的格子，程序根本走不到最后。
- **C** 编辑器在运行前就拦下来
  - ✗ 下标是 `J + 1`，是个算出来的值。要等 `J` 真的取到 5 才知道越界，运行前看不出来。
- **D** 最后一格会被当成 0 参与比较
  - ✗ 不存在的格子不会被当成 0。越界就是越界，程序会停下来而不是编一个值出来。


### 小节题： 从小到大排好｜`10.4.1`

写一段伪代码：读入 5 个整数存进数组，用冒泡排序把它们从小到大排好，再一行一个显示出来。

- **输入**：五行，各一个 `INTEGER`。每次读取之前都要显示提示语，一字不差：
`Enter a number`
- **输出**：五行，每行一个整数，从小到大。
- **必须用** `decl.array-1d` — 要反复回头比较和交换，五个数必须先存成一排。
- **必须用** `loop.nested` — 外层数趟数、内层走一趟，冒泡排序天生是两层循环。
- **必须用** `select.if` — 只有前面那格比后面大的时候才交换，不能每次都换。

提示：
1. 先把读入写完再开始排——排序的两层循环里不该还有 `INPUT`。
2. 交换要借一个临时变量，三句话缺一不可。
3. 内层的终点要随趟数缩短，否则最后一次比较会去读数组外面的格子。

题面示例：
```
输入：3 / 9 / 1 / 7 / 5
输出：
Enter a number
Enter a number
Enter a number
Enter a number
Enter a number
1
3
5
7
9
```

<details><summary>参考解（学生看不到）</summary>

```
DECLARE Values : ARRAY[1:5] OF INTEGER
DECLARE Temp : INTEGER
FOR I ← 1 TO 5
   OUTPUT "Enter a number"
   INPUT Values[I]
NEXT I
FOR I ← 1 TO 4
   FOR J ← 1 TO 5 - I
      IF Values[J] > Values[J + 1] THEN
         Temp ← Values[J]
         Values[J] ← Values[J + 1]
         Values[J + 1] ← Temp
      ENDIF
   NEXT J
NEXT I
FOR I ← 1 TO 5
   OUTPUT Values[I]
NEXT I
```

判题用例（对学生隐藏，失败时只显示 caseHint）：

- `normal` 输入 4 / 2 / 8 / 6 / 0 — 五个各不相同的数，顺序是乱的。
- `boundary` 输入 1 / 2 / 3 / 4 / 5 — 读进来的时候本来就已经排好了。
- `boundary` 输入 5 / 4 / 3 / 2 / 1 — 读进来的时候正好是完全倒过来的。
- `normal` 输入 7 / 7 / 7 / 7 / 7 — 五个数完全一样，一次也不需要交换。
- `extreme` 输入 99999 / -99999 / 0 / 99999 / -1 — 混着极大和极小的值，还有重复的。

</details>

---

## 10.5　加一个标志，排好了就收工

<sub>§10.2｜约 9 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`、`assign.simple`、`decl.constant`、`op.arithmetic`、`op.div`、`op.mod`、`op.relational`、`op.and`、`op.or`、`op.not`、`select.if`、`select.if-else`、`select.nested-if`、`select.case`、`select.case-range`、`select.case-otherwise`、`loop.for`、`loop.for-step`、`loop.while`、`loop.repeat`、`loop.nested`、`builtin.length`、`builtin.mid`、`builtin.right`、`builtin.ucase`、`builtin.lcase`、`op.concat`、`builtin.int`、`builtin.rand`、`decl.array-1d`、`array.index`、`decl.array-2d`、`array.index-2d`</sub>

上一节那段有个浪费：一排本来就已经排好的数，它照样老老实实走满 4 趟，一次都没换过，也不知道自己该停。

看出来只需要再加一个标志：每趟开始前把 `Swapped` 设成 `FALSE`，一旦发生交换就改成 `TRUE`。一趟走完它还是 `FALSE`，就说明这一趟相邻的每一对都已经是对的——**那整排就已经排好了**，后面的趟一趟都不用走。

于是外层从「走满固定趟数」变成「走到不用再走为止」，`FOR` 也就换成了 `REPEAT`：至少得走一趟（不走怎么知道换不换），走完再判断要不要继续。这正是第 5 章挑循环的判据。

改完之后，最好的情况只走一趟，最坏的情况（完全倒过来）还是 n-1 趟。**同一个算法，快慢取决于数据长什么样**——第 18 章比较算法时还会回到这件事。

**示例：带标志的冒泡排序**　`Example_10_5_a.pseudocode`

```
CONSTANT Size = 5
DECLARE Values : ARRAY[1:Size] OF INTEGER
DECLARE Temp : INTEGER
DECLARE Swapped : BOOLEAN
DECLARE Passes : INTEGER
Values[1] ← 3
Values[2] ← 9
Values[3] ← 1
Values[4] ← 7
Values[5] ← 5
Passes ← 0
REPEAT
   Swapped ← FALSE
   Passes ← Passes + 1
   FOR J ← 1 TO 4
      IF Values[J] > Values[J + 1] THEN
         Temp ← Values[J]
         Values[J] ← Values[J + 1]
         Values[J + 1] ← Temp
         Swapped ← TRUE
      ENDIF
   NEXT J
UNTIL Swapped = FALSE
OUTPUT "Passes: ", Passes
FOR I ← 1 TO Size
   OUTPUT Values[I]
NEXT I
```
- 第 13 行：清零放在每趟的开头，不能放在 `REPEAT` 之前——那样只有第一趟算数。
- 第 20 行：只要换过一次就立起来。它回答的是「这一趟有没有动过」。
- 第 23 行：一趟都没换，就说明已经排好，循环到此为止。
- 第 24 行：这里把趟数显示出来只是为了看得见；真正在用的程序里不需要这一行。

示例运行：

```
Passes: 3
1
3
5
7
9
```

**关卡**（single-choice）　把上面那段里的五个数换成 `1 3 5 7 9`（本来就排好了），`Passes` 会显示几？

- **A** 0
  - ✗ `REPEAT` 至少执行一次——不先走一趟，根本无从知道要不要交换。
- **B** 4
  - ✗ 4 是上一节那种固定趟数的写法。加了标志之后，走满 4 趟只会发生在最坏的情况。
- **C** 2
  - ✗ 不需要第二趟。第一趟结束时标志还是 `FALSE`，`UNTIL` 已经成立，不会再进循环。
- **D** 1
  - ✓ 对。第一趟把每一对都比了一遍，一次也没换，`Swapped` 保持 `FALSE`，`UNTIL` 的条件成立，循环就结束了。


---


## 章末大题： 排好再找｜`10.T1`

写一段伪代码：读入 6 个整数，先把它们从小到大排好并逐行显示，然后读入一个要找的数，在**排好之后**的这排数里查找，显示它的位置；不在里面就说一声。

- **输入**：先六行，各一个 `INTEGER`；等六个数排好显示完之后，再读入一行，是要找的数。每次读取之前都要显示提示语，一字不差：
前六次是 `Enter a number`，最后一次是 `Enter the number to find`
- **输出**：先六行，每行一个整数，从小到大。然后一行查找结果：
`Found at <位置>`
或者
`Not found`
位置指的是排好之后的位置。同一个数出现多次时报最靠前的那一次。
- **建议用到**：`decl.array-1d`、`array.index`、`loop.for`、`loop.nested`、`loop.while`、`select.if`、`select.if-else`、`io.input`、`io.output`

提示：
1. 三段事各写各的：读入、排序、查找。中间不要互相插话。
2. 排序用上一节的两层循环；查找用带标志的 `WHILE`，找到就停。
3. 要找的那个数必须等六个数显示完之后才读——顺序反了，屏幕上的先后就不对。

题面示例：
```
输入：3 / 9 / 1 / 7 / 5 / 2 / 7
输出：
Enter a number
Enter a number
Enter a number
Enter a number
Enter a number
Enter a number
1
2
3
5
7
9
Enter the number to find
Found at 5
```

<details><summary>参考解（学生看不到）</summary>

```
DECLARE Values : ARRAY[1:6] OF INTEGER
DECLARE Temp : INTEGER
DECLARE Target : INTEGER
DECLARE Position : INTEGER
DECLARE Found : BOOLEAN
FOR I ← 1 TO 6
   OUTPUT "Enter a number"
   INPUT Values[I]
NEXT I
FOR I ← 1 TO 5
   FOR J ← 1 TO 6 - I
      IF Values[J] > Values[J + 1] THEN
         Temp ← Values[J]
         Values[J] ← Values[J + 1]
         Values[J + 1] ← Temp
      ENDIF
   NEXT J
NEXT I
FOR I ← 1 TO 6
   OUTPUT Values[I]
NEXT I
OUTPUT "Enter the number to find"
INPUT Target
Found ← FALSE
Position ← 1
WHILE Found = FALSE AND Position <= 6
   IF Values[Position] = Target THEN
      Found ← TRUE
   ELSE
      Position ← Position + 1
   ENDIF
ENDWHILE
IF Found = TRUE THEN
   OUTPUT "Found at ", Position
ELSE
   OUTPUT "Not found"
ENDIF
```

判题用例（对学生隐藏，失败时只显示 caseHint）：

- `normal` 输入 4 / 2 / 8 / 6 / 0 / 9 / 6 — 六个各不相同的数，要找的那个在中间。
- `boundary` 输入 6 / 5 / 4 / 3 / 2 / 1 / 1 — 读进来时完全倒过来，要找的是排好之后的第一个。
- `boundary` 输入 1 / 2 / 3 / 4 / 5 / 6 / 6 — 读进来时就已经排好，要找的是最后一个。
- `abnormal` 输入 4 / 2 / 8 / 6 / 0 / 9 / 7 — 要找的数不在这批数里。
- `normal` 输入 3 / 7 / 3 / 7 / 3 / 7 / 7 — 只有两种值各出现几次，要找的那个有好几份。
- `extreme` 输入 99999 / -99999 / 0 / 0 / 99999 / -1 / -99999 — 混着极大和极小的值，要找的是最小的那个。

</details>
