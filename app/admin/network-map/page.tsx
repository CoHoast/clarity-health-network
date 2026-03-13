"use client";
import { Globe, MapPin, Building2 } from "lucide-react";
export default function NetworkMapPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">Network Map</h1><p className="text-slate-400">Geographic view of your provider network</p></div>
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4"><p className="text-2xl font-bold text-white">2,847</p><p className="text-sm text-slate-400">Total Providers</p></div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4"><p className="text-2xl font-bold text-teal-400">156</p><p className="text-sm text-slate-400">Locations</p></div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4"><p className="text-2xl font-bold text-blue-400">12</p><p className="text-sm text-slate-400">Counties</p></div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4"><p className="text-2xl font-bold text-green-400">94%</p><p className="text-sm text-slate-400">Coverage</p></div>
      </div>
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Provider Distribution</h2>
        <div className="h-96 flex items-center justify-center bg-slate-700/30 rounded-lg">
          <div className="text-center text-slate-400"><Globe className="w-16 h-16 mx-auto mb-3 opacity-50"/><p>Interactive network map</p><p className="text-sm">Showing 2,847 providers across Northeast Ohio</p></div>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Top Cities</h2>
          {[{city:"Cleveland",count:892},{city:"Lakewood",count:234},{city:"Beachwood",count:189},{city:"Westlake",count:156}].map(c=>(
            <div key={c.city} className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0">
              <span className="text-slate-300">{c.city}</span><span className="text-white font-medium">{c.count}</span>
            </div>
          ))}
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">By Specialty</h2>
          {[{spec:"Primary Care",count:892},{spec:"Specialists",count:1234},{spec:"Facilities",count:156},{spec:"Ancillary",count:565}].map(s=>(
            <div key={s.spec} className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0">
              <span className="text-slate-300">{s.spec}</span><span className="text-white font-medium">{s.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
