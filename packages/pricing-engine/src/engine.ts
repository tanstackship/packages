/**
 * Dynamic Pricing Engine
 * 
 * Calculate final prices with coupon/offer stacking, 
 * percentage and fixed discounts.
 */

import { z } from 'zod'
import type {
  Price,
  Offer,
  PricingInput,
  PricingResult,
  AppliedOfferDetail,
} from './types'

// ─── Zod Schemas ─────────────────────────────────────────────────────────────

export const priceSchema = z.object({
  id: z.string(),
  stripePriceId: z.string().optional(),
  name: z.string(),
  amount: z.number().int().min(0),
  currency: z.string().default('USD'),
  type: z.enum(['subscription', 'one_time']),
  interval: z.enum(['day', 'week', 'month', 'year']).optional(),
  active: z.boolean().default(true),
})

export const offerSchema = z.object({
  id: z.string(),
  code: z.string().optional(),
  type: z.enum(['percentage', 'fixed']),
  value: z.number().min(0),
  monthlyValue: z.number().nullable().optional(),
  yearlyValue: z.number().nullable().optional(),
  oneTimeValue: z.number().nullable().optional(),
  stackable: z.boolean().default(true),
  minimumAmount: z.number().int().min(0).optional(),
  maximumAmount: z.number().int().min(0).optional(),
  expiresAt: z.string().optional(),
  startsAt: z.string().optional(),
})

// ─── Discount Calculation ────────────────────────────────────────────────────

/**
 * Calculate the discount amount for a single offer
 */
function calculateDiscount(
  offer: Offer,
  price: Price
): number | null {
  // Resolve the correct discount value based on price type
  let discountValue: number | null = null

  if (price.type === 'one_time') {
    discountValue = offer.oneTimeValue ?? offer.value
  } else if (price.interval === 'year') {
    discountValue = offer.yearlyValue ?? offer.monthlyValue ?? offer.value
  } else {
    discountValue = offer.monthlyValue ?? offer.value
  }

  if (discountValue === null || discountValue === undefined) {
    return null
  }

  let amountOff: number

  if (offer.type === 'percentage') {
    amountOff = Math.round((price.amount * discountValue) / 100)
  } else {
    amountOff = discountValue
  }

  // Apply maximum discount cap if set
  if (offer.maximumAmount && amountOff > offer.maximumAmount) {
    amountOff = offer.maximumAmount
  }

  return amountOff
}

/**
 * Validate an offer against current conditions
 */
export function validateOffer(
  offer: Offer,
  price: Price,
  currentTime: Date = new Date()
): { valid: boolean; error?: string } {
  // Check if offer has started
  if (offer.startsAt) {
    const startDate = new Date(offer.startsAt)
    if (currentTime < startDate) {
      return { valid: false, error: 'Offer has not started yet' }
    }
  }

  // Check if offer has expired
  if (offer.expiresAt) {
    const expireDate = new Date(offer.expiresAt)
    if (currentTime > expireDate) {
      return { valid: false, error: 'Offer has expired' }
    }
  }

  // Check minimum amount
  if (offer.minimumAmount && price.amount < offer.minimumAmount) {
    return {
      valid: false,
      error: `Minimum order amount is ${formatCents(offer.minimumAmount)}`,
    }
  }

  // Check if price type is compatible
  if (price.type === 'one_time' && offer.oneTimeValue === null && offer.value === 0) {
    return { valid: false, error: 'Offer not applicable to one-time purchases' }
  }

  return { valid: true }
}

// ─── Main Calculation ────────────────────────────────────────────────────────

/**
 * Calculate the final price with all applicable offers
 * 
 * Rules:
 * - percentage type: apply as percentage discount
 * - fixed type: apply as fixed amount discount (min 0)
 * - Multiple stackable offers can be combined
 * - Only one non-stackable offer is applied (best one wins)
 * 
 * @example
 * ```typescript
 * const result = calculateCheckoutPrice({
 *   price: {
 *     id: 'price_123',
 *     name: 'Pro Plan',
 *     amount: 9900, // $99.00
 *     currency: 'USD',
 *     type: 'subscription',
 *     interval: 'month',
 *   },
 *   offers: [
 *     { id: 'offer_1', type: 'percentage', value: 20 }, // 20% off
 *     { id: 'offer_2', code: 'SAVE10', type: 'fixed', value: 1000 }, // $10 off
 *   ],
 * })
 * 
 * console.log(result.finalAmount) // $79.20
 * ```
 */
