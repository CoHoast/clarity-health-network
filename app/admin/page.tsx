"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Building2,
  FileSignature,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  BarChart3,
  Users,
  Calendar,
  Plus,
} from "lucide-react";
import { useTheme } from "@/components/admin/ThemeContext";

const stats = [
  { label: "Total Providers", value: "2,847", change: "+24 this month", trend: "up", icon: Building2 },
  { label: "Active Contracts", value: "2,634", change: "93% of network", trend: "up", icon: FileSignature },
  { label: "Expiring Soon", value: "47", change: "Next 30 days", trend: "warning", icon: AlertTriangle },
  { label: "Avg. Discount", value: "34%", change: "+2.1% vs last year", trend: "up", icon: DollarSign },
];

const expiringContracts = [
  { provider: "Midwest Regional Medical", npi: "1234567890", expires: "Mar 28, 2026", discount: "35%", status: "Renewal Sent" },
  { provider: "Summit Health Specialists", npi: "2345678901", expires: "Apr 2, 2026", discount: "30%", status: "Pending Review" },
  { provider: "Valley Care Associates", npi: "3456789012", expires: "Apr 5, 2026", discount: "40%", status: "Not Started" },
  { provider: "Premier Orthopedics", npi: "4567890123", expires: "Apr 12, 2026", discount: "28%", status: "Renewal Sent" },
  { provider: "Citywide Imaging Center", npi: "5678901234", expires: "Apr 15, 2026", discount: "45%", status: "Not Started" },
];

const recentActivity = [
  { type: "provider", title: "New Provider Added", message: "Dr. Sarah Chen - Cardiology", time: "15m ago" },
  { type: "contract", title: "Contract Renewed", message: "Lakeside Medical Group - 3 year term", time: "1h ago" },
  { type: "discount", title: "Rate Updated", message: "Regional Hospital - 38% → 42%", time: "2h ago" },
  { type: "credentialing", title: "Credentialing Complete", message: "5 providers verified", time: "3h ago" },
  { type: "provider", title: "Provider Updated", message: "NPI 9876543210 - address change", time: "4h ago" },
];

const providersBySpecialty = [
  { specialty: "Primary Care", count: 892, percentage: 31 },
  { specialty: "Specialists", count: 756, percentage: 27 },
  { specialty: "Hospitals", count: 234, percentage: 8 },
  { specialty: "Urgent Care", count: 189, percentage: 7 },
  { specialty: "Imaging", count: 312, percentage: 11 },
  { specialty: "Labs", count: 464, percentage: 16 },
];

const quickActions = [
  { label: "Add New Provider", href: "/admin/providers/new", icon: Plus },
  { label: "Expiring Contracts", href: "/admin/contracts/expiring", icon: AlertTriangle, count: 47 },
  { label: "Pending Credentialing", href: "/admin/credentialing", icon: Clock, count: 12 },
  { label: "Network Analytics", href: "/admin/analytics", icon: BarChart3 },
];

