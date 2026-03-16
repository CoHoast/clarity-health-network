"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FileSignature, Download, Eye, Calendar, CheckCircle, Clock, X, ExternalLink, Printer, FileText } from "lucide-react";

const contracts = [
  {
    id: "CTR-2024-001",
    name: "Primary Care Provider Agreement",
    type: "Participating Provider",
    effectiveDate: "2024-01-01",
    expirationDate: "2026-12-31",
    status: "Active",
    description: "Standard participating provider agreement for primary care services within the TrueCare Health Network.",
    terms: ["In-network fee schedule rates", "Timely filing requirements (90 days)", "Credentialing maintenance", "Quality reporting requirements"]
  },
  {
    id: "CTR-2024-002",
    name: "Telehealth Services Addendum",
    type: "Service Addendum",
    effectiveDate: "2024-01-01",
    expirationDate: "2026-12-31",
    status: "Active",
    description: "Addendum enabling telehealth/virtual visit services under the primary agreement.",
    terms: ["HIPAA-compliant platform requirements", "Eligible CPT codes", "Documentation standards", "Reimbursement rates"]
  },
  {
    id: "CTR-2023-015",
    name: "Quality Incentive Program",
    type: "Performance Agreement",
    effectiveDate: "2024-01-01",
    expirationDate: "2024-12-31",
    status: "Active",
    description: "Quality bonus program with performance-based incentives for meeting care quality metrics.",
    terms: ["Quality metrics dashboard access", "Quarterly performance reviews", "Bonus calculation methodology", "2024 target metrics"]
  },
];

const amendments = [
  {
    date: "2024-01-15",
    contract: "Quality Incentive Program",
    description: "Updated quality metrics and bonus thresholds for 2024",
  },
  {
    date: "2024-01-01",
    contract: "Primary Care Provider Agreement",
    description: "Annual fee schedule update effective January 2024",
  },
];

export default function ContractsPage() {
  const [selectedContract, setSelectedContract] = useState<typeof contracts[0] | null>(null);
  const [showAmendmentDetail, setShowAmendmentDetail] = useState<typeof amendments[0] | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  const handleSendMessage = () => {
    setMessageSent(true);
    setTimeout(() => {
      setShowContactModal(false);
      setMessageSent(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Contracts</h1>
        <p className="text-gray-600">View your provider agreements with TrueCare Health Network</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-sm text-gray-500">Active Contracts</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">Dec 2026</p>
              <p className="text-sm text-gray-500">Next Renewal</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileSignature className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">2</p>
              <p className="text-sm text-gray-500">Recent Amendments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Your Contracts</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contract</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Effective</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Expires</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {contracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-900">{contract.name}</p>
                      <p className="text-sm text-gray-500">{contract.id}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{contract.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{contract.effectiveDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{contract.expirationDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      <CheckCircle className="w-3.5 h-3.5" />
                      {contract.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setSelectedContract(contract)}
                        className="p-2 text-gray-400 hover:text-slate-600 hover:bg-gray-100 rounded-lg"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <Link 
                        href="/docs/contract"
                        className="p-2 text-gray-400 hover:text-slate-600 hover:bg-gray-100 rounded-lg"
                      >
                        <Download className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Amendments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Amendments</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {amendments.map((amendment, index) => (
            <div 
              key={index} 
              className="px-6 py-4 flex items-start justify-between hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => setShowAmendmentDetail(amendment)}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileSignature className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{amendment.contract}</p>
                  <p className="text-sm text-gray-600 mt-1">{amendment.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{amendment.date}</p>
                </div>
              </div>
              <button className="text-slate-600 hover:text-slate-800 text-sm font-medium">View</button>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="bg-slate-50 rounded-xl p-6 text-center">
        <h3 className="font-semibold text-gray-900 mb-2">Questions about your contract?</h3>
        <p className="text-gray-600 mb-4">Contact our Provider Relations team for assistance.</p>
        <button 
          onClick={() => setShowContactModal(true)}
          className="px-6 py-2.5 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
        >
          Contact Provider Relations
        </button>
      </div>

      {/* Contract Detail Modal */}
      <AnimatePresence>
        {selectedContract && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedContract(null)}
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
                  <h3 className="font-semibold text-gray-900">{selectedContract.name}</h3>
                  <p className="text-sm text-gray-500">{selectedContract.id}</p>
                </div>
                <button onClick={() => setSelectedContract(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Status */}
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 bg-green-50 text-green-700 font-medium rounded-full flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Active
                  </span>
                  <span className="text-sm text-gray-500">{selectedContract.type}</span>
                </div>

                {/* Description */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-600 text-sm">{selectedContract.description}</p>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Effective Date</p>
                    <p className="font-medium text-gray-900">{selectedContract.effectiveDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Expiration Date</p>
                    <p className="font-medium text-gray-900">{selectedContract.expirationDate}</p>
                  </div>
                </div>

                {/* Key Terms */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Key Terms</h4>
                  <ul className="space-y-2">
                    {selectedContract.terms.map((term, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        {term}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
                <Link
                  href="/docs/contract"
                  className="flex-1 px-4 py-2.5 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors text-center flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </Link>
                <button className="px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedContract(null)}
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Amendment Detail Modal */}
      <AnimatePresence>
        {showAmendmentDetail && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAmendmentDetail(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Amendment Details</h3>
                <button onClick={() => setShowAmendmentDetail(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                  <FileSignature className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">{showAmendmentDetail.contract}</p>
                    <p className="text-sm text-gray-500">Effective: {showAmendmentDetail.date}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Changes</h4>
                  <p className="text-gray-600 text-sm">{showAmendmentDetail.description}</p>
                </div>
              </div>

              <div className="px-6 pb-6 flex gap-3">
                <Link
                  href="/docs/contract"
                  className="flex-1 px-4 py-2.5 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors text-center flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Link>
                <button
                  onClick={() => setShowAmendmentDetail(null)}
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Contact Modal */}
      <AnimatePresence>
        {showContactModal && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowContactModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {messageSent ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-600">Our Provider Relations team will respond within 1-2 business days.</p>
                </div>
              ) : (
                <>
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">Contact Provider Relations</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                      <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500">
                        <option>Contract question</option>
                        <option>Fee schedule inquiry</option>
                        <option>Renewal request</option>
                        <option>Amendment request</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                      <textarea
                        rows={4}
                        placeholder="Describe your question or request..."
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none"
                      />
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                      <p>You can also reach us at:</p>
                      <p className="font-medium">1-800-555-0150</p>
                      <p>provider.relations@truecarehealth.com</p>
                    </div>
                  </div>
                  <div className="px-6 pb-6 flex gap-3">
                    <button
                      onClick={() => setShowContactModal(false)}
                      className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSendMessage}
                      className="flex-1 px-4 py-2.5 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      Send Message
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
