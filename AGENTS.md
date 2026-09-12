# SeedToCode / CAIE 9618 开发协作说明

本仓库目录仍名为 `PseudocodeEditor`，产品名是 **SeedToCode**。它是面向 CAIE 9618（2027–2029）的浏览器伪代码编辑器、AST 解释器、本地优先教学平台，以及可选的 Cloudflare 云端同步、班级和作业系统。

本文件服务于在此仓库工作的代理与开发者：先定位事实来源和边界，再做最小、可验证的改动。不要把历史计划、提交记录或旧的 handoff 文档当作当前状态。

## 开始前

1. 先查看 `git status --short`、当前分支和相关文件的未提交 diff。工作树常常同时有其他人的改动；除非任务明确涉及它们，否则不修改、不格式化、不回退。
2. 当前能力与未完成项只以 `PROJECT_STATE.md` 为准；它只保存当前事实，不能往里面写历史、变更过程、日期或下一步计划。
3. 按任务选读权威文档，而不是盲目修改实现：
   - CAIE 语言规则：原始 `pseudocode_guide-9618.pdf`、`syllabus-9618.pdf` → `CAIE_RULES.md` → `runtime-conventions.md` → `LANGUAGE_SPEC.md`。
   - 教学：`teaching/README.md`、`teaching/07-HANDOFF.md`、`teaching/02-CONTENT_SPEC.md`、`teaching/03-EXERCISE_SPEC.md`。
   - 本地存储、认证、同步、云端执行或班级作业：`CLOUD_ARCHITECTURE.md`。
   - 任意 `web/` 改动：**完整阅读** `FRONTEND_RULES.md`，它是验收规范而非建议。
4. 不要泄露或打印 `.dev.vars`、cookie、令牌、激活码、真实账号资料、D1 内容或任何其他敏感数据。涉及线上域名、secret、部署或“尚未/待办”状态时，先做低风险的当前验证；不要照抄可能已过时的文档描述。

## 架构地图

### TypeScript workspace

根目录 `package.json` 使用 TypeScript project references 和 npm workspaces。依赖方向应保持单向：

```text
packages/caie-spec
  └─ packages/language (tokenizer → parser/AST → binder/checker/formatter)
       ├─ packages/runtime (纯 AST 解释器与虚拟文件)
       ├─ packages/exercise (特征、输出比对、分层判题)
       └─ packages/teaching-content (课程、参考解、发布数据)

packages/storage     本地存储 facade、迁移、IndexedDB entity
packages/assignment  作业页面共用的纯日期、草稿、校验、汇总逻辑
packages/test-cases  结构化验收语料
```

- `packages/caie-spec/src/index.ts`：关键字、类型、内建函数、稳定规则 ID 的共享定义。
- `packages/language`：公开静态分析入口是 `analyzeSource(source)`；不要把内部函数或纯 UI 高亮器当作权威分析器。
- `packages/runtime`：必须保持 DOM、真实磁盘、网络和任意浏览器 API 无关，才能在浏览器与 Worker 两端复用。执行档 `ExecutionProfile` 区分 `core-2027` 和 `advanced-2027`；未指定时默认前者。
- `packages/exercise`：真实题目判定和 `compareOutputs` 的所在地。精确输出连一个空格也可能影响分数；先比较 actual/expected，再动语法或运行时。
- `packages/teaching-content`：章节权威是 `src/chapter-*.ts` 与课程数据，不是 `teaching/` 下的预览或旧底稿。浏览器入口 `src/browser.ts` 会剥离参考解后发布内容。
- `packages/storage`：`CAIEStorage` 统一处理兼容快照、旧 `localStorage` key 与 IndexedDB 镜像。不要绕开它自行拼业务 key。
- `packages/assignment`：页面共用的纯逻辑必须继续在这里维护；不要在 `assign-page.js` 与 `teacher-app.js` 各复制一份规则。

### 浏览器层

`web/` 是不依赖框架的静态 HTML/CSS/JavaScript 层：

