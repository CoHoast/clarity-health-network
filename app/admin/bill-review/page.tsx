"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Activity, CheckCircle, DollarSign, Clock, AlertTriangle, Eye, X, FileText, TrendingDown, Search, Filter, RefreshCw } from "lucide-react";

type BillFlag = "high-value" | "specialty-drug" | "out-of-network";

interface BillInReview {
  id: string;
  provider: string;
  service: string;
  original: number;
  repriced: number;
  savings: number;
  status: string;
  date: string;
  member: string;
  flags: BillFlag[];
  confidence: number | null;
}

const billsInReview: BillInReview[] = [
  { id: "BRV-2024-4521", provider: "Cleveland Orthopedic", service: "Knee Surgery (27447)", original: 12500, repriced: 9800, savings: 2700, status: "complete", date: "2024-03-12", member: "Emily Rodriguez", flags: ["high-value"], confidence: 98 },
  { id: "BRV-2024-4520", provider: "Metro Imaging Center", service: "MRI - Lumbar Spine (72148)", original: 1850, repriced: 1200, savings: 650, status: "complete", date: "2024-03-12", member: "Michael Chen", flags: [], confidence: 95 },
  { id: "BRV-2024-4519", provider: "Cleveland Family Medicine", service: "Office Visit (99214)", original: 175, repriced: 125, savings: 50, status: "complete", date: "2024-03-12", member: "John Doe", flags: [], confidence: 99 },
  { id: "BRV-2024-4518", provider: "PharmaCare Specialty", service: "Specialty Rx - Humira", original: 2340, repriced: 2100, savings: 240, status: "review", date: "2024-03-12", member: "Jennifer Lee", flags: ["specialty-drug"], confidence: 87 },
  { id: "BRV-2024-4517", provider: "Unknown Provider", service: "Chiropractic Session (98941)", original: 95, repriced: 0, savings: 95, status: "flagged", date: "2024-03-11", member: "David Kim", flags: ["out-of-network"], confidence: 0 },
  { id: "BRV-2024-4516", provider: "Quest Diagnostics", service: "Lab Work - CBC (85025)", original: 85, repriced: 45, savings: 40, status: "complete", date: "2024-03-11", member: "Lisa Martinez", flags: [], confidence: 99 },
  { id: "BRV-2024-4515", provider: "Westlake Urgent Care", service: "Urgent Care Visit (99203)", original: 225, repriced: 150, savings: 75, status: "processing", date: "2024-03-11", member: "Robert Williams", flags: [], confidence: null },
  { id: "BRV-2024-4514", provider: "Dr. Sarah Chen", service: "Annual Physical (99395)", original: 275, repriced: 225, savings: 50, status: "complete", date: "2024-03-11", member: "Sarah Johnson", flags: [], confidence: 96 },
];

const statusOptions = ["All", "Processing", "Review", "Complete", "Flagged"];

