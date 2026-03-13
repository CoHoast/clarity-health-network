"use client";

import { useState } from "react";
import { ArrowLeft, FileText, Building2, Calendar, DollarSign, Download, Printer, CheckCircle, Clock, HelpCircle, Check } from "lucide-react";
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
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  const generateAndDownloadPDF = () => {
    setDownloadingPdf(true);
    
    // Generate EOB HTML content
    const eobContent = `
<!DOCTYPE html>
<html>
<head>
  <title>EOB - ${mockClaim.id}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #333; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #0d9488; padding-bottom: 20px; margin-bottom: 30px; }
    .logo { font-size: 24px; font-weight: bold; color: #0d9488; }
    .logo span { color: #10b981; }
    .document-title { text-align: right; }
    .document-title h1 { margin: 0; font-size: 18px; color: #666; }
    .document-title p { margin: 5px 0 0; color: #999; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
    .info-box { background: #f8f9fa; padding: 20px; border-radius: 8px; }
    .info-box h3 { margin: 0 0 10px; font-size: 12px; text-transform: uppercase; color: #666; letter-spacing: 0.5px; }
    .info-box p { margin: 5px 0; }
    .status-badge { display: inline-block; background: #dcfce7; color: #166534; padding: 6px 12px; border-radius: 20px; font-weight: 600; font-size: 14px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background: #f1f5f9; padding: 12px; text-align: left; font-size: 12px; text-transform: uppercase; color: #64748b; border-bottom: 2px solid #e2e8f0; }
    td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
    .text-right { text-align: right; }
    .total-row { background: #f8fafc; font-weight: bold; }
    .total-row td { border-top: 2px solid #e2e8f0; }
    .summary-box { background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 8px; padding: 20px; margin-top: 30px; }
    .summary-row { display: flex; justify-content: space-between; padding: 8px 0; }
    .summary-row.total { border-top: 2px solid #14b8a6; margin-top: 10px; padding-top: 15px; font-size: 18px; }
    .amount-due { color: #0d9488; font-weight: bold; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #666; }
    .help-text { background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 15px; margin-top: 30px; }
    .help-text h4 { margin: 0 0 8px; color: #92400e; }
    .help-text p { margin: 0; color: #a16207; font-size: 13px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">Clarity<span>Health</span></div>
    <div class="document-title">
      <h1>Explanation of Benefits</h1>
      <p>This is not a bill</p>
    </div>
  </div>

  <div style="margin-bottom: 20px;">
    <span class="status-badge">✓ Claim Paid</span>
  </div>

  <div class="info-grid">
    <div class="info-box">
      <h3>Patient Information</h3>
      <p><strong>${mockClaim.patient}</strong></p>
      <p>Member ID: CHN-123456</p>
      <p>Group: GRP-78901</p>
    </div>
    <div class="info-box">
      <h3>Claim Information</h3>
      <p><strong>Claim #:</strong> ${mockClaim.id}</p>
      <p><strong>Date of Service:</strong> ${mockClaim.dateOfService}</p>
      <p><strong>Processed:</strong> ${mockClaim.processedDate}</p>
    </div>
    <div class="info-box">
      <h3>Provider Information</h3>
      <p><strong>${mockClaim.provider.name}</strong></p>
      <p>${mockClaim.provider.address}</p>
      <p>${mockClaim.provider.phone}</p>
    </div>
    <div class="info-box">
      <h3>Plan Information</h3>
      <p><strong>Plan:</strong> Clarity Health PPO</p>
      <p><strong>Network:</strong> In-Network</p>
      <p><strong>Coinsurance:</strong> ${mockClaim.coinsurance}</p>
    </div>
  </div>

  <h2 style="font-size: 16px; color: #333; margin-bottom: 15px;">Services Provided</h2>
  <table>
    <thead>
      <tr>
        <th>Service Description</th>
        <th>CPT Code</th>
        <th class="text-right">Billed</th>
        <th class="text-right">Allowed</th>
        <th class="text-right">Plan Paid</th>
        <th class="text-right">You Pay</th>
      </tr>
    </thead>
    <tbody>
      ${mockClaim.serviceLines.map(line => `
        <tr>
          <td>${line.description}</td>
          <td>${line.cpt}</td>
          <td class="text-right">$${line.billed.toFixed(2)}</td>
          <td class="text-right">$${line.allowed.toFixed(2)}</td>
          <td class="text-right">$${line.planPaid.toFixed(2)}</td>
          <td class="text-right">$${line.youPay.toFixed(2)}</td>
        </tr>
      `).join('')}
      <tr class="total-row">
        <td colspan="2"><strong>TOTALS</strong></td>
        <td class="text-right">$${mockClaim.totals.billed.toFixed(2)}</td>
        <td class="text-right">$${mockClaim.totals.allowed.toFixed(2)}</td>
        <td class="text-right">$${mockClaim.totals.planPaid.toFixed(2)}</td>
        <td class="text-right"><strong>$${mockClaim.totals.youPay.toFixed(2)}</strong></td>
      </tr>
    </tbody>
  </table>

  <div class="summary-box">
    <h3 style="margin: 0 0 15px; font-size: 14px; color: #0f766e;">Payment Summary</h3>
    <div class="summary-row">
      <span>Total Billed by Provider</span>
      <span>$${mockClaim.totals.billed.toFixed(2)}</span>
    </div>
    <div class="summary-row">
      <span>Network Discount (You Save!)</span>
      <span style="color: #16a34a;">-$${(mockClaim.totals.billed - mockClaim.totals.allowed).toFixed(2)}</span>
    </div>
    <div class="summary-row">
      <span>Amount Covered by Plan</span>
      <span style="color: #16a34a;">$${mockClaim.totals.planPaid.toFixed(2)}</span>
    </div>
    <div class="summary-row">
      <span>Deductible Applied</span>
      <span>$${mockClaim.deductibleApplied.toFixed(2)}</span>
    </div>
    <div class="summary-row">
      <span>Coinsurance (${mockClaim.coinsurance})</span>
      <span>$${mockClaim.totals.youPay.toFixed(2)}</span>
    </div>
    <div class="summary-row total">
      <span><strong>Your Responsibility</strong></span>
      <span class="amount-due">$${mockClaim.totals.youPay.toFixed(2)}</span>
    </div>
  </div>

  <div class="help-text">
    <h4>Questions About This EOB?</h4>
    <p>Contact Member Services at 1-800-555-0123 or visit member.clarityhealth.com for help understanding your benefits.</p>
  </div>

  <div class="footer">
    <p><strong>Clarity Health Network</strong> | Member Services: 1-800-555-0123 | www.clarityhealth.com</p>
    <p>This Explanation of Benefits (EOB) is a summary of how your claim was processed. Please keep for your records.</p>
    <p style="margin-top: 10px; color: #999;">Generated on ${new Date().toLocaleDateString()} | Document ID: EOB-${mockClaim.id}</p>
  </div>
</body>
</html>`;

    // Create blob and trigger download
    const blob = new Blob([eobContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Create a hidden iframe to print/save as PDF
    const printWindow = window.open(url, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 250);
      };
    }

    // Also create a direct download link for the HTML version
    const link = document.createElement('a');
    link.href = url;
    link.download = `EOB-${mockClaim.id}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloadingPdf(false);
      setDownloadComplete(true);
      setTimeout(() => setDownloadComplete(false), 2000);
      URL.revokeObjectURL(url);
    }, 500);
  };

  const handlePrint = () => {
    window.print();
  };

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
          <button 
            onClick={handlePrint}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg" 
            title="Print"
          >
            <Printer className="w-5 h-5" />
          </button>
          <button 
            onClick={generateAndDownloadPDF}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg" 
            title="Download PDF"
          >
            {downloadComplete ? <Check className="w-5 h-5 text-green-500" /> : <Download className="w-5 h-5" />}
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
              <button 
                onClick={generateAndDownloadPDF}
                disabled={downloadingPdf}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {downloadComplete ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    Downloaded!
                  </>
                ) : downloadingPdf ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Download PDF
                  </>
                )}
              </button>
              <button 
                onClick={handlePrint}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2"
              >
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
