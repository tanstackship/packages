# @tanstackship/utm-tracker

> Capture, store, and retrieve UTM parameters for analytics attribution.

[![npm](https://img.shields.io/badge/npm-tanstackship.com-red)](https://www.npmjs.com/org/tanstackship)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌐 Links

- **Website**: [https://tanstackship.com](https://tanstackship.com)
- **Documentation**: [https://tanstackship.com/docs/utm-tracker](https://tanstackship.com/docs)
- **npm**: [https://www.npmjs.com/package/@tanstackship/utm-tracker](https://www.npmjs.com/package/@tanstackship/utm-tracker)
- **Issues**: [https://github.com/tanstackship/packages/issues](https://github.com/tanstackship/packages/issues)

## Features

- 🔍 Capture UTM parameters from URLs
- 🍪 Store in cookies with automatic expiry
- 🔄 Persist across page navigation
- 📊 Integrate with analytics providers
- ⚡ Lightweight, no dependencies

## Installation

```bash
npm install @tanstackship/utm-tracker
```

## Quick Start

```typescript
import { captureUtmFromUrl, writeUtmCookie, readUtmCookie } from '@tanstackship/utm-tracker'

// Client-side: Capture UTM from URL
useEffect(() => {
  const utm = captureUtmFromUrl()
  if (utm) {
    writeUtmCookie(utm)
  }
}, [])

// Read stored UTM
const utm = readUtmCookie()
console.log(utm.source, utm.medium, utm.campaign)
```

## API

### `captureUtmFromUrl()`
Capture UTM parameters from current URL.

### `writeUtmCookie(utm)`
Store UTM in cookie.

### `readUtmCookie()`
Read stored UTM from cookie.

## License

MIT © [Huifer](https://tanstackship.com/about)
