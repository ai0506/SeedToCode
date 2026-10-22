import AppKit
import WebKit

/// 自动探针：载入页面 → 等页面自己初始化 → 在页面里跑脚本 → 结果写成 JSON → 退出。
/// 每一步都在真实 WKWebView 里，不是 Safari、也不是 jsdom——计划 §10 明确说
/// Chrome 检查不能替代 WKWebView 验收。
@MainActor
final class ProbeRunner {
    private let options: LaunchOptions
    private let webView: WKWebView
    private let base: URL
    private let webRoot: URL

    private var navigationErrors: [String] = []
    private var processTerminations = 0
    private var loadWaiter: CheckedContinuation<String?, Never>?
    private var firstLoadAt: Date?

    /// 页面 load 之后再等一会儿：lab 的 IndexedDB 镜像、CloudClient 探测都是异步的。
    private let settle: Double = 2.0

    /// 原生侧的会话状态（是否持有 token、钥匙串里有没有），用来和页面自己的说法对质。
    private let nativeState: () -> [String: Any]

    init(options: LaunchOptions, webView: WKWebView, base: URL, webRoot: URL, nativeState: @escaping () -> [String: Any] = { [:] }) {
        self.options = options
        self.nativeState = nativeState
        self.webView = webView
        self.base = base
        self.webRoot = webRoot
    }

    // MARK: 导航回调 → async

    func didFinish() {
        if firstLoadAt == nil { firstLoadAt = Date() }
        loadWaiter?.resume(returning: nil)
        loadWaiter = nil
    }

    func didFail(_ error: Error) {
        navigationErrors.append(error.localizedDescription)
        loadWaiter?.resume(returning: error.localizedDescription)
        loadWaiter = nil
    }

    func processTerminated() { processTerminations += 1 }

    /// 载入并等到 didFinish；返回错误描述或 nil。
    private func load(_ page: String) async -> String? {
        await withCheckedContinuation { continuation in
            loadWaiter = continuation
            webView.load(URLRequest(url: base.appendingPathComponent(page)))
        }
    }

    /// 不主动导航，只等下一次 didFinish（进程被杀后由 AppDelegate 触发的 reload）。
    private func nextLoad() async -> String? {
        await withCheckedContinuation { continuation in loadWaiter = continuation }
    }

    private func sleep(_ seconds: Double) async {
        try? await Task.sleep(nanoseconds: UInt64(seconds * 1_000_000_000))
    }

    /// 在页面里跑一段 async 函数体，约定它返回 JSON 字符串。
    private func evaluate(_ body: String, _ args: [String: Any] = [:]) async -> Any {
        do {
            let value = try await webView.callAsyncJavaScript(body, arguments: args, in: nil, contentWorld: .page)
            if let text = value as? String, let data = text.data(using: .utf8),
               let json = try? JSONSerialization.jsonObject(with: data) { return json }
            return String(describing: value ?? "nil")
        } catch {
            return ["evaluateError": error.localizedDescription]
        }
    }

    // MARK: 任务

    func run() async {
        // 整体看门狗：任何一步卡住都要以失败退出，而不是让自动化一直挂着。
        Task { @MainActor in
            await sleep(240)
            finish(["error": "watchdog timeout"], code: 2)
        }
        var report: [String: Any] = [:]
        switch options.task {
        case .probe: report["pages"] = [await probePage(options.startPage, script: ProbeScripts.probe)]
        case .pages:
            var results: [Any] = []
            for page in htmlPages() { results.append(await probePage(page, script: ProbeScripts.pageSummary)) }
            report["pages"] = results
        case .crash: report["crash"] = await crashRecovery()
        case .geometry:
            var results: [String: Any] = [:]
            for page in ["lab.html", "learn.html", "login.html", "task.html"] {
                _ = await load(page)
                await sleep(settle + 0.5)
                results[page] = await evaluate(ProbeScripts.geometry)
            }
            report["geometry"] = results
        case .perf: report["perf"] = await performance()
        case .script:
            guard let file = options.script, let body = try? String(contentsOf: file, encoding: .utf8) else {
                report["error"] = "--script missing or unreadable"
                break
            }
            if let error = await load(options.startPage) { report["loadError"] = error; break }
            await sleep(settle)
            let args = (try? JSONSerialization.jsonObject(with: Data(options.scriptArgs.utf8))) ?? [:]
            report["result"] = await evaluate(body, ["args": args])
            report["pageErrors"] = await evaluate("return JSON.stringify(window.__protoErrors || [])")
            if let path = options.snapshot { await snapshot(to: path) }
        case .none, .editorCheck, .editorPerf: return  // 编辑器任务由 EditorProbe 处理
        }
        finish(report, code: 0)
    }

    private func htmlPages() -> [String] {
        ((try? FileManager.default.contentsOfDirectory(atPath: webRoot.path)) ?? []).filter { $0.hasSuffix(".html") }.sorted()
    }

