/**
 * @tanstackship/pricing-engine
 * 
 * Dynamic pricing engine with coupon/offer stacking, 
 * percentage and fixed discounts for SaaS applications.
 * 
 * @example
 * ```typescript
 * import { 
 *   calculateCheckoutPrice,
 *   formatCents,
 *   validateOffer 
 * } from '@tanstackship/pricing-engine'
 * 
 * const result = calculateCheckoutPrice({
 *   price: {
 *     id: 'price_pro_monthly',
 *     name: 'Pro Plan',
 *     amount: 9900,
 *     currency: 'USD',
 *     type: 'subscription',
 *     interval: 'month',
 *   },
 *   offers: [
 *     { id: 'offer_1', type: 'percentage', value: 20 },
 *     { id: 'offer_2', code: 'SAVE10', type: 'fixed', value: 1000 },
 *   ],
 * })
 * 
 * console.log(formatCents(result.finalAmount)) // '$79.20'
 * ```
 */

// Types
export type {
  Price,
  Offer,
  PriceType,
  BillingInterval,
  OfferType,
  PricingInput,
  PricingResult,
  AppliedOfferDetail,
  OfferValidation,
} from './types'

// Engine functions
export {
  calculateCheckoutPrice,
  calculatePercentage,
  calculateFixed,
  validateOffer,
  formatCents,
  formatDiscountDescription,
  parseDiscountCode,
  priceSchema,
  offerSchema,
} from './engine'
