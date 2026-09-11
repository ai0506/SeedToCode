# 初版教学大纲评估

评估对象：用户提出的 19 章教学大纲（AS 1–12 + A Level 13–19）。
评估依据：`syllabus-9618.md`（9.2、10.1–10.4、11.1–11.3、12.1–12.3、13.1–13.2、19.1–19.2、20.1–20.2）与 `pseudocode_guide-9618.md`（§1–§13）。

## 决议（用户已确认，2026-09-09）

下面记录用户对本文各条评估的处置。**决议优先于本文其余分析内容**；[01-CURRICULUM.md](01-CURRICULUM.md) 0.2 版已按决议修订。

| # | 评估项 | 决议 |
|---|---|---|
| 1 | 初版 Ch13 应留在 AS | **采纳**。本版 Chapter 16，AS 收尾章 |
| 2.1 | 新增「追踪与调试」章 | **暂缓**。理由：这部分不属于伪代码本身。保留想法，等主线全部完成后作为**新章追加到末尾**（待定章 X1 → 将来的 Chapter 24），不插入中间。必要的排错提示就地写在循环章正文里 |
| 2.2 | 新增「测试数据四类」节 | **不进学生内容**。理由：不想让学生看到判题用的是哪些数据，避免只为通过特定用例而写。四类划分降级为**出题者的内部规则**，写在 03-EXERCISE_SPEC；同时判题用例对学生全程隐藏（见下） |
| 2.3–2.4 | AS 零散遗漏、内置函数写死 7 个 | **采纳** |
| 3 | A Level 五处遗漏（Big O / graph / hashing / OOP 术语 / exception） | **采纳** |
| 4 | AS 的 ADT 从「实现」降为「描述」 | **采纳** |
| 5 | 递归前移到进阶 ADT 之前 | **采纳**。本版 Chapter 19 |
| 6 | 拆分超级章 | **采纳**，且不用 `5A/5B` 子编号，直接拆成相邻独立章 |
| — | 整体编号 | **采纳重编号**：全课程 Chapter 1–23 一条连续编号，AS = 1–16，A Level = 17–23，中间不断号、不重起 |

由决议 2.2 连带产生的判题策略变更（已写入 [03-EXERCISE_SPEC.md](03-EXERCISE_SPEC.md)）：

- 判题用例（`tests`）**对学生完全隐藏**：不显示数量之外的任何内容，不列出用例清单。
- 题面示例（`examples`）仍然公开——它是题目描述的一部分，学生必须知道输入输出格式，且它不是判题用例。
- 用例失败时默认只给**描述性提示**（每个用例配一句中文说明，如「当数组里所有元素都相同时」），不显示具体输入与期望输出。
- 同一题连续失败 3 次后，才揭示当前失败用例的具体输入与期望输出，避免学生完全无从下手。

---

## 总评

结构合理，循序渐进没有大问题：从「什么是算法」到变量、表达式、选择、迭代、字符串、数组、记录、模块化、文件、ADT，再到 A Level 扩展，依赖关系基本正确，没有出现「用到还没教的东西」的硬伤（除下面第 5 条的递归）。

主要问题集中在六类：**AS/A Level 分界线画错一章**、**AS 缺两块必要内容**、**A Level 缺五个考纲明确要求的点**、**一处顺序建议调整**、**一处「描述」与「实现」的深度混淆**、**章节粒度严重不均**。

---

## 1. AS / A Level 分界线画错了（需要改）

初版把 **Chapter 13「Building Complete Algorithms」标为 A Level 起点**。但这一章的全部内容——理解问题、input/process/output、decomposition、stepwise refinement、选择数据结构与控制结构——来自：

- 考纲 **9.2 Algorithms（AS）**：`Content under development`、`Content under development`
- 考纲 **12.2 Program Design（AS）**

A Level additional content 的正式起点是 **13 Data Representation → 13.1 User-defined data types**，对应初版的 Chapter 14。

**建议**：Chapter 13 留在 AS，作为 **AS 综合章 / capstone**（学完 AS 全部语法后的整合训练），A Level 从「自定义数据类型」开始。

