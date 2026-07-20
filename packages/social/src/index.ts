/**
 * Social Sharing Utilities
 */

export type Platform = 'twitter' | 'linkedin' | 'facebook' | 'reddit' | 'hackernews' | 'copy'

export interface ShareOptions {
  url: string
  text?: string
  hashtags?: string[]
  via?: string
}

const BASE_URLS: Record<Platform, string> = {
  twitter: 'https://twitter.com/intent/tweet',
  linkedin: 'https://www.linkedin.com/sharing/share-offsite/',
  facebook: 'https://www.facebook.com/sharer/sharer.php',
  reddit: 'https://www.reddit.com/submit',
  hackernews: 'https://news.ycombinator.com/submitlink',
  copy: '',
}

export function getShareUrl(platform: Platform, options: ShareOptions): string {
  const { url, text, hashtags, via } = options

  switch (platform) {
    case 'twitter': {
      const params = new URLSearchParams({ url })
      if (text) params.set('text', text)
      if (via) params.set('via', via)
      if (hashtags?.length) params.set('hashtags', hashtags.join(','))
      return `${BASE_URLS.twitter}?${params}`
    }
    case 'linkedin': {
      return `${BASE_URLS.linkedin}?url=${encodeURIComponent(url)}`
    }
    case 'facebook': {
      return `${BASE_URLS.facebook}?u=${encodeURIComponent(url)}`
    }
    case 'reddit': {
      return `${BASE_URLS.reddit}?u=${encodeURIComponent(url)}`
    }
    case 'hackernews': {
      return `${BASE_URLS.hackernews}?u=${encodeURIComponent(url)}`
    }
    case 'copy':
      return url
    default:
      return url
  }
}

export function generateOgTags(options: {
  title: string
  description: string
  url: string
  image?: string
  type?: string
}): string {
  const { title, description, url, image, type = 'website' } = options

  return [
    `<meta property="og:title" content="${title}">`,
    `<meta property="og:description" content="${description}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:type" content="${type}">`,
    image ? `<meta property="og:image" content="${image}">` : '',
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${title}">`,
    `<meta name="twitter:description" content="${description}">`,
    image ? `<meta name="twitter:image" content="${image}">` : '',
  ].filter(Boolean).join('\n')
}

export function openShareWindow(platform: Platform, options: ShareOptions): void {
  const shareUrl = getShareUrl(platform, options)
  if (platform === 'copy') {
    navigator.clipboard?.writeText(shareUrl)
    return
  }
  window.open(shareUrl, '_blank', 'width=600,height=400')
}
