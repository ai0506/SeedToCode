import AppKit
import SeedToCodeKit

/// 编辑器上要标出来的一处诊断。行号从 1 开始（和网页、和 language-engine 一致）。
struct EditorDiagnostic: Equatable {
    enum Severity: String { case error, caie, hint }
    let range: NSRange
    let line: Int
    let severity: Severity
}

/// 原生编辑器。
///
/// 网页版是「透明 textarea + 着色层」两层，选区、查找高亮、行标记、输入法预览全靠自己算位置
/// 再画矩形，那一套是这个仓库里 bug 最多的地方（见根目录 CLAUDE.md）。这里只有一层：
/// 文字、颜色、选区、输入法合成串全由 NSTextView 自己排版和绘制，位置天然一致，不需要换算。
///
/// 用 TextKit 1（显式 NSLayoutManager）：行号栏、当前行、行背景都要按行片段取矩形，
/// TextKit 1 的 API 稳定直接；2000 行的规模用不到 TextKit 2 的视口布局。
final class CodeTextView: NSTextView, NSTextStorageDelegate {
    var rules: EditRules
    let highlighter: SyntaxHighlighter
    var theme: EditorTheme { didSet { applyAppearance() } }
    var fonts: EditorFonts { didSet { applyAppearance() } }
    /// 语法检测开着时，小写写法的关键字加波浪下划线（网页 .tk-keyword-lower）。
    var lintEnabled = false { didSet { if oldValue != lintEnabled { rehighlightAll() } } }
    var diagnostics: [EditorDiagnostic] = [] { didSet { applyDiagnostics() } }
    var runningLine: Int? { didSet { if oldValue != runningLine { needsDisplay = true } } }
    var onTextChange: ((String) -> Void)?
    var onCaretMove: ((_ line: Int, _ column: Int) -> Void)?

    /// 每一行的起始 UTF-16 偏移；行号栏、跳转、诊断都靠它，二分查找。
    private(set) var lineStarts: [Int] = [0]
    weak var gutter: LineNumberRuler?

    static func make(spec: CAIESpec, theme: EditorTheme, fonts: EditorFonts) -> CodeTextView {
        let storage = NSTextStorage()
        let layout = NSLayoutManager()
        layout.allowsNonContiguousLayout = true
        storage.addLayoutManager(layout)
        let container = NSTextContainer(size: NSSize(width: CGFloat.greatestFiniteMagnitude, height: CGFloat.greatestFiniteMagnitude))
        container.widthTracksTextView = false
        container.lineFragmentPadding = 0
        layout.addTextContainer(container)
        let view = CodeTextView(frame: .zero, textContainer: container, spec: spec, theme: theme, fonts: fonts)
        storage.delegate = view
        return view
    }

    private init(frame: NSRect, textContainer: NSTextContainer, spec: CAIESpec, theme: EditorTheme, fonts: EditorFonts) {
        rules = EditRules(indent: spec.indent)
        highlighter = SyntaxHighlighter(spec: spec)
        self.theme = theme
        self.fonts = fonts
        super.init(frame: frame, textContainer: textContainer)

        // 不换行（网页 wrap="off"），横向可滚。
        isHorizontallyResizable = true
        isVerticallyResizable = true
        maxSize = NSSize(width: CGFloat.greatestFiniteMagnitude, height: CGFloat.greatestFiniteMagnitude)
        autoresizingMask = [.width, .height]

        // 伪代码不需要任何「智能」改写：引号变弯、-- 变破折号、自动更正，都会改坏代码。
        isRichText = false
        importsGraphics = false
        allowsUndo = true
        isAutomaticQuoteSubstitutionEnabled = false
        isAutomaticDashSubstitutionEnabled = false
        isAutomaticTextReplacementEnabled = false
        isAutomaticSpellingCorrectionEnabled = false
        isContinuousSpellCheckingEnabled = false
        isGrammarCheckingEnabled = false
        isAutomaticDataDetectionEnabled = false
        isAutomaticLinkDetectionEnabled = false
        smartInsertDeleteEnabled = false
        usesFindBar = true
        isIncrementalSearchingEnabled = true
        // 网页：代码区左右 16px 内边距、上 10px
        textContainerInset = NSSize(width: 16, height: 10)
        applyAppearance()
    }

    required init?(coder: NSCoder) { fatalError("not used") }

    // MARK: 内容

    /// 换一份文档：替换全文、清掉撤销栈（另一份文档的撤销不该作用在这份上）。
    func load(_ text: String) {
        undoManager?.removeAllActions()
        textStorage?.setAttributedString(NSAttributedString(string: text, attributes: baseAttributes))
        rebuildLineStarts()
        rehighlightAll()
        setSelectedRange(NSRange(location: 0, length: 0))
        scrollToBeginningOfDocument(nil)
    }

    var baseAttributes: [NSAttributedString.Key: Any] {
        [.font: fonts.regular, .foregroundColor: theme.token(.ident), .paragraphStyle: fonts.paragraph,
         .baselineOffset: fonts.baselineOffset]
    }

