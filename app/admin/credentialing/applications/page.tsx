"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Download,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  MoreVertical,
  BadgeCheck,
  FileText,
  Calendar,
  X,
  Plus,
  User,
  Building2,
  Shield,
  Mail,
  Phone,
  MapPin,
  Zap,
  RefreshCw,
  Upload,
  Send,
  Filter,
  ChevronLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/admin/ThemeContext";
import { StatCard } from "@/components/admin/ui/StatCard";
import { Badge } from "@/components/admin/ui/Badge";
import { Button, IconButton } from "@/components/admin/ui/Button";
import { SearchInput } from "@/components/admin/ui/SearchInput";
import { cn } from "@/lib/utils";

const applications = [
  { 
    id: "CRED-2024-1247", provider: "Dr. Sarah Mitchell", npi: "1234567890", specialty: "Cardiology", status: "verification", submitted: "2024-03-10", stage: "PSV In Progress", type: "initial", practice: "Cleveland Heart Center", email: "dr.mitchell@cardio.com", phone: "(555) 123-4567",
    address: "4500 Euclid Ave, Suite 201, Cleveland, OH 44103",
    licenseNumber: "MD-35-087654",
    licenseState: "OH",
    licenseExpiry: "2026-08-15",
    deaNumber: "AM1234567",
    boardCertified: true,
    boardCertification: "American Board of Internal Medicine - Cardiovascular Disease",
    documents: [
      { name: "Medical License", status: "received", date: "2024-03-10" },
      { name: "DEA Certificate", status: "received", date: "2024-03-10" },
      { name: "Board Certification", status: "received", date: "2024-03-11" },
      { name: "Malpractice Insurance COI", status: "pending", date: null },
      { name: "CV/Resume", status: "received", date: "2024-03-10" },
      { name: "W-9 Form", status: "pending", date: null },
    ],
    verifications: [
      { type: "NPI Validation", status: "passed", date: "2024-03-11" },
      { type: "OIG Exclusion", status: "passed", date: "2024-03-11" },
      { type: "SAM.gov", status: "passed", date: "2024-03-11" },
      { type: "License Verification", status: "pending", date: null },
    ]
  },
  { 
    id: "CRED-2024-1246", provider: "Dr. James Wilson", npi: "2345678901", specialty: "Orthopedics", status: "review", submitted: "2024-03-08", stage: "Ready for Review", type: "initial", practice: "Wilson Orthopedics", email: "dr.wilson@ortho.com", phone: "(555) 234-5678",
    address: "1200 Medical Center Dr, Beachwood, OH 44122",
    licenseNumber: "MD-35-076543",
    licenseState: "OH",
    licenseExpiry: "2025-12-31",
    deaNumber: "AW2345678",
    boardCertified: true,
    boardCertification: "American Board of Orthopaedic Surgery",
    documents: [
      { name: "Medical License", status: "received", date: "2024-03-08" },
      { name: "DEA Certificate", status: "received", date: "2024-03-08" },
      { name: "Board Certification", status: "received", date: "2024-03-08" },
      { name: "Malpractice Insurance COI", status: "received", date: "2024-03-09" },
      { name: "CV/Resume", status: "received", date: "2024-03-08" },
      { name: "W-9 Form", status: "received", date: "2024-03-08" },
    ],
    verifications: [
      { type: "NPI Validation", status: "passed", date: "2024-03-09" },
      { type: "OIG Exclusion", status: "passed", date: "2024-03-09" },
      { type: "SAM.gov", status: "passed", date: "2024-03-09" },
      { type: "License Verification", status: "passed", date: "2024-03-10" },
    ]
  },
  { 
    id: "CRED-2024-1245", provider: "Metro Imaging Center", npi: "3456789012", specialty: "Radiology", status: "approved", submitted: "2024-03-05", stage: "Complete", type: "initial", practice: "Metro Imaging Center", email: "admin@metroimaging.com", phone: "(555) 345-6789",
    address: "789 Imaging Way, Cleveland, OH 44115",
    licenseNumber: "FAC-45-001234",
    licenseState: "OH",
    licenseExpiry: "2025-06-30",
    documents: [
      { name: "Facility License", status: "received", date: "2024-03-05" },
      { name: "Accreditation Certificate", status: "received", date: "2024-03-05" },
      { name: "Malpractice Insurance COI", status: "received", date: "2024-03-05" },
      { name: "W-9 Form", status: "received", date: "2024-03-05" },
    ],
    verifications: [
      { type: "NPI Validation", status: "passed", date: "2024-03-06" },
      { type: "OIG Exclusion", status: "passed", date: "2024-03-06" },
      { type: "SAM.gov", status: "passed", date: "2024-03-06" },
      { type: "Facility Accreditation", status: "passed", date: "2024-03-07" },
    ]
  },
  { 
    id: "CRED-2024-1244", provider: "Dr. Emily Chen", npi: "4567890123", specialty: "Pediatrics", status: "verification", submitted: "2024-03-03", stage: "Document Review", type: "initial", practice: "Lakeside Pediatrics", email: "dr.chen@pediatrics.com", phone: "(555) 456-7890",
    address: "5678 Lake Shore Blvd, Mentor, OH 44060",
    licenseNumber: "MD-35-098765",
    licenseState: "OH",
    licenseExpiry: "2027-03-31",
    deaNumber: "AC4567890",
    boardCertified: true,
    boardCertification: "American Board of Pediatrics",
    documents: [
      { name: "Medical License", status: "received", date: "2024-03-03" },
      { name: "DEA Certificate", status: "pending", date: null },
      { name: "Board Certification", status: "received", date: "2024-03-03" },
      { name: "Malpractice Insurance COI", status: "received", date: "2024-03-04" },
      { name: "CV/Resume", status: "received", date: "2024-03-03" },
      { name: "W-9 Form", status: "pending", date: null },
    ],
    verifications: [
      { type: "NPI Validation", status: "passed", date: "2024-03-04" },
      { type: "OIG Exclusion", status: "passed", date: "2024-03-04" },
      { type: "SAM.gov", status: "pending", date: null },
      { type: "License Verification", status: "pending", date: null },
    ]
  },
  { 
    id: "CRED-2024-1243", provider: "Cleveland Physical Therapy", npi: "5678901234", specialty: "Physical Therapy", status: "approved", submitted: "2024-02-28", stage: "Complete", type: "initial", practice: "Cleveland Physical Therapy", email: "info@clevelandpt.com", phone: "(555) 567-8901",
    address: "3456 Therapy Lane, Parma, OH 44134",
    licenseNumber: "PT-35-012345",
    licenseState: "OH",
    licenseExpiry: "2025-09-30",
    documents: [
      { name: "PT License", status: "received", date: "2024-02-28" },
      { name: "Malpractice Insurance COI", status: "received", date: "2024-02-28" },
      { name: "W-9 Form", status: "received", date: "2024-02-28" },
    ],
    verifications: [
      { type: "NPI Validation", status: "passed", date: "2024-03-01" },
      { type: "OIG Exclusion", status: "passed", date: "2024-03-01" },
      { type: "SAM.gov", status: "passed", date: "2024-03-01" },
    ]
  },
  { 
    id: "CRED-2024-1242", provider: "Dr. Robert Kim", npi: "6789012345", specialty: "Dermatology", status: "denied", submitted: "2024-02-25", stage: "Failed PSV", type: "initial", practice: "Skin Care Associates", email: "dr.kim@dermatology.com", phone: "(555) 678-9012", denialReason: "Malpractice insurance expired",
    address: "9012 Skin Care Blvd, Westlake, OH 44145",
    licenseNumber: "MD-35-054321",
    licenseState: "OH",
    licenseExpiry: "2024-01-15",
    deaNumber: "AK6789012",
    boardCertified: true,
    boardCertification: "American Board of Dermatology",
    documents: [
      { name: "Medical License", status: "received", date: "2024-02-25" },
      { name: "DEA Certificate", status: "received", date: "2024-02-25" },
      { name: "Board Certification", status: "received", date: "2024-02-25" },
      { name: "Malpractice Insurance COI", status: "expired", date: "2024-02-25" },
      { name: "CV/Resume", status: "received", date: "2024-02-25" },
      { name: "W-9 Form", status: "received", date: "2024-02-25" },
    ],
    verifications: [
      { type: "NPI Validation", status: "passed", date: "2024-02-26" },
      { type: "OIG Exclusion", status: "passed", date: "2024-02-26" },
      { type: "SAM.gov", status: "passed", date: "2024-02-26" },
      { type: "License Verification", status: "failed", date: "2024-02-27" },
      { type: "Malpractice COI", status: "failed", date: "2024-02-27" },
    ]
  },
  { 
    id: "CRED-2024-1241", provider: "Dr. Lisa Martinez", npi: "7890123456", specialty: "Neurology", status: "verification", submitted: "2024-02-20", stage: "Primary Source Verification", type: "recredential", practice: "Neurology Associates", email: "dr.martinez@neuro.com", phone: "(555) 789-0123",
    address: "2345 Neuro Way, Cleveland Heights, OH 44118",
    licenseNumber: "MD-35-065432",
    licenseState: "OH",
    licenseExpiry: "2026-06-30",
    deaNumber: "AM7890123",
    boardCertified: true,
    boardCertification: "American Board of Psychiatry and Neurology",
    documents: [
      { name: "Medical License", status: "received", date: "2024-02-20" },
      { name: "DEA Certificate", status: "received", date: "2024-02-20" },
      { name: "Board Certification", status: "received", date: "2024-02-21" },
      { name: "Malpractice Insurance COI", status: "received", date: "2024-02-22" },
      { name: "CV/Resume", status: "received", date: "2024-02-20" },
      { name: "W-9 Form", status: "received", date: "2024-02-20" },
    ],
    verifications: [
      { type: "NPI Validation", status: "passed", date: "2024-02-21" },
      { type: "OIG Exclusion", status: "passed", date: "2024-02-21" },
      { type: "SAM.gov", status: "passed", date: "2024-02-21" },
      { type: "License Verification", status: "pending", date: null },
    ]
  },
  { 
    id: "CRED-2024-1240", provider: "Westlake Surgery Center", npi: "8901234567", specialty: "Ambulatory Surgery", status: "review", submitted: "2024-02-15", stage: "Committee Review", type: "initial", practice: "Westlake Surgery Center", email: "admin@westlakesurgery.com", phone: "(555) 890-1234",
    address: "1234 Surgery Center Pkwy, Westlake, OH 44145",
    licenseNumber: "ASC-45-005678",
    licenseState: "OH",
    licenseExpiry: "2025-12-31",
    documents: [
      { name: "Facility License", status: "received", date: "2024-02-15" },
      { name: "Accreditation Certificate", status: "received", date: "2024-02-15" },
      { name: "Malpractice Insurance COI", status: "received", date: "2024-02-16" },
      { name: "W-9 Form", status: "received", date: "2024-02-15" },
    ],
    verifications: [
      { type: "NPI Validation", status: "passed", date: "2024-02-16" },
      { type: "OIG Exclusion", status: "passed", date: "2024-02-16" },
      { type: "SAM.gov", status: "passed", date: "2024-02-16" },
      { type: "Facility Accreditation", status: "passed", date: "2024-02-18" },
    ]
  },
];

