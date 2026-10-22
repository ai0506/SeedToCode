# macOS App 原生云端传输方案

对应 [`MACOS_APP_PLAN.md`](MACOS_APP_PLAN.md) §4 的「原生云传输契约评审」。前置实测见 [`MACOS_PHASE_A_RECORD.md`](MACOS_PHASE_A_RECORD.md)。

**状态**：2026-10-09 使用者确认 §10 四项；同日实现并在本机 `wrangler dev` 上验证，见 §11。服务端未改动。

## 0. 一句话版本

App 里的网页不能直接连服务器（地址是 `seedtocode://app`，浏览器不给它发登录凭证，跨源请求也被挡）。改成：网页把「请求哪个接口、带什么数据」交给 Swift，Swift 用保存在系统钥匙串里的登录凭证去请求我们自己的服务器，再把结果原样交回网页。网页看不到凭证，Swift 也只肯连我们自己的服务器。

**服务端一行都不用改。** 原因见 §2。网页端只改 `CloudClient` 里发请求的那一处，普通浏览器的行为保持不变。

## 1. 现状（2026-10-09 读源码核实）

| 事实 | 位置 |
|---|---|
| 会话是 cookie `seedtocode_session`：HttpOnly、SameSite=Lax、生产加 Secure、30 天 | `server/src/auth.ts` `cookieHeader`、`SESSION_TTL_MS` |
| 服务端只从 `cookie` 头里取这个 token，查哈希后的 sessions 表；**不检查 Origin / Referer，没有 CSRF token** | `auth.ts` `currentUser`；`index.ts` 全文无 Origin 判断 |
| `OPTIONS` 一律返回 204，**不带任何 CORS 头**，所以别的网页跨源调用会被浏览器挡下 | `index.ts` 第一行路由 |
| 下发会话的接口：`/auth/email/login`、`/auth/email/verify`、`/auth/student/activate`、`/auth/student/register`、`/auth/student/login`；`/auth/logout` 删除服务端 session | `index.ts` |
| 页面里**所有**网络请求都经过 `CloudClient.request(path, opts)` 一个出口：拼 `origin + path`、`fetch(credentials: "include")`、读文本、解析 JSON、归一错误 | `web/js/cloud-client.js` 79–140 行；其它 `web/js/*.js` 没有 `fetch` / XHR |
| `CloudClient` 只认 http/https 的页面来源，否则停在「云端功能暂未连接」 | `cloud-client.js` `origin()` |
| 页面会带查询参数（例：`practice-submissions?taskId=…`） | `teacher-app.js` |
| 服务端大小上限：单文件 256 KB，单项目 2 MB，云端运行快照 2 MB，练习草稿 256 KB | `sync.ts`、`run.ts`、`teaching.ts` |
| 邮箱验证链接是 `{APP_ORIGIN}/lab?authToken=…`，在浏览器里打开 | `auth.ts` `sendVerificationLink`、`account-ui.js` |

## 2. 为什么服务端不用改

服务端认人只看请求里有没有合法的 `seedtocode_session`。Swift 的 `URLSession` 不是浏览器，没有 CORS 限制。只要它在请求头里带上这个 cookie，服务端看到的就和浏览器发来的请求没有区别。

**不改服务端是有意的**，不是偷懒：

- 不放开 CORS。放开后别的网站也能从浏览器里调我们的接口，App 用不到这条路。
- 不改 cookie 的 SameSite / Secure。网页版的安全属性保持原样。
- 不给 App 单开一套登录接口或另一种凭证。两套认证就要维护两套过期、撤销和限流规则。

**将来的约束（要写进云架构文档）**：如果以后服务端加 Origin / Referer 检查来防 CSRF，必须放行**不带 Origin 头**的请求。App 的原生请求不带这个头；带凭证的跨站请求一定来自浏览器，而浏览器总会带上 Origin。否则 App 会在某次服务端发布后突然全部 403。

可选、不阻塞的一项：App 请求带 `User-Agent: SeedToCode-macOS/<版本>`，只用于服务端日志区分来源，**不用于任何授权判断**。

## 3. 结构

