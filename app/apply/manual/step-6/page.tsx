'use client';

import React, { useEffect, useRef } from 'react';
import { useWizard } from '../../WizardContext';
import StepNavigation from '../StepNavigation';
import { v4 as uuid } from 'uuid';

// Common certifying boards
const CERTIFYING_BOARDS = [
  'American Board of Allergy and Immunology',
  'American Board of Anesthesiology',
  'American Board of Dermatology',
  'American Board of Emergency Medicine',
  'American Board of Family Medicine',
  'American Board of Internal Medicine',
  'American Board of Medical Genetics and Genomics',
  'American Board of Neurological Surgery',
  'American Board of Nuclear Medicine',
  'American Board of Obstetrics and Gynecology',
  'American Board of Ophthalmology',
  'American Board of Orthopaedic Surgery',
  'American Board of Otolaryngology',
  'American Board of Pathology',
  'American Board of Pediatrics',
  'American Board of Physical Medicine and Rehabilitation',
  'American Board of Plastic Surgery',
  'American Board of Preventive Medicine',
  'American Board of Psychiatry and Neurology',
  'American Board of Radiology',
  'American Board of Surgery',
  'American Board of Thoracic Surgery',
  'American Board of Urology',
  'American Osteopathic Association (AOA)',
  'National Board of Medical Examiners',
  'Other',
];

// Board specialties (subset for demo)
const BOARD_SPECIALTIES = [
  'Adolescent Medicine',
  'Cardiovascular Disease',
  'Clinical Cardiac Electrophysiology',
  'Critical Care Medicine',
  'Dermatology',
  'Emergency Medicine',
  'Endocrinology',
  'Family Medicine',
  'Gastroenterology',
  'Geriatric Medicine',
  'Hematology',
  'Hospice and Palliative Medicine',
  'Infectious Disease',
  'Internal Medicine',
  'Interventional Cardiology',
  'Medical Oncology',
  'Nephrology',
  'Neurology',
  'Pain Medicine',
  'Pediatrics',
  'Psychiatry',
  'Pulmonary Disease',
  'Rheumatology',
  'Sleep Medicine',
  'Sports Medicine',
  'Other',
];

interface Certification {
  id: string;
  board: string;
  specialty: string;
  certificationDate: string;
  expirationDate: string;
  documentName?: string;
}

