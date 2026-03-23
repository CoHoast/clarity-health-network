'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

// Storage keys
const STORAGE_KEY = 'solidarity_provider_application_draft';
const STORAGE_STEP_KEY = 'solidarity_provider_application_step';

// Application data structure
export interface ApplicationData {
  // Step 1: Provider Type
  providerType: 'individual' | 'group' | 'facility' | '';
  
  // Step 2: Practice Information
  practice: {
    legalName: string;
    dba: string;
    tin: string;
    npi: string;
    address: string;
    addressLine2: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    fax: string;
    email: string;
    website: string;
  };
  
  // Step 3: Provider Demographics
  demographics: {
    firstName: string;
    middleName: string;
    lastName: string;
    suffix: string;
    credentials: string;
    npi: string;
    dateOfBirth: string;
    gender: string;
    ssn: string;
    email: string;
    phone: string;
    primarySpecialty: string;
    secondarySpecialties: string[];
  };
  
  // Step 4: Licenses
  licenses: Array<{
    id: string;
    state: string;
    licenseNumber: string;
    issueDate: string;
    expirationDate: string;
    status: string;
    documentName?: string;
  }>;
  
  // Step 5: DEA
  dea: {
    hasDea: boolean | null;
    number: string;
    issueDate: string;
    expirationDate: string;
    schedules: string[];
    documentName?: string;
  };
  
  // Step 6: Board Certifications
  boardCertifications: {
    isCertified: 'yes' | 'no' | 'eligible' | '';
    certifications: Array<{
      id: string;
      board: string;
      specialty: string;
      certificationDate: string;
      expirationDate: string;
      documentName?: string;
    }>;
  };
  
  // Step 7: Education
  education: {
    medicalSchool: string;
    degree: string;
    graduationDate: string;
    residencies: Array<{
      id: string;
      institution: string;
      specialty: string;
      completionDate: string;
    }>;
    fellowships: Array<{
      id: string;
      institution: string;
      specialty: string;
      completionDate: string;
    }>;
  };
  
  // Step 8: Work History
  workHistory: Array<{
    id: string;
    employer: string;
    address: string;
    position: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    contactName: string;
    contactPhone: string;
  }>;
  gapExplanation: string;
  
  // Step 9: Malpractice & References
  malpractice: {
    carrier: string;
    policyNumber: string;
    coveragePerOccurrence: string;
    coverageAggregate: string;
    effectiveDate: string;
    expirationDate: string;
    documentName?: string;
  };
  references: Array<{
    id: string;
    name: string;
    phone: string;
    email: string;
    relationship: string;
  }>;
  
  // Step 10: Disclosures
  disclosures: {
    licenseRevoked: boolean | null;
    federalExclusion: boolean | null;
    felonyConviction: boolean | null;
    malpracticeClaims: boolean | null;
    healthCondition: boolean | null;
    explanation: string;
  };
  w9DocumentName?: string;
  cvDocumentName?: string;
  
  // Attestation
  attestation: {
    informationAccurate: boolean;
    understandFalseInfo: boolean;
    notifyChanges: boolean;
    agreeToTerms: boolean;
    signature: string;
    signatureDate: string;
  };
  
  // Meta
  applicationSource: 'manual' | 'caqh' | 'invitation';
  caqhProviderId?: string;
  invitationToken?: string;
}

const initialData: ApplicationData = {
  providerType: '',
  practice: {
    legalName: '',
    dba: '',
    tin: '',
    npi: '',
    address: '',
    addressLine2: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    fax: '',
    email: '',
    website: '',
  },
  demographics: {
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    credentials: '',
    npi: '',
    dateOfBirth: '',
    gender: '',
    ssn: '',
    email: '',
    phone: '',
    primarySpecialty: '',
    secondarySpecialties: [],
  },
  licenses: [],
  dea: {
    hasDea: null,
    number: '',
    issueDate: '',
    expirationDate: '',
    schedules: [],
  },
  boardCertifications: {
    isCertified: '',
    certifications: [],
  },
  education: {
    medicalSchool: '',
    degree: '',
    graduationDate: '',
    residencies: [],
    fellowships: [],
  },
  workHistory: [],
  gapExplanation: '',
  malpractice: {
    carrier: '',
    policyNumber: '',
    coveragePerOccurrence: '',
    coverageAggregate: '',
    effectiveDate: '',
    expirationDate: '',
  },
  references: [
    { id: '1', name: '', phone: '', email: '', relationship: '' },
    { id: '2', name: '', phone: '', email: '', relationship: '' },
    { id: '3', name: '', phone: '', email: '', relationship: '' },
  ],
  disclosures: {
    licenseRevoked: null,
    federalExclusion: null,
    felonyConviction: null,
    malpracticeClaims: null,
    healthCondition: null,
    explanation: '',
  },
  attestation: {
    informationAccurate: false,
    understandFalseInfo: false,
    notifyChanges: false,
    agreeToTerms: false,
    signature: '',
    signatureDate: '',
  },
  applicationSource: 'manual',
};

