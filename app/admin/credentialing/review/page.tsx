"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  FileText,
  ChevronLeft,
  User,
  Shield,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  ExternalLink,
  Download,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/admin/ThemeContext";
import { StatCard } from "@/components/admin/ui/StatCard";
import { Badge } from "@/components/admin/ui/Badge";
import { Button } from "@/components/admin/ui/Button";
import { cn } from "@/lib/utils";

const reviewQueue = [
  {
    id: "CRED-2024-1246",
    provider: "Dr. James Wilson",
    practice: "Wilson Orthopedics",
    npi: "2345678901",
    specialty: "Orthopedics",
    type: "initial",
    submitted: "2024-03-08",
    verifications: {
      nppes: { status: "passed", verifiedAt: "2024-03-10" },
      oig: { status: "passed", verifiedAt: "2024-03-10" },
      sam: { status: "passed", verifiedAt: "2024-03-10" },
      license: { status: "passed", verifiedAt: "2024-03-11", expires: "2026-08-31" },
      dea: { status: "passed", verifiedAt: "2024-03-11", expires: "2025-09-30" },
      boardCert: { status: "passed", verifiedAt: "2024-03-11" },
      malpractice: { status: "passed", verifiedAt: "2024-03-12", coverage: "$1M/$3M" },
    },
    documents: ["license", "dea", "board_cert", "malpractice_coi", "cv", "w9"],
    flags: [],
    recommendation: "approve",
  },
  {
    id: "CRED-2024-1240",
    provider: "Westlake Surgery Center",
    practice: "Westlake Surgery Center",
    npi: "8901234567",
    specialty: "Ambulatory Surgery",
    type: "initial",
    submitted: "2024-02-15",
    verifications: {
      nppes: { status: "passed", verifiedAt: "2024-02-18" },
      oig: { status: "passed", verifiedAt: "2024-02-18" },
      sam: { status: "passed", verifiedAt: "2024-02-18" },
      license: { status: "passed", verifiedAt: "2024-02-19", expires: "2025-06-30" },
      accreditation: { status: "passed", verifiedAt: "2024-02-20", body: "AAAHC" },
      malpractice: { status: "passed", verifiedAt: "2024-02-20", coverage: "$1M/$3M" },
    },
    documents: ["license", "accreditation", "malpractice_coi", "w9"],
    flags: [],
    recommendation: "approve",
  },
  {
    id: "CRED-2024-1238",
    provider: "Dr. Michael Brown",
    practice: "Brown Medical Associates",
    npi: "1122334455",
    specialty: "Internal Medicine",
    type: "initial",
    submitted: "2024-02-10",
    verifications: {
      nppes: { status: "passed", verifiedAt: "2024-02-12" },
      oig: { status: "failed", verifiedAt: "2024-02-12", reason: "Exclusion found" },
      sam: { status: "passed", verifiedAt: "2024-02-12" },
      license: { status: "passed", verifiedAt: "2024-02-13", expires: "2026-12-31" },
      dea: { status: "passed", verifiedAt: "2024-02-13", expires: "2025-06-30" },
      malpractice: { status: "passed", verifiedAt: "2024-02-14", coverage: "$1M/$3M" },
    },
    documents: ["license", "dea", "malpractice_coi", "cv", "w9"],
    flags: ["OIG Exclusion Found - Immediate Review Required"],
    recommendation: "deny",
  },
  {
    id: "CRED-2024-1235",
    provider: "Dr. Sarah Chen",
    practice: "Lakeside Family Medicine",
    npi: "5566778899",
    specialty: "Family Medicine",
    type: "recredential",
    submitted: "2024-02-05",
    verifications: {
      nppes: { status: "passed", verifiedAt: "2024-02-07" },
      oig: { status: "passed", verifiedAt: "2024-02-07" },
      sam: { status: "passed", verifiedAt: "2024-02-07" },
      license: { status: "warning", verifiedAt: "2024-02-08", expires: "2024-04-15", reason: "Expires in 45 days" },
      dea: { status: "passed", verifiedAt: "2024-02-08", expires: "2025-12-31" },
      boardCert: { status: "passed", verifiedAt: "2024-02-08" },
      malpractice: { status: "passed", verifiedAt: "2024-02-09", coverage: "$1M/$3M" },
    },
    documents: ["license", "dea", "board_cert", "malpractice_coi", "w9"],
    flags: ["License expires in 45 days"],
    recommendation: "approve_conditions",
  },
];

