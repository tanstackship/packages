/**
 * Stripe Checkout utilities
 */

export interface CreateCheckoutOptions {
  priceId: string
  successUrl: string
  cancelUrl: string
  customerId?: string
  customerEmail?: string
  metadata?: Record<string, string>
  quantity?: number
  mode?: 'payment' | 'subscription'
  couponId?: string
}

export interface CheckoutSession {
  id: string
  url: string
}

/**
 * Create a Stripe Checkout Session
 * 
 * @example
 * ```typescript
 * const session = await createCheckoutSession({
 *   priceId: 'price_xxx',
 *   successUrl: 'https://example.com/success',
 *   cancelUrl: 'https://example.com/pricing',
 *   mode: 'subscription',
 * })
 * 
 * // Redirect to Stripe
 * window.location.href = session.url
 * ```
 */
export async function createCheckoutSession(options: CreateCheckoutOptions): Promise<CheckoutSession> {
  // This is a placeholder - actual implementation would use Stripe SDK
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  
  const response = await fetch('/api/stripe/create-checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(options),
  })
  
  if (!response.ok) {
    throw new Error('Failed to create checkout session')
  }
  
  return response.json()
}

/**
 * Get Stripe publishable key
 */
export function getStripePublishableKey(): string {
  return import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? ''
}

/**
 * Load Stripe.js
 */
export async function loadStripe(): Promise<typeof import('@stripe/stripe-js')> {
  const { loadStripe: load } = await import('@stripe/stripe-js')
  return { loadStripe: load }
}

/**
 * Create portal session for customer billing
 * 
 * @example
 * ```typescript
 * const session = await createPortalSession({
 *   customerId: 'cus_xxx',
 *   returnUrl: 'https://example.com/settings',
 * })
 * window.location.href = session.url
 * ```
 */
export async function createPortalSession(options: {
  customerId: string
  returnUrl: string
}): Promise<{ url: string }> {
  const response = await fetch('/api/stripe/create-portal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(options),
  })
  
  if (!response.ok) {
    throw new Error('Failed to create portal session')
  }
  
  return response.json()
}

/**
 * Get subscription status
 */
export async function getSubscriptionStatus(subscriptionId: string): Promise<{
  status: 'active' | 'past_due' | 'canceled' | 'incomplete'
  currentPeriodEnd: string
}> {
  const response = await fetch(`/api/stripe/subscription/${subscriptionId}`)
  
  if (!response.ok) {
    throw new Error('Failed to get subscription status')
  }
  
  return response.json()
}
