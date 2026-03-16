"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pill,
  Search,
  RefreshCw,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Building2,
  Calendar,
  DollarSign,
  ChevronRight,
  Info,
  Phone,
  Plus,
  History,
  Package,
  X,
  User,
  FileText,
  CreditCard,
} from "lucide-react";

const activePrescriptions = [
  {
    id: 1,
    name: "Lisinopril",
    strength: "10mg",
    form: "Tablet",
    directions: "Take 1 tablet by mouth once daily",
    prescriber: "Dr. Sarah Chen",
    pharmacy: "CVS Pharmacy - Main St",
    refillsRemaining: 3,
    lastFilled: "Mar 1, 2024",
    nextRefillDate: "Mar 25, 2024",
    daysSupply: 30,
    copay: 10,
    status: "active",
    autoRefill: true,
    ndc: "0378-1805-01",
    quantity: 30,
    rxNumber: "RX-7845123",
  },
  {
    id: 2,
    name: "Metformin",
    strength: "500mg",
    form: "Tablet",
    directions: "Take 1 tablet by mouth twice daily with meals",
    prescriber: "Dr. Sarah Chen",
    pharmacy: "CVS Pharmacy - Main St",
    refillsRemaining: 5,
    lastFilled: "Feb 15, 2024",
    nextRefillDate: "Mar 12, 2024",
    daysSupply: 30,
    copay: 10,
    status: "refill_due",
    autoRefill: false,
    ndc: "0378-0234-01",
    quantity: 60,
    rxNumber: "RX-7845124",
  },
  {
    id: 3,
    name: "Atorvastatin",
    strength: "20mg",
    form: "Tablet",
    directions: "Take 1 tablet by mouth at bedtime",
    prescriber: "Dr. Lisa Park",
    pharmacy: "CVS Pharmacy - Main St",
    refillsRemaining: 2,
    lastFilled: "Feb 28, 2024",
    nextRefillDate: "Mar 28, 2024",
    daysSupply: 30,
    copay: 10,
    status: "active",
    autoRefill: true,
    ndc: "0378-3952-01",
    quantity: 30,
    rxNumber: "RX-7845125",
  },
];

const pharmacies = [
  { id: 1, name: "CVS Pharmacy - Main St", address: "1234 Main Street, Cleveland, OH 44101", phone: "(216) 555-0150", hours: "8:00 AM - 9:00 PM", distance: "0.5 mi" },
  { id: 2, name: "Walgreens - Oak Ave", address: "567 Oak Avenue, Cleveland, OH 44102", phone: "(216) 555-0160", hours: "7:00 AM - 10:00 PM", distance: "1.2 mi" },
  { id: 3, name: "Rite Aid - Downtown", address: "890 Downtown Blvd, Cleveland, OH 44103", phone: "(216) 555-0170", hours: "8:00 AM - 8:00 PM", distance: "2.0 mi" },
  { id: 4, name: "TrueCare Mail Order Pharmacy", address: "P.O. Box 12345, Cleveland, OH 44199", phone: "(800) 555-0180", hours: "24/7 Online", distance: "Mail Order" },
];

const recentOrders = [
  { id: "RX-2024-001", medication: "Lisinopril 10mg", status: "delivered", date: "Mar 1, 2024", pharmacy: "CVS Pharmacy - Main St", copay: 10 },
  { id: "RX-2024-002", medication: "Atorvastatin 20mg", status: "delivered", date: "Feb 28, 2024", pharmacy: "CVS Pharmacy - Main St", copay: 10 },
  { id: "RX-2024-003", medication: "Metformin 500mg", status: "delivered", date: "Feb 15, 2024", pharmacy: "CVS Pharmacy - Main St", copay: 10 },
];

