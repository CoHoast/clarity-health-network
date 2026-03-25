"use client";

import { useTheme } from "@/components/admin/ThemeContext";
import { cn } from "@/lib/utils";

import { useState, useRef } from "react";
import { FileText, Plus, Edit, Copy, Trash2, Eye, Download, CheckCircle, X, Check, AlertTriangle, Upload, File } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const initialTemplates = [
  { id: "TPL-001", name: "Standard Provider Agreement", type: "Individual", description: "Standard contract for individual providers joining the network", termLength: "3 years", lastModified: "2026-02-15", usageCount: 145, isDefault: true, fileName: "standard-provider-agreement.pdf", hasFile: true },
  { id: "TPL-002", name: "Group Practice Agreement", type: "Group Practice", description: "Contract template for group practices with multiple providers", termLength: "3 years", lastModified: "2026-02-10", usageCount: 67, isDefault: false, fileName: "group-practice-agreement.pdf", hasFile: true },
  { id: "TPL-003", name: "Facility Agreement", type: "Facility", description: "Agreement for hospitals, imaging centers, and other facilities", termLength: "5 years", lastModified: "2026-01-20", usageCount: 34, isDefault: false, fileName: "facility-agreement.pdf", hasFile: true },
  { id: "TPL-004", name: "Urgent Care Agreement", type: "Facility", description: "Specialized contract for urgent care centers with specific rate structures", termLength: "3 years", lastModified: "2026-02-01", usageCount: 12, isDefault: false, fileName: null, hasFile: false },
  { id: "TPL-005", name: "Laboratory Services Agreement", type: "Facility", description: "Contract for diagnostic laboratories with volume-based pricing", termLength: "2 years", lastModified: "2026-01-15", usageCount: 8, isDefault: false, fileName: null, hasFile: false },
  { id: "TPL-006", name: "Specialist Agreement", type: "Individual", description: "Enhanced contract for specialists with higher reimbursement rates", termLength: "3 years", lastModified: "2026-02-20", usageCount: 89, isDefault: false, fileName: "specialist-agreement.pdf", hasFile: true },
];

interface Clause {
  id: string;
  name: string;
  category: string;
  content: string;
  lastModified: string;
  usedIn: number;
}

