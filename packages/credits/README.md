# @tanstackship/credits

> Credits/balance system for SaaS apps. Track user balance, transactions, and usage-based billing.

[![npm version](https://badge.fury.io/js/@tanstackship%2Fcredits.svg)](https://badge.fury.io/js/@tanstackship%2Fcredits)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 💰 **Balance tracking** - Track user credit balances
- 📜 **Transaction history** - Complete audit trail
- 🎁 **Grants & deductions** - Add or subtract credits
- ⏰ **Expiry management** - Credits that expire
- 📊 **Usage tracking** - Track consumption by feature
- 🔄 **Auto-recharge** - Configure top-up thresholds
- 💳 **Stripe integration** - Purchase credits via Stripe

## Installation

```bash
npm install @tanstackship/credits
```

## Quick Start

### Initialize the credits system

```typescript
import { createCreditsSystem } from '@tanstackship/credits'

const credits = createCreditsSystem({
  currency: 'USD',
  defaultBalance: 0,
  enableExpiry: true,
  enableTransactions: true,
})

// Initialize user balance
await credits.initializeUser({
  userId: 'user_123',
  initialCredits: 1000, // $10
})
```

### Add credits (grant)

```typescript
// Add credits (referral reward, promo, etc.)
const transaction = await credits.grant({
  userId: 'user_123',
  amount: 500, // $5
  reason: 'referral_reward',
  metadata: { referralId: 'ref_xxx' },
})

console.log(`New balance: $${transaction.newBalance / 100}`)
```

### Deduct credits (usage)

```typescript
// Deduct credits for usage
const result = await credits.deduct({
  userId: 'user_123',
  amount: 100, // $1
  reason: 'api_usage',
  metadata: { 
    feature: 'ai_generation',
    tokens: 1000,
  },
})

if (!result.success) {
  console.log('Insufficient balance')
}
```

### Check balance

```typescript
const balance = await credits.getBalance({
  userId: 'user_123',
})

console.log(`Balance: $${balance.available / 100}`)
console.log(`Locked: $${balance.locked / 100}`)
console.log(`Expires: ${balance.expiringAmount > 0 
  ? `$${balance.expiringAmount / 100} within 7 days` 
  : 'No credits expiring'}`)
```

### Get transaction history

```typescript
const transactions = await credits.getTransactions({
  userId: 'user_123',
  limit: 20,
  offset: 0,
})

for (const tx of transactions.items) {
  console.log(`
    ${tx.type === 'grant' ? '+' : '-'}$${tx.amount / 100}
    ${tx.reason}
    ${tx.createdAt}
  `)
}
```

## API Reference

### `createCreditsSystem(config)`

Create a credits system instance.

```typescript
const credits = createCreditsSystem({
  currency: 'USD',
  defaultBalance: 0,
  enableExpiry: true,
  enableTransactions: true,
  autoExpireDays: 90,
  minimumBalance: 0,
})
```

### `initializeUser(options)`

Initialize a user's credit account.

```typescript
await credits.initializeUser({
  userId: 'user_123',
  initialCredits: 1000,
  expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // optional
})
```

### `grant(options)`

Add credits to a user's balance.

```typescript
const tx = await credits.grant({
  userId: 'user_123',
  amount: 500,
  reason: 'referral_reward',
  metadata: { referralId: 'ref_xxx' },
  expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // optional expiry
})
```

### `deduct(options)`

Deduct credits from a user's balance.

```typescript
const result = await credits.deduct({
  userId: 'user_123',
  amount: 100,
  reason: 'api_usage',
  metadata: { feature: 'ai_generation' },
  allowNegative: false, // default: false
})
```

### `lockCredits(options)`

Lock credits for pending transactions.

```typescript
await credits.lockCredits({
  userId: 'user_123',
  amount: 500,
  reason: 'pending_checkout',
  metadata: { orderId: 'order_xxx' },
})
```

### `unlockCredits(options)`

Unlock previously locked credits.

```typescript
await credits.unlockCredits({
  userId: 'user_123',
  transactionId: 'tx_lock_xxx',
})
```

### `convertCredits(options)`

Convert credits to currency (for billing).

```typescript
const result = await credits.convertCredits({
  userId: 'user_123',
  amount: 500,
  rate: 100, // 100 credits = $1
  reason: 'subscription_payment',
})
```

### `getBalance(userId)`

Get user's current balance.

```typescript
const balance = await credits.getBalance({
  userId: 'user_123',
})
```

### `getTransactions(options)`

Get transaction history.

```typescript
const result = await credits.getTransactions({
  userId: 'user_123',
  type: 'grant', // 'grant' | 'deduct' | 'lock' | 'unlock' | 'convert' | 'expire'
  reason: 'referral_reward',
  limit: 20,
  offset: 0,
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-12-31'),
})
```

### `purchaseCredits(options)`

Purchase credits via Stripe.

```typescript
const session = await credits.purchaseCredits({
  userId: 'user_123',
  amount: 5000, // $50
  stripePriceId: 'price_xxx', // or provide amount directly
  successUrl: '/credits/success',
  cancelUrl: '/credits',
})
```

## Examples

### Usage-based API billing

```typescript
async function handleApiCall(userId: string, tokens: number) {
  const costPerToken = 1 // 1 credit per token
  
  const result = await credits.deduct({
    userId,
    amount: tokens * costPerToken,
    reason: 'api_usage',
    metadata: { tokens },
  })
  
  if (!result.success) {
    throw new Error('Insufficient credits')
  }
  
  return { success: true, remainingBalance: result.newBalance }
}
```

### Referral rewards

```typescript
async function onReferralConverted(referrerId: string, referralId: string) {
  await credits.grant({
    userId: referrerId,
    amount: 1000, // $10
    reason: 'referral_reward',
    metadata: { referralId },
  })
}
```

### Top-up automation

```typescript
const credits = createCreditsSystem({
  // When balance drops below $5, auto-notify
  lowBalanceThreshold: 500,
  // Auto-purchase when below $2
  autoRechargeThreshold: 200,
  autoRechargeAmount: 5000,
  autoRechargeStripePriceId: 'price_xxx',
})
```

## TypeScript

Full TypeScript support:

```typescript
import type {
  CreditsSystem,
  CreditTransaction,
  UserBalance,
  GrantOptions,
  DeductOptions,
  TransactionType,
} from '@tanstackship/credits'
```

## License

MIT © [Huifer](https://tanstackship.com/about)
