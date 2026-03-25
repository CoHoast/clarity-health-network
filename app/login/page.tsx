"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import LoginForm from "./LoginForm";
import { DEMO_MODE } from "@/lib/demo-mode";

function LoginFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
      <div className="animate-pulse text-gray-400">Loading...</div>
    </div>
  );
}

function LoginPageContent() {
  const router = useRouter();

  useEffect(() => {
    // In demo mode, auto-login and go to admin
    if (DEMO_MODE) {
      const sessionId = `demo_${Date.now().toString(36)}`;
      const demoUser = {
        id: 'demo-visitor',
        name: 'Demo User',
        email: 'demo@solidarity.com',
        role: 'admin',
      };
      localStorage.setItem('auth_token', sessionId);
      localStorage.setItem('user', JSON.stringify(demoUser));
      router.replace('/admin');
    }
  }, [router]);

  // In demo mode, show loading while redirecting
  if (DEMO_MODE) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500">Loading demo...</p>
        </div>
      </div>
    );
  }

  return <LoginForm />;
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginPageContent />
    </Suspense>
  );
}