const stats = [
  { label: "Ready for Review", value: "12", trend: "warning" as const, change: "Awaiting decision", icon: <Eye className="w-5 h-5" /> },
  { label: "Flagged for MD", value: "3", trend: "warning" as const, change: "Critical issues", icon: <AlertTriangle className="w-5 h-5" /> },
  { label: "Approved Today", value: "5", trend: "up" as const, change: "This session", icon: <CheckCircle className="w-5 h-5" /> },
  { label: "Avg. Review Time", value: "4 min", trend: "up" as const, change: "-1 min", icon: <Clock className="w-5 h-5" /> },
];

const getVerificationIcon = (status: string) => {
  switch (status) {
    case "passed":
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case "failed":
      return <XCircle className="w-4 h-4 text-red-500" />;
    case "warning":
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    default:
      return <Clock className="w-4 h-4 text-slate-400" />;
  }
};

const getRecommendationBadge = (rec: string) => {
  switch (rec) {
    case "approve":
      return <Badge variant="success">Recommend: Approve</Badge>;
    case "approve_conditions":
      return <Badge variant="warning">Recommend: Approve with Conditions</Badge>;
    case "deny":
      return <Badge variant="error">Recommend: Deny</Badge>;
    default:
      return <Badge variant="default">Needs Review</Badge>;
  }
};

