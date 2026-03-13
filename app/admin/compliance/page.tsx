"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle, Shield, Clock, X, FileText, Calendar, User, Building2, ChevronRight, Download, Eye, RefreshCw, Filter, Search, AlertCircle, TrendingUp, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ComplianceStatus = "compliant" | "attention" | "critical";
type TabId = "overview" | "issues" | "audits" | "policies" | "training";

const complianceChecklist = [
  { id: 1, item: "HIPAA Privacy Rule", status: "compliant" as ComplianceStatus, lastAudit: "Mar 1, 2026", nextAudit: "Jun 1, 2026", details: "All privacy policies up to date. Annual training completed.", score: 98 },
  { id: 2, item: "No Surprises Act", status: "attention" as ComplianceStatus, lastAudit: "Feb 15, 2026", nextAudit: "May 15, 2026", details: "3 good faith estimates pending review. Provider pricing updates needed.", score: 85 },
  { id: 3, item: "State Licensing", status: "compliant" as ComplianceStatus, lastAudit: "Jan 10, 2026", nextAudit: "Jan 10, 2027", details: "All state licenses current. 2 renewals due Q4 2026.", score: 100 },
  { id: 4, item: "CMS Requirements", status: "compliant" as ComplianceStatus, lastAudit: "Feb 28, 2026", nextAudit: "Aug 28, 2026", details: "Medicare Advantage compliance verified. Star ratings on track.", score: 95 },
  { id: 5, item: "Network Adequacy", status: "compliant" as ComplianceStatus, lastAudit: "Mar 5, 2026", nextAudit: "Jun 5, 2026", details: "All specialty coverage requirements met. 94% geographic coverage.", score: 94 },
  { id: 6, item: "Claims Processing (DOL)", status: "compliant" as ComplianceStatus, lastAudit: "Feb 20, 2026", nextAudit: "May 20, 2026", details: "30-day clean claim rule compliance at 99.2%.", score: 99 },
  { id: 7, item: "Mental Health Parity", status: "attention" as ComplianceStatus, lastAudit: "Jan 25, 2026", nextAudit: "Apr 25, 2026", details: "NQTL analysis in progress. Documentation update required.", score: 82 },
  { id: 8, item: "ACA Compliance", status: "compliant" as ComplianceStatus, lastAudit: "Mar 3, 2026", nextAudit: "Sep 3, 2026", details: "Essential health benefits verified. Preventive care at 100%.", score: 97 },
];

const openIssues = [
  { id: "ISS-001", title: "Good Faith Estimate Delays", category: "No Surprises Act", severity: "Medium", daysOpen: 5, assignee: "Sarah Chen", dueDate: "Mar 18, 2026" },
  { id: "ISS-002", title: "NQTL Documentation Gap", category: "Mental Health Parity", severity: "High", daysOpen: 12, assignee: "Michael Brown", dueDate: "Mar 25, 2026" },
  { id: "ISS-003", title: "Provider Pricing Update", category: "No Surprises Act", severity: "Low", daysOpen: 3, assignee: "Jennifer Lee", dueDate: "Mar 20, 2026" },
];

const auditHistory = [
  { id: "AUD-2026-012", type: "Internal Audit", area: "Claims Processing", date: "Mar 5, 2026", result: "Passed", findings: 2, critical: 0 },
  { id: "AUD-2026-011", type: "External Audit", area: "HIPAA Security", date: "Mar 1, 2026", result: "Passed", findings: 1, critical: 0 },
  { id: "AUD-2026-010", type: "State DOI Review", area: "Network Adequacy", date: "Feb 28, 2026", result: "Passed", findings: 0, critical: 0 },
  { id: "AUD-2026-009", type: "Internal Audit", area: "Member Grievances", date: "Feb 20, 2026", result: "Attention", findings: 4, critical: 1 },
  { id: "AUD-2026-008", type: "CMS Audit", area: "Medicare Advantage", date: "Feb 15, 2026", result: "Passed", findings: 3, critical: 0 },
  { id: "AUD-2026-007", type: "Internal Audit", area: "Fraud Detection", date: "Feb 10, 2026", result: "Passed", findings: 1, critical: 0 },
];

