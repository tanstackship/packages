# tanstack-utm-parse

> UTM parameter parsing for Python.

[![PyPI](https://img.shields.io/badge/PyPI-tanstackship.com-blue)](https://pypi.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌐 Links

- **Website**: [https://tanstackship.com](https://tanstackship.com)
- **Documentation**: [https://tanstackship.com/docs/python](https://tanstackship.com/docs)
- **PyPI**: [https://pypi.org/project/tanstack-utm-parse](https://pypi.org/project/tanstack-utm-parse)
- **Issues**: [https://github.com/tanstackship/packages/issues](https://github.com/tanstackship/packages/issues)

## Installation

```bash
pip install tanstack-utm-parse
```

## Quick Start

```python
from tanstack_utm_parse import parse_url

params = parse_url("https://example.com?utm_source=google&utm_campaign=spring")
print(params.source)  # google
print(params.medium)  # cpc
```

## Features

- 🐍 Pure Python
- ⚡ Fast
- 🔍 Platform auto-detection

## License

MIT © [Huifer](https://tanstackship.com/about)
