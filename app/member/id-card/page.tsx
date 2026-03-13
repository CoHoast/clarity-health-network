"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Download,
  Share2,
  Smartphone,
  Mail,
  Printer,
  QrCode,
  Copy,
  CheckCircle2,
  Phone,
  MapPin,
  Clock,
  CreditCard,
  RotateCcw,
  Info,
  X,
  ExternalLink,
} from "lucide-react";

export default function IDCardPage() {
  const [showBack, setShowBack] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showDependentCard, setShowDependentCard] = useState<string | null>(null);
  const [walletAdded, setWalletAdded] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailAddress, setEmailAddress] = useState("john.doe@email.com");

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleAddToWallet = () => {
    setWalletAdded(true);
    setTimeout(() => {
      setShowWalletModal(false);
      setWalletAdded(false);
    }, 2000);
  };

  const handleSendEmail = () => {
    setEmailSent(true);
    setTimeout(() => {
      setShowEmailModal(false);
      setEmailSent(false);
    }, 2000);
  };

  const dependents = [
    { name: "Jane Doe", relationship: "Spouse", memberId: "CHN-123456-01", dob: "03/22/1987" },
    { name: "Emma Doe", relationship: "Child", memberId: "CHN-123456-02", dob: "06/15/2015" },
    { name: "Liam Doe", relationship: "Child", memberId: "CHN-123456-03", dob: "09/30/2018" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Your ID Card</h1>
        <p className="text-gray-500 mt-1">Show this card at any healthcare appointment</p>
      </div>

      {/* ID Card */}
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="perspective-1000"
        >
          {/* Card container */}
          <div
            className={`relative w-full max-w-lg mx-auto transition-transform duration-500 transform-style-preserve-3d cursor-pointer ${
              showBack ? "rotate-y-180" : ""
            }`}
            onClick={() => setShowBack(!showBack)}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Front of card */}
            <div
              className={`w-full bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-600 rounded-2xl p-6 sm:p-8 text-white shadow-2xl ${
                showBack ? "opacity-0" : "opacity-100"
              } transition-opacity duration-300`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                    <Shield className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="font-bold text-xl">Clarity Health Network</h2>
                    <p className="text-teal-100 text-sm">PPO Health Plan</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm font-medium">
                    Active
                  </span>
                </div>
              </div>

              {/* Member Info */}
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-teal-100 text-xs uppercase tracking-wider mb-1">Member Name</p>
                  <p className="text-2xl font-bold">John Michael Doe</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-teal-100 text-xs uppercase tracking-wider mb-1">Member ID</p>
                    <p className="font-mono text-lg">CHN-123456</p>
                  </div>
                  <div>
                    <p className="text-teal-100 text-xs uppercase tracking-wider mb-1">Group Number</p>
                    <p className="font-mono text-lg">GRP-78901</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-teal-100 text-xs uppercase tracking-wider mb-1">DOB</p>
                    <p className="font-medium">01/15/1985</p>
                  </div>
                  <div>
                    <p className="text-teal-100 text-xs uppercase tracking-wider mb-1">Plan Type</p>
                    <p className="font-medium">Family</p>
                  </div>
                  <div>
                    <p className="text-teal-100 text-xs uppercase tracking-wider mb-1">Effective</p>
                    <p className="font-medium">01/01/2024</p>
                  </div>
                </div>
              </div>

              {/* Copays */}
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-teal-100 text-xs mb-1">PCP Copay</p>
                  <p className="text-xl font-bold">$25</p>
                </div>
                <div>
                  <p className="text-teal-100 text-xs mb-1">Specialist</p>
                  <p className="text-xl font-bold">$50</p>
                </div>
                <div>
                  <p className="text-teal-100 text-xs mb-1">ER Copay</p>
                  <p className="text-xl font-bold">$250</p>
                </div>
              </div>

              {/* Flip indicator */}
              <div className="flex items-center justify-center mt-6 text-teal-100 text-sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                Tap to flip card
              </div>
            </div>

            {/* Back of card */}
            <div
              className={`absolute inset-0 w-full bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-gray-200 ${
                showBack ? "opacity-100" : "opacity-0 pointer-events-none"
              } transition-opacity duration-300`}
              style={{ transform: "rotateY(180deg)" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Shield className="w-6 h-6 text-teal-600" />
                  <span className="font-bold text-gray-900">Clarity Health Network</span>
                </div>
                <QrCode className="w-16 h-16 text-gray-800" />
              </div>

              {/* Important Numbers */}
              <div className="space-y-4 mb-6">
                <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">Important Numbers</h3>
                <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">Member Services</span>
                    </div>
                    <span className="font-mono text-gray-900">1-800-555-0123</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">24/7 Nurse Line</span>
                    </div>
                    <span className="font-mono text-gray-900">1-800-555-0124</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">Behavioral Health</span>
                    </div>
                    <span className="font-mono text-gray-900">1-800-555-0125</span>
                  </div>
                </div>
              </div>

              {/* Claims Address */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-gray-900 text-sm mb-2">Claims Submission</h3>
                <p className="text-sm text-gray-600">
                  Clarity Health Network<br />
                  P.O. Box 12345<br />
                  Cleveland, OH 44101
                </p>
              </div>

              {/* EDI Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Payer ID</p>
                  <p className="font-mono text-gray-900">CHN01</p>
                </div>
                <div>
                  <p className="text-gray-500">BIN</p>
                  <p className="font-mono text-gray-900">610014</p>
                </div>
                <div>
                  <p className="text-gray-500">PCN</p>
                  <p className="font-mono text-gray-900">CLRTY</p>
                </div>
                <div>
                  <p className="text-gray-500">RxGrp</p>
                  <p className="font-mono text-gray-900">CHNRX</p>
                </div>
              </div>

              {/* Flip indicator */}
              <div className="flex items-center justify-center mt-6 text-gray-400 text-sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                Tap to flip card
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Copy Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Quick Copy</h2>
          <p className="text-sm text-gray-500">Click to copy your card information</p>
        </div>
        <div className="p-6 grid sm:grid-cols-2 gap-4">
          {[
            { label: "Member ID", value: "CHN-123456" },
            { label: "Group Number", value: "GRP-78901" },
            { label: "Payer ID", value: "CHN01" },
            { label: "BIN", value: "610014" },
            { label: "PCN", value: "CLRTY" },
            { label: "RxGroup", value: "CHNRX" },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => handleCopy(item.value, item.label)}
              className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
            >
              <div className="text-left">
                <p className="text-sm text-gray-500">{item.label}</p>
                <p className="font-mono text-gray-900">{item.value}</p>
              </div>
              {copied === item.label ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <Copy className="w-5 h-5 text-gray-400 group-hover:text-teal-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button 
          onClick={() => setShowWalletModal(true)}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 transition-colors"
        >
          <Smartphone className="w-5 h-5" />
          Add to Apple Wallet
        </button>
        <Link 
          href="/docs/id-card"
          className="flex items-center justify-center gap-2 px-6 py-4 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
        >
          <Download className="w-5 h-5" />
          Download PDF
        </Link>
        <button 
          onClick={() => setShowEmailModal(true)}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
        >
          <Mail className="w-5 h-5" />
          Email Card
        </button>
        <button 
          onClick={() => setShowPrintModal(true)}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
        >
          <Printer className="w-5 h-5" />
          Print Card
        </button>
      </div>

      {/* Dependents */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Covered Dependents</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {dependents.map((dependent) => (
            <div key={dependent.memberId} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                  <span className="text-teal-600 font-semibold">{dependent.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{dependent.name}</p>
                  <p className="text-sm text-gray-500">{dependent.relationship} • DOB: {dependent.dob}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm text-gray-900">{dependent.memberId}</p>
                <button 
                  onClick={() => setShowDependentCard(dependent.memberId)}
                  className="text-sm text-teal-600 hover:text-teal-700"
                >
                  View Card
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-blue-900">Present your ID card at every appointment</p>
          <p className="text-sm text-blue-700 mt-1">
            Showing your Clarity Health Network ID card ensures you receive in-network rates. 
            You can show this digital card or a printed copy.
          </p>
        </div>
      </div>

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
                    <button
                      onClick={() => setShowWalletModal(false)}
                      className="w-full px-4 py-2 text-gray-500 font-medium hover:text-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Email Card Modal */}
      <AnimatePresence>
        {showEmailModal && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowEmailModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {emailSent ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Email Sent!</h3>
                  <p className="text-gray-600">Your ID card has been emailed to {emailAddress}.</p>
                </div>
              ) : (
                <>
                  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Email ID Card</h3>
                    <button onClick={() => setShowEmailModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <p className="text-sm text-gray-500">
                      We'll send a PDF of your ID card (front and back) to this email address.
                    </p>
                  </div>
                  <div className="px-6 pb-6 flex gap-3">
                    <button
                      onClick={() => setShowEmailModal(false)}
                      className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSendEmail}
                      className="flex-1 px-4 py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      Send Email
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Print Modal */}
      <AnimatePresence>
        {showPrintModal && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowPrintModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Print ID Card</h3>
                <button onClick={() => setShowPrintModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600">
                    Print your ID card on letter-size paper. For best results, use cardstock.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/docs/id-card"
                    className="px-4 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-center flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Preview First
                  </Link>
                  <button
                    onClick={() => {
                      window.print();
                      setShowPrintModal(false);
                    }}
                    className="px-4 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    Print Now
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Dependent Card Modal */}
      <AnimatePresence>
        {showDependentCard && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDependentCard(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const dependent = dependents.find(d => d.memberId === showDependentCard);
                if (!dependent) return null;
                return (
                  <>
                    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">{dependent.name}'s ID Card</h3>
                      <button onClick={() => setShowDependentCard(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                        <X className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>
                    <div className="p-6">
                      {/* Dependent Card */}
                      <div className="bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                              <Shield className="w-5 h-5" />
                            </div>
                            <span className="font-bold">Clarity Health Network</span>
                          </div>
                          <span className="text-xs bg-white/20 px-2 py-1 rounded">PPO</span>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-teal-100 text-xs">Member Name</p>
                            <p className="text-lg font-bold">{dependent.name}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-teal-100 text-xs">Member ID</p>
                              <p className="font-mono">{dependent.memberId}</p>
                            </div>
                            <div>
                              <p className="text-teal-100 text-xs">Group #</p>
                              <p className="font-mono">GRP-78901</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-teal-100 text-xs">DOB</p>
                              <p className="font-medium">{dependent.dob}</p>
                            </div>
                            <div>
                              <p className="text-teal-100 text-xs">Relationship</p>
                              <p className="font-medium">{dependent.relationship}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="px-6 pb-6 flex gap-3">
                      <Link
                        href="/docs/id-card"
                        className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors text-center flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download PDF
                      </Link>
                      <button
                        onClick={() => setShowDependentCard(null)}
                        className="px-4 py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
