function displayResults(analysis) {
  const resultsEl = document.getElementById('results');
  const statusEl = document.getElementById('status');

  if (!analysis) {
    showError("No analysis data available.");
    return;
  }

  statusEl.className = analysis.isFraudulent ? 'danger' : 'safe';
  statusEl.title = analysis.isFraudulent ? 'Potential Threat' : 'Safe Site';

  let html = `
    <div class="result-item ${analysis.isFraudulent ? 'danger' : 'safe'}">
      <p><strong>URL:</strong> ${analysis.url}</p>
      <p><strong>Status:</strong> ${analysis.isFraudulent ? 
        '⚠️ Potential Threat' : '✅ Safe Site'}</p>
    </div>
  `;

  if (analysis.reasons?.length) {
    html += `
      <div class="result-item">
        <p><strong>Reasoning:</strong></p>
        <ul>${analysis.reasons.map(reason => `<li>${reason}</li>`).join('')}</ul>
      </div>
    `;
  }

  if (typeof analysis.fraudScore === 'number') {
    html += `
      <div class="result-item">
        <p><strong>Risk Score:</strong> 
          <progress value="${analysis.fraudScore}" max="100"></progress> ${analysis.fraudScore}/100
        </p>
      </div>
    `;
  }

  resultsEl.innerHTML = html;
}

function showError(message) {
  const resultsEl = document.getElementById('results');
  resultsEl.innerHTML = `<div class="result-item danger"><p>${message}</p></div>`;
}

document.addEventListener('DOMContentLoaded', () => {
  displayResults({
    url: "http://example-phishing.com",
    isFraudulent: true,
    reasons: ["Suspicious domain", "Password field without HTTPS"],
    fraudScore: 82
  });

  document.getElementById('test-btn').addEventListener('click', () => {
    displayResults({
      url: "http://clean-site.com",
      isFraudulent: false,
      reasons: ["HTTPS enabled", "No suspicious keywords found"],
      fraudScore: 10
    });
  });
});
