"use client";

import { useTheme } from "@/components/admin/ThemeContext";
import { cn } from "@/lib/utils";

import { useState } from "react";
import { DollarSign, TrendingUp, TrendingDown, Download, Calendar, CreditCard, FileText, PieChart } from "lucide-react";

const revenueData = [
  { month: "Oct", revenue: 892000, expenses: 756000 },
  { month: "Nov", revenue: 945000, expenses: 801000 },
  { month: "Dec", revenue: 1020000, expenses: 867000 },
  { month: "Jan", revenue: 978000, expenses: 834000 },
  { month: "Feb", revenue: 956000, expenses: 812000 },
  { month: "Mar", revenue: 1045000, expenses: 889000 },
];

const arAging = [
  { bucket: "0-30 days", amount: 456000, percentage: 45 },
  { bucket: "31-60 days", amount: 234000, percentage: 23 },
  { bucket: "61-90 days", amount: 156000, percentage: 15 },
  { bucket: "90+ days", amount: 172000, percentage: 17 },
];

const recentTransactions = [
  { id: "TXN-001", type: "Premium", payer: "Acme Corp", amount: 142850, date: "2024-03-12" },
  { id: "TXN-002", type: "Claim Payment", payee: "Metro Hospital", amount: -45230, date: "2024-03-12" },
  { id: "TXN-003", type: "Premium", payer: "Tech Solutions", amount: 89500, date: "2024-03-11" },
  { id: "TXN-004", type: "Claim Payment", payee: "Cleveland Family Medicine", amount: -23450, date: "2024-03-11" },
  { id: "TXN-005", type: "Admin Fee", payer: "Various", amount: 12500, date: "2024-03-10" },
];

export default function FinancialPage() {
  const { isDark } = useTheme();
  const [period, setPeriod] = useState("This Month");
  const totalRevenue = revenueData.reduce((sum, d) => sum + d.revenue, 0);
  const totalExpenses = revenueData.reduce((sum, d) => sum + d.expenses, 0);
  const netIncome = totalRevenue - totalExpenses;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Financial Reporting</h1>
            <p className="text-slate-400">Revenue, expenses, and AR aging</p>
          </div>
        </div>
        <div className="flex gap-3">
          <select value={period} onChange={(e) => setPeriod(e.target.value)} className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
            <option>This Month</option>
            <option>This Quarter</option>
            <option>This Year</option>
          </select>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 border border-slate-600">
            <Download className="w-4 h-4" />Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl p-5 shadow-lg">
          <p className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.8)' }}>Total Revenue YTD</p>
          <p className="text-3xl font-bold" style={{ color: 'white' }}>${(totalRevenue / 1000000).toFixed(2)}M</p>
          <p className="text-sm flex items-center gap-1 mt-1" style={{ color: 'rgba(255,255,255,0.8)' }}><TrendingUp className="w-3 h-3" />+8.5%</p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-xl p-5 shadow-lg">
          <p className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.8)' }}>Total Expenses YTD</p>
          <p className="text-3xl font-bold" style={{ color: 'white' }}>${(totalExpenses / 1000000).toFixed(2)}M</p>
          <p className="text-sm flex items-center gap-1 mt-1" style={{ color: 'rgba(255,255,255,0.8)' }}><TrendingUp className="w-3 h-3" />+5.2%</p>
        </div>
        <div className="bg-gradient-to-br from-teal-600 to-blue-600 rounded-xl p-5 shadow-lg">
          <p className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.8)' }}>Net Income YTD</p>
          <p className="text-3xl font-bold" style={{ color: 'white' }}>${(netIncome / 1000000).toFixed(2)}M</p>
          <p className="text-sm flex items-center gap-1 mt-1" style={{ color: 'rgba(255,255,255,0.8)' }}><TrendingUp className="w-3 h-3" />+15.3%</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-teal-600 rounded-xl p-5 shadow-lg">
          <p className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.8)' }}>Loss Ratio</p>
          <p className="text-3xl font-bold" style={{ color: 'white' }}>78.2%</p>
          <p className="text-sm flex items-center gap-1 mt-1" style={{ color: 'rgba(255,255,255,0.8)' }}><TrendingDown className="w-3 h-3" />-2.1%</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* AR Aging */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Accounts Receivable Aging</h2>
          <div className="space-y-4">
            {arAging.map((bucket) => (
              <div key={bucket.bucket}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-300">{bucket.bucket}</span>
                  <span className="text-sm text-white font-medium">${(bucket.amount / 1000).toFixed(0)}K ({bucket.percentage}%)</span>
                </div>
                <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${bucket.bucket.includes("90") ? "bg-red-500" : bucket.bucket.includes("61") ? "bg-amber-500" : "bg-green-500"}`}
                    style={{ width: `${bucket.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between">
            <span className="text-slate-400">Total Outstanding</span>
            <span className="text-xl font-bold text-white">$1,018,000</span>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700">
            <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>
          </div>
          <div className="divide-y divide-slate-700">
            {recentTransactions.map((txn) => (
              <div key={txn.id} className="px-6 py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">{txn.payer || txn.payee}</p>
                  <p className="text-sm text-slate-400">{txn.type}</p>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${txn.amount > 0 ? "text-green-400" : "text-red-400"}`}>
                    {txn.amount > 0 ? "+" : ""}{txn.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500">{txn.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly P&L */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-white">Monthly P&L Summary</h2>
        </div>
        <table className="w-full">
          <thead className="bg-slate-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs text-slate-400 uppercase">Month</th>
              <th className="px-6 py-3 text-right text-xs text-slate-400 uppercase">Revenue</th>
              <th className="px-6 py-3 text-right text-xs text-slate-400 uppercase">Expenses</th>
              <th className="px-6 py-3 text-right text-xs text-slate-400 uppercase">Net Income</th>
              <th className="px-6 py-3 text-right text-xs text-slate-400 uppercase">Margin</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {revenueData.map((d) => (
              <tr key={d.month} className="hover:bg-slate-800/80">
                <td className="px-6 py-3 text-white">{d.month} 2024</td>
                <td className="px-6 py-3 text-right text-green-400">${(d.revenue / 1000).toFixed(0)}K</td>
                <td className="px-6 py-3 text-right text-red-400">${(d.expenses / 1000).toFixed(0)}K</td>
                <td className="px-6 py-3 text-right text-white font-medium">${((d.revenue - d.expenses) / 1000).toFixed(0)}K</td>
                <td className="px-6 py-3 text-right text-slate-300">{(((d.revenue - d.expenses) / d.revenue) * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
