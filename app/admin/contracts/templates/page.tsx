"use client";

import { useState } from "react";
import { FileText, Plus, Edit, Copy, Trash2, Eye, Download, CheckCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const templates = [
  { id: "TPL-001", name: "Standard Provider Agreement", type: "Individual", description: "Standard contract for individual providers joining the network", termLength: "3 years", lastModified: "2026-02-15", usageCount: 145, isDefault: true },
  { id: "TPL-002", name: "Group Practice Agreement", type: "Group Practice", description: "Contract template for group practices with multiple providers", termLength: "3 years", lastModified: "2026-02-10", usageCount: 67, isDefault: false },
  { id: "TPL-003", name: "Facility Agreement", type: "Facility", description: "Agreement for hospitals, imaging centers, and other facilities", termLength: "5 years", lastModified: "2026-01-20", usageCount: 34, isDefault: false },
  { id: "TPL-004", name: "Urgent Care Agreement", type: "Facility", description: "Specialized contract for urgent care centers with specific rate structures", termLength: "3 years", lastModified: "2026-02-01", usageCount: 12, isDefault: false },
  { id: "TPL-005", name: "Laboratory Services Agreement", type: "Facility", description: "Contract for diagnostic laboratories with volume-based pricing", termLength: "2 years", lastModified: "2026-01-15", usageCount: 8, isDefault: false },
  { id: "TPL-006", name: "Specialist Agreement", type: "Individual", description: "Enhanced contract for specialists with higher reimbursement rates", termLength: "3 years", lastModified: "2026-02-20", usageCount: 89, isDefault: false },
];

const clauseLibrary = [
  { id: "CL-001", name: "Non-Compete Clause", category: "Restrictions" },
  { id: "CL-002", name: "Termination for Cause", category: "Termination" },
  { id: "CL-003", name: "Auto-Renewal Provision", category: "Term" },
  { id: "CL-004", name: "Rate Adjustment Clause", category: "Financial" },
  { id: "CL-005", name: "HIPAA Compliance", category: "Compliance" },
  { id: "CL-006", name: "Insurance Requirements", category: "Insurance" },
  { id: "CL-007", name: "Dispute Resolution", category: "Legal" },
  { id: "CL-008", name: "Credentialing Requirements", category: "Compliance" },
];

export default function ContractTemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<typeof templates[0] | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"templates" | "clauses">("templates");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <FileText className="w-7 h-7 text-teal-500" />
            Contract Templates
          </h1>
          <p className="text-slate-400 mt-1">Manage contract templates and clause library</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 font-medium rounded-lg hover:bg-teal-700 transition-colors"
          style={{ color: 'white' }}
        >
          <Plus className="w-4 h-4" />
          New Template
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-700 pb-2">
        <button
          onClick={() => setActiveTab("templates")}
          className={`px-4 py-2 font-medium rounded-lg transition-colors ${
            activeTab === "templates" ? "bg-teal-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-700"
          }`}
        >
          Templates ({templates.length})
        </button>
        <button
          onClick={() => setActiveTab("clauses")}
          className={`px-4 py-2 font-medium rounded-lg transition-colors ${
            activeTab === "clauses" ? "bg-teal-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-700"
          }`}
        >
          Clause Library ({clauseLibrary.length})
        </button>
      </div>

      {activeTab === "templates" ? (
        /* Templates Grid */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 hover:border-teal-500/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-teal-500/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-teal-400" />
                </div>
                {template.isDefault && (
                  <span className="px-2 py-1 bg-teal-500/20 text-teal-400 text-xs font-medium rounded-full">Default</span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">{template.name}</h3>
              <p className="text-slate-400 text-sm mb-4">{template.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Type:</span>
                  <span className="text-slate-300">{template.type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Term Length:</span>
                  <span className="text-slate-300">{template.termLength}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Times Used:</span>
                  <span className="text-cyan-400">{template.usageCount}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedTemplate(template)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-slate-700 text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-600 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
                <button className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-slate-700 text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-600 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-slate-700 text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-600 transition-colors">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Clause Library */
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-700 flex justify-between items-center">
            <h3 className="text-white font-semibold">Clause Library</h3>
            <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-700 text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-600 transition-colors">
              <Plus className="w-4 h-4" />
              Add Clause
            </button>
          </div>
          <div className="divide-y divide-slate-700">
            {clauseLibrary.map((clause) => (
              <div key={clause.id} className="p-4 flex items-center justify-between hover:bg-slate-700/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{clause.name}</p>
                    <p className="text-slate-400 text-sm">{clause.category}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Template Preview Modal */}
      <AnimatePresence>
        {selectedTemplate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedTemplate(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-800 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-auto border border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedTemplate.name}</h2>
                  <p className="text-slate-400">{selectedTemplate.type} • {selectedTemplate.termLength}</p>
                </div>
                <button onClick={() => setSelectedTemplate(null)} className="text-slate-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6">
                <div className="bg-slate-900 rounded-lg p-6 font-mono text-sm text-slate-300 whitespace-pre-line">
{`PROVIDER NETWORK PARTICIPATION AGREEMENT

This Agreement ("Agreement") is entered into as of [DATE] by and between:

TrueCare Health Network ("Network")
and
[PROVIDER NAME] ("Provider")

1. TERM
This Agreement shall commence on [START DATE] and continue for a period of ${selectedTemplate.termLength}, unless earlier terminated in accordance with this Agreement.

2. SERVICES
Provider agrees to provide healthcare services to Network members in accordance with the terms of this Agreement and applicable law.

3. COMPENSATION
Network shall compensate Provider according to the Fee Schedule attached hereto as Exhibit A.

4. CREDENTIALING
Provider shall maintain all required licenses, certifications, and credentials throughout the term of this Agreement.

5. COMPLIANCE
Provider shall comply with all applicable federal, state, and local laws and regulations, including but not limited to HIPAA.

[Additional standard terms...]`}
                </div>
              </div>
              <div className="p-6 border-t border-slate-700 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="px-4 py-2 bg-slate-700 text-slate-300 font-medium rounded-lg hover:bg-slate-600 transition-colors"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-slate-700 text-slate-300 font-medium rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
                <button className="px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit Template
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
