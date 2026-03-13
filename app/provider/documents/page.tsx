"use client";

import { useState } from "react";
import { Search, Upload, Download, FileText, FolderOpen, MoreVertical, Eye } from "lucide-react";

const documents = [
  { id: 1, name: "Provider Agreement 2024.pdf", type: "Contract", size: "2.4 MB", uploadDate: "2024-01-15", category: "Contracts" },
  { id: 2, name: "Fee Schedule - Effective Jan 2024.pdf", type: "Fee Schedule", size: "856 KB", uploadDate: "2024-01-01", category: "Fee Schedules" },
  { id: 3, name: "Quality Metrics Report Q4 2023.pdf", type: "Report", size: "1.2 MB", uploadDate: "2024-01-20", category: "Reports" },
  { id: 4, name: "Dr. Chen - Medical License.pdf", type: "Credential", size: "524 KB", uploadDate: "2023-06-15", category: "Credentials" },
  { id: 5, name: "Malpractice Insurance Certificate.pdf", type: "Insurance", size: "412 KB", uploadDate: "2024-01-02", category: "Credentials" },
  { id: 6, name: "Telehealth Services Addendum.pdf", type: "Contract", size: "1.1 MB", uploadDate: "2024-01-15", category: "Contracts" },
  { id: 7, name: "Payment Summary - February 2024.pdf", type: "Statement", size: "234 KB", uploadDate: "2024-03-01", category: "Payments" },
];

const categories = ["All", "Contracts", "Fee Schedules", "Reports", "Credentials", "Payments"];

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-600">Access contracts, reports, and important documents</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors">
          <Upload className="w-4 h-4" />
          Upload Document
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === cat ? "bg-slate-700 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <div key={doc.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-slate-600" />
              </div>
              <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
            <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">{doc.name}</h3>
            <p className="text-xs text-gray-500 mb-3">{doc.type} • {doc.size}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">{doc.uploadDate}</span>
              <div className="flex items-center gap-1">
                <button className="p-1.5 text-gray-400 hover:text-slate-600 hover:bg-gray-100 rounded transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-slate-600 hover:bg-gray-100 rounded transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredDocs.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No documents found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
          <button onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }} className="text-slate-600 hover:text-slate-800 font-medium">
            Clear filters
          </button>
        </div>
      )}

      <p className="text-sm text-gray-500 text-center">Showing {filteredDocs.length} of {documents.length} documents</p>
    </div>
  );
}
