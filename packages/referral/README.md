# @tanstackship/referral

> Referral system for SaaS apps. Create referral links, track referrals, and manage rewards.

[![npm](https://img.shields.io/badge/npm-tanstackship.com-red)](https://www.npmjs.com/org/tanstackship)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌐 Links

- **Website**: [https://tanstackship.com](https://tanstackship.com)
- **Documentation**: [https://tanstackship.com/docs/referral](https://tanstackship.com/docs)
- **npm**: [https://www.npmjs.com/package/@tanstackship/referral](https://www.npmjs.com/package/@tanstackship/referral)
- **Issues**: [https://github.com/tanstackship/packages/issues](https://github.com/tanstackship/packages/issues)

## Features

- 🔗 Referral link generation
- 👥 Referral tracking
- 🎁 Reward management
- 📊 Analytics
- 🏆 Leaderboards
- 💳 Credits integration

## Installation

```bash
npm install @tanstackship/referral
```

## Quick Start

```typescript
import { createReferralSystem } from '@tanstackship/referral'

const referral = createReferralSystem({
  referrerReward: { type: 'credit', amount: 1000 },
})

const link = await referral.createReferralLink({
  userId: 'user_123',
  userEmail: 'user@example.com',
})
```

## License

MIT © [Huifer](https://tanstackship.com/about)
