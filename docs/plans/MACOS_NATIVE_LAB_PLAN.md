# macOS 原生实验室（SwiftUI）计划与接口契约

**决定（使用者，2026-10-09）**：macOS App 的**实验室**改用 SwiftUI + 原生编辑器重写；课程、做题、作业、老师面板、登录仍用网页（同一个 App 里的 WKWebView）。项目/文件/存储/同步/云端运行的**数据逻辑不重写**，继续用网页那一份 JS，在后台跑。分工：界面与编辑器由 Claude Code 做；后台 JS 抽离、宿主与桥接由 Codex 做。

本文是两边对齐的唯一依据。接口有变化先改这里，再改代码。前置文档：[`MACOS_APP_PLAN.md`](MACOS_APP_PLAN.md)、[`MACOS_PHASE_A_RECORD.md`](MACOS_PHASE_A_RECORD.md)、[`MACOS_CLOUD_TRANSPORT.md`](MACOS_CLOUD_TRANSPORT.md)。

## 1. 为什么这样分

- 网页实验室的数据规则（多项目注册表、课文项目、出厂样例识别、运行时文件恢复 slot、同步适配器、冲突副本、hold、云端运行快照）全部写在 `web/js/app.js` 里，和 DOM 混在一起，约 1000 行。用 Swift 再写一份，两份规则迟早分叉，而 App 那一份没人天天在浏览器里点——仓库已经吃过几次「副本悄悄分叉」的亏。
- 所以把这部分抽成一个**不碰 DOM 的模块**（`web/js/lab-model.js`），网页的 `app.js` 和 App 的后台宿主**用同一份**。这正好是 [`LAB_MAINTAINABILITY_ROADMAP.md`](LAB_MAINTAINABILITY_ROADMAP.md) P2 说的「有新功能需要时沿项目/文件控制边界抽离」。
- 实测唯一的性能问题在编辑器：2000 行文档每打一字同步处理 27ms（[`MACOS_PHASE_A_RECORD.md`](MACOS_PHASE_A_RECORD.md) §3.4）。原生编辑器在 Swift 里直接做高亮和缩进，不经过 JS，才能解决它。

## 2. 结构

```text
SwiftUI 实验室窗口
  ├─ LabView（侧栏 / 编辑器 / 结果面板 / 状态栏 / 工具栏）        ← Claude
  ├─ CodeEditor（NSTextView，TextKit 2）：高亮、行号、缩进、← 转换、查找、
  │             诊断与运行行标记、输入法                           ← Claude
  └─ LabCore（Swift 协议，§4）
        └─ CoreHost：隐藏的 WKWebView，载入 seedtocode://app/core-host.html   ← Codex
              ├─ storage.js / auth-store / cloud-client / sync-queue / sync-engine（原样）
              ├─ language-engine + language-adapter、runtime-engine（原样）
              ├─ lab-model.js（从 app.js 抽出，网页与 App 共用）            ← Codex
              └─ core-host.js：把 LabCore 的命令/事件翻译成 lab-model 调用  ← Codex

网页页面（课程、做题、作业、老师、登录）：沿用现有 WKWebView + seedtocode:// + 原生云端传输
```

- CoreHost 和网页页面在**同一个来源** `seedtocode://app`，localStorage / IndexedDB 是同一份：从网页版实验室换到原生实验室，项目原样都在；课程页和原生实验室互相看得到对方写的数据（例如课文项目）。
- 同一时刻只能有**一个**实验室写入者：原生实验室打开时，App 里不再打开网页版 `lab.html`（导航到 `lab.html` 改为切到原生窗口）。网页课程页写的是教学数据，不写项目注册表——Codex 在 C1 中核实这一点，若课程页也写项目（课文文件），必须在契约里写清楚串行规则。

## 3. 功能对照表（验收以此为准）

「首版」= 原生实验室第一个可交付版本必须有；「后续」= 可以晚一点，但不能删。

