# UtmParse

> Fast UTM parameter parsing library for Swift

## Installation

### Swift Package Manager

```swift
dependencies: [
    .package(url: "https://github.com/orgs/tanstackship", from: "0.1.0")
]
```

## Usage

```swift
import UtmParse

let params = UtmParser.parse("https://example.com?utm_source=google&utm_campaign=spring")

print(params.source)   // "google"
print(params.campaign) // "spring"
```

## Platform Click ID Detection

Automatically detects:

| Platform | Click ID |
|----------|----------|
| Google | `gclid` |
| Facebook | `fbclid` |
| Bing | `msclkid` |
| TikTok | `ttclid` |
| LinkedIn | `li_fat_id` |

## License

MIT © [Huifer](https://tanstackship.com/about)
