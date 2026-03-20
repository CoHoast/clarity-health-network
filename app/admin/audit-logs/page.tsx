"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollText, Search, Download, Filter, X, User, Clock, AlertTriangle, CheckCircle, Eye, Shield, FileText, Lock, LogIn, LogOut, Settings, Edit, Trash2, Database, Activity, Globe, UserX, RefreshCw, Calendar, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useTheme } from "@/components/admin/ThemeContext";
import { Card } from "@/components/admin/ui/Card";
import { Button, IconButton } from "@/components/admin/ui/Button";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { SearchInput } from "@/components/admin/ui/SearchInput";
import { Badge } from "@/components/admin/ui/Badge";
import { cn } from "@/lib/utils";
import { exportToCSV } from "@/lib/export";

type SeverityType = "info" | "warning" | "error" | "critical";
type CategoryType = "auth" | "phi_access" | "data_change" | "system" | "security" | "export" | "verification" | "navigation";

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  userId: string;
  action: string;
  category: CategoryType;
  resource: string;
  resourceType: string;
  resourceId?: string;
  details: string;
  ip: string;
  userAgent: string;
  sessionId: string;
  severity: SeverityType;
  phiAccessed: boolean;
  success: boolean;
  metadata?: Record<string, unknown>;
}

interface AuditStats {
  total: number;
  phiAccess: number;
  authEvents: number;
  warnings: number;
  errors: number;
  todayEvents: number;
}

const categoryConfig: Record<CategoryType, { label: string; icon: React.ElementType; color: string; lightColor: string }> = {
  auth: { label: "Authentication", icon: LogIn, color: "text-blue-400", lightColor: "text-blue-600" },
  phi_access: { label: "PHI Access", icon: Eye, color: "text-purple-400", lightColor: "text-purple-600" },
  data_change: { label: "Data Change", icon: Edit, color: "text-amber-400", lightColor: "text-amber-600" },
  system: { label: "System", icon: Settings, color: "text-slate-400", lightColor: "text-slate-600" },
  security: { label: "Security", icon: Shield, color: "text-red-400", lightColor: "text-red-600" },
  export: { label: "Data Export", icon: Download, color: "text-green-400", lightColor: "text-green-600" },
  verification: { label: "Verification", icon: CheckCircle, color: "text-teal-400", lightColor: "text-teal-600" },
  navigation: { label: "Navigation", icon: Globe, color: "text-slate-400", lightColor: "text-slate-500" },
};

