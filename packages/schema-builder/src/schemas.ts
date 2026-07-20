/**
 * JSON-LD Schema.org Generator
 * 
 * Generate structured data for search engines and AI.
 */

import type {
  FAQItem,
  BreadcrumbItem,
  SchemaOffer,
  PersonInfo,
  BlogPostInfo,
  FAQPageOptions,
  ProductSchemaOptions,
  BlogPostingOptions,
  AboutPageOptions,
  BreadcrumbListOptions,
} from './types'

const SITE_NAME = 'TanStack Ship'
const DEFAULT_ORIGIN = 'https://tanstackship.com'

// ─── Helpers ────────────────────────────────────────────────────────────────

function getOrigin(origin?: string): string {
  return origin ?? DEFAULT_ORIGIN
}

function buildUrl(path: string, origin?: string): string {
  return new URL(path, getOrigin(origin)).href
}

// ─── FAQPage ────────────────────────────────────────────────────────────────

/**
 * Generate FAQPage schema
 * 
 * @example
 * ```typescript
 * const schema = buildFAQPageSchema({
 *   items: [
 *     { question: 'What is this?', answer: 'It is a product.' },
 *   ],
 *   path: '/faq',
 * })
 * ```
 */
export function buildFAQPageSchema(options: FAQPageOptions): string | null {
  const { items, path, origin } = options

  if (!items || items.length === 0) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    ...(path && { url: buildUrl(path, origin) }),
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return JSON.stringify(schema, null, 2)
}

// ─── Product ────────────────────────────────────────────────────────────────

/**
 * Generate Product schema
 * 
 * @example
 * ```typescript
 * const schema = buildProductSchema({
 *   name: 'SaaS Template',
 *   description: 'Production-ready SaaS boilerplate',
 *   offers: [
 *     { name: 'Pro', price: 99, priceCurrency: 'USD' },
 *   ],
 *   path: '/product',
 * })
 * ```
 */
export function buildProductSchema(options: ProductSchemaOptions): string {
  const { name, description, offers, path, origin } = options

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    ...(path && { url: buildUrl(path, origin) }),
  }

  if (offers.length === 1) {
    schema.offers = {
      '@type': 'Offer',
      name: offers[0].name,
      price: offers[0].price,
      priceCurrency: offers[0].priceCurrency ?? 'USD',
      availability: offers[0].availability
        ? `https://schema.org/${offers[0].availability}`
        : 'https://schema.org/InStock',
    }
  } else if (offers.length > 1) {
    const prices = offers.map((o) => o.price)
    schema.offers = {
      '@type': 'AggregateOffer',
      priceCurrency: offers[0].priceCurrency ?? 'USD',
      lowPrice: Math.min(...prices),
      highPrice: Math.max(...prices),
      offerCount: offers.length,
      offers: offers.map((offer) => ({
        '@type': 'Offer',
        name: offer.name,
        price: offer.price,
        priceCurrency: offer.priceCurrency ?? 'USD',
        availability: offer.availability
          ? `https://schema.org/${offer.availability}`
          : 'https://schema.org/InStock',
      })),
    }
  }

  return JSON.stringify(schema, null, 2)
}

// ─── SoftwareApplication ─────────────────────────────────────────────────────

/**
 * Generate SoftwareApplication schema
 * 
 * @example
 * ```typescript
 * const schema = buildSoftwareApplicationSchema({
 *   name: 'TanStack Ship',
 *   description: 'SaaS boilerplate',
 *   offers: [{ name: 'Pro', price: 99 }],
 *   applicationCategory: 'DeveloperApplication',
 * })
 * ```
 */
export function buildSoftwareApplicationSchema(options: {
  name: string
  description: string
  offers: SchemaOffer[]
  path?: string
  origin?: string
  applicationCategory?: string
  operatingSystem?: string
  softwareVersion?: string
  aggregateRating?: {
    ratingValue: number
    ratingCount: number
    bestRating?: number
  }
  image?: string
  author?: string
}): string {
  const { name, description, offers, path, origin, ...rest } = options

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    ...(path && { url: buildUrl(path, origin) }),
    applicationCategory: rest.applicationCategory ?? 'DeveloperApplication',
    operatingSystem: rest.operatingSystem ?? 'Web',
  }

  if (rest.softwareVersion) schema.softwareVersion = rest.softwareVersion
  if (rest.image) schema.image = rest.image
  if (rest.author) {
    schema.author = { '@type': 'Organization', name: rest.author }
  }

  if (offers.length === 1) {
    schema.offers = {
      '@type': 'Offer',
      name: offers[0].name,
      price: offers[0].price,
      priceCurrency: offers[0].priceCurrency ?? 'USD',
      availability: offers[0].availability
        ? `https://schema.org/${offers[0].availability}`
        : 'https://schema.org/InStock',
    }
  } else if (offers.length > 1) {
    const prices = offers.map((o) => o.price)
    schema.offers = {
      '@type': 'AggregateOffer',
      priceCurrency: offers[0].priceCurrency ?? 'USD',
      lowPrice: Math.min(...prices),
      highPrice: Math.max(...prices),
      offers: offers.map((offer) => ({
        '@type': 'Offer',
        name: offer.name,
        price: offer.price,
        priceCurrency: offer.priceCurrency ?? 'USD',
        availability: offer.availability
          ? `https://schema.org/${offer.availability}`
          : 'https://schema.org/InStock',
      })),
    }
  }

  if (rest.aggregateRating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: rest.aggregateRating.ratingValue,
      ratingCount: rest.aggregateRating.ratingCount,
      bestRating: rest.aggregateRating.bestRating ?? 5,
    }
  }

  return JSON.stringify(schema, null, 2)
}

