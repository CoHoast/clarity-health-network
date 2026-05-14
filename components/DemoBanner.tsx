/**
 * Demo Mode Banner
 * 
 * Displays when platform is in demo mode with masked PHI/PII data
 * Ensures HIPAA compliance by clearly marking demo status
 */

'use client';

import { useState } from 'react';
import { Shield, Eye, X, Info } from 'lucide-react';

export default function DemoBanner() {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsDismissed(false)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors"
          title="Show demo info"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg">
      <div className="px-4 py-3 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <span className="font-semibold">DEMO MODE</span>
          </div>
          <div className="flex items-center gap-2 text-blue-100">
            <Eye className="w-4 h-4" />
            <span className="text-sm">
              All PHI/PII data is masked for HIPAA compliance • No real patient data displayed
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-xs bg-blue-700 px-2 py-1 rounded">
            TrueCare PPO Network Demo
          </span>
          <button
            onClick={() => setIsDismissed(true)}
            className="text-blue-100 hover:text-white transition-colors"
            title="Minimize (demo mode remains active)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}