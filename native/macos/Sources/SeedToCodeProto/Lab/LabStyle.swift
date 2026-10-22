import AppKit
import SeedToCodeKit
import SwiftUI

/// 网页配色（styles.css 变量）在 SwiftUI 里的样子。名字沿用 CSS 变量名。
struct LabPalette {
    let theme: EditorTheme
    func c(_ name: String) -> Color { Color(nsColor: theme.color(name)) }

    var bg: Color { c("bg") }
    var panel: Color { c("bg-panel") }
    var sunken: Color { c("bg-sunken") }
    var border: Color { c("border") }
    var borderStrong: Color { c("border-strong") }
    var text: Color { c("text") }
    var dim: Color { c("text-dim") }
    var faint: Color { c("text-faint") }
    var accent: Color { c("accent") }
    var accentSoft: Color { c("accent-soft") }
    var danger: Color { c("danger") }
    var dangerSoft: Color { c("danger-soft") }
    var warn: Color { c("warn") }
    var warnSoft: Color { c("warn-soft") }
    var hint: Color { c("hint") }
    var hintSoft: Color { c("hint-soft") }
    var number: Color { c("tk-number") }
    var string: Color { c("tk-string") }
}

private struct PaletteKey: EnvironmentKey {
    /// 没注入时的兜底：所有颜色都是品红（EditorTheme 找不到变量时的颜色），漏注入一眼就看得出来。
    /// 不能用可选值再强制解包——SwiftUI 写环境值之前会先读一次，那一下就会崩（第一版就是这么崩的）。
    static let defaultValue = LabPalette(theme: EditorTheme(vars: [:], dark: false))
}

extension EnvironmentValues {
    var palette: LabPalette {
        get { self[PaletteKey.self] }
        set { self[PaletteKey.self] = newValue }
    }
}

enum LabFont {
    /// 网页 body 13px，系统 UI 字体
    static func ui(_ size: CGFloat = 13, _ weight: Font.Weight = .regular) -> Font { .system(size: size, weight: weight) }
    static func mono(_ size: CGFloat = 12) -> Font { .system(size: size, design: .monospaced) }
}

/// `.panel-head`：34px 高、11px 大写灰字、底边框。
struct PanelHead<Trailing: View>: View {
    @Environment(\.palette) var p
    let title: String
    @ViewBuilder var trailing: () -> Trailing

    var body: some View {
        HStack(spacing: 4) {
            Text(title).font(LabFont.ui(11)).kerning(0.4).foregroundStyle(p.faint)
            Spacer()
            trailing()
        }
        .padding(.horizontal, 10)
        .frame(height: 34)
        .overlay(alignment: .bottom) { Rectangle().fill(p.border).frame(height: 1) }
    }
}

extension PanelHead where Trailing == EmptyView {
    init(title: String) { self.init(title: title) { EmptyView() } }
}

/// `.sub-head`：28px 高的小节标题。
struct SubHead<Trailing: View>: View {
    @Environment(\.palette) var p
    let title: String
    @ViewBuilder var trailing: () -> Trailing
    var body: some View {
        HStack {
            Text(title).font(LabFont.ui(11)).kerning(0.4).foregroundStyle(p.faint)
            Spacer()
            trailing()
        }
        .padding(.horizontal, 10)
        .frame(height: 28)
    }
}

extension SubHead where Trailing == EmptyView {
    init(title: String) { self.init(title: title) { EmptyView() } }
}

/// 网页按钮的几种外观。只用背景、颜色、边框色表示状态（FRONTEND_RULES：反馈不改尺寸）。
struct LabButtonStyle: ButtonStyle {
    enum Kind { case normal, primary, ghost, danger, icon }
    @Environment(\.palette) var p
    @Environment(\.isEnabled) var enabled
    var kind: Kind = .normal
    var width: CGFloat?
    var height: CGFloat = 26
    var fontSize: CGFloat = 13

    func makeBody(configuration: Configuration) -> some View {
        let pressed = configuration.isPressed
        let (fg, bg, stroke): (Color, Color, Color) = {
            switch kind {
            case .primary: return (.white, p.accent, p.accent)
            case .danger: return (.white, p.danger, p.danger)
            case .ghost: return (p.dim, pressed ? p.sunken : .clear, p.border)
            case .icon: return (p.dim, pressed ? p.sunken : .clear, .clear)
            case .normal: return (p.text, pressed ? p.sunken : p.panel, p.borderStrong)
            }
        }()
        return configuration.label
            .font(LabFont.ui(fontSize))
            .lineLimit(1)
            .padding(.horizontal, kind == .icon ? 0 : 12)
            .frame(width: width, height: height)
            .foregroundStyle(fg)
            .background(RoundedRectangle(cornerRadius: 6).fill(bg))
            .overlay(RoundedRectangle(cornerRadius: 6).strokeBorder(stroke, lineWidth: 1))
            .overlay(kind == .primary || kind == .danger
                     ? RoundedRectangle(cornerRadius: 6).fill(Color.white.opacity(pressed ? 0.08 : 0)) : nil)
            .opacity(enabled ? 1 : 0.55)
            .contentShape(Rectangle())
    }
}

/// 网页 `.switch-ctl`：32×18 轨道、14px 圆钮。用自绘而不是系统 Toggle，尺寸与网页一致。
struct LabSwitch: View {
    @Environment(\.palette) var p
    @Binding var isOn: Bool
    var body: some View {
        Button { isOn.toggle() } label: {
            ZStack(alignment: isOn ? .trailing : .leading) {
                Capsule().fill(isOn ? p.accent : p.borderStrong).frame(width: 32, height: 18)
                Circle().fill(.white).frame(width: 14, height: 14).padding(2)
            }
            .animation(.easeOut(duration: 0.15), value: isOn)
        }
        .buttonStyle(.plain)
        .accessibilityAddTraits(.isToggle)
    }
}

/// 弹出一个改名 / 新建用的小表单。错误提示占固定 18px 槽位，出现与否不推动按钮。
struct NameSheet: View {
    @Environment(\.palette) var p
    @Environment(\.dismiss) var dismiss
    let title: String
    let placeholder: String
    @State var name: String
    let onCommit: (String) async -> String?   // 返回错误文案，nil 表示成功

    @State private var error = ""
    @FocusState private var focused: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text(title).font(LabFont.ui(13, .semibold)).foregroundStyle(p.text)
            TextField(placeholder, text: $name)
                .textFieldStyle(.roundedBorder)
                .focused($focused)
                .onSubmit(commit)
            Text(error).font(LabFont.ui(11.5)).foregroundStyle(p.danger).frame(height: 18, alignment: .topLeading)
            HStack {
                Spacer()
                Button("取消") { dismiss() }.buttonStyle(LabButtonStyle(kind: .ghost)).keyboardShortcut(.cancelAction)
                Button("确定", action: commit).buttonStyle(LabButtonStyle(kind: .primary)).keyboardShortcut(.defaultAction)
            }
        }
        .padding(16)
        .frame(width: 340)
        .background(p.panel)
        .onAppear { focused = true }
    }

    private func commit() {
        Task {
            if let message = await onCommit(name) { error = message } else { dismiss() }
        }
    }
}
