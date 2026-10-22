import Foundation
import SeedToCodeKit
import SwiftUI

/// 原生实验室的视图模型：持有 LabCore 推来的状态，加上纯界面状态（当前标签、面板收起、提示条…）。
/// 数据规则一律在 LabCore 那边；这里只负责「什么时候调哪个命令」和「怎么显示结果」。
@MainActor
final class LabModel: ObservableObject {
    enum Tab: String, CaseIterable { case output = "输出", problems = "问题", debug = "调试", files = "文件" }

    struct ConsoleLine: Identifiable, Equatable {
        enum Kind { case out, input, error, system }
        let id = UUID()
        let text: String
        let kind: Kind
    }

    struct Toast: Identifiable, Equatable {
        let id = UUID()
        let message: String
        var actionLabel: String?
        static func == (a: Toast, b: Toast) -> Bool { a.id == b.id }
    }

    let spec: CAIESpec
    let core: LabCore

    @Published private(set) var state: LabState?

    // 编辑器里正在显示的文档
    @Published private(set) var editorDocID = ""
    @Published private(set) var editorText = ""
    private var editorRevision = 0
    /// 只在内容「从外面换进来」时加 1（切文档、同步改了它）。编辑器据此决定要不要整份重载——
    /// 自己保存成功不能动它，否则每存一次编辑器就重载一次，撤销栈和光标全丢。
    private var loadGeneration = 0
    let editor = CodeEditorController()
    private var pendingText: String?
    private var saveTask: Task<Void, Never>?

    @Published var caret = (line: 1, column: 1)

    // 诊断
    @Published private(set) var diagnostics: [LintDiagnostic] = []
    @Published var problemFilter = "all"
    private var lintTask: Task<Void, Never>?

    // 运行
    @Published private(set) var runId: String?
    @Published private(set) var statusText = "尚未运行。点击「运行」查看输出。"
    @Published private(set) var statusStyle = "idle"     // idle | running | done | error
    @Published private(set) var console: [ConsoleLine] = []
    @Published private(set) var waitingInput: (variable: String, type: String)?
    @Published var inputText = ""
    @Published private(set) var runningLine: Int?
    @Published private(set) var variables: [RuntimeVariableRow] = []
    @Published private(set) var stack: [String] = []
    @Published private(set) var handles: [FileHandleRow] = []
    @Published private(set) var traceColumns: [TraceColumn] = []
    @Published private(set) var traceRows: [TraceDisplayRow] = []
    @Published private(set) var traceStatus = ""
    @Published var selectedTraceStep: Int?

    // 纯界面
    @Published var tab: Tab = .output
    @Published var sidebarVisible = true
    @Published var resultsCollapsed = false
    @Published var toast: Toast?
    private var toastAction: (() -> Void)?

    init(spec: CAIESpec, core: LabCore) {
        self.spec = spec
        self.core = core
        Task { await listen() }
    }

    private func listen() async {
        for await event in core.events {
            switch event {
            case .state(let next): apply(next)
            case .docChanged(let docId, let revision):
                if docId == editorDocID && revision != editorRevision { await reloadEditor(force: false) }
            case .run(let id, let event): if id == runId { handle(event) }
            }
        }
    }

    private func apply(_ next: LabState) {
        let previousDoc = state?.activeDocId
        let previousLint = state?.settings.lint
        state = next
        if next.activeDocId != previousDoc { Task { await reloadEditor(force: true) } }
        if next.settings.lint != previousLint { scheduleLint(immediately: true) }
    }

    var settings: LabState.Settings? { state?.settings }
    var activeDoc: LabState.Doc? { state?.docs.first { $0.id == state?.activeDocId } }
    var currentProject: LabState.Project? { state?.projects.first { $0.id == state?.currentProjectId } }
    var isRunning: Bool { runId != nil && statusStyle == "running" }

    // MARK: 编辑器 ↔ 后台

    private func reloadEditor(force: Bool) async {
        await flushSave()
        guard let id = state?.activeDocId, let source = try? await core.source(of: id) else {
            editorDocID = ""; editorText = ""; return
        }
        editorRevision = source.revision
        editorText = source.text
        loadGeneration += 1
        editorDocID = id + "#" + String(loadGeneration)
        runningLine = nil
        scheduleLint(immediately: true)
    }