export default function Step6Certifications() {
  const { data, updateData, updateNestedData, setCanProceed } = useWizard();
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  
  const { isCertified, certifications } = data.boardCertifications;
  
  // Validate
  useEffect(() => {
    if (isCertified === 'no' || isCertified === 'eligible') {
      setCanProceed(true);
    } else if (isCertified === 'yes') {
      const hasValidCert = certifications.some(cert => 
        cert.board && cert.specialty && cert.certificationDate && cert.documentName
      );
      setCanProceed(hasValidCert);
    } else {
      setCanProceed(false);
    }
  }, [isCertified, certifications, setCanProceed]);
  
  const handleCertifiedChange = (value: 'yes' | 'no' | 'eligible') => {
    updateNestedData('boardCertifications', { isCertified: value });
    
    // Add empty certification if selecting yes and none exist
    if (value === 'yes' && certifications.length === 0) {
      addCertification();
    }
  };
  
  const addCertification = () => {
    const newCert: Certification = {
      id: uuid(),
      board: '',
      specialty: '',
      certificationDate: '',
      expirationDate: '',
    };
    updateData({
      boardCertifications: {
        ...data.boardCertifications,
        certifications: [...certifications, newCert],
      },
    });
  };
  
  const updateCertification = (id: string, field: keyof Certification, value: string) => {
    const updated = certifications.map(cert =>
      cert.id === id ? { ...cert, [field]: value } : cert
    );
    updateData({
      boardCertifications: {
        ...data.boardCertifications,
        certifications: updated,
      },
    });
  };
  
  const removeCertification = (id: string) => {
    if (certifications.length > 1) {
      updateData({
        boardCertifications: {
          ...data.boardCertifications,
          certifications: certifications.filter(cert => cert.id !== id),
        },
      });
    }
  };
  
  const handleFileUpload = (id: string, file: File) => {
    updateCertification(id, 'documentName', file.name);
  };
  
  return (
    <StepNavigation step={6}>
      <div className="p-6 sm:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Board Certifications</h1>
          <p className="mt-2 text-slate-600">
            Provide information about your board certifications, if applicable.
          </p>
        </div>
        
        <div className="space-y-6">
          {/* Board certified? */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Are you board certified? <span className="text-red-500">*</span>
            </label>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { value: 'yes' as const, label: 'Yes', icon: '✓' },
                { value: 'no' as const, label: 'No', icon: '✗' },
                { value: 'eligible' as const, label: 'Board Eligible', icon: '○' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleCertifiedChange(option.value)}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    isCertified === option.value
                      ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span className={`text-lg ${isCertified === option.value ? 'text-cyan-600' : 'text-slate-400'}`}>
                      {option.icon}
                    </span>
                    <span className="font-medium">{option.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {isCertified === 'yes' && (
            <>
              {certifications.map((cert, index) => (
                <div
                  key={cert.id}
                  className="p-6 border border-slate-200 rounded-xl bg-slate-50/50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900">Certification {index + 1}</h3>
                    {certifications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCertification(cert.id)}
                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Certifying Board <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={cert.board}
                          onChange={(e) => updateCertification(cert.id, 'board', e.target.value)}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 bg-white"
                        >
                          <option value="">Select board</option>
                          {CERTIFYING_BOARDS.map(b => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Specialty <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={cert.specialty}
                          onChange={(e) => updateCertification(cert.id, 'specialty', e.target.value)}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 bg-white"
                        >
                          <option value="">Select specialty</option>
                          {BOARD_SPECIALTIES.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Initial Certification Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={cert.certificationDate}
                          onChange={(e) => updateCertification(cert.id, 'certificationDate', e.target.value)}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 bg-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Expiration Date
                        </label>
                        <input
                          type="date"
                          value={cert.expirationDate}
                          onChange={(e) => updateCertification(cert.id, 'expirationDate', e.target.value)}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 bg-white"
                        />
                        <p className="mt-1 text-xs text-slate-500">Leave blank if lifetime certification</p>
                      </div>
                    </div>
                    
                    {/* Document Upload */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Upload Certification <span className="text-red-500">*</span>
                      </label>
                      
                      {cert.documentName ? (
                        <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="flex-1 text-sm text-emerald-700">{cert.documentName}</span>
                          <button
                            type="button"
                            onClick={() => fileInputRefs.current[cert.id]?.click()}
                            className="text-sm text-emerald-700 hover:text-emerald-800 font-medium"
                          >
                            Replace
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => fileInputRefs.current[cert.id]?.click()}
                          className="w-full p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-cyan-400 hover:bg-cyan-50/50 transition-colors"
                        >
                          <div className="flex flex-col items-center text-slate-500">
                            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <span className="text-sm font-medium">Click to upload certification document</span>
                            <span className="text-xs mt-1">PDF, JPG, or PNG (max 10MB)</span>
                          </div>
                        </button>
                      )}
                      
                      <input
                        ref={(el) => { fileInputRefs.current[cert.id] = el; }}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(cert.id, file);
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addCertification}
                className="w-full p-4 border-2 border-dashed border-slate-300 rounded-xl hover:border-cyan-400 hover:bg-cyan-50/50 transition-colors"
              >
                <div className="flex items-center justify-center gap-2 text-slate-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="font-medium">Add Another Certification</span>
                </div>
              </button>
            </>
          )}
          
          {isCertified === 'eligible' && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Board Eligible Status</p>
                  <p className="mt-1">
                    If you're board eligible (completed training but haven't yet passed board exams), 
                    you can still join our network. Please provide documentation of your training completion 
                    in the Education section.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {isCertified === 'no' && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-amber-800">
                  <p className="font-medium">No Board Certification</p>
                  <p className="mt-1">
                    Board certification may be required depending on your specialty. Our credentialing 
                    committee will review your application and may request additional information.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </StepNavigation>
  );
}
