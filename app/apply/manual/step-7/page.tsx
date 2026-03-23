'use client';

import React, { useEffect } from 'react';
import { useWizard } from '../../WizardContext';
import StepNavigation from '../StepNavigation';
import { v4 as uuid } from 'uuid';

// Medical degrees
const DEGREES = ['MD', 'DO', 'MBBS', 'MBChB', 'PhD', 'DNP', 'DPT', 'DPM', 'DMD', 'DDS', 'OD', 'DC', 'PharmD', 'Other'];

interface TrainingProgram {
  id: string;
  institution: string;
  specialty: string;
  completionDate: string;
}

export default function Step7Education() {
  const { data, updateNestedData, updateData, setCanProceed } = useWizard();
  
  const education = data.education;
  
  // Validate required fields
  useEffect(() => {
    const isValid = education.medicalSchool && education.degree && education.graduationDate;
    setCanProceed(!!isValid);
  }, [education, setCanProceed]);
  
  const handleChange = (field: keyof typeof education, value: string) => {
    updateNestedData('education', { [field]: value });
  };
  
  // Residency helpers
  const addResidency = () => {
    const newResidency: TrainingProgram = {
      id: uuid(),
      institution: '',
      specialty: '',
      completionDate: '',
    };
    updateData({
      education: {
        ...education,
        residencies: [...education.residencies, newResidency],
      },
    });
  };
  
  const updateResidency = (id: string, field: keyof TrainingProgram, value: string) => {
    const updated = education.residencies.map(r =>
      r.id === id ? { ...r, [field]: value } : r
    );
    updateData({
      education: { ...education, residencies: updated },
    });
  };
  
  const removeResidency = (id: string) => {
    updateData({
      education: {
        ...education,
        residencies: education.residencies.filter(r => r.id !== id),
      },
    });
  };
  
  // Fellowship helpers
  const addFellowship = () => {
    const newFellowship: TrainingProgram = {
      id: uuid(),
      institution: '',
      specialty: '',
      completionDate: '',
    };
    updateData({
      education: {
        ...education,
        fellowships: [...education.fellowships, newFellowship],
      },
    });
  };
  
  const updateFellowship = (id: string, field: keyof TrainingProgram, value: string) => {
    const updated = education.fellowships.map(f =>
      f.id === id ? { ...f, [field]: value } : f
    );
    updateData({
      education: { ...education, fellowships: updated },
    });
  };
  
  const removeFellowship = (id: string) => {
    updateData({
      education: {
        ...education,
        fellowships: education.fellowships.filter(f => f.id !== id),
      },
    });
  };
  
  return (
    <StepNavigation step={7}>
      <div className="p-6 sm:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Education & Training</h1>
          <p className="mt-2 text-slate-600">
            Provide information about your medical education and training programs.
          </p>
        </div>
        
        <div className="space-y-8">
          {/* Medical School */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Medical/Professional School</h3>
            
            <div className="p-6 border border-slate-200 rounded-xl bg-slate-50/50 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  School Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Case Western Reserve University School of Medicine"
                  value={education.medicalSchool}
                  onChange={(e) => handleChange('medicalSchool', e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                />
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Degree <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={education.degree}
                    onChange={(e) => handleChange('degree', e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  >
                    <option value="">Select degree</option>
                    {DEGREES.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Graduation Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={education.graduationDate}
                    onChange={(e) => handleChange('graduationDate', e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Residency */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Residency</h3>
              {education.residencies.length === 0 && (
                <span className="text-sm text-slate-500">Optional</span>
              )}
            </div>
            
            <div className="space-y-4">
              {education.residencies.map((residency, index) => (
                <div
                  key={residency.id}
                  className="p-6 border border-slate-200 rounded-xl bg-slate-50/50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-slate-900">Residency {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeResidency(residency.id)}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Institution
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Cleveland Clinic Foundation"
                        value={residency.institution}
                        onChange={(e) => updateResidency(residency.id, 'institution', e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                      />
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Specialty
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., Internal Medicine"
                          value={residency.specialty}
                          onChange={(e) => updateResidency(residency.id, 'specialty', e.target.value)}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Completion Date
                        </label>
                        <input
                          type="date"
                          value={residency.completionDate}
                          onChange={(e) => updateResidency(residency.id, 'completionDate', e.target.value)}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addResidency}
                className="w-full p-4 border-2 border-dashed border-slate-300 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
              >
                <div className="flex items-center justify-center gap-2 text-slate-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="font-medium">Add Residency</span>
                </div>
              </button>
            </div>
          </div>
          
          {/* Fellowship */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Fellowship</h3>
              {education.fellowships.length === 0 && (
                <span className="text-sm text-slate-500">Optional</span>
              )}
            </div>
            
            <div className="space-y-4">
              {education.fellowships.map((fellowship, index) => (
                <div
                  key={fellowship.id}
                  className="p-6 border border-slate-200 rounded-xl bg-slate-50/50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-slate-900">Fellowship {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeFellowship(fellowship.id)}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Institution
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Cleveland Clinic Foundation"
                        value={fellowship.institution}
                        onChange={(e) => updateFellowship(fellowship.id, 'institution', e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                      />
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Specialty
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., Cardiovascular Disease"
                          value={fellowship.specialty}
                          onChange={(e) => updateFellowship(fellowship.id, 'specialty', e.target.value)}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Completion Date
                        </label>
                        <input
                          type="date"
                          value={fellowship.completionDate}
                          onChange={(e) => updateFellowship(fellowship.id, 'completionDate', e.target.value)}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addFellowship}
                className="w-full p-4 border-2 border-dashed border-slate-300 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
              >
                <div className="flex items-center justify-center gap-2 text-slate-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="font-medium">Add Fellowship</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </StepNavigation>
  );
}
