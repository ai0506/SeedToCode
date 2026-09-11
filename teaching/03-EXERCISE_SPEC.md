# 伪代码题目判题规格

版本：0.3
用户要求的三条判定标准：① 没有语法错误（不规范只提醒）；② 一组输入数据下所有输出都正确；③ 能规定必须用某个结构、必须避开某些结构。本文件把这三条展开成可实现的规格。

## 1. 判题分层与顺序

**固定顺序，前一层不通过就不进入下一层，反馈只讲当前层。**

| 层 | 名称 | 数据来源 | 不通过时 |
|---|---|---|---|
| L0 | 静态阻断错误 | `analyzeSource()` 中 `severity = error` 的诊断 | 不评测，展示诊断（含行号、规则 ID、修复建议） |
| L1 | 构造约束 | AST 特征提取 | 直接说明：要求用 X 但没用到 / 不该用 Y 但用了 |
| L2 | 功能测试 | `executeSource()` 逐用例跑 | 默认只显示通过数与失败用例的**描述性提示**；同一题连续失败 3 次后才揭示具体输入与输出（见 4.3） |
| L3 | 规范建议 | `severity = caie` / `hint` 的诊断 | **永远不影响通过判定**，只在通过后作为「可以更好」展示 |

L0 与 L3 的分级直接沿用 `CAIE_RULES.md` 的三级定义，不另立标准。

> 这套顺序对应用户的表述：「没有语法错误（但可以有不规范的地方，提醒即可）」= L0 判、L3 只提醒。

## 2. L0：静态阻断错误

- 判定输入：`analyzeSource(code, { profile })`。`profile` 按章节层级设定，AS 章节用 `core`，A Level 章节用 `advanced`。
- 只要存在 `severity === "error"` 的诊断即 L0 失败。
- 反馈直接复用编辑器的诊断展示组件，含中文消息、规则 ID、`TextEdit` 自动修复。
- **不做「差不多就算对」的宽容**：语法错误就是没通过，这是用户明确要求的。

## 3. L1：构造约束

### 3.1 必须走 AST，不能走正则

用源码文本匹配 `WHILE` / `FOR` 会被注释与字符串误伤：

```
// 这里本来想用 FOR，后来改成 WHILE
OUTPUT "FOR"
```

因此约束检查基于 `parseSource()` 得到的 AST，遍历统计节点。`packages/language` 已导出全部 AST 类型（`WhileStatement`、`ForStatement`、`RepeatStatement`、`IfStatement`、`CaseStatement`、`ProcedureDeclaration`、`FunctionDeclaration`、`Parameter.mode`、`RecordTypeDeclaration`、`CallExpression` 等），足够支撑。

### 3.2 特征（feature）清单

约束用一组稳定的特征 ID 表达，题目只引用 ID，不写实现细节：

已实现于 `packages/exercise/src/features.ts`，`FEATURE_IDS` 是唯一的权威清单。

| 类别 | 特征 ID 示例 |
|---|---|
| 输入输出 | `io.input`、`io.output` |
| 循环 | `loop.for`、`loop.while`、`loop.repeat`、`loop.nested` |
| 选择 | `select.if`、`select.if-else`、`select.nested-if`、`select.case`、`select.case-otherwise`、`select.case-range` |
| 声明 | `decl.variable`、`decl.constant`、`decl.array-1d`、`decl.array-2d`、`decl.record-type`、`decl.enum`、`decl.pointer`、`decl.set`、`decl.class` |
| 模块 | `routine.procedure`、`routine.function`、`routine.call`、`param.byval`、`param.byref`、`routine.recursive` |
| 内置 | `builtin.length`、`builtin.mid`、`builtin.right`、`builtin.lcase`、`builtin.ucase`、`builtin.int`、`builtin.rand` |
| 文件 | `file.open-read`、`file.open-write`、`file.open-append`、`file.open-random`、`file.eof`、`file.seek`、`file.getrecord`、`file.putrecord` |
| 运算 | `op.div`、`op.mod`、`op.concat`、`op.and`、`op.or`、`op.not` |
| 其它 | `expr.function-call`、`array.index-2d`、`record.field-access`、`oop.inherits`、`oop.new`、`oop.super`、`misc.comment` |

特征 ID 需要一份稳定清单文件（类似 `CAIE_RULES.md` 的规则 ID），**一旦发布不得改名**，否则老题目会失效。

### 3.3 约束语法

