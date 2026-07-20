/**
 * @tanstackship/i18n
 * 
 * Internationalization utilities for web apps.
 * Language detection, hreflang helpers, and locale management.
 * 
 * @example
 * ```typescript
 * import { 
 *   detectLocale, 
 *   setLocaleCookie,
 *   buildHreflangTags 
 * } from '@tanstackship/i18n'
 * 
 * // Detect user's locale
 * const { locale, source } = detectLocale()
 * 
 * // Set locale preference
 * setLocaleCookie('zh')
 * 
 * // Build hreflang for SEO
 * const tags = buildHreflangTags({
 *   baseUrl: 'https://example.com',
 *   path: '/blog/post',
 *   defaultLocale: 'en',
 * })
 * ```
 */

// Detection
export {
  detectLocale,
  detectLocaleFromUrl,
  detectLocaleFromCookie,
  detectLocaleFromHeader,
  getLocaleFromPath,
  setLocaleCookie,
  getLocaleFromCookie,
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  type DetectedLocale,
  type SupportedLocale,
} from './detect'

// Hreflang
export {
  buildHreflangTags,
  buildHreflangHtml,
  buildHreflangSitemap,
  getLanguageLabel,
  getLocaleFlag,
  type HreflangLink,
  type HreflangOptions,
} from './hreflang'
