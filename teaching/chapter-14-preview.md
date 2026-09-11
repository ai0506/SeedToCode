# Chapter 14 — 文本文件  `[AS]`

对应 §10.3｜内容预览（不是最终版式，只是把数据平铺出来读）


---

## 14.1　为什么需要文件

<sub>§10.3｜约 8 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`、`assign.simple`、`decl.constant`、`op.arithmetic`、`op.div`、`op.mod`、`op.relational`、`op.and`、`op.or`、`op.not`、`select.if`、`select.if-else`、`select.nested-if`、`select.case`、`select.case-range`、`select.case-otherwise`、`loop.for`、`loop.for-step`、`loop.while`、`loop.repeat`、`loop.nested`、`builtin.length`、`builtin.mid`、`builtin.right`、`builtin.ucase`、`builtin.lcase`、`op.concat`、`builtin.int`、`builtin.rand`、`decl.array-1d`、`array.index`、`decl.array-2d`、`array.index-2d`、`decl.record-type`、`record.field-access`、`routine.procedure`、`routine.call`、`param.byval`、`param.byref`、`routine.function`、`routine.return`、`expr.function-call`、`file.open-write`、`file.write`、`file.close`</sub>

到这里为止，程序里所有的数据——变量、数组、记录——都有同一个毛病：**程序一结束，它们就全没了**。下次再运行，一切从头开始，上次输入的东西一个字都不剩。

要让数据活过一次运行，就得把它写到程序外面去。**文本文件（text file）**是最简单的那种去处：一个有名字的地方，里面是一行一行的文字，程序结束之后它还在。

文本文件只装文字。往里写一个数，写进去的是这个数**写出来的样子**；读回来的也是一行文字，不会自动变回数——这一点后面几节会反复碰到。

用文件的四件事总是这个顺序：**打开、读或写、关掉**。中间那一步做什么由打开时选的方式决定，下面几节一件一件说。

> **规则**（CAIE 规定）　考纲要求能使用文本文件存储和读取数据（§10.3）。

**对照：记在变量里，还是记到文件里**

把一个名字存起来。

*自然语言*
```
记在脑子里：这次谈话结束就忘了。
写在纸上：明天还能翻出来看。
```
> 变量是脑子，文件是纸。差别不在这一刻能不能用，而在下次还在不在。

*变量*
```
DECLARE Best : STRING
Best ← "Ada"
OUTPUT Best
```
> 这一次运行里用起来一点问题都没有。但程序一结束，`Best` 就不存在了，下次运行得重新输入一遍。

*文件*
```
OPENFILE "Best.txt" FOR WRITE
WRITEFILE "Best.txt", "Ada"
CLOSEFILE "Best.txt"
OUTPUT "Saved"
```
> 屏幕上只多了一句 `Saved`，看不见 `Ada`——它不在屏幕上，在 `Best.txt` 里，下次运行还能读出来。

*Python*
```python
with open("best.txt", "w") as f:
    f.write("Ada\n")
```
> 三步是一样的：打开、写、关掉。Python 的 `with` 只是把「关掉」这一步自动化了。

**关卡**（single-choice）　下面哪件事**只有**文件做得到，变量和数组做不到？

- **A** 存放不同类型的数据
  - ✗ 那是记录的活。文本文件反而只认文字，什么进去都变成文字。
- **B** 把数据显示给用户看
  - ✗ 显示用 `OUTPUT`。写进文件恰恰是**不**显示——屏幕上看不见它。
- **C** 一次存很多条数据
  - ✗ 数组就能做到，而且取用比文件方便得多。条数多不是用文件的理由。
- **D** 把这次运行输入的东西留给下一次运行用
  - ✓ 对。程序一结束，变量和数组连同里面的值一起消失；文件留在程序外面，下一次运行还能打开它。


---

## 14.2　`OPENFILE`、`WRITEFILE`、`CLOSEFILE`

<sub>§10.3｜约 10 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`、`assign.simple`、`decl.constant`、`op.arithmetic`、`op.div`、`op.mod`、`op.relational`、`op.and`、`op.or`、`op.not`、`select.if`、`select.if-else`、`select.nested-if`、`select.case`、`select.case-range`、`select.case-otherwise`、`loop.for`、`loop.for-step`、`loop.while`、`loop.repeat`、`loop.nested`、`builtin.length`、`builtin.mid`、`builtin.right`、`builtin.ucase`、`builtin.lcase`、`op.concat`、`builtin.int`、`builtin.rand`、`decl.array-1d`、`array.index`、`decl.array-2d`、`array.index-2d`、`decl.record-type`、`record.field-access`、`routine.procedure`、`routine.call`、`param.byval`、`param.byref`、`routine.function`、`routine.return`、`expr.function-call`、`file.open-write`、`file.write`、`file.close`</sub>

