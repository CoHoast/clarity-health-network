"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  Download,
  Calendar,
  TrendingUp,
  CheckCircle2,
  FileText,
  ChevronRight,
  CreditCard,
  Building2,
  ArrowDownRight,
  ArrowUpRight,
  Filter,
  X,
  Eye,
  Printer,
  ExternalLink,
} from "lucide-react";

const payments = [
  { 
    id: "PAY-2024-045", 
    date: "Mar 10, 2024", 
    amount: 12450.00, 
    claims: 15, 
    method: "ACH", 
    status: "completed",
    checkNumber: "123456789",
    depositDate: "Mar 11, 2024",
    claimsList: [
      { id: "CLM-2024-140", patient: "John D.", service: "Office Visit", billed: 92, paid: 92 },
      { id: "CLM-2024-141", patient: "Sarah M.", service: "New Patient", billed: 112, paid: 112 },
      { id: "CLM-2024-142", patient: "Mike R.", service: "Follow-up", billed: 138, paid: 138 },
      { id: "CLM-2024-143", patient: "Lisa K.", service: "Wellness Visit", billed: 175, paid: 175 },
      { id: "CLM-2024-144", patient: "Tom B.", service: "Office Visit", billed: 92, paid: 92 },
    ]
  },
  { 
    id: "PAY-2024-044", 
    date: "Feb 25, 2024", 
    amount: 9875.50, 
    claims: 12, 
    method: "ACH", 
    status: "completed",
    checkNumber: "123456788",
    depositDate: "Feb 26, 2024",
    claimsList: []
  },
  { 
    id: "PAY-2024-043", 
    date: "Feb 10, 2024", 
    amount: 15230.00, 
    claims: 18, 
    method: "ACH", 
    status: "completed",
    checkNumber: "123456787",
    depositDate: "Feb 11, 2024",
    claimsList: []
  },
  { 
    id: "PAY-2024-042", 
    date: "Jan 25, 2024", 
    amount: 11340.75, 
    claims: 14, 
    method: "ACH", 
    status: "completed",
    checkNumber: "123456786",
    depositDate: "Jan 26, 2024",
    claimsList: []
  },
  { 
    id: "PAY-2024-041", 
    date: "Jan 10, 2024", 
    amount: 8920.00, 
    claims: 11, 
    method: "ACH", 
    status: "completed",
    checkNumber: "123456785",
    depositDate: "Jan 11, 2024",
    claimsList: []
  },
];

const pendingClaims = [
  { id: "CLM-2024-155", patient: "Sarah Miller", service: "New Patient Visit", amount: 112, submitted: "Mar 11" },
  { id: "CLM-2024-153", patient: "Lisa Kim", service: "Wellness Visit", amount: 175, submitted: "Mar 10" },
  { id: "CLM-2024-157", patient: "David Park", service: "Follow-up Visit", amount: 138, submitted: "Mar 12" },
];

