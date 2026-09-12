# Chapter 13 — 函数  `[AS]`

对应 §11.3｜内容预览（不是最终版式，只是把数据平铺出来读）


---

## 13.1　过程还是函数

<sub>§11.3｜约 9 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`、`assign.simple`、`decl.constant`、`op.arithmetic`、`op.div`、`op.mod`、`op.relational`、`op.and`、`op.or`、`op.not`、`select.if`、`select.if-else`、`select.nested-if`、`select.case`、`select.case-range`、`select.case-otherwise`、`loop.for`、`loop.for-step`、`loop.while`、`loop.repeat`、`loop.nested`、`builtin.length`、`builtin.mid`、`builtin.right`、`builtin.ucase`、`builtin.lcase`、`op.concat`、`builtin.int`、`builtin.rand`、`decl.array-1d`、`array.index`、`decl.array-2d`、`array.index-2d`、`decl.record-type`、`record.field-access`、`routine.procedure`、`routine.call`、`param.byval`、`param.byref`、`routine.function`、`routine.return`、`expr.function-call`</sub>

上一章末尾留了个问题：过程算出来的结果怎么交回给主程序？`BYREF` 参数做得到，但绕——你得先声明一个变量当容器，再把它递进去等着被填。

为「算出一个值交回去」准备的写法是**函数（function）**。它和过程的区别只有一条：**过程做一件事，函数算出一个值**。考纲的说法更准确：函数调用完成之后，**这个调用本身就变成了那个返回值**。

所以函数不是用 `CALL` 单占一行的，而是写在**需要一个值的地方**：赋值号右边、`OUTPUT` 里、`IF` 的条件里、甚至另一个函数的实参位置上。`LENGTH`、`MID` 这些内置的东西一直就是这么用的——现在你能自己写了。

判据很直接：这段代码的结果是「屏幕上多了点东西」或者「某个变量被改了」，写过程；结果是「算出一个值，拿去接着用」，写函数。

> **规则**（CAIE 规定）　考纲要求区分过程与函数，并理解「返回值取代了这次调用」（§11.3）。

**对照：同一件事，交回结果的两种办法**

把一个数乘以二，再把结果显示出来。

*自然语言*
```
「把 5 乘以二」这句话本身就代表一个数。
所以可以直接说：显示「把 5 乘以二」。
而不必先说：算出来放着，待会儿我去拿。
```
> 说话的时候没人会先声明一个容器。「把 5 乘以二」就是一个值，可以直接放进句子里用。

*用过程*
```
PROCEDURE Double(BYVAL N : INTEGER, BYREF Result : INTEGER)
   Result ← N * 2
ENDPROCEDURE
DECLARE Answer : INTEGER
CALL Double(5, Answer)
OUTPUT Answer
```
> 能跑，但为了接住一个值得先造一个变量，还得多占一行调用。结果和「5 乘以二」之间隔着两步。

*用函数*
```
FUNCTION Double(N : INTEGER) RETURNS INTEGER
   RETURN N * 2
ENDFUNCTION
OUTPUT Double(5)
```
> `Double(5)` 整个就是一个值，直接放进 `OUTPUT` 里。不用容器，也不用单独一行调用。

*Python*
```python
def double(n):
    return n * 2

