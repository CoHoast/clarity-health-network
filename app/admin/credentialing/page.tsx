"use client";

import { useState } from "react";
import { Search, Download, Eye, CheckCircle, Clock, AlertTriangle, XCircle, MoreVertical, BadgeCheck, FileText, Calendar, X, Plus, User, Building2, Mail, Phone, MapPin, Shield, Zap, RefreshCw, ShieldCheck, ShieldAlert, ShieldX, ExternalLink, UserCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/admin/ThemeContext";
import { Card, CardHeader } from "@/components/admin/ui/Card";
import { StatCard } from "@/components/admin/ui/StatCard";
import { Badge, StatusBadge } from "@/components/admin/ui/Badge";
import { Button, IconButton } from "@/components/admin/ui/Button";
import { PageHeader, Tabs } from "@/components/admin/ui/PageHeader";
import { SearchInput } from "@/components/admin/ui/SearchInput";
import { cn } from "@/lib/utils";

const applications = [
  { id: "CRED-2024-1247", provider: "Dr. Sarah Mitchell", npi: "1234567890", specialty: "Cardiology", status: "pending", submitted: "2024-03-10", stage: "PSV In Progress", email: "dr.mitchell@cardio.com", phone: "(555) 123-4567", address: "100 Heart Center Dr, Cleveland, OH 44101", license: "OH-MD-123456", licenseExp: "2026-12-31", dea: "BM1234567", deaExp: "2025-06-30", malpractice: "Current", boardCert: "ABIM Cardiovascular Disease" },
  { id: "CRED-2024-1246", provider: "Dr. James Wilson", npi: "2345678901", specialty: "Orthopedics", status: "committee", submitted: "2024-03-08", stage: "Committee Review", email: "dr.wilson@ortho.com", phone: "(555) 234-5678", address: "200 Bone & Joint Blvd, Lakewood, OH 44107", license: "OH-DO-234567", licenseExp: "2025-08-31", dea: "BW2345678", deaExp: "2025-09-30", malpractice: "Current", boardCert: "ABOS Orthopedic Surgery" },
  { id: "CRED-2024-1245", provider: "Metro Imaging Center", npi: "3456789012", specialty: "Radiology", status: "approved", submitted: "2024-03-05", stage: "Complete", email: "admin@metroimaging.com", phone: "(555) 345-6789", address: "300 Imaging Way, Cleveland, OH 44102", license: "FAC-OH-345678", licenseExp: "2026-03-31", dea: "N/A", deaExp: "N/A", malpractice: "Current", boardCert: "ACR Accredited" },
  { id: "CRED-2024-1244", provider: "Dr. Emily Chen", npi: "4567890123", specialty: "Pediatrics", status: "pending", submitted: "2024-03-03", stage: "Document Review", email: "dr.chen@pediatrics.com", phone: "(555) 456-7890", address: "400 Kids Care Lane, Shaker Heights, OH 44120", license: "OH-MD-456789", licenseExp: "2027-01-31", dea: "BC4567890", deaExp: "2026-02-28", malpractice: "Current", boardCert: "ABP General Pediatrics" },
  { id: "CRED-2024-1243", provider: "Cleveland Physical Therapy", npi: "5678901234", specialty: "Physical Therapy", status: "approved", submitted: "2024-02-28", stage: "Complete", email: "info@clevelandpt.com", phone: "(555) 567-8901", address: "500 Rehab Road, Brooklyn, OH 44144", license: "FAC-OH-567890", licenseExp: "2025-12-31", dea: "N/A", deaExp: "N/A", malpractice: "Current", boardCert: "APTA Certified" },
  { id: "CRED-2024-1242", provider: "Dr. Robert Kim", npi: "6789012345", specialty: "Dermatology", status: "denied", submitted: "2024-02-25", stage: "Failed PSV", email: "dr.kim@dermatology.com", phone: "(555) 678-9012", address: "600 Skin Care Blvd, Westlake, OH 44145", license: "OH-MD-678901", licenseExp: "2024-06-30", dea: "BK6789012", deaExp: "2024-12-31", malpractice: "Lapsed", boardCert: "AAD Board Eligible", denialReason: "Malpractice insurance expired" },
  { id: "CRED-2024-1241", provider: "Dr. Lisa Martinez", npi: "7890123456", specialty: "Neurology", status: "pending", submitted: "2024-02-20", stage: "Primary Source Verification", email: "dr.martinez@neuro.com", phone: "(555) 789-0123", address: "700 Brain Health Ave, Mayfield, OH 44143", license: "OH-MD-789012", licenseExp: "2026-09-30", dea: "BM7890123", deaExp: "2025-11-30", malpractice: "Current", boardCert: "ABPN Neurology" },
  { id: "CRED-2024-1240", provider: "Westlake Surgery Center", npi: "8901234567", specialty: "Ambulatory Surgery", status: "committee", submitted: "2024-02-15", stage: "Committee Review", email: "admin@westlakesurgery.com", phone: "(555) 890-1234", address: "800 Surgery Lane, Westlake, OH 44145", license: "FAC-OH-890123", licenseExp: "2025-06-30", dea: "N/A", deaExp: "N/A", malpractice: "Current", boardCert: "AAAHC Accredited" },
];

const stats = [
  { label: "Total Applications", value: "156", trend: "up" as const, change: "+24", icon: <FileText className="w-5 h-5" /> },
  { label: "Pending Review", value: "34", trend: "warning" as const, change: "Awaiting", icon: <Clock className="w-5 h-5" /> },
  { label: "Approved (YTD)", value: "89", trend: "up" as const, change: "+12", icon: <CheckCircle className="w-5 h-5" /> },
  { label: "Avg. Processing", value: "12d", trend: "up" as const, change: "-3d", icon: <Zap className="w-5 h-5" /> },
];

const statusFilters = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Committee", value: "committee" },
  { label: "Approved", value: "approved" },
  { label: "Denied", value: "denied" },
];

