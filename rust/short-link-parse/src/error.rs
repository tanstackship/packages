//! Error types

use core::fmt;

/// Errors that can occur during short link parsing
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum ShortLinkError {
    /// URL is empty
    EmptyUrl,
    /// URL is invalid
    InvalidUrl,
    /// URL exceeds maximum length
    UrlTooLong,
    /// Invalid slug
    InvalidSlug,
    /// URL scheme not supported
    UnsupportedScheme,
}

impl fmt::Display for ShortLinkError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            ShortLinkError::EmptyUrl => write!(f, "URL is empty"),
            ShortLinkError::InvalidUrl => write!(f, "URL is invalid"),
            ShortLinkError::UrlTooLong => write!(f, "URL exceeds maximum length"),
            ShortLinkError::InvalidSlug => write!(f, "invalid slug"),
            ShortLinkError::UnsupportedScheme => write!(f, "unsupported URL scheme"),
        }
    }
}

#[cfg(feature = "std")]
impl std::error::Error for ShortLinkError {}
