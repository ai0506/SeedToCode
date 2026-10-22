# Trace table 与调试工作区实施计划

## 1. 定位、范围与考纲依据

本计划只定义实验室 `web/lab.html` 的调试能力及其共享运行时接口；不改变 CAIE 伪代码语法、静态诊断、判题、同步或作业提交语义。

原始 `syllabus-9618.pdf` 的边界如下：

- 第 23 页 §5.2 将典型 IDE 的调试功能列为单步、断点，以及查看变量、表达式和报告窗口。
- 第 31 页 §12.3 将 dry run 列为测试方法之一。
- 第 37 页 §19.2 要求追踪递归算法，并涉及栈和 unwinding。
- PDF 不使用 `trace table` 一词，也不规定表头、行粒度或单元格符号；这些是产品实现决定，不能表述为 Cambridge 的固定格式。

因此，trace table 不是对原「变量」视图的完全替换，而是调试工作区中的历史执行记录；「当前变量状态」必须保留，才能对应 IDE 的变量查看能力。课程中 trace table 仍属于主线完成后追加的 Chapter 24（X1）。实验室能力可先建设，但不得因此提前发布 Chapter 24 正文或题目。

## 2. 产品决策与非目标

### 2.1 目标交互

原结果面板的「变量」标签改为「调试」，内部固定为：

1. **当前状态**：当前调用帧的变量快照；在 `INPUT` 暂停、运行时错误、停止或选中某条 trace 行时显示对应时刻的值。
2. **追踪表**：按语义执行步骤累计的表格；含步骤、源码行、动作/条件、变量列和输出槽。
3. **调用栈**：过程、函数和递归时显示 frame 路径；第一期仅保留现有调用栈展示，后续才细分局部变量。

第一期仅追踪主程序的标量变量、声明、赋值、`INPUT`、选择、三种循环和 `OUTPUT`。数组、记录、文件、过程/函数局部变量、递归、表达式观察、断点和单步分期加入。

### 2.2 非目标

- trace 只保留在本次页面运行的内存中；不写项目、本地存储、同步队列、D1 或作业提交。
- 云端运行先不返回完整 trace，继续只复用输出、错误、最终变量和虚拟文件结果。但**追踪表在这种情况下不得留白**：实验室有独立的「云端运行」入口（`web/js/app.js` 的 `requestCloudRun`），它只回填输出和最终变量。空表看起来和坏掉一模一样，所以云端运行必须在追踪表区域显示明确说明「云端运行不产生追踪记录，点『运行』在本机运行可查看逐步追踪」，「当前状态」照常显示云端返回的最终变量。
- trace 不参与判题，也不显示或推断隐藏测试用例。
- 不以 trace 为名新增 CAIE Guide 之外的语法。

## 3. 表格单元格契约

追踪表记录的是**写入事件**，不是每步的完整状态复制。每个变量格只有下列含义：

| 呈现 | 含义 |
|---|---|
| 空白 | 变量尚未声明，或不在当前作用域。 |
| `未赋值` | 已执行声明，但至今从未成功写入。**这是持续状态，不是只出现在声明那一行**——从声明行起，一直到第一次成功写入之前的每一行都显示 `未赋值`。 |
| `-` | 变量已有值，但本步骤没有写入它；不表示值没有变化。 |
| 具体值，例如 `0` | 本步骤实际写入的结果。 |
| 同值写入态 | 文字仍为 `0`，以背景色和自定义提示说明「重新赋值，值未改变」。 |

`未赋值` 之所以要持续显示而不是只标在声明行：如果声明之后就退回 `-`，那么 `-` 会同时承担「已有值但本步没写」和「至今还没有值」两种含义，读者必须往上扫整列才能区分——而这张表宣称的五种呈现互不混淆。持续显示让 `-` 只剩一种含义，代价只是重复文字，没有歧义代价。

例如：

```text
DECLARE I : INTEGER
DECLARE Total : INTEGER
I ← 0
Total ← 5
I ← 0
```

