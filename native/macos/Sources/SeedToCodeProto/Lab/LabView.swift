import AppKit
import SeedToCodeKit
import SwiftUI

/// 原生实验室窗口。版式对照 web/lab.html：顶栏 46 / 侧栏 210 / 编辑区 / 结果面板 340 / 状态栏 24。
struct LabView: View {
    @ObservedObject var model: LabModel

    var body: some View {
        let dark = model.settings?.theme == "dark"
        let palette = LabPalette(theme: EditorTheme(spec: model.spec, dark: dark))
        VStack(spacing: 0) {
            TopBar(model: model)
            HStack(spacing: 0) {
                if model.sidebarVisible {
                    Sidebar(model: model)
                    Rectangle().fill(palette.border).frame(width: 1)
                }
                EditorPane(model: model)
                Rectangle().fill(palette.border).frame(width: 1)
                ResultsPanel(model: model)
            }
            StatusBar(model: model)
        }
        .background(palette.bg)
        .overlay(alignment: .bottom) { ToastView(model: model).padding(.bottom, 40) }
        .environment(\.palette, palette)
        .preferredColorScheme(dark ? .dark : .light)
    }
}

// MARK: 顶栏

struct TopBar: View {
    @ObservedObject var model: LabModel
    @Environment(\.palette) var p
    @State private var renaming = false

    var body: some View {
        HStack(spacing: 12) {
            HStack(spacing: 8) {
                Button { model.sidebarVisible.toggle() } label: { Image(systemName: "sidebar.left").font(.system(size: 13)) }
                    .buttonStyle(LabButtonStyle(kind: .icon, width: 26))
                    .help("显示或隐藏代码文件 (⌘B)")
                Brand()
                TopNav()
            }
            .frame(maxWidth: .infinity, alignment: .leading)

            HStack(spacing: 10) {
                Button { renaming = true } label: {
                    Text(model.activeDoc?.name ?? "").font(LabFont.ui(13, .medium)).foregroundStyle(p.text)
                        .lineLimit(1).truncationMode(.middle).frame(width: 220, height: 26)
                }
                .buttonStyle(.plain)
                .help("点一下改名")
                Text(model.state?.saveState == "saving" ? "保存中…" : "已保存")
                    .font(LabFont.ui(11)).foregroundStyle(model.state?.saveState == "saving" ? p.warn : p.faint)
                    .frame(width: 56, alignment: .leading)
            }
            .sheet(isPresented: $renaming) {
                if let doc = model.activeDoc {
                    NameSheet(title: "重命名代码文件", placeholder: "文件名", name: doc.name) { name in
                        do { try await model.core.renameDoc(doc.id, name: name); return nil }
                        catch { return (error as? LabError)?.message ?? error.localizedDescription }
                    }
                    .environment(\.palette, p)
                }
            }

            HStack(spacing: 8) {
                HStack(spacing: 6) {
                    LabSwitch(isOn: Binding(get: { model.settings?.lint ?? false }, set: { model.setSetting("lint", $0) }))
                    Text("语法检测").font(LabFont.ui(12)).foregroundStyle(p.dim)
                    ProblemCount(model: model)
                }
                .help("关闭时不显示任何诊断信息")
                // 运行 / 停止共用一个 84px 槽位：换按钮不改变顶栏几何
                ZStack {
                    if model.isRunning {
                        Button("■ 停止") { model.stop() }.buttonStyle(LabButtonStyle(kind: .danger, width: 84))
                    } else {
                        Button("▶ 运行") { model.run() }.buttonStyle(LabButtonStyle(kind: .primary, width: 84))
                    }
                }
                .frame(width: 84)
                MoreMenu(model: model)
                AccountButton(model: model)
            }
            .frame(maxWidth: .infinity, alignment: .trailing)
        }
        .padding(.horizontal, 12)
        .frame(height: 46)
        .background(p.panel)
        .overlay(alignment: .bottom) { Rectangle().fill(p.border).frame(height: 1) }
    }
}

