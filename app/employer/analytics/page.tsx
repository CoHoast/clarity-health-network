"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, TrendingDown, DollarSign, Users, FileText, Activity, Download,
  X, Check, Filter, Calendar, ChevronRight, Info
} from "lucide-react";

const monthlyData = [
  { month: "Oct", spend: 118000, claims: 423 },
  { month: "Nov", spend: 125000, claims: 456 },
  { month: "Dec", spend: 142000, claims: 512 },
  { month: "Jan", spend: 128000, claims: 478 },
  { month: "Feb", spend: 119000, claims: 445 },
  { month: "Mar", spend: 125430, claims: 533 },
];

const claimsByCategory = [
  { category: "Outpatient", amount: 245000, percentage: 35, color: "bg-amber-500", claims: 987, avgClaim: 248 },
  { category: "Inpatient", amount: 189000, percentage: 27, color: "bg-orange-500", claims: 42, avgClaim: 4500 },
  { category: "Pharmacy", amount: 147000, percentage: 21, color: "bg-yellow-500", claims: 1245, avgClaim: 118 },
  { category: "Preventive", amount: 70000, percentage: 10, color: "bg-green-500", claims: 423, avgClaim: 165 },
  { category: "Other", amount: 49000, percentage: 7, color: "bg-gray-400", claims: 150, avgClaim: 327 },
];

const topConditions = [
  { condition: "Musculoskeletal", claims: 156, spend: "$187,230", trend: "up", change: "+5%" },
  { condition: "Cardiovascular", claims: 89, spend: "$142,500", trend: "down", change: "-3%" },
  { condition: "Mental Health", claims: 134, spend: "$98,750", trend: "up", change: "+12%" },
  { condition: "Respiratory", claims: 78, spend: "$67,890", trend: "down", change: "-8%" },
  { condition: "Diabetes", claims: 45, spend: "$54,320", trend: "up", change: "+2%" },
];

