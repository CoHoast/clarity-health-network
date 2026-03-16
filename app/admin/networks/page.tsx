"use client";

import { useState } from "react";
import { Globe, Search, Plus, Edit, Trash2, Eye, Users, Building2, CheckCircle, X, Check, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Network {
  id: string;
  name: string;
  description: string;
  states: string[];
  providerCount: number;
  practiceCount: number;
  status: "active" | "inactive";
  createdDate: string;
  contractType: string;
}

const networks: Network[] = [
  { id: "NET-001", name: "Ohio PPO Network", description: "Primary PPO network covering all of Ohio", states: ["OH"], providerCount: 1847, practiceCount: 312, status: "active", createdDate: "2020-01-01", contractType: "% Off Billed" },
  { id: "NET-002", name: "Cleveland Metro Network", description: "Greater Cleveland metropolitan area providers", states: ["OH"], providerCount: 892, practiceCount: 156, status: "active", createdDate: "2021-03-15", contractType: "% of Medicare" },
  { id: "NET-003", name: "Northeast Ohio Specialists", description: "Specialty care providers in NE Ohio", states: ["OH"], providerCount: 456, practiceCount: 89, status: "active", createdDate: "2022-06-01", contractType: "Mixed" },
  { id: "NET-004", name: "Ohio Hospital Alliance", description: "Hospital and facility network", states: ["OH"], providerCount: 89, practiceCount: 12, status: "active", createdDate: "2019-08-20", contractType: "% of Medicare" },
  { id: "NET-005", name: "Midwest Regional Network", description: "Multi-state network covering OH, PA, MI, IN", states: ["OH", "PA", "MI", "IN"], providerCount: 3421, practiceCount: 567, status: "active", createdDate: "2018-01-01", contractType: "Mixed" },
  { id: "NET-006", name: "TrueCare Value Network", description: "Cost-effective care network with negotiated rates", states: ["OH", "PA"], providerCount: 1256, practiceCount: 234, status: "active", createdDate: "2023-01-15", contractType: "% Off Billed" },
  { id: "NET-007", name: "Pennsylvania PPO", description: "Pennsylvania state network", states: ["PA"], providerCount: 2134, practiceCount: 389, status: "active", createdDate: "2020-04-01", contractType: "% Off Billed" },
  { id: "NET-008", name: "Urgent Care Express", description: "Urgent care and walk-in clinics network", states: ["OH", "PA", "MI"], providerCount: 234, practiceCount: 67, status: "active", createdDate: "2022-09-01", contractType: "Flat Rate" },
  { id: "NET-009", name: "Michigan Health Partners", description: "Michigan state provider network", states: ["MI"], providerCount: 1567, practiceCount: 278, status: "active", createdDate: "2021-06-01", contractType: "% of Medicare" },
  { id: "NET-010", name: "Indiana Care Network", description: "Indiana state provider network", states: ["IN"], providerCount: 987, practiceCount: 167, status: "inactive", createdDate: "2019-03-15", contractType: "% Off Billed" },
];

const stateOptions = ["OH", "PA", "MI", "IN", "WV", "KY", "NY", "IL"];

export default function NetworksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("All States");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddProvidersModal, setShowAddProvidersModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [providerSearchQuery, setProviderSearchQuery] = useState("");

  // Sample providers for bulk add
  const availableProviders = [
    { id: "PRV-001", name: "Dr. Robert Smith", specialty: "Family Medicine", npi: "1111111111", practice: "Cleveland Family Medicine" },
    { id: "PRV-002", name: "Dr. Jennifer Adams", specialty: "Family Medicine", npi: "1111111112", practice: "Cleveland Family Medicine" },
    { id: "PRV-003", name: "Dr. Michael Chen", specialty: "Family Medicine", npi: "1111111113", practice: "Cleveland Family Medicine" },
    { id: "PRV-005", name: "Dr. James Miller", specialty: "Orthopedic Surgery", npi: "4444444441", practice: "Cleveland Orthopedic Associates" },
    { id: "PRV-006", name: "Dr. Lisa Thompson", specialty: "Orthopedic Surgery", npi: "4444444442", practice: "Cleveland Orthopedic Associates" },
    { id: "PRV-009", name: "Dr. Thomas Richards", specialty: "Radiology", npi: "3333333331", practice: "Metro Imaging Center" },
    { id: "PRV-011", name: "Dr. Robert Thompson", specialty: "Cardiology", npi: "9999999991", practice: "Cleveland Cardiology Associates" },
    { id: "PRV-015", name: "Dr. Patricia Lee", specialty: "Emergency Medicine", npi: "6666666661", practice: "Westlake Urgent Care" },
  ];

  const filteredAvailableProviders = availableProviders.filter(p => 
    p.name.toLowerCase().includes(providerSearchQuery.toLowerCase()) ||
    p.specialty.toLowerCase().includes(providerSearchQuery.toLowerCase()) ||
    p.npi.includes(providerSearchQuery)
  );

  const toggleProviderSelection = (id: string) => {
    if (selectedProviders.includes(id)) {
      setSelectedProviders(selectedProviders.filter(p => p !== id));
    } else {
      setSelectedProviders([...selectedProviders, id]);
    }
  };

  const selectAllProviders = () => {
    if (selectedProviders.length === filteredAvailableProviders.length) {
      setSelectedProviders([]);
    } else {
      setSelectedProviders(filteredAvailableProviders.map(p => p.id));
    }
  };

  const [newNetwork, setNewNetwork] = useState({
    name: "",
    description: "",
    states: [] as string[],
    contractType: "% Off Billed",
  });

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        setShowCreateModal(false);
        setNewNetwork({ name: "", description: "", states: [], contractType: "% Off Billed" });
      }, 1500);
    }, 1000);
  };

  const toggleState = (state: string) => {
    if (newNetwork.states.includes(state)) {
      setNewNetwork({ ...newNetwork, states: newNetwork.states.filter(s => s !== state) });
    } else {
      setNewNetwork({ ...newNetwork, states: [...newNetwork.states, state] });
    }
  };

  const filteredNetworks = networks.filter(network => {
    const matchesSearch = network.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      network.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = stateFilter === "All States" || network.states.includes(stateFilter);
    const matchesStatus = statusFilter === "all" || network.status === statusFilter;
    return matchesSearch && matchesState && matchesStatus;
  });

  const totalProviders = networks.reduce((sum, n) => sum + n.providerCount, 0);
  const totalPractices = networks.reduce((sum, n) => sum + n.practiceCount, 0);
  const activeNetworks = networks.filter(n => n.status === "active").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Globe className="w-7 h-7 text-purple-500" />
            Network Organizations
          </h1>
          <p className="text-slate-400 mt-1">Organize and manage provider networks by region</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 font-medium rounded-lg hover:bg-purple-700 transition-colors"
          style={{ color: 'white' }}
        >
          <Plus className="w-4 h-4" />
          Create Network
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Globe className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{networks.length}</p>
              <p className="text-sm text-slate-400">Total Networks</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{activeNetworks}</p>
              <p className="text-sm text-slate-400">Active Networks</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/20 rounded-lg">
              <Users className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totalProviders.toLocaleString()}</p>
              <p className="text-sm text-slate-400">Total Providers</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-500/20 rounded-lg">
              <Building2 className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totalPractices.toLocaleString()}</p>
              <p className="text-sm text-slate-400">Total Practices</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search networks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          className="px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="All States">All States</option>
          {stateOptions.map(state => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Networks Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNetworks.map((network) => (
          <div
            key={network.id}
            className={`bg-slate-800/50 rounded-xl border p-6 hover:border-purple-500/50 transition-colors cursor-pointer ${
              network.status === "active" ? "border-slate-700" : "border-slate-700/50 opacity-75"
            }`}
            onClick={() => setSelectedNetwork(network)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex items-center gap-2">
                {network.states.map(state => (
                  <span key={state} className="px-2 py-0.5 bg-slate-700 text-slate-300 text-xs font-medium rounded">
                    {state}
                  </span>
                ))}
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-white mb-1">{network.name}</h3>
            <p className="text-slate-400 text-sm mb-4 line-clamp-2">{network.description}</p>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-700/50 rounded-lg p-2 text-center">
                <p className="text-lg font-bold text-cyan-400">{network.providerCount.toLocaleString()}</p>
                <p className="text-xs text-slate-500">Providers</p>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-2 text-center">
                <p className="text-lg font-bold text-teal-400">{network.practiceCount.toLocaleString()}</p>
                <p className="text-xs text-slate-500">Practices</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                network.status === "active" 
                  ? "bg-green-500/20 text-green-400"
                  : "bg-slate-600 text-slate-400"
              }`}>
                {network.status === "active" ? "Active" : "Inactive"}
              </span>
              <span className="text-xs text-slate-500">{network.contractType}</span>
            </div>
          </div>
        ))}
      </div>

      {filteredNetworks.length === 0 && (
        <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-slate-700">
          <Globe className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No networks found matching your filters</p>
        </div>
      )}

      {/* Network Detail Modal */}
      <AnimatePresence>
        {selectedNetwork && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedNetwork(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-800 rounded-xl max-w-3xl w-full max-h-[85vh] overflow-auto border border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-700 flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <Globe className="w-7 h-7 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedNetwork.name}</h2>
                    <p className="text-slate-400">{selectedNetwork.description}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedNetwork(null)} className="text-slate-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-cyan-400">{selectedNetwork.providerCount.toLocaleString()}</p>
                    <p className="text-sm text-slate-400">Providers</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-teal-400">{selectedNetwork.practiceCount.toLocaleString()}</p>
                    <p className="text-sm text-slate-400">Practices</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-purple-400">{selectedNetwork.states.length}</p>
                    <p className="text-sm text-slate-400">States</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                    <p className={`text-lg font-bold ${selectedNetwork.status === "active" ? "text-green-400" : "text-slate-400"}`}>
                      {selectedNetwork.status === "active" ? "Active" : "Inactive"}
                    </p>
                    <p className="text-sm text-slate-400">Status</p>
                  </div>
                </div>

                {/* Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-purple-400" />
                      Coverage States
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedNetwork.states.map(state => (
                        <span key={state} className="px-3 py-1.5 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium">
                          {state}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-white mb-3">Network Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Contract Type:</span>
                        <span className="text-white">{selectedNetwork.contractType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Created:</span>
                        <span className="text-white">{selectedNetwork.createdDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Network ID:</span>
                        <span className="text-white font-mono">{selectedNetwork.id}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-3">
                  <Link
                    href={`/admin/providers?network=${selectedNetwork.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-cyan-600 text-white font-medium rounded-lg hover:bg-cyan-700 transition-colors"
                  >
                    <Users className="w-4 h-4" />
                    View Providers ({selectedNetwork.providerCount.toLocaleString()})
                  </Link>
                  <button 
                    onClick={() => { setShowAddProvidersModal(true); setSelectedProviders([]); }}
                    className="flex items-center gap-2 px-4 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-500 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Providers
                  </button>
                </div>
              </div>

              <div className="p-6 border-t border-slate-700 flex justify-end gap-3">
                <button className="px-4 py-2 bg-slate-700 text-slate-300 font-medium rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit Network
                </button>
                <button className="px-4 py-2 bg-red-600/20 text-red-400 font-medium rounded-lg hover:bg-red-600/30 transition-colors flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Network Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => !saving && setShowCreateModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-800 rounded-xl max-w-lg w-full border border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              {!saving && !saved ? (
                <>
                  <div className="p-6 border-b border-slate-700">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Globe className="w-6 h-6 text-purple-400" />
                      Create Network Organization
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Define a new network to organize providers</p>
                  </div>
                  <div className="p-6 space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Network Name *</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                        placeholder="e.g., Ohio Premier Network"
                        value={newNetwork.name}
                        onChange={(e) => setNewNetwork({...newNetwork, name: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                      <textarea 
                        className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:border-purple-500 h-20 resize-none"
                        placeholder="Brief description of this network..."
                        value={newNetwork.description}
                        onChange={(e) => setNewNetwork({...newNetwork, description: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Coverage States</label>
                      <div className="flex flex-wrap gap-2">
                        {stateOptions.map(state => (
                          <button
                            key={state}
                            type="button"
                            onClick={() => toggleState(state)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                              newNetwork.states.includes(state)
                                ? "bg-purple-600 text-white"
                                : "bg-slate-700 text-slate-400 hover:bg-slate-600"
                            }`}
                          >
                            {state}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Default Contract Type</label>
                      <select 
                        className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-purple-500"
                        value={newNetwork.contractType}
                        onChange={(e) => setNewNetwork({...newNetwork, contractType: e.target.value})}
                      >
                        <option value="% Off Billed">% Off Billed</option>
                        <option value="% of Medicare">% of Medicare</option>
                        <option value="Flat Rate">Flat Rate</option>
                        <option value="Mixed">Mixed</option>
                      </select>
                    </div>
                  </div>
                  <div className="p-6 border-t border-slate-700 flex justify-end gap-3">
                    <button
                      onClick={() => setShowCreateModal(false)}
                      className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSave}
                      disabled={!newNetwork.name}
                      className={`px-6 py-2 font-medium rounded-lg flex items-center gap-2 transition-colors ${
                        newNetwork.name 
                          ? "bg-purple-600 text-white hover:bg-purple-700"
                          : "bg-slate-700 text-slate-500 cursor-not-allowed"
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                      Create Network
                    </button>
                  </div>
                </>
              ) : saving ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-white font-medium">Creating network...</p>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <Check className="w-8 h-8 text-green-400" />
                  </motion.div>
                  <p className="text-white font-medium">Network Created!</p>
                  <p className="text-slate-400 text-sm mt-1">You can now add providers to this network</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Providers Modal (Bulk) */}
      <AnimatePresence>
        {showAddProvidersModal && selectedNetwork && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddProvidersModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-800 rounded-xl max-w-2xl w-full max-h-[85vh] overflow-auto border border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-700">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Users className="w-6 h-6 text-purple-400" />
                  Add Providers to {selectedNetwork.name}
                </h2>
                <p className="text-slate-400 text-sm mt-1">Select providers to add to this network (bulk assignment)</p>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search providers by name, specialty, or NPI..."
                    value={providerSearchQuery}
                    onChange={(e) => setProviderSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-400"
                  />
                </div>

                {/* Select All */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={selectAllProviders}
                    className="text-sm text-purple-400 hover:text-purple-300"
                  >
                    {selectedProviders.length === filteredAvailableProviders.length ? "Deselect All" : "Select All"}
                  </button>
                  <span className="text-sm text-slate-400">
                    {selectedProviders.length} selected
                  </span>
                </div>

                {/* Provider List */}
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {filteredAvailableProviders.map(provider => (
                    <label
                      key={provider.id}
                      className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedProviders.includes(provider.id)
                          ? "bg-purple-500/20 border border-purple-500/50"
                          : "bg-slate-700/30 border border-transparent hover:bg-slate-700/50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedProviders.includes(provider.id)}
                        onChange={() => toggleProviderSelection(provider.id)}
                        className="w-5 h-5 rounded border-slate-500 text-purple-600 focus:ring-purple-500"
                      />
                      <div className="flex-1">
                        <p className="text-white font-medium">{provider.name}</p>
                        <p className="text-slate-400 text-sm">{provider.specialty} • {provider.practice}</p>
                      </div>
                      <span className="text-slate-500 font-mono text-xs">{provider.npi}</span>
                    </label>
                  ))}
                </div>

                {filteredAvailableProviders.length === 0 && (
                  <div className="text-center py-8 text-slate-400">
                    No providers found matching your search.
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-slate-700 flex justify-end gap-3">
                <button
                  onClick={() => setShowAddProvidersModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Handle bulk add
                    setSaving(true);
                    setTimeout(() => {
                      setSaving(false);
                      setSaved(true);
                      setTimeout(() => {
                        setSaved(false);
                        setShowAddProvidersModal(false);
                        setSelectedProviders([]);
                      }, 1500);
                    }, 1000);
                  }}
                  disabled={selectedProviders.length === 0}
                  className={`px-6 py-2 font-medium rounded-lg flex items-center gap-2 transition-colors ${
                    selectedProviders.length > 0
                      ? "bg-purple-600 text-white hover:bg-purple-700"
                      : "bg-slate-700 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  Add {selectedProviders.length} Provider{selectedProviders.length !== 1 ? 's' : ''}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
