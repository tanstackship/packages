//! Platform detection

/// Map of click ID parameters to their platforms
pub const PLATFORM_CLICK_IDS: &[(&str, &str)] = &[
    ("gclid", "google"),
    ("fbclid", "facebook"),
    ("msclkid", "bing"),
    ("ttclid", "tiktok"),
    ("li_fat_id", "linkedin"),
    ("twclid", "twitter"),
    ("mc_eid", "mailchimp"),
];
