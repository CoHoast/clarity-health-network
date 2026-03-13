"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BadgeCheck, Clock, AlertCircle, CheckCircle, Upload, User, X, FileText, Calendar, Trash2 } from "lucide-react";

const credentials = [
  { type: "Medical License", state: "Ohio", number: "35-123456", issueDate: "2020-06-15", expirationDate: "2025-06-15", status: "Active", daysUntilExpiry: 456 },
  { type: "DEA Registration", state: "N/A", number: "BC1234567", issueDate: "2022-03-01", expirationDate: "2025-03-01", status: "Active", daysUntilExpiry: 350 },
  { type: "Board Certification", state: "ABFM", number: "FM-987654", issueDate: "2019-12-01", expirationDate: "2029-12-01", status: "Active", daysUntilExpiry: 2100 },
  { type: "Malpractice Insurance", state: "N/A", number: "POL-2024-5678", issueDate: "2024-01-01", expirationDate: "2025-01-01", status: "Expiring Soon", daysUntilExpiry: 290 },
];

const providers = [
  { name: "Dr. Sarah Chen, MD", npi: "1234567890", status: "Active", specialty: "Family Medicine", initials: "SC" },
  { name: "Dr. James Wilson, DO", npi: "0987654321", status: "Active", specialty: "Internal Medicine", initials: "JW" },
  { name: "Maria Garcia, NP", npi: "1122334455", status: "Pending", specialty: "Family Nurse Practitioner", initials: "MG" },
];

