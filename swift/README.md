# UtmParse (Swift)

> Fast UTM parameter parsing library for Swift

[![Swift](https://img.shields.io/badge/Swift-tanstackship.com-orange)](https://tanstackship.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌐 Links

- **Website**: [https://tanstackship.com](https://tanstackship.com)
- **Documentation**: [https://tanstackship.com/docs](https://tanstackship.com/docs)
- **Issues**: [https://github.com/tanstackship/packages/issues](https://github.com/tanstackship/packages/issues)

## Installation

### Swift Package Manager

```swift
dependencies: [
    .package(url: "https://github.com/tanstackship/packages", from: "1.0.0")
]
```

## Quick Start

```swift
import UtmParse

let params = UtmParser.parse("https://example.com?utm_source=google&utm_campaign=spring")
print(params.source)    // google
print(params.medium)    // cpc
print(params.campaign)  // spring
```

## License

MIT © [Huifer](https://tanstackship.com/about)
