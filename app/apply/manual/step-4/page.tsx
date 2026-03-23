'use client';

import React, { useEffect, useRef } from 'react';
import { useWizard } from '../../WizardContext';
import StepNavigation from '../StepNavigation';
import { v4 as uuid } from 'uuid';

// US States
const US_STATES = [
  { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' }, { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' }, { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' }, { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' }, { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' }, { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' }, { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' }, { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' }, { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' }, { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' }, { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' }, { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' }, { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' }, { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' }, { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' }, { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' }, { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' }, { code: 'DC', name: 'Washington DC' }
];

const LICENSE_STATUSES = ['Active', 'Inactive', 'Pending', 'Expired', 'Suspended', 'Revoked'];

interface License {
  id: string;
  state: string;
  licenseNumber: string;
  issueDate: string;
  expirationDate: string;
  status: string;
  documentName?: string;
}

export default function Step4Licenses() {
  const { data, updateData, setCanProceed } = useWizard();
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  
  const licenses = data.licenses;
  
  // Validate: at least one complete license
  useEffect(() => {
    const hasValidLicense = licenses.some(lic => 
      lic.state && 
      lic.licenseNumber && 
      lic.issueDate && 
      lic.expirationDate && 
      lic.status &&
      lic.documentName
    );
    setCanProceed(hasValidLicense);
  }, [licenses, setCanProceed]);
  
  // Add empty license on mount if none exist
  useEffect(() => {
    if (licenses.length === 0) {
      addLicense();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const addLicense = () => {
    const newLicense: License = {
      id: uuid(),
      state: '',
      licenseNumber: '',
      issueDate: '',
      expirationDate: '',
      status: 'Active',
    };
    updateData({ licenses: [...licenses, newLicense] });
  };
  
  const updateLicense = (id: string, field: keyof License, value: string) => {
    const updated = licenses.map(lic => 
      lic.id === id ? { ...lic, [field]: value } : lic
    );
    updateData({ licenses: updated });
  };
  
  const removeLicense = (id: string) => {
    if (licenses.length > 1) {
      updateData({ licenses: licenses.filter(lic => lic.id !== id) });
    }
  };
  
  const handleFileUpload = (id: string, file: File) => {
    // In real app, would upload to S3 and store URL
    // For demo, just store file name
    updateLicense(id, 'documentName', file.name);
  };
  
  return (
    <StepNavigation step={4}>
      <div className="p-6 sm:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">State Medical Licenses</h1>
          <p className="mt-2 text-slate-600">
            Enter all active state medical licenses. At least one license is required.
          </p>
        </div>
        
        <div className="space-y-6">
          {licenses.map((license, index) => (
            <div
              key={license.id}
              className="p-6 border border-slate-200 rounded-xl bg-slate-50/50"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">License {index + 1}</h3>
                {licenses.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLicense(license.id)}
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
                      State <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={license.state}
                      onChange={(e) => updateLicense(license.id, 'state', e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 bg-white"
                    >
                      <option value="">Select state</option>
                      {US_STATES.map(s => (
                        <option key={s.code} value={s.code}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      License Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 35-123456"
                      value={license.licenseNumber}
                      onChange={(e) => updateLicense(license.id, 'licenseNumber', e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 bg-white"
                    />
                  </div>
                </div>
                
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Issue Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={license.issueDate}
                      onChange={(e) => updateLicense(license.id, 'issueDate', e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 bg-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Expiration Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={license.expirationDate}
                      onChange={(e) => updateLicense(license.id, 'expirationDate', e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 bg-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={license.status}
                      onChange={(e) => updateLicense(license.id, 'status', e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 bg-white"
                    >
                      {LICENSE_STATUSES.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Document Upload */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Upload License Copy <span className="text-red-500">*</span>
                  </label>
                  
                  {license.documentName ? (
                    <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="flex-1 text-sm text-emerald-700">{license.documentName}</span>
                      <button
                        type="button"
                        onClick={() => fileInputRefs.current[license.id]?.click()}
                        className="text-sm text-emerald-700 hover:text-emerald-800 font-medium"
                      >
                        Replace
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRefs.current[license.id]?.click()}
                      className="w-full p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-cyan-400 hover:bg-cyan-50/50 transition-colors"
                    >
                      <div className="flex flex-col items-center text-slate-500">
                        <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span className="text-sm font-medium">Click to upload license document</span>
                        <span className="text-xs mt-1">PDF, JPG, or PNG (max 10MB)</span>
                      </div>
                    </button>
                  )}
                  
                  <input
                    ref={(el) => { fileInputRefs.current[license.id] = el; }}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(license.id, file);
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addLicense}
            className="w-full p-4 border-2 border-dashed border-slate-300 rounded-xl hover:border-cyan-400 hover:bg-cyan-50/50 transition-colors"
          >
            <div className="flex items-center justify-center gap-2 text-slate-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="font-medium">Add Another License</span>
            </div>
          </button>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-medium">Primary Source Verification</p>
              <p className="mt-1">
                We will verify all licenses directly with the state medical boards. 
                Please ensure all information matches your official license records.
              </p>
            </div>
          </div>
        </div>
      </div>
    </StepNavigation>
  );
}
