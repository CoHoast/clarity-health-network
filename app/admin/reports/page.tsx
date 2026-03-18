"use client";

import { useState } from "react";
import { FileText, Download, Calendar, Clock, BarChart3, Building2, DollarSign, Shield, TrendingUp, Play, Eye, Mail, X, Check, FileSpreadsheet, Printer, Share2, MapPin, FileCheck, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/admin/ThemeContext";
import { Card, CardHeader } from "@/components/admin/ui/Card";
import { Button, IconButton } from "@/components/admin/ui/Button";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Badge } from "@/components/admin/ui/Badge";
import { cn } from "@/lib/utils";

const reportTemplates = [
  { id: "provider-roster", name: "Provider Roster", description: "Complete list of all network providers", icon: Building2, category: "Providers" },
  { id: "contract-summary", name: "Contract Summary", description: "Active contracts with rates and terms", icon: FileText, category: "Contracts" },
  { id: "discount-analysis", name: "Discount Analysis", description: "Fee schedule discounts by provider", icon: DollarSign, category: "Rates" },
  { id: "credentialing-status", name: "Credentialing Status", description: "Provider verification tracking", icon: Shield, category: "Credentialing" },
  { id: "network-coverage", name: "Network Coverage", description: "Geographic coverage by county", icon: MapPin, category: "Network" },
  { id: "expiring-contracts", name: "Expiring Contracts", description: "Contracts expiring in 30, 60, 90 days", icon: Clock, category: "Contracts" },
  { id: "specialty-distribution", name: "Specialty Distribution", description: "Provider count by specialty", icon: Users, category: "Network" },
  { id: "rate-comparison", name: "Rate Comparison", description: "Rates vs Medicare benchmarks", icon: TrendingUp, category: "Rates" },
  { id: "credential-expiration", name: "Credential Expiration", description: "Licenses, DEA expiring soon", icon: FileCheck, category: "Credentialing" },
];

const scheduledReports = [
  { id: 1, name: "Weekly Contract Expirations", frequency: "Weekly", nextRun: "Mar 18, 2026", recipients: ["contracts@truecare.health"], status: "active" },
  { id: 2, name: "Monthly Provider Roster", frequency: "Monthly", nextRun: "Apr 1, 2026", recipients: ["network@truecare.health"], status: "active" },
  { id: 3, name: "Monthly Credentialing Alerts", frequency: "Monthly", nextRun: "Apr 1, 2026", recipients: ["credentialing@truecare.health"], status: "active" },
];

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
            return (
              <Card key={template.id} hover onClick={() => { setSelectedTemplate(template); setShowGenerateModal(true); }}>
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
            action={<Button variant="outline" size="sm">Add Schedule</Button>}
          />
          <div className="space-y-3">
            {scheduledReports.map((report) => (
              <div key={report.id} className={cn(
                "p-4 rounded-xl flex items-center justify-between",
                isDark ? "bg-slate-700/30 border border-slate-700/50" : "bg-slate-50 border border-slate-100"
              )}>
                <div>
                  <p className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>{report.name}</p>
                  <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                    {report.frequency} • Next: {report.nextRun}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="success" dot>{report.status}</Badge>
                  <IconButton icon={<Play className="w-4 h-4" />} tooltip="Run Now" />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Reports */}
        <Card>
          <CardHeader
            title="Recent Reports"
            icon={<Clock className="w-5 h-5 text-teal-500" />}
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
                  <IconButton icon={<Eye className="w-4 h-4" />} tooltip="Preview" />
                  <IconButton icon={<Download className="w-4 h-4" />} tooltip="Download" />
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
    </div>
  );
}
