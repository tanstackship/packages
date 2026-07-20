/**
 * Coupon System Implementation
 */

export type CouponType = 'percentage' | 'fixed' | 'free_months'

export interface Coupon {
  id: string
  code: string
  type: CouponType
  value: number
  maxUses: number | null
  currentUses: number
  status: 'active' | 'inactive'
  maxDiscount: number | null
  createdAt: string
}

export interface CreateCouponOptions {
  code: string
  type: CouponType
  value: number
  maxUses?: number
  maxDiscount?: number
}

export interface ValidateResult {
  valid: boolean
  error?: string
  discount?: number
  finalAmount?: number
}

export interface RedeemResult extends ValidateResult {
  success: boolean
}

const coupons = new Map<string, Coupon>()

function calculateDiscount(coupon: Coupon, priceAmount: number): { discount: number; finalAmount: number } {
  let discount = 0
  if (coupon.type === 'percentage') {
    discount = Math.round((priceAmount * coupon.value) / 100)
    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount)
  } else if (coupon.type === 'fixed') {
    discount = Math.min(coupon.value, priceAmount)
  } else {
    discount = priceAmount
  }
  return { discount, finalAmount: priceAmount - discount }
}

export function createCouponSystem() {
  return {
    async createCoupon(options: CreateCouponOptions): Promise<Coupon> {
      const code = options.code.toUpperCase()
      const coupon: Coupon = {
        id: Math.random().toString(36).substring(7),
        code,
        type: options.type,
        value: options.value,
        maxUses: options.maxUses ?? null,
        currentUses: 0,
        status: 'active',
        maxDiscount: options.maxDiscount ?? null,
        createdAt: new Date().toISOString(),
      }
      coupons.set(code, coupon)
      return coupon
    },

    async validateCoupon(options: { code: string; priceAmount: number }): Promise<ValidateResult> {
      const coupon = coupons.get(options.code.toUpperCase())
      if (!coupon) return { valid: false, error: 'Coupon not found' }
      if (coupon.status !== 'active') return { valid: false, error: 'Coupon inactive' }
      const { discount, finalAmount } = calculateDiscount(coupon, options.priceAmount)
      return { valid: true, discount, finalAmount }
    },

    async redeemCoupon(options: { code: string; priceAmount: number }): Promise<RedeemResult> {
      const result = await this.validateCoupon(options)
      if (!result.valid) return { success: false, ...result }
      const coupon = coupons.get(options.code.toUpperCase())!
      coupon.currentUses++
      return { success: true, ...result }
    },
  }
}
