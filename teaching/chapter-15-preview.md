# Chapter 15 — 抽象数据类型入门  `[AS]`

对应 §10.4｜内容预览（不是最终版式，只是把数据平铺出来读）


---

## 15.1　什么是抽象数据类型

<sub>§10.4｜约 9 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`、`assign.simple`、`decl.constant`、`op.arithmetic`、`op.div`、`op.mod`、`op.relational`、`op.and`、`op.or`、`op.not`、`select.if`、`select.if-else`、`select.nested-if`、`select.case`、`select.case-range`、`select.case-otherwise`、`loop.for`、`loop.for-step`、`loop.while`、`loop.repeat`、`loop.nested`、`builtin.length`、`builtin.mid`、`builtin.right`、`builtin.ucase`、`builtin.lcase`、`op.concat`、`builtin.int`、`builtin.rand`、`decl.array-1d`、`array.index`、`decl.array-2d`、`array.index-2d`、`decl.record-type`、`record.field-access`、`routine.procedure`、`routine.call`、`param.byval`、`param.byref`、`routine.function`、`routine.return`、`expr.function-call`、`file.open-read`、`file.open-write`、`file.open-append`、`file.read`、`file.write`、`file.close`、`builtin.eof`</sub>

数组和记录说的都是**怎么存**：几格、什么类型、怎么取。**抽象数据类型（abstract data type, ADT）**换了个角度——它先说清**能对这批数据做哪几件事**，至于底下拿什么存，暂时不问。

「抽象」的意思就是这个：**只承诺行为，不承诺存法**。和第 13 章的接口是同一个思路——知道要给什么、会还回什么就够用了，里面怎么写不必看。

最常见的三种是**栈（stack）**、**队列（queue）**和**链表（linked list）**，这一章讲的就是它们。三种装的都是「一串数据」，区别全在规矩上——**从哪头进、从哪头出、怎么找到下一个**。

这一章不写它们的伪代码实现，只做三件事：说清各自的特点、在给定场景里挑一个并说得出理由、**描述**怎么用数组把它们做出来。每一种都会讲怎么往里添一个、怎么改掉里面的一个、怎么去掉一个。完整实现留到第 20 章。

> **规则**（CAIE 规定）　ADT 是一批数据，加上定义在这批数据上的一组操作；栈、队列、链表都是 ADT 的例子。要会往里面添加、修改、删除数据，但不需要为这些结构写出伪代码实现（§10.4）。

**对照：说存法，还是说做法**

同样是「一批整数」，两种说明方式管的事不一样。

*数组：说的是存法*
```
DECLARE Values : ARRAY[1:10] OF INTEGER
Values[3] ← 42
OUTPUT Values[3]
```
> 十格、整数、按下标取。看完这三行你知道它长什么样，但不知道该按什么顺序往里放、往外取——那由用它的人随便决定。

*栈：说的是做法*
```
一个栈能做三件事：
  往顶上放一个（push）
  从顶上取走一个（pop）
  看一眼顶上是什么，但不取走
规矩：放和取都只在同一头。
至于底下用数组还是别的，不关使用者的事。
```
> 一格都没提，却把能干什么说全了。这就是「抽象」——**先定规矩，再谈存法**。

*Python*
```python
stack = []
stack.append(42)   # push
top = stack.pop()  # pop
```
> Python 的 list 底下是数组，但 `append` / `pop` 这一对用法把它当栈使。同一份存法，配不同的规矩就是不同的 ADT。

**关卡**（single-choice）　下面哪一句最准确地说出了「抽象数据类型」里「抽象」的意思？

- **A** 它比数组更难理解
  - ✗ 难不难和抽象不抽象没关系。栈的规矩只有一条，比数组的下标运算好懂得多。
- **B** 它只说清能做哪几件事，不说底下怎么存
  - ✓ 对。使用者只需要知道那几件事和它们的规矩；换一种存法而规矩不变，用它的代码一个字都不用改。
- **C** 它不需要占存储空间
  - ✗ 数据总要存在什么地方。ADT 不说存法，不等于不用存。
- **D** 它里面的数据类型可以随时改变
  - ✗ 这说的是数据类型，不是抽象。栈里装什么类型和它是不是 ADT 无关。


---

## 15.2　栈：后进先出

<sub>§10.4｜约 9 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`、`assign.simple`、`decl.constant`、`op.arithmetic`、`op.div`、`op.mod`、`op.relational`、`op.and`、`op.or`、`op.not`、`select.if`、`select.if-else`、`select.nested-if`、`select.case`、`select.case-range`、`select.case-otherwise`、`loop.for`、`loop.for-step`、`loop.while`、`loop.repeat`、`loop.nested`、`builtin.length`、`builtin.mid`、`builtin.right`、`builtin.ucase`、`builtin.lcase`、`op.concat`、`builtin.int`、`builtin.rand`、`decl.array-1d`、`array.index`、`decl.array-2d`、`array.index-2d`、`decl.record-type`、`record.field-access`、`routine.procedure`、`routine.call`、`param.byval`、`param.byref`、`routine.function`、`routine.return`、`expr.function-call`、`file.open-read`、`file.open-write`、`file.open-append`、`file.read`、`file.write`、`file.close`、`builtin.eof`</sub>