const clauseLibrary: Clause[] = [
  { 
    id: "CL-001", 
    name: "Non-Compete Clause", 
    category: "Restrictions",
    lastModified: "2026-01-15",
    usedIn: 89,
    content: `NON-COMPETE PROVISION

During the term of this Agreement and for a period of twelve (12) months following termination, Provider agrees not to:

a) Solicit or attempt to solicit any Network members to receive healthcare services outside of the Network;

b) Encourage any Network member to terminate their enrollment with Network;

c) Disclose confidential Network member information to any competing healthcare network or organization.

This provision shall not prevent Provider from providing emergency medical services or from accepting patients who independently seek Provider's services without solicitation.

Violation of this provision may result in immediate termination of this Agreement and pursuit of available legal remedies.`
  },
  { 
    id: "CL-002", 
    name: "Termination for Cause", 
    category: "Termination",
    lastModified: "2026-02-01",
    usedIn: 145,
    content: `TERMINATION FOR CAUSE

Either party may terminate this Agreement immediately upon written notice if the other party:

a) Materially breaches any provision of this Agreement and fails to cure such breach within thirty (30) days of receiving written notice;

b) Loses any license, certification, or credential required to perform services under this Agreement;

c) Is excluded from participation in any federal or state healthcare program;

d) Engages in conduct that constitutes fraud, abuse, or any criminal activity;

e) Files for bankruptcy or becomes insolvent;

f) Fails to maintain required malpractice insurance coverage.

Upon termination for cause, the terminating party shall have no further obligations except for payment of services rendered prior to termination.`
  },
  { 
    id: "CL-003", 
    name: "Auto-Renewal Provision", 
    category: "Term",
    lastModified: "2026-01-20",
    usedIn: 134,
    content: `AUTO-RENEWAL PROVISION

This Agreement shall automatically renew for successive one (1) year terms unless either party provides written notice of non-renewal at least ninety (90) days prior to the end of the then-current term.

Upon auto-renewal:
a) All terms and conditions shall remain in effect unless modified by written amendment;
b) Fee schedules may be updated by Network with sixty (60) days advance notice;
c) Provider must maintain current credentialing status;
d) Any changes to Provider information must be reported within thirty (30) days.

Network reserves the right to modify the renewal terms with ninety (90) days written notice. Provider's continued participation after such notice constitutes acceptance of modified terms.`
  },
  { 
    id: "CL-004", 
    name: "Rate Adjustment Clause", 
    category: "Financial",
    lastModified: "2026-02-10",
    usedIn: 112,
    content: `RATE ADJUSTMENT PROVISION

Network may adjust reimbursement rates under the following conditions:

1. ANNUAL ADJUSTMENTS
Network may adjust rates annually, effective January 1st of each year, with at least sixty (60) days prior written notice.

2. MEDICARE/MEDICAID CHANGES
Rates tied to Medicare or Medicaid fee schedules shall automatically adjust when CMS publishes updated rates.

3. VOLUME-BASED ADJUSTMENTS
Providers meeting volume thresholds may qualify for enhanced rates as specified in Exhibit B.

4. QUALITY INCENTIVES
Providers meeting quality metrics may receive bonus payments as outlined in the Quality Incentive Program addendum.

5. NOTICE REQUIREMENTS
Any rate changes shall be communicated in writing and shall not apply to services rendered prior to the effective date.

Provider may terminate this Agreement within thirty (30) days of receiving notice of a rate decrease exceeding 10%.`
  },
  { 
    id: "CL-005", 
    name: "HIPAA Compliance", 
    category: "Compliance",
    lastModified: "2026-01-10",
    usedIn: 145,
    content: `HIPAA COMPLIANCE REQUIREMENTS

Provider agrees to comply with all applicable provisions of the Health Insurance Portability and Accountability Act of 1996 (HIPAA), as amended, including:

1. PRIVACY RULE
Provider shall maintain appropriate safeguards to protect the privacy of Protected Health Information (PHI) and limit uses and disclosures to those permitted or required by law.

2. SECURITY RULE
Provider shall implement administrative, physical, and technical safeguards to ensure the confidentiality, integrity, and availability of electronic PHI.

3. BREACH NOTIFICATION
Provider shall notify Network within twenty-four (24) hours of discovering any breach of unsecured PHI and cooperate in breach investigation and notification.

4. BUSINESS ASSOCIATE AGREEMENT
Provider acknowledges receipt of and agrees to comply with the Business Associate Agreement attached as Exhibit C.

5. TRAINING
Provider shall ensure all workforce members receive appropriate HIPAA training upon hire and annually thereafter.

6. DOCUMENTATION
Provider shall maintain documentation of HIPAA compliance efforts for a minimum of six (6) years.`
  },
  { 
    id: "CL-006", 
    name: "Insurance Requirements", 
    category: "Insurance",
    lastModified: "2026-02-05",
    usedIn: 145,
    content: `INSURANCE REQUIREMENTS

Provider shall maintain the following insurance coverage throughout the term of this Agreement:

1. PROFESSIONAL LIABILITY (MALPRACTICE)
- Minimum limits: $1,000,000 per occurrence / $3,000,000 aggregate
- Coverage must be occurrence-based or include tail coverage for claims-made policies
- Network must be named as additional insured

2. GENERAL LIABILITY
- Minimum limits: $1,000,000 per occurrence / $2,000,000 aggregate
- Coverage for premises, operations, and products/completed operations

3. WORKERS' COMPENSATION
- Statutory limits as required by applicable state law
- Employer's liability: $500,000 per accident

4. CYBER LIABILITY (if applicable)
- Minimum limits: $1,000,000 per occurrence
- Coverage for data breach, network security, and privacy liability

5. DOCUMENTATION
Provider shall furnish certificates of insurance upon execution of this Agreement and upon each renewal. Provider shall provide thirty (30) days advance notice of any cancellation or material change in coverage.`
  },
  { 
    id: "CL-007", 
    name: "Dispute Resolution", 
    category: "Legal",
    lastModified: "2026-01-25",
    usedIn: 98,
    content: `DISPUTE RESOLUTION

The parties agree to resolve any disputes arising under this Agreement through the following process:

1. INFORMAL RESOLUTION
The parties shall first attempt to resolve any dispute through good faith negotiations between designated representatives within thirty (30) days.

2. MEDIATION
If informal resolution fails, the parties shall submit the dispute to non-binding mediation administered by JAMS or another mutually agreed mediator. Mediation costs shall be shared equally.

3. ARBITRATION
If mediation fails, the dispute shall be resolved through binding arbitration in accordance with the Commercial Arbitration Rules of the American Arbitration Association. The arbitrator's decision shall be final and binding.

4. GOVERNING LAW
This Agreement shall be governed by the laws of the State of Ohio without regard to conflict of law principles.

5. VENUE
Any legal proceedings shall be conducted in the state or federal courts located in Cuyahoga County, Ohio.

6. ATTORNEYS' FEES
The prevailing party in any arbitration or litigation shall be entitled to recover reasonable attorneys' fees and costs.`
  },
  { 
    id: "CL-008", 
    name: "Credentialing Requirements", 
    category: "Compliance",
    lastModified: "2026-02-15",
    usedIn: 145,
    content: `CREDENTIALING REQUIREMENTS

Provider shall maintain and provide evidence of the following credentials throughout the term of this Agreement:

1. LICENSURE
- Current, unrestricted license to practice in the State of Ohio
- All applicable specialty certifications
- DEA registration (if prescribing controlled substances)

2. BOARD CERTIFICATION
- Board certification in primary specialty (or board eligibility for recently trained providers)
- Maintenance of certification as required by specialty board

3. HOSPITAL PRIVILEGES
- Active admitting privileges at a Network-participating hospital (if applicable)
- Notification of any restriction, suspension, or revocation of privileges

4. NATIONAL PROVIDER IDENTIFIER (NPI)
- Current, valid NPI
- Prompt notification of any changes

5. RECREDENTIALING
- Provider shall cooperate with Network's recredentialing process every three (3) years
- Failure to complete recredentialing may result in termination

6. ONGOING MONITORING
- Provider shall notify Network within five (5) business days of any adverse action, malpractice claim, or change in credential status.`
  },
];

