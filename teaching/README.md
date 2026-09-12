# 教学模块（Teaching Module）

教学模块当前状态以 [`../PROJECT_STATE.md`](../PROJECT_STATE.md) 为准。本目录的计划、规格和交接文档可以记录设计上下文或历史背景，但不作为当前状态的权威来源，也不应把历史状态继续写入当前状态。

本目录只放**教学模块的规划与规格文档**，不放任何章节正文或题库数据。

实际的教学页是 `web/learn.html`，正文由 `packages/teaching-content` 的数据渲染，题目由 `packages/exercise` + 语言/运行时引擎在浏览器里真判。
要写代码的题目都在独立的做题页 `web/task.html`（左题面、右作答，进度与课文共用同一份 `localStorage`），课文里对应位置留的是入口卡；两页的题目实现共用 `web/js/teaching-task.js`。
版式参照页 `web/teaching-template.html` 走同一个渲染器、喂占位数据，所以不会和实际页面走样；说明见 [06-TEMPLATE.md](06-TEMPLATE.md)。

## 目标

在现有伪代码编辑器 / 运行器之上，增加一个**带学生把 CAIE 9618 伪代码相关内容全部学会**的教学模块。
定位是**教学**，不是应试训练：不做真题分类、不做押题、不做「考点速记」，也不写考试技巧。考纲只用来划定**内容边界**，保证该学的伪代码内容都覆盖到了。

同样不写「易错点」「常见错误」这类内容——教学正文由 AI 产出，AI 并不知道人实际会怎么错，写出来只是编造的学情。边界与陷阱一律以「可追溯到 Guide / 考纲 / 引擎行为的事实」形式呈现。详见 [02-CONTENT_SPEC.md](02-CONTENT_SPEC.md) 2.1。

## 文档索引

| 文件 | 内容 |
|---|---|
| [00-REVIEW.md](00-REVIEW.md) | 对初版教学大纲的评估：分界线错位、遗漏点、顺序问题、粒度问题 |
| [01-CURRICULUM.md](01-CURRICULUM.md) | 修订后的教学大纲（章 / 小节 / AS-A Level 标记 / 考纲映射 / 与初版的编号对照） |
| [02-CONTENT_SPEC.md](02-CONTENT_SPEC.md) | 五类教学元素的规格、写作规范、中英术语规则 |
| [03-EXERCISE_SPEC.md](03-EXERCISE_SPEC.md) | 伪代码题目的判题规格：语法层、构造约束层、测试层、规范建议层 |
| [04-PLAN.md](04-PLAN.md) | 分阶段实施计划、与语言引擎/运行时进度的依赖关系 |
| [05-GLOSSARY.md](05-GLOSSARY.md) | 术语对照表（种子版），所有章节共用同一套译法 |
| [06-TEMPLATE.md](06-TEMPLATE.md) | 小节页模板与实现：元素与类名对照、关卡交互状态、判题面板五态、课程主页、编辑器跳转 |
| [08-GUIDANCE.md](08-GUIDANCE.md) | **指导提示**：不做编译器、做指导者——已有的诊断清单，以及加一条新的要满足什么 |
| **[07-HANDOFF.md](07-HANDOFF.md)** | **交接文档：现在做到哪儿、问题是怎么被发现的、有哪些风险。接手先读这份** |
| [chapter-01-preview.md](chapter-01-preview.md) | Chapter 1 的可读预览（由内容数据生成，方便审阅正文；不是最终版式） |
| [chapter-02-preview.md](chapter-02-preview.md) | Chapter 2 的可读预览（由内容数据生成，方便审阅正文；不是最终版式） |
| [chapter-03-preview.md](chapter-03-preview.md) | Chapter 3 的可读预览（由内容数据生成，方便审阅正文；不是最终版式） |
| [chapter-04-draft.md](chapter-04-draft.md) | Chapter 4 的正文底稿（已转成 `chapter-04.ts` 的互动数据；只作通读用，不是权威版本） |
| [chapter-05-draft.md](chapter-05-draft.md) | Chapter 5 的正文底稿（已转成 `chapter-05.ts` 的互动数据；只作通读用，不是权威版本） |
| [chapter-06-draft.md](chapter-06-draft.md) | Chapter 6 的正文底稿（已转成 `chapter-06.ts` 的互动数据；只作通读用，不是权威版本） |
| [chapter-07-draft.md](chapter-07-draft.md) | Chapter 7 的正文底稿（已转成 `chapter-07.ts` 的互动数据；只作通读用，不是权威版本） |

## 现在做到哪儿了

- 规格与大纲：完成（00–06）
- 判题核心 `packages/exercise`：首版可用
- 教学页 `web/learn.html` 与做题页 `web/task.html`：接通真实内容与引擎，判题、运行、进度都是真的
- 内容：**Chapter 1–16（AS 全部）**已接入正式内容、真实判题和页面流程；A Level 的 Chapter 17–23 尚未上线

细节、风险与接手建议见 [07-HANDOFF.md](07-HANDOFF.md)。

## 权威顺序

教学内容的事实依据沿用仓库既有的权威顺序，不另立一套：

1. `pseudocode_guide-9618.pdf` / `syllabus-9618.pdf`（原始 PDF）
2. `CAIE_RULES.md`（规则 ID、原文强度、印刷页码、诊断级别）
3. `runtime-conventions.md`（Cambridge 未定义、编辑器必须确定的执行行为）
4. `LANGUAGE_SPEC.md`（token、语法、AST、类型检查、诊断接口）
5. 本目录的教学文档
6. 教学页面实现

**教学正文不得自行发明语法或规则。** 任何教学示例中出现的写法，必须能通过 `packages/language` 的分析且零阻断错误；任何「必须 / 不应该」的说法，必须能追溯到上面第 1–3 层的某条规则 ID。

## 范围声明

- 本模块**覆盖**：与伪代码书写、阅读、执行、算法设计直接相关的考纲内容。
- 本模块**不覆盖**：低级语言 / 汇编与寻址方式、declarative（facts & rules）范式、浮点数表示、网络、硬件、数据库、安全等纯理论章节。这些在考纲内但与伪代码无关，README 与教学首页必须明说，避免学生误以为学完这里就覆盖了全部 Paper。
- 本产品不是 Cambridge 官方产品，教学正文中不得暗示官方授权。
