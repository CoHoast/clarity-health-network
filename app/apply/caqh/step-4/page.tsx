'use client';

import React, { useEffect } from 'react';
import { useCAQH } from '../CAQHContext';

export default function CAQHStep4Review() {
  const { profile, setCanProceed, setCurrentStep } = useCAQH();
  
  useEffect(() => {
    setCurrentStep(4);
  }, [setCurrentStep]);
  
  useEffect(() => {
    // Can proceed if we have a profile
    setCanProceed(!!profile);
  }, [profile, setCanProceed]);
  
  if (!profile) {
    return (
      <div className="p-6 sm:p-8 text-center">
        <p className="text-slate-600">No data available. Please go back and complete the previous steps.</p>
      </div>
    );
  }
  
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  };
  
  return (
    <div className="p-6 sm:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Review Your Information</h1>
        <p className="mt-2 text-slate-600">
          Please verify that this information from CAQH is current and accurate. 
          If anything is outdated, please update it in CAQH ProView first.
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Demographics */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900">Demographics</h3>
            <a href="https://proview.caqh.org" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-700">
              Edit in CAQH →
            </a>
          </div>
          <div className="p-4 grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500">Name</p>
              <p className="font-medium text-slate-900">
                {profile.demographics.firstName} {profile.demographics.middleName} {profile.demographics.lastName}, {profile.demographics.credentials}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">NPI</p>
              <p className="font-mono font-medium text-slate-900">{profile.demographics.npi}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Email</p>
              <p className="font-medium text-slate-900">{profile.demographics.email}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Phone</p>
              <p className="font-medium text-slate-900">{profile.demographics.phone}</p>
            </div>
          </div>
        </div>
        
        {/* Licenses */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900">Licenses ({profile.licenses.length})</h3>
            <a href="https://proview.caqh.org" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-700">
              Edit in CAQH →
            </a>
          </div>
          <div className="p-4 space-y-3">
            {profile.licenses.map((license, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{license.state} Medical License #{license.licenseNumber}</p>
                    <p className="text-xs text-slate-500">Expires: {formatDate(license.expirationDate)}</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                  {license.status}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* DEA */}
        {profile.dea && (
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
              <h3 className="font-semibold text-slate-900">DEA Registration</h3>
              <a href="https://proview.caqh.org" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-700">
                Edit in CAQH →
              </a>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">DEA #{profile.dea.number}</p>
                    <p className="text-xs text-slate-500">
                      Expires: {formatDate(profile.dea.expirationDate)} • Schedules: {profile.dea.schedules.join(', ')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Board Certifications */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900">Board Certifications</h3>
            <a href="https://proview.caqh.org" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-700">
              Edit in CAQH →
            </a>
          </div>
          <div className="p-4 space-y-3">
            {profile.boardCertifications.map((cert, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{cert.boardName}</p>
                    <p className="text-xs text-slate-500">
                      {cert.specialty} • Certified: {formatDate(cert.certificationDate)}
                      {cert.expirationDate && ` • Expires: ${formatDate(cert.expirationDate)}`}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Malpractice Insurance */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900">Malpractice Insurance</h3>
            <a href="https://proview.caqh.org" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-700">
              Edit in CAQH →
            </a>
          </div>
          <div className="p-4">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="font-medium text-slate-900">{profile.malpracticeInsurance.carrier}</p>
              </div>
              <div className="ml-11 text-sm text-slate-600 space-y-1">
                <p>Policy: {profile.malpracticeInsurance.policyNumber}</p>
                <p>Coverage: {formatCurrency(profile.malpracticeInsurance.coveragePerOccurrence)}/{formatCurrency(profile.malpracticeInsurance.coverageAggregate)}</p>
                <p>Expires: {formatDate(profile.malpracticeInsurance.expirationDate)}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Practice Location */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900">Practice Locations ({profile.practiceLocations.length})</h3>
            <a href="https://proview.caqh.org" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-700">
              Edit in CAQH →
            </a>
          </div>
          <div className="p-4 space-y-3">
            {profile.practiceLocations.map((location, index) => (
              <div key={index} className="p-3 bg-slate-50 rounded-lg">
                <p className="font-medium text-slate-900">{location.practiceName}</p>
                <p className="text-sm text-slate-600">
                  {location.address}, {location.city}, {location.state} {location.zip}
                </p>
                <p className="text-sm text-slate-500">{location.phone}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Confirmation */}
        <div className="p-4 bg-blue-50 border border-cyan-200 rounded-xl">
          <p className="text-sm text-cyan-800">
            <strong>Please verify all information is correct.</strong> If you need to make changes, 
            update your CAQH ProView profile and refresh this page. Click "Continue" when ready.
          </p>
        </div>
      </div>
    </div>
  );
}
