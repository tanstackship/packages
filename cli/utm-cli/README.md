# @tanstackship/utm-cli

> UTM parsing CLI tool. Parse, validate, and analyze UTM parameters from URLs.

## Installation

```bash
# npm
npm install -g @tanstackship/utm-cli

# pnpm
pnpm add -g @tanstackship/utm-cli

# Homebrew
brew install tanstackship/tap/utm-cli
```

## Usage

```bash
# Parse UTM from URL
utm "https://example.com?utm_source=google&utm_campaign=spring"

# JSON output
utm "https://example.com?utm_source=twitter" --format=json

# CSV output
utm "https://example.com?utm_source=facebook" -f csv

# Environment variables
utm "https://example.com?utm_source=newsletter&utm_medium=email" -f env

# Source only (useful in scripts)
utm "https://example.com?ref=producthunt" -s
```

## Options

| Option | Short | Description |
|--------|-------|-------------|
| `--format` | `-f` | Output format: `table`, `json`, `csv`, `env` |
| `--source-only` | `-s` | Output only the source value |
| `--help` | `-h` | Show help |
| `--version` | `-v` | Show version |

## Examples

### Parse from click ID

```bash
utm "https://example.com?fbclid=abc123"
# Output:
# 📊 UTM Parameters:
#   Source:   facebook
#   Platform: facebook
```

### Parse from non-standard param

```bash
utm "https://example.com?ref=producthunt"
# Output:
# 📊 UTM Parameters:
#   Source:   producthunt
#   (from ref)
```

### Use in scripts

```bash
#!/bin/bash
SOURCE=$(utm "$1" -s)
if [ "$SOURCE" = "google" ]; then
  echo "From Google!"
fi
```

## License

MIT © [Huifer](https://tanstackship.com/about)
