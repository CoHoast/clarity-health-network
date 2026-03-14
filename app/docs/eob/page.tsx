"use client";

import { Download, Printer } from "lucide-react";

export default function EOBPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Action Bar */}
        <div className="flex justify-end gap-3 mb-4 print:hidden">
          <button onClick={() => window.print()} className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Printer className="w-4 h-4" /> Print
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>

        {/* EOB Document */}
        <div className="bg-white rounded-lg shadow-lg p-8 print:shadow-none">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-gray-200 pb-6 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-teal-600">MedCare Health Network</h1>
              <p className="text-gray-500">Explanation of Benefits</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">EOB Date</p>
              <p className="font-semibold">March 12, 2026</p>
            </div>
          </div>

          {/* Member Info */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-2">Member Information</h3>
              <p className="text-sm"><strong>Name:</strong> John Doe</p>
              <p className="text-sm"><strong>Member ID:</strong> CHN-123456</p>
              <p className="text-sm"><strong>Group:</strong> Acme Corporation</p>
              <p className="text-sm"><strong>Plan:</strong> Gold PPO</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-2">Claim Information</h3>
              <p className="text-sm"><strong>Claim Number:</strong> CLM-2024-8847</p>
              <p className="text-sm"><strong>Date of Service:</strong> March 10, 2026</p>
              <p className="text-sm"><strong>Date Processed:</strong> March 12, 2026</p>
              <p className="text-sm"><strong>Status:</strong> <span className="text-green-600 font-medium">Processed</span></p>
            </div>
          </div>

          {/* Provider Info */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-700 mb-2">Provider</h3>
            <p className="text-sm">Cleveland Family Medicine</p>
            <p className="text-sm text-gray-500">123 Medical Center Dr, Cleveland, OH 44101</p>
            <p className="text-sm text-gray-500">NPI: 1234567890</p>
          </div>

          {/* Services Table */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-700 mb-3">Services Provided</h3>
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Service</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Code</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-gray-600">Billed</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-gray-600">Allowed</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-gray-600">Plan Paid</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-gray-600">You Owe</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 text-sm">Office Visit - Established Patient</td>
                  <td className="px-4 py-3 text-sm font-mono">99214</td>
                  <td className="px-4 py-3 text-sm text-right">$138.00</td>
                  <td className="px-4 py-3 text-sm text-right">$125.00</td>
                  <td className="px-4 py-3 text-sm text-right text-green-600">$100.00</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold">$25.00</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-8">
            <h3 className="font-semibold text-teal-800 mb-3">Payment Summary</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p className="text-gray-600">Total Billed:</p>
              <p className="text-right">$138.00</p>
              <p className="text-gray-600">Network Discount:</p>
              <p className="text-right text-green-600">-$13.00</p>
              <p className="text-gray-600">Allowed Amount:</p>
              <p className="text-right">$125.00</p>
              <p className="text-gray-600">Plan Paid:</p>
              <p className="text-right text-green-600">$100.00</p>
              <p className="text-gray-600">Applied to Deductible:</p>
              <p className="text-right">$0.00</p>
              <p className="text-gray-600">Copay:</p>
              <p className="text-right">$25.00</p>
              <hr className="col-span-2 border-teal-200 my-2" />
              <p className="font-semibold text-teal-800">Your Responsibility:</p>
              <p className="text-right font-bold text-teal-800">$25.00</p>
            </div>
          </div>

          {/* Deductible Status */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-700 mb-3">Your Deductible Status</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span>Individual Deductible</span>
                  <span>$850 of $1,500</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full" style={{ width: "57%" }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-6 text-sm text-gray-500">
            <p className="mb-2"><strong>This is not a bill.</strong> You may receive a separate bill from your provider for the amount you owe.</p>
            <p>If you have questions about this EOB, please contact Member Services at 1-800-555-0123 or visit medcarehealthnetwork.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
