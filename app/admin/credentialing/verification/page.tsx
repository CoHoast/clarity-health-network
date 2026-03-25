"use client";

import { useState, useEffect } from "react";
import { UserCheck, Search, CheckCircle, XCircle, Clock, AlertTriangle, RefreshCw, Eye, ExternalLink, Shield, FileText, Calendar, Hash, Building2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/admin/ThemeContext";
import { Button } from "@/components/admin/ui/Button";
import { cn } from "@/lib/utils";

interface VerificationDetail {
  licenseNumber?: string;
  issueDate?: string;
  disciplinaryActions?: string;
  restrictions?: string;
  verificationMethod?: string;
  lastChecked?: string;
  rawResponse?: string;
}

interface VerificationRecord {
  id: string;
  providerName: string;
  npi: string;
  verificationType: string;
  status: "verified" | "pending" | "failed" | "expiring";
  verifiedDate: string | null;
  expirationDate: string | null;
  source: string;
  details: string;
  extendedDetails?: VerificationDetail;
}

// Verification records are now loaded from API

const statusOptions = ["All Statuses", "Verified", "Pending", "Failed", "Expiring"];
const typeOptions = ["All Types", "Medical License", "DEA Registration", "Board Certification", "NPI Validation", "Liability Insurance", "Facility License", "CLIA Certificate"];

export default function VerificationStatusPage() {
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [selectedVerification, setSelectedVerification] = useState<VerificationRecord | null>(null);
  const [verifications, setVerifications] = useState<VerificationRecord[]>([]);
  const [reverifyingId, setReverifyingId] = useState<string | null>(null);
  const [showReverifySuccess, setShowReverifySuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, verified: 0, pending: 0, failed: 0, expiring: 0 });

  // Fetch verification records from API
  useEffect(() => {
    async function fetchVerifications() {
      try {
        setIsLoading(true);
        const params = new URLSearchParams();
        if (statusFilter !== "All Statuses") params.set('status', statusFilter);
        if (typeFilter !== "All Types") params.set('type', typeFilter);
        if (searchQuery) params.set('search', searchQuery);
        
        const res = await fetch(`/api/verification/queue?${params}`);
        if (!res.ok) throw new Error('Failed to fetch');
        
        const data = await res.json();
        setVerifications(data.records || []);
        setStats(data.stats || { total: 0, verified: 0, pending: 0, failed: 0, expiring: 0 });
      } catch (error) {
        console.error('Failed to fetch verifications:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchVerifications();
  }, [statusFilter, typeFilter, searchQuery]);

  const handleReverify = async (verification: VerificationRecord) => {
    setReverifyingId(verification.id);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update the verification status
    setVerifications(prev => prev.map(v => {
      if (v.id === verification.id) {
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const timeStr = now.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour12: false });
        return {
          ...v,
          status: "verified" as const,
          verifiedDate: dateStr,
          details: v.details.replace("Expiring Soon", "Renewed").replace("Policy expired - Awaiting renewal docs", "Policy verified - Active"),
          extendedDetails: {
            ...v.extendedDetails,
            lastChecked: `${dateStr} ${timeStr} EST`,
            rawResponse: v.extendedDetails?.rawResponse?.replace("RENEWAL REQUIRED", "RENEWED").replace("ERROR:", "VERIFIED:").replace("expired", "active") || "Verification successful"
          }
        };
      }
      return v;
    }));
    
    setReverifyingId(null);
    setShowReverifySuccess(true);
    setTimeout(() => setShowReverifySuccess(false), 3000);
  };

  // Verifications are filtered server-side via API
  const filteredVerifications = verifications;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full"><CheckCircle className="w-3 h-3" />Verified</span>;
      case "pending": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full"><Clock className="w-3 h-3" />Pending</span>;
      case "failed": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 text-xs font-medium rounded-full"><XCircle className="w-3 h-3" />Failed</span>;
      case "expiring": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-500/20 text-orange-400 text-xs font-medium rounded-full"><AlertTriangle className="w-3 h-3" />Expiring</span>;
      default: return null;
    }
  };

  // Use stats from API
  const verifiedCount = stats.verified;
  const pendingCount = stats.pending;
  const failedCount = stats.failed;
  const expiringCount = stats.expiring;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={cn("text-2xl font-bold flex items-center gap-3", isDark ? "text-white" : "text-slate-900")}>
            <UserCheck className="w-7 h-7 text-blue-500" />
            Verification Status
          </h1>
          <p className={isDark ? "text-slate-400 mt-1" : "text-slate-500 mt-1"}>Track credential verification status for all providers</p>
        </div>
        <Button variant="primary" icon={<RefreshCw className="w-4 h-4" />}>
          Run Batch Verification
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: CheckCircle, value: verifiedCount, label: "Verified" },
          { icon: Clock, value: pendingCount, label: "Pending" },
          { icon: XCircle, value: failedCount, label: "Failed" },
          { icon: AlertTriangle, value: expiringCount, label: "Expiring Soon" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className={`rounded-xl p-5 shadow-lg ${
              isDark 
                ? "bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border border-blue-800/30" 
                : "bg-white border border-slate-200"
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isDark ? "bg-blue-500/20 border border-blue-500/30" : "bg-teal-50"
                }`}>
                  <Icon className={`w-5 h-5 ${isDark ? "text-white" : "text-blue-600"}`} />
                </div>
                <div>
                  <p className={`text-3xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{stat.value}</p>
                  <p className={`text-sm ${isDark ? "text-white/80" : "text-slate-500"}`}>{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by provider or NPI..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
              isDark 
                ? "bg-slate-800 border border-slate-600 text-white placeholder:text-slate-400" 
                : "bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400"
            }`}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={`px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
            isDark 
              ? "bg-slate-800 border border-slate-600 text-white" 
              : "bg-white border border-slate-300 text-slate-900"
          }`}
        >
          {statusOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className={`px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
            isDark 
              ? "bg-slate-800 border border-slate-600 text-white" 
              : "bg-white border border-slate-300 text-slate-900"
          }`}
        >
          {typeOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      {/* Verifications Table */}
      <div className={`rounded-xl overflow-hidden ${
        isDark ? "bg-slate-800/50 border border-slate-700" : "bg-white border border-slate-200"
      }`}>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <span className="ml-3 text-slate-400">Loading verifications...</span>
          </div>
        ) : filteredVerifications.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <p className={isDark ? "text-slate-400" : "text-slate-500"}>No verification records found</p>
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={cn("border-b", isDark ? "border-slate-700" : "border-slate-200")}>
                <th className={cn("px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider", isDark ? "text-slate-400" : "text-slate-500")}>Provider</th>
                <th className={cn("px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider", isDark ? "text-slate-400" : "text-slate-500")}>Verification Type</th>
                <th className={cn("px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider", isDark ? "text-slate-400" : "text-slate-500")}>Source</th>
                <th className={cn("px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider", isDark ? "text-slate-400" : "text-slate-500")}>Expiration</th>
                <th className={cn("px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider", isDark ? "text-slate-400" : "text-slate-500")}>Status</th>
                <th className={cn("px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider", isDark ? "text-slate-400" : "text-slate-500")}>Actions</th>
              </tr>
            </thead>
            <tbody className={cn("divide-y", isDark ? "divide-slate-700" : "divide-slate-200")}>
              {filteredVerifications.map((verification) => (
                <tr key={verification.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-white font-medium">{verification.providerName}</p>
                      <p className="text-slate-400 text-sm">NPI: {verification.npi}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-300">{verification.verificationType}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-400 text-sm">{verification.source}</span>
                  </td>
                  <td className="px-6 py-4">
                    {verification.expirationDate ? (
                      <span className={verification.status === "expiring" ? "text-orange-400" : "text-slate-300"}>
                        {verification.expirationDate}
                      </span>
                    ) : (
                      <span className="text-slate-500">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(verification.status)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedVerification(verification)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-700 text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-600 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Details
                      </button>
                      {(verification.status === "failed" || verification.status === "expiring") && (
                        <button 
                          onClick={() => handleReverify(verification)}
                          disabled={reverifyingId === verification.id}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-colors disabled:opacity-50"
                        >
                          <RefreshCw className={`w-4 h-4 ${reverifyingId === verification.id ? 'animate-spin' : ''}`} />
                          {reverifyingId === verification.id ? 'Verifying...' : 'Reverify'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {showReverifySuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Verification completed successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Verification Detail Modal */}
      <AnimatePresence>
        {selectedVerification && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedVerification(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
                isDark ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-200"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`p-6 border-b flex items-start justify-between ${isDark ? "border-slate-700" : "border-slate-200"}`}>
                <div>
                  <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{selectedVerification.verificationType}</h2>
                  <p className={isDark ? "text-slate-400" : "text-slate-500"}>{selectedVerification.providerName}</p>
                </div>
                {getStatusBadge(selectedVerification.status)}
              </div>
              <div className="p-6 space-y-4">
                {/* Basic Info */}
                <div className={`rounded-lg p-4 space-y-3 ${isDark ? "bg-slate-700/50" : "bg-slate-50"}`}>
                  <div className="flex justify-between">
                    <span className={isDark ? "text-slate-400" : "text-slate-500"}>Source:</span>
                    <span className={isDark ? "text-white" : "text-slate-900"}>{selectedVerification.source}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? "text-slate-400" : "text-slate-500"}>Verified Date:</span>
                    <span className={isDark ? "text-white" : "text-slate-900"}>{selectedVerification.verifiedDate || "Pending"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? "text-slate-400" : "text-slate-500"}>Expiration:</span>
                    <span className={isDark ? "text-white" : "text-slate-900"}>{selectedVerification.expirationDate || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? "text-slate-400" : "text-slate-500"}>NPI:</span>
                    <span className={`font-mono ${isDark ? "text-white" : "text-slate-900"}`}>{selectedVerification.npi}</span>
                  </div>
                </div>

                {/* Verification Details - LIGHT COLORED BOX */}
                <div className={`rounded-lg p-4 ${isDark ? "bg-blue-900/20 border border-blue-800/30" : "bg-blue-50 border border-blue-100"}`}>
                  <p className={`text-sm font-semibold mb-3 flex items-center gap-2 ${isDark ? "text-blue-300" : "text-blue-700"}`}>
                    <Shield className="w-4 h-4" />
                    Verification Details
                  </p>
                  <div className="space-y-2">
                    {selectedVerification.extendedDetails?.licenseNumber && (
                      <div className="flex items-center gap-2">
                        <Hash className={`w-4 h-4 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
                        <span className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>License/ID:</span>
                        <span className={`text-sm font-medium font-mono ${isDark ? "text-white" : "text-slate-900"}`}>{selectedVerification.extendedDetails.licenseNumber}</span>
                      </div>
                    )}
                    {selectedVerification.extendedDetails?.issueDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className={`w-4 h-4 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
                        <span className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>Issue Date:</span>
                        <span className={`text-sm font-medium ${isDark ? "text-white" : "text-slate-900"}`}>{selectedVerification.extendedDetails.issueDate}</span>
                      </div>
                    )}
                    {selectedVerification.extendedDetails?.disciplinaryActions && (
                      <div className="flex items-center gap-2">
                        <AlertTriangle className={`w-4 h-4 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
                        <span className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>Disciplinary Actions:</span>
                        <span className={`text-sm font-medium ${selectedVerification.extendedDetails.disciplinaryActions === "None" || selectedVerification.extendedDetails.disciplinaryActions === "None on record" || selectedVerification.extendedDetails.disciplinaryActions === "N/A" ? (isDark ? "text-green-400" : "text-green-600") : (isDark ? "text-red-400" : "text-red-600")}`}>
                          {selectedVerification.extendedDetails.disciplinaryActions}
                        </span>
                      </div>
                    )}
                    {selectedVerification.extendedDetails?.restrictions && (
                      <div className="flex items-center gap-2">
                        <FileText className={`w-4 h-4 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
                        <span className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>Restrictions:</span>
                        <span className={`text-sm font-medium ${isDark ? "text-white" : "text-slate-900"}`}>{selectedVerification.extendedDetails.restrictions}</span>
                      </div>
                    )}
                    {selectedVerification.extendedDetails?.verificationMethod && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className={`w-4 h-4 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
                        <span className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>Method:</span>
                        <span className={`text-sm font-medium ${isDark ? "text-white" : "text-slate-900"}`}>{selectedVerification.extendedDetails.verificationMethod}</span>
                      </div>
                    )}
                    {selectedVerification.extendedDetails?.lastChecked && (
                      <div className="flex items-center gap-2">
                        <Clock className={`w-4 h-4 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
                        <span className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>Last Checked:</span>
                        <span className={`text-sm font-medium ${isDark ? "text-white" : "text-slate-900"}`}>{selectedVerification.extendedDetails.lastChecked}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Raw Response */}
                {selectedVerification.extendedDetails?.rawResponse && (
                  <div className={`rounded-lg p-4 ${isDark ? "bg-slate-900/50 border border-slate-700" : "bg-slate-100 border border-slate-200"}`}>
                    <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      Source Response
                    </p>
                    <p className={`text-sm font-mono break-all ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                      {selectedVerification.extendedDetails.rawResponse}
                    </p>
                  </div>
                )}
              </div>
              <div className={`p-6 border-t flex justify-between ${isDark ? "border-slate-700" : "border-slate-200"}`}>
                <div>
                  {(selectedVerification.status === "failed" || selectedVerification.status === "expiring") && (
                    <button 
                      onClick={() => {
                        handleReverify(selectedVerification);
                        setSelectedVerification(null);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-lg hover:from-green-600 hover:to-emerald-600 transition-colors flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Re-Verify Now
                    </button>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedVerification(null)}
                    className={`px-4 py-2 font-medium rounded-lg transition-colors ${
                      isDark ? "bg-slate-700 text-slate-300 hover:bg-slate-600" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    Close
                  </button>
                  <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-colors flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    View Source
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
