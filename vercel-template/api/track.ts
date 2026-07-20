/**
 * Analytics Tracking API
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'

interface TrackRequest {
  event: string
  properties?: Record<string, unknown>
  userId?: string
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { event, properties = {}, userId } = req.body as TrackRequest

  // Validate event
  if (!event || typeof event !== 'string') {
    return res.status(400).json({ error: 'Event name required' })
  }

  // Build event object
  const analyticsEvent = {
    event,
    properties: {
      ...properties,
      url: properties.url || req.headers.referer,
      userAgent: req.headers['user-agent'],
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    },
    userId,
    timestamp: new Date().toISOString(),
    context: {
      utm: {
        source: req.cookies?.utm_source,
        medium: req.cookies?.utm_medium,
        campaign: req.cookies?.utm_campaign,
        term: req.cookies?.utm_term,
        content: req.cookies?.utm_content,
      },
    },
  }

  // Log event (replace with your analytics provider)
  console.log('Analytics Event:', JSON.stringify(analyticsEvent))

  // Optionally send to PostHog
  if (process.env.POSTHOG_API_KEY) {
    await fetch(`https://app.posthog.com/capture/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.POSTHOG_API_KEY}`,
      },
      body: JSON.stringify({
        api_key: process.env.POSTHOG_API_KEY,
        event,
        properties: analyticsEvent.properties,
        distinct_id: userId || req.ip,
        timestamp: analyticsEvent.timestamp,
      }),
    })
  }

  return res.status(200).json({ success: true })
}
