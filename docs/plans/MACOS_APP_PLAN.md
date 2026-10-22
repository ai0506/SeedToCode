# SeedToCode macOS 应用开发计划

本文为待实施计划。依据 2026-10-09 的本地工作树、`PROJECT_STATE.md`、`CLOUD_ARCHITECTURE.md`、`FRONTEND_RULES.md` 和使用者在「查看 SeedToCode」对话中最后明确的产品要求编写。本轮只新增计划与索引、追加变更记录；不表示 Mac 应用、桥接、离线加载或 AI 已实现，也不包含部署授权。

## 1. 产品目标与范围

**同一个 SeedToCode，同一套主要界面，增加 macOS 原生能力。**

- 编辑器、项目列表、工具栏、输出、Trace Table、课程、题目和班级作业保持网页端基本布局、配色、字体、文字与操作含义。
- 网页仍是完整产品；Mac 通过能力检测增加系统文件、菜单、快捷键、窗口生命周期等能力。
- CAIE 分析、解释执行、教学与判题继续共享 TypeScript 源码；不重写一套 Swift 语言引擎。
- 未登录、断网、模型不可用时仍可本地编辑、保存、学习和运行。云端作业读取与正式提交仍需要服务端，离线提交只表示已排队。
- 「更流畅」由同机对比证明，不以使用 Swift 或 WebKit 本身作为证据。

首个可交付版本包含：可离线启动的共享前端、本地持久化、已有网页功能回归、原生文件打开/另存、系统菜单与快捷键，以及经过验证的登录和同步。运行隔离作为随后独立性能里程碑；AI 与原生编辑器作为可选后续阶段。

暂不纳入首版：重新设计侧栏或工具栏、完整 SwiftUI 重写、多窗口同时编辑同一数据、Finder 文件夹双向自动同步、iCloud 同步、AI 自动改代码/提交作业，以及未经对比的 NSTextView 替换。

## 2. 已核实的本地依据

| 位置 | 当前依据 | 对 Mac 计划的约束 |
|---|---|---|
| `PROJECT_STATE.md` | runtime 分 core/advanced；教学 Ch1–16 已接入，Ch17–23 为 Planned | Mac 保持现有范围，不将平台移植写成内容扩展 |
| `package.json` | 统一构建 language/runtime/exercise/teaching/storage/assignment 浏览器 bundles | App 打包同次构建结果，不维护手工拷贝的另一份核心 |
| `web/js/app.js` | `CAIERuntime.executeSource()` 与输入、停止、事件及 trace 渲染相连 | 隔离执行必须保留完整协议，不能只迁移最终输出 |
| `packages/runtime/src/index.ts` | 导出执行入口、controller、事件、trace 与虚拟文件类型 | 复用公开契约，不把 DOM 或真实磁盘接进解释器 |
| `web/js/cloud-client.js` | 仅接受页面自身 HTTP/HTTPS origin；通过 cookie 请求 `/auth/*`、`/api/*` | `file://` 或自定义 scheme 不能直接沿用云端链路 |
| `PROJECT_STATE.md` / `packages/storage` | CAIEStorage facade、兼容快照与 IndexedDB 镜像共存 | 首版保持存储模型，不顺带做 entity-only 迁移 |
| `CLOUD_ARCHITECTURE.md` | 账号分桶、hold、revision、冲突副本、tombstone、不可变提交 | Mac 不能另写一套简化同步规则 |
| `scripts/dev-proxy.mjs` | 只用于开发的 Node 同源外壳 | 不作为正式 App 运行时依赖 |
| `docs/plans/AI_ASSISTANT_PLAN.md` | AI 为独立计划，包含教学保护与云端前置条件 | Mac 可选本地模型不能被理解为已经批准整套 AI 上线 |

本次文件枚举未发现 Swift 源文件或 Xcode 工程；实施时仍需复查工作树。当前有其他未提交的文档整理、认证探针和虚拟文件恢复等改动，本计划不修改这些实现，也不将其中的假设视作已证实事实。上述为本地源码/文档核对，本轮未验证生产状态。

