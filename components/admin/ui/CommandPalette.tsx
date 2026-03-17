"use client";

import { useState, useEffect, useCallback, useMemo, Fragment } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Command as CommandIcon, 
  LayoutDashboard, 
  Building2, 
  FileSignature, 
  Users, 
  Settings, 
  BarChart3, 
  Plus,
  Globe,
  DollarSign,
  BadgeCheck,
  FileText,
  ArrowRight,
  Clock,
} from "lucide-react";
import { useTheme } from "@/components/admin/ThemeContext";
import { cn } from "@/lib/utils";

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  shortcut?: string;
  action?: () => void;
  href?: string;
  category: string;
}

const commands: CommandItem[] = [
  // Navigation
  { id: "dashboard", label: "Dashboard", description: "Go to main dashboard", icon: <LayoutDashboard className="w-4 h-4" />, href: "/admin", category: "Navigation", shortcut: "G D" },
  { id: "providers", label: "All Providers", description: "View provider list", icon: <Building2 className="w-4 h-4" />, href: "/admin/providers", category: "Navigation", shortcut: "G P" },
  { id: "contracts", label: "Contracts", description: "Manage contracts", icon: <FileSignature className="w-4 h-4" />, href: "/admin/contracts", category: "Navigation", shortcut: "G C" },
  { id: "credentialing", label: "Credentialing", description: "Review applications", icon: <BadgeCheck className="w-4 h-4" />, href: "/admin/credentialing", category: "Navigation" },
  { id: "networks", label: "Networks", description: "Manage networks", icon: <Globe className="w-4 h-4" />, href: "/admin/networks", category: "Navigation" },
  { id: "analytics", label: "Analytics", description: "View reports", icon: <BarChart3 className="w-4 h-4" />, href: "/admin/analytics", category: "Navigation", shortcut: "G A" },
  { id: "discounts", label: "Discounts", description: "Rate schedules", icon: <DollarSign className="w-4 h-4" />, href: "/admin/discounts", category: "Navigation" },
  { id: "settings", label: "Settings", description: "Organization settings", icon: <Settings className="w-4 h-4" />, href: "/admin/settings", category: "Navigation" },
  
  // Actions
  { id: "add-provider", label: "Add New Provider", description: "Create a new provider", icon: <Plus className="w-4 h-4" />, href: "/admin/providers/new", category: "Actions" },
  { id: "add-contract", label: "Create Contract", description: "New provider contract", icon: <Plus className="w-4 h-4" />, href: "/admin/contracts?action=new", category: "Actions" },
  { id: "export-data", label: "Export Data", description: "Download reports", icon: <FileText className="w-4 h-4" />, href: "/admin/reports", category: "Actions" },
  
  // Quick Access
  { id: "expiring", label: "Expiring Contracts", description: "Contracts expiring soon", icon: <Clock className="w-4 h-4" />, href: "/admin/contracts/expiring", category: "Quick Access" },
  { id: "team", label: "Team Members", description: "Manage team access", icon: <Users className="w-4 h-4" />, href: "/admin/users", category: "Quick Access" },
];

