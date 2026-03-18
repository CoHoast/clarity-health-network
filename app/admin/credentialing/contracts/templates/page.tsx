"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Edit,
  Copy,
  Trash2,
  Eye,
  Download,
  Upload,
  CheckCircle,
  Building,
  User,
  Users,
  Stethoscope,
  Clock,
  MoreHorizontal,
  ArrowLeft,
  XCircle,
  Save,
} from "lucide-react";
import { useTheme } from "@/components/admin/ThemeContext";
import { Button } from "@/components/admin/ui/Button";
import { Badge } from "@/components/admin/ui/Badge";
import { cn } from "@/lib/utils";

// Demo templates
const templates = [
  {
    id: "tpl-001",
    name: "Physician Individual Agreement",
    type: "individual",
    category: "physician",
    description: "Standard participation agreement for individual physician providers",
    version: "2.1",
    lastModified: "Mar 10, 2024",
    usageCount: 145,
    status: "active",
    sections: [
      "Provider Information",
      "Credentialing Requirements",
      "Fee Schedule Exhibit",
      "Term & Termination",
      "Confidentiality",
      "Compliance Requirements",
      "Signature Block",
    ],
  },
  {
    id: "tpl-002",
    name: "Group Practice Agreement",
    type: "group",
    category: "physician",
    description: "Agreement for group practices with multiple physician providers",
    version: "1.8",
    lastModified: "Feb 28, 2024",
    usageCount: 67,
    status: "active",
    sections: [
      "Group Information",
      "Provider Roster",
      "Credentialing Requirements",
      "Fee Schedule Exhibit",
      "Provider Addition/Removal",
      "Term & Termination",
      "Compliance Requirements",
      "Signature Block",
    ],
  },
  {
    id: "tpl-003",
    name: "Facility Agreement",
    type: "facility",
    category: "facility",
    description: "Agreement for hospitals, imaging centers, surgery centers, and labs",
    version: "1.5",
    lastModified: "Feb 15, 2024",
    usageCount: 32,
    status: "active",
    sections: [
      "Facility Information",
      "Accreditation Requirements",
      "Services Covered",
      "Fee Schedule Exhibit",
      "Quality Standards",
      "Term & Termination",
      "Insurance Requirements",
      "Signature Block",
    ],
  },
  {
    id: "tpl-004",
    name: "Allied Health Agreement",
    type: "allied",
    category: "allied",
    description: "Agreement for PT, OT, Speech Therapy, and Behavioral Health providers",
    version: "1.3",
    lastModified: "Jan 20, 2024",
    usageCount: 28,
    status: "active",
    sections: [
      "Provider Information",
      "Licensure Requirements",
      "Fee Schedule Exhibit",
      "Supervision Requirements",
      "Term & Termination",
      "Signature Block",
    ],
  },
  {
    id: "tpl-005",
    name: "Ancillary Services Agreement",
    type: "ancillary",
    category: "ancillary",
    description: "Agreement for DME, Home Health, and other ancillary service providers",
    version: "1.0",
    lastModified: "Dec 5, 2023",
    usageCount: 12,
    status: "draft",
    sections: [
      "Provider Information",
      "Services Covered",
      "Fee Schedule Exhibit",
      "Quality Requirements",
      "Term & Termination",
      "Signature Block",
    ],
  },
];

// Template variables/merge fields
const mergeFields = [
  { group: "Provider", fields: ["{{provider_name}}", "{{provider_npi}}", "{{provider_specialty}}", "{{provider_license}}", "{{provider_dea}}"] },
  { group: "Practice", fields: ["{{practice_name}}", "{{practice_tax_id}}", "{{practice_address}}", "{{practice_phone}}"] },
  { group: "Contract", fields: ["{{effective_date}}", "{{term_date}}", "{{contract_id}}", "{{rate_schedule}}"] },
  { group: "Network", fields: ["{{network_name}}", "{{network_address}}", "{{network_phone}}", "{{network_contact}}"] },
];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "physician":
      return <Stethoscope className="w-5 h-5" />;
    case "facility":
      return <Building className="w-5 h-5" />;
    case "allied":
      return <Users className="w-5 h-5" />;
    case "ancillary":
      return <User className="w-5 h-5" />;
    default:
      return <FileText className="w-5 h-5" />;
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case "individual":
      return "Individual";
    case "group":
      return "Group Practice";
    case "facility":
      return "Facility";
    case "allied":
      return "Allied Health";
    case "ancillary":
      return "Ancillary";
    default:
      return type;
  }
};

