'use client';

import React from 'react';
import { useWizard } from './WizardContext';
import Link from 'next/link';

// Step labels for progress indicator
const stepLabels = [
  'Provider Type',
  'Practice Info',
  'Demographics',
  'Licenses',
  'DEA',
  'Certifications',
  'Education',
  'Work History',
  'Insurance',
  'Submit',
];

// Icons for sidebar
const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const BuildingIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

export default function WizardLayout({ children }: { children: React.ReactNode }) {
  const { currentStep, totalSteps, prevStep, nextStep, canProceed, isSubmitting } = useWizard();
  
  const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-teal-600 rounded-xl flex items-center justify-center text-white">
                <BuildingIcon />
              </div>
              <div>
                <span className="text-lg font-bold text-slate-900">Solidarity</span>
                <span className="text-lg font-light text-slate-600 ml-1">Health Network</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-500">Need help?</span>
              <a href="mailto:credentialing@solidaritynetwork.com" className="text-sm text-cyan-600 hover:text-cyan-700 font-medium">
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar - Progress Steps */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Application Progress</h3>
              
              <div className="space-y-1">
                {stepLabels.map((label, index) => {
                  const stepNum = index + 1;
                  const isCompleted = stepNum < currentStep;
                  const isCurrent = stepNum === currentStep;
                  const isFuture = stepNum > currentStep;
                  
                  return (
                    <div
                      key={stepNum}
                      className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-colors ${
                        isCurrent ? 'bg-cyan-50' : ''
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${
                          isCompleted
                            ? 'bg-emerald-500 text-white'
                            : isCurrent
                            ? 'bg-cyan-600 text-white'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {isCompleted ? <CheckIcon /> : stepNum}
                      </div>
                      <span
                        className={`text-sm ${
                          isCompleted
                            ? 'text-slate-600'
                            : isCurrent
                            ? 'text-cyan-700 font-medium'
                            : 'text-slate-400'
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
              
              {/* Progress bar */}
              <div className="mt-6 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span>Progress</span>
                  <span>{Math.round(progressPercent)}%</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
              
              {/* Save for later */}
              <div className="mt-6 pt-4 border-t border-slate-200">
                <p className="text-xs text-slate-500 mb-2">Your progress is saved automatically</p>
                <Link
                  href="/apply"
                  className="text-xs text-cyan-600 hover:text-cyan-700 font-medium"
                >
                  ← Save & Exit
                </Link>
              </div>
            </div>
          </aside>
          
          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Mobile Progress */}
            <div className="lg:hidden mb-6">
              <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
                <span>Step {currentStep} of {totalSteps}: {stepLabels[currentStep - 1]}</span>
                <span>{Math.round(progressPercent)}%</span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            
            {/* Step Content */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              {children}
            </div>
            
            {/* Navigation Buttons */}
            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  currentStep === 1
                    ? 'text-slate-300 cursor-not-allowed'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              
              {currentStep < totalSteps ? (
                <button
                  onClick={nextStep}
                  disabled={!canProceed}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                    canProceed
                      ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white hover:from-cyan-700 hover:to-teal-700 shadow-lg shadow-cyan-500/25'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Continue
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <button
                  type="submit"
                  form="submit-form"
                  disabled={!canProceed || isSubmitting}
                  className={`flex items-center gap-2 px-8 py-3 rounded-lg font-medium transition-all ${
                    canProceed && !isSubmitting
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/25'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </>
                  )}
                </button>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
