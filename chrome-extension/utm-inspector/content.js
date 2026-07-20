// UTM Inspector - Content Script
// Captures and stores UTM parameters from the current page

(function() {
  'use strict';

  // Platform click IDs
  const PLATFORM_CLICK_IDS = {
    'gclid': 'google',
    'fbclid': 'facebook',
    'msclkid': 'bing',
    'ttclid': 'tiktok',
    'li_fat_id': 'linkedin'
  };

  // Non-standard source params
  const NON_STANDARD_SOURCE_PARAMS = [
    'ref', 'referrer', 'refer', 'source', 'via', 'from', 'origin', 'src'
  ];

  function parseUtm() {
    const params = new URLSearchParams(window.location.search);
    const utm = {
      source: params.get('utm_source'),
      medium: params.get('utm_medium'),
      campaign: params.get('utm_campaign'),
      term: params.get('utm_term'),
      content: params.get('utm_content'),
      platform: null,
      rawRef: null,
      referrer: document.referrer
    };

    // If no utm_source, try platform click IDs
    if (!utm.source) {
      for (const [clickId, platform] of Object.entries(PLATFORM_CLICK_IDS)) {
        if (params.has(clickId)) {
          utm.source = platform;
          utm.platform = platform;
          break;
        }
      }
    }

    // If still no source, try non-standard params
    if (!utm.source) {
      for (const param of NON_STANDARD_SOURCE_PARAMS) {
        if (params.has(param)) {
          utm.source = params.get(param);
          utm.rawRef = param;
          break;
        }
      }
    }

    return utm;
  }

  function updateBadge() {
    const utm = parseUtm();
    const hasUtm = utm.source || utm.medium || utm.campaign;

    // Update badge
    chrome.runtime.sendMessage({
      type: 'UTM_DETECTED',
      utm: utm
    });
  }

  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'GET_UTM') {
      sendResponse(parseUtm());
    }
    return true;
  });

  // Initial detection
  updateBadge();
})();
