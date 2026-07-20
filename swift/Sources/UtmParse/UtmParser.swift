import Foundation

/// UTM URL Parser for Swift
public enum UtmParser {
    
    private static let platformClickIds: [String: String] = [
        "gclid": "google",
        "fbclid": "facebook",
        "msclkid": "bing",
        "ttclid": "tiktok",
        "li_fat_id": "linkedin"
    ]
    
    private static let nonStandardSourceParams: [String] = [
        "ref", "referrer", "refer", "source", "via", "from", "origin", "src"
    ]

    /// Parse UTM parameters from URL string
    ///
    /// - Parameter urlString: URL to parse
    /// - Returns: UtmParams object
    ///
    /// Example:
    /// ```swift
    /// let params = UtmParser.parse("https://example.com?utm_source=google")
    /// print(params.source) // "google"
    /// ```
    public static func parse(_ urlString: String) -> UtmParams {
        guard let url = URL(string: urlString),
              let components = URLComponents(url: url, resolvingAgainstBaseURL: false),
              let queryItems = components.queryItems else {
            return UtmParams()
        }
        
        var params: [String: String] = [:]
        for item in queryItems {
            if let value = item.value {
                params[item.name] = value
            }
        }
        
        // Parse standard UTM params
        var source: String? = params["utm_source"]
        let medium: String? = params["utm_medium"]
        let campaign: String? = params["utm_campaign"]
        let term: String? = params["utm_term"]
        let content: String? = params["utm_content"]
        var platform: String? = nil
        
        // If no utm_source, try platform click IDs
        if source == nil {
            for (clickId, plat) in UtmParser.platformClickIds {
                if params[clickId] != nil {
                    source = plat
                    platform = plat
                    break
                }
            }
        }
        
        // If still no source, try non-standard params
        if source == nil {
            for param in UtmParser.nonStandardSourceParams {
                if let value = params[param], !value.isEmpty {
                    source = value
                    break
                }
            }
        }
        
        return UtmParams(
            source: source,
            medium: medium,
            campaign: campaign,
            term: term,
            content: content,
            platform: platform
        )
    }
}
