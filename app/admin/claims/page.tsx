"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Download, Eye, CheckCircle, XCircle, Clock, AlertTriangle, FileText, DollarSign, User, Building2, Calendar, X, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const claims = [
  { id: "CLM-2024-8847", member: "John Doe", memberId: "CHN-123456", provider: "Cleveland Family Medicine", providerNpi: "1234567890", service: "Office Visit (99214)", serviceDate: "2024-03-10", amount: 138.00, allowed: 125.00, memberResp: 25.00, status: "pending", submitted: "2024-03-12", diagnosis: "J06.9 - Acute upper respiratory infection", flags: [] },
  { id: "CLM-2024-8846", member: "Sarah Johnson", memberId: "CHN-234567", provider: "Dr. James Wilson", providerNpi: "2345678901", service: "Annual Physical (99395)", serviceDate: "2024-03-08", amount: 225.00, allowed: 225.00, memberResp: 0, status: "approved", submitted: "2024-03-12", diagnosis: "Z00.00 - General adult medical examination", flags: [] },
  { id: "CLM-2024-8845", member: "Michael Chen", memberId: "CHN-345678", provider: "Metro Imaging Center", providerNpi: "3456789012", service: "MRI - Lumbar Spine (72148)", serviceDate: "2024-03-05", amount: 1850.00, allowed: 1200.00, memberResp: 240.00, status: "review", submitted: "2024-03-11", diagnosis: "M54.5 - Low back pain", flags: ["high-value"] },
  { id: "CLM-2024-8844", member: "Emily Rodriguez", memberId: "CHN-456789", provider: "Cleveland Orthopedic", providerNpi: "4567890123", service: "Knee Surgery (27447)", serviceDate: "2024-03-01", amount: 12500.00, allowed: 9800.00, memberResp: 1960.00, status: "review", submitted: "2024-03-11", diagnosis: "M17.11 - Primary osteoarthritis, right knee", flags: ["high-value", "pre-auth"] },
  { id: "CLM-2024-8843", member: "Robert Williams", memberId: "CHN-567890", provider: "Quick Care Urgent", providerNpi: "5678901234", service: "Urgent Care Visit (99203)", serviceDate: "2024-03-09", amount: 175.00, allowed: 150.00, memberResp: 45.00, status: "approved", submitted: "2024-03-11", diagnosis: "J02.9 - Acute pharyngitis", flags: [] },
  { id: "CLM-2024-8842", member: "Lisa Martinez", memberId: "CHN-678901", provider: "Quest Diagnostics", providerNpi: "6789012345", service: "Lab Work - CBC (85025)", serviceDate: "2024-03-07", amount: 85.00, allowed: 45.00, memberResp: 0, status: "approved", submitted: "2024-03-10", diagnosis: "Z01.812 - Encounter for preprocedural laboratory examination", flags: [] },
  { id: "CLM-2024-8841", member: "David Kim", memberId: "CHN-789012", provider: "Unknown Provider", providerNpi: "N/A", service: "Chiropractic Session (98941)", serviceDate: "2024-03-06", amount: 95.00, allowed: 0, memberResp: 95.00, status: "denied", submitted: "2024-03-10", diagnosis: "M54.2 - Cervicalgia", denialReason: "Provider not in network", flags: ["out-of-network"] },
  { id: "CLM-2024-8840", member: "Jennifer Lee", memberId: "CHN-890123", provider: "PharmaCare Specialty", providerNpi: "8901234567", service: "Specialty Rx - Humira", serviceDate: "2024-03-08", amount: 2340.00, allowed: 2100.00, memberResp: 420.00, status: "pending", submitted: "2024-03-10", diagnosis: "M06.9 - Rheumatoid arthritis", flags: ["specialty-drug"] },
  { id: "CLM-2024-8839", member: "James Thompson", memberId: "CHN-901234", provider: "Cleveland Cardiology", providerNpi: "9012345678", service: "Echocardiogram (93306)", serviceDate: "2024-03-04", amount: 450.00, allowed: 380.00, memberResp: 76.00, status: "approved", submitted: "2024-03-09", diagnosis: "I10 - Essential hypertension", flags: [] },
  { id: "CLM-2024-8838", member: "Patricia Brown", memberId: "CHN-012345", provider: "Women's Health Center", providerNpi: "0123456789", service: "Annual GYN Exam (99395)", serviceDate: "2024-03-03", amount: 275.00, allowed: 275.00, memberResp: 0, status: "approved", submitted: "2024-03-08", diagnosis: "Z01.419 - Gynecological examination", flags: [] },
  { id: "CLM-2024-8837", member: "John Doe", memberId: "CHN-123456", provider: "Quest Diagnostics", providerNpi: "6789012345", service: "Lipid Panel (80061)", serviceDate: "2024-03-02", amount: 65.00, allowed: 45.00, memberResp: 0, status: "approved", submitted: "2024-03-07", diagnosis: "Z13.220 - Screening for lipoid disorders", flags: [] },
  { id: "CLM-2024-8836", member: "Amanda Wilson", memberId: "CHN-112233", provider: "Metro Imaging Center", providerNpi: "3456789012", service: "X-Ray Chest (71046)", serviceDate: "2024-03-01", amount: 185.00, allowed: 125.00, memberResp: 25.00, status: "approved", submitted: "2024-03-06", diagnosis: "R05.9 - Cough, unspecified", flags: [] },
  { id: "CLM-2024-8835", member: "Christopher Davis", memberId: "CHN-223344", provider: "Cleveland Family Medicine", providerNpi: "1234567890", service: "Office Visit (99213)", serviceDate: "2024-02-28", amount: 112.00, allowed: 95.00, memberResp: 25.00, status: "approved", submitted: "2024-03-05", diagnosis: "J30.9 - Allergic rhinitis", flags: [] },
  { id: "CLM-2024-8834", member: "Sarah Johnson", memberId: "CHN-234567", provider: "Physical Therapy Plus", providerNpi: "1122334455", service: "PT Evaluation (97161)", serviceDate: "2024-02-27", amount: 175.00, allowed: 150.00, memberResp: 30.00, status: "pending", submitted: "2024-03-04", diagnosis: "M54.5 - Low back pain", flags: [] },
  { id: "CLM-2024-8833", member: "Michael Chen", memberId: "CHN-345678", provider: "Cleveland Orthopedic", providerNpi: "4567890123", service: "Follow-up Visit (99214)", serviceDate: "2024-02-26", amount: 145.00, allowed: 125.00, memberResp: 25.00, status: "approved", submitted: "2024-03-03", diagnosis: "M54.5 - Low back pain", flags: [] },
  { id: "CLM-2024-8832", member: "Nancy Garcia", memberId: "CHN-334455", provider: "Westlake Dermatology", providerNpi: "2233445566", service: "Skin Biopsy (11102)", serviceDate: "2024-02-25", amount: 320.00, allowed: 280.00, memberResp: 56.00, status: "review", submitted: "2024-03-02", diagnosis: "L82.1 - Seborrheic keratosis", flags: [] },
  { id: "CLM-2024-8831", member: "Kevin Anderson", memberId: "CHN-445566", provider: "Quick Care Urgent", providerNpi: "5678901234", service: "Urgent Care Visit (99203)", serviceDate: "2024-02-24", amount: 175.00, allowed: 150.00, memberResp: 45.00, status: "approved", submitted: "2024-03-01", diagnosis: "S93.401A - Sprain of ankle", flags: [] },
  { id: "CLM-2024-8830", member: "Rachel Taylor", memberId: "CHN-556677", provider: "Cleveland ENT Associates", providerNpi: "3344556677", service: "Audiometry (92557)", serviceDate: "2024-02-23", amount: 95.00, allowed: 75.00, memberResp: 15.00, status: "approved", submitted: "2024-02-28", diagnosis: "H91.90 - Hearing loss", flags: [] },
  { id: "CLM-2024-8829", member: "Emily Rodriguez", memberId: "CHN-456789", provider: "PharmaCare Specialty", providerNpi: "8901234567", service: "Specialty Rx - Enbrel", serviceDate: "2024-02-22", amount: 1890.00, allowed: 1700.00, memberResp: 340.00, status: "approved", submitted: "2024-02-27", diagnosis: "M06.9 - Rheumatoid arthritis", flags: ["specialty-drug"] },
  { id: "CLM-2024-8828", member: "Thomas Moore", memberId: "CHN-667788", provider: "Sleep Center of Ohio", providerNpi: "4455667788", service: "Sleep Study (95810)", serviceDate: "2024-02-21", amount: 1250.00, allowed: 950.00, memberResp: 190.00, status: "pending", submitted: "2024-02-26", diagnosis: "G47.33 - Obstructive sleep apnea", flags: ["high-value"] },
];

