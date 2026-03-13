"use client";

import { useState } from "react";
import { FileText, Download, Calendar, Clock, BarChart3, Users, DollarSign, Shield, TrendingUp, Play, Eye, Mail, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const reportTemplates = [
  { id: "claims-summary", name: "Claims Summary", description: "Overview of all claims by status, amount, and provider", icon: FileText, category: "Claims", file: "/docs/claims-summary-report.pdf" },
  { id: "member-census", name: "Member Census", description: "Complete member roster with demographics", icon: Users, category: "Members", file: "/docs/member-census.pdf" },
  { id: "financial-overview", name: "Financial Overview", description: "Revenue, expenses, and profitability analysis", icon: DollarSign, category: "Financial", file: "/docs/financial-report.pdf" },
  { id: "provider-network", name: "Provider Network", description: "Network adequacy and provider statistics", icon: Shield, category: "Network", file: "/docs/provider-network-report.pdf" },
  { id: "utilization", name: "Utilization Report", description: "Service utilization trends and patterns", icon: TrendingUp, category: "Analytics", file: "/docs/utilization-report.pdf" },
  { id: "fraud-detection", name: "Fraud Detection", description: "Suspicious activity and fraud alerts summary", icon: BarChart3, category: "Compliance", file: "/docs/fraud-report.pdf" },
];

const scheduledReports = [
  { id: 1, name: "Monthly Claims Summary", frequency: "Monthly", nextRun: "Apr 1, 2026", recipients: ["admin@clarity.health", "finance@clarity.health"], status: "active" },
  { id: 2, name: "Weekly Member Census", frequency: "Weekly", nextRun: "Mar 18, 2026", recipients: ["hr@clarity.health"], status: "active" },
  { id: 3, name: "Daily Fraud Alerts", frequency: "Daily", nextRun: "Mar 13, 2026", recipients: ["compliance@clarity.health", "security@clarity.health"], status: "active" },
];

const recentReports = [
  { name: "Claims Summary - March 2026", generated: "Mar 12, 2026 9:00 AM", size: "2.4 MB", format: "PDF", file: "/docs/claims-summary-report.pdf" },
  { name: "Member Census", generated: "Mar 11, 2026 12:00 PM", size: "1.8 MB", format: "Excel", file: "/docs/member-census.pdf" },
  { name: "Financial Overview - Q1 2026", generated: "Mar 10, 2026 3:00 PM", size: "3.2 MB", format: "PDF", file: "/docs/financial-report.pdf" },
  { name: "Provider Network Analysis", generated: "Mar 8, 2026 10:30 AM", size: "1.5 MB", format: "PDF", file: "/docs/provider-network-report.pdf" },
  { name: "Fraud Detection Summary", generated: "Mar 7, 2026 8:00 AM", size: "856 KB", format: "PDF", file: "/docs/fraud-report.pdf" },
];

export default function ReportsPage() {
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<typeof reportTemplates[0] | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
      setTimeout(() => {
        setShowGenerateModal(false);
        setGenerated(false);
        setSelectedTemplate(null);
      }, 1500);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports</h1>
          <p className="text-slate-400">Generate, schedule, and download reports</p>
        </div>
        <button onClick={() => setShowScheduleModal(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
          <Calendar className="w-4 h-4" />
          Schedule Report
        </button>
      </div>

      {/* Report Templates */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700">
        <div className="p-4 border-b border-slate-700">
          <h2 className="font-semibold text-white">Report Templates</h2>
          <p className="text-sm text-slate-400">Click to generate a report</p>
        </div>
        <div className="p-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTemplates.map((report) => (
            <button
              key={report.id}
              onClick={() => { setSelectedTemplate(report); setShowGenerateModal(true); }}
              className="flex items-start gap-3 p-4 bg-slate-700/50 border border-slate-600 rounded-xl hover:border-purple-500 hover:bg-slate-700 text-left transition-all"
            >
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <report.icon className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="font-medium text-white">{report.name}</p>
                <p className="text-sm text-slate-400 mt-0.5">{report.description}</p>
                <span className="inline-block mt-2 px-2 py-0.5 bg-slate-600 text-slate-300 text-xs rounded">{report.category}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Scheduled Reports */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700">
          <div className="p-4 border-b border-slate-700 flex items-center justify-between">
            <h2 className="font-semibold text-white">Scheduled Reports</h2>
            <Clock className="w-5 h-5 text-slate-400" />
          </div>
          <div className="divide-y divide-slate-700">
            {scheduledReports.map((report) => (
              <div key={report.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{report.name}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" />{report.frequency}</span>
                      <span className="text-xs text-slate-400 flex items-center gap-1"><Mail className="w-3 h-3" />{report.recipients.length} recipients</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">Next run</p>
                  <p className="text-sm font-medium text-white">{report.nextRun}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700">
          <div className="p-4 border-b border-slate-700">
            <h2 className="font-semibold text-white">Recent Reports</h2>
          </div>
          <div className="divide-y divide-slate-700">
            {recentReports.map((report, i) => (
              <div key={i} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm">{report.name}</p>
                    <p className="text-xs text-slate-500">{report.generated} • {report.size}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a href={report.file} target="_blank" className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/20 rounded-lg">
                    <Eye className="w-4 h-4" />
                  </a>
                  <a href={report.file} download className="p-2 text-slate-400 hover:text-purple-400 hover:bg-purple-500/20 rounded-lg">
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Generate Report Modal */}
      <AnimatePresence>
        {showGenerateModal && selectedTemplate && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !generating && setShowGenerateModal(false)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50">
              <div className="p-6">
                {!generating && !generated ? (
                  <>
                    <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <selectedTemplate.icon className="w-8 h-8 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white text-center mb-2">Generate Report</h3>
                    <p className="text-slate-400 text-center mb-6">{selectedTemplate.name}</p>
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Date Range</label>
                        <select className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                          <option>Last 30 days</option>
                          <option>Last 90 days</option>
                          <option>Year to date</option>
                          <option>Custom range</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Format</label>
                        <select className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                          <option>PDF</option>
                          <option>Excel</option>
                          <option>CSV</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setShowGenerateModal(false)} className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Cancel</button>
                      <button onClick={handleGenerate} className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2">
                        <Play className="w-4 h-4" /> Generate
                      </button>
                    </div>
                  </>
                ) : generating ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white font-medium">Generating Report...</p>
                    <p className="text-slate-400 text-sm mt-1">This may take a moment</p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-green-400" />
                    </div>
                    <p className="text-white font-medium">Report Generated!</p>
                    <p className="text-slate-400 text-sm mt-1">Your download will start automatically</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Schedule Report Modal */}
      <AnimatePresence>
        {showScheduleModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowScheduleModal(false)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-700">
                <h2 className="text-lg font-semibold text-white">Schedule Report</h2>
                <button onClick={() => setShowScheduleModal(false)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Report Type</label>
                  <select className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                    {reportTemplates.map(t => <option key={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Frequency</label>
                  <select className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                    <option>Quarterly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Recipients (comma-separated)</label>
                  <input type="text" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" placeholder="admin@company.com, finance@company.com" />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 p-4 border-t border-slate-700">
                <button onClick={() => setShowScheduleModal(false)} className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Cancel</button>
                <button onClick={() => setShowScheduleModal(false)} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Schedule</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
