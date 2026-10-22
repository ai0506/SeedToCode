import Foundation

/// SwiftPM/Xcode 的裸可执行文件没有 Contents/Resources，不能把 Bundle.main
/// 当作已经打包的 App。开发运行复用打包脚本产出的完整资源，避免混装源码与旧 bundle。
public enum AppResources {
    public static func directory(bundleURL: URL, resourceURL: URL?, packageRoot: URL) -> URL {
        if bundleURL.pathExtension == "app" {
            // App 缺资源是打包错误，不能偷偷读取开发机上的仓库掩盖问题。
            return resourceURL ?? bundleURL.appendingPathComponent("Contents/Resources")
        }
        return packageRoot.appendingPathComponent("build/SeedToCodeProto.app/Contents/Resources")
    }

    public static func missingFiles(in directory: URL) -> [String] {
        let required = ["web/lab.html", "web/js/language-engine.js", "web/js/runtime-engine.js",
                        "web/js/storage.js", "web/js/teaching-content.js", "web/js/exercise-engine.js",
                        "web/js/assignment-core.js", "web-spec.json"]
        return required.filter { !FileManager.default.isReadableFile(atPath: directory.appendingPathComponent($0).path) }
    }
}
