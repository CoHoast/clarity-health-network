"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Workflow, Clock, CheckCircle, AlertTriangle, Play, Pause, Settings, X, Plus, ArrowRight, Zap, Trash2, Edit, Copy, Eye, Filter, ChevronDown, ChevronRight as ChevronRightIcon } from "lucide-react";

interface BusinessRule {
  id: string;
  name: string;
  description: string;
  workflow: string;
  condition: string;
  action: string;
  priority: number;
  active: boolean;
  createdBy: string;
  createdAt: string;
}

const workflows = [
  { id: "WF-001", name: "Claims Auto-Adjudication", status: "active", tasks: 156, completed: 142, sla: "2 hours", performance: 98, description: "Automatically processes and adjudicates clean claims based on fee schedules and business rules" },
  { id: "WF-002", name: "Provider Credentialing", status: "active", tasks: 23, completed: 18, sla: "5 days", performance: 94, description: "Manages provider application review, verification, and approval process" },
  { id: "WF-003", name: "Member Enrollment", status: "active", tasks: 45, completed: 41, sla: "24 hours", performance: 99, description: "Processes new member enrollments and eligibility verification" },
  { id: "WF-004", name: "Appeal Review", status: "paused", tasks: 12, completed: 8, sla: "30 days", performance: 87, description: "Routes and manages claim appeals through review stages" },
  { id: "WF-005", name: "EOB Generation", status: "active", tasks: 234, completed: 234, sla: "1 hour", performance: 100, description: "Generates and distributes Explanation of Benefits documents" },
  { id: "WF-006", name: "Prior Authorization", status: "active", tasks: 34, completed: 28, sla: "72 hours", performance: 92, description: "Manages prior authorization requests and approvals" },
];

const taskQueue = [
  { id: "TASK-001", workflow: "Claims Auto-Adjudication", item: "CLM-2024-156", status: "processing", started: "2 min ago", assignee: "System" },
  { id: "TASK-002", workflow: "Provider Credentialing", item: "PRV-005", status: "waiting", started: "15 min ago", assignee: "Emily Chen" },
  { id: "TASK-003", workflow: "Member Enrollment", item: "MEM-892", status: "processing", started: "5 min ago", assignee: "System" },
  { id: "TASK-004", workflow: "Claims Auto-Adjudication", item: "CLM-2024-157", status: "waiting", started: "1 min ago", assignee: "System" },
  { id: "TASK-005", workflow: "Prior Authorization", item: "PA-2024-089", status: "review", started: "45 min ago", assignee: "James Wilson" },
  { id: "TASK-006", workflow: "Appeal Review", item: "APL-2024-023", status: "waiting", started: "2 hours ago", assignee: "David Kim" },
];

const initialBusinessRules: BusinessRule[] = [
  { id: "BR-001", name: "Auto-approve claims under $500", description: "Automatically approve clean claims with total amount under $500", workflow: "Claims Auto-Adjudication", condition: "claim.amount < 500 AND claim.status = 'clean'", action: "APPROVE", priority: 1, active: true, createdBy: "System", createdAt: "2024-01-15" },
  { id: "BR-002", name: "Flag high-dollar claims for review", description: "Route claims over $5,000 to manual review queue", workflow: "Claims Auto-Adjudication", condition: "claim.amount >= 5000", action: "ROUTE_TO_REVIEW", priority: 2, active: true, createdBy: "Admin", createdAt: "2024-01-20" },
  { id: "BR-003", name: "Route specialty drugs to pharmacy review", description: "Send specialty pharmacy claims to specialized review team", workflow: "Claims Auto-Adjudication", condition: "claim.category = 'specialty_rx'", action: "ROUTE_TO_PHARMACY", priority: 3, active: true, createdBy: "Admin", createdAt: "2024-02-01" },
  { id: "BR-004", name: "Welcome email on enrollment", description: "Send welcome email when member enrollment is approved", workflow: "Member Enrollment", condition: "enrollment.status = 'approved'", action: "SEND_WELCOME_EMAIL", priority: 1, active: true, createdBy: "System", createdAt: "2024-01-10" },
  { id: "BR-005", name: "Credential expiry alert (30 days)", description: "Send alert when provider credentials expire within 30 days", workflow: "Provider Credentialing", condition: "credential.expiry_date <= NOW() + 30 days", action: "SEND_ALERT", priority: 1, active: false, createdBy: "Emily Chen", createdAt: "2024-02-15" },
  { id: "BR-006", name: "Auto-deny out-of-network", description: "Automatically deny claims from non-contracted providers", workflow: "Claims Auto-Adjudication", condition: "provider.network_status = 'out_of_network'", action: "DENY", priority: 4, active: true, createdBy: "Admin", createdAt: "2024-01-25" },
  { id: "BR-007", name: "Escalate appeals over 15 days", description: "Escalate appeals that have been pending over 15 days", workflow: "Appeal Review", condition: "appeal.days_pending > 15", action: "ESCALATE", priority: 1, active: true, createdBy: "David Kim", createdAt: "2024-03-01" },
  { id: "BR-008", name: "Prior auth auto-approve preventive", description: "Auto-approve prior auth for preventive services", workflow: "Prior Authorization", condition: "service.category = 'preventive'", action: "APPROVE", priority: 1, active: true, createdBy: "System", createdAt: "2024-02-20" },
];

