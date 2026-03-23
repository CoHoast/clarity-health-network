'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// Icons
const CheckCircleIcon = () => (
  <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ClipboardIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const DocumentIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const CelebrationIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

// Storage keys - must match WizardContext
const STORAGE_KEY = 'solidarity_provider_application_draft';
const STORAGE_STEP_KEY = 'solidarity_provider_application_step';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const applicationId = searchParams.get('id') || 'CRED-2026-XXXX';
  const [copied, setCopied] = useState(false);
  
  // Clear any leftover draft data
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_STEP_KEY);
    }
  }, []);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(applicationId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const submittedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-blue-50/30">
      {/* Top Bar */}
      <div className="bg-slate-900 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <span>(216) 763-2484</span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="hidden sm:inline">Cleveland, OH</span>
          </div>
          <span className="text-blue-300">Trusted Partner Since 1989</span>
        </div>
      </div>
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="/apply" className="flex items-center">
              <img src="/solidarity-logo.png" alt="Solidarity Health Network" className="h-12 w-auto" />
            </a>
          </div>
        </div>
      </header>
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Success Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 px-8 py-12 text-center text-white">
            <div className="inline-flex items-center justify-center mb-4">
              <CheckCircleIcon />
            </div>
            <h1 className="text-3xl font-bold">Application Submitted!</h1>
            <p className="mt-2 text-emerald-100">
              Thank you for applying to join the Solidarity Health Network.
            </p>
          </div>
          
          {/* Application Details */}
          <div className="p-8">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl mb-8">
              <div>
                <p className="text-sm text-slate-500">Application ID</p>
                <p className="text-xl font-mono font-bold text-slate-900">{applicationId}</p>
              </div>
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                {copied ? '✓ Copied' : 'Copy ID'}
              </button>
            </div>
            
            <p className="text-sm text-slate-600 mb-2">
              <strong>Submitted:</strong> {submittedDate}
            </p>
            <p className="text-sm text-slate-600 mb-8">
              A confirmation email has been sent to your registered email address.
            </p>
            
            {/* What Happens Next */}
            <h2 className="text-lg font-semibold text-slate-900 mb-6">What Happens Next?</h2>
            
            <div className="space-y-4">
              {[
                {
                  icon: <ClipboardIcon />,
                  step: 1,
                  title: 'Verification',
                  time: '2-3 business days',
                  desc: 'We verify your credentials with primary sources (state boards, NPPES, OIG, etc.)',
                },
                {
                  icon: <UsersIcon />,
                  step: 2,
                  title: 'Committee Review',
                  time: 'Weekly meetings',
                  desc: 'Our credentialing committee reviews your complete application.',
                },
                {
                  icon: <DocumentIcon />,
                  step: 3,
                  title: 'Contract',
                  time: '1-2 business days',
                  desc: 'If approved, we\'ll send your network participation contract via DocuSign.',
                },
                {
                  icon: <CelebrationIcon />,
                  step: 4,
                  title: 'Welcome!',
                  time: 'Same day',
                  desc: 'Once signed, you\'re officially part of the Solidarity Health Network.',
                },
              ].map((item, index) => (
                <div
                  key={item.step}
                  className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl flex items-center justify-center text-slate-600 flex-shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                        Step {item.step}
                      </span>
                      <span className="text-xs text-slate-500">{item.time}</span>
                    </div>
                    <h3 className="font-semibold text-slate-900">{item.title}</h3>
                    <p className="text-sm text-slate-600 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Actions */}
            <div className="mt-8 pt-8 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link
                  href={`/apply/status/${applicationId}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-semibold rounded-xl hover:from-cyan-700 hover:to-teal-700 transition-all shadow-lg shadow-blue-500/25"
                >
                  Track Application Status
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                
                <Link
                  href="/apply"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-slate-700 font-medium rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Return to Provider Portal
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-600">
            Questions? Contact us at{' '}
            <a href="mailto:credentialing@solidaritynetwork.com" className="text-blue-600 hover:text-blue-700 font-medium">
              credentialing@solidaritynetwork.com
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}