```text
网页（seedtocode://app/*.html，和网站同一份 web/）
  CloudClient.request(path, opts)
     ├─ 普通浏览器：fetch(origin + path)          ← 现状，不变
     └─ App 内：NativeTransport.send({...})       ← 新增
            │  WKScriptMessageHandlerWithReply（只接受主框架、来源 seedtocode://app）
            ▼
Swift  CloudTransport
     ├─ 校验：方法、路径、大小、并发
     ├─ 拼 URL：固定服务器 + path（JS 给不了主机名）
     ├─ 从钥匙串取 token，手动加 Cookie 头
     ├─ URLSession（不存 cookie、不跟随重定向、超时）
     ├─ 只从登录类接口的响应里接收新 token → 写回钥匙串
     └─ 回复 { status, contentType, retryAfter, body文本 }
```

## 4. 网页侧改动（只动 `cloud-client.js`）

1. 抽出传输函数：`send(method, path, bodyText) → { status, text }`。默认实现就是现在的 `fetch`。
2. 页面启动时检测 `window.webkit?.messageHandlers?.seedtocodeCloud`，有就换成原生实现。
3. `origin()` / `available()`：有原生传输时视为「有 API」，不再要求页面是 http(s)。
4. 解析 JSON、`CONFIGURED/ABSENT` 判定、错误归一、`UNAUTHENTICATED` 时清本地身份，**全部沿用现有代码**。原生传输只负责把文本拿回来，不另写一套错误规则。
5. 网络失败（断网、超时、原生拒绝发送）统一抛现有的 `OFFLINE`，队列照常退避重试。
6. `opts.signal`（取消）：原生侧支持按 requestId 取消。

**普通浏览器里不会走到任何新分支**，用现有 vitest 和浏览器实测确认网页版行为不变。

## 5. 原生侧规则

### 5.1 消息

请求：`{ protocol: 1, requestId, method, path, body }`，`body` 是字符串或 null。
回复：`{ requestId, ok: true, status, contentType, retryAfter, text }`，或 `{ requestId, ok: false, kind }`，`kind` 取 `offline | timeout | rejected | tooLarge | cancelled`。

### 5.2 只允许连我们自己的服务器

- 服务器地址写死在 App 里：`https://seedtocode.example.invalid`。JS 只能给路径，给不了主机名。调试版可以用启动参数指向本机 `wrangler dev`，正式版忽略该参数。
- 方法只允许 `GET / POST / PUT / DELETE`。
- 路径必须以 `/auth/` 或 `/api/` 开头，字符限于 `A-Z a-z 0-9 - _ . ~ / %`，可带一段查询串。拒绝 `..`、`//`、`%2e`、`%2f`、`%5c`、反斜杠和 `@`。
- **用前缀白名单，不逐条列接口。** 主机已经固定为我们的服务器，每个接口自己也会检查权限。逐条列出带不来更多安全，反而每加一个接口都得同步改 App，漏改就静默失败。
- 拒绝重定向：API 不该重定向，遇到就当服务错误处理，不跟过去。

### 5.3 登录凭证（会话 token）

- 存在**系统钥匙串**，只限本机（`ThisDeviceOnly`，不进 iCloud 钥匙串），不写进网页存储，也不写进普通文件。
- `URLSession` 关闭自动 cookie（`httpShouldSetCookies = false`、`httpCookieAcceptPolicy = .never`），每次请求手动加 `Cookie: seedtocode_session=…`。这样 cookie 永远不进 WebKit，也就**绕开了 WKWebView「fetch 下发 cookie 后立刻跳转」的时序问题**（iPad Chrome 留不住会话的怀疑原因）。
- 只从 §1 列出的 5 个登录类接口的响应里接收 `Set-Cookie: seedtocode_session=…`；其它响应里的 Set-Cookie（例如诊断探针）一律忽略。`Max-Age=0` 视为清除。
- `/auth/logout`：不管服务器回什么，甚至断网，都清掉本地钥匙串。断网时服务端那条 session 要到 30 天后才过期，但本机已经没有它的副本，别人拿不到。
- 收到 `401 UNAUTHENTICATED` 时清掉本地 token，和网页版「会话失效就回到未登录」一致。

### 5.4 换账号与旧请求（generation）

原生侧维护一个 `sessionGeneration`，token 每次被替换或清除就加 1。每个请求记下发出时的值，响应回来时值已变化的话：

