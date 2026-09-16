# Chapter 3 — 表达式与运算符  `[AS]`

对应 §11.1、G§5.2、G§5.3、G§5.4｜内容预览（不是最终版式，只是把数据平铺出来读）


---

## 3.1　算术运算与优先级

<sub>§11.1、G§5.2｜约 10 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`、`assign.simple`、`decl.constant`、`op.arithmetic`</sub>

前两章的程序只会把读到的东西原样摆出来。从这一章起，赋值箭头的右边可以是一段**表达式（expression）**——一个需要算出结果的式子，算完的值才被放进左边的变量。式子里那些表示「要做哪种运算」的符号叫**运算符（operator）**。四则运算的运算符是 `+`、`-`、`*`、`/`，写法和数学里一样：`Total ← Price * Count` 先把右边算出来，再把结果放进 `Total`。

算的顺序也和数学一样：先乘除后加减。哪个运算先算、哪个后算，这个次序叫**优先级（precedence）**。`2 + 3 * 4` 得到 14，不是 20。想让加法先算，就用括号：`(2 + 3) * 4` 得到 20。

有一处和数学不一样，要特别记住：**`/` 的结果永远是 `REAL`，哪怕除得尽**。`6 / 2` 得到的是 `3.0` 而不是 `3`。所以 `DECLARE Half : INTEGER` 之后写 `Half ← 6 / 2` 是不成立的——右边是个实数，左边只肯收整数。

> **规则**（CAIE 规定）　算术运算符是 `+`、`-`、`*`、`/`；`/` 的结果是 `REAL`，即使两个操作数都是整数。乘除的优先级高于加减，复杂的式子建议用括号把顺序写明白（Pseudocode Guide §5.2）。

> **规则**（编辑器约定）　实数显示成什么样，Pseudocode Guide 没有规定。本编辑器的做法是至少保留一位小数，所以 `6 / 2` 显示成 `3.0`，一眼看得出它是实数而不是整数。

**示例：同样三个数，加括号和不加括号不是一回事**　`Example_3_1_a.pseudocode`

```
DECLARE Plain : INTEGER
DECLARE Grouped : INTEGER
DECLARE Divided : REAL
Plain ← 2 + 3 * 4
Grouped ← (2 + 3) * 4
Divided ← 6 / 2
OUTPUT "Plain: ", Plain
OUTPUT "Grouped: ", Grouped
OUTPUT "Divided: ", Divided
```
- 第 4 行：先算 `3 * 4`，再加 2。
- 第 5 行：括号里的先算，所以是 `5 * 4`。
- 第 6 行：`Divided` 必须声明成 `REAL`。`6 / 2` 除得尽，结果仍然是实数 `3.0`。

示例运行：

```
Plain: 14
Grouped: 20
Divided: 3.0
```

**关卡**（single-choice）　`DECLARE N : INTEGER` 之后，哪一行会被编辑器拦下？

- **A** N ← 2 + 3 * 4
  - ✗ 可以。整数加整数、整数乘整数，结果还是整数，正好放得进 `INTEGER`。
- **B** N ← (10 - 4) * 2
  - ✗ 可以。括号只改变算的顺序，不改变结果的类型，算出来仍是整数。
- **C** N ← 8 / 2
  - ✓ 就是这一行。`/` 的结果永远是 `REAL`，`8 / 2` 得到的是 `4.0` 而不是 `4`，放不进只收整数的 `N`。要整除得用下一节的 `DIV`。
- **D** N ← 100
  - ✗ 可以。这是最普通的一次赋值，右边是个整数字面量。


---

## 3.2　整除与余数

<sub>§11.1、G§5.2｜约 9 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`、`assign.simple`、`decl.constant`、`op.arithmetic`、`op.div`、`op.mod`</sub>

上一节留了个问题：想把 7 个人按每车 2 人分组，`7 / 2` 给的是 `3.5`，可车数不能是三辆半。这里要的不是精确的商，而是**整除**的结果和剩下的零头。

`DIV` 给出整数部分，`MOD` 给出余数。`7 DIV 2` 是 3，`7 MOD 2` 是 1——三辆车坐满，还剩 1 个人。这两个运算符的左右两边都必须是 `INTEGER`。

