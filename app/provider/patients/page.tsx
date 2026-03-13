"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronRight, Phone, Mail, Calendar, FileText, AlertCircle, X, CheckCircle, Clock, Shield, DollarSign, User } from "lucide-react";

const patients = [
  { id: "CHN-123456", name: "John Doe", dob: "03/15/1985", phone: "(216) 555-0123", email: "john.doe@email.com", lastVisit: "2024-02-28", nextAppt: "2024-03-15", status: "Active", balance: 0, alerts: [], plan: "Clarity Health PPO", group: "GRP-78901", deductible: { met: 325, total: 500 }, oopMax: { met: 980, total: 3500 } },
  { id: "CHN-234567", name: "Sarah Johnson", dob: "07/22/1990", phone: "(216) 555-0456", email: "sarah.j@email.com", lastVisit: "2024-03-01", nextAppt: null, status: "Active", balance: 125.00, alerts: ["Balance due"], plan: "Clarity Health PPO", group: "GRP-45678", deductible: { met: 500, total: 500 }, oopMax: { met: 1200, total: 3500 } },
  { id: "CHN-345678", name: "Michael Chen", dob: "11/08/1978", phone: "(216) 555-0789", email: "m.chen@email.com", lastVisit: "2024-02-15", nextAppt: "2024-03-20", status: "Active", balance: 0, alerts: ["Pre-auth required"], plan: "Clarity Health PPO", group: "GRP-12345", deductible: { met: 0, total: 1000 }, oopMax: { met: 0, total: 5000 } },
  { id: "CHN-456789", name: "Emily Rodriguez", dob: "05/30/1995", phone: "(216) 555-0321", email: "emily.r@email.com", lastVisit: "2024-01-20", nextAppt: null, status: "Active", balance: 50.00, alerts: [], plan: "Clarity Health HMO", group: "GRP-99999", deductible: { met: 250, total: 250 }, oopMax: { met: 750, total: 2500 } },
  { id: "CHN-567890", name: "Robert Williams", dob: "09/12/1965", phone: "(216) 555-0654", email: "r.williams@email.com", lastVisit: "2024-03-05", nextAppt: "2024-03-25", status: "Active", balance: 0, alerts: ["Chronic care management"], plan: "Clarity Health PPO", group: "GRP-78901", deductible: { met: 500, total: 500 }, oopMax: { met: 2100, total: 3500 } },
];

const visitHistory = [
  { date: "2024-02-28", type: "Office Visit", provider: "Dr. Sarah Chen", diagnosis: "Annual wellness exam", cpt: "99395", status: "Paid" },
  { date: "2024-01-15", type: "Lab Work", provider: "Quest Diagnostics", diagnosis: "Routine bloodwork", cpt: "80053", status: "Paid" },
  { date: "2023-11-20", type: "Office Visit", provider: "Dr. Sarah Chen", diagnosis: "Upper respiratory infection", cpt: "99213", status: "Paid" },
  { date: "2023-09-05", type: "Specialist Referral", provider: "Dr. Lisa Park (Cardio)", diagnosis: "Cardiac consultation", cpt: "99243", status: "Paid" },
  { date: "2023-06-10", type: "Office Visit", provider: "Dr. Sarah Chen", diagnosis: "Follow-up visit", cpt: "99214", status: "Paid" },
];

