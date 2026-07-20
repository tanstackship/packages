/**
 * Credits System Types
 */

export type TransactionType = 'grant' | 'deduct' | 'lock' | 'unlock' | 'convert' | 'expire' | 'refund'

export interface CreditTransaction {
  id: string
  userId: string
  type: TransactionType
  amount: number // in cents
  balanceBefore: number
  balanceAfter: number
  reason: string
  expiresAt?: string
  expiredAt?: string
  metadata?: Record<string, unknown>
  createdAt: string
}

export interface UserBalance {
  userId: string
  available: number // in cents
  locked: number // in cents
  total: number // available + locked
  expiringAmount: number // amount expiring within 7 days
  expiringWithin30Days: number // amount expiring within 30 days
  lastUpdated: string
}

export interface InitializeUserOptions {
  userId: string
  initialCredits?: number
  expiresAt?: Date
}

export interface GrantOptions {
  userId: string
  amount: number
  reason: string
  metadata?: Record<string, unknown>
  expiresAt?: Date
}

export interface DeductOptions {
  userId: string
  amount: number
  reason: string
  metadata?: Record<string, unknown>
  allowNegative?: boolean
}

export interface LockCreditsOptions {
  userId: string
  amount: number
  reason: string
  metadata?: Record<string, unknown>
}

export interface UnlockCreditsOptions {
  userId: string
  transactionId: string
}

export interface ConvertCreditsOptions {
  userId: string
  amount: number
  rate: number // credits per currency unit
  reason: string
  metadata?: Record<string, unknown>
}

export interface PurchaseCreditsOptions {
  userId: string
  amount: number
  stripePriceId?: string
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, unknown>
}

export interface GetTransactionsOptions {
  userId: string
  type?: TransactionType
  reason?: string
  limit?: number
  offset?: number
  startDate?: Date
  endDate?: Date
}

export interface TransactionsResult {
  items: CreditTransaction[]
  total: number
  hasMore: boolean
}

export interface CreditsConfig {
  currency: string
  defaultBalance?: number
  enableExpiry?: boolean
  enableTransactions?: boolean
  autoExpireDays?: number
  minimumBalance?: number
  lowBalanceThreshold?: number
  autoRechargeThreshold?: number
  autoRechargeAmount?: number
  autoRechargeStripePriceId?: string
}

export interface DeductResult {
  success: boolean
  transaction?: CreditTransaction
  newBalance?: number
  error?: string
}

export interface GrantResult {
  success: boolean
  transaction: CreditTransaction
  newBalance: number
}

export interface ConvertResult {
  success: boolean
  creditsUsed: number
  currencyAmount: number
  transaction: CreditTransaction
}