`MOD` 最常用的地方是判断整除：一个数 `MOD 2` 等于 0 就是偶数，`MOD 5` 等于 0 就能被 5 整除，下一节就用得上。另外要记住：除数是 0 时 `/`、`DIV`、`MOD` 都会让程序停下来，而且编辑器事先看不出来——3.5 节会演示这件事。

> **规则**（CAIE 规定）　`DIV` 取整数商，`MOD` 取余数（Pseudocode Guide §5.2）。

**示例：把 7 个人装进每车 2 座的车**　`Example_3_2_a.pseudocode`

```
CONSTANT SeatsPerCar = 2
DECLARE People : INTEGER
DECLARE FullCars : INTEGER
DECLARE LeftOver : INTEGER
People ← 7
FullCars ← People DIV SeatsPerCar
LeftOver ← People MOD SeatsPerCar
OUTPUT "Full cars: ", FullCars
OUTPUT "Left over: ", LeftOver
```
- 第 6 行：`DIV` 只要整数部分，小数被丢掉，不是四舍五入。
- 第 7 行：`MOD` 要的正是被丢掉的那部分——坐不满一车的人数。

示例运行：

```
Full cars: 3
Left over: 1
```

**关卡**（single-choice）　`17 DIV 5` 和 `17 MOD 5` 分别得到什么？

- **A** 3 和 2
  - ✓ 对。5 装得下 3 整份共 15，还剩 2。整数商是 3，余数是 2。
- **B** 3.4 和 2
  - ✗ `3.4` 是 `17 / 5` 的结果。`DIV` 只给整数部分，不会带小数。
- **C** 4 和 2
  - ✗ `DIV` 是把小数部分直接丢掉，不是四舍五入；3.4 丢掉小数是 3，不是 4。
- **D** 3 和 3
  - ✗ 余数是被 5 装完之后剩下的：17 减去 15 等于 2，不是 3。


### 小节题： 把秒数换成分和秒｜`3.2.1`

写一段伪代码：先提示并读入一个整数秒数，然后把它换算成整数分钟和剩余秒数，显示一行 `<分> min <秒> s`。例如读入 `100`，显示 `1 min 40 s`。

- **输入**：一行，一个 `INTEGER`。
- **输出**：两行：
`Enter the seconds`　（读之前）
`<分> min <秒> s`　（`min` 和 `s` 前后各一个空格）
- **必须用** `op.div` — 分钟数要的是整数商，用 `/` 会得到带小数的实数，放不进整数变量。
- **必须用** `op.mod` — 剩余秒数正是整除之后剩下的零头，这就是 `MOD` 的用处。

提示：
1. 一分钟是六十秒。想清楚哪一个量要「整数份数」，哪一个要「剩下的」。
2. 先把提示、读入、两次计算、输出这五步的顺序排好，再去想每一步怎么写。
3. 最后一行要显示四样东西：分钟、引号里的 ` min `、秒数、引号里的 ` s`。

题面示例：
```
输入：100
输出：
Enter the seconds
1 min 40 s
```

<details><summary>参考解（学生看不到）</summary>

```
CONSTANT SecondsPerMinute = 60
DECLARE Seconds : INTEGER
DECLARE Minutes : INTEGER
DECLARE Rest : INTEGER
OUTPUT "Enter the seconds"
INPUT Seconds
Minutes ← Seconds DIV SecondsPerMinute
Rest ← Seconds MOD SecondsPerMinute
OUTPUT Minutes, " min ", Rest, " s"
```

判题用例（对学生隐藏，失败时只显示 caseHint）：

- `normal` 输入 95 — 一个既不是整分钟、也不到一小时的普通秒数。
- `normal` 输入 245 — 换一个秒数，确认程序不是把答案写死的。
- `boundary` 输入 0 — 当秒数正好是零时。
- `boundary` 输入 120 — 当秒数正好整除、一秒都不剩时。
- `extreme` 输入 86399 — 当秒数很大、接近一整天时。

</details>

---

## 3.3　比较与布尔值

