'use client';

import React, { useEffect } from 'react';
import { useWizard } from '../../WizardContext';
import StepNavigation from '../StepNavigation';
import { v4 as uuid } from 'uuid';

interface WorkEntry {
  id: string;
  employer: string;
  address: string;
  position: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  contactName: string;
  contactPhone: string;
}

export default function Step8WorkHistory() {
  const { data, updateData, setCanProceed } = useWizard();
  
  const workHistory = data.workHistory;
  const gapExplanation = data.gapExplanation;
  
  // Add empty work entry on mount if none exist
  useEffect(() => {
    if (workHistory.length === 0) {
      addWorkEntry();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Validate: at least one complete work entry
  useEffect(() => {
    const hasValidEntry = workHistory.some(entry =>
      entry.employer && entry.position && entry.startDate && (entry.isCurrent || entry.endDate)
    );
    setCanProceed(hasValidEntry);
  }, [workHistory, setCanProceed]);
  
  const addWorkEntry = () => {
    const newEntry: WorkEntry = {
      id: uuid(),
      employer: '',
      address: '',
      position: '',
      startDate: '',
      endDate: '',
      isCurrent: workHistory.length === 0, // First entry defaults to current
      contactName: '',
      contactPhone: '',
    };
    updateData({ workHistory: [...workHistory, newEntry] });
  };
  
  const updateWorkEntry = (id: string, field: keyof WorkEntry, value: string | boolean) => {
    const updated = workHistory.map(entry => {
      if (entry.id === id) {
        // If setting isCurrent to true, clear endDate
        if (field === 'isCurrent' && value === true) {
          return { ...entry, isCurrent: true, endDate: '' };
        }
        return { ...entry, [field]: value };
      }
      return entry;
    });
    updateData({ workHistory: updated });
  };
  
  const removeWorkEntry = (id: string) => {
    if (workHistory.length > 1) {
      updateData({ workHistory: workHistory.filter(entry => entry.id !== id) });
    }
  };
  
  // Format phone number
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };
  
  return (
    <StepNavigation step={8}>
      <div className="p-6 sm:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Work History</h1>
          <p className="mt-2 text-slate-600">
            Please list all employment for the past 5 years with no gaps. Start with your current position.
          </p>
        </div>
        
        <div className="space-y-6">
          {workHistory.map((entry, index) => (
            <div
              key={entry.id}
              className="p-6 border border-slate-200 rounded-xl bg-slate-50/50"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-slate-900">
                    {entry.isCurrent ? 'Current Position' : `Position ${index + 1}`}
                  </h3>
                  {entry.isCurrent && (
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                      Current
                    </span>
                  )}
                </div>
                {workHistory.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeWorkEntry(entry.id)}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Employer Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Cleveland Heart Center"
                    value={entry.employer}
                    onChange={(e) => updateWorkEntry(entry.id, 'employer', e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 bg-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 4500 Euclid Ave, Cleveland, OH 44103"
                    value={entry.address}
                    onChange={(e) => updateWorkEntry(entry.id, 'address', e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 bg-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Position/Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Attending Cardiologist"
                    value={entry.position}
                    onChange={(e) => updateWorkEntry(entry.id, 'position', e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 bg-white"
                  />
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={entry.startDate}
                      onChange={(e) => updateWorkEntry(entry.id, 'startDate', e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 bg-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      End Date {!entry.isCurrent && <span className="text-red-500">*</span>}
                    </label>
                    <div className="space-y-2">
                      <input
                        type="date"
                        value={entry.endDate}
                        onChange={(e) => updateWorkEntry(entry.id, 'endDate', e.target.value)}
                        disabled={entry.isCurrent}
                        className={`w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 ${
                          entry.isCurrent ? 'bg-slate-100 cursor-not-allowed' : 'bg-white'
                        }`}
                      />
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={entry.isCurrent}
                          onChange={(e) => updateWorkEntry(entry.id, 'isCurrent', e.target.checked)}
                          className="w-4 h-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                        />
                        <span className="text-sm text-slate-600">Current position</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Contact Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Dr. John Smith"
                      value={entry.contactName}
                      onChange={(e) => updateWorkEntry(entry.id, 'contactName', e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 bg-white"
                    />
                    <p className="mt-1 text-xs text-slate-500">Supervisor or HR contact for verification</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g., 216-555-1000"
                      value={entry.contactPhone}
                      onChange={(e) => updateWorkEntry(entry.id, 'contactPhone', formatPhone(e.target.value))}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addWorkEntry}
            className="w-full p-4 border-2 border-dashed border-slate-300 rounded-xl hover:border-cyan-400 hover:bg-cyan-50/50 transition-colors"
          >
            <div className="flex items-center justify-center gap-2 text-slate-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="font-medium">Add Previous Employment</span>
            </div>
          </button>
          
          {/* Gap Explanation */}
          <div className="pt-6 border-t border-slate-200">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Gap Explanation
              </label>
              <p className="text-sm text-slate-500 mb-2">
                If there are any gaps greater than 30 days in your employment history, please explain.
              </p>
              <textarea
                rows={3}
                placeholder="e.g., Took 3-month sabbatical for personal health (June-August 2023)"
                value={gapExplanation}
                onChange={(e) => updateData({ gapExplanation: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 bg-white resize-none"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-medium">Employment Verification</p>
              <p className="mt-1">
                We may contact your previous employers to verify your work history. 
                Please ensure contact information is accurate and up-to-date.
              </p>
            </div>
          </div>
        </div>
      </div>
    </StepNavigation>
  );
}
