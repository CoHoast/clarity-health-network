"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Heart,
  FileText,
  Search,
  Calculator,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Stethoscope,
  Activity,
  Pill,
  Shield,
  Zap,
  Bell,
  ChevronRight,
  Star,
  MapPin,
  Phone,
  X,
  Video,
  ExternalLink,
  Download,
  Smartphone,
} from "lucide-react";

const quickActions = [
  { icon: CreditCard, label: "View ID Card", href: "/member/id-card", color: "teal" },
  { icon: Search, label: "Find Provider", href: "/member/find-provider", color: "emerald" },
  { icon: FileText, label: "View Claims", href: "/member/claims", color: "blue" },
  { icon: Calculator, label: "Cost Estimator", href: "/member/cost-estimator", color: "purple" },
];

const recentClaims = [
  { id: "CLM-2024-001", provider: "Dr. Sarah Chen", service: "Office Visit", date: "Mar 8, 2024", amount: 150, status: "processed", youOwe: 25 },
  { id: "CLM-2024-002", provider: "LabCorp", service: "Blood Work", date: "Mar 5, 2024", amount: 245, status: "processing", youOwe: null },
  { id: "CLM-2024-003", provider: "CVS Pharmacy", service: "Prescription", date: "Mar 1, 2024", amount: 45, status: "completed", youOwe: 10 },
];

const upcomingAppointments = [
  { 
    id: 1,
    provider: "Dr. Michael Roberts", 
    specialty: "Primary Care", 
    date: "Mar 18, 2024", 
    time: "10:30 AM", 
    type: "Annual Checkup",
    location: "Cleveland Family Medicine",
    address: "1234 Health Way, Suite 100",
    phone: "(216) 555-0150",
    isTelehealth: false,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop",
  },
  { 
    id: 2,
    provider: "Dr. Emily Watson", 
    specialty: "Dermatology", 
    date: "Mar 25, 2024", 
    time: "2:00 PM", 
    type: "Follow-up",
    location: "Skin Health Specialists",
    address: "910 Medical Plaza Dr",
    phone: "(216) 555-0175",
    isTelehealth: true,
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100&h=100&fit=crop",
  },
];

const notifications = [
  { type: "info", title: "Claim Processed", message: "Your claim for Dr. Chen has been processed.", time: "2h ago" },
  { type: "action", title: "Preventive Care Reminder", message: "You're due for your annual wellness visit.", time: "1d ago" },
  { type: "success", title: "ID Card Ready", message: "Your new digital ID card is available.", time: "3d ago" },
];

