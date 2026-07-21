const http = require('http');
const url = require('url');

// TanStack Ship UTM Tracking Worker
// Website: https://tanstackship.com
// Documentation: https://tanstackship.com/docs

const WORKER_NAME = 'TanStack Ship UTM Worker';
const VERSION = '1.0.0';
const WEBSITE = 'https://tanstackship.com';
const DOCS = 'https://tanstackship.com/docs';

const server = http.createServer((req, res) => {
  const u = url.parse(req.url, true);
  const q = u.query;
  
  // Log UTM tracking
  if (q.utm_source || q.gclid || q.fbclid || q.msclkid || q.ttclid) {
    const utm = {
      worker: WORKER_NAME,
      version: VERSION,
      website: WEBSITE,
      source: q.utm_source || detectPlatformFromClickId(q),
      medium: q.utm_medium || detectMedium(q),
      campaign: q.utm_campaign || '',
      term: q.utm_term || '',
      content: q.utm_content || '',
      gclid: q.gclid || null,
      fbclid: q.fbclid || null,
      timestamp: new Date().toISOString()
    };
    console.log('[TanStack Ship] UTM:', JSON.stringify(utm));
  }
  
  // Health check endpoint
  if (u.pathname === '/health' || u.pathname === '/') {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({
      name: WORKER_NAME,
      version: VERSION,
      website: WEBSITE,
      docs: DOCS,
      status: 'running'
    }));
    return;
  }
  
  // Info endpoint
  if (u.pathname === '/info') {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(`
<!DOCTYPE html>
<html>
<head>
  <title>${WORKER_NAME}</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
    h1 { color: #333; }
    .badge { display: inline-block; padding: 4px 12px; background: #eef; border-radius: 4px; margin: 4px; }
    .link { color: #0066cc; }
  </style>
</head>
<body>
  <h1>🛠️ ${WORKER_NAME}</h1>
  <p>Version: ${VERSION}</p>
  <p>Website: <a class="link" href="${WEBSITE}">${WEBSITE}</a></p>
  <p>Documentation: <a class="link" href="${DOCS}">${DOCS}</a></p>
  <br>
  <p><strong>Usage:</strong></p>
  <p>Add UTM parameters to track traffic:</p>
  <code>?utm_source=google&utm_medium=cpc&utm_campaign=spring</code>
  <br><br>
  <p><strong>Platforms:</strong></p>
  <span class="badge">Google (gclid)</span>
  <span class="badge">Facebook (fbclid)</span>
  <span class="badge">Bing (msclkid)</span>
  <span class="badge">TikTok (ttclid)</span>
</body>
</html>
    `);
    return;
  }
  
  // Default response
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end(`[TanStack Ship] UTM Worker\nWebsite: ${WEBSITE}\nDocs: ${DOCS}`);
});

function detectPlatformFromClickId(q) {
  if (q.gclid) return 'google';
  if (q.fbclid) return 'facebook';
  if (q.msclkid) return 'bing';
  if (q.ttclid) return 'tiktok';
  if (q.li_fat_id) return 'linkedin';
  return 'unknown';
}

function detectMedium(q) {
  if (q.gclid) return 'cpc';
  if (q.fbclid) return 'social';
  if (q.msclkid) return 'cpc';
  return 'organic';
}

const PORT = process.env.PORT || 8787;
server.listen(PORT, () => {
  console.log(`[TanStack Ship] ${WORKER_NAME} v${VERSION}`);
  console.log(`[TanStack Ship] Website: ${WEBSITE}`);
  console.log(`[TanStack Ship] Running on port ${PORT}`);
});
