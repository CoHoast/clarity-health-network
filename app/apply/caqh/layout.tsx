'use client';

import React from 'react';
import Link from 'next/link';
import { CAQHProvider, useCAQH } from './CAQHContext';
import { ToastProvider } from '../Toast';

// Step labels
const stepLabels = [
  'Enter CAQH ID',
  'Authorize',
  'Pull Data',
  'Review',
  'Submit',
];

// Icons
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

const LightningIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

function CAQHLayoutInner({ children }: { children: React.ReactNode }) {
  const { currentStep, totalSteps, prevStep, nextStep, canProceed, isSubmitting } = useCAQH();
  
  const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Bar */}
      <div className="bg-slate-900 text-white py-2">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <span>(216) 763-2484</span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="hidden sm:inline">Cleveland, OH</span>
          </div>
          <span className="text-blue-300">Trusted Partner Since 1989</span>
        </div>
      </div>
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <a href="/apply" className="flex items-center">
                <img src="/solidarity-logo.png" alt="Solidarity Health Network" className="h-10 w-auto" />
              </a>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full flex items-center gap-1">
                <LightningIcon />
                Fast Track
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-500 hidden sm:inline">Need help?</span>
              <a href="mailto:credentialing@shninc.org" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </header>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar - Progress Steps */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <LightningIcon />
                <h3 className="text-sm font-semibold text-slate-900">CAQH Fast Track</h3>
              </div>
              
              <div className="space-y-1">
                {stepLabels.map((label, index) => {
                  const stepNum = index + 1;
                  const isCompleted = stepNum < currentStep;
                  const isCurrent = stepNum === currentStep;
                  
                  return (
                    <div
                      key={stepNum}
                      className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-colors ${
                        isCurrent ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${
                          isCompleted
                            ? 'bg-emerald-500 text-white'
                            : isCurrent
                            ? 'bg-blue-600 text-white'
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
                            ? 'text-blue-700 font-medium'
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
              <div className="mt-5 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span>Progress</span>
                  <span>{Math.round(progressPercent)}%</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
              
              <div className="mt-5 pt-4 border-t border-slate-200">
                <Link
                  href="/apply"
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  ← Back to Options
                </Link>
              </div>
            </div>
          </aside>
          
          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Mobile Progress */}
            <div className="lg:hidden mb-6">
              <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
                <span className="flex items-center gap-2">
                  <LightningIcon />
                  Step {currentStep} of {totalSteps}: {stepLabels[currentStep - 1]}
                </span>
                <span>{Math.round(progressPercent)}%</span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
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
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:from-cyan-700 hover:to-teal-700 shadow-lg shadow-blue-500/25'
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
                  form="caqh-submit-form"
                  disabled={!canProceed || isSubmitting}
                  className={`flex items-center gap-2 px-8 py-3 rounded-lg font-medium transition-all ${
                    canProceed && !isSubmitting
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/25'
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

export default function CAQHLayout({ children }: { children: React.ReactNode }) {
  return (
    <CAQHProvider>
      <ToastProvider>
        <CAQHLayoutInner>{children}</CAQHLayoutInner>
      </ToastProvider>
    </CAQHProvider>
  );
}