## 3. 推荐结构

```text
macOS 应用（SwiftUI / AppKit）
  ├─ 窗口生命周期、系统菜单、快捷键、文件授权
  ├─ WKWebView：共享 web/ 页面、CSS、课程和交互
  │    ├─ CAIEStorage / AuthStore / SyncQueue / SyncEngine
  │    ├─ NativeBridge 客户端（能力存在时才调用）
  │    └─ ExecutionHost（后续统一执行适配层）
  └─ NativeServices
       ├─ FileService：用户选定文件、原子保存、授权恢复
       ├─ CloudTransport：仅在加载方案需要且契约获准后接入
       └─ LocalAIService：可选，独立开关与验收

共享核心：packages/language、runtime、exercise、teaching-content、storage、assignment
```

建议新建 `native/macos/` 存放 Xcode 工程、Swift 服务和打包配置；`web/js/native-bridge.js` 承担薄适配。这些是拟议路径，不表示当前存在。

保留完整页面初始复用，先不将 lab 拆成多个 WebView。通过单一构建脚本将可公开的 `web/` 资源打进 App；排除开发诊断页、测试资源、服务端文件和参考解源文件，沿用 `teaching-content/src/browser.ts` 的学生内容边界。App 记录资源版本、核心版本与 bridge 协议版本；不同时加载来源不一致的 HTML 与 bundles。

## 4. 阶段 A：先确定页面来源、离线与认证方案

这是实施前最大的技术决策，必须用小原型得到结果，不能写完外壳再补。

| 方案 | 优点 | 代价与判断 |
|---|---|---|
| WKWebView 加载现有 HTTPS 站点 | 同源 cookie/API 最接近现有实现，适合早期兼容性对照 | 首次离线启动与资源版本固定无法仅靠网页缓存保证；只作为验证原型 |
| App 内置资源 + 专用 scheme + 原生云端传输 | 资源随 App 固定、可离线启动，无需内置 Node 服务 | 必须验证该来源下的存储/Worker，并扩展现有云端传输契约；推荐优先验证，尚未选定 |
| App 内置资源 + 本机 HTTP 服务 | 可以提供 HTTP origin | 端口、进程生命周期、cookie 属性、请求来源与本机攻击面复杂；保留备选，不默认采用 |

