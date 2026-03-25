"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Demo Auto-Login Page
 * 
 * When visitors land here, automatically create a demo session
 * and redirect to the admin dashboard. No login required.
 */
export default function DemoAdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Create demo session
    const sessionId = `demo_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
    const demoUser = {
      id: 'demo-visitor',
      name: 'Demo User',
      email: 'demo@solidarity.com',
      role: 'admin',
      type: 'admin',
    };

    // Set session in localStorage
    localStorage.setItem('auth_token', sessionId);
    localStorage.setItem('user', JSON.stringify(demoUser));
    localStorage.setItem('audit_user', demoUser.email);

    // Redirect to admin dashboard
    router.replace('/admin');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-white">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600 font-medium">Loading demo...</p>
      </div>
    </div>
  );
}
