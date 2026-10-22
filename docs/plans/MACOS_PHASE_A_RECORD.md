# macOS 阶段 A 原型记录

对应 [`MACOS_APP_PLAN.md`](MACOS_APP_PLAN.md) §4。原型代码在 [`native/macos/`](../../native/macos/README.md)，是**可丢弃的**：只为回答「页面从哪里来、数据能不能留住、和现有认证差在哪」，不是首版外壳。

本记录只写 2026-10-09 在下面这台机器上实测到的东西；没测的单列在最后，不推断。

- 机器：Apple M5 Pro，macOS 26.6.2（25G83），Xcode 自带 Swift 6.4
- 被测资源：仓库工作树 `b6f09dd-dirty`（含未提交的 `web/` 改动），`npm run build` 产物原样打包
- 方法：WKWebView 内由 `--task probe` / `--task pages` 自动跑，结果为 JSON；全部是真实 `lab.html` 等页面，不是手写测试页

## 1. 方案 B：App 内置资源 + `seedtocode://app/` 自定义 scheme

| 检查项 | 结果 | 说明 |
|---|---|---|
| 安全上下文 | `isSecureContext = true` | `crypto.randomUUID` 可用；`storage.js` 生成 deviceId 的路径不会抛错 |
| 首次启动（先清空全部网站数据） | lab 完整渲染，`pageErrors` 为空 | 截图与网页版布局一致 |
| 9 个 HTML 入口 | 全部载入，0 报错，0 外部资源 | `assign/assignments/classes/custom-task/grade/lab/learn/login/task`；`performance` 资源列表里没有任何非包内 URL |
| localStorage 跨重启 | 计数 1 → 2 | |
| IndexedDB 跨重启 | 计数 1 → 2；`caie9618.local` 8 个 store 齐全 | 应用库只在第一次保存后才建，这是现有行为，不是 scheme 的问题 |
| 真实草稿跨重启 | 第一次用 `execCommand` 在 Main 末尾写标记，「已保存」；重启后标记仍在 | 走的是使用者的输入路径，不是直接写 storage |
| deviceId 稳定 | 两次启动相同，且与 IndexedDB `meta.device` 一致 | |
| 共享核心 | 三份自带样例（Main 带两次 INPUT、BubbleSort、FileCopy）全部 `completed`，输出正确 | 直接读 `SAMPLES.docs`，不手抄 |
| Web Worker（blob）承载 runtime bundle | BubbleSort `completed`，113 步，输出与主线程**逐项相同** | 阶段 E「Worker 隔离」的前置条件成立 |
| `document.cookie` | 写入后读不回 | 自定义 scheme 没有 cookie |
| `CloudClient` | `configuration = "absent"` | `origin()` 只认 http/https，按设计停在「未配置」 |
| 跨源请求线上 `/health`、`/auth/me` | 均 `Load failed` | 被 CORS 挡住 |
| `navigator.storage.persisted()` | `false` | 配额约 20 GB；WKWebView 下的回收策略还要单独确认 |

**结论**：离线启动、持久化和共享核心这三项，方案 B **全部满足**，不需要内置 Node、也不需要本机端口。唯一缺口是云端：这个来源下 cookie 和跨源请求都不可用，所以登录、同步、班级必须走原生云端传输（计划 §4 列出的契约评审）。这是预期中的代价，现在有了实测依据。

## 2. 对照：WKWebView 直接加载线上 HTTPS 站点

同一份探针跑在 `https://seedtocode.example.invalid/lab`：

- 安全上下文、localStorage、IndexedDB、草稿、样例运行、Worker 结果与方案 B 相同。
- `document.cookie` 可读写；`CloudClient` 为 `configured`；同源 `/auth/me` 返回 `401 application/json`（未登录，符合预期）。
- deviceId 与方案 B **不同**：两个来源的本地数据完全独立。以后如果先发 HTTPS 外壳、再换内置资源，旧数据不会自动带过去，必须当成一次迁移来设计。

它的问题不在这些检查里，而在计划已经指出的两点：首次启动必须联网，资源版本由线上决定、不随 App 固定。另外，仓库里正在排查的「iPad Chrome 登录后留不住会话」怀疑的正是 **WKWebView 中 fetch 下发 cookie 后立刻跳转**（见 `updates.md` 2609181715 与 `web/cookie-check.html`）。在这个问题定性之前，HTTPS 外壳的登录不能算已验证。

## 3. 补测（同日第二轮）

### 3.1 WebContent 进程崩溃

原型取自己那个 WKWebView 的 WebContent 进程号（私有 KVC，只用于原型）单独 `SIGKILL`，不碰 Safari。先输入一行、等过自动保存，再输入一行、立即杀：

| 行 | 杀进程时 | 重载后编辑器 | 重载后 localStorage |
|---|---|---|---|
| `// __crash saved …` | 已过 450ms 自动保存防抖 | 在 | 在 |
| `// __crash unsaved …` | 刚输入，「保存中…」 | 不在 | 不在 |

新进程（pid 825 → 855）88ms 内重载完成，0 报错。**丢的就是最后不到 450ms 的输入**，和浏览器标签页崩溃一致，符合计划 §5「不声称强制终止时最后一个按键一定落盘」。如果要缩短这个窗口，是 `app.js` 自动保存策略的事，和 App 外壳无关。

### 3.2 模拟断网

用 WebKit 内容规则拦掉页面发出的全部 `http(s)` 请求（先验证规则生效：加载线上站点直接被拦）。然后清空数据首启 + 重启 + 9 个页面全跑：结果与联网时**逐项相同**——草稿、deviceId、样例运行、Worker、各页正文长度都一样，0 报错；只有两条跨源请求失败，本来就失败。

