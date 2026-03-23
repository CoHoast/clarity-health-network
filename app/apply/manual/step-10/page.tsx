'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useWizard } from '../../WizardContext';
import { useToast } from '../../Toast';
import StepNavigation from '../StepNavigation';

// Disclosure questions
const DISCLOSURE_QUESTIONS = [
  {
    key: 'licenseRevoked' as const,
    question: 'Have you ever had your medical license revoked, suspended, or restricted in any state?',
  },
  {
    key: 'federalExclusion' as const,
    question: 'Have you ever been excluded from Medicare, Medicaid, or any federal healthcare program?',
  },
  {
    key: 'felonyConviction' as const,
    question: 'Have you ever been convicted of a felony or healthcare-related offense?',
  },
  {
    key: 'malpracticeClaims' as const,
    question: 'Have you had any malpractice claims, settlements, or judgments in the past 10 years?',
  },
  {
    key: 'healthCondition' as const,
    question: 'Do you have any physical or mental condition that could affect your ability to practice medicine safely?',
  },
];

export default function Step10Submit() {
  const router = useRouter();
  const { data, updateNestedData, updateData, setCanProceed, isSubmitting, setIsSubmitting, clearDraft } = useWizard();
  const { addToast } = useToast();
  const w9InputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);
  
  const disclosures = data.disclosures;
  const attestation = data.attestation;
  
  // Check if any disclosure is "yes"
  const hasYesDisclosure = Object.entries(disclosures)
    .filter(([key]) => key !== 'explanation')
    .some(([, value]) => value === true);
  
  // Validate
  useEffect(() => {
    const allDisclosuresAnswered = DISCLOSURE_QUESTIONS.every(
      q => disclosures[q.key] !== null
    );
    
    const explanationValid = !hasYesDisclosure || disclosures.explanation.trim().length > 0;
    
    const attestationValid = 
      attestation.informationAccurate &&
      attestation.understandFalseInfo &&
      attestation.notifyChanges &&
      attestation.agreeToTerms &&
      attestation.signature.trim().length > 0;
    
    const w9Valid = !!data.w9DocumentName;
    
    setCanProceed(allDisclosuresAnswered && explanationValid && attestationValid && w9Valid);
  }, [disclosures, attestation, hasYesDisclosure, data.w9DocumentName, setCanProceed]);
  
  const handleDisclosureChange = (key: keyof typeof disclosures, value: boolean) => {
    updateNestedData('disclosures', { [key]: value });
  };
  
  const handleAttestationChange = (key: keyof typeof attestation, value: boolean | string) => {
    updateNestedData('attestation', { [key]: value });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Show submission in progress toast
      addToast({ type: 'info', message: 'Submitting your application...', duration: 10000 });
      
      // Submit application
      const response = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Clear the draft since submission was successful
        clearDraft();
        
        // Show success toast
        addToast({ type: 'success', message: 'Application submitted successfully!' });
        
        // Redirect to confirmation page with application ID
        router.push(`/apply/confirmation?id=${result.applicationId}`);
      } else {
        addToast({ 
          type: 'error', 
          message: result.error || 'Failed to submit application. Please try again.',
          duration: 6000
        });
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Submit error:', error);
      addToast({ 
        type: 'error', 
        message: 'Network error. Please check your connection and try again.',
        duration: 6000
      });
      setIsSubmitting(false);
    }
  };
  
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  return (
    <StepNavigation step={10}>
      <form id="submit-form" onSubmit={handleSubmit}>
        <div className="p-6 sm:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Disclosures & Submit</h1>
            <p className="mt-2 text-slate-600">
              Please answer the following questions truthfully and complete your attestation.
            </p>
          </div>
          
          <div className="space-y-8">
            {/* Disclosure Questions */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Disclosure Questions</h3>
              
              <div className="space-y-4">
                {DISCLOSURE_QUESTIONS.map((item, index) => (
                  <div
                    key={item.key}
                    className="p-4 border border-slate-200 rounded-lg bg-slate-50/50"
                  >
                    <p className="text-sm text-slate-900 mb-3">
                      <span className="font-medium">{index + 1}.</span> {item.question}
                    </p>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => handleDisclosureChange(item.key, false)}
                        className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium transition-colors ${
                          disclosures[item.key] === false
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        No
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDisclosureChange(item.key, true)}
                        className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium transition-colors ${
                          disclosures[item.key] === true
                            ? 'border-amber-500 bg-amber-50 text-amber-700'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        Yes
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {hasYesDisclosure && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Please explain your "Yes" answer(s): <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Please provide details for each 'Yes' answer above..."
                    value={disclosures.explanation}
                    onChange={(e) => updateNestedData('disclosures', { explanation: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 bg-white resize-none"
                  />
                </div>
              )}
            </div>
            
            {/* Additional Documents */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Additional Documents</h3>
              
              <div className="space-y-4">
                {/* W-9 */}
                <div className="p-4 border border-slate-200 rounded-lg bg-slate-50/50">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-slate-700">
                      W-9 Form <span className="text-red-500">*</span>
                    </label>
                    <a
                      href="https://www.irs.gov/pub/irs-pdf/fw9.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-cyan-600 hover:text-cyan-700"
                    >
                      Download blank W-9 →
                    </a>
                  </div>
                  
                  {data.w9DocumentName ? (
                    <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="flex-1 text-sm text-emerald-700">{data.w9DocumentName}</span>
                      <button
                        type="button"
                        onClick={() => w9InputRef.current?.click()}
                        className="text-sm text-emerald-700 hover:text-emerald-800 font-medium"
                      >
                        Replace
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => w9InputRef.current?.click()}
                      className="w-full p-3 border-2 border-dashed border-slate-300 rounded-lg hover:border-cyan-400 hover:bg-cyan-50/50 transition-colors"
                    >
                      <span className="text-sm text-slate-500">Click to upload W-9</span>
                    </button>
                  )}
                  
                  <input
                    ref={w9InputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) updateData({ w9DocumentName: file.name });
                    }}
                  />
                </div>
                
                {/* CV */}
                <div className="p-4 border border-slate-200 rounded-lg bg-slate-50/50">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    CV/Resume <span className="text-slate-400">(Optional but recommended)</span>
                  </label>
                  
                  {data.cvDocumentName ? (
                    <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="flex-1 text-sm text-emerald-700">{data.cvDocumentName}</span>
                      <button
                        type="button"
                        onClick={() => cvInputRef.current?.click()}
                        className="text-sm text-emerald-700 hover:text-emerald-800 font-medium"
                      >
                        Replace
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => cvInputRef.current?.click()}
                      className="w-full p-3 border-2 border-dashed border-slate-300 rounded-lg hover:border-cyan-400 hover:bg-cyan-50/50 transition-colors"
                    >
                      <span className="text-sm text-slate-500">Click to upload CV/Resume</span>
                    </button>
                  )}
                  
                  <input
                    ref={cvInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) updateData({ cvDocumentName: file.name });
                    }}
                  />
                </div>
              </div>
            </div>
            
            {/* Attestation */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Attestation</h3>
              
              <div className="p-6 border border-slate-200 rounded-xl bg-slate-50/50 space-y-4">
                <p className="text-sm text-slate-700">
                  By submitting this application, I attest that:
                </p>
                
                <div className="space-y-3">
                  {[
                    { key: 'informationAccurate' as const, label: 'All information provided is true and accurate to the best of my knowledge' },
                    { key: 'understandFalseInfo' as const, label: 'I understand providing false information may result in denial or termination' },
                    { key: 'notifyChanges' as const, label: 'I agree to notify Solidarity of any changes to my credentials within 30 days' },
                    { key: 'agreeToTerms' as const, label: 'I have read and agree to the Network Participation Agreement' },
                  ].map((item) => (
                    <label key={item.key} className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={attestation[item.key] as boolean}
                        onChange={(e) => handleAttestationChange(item.key, e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                      />
                      <span className="text-sm text-slate-700">{item.label}</span>
                    </label>
                  ))}
                </div>
                
                <div className="pt-4 border-t border-slate-200">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Electronic Signature <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Type your full legal name"
                        value={attestation.signature}
                        onChange={(e) => handleAttestationChange('signature', e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 bg-white font-medium"
                      />
                      <p className="mt-1 text-xs text-slate-500">
                        By typing your name, you are electronically signing this application
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Date
                      </label>
                      <div className="px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-700">
                        {today}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </StepNavigation>
  );
}
