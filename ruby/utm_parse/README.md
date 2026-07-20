# utm_parse

> Fast UTM parameter parsing library for Ruby

## Installation

```bash
gem install utm_parse
```

Or add to Gemfile:

```ruby
gem 'utm_parse', '~> 0.1'
```

## Usage

```ruby
require 'utm_parse'

params = UtmParse.parse("https://example.com?utm_source=google&utm_campaign=spring")

puts params.source   # "google"
puts params.campaign # "spring"
puts params.to_h
# {:source=>"google", :campaign=>"spring"}
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
