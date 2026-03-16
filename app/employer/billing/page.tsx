"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Download, CreditCard, CheckCircle, Clock, AlertTriangle, 
  X, Check, Building2, Plus, Trash2, Eye, FileText
} from "lucide-react";

const invoices = [
  { id: "INV-4521", date: "Mar 1, 2026", dueDate: "Mar 15, 2026", amount: 142850.00, status: "pending" },
  { id: "INV-4520", date: "Feb 1, 2026", dueDate: "Feb 15, 2026", amount: 141230.00, status: "paid", paidDate: "Feb 12, 2026" },
  { id: "INV-4519", date: "Jan 1, 2026", dueDate: "Jan 15, 2026", amount: 139875.00, status: "paid", paidDate: "Jan 10, 2026" },
  { id: "INV-4518", date: "Dec 1, 2025", dueDate: "Dec 15, 2025", amount: 138500.00, status: "paid", paidDate: "Dec 8, 2025" },
  { id: "INV-4517", date: "Nov 1, 2025", dueDate: "Nov 15, 2025", amount: 137250.00, status: "paid", paidDate: "Nov 14, 2025" },
];

const paymentMethods = [
  { id: "ACH-001", type: "ACH", name: "Business Checking", last4: "4521", bank: "Chase Bank", isPrimary: true },
  { id: "ACH-002", type: "ACH", name: "Payroll Account", last4: "8823", bank: "Bank of America", isPrimary: false },
];

const currentInvoice = invoices[0];

