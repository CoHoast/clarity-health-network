"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, Calendar, Search, Mail, FileText, CheckCircle, Clock, Send, X, Building2, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/admin/ThemeContext";

const expiringContracts = [
  { id: "CTR-001", provider: "Midwest Regional Medical", npi: "1234567890", specialty: "Hospital", expires: "2026-03-28", daysLeft: 12, discount: "35%", status: "renewal_sent", contactEmail: "contracts@midwestregional.com", lastContact: "2026-03-10" },
  { id: "CTR-002", provider: "Summit Health Specialists", npi: "2345678901", specialty: "Internal Medicine", expires: "2026-04-02", daysLeft: 17, discount: "30%", status: "pending_review", contactEmail: "admin@summithealth.com", lastContact: "2026-03-05" },
  { id: "CTR-003", provider: "Valley Care Associates", npi: "3456789012", specialty: "Family Medicine", expires: "2026-04-05", daysLeft: 20, discount: "40%", status: "not_started", contactEmail: "office@valleycare.com", lastContact: null },
  { id: "CTR-004", provider: "Premier Orthopedics", npi: "4567890123", specialty: "Orthopedics", expires: "2026-04-12", daysLeft: 27, discount: "28%", status: "renewal_sent", contactEmail: "billing@premierortho.com", lastContact: "2026-03-08" },
  { id: "CTR-005", provider: "Citywide Imaging Center", npi: "5678901234", specialty: "Diagnostic Imaging", expires: "2026-04-15", daysLeft: 30, discount: "45%", status: "not_started", contactEmail: "contracts@citywideimaging.com", lastContact: null },
  { id: "CTR-006", provider: "Lakeside Cardiology", npi: "6789012345", specialty: "Cardiology", expires: "2026-04-18", daysLeft: 33, discount: "32%", status: "negotiating", contactEmail: "admin@lakesidecardio.com", lastContact: "2026-03-14" },
  { id: "CTR-007", provider: "North Shore Labs", npi: "7890123456", specialty: "Laboratory", expires: "2026-04-22", daysLeft: 37, discount: "48%", status: "pending_review", contactEmail: "contracts@northshorelabs.com", lastContact: "2026-03-12" },
  { id: "CTR-008", provider: "Community Urgent Care", npi: "8901234567", specialty: "Urgent Care", expires: "2026-04-25", daysLeft: 40, discount: "25%", status: "not_started", contactEmail: "manager@communityuc.com", lastContact: null },
  { id: "CTR-009", provider: "Wellness Physical Therapy", npi: "9012345678", specialty: "Physical Therapy", expires: "2026-04-28", daysLeft: 43, discount: "30%", status: "renewal_sent", contactEmail: "office@wellnesspt.com", lastContact: "2026-03-15" },
  { id: "CTR-010", provider: "Metro Dermatology Group", npi: "0123456789", specialty: "Dermatology", expires: "2026-05-01", daysLeft: 46, discount: "35%", status: "not_started", contactEmail: "admin@metroderm.com", lastContact: null },
];

const filterOptions = ["All", "30 Days", "60 Days", "90 Days"];
const statusOptions = ["All Statuses", "Not Started", "Renewal Sent", "Pending Review", "Negotiating"];

