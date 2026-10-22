import Foundation
import SeedToCodeKit

/// LabCore 的内存假实现，只为在后台（CoreHost）完成之前把界面做出来、点得动。
///
/// **它不执行代码、不做诊断、不落盘、不同步。** 运行时发出的输出、变量、追踪表都是写死的样子，
/// 并且每次都明说「预览」——界面上绝不能让人以为这是真结果。CoreHost 接上后整个文件删掉。
@MainActor
final class PreviewLabCore: LabCore {
    private var state: LabState
    private var sources: [String: DocSource] = [:]
    private var continuation: AsyncStream<LabEvent>.Continuation?
    private var deleted: [String: (LabState.Doc, DocSource, Int)] = [:]
    private var pendingInput: String?
    private var sequence = 0

    let events: AsyncStream<LabEvent>

    init(spec: CAIESpec) {
        let docs = spec.samples.docs.map { LabState.Doc(id: $0.id, name: $0.name, lesson: false, archived: false, revision: 1) }
        for doc in spec.samples.docs { sources[doc.id] = DocSource(text: doc.source, revision: 1) }
        state = LabState(
            projects: [.init(id: "project-default", name: "我的项目", lesson: false), .init(id: "lesson", name: "课文文件", lesson: true)],
            currentProjectId: "project-default",
            docs: docs,
            activeDocId: docs.first?.id,
            runtimeFiles: [.init(id: "rf-names", name: "Names.txt", kind: "text", size: 5, restorable: false),
                           .init(id: "rf-report", name: "Report.txt", kind: "text", size: 0, restorable: true)],
            settings: .init(theme: "light", fontSize: 14, lineNumbers: true, arrowConvert: true, autoIndent: true, autoPair: true,
                            lint: false, runtimeProfile: "core-2027", showArchivedLessons: false),
            saveState: "saved",
            account: .init(configured: true, signedIn: false, user: nil, sync: .init(state: "idle", pending: 0, blocked: 0, lastError: nil), hold: nil))
        var captured: AsyncStream<LabEvent>.Continuation?
        events = AsyncStream { captured = $0 }
        continuation = captured
        continuation?.yield(.state(state))
    }

    private func publish() { continuation?.yield(.state(state)) }

    private func nameError(_ name: String, excluding: String? = nil) -> LabError? {
        let trimmed = name.trimmingCharacters(in: .whitespaces)
        if trimmed.isEmpty { return LabError(code: "INVALID_NAME", message: "名称不能为空。") }
        let base = { (n: String) in (n as NSString).deletingPathExtension.lowercased() }
        if state.docs.contains(where: { $0.id != excluding && base($0.name) == base(trimmed) }) {
            return LabError(code: "NAME_TAKEN", message: "已存在同名代码文件（.pseudocode 与 .txt 视为同一个名字）。")
        }
        return nil
    }

    // MARK: 项目

    func switchProject(_ id: String) async throws { state.currentProjectId = id; publish() }
    func createProject(name: String) async throws -> String {
        let id = "p-\(UUID().uuidString.prefix(8))"
        state.projects.append(.init(id: id, name: name, lesson: false))
        state.currentProjectId = id
        publish()
        return id
    }
    func renameProject(_ id: String, name: String) async throws {
        guard let i = state.projects.firstIndex(where: { $0.id == id }) else { return }
        if state.projects[i].lesson { throw LabError(code: "READ_ONLY", message: "课文项目不能改名。") }
        state.projects[i].name = name
        publish()
    }
    func deleteProject(_ id: String) async throws {
        state.projects.removeAll { $0.id == id && !$0.lesson }
        state.currentProjectId = state.projects.first?.id ?? ""
        publish()
    }

    // MARK: 文档

    func openDoc(_ id: String) async throws { state.activeDocId = id; publish() }
    func createDoc(name: String) async throws -> String {
        let full = name.hasSuffix(".pseudocode") || name.hasSuffix(".txt") ? name : name + ".pseudocode"
        if let error = nameError(full) { throw error }
        let id = "doc-\(UUID().uuidString.prefix(8))"
        state.docs.append(.init(id: id, name: full, lesson: false, archived: false, revision: 1))
        sources[id] = DocSource(text: "", revision: 1)
        state.activeDocId = id
        publish()
        return id
    }
    func renameDoc(_ id: String, name: String) async throws {
        if let error = nameError(name, excluding: id) { throw error }
        guard let i = state.docs.firstIndex(where: { $0.id == id }) else { return }
        state.docs[i].name = name
        publish()
    }
    func deleteDoc(_ id: String) async throws -> String {
        guard let i = state.docs.firstIndex(where: { $0.id == id }) else { throw LabError(code: "NOT_FOUND", message: "文件不存在。") }
        let token = UUID().uuidString
        deleted[token] = (state.docs[i], sources[id]!, i)
        state.docs.remove(at: i)
        if state.activeDocId == id { state.activeDocId = state.docs.first?.id }
        publish()
        return token
    }
    func undoDelete(_ token: String) async throws {
        guard let (doc, source, index) = deleted.removeValue(forKey: token) else { return }
        state.docs.insert(doc, at: min(index, state.docs.count))
        sources[doc.id] = source
        state.activeDocId = doc.id
        publish()
    }
    func source(of docId: String) async throws -> DocSource {
        guard let s = sources[docId] else { throw LabError(code: "NOT_FOUND", message: "文件不存在。") }
        return s
    }
    func setSource(_ docId: String, text: String, baseRevision: Int) async throws -> Int {
        guard let current = sources[docId] else { throw LabError(code: "NOT_FOUND", message: "文件不存在。") }
        if current.revision != baseRevision { throw LabError(code: "STALE", message: "这份文件在别处被改过。") }
        let next = current.revision + 1
        sources[docId] = DocSource(text: text, revision: next)
        if let i = state.docs.firstIndex(where: { $0.id == docId }) { state.docs[i].revision = next }
        publish()
        return next
    }

