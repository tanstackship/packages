/**
 * Coupon System Types
 */

export type CouponType = 'percentage' | 'fixed' | 'free_months'

export interface Coupon {
  id: string
  code: string
  type: CouponType
  value: number
  maxUses: number | null
  maxUsesPerCustomer: number | null
  currentUses: number
  eligiblePlans: string[] | null
  eligibleUsers: string[] | null
  eligibleDomains: string[] | null
  startsAt: string | null
  expiresAt: string | null
  status: 'active' | 'inactive' | 'expired'
  maxDiscount: number | null // for percentage type
  createdAt: string
  createdBy: string
}

export interface CreateCouponOptions {
  code: string
  type: CouponType
  value: number
  maxUses?: number
  maxUsesPerCustomer?: number
  eligiblePlans?: string[]
  eligibleUsers?: string[]
  eligibleDomains?: string[]
  startsAt?: Date
  expiresAt?: Date
  maxDiscount?: number
  createdBy?: string
}

export interface ValidateCouponOptions {
  code: string
  userId: string
  userEmail?: string
  priceId?: string
  priceAmount: number
}

export interface ValidateResult {
  valid: boolean
  error?: string
  discount?: number
  finalAmount?: number
  coupon?: Coupon
}

export interface RedeemCouponOptions extends ValidateCouponOptions {}

export interface RedeemResult extends ValidateResult {
  success: boolean
  redemptionId?: string
}

export interface Redemption {
  id: string
  couponId: string
  couponCode: string
  userId: string
  userEmail: string
  priceId: string
  originalAmount: number
  discountAmount: number
  finalAmount: number
  redeemedAt: string
}

export interface CouponStats {
  totalUses: number
  uniqueCustomers: number
  totalDiscount: number
  averageDiscount: number
  redemptionRate: number
}

export interface ListCouponsOptions {
  status?: 'active' | 'inactive' | 'expired' | 'all'
  type?: CouponType
  limit?: number
  offset?: number
}

export interface ListCouponsResult {
  items: Coupon[]
  total: number
  hasMore: boolean
}
