//! TanStack Ship UTM Parse

mod error;
mod params;
mod parser;
mod platform;

pub use error::{Error, Result};
pub use params::{Source, UtmParams};

pub fn parse_url(url: &str) -> UtmParams {
    parser::parse_url(url)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_basic_utm() {
        let params = parse_url("https://example.com?utm_source=google&utm_campaign=spring");
        assert_eq!(params.source_str(), "google");
    }
}
