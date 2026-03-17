"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { useTheme } from "@/components/admin/ThemeContext";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
}

export function Breadcrumb({ items, showHome = true, className }: BreadcrumbProps) {
  const { isDark } = useTheme();
  
  const allItems = showHome 
    ? [{ label: "Dashboard", href: "/admin" }, ...items]
    : items;
  
  return (
    <nav className={cn("flex items-center gap-1", className)}>
      {showHome && (
        <>
          <Link 
            href="/admin"
            className={cn(
              "p-1 rounded transition-colors",
              isDark 
                ? "text-slate-400 hover:text-white hover:bg-slate-800" 
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            )}
          >
            <Home className="w-4 h-4" />
          </Link>
          <ChevronRight className={cn(
            "w-4 h-4",
            isDark ? "text-slate-600" : "text-slate-400"
          )} />
        </>
      )}
      
      {allItems.slice(showHome ? 1 : 0).map((item, index) => {
        const isLast = index === allItems.length - (showHome ? 2 : 1);
        
        return (
          <span key={index} className="flex items-center gap-1">
            {index > 0 && (
              <ChevronRight className={cn(
                "w-4 h-4",
                isDark ? "text-slate-600" : "text-slate-400"
              )} />
            )}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className={cn(
                  "text-sm transition-colors",
                  isDark 
                    ? "text-slate-400 hover:text-white" 
                    : "text-slate-500 hover:text-slate-900"
                )}
              >
                {item.label}
              </Link>
            ) : (
              <span className={cn(
                "text-sm font-medium",
                isDark ? "text-slate-200" : "text-slate-700"
              )}>
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
