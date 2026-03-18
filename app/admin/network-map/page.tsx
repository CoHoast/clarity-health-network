"use client";

import { useTheme } from "@/components/admin/ThemeContext";
import { cn } from "@/lib/utils";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, MapPin, Building2, Users, Phone, Mail, X, Search, Filter, Loader2 } from "lucide-react";

// Dynamically import Leaflet map (client-side only)
const LeafletMap = dynamic(
  () => import("@/components/admin/LeafletMap"),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] bg-slate-900/50 rounded-xl flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    ),
  }
);

// Northeast Ohio provider locations with real coordinates
const providers = [
  { id: 1, name: "Cleveland Clinic Main Campus", type: "Hospital", specialty: "Multi-Specialty", lat: 41.5034, lng: -81.6212, city: "Cleveland", providers: 245, address: "9500 Euclid Ave, Cleveland, OH 44195", phone: "(216) 444-2200" },
  { id: 2, name: "University Hospitals", type: "Hospital", specialty: "Multi-Specialty", lat: 41.5084, lng: -81.6052, city: "Cleveland", providers: 189, address: "11100 Euclid Ave, Cleveland, OH 44106", phone: "(216) 844-1000" },
  { id: 3, name: "MetroHealth Medical Center", type: "Hospital", specialty: "Multi-Specialty", lat: 41.4592, lng: -81.6978, city: "Cleveland", providers: 156, address: "2500 MetroHealth Dr, Cleveland, OH 44109", phone: "(216) 778-7800" },
  { id: 4, name: "Lakewood Family Medicine", type: "Practice", specialty: "Family Medicine", lat: 41.4820, lng: -81.7982, city: "Lakewood", providers: 12, address: "14601 Detroit Ave, Lakewood, OH 44107", phone: "(216) 521-4400" },
  { id: 5, name: "Westlake Medical Center", type: "Facility", specialty: "Urgent Care", lat: 41.4553, lng: -81.9179, city: "Westlake", providers: 28, address: "29101 Health Campus Dr, Westlake, OH 44145", phone: "(440) 835-6000" },
  { id: 6, name: "Beachwood Medical Plaza", type: "Practice", specialty: "Multi-Specialty", lat: 41.4645, lng: -81.5087, city: "Beachwood", providers: 45, address: "26900 Cedar Rd, Beachwood, OH 44122", phone: "(216) 831-3700" },
  { id: 7, name: "Mentor Family Health", type: "Practice", specialty: "Family Medicine", lat: 41.6661, lng: -81.3396, city: "Mentor", providers: 18, address: "8655 Market St, Mentor, OH 44060", phone: "(440) 255-8888" },
  { id: 8, name: "Parma Community Hospital", type: "Hospital", specialty: "General Medical", lat: 41.3845, lng: -81.7229, city: "Parma", providers: 89, address: "7007 Powers Blvd, Parma, OH 44129", phone: "(440) 743-3000" },
  { id: 9, name: "Solon Medical Associates", type: "Practice", specialty: "Internal Medicine", lat: 41.3898, lng: -81.4412, city: "Solon", providers: 15, address: "34100 Aurora Rd, Solon, OH 44139", phone: "(440) 349-1900" },
  { id: 10, name: "Strongsville Health Center", type: "Facility", specialty: "Multi-Specialty", lat: 41.3145, lng: -81.8362, city: "Strongsville", providers: 34, address: "16761 Southpark Center, Strongsville, OH 44136", phone: "(440) 878-2500" },
  { id: 11, name: "Euclid Hospital", type: "Hospital", specialty: "General Medical", lat: 41.5931, lng: -81.5268, city: "Euclid", providers: 67, address: "18901 Lake Shore Blvd, Euclid, OH 44119", phone: "(216) 531-9000" },
  { id: 12, name: "Shaker Heights Medical", type: "Practice", specialty: "Pediatrics", lat: 41.4739, lng: -81.5370, city: "Shaker Heights", providers: 22, address: "20455 Farnsleigh Rd, Shaker Heights, OH 44122", phone: "(216) 991-4000" },
  { id: 13, name: "Rocky River Wellness", type: "Practice", specialty: "Family Medicine", lat: 41.4756, lng: -81.8529, city: "Rocky River", providers: 8, address: "19300 Detroit Rd, Rocky River, OH 44116", phone: "(440) 333-5500" },
  { id: 14, name: "Avon Health Campus", type: "Facility", specialty: "Multi-Specialty", lat: 41.4517, lng: -82.0353, city: "Avon", providers: 42, address: "35900 Detroit Rd, Avon, OH 44011", phone: "(440) 934-7000" },
  { id: 15, name: "Independence Medical", type: "Practice", specialty: "Orthopedics", lat: 41.3684, lng: -81.6387, city: "Independence", providers: 19, address: "5001 Rockside Rd, Independence, OH 44131", phone: "(216) 986-1000" },
  { id: 16, name: "Willoughby Hills Care", type: "Practice", specialty: "Internal Medicine", lat: 41.5978, lng: -81.4234, city: "Willoughby Hills", providers: 11, address: "2550 SOM Center Rd, Willoughby Hills, OH 44094", phone: "(440) 944-8800" },
  { id: 17, name: "Fairview Hospital", type: "Hospital", specialty: "Multi-Specialty", lat: 41.4437, lng: -81.8234, city: "Cleveland", providers: 134, address: "18101 Lorain Ave, Cleveland, OH 44111", phone: "(216) 476-7000" },
  { id: 18, name: "Hudson Medical Group", type: "Practice", specialty: "Family Medicine", lat: 41.2401, lng: -81.4409, city: "Hudson", providers: 14, address: "80 Aurora St, Hudson, OH 44236", phone: "(330) 342-4000" },
  { id: 19, name: "Akron General Medical Center", type: "Hospital", specialty: "Multi-Specialty", lat: 41.0814, lng: -81.5190, city: "Akron", providers: 178, address: "1 Akron General Ave, Akron, OH 44307", phone: "(330) 344-6000" },
  { id: 20, name: "Summa Health", type: "Hospital", specialty: "Multi-Specialty", lat: 41.0534, lng: -81.5120, city: "Akron", providers: 145, address: "525 E Market St, Akron, OH 44304", phone: "(330) 375-3000" },
  { id: 21, name: "Canton Medical Center", type: "Hospital", specialty: "General Medical", lat: 40.7989, lng: -81.3784, city: "Canton", providers: 98, address: "2600 Sixth St SW, Canton, OH 44710", phone: "(330) 489-1000" },
  { id: 22, name: "Medina Hospital", type: "Hospital", specialty: "General Medical", lat: 41.1382, lng: -81.8637, city: "Medina", providers: 56, address: "1000 E Washington St, Medina, OH 44256", phone: "(330) 725-1000" },
  { id: 23, name: "Lorain Community Care", type: "Facility", specialty: "Urgent Care", lat: 41.4529, lng: -82.1824, city: "Lorain", providers: 24, address: "3700 Kolbe Rd, Lorain, OH 44053", phone: "(440) 960-4000" },
  { id: 24, name: "Elyria Medical Center", type: "Hospital", specialty: "General Medical", lat: 41.3684, lng: -82.1076, city: "Elyria", providers: 72, address: "630 E River St, Elyria, OH 44035", phone: "(440) 329-7500" },
  { id: 25, name: "Brunswick Health", type: "Practice", specialty: "Family Medicine", lat: 41.2384, lng: -81.8418, city: "Brunswick", providers: 16, address: "1455 Pearl Rd, Brunswick, OH 44212", phone: "(330) 225-5000" },
  { id: 26, name: "Twinsburg Family Care", type: "Practice", specialty: "Family Medicine", lat: 41.3126, lng: -81.4401, city: "Twinsburg", providers: 9, address: "8996 Darrow Rd, Twinsburg, OH 44087", phone: "(330) 425-3300" },
  { id: 27, name: "Painesville Medical", type: "Practice", specialty: "Internal Medicine", lat: 41.7245, lng: -81.2456, city: "Painesville", providers: 13, address: "7 Washington St, Painesville, OH 44077", phone: "(440) 354-2000" },
  { id: 28, name: "Ashtabula County Medical", type: "Hospital", specialty: "General Medical", lat: 41.8650, lng: -80.7898, city: "Ashtabula", providers: 48, address: "2420 Lake Ave, Ashtabula, OH 44004", phone: "(440) 997-2262" },
  { id: 29, name: "Geneva Medical Group", type: "Practice", specialty: "Family Medicine", lat: 41.8048, lng: -80.9481, city: "Geneva", providers: 7, address: "870 S Broadway, Geneva, OH 44041", phone: "(440) 466-1133" },
  { id: 30, name: "Chardon Health Center", type: "Facility", specialty: "Multi-Specialty", lat: 41.5812, lng: -81.2079, city: "Chardon", providers: 21, address: "13207 Ravenna Rd, Chardon, OH 44024", phone: "(440) 286-6000" },
];

