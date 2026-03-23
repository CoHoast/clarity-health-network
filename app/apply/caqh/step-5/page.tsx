'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCAQH } from '../CAQHContext';

export default function CAQHStep5Submit() {
  const router = useRouter();
  const { 
    profile, 
    caqhProviderId,
    w9DocumentName, 
    setW9DocumentName, 
    attestation, 
    setAttestation,
    setCanProceed, 
    setCurrentStep,
    isSubmitting,
    setIsSubmitting,
  } = useCAQH();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    setCurrentStep(5);
  }, [setCurrentStep]);
  
  // Validate
  useEffect(() => {
    const attestationValid = 
      attestation.informationAccurate &&
      attestation.understandFalseInfo &&
      attestation.notifyChanges &&
      attestation.agreeToTerms &&
      attestation.signature.trim().length > 0;
    
    const w9Valid = !!w9DocumentName;
    
    setCanProceed(attestationValid && w9Valid);
  }, [attestation, w9DocumentName, setCanProceed]);
  
  const handleAttestationChange = (key: keyof typeof attestation, value: boolean | string) => {
    setAttestation({ ...attestation, [key]: value });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Prepare application data from CAQH profile
      const applicationData = {
        applicationSource: 'caqh',
        caqhProviderId,
        providerType: 'individual',
        practice: {
          legalName: profile?.practiceLocations[0]?.practiceName || '',
          address: profile?.practiceLocations[0]?.address || '',
          city: profile?.practiceLocations[0]?.city || '',
          state: profile?.practiceLocations[0]?.state || '',
          zip: profile?.practiceLocations[0]?.zip || '',
          phone: profile?.practiceLocations[0]?.phone || '',
        },
        demographics: {
          firstName: profile?.demographics.firstName,
          middleName: profile?.demographics.middleName,
          lastName: profile?.demographics.lastName,
          credentials: profile?.demographics.credentials,
          npi: profile?.demographics.npi,
          dateOfBirth: profile?.demographics.dateOfBirth,
          gender: profile?.demographics.gender,
          email: profile?.demographics.email,
          phone: profile?.demographics.phone,
          primarySpecialty: profile?.boardCertifications[0]?.specialty || '',
        },
        licenses: profile?.licenses.map(l => ({
          state: l.state,
          licenseNumber: l.licenseNumber,
          issueDate: l.issueDate,
          expirationDate: l.expirationDate,
          status: l.status,
        })),
        dea: profile?.dea ? {
          hasDea: true,
          number: profile.dea.number,
          issueDate: profile.dea.issueDate,
          expirationDate: profile.dea.expirationDate,
          schedules: profile.dea.schedules,
        } : { hasDea: false },
        boardCertifications: {
          isCertified: profile?.boardCertifications.length ? 'yes' : 'no',
          certifications: profile?.boardCertifications.map(c => ({
            board: c.boardName,
            specialty: c.specialty,
            certificationDate: c.certificationDate,
            expirationDate: c.expirationDate,
          })),
        },
        malpractice: profile?.malpracticeInsurance ? {
          carrier: profile.malpracticeInsurance.carrier,
          policyNumber: profile.malpracticeInsurance.policyNumber,
          coveragePerOccurrence: String(profile.malpracticeInsurance.coveragePerOccurrence),
          coverageAggregate: String(profile.malpracticeInsurance.coverageAggregate),
          effectiveDate: profile.malpracticeInsurance.effectiveDate,
          expirationDate: profile.malpracticeInsurance.expirationDate,
        } : {},
        education: {
          medicalSchool: profile?.education.medicalSchool,
          degree: profile?.education.degree,
          graduationDate: profile?.education.graduationDate,
        },
        w9DocumentName,
        attestation: {
          ...attestation,
          signatureDate: new Date().toISOString(),
        },
      };
      
      const response = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicationData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        router.push(`/apply/confirmation?id=${result.applicationId}`);
      } else {
        alert(result.error || 'Failed to submit application. Please try again.');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to submit application. Please try again.');
      setIsSubmitting(false);
    }
  };
  
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  return (
    <form id="caqh-submit-form" onSubmit={handleSubmit}>
      <div className="p-6 sm:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Final Steps</h1>
          <p className="mt-2 text-slate-600">
            Upload your W-9 and complete the attestation to submit your application.
          </p>
        </div>
        
        <div className="space-y-8">
          {/* W-9 Upload */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">W-9 Form</h3>
            
            <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-slate-700">
                  W-9 Form <span className="text-red-500">*</span>
                </label>
                <a
                  href="https://www.irs.gov/pub/irs-pdf/fw9.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Download blank W-9 →
                </a>
              </div>
              
              {w9DocumentName ? (
                <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="flex-1 text-sm text-emerald-700">{w9DocumentName}</span>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-sm text-emerald-700 hover:text-emerald-800 font-medium"
                  >
                    Replace
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
                >
                  <div className="flex flex-col items-center text-slate-500">
                    <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-sm font-medium">Click to upload W-9</span>
                    <span className="text-xs mt-1">PDF, JPG, or PNG (max 10MB)</span>
                  </div>
                </button>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setW9DocumentName(file.name);
                }}
              />
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
                      className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
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
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white font-medium"
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
          
          {/* Summary */}
          <div className="p-4 bg-blue-50 border border-cyan-200 rounded-xl">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <div className="text-sm text-cyan-800">
                <p className="font-medium">CAQH Fast Track Application</p>
                <p className="mt-1">
                  Your credentials from CAQH ProView will be submitted for verification. 
                  This typically speeds up the credentialing process significantly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