export default function PrescriptionsPage() {
  const [activeTab, setActiveTab] = useState<"active" | "orders">("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRx, setSelectedRx] = useState<typeof activePrescriptions[0] | null>(null);
  const [showRefillModal, setShowRefillModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showPharmacyModal, setShowPharmacyModal] = useState(false);
  const [showMailOrderModal, setShowMailOrderModal] = useState(false);
  const [refillSuccess, setRefillSuccess] = useState(false);

  const filteredPrescriptions = activePrescriptions.filter((rx) =>
    rx.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Active
          </span>
        );
      case "refill_due":
        return (
          <span className="px-2 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Refill Due
          </span>
        );
      case "delivered":
        return (
          <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full flex items-center gap-1">
            <Package className="w-3 h-3" /> Delivered
          </span>
        );
      default:
        return null;
    }
  };

  const handleRequestRefill = (rx: typeof activePrescriptions[0]) => {
    setSelectedRx(rx);
    setShowRefillModal(true);
    setRefillSuccess(false);
  };

  const submitRefill = () => {
    setRefillSuccess(true);
    setTimeout(() => {
      setShowRefillModal(false);
      setRefillSuccess(false);
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Prescriptions</h1>
          <p className="text-gray-500 mt-1">Manage your medications and refills</p>
        </div>
        <button 
          onClick={() => setShowTransferModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Transfer Prescription
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
              <Pill className="w-5 h-5 text-cyan-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{activePrescriptions.length}</p>
              <p className="text-sm text-gray-500">Active Prescriptions</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">1</p>
              <p className="text-sm text-gray-500">Refills Due</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">2</p>
              <p className="text-sm text-gray-500">Auto-Refill Enabled</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab("active")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "active" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Active Prescriptions
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "orders" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Order History
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search medications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 w-64"
          />
        </div>
      </div>

      {/* Active Prescriptions */}
      {activeTab === "active" && (
        <div className="space-y-4">
          {filteredPrescriptions.map((rx) => (
            <motion.div
              key={rx.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                <div className="w-16 h-16 bg-teal-100 rounded-xl flex items-center justify-center shrink-0">
                  <Pill className="w-8 h-8 text-cyan-600" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{rx.name} {rx.strength}</h3>
                      <p className="text-gray-500">{rx.form}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(rx.status)}
                      {rx.autoRefill && (
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full flex items-center gap-1">
                          <RefreshCw className="w-3 h-3" /> Auto-Refill
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{rx.directions}</p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Prescriber</p>
                      <p className="font-medium text-gray-900">{rx.prescriber}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Refills Remaining</p>
                      <p className="font-medium text-gray-900">{rx.refillsRemaining}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Last Filled</p>
                      <p className="font-medium text-gray-900">{rx.lastFilled}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Copay</p>
                      <p className="font-medium text-gray-900">${rx.copay}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                    <Building2 className="w-4 h-4" />
                    <span>{rx.pharmacy}</span>
                  </div>
                </div>
                <div className="flex flex-wrap lg:flex-col gap-2 shrink-0">
                  <button 
                    onClick={() => handleRequestRefill(rx)}
                    className="px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Request Refill
                  </button>
                  <button 
                    onClick={() => setSelectedRx(rx)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
              {rx.status === "refill_due" && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-900">Refill Due</p>
                      <p className="text-sm text-amber-700">
                        Your next refill is due on {rx.nextRefillDate}. Request a refill now to avoid running out.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Order History */}
      {activeTab === "orders" && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-100">
            {recentOrders.map((order) => (
              <div key={order.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Pill className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{order.medication}</p>
                    <p className="text-sm text-gray-500">{order.pharmacy} • {order.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {getStatusBadge(order.status)}
                  <span className="font-medium text-gray-900">${order.copay}</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pharmacy Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900 mb-4">Your Preferred Pharmacy</h2>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">CVS Pharmacy - Main St</p>
            <p className="text-gray-600">1234 Main Street, Cleveland, OH 44101</p>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> (216) 555-0150</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Open until 9:00 PM</span>
            </div>
          </div>
          <button 
            onClick={() => setShowPharmacyModal(true)}
            className="px-4 py-2 text-cyan-600 font-medium hover:bg-teal-50 rounded-lg transition-colors"
          >
            Change Pharmacy
          </button>
        </div>
      </div>

      {/* Mail Order Promo */}
      <div className="bg-gradient-to-r from-cyan-400 to-teal-500 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
            <Truck className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-1">Save with Mail Order</h3>
            <p className="text-teal-100">
              Get a 90-day supply delivered to your door for the price of 2.5 copays. Plus, free shipping on all orders.
            </p>
          </div>
          <button 
            onClick={() => setShowMailOrderModal(true)}
            className="px-6 py-3 bg-white text-cyan-700 font-semibold rounded-xl hover:bg-teal-50 transition-colors shrink-0"
          >
            Learn More
          </button>
        </div>
      </div>

      {/* View Details Modal */}
      <AnimatePresence>
        {selectedRx && !showRefillModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedRx(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Prescription Details</h2>
                <button onClick={() => setSelectedRx(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-teal-100 rounded-xl flex items-center justify-center">
                    <Pill className="w-8 h-8 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedRx.name} {selectedRx.strength}</h3>
                    <p className="text-gray-500">{selectedRx.form} • {selectedRx.quantity} count</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Directions</p>
                  <p className="text-gray-900 font-medium">{selectedRx.directions}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-sm text-gray-500">Rx Number</p><p className="font-medium text-gray-900">{selectedRx.rxNumber}</p></div>
                  <div><p className="text-sm text-gray-500">NDC</p><p className="font-medium text-gray-900">{selectedRx.ndc}</p></div>
                  <div><p className="text-sm text-gray-500">Prescriber</p><p className="font-medium text-gray-900">{selectedRx.prescriber}</p></div>
                  <div><p className="text-sm text-gray-500">Quantity</p><p className="font-medium text-gray-900">{selectedRx.quantity} {selectedRx.form}s</p></div>
                  <div><p className="text-sm text-gray-500">Days Supply</p><p className="font-medium text-gray-900">{selectedRx.daysSupply} days</p></div>
                  <div><p className="text-sm text-gray-500">Refills Remaining</p><p className="font-medium text-gray-900">{selectedRx.refillsRemaining}</p></div>
                  <div><p className="text-sm text-gray-500">Last Filled</p><p className="font-medium text-gray-900">{selectedRx.lastFilled}</p></div>
                  <div><p className="text-sm text-gray-500">Your Copay</p><p className="font-medium text-gray-900">${selectedRx.copay}</p></div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <Building2 className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{selectedRx.pharmacy}</p>
                    <p className="text-sm text-gray-500">Your preferred pharmacy</p>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
                <button onClick={() => { setShowRefillModal(true); }} className="flex-1 px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700">
                  Request Refill
                </button>
                <button onClick={() => setSelectedRx(null)} className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200">
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Request Refill Modal */}
      <AnimatePresence>
        {showRefillModal && selectedRx && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowRefillModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {!refillSuccess ? (
                <>
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Request Refill</h2>
                    <button onClick={() => setShowRefillModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <Pill className="w-10 h-10 text-cyan-600 p-2 bg-teal-100 rounded-lg" />
                      <div>
                        <p className="font-semibold text-gray-900">{selectedRx.name} {selectedRx.strength}</p>
                        <p className="text-sm text-gray-500">{selectedRx.quantity} {selectedRx.form}s • {selectedRx.daysSupply} day supply</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Pharmacy</span>
                        <span className="font-medium text-gray-900">{selectedRx.pharmacy}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Refills Remaining</span>
                        <span className="font-medium text-gray-900">{selectedRx.refillsRemaining}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Estimated Copay</span>
                        <span className="font-medium text-gray-900">${selectedRx.copay}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Ready for Pickup</span>
                        <span className="font-medium text-gray-900">Within 2 hours</span>
                      </div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
                      <Info className="w-4 h-4 inline mr-2" />
                      You'll receive a text when your prescription is ready.
                    </div>
                  </div>
                  <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
                    <button onClick={submitRefill} className="flex-1 px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700">
                      Confirm Refill Request
                    </button>
                    <button onClick={() => setShowRefillModal(false)} className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200">
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Refill Requested!</h3>
                  <p className="text-gray-600">Your refill has been submitted. You'll receive a notification when it's ready.</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Transfer Prescription Modal */}
      <AnimatePresence>
        {showTransferModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowTransferModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Transfer Prescription</h2>
                <button onClick={() => setShowTransferModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-gray-600">Transfer a prescription from another pharmacy to your preferred TrueCare Health pharmacy.</p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Pharmacy Name</label>
                  <input type="text" placeholder="e.g., Walgreens" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pharmacy Phone Number</label>
                  <input type="tel" placeholder="(555) 555-5555" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prescription Number (if known)</label>
                  <input type="text" placeholder="RX-123456" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Medication Name</label>
                  <input type="text" placeholder="e.g., Lisinopril 10mg" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                  <Info className="w-4 h-4 inline mr-2 text-gray-400" />
                  We'll contact your current pharmacy to transfer the prescription. This usually takes 1-2 business days.
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
                <button onClick={() => setShowTransferModal(false)} className="flex-1 px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700">
                  Submit Transfer Request
                </button>
                <button onClick={() => setShowTransferModal(false)} className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200">
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Change Pharmacy Modal */}
      <AnimatePresence>
        {showPharmacyModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowPharmacyModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Select Pharmacy</h2>
                <button onClick={() => setShowPharmacyModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-4">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="Search by name or zip code..." className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
                </div>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {pharmacies.map((pharmacy) => (
                    <div key={pharmacy.id} className="p-4 border border-gray-200 rounded-xl hover:border-teal-300 hover:bg-teal-50 cursor-pointer transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{pharmacy.name}</p>
                          <p className="text-sm text-gray-600">{pharmacy.address}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {pharmacy.phone}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {pharmacy.hours}</span>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{pharmacy.distance}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200">
                <button onClick={() => setShowPharmacyModal(false)} className="w-full px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200">
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mail Order Modal */}
      <AnimatePresence>
        {showMailOrderModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowMailOrderModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-cyan-400 to-teal-500 px-6 py-8 text-white text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Mail Order Pharmacy</h2>
                <p className="text-teal-100">Save time and money with home delivery</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-2xl font-bold text-cyan-600">90</p>
                    <p className="text-sm text-gray-600">Day Supply</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-2xl font-bold text-cyan-600">$0</p>
                    <p className="text-sm text-gray-600">Shipping</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-2xl font-bold text-cyan-600">17%</p>
                    <p className="text-sm text-gray-600">Savings</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">90-day supply for 2.5 copays</p>
                      <p className="text-sm text-gray-600">Instead of paying 3 copays for 3 months</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Free standard shipping</p>
                      <p className="text-sm text-gray-600">Delivered right to your door</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Automatic refills available</p>
                      <p className="text-sm text-gray-600">Never run out of your medications</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Pharmacist support 24/7</p>
                      <p className="text-sm text-gray-600">Questions? Call anytime</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
                <button onClick={() => setShowMailOrderModal(false)} className="flex-1 px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700">
                  Switch to Mail Order
                </button>
                <button onClick={() => setShowMailOrderModal(false)} className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200">
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
