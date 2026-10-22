import AppKit
import SeedToCodeKit
import SwiftUI
import WebKit

final class AppDelegate: NSObject, NSApplicationDelegate, WKNavigationDelegate, WKUIDelegate {
    let options: LaunchOptions
    private var window: NSWindow!
    private(set) var webView: WKWebView!
    private var runner: ProbeRunner?
    private var transport: CloudTransport?
    private var tokenStore: KeychainTokenStore?
    private var labModel: LabModel?

    static let appVersion = Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as? String ?? "0"

    init(options: LaunchOptions) {
        self.options = options
    }

    /// #filePath 锚定 Swift package，不依赖 Xcode 的工作目录。
    private static let packageRoot = URL(fileURLWithPath: #filePath)
        .deletingLastPathComponent().deletingLastPathComponent().deletingLastPathComponent()
    private let resources = AppResources.directory(bundleURL: Bundle.main.bundleURL,
        resourceURL: Bundle.main.resourceURL, packageRoot: AppDelegate.packageRoot)
    var webRoot: URL { resources.appendingPathComponent("web") }

    func baseURL() -> URL {
        switch options.origin {
        case .scheme: return URL(string: "\(AppSchemeHandler.scheme)://\(AppSchemeHandler.host)/")!
        case .remote: return options.remote.absoluteString.hasSuffix("/") ? options.remote : options.remote.appendingPathComponent("")
        }
    }

    /// export-web-spec.mjs 在打包时生成的那份网页规范（关键字、模板、样例、配色）。
    lazy var spec: CAIESpec? = {
        let url = resources.appendingPathComponent("web-spec.json")
        guard let data = try? Data(contentsOf: url) else { return nil }
        return try? CAIESpec.load(data)
    }()

    func applicationDidFinishLaunching(_ notification: Notification) {
        installMenus()
        if options.origin == .scheme || options.nativeLab || options.task == .editorCheck || options.task == .editorPerf {
            let missing = AppResources.missingFiles(in: resources)
            if !missing.isEmpty {
                showMissingResources(missing)
                return
            }
        }
        if options.nativeLab || options.task == .editorCheck || options.task == .editorPerf {
            return launchNativeEditor()
        }
        let config = WKWebViewConfiguration()
        // 持久化 store：默认 store 按 bundle identifier 落盘，重启后读回同一份。
        // 不用 nonPersistent()——那正是「每次打开都像新装」的那个。
        config.websiteDataStore = .default()
        config.setURLSchemeHandler(AppSchemeHandler(root: webRoot), forURLScheme: AppSchemeHandler.scheme)
        config.userContentController.addUserScript(WKUserScript(
            source: ProbeScripts.errorCollector, injectionTime: .atDocumentStart, forMainFrameOnly: true))

        // 原生云端传输只挂在包内页面上。remote 模式（直接加载 http(s) 站点）不挂：
        // 那时页面本来就同源，挂上反而会让 CloudClient 绕开浏览器 cookie 走原生通道，测的就不是同一条路了。
        if options.origin == .scheme {
            let store = KeychainTokenStore(server: options.apiBase)
            // 「刚装好」也包括钥匙串里没有上一次的登录。网站数据是异步清的，这个要在建传输之前同步清掉。
            if options.resetData { store.clear() }
            tokenStore = store
            let transport = CloudTransport(
                base: options.apiBase, store: store,
                userAgent: "SeedToCode-macOS/\(Self.appVersion)")
            self.transport = transport
            config.userContentController.addScriptMessageHandler(
                CloudBridge(transport: transport), contentWorld: .page, name: CloudBridge.name)
            // 能力声明：页面据此决定要不要调某项原生能力。没有它的地方（普通浏览器）一切照旧。
            config.userContentController.addUserScript(WKUserScript(source: """
                window.SeedToCodeNative = Object.freeze({ protocol: \(CloudBridge.protocolVersion), platform: "macos",
                  version: "\(Self.appVersion)", capabilities: Object.freeze(["cloud"]) });
                """, injectionTime: .atDocumentStart, forMainFrameOnly: true))
        }

        webView = WKWebView(frame: NSRect(x: 0, y: 0, width: 1280, height: 800), configuration: config)
        webView.navigationDelegate = self
        webView.uiDelegate = self
        webView.isInspectable = true

        window = NSWindow(contentRect: NSRect(x: 80, y: 80, width: 1280, height: 800),
                          styleMask: [.titled, .closable, .miniaturizable, .resizable],
                          backing: .buffered, defer: false)
        window.title = "SeedToCode（原型）"
        window.contentView = webView
        window.makeKeyAndOrderFront(nil)
        if options.task == .none { NSApp.activate(ignoringOtherApps: true) }

        Task { @MainActor in
            if options.resetData {
                await WKWebsiteDataStore.default().removeData(
                    ofTypes: WKWebsiteDataStore.allWebsiteDataTypes(), modifiedSince: .distantPast)
            }
            if options.blockNetwork { await installNetworkBlock(config.userContentController) }
            if options.task == .none {
                webView.load(URLRequest(url: baseURL().appendingPathComponent(options.startPage)))
            } else {
                let runner = ProbeRunner(options: options, webView: webView, base: baseURL(), webRoot: webRoot) { [self] in
                    // AppDelegate 与进程同寿，强引用没有环可言
                    [
                        "apiBase": options.apiBase.absoluteString,
                        "transportSignedIn": transport?.isSignedIn ?? false,
                        "keychainHasToken": tokenStore?.load() != nil
                    ] as [String: Any]
                }
                self.runner = runner
                await runner.run()
            }
        }
    }

    /// AppKit 通过菜单快捷键把编辑命令送给当前 first responder，WKWebView 与
    /// 原生文本框共用同一条响应链，不能把命令硬绑到某个编辑器或用 JS 改 value。
    private func installMenus() {
        let bar = NSMenu()
        let application = NSMenuItem()
        let applicationMenu = NSMenu(title: "SeedToCode")
        applicationMenu.addItem(withTitle: "退出 SeedToCode", action: #selector(NSApplication.terminate(_:)), keyEquivalent: "q")
        application.submenu = applicationMenu
        bar.addItem(application)

        let edit = NSMenuItem()
        let editMenu = NSMenu(title: "编辑")
        let commands: [(String, String, String, NSEvent.ModifierFlags)] = [
            ("撤销", "undo:", "z", .command),
            ("重做", "redo:", "z", [.command, .shift]),
            ("剪切", "cut:", "x", .command),
            ("复制", "copy:", "c", .command),
            ("粘贴", "paste:", "v", .command),
            ("全选", "selectAll:", "a", .command)
        ]
        for (title, action, key, modifiers) in commands {
            let item = editMenu.addItem(withTitle: title, action: NSSelectorFromString(action), keyEquivalent: key)
            item.keyEquivalentModifierMask = modifiers
            // nil target 由系统查找响应链，自动根据焦点与撤销栈启用菜单。
            item.target = nil
        }
        edit.submenu = editMenu
        bar.addItem(edit)
        NSApp.mainMenu = bar
    }

    private func showMissingResources(_ missing: [String]) {
        let message = "SeedToCode 缺少本地资源\n\n请先在仓库根目录运行：\n" +
            "native/macos/scripts/build-app.sh\n\n" +
            "Xcode / swift run 使用该脚本生成的完整资源；修改网页后需重新打包。\n\n" +
            "资源目录：\(resources.path)\n缺少：\(missing.joined(separator: ", "))"
        FileHandle.standardError.write(Data((message + "\n").utf8))
        if options.task != .none { exit(3) }
        window = NSWindow(contentRect: NSRect(x: 80, y: 80, width: 760, height: 360),
                          styleMask: [.titled, .closable, .miniaturizable, .resizable], backing: .buffered, defer: false)
        window.title = "SeedToCode · 资源未准备好"
        let label = NSTextField(wrappingLabelWithString: message)
        label.isSelectable = true
        label.translatesAutoresizingMaskIntoConstraints = false
        window.contentView?.addSubview(label)
        if let content = window.contentView {
            NSLayoutConstraint.activate([
                label.leadingAnchor.constraint(equalTo: content.leadingAnchor, constant: 24),
                label.trailingAnchor.constraint(equalTo: content.trailingAnchor, constant: -24),
                label.topAnchor.constraint(equalTo: content.topAnchor, constant: 24)
            ])
        }
        window.makeKeyAndOrderFront(nil)
        NSApp.activate(ignoringOtherApps: true)
    }

    /// 模拟断网：页面发出的任何 http(s) 请求（文档、脚本、fetch、Worker 里的 importScripts）都被 WebKit 拦下。
    private func installNetworkBlock(_ controller: WKUserContentController) async {
        let rules = #"[{"trigger":{"url-filter":"^https?://"},"action":{"type":"block"}}]"#
        if let list = try? await WKContentRuleListStore.default().compileContentRuleList(
            forIdentifier: "proto-block-network", encodedContentRuleList: rules) {
            controller.add(list)
        }
    }

    private func launchNativeEditor() {
        guard let spec else {
            FileHandle.standardError.write(Data("缺少 web-spec.json：用 scripts/build-app.sh 打包\n".utf8))
            exit(3)
        }
        window = NSWindow(contentRect: NSRect(x: 80, y: 80, width: 1280, height: 800),
                          styleMask: [.titled, .closable, .miniaturizable, .resizable],
                          backing: .buffered, defer: false)
        window.title = "SeedToCode 实验室（原生编辑器试用）"
        if options.task == .none {
            // 后台（CoreHost）还没有：先接 PreviewLabCore，数据全是假的、界面上明说
            labModel = LabModel(spec: spec, core: PreviewLabCore(spec: spec))
            window.title = "SeedToCode 实验室（原生 · 预览数据）"
            window.contentMinSize = NSSize(width: 1000, height: 640)
            window.contentView = NSHostingView(rootView: LabView(model: labModel!))
            window.makeKeyAndOrderFront(nil)
            NSApp.activate(ignoringOtherApps: true)
            // 截图后退出：给自动检查外观用
            if let tab = options.labDemoTab, let model = labModel {
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.6) {
                    let steps = ProcessInfo.processInfo.environment["LAB_DEMO_STEPS"] ?? "lint,edit,run"
                    if steps.contains("lint") { model.setSetting("lint", true) }
                    if steps.contains("edit") { model.editor.replace(NSRange(location: 0, length: 0), with: "output \"demo\"\n") }
                    if steps.contains("run") { model.run() }
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.4) {
                        model.inputText = "Ada"
                        model.submitInput()
                        model.tab = LabModel.Tab.allCases.first { "\($0)" == tab } ?? .output
                    }
                }
            }
            // 外观只用真实屏幕截图验收（scripts/shot.sh）。cacheDisplay 离屏截图走另一条绘制路径，
            // 曾经在屏幕上一个字都看不见的时候照样截出了完整的代码。
            if let seconds = options.holdSeconds { announceWindow(seconds) }
            return
        }
        window.makeKeyAndOrderFront(nil)
        let probe = EditorProbe(spec: spec, options: options, window: window)
        if let seconds = options.holdSeconds {
            // 把纯 AppKit 编辑器（自检用的同一套）留在屏幕上，供 scripts/shot.sh 截真实画面
            probe.editor.load(spec.samples.docs[0].source)
            announceWindow(seconds)
            return
        }
        // 等窗口真正上屏、第一次布局完成再测
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) { [options] in
            let result = probe.run()
            let data = (try? JSONSerialization.data(withJSONObject: result, options: [.prettyPrinted, .sortedKeys])) ?? Data()
            if let out = options.output { try? data.write(to: out) } else { FileHandle.standardOutput.write(data) }
            exit(0)
        }
    }

    /// 把窗口号打到 stderr（shot.sh 用它 screencapture -l），N 秒后退出。
    private func announceWindow(_ seconds: Double) {
        DispatchQueue.main.async { [window] in
            FileHandle.standardError.write(Data("WINDOW \(window?.windowNumber ?? -1)\n".utf8))
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + seconds) { exit(0) }
    }

    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool { true }

    // MARK: 导航边界

    func webView(_ webView: WKWebView, decidePolicyFor action: WKNavigationAction,
                 decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        guard let url = action.request.url else { return decisionHandler(.cancel) }
        if url.scheme == AppSchemeHandler.scheme && url.host == AppSchemeHandler.host { return decisionHandler(.allow) }
        if url.scheme == "about" || url.scheme == "blob" || url.scheme == "data" { return decisionHandler(.allow) }
        if options.origin == .remote, url.scheme == options.remote.scheme,
           url.host == options.remote.host, url.port == options.remote.port { return decisionHandler(.allow) }
        // 其余一律交给系统浏览器，而不是在 App 窗口里打开一个外站——
        // 外站拿到的就是 App 的主框架，将来 bridge 挂上之后这是越权入口。
        if action.navigationType == .linkActivated, url.scheme == "https" || url.scheme == "http" || url.scheme == "mailto" {
            NSWorkspace.shared.open(url)
        }
        decisionHandler(.cancel)
    }

    /// 换页：上一个页面在途的云端请求一并取消，和浏览器离开页面时的行为一致。
    func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
        transport?.cancelAll()
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        runner?.didFinish()
    }

    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        runner?.didFail(error)
    }

    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        runner?.didFail(error)
    }

    /// WebContent 进程退出（被系统回收或崩溃）时页面会变白。重新载入当前地址，
    /// 页面自己从持久化草稿恢复——计划 §5 要求以已落盘内容为准，不能清空。
    func webViewWebContentProcessDidTerminate(_ webView: WKWebView) {
        runner?.processTerminated()
        transport?.cancelAll()
        webView.reload()
    }

    // MARK: 页面里的 window.open / target=_blank

    func webView(_ webView: WKWebView, createWebViewWith configuration: WKWebViewConfiguration,
                 for action: WKNavigationAction, windowFeatures: WKWindowFeatures) -> WKWebView? {
        if let url = action.request.url {
            if url.scheme == AppSchemeHandler.scheme { webView.load(URLRequest(url: url)) } else { NSWorkspace.shared.open(url) }
        }
        return nil
    }
}