const stats = [
  { label: "Total Applications", value: "156", trend: "up" as const, change: "+24", icon: <FileText className="w-5 h-5" /> },
  { label: "In Verification", value: "28", trend: "neutral" as const, change: "Processing", icon: <RefreshCw className="w-5 h-5" /> },
  { label: "Ready for Review", value: "12", trend: "warning" as const, change: "Awaiting", icon: <Eye className="w-5 h-5" /> },
  { label: "Approved (YTD)", value: "89", trend: "up" as const, change: "+12", icon: <CheckCircle className="w-5 h-5" /> },
];

const statusFilters = [
  { label: "All", value: "" },
  { label: "Verification", value: "verification" },
  { label: "Review", value: "review" },
  { label: "Approved", value: "approved" },
  { label: "Denied", value: "denied" },
];

const typeFilters = [
  { label: "All Types", value: "" },
  { label: "Initial", value: "initial" },
  { label: "Re-credential", value: "recredential" },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "approved":
      return <Badge variant="success">Approved</Badge>;
    case "review":
      return <Badge variant="info">Ready for Review</Badge>;
    case "verification":
      return <Badge variant="warning">In Verification</Badge>;
    case "denied":
      return <Badge variant="error">Denied</Badge>;
    default:
      return <Badge variant="default">{status}</Badge>;
  }
};

