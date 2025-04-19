async function analyzeCurrentTab(tabId) {
    try {
      const tab = await chrome.tabs.get(tabId);
      if (!tab.url) return null;
      
      // Get content script analysis
      const contentAnalysis = await chrome.tabs.sendMessage(tabId, {
        action: "analyzePage"
      }).catch(() => ({})); // Fallback if content script fails
      
      const domainAnalysis = analyzeDomain(tab.url);
      const { reportedSites = [] } = await chrome.storage.local.get('reportedSites');
      
      // Combined fraud determination
      const isFraudulent = (
        domainAnalysis.isSuspicious || 
        reportedSites.includes(tab.url) ||
        (contentAnalysis.fraudScore || 0) > 60
      );
      
      return {
        url: tab.url,
        ...domainAnalysis,
        ...contentAnalysis,
        isFraudulent,
        reasons: getFraudReasons(domainAnalysis, contentAnalysis, reportedSites),
        timestamp: Date.now()
      };
    } catch (error) {
      console.error("Tab analysis failed:", error);
      return null;
    }
  }
  
  function getFraudReasons(domainAnalysis, contentAnalysis, reportedSites) {
    const reasons = [];
    
    if (domainAnalysis.isSuspicious) {
      reasons.push("Suspicious domain pattern");
    }
    if (domainAnalysis.isIP) {
      reasons.push("Uses IP address instead of domain");
    }
    if ((contentAnalysis.fraudScore || 0) > 60) {
      reasons.push("High fraud probability score (" + contentAnalysis.fraudScore + ")");
    }
    if (reportedSites.includes(domainAnalysis.domain)) {
      reasons.push("Reported by users");
    }
    
    return reasons.length > 0 ? reasons : ["No clear fraud indicators"];
  }