栈的规矩只有一条：**放和取都只在同一头**。那一头叫栈顶。放进去叫**入栈（push）**，取出来叫**出栈（pop）**，此外通常还能「看一眼栈顶是什么但不取走」。

这一条规矩带来的后果是：**最后放进去的最先被取出来**，简称**后进先出（LIFO）**。一摞盘子就是栈——往最上面摞，也从最上面拿，中间那张抽不出来。

两种情况要留神：**空栈没法 pop**（没有东西可取），**满了没法 push**（没有地方可放）。用数组做的栈总有个上限，所以这两件事都得先问一句。

什么时候用栈：**要按相反顺序处理**的时候。浏览器的后退、编辑器的撤销、检查括号配不配对，还有第 19 章的递归——每一层调用都摞在上一层上面，返回时从最上面开始拆。

> **规则**（CAIE 规定）　栈的关键特点是放和取都在同一头，因而后进先出；选用它的理由要落在这个取出顺序上（§10.4）。

**关卡**（single-choice）　一个空栈，依次 push 了 `3`、`7`、`5`，然后 pop 一次，再 push `9`。现在栈顶是什么？

- **A** `5`
  - ✗ 5 已经被那次 pop 取走了。pop 取的正是当时的栈顶。
- **B** `9`
  - ✓ 对。push 完是 3、7、5（5 在顶上），pop 取走 5 剩下 3、7，再 push 9 摞在最上面。栈顶永远是最后放进去的那个。
- **C** `7`
  - ✗ pop 之后栈顶确实是 7，但后面还 push 了一个 9，它摞在 7 上面。
- **D** `3`
  - ✗ 3 是最先放进去的，它压在最底下。要取到它得先把上面的全部取走。


---

## 15.3　队列：先进先出

<sub>§10.4｜约 9 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`、`assign.simple`、`decl.constant`、`op.arithmetic`、`op.div`、`op.mod`、`op.relational`、`op.and`、`op.or`、`op.not`、`select.if`、`select.if-else`、`select.nested-if`、`select.case`、`select.case-range`、`select.case-otherwise`、`loop.for`、`loop.for-step`、`loop.while`、`loop.repeat`、`loop.nested`、`builtin.length`、`builtin.mid`、`builtin.right`、`builtin.ucase`、`builtin.lcase`、`op.concat`、`builtin.int`、`builtin.rand`、`decl.array-1d`、`array.index`、`decl.array-2d`、`array.index-2d`、`decl.record-type`、`record.field-access`、`routine.procedure`、`routine.call`、`param.byval`、`param.byref`、`routine.function`、`routine.return`、`expr.function-call`、`file.open-read`、`file.open-write`、`file.open-append`、`file.read`、`file.write`、`file.close`、`builtin.eof`</sub>

队列的规矩也只有一条，但和栈正好相反：**一头进，另一头出**。进来叫**入队（enqueue）**，出去叫**出队（dequeue）**。

后果是**最先进来的最先出去**，简称**先进先出（FIFO）**。这就是排队：站到队尾，从队头走。插队在队列里是不存在的。

队列要记两个位置：**队头**（下一个出去的是谁）和**队尾**（下一个进来的放哪儿）。栈只需要记一个，因为它只有一头在动。

什么时候用队列：**要按到达顺序处理**的时候。打印任务、客服排号、把先来的工作先派出去。判据一句话：**先来的先办，就是队列；后来的先办，就是栈。**

> **规则**（CAIE 规定）　队列的关键特点是一头进另一头出，因而先进先出；选用它的理由要落在这个取出顺序上（§10.4）。

**关卡**（single-choice）　一个空队列，依次 enqueue 了 `A`、`B`、`C`，然后 dequeue 两次。这两次出来的分别是什么？

- **A** `A`，然后 `C`
  - ✗ 出队永远从队头挨着走，不会跳过 `B`。队列里没有「挑一个出来」这件事。
- **B** 两次都是 `A`
  - ✗ dequeue 是取走，不是看一眼。第一次之后 `A` 已经不在队列里了。
- **C** `C`，然后 `B`
  - ✗ 这是栈的行为——后进先出。队列从另一头出，先进来的先走。
- **D** `A`，然后 `B`
  - ✓ 对。`A` 最先进来，所以最先出去；接着轮到 `B`。队列里剩下 `C`。


---

## 15.4　链表：每个节点记着下一个在哪儿

<sub>§10.4｜约 10 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`、`assign.simple`、`decl.constant`、`op.arithmetic`、`op.div`、`op.mod`、`op.relational`、`op.and`、`op.or`、`op.not`、`select.if`、`select.if-else`、`select.nested-if`、`select.case`、`select.case-range`、`select.case-otherwise`、`loop.for`、`loop.for-step`、`loop.while`、`loop.repeat`、`loop.nested`、`builtin.length`、`builtin.mid`、`builtin.right`、`builtin.ucase`、`builtin.lcase`、`op.concat`、`builtin.int`、`builtin.rand`、`decl.array-1d`、`array.index`、`decl.array-2d`、`array.index-2d`、`decl.record-type`、`record.field-access`、`routine.procedure`、`routine.call`、`param.byval`、`param.byref`、`routine.function`、`routine.return`、`expr.function-call`、`file.open-read`、`file.open-write`、`file.open-append`、`file.read`、`file.write`、`file.close`、`builtin.eof`</sub>

