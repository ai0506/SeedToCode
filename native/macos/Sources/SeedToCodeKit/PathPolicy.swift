import Foundation

/// 页面能让原生侧代发哪些请求。设计见 docs/plans/MACOS_CLOUD_TRANSPORT.md §5.2。
///
/// 为什么是前缀白名单而不是逐条列接口：主机写死成本站，每个接口自己又做鉴权，
/// 逐条列出带不来更多安全；却让服务端每加一个接口都要同步改 App，漏改就是静默失败。
public enum PathPolicy {
    public static let methods: Set<String> = ["GET", "POST", "PUT", "DELETE"]
    public static let prefixes = ["/auth/", "/api/"]

    /// 路径部分允许的字符：非保留字符、`/`、百分号编码。
    private static let pathCharacters = CharacterSet(charactersIn:
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.~/%")
    /// 查询串额外允许 `=`、`&`、`+`。
    private static let queryCharacters = pathCharacters.union(CharacterSet(charactersIn: "=&+"))

    /// 合法就返回拼好的 URL，否则 nil。拼完再核对一次主机没变——这是最后一道闸，
    /// 前面任何一条规则漏了，也不会把凭证带到别的主机上去。
    public static func url(base: URL, method: String, path: String) -> URL? {
        guard methods.contains(method) else { return nil }
        guard path.count <= 2048 else { return nil }
        let parts = path.split(separator: "?", maxSplits: 1, omittingEmptySubsequences: false)
        let pathPart = String(parts[0])
        let query = parts.count > 1 ? String(parts[1]) : nil

        guard prefixes.contains(where: { pathPart.hasPrefix($0) }) else { return nil }
        guard pathPart.unicodeScalars.allSatisfy({ pathCharacters.contains($0) }) else { return nil }
        if let query, !query.unicodeScalars.allSatisfy({ queryCharacters.contains($0) }) { return nil }

        // 逐段检查：空段（`//`）和解码后是 `.` / `..` 的段一律拒绝。
        // 不能笼统地拒绝含 `..` 的字符串——课程小节 id 是 `1.2.1` 这种形状。
        let segments = pathPart.dropFirst().split(separator: "/", omittingEmptySubsequences: false)
        for segment in segments {
            guard !segment.isEmpty else { return nil }
            guard let decoded = String(segment).removingPercentEncoding else { return nil }
            if decoded == "." || decoded == ".." { return nil }
            if decoded.contains("\\") || decoded.unicodeScalars.contains(where: { $0.value < 0x20 }) { return nil }
        }

        guard var components = URLComponents(url: base, resolvingAgainstBaseURL: false) else { return nil }
        components.percentEncodedPath = pathPart
        components.percentEncodedQuery = query
        guard let url = components.url,
              url.scheme == base.scheme, url.host == base.host, url.port == base.port,
              url.user == nil, url.password == nil else { return nil }
        return url
    }

    /// 会下发会话 cookie 的接口。只有这几条的响应里的 Set-Cookie 会被接收。
    public static let sessionIssuingPaths: Set<String> = [
        "/auth/email/login", "/auth/email/verify",
        "/auth/student/activate", "/auth/student/register", "/auth/student/login"
    ]
    public static let logoutPath = "/auth/logout"

    public static func pathOnly(_ path: String) -> String {
        String(path.split(separator: "?", maxSplits: 1, omittingEmptySubsequences: false)[0])
    }
}
