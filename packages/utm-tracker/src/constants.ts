/**
 * UTM Constants & Enums
 * 
 * Shared between client and server for type-safe UTM value validation.
 */

/**
 * 预定义的 UTM Source 选项
 */
export const SOURCE_OPTIONS = [
  'google',
  'facebook',
  'twitter',
  'linkedin',
  'instagram',
  'youtube',
  'newsletter',
  'producthunt',
  'github',
  'reddit',
  'discord',
  'referral',
  'direct',
] as const

export type UtmSource = (typeof SOURCE_OPTIONS)[number]

/**
 * 预定义的 UTM Medium 选项
 */
export const MEDIUM_OPTIONS = [
  'cpc',
  'cpm',
  'cpa',
  'cpl',
  'social',
  'email',
  'organic',
  'referral',
  'display',
  'affiliate',
  'podcast',
  'sms',
  'push',
] as const

export type UtmMedium = (typeof MEDIUM_OPTIONS)[number]

/**
 * 预定义的 UTM Campaign 选项
 */
export const CAMPAIGN_OPTIONS = [
  'launch_2026',
  'spring_promo',
  'summer_sale',
  'early_bird',
  'welcome_offer',
  'referral_program',
  'blog_referral',
  'newsletter_q2',
  'retention_campaign',
  'reactivation',
] as const

export type UtmCampaign = (typeof CAMPAIGN_OPTIONS)[number]

/** 标记"自定义输入"的 sentinel 值，用于 Select 组件中区分预设项和自定义项 */
export const OTHER_VALUE = '__other__'

/** Cookie name for UTM storage */
export const UTM_COOKIE_NAME = 'utm_params'

/** Cookie max age in seconds (30 days) */
export const UTM_COOKIE_MAX_AGE = 60 * 60 * 24 * 30
