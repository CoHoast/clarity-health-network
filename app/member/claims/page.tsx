"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
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
  Stethoscope,
  Building2,
  Eye,
  MoreHorizontal,
  Plus,
  RefreshCw,
} from "lucide-react";

const claims = [
  {
    id: "CLM-2024-001",
    provider: "Dr. Sarah Chen",
    providerType: "Primary Care",
    service: "Office Visit - Established Patient",
    serviceCode: "99213",
    dateOfService: "Mar 8, 2024",
    dateSubmitted: "Mar 9, 2024",
    billedAmount: 150.00,
    allowedAmount: 120.00,
    planPaid: 96.00,
    youOwe: 24.00,
    status: "processed",
    eobAvailable: true,
  },
  {
    id: "CLM-2024-002",
    provider: "LabCorp",
    providerType: "Laboratory",
    service: "Comprehensive Metabolic Panel",
    serviceCode: "80053",
    dateOfService: "Mar 5, 2024",
    dateSubmitted: "Mar 6, 2024",
    billedAmount: 245.00,
    allowedAmount: null,
    planPaid: null,
    youOwe: null,
    status: "processing",
    eobAvailable: false,
  },
  {
    id: "CLM-2024-003",
    provider: "CVS Pharmacy",
    providerType: "Pharmacy",
    service: "Lisinopril 10mg (30-day supply)",
    serviceCode: "RX",
    dateOfService: "Mar 1, 2024",
    dateSubmitted: "Mar 1, 2024",
    billedAmount: 45.00,
    allowedAmount: 45.00,
    planPaid: 35.00,
    youOwe: 10.00,
    status: "completed",
    eobAvailable: true,
  },
  {
    id: "CLM-2024-004",
    provider: "Cleveland Imaging Center",
    providerType: "Radiology",
    service: "X-Ray, Chest (2 views)",
    serviceCode: "71046",
    dateOfService: "Feb 28, 2024",
    dateSubmitted: "Feb 29, 2024",
    billedAmount: 320.00,
    allowedAmount: 185.00,
    planPaid: 148.00,
    youOwe: 37.00,
    status: "processed",
    eobAvailable: true,
  },
  {
    id: "CLM-2024-005",
    provider: "Dr. Michael Roberts",
    providerType: "Primary Care",
    service: "Annual Wellness Visit",
    serviceCode: "99395",
    dateOfService: "Feb 15, 2024",
    dateSubmitted: "Feb 16, 2024",
    billedAmount: 275.00,
    allowedAmount: 275.00,
    planPaid: 275.00,
    youOwe: 0,
    status: "completed",
    eobAvailable: true,
  },
  {
    id: "CLM-2024-006",
    provider: "Urgent Care Plus",
    providerType: "Urgent Care",
    service: "Urgent Care Visit",
    serviceCode: "99203",
    dateOfService: "Feb 10, 2024",
    dateSubmitted: "Feb 11, 2024",
    billedAmount: 185.00,
    allowedAmount: 150.00,
    planPaid: 100.00,
    youOwe: 50.00,
    status: "completed",
    eobAvailable: true,
  },
  {
    id: "CLM-2024-007",
    provider: "Dr. Emily Watson",
    providerType: "Dermatology",
    service: "New Patient Visit",
    serviceCode: "99203",
    dateOfService: "Feb 5, 2024",
    dateSubmitted: "Feb 6, 2024",
    billedAmount: 225.00,
    allowedAmount: 0,
    planPaid: 0,
    youOwe: 225.00,
    status: "denied",
    denialReason: "Service not covered - cosmetic procedure",
    eobAvailable: true,
  },
];

const statusFilters = [
  { label: "All Claims", value: "all" },
  { label: "Processing", value: "processing" },
  { label: "Processed", value: "processed" },
  { label: "Completed", value: "completed" },
  { label: "Denied", value: "denied" },
];

