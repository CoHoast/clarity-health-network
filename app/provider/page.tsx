"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCheck,
  FilePlus,
  DollarSign,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Calendar,
  Users,
  Building2,
  ChevronRight,
  FileSpreadsheet,
  BadgeCheck,
  Bell,
  Zap,
  X,
  Eye,
  Download,
  MessageSquare,
  ExternalLink,
} from "lucide-react";

const stats = [
  { label: "Claims This Month", value: "47", change: "+12%", trend: "up", icon: FileText },
  { label: "Pending Claims", value: "8", change: "-3", trend: "down", icon: Clock },
  { label: "Payments Received", value: "$45,230", change: "+8%", trend: "up", icon: DollarSign },
  { label: "Avg Days to Pay", value: "12", change: "-2 days", trend: "up", icon: TrendingUp },
];

const recentClaims = [
  { id: "CLM-2024-156", patient: "John D.", service: "Office Visit (99213)", amount: 92, status: "paid", date: "Mar 12", paidAmount: 92, paidDate: "Mar 14" },
  { id: "CLM-2024-155", patient: "Sarah M.", service: "New Patient (99203)", amount: 112, status: "processing", date: "Mar 11", paidAmount: null, paidDate: null },
  { id: "CLM-2024-154", patient: "Mike R.", service: "Follow-up (99214)", amount: 138, status: "paid", date: "Mar 10", paidAmount: 138, paidDate: "Mar 13" },
  { id: "CLM-2024-153", patient: "Lisa K.", service: "Annual Wellness", amount: 175, status: "pending", date: "Mar 10", paidAmount: null, paidDate: null },
  { id: "CLM-2024-152", patient: "Tom B.", service: "Office Visit (99213)", amount: 92, status: "denied", date: "Mar 9", paidAmount: 0, paidDate: null, denialReason: "Missing modifier - 25" },
];

const alerts = [
  { id: 1, type: "warning", title: "Credentialing Renewal", message: "Dr. Roberts' credentialing expires in 90 days", action: "Review", link: "/provider/credentialing" },
  { id: 2, type: "info", title: "New Payment Received", message: "$12,450 deposited to your account", action: "View", link: "/provider/payments" },
  { id: 3, type: "error", title: "Claim Denied", message: "CLM-2024-152 denied - missing modifier", action: "Appeal", claimId: "CLM-2024-152" },
];

const quickActions = [
  { icon: UserCheck, label: "Check Eligibility", href: "/provider/eligibility", color: "slate" },
  { icon: FilePlus, label: "Submit Claim", href: "/provider/submit-claim", color: "blue" },
  { icon: DollarSign, label: "View Payments", href: "/provider/payments", color: "green" },
  { icon: FileSpreadsheet, label: "Fee Schedule", href: "/provider/fee-schedule", color: "purple" },
];

