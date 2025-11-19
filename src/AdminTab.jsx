import React, { useState } from "react";
import { Upload, Download, FileSpreadsheet, Trash2, CheckCircle2, XCircle, Info, Settings } from "lucide-react";
import * as XLSX from "xlsx";

/**
 * Admin Tab Component for Managing Experiment Data
 * 
 * Features:
 * - Upload Excel files with experiments
 * - Download Excel template
 * - Export current data to Excel
 * - Delete experiments
 * - Preview before importing
 * - Validate data format
 */
export default function AdminTab({ testData, setTestData }) {
  const [uploadStatus, setUploadStatus] = useState("");
  const [previewData, setPreviewData] = useState(null);

  // Handle Excel file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Validate required columns
        const requiredColumns = [
          "Test Launch Date", "Test End Date", "Test Stage", "Summary",
          "Platform", "Category", "LOB(s)", "Country or Countries",
          "Page Type(s)", "Page Section(s)", "Page Element(s)", "Product",
          "Hypothesis", "Optimization Result"
        ];

        if (jsonData.length > 0) {
          const columns = Object.keys(jsonData[0]);
          const missingColumns = requiredColumns.filter(col => !columns.includes(col));
          
          if (missingColumns.length > 0) {
            setUploadStatus(`Error: Missing columns: ${missingColumns.join(", ")}`);
            return;
          }

          setPreviewData(jsonData);
          setUploadStatus(`Preview: ${jsonData.length} experiments loaded. Review and confirm to import.`);
        }
      } catch (error) {
        setUploadStatus(`Error: ${error.message}`);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Confirm import
  const confirmImport = () => {
    if (previewData) {
      setTestData(previewData);
      setUploadStatus(`Success: ${previewData.length} experiments imported!`);
      setPreviewData(null);
    }
  };

  // Cancel import
  const cancelImport = () => {
    setPreviewData(null);
    setUploadStatus("");
  };

  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(testData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Experiments");
    XLSX.writeFile(workbook, `experiments_${new Date().toISOString().split('T')[0]}.xlsx`);
    setUploadStatus("Success: Experiments exported to Excel!");
  };

  // Delete experiment
  const deleteExperiment = (index) => {
    if (window.confirm("Are you sure you want to delete this experiment?")) {
      const newData = testData.filter((_, i) => i !== index);
      setTestData(newData);
      setUploadStatus("Experiment deleted successfully.");
    }
  };

  // Download template
  const downloadTemplate = () => {
    const template = [{
      "Test Launch Date": "2025-01-01",
      "Test End Date": "2025-01-15",
      "Test Stage": "Completed",
      "Summary": "Example Experiment",
      "Platform": "Platform Name",
      "Category": "BAU",
      "LOB(s)": "Multi-LOB",
      "Country or Countries": "United States",
      "Page Type(s)": "Homepage",
      "Page Section(s)": "Hero Banner",
      "Page Element(s)": "CTA",
      "Product": "Product Name",
      "Hypothesis": "Your hypothesis here...",
      "Optimization Result": "Your results here..."
    }];
    
    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    XLSX.writeFile(workbook, "experiment_template.xlsx");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-2xl p-8 text-white">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 backdrop-blur rounded-xl">
            <Settings size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-purple-100 mt-1">Manage your experiment data - Upload, edit, and export</p>
          </div>
        </div>
      </div>

      {/* Status Message */}
      {uploadStatus && (
        <div className={`p-4 rounded-xl border-2 ${
          uploadStatus.includes("Error") 
            ? "bg-red-50 border-red-400 text-red-800"
            : uploadStatus.includes("Success")
            ? "bg-green-50 border-green-400 text-green-800"
            : "bg-blue-50 border-blue-400 text-blue-800"
        }`}>
          <p className="font-semibold">{uploadStatus}</p>
        </div>
      )}

      {/* Action Cards */}
      <div className="grid grid-cols-3 gap-6">
        {/* Upload Excel */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Upload size={24} className="text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Upload Excel</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Import experiments from Excel file. File must match the required format.
          </p>
          <label className="block">
            <div className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 cursor-pointer transition-all text-center">
              Choose File
            </div>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Download Template */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <FileSpreadsheet size={24} className="text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Get Template</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Download Excel template with correct column format for easy data entry.
          </p>
          <button
            onClick={downloadTemplate}
            className="w-full px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all"
          >
            Download Template
          </button>
        </div>

        {/* Export Data */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <Download size={24} className="text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Export Data</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Export current experiments to Excel for backup or sharing.
          </p>
          <button
            onClick={exportToExcel}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all"
          >
            Export to Excel
          </button>
        </div>
      </div>

      {/* Preview Data Table */}
      {previewData && (
        <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-400 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Preview Import Data</h3>
            <div className="flex gap-3">
              <button
                onClick={confirmImport}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all flex items-center gap-2"
              >
                <CheckCircle2 size={18} />
                Confirm Import
              </button>
              <button
                onClick={cancelImport}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-all flex items-center gap-2"
              >
                <XCircle size={18} />
                Cancel
              </button>
            </div>
          </div>

          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Summary</th>
                  <th className="px-4 py-2 text-left font-semibold">Stage</th>
                  <th className="px-4 py-2 text-left font-semibold">Launch Date</th>
                  <th className="px-4 py-2 text-left font-semibold">Product</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {previewData.slice(0, 10).map((exp, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{exp.Summary}</td>
                    <td className="px-4 py-2">{exp["Test Stage"]}</td>
                    <td className="px-4 py-2">{exp["Test Launch Date"]}</td>
                    <td className="px-4 py-2">{exp.Product}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {previewData.length > 10 && (
              <p className="text-center text-gray-500 mt-4">
                ... and {previewData.length - 10} more experiments
              </p>
            )}
          </div>
        </div>
      )}

      {/* Current Data Management */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Current Experiments ({testData.length})</h3>
        </div>

        <div className="overflow-x-auto max-h-[600px]">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase">#</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase">Summary</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase">Stage</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase">Launch Date</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase">Product</th>
                <th className="px-4 py-3 text-center text-xs font-bold uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {testData.map((exp, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-semibold text-gray-600">{idx + 1}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{exp.Summary}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                      {exp["Test Stage"]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{exp["Test Launch Date"]}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{exp.Product}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => deleteExperiment(idx)}
                      className="px-3 py-1 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all flex items-center gap-2 mx-auto text-xs"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6">
        <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
          <Info size={20} />
          Excel Format Requirements
        </h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p><strong>Required Columns:</strong></p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Test Launch Date, Test End Date, Test Stage</li>
            <li>Summary, Platform, Category, LOB(s)</li>
            <li>Country or Countries, Page Type(s), Page Section(s), Page Element(s)</li>
            <li>Product, Hypothesis, Optimization Result</li>
          </ul>
          <p className="mt-3"><strong>Tips:</strong></p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Use the template for correct format</li>
            <li>Dates should be in YYYY-MM-DD format</li>
            <li>Test Stage: Completed, Live, Development, Intake, Proposal, Result Analysis, Result Implementation</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
