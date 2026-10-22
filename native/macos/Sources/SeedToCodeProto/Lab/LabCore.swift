import Foundation

// 原生实验室 ↔ 后台（CoreHost）的接口。字段与语义以 docs/plans/MACOS_NATIVE_LAB_PLAN.md §4 为准，
// 这里是它的 Swift 形态。界面只依赖这个协议：现在由 PreviewLabCore（内存假数据）实现，
// Codex 的 CoreHost 完成后替换，界面不用改。

// MARK: 状态快照（§4.2）

struct LabState: Codable, Equatable {
    struct Project: Codable, Equatable, Identifiable { var id: String; var name: String; var lesson: Bool }
    struct Doc: Codable, Equatable, Identifiable { var id: String; var name: String; var lesson: Bool; var archived: Bool; var revision: Int }
    struct RuntimeFile: Codable, Equatable, Identifiable { var id: String; var name: String; var kind: String; var size: Int; var restorable: Bool }
    struct Settings: Codable, Equatable {
        var theme: String              // light | dark | system
        var fontSize: Int
        var lineNumbers: Bool
        var arrowConvert: Bool
        var autoIndent: Bool
        var autoPair: Bool
        var lint: Bool
        var runtimeProfile: String     // core-2027 | advanced-2027
        var showArchivedLessons: Bool
    }
    struct Account: Codable, Equatable {
        struct User: Codable, Equatable { var role: String; var email: String?; var username: String? }
        struct Sync: Codable, Equatable { var state: String; var pending: Int; var blocked: Int; var lastError: String? }
        struct Hold: Codable, Equatable { var fromGuest: Bool; var asked: Bool; var projects: Int; var progress: Int; var drafts: Int }
        var configured: Bool
        var signedIn: Bool
        var user: User?
        var sync: Sync
        var hold: Hold?
    }

    var projects: [Project]
    var currentProjectId: String
    var docs: [Doc]
    var activeDocId: String?
    var runtimeFiles: [RuntimeFile]
    var settings: Settings
    var saveState: String              // saved | saving
    var account: Account
}

// MARK: 诊断（§4.4 lint）

struct LintDiagnostic: Codable, Equatable, Identifiable {
    struct Edit: Codable, Equatable { var start: Int; var end: Int; var text: String }
    struct Fix: Codable, Equatable { var title: String; var edits: [Edit] }
    /// UTF-16 偏移，和 NSString / JS 字符串下标一致
    var start: Int
    var end: Int
    var line: Int
    var column: Int
    var severity: String               // error | caie | hint
    var code: String
    var message: String
    var blocking: Bool
    var fixes: [Fix]
    var id: String { "\(start)-\(end)-\(code)" }
}

// MARK: 运行事件（§4.5）

/// 追踪表已经是「显示用」的形态：哪格写什么、是否标灰/标同值/标 BYREF，
/// 由后台用和网页同一个函数算好（lab-model 里的 trace 格式化），原生只负责画。
struct TraceColumn: Codable, Equatable, Identifiable {
    var variableId: String
    var name: String
    var scopeLabel: String?
    var id: String { variableId }
}

struct TraceCell: Codable, Equatable {
    var text: String
    /// none | unassigned | same | byref | same-byref
    var style: String
    /// 悬浮说明（BYREF 来源、值未改变），可空
    var note: String?
}

struct TraceDisplayRow: Codable, Equatable, Identifiable {
    var step: Int
    var line: Int
    var action: String
    var output: String
    /// 与 columns 一一对应
    var cells: [TraceCell]
    /// 「已省略 N 步」这类占位行时有值，其余字段无意义
    var omittedText: String?
    var id: String { omittedText == nil ? "s\(step)" : "omitted" }
}

struct RuntimeVariableRow: Codable, Equatable, Identifiable {
    var name: String
    var kind: String                   // 已是中文：变量 / CONSTANT / 循环变量
    var type: String
    var value: String
    var id: String { name }
}

struct FileHandleRow: Codable, Equatable, Identifiable {
    var name: String
    var mode: String
    var position: String
    var id: String { name }
}

enum RunEvent: Equatable {
    case output(lines: [String])
    case line(Int)
    case inputRequested(variable: String, type: String)
    case inputRejected(message: String)
    case variables([RuntimeVariableRow], stack: [String])
    case handles([FileHandleRow])
    /// columns 为完整列表（列会在运行途中增加）；rows 为本批新增行
    case trace(columns: [TraceColumn], rows: [TraceDisplayRow], status: String?)
    /// statusText 已是中文状态行，例如「运行结束 · 活动用时 12 ms · 113 步 · 状态 正常」
    case finished(status: String, statusText: String, errorLine: Int?, errorMessage: String?)
}

enum LabEvent {
    case state(LabState)
    case docChanged(docId: String, revision: Int)
    case run(runId: String, RunEvent)
}

struct LabError: Error, Equatable {
    var code: String
    var message: String
}

struct DocSource: Equatable { var text: String; var revision: Int }

enum RunStart: Equatable {
    case started(runId: String)
    case preflight([LintDiagnostic])
}

// MARK: 协议（§4.4）

@MainActor
protocol LabCore: AnyObject {
    /// 第一条事件必须是完整的 .state
    var events: AsyncStream<LabEvent> { get }

    func switchProject(_ id: String) async throws
    func createProject(name: String) async throws -> String
    func renameProject(_ id: String, name: String) async throws
    func deleteProject(_ id: String) async throws

    func openDoc(_ id: String) async throws
    func createDoc(name: String) async throws -> String
    func renameDoc(_ id: String, name: String) async throws
    func deleteDoc(_ id: String) async throws -> String          // undoToken
    func undoDelete(_ token: String) async throws
    func source(of docId: String) async throws -> DocSource
    /// baseRevision 过期时抛 LabError(code: "STALE")
    func setSource(_ docId: String, text: String, baseRevision: Int) async throws -> Int

    func setSetting(_ key: String, value: Any) async throws
    func lint(_ source: String, profile: String) async throws -> [LintDiagnostic]
    func format(_ source: String) async throws -> String

    func startRun(docId: String, profile: String, trace: Bool) async throws -> RunStart
    func provideInput(runId: String, value: String) async throws -> (accepted: Bool, message: String?)
    func stopRun(_ runId: String) async throws

    func importDocs(_ files: [(name: String, text: String)], target: String) async throws -> (imported: Int, skipped: [(name: String, reason: String)])
    func exportAll() async throws -> [(name: String, text: String)]

    func accountAction(_ action: String) async throws
}