- 不接收其中的 Set-Cookie。例如登录请求还在路上时已经点了退出，晚到的登录响应不能把人又登回去。
- 401 不触发清除，因为它说的是上一个账号。
- 照常把结果交回网页。网页侧 `SyncEngine` 已有按账号分桶和 generation 的处理（`CLOUD_ARCHITECTURE.md` §5），原生侧不重复实现业务规则。

页面跳转或 WebContent 进程重启后，旧页面发出的请求不再回复；在途请求直接取消，回复处理器仍各调用一次，避免泄漏。

### 5.5 限制

| 项 | 值 | 理由 |
|---|---|---|
| 请求体 | ≤ 4 MB | 服务端最大的是 2 MB 快照 / 项目，JSON 转义后留余量 |
| 响应体 | ≤ 16 MB | 老师批量查看提交可能较大；实现时用真实班级数据量过再定 |
| 超时 | 30 s；`/api/runs` 60 s | 运行接口要等服务端执行 |
| 同时在途 | ≤ 6，其余排队 | 和浏览器单域名并发数相当，避免把服务器打满 |

### 5.6 谁能调用

- 只注册给主框架，回调里再核对 `frameInfo.isMainFrame` 和来源确为 `seedtocode://app`。
- App 窗口里只允许打开包内页面，外链交给系统浏览器（原型已实现）。外站页面永远拿不到这个通道。

## 6. 邮箱注册与验证

验证链接仍然指向网站，会在浏览器里打开。首版**不做**「点链接跳回 App」：

1. 老师 / 个人学习者在 App 里注册，服务端发验证邮件（密码已经随注册请求提交）。
2. 用户在邮件里点链接，浏览器打开网站，账号激活，同时浏览器也登录了。
3. 回到 App，用邮箱和密码登录。

App 里的提示文案要相应改成「在浏览器里点开邮件链接完成验证后，回到这里用邮箱和密码登录」。只在检测到原生能力时显示这句，网页版文案不变。

学生（激活码、班级码注册、用户名密码登录）全程在 App 内完成，不涉及邮件。

以后如果要「点链接直接回 App」，需要通用链接（Universal Links）：网站放一个关联文件，App 签名带关联域名权限，依赖 Developer ID 签名。单独立项，不在首版。

## 7. 风险对照

| 风险 | 对策 | 和网页版相比 |
|---|---|---|
| 页面里有恶意脚本（XSS）冒用身份调接口 | 拿不到 token，只能调我们自己的接口 | 相同 |
| 外站诱导用户的 App 发请求（CSRF） | 浏览器的 cookie 罐里根本没有这个凭证 | 更好 |
| token 从磁盘被偷 | 存在钥匙串，只限本机 | 更好（浏览器 cookie 是普通文件） |
| 把 App 当跳板访问任意网址 | 主机写死，路径白名单 | 网页本来就没有这个能力 |
| 旧账号的晚到响应污染新账号 | §5.4 generation | 网页版靠 SyncEngine，App 在原生层多一道 |
| 服务端以后加 Origin 检查导致 App 失效 | §2 的约束写进云架构文档 | — |

## 8. 不变的东西

CloudClient / AuthStore / SyncQueue / SyncEngine 的职责、账号分桶、hold、revision、冲突副本、tombstone、不可变提交、服务端重新判分，全部不变。App 只换了「把请求送到服务器」这一层。

## 9. 实施后的验收

- 网页版：`npm test` 全绿；真浏览器走一遍登录、同步、退出，行为不变。
- App 对本机 `wrangler dev`（测试身份，本地 D1）验证：
  - learner / teacher 邮箱注册（开发模式会直接返回 token）、验证、日常登录；student 激活、班级码注册、登录。以随后单独一次 `/auth/me` 成功作为登录成功的判据，不只看登录 POST 返回 200。
  - 退出后 `/auth/me` 为 401，钥匙串里已没有 token。
  - A → B → A 换账号，队列不串号。
  - 断网时编辑、运行照常，联网后同步续上。
  - App ↔ 浏览器：项目和进度双向同步；同一文件两边同时改时生成冲突副本。
  - 作业提交，老师在网页端能看到。
  - 越权尝试：从页面构造 `//evil.com`、`/../`、`%2e%2e`、`/static/x`、超大请求体、`PATCH`，全部被原生侧拒绝。
- 生产验证另需授权，单独记录。

## 10. 使用者已确认的（2026-10-09）

