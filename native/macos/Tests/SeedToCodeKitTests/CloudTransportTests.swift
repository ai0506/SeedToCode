import XCTest
@testable import SeedToCodeKit

/// 假的服务器：按路径回响应，记下收到的每个请求（含 Cookie 头）。
final class MockServer: URLProtocol {
    struct Reply {
        var status = 200
        var headers: [String: String] = [:]
        var body = "{}"
        var delay: TimeInterval = 0
        var failure: URLError.Code?
    }
    nonisolated(unsafe) static var replies: [String: Reply] = [:]
    nonisolated(unsafe) static var received: [URLRequest] = []
    static let lock = NSLock()

    static func reset() {
        lock.lock(); replies = [:]; received = []; lock.unlock()
    }

    override class func canInit(with request: URLRequest) -> Bool { true }
    override class func canonicalRequest(for request: URLRequest) -> URLRequest { request }

    override func startLoading() {
        Self.lock.lock()
        Self.received.append(request)
        let reply = Self.replies[request.url!.path] ?? Reply(status: 404, body: #"{"code":"NOT_FOUND"}"#)
        Self.lock.unlock()
        DispatchQueue.global().asyncAfter(deadline: .now() + reply.delay) { [self] in
            if let failure = reply.failure {
                client?.urlProtocol(self, didFailWithError: URLError(failure))
                return
            }
            var headers = reply.headers
            headers["Content-Type"] = "application/json; charset=utf-8"
            let response = HTTPURLResponse(url: request.url!, statusCode: reply.status, httpVersion: "HTTP/1.1", headerFields: headers)!
            client?.urlProtocol(self, didReceive: response, cacheStoragePolicy: .notAllowed)
            client?.urlProtocol(self, didLoad: Data(reply.body.utf8))
            client?.urlProtocolDidFinishLoading(self)
        }
    }

    override func stopLoading() {}
}

@MainActor
final class CloudTransportTests: XCTestCase {
    let base = URL(string: "https://seedtocode.example.invalid")!
    var store: MemoryTokenStore!
    var transport: CloudTransport!

    override func setUp() async throws {
        MockServer.reset()
        store = MemoryTokenStore()
        transport = CloudTransport(base: base, store: store, userAgent: "SeedToCode-macOS/test", protocolClasses: [MockServer.self])
    }