写一个文件要三句话。`OPENFILE "Names.txt" FOR WRITE` 打开它：文件名写成一段 `STRING`，`FOR` 后面说明这次要拿它干什么。

`WRITEFILE "Names.txt", "Ada"` 往里写**一整行**。写完位置自动往下挪一行，所以接着再写一句就是第二行——不用自己管行号。

`CLOSEFILE "Names.txt"` 关掉。**每一句都要重复写一遍文件名**，因为程序里可以同时开着好几个文件，每一句都得说清是哪一个。

关掉这一步不能省。文件开着的时候别人（包括这段程序自己）没法再打开它——下一节要把刚写的东西读回来，就必须先关。

> **规则**（CAIE 规定）　文本文件用 `OPENFILE <文件> FOR READ|WRITE|APPEND` 打开，`WRITEFILE <文件>, <数据>` 写入一行，`CLOSEFILE <文件>` 关闭（G§9.1）。

**示例：把两个名字写出去**　`Example_14_2_a.pseudocode`

```
OPENFILE "Names.txt" FOR WRITE
WRITEFILE "Names.txt", "Ada"
WRITEFILE "Names.txt", "Bob"
CLOSEFILE "Names.txt"
OUTPUT "Saved 2 names"
```
- 第 1 行：`FOR WRITE` 打开的同时就把文件清空了——下一节会看到这一点的后果。
- 2–3 行：两句写出两行。位置自己往下走，不用告诉它写第几行。
- 第 5 行：屏幕上只有这一句。前四行的成果在文件里，看不见——这正是文件和 `OUTPUT` 的区别。

示例运行：

```
Saved 2 names
```

**反例：两种漏了 `OPENFILE` 的写法**

*没打开就写*
```
WRITEFILE "Names.txt", "Ada"
```
文件得先打开才能写。这一条运行前就能查出来——编辑器顺着代码看得到这个文件从头到尾没被打开过。

- 错误（第 1 行）：这个文件还没打开，写不进去。

*关了两遍*
```
OPENFILE "Names.txt" FOR WRITE
WRITEFILE "Names.txt", "Ada"
CLOSEFILE "Names.txt"
CLOSEFILE "Names.txt"
```
第一句 `CLOSEFILE` 之后文件已经关了，第二句没有东西可关。多写一句看着无害，但它说明你对「现在这个文件是开着还是关着」记岔了。

- 错误（第 4 行）：这个文件已经关掉了，不能再关一次。

**关卡**（single-choice）　为什么 `WRITEFILE` 和 `CLOSEFILE` 都要把文件名再写一遍？

- **A** 因为 `OPENFILE` 之后文件名就忘了
  - ✗ 没忘，文件一直开着。重写文件名是为了指明是哪一个，不是因为它丢了。
- **B** 因为程序里可以同时开着好几个文件，每一句都得说清是对哪一个
  - ✓ 对。一边读一个文件一边写另一个是很常见的做法（14.6 就要这么干），所以每一句都得指名道姓。
- **C** 因为文件名每次都可能不一样
  - ✗ 同一个文件从打开到关掉当然是同一个名字。能变的是你打开的是哪个文件，不是它中途改名。
- **D** 只是写法要求，省掉也能跑
  - ✗ 省不掉。不写文件名这几句就不完整，编辑器会当成写错了。


---

## 14.3　`READFILE`：把它读回来

