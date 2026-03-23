'use client';

import React, { useEffect, useState } from 'react';
import { useWizard } from '../../WizardContext';
import StepNavigation from '../StepNavigation';

// US States for dropdown
const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC'
];

// Input component
function Input({ 
  label, 
  required, 
  error, 
  hint,
  ...props 
}: { 
  label: string; 
  required?: boolean; 
  error?: string;
  hint?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        {...props}
        className={`w-full px-4 py-2.5 border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-colors ${
          error ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-white'
        }`}
      />
      {hint && !error && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

// Select component
function Select({ 
  label, 
  required, 
  error, 
  children,
  ...props 
}: { 
  label: string; 
  required?: boolean; 
  error?: string;
  children: React.ReactNode;
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        {...props}
        className={`w-full px-4 py-2.5 border rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-colors appearance-none bg-white ${
          error ? 'border-red-300 bg-red-50' : 'border-slate-300'
        }`}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export default function Step2PracticeInfo() {
  const { data, updateNestedData, setCanProceed, errors, setErrors } = useWizard();
  const [npiVerified, setNpiVerified] = useState<boolean | null>(null);
  const [verifying, setVerifying] = useState(false);
  
  const practice = data.practice;
  
  // Validate required fields
  useEffect(() => {
    const required = ['legalName', 'tin', 'npi', 'address', 'city', 'state', 'zip', 'phone', 'email'];
    const allFilled = required.every(field => practice[field as keyof typeof practice]?.trim());
    setCanProceed(allFilled && npiVerified === true);
  }, [practice, npiVerified, setCanProceed]);
  
  const handleChange = (field: keyof typeof practice, value: string) => {
    updateNestedData('practice', { [field]: value });
    
    // Reset NPI verification if NPI changes
    if (field === 'npi') {
      setNpiVerified(null);
    }
  };
  
  // Format phone number
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };
  
  // Format TIN (XX-XXXXXXX)
  const formatTIN = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    return `${numbers.slice(0, 2)}-${numbers.slice(2, 9)}`;
  };
  
  // Verify NPI with NPPES
  const verifyNPI = async () => {
    if (practice.npi.length !== 10) {
      setErrors({ npi: 'NPI must be 10 digits' });
      return;
    }
    
    setVerifying(true);
    try {
      const res = await fetch(`/api/verification?type=nppes&npi=${practice.npi}`);
      const result = await res.json();
      
      if (result.valid) {
        setNpiVerified(true);
        // Auto-fill some fields if available
        if (result.data?.name) {
          updateNestedData('practice', { legalName: result.data.name });
        }
      } else {
        setNpiVerified(false);
        setErrors({ npi: 'NPI not found in NPPES registry' });
      }
    } catch {
      setNpiVerified(false);
      setErrors({ npi: 'Unable to verify NPI. Please try again.' });
    } finally {
      setVerifying(false);
    }
  };
  
  return (
    <StepNavigation step={2}>
      <div className="p-6 sm:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Practice Information</h1>
          <p className="mt-2 text-slate-600">
            Enter the details for your practice or organization.
          </p>
        </div>
        
        <div className="space-y-6">
          {/* Practice Name Section */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Legal Practice Name"
              required
              placeholder="e.g., Cleveland Heart Center, LLC"
              value={practice.legalName}
              onChange={(e) => handleChange('legalName', e.target.value)}
              error={errors.legalName}
            />
            <Input
              label="Doing Business As (DBA)"
              placeholder="e.g., Cleveland Heart Center"
              value={practice.dba}
              onChange={(e) => handleChange('dba', e.target.value)}
              hint="If different from legal name"
            />
          </div>
          
          {/* Tax ID and NPI */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Tax ID (TIN)"
              required
              placeholder="XX-XXXXXXX"
              value={practice.tin}
              onChange={(e) => handleChange('tin', formatTIN(e.target.value))}
              maxLength={10}
              error={errors.tin}
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                NPI (Type 2 - Organization)
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="10-digit NPI"
                  value={practice.npi}
                  onChange={(e) => handleChange('npi', e.target.value.replace(/\D/g, '').slice(0, 10))}
                  maxLength={10}
                  className={`flex-1 px-4 py-2.5 border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-colors ${
                    errors.npi ? 'border-red-300 bg-red-50' : 
                    npiVerified === true ? 'border-emerald-300 bg-emerald-50' : 
                    'border-slate-300 bg-white'
                  }`}
                />
                <button
                  type="button"
                  onClick={verifyNPI}
                  disabled={practice.npi.length !== 10 || verifying}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${
                    practice.npi.length === 10 && !verifying
                      ? 'bg-cyan-600 text-white hover:bg-cyan-700'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {verifying ? (
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : npiVerified === true ? (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : 'Verify'}
                </button>
              </div>
              {errors.npi && <p className="mt-1 text-xs text-red-600">{errors.npi}</p>}
              {npiVerified === true && <p className="mt-1 text-xs text-emerald-600">✓ Verified with NPPES</p>}
            </div>
          </div>
          
          {/* Address Section */}
          <div className="pt-4 border-t border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Practice Address</h3>
            
            <div className="space-y-4">
              <Input
                label="Street Address"
                required
                placeholder="e.g., 4500 Euclid Ave"
                value={practice.address}
                onChange={(e) => handleChange('address', e.target.value)}
                error={errors.address}
              />
              <Input
                label="Suite/Floor/Unit"
                placeholder="e.g., Suite 201"
                value={practice.addressLine2}
                onChange={(e) => handleChange('addressLine2', e.target.value)}
              />
              <div className="grid sm:grid-cols-6 gap-4">
                <div className="sm:col-span-3">
                  <Input
                    label="City"
                    required
                    placeholder="e.g., Cleveland"
                    value={practice.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    error={errors.city}
                  />
                </div>
                <div className="sm:col-span-1">
                  <Select
                    label="State"
                    required
                    value={practice.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    error={errors.state}
                  >
                    <option value="">--</option>
                    {US_STATES.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </Select>
                </div>
                <div className="sm:col-span-2">
                  <Input
                    label="ZIP Code"
                    required
                    placeholder="e.g., 44103"
                    value={practice.zip}
                    onChange={(e) => handleChange('zip', e.target.value.replace(/\D/g, '').slice(0, 5))}
                    maxLength={5}
                    error={errors.zip}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Section */}
          <div className="pt-4 border-t border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Contact Information</h3>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Phone"
                required
                type="tel"
                placeholder="e.g., 216-555-1234"
                value={practice.phone}
                onChange={(e) => handleChange('phone', formatPhone(e.target.value))}
                error={errors.phone}
              />
              <Input
                label="Fax"
                type="tel"
                placeholder="e.g., 216-555-1235"
                value={practice.fax}
                onChange={(e) => handleChange('fax', formatPhone(e.target.value))}
              />
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <Input
                label="Practice Email"
                required
                type="email"
                placeholder="e.g., admin@clevelandheart.com"
                value={practice.email}
                onChange={(e) => handleChange('email', e.target.value)}
                error={errors.email}
              />
              <Input
                label="Website"
                type="url"
                placeholder="e.g., https://clevelandheart.com"
                value={practice.website}
                onChange={(e) => handleChange('website', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </StepNavigation>
  );
}
