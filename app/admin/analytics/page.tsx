"use client";

import { useState } from "react";
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Building2, FileText, Download, Calendar, X, PieChart, ArrowUpRight, MapPin, CheckCircle, Clock, AlertTriangle, Users, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type DateRange = "This Month" | "Last Month" | "This Quarter" | "This Year";

interface KPI {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  color: string;
  drilldown: string;
}

interface MonthlyData {
  month: string;
  providers: number;
  contracts: number;
}

const dataByRange: Record<DateRange, { kpis: KPI[]; monthlyData: MonthlyData[] }> = {
  "This Month": {
    kpis: [
      { label: "Total Providers", value: "2,891", change: "+23", trend: "up", color: "text-green-400", drilldown: "providers" },
      { label: "Active Contracts", value: "2,654", change: "+18", trend: "up", color: "text-green-400", drilldown: "contracts" },
      { label: "Avg Discount Rate", value: "32.4%", change: "+1.2%", trend: "up", color: "text-green-400", drilldown: "discounts" },
      { label: "Network Coverage", value: "94%", change: "+2%", trend: "up", color: "text-green-400", drilldown: "coverage" },
      { label: "Pending Credentials", value: "47", change: "-12", trend: "down", color: "text-green-400", drilldown: "credentials" },
      { label: "Expiring (30 days)", value: "23", change: "-5", trend: "down", color: "text-amber-400", drilldown: "expiring" },
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
  "Last Month": {
    kpis: [
      { label: "Total Providers", value: "2,868", change: "+18", trend: "up", color: "text-green-400", drilldown: "providers" },
      { label: "Active Contracts", value: "2,636", change: "+14", trend: "up", color: "text-green-400", drilldown: "contracts" },
      { label: "Avg Discount Rate", value: "31.2%", change: "+0.8%", trend: "up", color: "text-green-400", drilldown: "discounts" },
      { label: "Network Coverage", value: "92%", change: "+1%", trend: "up", color: "text-green-400", drilldown: "coverage" },
      { label: "Pending Credentials", value: "59", change: "-8", trend: "down", color: "text-green-400", drilldown: "credentials" },
      { label: "Expiring (30 days)", value: "28", change: "+3", trend: "up", color: "text-amber-400", drilldown: "expiring" },
    ],
    monthlyData: [
      { month: "Sep", providers: 2680, contracts: 2450 },
      { month: "Oct", providers: 2720, contracts: 2490 },
      { month: "Nov", providers: 2780, contracts: 2540 },
      { month: "Dec", providers: 2810, contracts: 2580 },
      { month: "Jan", providers: 2845, contracts: 2610 },
      { month: "Feb", providers: 2868, contracts: 2636 },
    ],
  },
  "This Quarter": {
    kpis: [
      { label: "Total Providers", value: "2,891", change: "+81", trend: "up", color: "text-green-400", drilldown: "providers" },
      { label: "Active Contracts", value: "2,654", change: "+74", trend: "up", color: "text-green-400", drilldown: "contracts" },
      { label: "Avg Discount Rate", value: "32.4%", change: "+2.8%", trend: "up", color: "text-green-400", drilldown: "discounts" },
      { label: "Network Coverage", value: "94%", change: "+4%", trend: "up", color: "text-green-400", drilldown: "coverage" },
      { label: "New Providers", value: "81", change: "+15%", trend: "up", color: "text-cyan-400", drilldown: "newproviders" },
      { label: "Contracts Renewed", value: "156", change: "+22%", trend: "up", color: "text-green-400", drilldown: "renewals" },
    ],
    monthlyData: [
      { month: "Jan", providers: 2845, contracts: 2610 },
      { month: "Feb", providers: 2868, contracts: 2636 },
      { month: "Mar", providers: 2891, contracts: 2654 },
    ],
  },
  "This Year": {
    kpis: [
      { label: "Total Providers", value: "2,891", change: "+312", trend: "up", color: "text-green-400", drilldown: "providers" },
      { label: "Active Contracts", value: "2,654", change: "+285", trend: "up", color: "text-green-400", drilldown: "contracts" },
      { label: "Avg Discount Rate", value: "32.4%", change: "+5.2%", trend: "up", color: "text-green-400", drilldown: "discounts" },
      { label: "Network Coverage", value: "94%", change: "+12%", trend: "up", color: "text-green-400", drilldown: "coverage" },
      { label: "New Providers YTD", value: "312", change: "+28%", trend: "up", color: "text-cyan-400", drilldown: "newproviders" },
      { label: "Contracts Renewed YTD", value: "489", change: "+35%", trend: "up", color: "text-green-400", drilldown: "renewals" },
    ],
    monthlyData: [
      { month: "Jan", providers: 2580, contracts: 2370 },
      { month: "Feb", providers: 2620, contracts: 2400 },
      { month: "Mar", providers: 2680, contracts: 2450 },
      { month: "Apr", providers: 2710, contracts: 2480 },
      { month: "May", providers: 2740, contracts: 2510 },
      { month: "Jun", providers: 2770, contracts: 2540 },
      { month: "Jul", providers: 2795, contracts: 2565 },
      { month: "Aug", providers: 2820, contracts: 2590 },
      { month: "Sep", providers: 2845, contracts: 2610 },
      { month: "Oct", providers: 2860, contracts: 2625 },
      { month: "Nov", providers: 2875, contracts: 2640 },
      { month: "Dec", providers: 2891, contracts: 2654 },
    ],
  },
};

const specialtyBreakdown = [
  { name: "Primary Care", count: 892, percentage: 31, color: "bg-cyan-500" },
  { name: "Specialists", count: 756, percentage: 26, color: "bg-blue-500" },
  { name: "Hospitals/Facilities", count: 234, percentage: 8, color: "bg-purple-500" },
  { name: "Urgent Care", count: 345, percentage: 12, color: "bg-amber-500" },
  { name: "Mental Health", count: 289, percentage: 10, color: "bg-green-500" },
  { name: "Ancillary/Labs", count: 375, percentage: 13, color: "bg-pink-500" },
];

const topProviders = [
  { name: "Cleveland Clinic", specialty: "Multi-Specialty", locations: 45, discount: "38%", status: "active" },
  { name: "Metro Health System", specialty: "Hospital System", locations: 23, discount: "35%", status: "active" },
  { name: "University Hospitals", specialty: "Academic Medical", locations: 18, discount: "32%", status: "active" },
  { name: "Summa Health", specialty: "Regional System", locations: 12, discount: "30%", status: "active" },
  { name: "Mercy Health", specialty: "Faith-Based System", locations: 15, discount: "33%", status: "active" },
];

const drilldownData: Record<string, { title: string; subtitle: string; items: { label: string; value: string; detail?: string }[] }> = {
  providers: {
    title: "Provider Breakdown",
    subtitle: "By provider type",
    items: [
      { label: "Physicians", value: "1,892", detail: "65% of network" },
      { label: "NPs/PAs", value: "456", detail: "16% of network" },
      { label: "Facilities", value: "234", detail: "8% of network" },
      { label: "Ancillary", value: "309", detail: "11% of network" },
    ],
  },
  contracts: {
    title: "Contract Status",
    subtitle: "Active contract breakdown",
    items: [
      { label: "Full Network", value: "1,890", detail: "71% of contracts" },
      { label: "Specialty Only", value: "456", detail: "17% of contracts" },
      { label: "Single Location", value: "308", detail: "12% of contracts" },
    ],
  },
  discounts: {
    title: "Discount Analysis",
    subtitle: "Average by specialty",
    items: [
      { label: "Hospital Inpatient", value: "45%", detail: "vs. billed charges" },
      { label: "Hospital Outpatient", value: "38%", detail: "vs. billed charges" },
      { label: "Professional Services", value: "28%", detail: "vs. Medicare" },
      { label: "Labs/Imaging", value: "52%", detail: "vs. billed charges" },
    ],
  },
  coverage: {
    title: "Network Coverage",
    subtitle: "By Ohio region",
    items: [
      { label: "Northeast Ohio", value: "98%", detail: "Cleveland metro" },
      { label: "Central Ohio", value: "94%", detail: "Columbus metro" },
      { label: "Southwest Ohio", value: "91%", detail: "Cincinnati metro" },
      { label: "Rural Ohio", value: "78%", detail: "Non-metro counties" },
    ],
  },
  credentials: {
    title: "Credentialing Queue",
    subtitle: "Pending verification",
    items: [
      { label: "Initial Applications", value: "23", detail: "New providers" },
      { label: "Re-credentialing", value: "18", detail: "Renewals due" },
      { label: "Document Updates", value: "6", detail: "Missing docs" },
    ],
  },
  expiring: {
    title: "Expiring Contracts",
    subtitle: "Next 30 days",
    items: [
      { label: "Primary Care", value: "8", detail: "Action needed" },
      { label: "Specialists", value: "6", detail: "Renewal pending" },
      { label: "Facilities", value: "5", detail: "Under negotiation" },
      { label: "Ancillary", value: "4", detail: "Auto-renew eligible" },
    ],
  },
  newproviders: {
    title: "New Provider Additions",
    subtitle: "Recent onboarding",
    items: [
      { label: "Primary Care", value: "28", detail: "This quarter" },
      { label: "Specialists", value: "32", detail: "This quarter" },
      { label: "Urgent Care", value: "12", detail: "This quarter" },
      { label: "Mental Health", value: "9", detail: "This quarter" },
    ],
  },
  renewals: {
    title: "Contract Renewals",
    subtitle: "Completed this period",
    items: [
      { label: "Auto-Renewed", value: "89", detail: "Same terms" },
      { label: "Renegotiated", value: "45", detail: "Improved terms" },
      { label: "Extended", value: "22", detail: "1-year extension" },
    ],
  },
};

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange>("This Month");
  const [selectedDrilldown, setSelectedDrilldown] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  const currentData = dataByRange[dateRange];
  const maxProviders = Math.max(...currentData.monthlyData.map(d => d.providers));

  const handleExport = (format: string) => {
    setShowExportModal(false);
    const link = document.createElement("a");
    link.href = `/reports/provider-roster.csv`;
    link.download = `network-analytics-${dateRange.toLowerCase().replace(" ", "-")}.${format}`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Network Analytics</h1>
            <p className="text-slate-400">Provider network performance and insights</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value as DateRange)} 
            className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white cursor-pointer"
          >
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Quarter</option>
            <option>This Year</option>
          </select>
          <button 
            onClick={() => setShowExportModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            <Download className="w-4 h-4" />Export
          </button>
        </div>
      </div>

      {/* KPI Cards - Clickable */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {currentData.kpis.map((kpi) => (
          <button
            key={kpi.label}
            onClick={() => setSelectedDrilldown(kpi.drilldown)}
            className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-4 text-left hover:from-teal-600 hover:to-cyan-600 transition-all group shadow-lg"
          >
            <p className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>{kpi.label}</p>
            <p className="text-2xl font-bold transition-colors" style={{ color: 'white' }}>{kpi.value}</p>
            <p className={`text-sm flex items-center gap-1 mt-1 ${kpi.color}`}>
              {kpi.trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {kpi.change}
            </p>
            <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.8)' }}>
                Click for details <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Provider Growth Chart */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Network Growth</h2>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Calendar className="w-4 h-4" />
              {dateRange}
            </div>
          </div>
          <div className="flex items-end justify-between h-48 gap-1">
            {currentData.monthlyData.map((d, i) => (
              <div key={d.month} className="flex-1 flex flex-col items-center group cursor-pointer">
                <div className="relative w-full">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${(d.providers / maxProviders) * 180}px` }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="w-full bg-gradient-to-t from-teal-600 to-cyan-500 rounded-t group-hover:from-cyan-600 group-hover:to-cyan-400 transition-colors"
                  />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-700 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {d.providers.toLocaleString()} providers
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">{d.month}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-slate-700">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-t from-teal-600 to-cyan-500 rounded"></div>
              <span className="text-xs text-slate-400">Total Providers</span>
            </div>
          </div>
        </div>

        {/* Specialty Distribution */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Specialty Distribution</h2>
            <PieChart className="w-5 h-5 text-slate-400" />
          </div>
          <div className="p-6 space-y-4">
            {specialtyBreakdown.map((specialty) => (
              <div key={specialty.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white">{specialty.name}</span>
                  <span className="text-slate-400">{specialty.count} ({specialty.percentage}%)</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${specialty.percentage}%` }}
                    transition={{ duration: 0.5 }}
                    className={`h-full ${specialty.color} rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Health Systems */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Top Health Systems</h2>
            <button className="text-sm text-cyan-500 hover:text-cyan-400">View All</button>
          </div>
          <div className="divide-y divide-slate-700">
            {topProviders.map((provider, i) => (
              <motion.div 
                key={provider.name} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="px-6 py-4 flex items-center justify-between hover:bg-slate-700/50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-cyan-600/20 text-cyan-500 rounded-full flex items-center justify-center text-xs font-medium">{i + 1}</span>
                  <div>
                    <p className="font-medium text-white">{provider.name}</p>
                    <p className="text-sm text-slate-400">{provider.specialty}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white">{provider.locations} locations</p>
                  <p className="text-sm text-green-400">{provider.discount} discount</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-900/80 to-slate-800 rounded-xl p-5 cursor-pointer hover:from-blue-800/80 hover:to-slate-700 transition-all border border-blue-800/50 shadow-lg" onClick={() => setSelectedDrilldown("providers")}>
            <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center border border-cyan-500/30 mb-3">
              <Building2 className="w-5 h-5 text-cyan-400" />
            </div>
            <p className="text-3xl font-bold text-white">2,891</p>
            <p className="text-slate-300">Total Providers</p>
          </div>
          <div className="bg-gradient-to-br from-blue-900/80 to-slate-800 rounded-xl p-5 cursor-pointer hover:from-blue-800/80 hover:to-slate-700 transition-all border border-blue-800/50 shadow-lg" onClick={() => setSelectedDrilldown("discounts")}>
            <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center border border-cyan-500/30 mb-3">
              <DollarSign className="w-5 h-5 text-cyan-400" />
            </div>
            <p className="text-3xl font-bold text-white">32.4%</p>
            <p className="text-slate-300">Avg Discount Rate</p>
          </div>
          <div className="bg-gradient-to-br from-blue-900/80 to-slate-800 rounded-xl p-5 cursor-pointer hover:from-blue-800/80 hover:to-slate-700 transition-all border border-blue-800/50 shadow-lg" onClick={() => setSelectedDrilldown("coverage")}>
            <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center border border-cyan-500/30 mb-3">
              <MapPin className="w-5 h-5 text-cyan-400" />
            </div>
            <p className="text-3xl font-bold text-white">88</p>
            <p className="text-slate-300">Counties Covered</p>
          </div>
          <div className="bg-gradient-to-br from-blue-900/80 to-slate-800 rounded-xl p-5 cursor-pointer hover:from-blue-800/80 hover:to-slate-700 transition-all border border-blue-800/50 shadow-lg" onClick={() => setSelectedDrilldown("credentials")}>
            <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center border border-cyan-500/30 mb-3">
              <Shield className="w-5 h-5 text-cyan-400" />
            </div>
            <p className="text-3xl font-bold text-cyan-400">98.2%</p>
            <p className="text-slate-300">Credentialed</p>
          </div>
        </div>
      </div>

      {/* Contract & Credentialing Status */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            Contract Status
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Active</span>
              <span className="font-semibold text-green-400">2,654</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Pending Renewal</span>
              <span className="font-semibold text-amber-400">89</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">In Negotiation</span>
              <span className="font-semibold text-blue-400">45</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Terminated</span>
              <span className="font-semibold text-red-400">12</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-400" />
            Credentialing Status
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Fully Credentialed</span>
              <span className="font-semibold text-green-400">2,756</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">In Process</span>
              <span className="font-semibold text-amber-400">47</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Expiring Soon</span>
              <span className="font-semibold text-orange-400">56</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Action Required</span>
              <span className="font-semibold text-red-400">32</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            Upcoming Expirations
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Next 30 days</span>
              <span className="font-semibold text-red-400">23</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">31-60 days</span>
              <span className="font-semibold text-amber-400">45</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">61-90 days</span>
              <span className="font-semibold text-yellow-400">67</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">90+ days</span>
              <span className="font-semibold text-green-400">2,519</span>
            </div>
          </div>
        </div>
      </div>

      {/* Drilldown Modal */}
      <AnimatePresence>
        {selectedDrilldown && drilldownData[selectedDrilldown] && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedDrilldown(null)} 
              className="fixed inset-0 bg-black/60 z-50" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }} 
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-700">
                <div>
                  <h2 className="text-lg font-semibold text-white">{drilldownData[selectedDrilldown].title}</h2>
                  <p className="text-sm text-slate-400">{drilldownData[selectedDrilldown].subtitle}</p>
                </div>
                <button onClick={() => setSelectedDrilldown(null)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 space-y-3">
                {drilldownData[selectedDrilldown].items.map((item, i) => (
                  <motion.div 
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-white">{item.label}</p>
                      {item.detail && <p className="text-sm text-slate-400">{item.detail}</p>}
                    </div>
                    <p className="text-lg font-bold text-cyan-500">{item.value}</p>
                  </motion.div>
                ))}
              </div>
              <div className="p-4 border-t border-slate-700 flex justify-end">
                <button 
                  onClick={() => setSelectedDrilldown(null)} 
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Export Modal */}
      <AnimatePresence>
        {showExportModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setShowExportModal(false)} 
              className="fixed inset-0 bg-black/60 z-50" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }} 
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-slate-700">
                <h2 className="text-lg font-semibold text-white">Export Analytics</h2>
                <p className="text-sm text-slate-400">Choose export format</p>
              </div>
              <div className="p-4 space-y-2">
                <button onClick={() => handleExport("csv")} className="w-full flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                  <FileText className="w-5 h-5 text-green-400" />
                  <div className="text-left">
                    <p className="font-medium text-white">CSV</p>
                    <p className="text-sm text-slate-400">Spreadsheet format</p>
                  </div>
                </button>
                <button onClick={() => handleExport("pdf")} className="w-full flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                  <FileText className="w-5 h-5 text-red-400" />
                  <div className="text-left">
                    <p className="font-medium text-white">PDF</p>
                    <p className="text-sm text-slate-400">Print-ready report</p>
                  </div>
                </button>
                <button onClick={() => handleExport("xlsx")} className="w-full flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <div className="text-left">
                    <p className="font-medium text-white">Excel</p>
                    <p className="text-sm text-slate-400">Full workbook with charts</p>
                  </div>
                </button>
              </div>
              <div className="p-4 border-t border-slate-700">
                <button onClick={() => setShowExportModal(false)} className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">
                  Cancel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
