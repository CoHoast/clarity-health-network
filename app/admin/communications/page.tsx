"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Bell, FileText, Send, Clock, CheckCircle, X, Plus, Eye, Users, Calendar } from "lucide-react";

const templates = [
  { id: "TPL-001", name: "EOB Statement", type: "EOB", lastUsed: "2024-03-12", sends: 1245 },
  { id: "TPL-002", name: "Welcome Letter", type: "Letter", lastUsed: "2024-03-11", sends: 89 },
  { id: "TPL-003", name: "ID Card Mailed", type: "Notification", lastUsed: "2024-03-10", sends: 156 },
  { id: "TPL-004", name: "Premium Reminder", type: "Email", lastUsed: "2024-03-09", sends: 423 },
  { id: "TPL-005", name: "Claim Denied", type: "EOB", lastUsed: "2024-03-08", sends: 67 },
];

const recentComms = [
  { id: "COM-001", member: "John Smith", type: "EOB", method: "Email", sent: "2024-03-12 14:32", status: "delivered" },
  { id: "COM-002", member: "Sarah Johnson", type: "Welcome", method: "Mail", sent: "2024-03-12 10:15", status: "sent" },
  { id: "COM-003", member: "Michael Chen", type: "ID Card", method: "Email", sent: "2024-03-11 16:45", status: "delivered" },
  { id: "COM-004", member: "Emily Rodriguez", type: "Premium", method: "SMS", sent: "2024-03-11 09:00", status: "delivered" },
];

export default function CommunicationsPage() {
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<typeof templates[0] | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Member Communications</h1>
            <p className="text-slate-400">EOB generation, notifications, and templates</p>
          </div>
        </div>
        <button onClick={() => setShowNewModal(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
          <Send className="w-4 h-4" />Send Communication
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-white">2,456</p>
          <p className="text-sm text-slate-400">Sent Today</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-green-400">98.2%</p>
          <p className="text-sm text-slate-400">Delivery Rate</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-blue-400">1,245</p>
          <p className="text-sm text-slate-400">EOBs Generated</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-purple-400">12</p>
          <p className="text-sm text-slate-400">Active Templates</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Templates */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Communication Templates</h2>
            <button className="text-purple-400 text-sm hover:text-purple-300">+ New Template</button>
          </div>
          <div className="divide-y divide-slate-700">
            {templates.map((template) => (
              <button key={template.id} onClick={() => setSelectedTemplate(template)} className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800/80 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{template.name}</p>
                    <p className="text-sm text-slate-400">{template.type} • {template.sends} sends</p>
                  </div>
                </div>
                <Eye className="w-4 h-4 text-slate-400" />
              </button>
            ))}
          </div>
        </div>

        {/* Recent Communications */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700">
            <h2 className="text-lg font-semibold text-white">Recent Communications</h2>
          </div>
          <div className="divide-y divide-slate-700">
            {recentComms.map((comm) => (
              <div key={comm.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">{comm.member}</p>
                  <p className="text-sm text-slate-400">{comm.type} via {comm.method}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 text-xs rounded-full ${comm.status === "delivered" ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"}`}>
                    {comm.status}
                  </span>
                  <p className="text-xs text-slate-500 mt-1">{comm.sent}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Send Communication Modal */}
      <AnimatePresence>
        {showNewModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowNewModal(false)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50">
              <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                <h3 className="font-semibold text-white">Send Communication</h3>
                <button onClick={() => setShowNewModal(false)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Template</label>
                  <select className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                    {templates.map(t => <option key={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Recipients</label>
                  <select className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                    <option>Select member(s)...</option>
                    <option>All Members</option>
                    <option>Members with Claims</option>
                    <option>New Members (30 days)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Delivery Method</label>
                  <div className="flex gap-2">
                    <label className="flex-1 flex items-center justify-center gap-2 p-3 bg-slate-700 rounded-lg cursor-pointer border-2 border-purple-500">
                      <input type="radio" name="method" defaultChecked className="hidden" />
                      <Mail className="w-4 h-4 text-purple-400" /><span className="text-white">Email</span>
                    </label>
                    <label className="flex-1 flex items-center justify-center gap-2 p-3 bg-slate-700 rounded-lg cursor-pointer border border-slate-600">
                      <input type="radio" name="method" className="hidden" />
                      <FileText className="w-4 h-4 text-slate-400" /><span className="text-slate-300">Mail</span>
                    </label>
                    <label className="flex-1 flex items-center justify-center gap-2 p-3 bg-slate-700 rounded-lg cursor-pointer border border-slate-600">
                      <input type="radio" name="method" className="hidden" />
                      <Bell className="w-4 h-4 text-slate-400" /><span className="text-slate-300">SMS</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 p-4 border-t border-slate-700">
                <button onClick={() => setShowNewModal(false)} className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Cancel</button>
                <button onClick={() => setShowNewModal(false)} className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Send</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Template Preview Modal */}
      <AnimatePresence>
        {selectedTemplate && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedTemplate(null)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50">
              <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                <h3 className="font-semibold text-white">{selectedTemplate.name}</h3>
                <button onClick={() => setSelectedTemplate(null)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-4">
                <div className="bg-white rounded-lg p-6 text-gray-900">
                  <div className="text-center mb-4">
                    <h4 className="text-xl font-bold">Clarity Health Network</h4>
                    <p className="text-sm text-gray-500">Explanation of Benefits</p>
                  </div>
                  <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
                    <p><strong>Member:</strong> {"{{member_name}}"}</p>
                    <p><strong>Claim #:</strong> {"{{claim_id}}"}</p>
                    <p><strong>Date of Service:</strong> {"{{dos}}"}</p>
                    <p><strong>Provider:</strong> {"{{provider_name}}"}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-400 text-center">This is a preview. Actual content will be populated with member data.</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 p-4 border-t border-slate-700">
                <button onClick={() => setSelectedTemplate(null)} className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Close</button>
                <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Edit Template</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
