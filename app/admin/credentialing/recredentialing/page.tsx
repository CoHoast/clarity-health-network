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
} from "lucide-react";
import { useTheme } from "@/components/admin/ThemeContext";
import { StatCard } from "@/components/admin/ui/StatCard";
import { Badge } from "@/components/admin/ui/Badge";
import { Button } from "@/components/admin/ui/Button";
import { SearchInput } from "@/components/admin/ui/SearchInput";
import { cn } from "@/lib/utils";

const recredentialingList = [
  {
    id: 1,
    provider: "Dr. Sarah Chen",
    practice: "Lakeside Family Medicine",
    npi: "5566778899",
    specialty: "Family Medicine",
    currentExpires: "2024-04-15",
    daysUntil: 28,
    status: "due_soon",
    remindersSent: 1,
    lastReminder: "2024-03-10",
    applicationStarted: false,
  },
  {
    id: 2,
    provider: "Dr. Michael Torres",
    practice: "Cleveland Cardiology",
    npi: "1122334455",
    specialty: "Cardiology",
    currentExpires: "2024-05-01",
    daysUntil: 44,
    status: "upcoming",
    remindersSent: 0,
    lastReminder: null,
    applicationStarted: false,
  },
  {
    id: 3,
    provider: "Valley Health Center",
    practice: "Valley Health Center",
    npi: "9988776655",
    specialty: "Multi-Specialty",
    currentExpires: "2024-04-30",
    daysUntil: 43,
    status: "upcoming",
    remindersSent: 1,
    lastReminder: "2024-03-15",
    applicationStarted: true,
  },
  {
    id: 4,
    provider: "Dr. Emily Watson",
    practice: "Watson Pediatrics",
    npi: "4455667788",
    specialty: "Pediatrics",
    currentExpires: "2024-06-15",
    daysUntil: 89,
    status: "upcoming",
    remindersSent: 0,
    lastReminder: null,
    applicationStarted: false,
  },
  {
    id: 5,
    provider: "Dr. Robert Kim",
    practice: "Dermatology Associates",
    npi: "6789012345",
    specialty: "Dermatology",
    currentExpires: "2024-03-15",
    daysUntil: -3,
    status: "overdue",
    remindersSent: 4,
    lastReminder: "2024-03-14",
    applicationStarted: false,
  },
  {
    id: 6,
    provider: "Dr. Lisa Martinez",
    practice: "Neurology Associates",
    npi: "7890123456",
    specialty: "Neurology",
    currentExpires: "2024-03-10",
    daysUntil: -8,
    status: "overdue",
    remindersSent: 5,
    lastReminder: "2024-03-08",
    applicationStarted: true,
  },
  {
    id: 7,
    provider: "Metro Imaging Center",
    practice: "Metro Imaging Center",
    npi: "3456789012",
    specialty: "Radiology",
    currentExpires: "2024-07-31",
    daysUntil: 135,
    status: "on_track",
    remindersSent: 0,
    lastReminder: null,
    applicationStarted: false,
  },
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
              Track and manage provider re-credentialing cycles
            </p>
          </div>
        </div>
        <Button variant="primary">
          <Mail className="w-4 h-4 mr-2" />
          Send Bulk Reminders
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
                  <h3 className={cn("font-semibold", isDark ? "text-white" : "text-slate-900")}>
                    {item.provider}
                  </h3>
                  <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                    {item.practice} • {item.specialty}
                  </p>
                  <p className={cn("text-sm", isDark ? "text-slate-500" : "text-slate-400")}>
                    NPI: {item.npi}
                  </p>
                </div>
              </div>
              {getStatusBadge(item.status, item.daysUntil)}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
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
              <Button variant="secondary" size="sm">
                <Mail className="w-4 h-4 mr-1" />
                Send Reminder
              </Button>
              <Button variant="secondary" size="sm">
                <Send className="w-4 h-4 mr-1" />
                Request Documents
              </Button>
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4 mr-1" />
                View Provider
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
    </div>
  );
}
