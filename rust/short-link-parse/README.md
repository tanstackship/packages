# tanstack_short_link_parse

> Parse short links and extract tracking information.

[![crates.io](https://img.shields.io/badge/crates.io-tanstackship.com-orange)](https://crates.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌐 Links

- **Website**: [https://tanstackship.com](https://tanstackship.com)
- **Documentation**: [https://tanstackship.com/docs/rust](https://tanstackship.com/docs)
- **crates.io**: [https://crates.io/crates/tanstack_short_link_parse](https://crates.io/crates/tanstack_short_link_parse)
- **Issues**: [https://github.com/tanstackship/packages/issues](https://github.com/tanstackship/packages/issues)

## Installation

```toml
[dependencies]
tanstack_short_link_parse = "1.0"
```

## Quick Start

```rust
use tanstack_short_link_parse::{ShortLinkInfo, parse_short_link};

let info = parse_short_link("https://t.co/abc123");
println!("Destination: {}", info.destination);
```

## License

MIT © [Huifer](https://tanstackship.com/about)
