/**
 * UTM Data Types
 */

/** Standard UTM parameters */
export const UTM_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
] as const

export type UtmParam = (typeof UTM_PARAMS)[number]

/**
 * UTM data structure for client-side capture
 */
export interface UtmData {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  referrer?: string
  first_visit_at?: string
  /** 原始非标参数名（用于调试和分析） */
  _raw_ref_param?: string
}

/**
 * UTM attribution shape with camelCase keys (internal use)
 */
export type UtmAttributionParams = {
  utmSource?: string | null
  utmMedium?: string | null
  utmCampaign?: string | null
  utmTerm?: string | null
  utmContent?: string | null
  referrer?: string | null
}

/**
 * UTM attribution shape with snake_case keys (for API/database)
 */
export type UtmAttributionSnake = {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  referrer?: string
}