| 步骤 | 动作 | I | Total |
|---:|---|---|---|
| 1 | `DECLARE I : INTEGER` | 未赋值 | 空白 |
| 2 | `DECLARE Total : INTEGER` | 未赋值 | 未赋值 |
| 3 | `I ← 0` | 0 | 未赋值 |
| 4 | `Total ← 5` | - | 5 |
| 5 | `I ← 0` | 0（同值写入态） | - |

条件和输出各占一行，但不得伪造变量写入：`WHILE I < 3 → FALSE` 与 `OUTPUT Total` 的变量列按上表规则显示 `-` 或 `未赋值`，绝不显示值。循环的最后一次失败条件必须保留。

## 4. 共享运行时设计

### 4.1 独立 trace 接口

既有 `ExecutionEvent` 面向当前行高亮、输出与当前变量刷新，不是 trace 的权威来源：`statement-entered` 和 `condition-checked` 发生在求值前，`variable-changed` 只带写后快照。追踪必须由 `packages/runtime` 在语义动作完成后记录，前端不得从最终变量表猜历史。

在 `packages/runtime/src/types.ts` 增加默认关闭的独立 `TraceSink`，与 `onEvent` 并存：

```ts
type TraceWrite = {
  variableId: string; // 第一阶段为 main:<normalizedName>
  name: string;
  before: TraceValue;
  after: TraceValue;
  sameValue: boolean;
  cause: "assign" | "input" | "for-init" | "for-next" | "byref-write" | "file-read" | "record-read";
  origin?: { frameId: string; name: string }; // 例如过程内 BYREF 参数写入主程序变量
};

type TraceDeclaration = {
  variableId: string;
  name: string;
  value: TraceValue;
};

type TraceRow = {
  step: number; // 学生看到的语义步骤，不复用低层 event sequence
  range: SourceRange;
  frameId: string;
  kind: "declare" | "write" | "condition" | "output" | "call" | "return" | "error";
  label: string;
  writes: TraceWrite[];
  declarations?: TraceDeclaration[];
  condition?: { structure: "IF" | "FOR" | "WHILE" | "REPEAT"; result: boolean };
  output?: string;
  call?: { name: string; kind: "procedure" | "function" };
  error?: { code: string; messageKey: string; args?: Record<string, string | number> };
};

type TraceFinish = {
  status: "completed" | "stopped" | "error";
  rows: number;      // 实际保留的行数
  semanticSteps: number; // 实际发生的语义步骤数，可能大于 rows
  truncated: boolean;
};

type TraceSink = {
  started(plan: TracePlan): void;
  row(row: TraceRow): void;
  truncated(info: { head: number; tailCapacity: number }): void;
  tail(info: { rows: TraceRow[]; skipped: number; stateBefore: TraceColumnState[] }): void;
  finished(info: TraceFinish): void;
};

type ExecutionOptions = {
  // 保留既有字段
  trace?: { sink: TraceSink; maxRows?: number; scope: "main-scalars" };
};
```

`finished()` 必须有，而且必须由运行时调用。当前回调是同步的，但 trace 的截断脚注、错误脚注和「运行结束」状态应只依赖同一条 trace 生命周期，不让页面另以 `result` Promise 猜测追踪流是否结束。`finished()` 在最后一行 `row()` 或 `tail()` 之后、`result` resolve 之前恰好调用一次；`stop()` 和运行时错误路径同样要调用。

`TracePlan` 在运行开始、第一行实际执行前生成。

> **这条已经改了（2026-09-15）。** 原本写的是「列固定，运行途中不得新增列」，那是只追踪主程序标量时才成立的假设。数组的边界要到 `DECLARE` 执行时才知道，过程/函数的局部变量要到调用发生时才存在——两者都不可能在第一行之前列完。现在 `TraceSink` 多一个 `columns(added)`：运行途中新出现的列就地追加到表头，已经画出的行补空白格。补空白不是占位，**空白按 §3 本来就是「尚未声明或不在作用域」，对那些行来说是实话**。
>
> 相应地，`scope` 分两档：`main-scalars` 保持最初上线的行为不变（静态列计划，表头从第一行起就稳定）；`full` 不预建列，所有列按声明顺序动态建出来——未声明就赋值在预检就被 `RT1000` 拒了，所以每个会进表的变量必然走 `DECLARE` / `CONSTANT` / FOR 控制变量三条路之一，按执行顺序建列既不会漏，列序还正好是源码顺序。实验室用 `full`。

