/**
 * TanStack Ship UTM Tracking Worker
 * 
 * Captures UTM parameters and stores them in KV for analytics.
 */

interface Env {
  UTM_DATA: KVNamespace;
  SITE_URL: string;
}

// Standard UTM params
const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

// Platform click IDs
const CLICK_IDS: Record<string, string> = {
  gclid: 'google',
  fbclid: 'facebook',
  msclkid: 'bing',
  ttclid: 'tiktok',
  li_fat_id: 'linkedin',
};

interface UtmData {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  platform?: string;
  referrer?: string;
  captured_at: string;
  ip?: string;
}

function parseUtmFromUrl(url: URL): UtmData {
  const data: UtmData = { captured_at: new Date().toISOString() };

  // Parse standard UTM params
  for (const param of UTM_PARAMS) {
    const value = url.searchParams.get(param);
    if (value) {
      (data as any)[param.replace('utm_', '')] = value;
    }
  }

  // If no source, try click IDs
  if (!data.source) {
    for (const [clickId, platform] of Object.entries(CLICK_IDS)) {
      if (url.searchParams.has(clickId)) {
        data.source = platform;
        data.platform = platform;
        break;
      }
    }
  }

  return data;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Parse UTM parameters
    const utmData = parseUtmFromUrl(url);

    // If UTM params present, store and redirect
    if (utmData.source) {
      // Get IP for fraud detection
      utmData.ip = request.headers.get('CF-Connecting-IP') || undefined;
      utmData.referrer = request.headers.get('Referer') || undefined;

      // Store in KV with 30-day expiry
      const key = `utm_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      await env.UTM_DATA.put(key, JSON.stringify(utmData), { expirationTtl: 60 * 60 * 24 * 30 });

      // Set cookie
      const cookieValue = encodeURIComponent(JSON.stringify(utmData));
      const response = new Response(null, { status: 302 });
      
      // Remove UTM params and redirect
      const cleanUrl = new URL(url);
      for (const param of UTM_PARAMS) {
        cleanUrl.searchParams.delete(param);
      }
      for (const clickId of Object.keys(CLICK_IDS)) {
        cleanUrl.searchParams.delete(clickId);
      }
      
      response.headers.set('Location', cleanUrl.toString());
      response.headers.set('Set-Cookie', `utm=${cookieValue}; Path=/; Max-Age=${60 * 60 * 24 * 30}; SameSite=Lax`);
      
      return response;
    }

    // Health check or no UTM params
    return new Response(JSON.stringify({
      status: 'ok',
      worker: 'tanstackship-utm-worker',
      version: '1.0.0',
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  },
};
