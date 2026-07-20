#!/usr/bin/env node

/**
 * UTM CLI - Parse and analyze UTM parameters from URLs
 */

import { parseArgs } from 'util'

// Platform click IDs
const PLATFORM_CLICK_IDS: Record<string, string> = {
  gclid: 'google',
  fbclid: 'facebook',
  msclkid: 'bing',
  ttclid: 'tiktok',
  li_fat_id: 'linkedin',
}

// Non-standard source params
const NON_STANDARD_SOURCE_PARAMS = [
  'ref', 'referrer', 'refer', 'source', 'via',
  'from', 'origin', 'src', 'channel',
]

interface UtmParams {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  platform?: string
  raw_param?: string
}

function parseUrl(urlString: string): UtmParams {
  try {
    const url = new URL(urlString)
    const params = url.searchParams

    const result: UtmParams = {}

    // Standard UTM params
    result.utm_source = params.get('utm_source') ?? undefined
    result.utm_medium = params.get('utm_medium') ?? undefined
    result.utm_campaign = params.get('utm_campaign') ?? undefined
    result.utm_term = params.get('utm_term') ?? undefined
    result.utm_content = params.get('utm_content') ?? undefined

    // Platform click IDs
    if (!result.utm_source) {
      for (const [id, platform] of Object.entries(PLATFORM_CLICK_IDS)) {
        if (params.has(id)) {
          result.utm_source = platform
          result.platform = platform
          break
        }
      }
    }

    // Non-standard params
    if (!result.utm_source) {
      for (const param of NON_STANDARD_SOURCE_PARAMS) {
        const value = params.get(param)
        if (value) {
          result.utm_source = value
          result.raw_param = param
          break
        }
      }
    }

    return result
  } catch {
    console.error('Error: Invalid URL')
    process.exit(1)
  }
}

function formatOutput(params: UtmParams, format: string): void {
  switch (format) {
    case 'json':
      console.log(JSON.stringify(params, null, 2))
      break
    case 'csv':
      console.log([
        params.utm_source || '',
        params.utm_medium || '',
        params.utm_campaign || '',
        params.utm_term || '',
        params.utm_content || '',
        params.platform || '',
        params.raw_param || '',
      ].join(','))
      break
    case 'env':
      if (params.utm_source) console.log(`UTM_SOURCE=${params.utm_source}`)
      if (params.utm_medium) console.log(`UTM_MEDIUM=${params.utm_medium}`)
      if (params.utm_campaign) console.log(`UTM_CAMPAIGN=${params.utm_campaign}`)
      if (params.utm_term) console.log(`UTM_TERM=${params.utm_term}`)
      if (params.utm_content) console.log(`UTM_CONTENT=${params.utm_content}`)
      break
    default:
      console.log('\n📊 UTM Parameters:\n')
      if (params.utm_source) {
        console.log(`  Source:   ${params.utm_source}`)
        if (params.platform) console.log(`  Platform: ${params.platform}`)
        if (params.raw_param) console.log(`  (from ${params.raw_param})`)
      }
      if (params.utm_medium) console.log(`  Medium:   ${params.utm_medium}`)
      if (params.utm_campaign) console.log(`  Campaign: ${params.utm_campaign}`)
      if (params.utm_term) console.log(`  Term:     ${params.utm_term}`)
      if (params.utm_content) console.log(`  Content:  ${params.utm_content}`)
      if (!params.utm_source && !params.utm_medium && !params.utm_campaign) {
        console.log('  No UTM parameters found')
      }
      console.log('')
  }
}

function main() {
  const args = process.argv.slice(2)

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
UTM CLI - Parse UTM parameters from URLs

Usage:
  utm <url>              Parse UTM from URL
  utm --version           Show version
  utm --help             Show this help

Options:
  --format, -f           Output format (table, json, csv, env)
  --source-only, -s      Only output source

Examples:
  utm https://example.com?utm_source=google&utm_campaign=spring
  utm "https://example.com?fbclid=abc123" --format=json
  utm https://example.com?utm_source=twitter -f env
`)
    return
  }

  if (args.includes('--version') || args.includes('-v')) {
    console.log('utm-cli v1.0.0')
    return
  }

  const format = args.includes('--format') || args.includes('-f')
    ? args[args.indexOf('-f') + 1] || args[args.indexOf('--format') + 1] || 'table'
    : 'table'

  const url = args.find((a) => !a.startsWith('-'))

  if (!url) {
    console.error('Error: URL required\nUsage: utm <url>')
    process.exit(1)
  }

  const params = parseUrl(url)

  if (args.includes('--source-only') || args.includes('-s')) {
    console.log(params.utm_source || '')
    return
  }

  formatOutput(params, format)
}

main()
