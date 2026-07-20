# @tanstackship/coupons

> Coupon and discount code management for SaaS. Create, validate, and track coupon usage.

[![npm version](https://badge.fury.io/js/@tanstackship%2Fcoupons.svg)](https://badge.fury.io/js/@tanstackship%2Fcoupons)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🎟️ **Code generation** - Create unique coupon codes
- 💯 **Multiple discount types** - Percentage, fixed amount, free months
- 📊 **Usage limits** - Per-customer and total usage limits
- ⏰ **Expiry dates** - Set start and end dates
- 🎯 **Targeting** - Limit to specific plans, users, or domains
- 📈 **Analytics** - Track coupon performance
- 🔗 **Redemption tracking** - See who used which coupons

## Installation

```bash
npm install @tanstackship/coupons
```

## Quick Start

### Create a coupon

```typescript
import { createCouponSystem } from '@tanstackship/coupons'

const coupons = createCouponSystem()

// Create a 20% off coupon
const coupon = await coupons.createCoupon({
  code: 'SAVE20',
  type: 'percentage',
  value: 20,
  maxUses: 100,
  expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
})

console.log(`Created coupon: ${coupon.code}`)
```

### Validate a coupon

```typescript
const result = await coupons.validateCoupon({
  code: 'SAVE20',
  userId: 'user_123',
  priceId: 'price_pro_monthly',
})

if (result.valid) {
  console.log(`Discount: ${result.discount}`)
  console.log(`Final price: $${result.finalAmount / 100}`)
} else {
  console.log(`Error: ${result.error}`)
}
```

### Redeem a coupon

```typescript
const result = await coupons.redeemCoupon({
  code: 'SAVE20',
  userId: 'user_123',
  priceId: 'price_pro_monthly',
  priceAmount: 9900, // $99
})

if (result.success) {
  console.log(`Redeemed! New price: $${result.finalAmount / 100}`)
}
```

## Discount Types

### Percentage Off

```typescript
await coupons.createCoupon({
  code: 'PERCENT30',
  type: 'percentage',
  value: 30,
  maxDiscount: 5000, // cap at $50
})
```

### Fixed Amount Off

```typescript
await coupons.createCoupon({
  code: 'FLAT10',
  type: 'fixed',
  value: 1000, // $10 off
})
```

### Free Months

```typescript
await coupons.createCoupon({
  code: 'FREEMONTH',
  type: 'free_months',
  value: 1, // 1 free month
})
```

## Targeting

### Plan targeting

```typescript
await coupons.createCoupon({
  code: 'PRO2024',
  type: 'percentage',
  value: 25,
  eligiblePlans: ['price_pro_monthly', 'price_pro_yearly'],
})
```

### User targeting

```typescript
await coupons.createCoupon({
  code: 'VIP50',
  type: 'percentage',
  value: 50,
  eligibleUsers: ['user_123', 'user_456'],
})
```

### Email domain targeting

```typescript
await coupons.createCoupon({
  code: 'COMPANY25',
  type: 'percentage',
  value: 25,
  eligibleDomains: ['acme.com', 'example.com'],
})
```

## API Reference

### `createCoupon(options)`

Create a new coupon.

```typescript
const coupon = await coupons.createCoupon({
  code: 'SUMMER20',
  type: 'percentage',
  value: 20,
  maxUses: 500,
  maxUsesPerCustomer: 1,
  expiresAt: new Date('2024-09-01'),
  startsAt: new Date('2024-06-01'),
  eligiblePlans: ['price_pro_monthly'],
})
```

### `validateCoupon(options)`

Validate a coupon without redeeming.

```typescript
const result = await coupons.validateCoupon({
  code: 'SAVE20',
  userId: 'user_123',
  priceId: 'price_pro_monthly',
  priceAmount: 9900,
})
```

### `redeemCoupon(options)`

Redeem a coupon for a user.

```typescript
const result = await coupons.redeemCoupon({
  code: 'SAVE20',
  userId: 'user_123',
  priceId: 'price_pro_monthly',
  priceAmount: 9900,
})
```

### `getCoupon(code)`

Get coupon details.

```typescript
const coupon = await coupons.getCoupon({ code: 'SAVE20' })
```

### `deactivateCoupon(code)`

Deactivate a coupon.

```typescript
await coupons.deactivateCoupon({ code: 'SAVE20' })
```

### `getCouponStats(code)`

Get coupon usage statistics.

```typescript
const stats = await coupons.getCouponStats({ code: 'SAVE20' })
console.log(`
  Total uses: ${stats.totalUses}
  Unique customers: ${stats.uniqueCustomers}
  Total discount given: $${stats.totalDiscount / 100}
`)
```

### `listCoupons(options)`

List all coupons with filtering.

```typescript
const result = await coupons.listCoupons({
  status: 'active',
  type: 'percentage',
  limit: 20,
})
```

## Examples

### Checkout integration

```typescript
async function applyCouponAtCheckout(couponCode: string, userId: string) {
  const result = await coupons.validateCoupon({
    code: couponCode,
    userId,
    priceId: selectedPlan.id,
    priceAmount: selectedPlan.amount,
  })
  
  if (!result.valid) {
    return { error: result.error }
  }
  
  return {
    success: true,
    originalPrice: selectedPlan.amount,
    discount: result.discount,
    finalPrice: result.finalAmount,
    couponCode,
  }
}
```

## TypeScript

Full TypeScript support:

```typescript
import type {
  CouponSystem,
  Coupon,
  CouponType,
  ValidateResult,
  RedeemResult,
} from '@tanstackship/coupons'
```

## License

MIT © [Huifer](https://tanstackship.com/about)
