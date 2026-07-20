//! Error types for UTM parsing

use core::fmt;

/// Errors that can occur during UTM parsing
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum UtmError {
    /// URL is empty
    EmptyUrl,
    /// URL is invalid
    InvalidUrl,
    /// URL contains invalid percent encoding
    InvalidEncoding,
    /// URL exceeds maximum length
    UrlTooLong,
}

impl fmt::Display for UtmError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            UtmError::EmptyUrl => write!(f, "URL is empty"),
            UtmError::InvalidUrl => write!(f, "URL is invalid"),
            UtmError::InvalidEncoding => write!(f, "URL contains invalid percent encoding"),
            UtmError::UrlTooLong => write!(f, "URL exceeds maximum length"),
        }
    }
}

#[cfg(feature = "std")]
impl std::error::Error for UtmError {}
