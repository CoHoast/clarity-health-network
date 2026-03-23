'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Verification item type
interface VerificationItem {
  name: string;
  status: 'passed' | 'pending' | 'in_progress' | 'failed' | 'action_required';
  date?: string;
  note?: string;
}

// Application type
interface Application {
  id: string;
  status: string;
  submittedAt: string;
  demographics: {
    firstName: string;
    lastName: string;
    credentials: string;
  };
  workflow: {
    currentStage: string;
  };
}

const statusColors = {
  passed: 'bg-emerald-500',
  pending: 'bg-slate-300',
  in_progress: 'bg-cyan-500',
  failed: 'bg-red-500',
  action_required: 'bg-amber-500',
};

const statusIcons = {
  passed: (
    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  pending: (
    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  in_progress: (
    <svg className="w-4 h-4 text-white animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  ),
  failed: (
    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  action_required: (
    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
};

// Pipeline stages
const stages = [
  { key: 'submitted', label: 'Submitted' },
  { key: 'verification', label: 'Verification' },
  { key: 'review', label: 'Review' },
  { key: 'committee', label: 'Committee' },
  { key: 'contract', label: 'Contract' },
  { key: 'active', label: 'Active' },
];

export default function ApplicationStatusPage() {
  const params = useParams();
  const applicationId = params.id as string;
  
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Demo verification items
  const verificationItems: VerificationItem[] = [
    { name: 'NPI Validation', status: 'passed', date: 'Mar 23, 2026' },
    { name: 'OIG Exclusion Check', status: 'passed', date: 'Mar 23, 2026' },
    { name: 'SAM.gov Check', status: 'passed', date: 'Mar 23, 2026' },
    { name: 'State License Verification', status: 'in_progress' },
    { name: 'DEA Verification', status: 'pending' },
    { name: 'Board Certification', status: 'pending' },
    { name: 'Malpractice Insurance', status: 'pending' },
  ];
  
  useEffect(() => {
    fetchApplication();
  }, [applicationId]);
  
  const fetchApplication = async () => {
    try {
      const res = await fetch(`/api/apply/status/${applicationId}`);
      const data = await res.json();
      
      if (data.success) {
        setApplication(data.application);
      } else {
        // Use demo data for display
        setApplication({
          id: applicationId,
          status: 'verification',
          submittedAt: new Date().toISOString(),
          demographics: {
            firstName: 'Provider',
            lastName: 'Applicant',
            credentials: 'MD',
          },
          workflow: {
            currentStage: 'verification',
          },
        });
      }
    } catch (err) {
      console.error('Error fetching application:', err);
      // Use demo data
      setApplication({
        id: applicationId,
        status: 'verification',
        submittedAt: new Date().toISOString(),
        demographics: {
          firstName: 'Provider',
          lastName: 'Applicant',
          credentials: 'MD',
        },
        workflow: {
          currentStage: 'verification',
        },
      });
    } finally {
      setLoading(false);
    }
  };
  
  const currentStageIndex = application 
    ? stages.findIndex(s => s.key === application.workflow.currentStage)
    : 1;
  
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Application Header */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Application Status</h1>
              <p className="text-slate-600 mt-1">
                {application?.demographics.firstName} {application?.demographics.lastName}, {application?.demographics.credentials}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500">Application ID</p>
              <p className="text-lg font-mono font-bold text-slate-900">{applicationId}</p>
            </div>
          </div>
        </div>
        
        {/* Progress Pipeline */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
          <h2 className="text-sm font-semibold text-slate-900 mb-6">Application Progress</h2>
          
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-200">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500"
                style={{ width: `${(currentStageIndex / (stages.length - 1)) * 100}%` }}
              />
            </div>
            
            {/* Stage Dots */}
            <div className="relative flex justify-between">
              {stages.map((stage, index) => {
                const isCompleted = index < currentStageIndex;
                const isCurrent = index === currentStageIndex;
                const isFuture = index > currentStageIndex;
                
                return (
                  <div key={stage.key} className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                        isCompleted
                          ? 'bg-emerald-500'
                          : isCurrent
                          ? 'bg-cyan-500 ring-4 ring-cyan-100'
                          : 'bg-slate-200'
                      }`}
                    >
                      {isCompleted ? (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : isCurrent ? (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      ) : (
                        <div className="w-2 h-2 bg-slate-400 rounded-full" />
                      )}
                    </div>
                    <span
                      className={`mt-2 text-xs font-medium ${
                        isCompleted || isCurrent ? 'text-slate-900' : 'text-slate-400'
                      }`}
                    >
                      {stage.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Verification Details */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Verification Progress</h2>
          
          <div className="space-y-3">
            {verificationItems.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${statusColors[item.status]}`}>
                    {statusIcons[item.status]}
                  </div>
                  <span className="text-sm text-slate-900">{item.name}</span>
                </div>
                <div className="text-right">
                  {item.date ? (
                    <span className="text-xs text-emerald-600 font-medium">Passed - {item.date}</span>
                  ) : item.status === 'in_progress' ? (
                    <span className="text-xs text-cyan-600 font-medium">In Progress</span>
                  ) : (
                    <span className="text-xs text-slate-400">Pending</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Action Required (if any) */}
        {/* For demo, show a sample action required */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900">No Action Required</h3>
              <p className="mt-1 text-sm text-amber-800">
                Your application is being processed. We'll notify you if any additional information is needed.
              </p>
            </div>
          </div>
        </div>
        
        {/* Contact */}
        <div className="text-center text-sm text-slate-600">
          Questions? Contact{' '}
          <a href="mailto:credentialing@solidaritynetwork.com" className="text-cyan-600 hover:text-cyan-700 font-medium">
            credentialing@solidaritynetwork.com
          </a>
        </div>
      </main>
    </div>
  );
}
