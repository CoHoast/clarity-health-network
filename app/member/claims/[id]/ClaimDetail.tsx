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
        <Link href="/member/claims" className="p-2 text-slate-400 hover:text-teal-400 hover:bg-teal-500/20 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">Claim Details</h1>
          <p className="text-slate-400">Claim #{id}</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg" title="Print">
            <Printer className="w-5 h-5" />
          </button>
          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg" title="Download PDF">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Status Banner */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center gap-3">
        <CheckCircle className="w-6 h-6 text-green-400" />
        <div>
          <p className="font-semibold text-green-400">Claim Paid</p>
          <p className="text-sm text-green-300">Processed on {mockClaim.processedDate}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Provider Info */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-teal-400" />Provider Information
            </h2>
            <div className="space-y-2">
              <p className="text-white font-medium">{mockClaim.provider.name}</p>
              <p className="text-slate-400">{mockClaim.provider.address}</p>
              <p className="text-slate-400">{mockClaim.provider.phone}</p>
            </div>
          </div>

          {/* Service Details */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700">
              <h2 className="text-lg font-semibold text-white">Services Provided</h2>
              <p className="text-sm text-slate-400">Date of Service: {mockClaim.dateOfService}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800 border-b border-slate-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Service</th>
                    <th className="px-4 py-3 text-right text-xs text-slate-400 uppercase">Billed</th>
                    <th className="px-4 py-3 text-right text-xs text-slate-400 uppercase">Allowed</th>
                    <th className="px-4 py-3 text-right text-xs text-slate-400 uppercase">Plan Paid</th>
                    <th className="px-4 py-3 text-right text-xs text-slate-400 uppercase">You Pay</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {mockClaim.serviceLines.map((line, i) => (
                    <tr key={i} className="hover:bg-slate-800/80">
                      <td className="px-4 py-3">
                        <p className="text-white">{line.description}</p>
                        <p className="text-xs text-slate-500">CPT: {line.cpt}</p>
                      </td>
                      <td className="px-4 py-3 text-right text-slate-400">${line.billed.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-slate-300">${line.allowed.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-green-400">${line.planPaid.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-white font-medium">${line.youPay.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-800 border-t border-slate-700">
                  <tr>
                    <td className="px-4 py-3 font-semibold text-white">Totals</td>
                    <td className="px-4 py-3 text-right text-slate-400">${mockClaim.totals.billed.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-slate-300">${mockClaim.totals.allowed.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-green-400 font-semibold">${mockClaim.totals.planPaid.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-white font-bold">${mockClaim.totals.youPay.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* EOB Explanation */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-teal-400" />Understanding Your EOB
            </h2>
            <div className="space-y-4 text-sm">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <p className="font-medium text-slate-300">Billed Amount</p>
                  <p className="text-slate-400">What the provider charged for services</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <p className="font-medium text-slate-300">Allowed Amount</p>
                  <p className="text-slate-400">The negotiated rate we pay for services</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <p className="font-medium text-slate-300">Plan Paid</p>
                  <p className="text-slate-400">What your insurance covered</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <p className="font-medium text-slate-300">You Pay</p>
                  <p className="text-slate-400">Your share (copay, coinsurance, deductible)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Payment Summary */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-5">
            <h3 className="font-semibold text-white mb-4">Payment Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Billed</span>
                <span className="text-white">${mockClaim.totals.billed.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Network Savings</span>
                <span className="text-green-400">-${(mockClaim.totals.billed - mockClaim.totals.allowed).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Plan Paid</span>
                <span className="text-green-400">${mockClaim.totals.planPaid.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Deductible Applied</span>
                <span className="text-white">${mockClaim.deductibleApplied.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Coinsurance ({mockClaim.coinsurance})</span>
                <span className="text-white">${mockClaim.totals.youPay.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-700 pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-white">Your Responsibility</span>
                  <span className="text-xl font-bold text-teal-400">${mockClaim.totals.youPay.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Claim Info */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-5">
            <h3 className="font-semibold text-white mb-3">Claim Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Claim Number</span>
                <span className="text-white font-mono">{mockClaim.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Patient</span>
                <span className="text-white">{mockClaim.patient}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date of Service</span>
                <span className="text-white">{mockClaim.dateOfService}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Processed</span>
                <span className="text-white">{mockClaim.processedDate}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-5">
            <h3 className="font-semibold text-white mb-4">Actions</h3>
            <div className="space-y-2">
              <Link href="/docs/eob" className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" />View Full EOB
              </Link>
              <button className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />Download PDF
              </button>
              <button className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 flex items-center justify-center gap-2">
                <Printer className="w-4 h-4" />Print
              </button>
            </div>
          </div>

          {/* Need Help */}
          <div className="bg-teal-500/10 border border-teal-500/30 rounded-xl p-5">
            <h3 className="font-semibold text-teal-400 mb-2">Questions about this claim?</h3>
            <p className="text-sm text-slate-300 mb-3">Our team is here to help you understand your benefits.</p>
            <Link href="/member/help" className="text-teal-400 text-sm font-medium hover:text-teal-300">
              Contact Member Services →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
