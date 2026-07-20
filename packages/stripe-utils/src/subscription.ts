/**
 * Subscription management utilities
 */

export interface Subscription {
  id: string
  customerId: string
  status: 'active' | 'past_due' | 'canceled' | 'incomplete' | 'trialing' | 'unpaid'
  currentPeriodStart: number
  currentPeriodEnd: number
  cancelAtPeriodEnd: boolean
  priceId?: string
  productId?: string
}

export interface Product {
  id: string
  name: string
  description?: string
  active: boolean
}

export interface Price {
  id: string
  productId: string
  unitAmount: number | null
  currency: string
  recurring?: {
    interval: 'day' | 'week' | 'month' | 'year'
    intervalCount: number
  }
}

/**
 * Get subscription status
 */
export function getSubscriptionStatus(subscription: Subscription): string {
  if (subscription.status === 'active') {
    if (subscription.cancelAtPeriodEnd) {
      return 'active_cancel_pending'
    }
    return 'active'
  }
  return subscription.status
}

/**
 * Check if subscription is valid
 */
export function isSubscriptionValid(subscription: Subscription): boolean {
  return subscription.status === 'active' || subscription.status === 'trialing'
}

/**
 * Check if subscription will cancel at period end
 */
export function willCancelAtPeriodEnd(subscription: Subscription): boolean {
  return subscription.cancelAtPeriodEnd
}

/**
 * Get days until renewal
 */
export function getDaysUntilRenewal(subscription: Subscription): number {
  const now = Date.now() / 1000
  const periodEnd = subscription.currentPeriodEnd
  
  if (periodEnd <= now) {
    return 0
  }
  
  return Math.ceil((periodEnd - now) / (60 * 60 * 24))
}

/**
 * Get subscription interval label
 */
export function getIntervalLabel(subscription: Subscription): string {
  // This would typically come from the price object
  return 'month'
}

/**
 * Cancel subscription at period end
 */
export async function cancelSubscriptionAtPeriodEnd(subscriptionId: string): Promise<Subscription> {
  const response = await fetch(`/api/stripe/subscription/${subscriptionId}/cancel-at-period-end`, {
    method: 'POST',
  })
  
  if (!response.ok) {
    throw new Error('Failed to cancel subscription')
  }
  
  return response.json()
}

/**
 * Reactivate canceled subscription
 */
export async function reactivateSubscription(subscriptionId: string): Promise<Subscription> {
  const response = await fetch(`/api/stripe/subscription/${subscriptionId}/reactivate`, {
    method: 'POST',
  })
  
  if (!response.ok) {
    throw new Error('Failed to reactivate subscription')
  }
  
  return response.json()
}

/**
 * Update subscription quantity
 */
export async function updateSubscriptionQuantity(
  subscriptionId: string,
  quantity: number
): Promise<Subscription> {
  const response = await fetch(`/api/stripe/subscription/${subscriptionId}/update-quantity`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  })
  
  if (!response.ok) {
    throw new Error('Failed to update subscription quantity')
  }
  
  return response.json()
}
