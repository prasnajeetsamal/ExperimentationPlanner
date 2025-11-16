import React, { useState } from "react";
import { 
  FlaskConical, Target, Settings, Grid3x3, TrendingUp, 
  AlertTriangle, CheckCircle2, XCircle, BarChart3, 
  BookOpen, LineChart, Zap, Award, Info
} from "lucide-react";
import {
  zTestProportionsUnpooled,
  welchTTest,
  chiSquaredSRM,
  ciDiffProportions,
  ciDiffMeans,
  cohensH,
  cohensD,
  bonferroniCorrection,
  holmBonferroniCorrection
} from "./statisticalHelpers";

// Enhanced chi-squared SRM for multiple groups
function chiSquaredSRMMultiGroup(observedCounts, expectedProportions) {
  const total = observedCounts.reduce((sum, count) => sum + count, 0);
  const k = observedCounts.length; // number of groups
  
  // Calculate expected counts
  const expectedCounts = expectedProportions.map(prop => total * prop);
  
  // Calculate chi-squared statistic
  let chiSq = 0;
  for (let i = 0; i < k; i++) {
    if (expectedCounts[i] > 0) {
      chiSq += Math.pow(observedCounts[i] - expectedCounts[i], 2) / expectedCounts[i];
    }
  }
  
  // Degrees of freedom = k - 1
  const df = k - 1;
  
  // Approximate p-value using normal approximation for chi-squared
  function chiSquaredCDF(x, df) {
    if (x <= 0) return 0;
    if (df === 1) {
      const z = Math.sqrt(x);
      return 2 * normalCDF(z) - 1;
    }
    // Wilson-Hilferty approximation
    const z = Math.pow(x / df, 1/3) - (1 - 2/(9*df)) / Math.sqrt(2/(9*df));
    return normalCDF(z);
  }
  
  function normalCDF(x) {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989423 * Math.exp(-x * x / 2);
    const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return x > 0 ? 1 - prob : prob;
  }
  
  const pValue = 1 - chiSquaredCDF(chiSq, df);
  
  return { 
    chiSq, 
    pValue, 
    df,
    observedCounts,
    expectedCounts,
    expectedProportions 
  };
}