| 区域 | 网页现有功能 | 原生实现 | 版本 |
|---|---|---|---|
| 项目 | 切换、新建、改名、删除；课文项目只读名、不可删；项目选择器 | 侧栏顶部项目菜单 | 首版 |
| 代码文件 | 列表、新建、改名、删除（带撤销）、打开、归档的课文文件开关；同名判定（.pseudocode 与 .txt 视为同名） | 侧栏列表 + 右键菜单 | 首版 |
| 导入导出 | 选择文件导入、拖入导入（代码/运行时文件二选一）、全部导出 | NSOpenPanel / 拖放 / NSSavePanel（计划阶段 C 的原生文件能力在这里落地） | 首版 |
| 编辑器 | 行号、当前行、语法着色、三空格缩进与 Tab/Shift+Tab 停靠、回车延续缩进与块配对（OPENERS）、`<-` → `←`（字符串和注释内不转）、自动配对、撤销栈、输入法 | NSTextView 原生 | 首版 |
| 查找替换 | 查找、上一个/下一个、计数、替换 | NSTextView 查找栏或自绘，需中文与 ← 正确 | 首版 |
| 结构模板 | 插入 IF/FOR/… 模板 | 菜单 + 弹出列表 | 首版 |
| 诊断 | 语法检测开关、问题面板、跳转、快速修复、行内标记、阻断错误拦截运行 | 由 LabCore.lint 提供数据 | 首版 |
| 格式化 | formatSource | LabCore.format | 首版 |
| 运行 | 运行/停止、INPUT 输入框与校验、输出、运行行高亮、状态行 | LabCore.run 事件流 | 首版 |
| 调试 | 变量表（含调用栈）、文件句柄 | 事件流 | 首版 |
| Trace table | 表头分组、追加列、截断提示、列省略提示、放大到独立窗口 | 事件流 + 原生表格 | 首版 |
| 运行时文件 | 列表、预览、编辑（文本/记录）、单次恢复（slot） | LabCore.runtimeFiles | 首版 |
| 设置 | 主题（浅/深）、字号 12–20、行号、← 转换、自动缩进、自动配对、运行档位（core/advanced） | 设置面板 + 系统菜单 | 首版 |
| 账户 | 登录入口（打开网页登录页）、账户面板：同步状态、立即同步、退出、hold 并入/不并入、作业概览 | 原生弹出面板；登录走网页 | 首版 |
| 云端运行 | 「更多」菜单里的云端运行、hold 时禁用并说明 | LabCore.cloudRun | 后续 |
| 拖放提示、toast、确认框 | 应用内组件，不用浏览器原生对话框 | SwiftUI sheet / 自绘提示 | 首版 |
| 外观 | 配色、字体、间距与网页一致；一次交互只改被操作对象（FRONTEND_RULES 第 1 条） | SwiftUI 复刻 `css/styles.css` 变量 | 首版 |

## 4. 接口契约：LabCore

Swift 侧是一个协议；CoreHost 用消息实现它。**界面只依赖协议**，所以 Claude 可以先用一份内存实现（`PreviewLabCore`）做界面，Codex 的 CoreHost 好了直接替换。

### 4.1 消息

- 原生 → JS：`window.SeedToCodeCore.dispatch({ id, command, args })`，返回 Promise，结果 `{ id, ok: true, value }` 或 `{ id, ok: false, error: { code, message } }`。
- JS → 原生：`webkit.messageHandlers.seedtocodeCore.postMessage({ event, payload })`，只用于推送事件。处理器只认主框架、来源 `seedtocode://app/core-host.html`（同 CloudBridge 的校验方式）。
- 所有值是 JSON。协议版本 `protocol: 1`，`core-host.js` 启动后发 `{ event: "ready", payload: { protocol: 1, modelVersion } }`。

### 4.2 状态快照（事件 `state`）

lab-model 每次状态变化（含同步拉下来的变化）后发一次完整快照，界面整份替换，不做增量合并（量很小：只有元数据，没有源码全文）：

