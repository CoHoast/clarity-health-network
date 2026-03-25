"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Eye,
  Calendar,
  Activity,
  Search,
  Filter,
  Settings,
  Play,
  Pause,
  Bell,
  X,
  User,
  FileText,
  Ban,
  Undo,
  History,
  TrendingUp,
  BarChart3,
  Zap,
  ExternalLink,
} from "lucide-react";
import { useTheme } from "@/components/admin/ThemeContext";
import { StatCard } from "@/components/admin/ui/StatCard";
import { Badge } from "@/components/admin/ui/Badge";
import { Button } from "@/components/admin/ui/Button";
import { SearchInput } from "@/components/admin/ui/SearchInput";
import { cn } from "@/lib/utils";

// Monitoring schedule
const monitoringSchedule = [
  { type: "OIG Exclusion", frequency: "Daily", time: "2:00 AM", source: "OIG LEIE", autoAction: "Auto-suspend", enabled: true },
  { type: "SAM Exclusion", frequency: "Daily", time: "2:00 AM", source: "SAM.gov", autoAction: "Auto-suspend", enabled: true },
  { type: "License Status", frequency: "Weekly", time: "Saturday 3:00 AM", source: "State Boards", autoAction: "Alert", enabled: true },
  { type: "DEA Status", frequency: "Weekly", time: "Saturday 3:00 AM", source: "DEA", autoAction: "Alert", enabled: true },
  { type: "NPI Status", frequency: "Weekly", time: "Saturday 3:00 AM", source: "NPPES", autoAction: "Alert", enabled: true },
  { type: "Medicare Opt-Out", frequency: "Monthly", time: "1st @ 4:00 AM", source: "CMS", autoAction: "Alert", enabled: true },
  { type: "Death Master File", frequency: "Monthly", time: "1st @ 4:00 AM", source: "SSA DMF", autoAction: "Auto-suspend", enabled: false },
];

const alerts = [
  {
    id: 1,
    severity: "critical",
    provider: "Dr. Michael Brown",
    providerId: "prov-123",
    practice: "Brown Medical Associates",
    npi: "1234567890",
    type: "OIG Exclusion",
    checkType: "oig",
    description: "Provider found on OIG LEIE exclusion list",
    details: "Exclusion effective date: March 1, 2024. Reason: Patient abuse/neglect (1128(a)(2)). Minimum exclusion period: 5 years.",
    detected: "2024-03-18T08:00:00",
    status: "open",
    autoAction: "Suspended pending review",
    providerSuspended: true,
    actionRequired: "Review case, confirm exclusion, notify provider, terminate if confirmed",
  },
  {
    id: 2,
    severity: "high",
    provider: "Dr. Robert Kim",
    providerId: "prov-456",
    practice: "Skin Care Associates",
    npi: "2345678901",
    type: "License Suspended",
    checkType: "license",
    description: "State medical license suspended by OH Medical Board",
    details: "License OH-MD-789012 suspended effective March 15, 2024. Board action pending investigation.",
    detected: "2024-03-17T14:30:00",
    status: "acknowledged",
    acknowledgedBy: "Jane Smith",
    acknowledgedAt: "2024-03-17T16:00:00",
    providerSuspended: false,
    actionRequired: "Contact provider, verify status, consider suspension",
  },
  {
    id: 3,
    severity: "medium",
    provider: "Dr. Sarah Chen",
    providerId: "prov-789",
    practice: "Lakeside Family Medicine",
    npi: "3456789012",
    type: "License Expiring",
    checkType: "license",
    description: "State license expires in 28 days (April 15, 2024)",
    details: "License OH-MD-456789 set to expire. Provider has not submitted renewal documentation.",
    detected: "2024-03-18T02:00:00",
    status: "open",
    providerSuspended: false,
    actionRequired: "Send reminder to provider, request updated license",
  },
  {
    id: 4,
    severity: "medium",
    provider: "Valley Health Center",
    providerId: "prov-012",
    practice: "Valley Health Center",
    npi: "4567890123",
    type: "Malpractice Expiring",
    checkType: "malpractice",
    description: "Malpractice COI expires in 21 days (April 8, 2024)",
    details: "Policy PLM-456789 with ABC Insurance expires April 8. Minimum required coverage: $1M/$3M.",
    detected: "2024-03-18T02:00:00",
    status: "open",
    providerSuspended: false,
    actionRequired: "Request updated COI from provider",
  },
  {
    id: 5,
    severity: "low",
    provider: "Dr. Emily Watson",
    providerId: "prov-345",
    practice: "Watson Pediatrics",
    npi: "5678901234",
    type: "Address Change",
    checkType: "npi",
    description: "NPPES address differs from records - verify update",
    details: "NPPES shows new address: 456 Medical Drive, Cleveland, OH 44102. Current records show: 123 Health St.",
    detected: "2024-03-15T02:00:00",
    status: "resolved",
    resolvedBy: "Mike Johnson",
    resolvedAt: "2024-03-16T10:00:00",
    resolution: "Verified address change with provider, records updated",
    providerSuspended: false,
  },
  {
    id: 6,
    severity: "critical",
    provider: "Dr. James Anderson",
    providerId: "prov-678",
    practice: "Anderson Family Practice",
    npi: "6789012345",
    type: "SAM Exclusion",
    checkType: "sam",
    description: "Provider found on SAM.gov debarment list",
    details: "Debarred from federal contracts effective February 15, 2024. Cross-listed with OIG exclusion.",
    detected: "2024-03-18T02:15:00",
    status: "open",
    autoAction: "Suspended pending review",
    providerSuspended: true,
    actionRequired: "Immediate termination required for federal exclusion",
  },
];

// Generate dynamic scan history based on provider count
const generateRecentScans = (providerCount: number) => {
  const today = new Date();
  return [
    { id: 1, date: new Date(today.getTime() - 0 * 24 * 60 * 60 * 1000).toISOString(), type: "OIG/SAM Daily", providers: providerCount, issues: 2, duration: "4m 12s", status: "completed" },
    { id: 2, date: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(), type: "OIG/SAM Daily", providers: providerCount, issues: 0, duration: "4m 08s", status: "completed" },
    { id: 3, date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), type: "License Weekly", providers: providerCount, issues: 3, duration: "12m 45s", status: "completed" },
    { id: 4, date: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(), type: "OIG/SAM Daily", providers: providerCount - 5, issues: 0, duration: "4m 05s", status: "completed" },
    { id: 5, date: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(), type: "OIG/SAM Daily", providers: providerCount - 5, issues: 0, duration: "4m 02s", status: "completed" },
    { id: 6, date: new Date(today.getTime() - 9 * 24 * 60 * 60 * 1000).toISOString(), type: "License Weekly", providers: providerCount - 12, issues: 1, duration: "12m 18s", status: "completed" },
    { id: 7, date: new Date(today.getTime() - 23 * 24 * 60 * 60 * 1000).toISOString(), type: "Medicare Opt-Out", providers: providerCount - 20, issues: 0, duration: "5m 30s", status: "completed" },
  ];
};

