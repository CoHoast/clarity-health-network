"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  BadgeCheck,
  Zap,
  Users,
  Shield,
  RefreshCw,
  ArrowRight,
  Send,
  Calendar,
  AlertCircle,
  TrendingUp,
  Eye,
} from "lucide-react";
import { useTheme } from "@/components/admin/ThemeContext";
import { StatCard } from "@/components/admin/ui/StatCard";
import { Button } from "@/components/admin/ui/Button";
import { Badge } from "@/components/admin/ui/Badge";
import { cn } from "@/lib/utils";

// Dashboard stats
const stats = [
  { label: "Total Applications", value: "156", trend: "up" as const, change: "+24 this month", icon: <FileText className="w-5 h-5" /> },
  { label: "Pending Review", value: "34", trend: "warning" as const, change: "Awaiting action", icon: <Clock className="w-5 h-5" /> },
  { label: "Approved (YTD)", value: "89", trend: "up" as const, change: "+12 vs last year", icon: <CheckCircle className="w-5 h-5" /> },
  { label: "Avg. Processing", value: "12 days", trend: "up" as const, change: "-3 days improved", icon: <Zap className="w-5 h-5" /> },
];

// Recent applications
const recentApplications = [
  { id: "CRED-2024-1247", provider: "Dr. Sarah Mitchell", specialty: "Cardiology", status: "verification", submitted: "Mar 10, 2024", stage: "PSV In Progress" },
  { id: "CRED-2024-1246", provider: "Dr. James Wilson", specialty: "Orthopedics", status: "review", submitted: "Mar 8, 2024", stage: "Ready for Review" },
  { id: "CRED-2024-1245", provider: "Metro Imaging Center", specialty: "Radiology", status: "approved", submitted: "Mar 5, 2024", stage: "Complete" },
  { id: "CRED-2024-1244", provider: "Dr. Emily Chen", specialty: "Pediatrics", status: "verification", submitted: "Mar 3, 2024", stage: "Document Review" },
];

// Compliance alerts
const alerts = [
  { id: 1, severity: "critical", provider: "Dr. Michael Brown", issue: "OIG Exclusion Found", detected: "Today", action: "Immediate Review Required" },
  { id: 2, severity: "warning", provider: "Dr. Sarah Chen", issue: "License expires in 28 days", detected: "Mar 15", action: "Send Renewal Reminder" },
  { id: 3, severity: "warning", provider: "Valley Health Center", issue: "Malpractice COI expires in 21 days", detected: "Mar 12", action: "Request Updated COI" },
];

// Pending document requests
const documentRequests = [
  { id: 1, provider: "Dr. Sarah Mitchell", requested: "Mar 14", expires: "Mar 28", status: "3/5 uploaded", progress: 60 },
  { id: 2, provider: "Dr. James Wilson", requested: "Mar 12", expires: "Mar 26", status: "Not started", progress: 0 },
  { id: 3, provider: "Cleveland PT Group", requested: "Mar 10", expires: "Mar 24", status: "Complete", progress: 100 },
];

// Re-credentialing due
const recredDue = [
  { days: 30, count: 12 },
  { days: 60, count: 18 },
  { days: 90, count: 23 },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case "review": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    case "verification": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "denied": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    default: return "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300";
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "critical": return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
    case "warning": return "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800";
    default: return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
  }
};

