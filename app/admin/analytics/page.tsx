"use client";

import { useState } from "react";
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Users, FileText, Activity, Download, Calendar, X, PieChart, ArrowUpRight, Building2, MapPin, AlertTriangle, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type DateRange = "This Month" | "Last Month" | "This Quarter" | "This Year";
type TabId = "overview" | "claims" | "members" | "providers" | "financial";

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
  claims: number;
  members: number;
}

const dataByRange: Record<DateRange, { kpis: KPI[]; monthlyData: MonthlyData[] }> = {
  "This Month": {
    kpis: [
      { label: "Total Claims MTD", value: "$2.4M", change: "+12%", trend: "up", color: "text-green-400", drilldown: "claims" },
      { label: "Avg Processing Time", value: "2.3 days", change: "-18%", trend: "down", color: "text-green-400", drilldown: "processing" },
      { label: "Denial Rate", value: "4.2%", change: "-0.8%", trend: "down", color: "text-green-400", drilldown: "denials" },
      { label: "Clean Claim Rate", value: "94.5%", change: "+2.1%", trend: "up", color: "text-green-400", drilldown: "clean" },
      { label: "Active Members", value: "12,847", change: "+156", trend: "up", color: "text-blue-400", drilldown: "members" },
      { label: "Network Providers", value: "2,891", change: "+23", trend: "up", color: "text-cyan-500", drilldown: "providers" },
    ],
    monthlyData: [
      { month: "Oct", claims: 1850000, members: 12100 },
      { month: "Nov", claims: 2100000, members: 12350 },
      { month: "Dec", claims: 2450000, members: 12500 },
      { month: "Jan", claims: 2200000, members: 12650 },
      { month: "Feb", claims: 2150000, members: 12750 },
      { month: "Mar", claims: 2400000, members: 12847 },
    ],
  },
  "Last Month": {
    kpis: [
      { label: "Total Claims MTD", value: "$2.15M", change: "+8%", trend: "up", color: "text-green-400", drilldown: "claims" },
      { label: "Avg Processing Time", value: "2.5 days", change: "-12%", trend: "down", color: "text-green-400", drilldown: "processing" },
      { label: "Denial Rate", value: "5.0%", change: "-0.3%", trend: "down", color: "text-green-400", drilldown: "denials" },
      { label: "Clean Claim Rate", value: "92.4%", change: "+1.5%", trend: "up", color: "text-green-400", drilldown: "clean" },
      { label: "Active Members", value: "12,691", change: "+142", trend: "up", color: "text-blue-400", drilldown: "members" },
      { label: "Network Providers", value: "2,868", change: "+18", trend: "up", color: "text-cyan-500", drilldown: "providers" },
    ],
    monthlyData: [
      { month: "Sep", claims: 1720000, members: 11900 },
      { month: "Oct", claims: 1850000, members: 12100 },
      { month: "Nov", claims: 2100000, members: 12350 },
      { month: "Dec", claims: 2450000, members: 12500 },
      { month: "Jan", claims: 2200000, members: 12650 },
      { month: "Feb", claims: 2150000, members: 12691 },
    ],
  },
  "This Quarter": {
    kpis: [
      { label: "Total Claims QTD", value: "$6.75M", change: "+15%", trend: "up", color: "text-green-400", drilldown: "claims" },
      { label: "Avg Processing Time", value: "2.4 days", change: "-15%", trend: "down", color: "text-green-400", drilldown: "processing" },
      { label: "Denial Rate", value: "4.5%", change: "-1.2%", trend: "down", color: "text-green-400", drilldown: "denials" },
      { label: "Clean Claim Rate", value: "93.8%", change: "+3.1%", trend: "up", color: "text-green-400", drilldown: "clean" },
      { label: "Active Members", value: "12,847", change: "+347", trend: "up", color: "text-blue-400", drilldown: "members" },
      { label: "Network Providers", value: "2,891", change: "+68", trend: "up", color: "text-cyan-500", drilldown: "providers" },
    ],
    monthlyData: [
      { month: "Jan", claims: 2200000, members: 12500 },
      { month: "Feb", claims: 2150000, members: 12691 },
      { month: "Mar", claims: 2400000, members: 12847 },
    ],
  },
  "This Year": {
    kpis: [
      { label: "Total Claims YTD", value: "$18.2M", change: "+22%", trend: "up", color: "text-green-400", drilldown: "claims" },
      { label: "Avg Processing Time", value: "2.6 days", change: "-25%", trend: "down", color: "text-green-400", drilldown: "processing" },
      { label: "Denial Rate", value: "4.8%", change: "-2.1%", trend: "down", color: "text-green-400", drilldown: "denials" },
      { label: "Clean Claim Rate", value: "92.1%", change: "+4.8%", trend: "up", color: "text-green-400", drilldown: "clean" },
      { label: "Active Members", value: "12,847", change: "+1,247", trend: "up", color: "text-blue-400", drilldown: "members" },
      { label: "Network Providers", value: "2,891", change: "+312", trend: "up", color: "text-cyan-500", drilldown: "providers" },
    ],
    monthlyData: [
      { month: "Jan", claims: 2200000, members: 11600 },
      { month: "Feb", claims: 2150000, members: 11800 },
      { month: "Mar", claims: 2400000, members: 12000 },
      { month: "Apr", claims: 2100000, members: 12150 },
      { month: "May", claims: 2300000, members: 12350 },
      { month: "Jun", claims: 2450000, members: 12500 },
      { month: "Jul", claims: 2380000, members: 12600 },
      { month: "Aug", claims: 2420000, members: 12700 },
      { month: "Sep", claims: 2350000, members: 12750 },
      { month: "Oct", claims: 2500000, members: 12800 },
      { month: "Nov", claims: 2550000, members: 12820 },
      { month: "Dec", claims: 2400000, members: 12847 },
    ],
  },
};