const policies = [
  { name: "Privacy & Security Policy", version: "3.2", lastUpdated: "Jan 15, 2026", status: "Current" },
  { name: "Claims Processing Guidelines", version: "2.8", lastUpdated: "Feb 1, 2026", status: "Current" },
  { name: "Network Management Policy", version: "2.1", lastUpdated: "Dec 10, 2025", status: "Review Due" },
  { name: "Member Rights & Responsibilities", version: "4.0", lastUpdated: "Mar 1, 2026", status: "Current" },
  { name: "Fraud, Waste & Abuse Policy", version: "2.5", lastUpdated: "Jan 20, 2026", status: "Current" },
  { name: "Quality Improvement Plan", version: "3.0", lastUpdated: "Nov 15, 2025", status: "Update Needed" },
];

const trainingModules = [
  { name: "HIPAA Annual Training", completion: 94, dueDate: "Dec 31, 2026", required: true },
  { name: "Fraud, Waste & Abuse", completion: 89, dueDate: "Jun 30, 2026", required: true },
  { name: "No Surprises Act Update", completion: 72, dueDate: "Mar 31, 2026", required: true },
  { name: "Cultural Competency", completion: 85, dueDate: "Sep 30, 2026", required: false },
  { name: "Cybersecurity Awareness", completion: 91, dueDate: "Jun 30, 2026", required: true },
];