<sub>§10.3｜约 11 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`、`assign.simple`、`decl.constant`、`op.arithmetic`、`op.div`、`op.mod`、`op.relational`、`op.and`、`op.or`、`op.not`、`select.if`、`select.if-else`、`select.nested-if`、`select.case`、`select.case-range`、`select.case-otherwise`、`loop.for`、`loop.for-step`、`loop.while`、`loop.repeat`、`loop.nested`、`builtin.length`、`builtin.mid`、`builtin.right`、`builtin.ucase`、`builtin.lcase`、`op.concat`、`builtin.int`、`builtin.rand`、`decl.array-1d`、`array.index`、`decl.array-2d`、`array.index-2d`、`decl.record-type`、`record.field-access`、`routine.procedure`、`routine.call`、`param.byval`、`param.byref`、`routine.function`、`routine.return`、`expr.function-call`、`file.open-write`、`file.write`、`file.close`、`file.open-read`、`file.read`</sub>

读要用 `FOR READ` 打开：`OPENFILE "Names.txt" FOR READ`。这种方式不改动文件内容，只是从第 1 行开始往下看。

`READFILE "Names.txt", Line` 读**当前这一行**，放进 `Line` 这个变量里，然后位置往下挪一行。下一句 `READFILE` 读到的就是下一行——和写的时候一样，位置自己走。

接收的那个变量**必须是 `STRING`**。文件里装的就是文字，哪怕那一行看起来是个数字，读回来也是一段文字；写成 `INTEGER` 变量接，运行前就被拦下来。

还有一件事值得先记住：**`FOR READ` 打开一个不存在的文件会直接停下来**。所以下面每个例子都是先写再读——这一段程序自己把文件准备好，不指望它本来就在。

> **规则**（CAIE 规定）　`READFILE <文件>, <变量>` 的目标变量应为 `STRING`（G§9.1）。

**示例：先写两行，再一行一行读回来**　`Example_14_3_a.pseudocode`

```
OPENFILE "Names.txt" FOR WRITE
WRITEFILE "Names.txt", "Ada"
WRITEFILE "Names.txt", "Bob"
CLOSEFILE "Names.txt"
DECLARE Line : STRING
OPENFILE "Names.txt" FOR READ
READFILE "Names.txt", Line
OUTPUT "1: ", Line
READFILE "Names.txt", Line
OUTPUT "2: ", Line
CLOSEFILE "Names.txt"
```
- 1–4 行：先把文件写出来再关掉。不关就读不了——文件同一时刻只能开着一个。
- 7–9 行：两句 `READFILE` 读到的是两行不同的内容：位置在第一句之后自己往下走了一行。
- 第 5 行：接收的变量是 `STRING`。这一行写成 `INTEGER` 的话，第 7 行就过不去。

示例运行：

```
1: Ada
2: Bob
```

**反例：读不出来的两种情况**

*拿 `INTEGER` 变量去接*
```
DECLARE N : INTEGER
OPENFILE "Nums.txt" FOR WRITE
WRITEFILE "Nums.txt", 5
CLOSEFILE "Nums.txt"
OPENFILE "Nums.txt" FOR READ
READFILE "Nums.txt", N
CLOSEFILE "Nums.txt"
```
写进去的 `5` 在文件里已经是文字了。读回来只能进 `STRING`——**文件不记得它原来是个数**，而伪代码里没有把这段文字变回数的办法。

- 错误（第 6 行）：读文件只能读进 `STRING` 变量。

*打开一个不存在的文件来读*
```
DECLARE Line : STRING
OPENFILE "Ghost.txt" FOR READ
READFILE "Ghost.txt", Line
CLOSEFILE "Ghost.txt"
```
这段代码本身没有任何写法问题，所以运行前查不出来——要等真的去找这个文件，发现没有，程序才停在打开那一行。

- 运行时（第 2 行，RT2005）：要读的这个文件不存在，程序停在打开它的那一行。

**关卡**（single-choice）　连着写两句 `READFILE "Names.txt", Line`，第二句读到的是什么？

- **A** 还是第 1 行，因为没告诉它往下走
  - ✗ 位置是自己走的。读完一行之后它就指向下一行了，不需要另外一句去推它。
- **B** 第 2 行
  - ✓ 对。`READFILE` 读完当前行之后位置加一，所以连着读就是一行一行往下。写的时候也是同一套规矩。
- **C** 整个文件的内容拼在一起
  - ✗ `READFILE` 一次只读一行，读多少行就得写多少句（或者让循环去写）。
- **D** 最后一行
  - ✗ 位置每次只往下挪一格，不会跳到末尾。


### 小节题： 存下来再念一遍｜`14.3.1`

写一段伪代码：读入 3 个名字，逐个写进一个文本文件；写完关掉，再把这个文件打开读回来，一行一个显示出来。文件名自己定。

- **输入**：三行，各一个名字（`STRING`）。每次读取之前都要显示提示语，一字不差：
`Enter a name`
- **输出**：三行，就是读进来的那三个名字，顺序不变。
- **必须用** `file.write` — 题目要求先把名字写到文件里去，而不是留在变量里。
- **必须用** `file.read` — 显示的内容必须是从文件读回来的，不能直接用刚才输入的变量。
- **必须用** `file.close` — 写完不关，同一个文件就打不开来读。

提示：
1. 三段：`FOR WRITE` 写三行、`CLOSEFILE`、`FOR READ` 读三行。中间那一句不能省。
2. 写和读都可以放在 `FOR` 循环里，因为行数是知道的——正好三行。
3. 接收读到的内容的那个变量必须是 `STRING`。

题面示例：
```
输入：Ada / Bob / Cal
输出：
Enter a name
Enter a name
Enter a name
Ada
Bob
Cal
```

<details><summary>参考解（学生看不到）</summary>

```
DECLARE Name : STRING
DECLARE I : INTEGER
OPENFILE "Names.txt" FOR WRITE
FOR I ← 1 TO 3
   OUTPUT "Enter a name"
   INPUT Name
   WRITEFILE "Names.txt", Name
