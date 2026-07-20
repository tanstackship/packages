/**
 * Server-side UTM utilities
 * 
 * Parse, normalize, and resolve UTM attribution on the server.
 * Works with Cloudflare Workers, Node.js, and other serverless environments.
 */

import type { UtmAttributionParams, UtmAttributionSnake } from './types'

/**
 * Trim a string or return null if empty/whitespace only.
 */
function trimOrNull(value: string | null | undefined): string | null {
  if (value == null) return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

/**
 * Normalize UTM attribution by trimming whitespace and removing empty values.
 *
 * @example
 * ```typescript
 * const normalized = normalizeUtmAttribution({
 *   utmSource: '  google  ',
 *   utmCampaign: '',
 * })
 * // { utmSource: 'google' }
 * ```
 */
export function normalizeUtmAttribution(
  input: Partial<UtmAttributionParams>,
): UtmAttributionParams | null {
  const utmSource = trimOrNull(input.utmSource)
  const utmMedium = trimOrNull(input.utmMedium)
  const utmCampaign = trimOrNull(input.utmCampaign)
  const utmTerm = trimOrNull(input.utmTerm)
  const utmContent = trimOrNull(input.utmContent)
  const referrer = trimOrNull(input.referrer)

  if (!utmSource && !utmMedium && !utmCampaign && !utmTerm && !utmContent) {
    return null
  }

  return {
    utmSource,
    utmMedium,
    utmCampaign,
    utmTerm,
    utmContent,
    referrer,
  }
}

/**
 * Parse UTM cookie from a raw cookie header string.
 *
 * @example
 * ```typescript
 * // In Cloudflare Workers
 * const cookieHeader = request.headers.get('Cookie')
 * const utm = cookieHeader ? parseUtmCookieFromHeader(cookieHeader) : null
 * ```
 */
export function parseUtmCookieFromHeader(cookieHeader: string): UtmAttributionParams | null {
  const utmCookie = cookieHeader
    .split('; ')
    .find((row) => row.startsWith('_utm='))

  if (!utmCookie) return null

  try {
    const raw = decodeURIComponent(utmCookie.split('=').slice(1).join('='))
    const parsed = JSON.parse(raw) as UtmAttributionSnake
    return normalizeUtmAttribution({
      utmSource: parsed.utm_source,
      utmMedium: parsed.utm_medium,
      utmCampaign: parsed.utm_campaign,
      utmTerm: parsed.utm_term,
      utmContent: parsed.utm_content,
      referrer: parsed.referrer,
    })
  } catch {
    return null
  }
}

/**
 * Resolve UTM attribution with last-touch priority.
 * 
 * Request body fields win over cookie (checkout-time / last-touch).
 *
 * @example
 * ```typescript
 * const utm = resolveCheckoutUtmAttribution({
 *   body: requestBody.utm,
 *   cookieHeader: request.headers.get('Cookie'),
 * })
 * ```
 */
export function resolveCheckoutUtmAttribution(input: {
  body?: Partial<UtmAttributionParams> | null
  cookieHeader?: string | null
}): UtmAttributionParams | null {
  const fromCookie = input.cookieHeader
    ? parseUtmCookieFromHeader(input.cookieHeader)
    : null

  const fromBody = normalizeUtmAttribution(input.body ?? {})

  if (fromBody) return fromBody
  return fromCookie
}

/**
 * Convert UTM attribution to Stripe metadata format.
 *
 * @example
 * ```typescript
 * const metadata = toStripeUtmMetadata(utm)
 * // { utmSource: 'google', utmCampaign: 'spring_sale', ... }
 * await stripe.customers.create({ metadata })
 * ```
 */
export function toStripeUtmMetadata(
  utm: UtmAttributionParams,
): Record<string, string> {
  const out: Record<string, string> = {}
  if (utm.utmSource) out.utmSource = utm.utmSource
  if (utm.utmMedium) out.utmMedium = utm.utmMedium
  if (utm.utmCampaign) out.utmCampaign = utm.utmCampaign
  if (utm.utmTerm) out.utmTerm = utm.utmTerm
  if (utm.utmContent) out.utmContent = utm.utmContent
  if (utm.referrer) out.attributionReferrer = utm.referrer
  return out
}

/**
 * Extract UTM attribution from Stripe customer/subscription metadata.
 *
 * @example
 * ```typescript
 * const customer = await stripe.customers.retrieve(customerId)
 * const utm = fromStripeMetadata(customer.metadata)
 * ```
 */
export function fromStripeMetadata(
  metadata: Record<string, string | undefined> | null | undefined,
): UtmAttributionParams | null {
  if (!metadata) return null
  return normalizeUtmAttribution({
    utmSource: metadata.utmSource,
    utmMedium: metadata.utmMedium,
    utmCampaign: metadata.utmCampaign,
    utmTerm: metadata.utmTerm,
    utmContent: metadata.utmContent,
    referrer: metadata.attributionReferrer,
  })
}

/**
 * Convert UTM attribution to database column format (for Drizzle/Prisma).
 *
 * @example
 * ```typescript
 * const dbColumns = utmAttributionToDbColumns(utm)
 * await db.insert(users).values({
 *   ...dbColumns,
 *   email: 'user@example.com',
 * })
 * ```
 */
export function utmAttributionToDbColumns(utm: UtmAttributionParams) {
  return {
    utmSource: utm.utmSource ?? '',
    utmMedium: utm.utmMedium ?? '',
    utmCampaign: utm.utmCampaign ?? '',
    utmTerm: utm.utmTerm ?? '',
    utmContent: utm.utmContent ?? '',
    referrer: utm.referrer ?? '',
  }
}
