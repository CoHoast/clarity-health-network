"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Plus, Search, Download, Eye, Edit, CheckCircle, Clock, AlertTriangle, X, FileText, Calendar, Building2, DollarSign, Printer, ExternalLink } from "lucide-react";

const contracts = [
  { id: "CTR-001", provider: "Cleveland Family Medicine", npi: "1234567890", type: "Primary Care", feeSchedule: "120% Medicare", effective: "2024-01-01", expires: "2026-12-31", status: "active", autoRenew: true, totalClaims: 2847, ytdPaid: "$342,500" },
  { id: "CTR-002", provider: "Metro Imaging Center", npi: "3456789012", type: "Imaging", feeSchedule: "Case Rate", effective: "2023-06-01", expires: "2025-05-31", status: "expiring", autoRenew: false, totalClaims: 1234, ytdPaid: "$567,800" },
  { id: "CTR-003", provider: "Cleveland Orthopedic", npi: "4567890123", type: "Specialty", feeSchedule: "125% Medicare", effective: "2024-01-01", expires: "2026-12-31", status: "active", autoRenew: true, totalClaims: 892, ytdPaid: "$445,200" },
  { id: "CTR-004", provider: "Dr. Sarah Chen, MD", npi: "2345678901", type: "Primary Care", feeSchedule: "115% Medicare", effective: "2023-03-01", expires: "2025-02-28", status: "expiring", autoRenew: true, totalClaims: 1567, ytdPaid: "$234,100" },
  { id: "CTR-005", provider: "Westlake Urgent Care", npi: "6789012345", type: "Urgent Care", feeSchedule: "110% Medicare", effective: "2024-01-01", expires: "2026-12-31", status: "active", autoRenew: true, totalClaims: 3421, ytdPaid: "$412,300" },
  { id: "CTR-006", provider: "Pending Provider LLC", npi: "9876543210", type: "Specialty", feeSchedule: "TBD", effective: "Pending", expires: "Pending", status: "pending", autoRenew: false, totalClaims: 0, ytdPaid: "$0" },
  { id: "CTR-007", provider: "Cleveland Cardiology", npi: "9012345678", type: "Specialty", feeSchedule: "130% Medicare", effective: "2023-01-01", expires: "2025-12-31", status: "active", autoRenew: true, totalClaims: 1892, ytdPaid: "$678,400" },
  { id: "CTR-008", provider: "Quest Diagnostics Cleveland", npi: "8901234567", type: "Laboratory", feeSchedule: "65% Medicare", effective: "2022-01-01", expires: "2027-12-31", status: "active", autoRenew: true, totalClaims: 8934, ytdPaid: "$234,500" },
];

