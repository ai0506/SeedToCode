import Foundation

/// 从响应头里取出对 `seedtocode_session` 的变更。
///
/// 自己解析而不交给 HTTPCookieStorage：凭证要存进钥匙串、由我们决定何时生效（见 generation），
/// 而 URLSession 自动存 cookie 会绕过这两点。服务端只用 Max-Age、不用 Expires
/// （server/src/auth.ts cookieHeader），所以合并后的头里不会出现日期里的逗号。
public enum SessionCookie {
    public static let name = "seedtocode_session"

    public enum Update: Equatable {
        case set(token: String, expiresAt: Date)
        case clear
    }

    public static func update(fromSetCookie header: String?, now: Date = Date()) -> Update? {
        guard let header, !header.isEmpty else { return nil }
        for cookie in split(header) {
            let attributes = cookie.split(separator: ";").map { $0.trimmingCharacters(in: .whitespaces) }
            guard let first = attributes.first, first.hasPrefix(name + "=") else { continue }
            let value = String(first.dropFirst(name.count + 1))
            var maxAge: Int?
            for attribute in attributes.dropFirst() {
                let pair = attribute.split(separator: "=", maxSplits: 1)
                if pair.count == 2, pair[0].lowercased() == "max-age" { maxAge = Int(pair[1]) }
            }
            if value.isEmpty || (maxAge ?? 1) <= 0 { return .clear }
            // 没有 Max-Age 的会话 cookie 不该出现；真出现了也按服务端的 30 天处理，而不是永久。
            let seconds = maxAge ?? 30 * 24 * 60 * 60
            return .set(token: value, expiresAt: now.addingTimeInterval(TimeInterval(seconds)))
        }
        return nil
    }

    /// 多个 Set-Cookie 被 Foundation 合并成一行时，以「逗号 + 下一个 name=」切开。
    static func split(_ header: String) -> [String] {
        var result: [String] = []
        var current = ""
        let scalars = Array(header)
        var index = 0
        while index < scalars.count {
            let character = scalars[index]
            if character == "," {
                // 往后看：跳过空白之后是不是 token= 的形状
                var look = index + 1
                while look < scalars.count, scalars[look] == " " { look += 1 }
                var probe = look
                while probe < scalars.count, scalars[probe].isLetter || scalars[probe].isNumber || scalars[probe] == "_" || scalars[probe] == "-" { probe += 1 }
                if probe > look, probe < scalars.count, scalars[probe] == "=" {
                    result.append(current)
                    current = ""
                    index = look
                    continue
                }
            }
            current.append(character)
            index += 1
        }
        if !current.isEmpty { result.append(current) }
        return result
    }
}
