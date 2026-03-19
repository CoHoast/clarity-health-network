"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Send,
  Upload,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Mail,
  RefreshCw,
  Plus,
  X,
  ChevronLeft,
  Copy,
  Eye,
  FileText,
  Calendar,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/admin/ThemeContext";
import { StatCard } from "@/components/admin/ui/StatCard";
import { Badge } from "@/components/admin/ui/Badge";
import { Button, IconButton } from "@/components/admin/ui/Button";
import { SearchInput } from "@/components/admin/ui/SearchInput";
import { cn } from "@/lib/utils";

const documentRequests = [
  {
    id: "REQ-001",
    provider: "Dr. Sarah Mitchell",
    practice: "Cleveland Heart Center",
    email: "dr.mitchell@cardio.com",
    requested: "2024-03-14",
    expires: "2024-03-28",
    status: "partial",
    requestedDocs: ["license", "dea", "malpractice_coi", "board_cert", "w9"],
    uploadedDocs: ["license", "dea", "w9"],
    sentBy: "Jane Smith",
  },
  {
    id: "REQ-002",
    provider: "Dr. James Wilson",
    practice: "Wilson Orthopedics",
    email: "dr.wilson@ortho.com",
    requested: "2024-03-12",
    expires: "2024-03-26",
    status: "pending",
    requestedDocs: ["license", "malpractice_coi", "board_cert"],
    uploadedDocs: [],
    sentBy: "Jane Smith",
  },
  {
    id: "REQ-003",
    provider: "Cleveland PT Group",
    practice: "Cleveland Physical Therapy",
    email: "admin@clevelandpt.com",
    requested: "2024-03-10",
    expires: "2024-03-24",
    status: "complete",
    requestedDocs: ["license", "malpractice_coi", "w9"],
    uploadedDocs: ["license", "malpractice_coi", "w9"],
    sentBy: "Mike Johnson",
  },
  {
    id: "REQ-004",
    provider: "Dr. Emily Chen",
    practice: "Lakeside Pediatrics",
    email: "dr.chen@pediatrics.com",
    requested: "2024-03-08",
    expires: "2024-03-22",
    status: "expired",
    requestedDocs: ["license", "dea", "malpractice_coi"],
    uploadedDocs: ["license"],
    sentBy: "Jane Smith",
  },
];

const stats = [
  { label: "Active Requests", value: "12", trend: "neutral" as const, change: "Awaiting upload", icon: <Send className="w-5 h-5" /> },
  { label: "Partial Uploads", value: "5", trend: "warning" as const, change: "In progress", icon: <Clock className="w-5 h-5" /> },
  { label: "Completed", value: "34", trend: "up" as const, change: "This month", icon: <CheckCircle className="w-5 h-5" /> },
  { label: "Expired", value: "3", trend: "warning" as const, change: "Need follow-up", icon: <XCircle className="w-5 h-5" /> },
];

const documentTypes = [
  { value: "license", label: "State Medical License" },
  { value: "dea", label: "DEA Certificate" },
  { value: "board_cert", label: "Board Certification" },
  { value: "malpractice_coi", label: "Malpractice Insurance (COI)" },
  { value: "cv", label: "CV / Resume" },
  { value: "w9", label: "W-9" },
  { value: "attestation", label: "Attestation Form" },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "complete":
      return <Badge variant="success">Complete</Badge>;
    case "partial":
      return <Badge variant="warning">Partial</Badge>;
    case "pending":
      return <Badge variant="info">Pending</Badge>;
    case "expired":
      return <Badge variant="error">Expired</Badge>;
    default:
      return <Badge variant="default">{status}</Badge>;
  }
};

const getDocLabel = (doc: string) => {
  const found = documentTypes.find((d) => d.value === doc);
  return found ? found.label : doc;
};

