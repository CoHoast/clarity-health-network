"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollText, Search, Download, Filter, X, User, Clock, AlertTriangle, CheckCircle, Eye, Shield } from "lucide-react";

const auditLogs = [
  { id: "LOG-001", timestamp: "2024-03-12 15:42:33", user: "admin@clarity.com", action: "Claim Approved", resource: "CLM-2024-156", ip: "192.168.1.45", severity: "info" },
  { id: "LOG-002", timestamp: "2024-03-12 15:38:12", user: "provider@metro.com", action: "Eligibility Check", resource: "MEM-12847", ip: "203.45.67.89", severity: "info" },
  { id: "LOG-003", timestamp: "2024-03-12 15:35:45", user: "admin@clarity.com", action: "Fee Schedule Updated", resource: "FS-001", ip: "192.168.1.45", severity: "warning" },
  { id: "LOG-004", timestamp: "2024-03-12 15:30:22", user: "member@email.com", action: "Login Success", resource: "AUTH", ip: "98.45.23.12", severity: "info" },
  { id: "LOG-005", timestamp: "2024-03-12 15:28:15", user: "unknown", action: "Login Failed", resource: "AUTH", ip: "45.67.89.123", severity: "error" },
  { id: "LOG-006", timestamp: "2024-03-12 15:25:00", user: "admin@clarity.com", action: "User Created", resource: "USR-089", ip: "192.168.1.45", severity: "warning" },
  { id: "LOG-007", timestamp: "2024-03-12 15:20:33", user: "provider@cleveland.com", action: "Claim Submitted", resource: "CLM-2024-157", ip: "67.89.12.34", severity: "info" },
  { id: "LOG-008", timestamp: "2024-03-12 15:15:12", user: "admin@clarity.com", action: "Config Changed", resource: "SYS", ip: "192.168.1.45", severity: "warning" },
  { id: "LOG-009", timestamp: "2024-03-12 15:10:45", user: "api-service", action: "Batch Import", resource: "837P-2024-001", ip: "10.0.0.5", severity: "info" },
  { id: "LOG-010", timestamp: "2024-03-12 15:05:22", user: "unknown", action: "Unauthorized Access", resource: "ADMIN", ip: "123.45.67.89", severity: "error" },
];

const severityConfig = {
  info: { bg: "bg-blue-500/20", text: "text-blue-400", icon: CheckCircle },
  warning: { bg: "bg-amber-500/20", text: "text-amber-400", icon: AlertTriangle },
  error: { bg: "bg-red-500/20", text: "text-red-400", icon: AlertTriangle },
};

export default function AuditLogsPage() {
  const [selectedLog, setSelectedLog] = useState<typeof auditLogs[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("all");

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.resource.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = filterSeverity === "all" || log.severity === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl flex items-center justify-center">
            <ScrollText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Audit Logs</h1>
            <p className="text-slate-400">System activity and security events</p>
          </div>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 border border-slate-600">
          <Download className="w-4 h-4" />Export
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-white">24,567</p>
          <p className="text-sm text-slate-400">Events Today</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-blue-400">23,892</p>
          <p className="text-sm text-slate-400">Info</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-amber-400">623</p>
          <p className="text-sm text-slate-400">Warnings</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-red-400">52</p>
          <p className="text-sm text-slate-400">Errors</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <select
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value)}
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
        >
          <option value="all">All Severity</option>
          <option value="info">Info</option>
          <option value="warning">Warning</option>
          <option value="error">Error</option>
        </select>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 border border-slate-700">
          <Filter className="w-4 h-4" />More Filters
        </button>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800 border-b border-slate-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Timestamp</th>
              <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">User</th>
              <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Action</th>
              <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Resource</th>
              <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">IP Address</th>
              <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Severity</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {filteredLogs.map((log) => {
              const config = severityConfig[log.severity as keyof typeof severityConfig];
              const Icon = config.icon;
              return (
                <tr key={log.id} className="hover:bg-slate-800/80">
                  <td className="px-4 py-3 text-slate-400 text-sm font-mono">{log.timestamp}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-500" />
                      <span className="text-white">{log.user}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white">{log.action}</td>
                  <td className="px-4 py-3 text-purple-400 font-mono text-sm">{log.resource}</td>
                  <td className="px-4 py-3 text-slate-400 font-mono text-sm">{log.ip}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 w-fit ${config.bg} ${config.text}`}>
                      <Icon className="w-3 h-3" />{log.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelectedLog(log)} className="p-1.5 text-slate-400 hover:text-purple-400 hover:bg-purple-500/20 rounded">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="px-4 py-3 bg-slate-800/50 border-t border-slate-700 flex items-center justify-between">
          <span className="text-sm text-slate-500">Showing {filteredLogs.length} entries</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-slate-700 text-slate-300 rounded text-sm hover:bg-slate-600">Previous</button>
            <button className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700">Next</button>
          </div>
        </div>
      </div>

      {/* Log Detail Modal */}
      <AnimatePresence>
        {selectedLog && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedLog(null)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50">
              <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-purple-400" />
                  <h3 className="font-semibold text-white">Audit Log Detail</h3>
                </div>
                <button onClick={() => setSelectedLog(null)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex gap-2">
                  {(() => {
                    const config = severityConfig[selectedLog.severity as keyof typeof severityConfig];
                    const Icon = config.icon;
                    return (
                      <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${config.bg} ${config.text}`}>
                        <Icon className="w-3 h-3" />{selectedLog.severity.toUpperCase()}
                      </span>
                    );
                  })()}
                </div>
                <div className="space-y-3">
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <p className="text-xs text-slate-400 mb-1">Event ID</p>
                    <p className="text-white font-mono">{selectedLog.id}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-700/50 rounded-lg p-3">
                      <p className="text-xs text-slate-400 mb-1">Timestamp</p>
                      <p className="text-white text-sm">{selectedLog.timestamp}</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-3">
                      <p className="text-xs text-slate-400 mb-1">IP Address</p>
                      <p className="text-white font-mono text-sm">{selectedLog.ip}</p>
                    </div>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <p className="text-xs text-slate-400 mb-1">User</p>
                    <p className="text-white">{selectedLog.user}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <p className="text-xs text-slate-400 mb-1">Action</p>
                    <p className="text-white">{selectedLog.action}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <p className="text-xs text-slate-400 mb-1">Resource</p>
                    <p className="text-purple-400 font-mono">{selectedLog.resource}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 p-4 border-t border-slate-700">
                <button onClick={() => setSelectedLog(null)} className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Close</button>
                <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Investigate</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
