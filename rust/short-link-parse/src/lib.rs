//! TanStack Ship Short Link Parse
//! Parse short links and extract tracking information

mod error;
mod fingerprint;

use error::{Error, Result};
use fingerprint::{build_fingerprint, UrlFingerprint};

pub use error::{Error, Result};
pub use fingerprint::UrlFingerprint;

/// Short link info
#[derive(Debug, Clone)]
pub struct ShortLinkInfo {
    /// The short code/slug
    pub code: String,
    /// Full destination URL if known
    pub destination: Option<String>,
    /// Fingerprint for deduplication
    pub fingerprint: Option<UrlFingerprint>,
    /// Platform info
    pub platform: Option<String>,
    /// Whether this is a known shortener
    pub shortener: Option<String>,
}

impl ShortLinkInfo {
    /// Get fingerprint string
    pub fn fingerprint_str(&self) -> Option<String> {
        self.fingerprint.map(|f| build_fingerprint(&f))
    }
}

/// Parse a short link URL
/// 
/// # Example
/// 
/// ```
/// use tanstack_short_link_parse::parse_short_link;
/// 
/// let info = parse_short_link("https://t.co/abc123");
/// assert!(info.shortener.is_some());
/// ```
pub fn parse_short_link(url: &str) -> ShortLinkInfo {
    let mut info = ShortLinkInfo {
        code: String::new(),
        destination: None,
        fingerprint: None,
        platform: None,
        shortener: None,
    };

    // Known shorteners
    let shorteners = [
        ("t.co", "twitter"),
        ("bit.ly", "bitly"),
        ("goo.gl", "google"),
        ("tinyurl.com", "tinyurl"),
        ("ow.ly", "hootsuite"),
        ("buff.ly", "buffer"),
        ("adf.ly", "adfly"),
        ("bit.do", "bitdo"),
        ("mcaf.ee", "mcafee"),
        ("cli.gs", "cligs"),
    ];

    // Check if URL matches a known shortener
    for (domain, name) in shorteners.iter() {
        if url.contains(domain) {
            info.shortener = Some(name.to_string());
            // Extract code
            if let Some(code) = extract_code(url) {
                info.code = code;
            }
            break;
        }
    }

    // Build fingerprint for deduplication
    if let Some(fingerprint) = build_url_fingerprint(url) {
        info.fingerprint = Some(fingerprint);
    }

    info
}

/// Extract code from URL
fn extract_code(url: &str) -> Option<String> {
    // Try to find path segments
    if let Some(path_start) = url.find("://") {
        let after_host = &url[path_start + 3..];
        if let Some(path_start) = after_host.find('/') {
            let path = &after_host[path_start + 1..];
            // Get first segment
            if let Some(path_end) = path.find('/') {
                return Some(path[..path_end].to_string());
            } else if !path.is_empty() && !path.contains('?') {
                return Some(path.split('?').next().unwrap_or(path).to_string());
            }
        }
    }
    None
}

/// Build fingerprint from URL
fn build_url_fingerprint(url: &str) -> Option<UrlFingerprint> {
    let mut fp = UrlFingerprint {
        host: String::new(),
        path: String::new(),
        utm_source: None,
        utm_medium: None,
        utm_campaign: None,
    };

    // Parse URL manually
    if let Some(host_start) = url.find("://") {
        let after_scheme = &url[host_start + 3..];
        let (host, path_with_query) = if let Some(path_pos) = after_scheme.find('/') {
            (&after_scheme[..path_pos], Some(&after_scheme[path_pos..]))
        } else {
            (after_host, None)
        };
        
        fp.host = host.to_string();
        
        if let Some(pq) = path_with_query {
            // Remove query string for fingerprint
            if let Some(path_end) = pq.find('?') {
                fp.path = pq[..path_end].to_string();
            } else {
                fp.path = pq.to_string();
            }
        }
    }

    Some(fp)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_twitter_short_link() {
        let info = parse_short_link("https://t.co/abc123xyz");
        assert_eq!(info.shortener, Some("twitter".to_string()));
        assert_eq!(info.code, "abc123xyz");
    }

    #[test]
    fn test_bitly_short_link() {
        let info = parse_short_link("https://bit.ly/3abc123");
        assert_eq!(info.shortener, Some("bitly".to_string()));
    }
}
