"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Brain, Database, MessageSquare, BarChart3, Settings, Upload, X, CheckCircle, Play, FileText } from "lucide-react";

const knowledgeBases = [
  { id: "KB-001", name: "Benefits & Coverage", documents: 45, lastUpdated: "2024-03-10", status: "active" },
  { id: "KB-002", name: "Claims Process", documents: 23, lastUpdated: "2024-03-08", status: "active" },
  { id: "KB-003", name: "Provider Network", documents: 67, lastUpdated: "2024-03-12", status: "active" },
  { id: "KB-004", name: "Compliance & Regulations", documents: 34, lastUpdated: "2024-02-28", status: "training" },
];

const recentQueries = [
  { query: "What's my deductible?", response: "Your deductible is $500 individual...", portal: "Member", time: "2 min ago", rating: 5 },
  { query: "How do I submit a claim?", response: "To submit a claim, navigate to...", portal: "Provider", time: "5 min ago", rating: 4 },
  { query: "When is open enrollment?", response: "Open enrollment runs from...", portal: "Employer", time: "8 min ago", rating: 5 },
  { query: "Check eligibility for patient", response: "Patient John Doe is eligible...", portal: "Provider", time: "12 min ago", rating: 5 },
];

const analytics = {
  totalQueries: 12456,
  avgRating: 4.7,
  responseTime: "1.2s",
  resolutionRate: 94,
};

export default function PulseConfigPage() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedKB, setSelectedKB] = useState<typeof knowledgeBases[0] | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Pulse AI Configuration</h1>
            <p className="text-slate-400">Knowledge base, training, and analytics</p>
          </div>
        </div>
        <button onClick={() => setShowUploadModal(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
          <Upload className="w-4 h-4" />Upload Documents
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-white">{analytics.totalQueries.toLocaleString()}</p>
          <p className="text-sm text-slate-400">Total Queries</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-amber-400">{analytics.avgRating}</p>
            <span className="text-amber-400">★</span>
          </div>
          <p className="text-sm text-slate-400">Avg Rating</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-green-400">{analytics.responseTime}</p>
          <p className="text-sm text-slate-400">Avg Response</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-blue-400">{analytics.resolutionRate}%</p>
          <p className="text-sm text-slate-400">Resolution Rate</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Knowledge Bases */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-cyan-400" />Knowledge Bases
            </h2>
            <button className="text-cyan-500 text-sm hover:text-cyan-400">+ Add</button>
          </div>
          <div className="divide-y divide-slate-700">
            {knowledgeBases.map((kb) => (
              <button key={kb.id} onClick={() => setSelectedKB(kb)} className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800/80 text-left">
                <div>
                  <p className="font-medium text-white">{kb.name}</p>
                  <p className="text-sm text-slate-400">{kb.documents} documents</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 text-xs rounded-full ${kb.status === "active" ? "bg-green-500/20 text-green-400" : "bg-amber-500/20 text-amber-400"}`}>
                    {kb.status}
                  </span>
                  <p className="text-xs text-slate-500 mt-1">Updated {kb.lastUpdated}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Queries */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-400" />Recent Queries
            </h2>
          </div>
          <div className="divide-y divide-slate-700">
            {recentQueries.map((query, i) => (
              <div key={i} className="px-6 py-4">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-medium text-white">"{query.query}"</p>
                  <span className="px-2 py-0.5 bg-slate-700 text-slate-300 text-xs rounded">{query.portal}</span>
                </div>
                <p className="text-sm text-slate-400 truncate">{query.response}</p>
                <div className="flex items-center justify-between mt-2 text-xs">
                  <span className="text-slate-500">{query.time}</span>
                  <span className="text-amber-400">{"★".repeat(query.rating)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Model Settings */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-cyan-500" />Model Configuration
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Model</label>
            <select className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
              <option>Claude 3.5 Sonnet</option>
              <option>Claude 3 Opus</option>
              <option>GPT-4 Turbo</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Temperature</label>
            <input type="range" min="0" max="100" defaultValue="30" className="w-full" />
            <p className="text-xs text-slate-500 mt-1">0.3 (More focused)</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Max Tokens</label>
            <input type="number" defaultValue="1024" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" />
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowUploadModal(false)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50">
              <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                <h3 className="font-semibold text-white">Upload to Knowledge Base</h3>
                <button onClick={() => setShowUploadModal(false)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Knowledge Base</label>
                  <select className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                    {knowledgeBases.map(kb => <option key={kb.id}>{kb.name}</option>)}
                  </select>
                </div>
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-cyan-600/50 transition-colors cursor-pointer">
                  <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                  <p className="font-medium text-white">Drop files here</p>
                  <p className="text-sm text-slate-500 mt-1">PDF, DOCX, TXT, MD</p>
                </div>
              </div>
              <div className="flex gap-2 p-4 border-t border-slate-700">
                <button onClick={() => setShowUploadModal(false)} className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Cancel</button>
                <button onClick={() => setShowUploadModal(false)} className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">Upload & Train</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* KB Detail Modal */}
      <AnimatePresence>
        {selectedKB && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedKB(null)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50">
              <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                <h3 className="font-semibold text-white">{selectedKB.name}</h3>
                <button onClick={() => setSelectedKB(null)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${selectedKB.status === "active" ? "bg-green-500/20 text-green-400" : "bg-amber-500/20 text-amber-400"}`}>
                    {selectedKB.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <p className="text-sm text-slate-400">Documents</p>
                    <p className="text-xl font-bold text-white">{selectedKB.documents}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <p className="text-sm text-slate-400">Last Updated</p>
                    <p className="text-xl font-bold text-white">{selectedKB.lastUpdated}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-300">Recent Documents</p>
                  {["Benefits_Guide_2024.pdf", "Claims_FAQ.docx", "Network_Directory.pdf"].map(doc => (
                    <div key={doc} className="flex items-center gap-2 p-2 bg-slate-700/50 rounded-lg">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-white">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 p-4 border-t border-slate-700">
                <button onClick={() => setSelectedKB(null)} className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Close</button>
                <button className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center justify-center gap-2">
                  <Play className="w-4 h-4" />Retrain
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
