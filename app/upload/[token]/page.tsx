"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  X,
  Shield,
  Clock,
  Building2,
  User,
  Loader2,
  ChevronRight,
  ChevronLeft,
  SkipForward,
  Send,
  Check,
} from "lucide-react";

// Document types that can be requested
const documentTypes: Record<string, { label: string; description: string; helpText?: string }> = {
  license: { 
    label: "State Medical License", 
    description: "Current, active medical license",
    helpText: "Upload a clear copy of your current state medical license. Ensure all text is legible and the expiration date is visible."
  },
  dea: { 
    label: "DEA Certificate", 
    description: "Drug Enforcement Administration registration",
    helpText: "Upload your current DEA registration certificate showing your DEA number and authorized schedules."
  },
  board_cert: { 
    label: "Board Certification", 
    description: "Specialty board certification",
    helpText: "Upload your board certification from ABMS or the relevant specialty board."
  },
  malpractice_coi: { 
    label: "Malpractice Insurance (COI)", 
    description: "Certificate of Insurance with minimum $1M/$3M coverage",
    helpText: "Upload your current Certificate of Insurance showing coverage amounts and policy dates."
  },
  cv: { 
    label: "CV / Resume", 
    description: "Current curriculum vitae",
    helpText: "Upload your current CV including education, training, work history, and any publications."
  },
  w9: { 
    label: "W-9 Form", 
    description: "IRS W-9 Request for Taxpayer ID",
    helpText: "Upload a completed and signed W-9 form for payment processing."
  },
  attestation: { 
    label: "Attestation Form", 
    description: "Signed attestation of credentials",
    helpText: "Upload the signed attestation form confirming the accuracy of your credentialing information."
  },
  collaborative: { 
    label: "Collaborative Agreement", 
    description: "For NP/PA providers",
    helpText: "Upload your current collaborative practice agreement with your supervising physician."
  },
};

// Mock data - In production, this would come from API based on token
const getMockRequestData = (token: string) => {
  if (token === "expired") {
    return { error: "expired", message: "This upload link has expired" };
  }
  if (token === "invalid") {
    return { error: "invalid", message: "Invalid or unknown upload link" };
  }

  // Demo: single document request
  if (token === "single") {
    return {
      id: "REQ-002",
      token,
      provider: {
        name: "Dr. James Wilson, MD",
        practice: "Wilson Orthopedics",
        email: "dr.wilson@ortho.com",
      },
      network: {
        name: "TrueCare Health Network",
        logo: "/logo.svg",
      },
      requestedDocs: ["malpractice_coi"],
      uploadedDocs: [] as string[],
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      customMessage: "Your malpractice insurance certificate expires soon. Please upload an updated COI.",
    };
  }

  return {
    id: "REQ-001",
    token,
    provider: {
      name: "Dr. Sarah Mitchell, MD",
      practice: "Cleveland Heart Center",
      email: "dr.mitchell@cardio.com",
    },
    network: {
      name: "TrueCare Health Network",
      logo: "/logo.svg",
    },
    requestedDocs: ["license", "dea", "malpractice_coi", "board_cert", "w9"],
    uploadedDocs: [] as string[],
    expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    customMessage: "Please upload your documents at your earliest convenience. Contact us if you have any questions.",
  };
};

interface UploadedFile {
  docType: string;
  file: File;
  status: "pending" | "uploading" | "success" | "error" | "skipped";
  progress: number;
  error?: string;
}