export default function AnalyticsPage() {
  const maxSpend = Math.max(...monthlyData.map(d => d.spend));
  const [selectedMonth, setSelectedMonth] = useState<typeof monthlyData[0] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<typeof claimsByCategory[0] | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<typeof topConditions[0] | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showKPIModal, setShowKPIModal] = useState<string | null>(null);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [dateRange, setDateRange] = useState("Last 6 Months");

  const handleExport = () => {
    setExportSuccess(true);
    setTimeout(() => {
      setShowExportModal(false);
      setExportSuccess(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Claims Analytics</h1>
          <p className="text-gray-500">Healthcare spending trends and utilization insights</p>
        </div>
        <div className="flex gap-3">
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-orange-500"
          >
            <option>Last 6 Months</option>
            <option>Last 12 Months</option>
            <option>Year to Date</option>
            <option>Last Year</option>
          </select>
          <button 
            onClick={() => setShowExportModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 border border-gray-300"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button 
          onClick={() => setShowKPIModal("spend")}
          className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm text-left hover:border-orange-300 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-orange-600" />
            </div>
            <span className="flex items-center text-sm font-medium text-green-600">
              -3.2% <TrendingDown className="w-4 h-4 ml-1" />
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">$1.24M</p>
          <p className="text-sm text-gray-500">YTD Spend</p>
        </button>
        <button 
          onClick={() => setShowKPIModal("claims")}
          className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm text-left hover:border-orange-300 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <span className="flex items-center text-sm font-medium text-red-600">
              +8% <TrendingUp className="w-4 h-4 ml-1" />
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">2,847</p>
          <p className="text-sm text-gray-500">Total Claims</p>
        </button>
        <button 
          onClick={() => setShowKPIModal("pmpm")}
          className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm text-left hover:border-orange-300 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">$1,465</p>
          <p className="text-sm text-gray-500">Per Member Per Month</p>
        </button>
        <button 
          onClick={() => setShowKPIModal("loss")}
          className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm text-left hover:border-orange-300 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">78%</p>
          <p className="text-sm text-gray-500">Loss Ratio</p>
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Spend Trend */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Monthly Spend Trend</h2>
          </div>
          <div className="p-4">
            <div className="flex items-end justify-between h-48 gap-2">
              {monthlyData.map((d) => (
                <button
                  key={d.month}
                  onClick={() => setSelectedMonth(d)}
                  className="flex-1 flex flex-col items-center group"
                >
                  <div className="relative w-full">
                    <div 
                      className="w-full bg-gradient-to-t from-orange-500 to-amber-400 rounded-t group-hover:from-orange-600 group-hover:to-amber-500 transition-colors cursor-pointer"
                      style={{ height: `${(d.spend / maxSpend) * 180}px` }}
                    />
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      ${(d.spend / 1000).toFixed(0)}K
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{d.month}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Claims by Category */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Claims by Category</h2>
          </div>
          <div className="p-4 space-y-4">
            {claimsByCategory.map((cat) => (
              <button
                key={cat.category}
                onClick={() => setSelectedCategory(cat)}
                className="w-full text-left hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{cat.category}</span>
                  <span className="text-sm text-gray-500">${(cat.amount / 1000).toFixed(0)}K ({cat.percentage}%)</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.percentage}%` }} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top Conditions */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Top Conditions by Spend</h2>
          <button className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Condition</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Claims</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Total Spend</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Trend</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">% of Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {topConditions.map((cond, i) => (
                <tr 
                  key={cond.condition} 
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedCondition(cond)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-medium">{i + 1}</span>
                      <span className="font-medium text-gray-900">{cond.condition}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-700">{cond.claims}</td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">{cond.spend}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`inline-flex items-center text-sm font-medium ${cond.trend === "up" ? "text-red-600" : "text-green-600"}`}>
                      {cond.change}
                      {cond.trend === "up" ? <TrendingUp className="w-3 h-3 ml-1" /> : <TrendingDown className="w-3 h-3 ml-1" />}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-500">{((parseInt(cond.spend.replace(/[$,]/g, '')) / 1240000) * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Benchmarks */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="font-semibold text-gray-900">Industry Benchmarks</h2>
          <button className="text-gray-400 hover:text-gray-600">
            <Info className="w-4 h-4" />
          </button>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <p className="text-3xl font-bold text-green-600">-12%</p>
            <p className="text-sm text-gray-600 mt-1">vs. Industry Average</p>
            <p className="text-xs text-gray-400">Per Member Per Month</p>
          </div>
          <div className="text-center p-4 bg-amber-50 rounded-xl">
            <p className="text-3xl font-bold text-amber-600">+5%</p>
            <p className="text-sm text-gray-600 mt-1">Preventive Care Usage</p>
            <p className="text-xs text-gray-400">vs. Similar Employers</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <p className="text-3xl font-bold text-blue-600">-8%</p>
            <p className="text-sm text-gray-600 mt-1">ER Utilization</p>
            <p className="text-xs text-gray-400">vs. Last Year</p>
          </div>
        </div>
      </div>

      {/* Month Detail Modal */}
      <AnimatePresence>
        {selectedMonth && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedMonth(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{selectedMonth.month} 2026 Details</h3>
                <button onClick={() => setSelectedMonth(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="text-center py-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl text-white">
                  <p className="text-3xl font-bold">${selectedMonth.spend.toLocaleString()}</p>
                  <p className="text-orange-100">Total Spend</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-gray-900">{selectedMonth.claims}</p>
                    <p className="text-sm text-gray-500">Claims</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-gray-900">${Math.round(selectedMonth.spend / selectedMonth.claims)}</p>
                    <p className="text-sm text-gray-500">Avg Claim</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-2">Spend Breakdown</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Medical</span>
                      <span className="font-medium text-gray-900">${Math.round(selectedMonth.spend * 0.70).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Pharmacy</span>
                      <span className="font-medium text-gray-900">${Math.round(selectedMonth.spend * 0.21).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Other</span>
                      <span className="font-medium text-gray-900">${Math.round(selectedMonth.spend * 0.09).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
                <button 
                  onClick={() => setSelectedMonth(null)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export Month
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Detail Modal */}
      <AnimatePresence>
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedCategory(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{selectedCategory.category} Claims</h3>
                <button onClick={() => setSelectedCategory(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-gray-900">${(selectedCategory.amount / 1000).toFixed(0)}K</p>
                    <p className="text-sm text-gray-500">Total Spend</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-gray-900">{selectedCategory.claims}</p>
                    <p className="text-sm text-gray-500">Claims</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Average Claim</span>
                    <span className="text-xl font-bold text-gray-900">${selectedCategory.avgClaim}</span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">% of Total Spend</span>
                    <span className="text-xl font-bold text-orange-600">{selectedCategory.percentage}%</span>
                  </div>
                  <div className="mt-2 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full ${selectedCategory.color} rounded-full`} style={{ width: `${selectedCategory.percentage}%` }} />
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium">
                  View Claims
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Condition Detail Modal */}
      <AnimatePresence>
        {selectedCondition && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedCondition(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{selectedCondition.condition}</h3>
                <button onClick={() => setSelectedCondition(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-gray-900">{selectedCondition.spend}</p>
                    <p className="text-sm text-gray-500">Total Spend</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-gray-900">{selectedCondition.claims}</p>
                    <p className="text-sm text-gray-500">Claims</p>
                  </div>
                </div>
                <div className={`${selectedCondition.trend === "up" ? "bg-red-50" : "bg-green-50"} rounded-xl p-4`}>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Trend vs Last Period</span>
                    <span className={`text-xl font-bold flex items-center ${selectedCondition.trend === "up" ? "text-red-600" : "text-green-600"}`}>
                      {selectedCondition.change}
                      {selectedCondition.trend === "up" ? <TrendingUp className="w-5 h-5 ml-1" /> : <TrendingDown className="w-5 h-5 ml-1" />}
                    </span>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Tip:</strong> {selectedCondition.trend === "up" 
                      ? "Consider wellness programs targeting this condition to reduce costs."
                      : "Great progress! Continue current wellness initiatives."}
                  </p>
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
                <button 
                  onClick={() => setSelectedCondition(null)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium">
                  View Claims
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Export Modal */}
      <AnimatePresence>
        {showExportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowExportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full"
            >
              {exportSuccess ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Export Complete!</h3>
                  <p className="text-gray-500">Your analytics report has been downloaded.</p>
                </div>
              ) : (
                <>
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Export Analytics</h3>
                    <button onClick={() => setShowExportModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                        <option>Full Analytics Report</option>
                        <option>Claims Summary</option>
                        <option>Spend Trend</option>
                        <option>Condition Analysis</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                        <option>{dateRange}</option>
                        <option>Custom Range</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                          <input type="radio" name="format" value="pdf" defaultChecked className="text-orange-600 focus:ring-orange-500" />
                          <span className="text-sm text-gray-700">PDF</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="radio" name="format" value="excel" className="text-orange-600 focus:ring-orange-500" />
                          <span className="text-sm text-gray-700">Excel</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="radio" name="format" value="csv" className="text-orange-600 focus:ring-orange-500" />
                          <span className="text-sm text-gray-700">CSV</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
                    <button 
                      onClick={() => setShowExportModal(false)}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleExport}
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KPI Detail Modal */}
      <AnimatePresence>
        {showKPIModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowKPIModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {showKPIModal === "spend" && "YTD Spend Details"}
                  {showKPIModal === "claims" && "Claims Details"}
                  {showKPIModal === "pmpm" && "Per Member Per Month"}
                  {showKPIModal === "loss" && "Loss Ratio"}
                </h3>
                <button onClick={() => setShowKPIModal(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                {showKPIModal === "spend" && (
                  <>
                    <div className="text-center py-4 bg-orange-50 rounded-xl">
                      <p className="text-4xl font-bold text-gray-900">$1.24M</p>
                      <p className="text-green-600 font-medium">-3.2% vs last year</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Q1 Spend</span>
                        <span className="text-gray-900 font-medium">$372,430</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Projected Annual</span>
                        <span className="text-gray-900 font-medium">$1.49M</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Budget</span>
                        <span className="text-gray-900 font-medium">$1.6M</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Under Budget</span>
                        <span className="text-green-600 font-medium">$110K</span>
                      </div>
                    </div>
                  </>
                )}
                {showKPIModal === "claims" && (
                  <>
                    <div className="text-center py-4 bg-blue-50 rounded-xl">
                      <p className="text-4xl font-bold text-gray-900">2,847</p>
                      <p className="text-red-600 font-medium">+8% vs last period</p>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-green-50 rounded-xl p-3 text-center">
                        <p className="text-lg font-bold text-green-600">2,456</p>
                        <p className="text-xs text-gray-500">Approved</p>
                      </div>
                      <div className="bg-amber-50 rounded-xl p-3 text-center">
                        <p className="text-lg font-bold text-amber-600">245</p>
                        <p className="text-xs text-gray-500">Pending</p>
                      </div>
                      <div className="bg-red-50 rounded-xl p-3 text-center">
                        <p className="text-lg font-bold text-red-600">146</p>
                        <p className="text-xs text-gray-500">Denied</p>
                      </div>
                    </div>
                  </>
                )}
                {showKPIModal === "pmpm" && (
                  <>
                    <div className="text-center py-4 bg-green-50 rounded-xl">
                      <p className="text-4xl font-bold text-gray-900">$1,465</p>
                      <p className="text-gray-500">per member per month</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-500 mb-2">Industry Comparison</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full w-[75%] bg-green-500 rounded-full" />
                          </div>
                        </div>
                        <span className="text-sm font-medium text-green-600">Better than 75% of employers</span>
                      </div>
                    </div>
                  </>
                )}
                {showKPIModal === "loss" && (
                  <>
                    <div className="text-center py-4 bg-purple-50 rounded-xl">
                      <p className="text-4xl font-bold text-gray-900">78%</p>
                      <p className="text-gray-500">loss ratio</p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <p className="text-sm text-blue-800">
                        <strong>What this means:</strong> For every $100 in premiums, $78 goes to claims. A healthy target is 75-85%.
                      </p>
                    </div>
                  </>
                )}
              </div>
              <div className="p-6 border-t border-gray-100 flex justify-end">
                <button 
                  onClick={() => setShowKPIModal(null)}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
