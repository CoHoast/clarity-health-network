"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, MapPin, Building2, Users, Phone, Mail, X, Search, Filter } from "lucide-react";

// Northeast Ohio provider locations
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
  const [hoveredProvider, setHoveredProvider] = useState<number | null>(null);
  const [specialtyFilter, setSpecialtyFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProviders = providers.filter(p => {
    const matchesSpecialty = specialtyFilter === "All" || p.specialty === specialtyFilter;
    const matchesType = typeFilter === "All Types" || p.type === typeFilter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpecialty && matchesType && matchesSearch;
  });

  // Convert lat/lng to map position (simplified for NE Ohio region)
  // Bounds roughly: lat 41.2-41.7, lng -82.1 to -81.3
  const getPosition = (lat: number, lng: number) => {
    const x = ((lng + 82.1) / 0.8) * 100; // 0-100%
    const y = ((41.7 - lat) / 0.5) * 100; // 0-100% (inverted)
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  };

  const totalProviders = filteredProviders.reduce((sum, p) => sum + p.providers, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Network Map</h1>
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
          <p className="text-2xl font-bold text-teal-400">{filteredProviders.length}</p>
          <p className="text-sm text-slate-400">Locations</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-blue-400">12</p>
          <p className="text-sm text-slate-400">Counties</p>
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
              className="w-full pl-10 pr-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500"
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
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
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
        
        {/* Interactive Map Area */}
        <div className="relative h-[500px] bg-slate-900/50 rounded-xl overflow-hidden border border-slate-700">
          {/* Lake Erie (top) */}
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-blue-900/40 to-transparent">
            <p className="text-blue-400/50 text-sm absolute top-2 left-1/2 -translate-x-1/2">Lake Erie</p>
          </div>
          
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(10)].map((_, i) => (
              <div key={`h-${i}`} className="absolute w-full h-px bg-slate-500" style={{ top: `${(i + 1) * 10}%` }} />
            ))}
            {[...Array(10)].map((_, i) => (
              <div key={`v-${i}`} className="absolute h-full w-px bg-slate-500" style={{ left: `${(i + 1) * 10}%` }} />
            ))}
          </div>

          {/* City labels */}
          <div className="absolute text-slate-500 text-xs" style={{ left: '55%', top: '40%' }}>Cleveland</div>
          <div className="absolute text-slate-500 text-xs" style={{ left: '25%', top: '50%' }}>Lakewood</div>
          <div className="absolute text-slate-500 text-xs" style={{ left: '10%', top: '55%' }}>Westlake</div>
          <div className="absolute text-slate-500 text-xs" style={{ left: '80%', top: '50%' }}>Beachwood</div>
          <div className="absolute text-slate-500 text-xs" style={{ left: '85%', top: '20%' }}>Mentor</div>
          <div className="absolute text-slate-500 text-xs" style={{ left: '40%', top: '70%' }}>Parma</div>
          <div className="absolute text-slate-500 text-xs" style={{ left: '15%', top: '80%' }}>Strongsville</div>

          {/* Provider markers */}
          {filteredProviders.map((provider) => {
            const pos = getPosition(provider.lat, provider.lng);
            const isHovered = hoveredProvider === provider.id;
            const isSelected = selectedProvider?.id === provider.id;
            
            return (
              <motion.div
                key={provider.id}
                className="absolute cursor-pointer"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: provider.id * 0.03 }}
                onMouseEnter={() => setHoveredProvider(provider.id)}
                onMouseLeave={() => setHoveredProvider(null)}
                onClick={() => setSelectedProvider(provider)}
              >
                {/* Pulse effect for hospitals */}
                {provider.type === "Hospital" && (
                  <div className="absolute -inset-2 bg-red-500/30 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
                )}
                
                {/* Marker */}
                <div className={`relative w-4 h-4 ${typeColors[provider.type]} rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 transition-transform ${isHovered || isSelected ? 'scale-150 z-10' : ''}`}>
                  {provider.providers > 50 && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full border border-white" />
                  )}
                </div>

                {/* Hover tooltip */}
                <AnimatePresence>
                  {isHovered && !selectedProvider && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute left-1/2 -translate-x-1/2 top-6 bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-xl z-20 whitespace-nowrap"
                    >
                      <p className="font-medium text-white text-sm">{provider.name}</p>
                      <p className="text-slate-400 text-xs">{provider.city} • {provider.providers} providers</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom sections */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Top Locations</h2>
          <div className="space-y-3">
            {providers.sort((a, b) => b.providers - a.providers).slice(0, 6).map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedProvider(p)}
                className="w-full flex items-center justify-between p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 ${typeColors[p.type]} rounded-full`} />
                  <div>
                    <p className="text-white font-medium">{p.name}</p>
                    <p className="text-slate-400 text-xs">{p.city} • {p.specialty}</p>
                  </div>
                </div>
                <span className="text-purple-400 font-semibold">{p.providers}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">By Specialty</h2>
          <div className="space-y-3">
            {[
              { spec: "Multi-Specialty", count: 745, color: "bg-purple-500" },
              { spec: "Family Medicine", count: 52, color: "bg-blue-500" },
              { spec: "Internal Medicine", count: 26, color: "bg-teal-500" },
              { spec: "Urgent Care", count: 28, color: "bg-amber-500" },
              { spec: "Orthopedics", count: 19, color: "bg-green-500" },
              { spec: "Pediatrics", count: 22, color: "bg-pink-500" },
            ].map((s) => (
              <div key={s.spec} className="flex items-center gap-3">
                <div className={`w-3 h-3 ${s.color} rounded-full`} />
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300">{s.spec}</span>
                    <span className="text-white font-medium">{s.count}</span>
                  </div>
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full ${s.color} rounded-full`} style={{ width: `${(s.count / 745) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-700">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${typeColors[selectedProvider.type]} rounded-lg flex items-center justify-center`}>
                    <Building2 className="w-5 h-5 text-white" />
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
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Users className="w-5 h-5 text-purple-400" />
                    <span className="text-white font-medium">Provider Count</span>
                  </div>
                  <p className="text-3xl font-bold text-white">{selectedProvider.providers}</p>
                  <p className="text-sm text-slate-400">Active providers at this location</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-slate-400 text-sm">Address</p>
                      <p className="text-white">{selectedProvider.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-slate-400 text-sm">Phone</p>
                      <p className="text-white">{selectedProvider.phone}</p>
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
                <button onClick={() => setSelectedProvider(null)} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">
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
