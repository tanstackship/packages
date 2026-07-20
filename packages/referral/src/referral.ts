/**
 * Referral System Implementation
 */

export type RewardType = 'credit' | 'coupon' | 'free_months'

export interface RewardConfig {
  type: RewardType
  amount?: number
  percentOff?: number
  maxAmount?: number
  months?: number
}

export interface ReferralConfig {
  referrerReward: RewardConfig
  refereeReward?: RewardConfig
  requirePaidReferral?: boolean
  maxRewardsPerUser?: number
  rewardDelay?: number
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

function generateCode(length: number = 6): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export function createReferralSystem(_config: ReferralConfig) {
  const referralLinks = new Map<string, ReferralLink>()
  const userReferralCodes = new Map<string, string>()
  const codeToUser = new Map<string, string>()
  const referrals = new Map<string, { referrerId: string; refereeId: string; status: string }>()

  return {
    async createReferralLink(options: CreateReferralLinkOptions): Promise<ReferralLink> {
      const existingCode = userReferralCodes.get(options.userId)
      if (existingCode) {
        const existing = referralLinks.get(existingCode)
        if (existing) return existing
      }

      let code = generateCode()
      while (referralLinks.has(code)) code = generateCode()

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
    },

    async getReferralCode(userId: string): Promise<string | null> {
      return userReferralCodes.get(userId) ?? null
    },

    async trackReferral(options: TrackReferralOptions): Promise<{ success: boolean; referrerId?: string; error?: string }> {
      const referrerId = codeToUser.get(options.referralCode)
      if (!referrerId) return { success: false, error: 'Invalid referral code' }
      if (referrerId === options.refereeId) return { success: false, error: 'Cannot refer yourself' }

      referrals.set(Math.random().toString(36).substring(7), { referrerId, refereeId: options.refereeId, status: 'pending' })
      const link = referralLinks.get(options.referralCode)
      if (link) link.conversionCount++
      return { success: true, referrerId }
    },

    async getReferralStats(options: { userId: string }): Promise<{ totalReferrals: number; successfulReferrals: number }> {
      const userRefs = Array.from(referrals.values()).filter(r => r.referrerId === options.userId)
      return { totalReferrals: userRefs.length, successfulReferrals: userRefs.filter(r => r.status !== 'pending').length }
    },
  }
}
