'use client';

import { WizardProvider } from '../WizardContext';
import WizardLayout from '../WizardLayout';
import { ToastProvider } from '../Toast';

export default function ManualFlowLayout({ children }: { children: React.ReactNode }) {
  return (
    <WizardProvider>
      <ToastProvider>
        <WizardLayout>
          {children}
        </WizardLayout>
      </ToastProvider>
    </WizardProvider>
  );
}
