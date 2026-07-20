# @tanstackship/credits

> Credits/balance system for SaaS apps. Track user balance, transactions, and usage-based billing.

[![npm](https://img.shields.io/badge/npm-tanstackship.com-red)](https://www.npmjs.com/org/tanstackship)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌐 Links

- **Website**: [https://tanstackship.com](https://tanstackship.com)
- **Documentation**: [https://tanstackship.com/docs/credits](https://tanstackship.com/docs)
- **npm**: [https://www.npmjs.com/package/@tanstackship/credits](https://www.npmjs.com/package/@tanstackship/credits)
- **Issues**: [https://github.com/tanstackship/packages/issues](https://github.com/tanstackship/packages/issues)

## Features

- 💰 Balance tracking
- 📜 Transaction history
- 🎁 Grants & deductions
- ⏰ Expiry management
- 📊 Usage tracking
- 🔄 Auto-recharge

## Installation

```bash
npm install @tanstackship/credits
```

## Quick Start

```typescript
import { createCreditsSystem } from '@tanstackship/credits'

const credits = createCreditsSystem({ currency: 'USD' })

await credits.grant({
  userId: 'user_123',
  amount: 1000,
  reason: 'referral_reward',
})

const balance = await credits.getBalance({ userId: 'user_123' })
console.log(`Balance: $${balance.available / 100}`)
```

## License

MIT © [Huifer](https://tanstackship.com/about)
