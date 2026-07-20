# @tanstackship/referral

> Referral system for SaaS apps. Create referral links, track referrals, and manage rewards.

[![npm version](https://badge.fury.io/js/@tanstackship%2Freferral.svg)](https://badge.fury.io/js/@tanstackship%2Freferral)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🔗 **Referral link generation** - Create unique referral codes/links
- 👥 **Referral tracking** - Track who referred whom
- 🎁 **Reward management** - Configure rewards for referrer and referee
- 📊 **Analytics** - Track referral performance
- 🏆 **Leaderboards** - Show top referrers
- 💳 **Credit integration** - Auto-credit referrers with `@tanstackship/credits`

## Installation

```bash
npm install @tanstackship/referral
```

## Quick Start

### Create a referral program

```typescript
import { createReferralSystem } from '@tanstackship/referral'

const referral = createReferralSystem({
  // Reward the referrer with $10 credit
  referrerReward: { type: 'credit', amount: 1000 },
  // Give the referee 20% off
  refereeReward: { type: 'coupon', percentOff: 20 },
  // Require referral to be a paying customer
  requirePaidReferral: true,
})

// Generate a referral link for user
const link = await referral.createReferralLink({
  userId: 'user_123',
  userEmail: 'user@example.com',
})

console.log(link.code)   // "ABC123"
console.log(link.url)    // "https://app.com/ref/ABC123"
```

### Track a referral signup

```typescript
// When referee signs up with referral code
const result = await referral.trackReferral({
  referralCode: 'ABC123',
  refereeId: 'new_user_456',
  refereeEmail: 'new@example.com',
})

if (result.success) {
  console.log(`Referrer credited!`)
  console.log(`Referral count: ${result.referralCount}`)
}
```

### Check user's referral stats

```typescript
const stats = await referral.getReferralStats({
  userId: 'user_123',
})

console.log(`
  Total Referrals: ${stats.totalReferrals}
  Successful Referrals: ${stats.successfulReferrals}
  Pending Rewards: ${stats.pendingRewards}
  Earned Credits: ${stats.totalCreditsEarned}
`)
```

## API Reference

### `createReferralSystem(config)`

Create a referral system instance.

```typescript
const referral = createReferralSystem({
  referrerReward: { type: 'credit', amount: 1000 },
  refereeReward: { type: 'coupon', percentOff: 20 },
  requirePaidReferral: true,
  maxRewardsPerUser: 100,
  rewardDelay: 7, // days
})
```

### `createReferralLink(options)`

Create a referral link for a user.

```typescript
const link = await referral.createReferralLink({
  userId: 'user_123',
  userEmail: 'user@example.com',
  metadata: { plan: 'pro' },
})
```

### `trackReferral(options)`

Track a referral when someone signs up.

```typescript
const result = await referral.trackReferral({
  referralCode: 'ABC123',
  refereeId: 'new_user_456',
  refereeEmail: 'new@example.com',
})
```

### `getReferralCode(userId)`

Get a user's referral code.

```typescript
const code = await referral.getReferralCode({ userId: 'user_123' })
```

### `getReferralStats(userId)`

Get referral statistics for a user.

```typescript
const stats = await referral.getReferralStats({
  userId: 'user_123',
  period: 'all', // '7d', '30d', '90d', 'all'
})
```

### `claimReward(options)`

Claim pending rewards.

```typescript
await referral.claimReward({
  userId: 'user_123',
  referralId: 'ref_xxx',
})
```

### `getLeaderboard(options)`

Get top referrers.

```typescript
const leaders = await referral.getLeaderboard({
  limit: 10,
  period: '30d',
})
```

## Reward Types

### Credit Reward

```typescript
{
  type: 'credit',
  amount: 1000, // $10 in cents
}
```

### Percentage Discount

```typescript
{
  type: 'coupon',
  percentOff: 20, // 20% off
  maxAmount: 5000, // max $50 discount
}
```

### Fixed Discount

```typescript
{
  type: 'coupon',
  amountOff: 1000, // $10 off
}
```

### Free Months

```typescript
{
  type: 'free_months',
  months: 1,
}
```

## Examples

### React Component

```typescript
import { useReferral } from '@tanstackship/referral/react'

function ReferralDashboard() {
  const { code, stats, shareLink, isLoading } = useReferral()

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      <h2>Your Referral Code</h2>
      <code>{code}</code>
      
      <p>Share this link:</p>
      <input value={shareLink} readOnly />
      
      <div>
        <h3>Your Stats</h3>
        <p>Total Referrals: {stats.totalReferrals}</p>
        <p>Credits Earned: ${stats.totalCreditsEarned / 100}</p>
      </div>
    </div>
  )
}
```

### Share Buttons

```typescript
import { ShareReferral } from '@tanstackship/referral/react'

function ShareButtons() {
  const { shareLink, code } = useReferral()

  return (
    <ShareReferral
      link={shareLink}
      code={code}
      text={`Join me on TanStack Ship! Use code ${code} for 20% off.`}
      platforms={['twitter', 'linkedin', 'email', 'copy']}
    />
  )
}
```

## TypeScript

Full TypeScript support:

```typescript
import type {
  ReferralSystem,
  ReferralLink,
  ReferralStats,
  RewardConfig,
  RewardType,
} from '@tanstackship/referral'
```

## License

MIT © [Huifer](https://tanstackship.com/about)
