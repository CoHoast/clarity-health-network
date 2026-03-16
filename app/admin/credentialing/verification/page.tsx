"use client";

import { useState } from "react";
import { UserCheck, Search, CheckCircle, XCircle, Clock, AlertTriangle, RefreshCw, Eye, ExternalLink, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/admin/ThemeContext";

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
}

const verifications: VerificationRecord[] = [
  { id: "VER-001", providerName: "Dr. Sarah Chen, MD", npi: "2345678901", verificationType: "Medical License", status: "verified", verifiedDate: "2026-02-15", expirationDate: "2027-12-31", source: "Ohio Medical Board", details: "License #MD-123456 Active" },
  { id: "VER-002", providerName: "Dr. Sarah Chen, MD", npi: "2345678901", verificationType: "DEA Registration", status: "verified", verifiedDate: "2026-02-15", expirationDate: "2027-06-30", source: "DEA NTIS", details: "DEA #AC1234567 Active" },
  { id: "VER-003", providerName: "Dr. Sarah Chen, MD", npi: "2345678901", verificationType: "Board Certification", status: "verified", verifiedDate: "2026-02-15", expirationDate: "2028-12-31", source: "ABIM", details: "Internal Medicine - Certified" },
  { id: "VER-004", providerName: "Cleveland Family Medicine", npi: "1234567890", verificationType: "NPI Validation", status: "verified", verifiedDate: "2026-03-01", expirationDate: null, source: "NPPES", details: "Active Organization NPI" },
  { id: "VER-005", providerName: "Cleveland Family Medicine", npi: "1234567890", verificationType: "Liability Insurance", status: "expiring", verifiedDate: "2025-04-01", expirationDate: "2026-04-01", source: "ProAssurance", details: "$1M/$3M Coverage - Expiring Soon" },
  { id: "VER-006", providerName: "Dr. James Wilson, DO", npi: "5678901234", verificationType: "Medical License", status: "pending", verifiedDate: null, expirationDate: null, source: "Ohio Medical Board", details: "Verification in progress" },
  { id: "VER-007", providerName: "Dr. James Wilson, DO", npi: "5678901234", verificationType: "DEA Registration", status: "pending", verifiedDate: null, expirationDate: null, source: "DEA NTIS", details: "Verification in progress" },
  { id: "VER-008", providerName: "Metro Imaging Center", npi: "3456789012", verificationType: "Facility License", status: "verified", verifiedDate: "2026-01-20", expirationDate: "2027-01-31", source: "Ohio Dept of Health", details: "Diagnostic Imaging License Active" },
  { id: "VER-009", providerName: "Metro Imaging Center", npi: "3456789012", verificationType: "CLIA Certificate", status: "verified", verifiedDate: "2026-01-20", expirationDate: "2028-01-31", source: "CMS CLIA", details: "CLIA #12D3456789" },
  { id: "VER-010", providerName: "Westlake Urgent Care", npi: "6789012345", verificationType: "Liability Insurance", status: "failed", verifiedDate: null, expirationDate: null, source: "Insurance Verification", details: "Policy expired - Awaiting renewal docs" },
  { id: "VER-011", providerName: "Quest Diagnostics Cleveland", npi: "8901234567", verificationType: "CLIA Certificate", status: "verified", verifiedDate: "2026-02-01", expirationDate: "2028-02-28", source: "CMS CLIA", details: "CLIA #12D7891234 - Full Service Lab" },
  { id: "VER-012", providerName: "Cleveland Cardiology Associates", npi: "9012345678", verificationType: "Group Practice License", status: "verified", verifiedDate: "2026-01-15", expirationDate: "2027-12-31", source: "Ohio Medical Board", details: "Group Practice License Active" },
];

const statusOptions = ["All Statuses", "Verified", "Pending", "Failed", "Expiring"];
const typeOptions = ["All Types", "Medical License", "DEA Registration", "Board Certification", "NPI Validation", "Liability Insurance", "Facility License", "CLIA Certificate"];

export default function VerificationStatusPage() {
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [selectedVerification, setSelectedVerification] = useState<VerificationRecord | null>(null);

  const filteredVerifications = verifications.filter(v => {
    const matchesSearch = v.providerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         v.npi.includes(searchQuery);
    const matchesStatus = statusFilter === "All Statuses" || 
                         (statusFilter === "Verified" && v.status === "verified") ||
                         (statusFilter === "Pending" && v.status === "pending") ||
                         (statusFilter === "Failed" && v.status === "failed") ||
                         (statusFilter === "Expiring" && v.status === "expiring");
    const matchesType = typeFilter === "All Types" || v.verificationType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full"><CheckCircle className="w-3 h-3" />Verified</span>;
      case "pending": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full"><Clock className="w-3 h-3" />Pending</span>;
      case "failed": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 text-xs font-medium rounded-full"><XCircle className="w-3 h-3" />Failed</span>;
      case "expiring": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-500/20 text-orange-400 text-xs font-medium rounded-full"><AlertTriangle className="w-3 h-3" />Expiring</span>;
      default: return null;
    }
  };

  const verifiedCount = verifications.filter(v => v.status === "verified").length;
  const pendingCount = verifications.filter(v => v.status === "pending").length;
  const failedCount = verifications.filter(v => v.status === "failed").length;
  const expiringCount = verifications.filter(v => v.status === "expiring").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <UserCheck className="w-7 h-7 text-teal-500" />
            Verification Status
          </h1>
          <p className="text-slate-400 mt-1">Track credential verification status for all providers</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 font-medium rounded-lg hover:bg-teal-700 transition-colors" style={{ color: 'white' }}>
          <RefreshCw className="w-4 h-4" />
          Run Batch Verification
        </button>
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
                ? "bg-gradient-to-br from-cyan-900/30 to-teal-900/30 border border-cyan-800/30" 
                : "bg-cyan-600"
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isDark ? "bg-cyan-500/20 border border-cyan-500/30" : "bg-white/20"
                }`}>
                  <Icon className="w-5 h-5" style={{ color: 'white' }} />
                </div>
                <div>
                  <p className="text-3xl font-bold" style={{ color: 'white' }}>{stat.value}</p>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>{stat.label}</p>
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
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          {statusOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          {typeOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      {/* Verifications Table */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Provider</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Verification Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Source</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Expiration</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
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
                        <button className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors">
                          <RefreshCw className="w-4 h-4" />
                          Reverify
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verification Detail Modal */}
      <AnimatePresence>
        {selectedVerification && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedVerification(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-800 rounded-xl max-w-lg w-full border border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-700 flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedVerification.verificationType}</h2>
                  <p className="text-slate-400">{selectedVerification.providerName}</p>
                </div>
                {getStatusBadge(selectedVerification.status)}
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-slate-700/50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Source:</span>
                    <span className="text-white">{selectedVerification.source}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Verified Date:</span>
                    <span className="text-white">{selectedVerification.verifiedDate || "Pending"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Expiration:</span>
                    <span className="text-white">{selectedVerification.expirationDate || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">NPI:</span>
                    <span className="text-white font-mono">{selectedVerification.npi}</span>
                  </div>
                </div>
                <div className="bg-slate-900 rounded-lg p-4">
                  <p className="text-sm text-slate-400 mb-1">Verification Details</p>
                  <p className="text-white">{selectedVerification.details}</p>
                </div>
              </div>
              <div className="p-6 border-t border-slate-700 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedVerification(null)}
                  className="px-4 py-2 bg-slate-700 text-slate-300 font-medium rounded-lg hover:bg-slate-600 transition-colors"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  View Source
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
