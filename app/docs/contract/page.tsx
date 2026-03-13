"use client";

import { Download, Printer } from "lucide-react";

export default function ContractPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end gap-3 mb-4 print:hidden">
          <button onClick={() => window.print()} className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Printer className="w-4 h-4" /> Print
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 print:shadow-none">
          <div className="text-center mb-8 border-b pb-6">
            <h1 className="text-2xl font-bold text-gray-800">Provider Participation Agreement</h1>
            <p className="text-gray-500">Clarity Health Network</p>
            <p className="text-sm text-gray-400 mt-2">Contract #: CTR-2024-001234</p>
          </div>

          <div className="prose prose-sm max-w-none">
            <p className="text-gray-600 mb-6">
              This Provider Participation Agreement ("Agreement") is entered into as of <strong>January 1, 2024</strong>, 
              by and between <strong>Clarity Health Network</strong> ("Network") and the healthcare provider identified below ("Provider").
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">Provider Information</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div><strong>Legal Name:</strong> Cleveland Family Medicine, LLC</div>
                <div><strong>DBA:</strong> Cleveland Family Medicine</div>
                <div><strong>NPI:</strong> 1234567890</div>
                <div><strong>Tax ID:</strong> XX-XXXXXXX</div>
                <div><strong>Address:</strong> 123 Medical Center Dr, Cleveland, OH 44101</div>
                <div><strong>Specialty:</strong> Family Medicine</div>
              </div>
            </div>

            <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-3">1. Term</h2>
            <p className="text-gray-600 mb-4">
              This Agreement shall be effective from <strong>January 1, 2024</strong> through <strong>December 31, 2026</strong> 
              (the "Initial Term"). This Agreement shall automatically renew for successive one-year terms unless either party 
              provides written notice of non-renewal at least ninety (90) days prior to the end of the then-current term.
            </p>

            <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-3">2. Fee Schedule</h2>
            <p className="text-gray-600 mb-4">
              Provider agrees to accept the fee schedule attached hereto as <strong>Exhibit A</strong> as payment in full for 
              Covered Services rendered to Members. The current fee schedule methodology is:
            </p>
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-4">
              <p className="font-semibold text-teal-800">120% of Medicare Allowable</p>
              <p className="text-sm text-teal-700">Based on current Medicare Physician Fee Schedule for Ohio Region</p>
            </div>

            <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-3">3. Provider Obligations</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
              <li>Maintain all required licenses and certifications</li>
              <li>Maintain professional liability insurance with minimum limits of $1,000,000/$3,000,000</li>
              <li>Submit claims within 90 days of date of service</li>
              <li>Accept Network's payment as payment in full (excluding member cost-sharing)</li>
              <li>Comply with Network's quality and credentialing requirements</li>
              <li>Maintain patient records for a minimum of seven (7) years</li>
            </ul>

            <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-3">4. Network Obligations</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
              <li>Process clean claims within 30 days of receipt</li>
              <li>Provide electronic remittance advice (ERA) for all payments</li>
              <li>Include Provider in the Network's provider directory</li>
              <li>Provide reasonable notice of material changes to this Agreement</li>
            </ul>

            <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-3">5. Termination</h2>
            <p className="text-gray-600 mb-4">
              Either party may terminate this Agreement for any reason upon ninety (90) days written notice to the other party.
              Network may terminate immediately for cause, including but not limited to loss of licensure, fraud, or quality concerns.
            </p>

            <div className="mt-8 pt-6 border-t">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className="font-semibold text-gray-800 mb-4">CLARITY HEALTH NETWORK</p>
                  <div className="border-b border-gray-300 mb-2 pb-8"></div>
                  <p className="text-sm text-gray-600">Authorized Signature</p>
                  <p className="text-sm text-gray-500 mt-2">Date: _________________</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 mb-4">PROVIDER</p>
                  <div className="border-b border-gray-300 mb-2 pb-8"></div>
                  <p className="text-sm text-gray-600">Authorized Signature</p>
                  <p className="text-sm text-gray-500 mt-2">Date: _________________</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
