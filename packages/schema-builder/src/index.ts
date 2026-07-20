/**
 * @tanstackship/schema-builder
 * 
 * JSON-LD Schema.org generator for web apps.
 * Build FAQPage, Product, BlogPosting, SoftwareApplication schemas easily.
 * 
 * @example
 * ```typescript
 * import { 
 *   buildFAQPageSchema,
 *   buildProductSchema,
 *   buildBlogPostingSchema 
 * } from '@tanstackship/schema-builder'
 * 
 * // Add to your page head
 * const schema = buildFAQPageSchema({
 *   items: [
 *     { question: 'What is this?', answer: 'A great product.' },
 *   ],
 *   path: '/faq',
 * })
 * 
 * // Render in head
 * document.head.innerHTML += `<script type="application/ld+json">${schema}</script>`
 * ```
 */

// Types
export type {
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

// Schema builders
export {
  buildFAQPageSchema,
  buildProductSchema,
  buildSoftwareApplicationSchema,
  buildBlogPostingSchema,
  buildAboutPageSchema,
  buildBreadcrumbListSchema,
  buildOrganizationSchema,
  buildWebSiteSchema,
  buildCollectionPageSchema,
  buildPersonSchema,
} from './schemas'
