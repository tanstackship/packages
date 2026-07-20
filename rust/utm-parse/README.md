# utm-parse

> Fast UTM parameter parsing and normalization library written in Rust.

[![Crates.io](https://img.shields.io/crates/v/utm-parse)](https://crates.io/crates/utm-parse)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🚀 **Zero-copy parsing** when possible
- 📦 **No std dependencies** (`no_std` compatible)
- 🔄 **Automatic mapping** of non-standard source parameters
- 📱 **Platform click ID detection** (gclid, fbclid, ttclid, etc.)
- 🎯 **Type-safe** with `no_std` support
- 🌐 **WebAssembly ready** - works in browsers and edge runtimes

## Installation

```toml
# Cargo.toml
[dependencies]
utm-parse = "0.1"
```

## Quick Start

```rust
use utm_parse::{parse_utm_from_url, normalize};

// Parse UTM from URL
let url = "https://example.com?utm_source=google&utm_campaign=spring_sale";
let mut params = parse_utm_from_url(url).unwrap();

assert_eq!(params.utm_source, Some("google".to_string()));
assert_eq!(params.utm_campaign, Some("spring_sale".to_string()));

// Normalize whitespace
normalize(&mut params);
```

## Platform Click ID Detection

Automatically detects and maps platform-specific click IDs:

| Platform | Click ID | Maps to |
|----------|----------|---------|
| Google Ads | `gclid` | `utm_source: "google"` |
| Facebook | `fbclid` | `utm_source: "facebook"` |
| Bing Ads | `msclkid` | `utm_source: "bing"` |
| TikTok | `ttclid` | `utm_source: "tiktok"` |
| LinkedIn | `li_fat_id` | `utm_source: "linkedin"` |

## Non-Standard Parameter Mapping

Maps common non-standard source parameters to `utm_source`:

| Non-standard | Maps to |
|--------------|---------|
| `ref` | `utm_source` |
| `source` | `utm_source` |
| `via` | `utm_source` |
| `from` | `utm_source` |
| `aff` | `utm_source` |
| `partner` | `utm_source` |

## no_std Support

```toml
[dependencies]
utm-parse = { version = "0.1", default-features = false }
```

## WebAssembly

```bash
wasm-pack build --target web
```

```rust
use utm_parse::parse_utm_from_url;

// Works in browser via WASM
let params = parse_utm_from_url("https://example.com?utm_source=google")?;
```

## License

MIT © [Huifer](https://tanstackship.com/about)
