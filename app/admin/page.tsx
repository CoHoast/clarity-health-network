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
  MapPin,
  Calendar,
  Plus,
} from "lucide-react";

const stats = [
  { label: "Total Providers", value: "2,847", change: "+24 this month", trend: "up", icon: Building2, gradient: "from-cyan-600 to-teal-600" },
  { label: "Active Contracts", value: "2,634", change: "93% of network", trend: "up", icon: FileSignature, gradient: "from-green-500 to-emerald-600" },
  { label: "Expiring Soon", value: "47", change: "Next 30 days", trend: "warning", icon: AlertTriangle, gradient: "from-amber-500 to-orange-500" },
  { label: "Avg. Discount", value: "34%", change: "+2.1% vs last year", trend: "up", icon: DollarSign, gradient: "from-teal-500 to-green-500" },
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
  { label: "Add New Provider", href: "/admin/providers/new", icon: Plus, color: "bg-teal-600 hover:bg-teal-700" },
  { label: "Expiring Contracts", href: "/admin/contracts/expiring", icon: AlertTriangle, count: 47, color: "bg-amber-600 hover:bg-amber-700" },
  { label: "Pending Credentialing", href: "/admin/credentialing", icon: Clock, count: 12, color: "bg-slate-600 hover:bg-slate-700" },
  { label: "Network Analytics", href: "/admin/analytics", icon: BarChart3, color: "bg-slate-600 hover:bg-slate-700" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">PPO Network Dashboard</h1>
          <p className="text-slate-400 mt-1">Manage your provider network, contracts, and rates.</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/reports"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 text-slate-300 font-medium rounded-lg hover:bg-slate-800 transition-colors border border-slate-600"
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

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`bg-gradient-to-br ${stat.gradient} rounded-xl p-5 shadow-lg`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/20">
                  <Icon className="w-5 h-5" style={{ color: 'white' }} />
                </div>
                <span 
                  className="text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 bg-white/20"
                  style={{ color: 'white' }}
                >
                  {stat.trend === "up" && <TrendingUp className="w-3 h-3" />}
                  {stat.trend === "warning" && <AlertTriangle className="w-3 h-3" />}
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold" style={{ color: 'white' }}>{stat.value}</p>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>{stat.label}</p>
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
              className={`${action.color} rounded-xl p-4 transition-colors flex items-center gap-3`}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/20">
                <Icon className="w-5 h-5" style={{ color: 'white' }} />
              </div>
              <div>
                <p className="font-medium" style={{ color: 'white' }}>{action.label}</p>
                {action.count && (
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{action.count} pending</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Expiring Contracts */}
        <div className="lg:col-span-2 bg-slate-800/50 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Contracts Expiring Soon
            </h2>
            <Link href="/admin/contracts/expiring" className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-slate-400 border-b border-slate-700">
                  <th className="pb-3 font-medium">Provider</th>
                  <th className="pb-3 font-medium">NPI</th>
                  <th className="pb-3 font-medium">Expires</th>
                  <th className="pb-3 font-medium">Discount</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {expiringContracts.map((contract, i) => (
                  <tr key={i} className="border-b border-slate-700/50 text-sm">
                    <td className="py-3 text-white font-medium">{contract.provider}</td>
                    <td className="py-3 text-slate-400 font-mono text-xs">{contract.npi}</td>
                    <td className="py-3 text-amber-400">{contract.expires}</td>
                    <td className="py-3 text-green-400">{contract.discount}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        contract.status === "Renewal Sent" ? "bg-cyan-500/20 text-cyan-400" :
                        contract.status === "Pending Review" ? "bg-amber-500/20 text-amber-400" :
                        "bg-slate-500/20 text-slate-400"
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
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  activity.type === "provider" ? "bg-cyan-500/20" :
                  activity.type === "contract" ? "bg-green-500/20" :
                  activity.type === "discount" ? "bg-amber-500/20" :
                  "bg-teal-500/20"
                }`}>
                  {activity.type === "provider" && <Building2 className="w-4 h-4 text-cyan-400" />}
                  {activity.type === "contract" && <FileSignature className="w-4 h-4 text-green-400" />}
                  {activity.type === "discount" && <DollarSign className="w-4 h-4 text-amber-400" />}
                  {activity.type === "credentialing" && <CheckCircle className="w-4 h-4 text-teal-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{activity.title}</p>
                  <p className="text-xs text-slate-400 truncate">{activity.message}</p>
                </div>
                <span className="text-xs text-slate-500 whitespace-nowrap">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Providers by Specialty */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Network by Specialty</h2>
          <Link href="/admin/analytics" className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
            Full Analytics <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {providersBySpecialty.map((item) => (
            <div key={item.specialty} className="bg-slate-700/50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-white">{item.count}</p>
              <p className="text-sm text-slate-400 mt-1">{item.specialty}</p>
              <div className="mt-2 h-1.5 bg-slate-600 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">{item.percentage}%</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Network Coverage Map */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-teal-400" />
              Network Coverage - Ohio
            </h2>
            <Link href="/admin/network-map" className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
              Full Map <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="relative h-64 bg-slate-900/50 rounded-lg overflow-hidden">
            {/* Simple Ohio Map SVG */}
            <svg viewBox="0 0 400 350" className="w-full h-full">
              {/* Ohio state outline */}
              <path
                d="M50,50 L350,30 L370,120 L360,180 L340,220 L280,280 L200,320 L120,300 L60,250 L40,180 L50,100 Z"
                fill="#1e293b"
                stroke="#334155"
                strokeWidth="2"
              />
              {/* Region highlights */}
              <ellipse cx="280" cy="100" rx="50" ry="40" fill="#0d9488" fillOpacity="0.3" />
              <ellipse cx="180" cy="180" rx="60" ry="50" fill="#0d9488" fillOpacity="0.2" />
              <ellipse cx="120" cy="260" rx="40" ry="30" fill="#0d9488" fillOpacity="0.15" />
              
              {/* Provider location pins */}
              {[
                { x: 290, y: 90, count: 892, city: "Cleveland" },
                { x: 250, y: 110, count: 234, city: "Akron" },
                { x: 200, y: 150, count: 156, city: "Columbus" },
                { x: 130, y: 180, count: 89, city: "Dayton" },
                { x: 100, y: 250, count: 67, city: "Cincinnati" },
                { x: 320, y: 140, count: 45, city: "Youngstown" },
                { x: 80, y: 120, count: 112, city: "Toledo" },
              ].map((loc, i) => (
                <g key={i} className="cursor-pointer hover:opacity-80 transition-opacity">
                  <circle cx={loc.x} cy={loc.y} r={Math.min(20, 8 + loc.count / 50)} fill="#0d9488" fillOpacity="0.8" />
                  <circle cx={loc.x} cy={loc.y} r={4} fill="#2dd4bf" />
                  <text x={loc.x} y={loc.y + 30} textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="500">
                    {loc.city}
                  </text>
                </g>
              ))}
            </svg>
            
            {/* Legend */}
            <div className="absolute bottom-3 left-3 bg-slate-800/90 rounded-lg p-2 text-xs">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-teal-500"></div>
                <span className="text-slate-300">Provider Concentration</span>
              </div>
              <div className="text-slate-400">Circle size = provider count</div>
            </div>
            
            {/* Stats overlay */}
            <div className="absolute top-3 right-3 bg-slate-800/90 rounded-lg p-3 text-right">
              <p className="text-2xl font-bold text-white">2,847</p>
              <p className="text-xs text-slate-400">Total Providers</p>
              <p className="text-xs text-teal-400 mt-1">7 major metro areas</p>
            </div>
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-teal-400" />
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
              <div key={i} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    item.priority === "high" ? "bg-red-500" :
                    item.priority === "medium" ? "bg-amber-500" :
                    "bg-slate-400"
                  }`} />
                  <span className="text-sm text-slate-300">{item.task}</span>
                </div>
                <span className={`text-xs ${
                  item.due === "Today" ? "text-red-400" : "text-slate-500"
                }`}>{item.due}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
