"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
  },
];

const recentOrders = [
  {
    id: "RX-2024-001",
    medication: "Lisinopril 10mg",
    status: "delivered",
    date: "Mar 1, 2024",
    pharmacy: "CVS Pharmacy - Main St",
    copay: 10,
  },
  {
    id: "RX-2024-002",
    medication: "Atorvastatin 20mg",
    status: "delivered",
    date: "Feb 28, 2024",
    pharmacy: "CVS Pharmacy - Main St",
    copay: 10,
  },
  {
    id: "RX-2024-003",
    medication: "Metformin 500mg",
    status: "delivered",
    date: "Feb 15, 2024",
    pharmacy: "CVS Pharmacy - Main St",
    copay: 10,
  },
];

export default function PrescriptionsPage() {
  const [activeTab, setActiveTab] = useState<"active" | "orders">("active");
  const [searchQuery, setSearchQuery] = useState("");

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

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Prescriptions</h1>
          <p className="text-gray-500 mt-1">Manage your medications and refills</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors">
          <Plus className="w-4 h-4" />
          Transfer Prescription
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
              <Pill className="w-5 h-5 text-teal-600" />
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
              activeTab === "active"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Active Prescriptions
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "orders"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
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
            className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 w-64"
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
                {/* Medication Icon */}
                <div className="w-16 h-16 bg-teal-100 rounded-xl flex items-center justify-center shrink-0">
                  <Pill className="w-8 h-8 text-teal-600" />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {rx.name} {rx.strength}
                      </h3>
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

                {/* Actions */}
                <div className="flex flex-wrap lg:flex-col gap-2 shrink-0">
                  <button className="px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Request Refill
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">
                    View Details
                  </button>
                </div>
              </div>

              {/* Refill Due Alert */}
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
              <span className="flex items-center gap-1">
                <Phone className="w-4 h-4" /> (216) 555-0150
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> Open until 9:00 PM
              </span>
            </div>
          </div>
          <button className="px-4 py-2 text-teal-600 font-medium hover:bg-teal-50 rounded-lg transition-colors">
            Change Pharmacy
          </button>
        </div>
      </div>

      {/* Mail Order Promo */}
      <div className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
            <Truck className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-1">Save with Mail Order</h3>
            <p className="text-teal-100">
              Get a 90-day supply delivered to your door for the price of 2.5 copays. 
              Plus, free shipping on all orders.
            </p>
          </div>
          <button className="px-6 py-3 bg-white text-teal-700 font-semibold rounded-xl hover:bg-teal-50 transition-colors shrink-0">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}
