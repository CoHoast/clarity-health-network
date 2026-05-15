"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminBypassPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Force set a valid session cookie and redirect
    document.cookie = `admin_session=admin_bypass_${Date.now()}; path=/; max-age=28800; samesite=lax`;
    document.cookie = `user=Admin; path=/; max-age=28800; samesite=lax`;
    document.cookie = `sessionId=admin_bypass_${Date.now()}; path=/; max-age=28800; samesite=lax`;
    
    // Force redirect with a full page reload
    window.location.href = '/admin';
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white">Setting up admin session...</p>
      </div>
    </div>
  );
}