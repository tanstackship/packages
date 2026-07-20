# @tanstackship/social

> Social sharing and embed utilities for SaaS apps.

## Features

- 🔗 **Share links** - Generate share links for Twitter, LinkedIn, Facebook, etc.
- 📱 **Web Share API** - Native sharing on mobile
- 📊 **OG tags** - Generate meta tags for social sharing
- 📝 **Share counts** - Track share counts (mock)

## Installation

```bash
npm install @tanstackship/social
```

## Quick Start

```typescript
import { getShareUrl, generateOgTags } from '@tanstackship/social'

// Twitter share
const twitterUrl = getShareUrl('twitter', {
  url: 'https://example.com',
  text: 'Check out this product!',
})

// Generate OG meta tags
const ogTags = generateOgTags({
  title: 'My SaaS Product',
  description: 'The best product ever',
  url: 'https://example.com',
  image: 'https://example.com/og.png',
})
```

## Supported Platforms

- Twitter / X
- LinkedIn
- Facebook
- Reddit
- Hacker News
- Copy to clipboard

## License

MIT © [Huifer](https://tanstackship.com/about)