<sub>§11.1、G§5.3｜约 8 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`、`assign.simple`、`decl.constant`、`op.arithmetic`、`op.div`、`op.mod`、`op.relational`</sub>

算术表达式算出来的是数，比较算出来的是「是」或「不是」。做比较的这六个符号叫**关系运算符（relational operator）**，Guide 里也把它们叫作比较运算符，两个说法指的是同一批东西：`=`、`<>`、`<`、`<=`、`>`、`>=`，其中 `<>` 表示「不等于」。注意 `=` 在这里是比较不是赋值——赋值一直用 `←`，这两个符号在 CAIE 的伪代码里分工明确。

比较的结果是一个 `BOOLEAN` 值——只可能是 `TRUE` 或 `FALSE`。所以 `Passed ← Score >= 50` 是完全正常的一次赋值：右边先比出一个布尔值，再放进左边的布尔变量。

数学里可以写 `1 < 2 < 3`，伪代码里不行。比较只能两两进行，连着写编辑器会拦下来。要表达「在两者之间」，得用下一节的 `AND` 把两个比较连起来。

> **规则**（CAIE 规定）　关系运算符（也叫比较运算符）是 `=`、`<>`、`<`、`<=`、`>`、`>=`，它们算出来的一定是 `BOOLEAN`（Pseudocode Guide §5.3）。

**示例：比出来的结果可以存起来**　`Example_3_3_a.pseudocode`

```
CONSTANT PassMark = 50
DECLARE Score : INTEGER
DECLARE Passed : BOOLEAN
DECLARE IsEven : BOOLEAN
Score ← 64
Passed ← Score >= PassMark
IsEven ← Score MOD 2 = 0
OUTPUT "Passed: ", Passed
OUTPUT "Even: ", IsEven
```
- 第 6 行：右边先比出 `TRUE`，再由 `←` 放进 `Passed`。一行里两个符号，分工不同。
- 第 7 行：先算 `Score MOD 2`，再拿结果和 0 比。算术的优先级高于比较，所以不用加括号。

示例运行：

```
Passed: TRUE
Even: TRUE
```

**关卡**（single-choice）　`DECLARE Ready : BOOLEAN` 之后，哪一行是对的？

- **A** Ready ← 3 > 2
  - ✓ 对。右边是一次比较，比出来的是布尔值，正好放得进 `BOOLEAN` 变量。
- **B** Ready = TRUE
  - ✗ 这一行在做比较，不是赋值——它算出一个布尔值就丢掉了，`Ready` 没有任何变化。赋值要用 `←`。
- **C** Ready ← 1
  - ✗ `1` 是整数，不是布尔值。有些语言用 1 和 0 代表真假，CAIE 的伪代码只用 `TRUE` 和 `FALSE`。
- **D** Ready ← 0 < 5 < 9
  - ✗ 连着写的比较会被拦下来。要表达「在两者之间」，得写成两个比较再用 `AND` 连起来。


---

## 3.4　AND、OR、NOT 与括号

<sub>§11.1、G§5.4｜约 10 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`、`assign.simple`、`decl.constant`、`op.arithmetic`、`op.div`、`op.mod`、`op.relational`、`op.and`、`op.or`、`op.not`</sub>

一个条件常常不止一句话：「分数及格**并且**出勤够」「周六**或者**周日」。把布尔值组合起来用三个**逻辑运算符（logic operator）**：`AND`、`OR`、`NOT`。

`A AND B` 要两边都为 `TRUE` 才是 `TRUE`；`A OR B` 只要有一边为 `TRUE` 就是 `TRUE`；`NOT A` 把真假反过来。

三者之间也有优先级：`NOT` 最高，其次 `AND`，最后 `OR`。所以 `TRUE OR TRUE AND FALSE` 先算 `AND`，结果是 `TRUE`。

还有一处优先级 Guide 没有规定，本编辑器给了个说法：`NOT` 抓得比关系运算符更紧。所以 `NOT Score > 50` 在这里被读成 `(NOT Score) > 50`——先对一个数取反，讲不通。想说「分数不超过 50」就写 `NOT (Score > 50)`，把括号补上，换到别的工具里也不会被读成另一个意思。

记不住优先级不要紧，**把想先算的部分用括号括起来**，读的人也省事。Guide 本身就建议复杂的式子显式加括号。

> **规则**（CAIE 规定）　逻辑运算符是 `AND`、`OR`、`NOT`；复杂表达式建议用括号把运算顺序写明白（Pseudocode Guide §5.4、§5.2）。

> **规则**（编辑器约定）　`NOT` 和关系运算符谁先算，Pseudocode Guide 没有规定。本编辑器让 `NOT` 先算，所以 `NOT Score > 50` 会报类型错。加上括号写成 `NOT (Score > 50)` 就没有歧义了。

**示例：两个条件一起判断**　`Example_3_4_a.pseudocode`

