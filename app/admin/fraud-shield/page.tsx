"use client";

import { useTheme } from "@/components/admin/ThemeContext";
import { cn } from "@/lib/utils";

import { useState } from "react";
import { Search, Shield, AlertTriangle, Eye, CheckCircle, XCircle, Clock, User, Building2, FileText, X, Flag, MessageSquare, Zap, TrendingDown, RefreshCw, Info, BarChart3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FraudScore {
  claimId: string;
  transactionId: string;
  processingTimeMs: number;
  ruleScore: number;
  statisticalScore: number;
  mlScore: number;
  networkScore: number;
  compositeScore: number;
  riskLevel: string;
  recommendedAction: string;
  triggeredRules: Array<{
    ruleId: string;
    ruleName: string;
    category: string;
    severity: string;
    score: number;
    details: string;
  }>;
  anomalies: Array<{
    type: string;
    description: string;
    score: number;
  }>;
  potentialSavings?: number;
  providerRiskFactors: string[];
  memberRiskFactors: string[];
  summary: string;
}

const alerts = [
  { id: "FRD-001", type: "Billing Pattern", provider: "Unknown Medical LLC", npi: "9876543210", description: "98% modifier usage on all claims - significantly above network average", risk: "high", status: "open", detected: "2024-03-12", amount: "$45,230" },
  { id: "FRD-002", type: "Utilization", member: "Member #7823", memberId: "CHN-789234", description: "47 emergency room visits in 90 days across 12 facilities", risk: "high", status: "investigating", detected: "2024-03-11", amount: "$89,450" },
  { id: "FRD-003", type: "Duplicate", claimId: "CLM-8841", provider: "Metro Labs", description: "Duplicate claim submission - same service, same date, same member", risk: "medium", status: "open", detected: "2024-03-11", amount: "$2,340" },
  { id: "FRD-004", type: "Upcoding", provider: "City Urgent Care", npi: "5432109876", description: "99% of E&M codes are highest level (99215) - pattern deviation", risk: "medium", status: "investigating", detected: "2024-03-10", amount: "$18,750" },
  { id: "FRD-005", type: "Phantom Billing", provider: "ABC Medical Supply", npi: "1357924680", description: "Billing for DME with no corresponding physician order", risk: "high", status: "open", detected: "2024-03-09", amount: "$12,890" },
  { id: "FRD-006", type: "Identity", member: "Member #4521", memberId: "CHN-452198", description: "Multiple claims from different states on same date", risk: "medium", status: "resolved", detected: "2024-03-08", amount: "$3,450" },
];

const sampleClaims = [
  { claimId: "CLM-2024-8847", memberId: "CHN-123456", memberName: "John Doe", providerNpi: "1234567890", providerName: "Cleveland Family Medicine", serviceDate: "2024-03-10", totalBilledAmount: 138, lines: [{ cptCode: "99214", billedAmount: 138, quantity: 1 }] },
  { claimId: "CLM-2024-8845", memberId: "CHN-345678", memberName: "Michael Chen", providerNpi: "3456789012", providerName: "Metro Imaging Center", serviceDate: "2024-03-05", totalBilledAmount: 1850, lines: [{ cptCode: "72148", billedAmount: 1850, quantity: 1 }] },
  { claimId: "CLM-2024-8844", memberId: "CHN-456789", memberName: "Emily Rodriguez", providerNpi: "4567890123", providerName: "Cleveland Orthopedic", serviceDate: "2024-03-01", totalBilledAmount: 12500, lines: [{ cptCode: "27447", billedAmount: 12500, quantity: 1 }] },
  { claimId: "CLM-SUSPICIOUS-001", memberId: "CHN-789012", memberName: "David Kim", providerNpi: "1111111111", providerName: "ABC Medical Group", serviceDate: "2024-03-10", totalBilledAmount: 8950, lines: [{ cptCode: "99215", billedAmount: 450, quantity: 1 }, { cptCode: "99215", modifier: "25", billedAmount: 450, quantity: 1 }, { cptCode: "80053", billedAmount: 150, quantity: 1 }, { cptCode: "80048", billedAmount: 85, quantity: 1 }] },
];

const riskOptions = ["All", "High", "Medium", "Low"];
const statusOptions = ["All", "Open", "Investigating", "Resolved"];

export default function FraudShieldPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedAlert, setSelectedAlert] = useState<typeof alerts[0] | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<"investigate" | "dismiss" | "escalate" | null>(null);
  
  // Fraud scoring
  const [showScoringModal, setShowScoringModal] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<typeof sampleClaims[0] | null>(null);
  const [isScoring, setIsScoring] = useState(false);
  const [fraudScore, setFraudScore] = useState<FraudScore | null>(null);
  const [scoringError, setScoringError] = useState<string | null>(null);

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch = alert.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = riskFilter === "All" || alert.risk.toLowerCase() === riskFilter.toLowerCase();
    const matchesStatus = statusFilter === "All" || alert.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesRisk && matchesStatus;
  });

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "high": case "critical": return <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-medium rounded-full">High Risk</span>;
      case "medium": return <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full">Medium Risk</span>;
      case "low": case "minimal": return <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">Low Risk</span>;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 text-xs font-medium rounded-full"><AlertTriangle className="w-3 h-3" />Open</span>;
      case "investigating": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full"><Clock className="w-3 h-3" />Investigating</span>;
      case "resolved": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full"><CheckCircle className="w-3 h-3" />Resolved</span>;
      default: return null;
    }
  };

  const handleAction = () => {
    setShowActionModal(false);
    setActionType(null);
    setSelectedAlert(null);
  };

  const handleScoreClaim = async (claim: typeof sampleClaims[0]) => {
    setSelectedClaim(claim);
    setShowScoringModal(true);
    setIsScoring(true);
    setScoringError(null);
    setFraudScore(null);
    
    try {
      const response = await fetch('/api/admin/fraud/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(claim),
      });
      
      if (!response.ok) {
        throw new Error('Failed to score claim');
      }
      
      const result = await response.json();
      setFraudScore(result);
    } catch (error) {
      setScoringError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsScoring(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score < 20) return 'text-green-400';
    if (score < 40) return 'text-emerald-400';
    if (score < 60) return 'text-amber-400';
    if (score < 80) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score < 20) return 'bg-green-500/20 border-green-500/30';
    if (score < 40) return 'bg-emerald-500/20 border-emerald-500/30';
    if (score < 60) return 'bg-amber-500/20 border-amber-500/30';
    if (score < 80) return 'bg-orange-500/20 border-orange-500/30';
    return 'bg-red-500/20 border-red-500/30';
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'approve': return <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">✓ Approve</span>;
      case 'flag': return <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">🚩 Flag</span>;
      case 'pend': return <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium">⏸ Pend</span>;
      case 'deny': return <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm font-medium">✕ Deny</span>;
      case 'investigate': return <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-medium">🔍 Investigate</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Shield className="w-7 h-7 text-blue-500" />FraudShield AI</h1>
          <p className="text-slate-400">AI-powered fraud detection and investigation</p>
        </div>
        <button
          onClick={() => setShowScoringModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-colors"
        >
          <Zap className="w-4 h-4" />
          Score Claim
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4 shadow-lg">
          <p className="text-2xl font-bold" style={{ color: 'white' }}>3</p>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>High Risk Alerts</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-4 shadow-lg">
          <p className="text-2xl font-bold" style={{ color: 'white' }}>8</p>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>Under Investigation</p>
        </div>
        <div className="bg-gradient-to-br from-teal-600 to-blue-600 rounded-xl p-4 shadow-lg">
          <p className="text-2xl font-bold" style={{ color: 'white' }}>$172K</p>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>Potential Savings</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl p-4 shadow-lg">
          <p className="text-2xl font-bold" style={{ color: 'white' }}>94%</p>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>Detection Accuracy</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search alerts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)} className="px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white">
            {riskOptions.map(r => <option key={r}>{r}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white">
            {statusOptions.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Alerts */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <div key={alert.id} className={`bg-slate-800/50 rounded-xl border ${alert.risk === "high" ? "border-red-500/50" : "border-slate-700"} p-4`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${alert.risk === "high" ? "bg-red-500/20" : "bg-amber-500/20"}`}>
                  <AlertTriangle className={`w-6 h-6 ${alert.risk === "high" ? "text-red-400" : "text-amber-400"}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm text-blue-500">{alert.id}</span>
                    {getRiskBadge(alert.risk)}
                    {getStatusBadge(alert.status)}
                  </div>
                  <p className="text-white font-medium">{alert.type}: {alert.provider || alert.member || alert.claimId}</p>
                  <p className="text-slate-400 text-sm mt-1">{alert.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                    <span>Detected: {alert.detected}</span>
                    <span>Potential Impact: <span className="text-amber-400">{alert.amount}</span></span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setSelectedAlert(alert)} className="px-3 py-1.5 bg-slate-700 text-white rounded-lg hover:bg-slate-600 text-sm">View Details</button>
                {alert.status !== "resolved" && (
                  <button onClick={() => { setSelectedAlert(alert); setShowActionModal(true); }} className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 text-sm">Take Action</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alert Detail Modal */}
      <AnimatePresence>
        {selectedAlert && !showActionModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedAlert(null)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[90vh] bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-700">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${selectedAlert.risk === "high" ? "bg-red-500/20" : "bg-amber-500/20"}`}>
                    <AlertTriangle className={`w-5 h-5 ${selectedAlert.risk === "high" ? "text-red-400" : "text-amber-400"}`} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">{selectedAlert.type} Alert</h2>
                    <p className="text-sm text-slate-400">{selectedAlert.id}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedAlert(null)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-4 overflow-y-auto max-h-[calc(90vh-140px)] space-y-4">
                <div className="flex gap-2">
                  {getRiskBadge(selectedAlert.risk)}
                  {getStatusBadge(selectedAlert.status)}
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="font-medium text-white mb-2">Alert Description</h3>
                  <p className="text-slate-300">{selectedAlert.description}</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <h3 className="font-medium text-white mb-2">Subject</h3>
                    <p className="text-slate-300">{selectedAlert.provider || selectedAlert.member}</p>
                    <p className="text-sm text-slate-500">{selectedAlert.npi ? `NPI: ${selectedAlert.npi}` : selectedAlert.memberId ? `ID: ${selectedAlert.memberId}` : ""}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <h3 className="font-medium text-white mb-2">Financial Impact</h3>
                    <p className="text-2xl font-bold text-amber-400">{selectedAlert.amount}</p>
                    <p className="text-sm text-slate-500">Potential fraud amount</p>
                  </div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="font-medium text-white mb-2">AI Analysis</h3>
                  <div className="space-y-2 text-sm text-slate-300">
                    <p>• Pattern detected across 47 claims in the past 90 days</p>
                    <p>• Deviation from network average: 340%</p>
                    <p>• Similar patterns found in 3 confirmed fraud cases</p>
                    <p>• Confidence score: 94%</p>
                  </div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="font-medium text-white mb-2">Investigation History</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-slate-300 text-sm">Alert created by FraudShield AI</p>
                        <p className="text-xs text-slate-500">{selectedAlert.detected} at 9:00 AM</p>
                      </div>
                    </div>
                    {selectedAlert.status !== "open" && (
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-amber-400 rounded-full mt-2"></div>
                        <div>
                          <p className="text-slate-300 text-sm">Investigation started by Admin User</p>
                          <p className="text-xs text-slate-500">{selectedAlert.detected} at 10:30 AM</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border-t border-slate-700 bg-slate-800">
                <button className="inline-flex items-center gap-2 px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 text-sm"><FileText className="w-4 h-4" />Export Report</button>
                <div className="flex gap-2">
                  <button onClick={() => setSelectedAlert(null)} className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 text-sm">Close</button>
                  {selectedAlert.status !== "resolved" && (
                    <button onClick={() => setShowActionModal(true)} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 text-sm">Take Action</button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Action Modal */}
      <AnimatePresence>
        {showActionModal && selectedAlert && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowActionModal(false)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Take Action on {selectedAlert.id}</h3>
                <div className="space-y-3 mb-6">
                  <button onClick={() => setActionType("investigate")} className={`w-full p-4 rounded-lg border text-left ${actionType === "investigate" ? "border-blue-600 bg-blue-600/10" : "border-slate-600 hover:border-slate-500"}`}>
                    <p className="font-medium text-white">Start Investigation</p>
                    <p className="text-sm text-slate-400">Assign to team for detailed review</p>
                  </button>
                  <button onClick={() => setActionType("dismiss")} className={`w-full p-4 rounded-lg border text-left ${actionType === "dismiss" ? "border-blue-600 bg-blue-600/10" : "border-slate-600 hover:border-slate-500"}`}>
                    <p className="font-medium text-white">Dismiss Alert</p>
                    <p className="text-sm text-slate-400">Mark as false positive</p>
                  </button>
                  <button onClick={() => setActionType("escalate")} className={`w-full p-4 rounded-lg border text-left ${actionType === "escalate" ? "border-blue-600 bg-blue-600/10" : "border-slate-600 hover:border-slate-500"}`}>
                    <p className="font-medium text-white">Escalate to SIU</p>
                    <p className="text-sm text-slate-400">Forward to Special Investigations Unit</p>
                  </button>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-300 mb-1">Notes</label>
                  <textarea className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white h-20 resize-none" placeholder="Add notes about this action..."></textarea>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowActionModal(false)} className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Cancel</button>
                  <button onClick={handleAction} disabled={!actionType} className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50">Confirm</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Fraud Scoring Modal */}
      <AnimatePresence>
        {showScoringModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setShowScoringModal(false); setFraudScore(null); setSelectedClaim(null); }} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] overflow-auto bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50">
              <div className="p-4 border-b border-slate-700 flex items-center justify-between sticky top-0 bg-slate-800 z-10">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-500" />
                  FraudShield AI - Claim Scoring
                </h3>
                <button onClick={() => { setShowScoringModal(false); setFraudScore(null); setSelectedClaim(null); }} className="p-1 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              
              <div className="p-4 space-y-4">
                {!selectedClaim && !isScoring && !fraudScore && (
                  <>
                    <p className="text-slate-400 text-sm">Select a claim to analyze for fraud indicators:</p>
                    <div className="space-y-2">
                      {sampleClaims.map((claim) => (
                        <button
                          key={claim.claimId}
                          onClick={() => handleScoreClaim(claim)}
                          className="w-full p-4 bg-slate-700/50 border border-slate-600 rounded-lg text-left hover:border-blue-600 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-mono text-blue-500">{claim.claimId}</p>
                              <p className="text-white">{claim.memberName} • {claim.providerName}</p>
                              <p className="text-sm text-slate-400">Service Date: {claim.serviceDate}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-white">${claim.totalBilledAmount.toLocaleString()}</p>
                              <p className="text-xs text-slate-500">{claim.lines.length} line(s)</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {isScoring && (
                  <div className="flex flex-col items-center justify-center py-16">
                    <RefreshCw className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                    <p className="text-white font-medium text-lg">Analyzing claim for fraud indicators...</p>
                    <p className="text-slate-400 text-sm mt-2">Running 20+ detection rules, statistical analysis, and ML scoring</p>
                  </div>
                )}

                {scoringError && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <p className="text-red-400 font-medium">Scoring Failed</p>
                    <p className="text-red-300 text-sm">{scoringError}</p>
                  </div>
                )}

                {fraudScore && (
                  <>
                    {/* Score Summary */}
                    <div className={`rounded-xl p-6 border ${getScoreBgColor(fraudScore.compositeScore)}`}>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-slate-400 text-sm">Claim ID</p>
                          <p className="text-white font-mono">{fraudScore.claimId}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-slate-400 text-sm">Processing Time</p>
                          <p className="text-white">{fraudScore.processingTimeMs}ms</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-8 mb-6">
                        <div className="text-center">
                          <p className={`text-6xl font-bold ${getScoreColor(fraudScore.compositeScore)}`}>{fraudScore.compositeScore}</p>
                          <p className="text-slate-400 text-sm">Risk Score</p>
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400 text-sm">Risk Level</span>
                            {getRiskBadge(fraudScore.riskLevel)}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400 text-sm">Recommended Action</span>
                            {getActionBadge(fraudScore.recommendedAction)}
                          </div>
                          {fraudScore.potentialSavings && fraudScore.potentialSavings > 0 && (
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 text-sm">Potential Savings</span>
                              <span className="text-green-400 font-bold">${fraudScore.potentialSavings.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <p className="text-white">{fraudScore.summary}</p>
                      </div>
                    </div>

                    {/* Score Breakdown */}
                    <div className="grid grid-cols-4 gap-4">
                      <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-blue-500">{fraudScore.ruleScore}</p>
                        <p className="text-xs text-slate-400">Rule Score</p>
                        <p className="text-xs text-slate-500">35% weight</p>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-blue-400">{fraudScore.statisticalScore}</p>
                        <p className="text-xs text-slate-400">Statistical</p>
                        <p className="text-xs text-slate-500">25% weight</p>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-blue-400">{Math.round(fraudScore.mlScore)}</p>
                        <p className="text-xs text-slate-400">ML Score</p>
                        <p className="text-xs text-slate-500">30% weight</p>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-emerald-400">{fraudScore.networkScore}</p>
                        <p className="text-xs text-slate-400">Network</p>
                        <p className="text-xs text-slate-500">10% weight</p>
                      </div>
                    </div>

                    {/* Triggered Rules */}
                    {fraudScore.triggeredRules.length > 0 && (
                      <div className="bg-slate-700/50 rounded-lg p-4">
                        <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-400" />
                          Triggered Rules ({fraudScore.triggeredRules.length})
                        </h4>
                        <div className="space-y-2">
                          {fraudScore.triggeredRules.map((rule, i) => (
                            <div key={i} className="bg-slate-800/50 rounded-lg p-3 border-l-4 border-red-500">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-mono text-xs text-blue-500">{rule.ruleId}</span>
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-0.5 text-xs rounded ${
                                    rule.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                                    rule.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                                    'bg-amber-500/20 text-amber-400'
                                  }`}>{rule.severity}</span>
                                  <span className="text-sm font-medium text-red-400">+{rule.score}</span>
                                </div>
                              </div>
                              <p className="text-white text-sm font-medium">{rule.ruleName}</p>
                              <p className="text-slate-400 text-xs mt-1">{rule.details}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Anomalies */}
                    {fraudScore.anomalies.length > 0 && (
                      <div className="bg-slate-700/50 rounded-lg p-4">
                        <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-blue-400" />
                          Statistical Anomalies ({fraudScore.anomalies.length})
                        </h4>
                        <div className="space-y-2">
                          {fraudScore.anomalies.map((anomaly, i) => (
                            <div key={i} className="flex items-center justify-between p-2 bg-slate-800/50 rounded">
                              <div>
                                <p className="text-white text-sm">{anomaly.description}</p>
                                <p className="text-xs text-slate-500">{anomaly.type}</p>
                              </div>
                              <span className="text-amber-400 font-medium">+{anomaly.score}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Risk Factors */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      {fraudScore.providerRiskFactors.length > 0 && (
                        <div className="bg-slate-700/50 rounded-lg p-4">
                          <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-slate-400" />
                            Provider Risk Factors
                          </h4>
                          <ul className="space-y-1">
                            {fraudScore.providerRiskFactors.map((factor, i) => (
                              <li key={i} className="text-sm text-amber-400 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                                {factor}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {fraudScore.memberRiskFactors.length > 0 && (
                        <div className="bg-slate-700/50 rounded-lg p-4">
                          <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                            <User className="w-4 h-4 text-slate-400" />
                            Member Risk Factors
                          </h4>
                          <ul className="space-y-1">
                            {fraudScore.memberRiskFactors.map((factor, i) => (
                              <li key={i} className="text-sm text-amber-400 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                                {factor}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
              
              {fraudScore && (
                <div className="flex gap-2 p-4 border-t border-slate-700 sticky bottom-0 bg-slate-800">
                  <button onClick={() => { setFraudScore(null); setSelectedClaim(null); }} className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Score Another</button>
                  <button onClick={() => { setShowScoringModal(false); setFraudScore(null); setSelectedClaim(null); }} className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600">Close</button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
