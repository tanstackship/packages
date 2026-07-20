/**
 * UTM Capture Middleware
 */

import { NextRequest, NextResponse } from 'next/server'

const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

export function withUtmCapture() {
  return async function middleware(req: NextRequest) {
    const res = NextResponse.next()

    // Check for UTM params in URL
    const url = req.nextUrl.clone()
    const hasUtmParams = UTM_PARAMS.some((p) => url.searchParams.has(p))

    if (hasUtmParams) {
      // Store UTM params in cookies
      for (const param of UTM_PARAMS) {
        const value = url.searchParams.get(param)
        if (value) {
          res.cookies.set(param, value, {
            maxAge: COOKIE_MAX_AGE,
            path: '/',
            sameSite: 'lax',
          })
        }
      }

      // Store first touch timestamp if new
      if (!req.cookies.get('utm_first_touch')) {
        res.cookies.set('utm_first_touch', new Date().toISOString(), {
          maxAge: COOKIE_MAX_AGE,
          path: '/',
        })
      }
    }

    // Store referrer on first visit
    if (!req.cookies.get('utm_referrer') && req.headers.get('referer')) {
      res.cookies.set('utm_referrer', req.headers.get('referer') || '', {
        maxAge: COOKIE_MAX_AGE,
        path: '/',
      })
    }

    return res
  }
}
