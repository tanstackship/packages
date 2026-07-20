# tanstack-utm-parse

> Fast UTM parameter parsing library for Python

[![PyPI](https://img.shields.io/badge/PyPI-tanstackship.com-blue)](https://tanstackship.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌐 Links

- **Website**: [https://tanstackship.com](https://tanstackship.com)
- **Documentation**: [https://tanstackship.com/docs](https://tanstackship.com/docs)
- **PyPI**: [https://pypi.org/project/tanstack-utm-parse](https://pypi.org)
- **Issues**: [https://github.com/tanstackship/packages/issues](https://github.com/tanstackship/packages/issues)

## Installation

```bash
pip install tanstack-utm-parse
```

## Quick Start

```python
from utm_parse import parse_utm_from_url

# Parse UTM from URL
params = parse_utm_from_url("https://example.com?utm_source=google&utm_campaign=spring")

print(params.source)    # google
print(params.medium)    # cpc
print(params.campaign)  # spring
```

## Features

- 🚀 Fast parsing
- 🔍 Auto-detect platform from click IDs (gclid, fbclid, etc.)
- 📦 Zero dependencies
- 🐍 Pure Python

## API

### `parse_utm_from_url(url)`

Parse UTM parameters from a URL string.

```python
params = parse_utm_from_url("https://example.com?utm_source=twitter&utm_medium=social")
```

### `normalize(params)`

Trim whitespace from parameters.

```python
from utm_parse import parse_utm_from_url, normalize

params = normalize(parse_utm_from_url(url))
```

## License

MIT © [Huifer](https://tanstackship.com/about)
