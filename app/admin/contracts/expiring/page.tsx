"use client";

import { useState } from "react";
import { AlertTriangle, Calendar, Search, Mail, FileText, CheckCircle, Clock, Send, X, Building2, ChevronDown, Phone, MapPin, DollarSign, Download, Eye, File } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/admin/ThemeContext";

const expiringContracts = [
  { id: "CTR-001", provider: "Midwest Regional Medical", npi: "1234567890", specialty: "Hospital", expires: "2026-03-28", daysLeft: 12, discount: "35%", status: "renewal_sent", contactEmail: "contracts@midwestregional.com", lastContact: "2026-03-10", startDate: "2023-04-01", termLength: "3 years", rateType: "% of Medicare", rateValue: "140%", address: "1500 Medical Center Blvd, Cleveland, OH 44106", phone: "(XXX) XXX-4567", contractFile: "midwest-regional-agreement.pdf" },
  { id: "CTR-002", provider: "Summit Health Specialists", npi: "2345678901", specialty: "Internal Medicine", expires: "2026-04-02", daysLeft: 17, discount: "30%", status: "pending_review", contactEmail: "admin@summithealth.com", lastContact: "2026-03-05", startDate: "2023-04-15", termLength: "3 years", rateType: "% of Billed", rateValue: "70%", address: "2345 Summit Ave, Suite 200, Cleveland, OH 44114", phone: "(XXX) XXX-5678", contractFile: "summit-health-agreement.pdf" },
  { id: "CTR-003", provider: "Valley Care Associates", npi: "3456789012", specialty: "Family Medicine", expires: "2026-04-05", daysLeft: 20, discount: "40%", status: "not_started", contactEmail: "office@valleycare.com", lastContact: null, startDate: "2023-04-20", termLength: "3 years", rateType: "Fee Schedule", rateValue: "Custom", address: "456 Valley View Dr, Parma, OH 44129", phone: "(XXX) XXX-6789", contractFile: "valley-care-agreement.pdf" },
  { id: "CTR-004", provider: "Premier Orthopedics", npi: "4567890123", specialty: "Orthopedics", expires: "2026-04-12", daysLeft: 27, discount: "28%", status: "renewal_sent", contactEmail: "billing@premierortho.com", lastContact: "2026-03-08", startDate: "2023-04-25", termLength: "3 years", rateType: "% of Medicare", rateValue: "150%", address: "789 Premier Way, Westlake, OH 44145", phone: "(XXX) XXX-7890", contractFile: "premier-ortho-agreement.pdf" },
  { id: "CTR-005", provider: "Citywide Imaging Center", npi: "5678901234", specialty: "Diagnostic Imaging", expires: "2026-04-15", daysLeft: 30, discount: "45%", status: "not_started", contactEmail: "contracts@citywideimaging.com", lastContact: null, startDate: "2023-05-01", termLength: "3 years", rateType: "% of Billed", rateValue: "55%", address: "890 Imaging Blvd, Cleveland, OH 44115", phone: "(XXX) XXX-8901", contractFile: null },
  { id: "CTR-006", provider: "Lakeside Cardiology", npi: "6789012345", specialty: "Cardiology", expires: "2026-04-18", daysLeft: 33, discount: "32%", status: "negotiating", contactEmail: "admin@lakesidecardio.com", lastContact: "2026-03-14", startDate: "2023-05-10", termLength: "3 years", rateType: "% of Medicare", rateValue: "145%", address: "234 Lakeside Dr, Rocky River, OH 44116", phone: "(XXX) XXX-9012", contractFile: "lakeside-cardio-agreement.pdf" },
  { id: "CTR-007", provider: "North Shore Labs", npi: "7890123456", specialty: "Laboratory", expires: "2026-04-22", daysLeft: 37, discount: "48%", status: "pending_review", contactEmail: "contracts@northshorelabs.com", lastContact: "2026-03-12", startDate: "2023-05-15", termLength: "3 years", rateType: "Fee Schedule", rateValue: "Custom", address: "567 North Shore Pkwy, Euclid, OH 44123", phone: "(XXX) XXX-0123", contractFile: "north-shore-labs-agreement.pdf" },
  { id: "CTR-008", provider: "Community Urgent Care", npi: "8901234567", specialty: "Urgent Care", expires: "2026-04-25", daysLeft: 40, discount: "25%", status: "not_started", contactEmail: "manager@communityuc.com", lastContact: null, startDate: "2023-05-20", termLength: "3 years", rateType: "% of Medicare", rateValue: "135%", address: "678 Community Center Rd, Brook Park, OH 44142", phone: "(XXX) XXX-1234", contractFile: null },
  { id: "CTR-009", provider: "Wellness Physical Therapy", npi: "9012345678", specialty: "Physical Therapy", expires: "2026-04-28", daysLeft: 43, discount: "30%", status: "renewal_sent", contactEmail: "office@wellnesspt.com", lastContact: "2026-03-15", startDate: "2023-06-01", termLength: "3 years", rateType: "% of Medicare", rateValue: "125%", address: "901 Wellness Way, Strongsville, OH 44136", phone: "(XXX) XXX-2345", contractFile: "wellness-pt-agreement.pdf" },
  { id: "CTR-010", provider: "Metro Dermatology Group", npi: "0123456789", specialty: "Dermatology", expires: "2026-05-01", daysLeft: 46, discount: "35%", status: "not_started", contactEmail: "admin@metroderm.com", lastContact: null, startDate: "2023-06-10", termLength: "3 years", rateType: "% of Billed", rateValue: "65%", address: "234 Metro Plaza, Independence, OH 44131", phone: "(XXX) XXX-3456", contractFile: "metro-derm-agreement.pdf" },
];

