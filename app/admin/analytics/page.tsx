"use client";

import { useState } from "react";
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Users, FileText, Activity, Download, Calendar } from "lucide-react";

const kpis = [
  { label: "Total Claims MTD", value: "$2.4M", change: "+12%", trend: "up", color: "text-green-400" },
  { label: "Avg Processing Time", value: "2.3 days", change: "-18%", trend: "down", color: "text-green-400" },
  { label: "Denial Rate", value: "4.2%", change: "-0.8%", trend: "down", color: "text-green-400" },
  { label: "Clean Claim Rate", value: "94.5%", change: "+2.1%", trend: "up", color: "text-green-400" },
  { label: "Active Members", value: "12,847", change: "+156", trend: "up", color: "text-blue-400" },
  { label: "Network Providers", value: "2,891", change: "+23", trend: "up", color: "text-purple-400" },
];

const monthlyData = [
  { month: "Oct", claims: 1850000, members: 12100 },
  { month: "Nov", claims: 2100000, members: 12350 },
  { month: "Dec", claims: 2450000, members: 12500 },
  { month: "Jan", claims: 2200000, members: 12650 },
  { month: "Feb", claims: 2150000, members: 12750 },
  { month: "Mar", claims: 2400000, members: 12847 },
];

const topProviders = [
  { name: "Cleveland Family Medicine", claims: 423, amount: "$156,230" },
  { name: "Metro Hospital", claims: 287, amount: "$892,450" },
  { name: "Westlake Urgent Care", claims: 512, amount: "$98,750" },
  { name: "Cleveland Orthopedic", claims: 156, amount: "$445,200" },
  { name: "Metro Imaging Center", claims: 345, amount: "$234,100" },
];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("This Month");
  const maxClaims = Math.max(...monthlyData.map(d => d.claims));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
            <p className="text-slate-400">Executive summary and KPIs</p>
          </div>
        </div>
        <div className="flex gap-3">
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Quarter</option>
            <option>This Year</option>
          </select>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 border border-slate-600">
            <Download className="w-4 h-4" />Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
            <p className="text-sm text-slate-400 mb-1">{kpi.label}</p>
            <p className="text-2xl font-bold text-white">{kpi.value}</p>
            <p className={`text-sm flex items-center gap-1 mt-1 ${kpi.color}`}>
              {kpi.trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {kpi.change}
            </p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Claims Trend Chart */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Claims Volume Trend</h2>
          <div className="flex items-end justify-between h-48 gap-2">
            {monthlyData.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t"
                  style={{ height: `${(d.claims / maxClaims) * 180}px` }}
                />
                <p className="text-xs text-slate-500 mt-2">{d.month}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Providers */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700">
            <h2 className="text-lg font-semibold text-white">Top Providers by Volume</h2>
          </div>
          <div className="divide-y divide-slate-700">
            {topProviders.map((provider, i) => (
              <div key={provider.name} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center text-xs font-medium">{i + 1}</span>
                  <div>
                    <p className="font-medium text-white">{provider.name}</p>
                    <p className="text-sm text-slate-400">{provider.claims} claims</p>
                  </div>
                </div>
                <p className="font-bold text-white">{provider.amount}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl p-5 text-white">
          <DollarSign className="w-8 h-8 text-green-200 mb-3" />
          <p className="text-3xl font-bold">$18.2M</p>
          <p className="text-green-100">YTD Paid Claims</p>
        </div>
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-5 text-white">
          <Users className="w-8 h-8 text-blue-200 mb-3" />
          <p className="text-3xl font-bold">98.2%</p>
          <p className="text-blue-100">Member Retention</p>
        </div>
        <div className="bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl p-5 text-white">
          <FileText className="w-8 h-8 text-purple-200 mb-3" />
          <p className="text-3xl font-bold">47,234</p>
          <p className="text-purple-100">Claims Processed</p>
        </div>
        <div className="bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl p-5 text-white">
          <Activity className="w-8 h-8 text-amber-200 mb-3" />
          <p className="text-3xl font-bold">99.9%</p>
          <p className="text-amber-100">System Uptime</p>
        </div>
      </div>
    </div>
  );
}
