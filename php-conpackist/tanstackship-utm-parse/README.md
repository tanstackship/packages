# tanstackship/utm-parse (PHP)

> UTM parameter parsing for PHP.

[![Packagist](https://img.shields.io/badge/Packagist-tanstackship.com-purple)](https://packagist.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌐 Links

- **Website**: [https://tanstackship.com](https://tanstackship.com)
- **Documentation**: [https://tanstackship.com/docs/php](https://tanstackship.com/docs)
- **Packagist**: [https://packagist.org/packages/tanstackship/utm-parse](https://packagist.org)
- **Issues**: [https://github.com/tanstackship/packages/issues](https://github.com/tanstackship/packages/issues)

## Installation

```bash
composer require tanstackship/utm-parse
```

## Quick Start

```php
<?php
use TanstackShip\UtmParser;

$params = UtmParser::parse("https://example.com?utm_source=google");
echo $params->source; // google
```

## License

MIT © [Huifer](https://tanstackship.com/about)
