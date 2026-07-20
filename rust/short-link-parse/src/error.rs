//! Error types

/// Error type
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum Error {
    /// Invalid URL
    InvalidUrl,
    /// Not a short link
    NotShortLink,
}

impl core::fmt::Display for Error {
    fn fmt(&self, f: &mut core::fmt::Formatter<'_>) -> core::fmt::Result {
        match self {
            Error::InvalidUrl => write!(f, "Invalid URL"),
            Error::NotShortLink => write!(f, "Not a recognized short link"),
        }
    }
}

pub type Result<T> = core::result::Result<T, Error>;
