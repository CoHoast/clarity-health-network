"use client";

import { useState } from "react";
import { Search, Download, Eye, Plus, Building2, MapPin, Phone, Mail, FileText, CheckCircle, Clock, XCircle, X, DollarSign, Edit, User, CreditCard, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Provider {
  id: string;
  practiceName: string;
  servicingNpi: string;
  primaryTaxonomy: string;
  primaryTaxonomyDesc: string;
  secondaryTaxonomy: string;
  secondaryTaxonomyDesc: string;
  payToNpi: string;
  payToName: string;
  taxId: string;
  type: string;
  specialty: string;
  // Location Address
  address: string;
  city: string;
  state: string;
  zip: string;
  // Pay-To Info
  payToAddress: string;
  payToCity: string;
  payToState: string;
  payToZip: string;
  payToTaxId: string;
  phone: string;
  fax: string;
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
  { id: "PRV-001", practiceName: "Cleveland Family Medicine", servicingNpi: "1111111111", primaryTaxonomy: "207Q00000X", primaryTaxonomyDesc: "Family Medicine - Provides comprehensive primary care for patients of all ages including prevention, diagnosis, and treatment.", secondaryTaxonomy: "207QA0505X", secondaryTaxonomyDesc: "Adult Medicine - Focuses on the prevention, diagnosis, and treatment of diseases in adults.", payToNpi: "1234567890", payToName: "Cleveland Family Medicine LLC", taxId: "34-1234567", type: "Group Practice", specialty: "Family Medicine", address: "123 Medical Center Dr", city: "Cleveland", state: "OH", zip: "44101", payToAddress: "P.O. Box 1234", payToCity: "Cleveland", payToState: "OH", payToZip: "44101", payToTaxId: "34-1234567", phone: "(555) 123-4567", fax: "(555) 123-4568", email: "info@clevelandfm.com", contactName: "Mary Johnson", status: "active", contractStart: "2024-01-15", contractEnd: "2027-01-14", discountType: "% Off Billed", discountRate: "35%", serviceOverrides: [{ service: "Office Visit", rate: "40%" }] },
  { id: "PRV-002", practiceName: "Dr. Sarah Chen, MD", servicingNpi: "2345678901", primaryTaxonomy: "207R00000X", primaryTaxonomyDesc: "Internal Medicine - Specializes in prevention, diagnosis, and treatment of adult diseases and complex medical conditions.", secondaryTaxonomy: "207RG0100X", secondaryTaxonomyDesc: "Gastroenterology - Focuses on digestive system disorders including stomach, intestines, liver, and pancreas.", payToNpi: "2345678901", payToName: "Sarah Chen MD PC", taxId: "34-2345678", type: "Individual", specialty: "Internal Medicine", address: "456 Health Blvd", city: "Lakewood", state: "OH", zip: "44107", payToAddress: "456 Health Blvd", payToCity: "Lakewood", payToState: "OH", payToZip: "44107", payToTaxId: "34-2345678", phone: "(555) 234-5678", fax: "(555) 234-5679", email: "dr.chen@medical.com", contactName: "Dr. Sarah Chen", status: "active", contractStart: "2025-03-01", contractEnd: "2028-02-28", discountType: "% of Medicare", discountRate: "115%" },
  { id: "PRV-003", practiceName: "Metro Imaging Center", servicingNpi: "3333333333", primaryTaxonomy: "261QR0200X", primaryTaxonomyDesc: "Radiology Clinic - Facility providing diagnostic imaging services including X-ray, CT, and ultrasound.", secondaryTaxonomy: "261QM1200X", secondaryTaxonomyDesc: "MRI Clinic - Specialized facility for magnetic resonance imaging diagnostic services.", payToNpi: "3456789012", payToName: "Metro Imaging Center Inc", taxId: "34-3456789", type: "Facility", specialty: "Diagnostic Imaging", address: "789 Imaging Way", city: "Cleveland", state: "OH", zip: "44102", payToAddress: "789 Imaging Way, Suite 100", payToCity: "Cleveland", payToState: "OH", payToZip: "44102", payToTaxId: "34-3456789", phone: "(555) 345-6789", fax: "(555) 345-6780", email: "scheduling@metroimaging.com", contactName: "Tom Richards", status: "active", contractStart: "2023-06-15", contractEnd: "2026-06-14", discountType: "Case Rate", discountRate: "See Schedule" },
  { id: "PRV-004", practiceName: "Cleveland Orthopedic Associates", servicingNpi: "4444444444", primaryTaxonomy: "207X00000X", primaryTaxonomyDesc: "Orthopedic Surgery - Specializes in musculoskeletal system including bones, joints, ligaments, and muscles.", secondaryTaxonomy: "207XS0114X", secondaryTaxonomyDesc: "Sports Medicine - Focuses on prevention and treatment of sports and exercise-related injuries.", payToNpi: "9999999991", payToName: "COA Billing Services LLC", taxId: "34-4567890", type: "Group Practice", specialty: "Orthopedics", address: "321 Bone & Joint Dr", city: "Beachwood", state: "OH", zip: "44122", payToAddress: "P.O. Box 5678", payToCity: "Beachwood", payToState: "OH", payToZip: "44122", payToTaxId: "34-9999991", phone: "(555) 456-7890", fax: "(555) 456-7891", email: "contact@clevortho.com", contactName: "James Miller", status: "active", contractStart: "2024-09-01", contractEnd: "2027-08-31", discountType: "% Off Billed", discountRate: "40%" },
  { id: "PRV-005", practiceName: "Dr. James Wilson, DO", servicingNpi: "5678901234", primaryTaxonomy: "207Q00000X", primaryTaxonomyDesc: "Family Medicine - Provides comprehensive primary care for patients of all ages including prevention, diagnosis, and treatment.", secondaryTaxonomy: "", secondaryTaxonomyDesc: "", payToNpi: "5678901234", payToName: "James Wilson DO", taxId: "34-5678901", type: "Individual", specialty: "Family Medicine", address: "654 Wellness Ave", city: "Mentor", state: "OH", zip: "44060", payToAddress: "654 Wellness Ave", payToCity: "Mentor", payToState: "OH", payToZip: "44060", payToTaxId: "34-5678901", phone: "(555) 567-8901", fax: "(555) 567-8902", email: "jwilson@healthcare.com", contactName: "Dr. James Wilson", status: "pending", contractStart: "Pending", contractEnd: "Pending", discountType: "TBD", discountRate: "TBD" },
  { id: "PRV-006", practiceName: "Westlake Urgent Care", servicingNpi: "6666666666", primaryTaxonomy: "261QU0200X", primaryTaxonomyDesc: "Urgent Care Clinic - Facility providing immediate care for non-life-threatening injuries and illnesses.", secondaryTaxonomy: "207P00000X", secondaryTaxonomyDesc: "Emergency Medicine - Specializes in acute illness and injury requiring immediate medical attention.", payToNpi: "6789012345", payToName: "Westlake Urgent Care LLC", taxId: "34-6789012", type: "Facility", specialty: "Urgent Care", address: "987 Quick Care Blvd", city: "Westlake", state: "OH", zip: "44145", payToAddress: "987 Quick Care Blvd", payToCity: "Westlake", payToState: "OH", payToZip: "44145", payToTaxId: "34-6789012", phone: "(555) 678-9012", fax: "(555) 678-9013", email: "info@westlakeuc.com", contactName: "Patricia Lee", status: "active", contractStart: "2025-01-01", contractEnd: "2028-12-31", discountType: "% Off Billed", discountRate: "30%" },
  { id: "PRV-007", practiceName: "Cleveland Cardiology Associates", servicingNpi: "9999999999", primaryTaxonomy: "207RC0000X", primaryTaxonomyDesc: "Cardiovascular Disease - Specializes in disorders of the heart and blood vessels including diagnosis and treatment.", secondaryTaxonomy: "207RI0011X", secondaryTaxonomyDesc: "Interventional Cardiology - Performs catheter-based treatments for heart disease including stents and angioplasty.", payToNpi: "9012345678", payToName: "CCA Management Group", taxId: "34-9012345", type: "Group Practice", specialty: "Cardiology", address: "369 Heart Center Dr", city: "Cleveland", state: "OH", zip: "44104", payToAddress: "P.O. Box 9012", payToCity: "Cleveland", payToState: "OH", payToZip: "44104", payToTaxId: "34-9012000", phone: "(555) 901-2345", fax: "(555) 901-2346", email: "info@clevcardio.com", contactName: "Robert Thompson", status: "active", contractStart: "2024-03-15", contractEnd: "2027-03-14", discountType: "% of Medicare", discountRate: "130%" },
  { id: "PRV-008", practiceName: "Quest Diagnostics Cleveland", servicingNpi: "8888888888", primaryTaxonomy: "291U00000X", primaryTaxonomyDesc: "Clinical Laboratory - Facility performing diagnostic testing on blood, tissue, and other specimens.", secondaryTaxonomy: "292200000X", secondaryTaxonomyDesc: "Pathology Laboratory - Specializes in examining tissues and cells to diagnose disease.", payToNpi: "8901234567", payToName: "Quest Diagnostics Incorporated", taxId: "34-8901234", type: "Facility", specialty: "Laboratory", address: "258 Lab Services Rd", city: "Cleveland", state: "OH", zip: "44103", payToAddress: "Quest Diagnostics, P.O. Box 2001", payToCity: "Pittsburgh", payToState: "PA", payToZip: "15230", payToTaxId: "16-1210695", phone: "(555) 890-1234", fax: "(555) 890-1235", email: "clevelandlab@quest.com", contactName: "Lab Admin", status: "active", contractStart: "2023-01-01", contractEnd: "2026-12-31", discountType: "% Off Billed", discountRate: "45%" },
  { id: "PRV-009", practiceName: "Physical Therapy Plus", servicingNpi: "1122334455", primaryTaxonomy: "225100000X", primaryTaxonomyDesc: "Physical Therapist - Provides treatment to restore function, improve mobility, and relieve pain through exercise and manual therapy.", secondaryTaxonomy: "2251S0007X", secondaryTaxonomyDesc: "Orthopedic Physical Therapy - Specializes in treatment of musculoskeletal injuries and post-surgical rehabilitation.", payToNpi: "1122334455", payToName: "Physical Therapy Plus Inc", taxId: "34-1122334", type: "Group Practice", specialty: "Physical Therapy", address: "852 Rehab Road", city: "Brooklyn", state: "OH", zip: "44144", payToAddress: "852 Rehab Road", payToCity: "Brooklyn", payToState: "OH", payToZip: "44144", payToTaxId: "34-1122334", phone: "(555) 112-2334", fax: "(555) 112-2335", email: "schedule@ptplus.com", contactName: "Linda White", status: "active", contractStart: "2024-05-01", contractEnd: "2027-04-30", discountType: "% of Medicare", discountRate: "100%" },
  { id: "PRV-010", practiceName: "Inactive Provider LLC", servicingNpi: "9900112233", primaryTaxonomy: "208600000X", primaryTaxonomyDesc: "Surgery - Physician specializing in operative procedures to treat diseases, injuries, and deformities.", secondaryTaxonomy: "2086S0102X", secondaryTaxonomyDesc: "General Surgery - Performs a wide range of surgical procedures on abdomen, digestive tract, and other areas.", payToNpi: "9900112233", payToName: "Inactive Provider LLC", taxId: "34-9900112", type: "Group Practice", specialty: "General Surgery", address: "147 Old Surgery Ln", city: "Akron", state: "OH", zip: "44301", payToAddress: "147 Old Surgery Ln", payToCity: "Akron", payToState: "OH", payToZip: "44301", payToTaxId: "34-9900112", phone: "(555) 990-0112", fax: "(555) 990-0113", email: "contact@inactive.com", contactName: "N/A", status: "inactive", contractStart: "2019-01-01", contractEnd: "2022-12-31", discountType: "Terminated", discountRate: "N/A" },
];

const statusOptions = ["All", "Active", "Pending", "Inactive"];
const typeOptions = ["All Types", "Individual", "Group Practice", "Facility"];
const specialties = ["Family Medicine", "Internal Medicine", "Pediatrics", "Cardiology", "Orthopedics", "Diagnostic Imaging", "Laboratory", "Urgent Care", "Physical Therapy", "General Surgery"];

export default function ProvidersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [modalTab, setModalTab] = useState<"details" | "payto" | "contract">("details");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Provider | null>(null);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const filteredProviders = providers.filter((provider) => {
    const matchesSearch = provider.practiceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.servicingNpi.includes(searchQuery) ||
      provider.payToNpi.includes(searchQuery) ||
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

  const openProviderModal = (provider: Provider) => {
    setSelectedProvider(provider);
    setModalTab("details");
    setIsEditing(false);
    setEditForm(null);
  };

  const startEditing = () => {
    if (selectedProvider) {
      setEditForm({ ...selectedProvider });
      setIsEditing(true);
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditForm(null);
  };

  const saveChanges = () => {
    // In a real app, this would save to the database
    setShowSaveSuccess(true);
    setTimeout(() => {
      setShowSaveSuccess(false);
      setIsEditing(false);
      if (editForm) {
        setSelectedProvider(editForm);
      }
    }, 1500);
  };

  const updateEditForm = (field: keyof Provider, value: string) => {
    if (editForm) {
      setEditForm({ ...editForm, [field]: value });
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
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">NPI</th>
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
                      <div><span className="text-slate-500">Servicing:</span> <span className="text-slate-300">{provider.servicingNpi}</span></div>
                      <div><span className="text-slate-500">Pay-To:</span> <span className="text-cyan-400">{provider.payToNpi}</span></div>
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
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openProviderModal(provider)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-700 text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-600 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <button
                        onClick={() => {
                          setSelectedProvider(provider);
                          setEditForm({ ...provider });
                          setIsEditing(true);
                          setModalTab("details");
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                    </div>
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => { setSelectedProvider(null); setIsEditing(false); }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto border border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-700 flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">{isEditing && editForm ? editForm.practiceName : selectedProvider.practiceName}</h2>
                  <p className="text-slate-400">{selectedProvider.specialty} • {selectedProvider.type}</p>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(selectedProvider.status)}
                  <button onClick={() => { setSelectedProvider(null); setIsEditing(false); }} className="text-slate-400 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="px-6 pt-4 flex gap-2 border-b border-slate-700">
                <button
                  onClick={() => setModalTab("details")}
                  className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${
                    modalTab === "details" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Provider Details
                </button>
                <button
                  onClick={() => setModalTab("payto")}
                  className={`px-4 py-2 font-medium rounded-t-lg transition-colors flex items-center gap-2 ${
                    modalTab === "payto" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  Pay-To Info
                </button>
                <button
                  onClick={() => setModalTab("contract")}
                  className={`px-4 py-2 font-medium rounded-t-lg transition-colors flex items-center gap-2 ${
                    modalTab === "contract" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Contract Document
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {modalTab === "details" ? (
                  isEditing && editForm ? (
                    /* Edit Mode */
                    <div className="space-y-6">
                      {/* Practice Info */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-400 mb-2">Practice Name</label>
                          <input
                            type="text"
                            value={editForm.practiceName}
                            onChange={(e) => updateEditForm("practiceName", e.target.value)}
                            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-400 mb-2">Specialty</label>
                          <select
                            value={editForm.specialty}
                            onChange={(e) => updateEditForm("specialty", e.target.value)}
                            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                          >
                            {specialties.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      </div>

                      {/* NPIs */}
                      <div className="bg-slate-700/30 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-4">NPI & Tax Information</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-slate-500 mb-1">Servicing Provider NPI</label>
                            <input
                              type="text"
                              value={editForm.servicingNpi}
                              onChange={(e) => updateEditForm("servicingNpi", e.target.value)}
                              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-slate-500 mb-1">Tax ID / EIN</label>
                            <input
                              type="text"
                              value={editForm.taxId}
                              onChange={(e) => updateEditForm("taxId", e.target.value)}
                              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Taxonomy Codes */}
                      <div className="bg-slate-700/30 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-4">Taxonomy Codes</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-slate-500 mb-1">Primary Taxonomy Code</label>
                            <input
                              type="text"
                              value={editForm.primaryTaxonomy}
                              onChange={(e) => updateEditForm("primaryTaxonomy", e.target.value)}
                              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white font-mono focus:outline-none focus:ring-2 focus:ring-teal-500 mb-2"
                              placeholder="e.g., 207Q00000X"
                            />
                            <input
                              type="text"
                              value={editForm.primaryTaxonomyDesc}
                              onChange={(e) => updateEditForm("primaryTaxonomyDesc", e.target.value)}
                              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                              placeholder="Description"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-slate-500 mb-1">Secondary Taxonomy Code</label>
                            <input
                              type="text"
                              value={editForm.secondaryTaxonomy}
                              onChange={(e) => updateEditForm("secondaryTaxonomy", e.target.value)}
                              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white font-mono focus:outline-none focus:ring-2 focus:ring-teal-500 mb-2"
                              placeholder="e.g., 207QA0505X"
                            />
                            <input
                              type="text"
                              value={editForm.secondaryTaxonomyDesc}
                              onChange={(e) => updateEditForm("secondaryTaxonomyDesc", e.target.value)}
                              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                              placeholder="Description (optional)"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Contact & Location */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-white">Contact</h3>
                          <input
                            type="text"
                            placeholder="Contact Name"
                            value={editForm.contactName}
                            onChange={(e) => updateEditForm("contactName", e.target.value)}
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                          />
                          <input
                            type="tel"
                            placeholder="Phone"
                            value={editForm.phone}
                            onChange={(e) => updateEditForm("phone", e.target.value)}
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                          />
                          <input
                            type="tel"
                            placeholder="Fax"
                            value={editForm.fax}
                            onChange={(e) => updateEditForm("fax", e.target.value)}
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                          />
                          <input
                            type="email"
                            placeholder="Email"
                            value={editForm.email}
                            onChange={(e) => updateEditForm("email", e.target.value)}
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                          />
                        </div>
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-white">Location Address</h3>
                          <input
                            type="text"
                            placeholder="Street Address"
                            value={editForm.address}
                            onChange={(e) => updateEditForm("address", e.target.value)}
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                          />
                          <div className="grid grid-cols-3 gap-2">
                            <input
                              type="text"
                              placeholder="City"
                              value={editForm.city}
                              onChange={(e) => updateEditForm("city", e.target.value)}
                              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                            <input
                              type="text"
                              placeholder="State"
                              value={editForm.state}
                              onChange={(e) => updateEditForm("state", e.target.value)}
                              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                            <input
                              type="text"
                              placeholder="ZIP"
                              value={editForm.zip}
                              onChange={(e) => updateEditForm("zip", e.target.value)}
                              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Pay-To Address */}
                      <div className="bg-slate-700/30 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-4">Pay-To Address</h3>
                        <input
                          type="text"
                          placeholder="Pay-To Street Address"
                          value={editForm.payToAddress}
                          onChange={(e) => updateEditForm("payToAddress", e.target.value)}
                          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500 mb-4"
                        />
                        <div className="grid grid-cols-3 gap-2">
                          <input
                            type="text"
                            placeholder="City"
                            value={editForm.payToCity}
                            onChange={(e) => updateEditForm("payToCity", e.target.value)}
                            className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                          />
                          <input
                            type="text"
                            placeholder="State"
                            value={editForm.payToState}
                            onChange={(e) => updateEditForm("payToState", e.target.value)}
                            className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                          />
                          <input
                            type="text"
                            placeholder="ZIP"
                            value={editForm.payToZip}
                            onChange={(e) => updateEditForm("payToZip", e.target.value)}
                            className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                          />
                        </div>
                      </div>

                      {/* Contract & Discount */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-white">Contract Dates</h3>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs text-slate-500 mb-1">Start Date</label>
                              <input
                                type="date"
                                value={editForm.contractStart}
                                onChange={(e) => updateEditForm("contractStart", e.target.value)}
                                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-slate-500 mb-1">End Date</label>
                              <input
                                type="date"
                                value={editForm.contractEnd}
                                onChange={(e) => updateEditForm("contractEnd", e.target.value)}
                                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-white">Discount Terms</h3>
                          <select
                            value={editForm.discountType}
                            onChange={(e) => updateEditForm("discountType", e.target.value)}
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                          >
                            <option value="% Off Billed">% Off Billed</option>
                            <option value="% of Medicare">% of Medicare</option>
                            <option value="Case Rate">Case Rate</option>
                            <option value="Flat Rate">Flat Rate</option>
                          </select>
                          <input
                            type="text"
                            placeholder="Discount Rate"
                            value={editForm.discountRate}
                            onChange={(e) => updateEditForm("discountRate", e.target.value)}
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* View Mode */
                    <div className="space-y-6">
                      {/* NPI Section */}
                      <div className="bg-slate-700/30 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-teal-400" />
                          Provider Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Servicing Provider NPI</p>
                            <p className="text-white font-mono text-lg">{selectedProvider.servicingNpi}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Tax ID / EIN</p>
                            <p className="text-white font-mono text-lg">{selectedProvider.taxId}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-600">
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Primary Taxonomy</p>
                            <p className="text-white font-mono">{selectedProvider.primaryTaxonomy}</p>
                            <p className="text-teal-400 text-sm">{selectedProvider.primaryTaxonomyDesc}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Secondary Taxonomy</p>
                            {selectedProvider.secondaryTaxonomy ? (
                              <>
                                <p className="text-white font-mono">{selectedProvider.secondaryTaxonomy}</p>
                                <p className="text-teal-400 text-sm">{selectedProvider.secondaryTaxonomyDesc}</p>
                              </>
                            ) : (
                              <p className="text-slate-500 italic">Not specified</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="bg-slate-700/30 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-teal-400" />
                          Location Address
                        </h3>
                        <p className="text-slate-300">{selectedProvider.address}</p>
                        <p className="text-slate-300">{selectedProvider.city}, {selectedProvider.state} {selectedProvider.zip}</p>
                      </div>

                      {/* Contact */}
                      <div className="bg-slate-700/30 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <User className="w-4 h-4 text-teal-400" />
                          Contact
                        </h3>
                        <div className="grid md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Contact Name</p>
                            <p className="text-slate-300">{selectedProvider.contactName}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Phone</p>
                            <p className="text-slate-300">{selectedProvider.phone}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Fax</p>
                            <p className="text-slate-300">{selectedProvider.fax}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Email</p>
                            <p className="text-slate-300">{selectedProvider.email}</p>
                          </div>
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
                        </div>
                      </div>
                    </div>
                  )
                ) : modalTab === "payto" ? (
                  /* Pay-To Info Tab */
                  <div className="space-y-6">
                    {/* Pay-To Entity */}
                    <div className="bg-slate-700/30 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-cyan-400" />
                        Pay-To Entity
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Pay-To Name</p>
                          <p className="text-xl text-cyan-300 font-medium">{selectedProvider.payToName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Pay-To NPI</p>
                          <p className="text-xl text-white font-mono">{selectedProvider.payToNpi}</p>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-600">
                        <p className="text-xs text-slate-500 mb-1">Pay-To Tax ID / EIN</p>
                        <p className="text-lg text-white font-mono">{selectedProvider.payToTaxId}</p>
                      </div>
                    </div>

                    {/* Pay-To Address */}
                    <div className="bg-slate-700/30 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-cyan-400" />
                        Pay-To Address
                      </h3>
                      <div className="space-y-2">
                        <p className="text-lg text-cyan-300">{selectedProvider.payToAddress}</p>
                        <p className="text-lg text-cyan-300">{selectedProvider.payToCity}, {selectedProvider.payToState} {selectedProvider.payToZip}</p>
                      </div>
                    </div>

                    {/* Note */}
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                      <p className="text-sm text-amber-300">
                        <strong>Note:</strong> All payments will be sent to the Pay-To entity listed above. Ensure this information is accurate to avoid payment delays.
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Contract Document Tab */
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-semibold">Provider Network Participation Agreement</h3>
                      <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-700 text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-600 transition-colors">
                        <Download className="w-4 h-4" />
                        Download PDF
                      </button>
                    </div>
                    
                    {/* Sample Contract Preview */}
                    <div className="bg-white rounded-lg p-8 text-slate-900 max-h-96 overflow-y-auto">
                      <div className="text-center mb-6">
                        <h1 className="text-xl font-bold text-slate-800">TRUECARE HEALTH NETWORK</h1>
                        <p className="text-sm text-slate-600">Provider Network Participation Agreement</p>
                      </div>
                      
                      <div className="space-y-4 text-sm">
                        <p className="font-semibold">Contract Reference: CTR-{selectedProvider.id}</p>
                        
                        <div className="border-t border-slate-200 pt-4">
                          <p className="font-semibold mb-2">1. PARTIES</p>
                          <p>This Agreement is entered into between TrueCare Health Network ("Network") and <strong>{selectedProvider.practiceName}</strong> ("Provider"), NPI: {selectedProvider.servicingNpi}.</p>
                        </div>
                        
                        <div className="border-t border-slate-200 pt-4">
                          <p className="font-semibold mb-2">2. TERM</p>
                          <p>This Agreement shall commence on <strong>{selectedProvider.contractStart}</strong> and continue through <strong>{selectedProvider.contractEnd}</strong>, unless earlier terminated in accordance with this Agreement.</p>
                        </div>
                        
                        <div className="border-t border-slate-200 pt-4">
                          <p className="font-semibold mb-2">3. COMPENSATION</p>
                          <p>Network shall compensate Provider according to the following schedule:</p>
                          <ul className="list-disc list-inside mt-2 ml-4">
                            <li>Discount Type: <strong>{selectedProvider.discountType}</strong></li>
                            <li>Discount Rate: <strong>{selectedProvider.discountRate}</strong></li>
                          </ul>
                        </div>
                        
                        <div className="border-t border-slate-200 pt-4">
                          <p className="font-semibold mb-2">4. PROVIDER INFORMATION</p>
                          <ul className="list-disc list-inside mt-2 ml-4">
                            <li>Tax ID: {selectedProvider.taxId}</li>
                            <li>Servicing NPI: {selectedProvider.servicingNpi}</li>
                            <li>Pay-To NPI: {selectedProvider.payToNpi}</li>
                            <li>Address: {selectedProvider.address}, {selectedProvider.city}, {selectedProvider.state} {selectedProvider.zip}</li>
                          </ul>
                        </div>
                        
                        <div className="border-t border-slate-200 pt-4">
                          <p className="font-semibold mb-2">5. OBLIGATIONS</p>
                          <p>Provider agrees to provide healthcare services to Network members in accordance with all applicable laws, regulations, and professional standards.</p>
                        </div>
                        
                        <div className="border-t border-slate-200 pt-4">
                          <p className="font-semibold mb-2">6. TERMINATION</p>
                          <p>Either party may terminate this Agreement with 90 days written notice. Immediate termination may occur for cause, including loss of licensure or material breach.</p>
                        </div>
                        
                        <div className="border-t border-slate-200 pt-4 mt-8">
                          <div className="grid grid-cols-2 gap-8 mt-4">
                            <div>
                              <p className="font-semibold">TrueCare Health Network</p>
                              <div className="border-b border-slate-400 mt-8 mb-2"></div>
                              <p className="text-xs text-slate-500">Authorized Signature</p>
                            </div>
                            <div>
                              <p className="font-semibold">{selectedProvider.practiceName}</p>
                              <div className="border-b border-slate-400 mt-8 mb-2"></div>
                              <p className="text-xs text-slate-500">Provider Signature</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-slate-700 flex justify-end gap-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={cancelEditing}
                      className="px-4 py-2 bg-slate-700 text-slate-300 font-medium rounded-lg hover:bg-slate-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveChanges}
                      className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {showSaveSuccess ? "Saved!" : "Save Changes"}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => { setSelectedProvider(null); setIsEditing(false); }}
                      className="px-4 py-2 bg-slate-700 text-slate-300 font-medium rounded-lg hover:bg-slate-600 transition-colors"
                    >
                      Close
                    </button>
                    <button
                      onClick={startEditing}
                      className="px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Provider
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