struct Brand: View {
    @Environment(\.palette) var p
    var body: some View {
        HStack(spacing: 8) {
            if let url = Bundle.main.resourceURL?.appendingPathComponent("web/SeedToCode_favicon.png"), let image = NSImage(contentsOf: url) {
                Image(nsImage: image).resizable().frame(width: 26, height: 26).clipShape(RoundedRectangle(cornerRadius: 5))
            }
            VStack(alignment: .leading, spacing: 1) {
                Text("SeedToCode").font(LabFont.ui(13, .semibold)).foregroundStyle(p.text)
                Text("Based on CAIE 9618").font(LabFont.ui(10)).foregroundStyle(p.faint)
            }
        }
    }
}

/// 顶栏主导航。学习 / 作业仍是网页页面，F3 接到同一 App 的网页窗口；现在先占位。
struct TopNav: View {
    @Environment(\.palette) var p
    var body: some View {
        HStack(spacing: 2) {
            item("实验室", current: true)
            item("学习", current: false)
        }
        .padding(2)
        .background(RoundedRectangle(cornerRadius: 7).fill(p.sunken))
    }

    private func item(_ title: String, current: Bool) -> some View {
        Text(title)
            .font(LabFont.ui(12))
            .foregroundStyle(current ? p.accent : p.dim)
            .padding(.horizontal, 10)
            .frame(height: 24)
            .background(RoundedRectangle(cornerRadius: 5).fill(current ? p.panel : .clear)
                .shadow(color: .black.opacity(current ? 0.07 : 0), radius: 1, y: 1))
    }
}

struct ProblemCount: View {
    @ObservedObject var model: LabModel
    @Environment(\.palette) var p
    var body: some View {
        let lint = model.settings?.lint ?? false
        let n = model.diagnostics.count
        // 关闭检测时槽位还在，只是透明：开关切换不推动右边的按钮
        Text(lint ? "\(n)" : "0")
            .font(LabFont.ui(11)).monospacedDigit()
            .foregroundStyle(!lint ? .clear : n == 0 ? p.accent : p.danger)
            .frame(width: 26, height: 16)
            .background(Capsule().fill(!lint ? .clear : n == 0 ? p.accentSoft : p.dangerSoft))
    }
}

struct MoreMenu: View {
    @ObservedObject var model: LabModel
    @Environment(\.palette) var p
    var body: some View {
        Menu {
            Button("格式化") { model.format() }.keyboardShortcut("f", modifiers: [.command, .option])
            Menu("插入结构") {
                ForEach(model.spec.snippets.indices, id: \.self) { i in
                    Button(model.spec.snippets[i].label) { model.editor.insertSnippet(model.spec.snippets[i].body) }
                }
            }
            Button("查找和替换") { model.editor.showFind() }
        } label: {
            Text("更多 ▾")
        }
        .menuStyle(.button)
        .menuIndicator(.hidden)
        .buttonStyle(LabButtonStyle(kind: .ghost, width: 72))
        .fixedSize()
    }
}

struct AccountButton: View {
    @ObservedObject var model: LabModel
    @Environment(\.palette) var p
    var body: some View {
        let account = model.state?.account
        let dot: Color = {
            guard let account, account.signedIn else { return p.faint }
            if account.hold != nil && account.hold?.asked == false { return p.warn }
            if account.sync.lastError != nil { return p.danger }
            return account.sync.pending > 0 ? p.warn : p.accent
        }()
        Button {} label: {
            HStack(spacing: 6) {
                Circle().fill(dot).frame(width: 6, height: 6)
                Text(account?.user?.email ?? account?.user?.username ?? "账户").lineLimit(1).truncationMode(.tail)
            }
        }
        .buttonStyle(LabButtonStyle(kind: .ghost))
        .fixedSize()
    }
}

// MARK: 侧栏

struct Sidebar: View {
    @ObservedObject var model: LabModel
    @Environment(\.palette) var p
    @State private var sheet: SheetKind?
    @State private var hovered: String?

    enum SheetKind: Identifiable {
        case newProject, renameProject, newDoc, renameDoc(LabState.Doc)
        var id: String {
            switch self {
            case .newProject: return "np"; case .renameProject: return "rp"; case .newDoc: return "nd"
            case .renameDoc(let d): return "rd" + d.id
            }
        }
    }

