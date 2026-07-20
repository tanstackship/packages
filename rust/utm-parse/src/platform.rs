//! Platform click ID detection

use crate::params::Source;

/// Platform click ID mapping
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct ClickIdMapping {
    pub param: &'static str,
    pub source: Source,
}

/// All supported platform click IDs
pub const PLATFORM_CLICK_IDS: &[ClickIdMapping] = &[
    ClickIdMapping {
        param: "gclid",
        source: Source::Google,
    },
    ClickIdMapping {
        param: "fbclid",
        source: Source::Facebook,
    },
    ClickIdMapping {
        param: "msclkid",
        source: Source::Bing,
    },
    ClickIdMapping {
        param: "ttclid",
        source: Source::TikTok,
    },
    ClickIdMapping {
        param: "li_fat_id",
        source: Source::LinkedIn,
    },
];

/// Detect platform from click ID
pub fn detect_platform(query: &str) -> Option<(Source, &'static str)> {
    for mapping in PLATFORM_CLICK_IDS {
        if query.contains(mapping.param) {
            return Some((mapping.source, mapping.param));
        }
    }
    None
}

/// Check if a specific click ID parameter exists
pub fn has_click_id(query: &str, param: &str) -> bool {
    query.contains(param)
}

/// Get source from click ID parameter name
pub fn source_from_click_id(param: &str) -> Option<Source> {
    PLATFORM_CLICK_IDS
        .iter()
        .find(|m| m.param == param)
        .map(|m| m.source)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_detect_gclid() {
        let (source, param) = detect_platform("gclid=abc123").unwrap();
        assert_eq!(source, Source::Google);
        assert_eq!(param, "gclid");
    }

    #[test]
    fn test_detect_fbclid() {
        let (source, param) = detect_platform("fbclid=xyz789").unwrap();
        assert_eq!(source, Source::Facebook);
        assert_eq!(param, "fbclid");
    }

    #[test]
    fn test_no_click_id() {
        assert!(detect_platform("page=1").is_none());
    }
}
