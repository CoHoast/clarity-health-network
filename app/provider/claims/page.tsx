"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileSearch,
  Search,
  Filter,
  Download,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Calendar,
  DollarSign,
  RefreshCw,
  Eye,
  FileText,
  X,
  Send,
  Upload,
} from "lucide-react";

const claims = [
  { id: "CLM-2024-156", patient: "John Doe", patientId: "CHN-123456", service: "99213 - Office Visit", dos: "Mar 12, 2024", submitted: "Mar 12, 2024", billed: 92, allowed: 92, paid: 92, status: "paid", paidDate: "Mar 14, 2024", checkNumber: "123456789" },
  { id: "CLM-2024-155", patient: "Sarah Miller", patientId: "CHN-234567", service: "99203 - New Patient", dos: "Mar 11, 2024", submitted: "Mar 11, 2024", billed: 112, allowed: null, paid: null, status: "processing", paidDate: null },
  { id: "CLM-2024-154", patient: "Mike Roberts", patientId: "CHN-345678", service: "99214 - Office Visit", dos: "Mar 10, 2024", submitted: "Mar 10, 2024", billed: 138, allowed: 138, paid: 138, status: "paid", paidDate: "Mar 13, 2024", checkNumber: "123456788" },
  { id: "CLM-2024-153", patient: "Lisa Kim", patientId: "CHN-456789", service: "99395 - Wellness Visit", dos: "Mar 10, 2024", submitted: "Mar 10, 2024", billed: 175, allowed: null, paid: null, status: "pending", paidDate: null },
  { id: "CLM-2024-152", patient: "Tom Brown", patientId: "CHN-567890", service: "99213 - Office Visit", dos: "Mar 9, 2024", submitted: "Mar 9, 2024", billed: 92, allowed: 0, paid: 0, status: "denied", paidDate: null, denialReason: "Missing modifier - 25", denialCode: "CO-4" },
  { id: "CLM-2024-151", patient: "Emma Wilson", patientId: "CHN-678901", service: "99215 - Complex Visit", dos: "Mar 8, 2024", submitted: "Mar 8, 2024", billed: 186, allowed: 186, paid: 186, status: "paid", paidDate: "Mar 12, 2024", checkNumber: "123456787" },
  { id: "CLM-2024-150", patient: "James Lee", patientId: "CHN-789012", service: "99213 - Office Visit", dos: "Mar 8, 2024", submitted: "Mar 8, 2024", billed: 92, allowed: 92, paid: 92, status: "paid", paidDate: "Mar 11, 2024", checkNumber: "123456786" },
  { id: "CLM-2024-149", patient: "Anna Garcia", patientId: "CHN-890123", service: "99204 - New Patient", dos: "Mar 7, 2024", submitted: "Mar 7, 2024", billed: 172, allowed: 172, paid: 172, status: "paid", paidDate: "Mar 10, 2024", checkNumber: "123456785" },
];

const statusFilters = [
  { label: "All", value: "all", count: claims.length },
  { label: "Paid", value: "paid", count: claims.filter(c => c.status === "paid").length },
  { label: "Processing", value: "processing", count: claims.filter(c => c.status === "processing").length },
  { label: "Pending", value: "pending", count: claims.filter(c => c.status === "pending").length },
  { label: "Denied", value: "denied", count: claims.filter(c => c.status === "denied").length },
];

