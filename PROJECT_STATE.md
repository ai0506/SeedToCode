# Project State

本文档只保存项目当前事实，不保存历史记录、变更过程、日期或下一步计划。

状态含义：

- `Complete`：该范围已实现，并属于当前可用能力。
- `Production`：该教学内容已接入当前课程页面、题目流程和真实引擎校验。
- `Static analysis complete`：已完成静态分析支持，但运行时尚未完成对应执行能力。
- `Planned`：已纳入范围，但当前尚未上线。

## Language

| Area | Status |
|---|---|
| Core | Complete |
| Records | Complete |
| Enums | Complete |
| Pointers | Complete |
| Sets | Complete |
| OOP | Complete |

## Runtime

执行档（`ExecutionProfile`）决定哪些特性可以执行：`core-2027` 只放行 AS 范围，`advanced-2027` 放行下表全部。**未指定时默认 `core-2027`**，A Level 特性会得到 `RT1106` 预检错误。

| Area | Status | 需要的执行档 |
|---|---|---|
| Core | Complete | `core-2027` |
| Control flow | Complete | `core-2027` |
| Routines（含递归） | Complete | `core-2027` |
| Text files | Complete | `core-2027` |
| Random files | Complete | `core-2027` |
| Enums | Complete | `advanced-2027` |
| Pointers | Complete | `advanced-2027` |
| Sets | Complete | `advanced-2027` |
| OOP（构造器、继承、`SUPER`、多态、聚合） | Complete | `advanced-2027` |

## Teaching

| Area | Status |
|---|---|
| Ch1 | Production |
| Ch2 | Production |
| Ch3 | Production |
| Ch4–16 | Production |
| Ch17–23 | Planned |

> 运行时已能执行 Chapter 17–23 所需的全部特性；执行档按章声明（`Chapter.executionProfile`，省略即 `core-2027`），期望输出生成、内容校验、浏览器判题与服务端重判四条链路均已接通。见 [`teaching/07-HANDOFF.md`](teaching/07-HANDOFF.md) 3.16。

## Product and local storage

| Area | Status |
|---|---|
| SeedToCode product naming | Complete |
| Single-project to multi-project UI | Complete |
| Project create/switch/rename/delete | Complete |
| Dedicated lesson-files project | Complete |
| Storage facade (`CAIEStorage`) | Complete |
| Legacy localStorage migration mirror | Complete |
| IndexedDB entity initialization | Complete |
| Persistent random `deviceId` | Complete |
| Page reads fully from IndexedDB entities | Planned |
| Cloudflare Worker/D1 local scaffold | Complete |
| Auth API | Complete |
| Personal project sync API | Complete |
| Cloud run API | Complete |
| Teaching progress API | Complete |
| Practice submission API（章末大题） | Complete |
| Teacher/class/assignment API | Complete |
| 班级码自助入班与锁定 | Complete |
| 自出题作业条目 API | Complete |
| 老师手动评分与评语 API | Complete |

## Cloud client (pages)

| Area | Status |
|---|---|
| `CloudClient` / `AuthStore` | Complete |
| `SyncQueue`（持久化、可重试） | Complete |
| `SyncEngine`（pull / push / conflict） | Complete |
| 账户入口（邮箱/密码、首次邮箱验证、学生激活与登录） | Complete |
| 独立登录页与安全回跳 | Complete |
| 个人项目与文件同步、冲突副本、tombstone | Complete |
| 云端运行（内存快照、结果复用现有渲染） | Complete |
| 教学完成状态、阅读位置、题目草稿同步 | Complete |
| 章末大题提交记录（服务端判分、教师可读） | Complete |
| 老师面板（班级、学生、进度、章末大题提交） | Complete |
| 老师布置、编辑与删除作业 | Complete |
| 老师查看作业提交与迟交标记 | Complete |
| 学生作业清单与作业提交 | Complete |
| 自出题作业编辑器、运行与提交 | Complete |
| 老师手动评分、评语与学生查看 | Complete |
| 本地数据归属与换人登录保护 | Complete |
| Cloudflare Workers 与远端 D1 部署 | Complete |
| Resend 生产邮件真实投递验证 | Complete（使用者已用真实邮箱收到验证信） |
| 自定义域名 `seedtocode.example.invalid` | Complete |
| `web/` 前端层自动化测试 | 部分：规则检查与纯逻辑已覆盖，页面交互仍靠手测 |
| 找回密码接口（老师/个人学习者） | 有意不做，见 `CLOUD_ARCHITECTURE.md` §4 |

