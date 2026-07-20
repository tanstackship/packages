/**
 * Schema Builder Types
 */

/**
 * FAQ item
 */
export interface FAQItem {
  question: string
  answer: string
}

/**
 * Breadcrumb item
 */
export interface BreadcrumbItem {
  name: string
  path?: string
  href?: string
}

/**
 * Product offer
 */
export interface SchemaOffer {
  name: string
  price: number
  priceCurrency?: string
  availability?: 'InStock' | 'LimitedAvailability' | 'OutOfStock'
}

/**
 * Author/person info
 */
export interface PersonInfo {
  name: string
  bio?: string
  url?: string
  avatar?: string
  company?: string
  title?: string
  sameAs?: string[]
}

/**
 * Blog post info
 */
export interface BlogPostInfo {
  title: string
  description: string
  author: string
  date: string
  dateModified?: string
  image?: string
  tags?: string[]
}

/**
 * Options for FAQPage schema
 */
export interface FAQPageOptions {
  items: FAQItem[]
  path?: string
  origin?: string
}

/**
 * Options for Product schema
 */
export interface ProductSchemaOptions {
  name: string
  description: string
  offers: SchemaOffer[]
  path?: string
  origin?: string
}

/**
 * Options for BlogPosting schema
 */
export interface BlogPostingOptions {
  post: BlogPostInfo
  path?: string
  origin?: string
}

/**
 * Options for AboutPage schema
 */
export interface AboutPageOptions {
  person?: PersonInfo
  path?: string
  origin?: string
}

/**
 * Options for BreadcrumbList schema
 */
export interface BreadcrumbListOptions {
  items: BreadcrumbItem[]
  origin?: string
}