print(double(5))
```
> Python 不区分过程和函数，全用 `def`；不写 `return` 的就相当于伪代码的过程。

**关卡**（single-choice）　下面哪一件事**最**该写成函数而不是过程？

- **A** 算出一个字符串里有几个空格
  - ✓ 对。结果是一个数，而且你多半要拿它接着去算或者去判断——正好放在需要一个值的地方。
- **B** 读入用户输入的三个数
  - ✗ 要交回三个值，而函数只还一个。这种用过程配 `BYREF` 参数更合适。
- **C** 把一个数组从小到大排好
  - ✗ 它的结果是「那个数组被重新摆过了」，不是算出一个值。这种该写成过程，数组走 `BYREF`。
- **D** 把一张报表打印到屏幕上
  - ✗ 结果是屏幕上多了东西，没有值要交回去。典型的过程。


---

## 13.2　`FUNCTION ... RETURNS ... ENDFUNCTION`

<sub>§11.3｜约 11 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`、`assign.simple`、`decl.constant`、`op.arithmetic`、`op.div`、`op.mod`、`op.relational`、`op.and`、`op.or`、`op.not`、`select.if`、`select.if-else`、`select.nested-if`、`select.case`、`select.case-range`、`select.case-otherwise`、`loop.for`、`loop.for-step`、`loop.while`、`loop.repeat`、`loop.nested`、`builtin.length`、`builtin.mid`、`builtin.right`、`builtin.ucase`、`builtin.lcase`、`op.concat`、`builtin.int`、`builtin.rand`、`decl.array-1d`、`array.index`、`decl.array-2d`、`array.index-2d`、`decl.record-type`、`record.field-access`、`routine.procedure`、`routine.call`、`param.byval`、`param.byref`、`routine.function`、`routine.return`、`expr.function-call`</sub>

函数的头部比过程多一截：`FUNCTION Double(N : INTEGER) RETURNS INTEGER`。括号里照样是参数，`RETURNS` 后面写的是**它会还回来什么类型的值**。收尾用 `ENDFUNCTION`。

交回值用 `RETURN 值`。**`RETURN` 一执行，函数当场结束**，后面还没跑的行一行都不会跑——这一点和 `ENDFUNCTION` 不一样：`ENDFUNCTION` 只是写法上的收尾，`RETURN` 才是真的走人。

调用时**不写 `CALL`**：`X ← Double(5)`。写了 `CALL` 会被拦下来。反过来也一样——把一个函数调用单独写成一行是不行的，那一行没有人接住它还回来的值。

`RETURN` 后面那个值的类型要和 `RETURNS` 写的对得上。写着 `RETURNS INTEGER` 却 `RETURN "twice"`，运行前就被拦住。

> **规则**（CAIE 规定）　函数头包含 `RETURNS <类型>`，以 `ENDFUNCTION` 结束，用 `RETURN <值>` 返回单个值；函数调用必须出现在表达式中，不使用 `CALL`（G§8.2）。

**示例：两个函数，三种用法**　`Example_13_2_a.pseudocode`

```
FUNCTION Double(N : INTEGER) RETURNS INTEGER
   RETURN N * 2
ENDFUNCTION
FUNCTION Shout(S : STRING) RETURNS STRING
   RETURN S & "!"
ENDFUNCTION
DECLARE X : INTEGER
X ← Double(5)
OUTPUT X
OUTPUT Double(3) + Double(4)
OUTPUT Shout("hello")
```
- 第 1 行：`RETURNS INTEGER` 说的是还回来一个整数，不是参数的类型——参数的类型在括号里。
- 第 8 行：放在赋值号右边。`Double(5)` 这一整块就等于 10。
- 第 10 行：放在表达式里，两个调用各自变成一个数再相加。这是过程做不到的事。

示例运行：

```
10
14
hello!
```

**反例：两种用错函数的写法**

*拿 `CALL` 调用函数*
```
FUNCTION Double(N : INTEGER) RETURNS INTEGER
   RETURN N * 2
ENDFUNCTION
CALL Double(5)
```
`CALL` 是过程专用的。而且这一行就算跑得起来也没意义——`Double(5)` 还回来一个 10，这里没有人接。

- 错误（第 4 行）：函数不用 `CALL`，要写在需要一个值的地方。

*还回来的类型不对*
```
FUNCTION Double(N : INTEGER) RETURNS INTEGER
   RETURN "twice"
ENDFUNCTION
OUTPUT Double(5)
```
头部承诺还一个 `INTEGER`，`RETURN` 却给了一段文字。承诺和兑现对不上，运行前就查得出来。

