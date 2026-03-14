"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Download, Search, FolderOpen, Shield, Calendar, Upload, Eye, X, Check } from "lucide-react";

const documentCategories = [
  { id: "all", name: "All Documents", count: 31, icon: FolderOpen },
  { id: "plan", name: "Plan Documents", count: 8, icon: FileText },
  { id: "compliance", name: "Compliance", count: 5, icon: Shield },
  { id: "forms", name: "Forms", count: 12, icon: FolderOpen },
  { id: "notices", name: "Notices", count: 6, icon: Calendar },
];

const documents = [
  { id: "1", name: "Summary Plan Description (SPD)", category: "plan", date: "Jan 1, 2026", size: "2.4 MB", type: "PDF" },
  { id: "2", name: "HIPAA Privacy Notice", category: "compliance", date: "Jan 1, 2026", size: "145 KB", type: "PDF" },
  { id: "3", name: "COBRA General Notice", category: "compliance", date: "Jan 1, 2026", size: "98 KB", type: "PDF" },
  { id: "4", name: "Enrollment Form", category: "forms", date: "Jan 1, 2026", size: "234 KB", type: "PDF" },
  { id: "5", name: "Waiver of Coverage Form", category: "forms", date: "Jan 1, 2026", size: "112 KB", type: "PDF" },
  { id: "6", name: "Dependent Verification Form", category: "forms", date: "Jan 1, 2026", size: "167 KB", type: "PDF" },
  { id: "7", name: "ERISA Rights Notice", category: "compliance", date: "Jan 1, 2026", size: "89 KB", type: "PDF" },
  { id: "8", name: "Annual Fee Disclosure", category: "notices", date: "Mar 1, 2026", size: "78 KB", type: "PDF" },
  { id: "9", name: "Mental Health Parity Notice", category: "compliance", date: "Jan 1, 2026", size: "65 KB", type: "PDF" },
  { id: "10", name: "Provider Directory", category: "plan", date: "Mar 1, 2026", size: "5.2 MB", type: "PDF" },
  { id: "11", name: "Benefits Summary", category: "plan", date: "Jan 1, 2026", size: "1.8 MB", type: "PDF" },
  { id: "12", name: "Network Comparison Chart", category: "plan", date: "Jan 1, 2026", size: "456 KB", type: "PDF" },
  { id: "13", name: "Prescription Drug List", category: "plan", date: "Feb 15, 2026", size: "892 KB", type: "PDF" },
  { id: "14", name: "Life Event Change Form", category: "forms", date: "Jan 1, 2026", size: "198 KB", type: "PDF" },
  { id: "15", name: "Direct Deposit Authorization", category: "forms", date: "Jan 1, 2026", size: "87 KB", type: "PDF" },
  { id: "16", name: "Open Enrollment Guide", category: "notices", date: "Oct 1, 2025", size: "3.2 MB", type: "PDF" },
  { id: "17", name: "Wellness Program Overview", category: "plan", date: "Jan 1, 2026", size: "654 KB", type: "PDF" },
  { id: "18", name: "Claims Appeal Form", category: "forms", date: "Jan 1, 2026", size: "145 KB", type: "PDF" },
  { id: "19", name: "FSA Enrollment Form", category: "forms", date: "Jan 1, 2026", size: "178 KB", type: "PDF" },
  { id: "20", name: "HSA Contribution Form", category: "forms", date: "Jan 1, 2026", size: "156 KB", type: "PDF" },
];

