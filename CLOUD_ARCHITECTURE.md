# 云端运行、用户系统与同步架构契约

本文是当前项目从“纯浏览器本地应用”扩展到可选云服务时的第一版边界。未登录用户仍可完整使用本地编辑、教学和本地运行；云端能力不是本地能力的前置依赖。

## 1. 能力分层

| 能力 | 未登录 | learner | student | teacher |
|---|---:|---:|---:|---:|
| 本地编辑、导入导出、本地运行 | 可以 | 可以 | 可以 | 可以 |
| 云端运行 | 不可以 | 可以 | 可以 | 可以 |
| 个人项目云同步 | 不可以 | 可以 | 可以 | 可以 |
| 创建班级、布置题目 | 不可以 | 不可以 | 不可以 | 可以 |
| 查看班级学生教学进度 | 不可以 | 不可以 | 仅本人 | 仅所属班级 |
| 创建学生账号 | 不可以 | 不可以 | 不可以 | 可以 |

服务端用户角色固定为 `teacher | student | learner`：`learner` 是自主注册、需要邮箱、没有 teacher 管理归属的个人学习者；`student` 是 teacher 创建、无需邮箱、拥有独立用户身份、可加入班级并接收作业的学生；`teacher` 通过邮箱注册，可创建班级、student 和作业。学生账号仍不能用“班级成员记录”替代独立用户身份。

## 2. 推荐服务边界

首版可以继续使用现有静态网页，并增加一个独立 API/执行服务：

```text
web/                         现有静态编辑器、教学页
  └─ client sync/auth/run    只负责调用 API，不持有服务端权限

API
  ├─ Auth                     邮箱 magic link 或 OTP、密码登录、会话
  ├─ Projects/Sync            项目、文件、版本、冲突
  ├─ Teaching                 进度、作业、班级权限
  └─ Run                     认证、限额、排队、执行结果

Execution worker              只执行 CAIE AST/解释器，不执行用户 JavaScript
Database                      用户、班级、项目元数据、版本和教学数据
Object storage                大文件或历史版本；数据库只保存元数据和小文件
Email provider                Resend，只从服务端发送一次性链接/验证码
```

部署平台可以在实现阶段确定；无论使用哪一家云厂商，执行 worker 都必须与 API 进程隔离。不能把 `eval`、任意 Node API、真实磁盘或出站网络暴露给用户程序。

## 3. 云端运行契约

### 请求

`POST /api/runs`

请求包含：`projectId`（仅用于权限和归属）、入口代码文件、项目文件的 immutable snapshot、输入序列、客户端生成的 `requestId` 和客户端能力版本。实际执行内容完全以请求携带的 snapshot 为准，不能根据 `projectId` 回读当前项目替代 snapshot；这样本地 revision 12、云端同步仍为 11 时也不会执行旧代码。服务端重新解析和静态检查，不能信任客户端传来的“已通过检查”、步骤数或文件大小。

### 服务端限制

限制按策略版本配置，不返回给客户端额度余额或精确配额。至少包括：

- 单次运行最大步数、活动 CPU 时间、调用深度、输出行数和输出字节数；
- 单文件和项目文件总大小；数组元素数量、虚拟文件数量和输入长度；
- 单用户并发运行数、请求速率和队列等待时间；
- worker 的进程/容器内存、网络禁用、临时目录和最长生命周期。

客户端已有 `steps`、资源超限和虚拟文件回滚语义，云端结果应复用同一套 `ExecutionResult` 形状。正常完成才提交虚拟文件变化；错误、停止、超限和 worker 崩溃都不提交。

### 隐藏额度

额度是服务端内部消耗账本，不在个人中心、运行结果或 API 正常响应中显示剩余量。额度不足、系统保护性限流和短暂排队过载，对用户统一显示“服务器繁忙，请稍后再试”。服务端日志可用内部原因码区分：`quota_exhausted`、`rate_limited`、`capacity_busy`。

恢复由服务端窗口或后台补充策略完成，客户端不自行倒计时、不根据一次响应推断恢复时间。API 应使用统一的非敏感错误结构，例如：

```json
{"code":"SERVER_BUSY","message":"服务器繁忙，请稍后再试"}
```

### 运行结果

返回运行状态、输出、变量/调用栈、虚拟文件变更、步数和可定位的错误行。不要返回内部额度、worker 主机、队列深度或其他用户信息。长时间运行可用 `runId` + 轮询/SSE；首版可先用短请求和轮询，避免把实时传输与同步一起实现。

## 4. 用户与权限

核心表/实体：