export default function MemberDashboard() {
  const [selectedAppointment, setSelectedAppointment] = useState<typeof upcomingAppointments[0] | null>(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showPulseChat, setShowPulseChat] = useState(false);
  const [walletAdded, setWalletAdded] = useState(false);

  const handleAddToWallet = () => {
    setWalletAdded(true);
    setTimeout(() => {
      setShowWalletModal(false);
      setWalletAdded(false);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome back, John</h1>
          <p className="text-gray-500 mt-1">Here's your healthcare dashboard at a glance.</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/member/find-provider"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-400 to-teal-500 text-white font-medium rounded-lg hover:from-teal-600 hover:to-emerald-600 transition-colors"
          >
            <Search className="w-4 h-4" />
            Find a Doctor
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-cyan-600" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              65% used
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">$325</p>
          <p className="text-sm text-gray-500">of $500 deductible</p>
          <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-400 to-teal-500 rounded-full" style={{ width: "65%" }} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              28% used
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">$980</p>
          <p className="text-sm text-gray-500">of $3,500 OOP max</p>
          <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full" style={{ width: "28%" }} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">3</p>
          <p className="text-sm text-gray-500">Claims this month</p>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-green-600 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> 2 processed
            </span>
            <span className="text-xs text-amber-600 flex items-center gap-1">
              <Clock className="w-3 h-3" /> 1 pending
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">$847</p>
          <p className="text-sm text-gray-500">Saved this year</p>
          <div className="mt-3 flex items-center gap-1 text-xs text-green-600">
            <TrendingUp className="w-3 h-3" />
            <span>+12% vs last year</span>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, i) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
          >
            <Link
              href={action.href}
              className="flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-gray-200 hover:border-teal-300 hover:shadow-md transition-all group"
            >
              <div className={`w-12 h-12 bg-${action.color}-100 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <action.icon className={`w-6 h-6 text-${action.color}-600`} />
              </div>
              <span className="font-medium text-gray-900">{action.label}</span>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Claims */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent Claims</h2>
            <Link href="/member/claims" className="text-sm text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentClaims.map((claim) => (
              <Link
                key={claim.id}
                href={`/member/claims/${claim.id}`}
                className="block px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Stethoscope className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{claim.provider}</p>
                      <p className="text-sm text-gray-500">{claim.service} • {claim.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${claim.amount}</p>
                    <div className="flex items-center gap-2">
                      {claim.status === "processed" && (
                        <>
                          <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Processed
                          </span>
                          {claim.youOwe !== null && (
                            <span className="text-xs text-gray-600">You owe: ${claim.youOwe}</span>
                          )}
                        </>
                      )}
                      {claim.status === "processing" && (
                        <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Processing
                        </span>
                      )}
                      {claim.status === "completed" && (
                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Completed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Notifications & Reminders */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Notifications</h2>
            <span className="w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
          </div>
          <div className="divide-y divide-gray-100">
            {notifications.map((notif, i) => (
              <div key={i} className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    notif.type === "info" ? "bg-blue-100" :
                    notif.type === "action" ? "bg-amber-100" : "bg-green-100"
                  }`}>
                    {notif.type === "info" && <Bell className="w-4 h-4 text-blue-600" />}
                    {notif.type === "action" && <AlertCircle className="w-4 h-4 text-amber-600" />}
                    {notif.type === "success" && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm">{notif.title}</p>
                    <p className="text-sm text-gray-500 truncate">{notif.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Appointments & Digital ID */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upcoming Appointments */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Upcoming Appointments</h2>
            <Link href="/member/appointments" className="text-sm text-cyan-600 hover:text-cyan-700 font-medium">
              View All
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {upcomingAppointments.map((appt) => (
              <div key={appt.id} className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{appt.provider}</p>
                      {appt.isTelehealth && (
                        <span className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <Video className="w-3 h-3" /> Video
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{appt.specialty} • {appt.type}</p>
                    <p className="text-sm text-cyan-600 mt-1">{appt.date} at {appt.time}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedAppointment(appt)}
                    className="px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
            {upcomingAppointments.length === 0 && (
              <div className="px-6 py-8 text-center">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No upcoming appointments</p>
                <Link href="/member/find-provider" className="text-sm text-cyan-600 hover:text-cyan-700 font-medium mt-2 inline-block">
                  Schedule one now
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Digital ID Card Preview */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Your ID Card</h2>
            <Link href="/member/id-card" className="text-sm text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1">
              View Full Card <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="p-6">
            <div className="bg-gradient-to-br from-cyan-400 to-teal-600 rounded-xl p-5 text-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5" />
                  </div>
                  <span className="font-bold">MedCare Health</span>
                </div>
                <span className="text-xs bg-white/20 px-2 py-1 rounded">PPO</span>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-teal-100 text-xs">Member Name</p>
                  <p className="font-semibold">John Doe</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-teal-100 text-xs">Member ID</p>
                    <p className="font-mono">CHN-123456</p>
                  </div>
                  <div>
                    <p className="text-teal-100 text-xs">Group #</p>
                    <p className="font-mono">GRP-78901</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <Link
                href="/docs/id-card"
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors text-sm text-center flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </Link>
              <button 
                onClick={() => setShowWalletModal(true)}
                className="flex-1 px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors text-sm flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4" />
                Add to Wallet
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pulse AI Promo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-sky-900 to-sky-950 rounded-2xl p-6 lg:p-8 text-white overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-teal-500/20 to-emerald-500/20 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-teal-400 rounded-2xl flex items-center justify-center shrink-0">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">Need Help? Ask Pulse AI</h3>
            <p className="text-gray-400 mb-4 lg:mb-0">
              Your personal healthcare assistant is available 24/7 to answer questions about benefits, 
              find providers, estimate costs, and more.
            </p>
          </div>
          <button 
            type="button"
            onClick={() => {
              console.log('Opening Pulse chat');
              setShowPulseChat(true);
            }}
            className="px-6 py-3 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <MessageSquare className="w-5 h-5" />
            Chat with Pulse
          </button>
        </div>
      </motion.div>

      {/* Appointment Detail Modal */}
      <AnimatePresence>
        {selectedAppointment && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedAppointment(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Appointment Details</h3>
                <button 
                  onClick={() => setSelectedAppointment(null)}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Provider Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={selectedAppointment.image}
                    alt={selectedAppointment.provider}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{selectedAppointment.provider}</h4>
                    <p className="text-cyan-600">{selectedAppointment.specialty}</p>
                    {selectedAppointment.isTelehealth && (
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full inline-flex items-center gap-1 mt-1">
                        <Video className="w-3 h-3" /> Telehealth Visit
                      </span>
                    )}
                  </div>
                </div>

                {/* Visit Details */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Date & Time</p>
                      <p className="font-medium text-gray-900">{selectedAppointment.date} at {selectedAppointment.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Visit Type</p>
                      <p className="font-medium text-gray-900">{selectedAppointment.type}</p>
                    </div>
                  </div>
                  {!selectedAppointment.isTelehealth && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium text-gray-900">{selectedAppointment.location}</p>
                        <p className="text-sm text-gray-500">{selectedAppointment.address}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900">{selectedAppointment.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Copay Info */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">Estimated Copay: $25</p>
                    <p className="text-sm text-green-700">Based on your in-network benefits</p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
                {selectedAppointment.isTelehealth ? (
                  <button 
                    onClick={() => window.open('https://meet.google.com/demo-call', '_blank')}
                    className="flex-1 px-4 py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Video className="w-4 h-4" />
                    Join Video Call
                  </button>
                ) : (
                  <button 
                    onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedAppointment.address)}`, '_blank')}
                    className="flex-1 px-4 py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <MapPin className="w-4 h-4" />
                    Get Directions
                  </button>
                )}
                <Link
                  href="/member/appointments"
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Manage
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add to Wallet Modal */}
      <AnimatePresence>
        {showWalletModal && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowWalletModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {walletAdded ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Added to Wallet!</h3>
                  <p className="text-gray-600">Your ID card has been added to Apple Wallet.</p>
                </div>
              ) : (
                <>
                  <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Smartphone className="w-8 h-8 text-gray-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Add to Digital Wallet</h3>
                    <p className="text-gray-600">
                      Add your health ID card to Apple Wallet or Google Pay for quick access.
                    </p>
                  </div>
                  <div className="px-6 pb-6 space-y-3">
                    <button
                      onClick={handleAddToWallet}
                      className="w-full px-4 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                      Add to Apple Wallet
                    </button>
                    <button
                      onClick={handleAddToWallet}
                      className="w-full px-4 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 2H4a2 2 0 00-2 2v16a2 2 0 002 2h16a2 2 0 002-2V4a2 2 0 00-2-2zm-2 6l-6 8-4-4-2 2 6 6 8-10-2-2z"/>
                      </svg>
                      Add to Google Pay
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Pulse Chat Slide-in Panel */}
      <AnimatePresence>
        {showPulseChat && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => setShowPulseChat(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-cyan-400 to-teal-500">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Pulse AI</h3>
                    <p className="text-xs text-teal-100">Your health assistant</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowPulseChat(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
                <div className="bg-white rounded-lg p-4 shadow-sm max-w-[85%]">
                  <p className="text-gray-900">Hi John! 👋 I'm Pulse, your AI health assistant. How can I help you today?</p>
                  <p className="text-xs text-gray-400 mt-2">Just now</p>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4">
                  {["Check my benefits", "Find a doctor", "Estimate costs", "Track a claim"].map((suggestion) => (
                    <button
                      key={suggestion}
                      className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-teal-300 hover:bg-teal-50 transition-colors text-left"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Ask Pulse anything..."
                    className="flex-1 px-4 py-2.5 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <button className="p-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors">
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