```
constraints: {
  require: [
    { feature: "loop.while", min: 1, reason: "本节练习前测循环" }
  ],
  forbid: [
    { feature: "loop.for",    reason: "本节要求你自己控制循环条件" },
    { feature: "loop.repeat", reason: "同上" }
  ],
  requireAnyOf: [
    { features: ["select.case", "select.nested-if"], reason: "两种写法都可以" }
  ]
}
```

- `reason` **必填**，会原样展示给学生。用户要求「规定要用什么」，但学生必须知道为什么被规定。
- `forbid` 的反馈要指到具体行：「第 7 行用了 `FOR`，本题要求用 `WHILE`」。
- **章末大题不使用 `require` / `forbid`**，改用 `suggestedTopics` 软约束（见 [02-CONTENT_SPEC.md](02-CONTENT_SPEC.md) 2.5）。

### 3.4 知识点闸门（超前语法检测）

除题目自定义约束外，系统自动施加一条隐式约束：**学生的解答不得使用当前小节之后才教的语法特征**。

- 每个特征 ID 在大纲里标注「首次教授的小节」。
- 学生若用到未教特征，**不判错**，而是给一条提示级反馈：「你用到了 `CASE`，这是第 4 章的内容——写得没问题，不过本题用 `IF` 就够了」。
- 这条同样用于校验**教学内容自身**：CI 检查每段示例代码、每道题的参考解，都不得超前使用特征。这是防止大纲失序的最有效手段。

## 4. L2：功能测试

### 4.1 期望输出由参考解生成，不手写

每道题必须有 `referenceSolution`。构建时用 `packages/runtime` 跑参考解 + 每组测试输入，把输出固化成期望值。

理由（见 [00-REVIEW.md](00-REVIEW.md) 7.3）：题目与答案不会不一致、题目一定跑得通、题库直接成为引擎回归语料。

期望输出**要落盘进仓库**（生成物入库），这样引擎行为一旦变化，CI 会立刻发现差异，而不是悄悄改变判题结果。

### 4.2 测试用例的设计要求（出题者内部规则，不展示给学生）

每道题至少 4 组，且必须覆盖 `§12.3` 的四类数据：

| 类型 | 说明 | 至少 |
|---|---|---|
| normal | 典型输入 | 2 组 |
| boundary | 边界值（0、1、上下界、空） | 1 组 |
| extreme | 合法范围内的极端值 | 1 组 |
| abnormal | 题目**明确说明**需要处理的非法输入 | 视题目 |

**这张表是给出题者用的，不是教学内容。** 学生端不出现「normal / abnormal / extreme / boundary」这套分类，也不解释判题器按什么策略造数据——否则学生会照着分类去猜用例、只为通过特定几组数据而写。（决议见 [00-REVIEW.md](00-REVIEW.md) 决议 2.2。这套分类作为学生内容的可能性保留在待定章 X1。）

**只对有输入的题目适用。** 无输入的题目（例如「按指定顺序输出三行」）程序行为唯一，只需要一组用例；强行凑四类没有意义。

**关键约束**：只有 `ioSpec` 里明确写了要处理的非法输入，才可以有 abnormal 用例。用户的原话是「所有的（在题目定义内的）输入数据对应的输出都正确」——题目没定义的输入不参与判定。

### 4.3 用例可见性与失败反馈（重要）

区分两个概念，不要混：

| | 是什么 | 学生可见 |
|---|---|---|
| `examples` | **题面示例**：1–2 组「示例输入 → 示例输出」，用来说明 IO 格式 | ✅ 公开，属于题目描述 |
| `tests` | **判题用例**：实际用于判定的全部输入序列与期望输出 | ❌ **全部隐藏** |

`examples` 的值**不得**与任何 `tests` 用例相同，避免题面直接泄露一组判题数据。这一条同样只对有输入的题目适用——无输入时没有可泄露的数据。

判题用例失败时的反馈分级：

| 阶段 | 显示内容 |
|---|---|
| 默认（第 1–2 次提交失败） | 只显示**通过数 / 总数**，以及第一个失败用例的**描述性提示**（`caseHint`），例如「有一种情况没通过：当列表里所有分数都相同时」。**不显示具体输入、期望输出、实际输出** |
| 同一题连续失败 3 次后 | 揭示当前失败用例的具体输入、期望输出、实际输出、首个差异行 |

因此每个用例必须多一个必填字段：

```
{ id, kind, inputs, expected, caseHint }   // caseHint 必填，一句中文，描述这组数据在考什么
```

