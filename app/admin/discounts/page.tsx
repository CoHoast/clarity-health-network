"use client";

import { useState } from "react";
import { DollarSign, Search, Plus, Edit, Trash2, Eye, Download, Building2, CheckCircle, X, Check, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DiscountSchedule {
  id: string;
  name: string;
  type: string;
  defaultRate: string;
  providersUsing: number;
  services: { service: string; rate: string }[];
  createdDate: string;
  lastModified: string;
}

const discountSchedules: DiscountSchedule[] = [
  {
    id: "DS-001",
    name: "Standard PPO Discount",
    type: "% Off Billed",
    defaultRate: "35%",
    providersUsing: 1247,
    services: [
      { service: "Office Visit (99213)", rate: "35%" },
      { service: "Office Visit (99214)", rate: "35%" },
      { service: "Office Visit (99215)", rate: "35%" },
      { service: "Preventive Visit", rate: "40%" },
      { service: "Lab Services", rate: "45%" },
    ],
    createdDate: "2024-01-01",
    lastModified: "2026-02-15"
  },
  {
    id: "DS-002",
    name: "Hospital Facility Rates",
    type: "% of Medicare",
    defaultRate: "140%",
    providersUsing: 89,
    services: [
      { service: "Inpatient (DRG)", rate: "145% Medicare" },
      { service: "Outpatient Surgery", rate: "135% Medicare" },
      { service: "ER Visit", rate: "150% Medicare" },
      { service: "Observation", rate: "140% Medicare" },
    ],
    createdDate: "2024-01-01",
    lastModified: "2026-01-20"
  },
  {
    id: "DS-003",
    name: "Imaging Center Schedule",
    type: "Case Rate",
    defaultRate: "See Schedule",
    providersUsing: 156,
    services: [
      { service: "MRI - Brain", rate: "$425" },
      { service: "MRI - Spine", rate: "$475" },
      { service: "CT Scan - Head", rate: "$285" },
      { service: "CT Scan - Abdomen", rate: "$350" },
      { service: "X-Ray", rate: "$45" },
      { service: "Ultrasound", rate: "$125" },
    ],
    createdDate: "2024-03-15",
    lastModified: "2026-02-01"
  },
  {
    id: "DS-004",
    name: "Laboratory Services",
    type: "% Off Billed",
    defaultRate: "50%",
    providersUsing: 234,
    services: [
      { service: "Basic Metabolic Panel", rate: "55%" },
      { service: "Complete Blood Count", rate: "55%" },
      { service: "Lipid Panel", rate: "50%" },
      { service: "Thyroid Panel", rate: "50%" },
      { service: "Urinalysis", rate: "60%" },
    ],
    createdDate: "2024-01-01",
    lastModified: "2026-01-10"
  },
  {
    id: "DS-005",
    name: "Specialist Enhanced",
    type: "% of Medicare",
    defaultRate: "125%",
    providersUsing: 412,
    services: [
      { service: "Cardiology Consult", rate: "130% Medicare" },
      { service: "Orthopedic Consult", rate: "125% Medicare" },
      { service: "Neurology Consult", rate: "130% Medicare" },
      { service: "Surgery - Minor", rate: "120% Medicare" },
    ],
    createdDate: "2024-06-01",
    lastModified: "2026-02-20"
  },
  {
    id: "DS-006",
    name: "Urgent Care Flat Rate",
    type: "Flat Rate",
    defaultRate: "See Schedule",
    providersUsing: 67,
    services: [
      { service: "Level 1 - Minor", rate: "$95" },
      { service: "Level 2 - Moderate", rate: "$145" },
      { service: "Level 3 - Complex", rate: "$195" },
      { service: "Laceration Repair", rate: "$175" },
      { service: "X-Ray (included)", rate: "$0" },
    ],
    createdDate: "2025-01-01",
    lastModified: "2026-01-15"
  },
];

const discountTypes = ["All Types", "% Off Billed", "% of Medicare", "Case Rate", "Flat Rate"];

export default function DiscountSchedulesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [selectedSchedule, setSelectedSchedule] = useState<DiscountSchedule | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [serviceRows, setServiceRows] = useState([{ service: "", rate: "" }]);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        setShowCreateModal(false);
        setServiceRows([{ service: "", rate: "" }]);
      }, 1500);
    }, 1000);
  };

  const addServiceRow = () => {
    setServiceRows([...serviceRows, { service: "", rate: "" }]);
  };

  const removeServiceRow = (index: number) => {
    if (serviceRows.length > 1) {
      setServiceRows(serviceRows.filter((_, i) => i !== index));
    }
  };

  const filteredSchedules = discountSchedules.filter(schedule => {
    const matchesSearch = schedule.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "All Types" || schedule.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalProviders = discountSchedules.reduce((sum, s) => sum + s.providersUsing, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <DollarSign className="w-7 h-7 text-green-500" />
            Discount Schedules
          </h1>
          <p className="text-slate-400 mt-1">{discountSchedules.length} schedules • {totalProviders.toLocaleString()} providers assigned</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 font-medium rounded-lg hover:bg-teal-700 transition-colors"
          style={{ color: 'white' }}
        >
          <Plus className="w-4 h-4" />
          New Schedule
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search schedules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          {discountTypes.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors">
          <Download className="w-4 h-4" />
          Export All
        </button>
      </div>

      {/* Schedules Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSchedules.map((schedule) => (
          <div
            key={schedule.id}
            className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 hover:border-green-500/50 transition-colors cursor-pointer"
            onClick={() => setSelectedSchedule(schedule)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs font-medium rounded-full">{schedule.type}</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">{schedule.name}</h3>
            <p className="text-green-400 text-2xl font-bold mb-4">{schedule.defaultRate}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Providers Using:</span>
                <span className="text-cyan-400 font-medium">{schedule.providersUsing.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Service Rates:</span>
                <span className="text-slate-300">{schedule.services.length} defined</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Last Modified:</span>
                <span className="text-slate-300">{schedule.lastModified}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedSchedule(schedule); }}
                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-slate-700 text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-600 transition-colors"
              >
                <Eye className="w-4 h-4" />
                View Rates
              </button>
              <button 
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-slate-700 text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-600 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Schedule Detail Modal */}
      <AnimatePresence>
        {selectedSchedule && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedSchedule(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-800 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-auto border border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedSchedule.name}</h2>
                  <p className="text-slate-400">{selectedSchedule.type} • Default: {selectedSchedule.defaultRate}</p>
                </div>
                <button onClick={() => setSelectedSchedule(null)} className="text-slate-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-white">{selectedSchedule.providersUsing.toLocaleString()}</p>
                    <p className="text-sm text-slate-400">Providers</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-green-400">{selectedSchedule.defaultRate}</p>
                    <p className="text-sm text-slate-400">Default Rate</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-cyan-400">{selectedSchedule.services.length}</p>
                    <p className="text-sm text-slate-400">Service Rates</p>
                  </div>
                </div>

                {/* Service Rates Table */}
                <h3 className="text-white font-semibold mb-3">Service-Specific Rates</h3>
                <div className="bg-slate-900 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Service</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase">Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {selectedSchedule.services.map((service, i) => (
                        <tr key={i} className="hover:bg-slate-800/50">
                          <td className="px-4 py-3 text-slate-300">{service.service}</td>
                          <td className="px-4 py-3 text-right text-green-400 font-medium">{service.rate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-6 border-t border-slate-700 flex justify-between">
                <button className="px-4 py-2 bg-slate-700 text-slate-300 font-medium rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  View Assigned Providers
                </button>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-slate-700 text-slate-300 font-medium rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                  <button className="px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    Edit Schedule
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Schedule Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => !saving && setShowCreateModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-800 rounded-xl max-w-2xl w-full max-h-[85vh] overflow-hidden border border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              {!saving && !saved ? (
                <>
                  <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white">Create New Discount Schedule</h2>
                      <p className="text-slate-400 text-sm">Define rates for a group of providers or services</p>
                    </div>
                    <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white p-2 hover:bg-slate-700 rounded-lg">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="p-6 overflow-auto max-h-[60vh] space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Schedule Name *</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                        placeholder="e.g., Primary Care Standard Rates"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Rate Type *</label>
                        <select className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-teal-500">
                          <option value="">Select type...</option>
                          <option>% Off Billed</option>
                          <option>% of Medicare</option>
                          <option>Case Rate</option>
                          <option>Flat Rate</option>
                          <option>Per Diem</option>
                          <option>Fee Schedule</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Default Rate *</label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:border-teal-500"
                          placeholder="e.g., 35% or $150"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                      <textarea 
                        className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:border-teal-500 h-20 resize-none"
                        placeholder="Brief description of this discount schedule..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Provider Type</label>
                      <select className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-teal-500">
                        <option value="">All Provider Types</option>
                        <option>Primary Care</option>
                        <option>Specialists</option>
                        <option>Hospitals/Facilities</option>
                        <option>Urgent Care</option>
                        <option>Imaging Centers</option>
                        <option>Laboratories</option>
                        <option>Mental Health</option>
                      </select>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-slate-300">Service-Specific Rates</label>
                        <button 
                          type="button"
                          onClick={addServiceRow}
                          className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                        >
                          <Plus className="w-4 h-4" />
                          Add Service
                        </button>
                      </div>
                      <div className="space-y-2">
                        {serviceRows.map((row, index) => (
                          <div key={index} className="flex gap-2">
                            <input 
                              type="text" 
                              className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:border-teal-500 text-sm"
                              placeholder="Service name or CPT code"
                              value={row.service}
                              onChange={(e) => {
                                const newRows = [...serviceRows];
                                newRows[index].service = e.target.value;
                                setServiceRows(newRows);
                              }}
                            />
                            <input 
                              type="text" 
                              className="w-32 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:border-teal-500 text-sm"
                              placeholder="Rate"
                              value={row.rate}
                              onChange={(e) => {
                                const newRows = [...serviceRows];
                                newRows[index].rate = e.target.value;
                                setServiceRows(newRows);
                              }}
                            />
                            <button 
                              type="button"
                              onClick={() => removeServiceRow(index)}
                              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                              disabled={serviceRows.length === 1}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-slate-500 mt-2">Leave blank to use default rate for all services</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Effective Date</label>
                      <input 
                        type="date" 
                        className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-teal-500"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="applyToNew" className="rounded bg-slate-600 border-slate-500 text-teal-500 focus:ring-teal-500" />
                      <label htmlFor="applyToNew" className="text-slate-300 text-sm">Automatically apply to new providers of this type</label>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex gap-3">
                      <AlertTriangle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="text-blue-300 font-medium">Rate Changes</p>
                        <p className="text-blue-200/70 mt-1">Existing provider contracts will not be affected. New rates apply only to new contracts or renewals.</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t border-slate-700 flex justify-end gap-3">
                    <button
                      onClick={() => setShowCreateModal(false)}
                      className="px-4 py-2 bg-slate-700 text-slate-300 font-medium rounded-lg hover:bg-slate-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSave}
                      className="px-6 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Create Schedule
                    </button>
                  </div>
                </>
              ) : saving ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-white font-medium">Creating schedule...</p>
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
                  <p className="text-white font-medium">Schedule Created!</p>
                  <p className="text-slate-400 text-sm mt-1">You can now assign providers to this schedule</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
