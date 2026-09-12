# Web 编辑器

页面与引擎的当前状态以 [`../PROJECT_STATE.md`](../PROJECT_STATE.md) 为准。本文件说明页面实现；“尚未实现”部分只列当前仍未完成的能力，不记录历史状态。

页面运行时是纯静态资源，可直接双击 `web/lab.html` 打开或启动本地服务。页面之间的链接一律写成带后缀的相对路径（`learn.html`）——双击本地文件时没有服务端，只有这种形式才找得到文件；线上由 Workers Assets 的 `auto-trailing-slash` 把地址栏换成无后缀的 `/learn`，两种用法都成立。判断"当前在哪一页"的地方要同时认两种形状。修改 TypeScript 语言或运行时核心后需要执行根目录 `npm run build`，重新生成浏览器引擎脚本：

```bash
python3 -m http.server 8777 --directory web
```

云端能力只认页面自身的 origin，所以本地联测需要一个同源外壳：`scripts/dev-proxy.mjs` 把 `/auth` 与 `/api` 转发给 `wrangler dev`，其余按静态文件返回。端口和转发目标都从环境变量读取（`SEEDTOCODE_DEV_PORT`、`SEEDTOCODE_API_TARGET`），脚本里没有写死的地址；它只服务本机开发，不属于产品运行时。

```bash
node scripts/dev-proxy.mjs
```

没有这个外壳时页面同样可以直接打开：`CloudClient` 会停在“云端功能暂未连接”，本地编辑、学习、做题和本地运行不受影响。

## 目录

| 文件 | 职责 |
|---|---|
| `lab.html` | 实验室（编辑器）布局骨架：顶栏、代码文件栏、编辑器、结果面板、状态栏、对话框 |
| `SeedToCode_favicon.png` | 站点图标，同时作为顶栏 `.brand-logo`（26px）。256×256，仓库根目录留有 1254×1254 原图 |
| `css/styles.css` | 低饱和中性色主题，浅色/深色变量 |
| `js/caie-spec.js` | CAIE 9618 关键字、类型、内置函数、块配对表、结构模板（规则基线） |
| `js/language-engine.js` | 从 `packages/language` 生成的 IIFE 浏览器语言核心 |
| `js/language-adapter.js` | 结构化诊断的中文消息、范围及 TextEdit 页面适配 |
| `js/runtime-engine.js` | 从 `packages/runtime` 生成的 IIFE 阶段 4 解释器 |
| `js/lang.js` | 不改变源代码的轻量语法高亮 |
| `js/samples.js` | 新建项目的初始源文件（Main / BubbleSort / FileCopy）与运行时虚拟文件（Names.txt / Report.txt），另含历史样例快照 `legacy`，供「项目是否一个字没改过」的判断识别老设备上的旧出厂内容 |
| `js/app.js` | 界面逻辑：项目、编辑器、文件管理、诊断展示、真实运行 |
| `js/tooltip.js` | 共用的自定义悬浮提示：页面一律用 `data-tip`，不用原生 `title` |
| `js/storage.js` | `CAIEStorage` 浏览器存储 facade：旧 key 兼容读取、IndexedDB 初始化、迁移镜像、云端相关 key 和 `deviceId()` |
| `js/auth-store.js` | `AuthStore`：只保存 `/auth/me` 返回的公开身份，不保存任何登录凭据 |
| `js/cloud-client.js` | `CloudClient`：API 定位（同源 `/auth` 与 `/api`）、`credentials: "include"` 请求、错误归一、会话状态 |
| `js/sync-queue.js` | `SyncQueue`：待上传操作的本地持久化、幂等 `operationId`、退避重试与不可重试项 |
| `js/sync-engine.js` | `SyncEngine`：pull / push / 冲突；项目与教学两个适配器由对应页面注册 |
| `js/account-ui.js` | 顶栏主导航（实验室 / 学习 / 作业 \| 班级，按身份出）与账户入口：自行插入现有顶栏，身份、同步状态、作业概览、退出 |
| `css/account.css` | 账户面板与题目草稿冲突提示的样式，不改动既有版式 |
| `learn.html` + `js/teaching-app.js` | 教学页：课文、关卡、进度；题目位置只放入口卡 |
| `task.html` + `js/task-page.js` + `css/task.css` | 独立做题页：左题面 / 右作答，左右各自滚动 |
| `js/teaching-task.js` | 两个教学页共用的题目实现：题面、作答区、判题、进度、草稿 |
| `custom-task.html` + `js/custom-task-page.js` + `css/custom-task.css` | 老师自出题的做题页：题面、提示、编辑器、运行、提交，不判分 |
| `assignments.html` + `js/assignments-page.js` + `css/assignments.css` | 学生的作业页：每道题的状态、老师给的分与评语 |
| `login.html` + `js/login-page.js` + `css/login.css` | 独立登录页：先问登录还是注册，再选身份（学生 / 老师 / 个人学习者），最后才是对应的表单；三步共用一个高度受控容器，换屏做一次短过渡 |
| `classes.html` + `js/teacher-app.js` + `css/teacher.css` | 老师面板：班级、学生与激活码、教学进度矩阵、章末大题提交记录、作业列表与作业详情（左栏题面、右栏提交矩阵） |
| `assign.html` + `js/assign-page.js` + `css/assign.css` | 布置 / 编辑一份班级作业：左侧大纲、右侧逐题写题面和提示，自定义日期选择器，本地草稿 |

