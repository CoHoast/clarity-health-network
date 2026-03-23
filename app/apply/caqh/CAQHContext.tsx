'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// CAQH Profile data structure (what we get from CAQH API)
export interface CAQHProfile {
  caqhProviderId: string;
  demographics: {
    firstName: string;
    middleName?: string;
    lastName: string;
    suffix?: string;
    credentials: string;
    dateOfBirth: string;
    gender: string;
    npi: string;
    email: string;
    phone: string;
  };
  licenses: Array<{
    state: string;
    licenseNumber: string;
    licenseType: string;
    issueDate: string;
    expirationDate: string;
    status: string;
  }>;
  dea: {
    number: string;
    issueDate: string;
    expirationDate: string;
    schedules: string[];
  } | null;
  boardCertifications: Array<{
    boardName: string;
    specialty: string;
    certificationDate: string;
    expirationDate: string;
    status: string;
  }>;
  malpracticeInsurance: {
    carrier: string;
    policyNumber: string;
    coveragePerOccurrence: number;
    coverageAggregate: number;
    effectiveDate: string;
    expirationDate: string;
  };
  education: {
    medicalSchool: string;
    degree: string;
    graduationDate: string;
  };
  practiceLocations: Array<{
    practiceName: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
  }>;
}

interface CAQHContextType {
  currentStep: number;
  totalSteps: number;
  caqhProviderId: string;
  setCaqhProviderId: (id: string) => void;
  isAuthorized: boolean;
  setIsAuthorized: (authorized: boolean) => void;
  profile: CAQHProfile | null;
  setProfile: (profile: CAQHProfile | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  canProceed: boolean;
  setCanProceed: (can: boolean) => void;
  w9DocumentName: string;
  setW9DocumentName: (name: string) => void;
  attestation: {
    informationAccurate: boolean;
    understandFalseInfo: boolean;
    notifyChanges: boolean;
    agreeToTerms: boolean;
    signature: string;
  };
  setAttestation: (attestation: CAQHContextType['attestation']) => void;
  isSubmitting: boolean;
  setIsSubmitting: (submitting: boolean) => void;
}

const CAQHContext = createContext<CAQHContextType | null>(null);

export function CAQHProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [caqhProviderId, setCaqhProviderId] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [profile, setProfile] = useState<CAQHProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canProceed, setCanProceed] = useState(false);
  const [w9DocumentName, setW9DocumentName] = useState('');
  const [attestation, setAttestation] = useState({
    informationAccurate: false,
    understandFalseInfo: false,
    notifyChanges: false,
    agreeToTerms: false,
    signature: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const totalSteps = 5;
  
  const nextStep = useCallback(() => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      setCanProceed(false);
      setError(null);
    }
  }, [currentStep, totalSteps]);
  
  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setError(null);
    }
  }, [currentStep]);
  
  return (
    <CAQHContext.Provider
      value={{
        currentStep,
        totalSteps,
        caqhProviderId,
        setCaqhProviderId,
        isAuthorized,
        setIsAuthorized,
        profile,
        setProfile,
        isLoading,
        setIsLoading,
        error,
        setError,
        setCurrentStep,
        nextStep,
        prevStep,
        canProceed,
        setCanProceed,
        w9DocumentName,
        setW9DocumentName,
        attestation,
        setAttestation,
        isSubmitting,
        setIsSubmitting,
      }}
    >
      {children}
    </CAQHContext.Provider>
  );
}

export function useCAQH() {
  const context = useContext(CAQHContext);
  if (!context) {
    throw new Error('useCAQH must be used within a CAQHProvider');
  }
  return context;
}