// Generate dynamic weekly stats based on provider count  
const generateWeeklyStats = (providerCount: number) => [
  { day: "Mon", oig: providerCount, sam: providerCount, license: 0, issues: 0 },
  { day: "Tue", oig: providerCount, sam: providerCount, license: 0, issues: 1 },
  { day: "Wed", oig: providerCount, sam: providerCount, license: 0, issues: 0 },
  { day: "Thu", oig: providerCount, sam: providerCount, license: 0, issues: 0 },
  { day: "Fri", oig: providerCount, sam: providerCount, license: 0, issues: 0 },
  { day: "Sat", oig: providerCount, sam: providerCount, license: providerCount, issues: 3 },
  { day: "Sun", oig: providerCount, sam: providerCount, license: 0, issues: 2 },
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

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case "critical":
      return "🔴";
    case "high":
      return "🟠";
    case "medium":
      return "🟡";
    case "low":
      return "🔵";
    default:
      return "⚪";
  }
};

export default function MonitoringPage() {
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [activeTab, setActiveTab] = useState<"alerts" | "history" | "settings">("alerts");
  const [selectedAlert, setSelectedAlert] = useState<any | null>(null);
  const [showRunModal, setShowRunModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<typeof monitoringSchedule[0] | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);
  const [showCriticalAlertsModal, setShowCriticalAlertsModal] = useState(false);
  const [selectedScan, setSelectedScan] = useState<ReturnType<typeof generateRecentScans>[0] | null>(null);
  
  // Real data from API
  const [alerts, setAlerts] = useState<any[]>([]);
  const [expiringCredentials, setExpiringCredentials] = useState<any[]>([]);
  const [monitoringStats, setMonitoringStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [totalProviders, setTotalProviders] = useState(3600);
  
  // Generate dynamic data based on actual provider count
  const recentScans = generateRecentScans(totalProviders);
  const weeklyStats = generateWeeklyStats(totalProviders);
  
  // Fetch monitoring data from API
  useEffect(() => {
    async function fetchMonitoringData() {
      try {
        const res = await fetch('/api/monitoring');
        if (res.ok) {
          const data = await res.json();
          setAlerts(data.alerts || []);
          setExpiringCredentials(data.expiring || []);
          setMonitoringStats(data.stats || null);
          setTotalProviders(data.totalProviders || 3600);
        }
      } catch (error) {
        console.error('Failed to fetch monitoring data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchMonitoringData();
  }, []);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAcknowledge = (e: React.MouseEvent, alert: typeof alerts[0]) => {
    e.stopPropagation();
    showToast(`Alert acknowledged for ${alert.provider}`, 'info');
  };

  const handleTakeAction = (e: React.MouseEvent, alert: typeof alerts[0]) => {
    e.stopPropagation();
    setSelectedAlert(alert);
  };

  const handleResolve = (e: React.MouseEvent, alert: typeof alerts[0]) => {
    e.stopPropagation();
    showToast(`Alert resolved for ${alert.provider}`, 'success');
  };

  const handleReinstate = (e: React.MouseEvent, alert: typeof alerts[0]) => {
    e.stopPropagation();
    showToast(`Provider ${alert.provider} has been reinstated`, 'success');
  };

  const handleReviewCritical = () => {
    // Show modal with all critical alerts
    setShowCriticalAlertsModal(true);
  };

  const handleSelectCriticalAlert = (alert: typeof alerts[0]) => {
    setShowCriticalAlertsModal(false);
    setActiveTab("alerts");
    setSeverityFilter("critical");
    setSelectedAlert(alert);
  };

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = !severityFilter || alert.severity === severityFilter;
    const matchesStatus = !statusFilter || alert.status === statusFilter;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const openAlerts = alerts.filter((a) => a.status === "open" || a.status === "acknowledged");
  const criticalAlerts = alerts.filter((a) => a.severity === "critical" && a.status !== "resolved");

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
              Compliance Monitoring
            </h1>
            <p className={cn("text-sm mt-1", isDark ? "text-slate-400" : "text-slate-500")}>
              Automated verification scans and real-time alerts
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" icon={<Settings className="w-4 h-4" />} onClick={() => setActiveTab("settings")}>
            Configure
          </Button>
          <Button variant="primary" icon={<Play className="w-4 h-4" />} onClick={() => setShowRunModal(true)}>
            Run Manual Scan
          </Button>
        </div>
      </div>

      {/* Critical Alert Banner */}
      {criticalAlerts.length > 0 && (
        <div className={cn(
          "rounded-xl border-2 border-red-500 bg-red-50 dark:bg-red-900/20 p-4"
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="font-semibold text-red-700 dark:text-red-400">
                  {criticalAlerts.length} Critical Alert{criticalAlerts.length > 1 ? 's' : ''} Require Immediate Action
                </p>
                <p className="text-sm text-red-600 dark:text-red-400/80">
                  {criticalAlerts.filter(a => a.providerSuspended).length} provider(s) auto-suspended
                </p>
              </div>
            </div>
            <Button variant="primary" size="sm" onClick={handleReviewCritical}>
              Review Now
            </Button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Providers Monitored"
          value={loading ? "..." : totalProviders.toLocaleString()}
          trend="up"
          change={`${totalProviders} in network`}
          icon={<Shield className="w-5 h-5" />}
        />
        <StatCard
          label="Active Alerts"
          value={loading ? "..." : String(alerts.filter(a => a.status !== "resolved").length)}
          trend={alerts.filter(a => a.status !== "resolved").length > 0 ? "warning" : "up"}
          change="Needs attention"
          icon={<AlertTriangle className="w-5 h-5" />}
        />
        <StatCard
          label="Critical Issues"
          value={loading ? "..." : String(alerts.filter(a => a.severity === "critical").length)}
          trend={alerts.filter(a => a.severity === "critical").length > 0 ? "warning" : "up"}
          change="Immediate action"
          icon={<XCircle className="w-5 h-5" />}
        />
        <StatCard
          label="Auto-Suspended"
          value={loading ? "..." : String(alerts.filter(a => a.providerSuspended).length)}
          trend="neutral"
          change="Pending review"
          icon={<Ban className="w-5 h-5" />}
        />
      </div>

      {/* Tabs */}
      <div className={cn(
        "flex gap-1 p-1 rounded-lg w-fit",
        isDark ? "bg-slate-800" : "bg-slate-100"
      )}>
        {[
          { id: "alerts", label: "Active Alerts", icon: AlertTriangle, count: openAlerts.length },
          { id: "history", label: "Scan History", icon: History },
          { id: "settings", label: "Configuration", icon: Settings },
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
            {tab.count !== undefined && (
              <span className={cn(
                "px-2 py-0.5 rounded-full text-xs",
                activeTab === tab.id
                  ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
              )}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Alerts Tab */}
      {activeTab === "alerts" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Alerts List */}
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
                    "rounded-xl border border-l-4 p-4 cursor-pointer transition-colors",
                    getSeverityColor(alert.severity),
                    isDark ? "bg-slate-800 border-slate-700 hover:bg-slate-750" : "bg-white border-slate-200 hover:bg-slate-50"
                  )}
                  onClick={() => setSelectedAlert(alert)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span>{getSeverityIcon(alert.severity)}</span>
                        {getSeverityBadge(alert.severity)}
                        {getStatusBadge(alert.status)}
                        {alert.providerSuspended && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs rounded-full">
                            <Ban className="w-3 h-3" />
                            Suspended
                          </span>
                        )}
                      </div>
                      <h3 className={cn("font-semibold", isDark ? "text-white" : "text-slate-900")}>
                        {alert.provider}
                      </h3>
                      <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                        {alert.practice} • {alert.type}
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
                    <p className="text-sm text-amber-600 dark:text-amber-400 mb-3 flex items-center gap-1">
                      <Zap className="w-4 h-4" />
                      Auto-action: {alert.autoAction}
                    </p>
                  )}

                  <div className="flex gap-2">
                    {alert.status === "open" && (
                      <>
                        <Button variant="secondary" size="sm" onClick={(e) => handleAcknowledge(e, alert)}>
                          Acknowledge
                        </Button>
                        <Button variant="primary" size="sm" onClick={(e) => handleTakeAction(e, alert)}>
                          Take Action
                        </Button>
                      </>
                    )}
                    {alert.status === "acknowledged" && (
                      <Button variant="primary" size="sm" onClick={(e) => handleResolve(e, alert)}>
                        Resolve
                      </Button>
                    )}
                    {alert.providerSuspended && (
                      <Button variant="secondary" size="sm" icon={<Undo className="w-4 h-4" />} onClick={(e) => handleReinstate(e, alert)}>
                        Reinstate
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              {filteredAlerts.length === 0 && (
                <div className={cn(
                  "rounded-xl border p-12 text-center",
                  isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
                )}>
                  <CheckCircle className={cn("w-12 h-12 mx-auto mb-4", "text-green-500")} />
                  <h3 className={cn("text-lg font-medium mb-2", isDark ? "text-white" : "text-slate-900")}>
                    All Clear!
                  </h3>
                  <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                    No alerts match your current filters.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Next Scans */}
            <div className={cn(
              "rounded-xl border p-6",
              isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
            )}>
              <h2 className={cn("text-lg font-semibold mb-4 flex items-center gap-2", isDark ? "text-white" : "text-slate-900")}>
                <Clock className="w-5 h-5 text-blue-500" />
                Next Scheduled Scans
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <div>
                    <p className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>OIG/SAM Daily</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">{totalProviders.toLocaleString()} providers</p>
                  </div>
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                    Tomorrow 2:00 AM
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                  <div>
                    <p className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>License/DEA Weekly</p>
                    <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>{totalProviders.toLocaleString()} providers</p>
                  </div>
                  <span className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                    Saturday 3:00 AM
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                  <div>
                    <p className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>Medicare Opt-Out</p>
                    <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>{totalProviders.toLocaleString()} providers</p>
                  </div>
                  <span className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                    April 1 @ 4:00 AM
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className={cn(
              "rounded-xl border p-6",
              isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
            )}>
              <h2 className={cn("text-lg font-semibold mb-4 flex items-center gap-2", isDark ? "text-white" : "text-slate-900")}>
                <BarChart3 className="w-5 h-5 text-purple-500" />
                This Week
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>OIG Checks</span>
                    <span className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>3,409</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full">
                    <div className="h-2 bg-green-500 rounded-full" style={{ width: "100%" }} />
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">1 issue found</p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>SAM Checks</span>
                    <span className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>3,409</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full">
                    <div className="h-2 bg-green-500 rounded-full" style={{ width: "100%" }} />
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">1 issue found</p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>License Checks</span>
                    <span className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>{totalProviders.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full">
                    <div className="h-2 bg-yellow-500 rounded-full" style={{ width: "99%" }} />
                  </div>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">3 issues found</p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>NPI Checks</span>
                    <span className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>{totalProviders.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full">
                    <div className="h-2 bg-green-500 rounded-full" style={{ width: "100%" }} />
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">0 issues</p>
                </div>
              </div>
            </div>

            {/* Response Times */}
            <div className={cn(
              "rounded-xl border p-6",
              isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
            )}>
              <h2 className={cn("text-lg font-semibold mb-4 flex items-center gap-2", isDark ? "text-white" : "text-slate-900")}>
                <TrendingUp className="w-5 h-5 text-green-500" />
                Response Metrics
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>Avg. Response Time</span>
                  <span className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>4.2 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>Avg. Resolution Time</span>
                  <span className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>18 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>Issues This Month</span>
                  <span className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>7</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>Resolved</span>
                  <span className="font-medium text-green-600">5 (71%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === "history" && (
        <div className={cn(
          "rounded-xl border overflow-hidden",
          isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
        )}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={cn("border-b", isDark ? "border-slate-700 bg-slate-700/50" : "border-slate-200 bg-slate-50")}>
                  <th className="text-left px-4 py-3 text-sm font-medium">Date/Time</th>
                  <th className="text-left px-4 py-3 text-sm font-medium">Scan Type</th>
                  <th className="text-left px-4 py-3 text-sm font-medium">Providers</th>
                  <th className="text-left px-4 py-3 text-sm font-medium">Duration</th>
                  <th className="text-left px-4 py-3 text-sm font-medium">Result</th>
                  <th className="text-right px-4 py-3 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentScans.map((scan) => (
                  <tr
                    key={scan.id}
                    className={cn("border-b", isDark ? "border-slate-700 hover:bg-slate-700/50" : "border-slate-100 hover:bg-slate-50")}
                  >
                    <td className="px-4 py-3">
                      {new Date(scan.date).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-medium">{scan.type}</td>
                    <td className="px-4 py-3">{scan.providers}</td>
                    <td className="px-4 py-3">{scan.duration}</td>
                    <td className="px-4 py-3">
                      {scan.issues > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs rounded-full">
                          <AlertTriangle className="w-3 h-3" />
                          {scan.issues} issue(s)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full">
                          <CheckCircle className="w-3 h-3" />
                          Clear
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedScan(scan)}>
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

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scan Configuration */}
          <div className={cn(
            "rounded-xl border p-6",
            isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          )}>
            <h2 className={cn("text-lg font-semibold mb-4", isDark ? "text-white" : "text-slate-900")}>
              Monitoring Schedule
            </h2>
            <p className={cn("text-sm mb-6", isDark ? "text-slate-400" : "text-slate-500")}>
              Configure automated verification scan schedules and auto-actions.
            </p>

            <div className="space-y-4">
              {monitoringSchedule.map((item, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-lg border",
                    isDark ? "bg-slate-700/50 border-slate-600" : "bg-slate-50 border-slate-200"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                      <div className="w-9 h-5 bg-slate-300 peer-checked:bg-blue-500 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                    </label>
                    <div>
                      <p className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>
                        {item.type}
                      </p>
                      <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                        {item.source} • {item.frequency} @ {item.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {item.autoAction === "Auto-suspend" ? (
                      <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs rounded-full">
                        Auto-suspend
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs rounded-full">
                        Alert Only
                      </span>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedSchedule(item);
                        setShowScheduleModal(true);
                      }}
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Auto-Action Rules */}
          <div className={cn(
            "rounded-xl border p-6",
            isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          )}>
            <h2 className={cn("text-lg font-semibold mb-4", isDark ? "text-white" : "text-slate-900")}>
              Auto-Action Rules
            </h2>
            <p className={cn("text-sm mb-6", isDark ? "text-slate-400" : "text-slate-500")}>
              Configure automatic actions taken when issues are detected.
            </p>

            <div className="space-y-4">
              {[
                { severity: "🔴 Critical", action: "Auto-suspend provider", description: "OIG exclusion, SAM debarment, license revoked. Claims halted immediately per CMS/federal requirements.", enabled: true, autoSuspend: true },
                { severity: "🟠 High", action: "Alert team immediately", description: "License suspended, DEA expired/revoked. Human review required before any action.", enabled: true, autoSuspend: false },
                { severity: "🟡 Medium", action: "Alert within 24 hours", description: "License expiring (<30 days), malpractice expiring, DEA expiring. Send renewal reminders.", enabled: true, autoSuspend: false },
                { severity: "🔵 Low", action: "Log for review", description: "Address changes, contact updates, minor discrepancies. No immediate action needed.", enabled: true, autoSuspend: false },
              ].map((rule, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-4 rounded-lg border",
                    rule.autoSuspend 
                      ? (isDark ? "bg-red-900/20 border-red-800" : "bg-red-50 border-red-200")
                      : (isDark ? "bg-slate-700/50 border-slate-600" : "bg-slate-50 border-slate-200")
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>
                        {rule.severity}
                      </span>
                      {rule.autoSuspend && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-red-500 text-white rounded">
                          AUTO-SUSPEND
                        </span>
                      )}
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={rule.enabled} className="sr-only peer" />
                      <div className="w-9 h-5 bg-slate-300 peer-checked:bg-blue-500 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                    </label>
                  </div>
                  <p className={cn("text-sm font-medium mb-1", rule.autoSuspend ? "text-red-600 dark:text-red-400" : "text-blue-600 dark:text-blue-400")}>
                    {rule.action}
                  </p>
                  <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                    {rule.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t" style={{ borderColor: isDark ? '#334155' : '#e2e8f0' }}>
              <h3 className={cn("font-medium mb-4", isDark ? "text-white" : "text-slate-900")}>
                Notification Settings
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={cn("text-sm", isDark ? "text-slate-300" : "text-slate-600")}>
                    Email alerts for critical issues
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-9 h-5 bg-slate-300 peer-checked:bg-blue-500 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span className={cn("text-sm", isDark ? "text-slate-300" : "text-slate-600")}>
                    Daily scan summary email
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-9 h-5 bg-slate-300 peer-checked:bg-blue-500 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span className={cn("text-sm", isDark ? "text-slate-300" : "text-slate-600")}>
                    Weekly compliance report
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-9 h-5 bg-slate-300 peer-checked:bg-blue-500 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className={cn(
            "w-full max-w-2xl rounded-xl max-h-[90vh] overflow-y-auto",
            isDark ? "bg-slate-800" : "bg-white"
          )}>
            <div className={cn("flex items-center justify-between p-4 border-b", isDark ? "border-slate-700" : "border-slate-200")}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getSeverityIcon(selectedAlert.severity)}</span>
                <div>
                  <h2 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-slate-900")}>
                    {selectedAlert.type}
                  </h2>
                  <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                    Alert #{selectedAlert.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAlert(null)}
                className={cn("p-2 rounded-lg", isDark ? "hover:bg-slate-700" : "hover:bg-slate-100")}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Banner */}
              {selectedAlert.providerSuspended && (
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-3">
                    <Ban className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="font-medium text-red-700 dark:text-red-400">Provider Auto-Suspended</p>
                      <p className="text-sm text-red-600 dark:text-red-400/80">
                        Claims processing halted. Review and take action.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Provider Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={cn("text-xs uppercase tracking-wider", isDark ? "text-slate-500" : "text-slate-400")}>
                    Provider
                  </label>
                  <p className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>
                    {selectedAlert.provider}
                  </p>
                </div>
                <div>
                  <label className={cn("text-xs uppercase tracking-wider", isDark ? "text-slate-500" : "text-slate-400")}>
                    Practice
                  </label>
                  <p className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>
                    {selectedAlert.practice}
                  </p>
                </div>
                <div>
                  <label className={cn("text-xs uppercase tracking-wider", isDark ? "text-slate-500" : "text-slate-400")}>
                    NPI
                  </label>
                  <p className={cn("font-mono", isDark ? "text-white" : "text-slate-900")}>
                    {selectedAlert.npi}
                  </p>
                </div>
                <div>
                  <label className={cn("text-xs uppercase tracking-wider", isDark ? "text-slate-500" : "text-slate-400")}>
                    Detected
                  </label>
                  <p className={cn("", isDark ? "text-white" : "text-slate-900")}>
                    {new Date(selectedAlert.detected).toLocaleString()}
                  </p>
                </div>
              </div>
              
              {/* View Full Profile Button */}
              <Link 
                href={`/admin/providers/practice-${selectedAlert.npi}/${selectedAlert.providerId || `prov-${selectedAlert.npi}`}`}
                className={cn(
                  "flex items-center justify-center gap-2 w-full py-3 rounded-lg border font-medium transition-colors",
                  isDark 
                    ? "bg-slate-700 border-slate-600 text-white hover:bg-slate-600" 
                    : "bg-white border-slate-300 text-slate-900 hover:bg-slate-50"
                )}
              >
                <User className="w-4 h-4" />
                View Full Provider Profile
                <ChevronRight className="w-4 h-4" />
              </Link>

              {/* Details */}
              <div>
                <label className={cn("text-xs uppercase tracking-wider block mb-2", isDark ? "text-slate-500" : "text-slate-400")}>
                  Details
                </label>
                <div className={cn(
                  "p-4 rounded-lg",
                  isDark ? "bg-slate-700/50" : "bg-slate-50"
                )}>
                  <p className={cn("text-sm", isDark ? "text-slate-300" : "text-slate-600")}>
                    {selectedAlert.details}
                  </p>
                </div>
              </div>

              {/* Action Required */}
              <div>
                <label className={cn("text-xs uppercase tracking-wider block mb-2", isDark ? "text-slate-500" : "text-slate-400")}>
                  Action Required
                </label>
                <div className={cn(
                  "p-4 rounded-lg border-l-4 border-amber-500",
                  isDark ? "bg-amber-900/20" : "bg-amber-50"
                )}>
                  <p className={cn("text-sm", isDark ? "text-amber-300" : "text-amber-800")}>
                    {selectedAlert.actionRequired}
                  </p>
                </div>
              </div>

              {/* Demo Data Warning */}
              <div className={cn(
                "p-3 rounded-lg border flex items-center gap-3",
                isDark ? "bg-amber-900/20 border-amber-700" : "bg-amber-50 border-amber-300"
              )}>
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <div>
                  <p className={cn("text-sm font-medium", isDark ? "text-amber-400" : "text-amber-700")}>
                    Sample Alert Data
                  </p>
                  <p className={cn("text-xs", isDark ? "text-amber-400/80" : "text-amber-600")}>
                    This is simulated data for demonstration. Use verification links to check actual status.
                  </p>
                </div>
              </div>

              {/* Verify at Source - Direct Links */}
              <div>
                <label className={cn("text-xs uppercase tracking-wider block mb-2", isDark ? "text-slate-500" : "text-slate-400")}>
                  Verify at Source
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {/* OIG Link */}
                  {(selectedAlert.type?.includes("OIG") || selectedAlert.checkType === "oig") && (
                    <div className={cn(
                      "p-3 rounded-lg border",
                      isDark ? "bg-slate-700/50 border-slate-600" : "bg-blue-50 border-blue-200"
                    )}>
                      <a
                        href={`https://exclusions.oig.hhs.gov/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "flex items-center gap-2 transition-colors",
                          isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-700 hover:text-blue-800"
                        )}
                      >
                        <ExternalLink className="w-4 h-4" />
                        <p className="font-medium text-sm">OIG LEIE Database</p>
                      </a>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(selectedAlert.provider?.split(',')[0] || selectedAlert.provider);
                          showToast('Provider name copied to clipboard', 'info');
                        }}
                        className={cn(
                          "mt-2 text-xs px-2 py-1 rounded flex items-center gap-1 w-full justify-center",
                          isDark ? "bg-slate-600 hover:bg-slate-500 text-slate-300" : "bg-blue-100 hover:bg-blue-200 text-blue-700"
                        )}
                      >
                        📋 Copy name to search
                      </button>
                    </div>
                  )}
                  
                  {/* SAM.gov Link */}
                  {(selectedAlert.type?.includes("SAM") || selectedAlert.checkType === "sam") && (
                    <div className={cn(
                      "p-3 rounded-lg border",
                      isDark ? "bg-slate-700/50 border-slate-600" : "bg-blue-50 border-blue-200"
                    )}>
                      <a
                        href={`https://sam.gov/content/exclusions`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "flex items-center gap-2 transition-colors",
                          isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-700 hover:text-blue-800"
                        )}
                      >
                        <ExternalLink className="w-4 h-4" />
                        <p className="font-medium text-sm">SAM.gov Exclusions</p>
                      </a>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(selectedAlert.provider?.split(',')[0] || selectedAlert.provider);
                          showToast('Provider name copied to clipboard', 'info');
                        }}
                        className={cn(
                          "mt-2 text-xs px-2 py-1 rounded flex items-center gap-1 w-full justify-center",
                          isDark ? "bg-slate-600 hover:bg-slate-500 text-slate-300" : "bg-blue-100 hover:bg-blue-200 text-blue-700"
                        )}
                      >
                        📋 Copy name to search
                      </button>
                    </div>
                  )}
                  
                  {/* State License Board Link */}
                  {(selectedAlert.type?.includes("License") || selectedAlert.checkType === "license") && (
                    <a
                      href={`https://www.azmd.gov/glsuiteweb/clients/azbom/public/WebVerificationSearch.aspx`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "flex items-center gap-2 p-3 rounded-lg border transition-colors",
                        isDark 
                          ? "bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-blue-400" 
                          : "bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700"
                      )}
                    >
                      <ExternalLink className="w-4 h-4" />
                      <div>
                        <p className="font-medium text-sm">AZ Medical Board</p>
                        <p className={cn("text-xs", isDark ? "text-slate-400" : "text-blue-600")}>
                          Verify License Status
                        </p>
                      </div>
                    </a>
                  )}
                  
                  {/* DEA Link */}
                  {(selectedAlert.type?.includes("DEA") || selectedAlert.checkType === "dea") && (
                    <a
                      href={`https://apps.deadiversion.usdoj.gov/webforms2/spring/validationLogin`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "flex items-center gap-2 p-3 rounded-lg border transition-colors",
                        isDark 
                          ? "bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-blue-400" 
                          : "bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700"
                      )}
                    >
                      <ExternalLink className="w-4 h-4" />
                      <div>
                        <p className="font-medium text-sm">DEA Registration</p>
                        <p className={cn("text-xs", isDark ? "text-slate-400" : "text-blue-600")}>
                          Verify DEA Status
                        </p>
                      </div>
                    </a>
                  )}
                  
                  {/* NPI Registry Link - Always show */}
                  <a
                    href={`https://npiregistry.cms.hhs.gov/search?number=${selectedAlert.npi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "flex items-center gap-2 p-3 rounded-lg border transition-colors",
                      isDark 
                        ? "bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-blue-400" 
                        : "bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700"
                    )}
                  >
                    <ExternalLink className="w-4 h-4" />
                    <div>
                      <p className="font-medium text-sm">NPPES Registry</p>
                      <p className={cn("text-xs", isDark ? "text-slate-400" : "text-blue-600")}>
                        NPI: {selectedAlert.npi}
                      </p>
                    </div>
                  </a>
                  
                  {/* Malpractice - NPDB */}
                  {(selectedAlert.type?.includes("Malpractice") || selectedAlert.checkType === "malpractice") && (
                    <a
                      href={`https://www.npdb.hrsa.gov/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "flex items-center gap-2 p-3 rounded-lg border transition-colors",
                        isDark 
                          ? "bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-blue-400" 
                          : "bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700"
                      )}
                    >
                      <ExternalLink className="w-4 h-4" />
                      <div>
                        <p className="font-medium text-sm">NPDB</p>
                        <p className={cn("text-xs", isDark ? "text-slate-400" : "text-blue-600")}>
                          National Practitioner Data Bank
                        </p>
                      </div>
                    </a>
                  )}
                </div>
              </div>

              {/* Auto-Suspend Policy Note */}
              {selectedAlert.severity === "critical" && (
                <div className={cn(
                  "p-4 rounded-lg border",
                  isDark ? "bg-red-900/10 border-red-800" : "bg-red-50 border-red-200"
                )}>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                      <p className={cn("font-medium text-sm", isDark ? "text-red-400" : "text-red-700")}>
                        Auto-Suspend Policy
                      </p>
                      <p className={cn("text-xs mt-1", isDark ? "text-red-400/80" : "text-red-600")}>
                        Critical alerts (OIG/SAM exclusions, license revocations) trigger automatic suspension per CMS compliance requirements. 
                        Human review is required before reinstatement.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Resolution (if resolved) */}
              {selectedAlert.status === "resolved" && selectedAlert.resolution && (
                <div>
                  <label className={cn("text-xs uppercase tracking-wider block mb-2", isDark ? "text-slate-500" : "text-slate-400")}>
                    Resolution
                  </label>
                  <div className={cn(
                    "p-4 rounded-lg border-l-4 border-green-500",
                    isDark ? "bg-green-900/20" : "bg-green-50"
                  )}>
                    <p className={cn("text-sm", isDark ? "text-green-300" : "text-green-800")}>
                      {selectedAlert.resolution}
                    </p>
                    <p className={cn("text-xs mt-2", isDark ? "text-green-400" : "text-green-600")}>
                      Resolved by {selectedAlert.resolvedBy} on {new Date(selectedAlert.resolvedAt!).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className={cn("flex justify-between gap-3 p-4 border-t", isDark ? "border-slate-700" : "border-slate-200")}>
              <Button variant="secondary" onClick={() => setSelectedAlert(null)}>
                Close
              </Button>
              <div className="flex gap-3">
                {selectedAlert.providerSuspended && (
                  <Button 
                    variant="secondary" 
                    icon={<Undo className="w-4 h-4" />}
                    onClick={() => {
                      showToast(`Provider ${selectedAlert.provider} has been reinstated`, 'success');
                      setSelectedAlert(null);
                    }}
                  >
                    Reinstate Provider
                  </Button>
                )}
                {selectedAlert.status === "open" && (
                  <>
                    <Button 
                      variant="secondary"
                      onClick={() => {
                        showToast(`Alert acknowledged for ${selectedAlert.provider}`, 'info');
                        setSelectedAlert(null);
                      }}
                    >
                      Acknowledge
                    </Button>
                    <Button 
                      variant="primary"
                      onClick={() => {
                        showToast(`Action taken for ${selectedAlert.provider} - Provider notified`, 'success');
                        setSelectedAlert(null);
                      }}
                    >
                      Take Action
                    </Button>
                  </>
                )}
                {selectedAlert.status === "acknowledged" && (
                  <Button 
                    variant="primary"
                    onClick={() => {
                      showToast(`Alert resolved for ${selectedAlert.provider}`, 'success');
                      setSelectedAlert(null);
                    }}
                  >
                    Mark Resolved
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Run Manual Scan Modal */}
      {showRunModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className={cn(
            "w-full max-w-md rounded-xl",
            isDark ? "bg-slate-800" : "bg-white"
          )}>
            <div className={cn("flex items-center justify-between p-4 border-b", isDark ? "border-slate-700" : "border-slate-200")}>
              <h2 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-slate-900")}>
                Run Manual Scan
              </h2>
              <button
                onClick={() => setShowRunModal(false)}
                className={cn("p-2 rounded-lg", isDark ? "hover:bg-slate-700" : "hover:bg-slate-100")}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                Select the verification checks to run immediately:
              </p>

              <div className="space-y-2">
                {["OIG Exclusion Check", "SAM.gov Debarment Check", "License Status Verification", "DEA Status Verification", "NPI Status Check"].map((check) => (
                  <label
                    key={check}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg cursor-pointer border",
                      isDark ? "bg-slate-700/50 border-slate-600 hover:bg-slate-700" : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                    )}
                  >
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                    <span className={cn("text-sm", isDark ? "text-white" : "text-slate-900")}>{check}</span>
                  </label>
                ))}
              </div>

              <div>
                <label className={cn("block text-sm font-medium mb-2", isDark ? "text-slate-300" : "text-slate-700")}>
                  Scope
                </label>
                <select className={cn(
                  "w-full px-3 py-2 rounded-lg border text-sm",
                  isDark ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-200 text-slate-900"
                )}>
                  <option>All Active Providers ({totalProviders.toLocaleString()})</option>
                  <option>Providers with expiring credentials</option>
                  <option>Recently added providers (last 30 days)</option>
                  <option>Specific provider...</option>
                </select>
              </div>
            </div>

            <div className={cn("flex justify-end gap-3 p-4 border-t", isDark ? "border-slate-700" : "border-slate-200")}>
              <Button variant="secondary" onClick={() => setShowRunModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" icon={<Play className="w-4 h-4" />} onClick={() => setShowRunModal(false)}>
                Start Scan
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Settings Modal */}
      <AnimatePresence>
        {showScheduleModal && selectedSchedule && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => { setShowScheduleModal(false); setSelectedSchedule(null); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={cn(
                "w-full max-w-md rounded-xl",
                isDark ? "bg-slate-800" : "bg-white"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={cn("p-4 border-b", isDark ? "border-slate-700" : "border-slate-200")}>
                <h2 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-slate-900")}>
                  Configure {selectedSchedule.type} Scan
                </h2>
                <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                  Source: {selectedSchedule.source}
                </p>
              </div>

              <div className="p-6 space-y-5">
                {/* Enable/Disable */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>
                      Enable Scan
                    </p>
                    <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                      Run this verification check automatically
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={selectedSchedule.enabled} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-300 peer-checked:bg-blue-500 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>

                {/* Frequency */}
                <div>
                  <label className={cn("block text-sm font-medium mb-2", isDark ? "text-slate-300" : "text-slate-700")}>
                    Frequency
                  </label>
                  <select 
                    defaultValue={selectedSchedule.frequency}
                    className={cn(
                      "w-full px-3 py-2 rounded-lg border text-sm",
                      isDark ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-200 text-slate-900"
                    )}
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>

                {/* Time */}
                <div>
                  <label className={cn("block text-sm font-medium mb-2", isDark ? "text-slate-300" : "text-slate-700")}>
                    Run Time
                  </label>
                  <input
                    type="time"
                    defaultValue="02:00"
                    className={cn(
                      "w-full px-3 py-2 rounded-lg border text-sm",
                      isDark ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-200 text-slate-900"
                    )}
                  />
                  <p className={cn("text-xs mt-1", isDark ? "text-slate-500" : "text-slate-400")}>
                    Scans run during off-peak hours to minimize system load
                  </p>
                </div>

                {/* Auto Action */}
                <div>
                  <label className={cn("block text-sm font-medium mb-2", isDark ? "text-slate-300" : "text-slate-700")}>
                    When Issue Detected
                  </label>
                  <select 
                    defaultValue={selectedSchedule.autoAction}
                    className={cn(
                      "w-full px-3 py-2 rounded-lg border text-sm",
                      isDark ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-200 text-slate-900"
                    )}
                  >
                    <option value="Auto-suspend">Auto-suspend provider</option>
                    <option value="Alert">Alert team only</option>
                    <option value="Log">Log for review</option>
                  </select>
                  {selectedSchedule.autoAction === "Auto-suspend" && (
                    <p className={cn("text-xs mt-2 p-2 rounded", isDark ? "bg-red-900/30 text-red-400" : "bg-red-50 text-red-600")}>
                      ⚠️ Auto-suspend will immediately halt claims processing for flagged providers
                    </p>
                  )}
                </div>

                {/* Notification Settings */}
                <div className={cn("pt-4 border-t", isDark ? "border-slate-700" : "border-slate-200")}>
                  <p className={cn("font-medium mb-3", isDark ? "text-white" : "text-slate-900")}>
                    Notifications
                  </p>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-blue-500 focus:ring-blue-500" />
                      <span className={cn("text-sm", isDark ? "text-slate-300" : "text-slate-600")}>
                        Email alerts when issues found
                      </span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-blue-500 focus:ring-blue-500" />
                      <span className={cn("text-sm", isDark ? "text-slate-300" : "text-slate-600")}>
                        Dashboard notification badge
                      </span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-500 focus:ring-blue-500" />
                      <span className={cn("text-sm", isDark ? "text-slate-300" : "text-slate-600")}>
                        SMS alerts for critical issues
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className={cn("flex justify-end gap-3 p-4 border-t", isDark ? "border-slate-700" : "border-slate-200")}>
                <Button variant="secondary" onClick={() => { setShowScheduleModal(false); setSelectedSchedule(null); }}>
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  icon={<CheckCircle className="w-4 h-4" />}
                  onClick={() => { 
                    showToast('Schedule settings saved', 'success');
                    setShowScheduleModal(false); 
                    setSelectedSchedule(null); 
                  }}
                >
                  Save Settings
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scan Details Modal */}
      <AnimatePresence>
        {selectedScan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedScan(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={cn(
                "w-full max-w-2xl rounded-xl p-6 max-h-[80vh] overflow-y-auto",
                isDark ? "bg-slate-800" : "bg-white"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    isDark ? "bg-blue-900/30" : "bg-blue-100"
                  )}>
                    <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 className={cn("text-xl font-semibold", isDark ? "text-white" : "text-slate-900")}>
                      Scan Details
                    </h2>
                    <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                      {selectedScan.type} • {new Date(selectedScan.date).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedScan(null)}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    isDark ? "hover:bg-slate-700 text-slate-400" : "hover:bg-slate-100 text-slate-500"
                  )}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scan Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className={cn("p-4 rounded-lg", isDark ? "bg-slate-700/50" : "bg-slate-50")}>
                  <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Status</p>
                  <p className={cn("text-lg font-semibold capitalize", isDark ? "text-white" : "text-slate-900")}>
                    {selectedScan.status}
                  </p>
                </div>
                <div className={cn("p-4 rounded-lg", isDark ? "bg-slate-700/50" : "bg-slate-50")}>
                  <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Providers Scanned</p>
                  <p className={cn("text-lg font-semibold", isDark ? "text-white" : "text-slate-900")}>
                    {selectedScan.providers}
                  </p>
                </div>
                <div className={cn("p-4 rounded-lg", isDark ? "bg-slate-700/50" : "bg-slate-50")}>
                  <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Duration</p>
                  <p className={cn("text-lg font-semibold", isDark ? "text-white" : "text-slate-900")}>
                    {selectedScan.duration}
                  </p>
                </div>
                <div className={cn("p-4 rounded-lg", selectedScan.issues > 0 
                  ? "bg-red-100 dark:bg-red-900/30" 
                  : "bg-green-100 dark:bg-green-900/30"
                )}>
                  <p className={cn("text-xs", selectedScan.issues > 0 
                    ? "text-red-600 dark:text-red-400" 
                    : "text-green-600 dark:text-green-400"
                  )}>Issues Found</p>
                  <p className={cn("text-lg font-semibold", selectedScan.issues > 0 
                    ? "text-red-700 dark:text-red-300" 
                    : "text-green-700 dark:text-green-300"
                  )}>
                    {selectedScan.issues}
                  </p>
                </div>
              </div>

              {/* Scan Type Details */}
              <div className={cn("p-4 rounded-lg border mb-6", isDark ? "bg-slate-700/30 border-slate-600" : "bg-slate-50 border-slate-200")}>
                <h3 className={cn("font-semibold mb-3", isDark ? "text-white" : "text-slate-900")}>
                  Verification Sources Checked
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedScan.type.includes("OIG") && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className={cn("text-sm", isDark ? "text-slate-300" : "text-slate-700")}>
                        OIG LEIE Exclusion List
                      </span>
                    </div>
                  )}
                  {selectedScan.type.includes("SAM") && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className={cn("text-sm", isDark ? "text-slate-300" : "text-slate-700")}>
                        SAM.gov Exclusions
                      </span>
                    </div>
                  )}
                  {selectedScan.type.includes("License") && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className={cn("text-sm", isDark ? "text-slate-300" : "text-slate-700")}>
                        State License Status
                      </span>
                    </div>
                  )}
                  {selectedScan.type.includes("Medicare") && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className={cn("text-sm", isDark ? "text-slate-300" : "text-slate-700")}>
                        Medicare Opt-Out List
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Issues Found (if any) */}
              {selectedScan.issues > 0 && (
                <div className={cn("p-4 rounded-lg border mb-6", "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800")}>
                  <h3 className="font-semibold mb-3 text-red-700 dark:text-red-300 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Issues Detected
                  </h3>
                  <div className="space-y-2">
                    {selectedScan.issues === 2 && (
                      <>
                        <div className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400">
                          <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>Dr. Michael Brown - Found on OIG LEIE exclusion list</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400">
                          <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>Dr. Robert Kim - State medical license suspended</span>
                        </div>
                      </>
                    )}
                    {selectedScan.issues === 3 && (
                      <>
                        <div className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400">
                          <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>Dr. Lisa Chen - License expired (needs renewal)</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400">
                          <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>Dr. James Wilson - License status changed to "Inactive"</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400">
                          <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>Dr. Sarah Johnson - Board certification expired</span>
                        </div>
                      </>
                    )}
                    {selectedScan.issues === 1 && (
                      <div className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400">
                        <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Dr. Emily Martinez - DEA registration expiring in 30 days</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* No Issues */}
              {selectedScan.issues === 0 && (
                <div className={cn("p-4 rounded-lg border mb-6", "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800")}>
                  <div className="flex items-center gap-3 text-green-700 dark:text-green-300">
                    <CheckCircle className="w-6 h-6" />
                    <div>
                      <p className="font-semibold">All Clear</p>
                      <p className="text-sm">No compliance issues detected in this scan.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                <Button 
                  variant="secondary" 
                  icon={<RefreshCw className="w-4 h-4" />}
                  onClick={() => {
                    showToast('Re-running scan...', 'info');
                    setSelectedScan(null);
                  }}
                >
                  Re-run This Scan
                </Button>
                <Button variant="ghost" onClick={() => setSelectedScan(null)}>
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Critical Alerts Modal */}
      <AnimatePresence>
        {showCriticalAlertsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCriticalAlertsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={cn(
                "w-full max-w-2xl rounded-xl p-6 max-h-[80vh] overflow-y-auto",
                isDark ? "bg-slate-800" : "bg-white"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                    <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h2 className={cn("text-xl font-semibold", isDark ? "text-white" : "text-slate-900")}>
                      Critical Alerts
                    </h2>
                    <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                      {criticalAlerts.length} alert{criticalAlerts.length !== 1 ? 's' : ''} requiring immediate attention
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCriticalAlertsModal(false)}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    isDark ? "hover:bg-slate-700 text-slate-400" : "hover:bg-slate-100 text-slate-500"
                  )}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Alert List */}
              <div className="space-y-3">
                {criticalAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    onClick={() => handleSelectCriticalAlert(alert)}
                    className={cn(
                      "p-4 rounded-lg border-2 cursor-pointer transition-all",
                      isDark 
                        ? "bg-slate-700/50 border-red-800 hover:border-red-600 hover:bg-slate-700" 
                        : "bg-red-50 border-red-200 hover:border-red-400 hover:bg-red-100"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "p-2 rounded-lg",
                          isDark ? "bg-red-900/50" : "bg-red-100"
                        )}>
                          <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                          <p className={cn("font-semibold", isDark ? "text-white" : "text-slate-900")}>
                            {alert.provider}
                          </p>
                          <p className={cn("text-sm mt-1", isDark ? "text-slate-300" : "text-slate-700")}>
                            {alert.type}
                          </p>
                          <p className={cn("text-xs mt-1", isDark ? "text-slate-400" : "text-slate-500")}>
                            {alert.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>
                              Detected: {new Date(alert.detected).toLocaleDateString()}
                            </span>
                            {alert.providerSuspended && (
                              <span className="text-xs px-2 py-0.5 rounded bg-red-600 text-white">
                                Auto-Suspended
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className={cn("w-5 h-5", isDark ? "text-slate-500" : "text-slate-400")} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex justify-between mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                <Button 
                  variant="secondary" 
                  onClick={() => {
                    setShowCriticalAlertsModal(false);
                    setActiveTab("alerts");
                    setSeverityFilter("critical");
                  }}
                >
                  View All in Alerts Tab
                </Button>
                <Button variant="ghost" onClick={() => setShowCriticalAlertsModal(false)}>
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={cn(
              "fixed bottom-6 right-6 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50",
              toast.type === 'success' && "bg-green-600 text-white",
              toast.type === 'info' && "bg-blue-600 text-white",
              toast.type === 'warning' && "bg-amber-600 text-white"
            )}
          >
            {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
            {toast.type === 'info' && <AlertCircle className="w-5 h-5" />}
            {toast.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