export default function ResultsAnalysisTab() {
  // State for experiment selection and configuration
  const [selectedExperiment, setSelectedExperiment] = useState("");
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState("");
  const [metricType, setMetricType] = useState("binary");
  const [testType, setTestType] = useState("two-tailed");
  const [significanceLevel, setSignificanceLevel] = useState(0.05);
  const [multipleTestCorrection, setMultipleTestCorrection] = useState("none");
  const [expectedRatio, setExpectedRatio] = useState(50);
  const [numVariations, setNumVariations] = useState(2); // New field
  
  // State for data input
  const [metricData, setMetricData] = useState({
    control: { conversions: "", sampleSize: "", mean: "", std: "" },
    variants: {}
  });
  
  // State for analysis results
  const [analysisResults, setAnalysisResults] = useState(null);
  const [showFormulas, setShowFormulas] = useState(false);

  // Available metrics
  const availableMetrics = [
    { id: "conversion_rate", name: "Conversion Rate", type: "binary", category: "primary" },
    { id: "add_to_bag", name: "Add-to-Bag Rate", type: "binary", category: "primary" },
    { id: "click_through", name: "Click-Through Rate", type: "binary", category: "primary" },
    { id: "revenue_per_visitor", name: "Revenue per Visitor", type: "continuous", category: "primary" },
    { id: "order_value", name: "Average Order Value", type: "continuous", category: "primary" },
    { id: "bounce_rate", name: "Bounce Rate", type: "binary", category: "secondary" },
    { id: "page_load_time", name: "Page Load Time", type: "continuous", category: "secondary" },
    { id: "time_on_site", name: "Time on Site", type: "continuous", category: "secondary" },
  ];

  // Generate variant names dynamically based on numVariations
  const generateVariantNames = (count) => {
    const names = [];
    for (let i = 0; i < count; i++) {
      names.push(`Variation ${String.fromCharCode(65 + i)}`); // A, B, C, D...
    }
    return names;
  };

  // Available experiments (mock data) - now using dynamic variants
  const availableExperiments = [
    { id: "exp_001", name: "Homepage Hero Banner Test" },
    { id: "exp_002", name: "Checkout Flow Optimization" },
    { id: "exp_003", name: "Product Card Layout Test" },
  ];

  // Update metric type when metric is selected
  // Note: Metric type is automatically determined by the selected metric
  // But users can override if they want to test differently
  React.useEffect(() => {
    if (selectedMetric) {
      const metric = availableMetrics.find(m => m.id === selectedMetric);
      if (metric) {
        setMetricType(metric.type);
      }
    }
  }, [selectedMetric]);

  // Update variants data structure when experiment or numVariations changes
  React.useEffect(() => {
    if (selectedExperiment) {
      const variantNames = generateVariantNames(numVariations);
      const newVariants = {};
      variantNames.forEach(v => {
        newVariants[v] = { conversions: "", sampleSize: "", mean: "", std: "" };
      });
      setMetricData(prev => ({ ...prev, variants: newVariants }));
      setSelectedVariants([]);
    }
  }, [selectedExperiment, numVariations]);

  const updateMetricData = (group, field, value) => {
    if (group === "control") {
      setMetricData(prev => ({
        ...prev,
        control: { ...prev.control, [field]: value }
      }));
    } else {
      setMetricData(prev => ({
        ...prev,
        variants: {
          ...prev.variants,
          [group]: { ...prev.variants[group], [field]: value }
        }
      }));
    }
  };

  const analyzeExperiment = () => {
    if (!selectedMetric || selectedVariants.length === 0) {
      alert("Please select a metric and at least one variant to analyze");
      return;
    }

    const results = {
      metric: availableMetrics.find(m => m.id === selectedMetric),
      comparisons: [],
      srm: null,
      winner: null,
      overallSignificant: false
    };

    const alpha = significanceLevel;
    const controlData = metricData.control;
    
    // Enhanced SRM check for multiple groups
    const totalGroups = 1 + selectedVariants.length; // control + variants
    const observedCounts = [parseFloat(controlData.sampleSize) || 0];
    
    selectedVariants.forEach(v => {
      observedCounts.push(parseFloat(metricData.variants[v]?.sampleSize) || 0);
    });
    
    // Expected proportions based on equal split
    // For equal allocation, each group gets 1/totalGroups
    // For control-heavy: control gets expectedRatio%, variants split the rest
    const controlProportion = expectedRatio / 100;
    const variantProportion = (100 - expectedRatio) / 100 / selectedVariants.length;
    
    const expectedProportions = [controlProportion];
    for (let i = 0; i < selectedVariants.length; i++) {
      expectedProportions.push(variantProportion);
    }
    
    if (observedCounts.every(c => c > 0)) {
      results.srm = chiSquaredSRMMultiGroup(observedCounts, expectedProportions);
      results.srm.groups = ['Control', ...selectedVariants];
    }

    // Perform pairwise comparisons
    const rawPValues = [];
    selectedVariants.forEach(variantName => {
      const variantData = metricData.variants[variantName];
      let comparison = {
        variant: variantName,
        controlValue: 0,
        variantValue: 0,
        absoluteDiff: 0,
        relativeLift: 0,
        ci: null,
        testResult: null,
        effectSize: 0,
        isSignificant: false,
        recommendation: ""
      };

      if (metricType === "binary") {
        const controlConv = parseFloat(controlData.conversions) || 0;
        const controlN = parseFloat(controlData.sampleSize) || 1;
        const variantConv = parseFloat(variantData.conversions) || 0;
        const variantN = parseFloat(variantData.sampleSize) || 1;
        
        const pControl = controlConv / controlN;
        const pVariant = variantConv / variantN;
        
        comparison.controlValue = pControl;
        comparison.variantValue = pVariant;
        comparison.absoluteDiff = pVariant - pControl;
        comparison.relativeLift = pControl !== 0 ? ((pVariant - pControl) / pControl) * 100 : 0;
        
        comparison.testResult = zTestProportionsUnpooled(pVariant, variantN, pControl, controlN, testType === "two-tailed" ? 2 : 1);
        comparison.testResult.testName = "Two-sample z-test for proportions (unpooled)";
        comparison.ci = ciDiffProportions(pVariant, variantN, pControl, controlN, alpha);
        comparison.effectSize = cohensH(pVariant, pControl);
        rawPValues.push(comparison.testResult.pValue);
        
      } else {
        const controlMean = parseFloat(controlData.mean) || 0;
        const controlStd = parseFloat(controlData.std) || 0;
        const controlN = parseFloat(controlData.sampleSize) || 1;
        const variantMean = parseFloat(variantData.mean) || 0;
        const variantStd = parseFloat(variantData.std) || 0;
        const variantN = parseFloat(variantData.sampleSize) || 1;
        
        comparison.controlValue = controlMean;
        comparison.variantValue = variantMean;
        comparison.absoluteDiff = variantMean - controlMean;
        comparison.relativeLift = controlMean !== 0 ? ((variantMean - controlMean) / controlMean) * 100 : 0;
        
        comparison.testResult = welchTTest(variantMean, variantStd, variantN, controlMean, controlStd, controlN, testType === "two-tailed" ? 2 : 1);
        comparison.testResult.testName = "Welch's two-sample t-test (unequal variances)";
        comparison.ci = ciDiffMeans(variantMean, variantStd, variantN, controlMean, controlStd, controlN, alpha);
        comparison.effectSize = cohensD(variantMean, variantStd, variantN, controlMean, controlStd, controlN);
        rawPValues.push(comparison.testResult.pValue);
      }
      
      results.comparisons.push(comparison);
    });

    // Apply multiple testing correction
    let adjustedPValues = rawPValues;
    if (multipleTestCorrection === "bonferroni") {
      adjustedPValues = bonferroniCorrection(rawPValues);
    } else if (multipleTestCorrection === "holm") {
      adjustedPValues = holmBonferroniCorrection(rawPValues);
    }

    // Update comparisons with adjusted p-values and significance
    results.comparisons.forEach((comp, idx) => {
      comp.testResult.adjustedPValue = adjustedPValues[idx];
      comp.isSignificant = adjustedPValues[idx] < alpha;
      
      if (comp.isSignificant) {
        if (comp.relativeLift > 0) {
          comp.recommendation = "Ship variation";
        } else {
          comp.recommendation = "Do not ship";
        }
      } else {
        comp.recommendation = "Hold – inconclusive";
      }
    });

    // Determine overall winner
    const significantPositive = results.comparisons.filter(c => c.isSignificant && c.relativeLift > 0);
    if (significantPositive.length > 0) {
      const winner = significantPositive.reduce((best, current) => 
        current.relativeLift > best.relativeLift ? current : best
      );
      results.winner = winner.variant;
      results.overallSignificant = true;
    } else if (results.comparisons.some(c => c.isSignificant && c.relativeLift < 0)) {
      results.winner = "Control";
      results.overallSignificant = true;
    } else {
      results.winner = "No significant difference";
      results.overallSignificant = false;
    }

    setAnalysisResults(results);
  };

  const formatValue = (value, asPercentage = false) => {
    if (asPercentage) {
      return `${(value * 100).toFixed(2)}%`;
    }
    return value.toFixed(4);
  };

  const currentExperiment = availableExperiments.find(e => e.id === selectedExperiment);
  const currentMetric = availableMetrics.find(m => m.id === selectedMetric);
  const currentVariants = selectedExperiment ? generateVariantNames(numVariations) : [];

  return (
    <div className="space-y-6">
      {/* Configuration Section - Improved 3-Row Layout */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <Settings size={24} />
            Experiment Configuration
          </h2>
        </div>
        
        <div className="p-6 space-y-4">
          {/* Row 1: Experiment and Metric Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                Experiment
              </label>
              <select
                value={selectedExperiment}
                onChange={(e) => setSelectedExperiment(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 font-medium text-sm"
              >
                <option value="">Select experiment...</option>
                {availableExperiments.map(exp => (
                  <option key={exp.id} value={exp.id}>{exp.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                Metric
              </label>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 font-medium text-sm"
              >
                <option value="">Select metric...</option>
                <optgroup label="Primary">
                  {availableMetrics.filter(m => m.category === "primary").map(metric => (
                    <option key={metric.id} value={metric.id}>{metric.name}</option>
                  ))}
                </optgroup>
                <optgroup label="Guardrails">
                  {availableMetrics.filter(m => m.category === "secondary").map(metric => (
                    <option key={metric.id} value={metric.id}>{metric.name}</option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>

          {/* Row 2: Traffic Split, Metric Type, and Number of Variations */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                Traffic Split (% Control)
              </label>
              <input
                type="number"
                min="1"
                max="99"
                value={expectedRatio}
                onChange={(e) => setExpectedRatio(parseInt(e.target.value) || 50)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Remaining {100 - expectedRatio}% split across variants
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide flex items-center gap-1">
                Metric Type
                <div className="group relative">
                  <Info size={14} className="text-gray-400 cursor-help" />
                  <div className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                    <strong>Binary:</strong> Use for rates/proportions (e.g., conversion rate). Requires conversions & sample size.
                    <br/><br/>
                    <strong>Continuous:</strong> Use for averages (e.g., revenue, time). Requires mean, std dev & sample size.
                    <br/><br/>
                    Auto-set based on metric, but you can override.
                  </div>
                </div>
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setMetricType("binary")}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    metricType === "binary"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Binary
                </button>
                <button
                  onClick={() => setMetricType("continuous")}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    metricType === "continuous"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Continuous
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                Number of Variations
              </label>
              <input
                type="number"
                min="1"
                max="26"
                value={numVariations}
                onChange={(e) => setNumVariations(Math.max(1, Math.min(26, parseInt(e.target.value) || 2)))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Generates: {generateVariantNames(numVariations).join(', ')}
              </p>
            </div>
          </div>

          {/* Row 3: Test Type, Significance, and Correction */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                Test Type
              </label>
              <select
                value={testType}
                onChange={(e) => setTestType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
              >
                <option value="two-tailed">Two-tailed (≠)</option>
                <option value="one-tailed">One-tailed (&gt;)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                Significance Level (α)
              </label>
              <select
                value={significanceLevel}
                onChange={(e) => setSignificanceLevel(parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
              >
                <option value={0.01}>0.01 (99% confidence)</option>
                <option value={0.05}>0.05 (95% confidence)</option>
                <option value={0.10}>0.10 (90% confidence)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                Multiple Comparison Correction
              </label>
              <select
                value={multipleTestCorrection}
                onChange={(e) => setMultipleTestCorrection(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
              >
                <option value="none">None</option>
                <option value="bonferroni">Bonferroni</option>
                <option value="holm">Holm-Bonferroni</option>
              </select>
            </div>
          </div>

          {/* Variant Selection */}
          {selectedExperiment && (
            <div className="pt-4 border-t border-gray-200">
              <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                Select Variants to Analyze
              </label>
              <div className="flex flex-wrap gap-2">
                {currentVariants.map(variant => (
                  <label key={variant} className="inline-flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-indigo-50 hover:border-indigo-300 transition-all">
                    <input
                      type="checkbox"
                      checked={selectedVariants.includes(variant)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedVariants([...selectedVariants, variant]);
                        } else {
                          setSelectedVariants(selectedVariants.filter(v => v !== variant));
                        }
                      }}
                      className="w-4 h-4 text-indigo-600"
                    />
                    <span className="text-sm font-medium text-gray-700">{variant}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Data Input Section */}
      {selectedMetric && selectedVariants.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <Grid3x3 size={24} />
              Data Input: {currentMetric?.name}
            </h2>
            <button
              onClick={analyzeExperiment}
              className="px-6 py-2 bg-white text-indigo-600 font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center gap-2"
            >
              <Zap size={18} />
              Run Analysis
            </button>
          </div>
          
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-300 bg-gray-50">
                    <th className="text-left py-3 px-4 font-bold text-gray-700">Group</th>
                    {metricType === "binary" ? (
                      <>
                        <th className="text-left py-3 px-4 font-bold text-gray-700">Conversions</th>
                        <th className="text-left py-3 px-4 font-bold text-gray-700">Sample Size</th>
                        <th className="text-left py-3 px-4 font-bold text-gray-700 bg-indigo-50">Conversion Rate</th>
                      </>
                    ) : (
                      <>
                        <th className="text-left py-3 px-4 font-bold text-gray-700">Mean (μ)</th>
                        <th className="text-left py-3 px-4 font-bold text-gray-700">Std Dev (σ)</th>
                        <th className="text-left py-3 px-4 font-bold text-gray-700">Sample Size (n)</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {/* Control Row */}
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 font-bold text-gray-900">Control</td>
                    {metricType === "binary" ? (
                      <>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            min="0"
                            value={metricData.control.conversions}
                            onChange={(e) => updateMetricData("control", "conversions", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                            placeholder="e.g., 850"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            min="1"
                            value={metricData.control.sampleSize}
                            onChange={(e) => updateMetricData("control", "sampleSize", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                            placeholder="e.g., 10000"
                          />
                        </td>
                        <td className="py-3 px-4 bg-indigo-50 font-semibold text-indigo-700">
                          {metricData.control.conversions && metricData.control.sampleSize
                            ? `${((parseFloat(metricData.control.conversions) / parseFloat(metricData.control.sampleSize)) * 100).toFixed(2)}%`
                            : "—"}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            step="0.01"
                            value={metricData.control.mean}
                            onChange={(e) => updateMetricData("control", "mean", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                            placeholder="e.g., 12.50"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={metricData.control.std}
                            onChange={(e) => updateMetricData("control", "std", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                            placeholder="e.g., 25.30"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            min="1"
                            value={metricData.control.sampleSize}
                            onChange={(e) => updateMetricData("control", "sampleSize", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                            placeholder="e.g., 5000"
                          />
                        </td>
                      </>
                    )}
                  </tr>
                  
                  {/* Variant Rows */}
                  {selectedVariants.map((variant) => (
                    <tr key={variant} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4 font-bold text-indigo-700">{variant}</td>
                      {metricType === "binary" ? (
                        <>
                          <td className="py-3 px-4">
                            <input
                              type="number"
                              min="0"
                              value={metricData.variants[variant]?.conversions || ""}
                              onChange={(e) => updateMetricData(variant, "conversions", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                              placeholder="e.g., 920"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="number"
                              min="1"
                              value={metricData.variants[variant]?.sampleSize || ""}
                              onChange={(e) => updateMetricData(variant, "sampleSize", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                              placeholder="e.g., 10000"
                            />
                          </td>
                          <td className="py-3 px-4 bg-indigo-50 font-semibold text-indigo-700">
                            {metricData.variants[variant]?.conversions && metricData.variants[variant]?.sampleSize
                              ? `${((parseFloat(metricData.variants[variant].conversions) / parseFloat(metricData.variants[variant].sampleSize)) * 100).toFixed(2)}%`
                              : "—"}
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="py-3 px-4">
                            <input
                              type="number"
                              step="0.01"
                              value={metricData.variants[variant]?.mean || ""}
                              onChange={(e) => updateMetricData(variant, "mean", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                              placeholder="e.g., 13.80"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={metricData.variants[variant]?.std || ""}
                              onChange={(e) => updateMetricData(variant, "std", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                              placeholder="e.g., 26.10"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="number"
                              min="1"
                              value={metricData.variants[variant]?.sampleSize || ""}
                              onChange={(e) => updateMetricData(variant, "sampleSize", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                              placeholder="e.g., 5000"
                            />
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      {analysisResults && (
        <>
          {/* Executive Summary */}
          <div className={`rounded-2xl shadow-xl border-2 p-6 ${
            analysisResults.overallSignificant
              ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-300"
              : "bg-gradient-to-br from-gray-50 to-slate-50 border-gray-300"
          }`}>
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${
                analysisResults.overallSignificant ? "bg-green-100" : "bg-gray-100"
              }`}>
                <Award size={32} className={analysisResults.overallSignificant ? "text-green-600" : "text-gray-600"} />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Executive Summary</h3>
                <p className="text-lg text-gray-700 mb-4">
                  <strong>Winner:</strong> {analysisResults.winner}
                </p>
                {analysisResults.overallSignificant && (
                  <p className="text-gray-600">
                    At least one variant shows statistically significant differences from the control group.
                  </p>
                )}
                {!analysisResults.overallSignificant && (
                  <p className="text-gray-600">
                    No variants show statistically significant differences from the control group at α = {significanceLevel}.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* SRM Check */}
          {analysisResults.srm && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className={`px-6 py-4 ${
                analysisResults.srm.pValue >= 0.001
                  ? "bg-gradient-to-r from-green-600 to-emerald-600"
                  : "bg-gradient-to-r from-red-600 to-rose-600"
              }`}>
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  {analysisResults.srm.pValue >= 0.001 ? (
                    <CheckCircle2 size={24} />
                  ) : (
                    <AlertTriangle size={24} />
                  )}
                  Sample Ratio Mismatch (SRM) Check
                </h2>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-sm font-semibold text-gray-600 mb-2">Chi-squared statistic</div>
                    <div className="text-2xl font-bold text-gray-900">{analysisResults.srm.chiSq.toFixed(4)}</div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-sm font-semibold text-gray-600 mb-2">P-value</div>
                    <div className={`text-2xl font-bold ${
                      analysisResults.srm.pValue >= 0.001 ? "text-green-600" : "text-red-600"
                    }`}>
                      {analysisResults.srm.pValue.toFixed(6)}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-bold text-gray-900 mb-2">Traffic Distribution:</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2 border-gray-300 bg-gray-50">
                          <th className="text-left py-2 px-3 font-bold text-gray-700">Group</th>
                          <th className="text-right py-2 px-3 font-bold text-gray-700">Observed</th>
                          <th className="text-right py-2 px-3 font-bold text-gray-700">Expected</th>
                          <th className="text-right py-2 px-3 font-bold text-gray-700">Expected %</th>
                          <th className="text-right py-2 px-3 font-bold text-gray-700">Actual %</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analysisResults.srm.groups.map((group, idx) => {
                          const observed = analysisResults.srm.observedCounts[idx];
                          const expected = analysisResults.srm.expectedCounts[idx];
                          const expectedPct = (analysisResults.srm.expectedProportions[idx] * 100).toFixed(1);
                          const actualPct = (observed / analysisResults.srm.observedCounts.reduce((a,b) => a+b, 0) * 100).toFixed(1);
                          
                          return (
                            <tr key={group} className="border-b border-gray-200">
                              <td className="py-2 px-3 font-semibold text-gray-900">{group}</td>
                              <td className="text-right py-2 px-3 text-gray-700">{observed.toLocaleString()}</td>
                              <td className="text-right py-2 px-3 text-gray-700">{expected.toFixed(0).toLocaleString()}</td>
                              <td className="text-right py-2 px-3 text-gray-700">{expectedPct}%</td>
                              <td className="text-right py-2 px-3 font-semibold text-gray-900">{actualPct}%</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className={`p-4 rounded-xl ${
                  analysisResults.srm.pValue >= 0.001
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}>
                  <p className={`font-semibold ${
                    analysisResults.srm.pValue >= 0.001 ? "text-green-900" : "text-red-900"
                  }`}>
                    {analysisResults.srm.pValue >= 0.001
                      ? "✓ No Sample Ratio Mismatch detected. The traffic split matches expectations."
                      : "⚠ Sample Ratio Mismatch detected! The traffic split does NOT match expectations. Investigate potential randomization issues before trusting results."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Individual Variant Results */}
          {analysisResults.comparisons.map((comp, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className={`px-6 py-4 ${
                comp.isSignificant && comp.relativeLift > 0
                  ? "bg-gradient-to-r from-green-600 to-emerald-600"
                  : comp.isSignificant && comp.relativeLift < 0
                  ? "bg-gradient-to-r from-red-600 to-rose-600"
                  : "bg-gradient-to-r from-gray-600 to-slate-600"
              }`}>
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <BarChart3 size={24} />
                  {comp.variant} vs Control
                </h2>
              </div>
              
              <div className="p-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-sm font-semibold text-gray-600 mb-1">Control</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatValue(comp.controlValue, metricType === "binary")}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-sm font-semibold text-gray-600 mb-1">{comp.variant}</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatValue(comp.variantValue, metricType === "binary")}
                    </div>
                  </div>
                  
                  <div className={`rounded-xl p-4 ${
                    comp.relativeLift > 0 ? "bg-green-50" : comp.relativeLift < 0 ? "bg-red-50" : "bg-gray-50"
                  }`}>
                    <div className="text-sm font-semibold text-gray-600 mb-1">Relative Lift</div>
                    <div className={`text-2xl font-bold ${
                      comp.relativeLift > 0 ? "text-green-600" : comp.relativeLift < 0 ? "text-red-600" : "text-gray-900"
                    }`}>
                      {comp.relativeLift > 0 ? "+" : ""}{comp.relativeLift.toFixed(2)}%
                    </div>
                  </div>
                </div>

                {/* Statistical Details */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="space-y-3">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="text-xs font-semibold text-blue-600 mb-1">Absolute Difference</div>
                      <div className="text-lg font-bold text-blue-900">
                        {comp.absoluteDiff > 0 ? "+" : ""}{formatValue(comp.absoluteDiff, metricType === "binary")}
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 rounded-lg p-3">
                      <div className="text-xs font-semibold text-purple-600 mb-1">95% Confidence Interval</div>
                      <div className="text-sm font-bold text-purple-900">
                        [{formatValue(comp.ci.lower, metricType === "binary")}, {formatValue(comp.ci.upper, metricType === "binary")}]
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-indigo-50 rounded-lg p-3">
                      <div className="text-xs font-semibold text-indigo-600 mb-1">P-value (raw)</div>
                      <div className="text-lg font-bold text-indigo-900">
                        {comp.testResult.pValue.toFixed(6)}
                      </div>
                    </div>
                    
                    {multipleTestCorrection !== "none" && (
                      <div className="bg-pink-50 rounded-lg p-3">
                        <div className="text-xs font-semibold text-pink-600 mb-1">
                          P-value (adjusted - {multipleTestCorrection})
                        </div>
                        <div className="text-lg font-bold text-pink-900">
                          {comp.testResult.adjustedPValue.toFixed(6)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Effect Size */}
                <div className="mb-6">
                  <div className="bg-amber-50 rounded-lg p-3">
                    <div className="text-xs font-semibold text-amber-600 mb-1">
                      Effect Size ({metricType === "binary" ? "Cohen's h" : "Cohen's d"})
                    </div>
                    <div className="flex items-baseline gap-2">
                      <div className="text-lg font-bold text-amber-900">{comp.effectSize.toFixed(4)}</div>
                      <div className="text-sm text-amber-700">
                        ({Math.abs(comp.effectSize) < 0.2 ? "Small" : Math.abs(comp.effectSize) < 0.5 ? "Medium" : "Large"})
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statistical Test Info */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="text-xs font-semibold text-gray-600 mb-1">Statistical Test Used</div>
                  <div className="text-sm text-gray-900">{comp.testResult.testName}</div>
                  {comp.testResult.df && (
                    <div className="text-xs text-gray-600 mt-1">
                      Degrees of freedom: {comp.testResult.df.toFixed(2)}
                    </div>
                  )}
                </div>

                {/* Recommendation */}
                <div className={`p-4 rounded-xl border-2 ${
                  comp.recommendation === "Ship variation"
                    ? "bg-green-50 border-green-300"
                    : comp.recommendation === "Do not ship"
                    ? "bg-red-50 border-red-300"
                    : "bg-gray-50 border-gray-300"
                }`}>
                  <div className="flex items-center gap-2">
                    {comp.recommendation === "Ship variation" ? (
                      <CheckCircle2 className="text-green-600" size={20} />
                    ) : comp.recommendation === "Do not ship" ? (
                      <XCircle className="text-red-600" size={20} />
                    ) : (
                      <AlertTriangle className="text-gray-600" size={20} />
                    )}
                    <span className="font-bold text-gray-900">Recommendation:</span>
                    <span className={`font-semibold ${
                      comp.recommendation === "Ship variation"
                        ? "text-green-700"
                        : comp.recommendation === "Do not ship"
                        ? "text-red-700"
                        : "text-gray-700"
                    }`}>
                      {comp.recommendation}
                    </span>
                  </div>
                  {comp.isSignificant && (
                    <p className="text-sm text-gray-600 mt-2">
                      The difference is statistically significant (p {multipleTestCorrection !== "none" ? "(adjusted) " : ""}
                      &lt; {significanceLevel}).
                    </p>
                  )}
                  {!comp.isSignificant && (
                    <p className="text-sm text-gray-600 mt-2">
                      The difference is not statistically significant at the {(1 - significanceLevel) * 100}% confidence level.
                      More data may be needed.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Formula Documentation */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => setShowFormulas(!showFormulas)}
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-between group hover:from-purple-700 hover:to-indigo-700 transition-all"
            >
              <div className="flex items-center gap-3">
                <BookOpen size={24} className="text-white" />
                <h2 className="text-xl font-bold text-white">Statistical Formulas & Methodology</h2>
              </div>
              <div className="text-white text-sm">
                {showFormulas ? "Click to hide" : "Click to view"}
              </div>
            </button>
            
            {showFormulas && (
              <div className="p-6 space-y-4 text-sm">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-bold text-blue-900 mb-2">Binary Metrics (Proportions)</h3>
                  <ul className="space-y-2 text-blue-800">
                    <li><strong>Test:</strong> Two-sample z-test for proportions (unpooled variance)</li>
                    <li><strong>z-score:</strong> z = (p₁ - p₂) / SE, where SE = √(p₁(1-p₁)/n₁ + p₂(1-p₂)/n₂)</li>
                    <li><strong>CI:</strong> (p₁ - p₂) ± 1.96 × SE</li>
                    <li><strong>Effect size:</strong> Cohen's h = 2 × arcsin(√p₁) - 2 × arcsin(√p₂)</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-bold text-green-900 mb-2">Continuous Metrics (Means)</h3>
                  <ul className="space-y-2 text-green-800">
                    <li><strong>Test:</strong> Welch's two-sample t-test (unequal variances)</li>
                    <li><strong>t-score:</strong> t = (μ₁ - μ₂) / SE, where SE = √(σ₁²/n₁ + σ₂²/n₂)</li>
                    <li><strong>CI:</strong> (μ₁ - μ₂) ± t_critical × SE</li>
                    <li><strong>Effect size:</strong> Cohen's d = (μ₁ - μ₂) / pooled_SD</li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="font-bold text-purple-900 mb-2">Sample Ratio Mismatch (SRM)</h3>
                  <ul className="space-y-2 text-purple-800">
                    <li><strong>Test:</strong> Chi-squared goodness-of-fit test</li>
                    <li><strong>χ²:</strong> Σ((Observed - Expected)² / Expected) across all groups</li>
                    <li><strong>df:</strong> Number of groups - 1</li>
                    <li><strong>Interpretation:</strong> p &lt; 0.001 indicates SRM (traffic split issue)</li>
                  </ul>
                </div>
                
                <div className="bg-amber-50 rounded-lg p-4">
                  <h3 className="font-bold text-amber-900 mb-2">Multiple Testing Correction</h3>
                  <ul className="space-y-2 text-amber-800">
                    <li><strong>Bonferroni:</strong> p_adjusted = min(p × m, 1) where m = number of tests</li>
                    <li><strong>Holm:</strong> Sequential Bonferroni with step-down adjustment</li>
                    <li><strong>Purpose:</strong> Control family-wise error rate when testing multiple variants</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
