//! URL parsing for UTM parameters

use crate::error::UtmError;
use crate::params::{Source, UtmParams};
use crate::platform::source_from_click_id;

/// Maximum URL length to prevent DoS
const MAX_URL_LENGTH: usize = 8192;

/// Non-standard source parameters (in order of priority)
const NON_STANDARD_SOURCE_PARAMS: &[&str] = &[
    "ref",
    "referrer",
    "refer",
    "source",
    "via",
    "from",
    "origin",
    "src",
    "channel",
    "aff",
    "affiliate",
    "partner",
];

/// Parse UTM parameters from a URL string
pub fn parse_utm_from_url(url: &str) -> Result<UtmParams, UtmError> {
    // Validate URL
    if url.is_empty() {
        return Err(UtmError::EmptyUrl);
    }
    if url.len() > MAX_URL_LENGTH {
        return Err(UtmError::UrlTooLong);
    }

    // Find query string
    let query = match url.find('?') {
        Some(idx) => &url[idx + 1..],
        None => return Ok(UtmParams::new()),
    };

    let mut params = UtmParams::new();

    // Parse query string
    for pair in query.split('&') {
        let (key, value) = match pair.find('=') {
            Some(idx) => (&pair[..idx], &pair[idx + 1..]),
            None => (pair, ""),
        };

        // Decode percent-encoding
        let decoded_value = decode_percent(value);
        let decoded_key = decode_percent(key);

        match decoded_key.as_str() {
            // Standard UTM parameters
            "utm_source" => params.utm_source = Some(decoded_value),
            "utm_medium" => params.utm_medium = Some(decoded_value),
            "utm_campaign" => params.utm_campaign = Some(decoded_value),
            "utm_term" => params.utm_term = Some(decoded_value),
            "utm_content" => params.utm_content = Some(decoded_value),
            // Check for platform click IDs
            _ => {
                if let Some(source) = source_from_click_id(&decoded_key) {
                    if params.utm_source.is_none() {
                        params.utm_source = Some(source.as_str().to_string());
                        params.platform = Some(source);
                    }
                }
            }
        }
    }

    // If no standard UTM source, try non-standard parameters
    if params.utm_source.is_none() {
        for (key, value) in url.query_pairs() {
            let key_str = key.to_string();
            let value_str = value.to_string();

            // Check non-standard source params
            for &non_std in NON_STANDARD_SOURCE_PARAMS {
                if key_str == non_std && !value_str.is_empty() {
                    params.utm_source = Some(value_str.clone());
                    params.raw_param = Some(key_str);
                    return Ok(params);
                }
            }
        }
    }

    Ok(params)
}

/// Simple percent decoding
fn decode_percent(s: &str) -> String {
    let mut result = String::with_capacity(s.len());
    let mut chars = s.chars().peekable();

    while let Some(c) = chars.next() {
        if c == '%' {
            let hex: String = chars.by_ref().take(2).collect();
            if hex.len() == 2 {
                if let Ok(byte) = u8::from_str_radix(&hex, 16) {
                    result.push(byte as char);
                    continue;
                }
            }
            // Invalid encoding, keep the original
            result.push('%');
            result.push_str(&hex);
        } else if c == '+' {
            // + is commonly used for space in query strings
            result.push(' ');
        } else {
            result.push(c);
        }
    }

    result
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_empty_url() {
        assert!(parse_utm_from_url("").is_err());
    }

    #[test]
    fn test_no_query() {
        let params = parse_utm_from_url("https://example.com").unwrap();
        assert!(params.is_empty());
    }

    #[test]
    fn test_decode_percent() {
        assert_eq!(decode_percent("hello%20world"), "hello world");
        assert_eq!(decode_percent("%C3%A9"), "é");
    }
}
