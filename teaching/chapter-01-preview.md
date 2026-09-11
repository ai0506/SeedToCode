# Chapter 1 — 算法、伪代码与书写规范  `[AS]`

对应 §9.2、§11.1、G§1｜内容预览（不是最终版式，只是把数据平铺出来读）


---

## 1.1　算法与伪代码

<sub>§9.2、§11.1｜约 8 分钟｜可用写法：`io.output`、`literal.string`</sub>

把「泡一杯茶」讲给一个从没泡过茶的人听，你不能只说「泡一杯茶」，得拆开：烧水、把茶叶放进杯子、倒热水、等三分钟。这样一串照着做就能把事情做完的步骤，就是一个**算法（algorithm）**。

一串步骤要算得上算法，得满足三件事：每一步都明确，不留「随便」「差不多」的余地；先后顺序确定；照着做下去一定会结束。

但用**自然语言（natural language）**写步骤有个麻烦：同一件事十个人十种写法，而且「等一会儿」「差不多」这类说法读的人各有各的理解。**伪代码（pseudocode）**就是为此规定的一套固定写法——比自然语言严格，每种操作只有一种写法；又比真实的编程语言宽松，不用管分号、括号那些各家不同的细节。CAIE 的这套写法定义在一份叫 Pseudocode Guide 的文件里，本课程和这个编辑器用的都是它。

伪代码本来是写给人看的，不要求能跑。但这个编辑器可以运行它——写完按运行就能看到结果，不用猜自己写得对不对。

> **规则**（CAIE 规定）　考纲对算法的说法是：把一个问题的解法表达成一串有明确定义的步骤（a sequence of defined steps）。

**示例：最短的一个程序**　`Example_1_1_a.pseudocode`

```
OUTPUT "Hello, world"
```
- 第 1 行：`OUTPUT` 是「把后面的东西显示出来」。双引号里的内容原样显示，引号本身不会出现。

示例运行：

```
Hello, world
```

**关卡**（single-choice）　下面哪一段才算得上一个算法？

- **A** 「做一杯茶。」
  - ✗ 这只说了要什么结果，没说怎么做到。算法回答的是「怎么做」。
- **B** 「1 烧水。2 把茶叶放进杯子。3 倒入热水。4 等三分钟。」
  - ✓ 四步都明确，顺序确定，做完第 4 步就结束。三个条件都满足。
- **C** 「烧水，然后随便等一会儿，觉得差不多了就好。」
  - ✗ 「随便」「差不多」没有确定的含义，两个人照着做会得到不同结果，这一步没被定义清楚。
- **D** 「1 倒入热水。2 回到第 1 步。」
  - ✗ 每步都明确、顺序也确定，但它永远不会结束。算法必须停得下来。


---

## 1.2　顺序、输入与输出

<sub>§9.2、§11.1｜约 12 分钟｜可用写法：`io.output`、`literal.string`、`io.input`、`decl.variable`、`type.string`</sub>

程序从第一行开始，一行一行往下，做完一行才做下一行。这种「按写下来的先后顺序做」叫**顺序（sequence）**。它的直接后果是：换掉两行的位置，结果就变了。

光靠 `OUTPUT` 的程序每次跑出来都一样。有用的程序通常是这个形状：先把数据拿进来，再拿它做点什么，最后把结果给出去——这三段叫 input、process 和 output。这一章的「处理」还很单薄，基本上就是把读到的东西按想要的格式摆出来；真正的处理——算术、判断、重复——从 Chapter 3 开始。

拿数据进来用 `INPUT`，程序走到这里会停下来等你输入。但在读之前得先准备一个「名字」来存放它，用 `DECLARE 名字 : 类型`，其中 `STRING` 表示一串文字。`DECLARE` 和类型是 Chapter 2 的正题，这一节照着这个形状写就行。

还有一件事：程序停下来等输入的时候，屏幕上如果什么都没有，用的人只会看到光标在闪，不知道该打什么。所以每次 `INPUT` 之前，都要先说一句要输入什么。

`OUTPUT` 可以一次显示多样东西，中间用逗号隔开；显示时它们挨着连起来，逗号本身不出现。想留空格就得自己写进引号里。

> **规则**（CAIE 规定）　`OUTPUT` 后面可以跟多个值，用逗号分隔，一次全部输出（Pseudocode Guide §5.1）。