- 错误（第 2 行）：还回来的值和 `RETURNS` 写的类型对不上。

**关卡**（fill-blank）　补全这个函数：接受一个 `INTEGER`，还回来它的平方。

```
__1__ Square(N : INTEGER) __2__ INTEGER
   __3__ N * N
__4__
```
答案：空 1 = `FUNCTION`，空 2 = `RETURNS`，空 3 = `RETURN`，空 4 = `ENDFUNCTION`
- `FUNCTION` — 起头的关键字，后面跟函数名和参数。
- `RETURNS` — 带 S 的这个写在头部，后面跟的是还回来的值是什么类型。
- `RETURN` — 不带 S 的这个写在函数体里，后面跟真正要还回去的那个值。
- `ENDFUNCTION` — 收尾的关键字，和起头的 `FUNCTION` 配对。
- `PROCEDURE` — 过程用的关键字。过程不还值，这里要还一个平方数，所以不是它。
- `CALL` — 调用过程用的。函数既不用它起头，也不用它调用。


---

## 13.3　每条路都要 `RETURN`

<sub>§11.3｜约 11 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`、`assign.simple`、`decl.constant`、`op.arithmetic`、`op.div`、`op.mod`、`op.relational`、`op.and`、`op.or`、`op.not`、`select.if`、`select.if-else`、`select.nested-if`、`select.case`、`select.case-range`、`select.case-otherwise`、`loop.for`、`loop.for-step`、`loop.while`、`loop.repeat`、`loop.nested`、`builtin.length`、`builtin.mid`、`builtin.right`、`builtin.ucase`、`builtin.lcase`、`op.concat`、`builtin.int`、`builtin.rand`、`decl.array-1d`、`array.index`、`decl.array-2d`、`array.index-2d`、`decl.record-type`、`record.field-access`、`routine.procedure`、`routine.call`、`param.byval`、`param.byref`、`routine.function`、`routine.return`、`expr.function-call`</sub>

函数必须**在每一条走得到的路上都还回一个值**。少一条路没有 `RETURN`，调用的地方就接到空——所以编辑器在运行前就查这件事，而且提示指回函数的头部那一行。

最常见的缺口长这样：`IF ... THEN RETURN ... ENDIF` 后面就没了。条件成立时有值可还，不成立时函数一路走到 `ENDFUNCTION` 也没还任何东西。补法是加 `ELSE`，或者在 `ENDIF` 后面再写一句 `RETURN`。

因为 `RETURN` 一执行就走人，`IF ... THEN RETURN A ENDIF` 后面直接跟一句 `RETURN B` 是完全正确的：**能走到 `RETURN B` 那一行，本身就说明条件没成立**。不需要再写 `ELSE`。

循环里的 `RETURN` 也一样：一旦执行，循环和函数一起结束。第 10 章「找到就停」的写法，用函数写就是循环里直接 `RETURN` 那个位置。

> **规则**（CAIE 规定）　函数以 `RETURN <值>` 返回单个值，执行 `RETURN` 后立即结束函数（G§8.2）。

**示例：三条路，三句 `RETURN`**　`Example_13_3_a.pseudocode`

```
FUNCTION Sign(N : INTEGER) RETURNS STRING
   IF N > 0 THEN
      RETURN "positive"
   ENDIF
   IF N < 0 THEN
      RETURN "negative"
   ENDIF
   RETURN "zero"
ENDFUNCTION
OUTPUT Sign(5)
OUTPUT Sign(-5)
OUTPUT Sign(0)
```
- 2–4 行：成立就走人，下面几行都不会跑。
- 第 8 行：能走到这一行，说明上面两个条件都没成立——所以这句不用包在 `ELSE` 里。
- 10–12 行：三次调用各走一条路。函数被调用三次，`N` 先后是三个不同的值。

示例运行：

```
positive
negative
zero
```

**反例：有一条路走到底也没还东西**

```
FUNCTION Sign(N : INTEGER) RETURNS STRING
   IF N > 0 THEN
      RETURN "positive"
   ENDIF
