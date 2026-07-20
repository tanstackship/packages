//! Error types

#[derive(Debug, Clone)]
pub enum Error {
    InvalidUrl,
    NotShortLink,
}

pub type Result<T> = std::result::Result<T, Error>;