局限：这是 WebKit 层面的拦截，`navigator.onLine` 仍为 `true`，系统网络栈也没断。真断网要在关掉 Wi-Fi 的状态下跑一次（见 §5）。

### 3.3 几何对照（1280×800，清空数据后）

- **同一内核、同一份文件，`seedtocode://` 对比 `http://localhost`**：lab / learn / login / task 共 765 个可见元素，**位置与尺寸全部相同**。自定义 scheme 和打包本身对布局零影响。
- **WKWebView 对比 Chromium**（浏览器窗格，仅作参考）：lab 38 个带 id 元素中 21 个在 1px 内；其余差 2–3px，全是两类内核差异：单行文字盒高 13 vs 15（字体度量），以及编辑区 / 输出区等几个容器窄 2px。不是外壳造成的。计划要求的对照对象是 Safari，它与 WKWebView 是同一个系统 WebKit；Safari 自动化需要在 Safari 里打开「允许远程自动化」，本轮没有动这项设置。

### 3.4 性能基线

每种来源各跑 3 次，交替进行。测量全部在真实 lab 里，打字用 `execCommand('insertText')`，走页面的 input 事件路径，但不经过 NSEvent 和输入法，所以是**下限**，不是端到端。显示器 rAF 周期约 17ms。

| 指标 | `seedtocode://` | `http://localhost` |
|---|---|---|
| 进程启动 → lab 首次 didFinish | 270 / 296 / 321 ms | 300 / 297 / 285 ms |
| 2002 行文档里打一个字：同步处理 p50 / p95 | 27–28 / 28–29 ms | 27–28 / 28 ms |
| 同上：到下一帧之后 p50 / p95 | 50 / 50–51 ms | 50 / 50–51 ms |
| 2002 行滚动：帧间隔 p50 / p95，>20ms 的帧 | 17 / 18，1 帧 | 17 / 18，1 帧 |
| 运行 39627 步循环（lab 真实路径，含 trace）：总时长，帧间隔 p95，>50ms | 2.43 s，18–19 ms，0 | 2.43 s，18–19 ms，0 |
| 同一段，主线程直调 runtime（无 UI） | 2.40 s，18 ms，0 | 2.40 s，18 ms，0 |
| 同一段，Worker | 1.57 s，18 ms，0 | 1.57 s，18 ms，0 |
| WebContent 内存：结束时 / 进程峰值 | 91–121 / 575–623 MB | 119–121 / 597–617 MB |

读法：

1. **两种来源没有差别**，全在噪声内。打包成 App 不带来性能损失，也不带来性能收益。
2. **真正的瓶颈在编辑器，不在运行。** 2000 行的文件里每打一个字，页面同步处理要 27ms，超过一帧（17ms），要到第三帧才画出来。这是 `web/` 编辑器本身的代价，Safari 里也一样，换外壳解决不了。默认的 15 行 Main 没有测。这是计划 §9「NSTextView 原型」或改进现有高亮器的唯一实测依据，值得单独立项量清楚是哪一段在花时间。
3. **运行时 UI 本来就不卡。** 解释器定期让出主线程，运行中帧间隔 p95 18–19ms，没有一帧超过 50ms。Worker 的收益是**更快**（同一段快 35%，因为不用让出主线程），而不是「更不卡」。计划 §8 预设的「高负载运行下 UI 响应 p95 可重复改善」，在这段负载下没有改善空间；要证明 Worker 的价值，得用别的指标（停止响应、超长输出、trace 渲染）。
4. 进程峰值约 600MB，出现在把 2000 行文档整段替换进编辑器之后；没有单独拆分来源。

## 4. 使用者的决定（2026-10-09）

1. **加载方案：采用 App 内置资源 + `seedtocode://` 自定义 scheme。**
2. **最低系统：macOS 15**（2024 年 9 月发布）。原型已改为 `LSMinimumSystemVersion 15.0`、SwiftPM `.macOS(.v15)`。
3. **只支持 Apple Silicon（arm64）**，不出 Intel / 通用包。
4. **不上架 Mac App Store**，直接分发。在别人的 Mac 上双击能打开、不被 Gatekeeper 拦，需要 Developer ID 签名 + Apple 公证，这需要 Apple Developer Program 账号（目前原型只是 ad-hoc 签名，只能在本机跑）。不走 App Store，就不强制开 App Sandbox；是否仍然开沙盒，阶段 C 做文件权限时再定。
5. **原生云端传输**：契约尚未确认，见下。

## 5. 仍未验证的

- **真断网**：需要关掉 Wi-Fi 后跑下面两条，再把 `/tmp/off-1.json`、`/tmp/off-2.json` 交回来（关网络属于系统设置，原型不替你动）：
  `native/macos/build/SeedToCodeProto.app/Contents/MacOS/SeedToCodeProto --task probe --reset-data --out /tmp/off-1.json`
  `native/macos/build/SeedToCodeProto.app/Contents/MacOS/SeedToCodeProto --task pages --out /tmp/off-2.json`
- **登录全流程**：方案 B 下要等原生云端传输；HTTPS 对照下也没走过，见 §2 的 cookie 时序问题。
- **系统休眠恢复、外部邮件链接回到 App**：未测。
- **短文件打字延迟、真实键盘 / 输入法端到端延迟**：未测。
- **对 Safari 的直接对照**：未做，原因见 §3.3。
