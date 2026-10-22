import Foundation
import Security

/// 会话 token 的保管处。正式实现是钥匙串；测试用内存实现。
public protocol TokenStore: AnyObject {
    func load() -> (token: String, expiresAt: Date)?
    func save(token: String, expiresAt: Date)
    func clear()
}

public final class MemoryTokenStore: TokenStore {
    private var value: (token: String, expiresAt: Date)?
    public init() {}
    public func load() -> (token: String, expiresAt: Date)? { value }
    public func save(token: String, expiresAt: Date) { value = (token, expiresAt) }
    public func clear() { value = nil }
}

/// 存在本机钥匙串里：只限这台设备（不进 iCloud 钥匙串），开机解锁过一次之后可读。
/// 账户名用服务器的 host:port，本机联调的 token 和线上的永远不会混在一起。
///
/// 注意：用的是登录钥匙串（不是 data protection 钥匙串）。后者要求带 team ID 的签名和
/// keychain-access-groups 授权，ad-hoc 签名的开发版拿不到。代价是开发版每次重新签名后，
/// 第一次读旧条目系统会弹窗问一次；Developer ID 签名的正式版签名稳定，不会弹。
public final class KeychainTokenStore: TokenStore {
    public static let service = "com.ai0506.seedtocode.session"
    private let account: String

    public init(server: URL) {
        account = "\(server.host ?? "unknown"):\(server.port ?? (server.scheme == "https" ? 443 : 80))"
    }

    private var query: [String: Any] {
        [kSecClass as String: kSecClassGenericPassword,
         kSecAttrService as String: Self.service,
         kSecAttrAccount as String: account]
    }

    public func load() -> (token: String, expiresAt: Date)? {
        var search = query
        search[kSecReturnData as String] = true
        search[kSecMatchLimit as String] = kSecMatchLimitOne
        var item: CFTypeRef?
        guard SecItemCopyMatching(search as CFDictionary, &item) == errSecSuccess,
              let data = item as? Data,
              let stored = try? JSONDecoder().decode(Stored.self, from: data) else { return nil }
        return (stored.token, stored.expiresAt)
    }

    public func save(token: String, expiresAt: Date) {
        guard let data = try? JSONEncoder().encode(Stored(token: token, expiresAt: expiresAt)) else { return }
        let attributes: [String: Any] = [
            kSecValueData as String: data,
            kSecAttrAccessible as String: kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly
        ]
        if SecItemUpdate(query as CFDictionary, attributes as CFDictionary) == errSecItemNotFound {
            var add = query
            for (k, v) in attributes { add[k] = v }
            add[kSecAttrSynchronizable as String] = false
            add[kSecAttrLabel as String] = "SeedToCode 登录会话"
            SecItemAdd(add as CFDictionary, nil)
        }
    }

    public func clear() {
        SecItemDelete(query as CFDictionary)
    }

    private struct Stored: Codable {
        let token: String
        let expiresAt: Date
    }
}
