// 阶段 A 原型入口。只回答 MACOS_APP_PLAN.md §4 的问题：
// 「App 内置资源 + 专用 scheme」能不能离线启动、持久化、跑共享核心，
// 以及它和现有同源认证之间到底差在哪。这里的代码是可丢弃的，不是首版外壳。
import AppKit

/// 进程真正开始的时刻（内核记录的），不是 main 第一行——冷启动要从使用者双击算起，
/// dyld 加载这些 framework 的时间也算在内。
let processStart: Date = {
    var info = kinfo_proc()
    var size = MemoryLayout<kinfo_proc>.stride
    var mib: [Int32] = [CTL_KERN, KERN_PROC, KERN_PROC_PID, getpid()]
    guard sysctl(&mib, 4, &info, &size, nil, 0) == 0 else { return Date() }
    let tv = info.kp_proc.p_starttime
    return Date(timeIntervalSince1970: Double(tv.tv_sec) + Double(tv.tv_usec) / 1_000_000)
}()

let options = LaunchOptions.parse(Array(CommandLine.arguments.dropFirst()))
let app = NSApplication.shared
let delegate = AppDelegate(options: options)
app.delegate = delegate
// 探针模式不抢 Dock 和焦点：要反复自动跑，每跑一次跳出一个前台窗口很打扰人。
// 窗口仍然放在屏幕上——WebKit 对完全不可见的视图会节流计时器，测出来的不是真实情况。
app.setActivationPolicy(options.task == .none ? .regular : .accessory)
app.run()