export default function BillReviewPage() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBill, setSelectedBill] = useState<BillInReview | null>(null);

  const filteredBills = billsInReview.filter(bill => {
    const matchesStatus = statusFilter === "All" || bill.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch = bill.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.member.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalSavings = billsInReview.filter(b => b.status === "complete").reduce((sum, b) => sum + b.savings, 0);
  const avgReduction = Math.round((totalSavings / billsInReview.filter(b => b.status === "complete").reduce((sum, b) => sum + b.original, 0)) * 100);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "complete": return <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full flex items-center gap-1"><CheckCircle className="w-3 h-3" />Complete</span>;
      case "processing": return <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full flex items-center gap-1"><RefreshCw className="w-3 h-3 animate-spin" />Processing</span>;
      case "review": return <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full flex items-center gap-1"><Clock className="w-3 h-3" />Review</span>;
      case "flagged": return <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-medium rounded-full flex items-center gap-1"><AlertTriangle className="w-3 h-3" />Flagged</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white"/>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">BillReviewAI</h1>
            <p className="text-slate-400">Automated bill review and repricing engine</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-green-500/20 text-green-400 text-sm font-medium rounded-full flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Engine Active
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-teal-600 to-cyan-600 rounded-xl p-4 shadow-lg">
          <p className="text-2xl font-bold" style={{ color: 'white' }}>1,892</p>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>Bills Reviewed Today</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl p-4 shadow-lg">
          <p className="text-2xl font-bold" style={{ color: 'white' }}>${totalSavings.toLocaleString()}</p>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>Savings Found</p>
        </div>
        <div className="bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl p-4 shadow-lg">
          <p className="text-2xl font-bold" style={{ color: 'white' }}>{avgReduction}%</p>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>Avg Reduction</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-4 shadow-lg">
          <p className="text-2xl font-bold" style={{ color: 'white' }}>34</p>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>Needs Review</p>
        </div>
      </div>

      {/* AI Engine Status Card */}
      <div className="bg-gradient-to-br from-teal-700 to-cyan-700 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6" style={{ color: 'white' }}/>
            <h2 className="text-lg font-semibold" style={{ color: 'white' }}>AI Review Engine Status</h2>
          </div>
          <span className="px-2 py-1 bg-white/20 text-xs rounded-full" style={{ color: 'white' }}>Processing</span>
        </div>
        <p className="mb-4" style={{ color: 'rgba(255,255,255,0.8)' }}>Analyzing bills using 120+ pricing rules and Medicare benchmarks</p>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-2xl font-bold" style={{ color: 'white' }}>98.5%</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.8)' }}>Accuracy</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-2xl font-bold" style={{ color: 'white' }}>&lt;5s</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.8)' }}>Avg Review Time</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-2xl font-bold" style={{ color: 'white' }}>$2.1M</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.8)' }}>YTD Savings</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-2xl font-bold" style={{ color: 'white' }}>47K</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.8)' }}>Bills Processed YTD</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by provider, member, or bill ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === status ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bills Table */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-white">Bill Review Queue</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800 border-b border-slate-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Bill ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Provider</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Member</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase">Original</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase">Repriced</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase">Savings</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-400 uppercase">Confidence</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredBills.map((bill) => (
                <tr key={bill.id} className="hover:bg-slate-800/80 transition-colors">
                  <td className="px-4 py-3">
                    <button 
                      onClick={() => setSelectedBill(bill)}
                      className="font-mono text-sm text-blue-400 hover:text-blue-300"
                    >
                      {bill.id}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-white">{bill.provider}</p>
                      <p className="text-xs text-slate-500">{bill.service}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{bill.member}</td>
                  <td className="px-4 py-3 text-right text-slate-400">${bill.original.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-white font-medium">${bill.repriced.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-green-400 font-medium flex items-center justify-end gap-1">
                      <TrendingDown className="w-3 h-3" />
                      ${bill.savings.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {bill.confidence !== null ? (
                      <span className={`font-medium ${bill.confidence >= 95 ? 'text-green-400' : bill.confidence >= 85 ? 'text-amber-400' : 'text-red-400'}`}>
                        {bill.confidence}%
                      </span>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(bill.status)}</td>
                  <td className="px-4 py-3 text-right">
                    <button 
                      onClick={() => setSelectedBill(bill)}
                      className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/20 rounded"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-slate-700 flex items-center justify-between bg-slate-800">
          <p className="text-sm text-slate-400">Showing {filteredBills.length} of {billsInReview.length} bills</p>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-slate-700 text-slate-300 rounded border border-slate-600 hover:bg-slate-600 text-sm">Previous</button>
            <button className="px-3 py-1.5 bg-slate-700 text-slate-300 rounded border border-slate-600 hover:bg-slate-600 text-sm">Next</button>
          </div>
        </div>
      </div>

      {/* Bill Detail Modal */}
      <AnimatePresence>
        {selectedBill && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedBill(null)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-700">
                <div>
                  <h2 className="text-lg font-semibold text-white">Bill Review Details</h2>
                  <p className="text-sm text-slate-400">{selectedBill.id}</p>
                </div>
                <button onClick={() => setSelectedBill(null)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 space-y-4">
                {/* Savings Summary */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-300">Total Savings Identified</p>
                      <p className="text-3xl font-bold text-green-400">${selectedBill.savings.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-green-300">Reduction</p>
                      <p className="text-2xl font-bold text-green-400">{Math.round((selectedBill.savings / selectedBill.original) * 100)}%</p>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <h3 className="font-medium text-white mb-3 flex items-center gap-2"><FileText className="w-4 h-4 text-blue-400" />Bill Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-slate-400">Provider</span><span className="text-white">{selectedBill.provider}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Service</span><span className="text-white text-xs">{selectedBill.service}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Member</span><span className="text-white">{selectedBill.member}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Date</span><span className="text-white">{selectedBill.date}</span></div>
                    </div>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <h3 className="font-medium text-white mb-3 flex items-center gap-2"><DollarSign className="w-4 h-4 text-amber-400" />Pricing Analysis</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-slate-400">Billed Amount</span><span className="text-white">${selectedBill.original.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Repriced Amount</span><span className="text-green-400 font-medium">${selectedBill.repriced.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Medicare Rate</span><span className="text-white">${Math.round(selectedBill.repriced * 0.8).toLocaleString()}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Our Rate</span><span className="text-white">120% Medicare</span></div>
                    </div>
                  </div>
                </div>

                {/* AI Analysis */}
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="font-medium text-white mb-3 flex items-center gap-2"><Brain className="w-4 h-4 text-cyan-400" />AI Analysis</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Confidence Score</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-slate-600 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${selectedBill.confidence && selectedBill.confidence >= 95 ? 'bg-green-500' : 'bg-amber-500'}`} style={{ width: `${selectedBill.confidence || 0}%` }}></div>
                        </div>
                        <span className={`font-medium ${selectedBill.confidence && selectedBill.confidence >= 95 ? 'text-green-400' : 'text-amber-400'}`}>{selectedBill.confidence || 0}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm mb-2">Rules Applied:</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">Medicare Benchmark</span>
                        <span className="px-2 py-1 bg-cyan-600/20 text-cyan-300 text-xs rounded">Fee Schedule Match</span>
                        <span className="px-2 py-1 bg-teal-500/20 text-teal-300 text-xs rounded">Network Discount</span>
                        {selectedBill.flags.includes("high-value") && <span className="px-2 py-1 bg-amber-500/20 text-amber-300 text-xs rounded">High-Value Review</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 p-4 border-t border-slate-700">
                <button className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Override Price</button>
                <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Approve Repricing</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
