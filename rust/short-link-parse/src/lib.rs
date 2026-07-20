//! # short-link-parse
//!
//! URL fingerprinting and short link deduplication library.
//!
//! Generate consistent fingerprints for URLs to detect duplicates and enable
//! short link deduplication.
//!
//! ## Features
//!
//! - 🔗 URL normalization and fingerprinting
//! - 🎯 Deterministic slug generation
//! - 📊 Deduplication support
//! - 🌐 Works with UTM parameters
//!
//! ## Quick Start
//!
//! ```rust
//! use short_link_parse::{UrlFingerprint, build_fingerprint};
//!
//! let url = "https://example.com/page?utm_source=google&fbclid=abc";
//! let fp = build_fingerprint(url).unwrap();
//!
//! assert_eq!(fp.host, "example.com");
//! ```
//!
//! ## License
//!
//! MIT

#![deny(missing_docs)]
#![forbid(unsafe_code)]

mod error;
mod fingerprint;

pub use error::ShortLinkError;
pub use fingerprint::{UrlFingerprint, build_fingerprint, fnv_hash, generate_slug};

/// Generate a random slug
/// 
/// Generates a URL-safe slug of specified length.
/// 
/// # Arguments
/// 
/// * `length` - The length of the slug to generate
/// 
/// # Example
/// 
/// ```rust
/// let slug = generate_slug(8);
/// assert_eq!(slug.len(), 8);
/// assert!(slug.chars().all(|c| c.is_ascii_lowercase()));
/// ```
pub fn generate_slug(length: usize) -> String {
    use std::iter::repeat;
    
    const CHARS: &[u8] = b"abcdefghijklmnopqrstuvwxyz0123456789";
    let range = repeat(0u8..CHARS.len())
        .take(length)
        .flat_map(|range| range)
        .take(length);
    
    range.map(|i| CHARS[i] as char).collect()
}

/// Validate URL length
pub fn validate_url_length(url: &str) -> Result<(), ShortLinkError> {
    const MAX_URL_LENGTH: usize = 8192;
    
    if url.is_empty() {
        return Err(ShortLinkError::EmptyUrl);
    }
    if url.len() > MAX_URL_LENGTH {
        return Err(ShortLinkError::UrlTooLong);
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_empty_url() {
        assert!(validate_url_length("").is_err());
    }

    #[test]
    fn test_url_too_long() {
        let long_url = "https://example.com/".repeat(1000);
        assert!(validate_url_length(&long_url).is_err());
    }

    #[test]
    fn test_fingerprint_consistency() {
        let url1 = "https://example.com/page?fbclid=abc&gclid=xyz";
        let url2 = "https://example.com/page?gclid=xyz&fbclid=abc";

        let fp1 = build_fingerprint(url1).unwrap();
        let fp2 = build_fingerprint(url2).unwrap();

        // Should be the same regardless of param order
        assert_eq!(fp1.utm_params, fp2.utm_params);
    }

    #[test]
    fn test_generate_slug() {
        let slug = generate_slug(6);
        assert_eq!(slug.len(), 6);
        assert!(slug.chars().all(|c| c.is_ascii_lowercase() || c.is_ascii_digit()));
    }

    #[test]
    fn test_generate_slug_length() {
        assert_eq!(generate_slug(8).len(), 8);
        assert_eq!(generate_slug(12).len(), 12);
    }
}
