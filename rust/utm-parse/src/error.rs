//! Error types

use crate::alloc::string::String;

/// Error type
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum Error {
    /// Invalid URL
    InvalidUrl(String),
    /// Parse error
    ParseError(String),
}

impl Error {
    pub fn invalid_url(s: &str) -> Self {
        Error::InvalidUrl(s.to_string())
    }

    pub fn parse_error(s: &str) -> Self {
        Error::ParseError(s.to_string())
    }
}

impl core::fmt::Display for Error {
    fn fmt(&self, f: &mut core::fmt::Formatter<'_>) -> core::fmt::Result {
        match self {
            Error::InvalidUrl(s) => write!(f, "Invalid URL: {}", s),
            Error::ParseError(s) => write!(f, "Parse error: {}", s),
        }
    }
}

pub type Result<T> = core::result::Result<T, Error>;