- `lab.html` 是编辑器，`learn.html` 是课程页，`task.html` 是独立做题页；认证、老师班级、出题、学生作业分别在 `login.html`、`classes.html`、`assign.html`、`assignments.html`、`custom-task.html`。
- 手写逻辑位于 `web/js/*.js`，采用页面加载顺序和 IIFE/global 的方式，不是 ES modules。公共边界包括 `window.CAIEEngine`、`window.CAIERuntime`、`window.CAIEExercise`、`window.CAIETeaching`、`window.CAIEStorage`、`window.CAIEAssignment`。
- `web/js/language-engine.js`、`runtime-engine.js`、`exercise-engine.js`、`teaching-content.js`、`storage.js`、`assignment-core.js` 是根目录 `npm run build` 从 TypeScript 打出的浏览器产物。改对应源代码后必须重建，并将产物与源码一起纳入同一变更；不要手改这些产物。
- `web/js/language-adapter.js` 负责将技术诊断转换为学生能行动的中文引导。面向学生的文字应解释学习任务、规则和下一步，不炫耀内部引擎。
- 共用 JS/CSS 的查询版本号要在**所有引用页面**同步更新；只更新其中一个页面会造成缓存下的分叉行为。
- 双击本地 HTML 仍是支持场景。页面链接使用带 `.html` 的相对路径；线上由 Worker Assets 映射到无后缀路径。涉及当前页面判断时同时兼容两种 URL 形式。
- `web/js/` 延续所在文件的 ES5 风格（`var` / `function`），`packages/` 使用现代严格 TypeScript；注释、文档和面向使用者的文案写中文。注释应解释原因与已知陷阱，不删掉这类设计理由。

### 服务端与云端边界

`server/` 是 Cloudflare Worker + D1：`src/index.ts` 只做同源路由与 HTTP 边界，`auth.ts` 处理身份，`sync.ts` 处理项目/文件，`run.ts` 执行快照，`teaching.ts` 处理教学、班级、作业和服务端重判；schema 变化必须使用按顺序新增的 `server/migrations/` SQL migration，绝不改写已应用 migration。

- 角色只有 `teacher | student | learner`。学生登录身份和老师显示名是不同概念；不要把学生混同为自主注册的 learner。
- 会话 cookie 是 HttpOnly；浏览器只保存 `/auth/me` 返回的公开身份。前端 API 只走页面自身 origin 的 `/auth/*` 与 `/api/*`，不得为本地便利而放宽跨源 cookie 策略。
- 云端运行只执行请求携带的 immutable snapshot；`projectId` 仅用于授权/归属，不能让服务端重读某个已存项目。
- 作业或练习提交只可上传答案和必要上下文。分数、通过状态和教师可见结果必须由服务端通过 `packages/exercise` 重算，绝不信任客户端的 `score`、`passed` 或类似声明。
- 同步是增强能力：断网、未登录、API 未配置或同步失败都不能阻断本地编辑、学习、做题或本地运行。冲突保留本地内容并建立“云端副本”；删除通过带 revision 的 tombstone；教学完成状态单调合并，阅读位置只同步章节/小节，`scrollTop` 保持设备本地。
- 账号切换是安全边界。属于上一账号的数据、或尚未明确并入账号的访客数据，必须维持 `hold`：可以本地读写和本地执行，但不能上传、同步或云端运行。该处一律 fail closed。

## CAIE、运行时与教学内容的约束

- 只支持 Guide/考纲允许的 CAIE 语法。常见但非标准的写法不是兼容性需求；不要为了“好用”而接受它。
- 必须明确区分 CAIE 规定和 Editor Runtime convention。Guide 未定义而运行器必须决定的行为，写入或引用 `runtime-conventions.md`，不能伪称为 CAIE 规则。
- 源程序使用 UTF-8 `.pseudocode`；`.txt` 仅为导入/导出兼容。源代码文档与运行时虚拟 `.txt`/`.dat` 文件属于不同模型。
- 新的静态诊断要优先给出根因并抑制派生 parser 噪声。对学生应给出可操作的 Guidance；语法分析通过不等于运行时可执行。
- 新教学文案、示例与“必须/不应”说法都必须能追溯到上述权威层。示例必须经过真实语言分析，写代码的题必须走真实分析器、运行时与判题核心。
- 锁定的 `lockedStarterCode` 不能放进学生可编辑区；`verifyChapter()` 是课程级保护。章节的 `executionProfile`、期望输出生成、浏览器判题和服务端重判要保持一致。

