"use client";

import { useState } from "react";
import { FileText, Download, Calendar, Clock, BarChart3, Building2, DollarSign, Shield, TrendingUp, Play, Eye, Mail, X, Check, FileSpreadsheet, Printer, Share2, MapPin, FileCheck, Users, Plus, Trash2, Edit3, Pause, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/admin/ThemeContext";
import { Card, CardHeader } from "@/components/admin/ui/Card";
import { Button, IconButton } from "@/components/admin/ui/Button";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Badge } from "@/components/admin/ui/Badge";
import { cn } from "@/lib/utils";

type ScheduledReport = {
  id: number;
  name: string;
  template: string;
  frequency: string;
  nextRun: string;
  recipients: string[];
  status: "active" | "paused";
};

const reportTemplates = [
  { id: "provider-roster", name: "Provider Roster", description: "Complete list of all network providers", icon: Building2, category: "Providers" },
  { id: "contract-summary", name: "Contract Summary", description: "Active contracts with rates and terms", icon: FileText, category: "Contracts" },
  { id: "discount-analysis", name: "Discount Analysis", description: "Fee schedule discounts by provider", icon: DollarSign, category: "Rates" },
  { id: "provider-rate-schedule", name: "Provider Rate Schedule", description: "All discount rates, CPT codes, % Medicare/Billed", icon: DollarSign, category: "Rates", downloadUrl: "/api/export/provider-rates" },
  { id: "credentialing-status", name: "Credentialing Status", description: "Provider verification tracking", icon: Shield, category: "Credentialing" },
  { id: "network-coverage", name: "Network Coverage", description: "Geographic coverage by county", icon: MapPin, category: "Network" },
  { id: "expiring-contracts", name: "Expiring Contracts", description: "Contracts expiring in 30, 60, 90 days", icon: Clock, category: "Contracts" },
  { id: "specialty-distribution", name: "Specialty Distribution", description: "Provider count by specialty", icon: Users, category: "Network" },
  { id: "rate-comparison", name: "Rate Comparison", description: "Rates vs Medicare benchmarks", icon: TrendingUp, category: "Rates" },
  { id: "credential-expiration", name: "Credential Expiration", description: "Licenses, DEA expiring soon", icon: FileCheck, category: "Credentialing" },
];

const initialScheduledReports: ScheduledReport[] = [
  { id: 1, name: "Weekly Contract Expirations", template: "expiring-contracts", frequency: "Weekly", nextRun: "Mar 24, 2026", recipients: ["contracts@truecare.health"], status: "active" },
  { id: 2, name: "Monthly Provider Roster", template: "provider-roster", frequency: "Monthly", nextRun: "Apr 1, 2026", recipients: ["network@truecare.health"], status: "active" },
  { id: 3, name: "Monthly Credentialing Alerts", template: "credential-expiration", frequency: "Monthly", nextRun: "Apr 1, 2026", recipients: ["credentialing@truecare.health"], status: "active" },
];

const frequencyOptions = ["Daily", "Weekly", "Bi-Weekly", "Monthly", "Quarterly"];

const recentReports = [
  { id: 1, name: "Provider Roster - March 2026", generated: "Mar 12, 2026", size: "1.8 MB", format: "CSV" },
  { id: 2, name: "Contract Summary Q1 2026", generated: "Mar 11, 2026", size: "956 KB", format: "CSV" },
  { id: 3, name: "Network Coverage - Ohio", generated: "Mar 10, 2026", size: "1.2 MB", format: "CSV" },
  { id: 4, name: "Discount Analysis - All Specialties", generated: "Mar 8, 2026", size: "756 KB", format: "CSV" },
  { id: 5, name: "Credentialing Status Report", generated: "Mar 7, 2026", size: "524 KB", format: "CSV" },
];

