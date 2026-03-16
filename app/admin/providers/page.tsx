"use client";

import { useState } from "react";
import { Search, Download, Eye, Plus, Building2, MapPin, Phone, Mail, FileText, CheckCircle, Clock, XCircle, Calendar, X, DollarSign, Edit, User, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Provider {
  id: string;
  practiceName: string;
  orgNpi: string;
  servicingNpi: string;
  payToNpi: string;
  taxId: string;
  type: string;
  specialty: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  contactName: string;
  status: string;
  contractStart: string;
  contractEnd: string;
  discountType: string;
  discountRate: string;
  serviceOverrides?: { service: string; rate: string }[];
}

const providers: Provider[] = [
  { id: "PRV-001", practiceName: "Cleveland Family Medicine", orgNpi: "1234567890", servicingNpi: "1111111111", payToNpi: "1234567890", taxId: "34-1234567", type: "Group Practice", specialty: "Family Medicine", address: "123 Medical Center Dr", city: "Cleveland", state: "OH", zip: "44101", phone: "(555) 123-4567", email: "info@clevelandfm.com", contactName: "Mary Johnson", status: "active", contractStart: "2024-01-15", contractEnd: "2027-01-14", discountType: "% Off Billed", discountRate: "35%", serviceOverrides: [{ service: "Office Visit", rate: "40%" }] },
  { id: "PRV-002", practiceName: "Dr. Sarah Chen, MD", orgNpi: "2345678901", servicingNpi: "2345678901", payToNpi: "2345678901", taxId: "34-2345678", type: "Individual", specialty: "Internal Medicine", address: "456 Health Blvd", city: "Lakewood", state: "OH", zip: "44107", phone: "(555) 234-5678", email: "dr.chen@medical.com", contactName: "Dr. Sarah Chen", status: "active", contractStart: "2025-03-01", contractEnd: "2028-02-28", discountType: "% of Medicare", discountRate: "115%", },
  { id: "PRV-003", practiceName: "Metro Imaging Center", orgNpi: "3456789012", servicingNpi: "3333333333", payToNpi: "3456789012", taxId: "34-3456789", type: "Facility", specialty: "Diagnostic Imaging", address: "789 Imaging Way", city: "Cleveland", state: "OH", zip: "44102", phone: "(555) 345-6789", email: "scheduling@metroimaging.com", contactName: "Tom Richards", status: "active", contractStart: "2023-06-15", contractEnd: "2026-06-14", discountType: "Case Rate", discountRate: "See Schedule", },
  { id: "PRV-004", practiceName: "Cleveland Orthopedic Associates", orgNpi: "4567890123", servicingNpi: "4444444444", payToNpi: "9999999991", taxId: "34-4567890", type: "Group Practice", specialty: "Orthopedics", address: "321 Bone & Joint Dr", city: "Beachwood", state: "OH", zip: "44122", phone: "(555) 456-7890", email: "contact@clevortho.com", contactName: "James Miller", status: "active", contractStart: "2024-09-01", contractEnd: "2027-08-31", discountType: "% Off Billed", discountRate: "40%", },
  { id: "PRV-005", practiceName: "Dr. James Wilson, DO", orgNpi: "5678901234", servicingNpi: "5678901234", payToNpi: "5678901234", taxId: "34-5678901", type: "Individual", specialty: "Family Medicine", address: "654 Wellness Ave", city: "Mentor", state: "OH", zip: "44060", phone: "(555) 567-8901", email: "jwilson@healthcare.com", contactName: "Dr. James Wilson", status: "pending", contractStart: "Pending", contractEnd: "Pending", discountType: "TBD", discountRate: "TBD", },
  { id: "PRV-006", practiceName: "Westlake Urgent Care", orgNpi: "6789012345", servicingNpi: "6666666666", payToNpi: "6789012345", taxId: "34-6789012", type: "Facility", specialty: "Urgent Care", address: "987 Quick Care Blvd", city: "Westlake", state: "OH", zip: "44145", phone: "(555) 678-9012", email: "info@westlakeuc.com", contactName: "Patricia Lee", status: "active", contractStart: "2025-01-01", contractEnd: "2028-12-31", discountType: "% Off Billed", discountRate: "30%", },
  { id: "PRV-007", practiceName: "Cleveland Cardiology Associates", orgNpi: "9012345678", servicingNpi: "9999999999", payToNpi: "9012345678", taxId: "34-9012345", type: "Group Practice", specialty: "Cardiology", address: "369 Heart Center Dr", city: "Cleveland", state: "OH", zip: "44104", phone: "(555) 901-2345", email: "info@clevcardio.com", contactName: "Robert Thompson", status: "active", contractStart: "2024-03-15", contractEnd: "2027-03-14", discountType: "% of Medicare", discountRate: "130%", },
  { id: "PRV-008", practiceName: "Quest Diagnostics Cleveland", orgNpi: "8901234567", servicingNpi: "8888888888", payToNpi: "8901234567", taxId: "34-8901234", type: "Facility", specialty: "Laboratory", address: "258 Lab Services Rd", city: "Cleveland", state: "OH", zip: "44103", phone: "(555) 890-1234", email: "clevelandlab@quest.com", contactName: "Lab Admin", status: "active", contractStart: "2023-01-01", contractEnd: "2026-12-31", discountType: "% Off Billed", discountRate: "45%", },
  { id: "PRV-009", practiceName: "Physical Therapy Plus", orgNpi: "1122334455", servicingNpi: "1122334455", payToNpi: "1122334455", taxId: "34-1122334", type: "Group Practice", specialty: "Physical Therapy", address: "852 Rehab Road", city: "Brooklyn", state: "OH", zip: "44144", phone: "(555) 112-2334", email: "schedule@ptplus.com", contactName: "Linda White", status: "active", contractStart: "2024-05-01", contractEnd: "2027-04-30", discountType: "% of Medicare", discountRate: "100%", },
  { id: "PRV-010", practiceName: "Inactive Provider LLC", orgNpi: "9900112233", servicingNpi: "9900112233", payToNpi: "9900112233", taxId: "34-9900112", type: "Group Practice", specialty: "General Surgery", address: "147 Old Surgery Ln", city: "Akron", state: "OH", zip: "44301", phone: "(555) 990-0112", email: "contact@inactive.com", contactName: "N/A", status: "inactive", contractStart: "2019-01-01", contractEnd: "2022-12-31", discountType: "Terminated", discountRate: "N/A", },
];

const statusOptions = ["All", "Active", "Pending", "Inactive"];
const typeOptions = ["All Types", "Individual", "Group Practice", "Facility"];

export default function ProvidersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

  const filteredProviders = providers.filter((provider) => {
    const matchesSearch = provider.practiceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.orgNpi.includes(searchQuery) ||
      provider.servicingNpi.includes(searchQuery) ||
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

  const activeCount = providers.filter(p => p.status === "active").length;
  const pendingCount = providers.filter(p => p.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Provider Network</h1>
          <p className="text-slate-400 mt-1">{activeCount} active providers • {pendingCount} pending applications</p>
        </div>
        <Link
          href="/admin/providers/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 font-medium rounded-lg hover:bg-teal-700 transition-colors"
          style={{ color: 'white' }}
        >
          <Plus className="w-4 h-4" />
          Add Provider
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, NPI, or specialty..."
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
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Providers Table */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Provider</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">NPIs</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Specialty</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Contract</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Discount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredProviders.map((provider) => (
                <tr key={provider.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-white font-medium">{provider.practiceName}</p>
                      <p className="text-slate-400 text-sm">{provider.city}, {provider.state}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs font-mono space-y-1">
                      <div><span className="text-slate-500">Org:</span> <span className="text-slate-300">{provider.orgNpi}</span></div>
                      <div><span className="text-slate-500">Svc:</span> <span className="text-slate-300">{provider.servicingNpi}</span></div>
                      <div><span className="text-slate-500">Pay:</span> <span className="text-cyan-400">{provider.payToNpi}</span></div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-300">{provider.specialty}</span>
                    <p className="text-slate-500 text-xs">{provider.type}</p>
                  </td>
                  <td className="px-6 py-4">
                    {provider.contractEnd !== "Pending" ? (
                      <div className="text-sm">
                        <p className="text-slate-300">{provider.contractStart}</p>
                        <p className="text-slate-500">to {provider.contractEnd}</p>
                      </div>
                    ) : (
                      <span className="text-amber-400 text-sm">Pending</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-green-400 font-medium">{provider.discountRate}</p>
                      <p className="text-slate-500 text-xs">{provider.discountType}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(provider.status)}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedProvider(provider)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-700 text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-600 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedProvider(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-auto border border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-700 flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedProvider.practiceName}</h2>
                  <p className="text-slate-400">{selectedProvider.specialty} • {selectedProvider.type}</p>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(selectedProvider.status)}
                  <button onClick={() => setSelectedProvider(null)} className="text-slate-400 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* NPI Section */}
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-teal-400" />
                    NPI Numbers
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Organization NPI (Type 2)</p>
                      <p className="text-white font-mono text-lg">{selectedProvider.orgNpi}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Servicing Provider NPI (Type 1)</p>
                      <p className="text-white font-mono text-lg">{selectedProvider.servicingNpi}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Pay-To NPI</p>
                      <p className="text-cyan-400 font-mono text-lg">{selectedProvider.payToNpi}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-600">
                    <p className="text-xs text-slate-500 mb-1">Tax ID / EIN</p>
                    <p className="text-white font-mono">{selectedProvider.taxId}</p>
                  </div>
                </div>

                {/* Contact & Location */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-teal-400" />
                      Location
                    </h3>
                    <p className="text-slate-300">{selectedProvider.address}</p>
                    <p className="text-slate-300">{selectedProvider.city}, {selectedProvider.state} {selectedProvider.zip}</p>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      <User className="w-4 h-4 text-teal-400" />
                      Contact
                    </h3>
                    <p className="text-slate-300">{selectedProvider.contactName}</p>
                    <p className="text-slate-400 text-sm">{selectedProvider.phone}</p>
                    <p className="text-slate-400 text-sm">{selectedProvider.email}</p>
                  </div>
                </div>

                {/* Contract & Discount */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-teal-400" />
                      Contract
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Start Date</span>
                        <span className="text-white">{selectedProvider.contractStart}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">End Date</span>
                        <span className="text-white">{selectedProvider.contractEnd}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-teal-400" />
                      Discount Terms
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Type</span>
                        <span className="text-white">{selectedProvider.discountType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Rate</span>
                        <span className="text-green-400 font-semibold">{selectedProvider.discountRate}</span>
                      </div>
                    </div>
                    {selectedProvider.serviceOverrides && (
                      <div className="mt-3 pt-3 border-t border-slate-600">
                        <p className="text-xs text-slate-500 mb-2">Service-Specific Overrides</p>
                        {selectedProvider.serviceOverrides.map((override, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-slate-400">{override.service}</span>
                            <span className="text-amber-400">{override.rate}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-slate-700 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedProvider(null)}
                  className="px-4 py-2 bg-slate-700 text-slate-300 font-medium rounded-lg hover:bg-slate-600 transition-colors"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit Provider
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
