/**
 * Client-side UTM capture module
 * 
 * Captures UTM parameters from URL on first visit, stores in cookie,
 * and provides the data to auth flows on signup.
 */

import type { UtmData } from './types'

export const UTM_COOKIE_NAME = '_utm'
export const UTM_COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

const UTM_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
] as const

/**
 * 非标参数 → utm_source 映射表
 * 优先级：标准 UTM > 非标参数（按数组顺序，先匹配先生效）
 */
const NON_STANDARD_SOURCE_PARAMS = [
  'ref',        // Product Hunt, BetaList, StartupBase 等导航站常用
  'referrer',   // 推荐人
  'refer',      // 推荐
  'source',     // 简化来源（最常见）
  'via',        // Twitter, LinkedIn 等社交媒体常用
  'from',       // 来自
  'origin',     // 来源
  'src',        // 来源缩写（Hacker News 等）
  'channel',    // 渠道
  'aff',        // 联盟营销（affiliate）
  'affiliate',  // 联盟营销
  'partner',    // 合作伙伴
] as const

/**
 * 平台特定点击 ID → utm_source 映射表
 */
const PLATFORM_CLICK_ID_PARAMS = [
  { param: 'gclid', source: 'google' },
  { param: 'fbclid', source: 'facebook' },
  { param: 'msclkid', source: 'bing' },
  { param: 'ttclid', source: 'tiktok' },
  { param: 'li_fat_id', source: 'linkedin' },
] as const

/**
 * 从 URL 参数中提取非标来源参数值
 */
function extractNonStandardSource(params: URLSearchParams): string | null {
  for (const key of NON_STANDARD_SOURCE_PARAMS) {
    const value = params.get(key)
    if (value) return value
  }
  return null
}

/**
 * 从平台点击 ID 提取来源
 */
function extractPlatformSource(params: URLSearchParams): string | null {
  for (const { param, source } of PLATFORM_CLICK_ID_PARAMS) {
    if (params.get(param)) return source
  }
  return null
}

/**
 * Parse UTM parameters from the current URL.
 * Returns null if no UTM params or non-standard source params are found.
 *
 * 映射策略（优先级从高到低）：
 * 1. 标准 UTM 参数（utm_source, utm_medium, ...）
 * 2. 非标来源参数（ref, source, via, from, ...）→ 映射到 utm_source
 * 3. 平台点击 ID（gclid, fbclid, ...）→ 映射到对应平台名作为 utm_source
 *
 * @example
 * ```typescript
 * // URL: https://example.com/page?utm_source=google&utm_campaign=spring_sale
 * const utm = captureUtmFromUrl()
 * // { utm_source: 'google', utm_campaign: 'spring_sale', ... }
 * ```
 */
export function captureUtmFromUrl(): UtmData | null {
  if (typeof window === 'undefined') return null

  const params = new URLSearchParams(window.location.search)
  const utm: UtmData = {}
  let found = false

  // 1. 优先读取标准 UTM 参数
  for (const key of UTM_PARAMS) {
    const value = params.get(key)
    if (value) {
      utm[key as keyof typeof utm] = value
      found = true
    }
  }

  // 2. 如果没有标准 utm_source，尝试从非标参数映射
  if (!utm.utm_source) {
    const nonStdSource = extractNonStandardSource(params)
    if (nonStdSource) {
      utm.utm_source = nonStdSource
      // 记录原始参数名，便于调试
      for (const key of NON_STANDARD_SOURCE_PARAMS) {
        if (params.get(key) === nonStdSource) {
          utm._raw_ref_param = key
          break
        }
      }
      found = true
    } else {
      // 3. 如果没有非标参数，尝试平台点击 ID
      const platformSource = extractPlatformSource(params)
      if (platformSource) {
        utm.utm_source = platformSource
        found = true
      }
    }
  }

  if (found) {
    utm.referrer = document.referrer || undefined
    utm.first_visit_at = new Date().toISOString()
  }

  return found ? utm : null
}

/**
 * Read UTM data from cookie.
 *
 * @example
 * ```typescript
 * const utm = readUtmCookie()
 * if (utm) {
 *   console.log('User came from:', utm.utm_source)
 * }
 * ```
 */
export function readUtmCookie(): UtmData | null {
  if (typeof document === 'undefined') return null

  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${UTM_COOKIE_NAME}=`))

  if (!match) return null

  try {
    return JSON.parse(decodeURIComponent(match.split('=')[1])) as UtmData
  } catch {
    return null
  }
}

/**
 * Write UTM data to cookie (first-touch: only writes if no cookie exists).
 *
 * @example
 * ```typescript
 * const utm = captureUtmFromUrl()
 * if (utm) {
 *   writeUtmCookie(utm)
 * }
 * ```
 */
export function writeUtmCookie(data: UtmData): void {
  if (typeof document === 'undefined') return

  // First-touch: don't overwrite existing cookie
  if (readUtmCookie()) return

  const encoded = encodeURIComponent(JSON.stringify(data))
  document.cookie = [
    `${UTM_COOKIE_NAME}=${encoded}`,
    `max-age=${UTM_COOKIE_MAX_AGE}`,
    'path=/',
    'SameSite=Lax',
  ].join('; ')
}

/**
 * Clear UTM cookie.
 *
 * @example
 * ```typescript
 * // After successful signup, you might want to clear the UTM cookie
 * clearUtmCookie()
 * ```
 */
export function clearUtmCookie(): void {
  if (typeof document === 'undefined') return
  document.cookie = `${UTM_COOKIE_NAME}=; max-age=0; path=/; SameSite=Lax`
}