`main-scalars` 档的列固定，**列的来源必须明确定义**——只扫 `DECLARE` 是不够的：`interpreter.ts` 在 `ForStatement` 里会给没有 `DECLARE` 过的控制变量隐式建 cell，而 `FOR I ← 1 TO 10` 不写 `DECLARE` 在 CAIE 题目里很常见；若按声明扫描，这类变量就永远没有列。列的收集规则为：

1. 遍历主程序语句（不进入 `PROCEDURE` / `FUNCTION` / `CLASS` 体），按源码出现顺序收集；
2. 收集 `DECLARE` 与 `CONSTANT` 的标量目标；
3. 收集 `ForStatement` 的控制变量，无论是否 `DECLARE` 过；
4. 收集主程序中作为赋值目标或 `INPUT` 目标出现的裸标识符；
5. 同一 `normalizedName` 只占一列，位置取首次出现处。

记录和对象仍不进入列计划。数组与过程/函数局部变量已在 `full` 档实现，见 §4.4。

### 4.2 采集点与语义粒度

在 `packages/runtime/src/interpreter.ts` 新建只有 `options.trace` 启用时才工作的 `TraceCollector`。它仅保存增量 `TraceRow`，不得在每一步复制 `getVariables()` 的完整快照。

| 语义动作 | trace 行 | 规则 |
|---|---|---|
| `DECLARE` | `declare` | 标量变量显示「未赋值」；常量显示声明时值。 |
| `X ← value` | `write` | 写前记录 `before`，写后记录 `after`；即使 `sameValue` 为 true 也必须有一行。 |
| `INPUT X` | `write` | 只有输入通过类型检查并真正写入后记录，`cause: "input"`。 |
| `IF` / `WHILE` / `REPEAT` | `condition` | Boolean 求值后记录实际 TRUE/FALSE，不能沿用当前求值前事件。 |
| `FOR` | `write` + `condition` | 见下面的「FOR 行序」，必须按解释器真实顺序记录。 |
| `OUTPUT` | `output` | 记录实际格式化后的输出，变量列不写入。 |
| `CALL` / 函数调用 | `call` | 第一期必须记录，见下面的「P1 的作用域降级」。 |
| `RETURN` | `return` | 第一期只记一行，不记录返回值写入主程序变量之外的任何内容。 |
| 运行时错误 | `error` | 见 §4.3。 |
| `READFILE` / `GETRECORD` | `write` | 第二期后接入，仍按写前/写后值记录目标。 |

**FOR 行序。** 解释器的真实顺序是：先写入起始值（`interpreter.ts` 的 `controlStorage.value = start` 与随后的 `variable-changed`），再进入循环，**每轮先判条件、条件通过后才把 `candidate` 写回控制变量**，然后执行循环体。所以：

1. 一行 `for-init`，`cause: "for-init"`，给出起始值；
2. 之后每轮一行 `condition`，记录实际 TRUE / FALSE；
3. **第一轮不记 `for-next`**——解释器此时写回的 `candidate` 就等于 `start`，记了就是把内部实现的重复写入暴露给学生；
4. 第二轮起，每轮在该轮 `condition` 为 TRUE 之后记一行 `for-next`。

若控制变量是由 `FOR` 隐式建立，第一期只生成 `for-init`，不再额外生成一条 `declare`；这一步已同时表示变量首次出现和起始值写入。

第 3 条用「第几轮」判断，不用值比较，这样 `FOR I ← 0 TO 0` 之类的边界不依赖数值巧合。

