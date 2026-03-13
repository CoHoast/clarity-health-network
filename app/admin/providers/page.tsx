"use client";

import { useState } from "react";
import { Search, Download, Eye, Plus, Building2, MapPin, Phone, Mail, FileText, CheckCircle, Clock, XCircle, Calendar, X, Shield, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const providers = [
  { id: "PRV-001", name: "Cleveland Family Medicine", npi: "1234567890", type: "Group Practice", specialty: "Family Medicine", location: "Cleveland, OH", phone: "(555) 123-4567", email: "info@clevelandfm.com", status: "active", contracted: "2022-01-15", claimsMtd: 234, feeSchedule: "120% Medicare" },
  { id: "PRV-002", name: "Dr. Sarah Chen, MD", npi: "2345678901", type: "Individual", specialty: "Internal Medicine", location: "Lakewood, OH", phone: "(555) 234-5678", email: "dr.chen@medical.com", status: "active", contracted: "2023-03-01", claimsMtd: 156, feeSchedule: "115% Medicare" },
  { id: "PRV-003", name: "Metro Imaging Center", npi: "3456789012", type: "Facility", specialty: "Diagnostic Imaging", location: "Cleveland, OH", phone: "(555) 345-6789", email: "scheduling@metroimaging.com", status: "active", contracted: "2021-06-15", claimsMtd: 89, feeSchedule: "Case Rate" },
  { id: "PRV-004", name: "Cleveland Orthopedic", npi: "4567890123", type: "Group Practice", specialty: "Orthopedics", location: "Beachwood, OH", phone: "(555) 456-7890", email: "contact@clevortho.com", status: "active", contracted: "2020-09-01", claimsMtd: 312, feeSchedule: "125% Medicare" },
  { id: "PRV-005", name: "Dr. James Wilson, DO", npi: "5678901234", type: "Individual", specialty: "Family Medicine", location: "Mentor, OH", phone: "(555) 567-8901", email: "jwilson@healthcare.com", status: "pending", contracted: "Pending", claimsMtd: 0, feeSchedule: "TBD" },
  { id: "PRV-006", name: "Westlake Urgent Care", npi: "6789012345", type: "Facility", specialty: "Urgent Care", location: "Westlake, OH", phone: "(555) 678-9012", email: "info@westlakeuc.com", status: "active", contracted: "2023-01-01", claimsMtd: 445, feeSchedule: "110% Medicare" },
  { id: "PRV-007", name: "Dr. Amy Foster, MD", npi: "7890123456", type: "Individual", specialty: "Pediatrics", location: "Shaker Heights, OH", phone: "(555) 789-0123", email: "dr.foster@kidscare.com", status: "active", contracted: "2022-08-15", claimsMtd: 78, feeSchedule: "120% Medicare" },
  { id: "PRV-008", name: "Inactive Provider LLC", npi: "8901234567", type: "Group Practice", specialty: "General Surgery", location: "Akron, OH", phone: "(555) 890-1234", email: "contact@inactive.com", status: "inactive", contracted: "2019-01-01", claimsMtd: 0, feeSchedule: "Terminated" },
];

const statusOptions = ["All", "Active", "Pending", "Inactive"];
const typeOptions = ["All Types", "Individual", "Group Practice", "Facility"];

export default function ProvidersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [selectedProvider, setSelectedProvider] = useState<typeof providers[0] | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredProviders = providers.filter((provider) => {
    const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.npi.includes(searchQuery) ||
      provider.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || provider.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesType = typeFilter === "All Types" || provider.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full"><CheckCircle className="w-3 h-3" />Active</span>;
      case "inactive": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 text-xs font-medium rounded-full"><XCircle className="w-3 h-3" />Inactive</span>;
      case "pending": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full"><Clock className="w-3 h-3" />Pending</span>;
      default: return null;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      "Individual": "bg-blue-500/20 text-blue-400",
      "Group Practice": "bg-purple-500/20 text-purple-400",
      "Facility": "bg-teal-500/20 text-teal-400",
    };
    return <span className={`px-2 py-1 text-xs font-medium rounded ${colors[type] || "bg-slate-600 text-slate-300"}`}>{type}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Provider Network</h1>
          <p className="text-slate-400">Manage providers, credentials, and contracts</p>
        </div>
        <div className="flex gap-3">
          <a href="/docs/provider-network-report.pdf" download className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 border border-slate-600">
            <Download className="w-4 h-4" />
            Export
          </a>
          <button onClick={() => setShowAddModal(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            <Plus className="w-4 h-4" />
            Add Provider
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-white">2,847</p>
          <p className="text-sm text-slate-400">Total Providers</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-green-400">2,789</p>
          <p className="text-sm text-slate-400">Credentialed</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-amber-400">34</p>
          <p className="text-sm text-slate-400">Pending Review</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-purple-400">156</p>
          <p className="text-sm text-slate-400">Locations</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name, NPI, or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white">
            {statusOptions.map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white">
            {typeOptions.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* Providers Table */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800 border-b border-slate-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Provider</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Specialty</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Location</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-400 uppercase">Claims MTD</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredProviders.map((provider) => (
                <tr key={provider.id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-white">{provider.name}</p>
                      <p className="text-xs text-slate-500">NPI: {provider.npi}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">{getTypeBadge(provider.type)}</td>
                  <td className="px-4 py-3 text-slate-300">{provider.specialty}</td>
                  <td className="px-4 py-3 text-slate-400 text-sm">{provider.location}</td>
                  <td className="px-4 py-3">{getStatusBadge(provider.status)}</td>
                  <td className="px-4 py-3 text-center text-slate-300">{provider.claimsMtd}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setSelectedProvider(provider)} className="p-1.5 text-slate-400 hover:text-purple-400 hover:bg-purple-500/20 rounded">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provider Detail Modal */}
      <AnimatePresence>
        {selectedProvider && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProvider(null)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-700">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">{selectedProvider.name}</h2>
                    <p className="text-sm text-slate-400">{selectedProvider.specialty} • NPI: {selectedProvider.npi}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedProvider(null)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h3 className="font-medium text-white mb-3 flex items-center gap-2"><Building2 className="w-4 h-4 text-blue-400" />Contact Info</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-slate-300"><Phone className="w-4 h-4 text-slate-500" />{selectedProvider.phone}</div>
                        <div className="flex items-center gap-2 text-slate-300"><Mail className="w-4 h-4 text-slate-500" />{selectedProvider.email}</div>
                        <div className="flex items-center gap-2 text-slate-300"><MapPin className="w-4 h-4 text-slate-500" />{selectedProvider.location}</div>
                      </div>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h3 className="font-medium text-white mb-3 flex items-center gap-2"><Shield className="w-4 h-4 text-green-400" />Status</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-slate-400">Network Status</span>{getStatusBadge(selectedProvider.status)}</div>
                        <div className="flex justify-between"><span className="text-slate-400">Provider Type</span>{getTypeBadge(selectedProvider.type)}</div>
                        <div className="flex justify-between"><span className="text-slate-400">Contracted</span><span className="text-white">{selectedProvider.contracted}</span></div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h3 className="font-medium text-white mb-3 flex items-center gap-2"><DollarSign className="w-4 h-4 text-amber-400" />Fee Schedule</h3>
                      <p className="text-2xl font-bold text-white">{selectedProvider.feeSchedule}</p>
                      <p className="text-sm text-slate-400 mt-1">Current reimbursement rate</p>
                      <a href="/docs/contract" target="_blank" className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 text-sm mt-3">
                        <FileText className="w-4 h-4" />View Contract
                      </a>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h3 className="font-medium text-white mb-3">Claims This Month</h3>
                      <p className="text-3xl font-bold text-white">{selectedProvider.claimsMtd}</p>
                      <p className="text-sm text-slate-400">Total claims submitted</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h3 className="font-medium text-white mb-3 flex items-center gap-2"><Calendar className="w-4 h-4 text-purple-400" />Credentials</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-slate-400">License</span><span className="text-green-400">Valid</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">DEA</span><span className="text-green-400">Valid</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Malpractice</span><span className="text-green-400">Current</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Board Cert</span><span className="text-green-400">Valid</span></div>
                      </div>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h3 className="font-medium text-white mb-3">Quick Actions</h3>
                      <div className="space-y-2">
                        <a href="/docs/contract" target="_blank" className="flex items-center gap-2 px-3 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg text-sm text-white w-full"><FileText className="w-4 h-4" />View Contract</a>
                        <button className="flex items-center gap-2 px-3 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg text-sm text-white w-full"><Mail className="w-4 h-4" />Send Message</button>
                        <a href="/admin/credentialing" className="flex items-center gap-2 px-3 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg text-sm text-white w-full"><Shield className="w-4 h-4" />View Credentials</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 p-4 border-t border-slate-700 bg-slate-800">
                <button className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 text-sm">Edit Provider</button>
                <button onClick={() => setSelectedProvider(null)} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">Close</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add Provider Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-700">
                <h2 className="text-lg font-semibold text-white">Add New Provider</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Provider/Practice Name</label>
                  <input type="text" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" placeholder="Cleveland Family Medicine" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">NPI</label>
                    <input type="text" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" placeholder="1234567890" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Tax ID</label>
                    <input type="text" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" placeholder="XX-XXXXXXX" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Type</label>
                    <select className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                      <option>Individual</option>
                      <option>Group Practice</option>
                      <option>Facility</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Specialty</label>
                    <select className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                      <option>Family Medicine</option>
                      <option>Internal Medicine</option>
                      <option>Pediatrics</option>
                      <option>Cardiology</option>
                      <option>Orthopedics</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Address</label>
                  <input type="text" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" placeholder="123 Medical Center Dr, Cleveland, OH 44101" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Phone</label>
                    <input type="tel" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" placeholder="(555) 123-4567" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                    <input type="email" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" placeholder="contact@provider.com" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 p-4 border-t border-slate-700 bg-slate-800">
                <button onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 text-sm">Cancel</button>
                <button onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">Add Provider</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