    private func probePage(_ page: String, script: String) async -> [String: Any] {
        if let error = await load(page) { return ["page": page, "loadError": error] }
        await sleep(settle)
        let result = await evaluate(script, ["remote": options.remote.absoluteString])
        if let path = options.snapshot, page == options.startPage || options.task == .probe { await snapshot(to: path) }
        return ["page": page, "result": result]
    }

    /// 计划 §5：WebContent 崩溃后以已持久化草稿为准。
    /// 两个标记：一个在自动保存（450ms 防抖）之后才杀，一个刚输入就杀——
    /// 前者必须在，后者按设计会丢，要量清楚丢的是什么，而不是笼统地说「能恢复」。
    private func crashRecovery() async -> [String: Any] {
        _ = await load("lab.html")
        await sleep(settle)
        let stamp = String(Int(Date().timeIntervalSince1970))
        let saved = "// __crash saved \(stamp)"
        let unsaved = "// __crash unsaved \(stamp)"
        let before = await evaluate(ProbeScripts.typeLine, ["line": saved])
        await sleep(1.5)
        let typedUnsaved = await evaluate(ProbeScripts.typeLine, ["line": unsaved])
        let pidBefore = webContentPID()
        let killedAt = Date()
        if let pid = pidBefore { kill(pid, SIGKILL) }
        let reloadError = await nextLoad()
        let recoveredMs = Int(Date().timeIntervalSince(killedAt) * 1000)
        await sleep(settle)
        let after = await evaluate(ProbeScripts.findLines, ["lines": [saved, unsaved]])
        return [
            "webContentPidBefore": pidBefore.map { Int($0) } ?? -1,
            "webContentPidAfter": webContentPID().map { Int($0) } ?? -1,
            "processTerminations": processTerminations,
            "killToReloadFinishedMs": recoveredMs,
            "reloadError": reloadError ?? NSNull(),
            "typedSaved": before, "typedUnsaved": typedUnsaved,
            "afterReload": after
        ]
    }

    private func performance() async -> [String: Any] {
        let loadError = await load("lab.html")
        let launchToFirstLoadMs = firstLoadAt.map { Int($0.timeIntervalSince(processStart) * 1000) } ?? -1
        await sleep(settle)
        let page = await evaluate(ProbeScripts.performance)
        return [
            "launchToFirstDidFinishMs": launchToFirstLoadMs,
            "loadError": loadError ?? NSNull(),
            "page": page,
            "webContentMemory": webContentMemory()
        ]
    }

    // MARK: 原生侧量具

    /// WKWebView 的 WebContent 进程号。私有 KVC，只在原型里用：杀自己的那个进程、读它的内存。
    /// 不能用 pkill WebContent——那会连带杀掉 Safari 的标签页。
    private func webContentPID() -> pid_t? {
        (webView.value(forKey: "_webProcessIdentifier") as? NSNumber).map { pid_t($0.int32Value) }
    }

    private func webContentMemory() -> [String: Any] {
        guard let pid = webContentPID() else { return ["error": "no pid"] }
        var info = rusage_info_v4()
        let ok = withUnsafeMutablePointer(to: &info) {
            $0.withMemoryRebound(to: rusage_info_t?.self, capacity: 1) { proc_pid_rusage(pid, RUSAGE_INFO_V4, $0) }
        }
        guard ok == 0 else { return ["error": "proc_pid_rusage failed"] }
        return [
            "physFootprintMB": Double(info.ri_phys_footprint) / 1_048_576,
            "lifetimeMaxPhysFootprintMB": Double(info.ri_lifetime_max_phys_footprint) / 1_048_576
        ]
    }

    private func snapshot(to path: URL) async {
        guard let image = try? await webView.takeSnapshot(configuration: nil),
              let tiff = image.tiffRepresentation, let rep = NSBitmapImageRep(data: tiff),
              let png = rep.representation(using: .png, properties: [:]) else { return }
        try? png.write(to: path)
    }

    private func finish(_ body: [String: Any], code: Int32) {
        var report: [String: Any] = [
            "origin": options.origin.rawValue,
            "base": base.absoluteString,
            "task": options.task.rawValue,
            "resetData": options.resetData,
            "blockNetwork": options.blockNetwork,
            "webKitProcessTerminations": processTerminations,
            "navigationErrors": navigationErrors,
            "system": ProcessInfo.processInfo.operatingSystemVersionString,
            "bundleIdentifier": Bundle.main.bundleIdentifier ?? "(none)",
            "webRevision": Bundle.main.object(forInfoDictionaryKey: "SeedToCodeWebRevision") ?? "unknown"
        ]
        report["nativeSession"] = nativeState()
        for (k, v) in body { report[k] = v }
        let data = (try? JSONSerialization.data(withJSONObject: report, options: [.prettyPrinted, .sortedKeys])) ?? Data()
        if let out = options.output { try? data.write(to: out) } else { FileHandle.standardOutput.write(data) }
        exit(code)
    }
}
