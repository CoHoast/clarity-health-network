"use client";

import { useState } from "react";
import { BarChart3, TrendingUp, TrendingDown, Building2, FileText, Download, Calendar, PieChart, MapPin, CheckCircle, Clock, AlertTriangle, Users, FileSignature, Globe, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/components/admin/ThemeContext";
import { Card, CardHeader } from "@/components/admin/ui/Card";
import { StatCard } from "@/components/admin/ui/StatCard";
import { Badge } from "@/components/admin/ui/Badge";
import { Button } from "@/components/admin/ui/Button";
import { PageHeader, Tabs } from "@/components/admin/ui/PageHeader";
import { cn } from "@/lib/utils";

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
  { specialty: "Primary Care", count: 892, percentage: 31, color: "bg-cyan-500" },
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

export default function AnalyticsPage() {
  const { isDark } = useTheme();
  const [dateRange, setDateRange] = useState<DateRange>("month");

  const currentData = dataByRange[dateRange];

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="Network Analytics"
        subtitle="Monitor network performance, growth trends, and key metrics"
        actions={
          <>
            <Button variant="outline" icon={<Download className="w-4 h-4" />}>
              Export Report
            </Button>
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
            icon={<BarChart3 className="w-5 h-5 text-cyan-500" />}
            action={
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-cyan-500" />
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
                        className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full"
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
            icon={<PieChart className="w-5 h-5 text-teal-500" />}
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
            icon={<Building2 className="w-5 h-5 text-cyan-500" />}
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
              <div className="text-cyan-500">{item.icon}</div>
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
