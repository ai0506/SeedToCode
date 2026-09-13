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
- 云端运行先不返回完整 trace，继续只复用输出、错误、最终变量和虚拟文件结果。
- trace 不参与判题，也不显示或推断隐藏测试用例。
- 不以 trace 为名新增 CAIE Guide 之外的语法。

## 3. 表格单元格契约

追踪表记录的是**写入事件**，不是每步的完整状态复制。每个变量格只有下列含义：

| 呈现 | 含义 |
|---|---|
| 空白 | 变量尚未声明，或不在当前作用域。 |
| `未赋值` | 已执行声明，但从未成功写入。 |
| `-` | 变量已存在，但本步骤没有写入它；不表示值没有变化。 |
| 具体值，例如 `0` | 本步骤实际写入的结果。 |
| 同值写入态 | 文字仍为 `0`，以背景色和自定义提示说明「重新赋值，值未改变」。 |

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
| 2 | `DECLARE Total : INTEGER` | - | 未赋值 |
| 3 | `I ← 0` | 0 | - |
| 4 | `Total ← 5` | - | 5 |
| 5 | `I ← 0` | 0（同值写入态） | - |

条件和输出各占一行，但不得伪造变量写入：`WHILE I < 3 → FALSE` 与 `OUTPUT Total` 的变量列均显示 `-`。循环的最后一次失败条件必须保留。

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
  cause: "assign" | "input" | "for-init" | "for-next" | "file-read" | "record-read";
};

type TraceRow = {
  step: number; // 学生看到的语义步骤，不复用低层 event sequence
  range: SourceRange;
  frameId: string;
  kind: "declare" | "write" | "condition" | "output" | "call" | "return";
  label: string;
  writes: TraceWrite[];
  condition?: { structure: "IF" | "FOR" | "WHILE" | "REPEAT"; result: boolean };
  output?: string;
};

type TraceSink = {
  started(plan: TracePlan): void;
  row(row: TraceRow): void;
  truncated(limit: number): void;
};