顺序固定为**条件在前、写入在后**，这跟很多人手画 trace table 的习惯（先加再判）是反的，但必须照解释器来：若伪造成先写后判，循环最后那次失败的条件行前面会多出一次**程序中并不存在**的写入，而那正是学生最需要看清的一步。这条要配单测钉死，不能留给实现时随手选。

**P1 的作用域降级。** `scope: "main-scalars"` 只是不为过程/函数的局部变量建立列，不是忽略过程对主程序存储位置的实际写入。BYREF 参数改的就是主程序变量（`CALL Swap(A, B)`）；若整段不记，表里 `A`、`B` 一行不动，后面 `OUTPUT A` 却打出一个表里从未出现过的值——**那不是「功能没做」，那是表在说谎**。

第一期对调用采用下列规则：

- 进入过程/函数时记录 `call` 行，带被调用者名字和调用位置；离开时记录 `return` 行。
- 运行时为每个主程序标量 cell 赋稳定 storage identity。过程内的 BYREF 参数解析到同一 identity；对它的每一次写入都立即产生主程序列的 `write` 行，`cause: "byref-write"`，并在 `origin` 标出过程 frame 与参数名。
- 该规则同样记录 `A ← A`、同一次调用里多次写入 A、以及最后回到调用前值的情况；绝不能只比较调用前后快照，否则会违反「同值写入也显示值」的表格契约。
- BYVAL 参数和过程局部变量没有第一期列；它们的写入不进主程序表。过程内部逐行追踪、局部变量列和完整 frame 表格留到 P4。

这样 P1 的表不会伪称「调用没有写变量」，同时也不需要「可能已被修改」这种不能给出真实结果的临时格态。

`sameValue` 必须由运行时以确定性结构比较得出，前端不得用格式化字符串自行判断；这样 `0`、`FALSE`、空字符串、别名及后续复合值不会混淆。

### 4.3 容量、错误与停止

- 默认最多保留 2,000 行，但**不是保留前 2,000 行**，而是**保留最前 1,500 行 + 最后 500 行**，中间以一条不可点击的省略行标明跳过了多少步。
  理由：`interpreter.ts` 的默认 `maxSteps` 是 100,000，2,000 行大约只是满额运行的 2%。学生最需要看 trace 的场景恰恰是循环跑飞、条件永远为真、递增写错方向——那时有价值的是**最后**几十行（临界状态和最终失败的条件），只保前 2,000 行等于把答案裁掉。保首是为了看清初始化和头几轮，保尾是为了看清它怎么坏的，两头都要。
  实现上前 1,500 行一旦已交给 `sink.row()` 就不再保存；后 500 行以固定长度环形缓冲保存，不得为此保留整段历史。
- 第 1,501 行发生时调用一次 `truncated({ head: 1500, tailCapacity: 500 })`，前端立刻放置「后续步骤将在运行结束后显示」的不可点击占位行；运行继续，但中间行不再调用 `row()`。
- 运行结束、停止或报错时，运行时以 `tail({ rows, skipped, stateBefore })` 交付环形缓冲中的最后行；`stateBefore` 是首条尾部行之前各列的轻量声明/赋值状态，前端以它重放尾部行，不会把被省略区间写入过的变量误画成「未赋值」。前端用它替换占位行，形成按时间排序的「前 1,500 行 → 省略行 → 后 500 行」。随后才调用 `finished()`。这样页面不会保存整段历史，也确实能拿到尾部行。
- 最终说明为「共 N 步，仅显示前 1,500 步与最后 500 步」，N 由 `finished().semanticSteps` 给出；是否截断由 `finished().truncated` 表达，与完成、停止、错误状态正交。
- `maxSteps`、超时和用户停止仍由既有资源限制处理；trace 上限不得改变程序结果。
- 运行时错误前已经产生的行保留，并**追加一行 `kind: "error"`**，复用既有的错误码与 `messageKey`（前端按现有中文错误信息渲染），变量列一律不写入。未完成的动作不得伪造 write：例如 `X ← 1 / 0` 只留错误行，没有 `X` 的写入。随后调用 `finished({ status: "error" })`。
- 用户停止不追加 `error` 行，只调用 `finished({ status: "stopped" })`；已发生的行全部保留。
- trace 值只使用现有安全快照类型，绝不将内部 `Cell`、Map、别名对象或可变引用交给 UI。

