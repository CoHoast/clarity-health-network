"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Plus, Download, Eye, CheckCircle, Clock, AlertTriangle, X, FileText, Calendar, Building2, Printer, ExternalLink, FileSignature, RefreshCw, Trash2, Mail, Loader2 } from "lucide-react";
import { useTheme } from "@/components/admin/ThemeContext";
import { Card, CardHeader } from "@/components/admin/ui/Card";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatCardSkeleton } from "@/components/admin/ui/Skeleton";
import { Badge, StatusBadge } from "@/components/admin/ui/Badge";
import { Button, IconButton } from "@/components/admin/ui/Button";
import { PageHeader, Tabs } from "@/components/admin/ui/PageHeader";
import { SearchInput, FilterSelect } from "@/components/admin/ui/SearchInput";
import { TableRowSkeleton, EmptyState } from "@/components/admin/ui";
import { BulkActionBar, bulkActionCreators } from "@/components/admin/ui/BulkActionBar";
import { useBulkSelect } from "@/lib/hooks/useBulkSelect";
import { cn } from "@/lib/utils";

const contracts = [
  { id: "CTR-001", provider: "Cleveland Family Medicine", practiceId: "PRC-001", npi: "1234567890", type: "Primary Care", feeSchedule: "120% Medicare", effective: "2024-01-01", expires: "2026-12-31", status: "active", autoRenew: true },
  { id: "CTR-002", provider: "Metro Imaging Center", practiceId: "PRC-003", npi: "3456789012", type: "Imaging", feeSchedule: "Case Rate", effective: "2023-06-01", expires: "2025-05-31", status: "expiring", autoRenew: false },
  { id: "CTR-003", provider: "Cleveland Orthopedic Associates", practiceId: "PRC-002", npi: "4567890123", type: "Specialty", feeSchedule: "125% Medicare", effective: "2024-01-01", expires: "2026-12-31", status: "active", autoRenew: true },
  { id: "CTR-004", provider: "Dr. Sarah Chen, MD", practiceId: null, npi: "2345678901", type: "Primary Care", feeSchedule: "115% Medicare", effective: "2023-03-01", expires: "2025-02-28", status: "expiring", autoRenew: true },
  { id: "CTR-005", provider: "Westlake Urgent Care", practiceId: "PRC-005", npi: "6789012345", type: "Urgent Care", feeSchedule: "110% Medicare", effective: "2024-01-01", expires: "2026-12-31", status: "active", autoRenew: true },
  { id: "CTR-006", provider: "Pending Provider LLC", practiceId: null, npi: "9876543210", type: "Specialty", feeSchedule: "TBD", effective: "Pending", expires: "Pending", status: "pending", autoRenew: false },
  { id: "CTR-007", provider: "Cleveland Cardiology Associates", practiceId: "PRC-004", npi: "9012345678", type: "Specialty", feeSchedule: "130% Medicare", effective: "2023-01-01", expires: "2025-12-31", status: "active", autoRenew: true },
  { id: "CTR-008", provider: "Quest Diagnostics Cleveland", practiceId: null, npi: "8901234567", type: "Laboratory", feeSchedule: "65% Medicare", effective: "2022-01-01", expires: "2027-12-31", status: "active", autoRenew: true },
];

const stats = [
  { label: "Active Contracts", value: "847", trend: "up" as const, change: "+12", icon: <CheckCircle className="w-5 h-5" /> },
  { label: "Expiring Soon", value: "23", trend: "warning" as const, change: "30d", icon: <AlertTriangle className="w-5 h-5" /> },
  { label: "Pending Approval", value: "12", trend: "neutral" as const, change: "Review", icon: <Clock className="w-5 h-5" /> },
  { label: "Renewal Rate", value: "98%", trend: "up" as const, change: "+3%", icon: <RefreshCw className="w-5 h-5" /> },
];

const statusFilters = [
  { label: "All", value: "" },
  { label: "Active", value: "active" },
  { label: "Expiring", value: "expiring" },
  { label: "Pending", value: "pending" },
];