> **规则**（编辑器约定）　每一个 `INPUT` 之前，都先用一句 `OUTPUT` 说明要输入什么，成对出现：
`OUTPUT "Enter the name"`
`INPUT Name`
Pseudocode Guide 没有规定这一条，但正式发布的伪代码范例一律这么写。

> **规则**（编辑器约定）　程序等待输入时会停在那一行并高亮它；输入的内容要和 `DECLARE` 时写的类型对得上，否则会请你重新输入。

**示例：问名字，然后打招呼**　`Example_1_2_a.pseudocode`

```
DECLARE Name : STRING
OUTPUT "What is your name?"
INPUT Name
OUTPUT "Hello, ", Name
```
- 第 1 行：准备一个叫 `Name` 的名字，用来存一串文字。此刻它还是空的。
- 2–3 行：先问一句，再停下来等输入。这两行的顺序不能换——先读的话，屏幕上什么都没有，人不知道该输入什么。
- 第 4 行：一次显示两样东西。`Hello,` 后面那个空格写在引号里；没有它，结果就是 `Hello,Ada`。

示例运行（`>` 开头的那行是输入）：

```
What is your name?
> Ada
Hello, Ada
```

**对照：同一个程序的三种写法**

现在你能读懂伪代码了，可以回头看看它到底站在什么位置：一边是自然语言，一边是真实的编程语言。

*自然语言*
```
先问用户叫什么名字，
等他回答之后，
跟他打个招呼。
```
> 读起来最轻松，但「打个招呼」到底显示成什么样？没说。三个人照这段话写出来的程序会是三个样子。

*伪代码*
```
DECLARE Name : STRING
OUTPUT "What is your name?"
INPUT Name
OUTPUT "Hello, ", Name
```
> 每一步该显示什么、该读什么，都写死了，不留解释的余地；同时又只用了四个固定词，没有别的负担。

*真实的编程语言（Python）*
```python
print("What is your name?")
name = input()
print("Hello, " + name)
```
> 一样精确，但夹带了这门语言自己的规矩：函数名小写、要加括号、连接文字用加号、不用先准备名字。换一门语言，这些规矩又全变一遍——而算法本身根本没变。

**关卡**（single-choice）　下面这段代码把提问放在了读取之后。运行它，屏幕上会依次发生什么？

```
DECLARE Name : STRING
INPUT Name
OUTPUT "What is your name?"
OUTPUT "Hello, ", Name
```
- **A** 程序一上来就停下等输入，屏幕上还是空的；输入完才看到那句提问。
  - ✓ 对。程序按行往下走：第 2 行先停下等输入，此时第 3 行还没轮到，屏幕上什么都没有。等输入完，提问和问候才依次出现。
- **B** 先显示提问，再停下等输入——和原来的顺序一样。
  - ✗ 不会。程序不会替你把提问挪到前面，它只按你写下的先后顺序执行。第 3 行排在第 2 行后面，就一定后发生。
- **C** 编辑器会报错，因为提问必须写在读取之前。
  - ✗ 不会报错。这两行的顺序对代码本身来说完全合法，程序照跑不误——只是跑出来的效果对使用的人不友好。语法对不对，和好不好用是两回事。
- **D** 第 4 行会显示 `Hello, `，后面是空的，因为 `Name` 还没读到。
  - ✗ `Name` 在第 2 行就已经读到了，第 4 行用它没有问题。真正别扭的是提问出现得太晚。


### 小节题： 问两样东西，拼成一句话｜`1.2.1`

写一段伪代码：先提示并读入一个人的名字，再提示并读入他所在的城市，最后显示一行 `<名字> lives in <城市>`。

- **输入**：两行。第一行是名字，第二行是城市，都是一串文字（`STRING`）。
- **输出**：三行，依次是：
`Enter the name`　（读名字之前）
`Enter the city`　（读城市之前）
`<名字> lives in <城市>`　（`lives in` 前后各一个空格）
两句提示语要一字不差。
- **必须用** `io.input` — 这一节的重点是先把数据读进来再用，所以名字和城市都必须读进来，不能直接写在 `OUTPUT` 里。

