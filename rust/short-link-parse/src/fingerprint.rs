//! URL Fingerprint

/// URL Fingerprint for deduplication
#[derive(Debug, Clone, Default)]
pub struct UrlFingerprint {
    pub host: String,
    pub path: String,
}

/// FNV-1a hash
pub fn fnv_hash(input: &str) -> u64 {
    let mut hash: u64 = 0xcbf29ce484222325;
    for byte in input.bytes() {
        hash ^= byte as u64;
        hash = hash.wrapping_mul(0x100000001b3);
    }
    hash
}
