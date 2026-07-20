/**
 * Language detection utilities
 */

export type Locale = string

export interface DetectedLocale {
  locale: Locale
  confidence: number
  source: 'url' | 'cookie' | 'header' | 'default'
}

/**
 * Supported locales
 */
export const SUPPORTED_LOCALES = ['en', 'zh', 'de'] as const

export type SupportedLocale = typeof SUPPORTED_LOCALES[number]

/**
 * Default locale
 */
export const DEFAULT_LOCALE: SupportedLocale = 'en'

/**
 * Detect locale from URL
 * 
 * @example
 * ```typescript
 * // URL: /zh/blog/post
 * const locale = detectLocaleFromUrl()
 * // { locale: 'zh', confidence: 1, source: 'url' }
 * ```
 */
export function detectLocaleFromUrl(): DetectedLocale | null {
  if (typeof window === 'undefined') return null
  
  const path = window.location.pathname
  const segments = path.split('/').filter(Boolean)
  
  if (segments.length > 0) {
    const first = segments[0]
    if (SUPPORTED_LOCALES.includes(first as SupportedLocale)) {
      return {
        locale: first,
        confidence: 1,
        source: 'url',
      }
    }
  }
  
  return null
}

/**
 * Detect locale from cookie
 * 
 * @example
 * ```typescript
 * const locale = detectLocaleFromCookie()
 * // { locale: 'en', confidence: 0.9, source: 'cookie' }
 * ```
 */
export function detectLocaleFromCookie(): DetectedLocale | null {
  if (typeof document === 'undefined') return null
  
  const match = document.cookie
    .split('; ')
    .find(row => row.startsWith('locale='))
  
  if (match) {
    const value = match.split('=')[1]
    if (SUPPORTED_LOCALES.includes(value as SupportedLocale)) {
      return {
        locale: value,
        confidence: 0.9,
        source: 'cookie',
      }
    }
  }
  
  return null
}

/**
 * Detect locale from Accept-Language header
 */
export function detectLocaleFromHeader(header: string): DetectedLocale | null {
  const languages = header
    .split(',')
    .map(part => {
      const [lang, qStr] = part.trim().split(';q=')
      const q = qStr ? parseFloat(qStr) : 1
      return { lang: lang.split('-')[0], q }
    })
    .sort((a, b) => b.q - a.q)
  
  for (const { lang } of languages) {
    if (SUPPORTED_LOCALES.includes(lang as SupportedLocale)) {
      return {
        locale: lang,
        confidence: 1,
        source: 'header',
      }
    }
  }
  
  return null
}

/**
 * Detect locale (combined)
 * 
 * Priority: URL > Cookie > Header > Default
 */
export function detectLocale(): DetectedLocale {
  // Try URL first
  const fromUrl = detectLocaleFromUrl()
  if (fromUrl) return fromUrl
  
  // Try cookie
  const fromCookie = detectLocaleFromCookie()
  if (fromCookie) return fromCookie
  
  // Try browser language
  if (typeof navigator !== 'undefined' && navigator.language) {
    const lang = navigator.language.split('-')[0]
    if (SUPPORTED_LOCALES.includes(lang as SupportedLocale)) {
      return {
        locale: lang,
        confidence: 0.8,
        source: 'default',
      }
    }
  }
  
  // Default
  return {
    locale: DEFAULT_LOCALE,
    confidence: 0.5,
    source: 'default',
  }
}

/**
 * Get locale from URL path
 */
export function getLocaleFromPath(path: string): SupportedLocale | null {
  const segments = path.split('/').filter(Boolean)
  if (segments.length > 0) {
    const first = segments[0]
    if (SUPPORTED_LOCALES.includes(first as SupportedLocale)) {
      return first as SupportedLocale
    }
  }
  return null
}

/**
 * Set locale cookie
 */
export function setLocaleCookie(locale: SupportedLocale, maxAge: number = 60 * 60 * 24 * 365): void {
  if (typeof document === 'undefined') return
  
  document.cookie = [
    `locale=${locale}`,
    `max-age=${maxAge}`,
    'path=/',
    'SameSite=Lax',
  ].join('; ')
}

/**
 * Get locale from cookie
 */
export function getLocaleFromCookie(): SupportedLocale | null {
  if (typeof document === 'undefined') return null
  
  const match = document.cookie
    .split('; ')
    .find(row => row.startsWith('locale='))
  
  if (match) {
    const value = match.split('=')[1]
    if (SUPPORTED_LOCALES.includes(value as SupportedLocale)) {
      return value as SupportedLocale
    }
  }
  
  return null
}