export function CommandPalette() {
  const { isDark } = useTheme();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Filter commands based on query
  const filteredCommands = useMemo(() => {
    if (!query) return commands;
    
    const lowerQuery = query.toLowerCase();
    return commands.filter((cmd) => 
      cmd.label.toLowerCase().includes(lowerQuery) ||
      cmd.description?.toLowerCase().includes(lowerQuery) ||
      cmd.category.toLowerCase().includes(lowerQuery)
    );
  }, [query]);

  // Group commands by category
  const groupedCommands = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    filteredCommands.forEach((cmd) => {
      if (!groups[cmd.category]) groups[cmd.category] = [];
      groups[cmd.category].push(cmd);
    });
    return groups;
  }, [filteredCommands]);

  // Get flat list for keyboard navigation
  const flatList = useMemo(() => {
    return Object.values(groupedCommands).flat();
  }, [groupedCommands]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open with Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
        setQuery("");
        setSelectedIndex(0);
      }
      
      // Close with Escape
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Handle navigation within palette
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, flatList.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter" && flatList[selectedIndex]) {
        e.preventDefault();
        executeCommand(flatList[selectedIndex]);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, flatList, selectedIndex]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const executeCommand = useCallback((cmd: CommandItem) => {
    setIsOpen(false);
    if (cmd.action) {
      cmd.action();
    } else if (cmd.href) {
      router.push(cmd.href);
    }
  }, [router]);

  return (
    <>
      {/* Trigger Button (in header) */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors",
          isDark 
            ? "bg-slate-800 text-slate-400 hover:text-white border border-slate-700"
            : "bg-slate-100 text-slate-500 hover:text-slate-900 border border-slate-200"
        )}
      >
        <Search className="w-4 h-4" />
        <span>Quick search...</span>
        <kbd className={cn(
          "ml-2 px-1.5 py-0.5 rounded text-[10px] font-medium",
          isDark ? "bg-slate-700 text-slate-400" : "bg-slate-200 text-slate-500"
        )}>
          ⌘K
        </kbd>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className={cn(
                "fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl rounded-2xl shadow-2xl z-[100] overflow-hidden",
                isDark 
                  ? "bg-slate-900 border border-slate-700" 
                  : "bg-white border border-slate-200"
              )}
            >
              {/* Search Input */}
              <div className={cn(
                "flex items-center gap-3 px-4 border-b",
                isDark ? "border-slate-700" : "border-slate-200"
              )}>
                <Search className={cn(
                  "w-5 h-5 flex-shrink-0",
                  isDark ? "text-slate-400" : "text-slate-500"
                )} />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search commands, pages, actions..."
                  autoFocus
                  className={cn(
                    "flex-1 py-4 bg-transparent border-none outline-none text-base",
                    isDark ? "text-white placeholder-slate-500" : "text-slate-900 placeholder-slate-400"
                  )}
                />
                <kbd className={cn(
                  "px-2 py-1 rounded text-xs",
                  isDark ? "bg-slate-800 text-slate-500" : "bg-slate-100 text-slate-400"
                )}>
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-[400px] overflow-y-auto p-2">
                {Object.entries(groupedCommands).map(([category, items]) => (
                  <div key={category} className="mb-2">
                    <p className={cn(
                      "px-3 py-2 text-xs font-medium uppercase tracking-wider",
                      isDark ? "text-slate-500" : "text-slate-400"
                    )}>
                      {category}
                    </p>
                    {items.map((cmd) => {
                      const index = flatList.indexOf(cmd);
                      const isSelected = index === selectedIndex;
                      
                      return (
                        <button
                          key={cmd.id}
                          onClick={() => executeCommand(cmd)}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                            isSelected
                              ? (isDark ? "bg-slate-800" : "bg-slate-100")
                              : "hover:bg-slate-800/50"
                          )}
                        >
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                            isSelected
                              ? "bg-cyan-500/20 text-cyan-500"
                              : (isDark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500")
                          )}>
                            {cmd.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              "text-sm font-medium",
                              isDark ? "text-white" : "text-slate-900"
                            )}>
                              {cmd.label}
                            </p>
                            {cmd.description && (
                              <p className={cn(
                                "text-xs truncate",
                                isDark ? "text-slate-500" : "text-slate-400"
                              )}>
                                {cmd.description}
                              </p>
                            )}
                          </div>
                          {cmd.shortcut && (
                            <div className="flex items-center gap-1">
                              {cmd.shortcut.split(" ").map((key, i) => (
                                <kbd key={i} className={cn(
                                  "px-1.5 py-0.5 rounded text-[10px] font-medium",
                                  isDark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"
                                )}>
                                  {key}
                                </kbd>
                              ))}
                            </div>
                          )}
                          {isSelected && (
                            <ArrowRight className={cn(
                              "w-4 h-4",
                              isDark ? "text-cyan-500" : "text-cyan-600"
                            )} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}

                {flatList.length === 0 && (
                  <div className="py-8 text-center">
                    <p className={isDark ? "text-slate-500" : "text-slate-400"}>
                      No results found for "{query}"
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className={cn(
                "flex items-center gap-4 px-4 py-3 border-t text-xs",
                isDark ? "border-slate-700 text-slate-500" : "border-slate-200 text-slate-400"
              )}>
                <span className="flex items-center gap-1">
                  <kbd className={cn(
                    "px-1 py-0.5 rounded",
                    isDark ? "bg-slate-800" : "bg-slate-100"
                  )}>↑↓</kbd>
                  Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className={cn(
                    "px-1 py-0.5 rounded",
                    isDark ? "bg-slate-800" : "bg-slate-100"
                  )}>↵</kbd>
                  Select
                </span>
                <span className="flex items-center gap-1">
                  <kbd className={cn(
                    "px-1 py-0.5 rounded",
                    isDark ? "bg-slate-800" : "bg-slate-100"
                  )}>ESC</kbd>
                  Close
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
