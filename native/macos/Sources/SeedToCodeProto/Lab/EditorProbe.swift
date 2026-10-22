import AppKit
import SeedToCodeKit

/// 原生编辑器的自动检查与性能量具（`--task editor-check` / `--task editor-perf`）。
///
/// 所有输入都走 NSTextView 的动作方法（insertText / insertNewline / insertTab / deleteBackward /
/// setMarkedText），也就是键盘事件最终调用的同一条路，而不是直接改 textStorage。
/// 文档用 export-web-spec 导出的出厂样例，不手编。
@MainActor
final class EditorProbe {
    let spec: CAIESpec
    let options: LaunchOptions
    let window: NSWindow
    let editor: CodeTextView
    let scroll: NSScrollView

    init(spec: CAIESpec, options: LaunchOptions, window: NSWindow) {
        self.spec = spec
        self.options = options
        self.window = window
        editor = CodeTextView.make(spec: spec, theme: EditorTheme(spec: spec, dark: false), fonts: EditorFonts(size: 14))
        scroll = NSScrollView(frame: window.contentView!.bounds)
        scroll.autoresizingMask = [.width, .height]
        scroll.hasVerticalScroller = true
        scroll.hasHorizontalScroller = true
        scroll.documentView = editor
        let ruler = LineNumberRuler(editor: editor, scrollView: scroll)
        scroll.verticalRulerView = ruler
        scroll.hasVerticalRuler = true
        scroll.rulersVisible = true
        scroll.contentView.postsBoundsChangedNotifications = true
        window.contentView = scroll
        window.makeFirstResponder(editor)
    }

    func run() -> [String: Any] {
        switch options.task {
        case .editorCheck: return check()
        case .editorPerf: return perf()
        default: return [:]
        }
    }

    // MARK: 行为检查

    private func sample(_ name: String) -> String { spec.samples.docs.first { $0.name == name }!.source }

    private func type(_ s: String) {
        for ch in s { editor.insertText(String(ch), replacementRange: NSRange(location: NSNotFound, length: 0)) }
    }

    /// 光标所在行的全文（不含换行）。
    private func caretLine() -> String {
        let ns = editor.string as NSString
        var range = ns.lineRange(for: NSRange(location: editor.selectedRange().location, length: 0))
        if range.length > 0, ns.character(at: NSMaxRange(range) - 1) == 0x0A { range.length -= 1 }
        return ns.substring(with: range)
    }

    private func caretToEnd() { editor.setSelectedRange(NSRange(location: (editor.string as NSString).length, length: 0)) }

    private func check() -> [String: Any] {
        var results: [[String: Any]] = []
        func expect(_ name: String, _ ok: Bool, _ detail: Any = "") { results.append(["name": name, "ok": ok, "detail": detail]) }
        let main = sample("Main.pseudocode")

        // 1. 着色：拿真实 Main 的字符位置查属性
        editor.load(main)
        let ns = editor.string as NSString
        let storage = editor.textStorage!
        func attr(_ word: String, _ key: NSAttributedString.Key) -> Any? {
            let r = ns.range(of: word)
            return r.location == NSNotFound ? nil : storage.attribute(key, at: r.location, effectiveRange: nil)
        }
        let theme = editor.theme
        expect("关键字颜色 = tk-keyword", (attr("CONSTANT", .foregroundColor) as? NSColor) == theme.token(.keyword))
        expect("类型颜色 = tk-type", (attr("STRING", .foregroundColor) as? NSColor) == theme.token(.type))
        expect("注释是斜体", ((attr("// 输入", .font) as? NSFont).map { $0.fontDescriptor.symbolicTraits.contains(.italic) }) == true)
        expect("字符串颜色 = tk-string", (attr("\"Please", .foregroundColor) as? NSColor) == theme.token(.string))

        // 2. 回车：IF … THEN 之后补 ENDIF、缩进一级
        caretToEnd()
        editor.insertNewline(nil)
        type("IF Score > 90 THEN")
        editor.insertNewline(nil)
        let afterIf = editor.string
        expect("IF 后回车补 ENDIF 并缩进", afterIf.hasSuffix("IF Score > 90 THEN\n   \nENDIF"), String(afterIf.suffix(40)))
        // 3. <- 转 ←，且新行跟着重新着色
        type("Grade <- \"A\"")
        expect("<- 转成 ←", editor.string.contains("   Grade ← \"A\""), String(editor.string.suffix(30)))
        let gradeRange = (editor.string as NSString).range(of: "Grade ← ")
        let arrowColor = storage.attribute(.foregroundColor, at: gradeRange.location + 6, effectiveRange: nil) as? NSColor
        expect("新输入的 ← 已着色为运算符", arrowColor == theme.token(.op))
        // 4. 自动配对与跳过（引号在上面已经验证：「\"A\"」只出现一对）
        expect("引号不会多出一个", !editor.string.contains("\"A\"\""))
        // 5. 退格在缩进里退一级
        editor.insertNewline(nil)
        editor.deleteBackward(nil)
        // 光标还在 IF 块里（下面是 ENDIF），所以看光标所在行，不看最后一行
        expect("缩进里退格退回一级（3 → 0）", caretLine() == "", "光标行：[\(caretLine())]")
        // 6. 输入法：合成串可见（hasMarkedText）、确认后是汉字、合成期间回车不触发缩进
        type("// ")
        editor.setMarkedText("ni", selectedRange: NSRange(location: 2, length: 0), replacementRange: NSRange(location: NSNotFound, length: 0))
        let composing = editor.hasMarkedText() && caretLine() == "// ni"
        editor.insertText("你", replacementRange: NSRange(location: NSNotFound, length: 0))
        expect("输入法合成串在文本里可见，确认后替换为汉字", composing && caretLine() == "// 你", "光标行：[\(caretLine())]")
        // 7. 撤销：一路撤回到最初的 Main，证明所有程序化修改都进了撤销栈
        var undos = 0
        while editor.undoManager?.canUndo == true && undos < 200 { editor.undoManager?.undo(); undos += 1 }
        expect("全部撤销后回到原文", editor.string == main, "撤销 \(undos) 步")
        // 8. Tab / Shift+Tab 多行
        editor.setSelectedRange(NSRange(location: 0, length: (editor.string as NSString).length))
        editor.insertTab(nil)
        let indented = editor.string.components(separatedBy: "\n").allSatisfy { $0.hasPrefix("   ") }
        editor.insertBacktab(nil)
        expect("多行 Tab 整体缩进、Shift+Tab 还原", indented && editor.string == main)
        // 9. 行号定位
        let line = editor.lineNumber(at: (editor.string as NSString).range(of: "ENDIF").location)
        expect("行号二分查找", line == 15, line)

        return ["checks": results, "passed": results.filter { $0["ok"] as? Bool == true }.count, "total": results.count]
    }