const kpisDefault = dataByRange["This Month"].kpis;
const monthlyDataDefault = dataByRange["This Month"].monthlyData;

const topProvidersByTab = {
  overview: [
    { name: "Cleveland Family Medicine", claims: 423, amount: "$156,230", trend: "+12%" },
    { name: "Metro Hospital", claims: 287, amount: "$892,450", trend: "+8%" },
    { name: "Westlake Urgent Care", claims: 512, amount: "$98,750", trend: "+15%" },
    { name: "Cleveland Orthopedic", claims: 156, amount: "$445,200", trend: "+5%" },
    { name: "Metro Imaging Center", claims: 345, amount: "$234,100", trend: "+10%" },
  ],
  claims: [
    { name: "Metro Hospital", claims: 892, amount: "$2,450,000", trend: "+18%" },
    { name: "Cleveland Clinic", claims: 756, amount: "$1,890,000", trend: "+12%" },
    { name: "University Hospitals", claims: 634, amount: "$1,560,000", trend: "+9%" },
    { name: "Westlake Medical", claims: 512, amount: "$890,000", trend: "+14%" },
    { name: "Quest Diagnostics", claims: 1245, amount: "$456,000", trend: "+22%" },
  ],
  members: [
    { name: "Acme Corporation", claims: 2340, amount: "1,234 members", trend: "+8%" },
    { name: "TechStart Inc", claims: 1890, amount: "892 members", trend: "+12%" },
    { name: "Global Industries", claims: 1560, amount: "756 members", trend: "+5%" },
    { name: "Cleveland Mfg", claims: 1234, amount: "612 members", trend: "+3%" },
    { name: "MedTech Solutions", claims: 987, amount: "489 members", trend: "+15%" },
  ],
  providers: [
    { name: "Primary Care", claims: 156, amount: "45% of network", trend: "+12" },
    { name: "Specialists", claims: 89, amount: "28% of network", trend: "+8" },
    { name: "Hospitals", claims: 23, amount: "8% of network", trend: "+2" },
    { name: "Urgent Care", claims: 34, amount: "12% of network", trend: "+5" },
    { name: "Imaging/Labs", claims: 45, amount: "7% of network", trend: "+3" },
  ],
  financial: [
    { name: "Premium Revenue", claims: 0, amount: "$3.84M", trend: "+8%" },
    { name: "Claims Expense", claims: 0, amount: "$3.15M", trend: "+12%" },
    { name: "Admin Costs", claims: 0, amount: "$384K", trend: "+3%" },
    { name: "Net Income", claims: 0, amount: "$326K", trend: "-15%" },
    { name: "MLR", claims: 0, amount: "82.0%", trend: "+3.6%" },
  ],
};