数组的格子是挨着排的，第几格在哪里靠下标算出来。**链表（linked list）**换了个办法：它由一串**节点（node）**组成，每个节点除了装数据，还记着**下一个节点在哪儿**；最后一个节点记的是「没有下一个了」。另外单独有个地方记着**第一个节点在哪儿**。

这么做的好处是**中间插删很便宜**：在两个节点之间插一个，只要改两处「下一个在哪儿」，别的节点一个都不用动。数组要在中间插一个，后面所有元素都得往后挪一格。

代价是**没法直接跳到第 5 个**。数组写 `A[5]` 一步到位，链表只能从第一个开始顺着走五步——想看第几个，就得走几步。

所以判据很清楚：**经常在中间插删，用链表；经常按编号直接取，用数组。**至于这三种 ADT 之间怎么互相实现，是第 20 章的事。

> **规则**（CAIE 规定）　链表的关键特点是每个节点记着下一个节点在哪儿，因而中间插删便宜、按编号直取昂贵；选用它的理由要落在这一点上（§10.4）。

**示例：顺着「下一个在哪儿」走一遍**　`Example_15_4_a.pseudocode`

```
DECLARE Data : ARRAY[1:5] OF STRING
DECLARE NextAt : ARRAY[1:5] OF INTEGER
DECLARE Start : INTEGER
DECLARE Here : INTEGER
Data[1] ← "Ada"
NextAt[1] ← 4
Data[4] ← "Bob"
NextAt[4] ← 2
Data[2] ← "Cal"
NextAt[2] ← 0
Start ← 1
Here ← Start
WHILE Here <> 0
   OUTPUT Data[Here]
   Here ← NextAt[Here]
ENDWHILE
```
- 5–10 行：三个节点分别放在第 1、4、2 格——**在数组里的位置是乱的**，顺序由 `NextAt` 说了算。
- 第 10 行：`0` 表示「没有下一个了」。第 0 格不存在，正好拿来当这个标记。
- 13–16 行：走法是「到这儿、看下一个在哪儿、走过去」，一直走到 `0`。显示出来的顺序是 Ada、Bob、Cal。

示例运行：

```
Ada
Bob
Cal
```

**关卡**（single-choice）　上面那段里，要在 `Ada` 和 `Bob` 之间插一个新节点（比如放在第 3 格），至少要改动几处「下一个在哪儿」？

- **A** 两处：`NextAt[1]` 改成 3，`NextAt[3]` 设成 4
  - ✓ 对。前一个改成指向新节点，新节点指向原来的后一个。`Bob`、`Cal` 和它们的数据一个字都不用动——这正是链表中间插删便宜的原因。
- **B** 一处：把 `NextAt[1]` 改成 3 就行
  - ✗ 那样走到第 3 格就断了——新节点的「下一个」还没设，链子接不回 `Bob`。
