# macOS 阶段 A 原型

**原型**，不是首版 App：阶段 A 的加载/存储探针，加上已接通的原生云端传输（[`MACOS_CLOUD_TRANSPORT.md`](../../docs/plans/MACOS_CLOUD_TRANSPORT.md)）。计划见 [`docs/plans/MACOS_APP_PLAN.md`](../../docs/plans/MACOS_APP_PLAN.md)，实测结论见 [`docs/plans/MACOS_PHASE_A_RECORD.md`](../../docs/plans/MACOS_PHASE_A_RECORD.md)。

一个 WKWebView 窗口，把仓库 `web/` 打进 App 包，通过 `seedtocode://app/` 自定义 scheme 提供；也可以切到直接加载线上 HTTPS 站点做对照。另带一组自动探针，结果写成 JSON。

## 构建

先在仓库根目录 `npm run build`（原型直接打包那份产物，不另存副本），然后：

```bash
native/macos/scripts/build-app.sh
```

产物：`native/macos/build/SeedToCodeProto.app`（ad-hoc 签名，未公证，只供本机；最低 macOS 15，仅 arm64）。打包时排除 `cookie-check.html`、`teaching-template.html`、`README.md`；`Contents/Resources/web-manifest.sha256` 记录每个资源文件的哈希，`Info.plist` 的 `SeedToCodeWebRevision` 记录 git 版本（工作树有改动时带 `-dirty`）。

单元测试（路径白名单、会话 cookie、换账号 generation 等，不需要 WebKit）：

```bash
swift test --package-path native/macos
```

## 运行

在 Xcode 打开 `Package.swift` 后直接 Run，或使用 `swift run` 时，运行的是没有 `.app` 资源目录的裸可执行文件。现在会从本 package 的 `build/SeedToCodeProto.app/Contents/Resources` 读取完整资源；因此先运行上面的打包脚本，网页资源有修改后也要重新打包。路径按源文件位置定位，不依赖启动时的工作目录。缺少资源会显示准备步骤，而不是空白的 404。正式 `.app` 始终只读取自身资源，损坏时不会回退到仓库。

```bash
open native/macos/build/SeedToCodeProto.app
```

探针（不进 Dock，跑完自动退出）：

| 参数 | 作用 |
|---|---|
| `--task probe` | 在 `lab.html` 里跑存储 / 草稿 / 样例运行 / Worker / 云端可达性检查 |
| `--task pages` | 逐个打开包内所有 HTML，收集报错、全局对象和外部资源 |
| `--task crash` | 输入两行（一行等过自动保存、一行不等），杀掉本 App 的 WebContent 进程，检查重载后剩下什么 |
| `--task geometry` | lab / learn / login / task 全部可见元素的 rect，用于两种来源逐项对比 |
| `--task perf` | 启动时间、2000 行文档打字与滚动、运行中帧间隔（lab 路径 / 主线程 / Worker）、WebContent 内存 |
| `--origin remote [--remote URL]` | 改为加载一个 http(s) 站点：线上（默认 `https://seedtocode.example.invalid`）或本机静态服务（同一份文件，用来隔离自定义 scheme 的影响）。`https` 是同义写法 |
| `--block-network` | 用 WebKit 内容规则拦掉全部 http(s) 请求，模拟断网（`navigator.onLine` 不变） |
| `--task script --script FILE [--args JSON]` | 在 `--start` 页（默认 lab）里执行文件中的 async 函数体，参数以 `args` 传入；端到端联调用 |
| `--api-base URL` | 原生云端传输连哪台服务器。默认线上，**只接受本机回环地址**（如 `http://127.0.0.1:8787` 的 `wrangler dev`） |
| `--native-lab` | 打开原生实验室窗口（SwiftUI，现在接的是 PreviewLabCore 预览数据） |
| `--lab-demo output\|problems\|debug\|files` | 原生实验室启动后自动开语法检测、改一行、预览运行、给 INPUT，再切到该标签（截图看各状态用） |
| `--hold N` | 窗口停留 N 秒后退出，并把窗口号打到 stderr；`scripts/shot.sh` 用它截真实屏幕画面 |
| `--task editor-check` | 原生编辑器行为自检：着色、回车补结尾、`<-`→`←`、配对、退格、输入法合成、全部撤销、多行缩进 |
| `--task editor-perf` | 2000 行文档打字（处理 / 处理+强制重画）、滚动、载入耗时；附带真实绘制次数 |
| `--reset-data` | 先清空这个 App 的全部网站数据和该服务器在钥匙串里的会话，模拟刚安装 |
| `--out FILE` / `--snapshot FILE.png` | 结果 JSON / 第一页截图 |

