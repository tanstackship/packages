const core = require('@actions/core');

// Platform click ID mappings
const platformClickIDs = {
  gclid: 'google',
  fbclid: 'facebook',
  msclkid: 'bing',
  ttclid: 'tiktok',
  li_fat_id: 'linkedin',
};

// Non-standard source params
const nonStandardParams = [
  'ref', 'referrer', 'refer', 'source', 'via',
  'from', 'origin', 'src', 'channel', 'aff', 'affiliate', 'partner',
];

function parseUrl(urlString) {
  try {
    return new URL(urlString);
  } catch {
    return null;
  }
}

function parseQuery(queryString) {
  const params = {};
  queryString.split('&').forEach(pair => {
    const [key, value] = pair.split('=');
    if (key) {
      params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    }
  });
  return params;
}

async function run() {
  const ref = core.getInput('ref') || '';
  
  if (!ref) {
    console.log('No referrer provided, skipping UTM capture');
    return;
  }

  const url = parseUrl(ref);
  if (!url) {
    console.log('Invalid URL, skipping UTM capture');
    return;
  }

  const queryParams = parseQuery(url.search.slice(1));
  
  let utmSource = queryParams['utm_source'];
  let utmMedium = queryParams['utm_medium'];
  let utmCampaign = queryParams['utm_campaign'];
  let utmTerm = queryParams['utm_term'];
  let utmContent = queryParams['utm_content'];

  // If no utm_source, try platform click IDs
  if (!utmSource) {
    for (const [param, platform] of Object.entries(platformClickIDs)) {
      if (queryParams[param]) {
        utmSource = platform;
        console.log(`Detected platform from ${param}: ${platform}`);
        break;
      }
    }
  }

  // If still no utm_source, try non-standard params
  if (!utmSource) {
    for (const param of nonStandardParams) {
      if (queryParams[param]) {
        utmSource = queryParams[param];
        console.log(`Mapped ${param} to utm_source: ${utmSource}`);
        break;
      }
    }
  }

  // Set outputs
  if (utmSource) core.setOutput('utm_source', utmSource);
  if (utmMedium) core.setOutput('utm_medium', utmMedium);
  if (utmCampaign) core.setOutput('utm_campaign', utmCampaign);
  if (utmTerm) core.setOutput('utm_term', utmTerm);
  if (utmContent) core.setOutput('utm_content', utmContent);

  console.log('UTM Capture Results:');
  console.log(`  source: ${utmSource || '(none)'}`);
  console.log(`  medium: ${utmMedium || '(none)'}`);
  console.log(`  campaign: ${utmCampaign || '(none)'}`);
}

run().catch(error => {
  core.setFailed(error.message);
});
