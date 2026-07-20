/**
 * @tanstackship/short-link
 * 
 * Short link & URL tracking system with UTM integration.
 * 
 * @example
 * ```typescript
 * import { 
 *   createShortLink, 
 *   buildShortLinkUrl,
 *   buildSiteShortLinkUrl 
 * } from '@tanstackship/short-link'
 * 
 * // Create a short link
 * const { shortLink, created } = await findOrCreateShortLink({
 *   target: 'https://example.com/landing-page',
 *   utm: { source: 'twitter', campaign: 'launch' }
 * })
 * 
 * // Build the short URL
 * const url = buildShortLinkUrl(shortLink.slug)
 * // https://go.tanstackship.com/abc123
 * ```
 */

// Re-export all public APIs
export type {
  ShortLink,
  ShortLinkUtm,
  ShortLinkVariant,
  CreateShortLinkInput,
  UpdateShortLinkInput,
  FindOrCreateResult,
} from './types'

export {
  buildSiteShortLinkUrl,
  buildExternalShortLinkUrl,
  buildShortLinkUrl,
  captureShortLink,
  copyToClipboard,
} from './short-link-client'

export {
  createShortLink,
  getShortLink,
  updateShortLink,
  deleteShortLink,
  listShortLinks,
  findOrCreateShortLink,
  buildFingerprint,
  generateSlug,
  appendLinkIdToTarget,
  extractLinkIdFromUrl,
  createShortLinkSchema,
  updateShortLinkSchema,
} from './short-link-server'