export default function PatientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<typeof patients[0] | null>(null);
  const [showEligibilityModal, setShowEligibilityModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [eligibilityChecked, setEligibilityChecked] = useState(false);

  const filteredPatients = patients.filter(
    (p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCheckEligibility = () => {
    setShowEligibilityModal(true);
    setEligibilityChecked(false);
    // Simulate checking
    setTimeout(() => setEligibilityChecked(true), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
        <p className="text-gray-600">View and manage your Clarity Health Network patients</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or member ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
              />
            </div>
          </div>

          {/* List */}
          <div className="divide-y divide-gray-200">
            {filteredPatients.map((patient) => (
              <button
                key={patient.id}
                onClick={() => setSelectedPatient(patient)}
                className={`w-full p-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between ${selectedPatient?.id === patient.id ? "bg-slate-50" : ""}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                    <span className="text-slate-600 font-semibold text-sm">{patient.name.split(" ").map((n) => n[0]).join("")}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{patient.name}</p>
                    <p className="text-sm text-gray-500">ID: {patient.id} • DOB: {patient.dob}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {patient.alerts.length > 0 && <span className="w-2 h-2 bg-amber-500 rounded-full" />}
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Patient Detail */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {selectedPatient ? (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-slate-600 font-bold text-xl">{selectedPatient.name.split(" ").map((n) => n[0]).join("")}</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900">{selectedPatient.name}</h2>
                <p className="text-gray-500">Member ID: {selectedPatient.id}</p>
              </div>

              {selectedPatient.alerts.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-800">Alerts</p>
                      <ul className="text-sm text-amber-700 mt-1">
                        {selectedPatient.alerts.map((alert, i) => <li key={i}>• {alert}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span>DOB: {selectedPatient.dob}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span>{selectedPatient.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span>{selectedPatient.email}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Visit</span>
                  <span className="font-medium">{selectedPatient.lastVisit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Next Appointment</span>
                  <span className="font-medium">{selectedPatient.nextAppt || "None scheduled"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Balance Due</span>
                  <span className={`font-medium ${selectedPatient.balance > 0 ? "text-red-600" : "text-green-600"}`}>${selectedPatient.balance.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={handleCheckEligibility}
                  className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium"
                >
                  Check Eligibility
                </button>
                <button 
                  onClick={() => setShowHistoryModal(true)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  View History
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Select a patient to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Eligibility Modal */}
      <AnimatePresence>
        {showEligibilityModal && selectedPatient && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowEligibilityModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Eligibility Verification</h3>
                <button onClick={() => setShowEligibilityModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6">
                {!eligibilityChecked ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-600 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Checking eligibility...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Status */}
                    <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                      <div>
                        <p className="font-semibold text-green-800">Eligible & Active</p>
                        <p className="text-sm text-green-600">Coverage verified as of today</p>
                      </div>
                    </div>

                    {/* Member Info */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-500">Member:</span>
                        <span className="font-medium text-gray-900">{selectedPatient.name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Shield className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-500">Plan:</span>
                        <span className="font-medium text-gray-900">{selectedPatient.plan}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-500">Group:</span>
                        <span className="font-medium text-gray-900">{selectedPatient.group}</span>
                      </div>
                    </div>

                    {/* Benefits */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Benefits Summary</h4>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Deductible</span>
                          <span className="font-medium">${selectedPatient.deductible.met} / ${selectedPatient.deductible.total}</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-slate-600 rounded-full" 
                            style={{ width: `${(selectedPatient.deductible.met / selectedPatient.deductible.total) * 100}%` }} 
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Out-of-Pocket Max</span>
                          <span className="font-medium">${selectedPatient.oopMax.met} / ${selectedPatient.oopMax.total}</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-slate-600 rounded-full" 
                            style={{ width: `${(selectedPatient.oopMax.met / selectedPatient.oopMax.total) * 100}%` }} 
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 pt-2">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-lg font-bold text-gray-900">$25</p>
                          <p className="text-xs text-gray-500">PCP Copay</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-lg font-bold text-gray-900">$50</p>
                          <p className="text-xs text-gray-500">Specialist</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-lg font-bold text-gray-900">20%</p>
                          <p className="text-xs text-gray-500">Coinsurance</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => setShowEligibilityModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                {eligibilityChecked && (
                  <button className="px-4 py-2 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors">
                    Print Verification
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* History Modal */}
      <AnimatePresence>
        {showHistoryModal && selectedPatient && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowHistoryModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Visit History</h3>
                  <p className="text-sm text-gray-500">{selectedPatient.name} • {selectedPatient.id}</p>
                </div>
                <button onClick={() => setShowHistoryModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Provider</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Diagnosis</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {visitHistory.map((visit, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{visit.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{visit.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{visit.provider}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{visit.diagnosis}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            {visit.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                <p className="text-sm text-gray-500">Showing {visitHistory.length} visits</p>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
