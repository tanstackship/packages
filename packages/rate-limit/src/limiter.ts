/**
 * Rate limiting middleware
 */

export interface RateLimitConfig {
  /** Maximum requests per window */
  limit: number
  /** Window size in milliseconds */
  windowMs: number
  /** Key generator function */
  keyGenerator?: (request: RateLimitRequest) => string
  /** Skip failed requests */
  skipFailedRequests?: boolean
  /** Skip successful requests */
  skipSuccessfulRequests?: boolean
  /** Custom handler for rate limited requests */
  handler?: (request: RateLimitRequest) => Response | Promise<Response>
  /** Custom handler for missing rate limit info */
  missedHandler?: () => void
}

export interface RateLimitRequest {
  ip?: string
  headers?: Record<string, string>
  url?: string
}

export interface RateLimitInfo {
  limit: number
  current: number
  remaining: number
  resetTime: number
}

/**
 * In-memory rate limit store
 */
class MemoryStore {
  private store = new Map<string, { count: number; resetTime: number }>()
  
  async increment(key: string, windowMs: number): Promise<number> {
    const now = Date.now()
    const record = this.store.get(key)
    
    if (!record || record.resetTime <= now) {
      // Create new record
      const resetTime = now + windowMs
      this.store.set(key, { count: 1, resetTime })
      return 1
    }
    
    // Increment existing
    record.count++
    return record.count
  }
  
  async decrement(key: string): Promise<void> {
    const record = this.store.get(key)
    if (record && record.count > 0) {
      record.count--
    }
  }
  
  async resetKey(key: string): Promise<void> {
    this.store.delete(key)
  }
  
  async get(key: string): Promise<{ count: number; resetTime: number } | null> {
    return this.store.get(key) ?? null
  }
  
  async getLimit(key: string, limit: number, windowMs: number): Promise<RateLimitInfo> {
    const now = Date.now()
    const record = this.store.get(key)
    
    if (!record || record.resetTime <= now) {
      return {
        limit,
        current: 0,
        remaining: limit,
        resetTime: now + windowMs,
      }
    }
    
    return {
      limit,
      current: record.count,
      remaining: Math.max(0, limit - record.count),
      resetTime: record.resetTime,
    }
  }
  
  // Cleanup expired entries periodically
  startCleanup(intervalMs: number = 60000): void {
    setInterval(() => {
      const now = Date.now()
      for (const [key, record] of this.store) {
        if (record.resetTime <= now) {
          this.store.delete(key)
        }
      }
    }, intervalMs)
  }
}

// Default store
const defaultStore = new MemoryStore()

/**
 * Create rate limiter middleware
 * 
 * @example
 * ```typescript
 * const limiter = createRateLimiter({
 *   limit: 100,
 *   windowMs: 60 * 1000, // 1 minute
 * })
 * 
 * // In request handler
 * const result = await limiter.check(request)
 * if (result.limited) {
 *   return new Response('Too Many Requests', { status: 429 })
 * }
 * ```
 */
export function createRateLimiter(config: RateLimitConfig) {
  const {
    limit,
    windowMs,
    keyGenerator = (req) => req.ip ?? 'anonymous',
    handler,
    skipFailedRequests = false,
    skipSuccessfulRequests = false,
  } = config
  
  const store = defaultStore
  
  /**
   * Check rate limit for a request
   */
  async function check(request: RateLimitRequest): Promise<{
    limited: boolean
    info: RateLimitInfo
  }> {
    const key = keyGenerator(request)
    const current = await store.increment(key, windowMs)
    
    const info: RateLimitInfo = {
      limit,
      current,
      remaining: Math.max(0, limit - current),
      resetTime: Date.now() + windowMs,
    }
    
    if (current > limit) {
      if (handler) {
        await handler(request)
      }
      return { limited: true, info }
    }
    
    return { limited: false, info }
  }
  
  /**
   * Record a request result (for skip options)
   */
  async function recordRequest(
    request: RateLimitRequest,
    status: number
  ): Promise<void> {
    const key = keyGenerator(request)
    
    if (skipFailedRequests && status >= 400) {
      // Don't count failed requests
      await store.decrement(key)
    }
    
    if (skipSuccessfulRequests && status < 400) {
      // Don't count successful requests
      await store.decrement(key)
    }
  }
  
  /**
   * Reset rate limit for a key
   */
  async function reset(request: RateLimitRequest): Promise<void> {
    const key = keyGenerator(request)
    await store.resetKey(key)
  }
  
  /**
   * Get current rate limit info
   */
  async function getInfo(request: RateLimitRequest): Promise<RateLimitInfo> {
    const key = keyGenerator(request)
    return store.getLimit(key, limit, windowMs)
  }
  
  /**
   * Add rate limit headers to response
   */
  function addHeaders(response: Response, info: RateLimitInfo): Response {
    const headers = new Headers(response.headers)
    headers.set('X-RateLimit-Limit', String(info.limit))
    headers.set('X-RateLimit-Remaining', String(info.remaining))
    headers.set('X-RateLimit-Reset', String(Math.floor(info.resetTime / 1000)))
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    })
  }
  
  return {
    check,
    recordRequest,
    reset,
    getInfo,
    addHeaders,
    config,
  }
}

export type { RateLimiter } from './types'
