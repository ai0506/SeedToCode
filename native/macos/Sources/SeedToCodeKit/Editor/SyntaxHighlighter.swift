import Foundation

/// 逐行分词，规则移植自 web/js/lang.js（同一条正则、同一套分类），
/// 这样原生编辑器和网页的颜色在同一份代码上一个字符都不差。
///
/// 位置一律是 UTF-16 偏移（NSString / NSRange），和 NSTextView、JS 字符串下标一致——
/// 中文、← 都是一个 UTF-16 单元，不能按 Character 数。
public struct SyntaxHighlighter: Sendable {
    public enum Kind: String, Sendable {
        case comment, string, char, number, op, type, keyword, builtin, keywordLower, ident
    }

    public struct Token: Equatable, Sendable {
        public let range: NSRange
        public let kind: Kind
    }

    private let keywords: Set<String>
    private let types: Set<String>
    private let builtins: Set<String>

    // 与 lang.js 的 TOKEN_RE 逐项对应；按 JS 的 ASCII \b、\d 语义编译（见 JSRegex）。
    private static let regex = JSRegex.make([
        #"(//[^\n]*)"#,
        #"("(?:[^"\\]|\\.)*"?)"#,
        #"('(?:[^'\\]|\\.)*'?)"#,
        #"(\b\d+\.\d+\b|\b\d+\b)"#,
        #"(←|<-|<>|>=|<=|[+\-*/=<>&^])"#,
        #"([A-Za-z_][A-Za-z0-9_]*)"#
    ].joined(separator: "|"))

    public init(spec: CAIESpec) {
        keywords = Set(spec.keywords)
        types = Set(spec.types)
        builtins = Set(spec.builtins.map(\.name))
    }

    /// `line` 是一行文本（不含换行），`offset` 是这一行在全文中的起点，返回的 range 已加上它。
    public func tokens(line: NSString, offset: Int = 0) -> [Token] {
        var result: [Token] = []
        Self.regex.enumerateMatches(in: line as String, range: NSRange(location: 0, length: line.length)) { match, _, _ in
            guard let match else { return }
            let range = NSRange(location: match.range.location + offset, length: match.range.length)
            let kind: Kind
            if match.range(at: 1).location != NSNotFound { kind = .comment }
            else if match.range(at: 2).location != NSNotFound { kind = .string }
            else if match.range(at: 3).location != NSNotFound { kind = .char }
            else if match.range(at: 4).location != NSNotFound { kind = .number }
            else if match.range(at: 5).location != NSNotFound { kind = .op }
            else { kind = classify(line.substring(with: match.range(at: 6))) }
            result.append(Token(range: range, kind: kind))
        }
        return result
    }

    /// lang.js 的判定顺序：全大写才算类型/关键字/内置函数；小写写法的关键字单独一类（会被提示）。
    func classify(_ word: String) -> Kind {
        let upper = word.uppercased()
        let isUpper = word == upper
        if types.contains(upper) && isUpper { return .type }
        if keywords.contains(upper) && isUpper { return .keyword }
        if builtins.contains(upper) && isUpper { return .builtin }
        if keywords.contains(upper) || types.contains(upper) { return .keywordLower }
        return .ident
    }
}
