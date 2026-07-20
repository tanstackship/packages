/**
 * @tanstackship/utm-tracker
 * 
 * UTM tracking & attribution system for web apps.
 * 
 * @example
 * ```typescript
 * import { captureUtmFromUrl, writeUtmCookie, readUtmCookie } from '@tanstackship/utm-tracker'
 * 
 * // Capture UTM params on page load
 * const utm = captureUtmFromUrl()
 * if (utm) {
 *   writeUtmCookie(utm)
 * }
 * ```
 */

export type {
  UtmData,
  UtmAttributionParams,
  UtmAttributionSnake,
} from './types'

export {
  captureUtmFromUrl,
  readUtmCookie,
  writeUtmCookie,
  clearUtmCookie,
} from './client'

export {
  normalizeUtmAttribution,
  parseUtmCookieFromHeader,
  resolveCheckoutUtmAttribution,
  toStripeUtmMetadata,
  fromStripeMetadata,
  utmAttributionToDbColumns,
} from './server'

export {
  SOURCE_OPTIONS,
  MEDIUM_OPTIONS,
  CAMPAIGN_OPTIONS,
  type UtmSource,
  type UtmMedium,
  type UtmCampaign,
} from './constants'

export {
  UTM_COOKIE_NAME,
  UTM_COOKIE_MAX_AGE,
} from './constants'