// ─── BlogPosting ────────────────────────────────────────────────────────────

/**
 * Generate BlogPosting schema
 * 
 * @example
 * ```typescript
 * const schema = buildBlogPostingSchema({
 *   post: {
 *     title: 'My Blog Post',
 *     description: 'A great article',
 *     author: 'John Doe',
 *     date: '2024-01-01',
 *   },
 *   path: '/blog/my-post',
 * })
 * ```
 */
export function buildBlogPostingSchema(options: BlogPostingOptions): string {
  const { post, path, origin } = options

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    ...(path && { url: buildUrl(path, origin) }),
    datePublished: post.date,
    dateModified: post.dateModified ?? post.date,
    author: {
      '@type': 'Person',
      name: post.author,
      url: buildUrl('/about', origin),
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: getOrigin(origin),
    },
    ...(post.image && { image: post.image }),
    ...(post.tags && { keywords: post.tags.join(', ') }),
  }

  return JSON.stringify(schema, null, 2)
}

// ─── AboutPage ─────────────────────────────────────────────────────────────

/**
 * Generate AboutPage schema with Person
 * 
 * @example
 * ```typescript
 * const schema = buildAboutPageSchema({
 *   person: {
 *     name: 'Huifer',
 *     bio: 'Solo developer',
 *     sameAs: ['https://github.com/orgs/tanstackship'],
 *   },
 *   path: '/about',
 * })
 * ```
 */
export function buildAboutPageSchema(options: AboutPageOptions): string {
  const { person, path, origin } = options

  const schemas: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      ...(path && { url: buildUrl(path, origin) }),
      publisher: {
        '@type': 'Organization',
        name: SITE_NAME,
        url: getOrigin(origin),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_NAME,
      url: getOrigin(origin),
    },
  ]

  if (person) {
    const personSchema: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: person.name,
      ...(person.bio && { description: person.bio }),
      ...(person.url && { url: buildUrl(person.url, origin) }),
      ...(person.avatar && { image: person.avatar }),
      ...(person.company && { memberOf: { '@type': 'Organization', name: person.company } }),
      ...(person.title && { jobTitle: person.title }),
      ...(person.sameAs && person.sameAs.length > 0 && { sameAs: person.sameAs }),
    }
    schemas.push(personSchema)
  }

  return JSON.stringify(schemas, null, 2)
}

// ─── BreadcrumbList ─────────────────────────────────────────────────────────

/**
 * Generate BreadcrumbList schema
 * 
 * @example
 * ```typescript
 * const schema = buildBreadcrumbListSchema({
 *   items: [
 *     { name: 'Home', path: '/' },
 *     { name: 'Blog', path: '/blog' },
 *     { name: 'Post' },
 *   ],
 * })
 * ```
 */
export function buildBreadcrumbListSchema(options: BreadcrumbListOptions): string {
  const { items, origin } = options

  const itemListElement = items.map((item, index) => {
    const position = index + 1
    const entry: Record<string, unknown> = {
      '@type': 'ListItem',
      position,
      name: item.name,
    }

    if (item.href) {
      entry.item = item.href
    } else if (item.path) {
      entry.item = buildUrl(item.path, origin)
    }

    return entry
  })

  return JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement,
    },
    null,
    2
  )
}

// ─── Organization ────────────────────────────────────────────────────────────

/**
 * Generate Organization schema
 */
export function buildOrganizationSchema(options: {
  name?: string
  url?: string
  logo?: string
  sameAs?: string[]
  origin?: string
}): string {
  const name = options.name ?? SITE_NAME
  const url = options.url ?? getOrigin(options.origin)

  return JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name,
      url,
      ...(options.logo && {
        logo: {
          '@type': 'ImageObject',
          url: options.logo,
        },
      }),
      ...(options.sameAs && { sameAs: options.sameAs }),
    },
    null,
    2
  )
}

// ─── WebSite + SearchAction ─────────────────────────────────────────────────

/**
 * Generate WebSite schema with search box
 */
export function buildWebSiteSchema(options: {
  name?: string
  origin?: string
}): string {
  const name = options.name ?? SITE_NAME
  const origin = getOrigin(options.origin)

  return JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name,
      url: origin,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${origin}/search?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
    null,
    2
  )
}

// ─── CollectionPage ──────────────────────────────────────────────────────────

/**
 * Generate CollectionPage schema
 */
export function buildCollectionPageSchema(options: {
  name?: string
  description?: string
  path: string
  origin?: string
}): string {
  const { name, description, path, origin } = options

  return JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name,
      description,
      url: buildUrl(path, origin),
      publisher: {
        '@type': 'Organization',
        name: SITE_NAME,
      },
    },
    null,
    2
  )
}

// ─── Person ─────────────────────────────────────────────────────────────────

/**
 * Generate Person schema
 */
export function buildPersonSchema(person: PersonInfo & { path?: string; origin?: string }): string {
  const { path, origin, ...info } = person

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: info.name,
    ...(info.bio && { description: info.bio }),
    ...(info.url && { url: buildUrl(info.url, origin) }),
    ...(info.avatar && { image: info.avatar }),
    ...(info.company && { memberOf: { '@type': 'Organization', name: info.company } }),
    ...(info.title && { jobTitle: info.title }),
  }

  return JSON.stringify(schema, null, 2)
}