说明：当前页面已经通过 `CAIEStorage` 统一访问本地存储，并将 editor/teaching 旧数据镜像到 IndexedDB；为保证同步启动和 `file://` 兼容，页面读取仍使用兼容快照，尚未完成“完全由 IndexedDB entity 读取”的最终切换。多项目当前由编辑器的 `seedtocode.projects.v1` 注册表保存，教学数据仍按独立旧 key 通过 facade 访问。`deviceId` 是浏览器安装首次生成并持久化的随机 UUID（localStorage 为准，同一个值补写进 IndexedDB meta），不使用设备指纹。

页面已接入云端：登录不是使用编辑器的前提，未登录、未配置 API、断网或会话失效时，本地编辑、保存、学习、做题和本地运行全部照常，且不启动同步队列。云端能力只认页面自身 origin（认证 `/auth/*`，其余 `/api/*`），会话为服务端写入的 HttpOnly cookie，页面只保存 `/auth/me` 返回的公开身份。同步队列持久化在本地，刷新与关闭页面不丢；队列只记录实体标识，内容与 `expectedRevision` 都在发送前从本地读取。项目同步覆盖 source 与 runtime 文件，不同步 `activeId`、当前项目、滚动位置或编辑器偏好；冲突保留本地内容并把服务端版本落成同项目内的“（云端副本）”文件；删除按带 revision 的 tombstone 上传，服务端 tombstone 只在本地未修改时才删除本地文件。云端运行执行编辑器内存中的 immutable snapshot，`projectId` 只用于归属；结果复用现有 `ExecutionResult` 渲染，运行时文件变更先写回本地再进队列；`SERVER_BUSY` 只显示统一繁忙提示，超限单独显示“文件过大”。教学完成状态只向“已完成”单调合并，阅读位置只同步 `chapterId`/`sectionId`（`scrollTop` 保持设备本地），题目草稿按 `章号/题号` 同步并在冲突时保留本地、把服务端版本存为可恢复草稿。章末大题的 `sectionId` 为 `chapterTask`，与普通小节一样同步完成状态和阅读位置，并出现在教师可读的班级进度中。章末大题的每一次「提交」还会写入 `practice_submissions` 并保留为不可变记录，教师可读取自己班级成员的答案内容与服务端判定的分数；分数和通过状态只由服务端重新判分产生，不读取客户端上传的值。小节练习题不进入提交记录，仍然只是学生自己的草稿。

`web/classes.html`（线上 `/classes`）是老师面板：左侧班级列表（可新建），右侧三个标签——学生（新建学生并取一次性激活码、重置激活码）、进度（学生 × 章的完成度矩阵）、章末大题（提交记录，可按题号筛选、在「每人最新」与「全部提交」之间切换、查看学生代码）。入口只在账户面板里对老师出现。未登录、非老师、云端未配置时这一页落到一条说明上，不影响其他页面。新建班级和添加学生是带字段标签和说明的表单式弹窗，写明用户名（登录用、3–32 位英文字母数字和 `. _ -`、不区分大小写、建好不能改）与姓名（只用于名单显示、必填、之后可改）的区别。老师可以改学生在名单上的显示名（`PUT /api/classes/:classId/students/:studentId`），用户名没有对应入口——那是登录身份，改了学生就登不进来。

