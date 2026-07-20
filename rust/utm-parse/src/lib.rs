//! # utm-parse
//!
//! Fast UTM parameter parsing and normalization library written in Rust.
//!
//! ## Features
//!
//! - 🚀 Zero-copy parsing when possible
//! - 📦 No std dependencies (`no_std` compatible)
//! - 🔄 Automatic mapping of non-standard source parameters
//! - 📱 Platform click ID detection (gclid, fbclid, etc.)
//!
//! ## Quick Start
//!
//! ```rust
//! use utm_parse::{UtmParams, parse_utm_from_url};
//!
//! let url = "https://example.com/page?utm_source=google&utm_campaign=spring_sale";
//! let params = parse_utm_from_url(url).unwrap();
//!
//! assert_eq!(params.utm_source, Some("google".to_string()));
//! assert_eq!(params.utm_campaign, Some("spring_sale".to_string()));
//! ```
//!
//! ## Non-Standard Parameter Mapping
//!
//! Automatically maps common non-standard source parameters:
//!
//! | Non-standard | Maps to |
//! |--------------|---------|
//! | `ref` | `utm_source` |
//! | `source` | `utm_source` |
//! | `via` | `utm_source` |
//! | `fbclid` | `utm_source: "facebook"` |
//! | `gclid` | `utm_source: "google"` |
//!
//! ## License
//!
//! MIT

#![no_std]
#![deny(missing_docs)]
#![forbid(unsafe_code)]

extern crate alloc;

mod error;
mod params;
mod platform;
mod parser;

pub use error::UtmError;
pub use params::{UtmParams, Source};
pub use parser::parse_utm_from_url;

/// Normalize UTM parameters by trimming whitespace
pub fn normalize(params: &mut UtmParams) {
    if let Some(ref mut source) = params.utm_source {
        *source = source.trim().to_string();
        if source.is_empty() {
            params.utm_source = None;
        }
    }
    if let Some(ref mut medium) = params.utm_medium {
        *medium = medium.trim().to_string();
        if medium.is_empty() {
            params.utm_medium = None;
        }
    }
    if let Some(ref mut campaign) = params.utm_campaign {
        *campaign = campaign.trim().to_string();
        if campaign.is_empty() {
            params.utm_campaign = None;
        }
    }
    if let Some(ref mut term) = params.utm_term {
        *term = term.trim().to_string();
        if term.is_empty() {
            params.utm_term = None;
        }
    }
    if let Some(ref mut content) = params.utm_content {
        *content = content.trim().to_string();
        if content.is_empty() {
            params.utm_content = None;
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_standard_utm() {
        let url = "https://example.com?utm_source=google&utm_medium=cpc&utm_campaign=spring";
        let params = parse_utm_from_url(url).unwrap();

        assert_eq!(params.utm_source, Some("google".to_string()));
        assert_eq!(params.utm_medium, Some("cpc".to_string()));
        assert_eq!(params.utm_campaign, Some("spring".to_string()));
    }

    #[test]
    fn test_parse_non_standard_ref() {
        let url = "https://example.com?ref=producthunt";
        let params = parse_utm_from_url(url).unwrap();

        assert_eq!(params.utm_source, Some("producthunt".to_string()));
    }

    #[test]
    fn test_parse_fbclid() {
        let url = "https://example.com?fbclid=abc123";
        let params = parse_utm_from_url(url).unwrap();

        assert_eq!(params.utm_source, Some("facebook".to_string()));
    }

    #[test]
    fn test_parse_gclid() {
        let url = "https://example.com?gclid=xyz789";
        let params = parse_utm_from_url(url).unwrap();

        assert_eq!(params.utm_source, Some("google".to_string()));
    }

    #[test]
    fn test_normalize_whitespace() {
        let url = "https://example.com?utm_source=%20google%20";
        let params = parse_utm_from_url(url).unwrap();

        assert_eq!(params.utm_source, Some("google".to_string()));
    }
}
