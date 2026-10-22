# 文档索引

这里收纳不需要占用仓库根目录的计划、专项跟踪和参考资料。当前项目事实仍以根目录的 [`PROJECT_STATE.md`](../PROJECT_STATE.md) 为准；技术规则和协作要求仍保留在根目录，方便开发时定位。

## 计划与专项跟踪

- [初步产品计划](plans/INITIAL_PLAN.md)：项目的早期定位与阶段背景，不替代当前事实。
- [学习助理与低干扰界面计划](plans/AI_ASSISTANT_PLAN.md)：AI 能力的产品边界与暂缓条件。固定评测样本在 [`evals/ai-assistant/`](../evals/ai-assistant/README.md)。
- [同步与队列整体修复计划](plans/SYNC_QUEUE_FIX_PLAN.md)：本地优先同步的未实施设计。
- [Trace table 与调试工作区实施计划](plans/TRACE_TABLE_PLAN.md)：实验室调试能力的设计与验收边界。
- [Lab 可维护性与回归路线](plans/LAB_MAINTAINABILITY_ROADMAP.md)：已核实的维护风险、浏览器回归范围与按需求驱动的重构顺序。
- [运行时虚拟文件单次恢复计划](plans/VIRTUAL_FILE_RESTORE_PLAN.md)：运行时 `.txt` / `.dat` 文件的两个逻辑 slot、本地恢复与同步边界、验收顺序。

- [macOS 应用开发计划](plans/MACOS_APP_PLAN.md)：共享网页界面、原生桥接、离线加载与认证决策、文件操作、同步回归及性能验证门槛。
- [macOS 阶段 A 原型记录](plans/MACOS_PHASE_A_RECORD.md)：内置资源 + 自定义 scheme 与线上 HTTPS 两种加载方式在 WKWebView 里的实测结果、建议与未验证项；原型代码在 `native/macos/`。
- [macOS App 原生云端传输方案](plans/MACOS_CLOUD_TRANSPORT.md)：App 内网页经 Swift 代为请求 API、会话 token 存钥匙串、服务端不改；含路径白名单、换账号 generation、邮箱验证流程，以及本机端到端验证记录。
- [macOS 原生实验室计划与接口契约](plans/MACOS_NATIVE_LAB_PLAN.md)：实验室用 SwiftUI + 原生编辑器重写、数据逻辑复用网页 JS；功能对照表、LabCore 命令/事件契约、Claude 与 Codex 的分工和验收。

## 参考资料

- [剩余题目参考答案](references/REFERENCE_ANSWERS_REMAINING.md)：未随导出答案发布的现有题目参考解。
