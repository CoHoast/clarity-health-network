"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
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
} from "lucide-react";

// Document types that can be requested
const documentTypes: Record<string, { label: string; description: string }> = {
  license: { label: "State Medical License", description: "Current, active medical license" },
  dea: { label: "DEA Certificate", description: "Drug Enforcement Administration registration" },
  board_cert: { label: "Board Certification", description: "Specialty board certification" },
  malpractice_coi: { label: "Malpractice Insurance (COI)", description: "Certificate of Insurance with minimum $1M/$3M coverage" },
  cv: { label: "CV / Resume", description: "Current curriculum vitae" },
  w9: { label: "W-9 Form", description: "IRS W-9 Request for Taxpayer ID" },
  attestation: { label: "Attestation Form", description: "Signed attestation of credentials" },
  collaborative: { label: "Collaborative Agreement", description: "For NP/PA providers" },
};

// Mock data - In production, this would come from API based on token
const getMockRequestData = (token: string) => {
  // Simulate different tokens for demo
  if (token === "expired") {
    return { error: "expired", message: "This upload link has expired" };
  }
  if (token === "invalid") {
    return { error: "invalid", message: "Invalid or unknown upload link" };
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
    expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
    createdAt: new Date().toISOString(),
    customMessage: "Please upload your documents at your earliest convenience. Contact us if you have any questions.",
  };
};

interface UploadedFile {
  docType: string;
  file: File;
  status: "pending" | "uploading" | "success" | "error";
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

