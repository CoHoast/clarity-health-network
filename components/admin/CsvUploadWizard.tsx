"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Upload, FileSpreadsheet, CheckCircle, AlertTriangle, XCircle,
  ChevronRight, ChevronLeft, Download, X, RefreshCw, Eye, Check, AlertCircle,
  MapPin, Building, Users, SkipForward
} from "lucide-react";
import { useTheme } from "@/components/admin/ThemeContext";
import { cn } from "@/lib/utils";

interface ParsedRow {
  rowNumber: number;
  entityNumber: string;
  npi: string;
  firstName: string;
  lastName: string;
  name: string;
  credential: string;
  specialty: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  [key: string]: any;
}

interface EntityDuplicate {
  rowNumber: number;
  entityNumber: string;
  npi: string;
  csvName: string;
  reason: 'exists_in_system' | 'duplicate_in_csv';
  existingInfo?: {
    providerName: string;
    address: string;
  };
  duplicateRowNumbers?: number[];
  action: 'skip' | 'pending';
}

interface LocationToAdd {
  rowNumber: number;
  entityNumber: string;
  npi: string;
  name: string;
  address: string;
  city: string;
  state: string;
  action: 'add_location' | 'create_provider';
  existingProviderName?: string;
  existingLocationCount?: number;
}

interface ProviderSummary {
  npi: string;
  name: string;
  action: 'add_location' | 'create_provider';
  existingProviderName?: string;
  existingLocationCount?: number;
  newLocationCount: number;
  locations: { entityNumber: string; address: string; city: string; state: string }[];
}

interface ValidationError {
  rowNumber: number;
  field: string;
  message: string;
}

interface ImportResult {
  newProvidersCreated: number;
  locationsAdded: number;
  skippedDuplicates: number;
  errors: number;
}

interface CsvUploadWizardProps {
  isOpen: boolean;
  onClose: () => void;
  existingProviders?: any[];
  onImportComplete: (result: ImportResult) => void;
}

type Step = "upload" | "analyze" | "review" | "confirm" | "complete";