```ts
type LabState = {
  projects: { id: string; name: string; lesson: boolean }[];
  currentProjectId: string;
  docs: { id: string; name: string; lesson: boolean; archived: boolean; revision: number }[];
  activeDocId: string | null;
  runtimeFiles: { id: string; name: string; kind: "text" | "records"; size: number; restorable: boolean }[];
  settings: { theme: "light" | "dark"; fontSize: number; lineNumbers: boolean; arrowConvert: boolean;
              autoIndent: boolean; autoPair: boolean; lint: boolean; runtimeProfile: "core-2027" | "advanced-2027";
              showArchivedLessons: boolean };
  saveState: "saved" | "saving";
  account: { configured: boolean; signedIn: boolean; user: { role: string; email?: string; username?: string } | null;
             sync: { state: string; pending: number; blocked: number; lastError: string | null };
             hold: null | { fromGuest: boolean; asked: boolean; projects: number; progress: number; drafts: number } };
};
```

`revision` 是该文档源码在 lab-model 里的本地版本号，每次源码被**任何一方**改动（编辑器、同步拉取、冲突处理、导入）加 1。

### 4.3 源码

源码不放在快照里（大）。

- `doc.source({ docId }) → { text, revision }`
- `doc.setSource({ docId, text, baseRevision }) → { revision }`：编辑器以防抖（300ms）送整份文本。`baseRevision` 不等于当前值时返回 `error.code = "STALE"` 和当前 `{ text, revision }`——说明同步在这期间改过这份文档，界面要按冲突处理（保留编辑器内容另存为副本，或提示），**不能静默覆盖**。
- 事件 `docChanged { docId, revision }`：源码被编辑器以外的来源改了（同步、冲突副本、导入），界面重新取一次。

### 4.4 命令一览

| 命令 | 参数 → 返回 | 说明 |
|---|---|---|
| `project.switch` | `{ projectId }` | |
| `project.create` | `{ name }` → `{ projectId }` | 名字校验与网页一致，失败返回 `INVALID_NAME` + 原文案 |
| `project.rename` | `{ projectId, name }` | 课文项目返回 `READ_ONLY` |
| `project.delete` | `{ projectId }` | 由界面先确认 |
| `doc.open` | `{ docId }` | 只改 activeDocId |
| `doc.create` | `{ name }` → `{ docId }` | 同名返回 `NAME_TAKEN` + 原文案 |
| `doc.rename` | `{ docId, name }` | |
| `doc.delete` | `{ docId }` → `{ undoToken }` | |
| `doc.undoDelete` | `{ undoToken }` | |
| `doc.import` | `{ files: [{ name, text }], target: "code" \| "runtime" }` → `{ imported, skipped: [{ name, reason }] }` | 读文件由原生做，JS 只收文本 |
| `project.exportAll` | `{}` → `{ files: [{ name, text }] }` | 写盘由原生做 |
| `settings.set` | `{ key, value }` | |
| `lint` | `{ source, profile }` → `{ diagnostics: [{ start, end, line, column, severity, code, message, blocking, fixes: [{ title, edits: [{ start, end, text }] }] }] }` | `start`/`end` 是 **UTF-16 偏移**（NSString 与 JS 一致），`line`/`column` 只给显示用；`severity` 取 `error \| caie \| hint`，`message` 已是中文 |
| `format` | `{ source }` → `{ text }` | |
| `snippets` | `{}` → `{ items: [{ id, label, text, caretOffset }] }` | 来自 caie-spec.js |
| `run.start` | `{ docId, profile, trace: boolean }` → `{ runId }` 或 `{ preflight: diagnostics }` | 用 lab-model 里**已保存**的源码；界面先 flush 编辑器 |
| `run.input` | `{ runId, value }` → `{ accepted, message? }` | message 已是中文 |
| `run.stop` | `{ runId }` | |
| `runtimeFile.read` | `{ fileId }` → `{ kind, lines? , records? }` | |
| `runtimeFile.write` | `{ fileId, kind, lines?, records? }` | |
| `runtimeFile.restore` | `{ fileId }` | |
| `account.adopt` / `account.keepOut` / `account.adoptProjects` / `account.syncNow` / `account.logout` | `{}` | 对应 account-ui 的 ACTIONS |
| `cloudRun.start` | `{ docId, inputs: string[] }` → 结果同 run 的 `finished` | 后续 |