const typeColors: Record<string, string> = {
  "Hospital": "bg-red-500",
  "Practice": "bg-blue-500",
  "Facility": "bg-green-500",
};

const specialtyFilters = ["All", "Multi-Specialty", "Family Medicine", "Internal Medicine", "Pediatrics", "Orthopedics", "Urgent Care", "General Medical"];
const typeFilters = ["All Types", "Hospital", "Practice", "Facility"];

export default function NetworkMapPage() {
  const [selectedProvider, setSelectedProvider] = useState<typeof providers[0] | null>(null);
  const [specialtyFilter, setSpecialtyFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProviders = useMemo(() => {
    return providers.filter(p => {
      const matchesSpecialty = specialtyFilter === "All" || p.specialty === specialtyFilter;
      const matchesType = typeFilter === "All Types" || p.type === typeFilter;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.city.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSpecialty && matchesType && matchesSearch;
    });
  }, [specialtyFilter, typeFilter, searchQuery]);

  const totalProviders = filteredProviders.reduce((sum, p) => sum + p.providers, 0);
  const hospitalCount = providers.filter(p => p.type === "Hospital").length;
  const practiceCount = providers.filter(p => p.type === "Practice").length;
  const facilityCount = providers.filter(p => p.type === "Facility").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Globe className="w-7 h-7 text-blue-500" />
            Network Map
          </h1>
          <p className="text-slate-400">Interactive view of providers across Northeast Ohio</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-white">{totalProviders.toLocaleString()}</p>
          <p className="text-sm text-slate-400">Total Providers</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-blue-400">{filteredProviders.length}</p>
          <p className="text-sm text-slate-400">Locations Shown</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-red-400">{hospitalCount}</span>
            <span className="text-slate-500">/</span>
            <span className="text-2xl font-bold text-blue-400">{practiceCount}</span>
            <span className="text-slate-500">/</span>
            <span className="text-2xl font-bold text-green-400">{facilityCount}</span>
          </div>
          <p className="text-sm text-slate-400">Hospitals / Practices / Facilities</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-green-400">94%</p>
          <p className="text-sm text-slate-400">Population Coverage</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search providers or cities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <select 
            value={typeFilter} 
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white"
          >
            {typeFilters.map(t => <option key={t}>{t}</option>)}
          </select>
          <select 
            value={specialtyFilter} 
            onChange={(e) => setSpecialtyFilter(e.target.value)}
            className="px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white"
          >
            {specialtyFilters.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Map */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Northeast Ohio Provider Network</h2>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-slate-400">Hospital</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-slate-400">Practice</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-slate-400">Facility</span>
            </div>
          </div>
        </div>
        
        {/* Leaflet Map */}
        <div className="h-[500px] rounded-xl overflow-hidden border border-slate-700">
          <LeafletMap
            providers={providers}
            selectedProvider={selectedProvider}
            onSelectProvider={setSelectedProvider}
            typeFilter={typeFilter}
            specialtyFilter={specialtyFilter}
          />
        </div>
      </div>

      {/* Bottom sections */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Top Locations by Provider Count</h2>
          <div className="space-y-3">
            {providers.sort((a, b) => b.providers - a.providers).slice(0, 6).map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedProvider(p)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors text-left ${
                  selectedProvider?.id === p.id 
                    ? 'bg-blue-600/20 border border-blue-600/50' 
                    : 'bg-slate-700/50 hover:bg-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 ${typeColors[p.type]} rounded-full`} />
                  <div>
                    <p className="text-white font-medium">{p.name}</p>
                    <p className="text-slate-400 text-xs">{p.city} • {p.specialty}</p>
                  </div>
                </div>
                <span className="text-blue-500 font-semibold">{p.providers}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Coverage by Specialty</h2>
          <div className="space-y-3">
            {[
              { spec: "Multi-Specialty", count: providers.filter(p => p.specialty === "Multi-Specialty").reduce((s, p) => s + p.providers, 0), color: "bg-blue-600" },
              { spec: "General Medical", count: providers.filter(p => p.specialty === "General Medical").reduce((s, p) => s + p.providers, 0), color: "bg-slate-500" },
              { spec: "Family Medicine", count: providers.filter(p => p.specialty === "Family Medicine").reduce((s, p) => s + p.providers, 0), color: "bg-blue-500" },
              { spec: "Internal Medicine", count: providers.filter(p => p.specialty === "Internal Medicine").reduce((s, p) => s + p.providers, 0), color: "bg-teal-500" },
              { spec: "Urgent Care", count: providers.filter(p => p.specialty === "Urgent Care").reduce((s, p) => s + p.providers, 0), color: "bg-amber-500" },
              { spec: "Orthopedics", count: providers.filter(p => p.specialty === "Orthopedics").reduce((s, p) => s + p.providers, 0), color: "bg-green-500" },
              { spec: "Pediatrics", count: providers.filter(p => p.specialty === "Pediatrics").reduce((s, p) => s + p.providers, 0), color: "bg-pink-500" },
            ].sort((a, b) => b.count - a.count).map((s) => {
              const maxCount = 1200;
              return (
                <div key={s.spec} className="flex items-center gap-3">
                  <div className={`w-3 h-3 ${s.color} rounded-full flex-shrink-0`} />
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-300">{s.spec}</span>
                      <span className="text-white font-medium">{s.count}</span>
                    </div>
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full ${s.color} rounded-full transition-all duration-500`} style={{ width: `${(s.count / maxCount) * 100}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Provider Detail Modal */}
      <AnimatePresence>
        {selectedProvider && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProvider(null)}
              className="fixed inset-0 bg-black/60 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-700">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${typeColors[selectedProvider.type]} rounded-lg flex items-center justify-center`}>
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">{selectedProvider.name}</h2>
                    <p className="text-sm text-slate-400">{selectedProvider.type} • {selectedProvider.specialty}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedProvider(null)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="bg-gradient-to-r from-blue-600/10 to-teal-500/10 border border-blue-600/30 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    <span className="text-white font-medium">Provider Count</span>
                  </div>
                  <p className="text-4xl font-bold text-white">{selectedProvider.providers}</p>
                  <p className="text-sm text-slate-400">Active providers at this location</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-slate-400 text-sm">Address</p>
                      <p className="text-white">{selectedProvider.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-slate-400 text-sm">Phone</p>
                      <p className="text-white">{selectedProvider.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-slate-400 text-sm">Coordinates</p>
                      <p className="text-white font-mono text-sm">{selectedProvider.lat.toFixed(4)}, {selectedProvider.lng.toFixed(4)}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-green-400">Active</p>
                    <p className="text-xs text-slate-400">Network Status</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-white">A+</p>
                    <p className="text-xs text-slate-400">Quality Score</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 p-4 border-t border-slate-700 bg-slate-800">
                <button className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 text-sm">
                  View Providers
                </button>
                <button className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 text-sm">
                  View Contracts
                </button>
                <button onClick={() => setSelectedProvider(null)} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 text-sm">
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
