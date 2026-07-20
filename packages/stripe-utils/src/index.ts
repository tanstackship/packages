/**
 * @tanstackship/stripe-utils
 * 
 * Stripe integration utilities for web apps.
 * Checkout, webhooks, and subscription management.
 * 
 * @example
 * ```typescript
 * import { 
 *   createCheckoutSession,
 *   createPortalSession,
 *   handleWebhookEvent 
 * } from '@tanstackship/stripe-utils'
 * 
 * // Create checkout
 * const session = await createCheckoutSession({
 *   priceId: 'price_xxx',
 *   successUrl: '/success',
 *   cancelUrl: '/pricing',
 * })
 * ```
 */

// Checkout
export { 
  createCheckoutSession, 
  createPortalSession,
  getStripePublishableKey,
  loadStripe,
  getSubscriptionStatus,
  type CreateCheckoutOptions,
  type CheckoutSession 
} from './checkout'

// Webhook
export { 
  verifyWebhookSignature, 
  handleWebhookEvent,
  getCustomerId,
  getSubscriptionId,
  getAmount,
  getCurrency,
  formatAmount,
  type WebhookEvent,
  type WebhookHandler,
  type WebhookHandlers 
} from './webhook'

// Subscription
export { 
  getSubscriptionStatus,
  isSubscriptionValid,
  willCancelAtPeriodEnd,
  getDaysUntilRenewal,
  getIntervalLabel,
  cancelSubscriptionAtPeriodEnd,
  reactivateSubscription,
  updateSubscriptionQuantity,
  type Subscription,
  type Product,
  type Price 
} from './subscription'