### 4.5 运行事件（JS → 原生）

一次运行的全部事件带 `runId` 和递增 `seq`；界面丢弃不属于当前 runId 的事件。输出与 trace 行**批量**发（每 50ms 或每 200 条一批），否则长循环会把消息通道打满。

| 事件 | payload |
|---|---|
| `run.output` | `{ runId, seq, lines: string[] }` |
| `run.line` | `{ runId, seq, line }`（只发最新一条，节流到每帧一次） |
| `run.inputRequested` | `{ runId, seq, variable, type, suggest? }` |
| `run.variables` | `{ runId, seq, variables: [{ name, kind, type, value }], stack: string[] }`（节流；`kind` 已是中文，同 app.js renderRuntimeVariables） |
| `run.handles` | `{ runId, seq, handles: [{ name, mode, position }] }` |
| `run.inputRejected` | `{ runId, seq, message }` |
| `run.trace` | `{ runId, seq, columns, rows, status? }` |
| `run.finished` | `{ runId, seq, status, statusText, errorLine?, errorMessage? }`（`statusText` 是与网页 runStatus 相同的中文状态行） |

文案（运行错误、输入被拒原因）由 JS 侧用 `runtime-messages.js` 翻成中文再发，原生不维护第二份文案表。

**追踪表发的是显示形态，不是运行时原始 TraceRow。** 网页 `app.js` 的 `makeTraceRow` 带状态地推算每一格：本行声明/写入的显示新值，已声明未写的显示 `-` 或「未赋值」，同值写入、BYREF 写入另有标记和说明，截断后还要按 `stateBefore` 重放尾部。这段推算随 C1 一起挪进 lab-model（网页和 core-host 共用），`run.trace` 发出的是它的结果：

```ts
columns: { variableId, name, scopeLabel? }[]          // 每次带完整列表：运行途中会增列
rows: { step, line, action, output, cells: { text, style: "none"|"unassigned"|"same"|"byref"|"same-byref", note? }[], omittedText? }[]
status?: string                                        // 与网页 traceStatus 相同的中文
```

`cells` 与 `columns` 一一对应；增列之前已经发出的行，界面在末尾补空白格（与网页一致）。`omittedText` 有值的是「后续步骤将在运行结束后显示 / 已省略 N 步」那一行。

## 5. 分工与任务

### Codex（后台）

**C1 抽出 `web/js/lab-model.js`**
- 从 `web/js/app.js` 搬出不碰 DOM 的部分：状态与持久化（load / persist / flushStateIntoProjects / persistProjects）、项目与课文项目、文档增删改与同名规则、运行时文件与恢复 slot、SyncEngine 项目适配器（cloudCollect / cloudApply* / 冲突副本 / isPristineProject）、云端运行快照，以及追踪表的显示推算（`makeTraceRow` 里不碰 DOM 的那部分：每格文本、样式、说明，截断与尾部重放），见 §4.5。对外是一个对象 + 订阅函数，满足 §4.2–4.4 的语义。
- `app.js` 改为调用它，**网页实验室行为不变**。必须在真浏览器里走一遍：项目切换后保存并运行、新建/改名/删除/撤销、导入、登录后同步与冲突副本（`.claude/launch.json` 的 `seedtocode-dev` + 本机测试身份）。
- 版本号：`app.js` 和新文件所有引用页现查现提（见根目录 `CLAUDE.md`「缓存版本号」）。
- 加 vitest：直接读 `web/js/samples.js` 的出厂样例做 lab-model 的单测，不手抄样例。

**C2 `web/core-host.html` + `web/js/core-host.js`**
- 无界面页面，按 §4 实现命令与事件。运行走 `CAIERuntime.executeSource`，事件按 §4.5 批量与节流。
- 不加入网站导航；`scripts/build-app.sh` 打包时包含它。