```bash
native/macos/build/SeedToCodeProto.app/Contents/MacOS/SeedToCodeProto --task probe --reset-data --out /tmp/run1.json
```

注意：探针会在**这个 App 自己的**网站数据里写 `__proto.*` 键、`__proto_db` 库，并在 Main.pseudocode 末尾加 `// __proto draft marker`、`// __crash …` 标记行（perf 会把 Main 还原）。它不碰 Safari / Chrome 的数据，但 `--origin https` 时写的是这个 App 里线上来源的本地存储（未登录，不会同步）。

## 编辑快捷键

系统「编辑」菜单提供 `⌘C` 复制、`⌘V` 粘贴、`⌘X` 剪切、`⌘A` 全选、`⌘Z` 撤销和 `⇧⌘Z` 重做。命令由当前输入焦点处理，适用于 WKWebView 的 lab 编辑器、其他文本框及原生编辑器，不直接改写 DOM value。

## 代码

| 文件 | 内容 |
|---|---|
| `SeedToCodeKit/PathPolicy.swift` | 页面能让原生侧代发哪些请求：方法、`/auth/` `/api/` 前缀、逐段检查、拼完核对主机 |
| `SeedToCodeKit/SessionCookie.swift` | 从 Set-Cookie 里取 `seedtocode_session` 的设置 / 清除 |
| `SeedToCodeKit/TokenStore.swift` | 钥匙串（本机、不同步）与测试用内存实现 |
| `SeedToCodeKit/CloudTransport.swift` | URLSession 代发：手动 Cookie、不跟随重定向、大小与超时、换账号 generation、取消 |
| `SeedToCodeKit/Editor/` | `CAIESpec`（读 export-web-spec 导出的 JSON）、`SyntaxHighlighter`（lang.js 移植，测试里与网页逐 token 对照）、`EditRules`（app.js 输入约定移植）、`JSRegex`（按 JS 的 ASCII `\b` 语义编译正则） |
| `Lab/CodeTextView.swift`、`LineNumberRuler.swift`、`CodeEditor.swift`、`EditorTheme.swift` | 原生编辑器：NSTextView（TextKit 1）、逐行增量着色、行号栏、当前行/诊断/运行行背景、SwiftUI 包装 |
| `Lab/LabCore.swift`、`PreviewLabCore.swift` | 与后台的接口契约（MACOS_NATIVE_LAB_PLAN.md §4）及内存预览实现 |
| `Lab/LabModel.swift`、`LabView.swift`、`ResultsPanel.swift`、`LabStyle.swift` | 原生实验室窗口 |
| `Lab/EditorProbe.swift` | 编辑器自检与量具 |
| `scripts/shot.sh` | 截 App 窗口的**真实屏幕画面**。外观只用它验收：`cacheDisplay` 离屏截图曾在屏幕上一个字都没有时照样截出完整代码 |
| `scripts/export-web-spec.mjs` | 打包时从 caie-spec.js、samples.js、styles.css 导出 `web-spec.json`，Swift 侧不留关键字表和配色副本 |
| `CloudBridge.swift` | `seedtocodeCloud` 消息处理：只认主框架里的 `seedtocode://app` 页面 |
| `AppSchemeHandler.swift` | `seedtocode://app/*` → 包内 `web/`；无后缀路径补 `.html`；越界路径 403 |
| `AppDelegate.swift` | 窗口、持久化 `WKWebsiteDataStore.default()`、导航白名单（外链交给系统浏览器）、WebContent 退出后重载 |
| `ProbeRunner.swift` / `ProbeScripts.swift` | 自动探针；探针模式下还会记录页面经原生桥发出的每个请求（`window.__protoNet`） |

钥匙串说明：开发版是 ad-hoc 签名，每次重新构建签名都会变，之后第一次读上一个构建留下的会话条目时，系统可能弹窗询问是否允许。Developer ID 签名的正式版签名稳定，不会这样。
| `LaunchOptions.swift` | 上表的命令行参数 |