export default function BillingPage() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState<string | null>(null);
  const [showPaymentMethodsModal, setShowPaymentMethodsModal] = useState(false);
  const [showAddMethodModal, setShowAddMethodModal] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [autoPayEnabled, setAutoPayEnabled] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full"><CheckCircle className="w-3 h-3" />Paid</span>;
      case "pending": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-full"><Clock className="w-3 h-3" />Pending</span>;
      case "overdue": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full"><AlertTriangle className="w-3 h-3" />Overdue</span>;
      default: return null;
    }
  };

  const handlePayNow = () => {
    setPaymentComplete(true);
    setTimeout(() => {
      setShowPaymentModal(false);
      setPaymentComplete(false);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing & Invoices</h1>
          <p className="text-gray-500">View and pay invoices, manage payment methods</p>
        </div>
        <button 
          onClick={() => setShowPaymentMethodsModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 border border-gray-300"
        >
          <CreditCard className="w-4 h-4" />
          Payment Methods
        </button>
      </div>

      {/* Current Invoice */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-xl p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <p className="text-teal-100 text-sm">Current Invoice</p>
            <p className="text-3xl font-bold mt-1">${currentInvoice.amount.toLocaleString()}</p>
            <p className="text-teal-100 mt-2">Invoice #{currentInvoice.id} • Due {currentInvoice.dueDate}</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowInvoiceModal(currentInvoice.id)}
              className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 font-medium"
            >
              View Details
            </button>
            <button 
              onClick={() => setShowPaymentModal(true)}
              className="px-6 py-2 bg-white text-teal-600 rounded-lg hover:bg-teal-50 font-medium"
            >
              Pay Now
            </button>
          </div>
        </div>
      </div>

      {/* Invoice Breakdown */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Invoice Breakdown - {currentInvoice.id}</h2>
            <button className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1">
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
          <div className="p-4 space-y-4">
            {[
              { item: "Medical Premium", description: "847 employees × Gold PPO", amount: 128565, perEmployee: 151.79 },
              { item: "Dental Premium", description: "847 employees", amount: 8475, perEmployee: 10.01 },
              { item: "Vision Premium", description: "847 employees", amount: 4235, perEmployee: 5.00 },
              { item: "Administrative Fee", description: "Per employee per month", amount: 1575, perEmployee: 1.86 },
            ].map((line) => (
              <div key={line.item} className="flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors">
                <div>
                  <p className="font-medium text-gray-900">{line.item}</p>
                  <p className="text-sm text-gray-500">{line.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">${line.amount.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">${line.perEmployee}/emp</p>
                </div>
              </div>
            ))}
            <hr className="border-gray-200" />
            <div className="flex items-center justify-between py-2">
              <p className="font-semibold text-gray-900">Total Due</p>
              <p className="text-xl font-bold text-teal-600">${currentInvoice.amount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Payment Method</h3>
            <button 
              onClick={() => setShowPaymentMethodsModal(true)}
              className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Bank Account (ACH)</p>
                <p className="text-sm text-gray-500">••••4521</p>
              </div>
              <span className="text-xs text-teal-600 font-medium">Change</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Auto-Pay</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700">Automatic payments</p>
                <p className="text-xs text-gray-500">Pay on due date</p>
              </div>
              <button
                onClick={() => setAutoPayEnabled(!autoPayEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  autoPayEnabled ? "bg-teal-500" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow ${
                    autoPayEnabled ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
            {autoPayEnabled && (
              <p className="mt-3 text-xs text-green-600 bg-green-50 rounded-lg p-2">
                ✓ Auto-pay enabled. Your invoice will be paid automatically on the due date.
              </p>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <h3 className="font-semibold text-gray-900 mb-3">YTD Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Total Paid (YTD)</span>
                <span className="font-medium text-gray-900">$421,105</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Invoices (YTD)</span>
                <span className="font-medium text-gray-900">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Avg Monthly</span>
                <span className="font-medium text-gray-900">$140,368</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice History */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Invoice History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Invoice</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Due Date</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <button 
                      onClick={() => setShowInvoiceModal(inv.id)}
                      className="font-medium text-gray-900 hover:text-teal-600"
                    >
                      {inv.id}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{inv.date}</td>
                  <td className="px-4 py-3 text-gray-700">{inv.dueDate}</td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">${inv.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">{getStatusBadge(inv.status)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setShowInvoiceModal(inv.id)}
                        className="p-1.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-1.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pay Now Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => !paymentComplete && setShowPaymentModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full"
            >
              {paymentComplete ? (
                <div className="p-8 text-center">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <Check className="w-10 h-10 text-green-600" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Submitted!</h3>
                  <p className="text-gray-500 mb-4">Invoice {currentInvoice.id} will be processed within 1-2 business days.</p>
                  <div className="text-sm text-gray-400">Confirmation #ACH-2026-0312-4521</div>
                </div>
              ) : (
                <>
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Pay Invoice</h3>
                    <button onClick={() => setShowPaymentModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600">Invoice</span>
                        <span className="font-medium text-gray-900">{currentInvoice.id}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Amount Due</span>
                        <span className="text-2xl font-bold text-gray-900">${currentInvoice.amount.toLocaleString()}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                      <div className="space-y-2">
                        {paymentMethods.map((method) => (
                          <label key={method.id} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                            <input 
                              type="radio" 
                              name="paymentMethod" 
                              defaultChecked={method.isPrimary}
                              className="text-teal-600 focus:ring-teal-500" 
                            />
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Building2 className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{method.name}</p>
                              <p className="text-sm text-gray-500">{method.bank} ••••{method.last4}</p>
                            </div>
                            {method.isPrimary && (
                              <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded">Primary</span>
                            )}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-3 flex items-start gap-3">
                      <CreditCard className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-blue-700">ACH payments are processed within 1-2 business days with no additional fees.</p>
                    </div>
                  </div>
                  <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
                    <button 
                      onClick={() => setShowPaymentModal(false)}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handlePayNow}
                      className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium"
                    >
                      Pay ${currentInvoice.amount.toLocaleString()}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invoice Detail Modal */}
      <AnimatePresence>
        {showInvoiceModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowInvoiceModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {(() => {
                const invoice = invoices.find(i => i.id === showInvoiceModal);
                if (!invoice) return null;
                return (
                  <>
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Invoice {invoice.id}</h3>
                        <p className="text-sm text-gray-500">Issued {invoice.date}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(invoice.status)}
                        <button onClick={() => setShowInvoiceModal(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                          <X className="w-5 h-5 text-gray-500" />
                        </button>
                      </div>
                    </div>
                    <div className="p-6 space-y-6">
                      {/* Invoice Header */}
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-900">TrueCare Health Network</p>
                          <p className="text-sm text-gray-500">123 Healthcare Ave</p>
                          <p className="text-sm text-gray-500">San Francisco, CA 94102</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">Bill To:</p>
                          <p className="text-sm text-gray-500">Acme Corporation</p>
                          <p className="text-sm text-gray-500">Group #12345</p>
                        </div>
                      </div>

                      {/* Line Items */}
                      <div className="border rounded-xl overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Description</th>
                              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Qty</th>
                              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Rate</th>
                              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Amount</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            <tr>
                              <td className="px-4 py-3 text-gray-900">Medical Premium - Gold PPO</td>
                              <td className="px-4 py-3 text-right text-gray-700">847</td>
                              <td className="px-4 py-3 text-right text-gray-700">$151.79</td>
                              <td className="px-4 py-3 text-right font-medium text-gray-900">$128,565.13</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 text-gray-900">Dental Premium</td>
                              <td className="px-4 py-3 text-right text-gray-700">847</td>
                              <td className="px-4 py-3 text-right text-gray-700">$10.01</td>
                              <td className="px-4 py-3 text-right font-medium text-gray-900">$8,478.47</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 text-gray-900">Vision Premium</td>
                              <td className="px-4 py-3 text-right text-gray-700">847</td>
                              <td className="px-4 py-3 text-right text-gray-700">$5.00</td>
                              <td className="px-4 py-3 text-right font-medium text-gray-900">$4,235.00</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 text-gray-900">Administrative Fee</td>
                              <td className="px-4 py-3 text-right text-gray-700">847</td>
                              <td className="px-4 py-3 text-right text-gray-700">$1.86</td>
                              <td className="px-4 py-3 text-right font-medium text-gray-900">$1,571.40</td>
                            </tr>
                          </tbody>
                          <tfoot className="bg-gray-50">
                            <tr>
                              <td colSpan={3} className="px-4 py-3 text-right font-semibold text-gray-900">Total</td>
                              <td className="px-4 py-3 text-right text-xl font-bold text-teal-600">${invoice.amount.toLocaleString()}</td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>

                      {/* Payment Info */}
                      {invoice.status === "paid" ? (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                            <div>
                              <p className="font-medium text-green-800">Payment Received</p>
                              <p className="text-sm text-green-600">Paid on {invoice.paidDate} via ACH ••••4521</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Clock className="w-6 h-6 text-teal-600" />
                              <div>
                                <p className="font-medium text-teal-800">Payment Due</p>
                                <p className="text-sm text-teal-600">Due on {invoice.dueDate}</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => { setShowInvoiceModal(null); setShowPaymentModal(true); }}
                              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium"
                            >
                              Pay Now
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-6 border-t border-gray-100 flex gap-3 justify-end sticky bottom-0 bg-white">
                      <button 
                        onClick={() => setShowInvoiceModal(null)}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                      >
                        Close
                      </button>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download PDF
                      </button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Methods Modal */}
      <AnimatePresence>
        {showPaymentMethodsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowPaymentMethodsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
                <button onClick={() => setShowPaymentMethodsModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6 space-y-3">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{method.name}</p>
                      <p className="text-sm text-gray-500">{method.bank} ••••{method.last4}</p>
                    </div>
                    {method.isPrimary && (
                      <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded">Primary</span>
                    )}
                    <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="p-6 border-t border-gray-100">
                <button 
                  onClick={() => { setShowPaymentMethodsModal(false); setShowAddMethodModal(true); }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-teal-300 hover:text-teal-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Payment Method
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Payment Method Modal */}
      <AnimatePresence>
        {showAddMethodModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowAddMethodModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Add Payment Method</h3>
                <button onClick={() => setShowAddMethodModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                    <option>ACH / Bank Account</option>
                    <option>Wire Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Business Checking"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Chase Bank"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Routing Number</label>
                  <input 
                    type="text" 
                    placeholder="9 digits"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                  <input 
                    type="text" 
                    placeholder="Account number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" 
                  />
                </div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded text-teal-600 focus:ring-teal-500" />
                  <span className="text-sm text-gray-700">Set as primary payment method</span>
                </label>
              </div>
              <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
                <button 
                  onClick={() => setShowAddMethodModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setShowAddMethodModal(false)}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium"
                >
                  Add Method
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
