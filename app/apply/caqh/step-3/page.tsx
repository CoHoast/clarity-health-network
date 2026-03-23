'use client';

import React, { useEffect, useState } from 'react';
import { useCAQH, CAQHProfile } from '../CAQHContext';

// Simulated CAQH data for demo
const mockCAQHProfile: CAQHProfile = {
  caqhProviderId: '',
  demographics: {
    firstName: 'Sarah',
    middleName: 'Marie',
    lastName: 'Mitchell',
    suffix: '',
    credentials: 'MD',
    dateOfBirth: '1975-05-15',
    gender: 'Female',
    npi: '1234567890',
    email: 'dr.mitchell@clevelandheart.com',
    phone: '216-555-1234',
  },
  licenses: [
    {
      state: 'OH',
      licenseNumber: '35-123456',
      licenseType: 'MD',
      issueDate: '2020-06-15',
      expirationDate: '2026-06-15',
      status: 'Active',
    },
    {
      state: 'PA',
      licenseNumber: 'MD-456789',
      licenseType: 'MD',
      issueDate: '2019-12-01',
      expirationDate: '2025-12-01',
      status: 'Active',
    },
  ],
  dea: {
    number: 'AM1234567',
    issueDate: '2024-03-01',
    expirationDate: '2027-03-01',
    schedules: ['II', 'III', 'IV', 'V'],
  },
  boardCertifications: [
    {
      boardName: 'American Board of Internal Medicine',
      specialty: 'Cardiovascular Disease',
      certificationDate: '2010-12-01',
      expirationDate: '2030-12-01',
      status: 'Active',
    },
  ],
  malpracticeInsurance: {
    carrier: 'ProAssurance',
    policyNumber: 'PAC-2024-5678',
    coveragePerOccurrence: 1000000,
    coverageAggregate: 3000000,
    effectiveDate: '2025-01-01',
    expirationDate: '2026-01-01',
  },
  education: {
    medicalSchool: 'Case Western Reserve University School of Medicine',
    degree: 'MD',
    graduationDate: '2002-05-01',
  },
  practiceLocations: [
    {
      practiceName: 'Cleveland Heart Center',
      address: '4500 Euclid Ave, Suite 201',
      city: 'Cleveland',
      state: 'OH',
      zip: '44103',
      phone: '216-555-1234',
    },
  ],
};

const pullSteps = [
  { key: 'connecting', label: 'Connecting to CAQH...', delay: 800 },
  { key: 'demographics', label: 'Demographics retrieved', delay: 600 },
  { key: 'licenses', label: 'Licenses retrieved (2 found)', delay: 500 },
  { key: 'dea', label: 'DEA registration retrieved', delay: 400 },
  { key: 'certifications', label: 'Board certifications retrieved', delay: 500 },
  { key: 'malpractice', label: 'Malpractice insurance retrieved', delay: 400 },
  { key: 'education', label: 'Education history retrieved', delay: 400 },
  { key: 'locations', label: 'Practice locations retrieved (1 found)', delay: 500 },
  { key: 'complete', label: 'All data retrieved successfully!', delay: 0 },
];

export default function CAQHStep3PullData() {
  const { caqhProviderId, setProfile, setCanProceed, setCurrentStep, setError } = useCAQH();
  const [currentPullStep, setCurrentPullStep] = useState(0);
  const [pulling, setPulling] = useState(false);
  const [completed, setCompleted] = useState(false);
  
  useEffect(() => {
    setCurrentStep(3);
  }, [setCurrentStep]);
  
  useEffect(() => {
    setCanProceed(completed);
  }, [completed, setCanProceed]);
  
  // Auto-start pull when page loads
  useEffect(() => {
    if (!pulling && !completed && currentPullStep === 0) {
      startPull();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const startPull = async () => {
    setPulling(true);
    setError(null);
    
    // Simulate progressive data pull
    for (let i = 0; i < pullSteps.length; i++) {
      setCurrentPullStep(i);
      await new Promise(resolve => setTimeout(resolve, pullSteps[i].delay));
    }
    
    // Set the mock profile with the CAQH ID
    const profile = { ...mockCAQHProfile, caqhProviderId };
    setProfile(profile);
    setPulling(false);
    setCompleted(true);
  };
  
  const getStepIcon = (index: number) => {
    if (index < currentPullStep) {
      return (
        <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      );
    } else if (index === currentPullStep && pulling) {
      return (
        <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-white animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      );
    } else {
      return (
        <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-slate-400 rounded-full" />
        </div>
      );
    }
  };
  
  return (
    <div className="p-6 sm:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Retrieving Your Credentials</h1>
        <p className="mt-2 text-slate-600">
          We're pulling your information from CAQH ProView. This usually takes just a few seconds.
        </p>
      </div>
      
      <div className="max-w-md mx-auto">
        {/* Progress Steps */}
        <div className="space-y-3">
          {pullSteps.map((step, index) => (
            <div
              key={step.key}
              className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-300 ${
                index <= currentPullStep
                  ? 'bg-slate-50'
                  : 'opacity-50'
              }`}
            >
              {getStepIcon(index)}
              <span className={`text-sm ${
                index < currentPullStep
                  ? 'text-emerald-700 font-medium'
                  : index === currentPullStep
                  ? 'text-cyan-700 font-medium'
                  : 'text-slate-500'
              }`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
        
        {/* Success Message */}
        {completed && (
          <div className="mt-8 p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-emerald-900">Data Retrieved Successfully!</h3>
            <p className="text-sm text-emerald-700 mt-2">
              Click "Continue" to review your information.
            </p>
          </div>
        )}
        
        {/* Retry Button (in case of error) */}
        {!pulling && !completed && currentPullStep > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={startPull}
              className="px-6 py-3 bg-cyan-600 text-white font-medium rounded-lg hover:bg-cyan-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
