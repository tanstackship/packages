# UtmParse (CocoaPods)

> UTM parameter parsing for iOS/macOS via CocoaPods.

[![CocoaPods](https://img.shields.io/badge/CocoaPods-tanstackship.com-blue)](https://tanstackship.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌐 Links

- **Website**: [https://tanstackship.com](https://tanstackship.com)
- **Documentation**: [https://tanstackship.com/docs/ios](https://tanstackship.com/docs)
- **CocoaPods**: [https://cocoapods.org/pods/UtmParse](https://cocoapods.org)
- **Issues**: [https://github.com/tanstackship/packages/issues](https://github.com/tanstackship/packages/issues)

## Installation

```ruby
pod 'UtmParse', :git => 'https://github.com/tanstackship/packages.git', :branch => 'main'
```

## Quick Start

```swift
import UtmParse

let params = UtmParser.parse("https://example.com?utm_source=google")
print(params.source) // google
```

## License

MIT © [Huifer](https://tanstackship.com/about)
