import Foundation

/// 替页面把请求送到本站 API。设计见 docs/plans/MACOS_CLOUD_TRANSPORT.md。
///
/// 它只负责「送出去、拿回文本」；JSON 解析、错误归一、账号分桶全在页面的
/// CloudClient / SyncEngine 里，和网页版共用一份。这里不重复任何业务规则。
@MainActor
public final class CloudTransport {
    public struct Response: Equatable {
        public let status: Int
        public let contentType: String?
        public let retryAfter: String?
        public let text: String
    }

    public enum Failure: String, Error {
        case offline, timeout, rejected, tooLarge, cancelled
    }

    public static let maxRequestBytes = 4 * 1024 * 1024
    public static let maxResponseBytes = 16 * 1024 * 1024

    public let base: URL
    private let store: TokenStore
    private let session: URLSession
    private let userAgent: String

    private var token: String?
    /// token 每被替换或清除一次就加 1。见 §5.4：晚到的响应若跨过了一次换代，
    /// 它带的 Set-Cookie 和 401 都属于上一个账号，不能作用在现在这个上。
    public private(set) var generation = 0
    private var tasks: [String: Task<Result<Response, Failure>, Never>] = [:]

    public init(base: URL, store: TokenStore, userAgent: String, protocolClasses: [AnyClass]? = nil) {
        self.base = base
        self.store = store
        self.userAgent = userAgent

        let config = URLSessionConfiguration.ephemeral
        // cookie 全部手动管：不让 URLSession 存，也不让它自动带。
        config.httpShouldSetCookies = false
        config.httpCookieAcceptPolicy = .never
        config.httpCookieStorage = nil
        config.urlCache = nil
        config.requestCachePolicy = .reloadIgnoringLocalCacheData
        config.httpMaximumConnectionsPerHost = 6
        if let protocolClasses { config.protocolClasses = protocolClasses }
        session = URLSession(configuration: config, delegate: NoRedirects(), delegateQueue: nil)

        if let stored = store.load(), stored.expiresAt > Date() {
            token = stored.token
        } else {
            store.clear()
        }
    }

    public var isSignedIn: Bool { token != nil }

    public func send(requestId: String, method: String, path: String, body: String?) async -> Result<Response, Failure> {
        let task = Task { await perform(method: method, path: path, body: body) }
        tasks[requestId] = task
        let result = await task.value
        tasks[requestId] = nil
        return result
    }

    public func cancel(requestId: String) {
        tasks[requestId]?.cancel()
    }

    /// 页面跳转或重载：上一个页面发出的请求一并取消，和浏览器的行为一致。
    public func cancelAll() {
        for task in tasks.values { task.cancel() }
    }

    private func perform(method: String, path: String, body: String?) async -> Result<Response, Failure> {
        guard let url = PathPolicy.url(base: base, method: method, path: path) else { return .failure(.rejected) }
        let bodyData = body.map { Data($0.utf8) }
        if let bodyData, bodyData.count > Self.maxRequestBytes { return .failure(.tooLarge) }

        let route = PathPolicy.pathOnly(path)
        var request = URLRequest(url: url)
        request.httpMethod = method
        request.httpBody = bodyData
        request.timeoutInterval = route == "/api/runs" ? 60 : 30
        request.setValue("application/json", forHTTPHeaderField: "Accept")
        request.setValue(userAgent, forHTTPHeaderField: "User-Agent")
        if bodyData != nil { request.setValue("application/json", forHTTPHeaderField: "Content-Type") }
        if let token { request.setValue("\(SessionCookie.name)=\(token)", forHTTPHeaderField: "Cookie") }

        // 退出：带着当前 token 发出去让服务端删掉那条 session，但本地立刻就清。
        // 断网、超时、服务端出错都不影响「这台机器上已经没有凭证了」这件事。
        if route == PathPolicy.logoutPath { apply(.clear) }
        let sentGeneration = generation

        let data: Data
        let response: URLResponse
        do {
            (data, response) = try await session.data(for: request)
        } catch {
            if Task.isCancelled || (error as? URLError)?.code == .cancelled { return .failure(.cancelled) }
            if (error as? URLError)?.code == .timedOut { return .failure(.timeout) }
            return .failure(.offline)
        }
        guard let http = response as? HTTPURLResponse else { return .failure(.offline) }
        if data.count > Self.maxResponseBytes { return .failure(.tooLarge) }
        let text = String(decoding: data, as: UTF8.self)

        if sentGeneration == generation {
            if PathPolicy.sessionIssuingPaths.contains(route), (200..<300).contains(http.statusCode),
               let update = SessionCookie.update(fromSetCookie: http.value(forHTTPHeaderField: "Set-Cookie")) {
                apply(update)
            } else if http.statusCode == 401, Self.errorCode(text) == "UNAUTHENTICATED", token != nil {
                // 服务端说会话已失效。只认 UNAUTHENTICATED：登录密码错也是 401，
                // 但那是 INVALID_CREDENTIALS，不能因此把现有登录清掉。
                apply(.clear)
            }
        }

        return .success(Response(
            status: http.statusCode,
            contentType: http.value(forHTTPHeaderField: "Content-Type"),
            retryAfter: http.value(forHTTPHeaderField: "Retry-After"),
            text: text))
    }

    private func apply(_ update: SessionCookie.Update) {
        switch update {
        case .set(let value, let expiresAt):
            token = value
            store.save(token: value, expiresAt: expiresAt)
        case .clear:
            token = nil
            store.clear()
        }
        generation += 1
    }

    static func errorCode(_ text: String) -> String? {
        guard let data = text.data(using: .utf8),
              let object = try? JSONSerialization.jsonObject(with: data) as? [String: Any] else { return nil }
        return object["code"] as? String
    }
}

/// API 不该重定向；真遇到了，把 3xx 原样交回页面，不跟过去——跟过去就是把 Cookie 头带到别处。
private final class NoRedirects: NSObject, URLSessionTaskDelegate {
    func urlSession(_ session: URLSession, task: URLSessionTask, willPerformHTTPRedirection response: HTTPURLResponse,
                    newRequest request: URLRequest, completionHandler: @escaping (URLRequest?) -> Void) {
        completionHandler(nil)
    }
}