interface CredentialCheck {
  type: string;
  status: string;
  verifiedAt?: string;
  expiresAt?: string;
  source: string;
  details: Record<string, unknown>;
  flags?: string[];
}

interface VerificationResult {
  npi: string;
  transactionId: string;
  processingTimeMs: number;
  provider: {
    name: string;
    type: string;
    credentials: string[];
    specialty: string;
    taxonomyCode: string;
    address: { line1: string; city: string; state: string; zip: string };
    phone?: string;
  };
  overallStatus: string;
  riskLevel: string;
  credentialingScore: number;
  checks: CredentialCheck[];
  sanctions: { found: boolean; database: string; entries: Array<{ source: string; date: string; reason?: string; status: string }> };
  recommendations: string[];
  summary: string;
}

export default function CredentialingPage() {
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedApplication, setSelectedApplication] = useState<typeof applications[0] | null>(null);
  const [showNewAppModal, setShowNewAppModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState(false);
  
  // Verification state
  const [verifyNpi, setVerifyNpi] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  const filteredApplications = applications.filter((app) => {
    const matchesSearch = app.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.npi.includes(searchQuery) ||
      app.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAction = (action: string, appId: string) => {
    setShowActionsMenu(null);
    console.log(`Action: ${action} on ${appId}`);
  };

  const handleNewApplication = () => {
    setActionSuccess(true);
    setTimeout(() => {
      setShowNewAppModal(false);
      setActionSuccess(false);
    }, 2000);
  };

  const handleVerifyNpi = async (npi: string) => {
    setIsVerifying(true);
    setVerificationError(null);
    setVerificationResult(null);
    
    try {
      const response = await fetch('/api/admin/credentialing/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ npi, providerType: 'INDIVIDUAL' }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to verify credentials');
      }
      
      const result = await response.json();
      setVerificationResult(result);
    } catch (error) {
      setVerificationError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsVerifying(false);
    }
  };

  const getCheckStatusIcon = (status: string) => {
    switch (status) {
      case 'VERIFIED': return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'PENDING': return <Clock className="w-5 h-5 text-amber-400" />;
      case 'EXPIRED': return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'FAILED': return <XCircle className="w-5 h-5 text-red-400" />;
      case 'FLAGGED': return <ShieldAlert className="w-5 h-5 text-red-400" />;
      case 'NOT_FOUND': return <ShieldX className="w-5 h-5 text-slate-400" />;
      default: return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="Credentialing"
        subtitle="Review and verify provider credentials and qualifications"
        actions={
          <>
            <Button 
              variant="outline" 
              icon={<ShieldCheck className="w-4 h-4" />}
              onClick={() => setShowVerifyModal(true)}
            >
              Instant Verify
            </Button>
            <Button 
              variant="primary" 
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setShowNewAppModal(true)}
            >
              New Application
            </Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, i) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            trend={stat.trend}
            icon={stat.icon}
            delay={i}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Applications Table - 3 columns */}
        <div className="lg:col-span-3 space-y-4">
          {/* Filters */}
          <Card padding="md">
            <div className="flex flex-col sm:flex-row gap-4">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search by provider, NPI, or specialty..."
                className="flex-1"
                showShortcut
              />
              <Tabs
                tabs={statusFilters}
                value={statusFilter}
                onChange={setStatusFilter}
              />
            </div>
          </Card>

          {/* Table */}
          <Card padding="none">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={cn(
                    "text-left text-xs font-medium uppercase tracking-wider border-b",
                    isDark ? "text-slate-400 border-slate-700 bg-slate-800/50" : "text-slate-500 border-slate-200 bg-slate-50"
                  )}>
                    <th className="px-6 py-4">Application</th>
                    <th className="px-6 py-4">Provider</th>
                    <th className="px-6 py-4">Specialty</th>
                    <th className="px-6 py-4">Stage</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className={cn("divide-y", isDark ? "divide-slate-700/50" : "divide-slate-100")}>
                  {filteredApplications.map((app) => (
                    <tr key={app.id} className={cn(
                      "transition-colors",
                      isDark ? "hover:bg-slate-700/30" : "hover:bg-slate-50"
                    )}>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedApplication(app)}
                          className="font-mono text-sm text-cyan-500 hover:text-cyan-400 hover:underline"
                        >
                          {app.id}
                        </button>
                        <p className={cn("text-xs mt-0.5", isDark ? "text-slate-500" : "text-slate-400")}>
                          Submitted {app.submitted}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>
                          {app.provider}
                        </p>
                        <p className={cn("text-xs font-mono mt-0.5", isDark ? "text-slate-500" : "text-slate-400")}>
                          NPI: {app.npi}
                        </p>
                      </td>
                      <td className={cn("px-6 py-4", isDark ? "text-slate-300" : "text-slate-600")}>
                        {app.specialty}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="default">{app.stage}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <IconButton
                            icon={<Eye className="w-4 h-4" />}
                            onClick={() => setSelectedApplication(app)}
                            tooltip="View Details"
                          />
                          <div className="relative">
                            <IconButton
                              icon={<MoreVertical className="w-4 h-4" />}
                              onClick={() => setShowActionsMenu(showActionsMenu === app.id ? null : app.id)}
                            />
                            <AnimatePresence>
                              {showActionsMenu === app.id && (
                                <motion.div
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  className={cn(
                                    "absolute right-0 top-full mt-1 w-48 rounded-xl shadow-lg z-20 py-1",
                                    isDark ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-200"
                                  )}
                                >
                                  {["Approve", "Request More Info", "Schedule Review", "Deny"].map((action) => (
                                    <button
                                      key={action}
                                      onClick={() => handleAction(action.toLowerCase(), app.id)}
                                      className={cn(
                                        "w-full px-4 py-2 text-sm text-left transition-colors",
                                        isDark ? "text-slate-300 hover:bg-slate-700" : "text-slate-700 hover:bg-slate-100",
                                        action === "Deny" && "text-red-500"
                                      )}
                                    >
                                      {action}
                                    </button>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Expiring Credentials Sidebar - 1 column */}
        <Card className="h-fit">
          <CardHeader
            title="Expiring Soon"
            icon={<AlertTriangle className="w-5 h-5 text-amber-500" />}
          />
          <div className="space-y-3">
            {[
              { provider: "Dr. James Wilson", credential: "Medical License (OH)", expires: "Apr 15", daysLeft: 34 },
              { provider: "Metro Imaging", credential: "Facility License", expires: "Apr 20", daysLeft: 39 },
              { provider: "Dr. Amy Foster", credential: "DEA Registration", expires: "Apr 30", daysLeft: 49 },
              { provider: "Dr. Michael Brown", credential: "Board Certification", expires: "May 15", daysLeft: 64 },
            ].map((item, i) => (
              <div key={i} className={cn(
                "p-3 rounded-xl",
                isDark ? "bg-slate-700/30 border border-slate-700/50" : "bg-slate-50 border border-slate-100"
              )}>
                <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>
                  {item.provider}
                </p>
                <p className={cn("text-xs mt-0.5", isDark ? "text-slate-400" : "text-slate-500")}>
                  {item.credential}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-amber-500 font-medium">{item.expires}</span>
                  <Badge variant="warning" size="sm">{item.daysLeft}d</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Application Detail Modal */}
      <AnimatePresence>
        {selectedApplication && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedApplication(null)} 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={cn(
                "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl z-50 overflow-hidden",
                isDark ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-200"
              )}
            >
              {/* Modal Header */}
              <div className={cn(
                "flex items-center justify-between p-5 border-b",
                isDark ? "border-slate-700" : "border-slate-200"
              )}>
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    isDark ? "bg-cyan-500/20" : "bg-cyan-50"
                  )}>
                    <UserCheck className="w-6 h-6 text-cyan-500" />
                  </div>
                  <div>
                    <h2 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-slate-900")}>
                      {selectedApplication.provider}
                    </h2>
                    <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                      {selectedApplication.id} • {selectedApplication.specialty}
                    </p>
                  </div>
                </div>
                <IconButton
                  icon={<X className="w-5 h-5" />}
                  onClick={() => setSelectedApplication(null)}
                />
              </div>

              {/* Modal Content */}
              <div className="p-5 overflow-y-auto max-h-[calc(90vh-180px)] space-y-5">
                {/* Status */}
                <div className="flex flex-wrap gap-2">
                  <StatusBadge status={selectedApplication.status} />
                  <Badge variant="default">{selectedApplication.stage}</Badge>
                </div>

                {/* Details Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Contact Info */}
                  <div className={cn(
                    "rounded-xl p-5",
                    isDark ? "bg-slate-700/50 border border-slate-600/50" : "bg-slate-50 border border-slate-200"
                  )}>
                    <h3 className={cn("font-medium mb-4 flex items-center gap-2", isDark ? "text-white" : "text-slate-900")}>
                      <User className="w-4 h-4 text-cyan-500" />
                      Contact Information
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span className={isDark ? "text-slate-300" : "text-slate-600"}>{selectedApplication.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <span className={isDark ? "text-slate-300" : "text-slate-600"}>{selectedApplication.phone}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                        <span className={isDark ? "text-slate-300" : "text-slate-600"}>{selectedApplication.address}</span>
                      </div>
                    </div>
                  </div>

                  {/* Credentials */}
                  <div className={cn(
                    "rounded-xl p-5",
                    isDark ? "bg-slate-700/50 border border-slate-600/50" : "bg-slate-50 border border-slate-200"
                  )}>
                    <h3 className={cn("font-medium mb-4 flex items-center gap-2", isDark ? "text-white" : "text-slate-900")}>
                      <Shield className="w-4 h-4 text-emerald-500" />
                      Credentials
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className={isDark ? "text-slate-400" : "text-slate-500"}>NPI</span>
                        <span className={cn("font-mono", isDark ? "text-white" : "text-slate-900")}>{selectedApplication.npi}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={isDark ? "text-slate-400" : "text-slate-500"}>License</span>
                        <span className={isDark ? "text-white" : "text-slate-900"}>{selectedApplication.license}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={isDark ? "text-slate-400" : "text-slate-500"}>DEA</span>
                        <span className={isDark ? "text-white" : "text-slate-900"}>{selectedApplication.dea}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={isDark ? "text-slate-400" : "text-slate-500"}>Board Cert</span>
                        <span className={isDark ? "text-white" : "text-slate-900"}>{selectedApplication.boardCert}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Denial Reason */}
                {selectedApplication.status === "denied" && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                    <p className="text-sm text-red-500 font-medium">
                      Denial Reason: {(selectedApplication as typeof selectedApplication & {denialReason?: string}).denialReason || "Not specified"}
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className={cn(
                "flex items-center justify-between p-5 border-t",
                isDark ? "border-slate-700 bg-slate-800/50" : "border-slate-200 bg-slate-50"
              )}>
                <Button variant="outline">Request Documents</Button>
                <div className="flex gap-3">
                  {selectedApplication.status === "pending" && (
                    <>
                      <Button variant="danger">Deny</Button>
                      <Button variant="primary">Approve</Button>
                    </>
                  )}
                  {selectedApplication.status !== "pending" && (
                    <Button variant="primary" onClick={() => setSelectedApplication(null)}>
                      Close
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* New Application Modal */}
      <AnimatePresence>
        {showNewAppModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setShowNewAppModal(false)} 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={cn(
                "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg rounded-2xl shadow-2xl z-50",
                isDark ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-200"
              )}
            >
              {actionSuccess ? (
                <div className="p-10 text-center">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-5">
                    <CheckCircle className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className={cn("text-xl font-bold mb-2", isDark ? "text-white" : "text-slate-900")}>
                    Application Created!
                  </h3>
                  <p className={isDark ? "text-slate-400" : "text-slate-500"}>
                    The credentialing application has been submitted.
                  </p>
                </div>
              ) : (
                <>
                  <div className={cn("p-5 border-b", isDark ? "border-slate-700" : "border-slate-200")}>
                    <h3 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-slate-900")}>
                      New Credentialing Application
                    </h3>
                  </div>
                  <div className="p-5 space-y-4">
                    <div>
                      <label className={cn("block text-sm font-medium mb-2", isDark ? "text-slate-300" : "text-slate-700")}>
                        Provider NPI
                      </label>
                      <input 
                        type="text" 
                        placeholder="Enter 10-digit NPI"
                        className={cn(
                          "w-full px-4 py-2.5 rounded-lg text-sm",
                          isDark 
                            ? "bg-slate-700 border border-slate-600 text-white placeholder-slate-500" 
                            : "bg-white border border-slate-300 text-slate-900 placeholder-slate-400"
                        )} 
                      />
                    </div>
                    <div>
                      <label className={cn("block text-sm font-medium mb-2", isDark ? "text-slate-300" : "text-slate-700")}>
                        Provider Type
                      </label>
                      <select className={cn(
                        "w-full px-4 py-2.5 rounded-lg text-sm",
                        isDark 
                          ? "bg-slate-700 border border-slate-600 text-white" 
                          : "bg-white border border-slate-300 text-slate-900"
                      )}>
                        <option>Individual Provider</option>
                        <option>Facility / Organization</option>
                      </select>
                    </div>
                    <div>
                      <label className={cn("block text-sm font-medium mb-2", isDark ? "text-slate-300" : "text-slate-700")}>
                        Specialty
                      </label>
                      <select className={cn(
                        "w-full px-4 py-2.5 rounded-lg text-sm",
                        isDark 
                          ? "bg-slate-700 border border-slate-600 text-white" 
                          : "bg-white border border-slate-300 text-slate-900"
                      )}>
                        <option>Primary Care</option>
                        <option>Cardiology</option>
                        <option>Orthopedics</option>
                        <option>Radiology</option>
                        <option>Other Specialty</option>
                      </select>
                    </div>
                  </div>
                  <div className={cn(
                    "flex gap-3 p-5 border-t",
                    isDark ? "border-slate-700" : "border-slate-200"
                  )}>
                    <Button variant="outline" className="flex-1" onClick={() => setShowNewAppModal(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" className="flex-1" onClick={handleNewApplication}>
                      Submit Application
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Instant Verify Modal */}
      <AnimatePresence>
        {showVerifyModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => { setShowVerifyModal(false); setVerificationResult(null); }} 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={cn(
                "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl z-50 overflow-hidden",
                isDark ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-200"
              )}
            >
              <div className={cn("p-5 border-b", isDark ? "border-slate-700" : "border-slate-200")}>
                <h3 className={cn("text-lg font-semibold flex items-center gap-2", isDark ? "text-white" : "text-slate-900")}>
                  <ShieldCheck className="w-5 h-5 text-cyan-500" />
                  Instant Credential Verification
                </h3>
                <p className={cn("text-sm mt-1", isDark ? "text-slate-400" : "text-slate-500")}>
                  Verify provider credentials against NPPES, state boards, and sanction databases
                </p>
              </div>
              
              <div className="p-5 max-h-[calc(90vh-200px)] overflow-y-auto space-y-5">
                {/* Search Input */}
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    value={verifyNpi}
                    onChange={(e) => setVerifyNpi(e.target.value)}
                    placeholder="Enter 10-digit NPI number"
                    className={cn(
                      "flex-1 px-4 py-2.5 rounded-lg text-sm font-mono",
                      isDark 
                        ? "bg-slate-700 border border-slate-600 text-white placeholder-slate-500" 
                        : "bg-white border border-slate-300 text-slate-900 placeholder-slate-400"
                    )} 
                  />
                  <Button 
                    variant="primary" 
                    onClick={() => handleVerifyNpi(verifyNpi)}
                    loading={isVerifying}
                    icon={<Zap className="w-4 h-4" />}
                  >
                    Verify
                  </Button>
                </div>

                {/* Error */}
                {verificationError && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                    <p className="text-sm text-red-500">{verificationError}</p>
                  </div>
                )}

                {/* Results */}
                {verificationResult && (
                  <div className="space-y-4">
                    {/* Provider Info */}
                    <div className={cn(
                      "rounded-xl p-5",
                      isDark ? "bg-slate-700/50 border border-slate-600/50" : "bg-slate-50 border border-slate-200"
                    )}>
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className={cn("font-semibold", isDark ? "text-white" : "text-slate-900")}>
                            {verificationResult.provider.name}
                          </h4>
                          <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                            {verificationResult.provider.specialty}
                          </p>
                        </div>
                        <Badge 
                          variant={verificationResult.overallStatus === "PASS" ? "success" : verificationResult.overallStatus === "REVIEW" ? "warning" : "error"}
                        >
                          {verificationResult.overallStatus}
                        </Badge>
                      </div>
                      <div className="mt-4 flex items-center gap-4">
                        <div className="text-center">
                          <p className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                            {verificationResult.credentialingScore}
                          </p>
                          <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Score</p>
                        </div>
                        <div className="text-center">
                          <Badge variant={verificationResult.riskLevel === "LOW" ? "success" : "warning"}>
                            {verificationResult.riskLevel} Risk
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Checks */}
                    <div className="space-y-2">
                      {verificationResult.checks.map((check, i) => (
                        <div key={i} className={cn(
                          "flex items-center justify-between p-3 rounded-lg",
                          isDark ? "bg-slate-700/30" : "bg-slate-50"
                        )}>
                          <div className="flex items-center gap-3">
                            {getCheckStatusIcon(check.status)}
                            <div>
                              <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>
                                {check.type}
                              </p>
                              <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                                {check.source}
                              </p>
                            </div>
                          </div>
                          <Badge 
                            variant={check.status === "VERIFIED" ? "success" : check.status === "PENDING" ? "warning" : "error"}
                            size="sm"
                          >
                            {check.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className={cn(
                "flex justify-end p-5 border-t",
                isDark ? "border-slate-700" : "border-slate-200"
              )}>
                <Button variant="outline" onClick={() => { setShowVerifyModal(false); setVerificationResult(null); }}>
                  Close
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
