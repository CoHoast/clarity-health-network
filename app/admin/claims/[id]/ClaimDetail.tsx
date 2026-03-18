"use client";

import { useTheme } from "@/components/admin/ThemeContext";
import { cn } from "@/lib/utils";

import { ArrowLeft, FileText, User, Building2, Calendar, DollarSign, Clock, CheckCircle, AlertTriangle, X, Send, Calculator, RefreshCw, TrendingDown, Info, ClipboardCheck, ShieldCheck, XCircle, Pause } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ServiceLine {
  cpt: string;
  description: string;
  qty: number;
  billed: number;
  allowed: number;
  status: string;
}

interface RepricedLine {
  lineNumber: number;
  cptCode: string;
  description?: string;
  billedAmount: number;
  allowedAmount: number;
  savingsAmount: number;
  savingsPercent: number;
  rateType: string;
  rateDetails: {
    baseRate?: number;
    adjustmentPercent?: number;
    rateSource: string;
  };
  status: string;
}

interface RepricingResult {
  claimId: string;
  transactionId: string;
  processingTimeMs: number;
  summary: {
    totalBilledAmount: number;
    totalAllowedAmount: number;
    totalSavings: number;
    savingsPercent: number;
  };
  contract: {
    contractNumber: string;
    providerName: string;
    feeStructureType: string;
    baseRatePercent?: number;
    network: string;
  };
  lines: RepricedLine[];
  warnings: string[];
}

interface ValidationError {
  ruleId: string;
  level: number;
  category: string;
  severity: string;
  errorCode: string;
  errorMessage: string;
  field?: string;
}

interface ValidationWarning {
  ruleId: string;
  level: number;
  category: string;
  warningMessage: string;
}

interface ValidationResult {
  claimId: string;
  transactionId: string;
  processingTimeMs: number;
  passed: boolean;
  status: string;
  validationLevel: number;
  levelsCompleted: number[];
  errors: ValidationError[];
  warnings: ValidationWarning[];
  denialReasons?: string[];
  pendQueue?: string;
  pendReason?: string;
  autoAdjudicated: boolean;
  autoAdjudicationReason?: string;
  summary: string;
}

const mockClaim = {
  id: "CLM-2024-0156",
  status: "pending_review",
  submittedDate: "2024-03-10",
  dateOfService: "2024-03-08",
  member: { id: "MEM-12847", name: "John Smith", dob: "1985-06-15", memberId: "CHN-12847-001" },
  provider: { name: "Cleveland Family Medicine", npi: "1234567890", address: "1234 Health Ave, Cleveland, OH 44101", phone: "(216) 555-0100" },
  billing: { billedAmount: 485.00, allowedAmount: 325.00, memberResponsibility: 65.00, planPays: 260.00 },
  serviceLines: [
    { cpt: "99213", description: "Office visit, established patient", qty: 1, billed: 150, allowed: 95, status: "approved" },
    { cpt: "36415", description: "Venipuncture", qty: 1, billed: 35, allowed: 25, status: "approved" },
    { cpt: "80053", description: "Comprehensive metabolic panel", qty: 1, billed: 150, allowed: 110, status: "approved" },
    { cpt: "85025", description: "Complete blood count (CBC)", qty: 1, billed: 75, allowed: 55, status: "approved" },
    { cpt: "81001", description: "Urinalysis", qty: 1, billed: 75, allowed: 40, status: "pending" },
  ],
  diagnosis: ["E11.9 - Type 2 diabetes mellitus", "I10 - Essential hypertension"],
  history: [
    { date: "2024-03-10 14:32", action: "Claim Submitted", user: "provider@cleveland.com" },
    { date: "2024-03-10 14:35", action: "Auto-adjudication Started", user: "system" },
    { date: "2024-03-10 14:36", action: "Routed to Review Queue", user: "system" },
  ],
};

