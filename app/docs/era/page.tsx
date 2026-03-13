"use client";

import { Download, Printer, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ERAPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Action Bar */}
        <div className="flex justify-between items-center mb-4 print:hidden">
          <Link href="/admin/payments" className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700">
            <ArrowLeft className="w-4 h-4" /> Back to Payments
          </Link>
          <div className="flex gap-3">
            <button onClick={() => window.print()} className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Printer className="w-4 h-4" /> Print
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              <Download className="w-4 h-4" /> Download PDF
            </button>
          </div>
        </div>

        {/* ERA Document */}
        <div className="bg-white rounded-lg shadow-lg p-8 print:shadow-none">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-gray-200 pb-6 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-teal-600">Clarity Health Network</h1>
              <p className="text-gray-500">Electronic Remittance Advice (ERA)</p>
              <p className="text-sm text-gray-400 mt-1">835 Transaction</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">ERA Date</p>
              <p className="font-semibold">March 11, 2026</p>
              <p className="text-sm text-gray-500 mt-2">Check/EFT #</p>
              <p className="font-mono font-semibold">PMT-2024-4521</p>
            </div>
          </div>

          {/* Payer & Payee Info */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-2">Payer Information</h3>
              <p className="text-sm"><strong>Name:</strong> Clarity Health Network</p>
              <p className="text-sm"><strong>Payer ID:</strong> CHN001</p>
              <p className="text-sm"><strong>Address:</strong> 1000 Health Way, Cleveland, OH 44101</p>
              <p className="text-sm"><strong>Phone:</strong> 1-800-555-0123</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-2">Payee Information</h3>
              <p className="text-sm"><strong>Name:</strong> Cleveland Family Medicine</p>
              <p className="text-sm"><strong>NPI:</strong> 1234567890</p>
              <p className="text-sm"><strong>Tax ID:</strong> XX-XXXXXXX</p>
              <p className="text-sm"><strong>Address:</strong> 123 Medical Center Dr, Cleveland, OH 44101</p>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-8">
            <h3 className="font-semibold text-teal-800 mb-3">Payment Summary</h3>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-800">47</p>
                <p className="text-sm text-gray-600">Claims Paid</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">$15,230.00</p>
                <p className="text-sm text-gray-600">Total Billed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">$12,875.00</p>
                <p className="text-sm text-gray-600">Total Allowed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">$12,450.00</p>
                <p className="text-sm text-gray-600">Total Paid</p>
              </div>
            </div>
          </div>

          {/* Claim Details Table */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-700 mb-3">Claim Details</h3>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Claim #</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Patient</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">DOS</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">CPT</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-gray-600">Billed</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-gray-600">Allowed</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-gray-600">Deduct</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-gray-600">Copay</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-gray-600">Paid</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-3 py-2 font-mono">CLM-8821</td>
                    <td className="px-3 py-2">Smith, John</td>
                    <td className="px-3 py-2">03/01/26</td>
                    <td className="px-3 py-2 font-mono">99214</td>
                    <td className="px-3 py-2 text-right">$150.00</td>
                    <td className="px-3 py-2 text-right">$125.00</td>
                    <td className="px-3 py-2 text-right">$0.00</td>
                    <td className="px-3 py-2 text-right">$25.00</td>
                    <td className="px-3 py-2 text-right text-green-600 font-semibold">$100.00</td>
                    <td className="px-3 py-2"><span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">Paid</span></td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-mono">CLM-8834</td>
                    <td className="px-3 py-2">Johnson, Sarah</td>
                    <td className="px-3 py-2">03/02/26</td>
                    <td className="px-3 py-2 font-mono">99213</td>
                    <td className="px-3 py-2 text-right">$120.00</td>
                    <td className="px-3 py-2 text-right">$100.00</td>
                    <td className="px-3 py-2 text-right">$0.00</td>
                    <td className="px-3 py-2 text-right">$25.00</td>
                    <td className="px-3 py-2 text-right text-green-600 font-semibold">$75.00</td>
                    <td className="px-3 py-2"><span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">Paid</span></td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-mono">CLM-8847</td>
                    <td className="px-3 py-2">Doe, John</td>
                    <td className="px-3 py-2">03/03/26</td>
                    <td className="px-3 py-2 font-mono">99214</td>
                    <td className="px-3 py-2 text-right">$138.00</td>
                    <td className="px-3 py-2 text-right">$125.00</td>
                    <td className="px-3 py-2 text-right">$0.00</td>
                    <td className="px-3 py-2 text-right">$25.00</td>
                    <td className="px-3 py-2 text-right text-green-600 font-semibold">$100.00</td>
                    <td className="px-3 py-2"><span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">Paid</span></td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-mono">CLM-8852</td>
                    <td className="px-3 py-2">Williams, Robert</td>
                    <td className="px-3 py-2">03/04/26</td>
                    <td className="px-3 py-2 font-mono">99215</td>
                    <td className="px-3 py-2 text-right">$200.00</td>
                    <td className="px-3 py-2 text-right">$175.00</td>
                    <td className="px-3 py-2 text-right">$25.00</td>
                    <td className="px-3 py-2 text-right">$25.00</td>
                    <td className="px-3 py-2 text-right text-green-600 font-semibold">$125.00</td>
                    <td className="px-3 py-2"><span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">Paid</span></td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-mono">CLM-8865</td>
                    <td className="px-3 py-2">Chen, Michael</td>
                    <td className="px-3 py-2">03/05/26</td>
                    <td className="px-3 py-2 font-mono">99213</td>
                    <td className="px-3 py-2 text-right">$110.00</td>
                    <td className="px-3 py-2 text-right">$95.00</td>
                    <td className="px-3 py-2 text-right">$0.00</td>
                    <td className="px-3 py-2 text-right">$25.00</td>
                    <td className="px-3 py-2 text-right text-green-600 font-semibold">$70.00</td>
                    <td className="px-3 py-2"><span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">Paid</span></td>
                  </tr>
                </tbody>
                <tfoot className="bg-gray-50 font-semibold">
                  <tr>
                    <td colSpan={4} className="px-3 py-2 text-right">Page Totals (5 of 47 claims shown):</td>
                    <td className="px-3 py-2 text-right">$718.00</td>
                    <td className="px-3 py-2 text-right">$620.00</td>
                    <td className="px-3 py-2 text-right">$25.00</td>
                    <td className="px-3 py-2 text-right">$125.00</td>
                    <td className="px-3 py-2 text-right text-green-600">$470.00</td>
                    <td className="px-3 py-2"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Adjustment Reason Codes */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-700 mb-3">Adjustment Reason Codes</h3>
            <div className="bg-gray-50 rounded-lg p-4 text-sm">
              <div className="grid md:grid-cols-2 gap-2">
                <p><strong>CO-45:</strong> Charges exceed fee schedule/maximum allowable</p>
                <p><strong>PR-1:</strong> Deductible Amount</p>
                <p><strong>PR-2:</strong> Coinsurance Amount</p>
                <p><strong>PR-3:</strong> Co-payment Amount</p>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <h3 className="font-semibold text-blue-800 mb-2">Payment Method</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Payment Method:</strong> ACH Electronic Funds Transfer</p>
                <p><strong>Trace Number:</strong> 202403114521</p>
              </div>
              <div>
                <p><strong>Account:</strong> ****4521</p>
                <p><strong>Payment Date:</strong> March 11, 2026</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-6 text-sm text-gray-500">
            <p className="mb-2"><strong>Questions?</strong> Contact Provider Services at 1-800-555-0124 or email providerservices@clarityhealthnetwork.com</p>
            <p>This Electronic Remittance Advice is generated in accordance with HIPAA 835 transaction standards.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