    var body: some View {
        VStack(spacing: 0) {
            PanelHead(title: "项目")
            projectSwitcher.padding(.horizontal, 8).padding(.vertical, 4)
            PanelHead(title: "代码文件") {
                Button { sheet = .newDoc } label: { Text("＋").font(.system(size: 14)) }
                    .buttonStyle(LabButtonStyle(kind: .icon, width: 22, height: 22))
                    .help("新建 .pseudocode 文件")
            }
            ScrollView {
                VStack(spacing: 0) {
                    ForEach(visibleDocs) { doc in fileRow(doc) }
                }
                .padding(4)
            }
            .scrollIndicators(.automatic)
            VStack(alignment: .leading) {
                Text("源文件保存在本机。\n运行时数据文件在右侧「文件」标签。").font(LabFont.ui(12)).foregroundStyle(p.faint)
                    .fixedSize(horizontal: false, vertical: true)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(10)
            .overlay(alignment: .top) { Rectangle().fill(p.border).frame(height: 1) }
        }
        .frame(width: 210)
        .background(p.panel)
        .sheet(item: $sheet) { kind in sheetView(kind).environment(\.palette, p) }
    }

    private var visibleDocs: [LabState.Doc] {
        (model.state?.docs ?? []).filter { !$0.archived || (model.settings?.showArchivedLessons ?? false) }
    }

    private var projectSwitcher: some View {
        Menu {
            ForEach(model.state?.projects ?? []) { project in
                Button {
                    model.perform { try await model.core.switchProject(project.id) }
                } label: {
                    if project.id == model.state?.currentProjectId { Label(project.name, systemImage: "checkmark") } else { Text(project.name) }
                }
            }
            Divider()
            Button("新建项目") { sheet = .newProject }
            Button("重命名当前项目") { sheet = .renameProject }.disabled(model.currentProject?.lesson ?? true)
            Button("删除当前项目", role: .destructive) {
                guard let project = model.currentProject else { return }
                model.perform { try await model.core.deleteProject(project.id) }
            }
            .disabled(model.currentProject?.lesson ?? true)
        } label: {
            HStack(spacing: 7) {
                Image(systemName: "folder").font(.system(size: 12))
                Text(model.currentProject?.name ?? "").font(LabFont.ui(12.5, .medium)).lineLimit(1)
                Spacer()
                Image(systemName: "chevron.down").font(.system(size: 9, weight: .semibold)).foregroundStyle(p.faint)
            }
            .foregroundStyle(p.text)
            .padding(.horizontal, 8)
            .frame(maxWidth: .infinity, minHeight: 28, maxHeight: 28)
            .contentShape(Rectangle())
        }
        .menuStyle(.button)
        .menuIndicator(.hidden)
        .buttonStyle(.plain)
    }

    private func fileRow(_ doc: LabState.Doc) -> some View {
        let active = doc.id == model.state?.activeDocId
        let showActions = active || hovered == doc.id
        return HStack(spacing: 6) {
            Text(doc.name).font(LabFont.ui(12.5)).foregroundStyle(p.text).lineLimit(1).truncationMode(.middle)
                .frame(maxWidth: .infinity, alignment: .leading)
            // 操作按钮常驻占位，只改不透明度：悬停不改变行内布局
            HStack(spacing: 2) {
                Button { sheet = .renameDoc(doc) } label: { Text("✎").font(.system(size: 12)) }
                    .buttonStyle(LabButtonStyle(kind: .icon, width: 20, height: 20)).help("重命名")
                Button { model.deleteDoc(doc) } label: { Text("✕").font(.system(size: 11)) }
                    .buttonStyle(LabButtonStyle(kind: .icon, width: 20, height: 20)).help("删除")
            }
            .opacity(showActions ? 1 : 0)
            .allowsHitTesting(showActions)
        }
        .padding(.horizontal, 8)
        .frame(height: 28)
        .background(RoundedRectangle(cornerRadius: 4).fill(active ? p.accentSoft : hovered == doc.id ? p.sunken : .clear))
        .opacity(doc.archived ? 0.5 : 1)
        .contentShape(Rectangle())
        .onTapGesture { model.openDoc(doc.id) }
        .onHover { hovered = $0 ? doc.id : (hovered == doc.id ? nil : hovered) }
    }

    @ViewBuilder private func sheetView(_ kind: SheetKind) -> some View {
        let core = model.core
        switch kind {
        case .newProject:
            NameSheet(title: "新建项目", placeholder: "项目名", name: "") { name in
                await attempt { _ = try await core.createProject(name: name) }
            }
        case .renameProject:
            NameSheet(title: "重命名项目", placeholder: "项目名", name: model.currentProject?.name ?? "") { name in
                await attempt { try await core.renameProject(model.state?.currentProjectId ?? "", name: name) }
            }
        case .newDoc:
            NameSheet(title: "新建代码文件", placeholder: "文件名", name: "") { name in
                await attempt { _ = try await core.createDoc(name: name) }
            }
        case .renameDoc(let doc):
            NameSheet(title: "重命名代码文件", placeholder: "文件名", name: doc.name) { name in
                await attempt { try await core.renameDoc(doc.id, name: name) }
            }
        }
    }

    private func attempt(_ work: () async throws -> Void) async -> String? {
        do { try await work(); return nil } catch { return (error as? LabError)?.message ?? error.localizedDescription }
    }
}

// MARK: 编辑区

struct EditorPane: View {
    @ObservedObject var model: LabModel
    @Environment(\.palette) var p