提示：
1. 一共要显示三行、读两次，而且提示语要排在它对应的那次读取**前面**。
2. 先按顺序把五句话排好：提示、读、提示、读、最后一行输出。再去想每句怎么写。
3. 最后那一行要显示三样东西：第一个名字、引号里的 ` lives in `、第二个名字。空格写在引号里。

题面示例：
```
输入：Ada / Lagos
输出：
Enter the name
Enter the city
Ada lives in Lagos
```

<details><summary>参考解（学生看不到）</summary>

```
DECLARE Name : STRING
DECLARE City : STRING
OUTPUT "Enter the name"
INPUT Name
OUTPUT "Enter the city"
INPUT City
OUTPUT Name, " lives in ", City
```

判题用例（对学生隐藏，失败时只显示 caseHint）：

- `normal` 输入 Chen / Shanghai — 一个普通的名字和一个普通的城市。
- `normal` 输入 Bianca / Lisbon — 换一组名字和城市，确认程序不是把答案写死的。
- `boundary` 输入 A / B — 当名字和城市都只有一个字母时。
- `extreme` 输入 Maximiliana Gwendolyn Rosalind / San Cristobal de las Casas — 当名字和城市都很长、而且中间带空格时。

</details>

---

## 1.3　书写规范与注释

<sub>G§1｜约 7 分钟｜可用写法：`io.output`、`literal.string`、`io.input`、`decl.variable`、`type.string`、`misc.comment`</sub>

同一段程序有很多种写法都能跑，但 CAIE 对它长什么样是有规定的。两条最常用到的是：固定词（`OUTPUT`、`INPUT`、`DECLARE`）和类型名（`STRING`）全部大写；需要缩进时用三个空格。你自己起的名字不受大小写这条约束，习惯上首字母大写。

这一章的程序每行都顶格，还看不出缩进的用处；等 Chapter 4 写到「某些行属于某个判断内部」时，缩进就是一眼看出层次的依据。现在只要记住：不该缩进的行别随手缩进。

代码里可以写给人看的说明文字，叫**注释（comment）**。写法是两个斜杠 `//`，从它开始到行尾都是注释，完全不参与执行。注释可以单独占一行，也可以跟在代码后面。

注释该写「为什么这么做」，不是把代码翻译一遍。在 `INPUT Name` 后面写「读入名字」没有任何新信息；写「这里要的是全名，不是姓」才有用。

> **规则**（CAIE 规定）　关键字与类型名用大写，缩进用三个空格，注释以 `//` 开始并作用到行尾（Pseudocode Guide §1.2、§1.3、§1.5）。

**示例：带注释的完整程序**　`Example_1_3_a.pseudocode`

```
// 问出用户的名字并打招呼
DECLARE Name : STRING
OUTPUT "What is your name?"
INPUT Name          // 这里会停下来等输入
OUTPUT "Hello, ", Name
```
- 第 1 行：单独占一行的注释，说明整段程序在做什么。它不会被执行，也不会显示出来。
- 第 4 行：跟在代码后面的注释。`INPUT Name` 照常执行，`//` 后面的内容被跳过。

示例运行（`>` 开头的那行是输入）：

```
What is your name?
> Ada
Hello, Ada
```

**关卡**（single-choice）　运行下面这段代码，会显示什么？

```
// OUTPUT "One"
OUTPUT "Two"
```
- **A** 只显示 Two
  - ✓ 对。第 1 行以 `//` 开头，整行都是注释，程序直接跳过。给一行代码前面加 `//`，就等于暂时让它不生效。
- **B** 先显示 One，再显示 Two
  - ✗ 第 1 行虽然长得像代码，但前面有 `//`，整行都是给人看的说明，不会被执行。
- **C** 只显示 One
  - ✗ 正好相反。被 `//` 挡住的是第 1 行，第 2 行是普通代码，会照常执行。
- **D** 什么都不显示
  - ✗ `//` 只影响它所在的那一行，不会让后面的行也失效。


---

## 1.4　编辑器给你的三种提示

<sub>G§1｜约 6 分钟｜可用写法：`io.output`、`literal.string`、`io.input`、`decl.variable`、`type.string`、`misc.comment`</sub>

写代码时编辑器会在旁边给你提示。这些提示分三种，含义差别很大：**错误**表示代码写得不成立、程序跑不起来，必须先改；**规范提示**表示能跑、结果也对，只是写法不符合 CAIE 的规定；**建议**既不影响运行也不是明文规定，只是这样写更清楚。

