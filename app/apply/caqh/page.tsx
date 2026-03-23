'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCAQH } from './CAQHContext';

export default function CAQHStep1() {
  const { caqhProviderId, setCaqhProviderId, setCanProceed, setCurrentStep, error, setError } = useCAQH();
  const [npiLookup, setNpiLookup] = useState('');
  const [lookingUp, setLookingUp] = useState(false);
  
  useEffect(() => {
    setCurrentStep(1);
  }, [setCurrentStep]);
  
  // Enable proceed when CAQH ID is valid format (8-10 digits)
  useEffect(() => {
    const isValid = /^\d{8,10}$/.test(caqhProviderId);
    setCanProceed(isValid);
  }, [caqhProviderId, setCanProceed]);
  
  const handleNpiLookup = async () => {
    if (npiLookup.length !== 10) {
      setError('NPI must be 10 digits');
      return;
    }
    
    setLookingUp(true);
    setError(null);
    
    try {
      // In production, this would call CAQH API to look up by NPI
      // For demo, simulate a delay and show a message
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate finding a CAQH ID
      // In real implementation, would return actual CAQH ID from API
      setError('CAQH lookup by NPI requires CAQH DirectAssure API access. Please enter your CAQH Provider ID directly.');
    } catch {
      setError('Unable to look up CAQH ID. Please enter it manually.');
    } finally {
      setLookingUp(false);
    }
  };
  
  return (
    <div className="p-6 sm:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Enter Your CAQH Provider ID</h1>
        <p className="mt-2 text-slate-600">
          Your CAQH ProView account contains all your credentialing information. 
          We'll pull your data directly from CAQH to save you time.
        </p>
      </div>
      
      <div className="space-y-6">
        {/* CAQH ID Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            CAQH Provider ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g., 12345678"
            value={caqhProviderId}
            onChange={(e) => {
              setCaqhProviderId(e.target.value.replace(/\D/g, '').slice(0, 10));
              setError(null);
            }}
            maxLength={10}
            className={`w-full px-4 py-3 text-lg border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-colors ${
              error ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-white'
            }`}
          />
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
        
        {/* Where to find it */}
        <div className="p-4 bg-cyan-50 border border-cyan-100 rounded-xl">
          <h3 className="font-medium text-cyan-900 mb-2 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Where to find your CAQH ID
          </h3>
          <ul className="text-sm text-cyan-800 space-y-1 ml-7">
            <li>Log into <a href="https://proview.caqh.org" target="_blank" rel="noopener noreferrer" className="underline font-medium">proview.caqh.org</a></li>
            <li>Your ID is displayed on your dashboard</li>
            <li>It's also in your original CAQH welcome email</li>
          </ul>
        </div>
        
        {/* NPI Lookup */}
        <div className="pt-4 border-t border-slate-200">
          <p className="text-sm text-slate-600 mb-3">Don't know your CAQH ID? Try looking it up by NPI:</p>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter your NPI"
              value={npiLookup}
              onChange={(e) => setNpiLookup(e.target.value.replace(/\D/g, '').slice(0, 10))}
              maxLength={10}
              className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
            />
            <button
              onClick={handleNpiLookup}
              disabled={npiLookup.length !== 10 || lookingUp}
              className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${
                npiLookup.length === 10 && !lookingUp
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              {lookingUp ? (
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : 'Look Up'}
            </button>
          </div>
        </div>
        
        {/* Don't have CAQH? */}
        <div className="pt-4 border-t border-slate-200">
          <p className="text-sm text-slate-600">
            Don't have a CAQH ProView account?{' '}
            <Link href="/apply/manual" className="text-cyan-600 hover:text-cyan-700 font-medium">
              Use the standard application instead →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
