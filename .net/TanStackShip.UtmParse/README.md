# TanStackShip.UtmParse (.NET)

> UTM parameter parsing for .NET.

[![NuGet](https://img.shields.io/badge/NuGet-tanstackship.com-blue)](https://nuget.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌐 Links

- **Website**: [https://tanstackship.com](https://tanstackship.com)
- **Documentation**: [https://tanstackship.com/docs/dotnet](https://tanstackship.com/docs)
- **NuGet**: [https://nuget.org/packages/TanStackShip.UtmParse](https://nuget.org)
- **Issues**: [https://github.com/tanstackship/packages/issues](https://github.com/tanstackship/packages/issues)

## Installation

```bash
dotnet add package TanStackShip.UtmParse
```

## Quick Start

```csharp
using TanStackShip.Utm;

var params = UtmParser.Parse("https://example.com?utm_source=google");
Console.WriteLine(params.Source); // google
```

## License

MIT © [Huifer](https://tanstackship.com/about)
