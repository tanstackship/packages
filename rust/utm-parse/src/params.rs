//! UTM parameter structures

use alloc::string::String;
use serde::{Deserialize, Serialize};

/// Known source platforms
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum Source {
    /// Google
    Google,
    /// Facebook
    Facebook,
    /// Twitter
    Twitter,
    /// LinkedIn
    LinkedIn,
    /// Instagram
    Instagram,
    /// TikTok
    TikTok,
    /// Bing
    Bing,
    /// Newsletter
    Newsletter,
    /// Product Hunt
    ProductHunt,
    /// GitHub
    GitHub,
    /// Reddit
    Reddit,
    /// Discord
    Discord,
    /// Referral
    Referral,
    /// Direct
    Direct,
    /// Custom source
    Custom(String),
}

impl Source {
    /// Convert source to string
    pub fn as_str(&self) -> &str {
        match self {
            Source::Google => "google",
            Source::Facebook => "facebook",
            Source::Twitter => "twitter",
            Source::LinkedIn => "linkedin",
            Source::Instagram => "instagram",
            Source::TikTok => "tiktok",
            Source::Bing => "bing",
            Source::Newsletter => "newsletter",
            Source::ProductHunt => "producthunt",
            Source::GitHub => "github",
            Source::Reddit => "reddit",
            Source::Discord => "discord",
            Source::Referral => "referral",
            Source::Direct => "direct",
            Source::Custom(s) => s,
        }
    }
}

/// UTM parameters structure
#[derive(Debug, Clone, Default, PartialEq, Eq, Serialize, Deserialize)]
pub struct UtmParams {
    /// utm_source - the referrer (e.g., google, newsletter)
    pub utm_source: Option<String>,
    /// utm_medium - marketing medium (e.g., cpc, banner, email)
    pub utm_medium: Option<String>,
    /// utm_campaign - campaign name
    pub utm_campaign: Option<String>,
    /// utm_term - paid search keyword
    pub utm_term: Option<String>,
    /// utm_content - ad content to differentiate ads
    pub utm_content: Option<String>,
    /// Original referrer URL
    pub referrer: Option<String>,
    /// Detected platform (for click IDs)
    pub platform: Option<Source>,
    /// Original non-standard parameter name
    pub raw_param: Option<String>,
}

impl UtmParams {
    /// Create a new empty UtmParams
    pub fn new() -> Self {
        Self::default()
    }

    /// Check if any UTM parameters are present
    pub fn is_empty(&self) -> bool {
        self.utm_source.is_none()
            && self.utm_medium.is_none()
            && self.utm_campaign.is_none()
            && self.utm_term.is_none()
            && self.utm_content.is_none()
    }

    /// Convert to JSON string
    pub fn to_json(&self) -> alloc::string::String {
        serde_json::to_string(self).unwrap_or_default()
    }
}

#[cfg(feature = "std")]
impl core::fmt::Display for UtmParams {
    fn fmt(&self, f: &mut core::fmt::Formatter<'_>) -> core::fmt::Result {
        write!(f, "UtmParams {{ ")?;
        if let Some(ref source) = self.utm_source {
            write!(f, "utm_source: {}, ", source)?;
        }
        if let Some(ref medium) = self.utm_medium {
            write!(f, "utm_medium: {}, ", medium)?;
        }
        if let Some(ref campaign) = self.utm_campaign {
            write!(f, "utm_campaign: {}, ", campaign)?;
        }
        write!(f, "}}")
    }
}
