"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/components/admin/ThemeContext";
import { cn } from "@/lib/utils";
import { Search, X, Command } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  showShortcut?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  autoFocus?: boolean;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className,
  showShortcut = false,
  onFocus,
  onBlur,
  autoFocus = false,
}: SearchInputProps) {
  const { isDark } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  
  // Handle keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    if (!showShortcut) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showShortcut]);
  
  return (
    <div className={cn("relative", className)}>
      {/* Search icon */}
      <Search className={cn(
        "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
        isFocused
          ? "text-cyan-500"
          : isDark ? "text-slate-500" : "text-slate-400"
      )} />
      
      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => { setIsFocused(true); onFocus?.(); }}
        onBlur={() => { setIsFocused(false); onBlur?.(); }}
        autoFocus={autoFocus}
        placeholder={placeholder}
        className={cn(
          "w-full pl-10 pr-10 py-2.5 rounded-lg text-sm transition-all",
          "focus:outline-none focus:ring-2 focus:ring-cyan-500/40",
          isDark
            ? "bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:bg-slate-800 focus:border-cyan-500/50"
            : "bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-500/50",
        )}
      />
      
      {/* Clear button or shortcut */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
        {value ? (
          <button
            onClick={() => onChange("")}
            className={cn(
              "p-0.5 rounded transition-colors",
              isDark 
                ? "text-slate-500 hover:text-white hover:bg-slate-700"
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            )}
          >
            <X className="w-4 h-4" />
          </button>
        ) : showShortcut && !isFocused ? (
          <div className={cn(
            "flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium",
            isDark 
              ? "bg-slate-700 text-slate-400"
              : "bg-slate-100 text-slate-500"
          )}>
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

// Filter select dropdown
interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
  className?: string;
}

export function FilterSelect({
  value,
  onChange,
  options,
  placeholder = "All",
  className,
}: FilterSelectProps) {
  const { isDark } = useTheme();
  
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "px-3 py-2.5 rounded-lg text-sm font-medium transition-all appearance-none cursor-pointer",
        "focus:outline-none focus:ring-2 focus:ring-cyan-500/40",
        "bg-[length:16px] bg-[right_8px_center] bg-no-repeat",
        isDark
          ? "bg-slate-800 border border-slate-700 text-white"
          : "bg-white border border-slate-200 text-slate-700",
        className
      )}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
        paddingRight: "32px",
      }}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
