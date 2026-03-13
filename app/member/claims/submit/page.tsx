"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Upload,
  FileText,
  Calendar,
  DollarSign,
  User,
  Building2,
  CheckCircle2,
  AlertCircle,
  X,
  Plus,
  Trash2,
  Info,
  Send,
  Camera,
} from "lucide-react";

export default function SubmitClaimPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    claimType: "",
    providerName: "",
    providerNpi: "",
    serviceDate: "",
    diagnosisCode: "",
    procedureCode: "",
    billedAmount: "",
    patientName: "John Doe",
    relationship: "self",
    notes: "",
  });
  const [files, setFiles] = useState<{ name: string; size: string }[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Claim Submitted Successfully!</h1>
          <p className="text-gray-600 mb-6">
            Your claim has been received and is being processed. You'll receive a confirmation email shortly.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-500">Claim Reference Number</p>
            <p className="text-xl font-mono font-bold text-gray-900">CLM-2024-{Math.floor(Math.random() * 900) + 100}</p>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            Claims are typically processed within 5-7 business days. You can track the status in your Claims section.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/member/claims"
              className="px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
            >
              View My Claims
            </Link>
            <button
              onClick={() => {
                setSubmitted(false);
                setStep(1);
                setFormData({
                  claimType: "",
                  providerName: "",
                  providerNpi: "",
                  serviceDate: "",
                  diagnosisCode: "",
                  procedureCode: "",
                  billedAmount: "",
                  patientName: "John Doe",
                  relationship: "self",
                  notes: "",
                });
                setFiles([]);
              }}
              className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Submit Another
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/member/claims"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Submit a Claim</h1>
          <p className="text-gray-500">Request reimbursement for out-of-network services</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4">
        {["Service Details", "Upload Documents", "Review & Submit"].map((stepName, i) => (
          <div key={i} className="flex items-center">
            <div className={`flex items-center gap-2 ${i + 1 <= step ? "text-teal-600" : "text-gray-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                i + 1 < step ? "bg-teal-600 text-white" :
                i + 1 === step ? "bg-teal-100 text-teal-600 border-2 border-teal-600" :
                "bg-gray-100 text-gray-400"
              }`}>
                {i + 1 < step ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
              </div>
              <span className="hidden sm:inline font-medium">{stepName}</span>
            </div>
            {i < 2 && (
              <div className={`w-12 sm:w-24 h-0.5 mx-2 ${i + 1 < step ? "bg-teal-600" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Service Details */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6"
        >
          <h2 className="font-semibold text-gray-900">Service Information</h2>

          {/* Claim Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Claim Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {["Medical", "Dental", "Vision", "Pharmacy"].map((type) => (
                <button
                  key={type}
                  onClick={() => setFormData({ ...formData, claimType: type })}
                  className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                    formData.claimType === type
                      ? "border-teal-600 bg-teal-50 text-teal-700"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Patient */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Patient</label>
            <select
              value={formData.relationship}
              onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="self">John Doe (Self)</option>
              <option value="spouse">Jane Doe (Spouse)</option>
              <option value="child1">Emma Doe (Child)</option>
              <option value="child2">Liam Doe (Child)</option>
            </select>
          </div>

          {/* Provider Info */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Provider Name</label>
              <input
                type="text"
                value={formData.providerName}
                onChange={(e) => setFormData({ ...formData, providerName: e.target.value })}
                placeholder="Dr. Jane Smith"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Provider NPI (Optional)</label>
              <input
                type="text"
                value={formData.providerNpi}
                onChange={(e) => setFormData({ ...formData, providerNpi: e.target.value })}
                placeholder="1234567890"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Service Details */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date of Service</label>
              <input
                type="date"
                value={formData.serviceDate}
                onChange={(e) => setFormData({ ...formData, serviceDate: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount Billed</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={formData.billedAmount}
                  onChange={(e) => setFormData({ ...formData, billedAmount: e.target.value })}
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Codes */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosis Code (Optional)</label>
              <input
                type="text"
                value={formData.diagnosisCode}
                onChange={(e) => setFormData({ ...formData, diagnosisCode: e.target.value })}
                placeholder="ICD-10 Code"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Procedure Code (Optional)</label>
              <input
                type="text"
                value={formData.procedureCode}
                onChange={(e) => setFormData({ ...formData, procedureCode: e.target.value })}
                placeholder="CPT Code"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes (Optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              placeholder="Any additional information about this claim..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setStep(2)}
              disabled={!formData.claimType || !formData.providerName || !formData.serviceDate || !formData.billedAmount}
              className="px-6 py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Continue
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 2: Upload Documents */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6"
        >
          <h2 className="font-semibold text-gray-900">Upload Documents</h2>
          <p className="text-gray-600">Please upload an itemized bill or receipt from your provider.</p>

          {/* Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-teal-400 transition-colors">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-teal-600" />
            </div>
            <p className="font-medium text-gray-900 mb-1">Drag and drop files here</p>
            <p className="text-sm text-gray-500 mb-4">or click to browse</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setFiles([...files, { name: `itemized_bill_${files.length + 1}.pdf`, size: "245 KB" }])}
                className="px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Browse Files
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Take Photo
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-4">Accepted formats: PDF, JPG, PNG (max 10MB each)</p>
          </div>

          {/* Uploaded Files */}
          {files.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Uploaded Files</h3>
              {files.map((file, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-teal-600" />
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">{file.size}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setFiles(files.filter((_, idx) => idx !== i))}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-medium text-blue-900">Required Documents:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Itemized bill showing services, dates, and charges</li>
                <li>Proof of payment (if already paid)</li>
                <li>Referral letter (if applicable)</li>
              </ul>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={files.length === 0}
              className="px-6 py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Continue
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 3: Review & Submit */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6"
        >
          <h2 className="font-semibold text-gray-900">Review Your Claim</h2>
          <p className="text-gray-600">Please review the information below before submitting.</p>

          {/* Summary */}
          <div className="bg-gray-50 rounded-xl p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Claim Type</p>
                <p className="font-medium text-gray-900">{formData.claimType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Patient</p>
                <p className="font-medium text-gray-900">{formData.patientName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Provider</p>
                <p className="font-medium text-gray-900">{formData.providerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date of Service</p>
                <p className="font-medium text-gray-900">{formData.serviceDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount Billed</p>
                <p className="font-medium text-gray-900">${formData.billedAmount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Documents</p>
                <p className="font-medium text-gray-900">{files.length} file(s) attached</p>
              </div>
            </div>
            {formData.notes && (
              <div>
                <p className="text-sm text-gray-500">Notes</p>
                <p className="font-medium text-gray-900">{formData.notes}</p>
              </div>
            )}
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700">
              By submitting this claim, I certify that the information provided is true and accurate. 
              I understand that submitting false information may result in claim denial or other action.
            </p>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Submit Claim
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