## 2. AS 缺两块内容（需要补）

### 2.1 追踪与调试（trace table / dry run）——缺失，且是最该补的一章

初版全程没有「怎么看懂一段代码在跑什么」。这不是应试技巧，而是理解执行顺序的核心工具，尤其是学生第一次写出死循环、off-by-one 的时候。而且它和本产品的运行器、变量面板、逐行高亮天然契合，是别的教学网站做不了的差异点。

**建议**：在「迭代」之后新增一章，讲 trace table（人工填表）、dry run、以及三类典型 bug（循环边界、未初始化、条件写反）。教学元素可以直接用运行器的单步 / 变量快照。

### 2.2 测试数据（12.3 Program Testing）——缺失，且和判题机制直接相关

考纲 12.3（AS）要求理解 normal / abnormal / extreme / boundary 数据。本模块的判题恰恰就是「一组输入数据 → 比对所有输出」，学生迟早会问「为什么我这样写能过 3 个用例过不了第 4 个」。

**建议**：在 AS 综合章里加一节讲测试数据类型，正好把判题器的行为讲透，把黑盒判题变成教学内容的一部分。

### 2.3 其它 AS 层面的零散遗漏

| 遗漏点 | 依据 | 建议位置 |
|---|---|---|
| 书写规范：`//` 注释、三空格缩进、关键字大写、行号 | Guide §1.1–1.5 | 并入 Chapter 1，学生第一天就会看到编辑器的 FMT 诊断 |
| 内置函数的精确清单与陷阱 | Guide §5.5–5.6 | Chapter 6（见下） |
| 未初始化变量、变量 vs 常量的取舍 | `runtime-conventions.md`；运行时会真的报错 | Chapter 2 |
| 数组术语 index / upper bound / lower bound，以及 `ARRAY[1:30]` 显式上下界 | 考纲 10.2 明确列出这三个术语 | Chapter 7 |
| 文本文件的模式规则（读前必须 OPENFILE、同一文件不能重复打开、READ 模式不能写） | 检查器已实现 FILE-001…FILE-004 | Chapter 11 |
| `&` 连接、`DIV`/`MOD` 对负数的行为（Guide 未定义 → 属 Editor Runtime 约定） | Guide §5.2；`runtime-conventions.md` | Chapter 3 |

### 2.4 内置函数必须写死清单（初版 6.2「String functions」过于笼统，有踩坑风险）

Pseudocode Guide 只定义 **7 个**内置函数：

```
RIGHT(ThisString : STRING, x : INTEGER) RETURNS STRING
LENGTH(ThisString : STRING) RETURNS INTEGER
MID(ThisString : STRING, x : INTEGER, y : INTEGER) RETURNS STRING
LCASE(ThisChar : CHAR) RETURNS CHAR
UCASE(ThisChar : CHAR) RETURNS CHAR
INT(x : REAL) RETURNS INTEGER
RAND(x : INTEGER) RETURNS REAL
```

两个必须显式教的坑：

1. **没有 `LEFT`**。很多教材和 IGCSE 材料有，9618 的 2027–2029 Guide 没有。取左边要用 `MID(S, 1, n)`。
2. **`LCASE` / `UCASE` 只接受 `CHAR`，不接受 `STRING`**。`UCASE("abc")` 是错的，要逐字符处理。

本仓库的引擎已经按这个实现（见 `updates.md` 2609090804 条目移除了非 CAIE 的 `LEFT` 与 STRING 参数的 `UCASE`/`LCASE`），教学正文如果写错，学生会直接被编辑器打脸。

考纲 11.1 另有一句：`Content under development`——这句本身值得作为一个教学点告诉学生（考场上不必背，但**本编辑器只实现 Guide 里的 7 个**）。

## 3. A Level 缺五个考纲明确要求的点（需要补）