const filterOptions = ["All", "30 Days", "60 Days", "90 Days"];
const statusOptions = ["All Statuses", "Not Started", "Renewal Sent", "Pending Review", "Negotiating"];

export default function ExpiringContractsPage() {
  const { isDark, mounted } = useTheme();
  const [filter, setFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContract, setSelectedContract] = useState<typeof expiringContracts[0] | null>(null);
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [renewalContract, setRenewalContract] = useState<typeof expiringContracts[0] | null>(null);
  const [showContractViewer, setShowContractViewer] = useState(false);
  const [viewingContract, setViewingContract] = useState<typeof expiringContracts[0] | null>(null);

  const openContractViewer = (contract: typeof expiringContracts[0]) => {
    setViewingContract(contract);
    setShowContractViewer(true);
  };

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
    const baseClasses = "inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full";
    switch (status) {
      case "renewal_sent": return <span className={`${baseClasses} ${isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-700"}`}><Send className="w-3 h-3" />Renewal Sent</span>;
      case "pending_review": return <span className={`${baseClasses} ${isDark ? "bg-amber-500/20 text-amber-400" : "bg-amber-100 text-amber-700"}`}><Clock className="w-3 h-3" />Pending Review</span>;
      case "negotiating": return <span className={`${baseClasses} ${isDark ? "bg-purple-500/20 text-purple-400" : "bg-purple-100 text-purple-700"}`}><FileText className="w-3 h-3" />Negotiating</span>;
      case "not_started": return <span className={`${baseClasses} ${isDark ? "bg-slate-500/20 text-slate-400" : "bg-slate-100 text-slate-600"}`}><AlertTriangle className="w-3 h-3" />Not Started</span>;
      default: return null;
    }
  };

  const getDaysLeftColor = (days: number) => {
    if (days <= 14) return isDark ? "text-red-400" : "text-red-600";
    if (days <= 30) return isDark ? "text-amber-400" : "text-amber-600";
    return isDark ? "text-slate-300" : "text-slate-600";
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
          <h1 className={`text-2xl font-bold flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <AlertTriangle className="w-7 h-7 text-amber-500" />
            Expiring Contracts
          </h1>
          <p className={isDark ? "text-slate-400" : "text-slate-500"} style={{ marginTop: '0.25rem' }}>{urgentCount} contracts expiring within 30 days • {notStartedCount} need attention</p>
        </div>
      </div>

      {/* Stats - Theme Aware */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {!mounted ? (
          // Skeleton loading state
          <>
            {[1,2,3,4].map(i => (
              <div key={i} className="rounded-xl p-5 animate-pulse bg-slate-200 border border-slate-300">
                <div className="h-8 w-12 bg-slate-300 rounded mb-2" />
                <div className="h-4 w-20 bg-slate-300 rounded" />
              </div>
            ))}
          </>
        ) : (
          [
            { label: "Next 14 Days", count: expiringContracts.filter(c => c.daysLeft <= 14).length },
            { label: "15-30 Days", count: expiringContracts.filter(c => c.daysLeft > 14 && c.daysLeft <= 30).length },
            { label: "31-60 Days", count: expiringContracts.filter(c => c.daysLeft > 30 && c.daysLeft <= 60).length },
            { label: "61-90 Days", count: expiringContracts.filter(c => c.daysLeft > 60 && c.daysLeft <= 90).length },
          ].map((stat) => (
            <div 
              key={stat.label} 
              className={`rounded-xl p-5 shadow-sm ${
                isDark 
                  ? "bg-slate-800 border border-slate-700" 
                  : "bg-white border border-slate-200"
              }`}
            >
              <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stat.count}</p>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{stat.label}</p>
            </div>
          ))
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
          <input
            type="text"
            placeholder="Search by provider or NPI..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDark 
                ? "bg-slate-800 border border-slate-600 text-white placeholder:text-slate-400" 
                : "bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400"
            }`}
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={`px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isDark 
              ? "bg-slate-800 border border-slate-600 text-white" 
              : "bg-white border border-slate-200 text-slate-900"
          }`}
        >
          {filterOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={`px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isDark 
              ? "bg-slate-800 border border-slate-600 text-white" 
              : "bg-white border border-slate-200 text-slate-900"
          }`}
        >
          {statusOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      {/* Contracts Table */}
      <div className={`rounded-xl border overflow-hidden ${isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200"}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={isDark ? "border-b border-slate-700" : "border-b border-slate-200 bg-slate-50"}>
                <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>Provider</th>
                <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>Expires</th>
                <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>Days Left</th>
                <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>Current Discount</th>
                <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>Status</th>
                <th className={`px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>Actions</th>
              </tr>
            </thead>
            <tbody className={isDark ? "divide-y divide-slate-700" : "divide-y divide-slate-100"}>
              {filteredContracts.map((contract) => (
                <tr key={contract.id} className={isDark ? "hover:bg-slate-700/30" : "hover:bg-slate-50"} style={{ transition: 'background-color 0.15s' }}>
                  <td className="px-6 py-4">
                    <div>
                      <p className={`font-medium ${isDark ? "text-white" : "text-slate-900"}`}>{contract.provider}</p>
                      <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>{contract.specialty} • NPI: {contract.npi}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={isDark ? "text-slate-300" : "text-slate-600"}>{contract.expires}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-semibold ${getDaysLeftColor(contract.daysLeft)}`}>
                      {contract.daysLeft} days
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={isDark ? "text-green-400" : "text-green-600"} style={{ fontWeight: 500 }}>{contract.discount}</span>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(contract.status)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {contract.status === "not_started" && (
                        <button
                          onClick={() => openRenewalModal(contract)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-colors"
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

      {/* Contract Details Slide-Over */}
      <AnimatePresence>
        {selectedContract && (
          <div className="fixed inset-0 bg-black/50 flex justify-end z-50" onClick={() => setSelectedContract(null)}>
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`w-full max-w-lg h-full overflow-y-auto ${isDark ? "bg-slate-800" : "bg-white"}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className={`sticky top-0 z-10 p-6 border-b ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Contract Details</h2>
                    <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>{selectedContract.id}</p>
                  </div>
                  <button
                    onClick={() => setSelectedContract(null)}
                    className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-slate-700 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Provider Info */}
                <div className={`p-4 rounded-xl ${isDark ? "bg-slate-700/50" : "bg-slate-50"}`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? "bg-blue-500/20" : "bg-blue-100"}`}>
                      <Building2 className={`w-6 h-6 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>{selectedContract.provider}</h3>
                      <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>{selectedContract.specialty}</p>
                      <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>NPI: {selectedContract.npi}</p>
                    </div>
                  </div>
                </div>

                {/* Contract Status */}
                <div>
                  <h4 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Renewal Status</h4>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(selectedContract.status)}
                  </div>
                </div>

                {/* Contract Terms Grid */}
                <div>
                  <h4 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Contract Terms</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className={`p-3 rounded-xl ${isDark ? "bg-slate-700/50" : "bg-slate-50"}`}>
                      <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>Start Date</p>
                      <p className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>{selectedContract.startDate}</p>
                    </div>
                    <div className={`p-3 rounded-xl ${isDark ? "bg-slate-700/50" : "bg-slate-50"}`}>
                      <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>Expiration Date</p>
                      <p className={`font-semibold ${getDaysLeftColor(selectedContract.daysLeft)}`}>{selectedContract.expires}</p>
                    </div>
                    <div className={`p-3 rounded-xl ${isDark ? "bg-slate-700/50" : "bg-slate-50"}`}>
                      <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>Term Length</p>
                      <p className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>{selectedContract.termLength}</p>
                    </div>
                    <div className={`p-3 rounded-xl ${isDark ? "bg-slate-700/50" : "bg-slate-50"}`}>
                      <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>Days Remaining</p>
                      <p className={`font-semibold ${getDaysLeftColor(selectedContract.daysLeft)}`}>{selectedContract.daysLeft} days</p>
                    </div>
                  </div>
                </div>

                {/* Pricing Terms */}
                <div>
                  <h4 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Pricing Terms</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className={`p-3 rounded-xl ${isDark ? "bg-slate-700/50" : "bg-slate-50"}`}>
                      <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>Rate Type</p>
                      <p className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>{selectedContract.rateType}</p>
                    </div>
                    <div className={`p-3 rounded-xl ${isDark ? "bg-slate-700/50" : "bg-slate-50"}`}>
                      <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>Rate Value</p>
                      <p className={`font-semibold ${isDark ? "text-green-400" : "text-green-600"}`}>{selectedContract.rateValue}</p>
                    </div>
                    <div className={`p-3 rounded-xl col-span-2 ${isDark ? "bg-slate-700/50" : "bg-slate-50"}`}>
                      <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>Discount from Billed</p>
                      <p className={`font-semibold ${isDark ? "text-green-400" : "text-green-600"}`}>{selectedContract.discount}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div>
                  <h4 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Contact Information</h4>
                  <div className="space-y-2">
                    <div className={`p-3 rounded-xl flex items-center gap-3 ${isDark ? "bg-slate-700/50" : "bg-slate-50"}`}>
                      <MapPin className={`w-4 h-4 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
                      <span className={isDark ? "text-slate-300" : "text-slate-700"}>{selectedContract.address}</span>
                    </div>
                    <div className={`p-3 rounded-xl flex items-center gap-3 ${isDark ? "bg-slate-700/50" : "bg-slate-50"}`}>
                      <Phone className={`w-4 h-4 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
                      <span className={isDark ? "text-slate-300" : "text-slate-700"}>{selectedContract.phone}</span>
                    </div>
                    <div className={`p-3 rounded-xl flex items-center gap-3 ${isDark ? "bg-slate-700/50" : "bg-slate-50"}`}>
                      <Mail className={`w-4 h-4 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
                      <a href={`mailto:${selectedContract.contactEmail}`} className={`${isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"}`}>
                        {selectedContract.contactEmail}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Contract File */}
                <div>
                  <h4 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Contract Document</h4>
                  {selectedContract.contractFile ? (
                    <div className={`p-3 rounded-xl flex items-center justify-between ${isDark ? "bg-slate-700/50" : "bg-slate-50"}`}>
                      <div className="flex items-center gap-3">
                        <File className={`w-5 h-5 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
                        <span className={isDark ? "text-slate-300" : "text-slate-700"}>{selectedContract.contractFile}</span>
                      </div>
                      <button className={`p-2 rounded-lg ${isDark ? "hover:bg-slate-600" : "hover:bg-slate-200"}`}>
                        <Download className={`w-4 h-4 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
                      </button>
                    </div>
                  ) : (
                    <div className={`p-4 rounded-xl border-2 border-dashed text-center ${isDark ? "border-slate-600" : "border-slate-300"}`}>
                      <FileText className={`w-6 h-6 mx-auto mb-2 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                      <p className={`text-sm ${isDark ? "text-slate-500" : "text-slate-400"}`}>No contract document uploaded</p>
                    </div>
                  )}
                </div>

                {/* Last Contact */}
                <div className={`p-3 rounded-xl ${isDark ? "bg-slate-700/50" : "bg-slate-50"}`}>
                  <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>Last Contact</p>
                  <p className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>{selectedContract.lastContact || "No previous contact"}</p>
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-4">
                  {selectedContract.status === "not_started" && (
                    <button
                      onClick={() => {
                        setSelectedContract(null);
                        openRenewalModal(selectedContract);
                      }}
                      className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-colors flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(59,130,246,0.3)]"
                    >
                      <Send className="w-5 h-5" />
                      Send Renewal Notice
                    </button>
                  )}
                  <button
                    onClick={() => {
                      openContractViewer(selectedContract);
                    }}
                    className={`w-full px-4 py-3 font-medium rounded-xl transition-colors flex items-center justify-center gap-2 ${
                      isDark 
                        ? "bg-slate-700 text-slate-300 hover:bg-slate-600" 
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    <Eye className="w-5 h-5" />
                    View Full Contract
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Send Renewal Modal */}
      <AnimatePresence>
        {showRenewalModal && renewalContract && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowRenewalModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`rounded-xl max-w-lg w-full ${isDark ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-200"}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`p-6 border-b ${isDark ? "border-slate-700" : "border-slate-200"}`}>
                <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Send Renewal Notice</h2>
                <p className={isDark ? "text-slate-400" : "text-slate-500"} style={{ marginTop: '0.25rem' }}>Send contract renewal to {renewalContract.provider}</p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>Recipient Email</label>
                  <input
                    type="email"
                    defaultValue={renewalContract.contactEmail}
                    className={`w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDark ? "bg-slate-700 border border-slate-600 text-white" : "bg-white border border-slate-200 text-slate-900"
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>Proposed New Terms</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-xs mb-1 ${isDark ? "text-slate-500" : "text-slate-400"}`}>New End Date</label>
                      <input
                        type="date"
                        defaultValue="2029-04-01"
                        className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isDark ? "bg-slate-700 border border-slate-600 text-white" : "bg-white border border-slate-200 text-slate-900"
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-xs mb-1 ${isDark ? "text-slate-500" : "text-slate-400"}`}>New Discount</label>
                      <input
                        type="text"
                        defaultValue={renewalContract.discount}
                        className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isDark ? "bg-slate-700 border border-slate-600 text-white" : "bg-white border border-slate-200 text-slate-900"
                        }`}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>Additional Message (Optional)</label>
                  <textarea
                    rows={3}
                    placeholder="Add a personal note to the renewal notice..."
                    className={`w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDark ? "bg-slate-700 border border-slate-600 text-white placeholder:text-slate-500" : "bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400"
                    }`}
                  />
                </div>
              </div>
              <div className={`p-6 border-t flex justify-end gap-3 ${isDark ? "border-slate-700" : "border-slate-200"}`}>
                <button
                  onClick={() => setShowRenewalModal(false)}
                  className={`px-4 py-2 font-medium rounded-lg transition-colors ${
                    isDark ? "bg-slate-700 text-slate-300 hover:bg-slate-600" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowRenewalModal(false);
                    // Show success toast
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-colors flex items-center gap-2 shadow-[0_2px_8px_rgba(59,130,246,0.3)]"
                >
                  <Send className="w-4 h-4" />
                  Send Renewal Notice
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Contract Viewer Modal */}
      <AnimatePresence>
        {showContractViewer && viewingContract && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowContractViewer(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl max-w-3xl w-full max-h-[85vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Provider Network Participation Agreement</h2>
                  <p className="text-gray-600">{viewingContract.provider} • {viewingContract.id}</p>
                </div>
                <button onClick={() => setShowContractViewer(false)} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-200 rounded-lg">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-8 overflow-auto max-h-[60vh] bg-white">
                <div className="prose prose-sm max-w-none">
                  <div className="text-center mb-8 pb-6 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">PROVIDER NETWORK PARTICIPATION AGREEMENT</h1>
                    <p className="text-gray-600">TrueCare Health Network</p>
                  </div>
                  
                  <p className="text-gray-700 mb-6">
                    This Agreement (&quot;Agreement&quot;) is entered into as of <span className="bg-blue-100 px-1 font-semibold">{viewingContract.startDate}</span> by and between:
                  </p>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <p className="text-gray-700"><strong>TrueCare Health Network</strong> (&quot;Network&quot;)</p>
                    <p className="text-gray-500">123 Healthcare Drive, Suite 500, Cleveland, OH 44101</p>
                    <p className="text-gray-700 mt-3">and</p>
                    <p className="text-gray-700 mt-3"><strong>{viewingContract.provider}</strong> (&quot;Provider&quot;)</p>
                    <p className="text-gray-500">{viewingContract.address}</p>
                    <p className="text-gray-500">NPI: {viewingContract.npi}</p>
                  </div>

                  <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">1. TERM</h2>
                  <p className="text-gray-700 mb-4">
                    This Agreement shall commence on <strong>{viewingContract.startDate}</strong> and continue for a period of <strong>{viewingContract.termLength}</strong>, expiring on <strong>{viewingContract.expires}</strong>, unless earlier terminated in accordance with Section 8 of this Agreement.
                  </p>

                  <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">2. SERVICES</h2>
                  <p className="text-gray-700 mb-4">
                    Provider agrees to provide <strong>{viewingContract.specialty}</strong> healthcare services to Network members in accordance with the terms of this Agreement, applicable law, and generally accepted standards of medical practice.
                  </p>

                  <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">3. COMPENSATION</h2>
                  <div className="bg-green-50 p-4 rounded-lg mb-4 border border-green-200">
                    <p className="text-gray-700 mb-2">Network shall compensate Provider according to the following rate structure:</p>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <p className="text-xs text-gray-500">Rate Type</p>
                        <p className="font-semibold text-gray-900">{viewingContract.rateType}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Rate Value</p>
                        <p className="font-semibold text-green-600">{viewingContract.rateValue}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-gray-500">Effective Discount from Billed</p>
                        <p className="font-semibold text-green-600">{viewingContract.discount}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    Payment shall be made within thirty (30) days of receipt of a clean claim. Provider agrees to accept the above rates as payment in full and shall not balance bill Network members except for applicable copayments, coinsurance, and deductibles.
                  </p>

                  <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">4. CREDENTIALING</h2>
                  <p className="text-gray-700 mb-4">
                    Provider shall maintain all required licenses, certifications, and credentials throughout the term of this Agreement. Provider shall cooperate with Network&apos;s credentialing and recredentialing processes.
                  </p>

                  <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">5. COMPLIANCE</h2>
                  <p className="text-gray-700 mb-4">
                    Provider shall comply with all applicable federal, state, and local laws and regulations, including but not limited to HIPAA, the Anti-Kickback Statute, and the Stark Law.
                  </p>

                  <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">6. INSURANCE</h2>
                  <p className="text-gray-700 mb-4">
                    Provider shall maintain professional liability insurance with minimum limits of $1,000,000 per occurrence and $3,000,000 aggregate.
                  </p>

                  <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">7. TERMINATION</h2>
                  <p className="text-gray-700 mb-4">
                    Either party may terminate this Agreement without cause upon ninety (90) days written notice. Either party may terminate immediately for cause.
                  </p>

                  <div className="mt-10 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <p className="text-xs text-gray-500 mb-2">NETWORK</p>
                        <div className="border-b border-gray-400 pb-8 mb-2 italic text-gray-400 text-sm">TrueCare Health Network</div>
                        <p className="text-sm text-gray-600">Authorized Representative</p>
                        <p className="text-sm text-gray-400 mt-1">Date: {viewingContract.startDate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-2">PROVIDER</p>
                        <div className="border-b border-gray-400 pb-8 mb-2 italic text-gray-400 text-sm">{viewingContract.provider}</div>
                        <p className="text-sm text-gray-600">Authorized Representative</p>
                        <p className="text-sm text-gray-400 mt-1">Date: {viewingContract.startDate}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
                <button
                  onClick={() => setShowContractViewer(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
