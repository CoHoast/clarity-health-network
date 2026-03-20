"use client";

import { useTheme } from "@/components/admin/ThemeContext";
import { cn } from "@/lib/utils";
import { useAudit } from "@/lib/useAudit";
import { ArrowLeft, User, Mail, Phone, Calendar, MapPin, Shield, CreditCard, FileText, CheckCircle, AlertTriangle, X, Edit } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const mockMember = {
  id: "MEM-12847",
  memberId: "CHN-12847-001",
  name: "John Smith",
  email: "john.smith@email.com",
  phone: "(216) 555-0123",
  dob: "1985-06-15",
  address: "456 Oak Street, Cleveland, OH 44101",
  status: "active",
  employer: "Acme Corporation",
  plan: "Family PPO",
  effectiveDate: "2023-01-01",
  terminationDate: null,
  pcp: "Dr. Sarah Chen - Cleveland Family Medicine",
  dependents: [
    { name: "Sarah Smith", relationship: "Spouse", dob: "1987-09-22", status: "active" },
    { name: "Emma Smith", relationship: "Child", dob: "2015-03-10", status: "active" },
  ],
  benefits: {
    deductible: { used: 150, max: 500 },
    outOfPocket: { used: 890, max: 3000 },
    coinsurance: "80%",
  },
  recentClaims: [
    { id: "CLM-001", date: "2024-03-05", provider: "Cleveland Family Medicine", amount: 245, status: "paid" },
    { id: "CLM-002", date: "2024-02-18", provider: "Metro Pharmacy", amount: 65, status: "paid" },
    { id: "CLM-003", date: "2024-02-01", provider: "Westlake Urgent Care", amount: 180, status: "paid" },
    { id: "CLM-004", date: "2024-01-15", provider: "Metro Imaging", amount: 450, status: "paid" },
  ],
  communications: [
    { date: "2024-03-10", type: "EOB", subject: "Explanation of Benefits - Claim CLM-001" },
    { date: "2024-02-20", type: "ID Card", subject: "ID Card Mailed" },
    { date: "2024-01-01", type: "Welcome", subject: "Welcome to TrueCare Health Network" },
  ],
};

