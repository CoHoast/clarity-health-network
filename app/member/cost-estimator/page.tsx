"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calculator,
  Search,
  DollarSign,
  Building2,
  Stethoscope,
  Info,
  ChevronRight,
  MapPin,
  Star,
  CheckCircle2,
  TrendingDown,
  FileText,
  HelpCircle,
  AlertCircle,
} from "lucide-react";

const commonProcedures = [
  { name: "MRI (Brain)", code: "70553", avgCost: 1200, yourCost: 240, savings: 960 },
  { name: "CT Scan (Chest)", code: "71250", avgCost: 850, yourCost: 170, savings: 680 },
  { name: "Colonoscopy", code: "45378", avgCost: 2500, yourCost: 0, savings: 2500, preventive: true },
  { name: "Physical Therapy (session)", code: "97110", avgCost: 150, yourCost: 30, savings: 120 },
  { name: "X-Ray (Chest)", code: "71046", avgCost: 320, yourCost: 64, savings: 256 },
  { name: "Blood Work (Metabolic Panel)", code: "80053", avgCost: 245, yourCost: 0, savings: 245 },
  { name: "Ultrasound (Abdominal)", code: "76700", avgCost: 450, yourCost: 90, savings: 360 },
  { name: "Echocardiogram", code: "93306", avgCost: 1800, yourCost: 360, savings: 1440 },
];

const facilities = [
  { name: "Cleveland Clinic Main Campus", type: "Hospital", distance: "2.5 mi", estimatedCost: 280, rating: 4.8 },
  { name: "MetroHealth Imaging Center", type: "Outpatient", distance: "3.2 mi", estimatedCost: 220, rating: 4.7 },
  { name: "University Hospitals", type: "Hospital", distance: "4.0 mi", estimatedCost: 310, rating: 4.6 },
  { name: "Akron General Imaging", type: "Outpatient", distance: "8.5 mi", estimatedCost: 195, rating: 4.5 },
];

export default function CostEstimatorPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProcedure, setSelectedProcedure] = useState<typeof commonProcedures[0] | null>(null);
  const [showFacilities, setShowFacilities] = useState(false);

  const filteredProcedures = commonProcedures.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.includes(searchQuery)
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cost Estimator</h1>
        <p className="text-gray-500 mt-1">Get estimated costs for procedures and services before your visit</p>
      </div>

      {/* Deductible Status Card */}
      <div className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="font-semibold text-lg mb-1">Your Deductible Status</h3>
            <p className="text-teal-100">Your estimates are calculated based on your current plan status</p>
          </div>
          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold">$325</p>
              <p className="text-teal-100 text-sm">of $500 met</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">20%</p>
              <p className="text-teal-100 text-sm">coinsurance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900 mb-4">Search for a Procedure or Service</h2>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by procedure name or CPT code (e.g., MRI, 70553)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Common Procedures */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Common Procedures</h2>
          <p className="text-sm text-gray-500">Click on a procedure to see detailed estimates</p>
        </div>
        <div className="divide-y divide-gray-100">
          {filteredProcedures.map((procedure) => (
            <button
              key={procedure.code}
              onClick={() => {
                setSelectedProcedure(procedure);
                setShowFacilities(true);
              }}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">{procedure.name}</p>
                    {procedure.preventive && (
                      <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full">
                        Preventive - $0
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">CPT Code: {procedure.code}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-sm text-gray-500 line-through">${procedure.avgCost}</p>
                  <p className="text-xl font-bold text-teal-600">${procedure.yourCost}</p>
                  <p className="text-xs text-green-600">Save ${procedure.savings}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Procedure Details */}
      {selectedProcedure && showFacilities && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Cost Breakdown */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">{selectedProcedure.name}</h2>
                <p className="text-sm text-gray-500">CPT Code: {selectedProcedure.code}</p>
              </div>
              <button
                onClick={() => setShowFacilities(false)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                × Close
              </button>
            </div>

            <div className="p-6">
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="font-medium text-gray-900 mb-4">Estimated Cost Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Typical Billed Amount</span>
                    <span className="text-gray-900">${selectedProcedure.avgCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Network Discount</span>
                    <span className="text-green-600">-${(selectedProcedure.avgCost - selectedProcedure.avgCost * 0.6).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Allowed Amount</span>
                    <span className="text-gray-900">${(selectedProcedure.avgCost * 0.6).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plan Pays (80%)</span>
                    <span className="text-green-600">-${(selectedProcedure.avgCost * 0.6 * 0.8).toFixed(0)}</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between text-lg">
                    <span className="font-medium text-gray-900">Your Estimated Cost</span>
                    <span className="font-bold text-teal-600">${selectedProcedure.yourCost}</span>
                  </div>
                </div>
              </div>

              {/* Savings Callout */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                <TrendingDown className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-green-900">You Save ${selectedProcedure.savings}</p>
                  <p className="text-sm text-green-700">
                    By using an in-network provider, you're saving {Math.round((selectedProcedure.savings / selectedProcedure.avgCost) * 100)}% on this procedure.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Compare Facilities */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Compare In-Network Facilities</h2>
              <p className="text-sm text-gray-500">Prices may vary by location</p>
            </div>
            <div className="divide-y divide-gray-100">
              {facilities.map((facility, i) => (
                <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{facility.name}</p>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span>{facility.type}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {facility.distance}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /> {facility.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">${facility.estimatedCost}</p>
                    <p className="text-sm text-gray-500">estimated</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Info Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <Info className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">About Cost Estimates</h3>
            <ul className="text-sm text-blue-700 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                Estimates are based on your current plan benefits and deductible status
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                Actual costs may vary based on your specific treatment and provider
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                Preventive services are covered at 100% when using in-network providers
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                Contact us for a personalized estimate or questions about coverage
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center shrink-0">
            <HelpCircle className="w-6 h-6 text-teal-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Need a Custom Estimate?</h3>
            <p className="text-sm text-gray-600">
              Our team can provide detailed cost estimates for specific procedures or treatments.
            </p>
          </div>
          <button className="px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors">
            Request Estimate
          </button>
        </div>
      </div>
    </div>
  );
}