export default function DocumentRequestsPage() {
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<typeof documentRequests[0] | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadTarget, setUploadTarget] = useState<typeof documentRequests[0] | null>(null);
  const [showReminderToast, setShowReminderToast] = useState(false);
  const [reminderSentTo, setReminderSentTo] = useState("");

  const handleSendReminder = (req: typeof documentRequests[0]) => {
    setReminderSentTo(req.provider);
    setShowReminderToast(true);
    setTimeout(() => setShowReminderToast(false), 3000);
  };

  const handleUploadManually = (req: typeof documentRequests[0]) => {
    setUploadTarget(req);
    setShowUploadModal(true);
  };

  // New request form state
  const [newRequest, setNewRequest] = useState({
    providerName: "",
    email: "",
    practice: "",
    selectedDocs: [] as string[],
    expiresIn: "14",
    customMessage: "",
  });

  const filteredRequests = documentRequests.filter((req) => {
    const matchesSearch =
      req.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.practice.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleDocSelection = (doc: string) => {
    setNewRequest((prev) => ({
      ...prev,
      selectedDocs: prev.selectedDocs.includes(doc)
        ? prev.selectedDocs.filter((d) => d !== doc)
        : [...prev.selectedDocs, doc],
    }));
  };

  const getProgress = (req: typeof documentRequests[0]) => {
    return Math.round((req.uploadedDocs.length / req.requestedDocs.length) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" icon={<ChevronLeft className="w-4 h-4" />} href="/admin/credentialing">
            Back
          </Button>
          <div>
            <h1 className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>
              Document Requests
            </h1>
            <p className={cn("text-sm mt-1", isDark ? "text-slate-400" : "text-slate-500")}>
              Request and track document uploads from providers
            </p>
          </div>
        </div>
        <Button 
          variant="primary" 
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setShowNewRequestModal(true)}
        >
          New Request
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            label={stat.label}
            value={stat.value}
            trend={stat.trend}
            change={stat.change}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Filters */}
      <div className={cn(
        "flex flex-col sm:flex-row gap-4 p-4 rounded-xl border",
        isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
      )}>
        <div className="flex-1">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by provider, practice, or email..."
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={cn(
            "px-3 py-2 rounded-lg border text-sm",
            isDark ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-200 text-slate-900"
          )}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="partial">Partial</option>
          <option value="complete">Complete</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((req) => (
          <div
            key={req.id}
            className={cn(
              "rounded-xl border p-6",
              isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
            )}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center",
                  isDark ? "bg-blue-900/50 text-blue-400" : "bg-blue-100 text-blue-600"
                )}>
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className={cn("font-semibold", isDark ? "text-white" : "text-slate-900")}>
                    {req.provider}
                  </h3>
                  <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                    {req.practice}
                  </p>
                  <p className={cn("text-sm", isDark ? "text-slate-500" : "text-slate-400")}>
                    {req.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(req.status)}
                <Button variant="ghost" size="sm" onClick={() => setSelectedRequest(req)}>
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className={cn("text-sm font-medium", isDark ? "text-slate-300" : "text-slate-600")}>
                  {req.uploadedDocs.length} of {req.requestedDocs.length} documents uploaded
                </span>
                <span className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                  {getProgress(req)}%
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                <div
                  className={cn(
                    "h-2 rounded-full transition-all",
                    req.status === "complete" ? "bg-green-500" : req.status === "expired" ? "bg-red-500" : "bg-blue-500"
                  )}
                  style={{ width: `${getProgress(req)}%` }}
                />
              </div>
            </div>

            {/* Document Status */}
            <div className="flex flex-wrap gap-2 mb-4">
              {req.requestedDocs.map((doc) => {
                const uploaded = req.uploadedDocs.includes(doc);
                return (
                  <span
                    key={doc}
                    className={cn(
                      "px-2 py-1 rounded text-xs font-medium flex items-center gap-1",
                      uploaded
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                    )}
                  >
                    {uploaded && <CheckCircle className="w-3 h-3" />}
                    {getDocLabel(doc)}
                  </span>
                );
              })}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-4">
                <span className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>
                  <Calendar className="w-3 h-3 inline mr-1" />
                  Sent: {new Date(req.requested).toLocaleDateString()}
                </span>
                <span className={cn(
                  "text-xs",
                  req.status === "expired" ? "text-red-500" : isDark ? "text-slate-500" : "text-slate-400"
                )}>
                  <Clock className="w-3 h-3 inline mr-1" />
                  Expires: {new Date(req.expires).toLocaleDateString()}
                </span>
                <span className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>
                  By: {req.sentBy}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {req.status === "pending" || req.status === "partial" ? (
                  <Button 
                    variant="secondary" 
                    size="sm"
                    icon={<Mail className="w-4 h-4" />}
                    onClick={() => handleSendReminder(req)}
                  >
                    Send Reminder
                  </Button>
                ) : req.status === "expired" ? (
                  <Button 
                    variant="secondary" 
                    size="sm"
                    icon={<RefreshCw className="w-4 h-4" />}
                    onClick={() => handleSendReminder(req)}
                  >
                    Resend Request
                  </Button>
                ) : null}
                <Button 
                  variant="secondary" 
                  size="sm"
                  icon={<Upload className="w-4 h-4" />}
                  onClick={() => handleUploadManually(req)}
                >
                  Upload Manually
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Request Modal */}
      <AnimatePresence>
        {showNewRequestModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowNewRequestModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={cn(
                "w-full max-w-lg rounded-xl p-6 max-h-[90vh] overflow-y-auto",
                isDark ? "bg-slate-800" : "bg-white"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className={cn("text-xl font-semibold", isDark ? "text-white" : "text-slate-900")}>
                  Request Documents from Provider
                </h2>
                <IconButton icon={<X className="w-5 h-5" />} onClick={() => setShowNewRequestModal(false)} />
              </div>

              <form className="space-y-4">
                <div>
                  <label className={cn("block text-sm font-medium mb-1", isDark ? "text-slate-300" : "text-slate-700")}>
                    Provider Name
                  </label>
                  <input
                    type="text"
                    value={newRequest.providerName}
                    onChange={(e) => setNewRequest((prev) => ({ ...prev, providerName: e.target.value }))}
                    placeholder="Dr. John Smith"
                    className={cn(
                      "w-full px-3 py-2 rounded-lg border text-sm",
                      isDark ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400" : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
                    )}
                  />
                </div>

                <div>
                  <label className={cn("block text-sm font-medium mb-1", isDark ? "text-slate-300" : "text-slate-700")}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={newRequest.email}
                    onChange={(e) => setNewRequest((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="provider@example.com"
                    className={cn(
                      "w-full px-3 py-2 rounded-lg border text-sm",
                      isDark ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400" : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
                    )}
                  />
                </div>

                <div>
                  <label className={cn("block text-sm font-medium mb-2", isDark ? "text-slate-300" : "text-slate-700")}>
                    Select Documents to Request
                  </label>
                  <div className="space-y-2">
                    {documentTypes.map((doc) => (
                      <label
                        key={doc.value}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                          newRequest.selectedDocs.includes(doc.value)
                            ? isDark
                              ? "bg-blue-900/30 border border-blue-700"
                              : "bg-blue-50 border border-blue-200"
                            : isDark
                            ? "bg-slate-700/50 border border-slate-600 hover:bg-slate-700"
                            : "bg-slate-50 border border-slate-200 hover:bg-slate-100"
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={newRequest.selectedDocs.includes(doc.value)}
                          onChange={() => toggleDocSelection(doc.value)}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className={cn("text-sm", isDark ? "text-white" : "text-slate-900")}>
                          {doc.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={cn("block text-sm font-medium mb-1", isDark ? "text-slate-300" : "text-slate-700")}>
                    Link Expires In
                  </label>
                  <select
                    value={newRequest.expiresIn}
                    onChange={(e) => setNewRequest((prev) => ({ ...prev, expiresIn: e.target.value }))}
                    className={cn(
                      "w-full px-3 py-2 rounded-lg border text-sm",
                      isDark ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-200 text-slate-900"
                    )}
                  >
                    <option value="7">7 days</option>
                    <option value="14">14 days</option>
                    <option value="30">30 days</option>
                  </select>
                </div>

                <div>
                  <label className={cn("block text-sm font-medium mb-1", isDark ? "text-slate-300" : "text-slate-700")}>
                    Custom Message (optional)
                  </label>
                  <textarea
                    value={newRequest.customMessage}
                    onChange={(e) => setNewRequest((prev) => ({ ...prev, customMessage: e.target.value }))}
                    placeholder="Please upload at your earliest convenience..."
                    rows={3}
                    className={cn(
                      "w-full px-3 py-2 rounded-lg border text-sm resize-none",
                      isDark ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400" : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
                    )}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="secondary" className="flex-1" onClick={() => setShowNewRequestModal(false)}>
                    Cancel
                  </Button>
                  <Button 
                    variant="primary" 
                    className="flex-1" 
                    icon={<Send className="w-4 h-4" />}
                    disabled={!newRequest.email || newRequest.selectedDocs.length === 0}
                    onClick={() => {
                      setShowNewRequestModal(false);
                      setReminderSentTo(newRequest.providerName || newRequest.email);
                      setShowReminderToast(true);
                      setTimeout(() => setShowReminderToast(false), 3000);
                    }}
                  >
                    Send Request
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Request Detail Modal */}
      <AnimatePresence>
        {selectedRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedRequest(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={cn(
                "w-full max-w-lg rounded-xl p-6",
                isDark ? "bg-slate-800" : "bg-white"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className={cn("text-xl font-semibold", isDark ? "text-white" : "text-slate-900")}>
                    {selectedRequest.provider}
                  </h2>
                  <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                    {selectedRequest.id}
                  </p>
                </div>
                <IconButton icon={<X className="w-5 h-5" />} onClick={() => setSelectedRequest(null)} />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {getStatusBadge(selectedRequest.status)}
                </div>

                <div className={cn("p-4 rounded-lg", isDark ? "bg-slate-700/50" : "bg-slate-50")}>
                  <p className={cn("text-xs uppercase tracking-wider mb-2", isDark ? "text-slate-400" : "text-slate-500")}>
                    Secure Upload Link
                  </p>
                  <div className="flex items-center gap-2">
                    <code className={cn(
                      "flex-1 px-3 py-2 rounded text-sm font-mono truncate",
                      isDark ? "bg-slate-800 text-blue-400" : "bg-white text-blue-600"
                    )}>
                      {typeof window !== 'undefined' ? `${window.location.origin}/upload/demo123` : `/upload/demo123`}
                    </code>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        const url = `${window.location.origin}/upload/demo123`;
                        navigator.clipboard.writeText(url);
                        // Could add toast notification here
                      }}
                      title="Copy link to clipboard"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className={cn("text-xs mt-2", isDark ? "text-slate-500" : "text-slate-400")}>
                    Share this link with the provider to upload documents
                  </p>
                </div>

                <div>
                  <p className={cn("text-xs uppercase tracking-wider mb-2", isDark ? "text-slate-400" : "text-slate-500")}>
                    Requested Documents
                  </p>
                  <div className="space-y-2">
                    {selectedRequest.requestedDocs.map((doc) => {
                      const uploaded = selectedRequest.uploadedDocs.includes(doc);
                      return (
                        <div
                          key={doc}
                          className={cn(
                            "flex items-center justify-between p-3 rounded-lg",
                            isDark ? "bg-slate-700/50" : "bg-slate-50"
                          )}
                        >
                          <span className={cn("text-sm", isDark ? "text-white" : "text-slate-900")}>
                            {getDocLabel(doc)}
                          </span>
                          {uploaded ? (
                            <span className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm">
                              <CheckCircle className="w-4 h-4" />
                              Uploaded
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-slate-400 text-sm">
                              <Clock className="w-4 h-4" />
                              Pending
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="flex-1"
                    icon={<Mail className="w-4 h-4" />}
                    onClick={() => {
                      handleSendReminder(selectedRequest);
                      setSelectedRequest(null);
                    }}
                  >
                    Resend Email
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="flex-1"
                    icon={<Upload className="w-4 h-4" />}
                    onClick={() => {
                      setSelectedRequest(null);
                      handleUploadManually(selectedRequest);
                    }}
                  >
                    Upload Manually
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Manually Modal */}
      <AnimatePresence>
        {showUploadModal && uploadTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowUploadModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={cn(
                "w-full max-w-lg rounded-xl p-6",
                isDark ? "bg-slate-800" : "bg-white"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className={cn("text-xl font-semibold", isDark ? "text-white" : "text-slate-900")}>
                    Upload Documents
                  </h2>
                  <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                    {uploadTarget.provider}
                  </p>
                </div>
                <IconButton icon={<X className="w-5 h-5" />} onClick={() => setShowUploadModal(false)} />
              </div>

              <div className={cn(
                "border-2 border-dashed rounded-xl p-8 text-center mb-6 cursor-pointer transition-colors",
                isDark 
                  ? "border-slate-600 hover:border-blue-500 hover:bg-slate-700/50" 
                  : "border-slate-300 hover:border-blue-500 hover:bg-blue-50"
              )}>
                <Upload className={cn("w-12 h-12 mx-auto mb-4", isDark ? "text-slate-500" : "text-slate-400")} />
                <p className={cn("font-medium mb-1", isDark ? "text-white" : "text-slate-900")}>
                  Drop files here or click to upload
                </p>
                <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                  PDF, JPG, PNG up to 10MB each
                </p>
                <input type="file" className="hidden" multiple accept=".pdf,.jpg,.jpeg,.png" />
              </div>

              <div className="space-y-2 mb-6">
                <p className={cn("text-sm font-medium", isDark ? "text-slate-300" : "text-slate-700")}>
                  Missing Documents:
                </p>
                <div className="space-y-2">
                  {uploadTarget.requestedDocs
                    .filter(doc => !uploadTarget.uploadedDocs.includes(doc))
                    .map((doc) => (
                      <div key={doc} className={cn(
                        "flex items-center justify-between p-3 rounded-lg",
                        isDark ? "bg-slate-700/50" : "bg-slate-50"
                      )}>
                        <span className={cn("text-sm", isDark ? "text-slate-300" : "text-slate-600")}>
                          {getDocLabel(doc)}
                        </span>
                        <span className="text-xs text-amber-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Pending
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => setShowUploadModal(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  className="flex-1" 
                  icon={<Upload className="w-4 h-4" />}
                  onClick={() => {
                    setShowUploadModal(false);
                    // Show success toast
                    setReminderSentTo("Documents uploaded for " + uploadTarget.provider);
                    setShowReminderToast(true);
                    setTimeout(() => setShowReminderToast(false), 3000);
                  }}
                >
                  Upload Files
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notifications */}
      <AnimatePresence>
        {showReminderToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50"
          >
            <CheckCircle className="w-5 h-5" />
            {reminderSentTo.includes("Documents") ? reminderSentTo : `Reminder sent to ${reminderSentTo}`}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
