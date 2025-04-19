function displayResults(analysis) {
    const resultsEl = document.getElementById('results');
    const statusEl = document.getElementById('status');
    
    if (!analysis) {
      showError("No analysis data received");
      return;
    }
  
    // Set status indicator
    statusEl.className = analysis.isFraudulent ? 'danger' : 'safe';
    statusEl.title = analysis.isFraudulent ? 'Potentially Fraudulent' : 'Appears Safe';
    
    let html = `
      <div class="result-item ${analysis.isFraudulent ? 'danger' : 'safe'}">
        <strong>URL:</strong> ${analysis.url}<br>
        <strong>Status:</strong> ${analysis.isFraudulent ? 
          '⚠️ Potentially Fraudulent' : '✓ Appears Safe'}
      </div>
    `;
  
    // Add detailed reasons
    if (analysis.reasons) {
      html += `<div class="result-item">
        <strong>Analysis:</strong>
        <ul style="margin-top: 5px; padding-left: 20px;">
          ${analysis.reasons.map(r => `<li>${r}</li>`).join('')}
        </ul>
      </div>`;
    }
  
    // Add fraud score if available
    if (analysis.fraudScore !== undefined) {
      html += `
      <div class="result-item">
        <strong>Fraud Risk Score:</strong> 
        <progress value="${analysis.fraudScore}" max="100" 
          style="vertical-align: middle; width: 100px;">
        </progress> ${analysis.fraudScore}/100
      </div>`;
    }
  
    resultsEl.innerHTML = html;
    document.getElementById('test-btn').addEventListener('click', () => {
        displayResults({
          url: "http://fake-paypal-login.com",
          isFraudulent: true,
          reasons: ["Mimics PayPal domain", "Contains password field"],
          fraudScore: 85
        });
      });
  }