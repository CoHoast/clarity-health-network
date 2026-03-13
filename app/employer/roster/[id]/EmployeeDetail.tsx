"use client";

import { ArrowLeft, User, Mail, Phone, Calendar, Shield, Clock, Edit, X, CheckCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const mockEmployee = {
  id: "EMP-001",
  name: "John Smith",
  email: "john.smith@acmecorp.com",
  phone: "(216) 555-0123",
  dob: "1985-06-15",
  ssn: "***-**-4567",
  hireDate: "2020-03-15",
  status: "active",
  plan: "Family PPO",
  department: "Engineering",
  dependents: [
    { name: "Sarah Smith", relationship: "Spouse", dob: "1987-09-22", status: "active" },
    { name: "Emma Smith", relationship: "Child", dob: "2015-03-10", status: "active" },
    { name: "Jack Smith", relationship: "Child", dob: "2018-07-04", status: "active" },
  ],
  recentClaims: [
    { id: "CLM-001", date: "2024-03-05", provider: "Cleveland Family Medicine", amount: 245, status: "paid" },
    { id: "CLM-002", date: "2024-02-18", provider: "Metro Pharmacy", amount: 65, status: "paid" },
    { id: "CLM-003", date: "2024-02-01", provider: "Westlake Urgent Care", amount: 180, status: "paid" },
  ],
};

export default function EmployeeDetail({ id }: { id: string }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTerminateModal, setShowTerminateModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/employer/roster" className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">{mockEmployee.name}</h1>
          <p className="text-slate-400">Employee ID: {id}</p>
        </div>
        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">{mockEmployee.status}</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Employee Information</h2>
              <button onClick={() => setShowEditModal(true)} className="text-orange-400 hover:text-orange-300 text-sm flex items-center gap-1"><Edit className="w-4 h-4" />Edit</button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg"><Mail className="w-5 h-5 text-slate-400" /><div><p className="text-xs text-slate-400">Email</p><p className="text-white">{mockEmployee.email}</p></div></div>
              <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg"><Phone className="w-5 h-5 text-slate-400" /><div><p className="text-xs text-slate-400">Phone</p><p className="text-white">{mockEmployee.phone}</p></div></div>
              <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg"><Calendar className="w-5 h-5 text-slate-400" /><div><p className="text-xs text-slate-400">Date of Birth</p><p className="text-white">{mockEmployee.dob}</p></div></div>
              <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg"><Clock className="w-5 h-5 text-slate-400" /><div><p className="text-xs text-slate-400">Hire Date</p><p className="text-white">{mockEmployee.hireDate}</p></div></div>
              <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg"><Shield className="w-5 h-5 text-slate-400" /><div><p className="text-xs text-slate-400">Plan</p><p className="text-white">{mockEmployee.plan}</p></div></div>
              <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg"><User className="w-5 h-5 text-slate-400" /><div><p className="text-xs text-slate-400">Department</p><p className="text-white">{mockEmployee.department}</p></div></div>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Dependents</h2>
              <button className="text-orange-400 hover:text-orange-300 text-sm">+ Add Dependent</button>
            </div>
            <div className="divide-y divide-slate-700">
              {mockEmployee.dependents.map((dep, i) => (
                <div key={i} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center"><User className="w-5 h-5 text-orange-400" /></div>
                    <div><p className="font-medium text-white">{dep.name}</p><p className="text-sm text-slate-400">{dep.relationship} • DOB: {dep.dob}</p></div>
                  </div>
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">{dep.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700"><h2 className="text-lg font-semibold text-white">Recent Claims</h2></div>
            <div className="divide-y divide-slate-700">
              {mockEmployee.recentClaims.map((claim) => (
                <div key={claim.id} className="px-6 py-4 flex items-center justify-between">
                  <div><p className="font-medium text-white">{claim.provider}</p><p className="text-sm text-slate-400">{claim.date}</p></div>
                  <div className="text-right"><p className="font-bold text-white">${claim.amount}</p><span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">{claim.status}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
            <h3 className="font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button onClick={() => setShowEditModal(true)} className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">Edit Employee</button>
              <button className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">View ID Card</button>
              <button className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Download Summary</button>
              <button onClick={() => setShowTerminateModal(true)} className="w-full px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30">Terminate Coverage</button>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
            <h3 className="font-semibold text-white mb-3">Coverage Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-slate-400">Deductible</span><span className="text-white">$150 / $500</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Out-of-Pocket</span><span className="text-white">$890 / $3,000</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Premium</span><span className="text-white">$1,450/mo</span></div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showEditModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowEditModal(false)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50">
              <div className="p-4 border-b border-slate-700 flex items-center justify-between"><h3 className="font-semibold text-white">Edit Employee</h3><button onClick={() => setShowEditModal(false)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"><X className="w-5 h-5" /></button></div>
              <div className="p-4 space-y-4">
                <div><label className="block text-sm font-medium text-slate-300 mb-1">Email</label><input type="email" defaultValue={mockEmployee.email} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" /></div>
                <div><label className="block text-sm font-medium text-slate-300 mb-1">Phone</label><input type="tel" defaultValue={mockEmployee.phone} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" /></div>
                <div><label className="block text-sm font-medium text-slate-300 mb-1">Department</label><input type="text" defaultValue={mockEmployee.department} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" /></div>
              </div>
              <div className="flex gap-2 p-4 border-t border-slate-700"><button onClick={() => setShowEditModal(false)} className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Cancel</button><button onClick={() => setShowEditModal(false)} className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">Save Changes</button></div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTerminateModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowTerminateModal(false)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50">
              <div className="p-4 border-b border-slate-700"><h3 className="font-semibold text-white flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-red-400" />Terminate Coverage</h3></div>
              <div className="p-4 space-y-4">
                <p className="text-slate-300">Are you sure you want to terminate coverage for <strong className="text-white">{mockEmployee.name}</strong> and their dependents?</p>
                <div><label className="block text-sm font-medium text-slate-300 mb-1">Termination Date</label><input type="date" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" /></div>
                <div><label className="block text-sm font-medium text-slate-300 mb-1">Reason</label><select className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"><option>Voluntary Resignation</option><option>Involuntary Termination</option><option>Retirement</option><option>Other</option></select></div>
              </div>
              <div className="flex gap-2 p-4 border-t border-slate-700"><button onClick={() => setShowTerminateModal(false)} className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Cancel</button><button onClick={() => setShowTerminateModal(false)} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Confirm Termination</button></div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
