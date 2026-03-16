"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  Users,
  Building2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  ArrowRight,
  Shield,
  Brain,
  BarChart3,
  Zap,
  ChevronRight,
} from "lucide-react";

const stats = [
  { label: "Total Claims", value: "12,847", change: "+12%", trend: "up", icon: FileText, color: "cyan" },
  { label: "Active Members", value: "45,230", change: "+3.2%", trend: "up", icon: Users, color: "blue" },
  { label: "Network Providers", value: "2,847", change: "+24", trend: "up", icon: Building2, color: "teal" },
  { label: "Monthly Volume", value: "$4.2M", change: "+8.5%", trend: "up", icon: DollarSign, color: "green" },
];

const claimsPipeline = [
  { status: "Received", count: 234, color: "bg-slate-400" },
  { status: "Processing", count: 156, color: "bg-blue-500" },
  { status: "Review", count: 89, color: "bg-amber-500" },
  { status: "Approved", count: 612, color: "bg-green-500" },
  { status: "Denied", count: 23, color: "bg-red-500" },
];

const recentAlerts = [
  { type: "fraud", title: "High-Risk Provider Flagged", message: "NPI 1234567890 - unusual billing pattern", time: "12m ago", severity: "high" },
  { type: "compliance", title: "NSA Deadline Approaching", message: "3 claims require NSA disclosure", time: "1h ago", severity: "medium" },
  { type: "system", title: "Batch Processing Complete", message: "847 claims processed successfully", time: "2h ago", severity: "low" },
];

const aiEngineStatus = [
  { name: "FraudShield", status: "Active", scanned: "2,341", flagged: 12, icon: Shield },
  { name: "BillReviewAI", status: "Active", scanned: "1,892", flagged: 34, icon: Brain },
  { name: "EligibilityCheck", status: "Active", scanned: "3,456", flagged: 8, icon: CheckCircle },
];

const quickActions = [
  { label: "Review Pending Claims", href: "/admin/claims?status=pending", icon: FileText, count: 89 },
  { label: "Fraud Alerts", href: "/admin/fraud-shield", icon: Shield, count: 3 },
  { label: "Credentialing Queue", href: "/admin/providers?tab=credentialing", icon: Building2, count: 12 },
  { label: "Generate Reports", href: "/admin/reports", icon: BarChart3 },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-slate-400 mt-1">Welcome back! Here's what's happening today.</p>
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
            href="/admin/claims"
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
          >
            <FileText className="w-4 h-4" />
            Review Claims
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
              className="bg-slate-800/50 rounded-xl border border-slate-700 p-5 "
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  stat.color === "cyan" ? "bg-cyan-500/20" :
                  stat.color === "blue" ? "bg-blue-500/20" :
                  stat.color === "teal" ? "bg-teal-500/20" : "bg-green-500/20"
                }`}>
                  <Icon className={`w-5 h-5 ${
                    stat.color === "cyan" ? "text-cyan-500" :
                    stat.color === "blue" ? "text-blue-400" :
                    stat.color === "teal" ? "text-cyan-600" : "text-green-400"
                  }`} />
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 ${
                  stat.trend === "up" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                }`}>
                  {stat.trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-slate-400">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Claims Pipeline & Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Claims Pipeline */}
        <div className="lg:col-span-2 bg-slate-800/50 rounded-xl border border-slate-700 p-6 ">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Claims Pipeline</h2>
            <Link href="/admin/claims" className="text-sm text-cyan-500 hover:text-cyan-500 flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {claimsPipeline.map((stage) => (
              <div key={stage.status} className="flex items-center gap-4">
                <span className="w-24 text-sm text-slate-400">{stage.status}</span>
                <div className="flex-1 h-8 bg-slate-700 rounded-lg overflow-hidden">
                  <div
                    className={`h-full ${stage.color} rounded-lg flex items-center justify-end pr-3 transition-all`}
                    style={{ width: `${Math.min((stage.count / 700) * 100, 100)}%` }}
                  >
                    <span className="text-white text-sm font-medium">{stage.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400">
              <Activity className="w-4 h-4" />
              <span className="text-sm">Total: 1,114 claims today</span>
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">92% auto-adjudicated</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 ">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center justify-between p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-800/50 rounded-lg flex items-center justify-center  group-hover:bg-teal-600 transition-colors">
                      <Icon className="w-4 h-4 text-slate-400 group-hover:text-white" />
                    </div>
                    <span className="text-sm font-medium text-slate-300">{action.label}</span>
                  </div>
                  {action.count && (
                    <span className="px-2 py-1 bg-cyan-600/20 text-cyan-500 text-xs font-medium rounded-full">
                      {action.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* AI Engines & Alerts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* AI Engine Status */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 ">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyan-500" />
              <h2 className="text-lg font-semibold text-white">AI Engines</h2>
            </div>
            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
              All Systems Active
            </span>
          </div>
          <div className="space-y-4">
            {aiEngineStatus.map((engine) => {
              const Icon = engine.icon;
              return (
                <div key={engine.name} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cyan-600/20 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-cyan-500" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{engine.name}</p>
                      <p className="text-xs text-slate-400">{engine.scanned} scanned today</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-amber-400 font-medium">{engine.flagged}</p>
                    <p className="text-xs text-slate-400">Flagged</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 ">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Recent Alerts</h2>
            <Link href="/admin/compliance" className="text-sm text-cyan-500 hover:text-cyan-500">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentAlerts.map((alert, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-slate-800 rounded-lg">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  alert.severity === "high" ? "bg-red-500/20" :
                  alert.severity === "medium" ? "bg-amber-500/20" : "bg-blue-500/20"
                }`}>
                  <AlertTriangle className={`w-4 h-4 ${
                    alert.severity === "high" ? "text-red-600" :
                    alert.severity === "medium" ? "text-amber-400" : "text-blue-400"
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm">{alert.title}</p>
                  <p className="text-xs text-slate-400 truncate">{alert.message}</p>
                </div>
                <span className="text-xs text-slate-500 flex-shrink-0">{alert.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Network Health */}
      <div className="bg-gradient-to-br from-cyan-500 to-teal-600 rounded-2xl p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-white" />
              <h3 className="text-lg font-semibold text-white">Network Health Score</h3>
            </div>
            <p className="text-white/80 text-sm mb-4">
              Your PPO network is performing well across all metrics.
            </p>
            <div className="flex items-center gap-6">
              <div>
                <p className="text-4xl font-bold text-white">94<span className="text-xl text-white/70">/100</span></p>
                <p className="text-sm text-white/80">Overall Score</p>
              </div>
              <div className="h-16 w-px bg-white/30" />
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-lg font-semibold text-white">98%</p>
                  <p className="text-xs text-white/80">Claim Accuracy</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">2.1 days</p>
                  <p className="text-xs text-white/80">Avg Process Time</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">99.2%</p>
                  <p className="text-xs text-white/80">Uptime</p>
                </div>
              </div>
            </div>
          </div>
          <Link
            href="/admin/reports"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-colors shrink-0"
          >
            <BarChart3 className="w-5 h-5" />
            View Full Report
          </Link>
        </div>
      </div>
    </div>
  );
}
