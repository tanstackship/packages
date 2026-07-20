# utm_parse (Dart/Flutter)

> UTM parameter parsing for Dart and Flutter.

[![pub.dev](https://img.shields.io/badge/pub.dev-tanstackship.com-blue)](https://pub.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌐 Links

- **Website**: [https://tanstackship.com](https://tanstackship.com)
- **Documentation**: [https://tanstackship.com/docs/dart](https://tanstackship.com/docs)
- **pub.dev**: [https://pub.dev/packages/utm_parse](https://pub.dev/packages/utm_parse)
- **Issues**: [https://github.com/tanstackship/packages/issues](https://github.com/tanstackship/packages/issues)

## Installation

```yaml
dependencies:
  utm_parse: ^1.0.0
```

## Quick Start

```dart
import 'package:utm_parse/utm_parse.dart';

final params = parseUrl("https://example.com?utm_source=google");
print(params.source); // google
```

## License

MIT © [Huifer](https://tanstackship.com/about)
