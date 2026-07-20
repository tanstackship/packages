/**
 * Hreflang utilities for SEO
 */

import type { SupportedLocale } from './detect'

export interface HreflangLink {
  locale: SupportedLocale
  href: string
  hreflang: string
}

export interface HreflangOptions {
  baseUrl: string
  path: string
  defaultLocale: SupportedLocale
}

/**
 * Build hreflang tags for all locales
 * 
 * @example
 * ```typescript
 * const tags = buildHreflangTags({
 *   baseUrl: 'https://example.com',
 *   path: '/blog/post',
 *   defaultLocale: 'en',
 * })
 * 
 * // Returns:
 * // [
 * //   { locale: 'en', href: 'https://example.com/blog/post', hreflang: 'en' },
 * //   { locale: 'zh', href: 'https://example.com/zh/blog/post', hreflang: 'zh' },
 * //   { locale: 'de', href: 'https://example.com/de/blog/post', hreflang: 'de' },
 * // ]
 * ```
 */
export function buildHreflangTags(options: HreflangOptions): HreflangLink[] {
  const { baseUrl, path, defaultLocale } = options
  const locales: SupportedLocale[] = ['en', 'zh', 'de']
  
  return locales.map(locale => {
    // Remove any existing locale prefix from path
    let cleanPath = path
    for (const loc of locales) {
      if (cleanPath.startsWith(`/${loc}/`)) {
        cleanPath = cleanPath.slice(3)
        break
      }
      if (cleanPath === `/${loc}`) {
        cleanPath = '/'
        break
      }
    }
    
    // Build href
    const href = locale === defaultLocale
      ? `${baseUrl}${cleanPath}`
      : `${baseUrl}/${locale}${cleanPath === '/' ? '' : cleanPath}`
    
    // Determine hreflang
    const hreflang = locale === defaultLocale ? 'x-default' : locale
    
    return { locale, href, hreflang }
  })
}

/**
 * Build hreflang <link> HTML tags
 */
export function buildHreflangHtml(options: HreflangOptions): string {
  const tags = buildHreflangTags(options)
  
  return tags
    .map(({ href, hreflang }) => 
      `<link rel="alternate" hreflang="${hreflang}" href="${href}" />`
    )
    .join('\n')
}

/**
 * Build hreflang in sitemap format
 */
export function buildHreflangSitemap(urls: { locale: SupportedLocale; url: string }[]): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n'
  xml += '  xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'
  
  // Group by canonical URL
  const grouped = new Map<string, typeof urls>()
  
  for (const item of urls) {
    // Extract canonical URL (without locale prefix)
    const url = item.url
    const parts = url.split('/')
    const baseUrl = `${parts[0]}//${parts[2]}`
    const path = parts.slice(3).join('/')
    
    const key = `${baseUrl}/${path}`
    if (!grouped.has(key)) {
      grouped.set(key, [])
    }
    grouped.get(key)!.push(item)
  }
  
  for (const [canonicalUrl, localeItems] of grouped) {
    xml += '  <url>\n'
    xml += `    <loc>${canonicalUrl}</loc>\n`
    
    for (const { locale, url } of localeItems) {
      const hreflang = locale === 'en' ? 'x-default' : locale
      xml += `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${url}" />\n`
    }
    
    xml += '  </url>\n'
  }
  
  xml += '</urlset>'
  
  return xml
}

/**
 * Get language label
 */
export function getLanguageLabel(locale: SupportedLocale): string {
  const labels: Record<SupportedLocale, string> = {
    en: 'English',
    zh: '中文',
    de: 'Deutsch',
  }
  return labels[locale]
}

/**
 * Get locale flag emoji
 */
export function getLocaleFlag(locale: SupportedLocale): string {
  const flags: Record<SupportedLocale, string> = {
    en: '🇺🇸',
    zh: '🇨🇳',
    de: '🇩🇪',
  }
  return flags[locale]
}
