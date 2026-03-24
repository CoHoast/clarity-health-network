"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, FileSpreadsheet, CheckCircle, AlertTriangle, XCircle,
  ChevronRight, ChevronLeft, Download, X, ArrowRight, Merge,
  SkipForward, RefreshCw, Eye, Check, AlertCircle
} from "lucide-react";
import { useTheme } from "@/components/admin/ThemeContext";
import { cn } from "@/lib/utils";

interface ParsedProvider {
  rowNumber: number;
  npi: string;
  firstName: string;
  lastName: string;
  name: string;
  credential: string;
  specialty: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  // All other fields...
  [key: string]: any;
}

interface ExistingProvider {
  id: string;
  npi: string;
  firstName: string;
  lastName: string;
  specialty: string;
  phone?: string;
  email?: string;
  [key: string]: any;
}

interface DuplicateMatch {
  csvRow: ParsedProvider;
  existingProvider: ExistingProvider;
  matchType: "npi" | "taxId" | "name";
  action: "skip" | "merge" | "add" | "pending";
  differences: { field: string; existing: string; csv: string }[];
}

interface ValidationError {
  rowNumber: number;
  field: string;
  message: string;
}

interface ImportResult {
  added: number;
  skipped: number;
  merged: number;
  errors: number;
}

interface CsvUploadWizardProps {
  isOpen: boolean;
  onClose: () => void;
  existingProviders: ExistingProvider[];
  onImportComplete: (result: ImportResult) => void;
}

type Step = "upload" | "analyze" | "review" | "confirm" | "complete";

