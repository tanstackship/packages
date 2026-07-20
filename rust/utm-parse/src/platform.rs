//! Platform detection from click IDs

use crate::params::Source;

/// Map of click ID parameters to their platforms
pub const PLATFORM_CLICK_IDS: &[(&str, &str)] = &[
    ("gclid", "google"),
    ("fbclid", "facebook"),
    ("msclkid", "bing"),
    ("ttclid", "tiktok"),
    ("li_fat_id", "linkedin"),
    ("twclid", "twitter"),
    ("mc_eid", "mailchimp"),
    ("oly_enc_id", "outlook"),
    ("旺季_id", "baidu"),
];

/// Detect platform from click ID parameter
pub fn detect_platform(param: &str, platform: &str) -> Source {
    match platform {
        "google" => Source::Google,
        "facebook" => Source::Facebook,
        "twitter" => Source::Twitter,
        "linkedin" => Source::LinkedIn,
        "bing" => Source::Bing,
        "tiktok" => Source::TikTok,
        "reddit" => Source::Reddit,
        "github" => Source::Github,
        _ => Source::Unknown(platform.to_string()),
    }
}

/// Find platform by click ID
pub fn find_by_click_id(param: &str) -> Option<Source> {
    PLATFORM_CLICK_IDS
        .iter()
        .find(|(p, _)| *p == param)
        .map(|(_, platform)| detect_platform(param, platform))
}
