# UtmParse (CocoaPods)

> Fast UTM parameter parsing library for iOS/macOS

[![CocoaPods](https://img.shields.io/badge/CocoaPods-tanstackship.com-blue)](https://tanstackship.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌐 Links

- **Website**: [https://tanstackship.com](https://tanstackship.com)
- **Documentation**: [https://tanstackship.com/docs](https://tanstackship.com/docs)
- **Issues**: [https://github.com/tanstackship/packages/issues](https://github.com/tanstackship/packages/issues)

## Installation

### CocoaPods

```ruby
pod 'UtmParse', :git => 'https://github.com/tanstackship/packages', :branch => 'main'
```

## Quick Start

```swift
import UtmParse

let params = UtmParser.parse("https://example.com?utm_source=google&utm_campaign=spring")
print(params.source)    // google
```

## License

MIT © [Huifer](https://tanstackship.com/about)
