"use client";

import { useState, useEffect } from "react";
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
  RefreshCw,
  Loader2,
  Building2,
  Calendar,
  Mail,
  Phone,
  MapPin,
  X,
  History,
  Send,
  UserCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/admin/ThemeContext";
import { StatCard } from "@/components/admin/ui/StatCard";
import { Badge } from "@/components/admin/ui/Badge";
import { Button, IconButton } from "@/components/admin/ui/Button";
import { cn } from "@/lib/utils";

// Sample document metadata with realistic content
const sampleDocuments: Record<string, { title: string; type: string; issuer: string; date: string; expires?: string; size: string }> = {
  license: {
    title: "Medical License",
    type: "PDF",
    issuer: "Ohio State Medical Board",
    date: "2024-01-15",
    expires: "2026-08-31",
    size: "245 KB",
  },
  dea: {
    title: "DEA Registration Certificate",
    type: "PDF",
    issuer: "U.S. Drug Enforcement Administration",
    date: "2023-09-01",
    expires: "2025-09-30",
    size: "189 KB",
  },
  board_cert: {
    title: "Board Certification",
    type: "PDF",
    issuer: "American Board of Medical Specialties",
    date: "2022-06-15",
    size: "312 KB",
  },
  malpractice_coi: {
    title: "Certificate of Insurance",
    type: "PDF",
    issuer: "Medical Protective Company",
    date: "2024-03-01",
    expires: "2025-03-01",
    size: "156 KB",
  },
  cv: {
    title: "Curriculum Vitae",
    type: "PDF",
    issuer: "Provider Submitted",
    date: "2024-03-08",
    size: "89 KB",
  },
  w9: {
    title: "W-9 Tax Form",
    type: "PDF",
    issuer: "Provider Submitted",
    date: "2024-03-08",
    size: "124 KB",
  },
  accreditation: {
    title: "Facility Accreditation",
    type: "PDF",
    issuer: "AAAHC",
    date: "2024-02-20",
    expires: "2027-02-20",
    size: "478 KB",
  },
};

