"use client";

import { useState } from "react";
import { Search, Download, Eye, Plus, Building2, MapPin, Phone, Mail, FileText, CheckCircle, Clock, XCircle, Calendar, X, Shield, DollarSign, Send, Edit } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const providers = [
  { id: "PRV-001", name: "Cleveland Family Medicine", npi: "1234567890", taxId: "34-1234567", type: "Group Practice", specialty: "Family Medicine", location: "Cleveland, OH", address: "123 Medical Center Dr, Cleveland, OH 44101", phone: "(555) 123-4567", email: "info@clevelandfm.com", status: "active", contracted: "2022-01-15", claimsMtd: 234, feeSchedule: "120% Medicare" },
  { id: "PRV-002", name: "Dr. Sarah Chen, MD", npi: "2345678901", taxId: "34-2345678", type: "Individual", specialty: "Internal Medicine", location: "Lakewood, OH", address: "456 Health Blvd, Lakewood, OH 44107", phone: "(555) 234-5678", email: "dr.chen@medical.com", status: "active", contracted: "2023-03-01", claimsMtd: 156, feeSchedule: "115% Medicare" },
  { id: "PRV-003", name: "Metro Imaging Center", npi: "3456789012", taxId: "34-3456789", type: "Facility", specialty: "Diagnostic Imaging", location: "Cleveland, OH", address: "789 Imaging Way, Cleveland, OH 44102", phone: "(555) 345-6789", email: "scheduling@metroimaging.com", status: "active", contracted: "2021-06-15", claimsMtd: 89, feeSchedule: "Case Rate" },
  { id: "PRV-004", name: "Cleveland Orthopedic", npi: "4567890123", taxId: "34-4567890", type: "Group Practice", specialty: "Orthopedics", location: "Beachwood, OH", address: "321 Bone & Joint Dr, Beachwood, OH 44122", phone: "(555) 456-7890", email: "contact@clevortho.com", status: "active", contracted: "2020-09-01", claimsMtd: 312, feeSchedule: "125% Medicare" },
  { id: "PRV-005", name: "Dr. James Wilson, DO", npi: "5678901234", taxId: "34-5678901", type: "Individual", specialty: "Family Medicine", location: "Mentor, OH", address: "654 Wellness Ave, Mentor, OH 44060", phone: "(555) 567-8901", email: "jwilson@healthcare.com", status: "pending", contracted: "Pending", claimsMtd: 0, feeSchedule: "TBD" },
  { id: "PRV-006", name: "Westlake Urgent Care", npi: "6789012345", taxId: "34-6789012", type: "Facility", specialty: "Urgent Care", location: "Westlake, OH", address: "987 Quick Care Blvd, Westlake, OH 44145", phone: "(555) 678-9012", email: "info@westlakeuc.com", status: "active", contracted: "2023-01-01", claimsMtd: 445, feeSchedule: "110% Medicare" },
  { id: "PRV-007", name: "Dr. Amy Foster, MD", npi: "7890123456", taxId: "34-7890123", type: "Individual", specialty: "Pediatrics", location: "Shaker Heights, OH", address: "147 Kids Care Lane, Shaker Heights, OH 44120", phone: "(555) 789-0123", email: "dr.foster@kidscare.com", status: "active", contracted: "2022-08-15", claimsMtd: 78, feeSchedule: "120% Medicare" },
  { id: "PRV-008", name: "Quest Diagnostics Cleveland", npi: "8901234567", taxId: "34-8901234", type: "Facility", specialty: "Laboratory", location: "Cleveland, OH", address: "258 Lab Services Rd, Cleveland, OH 44103", phone: "(555) 890-1234", email: "clevelandlab@quest.com", status: "active", contracted: "2019-01-01", claimsMtd: 892, feeSchedule: "65% Medicare" },
  { id: "PRV-009", name: "Cleveland Cardiology Associates", npi: "9012345678", taxId: "34-9012345", type: "Group Practice", specialty: "Cardiology", location: "Cleveland, OH", address: "369 Heart Center Dr, Cleveland, OH 44104", phone: "(555) 901-2345", email: "info@clevcardio.com", status: "active", contracted: "2020-03-15", claimsMtd: 267, feeSchedule: "130% Medicare" },
  { id: "PRV-010", name: "Women's Health Center", npi: "0123456789", taxId: "34-0123456", type: "Facility", specialty: "OB/GYN", location: "Parma, OH", address: "741 Women's Way, Parma, OH 44129", phone: "(555) 012-3456", email: "appointments@whcenter.com", status: "active", contracted: "2021-11-01", claimsMtd: 198, feeSchedule: "115% Medicare" },
  { id: "PRV-011", name: "Physical Therapy Plus", npi: "1122334455", taxId: "34-1122334", type: "Group Practice", specialty: "Physical Therapy", location: "Brooklyn, OH", address: "852 Rehab Road, Brooklyn, OH 44144", phone: "(555) 112-2334", email: "schedule@ptplus.com", status: "active", contracted: "2022-05-01", claimsMtd: 156, feeSchedule: "100% Medicare" },
  { id: "PRV-012", name: "Westlake Dermatology", npi: "2233445566", taxId: "34-2233445", type: "Group Practice", specialty: "Dermatology", location: "Westlake, OH", address: "963 Skin Care Blvd, Westlake, OH 44145", phone: "(555) 223-3445", email: "info@westlakederm.com", status: "active", contracted: "2023-02-15", claimsMtd: 134, feeSchedule: "120% Medicare" },
  { id: "PRV-013", name: "Cleveland ENT Associates", npi: "3344556677", taxId: "34-3344556", type: "Group Practice", specialty: "Otolaryngology", location: "Independence, OH", address: "147 Hearing Way, Independence, OH 44131", phone: "(555) 334-4556", email: "appointments@clevent.com", status: "active", contracted: "2021-07-01", claimsMtd: 89, feeSchedule: "125% Medicare" },
  { id: "PRV-014", name: "Sleep Center of Ohio", npi: "4455667788", taxId: "34-4455667", type: "Facility", specialty: "Sleep Medicine", location: "Strongsville, OH", address: "258 Rest Drive, Strongsville, OH 44136", phone: "(555) 445-5667", email: "info@sleepcenteroh.com", status: "active", contracted: "2022-09-01", claimsMtd: 45, feeSchedule: "Case Rate" },
  { id: "PRV-015", name: "PharmaCare Specialty", npi: "5566778899", taxId: "34-5566778", type: "Facility", specialty: "Specialty Pharmacy", location: "Cleveland, OH", address: "369 Rx Center Dr, Cleveland, OH 44105", phone: "(555) 556-6778", email: "specialty@pharmacare.com", status: "active", contracted: "2020-06-01", claimsMtd: 234, feeSchedule: "AWP minus 15%" },
  { id: "PRV-016", name: "Dr. Robert Kim, MD", npi: "6677889900", taxId: "34-6677889", type: "Individual", specialty: "Gastroenterology", location: "Solon, OH", address: "741 GI Center Lane, Solon, OH 44139", phone: "(555) 667-7889", email: "dr.kim@gicare.com", status: "active", contracted: "2021-04-15", claimsMtd: 112, feeSchedule: "125% Medicare" },
  { id: "PRV-017", name: "Dr. Lisa Martinez, MD", npi: "7788990011", taxId: "34-7788990", type: "Individual", specialty: "Neurology", location: "Mayfield, OH", address: "852 Brain Health Ave, Mayfield, OH 44143", phone: "(555) 778-8990", email: "dr.martinez@neurocare.com", status: "active", contracted: "2022-02-01", claimsMtd: 78, feeSchedule: "130% Medicare" },
  { id: "PRV-018", name: "Dr. Michael Brown, MD", npi: "8899001122", taxId: "34-8899001", type: "Individual", specialty: "Pulmonology", location: "Twinsburg, OH", address: "963 Lung Care Rd, Twinsburg, OH 44087", phone: "(555) 889-9001", email: "dr.brown@pulmocare.com", status: "pending", contracted: "Pending", claimsMtd: 0, feeSchedule: "TBD" },
  { id: "PRV-019", name: "Inactive Provider LLC", npi: "9900112233", taxId: "34-9900112", type: "Group Practice", specialty: "General Surgery", location: "Akron, OH", address: "147 Old Surgery Ln, Akron, OH 44301", phone: "(555) 990-0112", email: "contact@inactive.com", status: "inactive", contracted: "2019-01-01", claimsMtd: 0, feeSchedule: "Terminated" },
  { id: "PRV-020", name: "Cleveland Mental Health", npi: "0011223344", taxId: "34-0011223", type: "Group Practice", specialty: "Psychiatry", location: "Cleveland, OH", address: "258 Mind Wellness Dr, Cleveland, OH 44106", phone: "(555) 001-1223", email: "intake@clevmh.com", status: "active", contracted: "2023-06-01", claimsMtd: 167, feeSchedule: "110% Medicare" },
];

