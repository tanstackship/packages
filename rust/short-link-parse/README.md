# short-link-parse

> URL fingerprinting and short link deduplication library written in Rust.

[![Crates.io](https://img.shields.io/crates/v/short-link-parse)](https://crates.io/crates/short-link-parse)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🔗 **URL normalization** - consistent fingerprinting
- 🎯 **Deterministic** - same URL always produces same fingerprint
- 📊 **Deduplication support** - detect duplicate short links
- 🚀 **Fast** - O(n) parsing with FNV hash
- 🌐 **UTM support** - handles UTM parameters

## Installation

```toml
# Cargo.toml
[dependencies]
short-link-parse = "0.1"
```

## Quick Start

```rust
use short_link_parse::{build_fingerprint, generate_slug};

// Create fingerprint from URL
let url = "https://example.com/page?utm_source=google&fbclid=abc";
let fp = build_fingerprint(url)?;

println!("Normalized: {}", fp.normalized);
println!("Host: {}", fp.host);
println!("Hash: {}", fp.hash.unwrap());

// Generate random slug
let slug = generate_slug(6); // e.g., "abc123"
```

## Use Cases

### Short Link Deduplication

```rust
use short_link_parse::build_fingerprint;

// Same destination, different UTM order = same fingerprint
let url1 = "https://example.com?fbclid=a&gclid=b&ref=c";
let url2 = "https://example.com?ref=c&gclid=b&fbclid=a";

let fp1 = build_fingerprint(url1)?;
let fp2 = build_fingerprint(url2)?;

assert_eq!(fp1.hash, fp2.hash); // Same destination!
```

### Link Tracking

```rust
use short_link_parse::{build_fingerprint, UrlFingerprint};

fn track_link(url: &str) -> Result<UrlFingerprint, ShortLinkError> {
    let fp = build_fingerprint(url)?;
    
    // Store fp.hash in database
    // Later queries can match by hash
    
    Ok(fp)
}
```

## License

MIT © [Huifer](https://tanstackship.com/about)
