/**
 * @tanstackship/coupons
 * 
 * Coupon and discount code management for SaaS.
 * 
 * @example
 * ```typescript
 * import { createCouponSystem } from '@tanstackship/coupons'
 * 
 * const coupons = createCouponSystem()
 * 
 * const coupon = await coupons.createCoupon({
 *   code: 'SAVE20',
 *   type: 'percentage',
 *   value: 20,
 *   maxUses: 100,
 * })
 * 
 * const result = await coupons.validateCoupon({
 *   code: 'SAVE20',
 *   userId: 'user_123',
 *   priceAmount: 9900,
 * })
 * ```
 */

export { createCouponSystem, type CouponSystem } from './coupons'

export type {
  CouponType,
  Coupon,
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