`caseHint` 的写法要求：**描述情形，不给数值**。
- ✅「当输入的数量为 0 时」
- ✅「当要找的值恰好在最后一个位置时」
- ❌「输入 5, 3, 8, 1 时」

失败次数按题按人本地计数（IndexedDB），不上传。3 次这个阈值放在配置里，题目可以单独覆盖（例如很难的章末大题设为 5）。

**运行时错误与超限反馈不受此限制**——死循环、越界、未初始化这类错误直接显示，因为它们指向的是学生自己代码里的行，不泄露用例数据。

### 4.4 输出比对规则

必须复用 `runtime-conventions.md` 里已有的输出约定（`OUTPUT` 多值拼接、`REAL` 显示精度、`DATE` 显示格式、`BOOLEAN` 显示为 `TRUE`/`FALSE`），**不得另立一套**，否则学生在编辑器里看到的输出和判题结果对不上。

默认比对策略：

1. 按行切分，去掉每行**尾部**空白；
2. 忽略末尾的空行；
3. 其余部分**严格逐字符比较**（大小写敏感）。

题目可声明放宽项：

```
comparison: {
  ignoreCase: false,
  trimEachLine: false,      // 去掉首尾空白（默认只去尾部）
  numericTolerance: null    // 如 0.001，只对可解析为数字的行生效
}
```

`numericTolerance` 主要给涉及 `REAL` 运算的题目用。

### 4.5 输入的供给

- 测试输入是一个**有序字符串序列**，逐个喂给 `INPUT`。
- 若程序请求的输入多于提供的数量 → 判为失败，反馈「程序要求的输入比题目提供的多，检查循环条件」。
- 若程序没用完全部输入 → **不算失败**，但给提示。
- 输入被 `INPUT` 拒绝（类型不符）时，运行时的重试机制会再要一次同一个值 → 会耗尽输入 → 落到上面的失败分支。反馈要能识别这种情况并说明「你的 `INPUT` 变量类型可能不对」。

### 4.6 资源限制

复用运行时既有的 `maxSteps` / `maxActiveTimeMs` / `maxOutputLines` / 字节上限。超限时反馈区分：

- 步数超限 → 「可能是死循环，检查循环条件何时变为 `FALSE`」
- 输出行数超限 → 「输出太多，检查 `OUTPUT` 是不是写在循环里了」

死循环是初学者最常见的错误，这条反馈的教学价值很高，不能只显示「运行超时」。

## 5. L3：规范建议

- 展示 `severity` 为 `caie`（CAIE 规范）与 `hint`（建议）的诊断。
- 位置在通过提示的**下方**，标题类似「通过了。顺便，有 2 处可以更规范」。
- 每条附规则 ID 与来源标签（`CAIE` / `Editor Runtime`），与编辑器问题面板一致。
- **绝不因为 L3 判不通过。**

## 6. 反馈信息结构

判题结果返回统一结构，便于 UI 一致渲染：

```
{
  passed: bool,
  failedLayer: "L0" | "L1" | "L2" | null,
  diagnostics: Diagnostic[],          // L0 / L3
  constraintResults: [                // L1
    { feature, kind: "require"|"forbid", satisfied, reason, occurrences: SourceRange[] }
  ],
  testResults: [                      // L2
    { id, kind, caseHint, passed, revealed, inputs?, expected?, actual?, firstDiffLine? }
  ],
  coverage?: { used: string[], missing: string[] },   // 章末大题软约束
  styleNotes: Diagnostic[]            // L3
}
```

## 7. 实现落点

`packages/exercise` 已建立，与现有 workspace 并列。当前状态：`features.ts`、`compare.ts`、`grade.ts` 已实现并被 Chapter 1 的校验用上；`generate.ts` 的职责由 `scripts/generate-teaching-expected.mjs` 承担。

| 模块 | 职责 |
|---|---|
| `features.ts` | 特征 ID 常量表 + AST 遍历提取器 |
| `constraints.ts` | `require` / `forbid` / `requireAnyOf` / 知识点闸门求值 |
| `compare.ts` | 输出比对（复用 runtime 的显示约定） |
| `grade.ts` | L0→L3 编排，产出上面的结果结构 |
| `generate.ts` | 构建期：跑参考解生成期望输出，落盘 |

约束：与 `packages/language`、`packages/runtime` 一样，**不依赖 DOM、存储、网络**，可在 Node 下单测；页面通过既有的 IIFE 构建方式接入。

这样做的额外收益：全部题目的参考解 + 测试用例天然成为引擎的第二套回归语料，规模会远超现有的 12 个合法样本 + 24 个非法样本。
