/**
 * Credits System Implementation
 */

export interface CreditTransaction {
  id: string
  userId: string
  type: 'grant' | 'deduct' | 'lock' | 'unlock' | 'convert' | 'expire' | 'refund'
  amount: number
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
  available: number
  locked: number
  total: number
  expiringAmount: number
  expiringWithin30Days: number
  lastUpdated: string
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

export interface CreditsConfig {
  currency: string
  defaultBalance?: number
  enableExpiry?: boolean
  autoExpireDays?: number
}

export function createCreditsSystem(config: CreditsConfig = { currency: 'USD' }) {
  const balances = new Map<string, UserBalance>()
  const transactions = new Map<string, CreditTransaction>()
  const userTransactionIndex = new Map<string, string[]>()
  

  function getOrCreateBalance(userId: string): UserBalance {
    let balance = balances.get(userId)
    if (!balance) {
      balance = {
        userId,
        available: config.defaultBalance ?? 0,
        locked: 0,
        total: config.defaultBalance ?? 0,
        expiringAmount: 0,
        expiringWithin30Days: 0,
        lastUpdated: new Date().toISOString(),
      }
      balances.set(userId, balance)
    }
    return balance
  }

  function addTransaction(tx: CreditTransaction): void {
    transactions.set(tx.id, tx)
    const userTxs = userTransactionIndex.get(tx.userId) ?? []
    userTxs.push(tx.id)
    userTransactionIndex.set(tx.userId, userTxs)
  }

  function updateBalance(userId: string, balance: UserBalance): void {
    balance.total = balance.available + balance.locked
    balance.lastUpdated = new Date().toISOString()
    balances.set(userId, balance)
  }

  return {
    async initializeUser(options: { userId: string; initialCredits?: number }): Promise<UserBalance> {
      const balance = getOrCreateBalance(options.userId)
      if (options.initialCredits && options.initialCredits > 0) {
        const tx: CreditTransaction = {
          id: Math.random().toString(36).substring(7),
          userId: options.userId,
          type: 'grant',
          amount: options.initialCredits,
          balanceBefore: balance.available,
          balanceAfter: balance.available + options.initialCredits,
          reason: 'initial_credits',
          createdAt: new Date().toISOString(),
        }
        addTransaction(tx)
        balance.available += options.initialCredits
      }
      updateBalance(options.userId, balance)
      return balance
    },

    async grant(options: GrantOptions): Promise<{ success: boolean; transaction: CreditTransaction; newBalance: number }> {
      const balance = getOrCreateBalance(options.userId)
      const tx: CreditTransaction = {
        id: Math.random().toString(36).substring(7),
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
      return { success: true, transaction: tx, newBalance: balance.available }
    },

    async deduct(options: DeductOptions): Promise<{ success: boolean; transaction?: CreditTransaction; newBalance?: number; error?: string }> {
      const balance = getOrCreateBalance(options.userId)
      if (!options.allowNegative && balance.available < options.amount) {
        return { success: false, error: 'Insufficient balance' }
      }
      const tx: CreditTransaction = {
        id: Math.random().toString(36).substring(7),
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
      return { success: true, transaction: tx, newBalance: balance.available }
    },

    async getBalance(userId: string): Promise<UserBalance> {
      return getOrCreateBalance(userId)
    },

    async getTransactions(options: { userId: string; limit?: number }): Promise<{ items: CreditTransaction[]; total: number }> {
      const userTxs = (userTransactionIndex.get(options.userId) ?? [])
        .map((id) => transactions.get(id))
        .filter((tx): tx is CreditTransaction => tx != null)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      const limit = options.limit ?? 20
      return { items: userTxs.slice(0, limit), total: userTxs.length }
    },
  }
}
