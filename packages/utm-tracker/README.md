# @tanstackship/utm-tracker

> UTM tracking & attribution system for web apps. Capture, store, and resolve UTM parameters with first-touch and last-touch support.

[![npm version](https://badge.fury.io/js/@tanstackship%2Futm-tracker.svg)](https://badge.fury.io/js/@tanstackship%2Futm-tracker)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🎯 **First-touch tracking** — Capture UTM params on first visit and persist in cookie
- 🔄 **Last-touch resolution** — Override with checkout/form submission data
- 🌍 **Non-standard param mapping** — Automatically maps `ref`, `source`, `via` → `utm_source`
- 📱 **Platform click ID detection** — Detects `gclid`, `fbclid`, `ttclid`, etc.
- ⚡ **Edge-ready** — Works in Cloudflare Workers, Node.js, Bun, Deno
- 🔒 **Type-safe** — Full TypeScript support with strict types

## Installation

```bash
npm install @tanstackship/utm-tracker
# or
pnpm add @tanstackship/utm-tracker
# or
yarn add @tanstackship/utm-tracker
```

## Quick Start

### Client-side (React/Vue/Svelte)

```typescript
import { 
  captureUtmFromUrl, 
  writeUtmCookie, 
  readUtmCookie 
} from '@tanstackship/utm-tracker'

// On page load
function App() {
  useEffect(() => {
    const utm = captureUtmFromUrl()
    if (utm) {
      writeUtmCookie(utm)
      console.log('UTM captured:', utm)
    }
  }, [])
  
  // ...
}

// Read UTM data anywhere
const utm = readUtmCookie()
if (utm?.utm_source === 'google') {
  // User came from Google
}
```

### Server-side (Cloudflare Workers)

```typescript
import { 
  parseUtmCookieFromHeader,
  resolveCheckoutUtmAttribution,
  toStripeUtmMetadata 
} from '@tanstackship/utm-tracker'

export default {
  async fetch(request: Request) {
    const cookieHeader = request.headers.get('Cookie')
    
    // Parse from cookie
    const utm = parseUtmCookieFromHeader(cookieHeader)
    
    // Or resolve with last-touch priority
    const body = await request.json()
    const resolvedUtm = resolveCheckoutUtmAttribution({
      body: body.utm,
      cookieHeader,
    })
    
    // Convert to Stripe metadata
    const stripeMetadata = toStripeUtmMetadata(resolvedUtm)
    
    return Response.json({ success: true })
  }
}
```

## API Reference

### Client Functions

| Function | Description |
|----------|-------------|
| `captureUtmFromUrl()` | Parse UTM params from current URL |
| `readUtmCookie()` | Read stored UTM data from cookie |
| `writeUtmCookie(data)` | Write UTM data to cookie (first-touch only) |
| `clearUtmCookie()` | Clear UTM cookie |

### Server Functions

| Function | Description |
|----------|-------------|
| `normalizeUtmAttribution(input)` | Trim whitespace and validate UTM data |
| `parseUtmCookieFromHeader(header)` | Parse cookie string to UTM object |
| `resolveCheckoutUtmAttribution(input)` | Get last-touch attribution (body > cookie) |
| `toStripeUtmMetadata(utm)` | Convert to Stripe metadata format |
| `fromStripeMetadata(metadata)` | Extract UTM from Stripe metadata |
| `utmAttributionToDbColumns(utm)` | Convert to database column format |

## Non-Standard Parameter Mapping

The library automatically maps common non-standard source parameters to `utm_source`:

| Non-standard | Maps to |
|--------------|---------|
| `ref` | `utm_source` |
| `source` | `utm_source` |
| `via` | `utm_source` |
| `from` | `utm_source` |
| `ref` | `utm_source` |
| `aff` | `utm_source` |
| `partner` | `utm_source` |

## Platform Click ID Detection

Automatically detects and maps platform-specific click IDs:

| Platform | Click ID | Maps to |
|----------|----------|---------|
| Google Ads | `gclid` | `utm_source: 'google'` |
| Facebook | `fbclid` | `utm_source: 'facebook'` |
| Bing | `msclkid` | `utm_source: 'bing'` |
| TikTok | `ttclid` | `utm_source: 'tiktok'` |
| LinkedIn | `li_fat_id` | `utm_source: 'linkedin'` |

## TypeScript

```typescript
import type { UtmData, UtmAttributionParams } from '@tanstackship/utm-tracker'

const utm: UtmData = {
  utm_source: 'google',
  utm_medium: 'cpc',
  utm_campaign: 'spring_sale',
  referrer: 'https://google.com',
  first_visit_at: new Date().toISOString(),
}
```

## License

MIT © [Huifer](https://tanstackship.com/about)
