/**
 * Server-side short link operations
 * 
 * Provides CRUD operations for short links.
 * Works with Cloudflare Workers KV, Node.js, or external API.
 */

import { z } from 'zod'
import type { ShortLink, ShortLinkUtm, CreateShortLinkInput, UpdateShortLinkInput, FindOrCreateResult } from './types'

// ─── Zod Schemas ─────────────────────────────────────────────────────────────

const utmSchema = z.object({
  source: z.string().optional(),
  medium: z.string().optional(),
  campaign: z.string().optional(),
  term: z.string().optional(),
  content: z.string().optional(),
})

const variantSchema = z.object({
  target: z.string().min(1),
  weight: z.number().int().min(1).max(100),
})

export const createShortLinkSchema = z.object({
  slug: z.string().min(1).optional(),
  target: z.string().min(1).url('Target must be a valid URL (e.g. https://example.com)'),
  utm: utmSchema.optional(),
  expireAt: z.number().optional(),
  variants: z.array(variantSchema).optional(),
})

export const updateShortLinkSchema = z.object({
  slug: z.string().min(1),
  target: z.string().min(1).url('Target must be a valid URL').optional(),
  utm: utmSchema.optional(),
  expireAt: z.number().optional(),
  variants: z.array(variantSchema).optional(),
})

// ─── URL Normalization ────────────────────────────────────────────────────────

function normalizeTargetUrl(input: string): URL {
  let url: URL
  try {
    url = new URL(input)
  } catch {
    throw new Error(`Invalid target URL: "${input}". URL must include protocol (e.g. https://)`)
  }

  // Normalize hostname to lowercase
  url.hostname = url.hostname.toLowerCase()

  // Remove trailing slash (except for root path)
  if (url.pathname !== '/' && url.pathname.endsWith('/')) {
    url.pathname = url.pathname.replace(/\/+$/, '')
  }

  // Remove hash and link tracking param
  url.hash = ''
  url.searchParams.delete('link_id')

  return url
}

/**
 * Build a unique fingerprint for a URL + UTM combination
 * Used for deduplication
 */
export function buildFingerprint(target: string, utm?: ShortLinkUtm): string {
  if (!target?.trim()) {
    throw new Error('Invalid target URL: target is empty.')
  }

  const url = normalizeTargetUrl(target)

  // Add UTM params if provided
  if (utm?.source) url.searchParams.set('utm_source', utm.source)
  if (utm?.medium) url.searchParams.set('utm_medium', utm.medium)
  if (utm?.campaign) url.searchParams.set('utm_campaign', utm.campaign)
  if (utm?.term) url.searchParams.set('utm_term', utm.term)
  if (utm?.content) url.searchParams.set('utm_content', utm.content)

  // Sort params for consistent fingerprint
  url.searchParams.sort()

  return url.toString()
}

/**
 * Generate a random 6-character alphanumeric slug
 */
export function generateSlug(length: number = 6): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz'
  let slug = ''
  for (let i = 0; i < length; i++) {
    slug += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return slug
}

// ─── Link ID Tracking ─────────────────────────────────────────────────────────

const LINK_ID_PARAM = 'link_id'

/**
 * Append link tracking ID to target URL
 */
export function appendLinkIdToTarget(target: string, slug: string): string {
  const url = new URL(target)
  url.searchParams.set(LINK_ID_PARAM, slug)
  return url.toString()
}

/**
 * Extract link ID from URL
 */
export function extractLinkIdFromUrl(url: string): string | null {
  try {
    const parsed = new URL(url)
    return parsed.searchParams.get(LINK_ID_PARAM)
  } catch {
    return null
  }
}

// ─── In-Memory Store (for Node.js / testing) ─────────────────────────────────

const inMemoryStore = new Map<string, ShortLink>()
const fingerprintIndex = new Map<string, string>() // fp -> slug

/**
 * Get short link from in-memory store
 */
export function memGetShortLink(slug: string): ShortLink | null {
  return inMemoryStore.get(slug) ?? null
}

/**
 * Store short link in memory
 */
export function memPutShortLink(link: ShortLink): void {
  inMemoryStore.set(link.slug, link)
  if (link.utm || link.target) {
    try {
      const fp = buildFingerprint(link.target, link.utm)
      fingerprintIndex.set(fp, link.slug)
    } catch {
      // Ignore invalid URLs
    }
  }
}

/**
 * Delete short link from memory
 */
export function memDeleteShortLink(slug: string): void {
  const link = inMemoryStore.get(slug)
  if (link) {
    try {
      const fp = buildFingerprint(link.target, link.utm)
      fingerprintIndex.delete(fp)
    } catch {
      // Ignore
    }
  }
  inMemoryStore.delete(slug)
}