    var body: some View {
        let s = model.settings
        var rules = EditRules(indent: model.spec.indent)
        rules.autoIndent = s?.autoIndent ?? true
        rules.autoPair = s?.autoPair ?? true
        rules.arrowConvert = s?.arrowConvert ?? true
        return CodeEditor(spec: model.spec, documentID: model.editorDocID, initialText: model.editorText,
                          dark: s?.theme == "dark", fontSize: CGFloat(s?.fontSize ?? 14), lineNumbers: s?.lineNumbers ?? true,
                          lint: s?.lint ?? false, rules: rules, diagnostics: model.editorDiagnostics, runningLine: model.runningLine,
                          controller: model.editor,
                          onTextChange: { model.editorChanged($0) },
                          onCaretMove: { model.caret = ($0, $1) })
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .clipped()
    }
}

// MARK: 状态栏

struct StatusBar: View {
    @ObservedObject var model: LabModel
    @Environment(\.palette) var p
    var body: some View {
        HStack(spacing: 6) {
            Text("行 \(model.caret.line)，列 \(model.caret.column)").monospacedDigit().frame(width: 108, alignment: .leading)
            dot; Text(model.spec.version)
            dot; Text("三空格缩进")
            dot; Text("本地自动保存")
            Spacer()
            Text("按 9618 规则检查 · 运行代码查看结果")
        }
        .font(LabFont.ui(11))
        .foregroundStyle(p.faint)
        .padding(.horizontal, 12)
        .frame(height: 24)
        .background(p.panel)
        .overlay(alignment: .top) { Rectangle().fill(p.border).frame(height: 1) }
    }
    private var dot: some View { Text("·").opacity(0.5) }
}

struct ToastView: View {
    @ObservedObject var model: LabModel
    @Environment(\.palette) var p
    var body: some View {
        if let toast = model.toast {
            HStack(spacing: 12) {
                Text(toast.message).font(LabFont.ui(12.5)).foregroundStyle(p.text)
                if let label = toast.actionLabel {
                    Button(label) { model.runToastAction() }.buttonStyle(LabButtonStyle(kind: .ghost, height: 24, fontSize: 12))
                }
            }
            .padding(.horizontal, 14)
            .frame(minHeight: 36)
            .background(RoundedRectangle(cornerRadius: 8).fill(p.panel).shadow(color: .black.opacity(0.14), radius: 13, y: 8))
            .overlay(RoundedRectangle(cornerRadius: 8).strokeBorder(p.borderStrong))
            .transition(.opacity)
        }
    }
}