- `users(id, email, account_type, status, created_at)`：email 唯一；`account_type` 为 `teacher`、`student` 或 `individual_learner`；不要用含义模糊的 `learner` 覆盖个人学习者和班级学生；
- `auth_tokens(id, user_id, purpose, token_hash, expires_at, consumed_at)`：只存 hash，一次性使用；
- `classes(id, teacher_id, name, join_code, ...)`；
- `class_members(class_id, user_id, display_name, status, ...)`；
- `student_credentials` 不保存明文密码；teacher 创建学生时设置用户名并生成一次性 `activationCode`，学生首次使用 `username + activationCode` 设置密码，激活码失效；
- `assignments(id, class_id, due_at, ...)`、`assignment_items(assignment_id, task_id, position, ...)` 和 `assignment_submissions(...)`；一个 assignment 从第一版起支持多道题；
- `teaching_progress(user_id, chapter_id, section_id, state, score, updated_at, revision)`。

教师只能读取自己班级成员的进度、提交和作业数据；`student` 只能读取自己的班级任务并写入自己的提交；`individual_learner` 只能读写自己的项目、进度和个人练习。所有写接口在服务端再次做角色和资源归属校验，不能只靠前端隐藏按钮。

### 邮箱流程

邮箱注册/登录默认使用 Resend 发送 magic link 或短期 OTP，链接/验证码一次性、短时有效、限速并防止枚举邮箱。`learner` 和 `teacher` 自主邮箱注册并完成验证；`student` 不要求邮箱，由 teacher 创建用户名并获得一次性 `activationCode`。学生首次使用 `username + activationCode` 设置自己的密码，激活码服务端只存 hash、成功后立即失效；之后使用用户名和密码登录，不依赖邮箱。teacher 可以重置密码，但不能读取已保存的明文密码。

## 5. 同步模型

### 数据拆分

项目包含项目元数据、`.pseudocode` 代码文件、虚拟运行时文件、编辑器偏好、教学进度、题目草稿/提交。偏好不必默认跨设备同步；代码、运行时文件、教学进度和题目草稿需要同步。参考课文和题目定义属于发布内容，不作为用户文件覆盖。

现状并没有多项目实体：`web/js/app.js` 用一个 `caie9618.editor.v1` key 保存 `docs`、`runtimeFiles`、`settings` 和 `activeId`。因此迁移不是简单增加一个远端适配器，而是一次本地数据结构迁移：从“单一 blob”切成“项目元数据 + 项目文件 + 用户偏好 + 教学数据 + 同步元数据”。

建议的本地/服务端拆分如下：

| 现有字段 | 新实体 | 默认同步 | 说明 |
|---|---|---:|---|
| `docs[]` | `projects` + `project_files(kind=source)` | 是 | 每个代码文件获得稳定 `fileId`；首个迁移项目可命名为“我的项目” |
| `runtimeFiles[]` | `project_files(kind=runtime)` | 是 | 继续保留 text/records、文件名和内容语义 |
| `activeId` | `project_state.active_file_id` | 否 | 设备视图状态，不应覆盖另一设备当前打开文件 |
| `settings` | `user_preferences` | 否（可选） | 主题、字号、自动缩进、诊断开关等设备/用户偏好独立保存 |
| `GATES_KEY` | `teaching_progress` 的 gate/completion 记录 | 是 | 只允许向“已通过/已完成”方向合并 |
| `POSITION_KEY` | `teaching_position` | 是 | 只同步 `chapterId`/`sectionId`；`scrollTop` 保持设备本地 |
| `ANSWER_KEY` | `practice_drafts` | 是 | 未布置作业的个人练习草稿也必须覆盖 |
| 题目提交/得分 | `practice_submissions` 或 `assignment_submissions` | 是 | 是否属于班级作业决定归属；个人练习不能漏进同步范围 |

迁移必须是可重复、可回滚的版本化流程：首次启动先读取旧 blob，校验并生成一个默认项目及上述分域记录，再写入新本地格式；只有新格式成功落盘后才标记迁移完成。旧 key 至少保留一个版本周期，清除本地数据时一并清除新旧格式。迁移期间不能改变代码内容、运行时文件内容或教学完成状态。

`ProjectStore` 不应只暴露一个 `load/save(state)`，而应按领域提供事务边界，例如 `listProjects`、`readProjectFiles`、`writeFileIfRevision`、`deleteFile`、`readPreferences`、`writeTeachingProgress`、`enqueueSyncOperation`。当前编辑器已经提供多项目的新建、切换、重命名和删除入口，但底层仍处于兼容注册表阶段；最终 entity store 仍按多项目设计，避免再次迁移文件模型。

### 文件版本

