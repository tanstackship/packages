# TanStack Ship Cloudflare Worker - UTM Tracking

> Edge worker for UTM tracking on Cloudflare Workers.

[![Cloudflare](https://img.shields.io/badge/Cloudflare-tanstackship.com-orange)](https://tanstackship.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌐 Links

- **Website**: [https://tanstackship.com](https://tanstackship.com)
- **Documentation**: [https://tanstackship.com/docs/cloudflare](https://tanstackship.com/docs)
- **Issues**: [https://github.com/tanstackship/packages/issues](https://github.com/tanstackship/packages/issues)

## Installation

```bash
wrangler secret put KV_REST_API_TOKEN
wrangler deploy
```

## Quick Start

```typescript
// wrangler.toml
name = "tanstackship-utm-worker"
main = "src/index.ts"

[[kv_namespaces]]
binding = "UTM_KV"
id = "xxx"
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/track` | POST | Track event |
| `/api/utm/:code` | GET | Short link redirect |
| `/api/stats/:code` | GET | Link statistics |

## License

MIT © [Huifer](https://tanstackship.com/about)
