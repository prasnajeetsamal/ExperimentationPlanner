import React, { useState } from "react";
import { 
  FlaskConical, Target, Settings, Grid3x3, TrendingUp, 
  AlertTriangle, CheckCircle2, XCircle, BarChart3, 
  BookOpen, LineChart 
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

// ===== Results Analysis Tab Component =====
export default function ResultsAnalysisTab() {
  // State for experiment selection and configuration
  const [selectedExperiment, setSelectedExperiment] = useState("");
  const [controlGroup, setControlGroup] = useState("control");
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState("");
  const [metricType, setMetricType] = useState("binary");
  const [testType, setTestType] = useState("two-tailed");
  const [significanceLevel, setSignificanceLevel] = useState(0.05);
  const [multipleTestCorrection, setMultipleTestCorrection] = useState("none");
  const [expectedRatio, setExpectedRatio] = useState(50);
  
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

  // Available experiments (mock data)
  const availableExperiments = [
    { id: "exp_001", name: "Homepage Hero Banner Test", variants: ["Variation A", "Variation B"] },
    { id: "exp_002", name: "Checkout Flow Optimization", variants: ["Variation A"] },
    { id: "exp_003", name: "Product Card Layout Test", variants: ["Variation A", "Variation B", "Variation C"] },
  ];

  // Update metric type when metric is selected
  React.useEffect(() => {
    if (selectedMetric) {
      const metric = availableMetrics.find(m => m.id === selectedMetric);
      if (metric) {
        setMetricType(metric.type);
      }
    }
  }, [selectedMetric]);

  // Update variants data structure when experiment is selected
  React.useEffect(() => {
    if (selectedExperiment) {
      const exp = availableExperiments.find(e => e.id === selectedExperiment);
      if (exp) {
        const newVariants = {};
        exp.variants.forEach(v => {
          newVariants[v] = { conversions: "", sampleSize: "", mean: "", std: "" };
        });
        setMetricData(prev => ({ ...prev, variants: newVariants }));
        setSelectedVariants([]);
      }
    }
  }, [selectedExperiment]);

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
    
    // Perform SRM check
    const totalControlSamples = parseFloat(controlData.sampleSize) || 0;
    const totalVariantSamples = selectedVariants.reduce((sum, v) => 
      sum + (parseFloat(metricData.variants[v]?.sampleSize) || 0), 0
    );
    
    if (totalControlSamples > 0 && totalVariantSamples > 0) {
      results.srm = chiSquaredSRM(totalControlSamples, totalVariantSamples, expectedRatio / 100);
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
        // Binary metric analysis
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
        
        // Z-test
        comparison.testResult = zTestProportionsUnpooled(pVariant, variantN, pControl, controlN, testType === "two-tailed" ? 2 : 1);
        comparison.testResult.testName = "Two-sample z-test for proportions (unpooled)";
        
        // Confidence interval
        comparison.ci = ciDiffProportions(pVariant, variantN, pControl, controlN, alpha);
        
        // Effect size (Cohen's h)
        comparison.effectSize = cohensH(pVariant, pControl);
        
        rawPValues.push(comparison.testResult.pValue);
        
      } else {
        // Continuous metric analysis
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
        
        // Welch's t-test
        comparison.testResult = welchTTest(variantMean, variantStd, variantN, controlMean, controlStd, controlN, testType === "two-tailed" ? 2 : 1);
        comparison.testResult.testName = "Welch's two-sample t-test (unequal variances)";
        
        // Confidence interval
        comparison.ci = ciDiffMeans(variantMean, variantStd, variantN, controlMean, controlStd, controlN, alpha);
        
        // Effect size (Cohen's d)
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
      
      // Determine recommendation
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
      // Find variant with highest lift among significant ones
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

  return (
    <div className="flex gap-6">
      {/* LEFT RAIL - Analysis Controls */}
      <div className="w-80 flex-shrink-0 space-y-4">
        {/* Experiment Selector */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FlaskConical size={20} className="text-indigo-600" />
            Experiment Selector
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Experiment
              </label>
              <select
                value={selectedExperiment}
                onChange={(e) => setSelectedExperiment(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 font-medium"
              >
                <option value="">Choose experiment...</option>
                {availableExperiments.map(exp => (
                  <option key={exp.id} value={exp.id}>{exp.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Variant & Metric Selector */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Target size={20} className="text-indigo-600" />
            Variant & Metrics
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Control Group
              </label>
              <input
                type="text"
                value={controlGroup}
                readOnly
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg bg-gray-50 font-medium text-gray-600"
              />
            </div>

            {currentExperiment && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Variants
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {currentExperiment.variants.map(variant => (
                    <label key={variant} className="flex items-center gap-2 cursor-pointer">
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

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Metric
              </label>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 font-medium"
              >
                <option value="">Select metric...</option>
                <optgroup label="Primary Metrics">
                  {availableMetrics.filter(m => m.category === "primary").map(metric => (
                    <option key={metric.id} value={metric.id}>{metric.name}</option>
                  ))}
                </optgroup>
                <optgroup label="Secondary / Guardrails">
                  {availableMetrics.filter(m => m.category === "secondary").map(metric => (
                    <option key={metric.id} value={metric.id}>{metric.name}</option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>
        </div>

        {/* Analysis Settings */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Settings size={20} className="text-indigo-600" />
            Analysis Settings
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Metric Type
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={metricType === "binary"}
                    onChange={() => setMetricType("binary")}
                    className="w-4 h-4 text-indigo-600"
                  />
                  <span className="text-sm font-medium text-gray-700">Binary (conversion, click, etc.)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={metricType === "continuous"}
                    onChange={() => setMetricType("continuous")}
                    className="w-4 h-4 text-indigo-600"
                  />
                  <span className="text-sm font-medium text-gray-700">Continuous (RPV, time, etc.)</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Test Type
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={testType === "two-tailed"}
                    onChange={() => setTestType("two-tailed")}
                    className="w-4 h-4 text-indigo-600"
                  />
                  <span className="text-sm font-medium text-gray-700">Two-tailed</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={testType === "one-tailed"}
                    onChange={() => setTestType("one-tailed")}
                    className="w-4 h-4 text-indigo-600"
                  />
                  <span className="text-sm font-medium text-gray-700">One-tailed</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Significance Level (α)
              </label>
              <select
                value={significanceLevel}
                onChange={(e) => setSignificanceLevel(parseFloat(e.target.value))}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 font-medium"
              >
                <option value={0.01}>0.01 (99% confidence)</option>
                <option value={0.05}>0.05 (95% confidence)</option>
                <option value={0.10}>0.10 (90% confidence)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Multiple Comparison Handling
              </label>
              <select
                value={multipleTestCorrection}
                onChange={(e) => setMultipleTestCorrection(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 font-medium"
              >
                <option value="none">None</option>
                <option value="bonferroni">Bonferroni</option>
                <option value="holm">Holm-Bonferroni</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Expected Traffic Split (% to Control)
              </label>
              <input
                type="number"
                min="1"
                max="99"
                value={expectedRatio}
                onChange={(e) => setExpectedRatio(parseInt(e.target.value) || 50)}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>

            <div className="pt-2">
              <div className="text-xs font-semibold text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                Analysis Type: Fixed-horizon
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT - Cards */}
      <div className="flex-1 space-y-6">
        {/* Data Input Section */}
        {selectedMetric && selectedVariants.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <Grid3x3 size={24} />
                Data Input: {currentMetric?.name}
              </h2>
            </div>
            
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Group</th>
                      {metricType === "binary" ? (
                        <>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Conversions</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Sample Size (N)</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Rate</th>
                        </>
                      ) : (
                        <>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Mean</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Std Dev (σ)</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Sample Size (N)</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Control Row */}
                    <tr className="border-b border-gray-200 bg-indigo-50">
                      <td className="py-3 px-4 font-bold text-gray-900">Control</td>
                      {metricType === "binary" ? (
                        <>
                          <td className="py-3 px-4">
                            <input
                              type="number"
                              value={metricData.control.conversions}
                              onChange={(e) => updateMetricData("control", "conversions", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                              placeholder="0"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="number"
                              value={metricData.control.sampleSize}
                              onChange={(e) => updateMetricData("control", "sampleSize", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                              placeholder="0"
                            />
                          </td>
                          <td className="py-3 px-4 font-semibold text-gray-700">
                            {metricData.control.conversions && metricData.control.sampleSize
                              ? formatValue(
                                  parseFloat(metricData.control.conversions) / parseFloat(metricData.control.sampleSize),
                                  true
                                )
                              : "-"}
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
                              placeholder="0.00"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="number"
                              step="0.01"
                              value={metricData.control.std}
                              onChange={(e) => updateMetricData("control", "std", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                              placeholder="0.00"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="number"
                              value={metricData.control.sampleSize}
                              onChange={(e) => updateMetricData("control", "sampleSize", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                              placeholder="0"
                            />
                          </td>
                        </>
                      )}
                    </tr>
                    
                    {/* Variant Rows */}
                    {selectedVariants.map(variant => (
                      <tr key={variant} className="border-b border-gray-100">
                        <td className="py-3 px-4 font-bold text-gray-900">{variant}</td>
                        {metricType === "binary" ? (
                          <>
                            <td className="py-3 px-4">
                              <input
                                type="number"
                                value={metricData.variants[variant]?.conversions || ""}
                                onChange={(e) => updateMetricData(variant, "conversions", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                                placeholder="0"
                              />
                            </td>
                            <td className="py-3 px-4">
                              <input
                                type="number"
                                value={metricData.variants[variant]?.sampleSize || ""}
                                onChange={(e) => updateMetricData(variant, "sampleSize", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                                placeholder="0"
                              />
                            </td>
                            <td className="py-3 px-4 font-semibold text-gray-700">
                              {metricData.variants[variant]?.conversions && metricData.variants[variant]?.sampleSize
                                ? formatValue(
                                    parseFloat(metricData.variants[variant].conversions) / parseFloat(metricData.variants[variant].sampleSize),
                                    true
                                  )
                                : "-"}
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
                                placeholder="0.00"
                              />
                            </td>
                            <td className="py-3 px-4">
                              <input
                                type="number"
                                step="0.01"
                                value={metricData.variants[variant]?.std || ""}
                                onChange={(e) => updateMetricData(variant, "std", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                                placeholder="0.00"
                              />
                            </td>
                            <td className="py-3 px-4">
                              <input
                                type="number"
                                value={metricData.variants[variant]?.sampleSize || ""}
                                onChange={(e) => updateMetricData(variant, "sampleSize", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                                placeholder="0"
                              />
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  onClick={analyzeExperiment}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center gap-3"
                >
                  <TrendingUp size={20} />
                  Run Analysis
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Cards - Continue in Part 2 */}
        {analysisResults && (
          <ResultsDisplay 
            analysisResults={analysisResults}
            currentMetric={currentMetric}
            metricType={metricType}
            metricData={metricData}
            selectedVariants={selectedVariants}
            testType={testType}
            significanceLevel={significanceLevel}
            multipleTestCorrection={multipleTestCorrection}
            formatValue={formatValue}
            showFormulas={showFormulas}
            setShowFormulas={setShowFormulas}
          />
        )}

        {/* Empty State */}
        {!selectedMetric && (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center max-w-md">
              <div className="inline-flex p-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl mb-6">
                <LineChart size={64} className="text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Ready to Analyze Results</h2>
              <p className="text-gray-600">
                Select an experiment, choose variants and a metric from the left panel to begin your statistical analysis.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Separate Results Display Component to keep code modular
function ResultsDisplay({ 
  analysisResults, currentMetric, metricType, metricData, selectedVariants,
  testType, significanceLevel, multipleTestCorrection, formatValue,
  showFormulas, setShowFormulas
}) {
  return (
    <div className="space-y-6">
      {/* Executive Summary Card */}
      <ExecutiveSummaryCard 
        analysisResults={analysisResults}
        currentMetric={currentMetric}
        testType={testType}
        significanceLevel={significanceLevel}
      />

      {/* SRM Diagnostic Card */}
      {analysisResults.srm && (
        <SRMCard srm={analysisResults.srm} />
      )}

      {/* Stats Detail Cards - One per comparison */}
      {analysisResults.comparisons.map((comp, idx) => (
        <StatsDetailCard
          key={idx}
          comparison={comp}
          metricType={metricType}
          metricData={metricData}
          significanceLevel={significanceLevel}
          multipleTestCorrection={multipleTestCorrection}
          formatValue={formatValue}
        />
      ))}

      {/* Formula Documentation */}
      <FormulaDocumentation
        metricType={metricType}
        multipleTestCorrection={multipleTestCorrection}
        showFormulas={showFormulas}
        setShowFormulas={setShowFormulas}
      />
    </div>
  );
}

// Executive Summary Card Component
function ExecutiveSummaryCard({ analysisResults, currentMetric, testType, significanceLevel }) {
  return (
    <div className={`rounded-2xl shadow-xl border-2 overflow-hidden ${
      analysisResults.winner === "No significant difference"
        ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300"
        : analysisResults.winner === "Control"
        ? "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300"
        : "bg-gradient-to-br from-green-50 to-emerald-100 border-green-300"
    }`}>
      <div className="p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Executive Summary
            </h2>
            <p className="text-sm text-gray-600">
              {currentMetric?.name} • {testType === "two-tailed" ? "Two-tailed" : "One-tailed"} test • α = {significanceLevel}
            </p>
          </div>
          <div className={`p-4 rounded-full ${
            analysisResults.winner === "No significant difference"
              ? "bg-yellow-200"
              : analysisResults.winner === "Control"
              ? "bg-gray-200"
              : "bg-green-200"
          }`}>
            {analysisResults.winner === "No significant difference" ? (
              <AlertTriangle size={32} className="text-yellow-700" />
            ) : analysisResults.winner === "Control" ? (
              <XCircle size={32} className="text-gray-700" />
            ) : (
              <CheckCircle2 size={32} className="text-green-700" />
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white bg-opacity-70 rounded-xl p-4 border border-gray-200">
            <div className="text-sm font-semibold text-gray-600 mb-1">Winner</div>
            <div className="text-2xl font-bold text-gray-900">{analysisResults.winner}</div>
          </div>
          
          {analysisResults.comparisons.length > 0 && (
            <>
              <div className="bg-white bg-opacity-70 rounded-xl p-4 border border-gray-200">
                <div className="text-sm font-semibold text-gray-600 mb-1">Best Lift</div>
                <div className={`text-2xl font-bold ${
                  Math.max(...analysisResults.comparisons.map(c => c.relativeLift)) > 0 
                    ? "text-green-600" 
                    : "text-red-600"
                }`}>
                  {Math.max(...analysisResults.comparisons.map(c => c.relativeLift)) > 0 ? "+" : ""}
                  {Math.max(...analysisResults.comparisons.map(c => c.relativeLift)).toFixed(2)}%
                </div>
              </div>
              
              <div className="bg-white bg-opacity-70 rounded-xl p-4 border border-gray-200">
                <div className="text-sm font-semibold text-gray-600 mb-1">Recommendation</div>
                <div className="text-lg font-bold text-gray-900">
                  {analysisResults.comparisons.find(c => c.variant === analysisResults.winner)?.recommendation || 
                   "Hold – inconclusive"}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// SRM Card Component
function SRMCard({ srm }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-3">
          <AlertTriangle size={24} />
          Sample Ratio Mismatch (SRM) Check
        </h2>
      </div>
      
      <div className="p-6">
        <div className={`p-4 rounded-xl border-2 ${
          srm.pValue < 0.01 
            ? "bg-red-50 border-red-300"
            : "bg-green-50 border-green-300"
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-semibold text-gray-600">SRM Status</div>
              <div className={`text-xl font-bold ${
                srm.pValue < 0.01 ? "text-red-700" : "text-green-700"
              }`}>
                {srm.pValue < 0.01 ? "⚠️ SRM Detected" : "✓ No SRM Detected"}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-600">χ² p-value</div>
              <div className="text-xl font-bold text-gray-900">
                {srm.pValue.toFixed(4)}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-semibold text-gray-600">Expected Control</div>
              <div className="font-bold text-gray-900">{srm.expectedControl.toFixed(0)}</div>
            </div>
            <div>
              <div className="font-semibold text-gray-600">Expected Variants</div>
              <div className="font-bold text-gray-900">{srm.expectedVariant.toFixed(0)}</div>
            </div>
          </div>
          
          {srm.pValue < 0.01 && (
            <div className="mt-4 p-3 bg-red-100 rounded-lg">
              <p className="text-sm font-semibold text-red-800">
                ⚠️ Warning: Traffic allocation differs significantly from design (p &lt; 0.01). 
                This may indicate implementation issues or data quality problems.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Stats Detail Card Component
function StatsDetailCard({ comparison, metricType, metricData, significanceLevel, multipleTestCorrection, formatValue }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-3">
          <BarChart3 size={24} />
          {comparison.variant} vs Control
        </h2>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Metric Values */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="text-sm font-semibold text-gray-600 mb-2">Control</div>
            <div className="text-3xl font-bold text-gray-900">
              {metricType === "binary" 
                ? formatValue(comparison.controlValue, true)
                : comparison.controlValue.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              N = {metricData.control.sampleSize}
            </div>
          </div>
          
          <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200">
            <div className="text-sm font-semibold text-gray-600 mb-2">{comparison.variant}</div>
            <div className="text-3xl font-bold text-indigo-900">
              {metricType === "binary" 
                ? formatValue(comparison.variantValue, true)
                : comparison.variantValue.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              N = {metricData.variants[comparison.variant].sampleSize}
            </div>
          </div>
        </div>

        {/* Lift & CI */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-indigo-200">
          <h3 className="font-bold text-gray-900 mb-4">Lift Analysis</h3>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <div className="text-sm font-semibold text-gray-600">Absolute Difference</div>
              <div className={`text-xl font-bold ${comparison.absoluteDiff > 0 ? "text-green-600" : "text-red-600"}`}>
                {comparison.absoluteDiff > 0 ? "+" : ""}
                {metricType === "binary" 
                  ? formatValue(comparison.absoluteDiff, true)
                  : comparison.absoluteDiff.toFixed(4)}
              </div>
            </div>
            
            <div>
              <div className="text-sm font-semibold text-gray-600">Relative Lift</div>
              <div className={`text-xl font-bold ${comparison.relativeLift > 0 ? "text-green-600" : "text-red-600"}`}>
                {comparison.relativeLift > 0 ? "+" : ""}
                {comparison.relativeLift.toFixed(2)}%
              </div>
            </div>
            
            <div>
              <div className="text-sm font-semibold text-gray-600">Effect Size</div>
              <div className="text-xl font-bold text-gray-900">
                {metricType === "binary" ? "h = " : "d = "}
                {comparison.effectSize.toFixed(3)}
              </div>
            </div>
          </div>

          {comparison.ci && (
            <div className="bg-white rounded-lg p-4">
              <div className="text-sm font-semibold text-gray-600 mb-2">
                {(1 - significanceLevel) * 100}% Confidence Interval
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900">
                  [{metricType === "binary" 
                    ? formatValue(comparison.ci.lower, true) 
                    : comparison.ci.lower.toFixed(4)},
                </span>
                <span className="text-lg font-bold text-gray-900">
                  {metricType === "binary" 
                    ? formatValue(comparison.ci.upper, true) 
                    : comparison.ci.upper.toFixed(4)}]
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Statistical Test Results */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-4">Statistical Test Results</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-600">Test Used</span>
              <span className="text-sm font-bold text-gray-900">{comparison.testResult.testName}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-600">Test Statistic</span>
              <span className="text-sm font-bold text-gray-900">
                {metricType === "binary" ? "z = " : "t = "}
                {(comparison.testResult.zScore || comparison.testResult.tScore).toFixed(4)}
              </span>
            </div>
            
            {comparison.testResult.df && (
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-600">Degrees of Freedom</span>
                <span className="text-sm font-bold text-gray-900">{comparison.testResult.df.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-600">Raw P-value</span>
              <span className="text-sm font-bold text-gray-900">{comparison.testResult.pValue.toFixed(6)}</span>
            </div>
            
            {multipleTestCorrection !== "none" && (
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-600">
                  Adjusted P-value ({multipleTestCorrection})
                </span>
                <span className="text-sm font-bold text-gray-900">{comparison.testResult.adjustedPValue.toFixed(6)}</span>
              </div>
            )}
            
            <div className="pt-3 border-t border-gray-300">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-600">Statistical Significance</span>
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-bold text-sm ${
                  comparison.isSignificant 
                    ? "bg-green-100 text-green-800" 
                    : "bg-gray-100 text-gray-600"
                }`}>
                  {comparison.isSignificant ? (
                    <><CheckCircle2 size={16} /> Significant</>
                  ) : (
                    <><XCircle size={16} /> Not Significant</>
                  )}
                </span>
              </div>
            </div>
            
            <div className="pt-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-600">Recommendation</span>
                <span className={`px-4 py-2 rounded-lg font-bold text-sm ${
                  comparison.recommendation === "Ship variation" 
                    ? "bg-green-100 text-green-800"
                    : comparison.recommendation === "Do not ship"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  {comparison.recommendation}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Formula Documentation Component
function FormulaDocumentation({ metricType, multipleTestCorrection, showFormulas, setShowFormulas }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      <button
        onClick={() => setShowFormulas(!showFormulas)}
        className="w-full bg-gradient-to-r from-gray-600 to-gray-700 px-6 py-4 flex items-center justify-between hover:from-gray-700 hover:to-gray-800 transition-all"
      >
        <h2 className="text-xl font-bold text-white flex items-center gap-3">
          <BookOpen size={24} />
          How did we compute this?
        </h2>
        <div className={`transform transition-transform ${showFormulas ? "rotate-180" : ""}`}>
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      
      {showFormulas && (
        <div className="p-6 space-y-6 bg-gray-50">
          {metricType === "binary" ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Two-Sample Z-Test for Proportions (Unpooled)</h3>
                <div className="bg-white p-4 rounded-lg border border-gray-200 font-mono text-sm">
                  <p>p₁ = conversions₁ / n₁</p>
                  <p>p₂ = conversions₂ / n₂</p>
                  <p className="mt-2">SE = √[p₁(1-p₁)/n₁ + p₂(1-p₂)/n₂]</p>
                  <p className="mt-2">z = (p₁ - p₂) / SE</p>
                  <p className="mt-2">p-value = 2 × Φ(-|z|)  [two-tailed]</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Cohen's h (Effect Size)</h3>
                <div className="bg-white p-4 rounded-lg border border-gray-200 font-mono text-sm">
                  <p>φ₁ = 2 × arcsin(√p₁)</p>
                  <p>φ₂ = 2 × arcsin(√p₂)</p>
                  <p className="mt-2">h = φ₁ - φ₂</p>
                  <p className="mt-2 text-xs text-gray-600">Small: |h| ≈ 0.2, Medium: |h| ≈ 0.5, Large: |h| ≈ 0.8</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Welch's Two-Sample t-Test (Unequal Variances)</h3>
                <div className="bg-white p-4 rounded-lg border border-gray-200 font-mono text-sm">
                  <p>SE = √[σ₁²/n₁ + σ₂²/n₂]</p>
                  <p className="mt-2">t = (μ₁ - μ₂) / SE</p>
                  <p className="mt-2">df = (σ₁²/n₁ + σ₂²/n₂)² / [(σ₁²/n₁)²/(n₁-1) + (σ₂²/n₂)²/(n₂-1)]</p>
                  <p className="mt-2">p-value from t-distribution with df degrees of freedom</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Cohen's d (Effect Size)</h3>
                <div className="bg-white p-4 rounded-lg border border-gray-200 font-mono text-sm">
                  <p>s_pooled = √[((n₁-1)σ₁² + (n₂-1)σ₂²) / (n₁+n₂-2)]</p>
                  <p className="mt-2">d = (μ₁ - μ₂) / s_pooled</p>
                  <p className="mt-2 text-xs text-gray-600">Small: |d| ≈ 0.2, Medium: |d| ≈ 0.5, Large: |d| ≈ 0.8</p>
                </div>
              </div>
            </div>
          )}
          
          <div>
            <h3 className="font-bold text-gray-900 mb-2">Sample Ratio Mismatch (SRM) Check</h3>
            <div className="bg-white p-4 rounded-lg border border-gray-200 font-mono text-sm">
              <p>χ² = (O_control - E_control)² / E_control + (O_variant - E_variant)² / E_variant</p>
              <p className="mt-2">df = 1</p>
              <p className="mt-2">Flag if p-value &lt; 0.01</p>
            </div>
          </div>

          {multipleTestCorrection !== "none" && (
            <div>
              <h3 className="font-bold text-gray-900 mb-2">
                Multiple Testing Correction: {multipleTestCorrection === "bonferroni" ? "Bonferroni" : "Holm-Bonferroni"}
              </h3>
              <div className="bg-white p-4 rounded-lg border border-gray-200 font-mono text-sm">
                {multipleTestCorrection === "bonferroni" ? (
                  <p>p_adjusted = min(p_raw × m, 1) where m = number of tests</p>
                ) : (
                  <>
                    <p>1. Sort p-values: p₍₁₎ ≤ p₍₂₎ ≤ ... ≤ p₍ₘ₎</p>
                    <p className="mt-2">2. For rank k: p_adj₍ₖ₎ = p₍ₖ₎ × (m - k + 1)</p>
                    <p className="mt-2">3. Enforce monotonicity: max(p_adj₍ₖ₎, p_adj₍ₖ₋₁₎)</p>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-bold text-blue-900 mb-2">Assumptions</h3>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Independence: Observations are independent within and between groups</li>
              <li>Sample size: Large enough for normal approximation (typically n &gt; 30 per group)</li>
              {metricType === "binary" && (
                <li>Success-failure: At least 5 successes and 5 failures in each group</li>
              )}
              {metricType === "continuous" && (
                <li>Approximate normality: Distribution is approximately normal or n is large</li>
              )}
              <li>Fixed-horizon: Analysis conducted after reaching planned sample size</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