```
DECLARE Score : INTEGER
DECLARE Attendance : INTEGER
DECLARE Awarded : BOOLEAN
DECLARE Missing : BOOLEAN
Score ← 64
Attendance ← 92
Awarded ← Score >= 50 AND Attendance >= 90
Missing ← NOT (Attendance >= 90)
OUTPUT "Awarded: ", Awarded
OUTPUT "Missing: ", Missing
```
- 第 7 行：两个比较各自先算出布尔值，`AND` 再把它们合起来。比较的优先级高于 `AND`，所以这里可以不加括号。
- 第 8 行：这里的括号不能省。写成 `NOT Attendance >= 90` 会先对 `Attendance` 取反，讲不通。

示例运行：

```
Awarded: TRUE
Missing: FALSE
```

**反例：两种写法都会被拦下**

*比较不能连着写*
```
DECLARE Score : INTEGER
Score ← 64
OUTPUT 0 < Score < 100
```
第 3 行想说「Score 在 0 和 100 之间」，但比较只能两两进行。要连起来正是 `AND` 的用处：`Score > 0 AND Score < 100`。

- 错误（第 3 行）：关系运算不能连续书写，需要拆成两个比较再连起来。

*`NOT` 抓得比比较更紧*
```
DECLARE Score : INTEGER
Score ← 64
OUTPUT NOT Score > 50
```
第 3 行被理解成 `(NOT Score) > 50`：先对一个数取反，再拿它和 50 比，两步都讲不通。加上括号写成 `NOT (Score > 50)` 就对了。

- 错误（第 3 行）：`NOT` 只能作用在布尔值上，这里它拿到的是一个数。

**关卡**（single-choice）　要表达「Score 在 0 到 100 之间（含两端）」，哪一行是对的？

- **A** 0 <= Score <= 100
  - ✗ 比较不能连着写。这一行会被拦下来，上一节的反例就是它。
- **B** Score >= 0 AND Score <= 100
  - ✓ 对。拆成两个各自成立的比较，再用 `AND` 要求同时满足。比较的优先级高于 `AND`，所以两边各自会先算出布尔值。
- **C** Score >= 0 OR Score <= 100
  - ✗ `OR` 只要一边成立就算成立。任何一个数都至少满足其中一句，所以这一行永远是 `TRUE`，起不到限制作用。
- **D** NOT Score < 0 AND Score <= 100
  - ✗ `NOT` 抓得比比较紧，`NOT Score` 会先对一个数取反，讲不通。要否定整个比较得写成 `NOT (Score < 0)`。


---

## 3.5　类型必须对得上

