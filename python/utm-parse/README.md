# utm-parse

> Fast UTM parameter parsing and normalization library for Python.

[![PyPI version](https://badge.fury.io/py/utm-parse.svg)](https://badge.fury.io/py/utm-parse)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🚀 **Fast** - Zero dependencies, pure Python
- 🔄 **Auto-mapping** - Non-standard params → utm_source
- 📱 **Platform detection** - gclid, fbclid, ttclid, etc.
- 🎯 **Type-safe** - Full type hints

## Installation

```bash
pip install utm-parse
```

## Quick Start

```python
from utm_parse import parse_utm_from_url, normalize

# Parse UTM from URL
params = parse_utm_from_url(
    "https://example.com?utm_source=google&utm_campaign=spring_sale"
)

print(params.utm_source)   # 'google'
print(params.utm_campaign) # 'spring_sale'
```

## Platform Click ID Detection

Automatically detects platform from click IDs:

| Platform | Click ID | Maps to |
|----------|----------|---------|
| Google | `gclid` | `utm_source: 'google'` |
| Facebook | `fbclid` | `utm_source: 'facebook'` |
| Bing | `msclkid` | `utm_source: 'bing'` |
| TikTok | `ttclid` | `utm_source: 'tiktok'` |
| LinkedIn | `li_fat_id` | `utm_source: 'linkedin'` |

## Non-Standard Parameter Mapping

Maps common params to utm_source:

```python
# ref=producthunt
params = parse_utm_from_url("https://example.com?ref=producthunt")
# params.utm_source = 'producthunt'
# params.raw_param = 'ref'
```

## License

MIT © [Huifer](https://tanstackship.com/about)
