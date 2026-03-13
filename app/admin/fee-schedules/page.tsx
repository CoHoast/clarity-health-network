"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Download, Eye, Upload, Plus, Search, X, CheckCircle, FileText, Edit, Trash2, Calendar } from "lucide-react";

const feeSchedules = [
  { id: "FS-001", name: "Primary Care", type: "% of Medicare", rate: "120%", providers: 234, effective: "2024-01-01", lastUpdated: "2024-03-01", codes: 1245 },
  { id: "FS-002", name: "Specialty Care", type: "% of Medicare", rate: "125%", providers: 156, effective: "2024-01-01", lastUpdated: "2024-03-05", codes: 2341 },
  { id: "FS-003", name: "Facility/Hospital", type: "Case Rate", rate: "Varies", providers: 45, effective: "2024-01-01", lastUpdated: "2024-02-15", codes: 3456 },
  { id: "FS-004", name: "Imaging Services", type: "% of Medicare", rate: "110%", providers: 89, effective: "2024-01-01", lastUpdated: "2024-03-01", codes: 567 },
  { id: "FS-005", name: "Urgent Care", type: "% of Medicare", rate: "110%", providers: 67, effective: "2024-01-01", lastUpdated: "2024-02-28", codes: 423 },
  { id: "FS-006", name: "Lab Services", type: "% of Medicare", rate: "100%", providers: 34, effective: "2024-01-01", lastUpdated: "2024-03-10", codes: 890 },
];

const recentUpdates = [
  { schedule: "Primary Care", change: "2024 Medicare rates applied", date: "2024-03-01", impact: "+2.3%" },
  { schedule: "Specialty Care", change: "Added new telehealth codes", date: "2024-03-05", impact: "8 codes" },
  { schedule: "Lab Services", change: "Updated reference lab rates", date: "2024-03-10", impact: "-1.2%" },
  { schedule: "Imaging Services", change: "MRI reimbursement adjusted", date: "2024-02-15", impact: "+4.5%" },
];

const sampleCodes = [
  { code: "99213", description: "Office visit, established patient", medicare: 92, rate: 110.40 },
  { code: "99214", description: "Office visit, detailed", medicare: 138, rate: 165.60 },
  { code: "99215", description: "Office visit, complex", medicare: 186, rate: 223.20 },
  { code: "99203", description: "New patient, low complexity", medicare: 112, rate: 134.40 },
  { code: "99204", description: "New patient, moderate complexity", medicare: 172, rate: 206.40 },
];

