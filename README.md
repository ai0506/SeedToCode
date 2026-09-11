# CAIE 9618 Pseudocode Editor

本仓库目前包含可用的静态编辑器界面、已经接入页面的阶段 2 语言引擎，以及阶段 4 虚拟文件解释执行器。

## 开发命令

```bash
npm install
npm test
npm run check
npm run build
```

- `npm test` 会先从源码构建全部 workspace，再执行自动化测试。
- `npm run check` 只执行 TypeScript 类型检查。
- `npm run build` 同时生成各包 ESM、`packages/language/dist/browser.js`，以及页面直接加载的语言和运行时 IIFE。
- `npm run teaching:expected` 用参考解重新生成教学题库的期望输出快照；`npm test` 会先以 `--check` 比对快照，再跑全部测试。

## 当前包

- `packages/caie-spec`：CAIE 关键字、基本类型、内置函数签名和 70 个稳定规则 ID。
- `packages/language`：与 DOM 和存储解耦的语言核心；已实现 Core 和 Advanced 静态检查，包括记录、枚举、指针、集合、文本/随机文件及 OOP，同时提供 CAIE 格式诊断和幂等格式化。
- `packages/runtime`：与 DOM 解耦的阶段 4 解释器；除过程、函数与复合值外，真实执行文本/随机虚拟文件命令，并在正常结束时提交、停止或错误时回滚文件快照。
- `packages/test-cases`：从 `TEST_CORPUS.md` 迁移出的结构化验收语料；`tests/pseudocode-samples` 的文件级回归已覆盖全部 12 个合法样本和 24 个非法样本。
- `packages/exercise`：教学题目的判题核心；语法特征提取（从 AST 统计，不做文本匹配）、输出比对与 L0→L2 判题编排。
- `packages/teaching-content`：教学内容数据；Chapter 1 与 Chapter 2 已完成，全部示例、参考解与期望输出由语言与运行时引擎实跑校验。规划与规格见 `teaching/`。

页面位于 `web/`，通过生成的经典浏览器脚本加载语言核心与运行时；诊断、自动修复、格式化以及阶段 4 范围内的运行都使用真实引擎。页面可直接双击 `web/index.html` 使用；本地 HTTP 服务只用于开发预览，并非运行依赖。
