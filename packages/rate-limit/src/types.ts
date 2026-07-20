/**
 * Rate limit types
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
 * Rate limiter instance
 */
export interface RateLimiter {
  check: (request: RateLimitRequest) => Promise<{
    limited: boolean
    info: RateLimitInfo
  }>
  recordRequest: (request: RateLimitRequest, status: number) => Promise<void>
  reset: (request: RateLimitRequest) => Promise<void>
  getInfo: (request: RateLimitRequest) => Promise<RateLimitInfo>
  addHeaders: (response: Response, info: RateLimitInfo) => Response
  config: RateLimitConfig
}
