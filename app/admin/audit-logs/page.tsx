"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollText, Search, Download, Filter, X, User, Clock, AlertTriangle, CheckCircle, Eye, Shield, FileText, Lock, LogIn, LogOut, Settings, Edit, Trash2, Database, Activity, Globe, UserX, RefreshCw, Calendar } from "lucide-react";
import { useTheme } from "@/components/admin/ThemeContext";
import { Card } from "@/components/admin/ui/Card";
import { Button } from "@/components/admin/ui/Button";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { SearchInput } from "@/components/admin/ui/SearchInput";
import { Badge } from "@/components/admin/ui/Badge";
import { cn } from "@/lib/utils";

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
  { id: "LOG-001", timestamp: "2024-03-12 15:42:33", user: "sarah.m@truecare.health", userId: "USR-001", action: "Claim Approved", category: "data_change", resource: "CLM-2024-156", resourceType: "Claim", details: "Approved claim for $450.00", ip: "192.168.1.45", userAgent: "Chrome/122.0 Windows", sessionId: "sess_abc123", severity: "info", phiAccessed: true, success: true },
  { id: "LOG-002", timestamp: "2024-03-12 15:38:12", user: "provider@metro.com", userId: "PRV-001", action: "Eligibility Verification", category: "phi_access", resource: "MEM-12847", resourceType: "Member", details: "Verified eligibility for John Smith", ip: "203.45.67.89", userAgent: "Chrome/121.0 MacOS", sessionId: "sess_def456", severity: "info", phiAccessed: true, success: true },
  { id: "LOG-003", timestamp: "2024-03-12 15:35:45", user: "sarah.m@truecare.health", userId: "USR-001", action: "Fee Schedule Updated", category: "data_change", resource: "FS-001", resourceType: "Fee Schedule", details: "Updated 23 CPT codes in Primary Care fee schedule", ip: "192.168.1.45", userAgent: "Chrome/122.0 Windows", sessionId: "sess_abc123", severity: "warning", phiAccessed: false, success: true },
  { id: "LOG-004", timestamp: "2024-03-12 15:30:22", user: "member@email.com", userId: "MEM-001", action: "Login Success", category: "auth", resource: "AUTH", resourceType: "Authentication", details: "Successful login from new device", ip: "98.45.23.12", userAgent: "Safari/17.0 iOS", sessionId: "sess_ghi789", severity: "info", phiAccessed: false, success: true },
  { id: "LOG-005", timestamp: "2024-03-12 15:28:15", user: "unknown@attacker.com", userId: "N/A", action: "Login Failed", category: "security", resource: "AUTH", resourceType: "Authentication", details: "Failed login attempt - invalid password", ip: "45.67.89.123", userAgent: "Python-urllib/3.11", sessionId: "N/A", severity: "error", phiAccessed: false, success: false },
  { id: "LOG-006", timestamp: "2024-03-12 15:25:00", user: "sarah.m@truecare.health", userId: "USR-001", action: "User Created", category: "data_change", resource: "USR-089", resourceType: "User", details: "Created new user: robert.t@truecare.health", ip: "192.168.1.45", userAgent: "Chrome/122.0 Windows", sessionId: "sess_abc123", severity: "warning", phiAccessed: false, success: true },
  { id: "LOG-007", timestamp: "2024-03-12 15:20:33", user: "provider@cleveland.com", userId: "PRV-002", action: "Claim Submitted", category: "data_change", resource: "CLM-2024-157", resourceType: "Claim", details: "Submitted new claim for $1,250.00", ip: "67.89.12.34", userAgent: "Edge/122.0 Windows", sessionId: "sess_jkl012", severity: "info", phiAccessed: true, success: true },
  { id: "LOG-008", timestamp: "2024-03-12 15:15:12", user: "sarah.m@truecare.health", userId: "USR-001", action: "System Config Changed", category: "system", resource: "SYS-CONFIG", resourceType: "System", details: "Modified password policy", ip: "192.168.1.45", userAgent: "Chrome/122.0 Windows", sessionId: "sess_abc123", severity: "warning", phiAccessed: false, success: true },
];

