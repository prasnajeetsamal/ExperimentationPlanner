import React from 'react';
import ResultsAnalysisTab from './ResultsAnalysisTab_Enhanced';

/**
 * Enhanced Demo Component for Results Analysis Tab
 * 
 * This demo showcases the new improvements:
 * 1. Reorganized layout (2-3-3 row structure)
 * 2. Dynamic number of variations
 * 3. Fixed multi-variant SRM checker
 * 4. Clarified metric type functionality
 */

export default function ResultsAnalysisDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 shadow-2xl border-b-4 border-indigo-400">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur rounded-2xl border-2 border-white/30">
              <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white tracking-tight">
                Enhanced Results Analysis
              </h1>
              <p className="text-indigo-100 text-sm mt-1">
                With improved layout, multi-variant support, and fixed SRM checker
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <ResultsAnalysisTab />
      </div>

      {/* Enhanced Quick Start Guide */}
      <div className="max-w-7xl mx-auto px-8 pb-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Quick Start Guide - What's New?
          </h2>
          
          <div className="space-y-6 text-sm text-gray-700">
            {/* New Features Section */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-4 rounded-r-lg">
              <h3 className="font-bold text-green-900 mb-3 text-lg">🎉 New Features & Improvements</h3>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-bold text-green-800 mb-1">1. Reorganized Layout (2-3-3 Structure)</h4>
                  <ul className="list-disc list-inside ml-4 space-y-1 text-green-700">
                    <li><strong>Row 1:</strong> Experiment & Metric selection (primary choices)</li>
                    <li><strong>Row 2:</strong> Traffic Split, Metric Type, Number of Variations</li>
                    <li><strong>Row 3:</strong> Test Type, Significance Level, Multiple Comparison Correction</li>
                    <li><strong>Row 4:</strong> Variant selection checkboxes (appears after experiment selection)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-green-800 mb-1">2. Dynamic Number of Variations</h4>
                  <ul className="list-disc list-inside ml-4 space-y-1 text-green-700">
                    <li>Specify anywhere from 1 to 26 variations (A through Z)</li>
                    <li>Automatically generates variant names (Variation A, B, C, etc.)</li>
                    <li>Data input table adjusts dynamically based on selected variants</li>
                    <li>Preview of generated names shown below the input field</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-green-800 mb-1">3. Fixed Multi-Variant SRM Checker</h4>
                  <ul className="list-disc list-inside ml-4 space-y-1 text-green-700">
                    <li>Now properly checks ALL groups (control + all variants)</li>
                    <li>Shows detailed traffic distribution table</li>
                    <li>Displays observed vs expected counts for each variant</li>
                    <li>Calculates correct chi-squared with proper degrees of freedom</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-green-800 mb-1">4. Clarified Metric Type</h4>
                  <ul className="list-disc list-inside ml-4 space-y-1 text-green-700">
                    <li>Auto-detects metric type when you select a metric</li>
                    <li>Tooltip explains the difference between Binary and Continuous</li>
                    <li>Manual override available if needed</li>
                    <li>Input fields change based on metric type selection</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Example 1: Simple Two-Variant Test */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-bold text-gray-900 mb-2">Example 1: Simple Two-Variant Test (Binary Metric)</h3>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>
                  <strong>Row 1:</strong> Select "Homepage Hero Banner Test" and "Conversion Rate"
                  <span className="block text-xs text-gray-600 ml-6 mt-1">
                    → Metric type auto-sets to "Binary"
                  </span>
                </li>
                <li>
                  <strong>Row 2:</strong> Keep default settings
                  <ul className="list-disc list-inside ml-6 mt-1 text-gray-600">
                    <li>Traffic Split: 50% (control gets 50%, variants split remaining 50%)</li>
                    <li>Metric Type: Binary (auto-selected)</li>
                    <li>Number of Variations: 2 (generates A and B)</li>
                  </ul>
                </li>
                <li>
                  <strong>Row 3:</strong> Adjust statistical parameters if needed
                  <ul className="list-disc list-inside ml-6 mt-1 text-gray-600">
                    <li>Test Type: Two-tailed (tests if there's ANY difference)</li>
                    <li>Significance: 0.05 (95% confidence)</li>
                    <li>Correction: Bonferroni (recommended for multiple variants)</li>
                  </ul>
                </li>
                <li>
                  <strong>Row 4:</strong> Check both "Variation A" and "Variation B"
                </li>
                <li>
                  <strong>Data Input:</strong> Enter your data
                  <div className="mt-2 bg-gray-50 rounded p-2 text-xs font-mono">
                    Control:     850 conversions, 10,000 sample size (8.5% rate)<br/>
                    Variation A: 920 conversions, 10,000 sample size (9.2% rate)<br/>
                    Variation B: 780 conversions, 10,000 sample size (7.8% rate)
                  </div>
                </li>
                <li>Click "Run Analysis" to see results</li>
              </ol>
            </div>

            {/* Example 2: Multi-Variant Test */}
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-bold text-gray-900 mb-2">Example 2: Multi-Variant Test (A/B/C/D)</h3>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>
                  <strong>Row 1:</strong> Select experiment and metric
                </li>
                <li>
                  <strong>Row 2:</strong> Customize for multi-variant
                  <ul className="list-disc list-inside ml-6 mt-1 text-gray-600">
                    <li>Traffic Split: 40% (control gets 40%, remaining 60% split among 4 variants = 15% each)</li>
                    <li>Number of Variations: 4 (generates A, B, C, D)</li>
                  </ul>
                </li>
                <li>
                  <strong>Row 3:</strong> Important for multiple variants!
                  <ul className="list-disc list-inside ml-6 mt-1 text-gray-600">
                    <li>Multiple Comparison Correction: <strong>Bonferroni or Holm</strong> (prevents false positives)</li>
                  </ul>
                </li>
                <li>
                  <strong>Row 4:</strong> Select which variants to analyze (can select all or subset)
                </li>
                <li>
                  <strong>SRM Check:</strong> Will verify traffic split across all 5 groups
                  <div className="mt-2 bg-gray-50 rounded p-2 text-xs">
                    Expected: Control=40%, A=15%, B=15%, C=15%, D=15%<br/>
                    Will flag if observed traffic differs significantly
                  </div>
                </li>
              </ol>
            </div>

            {/* Example 3: Continuous Metric */}
            <div className="border-l-4 border-amber-500 pl-4">
              <h3 className="font-bold text-gray-900 mb-2">Example 3: Continuous Metric Test (Revenue)</h3>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>
                  <strong>Row 1:</strong> Select "Revenue per Visitor"
                  <span className="block text-xs text-gray-600 ml-6 mt-1">
                    → Metric type auto-switches to "Continuous"
                  </span>
                </li>
                <li>
                  <strong>Row 2:</strong> Notice the metric type toggle
                  <ul className="list-disc list-inside ml-6 mt-1 text-gray-600">
                    <li>Hover over the ℹ️ icon to see explanation of Binary vs Continuous</li>
                    <li>You can manually toggle if needed (e.g., to test differently)</li>
                  </ul>
                </li>
                <li>
                  <strong>Data Input:</strong> Different fields for continuous metrics
                  <div className="mt-2 bg-gray-50 rounded p-2 text-xs font-mono">
                    Control:     Mean = $12.50, Std Dev = $25.30, n = 5,000<br/>
                    Variation A: Mean = $13.80, Std Dev = $26.10, n = 5,000
                  </div>
                </li>
                <li>
                  <strong>Analysis:</strong> Uses Welch's t-test instead of z-test
                  <span className="block text-xs text-gray-600 ml-6 mt-1">
                    → Effect size reported as Cohen's d instead of Cohen's h
                  </span>
                </li>
              </ol>
            </div>

            {/* Understanding the Results */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <h3 className="font-bold text-indigo-900 mb-3 text-lg">📊 Understanding Your Results</h3>
              
              <div className="space-y-3 text-indigo-800">
                <div>
                  <h4 className="font-bold mb-1">1. Executive Summary</h4>
                  <p className="text-sm">Shows the overall winner and whether any variant is significantly different</p>
                </div>

                <div>
                  <h4 className="font-bold mb-1">2. SRM Check (Critical!)</h4>
                  <p className="text-sm mb-1">Verifies your traffic split is correct:</p>
                  <ul className="list-disc list-inside ml-4 text-sm space-y-1">
                    <li><strong>Green (p ≥ 0.001):</strong> Traffic split looks good ✓</li>
                    <li><strong>Red (p &lt; 0.001):</strong> Traffic split is wrong - investigate before trusting results! ⚠</li>
                    <li><strong>New:</strong> Shows ALL groups in a detailed table with observed vs expected counts</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold mb-1">3. Per-Variant Analysis</h4>
                  <p className="text-sm mb-1">For each variant, you'll see:</p>
                  <ul className="list-disc list-inside ml-4 text-sm space-y-1">
                    <li><strong>Lift:</strong> Absolute and relative improvement over control</li>
                    <li><strong>Confidence Interval:</strong> Range where the true difference likely falls</li>
                    <li><strong>P-values:</strong> Raw and adjusted (if using correction)</li>
                    <li><strong>Effect Size:</strong> Practical significance (small/medium/large)</li>
                    <li><strong>Recommendation:</strong> Ship, Don't ship, or Hold decision</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold mb-1">4. Statistical Formulas</h4>
                  <p className="text-sm">Click to expand the methodology section at the bottom to see all formulas used</p>
                </div>
              </div>
            </div>

            {/* Pro Tips */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-bold text-yellow-900 mb-3 text-lg">💡 Pro Tips</h3>
              
              <ul className="space-y-2 text-yellow-800 text-sm">
                <li className="flex items-start gap-2">
                  <span className="font-bold min-w-fit">Traffic Split:</span>
                  <span>Set to match your actual experiment design. For equal allocation with 3 variants, control should be 25%. The remaining 75% automatically splits equally among selected variants.</span>
                </li>
                
                <li className="flex items-start gap-2">
                  <span className="font-bold min-w-fit">Multiple Testing:</span>
                  <span>Always use Bonferroni or Holm correction when testing 3+ variants to prevent false positives. This adjusts p-values to account for multiple comparisons.</span>
                </li>
                
                <li className="flex items-start gap-2">
                  <span className="font-bold min-w-fit">One-tailed vs Two-tailed:</span>
                  <span>Use two-tailed for "is there a difference?" (most common). Use one-tailed only if you're specifically testing "is variant BETTER than control?"</span>
                </li>
                
                <li className="flex items-start gap-2">
                  <span className="font-bold min-w-fit">SRM Failures:</span>
                  <span>If SRM check fails (p &lt; 0.001), check the detailed table to see which groups are off. Common causes: sampling bias, technical issues, or incorrect traffic allocation.</span>
                </li>
                
                <li className="flex items-start gap-2">
                  <span className="font-bold min-w-fit">Partial Analysis:</span>
                  <span>You can select a subset of variants to analyze (e.g., just A and C). Useful for comparing specific variants or running separate analyses.</span>
                </li>
              </ul>
            </div>

            {/* What Changed Section */}
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
              <h3 className="font-bold text-gray-900 mb-3 text-lg">🔄 What Changed from the Previous Version?</h3>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-bold text-red-700 mb-2">Before ❌</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>3-column then 5-column layout (unbalanced)</li>
                    <li>Limited to hardcoded variants (A & B only)</li>
                    <li>SRM only checked control vs combined variants</li>
                    <li>Metric type behavior unclear</li>
                    <li>No helper text or tooltips</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-bold text-green-700 mb-2">After ✅</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Clean 2-3-3 layout (balanced & logical)</li>
                    <li>Dynamic 1-26 variations (A through Z)</li>
                    <li>SRM checks ALL groups individually</li>
                    <li>Auto-detect with manual override + tooltip</li>
                    <li>Helper text and preview text everywhere</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
