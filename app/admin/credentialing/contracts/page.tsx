"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Send,
  CheckCircle,
  Clock,
  Eye,
  Download,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Mail,
  Upload,
  Building,
  User,
  Calendar,
  DollarSign,
  FileSignature,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useTheme } from "@/components/admin/ThemeContext";
import { StatCard } from "@/components/admin/ui/StatCard";
import { Button } from "@/components/admin/ui/Button";
import { Badge } from "@/components/admin/ui/Badge";
import { cn } from "@/lib/utils";

// Demo contracts
const contracts = [
  {
    id: "CTR-2024-0156",
    applicationId: "CRED-2024-1247",
    provider: "Dr. Sarah Mitchell",
    practice: "Mitchell Cardiology Associates",
    type: "individual",
    status: "pending_signature",
    template: "Physician Individual Agreement",
    rateSchedule: "Primary Care - 140% Medicare",
    effectiveDate: "Apr 1, 2024",
    termDate: "Mar 31, 2027",
    sentDate: "Mar 15, 2024",
    signedDate: null,
    generatedDate: "Mar 14, 2024",
  },
  {
    id: "CTR-2024-0155",
    applicationId: "CRED-2024-1245",
    provider: "Metro Imaging Center",
    practice: "Metro Imaging Center",
    type: "facility",
    status: "signed",
    template: "Facility Agreement",
    rateSchedule: "Imaging Center - 125% Medicare",
    effectiveDate: "Mar 15, 2024",
    termDate: "Mar 14, 2027",
    sentDate: "Mar 10, 2024",
    signedDate: "Mar 12, 2024",
    generatedDate: "Mar 9, 2024",
  },
  {
    id: "CTR-2024-0154",
    applicationId: "CRED-2024-1243",
    provider: "Dr. Emily Chen",
    practice: "Lakeside Pediatrics",
    type: "group",
    status: "draft",
    template: "Group Practice Agreement",
    rateSchedule: "Pediatrics - 145% Medicare",
    effectiveDate: null,
    termDate: null,
    sentDate: null,
    signedDate: null,
    generatedDate: "Mar 8, 2024",
  },
  {
    id: "CTR-2024-0153",
    applicationId: "CRED-2024-1240",
    provider: "Dr. James Wilson",
    practice: "Wilson Orthopedic Clinic",
    type: "individual",
    status: "expired",
    template: "Physician Individual Agreement",
    rateSchedule: "Orthopedics - 155% Medicare",
    effectiveDate: "Mar 1, 2024",
    termDate: "Feb 29, 2027",
    sentDate: "Feb 20, 2024",
    signedDate: null,
    generatedDate: "Feb 18, 2024",
  },
  {
    id: "CTR-2024-0152",
    applicationId: "CRED-2024-1238",
    provider: "Cleveland PT Group",
    practice: "Cleveland PT Group",
    type: "group",
    status: "signed",
    template: "Allied Health Agreement",
    rateSchedule: "Physical Therapy - 130% Medicare",
    effectiveDate: "Feb 15, 2024",
    termDate: "Feb 14, 2027",
    sentDate: "Feb 10, 2024",
    signedDate: "Feb 13, 2024",
    generatedDate: "Feb 8, 2024",
  },
];

// Stats
const stats = [
  { label: "Total Contracts", value: "234", trend: "neutral" as const, change: "Active + pending", icon: <FileText className="w-5 h-5" /> },
  { label: "Pending Signature", value: "18", trend: "warning" as const, change: "Awaiting response", icon: <Clock className="w-5 h-5" /> },
  { label: "Signed This Month", value: "12", trend: "up" as const, change: "+4 vs last month", icon: <CheckCircle className="w-5 h-5" /> },
  { label: "Expiring (90 days)", value: "7", trend: "warning" as const, change: "Renewal needed", icon: <AlertCircle className="w-5 h-5" /> },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "draft":
      return <Badge variant="default">Draft</Badge>;
    case "pending_signature":
      return <Badge variant="warning">Pending Signature</Badge>;
    case "signed":
      return <Badge variant="success">Signed</Badge>;
    case "expired":
      return <Badge variant="error">Expired</Badge>;
    case "declined":
      return <Badge variant="error">Declined</Badge>;
    default:
      return <Badge variant="default">{status}</Badge>;
  }
};

