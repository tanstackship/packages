//! URL fingerprinting implementation

use crate::error::ShortLinkError;
use url::Url;

// ─── URL Normalization ──────────────────────────────────────────────────────

/// Normalize a URL for fingerprinting
fn normalize_url(url: &Url) -> String {
    let mut normalized = String::new();
    
    // Scheme (lowercase)
    normalized.push_str(&url.scheme().to_lowercase());
    normalized.push_str("://");
    
    // Host (lowercase)
    normalized.push_str(&url.host_str().unwrap_or("").to_lowercase());
    
    // Port (only if non-standard)
    if let Some(port) = url.port() {
        match (url.scheme(), port) {
            ("http", 80) | ("https", 443) | ("http", 8080) | ("https", 8443) => {}
            _ => {
                normalized.push(':');
                normalized.push_str(&port.to_string());
            }
        }
    }
    
    // Path (remove trailing slash except for root)
    let path = url.path();
    if path.is_empty() || path == "/" {
        normalized.push('/');
    } else if path.ends_with('/') {
        normalized.push_str(&path[..path.len() - 1]);
    } else {
        normalized.push_str(path);
    }
    
    // Query params (sorted, only UTM params)
    let utm_keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
    let mut utm_params: Vec<(String, String)> = Vec::new();
    
    for key in utm_keys {
        if let Some(values) = url.query_pairs().find(|(k, _)| k == key) {
            utm_params.push((key.to_string(), values.to_string()));
        }
    }
    
    // Sort for consistent fingerprint
    utm_params.sort_by_key(|(k, _)| *k);
    
    if !utm_params.is_empty() {
        normalized.push('?');
        normalized.push_str(
            &utm_params
                .iter()
                .map(|(k, v)| format!("{}={}", k, v))
                .collect::<Vec<_>>()
                .join("&")
        );
    }
    
    normalized
}

/// FNV-1a hash (fast, good distribution)
pub fn fnv_hash(s: &str) -> u64 {
    let mut hash: u64 = 0xcbf29ce484222325;
    for byte in s.bytes() {
        hash ^= byte as u64;
        hash = hash.wrapping_mul(0x100000001b3);
    }
    hash
}

/// URL fingerprint structure
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct UrlFingerprint {
    /// Normalized URL (lowercase, trailing slash removed)
    pub normalized: String,
    /// Hostname (lowercase)
    pub host: String,
    /// Path without trailing slash
    pub path: String,
    /// Sorted UTM parameters
    pub utm_params: Vec<(String, String)>,
    /// Hash of the normalized URL
    pub hash: u64,
}

impl UrlFingerprint {
    /// Create from a URL string
    pub fn from_url(url_str: &str) -> Result<Self, ShortLinkError> {
        if url_str.is_empty() {
            return Err(ShortLinkError::EmptyUrl);
        }
        
        let url = Url::parse(url_str)
            .map_err(|_| ShortLinkError::InvalidUrl)?;
        
        let host = url.host_str()
            .unwrap_or("")
            .to_lowercase();
        
        let path = url.path().to_string();
        let path = if path != "/" && path.ends_with('/') {
            path[..path.len() - 1].to_string()
        } else {
            path
        };
        
        // Build UTM params
        let utm_keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
        let mut utm_params: Vec<(String, String)> = Vec::new();
        
        for key in utm_keys {
            if let Some(values) = url.query_pairs().find(|(k, _)| k == key) {
                utm_params.push((key.to_string(), values.to_string()));
            }
        }
        utm_params.sort_by_key(|(k, _)| *k);
        
        // Normalize and hash
        let normalized = normalize_url(&url);
        let hash = fnv_hash(&normalized);
        
        Ok(Self {
            normalized,
            host,
            path,
            utm_params,
            hash,
        })
    }
    
    /// Get fingerprint as hex string
    pub fn hash_hex(&self) -> String {
        format!("{:016x}", self.hash)
    }
    
    /// Get short hash (first 8 chars)
    pub fn short_hash(&self) -> String {
        format!("{:08x}", self.hash)
    }
}

/// Build fingerprint from URL string
pub fn build_fingerprint(url: &str) -> Result<UrlFingerprint, ShortLinkError> {
    UrlFingerprint::from_url(url)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_fingerprint_basic() {
        let fp = build_fingerprint("https://Example.com/Page").unwrap();
        assert_eq!(fp.host, "example.com");
        assert_eq!(fp.path, "/Page");
    }

    #[test]
    fn test_fingerprint_trailing_slash() {
        let fp = build_fingerprint("https://example.com/page/").unwrap();
        assert_eq!(fp.path, "/page");
    }

    #[test]
    fn test_fingerprint_case_insensitive() {
        let fp1 = build_fingerprint("https://Example.com/Page").unwrap();
        let fp2 = build_fingerprint("https://example.com/page").unwrap();
        assert_eq!(fp1.normalized, fp2.normalized);
    }

    #[test]
    fn test_fingerprint_utm_order() {
        let fp1 = build_fingerprint("https://example.com?fbclid=a&gclid=b").unwrap();
        let fp2 = build_fingerprint("https://example.com?gclid=b&fbclid=a").unwrap();
        // UTM params are sorted, so these should have same normalized form
        assert_eq!(fp1.utm_params, fp2.utm_params);
    }

    #[test]
    fn test_fingerprint_utm_extraction() {
        let fp = build_fingerprint("https://example.com?utm_source=google&utm_campaign=spring").unwrap();
        assert_eq!(fp.utm_params.len(), 2);
        assert_eq!(fp.utm_params[0].0, "utm_campaign");
        assert_eq!(fp.utm_params[0].1, "spring");
    }

    #[test]
    fn test_hash_consistency() {
        let fp1 = build_fingerprint("https://example.com/page").unwrap();
        let fp2 = build_fingerprint("https://example.com/page").unwrap();
        assert_eq!(fp1.hash, fp2.hash);
    }

    #[test]
    fn test_empty_url() {
        assert!(build_fingerprint("").is_err());
    }
}