ENDFUNCTION
OUTPUT Sign(0)
```
`N` 不大于 0 的时候，函数一路走到 `ENDFUNCTION` 也没有 `RETURN`。提示指在头部那一行——**缺口是整个函数的事，不是某一行的事**。

- 错误（第 1 行）：有一条路走完也没有 `RETURN`，补一句放在 `ENDIF` 后面。

**关卡**（single-choice）　上面那个 `Sign` 函数，把最后那句 `RETURN "zero"` 改写成 `ELSE RETURN "zero"` 包进第二个 `IF` 里，会怎样？

- **A** `N` 等于 0 时会还回 `"negative"`
  - ✗ `0 < 0` 不成立，走的是 `ELSE` 那一支。哪一支被走取决于条件本身，和包不包 `ELSE` 无关。
- **B** 函数会还回两个值
  - ✗ 函数只还一个值——第一句执行到的 `RETURN` 一到，函数就结束了，不存在第二次。
- **C** 编辑器会说有一条路没有 `RETURN`
  - ✗ 不会。包进 `ELSE` 之后两支都有 `RETURN`，第二个 `IF` 本身就把所有情况盖住了。
- **D** 一样对，只是多了一层缩进
  - ✓ 对。两种写法覆盖的情况完全相同，行为也完全相同；区别只在读起来哪种更顺——路数一多，不写 `ELSE` 的那种通常更平。


### 小节题： 分数换等第｜`13.3.1`

写一段伪代码：定义一个函数，接受一个整数分数，还回来等第——80 分及以上是 `A`，60 分及以上是 `B`，40 分及以上是 `C`，再低是 `F`。主程序读入三个分数，每读一个就把分数和等第显示出来。

- **输入**：三行，各一个 `INTEGER`。每次读取之前都要显示提示语，一字不差：
`Enter a mark`
- **输出**：每读完一个显示一行：
`<分数> <等第>`
中间一个空格。
- **必须用** `routine.function` — 等第是算出来的一个值，要拿去显示，正该由函数还回来。
- **必须用** `routine.return` — 四种等第都是一条路，每条路都得把结果还回去。
- **必须用** `expr.function-call` — 函数不写 `CALL`，要放在需要一个值的地方用。

提示：
1. 函数头部写成 `FUNCTION Grade(Mark : INTEGER) RETURNS STRING`。
2. 四个门槛从高往低查：先看够不够 80，再看够不够 60……顺序反了会全落到第一条。
3. 最后那句 `RETURN` 放在所有 `ENDIF` 的后面就行，不必包 `ELSE`。

题面示例：
```
输入：85 / 60 / 10
输出：
Enter a mark
85 A
Enter a mark
60 B
Enter a mark
10 F
```

<details><summary>参考解（学生看不到）</summary>

```
FUNCTION Grade(Mark : INTEGER) RETURNS STRING
   IF Mark >= 80 THEN
      RETURN "A"
   ENDIF
   IF Mark >= 60 THEN
      RETURN "B"
   ENDIF
   IF Mark >= 40 THEN
      RETURN "C"
   ENDIF
   RETURN "F"
ENDFUNCTION
DECLARE Mark : INTEGER
DECLARE I : INTEGER
FOR I ← 1 TO 3
   OUTPUT "Enter a mark"
   INPUT Mark
   OUTPUT Mark, " ", Grade(Mark)
