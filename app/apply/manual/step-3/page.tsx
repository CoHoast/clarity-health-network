'use client';

import React, { useEffect, useState } from 'react';
import { useWizard } from '../../WizardContext';
import StepNavigation from '../StepNavigation';

// Medical specialties
const SPECIALTIES = [
  'Allergy & Immunology',
  'Anesthesiology',
  'Cardiology',
  'Cardiovascular Disease',
  'Dermatology',
  'Emergency Medicine',
  'Endocrinology',
  'Family Medicine',
  'Gastroenterology',
  'General Surgery',
  'Geriatric Medicine',
  'Hematology',
  'Infectious Disease',
  'Internal Medicine',
  'Nephrology',
  'Neurology',
  'Neurosurgery',
  'OB/GYN',
  'Oncology',
  'Ophthalmology',
  'Orthopedic Surgery',
  'Otolaryngology (ENT)',
  'Pain Management',
  'Pathology',
  'Pediatrics',
  'Physical Medicine & Rehabilitation',
  'Plastic Surgery',
  'Podiatry',
  'Psychiatry',
  'Pulmonology',
  'Radiology',
  'Rheumatology',
  'Sports Medicine',
  'Urology',
  'Vascular Surgery',
  'Other',
];

// Credentials
const CREDENTIALS = [
  'MD', 'DO', 'NP', 'PA', 'PA-C', 'PhD', 'PsyD', 'LCSW', 'LPC', 'LMFT',
  'PT', 'DPT', 'OT', 'OTD', 'RN', 'APRN', 'CNM', 'CRNA', 'DNP', 'DPM',
  'DC', 'DMD', 'DDS', 'OD', 'PharmD', 'Other'
];

// Suffixes
const SUFFIXES = ['', 'Jr.', 'Sr.', 'II', 'III', 'IV'];