export default function ContractTemplatesPage() {
  const { isDark } = useTheme();
  const [templates, setTemplates] = useState(initialTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<typeof initialTemplates[0] | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<typeof initialTemplates[0] | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showClauseModal, setShowClauseModal] = useState(false);
  const [selectedClause, setSelectedClause] = useState<Clause | null>(null);
  const [showAddClauseModal, setShowAddClauseModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"templates" | "clauses">("templates");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  // Create template form state
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateType, setNewTemplateType] = useState("");
  const [newTemplateDesc, setNewTemplateDesc] = useState("");
  const [newTemplateTerm, setNewTemplateTerm] = useState("3 years");
  const [newTemplateFile, setNewTemplateFile] = useState<File | null>(null);
  const templateFileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      if (showCreateModal && newTemplateName && newTemplateType) {
        const newTemplate = {
          id: `TPL-${Date.now()}`,
          name: newTemplateName,
          type: newTemplateType,
          description: newTemplateDesc,
          termLength: newTemplateTerm,
          lastModified: new Date().toISOString().split('T')[0],
          usageCount: 0,
          isDefault: false,
          fileName: newTemplateFile?.name || null,
          hasFile: !!newTemplateFile,
        };
        setTemplates(prev => [...prev, newTemplate]);
      }
      setSaving(false);
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        setShowCreateModal(false);
        setShowEditModal(false);
        setShowAddClauseModal(false);
        // Reset form
        setNewTemplateName("");
        setNewTemplateType("");
        setNewTemplateDesc("");
        setNewTemplateTerm("3 years");
        setNewTemplateFile(null);
      }, 1500);
    }, 1000);
  };

  const handleEditTemplate = (template: typeof initialTemplates[0]) => {
    setEditingTemplate(template);
    setNewTemplateName(template.name);
    setNewTemplateType(template.type);
    setNewTemplateDesc(template.description);
    setNewTemplateTerm(template.termLength);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editingTemplate) return;
    setSaving(true);
    setTimeout(() => {
      setTemplates(prev => prev.map(t => 
        t.id === editingTemplate.id 
          ? {
              ...t,
              name: newTemplateName,
              type: newTemplateType,
              description: newTemplateDesc,
              termLength: newTemplateTerm,
              lastModified: new Date().toISOString().split('T')[0],
              fileName: newTemplateFile?.name || t.fileName,
              hasFile: newTemplateFile ? true : t.hasFile,
            }
          : t
      ));
      setSaving(false);
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        setShowEditModal(false);
        setEditingTemplate(null);
        setNewTemplateName("");
        setNewTemplateType("");
        setNewTemplateDesc("");
        setNewTemplateTerm("3 years");
        setNewTemplateFile(null);
      }, 1500);
    }, 1000);
  };

  const handleViewClause = (clause: Clause) => {
    setSelectedClause(clause);
    setShowClauseModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <FileText className="w-7 h-7 text-blue-500" />
            Contract Templates
          </h1>
          <p className="text-slate-400 mt-1">Manage contract templates and clause library</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 font-medium rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-colors"
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
            activeTab === "templates" ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white" : "text-slate-400 hover:text-white hover:bg-slate-700"
          }`}
        >
          Templates ({templates.length})
        </button>
        <button
          onClick={() => setActiveTab("clauses")}
          className={`px-4 py-2 font-medium rounded-lg transition-colors ${
            activeTab === "clauses" ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white" : "text-slate-400 hover:text-white hover:bg-slate-700"
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
                  <FileText className="w-6 h-6 text-blue-400" />
                </div>
                {template.isDefault && (
                  <span className="px-2 py-1 bg-teal-500/20 text-blue-400 text-xs font-medium rounded-full">Default</span>
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
                  <span className="text-blue-400">{template.usageCount}</span>
                </div>
              </div>

              {/* File indicator */}
              {template.hasFile && (
                <div className="flex items-center gap-2 mb-3 text-xs text-slate-400">
                  <File className="w-3 h-3" />
                  <span>{template.fileName}</span>
                </div>
              )}
              {!template.hasFile && (
                <div className="flex items-center gap-2 mb-3 text-xs text-amber-400">
                  <AlertTriangle className="w-3 h-3" />
                  <span>No PDF uploaded</span>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedTemplate(template)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-slate-700 text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-600 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
                <button 
                  onClick={() => handleEditTemplate(template)}
                  className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-slate-700 text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-600 transition-colors"
                >
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
            <button 
              onClick={() => setShowAddClauseModal(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-colors"
            >
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
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-slate-400 text-sm">{clause.category}</span>
                      <span className="text-slate-500 text-xs">•</span>
                      <span className="text-slate-500 text-xs">Used in {clause.usedIn} contracts</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleViewClause(clause)}
                    className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                  >
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

      {/* Template Preview Modal - LIGHT THEME */}
      <AnimatePresence>
        {selectedTemplate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedTemplate(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl max-w-3xl w-full max-h-[85vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedTemplate.name}</h2>
                  <p className="text-gray-600">{selectedTemplate.type} • {selectedTemplate.termLength}</p>
                </div>
                <button onClick={() => setSelectedTemplate(null)} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-200 rounded-lg">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-8 overflow-auto max-h-[60vh] bg-white">
                <div className="prose prose-sm max-w-none">
                  <div className="text-center mb-8 pb-6 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">PROVIDER NETWORK PARTICIPATION AGREEMENT</h1>
                    <p className="text-gray-600">TrueCare Health Network</p>
                  </div>
                  
                  <p className="text-gray-700 mb-6">
                    This Agreement (&quot;Agreement&quot;) is entered into as of <span className="bg-yellow-100 px-1">[DATE]</span> by and between:
                  </p>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <p className="text-gray-700"><strong>TrueCare Health Network</strong> (&quot;Network&quot;)</p>
                    <p className="text-gray-500">123 Healthcare Drive, Suite 500, Cleveland, OH 44101</p>
                    <p className="text-gray-700 mt-3">and</p>
                    <p className="text-gray-700 mt-3"><strong><span className="bg-yellow-100 px-1">[PROVIDER NAME]</span></strong> (&quot;Provider&quot;)</p>
                    <p className="text-gray-500"><span className="bg-yellow-100 px-1">[PROVIDER ADDRESS]</span></p>
                  </div>

                  <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">1. TERM</h2>
                  <p className="text-gray-700 mb-4">
                    This Agreement shall commence on <span className="bg-yellow-100 px-1">[START DATE]</span> and continue for a period of <strong>{selectedTemplate.termLength}</strong>, unless earlier terminated in accordance with Section 8 of this Agreement. This Agreement shall automatically renew for successive one-year terms unless either party provides written notice of non-renewal at least ninety (90) days prior to expiration.
                  </p>

                  <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">2. SERVICES</h2>
                  <p className="text-gray-700 mb-4">
                    Provider agrees to provide healthcare services to Network members in accordance with the terms of this Agreement, applicable law, and generally accepted standards of medical practice. Provider shall not discriminate against Network members in the provision of services.
                  </p>

                  <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">3. COMPENSATION</h2>
                  <p className="text-gray-700 mb-4">
                    Network shall compensate Provider according to the Fee Schedule attached hereto as <strong>Exhibit A</strong>. Payment shall be made within thirty (30) days of receipt of a clean claim. Provider agrees to accept the Fee Schedule rates as payment in full and shall not balance bill Network members except for applicable copayments, coinsurance, and deductibles.
                  </p>

                  <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">4. CREDENTIALING</h2>
                  <p className="text-gray-700 mb-4">
                    Provider shall maintain all required licenses, certifications, and credentials throughout the term of this Agreement. Provider shall cooperate with Network&apos;s credentialing and recredentialing processes and shall notify Network within five (5) business days of any adverse action affecting Provider&apos;s credentials.
                  </p>

                  <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">5. COMPLIANCE</h2>
                  <p className="text-gray-700 mb-4">
                    Provider shall comply with all applicable federal, state, and local laws and regulations, including but not limited to HIPAA, the Anti-Kickback Statute, and the Stark Law. Provider shall maintain appropriate policies and procedures to ensure compliance.
                  </p>

                  <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">6. INSURANCE</h2>
                  <p className="text-gray-700 mb-4">
                    Provider shall maintain professional liability insurance with minimum limits of $1,000,000 per occurrence and $3,000,000 aggregate. Provider shall provide Network with certificates of insurance upon request.
                  </p>

                  <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">7. CONFIDENTIALITY</h2>
                  <p className="text-gray-700 mb-4">
                    Each party shall maintain the confidentiality of the other party&apos;s proprietary information and shall not disclose such information to third parties without prior written consent.
                  </p>

                  <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">8. TERMINATION</h2>
                  <p className="text-gray-700 mb-4">
                    Either party may terminate this Agreement without cause upon ninety (90) days written notice. Either party may terminate immediately for cause, including material breach, loss of licensure, or exclusion from federal healthcare programs.
                  </p>

                  <div className="mt-10 pt-6 border-t border-gray-200">
                    <p className="text-gray-600 text-sm italic">
                      [Additional standard terms and signature blocks to follow...]
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
                <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-colors flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit Template
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Template Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => !saving && setShowCreateModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-800 rounded-xl max-w-2xl w-full max-h-[85vh] overflow-hidden border border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              {!saving && !saved ? (
                <>
                  <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white">Create New Template</h2>
                      <p className="text-slate-400 text-sm">Upload an existing contract PDF to use as a template</p>
                    </div>
                    <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white p-2 hover:bg-slate-700 rounded-lg">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="p-6 overflow-auto max-h-[60vh] space-y-5">
                    {/* File Upload - Primary */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Upload Contract Template (PDF) *</label>
                      <input
                        ref={templateFileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setNewTemplateFile(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      <div
                        onClick={() => templateFileInputRef.current?.click()}
                        className={cn(
                          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                          "border-slate-600 hover:border-blue-500",
                          newTemplateFile && "border-green-500 bg-green-500/10"
                        )}
                      >
                        {newTemplateFile ? (
                          <div className="flex items-center justify-center gap-3">
                            <File className="w-8 h-8 text-green-400" />
                            <div className="text-left">
                              <p className="text-white font-medium">{newTemplateFile.name}</p>
                              <p className="text-slate-400 text-sm">{(newTemplateFile.size / 1024).toFixed(1)} KB</p>
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); setNewTemplateFile(null); }}
                              className="p-1 hover:bg-slate-700 rounded"
                            >
                              <X className="w-4 h-4 text-slate-400" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                            <p className="text-white font-medium">Click to upload your contract template</p>
                            <p className="text-slate-400 text-sm mt-1">PDF or Word document (max 10MB)</p>
                          </>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Template Name *</label>
                      <input 
                        type="text"
                        value={newTemplateName}
                        onChange={(e) => setNewTemplateName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                        placeholder="e.g., Standard Provider Agreement"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Provider Type *</label>
                        <select 
                          value={newTemplateType}
                          onChange={(e) => setNewTemplateType(e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-teal-500"
                        >
                          <option value="">Select type...</option>
                          <option value="Individual">Individual</option>
                          <option value="Group Practice">Group Practice</option>
                          <option value="Facility">Facility</option>
                          <option value="Ancillary">Ancillary</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Default Term Length *</label>
                        <select 
                          value={newTemplateTerm}
                          onChange={(e) => setNewTemplateTerm(e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-teal-500"
                        >
                          <option value="1 year">1 year</option>
                          <option value="2 years">2 years</option>
                          <option value="3 years">3 years</option>
                          <option value="5 years">5 years</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                      <textarea 
                        value={newTemplateDesc}
                        onChange={(e) => setNewTemplateDesc(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:border-teal-500 h-20 resize-none"
                        placeholder="Brief description of when this template should be used..."
                      />
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                      <h4 className="text-blue-400 font-medium text-sm mb-2">📄 How Templates Work</h4>
                      <ul className="text-blue-300/80 text-sm space-y-1">
                        <li>• Upload your existing contract PDF as the template</li>
                        <li>• When onboarding a provider, select this template</li>
                        <li>• Send for e-signature via DocuSign integration</li>
                        <li>• Signed contract is automatically saved to provider file</li>
                      </ul>
                    </div>

                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="setDefault" className="rounded bg-slate-600 border-slate-500 text-blue-500 focus:ring-teal-500" />
                      <label htmlFor="setDefault" className="text-slate-300 text-sm">Set as default template for this provider type</label>
                    </div>
                  </div>
                  <div className="p-4 border-t border-slate-700 flex justify-end gap-3">
                    <button
                      onClick={() => setShowCreateModal(false)}
                      className="px-4 py-2 bg-slate-700 text-slate-300 font-medium rounded-lg hover:bg-slate-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSave}
                      disabled={!newTemplateName || !newTemplateType}
                      className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                      Create Template
                    </button>
                  </div>
                </>
              ) : saving ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-white font-medium">Creating template...</p>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <Check className="w-8 h-8 text-green-400" />
                  </motion.div>
                  <p className="text-white font-medium">Template Created!</p>
                  <p className="text-slate-400 text-sm mt-1">You can now use this template for new contracts</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Template Modal */}
      <AnimatePresence>
        {showEditModal && editingTemplate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => !saving && setShowEditModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-800 rounded-xl max-w-2xl w-full max-h-[85vh] overflow-hidden border border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              {!saving && !saved ? (
                <>
                  <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white">Edit Template</h2>
                      <p className="text-slate-400 text-sm">Update template details or upload a new PDF</p>
                    </div>
                    <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-white p-2 hover:bg-slate-700 rounded-lg">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="p-6 overflow-auto max-h-[60vh] space-y-5">
                    {/* Current File */}
                    {editingTemplate.hasFile && (
                      <div className="bg-slate-700/50 rounded-lg p-4">
                        <p className="text-slate-400 text-sm mb-2">Current Template File</p>
                        <div className="flex items-center gap-3">
                          <File className="w-5 h-5 text-blue-400" />
                          <span className="text-white">{editingTemplate.fileName}</span>
                          <button className="text-blue-400 text-sm hover:underline">Download</button>
                        </div>
                      </div>
                    )}

                    {/* Replace File */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        {editingTemplate.hasFile ? "Replace Template PDF (optional)" : "Upload Template PDF *"}
                      </label>
                      <input
                        ref={templateFileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setNewTemplateFile(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      <div
                        onClick={() => templateFileInputRef.current?.click()}
                        className={cn(
                          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
                          "border-slate-600 hover:border-blue-500",
                          newTemplateFile && "border-green-500 bg-green-500/10"
                        )}
                      >
                        {newTemplateFile ? (
                          <div className="flex items-center justify-center gap-3">
                            <File className="w-6 h-6 text-green-400" />
                            <span className="text-white">{newTemplateFile.name}</span>
                            <button
                              onClick={(e) => { e.stopPropagation(); setNewTemplateFile(null); }}
                              className="p-1 hover:bg-slate-700 rounded"
                            >
                              <X className="w-4 h-4 text-slate-400" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                            <p className="text-slate-400 text-sm">Click to upload a new PDF</p>
                          </>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Template Name *</label>
                      <input 
                        type="text"
                        value={newTemplateName}
                        onChange={(e) => setNewTemplateName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Provider Type *</label>
                        <select 
                          value={newTemplateType}
                          onChange={(e) => setNewTemplateType(e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-teal-500"
                        >
                          <option value="Individual">Individual</option>
                          <option value="Group Practice">Group Practice</option>
                          <option value="Facility">Facility</option>
                          <option value="Ancillary">Ancillary</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Default Term Length</label>
                        <select 
                          value={newTemplateTerm}
                          onChange={(e) => setNewTemplateTerm(e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-teal-500"
                        >
                          <option value="1 year">1 year</option>
                          <option value="2 years">2 years</option>
                          <option value="3 years">3 years</option>
                          <option value="5 years">5 years</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                      <textarea 
                        value={newTemplateDesc}
                        onChange={(e) => setNewTemplateDesc(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:border-teal-500 h-20 resize-none"
                      />
                    </div>
                  </div>
                  <div className="p-4 border-t border-slate-700 flex justify-between">
                    <button
                      className="px-4 py-2 text-red-400 hover:bg-red-500/10 font-medium rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Template
                    </button>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowEditModal(false)}
                        className="px-4 py-2 bg-slate-700 text-slate-300 font-medium rounded-lg hover:bg-slate-600 transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleSaveEdit}
                        className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-colors flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Save Changes
                      </button>
                    </div>
                  </div>
                </>
              ) : saving ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-white font-medium">Saving changes...</p>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <Check className="w-8 h-8 text-green-400" />
                  </motion.div>
                  <p className="text-white font-medium">Changes Saved!</p>
                  <p className="text-slate-400 text-sm mt-1">Template has been updated</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Clause Modal - LIGHT THEME */}
      <AnimatePresence>
        {showClauseModal && selectedClause && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowClauseModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedClause.name}</h2>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="px-2 py-0.5 bg-teal-100 text-indigo-700 text-xs font-medium rounded-full">{selectedClause.category}</span>
                    <span className="text-gray-500 text-sm">Used in {selectedClause.usedIn} contracts</span>
                  </div>
                </div>
                <button onClick={() => setShowClauseModal(false)} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-200 rounded-lg">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 overflow-auto max-h-[60vh] bg-white">
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-gray-700 text-sm leading-relaxed bg-gray-50 p-6 rounded-lg border border-gray-200">
                    {selectedClause.content}
                  </pre>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
                  <span>Last modified: {selectedClause.lastModified}</span>
                  <span>ID: {selectedClause.id}</span>
                </div>
              </div>
              <div className="p-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
                <button
                  onClick={() => setShowClauseModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2">
                  <Copy className="w-4 h-4" />
                  Copy Text
                </button>
                <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-colors flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit Clause
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Clause Modal */}
      <AnimatePresence>
        {showAddClauseModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => !saving && setShowAddClauseModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-800 rounded-xl max-w-2xl w-full max-h-[85vh] overflow-hidden border border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              {!saving && !saved ? (
                <>
                  <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white">Add New Clause</h2>
                      <p className="text-slate-400 text-sm">Create a reusable clause for contract templates</p>
                    </div>
                    <button onClick={() => setShowAddClauseModal(false)} className="text-slate-400 hover:text-white p-2 hover:bg-slate-700 rounded-lg">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="p-6 overflow-auto max-h-[60vh] space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Clause Name *</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                        placeholder="e.g., Force Majeure Clause"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Category *</label>
                      <select className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-teal-500">
                        <option value="">Select category...</option>
                        <option>Compliance</option>
                        <option>Financial</option>
                        <option>Insurance</option>
                        <option>Legal</option>
                        <option>Restrictions</option>
                        <option>Term</option>
                        <option>Termination</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Clause Content *</label>
                      <textarea 
                        className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:border-teal-500 h-48 resize-none font-mono text-sm"
                        placeholder="Enter the full clause text here..."
                      />
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="text-amber-300 font-medium">Legal Review Recommended</p>
                        <p className="text-amber-200/70 mt-1">New clauses should be reviewed by legal counsel before use in contracts.</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t border-slate-700 flex justify-end gap-3">
                    <button
                      onClick={() => setShowAddClauseModal(false)}
                      className="px-4 py-2 bg-slate-700 text-slate-300 font-medium rounded-lg hover:bg-slate-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSave}
                      className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Clause
                    </button>
                  </div>
                </>
              ) : saving ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-white font-medium">Adding clause...</p>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <Check className="w-8 h-8 text-green-400" />
                  </motion.div>
                  <p className="text-white font-medium">Clause Added!</p>
                  <p className="text-slate-400 text-sm mt-1">The clause is now available in your library</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