NEXT I
```

判题用例（对学生隐藏，失败时只显示 caseHint）：

- `normal` 输入 95 / 72 / 55 — 三个分数各落在不同的等第上。
- `boundary` 输入 80 / 60 / 40 — 三个分数正好都踩在门槛上。
- `boundary` 输入 79 / 59 / 39 — 三个分数都差一分够不着门槛。
- `boundary` 输入 0 / 100 / 0 — 零分和满分。
- `extreme` 输入 99999 / -99999 / 41 — 一个大得离谱，一个是很小的负数。

</details>

---

## 13.4　函数的参数

<sub>§11.3｜约 9 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`、`assign.simple`、`decl.constant`、`op.arithmetic`、`op.div`、`op.mod`、`op.relational`、`op.and`、`op.or`、`op.not`、`select.if`、`select.if-else`、`select.nested-if`、`select.case`、`select.case-range`、`select.case-otherwise`、`loop.for`、`loop.for-step`、`loop.while`、`loop.repeat`、`loop.nested`、`builtin.length`、`builtin.mid`、`builtin.right`、`builtin.ucase`、`builtin.lcase`、`op.concat`、`builtin.int`、`builtin.rand`、`decl.array-1d`、`array.index`、`decl.array-2d`、`array.index-2d`、`decl.record-type`、`record.field-access`、`routine.procedure`、`routine.call`、`param.byval`、`param.byref`、`routine.function`、`routine.return`、`expr.function-call`</sub>

函数的参数和过程的完全一样：写在括号里，名字、冒号、类型；调用时按位置给实参，个数、顺序、类型都要对上。默认也还是传值。

但多一条规矩：**函数的参数不该用 `BYREF`**。理由不复杂——函数是用来算一个值的，顺手把调用者的变量也改掉，那是另一件事，两件事混在一句表达式里谁都看不清。

写了 `BYREF` 的函数照样能跑，编辑器给的是一条规范提示，不是阻断错误——**能跑不等于合规范**，Pseudocode Guide 这一条写得很明确。

函数也可以一个参数都没有：`FUNCTION Answer() RETURNS INTEGER`，调用时写 `Answer()`——括号和过程一样不能省。

> **规则**（CAIE 规定）　函数参数不应以 `BYREF` 传递（G§8.3）。

**示例：没有参数、两个参数、拿函数当实参**　`Example_13_4_a.pseudocode`

```
FUNCTION Answer() RETURNS INTEGER
   RETURN 42
ENDFUNCTION
FUNCTION Area(Width : INTEGER, Height : INTEGER) RETURNS INTEGER
   RETURN Width * Height
ENDFUNCTION
OUTPUT Answer()
OUTPUT Area(3, 4)
OUTPUT Area(Answer(), 2)
```
- 第 1 行：没有参数，括号照写。
- 第 8 行：两个实参按位置对上 `Width` 和 `Height`。
- 第 9 行：`Answer()` 先变成 42，再当实参递给 `Area`。函数能放在任何需要一个值的地方——包括另一个函数的括号里。

示例运行：

```
42
12
84
```

**反例：函数参数写成 `BYREF`**

```
FUNCTION Bad(BYREF N : INTEGER) RETURNS INTEGER
   N ← N + 1
   RETURN N
ENDFUNCTION
DECLARE X : INTEGER
X ← 1
OUTPUT Bad(X)
OUTPUT X
```
**这段跑得完**，两行都显示 2——函数把外面的 `X` 也改了。提示是一条规范级别的，不拦你运行。麻烦在于读第 7 行的人根本想不到 `X` 会因此变化。

- 规范提示（第 1 行）：函数的参数不该用 `BYREF`。要改调用者的变量，那件事应该交给过程。

**关卡**（single-choice）　为什么规范不让函数的参数用 `BYREF`？

- **A** 因为 `BYREF` 只能用在 `INTEGER` 上
  - ✗ 和类型没关系。过程里 `BYREF` 一个 `STRING`、一个数组都完全正常。
- **B** 因为函数写在表达式里，顺手改掉别人的变量会让那句表达式说不清
  - ✓ 对。函数是拿来求值的，出现在赋值号右边、`IF` 的条件里。它在那儿悄悄改掉一个变量，读那一行的人完全看不出来。
- **C** 因为编辑器还没实现
  - ✗ 实现了，写了照样跑。这是 Pseudocode Guide 的写法要求，不是能力限制。