const drilldownData: Record<string, { title: string; subtitle: string; items: { label: string; value: string; detail?: string }[] }> = {
  claims: {
    title: "Claims Breakdown",
    subtitle: "By service category this period",
    items: [
      { label: "Inpatient", value: "$890,000", detail: "156 claims" },
      { label: "Outpatient", value: "$650,000", detail: "423 claims" },
      { label: "Professional", value: "$480,000", detail: "892 claims" },
      { label: "Lab/Imaging", value: "$280,000", detail: "567 claims" },
      { label: "Pharmacy", value: "$100,000", detail: "234 claims" },
    ],
  },
  processing: {
    title: "Processing Time Details",
    subtitle: "Average days by claim type",
    items: [
      { label: "Clean Claims", value: "1.2 days", detail: "94.5% of total" },
      { label: "Claims w/ Edits", value: "3.8 days", detail: "4.2% of total" },
      { label: "Manual Review", value: "5.2 days", detail: "1.3% of total" },
      { label: "Appeals", value: "12.4 days", detail: "0.8% of total" },
    ],
  },
  denials: {
    title: "Denial Breakdown",
    subtitle: "Top denial reasons this period",
    items: [
      { label: "Missing Info", value: "1.8%", detail: "234 claims" },
      { label: "Authorization", value: "1.2%", detail: "156 claims" },
      { label: "Eligibility", value: "0.7%", detail: "89 claims" },
      { label: "Duplicate", value: "0.3%", detail: "42 claims" },
      { label: "Other", value: "0.2%", detail: "28 claims" },
    ],
  },
  clean: {
    title: "Clean Claim Analysis",
    subtitle: "First-pass acceptance rate",
    items: [
      { label: "Auto-Adjudicated", value: "78.2%", detail: "Processed < 1 day" },
      { label: "Quick Review", value: "12.3%", detail: "Processed 1-2 days" },
      { label: "Standard Review", value: "4.0%", detail: "Processed 2-5 days" },
      { label: "Complex Review", value: "5.5%", detail: "Processed 5+ days" },
    ],
  },
  members: {
    title: "Member Statistics",
    subtitle: "Enrollment and demographics",
    items: [
      { label: "New Enrollments", value: "+156", detail: "This month" },
      { label: "Terminations", value: "-42", detail: "This month" },
      { label: "Net Growth", value: "+114", detail: "0.9% increase" },
      { label: "Avg Age", value: "42.3 yrs", detail: "Range: 0-85" },
      { label: "Family Plans", value: "68%", detail: "8,736 members" },
    ],
  },
  providers: {
    title: "Provider Network",
    subtitle: "Network composition",
    items: [
      { label: "Primary Care", value: "1,245", detail: "43% of network" },
      { label: "Specialists", value: "892", detail: "31% of network" },
      { label: "Hospitals", value: "45", detail: "2% of network" },
      { label: "Urgent Care", value: "156", detail: "5% of network" },
      { label: "Ancillary", value: "553", detail: "19% of network" },
    ],
  },
};

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange>("This Month");
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [selectedDrilldown, setSelectedDrilldown] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  const currentData = dataByRange[dateRange];
  const maxClaims = Math.max(...currentData.monthlyData.map(d => d.claims));
  const topProviders = topProvidersByTab[activeTab] || topProvidersByTab.overview;

  const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "claims", label: "Claims", icon: FileText },
    { id: "members", label: "Members", icon: Users },
    { id: "providers", label: "Providers", icon: Building2 },
    { id: "financial", label: "Financial", icon: DollarSign },
  ];

  const handleExport = (format: string) => {
    setShowExportModal(false);
    // Simulate download
    const link = document.createElement("a");
    link.href = `/reports/claims-summary.csv`;
    link.download = `analytics-${activeTab}-${dateRange.toLowerCase().replace(" ", "-")}.${format}`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
            <p className="text-slate-400">Executive summary and KPIs</p>
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

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "bg-teal-600 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* KPI Cards - Clickable */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {currentData.kpis.map((kpi) => (
          <button
            key={kpi.label}
            onClick={() => setSelectedDrilldown(kpi.drilldown)}
            className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 text-left hover:border-cyan-600 hover:bg-slate-800 transition-all group"
          >
            <p className="text-sm text-slate-400 mb-1">{kpi.label}</p>
            <p className="text-2xl font-bold text-white group-hover:text-cyan-500 transition-colors">{kpi.value}</p>
            <p className={`text-sm flex items-center gap-1 mt-1 ${kpi.color}`}>
              {kpi.trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {kpi.change}
            </p>
            <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs text-cyan-500 flex items-center gap-1">
                Click for details <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Claims Trend Chart - Interactive */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">
              {activeTab === "members" ? "Member Growth Trend" : "Claims Volume Trend"}
            </h2>
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
                    animate={{ height: `${(d.claims / maxClaims) * 180}px` }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="w-full bg-gradient-to-t from-teal-600 to-cyan-500 rounded-t group-hover:from-cyan-600 group-hover:to-cyan-400 transition-colors"
                  />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-700 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    ${(d.claims / 1000000).toFixed(2)}M
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">{d.month}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Content Based on Tab */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              {activeTab === "overview" && "Top Providers by Volume"}
              {activeTab === "claims" && "Highest Claim Volume"}
              {activeTab === "members" && "Top Employer Groups"}
              {activeTab === "providers" && "Network by Specialty"}
              {activeTab === "financial" && "Financial Summary"}
            </h2>
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
                    <p className="text-sm text-slate-400">{provider.claims > 0 ? `${provider.claims} claims` : ""}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white">{provider.amount}</p>
                  <p className={`text-sm ${provider.trend.startsWith("+") ? "text-green-400" : "text-red-400"}`}>{provider.trend}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats - Tab Specific */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {activeTab === "overview" && (
          <>
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl p-5 text-white cursor-pointer hover:scale-[1.02] transition-transform" onClick={() => setSelectedDrilldown("claims")}>
              <DollarSign className="w-8 h-8 text-green-200 mb-3" />
              <p className="text-3xl font-bold">$18.2M</p>
              <p className="text-green-100">YTD Paid Claims</p>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-5 text-white cursor-pointer hover:scale-[1.02] transition-transform" onClick={() => setSelectedDrilldown("members")}>
              <Users className="w-8 h-8 text-blue-200 mb-3" />
              <p className="text-3xl font-bold">98.2%</p>
              <p className="text-blue-100">Member Retention</p>
            </div>
            <div className="bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl p-5 text-white cursor-pointer hover:scale-[1.02] transition-transform" onClick={() => setSelectedDrilldown("processing")}>
              <FileText className="w-8 h-8 text-cyan-200 mb-3" />
              <p className="text-3xl font-bold">47,234</p>
              <p className="text-cyan-100">Claims Processed</p>
            </div>
            <div className="bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl p-5 text-white cursor-pointer hover:scale-[1.02] transition-transform">
              <Activity className="w-8 h-8 text-amber-200 mb-3" />
              <p className="text-3xl font-bold">99.9%</p>
              <p className="text-amber-100">System Uptime</p>
            </div>
          </>
        )}
        {activeTab === "claims" && (
          <>
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl p-5 text-white">
              <CheckCircle className="w-8 h-8 text-green-200 mb-3" />
              <p className="text-3xl font-bold">94.5%</p>
              <p className="text-green-100">Clean Claim Rate</p>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-5 text-white">
              <Activity className="w-8 h-8 text-blue-200 mb-3" />
              <p className="text-3xl font-bold">2.3 days</p>
              <p className="text-blue-100">Avg Processing</p>
            </div>
            <div className="bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl p-5 text-white">
              <AlertTriangle className="w-8 h-8 text-amber-200 mb-3" />
              <p className="text-3xl font-bold">4.2%</p>
              <p className="text-amber-100">Denial Rate</p>
            </div>
            <div className="bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl p-5 text-white">
              <DollarSign className="w-8 h-8 text-cyan-200 mb-3" />
              <p className="text-3xl font-bold">$1,847</p>
              <p className="text-cyan-100">Avg Claim Cost</p>
            </div>
          </>
        )}
        {activeTab === "members" && (
          <>
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-5 text-white">
              <Users className="w-8 h-8 text-blue-200 mb-3" />
              <p className="text-3xl font-bold">12,847</p>
              <p className="text-blue-100">Total Members</p>
            </div>
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl p-5 text-white">
              <TrendingUp className="w-8 h-8 text-green-200 mb-3" />
              <p className="text-3xl font-bold">+156</p>
              <p className="text-green-100">New This Month</p>
            </div>
            <div className="bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl p-5 text-white">
              <Building2 className="w-8 h-8 text-cyan-200 mb-3" />
              <p className="text-3xl font-bold">234</p>
              <p className="text-cyan-100">Employer Groups</p>
            </div>
            <div className="bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl p-5 text-white">
              <MapPin className="w-8 h-8 text-amber-200 mb-3" />
              <p className="text-3xl font-bold">12</p>
              <p className="text-amber-100">Counties Served</p>
            </div>
          </>
        )}
        {activeTab === "providers" && (
          <>
            <div className="bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl p-5 text-white">
              <Building2 className="w-8 h-8 text-cyan-200 mb-3" />
              <p className="text-3xl font-bold">2,891</p>
              <p className="text-cyan-100">Total Providers</p>
            </div>
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl p-5 text-white">
              <CheckCircle className="w-8 h-8 text-green-200 mb-3" />
              <p className="text-3xl font-bold">94%</p>
              <p className="text-green-100">Network Coverage</p>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-5 text-white">
              <TrendingUp className="w-8 h-8 text-blue-200 mb-3" />
              <p className="text-3xl font-bold">+23</p>
              <p className="text-blue-100">New This Month</p>
            </div>
            <div className="bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl p-5 text-white">
              <MapPin className="w-8 h-8 text-amber-200 mb-3" />
              <p className="text-3xl font-bold">156</p>
              <p className="text-amber-100">Locations</p>
            </div>
          </>
        )}
        {activeTab === "financial" && (
          <>
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl p-5 text-white">
              <DollarSign className="w-8 h-8 text-green-200 mb-3" />
              <p className="text-3xl font-bold">$3.84M</p>
              <p className="text-green-100">Q1 Revenue</p>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-5 text-white">
              <PieChart className="w-8 h-8 text-blue-200 mb-3" />
              <p className="text-3xl font-bold">82.0%</p>
              <p className="text-blue-100">Medical Loss Ratio</p>
            </div>
            <div className="bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl p-5 text-white">
              <TrendingUp className="w-8 h-8 text-cyan-200 mb-3" />
              <p className="text-3xl font-bold">$326K</p>
              <p className="text-cyan-100">Net Income Q1</p>
            </div>
            <div className="bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl p-5 text-white">
              <Activity className="w-8 h-8 text-amber-200 mb-3" />
              <p className="text-3xl font-bold">10.0%</p>
              <p className="text-amber-100">Admin Ratio</p>
            </div>
          </>
        )}
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
