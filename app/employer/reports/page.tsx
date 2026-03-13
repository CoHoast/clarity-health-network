"use client";

import { FileText, Download, Calendar, Clock, Mail, Plus, BarChart3, Users, DollarSign, Shield } from "lucide-react";

const reportTemplates = [
  { name: "Monthly Utilization Summary", description: "Claims, spend, and utilization metrics", icon: BarChart3, category: "Analytics" },
  { name: "Enrollment Census", description: "Current enrollment with demographics", icon: Users, category: "Enrollment" },
  { name: "Claims Detail Report", description: "Anonymized claims data export", icon: FileText, category: "Claims" },
  { name: "Cost Trend Analysis", description: "Year-over-year cost comparison", icon: DollarSign, category: "Financial" },
  { name: "Stop-Loss Proximity", description: "ISL/ASL attachment tracking", icon: Shield, category: "Risk" },
  { name: "ERISA Compliance", description: "Required compliance documentation", icon: FileText, category: "Compliance" },
];

const scheduledReports = [
  { name: "Monthly Utilization Summary", frequency: "Monthly", nextRun: "Apr 1, 2026", recipients: 3 },
  { name: "Enrollment Census", frequency: "Weekly", nextRun: "Mar 18, 2026", recipients: 2 },
];

const recentReports = [
  { name: "Monthly Utilization Summary", generated: "Mar 1, 2026", size: "245 KB", format: "PDF" },
  { name: "Enrollment Census", generated: "Mar 11, 2026", size: "128 KB", format: "Excel" },
  { name: "Claims Detail Report", generated: "Feb 28, 2026", size: "1.2 MB", format: "Excel" },
  { name: "Cost Trend Analysis", generated: "Feb 15, 2026", size: "312 KB", format: "PDF" },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-500">Generate, schedule, and download reports</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 font-medium">
          <Plus className="w-4 h-4" />
          Schedule Report
        </button>
      </div>

      {/* Report Templates */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Report Templates</h2>
          <p className="text-sm text-gray-500">Select a template to generate a report</p>
        </div>
        <div className="p-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTemplates.map((report) => (
            <button key={report.name} className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl hover:border-amber-300 hover:bg-amber-50 text-left transition-colors">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <report.icon className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{report.name}</p>
                <p className="text-sm text-gray-500 mt-0.5">{report.description}</p>
                <span className="inline-block mt-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">{report.category}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Scheduled Reports */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Scheduled Reports</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {scheduledReports.map((report) => (
              <div key={report.name} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{report.name}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />{report.frequency}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Mail className="w-3 h-3" />{report.recipients} recipients
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Next run</p>
                  <p className="text-sm font-medium text-gray-900">{report.nextRun}</p>
                </div>
              </div>
            ))}
            {scheduledReports.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No scheduled reports
              </div>
            )}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Recent Reports</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {recentReports.map((report, i) => (
              <div key={i} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{report.name}</p>
                    <p className="text-xs text-gray-500">{report.generated} • {report.size}</p>
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom Report Builder CTA */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">Need a Custom Report?</h3>
            <p className="text-gray-300 mt-1">Our team can create custom analytics tailored to your needs.</p>
          </div>
          <button className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 font-medium">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