| 缺失内容 | 考纲依据（原文要点） | 建议位置 |
|---|---|---|
| **Big O / 时间与空间复杂度** | 19.1 `Content under development` | 初版 15.6「Comparing algorithms」扩成完整一节，可能需要两节 |
| **Graph（图）作为 ADT** | 19.1 `Content under development`，并明确 `Content under development` | 进阶 ADT 章，标注为「概念节，不写伪代码」 |
| **Hashing algorithm** | 13.2 `Show understanding of hashing algorithms` / `Content under development` | 进阶文件处理章，这是 random file 的核心，不能只讲 `SEEK`/`GETRECORD`/`PUTRECORD` |
| **OOP 术语补齐** | 20.1 列出 objects, properties/attributes, methods, classes, **inheritance, polymorphism, containment (aggregation), encapsulation, getters, setters, instances**，以及 `Content under development` | 初版 Chapter 19 只有 5 节，需要扩到覆盖 polymorphism、encapsulation、aggregation、getter/setter、类设计 |
| **Exception handling** | 20.2 `Content under development` | 见下，需要特殊处理 |

### 3.1 Exception handling 的特殊问题

**Pseudocode Guide 没有定义任何异常处理语法**（没有 TRY/CATCH/THROW）。考纲 20.2 要求的是「写 program code」，即用学生自己的编程语言（Python / VB / Java）写，不是伪代码。

因此：

- 不能给它出伪代码判题题目，否则要么发明非 CAIE 语法（违反本仓库的权威顺序），要么误导学生。
- **建议**：单开一个「概念节」，讲什么是 exception、什么时候该用、和普通 `IF` 判错的区别，并**明确告诉学生伪代码没有标准写法**。该节标记为「无代码题」。

### 3.2 A Level ADT 算法的粒度要写死

考纲 19.1 对 ADT 算法的要求粒度不对称，大纲里应该直接写死，避免后面出超纲题：

- **find**：linked list、binary tree
- **insert**：stack、queue、linked list、binary tree
- **delete**：stack、queue、linked list（**binary tree 的删除不要求**）
- **实现自其它类型**：stack、queue、linked list、dictionary、binary tree
- **graph**：只描述，不写代码

### 3.3 明确的超范围声明

20.1 还要求 **low-level（含 immediate / direct / indirect / indexed / relative 寻址）** 和 **declarative（facts & rules）** 两种范式。这两块与伪代码编辑器无关，本模块不覆盖，但**必须在教学首页明说**，否则学生会以为学完就覆盖了 Paper 4 的 20.1。同理 13.3 浮点数也不覆盖。

## 4. 一处「描述」与「实现」深度混淆（需要改）

初版 **12.7「Implementing basic ADTs using arrays」放在 AS**。考纲 10.4（AS）的原文是：

- `Content under development`
- `Content under development`

即 AS 只要求**描述**实现方式 + **使用**现成结构，不要求写出实现。真正写实现（`19.1 Content under development`）是 A Level。

**建议**：AS 这一节改名为「用数组实现的原理（描述层）」，题目类型限定为选择题 / 排序题 / 填空题，**不出伪代码写作题**；完整实现放到 A Level 的进阶 ADT 章。

## 5. 一处顺序建议调整（建议改）

初版顺序是 …→ 15 搜索排序 → **16 进阶 ADT** → **17 递归** → 18 文件 → 19 OOP。

问题：16.4 binary tree、16.5 searching a linked list 这两节，最自然、也是考试范文里最常见的写法是**递归**。在递归还没教的时候讲二叉树，只能强行用迭代 + 显式栈，反而更难。

**建议顺序**：自定义类型 → 搜索排序与算法比较 → **递归** → 进阶 ADT → 进阶文件 → OOP → 概念收尾。

（另一种做法是保持顺序但二叉树只讲迭代版，不推荐——和主流教材、考试范文都对不上。）

## 6. 章节粒度严重不均（建议改）

- Chapter 1（4 小节，约 20–30 分钟）vs Chapter 7（8 小节，含 bubble sort，实际 4–6 小时），体量差一个数量级。
- Chapter 5（8 小节）、Chapter 7（8 小节）明显是「超级章」，但按初版设计它们各自只有**一道**章末大题，练习密度严重不足。

**建议**：

1. 大章拆成子章（如 7A 一维数组 / 7B 二维数组 / 7C 线性查找与冒泡排序），每个子章各有自己的章末大题。
2. 每章在大纲里标注：小节数、预计课时、简单题数量、小节伪代码题数量、章末大题数量。
3. 学生端进度按**小节**推进，不按章推进。

