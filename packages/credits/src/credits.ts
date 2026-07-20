/**
 * Credits System Implementation
 */

import { randomUUID } from 'crypto'
import type {
  CreditsConfig,
  CreditTransaction,
  UserBalance,
  InitializeUserOptions,
  GrantOptions,
  DeductOptions,
  LockCreditsOptions,
  UnlockCreditsOptions,
  ConvertCreditsOptions,
  GetTransactionsOptions,
  TransactionsResult,
  GrantResult,
  DeductResult,
  ConvertResult,
} from './types'

// In-memory storage (replace with your database)
const balances = new Map<string, UserBalance>()
const transactions = new Map<string, CreditTransaction>()
const userTransactionIndex = new Map<string, string[]>()
const lockedTransactions = new Map<string, CreditTransaction>()

/**
 * Create a credits system
 */
export function createCreditsSystem(config: CreditsConfig) {
  const {
    currency = 'USD',
    defaultBalance = 0,
    enableExpiry = true,
    enableTransactions = true,
    autoExpireDays = 90,
    minimumBalance = 0,
  } = config

  // ─── Helpers ──────────────────────────────────────────────────────────────

  function getOrCreateBalance(userId: string): UserBalance {
    let balance = balances.get(userId)
    if (!balance) {
      balance = {
        userId,
        available: defaultBalance,
        locked: 0,
        total: defaultBalance,
        expiringAmount: 0,
        expiringWithin30Days: 0,
        lastUpdated: new Date().toISOString(),
      }
      balances.set(userId, balance)
    }
    return balance
  }

  function addTransaction(tx: CreditTransaction): void {
    if (!enableTransactions) return
    
    transactions.set(tx.id, tx)
    
    const userTxs = userTransactionIndex.get(tx.userId) ?? []
    userTxs.push(tx.id)
    userTransactionIndex.set(tx.userId, userTxs)
  }

  function updateBalance(userId: string, balance: UserBalance): void {
    const now = Date.now()
    const sevenDays = 7 * 24 * 60 * 60 * 1000
    const thirtyDays = 30 * 24 * 60 * 60 * 1000
    
    // Calculate expiring amounts
    const userTxs = (userTransactionIndex.get(userId) ?? [])
      .map((id) => transactions.get(id))
      .filter((tx): tx is CreditTransaction => 
        tx != null && tx.type === 'grant' && tx.expiresAt != null
      )
    
    let expiring = 0
    let expiring30 = 0
    
    for (const tx of userTxs) {
      if (!tx.expiresAt) continue
      const expiresAt = new Date(tx.expiresAt).getTime()
      const daysUntilExpiry = (expiresAt - now) / (24 * 60 * 60 * 1000)
      
      if (daysUntilExpiry <= 7 && daysUntilExpiry > 0) {
        expiring += tx.amount
      }
      if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) {
        expiring30 += tx.amount
      }
    }
    
    balance.expiringAmount = expiring
    balance.expiringWithin30Days = expiring30
    balance.total = balance.available + balance.locked
    balance.lastUpdated = new Date().toISOString()
    
    balances.set(userId, balance)
  }

  // ─── Public API ────────────────────────────────────────────────────────

  /**
   * Initialize a user's credit account
   */
  async function initializeUser(options: InitializeUserOptions): Promise<UserBalance> {
    const balance = getOrCreateBalance(options.userId)
    
    if (options.initialCredits && options.initialCredits > 0) {
      const tx: CreditTransaction = {
        id: randomUUID(),
        userId: options.userId,
        type: 'grant',
        amount: options.initialCredits,
        balanceBefore: balance.available,
        balanceAfter: balance.available + options.initialCredits,
        reason: 'initial_credits',
        expiresAt: options.expiresAt?.toISOString(),
        createdAt: new Date().toISOString(),
      }
      
      addTransaction(tx)
      balance.available += options.initialCredits
    }
    
    updateBalance(options.userId, balance)
    return balance
  }

  /**
   * Grant credits to a user
   */
  async function grant(options: GrantOptions): Promise<GrantResult> {
    const balance = getOrCreateBalance(options.userId)
    
    const tx: CreditTransaction = {
      id: randomUUID(),
      userId: options.userId,
      type: 'grant',
      amount: options.amount,
      balanceBefore: balance.available,
      balanceAfter: balance.available + options.amount,
      reason: options.reason,
      expiresAt: options.expiresAt?.toISOString(),
      metadata: options.metadata,
      createdAt: new Date().toISOString(),
    }
    
    addTransaction(tx)
    balance.available += options.amount
    
    updateBalance(options.userId, balance)
    
    return {
      success: true,
      transaction: tx,
      newBalance: balance.available,
    }
  }

  /**
   * Deduct credits from a user
   */
  async function deduct(options: DeductOptions): Promise<DeductResult> {
    const balance = getOrCreateBalance(options.userId)
    
    if (!options.allowNegative && balance.available < options.amount) {
      return {
        success: false,
        error: 'Insufficient balance',
      }
    }
    
    const tx: CreditTransaction = {
      id: randomUUID(),
      userId: options.userId,
      type: 'deduct',
      amount: options.amount,
      balanceBefore: balance.available,
      balanceAfter: balance.available - options.amount,
      reason: options.reason,
      metadata: options.metadata,
      createdAt: new Date().toISOString(),
    }
    
    addTransaction(tx)
    balance.available -= options.amount
    
    updateBalance(options.userId, balance)
    
    return {
      success: true,
      transaction: tx,
      newBalance: balance.available,
    }
  }

  /**
   * Lock credits for pending transactions
   */
  async function lockCredits(options: LockCreditsOptions): Promise<GrantResult> {
    const balance = getOrCreateBalance(options.userId)
    
    if (balance.available < options.amount) {
      return {
        success: false,
        transaction: {} as CreditTransaction,
        newBalance: balance.available,
      }
    }
    
    const tx: CreditTransaction = {
      id: randomUUID(),
      userId: options.userId,
      type: 'lock',
      amount: options.amount,
      balanceBefore: balance.available,
      balanceAfter: balance.available - options.amount,
      reason: options.reason,
      metadata: options.metadata,
      createdAt: new Date().toISOString(),
    }
    
    addTransaction(tx)
    lockedTransactions.set(tx.id, tx)
    balance.available -= options.amount
    balance.locked += options.amount
    
    updateBalance(options.userId, balance)
    
    return {
      success: true,
      transaction: tx,
      newBalance: balance.available,
    }
  }

  /**
   * Unlock previously locked credits
   */
  async function unlockCredits(options: UnlockCreditsOptions): Promise<GrantResult> {
    const lockedTx = lockedTransactions.get(options.transactionId)
    if (!lockedTx) {
      return { success: false, transaction: {} as CreditTransaction, newBalance: 0 }
    }
    
    const balance = getOrCreateBalance(options.userId)
    
    const unlockTx: CreditTransaction = {
      id: randomUUID(),
      userId: options.userId,
      type: 'unlock',
      amount: lockedTx.amount,
      balanceBefore: balance.available,
      balanceAfter: balance.available + lockedTx.amount,
      reason: 'unlock_locked',
      metadata: { lockedTransactionId: lockedTx.id },
      createdAt: new Date().toISOString(),
    }
    
    addTransaction(unlockTx)
    lockedTransactions.delete(options.transactionId)
    balance.available += lockedTx.amount
    balance.locked -= lockedTx.amount
    
    updateBalance(options.userId, balance)
    
    return {
      success: true,
      transaction: unlockTx,
      newBalance: balance.available,
    }
  }

  /**
   * Convert credits to currency
   */
  async function convertCredits(options: ConvertCreditsOptions): Promise<ConvertResult> {
    const balance = getOrCreateBalance(options.userId)
    
    if (balance.available < options.amount) {
      throw new Error('Insufficient balance')
    }
    
    const currencyAmount = options.amount / options.rate
    
    const deductTx: CreditTransaction = {
      id: randomUUID(),
      userId: options.userId,
      type: 'convert',
      amount: options.amount,
      balanceBefore: balance.available,
      balanceAfter: balance.available - options.amount,
      reason: options.reason,
      metadata: { ...options.metadata, rate: options.rate, currencyAmount },
      createdAt: new Date().toISOString(),
    }
    
    addTransaction(deductTx)
    balance.available -= options.amount
    
    updateBalance(options.userId, balance)
    
    return {
      success: true,
      creditsUsed: options.amount,
      currencyAmount,
      transaction: deductTx,
    }
  }

  /**
   * Get user's current balance
   */
  async function getBalance(userId: string): Promise<UserBalance> {
    return getOrCreateBalance(userId)
  }

  /**
   * Get transaction history
   */
  async function getTransactions(
    options: GetTransactionsOptions
  ): Promise<TransactionsResult> {
    const userTxs = (userTransactionIndex.get(options.userId) ?? [])
      .map((id) => transactions.get(id))
      .filter((tx): tx is CreditTransaction => tx != null)
      .filter((tx) => {
        if (options.type && tx.type !== options.type) return false
        if (options.reason && !tx.reason.includes(options.reason)) return false
        if (options.startDate && new Date(tx.createdAt) < options.startDate) return false
        if (options.endDate && new Date(tx.createdAt) > options.endDate) return false
        return true
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    
    const total = userTxs.length
    const limit = options.limit ?? 20
    const offset = options.offset ?? 0
    
    return {
      items: userTxs.slice(offset, offset + limit),
      total,
      hasMore: offset + limit < total,
    }
  }

  /**
   * Expire credits that have passed their expiry date
   */
  async function expireCredits(): Promise<number> {
    const now = new Date()
    let expiredCount = 0
    
    for (const [userId, balance] of balances) {
      const userTxs = (userTransactionIndex.get(userId) ?? [])
        .map((id) => transactions.get(id))
        .filter((tx): tx is CreditTransaction => 
          tx != null && tx.type === 'grant' && tx.expiresAt != null
        )
      
      for (const tx of userTxs) {
        if (new Date(tx.expiresAt!) < now && !tx.expiredAt) {
          tx.expiredAt = now.toISOString()
          
          const expireTx: CreditTransaction = {
            id: randomUUID(),
            userId,
            type: 'expire',
            amount: tx.amount,
            balanceBefore: balance.available,
            balanceAfter: balance.available - tx.amount,
            reason: 'credit_expired',
            metadata: { expiredTransactionId: tx.id },
            createdAt: now.toISOString(),
          }
          
          addTransaction(expireTx)
          balance.available -= tx.amount
          expiredCount++
        }
      }
      
      updateBalance(userId, balance)
    }
    
    return expiredCount
  }

  return {
    initializeUser,
    grant,
    deduct,
    lockCredits,
    unlockCredits,
    convertCredits,
    getBalance,
    getTransactions,
    expireCredits,
  }
}

export type CreditsSystem = ReturnType<typeof createCreditsSystem>
