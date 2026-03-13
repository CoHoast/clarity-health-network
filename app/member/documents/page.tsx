"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderOpen,
  FileText,
  Download,
  Search,
  Filter,
  Calendar,
  Eye,
  Share2,
  Trash2,
  Upload,
  ChevronRight,
  File,
  FileImage,
  FilePlus,
  Clock,
  CheckCircle2,
  MoreHorizontal,
  X,
  Mail,
  ExternalLink,
} from "lucide-react";

const documentCategories = [
  { id: "all", name: "All Documents", count: 24 },
  { id: "eob", name: "EOBs", count: 12 },
  { id: "claims", name: "Claims", count: 6 },
  { id: "id-cards", name: "ID Cards", count: 2 },
  { id: "benefits", name: "Benefits", count: 3 },
  { id: "forms", name: "Forms", count: 1 },
];

const documents = [
  {
    id: 1,
    name: "Explanation of Benefits - March 2024",
    type: "eob",
    date: "Mar 12, 2024",
    size: "245 KB",
    format: "pdf",
    provider: "Dr. Sarah Chen",
    claimId: "CLM-2024-001",
    viewerPath: "/docs/eob",
  },
  {
    id: 2,
    name: "Explanation of Benefits - LabCorp",
    type: "eob",
    date: "Mar 8, 2024",
    size: "189 KB",
    format: "pdf",
    provider: "LabCorp",
    claimId: "CLM-2024-002",
    viewerPath: "/docs/eob",
  },
  {
    id: 3,
    name: "Digital ID Card - John Doe",
    type: "id-cards",
    date: "Jan 1, 2024",
    size: "125 KB",
    format: "pdf",
    viewerPath: "/docs/id-card",
  },
  {
    id: 4,
    name: "2024 Benefits Summary",
    type: "benefits",
    date: "Jan 1, 2024",
    size: "1.2 MB",
    format: "pdf",
    viewerPath: "/member/benefits",
  },
  {
    id: 5,
    name: "Explanation of Benefits - Chest X-Ray",
    type: "eob",
    date: "Mar 1, 2024",
    size: "198 KB",
    format: "pdf",
    provider: "Cleveland Imaging Center",
    claimId: "CLM-2024-004",
    viewerPath: "/docs/eob",
  },
  {
    id: 6,
    name: "Plan Documents & SPD",
    type: "benefits",
    date: "Jan 1, 2024",
    size: "3.5 MB",
    format: "pdf",
    viewerPath: "/member/benefits",
  },
  {
    id: 7,
    name: "Claim Form - Medical",
    type: "forms",
    date: "Jan 1, 2024",
    size: "85 KB",
    format: "pdf",
    viewerPath: "/member/claims/submit",
  },
  {
    id: 8,
    name: "Pre-Authorization Approval - MRI",
    type: "claims",
    date: "Feb 28, 2024",
    size: "156 KB",
    format: "pdf",
    viewerPath: "/docs/eob",
  },
];