// Genders
const GENDERS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

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
        className={`w-full px-4 py-2.5 border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors ${
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
        className={`w-full px-4 py-2.5 border rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors appearance-none bg-white ${
          error ? 'border-red-300 bg-red-50' : 'border-slate-300'
        }`}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export default function Step3Demographics() {
  const { data, updateNestedData, setCanProceed, errors, setErrors } = useWizard();
  const [npiVerified, setNpiVerified] = useState<boolean | null>(null);
  const [verifying, setVerifying] = useState(false);
  
  const demo = data.demographics;
  
  // Validate required fields
  useEffect(() => {
    const required = ['firstName', 'lastName', 'credentials', 'npi', 'dateOfBirth', 'gender', 'email', 'phone', 'primarySpecialty'];
    const allFilled = required.every(field => demo[field as keyof typeof demo]);
    setCanProceed(allFilled && npiVerified === true);
  }, [demo, npiVerified, setCanProceed]);
  
  const handleChange = (field: keyof typeof demo, value: string | string[]) => {
    updateNestedData('demographics', { [field]: value });
    
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
  
  // Format SSN (XXX-XX-XXXX)
  const formatSSN = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 5) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(5, 9)}`;
  };
  
  // Verify NPI
  const verifyNPI = async () => {
    if (demo.npi.length !== 10) {
      setErrors({ npi: 'NPI must be 10 digits' });
      return;
    }
    
    setVerifying(true);
    try {
      const res = await fetch(`/api/verification?type=nppes&npi=${demo.npi}`);
      const result = await res.json();
      
      if (result.valid) {
        setNpiVerified(true);
        // Auto-fill name if available
        if (result.data) {
          const updates: Partial<typeof demo> = {};
          if (result.data.firstName) updates.firstName = result.data.firstName;
          if (result.data.lastName) updates.lastName = result.data.lastName;
          if (result.data.credentials) updates.credentials = result.data.credentials;
          if (Object.keys(updates).length > 0) {
            updateNestedData('demographics', updates);
          }
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
  
  // Add secondary specialty
  const addSecondarySpecialty = () => {
    if (demo.secondarySpecialties.length < 5) {
      handleChange('secondarySpecialties', [...demo.secondarySpecialties, '']);
    }
  };
  
  // Update secondary specialty
  const updateSecondarySpecialty = (index: number, value: string) => {
    const updated = [...demo.secondarySpecialties];
    updated[index] = value;
    handleChange('secondarySpecialties', updated);
  };
  
  // Remove secondary specialty
  const removeSecondarySpecialty = (index: number) => {
    const updated = demo.secondarySpecialties.filter((_, i) => i !== index);
    handleChange('secondarySpecialties', updated);
  };
  
  return (
    <StepNavigation step={3}>
      <div className="p-6 sm:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Provider Demographics</h1>
          <p className="mt-2 text-slate-600">
            Enter your personal and professional information.
          </p>
        </div>
        
        <div className="space-y-6">
          {/* Name Section */}
          <div className="grid sm:grid-cols-4 gap-4">
            <Input
              label="First Name"
              required
              placeholder="e.g., Sarah"
              value={demo.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              error={errors.firstName}
            />
            <Input
              label="Middle Name"
              placeholder="e.g., Marie"
              value={demo.middleName}
              onChange={(e) => handleChange('middleName', e.target.value)}
            />
            <Input
              label="Last Name"
              required
              placeholder="e.g., Mitchell"
              value={demo.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              error={errors.lastName}
            />
            <Select
              label="Suffix"
              value={demo.suffix}
              onChange={(e) => handleChange('suffix', e.target.value)}
            >
              {SUFFIXES.map(s => (
                <option key={s} value={s}>{s || '(none)'}</option>
              ))}
            </Select>
          </div>
          
          {/* Credentials and NPI */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Select
              label="Credentials"
              required
              value={demo.credentials}
              onChange={(e) => handleChange('credentials', e.target.value)}
              error={errors.credentials}
            >
              <option value="">Select credentials</option>
              {CREDENTIALS.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                NPI (Type 1 - Individual)
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="10-digit NPI"
                  value={demo.npi}
                  onChange={(e) => handleChange('npi', e.target.value.replace(/\D/g, '').slice(0, 10))}
                  maxLength={10}
                  className={`flex-1 px-4 py-2.5 border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors ${
                    errors.npi ? 'border-red-300 bg-red-50' : 
                    npiVerified === true ? 'border-emerald-300 bg-emerald-50' : 
                    'border-slate-300 bg-white'
                  }`}
                />
                <button
                  type="button"
                  onClick={verifyNPI}
                  disabled={demo.npi.length !== 10 || verifying}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${
                    demo.npi.length === 10 && !verifying
                      ? 'bg-blue-600 text-white hover:bg-cyan-700'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {verifying ? (
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : npiVerified ? '✓' : 'Verify'}
                </button>
              </div>
              {errors.npi && <p className="mt-1 text-xs text-red-600">{errors.npi}</p>}
              {npiVerified === true && <p className="mt-1 text-xs text-emerald-600">✓ Verified with NPPES</p>}
            </div>
          </div>
          
          {/* Personal Info */}
          <div className="pt-4 border-t border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Personal Information</h3>
            
            <div className="grid sm:grid-cols-3 gap-4">
              <Input
                label="Date of Birth"
                required
                type="date"
                value={demo.dateOfBirth}
                onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                error={errors.dateOfBirth}
              />
              <Select
                label="Gender"
                required
                value={demo.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                error={errors.gender}
              >
                <option value="">Select gender</option>
                {GENDERS.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </Select>
              <Input
                label="SSN"
                type="password"
                placeholder="XXX-XX-XXXX"
                value={demo.ssn}
                onChange={(e) => handleChange('ssn', formatSSN(e.target.value))}
                maxLength={11}
                hint="Encrypted and secure"
              />
            </div>
          </div>
          
          {/* Contact Info */}
          <div className="pt-4 border-t border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Contact Information</h3>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Email"
                required
                type="email"
                placeholder="e.g., dr.mitchell@clevelandheart.com"
                value={demo.email}
                onChange={(e) => handleChange('email', e.target.value)}
                error={errors.email}
              />
              <Input
                label="Phone"
                required
                type="tel"
                placeholder="e.g., 216-555-1234"
                value={demo.phone}
                onChange={(e) => handleChange('phone', formatPhone(e.target.value))}
                error={errors.phone}
              />
            </div>
          </div>
          
          {/* Specialties */}
          <div className="pt-4 border-t border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Specialties</h3>
            
            <div className="space-y-4">
              <Select
                label="Primary Specialty"
                required
                value={demo.primarySpecialty}
                onChange={(e) => handleChange('primarySpecialty', e.target.value)}
                error={errors.primarySpecialty}
              >
                <option value="">Select primary specialty</option>
                {SPECIALTIES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Select>
              
              {demo.secondarySpecialties.map((specialty, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-1">
                    <Select
                      label={`Secondary Specialty ${index + 1}`}
                      value={specialty}
                      onChange={(e) => updateSecondarySpecialty(index, e.target.value)}
                    >
                      <option value="">Select specialty</option>
                      {SPECIALTIES.filter(s => s !== demo.primarySpecialty).map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </Select>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSecondarySpecialty(index)}
                    className="self-end mb-0.5 p-2.5 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
              
              {demo.secondarySpecialties.length < 5 && (
                <button
                  type="button"
                  onClick={addSecondarySpecialty}
                  className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add another specialty
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </StepNavigation>
  );
}
