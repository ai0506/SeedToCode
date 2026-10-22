import Foundation

/// 编辑器的输入约定，逐条移植自 web/js/app.js 的 keydown / input / paste 处理，
/// 行为以网页为准。纯函数：给定全文和选区，返回一次替换（或 nil 表示不接管，交给系统默认处理）。
///
/// 全部用 UTF-16 偏移（NSString），和 NSTextView 的 selectedRange 一致。
public struct TextEdit: Equatable, Sendable {
    /// 被替换的范围（替换前的坐标）
    public let range: NSRange
    public let replacement: String
    /// 替换后的选区
    public let selection: NSRange

    public init(range: NSRange, replacement: String, selection: NSRange) {
        self.range = range
        self.replacement = replacement
        self.selection = selection
    }

    public func applied(to text: String) -> String {
        (text as NSString).replacingCharacters(in: range, with: replacement)
    }
}

public struct EditRules: Sendable {
    public var indent: String
    public var autoIndent = true
    public var autoPair = true
    public var arrowConvert = true

    public init(indent: String) { self.indent = indent }

    var indentWidth: Int { (indent as NSString).length }

    // MARK: 行信息

    struct LineInfo {
        let start: Int, end: Int
        let text: String
        /// 行首到光标
        let before: String
    }

    static func lineInfo(_ text: NSString, at caret: Int) -> LineInfo {
        let lineRange = text.lineRange(for: NSRange(location: caret, length: 0))
        var end = lineRange.location + lineRange.length
        if end > lineRange.location, end <= text.length, text.character(at: end - 1) == 0x0A { end -= 1 }
        let start = lineRange.location
        return LineInfo(start: start, end: end,
                        text: text.substring(with: NSRange(location: start, length: end - start)),
                        before: text.substring(with: NSRange(location: start, length: caret - start)))
    }

    static func leadingSpaces(_ line: String) -> Int {
        line.utf16.prefix { $0 == 0x20 }.count
    }

    /// 某列是否落在字符串、字符字面量或注释里：← 转换与自动配对都要避开（app.js inLiteralOrComment）。
    public static func inLiteralOrComment(_ line: String, column: Int) -> Bool {
        let units = Array(line.utf16)
        var quote: UInt16?
        var i = 0
        while i < min(column, units.count) {
            let c = units[i]
            if let q = quote {
                if c == q { quote = nil }
            } else if c == 0x22 || c == 0x27 {
                quote = c
            } else if c == 0x2F, i + 1 < units.count, units[i + 1] == 0x2F {
                return true
            }
            i += 1
        }
        return quote != nil
    }

    // MARK: Tab / Shift+Tab

    public func tab(_ text: String, selection: NSRange, shift: Bool) -> TextEdit? {
        let ns = text as NSString
        let selected = ns.substring(with: selection)
        if selection.length > 0 && selected.contains("\n") {
            return indentLines(ns, selection: selection, remove: shift)
        }
        if shift {
            let li = Self.lineInfo(ns, at: selection.location)
            let lead = Self.leadingSpaces(li.text)
            guard lead > 0 else { return nil }
            // 退到上一个三空格停靠点，而不是固定删三个
            let cut = ((lead - 1) % indentWidth) + 1
            let caret = max(li.start, selection.location - cut)
            return TextEdit(range: NSRange(location: li.start, length: cut), replacement: "", selection: NSRange(location: caret, length: 0))
        }
        return insert(indent, replacing: selection)
    }

    func indentLines(_ ns: NSString, selection: NSRange, remove: Bool) -> TextEdit? {
        let start = Self.lineInfo(ns, at: selection.location).start
        let endProbe = selection.location + selection.length
        let end = Self.lineInfo(ns, at: endProbe).end
        let range = NSRange(location: start, length: end - start)
        let original = ns.substring(with: range)
        let block = original.components(separatedBy: "\n").map { line -> String in
            if !remove { return indent + line }
            let lead = Self.leadingSpaces(line)
            guard lead > 0 else { return line }
            return String(line.dropFirst(((lead - 1) % indentWidth) + 1))
        }.joined(separator: "\n")
        guard block != original else { return nil }
        return TextEdit(range: range, replacement: block, selection: NSRange(location: start, length: (block as NSString).length))
    }

    // MARK: 回车

    struct Opener { let pattern: NSRegularExpression; let close: String? }

