/**
 * @tanstackship/short-link
 * Short link & URL tracking system with UTM integration
 */

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
} from './short-link-client'

export {
  createShortLink,
  getShortLink,
  updateShortLink,
  deleteShortLink,
  listShortLinks,
  findOrCreateShortLink,
} from './short-link-server'
