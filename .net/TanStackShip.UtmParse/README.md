# TanStackShip.UtmParse

> Fast UTM parameter parsing library for .NET

## Installation

```bash
dotnet add package TanStackShip.UtmParse
```

## Usage

```csharp
using TanStackShip.UtmParse;

var params = UtmParser.Parse("https://example.com?utm_source=google&utm_campaign=spring");

Console.WriteLine(params.Source);   // "google"
Console.WriteLine(params.Campaign); // "spring"
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

## License

MIT © [Huifer](https://tanstackship.com/about)
