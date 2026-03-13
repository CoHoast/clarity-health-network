"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, MapPin, Phone, Clock, Users, Edit2, Save, CheckCircle, X } from "lucide-react";

const practiceInfoDefault = {
  name: "Cleveland Family Medicine",
  npi: "1234567890",
  taxId: "XX-XXXXXXX",
  type: "Group Practice",
  specialty: "Family Medicine",
  acceptingPatients: true,
  languages: ["English", "Spanish"],
  telehealth: true,
};

const locationsDefault = [
  { id: 1, name: "Main Office", address: "1234 Medical Center Dr, Suite 200", city: "Cleveland, OH 44106", phone: "(216) 555-0100", hours: "Mon-Fri: 8:00 AM - 5:00 PM", primary: true },
  { id: 2, name: "Westside Office", address: "5678 Healthcare Blvd", city: "Lakewood, OH 44107", phone: "(216) 555-0200", hours: "Mon-Thu: 9:00 AM - 6:00 PM", primary: false },
];

const providersDefault = [
  { name: "Dr. Sarah Chen, MD", specialty: "Family Medicine", accepting: true },
  { name: "Dr. James Wilson, DO", specialty: "Internal Medicine", accepting: true },
  { name: "Maria Garcia, NP", specialty: "Family Nurse Practitioner", accepting: false },
];

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [practiceInfo, setPracticeInfo] = useState(practiceInfoDefault);
  const [locations, setLocations] = useState(locationsDefault);
  const [editingLocation, setEditingLocation] = useState<typeof locationsDefault[0] | null>(null);

  const handleSaveAll = () => {
    setSaveSuccess(true);
    setIsEditing(false);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleSaveSection = () => {
    setSaveSuccess(true);
    setEditingSection(null);
    setEditingLocation(null);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Success Toast */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Changes saved successfully!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Practice Profile</h1>
          <p className="text-gray-600">Manage your practice information</p>
        </div>
        <button
          onClick={() => isEditing ? handleSaveAll() : setIsEditing(true)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            isEditing ? "bg-green-600 text-white hover:bg-green-700" : "bg-slate-700 text-white hover:bg-slate-800"
          }`}
        >
          {isEditing ? <><Save className="w-4 h-4" />Save Changes</> : <><Edit2 className="w-4 h-4" />Edit Profile</>}
        </button>
      </div>

      {/* Practice Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-slate-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-slate-200 rounded-xl flex items-center justify-center">
                <Building2 className="w-8 h-8 text-slate-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{practiceInfo.name}</h2>
                <p className="text-gray-500">NPI: {practiceInfo.npi} • Tax ID: {practiceInfo.taxId}</p>
              </div>
            </div>
            {isEditing && (
              <button 
                onClick={() => setEditingSection("practice")}
                className="p-2 text-gray-400 hover:text-slate-600 hover:bg-white rounded-lg"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Practice Type</p>
              <p className="font-semibold text-gray-900">{practiceInfo.type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Primary Specialty</p>
              <p className="font-semibold text-gray-900">{practiceInfo.specialty}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Accepting New Patients</p>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-sm font-medium rounded-full ${practiceInfo.acceptingPatients ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                <CheckCircle className="w-4 h-4" />{practiceInfo.acceptingPatients ? "Yes" : "No"}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Languages</p>
              <p className="font-semibold text-gray-900">{practiceInfo.languages.join(", ")}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Telehealth Services</p>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-sm font-medium rounded-full ${practiceInfo.telehealth ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}>
                <CheckCircle className="w-4 h-4" />{practiceInfo.telehealth ? "Available" : "Not Available"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Locations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Locations</h2>
          {isEditing && <button className="text-slate-600 hover:text-slate-800 text-sm font-medium">+ Add Location</button>}
        </div>
        <div className="divide-y divide-gray-200">
          {locations.map((location) => (
            <div key={location.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{location.name}</h3>
                  {location.primary && <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">Primary</span>}
                </div>
                {isEditing && (
                  <button 
                    onClick={() => setEditingLocation(location)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-900">{location.address}</p>
                    <p className="text-gray-600">{location.city}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">{location.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600 text-sm">{location.hours}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Providers */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Providers</h2>
          {isEditing && <button className="text-slate-600 hover:text-slate-800 text-sm font-medium">+ Add Provider</button>}
        </div>
        <div className="divide-y divide-gray-200">
          {providersDefault.map((provider, index) => (
            <div key={index} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                  <span className="text-slate-600 font-semibold text-sm">{provider.name.split(" ").slice(0, 2).map((n) => n[0]).join("")}</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{provider.name}</p>
                  <p className="text-sm text-gray-500">{provider.specialty}</p>
                </div>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${
                provider.accepting ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
              }`}>
                {provider.accepting ? "Accepting Patients" : "Not Accepting"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Practice Modal */}
      <AnimatePresence>
        {editingSection === "practice" && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setEditingSection(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Edit Practice Information</h3>
                <button onClick={() => setEditingSection(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Practice Name</label>
                  <input
                    type="text"
                    defaultValue={practiceInfo.name}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">NPI</label>
                    <input
                      type="text"
                      defaultValue={practiceInfo.npi}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tax ID</label>
                    <input
                      type="text"
                      defaultValue={practiceInfo.taxId}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Practice Type</label>
                    <select
                      defaultValue={practiceInfo.type}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                    >
                      <option>Solo Practice</option>
                      <option>Group Practice</option>
                      <option>Hospital-Based</option>
                      <option>Clinic</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Primary Specialty</label>
                    <select
                      defaultValue={practiceInfo.specialty}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                    >
                      <option>Family Medicine</option>
                      <option>Internal Medicine</option>
                      <option>Pediatrics</option>
                      <option>OB/GYN</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Languages Spoken</label>
                  <input
                    type="text"
                    defaultValue={practiceInfo.languages.join(", ")}
                    placeholder="e.g., English, Spanish, Mandarin"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                  />
                </div>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked={practiceInfo.acceptingPatients} className="w-4 h-4 text-slate-600 rounded" />
                    <span className="text-sm text-gray-700">Accepting New Patients</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked={practiceInfo.telehealth} className="w-4 h-4 text-slate-600 rounded" />
                    <span className="text-sm text-gray-700">Telehealth Available</span>
                  </label>
                </div>
              </div>
              <div className="px-6 pb-6 flex gap-3">
                <button
                  onClick={() => setEditingSection(null)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSection}
                  className="flex-1 px-4 py-2.5 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Location Modal */}
      <AnimatePresence>
        {editingLocation && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setEditingLocation(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Edit Location</h3>
                <button onClick={() => setEditingLocation(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location Name</label>
                  <input
                    type="text"
                    defaultValue={editingLocation.name}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    defaultValue={editingLocation.address}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City, State ZIP</label>
                  <input
                    type="text"
                    defaultValue={editingLocation.city}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    defaultValue={editingLocation.phone}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Office Hours</label>
                  <input
                    type="text"
                    defaultValue={editingLocation.hours}
                    placeholder="e.g., Mon-Fri: 8:00 AM - 5:00 PM"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked={editingLocation.primary} className="w-4 h-4 text-slate-600 rounded" />
                  <span className="text-sm text-gray-700">Set as Primary Location</span>
                </label>
              </div>
              <div className="px-6 pb-6 flex gap-3">
                <button
                  onClick={() => setEditingLocation(null)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSection}
                  className="flex-1 px-4 py-2.5 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
