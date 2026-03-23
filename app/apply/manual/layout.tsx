'use client';

import { WizardProvider } from '../WizardContext';
import WizardLayout from '../WizardLayout';

export default function ManualFlowLayout({ children }: { children: React.ReactNode }) {
  return (
    <WizardProvider>
      <WizardLayout>
        {children}
      </WizardLayout>
    </WizardProvider>
  );
}
