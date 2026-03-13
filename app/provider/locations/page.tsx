"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Plus, Edit, Trash2, Clock, Phone, Globe, CheckCircle, X, Building2, Users } from "lucide-react";

const locations = [
  { 
    id: "LOC-001", 
    name: "Main Office", 
    address: "123 Medical Center Dr, Suite 100", 
    city: "Cleveland", 
    state: "OH", 
    zip: "44101",
    phone: "(555) 123-4567",
    fax: "(555) 123-4568",
    type: "Primary",
    status: "active",
    providers: 3,
    hours: { mon: "8:00 AM - 5:00 PM", tue: "8:00 AM - 5:00 PM", wed: "8:00 AM - 5:00 PM", thu: "8:00 AM - 5:00 PM", fri: "8:00 AM - 4:00 PM", sat: "Closed", sun: "Closed" },
    acceptingNew: true,
    wheelchair: true,
    parking: true
  },
  { 
    id: "LOC-002", 
    name: "Westside Clinic", 
    address: "456 Health Ave", 
    city: "Lakewood", 
    state: "OH", 
    zip: "44107",
    phone: "(555) 234-5678",
    fax: "(555) 234-5679",
    type: "Satellite",
    status: "active",
    providers: 2,
    hours: { mon: "9:00 AM - 6:00 PM", tue: "9:00 AM - 6:00 PM", wed: "9:00 AM - 6:00 PM", thu: "9:00 AM - 6:00 PM", fri: "9:00 AM - 5:00 PM", sat: "9:00 AM - 1:00 PM", sun: "Closed" },
    acceptingNew: true,
    wheelchair: true,
    parking: false
  },
  { 
    id: "LOC-003", 
    name: "East Campus", 
    address: "789 Wellness Blvd", 
    city: "Beachwood", 
    state: "OH", 
    zip: "44122",
    phone: "(555) 345-6789",
    fax: "(555) 345-6790",
    type: "Satellite",
    status: "inactive",
    providers: 0,
    hours: { mon: "Closed", tue: "Closed", wed: "Closed", thu: "Closed", fri: "Closed", sat: "Closed", sun: "Closed" },
    acceptingNew: false,
    wheelchair: true,
    parking: true
  },
];

export default function LocationsPage() {
  const [selectedLocation, setSelectedLocation] = useState<typeof locations[0] | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<typeof locations[0] | null>(null);
  const [actionSuccess, setActionSuccess] = useState(false);

  const handleSave = () => {
    setActionSuccess(true);
    setTimeout(() => {
      setActionSuccess(false);
      setShowAddModal(false);
      setShowEditModal(null);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Practice Locations</h1>
          <p className="text-gray-500 mt-1">Manage your practice locations and hours</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Location
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-2xl font-bold text-gray-900">{locations.filter(l => l.status === "active").length}</p>
          <p className="text-sm text-gray-500">Active Locations</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-2xl font-bold text-slate-600">{locations.reduce((sum, l) => sum + l.providers, 0)}</p>
          <p className="text-sm text-gray-500">Total Providers</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-2xl font-bold text-green-600">{locations.filter(l => l.acceptingNew).length}</p>
          <p className="text-sm text-gray-500">Accepting New Patients</p>
        </div>
      </div>

      {/* Locations Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {locations.map((location) => (
          <div
            key={location.id}
            className={`bg-white rounded-xl border shadow-sm overflow-hidden ${
              location.status === "active" ? "border-gray-200" : "border-gray-300 opacity-60"
            }`}
          >
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    location.type === "Primary" ? "bg-slate-100" : "bg-blue-50"
                  }`}>
                    <Building2 className={`w-5 h-5 ${location.type === "Primary" ? "text-slate-600" : "text-blue-600"}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{location.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      location.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                    }`}>
                      {location.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <span>{location.address}, {location.city}, {location.state} {location.zip}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{location.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span>{location.providers} providers</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setSelectedLocation(location)}
                  className="flex-1 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  View Details
                </button>
                <button
                  onClick={() => setShowEditModal(location)}
                  className="p-2 text-gray-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Location Detail Modal */}
      <AnimatePresence>
        {selectedLocation && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedLocation(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedLocation.name}</h3>
                  <p className="text-sm text-gray-500">{selectedLocation.id}</p>
                </div>
                <button onClick={() => setSelectedLocation(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Address */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-500" />Address
                  </h4>
                  <p className="text-gray-700">{selectedLocation.address}</p>
                  <p className="text-gray-700">{selectedLocation.city}, {selectedLocation.state} {selectedLocation.zip}</p>
                </div>

                {/* Contact */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{selectedLocation.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fax</p>
                    <p className="font-medium text-gray-900">{selectedLocation.fax}</p>
                  </div>
                </div>

                {/* Hours */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-500" />Office Hours
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-sm">
                    {Object.entries(selectedLocation.hours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between">
                        <span className="text-gray-500 capitalize">{day}</span>
                        <span className={hours === "Closed" ? "text-gray-400" : "text-gray-900"}>{hours}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-2">
                  {selectedLocation.acceptingNew && (
                    <span className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />Accepting New Patients
                    </span>
                  )}
                  {selectedLocation.wheelchair && (
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">Wheelchair Accessible</span>
                  )}
                  {selectedLocation.parking && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">Parking Available</span>
                  )}
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
                <button
                  onClick={() => { setSelectedLocation(null); setShowEditModal(selectedLocation); }}
                  className="flex-1 px-4 py-2.5 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />Edit Location
                </button>
                <button onClick={() => setSelectedLocation(null)} className="px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add/Edit Location Modal */}
      <AnimatePresence>
        {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => { setShowAddModal(false); setShowEditModal(null); }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {actionSuccess ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Location Saved!</h3>
                  <p className="text-gray-600">Your changes have been saved successfully.</p>
                </div>
              ) : (
                <>
                  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">{showEditModal ? "Edit Location" : "Add New Location"}</h3>
                    <button onClick={() => { setShowAddModal(false); setShowEditModal(null); }} className="p-1 hover:bg-gray-100 rounded-lg">
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location Name</label>
                      <input type="text" defaultValue={showEditModal?.name || ""} placeholder="e.g., Main Office" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                      <input type="text" defaultValue={showEditModal?.address || ""} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-500" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input type="text" defaultValue={showEditModal?.city || ""} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                        <input type="text" defaultValue={showEditModal?.state || "OH"} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ZIP</label>
                        <input type="text" defaultValue={showEditModal?.zip || ""} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-500" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input type="tel" defaultValue={showEditModal?.phone || ""} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fax</label>
                        <input type="tel" defaultValue={showEditModal?.fax || ""} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location Type</label>
                      <select defaultValue={showEditModal?.type || "Satellite"} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-500">
                        <option>Primary</option>
                        <option>Satellite</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked={showEditModal?.acceptingNew ?? true} className="rounded text-slate-600" />
                        <span className="text-sm text-gray-700">Accepting new patients</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked={showEditModal?.wheelchair ?? true} className="rounded text-slate-600" />
                        <span className="text-sm text-gray-700">Wheelchair accessible</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked={showEditModal?.parking ?? false} className="rounded text-slate-600" />
                        <span className="text-sm text-gray-700">Parking available</span>
                      </label>
                    </div>
                  </div>
                  <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
                    <button onClick={() => { setShowAddModal(false); setShowEditModal(null); }} className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">
                      Cancel
                    </button>
                    <button onClick={handleSave} className="flex-1 px-4 py-2.5 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors">
                      Save Location
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
