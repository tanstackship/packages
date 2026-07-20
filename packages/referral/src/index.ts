/**
 * @tanstackship/referral
 * 
 * Referral system for SaaS apps.
 * 
 * @example
 * ```typescript
 * import { createReferralSystem } from '@tanstackship/referral'
 * 
 * const referral = createReferralSystem({
 *   referrerReward: { type: 'credit', amount: 1000 },
 *   refereeReward: { type: 'coupon', percentOff: 20 },
 * })
 * 
 * const link = await referral.createReferralLink({
 *   userId: 'user_123',
 *   userEmail: 'user@example.com',
 * })
 * 
 * const result = await referral.trackReferral({
 *   referralCode: 'ABC123',
 *   refereeId: 'new_user_456',
 *   refereeEmail: 'new@example.com',
 * })
 * ```
 */

export { createReferralSystem, type ReferralSystem } from './referral'

export type {
  RewardType,
  RewardConfig,
  CreditReward,
  PercentCouponReward,
  FixedCouponReward,
  FreeMonthsReward,
  ReferralConfig,
  CreateReferralLinkOptions,
  ReferralLink,
  TrackReferralOptions,
  TrackReferralResult,
  Referral,
  ReferralStats,
  LeaderboardEntry,
  GetLeaderboardOptions,
  ClaimRewardOptions,
} from './types'
