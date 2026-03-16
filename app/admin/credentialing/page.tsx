"use client";

import { useState } from "react";
import { Search, Download, Eye, CheckCircle, Clock, AlertTriangle, XCircle, MoreVertical, BadgeCheck, FileText, Calendar, X, Plus, User, Building2, Mail, Phone, MapPin, Shield, Zap, RefreshCw, ShieldCheck, ShieldAlert, ShieldX, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/admin/ThemeContext";

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

const expiringCredentials = [
  { provider: "Dr. James Wilson", credential: "Medical License (OH)", expires: "Apr 15, 2026", daysLeft: 34 },
  { provider: "Metro Imaging", credential: "Facility License", expires: "Apr 20, 2026", daysLeft: 39 },
  { provider: "Dr. Amy Foster", credential: "DEA Registration", expires: "Apr 30, 2026", daysLeft: 49 },
  { provider: "Dr. Michael Brown", credential: "Board Certification", expires: "May 15, 2026", daysLeft: 64 },
];

const statusOptions = ["All", "Pending", "Committee", "Approved", "Denied"];

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
  const [statusFilter, setStatusFilter] = useState("All");
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
    const matchesStatus = statusFilter === "All" || app.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full"><CheckCircle className="w-3 h-3" />Approved</span>;
      case "denied": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 text-xs font-medium rounded-full"><XCircle className="w-3 h-3" />Denied</span>;
      case "pending": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full"><Clock className="w-3 h-3" />Pending</span>;
      case "committee": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-cyan-600/20 text-cyan-500 text-xs font-medium rounded-full"><BadgeCheck className="w-3 h-3" />Committee</span>;
      default: return null;
    }
  };

  const handleAction = (action: string, appId: string) => {
    setShowActionsMenu(null);
    // In a real app, this would perform the action
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
      case 'VERIFIED': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'PENDING': return <Clock className="w-5 h-5 text-amber-400" />;
      case 'EXPIRED': return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'FAILED': return <XCircle className="w-5 h-5 text-red-400" />;
      case 'FLAGGED': return <ShieldAlert className="w-5 h-5 text-red-400" />;
      case 'NOT_FOUND': return <ShieldX className="w-5 h-5 text-slate-400" />;
      default: return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  const getCheckStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED': return 'bg-green-500/20 border-green-500/30';
      case 'PENDING': return 'bg-amber-500/20 border-amber-500/30';
      case 'EXPIRED': return 'bg-amber-500/20 border-amber-500/30';
      case 'FAILED': return 'bg-red-500/20 border-red-500/30';
      case 'FLAGGED': return 'bg-red-500/20 border-red-500/30';
      default: return 'bg-slate-700/50 border-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Provider Credentialing</h1>
          <p className="text-slate-400">Manage provider applications and credentials</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowVerifyModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            <Zap className="w-4 h-4" />
            Verify NPI
          </button>
          <button 
            onClick={() => setShowNewAppModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            <Plus className="w-4 h-4" />
            New Application
          </button>
        </div>
      </div>

      {/* Stats - Theme Aware */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { value: "47", label: "Pending Applications", highlight: false },
          { value: "12", label: "Committee Review", highlight: false },
          { value: "18", label: "Expiring (30 days)", highlight: false },
          { value: "94%", label: "Approval Rate", highlight: true },
        ].map((stat, i) => (
          <div 
            key={i}
            className={`rounded-xl p-4 shadow-lg ${
              isDark 
                ? 'bg-slate-950 border border-slate-800'
                : 'bg-cyan-600 border border-cyan-500'
            }`}
          >
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-white'}`}>{stat.value}</p>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-cyan-100'}`}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Applications Table */}
        <div className="lg:col-span-2 bg-slate-800/50 rounded-xl border border-slate-700">
          <div className="p-4 border-b border-slate-700">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search providers, NPI..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      statusFilter === status ? "bg-teal-600 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800 border-b border-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Provider</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Specialty</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Stage</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-700/50 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-white">{app.provider}</p>
                        <p className="text-xs text-slate-500">NPI: {app.npi}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{app.specialty}</td>
                    <td className="px-4 py-3 text-slate-400 text-sm">{app.stage}</td>
                    <td className="px-4 py-3">{getStatusBadge(app.status)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2 relative">
                        <button 
                          onClick={() => setSelectedApplication(app)}
                          className="p-1.5 text-slate-400 hover:text-cyan-500 hover:bg-cyan-600/20 rounded"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setShowActionsMenu(showActionsMenu === app.id ? null : app.id)}
                          className="p-1.5 text-slate-400 hover:text-slate-300 hover:bg-slate-600 rounded"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        
                        {/* Actions Dropdown */}
                        {showActionsMenu === app.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-slate-700 border border-slate-600 rounded-lg shadow-xl z-10">
                            <button 
                              onClick={() => handleAction('review', app.id)}
                              className="w-full px-4 py-2 text-left text-sm text-white hover:bg-slate-600 rounded-t-lg"
                            >
                              Review Application
                            </button>
                            <button 
                              onClick={() => handleAction('request-docs', app.id)}
                              className="w-full px-4 py-2 text-left text-sm text-white hover:bg-slate-600"
                            >
                              Request Documents
                            </button>
                            {app.status === "pending" && (
                              <button 
                                onClick={() => handleAction('escalate', app.id)}
                                className="w-full px-4 py-2 text-left text-sm text-white hover:bg-slate-600"
                              >
                                Escalate to Committee
                              </button>
                            )}
                            {(app.status === "pending" || app.status === "committee") && (
                              <>
                                <button 
                                  onClick={() => handleAction('approve', app.id)}
                                  className="w-full px-4 py-2 text-left text-sm text-green-400 hover:bg-slate-600"
                                >
                                  Approve
                                </button>
                                <button 
                                  onClick={() => handleAction('deny', app.id)}
                                  className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-slate-600 rounded-b-lg"
                                >
                                  Deny
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expiring Credentials */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700">
          <div className="p-4 border-b border-slate-700 flex items-center justify-between">
            <h2 className="font-semibold text-white">Expiring Credentials</h2>
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <div className="divide-y divide-slate-700">
            {expiringCredentials.map((cred, i) => (
              <div key={i} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-white text-sm">{cred.provider}</p>
                    <p className="text-xs text-slate-400">{cred.credential}</p>
                  </div>
                  <span className={`px-2 py-0.5 text-xs rounded ${
                    cred.daysLeft <= 30 ? "bg-red-500/20 text-red-400" : 
                    cred.daysLeft <= 60 ? "bg-amber-500/20 text-amber-400" : "bg-slate-700 text-slate-400"
                  }`}>
                    {cred.daysLeft} days
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Calendar className="w-3 h-3" />
                  Expires: {cred.expires}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-slate-700">
            <button className="w-full text-center text-cyan-500 hover:text-cyan-400 text-sm font-medium">
              Send Renewal Reminders
            </button>
          </div>
        </div>
      </div>

      {/* Workflow Stats */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
        <h2 className="font-semibold text-white mb-4">Credentialing Workflow</h2>
        <div className="grid grid-cols-5 gap-4">
          {[
            { stage: "Application", count: 12 },
            { stage: "Document Review", count: 18 },
            { stage: "PSV", count: 15 },
            { stage: "Committee", count: 8 },
            { stage: "Complete", count: 142 },
          ].map((stage, i) => (
            <div key={stage.stage} className="text-center">
              <div className="w-12 h-12 bg-slate-700 border border-slate-600 rounded-full mx-auto flex items-center justify-center text-cyan-400 font-bold mb-2">
                {stage.count}
              </div>
              <p className="text-xs text-slate-400">{stage.stage}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Application Detail Modal */}
      <AnimatePresence>
        {selectedApplication && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedApplication(null)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-700">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-cyan-600/20 rounded-lg flex items-center justify-center">
                    <User className="w-6 h-6 text-cyan-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">{selectedApplication.provider}</h2>
                    <p className="text-sm text-slate-400">{selectedApplication.id} • {selectedApplication.specialty}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedApplication(null)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 overflow-y-auto max-h-[calc(90vh-180px)]">
                <div className="flex gap-2 mb-6">
                  {getStatusBadge(selectedApplication.status)}
                  <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs font-medium rounded-full">
                    {selectedApplication.stage}
                  </span>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h3 className="font-medium text-white mb-3 flex items-center gap-2"><User className="w-4 h-4 text-blue-400" />Contact Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-slate-300"><Mail className="w-4 h-4 text-slate-500" />{selectedApplication.email}</div>
                        <div className="flex items-center gap-2 text-slate-300"><Phone className="w-4 h-4 text-slate-500" />{selectedApplication.phone}</div>
                        <div className="flex items-center gap-2 text-slate-300"><MapPin className="w-4 h-4 text-slate-500" />{selectedApplication.address}</div>
                      </div>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h3 className="font-medium text-white mb-3 flex items-center gap-2"><Building2 className="w-4 h-4 text-green-400" />Provider Details</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-slate-400">NPI</span><span className="text-white font-mono">{selectedApplication.npi}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Specialty</span><span className="text-white">{selectedApplication.specialty}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Submitted</span><span className="text-white">{selectedApplication.submitted}</span></div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h3 className="font-medium text-white mb-3 flex items-center gap-2"><Shield className="w-4 h-4 text-cyan-500" />Medical License</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-slate-400">License #</span><span className="text-white font-mono">{selectedApplication.license}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Expires</span><span className="text-white">{selectedApplication.licenseExp}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Status</span><span className="text-green-400">Valid</span></div>
                      </div>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h3 className="font-medium text-white mb-3">DEA Registration</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-slate-400">DEA #</span><span className="text-white font-mono">{selectedApplication.dea}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Expires</span><span className="text-white">{selectedApplication.deaExp}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Status</span><span className={selectedApplication.dea === "N/A" ? "text-slate-400" : "text-green-400"}>{selectedApplication.dea === "N/A" ? "N/A" : "Valid"}</span></div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h3 className="font-medium text-white mb-3">Malpractice Insurance</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-slate-400">Status</span><span className={selectedApplication.malpractice === "Current" ? "text-green-400" : "text-red-400"}>{selectedApplication.malpractice}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Coverage</span><span className="text-white">$1M/$3M</span></div>
                      </div>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h3 className="font-medium text-white mb-3">Board Certification</h3>
                      <div className="space-y-2 text-sm">
                        <div><span className="text-slate-400">Certification:</span></div>
                        <div><span className="text-white">{selectedApplication.boardCert}</span></div>
                      </div>
                    </div>

                    {selectedApplication.status === "denied" && selectedApplication.denialReason && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                        <h3 className="font-medium text-red-400 mb-2">Denial Reason</h3>
                        <p className="text-sm text-red-300">{selectedApplication.denialReason}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border-t border-slate-700 bg-slate-800">
                <button className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 text-sm inline-flex items-center gap-2">
                  <FileText className="w-4 h-4" />View Documents
                </button>
                <div className="flex gap-2">
                  {(selectedApplication.status === "pending" || selectedApplication.status === "committee") && (
                    <>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">Deny</button>
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">Approve</button>
                    </>
                  )}
                  <button onClick={() => setSelectedApplication(null)} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm">Close</button>
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !actionSuccess && setShowNewAppModal(false)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
              {actionSuccess ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Application Submitted!</h3>
                  <p className="text-slate-400">The credentialing application has been created and is pending review.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between p-4 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-cyan-600/20 rounded-lg flex items-center justify-center">
                        <Plus className="w-5 h-5 text-cyan-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">New Credentialing Application</h3>
                        <p className="text-sm text-slate-400">Submit a new provider application</p>
                      </div>
                    </div>
                    <button onClick={() => setShowNewAppModal(false)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"><X className="w-5 h-5" /></button>
                  </div>
                  <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(90vh-180px)]">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Provider/Practice Name *</label>
                      <input type="text" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" placeholder="Dr. John Smith, MD" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">NPI *</label>
                        <input type="text" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" placeholder="1234567890" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Tax ID</label>
                        <input type="text" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" placeholder="XX-XXXXXXX" />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Specialty *</label>
                        <select className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                          <option>Select specialty...</option>
                          <option>Family Medicine</option>
                          <option>Internal Medicine</option>
                          <option>Cardiology</option>
                          <option>Orthopedics</option>
                          <option>Pediatrics</option>
                          <option>Radiology</option>
                          <option>Dermatology</option>
                          <option>Neurology</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Provider Type *</label>
                        <select className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                          <option>Individual (MD/DO)</option>
                          <option>Group Practice</option>
                          <option>Facility</option>
                          <option>Allied Health</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Email *</label>
                      <input type="email" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" placeholder="provider@example.com" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Phone *</label>
                        <input type="tel" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" placeholder="(555) 123-4567" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Medical License #</label>
                        <input type="text" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" placeholder="OH-MD-123456" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Practice Address *</label>
                      <input type="text" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" placeholder="123 Medical Center Dr, Cleveland, OH 44101" />
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">Required Documents</h4>
                      <p className="text-sm text-slate-400 mb-3">The following documents will be requested after submission:</p>
                      <ul className="text-sm text-slate-300 space-y-1">
                        <li>• Copy of Medical License</li>
                        <li>• DEA Certificate (if applicable)</li>
                        <li>• Malpractice Insurance Certificate</li>
                        <li>• Board Certification</li>
                        <li>• CV/Resume</li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex gap-2 p-4 border-t border-slate-700">
                    <button onClick={() => setShowNewAppModal(false)} className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Cancel</button>
                    <button onClick={handleNewApplication} className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">Submit Application</button>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Click outside to close actions menu */}
      {showActionsMenu && (
        <div className="fixed inset-0 z-[5]" onClick={() => setShowActionsMenu(null)} />
      )}

      {/* Verify NPI Modal */}
      <AnimatePresence>
        {showVerifyModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setShowVerifyModal(false); setVerificationResult(null); setVerifyNpi(""); }} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[90vh] overflow-auto bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50">
              <div className="p-4 border-b border-slate-700 flex items-center justify-between sticky top-0 bg-slate-800 z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Credential Verification Engine</h3>
                    <p className="text-sm text-slate-400">Verify provider credentials against authoritative sources</p>
                  </div>
                </div>
                <button onClick={() => { setShowVerifyModal(false); setVerificationResult(null); setVerifyNpi(""); }} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              
              <div className="p-4 space-y-4">
                {!verificationResult && !isVerifying && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Enter NPI to Verify</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={verifyNpi}
                          onChange={(e) => setVerifyNpi(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white text-lg font-mono placeholder:text-slate-500"
                          placeholder="1234567890"
                          maxLength={10}
                        />
                        <button
                          onClick={() => handleVerifyNpi(verifyNpi)}
                          disabled={verifyNpi.length !== 10}
                          className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          <Zap className="w-5 h-5" />
                          Verify
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{verifyNpi.length}/10 digits</p>
                    </div>
                    
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-3">Quick Test NPIs</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { npi: '2345678901', name: 'James Wilson, MD', status: '✅ Clean' },
                          { npi: '9012345678', name: 'Sarah Chen, MD, FACC', status: '✅ Clean' },
                          { npi: '1234567890', name: 'Cleveland Family Medicine', status: '✅ Organization' },
                          { npi: '1111111111', name: 'ABC Medical Group', status: '⚠️ Suspended License' },
                        ].map((test) => (
                          <button
                            key={test.npi}
                            onClick={() => { setVerifyNpi(test.npi); handleVerifyNpi(test.npi); }}
                            className="p-3 bg-slate-600/50 hover:bg-slate-600 rounded-lg text-left transition-colors"
                          >
                            <p className="font-mono text-emerald-400 text-sm">{test.npi}</p>
                            <p className="text-white text-sm">{test.name}</p>
                            <p className="text-xs text-slate-400">{test.status}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">Verification Sources</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2 text-slate-300">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          NPPES Registry
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          State Medical Boards
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          DEA NTIS
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          ABMS Certification
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          OIG LEIE
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          SAM.gov
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {isVerifying && (
                  <div className="flex flex-col items-center justify-center py-16">
                    <RefreshCw className="w-10 h-10 text-emerald-400 animate-spin mb-4" />
                    <p className="text-white font-medium text-lg">Verifying credentials...</p>
                    <p className="text-slate-400 text-sm mt-2">Checking NPI, licenses, DEA, sanctions, board certifications</p>
                  </div>
                )}

                {verificationError && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <p className="text-red-400 font-medium">Verification Failed</p>
                    <p className="text-red-300 text-sm">{verificationError}</p>
                  </div>
                )}

                {verificationResult && (
                  <>
                    {/* Overall Status */}
                    <div className={`rounded-xl p-5 border ${
                      verificationResult.overallStatus === 'VERIFIED' ? 'bg-green-500/10 border-green-500/30' :
                      verificationResult.overallStatus === 'FLAGGED' || verificationResult.overallStatus === 'FAILED' ? 'bg-red-500/10 border-red-500/30' :
                      verificationResult.overallStatus === 'EXPIRED' ? 'bg-amber-500/10 border-amber-500/30' :
                      'bg-slate-700/50 border-slate-600'
                    }`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                            verificationResult.overallStatus === 'VERIFIED' ? 'bg-green-500/20' :
                            verificationResult.overallStatus === 'FLAGGED' || verificationResult.overallStatus === 'FAILED' ? 'bg-red-500/20' :
                            'bg-amber-500/20'
                          }`}>
                            <span className={`text-3xl font-bold ${
                              verificationResult.overallStatus === 'VERIFIED' ? 'text-green-400' :
                              verificationResult.overallStatus === 'FLAGGED' || verificationResult.overallStatus === 'FAILED' ? 'text-red-400' :
                              'text-amber-400'
                            }`}>{verificationResult.credentialingScore}</span>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">{verificationResult.provider.name}</h3>
                            <p className="text-slate-400">{verificationResult.provider.specialty} • {verificationResult.provider.type}</p>
                            <p className="font-mono text-sm text-emerald-400">NPI: {verificationResult.npi}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            verificationResult.overallStatus === 'VERIFIED' ? 'bg-green-500/20 text-green-400' :
                            verificationResult.overallStatus === 'FLAGGED' ? 'bg-red-500/20 text-red-400' :
                            verificationResult.overallStatus === 'FAILED' ? 'bg-red-500/20 text-red-400' :
                            'bg-amber-500/20 text-amber-400'
                          }`}>
                            {verificationResult.overallStatus}
                          </span>
                          <p className="text-xs text-slate-500 mt-2">Risk: {verificationResult.riskLevel}</p>
                          <p className="text-xs text-slate-500">{verificationResult.processingTimeMs}ms</p>
                        </div>
                      </div>
                      <p className="text-white">{verificationResult.summary}</p>
                    </div>

                    {/* Provider Info */}
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-3">Provider Information</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-slate-400">Address</p>
                          <p className="text-white">{verificationResult.provider.address.line1}</p>
                          <p className="text-white">{verificationResult.provider.address.city}, {verificationResult.provider.address.state} {verificationResult.provider.address.zip}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Taxonomy</p>
                          <p className="text-white font-mono">{verificationResult.provider.taxonomyCode}</p>
                          {verificationResult.provider.credentials.length > 0 && (
                            <p className="text-emerald-400">{verificationResult.provider.credentials.join(', ')}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Sanctions Alert */}
                    {verificationResult.sanctions.found && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <ShieldAlert className="w-5 h-5 text-red-400" />
                          <h4 className="font-medium text-red-400">SANCTIONS FOUND</h4>
                        </div>
                        {verificationResult.sanctions.entries.map((entry, i) => (
                          <div key={i} className="bg-red-500/10 rounded p-3 mb-2">
                            <p className="text-red-300 font-medium">{entry.source}</p>
                            <p className="text-red-200 text-sm">Date: {entry.date}</p>
                            {entry.reason && <p className="text-red-200 text-sm">Reason: {entry.reason}</p>}
                            <p className="text-red-400 text-xs uppercase">{entry.status}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Verification Checks */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-white">Verification Results</h4>
                      {verificationResult.checks.map((check, i) => (
                        <div key={i} className={`rounded-lg p-4 border ${getCheckStatusColor(check.status)}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {getCheckStatusIcon(check.status)}
                              <div>
                                <p className="text-white font-medium">{check.type.replace(/_/g, ' ')}</p>
                                <p className="text-xs text-slate-400">{check.source}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`px-2 py-0.5 rounded text-xs ${
                                check.status === 'VERIFIED' ? 'bg-green-500/20 text-green-400' :
                                check.status === 'FAILED' || check.status === 'FLAGGED' ? 'bg-red-500/20 text-red-400' :
                                check.status === 'EXPIRED' ? 'bg-amber-500/20 text-amber-400' :
                                'bg-slate-600 text-slate-300'
                              }`}>{check.status}</span>
                              {check.expiresAt && (
                                <p className="text-xs text-slate-500 mt-1">Exp: {check.expiresAt}</p>
                              )}
                            </div>
                          </div>
                          {check.flags && check.flags.length > 0 && (
                            <div className="mt-2 flex gap-1">
                              {check.flags.map((flag, j) => (
                                <span key={j} className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs">{flag}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Recommendations */}
                    {verificationResult.recommendations.length > 0 && (
                      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                        <h4 className="font-medium text-amber-400 mb-2">Recommendations</h4>
                        <ul className="space-y-1">
                          {verificationResult.recommendations.map((rec, i) => (
                            <li key={i} className="text-amber-300 text-sm flex items-start gap-2">
                              <span className="text-amber-400">•</span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
              
              {verificationResult && (
                <div className="flex gap-2 p-4 border-t border-slate-700 sticky bottom-0 bg-slate-800">
                  <button onClick={() => { setVerificationResult(null); setVerifyNpi(""); }} className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Verify Another</button>
                  <button onClick={() => { setShowVerifyModal(false); setVerificationResult(null); setVerifyNpi(""); }} className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Close</button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
