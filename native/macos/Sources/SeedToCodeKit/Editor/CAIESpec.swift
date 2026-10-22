import Foundation

/// 由 scripts/export-web-spec.mjs 从网页源文件导出的那份 JSON。
/// 关键字、模板、出厂样例、配色都以网页为准，Swift 这边不留副本。
public struct CAIESpec: Decodable, Sendable {
    public struct Builtin: Decodable, Sendable { public let name: String; public let signature: String; public let description: String }
    public struct Snippet: Decodable, Sendable { public let label: String; public let body: String }
    public struct SampleDoc: Decodable, Sendable { public let id: String; public let name: String; public let source: String }
    public struct Samples: Decodable, Sendable { public let docs: [SampleDoc] }
    public struct Themes: Decodable, Sendable { public let light: [String: String]; public let dark: [String: String] }

    public let version: String
    public let indent: String
    public let keywords: [String]
    public let types: [String]
    public let builtins: [Builtin]
    public let snippets: [Snippet]
    public let samples: Samples
    public let theme: Themes

    public static func load(_ data: Data) throws -> CAIESpec {
        try JSONDecoder().decode(CAIESpec.self, from: data)
    }
}

/// CSS 颜色（`#rrggbb` 或 `rgba(r, g, b, a)`）→ 0…1 分量。styles.css 里只出现这两种写法。
public struct RGBA: Equatable, Sendable {
    public let r: Double, g: Double, b: Double, a: Double

    public init(r: Double, g: Double, b: Double, a: Double) { self.r = r; self.g = g; self.b = b; self.a = a }

    public init?(css: String) {
        let s = css.trimmingCharacters(in: .whitespaces).lowercased()
        if s.hasPrefix("#"), s.count == 7, let v = UInt32(s.dropFirst(), radix: 16) {
            self.init(r: Double((v >> 16) & 0xff) / 255, g: Double((v >> 8) & 0xff) / 255, b: Double(v & 0xff) / 255, a: 1)
            return
        }
        if s.hasPrefix("rgba("), s.hasSuffix(")") {
            let parts = s.dropFirst(5).dropLast().split(separator: ",").map { Double($0.trimmingCharacters(in: .whitespaces)) }
            guard parts.count == 4, let r = parts[0], let g = parts[1], let b = parts[2], let a = parts[3] else { return nil }
            self.init(r: r / 255, g: g / 255, b: b / 255, a: a)
            return
        }
        return nil
    }
}