教学进度是每一小节一个带节号的方格（完成填色、章末大题用 ★ 和暖色收尾），而不是一章只给一个汇总数字——老师要看的是「哪一节卡住了」。作业提交由老师手动打分：自动判分不再以分数形式出现（学生可无限重传、界面会指出哪个用例没过，肯改的人必然迭代到满分，那个数字只区分做完与放弃），界面上只留一个「代码跑通了没有」的小圆点，成绩以老师给的分为准；学生在作业清单里能看到老师给的分。

「作业」标签可以布置作业、编辑和删除，并查看提交情况。点进一份作业是左右两栏：左栏是这份作业**本身**——每道题的题面和提示原文、截止时间、「N 道题 · M 名学生 · 已交 x/y 份」；右栏是学生 × 题目的提交矩阵，没交的也列出来，点开看学生代码。左栏原来不存在，老师没有任何地方能看自己出的是什么题，只能点「编辑」进出题页看一眼，那是编辑态、有误改风险；批改时要对照题面判断学生写得对不对，这一栏就是为那件事在的。题目多时：矩阵列头两行（第几题 + 题名，超出省略号、悬浮看全名），行尾一列「这个学生交了几道」，表尾一行「这道题交了几个人」，交齐了才上色；点左栏某道题，右栏对应那一列高亮（只改底色），题目多到要横向滚时这是唯一能把题和列对上的办法。横向不够时先收窄题面栏（≤1060px），再不够改成上下叠（≤840px）。作业删除是 tombstone：师生两侧都不再看到、不能再提交，但已交的答案保留，并在提示条中提供短时「撤销」（与编辑器删代码文件同一套交互），撤销会真正把作业恢复回来——`assignment_submissions` 对 `assignment_id` 是级联删除，真删会连学生已判分的作业一起销毁。编辑时移除某道题，学生之前交的记录同样保留。

布置和编辑作业在独立的 `web/assign.html`（线上 `/assign`），不再是班级面板里的弹窗：一份作业可以有好几道题，每道题有题面和提示两段长文本，弹窗那点高度装不下，写到第三题时第一题已经滚出视野。这一页左侧是大纲（作业信息 + 每道题，点一下跳过去，标题改一个字就同步），右侧是作业标题、截止日期和逐题的卡片。进来时带 `?class=<班级 id>`，编辑再带 `&a=<作业 id>`；「返回班级」「放弃修改」和布置成功都回到 `classes.html?class=…&tab=assignments(&a=…)`，班级面板认这三个查询参数，落回原来的班级、标签和展开的那份作业，成功提示经 `sessionStorage` 的 `caie.flash` 带过去。截止日期用自己画的日期选择器（月格固定 6 行，换月不改高度），原生 `input[type=date]` 这笔欠账随之清掉。离开不拦截：内容按 500ms 防抖写进 `localStorage` 的 `caie.assignDraft.<班级>.<作业|new>`（另存一个 `.at` 时间戳），`pagehide` 和页面转入后台时各补一次，提交成功后清掉。清草稿的三条路（放弃修改、布置成功、改回服务端版本）都不真删，先把那一份挪进 `caie.assignTrash.<同键>`（带时间和原因，保留 7 天）：下次进来若没有草稿可接，就提一句「X 时丢掉的那份内容还留着」并给一个「找回」；已经布置出去的不提，内容在服务端。接回草稿的说明是正文顶上一条常驻的提示条，不是会消失的 Toast——新建作业时它只陈述事实、不带任何抹除按钮（空白没有什么可回退的），编辑已有作业时才给「改回服务端的版本」，并要过一次确认。**这两条是修 bug 修出来的**：上一版里提示条是 6 秒就消失的 Toast，上面挂着一个叫「用原来的内容」的按钮，一点就把接回来的内容全部清空并删掉本地那份、没有退路；而「原来的内容」在新建语境下其实是空白，标签读起来却像「保留我写的」。另一处：`clearDraft()` 清掉的东西会被离开页面时的补存原样写回，导致「放弃修改」等于没放弃、布置成功后再进来还会冒出上一份——现在由 `draftCleared` 闸门挡住，人再动一下才重新打开。校验在提交时自己做——缺标题或题面会指出是第几道题并把光标送过去。删题两道闸门：写过内容的先弹一次确认（空白的直接删），删完再给一条带「撤销」的提示条——确认管的是「别手滑」，撤销管的是「确认完才发现删错了」，撤销把那一条连同它的 id 原样插回原位置，学生已经交在这道题上的答案照样认得它。旧作业里从课程勾选的题目仍然只读展示、可移除，不能新增。


