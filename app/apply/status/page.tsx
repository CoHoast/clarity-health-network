'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function StatusLookupPage() {
  const router = useRouter();
  const [applicationId, setApplicationId] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!applicationId.trim()) {
      setError('Please enter an application ID');
      return;
    }
    
    // Navigate to status page
    router.push(`/apply/status/${applicationId.trim()}`);
  };
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-teal-600 rounded-xl flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <span className="text-lg font-bold text-slate-900">Solidarity</span>
                <span className="text-lg font-light text-slate-600 ml-1">Health Network</span>
              </div>
            </div>
            <Link href="/apply" className="text-sm text-cyan-600 hover:text-cyan-700 font-medium">
              ← Back to Portal
            </Link>
          </div>
        </div>
      </header>
      
      <main className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-2xl flex items-center justify-center text-cyan-600 mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Check Application Status</h1>
            <p className="mt-2 text-slate-600">
              Enter your application ID to view your credentialing status.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Application ID
              </label>
              <input
                type="text"
                placeholder="e.g., CRED-2026-1234"
                value={applicationId}
                onChange={(e) => {
                  setApplicationId(e.target.value);
                  setError('');
                }}
                className={`w-full px-4 py-3 border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 font-mono ${
                  error ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-white'
                }`}
              />
              {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
              <p className="mt-2 text-xs text-slate-500">
                Your application ID was provided in your confirmation email.
              </p>
            </div>
            
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-semibold rounded-lg hover:from-cyan-700 hover:to-teal-700 transition-all shadow-lg shadow-cyan-500/25"
            >
              Check Status
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-slate-200 text-center">
            <p className="text-sm text-slate-600">
              Don't have an application ID?
            </p>
            <Link 
              href="/apply" 
              className="inline-flex items-center gap-1 mt-2 text-sm font-medium text-cyan-600 hover:text-cyan-700"
            >
              Start a new application
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
        
        {/* Contact */}
        <div className="mt-8 text-center text-sm text-slate-600">
          Need help?{' '}
          <a href="mailto:credentialing@solidaritynetwork.com" className="text-cyan-600 hover:text-cyan-700 font-medium">
            credentialing@solidaritynetwork.com
          </a>
        </div>
      </main>
    </div>
  );
}
