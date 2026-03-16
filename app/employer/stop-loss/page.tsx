"use client";

import { Shield, AlertTriangle, TrendingUp, DollarSign, User, Calendar, ArrowRight, Info } from "lucide-react";

const islClaims = [
  { id: "ISL-001", member: "Member A", ytdClaims: 89500, attachment: 100000, percentage: 89.5, status: "monitor" },
  { id: "ISL-002", member: "Member B", ytdClaims: 72300, attachment: 100000, percentage: 72.3, status: "normal" },
  { id: "ISL-003", member: "Member C", ytdClaims: 95200, attachment: 100000, percentage: 95.2, status: "alert" },
  { id: "ISL-004", member: "Member D", ytdClaims: 45600, attachment: 100000, percentage: 45.6, status: "normal" },
  { id: "ISL-005", member: "Member E", ytdClaims: 112000, attachment: 100000, percentage: 112.0, status: "exceeded" },
];

const aslSummary = {
  attachmentPoint: 1500000,
  ytdClaims: 1247830,
  percentage: 83.2,
  projectedYearEnd: 1680000,
  corridor: 125,
};

export default function StopLossPage() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "exceeded": return <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">Exceeded</span>;
      case "alert": return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">Alert</span>;
      case "monitor": return <span className="px-2 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-full">Monitor</span>;
      default: return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Normal</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stop-Loss Tracking</h1>
          <p className="text-gray-500">Individual and aggregate stop-loss monitoring</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
          <Info className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-blue-700">Policy Year: Jan 1 - Dec 31, 2026</span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* ISL Summary */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-teal-600" />
              <h2 className="font-semibold text-gray-900">Individual Stop-Loss (ISL)</h2>
            </div>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Attachment Point</span>
              <span className="font-semibold text-gray-900">$100,000</span>
            </div>
            <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-100">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">1</p>
                <p className="text-xs text-gray-500">Exceeded</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-teal-600">2</p>
                <p className="text-xs text-gray-500">Monitor (&gt;80%)</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-600">847</p>
                <p className="text-xs text-gray-500">Total Members</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">ISL Reimbursements YTD</span>
              <span className="font-semibold text-green-600">$12,000</span>
            </div>
          </div>
        </div>

        {/* ASL Summary */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-teal-600" />
              <h2 className="font-semibold text-gray-900">Aggregate Stop-Loss (ASL)</h2>
            </div>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Attachment Point (125% corridor)</span>
              <span className="font-semibold text-gray-900">${(aslSummary.attachmentPoint).toLocaleString()}</span>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">YTD Claims vs. Attachment</span>
                <span className="text-sm font-medium text-teal-600">{aslSummary.percentage}%</span>
              </div>
              <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-teal-500 rounded-full"
                  style={{ width: `${Math.min(aslSummary.percentage, 100)}%` }}
                />
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>$0</span>
                <span>${(aslSummary.attachmentPoint).toLocaleString()}</span>
              </div>
            </div>
            <div className="flex items-center justify-between py-4 border-t border-gray-100">
              <div>
                <p className="text-sm text-gray-500">Projected Year-End</p>
                <p className="font-semibold text-gray-900">${aslSummary.projectedYearEnd.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Projected vs. Attachment</p>
                <p className="font-semibold text-green-600">-$180K under</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* High Cost Claimants */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">High Cost Claimants (ISL Tracking)</h2>
          <span className="text-sm text-gray-500">Showing members &gt; 40% of attachment</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Member</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">YTD Claims</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Attachment</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Progress</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {islClaims.map((claim) => (
                <tr key={claim.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-sm text-gray-500">{claim.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{claim.member}</td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">${claim.ytdClaims.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-gray-500">${claim.attachment.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            claim.percentage >= 100 ? "bg-purple-500" :
                            claim.percentage >= 90 ? "bg-red-500" :
                            claim.percentage >= 80 ? "bg-teal-500" : "bg-green-500"
                          }`}
                          style={{ width: `${Math.min(claim.percentage, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-600 w-12">{claim.percentage}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(claim.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Carrier Info */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Stop-Loss Carrier</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Carrier</p>
            <p className="font-medium text-gray-900">Berkshire Hathaway</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Policy Number</p>
            <p className="font-medium text-gray-900">SL-2026-AC-45821</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Account Manager</p>
            <p className="font-medium text-gray-900">Jennifer Walsh</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Contact</p>
            <p className="font-medium text-teal-600">jennifer.walsh@bhspec.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