NEXT I
CLOSEFILE "Names.txt"
OPENFILE "Names.txt" FOR READ
FOR I ← 1 TO 3
   READFILE "Names.txt", Name
   OUTPUT Name
NEXT I
CLOSEFILE "Names.txt"
```

判题用例（对学生隐藏，失败时只显示 caseHint）：

- `normal` 输入 Red / Green / Blue — 三个普通的名字。
- `normal` 输入 Two words / X / Something longer — 有的名字里带空格，有的只有一个字母。
- `boundary` 输入 Same / Same / Same — 三个名字完全一样，顺序看不出来但行数得对。
- `boundary` 输入 A / B / C — 三个名字都只有一个字母。
- `extreme` 输入 QWERTYUIOPASDFGHJKLZXCVBNM / Z / Mixed Case Name — 一个特别长，一个特别短。

</details>

---

## 14.4　三种模式：`READ`、`WRITE`、`APPEND`

<sub>§10.3｜约 10 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`、`assign.simple`、`decl.constant`、`op.arithmetic`、`op.div`、`op.mod`、`op.relational`、`op.and`、`op.or`、`op.not`、`select.if`、`select.if-else`、`select.nested-if`、`select.case`、`select.case-range`、`select.case-otherwise`、`loop.for`、`loop.for-step`、`loop.while`、`loop.repeat`、`loop.nested`、`builtin.length`、`builtin.mid`、`builtin.right`、`builtin.ucase`、`builtin.lcase`、`op.concat`、`builtin.int`、`builtin.rand`、`decl.array-1d`、`array.index`、`decl.array-2d`、`array.index-2d`、`decl.record-type`、`record.field-access`、`routine.procedure`、`routine.call`、`param.byval`、`param.byref`、`routine.function`、`routine.return`、`expr.function-call`、`file.open-write`、`file.write`、`file.close`、`file.open-read`、`file.read`、`file.open-append`</sub>

`OPENFILE` 的 `FOR` 后面只有三个词可写，各管一件事。`READ`：从第 1 行开始往下读，一个字都不改。`WRITE`：**打开的一瞬间就把原有内容全部清空**，然后从第 1 行开始写。`APPEND`：保留原有内容，从最后一行的后面接着写。

`WRITE` 那条要特别小心：它不是「准备往里写点东西」，而是「这个文件从现在起重新来过」。想在已有内容后面添一行却写成了 `FOR WRITE`，**原来的东西一句提示都不给就没了**。

选哪个的判据很短：**原来的内容还要不要？**不要就 `WRITE`，要留着就 `APPEND`，只是看看就 `READ`。

模式一旦选定就管住了这次能做什么：`FOR READ` 打开的文件不能 `WRITEFILE`，`FOR WRITE` 打开的不能 `READFILE`。要换着来，就得先 `CLOSEFILE` 再用另一种方式重新打开。

> **规则**（CAIE 规定）　`WRITEFILE` 仅用于 `WRITE` 或 `APPEND` 模式；同一文件应一次只以一种模式打开（G§9.1）。

**示例：`APPEND` 留着，`WRITE` 抹掉**　`Example_14_4_a.pseudocode`