export default function DocumentsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showViewModal, setShowViewModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<typeof documents[0] | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const filteredDocuments = documents.filter((doc) => {
    const matchesCategory = activeCategory === "all" || doc.category === activeCategory;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleView = (doc: typeof documents[0]) => {
    setSelectedDocument(doc);
    setShowViewModal(true);
  };

  const handleDownload = (doc: typeof documents[0]) => {
    setDownloadSuccess(doc.id);
    setTimeout(() => setDownloadSuccess(null), 2000);
  };

  const handleUpload = () => {
    setUploadSuccess(true);
    setTimeout(() => {
      setShowUploadModal(false);
      setUploadSuccess(false);
    }, 2000);
  };

  const getCategoryLabel = (category: string) => {
    const cat = documentCategories.find(c => c.id === category);
    return cat ? cat.name : category;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-500">Plan documents, compliance notices, and forms</p>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium"
        >
          <Upload className="w-4 h-4" />
          Upload Document
        </button>
      </div>

      {/* Category Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 p-2 shadow-sm">
        <div className="flex gap-2 flex-wrap">
          {documentCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === cat.id
                  ? "bg-teal-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.name}
              <span className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
                activeCategory === cat.id
                  ? "bg-white/20 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}>
                {cat.id === "all" ? documents.length : documents.filter(d => d.category === cat.id).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-teal-500"
          />
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
              {filteredDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
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
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">{getCategoryLabel(doc.category)}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{doc.date}</td>
                  <td className="px-4 py-3 text-gray-500">{doc.size}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {downloadSuccess === doc.id ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                          <Check className="w-3 h-3" /> Downloaded
                        </span>
                      ) : (
                        <>
                          <button 
                            onClick={() => handleView(doc)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded" 
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDownload(doc)}
                            className="p-1.5 text-gray-400 hover:text-cyan-600 hover:bg-teal-50 rounded" 
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-500">Showing {filteredDocuments.length} of {documents.length} documents</p>
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

      {/* View Document Modal */}
      <AnimatePresence>
        {showViewModal && selectedDocument && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowViewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedDocument.name}</h3>
                    <p className="text-sm text-gray-500">{selectedDocument.size} • Updated {selectedDocument.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleDownload(selectedDocument)}
                    className="px-3 py-1.5 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 flex items-center gap-1"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button onClick={() => setShowViewModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>
              <div className="flex-1 bg-gray-100 p-8 overflow-auto">
                {/* Simulated PDF Preview */}
                <div className="bg-white shadow-lg rounded-lg max-w-2xl mx-auto">
                  <div className="p-8 space-y-6">
                    <div className="text-center border-b border-gray-200 pb-6">
                      <h1 className="text-2xl font-bold text-gray-900">{selectedDocument.name}</h1>
                      <p className="text-gray-500 mt-2">MedCare Health Network</p>
                      <p className="text-sm text-gray-400">Effective Date: January 1, 2026</p>
                    </div>
                    
                    <div className="space-y-4">
                      <h2 className="text-lg font-semibold text-gray-800">Overview</h2>
                      <p className="text-gray-600 leading-relaxed">
                        This document provides important information about your health plan benefits, 
                        coverage details, and member responsibilities. Please review this information 
                        carefully and retain it for your records.
                      </p>
                      
                      <h2 className="text-lg font-semibold text-gray-800 pt-4">Key Information</h2>
                      <ul className="list-disc list-inside text-gray-600 space-y-2">
                        <li>Plan Year: January 1, 2026 - December 31, 2026</li>
                        <li>Network: MedCare Health PPO Network</li>
                        <li>Member Services: 1-800-MEDCARE</li>
                        <li>Website: members.medcarehealthnetwork.com</li>
                      </ul>
                      
                      <h2 className="text-lg font-semibold text-gray-800 pt-4">Contact Information</h2>
                      <p className="text-gray-600">
                        For questions about this document or your benefits, please contact:<br />
                        <strong>Member Services:</strong> 1-800-252-7489<br />
                        <strong>Hours:</strong> Monday - Friday, 8am - 8pm EST
                      </p>
                    </div>
                    
                    <div className="text-center text-gray-400 text-sm pt-6 border-t border-gray-200">
                      Page 1 of {Math.floor(Math.random() * 20) + 5}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowUploadModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full"
            >
              {uploadSuccess ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Complete!</h3>
                  <p className="text-gray-500">Your document has been uploaded successfully.</p>
                </div>
              ) : (
                <>
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Upload Document</h3>
                    <button onClick={() => setShowUploadModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-teal-500 transition-colors cursor-pointer">
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 font-medium">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-400 mt-1">PDF, DOC, DOCX up to 10MB</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Document Name</label>
                      <input 
                        type="text" 
                        placeholder="Enter document name..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-teal-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-teal-500">
                        <option>Plan Documents</option>
                        <option>Compliance</option>
                        <option>Forms</option>
                        <option>Notices</option>
                      </select>
                    </div>
                  </div>
                  <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
                    <button 
                      onClick={() => setShowUploadModal(false)}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleUpload}
                      className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Upload
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