## 语言规范文档

- `../CAIE_RULES.md`：CAIE 规则、规则强度、来源页码与诊断级别。
- `../runtime-conventions.md`：指南未定义的确定性执行约定。
- `../LANGUAGE_SPEC.md`：token、语法、AST、类型、诊断与模块接口。
- `../TEST_CORPUS.md`：合法、非法、边界与回归测试语料。

页面已使用真实语言引擎完成诊断、运行前阻断检查、问题定位、自动修复和格式化；`js/caie-spec.js` 继续只服务界面高亮、模板和编辑辅助，不承担诊断。

## 已实现

- 三块可收起布局；窄屏侧栏变抽屉。
- 语法高亮、行号、当前行高亮、当前行标记。
- 缩进：Tab 插入三空格，Shift+Tab 与退格都按三空格层级回退（对齐到最近的停靠点，不是一次删一个空格），多行选区可整体缩进/反缩进。
- 回车按块结构自动缩进并补全 `ENDIF` / `NEXT i` 等结束符（已存在结束符时不重复插入）。
- 自动配对括号与引号：有选区时包裹选中内容并保留选区；退格删左符号时一并删右符号；右侧紧跟单词时不自动补全；字符串与注释内不触发。
- `<-` → `←` 自动转换，字符串与注释内保持原样。
- 所有程序化编辑（Tab、自动缩进、配对、格式化、修复、替换、插入结构）都通过 `execCommand` 写入浏览器原生撤销栈，Ctrl+Z / Ctrl+Shift+Z 可逐步回退。
- 输入法（中文）合成期间不接管按键，粘贴时把制表符转成三空格并统一换行。
- 结构模板（Ctrl+Space）、查找替换（Ctrl+F，匹配在编辑器内自行绘制高亮，输入焦点始终留在查找框）、格式化、撤销重做。
- 语法检测开关：关闭时不显示任何波浪线、问题数量与诊断。
- 诊断三级（阻断错误 / CAIE 规范 / 建议）：等级用实心圆徽章 + 彩色等级标签 + 4px 左侧色条区分，建议使用冷色系与两种暖色拉开距离；面板顶部有计数筛选条，可单独查看某一等级。附来源标签（`CAIE` / `Editor Runtime`）、跳转与安全自动修复。
- 运行：存在阻断错误时拦截并打开问题面板；阶段 4 在阶段 3C 的过程、函数和调用栈之上，真实执行 READ/WRITE/APPEND 文本文件、EOF，以及 1-based RANDOM 文件的 SEEK/GETRECORD/PUTRECORD。运行基于文件快照，只有正常结束才提交；停止、错误和资源超限均完整回滚。
- 结果面板四标签：输出 / 问题 / 变量（含调用栈）/ 文件（运行时虚拟文件与打开的 handle）。标签是带边框的按钮而不是裸文字，选中态只换边框色与底色、边框宽度恒为 1px，切换时尺寸不动；幽灵按钮（`.btn-ghost`）同样画出边框，静止时也能看出是可点的。
- 代码文件的新建、切换、重命名、删除（二次确认 + 短时撤销）、导入、下载（可选 `.pseudocode` 或 `.txt`）、批量导出。
- 项目：左侧栏顶部显示当前项目；支持新建、切换、重命名和删除项目；每个项目独立保存代码文件与运行时虚拟文件；课文带入的代码集中在专用“课文文件”项目中。
- 重名保护：文件名比较不区分大小写；**代码文件连后缀一起忽略**（`Main.pseudocode` 与 `Main.txt` 视为同一个名字），运行时数据文件按全名比较（伪代码用 `"Names.txt"` 这样的完整字面量打开文件，`.txt` 与 `.dat` 是两个文件）。新建与重命名在弹框内联提示，导入与拖拽自动编号为 `Name (2).ext`。
- 两个文件面板的标题栏都有「导入」与「新建」两个按钮，导入按钮各自限定后缀（代码 `.pseudocode/.txt`，运行时 `.txt/.dat`）。
- 拖拽导入按落点区分：拖到**左侧代码文件栏**直接作为代码文件，拖到**右侧结果面板**作为运行时数据文件（`.txt` 按行、`.dat` 按每行一条 JSON 记录），拖到**中间编辑器**弹二级窗口询问按哪种处理。支持多文件同时拖入，浮层文案与目标区域高亮随落点实时切换。
- 运行时虚拟文件：点击文件行打开二级界面，默认「预览」按行号列出内容（随机文件按记录位置），切到「编辑」再修改；新建、删除（二次确认）、重置。文件名在运行时不区分大小写并拒绝路径/URL；handle 表实时显示模式与位置。
- 设置：主题、字号、行号、`<-` 转换、自动缩进、自动配对、清除本地数据。设置与语法检测开关属于偏好，静默写入本地，不触发文档的「保存中」状态。
- 本地持久化：页面通过 `CAIEStorage` 访问；旧 `localStorage` key 作为兼容来源并镜像到 IndexedDB，刷新后恢复。最终纯 IndexedDB entity 读取仍在计划中。`deviceId` 是浏览器安装首次生成并持久化的随机 UUID，只用于 `updatedByDevice`、`operationId` 和冲突来源，不使用设备指纹。
- 账户与云端（可选，不登录不影响任何本地能力）：顶栏右侧的账户入口支持老师/个人学习者邮箱密码登录与首次注册邮箱验证，以及学生的 `username + activationCode` 首次激活和用户名密码登录；页面读到 URL 中的 `authToken` 后立刻用 `history.replaceState` 抹掉再校验。未配置 API 时入口只说明“云端功能暂未连接”。
- 个人项目同步：登录后首次 pull，之后本地每次保存触发一次差异计算并进入持久化队列。只同步代码文件与运行时文件；`activeId`、当前项目、滚动位置和编辑器偏好不上传。本地新建、改名、编辑、删除立即完成，同步在后面异步执行，失败不阻止本地任何操作。
- 冲突与删除：版本冲突时保留本地内容，并按现有命名规则把服务端版本作为同一项目内的“（云端副本）”文件放进来，不做弹窗式合并；删除以带 revision 的 tombstone 上传，服务端 tombstone 只在本地未修改时才删除本地文件，本地改过的会在新的服务端 id 下重建。超过服务端上限时明确显示“文件过大”，不伪装成服务器繁忙。
- 云端运行：保留“运行”按钮为本地运行，云端运行是“更多”菜单里的可选动作，未登录时提示“登录后可使用云端运行”。请求携带编辑器内存中的 immutable snapshot（不等同步完成），`projectId` 只用于归属；输出、变量、错误和虚拟文件变更复用既有结果面板；运行时文件变更先写回本地再进同步队列。收到 `SERVER_BUSY` 只显示“服务器繁忙，请稍后再试”，不显示任何额度信息；云端失败不影响本地文件和之后的本地运行。
- 教学数据同步：完成状态只向“已完成”单调合并，绝不上传“未完成”，章末大题（`sectionId` 为 `chapterTask`）与普通小节一样同步；阅读位置只同步 `chapterId` 与 `sectionId`，`scrollTop` 保持设备本地；题目草稿按 `章号/题号` 同步，冲突时保留本地并把云端那一份存成可恢复草稿，作答区顶部出现一行提示由学生自己选择。章末大题每按一次「提交」都会留下一条不可变记录供老师查看：只上传答案内容，分数由服务端重新判分，客户端算出的结果只用于当场展示；断网时记录进队列，恢复后按提交顺序补传，判题和作答全程不等它。