---

## 7. 关于教学元素与判题设计的意见

这部分不是大纲问题，但会直接影响后面能不能做出来，列在这里一并评估。

### 7.1 章末大题的「用到本章所有内容」应该是软约束

第 5 类元素要求章末大题「尽量用到本章所有内容」，第 3 类要求「必须用 WHILE、不能用 FOR」这种硬约束。两者放在同一道大题上会打架：学生可能用一种合法但没用到某个知识点的写法，判错会很不合理。

**建议**：硬约束（必须用 / 禁止用）只用在**小节题**；章末大题只做**软约束**——通过检测就算过，另外在反馈里列出「本题建议用到的知识点，你用到了 4/6，没用到的是 CASE 与 BYREF」。

### 7.2 构造约束必须走 AST，不能走正则

「是否用了 `WHILE`」「是否避免了 `REPEAT UNTIL`」必须统计 AST 节点（`WhileStatement` / `ForStatement` / `RepeatStatement`），不能匹配源码文本——注释里的 `// 这里本来想用 FOR` 和字符串里的 `"FOR"` 都会误判。

`packages/language` 已经导出全部 AST 类型，新增一个 `packages/exercise` 包做特征提取是最干净的做法。

### 7.3 期望输出必须由参考解生成，不能手写

每道伪代码题配一份 **reference solution**，测试用例的期望输出用本仓库的运行时跑参考解生成，而不是人手敲。好处有三：

1. 题目和答案不可能不一致；
2. 保证题目在当前引擎上确实跑得通；
3. **题库直接变成引擎的回归语料**——这批题的价值不止在教学侧。

### 7.4 输出比对规则必须复用 `runtime-conventions.md`

大小写、尾随空格、`OUTPUT "You have ", Lives, " lives left"` 的拼接结果、REAL 的显示精度、DATE 的显示格式——判题器**必须复用运行时既有的同一套约定**，不能另立一套，否则学生在编辑器里看到的输出和判题结果会对不上。

建议默认策略：**逐行去尾部空白后严格比较**，题目可声明宽松模式（忽略大小写 / 只比对数字）。

### 7.5 判题分层与失败即停

固定顺序，前一层不过就不进下一层，反馈只讲当前层：

1. **阻断错误**（词法 / 语法 / 类型）→ 不评测，直接给诊断
2. **构造约束**（必须用 / 禁止用）→ 直接说明差在哪
3. **测试用例**（多组输入比对输出）→ 显示第一个失败用例的输入、期望、实际
4. **规范建议**（FMT / CAIE 级）→ **永远只提示，不影响判定**

这与 `CAIE_RULES.md` 的三级诊断（阻断错误 / CAIE 规范 / 建议）天然对应。

### 7.6 选择题每个选项都要有解释

用户已经说明「选择后要讲为什么这个对、其它为什么错」。数据结构上要求**每个选项各带一条 explanation**，而不是只给正确答案一段解释。

另外建议增加一种对伪代码特别有效的变体：**给一段有错的代码，点击出错的那一行**（点击式找错）。它比选择题更接近真实的写代码过程，交互成本仍然只是一次点击。

### 7.7 内容编写顺序要跟着运行时能力走（重要）

当前 `packages/runtime` 处在**阶段 3B**：能真实执行基本类型、内置函数、表达式、声明、赋值、`INPUT`/`OUTPUT`、`IF`/`CASE`、`FOR`/`WHILE`/`REPEAT`、数组、记录。**过程与函数（阶段 3C）尚未接入**，文件、Advanced 特性更靠后。

这意味着：

- 现在就能做完整判题的：**Chapter 1–8**（到记录为止）
- 需要等 3C：**过程、函数**两章
- 需要等文件运行时：**文本文件**章
- 需要等 Advanced 运行时：**A Level 全部**

教学内容的编写顺序应当照此排，先写现在就能判的章节，不要先写出一堆判不了的题。详见 [04-PLAN.md](04-PLAN.md)。