interface WizardContextType {
  currentStep: number;
  totalSteps: number;
  data: ApplicationData;
  setCurrentStep: (step: number) => void;
  updateData: (updates: Partial<ApplicationData>) => void;
  updateNestedData: <K extends keyof ApplicationData>(
    key: K,
    updates: Partial<ApplicationData[K]>
  ) => void;
  nextStep: () => void;
  prevStep: () => void;
  canProceed: boolean;
  setCanProceed: (can: boolean) => void;
  isSubmitting: boolean;
  setIsSubmitting: (submitting: boolean) => void;
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
  resetWizard: () => void;
  hasDraft: boolean;
  lastSaved: Date | null;
  clearDraft: () => void;
}

const WizardContext = createContext<WizardContextType | null>(null);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<ApplicationData>(initialData);
  const [canProceed, setCanProceed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasDraft, setHasDraft] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  
  const totalSteps = 10;
  
  // Load draft from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      const savedStep = localStorage.getItem(STORAGE_STEP_KEY);
      
      if (savedData) {
        const parsed = JSON.parse(savedData);
        // Verify it's a valid draft (has some data)
        if (parsed.providerType || parsed.practice?.legalName || parsed.demographics?.firstName) {
          setData(parsed);
          setHasDraft(true);
          setLastSaved(new Date(parsed._savedAt || Date.now()));
        }
      }
      
      if (savedStep) {
        const step = parseInt(savedStep, 10);
        if (step >= 1 && step <= totalSteps) {
          setCurrentStep(step);
        }
      }
    } catch (e) {
      console.error('Error loading draft:', e);
    }
    
    setIsHydrated(true);
  }, []);
  
  // Auto-save to localStorage when data or step changes
  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;
    
    // Don't save if wizard was just reset or no meaningful data
    const hasData = data.providerType || 
                    data.practice?.legalName || 
                    data.demographics?.firstName;
    
    if (hasData) {
      try {
        const dataToSave = { ...data, _savedAt: new Date().toISOString() };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
        localStorage.setItem(STORAGE_STEP_KEY, currentStep.toString());
        setHasDraft(true);
        setLastSaved(new Date());
      } catch (e) {
        console.error('Error saving draft:', e);
      }
    }
  }, [data, currentStep, isHydrated]);
  
  // Clear draft from localStorage
  const clearDraft = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_STEP_KEY);
      setHasDraft(false);
      setLastSaved(null);
    } catch (e) {
      console.error('Error clearing draft:', e);
    }
  }, []);
  
  const updateData = useCallback((updates: Partial<ApplicationData>) => {
    setData(prev => ({ ...prev, ...updates }));
  }, []);
  
  const updateNestedData = useCallback(<K extends keyof ApplicationData>(
    key: K,
    updates: Partial<ApplicationData[K]>
  ) => {
    setData(prev => ({
      ...prev,
      [key]: { ...(prev[key] as object), ...updates },
    }));
  }, []);
  
  const nextStep = useCallback(() => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      setCanProceed(false);
      setErrors({});
    }
  }, [currentStep, totalSteps]);
  
  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setErrors({});
    }
  }, [currentStep]);
  
  const resetWizard = useCallback(() => {
    setCurrentStep(1);
    setData(initialData);
    setCanProceed(false);
    setIsSubmitting(false);
    setErrors({});
    clearDraft();
  }, [clearDraft]);
  
  return (
    <WizardContext.Provider
      value={{
        currentStep,
        totalSteps,
        data,
        setCurrentStep,
        updateData,
        updateNestedData,
        nextStep,
        prevStep,
        canProceed,
        setCanProceed,
        isSubmitting,
        setIsSubmitting,
        errors,
        setErrors,
        resetWizard,
        hasDraft,
        lastSaved,
        clearDraft,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
}