学生这一侧：`web/assignments.html` 是作业页，逐题显示状态、老师给的分和完整评语；顶栏对学生显示「作业」入口（老师对应的是「班级面板」），账户浮层只保留一句概览和一条到该页的链接；做题页顶栏对被布置的题目显示作业标记，老师批改过的话分数和评语直接摆在作答区顶上；做题页顶栏对被布置的题目显示「作业」标记，按一次「提交」同时交一份作业提交。作业提交只送答案内容，分数由服务端用已发布题目重新判分，客户端算出的结果只用于当场展示。断网时提交进同步队列，恢复后补交。截止时间只提示不拦截：过期后仍然可以提交，做题页和作业清单会标明「现在提交算迟交」，老师端在对应格子上显示「迟交」。迟交按当前截止时间现算，老师改了截止时间，之前那些提交的迟交与否也跟着变。

同步元数据记录本地内容属于哪个账号：登录账号与记录不符时，登录前就在设备上的项目、文件、完成状态和草稿会整批挂起，本地照常使用但不上传；未登录时攒下的内容由账户面板问一次是否并入，其余情况不问也不并。**挂起期间账户状态不会说「已同步」**：挂起的内容按设计不进同步队列，`pending` 因此恒为 0，早先的状态文案只看 `pending` 就宣称「已同步」，结果是用户在一台设备上改了半天、界面一路显示「已保存／已同步」，换设备登录却什么都没有。现在有未决定的挂起内容时，状态行直接说「这台设备上的内容还没并入这个账号」，账户按钮同时进入 `attention` 态（只改颜色不改尺寸）——因为「要并入吗」那句提示只渲染在账户浮层里，不给一个点开的理由就等于没问。

服务端项目与文件的 id 均包含本地实体和当前用户短哈希；文件 id 还包含 `projectId`。服务端 `projects.id` 与 `project_files.id` 是全局主键，本地同步元数据也以 `projectId/fileId` 为键，因此 UI 层即使出现跨项目重复 file id 也不会串联。

