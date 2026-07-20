/**
 * @tanstackship/rate-limit
 * 
 * Rate limiting middleware for web apps.
 * In-memory and KV-based rate limiting with configurable windows.
 * 
 * @example
 * ```typescript
 * import { createRateLimiter } from '@tanstackship/rate-limit'
 * 
 * const limiter = createRateLimiter({
 *   limit: 100,
 *   windowMs: 60 * 1000, // 1 minute
 * })
 * 
 * // Check request
 * const { limited, info } = await limiter.check({ ip: '192.168.1.1' })
 * if (limited) {
 *   return new Response('Too Many Requests', { 
 *     status: 429,
 *     headers: {
 *       'X-RateLimit-Limit': String(info.limit),
 *       'X-RateLimit-Remaining': String(info.remaining),
 *     }
 *   })
 * }
 * ```
 */

// Types
export type {
  RateLimitConfig,
  RateLimitRequest,
  RateLimitInfo,
  RateLimiter,
} from './types'

// Main function
export { createRateLimiter } from './limiter'