const statusOptions = ["All", "Active", "Pending", "Inactive"];
const typeOptions = ["All Types", "Individual", "Group Practice", "Facility"];

export default function ProvidersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [selectedProvider, setSelectedProvider] = useState<typeof providers[0] | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [messageProvider, setMessageProvider] = useState<typeof providers[0] | null>(null);
  const [editProvider, setEditProvider] = useState<typeof providers[0] | null>(null);
  const [messageSubject, setMessageSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [actionSuccess, setActionSuccess] = useState(false);

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
      "Group Practice": "bg-cyan-600/20 text-cyan-500",
      "Facility": "bg-teal-500/20 text-teal-400",
    };
    return <span className={`px-2 py-1 text-xs font-medium rounded ${colors[type] || "bg-slate-600 text-slate-300"}`}>{type}</span>;
  };

  const openMessageModal = (provider: typeof providers[0]) => {
    setMessageProvider(provider);
    setMessageSubject("");
    setMessageBody("");
    setActionSuccess(false);
    setShowMessageModal(true);
  };

  const openEditModal = (provider: typeof providers[0]) => {
    setEditProvider({...provider});
    setActionSuccess(false);
    setShowEditModal(true);
  };

  const handleSendMessage = () => {
    setActionSuccess(true);
    setTimeout(() => {
      setShowMessageModal(false);
      setActionSuccess(false);
    }, 2000);
  };

  const handleSaveEdit = () => {
    setActionSuccess(true);
    setTimeout(() => {
      setShowEditModal(false);
      setActionSuccess(false);
    }, 2000);
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
          <button onClick={() => setShowAddModal(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
            <Plus className="w-4 h-4" />
            Add Provider
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-teal-600 to-cyan-600 rounded-xl p-4 shadow-lg">
          <p className="text-2xl font-bold" style={{ color: 'white' }}>2,847</p>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>Total Providers</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl p-4 shadow-lg">
          <p className="text-2xl font-bold" style={{ color: 'white' }}>2,789</p>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>Credentialed</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-4 shadow-lg">
          <p className="text-2xl font-bold" style={{ color: 'white' }}>34</p>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>Pending Review</p>
        </div>
        <div className="bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl p-4 shadow-lg">
          <p className="text-2xl font-bold" style={{ color: 'white' }}>156</p>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>Locations</p>
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
              className="w-full pl-10 pr-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-600"
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
                    <button onClick={() => setSelectedProvider(provider)} className="p-1.5 text-slate-400 hover:text-cyan-500 hover:bg-cyan-600/20 rounded">
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
                  <div className="w-12 h-12 bg-cyan-600/20 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-cyan-500" />
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
                        <div className="flex items-center gap-2 text-slate-300"><MapPin className="w-4 h-4 text-slate-500" />{selectedProvider.address}</div>
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
                      <a href="/docs/contract" target="_blank" className="inline-flex items-center gap-1 text-cyan-500 hover:text-cyan-400 text-sm mt-3">
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
                      <h3 className="font-medium text-white mb-3 flex items-center gap-2"><Calendar className="w-4 h-4 text-cyan-500" />Credentials</h3>
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
                        <button 
                          onClick={() => { setSelectedProvider(null); openMessageModal(selectedProvider); }}
                          className="flex items-center gap-2 px-3 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg text-sm text-white w-full"
                        >
                          <Mail className="w-4 h-4" />Send Message
                        </button>
                        <a href="/admin/credentialing" className="flex items-center gap-2 px-3 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg text-sm text-white w-full"><Shield className="w-4 h-4" />View Credentials</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 p-4 border-t border-slate-700 bg-slate-800">
                <button 
                  onClick={() => { setSelectedProvider(null); openEditModal(selectedProvider); }}
                  className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 text-sm inline-flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />Edit Provider
                </button>
                <button onClick={() => setSelectedProvider(null)} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm">Close</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Send Message Modal */}
      <AnimatePresence>
        {showMessageModal && messageProvider && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !actionSuccess && setShowMessageModal(false)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50">
              {actionSuccess ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                  <p className="text-slate-400">Your message has been sent to {messageProvider.name}.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between p-4 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <Mail className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Send Message</h3>
                        <p className="text-sm text-slate-400">to {messageProvider.name}</p>
                      </div>
                    </div>
                    <button onClick={() => setShowMessageModal(false)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"><X className="w-5 h-5" /></button>
                  </div>
                  <div className="p-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">To</label>
                      <input 
                        type="text" 
                        value={messageProvider.email}
                        readOnly
                        className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-400 cursor-not-allowed" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Subject</label>
                      <input 
                        type="text" 
                        value={messageSubject}
                        onChange={(e) => setMessageSubject(e.target.value)}
                        placeholder="Enter subject..."
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Message</label>
                      <textarea 
                        value={messageBody}
                        onChange={(e) => setMessageBody(e.target.value)}
                        placeholder="Type your message..."
                        rows={6}
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 resize-none" 
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 p-4 border-t border-slate-700">
                    <button onClick={() => setShowMessageModal(false)} className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Cancel</button>
                    <button onClick={handleSendMessage} className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 inline-flex items-center justify-center gap-2">
                      <Send className="w-4 h-4" />Send Message
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edit Provider Modal */}
      <AnimatePresence>
        {showEditModal && editProvider && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !actionSuccess && setShowEditModal(false)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
              {actionSuccess ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Provider Updated!</h3>
                  <p className="text-slate-400">Changes have been saved successfully.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between p-4 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-cyan-600/20 rounded-lg flex items-center justify-center">
                        <Edit className="w-5 h-5 text-cyan-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Edit Provider</h3>
                        <p className="text-sm text-slate-400">{editProvider.id}</p>
                      </div>
                    </div>
                    <button onClick={() => setShowEditModal(false)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"><X className="w-5 h-5" /></button>
                  </div>
                  <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(90vh-160px)]">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Provider/Practice Name</label>
                      <input 
                        type="text" 
                        value={editProvider.name}
                        onChange={(e) => setEditProvider({...editProvider, name: e.target.value})}
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" 
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">NPI</label>
                        <input 
                          type="text" 
                          value={editProvider.npi}
                          onChange={(e) => setEditProvider({...editProvider, npi: e.target.value})}
                          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Tax ID</label>
                        <input 
                          type="text" 
                          value={editProvider.taxId}
                          onChange={(e) => setEditProvider({...editProvider, taxId: e.target.value})}
                          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" 
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Type</label>
                        <select 
                          value={editProvider.type}
                          onChange={(e) => setEditProvider({...editProvider, type: e.target.value})}
                          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                        >
                          <option>Individual</option>
                          <option>Group Practice</option>
                          <option>Facility</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Specialty</label>
                        <input 
                          type="text" 
                          value={editProvider.specialty}
                          onChange={(e) => setEditProvider({...editProvider, specialty: e.target.value})}
                          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Address</label>
                      <input 
                        type="text" 
                        value={editProvider.address}
                        onChange={(e) => setEditProvider({...editProvider, address: e.target.value})}
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" 
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Phone</label>
                        <input 
                          type="tel" 
                          value={editProvider.phone}
                          onChange={(e) => setEditProvider({...editProvider, phone: e.target.value})}
                          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                        <input 
                          type="email" 
                          value={editProvider.email}
                          onChange={(e) => setEditProvider({...editProvider, email: e.target.value})}
                          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" 
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
                        <select 
                          value={editProvider.status}
                          onChange={(e) => setEditProvider({...editProvider, status: e.target.value})}
                          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                        >
                          <option value="active">Active</option>
                          <option value="pending">Pending</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Fee Schedule</label>
                        <input 
                          type="text" 
                          value={editProvider.feeSchedule}
                          onChange={(e) => setEditProvider({...editProvider, feeSchedule: e.target.value})}
                          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" 
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 p-4 border-t border-slate-700">
                    <button onClick={() => setShowEditModal(false)} className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Cancel</button>
                    <button onClick={handleSaveEdit} className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">Save Changes</button>
                  </div>
                </>
              )}
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
                <button onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm">Add Provider</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