export default function PaymentsPage() {
  const [selectedPayment, setSelectedPayment] = useState<typeof payments[0] | null>(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);

  const totalMTD = payments.filter(p => p.date.includes("Mar")).reduce((sum, p) => sum + p.amount, 0);
  const totalYTD = payments.reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = pendingClaims.reduce((sum, c) => sum + c.amount, 0);

  const handleDownload = () => {
    setDownloadStarted(true);
    setTimeout(() => {
      setShowDownloadModal(false);
      setDownloadStarted(false);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-500 mt-1">View payment history and download remittance reports</p>
        </div>
        <button 
          onClick={() => setShowDownloadModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download ERA
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-5 text-white"
        >
          <div className="flex items-center justify-between mb-3">
            <DollarSign className="w-8 h-8 text-green-200" />
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Last Payment</span>
          </div>
          <p className="text-3xl font-bold">${payments[0].amount.toLocaleString()}</p>
          <p className="text-green-100 text-sm">{payments[0].date}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-gray-200 p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs text-green-600 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> +12%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">${totalMTD.toLocaleString()}</p>
          <p className="text-gray-500 text-sm">Month to Date</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-gray-200 p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">${totalYTD.toLocaleString()}</p>
          <p className="text-gray-500 text-sm">Year to Date</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-gray-200 p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">${pendingAmount}</p>
          <p className="text-gray-500 text-sm">Pending ({pendingClaims.length} claims)</p>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Payment History */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Payment History</h2>
            <button className="text-sm text-slate-600 font-medium flex items-center gap-1">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setSelectedPayment(payment)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">${payment.amount.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">{payment.date} • {payment.claims} claims</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {payment.method}
                  </span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Claims */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Pending Claims</h2>
            <p className="text-sm text-gray-500">Claims awaiting payment</p>
          </div>
          <div className="divide-y divide-gray-100">
            {pendingClaims.map((claim) => (
              <Link href="/provider/claims" key={claim.id} className="block px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-gray-900">{claim.patient}</p>
                  <p className="font-medium text-gray-900">${claim.amount}</p>
                </div>
                <p className="text-sm text-gray-500">{claim.service}</p>
                <p className="text-xs text-gray-400 mt-1">{claim.id} • Submitted {claim.submitted}</p>
              </Link>
            ))}
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">Total Pending</span>
              <span className="font-bold text-gray-900">${pendingAmount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bank Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900 mb-4">Payment Method</h2>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center">
            <Building2 className="w-7 h-7 text-slate-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">First National Bank</p>
            <p className="text-gray-500">Account ending in ****4567</p>
            <p className="text-sm text-gray-400">ACH Direct Deposit • Payments every 14 days</p>
          </div>
          <button 
            onClick={() => setShowBankModal(true)}
            className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg border border-gray-200"
          >
            Update
          </button>
        </div>
      </div>

      {/* Payment Detail Modal */}
      <AnimatePresence>
        {selectedPayment && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPayment(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Payment Details</h3>
                  <p className="text-sm text-gray-500">{selectedPayment.id}</p>
                </div>
                <button onClick={() => setSelectedPayment(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                {/* Amount */}
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-green-600 mb-1">Payment Amount</p>
                  <p className="text-3xl font-bold text-green-700">${selectedPayment.amount.toLocaleString()}</p>
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full mt-2">
                    <CheckCircle2 className="w-3 h-3" /> Completed
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Payment Date</p>
                    <p className="font-medium text-gray-900">{selectedPayment.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Deposit Date</p>
                    <p className="font-medium text-gray-900">{selectedPayment.depositDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Check/Trace Number</p>
                    <p className="font-mono text-gray-900">{selectedPayment.checkNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="font-medium text-gray-900">{selectedPayment.method}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Claims Included</p>
                    <p className="font-medium text-gray-900">{selectedPayment.claims} claims</p>
                  </div>
                </div>

                {/* Claims List */}
                {selectedPayment.claimsList && selectedPayment.claimsList.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Included Claims</h4>
                    <div className="bg-gray-50 rounded-xl overflow-hidden">
                      <div className="divide-y divide-gray-200">
                        {selectedPayment.claimsList.map((claim) => (
                          <div key={claim.id} className="px-4 py-3 flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{claim.patient}</p>
                              <p className="text-sm text-gray-500">{claim.service}</p>
                              <p className="text-xs text-gray-400">{claim.id}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-green-600">${claim.paid}</p>
                              <p className="text-xs text-gray-400">of ${claim.billed}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {selectedPayment.claims > selectedPayment.claimsList.length && (
                      <p className="text-sm text-gray-500 mt-2 text-center">
                        + {selectedPayment.claims - selectedPayment.claimsList.length} more claims
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
                <Link
                  href="/docs/eob"
                  className="flex-1 px-4 py-2.5 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors text-center flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download ERA
                </Link>
                <button className="px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Download ERA Modal */}
      <AnimatePresence>
        {showDownloadModal && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDownloadModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {downloadStarted ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Download Started!</h3>
                  <p className="text-gray-600">Your ERA file is being downloaded.</p>
                </div>
              ) : (
                <>
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">Download ERA</h3>
                    <p className="text-sm text-gray-500">Electronic Remittance Advice</p>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Payment</label>
                      <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500">
                        {payments.map(p => (
                          <option key={p.id} value={p.id}>{p.id} - ${p.amount.toLocaleString()} ({p.date})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                      <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500">
                        <option>835 (Electronic)</option>
                        <option>PDF Report</option>
                        <option>CSV</option>
                      </select>
                    </div>
                  </div>
                  <div className="px-6 pb-6 flex gap-3">
                    <button
                      onClick={() => setShowDownloadModal(false)}
                      className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDownload}
                      className="flex-1 px-4 py-2.5 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Update Bank Modal */}
      <AnimatePresence>
        {showBankModal && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowBankModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Update Payment Method</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700">
                  Changes to banking information require verification. Please contact Provider Relations to update your payment method.
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <Building2 className="w-8 h-8 text-slate-600" />
                  <div>
                    <p className="font-medium text-gray-900">Current: First National Bank</p>
                    <p className="text-sm text-gray-500">****4567</p>
                  </div>
                </div>
              </div>
              <div className="px-6 pb-6 flex gap-3">
                <button
                  onClick={() => setShowBankModal(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                <button
                  className="flex-1 px-4 py-2.5 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Contact Support
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
