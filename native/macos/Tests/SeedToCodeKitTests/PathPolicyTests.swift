import XCTest
@testable import SeedToCodeKit

final class PathPolicyTests: XCTestCase {
    let base = URL(string: "https://seedtocode.example.invalid")!

    func url(_ method: String, _ path: String) -> URL? { PathPolicy.url(base: base, method: method, path: path) }

    func testAcceptsWhatThePagesActuallySend() {
        XCTAssertEqual(url("GET", "/auth/me")?.absoluteString, "https://seedtocode.example.invalid/auth/me")
        XCTAssertNotNil(url("POST", "/auth/email/login"))
        XCTAssertNotNil(url("PUT", "/api/projects/0f8c-11/files/a%20b.txt"))
        XCTAssertNotNil(url("DELETE", "/api/projects/0f8c-11"))
        // 课程小节 id 带点：不能被当成路径穿越
        XCTAssertNotNil(url("PUT", "/api/teaching/progress/3/1.2.1"))
        XCTAssertNotNil(url("PUT", "/api/practice-drafts/3/%E4%B8%AD%E6%96%87"))
        XCTAssertEqual(url("GET", "/api/classes/c1/practice-submissions?taskId=t%2F1")?.query, "taskId=t%2F1")
    }

    func testHostCannotBeChanged() {
        XCTAssertNil(url("GET", "//evil.example/api/x"))
        XCTAssertNil(url("GET", "https://evil.example/api/x"))
        XCTAssertNil(url("GET", "/api/x@evil.example"))
        XCTAssertNil(url("GET", "/api/x#frag"))
        XCTAssertNil(url("GET", "/api/x\\y"))
    }

    func testOnlyApiAndAuthPrefixes() {
        XCTAssertNil(url("GET", "/lab.html"))
        XCTAssertNil(url("GET", "/health"))
        XCTAssertNil(url("GET", "/apix/projects"))
        XCTAssertNil(url("GET", "api/projects"))
    }

    func testTraversalAndEmptySegments() {
        XCTAssertNil(url("GET", "/api/../lab.html"))
        XCTAssertNil(url("GET", "/api/%2e%2e/lab.html"))
        XCTAssertNil(url("GET", "/api/%2E/x"))
        XCTAssertNil(url("GET", "/api/./x"))
        XCTAssertNil(url("GET", "/api//x"))
        XCTAssertNil(url("GET", "/api/x/%0a"))
    }

    func testMethodsAndCharacters() {
        XCTAssertNil(url("PATCH", "/api/projects"))
        XCTAssertNil(url("get", "/api/projects"))
        XCTAssertNil(url("GET", "/api/中文"))
        XCTAssertNil(url("GET", "/api/a b"))
        XCTAssertNil(url("GET", "/api/x?a=<script>"))
        XCTAssertNil(url("GET", "/api/" + String(repeating: "a", count: 3000)))
    }

    func testLoopbackBaseKeepsPort() {
        let local = URL(string: "http://127.0.0.1:8787")!
        XCTAssertEqual(PathPolicy.url(base: local, method: "GET", path: "/auth/me")?.absoluteString, "http://127.0.0.1:8787/auth/me")
    }
}

final class SessionCookieTests: XCTestCase {
    let now = Date(timeIntervalSince1970: 1_000_000)

    func testSetWithMaxAge() {
        let header = "seedtocode_session=abc123; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000; Secure"
        XCTAssertEqual(SessionCookie.update(fromSetCookie: header, now: now),
                       .set(token: "abc123", expiresAt: now.addingTimeInterval(2_592_000)))
    }

    func testExpiredOrEmptyClears() {
        XCTAssertEqual(SessionCookie.update(fromSetCookie: "seedtocode_session=; Path=/; HttpOnly; Max-Age=0"), .clear)
        XCTAssertEqual(SessionCookie.update(fromSetCookie: "seedtocode_session=x; Max-Age=0"), .clear)
    }

    func testOtherCookiesIgnored() {
        XCTAssertNil(SessionCookie.update(fromSetCookie: "seedtocode_probe_ho=1; Path=/; HttpOnly; Max-Age=600"))
        XCTAssertNil(SessionCookie.update(fromSetCookie: nil))
    }

    func testMergedHeaderFindsSession() {
        let merged = "seedtocode_probe=1; Path=/; Max-Age=600, seedtocode_session=tok; Path=/; HttpOnly; Max-Age=60"
        XCTAssertEqual(SessionCookie.update(fromSetCookie: merged, now: now), .set(token: "tok", expiresAt: now.addingTimeInterval(60)))
    }
}
