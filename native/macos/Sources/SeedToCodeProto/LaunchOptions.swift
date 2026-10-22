import Foundation

/// 原型的命令行开关。正式 App 不会有这些，它们只服务于可重复的探针。
struct LaunchOptions {
    /// scheme：包内资源走 seedtocode://app/。remote：直接加载一个 http(s) 站点——
    /// 线上站点做对照，或本机静态服务（同一份 web/ 文件）用来隔离「自定义 scheme 本身」的影响。
    enum Origin: String { case scheme, remote }
    enum Task: String {
        case none, probe, pages, crash, geometry, perf, script
        case editorCheck = "editor-check", editorPerf = "editor-perf"
    }

    var origin: Origin = .scheme
    var remote = URL(string: "http://127.0.0.1:8787")!
    var task: Task = .none
    var output: URL?
    var snapshot: URL?
    var startPage = "lab.html"
    /// 先清掉这个 App 的全部网站数据，模拟「刚装好第一次打开」。
    var resetData = false
    /// 用 WebKit 内容规则拦掉页面发出的全部 http(s) 请求：模拟断网。
    /// 只是模拟——navigator.onLine 仍为 true，真断网要另测。
    var blockNetwork = false
    /// 原生云端传输连哪台服务器。默认本机；只允许改成本机回环地址（本机 wrangler dev 联调用）。
    /// 页面改不了它——它只来自启动参数，能改启动参数的人本来就能对这台机器做任何事。
    var apiBase = URL(string: "http://127.0.0.1:8787")!
    /// --task script：在 startPage 里执行这个文件里的 async 函数体，参数是 --args 的 JSON 对象（以 args 传入）。
    var script: URL?
    var scriptArgs = "{}"
    /// 打开原生编辑器试用窗口，而不是网页版实验室（F1 阶段，见 MACOS_NATIVE_LAB_PLAN.md）。
    var nativeLab = false
    /// 截图前先自动走一遍：开语法检测、运行、给 INPUT、切到这个标签（output / problems / debug / files）
    var labDemoTab: String?
    /// 窗口在屏幕上停留 N 秒后退出。配合 scripts/shot.sh 截**真实屏幕画面**用。
    var holdSeconds: Double?

    static func parse(_ args: [String]) -> LaunchOptions {
        var options = LaunchOptions()
        var index = 0
        func next() -> String? {
            index += 1
            return index < args.count ? args[index] : nil
        }
        while index < args.count {
            switch args[index] {
            case "--origin":
                if let v = next() { options.origin = (v == "https" || v == "remote") ? .remote : .scheme }
            case "--remote": if let v = next(), let u = URL(string: v) { options.remote = u }
            case "--task": if let v = next(), let t = Task(rawValue: v) { options.task = t }
            case "--out": if let v = next() { options.output = URL(fileURLWithPath: v) }
            case "--snapshot": if let v = next() { options.snapshot = URL(fileURLWithPath: v) }
            case "--start": if let v = next() { options.startPage = v }
            case "--reset-data": options.resetData = true
            case "--block-network": options.blockNetwork = true
            case "--native-lab": options.nativeLab = true
            case "--lab-demo": if let v = next() { options.labDemoTab = v }
            case "--hold": if let v = next() { options.holdSeconds = Double(v) }
            case "--script": if let v = next() { options.script = URL(fileURLWithPath: v) }
            case "--args": if let v = next() { options.scriptArgs = v }
            case "--api-base":
                if let v = next(), let u = URL(string: v), ["127.0.0.1", "localhost", "::1"].contains(u.host ?? ""),
                   u.scheme == "http" || u.scheme == "https", u.path.isEmpty || u.path == "/" {
                    options.apiBase = u
                } else {
                    FileHandle.standardError.write(Data("--api-base 只接受本机回环地址，已忽略\n".utf8))
                }
            default: break  // Xcode / LaunchServices 会塞进 -NSDocumentRevisionsDebugMode 之类的参数，忽略
            }
            index += 1
        }
        return options
    }
}