```
DECLARE Line : STRING
OPENFILE "Log.txt" FOR WRITE
WRITEFILE "Log.txt", "first"
CLOSEFILE "Log.txt"
OPENFILE "Log.txt" FOR APPEND
WRITEFILE "Log.txt", "second"
CLOSEFILE "Log.txt"
OPENFILE "Log.txt" FOR READ
READFILE "Log.txt", Line
OUTPUT "after append 1: ", Line
READFILE "Log.txt", Line
OUTPUT "after append 2: ", Line
CLOSEFILE "Log.txt"
OPENFILE "Log.txt" FOR WRITE
WRITEFILE "Log.txt", "third"
CLOSEFILE "Log.txt"
OPENFILE "Log.txt" FOR READ
READFILE "Log.txt", Line
OUTPUT "after write 1: ", Line
CLOSEFILE "Log.txt"
```
- 5–6 行：`APPEND` 接在后面写。文件现在有两行。
- 9–12 行：读出来确实是两行，`first` 还在。
- 14–15 行：同样是写一行，这次用 `WRITE`——打开那一瞬间前两行就没了。
- 18–19 行：再读，第 1 行已经是 `third`。原来那两行找不回来了。

示例运行：

```
after append 1: first
after append 2: second
after write 1: third
```

**反例：用 `FOR READ` 打开却想往里写**

```
OPENFILE "Log.txt" FOR WRITE
CLOSEFILE "Log.txt"
OPENFILE "Log.txt" FOR READ
WRITEFILE "Log.txt", "x"
CLOSEFILE "Log.txt"
```
打开的方式说了这次只读，那这次就只能读。想写就先关掉、再用 `FOR WRITE` 或 `FOR APPEND` 打开一次。

- 错误（第 4 行）：这个文件是按只读方式打开的，写不进去。

**关卡**（single-choice）　一个文件里已经有三行。用 `FOR WRITE` 打开它、什么都不写就 `CLOSEFILE`，文件里还剩几行？

- **A** 四行，多出一行空的
  - ✗ 没写就不会多出行。`WRITEFILE` 才会添行。
- **B** 编辑器会拦住这种没意义的操作
  - ✗ 不拦。「打开准备写，结果发现没什么可写」在程序里很正常，编辑器没法判断你是不是真想清空。
- **C** 三行，因为没写东西进去
  - ✗ 清空发生在**打开**的那一刻，不是写的时候。一句 `WRITEFILE` 都没有，那三行照样已经没了。
- **D** 零行
  - ✓ 对。`FOR WRITE` 一打开就把文件清空。这也是「想添一行却写成 `WRITE`」特别危险的原因——没有任何提示。


---

## 14.5　`EOF`：读到哪儿算完

<sub>§10.3｜约 11 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`、`assign.simple`、`decl.constant`、`op.arithmetic`、`op.div`、`op.mod`、`op.relational`、`op.and`、`op.or`、`op.not`、`select.if`、`select.if-else`、`select.nested-if`、`select.case`、`select.case-range`、`select.case-otherwise`、`loop.for`、`loop.for-step`、`loop.while`、`loop.repeat`、`loop.nested`、`builtin.length`、`builtin.mid`、`builtin.right`、`builtin.ucase`、`builtin.lcase`、`op.concat`、`builtin.int`、`builtin.rand`、`decl.array-1d`、`array.index`、`decl.array-2d`、`array.index-2d`、`decl.record-type`、`record.field-access`、`routine.procedure`、`routine.call`、`param.byval`、`param.byref`、`routine.function`、`routine.return`、`expr.function-call`、`file.open-write`、`file.write`、`file.close`、`file.open-read`、`file.read`、`file.open-append`、`builtin.eof`</sub>

上面那些例子都知道文件里有几行，所以用 `FOR` 就够了。可真实的文件通常**不知道有几行**——那是别人写进去的，或者上次运行留下的。

`EOF("Names.txt")` 回答的就是这个问题：当前位置已经越过最后一行了吗？越过了还 `TRUE`，还有行可读就是 `FALSE`。名字来自 **文件末尾（end of file）**。

所以读整个文件的标准写法是 `WHILE NOT EOF("Names.txt")`：还没到末尾就继续读一行。这是第 5 章说的「次数事先不知道」，而且**一行都没有的文件应该一次都不读**——正好是前测循环。

少了这道判断，读到末尾之后再读一句，程序就停在那一行。文件里到底有几行不是你能假设的事，**能读多少行要问 `EOF`，不要靠记**。

> **规则**（CAIE 规定）　`EOF(<文件>)` 返回 `BOOLEAN`，用于判断是否已到文件末尾（G§9.1）。

**示例：读完整个文件，顺便数数有几行**　`Example_14_5_a.pseudocode`

```
DECLARE Line : STRING
DECLARE Count : INTEGER
OPENFILE "Names.txt" FOR WRITE
WRITEFILE "Names.txt", "Ada"
WRITEFILE "Names.txt", "Bob"
WRITEFILE "Names.txt", "Cal"
CLOSEFILE "Names.txt"
Count ← 0
OPENFILE "Names.txt" FOR READ
WHILE NOT EOF("Names.txt")
   READFILE "Names.txt", Line
   Count ← Count + 1
   OUTPUT Count, ": ", Line
