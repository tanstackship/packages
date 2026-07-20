/**
 * Client-side short link utilities
 */

import type { ShortLink } from './types'

/**
 * Build short link URL for site KV
 */
export function buildSiteShortLinkUrl(slug: string): string {
  if (typeof window === 'undefined') {
    return `https://tanstackship.com/s/${slug}`
  }
  return `${window.location.origin}/s/${slug}`
}

/**
 * Build short link URL for external service (go.*)
 */
export function buildExternalShortLinkUrl(slug: string): string {
  return `https://go.tanstackship.com/${slug}`
}

/**
 * Build short link URL (auto-detect which to use)
 */
export function buildShortLinkUrl(slug: string): string {
  // Default to external URL
  return buildExternalShortLinkUrl(slug)
}

/**
 * Capture short link data from current URL
 * 
 * Extracts the slug from URLs like:
 * - https://example.com/s/abc123
 * - https://go.tanstackship.com/abc123
 * 
 * @returns The slug if found, null otherwise
 */
export function captureShortLink(): string | null {
  if (typeof window === 'undefined') return null

  const url = new URL(window.location.href)
  const pathname = url.pathname

  // Match /s/{slug} pattern
  const siteMatch = pathname.match(/^\/s\/([a-zA-Z0-9]+)$/)
  if (siteMatch) {
    return siteMatch[1]
  }

  // Match /{slug} pattern for go.* domain
  if (url.hostname.startsWith('go.')) {
    const slug = pathname.slice(1)
    if (slug && /^[a-zA-Z0-9]+$/.test(slug)) {
      return slug
    }
  }

  return null
}

/**
 * Copy short link to clipboard
 * 
 * @example
 * ```typescript
 * const url = buildShortLinkUrl('abc123')
 * await copyToClipboard(url)
 * ```
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    try {
      document.execCommand('copy')
      return true
    } finally {
      document.body.removeChild(textarea)
    }
  }
}
