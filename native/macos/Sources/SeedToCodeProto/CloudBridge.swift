import SeedToCodeKit
import WebKit

/// 页面 → 原生云端传输的桥。页面那一端在 web/js/cloud-client.js 的 NATIVE 分支。
///
/// 消息格式见 docs/plans/MACOS_CLOUD_TRANSPORT.md §5.1。任何不合规矩的消息都回
/// `{ ok: false, kind: "rejected" }`，不抛错：抛错在页面那边会被当成断网，同步队列就会一直重试。
@MainActor
final class CloudBridge: NSObject, WKScriptMessageHandlerWithReply {
    static let name = "seedtocodeCloud"
    static let protocolVersion = 1

    let transport: CloudTransport

    init(transport: CloudTransport) {
        self.transport = transport
    }

    func userContentController(_ controller: WKUserContentController, didReceive message: WKScriptMessage,
                               replyHandler: @escaping (Any?, String?) -> Void) {
        // 只认主框架、只认包内页面。导航策略已经挡掉了外站，这里是第二道：
        // 哪天谁在页面里嵌了一个 iframe，它也拿不到这个通道。
        let origin = message.frameInfo.securityOrigin
        guard message.frameInfo.isMainFrame,
              origin.protocol == AppSchemeHandler.scheme, origin.host == AppSchemeHandler.host,
              let body = message.body as? [String: Any],
              body["protocol"] as? Int == Self.protocolVersion,
              let type = body["type"] as? String,
              let requestId = body["requestId"] as? String, requestId.count <= 64 else {
            return replyHandler(["ok": false, "kind": "rejected"], nil)
        }

        switch type {
        case "cancel":
            transport.cancel(requestId: requestId)
            replyHandler(["ok": true], nil)
        case "request":
            guard let method = body["method"] as? String, let path = body["path"] as? String else {
                return replyHandler(["requestId": requestId, "ok": false, "kind": "rejected"], nil)
            }
            let payload = body["body"] as? String
            Task { @MainActor in
                switch await transport.send(requestId: requestId, method: method, path: path, body: payload) {
                case .success(let response):
                    replyHandler([
                        "requestId": requestId, "ok": true, "status": response.status,
                        "contentType": response.contentType.map { $0 as Any } ?? NSNull(),
                        "retryAfter": response.retryAfter.map { $0 as Any } ?? NSNull(),
                        "text": response.text
                    ], nil)
                case .failure(let failure):
                    replyHandler(["requestId": requestId, "ok": false, "kind": failure.rawValue], nil)
                }
            }
        default:
            replyHandler(["requestId": requestId, "ok": false, "kind": "rejected"], nil)
        }
    }
}
