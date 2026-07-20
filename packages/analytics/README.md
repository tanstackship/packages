# @tanstackship/analytics

> Multi-provider analytics SDK with consent management, batching, andGDPR compliance.

[![npm](https://img.shields.io/badge/npm-tanstackship.com-red)](https://www.npmjs.com/org/tanstackship)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌐 Links

- **Website**: [https://tanstackship.com](https://tanstackship.com)
- **Documentation**: [https://tanstackship.com/docs/analytics](https://tanstackship.com/docs)
- **npm**: [https://www.npmjs.com/package/@tanstackship/analytics](https://www.npmjs.com/package/@tanstackship/analytics)
- **Issues**: [https://github.com/tanstackship/packages/issues](https://github.com/tanstackship/packages/issues)

## Features

- 📊 Multi-provider support (PostHog, GA4, custom)
- 🔒 GDPR-compliant consent management
- 📦 Automatic event batching
- 🕐 Session tracking
- 📱 Mobile-friendly

## Installation

```bash
npm install @tanstackship/analytics
```

## Quick Start

```typescript
import { createAnalytics } from '@tanstackship/analytics'

const analytics = createAnalytics({
  providers: [new PostHogProvider({ apiKey: 'xxx' })],
  consent: consentGiven,
})

// Track events
analytics.track('page_view', { url: '/pricing' })
analytics.track('signup', { method: 'google' })
```

## License

MIT © [Huifer](https://tanstackship.com/about)
