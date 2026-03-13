"use client";

import { useState } from "react";
import { Search, ChevronRight, Phone, Mail, Calendar, FileText, AlertCircle } from "lucide-react";

const patients = [
  { id: "CHN-123456", name: "John Doe", dob: "03/15/1985", phone: "(216) 555-0123", email: "john.doe@email.com", lastVisit: "2024-02-28", nextAppt: "2024-03-15", status: "Active", balance: 0, alerts: [] },
  { id: "CHN-234567", name: "Sarah Johnson", dob: "07/22/1990", phone: "(216) 555-0456", email: "sarah.j@email.com", lastVisit: "2024-03-01", nextAppt: null, status: "Active", balance: 125.00, alerts: ["Balance due"] },
  { id: "CHN-345678", name: "Michael Chen", dob: "11/08/1978", phone: "(216) 555-0789", email: "m.chen@email.com", lastVisit: "2024-02-15", nextAppt: "2024-03-20", status: "Active", balance: 0, alerts: ["Pre-auth required"] },
  { id: "CHN-456789", name: "Emily Rodriguez", dob: "05/30/1995", phone: "(216) 555-0321", email: "emily.r@email.com", lastVisit: "2024-01-20", nextAppt: null, status: "Active", balance: 50.00, alerts: [] },
  { id: "CHN-567890", name: "Robert Williams", dob: "09/12/1965", phone: "(216) 555-0654", email: "r.williams@email.com", lastVisit: "2024-03-05", nextAppt: "2024-03-25", status: "Active", balance: 0, alerts: ["Chronic care management"] },
];

export default function PatientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<typeof patients[0] | null>(null);

  const filteredPatients = patients.filter(
    (p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                <button className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium">Check Eligibility</button>
                <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">View History</button>
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
    </div>
  );
}
