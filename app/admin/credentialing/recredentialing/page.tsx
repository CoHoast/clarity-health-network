"use client";

import { useState } from "react";
import Link from "next/link";
import {
  RefreshCw,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Mail,
  ChevronLeft,
  Eye,
  Send,
  User,
  Filter,
  Settings,
  Zap,
  X,
  History,
  Play,
  Pause,
  Bell,
  Shield,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "@/components/admin/ThemeContext";
import { StatCard } from "@/components/admin/ui/StatCard";
import { Badge } from "@/components/admin/ui/Badge";
import { Button } from "@/components/admin/ui/Button";
import { SearchInput } from "@/components/admin/ui/SearchInput";
import { cn } from "@/lib/utils";

// Re-credentialing cycles by provider type
const recredCycles = [
  { type: "Physician (MD/DO)", months: 36, leadDays: 90 },
  { type: "Mid-Level (NP/PA)", months: 24, leadDays: 60 },
  { type: "Dentist (DDS/DMD)", months: 36, leadDays: 90 },
  { type: "Facility", months: 36, leadDays: 90 },
  { type: "Allied Health", months: 24, leadDays: 60 },
  { type: "Behavioral Health", months: 24, leadDays: 60 },
];

const recredentialingList = [
  {
    id: 1,
    provider: "Dr. Sarah Chen",
    practice: "Lakeside Family Medicine",
    npi: "5566778899",
    specialty: "Family Medicine",
    providerType: "Physician",
    currentExpires: "2024-04-15",
    daysUntil: 28,
    status: "due_soon",
    remindersSent: 1,
    lastReminder: "2024-03-10",
    applicationStarted: false,
    workflowStage: "reminder_60",
    cleanHistory: true,
    eligibleForAbbreviated: true,
  },
  {
    id: 2,
    provider: "Dr. Michael Torres",
    practice: "Cleveland Cardiology",
    npi: "1122334455",
    specialty: "Cardiology",
    providerType: "Physician",
    currentExpires: "2024-05-01",
    daysUntil: 44,
    status: "upcoming",
    remindersSent: 0,
    lastReminder: null,
    applicationStarted: false,
    workflowStage: "reminder_60",
    cleanHistory: true,
    eligibleForAbbreviated: true,
  },
  {
    id: 3,
    provider: "Valley Health Center",
    practice: "Valley Health Center",
    npi: "9988776655",
    specialty: "Multi-Specialty",
    providerType: "Facility",
    currentExpires: "2024-04-30",
    daysUntil: 43,
    status: "upcoming",
    remindersSent: 1,
    lastReminder: "2024-03-15",
    applicationStarted: true,
    workflowStage: "in_review",
    cleanHistory: true,
    eligibleForAbbreviated: false, // Facility - needs full review
  },
  {
    id: 4,
    provider: "Dr. Emily Watson",
    practice: "Watson Pediatrics",
    npi: "4455667788",
    specialty: "Pediatrics",
    providerType: "Physician",
    currentExpires: "2024-06-15",
    daysUntil: 89,
    status: "upcoming",
    remindersSent: 0,
    lastReminder: null,
    applicationStarted: false,
    workflowStage: "reminder_90",
    cleanHistory: true,
    eligibleForAbbreviated: true,
  },
  {
    id: 5,
    provider: "Dr. Robert Kim",
    practice: "Dermatology Associates",
    npi: "6789012345",
    specialty: "Dermatology",
    providerType: "Physician",
    currentExpires: "2024-03-15",
    daysUntil: -3,
    status: "overdue",
    remindersSent: 4,
    lastReminder: "2024-03-14",
    applicationStarted: false,
    workflowStage: "escalation",
    cleanHistory: false, // Has malpractice claim
    eligibleForAbbreviated: false,
  },
  {
    id: 6,
    provider: "Dr. Lisa Martinez",
    practice: "Neurology Associates",
    npi: "7890123456",
    specialty: "Neurology",
    providerType: "Physician",
    currentExpires: "2024-03-10",
    daysUntil: -8,
    status: "overdue",
    remindersSent: 5,
    lastReminder: "2024-03-08",
    applicationStarted: true,
    workflowStage: "grace_period",
    cleanHistory: true,
    eligibleForAbbreviated: true,
  },
  {
    id: 7,
    provider: "Metro Imaging Center",
    practice: "Metro Imaging Center",
    npi: "3456789012",
    specialty: "Radiology",
    providerType: "Facility",
    currentExpires: "2024-07-31",
    daysUntil: 135,
    status: "on_track",
    remindersSent: 0,
    lastReminder: null,
    applicationStarted: false,
    workflowStage: "not_started",
    cleanHistory: true,
    eligibleForAbbreviated: false,
  },
  {
    id: 8,
    provider: "Jennifer Lee, NP",
    practice: "Family Care Associates",
    npi: "2345678901",
    specialty: "Nurse Practitioner",
    providerType: "Mid-Level",
    currentExpires: "2024-05-20",
    daysUntil: 63,
    status: "upcoming",
    remindersSent: 1,
    lastReminder: "2024-03-12",
    applicationStarted: false,
    workflowStage: "reminder_60",
    cleanHistory: true,
    eligibleForAbbreviated: true,
  },
];

// Completed re-credentialings
const completedRecreds = [
  { id: 101, provider: "Dr. James Wilson", completedDate: "2024-03-01", type: "abbreviated", nextDue: "2027-03-01" },
  { id: 102, provider: "Cleveland PT Group", completedDate: "2024-02-28", type: "full", nextDue: "2026-02-28" },
  { id: 103, provider: "Dr. Amanda Foster", completedDate: "2024-02-15", type: "abbreviated", nextDue: "2027-02-15" },
  { id: 104, provider: "Main Street Clinic", completedDate: "2024-02-10", type: "full", nextDue: "2027-02-10" },
];

const stats = [
  { label: "Due in 30 Days", value: "12", trend: "warning" as const, change: "Action needed", icon: <AlertTriangle className="w-5 h-5" /> },
  { label: "Due in 60 Days", value: "18", trend: "neutral" as const, change: "Reminder sent", icon: <Clock className="w-5 h-5" /> },
  { label: "Due in 90 Days", value: "23", trend: "up" as const, change: "On track", icon: <Calendar className="w-5 h-5" /> },
  { label: "Overdue", value: "3", trend: "warning" as const, change: "Immediate", icon: <RefreshCw className="w-5 h-5" /> },
];

const getStatusBadge = (status: string, daysUntil: number) => {
  if (status === "overdue") {
    return <Badge variant="error">Overdue ({Math.abs(daysUntil)} days)</Badge>;
  }
  if (daysUntil <= 30) {
    return <Badge variant="warning">Due in {daysUntil} days</Badge>;
  }
  if (daysUntil <= 60) {
    return <Badge variant="info">Due in {daysUntil} days</Badge>;
  }
  return <Badge variant="success">Due in {daysUntil} days</Badge>;
};

const getWorkflowStageLabel = (stage: string) => {
  switch (stage) {
    case "not_started": return "Not Started";
    case "reminder_90": return "90-Day Notice Sent";
    case "reminder_60": return "60-Day Reminder";
    case "reminder_30": return "30-Day Urgent";
    case "escalation": return "Escalation";
    case "in_review": return "Application In Review";
    case "grace_period": return "Grace Period";
    case "suspended": return "Suspended";
    default: return stage;
  }
};

const getWorkflowStageColor = (stage: string) => {
  switch (stage) {
    case "not_started": return "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300";
    case "reminder_90": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case "reminder_60": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "reminder_30": return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
    case "escalation": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    case "in_review": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    case "grace_period": return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
    case "suspended": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    default: return "bg-slate-100 text-slate-600";
  }
};

const getUrgencyColor = (daysUntil: number) => {
  if (daysUntil < 0) return "border-l-red-500";
  if (daysUntil <= 30) return "border-l-amber-500";
  if (daysUntil <= 60) return "border-l-yellow-500";
  return "border-l-green-500";
};

export default function RecredentialingPage() {
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDays, setFilterDays] = useState("");
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed" | "settings">("upcoming");
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<typeof recredentialingList[0] | null>(null);

  const filteredList = recredentialingList
    .filter((item) => {
      const matchesSearch =
        item.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.practice.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.npi.includes(searchQuery);
      
      if (!filterDays) return matchesSearch;
      
      if (filterDays === "overdue") return matchesSearch && item.daysUntil < 0;
      if (filterDays === "30") return matchesSearch && item.daysUntil >= 0 && item.daysUntil <= 30;
      if (filterDays === "60") return matchesSearch && item.daysUntil > 30 && item.daysUntil <= 60;
      if (filterDays === "90") return matchesSearch && item.daysUntil > 60 && item.daysUntil <= 90;
      
      return matchesSearch;
    })
    .sort((a, b) => a.daysUntil - b.daysUntil);

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
              Re-Credentialing
            </h1>
            <p className={cn("text-sm mt-1", isDark ? "text-slate-400" : "text-slate-500")}>
              Automated re-credentialing workflow and tracking
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setShowSettingsModal(true)}>
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button variant="primary">
            <Mail className="w-4 h-4 mr-2" />
            Send Bulk Reminders
          </Button>
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

      {/* Automated Workflow Status */}
      <div className={cn(
        "rounded-xl border p-4",
        isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
      )}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-500" />
            <h3 className={cn("font-semibold", isDark ? "text-white" : "text-slate-900")}>
              Automation Status
            </h3>
            <Badge variant="success">Active</Badge>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className={cn(isDark ? "text-slate-400" : "text-slate-500")}>
              Last run: Today, 6:00 AM
            </span>
            <span className={cn(isDark ? "text-slate-400" : "text-slate-500")}>
              Next run: Tomorrow, 6:00 AM
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={cn("p-3 rounded-lg", isDark ? "bg-slate-700/50" : "bg-slate-50")}>
            <div className="flex items-center gap-2 mb-1">
              <Bell className="w-4 h-4 text-green-500" />
              <span className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>
                90-Day Notices
              </span>
            </div>
            <p className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>8</p>
            <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Sent this week</p>
          </div>
          <div className={cn("p-3 rounded-lg", isDark ? "bg-slate-700/50" : "bg-slate-50")}>
            <div className="flex items-center gap-2 mb-1">
              <Mail className="w-4 h-4 text-yellow-500" />
              <span className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>
                60-Day Reminders
              </span>
            </div>
            <p className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>5</p>
            <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Sent this week</p>
          </div>
          <div className={cn("p-3 rounded-lg", isDark ? "bg-slate-700/50" : "bg-slate-50")}>
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              <span className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>
                30-Day Urgent
              </span>
            </div>
            <p className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>3</p>
            <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Sent this week</p>
          </div>
          <div className={cn("p-3 rounded-lg", isDark ? "bg-slate-700/50" : "bg-slate-50")}>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-purple-500" />
              <span className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>
                Auto-Approved
              </span>
            </div>
            <p className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>4</p>
            <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Abbreviated this month</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={cn(
        "flex gap-1 p-1 rounded-lg w-fit",
        isDark ? "bg-slate-800" : "bg-slate-100"
      )}>
        {[
          { id: "upcoming", label: "Upcoming", icon: Calendar },
          { id: "completed", label: "Completed", icon: CheckCircle },
          { id: "settings", label: "Cycle Settings", icon: Settings },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
              activeTab === tab.id
                ? isDark
                  ? "bg-slate-700 text-white"
                  : "bg-white text-slate-900 shadow-sm"
                : isDark
                ? "text-slate-400 hover:text-white"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Upcoming Tab */}
      {activeTab === "upcoming" && (
        <>
          {/* Filters */}
          <div className={cn(
            "flex flex-col sm:flex-row gap-4 p-4 rounded-xl border",
            isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          )}>
            <div className="flex-1">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search by provider, practice, or NPI..."
              />
            </div>
            <select
              value={filterDays}
              onChange={(e) => setFilterDays(e.target.value)}
              className={cn(
                "px-3 py-2 rounded-lg border text-sm",
                isDark ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-200 text-slate-900"
              )}
            >
              <option value="">All Upcoming</option>
              <option value="overdue">Overdue</option>
              <option value="30">Due in 30 Days</option>
              <option value="60">Due in 60 Days</option>
              <option value="90">Due in 90 Days</option>
            </select>
          </div>

          {/* Re-credentialing List */}
          <div className="space-y-4">
            {filteredList.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "rounded-xl border border-l-4 p-6",
                  getUrgencyColor(item.daysUntil),
                  isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center",
                      isDark ? "bg-cyan-900/50 text-cyan-400" : "bg-cyan-100 text-cyan-600"
                    )}>
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={cn("font-semibold", isDark ? "text-white" : "text-slate-900")}>
                          {item.provider}
                        </h3>
                        {item.eligibleForAbbreviated && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs rounded-full">
                            <Zap className="w-3 h-3" />
                            Fast Track
                          </span>
                        )}
                      </div>
                      <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                        {item.practice} • {item.specialty}
                      </p>
                      <p className={cn("text-sm", isDark ? "text-slate-500" : "text-slate-400")}>
                        NPI: {item.npi} • {item.providerType}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(item.status, item.daysUntil)}
                    <span className={cn(
                      "text-xs px-2 py-1 rounded-full",
                      getWorkflowStageColor(item.workflowStage)
                    )}>
                      {getWorkflowStageLabel(item.workflowStage)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                  <div className={cn("p-3 rounded-lg", isDark ? "bg-slate-700/50" : "bg-slate-50")}>
                    <p className={cn("text-xs uppercase tracking-wider mb-1", isDark ? "text-slate-400" : "text-slate-500")}>
                      Current Expires
                    </p>
                    <p className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>
                      {new Date(item.currentExpires).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                  <div className={cn("p-3 rounded-lg", isDark ? "bg-slate-700/50" : "bg-slate-50")}>
                    <p className={cn("text-xs uppercase tracking-wider mb-1", isDark ? "text-slate-400" : "text-slate-500")}>
                      Reminders Sent
                    </p>
                    <p className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>
                      {item.remindersSent}
                    </p>
                  </div>
                  <div className={cn("p-3 rounded-lg", isDark ? "bg-slate-700/50" : "bg-slate-50")}>
                    <p className={cn("text-xs uppercase tracking-wider mb-1", isDark ? "text-slate-400" : "text-slate-500")}>
                      Last Reminder
                    </p>
                    <p className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>
                      {item.lastReminder ? new Date(item.lastReminder).toLocaleDateString() : "None"}
                    </p>
                  </div>
                  <div className={cn("p-3 rounded-lg", isDark ? "bg-slate-700/50" : "bg-slate-50")}>
                    <p className={cn("text-xs uppercase tracking-wider mb-1", isDark ? "text-slate-400" : "text-slate-500")}>
                      Application
                    </p>
                    <p className={cn("font-medium flex items-center gap-1", isDark ? "text-white" : "text-slate-900")}>
                      {item.applicationStarted ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Started
                        </>
                      ) : (
                        <>
                          <Clock className="w-4 h-4 text-slate-400" />
                          Not Started
                        </>
                      )}
                    </p>
                  </div>
                  <div className={cn("p-3 rounded-lg", isDark ? "bg-slate-700/50" : "bg-slate-50")}>
                    <p className={cn("text-xs uppercase tracking-wider mb-1", isDark ? "text-slate-400" : "text-slate-500")}>
                      Clean History
                    </p>
                    <p className={cn("font-medium flex items-center gap-1", isDark ? "text-white" : "text-slate-900")}>
                      {item.cleanHistory ? (
                        <>
                          <Shield className="w-4 h-4 text-green-500" />
                          Yes
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                          Review Needed
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {!item.applicationStarted && (
                    <Button variant="primary" size="sm">
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Start Re-Credential
                    </Button>
                  )}
                  {item.applicationStarted && (
                    <Button variant="primary" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View Application
                    </Button>
                  )}
                  {item.eligibleForAbbreviated && !item.applicationStarted && (
                    <Button variant="secondary" size="sm">
                      <Zap className="w-4 h-4 mr-1" />
                      Auto-Approve (Abbreviated)
                    </Button>
                  )}
                  <Button variant="secondary" size="sm">
                    <Mail className="w-4 h-4 mr-1" />
                    Send Reminder
                  </Button>
                  <Button variant="secondary" size="sm">
                    <Send className="w-4 h-4 mr-1" />
                    Request Documents
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedProvider(item)}>
                    <History className="w-4 h-4 mr-1" />
                    View Timeline
                  </Button>
                </div>
              </div>
            ))}

            {filteredList.length === 0 && (
              <div className={cn(
                "rounded-xl border p-12 text-center",
                isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
              )}>
                <Calendar className={cn("w-12 h-12 mx-auto mb-4", isDark ? "text-slate-600" : "text-slate-300")} />
                <h3 className={cn("text-lg font-medium mb-2", isDark ? "text-white" : "text-slate-900")}>
                  No Re-Credentialing Due
                </h3>
                <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                  No providers match your current filters.
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Completed Tab */}
      {activeTab === "completed" && (
        <div className={cn(
          "rounded-xl border overflow-hidden",
          isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
        )}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={cn("border-b", isDark ? "border-slate-700 bg-slate-700/50" : "border-slate-200 bg-slate-50")}>
                  <th className="text-left px-4 py-3 text-sm font-medium">Provider</th>
                  <th className="text-left px-4 py-3 text-sm font-medium">Completed</th>
                  <th className="text-left px-4 py-3 text-sm font-medium">Type</th>
                  <th className="text-left px-4 py-3 text-sm font-medium">Next Due</th>
                  <th className="text-right px-4 py-3 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {completedRecreds.map((item) => (
                  <tr
                    key={item.id}
                    className={cn("border-b", isDark ? "border-slate-700 hover:bg-slate-700/50" : "border-slate-100 hover:bg-slate-50")}
                  >
                    <td className="px-4 py-3 font-medium">{item.provider}</td>
                    <td className="px-4 py-3">{new Date(item.completedDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      {item.type === "abbreviated" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs rounded-full">
                          <Zap className="w-3 h-3" />
                          Abbreviated
                        </span>
                      ) : (
                        <Badge variant="default">Full Review</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">{new Date(item.nextDue).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Cycle Settings Tab */}
      {activeTab === "settings" && (
        <div className={cn(
          "rounded-xl border p-6",
          isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
        )}>
          <h3 className={cn("font-semibold mb-4", isDark ? "text-white" : "text-slate-900")}>
            Re-Credentialing Cycles by Provider Type
          </h3>
          <p className={cn("text-sm mb-6", isDark ? "text-slate-400" : "text-slate-500")}>
            Configure the re-credentialing frequency and advance notice period for each provider type.
          </p>
          
          <div className="space-y-4">
            {recredCycles.map((cycle, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center justify-between p-4 rounded-lg border",
                  isDark ? "bg-slate-700/50 border-slate-600" : "bg-slate-50 border-slate-200"
                )}
              >
                <div>
                  <p className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>
                    {cycle.type}
                  </p>
                  <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                    {cycle.leadDays} days advance notice
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                      {cycle.months}
                    </span>
                    <span className={cn("text-sm ml-1", isDark ? "text-slate-400" : "text-slate-500")}>
                      months
                    </span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t" style={{ borderColor: isDark ? '#334155' : '#e2e8f0' }}>
            <h4 className={cn("font-medium mb-4", isDark ? "text-white" : "text-slate-900")}>
              Abbreviated Re-Credentialing Rules
            </h4>
            <div className="space-y-3">
              {[
                { label: "No disciplinary actions on record", enabled: true },
                { label: "No malpractice claims in past 3 years", enabled: true },
                { label: "No gaps in coverage or credentialing", enabled: true },
                { label: "All verifications pass automatically", enabled: true },
                { label: "Provider in network for at least 3 years", enabled: false },
              ].map((rule, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className={cn("text-sm", isDark ? "text-slate-300" : "text-slate-600")}>
                    {rule.label}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={rule.enabled} className="sr-only peer" />
                    <div className="w-9 h-5 bg-slate-300 peer-checked:bg-cyan-500 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Provider Timeline Modal */}
      {selectedProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className={cn(
            "w-full max-w-lg rounded-xl max-h-[90vh] overflow-y-auto",
            isDark ? "bg-slate-800" : "bg-white"
          )}>
            <div className={cn("flex items-center justify-between p-4 border-b", isDark ? "border-slate-700" : "border-slate-200")}>
              <div>
                <h2 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-slate-900")}>
                  Re-Credentialing Timeline
                </h2>
                <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                  {selectedProvider.provider}
                </p>
              </div>
              <button
                onClick={() => setSelectedProvider(null)}
                className={cn("p-2 rounded-lg", isDark ? "hover:bg-slate-700" : "hover:bg-slate-100")}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              <div className="space-y-4">
                {[
                  { date: "90 Days Before", status: "complete", action: "Initial notice sent", detail: "Email sent to provider" },
                  { date: "60 Days Before", status: selectedProvider.daysUntil <= 60 ? "complete" : "pending", action: "Reminder email", detail: "Second reminder sent" },
                  { date: "30 Days Before", status: selectedProvider.daysUntil <= 30 ? (selectedProvider.daysUntil < 0 ? "complete" : "current") : "pending", action: "Urgent reminder", detail: "Final notice + phone task" },
                  { date: "14 Days Before", status: selectedProvider.daysUntil <= 14 ? "current" : "pending", action: "Escalation", detail: "Alert credentialing manager" },
                  { date: "Expiration Date", status: selectedProvider.daysUntil <= 0 ? "current" : "pending", action: "Grace period begins", detail: "30-day grace period" },
                  { date: "Grace +30", status: "pending", action: "Auto-suspension", detail: "Provider suspended if incomplete" },
                ].map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        "w-3 h-3 rounded-full",
                        step.status === "complete" ? "bg-green-500" :
                        step.status === "current" ? "bg-cyan-500 animate-pulse" :
                        "bg-slate-300 dark:bg-slate-600"
                      )} />
                      {index < 5 && (
                        <div className={cn(
                          "w-0.5 h-12",
                          step.status === "complete" ? "bg-green-500" : "bg-slate-300 dark:bg-slate-600"
                        )} />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between">
                        <p className={cn(
                          "font-medium",
                          step.status === "current" ? "text-cyan-600 dark:text-cyan-400" :
                          isDark ? "text-white" : "text-slate-900"
                        )}>
                          {step.action}
                        </p>
                        <span className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>
                          {step.date}
                        </span>
                      </div>
                      <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                        {step.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={cn("flex justify-end gap-3 p-4 border-t", isDark ? "border-slate-700" : "border-slate-200")}>
              <Button variant="secondary" onClick={() => setSelectedProvider(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