- **C** 三处，`NextAt[4]` 也要改
  - ✗ `Bob` 后面还是 `Cal`，没有变。插在前面不影响它指向谁。
- **D** 要先把 `Bob` 和 `Cal` 往后挪一格
  - ✗ 那是数组的做法。链表里节点放在哪一格根本不重要，所以不需要搬动任何东西。


---

## 15.5　用数组描述这三种结构

<sub>§10.4｜约 10 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`、`assign.simple`、`decl.constant`、`op.arithmetic`、`op.div`、`op.mod`、`op.relational`、`op.and`、`op.or`、`op.not`、`select.if`、`select.if-else`、`select.nested-if`、`select.case`、`select.case-range`、`select.case-otherwise`、`loop.for`、`loop.for-step`、`loop.while`、`loop.repeat`、`loop.nested`、`builtin.length`、`builtin.mid`、`builtin.right`、`builtin.ucase`、`builtin.lcase`、`op.concat`、`builtin.int`、`builtin.rand`、`decl.array-1d`、`array.index`、`decl.array-2d`、`array.index-2d`、`decl.record-type`、`record.field-access`、`routine.procedure`、`routine.call`、`param.byval`、`param.byref`、`routine.function`、`routine.return`、`expr.function-call`、`file.open-read`、`file.open-write`、`file.open-append`、`file.read`、`file.write`、`file.close`、`builtin.eof`</sub>

这三种结构底下都可以用数组做出来，能**描述**清楚就够了，不用写出完整实现。三种的套路是同一个：**一个数组装数据，外加一两个整数变量记位置**。

**栈**：一个数组 + 一个 `Top`，记着栈顶在第几格。放一个就是 `Top` 加一再往那格写，取一个就是先读那格再把 `Top` 减一。`Top` 是 0 表示空栈，`Top` 等于上界表示满了。

**队列**：一个数组 + `Front` 和 `Rear` 两个位置。出队时 `Front` 往后挪，入队时 `Rear` 往后挪。两个都只朝一个方向走，所以走到数组尽头就得从头绕回来——那叫环形队列，第 20 章讲。

**链表**：数据放一个数组，「下一个在哪儿」放另一个数组（或者做成记录数组的一个字段），再加一个变量记着第一个节点在第几格。**这里存的「下一个在哪儿」是数组下标，不是内存地址。**

**改掉里面已有的一个**，三种的做法不一样，而且都不需要搬动别的数据。栈只碰得到栈顶，要改更深的那个就得先把上面的全部 pop 出来、改完再 push 回去；队列只能改队头，或者从 `Front` 走到 `Rear` 逐个找到要改的那一个；链表顺着「下一个在哪儿」走到那个节点，直接改它的数据格——**「下一个在哪儿」一个都不用动，因为链子的形状没变**。这和插入、删除正好是一对照：插删改的是链接，修改只改数据。

> Content under development

**示例：栈：一个数组加一个 `Top`**　`Example_15_5_a.pseudocode`

```
DECLARE Stack : ARRAY[1:5] OF INTEGER
DECLARE Top : INTEGER
Top ← 0
Top ← Top + 1
Stack[Top] ← 10
Top ← Top + 1
Stack[Top] ← 20
Top ← Top + 1
Stack[Top] ← 30
OUTPUT "Top is at ", Top
OUTPUT "Top holds ", Stack[Top]
Top ← Top - 1
OUTPUT "After one pop, top holds ", Stack[Top]
OUTPUT "Slot 3 still holds ", Stack[3]
```
- 第 3 行：`Top` 是 0 表示空栈。第 0 格不存在，所以这个值不会和任何一个真实的位置混起来。
- 4–9 行：放三个：每次都是「`Top` 加一、往那一格写」。数组的格子一格都不用挪。
- 12–14 行：取一个只是把 `Top` 减一。**第 3 格里的 30 其实还在**——它只是不再算数了，下次放东西会盖掉它。

示例运行：

```
Top is at 3
Top holds 30
After one pop, top holds 20
Slot 3 still holds 30
```

**示例：队列：一个数组加两个位置**　`Example_15_5_b.pseudocode`

```
DECLARE Queue : ARRAY[1:5] OF STRING
DECLARE Front : INTEGER
DECLARE Rear : INTEGER
Front ← 1
Rear ← 0
Rear ← Rear + 1
Queue[Rear] ← "Ada"
Rear ← Rear + 1
Queue[Rear] ← "Bob"
Rear ← Rear + 1
Queue[Rear] ← "Cal"
OUTPUT "Next out: ", Queue[Front]
Front ← Front + 1
OUTPUT "Next out: ", Queue[Front]
OUTPUT "Front is ", Front, ", Rear is ", Rear
```
- 4–5 行：两个位置各管一头。`Rear` 从 0 起，因为还没有人排进来。
- 12–14 行：出队就是读 `Front` 那一格再把 `Front` 往后挪。**队伍里的人一个都不用往前走**——挪的是标记，不是数据。
- 第 15 行：两个位置都在往后爬。爬到第 5 格之后就得想办法绕回第 1 格，那是第 20 章的事。

示例运行：

```
Next out: Ada
Next out: Bob
Front is 2, Rear is 3
```

**关卡**（single-choice）　用数组做的队列，出队时为什么不需要把后面的人整体往前挪一格？

- **A** 因为数组本来就会自动往前收缩
  - ✗ 数组不会自动做任何事。每一格里的值只有被赋值才会变。
- **B** 因为出队的那个值会被自动清掉
  - ✗ 它不会被清掉，还留在原来那一格里——只是 `Front` 已经越过它，不再算数了。
- **C** 因为队头是靠 `Front` 记着的，挪一下这个变量就等于队伍往前走了一位
  - ✓ 对。队头在哪儿由一个变量说了算，改它比搬数据便宜得多。栈的 `Top` 也是同一个道理。
- **D** 因为队列的长度是固定的
  - ✗ 数组的长度固定，但队列里实际排着几个人是变的——`Front` 和 `Rear` 之间那一段才是队伍。


---

## 15.6　给一个场景挑结构

<sub>§10.4｜约 9 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`、`assign.simple`、`decl.constant`、`op.arithmetic`、`op.div`、`op.mod`、`op.relational`、`op.and`、`op.or`、`op.not`、`select.if`、`select.if-else`、`select.nested-if`、`select.case`、`select.case-range`、`select.case-otherwise`、`loop.for`、`loop.for-step`、`loop.while`、`loop.repeat`、`loop.nested`、`builtin.length`、`builtin.mid`、`builtin.right`、`builtin.ucase`、`builtin.lcase`、`op.concat`、`builtin.int`、`builtin.rand`、`decl.array-1d`、`array.index`、`decl.array-2d`、`array.index-2d`、`decl.record-type`、`record.field-access`、`routine.procedure`、`routine.call`、`param.byval`、`param.byref`、`routine.function`、`routine.return`、`expr.function-call`、`file.open-read`、`file.open-write`、`file.open-append`、`file.read`、`file.write`、`file.close`、`builtin.eof`</sub>

