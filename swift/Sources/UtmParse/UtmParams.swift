import Foundation

/// UTM Parameters container
public struct UtmParams {
    public let source: String?
    public let medium: String?
    public let campaign: String?
    public let term: String?
    public let content: String?
    public let platform: String?

    public init(
        source: String? = nil,
        medium: String? = nil,
        campaign: String? = nil,
        term: String? = nil,
        content: String? = nil,
        platform: String? = nil
    ) {
        self.source = source
        self.medium = medium
        self.campaign = campaign
        self.term = term
        self.content = content
        self.platform = platform
    }

    public var isEmpty: Bool {
        source == nil && medium == nil && campaign == nil && term == nil && content == nil
    }
}