export default function MemberDetail({ id }: { id: string }) {
  const { isDark } = useTheme();
  const { logViewMember } = useAudit();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTerminateModal, setShowTerminateModal] = useState(false);
  
  // Log PHI access when member is viewed
  useEffect(() => {
    logViewMember(id, mockMember.name);
  }, [id, logViewMember]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/members" className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">{mockMember.name}</h1>
          <p className="text-slate-400">Member ID: {mockMember.memberId}</p>
        </div>
        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
          {mockMember.status}
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Member Info */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Member Information</h2>
              <button onClick={() => setShowEditModal(true)} className="text-blue-500 hover:text-blue-400 text-sm flex items-center gap-1">
                <Edit className="w-4 h-4" />Edit
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                <Mail className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-400">Email</p>
                  <p className="text-white">{mockMember.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                <Phone className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-400">Phone</p>
                  <p className="text-white">{mockMember.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                <Calendar className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-400">Date of Birth</p>
                  <p className="text-white">{mockMember.dob}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                <MapPin className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-400">Address</p>
                  <p className="text-white text-sm">{mockMember.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                <Shield className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-400">Plan</p>
                  <p className="text-white">{mockMember.plan}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                <User className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-400">PCP</p>
                  <p className="text-white text-sm">{mockMember.pcp}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Dependents */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Dependents</h2>
              <button className="text-blue-500 hover:text-blue-400 text-sm">+ Add Dependent</button>
            </div>
            <div className="divide-y divide-slate-700">
              {mockMember.dependents.map((dep, i) => (
                <div key={i} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{dep.name}</p>
                      <p className="text-sm text-slate-400">{dep.relationship} • DOB: {dep.dob}</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">{dep.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Claims */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700">
              <h2 className="text-lg font-semibold text-white">Recent Claims</h2>
            </div>
            <table className="w-full">
              <thead className="bg-slate-800 border-b border-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Claim ID</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Provider</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Date</th>
                  <th className="px-4 py-3 text-right text-xs text-slate-400 uppercase">Amount</th>
                  <th className="px-4 py-3 text-center text-xs text-slate-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {mockMember.recentClaims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-slate-800/80">
                    <td className="px-4 py-3 font-mono text-blue-500">{claim.id}</td>
                    <td className="px-4 py-3 text-white">{claim.provider}</td>
                    <td className="px-4 py-3 text-slate-400">{claim.date}</td>
                    <td className="px-4 py-3 text-right text-white">${claim.amount}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">{claim.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Communications */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700">
              <h2 className="text-lg font-semibold text-white">Communication History</h2>
            </div>
            <div className="divide-y divide-slate-700">
              {mockMember.communications.map((comm, i) => (
                <div key={i} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="font-medium text-white">{comm.subject}</p>
                      <p className="text-sm text-slate-400">{comm.type} • {comm.date}</p>
                    </div>
                  </div>
                  <button className="text-blue-500 hover:text-blue-400 text-sm">View</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Benefits Summary */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-5">
            <h3 className="font-semibold text-white mb-4">Benefits Summary</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Deductible</span>
                  <span className="text-white">${mockMember.benefits.deductible.used} / ${mockMember.benefits.deductible.max}</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${(mockMember.benefits.deductible.used / mockMember.benefits.deductible.max) * 100}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Out-of-Pocket</span>
                  <span className="text-white">${mockMember.benefits.outOfPocket.used} / ${mockMember.benefits.outOfPocket.max}</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${(mockMember.benefits.outOfPocket.used / mockMember.benefits.outOfPocket.max) * 100}%` }}></div>
                </div>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-700">
                <span className="text-slate-400">Coinsurance</span>
                <span className="text-white font-medium">{mockMember.benefits.coinsurance}</span>
              </div>
            </div>
          </div>

          {/* Coverage Info */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-5">
            <h3 className="font-semibold text-white mb-3">Coverage</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Employer</span>
                <span className="text-white">{mockMember.employer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Effective Date</span>
                <span className="text-white">{mockMember.effectiveDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Termination</span>
                <span className="text-green-400">{mockMember.terminationDate || "Active"}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-5">
            <h3 className="font-semibold text-white mb-4">Actions</h3>
            <div className="space-y-2">
              <button onClick={() => setShowEditModal(true)} className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600">
                Edit Member
              </button>
              <button className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">
                View ID Card
              </button>
              <button className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">
                Send Communication
              </button>
              <button onClick={() => setShowTerminateModal(true)} className="w-full px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30">
                Terminate Coverage
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowEditModal(false)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50">
              <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                <h3 className="font-semibold text-white">Edit Member</h3>
                <button onClick={() => setShowEditModal(false)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                  <input type="email" defaultValue={mockMember.email} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Phone</label>
                  <input type="tel" defaultValue={mockMember.phone} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Address</label>
                  <input type="text" defaultValue={mockMember.address} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" />
                </div>
              </div>
              <div className="flex gap-2 p-4 border-t border-slate-700">
                <button onClick={() => setShowEditModal(false)} className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Cancel</button>
                <button onClick={() => setShowEditModal(false)} className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600">Save Changes</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Terminate Modal */}
      <AnimatePresence>
        {showTerminateModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowTerminateModal(false)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50">
              <div className="p-4 border-b border-slate-700">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />Terminate Coverage
                </h3>
              </div>
              <div className="p-4 space-y-4">
                <p className="text-slate-300">Are you sure you want to terminate coverage for <strong className="text-white">{mockMember.name}</strong>?</p>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Termination Date</label>
                  <input type="date" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Reason</label>
                  <select className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                    <option>Voluntary Termination</option>
                    <option>Loss of Eligibility</option>
                    <option>Non-Payment</option>
                    <option>Death</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 p-4 border-t border-slate-700">
                <button onClick={() => setShowTerminateModal(false)} className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Cancel</button>
                <button onClick={() => setShowTerminateModal(false)} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Terminate</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
