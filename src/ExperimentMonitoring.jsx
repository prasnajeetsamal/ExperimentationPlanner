import React, { useState, useEffect } from "react";
import { 
  BarChart3, TrendingUp, Users, Clock, AlertTriangle, 
  CheckCircle2, Play, Pause, XCircle, Calendar, Target,
  RefreshCw, Download, Bell, Eye, Activity
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, Area, AreaChart, ComposedChart,
  ReferenceLine, Cell
} from "recharts";

// Mock data generator for simulating experiment progress
const generateMockData = (days, baselineRate, mde, noise = 0.02) => {
  const data = [];
  for (let i = 0; i <= days; i++) {
    const expectedLift = (i / days) * mde;
    const controlRate = baselineRate + (Math.random() - 0.5) * noise;
    const variantRate = baselineRate * (1 + expectedLift) + (Math.random() - 0.5) * noise;
    
    const controlSample = Math.floor(1000 + i * 50);
    const variantSample = Math.floor(1000 + i * 50);
    
    data.push({
      day: i,
      date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      controlRate: Math.max(0, Math.min(1, controlRate)),
      variantRate: Math.max(0, Math.min(1, variantRate)),
      lift: ((variantRate - controlRate) / controlRate) * 100,
      controlSample,
      variantSample,
      totalSample: controlSample + variantSample,
      pValue: Math.max(0.001, 0.5 * Math.exp(-i / (days / 3)))
    });
  }
  return data;
};

// Mock active experiments
const mockExperiments = [
  {
    id: "exp_001",
    name: "Homepage Hero Banner Redesign",
    status: "running",
    startDate: "2025-01-15",
    plannedEndDate: "2025-02-28",
    metric: "Conversion Rate",
    baselineRate: 0.105,
    targetLift: 0.05,
    currentLift: 0.038,
    pValue: 0.023,
    sampleSize: 45000,
    targetSampleSize: 60000,
    progress: 75,
    variants: ["Control", "Variation A"],
    category: "UX Optimization",
    health: "good"
  },
  {
    id: "exp_002",
    name: "Checkout Flow Simplification",
    status: "running",
    startDate: "2025-01-20",
    plannedEndDate: "2025-02-20",
    metric: "Add-to-Bag Rate",
    baselineRate: 0.085,
    targetLift: 0.10,
    currentLift: 0.121,
    pValue: 0.008,
    sampleSize: 38000,
    targetSampleSize: 50000,
    progress: 76,
    variants: ["Control", "Variation A", "Variation B"],
    category: "Conversion",
    health: "excellent"
  },
  {
    id: "exp_003",
    name: "Product Card Image Size Test",
    status: "running",
    startDate: "2025-02-01",
    plannedEndDate: "2025-02-21",
    metric: "Click-Through Rate",
    baselineRate: 0.145,
    targetLift: 0.03,
    currentLift: -0.015,
    pValue: 0.350,
    sampleSize: 12000,
    targetSampleSize: 40000,
    progress: 30,
    variants: ["Control", "Variation A"],
    category: "Engagement",
    health: "warning"
  },
  {
    id: "exp_004",
    name: "Pricing Display Experiment",
    status: "paused",
    startDate: "2025-01-10",
    plannedEndDate: "2025-02-15",
    metric: "Revenue per Visitor",
    baselineRate: 42.5,
    targetLift: 0.08,
    currentLift: 0.025,
    pValue: 0.180,
    sampleSize: 28000,
    targetSampleSize: 55000,
    progress: 51,
    variants: ["Control", "Variation A"],
    category: "Monetization",
    health: "attention"
  }
];