export default function ClaimDetail({ id }: { id: string }) {
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showDenyModal, setShowDenyModal] = useState(false);
  const [showRepriceModal, setShowRepriceModal] = useState(false);
  const [showValidateModal, setShowValidateModal] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [isRepricing, setIsRepricing] = useState(false);
  const [repricingResult, setRepricingResult] = useState<RepricingResult | null>(null);
  const [repricingError, setRepricingError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [serviceLines, setServiceLines] = useState<ServiceLine[]>(mockClaim.serviceLines);
  const [billing, setBilling] = useState(mockClaim.billing);

  const handleAction = (action: string) => {
    setShowApproveModal(false);
    setShowDenyModal(false);
    setActionSuccess(action);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleReprice = async () => {
    setIsRepricing(true);
    setRepricingError(null);
    
    try {
      const response = await fetch('/api/admin/claims/reprice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          claimId: mockClaim.id,
          memberId: mockClaim.member.memberId,
          providerNpi: mockClaim.provider.npi,
          providerName: mockClaim.provider.name,
          networkStatus: 'IN_NETWORK',
          claimType: 'PROFESSIONAL',
          serviceDate: mockClaim.dateOfService,
          totalBilledAmount: mockClaim.billing.billedAmount,
          diagnosisCodes: mockClaim.diagnosis.map(d => d.split(' - ')[0]),
          lines: mockClaim.serviceLines.map((line, i) => ({
            lineNumber: i + 1,
            cptCode: line.cpt,
            description: line.description,
            quantity: line.qty,
            billedAmount: line.billed,
            placeOfService: '11',
          })),
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to reprice claim');
      }
      
      const result = await response.json();
      setRepricingResult(result);
    } catch (error) {
      setRepricingError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsRepricing(false);
    }
  };

  const handleValidate = async () => {
    setIsValidating(true);
    setValidationError(null);
    
    try {
      const response = await fetch('/api/admin/claims/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          claimId: mockClaim.id,
          memberId: mockClaim.member.memberId,
          memberDob: mockClaim.member.dob,
          billingNpi: mockClaim.provider.npi,
          providerName: mockClaim.provider.name,
          claimType: 'PROFESSIONAL',
          serviceFromDate: mockClaim.dateOfService,
          submittedDate: mockClaim.submittedDate,
          totalCharges: mockClaim.billing.billedAmount,
          diagnosisCodes: mockClaim.diagnosis.map(d => d.split(' - ')[0]),
          serviceLines: mockClaim.serviceLines.map((line, i) => ({
            lineNumber: i + 1,
            procedureCode: line.cpt,
            chargeAmount: line.billed,
            quantity: line.qty,
          })),
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to validate claim');
      }
      
      const result = await response.json();
      setValidationResult(result);
    } catch (error) {
      setValidationError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsValidating(false);
    }
  };

  const applyRepricingResult = () => {
    if (!repricingResult) return;
    
    // Update service lines with repriced amounts
    const updatedLines = serviceLines.map((line, i) => {
      const repricedLine = repricingResult.lines.find(rl => rl.cptCode === line.cpt);
      if (repricedLine) {
        return {
          ...line,
          allowed: repricedLine.allowedAmount,
          status: repricedLine.status.toLowerCase(),
        };
      }
      return line;
    });
    setServiceLines(updatedLines);
    
    // Update billing summary
    const newAllowed = repricingResult.summary.totalAllowedAmount;
    const memberResp = Math.round(newAllowed * 0.2 * 100) / 100; // 20% member responsibility
    const planPays = Math.round((newAllowed - memberResp) * 100) / 100;
    
    setBilling({
      billedAmount: repricingResult.summary.totalBilledAmount,
      allowedAmount: newAllowed,
      memberResponsibility: memberResp,
      planPays: planPays,
    });
    
    setShowRepriceModal(false);
    setActionSuccess("repriced and updated");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/claims" className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"><ArrowLeft className="w-5 h-5" /></Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">Claim {id}</h1>
          <p className="text-slate-400">Submitted {mockClaim.submittedDate}</p>
        </div>
        <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium">Pending Review</span>
      </div>

      <AnimatePresence>
        {actionSuccess && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400" /><span className="text-green-400">Claim {actionSuccess} successfully</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-5">
              <h3 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2"><User className="w-4 h-4" />Member</h3>
              <p className="font-semibold text-white text-lg">{mockClaim.member.name}</p>
              <p className="text-slate-400 text-sm">DOB: {mockClaim.member.dob}</p>
              <p className="text-blue-500 text-sm font-mono mt-1">{mockClaim.member.memberId}</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-5">
              <h3 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2"><Building2 className="w-4 h-4" />Provider</h3>
              <p className="font-semibold text-white text-lg">{mockClaim.provider.name}</p>
              <p className="text-slate-400 text-sm">NPI: {mockClaim.provider.npi}</p>
              <p className="text-slate-500 text-sm mt-1">{mockClaim.provider.phone}</p>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-5">
            <h3 className="text-sm font-medium text-slate-400 mb-3">Diagnosis Codes</h3>
            <div className="flex flex-wrap gap-2">{mockClaim.diagnosis.map((dx, i) => (<span key={i} className="px-3 py-1 bg-slate-700 text-white text-sm rounded-full">{dx}</span>))}</div>
          </div>

          <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
              <h3 className="font-semibold text-white">Service Lines</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setShowValidateModal(true); handleValidate(); }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-lg transition-colors"
                >
                  <ClipboardCheck className="w-4 h-4" />
                  Validate
                </button>
                <button
                  onClick={() => { setShowRepriceModal(true); handleReprice(); }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-sm rounded-lg transition-colors"
                >
                  <Calculator className="w-4 h-4" />
                  Reprice
                </button>
              </div>
            </div>
            <table className="w-full">
              <thead className="bg-slate-800 border-b border-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">CPT</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Description</th>
                  <th className="px-4 py-3 text-right text-xs text-slate-400 uppercase">Billed</th>
                  <th className="px-4 py-3 text-right text-xs text-slate-400 uppercase">Allowed</th>
                  <th className="px-4 py-3 text-center text-xs text-slate-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {serviceLines.map((line, i) => (
                  <tr key={i} className="hover:bg-slate-800/80">
                    <td className="px-4 py-3 font-mono text-blue-500">{line.cpt}</td>
                    <td className="px-4 py-3 text-white">{line.description}</td>
                    <td className="px-4 py-3 text-right text-slate-300">${line.billed.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-white font-medium">${line.allowed.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center"><span className={`px-2 py-1 text-xs rounded-full ${line.status === "approved" ? "bg-green-500/20 text-green-400" : "bg-amber-500/20 text-amber-400"}`}>{line.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-5">
            <h3 className="font-semibold text-white mb-4">Claim History</h3>
            <div className="space-y-3">{mockClaim.history.map((event, i) => (<div key={i} className="flex items-start gap-3"><div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div><div><p className="text-white">{event.action}</p><p className="text-sm text-slate-500">{event.date} • {event.user}</p></div></div>))}</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-5">
            <h3 className="font-semibold text-white mb-4">Billing Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-slate-400">Billed Amount</span><span className="text-white">${billing.billedAmount.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Allowed Amount</span><span className="text-white">${billing.allowedAmount.toFixed(2)}</span></div>
              <div className="border-t border-slate-700 pt-3"></div>
              <div className="flex justify-between"><span className="text-slate-400">Member Pays</span><span className="text-amber-400">${billing.memberResponsibility.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Plan Pays</span><span className="text-green-400 font-bold">${billing.planPays.toFixed(2)}</span></div>
              <div className="flex justify-between pt-2 border-t border-slate-700"><span className="text-slate-400">Savings</span><span className="text-emerald-400 font-medium">${(billing.billedAmount - billing.allowedAmount).toFixed(2)} ({((billing.billedAmount - billing.allowedAmount) / billing.billedAmount * 100).toFixed(1)}%)</span></div>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-5">
            <h3 className="font-semibold text-white mb-4">Actions</h3>
            <div className="space-y-2">
              <button onClick={() => setShowApproveModal(true)} className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4" />Approve Claim</button>
              <button onClick={() => setShowDenyModal(true)} className="w-full px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 flex items-center justify-center gap-2"><X className="w-4 h-4" />Deny Claim</button>
              <button onClick={() => { setShowValidateModal(true); handleValidate(); }} className="w-full px-4 py-2 bg-emerald-600/20 text-emerald-400 rounded-lg hover:bg-emerald-600/30 flex items-center justify-center gap-2"><ClipboardCheck className="w-4 h-4" />Validate Claim</button>
              <button onClick={() => { setShowRepriceModal(true); handleReprice(); }} className="w-full px-4 py-2 bg-teal-600/20 text-blue-500 rounded-lg hover:bg-teal-600/30 flex items-center justify-center gap-2"><Calculator className="w-4 h-4" />Reprice Claim</button>
              <button className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Request More Info</button>
              <button className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">View EOB Preview</button>
            </div>
          </div>
        </div>
      </div>

      {/* Approve Modal */}
      <AnimatePresence>
        {showApproveModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowApproveModal(false)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50">
              <div className="p-4 border-b border-slate-700"><h3 className="font-semibold text-white flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-400" />Approve Claim</h3></div>
              <div className="p-4 space-y-4">
                <p className="text-slate-300">Approve claim <strong className="text-white">{mockClaim.id}</strong> for payment?</p>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3"><p className="text-green-400 font-medium">Plan will pay: ${billing.planPays.toFixed(2)}</p></div>
                <div><label className="block text-sm font-medium text-slate-300 mb-1">Notes (optional)</label><textarea className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white h-20" placeholder="Add any notes..."></textarea></div>
              </div>
              <div className="flex gap-2 p-4 border-t border-slate-700"><button onClick={() => setShowApproveModal(false)} className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Cancel</button><button onClick={() => handleAction("approved")} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Approve</button></div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Deny Modal */}
      <AnimatePresence>
        {showDenyModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDenyModal(false)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50">
              <div className="p-4 border-b border-slate-700"><h3 className="font-semibold text-white flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-red-400" />Deny Claim</h3></div>
              <div className="p-4 space-y-4">
                <p className="text-slate-300">Deny claim <strong className="text-white">{mockClaim.id}</strong>?</p>
                <div><label className="block text-sm font-medium text-slate-300 mb-1">Denial Reason</label><select className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"><option>Not medically necessary</option><option>Pre-authorization required</option><option>Service not covered</option><option>Duplicate claim</option><option>Other</option></select></div>
                <div><label className="block text-sm font-medium text-slate-300 mb-1">Notes</label><textarea className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white h-20" placeholder="Explain denial reason..."></textarea></div>
              </div>
              <div className="flex gap-2 p-4 border-t border-slate-700"><button onClick={() => setShowDenyModal(false)} className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Cancel</button><button onClick={() => handleAction("denied")} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Deny Claim</button></div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Repricing Modal */}
      <AnimatePresence>
        {showRepriceModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowRepriceModal(false)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[90vh] overflow-auto bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50">
              <div className="p-4 border-b border-slate-700 flex items-center justify-between sticky top-0 bg-slate-800">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-blue-500" />
                  Claims Repricing Engine
                </h3>
                <button onClick={() => setShowRepriceModal(false)} className="p-1 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              
              <div className="p-4 space-y-4">
                {isRepricing ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-4" />
                    <p className="text-white font-medium">Running repricing engine...</p>
                    <p className="text-slate-400 text-sm">Calculating allowed amounts based on provider contracts</p>
                  </div>
                ) : repricingError ? (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <p className="text-red-400 font-medium">Repricing Failed</p>
                    <p className="text-red-300 text-sm">{repricingError}</p>
                  </div>
                ) : repricingResult ? (
                  <>
                    {/* Summary Card */}
                    <div className="bg-gradient-to-r from-blue-600/10 to-emerald-500/10 border border-blue-600/30 rounded-xl p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-slate-400 text-sm">Transaction ID</p>
                          <p className="text-white font-mono text-sm">{repricingResult.transactionId}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-slate-400 text-sm">Processing Time</p>
                          <p className="text-white">{repricingResult.processingTimeMs}ms</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <p className="text-slate-400 text-xs uppercase">Billed</p>
                          <p className="text-white text-xl font-bold">${repricingResult.summary.totalBilledAmount.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs uppercase">Allowed</p>
                          <p className="text-emerald-400 text-xl font-bold">${repricingResult.summary.totalAllowedAmount.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs uppercase">Savings</p>
                          <p className="text-green-400 text-xl font-bold">${repricingResult.summary.totalSavings.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs uppercase">Savings %</p>
                          <p className="text-blue-500 text-xl font-bold">{repricingResult.summary.savingsPercent}%</p>
                        </div>
                      </div>
                    </div>

                    {/* Contract Info */}
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        <h4 className="text-white font-medium">Contract Details</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-slate-400">Contract #</p>
                          <p className="text-white font-mono">{repricingResult.contract.contractNumber}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Network</p>
                          <p className="text-white">{repricingResult.contract.network}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Fee Structure</p>
                          <p className="text-white">{repricingResult.contract.feeStructureType.replace(/_/g, ' ')}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Rate</p>
                          <p className="text-white">{repricingResult.contract.baseRatePercent ? `${repricingResult.contract.baseRatePercent}%` : 'Custom'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Warnings */}
                    {repricingResult.warnings.length > 0 && (
                      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                          <span className="text-amber-400 font-medium text-sm">Warnings</span>
                        </div>
                        <ul className="text-amber-300 text-sm space-y-1">
                          {repricingResult.warnings.map((w, i) => <li key={i}>• {w}</li>)}
                        </ul>
                      </div>
                    )}

                    {/* Line Details */}
                    <div className="border border-slate-700 rounded-lg overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-700">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs text-slate-300 uppercase">CPT</th>
                            <th className="px-3 py-2 text-left text-xs text-slate-300 uppercase">Description</th>
                            <th className="px-3 py-2 text-right text-xs text-slate-300 uppercase">Billed</th>
                            <th className="px-3 py-2 text-right text-xs text-slate-300 uppercase">Allowed</th>
                            <th className="px-3 py-2 text-right text-xs text-slate-300 uppercase">Savings</th>
                            <th className="px-3 py-2 text-left text-xs text-slate-300 uppercase">Rate Source</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                          {repricingResult.lines.map((line, i) => (
                            <tr key={i} className="hover:bg-slate-700/50">
                              <td className="px-3 py-2 font-mono text-blue-500">{line.cptCode}</td>
                              <td className="px-3 py-2 text-white truncate max-w-[200px]">{line.description}</td>
                              <td className="px-3 py-2 text-right text-slate-300">${line.billedAmount.toFixed(2)}</td>
                              <td className="px-3 py-2 text-right text-emerald-400 font-medium">${line.allowedAmount.toFixed(2)}</td>
                              <td className="px-3 py-2 text-right">
                                <span className="text-green-400">${line.savingsAmount.toFixed(2)}</span>
                                <span className="text-slate-500 ml-1">({line.savingsPercent}%)</span>
                              </td>
                              <td className="px-3 py-2 text-slate-400 text-xs truncate max-w-[150px]" title={line.rateDetails.rateSource}>{line.rateDetails.rateSource}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : null}
              </div>
              
              {!isRepricing && repricingResult && (
                <div className="flex gap-2 p-4 border-t border-slate-700 sticky bottom-0 bg-slate-800">
                  <button onClick={() => setShowRepriceModal(false)} className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Close</button>
                  <button onClick={applyRepricingResult} className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Apply Repriced Amounts
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Validation Modal */}
      <AnimatePresence>
        {showValidateModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowValidateModal(false)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[90vh] overflow-auto bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50">
              <div className="p-4 border-b border-slate-700 flex items-center justify-between sticky top-0 bg-slate-800 z-10">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <ClipboardCheck className="w-5 h-5 text-emerald-400" />
                  Claims Validation Engine
                </h3>
                <button onClick={() => setShowValidateModal(false)} className="p-1 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              
              <div className="p-4 space-y-4">
                {isValidating ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mb-4" />
                    <p className="text-white font-medium">Running 5-level validation pipeline...</p>
                    <p className="text-slate-400 text-sm">Syntax → Business → Eligibility → Provider → Clinical</p>
                  </div>
                ) : validationError ? (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <p className="text-red-400 font-medium">Validation Failed</p>
                    <p className="text-red-300 text-sm">{validationError}</p>
                  </div>
                ) : validationResult ? (
                  <>
                    {/* Status Summary */}
                    <div className={`rounded-xl p-5 border ${
                      validationResult.status === 'approved' ? 'bg-green-500/10 border-green-500/30' :
                      validationResult.status === 'accepted' ? 'bg-emerald-500/10 border-emerald-500/30' :
                      validationResult.status === 'pended' ? 'bg-amber-500/10 border-amber-500/30' :
                      validationResult.status === 'denied' ? 'bg-red-500/10 border-red-500/30' :
                      'bg-slate-700/50 border-slate-600'
                    }`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {validationResult.status === 'approved' && <ShieldCheck className="w-10 h-10 text-green-400" />}
                          {validationResult.status === 'accepted' && <CheckCircle className="w-10 h-10 text-emerald-400" />}
                          {validationResult.status === 'pended' && <Pause className="w-10 h-10 text-amber-400" />}
                          {validationResult.status === 'denied' && <XCircle className="w-10 h-10 text-red-400" />}
                          {validationResult.status === 'rejected' && <XCircle className="w-10 h-10 text-red-400" />}
                          <div>
                            <p className={`text-2xl font-bold ${
                              validationResult.status === 'approved' ? 'text-green-400' :
                              validationResult.status === 'accepted' ? 'text-emerald-400' :
                              validationResult.status === 'pended' ? 'text-amber-400' :
                              'text-red-400'
                            }`}>
                              {validationResult.status.toUpperCase()}
                            </p>
                            <p className="text-slate-400 text-sm">
                              {validationResult.autoAdjudicated ? 'Auto-Adjudicated' : 'Manual Review Required'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-slate-400 text-sm">Processing Time</p>
                          <p className="text-white font-mono">{validationResult.processingTimeMs}ms</p>
                        </div>
                      </div>
                      
                      <p className="text-white">{validationResult.summary}</p>
                      
                      {validationResult.autoAdjudicationReason && !validationResult.autoAdjudicated && (
                        <p className="text-amber-400 text-sm mt-2">⚠️ {validationResult.autoAdjudicationReason}</p>
                      )}
                    </div>

                    {/* Validation Levels Progress */}
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h4 className="text-white font-medium mb-3">Validation Pipeline</h4>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((level) => {
                          const completed = validationResult.levelsCompleted.includes(level);
                          const failed = validationResult.validationLevel === level && !validationResult.passed;
                          const levelNames = ['Syntax', 'Business', 'Eligibility', 'Provider', 'Clinical'];
                          
                          return (
                            <div key={level} className="flex-1">
                              <div className={`h-2 rounded-full ${
                                completed && !failed ? 'bg-emerald-500' :
                                failed ? 'bg-red-500' :
                                'bg-slate-600'
                              }`} />
                              <p className={`text-xs mt-1 text-center ${
                                completed && !failed ? 'text-emerald-400' :
                                failed ? 'text-red-400' :
                                'text-slate-500'
                              }`}>
                                L{level}: {levelNames[level - 1]}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Errors */}
                    {validationResult.errors.length > 0 && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                        <h4 className="font-medium text-red-400 mb-3 flex items-center gap-2">
                          <XCircle className="w-4 h-4" />
                          Errors ({validationResult.errors.length})
                        </h4>
                        <div className="space-y-2">
                          {validationResult.errors.map((error, i) => (
                            <div key={i} className="bg-slate-800/50 rounded-lg p-3 border-l-4 border-red-500">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-mono text-xs text-red-400">{error.ruleId}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-slate-400">Level {error.level}</span>
                                  <span className={`px-2 py-0.5 text-xs rounded ${
                                    error.severity === 'REJECT' || error.severity === 'DENY' ? 'bg-red-500/20 text-red-400' :
                                    error.severity === 'PEND' ? 'bg-amber-500/20 text-amber-400' :
                                    'bg-slate-600 text-slate-300'
                                  }`}>{error.severity}</span>
                                </div>
                              </div>
                              <p className="text-white text-sm">{error.errorMessage}</p>
                              {error.field && (
                                <p className="text-slate-500 text-xs mt-1">Field: {error.field}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Warnings */}
                    {validationResult.warnings.length > 0 && (
                      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                        <h4 className="font-medium text-amber-400 mb-3 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          Warnings ({validationResult.warnings.length})
                        </h4>
                        <div className="space-y-2">
                          {validationResult.warnings.map((warning, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm">
                              <span className="font-mono text-xs text-amber-400 mt-0.5">{warning.ruleId}</span>
                              <p className="text-amber-300">{warning.warningMessage}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Pend Info */}
                    {validationResult.pendQueue && (
                      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                        <h4 className="font-medium text-amber-400 mb-2">Pend Queue Assignment</h4>
                        <p className="text-white">Queue: <span className="font-mono">{validationResult.pendQueue}</span></p>
                        {validationResult.pendReason && (
                          <p className="text-amber-300 text-sm mt-1">Reason: {validationResult.pendReason}</p>
                        )}
                      </div>
                    )}

                    {/* Denial Reasons */}
                    {validationResult.denialReasons && validationResult.denialReasons.length > 0 && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                        <h4 className="font-medium text-red-400 mb-2">Denial Reason Codes</h4>
                        <div className="flex flex-wrap gap-2">
                          {validationResult.denialReasons.map((code, i) => (
                            <span key={i} className="px-2 py-1 bg-red-500/20 text-red-400 rounded font-mono text-sm">{code}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : null}
              </div>
              
              {!isValidating && validationResult && (
                <div className="flex gap-2 p-4 border-t border-slate-700 sticky bottom-0 bg-slate-800">
                  <button onClick={() => setShowValidateModal(false)} className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Close</button>
                  {validationResult.status === 'approved' || validationResult.status === 'accepted' ? (
                    <button onClick={() => { setShowValidateModal(false); setShowRepriceModal(true); handleReprice(); }} className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center justify-center gap-2">
                      <Calculator className="w-4 h-4" />
                      Continue to Reprice
                    </button>
                  ) : null}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