    private func applyAppearance() {
        backgroundColor = theme.background
        insertionPointColor = theme.text
        selectedTextAttributes = [.backgroundColor: theme.selection]
        typingAttributes = baseAttributes
        defaultParagraphStyle = fonts.paragraph
        if let storage = textStorage, storage.length > 0 {
            storage.addAttributes(baseAttributes, range: NSRange(location: 0, length: storage.length))
            rehighlightAll()
        }
        gutter?.ruleThickness = 52
        gutter?.needsDisplay = true
        needsDisplay = true
    }

    // MARK: 着色

    func rehighlightAll() {
        guard let storage = textStorage else { return }
        highlight(NSRange(location: 0, length: storage.length))
    }

    /// 只重画受影响的那几行：每打一个字只动一行，长文档里输入不随行数变慢。
    /// 网页版每次输入重画整份高亮层，2000 行时一次 27ms，这是换原生编辑器的直接原因。
    private func highlight(_ range: NSRange) {
        guard let storage = textStorage else { return }
        let ns = storage.string as NSString
        let lines = ns.lineRange(for: range)
        storage.beginEditing()
        storage.addAttributes(baseAttributes, range: lines)
        storage.removeAttribute(.underlineStyle, range: lines)
        ns.enumerateSubstrings(in: lines, options: [.byLines, .substringNotRequired]) { _, lineRange, _, _ in
            let line = ns.substring(with: lineRange) as NSString
            for token in self.highlighter.tokens(line: line, offset: lineRange.location) {
                storage.addAttributes(self.attributes(for: token.kind), range: token.range)
            }
        }
        storage.endEditing()
    }

    private func attributes(for kind: SyntaxHighlighter.Kind) -> [NSAttributedString.Key: Any] {
        var attrs: [NSAttributedString.Key: Any] = [.foregroundColor: theme.token(kind)]
        switch kind {
        case .keyword, .type: attrs[.font] = fonts.semibold
        case .keywordLower:
            attrs[.font] = fonts.semibold
            if lintEnabled {
                attrs[.underlineStyle] = NSUnderlineStyle.single.rawValue | NSUnderlineStyle.patternDot.rawValue
                attrs[.underlineColor] = theme.color("warn")
            }
        case .comment: attrs[.font] = fonts.italic
        default: break
        }
        return attrs
    }

    func textStorage(_ textStorage: NSTextStorage, didProcessEditing editedMask: NSTextStorageEditActions,
                     range editedRange: NSRange, changeInLength delta: Int) {
        guard editedMask.contains(.editedCharacters) else { return }
        rebuildLineStarts()
        highlight(editedRange)
    }

    override func didChangeText() {
        super.didChangeText()
        onTextChange?(string)
        gutter?.needsDisplay = true
    }

    private func rebuildLineStarts() {
        var starts = [0]
        let units = (string as NSString)
        let length = units.length
        starts.reserveCapacity(length / 20)
        var buffer = [unichar](repeating: 0, count: length)
        units.getCharacters(&buffer, range: NSRange(location: 0, length: length))
        for i in 0..<length where buffer[i] == 0x0A { starts.append(i + 1) }
        lineStarts = starts
    }

    /// 偏移所在的行号，从 1 开始。
    func lineNumber(at offset: Int) -> Int {
        var lo = 0, hi = lineStarts.count - 1
        while lo < hi {
            let mid = (lo + hi + 1) / 2
            if lineStarts[mid] <= offset { lo = mid } else { hi = mid - 1 }
        }
        return lo + 1
    }

    // MARK: 输入约定（规则在 SeedToCodeKit/EditRules，行为以网页 app.js 为准）

    /// 所有程序化修改都经过这里：shouldChangeText / didChangeText 成对调用，修改进系统撤销栈。
    /// 网页版为此只能用已废弃的 execCommand；这里是 NSTextView 的正规做法。
    func perform(_ edit: TextEdit) {
        if edit.range.length == 0 && edit.replacement.isEmpty {
            setSelectedRange(edit.selection)
            return
        }
        guard shouldChangeText(in: edit.range, replacementString: edit.replacement) else { return }
        textStorage?.replaceCharacters(in: edit.range, with: NSAttributedString(string: edit.replacement, attributes: baseAttributes))
        didChangeText()
        setSelectedRange(edit.selection)
        scrollRangeToVisible(edit.selection)
    }

    override func insertTab(_ sender: Any?) {
        if let edit = rules.tab(string, selection: selectedRange(), shift: false) { perform(edit) }
    }

    override func insertBacktab(_ sender: Any?) {
        if let edit = rules.tab(string, selection: selectedRange(), shift: true) { perform(edit) }
    }

    override func insertNewline(_ sender: Any?) {
        // 输入法合成中按回车是「确认候选」，不能拿来缩进
        if hasMarkedText() { return super.insertNewline(sender) }
        if let edit = rules.newline(string, selection: selectedRange()) { perform(edit) } else { super.insertNewline(sender) }
    }

