# @tanstackship/coupons

> Coupon and discount code management for SaaS. Create, validate, and track coupon usage.

[![npm](https://img.shields.io/badge/npm-tanstackship.com-red)](https://www.npmjs.com/org/tanstackship)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌐 Links

- **Website**: [https://tanstackship.com](https://tanstackship.com)
- **Documentation**: [https://tanstackship.com/docs/coupons](https://tanstackship.com/docs)
- **npm**: [https://www.npmjs.com/package/@tanstackship/coupons](https://www.npmjs.com/package/@tanstackship/coupons)
- **Issues**: [https://github.com/tanstackship/packages/issues](https://github.com/tanstackship/packages/issues)

## Features

- 🎟️ Code generation
- 💯 Multiple discount types
- 📊 Usage limits
- ⏰ Expiry dates
- 🎯 Targeting
- 📈 Analytics

## Installation

```bash
npm install @tanstackship/coupons
```

## Quick Start

```typescript
import { createCouponSystem } from '@tanstackship/coupons'

const coupons = createCouponSystem()

await coupons.createCoupon({
  code: 'SAVE20',
  type: 'percentage',
  value: 20,
})

const result = await coupons.validateCoupon({
  code: 'SAVE20',
  userId: 'user_123',
  priceAmount: 9900,
})
```

## License

MIT © [Huifer](https://tanstackship.com/about)
