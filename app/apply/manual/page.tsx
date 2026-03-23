'use client';

import React, { useEffect } from 'react';
import { useWizard } from '../WizardContext';

// Icons
const UserIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const BuildingIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

type ProviderType = 'individual' | 'group' | 'facility';

interface ProviderOption {
  type: ProviderType;
  title: string;
  description: string;
  examples: string;
  icon: React.ReactNode;
}

const providerOptions: ProviderOption[] = [
  {
    type: 'individual',
    title: 'Individual Practitioner',
    description: 'A single healthcare provider practicing independently or as part of a larger organization.',
    examples: 'MD, DO, NP, PA, PT, OT, Psychologist, etc.',
    icon: <UserIcon />,
  },
  {
    type: 'group',
    title: 'Group Practice',
    description: 'Multiple providers practicing under a single Tax Identification Number (TIN).',
    examples: 'Medical groups, physician partnerships, multi-specialty clinics',
    icon: <UsersIcon />,
  },
  {
    type: 'facility',
    title: 'Facility / Organization',
    description: 'A healthcare facility or organization providing services under a single entity.',
    examples: 'Hospitals, imaging centers, surgery centers, labs, urgent care',
    icon: <BuildingIcon />,
  },
];

export default function Step1ProviderType() {
  const { data, updateData, setCanProceed, setCurrentStep } = useWizard();
  
  // Ensure we're on step 1
  useEffect(() => {
    setCurrentStep(1);
  }, [setCurrentStep]);
  
  // Enable proceed when a type is selected
  useEffect(() => {
    setCanProceed(!!data.providerType);
  }, [data.providerType, setCanProceed]);
  
  const handleSelect = (type: ProviderType) => {
    updateData({ providerType: type });
  };
  
  return (
    <div className="p-6 sm:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">What type of provider are you?</h1>
        <p className="mt-2 text-slate-600">
          Select the option that best describes your practice. This helps us tailor the application to your needs.
        </p>
      </div>
      
      <div className="space-y-4">
        {providerOptions.map((option) => {
          const isSelected = data.providerType === option.type;
          
          return (
            <button
              key={option.type}
              onClick={() => handleSelect(option.type)}
              className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isSelected
                      ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {option.icon}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-lg font-semibold ${isSelected ? 'text-blue-700' : 'text-slate-900'}`}>
                      {option.title}
                    </h3>
                    {isSelected && (
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckIcon />
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{option.description}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    <span className="font-medium">Examples:</span> {option.examples}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-amber-800">
            <p className="font-medium">Not sure which to choose?</p>
            <p className="mt-1">
              If you're a solo practitioner with your own NPI and TIN, choose "Individual Practitioner." 
              If multiple providers share a single TIN, choose "Group Practice."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
