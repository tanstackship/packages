//! URL Fingerprint for deduplication

use crate::alloc::{string::String, vec::Vec};

/// URL Fingerprint for deduplication
#[derive(Debug, Clone, Default)]
pub struct UrlFingerprint {
    /// Host/domain
    pub host: String,
    /// Path without query
    pub path: String,
    /// UTM source if present
    pub utm_source: Option<String>,
    /// UTM medium if present
    pub utm_medium: Option<String>,
    /// UTM campaign if present
    pub utm_campaign: Option<String>,
}

/// Build fingerprint string from URL parts
pub fn build_fingerprint(fp: &UrlFingerprint) -> String {
    let mut parts = Vec::with_capacity(5);
    
    parts.push(fp.host.clone());
    parts.push(fp.path.clone());
    
    if let Some(ref s) = fp.utm_source {
        parts.push(s.clone());
    }
    if let Some(ref m) = fp.utm_medium {
        parts.push(m.clone());
    }
    if let Some(ref c) = fp.utm_campaign {
        parts.push(c.clone());
    }
    
    parts.join("|")
}

/// FNV-1a hash (simplified for no_std)
pub fn fnv_hash(input: &str) -> u64 {
    let mut hash: u64 = 0xcbf29ce484222325;
    for byte in input.bytes() {
        hash ^= byte as u64;
        hash = hash.wrapping_mul(0x100000001b3);
    }
    hash
}

/// Parse UTM parameters into fingerprint
pub fn parse_utm_params(query: &str, fp: &mut UrlFingerprint) {
    for pair in query.split('&') {
        let (key, value) = if let Some(eq) = pair.find('=') {
            (&pair[..eq], Some(&pair[eq + 1..]))
        } else {
            (pair, None)
        };

        match key {
            "utm_source" => fp.utm_source = value.map(|s| s.to_string()),
            "utm_medium" => fp.utm_medium = value.map(|s| s.to_string()),
            "utm_campaign" => fp.utm_campaign = value.map(|s| s.to_string()),
            _ => {}
        }
    }
}
