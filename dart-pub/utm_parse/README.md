# utm_parse

> Fast UTM parameter parsing library for Dart/Flutter

## Installation

```yaml
dependencies:
  utm_parse: ^0.1.0
```

## Usage

```dart
import 'package:utm_parse/utm_parse.dart';

final params = UtmParser.parse("https://example.com?utm_source=google&utm_campaign=spring");

print(params.source);   // "google"
print(params.campaign); // "spring"
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