提示旁边会标出这条规定来自哪里：写着 CAIE 的，是考纲或 Pseudocode Guide 明确规定的；写着编辑器约定的，是这个工具自己定的——Cambridge 没有规定，但程序要跑就得有个说法。

**反例：错误**

```
OUTPUT "Hello"
OUTPUT
```
`OUTPUT` 后面必须说明要显示什么。第 2 行只写了 `OUTPUT`，程序不会运行。

- 错误（第 2 行）：`OUTPUT` 后面缺少要显示的内容。

**反例：规范提示**

```
output "Hello"
```
这一行能正常运行，显示 `Hello`。只是 `output` 应该大写——这是 CAIE 明确规定的写法。

- 规范提示（第 1 行）：`output` 应该写成 `OUTPUT`。

**反例：建议**

```
OUTPUT "One"
   OUTPUT "Two"
```
两行都能正常运行。只是第 2 行不属于任何内部结构，不需要缩进，顶格写更清楚。

- 建议（第 2 行）：这一行不需要缩进，建议顶格写。

**关卡**（single-choice）　三种提示里，哪一种必须先改掉，程序才能运行？

- **A** 错误
  - ✓ 对。错误意味着编辑器读不懂这段代码，不改就无法运行。另外两种都不阻止运行。
- **B** 规范提示
  - ✗ 它不阻止运行——关键字写成小写照样跑得出结果。它提醒的是写法不符合 CAIE 的规定。
- **C** 建议
  - ✗ 建议是三种里最轻的，既不影响运行也不是明文规定，采纳与否你自己决定。
- **D** 三种都必须改掉才能运行
  - ✗ 只有第一种会挡住运行。把三种混成一种看待，就分不清「非改不可」和「可以再想想」。


---


## 章末大题： 做一张选课确认单｜`1.T1`

写一段伪代码：依次读入学生的名字、要报的科目和上课的教室，然后显示四行确认单。代码要符合这一章讲过的书写规范，并且带上说明用的注释。

- **输入**：三行。依次是名字、科目、教室，都是一串文字（`STRING`）。
- **输出**：七行。三句提示语各自排在它对应的那次读取之前，一字不差：
`Enter the student name`
`Enter the subject`
`Enter the room`
三样都读完之后，再显示这四行：
`Enrolment confirmed`
`Student: <名字>`
`Subject: <科目>`
`Room: <教室>`
冒号后面都是一个空格。
- **建议用到**：`io.input`、`io.output`、`decl.variable`、`misc.comment`

提示：
1. 先把这道题拆成三段：要读几样东西、要显示几行、每行长什么样。
2. 前半段是「提示—读」重复三次，后半段是四句 `OUTPUT`。确认单的第一行不需要用到读进来的内容。
3. 确认单的四行要等三样都读完再显示；不要读一样就显示一行。

题面示例：
```
输入：Ada / Computer Science / B204
输出：
Enter the student name
Enter the subject
Enter the room
Enrolment confirmed
Student: Ada
Subject: Computer Science
Room: B204
```

<details><summary>参考解（学生看不到）</summary>

```
// 读入选课信息，输出一张确认单
DECLARE Name : STRING
DECLARE Subject : STRING
DECLARE Room : STRING
OUTPUT "Enter the student name"
INPUT Name
OUTPUT "Enter the subject"
INPUT Subject
OUTPUT "Enter the room"
INPUT Room
OUTPUT "Enrolment confirmed"
OUTPUT "Student: ", Name
OUTPUT "Subject: ", Subject
OUTPUT "Room: ", Room
```

判题用例（对学生隐藏，失败时只显示 caseHint）：

- `normal` 输入 Chen / Physics / A101 — 一组普通的选课信息。
- `normal` 输入 Bianca / Further Mathematics / Lab 3 — 当科目名和教室名都由多个单词组成时。
- `boundary` 输入 A / B / C — 当三项内容都只有一个字母时。
- `extreme` 输入 Maximiliana Gwendolyn Rosalind / Design and Technology: Product Design / Building C, Second Floor, Room 214 — 当三项内容都很长，而且里面本身带标点时。

</details>
