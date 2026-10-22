import SeedToCodeKit
import SwiftUI

/// 右侧结果面板，对照 lab.html 的 `aside.results`。宽 340，收起后 34。
struct ResultsPanel: View {
    @ObservedObject var model: LabModel
    @Environment(\.palette) var p

    var body: some View {
        VStack(spacing: 0) {
            tabs
            if !model.resultsCollapsed {
                Group {
                    switch model.tab {
                    case .output: OutputTab(model: model)
                    case .problems: ProblemsTab(model: model)
                    case .debug: DebugTab(model: model)
                    case .files: FilesTab(model: model)
                    }
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            } else {
                Spacer()
            }
        }
        .frame(width: model.resultsCollapsed ? 34 : 340)
        .background(p.panel)
    }

    private var tabs: some View {
        HStack(spacing: 4) {
            if !model.resultsCollapsed {
                ForEach(LabModel.Tab.allCases, id: \.self) { tab in tabButton(tab) }
            }
            Spacer(minLength: 0)
            Button { model.resultsCollapsed.toggle() } label: {
                Text("›").font(.system(size: 14)).rotationEffect(.degrees(model.resultsCollapsed ? 180 : 0))
            }
            .buttonStyle(LabButtonStyle(kind: .icon, width: 22, height: 22))
            .help("收起或展开结果面板")
        }
        .padding(.horizontal, 6)
        .frame(height: 34)
        .overlay(alignment: .bottom) { Rectangle().fill(p.border).frame(height: 1) }
    }

    /// 选中只改底色、边框色、文字色——不加粗（网页这里用 font-weight 是 FRONTEND_RULES 记录在案的违规）。
    private func tabButton(_ tab: LabModel.Tab) -> some View {
        let active = model.tab == tab
        let badge: Int = tab == .problems ? model.count("error") : 0
        return Button { model.tab = tab } label: {
            HStack(spacing: 4) {
                Text(tab.rawValue)
                Text(badge > 0 ? "\(badge)" : "").font(LabFont.ui(10)).monospacedDigit()
                    .foregroundStyle(badge > 0 ? p.danger : .clear)
                    .frame(width: 16, height: 14)
                    .background(Capsule().fill(badge > 0 ? p.dangerSoft : .clear))
            }
            .font(LabFont.ui(13))
            .foregroundStyle(active ? p.accent : p.dim)
            .padding(.horizontal, 10)
            .frame(height: 24)
            .background(RoundedRectangle(cornerRadius: 6).fill(active ? p.accentSoft : p.panel))
            .overlay(RoundedRectangle(cornerRadius: 6).strokeBorder(active ? p.accent : p.border))
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
    }
}

// MARK: 输出

struct OutputTab: View {
    @ObservedObject var model: LabModel
    @Environment(\.palette) var p
    @FocusState private var inputFocused: Bool

    var body: some View {
        VStack(spacing: 0) {
            Text(model.statusText)
                .font(LabFont.ui(11.5))
                .foregroundStyle(model.statusStyle == "error" ? p.danger : model.statusStyle == "idle" ? p.dim : p.accent)
                .lineLimit(1).truncationMode(.tail)
                .padding(.horizontal, 12)
                .frame(maxWidth: .infinity, minHeight: 30, maxHeight: 30, alignment: .leading)
                .background(model.statusStyle == "error" ? p.dangerSoft : p.sunken)
            ScrollViewReader { proxy in
                ScrollView {
                    LazyVStack(alignment: .leading, spacing: 0) {
                        ForEach(model.console) { line in
                            Text(line.text)
                                .font(LabFont.mono(12.5))
                                .italic(line.kind == .system)
                                .foregroundStyle(line.kind == .input ? p.accent : line.kind == .error ? p.danger : line.kind == .system ? p.faint : p.text)
                                .lineSpacing(12.5 * 0.6)
                                .textSelection(.enabled)
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .id(line.id)
                        }
                    }
                    .padding(.horizontal, 12).padding(.vertical, 10)
                }
                .onChange(of: model.console.count) { _, _ in
                    if let last = model.console.last { proxy.scrollTo(last.id, anchor: .bottom) }
                }
            }
            inputRow
        }
        .onChange(of: model.waitingInput?.variable) { _, waiting in if waiting != nil { inputFocused = true } }
    }

    private var inputRow: some View {
        let waiting = model.waitingInput
        return HStack(spacing: 6) {
            Text(waiting.map { "INPUT \($0.variable)" } ?? "INPUT")
                .font(LabFont.mono(11)).foregroundStyle(waiting != nil ? p.accent : p.faint)
                .lineLimit(1).truncationMode(.tail)
                .frame(width: 108, alignment: .leading)
            TextField(waiting.map { "输入 \($0.type)" } ?? "运行到 INPUT 时在此输入", text: $model.inputText)
                .textFieldStyle(.roundedBorder)
                .font(LabFont.mono(12))
                .disabled(waiting == nil)
                .focused($inputFocused)
                .onSubmit { model.submitInput() }
            Button("提交") { model.submitInput() }
                .buttonStyle(LabButtonStyle(kind: .primary, width: 60, height: 22, fontSize: 12))
                .disabled(waiting == nil)
        }
        .padding(.horizontal, 10)
        .frame(height: 44)
        .background(waiting != nil ? p.accentSoft : .clear)
        .overlay(alignment: .top) { Rectangle().fill(p.border).frame(height: 1) }
    }
}

// MARK: 问题

struct ProblemsTab: View {
    @ObservedObject var model: LabModel
    @Environment(\.palette) var p

    var body: some View {
        VStack(spacing: 0) {
            if model.settings?.lint == true {
                HStack(spacing: 6) {
                    chip("全部", "all", p.dim, p.sunken)
                    chip("错误", "error", p.danger, p.dangerSoft)
                    chip("规范", "caie", p.warn, p.warnSoft)
                    chip("建议", "hint", p.hint, p.hintSoft)
                    Spacer()
                }
                .padding(.horizontal, 8)
                .frame(height: 34)
                .overlay(alignment: .bottom) { Rectangle().fill(p.border).frame(height: 1) }
            }
            let items = model.diagnostics.filter { model.problemFilter == "all" || $0.severity == model.problemFilter }
            if model.settings?.lint != true {
                empty("语法检测已关闭。写作时不显示任何诊断。")
            } else if items.isEmpty {
                empty(model.diagnostics.isEmpty ? "没有发现问题。" : "这一类没有问题。")
            } else {
                ScrollView {
                    LazyVStack(spacing: 0) { ForEach(items) { row($0) } }.padding(4)
                }
            }
        }
    }

    private func empty(_ text: String) -> some View {
        Text(text).font(LabFont.ui(12)).foregroundStyle(p.faint)
            .padding(.horizontal, 12).padding(.vertical, 14)
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    }

    private func chip(_ title: String, _ filter: String, _ color: Color, _ soft: Color) -> some View {
        let on = model.problemFilter == filter
        return Button { model.problemFilter = filter } label: {
            HStack(spacing: 4) {
                Text(title)
                Text("\(model.count(filter))").monospacedDigit().opacity(0.8)
            }
            .font(LabFont.ui(11.5))
            .foregroundStyle(on && filter != "all" ? p.text : color)
            .padding(.horizontal, 8)
            .frame(height: 22)
            .background(Capsule().fill(on ? soft : p.panel))
            .overlay(Capsule().strokeBorder(on ? color : p.border))
        }
        .buttonStyle(.plain)
    }

    private func row(_ d: LintDiagnostic) -> some View {
        let color = d.severity == "error" ? p.danger : d.severity == "caie" ? p.warn : p.hint
        return HStack(alignment: .top, spacing: 9) {
            Circle().fill(color).frame(width: 8, height: 8).padding(.top, 5).frame(width: 18)
            VStack(alignment: .leading, spacing: 4) {
                Text(d.message).font(LabFont.ui(12.5)).foregroundStyle(p.text).fixedSize(horizontal: false, vertical: true)
                HStack(spacing: 8) {
                    Text("行 \(d.line)，列 \(d.column)").font(LabFont.ui(11)).foregroundStyle(p.faint).monospacedDigit()
                    ForEach(d.fixes.indices, id: \.self) { i in
                        Button(d.fixes[i].title) { model.applyFix(d.fixes[i]) }
                            .buttonStyle(LabButtonStyle(kind: .ghost, height: 20, fontSize: 11))
                    }
                }
            }
            Spacer(minLength: 0)
        }
        .padding(EdgeInsets(top: 8, leading: 10, bottom: 8, trailing: 8))
        .contentShape(Rectangle())
        .onTapGesture { model.jump(to: d) }
    }
}

// MARK: 调试

struct DebugTab: View {
    @ObservedObject var model: LabModel
    @Environment(\.palette) var p
    @State private var expanded = false

    var body: some View {
        VStack(spacing: 0) {
            SubHead(title: "当前状态")
            if model.variables.isEmpty {
                Text("本机运行时显示当前变量与调用栈。").font(LabFont.ui(12)).foregroundStyle(p.faint)
                    .frame(maxWidth: .infinity, alignment: .leading).padding(.horizontal, 10).padding(.bottom, 8)
            } else {
                DataTable(headers: ["名称", "种类", "类型", "值"],
                          rows: model.variables.map { [$0.name, $0.kind, $0.type, $0.value] })
                if !model.stack.isEmpty {
                    SubHead(title: "调用栈")
                    VStack(alignment: .leading, spacing: 2) {
                        ForEach(Array(model.stack.enumerated()), id: \.offset) { i, frame in
                            Text("\(i + 1). \(frame)").font(LabFont.mono(12)).foregroundStyle(p.text)
                        }
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.horizontal, 26).padding(.bottom, 10)
                }
            }
            SubHead(title: "追踪表") {
                Button("放大") { expanded = true }
                    .buttonStyle(LabButtonStyle(kind: .ghost, height: 22, fontSize: 12))
                    .disabled(model.traceColumns.isEmpty && model.traceRows.isEmpty)
                    .help(model.traceRows.isEmpty ? "运行一次之后才有追踪表可看" : "在大窗口里看这张表")
            }
            .overlay(alignment: .top) { Rectangle().fill(p.border).frame(height: 1) }
            if model.traceRows.isEmpty {
                Text("本机运行后在这里显示逐步追踪。").font(LabFont.ui(12)).foregroundStyle(p.faint)
                    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading).padding(.horizontal, 10)
            } else {
                TraceTable(model: model, compact: true)
                    .frame(minHeight: 140)
                    .overlay(alignment: .top) { Rectangle().fill(p.border).frame(height: 1) }
            }
            Text(model.traceStatus).font(LabFont.ui(12)).foregroundStyle(p.faint).monospacedDigit()
                .lineLimit(1).truncationMode(.tail)
                .padding(.horizontal, 10)
                .frame(maxWidth: .infinity, minHeight: 26, maxHeight: 26, alignment: .leading)
        }
        .sheet(isPresented: $expanded) {
            VStack(spacing: 0) {
                HStack {
                    Text("追踪表").font(LabFont.ui(13, .semibold))
                    Spacer()
                    Text(model.traceStatus).font(LabFont.ui(12)).foregroundStyle(p.faint).monospacedDigit()
                    Button("关闭") { expanded = false }.buttonStyle(LabButtonStyle(kind: .ghost)).keyboardShortcut(.cancelAction)
                }
                .padding(12)
                TraceTable(model: model, compact: false)
            }
            .frame(minWidth: 900, minHeight: 560)
            .background(p.panel)
            .environment(\.palette, p)
        }
    }
}

/// `.data-table`：12px 等宽、表头 11px 灰、最后一列用数字色。
struct DataTable: View {
    @Environment(\.palette) var p
    let headers: [String]
    let rows: [[String]]