### 4.4 `full` 档：数组元素与过程局部变量（2026-09-15 实现）

P1 的 `main-scalars` 在实验室自带的 `BubbleSort.pseudocode` 上退化成了一张没有信息的表：整张表只有 `Index` 一列，120 步里 48 行是光秃秃的 `FOR → TRUE` / `IF → TRUE`，六句 `Numbers[1] ← 42` 一行都没记，最后 `OUTPUT` 打出排好序的结果，而表里从头到尾没有任何值变过。这个样例把 P1 的三条边界全踩了（值在数组里、逻辑在过程里、初始化是下标赋值），是能挑出的最差演示。`full` 档就是为此加的。

**数组。** 主程序和过程里的数组都在 `DECLARE` 执行时展开成一列一个元素（`Numbers[1]` … `Numbers[6]`），元素 cell 建出来时继承列 id。展开是**全有或全无**：剩余列预算装不下整个数组时整体退成一列 `digest`，格子里写「哪个下标被写成了什么」（`B[3] = 7`），而不是把整个数组复制进每一行——后者在 2000 行上是实打实的内存问题。半个数组（有 `C[1]`、`C[2]` 没有 `C[3]`）比不展开更难读，所以不允许。

`DECLARE Numbers : ARRAY[1:6]` 要替六个格子各记一条「未赋值」。否则首次写入前那几行是空白，而空白按 §3 是「尚未声明」——那是假话。

**过程/函数局部变量。** 列 id 按「过程名 + 当前栈上同名帧的层数」算，**不按帧 id 算**：同一个过程顺序调用五次应当复用同一组列（值一行行覆盖下去，这正是 trace table 的读法），只有递归才分出新列（`F.N`、`F#2.N`、`F#3.N`）。按帧 id 建列的话调用五次就是五组列，表会宽得没法看。

**上限。** 列总数默认 64，单个数组展开默认 32 个元素。超出的变量不建列、也不挂追踪 id——**挂了 id 而没有列，写入会记到一个表里不存在的列上，等于悄悄丢掉**。省掉的个数进 `TraceFinish.columnsOmitted`，前端必须说出来。

**一个反复踩的判据错误。** 「该不该给这个 cell 挂追踪 id」的判据是**这一列现在在不在**（`hasColumn`），不是**这次有没有新建**（`addColumns` 的返回值）。同一个过程第二次被调用时列早就有了，`addColumns` 返回空，按「有没有新建」判会把第二次调用的写入整个丢掉——这个 bug 是被「顺序调用三次」那条测试抓出来的，手点一次根本看不出来。

## 5. 前端实施

### 5.1 文件边界

| 位置 | 责任 |
|---|---|
| `packages/runtime/src/types.ts` | trace 类型和 `ExecutionOptions.trace`。 |
| `packages/runtime/src/interpreter.ts` | `TraceCollector`、采集点和容量限制。 |
| `packages/runtime/test/trace.test.ts` | trace 契约单元测试。 |
| `web/lab.html` | 「调试」标签与固定骨架。**顺带改掉 `varsEmpty` 那句空态文案**——它现在写着「运行或单步执行时显示变量、数组与调用栈」，而单步要到 P3 才有，这句话此刻就是不实的。P2 把它改成只描述当时真有的能力。 |
| `web/js/app.js` | 连接 `TraceSink`、维护页面内 trace、渲染表格与源码定位。 |
| `web/css/styles.css` | sticky 表头、表格自身滚动、同值写入态。 |
| `web/js/runtime-engine.js` | 由 `npm run build` 生成，禁止手改。 |

第一期不得修改 `server/`、migration、同步协议或 `packages/exercise`。

### 5.2 渲染规则