- **D** 因为函数不能有参数
  - ✗ 函数当然能有参数，而且多数函数都有。不让用的只是 `BYREF` 这一种传递方式。


---

## 13.5　函数不该有副作用

<sub>§11.3｜约 10 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`、`assign.simple`、`decl.constant`、`op.arithmetic`、`op.div`、`op.mod`、`op.relational`、`op.and`、`op.or`、`op.not`、`select.if`、`select.if-else`、`select.nested-if`、`select.case`、`select.case-range`、`select.case-otherwise`、`loop.for`、`loop.for-step`、`loop.while`、`loop.repeat`、`loop.nested`、`builtin.length`、`builtin.mid`、`builtin.right`、`builtin.ucase`、`builtin.lcase`、`op.concat`、`builtin.int`、`builtin.rand`、`decl.array-1d`、`array.index`、`decl.array-2d`、`array.index-2d`、`decl.record-type`、`record.field-access`、`routine.procedure`、`routine.call`、`param.byval`、`param.byref`、`routine.function`、`routine.return`、`expr.function-call`</sub>

函数除了算出返回值之外还干了别的——显示了东西、改了全局变量、往文件里写了一行——这些额外的动作统称**副作用（side effect）**。上一节的 `BYREF` 参数是其中一种，但不止那一种。

为什么要躲开它？因为函数藏在表达式里，**你数不清它被调用了几次、按什么顺序**。`OUTPUT Double(3) + Double(4)` 里有两次调用；换个写法可能是一次，也可能是三次。每次调用都偷偷做点什么，结果就跟着调用次数飘。

编辑器不拦这件事——函数里写 `OUTPUT` 语法上完全合法。这是**写法上的要求**，跟缩进、大写一样：不遵守也能跑，但写出来的程序别人读不明白。

判据有一句现成的：**把一个函数调用换成它算出来的那个值，程序的行为应该完全不变。** 做得到，它就是干净的。

**示例：一个有副作用的函数，数数它被叫了几次**　`Example_13_5_a.pseudocode`

```
FUNCTION Noisy(N : INTEGER) RETURNS INTEGER
   OUTPUT "called with ", N
   RETURN N * 2
ENDFUNCTION
OUTPUT Noisy(3) + Noisy(4)
```
- 第 2 行：这一句就是副作用：它和「算出 N 的两倍」这件事没有关系。
- 第 5 行：只写了一句 `OUTPUT`，屏幕上却出来三行——因为这一行里函数被调用了两次，每次都自己先喊一嗓子。

示例运行：

```
called with 3
called with 4
14
```

**关卡**（single-choice）　上面那段最后一行如果改成 `OUTPUT Noisy(3) * 2`，屏幕上会有几行？

- **A** 1 行
  - ✗ 函数体里那句 `OUTPUT` 每次调用都会执行一次，所以除了结果那行之外至少还有一行。
- **B** 2 行
  - ✓ 对：一次调用带出一行 `called with 3`，再加结果 `12`。**同样一个函数，换个式子行数就变了**——副作用麻烦就麻烦在这里。
- **C** 看运行几次才知道
  - ✗ 每次运行都一样。不确定的不是次数本身，而是读代码的人光看那一行猜不出会显示几行。
- **D** 3 行
  - ✗ 3 行是原来那种写法的结果：两次调用各一行，加上最后的和。这里只有一次调用。


### 小节题： 四个数里最大的｜`13.5.1`

写一段伪代码：定义一个**干净的**函数，接受两个整数、还回来较大的那一个（不显示任何东西、不改任何外部变量）；主程序读入四个数，靠反复调用这个函数找出最大的一个再显示出来。

- **输入**：四行，各一个 `INTEGER`。每次读取之前都要显示提示语，一字不差：
`Enter a number`
- **输出**：一行，写成：
`Largest: <最大的那个数>`
冒号后面一个空格。
- **必须用** `routine.function` — 「两个数里较大的那个」是一个值，拿去接着比，正该由函数还回来。
- **必须用** `expr.function-call` — 函数要用在需要一个值的地方，而不是单占一行。
- **不能用** `param.byref` — 函数的参数不该用 `BYREF`，这道题要写的正是一个干净的函数。

提示：
1. 函数里只要一个 `IF` 和两句 `RETURN`，一句 `OUTPUT` 都不该有。
2. 先把第一个数当成「目前最大的」，后面每读一个就和它比一次。
3. 比较的结果要存回去：`Best ← Bigger(Best, N)`。

题面示例：
```
输入：3 / 9 / 2 / 7
输出：
Enter a number
Enter a number
Enter a number
Enter a number
Largest: 9
```

<details><summary>参考解（学生看不到）</summary>

```
FUNCTION Bigger(A : INTEGER, B : INTEGER) RETURNS INTEGER
   IF A > B THEN
      RETURN A
   ENDIF
   RETURN B
