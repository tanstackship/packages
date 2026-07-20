/**
 * Referral System Types
 */

export type RewardType = 'credit' | 'coupon' | 'free_months'

export interface CreditReward {
  type: 'credit'
  amount: number // in cents
}

export interface PercentCouponReward {
  type: 'coupon'
  percentOff: number
  maxAmount?: number
}

export interface FixedCouponReward {
  type: 'coupon'
  amountOff: number // in cents
}

export interface FreeMonthsReward {
  type: 'free_months'
  months: number
}

export type RewardConfig = CreditReward | PercentCouponReward | FixedCouponReward | FreeMonthsReward

export interface ReferralConfig {
  referrerReward: RewardConfig
  refereeReward?: RewardConfig
  requirePaidReferral?: boolean
  maxRewardsPerUser?: number
  rewardDelay?: number // days
  cookieExpiry?: number // days
}

export interface CreateReferralLinkOptions {
  userId: string
  userEmail: string
  metadata?: Record<string, unknown>
}

export interface ReferralLink {
  code: string
  url: string
  userId: string
  createdAt: string
  clickCount: number
  conversionCount: number
}

export interface TrackReferralOptions {
  referralCode: string
  refereeId: string
  refereeEmail: string
  metadata?: Record<string, unknown>
}

export interface TrackReferralResult {
  success: boolean
  referralId?: string
  referrerId?: string
  referralCount?: number
  reward?: {
    type: RewardType
    description: string
  }
  error?: string
}

export interface Referral {
  id: string
  code: string
  referrerId: string
  refereeId: string
  refereeEmail: string
  status: 'pending' | 'converted' | 'rewarded' | 'expired'
  convertedAt?: string
  rewardedAt?: string
  rewardAmount?: number
  createdAt: string
  metadata?: Record<string, unknown>
}

export interface ReferralStats {
  totalReferrals: number
  successfulReferrals: number
  pendingReferrals: number
  totalCreditsEarned: number
  pendingRewards: number
  conversionRate: number
  topReferralCode?: string
}

export interface LeaderboardEntry {
  rank: number
  userId: string
  referralCount: number
  creditsEarned: number
  period: string
}

export interface GetLeaderboardOptions {
  limit?: number
  period?: '7d' | '30d' | '90d' | 'all'
}

export interface ClaimRewardOptions {
  userId: string
  referralId?: string // claim specific, or all if omitted
}
