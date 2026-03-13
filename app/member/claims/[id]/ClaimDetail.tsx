"use client";

import { ArrowLeft, FileText, Building2, Calendar, DollarSign, Download, Printer, CheckCircle, Clock, HelpCircle } from "lucide-react";
import Link from "next/link";

const mockClaim = {
  id: "CLM-2024-0156",
  status: "paid",
  dateOfService: "2024-03-08",
  processedDate: "2024-03-12",
  provider: {
    name: "Cleveland Family Medicine",
    address: "1234 Health Ave, Cleveland, OH 44101",
    phone: "(216) 555-0100",
  },
  patient: "John Smith",
  serviceLines: [
    { cpt: "99213", description: "Office visit, established patient", billed: 150, allowed: 95, youPay: 19, planPaid: 76 },
    { cpt: "36415", description: "Venipuncture", billed: 35, allowed: 25, youPay: 5, planPaid: 20 },
    { cpt: "80053", description: "Comprehensive metabolic panel", billed: 150, allowed: 110, youPay: 22, planPaid: 88 },
    { cpt: "85025", description: "Complete blood count (CBC)", billed: 75, allowed: 55, youPay: 11, planPaid: 44 },
  ],
  totals: {
    billed: 410,
    allowed: 285,
    youPay: 57,
    planPaid: 228,
  },
  deductibleApplied: 0,
  coinsurance: "20%",
};

export default function ClaimDetail({ id }: { id: string }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/member/claims" className="p-2 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Claim Details</h1>
          <p className="text-gray-500">Claim #{id}</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg" title="Print">
            <Printer className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg" title="Download PDF">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Status Banner */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
        <CheckCircle className="w-6 h-6 text-green-600" />
        <div>
          <p className="font-semibold text-green-700">Claim Paid</p>
          <p className="text-sm text-green-600">Processed on {mockClaim.processedDate}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Provider Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-teal-600" />Provider Information
            </h2>
            <div className="space-y-2">
              <p className="text-gray-900 font-medium">{mockClaim.provider.name}</p>
              <p className="text-gray-600">{mockClaim.provider.address}</p>
              <p className="text-gray-600">{mockClaim.provider.phone}</p>
            </div>
          </div>

          {/* Service Details */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Services Provided</h2>
              <p className="text-sm text-gray-500">Date of Service: {mockClaim.dateOfService}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase font-medium">Service</th>
                    <th className="px-4 py-3 text-right text-xs text-gray-500 uppercase font-medium">Billed</th>
                    <th className="px-4 py-3 text-right text-xs text-gray-500 uppercase font-medium">Allowed</th>
                    <th className="px-4 py-3 text-right text-xs text-gray-500 uppercase font-medium">Plan Paid</th>
                    <th className="px-4 py-3 text-right text-xs text-gray-500 uppercase font-medium">You Pay</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mockClaim.serviceLines.map((line, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="text-gray-900">{line.description}</p>
                        <p className="text-xs text-gray-400">CPT: {line.cpt}</p>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-500">${line.billed.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-gray-700">${line.allowed.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-green-600">${line.planPaid.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-gray-900 font-medium">${line.youPay.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 border-t border-gray-200">
                  <tr>
                    <td className="px-4 py-3 font-semibold text-gray-900">Totals</td>
                    <td className="px-4 py-3 text-right text-gray-500">${mockClaim.totals.billed.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-gray-700">${mockClaim.totals.allowed.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-green-600 font-semibold">${mockClaim.totals.planPaid.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-gray-900 font-bold">${mockClaim.totals.youPay.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* EOB Explanation */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-teal-600" />Understanding Your EOB
            </h2>
            <div className="space-y-4 text-sm">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="font-medium text-gray-700">Billed Amount</p>
                  <p className="text-gray-500">What the provider charged for services</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="font-medium text-gray-700">Allowed Amount</p>
                  <p className="text-gray-500">The negotiated rate we pay for services</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="font-medium text-gray-700">Plan Paid</p>
                  <p className="text-gray-500">What your insurance covered</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="font-medium text-gray-700">You Pay</p>
                  <p className="text-gray-500">Your share (copay, coinsurance, deductible)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Payment Summary */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Payment Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Total Billed</span>
                <span className="text-gray-900">${mockClaim.totals.billed.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Network Savings</span>
                <span className="text-green-600">-${(mockClaim.totals.billed - mockClaim.totals.allowed).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Plan Paid</span>
                <span className="text-green-600">${mockClaim.totals.planPaid.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Deductible Applied</span>
                <span className="text-gray-900">${mockClaim.deductibleApplied.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Coinsurance ({mockClaim.coinsurance})</span>
                <span className="text-gray-900">${mockClaim.totals.youPay.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Your Responsibility</span>
                  <span className="text-xl font-bold text-teal-600">${mockClaim.totals.youPay.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Claim Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Claim Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Claim Number</span>
                <span className="text-gray-900 font-mono">{mockClaim.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Patient</span>
                <span className="text-gray-900">{mockClaim.patient}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date of Service</span>
                <span className="text-gray-900">{mockClaim.dateOfService}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Processed</span>
                <span className="text-gray-900">{mockClaim.processedDate}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>
            <div className="space-y-2">
              <Link href="/docs/eob" className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" />View Full EOB
              </Link>
              <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />Download PDF
              </button>
              <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2">
                <Printer className="w-4 h-4" />Print
              </button>
            </div>
          </div>

          {/* Need Help */}
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-5">
            <h3 className="font-semibold text-teal-700 mb-2">Questions about this claim?</h3>
            <p className="text-sm text-teal-600 mb-3">Our team is here to help you understand your benefits.</p>
            <Link href="/member/help" className="text-teal-700 text-sm font-medium hover:text-teal-800">
              Contact Member Services →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