export default function ContractsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedContract, setSelectedContract] = useState<typeof contracts[0] | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRenewalModal, setShowRenewalModal] = useState<typeof contracts[0] | null>(null);
  const [actionSuccess, setActionSuccess] = useState(false);

  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch = contract.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || contract.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full"><CheckCircle className="w-3 h-3" />Active</span>;
      case "expiring": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full"><AlertTriangle className="w-3 h-3" />Expiring Soon</span>;
      case "pending": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full"><Clock className="w-3 h-3" />Pending</span>;
      default: return null;
    }
  };

  const handleAction = () => {
    setActionSuccess(true);
    setTimeout(() => {
      setActionSuccess(false);
      setShowRenewalModal(null);
      setShowAddModal(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Contract Management</h1>
          <p className="text-slate-400">Manage provider contracts and agreements</p>
        </div>
        <div className="flex gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 border border-slate-600">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-lg hover:from-teal-700 hover:to-teal-700"
          >
            <Plus className="w-4 h-4" />
            New Contract
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button onClick={() => setStatusFilter("active")} className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 text-left hover:border-green-500/50 transition-colors">
          <p className="text-2xl font-bold text-white">847</p>
          <p className="text-sm text-slate-400">Active Contracts</p>
        </button>
        <button onClick={() => setStatusFilter("expiring")} className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 text-left hover:border-amber-500/50 transition-colors">
          <p className="text-2xl font-bold text-amber-400">23</p>
          <p className="text-sm text-slate-400">Expiring Soon</p>
        </button>
        <button onClick={() => setStatusFilter("pending")} className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 text-left hover:border-blue-500/50 transition-colors">
          <p className="text-2xl font-bold text-blue-400">12</p>
          <p className="text-sm text-slate-400">Pending Approval</p>
        </button>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-green-400">98%</p>
          <p className="text-sm text-slate-400">Renewal Rate</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search contracts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-600"
            />
          </div>
          <div className="flex gap-2">
            {["All", "Active", "Expiring", "Pending"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === status
                    ? "bg-teal-600 text-white"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800 border-b border-slate-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Contract</th>
              <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Provider</th>
              <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Type</th>
              <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Fee Schedule</th>
              <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Expires</th>
              <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Status</th>
              <th className="px-4 py-3 text-right text-xs text-slate-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {filteredContracts.map((contract) => (
              <tr key={contract.id} className="hover:bg-slate-800/80 transition-colors">
                <td className="px-4 py-3">
                  <button
                    onClick={() => setSelectedContract(contract)}
                    className="font-mono text-cyan-500 hover:text-cyan-400 hover:underline"
                  >
                    {contract.id}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="text-white font-medium">{contract.provider}</p>
                    <p className="text-xs text-slate-500">NPI: {contract.npi}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-300">{contract.type}</td>
                <td className="px-4 py-3 text-slate-300">{contract.feeSchedule}</td>
                <td className="px-4 py-3 text-slate-300">{contract.expires}</td>
                <td className="px-4 py-3">{getStatusBadge(contract.status)}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setSelectedContract(contract)}
                      className="p-1.5 text-slate-400 hover:text-cyan-500 hover:bg-cyan-600/20 rounded"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {contract.status === "expiring" && (
                      <button
                        onClick={() => setShowRenewalModal(contract)}
                        className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded hover:bg-amber-500/30"
                      >
                        Renew
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Contract Detail Modal */}
      <AnimatePresence>
        {selectedContract && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedContract(null)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-600/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-cyan-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">{selectedContract.id}</h2>
                    <p className="text-sm text-slate-400">{selectedContract.provider}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedContract(null)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 overflow-y-auto max-h-[calc(90vh-180px)] space-y-4">
                <div className="flex gap-2">
                  {getStatusBadge(selectedContract.status)}
                  {selectedContract.autoRenew && (
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full">Auto-Renew</span>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <h3 className="font-medium text-white mb-3 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-400" />Provider Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Name</span>
                        <span className="text-white">{selectedContract.provider}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">NPI</span>
                        <span className="font-mono text-white">{selectedContract.npi}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Type</span>
                        <span className="text-white">{selectedContract.type}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <h3 className="font-medium text-white mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-green-400" />Contract Terms
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Effective</span>
                        <span className="text-white">{selectedContract.effective}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Expires</span>
                        <span className="text-white">{selectedContract.expires}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Fee Schedule</span>
                        <span className="text-white">{selectedContract.feeSchedule}</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
              <div className="flex items-center justify-between p-4 border-t border-slate-700 bg-slate-800">
                <button className="inline-flex items-center gap-2 px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 text-sm">
                  <Printer className="w-4 h-4" />Print
                </button>
                <div className="flex gap-2">
                  <Link 
                    href="/docs/contract" 
                    target="_blank"
                    className="inline-flex items-center gap-2 px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 text-sm"
                  >
                    <FileText className="w-4 h-4" />View Document
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                  <button onClick={() => setSelectedContract(null)} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm">
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Renewal Modal */}
      <AnimatePresence>
        {showRenewalModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowRenewalModal(null)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50">
              {actionSuccess ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Renewal Initiated!</h3>
                  <p className="text-slate-400">Contract renewal has been sent for approval.</p>
                </div>
              ) : (
                <>
                  <div className="p-4 border-b border-slate-700">
                    <h3 className="text-lg font-semibold text-white">Renew Contract</h3>
                    <p className="text-sm text-slate-400">{showRenewalModal.provider}</p>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                      <p className="text-sm text-amber-400">Current contract expires: {showRenewalModal.expires}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">New Term Length</label>
                      <select className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                        <option>1 Year</option>
                        <option>2 Years</option>
                        <option>3 Years</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Fee Schedule</label>
                      <select className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                        <option>{showRenewalModal.feeSchedule} (Current)</option>
                        <option>110% Medicare</option>
                        <option>115% Medicare</option>
                        <option>120% Medicare</option>
                        <option>125% Medicare</option>
                      </select>
                    </div>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded bg-slate-700 border-slate-600 text-teal-600" />
                      <span className="text-sm text-slate-300">Enable auto-renewal</span>
                    </label>
                  </div>
                  <div className="flex gap-2 p-4 border-t border-slate-700">
                    <button onClick={() => setShowRenewalModal(null)} className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Cancel</button>
                    <button onClick={handleAction} className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">Send Renewal</button>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add Contract Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 max-h-[90vh] overflow-hidden">
              {actionSuccess ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Contract Created!</h3>
                  <p className="text-slate-400">New contract has been created and is pending signatures.</p>
                </div>
              ) : (
                <>
                  <div className="p-4 border-b border-slate-700">
                    <h3 className="text-lg font-semibold text-white">New Contract</h3>
                  </div>
                  <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Provider</label>
                      <select className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                        <option>Select provider...</option>
                        <option>Pending Provider LLC</option>
                        <option>New Provider Group</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Contract Type</label>
                      <select className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                        <option>Primary Care</option>
                        <option>Specialty</option>
                        <option>Facility</option>
                        <option>Urgent Care</option>
                        <option>Imaging</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Effective Date</label>
                        <input type="date" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Term Length</label>
                        <select className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                          <option>1 Year</option>
                          <option>2 Years</option>
                          <option>3 Years</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Fee Schedule</label>
                      <select className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                        <option>110% Medicare</option>
                        <option>115% Medicare</option>
                        <option>120% Medicare</option>
                        <option>125% Medicare</option>
                        <option>Case Rate</option>
                      </select>
                    </div>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded bg-slate-700 border-slate-600 text-teal-600" />
                      <span className="text-sm text-slate-300">Enable auto-renewal</span>
                    </label>
                  </div>
                  <div className="flex gap-2 p-4 border-t border-slate-700">
                    <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Cancel</button>
                    <button onClick={handleAction} className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">Create Contract</button>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