export default function DocumentsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<typeof documents[0] | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const filteredDocuments = documents.filter((doc) => {
    const matchesCategory = selectedCategory === "all" || doc.type === selectedCategory;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getFileIcon = (format: string) => {
    switch (format) {
      case "pdf":
        return <FileText className="w-6 h-6 text-red-500" />;
      case "image":
        return <FileImage className="w-6 h-6 text-blue-500" />;
      default:
        return <File className="w-6 h-6 text-gray-500" />;
    }
  };

  const handleUpload = () => {
    setUploadSuccess(true);
    setTimeout(() => {
      setShowUploadModal(false);
      setUploadSuccess(false);
    }, 2000);
  };

  const handleShare = () => {
    setShareSuccess(true);
    setTimeout(() => {
      setShowShareModal(false);
      setShareSuccess(false);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-500 mt-1">Access your EOBs, claims, and plan documents</p>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
        >
          <Upload className="w-4 h-4" />
          Upload Document
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Categories</h2>
            </div>
            <div className="p-2">
              {documentCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    selectedCategory === category.id
                      ? "bg-teal-50 text-teal-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="font-medium">{category.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    selectedCategory === category.id
                      ? "bg-teal-100 text-teal-700"
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Storage Info */}
          <div className="mt-4 bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Storage Used</span>
              <span className="text-sm text-gray-500">8.5 MB</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-teal-500 rounded-full" style={{ width: "8%" }} />
            </div>
            <p className="text-xs text-gray-500 mt-2">8.5 MB of 100 MB used</p>
          </div>
        </div>

        {/* Document List */}
        <div className="flex-1">
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Documents Grid */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-100">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div 
                    className="flex items-center gap-4 flex-1 cursor-pointer"
                    onClick={() => setSelectedDoc(doc)}
                  >
                    <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                      {getFileIcon(doc.format)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{doc.name}</p>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {doc.date}
                        </span>
                        <span>{doc.size}</span>
                        {doc.provider && (
                          <span className="text-gray-400">• {doc.provider}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link 
                      href={doc.viewerPath}
                      className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                    </Link>
                    <Link 
                      href={doc.viewerPath}
                      className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                    >
                      <Download className="w-5 h-5" />
                    </Link>
                    <button 
                      onClick={() => {
                        setSelectedDoc(doc);
                        setShowShareModal(true);
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredDocuments.length === 0 && (
              <div className="py-12 text-center">
                <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No documents found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Document Preview Modal */}
      <AnimatePresence>
        {selectedDoc && !showShareModal && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedDoc(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Document Details</h3>
                <button onClick={() => setSelectedDoc(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Document Preview */}
                <div className="bg-gray-50 rounded-xl p-8 flex flex-col items-center justify-center">
                  <div className="w-20 h-20 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4">
                    {getFileIcon(selectedDoc.format)}
                  </div>
                  <p className="font-medium text-gray-900 text-center">{selectedDoc.name}</p>
                  <p className="text-sm text-gray-500">{selectedDoc.format.toUpperCase()} • {selectedDoc.size}</p>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date</span>
                    <span className="text-gray-900">{selectedDoc.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Category</span>
                    <span className="text-gray-900 capitalize">{selectedDoc.type.replace("-", " ")}</span>
                  </div>
                  {selectedDoc.provider && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Provider</span>
                      <span className="text-gray-900">{selectedDoc.provider}</span>
                    </div>
                  )}
                  {selectedDoc.claimId && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Claim ID</span>
                      <Link href={`/member/claims/${selectedDoc.claimId}`} className="text-teal-600 hover:text-teal-700 font-mono">
                        {selectedDoc.claimId}
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
                <Link 
                  href={selectedDoc.viewerPath}
                  className="flex-1 px-4 py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Document
                </Link>
                <button 
                  onClick={() => setShowShareModal(true)}
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
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
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Document Uploaded!</h3>
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
                    {/* Upload Area */}
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-teal-400 transition-colors cursor-pointer">
                      <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Upload className="w-6 h-6 text-teal-600" />
                      </div>
                      <p className="font-medium text-gray-900 mb-1">Drag and drop files here</p>
                      <p className="text-sm text-gray-500">or click to browse</p>
                      <p className="text-xs text-gray-400 mt-2">PDF, JPG, PNG up to 10MB</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
                      <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                        <option>Select type...</option>
                        <option>Medical Bill</option>
                        <option>Receipt</option>
                        <option>Lab Results</option>
                        <option>Referral</option>
                        <option>Other</option>
                      </select>
                    </div>
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
                      className="flex-1 px-4 py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Upload
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && selectedDoc && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {shareSuccess ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Document Shared!</h3>
                  <p className="text-gray-600">A secure link has been sent to the email address.</p>
                </div>
              ) : (
                <>
                  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Share Document</h3>
                    <button onClick={() => setShowShareModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  <div className="p-6 space-y-4">
                    <p className="text-sm text-gray-600">
                      Share <span className="font-medium">{selectedDoc.name}</span> via secure link.
                    </p>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Email</label>
                      <input
                        type="email"
                        placeholder="doctor@example.com"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Link expires in</label>
                      <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                        <option>24 hours</option>
                        <option>7 days</option>
                        <option>30 days</option>
                      </select>
                    </div>
                  </div>
                  <div className="px-6 pb-6 flex gap-3">
                    <button
                      onClick={() => setShowShareModal(false)}
                      className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleShare}
                      className="flex-1 px-4 py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      Send Link
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
