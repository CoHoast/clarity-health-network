"use client";

import { useState } from "react";
import { FileText, Download, Calendar, Clock, BarChart3, Users, DollarSign, Shield, TrendingUp, Play, Eye, Mail, X, Check, FileSpreadsheet, File, Printer, Share2, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const reportTemplates = [
  { id: "claims-summary", name: "Claims Summary", description: "Overview of all claims by status, amount, and provider", icon: FileText, category: "Claims", file: "/reports/claims-summary.csv" },
  { id: "member-census", name: "Member Census", description: "Complete member roster with demographics", icon: Users, category: "Members", file: "/reports/member-census.csv" },
  { id: "financial-overview", name: "Financial Overview", description: "Revenue, expenses, and profitability analysis", icon: DollarSign, category: "Financial", file: "/reports/financial-overview.csv" },
  { id: "provider-network", name: "Provider Network", description: "Network adequacy and provider statistics", icon: Shield, category: "Network", file: "/reports/provider-network.csv" },
  { id: "utilization", name: "Utilization Report", description: "Service utilization trends and patterns", icon: TrendingUp, category: "Analytics", file: "/reports/utilization-report.csv" },
  { id: "fraud-detection", name: "Fraud Detection", description: "Suspicious activity and fraud alerts summary", icon: BarChart3, category: "Compliance", file: "/reports/fraud-detection.csv" },
];

const scheduledReports = [
  { id: 1, name: "Monthly Claims Summary", frequency: "Monthly", nextRun: "Apr 1, 2026", recipients: ["admin@truecare.health", "finance@truecare.health"], status: "active", template: "claims-summary" },
  { id: 2, name: "Weekly Member Census", frequency: "Weekly", nextRun: "Mar 18, 2026", recipients: ["hr@truecare.health"], status: "active", template: "member-census" },
  { id: 3, name: "Daily Fraud Alerts", frequency: "Daily", nextRun: "Mar 13, 2026", recipients: ["compliance@truecare.health", "security@truecare.health"], status: "active", template: "fraud-detection" },
];

const recentReports = [
  { id: 1, name: "Claims Summary - March 2026", generated: "Mar 12, 2026 9:00 AM", size: "2.4 MB", format: "CSV", file: "/reports/claims-summary.csv" },
  { id: 2, name: "Member Census", generated: "Mar 11, 2026 12:00 PM", size: "1.8 MB", format: "CSV", file: "/reports/member-census.csv" },
  { id: 3, name: "Financial Overview - Q1 2026", generated: "Mar 10, 2026 3:00 PM", size: "1.2 MB", format: "CSV", file: "/reports/financial-overview.csv" },
  { id: 4, name: "Provider Network Analysis", generated: "Mar 8, 2026 10:30 AM", size: "956 KB", format: "CSV", file: "/reports/provider-network.csv" },
  { id: 5, name: "Fraud Detection Summary", generated: "Mar 7, 2026 8:00 AM", size: "856 KB", format: "CSV", file: "/reports/fraud-detection.csv" },
];

export default function ReportsPage() {
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<typeof reportTemplates[0] | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingReport, setViewingReport] = useState<typeof recentReports[0] | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [scheduling, setScheduling] = useState(false);
  const [scheduled, setScheduled] = useState(false);
  const [previewData, setPreviewData] = useState<string[][]>([]);
  const [loadingPreview, setLoadingPreview] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
      setTimeout(() => {
        // Trigger actual download
        if (selectedTemplate) {
          const link = document.createElement("a");
          link.href = selectedTemplate.file;
          link.download = `${selectedTemplate.id}-${new Date().toISOString().split("T")[0]}.csv`;
          link.click();
        }
        setShowGenerateModal(false);
        setGenerated(false);
        setSelectedTemplate(null);
      }, 1500);
    }, 2000);
  };

  const handleSchedule = () => {
    setScheduling(true);
    setTimeout(() => {
      setScheduling(false);
      setScheduled(true);
      setTimeout(() => {
        setShowScheduleModal(false);
        setScheduled(false);
      }, 1500);
    }, 1500);
  };

  const handleView = async (report: typeof recentReports[0]) => {
    setViewingReport(report);
    setShowViewModal(true);
    setLoadingPreview(true);
    
    try {
      const response = await fetch(report.file);
      const text = await response.text();
      const rows = text.split("\n").map(row => row.split(","));
      setPreviewData(rows.slice(0, 11)); // Header + 10 rows
    } catch (error) {
      setPreviewData([["Error loading preview"]]);
    }
    setLoadingPreview(false);
  };

  const handleDownload = (file: string, name: string) => {
    const link = document.createElement("a");
    link.href = file;
    link.download = `${name.toLowerCase().replace(/ /g, "-")}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports</h1>
          <p className="text-slate-400">Generate, schedule, and download reports</p>
        </div>
        <button onClick={() => setShowScheduleModal(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
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
              className="flex items-start gap-3 p-4 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl hover:from-teal-600 hover:to-cyan-600 text-left transition-all group shadow-lg"
            >
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-white/20">
                <report.icon className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.9)' }} />
              </div>
              <div>
                <p className="font-medium group-hover:text-white" style={{ color: 'white' }}>{report.name}</p>
                <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.7)' }}>{report.description}</p>
                <span className="inline-block mt-2 px-2 py-0.5 bg-white/20 text-xs rounded" style={{ color: 'white' }}>{report.category}</span>
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
              <div key={report.id} className="p-4 flex items-center justify-between hover:bg-slate-700/30 transition-colors">
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
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm text-slate-400">Next run</p>
                    <p className="text-sm font-medium text-white">{report.nextRun}</p>
                  </div>
                  <button className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
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
            {recentReports.map((report) => (
              <div key={report.id} className="p-4 flex items-center justify-between hover:bg-slate-700/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                    <FileSpreadsheet className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm">{report.name}</p>
                    <p className="text-xs text-slate-500">{report.generated} • {report.size}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => handleView(report)}
                    className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/20 rounded-lg"
                    title="View Report"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDownload(report.file, report.name)}
                    className="p-2 text-slate-400 hover:text-cyan-500 hover:bg-cyan-600/20 rounded-lg"
                    title="Download Report"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button 
                    className="p-2 text-slate-400 hover:text-green-400 hover:bg-green-500/20 rounded-lg"
                    title="Share Report"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
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
                    <div className="w-16 h-16 bg-cyan-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <selectedTemplate.icon className="w-8 h-8 text-cyan-500" />
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
                          <option>CSV (Spreadsheet)</option>
                          <option>PDF (Print-ready)</option>
                          <option>Excel (XLSX)</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setShowGenerateModal(false)} className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Cancel</button>
                      <button onClick={handleGenerate} className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center justify-center gap-2">
                        <Play className="w-4 h-4" /> Generate
                      </button>
                    </div>
                  </>
                ) : generating ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white font-medium">Generating Report...</p>
                    <p className="text-slate-400 text-sm mt-1">This may take a moment</p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                      <Check className="w-8 h-8 text-green-400" />
                    </motion.div>
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !scheduling && setShowScheduleModal(false)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
              {!scheduling && !scheduled ? (
                <>
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
                      <label className="block text-sm font-medium text-slate-300 mb-1">Start Date</label>
                      <input type="date" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Recipients (comma-separated)</label>
                      <input type="text" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" placeholder="admin@company.com, finance@company.com" />
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 p-4 border-t border-slate-700">
                    <button onClick={() => setShowScheduleModal(false)} className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Cancel</button>
                    <button onClick={handleSchedule} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">Schedule</button>
                  </div>
                </>
              ) : scheduling ? (
                <div className="p-6 text-center py-12">
                  <div className="w-16 h-16 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-white font-medium">Scheduling Report...</p>
                </div>
              ) : (
                <div className="p-6 text-center py-12">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <Check className="w-8 h-8 text-green-400" />
                  </motion.div>
                  <p className="text-white font-medium">Report Scheduled!</p>
                  <p className="text-slate-400 text-sm mt-1">You'll receive reports at the specified frequency</p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* View Report Modal */}
      <AnimatePresence>
        {showViewModal && viewingReport && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowViewModal(false)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[80vh] bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
                <div>
                  <h2 className="text-lg font-semibold text-white">{viewingReport.name}</h2>
                  <p className="text-sm text-slate-400">Generated: {viewingReport.generated}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleDownload(viewingReport.file, viewingReport.name)}
                    className="px-3 py-1.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center gap-2 text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button onClick={() => setShowViewModal(false)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"><X className="w-5 h-5" /></button>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-4">
                {loadingPreview ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-700/50">
                          {previewData[0]?.map((header, i) => (
                            <th key={i} className="px-3 py-2 text-left text-xs font-semibold text-slate-300 uppercase whitespace-nowrap">{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700">
                        {previewData.slice(1).map((row, i) => (
                          <tr key={i} className="hover:bg-slate-700/30">
                            {row.map((cell, j) => (
                              <td key={j} className="px-3 py-2 text-slate-300 whitespace-nowrap">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {previewData.length > 1 && (
                      <p className="text-center text-sm text-slate-500 mt-4">Showing first 10 rows • Download for full data</p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