export default function ContractsPage() {
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedContract, setSelectedContract] = useState<typeof contracts[0] | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRenewalModal, setShowRenewalModal] = useState<typeof contracts[0] | null>(null);
  const [actionSuccess, setActionSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial data loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch = contract.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || contract.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Bulk selection
  const bulk = useBulkSelect({
    items: filteredContracts,
    getItemId: (c) => c.id,
  });

  const handleBulkExport = () => {
    const selected = bulk.getSelectedItems();
    console.log("Exporting", selected.length, "contracts");
    bulk.clearSelection();
  };

  const handleBulkEmail = () => {
    const selected = bulk.getSelectedItems();
    console.log("Sending email to", selected.length, "providers");
    bulk.clearSelection();
  };

  const handleBulkDelete = () => {
    const selected = bulk.getSelectedItems();
    console.log("Deleting", selected.length, "contracts");
    bulk.clearSelection();
  };

  const handleAction = () => {
    setActionSuccess(true);
    setTimeout(() => {
      setActionSuccess(false);
      setShowRenewalModal(null);
      setShowAddModal(false);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="Contract Management"
        subtitle="Manage provider contracts, fee schedules, and renewals"
        actions={
          <>
            <Button variant="outline" icon={<Download className="w-4 h-4" />}>
              Export
            </Button>
            <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setShowAddModal(true)}>
              New Contract
            </Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))
        ) : (
          stats.map((stat, i) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              change={stat.change}
              trend={stat.trend}
              icon={stat.icon}
              delay={i}
            />
          ))
        )}
      </div>

      {/* Filters */}
      <Card padding="md">
        <div className="flex flex-col sm:flex-row gap-4">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search contracts by ID or provider..."
            className="flex-1"
            showShortcut
          />
          <Tabs
            tabs={statusFilters}
            value={statusFilter}
            onChange={setStatusFilter}
          />
        </div>
      </Card>

      {/* Contracts Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={cn(
                "text-left text-xs font-medium uppercase tracking-wider border-b",
                isDark ? "text-slate-400 border-slate-700 bg-slate-800/50" : "text-slate-500 border-slate-200 bg-slate-50"
              )}>
                <th className="px-4 py-4 w-12">
                  <input
                    type="checkbox"
                    checked={bulk.isAllSelected}
                    ref={(el) => { if (el) el.indeterminate = bulk.isSomeSelected; }}
                    onChange={bulk.toggleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-cyan-600 focus:ring-cyan-500/40"
                  />
                </th>
                <th className="px-4 py-4">Contract</th>
                <th className="px-4 py-4">Provider</th>
                <th className="px-4 py-4">Type</th>
                <th className="px-4 py-4">Fee Schedule</th>
                <th className="px-4 py-4">Expires</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={cn("divide-y", isDark ? "divide-slate-700/50" : "divide-slate-100")}>
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRowSkeleton key={i} columns={8} />
                ))
              ) : filteredContracts.length === 0 ? (
                // Empty state
                <tr>
                  <td colSpan={8} className="px-6 py-12">
                    <EmptyState
                      icon={<FileSignature className="w-8 h-8" />}
                      title={searchQuery || statusFilter ? "No contracts found" : "No contracts yet"}
                      description={searchQuery || statusFilter ? "Try adjusting your search or filters" : "Add your first provider contract to get started"}
                      action={!searchQuery && !statusFilter ? {
                        label: "Add Contract",
                        onClick: () => setShowAddModal(true),
                      } : undefined}
                    />
                  </td>
                </tr>
              ) : (
                filteredContracts.map((contract) => (
                  <tr 
                    key={contract.id} 
                    className={cn(
                      "transition-colors",
                      bulk.isSelected(contract.id) 
                        ? isDark ? "bg-cyan-900/20" : "bg-cyan-50"
                        : isDark ? "hover:bg-slate-700/30" : "hover:bg-slate-50"
                    )}
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={bulk.isSelected(contract.id)}
                        onChange={() => bulk.toggleSelect(contract.id)}
                        className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-cyan-600 focus:ring-cyan-500/40"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => setSelectedContract(contract)}
                        className="font-mono text-sm text-cyan-500 hover:text-cyan-400 hover:underline"
                      >
                        {contract.id}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        {contract.practiceId ? (
                          <Link 
                            href={`/admin/providers/${contract.practiceId}`}
                            className={cn(
                              "font-medium hover:text-cyan-500 transition-colors",
                              isDark ? "text-white" : "text-slate-900"
                            )}
                          >
                            {contract.provider}
                          </Link>
                        ) : (
                          <p className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>
                            {contract.provider}
                          </p>
                        )}
                        <p className={cn("text-xs font-mono mt-0.5", isDark ? "text-slate-500" : "text-slate-400")}>
                          NPI: {contract.npi}
                        </p>
                      </div>
                    </td>
                    <td className={cn("px-4 py-4", isDark ? "text-slate-300" : "text-slate-600")}>
                      {contract.type}
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant="default">{contract.feeSchedule}</Badge>
                    </td>
                    <td className="px-4 py-4">
                      <span className={contract.status === "expiring" ? "text-amber-500 font-medium" : (isDark ? "text-slate-300" : "text-slate-600")}>
                        {contract.expires}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={contract.status === "expiring" ? "Expiring Soon" : contract.status} />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <IconButton
                          icon={<Eye className="w-4 h-4" />}
                          onClick={() => setSelectedContract(contract)}
                          tooltip="View Details"
                        />
                        {contract.status === "expiring" && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setShowRenewalModal(contract)}
                            className="text-amber-500 border-amber-500/30 hover:bg-amber-500/10"
                          >
                            Renew
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Contract Detail Modal */}
      <AnimatePresence>
        {selectedContract && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedContract(null)} 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className={cn(
                "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl z-50 overflow-hidden",
                isDark ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-200"
              )}
            >
              {/* Modal Header */}
              <div className={cn(
                "flex items-center justify-between p-5 border-b",
                isDark ? "border-slate-700" : "border-slate-200"
              )}>
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    isDark ? "bg-cyan-500/20" : "bg-cyan-50"
                  )}>
                    <FileSignature className="w-6 h-6 text-cyan-500" />
                  </div>
                  <div>
                    <h2 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-slate-900")}>
                      {selectedContract.id}
                    </h2>
                    <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                      {selectedContract.provider}
                    </p>
                  </div>
                </div>
                <IconButton
                  icon={<X className="w-5 h-5" />}
                  onClick={() => setSelectedContract(null)}
                />
              </div>

              {/* Modal Content */}
              <div className="p-5 overflow-y-auto max-h-[calc(90vh-180px)] space-y-5">
                {/* Status badges */}
                <div className="flex flex-wrap gap-2">
                  <StatusBadge status={selectedContract.status === "expiring" ? "Expiring Soon" : selectedContract.status} />
                  {selectedContract.autoRenew && (
                    <Badge variant="info" icon={<RefreshCw className="w-3 h-3" />}>
                      Auto-Renew
                    </Badge>
                  )}
                </div>

                {/* Details Grid */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className={cn(
                    "rounded-xl p-5",
                    isDark ? "bg-slate-700/50 border border-slate-600/50" : "bg-slate-50 border border-slate-200"
                  )}>
                    <h3 className={cn(
                      "font-medium mb-4 flex items-center gap-2",
                      isDark ? "text-white" : "text-slate-900"
                    )}>
                      <Building2 className="w-4 h-4 text-cyan-500" />
                      Provider Details
                    </h3>
                    <div className="space-y-3 text-sm">
                      {[
                        { label: "Name", value: selectedContract.provider },
                        { label: "NPI", value: selectedContract.npi, mono: true },
                        { label: "Type", value: selectedContract.type },
                      ].map((item) => (
                        <div key={item.label} className="flex justify-between">
                          <span className={isDark ? "text-slate-400" : "text-slate-500"}>{item.label}</span>
                          <span className={cn(
                            item.mono && "font-mono",
                            isDark ? "text-white" : "text-slate-900"
                          )}>
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={cn(
                    "rounded-xl p-5",
                    isDark ? "bg-slate-700/50 border border-slate-600/50" : "bg-slate-50 border border-slate-200"
                  )}>
                    <h3 className={cn(
                      "font-medium mb-4 flex items-center gap-2",
                      isDark ? "text-white" : "text-slate-900"
                    )}>
                      <Calendar className="w-4 h-4 text-emerald-500" />
                      Contract Terms
                    </h3>
                    <div className="space-y-3 text-sm">
                      {[
                        { label: "Effective", value: selectedContract.effective },
                        { label: "Expires", value: selectedContract.expires },
                        { label: "Fee Schedule", value: selectedContract.feeSchedule },
                      ].map((item) => (
                        <div key={item.label} className="flex justify-between">
                          <span className={isDark ? "text-slate-400" : "text-slate-500"}>{item.label}</span>
                          <span className={isDark ? "text-white" : "text-slate-900"}>{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className={cn(
                "flex items-center justify-between p-5 border-t",
                isDark ? "border-slate-700 bg-slate-800/50" : "border-slate-200 bg-slate-50"
              )}>
                <Button variant="outline" icon={<Printer className="w-4 h-4" />}>
                  Print
                </Button>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    icon={<FileText className="w-4 h-4" />}
                    iconRight={<ExternalLink className="w-3 h-3" />}
                    href="/docs/contract"
                  >
                    View Document
                  </Button>
                  <Button variant="primary" onClick={() => setSelectedContract(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Renewal Modal */}
      <AnimatePresence>
        {showRenewalModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setShowRenewalModal(null)} 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className={cn(
                "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-2xl shadow-2xl z-50",
                isDark ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-200"
              )}
            >
              {actionSuccess ? (
                <div className="p-10 text-center">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-5">
                    <CheckCircle className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className={cn("text-xl font-bold mb-2", isDark ? "text-white" : "text-slate-900")}>
                    Renewal Initiated!
                  </h3>
                  <p className={isDark ? "text-slate-400" : "text-slate-500"}>
                    Contract renewal has been sent for approval.
                  </p>
                </div>
              ) : (
                <>
                  <div className={cn("p-5 border-b", isDark ? "border-slate-700" : "border-slate-200")}>
                    <h3 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-slate-900")}>
                      Renew Contract
                    </h3>
                    <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                      {showRenewalModal.provider}
                    </p>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                      <p className="text-sm text-amber-500 font-medium">
                        Current contract expires: {showRenewalModal.expires}
                      </p>
                    </div>
                    <div>
                      <label className={cn("block text-sm font-medium mb-2", isDark ? "text-slate-300" : "text-slate-700")}>
                        New Term Length
                      </label>
                      <select className={cn(
                        "w-full px-4 py-2.5 rounded-lg text-sm transition-colors",
                        isDark 
                          ? "bg-slate-700 border border-slate-600 text-white" 
                          : "bg-white border border-slate-300 text-slate-900"
                      )}>
                        <option>1 Year</option>
                        <option>2 Years</option>
                        <option>3 Years</option>
                      </select>
                    </div>
                    <div>
                      <label className={cn("block text-sm font-medium mb-2", isDark ? "text-slate-300" : "text-slate-700")}>
                        Fee Schedule
                      </label>
                      <select className={cn(
                        "w-full px-4 py-2.5 rounded-lg text-sm transition-colors",
                        isDark 
                          ? "bg-slate-700 border border-slate-600 text-white" 
                          : "bg-white border border-slate-300 text-slate-900"
                      )}>
                        <option>{showRenewalModal.feeSchedule} (Current)</option>
                        <option>110% Medicare</option>
                        <option>115% Medicare</option>
                        <option>120% Medicare</option>
                        <option>125% Medicare</option>
                      </select>
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        defaultChecked 
                        className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-cyan-600 focus:ring-cyan-500/40" 
                      />
                      <span className={cn("text-sm", isDark ? "text-slate-300" : "text-slate-700")}>
                        Enable auto-renewal
                      </span>
                    </label>
                  </div>
                  <div className={cn(
                    "flex gap-3 p-5 border-t",
                    isDark ? "border-slate-700" : "border-slate-200"
                  )}>
                    <Button variant="outline" className="flex-1" onClick={() => setShowRenewalModal(null)}>
                      Cancel
                    </Button>
                    <Button variant="primary" className="flex-1" onClick={handleAction}>
                      Send Renewal
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add Contract Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setShowAddModal(false)} 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className={cn(
                "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg max-h-[90vh] rounded-2xl shadow-2xl z-50 overflow-hidden",
                isDark ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-200"
              )}
            >
              {actionSuccess ? (
                <div className="p-10 text-center">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-5">
                    <CheckCircle className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className={cn("text-xl font-bold mb-2", isDark ? "text-white" : "text-slate-900")}>
                    Contract Created!
                  </h3>
                  <p className={isDark ? "text-slate-400" : "text-slate-500"}>
                    New contract has been created and is pending signatures.
                  </p>
                </div>
              ) : (
                <>
                  <div className={cn("p-5 border-b", isDark ? "border-slate-700" : "border-slate-200")}>
                    <h3 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-slate-900")}>
                      New Contract
                    </h3>
                    <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                      Create a new provider contract
                    </p>
                  </div>
                  <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
                    <div>
                      <label className={cn("block text-sm font-medium mb-2", isDark ? "text-slate-300" : "text-slate-700")}>
                        Provider
                      </label>
                      <select className={cn(
                        "w-full px-4 py-2.5 rounded-lg text-sm",
                        isDark 
                          ? "bg-slate-700 border border-slate-600 text-white" 
                          : "bg-white border border-slate-300 text-slate-900"
                      )}>
                        <option>Select provider...</option>
                        <option>Pending Provider LLC</option>
                        <option>New Provider Group</option>
                      </select>
                    </div>
                    <div>
                      <label className={cn("block text-sm font-medium mb-2", isDark ? "text-slate-300" : "text-slate-700")}>
                        Contract Type
                      </label>
                      <select className={cn(
                        "w-full px-4 py-2.5 rounded-lg text-sm",
                        isDark 
                          ? "bg-slate-700 border border-slate-600 text-white" 
                          : "bg-white border border-slate-300 text-slate-900"
                      )}>
                        <option>Primary Care</option>
                        <option>Specialty</option>
                        <option>Facility</option>
                        <option>Urgent Care</option>
                        <option>Imaging</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={cn("block text-sm font-medium mb-2", isDark ? "text-slate-300" : "text-slate-700")}>
                          Effective Date
                        </label>
                        <input 
                          type="date" 
                          className={cn(
                            "w-full px-4 py-2.5 rounded-lg text-sm",
                            isDark 
                              ? "bg-slate-700 border border-slate-600 text-white" 
                              : "bg-white border border-slate-300 text-slate-900"
                          )} 
                        />
                      </div>
                      <div>
                        <label className={cn("block text-sm font-medium mb-2", isDark ? "text-slate-300" : "text-slate-700")}>
                          Term Length
                        </label>
                        <select className={cn(
                          "w-full px-4 py-2.5 rounded-lg text-sm",
                          isDark 
                            ? "bg-slate-700 border border-slate-600 text-white" 
                            : "bg-white border border-slate-300 text-slate-900"
                        )}>
                          <option>1 Year</option>
                          <option>2 Years</option>
                          <option>3 Years</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className={cn("block text-sm font-medium mb-2", isDark ? "text-slate-300" : "text-slate-700")}>
                        Fee Schedule
                      </label>
                      <select className={cn(
                        "w-full px-4 py-2.5 rounded-lg text-sm",
                        isDark 
                          ? "bg-slate-700 border border-slate-600 text-white" 
                          : "bg-white border border-slate-300 text-slate-900"
                      )}>
                        <option>110% Medicare</option>
                        <option>115% Medicare</option>
                        <option>120% Medicare</option>
                        <option>125% Medicare</option>
                        <option>Case Rate</option>
                      </select>
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        defaultChecked 
                        className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-cyan-600 focus:ring-cyan-500/40" 
                      />
                      <span className={cn("text-sm", isDark ? "text-slate-300" : "text-slate-700")}>
                        Enable auto-renewal
                      </span>
                    </label>
                  </div>
                  <div className={cn(
                    "flex gap-3 p-5 border-t",
                    isDark ? "border-slate-700" : "border-slate-200"
                  )}>
                    <Button variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" className="flex-1" onClick={handleAction}>
                      Create Contract
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bulk Action Bar */}
      <BulkActionBar
        selectedCount={bulk.selectedCount}
        itemLabel="contract"
        onClear={bulk.clearSelection}
        actions={[
          bulkActionCreators.export(handleBulkExport),
          bulkActionCreators.email(handleBulkEmail),
          bulkActionCreators.delete(handleBulkDelete),
        ]}
      />
    </div>
  );
}
