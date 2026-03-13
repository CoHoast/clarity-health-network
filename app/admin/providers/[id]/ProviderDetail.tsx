"use client";
import { ArrowLeft, Building2, Phone, Mail, MapPin, FileText, Award, Calendar, AlertTriangle, CheckCircle, X, Edit, Shield } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const mockProvider = {
  id: "PRV-001",
  name: "Cleveland Family Medicine",
  npi: "1234567890",
  taxId: "XX-XXXXXXX",
  type: "Group Practice",
  specialty: "Family Medicine",
  status: "active",
  contractStatus: "contracted",
  address: "1234 Health Ave, Suite 100, Cleveland, OH 44101",
  phone: "(216) 555-0100",
  fax: "(216) 555-0101",
  email: "billing@clevelandfm.com",
  website: "www.clevelandfm.com",
  acceptingPatients: true,
  locations: 3,
  providers: 8,
  contract: {
    startDate: "2023-01-01",
    endDate: "2025-12-31",
    feeSchedule: "Standard PPO",
    terms: "110% of Medicare",
  },
  credentialing: {
    status: "current",
    lastVerified: "2024-01-15",
    nextReview: "2025-01-15",
    license: "Valid",
    malpractice: "Active",
    dea: "Active",
  },
  stats: {
    claimsYTD: 423,
    paidYTD: 156230,
    avgTurnaround: "3.2 days",
    denialRate: "2.1%",
  },
  recentClaims: [
    { id: "CLM-001", member: "John Smith", date: "2024-03-10", amount: 485, status: "pending" },
    { id: "CLM-002", member: "Sarah Johnson", date: "2024-03-08", amount: 245, status: "paid" },
    { id: "CLM-003", member: "Michael Chen", date: "2024-03-05", amount: 890, status: "paid" },
  ],
};

export default function ProviderDetail({ id }: { id: string }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTerminateModal, setShowTerminateModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/providers" className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">{mockProvider.name}</h1>
          <p className="text-slate-400">NPI: {mockProvider.npi}</p>
        </div>
        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
          {mockProvider.status}
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Info */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Provider Information</h2>
              <button onClick={() => setShowEditModal(true)} className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1">
                <Edit className="w-4 h-4" />Edit
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                <Building2 className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-400">Type</p>
                  <p className="text-white">{mockProvider.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                <Award className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-400">Specialty</p>
                  <p className="text-white">{mockProvider.specialty}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                <MapPin className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-400">Address</p>
                  <p className="text-white text-sm">{mockProvider.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                <Phone className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-400">Phone</p>
                  <p className="text-white">{mockProvider.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                <Mail className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-400">Email</p>
                  <p className="text-white">{mockProvider.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-xs text-slate-400">Accepting Patients</p>
                  <p className="text-green-400">{mockProvider.acceptingPatients ? "Yes" : "No"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contract Info */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Contract Details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-slate-700/50 rounded-lg p-4">
                <p className="text-sm text-slate-400">Contract Period</p>
                <p className="text-white font-medium">{mockProvider.contract.startDate} - {mockProvider.contract.endDate}</p>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4">
                <p className="text-sm text-slate-400">Fee Schedule</p>
                <p className="text-white font-medium">{mockProvider.contract.feeSchedule}</p>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4 sm:col-span-2">
                <p className="text-sm text-slate-400">Terms</p>
                <p className="text-white font-medium">{mockProvider.contract.terms}</p>
              </div>
            </div>
          </div>

          {/* Credentialing */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-400" />Credentialing Status
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                <p className="text-sm text-slate-400">License</p>
                <span className="inline-flex items-center gap-1 text-green-400 font-medium"><CheckCircle className="w-4 h-4" />{mockProvider.credentialing.license}</span>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                <p className="text-sm text-slate-400">Malpractice</p>
                <span className="inline-flex items-center gap-1 text-green-400 font-medium"><CheckCircle className="w-4 h-4" />{mockProvider.credentialing.malpractice}</span>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                <p className="text-sm text-slate-400">DEA</p>
                <span className="inline-flex items-center gap-1 text-green-400 font-medium"><CheckCircle className="w-4 h-4" />{mockProvider.credentialing.dea}</span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <span className="text-green-400">Last verified: {mockProvider.credentialing.lastVerified}</span>
              <span className="text-slate-400 text-sm">Next review: {mockProvider.credentialing.nextReview}</span>
            </div>
          </div>

          {/* Recent Claims */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700">
              <h2 className="text-lg font-semibold text-white">Recent Claims</h2>
            </div>
            <div className="divide-y divide-slate-700">
              {mockProvider.recentClaims.map((claim) => (
                <div key={claim.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">{claim.member}</p>
                    <p className="text-sm text-slate-400">{claim.id} • {claim.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">${claim.amount.toFixed(2)}</p>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${claim.status === "paid" ? "bg-green-500/20 text-green-400" : "bg-amber-500/20 text-amber-400"}`}>
                      {claim.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Stats */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-5">
            <h3 className="font-semibold text-white mb-4">Performance YTD</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Claims</span>
                <span className="text-white font-medium">{mockProvider.stats.claimsYTD}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Paid</span>
                <span className="text-green-400 font-medium">${mockProvider.stats.paidYTD.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Avg Turnaround</span>
                <span className="text-white font-medium">{mockProvider.stats.avgTurnaround}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Denial Rate</span>
                <span className="text-white font-medium">{mockProvider.stats.denialRate}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 text-center">
              <p className="text-2xl font-bold text-white">{mockProvider.locations}</p>
              <p className="text-sm text-slate-400">Locations</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 text-center">
              <p className="text-2xl font-bold text-white">{mockProvider.providers}</p>
              <p className="text-sm text-slate-400">Providers</p>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-5">
            <h3 className="font-semibold text-white mb-4">Actions</h3>
            <div className="space-y-2">
              <button onClick={() => setShowEditModal(true)} className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Edit Provider
              </button>
              <button className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">
                View Contract
              </button>
              <button className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">
                Re-credential
              </button>
              <button onClick={() => setShowTerminateModal(true)} className="w-full px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30">
                Terminate Contract
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
                <h3 className="font-semibold text-white">Edit Provider</h3>
                <button onClick={() => setShowEditModal(false)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Phone</label>
                  <input type="tel" defaultValue={mockProvider.phone} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                  <input type="email" defaultValue={mockProvider.email} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" />
                </div>
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked={mockProvider.acceptingPatients} className="w-4 h-4 rounded" />
                    <span className="text-slate-300">Accepting New Patients</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-2 p-4 border-t border-slate-700">
                <button onClick={() => setShowEditModal(false)} className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Cancel</button>
                <button onClick={() => setShowEditModal(false)} className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Save Changes</button>
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
                  <AlertTriangle className="w-5 h-5 text-red-400" />Terminate Contract
                </h3>
              </div>
              <div className="p-4 space-y-4">
                <p className="text-slate-300">Are you sure you want to terminate the contract with <strong className="text-white">{mockProvider.name}</strong>?</p>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Termination Date</label>
                  <input type="date" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Reason</label>
                  <select className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                    <option>Contract Expiration</option>
                    <option>Mutual Agreement</option>
                    <option>Performance Issues</option>
                    <option>Compliance Violation</option>
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
