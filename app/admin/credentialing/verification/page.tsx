"use client";

import { useState } from "react";
import { UserCheck, Search, CheckCircle, XCircle, Clock, AlertTriangle, RefreshCw, Eye, ExternalLink, Shield, FileText, Calendar, Hash, Building2 } from "lucide-react";
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

const initialVerifications: VerificationRecord[] = [
  { id: "VER-001", providerName: "Dr. Sarah Chen, MD", npi: "2345678901", verificationType: "Medical License", status: "verified", verifiedDate: "2026-02-15", expirationDate: "2027-12-31", source: "Ohio Medical Board", details: "License #MD-123456 Active", extendedDetails: { licenseNumber: "MD-123456", issueDate: "2015-06-15", disciplinaryActions: "None on record", restrictions: "None", verificationMethod: "Primary Source - State API", lastChecked: "2026-02-15 09:32:14 EST", rawResponse: "Status: ACTIVE | Type: MD | Specialty: Internal Medicine | Original Issue: 2015-06-15 | Expiration: 2027-12-31" } },
  { id: "VER-002", providerName: "Dr. Sarah Chen, MD", npi: "2345678901", verificationType: "DEA Registration", status: "verified", verifiedDate: "2026-02-15", expirationDate: "2027-06-30", source: "DEA NTIS", details: "DEA #AC1234567 Active", extendedDetails: { licenseNumber: "AC1234567", issueDate: "2016-07-01", disciplinaryActions: "None", restrictions: "Schedules II-V", verificationMethod: "DEA NTIS Database", lastChecked: "2026-02-15 09:33:02 EST", rawResponse: "DEA Number: AC1234567 | Status: ACTIVE | Schedules: 2,2N,3,3N,4,5 | Business Activity: Practitioner | State: OH" } },
  { id: "VER-003", providerName: "Dr. Sarah Chen, MD", npi: "2345678901", verificationType: "Board Certification", status: "verified", verifiedDate: "2026-02-15", expirationDate: "2028-12-31", source: "ABIM", details: "Internal Medicine - Certified", extendedDetails: { licenseNumber: "ABIM-789012", issueDate: "2018-08-01", disciplinaryActions: "None", restrictions: "None", verificationMethod: "ABIM Certification API", lastChecked: "2026-02-15 09:34:18 EST", rawResponse: "Certification: Internal Medicine | Status: Certified | MOC Status: Meeting Requirements | Initial Certification: 2018-08-01" } },
  { id: "VER-004", providerName: "Cleveland Family Medicine", npi: "1234567890", verificationType: "NPI Validation", status: "verified", verifiedDate: "2026-03-01", expirationDate: null, source: "NPPES", details: "Active Organization NPI", extendedDetails: { licenseNumber: "1234567890", issueDate: "2008-05-23", disciplinaryActions: "N/A", restrictions: "None", verificationMethod: "NPPES NPI Registry API", lastChecked: "2026-03-01 14:22:05 EST", rawResponse: "NPI: 1234567890 | Entity Type: Organization | Status: Active | Authorized Official: John Smith | Taxonomy: 207Q00000X (Family Medicine)" } },
  { id: "VER-005", providerName: "Cleveland Family Medicine", npi: "1234567890", verificationType: "Liability Insurance", status: "expiring", verifiedDate: "2025-04-01", expirationDate: "2026-04-01", source: "ProAssurance", details: "$1M/$3M Coverage - Expiring Soon", extendedDetails: { licenseNumber: "PA-2024-78901", issueDate: "2024-04-01", disciplinaryActions: "N/A", restrictions: "None", verificationMethod: "Insurance Certificate Upload", lastChecked: "2025-04-01 10:15:33 EST", rawResponse: "Policy: PA-2024-78901 | Coverage: $1,000,000/$3,000,000 | Effective: 2024-04-01 | Expiration: 2026-04-01 | Status: ACTIVE - RENEWAL REQUIRED" } },
  { id: "VER-006", providerName: "Dr. James Wilson, DO", npi: "5678901234", verificationType: "Medical License", status: "pending", verifiedDate: null, expirationDate: null, source: "Ohio Medical Board", details: "Verification in progress", extendedDetails: { verificationMethod: "Primary Source - Awaiting Response", lastChecked: "2026-03-20 08:45:00 EST", rawResponse: "Request submitted to Ohio Medical Board. Estimated response time: 2-3 business days." } },
  { id: "VER-007", providerName: "Dr. James Wilson, DO", npi: "5678901234", verificationType: "DEA Registration", status: "pending", verifiedDate: null, expirationDate: null, source: "DEA NTIS", details: "Verification in progress", extendedDetails: { verificationMethod: "DEA NTIS Database Query", lastChecked: "2026-03-20 08:45:15 EST", rawResponse: "Query pending - DEA number validation in progress." } },
  { id: "VER-008", providerName: "Metro Imaging Center", npi: "3456789012", verificationType: "Facility License", status: "verified", verifiedDate: "2026-01-20", expirationDate: "2027-01-31", source: "Ohio Dept of Health", details: "Diagnostic Imaging License Active", extendedDetails: { licenseNumber: "ODH-IMG-456789", issueDate: "2020-02-01", disciplinaryActions: "None", restrictions: "None", verificationMethod: "ODH License Verification Portal", lastChecked: "2026-01-20 11:08:44 EST", rawResponse: "License: ODH-IMG-456789 | Type: Diagnostic Imaging Facility | Status: ACTIVE | Last Inspection: 2025-11-15 | Result: No Deficiencies" } },
  { id: "VER-009", providerName: "Metro Imaging Center", npi: "3456789012", verificationType: "CLIA Certificate", status: "verified", verifiedDate: "2026-01-20", expirationDate: "2028-01-31", source: "CMS CLIA", details: "CLIA #12D3456789", extendedDetails: { licenseNumber: "12D3456789", issueDate: "2022-02-01", disciplinaryActions: "None", restrictions: "Waived Tests Only", verificationMethod: "CMS CLIA Database", lastChecked: "2026-01-20 11:10:22 EST", rawResponse: "CLIA ID: 12D3456789 | Certificate Type: Certificate of Waiver | Status: Active | Effective: 2022-02-01 | Expiration: 2028-01-31" } },
  { id: "VER-010", providerName: "Westlake Urgent Care", npi: "6789012345", verificationType: "Liability Insurance", status: "failed", verifiedDate: null, expirationDate: null, source: "Insurance Verification", details: "Policy expired - Awaiting renewal docs", extendedDetails: { licenseNumber: "EXPIRED", issueDate: "2023-03-01", disciplinaryActions: "N/A", restrictions: "COVERAGE LAPSED", verificationMethod: "Insurance Certificate Review", lastChecked: "2026-03-15 16:30:00 EST", rawResponse: "ERROR: Policy #INS-2023-34567 expired on 2026-03-01. No renewal documentation received. Provider notified on 2026-02-15, 2026-02-28, 2026-03-10." } },
  { id: "VER-011", providerName: "Quest Diagnostics Cleveland", npi: "8901234567", verificationType: "CLIA Certificate", status: "verified", verifiedDate: "2026-02-01", expirationDate: "2028-02-28", source: "CMS CLIA", details: "CLIA #12D7891234 - Full Service Lab", extendedDetails: { licenseNumber: "12D7891234", issueDate: "2024-03-01", disciplinaryActions: "None", restrictions: "None - Full Service", verificationMethod: "CMS CLIA Database", lastChecked: "2026-02-01 09:15:00 EST", rawResponse: "CLIA ID: 12D7891234 | Certificate Type: Certificate of Accreditation | Accreditation Org: CAP | Status: Active | Specialties: Chemistry, Hematology, Microbiology, Pathology" } },
  { id: "VER-012", providerName: "Cleveland Cardiology Associates", npi: "9012345678", verificationType: "Group Practice License", status: "verified", verifiedDate: "2026-01-15", expirationDate: "2027-12-31", source: "Ohio Medical Board", details: "Group Practice License Active", extendedDetails: { licenseNumber: "GPL-OH-123456", issueDate: "2019-01-01", disciplinaryActions: "None", restrictions: "None", verificationMethod: "Ohio Medical Board API", lastChecked: "2026-01-15 14:20:00 EST", rawResponse: "Group License: GPL-OH-123456 | Status: ACTIVE | Supervising Physicians: 4 | Allied Health Professionals: 8 | Locations: 2" } },
];

const statusOptions = ["All Statuses", "Verified", "Pending", "Failed", "Expiring"];
const typeOptions = ["All Types", "Medical License", "DEA Registration", "Board Certification", "NPI Validation", "Liability Insurance", "Facility License", "CLIA Certificate"];

export default function VerificationStatusPage() {
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [selectedVerification, setSelectedVerification] = useState<VerificationRecord | null>(null);
  const [verifications, setVerifications] = useState<VerificationRecord[]>(initialVerifications);
  const [reverifyingId, setReverifyingId] = useState<string | null>(null);
  const [showReverifySuccess, setShowReverifySuccess] = useState(false);

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
