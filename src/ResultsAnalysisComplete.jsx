import React, { useState } from "react";
import { Calculator, BookOpen } from "lucide-react";
import ResultsAnalysisTab_Enhanced from './ResultsAnalysisTab_Enhanced';
import DocumentationTab from './DocumentationTab';

/**
 * Results Analysis with Guided Instructions and Documentation
 * 
 * This component provides:
 * 1. Tab navigation between Analysis and Documentation
 * 2. Analysis tab with step-by-step guided instructions
 * 3. Comprehensive documentation tab
 */

export default function ResultsAnalysisComplete() {
  const [activeTab, setActiveTab] = useState("analysis");

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("analysis")}
            className={`flex-1 px-8 py-5 font-bold text-base flex items-center justify-center gap-3 transition-all ${
              activeTab === "analysis"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <Calculator size={24} />
            <span>Analysis</span>
            {activeTab === "analysis" && (
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                Run your test analysis here
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("documentation")}
            className={`flex-1 px-8 py-5 font-bold text-base flex items-center justify-center gap-3 transition-all ${
              activeTab === "documentation"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <BookOpen size={24} />
            <span>Documentation</span>
            {activeTab === "documentation" && (
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                Learn how to use the tool
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="transition-all duration-300">
        {activeTab === "analysis" ? (
          <ResultsAnalysisTab_Enhanced />
        ) : (
          <DocumentationTab />
        )}
      </div>

      {/* Helpful Banner at Bottom */}
      {activeTab === "analysis" && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <BookOpen size={20} />
              </div>
              <div>
                <p className="font-bold text-blue-900">Need help understanding the analysis?</p>
                <p className="text-sm text-blue-700">Check out the Documentation tab for detailed explanations and examples.</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab("documentation")}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
            >
              View Documentation
            </button>
          </div>
        </div>
      )}

      {activeTab === "documentation" && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 text-white p-2 rounded-lg">
                <Calculator size={20} />
              </div>
              <div>
                <p className="font-bold text-indigo-900">Ready to analyze your experiment?</p>
                <p className="text-sm text-indigo-700">Head back to the Analysis tab to run your statistical tests.</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab("analysis")}
              className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all"
            >
              Go to Analysis
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
