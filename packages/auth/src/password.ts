/**
 * @tanstackship/auth
 * 
 * Authentication utilities for web apps.
 * Cookie-based sessions, password hashing, and OAuth helpers.
 */

/**
 * Hash a password using Web Crypto API (browser) or Node.js crypto
 * 
 * @example
 * ```typescript
 * const hash = await hashPassword('my-secret-password')
 * const isValid = await verifyPassword('my-secret-password', hash)
 * ```
 */

/**
 * Hash a password
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hash = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hash))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password)
  return passwordHash === hash
}

/**
 * Generate a random token
 */
export function generateToken(length: number = 32): string {
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  return Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Generate a session ID
 */
export function generateSessionId(): string {
  return generateToken(32)
}

/**
 * Cookie options for sessions
 */
export interface CookieOptions {
  name: string
  value: string
  maxAge?: number
  path?: string
  domain?: string
  secure?: boolean
  httpOnly?: boolean
  sameSite?: 'Strict' | 'Lax' | 'None'
}

/**
 * Build a cookie string
 */
export function buildCookie(options: CookieOptions): string {
  const parts: string[] = [`${options.name}=${options.value}`]
  
  if (options.maxAge !== undefined) {
    parts.push(`Max-Age=${options.maxAge}`)
  }
  
  if (options.path) {
    parts.push(`Path=${options.path}`)
  }
  
  if (options.domain) {
    parts.push(`Domain=${options.domain}`)
  }
  
  if (options.secure) {
    parts.push('Secure')
  }
  
  if (options.httpOnly) {
    parts.push('HttpOnly')
  }
  
  if (options.sameSite) {
    parts.push(`SameSite=${options.sameSite}`)
  }
  
  return parts.join('; ')
}

/**
 * Parse cookies from header
 */
export function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {}
  
  for (const part of cookieHeader.split(';')) {
    const [key, ...valueParts] = part.trim().split('=')
    if (key) {
      cookies[key] = decodeURIComponent(valueParts.join('='))
    }
  }
  
  return cookies
}

/**
 * Session data structure
 */
export interface Session {
  id: string
  userId: string
  createdAt: string
  expiresAt: string
  data?: Record<string, unknown>
}

/**
 * Create a session
 */
export function createSession(userId: string, expiresInSeconds: number = 60 * 60 * 24 * 7): Session {
  const now = new Date()
  const expiresAt = new Date(now.getTime() + expiresInSeconds * 1000)
  
  return {
    id: generateSessionId(),
    userId,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  }
}

/**
 * Check if session is expired
 */
export function isSessionExpired(session: Session): boolean {
  return new Date(session.expiresAt) < new Date()
}

/**
 * Simple in-memory session store (for Node.js)
 */
const sessions = new Map<string, Session>()

/**
 * Store a session
 */
export function storeSession(session: Session): void {
  sessions.set(session.id, session)
}

/**
 * Get a session
 */
export function getSession(id: string): Session | null {
  const session = sessions.get(id) ?? null
  if (session && !isSessionExpired(session)) {
    return session
  }
  if (session) {
    sessions.delete(id)
  }
  return null
}

/**
 * Delete a session
 */
export function deleteSession(id: string): void {
  sessions.delete(id)
}

/**
 * Clean up expired sessions
 */
export function cleanupExpiredSessions(): number {
  let cleaned = 0
  for (const [id, session] of sessions) {
    if (isSessionExpired(session)) {
      sessions.delete(id)
      cleaned++
    }
  }
  return cleaned
}