type ExecutionOptions = {
  // 保留既有字段
  trace?: { sink: TraceSink; maxRows?: number; scope: "main-scalars" };
};
```

`TracePlan` 在运行开始、第一行实际执行前生成，列按主程序变量的源码首次声明顺序固定。运行途中不得新增列；数组、记录和局部变量在第一期不进入列计划。

### 4.2 采集点与语义粒度

在 `packages/runtime/src/interpreter.ts` 新建只有 `options.trace` 启用时才工作的 `TraceCollector`。它仅保存增量 `TraceRow`，不得在每一步复制 `getVariables()` 的完整快照。

| 语义动作 | trace 行 | 规则 |
|---|---|---|
| `DECLARE` | `declare` | 标量变量显示「未赋值」；常量显示声明时值。 |
| `X ← value` | `write` | 写前记录 `before`，写后记录 `after`；即使 `sameValue` 为 true 也必须有一行。 |
| `INPUT X` | `write` | 只有输入通过类型检查并真正写入后记录，`cause: "input"`。 |
| `IF` / `WHILE` / `REPEAT` | `condition` | Boolean 求值后记录实际 TRUE/FALSE，不能沿用当前求值前事件。 |
| `FOR` | `write` + `condition` | 规范为一次 `for-init`、每轮一次条件判断、进入下一轮一次 `for-next`；不能暴露解释器内部重复初始化。 |
| `OUTPUT` | `output` | 记录实际格式化后的输出，变量列不写入。 |
| `READFILE` / `GETRECORD` | `write` | 第二期后接入，仍按写前/写后值记录目标。 |

`sameValue` 必须由运行时以确定性结构比较得出，前端不得用格式化字符串自行判断；这样 `0`、`FALSE`、空字符串、别名及后续复合值不会混淆。

### 4.3 容量、错误与停止

- 默认最多记录 2,000 行；达到上限后仅调用一次 `truncated()`，程序继续执行，表中常驻说明「仅保留前 2,000 步」。
- `maxSteps`、超时和用户停止仍由既有资源限制处理；trace 上限不得改变程序结果。
- 运行时错误前已经产生的行保留；错误行复用既有中文错误信息，未完成动作不得伪造 write。
- trace 值只使用现有安全快照类型，绝不将内部 `Cell`、Map、别名对象或可变引用交给 UI。

## 5. 前端实施

### 5.1 文件边界

| 位置 | 责任 |
|---|---|
| `packages/runtime/src/types.ts` | trace 类型和 `ExecutionOptions.trace`。 |
| `packages/runtime/src/interpreter.ts` | `TraceCollector`、采集点和容量限制。 |
| `packages/runtime/test/trace.test.ts` | trace 契约单元测试。 |
| `web/lab.html` | 「调试」标签与固定骨架。 |
| `web/js/app.js` | 连接 `TraceSink`、维护页面内 trace、渲染表格与源码定位。 |
| `web/css/styles.css` | sticky 表头、表格自身滚动、同值写入态。 |
| `web/js/runtime-engine.js` | 由 `npm run build` 生成，禁止手改。 |

第一期不得修改 `server/`、migration、同步协议或 `packages/exercise`。

### 5.2 渲染规则

- 每次点击「运行」创建新的页面内 `traceRun`；开始下一次运行时整体替换旧表，禁止混合运行记录。
- `TraceSink.started()` 先绘制固定表头；`row()` 只向表尾追加一行。
- 当前行有 write 时显示 `after`；否则变量已声明显示 `-`；尚未声明留空。
- 同值写入只改变该单元格的背景、颜色和自定义 tooltip，不能用字体粗细、border 宽度或新增文字改变几何尺寸。
- 行高固定；动作过长时单行省略。表头 sticky，追踪表容器自身 `overflow: auto` 且 `scrollbar-gutter: stable`；窄屏不得让 `body` 横向滚动。
- 点击某行只高亮该行与对应代码行，并更新「当前状态」；不得改变编辑器宽度、其它标签或页面布局。

### 5.3 可访问性

- 使用真实 `table`、`thead`、`tbody` 与列标题；状态不能只靠颜色。
- 同值写入格的 `aria-label` 形如「I 写入 0，值未改变」。
- 追踪行以可聚焦 button 或行模式实现，支持 Enter/Space；焦点仅使用 outline/box-shadow。
- 不引入原生 `title`、`select`、`checkbox`、`dialog`、`alert`、`confirm` 或 `prompt`。

## 6. 分期

### P0 — 规格与测试先行

冻结本文件第 3–4 节。先建立 `packages/runtime/test/trace.test.ts` 的失败用例，不改页面。

### P1 — 共享运行时标量 trace

实现 `TraceCollector`、`TracePlan`、声明/赋值/输入/条件/输出的语义行与 2,000 行上限。完成后 Node 与浏览器 bundle 产生一致 trace，实验室仍可沿用旧变量面板。

### P2 — 实验室调试工作区

把「变量」升级为「调试」，接通当前状态和只读追踪表。首版支持完整运行后的轨迹与 `INPUT` 暂停时的增量轨迹；尚不承诺单步暂停。

### P3 — 单步与断点

在 trace 契约稳定后增加暂停点、下一步、继续和断点。暂停单位是语义 trace 行，不能用 JavaScript yield 或内部事件序号代替。完成后才将该实验室描述为具备考纲所列的单步调试体验。

### P4 — 作用域与复合数据

加入过程/函数 frame 段、递归调用栈和 BYREF 别名说明；数组与记录按 `Scores[3]`、`Student.Name` 记录增量写入，不复制整个复合值。同名局部变量必须与主程序变量分列。

### P5 — Chapter 24 教学接入

仅在 Chapter 17–23 正式内容完成后，按 X1 决议追加 Chapter 24。该章用已实现调试工作区讲 dry run、trace、错误类型与测试数据；是否加入学生手填 trace-table 题型另行决定。

## 7. 验收

### 7.1 运行时单测

1. `DECLARE I` → `I ← 0` → `J ← 5` → `I ← 0`：最后一次仍记录 I write 且 `sameValue: true`。
2. 声明未赋值、变量首次出现、常量、`FALSE`、空字符串和 `0` 的状态不混淆。
3. `INPUT I` 写回相同数值：产生 `cause: "input"` 的同值 write。
4. `IF`、`WHILE`、`REPEAT`、`FOR` 均记录实际 TRUE/FALSE，且保留最终失败条件。
5. `FOR I ← 0 TO 1` 不出现运行时内部实现导致的重复 `I ← 0` 行。
6. `OUTPUT` 不制造变量 write；错误、停止和截断保留已发生行且不改变执行结果。
7. trace 关闭时，既有事件序列、执行结果和资源限制测试不变。

### 7.2 浏览器验证

1. 完整运行、`INPUT` 暂停、错误、停止和再次运行不混合记录。
2. 逐项核对 `空白 / 未赋值 / - / 同值写入 0` 的视觉与无障碍文案。
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

## 8. 完成定义

P2 的最低完成标准是：实验室同时显示当前变量状态和一轮可复核的主程序 trace；表格严格遵守 `空白 / 未赋值 / - / 值 / 同值写入` 契约；运行时测试证明 trace 不改变程序结果；浏览器检查证明调试表没有造成布局跳动或页面横向滚动。

P3、P4、P5 均为独立后续交付，不能写成 P2 已具备的能力。