## 前端验收规则

`FRONTEND_RULES.md` 的两条硬规则适用于所有 `web/` 改动：

1. 一次交互只能改变被操作对象自身的外观。状态反馈只用颜色、背景、阴影或透明度；不使用会改变几何尺寸的 border 宽度或 `font-weight`。会出现/消失的错误、徽标、行内操作和状态文字要保留固定槽位；滚动容器使用 `scrollbar-gutter: stable`；`body` 不横向滚动。
2. 禁止浏览器原生交互 UI：不得新增 `alert`、`confirm`、`prompt`、`beforeunload`、`title` tooltip、原生 `<select>`、date/checkbox/range 输入、`<details>`、`<dialog>` 或 HTML5 表单校验。使用现有应用内 modal、toast、tooltip 与自定义控件。唯一例外是隐藏的 `input[type=file]` 由自定义按钮触发。

静态规则由 `tests/frontend-rules.test.ts` 检查，但它无法测量真实布局。改动交互后，必须在真实浏览器实际操作并使用 `FRONTEND_RULES.md` 的几何快照法确认没有无关元素移动；窄屏也要检查。已登记的存量豁免只能按该测试的基线机制逐项修复，不能悄悄扩大豁免。

编辑器使用透明 textarea 与高亮镜像层：选区、查找标记或输入法合成相关改动必须以真实字形测量为准，不能按“字符数 × 固定宽度”假设中文、Tab 或合字的横坐标。

## 验证与变更记录

按改动范围选择最小充分验证，并如实说明尚未验证的层级：

```bash
npm run check                         # 全部 workspace TypeScript 类型检查
npm run build                         # 编译并更新浏览器 bundles
npm test                              # build + server typecheck + 教学快照 + Vitest
npm --prefix server run check         # 仅 Worker 类型检查
node scripts/generate-teaching-expected.mjs --check
git diff --check
```

- 改语言、运行时、判题或教学数据时，至少运行相关测试；会影响共享 bundle 时运行 `npm run build`，常规交付优先运行 `npm test`。
- 改教学题目或参考解后，运行 `npm run teaching:expected` 更新期望输出，再运行验证；不要手写或跳过快照生成。
- 修改 `web/` 后，除自动测试外做真实浏览器检查。使用 `.claude/launch.json` 定义的 `web-static` 或 `seedtocode-dev` 配置启动预览，不要临时用 Bash 启动服务器；后者用于同源 Worker + 本地 D1 联测。纯静态预览不能证明云端能力。
- 改 Worker 路由、认证、同步、运行或 migration 时，做 server typecheck 和对应本地 API/浏览器链路检查。`wrangler deploy --dry-run`、本地 D1、缓存的远端引用都不等于生产部署或生产验证。
- 请求部署时，先在 `server/` 检查远端 migration 状态，再执行 `npx wrangler deploy`；没有用户明确授权，不要部署、写远端 D1 或改变线上配置。
- 不修改源代码以“修正”失败测试的期望；先判断是规范、运行时、输出快照还是测试本身出错。

每次完成任何修改（包括文档）后，在根目录 `updates.md` 追加 UTF-8 的一行记录，格式固定为：

```text
[CodeX][YYMMDDHHmm] 技术性的具体改动、影响范围与验证结果。
```

记录当前这一次所做的事，避免复制敏感信息；如果有未验证项，应写明边界。只有用户明确要求时才更新 `PROJECT_STATE.md` 的当前事实，不把 changelog 塞进去。

## 交付前检查

- 变更是否只覆盖用户请求的文件与范围？是否保留了他人的未提交改动？
- 是否遵从 CAIE → runtime convention → 实现的边界，而没有擅自扩大语言？
- 是否同步了必要的 build bundle、页面缓存版本、测试、教学期望输出或文档？
- 涉及云端时，是否保持本地优先、同源会话、账户隔离、immutable snapshot、服务端重判和 tombstone/冲突语义？
- 涉及 `web/` 时，是否逐项满足 `FRONTEND_RULES.md`，并完成真实浏览器稳定性检查？
- 是否运行并报告了恰当的验证，而没有把静态/本地/dry-run 说成生产成功？
- 是否追加了 UTF-8 的 `updates.md` 技术记录？
