# tanstack_utm_parse

> High-performance UTM parameter parsing for Rust.

[![crates.io](https://img.shields.io/badge/crates.io-tanstackship.com-orange)](https://crates.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌐 Links

- **Website**: [https://tanstackship.com](https://tanstackship.com)
- **Documentation**: [https://tanstackship.com/docs/rust](https://tanstackship.com/docs)
- **crates.io**: [https://crates.io/crates/tanstack_utm_parse](https://crates.io/crates/tanstack_utm_parse)
- **Issues**: [https://github.com/tanstackship/packages/issues](https://github.com/tanstackship/packages/issues)

## Installation

```toml
[dependencies]
tanstack_utm_parse = "1.0"
```

## Quick Start

```rust
use tanstack_utm_parse::{UtmParams, parse_url};

let params = parse_url("https://example.com?utm_source=google&utm_campaign=spring");
assert_eq!(params.source, Some("google".to_string()));
```

## Features

- 🚀 Zero-copy parsing
- 📦 No_std support
- 🔍 Platform auto-detection
- ⚡ Fast

## License

MIT © [Huifer](https://tanstackship.com/about)