export default function CredentialingPage() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState<typeof credentials[0] | null>(null);
  const [showAddProviderModal, setShowAddProviderModal] = useState(false);
  const [showProviderDetail, setShowProviderDetail] = useState<typeof providers[0] | null>(null);
  const [isEditingProvider, setIsEditingProvider] = useState(false);
  const [editProviderSuccess, setEditProviderSuccess] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const handleUpload = () => {
    setUploadSuccess(true);
    setTimeout(() => {
      setShowUploadModal(false);
      setUploadSuccess(false);
      setUploadedFiles([]);
    }, 2000);
  };

  const handleUpdate = () => {
    setUpdateSuccess(true);
    setTimeout(() => {
      setShowUpdateModal(null);
      setUpdateSuccess(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Credentialing</h1>
          <p className="text-gray-600">Manage credentials for your practice and providers</p>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Upload className="w-4 h-4" />
          Upload Document
        </button>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-sm text-gray-500">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">1</p>
              <p className="text-sm text-gray-500">Expiring Soon</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-sm text-gray-500">Providers</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <BadgeCheck className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">100%</p>
              <p className="text-sm text-gray-500">Compliant</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alert */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-amber-800 font-medium">Malpractice Insurance expiring in 290 days</p>
          <p className="text-amber-700 text-sm mt-1">Please upload your renewal documentation at least 30 days before expiration.</p>
        </div>
        <button 
          onClick={() => setShowUpdateModal(credentials[3])}
          className="px-3 py-1.5 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors"
        >
          Update Now
        </button>
      </div>

      {/* Credentials Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Practice Credentials</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Credential</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Number</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Issue Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Expiration</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {credentials.map((cred, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-900">{cred.type}</p>
                      <p className="text-sm text-gray-500">{cred.state}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-gray-700">{cred.number}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{cred.issueDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{cred.expirationDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${
                      cred.status === "Active" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {cred.status === "Active" ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                      {cred.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button 
                      onClick={() => setShowUpdateModal(cred)}
                      className="text-slate-600 hover:text-slate-800 text-sm font-medium"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Providers */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Credentialed Providers</h2>
          <button 
            onClick={() => setShowAddProviderModal(true)}
            className="text-slate-600 hover:text-slate-800 text-sm font-medium"
          >
            + Add Provider
          </button>
        </div>
        <div className="divide-y divide-gray-200">
          {providers.map((provider, index) => (
            <div 
              key={index} 
              className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => setShowProviderDetail(provider)}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                  <span className="text-slate-600 font-semibold text-sm">{provider.initials}</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{provider.name}</p>
                  <p className="text-sm text-gray-500">NPI: {provider.npi} • {provider.specialty}</p>
                </div>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${
                provider.status === "Active" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
              }`}>
                {provider.status}
              </span>
            </div>
          ))}
        </div>
      </div>

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
                  <p className="text-gray-600">Your document has been uploaded and is pending review.</p>
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
                      <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500">
                        <option>Medical License</option>
                        <option>DEA Registration</option>
                        <option>Board Certification</option>
                        <option>Malpractice Insurance</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Provider (Optional)</label>
                      <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500">
                        <option>Practice-wide document</option>
                        {providers.map((p, i) => (
                          <option key={i}>{p.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Upload Area */}
                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-slate-400 transition-colors cursor-pointer"
                      onClick={() => setUploadedFiles([...uploadedFiles, `document_${uploadedFiles.length + 1}.pdf`])}
                    >
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="font-medium text-gray-900">Drag & drop or click to upload</p>
                      <p className="text-sm text-gray-500 mt-1">PDF, JPG, PNG up to 10MB</p>
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

      {/* Update Credential Modal */}
      <AnimatePresence>
        {showUpdateModal && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowUpdateModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {updateSuccess ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Update Submitted!</h3>
                  <p className="text-gray-600">Your credential update is pending verification.</p>
                </div>
              ) : (
                <>
                  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">Update Credential</h3>
                      <p className="text-sm text-gray-500">{showUpdateModal.type}</p>
                    </div>
                    <button onClick={() => setShowUpdateModal(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  <div className="p-6 space-y-4">
                    {/* Current Info */}
                    <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Current Number</span>
                        <span className="font-mono text-gray-900">{showUpdateModal.number}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Expires</span>
                        <span className="text-gray-900">{showUpdateModal.expirationDate}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Expiration Date</label>
                      <input
                        type="date"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Credential Number (if changed)</label>
                      <input
                        type="text"
                        placeholder={showUpdateModal.number}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                      />
                    </div>

                    {/* Upload Area */}
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
                      <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                      <p className="text-sm font-medium text-gray-900">Upload renewal document</p>
                      <p className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</p>
                    </div>
                  </div>
                  <div className="px-6 pb-6 flex gap-3">
                    <button
                      onClick={() => setShowUpdateModal(null)}
                      className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdate}
                      className="flex-1 px-4 py-2.5 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      Submit Update
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Provider Detail Modal */}
      <AnimatePresence>
        {showProviderDetail && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => { setShowProviderDetail(null); setIsEditingProvider(false); setEditProviderSuccess(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {editProviderSuccess ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Changes Saved!</h3>
                  <p className="text-gray-600">Provider information has been updated successfully.</p>
                </div>
              ) : isEditingProvider ? (
                <>
                  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Edit Provider</h3>
                    <button onClick={() => { setShowProviderDetail(null); setIsEditingProvider(false); }} className="p-1 hover:bg-gray-100 rounded-lg">
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                        <input
                          type="text"
                          defaultValue={showProviderDetail.name.split(' ')[0].replace('Dr.', '').trim()}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <input
                          type="text"
                          defaultValue={showProviderDetail.name.split(' ').slice(-2, -1)[0] || showProviderDetail.name.split(' ').pop()?.replace(',', '')}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Credentials</label>
                      <input
                        type="text"
                        defaultValue={showProviderDetail.name.split(',').pop()?.trim() || "MD"}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">NPI</label>
                      <input
                        type="text"
                        defaultValue={showProviderDetail.npi}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
                      <select 
                        defaultValue={showProviderDetail.specialty}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                      >
                        <option>Family Medicine</option>
                        <option>Internal Medicine</option>
                        <option>Pediatrics</option>
                        <option>Family Nurse Practitioner</option>
                        <option>Physician Assistant</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select 
                        defaultValue={showProviderDetail.status}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                      >
                        <option value="Active">Active</option>
                        <option value="Pending">Pending</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                  <div className="px-6 pb-6 flex gap-3">
                    <button
                      onClick={() => setIsEditingProvider(false)}
                      className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => {
                        setEditProviderSuccess(true);
                        setTimeout(() => {
                          setShowProviderDetail(null);
                          setIsEditingProvider(false);
                          setEditProviderSuccess(false);
                        }, 2000);
                      }}
                      className="flex-1 px-4 py-2.5 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Provider Details</h3>
                    <button onClick={() => setShowProviderDetail(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  <div className="p-6 space-y-6">
                    {/* Provider Info */}
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                        <span className="text-slate-600 font-bold text-xl">{showProviderDetail.initials}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-lg">{showProviderDetail.name}</p>
                        <p className="text-gray-500">{showProviderDetail.specialty}</p>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full mt-1 ${
                          showProviderDetail.status === "Active" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                        }`}>
                          {showProviderDetail.status}
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500">NPI</span>
                        <span className="font-mono text-gray-900">{showProviderDetail.npi}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500">Specialty</span>
                        <span className="text-gray-900">{showProviderDetail.specialty}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500">Credentialing Status</span>
                        <span className="text-green-600">Complete</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-500">Last Verified</span>
                        <span className="text-gray-900">Mar 1, 2024</span>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 pb-6 flex gap-3">
                    <button
                      onClick={() => setShowProviderDetail(null)}
                      className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Close
                    </button>
                    <button 
                      onClick={() => setIsEditingProvider(true)}
                      className="flex-1 px-4 py-2.5 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      Edit Provider
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Provider Modal */}
      <AnimatePresence>
        {showAddProviderModal && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddProviderModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Add Provider</h3>
                <button onClick={() => setShowAddProviderModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      placeholder="First"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      placeholder="Last"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">NPI</label>
                  <input
                    type="text"
                    placeholder="10-digit NPI"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
                  <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500">
                    <option>Family Medicine</option>
                    <option>Internal Medicine</option>
                    <option>Pediatrics</option>
                    <option>Nurse Practitioner</option>
                    <option>Physician Assistant</option>
                  </select>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
                  After adding, you'll need to submit credentialing documents for this provider.
                </div>
              </div>
              <div className="px-6 pb-6 flex gap-3">
                <button
                  onClick={() => setShowAddProviderModal(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-2.5 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors">
                  Add Provider
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
