"use client";

import { useSearchParams } from "next/navigation";
import { ArrowLeft, Download, Printer, Mail, FileText, Building2, DollarSign, Calendar, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ERAViewerPage() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("id") || "PMT-2024-4521";

  // Mock ERA data based on payment ID
  const eraData = {
    paymentId,
    checkNumber: "ACH-" + paymentId.split("-").pop(),
    paymentDate: "March 11, 2024",
    paymentAmount: "$12,450.00",
    provider: {
      name: "Cleveland Family Medicine",
      npi: "1234567890",
      taxId: "XX-XXX4521",
      address: "1234 Main Street, Cleveland, OH 44101",
    },
    payer: {
      name: "Clarity Health Network",
      payerId: "CHN001",
      address: "100 Clarity Way, Cleveland, OH 44115",
    },
    claims: [
      { claimId: "CLM-8821", patient: "John Smith", dos: "03/01/2024", billed: 450.00, allowed: 380.00, paid: 342.00, patientResp: 38.00, adjustments: "CO-45: $70.00" },
      { claimId: "CLM-8834", patient: "Sarah Johnson", dos: "03/02/2024", billed: 225.00, allowed: 200.00, paid: 180.00, patientResp: 20.00, adjustments: "CO-45: $25.00" },
      { claimId: "CLM-8847", patient: "Michael Chen", dos: "03/03/2024", billed: 380.00, allowed: 320.00, paid: 288.00, patientResp: 32.00, adjustments: "CO-45: $60.00" },
      { claimId: "CLM-8852", patient: "Emily Rodriguez", dos: "03/04/2024", billed: 650.00, allowed: 550.00, paid: 495.00, patientResp: 55.00, adjustments: "CO-45: $100.00" },
      { claimId: "CLM-8867", patient: "David Williams", dos: "03/05/2024", billed: 420.00, allowed: 380.00, paid: 342.00, patientResp: 38.00, adjustments: "CO-45: $40.00" },
    ],
    adjustmentCodes: [
      { code: "CO-45", description: "Charge exceeds fee schedule/maximum allowable" },
      { code: "PR-1", description: "Deductible amount" },
      { code: "PR-2", description: "Coinsurance amount" },
      { code: "PR-3", description: "Co-payment amount" },
    ],
  };

  const totalBilled = eraData.claims.reduce((sum, c) => sum + c.billed, 0);
  const totalAllowed = eraData.claims.reduce((sum, c) => sum + c.allowed, 0);
  const totalPaid = eraData.claims.reduce((sum, c) => sum + c.paid, 0);
  const totalPatientResp = eraData.claims.reduce((sum, c) => sum + c.patientResp, 0);

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/admin/payments" className="inline-flex items-center gap-2 text-slate-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
            Back to Payments
          </Link>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">
              <Mail className="w-4 h-4" />
              Email
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>

        {/* ERA Document */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Document Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Electronic Remittance Advice</h1>
                  <p className="text-purple-200">835 Transaction</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold">{eraData.paymentId}</p>
                <p className="text-purple-200">{eraData.checkNumber}</p>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="px-8 py-6 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Payer</h3>
                <p className="font-bold text-gray-900">{eraData.payer.name}</p>
                <p className="text-gray-600 text-sm">Payer ID: {eraData.payer.payerId}</p>
                <p className="text-gray-600 text-sm">{eraData.payer.address}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Provider (Payee)</h3>
                <p className="font-bold text-gray-900">{eraData.provider.name}</p>
                <p className="text-gray-600 text-sm">NPI: {eraData.provider.npi}</p>
                <p className="text-gray-600 text-sm">Tax ID: {eraData.provider.taxId}</p>
                <p className="text-gray-600 text-sm">{eraData.provider.address}</p>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="px-8 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">Payment Date:</span>
                <span className="font-semibold text-gray-900">{eraData.paymentDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-600">Method:</span>
                <span className="font-semibold text-gray-900">ACH Direct Deposit</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-green-500" />
              <span className="text-2xl font-bold text-green-600">{eraData.paymentAmount}</span>
            </div>
          </div>

          {/* Claims Detail */}
          <div className="px-8 py-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Claim Payment Details</h3>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 text-sm font-semibold text-gray-600">Claim ID</th>
                  <th className="text-left py-3 text-sm font-semibold text-gray-600">Patient</th>
                  <th className="text-left py-3 text-sm font-semibold text-gray-600">DOS</th>
                  <th className="text-right py-3 text-sm font-semibold text-gray-600">Billed</th>
                  <th className="text-right py-3 text-sm font-semibold text-gray-600">Allowed</th>
                  <th className="text-right py-3 text-sm font-semibold text-gray-600">Paid</th>
                  <th className="text-right py-3 text-sm font-semibold text-gray-600">Pt Resp</th>
                  <th className="text-left py-3 text-sm font-semibold text-gray-600">Adjustments</th>
                </tr>
              </thead>
              <tbody>
                {eraData.claims.map((claim) => (
                  <tr key={claim.claimId} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 font-mono text-purple-600 text-sm">{claim.claimId}</td>
                    <td className="py-3 text-gray-900">{claim.patient}</td>
                    <td className="py-3 text-gray-600 text-sm">{claim.dos}</td>
                    <td className="py-3 text-right text-gray-900">${claim.billed.toFixed(2)}</td>
                    <td className="py-3 text-right text-gray-900">${claim.allowed.toFixed(2)}</td>
                    <td className="py-3 text-right text-green-600 font-semibold">${claim.paid.toFixed(2)}</td>
                    <td className="py-3 text-right text-amber-600">${claim.patientResp.toFixed(2)}</td>
                    <td className="py-3 text-gray-500 text-sm">{claim.adjustments}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 font-semibold">
                  <td colSpan={3} className="py-3 text-gray-700">Totals ({eraData.claims.length} claims)</td>
                  <td className="py-3 text-right text-gray-900">${totalBilled.toFixed(2)}</td>
                  <td className="py-3 text-right text-gray-900">${totalAllowed.toFixed(2)}</td>
                  <td className="py-3 text-right text-green-600">${totalPaid.toFixed(2)}</td>
                  <td className="py-3 text-right text-amber-600">${totalPatientResp.toFixed(2)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Adjustment Code Reference */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Adjustment Code Reference</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {eraData.adjustmentCodes.map((code) => (
                <div key={code.code} className="flex items-start gap-2">
                  <span className="font-mono text-purple-600 font-medium">{code.code}:</span>
                  <span className="text-gray-600">{code.description}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-gray-100 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              This Electronic Remittance Advice complies with HIPAA ASC X12 835 standards. 
              For questions, contact provider services at 1-800-CLARITY.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