    func setSetting(_ key: String, value: Any) async throws {
        var s = state.settings
        switch key {
        case "theme": s.theme = value as? String ?? s.theme
        case "fontSize": s.fontSize = value as? Int ?? s.fontSize
        case "lineNumbers": s.lineNumbers = value as? Bool ?? s.lineNumbers
        case "arrowConvert": s.arrowConvert = value as? Bool ?? s.arrowConvert
        case "autoIndent": s.autoIndent = value as? Bool ?? s.autoIndent
        case "autoPair": s.autoPair = value as? Bool ?? s.autoPair
        case "lint": s.lint = value as? Bool ?? s.lint
        case "runtimeProfile": s.runtimeProfile = value as? String ?? s.runtimeProfile
        case "showArchivedLessons": s.showArchivedLessons = value as? Bool ?? s.showArchivedLessons
        default: break
        }
        state.settings = s
        publish()
    }

    /// 预览没有分析器：只为了让问题面板有东西可画，把每一行里的小写 `output` 报成规范问题。
    func lint(_ source: String, profile: String) async throws -> [LintDiagnostic] {
        let ns = source as NSString
        var result: [LintDiagnostic] = []
        var searchFrom = 0
        while true {
            let r = ns.range(of: "output", options: [], range: NSRange(location: searchFrom, length: ns.length - searchFrom))
            if r.location == NSNotFound { break }
            let line = ns.substring(to: r.location).components(separatedBy: "\n").count
            result.append(LintDiagnostic(start: r.location, end: NSMaxRange(r), line: line, column: 1, severity: "caie", code: "PREVIEW",
                                         message: "（预览数据）关键字应全部大写：OUTPUT", blocking: false,
                                         fixes: [.init(title: "改为 OUTPUT", edits: [.init(start: r.location, end: NSMaxRange(r), text: "OUTPUT")])]))
            searchFrom = NSMaxRange(r)
        }
        return result
    }

    func format(_ source: String) async throws -> String { source }

    // MARK: 运行（假的）

    func startRun(docId: String, profile: String, trace: Bool) async throws -> RunStart {
        sequence += 1
        let runId = "preview-\(sequence)"
        let text = sources[docId]?.text ?? ""
        Task { @MainActor in
            continuation?.yield(.run(runId: runId, .output(lines: ["（预览：后台还没接上，下面不是真正的运行结果）"])))
            continuation?.yield(.run(runId: runId, .line(2)))
            let columns = [TraceColumn(variableId: "v1", name: "Score"), TraceColumn(variableId: "v2", name: "Total", scopeLabel: "Sum#1")]
            continuation?.yield(.run(runId: runId, .trace(columns: columns, rows: [
                .init(step: 1, line: 3, action: "DECLARE Score", output: "", cells: [.init(text: "未赋值", style: "unassigned"), .init(text: "", style: "none")]),
                .init(step: 2, line: 9, action: "INPUT Score", output: "", cells: [.init(text: "72", style: "none"), .init(text: "", style: "none")]),
                .init(step: 3, line: 11, action: "Total ← Total", output: "", cells: [.init(text: "-", style: "none"),
                      .init(text: "0", style: "same-byref", note: "Total 在 Sum 里经 BYREF 写入 0，值未改变")])
            ], status: "追踪中…（预览）")))
            continuation?.yield(.run(runId: runId, .variables([.init(name: "Score", kind: "变量", type: "INTEGER", value: "72")], stack: ["<main>"])))
            if text.contains("INPUT") {
                pendingInput = runId
                continuation?.yield(.run(runId: runId, .inputRequested(variable: "StudentName", type: "STRING")))
            } else {
                finish(runId)
            }
        }
        return .started(runId: runId)
    }

    private func finish(_ runId: String) {
        continuation?.yield(.run(runId: runId, .output(lines: ["预览输出 1", "预览输出 2"])))
        continuation?.yield(.run(runId: runId, .finished(status: "completed", statusText: "运行结束 · 预览数据", errorLine: nil, errorMessage: nil)))
    }

    func provideInput(runId: String, value: String) async throws -> (accepted: Bool, message: String?) {
        guard pendingInput == runId else { return (false, "当前没有等待输入。") }
        if value.isEmpty { return (false, "（预览）请输入内容。") }
        pendingInput = nil
        Task { @MainActor in finish(runId) }
        return (true, nil)
    }

    func stopRun(_ runId: String) async throws {
        pendingInput = nil
        continuation?.yield(.run(runId: runId, .finished(status: "stopped", statusText: "已停止 · 预览数据", errorLine: nil, errorMessage: nil)))
    }

    func importDocs(_ files: [(name: String, text: String)], target: String) async throws -> (imported: Int, skipped: [(name: String, reason: String)]) {
        var skipped: [(name: String, reason: String)] = []
        var imported = 0
        for file in files {
            if let error = nameError(file.name) { skipped.append((file.name, error.message)); continue }
            let id = "doc-\(UUID().uuidString.prefix(8))"
            state.docs.append(.init(id: id, name: file.name, lesson: false, archived: false, revision: 1))
            sources[id] = DocSource(text: file.text, revision: 1)
            imported += 1
        }
        publish()
        return (imported, skipped)
    }

    func exportAll() async throws -> [(name: String, text: String)] {
        state.docs.compactMap { doc in sources[doc.id].map { (doc.name, $0.text) } }
    }

    func accountAction(_ action: String) async throws {}
}