export function CsvUploadWizard({
  isOpen,
  onClose,
  onImportComplete,
}: CsvUploadWizardProps) {
  const { isDark } = useTheme();
  const [step, setStep] = useState<Step>("upload");
  const [parsedData, setParsedData] = useState<ParsedRow[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [fileName, setFileName] = useState<string>("");
  
  // New Entity Number-based analysis results
  const [duplicates, setDuplicates] = useState<EntityDuplicate[]>([]);
  const [locationsToAdd, setLocationsToAdd] = useState<LocationToAdd[]>([]);
  const [providerSummary, setProviderSummary] = useState<ProviderSummary[]>([]);
  const [serverAnalysis, setServerAnalysis] = useState<{
    totalExistingProviders: number;
    totalExistingEntityNumbers: number;
    newProviders: number;
    existingProvidersUpdated: number;
    locationsAddedToExisting: number;
    duplicatesInSystem: number;
    duplicatesInCsv: number;
  } | null>(null);

  // Reset state when closing
  const handleClose = () => {
    setStep("upload");
    setParsedData([]);
    setValidationErrors([]);
    setDuplicates([]);
    setLocationsToAdd([]);
    setProviderSummary([]);
    setServerAnalysis(null);
    setImportResult(null);
    setFileName("");
    onClose();
  };

  // Parse CSV file
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
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
      const parsed: ParsedRow[] = [];

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
        const entityNumber = row.entity_ || row.entity || row.entitynumber || row.entity_number || row.reference_number || '';

        // Parse ALL fields from CSV
        const provider: ParsedRow = {
          rowNumber: i,
          entityNumber,
          npi,
          firstName,
          lastName,
          name,
          middleInitial: row.mid_init || row.middle_init || row.middleinitial || '',
          credential: row.credentials || row.credential || row.suffix || '',
          specialty: row.primary_spc_code || row.specialty || row.speciality || '',
          specialtyCode: row.primary_spc_code || row.specialtycode || '',
          taxonomyCode: row.primary_taxonomy_code || row.primary_taxonomy || row.taxonomycode || '',
          secondarySpecialtyCode: row.secondary_spc_code || row.secondaryspecialtycode || '',
          secondaryTaxonomy: row.secondary_taxonomy_code || row.secondary_taxonomy || '',
          facilityType: row.facility_type || row.facilitytype || '',
          gender: row.gender || '',
          address: row.address1 || row.address_1 || row.address || '',
          address2: row.address_2 || row.address2 || '',
          city: row.city || '',
          state: row.state || '',
          zip: row.zip_code || row.zip || row.zipcode || '',
          county: row.county || '',
          phone: row.phone_ || row.phone || row.phone_number || '',
          fax: row.fax || '',
          email: row.email || '',
          acceptingNewPatients: row.accepts_new_patients === 'Y' || row.accepts_new_patients?.toLowerCase() === 'yes',
          isPrimaryCare: row.primary_care_flag === 'P' || row.primary_care === 'Y',
          isBehavioralHealth: row.behavioral_health_flag === 'B' || row.behavioral_health === 'Y',
          directoryDisplay: row.directory_display !== 'N' && row.directory_display !== 'No',
          languages: row.language || row.languages || 'English',
          referenceNumber: entityNumber,
          contractNumber: row.contract_ || row.contract || row.contractnumber || '',
          pricingTier: row.pricing_tier || row.pricingtier || '',
          networkOrg: row.network_org || row.networkorg || '',
          startDate: row.start_date || row.startdate || '',
          endDate: row.end_date || row.enddate || '',
          mondayHours: row.monday_hours || row.mondayhours || '',
          tuesdayHours: row.tuesday_hours || row.tuesdayhours || '',
          wednesdayHours: row.wednesday_hours || row.wednesdayhours || '',
          thursdayHours: row.thursday_hours || row.thursdayhours || '',
          fridayHours: row.friday_hours || row.fridayhours || '',
          saturdayHours: row.saturday_hours || row.saturdayhours || '',
          sundayHours: row.sunday_hours || row.sundayhours || '',
          correspondingAddr1: row.corresponding_addr_1 || row.correspondingaddr1 || '',
          correspondingAddr2: row.corresponding_addr_2 || row.correspondingaddr2 || '',
          correspondingCity: row.corresponding_city || row.correspondingcity || '',
          correspondingState: row.corresponding_state || row.correspondingstate || '',
          correspondingZip: row.corresponding_zip || row.correspondingzip || '',
          contactName: row.contact_name || row.contactname || '',
          correspondingFax: row.corresponding_fax || row.correspondingfax || '',
          billingNpi: row.billing_npi || row.billingnpi || '',
          billingTaxId: row.billing_tax_id || row.billingtaxid || '',
          billingName: row.billing_name || row.billingname || '',
          billingAddr1: row.billing_addr_1 || row.billingaddr1 || '',
          billingAddr2: row.billing_addr_2 || row.billingaddr2 || '',
          billingCity: row.billing_city || row.billingcity || '',
          billingState: row.billing_state || row.billingstate || '',
          billingZip: row.billing_zip || row.billingzip || '',
          billingPhone: row.billing_phone || row.billingphone || '',
          billingFax: row.billing_fax || row.billingfax || '',
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
        if (!entityNumber) {
          errors.push({ rowNumber: i, field: 'entityNumber', message: 'Missing Entity Number' });
        }

        if (name && npi && /^\d{10}$/.test(npi) && entityNumber) {
          parsed.push(provider);
        }
      }

      setParsedData(parsed);
      setValidationErrors(errors);
      
      // Server-side analysis with Entity Number-based duplicate detection
      analyzeServerSide(parsed);
    };

    reader.readAsText(file);
  }, []);

  // Server-side analysis using Entity Number as unique key
  const analyzeServerSide = async (parsed: ParsedRow[]) => {
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
        totalExistingProviders: result.totalExistingProviders,
        totalExistingEntityNumbers: result.totalExistingEntityNumbers,
        newProviders: result.newProviders,
        existingProvidersUpdated: result.existingProvidersUpdated,
        locationsAddedToExisting: result.locationsAddedToExisting,
        duplicatesInSystem: result.duplicatesInSystem,
        duplicatesInCsv: result.duplicatesInCsv,
      });
      
      // Store duplicates for review
      const dupes: EntityDuplicate[] = (result.duplicateDetails || []).map((d: any) => ({
        ...d,
        action: 'pending' as const,
      }));
      setDuplicates(dupes);
      
      // Store locations to add
      setLocationsToAdd(result.locationsToAddDetails || []);
      
      // Store provider summary for display
      setProviderSummary(result.providerSummary || []);
      
      setIsProcessing(false);
      setStep("analyze");
    } catch (error) {
      console.error('Failed to analyze CSV:', error);
      setIsProcessing(false);
    }
  };

  // Perform the actual import
  const performImport = async () => {
    setIsProcessing(true);
    
    try {
      // Filter out duplicates that are being skipped
      const skippedEntityNumbers = new Set(
        duplicates.filter(d => d.action === 'skip' || d.action === 'pending').map(d => d.entityNumber)
      );
      
      // Get rows that should be imported (not in skip list)
      const rowsToImport = parsedData.filter(row => !skippedEntityNumbers.has(row.entityNumber));
      
      const response = await fetch('/api/providers/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rows: rowsToImport,
          fileName,
          createdBy: 'admin',
        }),
      });
      
      const result = await response.json();
      
      if (result.error) {
        console.error('Import failed:', result.error);
        setIsProcessing(false);
        return;
      }
      
      const importResult: ImportResult = {
        newProvidersCreated: result.summary.newProvidersCreated,
        locationsAdded: result.summary.locationsAdded,
        skippedDuplicates: result.summary.skippedDuplicates + duplicates.length,
        errors: result.summary.errors,
      };
      
      setImportResult(importResult);
      setStep("complete");
      onImportComplete(importResult);
    } catch (error) {
      console.error('Import error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Download template
  const downloadTemplate = () => {
    const headers = [
      'Entity #', 'NPI', 'First Name', 'Last Name', 'Suffix', 'Gender',
      'Primary Spc Code', 'Primary Taxonomy Code', 'Secondary Spc Code', 'Secondary Taxonomy Code',
      'Facility Type', 'Phone #', 'Fax', 'Email',
      'Address1', 'Address 2', 'City', 'State', 'Zip Code', 'County',
      'Accepts New Patients', 'Primary Care Flag', 'Behavioral Health Flag', 'Directory Display',
      'Language', 'Pricing Tier', 'Network Org', 'Start Date', 'End Date', 'Contract #',
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

  // Calculate counts
  const newProvidersCount = providerSummary.filter(p => p.action === 'create_provider').length;
  const locationsToExisting = providerSummary.filter(p => p.action === 'add_location');
  const totalNewLocations = locationsToAdd.length;

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
              {/* Entity Number info */}
              <div className={cn(
                "rounded-xl p-4 flex items-start gap-3",
                isDark ? "bg-blue-500/10 border border-blue-500/30" : "bg-blue-50 border border-blue-200"
              )}>
                <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                <div className={cn("text-sm", isDark ? "text-blue-300" : "text-blue-700")}>
                  <strong>Entity Number = Unique Location ID</strong>
                  <p className="mt-1">Each row must have a unique Entity Number. Same NPI with different Entity Numbers = multiple locations for one provider.</p>
                </div>
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
                  Required fields: Entity #, NPI, First Name, Last Name. Entity # must be unique per location.
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
                    Checking Entity Numbers for duplicates
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
                        Checked against <strong>{serverAnalysis.totalExistingProviders.toLocaleString()}</strong> providers 
                        with <strong>{serverAnalysis.totalExistingEntityNumbers.toLocaleString()}</strong> locations
                      </p>
                    </div>
                  )}
                  
                  {/* Summary Cards */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className={cn("rounded-xl p-4 border", isDark ? "bg-green-500/10 border-green-500/30" : "bg-green-50 border-green-200")}>
                      <div className="flex items-center gap-3">
                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", isDark ? "bg-green-500/20" : "bg-green-100")}>
                          <Users className={cn("w-5 h-5", isDark ? "text-green-400" : "text-green-600")} />
                        </div>
                        <div>
                          <p className={cn("text-2xl font-bold", isDark ? "text-green-400" : "text-green-700")}>{newProvidersCount}</p>
                          <p className={cn("text-sm", isDark ? "text-green-400/80" : "text-green-600")}>New Providers</p>
                        </div>
                      </div>
                    </div>
                    <div className={cn("rounded-xl p-4 border", isDark ? "bg-blue-500/10 border-blue-500/30" : "bg-blue-50 border-blue-200")}>
                      <div className="flex items-center gap-3">
                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", isDark ? "bg-blue-500/20" : "bg-blue-100")}>
                          <MapPin className={cn("w-5 h-5", isDark ? "text-blue-400" : "text-blue-600")} />
                        </div>
                        <div>
                          <p className={cn("text-2xl font-bold", isDark ? "text-blue-400" : "text-blue-700")}>{totalNewLocations}</p>
                          <p className={cn("text-sm", isDark ? "text-blue-400/80" : "text-blue-600")}>New Locations</p>
                        </div>
                      </div>
                    </div>
                    <div className={cn("rounded-xl p-4 border", isDark ? "bg-purple-500/10 border-purple-500/30" : "bg-purple-50 border-purple-200")}>
                      <div className="flex items-center gap-3">
                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", isDark ? "bg-purple-500/20" : "bg-purple-100")}>
                          <Building className={cn("w-5 h-5", isDark ? "text-purple-400" : "text-purple-600")} />
                        </div>
                        <div>
                          <p className={cn("text-2xl font-bold", isDark ? "text-purple-400" : "text-purple-700")}>{locationsToExisting.length}</p>
                          <p className={cn("text-sm", isDark ? "text-purple-400/80" : "text-purple-600")}>Providers Updated</p>
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
                          <p className={cn("text-sm", isDark ? "text-amber-400/80" : "text-amber-600")}>Duplicates</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Validation Errors */}
                  {validationErrors.length > 0 && (
                    <div className={cn("rounded-xl p-4 border", isDark ? "bg-red-500/10 border-red-500/30" : "bg-red-50 border-red-200")}>
                      <h3 className={cn("font-semibold mb-2 flex items-center gap-2", isDark ? "text-red-400" : "text-red-700")}>
                        <XCircle className="w-4 h-4" />
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

                  {/* Duplicates Warning */}
                  {duplicates.length > 0 && (
                    <div className={cn("rounded-xl p-4 border", isDark ? "bg-amber-500/10 border-amber-500/30" : "bg-amber-50 border-amber-200")}>
                      <h3 className={cn("font-semibold mb-3 flex items-center gap-2", isDark ? "text-amber-400" : "text-amber-700")}>
                        <AlertTriangle className="w-4 h-4" />
                        Duplicate Entity Numbers Found ({duplicates.length})
                      </h3>
                      <p className={cn("text-sm mb-3", isDark ? "text-amber-300" : "text-amber-600")}>
                        These rows have Entity Numbers that already exist in the system or are duplicated in the CSV. They will be skipped.
                      </p>
                      <div className="max-h-40 overflow-auto space-y-2">
                        {duplicates.slice(0, 10).map((dup, i) => (
                          <div key={i} className={cn("flex items-center gap-3 text-sm p-2 rounded", isDark ? "bg-slate-700/50" : "bg-white")}>
                            <SkipForward className={cn("w-4 h-4", isDark ? "text-amber-400" : "text-amber-500")} />
                            <span className={cn("font-mono", isDark ? "text-slate-300" : "text-slate-600")}>{dup.entityNumber}</span>
                            <span className={isDark ? "text-slate-400" : "text-slate-500"}>—</span>
                            <span className={isDark ? "text-slate-300" : "text-slate-600"}>{dup.csvName}</span>
                            <span className={cn("text-xs px-2 py-0.5 rounded", 
                              dup.reason === 'exists_in_system' 
                                ? (isDark ? "bg-amber-500/20 text-amber-400" : "bg-amber-100 text-amber-700")
                                : (isDark ? "bg-red-500/20 text-red-400" : "bg-red-100 text-red-700")
                            )}>
                              {dup.reason === 'exists_in_system' ? 'Already in system' : 'Duplicate in CSV'}
                            </span>
                          </div>
                        ))}
                        {duplicates.length > 10 && (
                          <p className={cn("text-sm text-center py-2", isDark ? "text-amber-400" : "text-amber-500")}>
                            ...and {duplicates.length - 10} more
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Provider Summary Preview */}
                  {providerSummary.length > 0 && (
                    <div>
                      <h3 className={cn("font-semibold mb-3", isDark ? "text-white" : "text-slate-900")}>
                        Import Preview
                      </h3>
                      <div className={cn("rounded-xl overflow-hidden max-h-64 overflow-auto", isDark ? "bg-slate-700/30" : "bg-slate-50")}>
                        <table className="w-full text-sm">
                          <thead className={cn("sticky top-0", isDark ? "bg-slate-800" : "bg-slate-100")}>
                            <tr>
                              <th className={cn("text-left px-3 py-2", isDark ? "text-slate-400" : "text-slate-500")}>Provider</th>
                              <th className={cn("text-left px-3 py-2", isDark ? "text-slate-400" : "text-slate-500")}>NPI</th>
                              <th className={cn("text-left px-3 py-2", isDark ? "text-slate-400" : "text-slate-500")}>Action</th>
                              <th className={cn("text-left px-3 py-2", isDark ? "text-slate-400" : "text-slate-500")}>Locations</th>
                            </tr>
                          </thead>
                          <tbody className={isDark ? "divide-y divide-slate-700/50" : "divide-y divide-slate-200"}>
                            {providerSummary.slice(0, 20).map((p, i) => (
                              <tr key={i}>
                                <td className={cn("px-3 py-2", isDark ? "text-white" : "text-slate-900")}>
                                  {p.name}
                                  {p.action === 'add_location' && p.existingProviderName && (
                                    <span className={cn("text-xs ml-2", isDark ? "text-slate-400" : "text-slate-500")}>
                                      (existing)
                                    </span>
                                  )}
                                </td>
                                <td className={cn("px-3 py-2 font-mono", isDark ? "text-slate-300" : "text-slate-600")}>{p.npi}</td>
                                <td className="px-3 py-2">
                                  <span className={cn("text-xs px-2 py-0.5 rounded",
                                    p.action === 'create_provider'
                                      ? (isDark ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-700")
                                      : (isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-700")
                                  )}>
                                    {p.action === 'create_provider' ? 'New Provider' : `+${p.newLocationCount} Location${p.newLocationCount > 1 ? 's' : ''}`}
                                  </span>
                                </td>
                                <td className={cn("px-3 py-2", isDark ? "text-slate-300" : "text-slate-600")}>
                                  {p.action === 'add_location' 
                                    ? `${p.existingLocationCount} → ${(p.existingLocationCount || 0) + p.newLocationCount}`
                                    : p.newLocationCount
                                  }
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {providerSummary.length > 20 && (
                          <p className={cn("text-center py-2 text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                            ...and {providerSummary.length - 20} more providers
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Step 3: Review - Skip for now since duplicates are auto-skipped */}
          {step === "review" && (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
              <h3 className={cn("text-xl font-bold mb-2", isDark ? "text-white" : "text-slate-900")}>
                Duplicates Will Be Skipped
              </h3>
              <p className={cn("mb-6", isDark ? "text-slate-400" : "text-slate-500")}>
                {duplicates.length} duplicate Entity Number(s) found. These will be automatically skipped.
              </p>
              <button
                onClick={() => setStep("confirm")}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
              >
                Continue to Import
              </button>
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
                <div className="grid grid-cols-4 gap-6 text-center">
                  <div>
                    <p className={cn("text-3xl font-bold", isDark ? "text-green-400" : "text-green-600")}>{newProvidersCount}</p>
                    <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>New Providers</p>
                  </div>
                  <div>
                    <p className={cn("text-3xl font-bold", isDark ? "text-blue-400" : "text-blue-600")}>{totalNewLocations}</p>
                    <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>Total Locations</p>
                  </div>
                  <div>
                    <p className={cn("text-3xl font-bold", isDark ? "text-purple-400" : "text-purple-600")}>{locationsToExisting.length}</p>
                    <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>Providers Updated</p>
                  </div>
                  <div>
                    <p className={cn("text-3xl font-bold", isDark ? "text-slate-400" : "text-slate-500")}>{duplicates.length}</p>
                    <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>Skipped Duplicates</p>
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
                  <p className={cn("text-2xl font-bold", isDark ? "text-green-400" : "text-green-600")}>{importResult.newProvidersCreated}</p>
                  <p className={cn("text-xs", isDark ? "text-green-400/80" : "text-green-600")}>New Providers</p>
                </div>
                <div className={cn("rounded-xl p-4", isDark ? "bg-blue-500/10" : "bg-blue-50")}>
                  <p className={cn("text-2xl font-bold", isDark ? "text-blue-400" : "text-blue-600")}>{importResult.locationsAdded}</p>
                  <p className={cn("text-xs", isDark ? "text-blue-400/80" : "text-blue-600")}>Locations Added</p>
                </div>
                <div className={cn("rounded-xl p-4", isDark ? "bg-slate-500/10" : "bg-slate-100")}>
                  <p className={cn("text-2xl font-bold", isDark ? "text-slate-400" : "text-slate-600")}>{importResult.skippedDuplicates}</p>
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
            {step === "analyze" && (
              <button
                onClick={() => setStep("upload")}
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
            
            {step === "analyze" && locationsToAdd.length > 0 && !isProcessing && (
              <button
                onClick={() => duplicates.length > 0 ? setStep("review") : setStep("confirm")}
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
                    Import {totalNewLocations} Location{totalNewLocations !== 1 ? 's' : ''}
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