    static let openers: [Opener] = [
        (#"^\s*IF\b.*\bTHEN\s*$"#, "ENDIF"),
        (#"^\s*(?:PUBLIC\s+|PRIVATE\s+)?PROCEDURE\b"#, "ENDPROCEDURE"),
        (#"^\s*(?:PUBLIC\s+|PRIVATE\s+)?FUNCTION\b"#, "ENDFUNCTION"),
        (#"^\s*WHILE\b"#, "ENDWHILE"),
        (#"^\s*CASE\s+OF\b"#, "ENDCASE"),
        (#"^\s*TYPE\s+[A-Za-z_]\w*\s*$"#, "ENDTYPE"),
        (#"^\s*CLASS\b"#, "ENDCLASS"),
        (#"^\s*REPEAT\s*$"#, "UNTIL <condition>"),
        (#"^\s*FOR\b"#, "NEXT"),
        (#"^\s*ELSE\s*$"#, nil)
    ].map { Opener(pattern: JSRegex.make($0.0, caseInsensitive: true), close: $0.1) }

    static let forVariable = JSRegex.make(#"FOR\s+([A-Za-z_]\w*)"#, caseInsensitive: true)

    public func newline(_ text: String, selection: NSRange) -> TextEdit? {
        guard autoIndent else { return nil }
        let ns = text as NSString
        let li = Self.lineInfo(ns, at: selection.location)
        let indentHere = String(repeating: " ", count: Self.leadingSpaces(li.text))
        let opener = Self.openers.first { JSRegex.test($0.pattern, li.text) }
        let trimmed: (String) -> String = { $0.trimmingCharacters(in: .whitespaces) }

        if let opener, trimmed(li.before) == trimmed(li.text) {
            let inner = indentHere + indent
            guard var closer = opener.close else { return insert("\n" + inner, replacing: selection) }
            if closer == "NEXT" {
                let lineNS = li.text as NSString
                if let m = Self.forVariable.firstMatch(in: li.text, range: NSRange(location: 0, length: lineNS.length)) {
                    closer = "NEXT " + lineNS.substring(with: m.range(at: 1))
                }
            }
            let rest = ns.substring(from: li.end)
            let firstWord = String(closer.split(separator: " ")[0])
            let already = JSRegex.test(JSRegex.make(#"^\s*\n\s*"# + NSRegularExpression.escapedPattern(for: firstWord), caseInsensitive: true), rest)
            let tail = already ? "" : "\n" + indentHere + closer
            return insert("\n" + inner + tail, replacing: selection, caretOffsetFromEnd: (tail as NSString).length)
        }
        return insert("\n" + indentHere, replacing: selection)
    }

    // MARK: 退格

    static let pairs: [String: String] = ["(": ")", "[": "]", "\"": "\"", "'": "'"]

    public func backspace(_ text: String, selection: NSRange) -> TextEdit? {
        guard selection.length == 0, selection.location > 0 else { return nil }
        let ns = text as NSString
        let s = selection.location
        let li = Self.lineInfo(ns, at: s)
        let col = s - li.start
        let before = (li.text as NSString).substring(to: col)
        // 行首缩进区域内：一次退回一个三空格层级
        if col > 0, before.utf16.allSatisfy({ $0 == 0x20 }) {
            let cut = ((col - 1) % indentWidth) + 1
            return TextEdit(range: NSRange(location: s - cut, length: cut), replacement: "", selection: NSRange(location: s - cut, length: 0))
        }
        // 光标夹在成对符号中间：两边一起删
        if autoPair, s < ns.length {
            let prev = ns.substring(with: NSRange(location: s - 1, length: 1))
            let next = ns.substring(with: NSRange(location: s, length: 1))
            if Self.pairs[prev] == next {
                return TextEdit(range: NSRange(location: s - 1, length: 2), replacement: "", selection: NSRange(location: s - 1, length: 0))
            }
        }
        return nil
    }

    // MARK: 输入单个字符（成对符号）

    public func type(_ character: String, in text: String, selection: NSRange) -> TextEdit? {
        guard autoPair else { return nil }
        let ns = text as NSString
        if let close = Self.pairs[character] {
            if selection.length > 0 {
                // 有选区时用符号包裹选中的内容，并保持原选区
                let selected = ns.substring(with: selection)
                return TextEdit(range: selection, replacement: character + selected + close,
                                selection: NSRange(location: selection.location + 1, length: selection.length))
            }
            let s = selection.location
            let next: String? = s < ns.length ? ns.substring(with: NSRange(location: s, length: 1)) : nil
            // 右侧紧跟单词或数字时不自动补全，避免把已有内容括进去
            let shouldClose = next == nil || next!.range(of: #"^[\s)\],:]$"#, options: .regularExpression) != nil
            let quoting = character == "\"" || character == "'"
            let li = Self.lineInfo(ns, at: s)
            if shouldClose && !(quoting && Self.inLiteralOrComment(li.text, column: s - li.start)) {
                return insert(character + close, replacing: selection, caretOffsetFromEnd: 1)
            }
        }
        // 跳过已经存在的右侧闭合符号
        if [")", "]", "\"", "'"].contains(character), selection.length == 0, selection.location < ns.length,
           ns.substring(with: NSRange(location: selection.location, length: 1)) == character {
            return TextEdit(range: NSRange(location: selection.location, length: 0), replacement: "",
                            selection: NSRange(location: selection.location + 1, length: 0))
        }
        return nil
    }

    // MARK: <- → ←

    /// 输入之后调用：光标前两个字符是 `<-` 且不在字符串/注释里，换成 `←`。
    public func arrow(_ text: String, caret: Int) -> TextEdit? {
        guard arrowConvert, caret >= 2 else { return nil }
        let ns = text as NSString
        guard ns.substring(with: NSRange(location: caret - 2, length: 2)) == "<-" else { return nil }
        let li = Self.lineInfo(ns, at: caret)
        guard !Self.inLiteralOrComment(li.text, column: caret - 2 - li.start) else { return nil }
        return TextEdit(range: NSRange(location: caret - 2, length: 2), replacement: "←", selection: NSRange(location: caret - 1, length: 0))
    }

    // MARK: 粘贴

    /// 制表符按 CAIE 规则转成三空格，并统一换行。
    public func normalizePaste(_ pasted: String) -> String {
        pasted.replacingOccurrences(of: "\r\n", with: "\n")
            .replacingOccurrences(of: "\r", with: "\n")
            .replacingOccurrences(of: "\t", with: indent)
    }

    // MARK: 结构模板

    /// 插入模板，`@@` 是光标位置。网页版按未缩进的正文算光标偏移，`@@` 在第二行以后时
    /// 光标会落在缩进之前；这里按缩进之后的真实位置算，落在缩进之后。
    public func snippet(_ body: String, in text: String, selection: NSRange) -> TextEdit {
        let ns = text as NSString
        let li = Self.lineInfo(ns, at: selection.location)
        let indentHere = String(repeating: " ", count: Self.leadingSpaces(li.text))
        let marker = "\u{0}"
        let lines = body.replacingOccurrences(of: "@@", with: marker).components(separatedBy: "\n")
        var joined = lines.enumerated().map { $0.offset == 0 ? $0.element : indentHere + $0.element }.joined(separator: "\n")
        let prefix = li.before.trimmingCharacters(in: .whitespaces).isEmpty ? "" : "\n" + indentHere
        joined = prefix + joined
        let caretInJoined = (joined as NSString).range(of: marker).location
        let finalText = joined.replacingOccurrences(of: marker, with: "")
        let caret = selection.location + (caretInJoined == NSNotFound ? (finalText as NSString).length : caretInJoined)
        return TextEdit(range: selection, replacement: finalText, selection: NSRange(location: caret, length: 0))
    }

    // MARK: 工具

    func insert(_ string: String, replacing selection: NSRange, caretOffsetFromEnd: Int = 0) -> TextEdit {
        let caret = selection.location + (string as NSString).length - caretOffsetFromEnd
        return TextEdit(range: selection, replacement: string, selection: NSRange(location: caret, length: 0))
    }
}

/// JS 正则语义的 `\b`、`\w`、`\d` 是 ASCII 的；ICU（NSRegularExpression）是 Unicode 的，
/// 中文算「单词字符」。直接搬过来，`中IF` 这类紧挨中文的情况会和网页判得不一样。
/// 这里把三者改写成 ASCII 版本再编译。
public enum JSRegex {
    static let word = "[A-Za-z0-9_]"

    public static func make(_ pattern: String, caseInsensitive: Bool = false) -> NSRegularExpression {
        let rewritten = pattern
            .replacingOccurrences(of: #"\b"#, with: "(?:(?<!\(word))(?=\(word))|(?<=\(word))(?!\(word)))")
            .replacingOccurrences(of: #"\w"#, with: word)
            .replacingOccurrences(of: #"\d"#, with: "[0-9]")
        return try! NSRegularExpression(pattern: rewritten, options: caseInsensitive ? [.caseInsensitive] : [])
    }

    public static func test(_ regex: NSRegularExpression, _ string: String) -> Bool {
        regex.firstMatch(in: string, range: NSRange(location: 0, length: (string as NSString).length)) != nil
    }
}
