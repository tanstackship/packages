# TanStack Ship Vercel Template

> Complete Vercel deployment for TanStack Ship SaaS apps.

[![Vercel](https://img.shields.io/badge/Vercel-tanstackship.com-black)](https://tanstackship.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌐 Links

- **Website**: [https://tanstackship.com](https://tanstackship.com)
- **Documentation**: [https://tanstackship.com/docs/vercel](https://tanstackship.com/docs)
- **Issues**: [https://github.com/tanstackship/packages/issues](https://github.com/tanstackship/packages/issues)

## Features

- ⚡ Edge Functions
- 📊 Analytics integration
- 🔗 Short Links API
- 🏷️ UTM Capture middleware
- 🚀 Edge Config

## Quick Start

```bash
# Clone template
npx create-vercel-app@latest --template tanstackship/vercel-template

# Deploy
vercel
```

## API Routes

```
/api/track      - Analytics tracking
/api/short-link - URL shortener
/api/utm/*      - UTM capture
```

## License

MIT © [Huifer](https://tanstackship.com/about)
