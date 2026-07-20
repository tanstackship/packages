//! UTM Parameters

use crate::alloc::{format, string::String, vec::Vec};

/// Traffic source
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum Source {
    Google,
    Facebook,
    Twitter,
    LinkedIn,
    Bing,
    TikTok,
    Reddit,
    Github,
    Direct,
    Unknown(String),
}

impl Source {
    pub fn as_str(&self) -> &str {
        match self {
            Source::Google => "google",
            Source::Facebook => "facebook",
            Source::Twitter => "twitter",
            Source::LinkedIn => "linkedin",
            Source::Bing => "bing",
            Source::TikTok => "tiktok",
            Source::Reddit => "reddit",
            Source::Github => "github",
            Source::Direct => "direct",
            Source::Unknown(s) => s,
        }
    }
}

/// UTM Parameters
#[derive(Debug, Clone, Default)]
pub struct UtmParams {
    /// Traffic source (utm_source)
    pub source: Option<Source>,
    /// Traffic medium (utm_medium)
    pub medium: Option<String>,
    /// Campaign name (utm_campaign)
    pub campaign: Option<String>,
    /// Campaign term (utm_term)
    pub term: Option<String>,
    /// Campaign content (utm_content)
    pub content: Option<String>,
    /// Original click ID parameter
    pub click_id: Option<(String, String)>,
    /// All query parameters
    pub raw_params: Vec<(String, String)>,
}

impl UtmParams {
    /// Create new empty params
    pub fn new() -> Self {
        Self::default()
    }

    /// Check if any UTM parameters are present
    pub fn has_utm(&self) -> bool {
        self.source.is_some()
            || self.medium.is_some()
            || self.campaign.is_some()
            || self.term.is_some()
            || self.content.is_some()
    }

    /// Get source as string
    pub fn source_str(&self) -> &str {
        match &self.source {
            Some(s) => s.as_str(),
            None => "",
        }
    }

    /// Format as string for storage/transmission
    pub fn to_string(&self) -> String {
        let mut parts = Vec::new();
        if let Some(ref s) = self.source {
            parts.push(format!("source={}", s.as_str()));
        }
        if let Some(ref m) = self.medium {
            parts.push(format!("medium={}", m));
        }
        if let Some(ref c) = self.campaign {
            parts.push(format!("campaign={}", c));
        }
        if let Some(ref t) = self.term {
            parts.push(format!("term={}", t));
        }
        if let Some(ref c) = self.content {
            parts.push(format!("content={}", c));
        }
        parts.join("|")
    }
}
