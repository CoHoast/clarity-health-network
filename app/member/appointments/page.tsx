"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Video,
  Plus,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  X,
  User,
  Stethoscope,
  Building2,
  AlertCircle,
  Search,
  Filter,
} from "lucide-react";

const upcomingAppointments = [
  {
    id: 1,
    provider: "Dr. Michael Roberts",
    specialty: "Primary Care",
    type: "Annual Checkup",
    date: "March 18, 2024",
    time: "10:30 AM",
    location: "Cleveland Family Medicine",
    address: "1234 Health Way, Suite 100",
    isTelehealth: false,
    status: "confirmed",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop",
  },
  {
    id: 2,
    provider: "Dr. Emily Watson",
    specialty: "Dermatology",
    type: "Follow-up Visit",
    date: "March 25, 2024",
    time: "2:00 PM",
    location: "Skin Health Specialists",
    address: "910 Medical Plaza Dr",
    isTelehealth: true,
    status: "confirmed",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100&h=100&fit=crop",
  },
];

const pastAppointments = [
  {
    id: 3,
    provider: "Dr. Sarah Chen",
    specialty: "Primary Care",
    type: "Office Visit",
    date: "March 8, 2024",
    time: "9:00 AM",
    location: "Cleveland Family Medicine",
    status: "completed",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop",
  },
  {
    id: 4,
    provider: "Dr. Lisa Park",
    specialty: "Cardiology",
    type: "Consultation",
    date: "February 28, 2024",
    time: "11:00 AM",
    location: "Heart & Vascular Institute",
    status: "completed",
    image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=100&h=100&fit=crop",
  },
];

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [showCancelModal, setShowCancelModal] = useState<number | null>(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState<number | null>(null);
  const [rescheduleSuccess, setRescheduleSuccess] = useState(false);

  const handleReschedule = () => {
    setRescheduleSuccess(true);
    setTimeout(() => {
      setShowRescheduleModal(null);
      setRescheduleSuccess(false);
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-500 mt-1">Manage your upcoming and past appointments</p>
        </div>
        <Link
          href="/member/find-provider"
          className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Schedule Appointment
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "upcoming"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Upcoming ({upcomingAppointments.length})
        </button>
        <button
          onClick={() => setActiveTab("past")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "past"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Past ({pastAppointments.length})
        </button>
      </div>

      {/* Upcoming Appointments */}
      {activeTab === "upcoming" && (
        <div className="space-y-4">
          {upcomingAppointments.map((appt) => (
            <motion.div
              key={appt.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                {/* Provider Photo */}
                <img
                  src={appt.image}
                  alt={appt.provider}
                  className="w-20 h-20 rounded-xl object-cover shrink-0"
                />

                {/* Info */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{appt.provider}</h3>
                      <p className="text-teal-600">{appt.specialty}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {appt.isTelehealth && (
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full flex items-center gap-1">
                          <Video className="w-3 h-3" /> Telehealth
                        </span>
                      )}
                      <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Confirmed
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 font-medium mb-4">{appt.type}</p>

                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{appt.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{appt.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 sm:col-span-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{appt.location} • {appt.address}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
                  {appt.isTelehealth ? (
                    <button 
                      onClick={() => window.open('https://meet.google.com/demo-call', '_blank')}
                      className="px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2"
                    >
                      <Video className="w-4 h-4" />
                      Join Call
                    </button>
                  ) : (
                    <button 
                      onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(appt.address)}`, '_blank')}
                      className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                    >
                      <MapPin className="w-4 h-4" />
                      Get Directions
                    </button>
                  )}
                  <button 
                    onClick={() => setShowRescheduleModal(appt.id)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Reschedule
                  </button>
                  <button
                    onClick={() => setShowCancelModal(appt.id)}
                    className="px-4 py-2 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {/* Pre-visit checklist */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="font-medium text-gray-900 mb-3">Before Your Visit</h4>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-700">Insurance verified</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-700">Copay: $25</span>
                  </div>
                  <button className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    <span className="text-sm text-amber-700">Complete forms</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {upcomingAppointments.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No upcoming appointments</p>
              <Link
                href="/member/find-provider"
                className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Schedule Appointment
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Past Appointments */}
      {activeTab === "past" && (
        <div className="space-y-4">
          {pastAppointments.map((appt) => (
            <motion.div
              key={appt.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <img
                  src={appt.image}
                  alt={appt.provider}
                  className="w-14 h-14 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{appt.provider}</h3>
                  <p className="text-sm text-gray-500">{appt.specialty} • {appt.type}</p>
                  <p className="text-sm text-gray-400">{appt.date} at {appt.time}</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 text-sm text-teal-600 font-medium hover:bg-teal-50 rounded-lg transition-colors">
                    View Summary
                  </button>
                  <button className="px-3 py-1.5 text-sm bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors">
                    Book Again
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowCancelModal(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Cancel Appointment?</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel this appointment? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(null)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Keep Appointment
                </button>
                <button
                  onClick={() => setShowCancelModal(null)}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                >
                  Yes, Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowRescheduleModal(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {rescheduleSuccess ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Request Sent!</h3>
                <p className="text-gray-600">The provider will contact you to confirm your new appointment time.</p>
              </div>
            ) : (
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Reschedule Appointment</h3>
                <p className="text-gray-600 mb-6">Select your preferred new date and time.</p>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
                    <input 
                      type="date" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                      <option>Morning (8am - 12pm)</option>
                      <option>Afternoon (12pm - 4pm)</option>
                      <option>Late Afternoon (4pm - 6pm)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason (optional)</label>
                    <textarea 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      rows={2}
                      placeholder="Let us know why you need to reschedule..."
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowRescheduleModal(null)}
                    className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReschedule}
                    className="flex-1 px-4 py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    Submit Request
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
