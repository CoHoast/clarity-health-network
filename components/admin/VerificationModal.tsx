"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  RefreshCw,
  Shield,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { useTheme } from "@/components/admin/ThemeContext";
import { Button, IconButton } from "@/components/admin/ui/Button";
import { Badge } from "@/components/admin/ui/Badge";
import { cn } from "@/lib/utils";

interface VerificationResult {
  status: string;
  verificationType: string;
  sourceName: string;
  sourceUrl?: string;
  verifiedAt: string;
  reason?: string;
  severity?: string;
  matchScore?: number;
  parsedData?: Record<string, unknown>;
}

interface VerificationSummary {
  npi: string;
  total: number;
  passed: number;
  failed: number;
  needsReview: number;
  errors: number;
  criticalIssues: string[];
  recommendation: string;
  processingTimeMs: number;
}

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider?: {
    name: string;
    npi: string;
    firstName?: string;
    lastName?: string;
    organizationName?: string;
    providerType?: string;
  };
}

export function VerificationModal({ isOpen, onClose, provider }: VerificationModalProps) {
  const { isDark } = useTheme();
  const [isVerifying, setIsVerifying] = useState(false);
  const [results, setResults] = useState<Record<string, VerificationResult> | null>(null);
  const [summary, setSummary] = useState<VerificationSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runVerification = async () => {
    if (!provider) return;

    setIsVerifying(true);
    setError(null);
    setResults(null);
    setSummary(null);

    try {
      const response = await fetch('/api/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          npi: provider.npi,
          firstName: provider.firstName,
          lastName: provider.lastName,
          organizationName: provider.organizationName,
          providerType: provider.providerType || 'individual',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      setResults(data.results);
      setSummary(data.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PASSED':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'FAILED':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'NEEDS_REVIEW':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'ERROR':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PASSED':
        return <Badge variant="success">Passed</Badge>;
      case 'FAILED':
        return <Badge variant="error">Failed</Badge>;
      case 'NEEDS_REVIEW':
        return <Badge variant="warning">Needs Review</Badge>;
      case 'ERROR':
        return <Badge variant="error">Error</Badge>;
      default:
        return <Badge variant="default">Pending</Badge>;
    }
  };

  const getRecommendationBadge = (recommendation: string) => {
    switch (recommendation) {
      case 'AUTO_APPROVE':
        return <Badge variant="success">Recommend: Approve</Badge>;
      case 'AUTO_DENY':
        return <Badge variant="error">Recommend: Deny</Badge>;
      default:
        return <Badge variant="warning">Needs Review</Badge>;
    }
  };

  const formatVerificationType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Format parsed data in a clean, readable way
  const formatParsedData = (data: Record<string, any>, verificationType: string, isDark: boolean) => {
    const labelClass = cn("text-xs font-medium", isDark ? "text-slate-400" : "text-slate-500");
    const valueClass = cn("text-sm", isDark ? "text-white" : "text-slate-900");
    
    // Format based on verification type
    if (verificationType === 'NPI_VALIDATION') {
      return (
        <div className="grid grid-cols-2 gap-3">
          {data.name && (
            <div>
              <p className={labelClass}>Provider Name</p>
              <p className={valueClass}>{String(data.name)}</p>
            </div>
          )}
          {data.npi && (
            <div>
              <p className={labelClass}>NPI</p>
              <p className={cn(valueClass, "font-mono")}>{String(data.npi)}</p>
            </div>
          )}
          {data.status && (
            <div>
              <p className={labelClass}>Status</p>
              <p className={valueClass}>{String(data.status)}</p>
            </div>
          )}
          {data.credential && (
            <div>
              <p className={labelClass}>Credential</p>
              <p className={valueClass}>{String(data.credential)}</p>
            </div>
          )}
          {data.specialty && (
            <div>
              <p className={labelClass}>Specialty</p>
              <p className={valueClass}>{String(data.specialty)}</p>
            </div>
          )}
          {data.taxonomyCode && (
            <div>
              <p className={labelClass}>Taxonomy Code</p>
              <p className={cn(valueClass, "font-mono")}>{String(data.taxonomyCode)}</p>
            </div>
          )}
          {data.licenseState && (
            <div>
              <p className={labelClass}>License State</p>
              <p className={valueClass}>{String(data.licenseState)}</p>
            </div>
          )}
          {data.enumerationDate && (
            <div>
              <p className={labelClass}>Enumeration Date</p>
              <p className={valueClass}>{String(data.enumerationDate)}</p>
            </div>
          )}
          {data.lastUpdated && (
            <div>
              <p className={labelClass}>Last Updated</p>
              <p className={valueClass}>{String(data.lastUpdated)}</p>
            </div>
          )}
          {data.address && typeof data.address === 'object' && (
            <div className="col-span-2">
              <p className={labelClass}>Address</p>
              <p className={valueClass}>
                {(data.address as any).line1}
                {(data.address as any).line2 && `, ${(data.address as any).line2}`}
                <br />
                {(data.address as any).city}, {(data.address as any).state} {(data.address as any).zip}
              </p>
            </div>
          )}
        </div>
      );
    }
    
    if (verificationType === 'OIG_EXCLUSION' || verificationType === 'SAM_EXCLUSION') {
      const excluded = data.excluded as boolean;
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className={labelClass}>Exclusion Status:</span>
            <span className={cn(
              "px-2 py-0.5 rounded text-xs font-medium",
              excluded 
                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" 
                : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
            )}>
              {excluded ? 'EXCLUDED' : 'NOT EXCLUDED'}
            </span>
          </div>
          {data.searchedName && (
            <div>
              <span className={labelClass}>Searched Name: </span>
              <span className={valueClass}>{String(data.searchedName)}</span>
            </div>
          )}
          {data.searchedNpi && (
            <div>
              <span className={labelClass}>Searched NPI: </span>
              <span className={cn(valueClass, "font-mono")}>{String(data.searchedNpi)}</span>
            </div>
          )}
          {data.databaseRecordCount && (
            <div>
              <span className={labelClass}>Database Records: </span>
              <span className={valueClass}>{Number(data.databaseRecordCount).toLocaleString()}</span>
            </div>
          )}
        </div>
      );
    }
    
    // Default fallback: show as formatted list
    return (
      <div className="space-y-1">
        {Object.entries(data).map(([key, value]) => {
          if (value === null || value === undefined) return null;
          if (typeof value === 'object') return null; // Skip nested objects
          return (
            <div key={key} className="flex gap-2">
              <span className={labelClass}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}:</span>
              <span className={valueClass}>{String(value)}</span>
            </div>
          );
        })}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className={cn(
            "w-full max-w-2xl rounded-xl p-6 max-h-[90vh] overflow-y-auto",
            isDark ? "bg-slate-800" : "bg-white"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                isDark ? "bg-cyan-900/50" : "bg-cyan-100"
              )}>
                <Shield className={cn("w-6 h-6", isDark ? "text-cyan-400" : "text-cyan-600")} />
              </div>
              <div>
                <h2 className={cn("text-xl font-semibold", isDark ? "text-white" : "text-slate-900")}>
                  Provider Verification
                </h2>
                <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                  {provider?.name} • NPI: {provider?.npi}
                </p>
              </div>
            </div>
            <IconButton icon={<X className="w-5 h-5" />} onClick={onClose} />
          </div>

          {/* Initial State - Run Verification */}
          {!results && !isVerifying && !error && (
            <div className="text-center py-8">
              <Shield className={cn("w-16 h-16 mx-auto mb-4", isDark ? "text-slate-600" : "text-slate-300")} />
              <h3 className={cn("text-lg font-medium mb-2", isDark ? "text-white" : "text-slate-900")}>
                Ready to Verify
              </h3>
              <p className={cn("text-sm mb-6", isDark ? "text-slate-400" : "text-slate-500")}>
                This will check the provider against NPPES, OIG, and SAM.gov databases.
              </p>
              <Button variant="primary" onClick={runVerification}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Run Verification
              </Button>
            </div>
          )}

          {/* Loading State */}
          {isVerifying && (
            <div className="text-center py-8">
              <Loader2 className={cn("w-16 h-16 mx-auto mb-4 animate-spin", isDark ? "text-cyan-400" : "text-cyan-600")} />
              <h3 className={cn("text-lg font-medium mb-2", isDark ? "text-white" : "text-slate-900")}>
                Verifying Provider...
              </h3>
              <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                Checking government databases. This may take a few seconds.
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-8">
              <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
              <h3 className={cn("text-lg font-medium mb-2", isDark ? "text-white" : "text-slate-900")}>
                Verification Failed
              </h3>
              <p className="text-sm text-red-500 mb-6">{error}</p>
              <Button variant="secondary" onClick={runVerification}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          )}

          {/* Results */}
          {results && summary && (
            <div className="space-y-6">
              {/* Summary */}
              <div className={cn(
                "p-4 rounded-lg",
                summary.recommendation === 'AUTO_APPROVE'
                  ? isDark ? "bg-green-900/30 border border-green-800" : "bg-green-50 border border-green-200"
                  : summary.recommendation === 'AUTO_DENY'
                  ? isDark ? "bg-red-900/30 border border-red-800" : "bg-red-50 border border-red-200"
                  : isDark ? "bg-yellow-900/30 border border-yellow-800" : "bg-yellow-50 border border-yellow-200"
              )}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className={cn("font-semibold", isDark ? "text-white" : "text-slate-900")}>
                    Verification Summary
                  </h3>
                  {getRecommendationBadge(summary.recommendation)}
                </div>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <p className={cn("text-2xl font-bold text-green-600")}>{summary.passed}</p>
                    <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Passed</p>
                  </div>
                  <div>
                    <p className={cn("text-2xl font-bold text-red-600")}>{summary.failed}</p>
                    <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Failed</p>
                  </div>
                  <div>
                    <p className={cn("text-2xl font-bold text-yellow-600")}>{summary.needsReview}</p>
                    <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Review</p>
                  </div>
                  <div>
                    <p className={cn("text-2xl font-bold", isDark ? "text-slate-400" : "text-slate-600")}>{summary.errors}</p>
                    <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Errors</p>
                  </div>
                </div>
                <p className={cn("text-xs mt-3 text-center", isDark ? "text-slate-500" : "text-slate-400")}>
                  Completed in {summary.processingTimeMs}ms
                </p>
              </div>

              {/* Critical Issues */}
              {summary.criticalIssues.length > 0 && (
                <div className="p-4 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-medium mb-2">
                    <XCircle className="w-5 h-5" />
                    Critical Issues Found
                  </div>
                  <ul className="list-disc list-inside text-sm text-red-600 dark:text-red-300">
                    {summary.criticalIssues.map((issue, i) => (
                      <li key={i}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Individual Results */}
              <div>
                <h3 className={cn("font-semibold mb-3", isDark ? "text-white" : "text-slate-900")}>
                  Verification Results
                </h3>
                <div className="space-y-3">
                  {Object.entries(results).map(([type, result]) => (
                    <div
                      key={type}
                      className={cn(
                        "p-4 rounded-lg border",
                        isDark ? "bg-slate-700/50 border-slate-600" : "bg-slate-50 border-slate-200"
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(result.status)}
                          <div>
                            <p className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>
                              {formatVerificationType(type)}
                            </p>
                            <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                              Source: {result.sourceName}
                              {result.sourceUrl && (
                                <a
                                  href={result.sourceUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="ml-1 text-cyan-600 hover:underline"
                                >
                                  <ExternalLink className="w-3 h-3 inline" />
                                </a>
                              )}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(result.status)}
                      </div>
                      
                      {result.reason && (
                        <p className={cn(
                          "text-sm mt-2 p-2 rounded",
                          result.status === 'FAILED' ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300" :
                          result.status === 'NEEDS_REVIEW' ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300" :
                          isDark ? "bg-slate-600 text-slate-300" : "bg-slate-100 text-slate-600"
                        )}>
                          {result.reason}
                        </p>
                      )}

                      {result.matchScore !== undefined && (
                        <p className={cn("text-xs mt-2", isDark ? "text-slate-400" : "text-slate-500")}>
                          Match Score: {result.matchScore}%
                        </p>
                      )}

                      {result.parsedData && Object.keys(result.parsedData).length > 0 && (
                        <details className="mt-2">
                          <summary className={cn("text-xs cursor-pointer", isDark ? "text-slate-400" : "text-slate-500")}>
                            ▶ View Details
                          </summary>
                          <div className={cn(
                            "mt-2 p-3 rounded text-sm space-y-2",
                            isDark ? "bg-slate-800" : "bg-slate-100"
                          )}>
                            {formatParsedData(result.parsedData, type, isDark)}
                          </div>
                        </details>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <Button variant="secondary" className="flex-1" onClick={runVerification}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Re-run Verification
                </Button>
                <Button variant="primary" className="flex-1" onClick={onClose}>
                  Done
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