export default function ReviewQueuePage() {
  const { isDark } = useTheme();
  const [selectedApplication, setSelectedApplication] = useState<typeof reviewQueue[0] | null>(null);
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [decision, setDecision] = useState<string>("");
  const [decisionNotes, setDecisionNotes] = useState("");

  const handleDecision = (type: string) => {
    setDecision(type);
    setShowDecisionModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/credentialing">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>
              Committee Review Queue
            </h1>
            <p className={cn("text-sm mt-1", isDark ? "text-slate-400" : "text-slate-500")}>
              Review and approve credentialing applications
            </p>
          </div>
        </div>
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

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Queue List */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-slate-900")}>
            Applications ({reviewQueue.length})
          </h2>
          {reviewQueue.map((app) => (
            <div
              key={app.id}
              onClick={() => setSelectedApplication(app)}
              className={cn(
                "p-4 rounded-xl border cursor-pointer transition-all",
                selectedApplication?.id === app.id
                  ? isDark
                    ? "bg-cyan-900/30 border-cyan-700"
                    : "bg-cyan-50 border-cyan-300"
                  : isDark
                  ? "bg-slate-800 border-slate-700 hover:border-slate-600"
                  : "bg-white border-slate-200 hover:border-slate-300"
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>
                    {app.provider}
                  </p>
                  <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                    {app.specialty}
                  </p>
                </div>
                <ChevronRight className={cn("w-5 h-5", isDark ? "text-slate-500" : "text-slate-400")} />
              </div>
              <div className="flex items-center gap-2">
                {getRecommendationBadge(app.recommendation)}
              </div>
              {app.flags.length > 0 && (
                <div className="mt-2 flex items-center gap-1 text-red-500 text-xs">
                  <AlertTriangle className="w-3 h-3" />
                  {app.flags.length} flag(s)
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-2">
          {selectedApplication ? (
            <div className={cn(
              "rounded-xl border p-6",
              isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
            )}>
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className={cn("text-xl font-semibold", isDark ? "text-white" : "text-slate-900")}>
                    {selectedApplication.provider}
                  </h2>
                  <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                    {selectedApplication.practice} • {selectedApplication.id}
                  </p>
                  <p className={cn("text-sm mt-1", isDark ? "text-slate-500" : "text-slate-400")}>
                    NPI: {selectedApplication.npi} • {selectedApplication.specialty}
                  </p>
                </div>
                <div>
                  {getRecommendationBadge(selectedApplication.recommendation)}
                </div>
              </div>

              {/* Flags */}
              {selectedApplication.flags.length > 0 && (
                <div className="mb-6 p-4 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-medium mb-2">
                    <AlertTriangle className="w-5 h-5" />
                    Flags Requiring Attention
                  </div>
                  <ul className="list-disc list-inside text-sm text-red-600 dark:text-red-300">
                    {selectedApplication.flags.map((flag, i) => (
                      <li key={i}>{flag}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Verifications */}
              <div className="mb-6">
                <h3 className={cn("text-lg font-semibold mb-3", isDark ? "text-white" : "text-slate-900")}>
                  Verification Results
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(selectedApplication.verifications).map(([key, val]: [string, any]) => (
                    <div
                      key={key}
                      className={cn(
                        "p-3 rounded-lg flex items-center justify-between",
                        isDark ? "bg-slate-700/50" : "bg-slate-50"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {getVerificationIcon(val.status)}
                        <span className={cn("text-sm font-medium capitalize", isDark ? "text-white" : "text-slate-900")}>
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                      </div>
                      {val.expires && (
                        <span className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                          Exp: {val.expires}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Documents */}
              <div className="mb-6">
                <h3 className={cn("text-lg font-semibold mb-3", isDark ? "text-white" : "text-slate-900")}>
                  Documents on File
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedApplication.documents.map((doc) => (
                    <span
                      key={doc}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 cursor-pointer hover:opacity-80",
                        isDark ? "bg-slate-700 text-white" : "bg-slate-100 text-slate-700"
                      )}
                    >
                      <FileText className="w-4 h-4" />
                      {doc.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      <ExternalLink className="w-3 h-3 opacity-50" />
                    </span>
                  ))}
                </div>
              </div>

              {/* Decision Actions */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                <h3 className={cn("text-lg font-semibold mb-3", isDark ? "text-white" : "text-slate-900")}>
                  Committee Decision
                </h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary" onClick={() => handleDecision("approve")}>
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button variant="secondary" onClick={() => handleDecision("approve_conditions")}>
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Approve with Conditions
                  </Button>
                  <Button variant="secondary" onClick={() => handleDecision("request_info")}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Request More Info
                  </Button>
                  <Button variant="ghost" className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30" onClick={() => handleDecision("deny")}>
                    <ThumbsDown className="w-4 h-4 mr-2" />
                    Deny
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className={cn(
              "rounded-xl border p-12 text-center",
              isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
            )}>
              <Eye className={cn("w-12 h-12 mx-auto mb-4", isDark ? "text-slate-600" : "text-slate-300")} />
              <h3 className={cn("text-lg font-medium mb-2", isDark ? "text-white" : "text-slate-900")}>
                Select an Application
              </h3>
              <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                Click on an application from the queue to review details and make a decision.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Decision Modal */}
      <AnimatePresence>
        {showDecisionModal && selectedApplication && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDecisionModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={cn(
                "w-full max-w-md rounded-xl p-6",
                isDark ? "bg-slate-800" : "bg-white"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className={cn("text-xl font-semibold mb-4", isDark ? "text-white" : "text-slate-900")}>
                Confirm Decision: {decision.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </h2>

              <p className={cn("text-sm mb-4", isDark ? "text-slate-400" : "text-slate-500")}>
                You are about to {decision === "approve" ? "approve" : decision === "deny" ? "deny" : "update"} the application for{" "}
                <strong>{selectedApplication.provider}</strong>.
              </p>

              <div className="mb-4">
                <label className={cn("block text-sm font-medium mb-2", isDark ? "text-slate-300" : "text-slate-700")}>
                  Notes (required)
                </label>
                <textarea
                  value={decisionNotes}
                  onChange={(e) => setDecisionNotes(e.target.value)}
                  placeholder="Enter decision notes..."
                  rows={3}
                  className={cn(
                    "w-full px-3 py-2 rounded-lg border text-sm resize-none",
                    isDark ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400" : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
                  )}
                />
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => setShowDecisionModal(false)}>
                  Cancel
                </Button>
                <Button
                  variant={decision === "deny" ? "ghost" : "primary"}
                  className={cn("flex-1", decision === "deny" && "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30")}
                  disabled={!decisionNotes}
                >
                  Confirm {decision === "approve" ? "Approval" : decision === "deny" ? "Denial" : "Decision"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
