//! URL Parser

use crate::params::{Source, UtmParams};
use crate::platform::PLATFORM_CLICK_IDS;

pub fn parse_url(url: &str) -> UtmParams {
    let mut params = UtmParams::new();

    if let Some(query_start) = url.find('?') {
        let query = &url[query_start + 1..];
        parse_query_string(query, &mut params);
    }

    params
}

fn parse_query_string(query: &str, params: &mut UtmParams) {
    for pair in query.split('&') {
        let (key, value) = if let Some(eq) = pair.find('=') {
            let k = &pair[..eq];
            let v = &pair[eq + 1..];
            (k, decode_percent(v))
        } else {
            (pair, pair.to_string())
        };

        match key {
            "utm_source" => {
                params.source = Some(detect_source(&value));
            }
            "utm_medium" => {
                params.medium = Some(value);
            }
            "utm_campaign" => {
                params.campaign = Some(value);
            }
            "utm_term" => {
                params.term = Some(value);
            }
            "utm_content" => {
                params.content = Some(value);
            }
            _ => {
                for (id, platform) in PLATFORM_CLICK_IDS {
                    if key == *id && params.source.is_none() {
                        params.source = Some(detect_platform(platform));
                        break;
                    }
                }
            }
        }
    }
}

fn detect_source(value: &str) -> Source {
    match value.to_lowercase().as_str() {
        "google" | "g" => Source::Google,
        "facebook" | "fb" => Source::Facebook,
        "twitter" | "tw" => Source::Twitter,
        "linkedin" | "li" => Source::LinkedIn,
        "bing" | "ms" => Source::Bing,
        "tiktok" | "tt" => Source::TikTok,
        "reddit" | "rd" => Source::Reddit,
        "github" | "gh" => Source::Github,
        "direct" | "" | "none" => Source::Direct,
        other => Source::Unknown(other.to_string()),
    }
}

fn detect_platform(platform: &str) -> Source {
    match platform {
        "google" => Source::Google,
        "facebook" => Source::Facebook,
        "twitter" => Source::Twitter,
        "linkedin" => Source::LinkedIn,
        "bing" => Source::Bing,
        "tiktok" => Source::TikTok,
        _ => Source::Unknown(platform.to_string()),
    }
}

fn decode_percent(s: &str) -> String {
    let mut result = String::new();
    let mut chars = s.chars().peekable();

    while let Some(c) = chars.next() {
        if c == '%' {
            let hex: String = chars.by_ref().take(2).collect();
            if let Ok(byte) = u8::from_str_radix(&hex, 16) {
                result.push(byte as char);
            } else {
                result.push('%');
                result.push_str(&hex);
            }
        } else if c == '+' {
            result.push(' ');
        } else {
            result.push(c);
        }
    }

    result
}
