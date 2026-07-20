# tanstackship/utm-parse

> Fast UTM parameter parsing library for PHP

## Installation

```bash
composer require tanstackship/utm-parse
```

## Usage

```php
use TanStackShip\UtmParse\UtmParser;

$params = UtmParser::parse("https://example.com?utm_source=google&utm_campaign=spring");

echo $params->source;   // "google"
echo $params->campaign; // "spring"
print_r($params->toArray());
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

## Requirements

- PHP 8.0+

## License

MIT © [Huifer](https://tanstackship.com/about)
