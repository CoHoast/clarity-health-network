"use client";

import { FileText, Download, Search, FolderOpen, Shield, Calendar, Upload, Eye } from "lucide-react";

const documentCategories = [
  { name: "Plan Documents", count: 8, icon: FileText },
  { name: "Compliance", count: 5, icon: Shield },
  { name: "Forms", count: 12, icon: FolderOpen },
  { name: "Notices", count: 6, icon: Calendar },
];

const documents = [
  { name: "Summary Plan Description (SPD)", category: "Plan Documents", date: "Jan 1, 2026", size: "2.4 MB", type: "PDF" },
  { name: "HIPAA Privacy Notice", category: "Compliance", date: "Jan 1, 2026", size: "145 KB", type: "PDF" },
  { name: "COBRA General Notice", category: "Compliance", date: "Jan 1, 2026", size: "98 KB", type: "PDF" },
  { name: "Enrollment Form", category: "Forms", date: "Jan 1, 2026", size: "234 KB", type: "PDF" },
  { name: "Waiver of Coverage Form", category: "Forms", date: "Jan 1, 2026", size: "112 KB", type: "PDF" },
  { name: "Dependent Verification Form", category: "Forms", date: "Jan 1, 2026", size: "167 KB", type: "PDF" },
  { name: "ERISA Rights Notice", category: "Compliance", date: "Jan 1, 2026", size: "89 KB", type: "PDF" },
  { name: "Annual Fee Disclosure", category: "Notices", date: "Mar 1, 2026", size: "78 KB", type: "PDF" },
  { name: "Mental Health Parity Notice", category: "Compliance", date: "Jan 1, 2026", size: "65 KB", type: "PDF" },
  { name: "Provider Directory", category: "Plan Documents", date: "Mar 1, 2026", size: "5.2 MB", type: "PDF" },
];

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-500">Plan documents, compliance notices, and forms</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 font-medium">
          <Upload className="w-4 h-4" />
          Upload Document
        </button>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {documentCategories.map((cat) => (
          <button key={cat.name} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:border-amber-300 hover:bg-amber-50 text-left transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <cat.icon className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{cat.name}</p>
                <p className="text-sm text-gray-500">{cat.count} documents</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
          <select className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white">
            <option>All Categories</option>
            <option>Plan Documents</option>
            <option>Compliance</option>
            <option>Forms</option>
            <option>Notices</option>
          </select>
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Document</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Updated</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Size</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {documents.map((doc, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{doc.name}</p>
                        <p className="text-xs text-gray-500">{doc.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">{doc.category}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{doc.date}</td>
                  <td className="px-4 py-3 text-gray-500">{doc.size}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded" title="Download">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compliance Calendar */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Compliance Calendar</h2>
        <div className="space-y-3">
          {[
            { notice: "Annual Fee Disclosure", dueDate: "Mar 31, 2026", status: "complete" },
            { notice: "Medicare Part D Notice", dueDate: "Oct 15, 2026", status: "upcoming" },
            { notice: "CHIP Notice", dueDate: "Oct 15, 2026", status: "upcoming" },
            { notice: "Women's Health Notice", dueDate: "Dec 31, 2026", status: "upcoming" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${item.status === "complete" ? "bg-green-500" : "bg-amber-500"}`} />
                <span className="text-sm text-gray-700">{item.notice}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">Due: {item.dueDate}</span>
                {item.status === "complete" && (
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">Complete</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
