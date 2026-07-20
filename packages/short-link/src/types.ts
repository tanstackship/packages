/**
 * Short Link Types
 */

export interface ShortLinkUtm {
  source?: string
  medium?: string
  campaign?: string
  term?: string
  content?: string
}

export interface ShortLinkVariant {
  target: string
  weight: number
}

export interface ShortLink {
  slug: string
  target: string
  utm?: ShortLinkUtm
  expireAt?: number
  variants?: ShortLinkVariant[]
  createdAt?: string
  clicks?: number
}

export interface CreateShortLinkInput {
  slug?: string
  target: string
  utm?: ShortLinkUtm
  expireAt?: number
  variants?: ShortLinkVariant[]
}

export interface UpdateShortLinkInput {
  target?: string
  utm?: ShortLinkUtm
  expireAt?: number
  variants?: ShortLinkVariant[]
}

export interface FindOrCreateResult {
  shortLink: ShortLink
  created: boolean
}