    /// 编辑器每次改动都来这里。300ms 防抖后整份写回（契约 §4.3）。
    func editorChanged(_ text: String) {
        pendingText = text
        saveTask?.cancel()
        saveTask = Task { [weak self] in
            try? await Task.sleep(nanoseconds: 300_000_000)
            guard !Task.isCancelled else { return }
            await self?.flushSave()
        }
        scheduleLint(immediately: false)
    }

    func flushSave() async {
        guard let text = pendingText, let docId = state?.activeDocId else { return }
        pendingText = nil
        do {
            // 只更新版本号，不碰 editorDocID / editorText：内容本来就是编辑器给的
            editorRevision = try await core.setSource(docId, text: text, baseRevision: editorRevision)
        } catch let error as LabError where error.code == "STALE" {
            await keepLocalCopy(text, of: docId)
        } catch {
            showToast("保存失败：\((error as? LabError)?.message ?? error.localizedDescription)。编辑器里的内容还在。")
            pendingText = text
        }
    }

    /// 写回时发现这份文档在别处被改过：编辑器里的内容另存为副本，原文件换成别处的版本。
    /// 绝不静默覆盖——那等于替使用者丢掉另一边的修改。
    private func keepLocalCopy(_ text: String, of docId: String) async {
        let name = state?.docs.first { $0.id == docId }?.name ?? "未命名.pseudocode"
        let base = (name as NSString).deletingPathExtension
        let ext = (name as NSString).pathExtension.isEmpty ? "pseudocode" : (name as NSString).pathExtension
        do {
            let copyId = try await core.createDoc(name: "\(base)（本机副本）.\(ext)")
            let copy = try await core.source(of: copyId)
            _ = try await core.setSource(copyId, text: text, baseRevision: copy.revision)
            showToast("「\(name)」在别处被改过。你刚写的内容另存为「\(base)（本机副本）.\(ext)」。")
        } catch {
            showToast("「\(name)」在别处被改过，且副本没能存下来：\((error as? LabError)?.message ?? "未知错误")。")
            pendingText = text
        }
    }

    // MARK: 诊断

    private func scheduleLint(immediately: Bool) {
        lintTask?.cancel()
        guard settings?.lint == true else { diagnostics = []; return }
        lintTask = Task { [weak self] in
            if !immediately { try? await Task.sleep(nanoseconds: 250_000_000) }
            guard let self, !Task.isCancelled else { return }
            let text = self.pendingText ?? self.editor.text
            let result = (try? await self.core.lint(text, profile: self.settings?.runtimeProfile ?? "core-2027")) ?? []
            if !Task.isCancelled { self.diagnostics = result }
        }
    }

    var editorDiagnostics: [EditorDiagnostic] {
        diagnostics.map {
            EditorDiagnostic(range: NSRange(location: $0.start, length: max(1, $0.end - $0.start)), line: $0.line,
                             severity: EditorDiagnostic.Severity(rawValue: $0.severity) ?? .hint)
        }
    }

    func count(_ severity: String) -> Int { severity == "all" ? diagnostics.count : diagnostics.filter { $0.severity == severity }.count }

    // MARK: 运行

    func run() {
        guard !isRunning, let docId = state?.activeDocId else { return }
        Task {
            await flushSave()
            console = []
            variables = []; stack = []; handles = []
            traceColumns = []; traceRows = []; traceStatus = ""; selectedTraceStep = nil
            waitingInput = nil; inputText = ""
            do {
                switch try await core.startRun(docId: docId, profile: settings?.runtimeProfile ?? "core-2027", trace: true) {
                case .started(let id):
                    runId = id
                    statusText = "运行中…"
                    statusStyle = "running"
                    tab = .output
                case .preflight(let blocking):
                    diagnostics = blocking
                    statusText = "运行已停止：存在 \(blocking.filter(\.blocking).count) 个阻断错误"
                    statusStyle = "error"
                    console = [.init(text: "运行前检查发现阻断错误：", kind: .error)] +
                        blocking.filter(\.blocking).prefix(5).map { .init(text: "  行 \($0.line)：\($0.message)", kind: .error) }
                    tab = .problems
                }
            } catch {
                statusText = "无法开始运行：\((error as? LabError)?.message ?? error.localizedDescription)"
                statusStyle = "error"
            }
        }
    }

