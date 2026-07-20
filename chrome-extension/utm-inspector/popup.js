// UTM Inspector - Popup Script

document.addEventListener('DOMContentLoaded', () => {
  const resultsEl = document.getElementById('results');

  // Get current tab's UTM
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: 'GET_UTM' }, (utm) => {
      if (!utm) {
        resultsEl.innerHTML = '<p class="no-utm">No UTM parameters detected</p>';
        return;
      }

      const hasUtm = utm.source || utm.medium || utm.campaign;
      
      let html = '';
      
      if (hasUtm) {
        html += '<p><span class="badge badge-active">UTM Detected</span></p>';
        
        if (utm.source) {
          html += `<div class="param">
            <span class="label">Source</span>
            <span class="value">${utm.source}</span>
          </div>`;
        }
        
        if (utm.medium) {
          html += `<div class="param">
            <span class="label">Medium</span>
            <span class="value">${utm.medium}</span>
          </div>`;
        }
        
        if (utm.campaign) {
          html += `<div class="param">
            <span class="label">Campaign</span>
            <span class="value">${utm.campaign}</span>
          </div>`;
        }
        
        if (utm.term) {
          html += `<div class="param">
            <span class="label">Term</span>
            <span class="value">${utm.term}</span>
          </div>`;
        }
        
        if (utm.content) {
          html += `<div class="param">
            <span class="label">Content</span>
            <span class="value">${utm.content}</span>
          </div>`;
        }
        
        if (utm.platform) {
          html += `<div class="param">
            <span class="label">Platform</span>
            <span class="value">${utm.platform}</span>
          </div>`;
        }
      } else {
        html += '<p><span class="badge badge-none">No UTM</span></p>';
        html += '<p class="no-utm">This page has no UTM parameters</p>';
      }

      resultsEl.innerHTML = html;
    });
  });
});
