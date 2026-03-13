"use client";

import { useState } from "react";
import { Building2, MapPin, Phone, Clock, Users, Edit2, Save, CheckCircle } from "lucide-react";

const practiceInfo = {
  name: "Cleveland Family Medicine",
  npi: "1234567890",
  taxId: "XX-XXXXXXX",
  type: "Group Practice",
  specialty: "Family Medicine",
  acceptingPatients: true,
  languages: ["English", "Spanish"],
  telehealth: true,
};

const locations = [
  { id: 1, name: "Main Office", address: "1234 Medical Center Dr, Suite 200", city: "Cleveland, OH 44106", phone: "(216) 555-0100", hours: "Mon-Fri: 8:00 AM - 5:00 PM", primary: true },
  { id: 2, name: "Westside Office", address: "5678 Healthcare Blvd", city: "Lakewood, OH 44107", phone: "(216) 555-0200", hours: "Mon-Thu: 9:00 AM - 6:00 PM", primary: false },
];

const providers = [
  { name: "Dr. Sarah Chen, MD", specialty: "Family Medicine", accepting: true },
  { name: "Dr. James Wilson, DO", specialty: "Internal Medicine", accepting: true },
  { name: "Maria Garcia, NP", specialty: "Family Nurse Practitioner", accepting: false },
];

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Practice Profile</h1>
          <p className="text-gray-600">Manage your practice information</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
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
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-slate-200 rounded-xl flex items-center justify-center">
              <Building2 className="w-8 h-8 text-slate-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{practiceInfo.name}</h2>
              <p className="text-gray-500">NPI: {practiceInfo.npi} • Tax ID: {practiceInfo.taxId}</p>
            </div>
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
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                <CheckCircle className="w-4 h-4" />Yes
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Languages</p>
              <p className="font-semibold text-gray-900">{practiceInfo.languages.join(", ")}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Telehealth Services</p>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                <CheckCircle className="w-4 h-4" />Available
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
                {isEditing && <button className="text-gray-400 hover:text-gray-600"><Edit2 className="w-4 h-4" /></button>}
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
          {providers.map((provider, index) => (
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
    </div>
  );
}