ENDFUNCTION
DECLARE Best : INTEGER
DECLARE N : INTEGER
DECLARE I : INTEGER
OUTPUT "Enter a number"
INPUT Best
FOR I ← 2 TO 4
   OUTPUT "Enter a number"
   INPUT N
   Best ← Bigger(Best, N)
NEXT I
OUTPUT "Largest: ", Best
```

判题用例（对学生隐藏，失败时只显示 caseHint）：

- `normal` 输入 4 / 8 / 1 / 6 — 最大的那个落在中间。
- `boundary` 输入 9 / 1 / 2 / 3 — 最大的就是第一个读进来的。
- `boundary` 输入 1 / 2 / 3 / 9 — 最大的是最后一个读进来的。
- `normal` 输入 5 / 5 / 5 / 5 — 四个数完全一样。
- `extreme` 输入 -99999 / -99998 / -99997 / -99996 — 全是很小的负数，最大的也是负的。

</details>

---

## 13.6　五个必须分清的词

<sub>§11.3｜约 8 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`、`assign.simple`、`decl.constant`、`op.arithmetic`、`op.div`、`op.mod`、`op.relational`、`op.and`、`op.or`、`op.not`、`select.if`、`select.if-else`、`select.nested-if`、`select.case`、`select.case-range`、`select.case-otherwise`、`loop.for`、`loop.for-step`、`loop.while`、`loop.repeat`、`loop.nested`、`builtin.length`、`builtin.mid`、`builtin.right`、`builtin.ucase`、`builtin.lcase`、`op.concat`、`builtin.int`、`builtin.rand`、`decl.array-1d`、`array.index`、`decl.array-2d`、`array.index-2d`、`decl.record-type`、`record.field-access`、`routine.procedure`、`routine.call`、`param.byval`、`param.byref`、`routine.function`、`routine.return`、`expr.function-call`</sub>

考纲点名要求能分清五个词。拿 `FUNCTION Area(Width : INTEGER, Height : INTEGER) RETURNS INTEGER` 这一行当例子，五个词全在里面或者紧挨着它。

**头部（header）**就是这一行本身：名字、参数、返回类型。它不包含函数体，也不包含 `ENDFUNCTION`。过程也有头部，只是没有 `RETURNS` 那一截。

**接口（interface）**是头部里回答「怎么用它」的那部分：要给它什么、它会还回来什么。知道接口就足够使用一个函数了——**里面怎么写的完全不用看**，这正是分解带来的好处。

**参数（parameter）**是 `Width` 和 `Height`；**实参（argument）**是调用时写的 `3` 和 `4`；**返回值（return value）**是 `RETURN` 交回去、并且取代了这次调用的那个数。

> **规则**（CAIE 规定）　考纲明确列出 header、interface、parameter、argument、return value 五个术语（§11.3）。

**关卡**（single-choice）　`OUTPUT Area(3, 4)` 显示出 `12`。这个 `12` 是什么？

