"use client";

import { useTheme } from "@/components/admin/ThemeContext";
import { cn } from "@/lib/utils";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserCheck, Activity, CheckCircle, XCircle, Search, Clock, AlertTriangle, X, User, Calendar, Shield, RefreshCw } from "lucide-react";

const recentChecks = [
  { id: "ELG-001", member: "John Doe", memberId: "CHN-123456", provider: "Cleveland Family Medicine", result: "Eligible", time: "2 min ago", coverage: "Gold PPO", copay: "$25", deductible: "$500/$1,200", deductibleMet: "78%" },
  { id: "ELG-002", member: "Sarah Johnson", memberId: "CHN-234567", provider: "Metro Imaging", result: "Eligible", time: "5 min ago", coverage: "Silver PPO", copay: "$40", deductible: "$1,000/$2,500", deductibleMet: "45%" },
  { id: "ELG-003", member: "Michael Chen", memberId: "CHN-345678", provider: "Cleveland Orthopedic", result: "Pre-auth Required", time: "8 min ago", coverage: "Gold PPO", copay: "$25", deductible: "$500/$1,200", deductibleMet: "100%" },
  { id: "ELG-004", member: "Emily Rodriguez", memberId: "CHN-456789", provider: "Westlake Urgent Care", result: "Eligible", time: "12 min ago", coverage: "Platinum PPO", copay: "$15", deductible: "$250/$500", deductibleMet: "62%" },
  { id: "ELG-005", member: "David Kim", memberId: "CHN-567890", provider: "Dr. Sarah Chen", result: "Not Eligible", time: "15 min ago", coverage: "Terminated", copay: "N/A", deductible: "N/A", deductibleMet: "N/A", reason: "Coverage terminated 02/28/2024" },
  { id: "ELG-006", member: "Lisa Martinez", memberId: "CHN-678901", provider: "Metro Labs", result: "Eligible", time: "18 min ago", coverage: "Gold PPO", copay: "$0", deductible: "$500/$1,200", deductibleMet: "92%" },
];

const issues = [
  { member: "David Kim", memberId: "CHN-567890", issue: "Coverage Terminated", severity: "high", details: "Coverage was terminated on 02/28/2024 due to employment change. Member may be eligible for COBRA." },
  { member: "Robert Wilson", memberId: "CHN-789012", issue: "Premium Past Due", severity: "medium", details: "March premium payment is 15 days overdue. Grace period ends in 15 days." },
  { member: "Jennifer Lee", memberId: "CHN-890123", issue: "Missing Dependent Info", severity: "low", details: "Dependent SSN and DOB required to complete enrollment. Requested via email on 03/10." },
  { member: "Amanda Torres", memberId: "CHN-901234", issue: "ID Card Not Issued", severity: "low", details: "Member enrolled 5 days ago. ID card generation is pending." },
  { member: "Brian Murphy", memberId: "CHN-012345", issue: "PCP Assignment Needed", severity: "medium", details: "Member has not selected a primary care physician. Auto-assignment in 7 days." },
];

