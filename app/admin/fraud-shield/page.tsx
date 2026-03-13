"use client";

import { useState } from "react";
import { Search, Shield, AlertTriangle, Eye, CheckCircle, XCircle, Clock, User, Building2, FileText, X, Flag, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const alerts = [
  { id: "FRD-001", type: "Billing Pattern", provider: "Unknown Medical LLC", npi: "9876543210", description: "98% modifier usage on all claims - significantly above network average", risk: "high", status: "open", detected: "2024-03-12", amount: "$45,230" },
  { id: "FRD-002", type: "Utilization", member: "Member #7823", memberId: "CHN-789234", description: "47 emergency room visits in 90 days across 12 facilities", risk: "high", status: "investigating", detected: "2024-03-11", amount: "$89,450" },
  { id: "FRD-003", type: "Duplicate", claimId: "CLM-8841", provider: "Metro Labs", description: "Duplicate claim submission - same service, same date, same member", risk: "medium", status: "open", detected: "2024-03-11", amount: "$2,340" },
  { id: "FRD-004", type: "Upcoding", provider: "City Urgent Care", npi: "5432109876", description: "99% of E&M codes are highest level (99215) - pattern deviation", risk: "medium", status: "investigating", detected: "2024-03-10", amount: "$18,750" },
  { id: "FRD-005", type: "Phantom Billing", provider: "ABC Medical Supply", npi: "1357924680", description: "Billing for DME with no corresponding physician order", risk: "high", status: "open", detected: "2024-03-09", amount: "$12,890" },
  { id: "FRD-006", type: "Identity", member: "Member #4521", memberId: "CHN-452198", description: "Multiple claims from different states on same date", risk: "medium", status: "resolved", detected: "2024-03-08", amount: "$3,450" },
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

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch = alert.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = riskFilter === "All" || alert.risk.toLowerCase() === riskFilter.toLowerCase();
    const matchesStatus = statusFilter === "All" || alert.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesRisk && matchesStatus;
  });

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "high": return <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-medium rounded-full">High Risk</span>;
      case "medium": return <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full">Medium Risk</span>;
      case "low": return <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">Low Risk</span>;
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Shield className="w-7 h-7 text-purple-400" />FraudShield AI</h1>
          <p className="text-slate-400">AI-powered fraud detection and investigation</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <p className="text-2xl font-bold text-red-400">3</p>
          <p className="text-sm text-red-300">High Risk Alerts</p>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
          <p className="text-2xl font-bold text-amber-400">8</p>
          <p className="text-sm text-amber-300">Under Investigation</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-white">$172K</p>
          <p className="text-sm text-slate-400">Potential Savings</p>
        </div>
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
          <p className="text-2xl font-bold text-green-400">94%</p>
          <p className="text-sm text-green-300">Detection Accuracy</p>
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
              className="w-full pl-10 pr-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500"
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
                    <span className="font-mono text-sm text-purple-400">{alert.id}</span>
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
                  <button onClick={() => { setSelectedAlert(alert); setShowActionModal(true); }} className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">Take Action</button>
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
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
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
                    <button onClick={() => setShowActionModal(true)} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">Take Action</button>
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
                  <button onClick={() => setActionType("investigate")} className={`w-full p-4 rounded-lg border text-left ${actionType === "investigate" ? "border-purple-500 bg-purple-500/10" : "border-slate-600 hover:border-slate-500"}`}>
                    <p className="font-medium text-white">Start Investigation</p>
                    <p className="text-sm text-slate-400">Assign to team for detailed review</p>
                  </button>
                  <button onClick={() => setActionType("dismiss")} className={`w-full p-4 rounded-lg border text-left ${actionType === "dismiss" ? "border-purple-500 bg-purple-500/10" : "border-slate-600 hover:border-slate-500"}`}>
                    <p className="font-medium text-white">Dismiss Alert</p>
                    <p className="text-sm text-slate-400">Mark as false positive</p>
                  </button>
                  <button onClick={() => setActionType("escalate")} className={`w-full p-4 rounded-lg border text-left ${actionType === "escalate" ? "border-purple-500 bg-purple-500/10" : "border-slate-600 hover:border-slate-500"}`}>
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
                  <button onClick={handleAction} disabled={!actionType} className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50">Confirm</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
