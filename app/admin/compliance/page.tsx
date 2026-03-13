"use client";
import { AlertTriangle, CheckCircle, Shield, Clock } from "lucide-react";
export default function CompliancePage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">Compliance Monitoring</h1><p className="text-slate-400">Track regulatory compliance and audits</p></div>
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4"><p className="text-2xl font-bold text-green-400">98%</p><p className="text-sm text-slate-400">Compliance Score</p></div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4"><p className="text-2xl font-bold text-amber-400">3</p><p className="text-sm text-slate-400">Open Issues</p></div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4"><p className="text-2xl font-bold text-blue-400">12</p><p className="text-sm text-slate-400">Audits YTD</p></div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4"><p className="text-2xl font-bold text-white">45</p><p className="text-sm text-slate-400">Days Clean</p></div>
      </div>
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Compliance Checklist</h2>
        {[
          {item:"HIPAA Privacy Rule",status:"compliant"},
          {item:"No Surprises Act",status:"attention"},
          {item:"State Licensing",status:"compliant"},
          {item:"CMS Requirements",status:"compliant"},
          {item:"Network Adequacy",status:"compliant"},
        ].map((c,i)=>(
          <div key={i} className="flex items-center justify-between py-3 border-b border-slate-700 last:border-0">
            <div className="flex items-center gap-3">
              {c.status==="compliant"?<CheckCircle className="w-5 h-5 text-green-400"/>:<AlertTriangle className="w-5 h-5 text-amber-400"/>}
              <span className="text-slate-300">{c.item}</span>
            </div>
            <span className={`px-2 py-1 text-xs rounded-full ${c.status==="compliant"?"bg-green-500/20 text-green-400":"bg-amber-500/20 text-amber-400"}`}>{c.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
