//! UTM Parameters

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
    pub source: Option<Source>,
    pub medium: Option<String>,
    pub campaign: Option<String>,
    pub term: Option<String>,
    pub content: Option<String>,
}

impl UtmParams {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn has_utm(&self) -> bool {
        self.source.is_some()
            || self.medium.is_some()
            || self.campaign.is_some()
    }

    pub fn source_str(&self) -> &str {
        match &self.source {
            Some(s) => s.as_str(),
            None => "",
        }
    }
}