- **A** 头部
  - ✗ 头部是 `FUNCTION Area(...) RETURNS INTEGER` 那一行，每个函数只有一个，和调用几次无关。
- **B** 接口
  - ✗ 接口说的是「要给两个 `INTEGER`、会还回来一个 `INTEGER`」这件事，是使用说明，不是某一次的结果。
- **C** 实参
  - ✗ 实参是调用时递进去的 `3` 和 `4`，方向正好相反——它们是进去的，`12` 是出来的。
- **D** 返回值
  - ✓ 对。而且更准确的说法是：`Area(3, 4)` 这一整块被这个值取代了，所以 `OUTPUT` 拿到的就是 `12`。


---


## 章末大题： 五科成绩报告｜`13.T1`

写一段伪代码：读入 5 科成绩，算出平均分（取整数商），再按平均分给出等第，最后把平均分和等第显示出来。平均分和等第各写成一个函数，显示写成一个过程；主程序只负责读入、调用和串起来。等第规则：80 分及以上是 `A`，60 分及以上是 `B`，40 分及以上是 `C`，再低是 `F`。

- **输入**：五行，各一个 `INTEGER`。每次读取之前都要显示提示语，一字不差：
`Enter a mark`
- **输出**：读完之后显示两行：
`Average: <平均分>`
`Grade: <等第>`
每个冒号后面一个空格。
- **建议用到**：`routine.function`、`routine.return`、`expr.function-call`、`routine.procedure`、`routine.call`、`param.byval`、`op.div`、`select.if`、`loop.for`、`io.input`、`io.output`

提示：
1. 两个函数一个过程：算平均的函数、判等第的函数、显示结果的过程。三件事各管各的。
2. 判等第的那个函数拿平均分当参数，它不需要知道成绩是怎么来的——这正是接口的意思。
3. 一个函数的返回值可以直接当另一个调用的实参：`CALL ShowResult(Mean, Grade(Mean))`。

题面示例：
```
输入：80 / 70 / 90 / 60 / 100
输出：
Enter a mark
Enter a mark
Enter a mark
Enter a mark
Enter a mark
Average: 80
Grade: A
```

<details><summary>参考解（学生看不到）</summary>

```
FUNCTION Average(Total : INTEGER, Count : INTEGER) RETURNS INTEGER
   RETURN Total DIV Count
ENDFUNCTION
FUNCTION Grade(Mark : INTEGER) RETURNS STRING
   IF Mark >= 80 THEN
      RETURN "A"
   ENDIF
   IF Mark >= 60 THEN
      RETURN "B"
   ENDIF
   IF Mark >= 40 THEN
      RETURN "C"
   ENDIF
   RETURN "F"
ENDFUNCTION
PROCEDURE ShowResult(Value : INTEGER, Letter : STRING)
   OUTPUT "Average: ", Value
   OUTPUT "Grade: ", Letter
ENDPROCEDURE
DECLARE Sum : INTEGER
DECLARE Mark : INTEGER
DECLARE I : INTEGER
DECLARE Mean : INTEGER
Sum ← 0
FOR I ← 1 TO 5
   OUTPUT "Enter a mark"
   INPUT Mark
   Sum ← Sum + Mark
NEXT I
Mean ← Average(Sum, 5)
CALL ShowResult(Mean, Grade(Mean))
```

判题用例（对学生隐藏，失败时只显示 caseHint）：

- `normal` 输入 55 / 62 / 71 / 48 / 90 — 五科成绩高低不一，平均分落在中间的等第上。
- `boundary` 输入 80 / 80 / 80 / 80 / 80 — 平均分正好踩在最高的那个门槛上。
- `boundary` 输入 0 / 0 / 0 / 0 / 0 — 全部零分。
- `boundary` 输入 41 / 40 / 40 / 40 / 40 — 总分除不尽，整除之后正好落回门槛上。
- `extreme` 输入 99999 / 0 / 0 / 0 / 0 — 一科大得离谱，其余全是零。

</details>