const categoryColors: Record<string, { bg: string; text: string; lightBg: string; lightText: string }> = {
  Providers: { bg: "bg-blue-500/20", text: "text-blue-400", lightBg: "bg-blue-50", lightText: "text-blue-600" },
  Contracts: { bg: "bg-amber-500/20", text: "text-amber-400", lightBg: "bg-amber-50", lightText: "text-amber-600" },
  Rates: { bg: "bg-green-500/20", text: "text-green-400", lightBg: "bg-green-50", lightText: "text-green-600" },
  Credentialing: { bg: "bg-purple-500/20", text: "text-purple-400", lightBg: "bg-purple-50", lightText: "text-purple-600" },
  Network: { bg: "bg-blue-500/20", text: "text-blue-400", lightBg: "bg-blue-50", lightText: "text-blue-600" },
};

export default function ReportsPage() {
  const { isDark } = useTheme();
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<typeof reportTemplates[0] | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [previewingReport, setPreviewingReport] = useState<typeof recentReports[0] | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  
  // Schedule state
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>(initialScheduledReports);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduledReport | null>(null);
  const [scheduleForm, setScheduleForm] = useState({
    name: "",
    template: "",
    frequency: "Weekly",
    recipients: "",
  });
  const [savingSchedule, setSavingSchedule] = useState(false);
  const [runningReport, setRunningReport] = useState<number | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleDownload = (report: typeof recentReports[0]) => {
    showToast(`Downloading ${report.name}...`);
  };

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
      setTimeout(() => {
        setShowGenerateModal(false);
        setSelectedTemplate(null);
        setGenerated(false);
      }, 2000);
    }, 2000);
  };

  const openAddSchedule = () => {
    setEditingSchedule(null);
    setScheduleForm({ name: "", template: "", frequency: "Weekly", recipients: "" });
    setShowScheduleModal(true);
  };

  const openEditSchedule = (report: ScheduledReport) => {
    setEditingSchedule(report);
    setScheduleForm({
      name: report.name,
      template: report.template,
      frequency: report.frequency,
      recipients: report.recipients.join(", "),
    });
    setShowScheduleModal(true);
  };

  const handleSaveSchedule = () => {
    setSavingSchedule(true);
    setTimeout(() => {
      if (editingSchedule) {
        // Update existing
        setScheduledReports(prev => prev.map(r => 
          r.id === editingSchedule.id 
            ? { ...r, name: scheduleForm.name, template: scheduleForm.template, frequency: scheduleForm.frequency, recipients: scheduleForm.recipients.split(",").map(e => e.trim()) }
            : r
        ));
        showToast("Schedule updated successfully");
      } else {
        // Add new
        const nextRun = scheduleForm.frequency === "Daily" ? "Tomorrow" 
          : scheduleForm.frequency === "Weekly" ? "Next Week"
          : scheduleForm.frequency === "Monthly" ? "Apr 1, 2026"
          : "Next Quarter";
        const newReport: ScheduledReport = {
          id: Date.now(),
          name: scheduleForm.name,
          template: scheduleForm.template,
          frequency: scheduleForm.frequency,
          nextRun,
          recipients: scheduleForm.recipients.split(",").map(e => e.trim()),
          status: "active",
        };
        setScheduledReports(prev => [...prev, newReport]);
        showToast("Schedule created successfully");
      }
      setSavingSchedule(false);
      setShowScheduleModal(false);
    }, 1000);
  };

  const handleDeleteSchedule = (id: number) => {
    setScheduledReports(prev => prev.filter(r => r.id !== id));
    setShowScheduleModal(false);
    showToast("Schedule deleted");
  };

  const handleToggleStatus = (id: number) => {
    setScheduledReports(prev => prev.map(r => 
      r.id === id ? { ...r, status: r.status === "active" ? "paused" : "active" } : r
    ));
  };

  const handleRunNow = (report: ScheduledReport) => {
    setRunningReport(report.id);
    setTimeout(() => {
      setRunningReport(null);
      showToast(`Running "${report.name}"...`);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        subtitle="Generate, schedule, and download network reports"
        actions={
          <Button variant="primary" icon={<BarChart3 className="w-4 h-4" />} onClick={() => setShowGenerateModal(true)}>
            Generate Report
          </Button>
        }
      />

      {/* Report Templates */}
      <div>
        <h2 className={cn("text-lg font-semibold mb-4", isDark ? "text-white" : "text-slate-900")}>Report Templates</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTemplates.map((template) => {
            const Icon = template.icon;
            const colors = categoryColors[template.category];
            const handleClick = () => {
              if ((template as any).downloadUrl) {
                // Direct download for templates with downloadUrl
                window.location.href = (template as any).downloadUrl;
              } else {
                setSelectedTemplate(template);
                setShowGenerateModal(true);
              }
            };
            return (
              <Card key={template.id} hover onClick={handleClick}>
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    isDark ? colors.bg : colors.lightBg
                  )}>
                    <Icon className={cn("w-6 h-6", isDark ? colors.text : colors.lightText)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={cn("font-semibold", isDark ? "text-white" : "text-slate-900")}>{template.name}</h3>
                    <p className={cn("text-sm mt-1", isDark ? "text-slate-400" : "text-slate-500")}>{template.description}</p>
                    <Badge variant="default" size="sm" className="mt-2">{template.category}</Badge>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Scheduled Reports */}
        <Card>
          <CardHeader
            title="Scheduled Reports"
            icon={<Calendar className="w-5 h-5 text-blue-500" />}
            action={
              <Button variant="outline" size="sm" icon={<Plus className="w-4 h-4" />} onClick={openAddSchedule}>
                Add Schedule
              </Button>
            }
          />
          <div className="space-y-3">
            {scheduledReports.length === 0 ? (
              <div className={cn(
                "p-8 rounded-xl text-center",
                isDark ? "bg-slate-700/30 border border-slate-700/50" : "bg-slate-50 border border-slate-100"
              )}>
                <Calendar className={cn("w-12 h-12 mx-auto mb-3", isDark ? "text-slate-600" : "text-slate-300")} />
                <p className={cn("font-medium", isDark ? "text-slate-400" : "text-slate-500")}>No scheduled reports</p>
                <p className={cn("text-sm mt-1", isDark ? "text-slate-500" : "text-slate-400")}>
                  Create your first schedule to automate report delivery
                </p>
                <Button variant="outline" size="sm" className="mt-4" onClick={openAddSchedule}>
                  Create Schedule
                </Button>
              </div>
            ) : (
              scheduledReports.map((report) => (
                <div 
                  key={report.id} 
                  onClick={() => openEditSchedule(report)}
                  className={cn(
                    "p-4 rounded-xl flex items-center justify-between cursor-pointer transition-colors group",
                    isDark 
                      ? "bg-slate-700/30 border border-slate-700/50 hover:bg-slate-700/50" 
                      : "bg-slate-50 border border-slate-100 hover:bg-slate-100"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      report.status === "active" 
                        ? isDark ? "bg-blue-500/20" : "bg-blue-50"
                        : isDark ? "bg-slate-600" : "bg-slate-200"
                    )}>
                      {report.status === "active" ? (
                        <Calendar className={cn("w-5 h-5", isDark ? "text-blue-400" : "text-blue-600")} />
                      ) : (
                        <Pause className={cn("w-5 h-5", isDark ? "text-slate-400" : "text-slate-500")} />
                      )}
                    </div>
                    <div>
                      <p className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>{report.name}</p>
                      <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                        {report.frequency} • Next: {report.nextRun}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <Badge variant={report.status === "active" ? "success" : "default"} dot>
                      {report.status}
                    </Badge>
                    <IconButton 
                      icon={runningReport === report.id 
                        ? <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        : <Play className="w-4 h-4" />
                      } 
                      tooltip="Run Now" 
                      onClick={() => handleRunNow(report)}
                      disabled={runningReport !== null}
                    />
                    <IconButton 
                      icon={<Settings className="w-4 h-4" />} 
                      tooltip="Edit Schedule" 
                      onClick={() => openEditSchedule(report)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Recent Reports */}
        <Card>
          <CardHeader
            title="Recent Reports"
            icon={<Clock className="w-5 h-5 text-blue-500" />}
          />
          <div className="space-y-3">
            {recentReports.map((report) => (
              <div key={report.id} className={cn(
                "p-4 rounded-xl flex items-center justify-between",
                isDark ? "bg-slate-700/30 border border-slate-700/50" : "bg-slate-50 border border-slate-100"
              )}>
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    isDark ? "bg-slate-700" : "bg-slate-200"
                  )}>
                    <FileSpreadsheet className={cn("w-5 h-5", isDark ? "text-slate-400" : "text-slate-500")} />
                  </div>
                  <div>
                    <p className={cn("font-medium text-sm", isDark ? "text-white" : "text-slate-900")}>{report.name}</p>
                    <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                      {report.generated} • {report.size}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <IconButton icon={<Eye className="w-4 h-4" />} tooltip="Preview" onClick={() => setPreviewingReport(report)} />
                  <IconButton icon={<Download className="w-4 h-4" />} tooltip="Download" onClick={() => handleDownload(report)} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Generate Report Modal */}
      <AnimatePresence>
        {showGenerateModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => { setShowGenerateModal(false); setSelectedTemplate(null); }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg rounded-2xl shadow-2xl z-50",
                isDark ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-200"
              )}
            >
              {generated ? (
                <div className="p-10 text-center">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-5">
                    <Check className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className={cn("text-xl font-bold mb-2", isDark ? "text-white" : "text-slate-900")}>Report Generated!</h3>
                  <p className={isDark ? "text-slate-400" : "text-slate-500"}>Your report is ready for download.</p>
                </div>
              ) : (
                <>
                  <div className={cn("p-5 border-b", isDark ? "border-slate-700" : "border-slate-200")}>
                    <h3 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-slate-900")}>Generate Report</h3>
                    <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                      {selectedTemplate?.name || "Select a report template"}
                    </p>
                  </div>
                  <div className="p-5 space-y-4">
                    <div>
                      <label className={cn("block text-sm font-medium mb-2", isDark ? "text-slate-300" : "text-slate-700")}>
                        Report Template
                      </label>
                      <select 
                        value={selectedTemplate?.id || ""}
                        onChange={(e) => setSelectedTemplate(reportTemplates.find(t => t.id === e.target.value) || null)}
                        className={cn(
                          "w-full px-4 py-2.5 rounded-lg",
                          isDark ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-300 text-slate-900",
                          "border"
                        )}
                      >
                        <option value="">Select template...</option>
                        {reportTemplates.map((t) => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={cn("block text-sm font-medium mb-2", isDark ? "text-slate-300" : "text-slate-700")}>
                        Date Range
                      </label>
                      <select className={cn(
                        "w-full px-4 py-2.5 rounded-lg",
                        isDark ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-300 text-slate-900",
                        "border"
                      )}>
                        <option>All Time</option>
                        <option>Last 30 Days</option>
                        <option>Last 90 Days</option>
                        <option>This Year</option>
                      </select>
                    </div>
                    <div>
                      <label className={cn("block text-sm font-medium mb-2", isDark ? "text-slate-300" : "text-slate-700")}>
                        Format
                      </label>
                      <div className="flex gap-2">
                        {["CSV", "Excel", "PDF"].map((format) => (
                          <button
                            key={format}
                            className={cn(
                              "flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                              format === "CSV"
                                ? "bg-blue-600 text-white"
                                : isDark ? "bg-slate-700 text-slate-300 hover:bg-slate-600" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            )}
                          >
                            {format}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className={cn("flex gap-3 p-5 border-t", isDark ? "border-slate-700" : "border-slate-200")}>
                    <Button variant="outline" className="flex-1" onClick={() => { setShowGenerateModal(false); setSelectedTemplate(null); }}>
                      Cancel
                    </Button>
                    <Button variant="primary" className="flex-1" onClick={handleGenerate} loading={generating} disabled={!selectedTemplate}>
                      Generate
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Report Preview Modal */}
      <AnimatePresence>
        {previewingReport && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setPreviewingReport(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[85vh] rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden",
                isDark ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-200"
              )}
            >
              <div className={cn("p-4 border-b flex items-center justify-between", isDark ? "border-slate-700" : "border-slate-200")}>
                <div>
                  <h3 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-slate-900")}>{previewingReport.name}</h3>
                  <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                    Generated: {previewingReport.generated} • {previewingReport.size} • {previewingReport.format}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm" icon={<Download className="w-4 h-4" />} onClick={() => handleDownload(previewingReport)}>
                    Download
                  </Button>
                  <IconButton icon={<X className="w-5 h-5" />} onClick={() => setPreviewingReport(null)} />
                </div>
              </div>

              <div className="flex-1 overflow-auto p-6 bg-slate-100 dark:bg-slate-900">
                <div className={cn("rounded-lg shadow-lg overflow-hidden", isDark ? "bg-slate-800" : "bg-white")}>
                  {/* Sample Report Table */}
                  <table className="w-full text-sm">
                    <thead>
                      <tr className={cn("border-b", isDark ? "border-slate-700 bg-slate-700/50" : "border-slate-200 bg-slate-50")}>
                        <th className="text-left px-4 py-3 font-semibold">Provider Name</th>
                        <th className="text-left px-4 py-3 font-semibold">NPI</th>
                        <th className="text-left px-4 py-3 font-semibold">Specialty</th>
                        <th className="text-left px-4 py-3 font-semibold">Status</th>
                        <th className="text-left px-4 py-3 font-semibold">Contract Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: "Dr. Robert Smith, MD", npi: "1234567890", specialty: "Family Medicine", status: "Active", date: "Jan 15, 2024" },
                        { name: "Dr. Jennifer Adams, MD", npi: "2345678901", specialty: "Internal Medicine", status: "Active", date: "Feb 20, 2024" },
                        { name: "Dr. Michael Chen, DO", npi: "3456789012", specialty: "Cardiology", status: "Active", date: "Mar 1, 2024" },
                        { name: "Dr. Sarah Wilson, MD", npi: "4567890123", specialty: "Pediatrics", status: "Pending", date: "Mar 10, 2024" },
                        { name: "Cleveland Heart Center", npi: "5678901234", specialty: "Multi-Specialty", status: "Active", date: "Jan 5, 2024" },
                        { name: "Dr. Emily Rodriguez, NP", npi: "6789012345", specialty: "Nurse Practitioner", status: "Active", date: "Feb 28, 2024" },
                        { name: "Metro Imaging Center", npi: "7890123456", specialty: "Radiology", status: "Active", date: "Mar 15, 2024" },
                        { name: "Dr. James Thompson, MD", npi: "8901234567", specialty: "Orthopedics", status: "Active", date: "Jan 22, 2024" },
                      ].map((row, i) => (
                        <tr key={i} className={cn("border-b", isDark ? "border-slate-700" : "border-slate-100")}>
                          <td className={cn("px-4 py-3", isDark ? "text-white" : "text-slate-900")}>{row.name}</td>
                          <td className={cn("px-4 py-3 font-mono", isDark ? "text-slate-400" : "text-slate-600")}>{row.npi}</td>
                          <td className={cn("px-4 py-3", isDark ? "text-slate-300" : "text-slate-700")}>{row.specialty}</td>
                          <td className="px-4 py-3">
                            <span className={cn(
                              "px-2 py-1 rounded-full text-xs font-medium",
                              row.status === "Active" 
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                            )}>
                              {row.status}
                            </span>
                          </td>
                          <td className={cn("px-4 py-3", isDark ? "text-slate-400" : "text-slate-500")}>{row.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className={cn("text-center text-xs mt-4", isDark ? "text-slate-500" : "text-slate-400")}>
                  Showing 8 of 156 records • Full report available on download
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Schedule Report Modal */}
      <AnimatePresence>
        {showScheduleModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setShowScheduleModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg rounded-2xl shadow-2xl z-50",
                isDark ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-200"
              )}
            >
              <div className={cn("p-5 border-b flex items-center justify-between", isDark ? "border-slate-700" : "border-slate-200")}>
                <div>
                  <h3 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-slate-900")}>
                    {editingSchedule ? "Edit Schedule" : "Create Schedule"}
                  </h3>
                  <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                    {editingSchedule ? "Update scheduled report settings" : "Set up automatic report delivery"}
                  </p>
                </div>
                <IconButton icon={<X className="w-5 h-5" />} onClick={() => setShowScheduleModal(false)} />
              </div>
              
              <div className="p-5 space-y-4">
                <div>
                  <label className={cn("block text-sm font-medium mb-2", isDark ? "text-slate-300" : "text-slate-700")}>
                    Schedule Name
                  </label>
                  <input 
                    type="text"
                    value={scheduleForm.name}
                    onChange={(e) => setScheduleForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Weekly Contract Report"
                    className={cn(
                      "w-full px-4 py-2.5 rounded-lg",
                      isDark ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400" : "bg-white border-slate-300 text-slate-900",
                      "border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    )}
                  />
                </div>
                
                <div>
                  <label className={cn("block text-sm font-medium mb-2", isDark ? "text-slate-300" : "text-slate-700")}>
                    Report Template
                  </label>
                  <select 
                    value={scheduleForm.template}
                    onChange={(e) => setScheduleForm(prev => ({ ...prev, template: e.target.value }))}
                    className={cn(
                      "w-full px-4 py-2.5 rounded-lg",
                      isDark ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-300 text-slate-900",
                      "border"
                    )}
                  >
                    <option value="">Select template...</option>
                    {reportTemplates.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className={cn("block text-sm font-medium mb-2", isDark ? "text-slate-300" : "text-slate-700")}>
                    Frequency
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {frequencyOptions.map((freq) => (
                      <button
                        key={freq}
                        onClick={() => setScheduleForm(prev => ({ ...prev, frequency: freq }))}
                        className={cn(
                          "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                          scheduleForm.frequency === freq
                            ? "bg-blue-600 text-white"
                            : isDark ? "bg-slate-700 text-slate-300 hover:bg-slate-600" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        )}
                      >
                        {freq}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className={cn("block text-sm font-medium mb-2", isDark ? "text-slate-300" : "text-slate-700")}>
                    Email Recipients
                  </label>
                  <input 
                    type="text"
                    value={scheduleForm.recipients}
                    onChange={(e) => setScheduleForm(prev => ({ ...prev, recipients: e.target.value }))}
                    placeholder="email@example.com, another@example.com"
                    className={cn(
                      "w-full px-4 py-2.5 rounded-lg",
                      isDark ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400" : "bg-white border-slate-300 text-slate-900",
                      "border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    )}
                  />
                  <p className={cn("text-xs mt-1", isDark ? "text-slate-500" : "text-slate-400")}>
                    Separate multiple emails with commas
                  </p>
                </div>

                {editingSchedule && (
                  <div className={cn(
                    "p-4 rounded-lg",
                    isDark ? "bg-slate-700/50" : "bg-slate-50"
                  )}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>
                          Schedule Status
                        </p>
                        <p className={cn("text-xs mt-0.5", isDark ? "text-slate-400" : "text-slate-500")}>
                          {editingSchedule.status === "active" ? "Report will run on schedule" : "Schedule is paused"}
                        </p>
                      </div>
                      <button
                        onClick={() => handleToggleStatus(editingSchedule.id)}
                        className={cn(
                          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                          editingSchedule.status === "active" ? "bg-blue-600" : isDark ? "bg-slate-600" : "bg-slate-300"
                        )}
                      >
                        <span className={cn(
                          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                          editingSchedule.status === "active" ? "translate-x-6" : "translate-x-1"
                        )} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className={cn("flex gap-3 p-5 border-t", isDark ? "border-slate-700" : "border-slate-200")}>
                {editingSchedule && (
                  <Button 
                    variant="outline" 
                    className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    icon={<Trash2 className="w-4 h-4" />}
                    onClick={() => handleDeleteSchedule(editingSchedule.id)}
                  >
                    Delete
                  </Button>
                )}
                <div className="flex-1" />
                <Button variant="outline" onClick={() => setShowScheduleModal(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  onClick={handleSaveSchedule} 
                  loading={savingSchedule}
                  disabled={!scheduleForm.name || !scheduleForm.template || !scheduleForm.recipients}
                >
                  {editingSchedule ? "Save Changes" : "Create Schedule"}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50"
          >
            <Check className="w-5 h-5" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
