# utm_parse

> Fast UTM parameter parsing library for Dart and Flutter

[![pub.dev](https://img.shields.io/badge/pub.dev-tanstackship.com-blue)](https://tanstackship.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌐 Links

- **Website**: [https://tanstackship.com](https://tanstackship.com)
- **Documentation**: [https://tanstackship.com/docs](https://tanstackship.com/docs)
- **pub.dev**: [https://pub.dev/packages/utm_parse](https://pub.dev)
- **Issues**: [https://github.com/tanstackship/packages/issues](https://github.com/tanstackship/packages/issues)

## Installation

```yaml
dependencies:
  utm_parse: ^1.0.0
```

## Quick Start

```dart
import 'package:utm_parse/utm_parse.dart';

void main() {
  final params = parseUtmFromUrl("https://example.com?utm_source=google&utm_campaign=spring");
  
  print(params.source);    // google
  print(params.medium);    // cpc
  print(params.campaign);  // spring
}
```

## Features

- 🚀 Fast parsing
- 🔍 Auto-detect platform from click IDs
- 📦 Zero dependencies
- 🌐 Pure Dart

## License

MIT © [Huifer](https://tanstackship.com/about)
