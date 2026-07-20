# TanStack Ship UTM Worker

> Cloudflare Workers template for UTM parameter tracking

## Features

- 🎯 Captures standard UTM parameters
- 📱 Platform click ID detection (gclid, fbclid, etc.)
- 💾 KV storage with 30-day expiry
- 🍪 Cookie persistence for client-side tracking
- ⚡ Edge-native performance

## Deploy

```bash
# Clone
git clone https://github.com/orgs/tanstackship
cd cloudflare-template/tanstackship-utm-worker

# Configure
wrangler secret put KV_ID

# Deploy
wrangler deploy
```

## Usage

```bash
# Your tracking URL
https://your-worker.workers.dev/?utm_source=google&utm_campaign=spring_sale

# Redirects to your site with UTM cookie set
```

## License

MIT © [Huifer](https://tanstackship.com/about)
