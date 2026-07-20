//! Error types

#[derive(Debug, Clone)]
pub enum Error {
    InvalidUrl,
    ParseError,
}

pub type Result<T> = std::result::Result<T, Error>;
