/**
 * Coupon System Implementation
 */

import { randomUUID } from 'crypto'
import type {
  Coupon,
  CouponType,
  CreateCouponOptions,
  ValidateCouponOptions,
  RedeemCouponOptions,
  ValidateResult,
  RedeemResult,
  Redemption,
  CouponStats,
  ListCouponsOptions,
  ListCouponsResult,
} from './types'

// In-memory storage
const coupons = new Map<string, Coupon>()
const redemptions = new Map<string, Redemption>()
const customerRedemptions = new Map<string, Set<string>>()

function generateCode(prefix: string = ''): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = prefix.toUpperCase()
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

function calculateDiscount(
  coupon: Coupon,
  priceAmount: number
): { discount: number; finalAmount: number } {
  let discount = 0

  switch (coupon.type) {
    case 'percentage':
      discount = Math.round((priceAmount * coupon.value) / 100)
      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount)
      }
      break
    case 'fixed':
      discount = Math.min(coupon.value, priceAmount)
      break
    case 'free_months':
      // For free months, discount = full price
      discount = priceAmount
      break
  }

  return {
    discount,
    finalAmount: priceAmount - discount,
  }
}

export function createCouponSystem() {
  async function createCoupon(options: CreateCouponOptions): Promise<Coupon> {
    const code = options.code.toUpperCase()
    
    if (coupons.has(code)) {
      throw new Error(`Coupon ${code} already exists`)
    }

    const now = new Date()
    const expiresAt = options.expiresAt?.toISOString() ?? null
    const startsAt = options.startsAt?.toISOString() ?? null

    const coupon: Coupon = {
      id: randomUUID(),
      code,
      type: options.type,
      value: options.value,
      maxUses: options.maxUses ?? null,
      maxUsesPerCustomer: options.maxUsesPerCustomer ?? null,
      currentUses: 0,
      eligiblePlans: options.eligiblePlans ?? null,
      eligibleUsers: options.eligibleUsers ?? null,
      eligibleDomains: options.eligibleDomains ?? null,
      startsAt,
      expiresAt,
      status: 'active',
      maxDiscount: options.maxDiscount ?? null,
      createdAt: now.toISOString(),
      createdBy: options.createdBy ?? 'system',
    }

    coupons.set(code, coupon)
    return coupon
  }

  async function getCoupon(options: { code: string }): Promise<Coupon | null> {
    return coupons.get(options.code.toUpperCase()) ?? null
  }

  async function validateCoupon(options: ValidateCouponOptions): Promise<ValidateResult> {
    const coupon = await getCoupon({ code: options.code })
    
    if (!coupon) {
      return { valid: false, error: 'Coupon not found' }
    }

    if (coupon.status !== 'active') {
      return { valid: false, error: 'Coupon is not active' }
    }

    const now = new Date()

    if (coupon.startsAt && now < new Date(coupon.startsAt)) {
      return { valid: false, error: 'Coupon is not yet valid' }
    }

    if (coupon.expiresAt && now > new Date(coupon.expiresAt)) {
      return { valid: false, error: 'Coupon has expired' }
    }

    if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
      return { valid: false, error: 'Coupon usage limit reached' }
    }

    if (coupon.eligibleUsers && !coupon.eligibleUsers.includes(options.userId)) {
      return { valid: false, error: 'Coupon not eligible for this user' }
    }

    if (coupon.eligiblePlans && options.priceId && !coupon.eligiblePlans.includes(options.priceId)) {
      return { valid: false, error: 'Coupon not eligible for this plan' }
    }

    if (coupon.eligibleDomains && options.userEmail) {
      const domain = options.userEmail.split('@')[1]
      if (!coupon.eligibleDomains.includes(domain)) {
        return { valid: false, error: 'Coupon not eligible for this email domain' }
      }
    }

    if (coupon.maxUsesPerCustomer) {
      const customerRedemptions_ = customerRedemptions.get(options.userId)
      const customerUses = customerRedemptions_?.size ?? 0
      if (customerUses >= coupon.maxUsesPerCustomer) {
        return { valid: false, error: 'You have already used this coupon' }
      }
    }

    const { discount, finalAmount } = calculateDiscount(coupon, options.priceAmount)

    return {
      valid: true,
      discount,
      finalAmount,
      coupon,
    }
  }

  async function redeemCoupon(options: RedeemCouponOptions): Promise<RedeemResult> {
    const validation = await validateCoupon(options)
    
    if (!validation.valid) {
      return {
        success: false,
        valid: false,
        error: validation.error,
      }
    }

    const coupon = validation.coupon!
    
    // Increment usage
    coupon.currentUses++
    coupons.set(coupon.code, coupon)

    // Record redemption
    const redemption: Redemption = {
      id: randomUUID(),
      couponId: coupon.id,
      couponCode: coupon.code,
      userId: options.userId,
      userEmail: options.userEmail ?? '',
      priceId: options.priceId ?? '',
      originalAmount: options.priceAmount,
      discountAmount: validation.discount!,
      finalAmount: validation.finalAmount!,
      redeemedAt: new Date().toISOString(),
    }

    redemptions.set(redemption.id, redemption)

    // Update customer index
    const customerRedemptions_ = customerRedemptions.get(options.userId) ?? new Set()
    customerRedemptions_.add(coupon.code)
    customerRedemptions.set(options.userId, customerRedemptions_)

    return {
      success: true,
      valid: true,
      discount: validation.discount,
      finalAmount: validation.finalAmount,
      redemptionId: redemption.id,
      coupon,
    }
  }

  async function deactivateCoupon(options: { code: string }): Promise<void> {
    const coupon = await getCoupon({ code: options.code })
    if (coupon) {
      coupon.status = 'inactive'
      coupons.set(options.code.toUpperCase(), coupon)
    }
  }

  async function getCouponStats(options: { code: string }): Promise<CouponStats> {
    const coupon = await getCoupon({ code: options.code })
    if (!coupon) {
      throw new Error('Coupon not found')
    }

    const couponRedemptions = Array.from(redemptions.values())
      .filter((r) => r.couponCode === options.code.toUpperCase())

    const totalDiscount = couponRedemptions.reduce((sum, r) => sum + r.discountAmount, 0)
    const uniqueCustomers = new Set(couponRedemptions.map((r) => r.userId)).size

    return {
      totalUses: couponRedemptions.length,
      uniqueCustomers,
      totalDiscount,
      averageDiscount: couponRedemptions.length > 0
        ? totalDiscount / couponRedemptions.length
        : 0,
      redemptionRate: coupon.maxUses
        ? couponRedemptions.length / coupon.maxUses
        : 0,
    }
  }

  async function listCoupons(options: ListCouponsOptions = {}): Promise<ListCouponsResult> {
    const now = new Date()
    
    let items = Array.from(coupons.values())

    if (options.status && options.status !== 'all') {
      if (options.status === 'expired') {
        items = items.filter((c) => c.expiresAt && new Date(c.expiresAt) < now)
      } else {
        items = items.filter((c) => c.status === options.status)
      }
    }

    if (options.type) {
      items = items.filter((c) => c.type === options.type)
    }

    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    const limit = options.limit ?? 20
    const offset = options.offset ?? 0

    return {
      items: items.slice(offset, offset + limit),
      total: items.length,
      hasMore: offset + limit < items.length,
    }
  }

  return {
    createCoupon,
    getCoupon,
    validateCoupon,
    redeemCoupon,
    deactivateCoupon,
    getCouponStats,
    listCoupons,
  }
}

export type CouponSystem = ReturnType<typeof createCouponSystem>