export default function ExperimentMonitoring() {
  const [experiments, setExperiments] = useState(mockExperiments);
  const [selectedExperiment, setSelectedExperiment] = useState(mockExperiments[0]);
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Generate time series data for selected experiment
  useEffect(() => {
    if (selectedExperiment) {
      const days = Math.floor((Date.now() - new Date(selectedExperiment.startDate).getTime()) / (24 * 60 * 60 * 1000));
      const data = generateMockData(days, selectedExperiment.baselineRate, selectedExperiment.targetLift);
      setTimeSeriesData(data);
    }
  }, [selectedExperiment]);

  // Auto-refresh simulation
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setLastUpdated(new Date());
        // In real app, fetch fresh data here
      }, 30000); // Refresh every 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const getHealthColor = (health) => {
    switch (health) {
      case 'excellent': return 'green';
      case 'good': return 'blue';
      case 'warning': return 'yellow';
      case 'attention': return 'red';
      default: return 'gray';
    }
  };

  const getHealthIcon = (health) => {
    switch (health) {
      case 'excellent': 
      case 'good': 
        return <CheckCircle2 size={16} />;
      case 'warning': 
      case 'attention': 
        return <AlertTriangle size={16} />;
      default: 
        return <Activity size={16} />;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      running: "bg-green-100 text-green-800 border-green-300",
      paused: "bg-yellow-100 text-yellow-800 border-yellow-300",
      completed: "bg-blue-100 text-blue-800 border-blue-300",
      stopped: "bg-red-100 text-red-800 border-red-300"
    };

    const icons = {
      running: <Play size={14} />,
      paused: <Pause size={14} />,
      completed: <CheckCircle2 size={14} />,
      stopped: <XCircle size={14} />
    };

    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border-2 font-semibold text-sm ${styles[status]}`}>
        {icons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>
    );
  };

  const exportData = () => {
    const exportData = {
      experiment: selectedExperiment,
      timeSeriesData,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `experiment_${selectedExperiment.id}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur rounded-xl">
              <Activity size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Experiment Monitoring</h1>
              <p className="text-indigo-100 mt-1">Real-time tracking of active A/B tests</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                autoRefresh 
                  ? "bg-green-500 text-white hover:bg-green-600" 
                  : "bg-white text-indigo-600 hover:bg-indigo-50"
              }`}
            >
              <RefreshCw size={20} className={autoRefresh ? "animate-spin" : ""} />
              {autoRefresh ? "Auto-Refresh On" : "Auto-Refresh Off"}
            </button>
            <button
              onClick={exportData}
              disabled={!selectedExperiment}
              className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Download size={20} />
              Export
            </button>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-indigo-100 flex items-center gap-2">
          <Clock size={16} />
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      </div>

      {/* Active Experiments Overview */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <BarChart3 size={28} className="text-indigo-600" />
          Active Experiments ({experiments.filter(e => e.status === 'running').length})
        </h2>

        <div className="grid grid-cols-4 gap-4">
          {experiments.map((exp) => (
            <div
              key={exp.id}
              onClick={() => setSelectedExperiment(exp)}
              className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                selectedExperiment?.id === exp.id
                  ? "border-indigo-500 bg-indigo-50 shadow-lg"
                  : "border-gray-300 bg-white hover:border-indigo-300 hover:shadow-md"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                {getStatusBadge(exp.status)}
                <div className={`text-${getHealthColor(exp.health)}-600`}>
                  {getHealthIcon(exp.health)}
                </div>
              </div>
              
              <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2">{exp.name}</h3>
              
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-gray-600">Progress:</span>
                  <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`bg-${getHealthColor(exp.health)}-500 h-2 rounded-full transition-all`}
                      style={{ width: `${exp.progress}%` }}
                    />
                  </div>
                  <span className="font-semibold text-gray-900">{exp.progress}%</span>
                </div>
                
                <div>
                  <span className="text-gray-600">Current Lift:</span>
                  <span className={`font-bold ml-1 ${
                    exp.currentLift > 0 ? "text-green-600" : "text-red-600"
                  }`}>
                    {exp.currentLift > 0 ? "+" : ""}{(exp.currentLift * 100).toFixed(1)}%
                  </span>
                </div>
                
                <div>
                  <span className="text-gray-600">P-value:</span>
                  <span className={`font-bold ml-1 ${
                    exp.pValue < 0.05 ? "text-green-600" : "text-gray-600"
                  }`}>
                    {exp.pValue.toFixed(3)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed View */}
      {selectedExperiment && (
        <>
          {/* Key Metrics */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Target size={28} className="text-indigo-600" />
                {selectedExperiment.name}
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Category:</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                  {selectedExperiment.category}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-6 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-5 border-2 border-blue-300">
                <div className="text-sm font-semibold text-blue-700 mb-1">Current Lift</div>
                <div className={`text-3xl font-bold ${
                  selectedExperiment.currentLift > 0 ? "text-green-600" : "text-red-600"
                }`}>
                  {selectedExperiment.currentLift > 0 ? "+" : ""}
                  {(selectedExperiment.currentLift * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  Target: +{(selectedExperiment.targetLift * 100).toFixed(1)}%
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl p-5 border-2 border-purple-300">
                <div className="text-sm font-semibold text-purple-700 mb-1">P-value</div>
                <div className={`text-3xl font-bold ${
                  selectedExperiment.pValue < 0.05 ? "text-green-600" : "text-gray-700"
                }`}>
                  {selectedExperiment.pValue.toFixed(3)}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {selectedExperiment.pValue < 0.05 ? "✓ Significant" : "Not significant"}
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-5 border-2 border-green-300">
                <div className="text-sm font-semibold text-green-700 mb-1">Sample Size</div>
                <div className="text-3xl font-bold text-green-600">
                  {(selectedExperiment.sampleSize / 1000).toFixed(0)}K
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  of {(selectedExperiment.targetSampleSize / 1000).toFixed(0)}K target
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-xl p-5 border-2 border-orange-300">
                <div className="text-sm font-semibold text-orange-700 mb-1">Progress</div>
                <div className="text-3xl font-bold text-orange-600">
                  {selectedExperiment.progress}%
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {Math.ceil((100 - selectedExperiment.progress) * 0.5)} days remaining
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-slate-100 rounded-xl p-5 border-2 border-gray-300">
                <div className="text-sm font-semibold text-gray-700 mb-1">Health Status</div>
                <div className={`text-3xl font-bold text-${getHealthColor(selectedExperiment.health)}-600 capitalize`}>
                  {selectedExperiment.health}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  No issues detected
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="text-gray-600">Start:</span>
                  <span className="font-semibold text-gray-900 ml-2">
                    {new Date(selectedExperiment.startDate).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Planned End:</span>
                  <span className="font-semibold text-gray-900 ml-2">
                    {new Date(selectedExperiment.plannedEndDate).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Variants:</span>
                  <span className="font-semibold text-gray-900 ml-2">
                    {selectedExperiment.variants.join(", ")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Time Series Visualizations */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Performance Over Time</h3>

            <div className="grid grid-cols-2 gap-8">
              {/* Conversion Rate Trends */}
              <div>
                <h4 className="font-bold text-gray-900 mb-4">Conversion Rate Trends</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" label={{ value: 'Days', position: 'insideBottom', offset: -5 }} />
                    <YAxis 
                      tickFormatter={(value) => `${(value * 100).toFixed(1)}%`}
                      label={{ value: 'Conversion Rate', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      formatter={(value) => `${(value * 100).toFixed(2)}%`}
                      labelFormatter={(label) => `Day ${label}`}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="controlRate" 
                      stroke="#6B7280" 
                      strokeWidth={2}
                      name="Control"
                      dot={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="variantRate" 
                      stroke="#8B5CF6" 
                      strokeWidth={2}
                      name="Variation"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Relative Lift Over Time */}
              <div>
                <h4 className="font-bold text-gray-900 mb-4">Relative Lift Over Time</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" label={{ value: 'Days', position: 'insideBottom', offset: -5 }} />
                    <YAxis 
                      label={{ value: '% Lift', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      formatter={(value) => `${value.toFixed(2)}%`}
                      labelFormatter={(label) => `Day ${label}`}
                    />
                    <ReferenceLine y={0} stroke="#000" strokeWidth={2} />
                    <Area 
                      type="monotone" 
                      dataKey="lift" 
                      fill="#8B5CF6" 
                      fillOpacity={0.3}
                      stroke="#8B5CF6"
                      strokeWidth={2}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Sample Size Growth */}
              <div>
                <h4 className="font-bold text-gray-900 mb-4">Sample Size Accumulation</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" label={{ value: 'Days', position: 'insideBottom', offset: -5 }} />
                    <YAxis 
                      label={{ value: 'Sample Size', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      formatter={(value) => value.toLocaleString()}
                      labelFormatter={(label) => `Day ${label}`}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="controlSample" 
                      stackId="1"
                      stroke="#6B7280" 
                      fill="#9CA3AF"
                      name="Control"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="variantSample" 
                      stackId="1"
                      stroke="#8B5CF6" 
                      fill="#C4B5FD"
                      name="Variation"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* P-value Evolution */}
              <div>
                <h4 className="font-bold text-gray-900 mb-4">Statistical Significance Evolution</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" label={{ value: 'Days', position: 'insideBottom', offset: -5 }} />
                    <YAxis 
                      domain={[0, 0.5]}
                      label={{ value: 'P-value', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      formatter={(value) => value.toFixed(4)}
                      labelFormatter={(label) => `Day ${label}`}
                    />
                    <ReferenceLine y={0.05} stroke="#EF4444" strokeWidth={2} strokeDasharray="5 5" label="α = 0.05" />
                    <Line 
                      type="monotone" 
                      dataKey="pValue" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Health Checks & Alerts */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Bell size={28} className="text-indigo-600" />
              Health Checks & Alerts
            </h3>

            <div className="grid grid-cols-2 gap-6">
              {/* SRM Check */}
              <div className="bg-green-50 border-2 border-green-400 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle2 size={24} className="text-green-600" />
                  <h4 className="font-bold text-green-900">Sample Ratio Mismatch</h4>
                </div>
                <p className="text-sm text-green-800 mb-2">
                  Traffic split is within expected bounds. No allocation issues detected.
                </p>
                <div className="bg-white rounded-lg p-3 mt-3">
                  <div className="text-xs text-gray-600">Expected vs Actual Split</div>
                  <div className="text-sm font-semibold text-gray-900">50/50 → 50.2/49.8 ✓</div>
                </div>
              </div>

              {/* Data Quality */}
              <div className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Eye size={24} className="text-blue-600" />
                  <h4 className="font-bold text-blue-900">Data Quality</h4>
                </div>
                <p className="text-sm text-blue-800 mb-2">
                  All metrics are being tracked correctly. No data anomalies detected.
                </p>
                <div className="bg-white rounded-lg p-3 mt-3">
                  <div className="text-xs text-gray-600">Data Completeness</div>
                  <div className="text-sm font-semibold text-gray-900">99.8% ✓</div>
                </div>
              </div>

              {/* Seasonality */}
              <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <AlertTriangle size={24} className="text-yellow-600" />
                  <h4 className="font-bold text-yellow-900">Seasonality Check</h4>
                </div>
                <p className="text-sm text-yellow-800 mb-2">
                  Weekend traffic detected. Consider day-of-week effects in final analysis.
                </p>
                <div className="bg-white rounded-lg p-3 mt-3">
                  <div className="text-xs text-gray-600">Day of Week Variation</div>
                  <div className="text-sm font-semibold text-gray-900">±8% (normal)</div>
                </div>
              </div>

              {/* Statistical Power */}
              <div className="bg-purple-50 border-2 border-purple-400 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Target size={24} className="text-purple-600" />
                  <h4 className="font-bold text-purple-900">Statistical Power</h4>
                </div>
                <p className="text-sm text-purple-800 mb-2">
                  Current sample size provides {selectedExperiment.progress > 80 ? "excellent" : "good"} statistical power.
                </p>
                <div className="bg-white rounded-lg p-3 mt-3">
                  <div className="text-xs text-gray-600">Estimated Power</div>
                  <div className="text-sm font-semibold text-gray-900">
                    {selectedExperiment.progress > 80 ? "85%" : "72%"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
