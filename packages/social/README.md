# @tanstackship/social

> Social sharing and embed utilities for SaaS apps.

[![npm](https://img.shields.io/badge/npm-tanstackship.com-red)](https://www.npmjs.com/org/tanstackship)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌐 Links

- **Website**: [https://tanstackship.com](https://tanstackship.com)
- **Documentation**: [https://tanstackship.com/docs/social](https://tanstackship.com/docs)
- **npm**: [https://www.npmjs.com/package/@tanstackship/social](https://www.npmjs.com/package/@tanstackship/social)
- **Issues**: [https://github.com/tanstackship/packages/issues](https://github.com/tanstackship/packages/issues)

## Features

- 🔗 Share links (Twitter, LinkedIn, Facebook, etc.)
- 📱 Web Share API
- 📊 OG tags generation
- 📝 Share counts

## Installation

```bash
npm install @tanstackship/social
```

## Quick Start

```typescript
import { getShareUrl, generateOgTags } from '@tanstackship/social'

const twitterUrl = getShareUrl('twitter', {
  url: 'https://example.com',
  text: 'Check out this product!',
})

const ogTags = generateOgTags({
  title: 'My SaaS Product',
  description: 'The best product ever',
  url: 'https://example.com',
})
```

## License

MIT © [Huifer](https://tanstackship.com/about)