export default function EligibilityPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCheck, setSelectedCheck] = useState<typeof recentChecks[0] | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<typeof issues[0] | null>(null);
  const [showManualCheck, setShowManualCheck] = useState(false);
  const [checkResult, setCheckResult] = useState<"eligible" | "not-eligible" | null>(null);
  const [showAllIssues, setShowAllIssues] = useState(false);

  const getResultBadge = (result: string) => {
    switch (result) {
      case "Eligible": return <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full flex items-center gap-1"><CheckCircle className="w-3 h-3" />Eligible</span>;
      case "Not Eligible": return <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-medium rounded-full flex items-center gap-1"><XCircle className="w-3 h-3" />Not Eligible</span>;
      case "Pre-auth Required": return <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full flex items-center gap-1"><AlertTriangle className="w-3 h-3" />Pre-auth Required</span>;
      default: return null;
    }
  };

  const handleManualCheck = () => {
    setCheckResult(Math.random() > 0.2 ? "eligible" : "not-eligible");
  };

  const resetManualCheck = () => {
    setShowManualCheck(false);
    setCheckResult(null);
    setSearchQuery("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
            <UserCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Eligibility Engine</h1>
            <p className="text-slate-400">Real-time member eligibility verification</p>
          </div>
        </div>
        <button 
          onClick={() => setShowManualCheck(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Search className="w-4 h-4" />
          Manual Check
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-teal-600 to-blue-600 rounded-xl p-4 shadow-lg">
          <p className="text-2xl font-bold" style={{ color: 'white' }}>3,456</p>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>Checks Today</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl p-4 shadow-lg">
          <p className="text-2xl font-bold" style={{ color: 'white' }}>99.8%</p>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>Success Rate</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-teal-600 rounded-xl p-4 shadow-lg">
          <p className="text-2xl font-bold" style={{ color: 'white' }}>&lt;1s</p>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>Avg Response Time</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-4 shadow-lg">
          <p className="text-2xl font-bold" style={{ color: 'white' }}>8</p>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>Issues Found</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Checks */}
        <div className="lg:col-span-2 bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Recent Checks</h2>
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Live
            </div>
          </div>
          <div className="divide-y divide-slate-700">
            {recentChecks.map((check) => (
              <button
                key={check.id}
                onClick={() => setSelectedCheck(check)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800/80 transition-colors text-left"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    check.result === "Eligible" ? "bg-green-500/20" :
                    check.result === "Not Eligible" ? "bg-red-500/20" : "bg-amber-500/20"
                  }`}>
                    {check.result === "Eligible" ? <CheckCircle className="w-5 h-5 text-green-400" /> :
                     check.result === "Not Eligible" ? <XCircle className="w-5 h-5 text-red-400" /> :
                     <AlertTriangle className="w-5 h-5 text-amber-400" />}
                  </div>
                  <div>
                    <p className="text-white font-medium">{check.member}</p>
                    <p className="text-xs text-slate-400">{check.memberId} • {check.provider}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getResultBadge(check.result)}
                  <span className="text-xs text-slate-500">{check.time}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Issues */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700">
            <h2 className="text-lg font-semibold text-white">Eligibility Issues</h2>
            <p className="text-sm text-slate-400">Members needing attention</p>
          </div>
          <div className="divide-y divide-slate-700">
            {issues.slice(0, 3).map((issue, i) => (
              <button 
                key={i} 
                onClick={() => setSelectedIssue(issue)}
                className="w-full px-6 py-4 text-left hover:bg-slate-800/80 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    issue.severity === "high" ? "bg-red-400" :
                    issue.severity === "medium" ? "bg-amber-400" : "bg-blue-400"
                  }`}></div>
                  <div>
                    <p className="text-white font-medium hover:text-blue-500">{issue.member}</p>
                    <p className="text-xs text-slate-500">{issue.memberId}</p>
                    <p className="text-sm text-slate-400 mt-1">{issue.issue}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="px-6 py-4 border-t border-slate-700">
            <button 
              onClick={() => setShowAllIssues(true)}
              className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 text-sm"
            >
              View All Issues ({issues.length})
            </button>
          </div>
        </div>
      </div>

      {/* Check Detail Modal */}
      <AnimatePresence>
        {selectedCheck && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedCheck(null)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-700">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    selectedCheck.result === "Eligible" ? "bg-green-500/20" :
                    selectedCheck.result === "Not Eligible" ? "bg-red-500/20" : "bg-amber-500/20"
                  }`}>
                    {selectedCheck.result === "Eligible" ? <CheckCircle className="w-5 h-5 text-green-400" /> :
                     selectedCheck.result === "Not Eligible" ? <XCircle className="w-5 h-5 text-red-400" /> :
                     <AlertTriangle className="w-5 h-5 text-amber-400" />}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Eligibility Check</h2>
                    <p className="text-sm text-slate-400">{selectedCheck.id}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedCheck(null)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 space-y-4">
                {/* Result */}
                <div className={`rounded-xl p-4 text-center ${
                  selectedCheck.result === "Eligible" ? "bg-green-500/10 border border-green-500/30" :
                  selectedCheck.result === "Not Eligible" ? "bg-red-500/10 border border-red-500/30" :
                  "bg-amber-500/10 border border-amber-500/30"
                }`}>
                  <p className={`text-2xl font-bold ${
                    selectedCheck.result === "Eligible" ? "text-green-400" :
                    selectedCheck.result === "Not Eligible" ? "text-red-400" : "text-amber-400"
                  }`}>{selectedCheck.result}</p>
                  {selectedCheck.reason && (
                    <p className="text-sm text-red-300 mt-1">{selectedCheck.reason}</p>
                  )}
                </div>

                {/* Member Info */}
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="font-medium text-white mb-3 flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-400" />Member Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Name</span>
                      <span className="text-white">{selectedCheck.member}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Member ID</span>
                      <span className="font-mono text-white">{selectedCheck.memberId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Plan</span>
                      <span className="text-white">{selectedCheck.coverage}</span>
                    </div>
                  </div>
                </div>

                {/* Coverage Details */}
                {selectedCheck.result !== "Not Eligible" && (
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <h3 className="font-medium text-white mb-3 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-400" />Coverage Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Copay</span>
                        <span className="text-white">{selectedCheck.copay}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Deductible (Ind/Fam)</span>
                        <span className="text-white">{selectedCheck.deductible}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Deductible Met</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-slate-600 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-500 rounded-full"
                              style={{ width: selectedCheck.deductibleMet }}
                            ></div>
                          </div>
                          <span className="text-white">{selectedCheck.deductibleMet}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Request Details */}
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="font-medium text-white mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />Request Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Provider</span>
                      <span className="text-white">{selectedCheck.provider}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Checked</span>
                      <span className="text-white">{selectedCheck.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Response Time</span>
                      <span className="text-green-400">0.3s</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 p-4 border-t border-slate-700">
                <button className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">
                  <RefreshCw className="w-4 h-4 inline mr-2" />Re-check
                </button>
                <button onClick={() => setSelectedCheck(null)} className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Manual Check Modal */}
      <AnimatePresence>
        {showManualCheck && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={resetManualCheck} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50">
              <div className="p-4 border-b border-slate-700">
                <h3 className="text-lg font-semibold text-white">Manual Eligibility Check</h3>
              </div>
              <div className="p-4 space-y-4">
                {checkResult ? (
                  <div className={`rounded-xl p-6 text-center ${
                    checkResult === "eligible" ? "bg-green-500/10 border border-green-500/30" : "bg-red-500/10 border border-red-500/30"
                  }`}>
                    {checkResult === "eligible" ? (
                      <>
                        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                        <p className="text-xl font-bold text-green-400">Member Eligible</p>
                        <p className="text-sm text-slate-400 mt-2">Gold PPO • $25 Copay • 78% deductible met</p>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                        <p className="text-xl font-bold text-red-400">Not Eligible</p>
                        <p className="text-sm text-red-300 mt-2">Coverage terminated or member not found</p>
                      </>
                    )}
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Member ID</label>
                      <input
                        type="text"
                        placeholder="CHN-XXXXXX"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Date of Service</label>
                      <input type="date" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Service Type (Optional)</label>
                      <select className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                        <option>Any</option>
                        <option>Office Visit</option>
                        <option>Emergency</option>
                        <option>Surgery</option>
                        <option>Lab/Imaging</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
              <div className="flex gap-2 p-4 border-t border-slate-700">
                <button onClick={resetManualCheck} className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">
                  {checkResult ? "New Check" : "Cancel"}
                </button>
                {!checkResult && (
                  <button onClick={handleManualCheck} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    <Search className="w-4 h-4 inline mr-2" />Check Eligibility
                  </button>
                )}
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
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50">
              <div className="flex items-center justify-between p-4 border-b border-slate-700">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    selectedIssue.severity === "high" ? "bg-red-500/20" :
                    selectedIssue.severity === "medium" ? "bg-amber-500/20" : "bg-blue-500/20"
                  }`}>
                    <AlertTriangle className={`w-5 h-5 ${
                      selectedIssue.severity === "high" ? "text-red-400" :
                      selectedIssue.severity === "medium" ? "text-amber-400" : "text-blue-400"
                    }`} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Eligibility Issue</h2>
                    <p className="text-sm text-slate-400">{selectedIssue.issue}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedIssue(null)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 space-y-4">
                {/* Severity Badge */}
                <div className={`rounded-xl p-4 ${
                  selectedIssue.severity === "high" ? "bg-red-500/10 border border-red-500/30" :
                  selectedIssue.severity === "medium" ? "bg-amber-500/10 border border-amber-500/30" :
                  "bg-blue-500/10 border border-blue-500/30"
                }`}>
                  <p className={`text-sm font-medium uppercase ${
                    selectedIssue.severity === "high" ? "text-red-400" :
                    selectedIssue.severity === "medium" ? "text-amber-400" : "text-blue-400"
                  }`}>{selectedIssue.severity} Priority</p>
                </div>

                {/* Member Info */}
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="font-medium text-white mb-3 flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-400" />Member
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Name</span>
                      <span className="text-white">{selectedIssue.member}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Member ID</span>
                      <span className="font-mono text-white">{selectedIssue.memberId}</span>
                    </div>
                  </div>
                </div>

                {/* Issue Details */}
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="font-medium text-white mb-2">Details</h3>
                  <p className="text-sm text-slate-300">{selectedIssue.details}</p>
                </div>
              </div>
              <div className="flex gap-2 p-4 border-t border-slate-700">
                <button className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">
                  View Member Profile
                </button>
                <button onClick={() => setSelectedIssue(null)} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Resolve Issue
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* All Issues Modal */}
      <AnimatePresence>
        {showAllIssues && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAllIssues(false)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[80vh] bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-700">
                <div>
                  <h2 className="text-lg font-semibold text-white">All Eligibility Issues</h2>
                  <p className="text-sm text-slate-400">{issues.length} members need attention</p>
                </div>
                <button onClick={() => setShowAllIssues(false)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="overflow-y-auto max-h-[calc(80vh-140px)] divide-y divide-slate-700">
                {issues.map((issue, i) => (
                  <button 
                    key={i}
                    onClick={() => { setShowAllIssues(false); setSelectedIssue(issue); }}
                    className="w-full px-6 py-4 text-left hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-3 h-3 rounded-full mt-1.5 ${
                        issue.severity === "high" ? "bg-red-400" :
                        issue.severity === "medium" ? "bg-amber-400" : "bg-blue-400"
                      }`}></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-white font-medium">{issue.member}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            issue.severity === "high" ? "bg-red-500/20 text-red-400" :
                            issue.severity === "medium" ? "bg-amber-500/20 text-amber-400" : "bg-blue-500/20 text-blue-400"
                          }`}>{issue.severity}</span>
                        </div>
                        <p className="text-xs text-slate-500">{issue.memberId}</p>
                        <p className="text-sm text-amber-400 mt-1">{issue.issue}</p>
                        <p className="text-sm text-slate-400 mt-1">{issue.details}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="p-4 border-t border-slate-700">
                <button onClick={() => setShowAllIssues(false)} className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