export default function ContractTemplatesPage() {
  const { isDark } = useTheme();
  const [selectedTemplate, setSelectedTemplate] = useState<typeof templates[0] | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);

  return (
    <div className={cn("space-y-6", isDark ? "text-white" : "text-slate-900")}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/credentialing/contracts"
            className={cn(
              "p-2 rounded-lg transition-colors",
              isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"
            )}
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Contract Templates</h1>
            <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-600")}>
              Manage contract templates and merge fields
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">
            <Upload className="w-4 h-4 mr-2" />
            Import Template
          </Button>
          <Button onClick={() => setShowNewModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Template
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Templates List */}
        <div className="lg:col-span-2 space-y-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className={cn(
                "rounded-xl border p-4 transition-colors cursor-pointer",
                selectedTemplate?.id === template.id
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : isDark
                  ? "bg-slate-800/50 border-slate-700 hover:border-slate-600"
                  : "bg-white border-slate-200 hover:border-slate-300"
              )}
              onClick={() => setSelectedTemplate(template)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "p-2 rounded-lg",
                      isDark ? "bg-slate-700" : "bg-slate-100"
                    )}
                  >
                    {getCategoryIcon(template.category)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{template.name}</h3>
                      <Badge variant={template.status === "active" ? "success" : "default"}>
                        {template.status === "active" ? "Active" : "Draft"}
                      </Badge>
                    </div>
                    <p className={cn("text-sm mt-1", isDark ? "text-slate-400" : "text-slate-500")}>
                      {template.description}
                    </p>
                    <div className={cn("flex items-center gap-4 mt-2 text-xs", isDark ? "text-slate-500" : "text-slate-400")}>
                      <span>v{template.version}</span>
                      <span>•</span>
                      <span>Updated {template.lastModified}</span>
                      <span>•</span>
                      <span>{template.usageCount} contracts</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTemplate(template);
                      setShowEditor(true);
                    }}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      isDark ? "hover:bg-slate-700" : "hover:bg-slate-200"
                    )}
                    title="Edit Template"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      isDark ? "hover:bg-slate-700" : "hover:bg-slate-200"
                    )}
                    title="Duplicate"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      isDark ? "hover:bg-slate-700" : "hover:bg-slate-200"
                    )}
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Template Details Sidebar */}
        <div className="space-y-4">
          {/* Selected Template Details */}
          {selectedTemplate ? (
            <div
              className={cn(
                "rounded-xl border p-4",
                isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200"
              )}
            >
              <h3 className="font-semibold mb-4">Template Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className={cn("text-xs font-medium uppercase", isDark ? "text-slate-500" : "text-slate-400")}>
                    Type
                  </label>
                  <p className="mt-1">{getTypeLabel(selectedTemplate.type)}</p>
                </div>
                
                <div>
                  <label className={cn("text-xs font-medium uppercase", isDark ? "text-slate-500" : "text-slate-400")}>
                    Sections
                  </label>
                  <ul className="mt-2 space-y-1">
                    {selectedTemplate.sections.map((section, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        {section}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t" style={{ borderColor: isDark ? '#334155' : '#e2e8f0' }}>
                  <Button
                    className="w-full"
                    onClick={() => setShowEditor(true)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Template
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={cn(
                "rounded-xl border p-6 text-center",
                isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200"
              )}
            >
              <FileText className={cn("w-10 h-10 mx-auto mb-3", isDark ? "text-slate-600" : "text-slate-300")} />
              <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                Select a template to view details
              </p>
            </div>
          )}

          {/* Merge Fields Reference */}
          <div
            className={cn(
              "rounded-xl border p-4",
              isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200"
            )}
          >
            <h3 className="font-semibold mb-4">Merge Fields</h3>
            <div className="space-y-4">
              {mergeFields.map((group) => (
                <div key={group.group}>
                  <label className={cn("text-xs font-medium uppercase", isDark ? "text-slate-500" : "text-slate-400")}>
                    {group.group}
                  </label>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {group.fields.map((field) => (
                      <code
                        key={field}
                        className={cn(
                          "text-xs px-2 py-0.5 rounded cursor-pointer transition-colors",
                          isDark
                            ? "bg-slate-700 hover:bg-slate-600 text-blue-400"
                            : "bg-slate-100 hover:bg-slate-200 text-blue-600"
                        )}
                        onClick={() => navigator.clipboard.writeText(field)}
                        title="Click to copy"
                      >
                        {field}
                      </code>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Template Editor Modal */}
      {showEditor && selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div
            className={cn(
              "w-full max-w-5xl h-[90vh] rounded-xl shadow-xl flex flex-col",
              isDark ? "bg-slate-800" : "bg-white"
            )}
          >
            {/* Editor Header */}
            <div className={cn("flex items-center justify-between p-4 border-b", isDark ? "border-slate-700" : "border-slate-200")}>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowEditor(false)}
                  className={cn("p-2 rounded-lg", isDark ? "hover:bg-slate-700" : "hover:bg-slate-100")}
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-lg font-semibold">{selectedTemplate.name}</h2>
                  <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                    Version {selectedTemplate.version}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="secondary">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button>
                  <Save className="w-4 h-4 mr-2" />
                  Save Template
                </Button>
              </div>
            </div>

            {/* Editor Content */}
            <div className="flex-1 flex overflow-hidden">
              {/* Sections List */}
              <div
                className={cn(
                  "w-64 border-r overflow-y-auto p-4",
                  isDark ? "border-slate-700 bg-slate-800/50" : "border-slate-200 bg-slate-50"
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <label className={cn("text-xs font-medium uppercase", isDark ? "text-slate-500" : "text-slate-400")}>
                    Sections
                  </label>
                  <button
                    className={cn(
                      "p-1 rounded transition-colors",
                      isDark ? "hover:bg-slate-700" : "hover:bg-slate-200"
                    )}
                    title="Add Section"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-1">
                  {selectedTemplate.sections.map((section, idx) => (
                    <button
                      key={idx}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                        idx === 0
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                          : isDark
                          ? "hover:bg-slate-700"
                          : "hover:bg-slate-200"
                      )}
                    >
                      {section}
                    </button>
                  ))}
                </div>
              </div>

              {/* Editor Area */}
              <div className="flex-1 flex flex-col">
                {/* Toolbar */}
                <div className={cn("flex items-center gap-2 px-4 py-2 border-b", isDark ? "border-slate-700" : "border-slate-200")}>
                  <button className={cn("p-2 rounded", isDark ? "hover:bg-slate-700" : "hover:bg-slate-100")} title="Bold">
                    <span className="font-bold text-sm">B</span>
                  </button>
                  <button className={cn("p-2 rounded", isDark ? "hover:bg-slate-700" : "hover:bg-slate-100")} title="Italic">
                    <span className="italic text-sm">I</span>
                  </button>
                  <button className={cn("p-2 rounded", isDark ? "hover:bg-slate-700" : "hover:bg-slate-100")} title="Underline">
                    <span className="underline text-sm">U</span>
                  </button>
                  <div className={cn("w-px h-6 mx-2", isDark ? "bg-slate-700" : "bg-slate-200")} />
                  <select
                    className={cn(
                      "px-2 py-1 rounded text-sm",
                      isDark ? "bg-slate-700 border-slate-600" : "bg-slate-100 border-slate-200"
                    )}
                  >
                    <option>Paragraph</option>
                    <option>Heading 1</option>
                    <option>Heading 2</option>
                    <option>Heading 3</option>
                  </select>
                  <div className={cn("w-px h-6 mx-2", isDark ? "bg-slate-700" : "bg-slate-200")} />
                  <select
                    className={cn(
                      "px-2 py-1 rounded text-sm",
                      isDark ? "bg-slate-700 border-slate-600" : "bg-slate-100 border-slate-200"
                    )}
                  >
                    <option>Insert Merge Field...</option>
                    {mergeFields.flatMap(g => g.fields).map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                {/* Editor Textarea */}
                <div className="flex-1 p-4 overflow-y-auto">
                  <div
                    className={cn(
                      "max-w-3xl mx-auto p-8 rounded-lg border min-h-full",
                      isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"
                    )}
                  >
                    <h2 className="text-xl font-bold text-center mb-6">
                      PROVIDER PARTICIPATION AGREEMENT
                    </h2>
                    
                    <p className="mb-4">
                      This Participation Agreement ("Agreement") is entered into by and between{" "}
                      <code className="text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-1 rounded">{"{{network_name}}"}</code>{" "}
                      ("Network") and{" "}
                      <code className="text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-1 rounded">{"{{provider_name}}"}</code>{" "}
                      ("Provider"), with an effective date of{" "}
                      <code className="text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-1 rounded">{"{{effective_date}}"}</code>.
                    </p>

                    <h3 className="text-lg font-semibold mt-6 mb-3">1. PROVIDER INFORMATION</h3>
                    <p className="mb-4">
                      Provider Name:{" "}
                      <code className="text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-1 rounded">{"{{provider_name}}"}</code>
                      <br />
                      NPI:{" "}
                      <code className="text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-1 rounded">{"{{provider_npi}}"}</code>
                      <br />
                      Specialty:{" "}
                      <code className="text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-1 rounded">{"{{provider_specialty}}"}</code>
                      <br />
                      State License:{" "}
                      <code className="text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-1 rounded">{"{{provider_license}}"}</code>
                    </p>

                    <h3 className="text-lg font-semibold mt-6 mb-3">2. CREDENTIALING REQUIREMENTS</h3>
                    <p className="mb-4">
                      Provider agrees to maintain all licenses, certifications, and credentials required for the practice of medicine in the state(s) where services are provided. Provider shall notify Network within 10 business days of any change in credentialing status...
                    </p>

                    <h3 className="text-lg font-semibold mt-6 mb-3">3. FEE SCHEDULE</h3>
                    <p className="mb-4">
                      Provider shall be reimbursed according to the fee schedule attached hereto as{" "}
                      <strong>Exhibit A</strong>:{" "}
                      <code className="text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-1 rounded">{"{{rate_schedule}}"}</code>
                    </p>

                    <p className={cn("text-sm mt-8 text-center", isDark ? "text-slate-500" : "text-slate-400")}>
                      [Continue editing template content...]
                    </p>
                  </div>
                </div>
              </div>

              {/* Properties Panel */}
              <div
                className={cn(
                  "w-64 border-l overflow-y-auto p-4",
                  isDark ? "border-slate-700 bg-slate-800/50" : "border-slate-200 bg-slate-50"
                )}
              >
                <label className={cn("text-xs font-medium uppercase", isDark ? "text-slate-500" : "text-slate-400")}>
                  Properties
                </label>

                <div className="mt-4 space-y-4">
                  <div>
                    <label className={cn("block text-sm font-medium mb-1", isDark ? "text-slate-300" : "text-slate-700")}>
                      Template Name
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedTemplate.name}
                      className={cn(
                        "w-full px-3 py-2 rounded-lg border text-sm",
                        isDark
                          ? "bg-slate-900 border-slate-700 text-white"
                          : "bg-white border-slate-300 text-slate-900"
                      )}
                    />
                  </div>

                  <div>
                    <label className={cn("block text-sm font-medium mb-1", isDark ? "text-slate-300" : "text-slate-700")}>
                      Type
                    </label>
                    <select
                      defaultValue={selectedTemplate.type}
                      className={cn(
                        "w-full px-3 py-2 rounded-lg border text-sm",
                        isDark
                          ? "bg-slate-900 border-slate-700 text-white"
                          : "bg-white border-slate-300 text-slate-900"
                      )}
                    >
                      <option value="individual">Individual</option>
                      <option value="group">Group Practice</option>
                      <option value="facility">Facility</option>
                      <option value="allied">Allied Health</option>
                      <option value="ancillary">Ancillary</option>
                    </select>
                  </div>

                  <div>
                    <label className={cn("block text-sm font-medium mb-1", isDark ? "text-slate-300" : "text-slate-700")}>
                      Version
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedTemplate.version}
                      className={cn(
                        "w-full px-3 py-2 rounded-lg border text-sm",
                        isDark
                          ? "bg-slate-900 border-slate-700 text-white"
                          : "bg-white border-slate-300 text-slate-900"
                      )}
                    />
                  </div>

                  <div>
                    <label className={cn("block text-sm font-medium mb-1", isDark ? "text-slate-300" : "text-slate-700")}>
                      Status
                    </label>
                    <select
                      defaultValue={selectedTemplate.status}
                      className={cn(
                        "w-full px-3 py-2 rounded-lg border text-sm",
                        isDark
                          ? "bg-slate-900 border-slate-700 text-white"
                          : "bg-white border-slate-300 text-slate-900"
                      )}
                    >
                      <option value="active">Active</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div>
                    <label className={cn("block text-sm font-medium mb-1", isDark ? "text-slate-300" : "text-slate-700")}>
                      Default Term Length
                    </label>
                    <select
                      defaultValue="3"
                      className={cn(
                        "w-full px-3 py-2 rounded-lg border text-sm",
                        isDark
                          ? "bg-slate-900 border-slate-700 text-white"
                          : "bg-white border-slate-300 text-slate-900"
                      )}
                    >
                      <option value="1">1 Year</option>
                      <option value="2">2 Years</option>
                      <option value="3">3 Years</option>
                      <option value="5">5 Years</option>
                    </select>
                  </div>

                  <div className="pt-4 border-t" style={{ borderColor: isDark ? '#334155' : '#e2e8f0' }}>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                      <span className="text-sm">Auto-renew by default</span>
                    </label>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                      <span className="text-sm">Require e-signature</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Template Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div
            className={cn(
              "w-full max-w-lg rounded-xl shadow-xl",
              isDark ? "bg-slate-800" : "bg-white"
            )}
          >
            <div className={cn("flex items-center justify-between p-4 border-b", isDark ? "border-slate-700" : "border-slate-200")}>
              <h2 className="text-lg font-semibold">Create New Template</h2>
              <button
                onClick={() => setShowNewModal(false)}
                className={cn("p-2 rounded-lg", isDark ? "hover:bg-slate-700" : "hover:bg-slate-100")}
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className={cn("block text-sm font-medium mb-1", isDark ? "text-slate-300" : "text-slate-700")}>
                  Template Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Specialist Physician Agreement"
                  className={cn(
                    "w-full px-4 py-2 rounded-lg border text-sm",
                    isDark
                      ? "bg-slate-900 border-slate-700 text-white"
                      : "bg-white border-slate-300 text-slate-900"
                  )}
                />
              </div>

              <div>
                <label className={cn("block text-sm font-medium mb-1", isDark ? "text-slate-300" : "text-slate-700")}>
                  Type *
                </label>
                <select
                  className={cn(
                    "w-full px-4 py-2 rounded-lg border text-sm",
                    isDark
                      ? "bg-slate-900 border-slate-700 text-white"
                      : "bg-white border-slate-300 text-slate-900"
                  )}
                >
                  <option value="">Select type...</option>
                  <option value="individual">Individual Provider</option>
                  <option value="group">Group Practice</option>
                  <option value="facility">Facility</option>
                  <option value="allied">Allied Health</option>
                  <option value="ancillary">Ancillary Services</option>
                </select>
              </div>

              <div>
                <label className={cn("block text-sm font-medium mb-1", isDark ? "text-slate-300" : "text-slate-700")}>
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe when this template should be used..."
                  className={cn(
                    "w-full px-4 py-2 rounded-lg border text-sm",
                    isDark
                      ? "bg-slate-900 border-slate-700 text-white"
                      : "bg-white border-slate-300 text-slate-900"
                  )}
                />
              </div>

              <div>
                <label className={cn("block text-sm font-medium mb-2", isDark ? "text-slate-300" : "text-slate-700")}>
                  Start From
                </label>
                <div className="space-y-2">
                  <label className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border cursor-pointer",
                    isDark ? "border-slate-700 hover:border-slate-600" : "border-slate-200 hover:border-slate-300"
                  )}>
                    <input type="radio" name="start" defaultChecked className="w-4 h-4" />
                    <div>
                      <p className="font-medium">Blank Template</p>
                      <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                        Start from scratch with standard sections
                      </p>
                    </div>
                  </label>
                  <label className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border cursor-pointer",
                    isDark ? "border-slate-700 hover:border-slate-600" : "border-slate-200 hover:border-slate-300"
                  )}>
                    <input type="radio" name="start" className="w-4 h-4" />
                    <div>
                      <p className="font-medium">Copy Existing Template</p>
                      <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                        Duplicate and modify an existing template
                      </p>
                    </div>
                  </label>
                  <label className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border cursor-pointer",
                    isDark ? "border-slate-700 hover:border-slate-600" : "border-slate-200 hover:border-slate-300"
                  )}>
                    <input type="radio" name="start" className="w-4 h-4" />
                    <div>
                      <p className="font-medium">Upload Document</p>
                      <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                        Import from Word or PDF document
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className={cn("flex items-center justify-end gap-3 p-4 border-t", isDark ? "border-slate-700" : "border-slate-200")}>
              <Button variant="secondary" onClick={() => setShowNewModal(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                setShowNewModal(false);
                setShowEditor(true);
              }}>
                Create Template
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