服务端已有 Worker/D1、认证 API、个人项目同步 API、云端运行 API 和 teacher/class/assignment/progress API，并已部署到生产；老师/个人学习者首次注册时设置邮箱和密码并通过一次邮箱验证，之后使用邮箱和密码登录——注册时密码只挂在一次性 token 上，点过验证链接才写进 `users`，所以拿别人的邮箱发注册请求动不了那个账号；邮箱登录不接受 role，账号自带身份，选错身份不会被当成密码错误；老师可创建班级及 student 并获得一次性 activation code，也可布置多题作业；teacher 可为自己班级的 student 撤销会话、旧密码和旧激活码后返回一次性新 activation code。邮箱验证、学生激活和学生登录均按标识符限流。student 只能读取自己的班级作业并提交答案，老师只能读取自己班级成员的进度和提交。作业提交由服务端使用已发布教学题目的 `grade()` 重算，客户端声称的分数/通过状态不会被读取或保存。教学位置只保存 `chapterId` 与 `sectionId`，按最后写入取胜，`scrollTop` 不上传；个人练习草稿已有 revision 条件写入、`operationId` 幂等重试和包含服务器草稿的 409 冲突响应。已登录用户可通过项目/文件 revision 条件写入、`operationId` 幂等重试和 tombstone 删除同步个人项目。写入类的云同步接口和云端运行都先过一次 `service_config` 里的免部署开关（缺行或读失败按开启处理，isolate 内缓存 30 秒）：改一行 D1 就能关掉某项云端能力，读取不受影响，本地编辑和运行完全不受影响。云同步的拉取接口顺带返回账户用量（项目数与字节数及各自上限），客户端**只在达到 80% 时**在账户浮层提示一句，平时不占界面空间。云端运行会先验证 immutable snapshot 和虚拟文件，再记入隐藏额度账本并执行既有 CAIE runtime；输入、快照和执行资源均有服务端限制，账本耗尽时只返回通用繁忙提示。页面已接入认证、个人项目同步、云端运行、教学进度/位置/草稿、老师班级/学生/作业/提交记录页面和学生作业清单；生产邮件三个 secret 已配置，往真实邮箱的投递也已确认（见下文「生产邮件」段）。**目前没有找回密码接口，这是有意的**：常规的「输入邮箱→我们发信」允许任何人拿别人的邮箱反复触发，既骚扰无辜者也烧 Resend 额度。计划改成入站方向——用户主动发信到本域，我们回一封带一次性重置链接的信，邮箱控制权在请求发生时就被证明了。设计与代价写在 `CLOUD_ARCHITECTURE.md` §4「找回密码」。在此之前，老师和个人学习者忘记密码只能改库（学生由老师重置激活码，不受影响）。旧 magic-link 账号（`status` 为 `active` 但没有 `password_hash`）可以走「注册」补一个密码，但必须点自己邮箱里的验证链接才生效，这条路同时充当它们的迁移通道。本地开发使用 `scripts/dev-proxy.mjs` 提供同源外壳（`/auth` 与 `/api` 转发给 `wrangler dev`，其余为静态文件），它只服务本机联测，不属于产品运行时。登录在独立的 `web/login.html`，三步：先问「你有账号吗」（登录 / 注册），再选身份（学生 / 老师 / 个人学习者），最后才是对应的表单。老师和个人学习者两条路共用同一套邮箱密码字段，由第一步决定是登录还是注册；学生登录用用户名密码，学生注册在同一屏内用分段控件切「用户名和激活码」与「一个班级码」。激活码为 6 位无歧义字符，不区分大小写。班级码形如 `ABC123`（三字母 + 三数字），每位老师最多 5 个班级，服务端校验、前端到上限时把「新建班级」置灰。登录页对学生按他实际拿到的东西描述，不用「激活码」「班级码」这类术语；每一步都能用「上一步」退回去。激活码校验会同时尝试归一化后的形状和原样输入，早先发出的长格式码不会因为格式变更而失效。

老师可以随时锁定班级的自助注册（面板顶部班级码旁的锁形开关，悬浮有自定义说明）：锁上之后凭班级码注册返回「这个班级暂时不能加入」，老师自己创建学生和已在班里的学生都不受影响。这是班级码流出去之后唯一的止血手段——码永不过期也不能换。

学生进班有两条路并存：老师建号发一次性激活码，或老师念班级码、学生自己注册（姓名 + 用户名 + 密码，不需要邮箱，注册完直接在班里）。自助注册按来源 IP 限流且只有失败计数。个人学习者不参与班级。顶栏的账户浮层不再承载任何表单——未登录时点它直接去登录页并带上 `next`，登录完跳回原来那一页（`next` 只接受同目录下的 `xxx.html`，外站和绝对路径一律丢弃）；浮层只负责已登录之后的事：身份、同步状态、作业概览、退出。跨页导航不在浮层里：四个一级目的地（实验室 / 学习 / 作业 / 班级）由 `account-ui.js` 渲染成品牌右边的一组分段控件，当前页是浮起来的那一枚且渲染成 `span` 而非 `a`；「作业」只对学生出、「班级」只对老师出，没有对应身份时那一枚仍占着同样宽度（两个词都是两个字），所以 `/auth/me` 回来前后顶栏几何不变。做题页（`task` / `custom-task`）是沉浸式子页，不放这组导航，左上角的「‹ 返回课文」「‹ 我的作业」就是它们的导航。