// Document Viewer Modal Component
function DocumentViewerModal({
  document,
  docKey,
  providerName,
  onClose,
  isDark,
}: {
  document: typeof sampleDocuments[string];
  docKey: string;
  providerName: string;
  onClose: () => void;
  isDark: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={cn(
          "w-full max-w-4xl rounded-xl overflow-hidden max-h-[90vh] flex flex-col",
          isDark ? "bg-slate-800" : "bg-white"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={cn(
          "p-4 border-b flex items-center justify-between",
          isDark ? "border-slate-700" : "border-slate-200"
        )}>
          <div>
            <h3 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-slate-900")}>
              {document.title}
            </h3>
            <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
              {providerName} • {document.issuer}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" icon={<Download className="w-4 h-4" />}>
              Download
            </Button>
            <IconButton icon={<X className="w-5 h-5" />} onClick={onClose} />
          </div>
        </div>

        {/* Document Info Bar */}
        <div className={cn(
          "px-4 py-2 flex items-center gap-4 text-sm border-b",
          isDark ? "bg-slate-700/50 border-slate-700 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-600"
        )}>
          <span className="flex items-center gap-1">
            <FileText className="w-4 h-4" />
            {document.type}
          </span>
          <span>|</span>
          <span>Size: {document.size}</span>
          <span>|</span>
          <span>Uploaded: {new Date(document.date).toLocaleDateString()}</span>
          {document.expires && (
            <>
              <span>|</span>
              <span className="text-amber-600 dark:text-amber-400">
                Expires: {document.expires}
              </span>
            </>
          )}
        </div>

        {/* Document Preview Area */}
        <div className="flex-1 overflow-auto p-6 bg-slate-100 dark:bg-slate-900 min-h-[500px]">
          {/* Simulated Document */}
          <div className={cn(
            "max-w-2xl mx-auto rounded-lg shadow-lg p-8",
            isDark ? "bg-slate-800" : "bg-white"
          )}>
            {docKey === "license" && (
              <LicenseDocument providerName={providerName} isDark={isDark} />
            )}
            {docKey === "dea" && (
              <DEADocument providerName={providerName} isDark={isDark} />
            )}
            {docKey === "board_cert" && (
              <BoardCertDocument providerName={providerName} isDark={isDark} />
            )}
            {docKey === "malpractice_coi" && (
              <MalpracticeDocument providerName={providerName} isDark={isDark} />
            )}
            {docKey === "cv" && (
              <CVDocument providerName={providerName} isDark={isDark} />
            )}
            {docKey === "w9" && (
              <W9Document providerName={providerName} isDark={isDark} />
            )}
            {docKey === "accreditation" && (
              <AccreditationDocument providerName={providerName} isDark={isDark} />
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Sample Document Components
function LicenseDocument({ providerName, isDark }: { providerName: string; isDark: boolean }) {
  return (
    <div className="text-center space-y-6">
      <div className={cn("border-b-2 pb-4", isDark ? "border-blue-500" : "border-blue-600")}>
        <div className="flex justify-center mb-2">
          <Shield className="w-12 h-12 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-blue-800 dark:text-blue-400">STATE OF OHIO</h2>
        <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300">STATE MEDICAL BOARD</h3>
      </div>
      <div className="py-4">
        <p className={cn("text-sm uppercase tracking-wider mb-2", isDark ? "text-slate-400" : "text-slate-500")}>
          License to Practice Medicine
        </p>
        <p className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>
          {providerName}
        </p>
        <p className={cn("text-lg mt-2", isDark ? "text-slate-300" : "text-slate-600")}>
          is hereby licensed to practice Medicine and Surgery
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className={cn("p-3 rounded", isDark ? "bg-slate-700/50" : "bg-slate-50")}>
          <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>License Number</p>
          <p className={cn("font-mono font-bold", isDark ? "text-white" : "text-slate-900")}>35-087654</p>
        </div>
        <div className={cn("p-3 rounded", isDark ? "bg-slate-700/50" : "bg-slate-50")}>
          <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Expiration Date</p>
          <p className={cn("font-bold", isDark ? "text-white" : "text-slate-900")}>August 31, 2026</p>
        </div>
      </div>
      <div className={cn("mt-6 pt-4 border-t text-xs", isDark ? "border-slate-700 text-slate-400" : "border-slate-200 text-slate-500")}>
        <p>Issued: January 15, 2024 • Columbus, Ohio</p>
        <p className="mt-1 italic">This license must be renewed biennially</p>
      </div>
    </div>
  );
}

function DEADocument({ providerName, isDark }: { providerName: string; isDark: boolean }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4 border-slate-200 dark:border-slate-700">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">U.S. DEPARTMENT OF JUSTICE</h2>
          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">Drug Enforcement Administration</h3>
        </div>
        <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
          <Shield className="w-8 h-8 text-amber-600" />
        </div>
      </div>
      <div className="text-center py-4">
        <p className={cn("text-sm font-semibold uppercase tracking-wider", isDark ? "text-blue-400" : "text-blue-600")}>
          DEA Registration Certificate
        </p>
        <p className={cn("text-xl font-bold mt-2", isDark ? "text-white" : "text-slate-900")}>{providerName}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className={cn("p-3 rounded", isDark ? "bg-slate-700/50" : "bg-slate-50")}>
          <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>DEA Number</p>
          <p className={cn("font-mono font-bold", isDark ? "text-white" : "text-slate-900")}>BW1234567</p>
        </div>
        <div className={cn("p-3 rounded", isDark ? "bg-slate-700/50" : "bg-slate-50")}>
          <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Schedules</p>
          <p className={cn("font-bold", isDark ? "text-white" : "text-slate-900")}>2, 2N, 3, 3N, 4, 5</p>
        </div>
        <div className={cn("p-3 rounded", isDark ? "bg-slate-700/50" : "bg-slate-50")}>
          <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Business Activity</p>
          <p className={cn("font-bold", isDark ? "text-white" : "text-slate-900")}>Practitioner</p>
        </div>
        <div className={cn("p-3 rounded", isDark ? "bg-slate-700/50" : "bg-slate-50")}>
          <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Expiration</p>
          <p className={cn("font-bold", isDark ? "text-white" : "text-slate-900")}>September 30, 2025</p>
        </div>
      </div>
    </div>
  );
}

function BoardCertDocument({ providerName, isDark }: { providerName: string; isDark: boolean }) {
  return (
    <div className="text-center space-y-6">
      <div className="border-b-2 border-green-600 pb-4">
        <h2 className="text-xl font-bold text-green-800 dark:text-green-400">AMERICAN BOARD OF MEDICAL SPECIALTIES</h2>
      </div>
      <div className="py-6">
        <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>This is to certify that</p>
        <p className={cn("text-2xl font-bold my-3", isDark ? "text-white" : "text-slate-900")}>{providerName}</p>
        <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
          having completed the prescribed requirements, is hereby certified by the
        </p>
        <p className={cn("text-lg font-semibold text-green-700 dark:text-green-400 mt-2", isDark ? "text-green-400" : "text-green-700")}>
          American Board of Orthopedic Surgery
        </p>
      </div>
      <div className={cn("p-4 rounded", isDark ? "bg-slate-700/50" : "bg-slate-50")}>
        <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Certificate Number</p>
        <p className={cn("font-mono font-bold", isDark ? "text-white" : "text-slate-900")}>ABOS-2022-087654</p>
      </div>
      <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
        Certified: June 15, 2022 • Valid through participation in MOC Program
      </p>
    </div>
  );
}

function MalpracticeDocument({ providerName, isDark }: { providerName: string; isDark: boolean }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4 border-slate-200 dark:border-slate-700">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">MEDICAL PROTECTIVE COMPANY</h2>
          <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>A Berkshire Hathaway Company</p>
        </div>
        <Badge variant="success">Active Coverage</Badge>
      </div>
      <div className="text-center py-2">
        <p className={cn("text-lg font-semibold uppercase", isDark ? "text-blue-400" : "text-blue-600")}>
          Certificate of Insurance
        </p>
      </div>
      <div className={cn("p-4 rounded", isDark ? "bg-slate-700/50" : "bg-slate-50")}>
        <p className={cn("text-sm mb-1", isDark ? "text-slate-400" : "text-slate-500")}>Named Insured</p>
        <p className={cn("font-bold", isDark ? "text-white" : "text-slate-900")}>{providerName}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className={cn("p-3 rounded", isDark ? "bg-slate-700/50" : "bg-slate-50")}>
          <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Policy Number</p>
          <p className={cn("font-mono font-bold", isDark ? "text-white" : "text-slate-900")}>MPL-2024-789012</p>
        </div>
        <div className={cn("p-3 rounded", isDark ? "bg-slate-700/50" : "bg-slate-50")}>
          <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Coverage Type</p>
          <p className={cn("font-bold", isDark ? "text-white" : "text-slate-900")}>Claims-Made</p>
        </div>
        <div className={cn("p-3 rounded", isDark ? "bg-slate-700/50" : "bg-slate-50")}>
          <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Per Claim / Aggregate</p>
          <p className={cn("font-bold text-green-600", isDark ? "text-green-400" : "text-green-600")}>$1,000,000 / $3,000,000</p>
        </div>
        <div className={cn("p-3 rounded", isDark ? "bg-slate-700/50" : "bg-slate-50")}>
          <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Policy Period</p>
          <p className={cn("font-bold", isDark ? "text-white" : "text-slate-900")}>03/01/24 - 03/01/25</p>
        </div>
      </div>
    </div>
  );
}

function CVDocument({ providerName, isDark }: { providerName: string; isDark: boolean }) {
  return (
    <div className="space-y-6">
      <div className="text-center border-b pb-4 border-slate-200 dark:border-slate-700">
        <h1 className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>{providerName}</h1>
        <p className={cn("text-sm mt-1", isDark ? "text-slate-400" : "text-slate-500")}>
          Board Certified Orthopedic Surgeon
        </p>
      </div>
      <div>
        <h3 className={cn("font-semibold border-b pb-1 mb-2", isDark ? "text-blue-400 border-blue-800" : "text-blue-600 border-blue-200")}>
          Education
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className={isDark ? "text-slate-300" : "text-slate-700"}>Ohio State University College of Medicine</span>
            <span className={isDark ? "text-slate-400" : "text-slate-500"}>2008-2012</span>
          </div>
          <div className="flex justify-between">
            <span className={isDark ? "text-slate-300" : "text-slate-700"}>Residency - Cleveland Clinic</span>
            <span className={isDark ? "text-slate-400" : "text-slate-500"}>2012-2017</span>
          </div>
          <div className="flex justify-between">
            <span className={isDark ? "text-slate-300" : "text-slate-700"}>Fellowship - Sports Medicine</span>
            <span className={isDark ? "text-slate-400" : "text-slate-500"}>2017-2018</span>
          </div>
        </div>
      </div>
      <div>
        <h3 className={cn("font-semibold border-b pb-1 mb-2", isDark ? "text-blue-400 border-blue-800" : "text-blue-600 border-blue-200")}>
          Work History
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className={isDark ? "text-slate-300" : "text-slate-700"}>Wilson Orthopedics - Founder</span>
            <span className={isDark ? "text-slate-400" : "text-slate-500"}>2018-Present</span>
          </div>
        </div>
      </div>
      <div>
        <h3 className={cn("font-semibold border-b pb-1 mb-2", isDark ? "text-blue-400 border-blue-800" : "text-blue-600 border-blue-200")}>
          Certifications
        </h3>
        <ul className={cn("text-sm space-y-1", isDark ? "text-slate-300" : "text-slate-700")}>
          <li>• American Board of Orthopedic Surgery</li>
          <li>• BLS/ACLS Certified</li>
          <li>• Ohio Medical License #35-087654</li>
        </ul>
      </div>
    </div>
  );
}

function W9Document({ providerName, isDark }: { providerName: string; isDark: boolean }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={cn("text-lg font-bold", isDark ? "text-white" : "text-slate-900")}>Form W-9</h2>
          <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Request for Taxpayer Identification Number</p>
        </div>
        <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Rev. October 2018</p>
      </div>
      <div className={cn("border-t border-b py-4", isDark ? "border-slate-700" : "border-slate-200")}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Name</p>
            <p className={cn("font-bold", isDark ? "text-white" : "text-slate-900")}>{providerName}</p>
          </div>
          <div>
            <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Business Name</p>
            <p className={cn("font-bold", isDark ? "text-white" : "text-slate-900")}>Wilson Orthopedics LLC</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className={cn("p-3 rounded", isDark ? "bg-slate-700/50" : "bg-slate-50")}>
          <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Federal Tax Classification</p>
          <p className={cn("font-bold", isDark ? "text-white" : "text-slate-900")}>Limited Liability Company (S)</p>
        </div>
        <div className={cn("p-3 rounded", isDark ? "bg-slate-700/50" : "bg-slate-50")}>
          <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>TIN (masked)</p>
          <p className={cn("font-mono font-bold", isDark ? "text-white" : "text-slate-900")}>**-***4567</p>
        </div>
      </div>
      <div className={cn("text-xs text-center pt-4", isDark ? "text-slate-400" : "text-slate-500")}>
        Signed and dated: March 8, 2024
      </div>
    </div>
  );
}

function AccreditationDocument({ providerName, isDark }: { providerName: string; isDark: boolean }) {
  return (
    <div className="text-center space-y-6">
      <div className="border-b-2 border-purple-600 pb-4">
        <h2 className="text-xl font-bold text-purple-800 dark:text-purple-400">AAAHC</h2>
        <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
          Accreditation Association for Ambulatory Health Care
        </p>
      </div>
      <div className="py-6">
        <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>This certifies that</p>
        <p className={cn("text-2xl font-bold my-3", isDark ? "text-white" : "text-slate-900")}>{providerName}</p>
        <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
          has achieved AAAHC accreditation and demonstrated compliance with nationally recognized standards
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className={cn("p-3 rounded", isDark ? "bg-slate-700/50" : "bg-slate-50")}>
          <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Certificate Number</p>
          <p className={cn("font-mono font-bold", isDark ? "text-white" : "text-slate-900")}>AAAHC-2024-12345</p>
        </div>
        <div className={cn("p-3 rounded", isDark ? "bg-slate-700/50" : "bg-slate-50")}>
          <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Accreditation Term</p>
          <p className={cn("font-bold", isDark ? "text-white" : "text-slate-900")}>3 Years</p>
        </div>
      </div>
      <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
        Effective: February 20, 2024 through February 20, 2027
      </p>
    </div>
  );
}

// Live Verification Display Component
function LiveVerificationDisplay({ results, isDark }: { results: Record<string, unknown>; isDark: boolean }) {
  const summary = results.summary as { passed: number; failed: number; needsReview: number; recommendation: string } | undefined;
  
  if (!summary) return null;

  return (
    <div className={cn(
      "p-4 rounded-lg border mt-4",
      isDark ? "bg-slate-700/30 border-blue-700" : "bg-blue-50 border-blue-200"
    )}>
      <h4 className={cn("font-semibold mb-3 flex items-center gap-2", isDark ? "text-blue-400" : "text-blue-700")}>
        <Shield className="w-4 h-4" />
        Live Verification Results
      </h4>
      <div className="grid grid-cols-3 gap-4 text-center mb-3">
        <div>
          <p className="text-2xl font-bold text-green-600">{summary.passed}</p>
          <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Passed</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-red-600">{summary.failed}</p>
          <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Failed</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-yellow-600">{summary.needsReview}</p>
          <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Review</p>
        </div>
      </div>
      <Badge variant={
        summary.recommendation === 'AUTO_APPROVE' ? 'success' :
        summary.recommendation === 'AUTO_DENY' ? 'error' : 'warning'
      }>
        {summary.recommendation?.replace(/_/g, ' ')}
      </Badge>
    </div>
  );
}

// Types
interface Verification {
  status: string;
  verifiedAt: string;
  expires?: string;
  coverage?: string;
  body?: string;
  reason?: string;
}

interface Application {
  id: string;
  provider: string;
  practice: string;
  npi: string;
  specialty: string;
  type: string;
  submitted: string;
  email: string;
  phone: string;
  address: string;
  verifications: Record<string, Verification>;
  documents: string[];
  flags: string[];
  recommendation: string;
  status: string;
  decisionHistory?: Decision[];
}

interface Decision {
  id: string;
  decision: string;
  notes: string;
  decidedBy: string;
  decidedAt: string;
  conditions?: string;
}

// Initial mock data
const initialReviewQueue: Application[] = [
  {
    id: "CRED-2024-1246",
    provider: "Dr. James Wilson",
    practice: "Wilson Orthopedics",
    npi: "2345678901",
    specialty: "Orthopedics",
    type: "initial",
    submitted: "2024-03-08",
    email: "dr.wilson@wilsonortho.com",
    phone: "(555) 234-5678",
    address: "200 Bone & Joint Blvd, Lakewood, OH 44107",
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
    status: "pending",
    decisionHistory: [],
  },
  {
    id: "CRED-2024-1240",
    provider: "Westlake Surgery Center",
    practice: "Westlake Surgery Center",
    npi: "8901234567",
    specialty: "Ambulatory Surgery",
    type: "initial",
    submitted: "2024-02-15",
    email: "admin@westlakesurgery.com",
    phone: "(555) 890-1234",
    address: "800 Surgery Lane, Westlake, OH 44145",
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
    status: "pending",
    decisionHistory: [],
  },
  {
    id: "CRED-2024-1238",
    provider: "Dr. Michael Brown",
    practice: "Brown Medical Associates",
    npi: "1122334455",
    specialty: "Internal Medicine",
    type: "initial",
    submitted: "2024-02-10",
    email: "dr.brown@brownmed.com",
    phone: "(555) 112-2334",
    address: "500 Medical Plaza, Cleveland, OH 44106",
    verifications: {
      nppes: { status: "passed", verifiedAt: "2024-02-12" },
      oig: { status: "failed", verifiedAt: "2024-02-12", reason: "Exclusion found - Patient Abuse" },
      sam: { status: "passed", verifiedAt: "2024-02-12" },
      license: { status: "passed", verifiedAt: "2024-02-13", expires: "2026-12-31" },
      dea: { status: "passed", verifiedAt: "2024-02-13", expires: "2025-06-30" },
      malpractice: { status: "passed", verifiedAt: "2024-02-14", coverage: "$1M/$3M" },
    },
    documents: ["license", "dea", "malpractice_coi", "cv", "w9"],
    flags: ["OIG Exclusion Found - Immediate Review Required"],
    recommendation: "deny",
    status: "pending",
    decisionHistory: [],
  },
  {
    id: "CRED-2024-1235",
    provider: "Dr. Sarah Chen",
    practice: "Lakeside Family Medicine",
    npi: "5566778899",
    specialty: "Family Medicine",
    type: "recredential",
    submitted: "2024-02-05",
    email: "dr.chen@lakesidefm.com",
    phone: "(555) 556-6778",
    address: "300 Lakeside Dr, Shaker Heights, OH 44120",
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
    status: "pending",
    decisionHistory: [],
  },
];

// Decision options
const decisionOptions = [
  { value: "approve", label: "Approve", description: "Add provider to network", color: "green", icon: ThumbsUp },
  { value: "approve_conditions", label: "Approve with Conditions", description: "Approve with monitoring requirements", color: "yellow", icon: AlertTriangle },
  { value: "request_info", label: "Request More Info", description: "Pause and request information from provider", color: "blue", icon: MessageSquare },
  { value: "refer_md", label: "Refer to Medical Director", description: "Escalate for MD review", color: "purple", icon: UserCheck },
  { value: "deny", label: "Deny", description: "Reject application", color: "red", icon: ThumbsDown },
];

// Stats calculation
const calculateStats = (applications: Application[]) => {
  const pending = applications.filter(a => a.status === "pending").length;
  const flagged = applications.filter(a => a.flags.length > 0 && a.status === "pending").length;
  const decidedToday = applications.filter(a => {
    if (!a.decisionHistory?.length) return false;
    const lastDecision = a.decisionHistory[a.decisionHistory.length - 1];
    return new Date(lastDecision.decidedAt).toDateString() === new Date().toDateString();
  }).length;
  
  return [
    { label: "Ready for Review", value: String(pending), trend: "warning" as const, change: "Awaiting decision", icon: <Eye className="w-5 h-5" /> },
    { label: "Flagged for MD", value: String(flagged), trend: "warning" as const, change: "Critical issues", icon: <AlertTriangle className="w-5 h-5" /> },
    { label: "Decided Today", value: String(decidedToday), trend: "up" as const, change: "This session", icon: <CheckCircle className="w-5 h-5" /> },
    { label: "Avg. Review Time", value: "4 min", trend: "up" as const, change: "-1 min", icon: <Clock className="w-5 h-5" /> },
  ];
};

export default function ReviewQueuePage() {
  const { isDark } = useTheme();
  const [applications, setApplications] = useState<Application[]>(initialReviewQueue);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [activeTab, setActiveTab] = useState<"details" | "verifications" | "documents" | "history">("details");
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [selectedDecision, setSelectedDecision] = useState<string>("");
  const [decisionNotes, setDecisionNotes] = useState("");
  const [decisionConditions, setDecisionConditions] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResults, setVerificationResults] = useState<Record<string, unknown> | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "flagged">("pending");
  const [viewingDocument, setViewingDocument] = useState<string | null>(null);

  const stats = calculateStats(applications);

  const filteredApplications = applications.filter(app => {
    if (filterStatus === "pending") return app.status === "pending";
    if (filterStatus === "flagged") return app.flags.length > 0 && app.status === "pending";
    return true;
  });

  // Run live verification
  const runVerification = async () => {
    if (!selectedApp) return;
    
    setIsVerifying(true);
    try {
      const response = await fetch('/api/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          npi: selectedApp.npi,
          firstName: selectedApp.provider.split(' ')[1],
          lastName: selectedApp.provider.split(' ').slice(2).join(' ') || selectedApp.provider.split(' ')[1],
          organizationName: selectedApp.practice,
          providerType: selectedApp.type === 'organization' ? 'organization' : 'individual',
        }),
      });

      const data = await response.json();
      if (data.success) {
        setVerificationResults(data);
      }
    } catch (error) {
      console.error('Verification error:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  // Submit decision
  const submitDecision = () => {
    if (!selectedApp || !selectedDecision || !decisionNotes) return;

    const newDecision: Decision = {
      id: `DEC-${Date.now()}`,
      decision: selectedDecision,
      notes: decisionNotes,
      conditions: decisionConditions || undefined,
      decidedBy: "Current User",
      decidedAt: new Date().toISOString(),
    };

    // Update application
    const updatedApps = applications.map(app => {
      if (app.id === selectedApp.id) {
        let newStatus = app.status;
        if (selectedDecision === "approve" || selectedDecision === "approve_conditions") {
          newStatus = "approved";
        } else if (selectedDecision === "deny") {
          newStatus = "denied";
        } else if (selectedDecision === "request_info") {
          newStatus = "info_requested";
        } else if (selectedDecision === "refer_md") {
          newStatus = "referred_md";
        }

        return {
          ...app,
          status: newStatus,
          decisionHistory: [...(app.decisionHistory || []), newDecision],
        };
      }
      return app;
    });

    setApplications(updatedApps);
    setShowDecisionModal(false);
    setSelectedDecision("");
    setDecisionNotes("");
    setDecisionConditions("");
    setSelectedApp(null);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const getVerificationIcon = (status: string) => {
    switch (status) {
      case "passed": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "failed": return <XCircle className="w-4 h-4 text-red-500" />;
      case "warning": return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default: return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getRecommendationBadge = (rec: string) => {
    switch (rec) {
      case "approve": return <Badge variant="success">Recommend: Approve</Badge>;
      case "approve_conditions": return <Badge variant="warning">Recommend: Approve with Conditions</Badge>;
      case "deny": return <Badge variant="error">Recommend: Deny</Badge>;
      default: return <Badge variant="default">Needs Review</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending": return <Badge variant="warning">Pending Review</Badge>;
      case "approved": return <Badge variant="success">Approved</Badge>;
      case "denied": return <Badge variant="error">Denied</Badge>;
      case "info_requested": return <Badge variant="info">Info Requested</Badge>;
      case "referred_md": return <Badge variant="default">Referred to MD</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  const formatVerificationType = (type: string) => {
    const map: Record<string, string> = {
      nppes: "NPI Registry",
      oig: "OIG Exclusion",
      sam: "SAM.gov",
      license: "State License",
      dea: "DEA Registration",
      boardCert: "Board Certification",
      malpractice: "Malpractice Insurance",
      accreditation: "Accreditation",
    };
    return map[type] || type;
  };

  return (
    <div className="space-y-6">
      {/* Success Toast */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Decision submitted successfully
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" icon={<ChevronLeft className="w-4 h-4" />} href="/admin/credentialing">
            Back
          </Button>
          <div>
            <h1 className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>
              Committee Review Queue
            </h1>
            <p className={cn("text-sm mt-1", isDark ? "text-slate-400" : "text-slate-500")}>
              Review and approve credentialing applications
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as "all" | "pending" | "flagged")}
            className={cn(
              "px-3 py-2 rounded-lg border text-sm",
              isDark ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-200 text-slate-900"
            )}
          >
            <option value="all">All Applications</option>
            <option value="pending">Pending Only</option>
            <option value="flagged">Flagged Only</option>
          </select>
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
            Applications ({filteredApplications.length})
          </h2>
          {filteredApplications.length === 0 ? (
            <div className={cn(
              "p-6 rounded-xl border text-center",
              isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
            )}>
              <CheckCircle className={cn("w-12 h-12 mx-auto mb-3", isDark ? "text-green-400" : "text-green-500")} />
              <p className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>All caught up!</p>
              <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>No applications pending review</p>
            </div>
          ) : (
            filteredApplications.map((app) => (
              <div
                key={app.id}
                onClick={() => {
                  setSelectedApp(app);
                  setActiveTab("details");
                  setVerificationResults(null);
                }}
                className={cn(
                  "p-4 rounded-xl border cursor-pointer transition-all",
                  selectedApp?.id === app.id
                    ? isDark ? "bg-blue-900/30 border-blue-700" : "bg-blue-50 border-blue-300"
                    : isDark ? "bg-slate-800 border-slate-700 hover:border-slate-600" : "bg-white border-slate-200 hover:border-slate-300"
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>
                      {app.provider}
                    </p>
                    <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                      {app.specialty} • {app.type === "recredential" ? "Re-cred" : "Initial"}
                    </p>
                  </div>
                  <ChevronRight className={cn("w-5 h-5", isDark ? "text-slate-500" : "text-slate-400")} />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {getStatusBadge(app.status)}
                  {app.flags.length > 0 && app.status === "pending" && (
                    <span className="text-red-500 text-xs flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {app.flags.length} flag(s)
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-2">
          {selectedApp ? (
            <div className={cn(
              "rounded-xl border",
              isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
            )}>
              {/* Header */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center",
                        isDark ? "bg-blue-900/50 text-blue-400" : "bg-blue-100 text-blue-600"
                      )}>
                        {selectedApp.type === "organization" ? (
                          <Building2 className="w-6 h-6" />
                        ) : (
                          <User className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <h2 className={cn("text-xl font-semibold", isDark ? "text-white" : "text-slate-900")}>
                          {selectedApp.provider}
                        </h2>
                        <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                          {selectedApp.practice} • {selectedApp.id}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(selectedApp.status)}
                      {selectedApp.status === "pending" && getRecommendationBadge(selectedApp.recommendation)}
                    </div>
                  </div>
                  {selectedApp.status === "pending" && (
                    <Button variant="primary" onClick={() => setShowDecisionModal(true)}>
                      Make Decision
                    </Button>
                  )}
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-slate-200 dark:border-slate-700">
                {(["details", "verifications", "documents", "history"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "px-4 py-3 text-sm font-medium capitalize transition-colors",
                      activeTab === tab
                        ? isDark ? "text-blue-400 border-b-2 border-blue-400" : "text-blue-600 border-b-2 border-blue-600"
                        : isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* Details Tab */}
                {activeTab === "details" && (
                  <div className="space-y-6">
                    {/* Flags */}
                    {selectedApp.flags.length > 0 && (
                      <div className="p-4 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
                        <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-medium mb-2">
                          <AlertTriangle className="w-5 h-5" />
                          Flags Requiring Attention
                        </div>
                        <ul className="list-disc list-inside text-sm text-red-600 dark:text-red-300">
                          {selectedApp.flags.map((flag, i) => (
                            <li key={i}>{flag}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Provider Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className={cn("p-4 rounded-lg", isDark ? "bg-slate-700/50" : "bg-slate-50")}>
                        <p className={cn("text-xs uppercase tracking-wider mb-1", isDark ? "text-slate-400" : "text-slate-500")}>
                          NPI
                        </p>
                        <p className={cn("font-mono font-medium", isDark ? "text-white" : "text-slate-900")}>
                          {selectedApp.npi}
                        </p>
                      </div>
                      <div className={cn("p-4 rounded-lg", isDark ? "bg-slate-700/50" : "bg-slate-50")}>
                        <p className={cn("text-xs uppercase tracking-wider mb-1", isDark ? "text-slate-400" : "text-slate-500")}>
                          Specialty
                        </p>
                        <p className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>
                          {selectedApp.specialty}
                        </p>
                      </div>
                      <div className={cn("p-4 rounded-lg", isDark ? "bg-slate-700/50" : "bg-slate-50")}>
                        <p className={cn("text-xs uppercase tracking-wider mb-1", isDark ? "text-slate-400" : "text-slate-500")}>
                          Application Type
                        </p>
                        <p className={cn("font-medium capitalize", isDark ? "text-white" : "text-slate-900")}>
                          {selectedApp.type === "recredential" ? "Re-credentialing" : "Initial Credentialing"}
                        </p>
                      </div>
                      <div className={cn("p-4 rounded-lg", isDark ? "bg-slate-700/50" : "bg-slate-50")}>
                        <p className={cn("text-xs uppercase tracking-wider mb-1", isDark ? "text-slate-400" : "text-slate-500")}>
                          Submitted
                        </p>
                        <p className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>
                          {new Date(selectedApp.submitted).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div>
                      <h3 className={cn("text-sm font-semibold mb-3", isDark ? "text-white" : "text-slate-900")}>
                        Contact Information
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <Mail className={cn("w-4 h-4", isDark ? "text-slate-400" : "text-slate-500")} />
                          <span className={cn("text-sm", isDark ? "text-slate-300" : "text-slate-600")}>
                            {selectedApp.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className={cn("w-4 h-4", isDark ? "text-slate-400" : "text-slate-500")} />
                          <span className={cn("text-sm", isDark ? "text-slate-300" : "text-slate-600")}>
                            {selectedApp.phone}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className={cn("w-4 h-4", isDark ? "text-slate-400" : "text-slate-500")} />
                          <span className={cn("text-sm", isDark ? "text-slate-300" : "text-slate-600")}>
                            {selectedApp.address}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Verifications Tab */}
                {activeTab === "verifications" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className={cn("font-semibold", isDark ? "text-white" : "text-slate-900")}>
                        Verification Results
                      </h3>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={isVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                        onClick={runVerification}
                        disabled={isVerifying}
                      >
                        {isVerifying ? "Verifying..." : "Run Live Check"}
                      </Button>
                    </div>

                    {/* Stored Verifications */}
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(selectedApp.verifications).map(([key, val]) => (
                        <div
                          key={key}
                          className={cn(
                            "p-3 rounded-lg",
                            isDark ? "bg-slate-700/50" : "bg-slate-50"
                          )}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {getVerificationIcon(val.status)}
                              <span className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>
                                {formatVerificationType(key)}
                              </span>
                            </div>
                          </div>
                          <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                            Verified: {new Date(val.verifiedAt).toLocaleDateString()}
                          </p>
                          {val.expires && (
                            <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                              Expires: {val.expires}
                            </p>
                          )}
                          {val.coverage && (
                            <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                              Coverage: {val.coverage}
                            </p>
                          )}
                          {val.reason && (
                            <p className="text-xs text-red-500 mt-1">{val.reason}</p>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Live Verification Results */}
                    {verificationResults && (
                      <LiveVerificationDisplay results={verificationResults} isDark={isDark} />
                    )}
                  </div>
                )}

                {/* Documents Tab */}
                {activeTab === "documents" && (
                  <div className="space-y-4">
                    <h3 className={cn("font-semibold", isDark ? "text-white" : "text-slate-900")}>
                      Documents on File ({selectedApp.documents.length})
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedApp.documents.map((doc) => {
                        const docInfo = sampleDocuments[doc];
                        return (
                          <div
                            key={doc}
                            onClick={() => setViewingDocument(doc)}
                            className={cn(
                              "p-4 rounded-lg cursor-pointer transition-all border group",
                              isDark 
                                ? "bg-slate-700/50 border-slate-600 hover:border-blue-500 hover:bg-slate-700" 
                                : "bg-slate-50 border-slate-200 hover:border-blue-400 hover:bg-blue-50"
                            )}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <div className={cn(
                                  "w-10 h-10 rounded-lg flex items-center justify-center",
                                  isDark ? "bg-blue-900/50" : "bg-blue-100"
                                )}>
                                  <FileText className={cn("w-5 h-5", isDark ? "text-blue-400" : "text-blue-600")} />
                                </div>
                                <div>
                                  <span className={cn("text-sm font-medium capitalize block", isDark ? "text-white" : "text-slate-900")}>
                                    {doc.replace(/_/g, " ")}
                                  </span>
                                  {docInfo && (
                                    <span className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                                      {docInfo.type} • {docInfo.size}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <Eye className={cn(
                                "w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity",
                                isDark ? "text-blue-400" : "text-blue-600"
                              )} />
                            </div>
                            {docInfo?.expires && (
                              <div className={cn(
                                "text-xs mt-2 flex items-center gap-1",
                                new Date(docInfo.expires) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
                                  ? "text-amber-500"
                                  : isDark ? "text-slate-400" : "text-slate-500"
                              )}>
                                <Calendar className="w-3 h-3" />
                                Expires: {docInfo.expires}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <Button variant="secondary" size="sm" icon={<Download className="w-4 h-4" />}>
                      Download All Documents
                    </Button>
                  </div>
                )}

                {/* History Tab */}
                {activeTab === "history" && (
                  <div className="space-y-4">
                    <h3 className={cn("font-semibold", isDark ? "text-white" : "text-slate-900")}>
                      Decision History
                    </h3>
                    {selectedApp.decisionHistory && selectedApp.decisionHistory.length > 0 ? (
                      <div className="space-y-3">
                        {selectedApp.decisionHistory.map((decision, index) => (
                          <div
                            key={decision.id}
                            className={cn(
                              "p-4 rounded-lg border-l-4",
                              decision.decision === "approve" || decision.decision === "approve_conditions"
                                ? "border-l-green-500"
                                : decision.decision === "deny"
                                ? "border-l-red-500"
                                : "border-l-blue-500",
                              isDark ? "bg-slate-700/50" : "bg-slate-50"
                            )}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className={cn("font-medium capitalize", isDark ? "text-white" : "text-slate-900")}>
                                {decision.decision.replace(/_/g, " ")}
                              </span>
                              <span className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                                {new Date(decision.decidedAt).toLocaleString()}
                              </span>
                            </div>
                            <p className={cn("text-sm mb-2", isDark ? "text-slate-300" : "text-slate-600")}>
                              {decision.notes}
                            </p>
                            {decision.conditions && (
                              <p className="text-sm text-amber-600 dark:text-amber-400">
                                Conditions: {decision.conditions}
                              </p>
                            )}
                            <p className={cn("text-xs mt-2", isDark ? "text-slate-500" : "text-slate-400")}>
                              By: {decision.decidedBy}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={cn(
                        "p-8 rounded-lg text-center",
                        isDark ? "bg-slate-700/30" : "bg-slate-50"
                      )}>
                        <History className={cn("w-12 h-12 mx-auto mb-3", isDark ? "text-slate-600" : "text-slate-300")} />
                        <p className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>No Decision History</p>
                        <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                          This application is awaiting initial review
                        </p>
                      </div>
                    )}
                  </div>
                )}
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

      {/* Document Viewer Modal */}
      <AnimatePresence>
        {viewingDocument && selectedApp && sampleDocuments[viewingDocument] && (
          <DocumentViewerModal
            document={sampleDocuments[viewingDocument]}
            docKey={viewingDocument}
            providerName={selectedApp.provider}
            onClose={() => setViewingDocument(null)}
            isDark={isDark}
          />
        )}
      </AnimatePresence>

      {/* Decision Modal */}
      <AnimatePresence>
        {showDecisionModal && selectedApp && (
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
                "w-full max-w-lg rounded-xl p-6 max-h-[90vh] overflow-y-auto",
                isDark ? "bg-slate-800" : "bg-white"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className={cn("text-xl font-semibold", isDark ? "text-white" : "text-slate-900")}>
                    Committee Decision
                  </h2>
                  <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                    {selectedApp.provider}
                  </p>
                </div>
                <IconButton icon={<X className="w-5 h-5" />} onClick={() => setShowDecisionModal(false)} />
              </div>

              {/* Decision Options */}
              <div className="space-y-3 mb-6">
                {decisionOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <label
                      key={option.value}
                      className={cn(
                        "flex items-start gap-3 p-4 rounded-lg cursor-pointer transition-colors border",
                        selectedDecision === option.value
                          ? isDark
                            ? `bg-${option.color}-900/30 border-${option.color}-700`
                            : `bg-${option.color}-50 border-${option.color}-300`
                          : isDark
                          ? "bg-slate-700/50 border-slate-600 hover:bg-slate-700"
                          : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                      )}
                    >
                      <input
                        type="radio"
                        name="decision"
                        value={option.value}
                        checked={selectedDecision === option.value}
                        onChange={(e) => setSelectedDecision(e.target.value)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Icon className={cn("w-4 h-4", `text-${option.color}-500`)} />
                          <span className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>
                            {option.label}
                          </span>
                        </div>
                        <p className={cn("text-sm mt-1", isDark ? "text-slate-400" : "text-slate-500")}>
                          {option.description}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>

              {/* Conditions (for approve with conditions) */}
              {selectedDecision === "approve_conditions" && (
                <div className="mb-4">
                  <label className={cn("block text-sm font-medium mb-2", isDark ? "text-slate-300" : "text-slate-700")}>
                    Conditions / Monitoring Requirements
                  </label>
                  <textarea
                    value={decisionConditions}
                    onChange={(e) => setDecisionConditions(e.target.value)}
                    placeholder="e.g., Provider must submit updated license within 30 days..."
                    rows={2}
                    className={cn(
                      "w-full px-3 py-2 rounded-lg border text-sm resize-none",
                      isDark ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400" : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
                    )}
                  />
                </div>
              )}

              {/* Notes */}
              <div className="mb-6">
                <label className={cn("block text-sm font-medium mb-2", isDark ? "text-slate-300" : "text-slate-700")}>
                  Decision Notes <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={decisionNotes}
                  onChange={(e) => setDecisionNotes(e.target.value)}
                  placeholder="Enter notes explaining this decision..."
                  rows={3}
                  className={cn(
                    "w-full px-3 py-2 rounded-lg border text-sm resize-none",
                    isDark ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400" : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
                  )}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => setShowDecisionModal(false)}>
                  Cancel
                </Button>
                <Button
                  variant={selectedDecision === "deny" ? "ghost" : "primary"}
                  className={cn("flex-1", selectedDecision === "deny" && "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30")}
                  disabled={!selectedDecision || !decisionNotes}
                  onClick={submitDecision}
                >
                  Submit Decision
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
