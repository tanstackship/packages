/**
 * @tanstackship/auth
 * 
 * Authentication utilities for web apps.
 * 
 * @example
 * ```typescript
 * import { 
 *   hashPassword, 
 *   verifyPassword,
 *   createSession,
 *   buildCookie 
 * } from '@tanstackship/auth'
 * 
 * // Hash and verify passwords
 * const hash = await hashPassword('my-password')
 * const valid = await verifyPassword('my-password', hash)
 * 
 * // Create sessions
 * const session = createSession('user-123')
 * const cookie = buildCookie({
 *   name: 'session',
 *   value: session.id,
 *   maxAge: 60 * 60 * 24 * 7,
 *   httpOnly: true,
 * })
 * ```
 */

// Password utilities
export { hashPassword, verifyPassword, generateToken, generateSessionId } from './password'

// Cookie utilities
export { 
  buildCookie, 
  parseCookies, 
  type CookieOptions 
} from './password'

// Session utilities
export { 
  createSession, 
  isSessionExpired, 
  storeSession, 
  getSession, 
  deleteSession,
  cleanupExpiredSessions,
  type Session 
} from './password'