ENDWHILE
CLOSEFILE "Names.txt"
OUTPUT "Total: ", Count
```
- 10–14 行：循环的条件只看 `EOF`。这段代码不知道也不需要知道文件里有三行——换成三十行它一个字都不用改。
- 第 11 行：`READFILE` 在循环体的第一句。位置每读一行就往下走，所以 `EOF` 迟早会变成 `TRUE`。
- 第 16 行：行数是数出来的，不是事先知道的。

示例运行：

```
1: Ada
2: Bob
3: Cal
Total: 3
```

**反例：多读了一行**

```
DECLARE Line : STRING
OPENFILE "One.txt" FOR WRITE
WRITEFILE "One.txt", "only"
CLOSEFILE "One.txt"
OPENFILE "One.txt" FOR READ
READFILE "One.txt", Line
OUTPUT Line
READFILE "One.txt", Line
OUTPUT Line
CLOSEFILE "One.txt"
```
文件里只有一行，却读了两句。第一句好好的，第二句已经没有行可读——**程序会先把第一行显示出来再停下来**，所以屏幕上看得到一部分结果，很容易误以为整段都跑完了。

- 运行时（第 8 行，RT2002）：已经读到文件末尾了，这一句没有行可读。

**关卡**（single-choice）　一个刚用 `FOR WRITE` 创建、一行都没写的空文件，用 `FOR READ` 打开之后 `EOF` 是什么？

- **A** `TRUE`
  - ✓ 对。所以 `WHILE NOT EOF(...)` 对空文件一次都不会进循环——这正是它该用前测循环而不是 `REPEAT` 的原因。
- **B** 程序会因为文件是空的而停下来
  - ✗ 空文件是完全正常的文件，打开它没有任何问题。停下来的是「已经到末尾还硬读一句」。
- **C** 要看这个文件之前有没有内容
  - ✗ `FOR WRITE` 打开的那一刻就把原有内容清空了，所以现在它确实一行都没有。
- **D** `FALSE`，要读一次才知道
  - ✗ 不用读就知道。`EOF` 问的是「当前位置有没有越过最后一行」，空文件一打开就已经越过了。


### 小节题： 存下来，再编号念一遍｜`14.5.1`

写一段伪代码：读入 4 行文字，逐行写进一个文本文件；写完关掉，再用 `EOF` 控制的循环把整个文件读回来，一行一个显示，每行前面加上行号。**不要用 `FOR` 循环去读**——读的时候就当作不知道文件里有几行。

- **输入**：四行文字（`STRING`）。每次读取之前都要显示提示语，一字不差：
`Enter a line`
- **输出**：四行，写成：
`<行号>: <那一行的内容>`
行号从 1 开始，冒号后面一个空格。
- **必须用** `builtin.eof` — 题目要求读的时候不许假设文件有几行，只能问 `EOF`。
- **必须用** `loop.while` — 一行都没有的文件应该一次都不读，所以要用先看条件的循环。
- **必须用** `file.read` — 显示的内容必须是从文件读回来的。

提示：
1. 写的时候行数是知道的，可以用 `FOR`；读的时候不知道，要用 `WHILE NOT EOF(...)`。
2. 行号用一个从 0 开始的计数变量，每读一行加一。
3. 写完一定要 `CLOSEFILE`，否则同一个文件打不开来读。

题面示例：
```
输入：red / green / blue / white
输出：
Enter a line
Enter a line
Enter a line
Enter a line
1: red
2: green
3: blue
4: white
```

<details><summary>参考解（学生看不到）</summary>

```
DECLARE Line : STRING
DECLARE I : INTEGER
DECLARE Count : INTEGER
OPENFILE "Notes.txt" FOR WRITE
FOR I ← 1 TO 4
   OUTPUT "Enter a line"
   INPUT Line
   WRITEFILE "Notes.txt", Line
