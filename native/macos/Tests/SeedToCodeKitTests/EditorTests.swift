import XCTest
@testable import SeedToCodeKit

/// 仓库根目录与 node：规范 JSON 由导出脚本现导，高亮结果拿网页那份 lang.js 现跑来对照。
enum Repo {
    static let root = URL(fileURLWithPath: #filePath)
        .deletingLastPathComponent().deletingLastPathComponent().deletingLastPathComponent()
        .deletingLastPathComponent().deletingLastPathComponent()

    static func node(_ args: [String], stdin: String? = nil) throws -> Data {
        let process = Process()
        process.executableURL = URL(fileURLWithPath: "/usr/bin/env")
        process.arguments = ["node"] + args
        process.currentDirectoryURL = root
        let out = Pipe()
        process.standardOutput = out
        if let stdin {
            let input = Pipe()
            process.standardInput = input
            try process.run()
            input.fileHandleForWriting.write(Data(stdin.utf8))
            input.fileHandleForWriting.closeFile()
        } else {
            try process.run()
        }
        let data = out.fileHandleForReading.readDataToEndOfFile()
        process.waitUntilExit()
        guard process.terminationStatus == 0 else { throw NSError(domain: "node", code: Int(process.terminationStatus)) }
        return data
    }

    static let spec: CAIESpec = {
        let file = FileManager.default.temporaryDirectory.appendingPathComponent("web-spec-\(UUID()).json")
        _ = try! node(["native/macos/scripts/export-web-spec.mjs", file.path])
        return try! CAIESpec.load(Data(contentsOf: file))
    }()
}

final class HighlighterTests: XCTestCase {
    /// 网页的 lang.js 对这些行给出的 (类名, 文本) 序列。
    func webTokens(_ lines: [String]) throws -> [[[String]]] {
        let script = #"""
        const vm = require('vm'), fs = require('fs');
        const box = { window: {} }; vm.createContext(box);
        for (const f of ['web/js/caie-spec.js', 'web/js/lang.js']) vm.runInContext(fs.readFileSync(f, 'utf8'), box);
        box.CAIE = box.window.CAIE; vm.runInContext(fs.readFileSync('web/js/lang.js', 'utf8'), box);
        const lines = JSON.parse(fs.readFileSync(0, 'utf8'));
        const un = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
        console.log(JSON.stringify(lines.map((line) => {
          const html = box.window.LANG.highlight(line);
          return [...html.matchAll(/<span class="tk-([a-z-]+)">([^<]*)<\/span>/g)].map((m) => [m[1], un(m[2])]);
        })));
        """#
        let data = try Repo.node(["-e", script], stdin: String(data: try JSONEncoder().encode(lines), encoding: .utf8))
        return try JSONDecoder().decode([[[String]]].self, from: data)
    }

    func swiftTokens(_ line: String, _ highlighter: SyntaxHighlighter) -> [[String]] {
        let ns = line as NSString
        let names: [SyntaxHighlighter.Kind: String] = [
            .comment: "comment", .string: "string", .char: "char", .number: "number", .op: "op",
            .type: "type", .keyword: "keyword", .builtin: "builtin", .keywordLower: "keyword-lower", .ident: "ident"
        ]
        return highlighter.tokens(line: ns).map { [names[$0.kind]!, ns.substring(with: $0.range)] }
    }

    func testMatchesWebHighlighterOnSamplesAndEdgeCases() throws {
        let spec = Repo.spec
        let highlighter = SyntaxHighlighter(spec: spec)
        var lines = spec.samples.docs.flatMap { $0.source.components(separatedBy: "\n") }
        lines += [
            "x ← 3.14 + 2", "Total <- Total + 1", "IF a <> b AND c >= 2 THEN",
            "OUTPUT \"未闭合的字符串", "c ← 'A'", "// 注释 OUTPUT 1", "output lowercase",
            "中IF 1中2", "Name12 ← 12abc", "x ← MID(s, 1, 2) & LENGTH(s)", "a ^ b / c * d - e",
            "DECLARE Arr : ARRAY[1:10] OF INTEGER", "\"esc \\\" quote\" next"
        ]
        let expected = try webTokens(lines)
        XCTAssertEqual(expected.count, lines.count)
        for (index, line) in lines.enumerated() {
            XCTAssertEqual(swiftTokens(line, highlighter), expected[index], "第 \(index) 行：\(line)")
        }
    }

    func testOffsetIsApplied() {
        let highlighter = SyntaxHighlighter(spec: Repo.spec)
        let tokens = highlighter.tokens(line: "OUTPUT 1", offset: 100)
        XCTAssertEqual(tokens.first?.range, NSRange(location: 100, length: 6))
    }
}

final class EditRulesTests: XCTestCase {
    var rules = EditRules(indent: "   ")

    /// 用 `|` 标光标、`[...]` 标选区的小写法，测试更好读。
    func parse(_ marked: String) -> (String, NSRange) {
        var text = marked
        if let open = text.range(of: "["), let close = text.range(of: "]", range: open.upperBound..<text.endIndex) {
            let start = text.utf16.distance(from: text.startIndex, to: open.lowerBound)
            let length = text.utf16.distance(from: open.upperBound, to: close.lowerBound)
            text.removeSubrange(close)
            text.removeSubrange(open)
            return (text, NSRange(location: start, length: length))
        }
        let caret = text.range(of: "|")!
        let at = text.utf16.distance(from: text.startIndex, to: caret.lowerBound)
        text.removeSubrange(caret)
        return (text, NSRange(location: at, length: 0))
    }

    func render(_ text: String, _ edit: TextEdit?) -> String {
        guard let edit else { return "<nil>" }
        let result = edit.applied(to: text) as NSString
        let s = edit.selection
        if s.length == 0 { return result.replacingCharacters(in: NSRange(location: s.location, length: 0), with: "|") }
        return result.replacingCharacters(in: s, with: "[" + result.substring(with: s) + "]")
    }

    func check(_ input: String, _ expected: String, _ op: (String, NSRange) -> TextEdit?, file: StaticString = #filePath, line: UInt = #line) {
        let (text, selection) = parse(input)
        XCTAssertEqual(render(text, op(text, selection)), expected, file: file, line: line)
    }

    func testEnterContinuesIndent() {
        check("   OUTPUT x|", "   OUTPUT x\n   |") { rules.newline($0, selection: $1) }
    }

    func testEnterAfterOpenerAddsCloser() {
        check("IF a > 1 THEN|", "IF a > 1 THEN\n   |\nENDIF") { rules.newline($0, selection: $1) }
        check("   WHILE x < 3|", "   WHILE x < 3\n      |\n   ENDWHILE") { rules.newline($0, selection: $1) }
        check("FOR i ← 1 TO 10|", "FOR i ← 1 TO 10\n   |\nNEXT i") { rules.newline($0, selection: $1) }
        check("REPEAT|", "REPEAT\n   |\nUNTIL <condition>") { rules.newline($0, selection: $1) }
        check("PUBLIC PROCEDURE P()|", "PUBLIC PROCEDURE P()\n   |\nENDPROCEDURE") { rules.newline($0, selection: $1) }
        check("ELSE|", "ELSE\n   |") { rules.newline($0, selection: $1) }
    }

    func testEnterDoesNotDuplicateExistingCloser() {
        // 与 app.js 同一条判据：只有「下一行就是结尾关键字」才不补
        check("IF a THEN|\nENDIF", "IF a THEN\n   |\nENDIF") { rules.newline($0, selection: $1) }
        check("FOR i ← 1 TO 3|\n   NEXT i", "FOR i ← 1 TO 3\n   |\n   NEXT i") { rules.newline($0, selection: $1) }
        // 中间隔了一行代码时网页会再补一个 ENDIF——这里保持一致，不私自「改进」
        check("IF a THEN|\n   x\nENDIF", "IF a THEN\n   |\nENDIF\n   x\nENDIF") { rules.newline($0, selection: $1) }
    }

    func testEnterInMiddleOfOpenerLineIsPlain() {
        check("IF a |THEN", "IF a \n|THEN") { rules.newline($0, selection: $1) }
    }

    func testEnterIgnoresKeywordGluedToChinese() {
        // JS 的 \b 是 ASCII 的：「中FOR」里 FOR 前面是边界，但行首规则要求 ^\s*FOR，所以不算开头
        check("中FOR i|", "中FOR i\n|") { rules.newline($0, selection: $1) }
    }

    func testAutoIndentOff() {
        var off = rules
        off.autoIndent = false
        XCTAssertNil(off.newline("IF a THEN", selection: NSRange(location: 9, length: 0)))
    }

    func testTabAndShiftTab() {
        check("x|", "x   |") { rules.tab($0, selection: $1, shift: false) }
        check("     x|", "   x|") { rules.tab($0, selection: $1, shift: true) }   // 5 → 3：退到停靠点
        check("x|", "<nil>") { rules.tab($0, selection: $1, shift: true) }
        check("[a\nb]", "[   a\n   b]") { rules.tab($0, selection: $1, shift: false) }
        check("[    a\n   b\nc]", "[   a\nb\nc]") { rules.tab($0, selection: $1, shift: true) }
    }

    func testBackspaceInIndentRemovesOneStop() {
        check("      |x", "   |x") { rules.backspace($0, selection: $1) }
        check("    |x", "   |x") { rules.backspace($0, selection: $1) }
        check("a(|)", "a|") { rules.backspace($0, selection: $1) }
        check("ab|", "<nil>") { rules.backspace($0, selection: $1) }
    }

    func testPairs() {
        check("x|", "x(|)") { rules.type("(", in: $0, selection: $1) }
        check("|abc", "<nil>") { rules.type("(", in: $0, selection: $1) }          // 右侧紧跟单词不补
        check("[abc]", "([abc])") { rules.type("(", in: $0, selection: $1) }      // 包裹并保持选区
        check("a(|)", "a()|") { rules.type(")", in: $0, selection: $1) }          // 跳过已有的右括号
        check("// it|", "<nil>") { rules.type("'", in: $0, selection: $1) }       // 注释里不补引号
        check("x ← \"ab|", "<nil>") { rules.type("\"", in: $0, selection: $1) }  // 字符串里不补
    }

    func testArrow() {
        check("x <-|", "x ←|") { rules.arrow($0, caret: $1.location) }
        check("OUTPUT \"<-|", "<nil>") { rules.arrow($0, caret: $1.location) }
        check("// a <-|", "<nil>") { rules.arrow($0, caret: $1.location) }
        check("中文 <-|", "中文 ←|") { rules.arrow($0, caret: $1.location) }
    }

    func testPasteNormalisation() {
        XCTAssertEqual(rules.normalizePaste("a\r\n\tb\rc"), "a\n   b\nc")
    }

    func testSnippetCaretLandsAfterIndent() {
        let body = Repo.spec.snippets.first { $0.label.hasPrefix("IF … THEN … ENDIF") }!.body
        check("   |", "   IF <condition> THEN\n   |\n   ENDIF") { rules.snippet(body, in: $0, selection: $1) }
        check("   x|", "   x\n   IF <condition> THEN\n   |\n   ENDIF") { rules.snippet(body, in: $0, selection: $1) }
    }

    func testCssColors() {
        XCTAssertEqual(RGBA(css: "#ff8000"), RGBA(r: 1, g: 128.0 / 255, b: 0, a: 1))
        XCTAssertEqual(RGBA(css: "rgba(63, 111, 94, .45)")?.a, 0.45)
        XCTAssertNotNil(RGBA(css: Repo.spec.theme.dark["tk-keyword"]!))
    }
}
