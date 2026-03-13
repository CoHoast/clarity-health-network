"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  FilePlus,
  User,
  Calendar,
  Stethoscope,
  DollarSign,
  FileText,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Search,
  Upload,
  Send,
} from "lucide-react";

export default function SubmitClaimPage() {
  const [step, setStep] = useState(1);
  const [claimType, setClaimType] = useState<"professional" | "institutional">("professional");
  const [submitted, setSubmitted] = useState(false);
  const [serviceLines, setServiceLines] = useState([
    { id: 1, cpt: "", modifier: "", dx: "", units: "1", charge: "" }
  ]);

  const addServiceLine = () => {
    setServiceLines([
      ...serviceLines,
      { id: Date.now(), cpt: "", modifier: "", dx: "", units: "1", charge: "" }
    ]);
  };

  const removeServiceLine = (id: number) => {
    if (serviceLines.length > 1) {
      setServiceLines(serviceLines.filter(line => line.id !== id));
    }
  };

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
            Your claim has been received and is being processed.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-500">Claim Reference Number</p>
            <p className="text-xl font-mono font-bold text-gray-900">CLM-2024-{Math.floor(Math.random() * 900) + 100}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Expected Processing</p>
                <p className="font-medium text-gray-900">5-7 business days</p>
              </div>
              <div>
                <p className="text-gray-500">Expected Payment</p>
                <p className="font-medium text-gray-900">14 days</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <Link
              href="/provider/claims"
              className="px-6 py-3 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
            >
              View Claims
            </Link>
            <button
              onClick={() => {
                setSubmitted(false);
                setStep(1);
                setServiceLines([{ id: 1, cpt: "", modifier: "", dx: "", units: "1", charge: "" }]);
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/provider"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Submit a Claim</h1>
          <p className="text-gray-500">Submit professional or institutional claims electronically</p>
        </div>
      </div>

      {/* Claim Type Selector */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex gap-4">
          <button
            onClick={() => setClaimType("professional")}
            className={`flex-1 p-4 rounded-xl border-2 transition-all ${
              claimType === "professional"
                ? "border-slate-600 bg-slate-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <FileText className={`w-8 h-8 mb-2 ${claimType === "professional" ? "text-slate-600" : "text-gray-400"}`} />
            <p className="font-semibold text-gray-900">Professional (837P)</p>
            <p className="text-sm text-gray-500">Office visits, procedures</p>
          </button>
          <button
            onClick={() => setClaimType("institutional")}
            className={`flex-1 p-4 rounded-xl border-2 transition-all ${
              claimType === "institutional"
                ? "border-slate-600 bg-slate-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <Stethoscope className={`w-8 h-8 mb-2 ${claimType === "institutional" ? "text-slate-600" : "text-gray-400"}`} />
            <p className="font-semibold text-gray-900">Institutional (837I)</p>
            <p className="text-sm text-gray-500">Hospital, facility claims</p>
          </button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4">
        {["Patient Info", "Service Details", "Review"].map((stepName, i) => (
          <div key={i} className="flex items-center">
            <div className={`flex items-center gap-2 ${i + 1 <= step ? "text-slate-700" : "text-gray-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                i + 1 < step ? "bg-slate-700 text-white" :
                i + 1 === step ? "bg-slate-100 text-slate-700 border-2 border-slate-700" :
                "bg-gray-100 text-gray-400"
              }`}>
                {i + 1 < step ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
              </div>
              <span className="hidden sm:inline font-medium">{stepName}</span>
            </div>
            {i < 2 && (
              <div className={`w-12 sm:w-24 h-0.5 mx-2 ${i + 1 < step ? "bg-slate-700" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Patient Info */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6"
        >
          <h2 className="font-semibold text-gray-900">Patient Information</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Member ID</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="CHN-123456"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-slate-100 rounded hover:bg-slate-200">
                  <Search className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Patient Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
              <input
                type="date"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date of Service</label>
              <input
                type="date"
                defaultValue={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rendering Provider</label>
            <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500">
              <option>Dr. Sarah Chen, MD (NPI: 1234567890)</option>
              <option>Dr. Michael Roberts, MD (NPI: 2345678901)</option>
              <option>Dr. Emily Watson, MD (NPI: 3456789012)</option>
            </select>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2.5 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
            >
              Continue
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 2: Service Details */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Service Lines</h2>
            <button
              onClick={addServiceLine}
              className="px-3 py-1.5 text-sm text-slate-700 font-medium hover:bg-slate-50 rounded-lg flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Line
            </button>
          </div>

          <div className="space-y-4">
            {serviceLines.map((line, index) => (
              <div key={line.id} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">Service Line {index + 1}</span>
                  {serviceLines.length > 1 && (
                    <button
                      onClick={() => removeServiceLine(line.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">CPT Code</label>
                    <input
                      type="text"
                      placeholder="99213"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Modifier</label>
                    <input
                      type="text"
                      placeholder="25"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Diagnosis (ICD-10)</label>
                    <input
                      type="text"
                      placeholder="J06.9"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Units</label>
                    <input
                      type="number"
                      defaultValue="1"
                      min="1"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Charge ($)</label>
                    <input
                      type="number"
                      placeholder="92.00"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Attachments (Optional)</label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Drag and drop files or click to browse</p>
              <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG (max 10MB)</p>
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
              className="px-6 py-2.5 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
            >
              Continue
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6"
        >
          <h2 className="font-semibold text-gray-900">Review Claim</h2>

          <div className="bg-gray-50 rounded-xl p-4 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Patient</p>
                <p className="font-medium text-gray-900">John Doe (CHN-123456)</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date of Service</p>
                <p className="font-medium text-gray-900">{new Date().toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Rendering Provider</p>
                <p className="font-medium text-gray-900">Dr. Sarah Chen, MD</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Claim Type</p>
                <p className="font-medium text-gray-900">{claimType === "professional" ? "Professional (837P)" : "Institutional (837I)"}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-3">Service Lines</h3>
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-500">CPT</th>
                  <th className="px-4 py-2 text-left text-gray-500">Diagnosis</th>
                  <th className="px-4 py-2 text-center text-gray-500">Units</th>
                  <th className="px-4 py-2 text-right text-gray-500">Charge</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-100">
                  <td className="px-4 py-3 font-mono">99213</td>
                  <td className="px-4 py-3 font-mono">J06.9</td>
                  <td className="px-4 py-3 text-center">1</td>
                  <td className="px-4 py-3 text-right">$92.00</td>
                </tr>
              </tbody>
              <tfoot className="border-t-2 border-gray-200">
                <tr>
                  <td colSpan={3} className="px-4 py-3 font-medium text-gray-900">Total</td>
                  <td className="px-4 py-3 text-right font-bold text-gray-900">$92.00</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700">
              By submitting this claim, you certify that the services were rendered as described 
              and all information is accurate and complete.
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
              className="px-6 py-2.5 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2"
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