- 每次点击「运行」创建新的页面内 `traceRun`；开始下一次运行时整体替换旧表，禁止混合运行记录。
- `TraceSink.started()` 先绘制固定表头；未截断时 `row()` 向表尾追加一行。截断后先显示占位行，`tail()` 在结束时以尾部行替换该占位行；状态脚注（运行中 / 已结束 / 已停止 / 出错 / 已截断）只由 `truncated()`、`tail()` 与 `finished()` 驱动，理由见 §4.1。
- 当前行有 write 时显示 `after`；否则按 §3：变量已有值显示 `-`，已声明但从未写入显示 `未赋值`，尚未声明留空。
- 云端运行（`requestCloudRun`）不产生 trace：追踪表区域显示 §2.2 规定的说明文案，不显示空表，也不显示上一次本地运行留下的表。
- 截断省略行不可点击、不可聚焦，只说明跳过了多少步。
- 同值写入只改变该单元格的背景、颜色和自定义 tooltip，不能用字体粗细、border 宽度或新增文字改变几何尺寸。
- 行高固定；动作过长时单行省略。表头 sticky，追踪表容器自身 `overflow: auto` 且 `scrollbar-gutter: stable`；窄屏不得让 `body` 横向滚动。
- 点击某行只高亮该行与对应代码行，并更新「当前状态」；不得改变编辑器宽度、其它标签或页面布局。

### 5.3 可访问性

- 使用真实 `table`、`thead`、`tbody` 与列标题；状态不能只靠颜色。
- 同值写入格的 `aria-label` 形如「I 写入 0，值未改变」；BYREF 写入格说明来源，例如「A 由 Swap 的 BYREF 参数写入 0」。两者都不能只靠颜色区分。
- 追踪行以可聚焦 button 或行模式实现，支持 Enter/Space；焦点仅使用 outline/box-shadow。
- 不引入原生 `title`、`select`、`checkbox`、`dialog`、`alert`、`confirm` 或 `prompt`。

## 6. 分期

### P0 — 规格与测试先行

冻结本文件第 3–4 节。先建立 `packages/runtime/test/trace.test.ts` 的失败用例，不改页面。

### P1 — 共享运行时标量 trace

实现 `TraceCollector`、`TracePlan`（含 §4.1 的列收集规则）、声明/赋值/输入/条件/输出/调用/返回/错误的语义行、§4.2 的 FOR 行序与 BYREF storage identity 写入、§4.3 的首尾截断、`tail()` 与 `finished()`。完成后 Node 与浏览器 bundle 产生一致 trace，实验室仍可沿用旧变量面板。

### P2 — 实验室调试工作区

把「变量」升级为「调试」，接通当前状态和只读追踪表。首版支持完整运行后的轨迹与 `INPUT` 暂停时的增量轨迹；尚不承诺单步暂停。

### P3 — 单步与断点

在 trace 契约稳定后增加暂停点、下一步、继续和断点。暂停单位是语义 trace 行，不能用 JavaScript yield 或内部事件序号代替。完成后才将该实验室描述为具备考纲所列的单步调试体验。

### P4 — 作用域与复合数据

**数组元素与过程/函数局部变量已于 2026-09-15 交付**（`full` 档，见 §4.4），递归按栈上层数分列也一并做了。

**仍未做**：记录与对象的字段列（`Student.Name`）、文件读取写入目标（`READFILE` / `GETRECORD` 的 `file-read` / `record-read` 两种 cause 已在类型里留好，采集点还没接）、调用栈的分段表头（现在局部变量列只是在表头上带一个 `BubbleSort.` 前缀，不是真的分段）。

### P5 — Chapter 24 教学接入

仅在 Chapter 17–23 正式内容完成后，按 X1 决议追加 Chapter 24。该章用已实现调试工作区讲 dry run、trace、错误类型与测试数据；是否加入学生手填 trace-table 题型另行决定。真到那一步，本文件 §2.2 的「trace 不参与判题」与 `teaching/04-PLAN.md` 里「届时可一并启用 `trace-table` 题型」必须同时改，不能只改一处。

## 7. 验收

### 7.1 运行时单测

