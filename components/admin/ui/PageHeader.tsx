"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { useTheme } from "@/components/admin/ThemeContext";
import { cn } from "@/lib/utils";
import { ChevronRight, ArrowLeft } from "lucide-react";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  backHref?: string;
  actions?: ReactNode;
  tabs?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  backHref,
  actions,
  tabs,
  className,
}: PageHeaderProps) {
  const { isDark } = useTheme();
  
  return (
    <div className={cn("mb-8", className)}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-sm mb-4">
          {breadcrumbs.map((crumb, index) => (
            <span key={index} className="flex items-center gap-1.5">
              {index > 0 && (
                <ChevronRight className={cn(
                  "w-4 h-4",
                  isDark ? "text-slate-600" : "text-slate-400"
                )} />
              )}
              {crumb.href ? (
                <Link 
                  href={crumb.href}
                  className={cn(
                    "transition-colors",
                    isDark 
                      ? "text-slate-400 hover:text-white" 
                      : "text-slate-500 hover:text-slate-900"
                  )}
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className={isDark ? "text-slate-300" : "text-slate-700"}>
                  {crumb.label}
                </span>
              )}
            </span>
          ))}
        </nav>
      )}
      
      {/* Back button */}
      {backHref && !breadcrumbs && (
        <Link 
          href={backHref}
          className={cn(
            "inline-flex items-center gap-1.5 text-sm mb-4 transition-colors",
            isDark 
              ? "text-slate-400 hover:text-white" 
              : "text-slate-500 hover:text-slate-900"
          )}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      )}
      
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={cn(
            "text-2xl sm:text-3xl font-bold tracking-tight",
            isDark ? "text-white" : "text-slate-900"
          )}>
            {title}
          </h1>
          {subtitle && (
            <p className={cn(
              "mt-1.5 text-sm sm:text-base",
              isDark ? "text-slate-400" : "text-slate-600"
            )}>
              {subtitle}
            </p>
          )}
        </div>
        
        {actions && (
          <div className="flex flex-wrap items-center gap-3">
            {actions}
          </div>
        )}
      </div>
      
      {/* Tabs */}
      {tabs && (
        <div className="mt-6">
          {tabs}
        </div>
      )}
    </div>
  );
}

// Tab bar component
interface Tab {
  label: string;
  value: string;
  count?: number;
  icon?: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Tabs({ tabs, value, onChange, className }: TabsProps) {
  const { isDark } = useTheme();
  
  return (
    <div className={cn(
      "flex items-center gap-1 p-1 rounded-lg",
      isDark ? "bg-slate-800/50" : "bg-slate-100",
      className
    )}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
            value === tab.value
              ? (isDark 
                  ? "bg-slate-700 text-white shadow-sm" 
                  : "bg-white text-slate-900 shadow-sm")
              : (isDark 
                  ? "text-slate-400 hover:text-white" 
                  : "text-slate-600 hover:text-slate-900")
          )}
        >
          {tab.icon}
          {tab.label}
          {tab.count !== undefined && (
            <span className={cn(
              "px-1.5 py-0.5 text-xs rounded-full",
              value === tab.value
                ? "bg-cyan-500/20 text-cyan-500"
                : (isDark ? "bg-slate-600 text-slate-400" : "bg-slate-200 text-slate-500")
            )}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// Pill tabs variant (underline style)
export function PillTabs({ tabs, value, onChange, className }: TabsProps) {
  const { isDark } = useTheme();
  
  return (
    <div className={cn(
      "flex items-center gap-6 border-b",
      isDark ? "border-slate-700" : "border-slate-200",
      className
    )}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            "flex items-center gap-2 pb-3 text-sm font-medium transition-all relative",
            value === tab.value
              ? (isDark ? "text-cyan-400" : "text-cyan-600")
              : (isDark ? "text-slate-400 hover:text-slate-300" : "text-slate-500 hover:text-slate-700")
          )}
        >
          {tab.icon}
          {tab.label}
          {tab.count !== undefined && (
            <span className={cn(
              "px-1.5 py-0.5 text-xs rounded-full",
              isDark ? "bg-slate-700 text-slate-400" : "bg-slate-100 text-slate-500"
            )}>
              {tab.count}
            </span>
          )}
          {value === tab.value && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500 rounded-t" />
          )}
        </button>
      ))}
    </div>
  );
}
