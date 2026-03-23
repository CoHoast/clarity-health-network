'use client';

import React, { useEffect } from 'react';
import { useCAQH } from '../CAQHContext';

export default function CAQHStep2Authorize() {
  const { caqhProviderId, isAuthorized, setIsAuthorized, setCanProceed, setCurrentStep } = useCAQH();
  
  useEffect(() => {
    setCurrentStep(2);
  }, [setCurrentStep]);
  
  useEffect(() => {
    setCanProceed(isAuthorized);
  }, [isAuthorized, setCanProceed]);
  
  return (
    <div className="p-6 sm:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Authorize Solidarity Health Network</h1>
        <p className="mt-2 text-slate-600">
          To pull your credentials from CAQH, you need to authorize Solidarity Health Network 
          as an organization that can access your ProView data.
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Steps to authorize */}
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="font-medium text-slate-900">Log into CAQH ProView</h3>
              <p className="text-sm text-slate-600 mt-1">
                Go to <a href="https://proview.caqh.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">proview.caqh.org</a> and sign in with your credentials.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="font-medium text-slate-900">Go to "Manage Organizations"</h3>
              <p className="text-sm text-slate-600 mt-1">
                Navigate to the "Authorization" or "Manage Organizations" section in your account settings.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="font-medium text-slate-900">Search for "Solidarity Health Network"</h3>
              <p className="text-sm text-slate-600 mt-1">
                Use the search function to find our organization and click "Authorize" or "Add Organization."
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
              4
            </div>
            <div>
              <h3 className="font-medium text-slate-900">Complete Authorization</h3>
              <p className="text-sm text-slate-600 mt-1">
                Follow the prompts to complete the authorization. This allows us to pull your credentials.
              </p>
            </div>
          </div>
        </div>
        
        {/* Open CAQH Button */}
        <div className="flex justify-center pt-4">
          <a
            href="https://proview.caqh.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
          >
            Open CAQH ProView
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
        
        {/* Confirmation Checkbox */}
        <div className="pt-6 border-t border-slate-200">
          <label className="flex items-start gap-4 cursor-pointer group">
            <div className="relative flex-shrink-0 mt-0.5">
              <input
                type="checkbox"
                checked={isAuthorized}
                onChange={(e) => setIsAuthorized(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                isAuthorized 
                  ? 'bg-blue-600 border-cyan-600' 
                  : 'border-slate-300 group-hover:border-blue-400'
              }`}>
                {isAuthorized && (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
            <div>
              <span className="font-medium text-slate-900">
                I have authorized Solidarity Health Network in my CAQH ProView account
              </span>
              <p className="text-sm text-slate-500 mt-1">
                By checking this box, you confirm that you have completed the authorization steps above.
              </p>
            </div>
          </label>
        </div>
        
        {/* CAQH ID Reminder */}
        <div className="p-4 bg-slate-100 rounded-lg">
          <p className="text-sm text-slate-600">
            <span className="font-medium">Your CAQH Provider ID:</span>{' '}
            <span className="font-mono">{caqhProviderId}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
