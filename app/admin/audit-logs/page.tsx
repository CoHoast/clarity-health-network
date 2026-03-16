"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollText, Search, Download, Filter, X, User, Clock, AlertTriangle, CheckCircle, Eye, Shield, FileText, Lock, LogIn, LogOut, Settings, Edit, Trash2, Database, Activity, Globe, UserX, RefreshCw, Calendar } from "lucide-react";

type SeverityType = "info" | "warning" | "error" | "critical";
type CategoryType = "auth" | "phi_access" | "data_change" | "system" | "security" | "export";

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  userId: string;
  action: string;
  category: CategoryType;
  resource: string;
  resourceType: string;
  details: string;
  ip: string;
  userAgent: string;
  sessionId: string;
  severity: SeverityType;
  phiAccessed: boolean;
  success: boolean;
}

const auditLogs: AuditLog[] = [
  { id: "LOG-001", timestamp: "2024-03-12 15:42:33", user: "sarah.m@medcare.health", userId: "USR-001", action: "Claim Approved", category: "data_change", resource: "CLM-2024-156", resourceType: "Claim", details: "Approved claim for $450.00, changed status from 'pending' to 'approved'", ip: "192.168.1.45", userAgent: "Chrome/122.0 Windows", sessionId: "sess_abc123", severity: "info", phiAccessed: true, success: true },
  { id: "LOG-002", timestamp: "2024-03-12 15:38:12", user: "provider@metro.com", userId: "PRV-001", action: "Eligibility Verification", category: "phi_access", resource: "MEM-12847", resourceType: "Member", details: "Verified eligibility for John Smith (DOB: 1985-03-15)", ip: "203.45.67.89", userAgent: "Chrome/121.0 MacOS", sessionId: "sess_def456", severity: "info", phiAccessed: true, success: true },
  { id: "LOG-003", timestamp: "2024-03-12 15:35:45", user: "sarah.m@medcare.health", userId: "USR-001", action: "Fee Schedule Updated", category: "data_change", resource: "FS-001", resourceType: "Fee Schedule", details: "Updated 23 CPT codes in Primary Care fee schedule", ip: "192.168.1.45", userAgent: "Chrome/122.0 Windows", sessionId: "sess_abc123", severity: "warning", phiAccessed: false, success: true },
  { id: "LOG-004", timestamp: "2024-03-12 15:30:22", user: "member@email.com", userId: "MEM-001", action: "Login Success", category: "auth", resource: "AUTH", resourceType: "Authentication", details: "Successful login from new device", ip: "98.45.23.12", userAgent: "Safari/17.0 iOS", sessionId: "sess_ghi789", severity: "info", phiAccessed: false, success: true },
  { id: "LOG-005", timestamp: "2024-03-12 15:28:15", user: "unknown@attacker.com", userId: "N/A", action: "Login Failed", category: "security", resource: "AUTH", resourceType: "Authentication", details: "Failed login attempt - invalid password (attempt 3 of 5)", ip: "45.67.89.123", userAgent: "Python-urllib/3.11", sessionId: "N/A", severity: "error", phiAccessed: false, success: false },
  { id: "LOG-006", timestamp: "2024-03-12 15:25:00", user: "sarah.m@medcare.health", userId: "USR-001", action: "User Created", category: "data_change", resource: "USR-089", resourceType: "User", details: "Created new user: robert.t@medcare.health with role 'Analyst'", ip: "192.168.1.45", userAgent: "Chrome/122.0 Windows", sessionId: "sess_abc123", severity: "warning", phiAccessed: false, success: true },
  { id: "LOG-007", timestamp: "2024-03-12 15:20:33", user: "provider@cleveland.com", userId: "PRV-002", action: "Claim Submitted", category: "data_change", resource: "CLM-2024-157", resourceType: "Claim", details: "Submitted new claim for $1,250.00 - CPT: 99214", ip: "67.89.12.34", userAgent: "Edge/122.0 Windows", sessionId: "sess_jkl012", severity: "info", phiAccessed: true, success: true },
  { id: "LOG-008", timestamp: "2024-03-12 15:15:12", user: "sarah.m@medcare.health", userId: "USR-001", action: "System Config Changed", category: "system", resource: "SYS-CONFIG", resourceType: "System", details: "Modified password policy: min length 8→12 characters", ip: "192.168.1.45", userAgent: "Chrome/122.0 Windows", sessionId: "sess_abc123", severity: "warning", phiAccessed: false, success: true },
  { id: "LOG-009", timestamp: "2024-03-12 15:10:45", user: "api-service", userId: "SYS-001", action: "Batch Import", category: "data_change", resource: "837P-2024-001", resourceType: "Claims Batch", details: "Imported 156 claims from EDI file, 154 successful, 2 errors", ip: "10.0.0.5", userAgent: "API-Client/1.0", sessionId: "api_mno345", severity: "info", phiAccessed: true, success: true },
  { id: "LOG-010", timestamp: "2024-03-12 15:05:22", user: "unknown", userId: "N/A", action: "Unauthorized Access Attempt", category: "security", resource: "ADMIN", resourceType: "Admin Panel", details: "Attempted access to /admin/users without authentication", ip: "123.45.67.89", userAgent: "curl/7.88.0", sessionId: "N/A", severity: "critical", phiAccessed: false, success: false },
  { id: "LOG-011", timestamp: "2024-03-12 15:00:00", user: "james.w@medcare.health", userId: "USR-002", action: "PHI Export", category: "export", resource: "RPT-2024-089", resourceType: "Report", details: "Exported member roster report containing 1,234 member records", ip: "192.168.1.52", userAgent: "Chrome/122.0 Windows", sessionId: "sess_pqr678", severity: "warning", phiAccessed: true, success: true },
  { id: "LOG-012", timestamp: "2024-03-12 14:55:33", user: "emily.c@medcare.health", userId: "USR-003", action: "Provider Record Viewed", category: "phi_access", resource: "PRV-089", resourceType: "Provider", details: "Viewed provider profile: Cleveland Family Medicine (NPI: 1234567890)", ip: "192.168.1.60", userAgent: "Firefox/123.0 Windows", sessionId: "sess_stu901", severity: "info", phiAccessed: false, success: true },
  { id: "LOG-013", timestamp: "2024-03-12 14:50:15", user: "member@email.com", userId: "MEM-001", action: "Password Changed", category: "auth", resource: "AUTH", resourceType: "Authentication", details: "Member changed password successfully", ip: "98.45.23.12", userAgent: "Safari/17.0 iOS", sessionId: "sess_ghi789", severity: "info", phiAccessed: false, success: true },
  { id: "LOG-014", timestamp: "2024-03-12 14:45:00", user: "david.k@medcare.health", userId: "USR-006", action: "Fraud Alert Cleared", category: "data_change", resource: "FRD-2024-034", resourceType: "Fraud Alert", details: "Cleared fraud alert as false positive after investigation", ip: "192.168.1.75", userAgent: "Chrome/122.0 MacOS", sessionId: "sess_vwx234", severity: "warning", phiAccessed: true, success: true },
  { id: "LOG-015", timestamp: "2024-03-12 14:40:22", user: "sarah.m@medcare.health", userId: "USR-001", action: "User Role Modified", category: "data_change", resource: "USR-007", resourceType: "User", details: "Changed role from 'Member Services' to 'Claims Processor' for jennifer.l@medcare.health", ip: "192.168.1.45", userAgent: "Chrome/122.0 Windows", sessionId: "sess_abc123", severity: "warning", phiAccessed: false, success: true },
  { id: "LOG-016", timestamp: "2024-03-12 14:35:11", user: "unknown@test.com", userId: "N/A", action: "Account Locked", category: "security", resource: "AUTH", resourceType: "Authentication", details: "Account locked after 5 failed login attempts", ip: "45.67.89.123", userAgent: "Python-urllib/3.11", sessionId: "N/A", severity: "critical", phiAccessed: false, success: false },
  { id: "LOG-017", timestamp: "2024-03-12 14:30:00", user: "james.w@medcare.health", userId: "USR-002", action: "Member Record Accessed", category: "phi_access", resource: "MEM-23456", resourceType: "Member", details: "Accessed full member record including SSN and medical history", ip: "192.168.1.52", userAgent: "Chrome/122.0 Windows", sessionId: "sess_pqr678", severity: "info", phiAccessed: true, success: true },
  { id: "LOG-018", timestamp: "2024-03-12 14:25:45", user: "sarah.m@medcare.health", userId: "USR-001", action: "Logout", category: "auth", resource: "AUTH", resourceType: "Authentication", details: "User logged out", ip: "192.168.1.45", userAgent: "Chrome/122.0 Windows", sessionId: "sess_abc123", severity: "info", phiAccessed: false, success: true },
  { id: "LOG-019", timestamp: "2024-03-12 14:20:33", user: "api-service", userId: "SYS-001", action: "Database Backup", category: "system", resource: "DB-BACKUP", resourceType: "System", details: "Automated daily backup completed successfully (12.4 GB)", ip: "10.0.0.5", userAgent: "Backup-Service/2.0", sessionId: "sys_yz567", severity: "info", phiAccessed: true, success: true },
  { id: "LOG-020", timestamp: "2024-03-12 14:15:00", user: "lisa.r@medcare.health", userId: "USR-005", action: "Claim Denied", category: "data_change", resource: "CLM-2024-148", resourceType: "Claim", details: "Denied claim for $95.00 - Reason: Out of network provider", ip: "192.168.1.88", userAgent: "Chrome/122.0 Windows", sessionId: "sess_abc890", severity: "info", phiAccessed: true, success: true },
];

