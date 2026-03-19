"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  BarChart3,
  CreditCard,
  FileText,
  CalendarCheck,
  FolderOpen,
  Shield,
  HeadphonesIcon,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Building2,
  ChevronDown,
  Zap,
} from "lucide-react";
import EmployerPulseChat from "@/components/pulse/EmployerPulseChat";

const navigationGroups = [
  {
    label: null,
    items: [
      { name: "Dashboard", href: "/employer", icon: LayoutDashboard },
    ],
  },
  {
    label: "Employees",
    items: [
      { name: "Employee Roster", href: "/employer/roster", icon: Users },
    ],
  },
  {
    label: "Financials",
    items: [
      { name: "Claims Analytics", href: "/employer/analytics", icon: BarChart3 },
      { name: "Billing & Invoices", href: "/employer/billing", icon: CreditCard },
      { name: "Stop-Loss", href: "/employer/stop-loss", icon: Shield },
    ],
  },
  {
    label: "Administration",
    items: [
      { name: "Reports", href: "/employer/reports", icon: FileText },
      { name: "Open Enrollment", href: "/employer/enrollment", icon: CalendarCheck },
      { name: "Documents", href: "/employer/documents", icon: FolderOpen },
    ],
  },
  {
    label: "Support",
    items: [
      { name: "Help & Support", href: "/employer/support", icon: HeadphonesIcon },
      { name: "Settings", href: "/employer/settings", icon: Settings },
    ],
  },
];

export default function EmployerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showPulse, setShowPulse] = useState(false);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-slate-800 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-slate-700 bg-slate-800">
          <Link href="/" className="flex items-center">
            <img src="/solidarity-logo.png" alt="Solidarity Health Network" className="h-12 w-auto" />
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Company info */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">Acme Corporation</p>
              <p className="text-xs text-slate-400">Group #12345</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-4 flex-1 overflow-y-auto max-h-[calc(100vh-240px)]">
          {navigationGroups.map((group, groupIndex) => (
            <div key={groupIndex}>
              {group.label && (
                <p className="px-3 mb-2 text-xs font-semibold text-teal-400/60 uppercase tracking-wider">
                  {group.label}
                </p>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || 
                    (item.href !== "/employer" && pathname?.startsWith(item.href));
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-slate-700 text-white"
                          : "text-slate-300 hover:bg-slate-700 hover:text-white"
                      }`}
                    >
                      <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-teal-300"}`} />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700 bg-slate-800">
          <button
            onClick={() => setShowPulse(true)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white mb-2"
          >
            <div className="w-5 h-5 bg-gradient-to-br from-cyan-400 to-teal-500 rounded flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            Ask Pulse AI
          </button>
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            <LogOut className="w-5 h-5 text-slate-400" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex-1 lg:flex-none" />

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-teal-500 rounded-full" />
            </button>

            {/* Pulse AI quick access */}
            <button
              onClick={() => setShowPulse(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-medium rounded-lg hover:from-teal-600 hover:to-teal-700 transition-colors"
            >
              <Zap className="w-4 h-4" />
              Ask Pulse
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-lg"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">HR</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-semibold text-gray-900">Sarah Johnson</p>
                      <p className="text-sm text-gray-500">HR Administrator</p>
                    </div>
                    <Link
                      href="/employer/settings"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    <hr className="my-2 border-gray-100" />
                    <button 
                      onClick={handleSignOut}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>

      {/* Pulse AI Chat */}
      <EmployerPulseChat isOpen={showPulse} onClose={() => setShowPulse(false)} />

      {/* Floating Pulse button (mobile) */}
      <button
        onClick={() => setShowPulse(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center lg:hidden z-40"
      >
        <Zap className="w-6 h-6" />
      </button>
    </div>
  );
}
