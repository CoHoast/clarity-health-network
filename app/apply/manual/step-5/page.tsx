'use client';

import React, { useEffect, useRef } from 'react';
import { useWizard } from '../../WizardContext';
import StepNavigation from '../StepNavigation';

const DEA_SCHEDULES = [
  { id: 'II', label: 'Schedule II', desc: 'High abuse potential (oxycodone, fentanyl, Adderall)' },
  { id: 'III', label: 'Schedule III', desc: 'Moderate abuse potential (ketamine, testosterone, Tylenol w/codeine)' },
  { id: 'IV', label: 'Schedule IV', desc: 'Low abuse potential (Xanax, Valium, Ambien)' },
  { id: 'V', label: 'Schedule V', desc: 'Lowest abuse potential (cough syrups with codeine)' },
];

export default function Step5DEA() {
  const { data, updateNestedData, setCanProceed } = useWizard();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const dea = data.dea;
  
  // Validate
  useEffect(() => {
    if (dea.hasDea === false) {
      setCanProceed(true);
    } else if (dea.hasDea === true) {
      const isValid = dea.number && dea.issueDate && dea.expirationDate && dea.schedules.length > 0 && dea.documentName;
      setCanProceed(!!isValid);
    } else {
      setCanProceed(false);
    }
  }, [dea, setCanProceed]);
  
  const handleChange = (field: keyof typeof dea, value: unknown) => {
    updateNestedData('dea', { [field]: value });
  };
  
  const toggleSchedule = (schedule: string) => {
    const current = dea.schedules;
    const updated = current.includes(schedule)
      ? current.filter(s => s !== schedule)
      : [...current, schedule];
    handleChange('schedules', updated);
  };
  
  const handleFileUpload = (file: File) => {
    handleChange('documentName', file.name);
  };
  
  return (
    <StepNavigation step={5}>
      <div className="p-6 sm:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">DEA Registration</h1>
          <p className="mt-2 text-slate-600">
            If you prescribe controlled substances, provide your DEA registration details.
          </p>
        </div>
        
        <div className="space-y-6">
          {/* Do you have DEA? */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Do you have a DEA registration? <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => handleChange('hasDea', true)}
                className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                  dea.hasDea === true
                    ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className={`w-5 h-5 ${dea.hasDea === true ? 'text-cyan-600' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-medium">Yes</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleChange('hasDea', false)}
                className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                  dea.hasDea === false
                    ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className={`w-5 h-5 ${dea.hasDea === false ? 'text-cyan-600' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="font-medium">No (N/A for my specialty)</span>
                </div>
              </button>
            </div>
          </div>
          
          {dea.hasDea === true && (
            <>
              {/* DEA Number */}
              <div className="p-6 border border-slate-200 rounded-xl bg-slate-50/50">
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        DEA Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., AM1234567"
                        value={dea.number}
                        onChange={(e) => handleChange('number', e.target.value.toUpperCase())}
                        maxLength={9}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 bg-white"
                      />
                      <p className="mt-1 text-xs text-slate-500">Format: 2 letters + 7 digits</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Issue Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={dea.issueDate}
                        onChange={(e) => handleChange('issueDate', e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 bg-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Expiration Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={dea.expirationDate}
                        onChange={(e) => handleChange('expirationDate', e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 bg-white"
                      />
                    </div>
                  </div>
                  
                  {/* Schedules */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      Authorized Schedules <span className="text-red-500">*</span>
                    </label>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {DEA_SCHEDULES.map((schedule) => (
                        <button
                          key={schedule.id}
                          type="button"
                          onClick={() => toggleSchedule(schedule.id)}
                          className={`text-left p-4 rounded-lg border-2 transition-colors ${
                            dea.schedules.includes(schedule.id)
                              ? 'border-cyan-500 bg-cyan-50'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                              dea.schedules.includes(schedule.id)
                                ? 'border-cyan-500 bg-cyan-500'
                                : 'border-slate-300'
                            }`}>
                              {dea.schedules.includes(schedule.id) && (
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <div>
                              <span className={`font-medium ${dea.schedules.includes(schedule.id) ? 'text-cyan-700' : 'text-slate-900'}`}>
                                {schedule.label}
                              </span>
                              <p className="text-xs text-slate-500 mt-0.5">{schedule.desc}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Document Upload */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Upload DEA Certificate <span className="text-red-500">*</span>
                    </label>
                    
                    {dea.documentName ? (
                      <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="flex-1 text-sm text-emerald-700">{dea.documentName}</span>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-sm text-emerald-700 hover:text-emerald-800 font-medium"
                        >
                          Replace
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-cyan-400 hover:bg-cyan-50/50 transition-colors"
                      >
                        <div className="flex flex-col items-center text-slate-500">
                          <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <span className="text-sm font-medium">Click to upload DEA certificate</span>
                          <span className="text-xs mt-1">PDF, JPG, or PNG (max 10MB)</span>
                        </div>
                      </button>
                    )}
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
          
          {dea.hasDea === false && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-amber-800">
                  <p className="font-medium">No DEA Registration Required</p>
                  <p className="mt-1">
                    Some specialties don't require DEA registration (e.g., pathology, radiology). 
                    If your specialty doesn't prescribe controlled substances, you can proceed without a DEA number.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </StepNavigation>
  );
}