const getTypeBadge = (type: string) => {
  switch (type) {
    case "individual":
      return (
        <span className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
          <User className="w-4 h-4" />
          Individual
        </span>
      );
    case "group":
      return (
        <span className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
          <Building className="w-4 h-4" />
          Group
        </span>
      );
    case "facility":
      return (
        <span className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
          <Building className="w-4 h-4" />
          Facility
        </span>
      );
    default:
      return <span className="text-sm text-slate-500">{type}</span>;
  }
};

export default function CredentialingContractsPage() {
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState<typeof contracts[0] | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      contract.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.practice.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || contract.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className={cn("space-y-6", isDark ? "text-white" : "text-slate-900")}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Contracts</h1>
          <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-600")}>
            Generate, send, and track credentialing contracts
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/credentialing/contracts/templates">
            <Button variant="secondary">
              <FileText className="w-4 h-4 mr-2" />
              Templates
            </Button>
          </Link>
          <Button onClick={() => setShowGenerateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Generate Contract
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Filters */}
      <div
        className={cn(
          "rounded-xl border p-4",
          isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200"
        )}
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by provider, practice, or contract ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "w-full pl-10 pr-4 py-2 rounded-lg border text-sm",
                isDark
                  ? "bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                  : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
              )}
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={cn(
                "px-4 py-2 rounded-lg border text-sm",
                isDark
                  ? "bg-slate-900 border-slate-700 text-white"
                  : "bg-white border-slate-300 text-slate-900"
              )}
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="pending_signature">Pending Signature</option>
              <option value="signed">Signed</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contracts Table */}
      <div
        className={cn(
          "rounded-xl border overflow-hidden",
          isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200"
        )}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={cn("border-b", isDark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-slate-50")}>
                <th className="text-left px-4 py-3 text-sm font-medium">Contract ID</th>
                <th className="text-left px-4 py-3 text-sm font-medium">Provider / Practice</th>
                <th className="text-left px-4 py-3 text-sm font-medium">Type</th>
                <th className="text-left px-4 py-3 text-sm font-medium">Rate Schedule</th>
                <th className="text-left px-4 py-3 text-sm font-medium">Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium">Effective Date</th>
                <th className="text-right px-4 py-3 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContracts.map((contract) => (
                <tr
                  key={contract.id}
                  className={cn("border-b", isDark ? "border-slate-700 hover:bg-slate-800" : "border-slate-100 hover:bg-slate-50")}
                >
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm text-cyan-600 dark:text-cyan-400">{contract.id}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{contract.provider}</p>
                      <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>{contract.practice}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">{getTypeBadge(contract.type)}</td>
                  <td className="px-4 py-3">
                    <span className="text-sm">{contract.rateSchedule}</span>
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(contract.status)}</td>
                  <td className="px-4 py-3">
                    {contract.effectiveDate ? (
                      <span className="text-sm">{contract.effectiveDate}</span>
                    ) : (
                      <span className={cn("text-sm", isDark ? "text-slate-500" : "text-slate-400")}>Not set</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedContract(contract)}
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          isDark ? "hover:bg-slate-700" : "hover:bg-slate-100"
                        )}
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          isDark ? "hover:bg-slate-700" : "hover:bg-slate-100"
                        )}
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      {contract.status === "draft" && (
                        <button
                          className={cn(
                            "p-2 rounded-lg transition-colors text-cyan-600",
                            isDark ? "hover:bg-slate-700" : "hover:bg-slate-100"
                          )}
                          title="Send for Signature"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      )}
                      {contract.status === "pending_signature" && (
                        <button
                          onClick={() => {
                            setSelectedContract(contract);
                            setShowUploadModal(true);
                          }}
                          className={cn(
                            "p-2 rounded-lg transition-colors text-green-600",
                            isDark ? "hover:bg-slate-700" : "hover:bg-slate-100"
                          )}
                          title="Upload Signed Contract"
                        >
                          <Upload className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contract Detail Modal */}
      {selectedContract && !showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div
            className={cn(
              "w-full max-w-2xl rounded-xl shadow-xl max-h-[90vh] overflow-y-auto",
              isDark ? "bg-slate-800" : "bg-white"
            )}
          >
            <div className={cn("flex items-center justify-between p-4 border-b", isDark ? "border-slate-700" : "border-slate-200")}>
              <div>
                <h2 className="text-lg font-semibold">Contract Details</h2>
                <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>{selectedContract.id}</p>
              </div>
              <button
                onClick={() => setSelectedContract(null)}
                className={cn("p-2 rounded-lg", isDark ? "hover:bg-slate-700" : "hover:bg-slate-100")}
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Banner */}
              <div
                className={cn(
                  "p-4 rounded-lg",
                  selectedContract.status === "signed"
                    ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                    : selectedContract.status === "pending_signature"
                    ? "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
                    : selectedContract.status === "expired"
                    ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                    : "bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600"
                )}
              >
                <div className="flex items-center gap-3">
                  {selectedContract.status === "signed" && <CheckCircle className="w-5 h-5 text-green-600" />}
                  {selectedContract.status === "pending_signature" && <Clock className="w-5 h-5 text-yellow-600" />}
                  {selectedContract.status === "expired" && <XCircle className="w-5 h-5 text-red-600" />}
                  {selectedContract.status === "draft" && <FileText className="w-5 h-5 text-slate-600" />}
                  <div>
                    <p className="font-medium">
                      {selectedContract.status === "signed" && "Contract Signed"}
                      {selectedContract.status === "pending_signature" && "Awaiting Signature"}
                      {selectedContract.status === "expired" && "Contract Expired"}
                      {selectedContract.status === "draft" && "Draft Contract"}
                    </p>
                    <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-600")}>
                      {selectedContract.status === "signed" && `Signed on ${selectedContract.signedDate}`}
                      {selectedContract.status === "pending_signature" && `Sent on ${selectedContract.sentDate}`}
                      {selectedContract.status === "expired" && `Sent on ${selectedContract.sentDate} - No response received`}
                      {selectedContract.status === "draft" && `Generated on ${selectedContract.generatedDate}`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Provider Info */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={cn("text-sm font-medium", isDark ? "text-slate-400" : "text-slate-500")}>
                    Provider
                  </label>
                  <p className="mt-1 font-medium">{selectedContract.provider}</p>
                </div>
                <div>
                  <label className={cn("text-sm font-medium", isDark ? "text-slate-400" : "text-slate-500")}>
                    Practice
                  </label>
                  <p className="mt-1">{selectedContract.practice}</p>
                </div>
              </div>

              {/* Contract Details */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={cn("text-sm font-medium", isDark ? "text-slate-400" : "text-slate-500")}>
                    Template Used
                  </label>
                  <p className="mt-1">{selectedContract.template}</p>
                </div>
                <div>
                  <label className={cn("text-sm font-medium", isDark ? "text-slate-400" : "text-slate-500")}>
                    Contract Type
                  </label>
                  <p className="mt-1 capitalize">{selectedContract.type}</p>
                </div>
              </div>

              {/* Rate & Dates */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className={cn("text-sm font-medium", isDark ? "text-slate-400" : "text-slate-500")}>
                    Rate Schedule
                  </label>
                  <p className="mt-1">{selectedContract.rateSchedule}</p>
                </div>
                <div>
                  <label className={cn("text-sm font-medium", isDark ? "text-slate-400" : "text-slate-500")}>
                    Effective Date
                  </label>
                  <p className="mt-1">{selectedContract.effectiveDate || "—"}</p>
                </div>
                <div>
                  <label className={cn("text-sm font-medium", isDark ? "text-slate-400" : "text-slate-500")}>
                    Term End Date
                  </label>
                  <p className="mt-1">{selectedContract.termDate || "—"}</p>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <label className={cn("text-sm font-medium block mb-3", isDark ? "text-slate-400" : "text-slate-500")}>
                  Timeline
                </label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                    <span className="text-sm">Generated: {selectedContract.generatedDate}</span>
                  </div>
                  {selectedContract.sentDate && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <span className="text-sm">Sent for Signature: {selectedContract.sentDate}</span>
                    </div>
                  )}
                  {selectedContract.signedDate && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-sm">Signed: {selectedContract.signedDate}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className={cn("flex items-center justify-end gap-3 p-4 border-t", isDark ? "border-slate-700" : "border-slate-200")}>
              <Button variant="secondary" onClick={() => setSelectedContract(null)}>
                Close
              </Button>
              <Button variant="secondary">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              {selectedContract.status === "draft" && (
                <Button>
                  <Send className="w-4 h-4 mr-2" />
                  Send for Signature
                </Button>
              )}
              {selectedContract.status === "pending_signature" && (
                <Button onClick={() => setShowUploadModal(true)}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Signed Copy
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Upload Signed Contract Modal */}
      {showUploadModal && selectedContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div
            className={cn(
              "w-full max-w-lg rounded-xl shadow-xl",
              isDark ? "bg-slate-800" : "bg-white"
            )}
          >
            <div className={cn("flex items-center justify-between p-4 border-b", isDark ? "border-slate-700" : "border-slate-200")}>
              <div>
                <h2 className="text-lg font-semibold">Upload Signed Contract</h2>
                <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                  {selectedContract.provider}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedContract(null);
                }}
                className={cn("p-2 rounded-lg", isDark ? "hover:bg-slate-700" : "hover:bg-slate-100")}
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Upload Area */}
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center",
                  isDark ? "border-slate-600 hover:border-slate-500" : "border-slate-300 hover:border-slate-400"
                )}
              >
                <Upload className={cn("w-10 h-10 mx-auto mb-4", isDark ? "text-slate-500" : "text-slate-400")} />
                <p className="font-medium mb-1">Drop signed contract here</p>
                <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                  or click to browse (PDF only)
                </p>
                <input type="file" accept=".pdf" className="hidden" />
              </div>

              {/* Signature Details */}
              <div className="space-y-4">
                <div>
                  <label className={cn("block text-sm font-medium mb-1", isDark ? "text-slate-300" : "text-slate-700")}>
                    Signed By (Name)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Dr. Sarah Mitchell"
                    className={cn(
                      "w-full px-4 py-2 rounded-lg border text-sm",
                      isDark
                        ? "bg-slate-900 border-slate-700 text-white"
                        : "bg-white border-slate-300 text-slate-900"
                    )}
                  />
                </div>
                <div>
                  <label className={cn("block text-sm font-medium mb-1", isDark ? "text-slate-300" : "text-slate-700")}>
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Medical Director"
                    className={cn(
                      "w-full px-4 py-2 rounded-lg border text-sm",
                      isDark
                        ? "bg-slate-900 border-slate-700 text-white"
                        : "bg-white border-slate-300 text-slate-900"
                    )}
                  />
                </div>
                <div>
                  <label className={cn("block text-sm font-medium mb-1", isDark ? "text-slate-300" : "text-slate-700")}>
                    Signature Date
                  </label>
                  <input
                    type="date"
                    className={cn(
                      "w-full px-4 py-2 rounded-lg border text-sm",
                      isDark
                        ? "bg-slate-900 border-slate-700 text-white"
                        : "bg-white border-slate-300 text-slate-900"
                    )}
                  />
                </div>
              </div>

              {/* Activate Provider */}
              <div
                className={cn(
                  "p-4 rounded-lg",
                  isDark ? "bg-cyan-900/20 border border-cyan-800" : "bg-cyan-50 border border-cyan-200"
                )}
              >
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                  <div>
                    <p className="font-medium">Activate Provider</p>
                    <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-600")}>
                      Set provider status to Active and send welcome email
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className={cn("flex items-center justify-end gap-3 p-4 border-t", isDark ? "border-slate-700" : "border-slate-200")}>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedContract(null);
                }}
              >
                Cancel
              </Button>
              <Button>
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirm & Activate
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Generate Contract Modal */}
      {showGenerateModal && (
        <GenerateContractModal onClose={() => setShowGenerateModal(false)} isDark={isDark} />
      )}
    </div>
  );
}

