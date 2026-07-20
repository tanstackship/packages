# tanstack_utm_parse

> Fast UTM parameter parsing library for Ruby

[![RubyGems](https://img.shields.io/badge/RubyGems-tanstackship.com-red)](https://tanstackship.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌐 Links

- **Website**: [https://tanstackship.com](https://tanstackship.com)
- **Documentation**: [https://tanstackship.com/docs](https://tanstackship.com/docs)
- **RubyGems**: [https://rubygems.org/gems/tanstack_utm_parse](https://rubygems.org)
- **Issues**: [https://github.com/tanstackship/packages/issues](https://github.com/tanstackship/packages/issues)

## Installation

```bash
gem install tanstack_utm_parse
```

Or add to Gemfile:

```ruby
gem 'tanstack_utm_parse'
```

## Quick Start

```ruby
require 'tanstack_utm_parse'

params = TanstackUtmParse.parse("https://example.com?utm_source=google&utm_campaign=spring")
puts params[:source]    # google
puts params[:medium]    # cpc
puts params[:campaign]   # spring
```

## License

MIT © [Huifer](https://tanstackship.com/about)
