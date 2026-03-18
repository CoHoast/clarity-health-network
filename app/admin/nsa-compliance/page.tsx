"use client";

import { useTheme } from "@/components/admin/ThemeContext";
import { cn } from "@/lib/utils";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, Calculator, FileText, AlertTriangle, CheckCircle, Clock, X, DollarSign, Calendar, Building2 } from "lucide-react";

const idrCases = [
  { id: "IDR-2024-001", provider: "Metro Hospital", service: "Emergency Surgery", billed: 45000, qpa: 12500, offered: 15000, status: "pending", deadline: "2024-03-25" },
  { id: "IDR-2024-002", provider: "Cleveland Orthopedic", service: "Knee Replacement", billed: 38000, qpa: 18000, offered: 22000, status: "in_review", deadline: "2024-03-20" },
  { id: "IDR-2024-003", provider: "Specialty Imaging", service: "MRI w/ Contrast", billed: 4500, qpa: 1200, offered: 1500, status: "resolved", deadline: "2024-03-10", resolution: "Provider accepted QPA" },
];

const gfeRequests = [
  { id: "GFE-2024-015", member: "John Smith", service: "Hip Replacement", provider: "Cleveland Orthopedic", status: "completed", estimate: 28500 },
  { id: "GFE-2024-016", member: "Sarah Johnson", service: "Colonoscopy", provider: "Metro Endoscopy", status: "pending", estimate: null },
  { id: "GFE-2024-017", member: "Michael Chen", service: "Cardiac Cath", provider: "Heart Center", status: "completed", estimate: 15200 },
];

export default function NSACompliancePage() {
  const [selectedCase, setSelectedCase] = useState<typeof idrCases[0] | null>(null);
  const [showCalculator, setShowCalculator] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "resolved": return <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">Resolved</span>;
      case "pending": return <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full">Pending</span>;
      case "in_review": return <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full">In Review</span>;
      case "completed": return <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">Completed</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
            <Scale className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">NSA Compliance</h1>
            <p className="text-slate-400">No Surprises Act - QPA Calculator & IDR Management</p>
          </div>
        </div>
        <button onClick={() => setShowCalculator(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600">
          <Calculator className="w-4 h-4" />QPA Calculator
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-white">12</p>
          <p className="text-sm text-slate-400">Active IDR Cases</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-green-400">89%</p>
          <p className="text-sm text-slate-400">Win Rate</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-amber-400">$124K</p>
          <p className="text-sm text-slate-400">Savings YTD</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-blue-400">156</p>
          <p className="text-sm text-slate-400">GFE Requests</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* IDR Cases */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700">
            <h2 className="text-lg font-semibold text-white">IDR Cases</h2>
          </div>
          <div className="divide-y divide-slate-700">
            {idrCases.map((case_) => (
              <button key={case_.id} onClick={() => setSelectedCase(case_)} className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800/80 text-left">
                <div>
                  <p className="font-medium text-white">{case_.provider}</p>
                  <p className="text-sm text-slate-400">{case_.service}</p>
                  <p className="text-xs text-slate-500 mt-1">{case_.id}</p>
                </div>
                <div className="text-right">
                  {getStatusBadge(case_.status)}
                  <p className="text-sm text-slate-400 mt-1">Due: {case_.deadline}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* GFE Requests */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700">
            <h2 className="text-lg font-semibold text-white">Good Faith Estimates</h2>
          </div>
          <div className="divide-y divide-slate-700">
            {gfeRequests.map((gfe) => (
              <div key={gfe.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">{gfe.member}</p>
                  <p className="text-sm text-slate-400">{gfe.service}</p>
                  <p className="text-xs text-slate-500 mt-1">{gfe.provider}</p>
                </div>
                <div className="text-right">
                  {getStatusBadge(gfe.status)}
                  {gfe.estimate && <p className="text-lg font-bold text-green-400 mt-1">${gfe.estimate.toLocaleString()}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* IDR Case Detail */}
      <AnimatePresence>
        {selectedCase && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedCase(null)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50">
              <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white">IDR Case Details</h3>
                  <p className="text-sm text-slate-400">{selectedCase.id}</p>
                </div>
                <button onClick={() => setSelectedCase(null)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex gap-2">{getStatusBadge(selectedCase.status)}</div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Building2 className="w-5 h-5 text-slate-400" />
                    <span className="text-white font-medium">{selectedCase.provider}</span>
                  </div>
                  <p className="text-slate-400">{selectedCase.service}</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                    <p className="text-xs text-slate-400">Billed</p>
                    <p className="text-lg font-bold text-red-400">${selectedCase.billed.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                    <p className="text-xs text-slate-400">QPA</p>
                    <p className="text-lg font-bold text-green-400">${selectedCase.qpa.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                    <p className="text-xs text-slate-400">Our Offer</p>
                    <p className="text-lg font-bold text-blue-400">${selectedCase.offered.toLocaleString()}</p>
                  </div>
                </div>
                {selectedCase.resolution && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                    <p className="text-green-400">{selectedCase.resolution}</p>
                  </div>
                )}
              </div>
              <div className="flex gap-2 p-4 border-t border-slate-700">
                <button onClick={() => setSelectedCase(null)} className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Close</button>
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600">Submit Response</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* QPA Calculator Modal */}
      <AnimatePresence>
        {showCalculator && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCalculator(false)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50">
              <div className="p-4 border-b border-slate-700">
                <h3 className="font-semibold text-white">QPA Calculator</h3>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">CPT Code</label>
                  <input type="text" placeholder="e.g., 99213" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Place of Service</label>
                  <select className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                    <option>11 - Office</option>
                    <option>21 - Inpatient Hospital</option>
                    <option>22 - Outpatient Hospital</option>
                    <option>23 - Emergency Room</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Geographic Region</label>
                  <select className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                    <option>Cleveland Metro</option>
                    <option>Northeast Ohio</option>
                    <option>Statewide</option>
                  </select>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
                  <p className="text-sm text-slate-400">Calculated QPA</p>
                  <p className="text-3xl font-bold text-green-400">$142.50</p>
                </div>
              </div>
              <div className="flex gap-2 p-4 border-t border-slate-700">
                <button onClick={() => setShowCalculator(false)} className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Close</button>
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600">Calculate</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
