// Enhanced fraud detection logic
function analyzePage() {
  const textAnalysis = analyzeText();
  const formAnalysis = analyzeForms();
  const linkAnalysis = analyzeLinks();
  
  // Calculate fraud score (0-100)
  let fraudScore = 0;
  
  // Text analysis (40% weight)
  if (textAnalysis.hasUrgency) fraudScore += 30;
  if (textAnalysis.hasSuspiciousKeywords) fraudScore += 10;
  if (textAnalysis.length < 200) fraudScore += 10; // Short content
  
  // Form analysis (30% weight)
  formAnalysis.forEach(form => {
    if (form.hasPassword) fraudScore += 15;
    if (form.isExternal) fraudScore += 15;
  });
  
  // Link analysis (20% weight)
  if (linkAnalysis.external > linkAnalysis.total * 0.5) {
    fraudScore += 20; // More than 50% external links
  }
  
  // Domain analysis (10% weight - will be added in background)
  
  return {
    textAnalysis,
    formAnalysis,
    linkAnalysis,
    fraudScore
  };
}