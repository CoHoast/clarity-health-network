"use client";

import { useTheme } from "@/components/admin/ThemeContext";
import { cn } from "@/lib/utils";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileInput, CheckCircle, Clock, AlertTriangle, XCircle, Search, Filter, Eye, X, FileText, Upload, RefreshCw } from "lucide-react";

const incomingClaims = [
  { id: "837P-2024-001", type: "837P", submitter: "Cleveland Family Medicine", received: "2024-03-12 14:32", records: 47, status: "processing", progress: 65 },
  { id: "837I-2024-002", type: "837I", submitter: "Metro Hospital", received: "2024-03-12 14:28", records: 12, status: "queued", progress: 0 },
  { id: "837P-2024-003", type: "837P", submitter: "Westlake Urgent Care", received: "2024-03-12 14:15", records: 89, status: "complete", progress: 100 },
  { id: "837P-2024-004", type: "837P", submitter: "Dr. Sarah Chen", received: "2024-03-12 13:45", records: 23, status: "complete", progress: 100 },
  { id: "837I-2024-005", type: "837I", submitter: "Cleveland Orthopedic", received: "2024-03-12 13:30", records: 8, status: "error", progress: 45, errors: 3 },
  { id: "837P-2024-006", type: "837P", submitter: "Metro Imaging", received: "2024-03-12 12:00", records: 156, status: "complete", progress: 100 },
];

export default function ClaimsIntakePage() {
  const { isDark } = useTheme();
  const [selectedBatch, setSelectedBatch] = useState<typeof incomingClaims[0] | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "complete": return <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full flex items-center gap-1"><CheckCircle className="w-3 h-3" />Complete</span>;
      case "processing": return <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full flex items-center gap-1"><RefreshCw className="w-3 h-3 animate-spin" />Processing</span>;
      case "queued": return <span className="px-2 py-1 bg-slate-500/20 text-slate-400 text-xs font-medium rounded-full flex items-center gap-1"><Clock className="w-3 h-3" />Queued</span>;
      case "error": return <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-medium rounded-full flex items-center gap-1"><XCircle className="w-3 h-3" />Error</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Claims Intake</h1>
          <p className="text-slate-400">Incoming 837 files and processing queue</p>
        </div>
        <button onClick={() => setShowUploadModal(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600">
          <Upload className="w-4 h-4" />Manual Upload
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-white">335</p>
          <p className="text-sm text-slate-400">Claims Today</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-blue-400">47</p>
          <p className="text-sm text-slate-400">Processing</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-green-400">285</p>
          <p className="text-sm text-slate-400">Completed</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-red-400">3</p>
          <p className="text-sm text-slate-400">Errors</p>
        </div>
      </div>

      {/* Queue */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Processing Queue</h2>
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>Live
          </div>
        </div>
        <table className="w-full">
          <thead className="bg-slate-800 border-b border-slate-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Batch ID</th>
              <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Type</th>
              <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Submitter</th>
              <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Received</th>
              <th className="px-4 py-3 text-center text-xs text-slate-400 uppercase">Records</th>
              <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Progress</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {incomingClaims.map((batch) => (
              <tr key={batch.id} className="hover:bg-slate-800/80">
                <td className="px-4 py-3 font-mono text-blue-500">{batch.id}</td>
                <td className="px-4 py-3"><span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded">{batch.type}</span></td>
                <td className="px-4 py-3 text-white">{batch.submitter}</td>
                <td className="px-4 py-3 text-slate-400 text-sm">{batch.received}</td>
                <td className="px-4 py-3 text-center text-white">{batch.records}</td>
                <td className="px-4 py-3">{getStatusBadge(batch.status)}</td>
                <td className="px-4 py-3 w-32">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${batch.status === "error" ? "bg-red-500" : "bg-green-500"}`} style={{ width: `${batch.progress}%` }}></div>
                    </div>
                    <span className="text-xs text-slate-400">{batch.progress}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => setSelectedBatch(batch)} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-600/20 rounded">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Batch Detail Modal */}
      <AnimatePresence>
        {selectedBatch && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedBatch(null)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50">
              <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white">{selectedBatch.id}</h3>
                  <p className="text-sm text-slate-400">{selectedBatch.submitter}</p>
                </div>
                <button onClick={() => setSelectedBatch(null)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex gap-2">{getStatusBadge(selectedBatch.status)}</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <p className="text-sm text-slate-400">File Type</p>
                    <p className="text-white font-medium">{selectedBatch.type}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <p className="text-sm text-slate-400">Records</p>
                    <p className="text-white font-medium">{selectedBatch.records}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <p className="text-sm text-slate-400">Received</p>
                    <p className="text-white font-medium">{selectedBatch.received}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <p className="text-sm text-slate-400">Progress</p>
                    <p className="text-white font-medium">{selectedBatch.progress}%</p>
                  </div>
                </div>
                {selectedBatch.errors && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                    <p className="text-red-400 font-medium">{selectedBatch.errors} validation errors found</p>
                    <p className="text-sm text-red-300 mt-1">Review required before processing can continue.</p>
                  </div>
                )}
              </div>
              <div className="flex gap-2 p-4 border-t border-slate-700">
                <button onClick={() => setSelectedBatch(null)} className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Close</button>
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600">View Claims</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowUploadModal(false)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50">
              <div className="p-4 border-b border-slate-700">
                <h3 className="font-semibold text-white">Manual Upload</h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-blue-600/50 transition-colors cursor-pointer">
                  <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                  <p className="font-medium text-white">Drop 837 file here</p>
                  <p className="text-sm text-slate-500 mt-1">837P or 837I format</p>
                </div>
              </div>
              <div className="flex gap-2 p-4 border-t border-slate-700">
                <button onClick={() => setShowUploadModal(false)} className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Cancel</button>
                <button onClick={() => setShowUploadModal(false)} className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600">Upload</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