const categoryConfig: Record<CategoryType, { label: string; icon: React.ElementType; color: string; lightColor: string }> = {
  auth: { label: "Authentication", icon: LogIn, color: "text-blue-400", lightColor: "text-blue-600" },
  phi_access: { label: "PHI Access", icon: Eye, color: "text-blue-400", lightColor: "text-blue-600" },
  data_change: { label: "Data Change", icon: Edit, color: "text-amber-400", lightColor: "text-amber-600" },
  system: { label: "System", icon: Settings, color: "text-slate-400", lightColor: "text-slate-600" },
  security: { label: "Security", icon: Shield, color: "text-red-400", lightColor: "text-red-600" },
  export: { label: "Data Export", icon: Download, color: "text-green-400", lightColor: "text-green-600" },
};

export default function AuditLogsPage() {
  const { isDark } = useTheme();
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.resource.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = filterSeverity === "all" || log.severity === filterSeverity;
    const matchesCategory = filterCategory === "all" || log.category === filterCategory;
    return matchesSearch && matchesSeverity && matchesCategory;
  });

  const stats = [
    { label: "Total Events", value: auditLogs.length.toString() },
    { label: "PHI Access", value: auditLogs.filter(l => l.phiAccessed).length.toString() },
    { label: "Auth Events", value: auditLogs.filter(l => l.category === "auth").length.toString() },
    { label: "Warnings", value: auditLogs.filter(l => l.severity === "warning" || l.severity === "error").length.toString() },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="HIPAA Audit Logs"
        subtitle="Complete system activity and security events"
        actions={
          <>
            <Button variant="outline" icon={<RefreshCw className="w-4 h-4" />}>Refresh</Button>
            <Button variant="primary" icon={<Download className="w-4 h-4" />}>Export Logs</Button>
          </>
        }
      />

      {/* HIPAA Compliance Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl p-4 flex items-center gap-4">
        <Shield className="w-8 h-8 text-white" />
        <div>
          <p className="font-semibold text-white">HIPAA Compliance Active</p>
          <p className="text-sm text-white/85">All user actions, PHI access, and system events are logged and retained for 6 years</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} padding="md">
            <p className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>{stat.value}</p>
            <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card padding="md">
        <div className="flex flex-col sm:flex-row gap-4">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search logs by user, action, or resource..."
            className="flex-1"
          />
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className={cn(
              "px-4 py-2.5 rounded-lg text-sm",
              isDark ? "bg-slate-800 border-slate-600 text-white" : "bg-white border-slate-300 text-slate-900",
              "border"
            )}
          >
            <option value="all">All Severities</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className={cn(
              "px-4 py-2.5 rounded-lg text-sm",
              isDark ? "bg-slate-800 border-slate-600 text-white" : "bg-white border-slate-300 text-slate-900",
              "border"
            )}
          >
            <option value="all">All Categories</option>
            <option value="auth">Authentication</option>
            <option value="phi_access">PHI Access</option>
            <option value="data_change">Data Changes</option>
            <option value="security">Security</option>
          </select>
        </div>
      </Card>

      {/* Logs Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={cn(
                "text-left text-xs font-medium uppercase tracking-wider border-b",
                isDark ? "text-slate-400 border-slate-700 bg-slate-800/50" : "text-slate-500 border-slate-200 bg-slate-50"
              )}>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Resource</th>
                <th className="px-4 py-3 text-center">PHI</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className={cn("divide-y", isDark ? "divide-slate-700" : "divide-slate-100")}>
              {filteredLogs.map((log) => {
                const category = categoryConfig[log.category];
                const CategoryIcon = category.icon;
                return (
                  <tr key={log.id} className={cn(
                    "transition-colors",
                    isDark ? "hover:bg-slate-700/30" : "hover:bg-slate-50",
                    !log.success && (isDark ? "bg-red-900/10" : "bg-red-50")
                  )}>
                    <td className={cn("px-4 py-3 font-mono text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                      {log.timestamp}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <User className={cn("w-4 h-4", isDark ? "text-slate-500" : "text-slate-400")} />
                        <span className={cn("text-sm", isDark ? "text-white" : "text-slate-900")}>{log.user}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("inline-flex items-center gap-1 text-sm", isDark ? category.color : category.lightColor)}>
                        <CategoryIcon className="w-3 h-3" />
                        {category.label}
                      </span>
                    </td>
                    <td className={cn("px-4 py-3 text-sm", isDark ? "text-white" : "text-slate-900")}>{log.action}</td>
                    <td className="px-4 py-3">
                      <span className={cn("font-mono text-sm", isDark ? "text-blue-400" : "text-blue-600")}>{log.resource}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {log.phiAccessed ? (
                        <Badge variant="primary" size="sm" icon={<Lock className="w-3 h-3" />}>PHI</Badge>
                      ) : (
                        <span className={isDark ? "text-slate-600" : "text-slate-400"}>—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge 
                        variant={log.severity === "error" ? "error" : log.severity === "warning" ? "warning" : "info"}
                        size="sm"
                      >
                        {log.severity}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={() => setSelectedLog(log)} 
                        className={cn(
                          "p-1.5 rounded transition-colors",
                          isDark ? "text-slate-400 hover:text-blue-400 hover:bg-blue-500/20" : "text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                        )}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className={cn(
          "px-4 py-3 border-t flex items-center justify-between",
          isDark ? "border-slate-700 bg-slate-800/30" : "border-slate-200 bg-slate-50"
        )}>
          <span className={cn("text-sm", isDark ? "text-slate-500" : "text-slate-400")}>
            Showing {filteredLogs.length} of {auditLogs.length} entries
          </span>
        </div>
      </Card>

      {/* Log Detail Modal */}
      <AnimatePresence>
        {selectedLog && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedLog(null)} 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }} 
              className={cn(
                "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl z-50 overflow-hidden",
                isDark ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-200"
              )}
            >
              <div className={cn(
                "p-4 border-b flex items-center justify-between",
                isDark ? "border-slate-700" : "border-slate-200"
              )}>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-blue-500" />
                  <h3 className={cn("font-semibold", isDark ? "text-white" : "text-slate-900")}>Audit Log Detail</h3>
                </div>
                <button 
                  onClick={() => setSelectedLog(null)} 
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    isDark ? "text-slate-400 hover:text-white hover:bg-slate-700" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                  )}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh]">
                <div className="flex gap-2 flex-wrap">
                  <Badge variant={selectedLog.severity === "error" ? "error" : selectedLog.severity === "warning" ? "warning" : "info"}>
                    {selectedLog.severity.toUpperCase()}
                  </Badge>
                  {selectedLog.phiAccessed && (
                    <Badge variant="primary" icon={<Lock className="w-3 h-3" />}>PHI ACCESSED</Badge>
                  )}
                  {!selectedLog.success && (
                    <Badge variant="error" icon={<X className="w-3 h-3" />}>FAILED</Badge>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Event ID", value: selectedLog.id },
                    { label: "Timestamp", value: selectedLog.timestamp },
                    { label: "User", value: selectedLog.user },
                    { label: "Action", value: selectedLog.action },
                    { label: "Resource", value: selectedLog.resource, mono: true },
                    { label: "IP Address", value: selectedLog.ip, mono: true },
                  ].map((item) => (
                    <div key={item.label} className={cn(
                      "rounded-lg p-3",
                      isDark ? "bg-slate-700/50" : "bg-slate-50"
                    )}>
                      <p className={cn("text-xs mb-1", isDark ? "text-slate-400" : "text-slate-500")}>{item.label}</p>
                      <p className={cn(
                        item.mono && "font-mono text-sm",
                        isDark ? "text-white" : "text-slate-900"
                      )}>{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className={cn("rounded-lg p-3", isDark ? "bg-slate-700/50" : "bg-slate-50")}>
                  <p className={cn("text-xs mb-1", isDark ? "text-slate-400" : "text-slate-500")}>Details</p>
                  <p className={cn("text-sm", isDark ? "text-white" : "text-slate-900")}>{selectedLog.details}</p>
                </div>
              </div>
              <div className={cn(
                "flex gap-2 p-4 border-t",
                isDark ? "border-slate-700" : "border-slate-200"
              )}>
                <Button variant="outline" className="flex-1" onClick={() => setSelectedLog(null)}>Close</Button>
                <Button variant="primary" className="flex-1" icon={<FileText className="w-4 h-4" />}>Generate Report</Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