export default function ClaimsPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClaim, setSelectedClaim] = useState<typeof claims[0] | null>(null);
  const [showAppealModal, setShowAppealModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [appealSubmitted, setAppealSubmitted] = useState(false);
  const [exportStarted, setExportStarted] = useState(false);

  const filteredClaims = claims.filter(claim => {
    const matchesStatus = statusFilter === "all" || claim.status === statusFilter;
    const matchesSearch = claim.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          claim.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Paid</span>;
      case "processing":
        return <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full flex items-center gap-1"><RefreshCw className="w-3 h-3" /> Processing</span>;
      case "pending":
        return <span className="px-2 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>;
      case "denied":
        return <span className="px-2 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-full flex items-center gap-1"><XCircle className="w-3 h-3" /> Denied</span>;
      default:
        return null;
    }
  };

  const totals = {
    billed: filteredClaims.reduce((sum, c) => sum + c.billed, 0),
    paid: filteredClaims.reduce((sum, c) => sum + (c.paid || 0), 0),
  };

  const handleAppeal = () => {
    setAppealSubmitted(true);
    setTimeout(() => {
      setShowAppealModal(false);
      setAppealSubmitted(false);
      setSelectedClaim(null);
    }, 2000);
  };

  const handleExport = () => {
    setExportStarted(true);
    setTimeout(() => {
      setShowExportModal(false);
      setExportStarted(false);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Claim Status</h1>
          <p className="text-gray-500 mt-1">Track and manage your submitted claims</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowExportModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <Link
            href="/provider/submit-claim"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
          >
            Submit Claim
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Billed</p>
          <p className="text-2xl font-bold text-gray-900">${totals.billed.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Paid</p>
          <p className="text-2xl font-bold text-green-600">${totals.paid.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-amber-600">{claims.filter(c => c.status === "pending" || c.status === "processing").length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Denied</p>
          <p className="text-2xl font-bold text-red-600">{claims.filter(c => c.status === "denied").length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by patient name or claim ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                statusFilter === filter.value
                  ? "bg-slate-700 text-white"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
      </div>

      {/* Claims Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Claim</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">DOS</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Billed</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Paid</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredClaims.map((claim) => (
                <tr 
                  key={claim.id} 
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedClaim(claim)}
                >
                  <td className="px-6 py-4 font-mono text-sm text-gray-900">{claim.id}</td>
                  <td className="px-6 py-4 text-gray-900">{claim.patient}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{claim.service}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{claim.dos}</td>
                  <td className="px-6 py-4">{getStatusBadge(claim.status)}</td>
                  <td className="px-6 py-4 text-right font-medium">${claim.billed}</td>
                  <td className="px-6 py-4 text-right font-medium text-green-600">
                    {claim.paid !== null ? `$${claim.paid}` : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-2 text-gray-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredClaims.length === 0 && (
          <div className="py-12 text-center">
            <FileSearch className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No claims found</p>
          </div>
        )}
      </div>

      {/* Claim Detail Modal */}
      <AnimatePresence>
        {selectedClaim && !showAppealModal && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedClaim(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Claim Details</h3>
                  <p className="text-sm text-gray-500">{selectedClaim.id}</p>
                </div>
                <button onClick={() => setSelectedClaim(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Status */}
                <div className="flex items-center gap-3">
                  {getStatusBadge(selectedClaim.status)}
                  {selectedClaim.checkNumber && (
                    <span className="text-sm text-gray-500">Check #: {selectedClaim.checkNumber}</span>
                  )}
                </div>

                {/* Patient & Service Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Patient</p>
                    <p className="font-medium text-gray-900">{selectedClaim.patient}</p>
                    <p className="text-sm text-gray-500 font-mono">{selectedClaim.patientId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date of Service</p>
                    <p className="font-medium text-gray-900">{selectedClaim.dos}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Service</p>
                    <p className="font-medium text-gray-900">{selectedClaim.service}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Submitted</p>
                    <p className="font-medium text-gray-900">{selectedClaim.submitted}</p>
                  </div>
                  {selectedClaim.paidDate && (
                    <div>
                      <p className="text-sm text-gray-500">Paid Date</p>
                      <p className="font-medium text-gray-900">{selectedClaim.paidDate}</p>
                    </div>
                  )}
                </div>

                {/* Amounts */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Billed Amount</span>
                    <span className="font-medium text-gray-900">${selectedClaim.billed}</span>
                  </div>
                  {selectedClaim.allowed !== null && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Allowed Amount</span>
                      <span className="text-gray-900">${selectedClaim.allowed}</span>
                    </div>
                  )}
                  {selectedClaim.paid !== null && (
                    <>
                      <hr className="border-gray-200" />
                      <div className="flex justify-between text-lg">
                        <span className="font-medium text-gray-900">Paid Amount</span>
                        <span className={`font-bold ${selectedClaim.paid > 0 ? "text-green-600" : "text-red-600"}`}>
                          ${selectedClaim.paid}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Denial Reason */}
                {selectedClaim.status === "denied" && selectedClaim.denialReason && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                      <div>
                        <p className="font-medium text-red-900">Claim Denied</p>
                        <p className="text-sm text-red-700">{selectedClaim.denialReason}</p>
                        {selectedClaim.denialCode && (
                          <p className="text-sm text-red-600 mt-1">Code: {selectedClaim.denialCode}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
                {selectedClaim.status === "denied" && (
                  <button
                    onClick={() => setShowAppealModal(true)}
                    className="flex-1 px-4 py-2.5 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    File Appeal
                  </button>
                )}
                {selectedClaim.status === "paid" && (
                  <Link
                    href="/docs/eob"
                    className="flex-1 px-4 py-2.5 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors text-center flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download ERA
                  </Link>
                )}
                <button
                  onClick={() => setSelectedClaim(null)}
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Appeal Modal */}
      <AnimatePresence>
        {showAppealModal && selectedClaim && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAppealModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {appealSubmitted ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Appeal Submitted!</h3>
                  <p className="text-gray-600">Your appeal for {selectedClaim.id} has been submitted successfully.</p>
                </div>
              ) : (
                <>
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">File Appeal</h3>
                    <p className="text-sm text-gray-500">{selectedClaim.id} - {selectedClaim.patient}</p>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-700">
                        <strong>Denial:</strong> {selectedClaim.denialReason}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Appeal Reason</label>
                      <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500">
                        <option>Missing documentation now provided</option>
                        <option>Coding error corrected</option>
                        <option>Medical necessity documentation</option>
                        <option>Modifier added/corrected</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Supporting Notes</label>
                      <textarea
                        rows={3}
                        placeholder="Explain your appeal..."
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none"
                      />
                    </div>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Drag & drop supporting documents</p>
                      <p className="text-xs text-gray-400">PDF, JPG, PNG up to 10MB</p>
                    </div>
                  </div>
                  <div className="px-6 pb-6 flex gap-3">
                    <button
                      onClick={() => setShowAppealModal(false)}
                      className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAppeal}
                      className="flex-1 px-4 py-2.5 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      Submit Appeal
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Export Modal */}
      <AnimatePresence>
        {showExportModal && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowExportModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {exportStarted ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Export Started!</h3>
                  <p className="text-gray-600">Your report is being generated and will download shortly.</p>
                </div>
              ) : (
                <>
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">Export Claims</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                      <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500">
                        <option>Last 30 days</option>
                        <option>Last 60 days</option>
                        <option>Last 90 days</option>
                        <option>Year to date</option>
                        <option>Custom range</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                      <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500">
                        <option>CSV</option>
                        <option>Excel (XLSX)</option>
                        <option>PDF Report</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status Filter</label>
                      <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500">
                        <option>All statuses</option>
                        <option>Paid only</option>
                        <option>Denied only</option>
                        <option>Pending/Processing</option>
                      </select>
                    </div>
                  </div>
                  <div className="px-6 pb-6 flex gap-3">
                    <button
                      onClick={() => setShowExportModal(false)}
                      className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleExport}
                      className="flex-1 px-4 py-2.5 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
