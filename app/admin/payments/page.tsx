"use client";

import { useTheme } from "@/components/admin/ThemeContext";
import { cn } from "@/lib/utils";

import { useState } from "react";
import Link from "next/link";
import { Search, Download, Eye, DollarSign, CheckCircle, Clock, Building2, Calendar, FileText, X, CreditCard, Send, Printer, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const payments = [
  { id: "PMT-2024-4521", provider: "Cleveland Family Medicine", npi: "1234567890", amount: 12450.00, claims: 47, method: "ACH", status: "completed", date: "2024-03-11", accountLast4: "4521" },
  { id: "PMT-2024-4520", provider: "Dr. Sarah Chen, MD", npi: "2345678901", amount: 8230.00, claims: 32, method: "ACH", status: "completed", date: "2024-03-04", accountLast4: "7832" },
  { id: "PMT-2024-4519", provider: "Metro Imaging Center", npi: "3456789012", amount: 15100.00, claims: 23, method: "ACH", status: "completed", date: "2024-02-25", accountLast4: "1456" },
  { id: "PMT-2024-4518", provider: "Cleveland Orthopedic", npi: "4567890123", amount: 28750.00, claims: 18, method: "Check", status: "completed", date: "2024-02-18", accountLast4: "N/A" },
  { id: "PMT-2024-4517", provider: "Westlake Urgent Care", npi: "6789012345", amount: 9875.00, claims: 89, method: "ACH", status: "pending", date: "2024-03-15", accountLast4: "9012" },
  { id: "PMT-2024-4516", provider: "Quest Diagnostics", npi: "7890123456", amount: 4520.00, claims: 156, method: "ACH", status: "processing", date: "2024-03-14", accountLast4: "3456" },
  { id: "PMT-2024-4515", provider: "Cleveland Cardiology", npi: "9012345678", amount: 18900.00, claims: 34, method: "ACH", status: "completed", date: "2024-03-10", accountLast4: "7890" },
  { id: "PMT-2024-4514", provider: "Women's Health Center", npi: "0123456789", amount: 7650.00, claims: 28, method: "ACH", status: "completed", date: "2024-03-08", accountLast4: "2345" },
  { id: "PMT-2024-4513", provider: "Physical Therapy Plus", npi: "1122334455", amount: 5340.00, claims: 45, method: "ACH", status: "completed", date: "2024-03-06", accountLast4: "6789" },
  { id: "PMT-2024-4512", provider: "Dr. Amy Foster, MD", npi: "7890123456", amount: 3120.00, claims: 22, method: "ACH", status: "completed", date: "2024-03-03", accountLast4: "1234" },
];

const pendingClaims = [
  { provider: "Cleveland Family Medicine", claims: 52, amount: 14230.00 },
  { provider: "Dr. Sarah Chen, MD", claims: 28, amount: 7450.00 },
  { provider: "Metro Imaging Center", claims: 12, amount: 18900.00 },
  { provider: "Westlake Urgent Care", claims: 67, amount: 8920.00 },
];

export default function PaymentsPage() {
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<typeof payments[0] | null>(null);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [batchStep, setBatchStep] = useState(0);

  const filteredPayments = payments.filter((p) =>
    p.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full"><CheckCircle className="w-3 h-3" />Completed</span>;
      case "pending": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full"><Clock className="w-3 h-3" />Pending</span>;
      case "processing": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full"><Clock className="w-3 h-3" />Processing</span>;
      default: return null;
    }
  };

  const handleCreateBatch = () => {
    setBatchStep(1);
    setTimeout(() => setBatchStep(2), 2000);
    setTimeout(() => { setShowBatchModal(false); setBatchStep(0); }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Provider Payments</h1>
          <p className="text-slate-400">Manage payment batches and remittances</p>
        </div>
        <div className="flex gap-3">
          <a href="/docs/payment-report.pdf" download className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 border border-slate-600">
            <Download className="w-4 h-4" />
            Export
          </a>
          <button onClick={() => setShowBatchModal(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600">
            <Send className="w-4 h-4" />
            Create Batch
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-teal-600 to-blue-600 rounded-xl p-4 shadow-lg">
          <p className="text-2xl font-bold" style={{ color: 'white' }}>$1.24M</p>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>Paid This Month</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-4 shadow-lg">
          <p className="text-2xl font-bold" style={{ color: 'white' }}>$49,500</p>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>Pending</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl p-4 shadow-lg">
          <p className="text-2xl font-bold" style={{ color: 'white' }}>847</p>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>Claims Paid</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-teal-600 rounded-xl p-4 shadow-lg">
          <p className="text-2xl font-bold" style={{ color: 'white' }}>2.1 days</p>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>Avg. Payment Time</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search payments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800 border-b border-slate-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Payment ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Provider</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-400 uppercase">Claims</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Method</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedPayment(payment)}
                      className="font-mono text-sm text-blue-500 hover:text-blue-400 hover:underline"
                    >
                      {payment.id}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-white">{payment.provider}</p>
                      <p className="text-xs text-slate-500">NPI: {payment.npi}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-slate-300">{payment.claims}</td>
                  <td className="px-4 py-3 text-right font-semibold text-white">${payment.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-slate-300">{payment.method}</td>
                  <td className="px-4 py-3 text-slate-400">{payment.date}</td>
                  <td className="px-4 py-3">{getStatusBadge(payment.status)}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setSelectedPayment(payment)} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-600/20 rounded">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Detail Modal */}
      <AnimatePresence>
        {selectedPayment && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedPayment(null)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-700">
                <div>
                  <h2 className="text-lg font-semibold text-white">Payment Details</h2>
                  <p className="text-sm text-slate-400">{selectedPayment.id}</p>
                </div>
                <button onClick={() => setSelectedPayment(null)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(90vh-180px)]">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <h3 className="font-medium text-white mb-3 flex items-center gap-2"><Building2 className="w-4 h-4 text-blue-400" />Provider</h3>
                    <p className="text-white font-medium">{selectedPayment.provider}</p>
                    <p className="text-sm text-slate-400">NPI: {selectedPayment.npi}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <h3 className="font-medium text-white mb-3 flex items-center gap-2"><DollarSign className="w-4 h-4 text-green-400" />Amount</h3>
                    <p className="text-2xl font-bold text-green-400">${selectedPayment.amount.toLocaleString()}</p>
                    <p className="text-sm text-slate-400">{selectedPayment.claims} claims</p>
                  </div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="font-medium text-white mb-3">Payment Information</h3>
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between"><span className="text-slate-400">Method</span><span className="text-white">{selectedPayment.method}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Account</span><span className="text-white">****{selectedPayment.accountLast4}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Date</span><span className="text-white">{selectedPayment.date}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Status</span>{getStatusBadge(selectedPayment.status)}</div>
                  </div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="font-medium text-white mb-3">Claim Summary</h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-slate-400">
                        <th className="text-left py-1">Service Date</th>
                        <th className="text-left py-1">Claim ID</th>
                        <th className="text-right py-1">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-600">
                      <tr><td className="py-2 text-slate-300">03/01/2024</td><td className="py-2 text-blue-500">CLM-8821</td><td className="py-2 text-right text-white">$450.00</td></tr>
                      <tr><td className="py-2 text-slate-300">03/02/2024</td><td className="py-2 text-blue-500">CLM-8834</td><td className="py-2 text-right text-white">$225.00</td></tr>
                      <tr><td className="py-2 text-slate-300">03/03/2024</td><td className="py-2 text-blue-500">CLM-8847</td><td className="py-2 text-right text-white">$180.00</td></tr>
                    </tbody>
                  </table>
                  <p className="text-xs text-slate-500 mt-2">Showing 3 of {selectedPayment.claims} claims</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border-t border-slate-700 bg-slate-800">
                <div className="flex gap-2">
                  <Link 
                    href={`/docs/era?id=${selectedPayment.id}`}
                    target="_blank"
                    className="inline-flex items-center gap-2 px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 text-sm"
                  >
                    <FileText className="w-4 h-4" />View ERA
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                  <button className="inline-flex items-center gap-2 px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 text-sm"><Printer className="w-4 h-4" />Print</button>
                </div>
                <button onClick={() => setSelectedPayment(null)} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 text-sm">Close</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Create Batch Modal */}
      <AnimatePresence>
        {showBatchModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => batchStep === 0 && setShowBatchModal(false)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50">
              <div className="p-6">
                {batchStep === 0 ? (
                  <>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center"><CreditCard className="w-6 h-6 text-blue-500" /></div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Create Payment Batch</h3>
                        <p className="text-sm text-slate-400">Process pending claims</p>
                      </div>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
                      <p className="text-sm text-slate-400 mb-2">Ready to Pay</p>
                      {pendingClaims.map((p, i) => (
                        <div key={i} className="flex items-center justify-between py-2 border-b border-slate-600 last:border-0">
                          <div className="flex items-center gap-2">
                            <input type="checkbox" defaultChecked className="rounded border-slate-500 bg-slate-600 text-blue-600" />
                            <span className="text-white text-sm">{p.provider}</span>
                          </div>
                          <span className="text-green-400 font-medium">${p.amount.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-600/10 border border-blue-600/30 rounded-lg mb-6">
                      <span className="text-blue-300">Total Batch Amount</span>
                      <span className="text-xl font-bold text-blue-500">$49,500.00</span>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setShowBatchModal(false)} className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Cancel</button>
                      <button onClick={handleCreateBatch} className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600">Create Batch</button>
                    </div>
                  </>
                ) : batchStep === 1 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white font-medium">Processing Payment Batch...</p>
                    <p className="text-slate-400 text-sm mt-1">Generating ACH file</p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                    <p className="text-white font-medium">Batch Created Successfully!</p>
                    <p className="text-slate-400 text-sm mt-1">4 payments queued for processing</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
