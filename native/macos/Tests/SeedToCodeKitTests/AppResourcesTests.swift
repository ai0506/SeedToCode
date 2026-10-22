import XCTest
@testable import SeedToCodeKit

final class AppResourcesTests: XCTestCase {
    func testPackagedAppNeverFallsBackToDevelopmentResources() {
        let app = URL(fileURLWithPath: "/Applications/SeedToCodeProto.app")
        let resources = app.appendingPathComponent("Contents/Resources")
        XCTAssertEqual(AppResources.directory(bundleURL: app, resourceURL: resources,
            packageRoot: URL(fileURLWithPath: "/repo/native/macos")), resources)
        XCTAssertEqual(AppResources.directory(bundleURL: app, resourceURL: nil,
            packageRoot: URL(fileURLWithPath: "/repo/native/macos")), resources)
        XCTAssertFalse(AppResources.missingFiles(in: resources).isEmpty)
    }

    func testBareExecutableUsesCompletePackagedResourcesRegardlessOfBundleDirectory() {
        let root = URL(fileURLWithPath: "/repo/native/macos")
        let expected = root.appendingPathComponent("build/SeedToCodeProto.app/Contents/Resources")
        for directory in ["/repo/native/macos/.build/debug", "/tmp/Xcode/DerivedData/Build/Products/Debug"] {
            XCTAssertEqual(AppResources.directory(bundleURL: URL(fileURLWithPath: directory),
                resourceURL: URL(fileURLWithPath: directory), packageRoot: root), expected)
        }
    }

    func testMissingResourcesAndIncompletePackageAreReported() throws {
        let temporary = FileManager.default.temporaryDirectory.appendingPathComponent(UUID().uuidString)
        defer { try? FileManager.default.removeItem(at: temporary) }
        XCTAssertTrue(AppResources.missingFiles(in: temporary).contains("web/lab.html"))
        try FileManager.default.createDirectory(at: temporary.appendingPathComponent("web"), withIntermediateDirectories: true)
        try Data("lab".utf8).write(to: temporary.appendingPathComponent("web/lab.html"))
        let missing = AppResources.missingFiles(in: temporary)
        XCTAssertFalse(missing.contains("web/lab.html"))
        XCTAssertTrue(missing.contains("web/js/runtime-engine.js"))
        XCTAssertTrue(missing.contains("web-spec.json"))
    }
}