export default function FeeSchedulesPage() {
  const [selectedSchedule, setSelectedSchedule] = useState<typeof feeSchedules[0] | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState<typeof recentUpdates[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleUpload = () => {
    setUploadSuccess(true);
    setTimeout(() => {
      setShowUploadModal(false);
      setUploadSuccess(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Fee Schedules</h1>
          <p className="text-slate-400">Manage contracted reimbursement rates</p>
        </div>
        <div className="flex gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 hover:bg-slate-600">
            <Download className="w-4 h-4" />
            Export All
          </button>
          <button 
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <Upload className="w-4 h-4" />
            Upload Schedule
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-white">6</p>
          <p className="text-sm text-slate-400">Fee Schedules</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-purple-400">8,922</p>
          <p className="text-sm text-slate-400">Total Codes</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-green-400">625</p>
          <p className="text-sm text-slate-400">Providers Covered</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-amber-400">4</p>
          <p className="text-sm text-slate-400">Updates This Month</p>
        </div>
      </div>

      {/* Fee Schedules Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {feeSchedules.map((schedule) => (
          <button
            key={schedule.id}
            onClick={() => setSelectedSchedule(schedule)}
            className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 text-left hover:border-purple-500/50 transition-colors"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Calculator className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">{schedule.name}</h3>
                <p className="text-xs text-slate-500">{schedule.id}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Rate Type</span>
                <span className="text-white">{schedule.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Rate</span>
                <span className="text-purple-400 font-medium">{schedule.rate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Providers</span>
                <span className="text-white">{schedule.providers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Codes</span>
                <span className="text-white">{schedule.codes.toLocaleString()}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-700">
              <p className="text-xs text-slate-500">Last updated: {schedule.lastUpdated}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Recent Updates */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-white">Recent Updates</h2>
        </div>
        <div className="divide-y divide-slate-700">
          {recentUpdates.map((update, i) => (
            <button
              key={i}
              onClick={() => setShowUpdateModal(update)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800/80 transition-colors text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-white">{update.schedule}</p>
                  <p className="text-sm text-slate-400">{update.change}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-purple-400 font-medium">{update.impact}</p>
                <p className="text-xs text-slate-500">{update.date}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Fee Schedule Detail Modal */}
      <AnimatePresence>
        {selectedSchedule && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedSchedule(null)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Calculator className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">{selectedSchedule.name}</h2>
                    <p className="text-sm text-slate-400">{selectedSchedule.id} • {selectedSchedule.rate} {selectedSchedule.type}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedSchedule(null)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 overflow-y-auto max-h-[calc(90vh-180px)]">
                {/* Summary */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-white">{selectedSchedule.codes.toLocaleString()}</p>
                    <p className="text-xs text-slate-400">Codes</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-white">{selectedSchedule.providers}</p>
                    <p className="text-xs text-slate-400">Providers</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-purple-400">{selectedSchedule.rate}</p>
                    <p className="text-xs text-slate-400">Rate</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-green-400">Active</p>
                    <p className="text-xs text-slate-400">Status</p>
                  </div>
                </div>

                {/* Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search codes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Sample Codes */}
                <div className="bg-slate-700/30 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Code</th>
                        <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Description</th>
                        <th className="px-4 py-3 text-right text-xs text-slate-400 uppercase">Medicare</th>
                        <th className="px-4 py-3 text-right text-xs text-slate-400 uppercase">Your Rate</th>
                        <th className="px-4 py-3 text-right text-xs text-slate-400 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {sampleCodes.map((code) => (
                        <tr key={code.code} className="hover:bg-slate-700/50">
                          <td className="px-4 py-3 font-mono text-purple-400">{code.code}</td>
                          <td className="px-4 py-3 text-white">{code.description}</td>
                          <td className="px-4 py-3 text-right text-slate-400">${code.medicare}</td>
                          <td className="px-4 py-3 text-right text-green-400 font-medium">${code.rate.toFixed(2)}</td>
                          <td className="px-4 py-3 text-right">
                            <button className="p-1 text-slate-400 hover:text-purple-400"><Edit className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-center text-sm text-slate-500 mt-4">Showing 5 of {selectedSchedule.codes.toLocaleString()} codes</p>
              </div>
              <div className="flex items-center justify-between p-4 border-t border-slate-700 bg-slate-800">
                <div className="flex gap-2">
                  <button className="inline-flex items-center gap-2 px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 text-sm">
                    <Download className="w-4 h-4" />Export CSV
                  </button>
                  <button className="inline-flex items-center gap-2 px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 text-sm">
                    <Upload className="w-4 h-4" />Upload Update
                  </button>
                </div>
                <button onClick={() => setSelectedSchedule(null)} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Update Detail Modal */}
      <AnimatePresence>
        {showUpdateModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowUpdateModal(null)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50">
              <div className="p-4 border-b border-slate-700">
                <h3 className="text-lg font-semibold text-white">Update Details</h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    <span className="text-white font-medium">{showUpdateModal.schedule}</span>
                  </div>
                  <p className="text-slate-300">{showUpdateModal.change}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <p className="text-sm text-slate-400">Date</p>
                    <p className="text-white font-medium">{showUpdateModal.date}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <p className="text-sm text-slate-400">Impact</p>
                    <p className="text-purple-400 font-medium">{showUpdateModal.impact}</p>
                  </div>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-sm text-blue-400">This update was applied automatically based on the 2024 Medicare fee schedule release.</p>
                </div>
              </div>
              <div className="flex gap-2 p-4 border-t border-slate-700">
                <button onClick={() => setShowUpdateModal(null)} className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Close</button>
                <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">View Schedule</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowUploadModal(false)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50">
              {uploadSuccess ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Upload Complete!</h3>
                  <p className="text-slate-400">Fee schedule has been updated successfully.</p>
                </div>
              ) : (
                <>
                  <div className="p-4 border-b border-slate-700">
                    <h3 className="text-lg font-semibold text-white">Upload Fee Schedule</h3>
                  </div>
                  <div className="p-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Fee Schedule</label>
                      <select className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                        {feeSchedules.map(fs => <option key={fs.id}>{fs.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Effective Date</label>
                      <input type="date" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" />
                    </div>
                    <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center hover:border-purple-500/50 transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="font-medium text-white">Drag & drop or click to upload</p>
                      <p className="text-sm text-slate-500 mt-1">CSV or Excel file</p>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                      <p className="text-sm text-blue-400">File must include columns: CPT Code, Description, Rate</p>
                    </div>
                  </div>
                  <div className="flex gap-2 p-4 border-t border-slate-700">
                    <button onClick={() => setShowUploadModal(false)} className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Cancel</button>
                    <button onClick={handleUpload} className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Upload</button>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
