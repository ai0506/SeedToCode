import Foundation
import UniformTypeIdentifiers
import WebKit

/// 把 App 包里的 web/ 目录以 `seedtocode://app/...` 提供给 WKWebView。
///
/// 为什么是自定义 scheme 而不是拦截 https：Apple 不允许给 WebKit 已经处理的
/// scheme 注册 handler（会直接抛异常），所以「假装自己是线上站点」这条路不存在。
/// 为什么不是 file://：file 来源下 localStorage/IndexedDB 的归属、
/// 跨页面导航和 fetch 都和 http 来源差得更远，而且没有地方挂原生云端传输。
final class AppSchemeHandler: NSObject, WKURLSchemeHandler {
    static let scheme = "seedtocode"
    static let host = "app"

    let root: URL

    init(root: URL) {
        self.root = root.standardizedFileURL.resolvingSymlinksInPath()
    }

    func webView(_ webView: WKWebView, start task: WKURLSchemeTask) {
        guard let url = task.request.url, url.host == Self.host else {
            return fail(task, status: 404)
        }
        var path = url.path
        if path.isEmpty || path == "/" { path = "/lab.html" }
        // 线上地址栏是无后缀的 /lab；页面里的链接写的是 lab.html。两种形状都要能打开，
        // 和 Workers Assets 的 auto-trailing-slash 行为对齐。
        var file = root.appendingPathComponent(String(path.dropFirst())).standardizedFileURL
        if file.pathExtension.isEmpty { file = file.appendingPathExtension("html") }

        // 路径越界检查：standardized 之后仍必须在 web 根目录里。
        // 页面能控制请求的路径（任何 <script src>、fetch），这里不挡住就等于能读整个包。
        let resolved = file.resolvingSymlinksInPath()
        guard resolved.path.hasPrefix(root.path + "/") else { return fail(task, status: 403) }

        guard let data = try? Data(contentsOf: resolved) else { return fail(task, status: 404) }
        let mime = UTType(filenameExtension: resolved.pathExtension)?.preferredMIMEType ?? "application/octet-stream"
        var headers = [
            "Content-Type": mime.hasPrefix("text/") || mime.hasSuffix("javascript") ? mime + "; charset=utf-8" : mime,
            "Content-Length": String(data.count),
            // 资源随 App 版本固定；禁缓存是为了原型里改完 web/ 重新打包立刻生效，
            // 正式版按资源清单版本切换，不靠 HTTP 缓存。
            "Cache-Control": "no-store"
        ]
        if mime == "text/html" {
            headers["Content-Security-Policy"] = "frame-ancestors 'none'"
        }
        let response = HTTPURLResponse(url: url, statusCode: 200, httpVersion: "HTTP/1.1", headerFields: headers)!
        task.didReceive(response)
        task.didReceive(data)
        task.didFinish()
    }

    func webView(_ webView: WKWebView, stop task: WKURLSchemeTask) {
        // 读本地文件是同步的，start 返回时已经结束，没有可取消的东西。
    }

    private func fail(_ task: WKURLSchemeTask, status: Int) {
        let response = HTTPURLResponse(url: task.request.url ?? URL(string: "seedtocode://app/")!,
                                       statusCode: status, httpVersion: "HTTP/1.1",
                                       headerFields: ["Content-Type": "text/plain; charset=utf-8"])!
        task.didReceive(response)
        task.didReceive(Data("\(status)".utf8))
        task.didFinish()
    }
}
