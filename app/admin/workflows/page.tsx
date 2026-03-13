"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Workflow, Clock, CheckCircle, AlertTriangle, Play, Pause, Settings, X, Plus, ArrowRight, Zap } from "lucide-react";

const workflows = [
  { id: "WF-001", name: "Claims Auto-Adjudication", status: "active", tasks: 156, completed: 142, sla: "2 hours", performance: 98 },
  { id: "WF-002", name: "Provider Credentialing", status: "active", tasks: 23, completed: 18, sla: "5 days", performance: 94 },
  { id: "WF-003", name: "Member Enrollment", status: "active", tasks: 45, completed: 41, sla: "24 hours", performance: 99 },
  { id: "WF-004", name: "Appeal Review", status: "paused", tasks: 12, completed: 8, sla: "30 days", performance: 87 },
  { id: "WF-005", name: "EOB Generation", status: "active", tasks: 234, completed: 234, sla: "1 hour", performance: 100 },
];

const taskQueue = [
  { id: "TASK-001", workflow: "Claims Auto-Adjudication", item: "CLM-2024-156", status: "processing", started: "2 min ago" },
  { id: "TASK-002", workflow: "Provider Credentialing", item: "PRV-005", status: "waiting", started: "15 min ago" },
  { id: "TASK-003", workflow: "Member Enrollment", item: "MEM-892", status: "processing", started: "5 min ago" },
  { id: "TASK-004", workflow: "Claims Auto-Adjudication", item: "CLM-2024-157", status: "waiting", started: "1 min ago" },
];

const businessRules = [
  { id: "BR-001", name: "Auto-approve claims < $500", workflow: "Claims", active: true },
  { id: "BR-002", name: "Flag high-dollar claims", workflow: "Claims", active: true },
  { id: "BR-003", name: "Route specialty to review", workflow: "Claims", active: true },
  { id: "BR-004", name: "Welcome email on enrollment", workflow: "Enrollment", active: true },
  { id: "BR-005", name: "Credential expiry alert (30 days)", workflow: "Credentialing", active: false },
];

export default function WorkflowsPage() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<typeof workflows[0] | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Workflow className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Workflow Engine</h1>
            <p className="text-slate-400">Task queues, business rules, and SLAs</p>
          </div>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
          <Plus className="w-4 h-4" />New Workflow
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-white">470</p>
          <p className="text-sm text-slate-400">Active Tasks</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-green-400">443</p>
          <p className="text-sm text-slate-400">Completed Today</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-blue-400">96.8%</p>
          <p className="text-sm text-slate-400">SLA Compliance</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-purple-400">5</p>
          <p className="text-sm text-slate-400">Active Workflows</p>
        </div>
      </div>

      {/* Workflows */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-white">Workflows</h2>
        </div>
        <table className="w-full">
          <thead className="bg-slate-800 border-b border-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs text-slate-400 uppercase">Workflow</th>
              <th className="px-6 py-3 text-left text-xs text-slate-400 uppercase">Status</th>
              <th className="px-6 py-3 text-center text-xs text-slate-400 uppercase">Tasks</th>
              <th className="px-6 py-3 text-left text-xs text-slate-400 uppercase">SLA</th>
              <th className="px-6 py-3 text-left text-xs text-slate-400 uppercase">Performance</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {workflows.map((wf) => (
              <tr key={wf.id} className="hover:bg-slate-800/80">
                <td className="px-6 py-4">
                  <p className="font-medium text-white">{wf.name}</p>
                  <p className="text-xs text-slate-500">{wf.id}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${wf.status === "active" ? "bg-green-500/20 text-green-400" : "bg-amber-500/20 text-amber-400"}`}>
                    {wf.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-white">{wf.completed}</span>
                  <span className="text-slate-500">/{wf.tasks}</span>
                </td>
                <td className="px-6 py-4 text-slate-300">{wf.sla}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${wf.performance >= 95 ? "bg-green-500" : wf.performance >= 90 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${wf.performance}%` }} />
                    </div>
                    <span className="text-sm text-slate-400">{wf.performance}%</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setSelectedWorkflow(wf)} className="p-1.5 text-slate-400 hover:text-purple-400 hover:bg-purple-500/20 rounded">
                      <Settings className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-green-400 hover:bg-green-500/20 rounded">
                      {wf.status === "active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Task Queue */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Task Queue</h2>
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>Live
            </div>
          </div>
          <div className="divide-y divide-slate-700">
            {taskQueue.map((task) => (
              <div key={task.id} className="px-6 py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">{task.item}</p>
                  <p className="text-sm text-slate-400">{task.workflow}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 text-xs rounded-full ${task.status === "processing" ? "bg-blue-500/20 text-blue-400" : "bg-slate-500/20 text-slate-400"}`}>
                    {task.status}
                  </span>
                  <p className="text-xs text-slate-500 mt-1">{task.started}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Business Rules */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Business Rules</h2>
            <button className="text-purple-400 text-sm hover:text-purple-300">+ Add Rule</button>
          </div>
          <div className="divide-y divide-slate-700">
            {businessRules.map((rule) => (
              <div key={rule.id} className="px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap className={`w-4 h-4 ${rule.active ? "text-amber-400" : "text-slate-500"}`} />
                  <div>
                    <p className="font-medium text-white">{rule.name}</p>
                    <p className="text-xs text-slate-500">{rule.workflow}</p>
                  </div>
                </div>
                <button className={`relative w-10 h-5 rounded-full transition-colors ${rule.active ? "bg-green-500" : "bg-slate-600"}`}>
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${rule.active ? "left-5" : "left-0.5"}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Workflow Config Modal */}
      <AnimatePresence>
        {selectedWorkflow && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedWorkflow(null)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50">
              <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                <h3 className="font-semibold text-white">{selectedWorkflow.name}</h3>
                <button onClick={() => setSelectedWorkflow(null)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">SLA Target</label>
                  <input type="text" defaultValue={selectedWorkflow.sla} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Priority</label>
                  <select className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                    <option>High</option>
                    <option>Normal</option>
                    <option>Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Escalation Email</label>
                  <input type="email" placeholder="admin@clarity.com" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" />
                </div>
              </div>
              <div className="flex gap-2 p-4 border-t border-slate-700">
                <button onClick={() => setSelectedWorkflow(null)} className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Cancel</button>
                <button onClick={() => setSelectedWorkflow(null)} className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Save</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
