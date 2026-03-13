"use client";
import { Brain, Activity, CheckCircle, DollarSign } from "lucide-react";
export default function BillReviewPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center"><Brain className="w-6 h-6 text-white"/></div>
        <div><h1 className="text-2xl font-bold text-white">BillReviewAI</h1><p className="text-slate-400">Automated bill review and repricing</p></div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4"><p className="text-2xl font-bold text-white">1,892</p><p className="text-sm text-slate-400">Bills Reviewed</p></div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4"><p className="text-2xl font-bold text-green-400">$342K</p><p className="text-sm text-slate-400">Savings Found</p></div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4"><p className="text-2xl font-bold text-blue-400">18%</p><p className="text-sm text-slate-400">Avg Reduction</p></div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4"><p className="text-2xl font-bold text-purple-400">34</p><p className="text-sm text-slate-400">Flagged</p></div>
      </div>
      <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 rounded-xl border border-blue-800/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3"><Brain className="w-6 h-6 text-blue-400"/><h2 className="text-lg font-semibold text-white">AI Review Engine</h2></div>
          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Active</span>
        </div>
        <p className="text-blue-200 mb-4">Analyzing bills using 120+ pricing rules and Medicare benchmarks</p>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-slate-800/50/5 rounded-lg p-4"><p className="text-2xl font-bold text-white">98.5%</p><p className="text-xs text-blue-300">Accuracy</p></div>
          <div className="bg-slate-800/50/5 rounded-lg p-4"><p className="text-2xl font-bold text-white">&lt;5s</p><p className="text-xs text-blue-300">Review Time</p></div>
          <div className="bg-slate-800/50/5 rounded-lg p-4"><p className="text-2xl font-bold text-white">$2.1M</p><p className="text-xs text-blue-300">YTD Savings</p></div>
        </div>
      </div>
    </div>
  );
}