const getTypeBadge = (type: string) => {
  switch (type) {
    case "initial":
      return <Badge variant="info">Initial</Badge>;
    case "recredential":
      return <Badge variant="default">Re-credential</Badge>;
    default:
      return <Badge variant="default">{type}</Badge>;
  }
};

export default function ApplicationsPage() {
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [selectedApplication, setSelectedApplication] = useState<typeof applications[0] | null>(null);
  const [showNewAppModal, setShowNewAppModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestModalTarget, setRequestModalTarget] = useState<typeof applications[0] | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleRunVerification = async (app: typeof applications[0]) => {
    setIsVerifying(true);
    // Simulate verification process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsVerifying(false);
    setVerificationComplete(true);
    setTimeout(() => setVerificationComplete(false), 3000);
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.npi.includes(searchQuery) ||
      app.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || app.status === statusFilter;
    const matchesType = !typeFilter || app.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" icon={<ChevronLeft className="w-4 h-4" />} href="/admin/credentialing">
            Back
          </Button>
          <div>
            <h1 className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>
              Credentialing Applications
            </h1>
            <p className={cn("text-sm mt-1", isDark ? "text-slate-400" : "text-slate-500")}>
              Manage provider credentialing applications
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">
            icon={<Download className="w-4 h-4" />}
            Export
          </Button>
          <Button variant="primary" onClick={() => setShowNewAppModal(true)}>
            icon={<Plus className="w-4 h-4" />}
            New Application
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            label={stat.label}
            value={stat.value}
            trend={stat.trend}
            change={stat.change}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Filters */}
      <div className={cn(
        "flex flex-col sm:flex-row gap-4 p-4 rounded-xl border",
        isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
      )}>
        <div className="flex-1">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by provider name, NPI, specialty..."
          />
        </div>
        <div className="flex gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={cn(
              "px-3 py-2 rounded-lg border text-sm",
              isDark
                ? "bg-slate-700 border-slate-600 text-white"
                : "bg-white border-slate-200 text-slate-900"
            )}
          >
            {statusFilters.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className={cn(
              "px-3 py-2 rounded-lg border text-sm",
              isDark
                ? "bg-slate-700 border-slate-600 text-white"
                : "bg-white border-slate-200 text-slate-900"
            )}
          >
            {typeFilters.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className={cn(
        "rounded-xl border overflow-hidden",
        isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
      )}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={cn(
                "border-b",
                isDark ? "border-slate-700 bg-slate-900/50" : "border-slate-200 bg-slate-50"
              )}>
                <th className={cn("text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider", isDark ? "text-slate-400" : "text-slate-500")}>
                  Application
                </th>
                <th className={cn("text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider", isDark ? "text-slate-400" : "text-slate-500")}>
                  Provider / Practice
                </th>
                <th className={cn("text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider", isDark ? "text-slate-400" : "text-slate-500")}>
                  Type
                </th>
                <th className={cn("text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider", isDark ? "text-slate-400" : "text-slate-500")}>
                  Status
                </th>
                <th className={cn("text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider", isDark ? "text-slate-400" : "text-slate-500")}>
                  Stage
                </th>
                <th className={cn("text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider", isDark ? "text-slate-400" : "text-slate-500")}>
                  Submitted
                </th>
                <th className={cn("text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider", isDark ? "text-slate-400" : "text-slate-500")}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredApplications.map((app) => (
                <tr
                  key={app.id}
                  className={cn(
                    "transition-colors",
                    isDark ? "hover:bg-slate-700/50" : "hover:bg-slate-50"
                  )}
                >
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedApplication(app)}
                      className="text-left group"
                    >
                      <p className={cn(
                        "font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors",
                        isDark ? "text-white" : "text-slate-900"
                      )}>
                        {app.id}
                      </p>
                      <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                        NPI: {app.npi}
                      </p>
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedApplication(app)}
                      className="text-left group"
                    >
                      <p className={cn(
                        "font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors",
                        isDark ? "text-white" : "text-slate-900"
                      )}>
                        {app.provider}
                      </p>
                      <p className={cn(
                        "text-sm group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors",
                        isDark ? "text-slate-400" : "text-slate-500"
                      )}>
                        {app.practice} • {app.specialty}
                      </p>
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    {getTypeBadge(app.type)}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(app.status)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn("text-sm", isDark ? "text-slate-300" : "text-slate-600")}>
                      {app.stage}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                      {new Date(app.submitted).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedApplication(app)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {app.status === "review" && (
                        <Button 
                          variant="primary" 
                          size="sm"
                          icon={<Eye className="w-4 h-4" />}
                          href="/admin/credentialing/review"
                        >
                          Review
                        </Button>
                      )}
                      {app.status === "verification" && (
                        <Button 
                          variant="secondary" 
                          size="sm"
                          icon={<Send className="w-4 h-4" />}
                          onClick={(e) => {
                            e.stopPropagation();
                            setRequestModalTarget(app);
                            setShowRequestModal(true);
                          }}
                        >
                          Request Docs
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination placeholder */}
        <div className={cn(
          "flex items-center justify-between px-6 py-4 border-t",
          isDark ? "border-slate-700" : "border-slate-200"
        )}>
          <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
            Showing {filteredApplications.length} of {applications.length} applications
          </p>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" disabled>
              Previous
            </Button>
            <Button variant="secondary" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Application Detail Modal */}
      <AnimatePresence>
        {selectedApplication && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedApplication(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={cn(
                "w-full max-w-2xl rounded-xl p-6 max-h-[90vh] overflow-y-auto",
                isDark ? "bg-slate-800" : "bg-white"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className={cn("text-xl font-semibold", isDark ? "text-white" : "text-slate-900")}>
                    {selectedApplication.provider}
                  </h2>
                  <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                    {selectedApplication.id} • {selectedApplication.practice}
                  </p>
                </div>
                <IconButton icon={<X className="w-5 h-5" />} onClick={() => setSelectedApplication(null)} />
              </div>

              <div className="space-y-6">
                {/* Status & Type */}
                <div className="flex gap-3 items-center">
                  {getStatusBadge(selectedApplication.status)}
                  {getTypeBadge(selectedApplication.type)}
                  <span className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                    Submitted: {new Date(selectedApplication.submitted).toLocaleDateString()}
                  </span>
                </div>

                {/* Current Stage Progress */}
                <div className={cn("p-4 rounded-lg border", isDark ? "bg-slate-700/30 border-slate-600" : "bg-blue-50 border-blue-200")}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={cn("text-xs uppercase tracking-wider mb-1", isDark ? "text-slate-400" : "text-blue-600")}>
                        Current Stage
                      </p>
                      <p className={cn("font-semibold text-lg", isDark ? "text-white" : "text-slate-900")}>
                        {selectedApplication.stage}
                      </p>
                    </div>
                    <Clock className={cn("w-8 h-8", isDark ? "text-slate-500" : "text-blue-400")} />
                  </div>
                </div>

                {/* Provider Details Grid */}
                <div>
                  <h3 className={cn("font-semibold mb-3", isDark ? "text-white" : "text-slate-900")}>
                    Provider Information
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className={cn("p-3 rounded-lg", isDark ? "bg-slate-700/50" : "bg-slate-50")}>
                      <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>NPI</p>
                      <p className={cn("font-medium font-mono", isDark ? "text-white" : "text-slate-900")}>{selectedApplication.npi}</p>
                    </div>
                    <div className={cn("p-3 rounded-lg", isDark ? "bg-slate-700/50" : "bg-slate-50")}>
                      <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Specialty</p>
                      <p className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>{selectedApplication.specialty}</p>
                    </div>
                    <div className={cn("p-3 rounded-lg", isDark ? "bg-slate-700/50" : "bg-slate-50")}>
                      <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>License #</p>
                      <p className={cn("font-medium font-mono", isDark ? "text-white" : "text-slate-900")}>{(selectedApplication as any).licenseNumber || "N/A"}</p>
                    </div>
                    <div className={cn("p-3 rounded-lg", isDark ? "bg-slate-700/50" : "bg-slate-50")}>
                      <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>License Expiry</p>
                      <p className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>{(selectedApplication as any).licenseExpiry || "N/A"}</p>
                    </div>
                    <div className={cn("p-3 rounded-lg col-span-2", isDark ? "bg-slate-700/50" : "bg-slate-50")}>
                      <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Address</p>
                      <p className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>{(selectedApplication as any).address || "N/A"}</p>
                    </div>
                    <div className={cn("p-3 rounded-lg", isDark ? "bg-slate-700/50" : "bg-slate-50")}>
                      <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Email</p>
                      <p className={cn("font-medium text-sm", isDark ? "text-white" : "text-slate-900")}>{selectedApplication.email}</p>
                    </div>
                    <div className={cn("p-3 rounded-lg", isDark ? "bg-slate-700/50" : "bg-slate-50")}>
                      <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Phone</p>
                      <p className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>{selectedApplication.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Documents Section */}
                {(selectedApplication as any).documents && (
                  <div>
                    <h3 className={cn("font-semibold mb-3 flex items-center gap-2", isDark ? "text-white" : "text-slate-900")}>
                      <FileText className="w-4 h-4" />
                      Documents
                      <span className={cn("text-sm font-normal", isDark ? "text-slate-400" : "text-slate-500")}>
                        ({(selectedApplication as any).documents.filter((d: any) => d.status === 'received').length}/{(selectedApplication as any).documents.length} received)
                      </span>
                    </h3>
                    <div className="space-y-2">
                      {(selectedApplication as any).documents.map((doc: any, idx: number) => (
                        <div 
                          key={idx}
                          className={cn(
                            "flex items-center justify-between p-3 rounded-lg border",
                            doc.status === 'received' ? (isDark ? "bg-green-900/20 border-green-800" : "bg-green-50 border-green-200") :
                            doc.status === 'expired' ? (isDark ? "bg-red-900/20 border-red-800" : "bg-red-50 border-red-200") :
                            (isDark ? "bg-amber-900/20 border-amber-800" : "bg-amber-50 border-amber-200")
                          )}
                        >
                          <div className="flex items-center gap-3">
                            {doc.status === 'received' ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : doc.status === 'expired' ? (
                              <XCircle className="w-5 h-5 text-red-500" />
                            ) : (
                              <Clock className="w-5 h-5 text-amber-500" />
                            )}
                            <span className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>{doc.name}</span>
                          </div>
                          <div className="text-right">
                            <span className={cn(
                              "text-xs px-2 py-1 rounded-full",
                              doc.status === 'received' ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300" :
                              doc.status === 'expired' ? "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300" :
                              "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
                            )}>
                              {doc.status === 'received' ? 'Received' : doc.status === 'expired' ? 'Expired' : 'Pending'}
                            </span>
                            {doc.date && (
                              <p className={cn("text-xs mt-1", isDark ? "text-slate-400" : "text-slate-500")}>
                                {new Date(doc.date).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Verifications Section */}
                {(selectedApplication as any).verifications && (
                  <div>
                    <h3 className={cn("font-semibold mb-3 flex items-center gap-2", isDark ? "text-white" : "text-slate-900")}>
                      <Shield className="w-4 h-4" />
                      Verification Status
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {(selectedApplication as any).verifications.map((v: any, idx: number) => (
                        <div 
                          key={idx}
                          className={cn(
                            "flex items-center gap-2 p-2 rounded-lg",
                            v.status === 'passed' ? (isDark ? "bg-green-900/20" : "bg-green-50") :
                            v.status === 'failed' ? (isDark ? "bg-red-900/20" : "bg-red-50") :
                            (isDark ? "bg-slate-700/50" : "bg-slate-50")
                          )}
                        >
                          {v.status === 'passed' ? (
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          ) : v.status === 'failed' ? (
                            <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                          ) : (
                            <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          )}
                          <span className={cn("text-sm", isDark ? "text-slate-300" : "text-slate-700")}>{v.type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Denial Reason */}
                {selectedApplication.status === "denied" && selectedApplication.denialReason && (
                  <div className="p-4 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
                    <p className="text-xs uppercase tracking-wider mb-1 text-red-600 dark:text-red-400">
                      Denial Reason
                    </p>
                    <p className="font-medium text-red-700 dark:text-red-300">
                      {selectedApplication.denialReason}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                  {selectedApplication.status === "verification" && (
                    <>
                      <Button 
                        variant="secondary" 
                        icon={<Upload className="w-4 h-4" />}
                        onClick={() => setShowUploadModal(true)}
                      >
                        Upload Documents
                      </Button>
                      <Button 
                        variant="secondary" 
                        icon={<Send className="w-4 h-4" />}
                        onClick={() => {
                          setRequestModalTarget(selectedApplication);
                          setShowRequestModal(true);
                        }}
                      >
                        Request from Provider
                      </Button>
                    </>
                  )}
                  {selectedApplication.status === "review" && (
                    <Link href="/admin/credentialing/review">
                      <Button variant="primary" icon={<Eye className="w-4 h-4" />}>
                        Go to Review
                      </Button>
                    </Link>
                  )}
                  <Button 
                    variant="primary" 
                    icon={<RefreshCw className="w-4 h-4" />}
                    onClick={() => handleRunVerification(selectedApplication)}
                  >
                    Run Verification
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Application Modal */}
      <AnimatePresence>
        {showNewAppModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowNewAppModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={cn(
                "w-full max-w-lg rounded-xl p-6",
                isDark ? "bg-slate-800" : "bg-white"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className={cn("text-xl font-semibold", isDark ? "text-white" : "text-slate-900")}>
                  New Credentialing Application
                </h2>
                <IconButton icon={<X className="w-5 h-5" />} onClick={() => setShowNewAppModal(false)} />
              </div>

              <form className="space-y-4">
                <div>
                  <label className={cn("block text-sm font-medium mb-1", isDark ? "text-slate-300" : "text-slate-700")}>
                    Application Type
                  </label>
                  <select className={cn(
                    "w-full px-3 py-2 rounded-lg border text-sm",
                    isDark ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-200 text-slate-900"
                  )}>
                    <option value="initial">Initial Credentialing</option>
                    <option value="recredential">Re-Credentialing</option>
                  </select>
                </div>

                <div>
                  <label className={cn("block text-sm font-medium mb-1", isDark ? "text-slate-300" : "text-slate-700")}>
                    Provider Name
                  </label>
                  <input
                    type="text"
                    placeholder="Dr. John Smith"
                    className={cn(
                      "w-full px-3 py-2 rounded-lg border text-sm",
                      isDark ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400" : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
                    )}
                  />
                </div>

                <div>
                  <label className={cn("block text-sm font-medium mb-1", isDark ? "text-slate-300" : "text-slate-700")}>
                    NPI
                  </label>
                  <input
                    type="text"
                    placeholder="1234567890"
                    className={cn(
                      "w-full px-3 py-2 rounded-lg border text-sm",
                      isDark ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400" : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
                    )}
                  />
                </div>

                <div>
                  <label className={cn("block text-sm font-medium mb-1", isDark ? "text-slate-300" : "text-slate-700")}>
                    Practice / Organization
                  </label>
                  <input
                    type="text"
                    placeholder="Medical Practice Name"
                    className={cn(
                      "w-full px-3 py-2 rounded-lg border text-sm",
                      isDark ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400" : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
                    )}
                  />
                </div>

                <div>
                  <label className={cn("block text-sm font-medium mb-1", isDark ? "text-slate-300" : "text-slate-700")}>
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="provider@example.com"
                    className={cn(
                      "w-full px-3 py-2 rounded-lg border text-sm",
                      isDark ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400" : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
                    )}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="secondary" className="flex-1" onClick={() => setShowNewAppModal(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" className="flex-1">
                    Create Application
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Documents Modal */}
      <AnimatePresence>
        {showUploadModal && selectedApplication && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowUploadModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={cn(
                "w-full max-w-lg rounded-xl p-6",
                isDark ? "bg-slate-800" : "bg-white"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className={cn("text-xl font-semibold", isDark ? "text-white" : "text-slate-900")}>
                    Upload Documents
                  </h2>
                  <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                    {selectedApplication.provider}
                  </p>
                </div>
                <IconButton icon={<X className="w-5 h-5" />} onClick={() => setShowUploadModal(false)} />
              </div>

              <div className={cn(
                "border-2 border-dashed rounded-xl p-8 text-center mb-6",
                isDark ? "border-slate-600 hover:border-blue-500" : "border-slate-300 hover:border-blue-500"
              )}>
                <Upload className={cn("w-12 h-12 mx-auto mb-4", isDark ? "text-slate-500" : "text-slate-400")} />
                <p className={cn("font-medium mb-1", isDark ? "text-white" : "text-slate-900")}>
                  Drop files here or click to upload
                </p>
                <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                  PDF, JPG, PNG up to 10MB each
                </p>
                <input type="file" className="hidden" multiple accept=".pdf,.jpg,.jpeg,.png" />
              </div>

              <div className="space-y-2 mb-6">
                <p className={cn("text-sm font-medium", isDark ? "text-slate-300" : "text-slate-700")}>
                  Required Documents:
                </p>
                <div className="space-y-2">
                  {["Medical License", "DEA Certificate", "Board Certification", "Malpractice Insurance", "CV/Resume"].map((doc) => (
                    <div key={doc} className={cn(
                      "flex items-center justify-between p-3 rounded-lg",
                      isDark ? "bg-slate-700/50" : "bg-slate-50"
                    )}>
                      <span className={cn("text-sm", isDark ? "text-slate-300" : "text-slate-600")}>{doc}</span>
                      <span className="text-xs text-amber-500">Pending</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => setShowUploadModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" className="flex-1" icon={<Upload className="w-4 h-4" />}>
                  Upload Files
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Request from Provider Modal */}
      <AnimatePresence>
        {showRequestModal && requestModalTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => { setShowRequestModal(false); setRequestModalTarget(null); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={cn(
                "w-full max-w-lg rounded-xl p-6",
                isDark ? "bg-slate-800" : "bg-white"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className={cn("text-xl font-semibold", isDark ? "text-white" : "text-slate-900")}>
                    Request Documents from Provider
                  </h2>
                  <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                    {requestModalTarget.provider} • {requestModalTarget.email}
                  </p>
                </div>
                <IconButton icon={<X className="w-5 h-5" />} onClick={() => { setShowRequestModal(false); setRequestModalTarget(null); }} />
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className={cn("block text-sm font-medium mb-2", isDark ? "text-slate-300" : "text-slate-700")}>
                    Select Documents to Request
                  </label>
                  <div className="space-y-2">
                    {["Medical License", "DEA Certificate", "Board Certification", "Malpractice Insurance COI", "CV/Resume", "W-9 Form", "CAQH Profile"].map((doc) => (
                      <label key={doc} className={cn(
                        "flex items-center gap-3 p-3 rounded-lg cursor-pointer",
                        isDark ? "bg-slate-700/50 hover:bg-slate-700" : "bg-slate-50 hover:bg-slate-100"
                      )}>
                        <input type="checkbox" className="rounded border-slate-300" />
                        <span className={cn("text-sm", isDark ? "text-slate-300" : "text-slate-600")}>{doc}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={cn("block text-sm font-medium mb-2", isDark ? "text-slate-300" : "text-slate-700")}>
                    Link Expiration
                  </label>
                  <select className={cn(
                    "w-full px-3 py-2 rounded-lg border text-sm",
                    isDark ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-200 text-slate-900"
                  )}>
                    <option>7 days</option>
                    <option>14 days</option>
                    <option>30 days</option>
                  </select>
                </div>

                <div>
                  <label className={cn("block text-sm font-medium mb-2", isDark ? "text-slate-300" : "text-slate-700")}>
                    Custom Message (optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Add a personal message to the request email..."
                    className={cn(
                      "w-full px-3 py-2 rounded-lg border text-sm resize-none",
                      isDark ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400" : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
                    )}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => { setShowRequestModal(false); setRequestModalTarget(null); }}>
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  className="flex-1" 
                  icon={<Send className="w-4 h-4" />}
                  onClick={() => { 
                    setShowRequestModal(false); 
                    setRequestModalTarget(null);
                    setToast({ message: `Document request sent to ${requestModalTarget.provider}`, type: 'success' });
                  }}
                >
                  Send Request
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Verification Toast */}
      <AnimatePresence>
        {isVerifying && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50"
          >
            <RefreshCw className="w-5 h-5 animate-spin" />
            Running verification checks...
          </motion.div>
        )}
        {verificationComplete && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50"
          >
            <CheckCircle className="w-5 h-5" />
            Verification complete!
          </motion.div>
        )}
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            onAnimationComplete={() => setTimeout(() => setToast(null), 3000)}
            className={cn(
              "fixed bottom-6 right-6 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50",
              toast.type === 'success' ? "bg-green-600 text-white" : "bg-red-600 text-white"
            )}
          >
            {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <X className="w-5 h-5" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
