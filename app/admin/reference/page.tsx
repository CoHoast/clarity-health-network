"use client";

import { useTheme } from "@/components/admin/ThemeContext";
import { cn } from "@/lib/utils";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, Search, Download, X, FileText, Hash, Pill, Stethoscope } from "lucide-react";

const codeSets = [
  { id: "ICD10", name: "ICD-10-CM", description: "Diagnosis codes", count: 72184, lastUpdated: "2024-01-01" },
  { id: "CPT", name: "CPT/HCPCS", description: "Procedure codes", count: 10256, lastUpdated: "2024-01-01" },
  { id: "NDC", name: "NDC", description: "Drug codes", count: 245892, lastUpdated: "2024-03-01" },
  { id: "NUBC", name: "Revenue Codes", description: "Facility billing", count: 892, lastUpdated: "2023-10-01" },
];

const sampleCodes = {
  ICD10: [
    { code: "J06.9", description: "Acute upper respiratory infection, unspecified", category: "Respiratory" },
    { code: "M54.5", description: "Low back pain", category: "Musculoskeletal" },
    { code: "E11.9", description: "Type 2 diabetes mellitus without complications", category: "Endocrine" },
    { code: "I10", description: "Essential (primary) hypertension", category: "Circulatory" },
    { code: "F32.9", description: "Major depressive disorder, single episode, unspecified", category: "Mental Health" },
  ],
  CPT: [
    { code: "99213", description: "Office visit, established patient, low complexity", category: "E&M" },
    { code: "99214", description: "Office visit, established patient, moderate complexity", category: "E&M" },
    { code: "99215", description: "Office visit, established patient, high complexity", category: "E&M" },
    { code: "36415", description: "Venipuncture", category: "Lab" },
    { code: "71046", description: "Chest X-ray, 2 views", category: "Radiology" },
  ],
  NDC: [
    { code: "00378-1800-01", description: "Metformin 500mg tablets", category: "Diabetes" },
    { code: "00591-0405-01", description: "Lisinopril 10mg tablets", category: "Cardiovascular" },
    { code: "00093-7180-01", description: "Omeprazole 20mg capsules", category: "GI" },
  ],
  NUBC: [
    { code: "0120", description: "Room & Board - Semi-Private", category: "Room" },
    { code: "0450", description: "Emergency Room", category: "ER" },
    { code: "0360", description: "Operating Room Services", category: "Surgery" },
  ],
};

export default function ReferencePage() {
  const { isDark } = useTheme();
  const [selectedCodeSet, setSelectedCodeSet] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const currentCodes = selectedCodeSet ? sampleCodes[selectedCodeSet as keyof typeof sampleCodes] || [] : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center">
            <Database className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Reference Data</h1>
            <p className="text-slate-400">ICD-10, CPT, NDC code lookups</p>
          </div>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 border border-slate-600">
          <Download className="w-4 h-4" />Export
        </button>
      </div>

      {/* Code Sets Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {codeSets.map((codeSet) => (
          <button
            key={codeSet.id}
            onClick={() => setSelectedCodeSet(codeSet.id)}
            className={`bg-slate-800/50 rounded-xl border p-5 text-left transition-all ${
              selectedCodeSet === codeSet.id ? "border-blue-600 ring-1 ring-blue-600" : "border-slate-700 hover:border-slate-600"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                {codeSet.id === "NDC" ? <Pill className="w-5 h-5 text-blue-400" /> :
                 codeSet.id === "ICD10" ? <Stethoscope className="w-5 h-5 text-blue-400" /> :
                 <Hash className="w-5 h-5 text-blue-400" />}
              </div>
              <div>
                <h3 className="font-semibold text-white">{codeSet.name}</h3>
                <p className="text-xs text-slate-500">{codeSet.id}</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-2">{codeSet.description}</p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">{codeSet.count.toLocaleString()} codes</span>
              <span className="text-slate-500">Updated {codeSet.lastUpdated}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Code Lookup */}
      {selectedCodeSet && (
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">{codeSets.find(c => c.id === selectedCodeSet)?.name} Lookup</h2>
            <button onClick={() => setSelectedCodeSet(null)} className="text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-slate-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search by code or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Results */}
          <table className="w-full">
            <thead className="bg-slate-800 border-b border-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-slate-400 uppercase">Code</th>
                <th className="px-6 py-3 text-left text-xs text-slate-400 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs text-slate-400 uppercase">Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {currentCodes.filter(c => 
                c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.description.toLowerCase().includes(searchQuery.toLowerCase())
              ).map((code) => (
                <tr key={code.code} className="hover:bg-slate-800/80">
                  <td className="px-6 py-3 font-mono text-blue-500">{code.code}</td>
                  <td className="px-6 py-3 text-white">{code.description}</td>
                  <td className="px-6 py-3">
                    <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded">{code.category}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-6 py-3 bg-slate-800/50 border-t border-slate-700 text-sm text-slate-500">
            Showing {currentCodes.length} of {codeSets.find(c => c.id === selectedCodeSet)?.count.toLocaleString()} codes
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-5">
          <p className="text-3xl font-bold text-white">328,224</p>
          <p className="text-sm text-slate-400">Total Reference Codes</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-5">
          <p className="text-3xl font-bold text-green-400">2024</p>
          <p className="text-sm text-slate-400">Current Version Year</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-5">
          <p className="text-3xl font-bold text-blue-400">4</p>
          <p className="text-sm text-slate-400">Code Sets Maintained</p>
        </div>
      </div>
    </div>
  );
}
