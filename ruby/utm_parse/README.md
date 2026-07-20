# tanstack_utm_parse (Ruby)

> UTM parameter parsing for Ruby.

[![RubyGems](https://img.shields.io/badge/RubyGems-tanstackship.com-red)](https://rubygems.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌐 Links

- **Website**: [https://tanstackship.com](https://tanstackship.com)
- **Documentation**: [https://tanstackship.com/docs/ruby](https://tanstackship.com/docs)
- **RubyGems**: [https://rubygems.org/gems/tanstack_utm_parse](https://rubygems.org)
- **Issues**: [https://github.com/tanstackship/packages/issues](https://github.com/tanstackship/packages/issues)

## Installation

```bash
gem install tanstack_utm_parse
```

## Quick Start

```ruby
require 'tanstack_utm_parse'

params = TanstackUtmParse.parse_url("https://example.com?utm_source=google")
puts params[:source] # google
```

## License

MIT © [Huifer](https://tanstackship.com/about)