export default function SecureUploadPage() {
  const params = useParams();
  const token = params.token as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestData, setRequestData] = useState<ReturnType<typeof getMockRequestData> | null>(null);
  const [uploads, setUploads] = useState<Record<string, UploadedFile>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Wizard state
  const [currentStep, setCurrentStep] = useState(0);
  const [isReviewStep, setIsReviewStep] = useState(false);

  const totalDocs = requestData && 'requestedDocs' in requestData && requestData.requestedDocs ? requestData.requestedDocs.length : 0;
  const isSingleDoc = totalDocs === 1;

  // Load request data
  useEffect(() => {
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const data = getMockRequestData(token);

      if ("error" in data) {
        setError(data.message || "An error occurred");
      } else {
        setRequestData(data);
      }
      setLoading(false);
    };
    loadData();
  }, [token]);

  const handleFileSelect = useCallback((docType: string, file: File) => {
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      setUploads((prev) => ({
        ...prev,
        [docType]: {
          docType,
          file,
          status: "error",
          progress: 0,
          error: "Only PDF, JPG, and PNG files are accepted",
        },
      }));
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploads((prev) => ({
        ...prev,
        [docType]: {
          docType,
          file,
          status: "error",
          progress: 0,
          error: "File must be less than 10MB",
        },
      }));
      return;
    }

    setUploads((prev) => ({
      ...prev,
      [docType]: {
        docType,
        file,
        status: "pending",
        progress: 0,
      },
    }));
  }, []);

  const handleDrop = useCallback(
    (docType: string, e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileSelect(docType, file);
      }
    },
    [handleFileSelect]
  );

  const handleSkip = (docType: string) => {
    setUploads((prev) => ({
      ...prev,
      [docType]: {
        docType,
        file: null as any,
        status: "skipped",
        progress: 0,
      },
    }));
    goToNextStep();
  };

  const goToNextStep = () => {
    if (!requestData || !('requestedDocs' in requestData) || !requestData.requestedDocs) return;
    
    if (currentStep < requestData.requestedDocs.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsReviewStep(true);
    }
  };

  const goToPrevStep = () => {
    if (isReviewStep) {
      setIsReviewStep(false);
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    setIsReviewStep(false);
    setCurrentStep(step);
  };

  const removeFile = (docType: string) => {
    setUploads((prev) => {
      const newUploads = { ...prev };
      delete newUploads[docType];
      return newUploads;
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    // Simulate upload progress for each file
    for (const docType of Object.keys(uploads)) {
      if (uploads[docType].status === "pending") {
        setUploads((prev) => ({
          ...prev,
          [docType]: { ...prev[docType], status: "uploading", progress: 0 },
        }));

        for (let i = 0; i <= 100; i += 20) {
          await new Promise((resolve) => setTimeout(resolve, 150));
          setUploads((prev) => ({
            ...prev,
            [docType]: { ...prev[docType], progress: i },
          }));
        }

        setUploads((prev) => ({
          ...prev,
          [docType]: { ...prev[docType], status: "success", progress: 100 },
        }));
      }
    }

    setSubmitting(false);
    setSubmitted(true);
  };

  const uploadedCount = Object.values(uploads).filter(u => u.status === "pending" || u.status === "success").length;
  const skippedCount = Object.values(uploads).filter(u => u.status === "skipped").length;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading upload request...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Upload Link Unavailable</h1>
          <p className="text-slate-600 mb-6">{error}</p>
          <p className="text-sm text-slate-500">
            If you believe this is an error, please contact the credentialing team.
          </p>
        </div>
      </div>
    );
  }

  // Success state after submission
  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Documents Submitted!</h1>
          <p className="text-slate-600 mb-6">
            Thank you! Your documents have been securely uploaded and are now pending review.
          </p>
          <div className="bg-slate-50 rounded-xl p-4 text-left mb-6">
            <p className="text-sm font-semibold text-slate-700 mb-3">Submission Summary:</p>
            <div className="space-y-2">
              {Object.values(uploads).map((u) => (
                <div key={u.docType} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{documentTypes[u.docType]?.label || u.docType}</span>
                  {u.status === "success" ? (
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      Uploaded
                    </span>
                  ) : u.status === "skipped" ? (
                    <span className="text-slate-400">Skipped</span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
          <p className="text-sm text-slate-500">
            You will receive an email confirmation shortly. You may close this page.
          </p>
        </motion.div>
      </div>
    );
  }

  if (!requestData || !('requestedDocs' in requestData) || !requestData.requestedDocs) return null;

  const currentDocType = requestData.requestedDocs[currentStep];
  const currentDocInfo = documentTypes[currentDocType];
  const currentUpload = uploads[currentDocType];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-slate-900">{requestData.network.name}</h1>
                <p className="text-sm text-slate-500">Secure Document Upload</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Encrypted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Provider Info */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">{requestData.provider.name}</p>
              <p className="text-sm text-slate-500">{requestData.provider.practice}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps (for multiple docs) */}
      {!isSingleDoc && (
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-2xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">
                {isReviewStep ? "Review & Submit" : `Document ${currentStep + 1} of ${totalDocs}`}
              </span>
              <span className="text-sm text-slate-500">
                {uploadedCount} uploaded, {skippedCount} skipped
              </span>
            </div>
            
            {/* Step indicators */}
            <div className="flex items-center gap-2">
              {requestData.requestedDocs.map((docType, index) => {
                const upload = uploads[docType];
                const isComplete = upload?.status === "pending" || upload?.status === "success";
                const isSkipped = upload?.status === "skipped";
                const isCurrent = !isReviewStep && index === currentStep;
                
                return (
                  <button
                    key={docType}
                    onClick={() => goToStep(index)}
                    className={`flex-1 h-2 rounded-full transition-all ${
                      isComplete
                        ? "bg-green-500"
                        : isSkipped
                        ? "bg-slate-300"
                        : isCurrent
                        ? "bg-blue-500"
                        : "bg-slate-200"
                    }`}
                    title={documentTypes[docType]?.label}
                  />
                );
              })}
              {/* Review step indicator */}
              <div className={`flex-1 h-2 rounded-full ${isReviewStep ? "bg-blue-500" : "bg-slate-200"}`} />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          {isReviewStep ? (
            /* Review Step */
            <motion.div
              key="review"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-2xl"
            >
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-xl font-bold text-slate-900">Review Your Documents</h2>
                  <p className="text-slate-500 mt-1">
                    Review your uploads before submitting. You can go back to make changes.
                  </p>
                </div>

                <div className="p-6 space-y-3">
                  {requestData.requestedDocs.map((docType, index) => {
                    const docInfo = documentTypes[docType];
                    const upload = uploads[docType];
                    const isUploaded = upload?.status === "pending" || upload?.status === "success";
                    const isSkipped = upload?.status === "skipped";

                    return (
                      <div
                        key={docType}
                        className={`flex items-center justify-between p-4 rounded-xl border ${
                          isUploaded
                            ? "bg-green-50 border-green-200"
                            : isSkipped
                            ? "bg-slate-50 border-slate-200"
                            : "bg-amber-50 border-amber-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            isUploaded ? "bg-green-100" : isSkipped ? "bg-slate-200" : "bg-amber-100"
                          }`}>
                            {isUploaded ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : isSkipped ? (
                              <SkipForward className="w-5 h-5 text-slate-400" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-amber-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{docInfo?.label}</p>
                            {isUploaded && upload.file && (
                              <p className="text-sm text-slate-500 truncate max-w-xs">{upload.file.name}</p>
                            )}
                            {isSkipped && (
                              <p className="text-sm text-slate-400">Skipped - not uploaded</p>
                            )}
                            {!isUploaded && !isSkipped && (
                              <p className="text-sm text-amber-600">Not uploaded</p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => goToStep(index)}
                          className="text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                          {isUploaded ? "Change" : "Upload"}
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={goToPrevStep}
                      className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      Back
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={uploadedCount === 0 || submitting}
                      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                        uploadedCount > 0 && !submitting
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-slate-200 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Submit {uploadedCount} Document{uploadedCount !== 1 ? "s" : ""}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Document Upload Step */
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-2xl"
            >
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Document Header */}
                <div className="p-6 border-b border-slate-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">{currentDocInfo?.label}</h2>
                      <p className="text-slate-500">{currentDocInfo?.description}</p>
                    </div>
                  </div>
                  {currentDocInfo?.helpText && (
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mt-4">
                      <p className="text-sm text-blue-700">{currentDocInfo.helpText}</p>
                    </div>
                  )}
                </div>

                {/* Upload Area */}
                <div className="p-6">
                  {currentUpload?.status === "pending" || currentUpload?.status === "success" ? (
                    /* File Selected */
                    <div className="border-2 border-green-200 bg-green-50 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center">
                            <CheckCircle className="w-7 h-7 text-green-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">File Ready</p>
                            <p className="text-sm text-slate-600 truncate max-w-xs">{currentUpload.file?.name}</p>
                            <p className="text-xs text-slate-400">
                              {((currentUpload.file?.size || 0) / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(currentDocType)}
                          className="p-2 hover:bg-green-200 rounded-lg transition-colors"
                          title="Remove file"
                        >
                          <X className="w-5 h-5 text-slate-500" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Drop Zone */
                    <div
                      className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer ${
                        currentUpload?.status === "error"
                          ? "border-red-300 bg-red-50 hover:border-red-400"
                          : "border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50"
                      }`}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDrop(currentDocType, e)}
                      onClick={() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = ".pdf,.jpg,.jpeg,.png";
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) handleFileSelect(currentDocType, file);
                        };
                        input.click();
                      }}
                    >
                      <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center mx-auto mb-4">
                        <Upload className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-lg font-medium text-slate-700 mb-1">
                        Drop your {currentDocInfo?.label} here
                      </p>
                      <p className="text-slate-500 mb-4">or click to browse</p>
                      <p className="text-sm text-slate-400">PDF, JPG, or PNG (max 10MB)</p>
                      {currentUpload?.status === "error" && (
                        <p className="text-sm text-red-600 mt-4">{currentUpload.error}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <div className="p-6 bg-slate-50 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      {currentStep > 0 && (
                        <button
                          onClick={goToPrevStep}
                          className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900"
                        >
                          <ChevronLeft className="w-5 h-5" />
                          Back
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {!isSingleDoc && (
                        <button
                          onClick={() => handleSkip(currentDocType)}
                          className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-slate-700"
                        >
                          <SkipForward className="w-4 h-4" />
                          Skip for now
                        </button>
                      )}
                      {isSingleDoc ? (
                        <button
                          onClick={handleSubmit}
                          disabled={!currentUpload || currentUpload.status !== "pending" || submitting}
                          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                            currentUpload?.status === "pending" && !submitting
                              ? "bg-blue-600 text-white hover:bg-blue-700"
                              : "bg-slate-200 text-slate-400 cursor-not-allowed"
                          }`}
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Send className="w-5 h-5" />
                              Submit Document
                            </>
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={goToNextStep}
                          className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        >
                          {currentStep === totalDocs - 1 ? "Review" : "Next"}
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 bg-white">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Expires: {new Date(requestData.expiresAt).toLocaleDateString()}</span>
            </div>
            <a href="mailto:credentialing@truecarehealth.com" className="text-blue-600 hover:underline">
              Need help?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
