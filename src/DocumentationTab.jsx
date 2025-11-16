import React, { useState } from "react";
import { 
  BookOpen, ChevronDown, ChevronRight, AlertTriangle, 
  CheckCircle2, Info, Zap, TrendingUp, Target, Calculator,
  HelpCircle, Lightbulb, Award, BarChart3, Settings, XCircle
} from "lucide-react";

// Collapsible Section Component
function CollapsibleSection({ title, icon: Icon, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 flex items-center justify-between transition-all"
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon size={20} className="text-indigo-600" />}
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        </div>
        {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-white">
          {children}
        </div>
      )}
    </div>
  );
}

export default function DocumentationTab() {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-8 mb-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-white/20 backdrop-blur rounded-xl">
            <BookOpen size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Results Analysis Documentation</h1>
            <p className="text-indigo-100 mt-1">Complete guide to understanding and using the analysis tool</p>
          </div>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
          <Lightbulb size={18} />
          Quick Navigation
        </h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <a href="#getting-started" className="text-blue-700 hover:text-blue-900 hover:underline">→ Getting Started</a>
          <a href="#configuration" className="text-blue-700 hover:text-blue-900 hover:underline">→ Configuration Guide</a>
          <a href="#metric-types" className="text-blue-700 hover:text-blue-900 hover:underline">→ Metric Types</a>
          <a href="#statistical-tests" className="text-blue-700 hover:text-blue-900 hover:underline">→ Statistical Tests</a>
          <a href="#srm-check" className="text-blue-700 hover:text-blue-900 hover:underline">→ SRM Check</a>
          <a href="#interpreting" className="text-blue-700 hover:text-blue-900 hover:underline">→ Interpreting Results</a>
          <a href="#common-mistakes" className="text-blue-700 hover:text-blue-900 hover:underline">→ Common Mistakes</a>
          <a href="#faq" className="text-blue-700 hover:text-blue-900 hover:underline">→ FAQ</a>
        </div>
      </div>

      {/* Getting Started */}
      <CollapsibleSection title="Getting Started" icon={Target} defaultOpen={true}>
        <div id="getting-started" className="space-y-4">
          <p className="text-gray-700">
            The Results Analysis tool helps you determine if your experiment variations performed better than the control group. 
            Follow these 5 simple steps to analyze your experiment:
          </p>
          
          <div className="space-y-4">
            <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded-r-lg">
              <div className="flex items-start gap-3">
                <div className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Select Experiment & Metric</h4>
                  <p className="text-sm text-gray-700">Choose which experiment you're analyzing and what metric you want to measure (e.g., Conversion Rate, Revenue per Visitor).</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded-r-lg">
              <div className="flex items-start gap-3">
                <div className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Configure Traffic & Variations</h4>
                  <p className="text-sm text-gray-700">Set your traffic split (% to control), confirm the metric type (Binary or Continuous), and specify how many variations you're testing.</p>
                </div>
              </div>
            </div>

            <div className="bg-pink-50 border-l-4 border-pink-600 p-4 rounded-r-lg">
              <div className="flex items-start gap-3">
                <div className="bg-pink-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Set Statistical Parameters</h4>
                  <p className="text-sm text-gray-700">Choose test type (one-tailed vs two-tailed), significance level (usually 0.05), and whether to apply multiple comparison correction.</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-r-lg">
              <div className="flex items-start gap-3">
                <div className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Select Variants to Analyze</h4>
                  <p className="text-sm text-gray-700">Check the boxes for which variations you want to include in your analysis. You can analyze all variants or just a subset.</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border-l-4 border-orange-600 p-4 rounded-r-lg">
              <div className="flex items-start gap-3">
                <div className="bg-orange-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">5</div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Enter Data & Run Analysis</h4>
                  <p className="text-sm text-gray-700">Input your experiment data (conversions & sample sizes for binary metrics, or mean/std dev for continuous metrics) and click "Run Analysis".</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Configuration Guide */}
      <CollapsibleSection title="Configuration Guide" icon={Settings}>
        <div id="configuration" className="space-y-6">
          
          {/* Traffic Split */}
          <div>
            <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <TrendingUp size={16} className="text-indigo-600" />
              Traffic Split (% Control)
            </h4>
            <p className="text-sm text-gray-700 mb-3">
              This setting determines what percentage of your total traffic was allocated to the control group. 
              The remaining percentage is automatically split equally among all variations.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <p className="font-semibold text-gray-900">Examples:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li><strong>50% control, 2 variations:</strong> Control = 50%, Var A = 25%, Var B = 25%</li>
                <li><strong>40% control, 3 variations:</strong> Control = 40%, Var A = 20%, Var B = 20%, Var C = 20%</li>
                <li><strong>25% control, 3 variations:</strong> Control = 25%, Var A = 25%, Var B = 25%, Var C = 25% (equal split)</li>
              </ul>
            </div>
            <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
              <strong className="text-yellow-900">⚠️ Important:</strong>
              <span className="text-yellow-800"> Make sure this matches your actual experiment setup! Incorrect values will cause SRM (Sample Ratio Mismatch) failures.</span>
            </div>
          </div>

          {/* Number of Variations */}
          <div>
            <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <BarChart3 size={16} className="text-indigo-600" />
              Number of Variations
            </h4>
            <p className="text-sm text-gray-700 mb-3">
              Specify how many test variations you have (not including control). The tool will automatically generate variant names (A, B, C, etc.).
            </p>
            <div className="bg-gray-50 rounded-lg p-4 text-sm">
              <p className="font-semibold text-gray-900 mb-2">Supported range: 1-26 variations</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>1 variation → Generates: Variation A (simple A/B test)</li>
                <li>2 variations → Generates: Variation A, B</li>
                <li>5 variations → Generates: Variation A, B, C, D, E</li>
              </ul>
            </div>
          </div>

          {/* Test Type */}
          <div>
            <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Calculator size={16} className="text-indigo-600" />
              Test Type: One-Tailed vs Two-Tailed
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="font-bold text-blue-900 mb-2">Two-Tailed (≠)</h5>
                <p className="text-blue-800 mb-2">Tests if there is <strong>ANY difference</strong> between variant and control (better OR worse).</p>
                <p className="text-blue-700 text-xs"><strong>Use when:</strong> You want to know "Is there a difference?" (most common)</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h5 className="font-bold text-green-900 mb-2">One-Tailed (&gt;)</h5>
                <p className="text-green-800 mb-2">Tests if variant is <strong>specifically better</strong> than control (directional hypothesis).</p>
                <p className="text-green-700 text-xs"><strong>Use when:</strong> You have strong prior belief that variant can only improve, never hurt</p>
              </div>
            </div>
            <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
              <strong className="text-blue-900">💡 Recommendation:</strong>
              <span className="text-blue-800"> Use two-tailed tests unless you have a very strong reason to use one-tailed. Two-tailed is more conservative and standard in industry.</span>
            </div>
          </div>

          {/* Significance Level */}
          <div>
            <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Award size={16} className="text-indigo-600" />
              Significance Level (α)
            </h4>
            <p className="text-sm text-gray-700 mb-3">
              The probability threshold for declaring a result "statistically significant". It represents the acceptable risk of a false positive (Type I error).
            </p>
            <div className="space-y-2 text-sm">
              <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-gray-400">
                <strong>α = 0.05 (95% confidence)</strong> - Standard choice. Means 5% chance of false positive.
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-blue-400">
                <strong>α = 0.01 (99% confidence)</strong> - More conservative. Use for high-stakes decisions.
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-orange-400">
                <strong>α = 0.10 (90% confidence)</strong> - Less conservative. Use for exploratory tests.
              </div>
            </div>
          </div>

          {/* Multiple Comparison Correction */}
          <div>
            <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-indigo-600" />
              Multiple Comparison Correction
            </h4>
            <p className="text-sm text-gray-700 mb-3">
              When testing multiple variations, you increase the risk of finding false positives. Correction methods adjust p-values to control this risk.
            </p>
            <div className="space-y-3 text-sm">
              <div className="bg-gray-50 rounded-lg p-3">
                <h5 className="font-bold text-gray-900 mb-1">None</h5>
                <p className="text-gray-700">No adjustment. Use for 1-2 variations where false positive risk is acceptable.</p>
              </div>
              <div className="bg-red-50 rounded-lg p-3 border-l-4 border-red-500">
                <h5 className="font-bold text-red-900 mb-1">Bonferroni</h5>
                <p className="text-red-800 mb-2">Multiplies each p-value by the number of tests. Very conservative.</p>
                <p className="text-red-700 text-xs"><strong>Use when:</strong> Testing 3+ variations and want strong control over false positives</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-3 border-l-4 border-orange-500">
                <h5 className="font-bold text-orange-900 mb-1">Holm-Bonferroni</h5>
                <p className="text-orange-800 mb-2">Sequential step-down procedure. Less conservative than Bonferroni while still controlling error rate.</p>
                <p className="text-orange-700 text-xs"><strong>Use when:</strong> Testing 3+ variations and want balanced power/control</p>
              </div>
            </div>
            <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
              <strong className="text-red-900">⚠️ Critical:</strong>
              <span className="text-red-800"> ALWAYS use correction (Bonferroni or Holm) when testing 3 or more variations. Without it, your false positive rate inflates dramatically!</span>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Metric Types */}
      <CollapsibleSection title="Understanding Metric Types" icon={BarChart3}>
        <div id="metric-types" className="space-y-6">
          
          <div className="grid grid-cols-2 gap-6">
            {/* Binary Metrics */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
              <h4 className="font-bold text-blue-900 mb-3 text-lg">Binary Metrics (Proportions)</h4>
              
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-blue-800 mb-1">What are they?</p>
                  <p className="text-blue-700">Metrics that measure rates or proportions - things that either happen or don't happen.</p>
                </div>

                <div>
                  <p className="font-semibold text-blue-800 mb-1">Examples:</p>
                  <ul className="list-disc list-inside text-blue-700 space-y-1 ml-4">
                    <li>Conversion Rate</li>
                    <li>Click-Through Rate</li>
                    <li>Add-to-Bag Rate</li>
                    <li>Bounce Rate</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold text-blue-800 mb-1">Data Required:</p>
                  <ul className="list-disc list-inside text-blue-700 space-y-1 ml-4">
                    <li><strong>Conversions:</strong> Number of successes</li>
                    <li><strong>Sample Size:</strong> Total number of observations</li>
                  </ul>
                </div>

                <div className="bg-blue-100 rounded p-3">
                  <p className="font-semibold text-blue-900 mb-1">Example Data:</p>
                  <div className="font-mono text-xs text-blue-800">
                    Conversions: 850<br/>
                    Sample Size: 10,000<br/>
                    → Rate: 8.5%
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-blue-800 mb-1">Statistical Test:</p>
                  <p className="text-blue-700">Two-sample z-test for proportions (unpooled variance)</p>
                </div>

                <div>
                  <p className="font-semibold text-blue-800 mb-1">Effect Size:</p>
                  <p className="text-blue-700">Cohen's h</p>
                </div>
              </div>
            </div>

            {/* Continuous Metrics */}
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
              <h4 className="font-bold text-green-900 mb-3 text-lg">Continuous Metrics (Averages)</h4>
              
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-green-800 mb-1">What are they?</p>
                  <p className="text-green-700">Metrics that measure averages or means - numerical values that can vary continuously.</p>
                </div>

                <div>
                  <p className="font-semibold text-green-800 mb-1">Examples:</p>
                  <ul className="list-disc list-inside text-green-700 space-y-1 ml-4">
                    <li>Revenue per Visitor</li>
                    <li>Average Order Value</li>
                    <li>Time on Site</li>
                    <li>Page Load Time</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold text-green-800 mb-1">Data Required:</p>
                  <ul className="list-disc list-inside text-green-700 space-y-1 ml-4">
                    <li><strong>Mean (μ):</strong> Average value</li>
                    <li><strong>Std Dev (σ):</strong> Standard deviation</li>
                    <li><strong>Sample Size (n):</strong> Number of observations</li>
                  </ul>
                </div>

                <div className="bg-green-100 rounded p-3">
                  <p className="font-semibold text-green-900 mb-1">Example Data:</p>
                  <div className="font-mono text-xs text-green-800">
                    Mean: $12.50<br/>
                    Std Dev: $25.30<br/>
                    Sample Size: 5,000
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-green-800 mb-1">Statistical Test:</p>
                  <p className="text-green-700">Welch's two-sample t-test (unequal variances)</p>
                </div>

                <div>
                  <p className="font-semibold text-green-800 mb-1">Effect Size:</p>
                  <p className="text-green-700">Cohen's d</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
            <strong className="text-yellow-900">💡 Pro Tip:</strong>
            <span className="text-yellow-800"> The metric type is auto-detected when you select a metric, but you can manually override it if needed. Most of the time, the auto-detection will be correct!</span>
          </div>
        </div>
      </CollapsibleSection>

      {/* Statistical Tests */}
      <CollapsibleSection title="Statistical Tests Explained" icon={Calculator}>
        <div id="statistical-tests" className="space-y-6">
          
          {/* Z-Test */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-bold text-blue-900 mb-3 text-lg">Two-Sample Z-Test for Proportions</h4>
            <p className="text-sm text-blue-800 mb-4">Used for Binary Metrics to compare two proportions (e.g., conversion rates).</p>
            
            <div className="bg-white rounded-lg p-4 mb-4">
              <p className="font-semibold text-gray-900 mb-2 text-sm">Formula:</p>
              <div className="bg-gray-50 rounded p-3 font-mono text-sm text-gray-800">
                z = (p₁ - p₂) / SE<br/>
                SE = √(p₁(1-p₁)/n₁ + p₂(1-p₂)/n₂)
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <p><strong className="text-blue-900">Where:</strong></p>
              <ul className="list-disc list-inside text-blue-800 space-y-1 ml-4">
                <li>p₁, p₂ = proportions for variant and control</li>
                <li>n₁, n₂ = sample sizes for variant and control</li>
                <li>SE = standard error</li>
              </ul>
            </div>

            <div className="mt-4 bg-blue-100 rounded p-3 text-sm">
              <strong className="text-blue-900">Why unpooled variance?</strong>
              <p className="text-blue-800">We use unpooled variance (separate variances for each group) because it's more conservative and doesn't assume equal variance between groups.</p>
            </div>
          </div>

          {/* T-Test */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h4 className="font-bold text-green-900 mb-3 text-lg">Welch's Two-Sample T-Test</h4>
            <p className="text-sm text-green-800 mb-4">Used for Continuous Metrics to compare two means (e.g., average revenue).</p>
            
            <div className="bg-white rounded-lg p-4 mb-4">
              <p className="font-semibold text-gray-900 mb-2 text-sm">Formula:</p>
              <div className="bg-gray-50 rounded p-3 font-mono text-sm text-gray-800">
                t = (μ₁ - μ₂) / SE<br/>
                SE = √(σ₁²/n₁ + σ₂²/n₂)<br/>
                df = (σ₁²/n₁ + σ₂²/n₂)² / [(σ₁²/n₁)²/(n₁-1) + (σ₂²/n₂)²/(n₂-1)]
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <p><strong className="text-green-900">Where:</strong></p>
              <ul className="list-disc list-inside text-green-800 space-y-1 ml-4">
                <li>μ₁, μ₂ = means for variant and control</li>
                <li>σ₁, σ₂ = standard deviations</li>
                <li>n₁, n₂ = sample sizes</li>
                <li>df = degrees of freedom (Welch-Satterthwaite approximation)</li>
              </ul>
            </div>

            <div className="mt-4 bg-green-100 rounded p-3 text-sm">
              <strong className="text-green-900">Why Welch's t-test?</strong>
              <p className="text-green-800">Welch's version doesn't assume equal variances between groups, making it more robust than Student's t-test. It's the recommended choice for A/B testing.</p>
            </div>
          </div>

          {/* Effect Sizes */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h4 className="font-bold text-purple-900 mb-3 text-lg">Effect Sizes</h4>
            <p className="text-sm text-purple-800 mb-4">Effect sizes measure the practical significance (magnitude of difference), not just statistical significance.</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <h5 className="font-bold text-gray-900 mb-2 text-sm">Cohen's h (for proportions)</h5>
                <div className="bg-gray-50 rounded p-3 font-mono text-xs text-gray-800 mb-3">
                  h = 2×arcsin(√p₁) - 2×arcsin(√p₂)
                </div>
                <div className="space-y-1 text-xs">
                  <p><strong>|h| &lt; 0.2:</strong> Small effect</p>
                  <p><strong>0.2 ≤ |h| &lt; 0.5:</strong> Medium effect</p>
                  <p><strong>|h| ≥ 0.5:</strong> Large effect</p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4">
                <h5 className="font-bold text-gray-900 mb-2 text-sm">Cohen's d (for means)</h5>
                <div className="bg-gray-50 rounded p-3 font-mono text-xs text-gray-800 mb-3">
                  d = (μ₁ - μ₂) / pooled_SD
                </div>
                <div className="space-y-1 text-xs">
                  <p><strong>|d| &lt; 0.2:</strong> Small effect</p>
                  <p><strong>0.2 ≤ |d| &lt; 0.5:</strong> Medium effect</p>
                  <p><strong>|d| ≥ 0.5:</strong> Large effect</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* SRM Check */}
      <CollapsibleSection title="Sample Ratio Mismatch (SRM) Check" icon={AlertTriangle}>
        <div id="srm-check" className="space-y-6">
          <p className="text-gray-700">
            The SRM check verifies that your experiment's traffic allocation matches what you expected. 
            This is <strong>critical</strong> - if SRM fails, your results may be unreliable!
          </p>

          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
            <h4 className="font-bold text-red-900 mb-3 flex items-center gap-2">
              <AlertTriangle size={20} />
              Why SRM Check is Critical
            </h4>
            <p className="text-sm text-red-800 mb-3">
              If your actual traffic split doesn't match your expected split, it suggests:
            </p>
            <ul className="list-disc list-inside text-sm text-red-800 space-y-2 ml-4">
              <li><strong>Randomization issues:</strong> Users aren't being randomly assigned</li>
              <li><strong>Technical bugs:</strong> Code errors in experiment implementation</li>
              <li><strong>Selection bias:</strong> Certain types of users are ending up in specific groups</li>
              <li><strong>Data collection problems:</strong> Missing data from some groups</li>
            </ul>
            <div className="mt-4 bg-red-100 rounded p-3 text-sm font-semibold text-red-900">
              ⚠️ If SRM fails (p &lt; 0.001), DO NOT trust the experiment results! Investigate the issue before making decisions.
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-3">How It Works</h4>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
              <div>
                <p className="font-semibold text-gray-900">1. You specify expected traffic allocation</p>
                <p className="text-gray-700">Example: 50% control, 25% variant A, 25% variant B</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">2. Tool calculates expected sample sizes</p>
                <div className="font-mono text-xs text-gray-700 bg-white rounded p-2 mt-1">
                  Total = 20,000 users<br/>
                  Expected: Control=10,000, A=5,000, B=5,000
                </div>
              </div>
              <div>
                <p className="font-semibold text-gray-900">3. Compares actual vs expected using Chi-squared test</p>
                <div className="font-mono text-xs text-gray-700 bg-white rounded p-2 mt-1">
                  χ² = Σ((Observed - Expected)² / Expected)<br/>
                  df = k - 1 (where k = number of groups)
                </div>
              </div>
              <div>
                <p className="font-semibold text-gray-900">4. Calculates p-value</p>
                <ul className="list-disc list-inside text-gray-700 ml-4 mt-1">
                  <li>p ≥ 0.001 → No SRM detected ✓</li>
                  <li>p &lt; 0.001 → SRM detected! ⚠️</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-3">Example: Good vs Bad</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-300 rounded-lg p-4">
                <h5 className="font-bold text-green-900 mb-2 text-sm">✓ Good: No SRM</h5>
                <div className="text-xs space-y-1 text-green-800">
                  <p>Expected: 50% / 25% / 25%</p>
                  <p>Observed: 10,050 / 4,980 / 4,970</p>
                  <p className="font-mono">χ² = 0.52, p = 0.77</p>
                  <p className="font-semibold mt-2">→ Traffic looks good!</p>
                </div>
              </div>
              <div className="bg-red-50 border border-red-300 rounded-lg p-4">
                <h5 className="font-bold text-red-900 mb-2 text-sm">✗ Bad: SRM Detected</h5>
                <div className="text-xs space-y-1 text-red-800">
                  <p>Expected: 50% / 25% / 25%</p>
                  <p>Observed: 12,000 / 5,000 / 3,000</p>
                  <p className="font-mono">χ² = 733.3, p &lt; 0.001</p>
                  <p className="font-semibold mt-2">→ STOP! Investigate!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Interpreting Results */}
      <CollapsibleSection title="Interpreting Your Results" icon={TrendingUp}>
        <div id="interpreting" className="space-y-6">
          
          <div>
            <h4 className="font-bold text-gray-900 mb-3">Executive Summary</h4>
            <p className="text-sm text-gray-700 mb-3">
              The executive summary gives you the bottom-line answer: which variant (if any) won the test.
            </p>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="bg-green-50 border border-green-300 rounded-lg p-4">
                <h5 className="font-bold text-green-900 mb-2">Positive Winner</h5>
                <p className="text-green-800">A variant beat control with statistical significance. Recommendation: Ship it!</p>
              </div>
              <div className="bg-red-50 border border-red-300 rounded-lg p-4">
                <h5 className="font-bold text-red-900 mb-2">Control Wins</h5>
                <p className="text-red-800">Variant(s) performed significantly worse. Recommendation: Keep control.</p>
              </div>
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                <h5 className="font-bold text-gray-900 mb-2">No Difference</h5>
                <p className="text-gray-800">No statistically significant difference found. Recommendation: Hold/iterate.</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-3">Understanding P-Values</h4>
            <p className="text-sm text-gray-700 mb-3">
              The p-value tells you the probability of seeing this result (or more extreme) if there was actually no difference between groups.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex items-center justify-between p-2 bg-white rounded">
                <span className="font-semibold">p &lt; 0.001</span>
                <span className="text-gray-700">Very strong evidence of difference</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white rounded">
                <span className="font-semibold">0.001 ≤ p &lt; 0.01</span>
                <span className="text-gray-700">Strong evidence</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white rounded">
                <span className="font-semibold">0.01 ≤ p &lt; 0.05</span>
                <span className="text-gray-700">Moderate evidence (standard threshold)</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white rounded">
                <span className="font-semibold">0.05 ≤ p &lt; 0.10</span>
                <span className="text-gray-700">Weak evidence (marginally significant)</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white rounded">
                <span className="font-semibold">p ≥ 0.10</span>
                <span className="text-gray-700">Insufficient evidence</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-3">Confidence Intervals</h4>
            <p className="text-sm text-gray-700 mb-3">
              The confidence interval shows the range where the true difference likely falls (with 95% confidence).
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
              <div className="text-sm">
                <p className="font-semibold text-blue-900 mb-1">Example: [-0.005, 0.032]</p>
                <p className="text-blue-800">We're 95% confident the true difference is between -0.5% and +3.2%.</p>
              </div>
              <div className="bg-blue-100 rounded p-3 text-sm">
                <p className="font-semibold text-blue-900 mb-1">Interpretation Tips:</p>
                <ul className="list-disc list-inside text-blue-800 space-y-1 ml-4">
                  <li><strong>Doesn't include 0:</strong> Statistically significant</li>
                  <li><strong>Includes 0:</strong> Not statistically significant</li>
                  <li><strong>Wide interval:</strong> More uncertainty, may need more data</li>
                  <li><strong>Narrow interval:</strong> More precise estimate</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-3">Recommendations</h4>
            <div className="space-y-3 text-sm">
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                <h5 className="font-bold text-green-900 mb-1">"Ship variation"</h5>
                <p className="text-green-800">Statistically significant positive lift. The variant is better than control. Go ahead and implement it!</p>
              </div>
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                <h5 className="font-bold text-red-900 mb-1">"Do not ship"</h5>
                <p className="text-red-800">Statistically significant negative lift. The variant hurts the metric. Keep the control.</p>
              </div>
              <div className="bg-gray-50 border-l-4 border-gray-500 p-4 rounded-r-lg">
                <h5 className="font-bold text-gray-900 mb-1">"Hold – inconclusive"</h5>
                <p className="text-gray-800">Not statistically significant. Could mean: (1) No real difference, (2) Difference exists but sample size too small, or (3) Effect is very small. Consider running longer or iterating on the variant.</p>
              </div>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Common Mistakes */}
      <CollapsibleSection title="Common Mistakes to Avoid" icon={XCircle}>
        <div id="common-mistakes" className="space-y-4">
          
          <div className="bg-red-50 border border-red-300 rounded-lg p-4">
            <h4 className="font-bold text-red-900 mb-2 flex items-center gap-2">
              <XCircle size={18} />
              1. Ignoring SRM Check
            </h4>
            <p className="text-sm text-red-800 mb-2">
              <strong>Mistake:</strong> Looking at results without checking if SRM passed.
            </p>
            <p className="text-sm text-red-700">
              <strong>Why it's bad:</strong> If SRM fails, your randomization is broken and results are unreliable.
            </p>
            <p className="text-sm text-red-900 font-semibold mt-2">
              ✓ Always check SRM FIRST before looking at any other results!
            </p>
          </div>

          <div className="bg-orange-50 border border-orange-300 rounded-lg p-4">
            <h4 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
              <AlertTriangle size={18} />
              2. Not Using Multiple Comparison Correction
            </h4>
            <p className="text-sm text-orange-800 mb-2">
              <strong>Mistake:</strong> Testing 5 variants without any correction method.
            </p>
            <p className="text-sm text-orange-700 mb-2">
              <strong>Why it's bad:</strong> Your false positive rate inflates! With 5 tests at α=0.05, you have ~23% chance of at least one false positive.
            </p>
            <p className="text-sm text-orange-900 font-semibold mt-2">
              ✓ Always use Bonferroni or Holm correction when testing 3+ variants!
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
            <h4 className="font-bold text-yellow-900 mb-2 flex items-center gap-2">
              <Info size={18} />
              3. P-Hacking / Changing Alpha After Seeing Results
            </h4>
            <p className="text-sm text-yellow-800 mb-2">
              <strong>Mistake:</strong> "p = 0.06? Let's use α = 0.10 instead!"
            </p>
            <p className="text-sm text-yellow-700 mb-2">
              <strong>Why it's bad:</strong> This is data manipulation and invalidates your statistical guarantees.
            </p>
            <p className="text-sm text-yellow-900 font-semibold mt-2">
              ✓ Set your significance level BEFORE running the experiment and stick to it!
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-300 rounded-lg p-4">
            <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
              <Info size={18} />
              4. Confusing Statistical vs Practical Significance
            </h4>
            <p className="text-sm text-blue-800 mb-2">
              <strong>Mistake:</strong> "p &lt; 0.05, so we should ship!" (but lift is only 0.1%)
            </p>
            <p className="text-sm text-blue-700 mb-2">
              <strong>Why it's bad:</strong> Small improvements might not be worth the implementation cost.
            </p>
            <p className="text-sm text-blue-900 font-semibold mt-2">
              ✓ Consider both statistical significance AND practical importance (effect size, business impact)!
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-300 rounded-lg p-4">
            <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
              <AlertTriangle size={18} />
              5. Stopping Early When Seeing Significance
            </h4>
            <p className="text-sm text-purple-800 mb-2">
              <strong>Mistake:</strong> "We got p &lt; 0.05 after 3 days, let's stop!"
            </p>
            <p className="text-sm text-purple-700 mb-2">
              <strong>Why it's bad:</strong> Early stopping inflates false positive rates. p-values fluctuate over time.
            </p>
            <p className="text-sm text-purple-900 font-semibold mt-2">
              ✓ Run the experiment for the planned duration based on your sample size calculation!
            </p>
          </div>

          <div className="bg-pink-50 border border-pink-300 rounded-lg p-4">
            <h4 className="font-bold text-pink-900 mb-2 flex items-center gap-2">
              <Info size={18} />
              6. Wrong Metric Type
            </h4>
            <p className="text-sm text-pink-800 mb-2">
              <strong>Mistake:</strong> Using Binary type for revenue data, or Continuous for conversion rate.
            </p>
            <p className="text-sm text-pink-700 mb-2">
              <strong>Why it's bad:</strong> Wrong statistical test leads to invalid results.
            </p>
            <p className="text-sm text-pink-900 font-semibold mt-2">
              ✓ Binary = proportions/rates. Continuous = averages/means. Check the auto-detection!
            </p>
          </div>
        </div>
      </CollapsibleSection>

      {/* FAQ */}
      <CollapsibleSection title="Frequently Asked Questions (FAQ)" icon={HelpCircle}>
        <div id="faq" className="space-y-4">
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-bold text-gray-900 mb-2">Q: What's the difference between raw and adjusted p-values?</h4>
            <p className="text-sm text-gray-700">
              <strong>A:</strong> Raw p-values are from individual tests. Adjusted p-values account for multiple comparisons. 
              When testing multiple variants, use adjusted p-values (from Bonferroni/Holm correction) to make decisions.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-bold text-gray-900 mb-2">Q: Can I run multiple metrics on the same experiment?</h4>
            <p className="text-sm text-gray-700">
              <strong>A:</strong> Yes! But analyze each metric separately. Apply multiple comparison correction within each metric 
              (if testing multiple variants), but you don't need to correct across different metrics unless they're related.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-bold text-gray-900 mb-2">Q: My p-value is 0.051. Is it significant?</h4>
            <p className="text-sm text-gray-700">
              <strong>A:</strong> No, not at the standard α = 0.05 level. Don't round down! The threshold is strict. 
              That said, you might consider it "marginally significant" and worth investigating further or running a follow-up test.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-bold text-gray-900 mb-2">Q: What if I have unequal sample sizes between groups?</h4>
            <p className="text-sm text-gray-700">
              <strong>A:</strong> That's fine! The statistical tests (z-test and Welch's t-test) handle unequal sample sizes. 
              Just make sure your traffic split setting matches your actual allocation, or SRM check will fail.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-bold text-gray-900 mb-2">Q: How do I know if I need more data?</h4>
            <p className="text-sm text-gray-700">
              <strong>A:</strong> If you get "Hold – inconclusive" results but suspect there might be a difference, 
              you probably need more data. Also look at the confidence interval width - very wide intervals suggest more data would help.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-bold text-gray-900 mb-2">Q: Can I analyze a subset of variants?</h4>
            <p className="text-sm text-gray-700">
              <strong>A:</strong> Yes! You can select which variants to include in the analysis. This is useful for 
              comparing specific variants or running separate analyses for different groups.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-bold text-gray-900 mb-2">Q: What's a good effect size?</h4>
            <p className="text-sm text-gray-700">
              <strong>A:</strong> It depends on your business context! Generally: small (&lt;0.2) might not be worth the effort, 
              medium (0.2-0.5) is typically valuable, large (&gt;0.5) is great. But a 0.1% lift in revenue might be worth millions!
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-bold text-gray-900 mb-2">Q: Should I use one-tailed or two-tailed tests?</h4>
            <p className="text-sm text-gray-700">
              <strong>A:</strong> Almost always use two-tailed. One-tailed should only be used if you have very strong prior 
              knowledge that the variant can only improve (never hurt) the metric, which is rare in practice.
            </p>
          </div>
        </div>
      </CollapsibleSection>

      {/* Quick Reference */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300 rounded-lg p-6 mt-8">
        <h3 className="font-bold text-indigo-900 mb-4 text-lg flex items-center gap-2">
          <Zap size={20} />
          Quick Decision Matrix
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-indigo-300">
                <th className="text-left py-2 px-3 font-bold text-indigo-900">SRM Check</th>
                <th className="text-left py-2 px-3 font-bold text-indigo-900">P-value</th>
                <th className="text-left py-2 px-3 font-bold text-indigo-900">Lift</th>
                <th className="text-left py-2 px-3 font-bold text-indigo-900">Decision</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr className="border-b border-indigo-200">
                <td className="py-2 px-3">❌ Fails</td>
                <td className="py-2 px-3">Any</td>
                <td className="py-2 px-3">Any</td>
                <td className="py-2 px-3 font-semibold text-red-700">STOP - Investigate traffic issue</td>
              </tr>
              <tr className="border-b border-indigo-200">
                <td className="py-2 px-3">✓ Passes</td>
                <td className="py-2 px-3">&lt; α</td>
                <td className="py-2 px-3">Positive</td>
                <td className="py-2 px-3 font-semibold text-green-700">Ship variation</td>
              </tr>
              <tr className="border-b border-indigo-200">
                <td className="py-2 px-3">✓ Passes</td>
                <td className="py-2 px-3">&lt; α</td>
                <td className="py-2 px-3">Negative</td>
                <td className="py-2 px-3 font-semibold text-red-700">Do not ship (keep control)</td>
              </tr>
              <tr className="border-b border-indigo-200">
                <td className="py-2 px-3">✓ Passes</td>
                <td className="py-2 px-3">≥ α</td>
                <td className="py-2 px-3">Any</td>
                <td className="py-2 px-3 font-semibold text-gray-700">Hold / Iterate / Get more data</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-100 border border-gray-300 rounded-lg p-6 mt-8 text-center">
        <p className="text-gray-700 text-sm">
          Still have questions? Hover over the <HelpCircle size={14} className="inline text-gray-500" /> icons throughout the Analysis tab for contextual help!
        </p>
      </div>
    </div>
  );
}
