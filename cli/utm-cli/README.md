# @tanstackship/utm-cli

> UTM parsing CLI tool. Parse, validate, and analyze UTM parameters from URLs.

[![npm](https://img.shields.io/badge/npm-tanstackship.com-red)](https://www.npmjs.com/org/tanstackship)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌐 Links

- **Website**: [https://tanstackship.com](https://tanstackship.com)
- **Documentation**: [https://tanstackship.com/docs/cli](https://tanstackship.com/docs)
- **npm**: [https://www.npmjs.com/package/@tanstackship/utm-cli](https://www.npmjs.com/package/@tanstackship/utm-cli)
- **Issues**: [https://github.com/tanstackship/packages/issues](https://github.com/tanstackship/packages/issues)

## Installation

```bash
# npm
npm install -g @tanstackship/utm-cli

# Homebrew
brew install tanstackship/tap/utm-cli
```

## Usage

```bash
utm "https://example.com?utm_source=google&utm_campaign=spring"
utm "https://example.com?fbclid=abc123" --format=json
utm "https://example.com" -f csv
```

## Options

| Option | Description |
|--------|-------------|
| `--format, -f` | Output format: `table`, `json`, `csv`, `env` |
| `--source-only, -s` | Output only the source value |

## License

MIT © [Huifer](https://tanstackship.com/about)
