"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  Users,
  Building2,
  DollarSign,
  BarChart3,
  Shield,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
  ChevronRight,
  Zap,
  FileSignature,
  UserCheck,
  AlertTriangle,
  Calculator,
  Globe,
  Lock,
  Sun,
  Moon,
  BadgeCheck,
  MessageSquare,
  Send,
  RefreshCw,
} from "lucide-react";
import AdminPulseChat from "@/components/pulse/AdminPulseChat";
import { ThemeProvider } from "@/components/admin/ThemeContext";
import { ToastProvider } from "@/components/admin/ui/Toast";
import { CommandPalette } from "@/components/admin/ui/CommandPalette";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

interface NavGroup {
  label: string | null;
  icon?: React.ElementType;
  items: NavItem[];
  collapsible?: boolean;
  dividerAfter?: boolean;
}

const navigationGroups: NavGroup[] = [
  {
    label: null,
    items: [
      { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    label: "Providers",
    items: [
      { name: "All Providers", href: "/admin/providers", icon: Building2 },
      { name: "Add Provider", href: "/admin/providers/new", icon: Users },
      { name: "Networks", href: "/admin/networks", icon: Globe },
    ],
    dividerAfter: true,
  },
  {
    label: "Contracts",
    icon: FileSignature,
    collapsible: true,
    items: [
      { name: "Active Contracts", href: "/admin/contracts", icon: FileSignature },
      { name: "Expiring Soon", href: "/admin/contracts/expiring", icon: AlertTriangle },
      { name: "Contract Templates", href: "/admin/contracts/templates", icon: FileText },
    ],
  },
  {
    label: "Rates & Discounts",
    icon: DollarSign,
    collapsible: true,
    items: [
      { name: "Discount Schedules", href: "/admin/discounts", icon: DollarSign },
      { name: "Fee Schedules", href: "/admin/fee-schedules", icon: Calculator },
    ],
  },
  {
    label: "Credentialing",
    icon: BadgeCheck,
    collapsible: true,
    items: [
      { name: "Dashboard", href: "/admin/credentialing", icon: BadgeCheck },
      { name: "Applications", href: "/admin/credentialing/applications", icon: FileText },
      { name: "Review Queue", href: "/admin/credentialing/review", icon: UserCheck },
      { name: "Contracts", href: "/admin/credentialing/contracts", icon: FileSignature },
      { name: "Document Requests", href: "/admin/credentialing/document-requests", icon: Send },
      { name: "Re-Credentialing", href: "/admin/credentialing/recredentialing", icon: RefreshCw },
      { name: "Monitoring", href: "/admin/credentialing/monitoring", icon: Shield },
    ],
  },
  {
    label: "Communications",
    icon: MessageSquare,
    collapsible: true,
    items: [
      { name: "Provider Messages", href: "/admin/communications?tab=messages", icon: Bell },
      { name: "Outreach", href: "/admin/communications?tab=outreach", icon: Send },
    ],
  },
  {
    label: "Reports",
    icon: BarChart3,
    collapsible: true,
    items: [
      { name: "Network Analytics", href: "/admin/analytics", icon: BarChart3 },
      { name: "Export Data", href: "/admin/reports", icon: FileText },
    ],
    dividerAfter: true,
  },
];

const settingsGroup: NavGroup = {
  label: "Settings",
  icon: Settings,
  collapsible: true,
  items: [
    { name: "Organization", href: "/admin/settings", icon: Settings },
    { name: "Team & Permissions", href: "/admin/users", icon: Users },
    { name: "Notifications", href: "/admin/notifications", icon: Bell },
    { name: "Audit Log", href: "/admin/audit-logs", icon: Lock },
  ],
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  const [isDark, setIsDark] = useState(false); // Default to light theme
  const [mounted, setMounted] = useState(false); // Prevent hydration flash
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/admin-login");
  };

  // Check if a nav item is active
  // Get all nav hrefs to check if current path is a nav item itself
  const allNavHrefs = [...navigationGroups, settingsGroup].flatMap(g => g.items.map(i => i.href));
  
  const isNavActive = (itemHref: string): boolean => {
    if (!pathname) return false;
    // Exact match always wins
    if (pathname === itemHref) return true;
    // If current path is itself a nav item, only exact matches count (no parent highlighting)
    if (allNavHrefs.includes(pathname)) return false;
    // For child pages not in nav (e.g. /providers/PRC-001), highlight the parent nav item
    if (itemHref !== "/admin" && pathname.startsWith(itemHref + "/")) return true;
    return false;
  };

  // Persist theme preference (default to light if no preference saved)
  useEffect(() => {
    const saved = localStorage.getItem("admin-theme");
    if (saved) {
      setIsDark(saved === "dark");
    } else {
      // No preference saved, default to light
      setIsDark(false);
      localStorage.setItem("admin-theme", "light");
    }
    // Mark as mounted after theme is loaded to prevent flash
    setMounted(true);
  }, []);

  // Auto-expand section if current page is in it
  useEffect(() => {
    const allGroups = [...navigationGroups, settingsGroup];
    allGroups.forEach(group => {
      if (group.collapsible && group.label) {
        const isInSection = group.items.some(item => 
          pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href.split("?")[0]))
        );
        if (isInSection && !expandedSections.includes(group.label)) {
          setExpandedSections(prev => [...prev, group.label!]);
        }
      }
    });
  }, [pathname]);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("admin-theme", newTheme ? "dark" : "light");
  };

  const toggleSection = (label: string) => {
    setExpandedSections(prev => 
      prev.includes(label) 
        ? prev.filter(l => l !== label)
        : [...prev, label]
    );
  };

  // Theme classes
  const theme = {
    bg: isDark ? "bg-slate-900" : "bg-gray-50",
    sidebar: isDark ? "bg-slate-950" : "bg-white",
    sidebarBorder: isDark ? "border-slate-800" : "border-gray-200",
    header: isDark ? "bg-slate-900/95 border-slate-800" : "bg-white border-gray-200",
    text: isDark ? "text-white" : "text-gray-900",
    textMuted: isDark ? "text-slate-400" : "text-gray-500",
    textSubtle: isDark ? "text-slate-500" : "text-gray-400",
    navActive: isDark ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-700",
    navInactive: isDark ? "text-slate-400 hover:bg-[#1E293B] hover:text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
    navIcon: isDark ? "text-slate-500" : "text-gray-400",
    navIconActive: isDark ? "text-blue-400" : "text-blue-600",
    card: isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-gray-200 shadow-sm",
    buttonGhost: isDark ? "text-slate-400 hover:text-white hover:bg-slate-800" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100",
    dropdown: isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200 shadow-lg",
    dropdownText: isDark ? "text-slate-300 hover:bg-slate-700" : "text-gray-700 hover:bg-gray-50",
    dropdownBorder: isDark ? "border-slate-700" : "border-gray-100",
  };

  return (
    <div className={`min-h-screen ${theme.bg}`} data-theme={isDark ? "dark" : "light"}>
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

      {/* Sidebar - always dark (DOKit Slate 900) */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#0F172A] border-r border-[#334155] transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-[#334155] bg-[#0F172A]">
          <Link href="/admin" className="flex items-center hover:opacity-80 transition-opacity">
            <img src="/solidarity-logo.png" alt="Solidarity Health Network" className="h-12 w-auto" />
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin badge */}
        <div className="p-4 border-b border-[#334155]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-[0_2px_8px_rgba(59,130,246,0.3)]">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">Admin Console</p>
              <p className="text-xs text-slate-400">Super Admin</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto max-h-[calc(100vh-240px)]">
          {/* Main navigation groups */}
          {navigationGroups.map((group, groupIndex) => {
            const isExpanded = group.label ? expandedSections.includes(group.label) : true;
            const hasActiveChild = group.items.some(item => isNavActive(item.href));
            const GroupIcon = group.icon;
            
            return (
              <div key={groupIndex}>
                <div className={group.label ? "mt-2" : ""}>
                  {/* Non-collapsible section label OR collapsible header */}
                  {group.label && !group.collapsible && (
                    <p className="px-3 mb-2 mt-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {group.label}
                    </p>
                  )}
                  
                  {/* Collapsible section header */}
                  {group.label && group.collapsible && (
                    <button
                      onClick={() => toggleSection(group.label!)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        hasActiveChild 
                          ? "text-blue-400" 
                          : "text-slate-400 hover:bg-[#1E293B] hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {GroupIcon && <GroupIcon className={`w-5 h-5 ${hasActiveChild ? "text-blue-400" : "text-slate-500"}`} />}
                        <span>{group.label}</span>
                      </div>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </motion.div>
                    </button>
                  )}

                  {/* Navigation items */}
                  <AnimatePresence initial={false}>
                    {(!group.collapsible || isExpanded) && (
                      <motion.div
                        initial={group.collapsible ? { height: 0, opacity: 0 } : false}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={group.collapsible ? { height: 0, opacity: 0 } : undefined}
                        transition={{ duration: 0.2 }}
                        className={`space-y-1 overflow-hidden ${group.collapsible ? "ml-4 mt-1" : ""}`}
                      >
                        {group.items.map((item) => {
                          const isActive = isNavActive(item.href);
                          return (
                            <Link
                              key={item.name}
                              href={item.href}
                              onClick={() => setSidebarOpen(false)}
                              className={`relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                isActive
                                  ? "bg-blue-500/10 text-blue-400"
                                  : "text-slate-400 hover:bg-[#1E293B] hover:text-white"
                              }`}
                            >
                              {isActive && (
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-blue-500 rounded-r" />
                              )}
                              <item.icon className={`w-4 h-4 ${isActive ? "text-blue-400" : "text-slate-500"}`} />
                              {item.name}
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Section divider */}
                {group.dividerAfter && (
                  <div className="my-3 mx-3 border-t border-[#334155]" />
                )}
              </div>
            );
          })}

          {/* Settings section - always at bottom */}
          <div className="mt-2">
            {(() => {
              const isExpanded = expandedSections.includes(settingsGroup.label!);
              const hasActiveChild = settingsGroup.items.some(item => isNavActive(item.href));
              const GroupIcon = settingsGroup.icon;
              
              return (
                <>
                  <button
                    onClick={() => toggleSection(settingsGroup.label!)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      hasActiveChild 
                        ? "text-blue-400" 
                        : "text-slate-400 hover:bg-[#1E293B] hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {GroupIcon && <GroupIcon className={`w-5 h-5 ${hasActiveChild ? "text-blue-400" : "text-slate-500"}`} />}
                      <span>{settingsGroup.label}</span>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-1 overflow-hidden ml-4 mt-1"
                      >
                        {settingsGroup.items.map((item) => {
                          const isActive = isNavActive(item.href);
                          return (
                            <Link
                              key={item.name}
                              href={item.href}
                              onClick={() => setSidebarOpen(false)}
                              className={`relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                isActive
                                  ? "bg-blue-500/10 text-blue-400"
                                  : "text-slate-400 hover:bg-[#1E293B] hover:text-white"
                              }`}
                            >
                              {isActive && (
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-blue-500 rounded-r" />
                              )}
                              <item.icon className={`w-4 h-4 ${isActive ? "text-blue-400" : "text-slate-500"}`} />
                              {item.name}
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              );
            })()}
          </div>
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#334155] bg-[#0F172A]">
          <button
            onClick={() => setShowPulse(true)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-[#1E293B] hover:text-white mb-2"
          >
            <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-indigo-500 rounded flex items-center justify-center shadow-[0_2px_8px_rgba(59,130,246,0.3)]">
              <Zap className="w-3 h-3 text-white" />
            </div>
            Ask Pulse AI
          </button>
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-[#1E293B] hover:text-white"
          >
            <LogOut className="w-5 h-5 text-slate-500" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className={`lg:pl-64 min-h-screen ${theme.bg}`}>
        {/* Top header */}
        <header className={`sticky top-0 z-30 h-16 ${isDark ? "bg-slate-900/95 backdrop-blur border-b border-slate-800" : "bg-white border-b border-gray-200"} flex items-center justify-between px-4 lg:px-8`}>
          <button
            onClick={() => setSidebarOpen(true)}
            className={`lg:hidden p-2 ${theme.buttonGhost} rounded-lg`}
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex-1 lg:flex-none" />

          <div className="flex items-center gap-4">
            {/* Command Palette */}
            <CommandPalette />

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${theme.buttonGhost}`}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notifications */}
            <button className={`relative p-2 ${theme.buttonGhost} rounded-lg`}>
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* Pulse AI quick access */}
            <button
              onClick={() => setShowPulse(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-indigo-600 shadow-[0_2px_8px_rgba(59,130,246,0.3)] transition-colors"
            >
              <Zap className="w-4 h-4" />
              Ask Pulse
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`flex items-center gap-2 p-1.5 rounded-lg ${isDark ? "hover:bg-slate-800" : "hover:bg-gray-100"}`}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-[10px] flex items-center justify-center shadow-[0_2px_8px_rgba(59,130,246,0.3)]">
                  <span className="text-white text-sm font-semibold">SA</span>
                </div>
                <ChevronDown className={`w-4 h-4 ${theme.textMuted} hidden sm:block`} />
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`absolute right-0 mt-2 w-56 rounded-xl py-2 z-50 ${theme.dropdown}`}
                  >
                    <div className={`px-4 py-2 border-b ${theme.dropdownBorder}`}>
                      <p className={`font-semibold ${theme.text}`}>Super Admin</p>
                      <p className={`text-sm ${theme.textMuted}`}>admin@truecarehealth.com</p>
                    </div>
                    <Link
                      href="/admin/settings"
                      className={`flex items-center gap-2 px-4 py-2 text-sm ${theme.dropdownText}`}
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    <hr className={`my-2 ${theme.dropdownBorder}`} />
                    <button 
                      onClick={handleSignOut}
                      className={`flex items-center gap-2 px-4 py-2 text-sm w-full ${theme.dropdownText}`}
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

        {/* Page content - pass theme context */}
        <main className="p-4 lg:p-8" data-theme={isDark ? "dark" : "light"}>
          <ThemeProvider value={{ isDark, setIsDark, mounted }}>
            <ToastProvider>
              <div className={isDark ? "admin-dark" : "admin-light"}>
                {children}
              </div>
            </ToastProvider>
          </ThemeProvider>
        </main>
      </div>

      {/* Pulse AI Chat */}
      <AdminPulseChat isOpen={showPulse} onClose={() => setShowPulse(false)} />

      {/* Floating Pulse button (mobile) */}
      <button
        onClick={() => setShowPulse(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-[0_4px_16px_rgba(59,130,246,0.4)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.5)] transition-all flex items-center justify-center lg:hidden z-40"
      >
        <Zap className="w-6 h-6" />
      </button>
    </div>
  );
}