const workflowOptions = ["Claims Auto-Adjudication", "Provider Credentialing", "Member Enrollment", "Appeal Review", "EOB Generation", "Prior Authorization"];
const actionOptions = ["APPROVE", "DENY", "ROUTE_TO_REVIEW", "ROUTE_TO_PHARMACY", "SEND_EMAIL", "SEND_ALERT", "ESCALATE", "HOLD"];

export default function WorkflowsPage() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<typeof workflows[0] | null>(null);
  const [businessRules, setBusinessRules] = useState<BusinessRule[]>(initialBusinessRules);
  const [showAddRuleModal, setShowAddRuleModal] = useState(false);
  const [showEditRuleModal, setShowEditRuleModal] = useState(false);
  const [selectedRule, setSelectedRule] = useState<BusinessRule | null>(null);
  const [showRuleDetail, setShowRuleDetail] = useState(false);
  const [filterWorkflow, setFilterWorkflow] = useState("all");
  const [expandedWorkflow, setExpandedWorkflow] = useState<string | null>(null);
  
  // New rule form state
  const [newRule, setNewRule] = useState({
    name: "",
    description: "",
    workflow: "Claims Auto-Adjudication",
    condition: "",
    action: "APPROVE",
    priority: 1
  });

  const filteredRules = filterWorkflow === "all" 
    ? businessRules 
    : businessRules.filter(r => r.workflow === filterWorkflow);

  const toggleRule = (ruleId: string) => {
    setBusinessRules(rules => rules.map(r => 
      r.id === ruleId ? { ...r, active: !r.active } : r
    ));
  };

  const handleAddRule = () => {
    const rule: BusinessRule = {
      id: `BR-${String(businessRules.length + 1).padStart(3, '0')}`,
      ...newRule,
      active: true,
      createdBy: "Admin",
      createdAt: new Date().toISOString().split('T')[0]
    };
    setBusinessRules([...businessRules, rule]);
    setShowAddRuleModal(false);
    setNewRule({ name: "", description: "", workflow: "Claims Auto-Adjudication", condition: "", action: "APPROVE", priority: 1 });
  };

  const handleEditRule = () => {
    if (!selectedRule) return;
    setBusinessRules(rules => rules.map(r => r.id === selectedRule.id ? selectedRule : r));
    setShowEditRuleModal(false);
    setSelectedRule(null);
  };

  const handleDeleteRule = (ruleId: string) => {
    setBusinessRules(rules => rules.filter(r => r.id !== ruleId));
  };

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
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-white">504</p>
          <p className="text-sm text-slate-400">Active Tasks</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-green-400">471</p>
          <p className="text-sm text-slate-400">Completed Today</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-blue-400">96.8%</p>
          <p className="text-sm text-slate-400">SLA Compliance</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-purple-400">6</p>
          <p className="text-sm text-slate-400">Active Workflows</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-amber-400">{businessRules.filter(r => r.active).length}</p>
          <p className="text-sm text-slate-400">Active Rules</p>
        </div>
      </div>

      {/* Workflows */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-white">Workflows</h2>
        </div>
        <div className="divide-y divide-slate-700">
          {workflows.map((wf) => (
            <div key={wf.id}>
              <div 
                className="px-6 py-4 flex items-center justify-between hover:bg-slate-800/80 cursor-pointer"
                onClick={() => setExpandedWorkflow(expandedWorkflow === wf.id ? null : wf.id)}
              >
                <div className="flex items-center gap-4">
                  {expandedWorkflow === wf.id ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRightIcon className="w-5 h-5 text-slate-400" />}
                  <div>
                    <p className="font-medium text-white">{wf.name}</p>
                    <p className="text-xs text-slate-500">{wf.id} • SLA: {wf.sla}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <span className="text-white">{wf.completed}</span>
                    <span className="text-slate-500">/{wf.tasks}</span>
                    <p className="text-xs text-slate-500">Tasks</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${wf.performance >= 95 ? "bg-green-500" : wf.performance >= 90 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${wf.performance}%` }} />
                    </div>
                    <span className="text-sm text-slate-400 w-10">{wf.performance}%</span>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${wf.status === "active" ? "bg-green-500/20 text-green-400" : "bg-amber-500/20 text-amber-400"}`}>
                    {wf.status}
                  </span>
                  <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                    <button onClick={() => setSelectedWorkflow(wf)} className="p-1.5 text-slate-400 hover:text-purple-400 hover:bg-purple-500/20 rounded">
                      <Settings className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-green-400 hover:bg-green-500/20 rounded">
                      {wf.status === "active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
              {expandedWorkflow === wf.id && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6 pb-4 bg-slate-900/50"
                >
                  <p className="text-slate-400 text-sm mb-3">{wf.description}</p>
                  <div className="text-sm">
                    <span className="text-slate-500">Associated Rules: </span>
                    <span className="text-purple-400">{businessRules.filter(r => r.workflow === wf.name).length} rules</span>
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
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
          <div className="divide-y divide-slate-700 max-h-80 overflow-y-auto">
            {taskQueue.map((task) => (
              <div key={task.id} className="px-6 py-3 flex items-center justify-between hover:bg-slate-700/30">
                <div>
                  <p className="font-medium text-white">{task.item}</p>
                  <p className="text-sm text-slate-400">{task.workflow}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    task.status === "processing" ? "bg-blue-500/20 text-blue-400" : 
                    task.status === "review" ? "bg-amber-500/20 text-amber-400" :
                    "bg-slate-500/20 text-slate-400"
                  }`}>
                    {task.status}
                  </span>
                  <p className="text-xs text-slate-500 mt-1">{task.started} • {task.assignee}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Business Rules */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Business Rules</h2>
            <div className="flex items-center gap-2">
              <select 
                value={filterWorkflow}
                onChange={(e) => setFilterWorkflow(e.target.value)}
                className="px-3 py-1.5 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
              >
                <option value="all">All Workflows</option>
                {workflowOptions.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
              <button 
                onClick={() => setShowAddRuleModal(true)}
                className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />Add Rule
              </button>
            </div>
          </div>
          <div className="divide-y divide-slate-700 max-h-80 overflow-y-auto">
            {filteredRules.map((rule) => (
              <div key={rule.id} className="px-6 py-3 flex items-center justify-between hover:bg-slate-700/30">
                <div className="flex items-center gap-3 flex-1">
                  <Zap className={`w-4 h-4 flex-shrink-0 ${rule.active ? "text-amber-400" : "text-slate-500"}`} />
                  <div className="min-w-0">
                    <p className="font-medium text-white truncate">{rule.name}</p>
                    <p className="text-xs text-slate-500">{rule.workflow} • Priority {rule.priority}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button 
                    onClick={() => { setSelectedRule(rule); setShowRuleDetail(true); }}
                    className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/20 rounded"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => { setSelectedRule({...rule}); setShowEditRuleModal(true); }}
                    className="p-1.5 text-slate-400 hover:text-purple-400 hover:bg-purple-500/20 rounded"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => toggleRule(rule.id)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${rule.active ? "bg-green-500" : "bg-slate-600"}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${rule.active ? "left-5" : "left-0.5"}`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Rule Modal */}
      <AnimatePresence>
        {showAddRuleModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddRuleModal(false)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 max-h-[90vh] overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-700 flex items-center justify-between flex-shrink-0">
                <h3 className="font-semibold text-white">Add Business Rule</h3>
                <button onClick={() => setShowAddRuleModal(false)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-4 space-y-4 overflow-y-auto flex-1">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Rule Name *</label>
                  <input 
                    type="text" 
                    value={newRule.name}
                    onChange={(e) => setNewRule({...newRule, name: e.target.value})}
                    placeholder="e.g., Auto-approve preventive care"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                  <textarea 
                    value={newRule.description}
                    onChange={(e) => setNewRule({...newRule, description: e.target.value})}
                    placeholder="Describe what this rule does..."
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white h-20 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Workflow *</label>
                  <select 
                    value={newRule.workflow}
                    onChange={(e) => setNewRule({...newRule, workflow: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  >
                    {workflowOptions.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Condition (Expression) *</label>
                  <input 
                    type="text"
                    value={newRule.condition}
                    onChange={(e) => setNewRule({...newRule, condition: e.target.value})}
                    placeholder="e.g., claim.amount < 500 AND claim.status = 'clean'"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white font-mono text-sm"
                  />
                  <p className="text-xs text-slate-500 mt-1">Use field.property syntax with AND, OR, =, &lt;, &gt;, &lt;=, &gt;= operators</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Action *</label>
                  <select 
                    value={newRule.action}
                    onChange={(e) => setNewRule({...newRule, action: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  >
                    {actionOptions.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Priority</label>
                  <select 
                    value={newRule.priority}
                    onChange={(e) => setNewRule({...newRule, priority: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  >
                    <option value={1}>1 - Highest</option>
                    <option value={2}>2 - High</option>
                    <option value={3}>3 - Medium</option>
                    <option value={4}>4 - Low</option>
                    <option value={5}>5 - Lowest</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 p-4 border-t border-slate-700 flex-shrink-0">
                <button onClick={() => setShowAddRuleModal(false)} className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Cancel</button>
                <button onClick={handleAddRule} disabled={!newRule.name || !newRule.condition} className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed">Add Rule</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edit Rule Modal */}
      <AnimatePresence>
        {showEditRuleModal && selectedRule && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowEditRuleModal(false)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 max-h-[90vh] overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-700 flex items-center justify-between flex-shrink-0">
                <h3 className="font-semibold text-white">Edit Business Rule</h3>
                <button onClick={() => setShowEditRuleModal(false)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-4 space-y-4 overflow-y-auto flex-1">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Rule Name *</label>
                  <input 
                    type="text" 
                    value={selectedRule.name}
                    onChange={(e) => setSelectedRule({...selectedRule, name: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                  <textarea 
                    value={selectedRule.description}
                    onChange={(e) => setSelectedRule({...selectedRule, description: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white h-20 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Workflow</label>
                  <select 
                    value={selectedRule.workflow}
                    onChange={(e) => setSelectedRule({...selectedRule, workflow: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  >
                    {workflowOptions.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Condition</label>
                  <input 
                    type="text"
                    value={selectedRule.condition}
                    onChange={(e) => setSelectedRule({...selectedRule, condition: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Action</label>
                  <select 
                    value={selectedRule.action}
                    onChange={(e) => setSelectedRule({...selectedRule, action: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  >
                    {actionOptions.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Priority</label>
                  <select 
                    value={selectedRule.priority}
                    onChange={(e) => setSelectedRule({...selectedRule, priority: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  >
                    <option value={1}>1 - Highest</option>
                    <option value={2}>2 - High</option>
                    <option value={3}>3 - Medium</option>
                    <option value={4}>4 - Low</option>
                    <option value={5}>5 - Lowest</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 p-4 border-t border-slate-700 flex-shrink-0">
                <button onClick={() => { handleDeleteRule(selectedRule.id); setShowEditRuleModal(false); }} className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 flex items-center gap-1">
                  <Trash2 className="w-4 h-4" />Delete
                </button>
                <button onClick={() => setShowEditRuleModal(false)} className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Cancel</button>
                <button onClick={handleEditRule} className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Save Changes</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Rule Detail Modal */}
      <AnimatePresence>
        {showRuleDetail && selectedRule && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowRuleDetail(false)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50">
              <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                <h3 className="font-semibold text-white">Rule Details</h3>
                <button onClick={() => setShowRuleDetail(false)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Status</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${selectedRule.active ? "bg-green-500/20 text-green-400" : "bg-slate-500/20 text-slate-400"}`}>
                    {selectedRule.active ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">Rule ID</p>
                  <p className="text-white font-mono">{selectedRule.id}</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">Name</p>
                  <p className="text-white">{selectedRule.name}</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">Description</p>
                  <p className="text-white">{selectedRule.description}</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">Condition</p>
                  <p className="text-purple-400 font-mono text-sm">{selectedRule.condition}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <p className="text-xs text-slate-400 mb-1">Action</p>
                    <p className="text-white">{selectedRule.action}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <p className="text-xs text-slate-400 mb-1">Priority</p>
                    <p className="text-white">{selectedRule.priority}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <p className="text-xs text-slate-400 mb-1">Created By</p>
                    <p className="text-white">{selectedRule.createdBy}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <p className="text-xs text-slate-400 mb-1">Created</p>
                    <p className="text-white">{selectedRule.createdAt}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 p-4 border-t border-slate-700">
                <button onClick={() => { setShowRuleDetail(false); setShowEditRuleModal(true); }} className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Edit</button>
                <button onClick={() => setShowRuleDetail(false)} className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Close</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Auto-assign To</label>
                  <select className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                    <option>System (Auto)</option>
                    <option>Claims Team</option>
                    <option>Provider Team</option>
                    <option>Compliance Team</option>
                  </select>
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