<sub>§11.1、§10.1｜约 8 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`、`assign.simple`、`decl.constant`、`op.arithmetic`、`op.div`、`op.mod`、`op.relational`、`op.and`、`op.or`、`op.not`</sub>

表达式里的每个值都有类型，运算符对它接受什么类型是有要求的：`+` `-` `*` `/` 要数，`DIV` `MOD` 要整数，`AND` `OR` `NOT` 要布尔值。给错了类型，编辑器会在运行前就拦下来。

只有一处会自动转换：**整数可以当实数用**。`DECLARE R : REAL` 之后 `R ← 3` 是可以的，存进去的是 `3.0`。

反过来不行。`DECLARE N : INTEGER` 之后 `N ← 3.5` 会被拦下——实数放进整数会丢掉小数部分，这种损失不会悄悄发生；真要取整数部分得自己写出来：`N ← INT(3.5)`。这条单向的规则也解释了 3.1 节留下的问题：`8 / 2` 得到实数 `4.0`，放不进 `INTEGER`，要整除就用 `DIV`。

> **规则**（编辑器约定）　类型不匹配是运行前就能看出来的，编辑器会直接拦住不让运行。除数为 0 不一样——那要真的算到那一步才知道，属于运行时才会出现的错误。

**反例：两种拦法，时机不一样**

*运行前就拦下：实数放不进整数*
```
DECLARE Count : INTEGER
Count ← 8 / 2
```
`8 / 2` 的结果是 `4.0`，是实数。类型对不上，不用运行就能看出来。要么把 `Count` 声明成 `REAL`，要么把 `/` 换成 `DIV`。

- 错误（第 2 行）：右边算出来的是实数，左边的变量只收整数。

*运行到那一行才拦：除数是 0*
```
DECLARE Total : INTEGER
DECLARE Share : INTEGER
DECLARE People : INTEGER
Total ← 100
People ← 0
Share ← Total DIV People
```
这段代码类型全对，编辑器一条提示都没有——`People` 是个整数，`DIV` 收整数，完全合法。可是它一跑到第 6 行就停了：这时才知道 `People` 里装的是 0。**能通过检查不等于能跑完。**

- 运行时（第 6 行，RT1301）：除数是 0，程序算到这一行就停下来了。

**关卡**（single-choice）　下面四行里，哪一行**能开始运行、跑到那一行才停下来**？

- **A** DECLARE R : REAL 之后写 R ← 7
  - ✗ 这一行从头到尾都不会停。整数可以当实数用，`R` 里存的是 `7.0`——这是唯一一处自动转换。
- **B** DECLARE N : INTEGER 之后写 N ← 7 / 2
  - ✗ 它根本开始不了。`/` 的结果永远是实数，`3.5` 放不进整数变量，这是运行前就看得出来的类型不匹配。
- **C** DECLARE Flag : BOOLEAN 之后写 Flag ← 1
  - ✗ 它也开始不了。`1` 是整数，布尔变量只收 `TRUE` 和 `FALSE`，同样是运行前就拦下的类型不匹配。
- **D** DECLARE N : INTEGER 之后写 N ← 5 MOD 0
  - ✓ 对。类型上挑不出毛病，`MOD` 两边都是整数，所以程序照常开始跑；等真算到这一行才发现除数是 0，这时候才停。


---


## 章末大题： 算一张购物小票｜`3.T1`

写一段伪代码：读入商品单价（整数，单位是分）和数量，算出总价，再判断是否达到免运费的门槛（500 分）。显示三行小票。

- **输入**：两行。第一行是单价（`INTEGER`，单位分），第二行是数量（`INTEGER`）。
两句提示语各自排在它对应的那次读取之前，一字不差：
`Enter the unit price`
`Enter the quantity`
- **输出**：读完之后再显示三行：
`Total: <总价>`
`Yuan: <元> Fen: <分>`　（把总价换算成元和分）
`Free delivery: <TRUE 或 FALSE>`　（总价达到 500 分算达到）
每个冒号后面都是一个空格。
- **建议用到**：`op.arithmetic`、`op.div`、`op.mod`、`op.relational`、`io.input`、`io.output`

提示：
1. 把这张小票拆成三件事：算总价、把总价拆成元和分、判断够不够免运费。
2. 「拆成元和分」和上一节把秒换成分秒是同一个动作：一个要整数份数，一个要剩下的。
3. 第三行显示的是一个布尔值，所以它可以直接由一次比较算出来，不需要判断语句。

题面示例：
```
输入：120 / 3
输出：
Enter the unit price
Enter the quantity
Total: 360
Yuan: 3 Fen: 60
Free delivery: FALSE
```

<details><summary>参考解（学生看不到）</summary>

```
CONSTANT FreeDeliveryFrom = 500
// 读入单价与数量，算出总价并判断是否免运费
CONSTANT FenPerYuan = 100
DECLARE UnitPrice : INTEGER
DECLARE Quantity : INTEGER
DECLARE Total : INTEGER
DECLARE Yuan : INTEGER
DECLARE Fen : INTEGER
DECLARE FreeDelivery : BOOLEAN
OUTPUT "Enter the unit price"
INPUT UnitPrice
OUTPUT "Enter the quantity"
INPUT Quantity
Total ← UnitPrice * Quantity
Yuan ← Total DIV FenPerYuan
Fen ← Total MOD FenPerYuan
FreeDelivery ← Total >= FreeDeliveryFrom
OUTPUT "Total: ", Total
OUTPUT "Yuan: ", Yuan, " Fen: ", Fen
OUTPUT "Free delivery: ", FreeDelivery
```

判题用例（对学生隐藏，失败时只显示 caseHint）：

- `normal` 输入 115 / 3 — 一笔普通的订单，总价不到免运费的门槛。
- `normal` 输入 250 / 4 — 总价明显超过门槛的一笔订单。
- `boundary` 输入 100 / 5 — 总价正好等于免运费的门槛。
- `boundary` 输入 300 / 0 — 当数量是零、总价也是零时。
- `extreme` 输入 99999 / 99 — 当单价和数量都很大时。

</details>
