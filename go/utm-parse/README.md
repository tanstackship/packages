# utm-parse (Go)

> Fast UTM parameter parsing library for Go

[![Go](https://img.shields.io/badge/Go-tanstackship.com-blue)](https://tanstackship.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌐 Links

- **Website**: [https://tanstackship.com](https://tanstackship.com)
- **Documentation**: [https://tanstackship.com/docs](https://tanstackship.com/docs)
- **pkg.go.dev**: [https://pkg.go.dev/github.com/tanstackship/packages/go/utm-parse](https://pkg.go.dev)
- **Issues**: [https://github.com/tanstackship/packages/issues](https://github.com/tanstackship/packages/issues)

## Installation

```bash
go get github.com/tanstackship/packages/go/utm-parse
```

## Quick Start

```go
package main

import (
    "fmt"
    utm "github.com/tanstackship/packages/go/utm-parse"
)

func main() {
    params, _ := utm.Parse("https://example.com?utm_source=google&utm_campaign=spring")
    fmt.Printf("Source: %s\n", params.Source)
    fmt.Printf("Campaign: %s\n", params.Campaign)
}
```

## Features

- 🚀 Fast parsing
- 🔍 Auto-detect platform from click IDs
- 📦 Zero dependencies
- 🎯 Type-safe

## License

MIT © [Huifer](https://tanstackship.com/about)
