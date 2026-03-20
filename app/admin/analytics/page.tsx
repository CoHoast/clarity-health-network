"use client";

import { useState, useRef, useEffect } from "react";
import { BarChart3, TrendingUp, TrendingDown, Building2, FileText, Download, Calendar, PieChart, MapPin, CheckCircle, Clock, AlertTriangle, Users, FileSignature, Globe, Activity, DollarSign, ShieldCheck, FileCheck, ChevronDown, Stethoscope, Heart, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/admin/ThemeContext";
import { Card, CardHeader } from "@/components/admin/ui/Card";
import { StatCard } from "@/components/admin/ui/StatCard";
import { Badge } from "@/components/admin/ui/Badge";
import { Button } from "@/components/admin/ui/Button";
import { PageHeader, Tabs } from "@/components/admin/ui/PageHeader";
import { cn } from "@/lib/utils";
import { exportToCSV, formatDate, formatCurrency, formatPercent } from "@/lib/export";
import { useAudit } from "@/lib/useAudit";

type DateRange = "month" | "quarter" | "year";

const dateRangeTabs = [
  { label: "This Month", value: "month" },
  { label: "This Quarter", value: "quarter" },
  { label: "This Year", value: "year" },
];

const dataByRange: Record<DateRange, { stats: Array<{ label: string; value: string; change: string; trend: "up" | "down" | "warning" }>; monthlyData: Array<{ month: string; providers: number; contracts: number }> }> = {
  month: {
    stats: [
      { label: "Total Providers", value: "2,891", change: "+23", trend: "up" },
      { label: "Active Contracts", value: "2,654", change: "+18", trend: "up" },
      { label: "Avg Discount Rate", value: "32.4%", change: "+1.2%", trend: "up" },
      { label: "Pending Credentials", value: "47", change: "-12", trend: "up" },
    ],
    monthlyData: [
      { month: "Oct", providers: 2720, contracts: 2490 },
      { month: "Nov", providers: 2780, contracts: 2540 },
      { month: "Dec", providers: 2810, contracts: 2580 },
      { month: "Jan", providers: 2845, contracts: 2610 },
      { month: "Feb", providers: 2868, contracts: 2636 },
      { month: "Mar", providers: 2891, contracts: 2654 },
    ],
  },
  quarter: {
    stats: [
      { label: "Total Providers", value: "2,891", change: "+81", trend: "up" },
      { label: "Active Contracts", value: "2,654", change: "+74", trend: "up" },
      { label: "Avg Discount Rate", value: "32.4%", change: "+2.8%", trend: "up" },
      { label: "Contracts Renewed", value: "156", change: "+22%", trend: "up" },
    ],
    monthlyData: [
      { month: "Jan", providers: 2845, contracts: 2610 },
      { month: "Feb", providers: 2868, contracts: 2636 },
      { month: "Mar", providers: 2891, contracts: 2654 },
    ],
  },
  year: {
    stats: [
      { label: "Total Providers", value: "2,891", change: "+312", trend: "up" },
      { label: "Active Contracts", value: "2,654", change: "+285", trend: "up" },
      { label: "Network Savings", value: "$4.2M", change: "+18%", trend: "up" },
      { label: "Avg Discount Rate", value: "32.4%", change: "+5.6%", trend: "up" },
    ],
    monthlyData: [
      { month: "Apr '25", providers: 2579, contracts: 2369 },
      { month: "Jul '25", providers: 2690, contracts: 2470 },
      { month: "Oct '25", providers: 2780, contracts: 2540 },
      { month: "Jan '26", providers: 2845, contracts: 2610 },
      { month: "Mar '26", providers: 2891, contracts: 2654 },
    ],
  },
};

const providersBySpecialty = [
  { specialty: "Primary Care", count: 892, percentage: 31, color: "bg-blue-500" },
  { specialty: "Specialists", count: 756, percentage: 27, color: "bg-teal-500" },
  { specialty: "Hospitals", count: 234, percentage: 8, color: "bg-emerald-500" },
  { specialty: "Urgent Care", count: 189, percentage: 7, color: "bg-blue-500" },
  { specialty: "Imaging", count: 312, percentage: 11, color: "bg-purple-500" },
  { specialty: "Labs", count: 464, percentage: 16, color: "bg-amber-500" },
];

const topProviders = [
  { name: "Cleveland Clinic", contracts: 45, discount: "38%", status: "active" },
  { name: "Metro Health System", contracts: 32, discount: "35%", status: "active" },
  { name: "University Hospitals", contracts: 28, discount: "40%", status: "active" },
  { name: "Southwest General", contracts: 22, discount: "32%", status: "active" },
  { name: "Fairview Hospital", contracts: 18, discount: "36%", status: "expiring" },
];

const regionData = [
  { region: "Cleveland Metro", providers: 1245, percentage: 43 },
  { region: "Northeast Ohio", providers: 687, percentage: 24 },
  { region: "Akron/Canton", providers: 456, percentage: 16 },
  { region: "Columbus", providers: 312, percentage: 11 },
  { region: "Other", providers: 191, percentage: 6 },
];

// Claims & Savings Analytics
const claimsSavingsData = {
  month: { totalClaims: 4523, repriced: 4218, savings: 892450, avgDiscount: 32.4 },
  quarter: { totalClaims: 13890, repriced: 12945, savings: 2645800, avgDiscount: 31.8 },
  year: { totalClaims: 52340, repriced: 48920, savings: 9824500, avgDiscount: 30.2 },
};

// Credentialing Pipeline
const credentialingPipeline = [
  { stage: "Application Review", count: 23, color: "bg-blue-500" },
  { stage: "Document Collection", count: 18, color: "bg-amber-500" },
  { stage: "Primary Verification", count: 31, color: "bg-purple-500" },
  { stage: "Committee Review", count: 8, color: "bg-teal-500" },
  { stage: "Final Approval", count: 12, color: "bg-emerald-500" },
];

// Contract Health
const contractHealth = {
  active: 2654,
  expiring30: 47,
  expiring60: 89,
  expiring90: 134,
  pendingRenewal: 23,
  terminated: 12,
};

// Export report configurations
const exportReports = [
  { 
    id: "network-summary", 
    label: "Network Summary Report",
    description: "Overview of providers, contracts, and savings",
    icon: Building2,
  },
  { 
    id: "provider-directory", 
    label: "Provider Directory",
    description: "Complete list of network providers",
    icon: Users,
  },
  { 
    id: "contract-status", 
    label: "Contract Status Report",
    description: "All contracts with expiration dates",
    icon: FileSignature,
  },
  { 
    id: "credentialing-status", 
    label: "Credentialing Pipeline",
    description: "Current credentialing applications",
    icon: ShieldCheck,
  },
  { 
    id: "savings-report", 
    label: "Savings Analysis",
    description: "Claims repricing and savings data",
    icon: DollarSign,
  },
  { 
    id: "regional-coverage", 
    label: "Regional Coverage",
    description: "Provider distribution by region",
    icon: MapPin,
  },
];

export default function AnalyticsPage() {
  const { isDark } = useTheme();
  const [dateRange, setDateRange] = useState<DateRange>("month");
  const [exportOpen, setExportOpen] = useState(false);
  const [exporting, setExporting] = useState<string | null>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const { logExport } = useAudit();

  const currentData = dataByRange[dateRange];
  const currentSavings = claimsSavingsData[dateRange];

  // Close export dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (exportRef.current && !exportRef.current.contains(event.target as Node)) {
        setExportOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle export
  const handleExport = async (reportId: string) => {
    setExporting(reportId);
    
    // Simulate brief processing
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const timestamp = new Date().toISOString().split('T')[0];
    
    switch (reportId) {
      case "network-summary":
        exportToCSV([
          { metric: "Total Providers", value: "2,891", change: "+312 YTD" },
          { metric: "Active Contracts", value: "2,654", change: "+285 YTD" },
          { metric: "Network Savings", value: "$9.8M", change: "+18% YoY" },
          { metric: "Avg Discount Rate", value: "32.4%", change: "+5.6% YoY" },
          { metric: "Network Coverage", value: "94%", change: "+3% YoY" },
          { metric: "Contract Renewal Rate", value: "98%", change: "+2% YoY" },
          { metric: "Avg Processing Time", value: "12 days", change: "-3 days YoY" },
          ...providersBySpecialty.map(s => ({ metric: `Providers - ${s.specialty}`, value: s.count.toString(), change: `${s.percentage}% of network` })),
          ...regionData.map(r => ({ metric: `Region - ${r.region}`, value: r.providers.toString(), change: `${r.percentage}% of network` })),
        ], [
          { key: "metric", label: "Metric" },
          { key: "value", label: "Value" },
          { key: "change", label: "Change/Notes" },
        ], `network-summary-${timestamp}`);
        break;
        
      case "provider-directory":
        exportToCSV([
          ...topProviders.map((p, i) => ({
            rank: i + 1,
            name: p.name,
            contracts: p.contracts,
            avgDiscount: p.discount,
            status: p.status,
          })),
        ], [
          { key: "rank", label: "Rank" },
          { key: "name", label: "Provider Name" },
          { key: "contracts", label: "Contracts" },
          { key: "avgDiscount", label: "Avg Discount" },
          { key: "status", label: "Status" },
        ], `provider-directory-${timestamp}`);
        break;
        
      case "contract-status":
        exportToCSV([
          { status: "Active", count: contractHealth.active, notes: "Currently active contracts" },
          { status: "Expiring in 30 days", count: contractHealth.expiring30, notes: "Requires immediate attention" },
          { status: "Expiring in 60 days", count: contractHealth.expiring60, notes: "Schedule renewal outreach" },
          { status: "Expiring in 90 days", count: contractHealth.expiring90, notes: "Plan renewal strategy" },
          { status: "Pending Renewal", count: contractHealth.pendingRenewal, notes: "Renewal in progress" },
          { status: "Recently Terminated", count: contractHealth.terminated, notes: "Last 90 days" },
        ], [
          { key: "status", label: "Contract Status" },
          { key: "count", label: "Count" },
          { key: "notes", label: "Notes" },
        ], `contract-status-${timestamp}`);
        break;
        
      case "credentialing-status":
        exportToCSV(credentialingPipeline.map(p => ({
          stage: p.stage,
          count: p.count,
          percentage: ((p.count / credentialingPipeline.reduce((a, b) => a + b.count, 0)) * 100).toFixed(1) + '%',
        })), [
          { key: "stage", label: "Pipeline Stage" },
          { key: "count", label: "Applications" },
          { key: "percentage", label: "% of Pipeline" },
        ], `credentialing-pipeline-${timestamp}`);
        break;
        
      case "savings-report":
        exportToCSV([
          { period: "This Month", claims: currentSavings.totalClaims, repriced: currentSavings.repriced, savings: formatCurrency(currentSavings.savings), avgDiscount: formatPercent(currentSavings.avgDiscount) },
          { period: "This Quarter", claims: claimsSavingsData.quarter.totalClaims, repriced: claimsSavingsData.quarter.repriced, savings: formatCurrency(claimsSavingsData.quarter.savings), avgDiscount: formatPercent(claimsSavingsData.quarter.avgDiscount) },
          { period: "This Year", claims: claimsSavingsData.year.totalClaims, repriced: claimsSavingsData.year.repriced, savings: formatCurrency(claimsSavingsData.year.savings), avgDiscount: formatPercent(claimsSavingsData.year.avgDiscount) },
        ], [
          { key: "period", label: "Period" },
          { key: "claims", label: "Total Claims" },
          { key: "repriced", label: "Repriced Claims" },
          { key: "savings", label: "Total Savings" },
          { key: "avgDiscount", label: "Avg Discount" },
        ], `savings-analysis-${timestamp}`);
        break;
        
      case "regional-coverage":
        exportToCSV(regionData.map(r => ({
          region: r.region,
          providers: r.providers,
          percentage: r.percentage + '%',
        })), [
          { key: "region", label: "Region" },
          { key: "providers", label: "Providers" },
          { key: "percentage", label: "% of Network" },
        ], `regional-coverage-${timestamp}`);
        break;
    }
    
    // Log the export for audit trail
    const reportLabels: Record<string, string> = {
      "network-summary": "Network Summary Report",
      "provider-directory": "Provider Directory",
      "contract-status": "Contract Status Report",
      "credentialing-status": "Credentialing Pipeline",
      "savings-report": "Savings Analysis",
      "regional-coverage": "Regional Coverage",
    };
    logExport(reportLabels[reportId] || reportId, 1, false);
    
    setExporting(null);
    setExportOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="Network Analytics"
        subtitle="Monitor network performance, growth trends, and key metrics"
        actions={
          <>
            {/* Export Dropdown */}
            <div className="relative" ref={exportRef}>
              <Button 
                variant="outline" 
                icon={<Download className="w-4 h-4" />}
                onClick={() => setExportOpen(!exportOpen)}
              >
                Export Report
                <ChevronDown className={cn("w-4 h-4 ml-1 transition-transform", exportOpen && "rotate-180")} />
              </Button>
              
              <AnimatePresence>
                {exportOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className={cn(
                      "absolute right-0 top-full mt-2 w-80 rounded-xl border shadow-xl z-50 overflow-hidden",
                      isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
                    )}
                  >
                    <div className={cn(
                      "px-4 py-3 border-b",
                      isDark ? "bg-slate-700/50 border-slate-700" : "bg-slate-50 border-slate-100"
                    )}>
                      <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>
                        Download Reports
                      </p>
                      <p className={cn("text-xs mt-0.5", isDark ? "text-slate-400" : "text-slate-500")}>
                        Export data as CSV files
                      </p>
                    </div>
                    <div className="p-2 max-h-80 overflow-y-auto">
                      {exportReports.map((report) => {
                        const Icon = report.icon;
                        const isExporting = exporting === report.id;
                        return (
                          <button
                            key={report.id}
                            onClick={() => handleExport(report.id)}
                            disabled={!!exporting}
                            className={cn(
                              "w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors",
                              isDark 
                                ? "hover:bg-slate-700/50" 
                                : "hover:bg-slate-50",
                              isExporting && "opacity-50 cursor-wait"
                            )}
                          >
                            <div className={cn(
                              "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                              isDark ? "bg-blue-500/20" : "bg-blue-50"
                            )}>
                              {isExporting ? (
                                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Icon className="w-4 h-4 text-blue-500" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={cn(
                                "text-sm font-medium",
                                isDark ? "text-white" : "text-slate-900"
                              )}>
                                {report.label}
                              </p>
                              <p className={cn(
                                "text-xs mt-0.5",
                                isDark ? "text-slate-400" : "text-slate-500"
                              )}>
                                {report.description}
                              </p>
                            </div>
                            <Download className={cn(
                              "w-4 h-4 flex-shrink-0 mt-0.5",
                              isDark ? "text-slate-500" : "text-slate-400"
                            )} />
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <Tabs
              tabs={dateRangeTabs}
              value={dateRange}
              onChange={(v) => setDateRange(v as DateRange)}
            />
          </>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {currentData.stats.map((stat, i) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            trend={stat.trend}
            icon={
              stat.label.includes("Provider") ? <Building2 className="w-5 h-5" /> :
              stat.label.includes("Contract") ? <FileSignature className="w-5 h-5" /> :
              stat.label.includes("Discount") ? <TrendingUp className="w-5 h-5" /> :
              <Activity className="w-5 h-5" />
            }
            delay={i}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Growth Chart - 2 columns */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Network Growth"
            icon={<BarChart3 className="w-5 h-5 text-blue-500" />}
            action={
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className={isDark ? "text-slate-400" : "text-slate-500"}>Providers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-teal-500" />
                  <span className={isDark ? "text-slate-400" : "text-slate-500"}>Contracts</span>
                </div>
              </div>
            }
          />
          
          {/* Simple Bar Chart */}
          <div className="mt-6 space-y-4">
            {currentData.monthlyData.map((data, i) => {
              const maxProviders = Math.max(...currentData.monthlyData.map(d => d.providers));
              const providerWidth = (data.providers / maxProviders) * 100;
              const contractWidth = (data.contracts / maxProviders) * 100;
              
              return (
                <motion.div
                  key={data.month}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <span className={cn(
                    "w-16 text-sm font-medium",
                    isDark ? "text-slate-400" : "text-slate-500"
                  )}>
                    {data.month}
                  </span>
                  <div className="flex-1 space-y-1.5">
                    <div className={cn(
                      "h-4 rounded-full overflow-hidden",
                      isDark ? "bg-slate-700" : "bg-slate-200"
                    )}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${providerWidth}%` }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                      />
                    </div>
                    <div className={cn(
                      "h-4 rounded-full overflow-hidden",
                      isDark ? "bg-slate-700" : "bg-slate-200"
                    )}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${contractWidth}%` }}
                        transition={{ duration: 0.5, delay: i * 0.1 + 0.1 }}
                        className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full"
                      />
                    </div>
                  </div>
                  <div className="w-24 text-right">
                    <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>
                      {data.providers.toLocaleString()}
                    </p>
                    <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                      {data.contracts.toLocaleString()}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Card>

        {/* Specialty Breakdown - 1 column */}
        <Card>
          <CardHeader
            title="By Specialty"
            icon={<PieChart className="w-5 h-5 text-blue-500" />}
          />
          <div className="space-y-4">
            {providersBySpecialty.map((item, i) => (
              <motion.div
                key={item.specialty}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>
                    {item.specialty}
                  </span>
                  <span className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                    {item.count}
                  </span>
                </div>
                <div className={cn(
                  "h-2 rounded-full overflow-hidden",
                  isDark ? "bg-slate-700" : "bg-slate-200"
                )}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className={cn("h-full rounded-full", item.color)}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Providers */}
        <Card>
          <CardHeader
            title="Top Provider Groups"
            icon={<Building2 className="w-5 h-5 text-blue-500" />}
          />
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={cn(
                  "text-left text-xs font-medium uppercase tracking-wider",
                  isDark ? "text-slate-400" : "text-slate-500"
                )}>
                  <th className="pb-3">Provider</th>
                  <th className="pb-3 text-center">Contracts</th>
                  <th className="pb-3 text-center">Avg Discount</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className={cn("divide-y", isDark ? "divide-slate-700/50" : "divide-slate-100")}>
                {topProviders.map((provider, i) => (
                  <tr key={i}>
                    <td className={cn("py-3", isDark ? "text-white" : "text-slate-900")}>
                      {provider.name}
                    </td>
                    <td className={cn("py-3 text-center", isDark ? "text-slate-300" : "text-slate-600")}>
                      {provider.contracts}
                    </td>
                    <td className="py-3 text-center">
                      <Badge variant="success">{provider.discount}</Badge>
                    </td>
                    <td className="py-3 text-right">
                      <Badge variant={provider.status === "active" ? "success" : "warning"} dot>
                        {provider.status === "active" ? "Active" : "Expiring"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Regional Distribution */}
        <Card>
          <CardHeader
            title="Regional Coverage"
            icon={<MapPin className="w-5 h-5 text-emerald-500" />}
          />
          <div className="space-y-4">
            {regionData.map((region, i) => (
              <motion.div
                key={region.region}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl",
                  isDark ? "bg-slate-700/30 border border-slate-700/50" : "bg-slate-50 border border-slate-100"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    isDark ? "bg-emerald-500/20" : "bg-emerald-50"
                  )}>
                    <MapPin className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>
                      {region.region}
                    </p>
                    <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                      {region.providers.toLocaleString()} providers
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn("text-lg font-bold", isDark ? "text-white" : "text-slate-900")}>
                    {region.percentage}%
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* Claims & Savings Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Claims & Savings Card */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Claims & Network Savings"
            icon={<DollarSign className="w-5 h-5 text-emerald-500" />}
            action={
              <Badge variant="success" dot>
                {formatPercent(currentSavings.avgDiscount)} avg savings
              </Badge>
            }
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className={cn(
              "p-4 rounded-xl",
              isDark ? "bg-slate-700/30" : "bg-slate-50"
            )}>
              <p className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                {currentSavings.totalClaims.toLocaleString()}
              </p>
              <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                Total Claims
              </p>
            </div>
            <div className={cn(
              "p-4 rounded-xl",
              isDark ? "bg-slate-700/30" : "bg-slate-50"
            )}>
              <p className={cn("text-2xl font-bold text-emerald-500")}>
                {currentSavings.repriced.toLocaleString()}
              </p>
              <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                Repriced Claims
              </p>
            </div>
            <div className={cn(
              "p-4 rounded-xl",
              isDark ? "bg-slate-700/30" : "bg-slate-50"
            )}>
              <p className={cn("text-2xl font-bold text-emerald-500")}>
                {formatCurrency(currentSavings.savings)}
              </p>
              <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                Total Savings
              </p>
            </div>
            <div className={cn(
              "p-4 rounded-xl",
              isDark ? "bg-slate-700/30" : "bg-slate-50"
            )}>
              <p className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                {((currentSavings.repriced / currentSavings.totalClaims) * 100).toFixed(1)}%
              </p>
              <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                Repricing Rate
              </p>
            </div>
          </div>
          <div className={cn(
            "p-4 rounded-xl border",
            isDark ? "bg-emerald-500/10 border-emerald-500/20" : "bg-emerald-50 border-emerald-100"
          )}>
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center",
                isDark ? "bg-emerald-500/20" : "bg-emerald-100"
              )}>
                <TrendingUp className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <p className={cn("font-semibold", isDark ? "text-white" : "text-slate-900")}>
                  {dateRange === "year" ? "Annual" : dateRange === "quarter" ? "Quarterly" : "Monthly"} Savings Impact
                </p>
                <p className={cn("text-sm", isDark ? "text-emerald-400" : "text-emerald-600")}>
                  Your network saved employers {formatCurrency(currentSavings.savings)} in {dateRange === "year" ? "the past year" : dateRange === "quarter" ? "this quarter" : "this month"}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Contract Health */}
        <Card>
          <CardHeader
            title="Contract Health"
            icon={<FileSignature className="w-5 h-5 text-blue-500" />}
          />
          <div className="space-y-3">
            <div className={cn(
              "flex items-center justify-between p-3 rounded-xl",
              isDark ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-emerald-50 border border-emerald-100"
            )}>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <span className={isDark ? "text-white" : "text-slate-900"}>Active</span>
              </div>
              <span className="text-lg font-bold text-emerald-500">{contractHealth.active.toLocaleString()}</span>
            </div>
            <div className={cn(
              "flex items-center justify-between p-3 rounded-xl",
              isDark ? "bg-red-500/10 border border-red-500/20" : "bg-red-50 border border-red-100"
            )}>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span className={isDark ? "text-white" : "text-slate-900"}>Expiring 30d</span>
              </div>
              <span className="text-lg font-bold text-red-500">{contractHealth.expiring30}</span>
            </div>
            <div className={cn(
              "flex items-center justify-between p-3 rounded-xl",
              isDark ? "bg-amber-500/10 border border-amber-500/20" : "bg-amber-50 border border-amber-100"
            )}>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                <span className={isDark ? "text-white" : "text-slate-900"}>Expiring 60d</span>
              </div>
              <span className="text-lg font-bold text-amber-500">{contractHealth.expiring60}</span>
            </div>
            <div className={cn(
              "flex items-center justify-between p-3 rounded-xl",
              isDark ? "bg-blue-500/10 border border-blue-500/20" : "bg-blue-50 border border-blue-100"
            )}>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <span className={isDark ? "text-white" : "text-slate-900"}>Expiring 90d</span>
              </div>
              <span className="text-lg font-bold text-blue-500">{contractHealth.expiring90}</span>
            </div>
            <div className={cn(
              "flex items-center justify-between p-3 rounded-xl",
              isDark ? "bg-purple-500/10 border border-purple-500/20" : "bg-purple-50 border border-purple-100"
            )}>
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-purple-500" />
                <span className={isDark ? "text-white" : "text-slate-900"}>Pending Renewal</span>
              </div>
              <span className="text-lg font-bold text-purple-500">{contractHealth.pendingRenewal}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Credentialing Pipeline */}
      <Card>
        <CardHeader
          title="Credentialing Pipeline"
          icon={<ShieldCheck className="w-5 h-5 text-purple-500" />}
          action={
            <Badge variant="primary">
              {credentialingPipeline.reduce((a, b) => a + b.count, 0)} applications in process
            </Badge>
          }
        />
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {credentialingPipeline.map((stage, i) => (
            <motion.div
              key={stage.stage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "relative p-4 rounded-xl text-center",
                isDark ? "bg-slate-700/30 border border-slate-700/50" : "bg-slate-50 border border-slate-100"
              )}
            >
              {i < credentialingPipeline.length - 1 && (
                <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 z-10">
                  <ChevronDown className={cn(
                    "w-4 h-4 rotate-[-90deg]",
                    isDark ? "text-slate-600" : "text-slate-300"
                  )} />
                </div>
              )}
              <div className={cn("w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center", stage.color + "/20")}>
                <span className={cn("text-lg font-bold", stage.color.replace("bg-", "text-"))}>{stage.count}</span>
              </div>
              <p className={cn(
                "text-xs font-medium",
                isDark ? "text-slate-300" : "text-slate-600"
              )}>
                {stage.stage}
              </p>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Quick Stats Footer */}
      <div className={cn(
        "grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl",
        isDark ? "bg-slate-800/50 border border-slate-700/50" : "bg-slate-100/50 border border-slate-200"
      )}>
        {[
          { label: "Network Coverage", value: "94%", icon: <Globe className="w-5 h-5" /> },
          { label: "Renewal Rate", value: "98%", icon: <CheckCircle className="w-5 h-5" /> },
          { label: "Avg Processing Time", value: "12 days", icon: <Clock className="w-5 h-5" /> },
          { label: "Active Alerts", value: "23", icon: <AlertTriangle className="w-5 h-5" /> },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              isDark ? "bg-slate-700" : "bg-white"
            )}>
              <div className="text-blue-500">{item.icon}</div>
            </div>
            <div>
              <p className={cn("text-lg font-bold", isDark ? "text-white" : "text-slate-900")}>
                {item.value}
              </p>
              <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                {item.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
