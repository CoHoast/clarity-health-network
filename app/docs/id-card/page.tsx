"use client";

import { Download, Printer, CreditCard, Phone, Globe } from "lucide-react";

export default function IDCardPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Action Bar */}
        <div className="flex justify-end gap-3 mb-4 print:hidden">
          <button onClick={() => window.print()} className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Printer className="w-4 h-4" /> Print
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>

        {/* ID Card - Front */}
        <div className="bg-gradient-to-br from-cyan-400 to-teal-600 rounded-2xl shadow-xl p-6 mb-4 text-white">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-xl font-bold">MedCare Health Network</h1>
              <p className="text-teal-100 text-sm">Gold PPO Plan</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
          </div>

          <div className="mb-6">
            <p className="text-teal-100 text-xs uppercase tracking-wider mb-1">Member Name</p>
            <p className="text-xl font-semibold">John Doe</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-teal-100 text-xs uppercase tracking-wider mb-1">Member ID</p>
              <p className="font-mono font-semibold">CHN-123456</p>
            </div>
            <div>
              <p className="text-teal-100 text-xs uppercase tracking-wider mb-1">Group Number</p>
              <p className="font-mono font-semibold">GRP-AC-001</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-teal-100 text-xs">PCP Copay</p>
              <p className="font-semibold">$25</p>
            </div>
            <div>
              <p className="text-teal-100 text-xs">Specialist</p>
              <p className="font-semibold">$50</p>
            </div>
            <div>
              <p className="text-teal-100 text-xs">ER</p>
              <p className="font-semibold">$250</p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/20 flex justify-between items-center">
            <div className="text-xs">
              <p className="text-teal-100">Effective Date</p>
              <p className="font-semibold">01/15/2024</p>
            </div>
            <div className="text-xs text-right">
              <p className="text-teal-100">RxBIN: 012345</p>
              <p className="text-teal-100">RxPCN: CLRTY</p>
            </div>
          </div>
        </div>

        {/* ID Card - Back */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Important Information</h2>
          
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-800">Member Services</p>
                <p className="text-gray-600">1-800-555-0123 (24/7)</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Globe className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-800">Online Portal</p>
                <p className="text-gray-600">member.medcarehealthnetwork.com</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <p className="font-semibold text-gray-800 mb-1">Pre-Authorization Required</p>
              <p className="text-gray-600 text-xs">Inpatient admissions, certain outpatient procedures, and specialty medications require prior authorization. Call 1-800-555-0199.</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="font-semibold text-amber-800 mb-1">Emergency Services</p>
              <p className="text-amber-700 text-xs">For life-threatening emergencies, call 911 or go to the nearest emergency room. No prior authorization is required for emergency services.</p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              This card is for identification purposes only. Benefits are subject to the terms and conditions of your plan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