NEXT I
CLOSEFILE "Notes.txt"
Count ← 0
OPENFILE "Notes.txt" FOR READ
WHILE NOT EOF("Notes.txt")
   READFILE "Notes.txt", Line
   Count ← Count + 1
   OUTPUT Count, ": ", Line
ENDWHILE
CLOSEFILE "Notes.txt"
```

判题用例（对学生隐藏，失败时只显示 caseHint）：

- `normal` 输入 one / two / three / four — 四行普通的文字。
- `normal` 输入 a b c / d / e f / g h i j — 有的行里带空格，长短不一。
- `boundary` 输入 x / x / x / x — 四行内容完全一样，只有行号能区分。
- `boundary` 输入 1 / 2 / 3 / 4 — 写进去的看着像数字，读回来仍然是文字。
- `extreme` 输入 Q / WERTYUIOPASDFGHJKLZXCVBNM / e / R — 一行特别长，其余都只有一个字母。

</details>

---

## 14.6　完整处理一个文件

<sub>§10.3｜约 9 分钟｜可用写法：`io.output`、`io.input`、`decl.variable`、`misc.comment`、`type.string`、`literal.string`、`type.integer`、`type.real`、`type.char`、`type.boolean`、`type.date`、`literal.integer`、`literal.real`、`literal.char`、`literal.boolean`、`literal.date`、`assign.simple`、`decl.constant`、`op.arithmetic`、`op.div`、`op.mod`、`op.relational`、`op.and`、`op.or`、`op.not`、`select.if`、`select.if-else`、`select.nested-if`、`select.case`、`select.case-range`、`select.case-otherwise`、`loop.for`、`loop.for-step`、`loop.while`、`loop.repeat`、`loop.nested`、`builtin.length`、`builtin.mid`、`builtin.right`、`builtin.ucase`、`builtin.lcase`、`op.concat`、`builtin.int`、`builtin.rand`、`decl.array-1d`、`array.index`、`decl.array-2d`、`array.index-2d`、`decl.record-type`、`record.field-access`、`routine.procedure`、`routine.call`、`param.byval`、`param.byref`、`routine.function`、`routine.return`、`expr.function-call`、`file.open-write`、`file.write`、`file.close`、`file.open-read`、`file.read`、`file.open-append`、`builtin.eof`</sub>

真正用得上文件的程序多半长成同一个样子：**读一个文件 → 一行一行处理 → 把结果写进另一个文件**。中间那一步可以是筛选、统计、改写，形状都一样。

关键在于**两个文件同时开着**：一个 `FOR READ`，一个 `FOR WRITE`。每一句 `READFILE` / `WRITEFILE` 都写着自己的文件名，所以互不干扰——这就是 14.2 里说的「每一句都要指名道姓」的用处。

**不要一边读一边往同一个文件里写。**同一个文件同一时刻只能开着一个，而且 `FOR WRITE` 一打开就把你正要读的内容清空了。要改一个文件，做法是「读旧的、写新的」。

最后别忘了两个文件都要 `CLOSEFILE`。写的那个不关，接下来想读它就打不开。

**示例：把长的那些挑进另一个文件**　`Example_14_6_a.pseudocode`

```
DECLARE Line : STRING
OPENFILE "In.txt" FOR WRITE
WRITEFILE "In.txt", "ada"
WRITEFILE "In.txt", "bo"
WRITEFILE "In.txt", "cathy"
CLOSEFILE "In.txt"
OPENFILE "In.txt" FOR READ
OPENFILE "Out.txt" FOR WRITE
WHILE NOT EOF("In.txt")
   READFILE "In.txt", Line
   IF LENGTH(Line) >= 3 THEN
      WRITEFILE "Out.txt", Line
   ENDIF
ENDWHILE
CLOSEFILE "In.txt"
CLOSEFILE "Out.txt"
OPENFILE "Out.txt" FOR READ
WHILE NOT EOF("Out.txt")
   READFILE "Out.txt", Line
   OUTPUT Line