**C3 Swift `CoreHost`（`native/macos/Sources/SeedToCodeKit` 或 App target）**
- 隐藏 WKWebView 载入 `core-host.html`，复用现有 `AppSchemeHandler`、`CloudBridge`、钥匙串传输。
- 实现 Swift `LabCore` 协议（Claude 在 `native/macos/Sources/SeedToCodeProto/Lab/LabCore.swift` 先写好协议与 `PreviewLabCore`），命令为 async 方法，事件为 `AsyncStream`。
- WebContent 进程退出：重载 core-host，重新发 `ready` 与完整 `state`；进行中的运行以 `run.finished { status: "stopped", error: "宿主重启" }` 结束。
- XCTest：用真实打包的 web 资源起 CoreHost，跑 Main（两次 INPUT）、BubbleSort（trace 有数组列）、FileCopy（运行时文件被写）三份出厂样例，结果与 `npm test` 里的期望一致。

### Claude Code（界面）

- **F1 原生编辑器** `CodeEditor`：NSTextView（TextKit 2）包进 SwiftUI。高亮规则移植 `web/js/lang.js`，缩进/块配对移植 `app.js` 的 OPENERS 与 `code-input.js` 的约定；输入法期间不打断合成。目标：2000 行文档打字 p95 < 8ms（同一套量具）。
- **F2 实验室窗口** `LabView`：侧栏、工具栏、结果面板（输出/问题/调试/文件/Trace）、状态栏，对着 `PreviewLabCore` 做。
- **F3 对话框、菜单、快捷键、设置、账户面板**。
- **F4 接 CoreHost**：C3 完成后换掉 PreviewLabCore，做端到端验收（§6）。

顺序：F1 不依赖任何后台，先做；C1→C2→C3 与 F1/F2 并行；F4 在 C3 之后。

## 6. 验收

- `npm test`、`swift test` 全绿。
- 用默认 `Main.pseudocode` 和 `samples.js` 全部出厂样例在原生实验室里跑：输出、INPUT、停止、错误、trace（BubbleSort 必须有数组列在变）、运行时文件。
- 网页实验室行为不变（C1 的浏览器回归）。
- 原生与网页交叉：同一 App 里原生实验室改的项目，在课程页、在另一台设备的网页版都看得到；反之亦然。
- 性能：2000 行文档打字、滚动、运行中 UI，与 [`MACOS_PHASE_A_RECORD.md`](MACOS_PHASE_A_RECORD.md) §3.4 同口径对比，结果写进记录。
- 外观：与网页并排截图，配色、字体、间距一致；一次交互只改被操作对象。
- 输入法（中文拼音）在编辑器里手测：合成串可见、确认后撤销一次能撤掉整段。

## 7. 进度记录

### F1 原生编辑器（2026-10-09，Claude Code）

**已完成**：`SeedToCodeKit/Editor`（规范读取、分词、输入约定）与 `SeedToCodeProto/Lab`（NSTextView 编辑器、行号栏、SwiftUI 包装、试用窗口）。关键字表、模板、出厂样例、两套配色由 `scripts/export-web-spec.mjs` 在打包时从网页源文件导出，Swift 侧没有副本。

**验证**：
- `swift test` 中的高亮对照：3 份出厂样例的每一行加 13 行边界（中文紧贴关键字、未闭合字符串、`<-`/`←`、小写关键字等），Swift 分词与网页 `lang.js` 现跑的结果逐 token 一致。
- 输入约定单测：回车补结尾（含 NEXT 变量名、已有结尾不重复——判据与 app.js 相同，只看紧接的下一行）、Tab/Shift+Tab 停靠点、缩进区退格、成对符号的补全/包裹/跳过/字面量内不补、`<-` 转换、粘贴规范化、模板光标。
- `--task editor-check`（真实 NSTextView，经动作方法输入）13/13：着色属性、回车补 ENDIF、`<-`→`←` 且新字符被着色、引号不多出、退格、**输入法合成串在文本里可见、确认后变汉字**、**全部操作可一路撤销回原文**、多行缩进还原、行号查找。
- `--task editor-perf`（2002 行文档，3 次）：每字处理 p95 0.4ms（网页同口径 27ms）；处理 + 当场整块重画编辑器与行号栏可见区 p95 3.2–3.3ms（上限，100 字触发 200 次真实 draw）；滚动每步 p95 3.6ms；载入并首绘约 80ms。