/**
 * List all short links from memory
 */
export function memListShortLinks(prefix?: string): ShortLink[] {
  const links: ShortLink[] = []
  for (const [slug, link] of inMemoryStore) {
    if (!prefix || slug.startsWith(prefix)) {
      links.push(link)
    }
  }
  return links
}

// ─── CRUD Operations ─────────────────────────────────────────────────────────

/**
 * Create a new short link
 * 
 * @example
 * ```typescript
 * const link = await createShortLink({
 *   target: 'https://example.com/page',
 *   utm: { source: 'twitter', campaign: 'launch' }
 * })
 * ```
 */
export async function createShortLink(
  input: CreateShortLinkInput,
  store: 'memory' | 'kv' = 'memory'
): Promise<ShortLink> {
  const slug = input.slug ?? generateSlug()
  const createdAt = new Date().toISOString()

  const link: ShortLink = {
    slug,
    target: appendLinkIdToTarget(input.target, slug),
    utm: input.utm,
    expireAt: input.expireAt,
    variants: input.variants,
    createdAt,
  }

  if (store === 'memory') {
    const existing = memGetShortLink(slug)
    if (existing) {
      throw new Error(`Slug "${slug}" is already taken.`)
    }
    memPutShortLink(link)
  }

  // For KV store, would use kvPutShortLink() here
  // This is a placeholder for the actual implementation

  return link
}

/**
 * Get a short link by slug
 */
export async function getShortLink(
  slug: string,
  store: 'memory' | 'kv' = 'memory'
): Promise<ShortLink | null> {
  if (store === 'memory') {
    return memGetShortLink(slug)
  }
  return null // Would use kvGetShortLink() here
}

/**
 * Update a short link
 */
export async function updateShortLink(
  slug: string,
  input: UpdateShortLinkInput,
  store: 'memory' | 'kv' = 'memory'
): Promise<ShortLink> {
  const existing = await getShortLink(slug, store)
  if (!existing) {
    throw new Error(`Short link "${slug}" not found.`)
  }

  const updated: ShortLink = {
    ...existing,
    ...input,
    target: input.target 
      ? appendLinkIdToTarget(input.target, slug) 
      : existing.target,
  }

  if (store === 'memory') {
    memPutShortLink(updated)
  }

  return updated
}

/**
 * Delete a short link
 */
export async function deleteShortLink(
  slug: string,
  store: 'memory' | 'kv' = 'memory'
): Promise<void> {
  if (store === 'memory') {
    memDeleteShortLink(slug)
  }
}

/**
 * List short links with optional prefix filter
 */
export async function listShortLinks(
  prefix?: string,
  store: 'memory' | 'kv' = 'memory'
): Promise<ShortLink[]> {
  if (store === 'memory') {
    return memListShortLinks(prefix)
  }
  return [] // Would use kvListShortLinks() here
}

/**
 * Find or create a short link (deduplication)
 * 
 * If a link with the same URL + UTM already exists, returns it.
 * Otherwise creates a new link.
 */
export async function findOrCreateShortLink(
  input: CreateShortLinkInput,
  store: 'memory' | 'kv' = 'memory'
): Promise<FindOrCreateResult> {
  // If slug is provided, just create
  if (input.slug) {
    const existing = await getShortLink(input.slug, store)
    if (existing) {
      const existingFp = buildFingerprint(existing.target, existing.utm)
      const newFp = buildFingerprint(input.target, input.utm)
      if (existingFp === newFp) {
        return { shortLink: existing, created: false }
      }
      throw new Error(`Slug "${input.slug}" is already taken.`)
    }

    const link = await createShortLink(input, store)
    return { shortLink: link, created: true }
  }

  // Check for existing fingerprint
  const fp = buildFingerprint(input.target, input.utm)
  
  if (store === 'memory') {
    const existingSlug = fingerprintIndex.get(fp)
    if (existingSlug) {
      const existing = memGetShortLink(existingSlug)
      if (existing) {
        return { shortLink: existing, created: false }
      }
    }
  }

  // Generate unique slug
  let slug = generateSlug()
  let attempts = 0
  const maxAttempts = 10

  while (attempts < maxAttempts) {
    const existing = await getShortLink(slug, store)
    if (!existing) {
      const link = await createShortLink({ ...input, slug }, store)
      
      if (store === 'memory') {
        fingerprintIndex.set(fp, slug)
      }
      
      return { shortLink: link, created: true }
    }
    slug = generateSlug()
    attempts++
  }

  throw new Error('Failed to generate unique slug after multiple attempts.')
}
