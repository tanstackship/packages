# utm-cli

> CLI tool for parsing UTM parameters from URLs

## Installation

```bash
# Using Homebrew
brew install tanstackship/tap/utm-cli

# Download binary
curl -fsSL https://github.com/tanstackship/homebrew-tap/releases/latest/download/utm-cli-darwin-arm64 -o /usr/local/bin/utm
chmod +x /usr/local/bin/utm
```

## Usage

```bash
utm "https://example.com?utm_source=google&utm_campaign=spring"
```

Output:
```
UTM Parameters:
  Source:   google
  Medium:   
  Campaign: spring
  Term:     
  Content:  
```

## License

MIT © [Huifer](https://tanstackship.com/about)