1. 按本方案做：Swift 代为请求、凭证放钥匙串、**服务端不改**。
2. 邮箱验证首版走「浏览器里点链接 → 回 App 登录」，通用链接以后再说。
3. 在 `CLOUD_ARCHITECTURE.md` 里加一条约束：以后服务端加 Origin 检查必须放行不带 Origin 的请求。
4. （可选）服务端日志按 `User-Agent` 区分 App 请求。只记日志，不做授权判断。

## 11. 实施与验证记录（2026-10-09）

**代码**：`web/js/cloud-client.js`（`send()` 传输函数 + `NATIVE` 分支；初始化时「无来源即判无云端」那句改为同时看 `NATIVE`）、`web/js/login-page.js`（App 内注册成功后的提示）；`native/macos/Sources/SeedToCodeKit/`（`PathPolicy`、`SessionCookie`、`TokenStore`/钥匙串、`CloudTransport`）、`native/macos/Sources/SeedToCodeProto/CloudBridge.swift` 与 `AppDelegate` 接线。`User-Agent: SeedToCode-macOS/<版本>` 已随请求发出；服务端没有加任何日志代码——Workers Logs 是否记录这个头，要等 App 第一次连生产后在后台看，没有就再加一行日志（第 4 项）。

**单元测试**（`swift test`，21 个）：路径白名单（接受页面真实会发的路径，含 `1.2.1` 小节号、百分号编码、查询串；拒绝换主机、`..`/`%2e%2e`、空段、静态页、PATCH、超长）、Set-Cookie 解析、登录后带 cookie、非登录接口的 Set-Cookie 不接收、断网退出也清本地、**退出后晚到的登录响应不会把人登回去**、**旧代 401 不清新登录**、密码错（`INVALID_CREDENTIALS`）不清登录、超大请求体本地拒绝、不跟随重定向、取消、过期 token 不恢复。两条 generation 测试做过反证：去掉判断后两条都失败。

**App 端到端**（本机 `wrangler dev` + 本地 D1，测试身份，App 里跑真实页面）：

| 场景 | 结果 |
|---|---|
| 首启未登录；7 种越权消息（换主机、绝对 URL、`%2e%2e`、静态页、PATCH、错协议版本、缺 requestId） | 全部 `rejected`，未发出 |
| 个人学习者注册 + 验证 → 独立 `/auth/me` | learner；页面 `document.cookie` 里没有会话；钥匙串有 token |
| 重启 App | 仍登录；页面自己启动后 `configured`、同步引擎在跑 |
| 未登录时的内容 | 账户面板问「要并入吗」（与网页一致），点「并入」后编辑 2 秒到服务端 |
| 浏览器同账号登录 | 看到 App 写的行；浏览器改一行 2 秒到服务端；App 重启后拉到 |
| 两边同时改 Main（App 停同步模拟断网） | 本地版留在 Main，浏览器版落成「Main（云端副本）」，两边都不丢 |
| 学习者 → 老师（注册、建班、建学生）→ 学生（激活、读作业、退出再登）→ 密码输错 → 学习者 | 每步独立 `/auth/me` 身份正确；输错密码后是未登录，不残留 |
| 退出 → 重启 | 未登录，钥匙串为空 |
| 登录页按界面点选登录 → 重启 | 登录态保持 |
| App 内注册成功提示（模拟生产不回 token） | 显示「在浏览器里点链接 → 回来用密码登录」，「去登录」回到表单且保留邮箱和身份 |
| 9 个页面重跑 | 0 报错 |

**过程中抓到的一个 bug**：第一轮端到端里账户面板显示「已登录」，同步却从不启动——`cloud-client.js` 末尾初始化时「`origin()` 为空就判无云端」，App 每次载入都被判成 absent。第一阶段没发现，是因为测试脚本自己调了 `restore()`（带 `probe`，绕过 absent），掩盖了页面自己的启动路径；之后每个阶段都先记录页面启动后的状态再动手。

**没做到的**：生产环境未验证（需授权）；真实邮件链接 → 浏览器 → 回 App 登录这一圈只能在生产走；A→B→A 只核对了身份，没有逐项核对队列分桶（那是现有 JS 逻辑，未改动，由现有测试覆盖）；响应体 16 MB 上限未用真实班级数据量过；开发版每次重新签名后，钥匙串里的旧条目再读时系统可能弹窗询问（本轮测试前后都清空了，没有触发）。
