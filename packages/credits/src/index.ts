/**
 * @tanstackship/credits
 * 
 * Credits/balance system for SaaS apps.
 * 
 * @example
 * ```typescript
 * import { createCreditsSystem } from '@tanstackship/credits'
 * 
 * const credits = createCreditsSystem({ currency: 'USD' })
 * 
 * await credits.initializeUser({ userId: 'user_123', initialCredits: 1000 })
 * 
 * const result = await credits.grant({
 *   userId: 'user_123',
 *   amount: 500,
 *   reason: 'referral_reward',
 * })
 * 
 * const balance = await credits.getBalance({ userId: 'user_123' })
 * console.log(`Balance: $${balance.available / 100}`)
 * ```
 */

export { createCreditsSystem, type CreditsSystem } from './credits'

export type {
  TransactionType,
  CreditTransaction,
  UserBalance,
  InitializeUserOptions,
  GrantOptions,
  DeductOptions,
  LockCreditsOptions,
  UnlockCreditsOptions,
  ConvertCreditsOptions,
  PurchaseCreditsOptions,
  GetTransactionsOptions,
  TransactionsResult,
  CreditsConfig,
  DeductResult,
  GrantResult,
  ConvertResult,
} from './types'