每个可同步文件拥有稳定 `fileId`、`projectId`、`revision`、`contentHash`、`updatedAt` 和 `updatedByDevice`。客户端保存本地 `baseRevision`，上传时采用条件写入：

```text
PUT /api/projects/:projectId/files/:fileId
If-Match: <baseRevision>
```

版本匹配时生成新 revision；不匹配时返回 `409 SYNC_CONFLICT`，并同时返回服务器版本的元数据和内容摘要。服务端不得静默覆盖较新的另一台设备内容。

### 冲突处理

- 代码文件：首版不做伪代码语义级合并；保留当前本地副本，下载服务器版本为“冲突副本”，让用户比较后选择合并；
- 文本/记录运行时文件：按整个文件版本冲突处理，避免按行合并破坏记录顺序；
- 教学 gate/完成状态：使用单调状态合并（已完成不会因旧设备回传而退回未完成）；
- 教学当前位置：只同步 `chapterId` 和 `sectionId`，使用 last-write-wins；`scrollTop` 保持设备本地，不上传也不参与冲突；
- 分数和提交记录：按提交时间保留为不可变记录，个人练习归入 `practice_submissions`，布置作业归入 `assignment_submissions`；
- 布置作业的提交只接受答案内容（代码/填空文本、输入记录和客户端版本），服务端必须用 `packages/exercise` 的判题逻辑重新运行并计算分数/通过状态，不能接受或信任客户端上传的 `score`、`passed` 或“已通过检查”字段；客户端计算结果只能作为即时展示，不能成为 teacher 可见成绩的依据；
- 布置作业的提交只接受答案内容（代码/填空文本、输入记录和客户端版本），服务端必须用 `packages/exercise` 的判题逻辑重新运行并计算分数/通过状态，不能接受或信任客户端上传的 `score`、`passed` 或“已通过检查”字段；客户端计算结果只能作为即时展示，不能成为 teacher 可见成绩的依据；
- 题目草稿：按版本冲突处理，不能把旧草稿覆盖新草稿；
- 删除也是带 revision 的 tombstone，保留一段时间，防止离线设备把已删除文件复活。

同步队列必须具备幂等 `operationId`，网络失败可重试；刷新、关闭页面或退出登录都不能丢失尚未上传的本地变更。同步失败不阻止本地编辑和本地运行。

`ProjectStore` 只负责本地项目/文件，`TeachingStore` 只负责本地教学状态，`SyncQueue` 只负责持久化待同步操作，`SyncEngine` 负责 push/pull/conflict；游客模式不依赖后三者。所有本地实体都带 `storageSchemaVersion`。浏览器安装首次生成随机 UUID `deviceId` 并持久化；它只用于 `updatedByDevice`、`operationId`、冲突来源和同步日志，不使用设备指纹。数据迁移按 `v1 → v2 → v3` 逐级执行，不能跳过版本或静默重置数据。

### 大小上限

所有上限由服务端校验并在客户端做提前提示：单代码文件、单运行时文件、单项目总量、单次上传请求和历史版本数量都要有限制。具体数字应作为服务端策略版本配置，而不是散落在页面脚本中；超限错误要明确告诉用户“文件过大”，不能伪装成服务器繁忙。

## 6. 实施顺序

1. 抽象 `ProjectStore`、`TeachingStore`、`SyncQueue` 和 `SyncEngine` 的接口，并完成本地数据迁移：把现有单一 `caie9618.editor.v1` blob 拆成默认项目、source/runtime 文件、设备状态、偏好、gate/completion、position、个人练习草稿与提交记录；保留旧格式兼容读取、`storageSchemaVersion`、`deviceId`、失败回滚和可重复迁移。当前页面已有多项目 UI，但页面读取尚未完全切换为 IndexedDB entity；本阶段完全不接云端。
2. 多项目 UI 已完成：新建、重命名、切换和删除项目，且不改变本地编辑与本地运行路径。
3. 加认证和会话状态；实现 `learner`/`teacher` 邮箱认证与 `student` 的 username + activationCode 激活。
4. 加项目/文件同步、revision、离线队列和冲突副本；先只同步个人项目。
5. 把现有 `packages/runtime` 打包成受限服务端执行入口，按请求 snapshot 执行，加入服务端二次解析、限制和内部额度账本。
6. 加 teacher/class/member/assignment/assignment_items/progress API 与页面；最后接入跨设备教学进度。
7. 每一步都保留功能开关和回滚路径：云端不可用时显示服务器繁忙，不能让本地运行失效。

首个可交付垂直切片应是“邮箱登录 → 新建个人项目 → 在第二个设备看到代码 → 冲突时生成副本”，而不是一次同时实现班级、作业、云端运行和实时同步。
