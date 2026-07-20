# go-utm-parse

> Fast UTM parameter parsing library for Go.

[![Go Reference](https://pkg.go.dev/badge/github.com/tanstackship/go-utm-parse.svg)](https://pkg.go.dev/github.com/tanstackship/go-utm-parse)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🚀 **Fast** - Zero dependencies
- 🔄 **Auto-mapping** - Non-standard params → utm_source
- 📱 **Platform detection** - gclid, fbclid, ttclid, etc.
- 🎯 **Simple API** - Just call `utm.Parse(url)`

## Installation

```bash
go get github.com/tanstackship/go-utm-parse
```

## Quick Start

```go
package main

import (
	"fmt"
	"github.com/tanstackship/go-utm-parse"
)

func main() {
	params, _ := utm.Parse("https://example.com?utm_source=google&utm_campaign=spring")
	
	fmt.Println(params.Source)   // "google"
	fmt.Println(params.Campaign) // "spring"
}
```

## Platform Click ID Detection

| Platform | Click ID | Maps to |
|----------|----------|---------|
| Google | `gclid` | `Source: "google"` |
| Facebook | `fbclid` | `Source: "facebook"` |
| Bing | `msclkid` | `Source: "bing"` |
| TikTok | `ttclid` | `Source: "tiktok"` |

## License

MIT © [Huifer](https://tanstackship.com/about)