挑结构的判据就一句话：**这批数据要按什么顺序取出来？**按相反顺序取 → 栈；按到达顺序取 → 队列；按编号直接取 → 数组；顺序常变、经常在中间插删 → 链表。

挑对还不够，还要**说得出理由**。理由要落在「这个场景里数据是怎么进、怎么出的」上——「因为撤销要从最近一次开始退」是理由，「因为栈比较快」不是。

挑错了不会立刻出错，这是最容易忽略的一点。拿数组硬做一个队列也跑得动，只是每次出队都要把后面的人全挪一格；数据一多就慢，而且多出来的搬运代码全是出错的机会。反过来说，**结构挑对了，代码就不用做多余的搬运**——这和第 9 章「形状对上了就不用做换算」、第 11 章「绑成一份就拆不散」是同一件事的三种说法。

> **规则**（CAIE 规定）　选用某一种 ADT 时要能说明理由，理由来自这个场景本身的取用顺序（§10.4）。

**关卡**（single-choice）　一个程序要记下用户做过的每一步操作，好让「撤销」按钮一次退回一步。该用哪种结构？

- **A** 链表，因为操作的数量不固定
  - ✗ 数量不固定这一点栈也满足。挑结构看的是取出顺序，不是数量。
- **B** 二维数组，因为每一步操作有好几项信息
  - ✗ 一步操作有几项信息是「一份数据怎么存」的问题（记录更合适），和「按什么顺序退回」是两件事。
- **C** 栈，因为撤销要从最近一次开始往回退
  - ✓ 对。最后做的那一步最先被撤销，正是后进先出。理由落在「取出顺序」上，这正是该说的那一句。
- **D** 队列，因为操作是按时间先后发生的
  - ✗ 发生顺序确实是先后的，但撤销要退的是**最近**那一步。队列先出来的是最早那一步，正好退反了。


---

