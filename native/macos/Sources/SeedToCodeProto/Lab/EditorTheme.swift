import AppKit
import SeedToCodeKit

/// 网页 styles.css 里那两套变量（由 export-web-spec.mjs 导出）转成 NSColor / NSFont。
/// 颜色名沿用 CSS 变量名，对照网页时一眼能找到是哪一个。
struct EditorTheme {
    let isDark: Bool
    private let vars: [String: String]

    init(spec: CAIESpec, dark: Bool) {
        self.init(vars: dark ? spec.theme.dark : spec.theme.light, dark: dark)
    }

    init(vars: [String: String], dark: Bool) {
        isDark = dark
        self.vars = vars
    }

    func color(_ name: String) -> NSColor {
        guard let css = vars[name], let c = RGBA(css: css) else { return .magenta }  // 显眼的错误色：变量名写错一眼看得出
        return NSColor(srgbRed: c.r, green: c.g, blue: c.b, alpha: c.a)
    }

    var background: NSColor { color("bg") }
    var panel: NSColor { color("bg-panel") }
    var border: NSColor { color("border") }
    var text: NSColor { color("text") }
    var textFaint: NSColor { color("text-faint") }
    var activeLine: NSColor { color("active-line") }
    var selection: NSColor { color("sel-glass") }
    var accent: NSColor { color("accent") }

    func token(_ kind: SyntaxHighlighter.Kind) -> NSColor {
        switch kind {
        case .comment: return color("tk-comment")
        case .string: return color("tk-string")
        case .char: return color("tk-char")
        case .number: return color("tk-number")
        case .op: return color("tk-op")
        case .type: return color("tk-type")
        case .keyword, .keywordLower: return color("tk-keyword")
        case .builtin: return color("tk-builtin")
        case .ident: return color("tk-ident")
        }
    }
}

/// 字号与行高：网页是 `font-size: N px; line-height: round(N × 1.6) px`（app.js applyFont）。
struct EditorFonts {
    let size: CGFloat
    let regular: NSFont
    let semibold: NSFont
    let italic: NSFont
    let lineHeight: CGFloat
    let gutter: NSFont

    init(size: CGFloat) {
        self.size = size
        regular = NSFont.monospacedSystemFont(ofSize: size, weight: .regular)
        // 网页关键字和类型是 font-weight: 600
        semibold = NSFont.monospacedSystemFont(ofSize: size, weight: .semibold)
        italic = NSFontManager.shared.convert(regular, toHaveTrait: .italicFontMask)
        lineHeight = (size * 1.6).rounded()
        gutter = NSFont.monospacedDigitSystemFont(ofSize: size, weight: .regular)
    }

    /// 固定行高的段落样式，加上让文字在行内垂直居中的基线偏移。
    /// 不固定行高的话，中文回退字体比等宽字体高，含中文的行会比别的行高，行号就对不齐了。
    var paragraph: NSParagraphStyle {
        let style = NSMutableParagraphStyle()
        style.minimumLineHeight = lineHeight
        style.maximumLineHeight = lineHeight
        return style
    }

    var baselineOffset: CGFloat {
        (lineHeight - (regular.ascender - regular.descender)) / 2
    }
}
