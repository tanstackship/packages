//! TanStack Ship Short Link Parse
//! Parse short links and extract tracking information

mod error;
mod fingerprint;

pub use error::{Error, Result};
pub use fingerprint::UrlFingerprint;

/// Short link info
#[derive(Debug, Clone)]
pub struct ShortLinkInfo {
    pub code: String,
    pub destination: Option<String>,
    pub platform: Option<String>,
    pub shortener: Option<String>,
}

/// Parse a short link URL
pub fn parse_short_link(url: &str) -> ShortLinkInfo {
    let mut info = ShortLinkInfo {
        code: String::new(),
        destination: None,
        platform: None,
        shortener: None,
    };

    let shorteners = [
        ("t.co", "twitter"),
        ("bit.ly", "bitly"),
        ("goo.gl", "google"),
        ("tinyurl.com", "tinyurl"),
        ("ow.ly", "hootsuite"),
    ];

    for (domain, name) in &shorteners {
        if url.contains(domain) {
            info.shortener = Some(name.to_string());
            if let Some(code) = extract_code(url) {
                info.code = code;
            }
            break;
        }
    }

    info
}

fn extract_code(url: &str) -> Option<String> {
    if let Some(path_start) = url.find("://") {
        let after_host = &url[path_start + 3..];
        if let Some(path_pos) = after_host.find('/') {
            let path = &after_host[path_pos + 1..];
            if let Some(path_end) = path.find('/') {
                return Some(path[..path_end].to_string());
            } else if !path.is_empty() {
                return Some(path.split('?').next().unwrap_or(path).to_string());
            }
        }
    }
    None
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
