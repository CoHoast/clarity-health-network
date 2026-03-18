"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  ChevronLeft,
  Eye,
  Calendar,
  Activity,
  Search,
  Filter,
} from "lucide-react";
import { useTheme } from "@/components/admin/ThemeContext";
import { StatCard } from "@/components/admin/ui/StatCard";
import { Badge } from "@/components/admin/ui/Badge";
import { Button } from "@/components/admin/ui/Button";
import { SearchInput } from "@/components/admin/ui/SearchInput";
import { cn } from "@/lib/utils";

const alerts = [
  {
    id: 1,
    severity: "critical",
    provider: "Dr. Michael Brown",
    practice: "Brown Medical Associates",
    type: "OIG Exclusion",
    description: "Provider found on OIG LEIE exclusion list",
    detected: "2024-03-18T08:00:00",
    status: "open",
    autoAction: "Suspended pending review",
  },
  {
    id: 2,
    severity: "high",
    provider: "Dr. Robert Kim",
    practice: "Skin Care Associates",
    type: "License Suspended",
    description: "State medical license suspended by OH Medical Board",
    detected: "2024-03-17T14:30:00",
    status: "acknowledged",
    acknowledgedBy: "Jane Smith",
    acknowledgedAt: "2024-03-17T16:00:00",
  },
  {
    id: 3,
    severity: "medium",
    provider: "Dr. Sarah Chen",
    practice: "Lakeside Family Medicine",
    type: "License Expiring",
    description: "State license expires in 28 days (April 15, 2024)",
    detected: "2024-03-18T02:00:00",
    status: "open",
  },
  {
    id: 4,
    severity: "medium",
    provider: "Valley Health Center",
    practice: "Valley Health Center",
    type: "Malpractice Expiring",
    description: "Malpractice COI expires in 21 days (April 8, 2024)",
    detected: "2024-03-18T02:00:00",
    status: "open",
  },
  {
    id: 5,
    severity: "low",
    provider: "Dr. Emily Watson",
    practice: "Watson Pediatrics",
    type: "Address Change",
    description: "NPPES address differs from records - verify update",
    detected: "2024-03-15T02:00:00",
    status: "resolved",
    resolvedBy: "Mike Johnson",
    resolvedAt: "2024-03-16T10:00:00",
  },
];

const recentScans = [
  { date: "2024-03-18", type: "OIG/SAM Daily", providers: 487, issues: 1, duration: "2m 34s" },
  { date: "2024-03-17", type: "OIG/SAM Daily", providers: 487, issues: 0, duration: "2m 28s" },
  { date: "2024-03-16", type: "License Weekly", providers: 487, issues: 3, duration: "8m 12s" },
  { date: "2024-03-16", type: "OIG/SAM Daily", providers: 485, issues: 0, duration: "2m 31s" },
  { date: "2024-03-15", type: "OIG/SAM Daily", providers: 485, issues: 0, duration: "2m 25s" },
];

const stats = [
  { label: "Providers Monitored", value: "487", trend: "up" as const, change: "+12 this month", icon: <Shield className="w-5 h-5" /> },
  { label: "Active Alerts", value: "4", trend: "warning" as const, change: "Needs attention", icon: <AlertTriangle className="w-5 h-5" /> },
  { label: "Critical Issues", value: "1", trend: "warning" as const, change: "Immediate action", icon: <XCircle className="w-5 h-5" /> },
  { label: "Last Scan", value: "2:00 AM", trend: "up" as const, change: "Today", icon: <Clock className="w-5 h-5" /> },
];

const getSeverityBadge = (severity: string) => {
  switch (severity) {
    case "critical":
      return <Badge variant="error">Critical</Badge>;
    case "high":
      return <Badge variant="error">High</Badge>;
    case "medium":
      return <Badge variant="warning">Medium</Badge>;
    case "low":
      return <Badge variant="info">Low</Badge>;
    default:
      return <Badge variant="default">{severity}</Badge>;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "open":
      return <Badge variant="warning">Open</Badge>;
    case "acknowledged":
      return <Badge variant="info">Acknowledged</Badge>;
    case "resolved":
      return <Badge variant="success">Resolved</Badge>;
    default:
      return <Badge variant="default">{status}</Badge>;
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "critical":
      return "border-l-red-500";
    case "high":
      return "border-l-orange-500";
    case "medium":
      return "border-l-yellow-500";
    case "low":
      return "border-l-blue-500";
    default:
      return "border-l-slate-500";
  }
};