已部署到 Cloudflare Workers：`https://seedtocode-api.example.invalid`（最近一次 Version ID `3fe7113d-fdf1-48e7-b373-0557631721bd`，含独立的布置作业页 `/assign`、老师端作业详情两栏、草稿回收站、`packages/assignment` 的浏览器打包，以及编辑器选区按真实字形定位、输入法合成期间显示拼音、同步元数据迁移幂等三项修复），绑定远端 D1 `seedtocode`（`00000000-0000-0000-0000-000000000000`），14 个 migration 已应用（0010 账户配额、0011 服务端限流、0012 回收已删除内容占的字节、0013 免部署的服务开关）（`0009_email_pending_password` 给 `auth_tokens` 加了待定密码两列）。`ENVIRONMENT` 为 `production`，一次性登录 token 不再回给调用方，会话 cookie 带 `Secure`。静态页由同一个 Worker 用 Workers Assets 同源托管；地址栏是无后缀形式（`/lab`、`/learn`、`/classes`），而页面里的链接仍写成 `learn.html`，因为双击本地 HTML 文件时只有带后缀的相对路径找得到文件。页面改名（编辑器 `/` → `/lab`、`/teaching` → `/learn`、`/teacher` → `/classes`）之后，旧地址由 Worker 做 301：`/`、`/index`、`/index.html` → `/lab`，`/teaching(.html)` → `/learn`，`/teacher(.html)` → `/classes`，查询串原样带走。这些路径能落到 Worker，是因为 `web/` 下已经没有同名文件，资源服务匹配不到才会走过来。

生产邮件：`RESEND_API_KEY`、`EMAIL_FROM`、`APP_ORIGIN` 三个 secret 都已设置，Resend **接受发信**。早先记的「投递失败、可能是发件域未验证」是**错的结论**：当时那次测试用的是 `@example.com` 地址，而 Resend 对这个 RFC 保留域名一律拒收，报的是 `422 validation_error / Invalid \`to\` field`——拒的是收件方，和发件域、API key 都没关系。改用 Resend 官方的测试收件地址 `delivered@resend.dev` 重试，注册接口返回 `accepted: true`，Worker 日志里没有任何 `resend.send_failed`，说明 API key 有效、`from` 地址也被接受（发件域没验证的话 Resend 会在这一步就拒）。最后一步的真实投递由使用者本人验过：往一个真实邮箱发注册验证信，信确实到达收件箱。（这一条是使用者确认的，不是本仓库的自动化检查能覆盖的——发信要花真实额度，也需要一个真人的邮箱。）

排错能力本身也补上了：`sendVerificationLink()` 以前把 Resend 的回应直接丢掉，线上发不出信时日志里只有一个 503，没有任何线索。现在失败会把 Resend 的状态码和错误原文写进 Worker 日志（`console.error("resend.send_failed", …)`，observability 已开，`wrangler tail` 看得到），给调用方的文案仍然含糊——注册接口匿名可调，不该把配置细节说给任何人听。

另注意 `sendVerificationLink()` 失败时抛出发生在 users/auth_tokens 写入之后，投递失败会留下一行 `pending_email` 用户和一条未消费 token；它们不影响任何人登录，但会占着那个邮箱直到对方重新注册（重新注册会覆盖同一行并重发）。这次两次探测各留下一行，已从远端 D1 删除。

学生的用户名密码登录和班级码自助注册不依赖邮件。未登录的本地编辑、学习、做题和本地运行在线上完整可用；已部署的云端 API 需先完成生产邮箱配置后才能完整开放。已绑定自定义域名 `https://seedtocode.example.invalid`（与 workers.dev 地址指向同一个 Worker，实测 `/health`、`/lab`、`/assign`、`/classes` 均 200）。`APP_ORIGIN` 已确认为 `https://seedtocode.example.invalid`（验证邮件里的链接用它拼，指的是自定义域名，不是 workers.dev）。