1. `DECLARE I` → `I ← 0` → `J ← 5` → `I ← 0`：最后一次仍记录 I write 且 `sameValue: true`。
2. 声明未赋值、变量首次出现、常量、`FALSE`、空字符串和 `0` 的状态不混淆。
3. `INPUT I` 写回相同数值：产生 `cause: "input"` 的同值 write。
4. `IF`、`WHILE`、`REPEAT`、`FOR` 均记录实际 TRUE/FALSE，且保留最终失败条件。
5. `FOR I ← 0 TO 1` 不出现运行时内部实现导致的重复 `I ← 0` 行；行序严格是 `for-init → condition → (体) → condition → for-next → (体) → condition(FALSE)`，最后那次失败条件之前**没有**多余写入。
6. `OUTPUT` 不制造变量 write；错误、停止和截断保留已发生行且不改变执行结果。
7. trace 关闭时，既有事件序列、执行结果和资源限制测试不变。
8. 声明之后、首次写入之前的每一行，该列都是 `未赋值` 而不是 `-`。
9. 列计划包含没有 `DECLARE` 过的 FOR 控制变量，以及只作为赋值目标出现的标量；列顺序是源码首次出现顺序，运行途中不增列。
10. `CALL` 通过 BYREF 改主程序变量：每一次实际写入均产生 `cause: "byref-write"`，含过程内写回同一个值、连续多次写入和最终回到调用前值；BYVAL 调用与过程局部变量不进入主程序列。
11. 运行时错误追加一行 `kind: "error"` 且不伪造 write；`stop()` 不追加 error 行。两条路径都恰好调用一次 `finished()`，且在最后一行 `row()` 之后。
12. 超过上限时保留前 1,500 行与最后 500 行，`truncated()` 只调用一次，`tail()` 在 `finished()` 之前交付时间有序的尾部行；`finished().semanticSteps` 给出真实总步数且大于保留行数。

### 7.2 浏览器验证

1. 完整运行、`INPUT` 暂停、错误、停止和再次运行不混合记录；云端运行显示说明文案而不是空表或上一次的表。
2. 逐项核对 `空白 / 未赋值 / - / 值 / 同值写入 / BYREF 写入来源` 的视觉与无障碍文案。
3. 点击追踪行只改变该行与代码高亮；以 `getBoundingClientRect` 验证结果面板其它区域不移动。
4. 1440px、720px、375px 下表格只在自身容器滚动，`body` 无横向滚动，sticky 表头可用。
5. 浅色、深色、键盘焦点和自定义 tooltip 可用，浏览器控制台无错误。

### 7.3 命令门槛

```bash
npm run check
npm run build
npm test
git diff --check
```

改动 `web/` 后，还必须按 `FRONTEND_RULES.md` 完成真实浏览器几何快照检查。只有 `npm run build` 生成的 `web/js/runtime-engine.js` 才能与源码一起提交。

**提缓存版本号，而且要在所有页面一起提。** 本计划会改到两个多页共用的文件：`web/css/styles.css` 目前在 10 个页面上都挂着同一个 `?v=`，`web/js/runtime-engine.js` 在 6 个页面上都挂着同一个 `?v=`。只提 `lab.html` 一处，其余页面会继续吃旧缓存，而且各页版本号一旦分叉就很难发现。改完逐个核一遍，确认每个文件只有一个版本号：

```bash
rg -n "styles.css\\?v=|runtime-engine.js\\?v=|app.js\\?v=" web/*.html
```

## 8. 完成定义

P2 的最低完成标准是：实验室同时显示当前变量状态和一轮可复核的主程序 trace；表格严格遵守 `空白 / 未赋值 / - / 值 / 同值写入` 契约；含 BYREF `CALL` 的程序保留每一次真实写入，不会出现「表里没动、输出却变了」；首尾截断仍能显示时间有序的尾部步骤；运行时测试证明 trace 不改变程序结果；浏览器检查证明调试表没有造成布局跳动或页面横向滚动。

P3、P4、P5 均为独立后续交付，不能写成 P2 已具备的能力。
