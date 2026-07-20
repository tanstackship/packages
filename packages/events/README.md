# @tanstackship/events

> Event tracking and webhooks system for SaaS apps.

[![npm](https://img.shields.io/badge/npm-tanstackship.com-red)](https://www.npmjs.com/org/tanstackship)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌐 Links

- **Website**: [https://tanstackship.com](https://tanstackship.com)
- **Documentation**: [https://tanstackship.com/docs/events](https://tanstackship.com/docs)
- **npm**: [https://www.npmjs.com/package/@tanstackship/events](https://www.npmjs.com/package/@tanstackship/events)
- **Issues**: [https://github.com/tanstackship/packages/issues](https://github.com/tanstackship/packages/issues)

## Features

- 📡 Event emission
- 🪝 Webhook delivery
- 🔄 Retry logic
- 📊 Event history
- 🔒 HMAC signatures

## Installation

```bash
npm install @tanstackship/events
```

## Quick Start

```typescript
import { createEventSystem } from '@tanstackship/events'

const events = createEventSystem()

await events.emit({
  type: 'user.signup',
  userId: 'user_123',
  properties: { plan: 'pro' },
})

events.on('user.signup', async (event) => {
  console.log(`New user: ${event.userId}`)
})
```

## License

MIT © [Huifer](https://tanstackship.com/about)
