"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  
  // Always redirect to admin dashboard (demo mode - no login required)
  useEffect(() => {
    router.push("/admin");
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white mb-2">Demo Mode - No Login Required</p>
        <p className="text-slate-400 text-sm">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}