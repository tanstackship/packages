/**
 * UTM Tracking Worker
 * 
 * Edge function for UTM parameter capture and storage.
 */

interface Env {
  LINKS: KVNamespace;
  SITE_URL: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Parse UTM parameters
    const utmSource = url.searchParams.get('utm_source');
    const utmMedium = url.searchParams.get('utm_medium');
    const utmCampaign = url.searchParams.get('utm_campaign');
    const utmTerm = url.searchParams.get('utm_term');
    const utmContent = url.searchParams.get('utm_content');

    // Store in cookie for client-side tracking
    if (utmSource) {
      const utmData = {
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        utm_term: utmTerm,
        utm_content: utmContent,
        captured_at: new Date().toISOString(),
      };

      const response = new Response(null, {
        status: 302,
        headers: {
          'Location': url.pathname,
          'Set-Cookie': `_utm=${encodeURIComponent(JSON.stringify(utmData))}; Path=/; Max-Age=2592000; SameSite=Lax`,
        },
      });

      // Remove UTM params from redirect URL
      url.searchParams.delete('utm_source');
      url.searchParams.delete('utm_medium');
      url.searchParams.delete('utm_campaign');
      url.searchParams.delete('utm_term');
      url.searchParams.delete('utm_content');
      response.headers.set('Location', url.toString());

      return response;
    }

    return new Response('UTM Tracking Worker is running', { status: 200 });
  },
};
