/**
 * Pricing Engine Types
 */

/**
 * Price types
 */
export type PriceType = 'subscription' | 'one_time'

/**
 * Billing intervals
 */
export type BillingInterval = 'day' | 'week' | 'month' | 'year'

/**
 * Offer/discount types
 */
export type OfferType = 'percentage' | 'fixed'

/**
 * A price from your billing catalog
 */
export interface Price {
  /** Unique price ID */
  id: string
  /** Stripe price ID */
  stripePriceId?: string
  /** Price name (from product) */
  name: string
  /** Price amount in cents */
  amount: number
  /** Currency code (USD, EUR, etc.) */
  currency: string
  /** Price type */
  type: PriceType
  /** Billing interval (for subscriptions) */
  interval?: BillingInterval
  /** Is price active */
  active?: boolean
}

/**
 * An offer/coupon
 */
export interface Offer {
  /** Unique offer ID */
  id: string
  /** Offer code (for fixed offers) */
  code?: string
  /** Offer type */
  type: OfferType
  /** Discount value (percentage or fixed cents) */
  value: number
  /** Monthly discount for subscription prices */
  monthlyValue?: number | null
  /** Yearly discount for annual prices */
  yearlyValue?: number | null
  /** One-time discount for one-time prices */
  oneTimeValue?: number | null
  /** Is stackable with other offers */
  stackable?: boolean
  /** Minimum order amount (in cents) */
  minimumAmount?: number
  /** Maximum discount amount (in cents) */
  maximumAmount?: number
  /** Offer expires at */
  expiresAt?: string
  /** Offer starts at */
  startsAt?: string
}

/**
 * Input for price calculation
 */
export interface PricingInput {
  /** The price being purchased */
  price: Price
  /** Applicable offers */
  offers: Offer[]
  /** User ID (optional, for user-specific offers) */
  userId?: string
}

/**
 * Details of an applied offer
 */
export interface AppliedOfferDetail {
  offerId: string
  code: string | null
  type: OfferType
  value: number
  amountOff: number
}

/**
 * Result of price calculation
 */
export interface PricingResult {
  /** Original price amount */
  baseAmount: number
  /** Total discount amount */
  discountAmount: number
  /** Final price after discounts */
  finalAmount: number
  /** Currency code */
  currency: string
  /** List of applied offers */
  appliedOffers: AppliedOfferDetail[]
}

/**
 * Validate an offer against a price
 */
export interface OfferValidation {
  valid: boolean
  error?: string
  offer?: Offer
}