    // MARK: 性能

    /// 与 MACOS_PHASE_A_RECORD.md §3.4 同一份文档：自带 BubbleSort 叠到 2000 行左右。
    private func perf() -> [String: Any] {
        let bubble = sample("BubbleSort.pseudocode")
        var long = ""
        while long.components(separatedBy: "\n").count < 2000 { long += bubble + "\n\n" }

        let loadStart = CACurrentMediaTime()
        editor.load(long)
        forceDraw()
        let loadMs = (CACurrentMediaTime() - loadStart) * 1000

        let mid = (editor.string as NSString).length / 2
        editor.setSelectedRange(NSRange(location: mid, length: 0))
        editor.scrollRangeToVisible(editor.selectedRange())
        scroll.displayIfNeeded()
        var handler: [Double] = [], toDisplay: [Double] = [], drawn: [Double] = [], drawCalls = 0
        for i in 0..<110 {
            let drawsBefore = editor.drawCount, drawMsBefore = editor.drawMs
            let t0 = CACurrentMediaTime()
            editor.insertText("x", replacementRange: NSRange(location: NSNotFound, length: 0))
            let t1 = CACurrentMediaTime()
            forceDraw()
            let t2 = CACurrentMediaTime()
            if i >= 10 {
                handler.append((t1 - t0) * 1000); toDisplay.append((t2 - t0) * 1000)
                drawn.append(editor.drawMs - drawMsBefore); drawCalls += editor.drawCount - drawsBefore
            }
        }

        // 滚动：每步 40px，含重排与重画
        editor.scroll(NSPoint(x: 0, y: 0))
        var frames: [Double] = []
        for step in 1...150 {
            let t0 = CACurrentMediaTime()
            scroll.contentView.scroll(to: NSPoint(x: 0, y: CGFloat(step * 40)))
            scroll.reflectScrolledClipView(scroll.contentView)
            forceDraw()
            frames.append((CACurrentMediaTime() - t0) * 1000)
        }

        return [
            "lines": editor.lineStarts.count,
            "loadAndFirstDrawMs": round1(loadMs),
            "typing": ["handlerMs": stats(handler), "handlerPlusDisplayMs": stats(toDisplay),
                       "editorDrawMs": stats(drawn), "editorDrawCalls": drawCalls],
            "scrollStepDrawMs": stats(frames),
            "note": "handlerMs 对应网页量具的 syncHandlerMs（27ms）。handlerPlusDisplayMs = 处理 + 用 cacheDisplay 当场整块重画编辑器与行号栏可见区（上限）；editorDrawCalls 用来确认真的画了。均不含 vsync 等待，不能和网页的 toSecondFrameMs（含两次 rAF）直接比。"
        ]
    }

    /// 把编辑器和行号栏的可见区域当场画进一张位图。
    ///
    /// 不能用 display() / displayIfNeeded()：图层视图把绘制推迟到这一轮事件循环结束，
    /// 在循环里连续调用时 draw(_:) 一次都没被调用过（插桩计数为 0），量出来的「含绘制」
    /// 只是处理耗时。cacheDisplay 会同步调用 draw(_:)，而且每次重画整块可见区，
    /// 比真实打字时的局部重画更重——所以这是上限。
    private func forceDraw() {
        editor.layoutManager?.ensureLayout(forBoundingRect: editor.visibleRect, in: editor.textContainer!)
        if let rep = editor.bitmapImageRepForCachingDisplay(in: editor.visibleRect) {
            editor.cacheDisplay(in: editor.visibleRect, to: rep)
        }
        if let ruler = scroll.verticalRulerView, let rep = ruler.bitmapImageRepForCachingDisplay(in: ruler.bounds) {
            ruler.cacheDisplay(in: ruler.bounds, to: rep)
        }
    }

    private func round1(_ v: Double) -> Double { (v * 10).rounded() / 10 }

    private func stats(_ values: [Double]) -> [String: Any] {
        let s = values.sorted()
        func at(_ p: Double) -> Double { round1(s[min(s.count - 1, Int(p * Double(s.count)))]) }
        return ["n": s.count, "p50": at(0.5), "p95": at(0.95), "max": round1(s.last ?? 0)]
    }
}