export default function ProviderDashboard() {
  const [showClaimDetail, setShowClaimDetail] = useState<typeof recentClaims[0] | null>(null);
  const [showAppealModal, setShowAppealModal] = useState(false);
  const [showPulseChat, setShowPulseChat] = useState(false);
  const [appealSubmitted, setAppealSubmitted] = useState(false);
  
  const handleAppeal = () => {
    setAppealSubmitted(true);
    setTimeout(() => {
      setShowAppealModal(false);
      setAppealSubmitted(false);
      setShowClaimDetail(null);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Provider Dashboard</h1>
          <p className="text-gray-500 mt-1">Cleveland Family Medicine • NPI: 1234567890</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/provider/submit-claim"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
          >
            <FilePlus className="w-4 h-4" />
            Submit Claim
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-slate-600" />
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  stat.trend === "up" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                }`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, i) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              href={action.href}
              className="flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-gray-200 hover:border-slate-300 hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-slate-700 group-hover:scale-110 transition-all">
                <Icon className="w-6 h-6 text-slate-600 group-hover:text-white" />
              </div>
              <span className="font-medium text-gray-900">{action.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Claims */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent Claims</h2>
            <Link href="/provider/claims" className="text-sm text-slate-600 hover:text-slate-700 font-medium flex items-center gap-1">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentClaims.map((claim) => (
              <div 
                key={claim.id} 
                className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setShowClaimDetail(claim)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{claim.patient}</p>
                      <p className="text-sm text-gray-500">{claim.service}</p>
                      <p className="text-xs text-gray-400">{claim.id} • {claim.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${claim.amount}</p>
                    {claim.status === "paid" && (
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Paid</span>
                    )}
                    {claim.status === "processing" && (
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Processing</span>
                    )}
                    {claim.status === "pending" && (
                      <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Pending</span>
                    )}
                    {claim.status === "denied" && (
                      <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Denied</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Alerts</h2>
            <span className="w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
          </div>
          <div className="divide-y divide-gray-100">
            {alerts.map((alert) => (
              <div key={alert.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    alert.type === "warning" ? "bg-amber-100" :
                    alert.type === "info" ? "bg-blue-100" : "bg-red-100"
                  }`}>
                    {alert.type === "warning" && <AlertCircle className="w-4 h-4 text-amber-600" />}
                    {alert.type === "info" && <Bell className="w-4 h-4 text-blue-600" />}
                    {alert.type === "error" && <AlertCircle className="w-4 h-4 text-red-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{alert.title}</p>
                    <p className="text-sm text-gray-500">{alert.message}</p>
                    {alert.link ? (
                      <Link href={alert.link} className="text-sm text-slate-600 font-medium mt-1 hover:text-slate-700 inline-block">
                        {alert.action} →
                      </Link>
                    ) : alert.claimId ? (
                      <button 
                        onClick={() => {
                          const claim = recentClaims.find(c => c.id === alert.claimId);
                          if (claim) {
                            setShowClaimDetail(claim);
                            setShowAppealModal(true);
                          }
                        }}
                        className="text-sm text-slate-600 font-medium mt-1 hover:text-slate-700"
                      >
                        {alert.action} →
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Summary & Performance */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Payment Summary */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Payment Summary</h2>
            <Link href="/provider/payments" className="text-sm text-slate-600 hover:text-slate-700 font-medium">
              View Details
            </Link>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-sm text-green-700 mb-1">Last Payment</p>
                <p className="text-2xl font-bold text-green-700">$12,450</p>
                <p className="text-xs text-green-600">Mar 10, 2024</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm text-slate-700 mb-1">Pending</p>
                <p className="text-2xl font-bold text-slate-700">$8,320</p>
                <p className="text-xs text-slate-600">8 claims</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">MTD Payments</span>
                <span className="font-medium text-gray-900">$45,230</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">YTD Payments</span>
                <span className="font-medium text-gray-900">$128,450</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Avg Payment Time</span>
                <span className="font-medium text-green-600">12 days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Practice Info */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Practice Overview</h2>
            <Link href="/provider/profile" className="text-sm text-slate-600 hover:text-slate-700 font-medium">
              Edit Profile
            </Link>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center">
                <Building2 className="w-8 h-8 text-slate-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Cleveland Family Medicine</p>
                <p className="text-sm text-gray-500">1234 Health Way, Suite 100</p>
                <p className="text-sm text-gray-500">Cleveland, OH 44101</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Users className="w-5 h-5 text-slate-600" />
                <div>
                  <p className="font-medium text-gray-900">4</p>
                  <p className="text-xs text-gray-500">Providers</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <BadgeCheck className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">Active</p>
                  <p className="text-xs text-gray-500">Network Status</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pulse AI Promo */}
      <div className="bg-slate-800 rounded-2xl p-6 lg:p-8 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-700 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
        <div className="relative flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="w-16 h-16 bg-slate-700 rounded-2xl flex items-center justify-center shrink-0">
            <Zap className="w-8 h-8 text-yellow-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">Need Help? Ask Pulse AI</h3>
            <p className="text-slate-300 mb-4 lg:mb-0">
              Get instant answers about eligibility, claims, payments, fee schedules, and more. 
              Available 24/7 for provider support.
            </p>
          </div>
          <button 
            onClick={() => setShowPulseChat(true)}
            className="px-6 py-3 bg-white text-slate-800 font-semibold rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-2 shrink-0"
          >
            <Zap className="w-5 h-5" />
            Chat with Pulse
          </button>
        </div>
      </div>

      {/* Claim Detail Modal */}
      <AnimatePresence>
        {showClaimDetail && !showAppealModal && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowClaimDetail(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Claim Details</h3>
                  <p className="text-sm text-gray-500">{showClaimDetail.id}</p>
                </div>
                <button onClick={() => setShowClaimDetail(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Status */}
                <div className="flex items-center gap-3">
                  {showClaimDetail.status === "paid" && (
                    <span className="px-3 py-1.5 bg-green-50 text-green-700 font-medium rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Paid
                    </span>
                  )}
                  {showClaimDetail.status === "processing" && (
                    <span className="px-3 py-1.5 bg-blue-50 text-blue-700 font-medium rounded-full flex items-center gap-1">
                      <Clock className="w-4 h-4" /> Processing
                    </span>
                  )}
                  {showClaimDetail.status === "pending" && (
                    <span className="px-3 py-1.5 bg-amber-50 text-amber-700 font-medium rounded-full flex items-center gap-1">
                      <Clock className="w-4 h-4" /> Pending
                    </span>
                  )}
                  {showClaimDetail.status === "denied" && (
                    <span className="px-3 py-1.5 bg-red-50 text-red-700 font-medium rounded-full flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> Denied
                    </span>
                  )}
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Patient</p>
                    <p className="font-medium text-gray-900">{showClaimDetail.patient}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Service Date</p>
                    <p className="font-medium text-gray-900">{showClaimDetail.date}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Service</p>
                    <p className="font-medium text-gray-900">{showClaimDetail.service}</p>
                  </div>
                </div>

                {/* Amounts */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Billed Amount</span>
                    <span className="font-medium text-gray-900">${showClaimDetail.amount}</span>
                  </div>
                  {showClaimDetail.paidAmount !== null && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Paid Amount</span>
                      <span className={`font-medium ${showClaimDetail.paidAmount > 0 ? "text-green-600" : "text-red-600"}`}>
                        ${showClaimDetail.paidAmount}
                      </span>
                    </div>
                  )}
                  {showClaimDetail.paidDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Date</span>
                      <span className="text-gray-900">{showClaimDetail.paidDate}</span>
                    </div>
                  )}
                </div>

                {/* Denial Reason */}
                {showClaimDetail.status === "denied" && showClaimDetail.denialReason && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                      <div>
                        <p className="font-medium text-red-900">Denial Reason</p>
                        <p className="text-sm text-red-700">{showClaimDetail.denialReason}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
                {showClaimDetail.status === "denied" && (
                  <button
                    onClick={() => setShowAppealModal(true)}
                    className="flex-1 px-4 py-2.5 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    File Appeal
                  </button>
                )}
                {showClaimDetail.status === "paid" && (
                  <Link
                    href="/docs/eob"
                    className="flex-1 px-4 py-2.5 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors text-center flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    View ERA
                  </Link>
                )}
                <button
                  onClick={() => setShowClaimDetail(null)}
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Appeal Modal */}
      <AnimatePresence>
        {showAppealModal && showClaimDetail && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAppealModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {appealSubmitted ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Appeal Submitted!</h3>
                  <p className="text-gray-600">Your appeal for {showClaimDetail.id} has been submitted. You'll receive a response within 30 days.</p>
                </div>
              ) : (
                <>
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">File Appeal</h3>
                    <p className="text-sm text-gray-500">{showClaimDetail.id}</p>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-700">
                        <strong>Denial Reason:</strong> {showClaimDetail.denialReason}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Appeal Reason</label>
                      <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500">
                        <option>Missing documentation provided</option>
                        <option>Coding error corrected</option>
                        <option>Medical necessity documentation</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                      <textarea
                        rows={3}
                        placeholder="Provide additional context..."
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none"
                      />
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                      <p><strong>Note:</strong> Appeals are typically reviewed within 30 days. Supporting documentation can be uploaded after submission.</p>
                    </div>
                  </div>
                  <div className="px-6 pb-6 flex gap-3">
                    <button
                      onClick={() => setShowAppealModal(false)}
                      className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAppeal}
                      className="flex-1 px-4 py-2.5 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      Submit Appeal
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
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-600 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Pulse AI</h3>
                    <p className="text-xs text-slate-300">Provider Support</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowPulseChat(false)}
                  className="p-2 hover:bg-slate-600 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
                <div className="bg-white rounded-lg p-4 shadow-sm max-w-[85%]">
                  <p className="text-gray-900">Hi! 👋 I'm Pulse, your provider support assistant. How can I help you today?</p>
                  <p className="text-xs text-gray-400 mt-2">Just now</p>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4">
                  {["Check eligibility", "Claim status", "Fee schedule", "Payment info"].map((suggestion) => (
                    <button
                      key={suggestion}
                      className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-slate-300 hover:bg-slate-50 transition-colors text-left"
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
                    className="flex-1 px-4 py-2.5 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500"
                  />
                  <button className="p-2.5 bg-slate-700 text-white rounded-xl hover:bg-slate-800 transition-colors">
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