export default function ClaimsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedClaim, setSelectedClaim] = useState<typeof claims[0] | null>(null);

  const filteredClaims = claims.filter((claim) => {
    const matchesSearch =
      claim.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || claim.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "processing":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full">
            <Clock className="w-3 h-3" /> Processing
          </span>
        );
      case "processed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
            <CheckCircle2 className="w-3 h-3" /> Processed
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
            <CheckCircle2 className="w-3 h-3" /> Completed
          </span>
        );
      case "denied":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-full">
            <XCircle className="w-3 h-3" /> Denied
          </span>
        );
      default:
        return null;
    }
  };

  const totals = {
    billed: claims.reduce((sum, c) => sum + c.billedAmount, 0),
    planPaid: claims.reduce((sum, c) => sum + (c.planPaid || 0), 0),
    youOwe: claims.reduce((sum, c) => sum + (c.youOwe || 0), 0),
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Claims</h1>
          <p className="text-gray-500 mt-1">View and track your healthcare claims</p>
        </div>
        <div className="flex gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <Link
            href="/member/claims/submit"
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Submit Claim
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Total Billed</p>
          <p className="text-2xl font-bold text-gray-900">${totals.billed.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Plan Paid</p>
          <p className="text-2xl font-bold text-green-600">${totals.planPaid.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">You Owe</p>
          <p className="text-2xl font-bold text-gray-900">${totals.youOwe.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by provider, service, or claim ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                statusFilter === filter.value
                  ? "bg-teal-600 text-white"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Claims List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Claim Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Billed
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan Paid
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  You Owe
                </th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredClaims.map((claim) => (
                <tr
                  key={claim.id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedClaim(claim)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        {claim.providerType === "Laboratory" ? (
                          <FileText className="w-5 h-5 text-gray-600" />
                        ) : claim.providerType === "Pharmacy" ? (
                          <FileText className="w-5 h-5 text-gray-600" />
                        ) : claim.providerType === "Radiology" ? (
                          <Building2 className="w-5 h-5 text-gray-600" />
                        ) : (
                          <Stethoscope className="w-5 h-5 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{claim.provider}</p>
                        <p className="text-sm text-gray-500">{claim.service}</p>
                        <p className="text-xs text-gray-400">{claim.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{claim.dateOfService}</p>
                    <p className="text-xs text-gray-500">Submitted: {claim.dateSubmitted}</p>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(claim.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="font-medium text-gray-900">${claim.billedAmount.toFixed(2)}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {claim.planPaid !== null ? (
                      <p className="font-medium text-green-600">${claim.planPaid.toFixed(2)}</p>
                    ) : (
                      <p className="text-gray-400">—</p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {claim.youOwe !== null ? (
                      <p className={`font-medium ${claim.youOwe === 0 ? "text-green-600" : "text-gray-900"}`}>
                        ${claim.youOwe.toFixed(2)}
                      </p>
                    ) : (
                      <p className="text-gray-400">—</p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden divide-y divide-gray-100">
          {filteredClaims.map((claim) => (
            <div
              key={claim.id}
              className="p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => setSelectedClaim(claim)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Stethoscope className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{claim.provider}</p>
                    <p className="text-sm text-gray-500">{claim.dateOfService}</p>
                  </div>
                </div>
                {getStatusBadge(claim.status)}
              </div>
              <p className="text-sm text-gray-600 mb-3">{claim.service}</p>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Billed: ${claim.billedAmount.toFixed(2)}</span>
                <span className="font-medium text-gray-900">
                  You owe: {claim.youOwe !== null ? `$${claim.youOwe.toFixed(2)}` : "—"}
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredClaims.length === 0 && (
          <div className="py-12 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No claims found matching your filters</p>
          </div>
        )}
      </div>

      {/* Claim Detail Modal */}
      {selectedClaim && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedClaim(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Claim Details</h3>
                <p className="text-sm text-gray-500">{selectedClaim.id}</p>
              </div>
              {getStatusBadge(selectedClaim.status)}
            </div>

            <div className="p-6 space-y-6">
              {/* Provider Info */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Provider</h4>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                    <Stethoscope className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{selectedClaim.provider}</p>
                    <p className="text-sm text-gray-500">{selectedClaim.providerType}</p>
                  </div>
                </div>
              </div>

              {/* Service */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Service</h4>
                <p className="text-gray-900">{selectedClaim.service}</p>
                <p className="text-sm text-gray-500">Code: {selectedClaim.serviceCode}</p>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Date of Service</h4>
                  <p className="text-gray-900">{selectedClaim.dateOfService}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Date Submitted</h4>
                  <p className="text-gray-900">{selectedClaim.dateSubmitted}</p>
                </div>
              </div>

              {/* Amounts */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Amount Billed</span>
                  <span className="font-medium text-gray-900">${selectedClaim.billedAmount.toFixed(2)}</span>
                </div>
                {selectedClaim.allowedAmount !== null && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Allowed Amount</span>
                    <span className="text-gray-900">${selectedClaim.allowedAmount.toFixed(2)}</span>
                  </div>
                )}
                {selectedClaim.planPaid !== null && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Plan Paid</span>
                    <span className="text-green-600 font-medium">${selectedClaim.planPaid.toFixed(2)}</span>
                  </div>
                )}
                <hr className="border-gray-200" />
                <div className="flex justify-between text-lg">
                  <span className="font-medium text-gray-900">You Owe</span>
                  <span className={`font-bold ${selectedClaim.youOwe === 0 ? "text-green-600" : "text-gray-900"}`}>
                    {selectedClaim.youOwe !== null ? `$${selectedClaim.youOwe.toFixed(2)}` : "Pending"}
                  </span>
                </div>
              </div>

              {/* Denial Reason */}
              {selectedClaim.status === "denied" && selectedClaim.denialReason && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                    <div>
                      <p className="font-medium text-red-900">Claim Denied</p>
                      <p className="text-sm text-red-700">{selectedClaim.denialReason}</p>
                      <button className="text-sm text-red-600 font-medium hover:text-red-700 mt-2">
                        File an Appeal →
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
              {selectedClaim.eobAvailable && (
                <Link
                  href="/docs/eob"
                  className="flex-1 px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  View EOB
                </Link>
              )}
              <button
                onClick={() => setSelectedClaim(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