ENDWHILE
CLOSEFILE "Out.txt"
```
- 7–8 行：两个文件同时开着，一个只读一个只写。名字不同，所以互不影响。
- 9–14 行：整个处理就这一个循环：读一行、判断、够格的写出去。`EOF` 管的是读的那个文件。
- 15–16 行：两个都要关。下面要读 `Out.txt`，不关就打不开。
- 17–22 行：把结果念出来只是为了看得见——真正的成果是 `Out.txt` 这个文件。

示例运行：

```
ada
cathy
```

**关卡**（single-choice）　想把一个文件里的每一行都改成大写再存回去。下面哪种做法可行？

- **A** 先 `FOR READ` 读完全部内容，再 `FOR WRITE` 打开同一个文件写回去
  - ✗ 这个思路是对的，但得先把读到的内容存进数组之类的地方——读完必须先 `CLOSEFILE`，而文件里的内容在 `FOR WRITE` 打开那一刻就没了。
- **B** 同时用 `FOR READ` 和 `FOR WRITE` 打开这一个文件，边读边写回去
  - ✗ 同一个文件同一时刻只能开着一个，这一步就过不去；就算过得去，`FOR WRITE` 一打开就把要读的内容清空了。
- **C** 读原文件、写一个新文件，处理完再把新文件当作结果
  - ✓ 对。「读旧的、写新的」是处理文件的标准形状，两个文件同时开着，各干各的。
- **D** 用 `FOR APPEND` 打开原文件，把大写的行接在后面
  - ✗ 那样文件里会变成「原来的小写 + 新加的大写」，原来那些一行都没少。


---


## 章末大题： 挑出长名字｜`14.T1`

写一段伪代码：读入 5 个名字写进一个文本文件；然后把这个文件读回来，把**长度 5 个字符及以上**的名字挑出来写进第二个文件；最后把第二个文件读出来显示，并在末尾报出挑中了几个。读文件时都不许假设有几行。

- **输入**：五行，各一个名字（`STRING`）。每次读取之前都要显示提示语，一字不差：
`Enter a name`
- **输出**：先是挑中的那些名字，一行一个，顺序和输入时一样；最后一行写成：
`Count: <挑中的个数>`
冒号后面一个空格。一个都没挑中时就只有最后这一行。
- **建议用到**：`file.open-write`、`file.open-read`、`file.write`、`file.read`、`file.close`、`builtin.eof`、`builtin.length`、`loop.while`、`select.if`、`io.input`、`io.output`

提示：
1. 三段：写第一个文件、把第一个筛进第二个、把第二个念出来。每段之间都要把用完的文件关掉。
2. 筛选那一段两个文件同时开着，一个 `FOR READ` 一个 `FOR WRITE`，每一句都写清是哪一个。
3. 个数在念第二个文件的时候顺手数就行，不必在筛选的时候数。

题面示例：
```
输入：Ada / Belinda / Cal / Dorothy / Eve
输出：
Enter a name
Enter a name
Enter a name
Enter a name
Enter a name
Belinda
Dorothy
Count: 2
```

<details><summary>参考解（学生看不到）</summary>

```
DECLARE Name : STRING
DECLARE I : INTEGER
DECLARE Count : INTEGER
OPENFILE "Names.txt" FOR WRITE
FOR I ← 1 TO 5
   OUTPUT "Enter a name"
   INPUT Name
   WRITEFILE "Names.txt", Name
NEXT I
CLOSEFILE "Names.txt"
OPENFILE "Names.txt" FOR READ
OPENFILE "Long.txt" FOR WRITE
WHILE NOT EOF("Names.txt")
   READFILE "Names.txt", Name
   IF LENGTH(Name) >= 5 THEN
      WRITEFILE "Long.txt", Name
   ENDIF
ENDWHILE
CLOSEFILE "Names.txt"
CLOSEFILE "Long.txt"
Count ← 0
OPENFILE "Long.txt" FOR READ
WHILE NOT EOF("Long.txt")
   READFILE "Long.txt", Name
   Count ← Count + 1
   OUTPUT Name
ENDWHILE
CLOSEFILE "Long.txt"
OUTPUT "Count: ", Count
```

判题用例（对学生隐藏，失败时只显示 caseHint）：

- `normal` 输入 Alice / Bo / Charlie / Di / Edward — 长短掺着来，挑中的不止一个。
- `boundary` 输入 Anna / Bob / Cy / Dee / Eli — 一个都够不着长度门槛。
- `boundary` 输入 Abcde / Fghij / Klmno / Pqrst / Uvwxy — 五个名字都正好踩在长度门槛上。
- `normal` 输入 Ann / Two words / Bo / Cy / Di — 挑中的只有一个，而且里面带空格。
- `extreme` 输入 A / QWERTYUIOPASDFGHJKLZXCVBNM / B / C / D — 一个特别长，其余都只有一个字母。

</details>