export default function ExpiringContractsPage() {
  const { isDark } = useTheme();
  const [filter, setFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContract, setSelectedContract] = useState<typeof expiringContracts[0] | null>(null);
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [renewalContract, setRenewalContract] = useState<typeof expiringContracts[0] | null>(null);

  const filteredContracts = expiringContracts.filter(contract => {
    const matchesSearch = contract.provider.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         contract.npi.includes(searchQuery);
    const matchesDays = filter === "All" || 
                       (filter === "30 Days" && contract.daysLeft <= 30) ||
                       (filter === "60 Days" && contract.daysLeft <= 60) ||
                       (filter === "90 Days" && contract.daysLeft <= 90);
    const matchesStatus = statusFilter === "All Statuses" ||
                         (statusFilter === "Not Started" && contract.status === "not_started") ||
                         (statusFilter === "Renewal Sent" && contract.status === "renewal_sent") ||
                         (statusFilter === "Pending Review" && contract.status === "pending_review") ||
                         (statusFilter === "Negotiating" && contract.status === "negotiating");
    return matchesSearch && matchesDays && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "renewal_sent": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs font-medium rounded-full"><Send className="w-3 h-3" />Renewal Sent</span>;
      case "pending_review": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full"><Clock className="w-3 h-3" />Pending Review</span>;
      case "negotiating": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-400 text-xs font-medium rounded-full"><FileText className="w-3 h-3" />Negotiating</span>;
      case "not_started": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-500/20 text-slate-400 text-xs font-medium rounded-full"><AlertTriangle className="w-3 h-3" />Not Started</span>;
      default: return null;
    }
  };

  const getDaysLeftColor = (days: number) => {
    if (days <= 14) return "text-red-400";
    if (days <= 30) return "text-amber-400";
    return "text-slate-300";
  };

  const openRenewalModal = (contract: typeof expiringContracts[0]) => {
    setRenewalContract(contract);
    setShowRenewalModal(true);
  };

  const urgentCount = expiringContracts.filter(c => c.daysLeft <= 30).length;
  const notStartedCount = expiringContracts.filter(c => c.status === "not_started").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <AlertTriangle className="w-7 h-7 text-amber-500" />
            Expiring Contracts
          </h1>
          <p className="text-slate-400 mt-1">{urgentCount} contracts expiring within 30 days • {notStartedCount} need attention</p>
        </div>
      </div>

      {/* Stats - Theme Aware */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Next 14 Days", count: expiringContracts.filter(c => c.daysLeft <= 14).length, urgent: true },
          { label: "15-30 Days", count: expiringContracts.filter(c => c.daysLeft > 14 && c.daysLeft <= 30).length, urgent: false },
          { label: "31-60 Days", count: expiringContracts.filter(c => c.daysLeft > 30 && c.daysLeft <= 60).length, urgent: false },
          { label: "61-90 Days", count: expiringContracts.filter(c => c.daysLeft > 60 && c.daysLeft <= 90).length, urgent: false },
        ].map((stat) => (
          <div 
            key={stat.label} 
            className={`rounded-xl p-5 shadow-lg ${
              isDark 
                ? 'bg-slate-950 border border-slate-800'
                : 'bg-slate-800 border border-slate-700'
            }`}
          >
            <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-white'}`}>{stat.count}</p>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-cyan-100'}`}>{stat.label}</p>
          </div>
        ))}
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
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          {filterOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          {statusOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      {/* Contracts Table */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Provider</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Expires</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Days Left</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Current Discount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredContracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-white font-medium">{contract.provider}</p>
                      <p className="text-slate-400 text-sm">{contract.specialty} • NPI: {contract.npi}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-300">{contract.expires}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-semibold ${getDaysLeftColor(contract.daysLeft)}`}>
                      {contract.daysLeft} days
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-green-400 font-medium">{contract.discount}</span>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(contract.status)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {contract.status === "not_started" && (
                        <button
                          onClick={() => openRenewalModal(contract)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors"
                        >
                          <Send className="w-4 h-4" />
                          Send Renewal
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedContract(contract)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-700 text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-600 transition-colors"
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Send Renewal Modal */}
      <AnimatePresence>
        {showRenewalModal && renewalContract && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowRenewalModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-800 rounded-xl max-w-lg w-full border border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-700">
                <h2 className="text-xl font-bold text-white">Send Renewal Notice</h2>
                <p className="text-slate-400 mt-1">Send contract renewal to {renewalContract.provider}</p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Recipient Email</label>
                  <input
                    type="email"
                    defaultValue={renewalContract.contactEmail}
                    className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Proposed New Terms</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">New End Date</label>
                      <input
                        type="date"
                        defaultValue="2029-04-01"
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">New Discount</label>
                      <input
                        type="text"
                        defaultValue={renewalContract.discount}
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Additional Message (Optional)</label>
                  <textarea
                    rows={3}
                    placeholder="Add a personal note to the renewal notice..."
                    className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div className="p-6 border-t border-slate-700 flex justify-end gap-3">
                <button
                  onClick={() => setShowRenewalModal(false)}
                  className="px-4 py-2 bg-slate-700 text-slate-300 font-medium rounded-lg hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowRenewalModal(false);
                    // Show success toast
                  }}
                  className="px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Renewal Notice
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