    var body: some View {
        Grid(alignment: .leading, horizontalSpacing: 0, verticalSpacing: 0) {
            GridRow {
                ForEach(headers.indices, id: \.self) { i in
                    Text(headers[i]).font(LabFont.ui(11)).foregroundStyle(p.faint).cell()
                }
            }
            .overlay(alignment: .bottom) { Rectangle().fill(p.border).frame(height: 1) }
            ForEach(rows.indices, id: \.self) { r in
                GridRow {
                    ForEach(rows[r].indices, id: \.self) { i in
                        Text(rows[r][i]).font(LabFont.mono(12))
                            .foregroundStyle(i == rows[r].count - 1 ? p.number : p.text)
                            .lineLimit(1).truncationMode(.tail).cell()
                    }
                }
                .overlay(alignment: .bottom) { Rectangle().fill(p.border).frame(height: 1) }
            }
        }
    }
}

private extension View {
    func cell() -> some View { padding(.horizontal, 10).padding(.vertical, 5).frame(maxWidth: .infinity, alignment: .leading) }
}

/// 追踪表。行与格的内容、样式由后台算好（契约 §4.5），这里只画。
/// 点一行把编辑器里对应的源码行标出来（网页同样行为）。
struct TraceTable: View {
    @ObservedObject var model: LabModel
    @Environment(\.palette) var p
    let compact: Bool

