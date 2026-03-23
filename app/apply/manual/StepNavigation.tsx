'use client';

import { useEffect } from 'react';
import { useWizard } from '../WizardContext';

interface StepNavigationProps {
  step: number;
  children: React.ReactNode;
}

export default function StepNavigation({ step, children }: StepNavigationProps) {
  const { setCurrentStep } = useWizard();
  
  useEffect(() => {
    setCurrentStep(step);
  }, [step, setCurrentStep]);
  
  return <>{children}</>;
}
