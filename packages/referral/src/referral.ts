/**
 * Referral System Implementation
 */

import { z } from 'zod'
import type {
  ReferralConfig,
  RewardConfig,
  CreateReferralLinkOptions,
  TrackReferralOptions,
  ReferralLink,
  Referral,
  ReferralStats,
  LeaderboardEntry,
  GetLeaderboardOptions,
} from './types'

// In-memory storage (replace with your database)
const referralLinks = new Map<string, ReferralLink>()
const referrals = new Map<string, Referral>()
const userReferralCodes = new Map<string, string>()
const codeToUser = new Map<string, string>()

/**
 * Generate a random referral code
 */
function generateCode(length: number = 6): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // exclude confusing chars
  let code = ''
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

/**
 * Format reward as human-readable string
 */
function formatReward(reward: RewardConfig): string {
  switch (reward.type) {
    case 'credit':
      return `$${(reward.amount / 100).toFixed(2)} credit`
    case 'coupon':
      if ('percentOff' in reward) {
        const max = reward.maxAmount ? ` (max $${reward.maxAmount / 100})` : ''
        return `${reward.percentOff}% off${max}`
      }
      return `$${(reward.amountOff / 100).toFixed(2)} off`
    case 'free_months':
      return `${reward.months} free month${reward.months > 1 ? 's' : ''}`
    default:
      return 'reward'
  }
}

/**
 * Create a referral system
 */
export function createReferralSystem(config: ReferralConfig) {
  /**
   * Create a referral link for a user
   */
  async function createReferralLink(
    options: CreateReferralLinkOptions
  ): Promise<ReferralLink> {
    // Check if user already has a code
    const existingCode = userReferralCodes.get(options.userId)
    if (existingCode) {
      const existing = referralLinks.get(existingCode)
      if (existing) {
        return existing
      }
    }

    // Generate unique code
    let code = generateCode()
    while (referralLinks.has(code)) {
      code = generateCode()
    }

    const link: ReferralLink = {
      code,
      url: `https://tanstackship.com/ref/${code}`,
      userId: options.userId,
      createdAt: new Date().toISOString(),
      clickCount: 0,
      conversionCount: 0,
    }

    referralLinks.set(code, link)
    userReferralCodes.set(options.userId, code)
    codeToUser.set(code, options.userId)

    return link
  }

  /**
   * Get referral code for a user
   */
  async function getReferralCode(userId: string): Promise<string | null> {
    return userReferralCodes.get(userId) ?? null
  }

  /**
   * Track a referral
   */
  async function trackReferral(
    options: TrackReferralOptions
  ): Promise<{
    success: boolean
    referralId?: string
    referrerId?: string
    referralCount?: number
    reward?: { type: string; description: string }
    error?: string
  }> {
    const referrerId = codeToUser.get(options.referralCode)

    if (!referrerId) {
      return { success: false, error: 'Invalid referral code' }
    }

    if (referrerId === options.refereeId) {
      return { success: false, error: 'Cannot refer yourself' }
    }

    // Check if this referee was already referred
    const existing = Array.from(referrals.values()).find(
      (r) => r.refereeId === options.refereeId
    )
    if (existing) {
      return { success: false, error: 'User already referred' }
    }

    const referral: Referral = {
      id: `ref_${Date.now()}`,
      code: options.referralCode,
      referrerId,
      refereeId: options.refereeId,
      refereeEmail: options.refereeEmail,
      status: 'pending',
      createdAt: new Date().toISOString(),
      metadata: options.metadata,
    }

    referrals.set(referral.id, referral)

    // Update link stats
    const link = referralLinks.get(options.referralCode)
    if (link) {
      link.conversionCount++
    }

    // Calculate referral count
    const referralCount = Array.from(referrals.values()).filter(
      (r) => r.referrerId === referrerId && r.status !== 'pending'
    ).length

    return {
      success: true,
      referralId: referral.id,
      referrerId,
      referralCount,
      reward: {
        type: config.referrerReward.type,
        description: formatReward(config.referrerReward),
      },
    }
  }

  /**
   * Get referral stats for a user
   */
  async function getReferralStats(options: {
    userId: string
    period?: '7d' | '30d' | '90d' | 'all'
  }): Promise<ReferralStats> {
    const userReferrals = Array.from(referrals.values()).filter(
      (r) => r.referrerId === options.userId
    )

    const now = Date.now()
    const periodMs = {
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      '90d': 90 * 24 * 60 * 60 * 1000,
      all: Infinity,
    }[options.period ?? 'all']

    const periodReferrals = userReferrals.filter(
      (r) => now - new Date(r.createdAt).getTime() < periodMs
    )

    const successful = periodReferrals.filter((r) => r.status === 'converted' || r.status === 'rewarded')
    const pending = periodReferrals.filter((r) => r.status === 'pending')
    const totalCredits = successful.reduce((sum, r) => sum + (r.rewardAmount ?? 0), 0)

    return {
      totalReferrals: periodReferrals.length,
      successfulReferrals: successful.length,
      pendingReferrals: pending.length,
      totalCreditsEarned: totalCredits,
      pendingRewards: pending.length,
      conversionRate: periodReferrals.length > 0
        ? successful.length / periodReferrals.length
        : 0,
    }
  }

  /**
   * Get leaderboard
   */
  async function getLeaderboard(
    options: GetLeaderboardOptions = {}
  ): Promise<LeaderboardEntry[]> {
    const limit = options.limit ?? 10

    // Aggregate by user
    const userStats = new Map<string, { count: number; credits: number }>()

    for (const referral of referrals.values()) {
      if (referral.status === 'converted' || referral.status === 'rewarded') {
        const stats = userStats.get(referral.referrerId) ?? { count: 0, credits: 0 }
        stats.count++
        stats.credits += referral.rewardAmount ?? 0
        userStats.set(referral.referrerId, stats)
      }
    }

    // Sort by credits
    const sorted = Array.from(userStats.entries())
      .sort((a, b) => b[1].credits - a[1].credits)
      .slice(0, limit)

    return sorted.map(([userId, stats], index) => ({
      rank: index + 1,
      userId,
      referralCount: stats.count,
      creditsEarned: stats.credits,
      period: options.period ?? 'all',
    }))
  }

  /**
   * Mark referral as converted (when referee pays)
   */
  async function markConverted(referralId: string): Promise<void> {
    const referral = referrals.get(referralId)
    if (referral && referral.status === 'pending') {
      referral.status = 'converted'
      referral.convertedAt = new Date().toISOString()
      referral.rewardAmount = config.referrerReward.type === 'credit'
        ? (config.referrerReward as any).amount
        : 0
    }
  }

  /**
   * Claim reward
   */
  async function claimReward(options: {
    userId: string
    referralId?: string
  }): Promise<{ success: boolean; amount?: number }> {
    const userReferrals = Array.from(referrals.values()).filter(
      (r) => r.referrerId === options.userId && r.status === 'converted'
    )

    const toClaim = options.referralId
      ? userReferrals.find((r) => r.id === options.referralId)
      : userReferrals[0]

    if (!toClaim) {
      return { success: false }
    }

    toClaim.status = 'rewarded'
    toClaim.rewardedAt = new Date().toISOString()

    return { success: true, amount: toClaim.rewardAmount }
  }

  return {
    createReferralLink,
    getReferralCode,
    trackReferral,
    getReferralStats,
    getLeaderboard,
    markConverted,
    claimReward,
  }
}

export type ReferralSystem = ReturnType<typeof createReferralSystem>