// Generate Contract Modal Component
function GenerateContractModal({
  onClose,
  isDark,
}: {
  onClose: () => void;
  isDark: boolean;
}) {
  const [step, setStep] = useState(1);
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedRateSchedule, setSelectedRateSchedule] = useState<string | null>(null);
  const [effectiveDate, setEffectiveDate] = useState("");

  // Demo approved applications ready for contracts
  const approvedApplications = [
    { id: "CRED-2024-1247", provider: "Dr. Sarah Mitchell", practice: "Mitchell Cardiology", specialty: "Cardiology", approved: "Mar 14, 2024" },
    { id: "CRED-2024-1246", provider: "Dr. James Wilson", practice: "Wilson Orthopedics", specialty: "Orthopedics", approved: "Mar 12, 2024" },
  ];

  const templates = [
    { id: "tpl-001", name: "Physician Individual Agreement", type: "individual", description: "Standard agreement for individual physician providers" },
    { id: "tpl-002", name: "Group Practice Agreement", type: "group", description: "Agreement for group practices with multiple providers" },
    { id: "tpl-003", name: "Facility Agreement", type: "facility", description: "Agreement for hospitals, imaging centers, labs" },
    { id: "tpl-004", name: "Allied Health Agreement", type: "allied", description: "PT, OT, Speech, Behavioral Health" },
  ];

  const rateSchedules = [
    { id: "rate-001", name: "Primary Care - 140% Medicare", type: "medicare_percent", value: "140%" },
    { id: "rate-002", name: "Specialty Care - 150% Medicare", type: "medicare_percent", value: "150%" },
    { id: "rate-003", name: "Orthopedics - 155% Medicare", type: "medicare_percent", value: "155%" },
    { id: "rate-004", name: "Imaging - 125% Medicare", type: "medicare_percent", value: "125%" },
    { id: "rate-005", name: "Physical Therapy - 130% Medicare", type: "medicare_percent", value: "130%" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className={cn(
          "w-full max-w-2xl rounded-xl shadow-xl max-h-[90vh] overflow-y-auto",
          isDark ? "bg-slate-800" : "bg-white"
        )}
      >
        <div className={cn("flex items-center justify-between p-4 border-b", isDark ? "border-slate-700" : "border-slate-200")}>
          <div>
            <h2 className="text-lg font-semibold">Generate Contract</h2>
            <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
              Step {step} of 4
            </p>
          </div>
          <button
            onClick={onClose}
            className={cn("p-2 rounded-lg", isDark ? "hover:bg-slate-700" : "hover:bg-slate-100")}
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className={cn("px-6 py-3 border-b", isDark ? "border-slate-700" : "border-slate-200")}>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex-1">
                <div
                  className={cn(
                    "h-1 rounded-full transition-colors",
                    s <= step
                      ? "bg-cyan-500"
                      : isDark
                      ? "bg-slate-700"
                      : "bg-slate-200"
                  )}
                />
                <p className={cn("text-xs mt-1", s === step ? "text-cyan-500 font-medium" : isDark ? "text-slate-500" : "text-slate-400")}>
                  {s === 1 && "Application"}
                  {s === 2 && "Template"}
                  {s === 3 && "Rates"}
                  {s === 4 && "Review"}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Step 1: Select Application */}
          {step === 1 && (
            <div className="space-y-4">
              <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-600")}>
                Select an approved application to generate a contract for:
              </p>
              <div className="space-y-3">
                {approvedApplications.map((app) => (
                  <label
                    key={app.id}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors",
                      selectedApplication === app.id
                        ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20"
                        : isDark
                        ? "border-slate-700 hover:border-slate-600"
                        : "border-slate-200 hover:border-slate-300"
                    )}
                  >
                    <input
                      type="radio"
                      name="application"
                      checked={selectedApplication === app.id}
                      onChange={() => setSelectedApplication(app.id)}
                      className="w-4 h-4"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{app.provider}</p>
                        <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400">{app.id}</span>
                      </div>
                      <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                        {app.practice} • {app.specialty}
                      </p>
                      <p className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>
                        Approved: {app.approved}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Select Template */}
          {step === 2 && (
            <div className="space-y-4">
              <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-600")}>
                Select a contract template:
              </p>
              <div className="space-y-3">
                {templates.map((tpl) => (
                  <label
                    key={tpl.id}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors",
                      selectedTemplate === tpl.id
                        ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20"
                        : isDark
                        ? "border-slate-700 hover:border-slate-600"
                        : "border-slate-200 hover:border-slate-300"
                    )}
                  >
                    <input
                      type="radio"
                      name="template"
                      checked={selectedTemplate === tpl.id}
                      onChange={() => setSelectedTemplate(tpl.id)}
                      className="w-4 h-4"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{tpl.name}</p>
                      <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                        {tpl.description}
                      </p>
                    </div>
                    <Badge variant="default">{tpl.type}</Badge>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Select Rate Schedule */}
          {step === 3 && (
            <div className="space-y-4">
              <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-600")}>
                Assign a rate schedule:
              </p>
              <div className="space-y-3">
                {rateSchedules.map((rate) => (
                  <label
                    key={rate.id}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors",
                      selectedRateSchedule === rate.id
                        ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20"
                        : isDark
                        ? "border-slate-700 hover:border-slate-600"
                        : "border-slate-200 hover:border-slate-300"
                    )}
                  >
                    <input
                      type="radio"
                      name="rate"
                      checked={selectedRateSchedule === rate.id}
                      onChange={() => setSelectedRateSchedule(rate.id)}
                      className="w-4 h-4"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{rate.name}</p>
                    </div>
                    <span className="font-mono text-cyan-600 dark:text-cyan-400">{rate.value}</span>
                  </label>
                ))}
              </div>

              <div className="pt-4 border-t mt-6" style={{ borderColor: isDark ? '#334155' : '#e2e8f0' }}>
                <label className={cn("block text-sm font-medium mb-2", isDark ? "text-slate-300" : "text-slate-700")}>
                  Effective Date
                </label>
                <input
                  type="date"
                  value={effectiveDate}
                  onChange={(e) => setEffectiveDate(e.target.value)}
                  className={cn(
                    "w-full px-4 py-2 rounded-lg border text-sm",
                    isDark
                      ? "bg-slate-900 border-slate-700 text-white"
                      : "bg-white border-slate-300 text-slate-900"
                  )}
                />
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="space-y-6">
              <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-600")}>
                Review contract details before generating:
              </p>

              <div className={cn("rounded-lg border p-4 space-y-4", isDark ? "border-slate-700" : "border-slate-200")}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={cn("text-xs font-medium uppercase", isDark ? "text-slate-500" : "text-slate-400")}>
                      Application
                    </label>
                    <p className="font-medium">
                      {approvedApplications.find(a => a.id === selectedApplication)?.provider}
                    </p>
                  </div>
                  <div>
                    <label className={cn("text-xs font-medium uppercase", isDark ? "text-slate-500" : "text-slate-400")}>
                      Practice
                    </label>
                    <p>
                      {approvedApplications.find(a => a.id === selectedApplication)?.practice}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={cn("text-xs font-medium uppercase", isDark ? "text-slate-500" : "text-slate-400")}>
                      Template
                    </label>
                    <p>{templates.find(t => t.id === selectedTemplate)?.name}</p>
                  </div>
                  <div>
                    <label className={cn("text-xs font-medium uppercase", isDark ? "text-slate-500" : "text-slate-400")}>
                      Rate Schedule
                    </label>
                    <p>{rateSchedules.find(r => r.id === selectedRateSchedule)?.name}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={cn("text-xs font-medium uppercase", isDark ? "text-slate-500" : "text-slate-400")}>
                      Effective Date
                    </label>
                    <p>{effectiveDate || "Not set"}</p>
                  </div>
                  <div>
                    <label className={cn("text-xs font-medium uppercase", isDark ? "text-slate-500" : "text-slate-400")}>
                      Term Length
                    </label>
                    <p>3 years</p>
                  </div>
                </div>
              </div>

              <div className={cn("p-4 rounded-lg", isDark ? "bg-cyan-900/20 border border-cyan-800" : "bg-cyan-50 border border-cyan-200")}>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                  <div>
                    <p className="font-medium">Send for signature immediately</p>
                    <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-600")}>
                      Email contract to provider after generation
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>

        <div className={cn("flex items-center justify-between p-4 border-t", isDark ? "border-slate-700" : "border-slate-200")}>
          <div>
            {step > 1 && (
              <Button variant="secondary" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            {step < 4 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={
                  (step === 1 && !selectedApplication) ||
                  (step === 2 && !selectedTemplate) ||
                  (step === 3 && !selectedRateSchedule)
                }
              >
                Continue
              </Button>
            ) : (
              <Button onClick={onClose}>
                <FileSignature className="w-4 h-4 mr-2" />
                Generate Contract
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
