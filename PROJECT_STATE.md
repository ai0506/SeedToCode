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
| OOP | Static analysis complete |

## Runtime

| Area | Status |
|---|---|
| Core | Complete |
| Control flow | Complete |
| Routines | Complete |
| Text files | Complete |
| Random files | Complete |

## Teaching

| Area | Status |
|---|---|
| Ch1 | Production |
| Ch2 | Production |
| Ch3 | Production |
| Ch4–7 | Production |
| Ch8–23 | Planned |

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
| Page reads fully from IndexedDB entities | Planned |
| Cloud sync/auth/cloud run | Planned |

说明：当前页面已经通过 `CAIEStorage` 统一访问本地存储，并将 editor/teaching 旧数据镜像到 IndexedDB；为保证同步启动和 `file://` 兼容，页面读取仍使用兼容快照，尚未完成“完全由 IndexedDB entity 读取”的最终切换。多项目当前由编辑器的 `seedtocode.projects.v1` 注册表保存，教学数据仍按独立旧 key 通过 facade 访问。