export default function AuditLogsPage() {
  const { isDark } = useTheme();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<AuditStats>({ total: 0, phiAccess: 0, authEvents: 0, warnings: 0, errors: 0, todayEvents: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const pageSize = 50;

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch audit logs
  const fetchLogs = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);
    
    try {
      const params = new URLSearchParams({
        limit: pageSize.toString(),
        offset: (page * pageSize).toString(),
      });
      
      if (filterSeverity !== 'all') params.set('severity', filterSeverity);
      if (filterCategory !== 'all') params.set('category', filterCategory);
      if (searchQuery) params.set('user', searchQuery);
      
      const response = await fetch(`/api/audit?${params}`);
      const data = await response.json();
      
      setLogs(data.logs || []);
      setStats(data.stats || { total: 0, phiAccess: 0, authEvents: 0, warnings: 0, errors: 0, todayEvents: 0 });
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page, filterSeverity, filterCategory, searchQuery]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => fetchLogs(true), 30000);
    return () => clearInterval(interval);
  }, [fetchLogs]);

  // Filter logs client-side for search (in addition to server filter)
  const filteredLogs = logs.filter(log => {
    if (!searchQuery) return true;
    return log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
           log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
           log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
           log.details.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Export logs
  const handleExport = () => {
    exportToCSV(logs.map(log => ({
      id: log.id,
      timestamp: log.timestamp,
      user: log.user,
      action: log.action,
      category: log.category,
      resource: log.resource,
      resourceType: log.resourceType,
      details: log.details,
      ip: log.ip,
      severity: log.severity,
      phiAccessed: log.phiAccessed ? 'Yes' : 'No',
      success: log.success ? 'Yes' : 'No',
    })), [
      { key: 'id', label: 'Event ID' },
      { key: 'timestamp', label: 'Timestamp' },
      { key: 'user', label: 'User' },
      { key: 'action', label: 'Action' },
      { key: 'category', label: 'Category' },
      { key: 'resource', label: 'Resource' },
      { key: 'resourceType', label: 'Resource Type' },
      { key: 'details', label: 'Details' },
      { key: 'ip', label: 'IP Address' },
      { key: 'severity', label: 'Severity' },
      { key: 'phiAccessed', label: 'PHI Accessed' },
      { key: 'success', label: 'Success' },
    ], `audit-logs-${new Date().toISOString().split('T')[0]}`);
    showToast('Audit logs exported');
  };

  const formatTimestamp = (ts: string) => {
    const date = new Date(ts);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const statCards = [
    { label: "Total Events", value: stats.total.toString(), icon: Activity },
    { label: "PHI Access", value: stats.phiAccess.toString(), icon: Lock },
    { label: "Auth Events", value: stats.authEvents.toString(), icon: LogIn },
    { label: "Warnings/Errors", value: (stats.warnings + stats.errors).toString(), icon: AlertTriangle },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="HIPAA Audit Logs"
        subtitle="Complete system activity and security events"
        actions={
          <>
            <Button 
              variant="outline" 
              icon={refreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              onClick={() => fetchLogs(true)}
              disabled={refreshing}
            >
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Button 
              variant="primary" 
              icon={<Download className="w-4 h-4" />}
              onClick={handleExport}
              disabled={logs.length === 0}
            >
              Export Logs
            </Button>
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
        <div className="ml-auto text-right">
          <p className="text-white font-semibold">{stats.todayEvents}</p>
          <p className="text-white/75 text-sm">Events Today</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} padding="md">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  isDark ? "bg-blue-500/20" : "bg-blue-50"
                )}>
                  <Icon className={cn("w-5 h-5", isDark ? "text-blue-400" : "text-blue-600")} />
                </div>
                <div>
                  <p className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>{stat.value}</p>
                  <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>{stat.label}</p>
                </div>
              </div>
            </Card>
          );
        })}
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
            onChange={(e) => { setFilterSeverity(e.target.value); setPage(0); }}
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
            <option value="critical">Critical</option>
          </select>
          <select
            value={filterCategory}
            onChange={(e) => { setFilterCategory(e.target.value); setPage(0); }}
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
            <option value="export">Data Export</option>
            <option value="verification">Verification</option>
            <option value="system">System</option>
          </select>
        </div>
      </Card>

      {/* Logs Table */}
      <Card padding="none">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className={cn("w-8 h-8 animate-spin", isDark ? "text-slate-500" : "text-slate-400")} />
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <ScrollText className={cn("w-12 h-12 mb-4", isDark ? "text-slate-600" : "text-slate-300")} />
            <p className={cn("font-medium", isDark ? "text-slate-400" : "text-slate-500")}>No audit logs found</p>
            <p className={cn("text-sm mt-1", isDark ? "text-slate-500" : "text-slate-400")}>
              Actions on the platform will be logged here automatically
            </p>
          </div>
        ) : (
          <>
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
                    const category = categoryConfig[log.category] || categoryConfig.system;
                    const CategoryIcon = category.icon;
                    return (
                      <tr key={log.id} className={cn(
                        "transition-colors",
                        isDark ? "hover:bg-slate-700/30" : "hover:bg-slate-50",
                        !log.success && (isDark ? "bg-red-900/10" : "bg-red-50")
                      )}>
                        <td className={cn("px-4 py-3 font-mono text-sm whitespace-nowrap", isDark ? "text-slate-400" : "text-slate-500")}>
                          {formatTimestamp(log.timestamp)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <User className={cn("w-4 h-4", isDark ? "text-slate-500" : "text-slate-400")} />
                            <span className={cn("text-sm truncate max-w-[200px]", isDark ? "text-white" : "text-slate-900")}>{log.user}</span>
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
                          <span className={cn("font-mono text-sm truncate max-w-[150px] block", isDark ? "text-blue-400" : "text-blue-600")}>{log.resource}</span>
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
                            variant={log.severity === "error" || log.severity === "critical" ? "error" : log.severity === "warning" ? "warning" : "info"}
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
            
            {/* Pagination */}
            <div className={cn(
              "px-4 py-3 border-t flex items-center justify-between",
              isDark ? "border-slate-700 bg-slate-800/30" : "border-slate-200 bg-slate-50"
            )}>
              <span className={cn("text-sm", isDark ? "text-slate-500" : "text-slate-400")}>
                Showing {page * pageSize + 1} - {Math.min((page + 1) * pageSize, total)} of {total} entries
              </span>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  icon={<ChevronLeft className="w-4 h-4" />}
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                >
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setPage(p => p + 1)}
                  disabled={(page + 1) * pageSize >= total}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </>
        )}
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
                  <Badge variant={selectedLog.severity === "error" || selectedLog.severity === "critical" ? "error" : selectedLog.severity === "warning" ? "warning" : "info"}>
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
                    { label: "Timestamp", value: formatTimestamp(selectedLog.timestamp) },
                    { label: "User", value: selectedLog.user },
                    { label: "Action", value: selectedLog.action },
                    { label: "Resource", value: selectedLog.resource, mono: true },
                    { label: "Resource Type", value: selectedLog.resourceType },
                    { label: "IP Address", value: selectedLog.ip, mono: true },
                    { label: "Session ID", value: selectedLog.sessionId, mono: true },
                  ].map((item) => (
                    <div key={item.label} className={cn(
                      "rounded-lg p-3",
                      isDark ? "bg-slate-700/50" : "bg-slate-50"
                    )}>
                      <p className={cn("text-xs mb-1", isDark ? "text-slate-400" : "text-slate-500")}>{item.label}</p>
                      <p className={cn(
                        "text-sm truncate",
                        item.mono && "font-mono",
                        isDark ? "text-white" : "text-slate-900"
                      )}>{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className={cn("rounded-lg p-3", isDark ? "bg-slate-700/50" : "bg-slate-50")}>
                  <p className={cn("text-xs mb-1", isDark ? "text-slate-400" : "text-slate-500")}>Details</p>
                  <p className={cn("text-sm", isDark ? "text-white" : "text-slate-900")}>{selectedLog.details || 'No additional details'}</p>
                </div>

                <div className={cn("rounded-lg p-3", isDark ? "bg-slate-700/50" : "bg-slate-50")}>
                  <p className={cn("text-xs mb-1", isDark ? "text-slate-400" : "text-slate-500")}>User Agent</p>
                  <p className={cn("text-sm font-mono break-all", isDark ? "text-slate-300" : "text-slate-600")}>{selectedLog.userAgent}</p>
                </div>
              </div>
              <div className={cn(
                "flex gap-2 p-4 border-t",
                isDark ? "border-slate-700" : "border-slate-200"
              )}>
                <Button variant="outline" className="flex-1" onClick={() => setSelectedLog(null)}>Close</Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50"
          >
            <CheckCircle className="w-5 h-5" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