不能用 `WKURLSchemeHandler` 拦截 WebKit 已支持的 HTTPS scheme。Apple 明确禁止该用法；自定义 scheme 与网站 HTTPS origin 也不能当作同一个来源。[Apple 文档](https://developer.apple.com/documentation/webkit/wkwebviewconfiguration/seturlschemehandler(_:forurlscheme:))

原型验证清单：

1. 持久化 website data store；应用重启后读取同一份 localStorage、IndexedDB、草稿、队列与 deviceId。Apple 提供持久化 store，但不等于已证明本项目在选定 scheme 下全部可用。[WKWebsiteDataStore](https://developer.apple.com/documentation/webkit/wkwebsitedatastore)
2. 首次启动即断网、已使用后断网、系统休眠恢复、页面跳转及 WebContent 进程退出后的恢复。
3. `lab/learn/task/login/classes/assign/assignments/custom-task/grade` 的相对链接、查询参数与返回路径；枚举实际全部 HTML 入口，而非只验证 lab。
4. learner/teacher 邮箱验证与日常登录、student 激活/注册/登录、退出与会话失效；以随后独立 `/auth/me` 成功识别身份作为登录验收，不能只看登录 POST 200。
5. 邮件链接从外部浏览器打开时的处理：可明确引导回 App 登录，不依赖从 Safari/Chrome 偷读或共享 cookie。正式深链为后续独立能力。
6. App 与 Safari/Chrome 的本地数据按独立安装处理；同账号通过现有云同步连接。游客内容提供明确导入/导出路径，不能宣称安装 App 会自动带入浏览器数据。

若选择原生云传输，先完成单独契约评审并记录到云架构文档：固定 HTTPS 服务来源、固定方法/路径白名单、请求体上限、重定向策略、cookie 会话隔离及清理、错误映射、超时/取消、CSRF/Origin 检查兼容和账号 generation。JS 不获得 cookie/token，也不能请求任意 URL。现有网页继续走同源请求，禁止放宽 CORS、Secure、SameSite 或服务端归属检查来迁就 App。

**阶段出口：**用验证记录选定一个同时满足离线启动、持久化和认证边界的方案；如需修改现有云契约，将具体取舍交使用者确认后实施。最低 macOS、CPU 架构范围和分发方式同时确定；不因可选 AI 直接抬高整个 App 的系统要求。

## 5. 阶段 B：共享 UI 外壳与 Native Bridge

- SwiftUI 管窗口，AppKit 补充系统文件和菜单能力；页面内部仍用现有 HTML/CSS/JS。
- 系统标题栏不取代网页工具栏；对照时使用相同 Web 内容区域大小，排除系统窗口边框差异。
- 建立能力查询，例：`files.open`、`files.saveAs`、`window.commands`、`ai.explain`。普通浏览器没有 bridge 时沿用原功能；网页无需伪造 Mac 环境。
- 请求包含 `protocolVersion/requestId/method/payload`；回复包含相同 requestId 与结构化结果或错误码。限制大小、并发与超时，区分取消、不可用、权限失效和内部失败。
- 每个页面生命周期有 generation；导航/销毁时取消未决请求、释放 handler，旧页面回复不能写进新页面。重复回调不重复应用。
- 只给受信任主框架暴露 bridge；校验实际来源与 frame，不给外链/iframe 权限。外部 URL 走系统浏览器，拒绝任意脚本执行、任意路径读写和任意网络代理。
- 输入源码、题面和 AI 输出均为数据。禁止字符串拼接执行用户文本；结构化传递并验证返回值。
- WebContent 崩溃后的恢复以已持久化草稿为准，不能默认清空数据；保存失败保留内存内容并明确提示，不声称强制终止时最后一个按键一定落盘。

**阶段出口：**App 可离线打开课程与编辑器，原有主题/页面跳转/输入运行可用；bridge 通过超时、取消、导航、越权来源和重复消息验证。只打开界面不算首版完成。

## 6. 阶段 C：原生文件与系统操作

第一步采用「导入到项目 / 导出到 Finder」语义，保留应用内部项目为编辑与同步的权威数据，避免同时维护 Finder 与云端两套自动双向同步。

- 打开 `.pseudocode`（UTF-8），`.txt` 仅按现有导入兼容规则处理。原生面板允许用户选择目标，不自动扫描磁盘。
- `⌘S` 与网页保存含义一致：先持久化当前项目草稿；「另存为文件…」是明确的 Finder 写入动作。菜单与页面按钮调用同一操作入口，避免一次按键保存两遍或触发浏览器默认动作。
- 如果后续支持绑定真实文件，单独显示「本地草稿」「磁盘文件」「云同步」状态；只能在对应写入成功后更新，不能用队列为空表示全部已保存。
- 原子写入；授权/bookmark 失效可重新选择。保存取消、磁盘空间不足、路径被移走、外部文件已修改时保留内部草稿，覆盖已有文件走明确的选择与系统文件流程。
- 绑定文件的异步操作携带 projectId/fileId/content revision；保存期间切换文件或继续输入，旧回调不得标记新内容已写盘。
- 伪代码里的 OPENFILE/READFILE/WRITEFILE 仍只访问虚拟文件。把真实文件导入虚拟文件区是显式动作，执行成功后的虚拟文件变化不自动覆盖 Finder 原件。
- Finder 双击、拖放、最近文件在基本打开/保存稳定后接入；来源统一进入同一导入路径，不绕过编码、大小和归属验证。
- App 关闭依靠自动草稿与受控 flush；不新增浏览器 beforeunload。原生文件面板属于系统文件能力，页面业务确认和设置继续使用现有应用内组件。

**阶段出口：**打开、导入、另存、取消、权限失效与写入失败全覆盖；重启可恢复草稿；菜单与按钮行为一致，实际字节与再次读取的文件一致。

## 7. 阶段 D：登录、同步与完整功能验收

在选定的加载方案下保留 CloudClient/AuthStore/SyncQueue/SyncEngine 的职责，不用 Swift 另写同步业务。

必须覆盖的状态组合：

| 场景 | 必须成立 |
|---|---|
| 游客编辑后登录 | 未明确并入的数据保持 hold，本地仍可编辑运行 |
| A → B → A | A 的队列、revision、服务端 ID 映射恢复；不发送到 B |
| 发送期间继续编辑、切页或退出 | 旧 generation 不确认或阻塞新 generation |
| 提交期间断网/重启 | 不可变答案快照与原 operationId 保留，不重复生成提交 |
| 两台设备同时改同一文件 | 保留本地并生成云端副本，不静默覆盖 |
| 删除与离线设备回归 | 按 revision/tombstone 处理，不无条件复活 |
| 会话过期/服务失败 | 本地编辑运行照常；重新认证后恢复正确分桶 |
| 云端运行 | 只执行请求 snapshot，hold 不绕过；服务端重新校验 |
| 作业与章末题 | 以服务端确认区别排队/已送达；客户端分数不成为成绩依据 |

Mac 使用独立 deviceId；不复制浏览器安装标识。首版只有一个写入窗口，其他打开动作复用该窗口。多窗口必须在后续实现跨窗口写入协调、队列单发送者和账号广播后开放。

**阶段出口：**用专用测试身份完成 Mac ↔ 浏览器项目/进度同步、冲突、作业提交与老师查看链路；本地 D1 通过只证明本地链路，生产验证另需授权与独立记录。

## 8. 阶段 E：测量与执行隔离

先记录网页 Safari、当前 WKWebView 外壳在同机相同源码、窗口大小、主题和 trace 配置下的基线，再决定优化位置。

- 测冷/热启动、长文件输入到下一次绘制、滚动帧间隔、运行中输入延迟、停止响应、trace 渲染耗时、峰值内存；固定重复次数，报告 p50/p95、设备/系统与测量方法。
- 输入与绘制由实际事件/帧时间测量；运行耗时与 UI 响应分别报告，不能以解释器更快推断编辑更流畅。
- 优先原型验证 Web Worker 承载共享 runtime；它也可能改善网页端，不必为了 Mac 强行改用 Swift 执行。
- 执行消息包含 runId/sequence，覆盖 start/input/stop/event/trace/result/error；输出批量传输、有背压和内存上限，trace 顺序与内容不变。
- 停止/崩溃/超限不提交虚拟文件；只接受当前 run 的正常完成结果。启动时捕获项目、文件与 revision，期间切项目或改虚拟文件不能让旧结果覆盖新内容。
- Worker 不支持或原型失败时保留经验证的现有执行路径，不静默吞错。只有 Web Worker 无法满足需求时再比较独立 JavaScriptCore 执行宿主，并明确计时器、异步输入与 bundle 环境差异。

建议预先固定性能门槛：正常编辑/滚动 p95 不比基线恶化超过 10%；高负载运行下 UI 响应 p95 有可重复改善。具体输入/停止延迟的绝对预算在阶段 A 用目标设备实测后冻结，不能事后选对自己有利的指标。性能门槛不得代替语义一致性验收。

**阶段出口：**同输入/profile 下输出、错误、trace、虚拟文件结果一致，停止和崩溃可恢复；优化有独立测量证据。

## 9. 后续可选：本地 AI 与原生编辑器

### Apple Foundation Models

作为独立里程碑，不阻塞首版。`SystemLanguageModel` 文档标注 macOS 26 起可用；运行时仍须检查设备、地区、模型准备状态与语言支持，不能只判断系统版本。[Apple 文档](https://developer.apple.com/documentation/foundationmodels/systemlanguagemodel)

- 共用现有 AI 计划的概念解释、诊断解释与作业保护边界；已有云端 AI 的额度/提供方条件不能被本地模型接入顺带宣布完成。
- UI 沿用共享前端样式；Swift 负责模型服务，接模型不要求把聊天界面重写成 SwiftUI。
- 请求显式选择与预览上下文，限制长度，按模型版本评测中文与 CAIE 准确性。模型不判分、不改源代码、不自动提交。
- 即使返回结构化数据也要校验教学边界；本地模型无法由服务端强制保护，提示词和过滤不能证明完全防代写，须记录残余风险再决定开放范围。
- 取消、超时、模型下载中、资源不足、应用切后台均有可恢复状态；不可用时不自动把代码发给云服务。

### NSTextView / TextKit 原型

只在现有编辑器测得明确瓶颈后启动。对比输入法组合、中文/Tab/合字字形测量、选区、查找、撤销、缩进、语法色、诊断、行号、无障碍与键盘操作。保持当前尺寸、配色和文字；只有显著收益且功能与视觉均达到门槛时才替换，可单独回退。

## 10. 验证、发布与实施顺序

### 固定验收资料

- 真实默认 `Main.pseudocode` 与 `web/js/samples.js` 全部自带样例；重点包括 `BubbleSort.pseudocode` 的数组、过程与下标赋值。
- 自动化直接读取 samples.js 的源码；覆盖 core/advanced、交互 INPUT、停止、错误、递归、文本/随机虚拟文件和 trace，不在测试中抄一份简化样例。
- 桌面与最窄支持断点、各主题、不同文字长度/错误/身份状态，使用 FRONTEND_RULES 的几何快照逐状态切换验证无关元素不移动；Chrome 检查不能替代实际 WKWebView 验收。
- Mac 与网页视觉对照用相同内容区域、字体加载结果和缩放；记录截图与关键元素 rect，字体抗锯齿差异单列，不能掩盖结构偏差。

### 每一阶段的工程检查

1. 保留现有未提交工作，实施前再次确认分支、diff 和当前事实。
2. 按范围运行 `npm run check`、`npm run build`、相关测试；共享运行/判题改动优先完整 `npm test`。服务端改动运行对应 typecheck/API 联测。
3. 新增 Swift 后运行目标 scheme 的构建与相关 XCTest；真实 App 操作验证文件权限、持久化、崩溃恢复、菜单和 WKWebView 布局。
4. 共用 JS/CSS 所有引用页缓存版本现查现提；App 资源清单记录版本与哈希，不手改 bundles。
5. 先导出可测试的 App，再验证签名/沙盒权限、公证、安装升级与旧数据保留。分发渠道和支持范围由阶段 A 的决定约束；正式发布/生产配置更改单独授权。
6. 发布回滚保留本地数据与旧资源兼容；资源更新按完整版本切换，不在线拼装未经验证的新旧前端。涉及存储迁移，先备份、重复执行验证，并明确旧版能否读回。
7. 每次修改追加 updates.md；PROJECT_STATE.md 只在使用者明确要求时更新当前事实。

### 交付物与推进门槛

| 顺序 | 交付物 | 进入下一阶段的条件 |
|---|---|---|
| A | 加载/存储/认证原型记录、平台与分发选择 | 离线与认证方案有实测证据，云契约取舍明确 |
| B | 共享 UI 外壳、版本化 bridge、离线资源包 | 主要页面可用，持久化和 bridge 生命周期通过 |
| C | 原生打开/另存、菜单与快捷键 | 失败不丢草稿，真实文件字节验收通过 |
| D | 账号/同步/班级作业回归报告 | 首版全部既有功能达到验收，可交付测试 App |
| E | 性能基线与运行隔离改动 | 语义一致且测得改善，单独交付优化版本 |
| 可选 | 本地 AI、原生编辑器原型 | 各自独立评测与产品决策，不拖入首版 |

不承诺未经原型验证的工期与前端复用百分比。下一次若授权实施，最小起点是阶段 A 的可丢弃兼容性原型与测量记录，不直接扩展到全部原生能力。