export default function CredentialingDashboardPage() {
  const { isDark } = useTheme();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>
            Credentialing Dashboard
          </h1>
          <p className={cn("text-sm mt-1", isDark ? "text-slate-400" : "text-slate-500")}>
            Overview of provider credentialing status and compliance
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/credentialing/applications">
            <Button variant="secondary">
              <FileText className="w-4 h-4 mr-2" />
              View All Applications
            </Button>
          </Link>
          <Button variant="primary">
            <BadgeCheck className="w-4 h-4 mr-2" />
            New Application
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Recent Applications & Alerts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Applications */}
          <div className={cn(
            "rounded-xl border p-6",
            isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          )}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-slate-900")}>
                Recent Applications
              </h2>
              <Link href="/admin/credentialing/applications" className="text-cyan-600 hover:text-cyan-700 text-sm font-medium flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentApplications.map((app) => (
                <div
                  key={app.id}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-lg",
                    isDark ? "bg-slate-700/50" : "bg-slate-50"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      isDark ? "bg-cyan-900/50 text-cyan-400" : "bg-cyan-100 text-cyan-600"
                    )}>
                      <BadgeCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>
                        {app.provider}
                      </p>
                      <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                        {app.specialty} • {app.id}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                        {app.stage}
                      </p>
                      <p className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>
                        Submitted {app.submitted}
                      </p>
                    </div>
                    <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", getStatusColor(app.status))}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance Alerts */}
          <div className={cn(
            "rounded-xl border p-6",
            isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          )}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h2 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-slate-900")}>
                  Compliance Alerts
                </h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                  {alerts.length} Active
                </span>
              </div>
              <Link href="/admin/credentialing/monitoring" className="text-cyan-600 hover:text-cyan-700 text-sm font-medium flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={cn(
                    "p-4 rounded-lg border",
                    getSeverityColor(alert.severity)
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        {alert.severity === "critical" ? (
                          <XCircle className="w-4 h-4" />
                        ) : (
                          <AlertCircle className="w-4 h-4" />
                        )}
                        <span className="font-medium">{alert.provider}</span>
                      </div>
                      <p className="text-sm mt-1">{alert.issue}</p>
                      <p className="text-xs mt-1 opacity-75">Detected: {alert.detected}</p>
                    </div>
                    <Button variant="secondary" size="sm">
                      {alert.action}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Quick Actions & Status */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className={cn(
            "rounded-xl border p-6",
            isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          )}>
            <h2 className={cn("text-lg font-semibold mb-4", isDark ? "text-white" : "text-slate-900")}>
              Quick Actions
            </h2>
            <div className="space-y-2">
              <Link href="/admin/credentialing/applications" className="block">
                <Button variant="secondary" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-3" />
                  New Application
                </Button>
              </Link>
              <Link href="/admin/credentialing/review" className="block">
                <Button variant="secondary" className="w-full justify-start">
                  <Eye className="w-4 h-4 mr-3" />
                  Review Queue (12)
                </Button>
              </Link>
              <Link href="/admin/credentialing/document-requests" className="block">
                <Button variant="secondary" className="w-full justify-start">
                  <Send className="w-4 h-4 mr-3" />
                  Request Documents
                </Button>
              </Link>
              <Button variant="secondary" className="w-full justify-start">
                <RefreshCw className="w-4 h-4 mr-3" />
                Run Verification
              </Button>
            </div>
          </div>

          {/* Document Requests Status */}
          <div className={cn(
            "rounded-xl border p-6",
            isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          )}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-slate-900")}>
                Document Requests
              </h2>
              <Link href="/admin/credentialing/document-requests" className="text-cyan-600 hover:text-cyan-700 text-sm">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {documentRequests.map((req) => (
                <div key={req.id} className={cn(
                  "p-3 rounded-lg",
                  isDark ? "bg-slate-700/50" : "bg-slate-50"
                )}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>
                      {req.provider}
                    </span>
                    <span className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                      {req.status}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-1.5">
                    <div
                      className={cn(
                        "h-1.5 rounded-full",
                        req.progress === 100 ? "bg-green-500" : "bg-cyan-500"
                      )}
                      style={{ width: `${req.progress}%` }}
                    />
                  </div>
                  <p className={cn("text-xs mt-1", isDark ? "text-slate-500" : "text-slate-400")}>
                    Expires: {req.expires}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Re-Credentialing Due */}
          <div className={cn(
            "rounded-xl border p-6",
            isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          )}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-slate-900")}>
                Re-Credentialing Due
              </h2>
              <Link href="/admin/credentialing/recredentialing" className="text-cyan-600 hover:text-cyan-700 text-sm">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {recredDue.map((item) => (
                <div key={item.days} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className={cn("w-4 h-4", isDark ? "text-slate-400" : "text-slate-500")} />
                    <span className={cn("text-sm", isDark ? "text-slate-300" : "text-slate-600")}>
                      Within {item.days} days
                    </span>
                  </div>
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-sm font-medium",
                    item.days <= 30 
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      : item.days <= 60
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  )}>
                    {item.count} providers
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Last Monitoring Run */}
          <div className={cn(
            "rounded-xl border p-6",
            isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          )}>
            <h2 className={cn("text-lg font-semibold mb-4", isDark ? "text-white" : "text-slate-900")}>
              Monitoring Status
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                  Last OIG/SAM Scan
                </span>
                <span className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>
                  Today, 2:00 AM
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                  Providers Monitored
                </span>
                <span className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>
                  487
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                  Issues Found
                </span>
                <span className="text-sm font-medium text-red-600 dark:text-red-400">
                  3
                </span>
              </div>
              <div className="pt-2">
                <Link href="/admin/credentialing/monitoring">
                  <Button variant="secondary" size="sm" className="w-full">
                    <Shield className="w-4 h-4 mr-2" />
                    View Monitoring Details
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
