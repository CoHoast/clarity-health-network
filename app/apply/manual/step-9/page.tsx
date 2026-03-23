'use client';

import React, { useEffect, useRef } from 'react';
import { useWizard } from '../../WizardContext';
import StepNavigation from '../StepNavigation';

// Coverage limit options
const COVERAGE_LIMITS = [
  '$100,000',
  '$250,000',
  '$500,000',
  '$1,000,000',
  '$2,000,000',
  '$3,000,000',
  '$5,000,000',
  'Other',
];

export default function Step9Insurance() {
  const { data, updateNestedData, updateData, setCanProceed } = useWizard();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const malpractice = data.malpractice;
  const references = data.references;
  
  // Validate: malpractice required, at least 3 references with name/phone/email
  useEffect(() => {
    const malpracticeValid = 
      malpractice.carrier &&
      malpractice.policyNumber &&
      malpractice.coveragePerOccurrence &&
      malpractice.coverageAggregate &&
      malpractice.effectiveDate &&
      malpractice.expirationDate &&
      malpractice.documentName;
    
    const validRefs = references.filter(ref => ref.name && ref.phone && ref.email);
    
    setCanProceed(!!malpracticeValid && validRefs.length >= 3);
  }, [malpractice, references, setCanProceed]);
  
  const handleMalpracticeChange = (field: keyof typeof malpractice, value: string) => {
    updateNestedData('malpractice', { [field]: value });
  };
  
  const handleReferenceChange = (id: string, field: string, value: string) => {
    const updated = references.map(ref =>
      ref.id === id ? { ...ref, [field]: value } : ref
    );
    updateData({ references: updated });
  };
  
  // Format phone number
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };
  
  const handleFileUpload = (file: File) => {
    handleMalpracticeChange('documentName', file.name);
  };
  
  return (
    <StepNavigation step={9}>
      <div className="p-6 sm:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Malpractice Insurance & References</h1>
          <p className="mt-2 text-slate-600">
            Provide your current malpractice insurance information and professional references.
          </p>
        </div>
        
        <div className="space-y-8">
          {/* Malpractice Insurance */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Malpractice Insurance</h3>
            
            <div className="p-6 border border-slate-200 rounded-xl bg-slate-50/50 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Insurance Carrier <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., ProAssurance"
                    value={malpractice.carrier}
                    onChange={(e) => handleMalpracticeChange('carrier', e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 bg-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Policy Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., PAC-2024-5678"
                    value={malpractice.policyNumber}
                    onChange={(e) => handleMalpracticeChange('policyNumber', e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 bg-white"
                  />
                </div>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Coverage Per Occurrence <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={malpractice.coveragePerOccurrence}
                    onChange={(e) => handleMalpracticeChange('coveragePerOccurrence', e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 bg-white"
                  >
                    <option value="">Select amount</option>
                    {COVERAGE_LIMITS.map(limit => (
                      <option key={limit} value={limit}>{limit}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Aggregate Coverage <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={malpractice.coverageAggregate}
                    onChange={(e) => handleMalpracticeChange('coverageAggregate', e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 bg-white"
                  >
                    <option value="">Select amount</option>
                    {COVERAGE_LIMITS.map(limit => (
                      <option key={limit} value={limit}>{limit}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Effective Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={malpractice.effectiveDate}
                    onChange={(e) => handleMalpracticeChange('effectiveDate', e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 bg-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Expiration Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={malpractice.expirationDate}
                    onChange={(e) => handleMalpracticeChange('expirationDate', e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 bg-white"
                  />
                </div>
              </div>
              
              {/* Document Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Upload Certificate of Insurance <span className="text-red-500">*</span>
                </label>
                
                {malpractice.documentName ? (
                  <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="flex-1 text-sm text-emerald-700">{malpractice.documentName}</span>
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
                    className="w-full p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-cyan-400 hover:bg-cyan-50/50 transition-colors"
                  >
                    <div className="flex flex-col items-center text-slate-500">
                      <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span className="text-sm font-medium">Click to upload COI document</span>
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
                    if (file) handleFileUpload(file);
                  }}
                />
              </div>
            </div>
          </div>
          
          {/* Professional References */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Professional References</h3>
            <p className="text-sm text-slate-600 mb-4">
              Please provide 3 professional references who can attest to your clinical competence.
              References cannot be relatives or current business partners.
            </p>
            
            <div className="space-y-4">
              {references.map((ref, index) => (
                <div
                  key={ref.id}
                  className="p-6 border border-slate-200 rounded-xl bg-slate-50/50"
                >
                  <h4 className="font-medium text-slate-900 mb-4">Reference {index + 1}</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Dr. John Smith, MD"
                        value={ref.name}
                        onChange={(e) => handleReferenceChange(ref.id, 'name', e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 bg-white"
                      />
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          placeholder="e.g., 216-555-9999"
                          value={ref.phone}
                          onChange={(e) => handleReferenceChange(ref.id, 'phone', formatPhone(e.target.value))}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 bg-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          placeholder="e.g., jsmith@clinic.com"
                          value={ref.email}
                          onChange={(e) => handleReferenceChange(ref.id, 'email', e.target.value)}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 bg-white"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Relationship
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Former colleague at Cleveland Clinic"
                        value={ref.relationship}
                        onChange={(e) => handleReferenceChange(ref.id, 'relationship', e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </StepNavigation>
  );
}