export function calculateCheckoutPrice(input: PricingInput): PricingResult {
  const { price, offers } = input
  const baseAmount = price.amount
  let discountAmount = 0
  const appliedOffers: AppliedOfferDetail[] = []

  // No offers = return base price
  if (!offers || offers.length === 0) {
    return {
      baseAmount,
      discountAmount: 0,
      finalAmount: baseAmount,
      currency: price.currency,
      appliedOffers: [],
    }
  }

  // Separate stackable and non-stackable offers
  const stackableOffers = offers.filter((o) => o.stackable !== false)
  const nonStackableOffers = offers.filter((o) => o.stackable === false)

  // Process stackable offers first
  for (const offer of stackableOffers) {
    const validation = validateOffer(offer, price)
    if (!validation.valid) continue

    const amountOff = calculateDiscount(offer, price)
    if (amountOff === null) continue

    // Ensure discount doesn't exceed remaining amount
    const remaining = baseAmount - discountAmount
    const actualAmountOff = Math.min(amountOff, remaining)

    if (actualAmountOff > 0) {
      discountAmount += actualAmountOff
      appliedOffers.push({
        offerId: offer.id,
        code: offer.code ?? null,
        type: offer.type,
        value: offer.value,
        amountOff: actualAmountOff,
      })
    }
  }

  // Process non-stackable offers (only the best one)
  if (appliedOffers.length === 0 || nonStackableOffers.length > 0) {
    let bestOffer: { offer: Offer; amountOff: number } | null = null

    for (const offer of nonStackableOffers) {
      const validation = validateOffer(offer, price)
      if (!validation.valid) continue

      const amountOff = calculateDiscount(offer, price)
      if (amountOff === null) continue

      const remaining = baseAmount - discountAmount
      const actualAmountOff = Math.min(amountOff, remaining)

      if (actualAmountOff > 0) {
        if (!bestOffer || actualAmountOff > bestOffer.amountOff) {
          bestOffer = { offer, amountOff: actualAmountOff }
        }
      }
    }

    // Apply best non-stackable offer if better than current discount
    if (bestOffer && bestOffer.amountOff > discountAmount) {
      // Remove previously applied stackable offers
      appliedOffers.length = 0
      discountAmount = bestOffer.amountOff
      appliedOffers.push({
        offerId: bestOffer.offer.id,
        code: bestOffer.offer.code ?? null,
        type: bestOffer.offer.type,
        value: bestOffer.offer.value,
        amountOff: bestOffer.amountOff,
      })
    }
  }

  const finalAmount = Math.max(0, baseAmount - discountAmount)

  return {
    baseAmount,
    discountAmount,
    finalAmount,
    currency: price.currency,
    appliedOffers,
  }
}

/**
 * Calculate simple percentage discount
 * 
 * @example
 * ```typescript
 * const discounted = calculatePercentage(10000, 20) // $80.00
 * ```
 */
export function calculatePercentage(
  amount: number,
  percentage: number
): number {
  return Math.round((amount * percentage) / 100)
}

/**
 * Calculate simple fixed discount
 * 
 * @example
 * ```typescript
 * const discounted = calculateFixed(10000, 1500) // $85.00
 * ```
 */
export function calculateFixed(amount: number, discount: number): number {
  return Math.max(0, amount - discount)
}

// ─── Formatting ──────────────────────────────────────────────────────────────

/**
 * Format cents to currency string
 * 
 * @example
 * ```typescript
 * formatCents(9999) // '$99.99'
 * formatCents(9999, 'EUR') // '€99.99'
 * ```
 */
export function formatCents(
  amount: number,
  currency: string = 'USD'
): string {
  const value = amount / 100
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(value)
}

/**
 * Format discount description
 * 
 * @example
 * ```typescript
 * formatDiscountDescription([{ code: 'SAVE20', type: 'percentage', value: 20, amountOff: 2000 }])
 * // 'SAVE20 (20% off)'
 * ```
 */
export function formatDiscountDescription(
  appliedOffers: AppliedOfferDetail[]
): string {
  if (appliedOffers.length === 0) return ''

  const parts = appliedOffers.map((offer) => {
    const value = formatCents(offer.amountOff, 'USD')

    if (offer.code) {
      if (offer.type === 'percentage') {
        return `${offer.code} (${offer.value}% off)`
      }
      return `${offer.code} (${value} off)`
    }

    if (offer.type === 'percentage') {
      return `${offer.value}% off`
    }

    return `${value} off`
  })

  return `Discount: ${parts.join(', ')}`
}

/**
 * Parse discount code and extract metadata
 * 
 * @example
 * ```typescript
 * parseDiscountCode('SAVE20') // { code: 'SAVE20', metadata: {} }
 * parseDiscountCode('SAVE20_PCT') // { code: 'SAVE20', type: 'percentage' }
 * ```
 */
export function parseDiscountCode(code: string): {
  code: string
  type?: 'percentage' | 'fixed'
  metadata?: Record<string, string>
} {
  const parts = code.toUpperCase().split('_')
  const result: ReturnType<typeof parseDiscountCode> = { code: parts[0] }

  if (parts.includes('PCT') || parts.includes('PERCENT')) {
    result.type = 'percentage'
  }

  return result
}
