"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Upload, Download, FileText, FolderOpen, MoreVertical, Eye, X, CheckCircle, Trash2, Share2, Printer } from "lucide-react";

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
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState<typeof documents[0] | null>(null);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = (doc: typeof documents[0]) => {
    // Simulate download by opening the docs page
    window.open('/docs/contract', '_blank');
  };

  const handleUpload = () => {
    setUploadSuccess(true);
    setTimeout(() => {
      setShowUploadModal(false);
      setUploadSuccess(false);
      setUploadedFiles([]);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-600">Access contracts, reports, and important documents</p>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
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
          <div key={doc.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow relative">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-slate-600" />
              </div>
              <div className="relative">
                <button 
                  onClick={() => setActiveMenu(activeMenu === doc.id ? null : doc.id)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                
                {/* Dropdown Menu */}
                <AnimatePresence>
                  {activeMenu === doc.id && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10"
                    >
                      <button 
                        onClick={() => { setShowViewModal(doc); setActiveMenu(null); }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Document
                      </button>
                      <button 
                        onClick={() => { handleDownload(doc); setActiveMenu(null); }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                      <button 
                        onClick={() => { window.print(); setActiveMenu(null); }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Printer className="w-4 h-4" />
                        Print
                      </button>
                      <button 
                        onClick={() => setActiveMenu(null)}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Share2 className="w-4 h-4" />
                        Share
                      </button>
                      <hr className="my-1" />
                      <button 
                        onClick={() => setActiveMenu(null)}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">{doc.name}</h3>
            <p className="text-xs text-gray-500 mb-3">{doc.type} • {doc.size}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">{doc.uploadDate}</span>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setShowViewModal(doc)}
                  className="p-1.5 text-gray-400 hover:text-slate-600 hover:bg-gray-100 rounded transition-colors"
                  title="View"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDownload(doc)}
                  className="p-1.5 text-gray-400 hover:text-slate-600 hover:bg-gray-100 rounded transition-colors"
                  title="Download"
                >
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

      {/* View Document Modal */}
      <AnimatePresence>
        {showViewModal && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowViewModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-4xl h-[80vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{showViewModal.name}</h3>
                  <p className="text-sm text-gray-500">{showViewModal.type} • {showViewModal.size}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleDownload(showViewModal)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                    title="Download"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => window.print()}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                    title="Print"
                  >
                    <Printer className="w-5 h-5" />
                  </button>
                  <button onClick={() => setShowViewModal(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Document Preview */}
              <div className="flex-1 bg-gray-100 p-8 overflow-auto">
                <div className="bg-white rounded-lg shadow-lg max-w-2xl mx-auto p-8">
                  {/* Mock document content */}
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-slate-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">{showViewModal.name.replace('.pdf', '')}</h1>
                    <p className="text-gray-500 mt-2">TrueCare Health Network</p>
                  </div>

                  <div className="space-y-6 text-sm text-gray-700">
                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-gray-500">Document Type</p>
                        <p className="font-medium">{showViewModal.type}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Category</p>
                        <p className="font-medium">{showViewModal.category}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">File Size</p>
                        <p className="font-medium">{showViewModal.size}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Upload Date</p>
                        <p className="font-medium">{showViewModal.uploadDate}</p>
                      </div>
                    </div>

                    <div>
                      <h2 className="font-semibold text-gray-900 mb-2">Document Preview</h2>
                      <p className="text-gray-600">
                        This is a preview of <strong>{showViewModal.name}</strong>. In a production environment, 
                        this would display the actual PDF content using a document viewer.
                      </p>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <h2 className="font-semibold text-gray-900 mb-2">Document Details</h2>
                      <ul className="space-y-2 text-gray-600">
                        <li>• Document ID: DOC-{String(showViewModal.id).padStart(6, '0')}</li>
                        <li>• Status: Active</li>
                        <li>• Last Modified: {showViewModal.uploadDate}</li>
                        <li>• Access Level: Provider</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => setShowViewModal(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => handleDownload(showViewModal)}
                  className="px-4 py-2 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Upload Document Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowUploadModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {uploadSuccess ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Upload Complete!</h3>
                  <p className="text-gray-600">Your document has been uploaded successfully.</p>
                </div>
              ) : (
                <>
                  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Upload Document</h3>
                    <button onClick={() => setShowUploadModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Document Category</label>
                      <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500">
                        <option>Contracts</option>
                        <option>Credentials</option>
                        <option>Reports</option>
                        <option>Fee Schedules</option>
                        <option>Payments</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Document Name (Optional)</label>
                      <input
                        type="text"
                        placeholder="Enter a name for this document"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                      />
                    </div>

                    {/* Upload Area */}
                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-slate-400 transition-colors cursor-pointer"
                      onClick={() => setUploadedFiles([...uploadedFiles, `document_${uploadedFiles.length + 1}.pdf`])}
                    >
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                      <p className="font-medium text-gray-900">Drag & drop files here</p>
                      <p className="text-sm text-gray-500 mt-1">or click to browse</p>
                      <p className="text-xs text-gray-400 mt-3">PDF, JPG, PNG up to 10MB</p>
                    </div>

                    {/* Uploaded Files */}
                    {uploadedFiles.length > 0 && (
                      <div className="space-y-2">
                        {uploadedFiles.map((file, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-slate-600" />
                              <span className="text-sm text-gray-900">{file}</span>
                            </div>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setUploadedFiles(uploadedFiles.filter((_, idx) => idx !== i));
                              }}
                              className="p-1 text-gray-400 hover:text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="px-6 pb-6 flex gap-3">
                    <button
                      onClick={() => setShowUploadModal(false)}
                      className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpload}
                      disabled={uploadedFiles.length === 0}
                      className="flex-1 px-4 py-2.5 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Upload
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Click outside to close menu */}
      {activeMenu && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setActiveMenu(null)}
        />
      )}
    </div>
  );
}