export default function CompliancePage() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [selectedItem, setSelectedItem] = useState<typeof complianceChecklist[0] | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<typeof openIssues[0] | null>(null);
  const [selectedAudit, setSelectedAudit] = useState<typeof auditHistory[0] | null>(null);
  const [showNewIssue, setShowNewIssue] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const overallScore = Math.round(complianceChecklist.reduce((sum, c) => sum + c.score, 0) / complianceChecklist.length);
  const tabs: { id: TabId; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "issues", label: `Issues (${openIssues.length})` },
    { id: "audits", label: "Audit History" },
    { id: "policies", label: "Policies" },
    { id: "training", label: "Training" },
  ];

  const getStatusIcon = (status: ComplianceStatus) => {
    switch (status) {
      case "compliant": return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "attention": return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case "critical": return <AlertCircle className="w-5 h-5 text-red-400" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "High": return <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">High</span>;
      case "Medium": return <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full">Medium</span>;
      case "Low": return <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">Low</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Compliance Center</h1>
            <p className="text-slate-400">Track regulatory compliance and audits</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 border border-slate-600">
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <button onClick={() => setShowNewIssue(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            <AlertTriangle className="w-4 h-4" />
            Report Issue
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-3 h-3 rounded-full ${overallScore >= 90 ? "bg-green-400" : overallScore >= 80 ? "bg-amber-400" : "bg-red-400"}`} />
            <p className="text-sm text-slate-400">Compliance Score</p>
          </div>
          <p className="text-3xl font-bold text-green-400">{overallScore}%</p>
          <p className="text-xs text-slate-500 mt-1">↑ 2% from last month</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-sm text-slate-400 mb-2">Open Issues</p>
          <p className="text-3xl font-bold text-amber-400">{openIssues.length}</p>
          <p className="text-xs text-slate-500 mt-1">{openIssues.filter(i => i.severity === "High").length} high priority</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-sm text-slate-400 mb-2">Audits YTD</p>
          <p className="text-3xl font-bold text-blue-400">{auditHistory.length}</p>
          <p className="text-xs text-slate-500 mt-1">{auditHistory.filter(a => a.result === "Passed").length} passed</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-sm text-slate-400 mb-2">Days Without Critical</p>
          <p className="text-3xl font-bold text-white">45</p>
          <p className="text-xs text-slate-500 mt-1">Best: 67 days</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-t-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "bg-slate-800 text-white border-b-2 border-purple-500"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Compliance Checklist</h2>
            <button className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">
              <RefreshCw className="w-4 h-4" />
              Refresh Status
            </button>
          </div>
          <div className="divide-y divide-slate-700">
            {complianceChecklist.map((item, i) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setSelectedItem(item)}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-700/50 transition-colors text-left"
              >
                <div className="flex items-center gap-4">
                  {getStatusIcon(item.status)}
                  <div>
                    <p className="font-medium text-white">{item.item}</p>
                    <p className="text-sm text-slate-500">Last audit: {item.lastAudit}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">{item.score}%</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      item.status === "compliant" ? "bg-green-500/20 text-green-400" : 
                      item.status === "attention" ? "bg-amber-500/20 text-amber-400" : 
                      "bg-red-500/20 text-red-400"
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {activeTab === "issues" && (
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search issues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500"
              />
            </div>
            <button className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-800 border-b border-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Issue ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Severity</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Assignee</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Due Date</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {openIssues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-slate-700/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-purple-400 text-sm">{issue.id}</td>
                    <td className="px-4 py-3 text-white">{issue.title}</td>
                    <td className="px-4 py-3 text-slate-400">{issue.category}</td>
                    <td className="px-4 py-3">{getSeverityBadge(issue.severity)}</td>
                    <td className="px-4 py-3 text-slate-300">{issue.assignee}</td>
                    <td className="px-4 py-3 text-slate-400">{issue.dueDate}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setSelectedIssue(issue)} className="p-1.5 text-slate-400 hover:text-purple-400 hover:bg-purple-500/20 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "audits" && (
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Audit History</h2>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">
              Schedule Audit
            </button>
          </div>
          <table className="w-full">
            <thead className="bg-slate-800 border-b border-slate-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Audit ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Area</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Result</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-400 uppercase">Findings</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {auditHistory.map((audit) => (
                <tr key={audit.id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-purple-400 text-sm">{audit.id}</td>
                  <td className="px-4 py-3 text-white">{audit.type}</td>
                  <td className="px-4 py-3 text-slate-300">{audit.area}</td>
                  <td className="px-4 py-3 text-slate-400">{audit.date}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      audit.result === "Passed" ? "bg-green-500/20 text-green-400" : "bg-amber-500/20 text-amber-400"
                    }`}>
                      {audit.result}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-white">{audit.findings}</span>
                    {audit.critical > 0 && <span className="text-red-400 ml-1">({audit.critical} critical)</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setSelectedAudit(audit)} className="p-1.5 text-slate-400 hover:text-purple-400 hover:bg-purple-500/20 rounded">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "policies" && (
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Policy Documents</h2>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">
              Upload Policy
            </button>
          </div>
          <div className="divide-y divide-slate-700">
            {policies.map((policy, i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-700/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{policy.name}</p>
                    <p className="text-sm text-slate-500">Version {policy.version} • Updated {policy.lastUpdated}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    policy.status === "Current" ? "bg-green-500/20 text-green-400" : 
                    policy.status === "Review Due" ? "bg-amber-500/20 text-amber-400" : 
                    "bg-red-500/20 text-red-400"
                  }`}>
                    {policy.status}
                  </span>
                  <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "training" && (
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Training Compliance</h2>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">
              Assign Training
            </button>
          </div>
          <div className="divide-y divide-slate-700">
            {trainingModules.map((training, i) => (
              <div key={i} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <p className="font-medium text-white">{training.name}</p>
                    {training.required && <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded">Required</span>}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-400">Due: {training.dueDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${training.completion >= 90 ? "bg-green-500" : training.completion >= 70 ? "bg-amber-500" : "bg-red-500"}`}
                      style={{ width: `${training.completion}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-white w-12">{training.completion}%</span>
                  <button className="px-3 py-1 bg-slate-700 text-white rounded hover:bg-slate-600 text-sm">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Compliance Item Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedItem(null)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-700">
                <div className="flex items-center gap-3">
                  {getStatusIcon(selectedItem.status)}
                  <h2 className="text-lg font-semibold text-white">{selectedItem.item}</h2>
                </div>
                <button onClick={() => setSelectedItem(null)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-center">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full -rotate-90">
                      <circle cx="64" cy="64" r="56" fill="none" stroke="#334155" strokeWidth="8" />
                      <circle cx="64" cy="64" r="56" fill="none" stroke={selectedItem.score >= 90 ? "#22c55e" : selectedItem.score >= 80 ? "#f59e0b" : "#ef4444"} strokeWidth="8" strokeDasharray={`${selectedItem.score * 3.52} 352`} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">{selectedItem.score}%</span>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-slate-300">{selectedItem.details}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <p className="text-sm text-slate-400">Last Audit</p>
                    <p className="font-medium text-white">{selectedItem.lastAudit}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <p className="text-sm text-slate-400">Next Audit</p>
                    <p className="font-medium text-white">{selectedItem.nextAudit}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 p-4 border-t border-slate-700">
                <button className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">View History</button>
                <button onClick={() => setSelectedItem(null)} className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Close</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Issue Detail Modal */}
      <AnimatePresence>
        {selectedIssue && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedIssue(null)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-700">
                <div>
                  <h2 className="text-lg font-semibold text-white">{selectedIssue.title}</h2>
                  <p className="text-sm text-slate-400">{selectedIssue.id}</p>
                </div>
                <button onClick={() => setSelectedIssue(null)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <p className="text-sm text-slate-400">Category</p>
                    <p className="font-medium text-white">{selectedIssue.category}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <p className="text-sm text-slate-400">Severity</p>
                    <div className="mt-1">{getSeverityBadge(selectedIssue.severity)}</div>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <p className="text-sm text-slate-400">Assignee</p>
                    <p className="font-medium text-white">{selectedIssue.assignee}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <p className="text-sm text-slate-400">Due Date</p>
                    <p className="font-medium text-white">{selectedIssue.dueDate}</p>
                  </div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <p className="text-sm text-slate-400 mb-2">Status</p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span className="text-white">Open for {selectedIssue.daysOpen} days</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 p-4 border-t border-slate-700">
                <button className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Add Comment</button>
                <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Mark Resolved</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Audit Detail Modal */}
      <AnimatePresence>
        {selectedAudit && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedAudit(null)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-700">
                <div>
                  <h2 className="text-lg font-semibold text-white">{selectedAudit.type}</h2>
                  <p className="text-sm text-slate-400">{selectedAudit.id}</p>
                </div>
                <button onClick={() => setSelectedAudit(null)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <p className="text-sm text-slate-400">Area</p>
                    <p className="font-medium text-white">{selectedAudit.area}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <p className="text-sm text-slate-400">Date</p>
                    <p className="font-medium text-white">{selectedAudit.date}</p>
                  </div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <p className="text-sm text-slate-400 mb-2">Result</p>
                  <span className={`px-3 py-1 text-sm rounded-full ${
                    selectedAudit.result === "Passed" ? "bg-green-500/20 text-green-400" : "bg-amber-500/20 text-amber-400"
                  }`}>
                    {selectedAudit.result}
                  </span>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <p className="text-sm text-slate-400 mb-2">Findings Summary</p>
                  <p className="text-white">{selectedAudit.findings} findings identified</p>
                  {selectedAudit.critical > 0 && (
                    <p className="text-red-400 text-sm mt-1">{selectedAudit.critical} critical finding(s) requiring immediate attention</p>
                  )}
                </div>
              </div>
              <div className="flex gap-3 p-4 border-t border-slate-700">
                <button className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Download Report
                </button>
                <button onClick={() => setSelectedAudit(null)} className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Close</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* New Issue Modal */}
      <AnimatePresence>
        {showNewIssue && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowNewIssue(false)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-700">
                <h2 className="text-lg font-semibold text-white">Report Compliance Issue</h2>
                <button onClick={() => setShowNewIssue(false)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
                  <input type="text" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" placeholder="Brief description of the issue" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
                  <select className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                    <option>HIPAA Privacy</option>
                    <option>No Surprises Act</option>
                    <option>Mental Health Parity</option>
                    <option>Network Adequacy</option>
                    <option>Claims Processing</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Severity</label>
                  <select className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                  <textarea className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white h-24" placeholder="Detailed description of the compliance issue..." />
                </div>
              </div>
              <div className="flex gap-3 p-4 border-t border-slate-700">
                <button onClick={() => setShowNewIssue(false)} className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Cancel</button>
                <button onClick={() => setShowNewIssue(false)} className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Submit Issue</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