export function CsvUploadWizard({
  isOpen,
  onClose,
  existingProviders: passedProviders, // Keep for backwards compatibility but we'll fetch fresh
  onImportComplete,
}: CsvUploadWizardProps) {
  const { isDark } = useTheme();
  const [step, setStep] = useState<Step>("upload");
  const [parsedData, setParsedData] = useState<ParsedProvider[]>([]);
  const [duplicates, setDuplicates] = useState<DuplicateMatch[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [newProviders, setNewProviders] = useState<ParsedProvider[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [reviewIndex, setReviewIndex] = useState(0);
  
  // Server-side analysis results
  const [serverAnalysis, setServerAnalysis] = useState<{
    totalExisting: number;
    duplicates: number;
    new: number;
  } | null>(null);

  // Reset state when closing
  const handleClose = () => {
    setStep("upload");
    setParsedData([]);
    setDuplicates([]);
    setValidationErrors([]);
    setNewProviders([]);
    setImportResult(null);
    setReviewIndex(0);
    setServerAnalysis(null);
    onClose();
  };

  // Parse CSV file
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const headerLine = lines[0];
      const headers = headerLine.split(',').map(h => 
        h.trim().toLowerCase().replace(/^"|"$/g, '').replace(/\s+/g, '_').replace(/#/g, '')
      );

      const errors: ValidationError[] = [];
      const parsed: ParsedProvider[] = [];

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;

        // Parse CSV line (handle commas in quoted values)
        const values: string[] = [];
        let current = '';
        let inQuotes = false;
        for (const char of lines[i]) {
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            values.push(current.trim().replace(/^"|"$/g, ''));
            current = '';
          } else {
            current += char;
          }
        }
        values.push(current.trim().replace(/^"|"$/g, ''));

        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });

        // Map CSV columns to provider fields
        const firstName = row.first_name || row.firstname || '';
        const lastName = row.last_name || row.lastname || '';
        const fullName = row.name || row.provider_name || row.full_name || '';
        const name = fullName || `${firstName} ${lastName}`.trim();
        const npi = row.npi || row.provider_npi || '';

        const provider: ParsedProvider = {
          rowNumber: i,
          npi,
          firstName,
          lastName,
          name,
          credential: row.credentials || row.credential || row.suffix || '',
          specialty: row.primary_spc_code || row.specialty || row.speciality || '',
          phone: row.phone_ || row.phone || row.phone_number || '',
          email: row.email || '',
          address: row.address1 || row.address_1 || row.address || '',
          city: row.city || '',
          state: row.state || '',
          zip: row.zip_code || row.zip || row.zipcode || '',
          gender: row.gender || '',
          referenceNumber: row.entity_ || row.entity || '',
          contractNumber: row.contract_ || row.contract || '',
          primaryTaxonomy: row.primary_taxonomy_code || row.primary_taxonomy || '',
          secondaryTaxonomy: row.secondary_taxonomy_code || row.secondary_taxonomy || '',
          facilityType: row.facility_type || '',
          acceptingNewPatients: row.accepts_new_patients === 'Y' || row.accepts_new_patients?.toLowerCase() === 'yes',
          isPrimaryCare: row.primary_care_flag === 'P' || row.primary_care === 'Y',
          isBehavioralHealth: row.behavioral_health_flag === 'B' || row.behavioral_health === 'Y',
          directoryDisplay: row.directory_display !== 'N' && row.directory_display !== 'No',
          languages: row.language || 'English',
          pricingTier: row.pricing_tier || '',
          networkOrg: row.network_org || '',
          startDate: row.start_date || '',
          endDate: row.end_date || '',
          billingNpi: row.billing_npi || '',
          billingTaxId: row.billing_tax_id || '',
          billingName: row.billing_name || '',
        };

        // Validate required fields
        if (!name) {
          errors.push({ rowNumber: i, field: 'name', message: 'Missing provider name' });
        }
        if (!npi) {
          errors.push({ rowNumber: i, field: 'npi', message: 'Missing NPI' });
        } else if (!/^\d{10}$/.test(npi)) {
          errors.push({ rowNumber: i, field: 'npi', message: 'Invalid NPI format (must be 10 digits)' });
        }

        if (name && npi && /^\d{10}$/.test(npi)) {
          parsed.push(provider);
        }
      }

      setParsedData(parsed);
      setValidationErrors(errors);
      
      // Server-side duplicate detection (scales to 100K+ providers)
      analyzeServerSide(parsed);
    };

    reader.readAsText(file);
  }, []);

  // Server-side duplicate analysis (scales to 100K+ providers)
  const analyzeServerSide = async (parsed: ParsedProvider[]) => {
    try {
      const response = await fetch('/api/providers/analyze-csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows: parsed }),
      });
      
      const result = await response.json();
      
      if (result.error) {
        console.error('Server analysis failed:', result.error);
        setIsProcessing(false);
        return;
      }
      
      // Store server analysis summary
      setServerAnalysis({
        totalExisting: result.totalExisting,
        duplicates: result.duplicates,
        new: result.new,
      });
      
      // Convert server response to our DuplicateMatch format
      const dupes: DuplicateMatch[] = result.duplicateDetails.map((d: any) => ({
        csvRow: parsed.find(p => p.npi === d.npi) || parsed.find(p => p.rowNumber === d.rowNumber)!,
        existingProvider: {
          id: `prov-${d.npi}`,
          npi: d.npi,
          firstName: d.existingName?.split(' ')[0] || '',
          lastName: d.existingName?.split(' ').slice(1).join(' ') || '',
          specialty: d.existingSpecialty || '',
        },
        matchType: "npi" as const,
        action: "pending" as const,
        differences: d.differences,
      }));
      
      setDuplicates(dupes);
      setNewProviders(result.newRows);
      setIsProcessing(false);
      setStep("analyze");
    } catch (error) {
      console.error('Failed to analyze CSV:', error);
      setIsProcessing(false);
    }
  };

  // Handle bulk action for duplicates
  const handleBulkAction = (action: "skip" | "merge") => {
    setDuplicates(prev => prev.map(d => ({ ...d, action })));
    if (action === "skip") {
      setStep("confirm");
    }
  };

  // Handle individual duplicate action
  const handleDuplicateAction = (index: number, action: "skip" | "merge") => {
    setDuplicates(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], action };
      return updated;
    });
  };

  // Move to next duplicate in review
  const nextDuplicate = () => {
    if (reviewIndex < duplicates.length - 1) {
      setReviewIndex(reviewIndex + 1);
    } else {
      setStep("confirm");
    }
  };

  // Perform the actual import
  const performImport = async () => {
    setIsProcessing(true);
    
    try {
      let added = 0;
      let merged = 0;
      let skipped = 0;
      let errors = 0;

      // Add new providers
      for (const provider of newProviders) {
        try {
          const response = await fetch('/api/providers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(provider),
          });
          if (response.ok) {
            added++;
          } else {
            errors++;
          }
        } catch {
          errors++;
        }
      }

      // Handle duplicates based on action
      for (const dup of duplicates) {
        if (dup.action === "skip") {
          skipped++;
        } else if (dup.action === "merge") {
          try {
            // Smart merge - only update non-empty fields from CSV
            const mergeData: any = {};
            Object.entries(dup.csvRow).forEach(([key, value]) => {
              if (value && key !== 'rowNumber' && key !== 'npi') {
                mergeData[key] = value;
              }
            });

            const response = await fetch(`/api/providers/${dup.existingProvider.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(mergeData),
            });
            if (response.ok) {
              merged++;
            } else {
              errors++;
            }
          } catch {
            errors++;
          }
        }
      }

      const result = { added, merged, skipped, errors };
      setImportResult(result);
      setStep("complete");
      onImportComplete(result);
    } finally {
      setIsProcessing(false);
    }
  };

  // Download template
  const downloadTemplate = () => {
    const headers = [
      'NPI', 'First Name', 'Last Name', 'Suffix', 'Gender',
      'Primary Spc Code', 'Primary Taxonomy Code', 'Secondary Spc Code', 'Secondary Taxonomy Code',
      'Facility Type', 'Phone #', 'Fax', 'Email',
      'Address1', 'Address 2', 'City', 'State', 'Zip Code', 'County',
      'Accepts New Patients', 'Primary Care Flag', 'Behavioral Health Flag', 'Directory Display',
      'Language', 'Pricing Tier', 'Network Org', 'Start Date', 'End Date',
      'Entity #', 'Contract #',
      'Billing NPI', 'Billing Tax ID', 'Billing Name'
    ];
    const csv = headers.join(',') + '\n';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'provider-import-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  const pendingDuplicates = duplicates.filter(d => d.action === "pending");
  const currentDuplicate = pendingDuplicates.length > 0 ? duplicates[reviewIndex] : null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={cn(
          "rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col",
          isDark ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-200"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Steps */}
        <div className={cn("p-6 border-b", isDark ? "border-slate-700" : "border-slate-200")}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={cn("text-xl font-bold flex items-center gap-2", isDark ? "text-white" : "text-slate-900")}>
              <FileSpreadsheet className="w-6 h-6 text-blue-500" />
              Import Providers from CSV
            </h2>
            <button onClick={handleClose} className={cn("p-2 rounded-lg transition-colors", isDark ? "hover:bg-slate-700 text-slate-400" : "hover:bg-slate-100 text-slate-500")}>
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center gap-2">
            {[
              { id: "upload", label: "Upload" },
              { id: "analyze", label: "Analyze" },
              { id: "review", label: "Review" },
              { id: "confirm", label: "Confirm" },
              { id: "complete", label: "Complete" },
            ].map((s, i, arr) => (
              <div key={s.id} className="flex items-center">
                <div className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                  step === s.id 
                    ? "bg-blue-500 text-white" 
                    : arr.findIndex(x => x.id === step) > i
                      ? (isDark ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-700")
                      : (isDark ? "bg-slate-700 text-slate-400" : "bg-slate-100 text-slate-500")
                )}>
                  {arr.findIndex(x => x.id === step) > i ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <span className="w-5 h-5 flex items-center justify-center">{i + 1}</span>
                  )}
                  {s.label}
                </div>
                {i < arr.length - 1 && (
                  <ChevronRight className={cn("w-4 h-4 mx-1", isDark ? "text-slate-600" : "text-slate-300")} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Step 1: Upload */}
          {step === "upload" && (
            <div className="space-y-6">
              {/* Server-side detection info */}
              <div className={cn(
                "rounded-xl p-4 flex items-center gap-3",
                isDark ? "bg-blue-500/10 border border-blue-500/30" : "bg-blue-50 border border-blue-200"
              )}>
                <CheckCircle className="w-5 h-5 text-blue-500" />
                <p className={cn("text-sm", isDark ? "text-blue-300" : "text-blue-700")}>
                  <strong>Server-side duplicate detection</strong> — Scales to 100,000+ providers with instant results
                </p>
              </div>
              
              <div className={cn(
                "border-2 border-dashed rounded-xl p-12 text-center",
                isDark ? "border-slate-600" : "border-slate-300"
              )}>
                <Upload className={cn("w-16 h-16 mx-auto mb-4", isDark ? "text-slate-500" : "text-slate-400")} />
                <p className={cn("text-lg font-medium mb-2", isDark ? "text-white" : "text-slate-900")}>
                  Drop CSV file here or click to browse
                </p>
                <p className={cn("text-sm mb-6", isDark ? "text-slate-400" : "text-slate-500")}>
                  Supports .csv files with provider data
                </p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="csv-upload-wizard"
                />
                <label
                  htmlFor="csv-upload-wizard"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 cursor-pointer transition-colors font-medium"
                >
                  <Upload className="w-5 h-5" />
                  Select CSV File
                </label>
              </div>

              <div className={cn("rounded-xl p-4", isDark ? "bg-slate-700/30" : "bg-slate-50")}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className={cn("font-semibold", isDark ? "text-white" : "text-slate-900")}>Need a template?</h3>
                  <button
                    onClick={downloadTemplate}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download Template
                  </button>
                </div>
                <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                  Download our CSV template with all supported columns. Required fields: NPI, First Name, Last Name.
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Analyze */}
          {step === "analyze" && (
            <div className="space-y-6">
              {isProcessing ? (
                <div className="text-center py-12">
                  <RefreshCw className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-spin" />
                  <p className={cn("text-lg font-medium", isDark ? "text-white" : "text-slate-900")}>
                    Analyzing CSV against database...
                  </p>
                  <p className={cn("text-sm mt-2", isDark ? "text-slate-400" : "text-slate-500")}>
                    Server-side duplicate detection in progress
                  </p>
                </div>
              ) : (
                <>
                  {/* Server Analysis Info */}
                  {serverAnalysis && (
                    <div className={cn(
                      "rounded-xl p-4 flex items-center gap-3",
                      isDark ? "bg-slate-700/50 border border-slate-600" : "bg-slate-50 border border-slate-200"
                    )}>
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                      <p className={cn("text-sm", isDark ? "text-slate-300" : "text-slate-600")}>
                        Checked against <strong>{serverAnalysis.totalExisting.toLocaleString()}</strong> existing providers in database
                      </p>
                    </div>
                  )}
                  
                  {/* Summary Cards */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className={cn("rounded-xl p-4 border", isDark ? "bg-green-500/10 border-green-500/30" : "bg-green-50 border-green-200")}>
                      <div className="flex items-center gap-3">
                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", isDark ? "bg-green-500/20" : "bg-green-100")}>
                          <CheckCircle className={cn("w-5 h-5", isDark ? "text-green-400" : "text-green-600")} />
                        </div>
                        <div>
                          <p className={cn("text-2xl font-bold", isDark ? "text-green-400" : "text-green-700")}>{newProviders.length}</p>
                          <p className={cn("text-sm", isDark ? "text-green-400/80" : "text-green-600")}>New Providers</p>
                        </div>
                      </div>
                    </div>
                    <div className={cn("rounded-xl p-4 border", isDark ? "bg-amber-500/10 border-amber-500/30" : "bg-amber-50 border-amber-200")}>
                      <div className="flex items-center gap-3">
                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", isDark ? "bg-amber-500/20" : "bg-amber-100")}>
                          <AlertTriangle className={cn("w-5 h-5", isDark ? "text-amber-400" : "text-amber-600")} />
                        </div>
                        <div>
                          <p className={cn("text-2xl font-bold", isDark ? "text-amber-400" : "text-amber-700")}>{duplicates.length}</p>
                          <p className={cn("text-sm", isDark ? "text-amber-400/80" : "text-amber-600")}>Duplicates Found</p>
                        </div>
                      </div>
                    </div>
                    <div className={cn("rounded-xl p-4 border", isDark ? "bg-red-500/10 border-red-500/30" : "bg-red-50 border-red-200")}>
                      <div className="flex items-center gap-3">
                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", isDark ? "bg-red-500/20" : "bg-red-100")}>
                          <XCircle className={cn("w-5 h-5", isDark ? "text-red-400" : "text-red-600")} />
                        </div>
                        <div>
                          <p className={cn("text-2xl font-bold", isDark ? "text-red-400" : "text-red-700")}>{validationErrors.length}</p>
                          <p className={cn("text-sm", isDark ? "text-red-400/80" : "text-red-600")}>Invalid Rows</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Validation Errors */}
                  {validationErrors.length > 0 && (
                    <div className={cn("rounded-xl p-4 border", isDark ? "bg-red-500/10 border-red-500/30" : "bg-red-50 border-red-200")}>
                      <h3 className={cn("font-semibold mb-2 flex items-center gap-2", isDark ? "text-red-400" : "text-red-700")}>
                        <AlertCircle className="w-4 h-4" />
                        Validation Errors (rows will be skipped)
                      </h3>
                      <div className="max-h-32 overflow-auto space-y-1">
                        {validationErrors.slice(0, 10).map((err, i) => (
                          <p key={i} className={cn("text-sm", isDark ? "text-red-300" : "text-red-600")}>
                            Row {err.rowNumber}: {err.message}
                          </p>
                        ))}
                        {validationErrors.length > 10 && (
                          <p className={cn("text-sm", isDark ? "text-red-400" : "text-red-500")}>
                            ...and {validationErrors.length - 10} more
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Duplicate Handling Options */}
                  {duplicates.length > 0 && (
                    <div className={cn("rounded-xl p-4 border", isDark ? "bg-amber-500/10 border-amber-500/30" : "bg-amber-50 border-amber-200")}>
                      <h3 className={cn("font-semibold mb-3", isDark ? "text-amber-400" : "text-amber-700")}>
                        How would you like to handle {duplicates.length} duplicate(s)?
                      </h3>
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          onClick={() => handleBulkAction("skip")}
                          className={cn(
                            "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors",
                            isDark 
                              ? "border-slate-600 hover:border-amber-500 hover:bg-amber-500/10" 
                              : "border-slate-200 hover:border-amber-500 hover:bg-amber-50"
                          )}
                        >
                          <SkipForward className={cn("w-6 h-6", isDark ? "text-slate-400" : "text-slate-500")} />
                          <span className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>Skip All</span>
                          <span className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Keep existing data</span>
                        </button>
                        <button
                          onClick={() => { setReviewIndex(0); setStep("review"); }}
                          className={cn(
                            "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors",
                            isDark 
                              ? "border-slate-600 hover:border-blue-500 hover:bg-blue-500/10" 
                              : "border-slate-200 hover:border-blue-500 hover:bg-blue-50"
                          )}
                        >
                          <Eye className={cn("w-6 h-6", isDark ? "text-slate-400" : "text-slate-500")} />
                          <span className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>Review Each</span>
                          <span className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Decide one by one</span>
                        </button>
                        <button
                          onClick={() => handleBulkAction("merge")}
                          className={cn(
                            "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors",
                            isDark 
                              ? "border-slate-600 hover:border-green-500 hover:bg-green-500/10" 
                              : "border-slate-200 hover:border-green-500 hover:bg-green-50"
                          )}
                        >
                          <Merge className={cn("w-6 h-6", isDark ? "text-slate-400" : "text-slate-500")} />
                          <span className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>Merge All</span>
                          <span className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Update with CSV data</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* New Providers Preview */}
                  {newProviders.length > 0 && (
                    <div>
                      <h3 className={cn("font-semibold mb-3", isDark ? "text-white" : "text-slate-900")}>
                        New Providers Preview ({newProviders.length})
                      </h3>
                      <div className={cn("rounded-xl overflow-hidden max-h-64 overflow-auto", isDark ? "bg-slate-700/30" : "bg-slate-50")}>
                        <table className="w-full text-sm">
                          <thead className={cn("sticky top-0", isDark ? "bg-slate-800" : "bg-slate-100")}>
                            <tr>
                              <th className={cn("text-left px-3 py-2", isDark ? "text-slate-400" : "text-slate-500")}>Name</th>
                              <th className={cn("text-left px-3 py-2", isDark ? "text-slate-400" : "text-slate-500")}>NPI</th>
                              <th className={cn("text-left px-3 py-2", isDark ? "text-slate-400" : "text-slate-500")}>Specialty</th>
                              <th className={cn("text-left px-3 py-2", isDark ? "text-slate-400" : "text-slate-500")}>City</th>
                            </tr>
                          </thead>
                          <tbody className={isDark ? "divide-y divide-slate-700/50" : "divide-y divide-slate-200"}>
                            {newProviders.slice(0, 20).map((p, i) => (
                              <tr key={i}>
                                <td className={cn("px-3 py-2", isDark ? "text-white" : "text-slate-900")}>{p.name}</td>
                                <td className={cn("px-3 py-2 font-mono", isDark ? "text-slate-300" : "text-slate-600")}>{p.npi}</td>
                                <td className={cn("px-3 py-2", isDark ? "text-slate-300" : "text-slate-600")}>{p.specialty}</td>
                                <td className={cn("px-3 py-2", isDark ? "text-slate-300" : "text-slate-600")}>{p.city}, {p.state}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {newProviders.length > 20 && (
                          <p className={cn("text-center py-2 text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                            ...and {newProviders.length - 20} more
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Step 3: Review Duplicates */}
          {step === "review" && currentDuplicate && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className={cn("font-semibold", isDark ? "text-white" : "text-slate-900")}>
                  Reviewing Duplicate {reviewIndex + 1} of {duplicates.length}
                </h3>
                <span className={cn("text-sm px-3 py-1 rounded-full", isDark ? "bg-amber-500/20 text-amber-400" : "bg-amber-100 text-amber-700")}>
                  Matched by NPI: {currentDuplicate.csvRow.npi}
                </span>
              </div>

              {/* Side by Side Comparison */}
              <div className="grid grid-cols-2 gap-4">
                {/* Existing */}
                <div className={cn("rounded-xl p-4 border", isDark ? "bg-slate-700/30 border-slate-600" : "bg-slate-50 border-slate-200")}>
                  <h4 className={cn("font-semibold mb-3 flex items-center gap-2", isDark ? "text-slate-300" : "text-slate-700")}>
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    Existing Record
                  </h4>
                  <div className="space-y-2">
                    <p className={cn("text-lg font-medium", isDark ? "text-white" : "text-slate-900")}>
                      {currentDuplicate.existingProvider.firstName} {currentDuplicate.existingProvider.lastName}
                    </p>
                    <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                      {currentDuplicate.existingProvider.specialty}
                    </p>
                  </div>
                </div>

                {/* CSV */}
                <div className={cn("rounded-xl p-4 border", isDark ? "bg-green-500/10 border-green-500/30" : "bg-green-50 border-green-200")}>
                  <h4 className={cn("font-semibold mb-3 flex items-center gap-2", isDark ? "text-green-400" : "text-green-700")}>
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    From CSV
                  </h4>
                  <div className="space-y-2">
                    <p className={cn("text-lg font-medium", isDark ? "text-white" : "text-slate-900")}>
                      {currentDuplicate.csvRow.name}
                    </p>
                    <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                      {currentDuplicate.csvRow.specialty}
                    </p>
                  </div>
                </div>
              </div>

              {/* Differences */}
              {currentDuplicate.differences.length > 0 && (
                <div className={cn("rounded-xl p-4", isDark ? "bg-amber-500/10" : "bg-amber-50")}>
                  <h4 className={cn("font-semibold mb-3", isDark ? "text-amber-400" : "text-amber-700")}>
                    Differences Found ({currentDuplicate.differences.length})
                  </h4>
                  <div className="space-y-2">
                    {currentDuplicate.differences.map((diff, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <span className={cn("w-24 text-sm font-medium", isDark ? "text-slate-400" : "text-slate-500")}>{diff.field}</span>
                        <span className={cn("flex-1 text-sm px-2 py-1 rounded", isDark ? "bg-slate-700 text-slate-300" : "bg-white text-slate-700")}>{diff.existing}</span>
                        <ArrowRight className={cn("w-4 h-4", isDark ? "text-slate-500" : "text-slate-400")} />
                        <span className={cn("flex-1 text-sm px-2 py-1 rounded", isDark ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-700")}>{diff.csv}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => { handleDuplicateAction(reviewIndex, "skip"); nextDuplicate(); }}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors",
                    isDark ? "bg-slate-700 text-white hover:bg-slate-600" : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                  )}
                >
                  <SkipForward className="w-5 h-5" />
                  Skip (Keep Existing)
                </button>
                <button
                  onClick={() => { handleDuplicateAction(reviewIndex, "merge"); nextDuplicate(); }}
                  className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors"
                >
                  <Merge className="w-5 h-5" />
                  Merge (Update with CSV)
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Confirm */}
          {step === "confirm" && (
            <div className="space-y-6">
              <div className="text-center py-6">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className={cn("text-xl font-bold mb-2", isDark ? "text-white" : "text-slate-900")}>
                  Ready to Import
                </h3>
                <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                  Review the summary below and click Import to proceed.
                </p>
              </div>

              <div className={cn("rounded-xl p-6", isDark ? "bg-slate-700/30" : "bg-slate-50")}>
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <p className={cn("text-3xl font-bold", isDark ? "text-green-400" : "text-green-600")}>{newProviders.length}</p>
                    <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>Will be added</p>
                  </div>
                  <div>
                    <p className={cn("text-3xl font-bold", isDark ? "text-blue-400" : "text-blue-600")}>
                      {duplicates.filter(d => d.action === "merge").length}
                    </p>
                    <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>Will be merged</p>
                  </div>
                  <div>
                    <p className={cn("text-3xl font-bold", isDark ? "text-slate-400" : "text-slate-500")}>
                      {duplicates.filter(d => d.action === "skip").length}
                    </p>
                    <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>Will be skipped</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Complete */}
          {step === "complete" && importResult && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-white" />
              </div>
              <h3 className={cn("text-2xl font-bold mb-2", isDark ? "text-white" : "text-slate-900")}>
                Import Complete!
              </h3>
              <p className={cn("mb-8", isDark ? "text-slate-400" : "text-slate-500")}>
                Your providers have been successfully imported.
              </p>
              
              <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto">
                <div className={cn("rounded-xl p-4", isDark ? "bg-green-500/10" : "bg-green-50")}>
                  <p className={cn("text-2xl font-bold", isDark ? "text-green-400" : "text-green-600")}>{importResult.added}</p>
                  <p className={cn("text-xs", isDark ? "text-green-400/80" : "text-green-600")}>Added</p>
                </div>
                <div className={cn("rounded-xl p-4", isDark ? "bg-blue-500/10" : "bg-blue-50")}>
                  <p className={cn("text-2xl font-bold", isDark ? "text-blue-400" : "text-blue-600")}>{importResult.merged}</p>
                  <p className={cn("text-xs", isDark ? "text-blue-400/80" : "text-blue-600")}>Merged</p>
                </div>
                <div className={cn("rounded-xl p-4", isDark ? "bg-slate-500/10" : "bg-slate-100")}>
                  <p className={cn("text-2xl font-bold", isDark ? "text-slate-400" : "text-slate-600")}>{importResult.skipped}</p>
                  <p className={cn("text-xs", isDark ? "text-slate-400/80" : "text-slate-500")}>Skipped</p>
                </div>
                <div className={cn("rounded-xl p-4", isDark ? "bg-red-500/10" : "bg-red-50")}>
                  <p className={cn("text-2xl font-bold", isDark ? "text-red-400" : "text-red-600")}>{importResult.errors}</p>
                  <p className={cn("text-xs", isDark ? "text-red-400/80" : "text-red-600")}>Errors</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={cn("p-6 border-t flex justify-between", isDark ? "border-slate-700" : "border-slate-200")}>
          <div>
            {step === "analyze" && duplicates.length === 0 && newProviders.length > 0 && (
              <button
                onClick={() => setStep("confirm")}
                className={cn("px-4 py-2 rounded-lg transition-colors", isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-700")}
              >
                <ChevronLeft className="w-4 h-4 inline mr-1" />
                Back
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className={cn("px-4 py-2 rounded-lg transition-colors", isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-700")}
            >
              {step === "complete" ? "Close" : "Cancel"}
            </button>
            
            {step === "analyze" && duplicates.length === 0 && newProviders.length > 0 && (
              <button
                onClick={() => setStep("confirm")}
                className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
            
            {step === "confirm" && (
              <button
                onClick={performImport}
                disabled={isProcessing}
                className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Import {newProviders.length + duplicates.filter(d => d.action === "merge").length} Providers
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