**量具踩过的坑**：前两版用 `displayIfNeeded()` / `display()` 量「含绘制」，结果和不含绘制一样。插桩后发现测量期间 `draw(_:)` 一次都没被调用——图层视图把绘制推迟到事件循环末尾。改用 `cacheDisplay` 同步绘制并核对绘制次数，数字才可信。

**更正（F2 时发现）**：F1 当时的外观截图是用 `cacheDisplay` 离屏绘制截的，**屏幕上实际一个字都不显示**——行号栏（NSRulerView）在 macOS 14+ 默认不裁剪，铺底色时盖住了整块编辑区，离屏绘制不走那条路所以看不出来。F2 改为只用真实屏幕截图（`scripts/shot.sh`）验收后才发现，已在 `LineNumberRuler` 设 `clipsToBounds = true` 修复。上面的行为检查和性能数字不受影响（前者查的是文本与属性，后者确认了 draw 真实发生），但「外观与网页一致」那句在 F1 时并未被证实。

**还没做**：诊断数据要等 LabCore.lint（F4 接 CoreHost 后才有真数据，现在只有绘制通路）；查找用的是系统查找栏，外观与网页的浮动查找条不同；深色主题、字号切换只在试用窗口里点过，没有截图逐项对照；真实键盘下的中文输入法需要手测（自动检查模拟的是 setMarkedText 路径）。

### F2 实验室窗口（2026-10-09，Claude Code）

**已完成**：`Lab/LabCore.swift`（§4 契约的 Swift 形态）、`PreviewLabCore`（内存假数据，界面上明标「预览」，CoreHost 接上后删除）、`LabModel`（编辑器防抖保存、`STALE` 时另存「本机副本」而不覆盖、语法检测防抖、运行事件、输入、撤销删除提示条）、`LabView` / `ResultsPanel` / `LabStyle`：顶栏、侧栏（项目菜单、文件列表、新建/改名/删除/撤销）、编辑区、结果面板四个标签（输出与 INPUT、问题与过滤/跳转/快速修复、变量/调用栈/追踪表及放大、运行时文件与 handle）、状态栏。尺寸与配色按 styles.css；选中态只改颜色与底色，不用加粗（网页 `.tab.active` 用 font-weight 是 FRONTEND_RULES 记录的违规，这里不照搬）。

**契约补充**：`lint` 返回 UTF-16 偏移 `start`/`end`；追踪表改为后台发「显示形态」（每格文本/样式/说明），`makeTraceRow` 的推算随 C1 进 lab-model，两端不各算一份。

**修掉的问题**：
- SwiftUI 环境值用可选值强制解包，宿主写环境前先读一次即崩溃 → 改为品红兜底调色板。
- 保存成功后改了编辑器的文档标识，会让编辑器整份重载、撤销栈与光标全丢 → 标识只在内容「从外面换进来」时变。格式化与快速修复改走编辑器的修改通道，可撤销。
- 行号栏遮住编辑区（见上方更正）。
- 双向滚动的追踪表行少时沉到面板中部 → 贴左上。

**验证**：真实屏幕截图（`scripts/shot.sh`）看过：初始、语法检测开 + 预览运行后的调试页（变量、调用栈、追踪表含同值/BYREF 样式数据）、问题页（过滤计数、规范项、快速修复按钮）；编辑器里诊断行底色、虚线下划线、行号圆点、当前行都在屏幕上可见。`swift test` 36 个、`editor-check` 13/13、`npm test` 全绿。

**还没做**：数据全是预览（等 C1–C3）；顶栏「学习」与账户面板、设置、导入导出、系统菜单与快捷键（F3）；深色主题没截图对照；与网页的逐元素几何对照未做；运行时文件的预览/编辑面板未做。
