import AppKit
import SeedToCodeKit
import SwiftUI

/// SwiftUI 里用的编辑器。文档切换、主题、字号、诊断、运行行由外部状态驱动；
/// 打字产生的文本变化通过 onTextChange 往外报，外部不回写——回写会打断输入法和撤销栈。
struct CodeEditor: NSViewRepresentable {
    let spec: CAIESpec
    /// 文档身份：变了才整份替换内容（并清撤销栈）。同一份文档里的打字不走这条路。
    let documentID: String
    let initialText: String
    var dark: Bool
    var fontSize: CGFloat
    var lineNumbers = true
    var lint = false
    var rules: EditRules
    var diagnostics: [EditorDiagnostic] = []
    var runningLine: Int?
    var controller: CodeEditorController?
    var onTextChange: (String) -> Void = { _ in }
    var onCaretMove: (Int, Int) -> Void = { _, _ in }

    func makeNSView(context: Context) -> NSScrollView {
        let editor = CodeTextView.make(spec: spec, theme: EditorTheme(spec: spec, dark: dark), fonts: EditorFonts(size: fontSize))
        let scroll = NSScrollView()
        scroll.hasVerticalScroller = true
        scroll.hasHorizontalScroller = true
        scroll.autohidesScrollers = true
        scroll.borderType = .noBorder
        scroll.drawsBackground = false
        scroll.documentView = editor
        let ruler = LineNumberRuler(editor: editor, scrollView: scroll)
        scroll.verticalRulerView = ruler
        scroll.hasVerticalRuler = true
        scroll.rulersVisible = true
        scroll.contentView.postsBoundsChangedNotifications = true
        context.coordinator.documentID = documentID
        editor.load(initialText)
        controller?.editor = editor
        update(editor, ruler: ruler)
        return scroll
    }

    func updateNSView(_ scroll: NSScrollView, context: Context) {
        guard let editor = scroll.documentView as? CodeTextView else { return }
        if context.coordinator.documentID != documentID {
            context.coordinator.documentID = documentID
            editor.load(initialText)
        }
        controller?.editor = editor
        update(editor, ruler: scroll.verticalRulerView as? LineNumberRuler)
    }

    private func update(_ editor: CodeTextView, ruler: LineNumberRuler?) {
        let theme = EditorTheme(spec: spec, dark: dark)
        if editor.theme.isDark != dark { editor.theme = theme }
        if editor.fonts.size != fontSize { editor.fonts = EditorFonts(size: fontSize) }
        editor.rules = rules
        editor.lintEnabled = lint
        if editor.diagnostics != diagnostics { editor.diagnostics = diagnostics }
        editor.runningLine = runningLine
        editor.onTextChange = onTextChange
        editor.onCaretMove = onCaretMove
        ruler?.showsNumbers = lineNumbers
    }

    func makeCoordinator() -> Coordinator { Coordinator() }

    final class Coordinator {
        var documentID = ""
    }
}

/// 给外部（菜单、工具栏）调编辑器命令用：插入模板、打开查找栏、聚焦。
final class CodeEditorController: ObservableObject {
    weak var editor: CodeTextView?

    func insertSnippet(_ body: String) { editor?.insertSnippet(body) }
    func focus() { if let editor { editor.window?.makeFirstResponder(editor) } }
    func showFind() {
        guard let editor else { return }
        let item = NSMenuItem()
        item.tag = NSTextFinder.Action.showFindInterface.rawValue
        editor.performTextFinderAction(item)
    }
    var text: String { editor?.string ?? "" }

    /// 程序化替换，进撤销栈、触发 onTextChange（和打字走同一条路）。
    func replace(_ range: NSRange, with text: String) {
        guard let editor, NSMaxRange(range) <= (editor.string as NSString).length else { return }
        let caret = range.location + (text as NSString).length
        editor.perform(TextEdit(range: range, replacement: text, selection: NSRange(location: caret, length: 0)))
    }

    func select(_ range: NSRange) {
        guard let editor, NSMaxRange(range) <= (editor.string as NSString).length else { return }
        editor.setSelectedRange(range)
        editor.scrollRangeToVisible(range)
        focus()
    }
}
