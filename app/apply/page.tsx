'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Storage key - must match WizardContext
const STORAGE_KEY = 'solidarity_provider_application_draft';
const STORAGE_STEP_KEY = 'solidarity_provider_application_step';

// Icons
const BuildingIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const CurrencyIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const HeadphonesIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

const LightningIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

export default function ApplyLandingPage() {
  const [hasDraft, setHasDraft] = useState(false);
  const [draftStep, setDraftStep] = useState(1);
  const [draftDate, setDraftDate] = useState<string | null>(null);
  
  // Check for existing draft on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      const savedStep = localStorage.getItem(STORAGE_STEP_KEY);
      
      if (savedData) {
        const parsed = JSON.parse(savedData);
        // Verify it's a valid draft
        if (parsed.providerType || parsed.practice?.legalName || parsed.demographics?.firstName) {
          setHasDraft(true);
          if (parsed._savedAt) {
            setDraftDate(new Date(parsed._savedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            }));
          }
        }
      }
      
      if (savedStep) {
        const step = parseInt(savedStep, 10);
        if (step >= 1 && step <= 10) {
          setDraftStep(step);
        }
      }
    } catch (e) {
      console.error('Error checking for draft:', e);
    }
  }, []);
  
  const clearDraft = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_STEP_KEY);
    setHasDraft(false);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-teal-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/50 sticky top-0 z-50">
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
            <div className="hidden sm:flex items-center gap-4">
              <Link href="/find-provider" className="text-sm text-slate-600 hover:text-slate-900">
                Find a Provider
              </Link>
              <a href="https://solidaritynetwork.com" className="text-sm text-slate-600 hover:text-slate-900">
                About Us
              </a>
              <Link 
                href="/apply/status" 
                className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
              >
                Check Application Status
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      {/* Resume Draft Banner */}
      {hasDraft && (
        <section className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-amber-900">You have an unfinished application</p>
                  <p className="text-sm text-amber-700">
                    Step {draftStep} of 10 {draftDate && `• Last saved ${draftDate}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={clearDraft}
                  className="text-sm text-amber-700 hover:text-amber-900 font-medium"
                >
                  Start Over
                </button>
                <Link
                  href="/apply/manual"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors shadow-sm"
                >
                  Continue Application
                  <ArrowRightIcon />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium mb-6">
              <LightningIcon />
              Now accepting applications
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight">
              Join the{' '}
              <span className="bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                Solidarity
              </span>{' '}
              Health Network
            </h1>
            
            <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
              Connect with over 40,000 members and grow your practice with competitive rates, 
              fast payments, and dedicated support.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/apply/manual"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-semibold rounded-xl hover:from-cyan-700 hover:to-teal-700 transition-all shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30"
              >
                Start Application
                <ArrowRightIcon />
              </Link>
              
              <Link
                href="/apply/caqh"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-700 font-semibold rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm"
              >
                <LightningIcon />
                Fast Track with CAQH
              </Link>
            </div>
            
            <p className="mt-4 text-sm text-slate-500">
              Already have a CAQH ProView account? Use Fast Track to apply in ~5 minutes.
            </p>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-200/40 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-200/40 rounded-full blur-3xl" />
        </div>
      </section>
      
      {/* Benefits Grid */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Why Join Our Network?</h2>
            <p className="mt-4 text-lg text-slate-600">Benefits that make a difference for your practice</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-2xl flex items-center justify-center text-cyan-600 mx-auto mb-4">
                <ClockIcon />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">14-Day Payments</h3>
              <p className="text-slate-600">Receive your claim payments within 14 business days—faster than industry standard.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-2xl flex items-center justify-center text-cyan-600 mx-auto mb-4">
                <UsersIcon />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">40,000+ Members</h3>
              <p className="text-slate-600">Access to a growing member base across Ohio and surrounding states.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-2xl flex items-center justify-center text-cyan-600 mx-auto mb-4">
                <CurrencyIcon />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Competitive Rates</h3>
              <p className="text-slate-600">Fair reimbursement rates negotiated to benefit both providers and members.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-2xl flex items-center justify-center text-cyan-600 mx-auto mb-4">
                <HeadphonesIcon />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Dedicated Support</h3>
              <p className="text-slate-600">Personal support team to help with questions, claims, and credentialing.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">How It Works</h2>
            <p className="mt-4 text-lg text-slate-600">Simple steps to join our network</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { step: 1, title: 'Apply Online', desc: 'Complete our simple application in 30-45 minutes, or 5 minutes with CAQH.' },
              { step: 2, title: 'Verification', desc: 'We verify your credentials with primary sources (2-3 business days).' },
              { step: 3, title: 'Committee Review', desc: 'Our credentialing committee reviews your application weekly.' },
              { step: 4, title: 'Welcome!', desc: 'Sign your contract and start seeing Solidarity members.' },
            ].map((item, index) => (
              <div key={item.step} className="relative">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600">{item.desc}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-0.5 bg-slate-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* What You'll Need */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900">What You'll Need</h2>
              <p className="mt-4 text-lg text-slate-600">Have these ready before you start</p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                'NPI number (Type 1 and/or Type 2)',
                'State medical license(s)',
                'DEA registration (if applicable)',
                'Board certification documents',
                'Medical school & training info',
                'Work history (past 5 years)',
                'Malpractice insurance certificate',
                '3 professional references',
                'W-9 form',
                'CV/Resume',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                  <CheckCircleIcon />
                  <span className="text-slate-700">{item}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-6 bg-cyan-50 border border-cyan-100 rounded-xl">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <LightningIcon />
                </div>
                <div>
                  <h4 className="font-semibold text-cyan-900">Have a CAQH ProView account?</h4>
                  <p className="mt-1 text-cyan-700 text-sm">
                    Most of your information is already in CAQH. Use our Fast Track option to pull your 
                    credentials automatically and complete your application in about 5 minutes.
                  </p>
                  <Link 
                    href="/apply/caqh" 
                    className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-cyan-700 hover:text-cyan-800"
                  >
                    Start Fast Track Application
                    <ArrowRightIcon />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Ready to Get Started?</h2>
          <p className="mt-4 text-lg text-slate-300">
            Join thousands of providers already serving Solidarity Health members.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/apply/manual"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition-all shadow-lg"
            >
              Start Application
              <ArrowRightIcon />
            </Link>
            <Link
              href="/apply/caqh"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-white font-semibold rounded-xl border border-white/30 hover:bg-white/10 transition-all"
            >
              <LightningIcon />
              Fast Track with CAQH
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-600 to-teal-600 rounded-lg flex items-center justify-center text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="text-sm text-slate-600">© 2026 Solidarity Health Network. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-600">
              <a href="#" className="hover:text-slate-900">Privacy Policy</a>
              <a href="#" className="hover:text-slate-900">Terms of Service</a>
              <a href="mailto:credentialing@solidaritynetwork.com" className="hover:text-slate-900">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
