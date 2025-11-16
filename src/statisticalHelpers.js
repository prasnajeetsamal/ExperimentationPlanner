// ===== Statistical Helper Functions =====

// Normal CDF (cumulative distribution function)
export function normalCDF(x) {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp(-x * x / 2);
  const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return x > 0 ? 1 - prob : prob;
}

// T-distribution CDF approximation
export function tCDF(t, df) {
  if (df > 30) {
    return normalCDF(t);
  }
  
  const x = df / (df + t * t);
  const prob = 0.5 + 0.5 * Math.sign(t) * (1 - Math.pow(x, df / 2));
  return Math.max(0, Math.min(1, prob));
}

// Chi-squared CDF approximation
export function chiSquaredCDF(x, df) {
  if (x <= 0) return 0;
  if (df === 1) {
    return 2 * normalCDF(Math.sqrt(x)) - 1;
  }
  // Wilson-Hilferty approximation
  const z = Math.pow(x / df, 1/3) - (1 - 2/(9*df)) / Math.sqrt(2/(9*df));
  return normalCDF(z);
}

// Two-sample z-test for proportions (unpooled variance)
export function zTestProportionsUnpooled(p1, n1, p2, n2, tails = 2) {
  const se = Math.sqrt(p1 * (1 - p1) / n1 + p2 * (1 - p2) / n2);
  if (se === 0) return { zScore: 0, pValue: 1, se };
  
  const zScore = (p1 - p2) / se;
  const pValue = tails === 2 
    ? 2 * (1 - normalCDF(Math.abs(zScore)))
    : (p1 > p2 ? 1 - normalCDF(zScore) : normalCDF(zScore));
  
  return { zScore, pValue, se };
}

// Welch's t-test (unequal variances)
export function welchTTest(mean1, std1, n1, mean2, std2, n2, tails = 2) {
  const var1 = std1 * std1;
  const var2 = std2 * std2;
  const se = Math.sqrt(var1 / n1 + var2 / n2);
  
  if (se === 0) return { tScore: 0, pValue: 1, df: n1 + n2 - 2, se };
  
  const tScore = (mean1 - mean2) / se;
  
  // Welch-Satterthwaite degrees of freedom
  const df = Math.pow(var1 / n1 + var2 / n2, 2) /
    (Math.pow(var1 / n1, 2) / (n1 - 1) + Math.pow(var2 / n2, 2) / (n2 - 1));
  
  const pValue = tails === 2
    ? 2 * (1 - tCDF(Math.abs(tScore), df))
    : (mean1 > mean2 ? 1 - tCDF(tScore, df) : tCDF(tScore, df));
  
  return { tScore, pValue, df, se };
}

// Chi-squared test for Sample Ratio Mismatch
export function chiSquaredSRM(observedControl, observedVariant, expectedRatio = 0.5) {
  const total = observedControl + observedVariant;
  const expectedControl = total * expectedRatio;
  const expectedVariant = total * (1 - expectedRatio);
  
  const chiSq = Math.pow(observedControl - expectedControl, 2) / expectedControl +
                Math.pow(observedVariant - expectedVariant, 2) / expectedVariant;
  
  const pValue = 1 - chiSquaredCDF(chiSq, 1);
  
  return { chiSq, pValue, expectedControl, expectedVariant };
}

// Confidence interval for difference in proportions
export function ciDiffProportions(p1, n1, p2, n2, alpha = 0.05) {
  const se = Math.sqrt(p1 * (1 - p1) / n1 + p2 * (1 - p2) / n2);
  const zCritical = 1.96; // approximation for 95% CI
  
  const diff = p1 - p2;
  const margin = zCritical * se;
  
  return { lower: diff - margin, upper: diff + margin, diff };
}

// Confidence interval for difference in means
export function ciDiffMeans(mean1, std1, n1, mean2, std2, n2, alpha = 0.05) {
  const var1 = std1 * std1;
  const var2 = std2 * std2;
  const se = Math.sqrt(var1 / n1 + var2 / n2);
  
  const tCritical = 1.96; // approximation for large df
  
  const diff = mean1 - mean2;
  const margin = tCritical * se;
  
  return { lower: diff - margin, upper: diff + margin, diff };
}

// Cohen's h for proportions
export function cohensH(p1, p2) {
  const phi1 = 2 * Math.asin(Math.sqrt(p1));
  const phi2 = 2 * Math.asin(Math.sqrt(p2));
  return phi1 - phi2;
}

// Cohen's d for means
export function cohensD(mean1, std1, n1, mean2, std2, n2) {
  // Pooled standard deviation
  const pooledStd = Math.sqrt(((n1 - 1) * std1 * std1 + (n2 - 1) * std2 * std2) / (n1 + n2 - 2));
  return (mean1 - mean2) / pooledStd;
}

// Multiple testing corrections
export function bonferroniCorrection(pValues) {
  const m = pValues.length;
  return pValues.map(p => Math.min(p * m, 1));
}

export function holmBonferroniCorrection(pValues) {
  const m = pValues.length;
  const sorted = pValues.map((p, i) => ({ p, i })).sort((a, b) => a.p - b.p);
  const adjusted = new Array(m);
  
  for (let k = 0; k < m; k++) {
    const adjustedP = Math.min(sorted[k].p * (m - k), 1);
    adjusted[sorted[k].i] = k > 0 ? Math.max(adjustedP, adjusted[sorted[k - 1].i]) : adjustedP;
  }
  
  return adjusted;
}