    private var widths: (step: CGFloat, source: CGFloat, action: CGFloat, output: CGFloat, value: CGFloat) {
        compact ? (40, 62, 104, 72, 72) : (40, 62, 160, 140, 110)
    }

    var body: some View {
        // 双向滚动的内容默认不贴顶，行数少时表格会沉到面板中间。从左上角排起，和网页一致。
        ScrollView([.horizontal, .vertical]) {
            LazyVStack(alignment: .leading, spacing: 0, pinnedViews: [.sectionHeaders]) {
                Section(header: header) {
                    ForEach(model.traceRows) { row in rowView(row) }
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        }
        .defaultScrollAnchor(.topLeading)
    }

    private var header: some View {
        HStack(spacing: 0) {
            th("步骤", widths.step); th("源码", widths.source); th("动作", widths.action); th("输出", widths.output)
            ForEach(model.traceColumns) { column in
                (Text(column.scopeLabel.map { $0 + "." } ?? "").foregroundStyle(p.faint) + Text(column.name).foregroundStyle(p.text))
                    .font(LabFont.mono(11)).lineLimit(1)
                    .padding(.horizontal, 6).frame(width: widths.value, height: 26, alignment: .leading)
            }
        }
        .background(p.panel)
        .overlay(alignment: .bottom) { Rectangle().fill(p.border).frame(height: 1) }
    }

    private func th(_ text: String, _ width: CGFloat) -> some View {
        Text(text).font(LabFont.ui(11)).foregroundStyle(p.faint).padding(.horizontal, 6).frame(width: width, height: 26, alignment: .leading)
    }

    @ViewBuilder private func rowView(_ row: TraceDisplayRow) -> some View {
        if let omitted = row.omittedText {
            Text(omitted).font(LabFont.ui(12)).foregroundStyle(p.faint)
                .frame(width: totalWidth, height: 29)
                .overlay(alignment: .bottom) { Rectangle().fill(p.border).frame(height: 1) }
        } else {
            let selected = model.selectedTraceStep == row.step
            HStack(spacing: 0) {
                Text("\(row.step)").foregroundStyle(p.faint).frame(width: widths.step - 12, alignment: .trailing).padding(.horizontal, 6)
                td("第 \(row.line) 行", widths.source, p.text)
                td(row.action, widths.action, p.dim).help(row.action.count > 12 ? row.action : "")
                td(row.output, widths.output, p.string)
                ForEach(model.traceColumns.indices, id: \.self) { i in
                    let cell = i < row.cells.count ? row.cells[i] : TraceCell(text: "", style: "none")
                    td(cell.text, widths.value, cell.style == "unassigned" ? p.faint : cell.style.hasPrefix("same") ? p.warn : p.text)
                        .background(cell.style.hasPrefix("same") ? p.warnSoft : cell.style == "byref" ? p.accentSoft : .clear)
                        .help(cell.note ?? "")
                }
            }
            .font(LabFont.mono(12))
            .frame(height: 29)
            .background(selected ? p.accentSoft : .clear)
            .overlay(selected ? Rectangle().strokeBorder(p.accent) : nil)
            .overlay(alignment: .bottom) { Rectangle().fill(p.border).frame(height: 1) }
            .contentShape(Rectangle())
            .onTapGesture { model.selectedTraceStep = row.step; model.highlightLine(row.line) }
        }
    }

    private var totalWidth: CGFloat {
        widths.step + widths.source + widths.action + widths.output + CGFloat(model.traceColumns.count) * widths.value
    }

    private func td(_ text: String, _ width: CGFloat, _ color: Color) -> some View {
        Text(text).foregroundStyle(color).lineLimit(1).truncationMode(.tail)
            .padding(.horizontal, 6).frame(width: width, alignment: .leading)
    }
}

// MARK: 文件

struct FilesTab: View {
    @ObservedObject var model: LabModel
    @Environment(\.palette) var p

    var body: some View {
        VStack(spacing: 0) {
            PanelHead(title: "运行时虚拟文件")
            VStack(spacing: 0) {
                ForEach(model.state?.runtimeFiles ?? []) { file in
                    HStack(spacing: 6) {
                        Text(file.name).font(LabFont.mono(12)).foregroundStyle(p.text).lineLimit(1).frame(maxWidth: .infinity, alignment: .leading)
                        Text(file.kind == "records" ? "记录" : "文本").font(LabFont.ui(10)).foregroundStyle(p.faint)
                            .frame(width: 52, height: 16).overlay(RoundedRectangle(cornerRadius: 3).strokeBorder(p.border))
                        Text(file.kind == "records" ? "\(file.size) 条" : "\(file.size) 行").font(LabFont.ui(11)).foregroundStyle(p.faint)
                            .monospacedDigit().frame(width: 62, alignment: .trailing)
                    }
                    .padding(.horizontal, 8)
                    .frame(height: 28)
                }
            }
            .padding(4)
            SubHead(title: "打开的 handle")
            if model.handles.isEmpty {
                Text("当前没有打开的文件。").font(LabFont.ui(12)).foregroundStyle(p.faint)
                    .frame(maxWidth: .infinity, alignment: .leading).padding(.horizontal, 10)
            } else {
                DataTable(headers: ["文件", "模式", "位置"], rows: model.handles.map { [$0.name, $0.mode, $0.position] })
            }
            Spacer()
        }
    }
}