export default function MonitoringPage() {
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = !severityFilter || alert.severity === severityFilter;
    const matchesStatus = !statusFilter || alert.status === statusFilter;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const openAlerts = alerts.filter((a) => a.status === "open" || a.status === "acknowledged");

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
              Compliance Monitoring
            </h1>
            <p className={cn("text-sm mt-1", isDark ? "text-slate-400" : "text-slate-500")}>
              Daily/weekly automated verification scans and alerts
            </p>
          </div>
        </div>
        <Button variant="primary">
          <RefreshCw className="w-4 h-4 mr-2" />
          Run Manual Scan
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

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts */}
        <div className="lg:col-span-2 space-y-4">
          <div className={cn(
            "flex flex-col sm:flex-row gap-4 p-4 rounded-xl border",
            isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          )}>
            <div className="flex-1">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search alerts..."
              />
            </div>
            <div className="flex gap-3">
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className={cn(
                  "px-3 py-2 rounded-lg border text-sm",
                  isDark ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-200 text-slate-900"
                )}
              >
                <option value="">All Severity</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={cn(
                  "px-3 py-2 rounded-lg border text-sm",
                  isDark ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-200 text-slate-900"
                )}
              >
                <option value="">All Status</option>
                <option value="open">Open</option>
                <option value="acknowledged">Acknowledged</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  "rounded-xl border border-l-4 p-4",
                  getSeverityColor(alert.severity),
                  isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {getSeverityBadge(alert.severity)}
                      {getStatusBadge(alert.status)}
                      <span className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>
                        {alert.type}
                      </span>
                    </div>
                    <h3 className={cn("font-semibold", isDark ? "text-white" : "text-slate-900")}>
                      {alert.provider}
                    </h3>
                    <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                      {alert.practice}
                    </p>
                  </div>
                  <span className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>
                    {new Date(alert.detected).toLocaleString()}
                  </span>
                </div>

                <p className={cn("text-sm mb-3", isDark ? "text-slate-300" : "text-slate-600")}>
                  {alert.description}
                </p>

                {alert.autoAction && (
                  <p className="text-sm text-amber-600 dark:text-amber-400 mb-3">
                    ⚡ Auto-action taken: {alert.autoAction}
                  </p>
                )}

                {alert.status === "acknowledged" && alert.acknowledgedBy && (
                  <p className={cn("text-xs mb-3", isDark ? "text-slate-500" : "text-slate-400")}>
                    Acknowledged by {alert.acknowledgedBy} on {new Date(alert.acknowledgedAt!).toLocaleString()}
                  </p>
                )}

                {alert.status === "resolved" && alert.resolvedBy && (
                  <p className={cn("text-xs mb-3", isDark ? "text-slate-500" : "text-slate-400")}>
                    Resolved by {alert.resolvedBy} on {new Date(alert.resolvedAt!).toLocaleString()}
                  </p>
                )}

                <div className="flex gap-2">
                  {alert.status === "open" && (
                    <>
                      <Button variant="secondary" size="sm">
                        Acknowledge
                      </Button>
                      <Button variant="primary" size="sm">
                        Take Action
                      </Button>
                    </>
                  )}
                  {alert.status === "acknowledged" && (
                    <Button variant="primary" size="sm">
                      Resolve
                    </Button>
                  )}
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    View Provider
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Scan Schedule */}
          <div className={cn(
            "rounded-xl border p-6",
            isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          )}>
            <h2 className={cn("text-lg font-semibold mb-4", isDark ? "text-white" : "text-slate-900")}>
              Scan Schedule
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className={cn("text-sm", isDark ? "text-slate-300" : "text-slate-600")}>
                    OIG/SAM Exclusion
                  </span>
                </div>
                <span className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>
                  Daily @ 2:00 AM
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className={cn("text-sm", isDark ? "text-slate-300" : "text-slate-600")}>
                    License Status
                  </span>
                </div>
                <span className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>
                  Weekly (Sat)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className={cn("text-sm", isDark ? "text-slate-300" : "text-slate-600")}>
                    DEA Status
                  </span>
                </div>
                <span className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>
                  Weekly (Sat)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className={cn("text-sm", isDark ? "text-slate-300" : "text-slate-600")}>
                    Medicare Opt-Out
                  </span>
                </div>
                <span className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>
                  Monthly (1st)
                </span>
              </div>
            </div>
          </div>

          {/* Recent Scans */}
          <div className={cn(
            "rounded-xl border p-6",
            isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          )}>
            <h2 className={cn("text-lg font-semibold mb-4", isDark ? "text-white" : "text-slate-900")}>
              Recent Scans
            </h2>
            <div className="space-y-3">
              {recentScans.map((scan, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-3 rounded-lg",
                    isDark ? "bg-slate-700/50" : "bg-slate-50"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>
                      {scan.type}
                    </span>
                    <span className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                      {scan.date}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                      {scan.providers} providers • {scan.duration}
                    </span>
                    {scan.issues > 0 ? (
                      <span className="text-xs text-red-500 font-medium">
                        {scan.issues} issue(s)
                      </span>
                    ) : (
                      <span className="text-xs text-green-500 font-medium flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Clear
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className={cn(
            "rounded-xl border p-6",
            isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          )}>
            <h2 className={cn("text-lg font-semibold mb-4", isDark ? "text-white" : "text-slate-900")}>
              This Month
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                  Total Scans
                </span>
                <span className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>
                  52
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                  Issues Detected
                </span>
                <span className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>
                  7
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                  Issues Resolved
                </span>
                <span className={cn("font-medium text-green-600", isDark ? "" : "")}>
                  5
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                  Avg. Resolution Time
                </span>
                <span className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>
                  18 hours
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