export default function AdminDashboard() {
  const { isDark } = useTheme();
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>PPO Network Dashboard</h1>
          <p className={`mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Manage your provider network, contracts, and rates.</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/reports"
            className={`inline-flex items-center gap-2 px-4 py-2 font-medium rounded-lg transition-colors border ${
              isDark 
                ? 'bg-slate-800/50 text-slate-300 hover:bg-slate-800 border-slate-600'
                : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Reports
          </Link>
          <Link
            href="/admin/providers/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 font-medium rounded-lg hover:bg-teal-700 transition-colors"
            style={{ color: 'white' }}
          >
            <Plus className="w-4 h-4" />
            Add Provider
          </Link>
        </div>
      </div>

      {/* Stats Cards - Theme Aware */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-xl p-5 shadow-lg ${
                isDark 
                  ? 'bg-slate-950 border border-slate-800'
                  : 'bg-slate-800 border border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isDark
                    ? 'bg-cyan-500/20 border border-cyan-500/30'
                    : 'bg-white/20 border border-white/30'
                }`}>
                  <Icon className={`w-5 h-5 ${isDark ? 'text-cyan-400' : 'text-white'}`} />
                </div>
                <span 
                  className={`text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 ${
                    stat.trend === "warning" 
                      ? "bg-amber-500/20 text-amber-400"
                      : (isDark ? "bg-cyan-500/20 text-cyan-400" : "bg-white/20 text-white")
                  }`}
                >
                  {stat.trend === "up" && <TrendingUp className="w-3 h-3" />}
                  {stat.trend === "warning" && <AlertTriangle className="w-3 h-3" />}
                  {stat.change}
                </span>
              </div>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-white'}`}>{stat.value}</p>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-cyan-100'}`}>{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              href={action.href}
              className={`rounded-xl p-4 transition-all flex items-center gap-3 shadow-sm ${
                isDark 
                  ? 'bg-slate-800/50 hover:bg-slate-800 border border-slate-700'
                  : 'bg-white hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                isDark 
                  ? 'bg-teal-500/20 border border-teal-500/30'
                  : 'bg-teal-500/10 border border-teal-500/20'
              }`}>
                <Icon className={`w-5 h-5 ${isDark ? 'text-teal-400' : 'text-teal-600'}`} />
              </div>
              <div>
                <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{action.label}</p>
                {action.count && (
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{action.count} pending</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Expiring Contracts */}
        <div className={`lg:col-span-2 rounded-xl p-6 ${
          isDark 
            ? 'bg-slate-800/50 border border-slate-700'
            : 'bg-white border border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-lg font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Contracts Expiring Soon
            </h2>
            <Link href="/admin/contracts/expiring" className="text-sm text-cyan-500 hover:text-cyan-400 flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`text-left text-sm border-b ${isDark ? 'text-slate-400 border-slate-700' : 'text-slate-500 border-slate-200'}`}>
                  <th className="pb-3 font-medium">Provider</th>
                  <th className="pb-3 font-medium">NPI</th>
                  <th className="pb-3 font-medium">Expires</th>
                  <th className="pb-3 font-medium">Discount</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {expiringContracts.map((contract, i) => (
                  <tr key={i} className={`border-b text-sm ${isDark ? 'border-slate-700/50' : 'border-slate-100'}`}>
                    <td className={`py-3 font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{contract.provider}</td>
                    <td className={`py-3 font-mono text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{contract.npi}</td>
                    <td className="py-3 text-amber-500">{contract.expires}</td>
                    <td className="py-3 text-green-500">{contract.discount}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        contract.status === "Renewal Sent" ? "bg-cyan-500/20 text-cyan-500" :
                        contract.status === "Pending Review" ? "bg-amber-500/20 text-amber-500" :
                        "bg-slate-500/20 text-slate-500"
                      }`}>
                        {contract.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className={`rounded-xl p-6 ${
          isDark 
            ? 'bg-slate-800/50 border border-slate-700'
            : 'bg-white border border-slate-200 shadow-sm'
        }`}>
          <h2 className={`text-lg font-semibold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  activity.type === "provider" ? "bg-cyan-500/20" :
                  activity.type === "contract" ? "bg-green-500/20" :
                  activity.type === "discount" ? "bg-amber-500/20" :
                  "bg-teal-500/20"
                }`}>
                  {activity.type === "provider" && <Building2 className="w-4 h-4 text-cyan-500" />}
                  {activity.type === "contract" && <FileSignature className="w-4 h-4 text-green-500" />}
                  {activity.type === "discount" && <DollarSign className="w-4 h-4 text-amber-500" />}
                  {activity.type === "credentialing" && <CheckCircle className="w-4 h-4 text-teal-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{activity.title}</p>
                  <p className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{activity.message}</p>
                </div>
                <span className={`text-xs whitespace-nowrap ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Providers by Specialty */}
      <div className={`rounded-xl p-6 ${
        isDark 
          ? 'bg-slate-800/50 border border-slate-700'
          : 'bg-white border border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Network by Specialty</h2>
          <Link href="/admin/analytics" className="text-sm text-cyan-500 hover:text-cyan-400 flex items-center gap-1">
            Full Analytics <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {providersBySpecialty.map((item) => (
            <div key={item.specialty} className={`rounded-lg p-4 text-center ${
              isDark ? 'bg-slate-700/50' : 'bg-slate-50 border border-slate-100'
            }`}>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.count}</p>
              <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.specialty}</p>
              <div className={`mt-2 h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-600' : 'bg-slate-200'}`}>
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{item.percentage}%</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Credentialing Queue */}
        <div className={`rounded-xl p-6 ${
          isDark 
            ? 'bg-slate-800/50 border border-slate-700'
            : 'bg-white border border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Users className="w-5 h-5 text-teal-500" />
              Credentialing Queue
            </h2>
            <Link href="/admin/credentialing" className="text-sm text-cyan-500 hover:text-cyan-400 flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {/* Queue Stats */}
          <div className="grid grid-cols-4 gap-3 mb-5">
            {[
              { value: "12", label: "New Apps", highlight: false },
              { value: "8", label: "In Review", highlight: false },
              { value: "5", label: "Pending Docs", highlight: false },
              { value: "23", label: "This Week", highlight: true },
            ].map((stat, i) => (
              <div key={i} className={`rounded-lg p-3 text-center ${
                isDark 
                  ? 'bg-slate-700/50 border border-slate-600'
                  : 'bg-slate-50 border border-slate-100'
              }`}>
                <p className={`text-2xl font-bold ${stat.highlight ? 'text-cyan-500' : (isDark ? 'text-white' : 'text-slate-900')}`}>{stat.value}</p>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{stat.label}</p>
              </div>
            ))}
          </div>
          
          {/* Recent Applications */}
          <div className="space-y-3">
            {[
              { name: "Dr. Michael Torres", specialty: "Cardiology", submitted: "2 hours ago", status: "new" },
              { name: "Eastside Family Practice", specialty: "Primary Care", submitted: "5 hours ago", status: "review" },
              { name: "Dr. Jennifer Walsh", specialty: "Orthopedics", submitted: "1 day ago", status: "docs" },
              { name: "Metro Imaging Center", specialty: "Radiology", submitted: "2 days ago", status: "review" },
            ].map((app, i) => (
              <div key={i} className={`flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer ${
                isDark 
                  ? 'bg-slate-700/30 hover:bg-slate-700/50'
                  : 'bg-slate-50 hover:bg-slate-100'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isDark 
                      ? 'bg-slate-600/50 border border-slate-500/50'
                      : 'bg-white border border-slate-200'
                  }`}>
                    <Building2 className="w-5 h-5 text-cyan-500" />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{app.name}</p>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{app.specialty}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    app.status === "new" ? "bg-cyan-500/20 text-cyan-500 border border-cyan-500/30" :
                    "bg-slate-500/20 text-slate-400 border border-slate-400/30"
                  }`}>
                    {app.status === "new" ? "New" : app.status === "review" ? "In Review" : "Pending Docs"}
                  </span>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{app.submitted}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className={`rounded-xl p-6 ${
          isDark 
            ? 'bg-slate-800/50 border border-slate-700'
            : 'bg-white border border-slate-200 shadow-sm'
        }`}>
          <h2 className={`text-lg font-semibold flex items-center gap-2 mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Calendar className="w-5 h-5 text-teal-500" />
            Upcoming Tasks
          </h2>
          <div className="space-y-3">
            {[
              { task: "Review 12 credentialing applications", due: "Today", priority: "high" },
              { task: "Send renewal notices (47 contracts)", due: "This week", priority: "high" },
              { task: "Update fee schedules for Q2", due: "Mar 31", priority: "medium" },
              { task: "Quarterly network report", due: "Apr 1", priority: "medium" },
              { task: "Provider satisfaction survey", due: "Apr 15", priority: "low" },
            ].map((item, i) => (
              <div key={i} className={`flex items-center justify-between p-3 rounded-lg ${
                isDark ? 'bg-slate-700/30' : 'bg-slate-50'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    item.priority === "high" ? "bg-red-500" :
                    item.priority === "medium" ? "bg-amber-500" :
                    "bg-slate-400"
                  }`} />
                  <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{item.task}</span>
                </div>
                <span className={`text-xs ${
                  item.due === "Today" ? "text-red-500" : (isDark ? "text-slate-500" : "text-slate-400")
                }`}>{item.due}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
