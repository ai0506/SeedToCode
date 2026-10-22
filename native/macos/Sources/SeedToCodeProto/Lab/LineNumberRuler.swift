import AppKit

/// 行号栏。对应网页 `.gutter`：宽 52px、右侧 10px 留白、右边框、当前行号用正文色、
/// 有诊断的行在左侧 2px 处画一个 6px 圆点（错误红、CAIE 规范黄、提示蓝）。
final class LineNumberRuler: NSRulerView {
    weak var editor: CodeTextView?
    var showsNumbers = true { didSet { ruleThickness = showsNumbers ? 52 : 0; needsDisplay = true } }

    init(editor: CodeTextView, scrollView: NSScrollView) {
        self.editor = editor
        super.init(scrollView: scrollView, orientation: .verticalRuler)
        clientView = editor
        ruleThickness = 52
        // 必须裁剪。macOS 14 起 NSView 默认 clipsToBounds = false；而新式滚动视图里 clip view 铺满整宽、
        // 行号栏叠在它上面。不裁剪时 NSRulerView 铺底色会越过自己的 52px，把下面整块编辑区盖住——
        // 屏幕上一个字都看不见。离屏截图（cacheDisplay）走的是另一条绘制路径，看不出来，
        // 第一版就是被那种截图骗过去的；这个问题只有截真实屏幕画面才发现。
        clipsToBounds = true
        editor.gutter = self
        NotificationCenter.default.addObserver(self, selector: #selector(boundsChanged), name: NSView.boundsDidChangeNotification,
                                               object: scrollView.contentView)
    }

    required init(coder: NSCoder) { fatalError("not used") }

    @objc private func boundsChanged() { needsDisplay = true }

    override func drawHashMarksAndLabels(in rect: NSRect) {
        guard let editor, showsNumbers, let layout = editor.layoutManager, let container = editor.textContainer else { return }
        let theme = editor.theme
        // 只画在自己可见的范围里：SwiftUI 宿主不替 NSView 裁剪，第一版按 bounds 画的右边框
        // 一路穿过了顶栏和状态栏。
        let area = rect.intersection(visibleRect)
        theme.background.setFill()
        area.fill()
        theme.border.setFill()
        NSRect(x: bounds.maxX - 1, y: area.minY, width: 1, height: area.height).fill()

        let visible = editor.visibleRect
        let glyphs = layout.glyphRange(forBoundingRect: visible, in: container)
        let chars = layout.characterRange(forGlyphRange: glyphs, actualGlyphRange: nil)
        let firstLine = editor.lineNumber(at: chars.location)
        let lastLine = editor.lineNumber(at: NSMaxRange(chars))
        let caretLine = editor.lineNumber(at: editor.selectedRange().location)
        var severity: [Int: EditorDiagnostic.Severity] = [:]
        for d in editor.diagnostics {
            // 一行有多条时取最严重的：错误 > 规范 > 提示
            let rank: [EditorDiagnostic.Severity: Int] = [.error: 0, .caie: 1, .hint: 2]
            if let existing = severity[d.line], rank[existing]! <= rank[d.severity]! { continue }
            severity[d.line] = d.severity
        }

        let offset = convert(NSPoint.zero, from: editor).y
        for line in firstLine...max(firstLine, lastLine) {
            guard let lineRect = editor.rectForLine(line) else { continue }
            let y = lineRect.minY + offset
            let attrs: [NSAttributedString.Key: Any] = [
                .font: editor.fonts.gutter,
                .foregroundColor: line == caretLine ? theme.text : theme.textFaint
            ]
            let label = NSAttributedString(string: "\(line)", attributes: attrs)
            let size = label.size()
            label.draw(at: NSPoint(x: bounds.maxX - 10 - size.width, y: y + (lineRect.height - size.height) / 2))
            if let s = severity[line] {
                theme.color(s == .error ? "danger" : s == .caie ? "warn" : "hint").setFill()
                NSBezierPath(ovalIn: NSRect(x: 2, y: y + lineRect.height / 2 - 3, width: 6, height: 6)).fill()
            }
        }
    }
}
