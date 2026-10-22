// swift-tools-version:6.0
// macOS 应用，见 docs/plans/MACOS_APP_PLAN.md。
// 用 SwiftPM 而不是 Xcode 工程：命令行就能构建、跑单元测试、反复跑 WKWebView 探针，
// 不依赖谁先在 Xcode 里点一遍。
//
// SeedToCodeKit：不碰 AppKit / WebKit 的规则（路径白名单、会话 cookie、钥匙串、原生云端传输），
//                有单元测试。
// SeedToCodeProto：窗口、WKWebView、scheme handler、bridge 接线和探针。
import PackageDescription

let package = Package(
    name: "SeedToCodeProto",
    platforms: [.macOS(.v15)],
    targets: [
        .target(name: "SeedToCodeKit", path: "Sources/SeedToCodeKit"),
        .executableTarget(name: "SeedToCodeProto", dependencies: ["SeedToCodeKit"], path: "Sources/SeedToCodeProto"),
        .testTarget(name: "SeedToCodeKitTests", dependencies: ["SeedToCodeKit"], path: "Tests/SeedToCodeKitTests")
    ],
    // 不追 Swift 6 严格并发检查：WebKit 回调和 AppKit 委托的隔离标注会把代码撑成两倍，
    // 换不来任何关于加载方案或传输契约的结论。原型转正式工程时再开。
    swiftLanguageModes: [.v5]
)