    func stop() {
        guard let runId else { return }
        Task { try? await core.stopRun(runId) }
    }

    func submitInput() {
        guard let runId, waitingInput != nil else { return }
        let value = inputText
        Task {
            let result = (try? await core.provideInput(runId: runId, value: value)) ?? (false, "提交失败。")
            if result.accepted {
                console.append(.init(text: "> " + value, kind: .input))
                waitingInput = nil
                inputText = ""
            } else {
                showToast(result.message ?? "这个输入不被接受。")
            }
        }
    }

    private func handle(_ event: RunEvent) {
        switch event {
        case .output(let lines): console += lines.map { .init(text: $0, kind: $0.hasPrefix("（预览") ? .system : .out) }
        case .line(let line): runningLine = line
        case .inputRequested(let variable, let type): waitingInput = (variable, type)
        case .inputRejected(let message): showToast(message)
        case .variables(let rows, let stack): variables = rows; self.stack = stack
        case .handles(let rows): handles = rows
        case .trace(let columns, let rows, let status):
            traceColumns = columns
            traceRows += rows
            if let status { traceStatus = status }
        case .finished(let status, let text, let errorLine, let errorMessage):
            statusText = text
            statusStyle = status == "completed" ? "done" : status == "stopped" ? "idle" : "error"
            if let errorMessage { console.append(.init(text: errorMessage, kind: .error)) }
            runningLine = errorLine
            waitingInput = nil
            runId = nil
        }
    }

    // MARK: 项目与文件

    func perform(_ work: @escaping () async throws -> Void) {
        Task {
            do { try await work() } catch {
                showToast((error as? LabError)?.message ?? error.localizedDescription)
            }
        }
    }

    func openDoc(_ id: String) { perform { [core] in try await core.openDoc(id) } }

    func deleteDoc(_ doc: LabState.Doc) {
        perform { [core, weak self] in
            let token = try await core.deleteDoc(doc.id)
            self?.showToast("已删除「\(doc.name)」", actionLabel: "撤销") { [weak self] in
                self?.perform { try await core.undoDelete(token) }
            }
        }
    }

    func setSetting(_ key: String, _ value: Any) { perform { [core] in try await core.setSetting(key, value: value) } }

    /// 格式化结果经编辑器自己的修改通道写入，能撤销（网页版同样走 applyEdit）。
    func format() {
        Task {
            let current = editor.text
            guard let formatted = try? await core.format(current), formatted != current else { return }
            editor.replace(NSRange(location: 0, length: (current as NSString).length), with: formatted)
        }
    }

    /// 快速修复：从后往前应用，前面的偏移不受后面替换影响。
    func applyFix(_ fix: LintDiagnostic.Fix) {
        for edit in fix.edits.sorted(by: { $0.start > $1.start }) {
            editor.replace(NSRange(location: edit.start, length: edit.end - edit.start), with: edit.text)
        }
    }

    /// 追踪表点一行：把那一行源码标出来（网页 renderLineMarks 的同一种标记），光标也移过去。
    func highlightLine(_ line: Int) {
        runningLine = line
        guard let start = editor.editor?.lineStarts[safe: line - 1] else { return }
        editor.select(NSRange(location: start, length: 0))
    }

    func jump(to diagnostic: LintDiagnostic) {
        editor.select(NSRange(location: diagnostic.start, length: max(0, diagnostic.end - diagnostic.start)))
    }

    // MARK: 提示条

    func showToast(_ message: String, actionLabel: String? = nil, action: (() -> Void)? = nil) {
        toast = Toast(message: message, actionLabel: actionLabel)
        toastAction = action
        let id = toast!.id
        Task { [weak self] in
            try? await Task.sleep(nanoseconds: 6_000_000_000)
            if self?.toast?.id == id { self?.toast = nil }
        }
    }

    func runToastAction() {
        toastAction?()
        toastAction = nil
        toast = nil
    }
}

private extension Array {
    subscript(safe index: Int) -> Element? { indices.contains(index) ? self[index] : nil }
}