    override func deleteBackward(_ sender: Any?) {
        if !hasMarkedText(), let edit = rules.backspace(string, selection: selectedRange()) { perform(edit) } else { super.deleteBackward(sender) }
    }

    override func insertText(_ insertString: Any, replacementRange: NSRange) {
        // 输入法确认候选时也走这里，此时不做任何改写
        let wasComposing = hasMarkedText()
        let text = (insertString as? NSAttributedString)?.string ?? (insertString as? String) ?? ""
        if !wasComposing, replacementRange.location == NSNotFound, (text as NSString).length == 1,
           let edit = rules.type(text, in: string, selection: selectedRange()) {
            perform(edit)
            return
        }
        super.insertText(insertString, replacementRange: replacementRange)
        if !wasComposing, text.hasSuffix("-"), let edit = rules.arrow(string, caret: selectedRange().location) {
            perform(edit)
        }
    }

    override func paste(_ sender: Any?) {
        guard let pasted = NSPasteboard.general.string(forType: .string) else { return super.paste(sender) }
        let normalized = rules.normalizePaste(pasted)
        let selection = selectedRange()
        let caret = selection.location + (normalized as NSString).length
        perform(TextEdit(range: selection, replacement: normalized, selection: NSRange(location: caret, length: 0)))
    }

    func insertSnippet(_ body: String) {
        perform(rules.snippet(body, in: string, selection: selectedRange()))
        window?.makeFirstResponder(self)
    }

    // MARK: 当前行、诊断、运行行

    override func setSelectedRanges(_ ranges: [NSValue], affinity: NSSelectionAffinity, stillSelecting: Bool) {
        super.setSelectedRanges(ranges, affinity: affinity, stillSelecting: stillSelecting)
        needsDisplay = true
        gutter?.needsDisplay = true
        let caret = selectedRange().location
        let line = lineNumber(at: caret)
        onCaretMove?(line, caret - lineStarts[line - 1] + 1)
    }

    /// 某一行（从 1 开始）在本视图坐标里的矩形，横向铺满。
    func rectForLine(_ line: Int) -> NSRect? {
        guard let layout = layoutManager, let container = textContainer, line >= 1, line <= lineStarts.count else { return nil }
        let start = lineStarts[line - 1]
        let length = (string as NSString).length
        var rect: NSRect
        if start >= length {
            // 文末的空行（或空文档）：只有 extra line fragment
            rect = layout.extraLineFragmentRect
            if rect.isEmpty { return nil }
        } else {
            let glyph = layout.glyphIndexForCharacter(at: start)
            rect = layout.lineFragmentRect(forGlyphAt: glyph, effectiveRange: nil)
        }
        _ = container
        rect.origin.y += textContainerOrigin.y
        rect.origin.x = 0
        rect.size.width = max(bounds.width, visibleRect.maxX)
        return rect
    }

    /// 量具用：draw(_:) 被调用的次数和累计耗时。只有确认真的画了，绘制耗时那个数才有意义。
    private(set) var drawCount = 0
    private(set) var drawMs: Double = 0

    override func draw(_ dirtyRect: NSRect) {
        let t0 = CACurrentMediaTime()
        super.draw(dirtyRect)
        drawMs += (CACurrentMediaTime() - t0) * 1000
        drawCount += 1
    }

    override func drawBackground(in rect: NSRect) {
        super.drawBackground(in: rect)
        // 叠放次序同网页：当前行最底，诊断行背景其上，运行行再其上。
        if selectedRange().length == 0, let r = rectForLine(lineNumber(at: selectedRange().location)), r.intersects(rect) {
            theme.activeLine.setFill(); r.fill()
        }
        var marked = Set<Int>()
        for d in diagnostics where d.severity != .hint && !marked.contains(d.line) {
            marked.insert(d.line)
            if let r = rectForLine(d.line), r.intersects(rect) {
                theme.color(d.severity == .error ? "danger-soft" : "warn-soft").setFill(); r.fill()
            }
        }
        if let line = runningLine, let r = rectForLine(line), r.intersects(rect) {
            theme.color("accent-soft").setFill(); r.fill()
        }
    }

    private func applyDiagnostics() {
        guard let layout = layoutManager, let storage = textStorage else { return }
        let all = NSRange(location: 0, length: storage.length)
        layout.removeTemporaryAttribute(.underlineStyle, forCharacterRange: all)
        layout.removeTemporaryAttribute(.underlineColor, forCharacterRange: all)
        for d in diagnostics where NSMaxRange(d.range) <= storage.length {
            let color = theme.color(d.severity == .error ? "danger" : d.severity == .caie ? "warn" : "hint")
            layout.addTemporaryAttributes([
                .underlineStyle: NSUnderlineStyle.single.rawValue | NSUnderlineStyle.patternDot.rawValue,
                .underlineColor: color
            ], forCharacterRange: d.range)
        }
        needsDisplay = true
        gutter?.needsDisplay = true
    }
}