  // Load request data
  useEffect(() => {
    const loadData = async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      const data = getMockRequestData(token);

      if ("error" in data) {
        setError(data.message || "An error occurred");
      } else {
        setRequestData(data);
        // Pre-populate already uploaded docs
        const existingUploads: Record<string, UploadedFile> = {};
        data.uploadedDocs.forEach((docType) => {
          existingUploads[docType] = {
            docType,
            file: null as any,
            status: "success",
            progress: 100,
          };
        });
        setUploads(existingUploads);
      }
      setLoading(false);
    };
    loadData();
  }, [token]);

  const handleFileSelect = useCallback((docType: string, file: File) => {
    // Validate file type
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

    // Validate file size (max 10MB)
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

    // Set file as pending
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

  const handleSubmit = async () => {
    setSubmitting(true);

    // Simulate upload progress for each file
    for (const docType of Object.keys(uploads)) {
      if (uploads[docType].status === "pending") {
        // Start upload
        setUploads((prev) => ({
          ...prev,
          [docType]: { ...prev[docType], status: "uploading", progress: 0 },
        }));

        // Simulate progress
        for (let i = 0; i <= 100; i += 20) {
          await new Promise((resolve) => setTimeout(resolve, 200));
          setUploads((prev) => ({
            ...prev,
            [docType]: { ...prev[docType], progress: i },
          }));
        }

        // Complete
        setUploads((prev) => ({
          ...prev,
          [docType]: { ...prev[docType], status: "success", progress: 100 },
        }));
      }
    }

    setSubmitting(false);
    setSubmitted(true);
  };

  const removeFile = (docType: string) => {
    setUploads((prev) => {
      const newUploads = { ...prev };
      delete newUploads[docType];
      return newUploads;
    });
  };

  const allUploaded = requestData && requestData.requestedDocs
    ? requestData?.requestedDocs?.every(
        (doc) => uploads[doc]?.status === "success" || uploads[doc]?.status === "pending"
      )
    : false;

  const uploadCount = Object.values(uploads).filter(
    (u) => u.status === "success" || u.status === "pending"
  ).length;
  
  const totalDocs = requestData?.requestedDocs?.length || 0;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-600 mx-auto mb-4" />
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
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Documents Submitted!</h1>
          <p className="text-slate-600 mb-6">
            Thank you, {requestData?.provider?.name}. Your documents have been securely uploaded and
            are now pending review.
          </p>
          <div className="bg-slate-50 rounded-lg p-4 text-left mb-6">
            <p className="text-sm font-medium text-slate-700 mb-2">Documents Uploaded:</p>
            <ul className="space-y-1">
              {Object.values(uploads)
                .filter((u) => u.status === "success")
                .map((u) => (
                  <li key={u.docType} className="text-sm text-slate-600 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {documentTypes[u.docType]?.label || u.docType}
                  </li>
                ))}
            </ul>
          </div>
          <p className="text-sm text-slate-500">
            You will receive an email confirmation shortly. You may close this page.
          </p>
        </div>
      </div>
    );
  }

  if (!requestData) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-600 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-slate-900">{requestData?.network?.name}</h1>
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

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Provider Info Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-cyan-100 flex items-center justify-center">
              <User className="w-7 h-7 text-cyan-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{requestData?.provider?.name}</h2>
              <p className="text-slate-600">{requestData?.provider?.practice}</p>
            </div>
          </div>

          {requestData.customMessage && (
            <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-sm text-slate-600">{requestData.customMessage}</p>
            </div>
          )}

          <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Expires: {requestData?.expiresAt ? new Date(requestData.expiresAt).toLocaleDateString() : 'N/A'}
            </span>
            <span>
              {uploadCount} / {totalDocs} documents ready
            </span>
          </div>
        </div>

        {/* Upload Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Upload Progress</span>
            <span className="text-sm text-slate-500">
              {Math.round((uploadCount / totalDocs) * 100)}%
            </span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full">
            <div
              className="h-2 bg-cyan-500 rounded-full transition-all"
              style={{ width: `${(uploadCount / totalDocs) * 100}%` }}
            />
          </div>
        </div>

        {/* Document Upload Cards */}
        <div className="space-y-4 mb-8">
          {requestData?.requestedDocs?.map((docType) => {
            const docInfo = documentTypes[docType];
            const upload = uploads[docType];
            const isUploaded = upload?.status === "success";
            const isPending = upload?.status === "pending";
            const isUploading = upload?.status === "uploading";
            const hasError = upload?.status === "error";

            return (
              <div
                key={docType}
                className={`bg-white rounded-xl border-2 transition-colors ${
                  isUploaded
                    ? "border-green-200 bg-green-50"
                    : isPending
                    ? "border-cyan-200 bg-cyan-50"
                    : hasError
                    ? "border-red-200 bg-red-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isUploaded
                            ? "bg-green-100"
                            : isPending
                            ? "bg-cyan-100"
                            : "bg-slate-100"
                        }`}
                      >
                        {isUploaded ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <FileText className="w-5 h-5 text-slate-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          {docInfo?.label || docType}
                          <span className="ml-2 text-xs font-normal px-2 py-0.5 bg-red-100 text-red-600 rounded">
                            Required
                          </span>
                        </p>
                        <p className="text-sm text-slate-500">{docInfo?.description}</p>
                      </div>
                    </div>
                    {(isPending || isUploaded) && !isUploading && (
                      <button
                        onClick={() => removeFile(docType)}
                        className="p-1 hover:bg-slate-200 rounded"
                        title="Remove file"
                      >
                        <X className="w-4 h-4 text-slate-400" />
                      </button>
                    )}
                  </div>

                  {/* Upload Area or File Info */}
                  {isUploaded || isPending ? (
                    <div className="flex items-center gap-3 p-3 bg-white/80 rounded-lg mt-2">
                      <FileText className="w-5 h-5 text-slate-400" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700 truncate">
                          {upload.file?.name || "Document uploaded"}
                        </p>
                        {isUploading && (
                          <div className="w-full h-1 bg-slate-200 rounded-full mt-1">
                            <div
                              className="h-1 bg-cyan-500 rounded-full transition-all"
                              style={{ width: `${upload.progress}%` }}
                            />
                          </div>
                        )}
                      </div>
                      {isUploaded && (
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      )}
                      {isUploading && (
                        <Loader2 className="w-5 h-5 text-cyan-500 animate-spin flex-shrink-0" />
                      )}
                    </div>
                  ) : (
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                        hasError
                          ? "border-red-300 hover:border-red-400"
                          : "border-slate-300 hover:border-cyan-400"
                      }`}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDrop(docType, e)}
                      onClick={() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = ".pdf,.jpg,.jpeg,.png";
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) handleFileSelect(docType, file);
                        };
                        input.click();
                      }}
                    >
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm font-medium text-slate-700">
                        Drop file here or click to browse
                      </p>
                      <p className="text-xs text-slate-500 mt-1">PDF, JPG, PNG (max 10MB)</p>
                      {hasError && (
                        <p className="text-xs text-red-600 mt-2">{upload.error}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            <Shield className="w-4 h-4 inline mr-1 text-green-500" />
            Your documents are encrypted and securely transmitted
          </p>
          <button
            onClick={handleSubmit}
            disabled={uploadCount === 0 || submitting}
            className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              uploadCount > 0 && !submitting
                ? "bg-cyan-600 text-white hover:bg-cyan-700"
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
                <Upload className="w-5 h-5" />
                Submit Documents
              </>
            )}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 mt-auto">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <p className="text-center text-sm text-slate-500">
            Having trouble? Contact{" "}
            <a href="mailto:credentialing@truecarehealth.com" className="text-cyan-600 hover:underline">
              credentialing@truecarehealth.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