    func login(_ token: String = "tok-A", delay: TimeInterval = 0) {
        MockServer.replies["/auth/email/login"] = .init(
            headers: ["Set-Cookie": "seedtocode_session=\(token); Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000"],
            body: #"{"user":{"id":"u1"}}"#, delay: delay)
    }

    func cookie(of index: Int) -> String? { MockServer.received[index].value(forHTTPHeaderField: "Cookie") }

    func testLoginStoresTokenAndLaterRequestsCarryIt() async {
        login()
        MockServer.replies["/auth/me"] = .init(body: #"{"user":{"id":"u1"}}"#)
        _ = await transport.send(requestId: "1", method: "POST", path: "/auth/email/login", body: "{}")
        XCTAssertEqual(store.load()?.token, "tok-A")
        _ = await transport.send(requestId: "2", method: "GET", path: "/auth/me", body: nil)
        XCTAssertNil(cookie(of: 0))
        XCTAssertEqual(cookie(of: 1), "seedtocode_session=tok-A")
        XCTAssertEqual(MockServer.received[1].value(forHTTPHeaderField: "User-Agent"), "SeedToCode-macOS/test")
    }

    func testSetCookieOnOtherRoutesIsIgnored() async {
        MockServer.replies["/api/projects"] = .init(headers: ["Set-Cookie": "seedtocode_session=evil; Max-Age=999"])
        _ = await transport.send(requestId: "1", method: "GET", path: "/api/projects", body: nil)
        XCTAssertNil(store.load())
        // 登录接口失败时带回的 Set-Cookie 也不接
        MockServer.replies["/auth/email/login"] = .init(status: 401, headers: ["Set-Cookie": "seedtocode_session=x; Max-Age=999"],
                                                       body: #"{"code":"INVALID_CREDENTIALS"}"#)
        _ = await transport.send(requestId: "2", method: "POST", path: "/auth/email/login", body: "{}")
        XCTAssertNil(store.load())
    }

    func testLogoutClearsEvenWhenOffline() async {
        login()
        _ = await transport.send(requestId: "1", method: "POST", path: "/auth/email/login", body: "{}")
        MockServer.replies["/auth/logout"] = .init(failure: .notConnectedToInternet)
        let result = await transport.send(requestId: "2", method: "POST", path: "/auth/logout", body: nil)
        XCTAssertEqual(result, .failure(.offline))
        XCTAssertNil(store.load())
        XCTAssertFalse(transport.isSignedIn)
        // 但退出请求本身带着旧 token 出去了，服务端才能删掉那条 session
        XCTAssertEqual(cookie(of: 1), "seedtocode_session=tok-A")
    }

    func testLateLoginResponseAfterLogoutDoesNotSignBackIn() async {
        login("tok-late", delay: 0.3)
        MockServer.replies["/auth/logout"] = .init()
        async let slowLogin = transport.send(requestId: "1", method: "POST", path: "/auth/email/login", body: "{}")
        try? await Task.sleep(nanoseconds: 50_000_000)
        _ = await transport.send(requestId: "2", method: "POST", path: "/auth/logout", body: nil)
        _ = await slowLogin
        XCTAssertNil(store.load(), "退出之后晚到的登录响应不能把人又登回去")
    }

    func testOnlyUnauthenticatedClearsSession() async {
        login()
        _ = await transport.send(requestId: "1", method: "POST", path: "/auth/email/login", body: "{}")
        MockServer.replies["/auth/student/login"] = .init(status: 401, body: #"{"code":"INVALID_CREDENTIALS"}"#)
        _ = await transport.send(requestId: "2", method: "POST", path: "/auth/student/login", body: "{}")
        XCTAssertEqual(store.load()?.token, "tok-A", "密码输错不能把现有登录清掉")
        MockServer.replies["/auth/me"] = .init(status: 401, body: #"{"code":"UNAUTHENTICATED"}"#)
        _ = await transport.send(requestId: "3", method: "GET", path: "/auth/me", body: nil)
        XCTAssertNil(store.load())
    }

    func testStaleUnauthenticatedDoesNotClearNewSession() async {
        // 旧请求（未登录时发出）晚到一个 401；期间已经登录。它说的是上一代，不能清掉新登录。
        MockServer.replies["/api/projects"] = .init(status: 401, body: #"{"code":"UNAUTHENTICATED"}"#, delay: 0.3)
        login()
        async let stale = transport.send(requestId: "1", method: "GET", path: "/api/projects", body: nil)
        try? await Task.sleep(nanoseconds: 50_000_000)
        _ = await transport.send(requestId: "2", method: "POST", path: "/auth/email/login", body: "{}")
        _ = await stale
        XCTAssertEqual(store.load()?.token, "tok-A")
    }

    func testRejectedPathsNeverReachTheNetwork() async {
        for path in ["//evil.example/api/x", "/api/../lab.html", "/lab.html"] {
            let result = await transport.send(requestId: path, method: "GET", path: path, body: nil)
            XCTAssertEqual(result, .failure(.rejected), path)
        }
        let patch = await transport.send(requestId: "p", method: "PATCH", path: "/api/projects", body: nil)
        XCTAssertEqual(patch, .failure(.rejected))
        XCTAssertTrue(MockServer.received.isEmpty)
    }

    func testOversizedBodyRejectedLocally() async {
        let big = String(repeating: "a", count: CloudTransport.maxRequestBytes + 1)
        let result = await transport.send(requestId: "1", method: "PUT", path: "/api/projects/p1", body: big)
        XCTAssertEqual(result, .failure(.tooLarge))
        XCTAssertTrue(MockServer.received.isEmpty)
    }

    func testRedirectIsNotFollowed() async {
        MockServer.replies["/api/projects"] = .init(status: 302, headers: ["Location": "https://evil.example/steal"], body: "")
        let result = await transport.send(requestId: "1", method: "GET", path: "/api/projects", body: nil)
        guard case .success(let response) = result else { return XCTFail("\(result)") }
        XCTAssertEqual(response.status, 302)
        XCTAssertEqual(MockServer.received.count, 1)
    }

    func testCancel() async {
        MockServer.replies["/api/projects"] = .init(delay: 2)
        async let pending = transport.send(requestId: "c", method: "GET", path: "/api/projects", body: nil)
        try? await Task.sleep(nanoseconds: 50_000_000)
        transport.cancel(requestId: "c")
        let result = await pending
        XCTAssertEqual(result, .failure(.cancelled))
    }

    func testStoredTokenIsRestoredAndExpiredOneIsDropped() {
        let live = MemoryTokenStore()
        live.save(token: "kept", expiresAt: Date().addingTimeInterval(60))
        XCTAssertTrue(CloudTransport(base: base, store: live, userAgent: "t").isSignedIn)
        let expired = MemoryTokenStore()
        expired.save(token: "old", expiresAt: Date().addingTimeInterval(-1))
        XCTAssertFalse(CloudTransport(base: base, store: expired, userAgent: "t").isSignedIn)
        XCTAssertNil(expired.load())
    }
}
