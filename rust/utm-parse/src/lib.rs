//! TanStack Ship UTM Parse
//! High-performance UTM parameter parsing for Rust

mod error;
mod params;
mod parser;
mod platform;

pub use error::{Error, Result};
pub use params::{Source, UtmParams};
pub use parser::parse_url;

/// Parse UTM parameters from a URL string
/// 
/// # Example
/// 
/// ```
/// use tanstack_utm_parse::parse_url;
/// 
/// let params = parse_url("https://example.com?utm_source=google&utm_campaign=spring");
/// assert_eq!(params.source_str(), "google");
/// ```
pub fn parse_url(url: &str) -> UtmParams {
    parser::parse_url(url)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_basic_utm() {
        let params = parse_url("https://example.com?utm_source=google&utm_medium=cpc&utm_campaign=spring");
        assert_eq!(params.source_str(), "google");
        assert_eq!(params.medium.as_deref(), Some("cpc"));
        assert_eq!(params.campaign.as_deref(), Some("spring"));
    }

    #[test]
    fn test_gclid() {
        let params = parse_url("https://example.com?gclid=abc123");
        assert_eq!(params.source_str(), "google");
    }

    #[test]
    fn test_fbclid() {
        let params = parse_url("https://example.com?fbclid=abc123");
        assert_eq!(params.source_str(), "facebook");
    }
}
