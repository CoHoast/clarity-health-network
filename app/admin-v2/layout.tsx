import { Shield, Menu, LogOut, Bell, ChevronDown } from "lucide-react";
import Link from "next/link";

export default async function AdminV2Layout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  // Server component - no client-side auth checks
  // Middleware handles authentication
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 z-50 h-full w-64 bg-[#0F172A] border-r border-[#334155]">
        <div className="h-20 flex items-center px-4 border-b border-[#334155]">
          <Link href="/admin-v2" className="flex items-center">
            <img src="/solidarity-logo-white.png" alt="Solidarity Health Network" className="h-10 w-auto" />
          </Link>
        </div>
        
        <div className="p-4 border-b border-[#334155]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">Admin Console</p>
              <p className="text-xs text-slate-400">Super Admin</p>
            </div>
          </div>
        </div>
        
        <nav className="p-3 space-y-1">
          <Link
            href="/admin-v2"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-[#1E293B] hover:text-white"
          >
            Dashboard
          </Link>
          <Link
            href="/admin-v2/providers"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-[#1E293B] hover:text-white"
          >
            Providers
          </Link>
          <Link
            href="/admin-v2/networks"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-[#1E293B] hover:text-white"
          >
            Networks
          </Link>
          <Link
            href="/admin-v2/credentialing"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-[#1E293B] hover:text-white"
          >
            Credentialing
          </Link>
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#334155]">
          <Link
            href="/api/auth/logout-v2"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-[#1E293B] hover:text-white"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8">
          <div className="flex-1" />
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-500 hover:text-gray-900 rounded-lg">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            
            <div className="flex items-center gap-2 p-1.5 rounded-lg">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-semibold">AD</span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}