const statusOptions = ["All", "Pending", "Review", "Approved", "Denied"];

export default function ClaimsPage() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [memberFilter, setMemberFilter] = useState<string | null>(null);
  const [selectedClaim, setSelectedClaim] = useState<typeof claims[0] | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showDenyModal, setShowDenyModal] = useState(false);

  useEffect(() => {
    const member = searchParams.get('member');
    if (member) {
      setMemberFilter(member);
    }
  }, [searchParams]);

  const filteredClaims = claims.filter((claim) => {
    const matchesSearch = claim.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.member.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.provider.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || claim.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesMember = !memberFilter || claim.memberId === memberFilter;
    return matchesSearch && matchesStatus && matchesMember;
  });

  const memberName = memberFilter ? claims.find(c => c.memberId === memberFilter)?.member : null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full"><CheckCircle className="w-3 h-3" />Approved</span>;
      case "denied": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 text-xs font-medium rounded-full"><XCircle className="w-3 h-3" />Denied</span>;
      case "pending": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full"><Clock className="w-3 h-3" />Pending</span>;
      case "review": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-400 text-xs font-medium rounded-full"><AlertTriangle className="w-3 h-3" />Review</span>;
      default: return null;
    }
  };

  const handleApprove = () => {
    setShowApproveModal(false);
    setSelectedClaim(null);
  };

  const handleDeny = () => {
    setShowDenyModal(false);
    setSelectedClaim(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Claims Management</h1>
          <p className="text-slate-400">Review, approve, and manage all claims</p>
        </div>
        <div className="flex gap-3">
          <a href="/docs/claims-report-sample.pdf" download className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 border border-slate-600">
            <Download className="w-4 h-4" />
            Export Report
          </a>
        </div>
      </div>

      {/* Member Filter Banner */}
      {memberFilter && (
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-purple-400" />
            <span className="text-white">Showing claims for: <strong>{memberName}</strong> ({memberFilter})</span>
          </div>
          <button 
            onClick={() => setMemberFilter(null)}
            className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
          >
            Show All Claims
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-white">1,114</p>
          <p className="text-sm text-slate-400">Total Today</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-amber-400">89</p>
          <p className="text-sm text-slate-400">Pending Review</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-green-400">92%</p>
          <p className="text-sm text-slate-400">Auto-Adjudicated</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-purple-400">$1.24M</p>
          <p className="text-sm text-slate-400">Processed Value</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search claims, members, providers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === status ? "bg-purple-600 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Claims Table */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800 border-b border-slate-700">
              <tr>
                <th className="px-4 py-3 text-left"><input type="checkbox" className="rounded border-slate-600 bg-slate-700" /></th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Claim ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Member</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Provider</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Service</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredClaims.map((claim) => (
                <tr key={claim.id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="px-4 py-3"><input type="checkbox" className="rounded border-slate-600 bg-slate-700" /></td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedClaim(claim)}
                      className="font-mono text-sm text-purple-400 hover:text-purple-300 hover:underline"
                    >
                      {claim.id}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-white">{claim.member}</p>
                      <p className="text-xs text-slate-500">{claim.memberId}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{claim.provider}</td>
                  <td className="px-4 py-3 text-slate-300 text-sm">{claim.service}</td>
                  <td className="px-4 py-3 text-right font-medium text-white">${claim.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">{getStatusBadge(claim.status)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => setSelectedClaim(claim)}
                        className="p-1.5 text-slate-400 hover:text-purple-400 hover:bg-purple-500/20 rounded"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {(claim.status === "pending" || claim.status === "review") && (
                        <>
                          <button 
                            onClick={() => { setSelectedClaim(claim); setShowApproveModal(true); }}
                            className="p-1.5 text-slate-400 hover:text-green-400 hover:bg-green-500/20 rounded"
                            title="Approve"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => { setSelectedClaim(claim); setShowDenyModal(true); }}
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/20 rounded"
                            title="Deny"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-slate-700 flex items-center justify-between bg-slate-800">
          <p className="text-sm text-slate-400">Showing {filteredClaims.length} of {claims.length} claims</p>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-slate-700 text-slate-300 rounded border border-slate-600 hover:bg-slate-600 text-sm">Previous</button>
            <button className="px-3 py-1.5 bg-slate-700 text-slate-300 rounded border border-slate-600 hover:bg-slate-600 text-sm">Next</button>
          </div>
        </div>
      </div>

      {/* Claim Detail Modal */}
      <AnimatePresence>
        {selectedClaim && !showApproveModal && !showDenyModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedClaim(null)}
              className="fixed inset-0 bg-black/60 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[90vh] bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-700">
                <div>
                  <h2 className="text-lg font-semibold text-white">Claim Details</h2>
                  <p className="text-sm text-slate-400">{selectedClaim.id}</p>
                </div>
                <button onClick={() => setSelectedClaim(null)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Claim Info */}
                  <div className="space-y-4">
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h3 className="font-medium text-white mb-3 flex items-center gap-2"><FileText className="w-4 h-4 text-purple-400" />Claim Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-slate-400">Claim ID</span><span className="text-white font-mono">{selectedClaim.id}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Status</span>{getStatusBadge(selectedClaim.status)}</div>
                        <div className="flex justify-between"><span className="text-slate-400">Service Date</span><span className="text-white">{selectedClaim.serviceDate}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Submitted</span><span className="text-white">{selectedClaim.submitted}</span></div>
                      </div>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h3 className="font-medium text-white mb-3 flex items-center gap-2"><User className="w-4 h-4 text-blue-400" />Member</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-slate-400">Name</span><span className="text-white">{selectedClaim.member}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Member ID</span><span className="text-white font-mono">{selectedClaim.memberId}</span></div>
                      </div>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h3 className="font-medium text-white mb-3 flex items-center gap-2"><Building2 className="w-4 h-4 text-green-400" />Provider</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-slate-400">Name</span><span className="text-white">{selectedClaim.provider}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">NPI</span><span className="text-white font-mono">{selectedClaim.providerNpi}</span></div>
                      </div>
                    </div>
                  </div>
                  {/* Financial Info */}
                  <div className="space-y-4">
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h3 className="font-medium text-white mb-3 flex items-center gap-2"><DollarSign className="w-4 h-4 text-amber-400" />Service & Diagnosis</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-slate-400">Service</span><span className="text-white">{selectedClaim.service}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Diagnosis</span><span className="text-white text-xs">{selectedClaim.diagnosis}</span></div>
                      </div>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h3 className="font-medium text-white mb-3">Financial Summary</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-slate-400">Billed Amount</span><span className="text-white">${selectedClaim.amount.toLocaleString()}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Allowed Amount</span><span className="text-white">${selectedClaim.allowed.toLocaleString()}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Plan Pays</span><span className="text-green-400">${(selectedClaim.allowed - selectedClaim.memberResp).toLocaleString()}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Member Responsibility</span><span className="text-amber-400">${selectedClaim.memberResp.toLocaleString()}</span></div>
                      </div>
                    </div>
                    {selectedClaim.status === "denied" && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                        <h3 className="font-medium text-red-400 mb-2">Denial Reason</h3>
                        <p className="text-sm text-red-300">{selectedClaim.denialReason || "Not specified"}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border-t border-slate-700 bg-slate-800">
                <Link 
                  href="/docs/eob" 
                  target="_blank"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  View EOB
                </Link>
                <div className="flex gap-2">
                  {(selectedClaim.status === "pending" || selectedClaim.status === "review") && (
                    <>
                      <button onClick={() => setShowDenyModal(true)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">Deny</button>
                      <button onClick={() => setShowApproveModal(true)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">Approve</button>
                    </>
                  )}
                  <button onClick={() => setSelectedClaim(null)} className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 text-sm">Close</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Approve Modal */}
      <AnimatePresence>
        {showApproveModal && selectedClaim && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowApproveModal(false)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50">
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Approve Claim?</h3>
                <p className="text-slate-400 mb-4">You are about to approve claim {selectedClaim.id} for ${selectedClaim.allowed.toLocaleString()}</p>
                <div className="bg-slate-700/50 rounded-lg p-3 mb-6 text-left">
                  <p className="text-sm text-slate-300"><strong>Provider:</strong> {selectedClaim.provider}</p>
                  <p className="text-sm text-slate-300"><strong>Service:</strong> {selectedClaim.service}</p>
                  <p className="text-sm text-slate-300"><strong>Payment:</strong> ${(selectedClaim.allowed - selectedClaim.memberResp).toLocaleString()}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowApproveModal(false)} className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Cancel</button>
                  <button onClick={handleApprove} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Approve Claim</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Deny Modal */}
      <AnimatePresence>
        {showDenyModal && selectedClaim && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDenyModal(false)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50">
              <div className="p-6">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 text-center">Deny Claim?</h3>
                <p className="text-slate-400 mb-4 text-center">You are about to deny claim {selectedClaim.id}</p>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Denial Reason</label>
                  <select className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                    <option>Select a reason...</option>
                    <option>Service not covered</option>
                    <option>Provider not in network</option>
                    <option>Pre-authorization required</option>
                    <option>Duplicate claim</option>
                    <option>Invalid diagnosis code</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Additional Notes</label>
                  <textarea className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white h-20 resize-none" placeholder="Enter additional details..."></textarea>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowDenyModal(false)} className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Cancel</button>
                  <button onClick={handleDeny} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Deny Claim</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
