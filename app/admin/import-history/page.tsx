"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  History,
  RotateCcw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  FileSpreadsheet,
  User,
  Calendar,
  ChevronDown,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useTheme } from "@/components/admin/ThemeContext";
import { Breadcrumb } from "@/components/admin/ui/Breadcrumb";
import { Button } from "@/components/admin/ui/Button";
import { Card, CardHeader } from "@/components/admin/ui/Card";
import { Modal, ConfirmModal } from "@/components/admin/ui/Modal";
import { useToast } from "@/components/admin/ui/Toast";
import { cn } from "@/lib/utils";

interface ImportSession {
  id: string;
  createdAt: string;
  createdBy: string;
  fileName: string;
  fileSize: number;
  totalRows: number;
  added: number;
  updated: number;
  skipped: number;
  errors: number;
  status: 'pending' | 'completed' | 'rolled_back' | 'failed';
  completedAt?: string;
  rolledBackAt?: string;
  rolledBackBy?: string;
}

export default function ImportHistoryPage() {
  const { isDark } = useTheme();
  const toast = useToast();
  const [sessions, setSessions] = useState<ImportSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const [rollbackTarget, setRollbackTarget] = useState<ImportSession | null>(null);
  const [isRollingBack, setIsRollingBack] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/import-sessions?limit=20');
      const data = await response.json();
      setSessions(data.sessions || []);
    } catch (error) {
      console.error('Failed to fetch import sessions:', error);
      toast.error('Failed to load import history');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRollback = async () => {
    if (!rollbackTarget) return;
    
    setIsRollingBack(true);
    try {
      const response = await fetch(`/api/import-sessions/${rollbackTarget.id}/rollback/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rolledBackBy: 'Admin' }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        toast.success('Rollback Successful', result.message);
        fetchSessions(); // Refresh list
      } else {
        toast.error('Rollback Failed', result.error || 'Unknown error');
      }
    } catch (error) {
      toast.error('Rollback Failed', 'Network error');
    } finally {
      setIsRollingBack(false);
      setRollbackTarget(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-500', label: 'Completed' },
      pending: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-500', label: 'In Progress' },
      rolled_back: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-500', label: 'Rolled Back' },
      failed: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-500', label: 'Failed' },
    };
    const style = styles[status as keyof typeof styles] || styles.pending;
    
    return (
      <span className={cn("px-2 py-1 text-xs font-medium rounded-lg border", style.bg, style.border, style.text)}>
        {style.label}
      </span>
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Settings", href: "/admin/settings" }, { label: "Import History" }]} />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>
            Import History
          </h1>
          <p className={cn("text-sm mt-1", isDark ? "text-slate-400" : "text-slate-500")}>
            View past CSV imports and rollback if needed
          </p>
        </div>
        <Button variant="outline" onClick={fetchSessions} icon={<History className="w-4 h-4" />}>
          Refresh
        </Button>
      </div>

      {/* Info Card */}
      <Card>
        <div className={cn("p-4 flex items-start gap-3", isDark ? "bg-blue-500/5" : "bg-blue-50")}>
          <AlertTriangle className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <p className={cn("font-medium", isDark ? "text-blue-400" : "text-blue-700")}>
              Rollback Capability
            </p>
            <p className={cn("text-sm mt-1", isDark ? "text-blue-300/80" : "text-blue-600")}>
              You can rollback any completed import to restore providers to their previous state.
              This will undo all additions and updates made by that import.
            </p>
          </div>
        </div>
      </Card>

      {/* Sessions List */}
      <Card>
        <CardHeader title="Recent Imports" icon={<FileSpreadsheet className="w-5 h-5 text-blue-500" />} />
        
        {isLoading ? (
          <div className="p-8 text-center">
            <Loader2 className="w-8 h-8 text-blue-500 mx-auto animate-spin" />
            <p className={cn("mt-2", isDark ? "text-slate-400" : "text-slate-500")}>Loading...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="p-8 text-center">
            <History className={cn("w-12 h-12 mx-auto mb-3", isDark ? "text-slate-600" : "text-slate-400")} />
            <p className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>No imports yet</p>
            <p className={cn("text-sm mt-1", isDark ? "text-slate-400" : "text-slate-500")}>
              CSV imports will appear here with rollback options
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700/50">
            {sessions.map((session) => (
              <div key={session.id} className="p-4">
                {/* Session Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setExpandedSession(expandedSession === session.id ? null : session.id)}
                      className={cn("p-1 rounded", isDark ? "hover:bg-slate-700" : "hover:bg-slate-100")}
                    >
                      {expandedSession === session.id ? (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                    
                    <div>
                      <div className="flex items-center gap-3">
                        <p className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>
                          {session.fileName}
                        </p>
                        {getStatusBadge(session.status)}
                      </div>
                      <div className={cn("flex items-center gap-4 mt-1 text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(session.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          {session.createdBy}
                        </span>
                        <span>{session.totalRows.toLocaleString()} rows</span>
                        <span>{formatFileSize(session.fileSize)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm">
                      {session.added > 0 && (
                        <span className="flex items-center gap-1 text-emerald-500">
                          <CheckCircle className="w-4 h-4" />
                          {session.added} added
                        </span>
                      )}
                      {session.updated > 0 && (
                        <span className="flex items-center gap-1 text-blue-500">
                          <History className="w-4 h-4" />
                          {session.updated} updated
                        </span>
                      )}
                      {session.skipped > 0 && (
                        <span className={isDark ? "text-slate-400" : "text-slate-500"}>
                          {session.skipped} skipped
                        </span>
                      )}
                      {session.errors > 0 && (
                        <span className="flex items-center gap-1 text-red-500">
                          <XCircle className="w-4 h-4" />
                          {session.errors} errors
                        </span>
                      )}
                    </div>

                    {/* Rollback Button */}
                    {session.status === 'completed' && (session.added > 0 || session.updated > 0) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRollbackTarget(session)}
                        icon={<RotateCcw className="w-4 h-4" />}
                      >
                        Rollback
                      </Button>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedSession === session.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className={cn(
                        "mt-4 p-4 rounded-lg ml-9",
                        isDark ? "bg-slate-800/50" : "bg-slate-50"
                      )}>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className={isDark ? "text-slate-400" : "text-slate-500"}>Session ID</p>
                            <p className={cn("font-mono", isDark ? "text-white" : "text-slate-900")}>{session.id}</p>
                          </div>
                          <div>
                            <p className={isDark ? "text-slate-400" : "text-slate-500"}>Completed</p>
                            <p className={isDark ? "text-white" : "text-slate-900"}>
                              {session.completedAt ? formatDate(session.completedAt) : '-'}
                            </p>
                          </div>
                          {session.rolledBackAt && (
                            <>
                              <div>
                                <p className={isDark ? "text-slate-400" : "text-slate-500"}>Rolled Back</p>
                                <p className={isDark ? "text-white" : "text-slate-900"}>{formatDate(session.rolledBackAt)}</p>
                              </div>
                              <div>
                                <p className={isDark ? "text-slate-400" : "text-slate-500"}>Rolled Back By</p>
                                <p className={isDark ? "text-white" : "text-slate-900"}>{session.rolledBackBy}</p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Rollback Confirmation Modal */}
      <ConfirmModal
        isOpen={!!rollbackTarget}
        onClose={() => setRollbackTarget(null)}
        onConfirm={handleRollback}
        title="Rollback Import"
        message={
          rollbackTarget ? (
            <div className="space-y-3">
              <p>Are you sure you want to rollback this import?</p>
              <div className={cn("p-3 rounded-lg", isDark ? "bg-slate-700" : "bg-slate-100")}>
                <p className="font-medium">{rollbackTarget.fileName}</p>
                <p className={cn("text-sm mt-1", isDark ? "text-slate-400" : "text-slate-500")}>
                  This will:
                </p>
                <ul className={cn("text-sm mt-2 space-y-1", isDark ? "text-slate-300" : "text-slate-600")}>
                  {rollbackTarget.added > 0 && (
                    <li>• Delete {rollbackTarget.added} providers that were added</li>
                  )}
                  {rollbackTarget.updated > 0 && (
                    <li>• Restore {rollbackTarget.updated} providers to their previous state</li>
                  )}
                </ul>
              </div>
              <p className={cn("text-sm", isDark ? "text-amber-400" : "text-amber-600")}>
                ⚠️ This action cannot be undone
              </p>
            </div>
          ) : ''
        }
        confirmText={isRollingBack ? "Rolling back..." : "Rollback Import"}
        confirmVariant="danger"
        isLoading={isRollingBack}
      />
    </div>
  );
}
