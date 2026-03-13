"use client";

import { ArrowLeft, FileText, User, Building2, Calendar, DollarSign, Clock, CheckCircle, AlertTriangle, X, Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const mockClaim = {
  id: "CLM-2024-0156",
  status: "pending_review",
  submittedDate: "2024-03-10",
  dateOfService: "2024-03-08",
  member: { id: "MEM-12847", name: "John Smith", dob: "1985-06-15", memberId: "CHN-12847-001" },
  provider: { name: "Cleveland Family Medicine", npi: "1234567890", address: "1234 Health Ave, Cleveland, OH 44101", phone: "(216) 555-0100" },
  billing: { billedAmount: 485.00, allowedAmount: 325.00, memberResponsibility: 65.00, planPays: 260.00 },
  serviceLines: [
    { cpt: "99213", description: "Office visit, established patient", qty: 1, billed: 150, allowed: 95, status: "approved" },
    { cpt: "36415", description: "Venipuncture", qty: 1, billed: 35, allowed: 25, status: "approved" },
    { cpt: "80053", description: "Comprehensive metabolic panel", qty: 1, billed: 150, allowed: 110, status: "approved" },
    { cpt: "85025", description: "Complete blood count (CBC)", qty: 1, billed: 75, allowed: 55, status: "approved" },
    { cpt: "81001", description: "Urinalysis", qty: 1, billed: 75, allowed: 40, status: "pending" },
  ],
  diagnosis: ["E11.9 - Type 2 diabetes mellitus", "I10 - Essential hypertension"],
  history: [
    { date: "2024-03-10 14:32", action: "Claim Submitted", user: "provider@cleveland.com" },
    { date: "2024-03-10 14:35", action: "Auto-adjudication Started", user: "system" },
    { date: "2024-03-10 14:36", action: "Routed to Review Queue", user: "system" },
  ],
};

export default function ClaimDetail({ id }: { id: string }) {
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showDenyModal, setShowDenyModal] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const handleAction = (action: string) => {
    setShowApproveModal(false);
    setShowDenyModal(false);
    setActionSuccess(action);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/claims" className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"><ArrowLeft className="w-5 h-5" /></Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">Claim {id}</h1>
          <p className="text-slate-400">Submitted {mockClaim.submittedDate}</p>
        </div>
        <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium">Pending Review</span>
      </div>

      <AnimatePresence>
        {actionSuccess && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400" /><span className="text-green-400">Claim {actionSuccess} successfully</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-5">
              <h3 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2"><User className="w-4 h-4" />Member</h3>
              <p className="font-semibold text-white text-lg">{mockClaim.member.name}</p>
              <p className="text-slate-400 text-sm">DOB: {mockClaim.member.dob}</p>
              <p className="text-purple-400 text-sm font-mono mt-1">{mockClaim.member.memberId}</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-5">
              <h3 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2"><Building2 className="w-4 h-4" />Provider</h3>
              <p className="font-semibold text-white text-lg">{mockClaim.provider.name}</p>
              <p className="text-slate-400 text-sm">NPI: {mockClaim.provider.npi}</p>
              <p className="text-slate-500 text-sm mt-1">{mockClaim.provider.phone}</p>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-5">
            <h3 className="text-sm font-medium text-slate-400 mb-3">Diagnosis Codes</h3>
            <div className="flex flex-wrap gap-2">{mockClaim.diagnosis.map((dx, i) => (<span key={i} className="px-3 py-1 bg-slate-700 text-white text-sm rounded-full">{dx}</span>))}</div>
          </div>

          <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700"><h3 className="font-semibold text-white">Service Lines</h3></div>
            <table className="w-full">
              <thead className="bg-slate-800 border-b border-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">CPT</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Description</th>
                  <th className="px-4 py-3 text-right text-xs text-slate-400 uppercase">Billed</th>
                  <th className="px-4 py-3 text-right text-xs text-slate-400 uppercase">Allowed</th>
                  <th className="px-4 py-3 text-center text-xs text-slate-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {mockClaim.serviceLines.map((line, i) => (
                  <tr key={i} className="hover:bg-slate-800/80">
                    <td className="px-4 py-3 font-mono text-purple-400">{line.cpt}</td>
                    <td className="px-4 py-3 text-white">{line.description}</td>
                    <td className="px-4 py-3 text-right text-slate-300">${line.billed.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-white font-medium">${line.allowed.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center"><span className={`px-2 py-1 text-xs rounded-full ${line.status === "approved" ? "bg-green-500/20 text-green-400" : "bg-amber-500/20 text-amber-400"}`}>{line.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-5">
            <h3 className="font-semibold text-white mb-4">Claim History</h3>
            <div className="space-y-3">{mockClaim.history.map((event, i) => (<div key={i} className="flex items-start gap-3"><div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div><div><p className="text-white">{event.action}</p><p className="text-sm text-slate-500">{event.date} • {event.user}</p></div></div>))}</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-5">
            <h3 className="font-semibold text-white mb-4">Billing Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-slate-400">Billed Amount</span><span className="text-white">${mockClaim.billing.billedAmount.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Allowed Amount</span><span className="text-white">${mockClaim.billing.allowedAmount.toFixed(2)}</span></div>
              <div className="border-t border-slate-700 pt-3"></div>
              <div className="flex justify-between"><span className="text-slate-400">Member Pays</span><span className="text-amber-400">${mockClaim.billing.memberResponsibility.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Plan Pays</span><span className="text-green-400 font-bold">${mockClaim.billing.planPays.toFixed(2)}</span></div>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-5">
            <h3 className="font-semibold text-white mb-4">Actions</h3>
            <div className="space-y-2">
              <button onClick={() => setShowApproveModal(true)} className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4" />Approve Claim</button>
              <button onClick={() => setShowDenyModal(true)} className="w-full px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 flex items-center justify-center gap-2"><X className="w-4 h-4" />Deny Claim</button>
              <button className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Request More Info</button>
              <button className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">View EOB Preview</button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showApproveModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowApproveModal(false)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50">
              <div className="p-4 border-b border-slate-700"><h3 className="font-semibold text-white flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-400" />Approve Claim</h3></div>
              <div className="p-4 space-y-4">
                <p className="text-slate-300">Approve claim <strong className="text-white">{mockClaim.id}</strong> for payment?</p>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3"><p className="text-green-400 font-medium">Plan will pay: ${mockClaim.billing.planPays.toFixed(2)}</p></div>
                <div><label className="block text-sm font-medium text-slate-300 mb-1">Notes (optional)</label><textarea className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white h-20" placeholder="Add any notes..."></textarea></div>
              </div>
              <div className="flex gap-2 p-4 border-t border-slate-700"><button onClick={() => setShowApproveModal(false)} className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Cancel</button><button onClick={() => handleAction("approved")} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Approve</button></div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDenyModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDenyModal(false)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50">
              <div className="p-4 border-b border-slate-700"><h3 className="font-semibold text-white flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-red-400" />Deny Claim</h3></div>
              <div className="p-4 space-y-4">
                <p className="text-slate-300">Deny claim <strong className="text-white">{mockClaim.id}</strong>?</p>
                <div><label className="block text-sm font-medium text-slate-300 mb-1">Denial Reason</label><select className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"><option>Not medically necessary</option><option>Pre-authorization required</option><option>Service not covered</option><option>Duplicate claim</option><option>Other</option></select></div>
                <div><label className="block text-sm font-medium text-slate-300 mb-1">Notes</label><textarea className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white h-20" placeholder="Explain denial reason..."></textarea></div>
              </div>
              <div className="flex gap-2 p-4 border-t border-slate-700"><button onClick={() => setShowDenyModal(false)} className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Cancel</button><button onClick={() => handleAction("denied")} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Deny Claim</button></div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
