# SeedToCode（CAIE 9618 Pseudocode Editor）

一个面向 CAIE 9618（2027–2029）的 SeedToCode 浏览器伪代码编辑器、解释执行器和配套教学平台。

项目目前包含：

- 浏览器内的 CAIE 9618 伪代码编辑、语法高亮、结构辅助、格式化和诊断。
- 基于 AST 的静态分析与类型检查，区分阻断错误、CAIE 规范提示和建议。
- 阶段 4 运行时：变量、表达式、过程、函数、调用栈，以及文本文件和随机文件的虚拟执行。
- 教学课程、交互式小节题和章末题；题目使用真实的语言分析器、运行时和判题核心。
- 独立做题页：左侧题面、右侧作答，带行号、输入输出用例、分级提示、判题结果和进度保存。
- 本地优先：编辑、教学、做题和本地运行不依赖后端；登录后可选接入云端同步、云端运行和班级教学。
- 支持多个本地项目；每个项目独立保存代码文件和运行时虚拟文件，项目入口位于编辑器左侧栏顶部。
- 本地存储正在从旧版 `localStorage` blob 迁移到 `CAIEStorage` + IndexedDB entity 模型；旧用户数据会保留并迁移，页面仍通过兼容快照读取。
- 页面已接入认证、个人项目同步、云端运行、教学进度/草稿同步、老师面板、学生作业页和自出题作业；老师/个人学习者首次注册验证邮箱，之后使用邮箱密码登录；服务端已部署到 Cloudflare Workers 并绑定远端 D1；`RESEND_API_KEY` / `EMAIL_FROM` / `APP_ORIGIN` 三个 secret 均已设置，但真实投递尚未验证成功。

## 快速开始

```bash
npm install
npm test
```

直接打开 `web/lab.html` 可以使用编辑器。需要通过本地 HTTP 服务预览网页时：

```bash
python3 -m http.server 8777 --directory web
```

然后访问 <http://localhost:8777>。

## 开发命令

```bash
npm run check
npm run build
npm test
```

- `npm run check`：执行全部 workspace 的 TypeScript 类型检查。
- `npm run build`：构建 TypeScript，并生成网页直接加载的浏览器脚本。
- `npm test`：构建项目、检查教学题目的期望输出快照，然后运行 Vitest 测试。
- `npm run teaching:expected`：根据参考解重新生成教学题目的期望输出和运行记录。
- `npm run teaching:preview`：生成或预览指定教学章节的可读版本。

## 项目结构

| 路径 | 作用 |
|---|---|
| `packages/caie-spec` | CAIE 关键字、类型、内置函数和稳定规则 ID |
| `packages/language` | tokenizer、parser、AST、绑定、类型检查、静态诊断和格式化 |
| `packages/runtime` | 与 DOM 解耦的 AST 解释器和虚拟文件运行时 |
| `packages/exercise` | 教学题目的语法特征提取、输出比对和分层判题 |
| `packages/test-cases` | 结构化验收语料 |
| `packages/teaching-content` | 课程章节、题目、参考解、期望输出和浏览器发布数据 |
| `server/` | Cloudflare Worker 入口、D1 migrations 和后端 API（本地开发与线上部署配置） |
| `web/lab.html` | 实验室：主编辑器页面（线上 `/lab`，`/` 会 301 到这里） |
| `web/learn.html` | 学习：教学课程页（线上 `/learn`） |
| `web/task.html` | 独立做题页 |
| `web/classes.html` | 班级：老师的班级、学生、进度和作业面板（线上 `/classes`） |
| `web/login.html` | 老师、个人学习者和学生的独立登录/激活页 |
| `web/assignments.html` | 学生作业清单、提交状态、分数和评语 |
| `web/custom-task.html` | 自出题作业的编辑、运行和提交页 |
| `tests/pseudocode-samples` | 合法、非法和边界伪代码样本 |
| `teaching/` | 教学模块的课程规划、内容规格、模板和交接文档 |

## 当前教学内容

项目当前状态以 [`PROJECT_STATE.md`](PROJECT_STATE.md) 为准。本文件只介绍产品入口与使用方式；实施计划、交接记录和历史背景中的状态描述不作为当前状态的权威来源。

课程索引目前已登记 Chapter 1–16，也就是 **AS 的全部内容**：

1. 算法、伪代码与书写规范
2. 变量与数据类型
3. 表达式与运算符
4. 选择
5. 三种循环
6. 循环的选择与嵌套
7. 字符串与内置函数
8. 一维数组
9. 二维数组
10. 线性查找与冒泡排序
11. 记录
12. 过程
13. 函数
14. 文本文件
15. 抽象数据类型入门（概念章，无伪代码题）
16. 综合：从问题到完整程序

教学内容通过 `packages/teaching-content` 发布到浏览器；课文页负责阅读、导航和进度展示，代码题统一跳转到 `web/task.html`。A Level 的 Chapter 17–23 尚未登记到当前课程索引。

## 语言与运行时边界

CAIE 规定的语法和规则以以下资料为准：

1. `pseudocode_guide-9618.pdf` 与 `syllabus-9618.pdf`
2. `CAIE_RULES.md`
3. `runtime-conventions.md`（CAIE 未定义、但编辑器必须确定的执行行为）
4. `LANGUAGE_SPEC.md`

`web/js/caie-spec.js` 主要服务于界面高亮、模板和编辑辅助；网页诊断与运行使用由 `packages/language`、`packages/runtime` 构建的真实引擎。

## 前端硬性规则

`web/` 下所有页面必须满足 `FRONTEND_RULES.md` 的两条硬性要求：**界面稳定性**（一次交互只允许改变被操作对象自身，其他元素不得移动或改变尺寸）和**不使用浏览器原生交互界面**（`alert` / `confirm` / `prompt`、原生 `title` 悬浮文字、原生 `select` / 日期选择器 / 复选框等一律换成应用内组件）。该文件带检查清单和一段可直接粘进控制台的位移比对脚本，改动前端时按它逐项过。

## 说明

- 这是学习和编写 CAIE 9618 伪代码的独立工具，不是 Cambridge 官方产品，也不暗示官方授权。
- 项目只覆盖与伪代码书写、阅读、执行和算法设计直接相关的内容，不等同于完整覆盖 9618 课程的所有理论章节。
- 本地浏览器数据与源文件状态互相独立；清除浏览器数据不会删除仓库中的代码和资料。
