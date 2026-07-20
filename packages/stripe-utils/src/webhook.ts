/**
 * Stripe Webhook utilities
 */

export interface WebhookEvent {
  id: string
  type: string
  data: {
    object: Record<string, unknown>
  }
}

export type WebhookHandler = (event: WebhookEvent) => Promise<void> | void

export interface WebhookHandlers {
  'checkout.session.completed'?: WebhookHandler
  'customer.subscription.created'?: WebhookHandler
  'customer.subscription.updated'?: WebhookHandler
  'customer.subscription.deleted'?: WebhookHandler
  'invoice.payment_succeeded'?: WebhookHandler
  'invoice.payment_failed'?: WebhookHandler
  [key: string]: WebhookHandler | undefined
}

/**
 * Verify Stripe webhook signature
 * 
 * @example
 * ```typescript
 * const event = await verifyWebhookSignature(
 *   rawBody,
 *   signature,
 *   process.env.STRIPE_WEBHOOK_SECRET!
 * )
 * ```
 */
export async function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): Promise<WebhookEvent> {
  // This is a placeholder - actual implementation would use Stripe SDK
  // const Stripe = require('stripe')
  // const stripe = new Stripe(secret)
  // return stripe.webhooks.constructEvent(payload, signature, secret)
  
  try {
    const event = JSON.parse(payload) as WebhookEvent
    return event
  } catch {
    throw new Error('Invalid webhook payload')
  }
}

/**
 * Handle webhook event
 */
export async function handleWebhookEvent(
  event: WebhookEvent,
  handlers: WebhookHandlers
): Promise<void> {
  const handler = handlers[event.type]
  
  if (handler) {
    await handler(event)
  } else {
    console.log(`Unhandled webhook event: ${event.type}`)
  }
}

/**
 * Extract customer ID from webhook event
 */
export function getCustomerId(event: WebhookEvent): string | null {
  const obj = event.data.object
  
  if ('customer' in obj && typeof obj.customer === 'string') {
    return obj.customer
  }
  
  if ('customer_email' in obj && typeof obj.customer_email === 'string') {
    return obj.customer_email
  }
  
  return null
}

/**
 * Extract subscription ID from webhook event
 */
export function getSubscriptionId(event: WebhookEvent): string | null {
  const obj = event.data.object
  
  if ('subscription' in obj && typeof obj.subscription === 'string') {
    return obj.subscription
  }
  
  return null
}

/**
 * Extract amount from webhook event (in cents)
 */
export function getAmount(event: WebhookEvent): number | null {
  const obj = event.data.object
  
  if ('amount' in obj && typeof obj.amount === 'number') {
    return obj.amount
  }
  
  if ('amount_total' in obj && typeof obj.amount_total === 'number') {
    return obj.amount_total
  }
  
  if ('amount_paid' in obj && typeof obj.amount_paid === 'number') {
    return obj.amount_paid
  }
  
  return null
}

/**
 * Get currency from webhook event
 */
export function getCurrency(event: WebhookEvent): string | null {
  const obj = event.data.object
  
  if ('currency' in obj && typeof obj.currency === 'string') {
    return obj.currency
  }
  
  return null
}

/**
 * Format amount for display
 */
export function formatAmount(amount: number, currency: string = 'usd'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100)
}