## 全局交互原则的落实

> 规则本身在仓库根目录的 [`FRONTEND_RULES.md`](../FRONTEND_RULES.md)（规范性，含检查清单和验证方法）。
> 下面这一段是**现状记录**：已经按那两条做到了哪些。两者冲突以 `FRONTEND_RULES.md` 为准。

**布局稳定性**（交互只改变被操作对象本身）

- 固定槽位：运行/停止共用 `--run-slot-w` 宽度槽；保存状态、光标位置、查找计数、文件大小、问题计数、标签徽标都有固定宽度并使用 `tabular-nums`；错误提示、handle 表格、对话框说明文字都有常驻高度。
- 出现与消失改为切换 `opacity` / 颜色，而不是删除布局节点：文件行的重命名与删除按钮常驻占位；问题计数为 0 时只变透明；标签徽标为空时保留 16px 槽位。
- 悬停、选中、聚焦只改变 background / color / box-shadow / opacity；选中态用 `box-shadow: inset` 画边线，不使用 border 宽度变化；焦点环用 `box-shadow` 与 `outline`，不挤压相邻元素。
- 查找栏浮在编辑器之上（绝对定位），不再把编辑区往下推；输入行常驻，等待输入时只换底色与可用状态，控制台高度不变。
- 所有滚动容器使用 `scrollbar-gutter: stable`；`body` 不滚动，弹层为 `position: fixed`，打开时背景不横向跳动。
- 动效只用 `opacity` 与 `transform`，时长 0.12–0.15s。

**不使用浏览器原生交互界面**

- `prompt()` → 自定义 Modal + Input（新建、重命名代码文件；新建运行时文件），带常驻高度的内联校验。
- `confirm()` → 自定义 Confirm Dialog（清除本地数据）；删除代码文件用短时撤销 Toast。
- `alert()` → 应用内 Toast / 内联错误（例如随机文件 JSON 解析失败）。
- 原生 `title` tooltip → 自定义 Tooltip（`data-tip`，350ms 延迟，只做 opacity 过渡）。
- 原生 `<select>` → 自定义分段控件（主题）；原生 `range` → 自定义步进器（字号）；原生 `checkbox` → `role="switch"` 自定义开关。

## 尚未实现（按计划）

- Advanced 特性的运行时执行（枚举、指针、集合、OOP）。
- 单步调试与 Dry Run。
- 页面完全切换到 IndexedDB entity 读取。
- Cloudflare Workers 与远端 D1 已部署并联测；老师和个人学习者首次注册需要生产 Resend 邮件验证，之后使用邮箱和密码登录。