const categoryConfig: Record<CategoryType, { label: string; icon: React.ElementType; color: string }> = {
  auth: { label: "Authentication", icon: LogIn, color: "text-blue-400" },
  phi_access: { label: "PHI Access", icon: Eye, color: "text-cyan-500" },
  data_change: { label: "Data Change", icon: Edit, color: "text-amber-400" },
  system: { label: "System", icon: Settings, color: "text-slate-400" },
  security: { label: "Security", icon: Shield, color: "text-red-400" },
  export: { label: "Data Export", icon: Download, color: "text-green-400" },
};

const severityConfig: Record<SeverityType, { bg: string; text: string; icon: React.ElementType }> = {
  info: { bg: "bg-blue-500/20", text: "text-blue-400", icon: CheckCircle },
  warning: { bg: "bg-amber-500/20", text: "text-amber-400", icon: AlertTriangle },
  error: { bg: "bg-red-500/20", text: "text-red-400", icon: AlertTriangle },
  critical: { bg: "bg-red-600/30", text: "text-red-500", icon: AlertTriangle },
};

export default function AuditLogsPage() {
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPHI, setFilterPHI] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState("today");

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = filterSeverity === "all" || log.severity === filterSeverity;
    const matchesCategory = filterCategory === "all" || log.category === filterCategory;
    const matchesPHI = filterPHI === "all" || (filterPHI === "phi" ? log.phiAccessed : !log.phiAccessed);
    return matchesSearch && matchesSeverity && matchesCategory && matchesPHI;
  });

  const stats = {
    total: auditLogs.length,
    info: auditLogs.filter(l => l.severity === "info").length,
    warning: auditLogs.filter(l => l.severity === "warning").length,
    error: auditLogs.filter(l => l.severity === "error").length,
    critical: auditLogs.filter(l => l.severity === "critical").length,
    phiAccess: auditLogs.filter(l => l.phiAccessed).length,
    authEvents: auditLogs.filter(l => l.category === "auth").length,
    failedLogins: auditLogs.filter(l => l.action.includes("Failed") || l.action.includes("Locked")).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl flex items-center justify-center">
            <ScrollText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">HIPAA Audit Logs</h1>
            <p className="text-slate-400">Complete system activity and security events</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 border border-slate-600">
            <RefreshCw className="w-4 h-4" />Refresh
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
            <Download className="w-4 h-4" />Export Logs
          </button>
        </div>
      </div>

      {/* HIPAA Compliance Banner */}
      <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 border border-green-500/30 rounded-xl p-4 flex items-center gap-4">
        <Shield className="w-8 h-8 text-green-400" />
        <div>
          <p className="text-green-400 font-semibold">HIPAA Compliance Active</p>
          <p className="text-green-300/70 text-sm">All user actions, PHI access, and system events are being logged and retained for 6 years per HIPAA requirements</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-white">{stats.total.toLocaleString()}</p>
          <p className="text-sm text-slate-400">Total Events</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-blue-400">{stats.info}</p>
          <p className="text-sm text-slate-400">Info</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-amber-400">{stats.warning}</p>
          <p className="text-sm text-slate-400">Warnings</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-red-400">{stats.error + stats.critical}</p>
          <p className="text-sm text-slate-400">Errors</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-cyan-500">{stats.phiAccess}</p>
          <p className="text-sm text-slate-400">PHI Access</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-green-400">{stats.authEvents}</p>
          <p className="text-sm text-slate-400">Auth Events</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-red-500">{stats.failedLogins}</p>
          <p className="text-sm text-slate-400">Failed Logins</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-white">6 yrs</p>
          <p className="text-sm text-slate-400">Retention</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search logs by user, action, resource, or details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-600"
            />
          </div>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
          >
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="quarter">Last 90 Days</option>
            <option value="year">Last Year</option>
            <option value="custom">Custom Range</option>
          </select>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${showFilters ? "bg-teal-600 border-cyan-600 text-white" : "bg-slate-700 border-slate-600 text-white hover:bg-slate-600"}`}
          >
            <Filter className="w-4 h-4" />Filters
          </button>
        </div>
        
        {showFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="flex flex-wrap gap-4 pt-4 border-t border-slate-700"
          >
            <div>
              <label className="block text-xs text-slate-400 mb-1">Severity</label>
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
              >
                <option value="all">All Severities</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
              >
                <option value="all">All Categories</option>
                <option value="auth">Authentication</option>
                <option value="phi_access">PHI Access</option>
                <option value="data_change">Data Changes</option>
                <option value="system">System</option>
                <option value="security">Security</option>
                <option value="export">Data Export</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">PHI Access</label>
              <select
                value={filterPHI}
                onChange={(e) => setFilterPHI(e.target.value)}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
              >
                <option value="all">All Events</option>
                <option value="phi">PHI Accessed</option>
                <option value="non-phi">No PHI</option>
              </select>
            </div>
          </motion.div>
        )}
      </div>

      {/* Logs Table */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800 border-b border-slate-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Timestamp</th>
              <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">User</th>
              <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Category</th>
              <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Action</th>
              <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Resource</th>
              <th className="px-4 py-3 text-center text-xs text-slate-400 uppercase">PHI</th>
              <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Severity</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {filteredLogs.map((log) => {
              const severity = severityConfig[log.severity];
              const category = categoryConfig[log.category];
              const Icon = severity.icon;
              const CategoryIcon = category.icon;
              return (
                <tr key={log.id} className={`hover:bg-slate-800/80 ${!log.success ? "bg-red-900/10" : ""}`}>
                  <td className="px-4 py-3 text-slate-400 text-sm font-mono whitespace-nowrap">{log.timestamp}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-500" />
                      <span className="text-white text-sm">{log.user}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-sm ${category.color}`}>
                      <CategoryIcon className="w-3 h-3" />
                      {category.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white text-sm">{log.action}</td>
                  <td className="px-4 py-3 text-cyan-500 font-mono text-sm">{log.resource}</td>
                  <td className="px-4 py-3 text-center">
                    {log.phiAccessed ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-cyan-600/20 text-cyan-500 text-xs rounded-full">
                        <Lock className="w-3 h-3" />PHI
                      </span>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 w-fit ${severity.bg} ${severity.text}`}>
                      <Icon className="w-3 h-3" />{log.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelectedLog(log)} className="p-1.5 text-slate-400 hover:text-cyan-500 hover:bg-cyan-600/20 rounded">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="px-4 py-3 bg-slate-800/50 border-t border-slate-700 flex items-center justify-between">
          <span className="text-sm text-slate-500">Showing {filteredLogs.length} of {auditLogs.length} entries</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-slate-700 text-slate-300 rounded text-sm hover:bg-slate-600">Previous</button>
            <span className="px-3 py-1 bg-teal-600 text-white rounded text-sm">1</span>
            <button className="px-3 py-1 bg-slate-700 text-slate-300 rounded text-sm hover:bg-slate-600">2</button>
            <button className="px-3 py-1 bg-slate-700 text-slate-300 rounded text-sm hover:bg-slate-600">3</button>
            <button className="px-3 py-1 bg-slate-700 text-slate-300 rounded text-sm hover:bg-slate-600">Next</button>
          </div>
        </div>
      </div>

      {/* Log Detail Modal */}
      <AnimatePresence>
        {selectedLog && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedLog(null)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-700 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-cyan-500" />
                  <h3 className="font-semibold text-white">Audit Log Detail</h3>
                </div>
                <button onClick={() => setSelectedLog(null)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-4 space-y-4 overflow-y-auto flex-1">
                <div className="flex gap-2 flex-wrap">
                  {(() => {
                    const severity = severityConfig[selectedLog.severity];
                    const Icon = severity.icon;
                    return (
                      <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${severity.bg} ${severity.text}`}>
                        <Icon className="w-3 h-3" />{selectedLog.severity.toUpperCase()}
                      </span>
                    );
                  })()}
                  {selectedLog.phiAccessed && (
                    <span className="px-2 py-1 text-xs rounded-full flex items-center gap-1 bg-cyan-600/20 text-cyan-500">
                      <Lock className="w-3 h-3" />PHI ACCESSED
                    </span>
                  )}
                  {!selectedLog.success && (
                    <span className="px-2 py-1 text-xs rounded-full flex items-center gap-1 bg-red-500/20 text-red-400">
                      <X className="w-3 h-3" />FAILED
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <p className="text-xs text-slate-400 mb-1">Event ID</p>
                    <p className="text-white font-mono">{selectedLog.id}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <p className="text-xs text-slate-400 mb-1">Timestamp</p>
                    <p className="text-white text-sm">{selectedLog.timestamp}</p>
                  </div>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">User</p>
                  <p className="text-white">{selectedLog.user}</p>
                  <p className="text-xs text-slate-500">User ID: {selectedLog.userId}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <p className="text-xs text-slate-400 mb-1">Action</p>
                    <p className="text-white">{selectedLog.action}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <p className="text-xs text-slate-400 mb-1">Category</p>
                    <p className={categoryConfig[selectedLog.category].color}>{categoryConfig[selectedLog.category].label}</p>
                  </div>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">Resource</p>
                  <p className="text-cyan-500 font-mono">{selectedLog.resource}</p>
                  <p className="text-xs text-slate-500">Type: {selectedLog.resourceType}</p>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">Details</p>
                  <p className="text-white text-sm">{selectedLog.details}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <p className="text-xs text-slate-400 mb-1">IP Address</p>
                    <p className="text-white font-mono text-sm">{selectedLog.ip}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <p className="text-xs text-slate-400 mb-1">Session ID</p>
                    <p className="text-white font-mono text-sm">{selectedLog.sessionId}</p>
                  </div>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">User Agent</p>
                  <p className="text-white text-sm">{selectedLog.userAgent}</p>
                </div>
              </div>
              <div className="flex gap-2 p-4 border-t border-slate-700 flex-shrink-0">
                <button onClick={() => setSelectedLog(null)} className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Close</button>
                <button className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4" />Generate Report
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
