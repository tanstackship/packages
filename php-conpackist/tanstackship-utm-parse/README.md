# tanstackship/utm-parse

> Fast UTM parameter parsing library for PHP

[![Packagist](https://img.shields.io/badge/Packagist-tanstackship.com-purple)](https://tanstackship.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌐 Links

- **Website**: [https://tanstackship.com](https://tanstackship.com)
- **Documentation**: [https://tanstackship.com/docs](https://tanstackship.com/docs)
- **Packagist**: [https://packagist.org/packages/tanstackship/utm-parse](https://packagist.org)
- **Issues**: [https://github.com/tanstackship/packages/issues](https://github.com/tanstackship/packages/issues)

## Installation

```bash
composer require tanstackship/utm-parse
```

## Quick Start

```php
<?php
require_once 'vendor/autoload.php';

use TanStackShip\UtmParse\UtmParser;

$parser = new UtmParser();
$params = $parser->parse("https://example.com?utm_source=google&utm_campaign=spring");

echo $params->source;    // google
echo $params->medium;     // cpc
echo $params->campaign;   // spring
```

## License

MIT © [Huifer](https://tanstackship.com/about)
