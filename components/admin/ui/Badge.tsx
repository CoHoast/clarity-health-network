"use client";

import { ReactNode } from "react";
import { useTheme } from "@/components/admin/ThemeContext";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "warning" | "error" | "info" | "primary" | "secondary";
type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: ReactNode;
  dot?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "text-[10px] px-1.5 py-0.5",
  md: "text-xs px-2 py-1",
  lg: "text-sm px-2.5 py-1.5",
};

export function Badge({ 
  children, 
  variant = "default",
  size = "md",
  icon,
  dot = false,
  className,
}: BadgeProps) {
  const { isDark } = useTheme();
  
  const variantClasses: Record<BadgeVariant, string> = {
    default: isDark
      ? "bg-slate-700/80 text-slate-300 border border-slate-600/50"
      : "bg-slate-100 text-slate-600 border border-slate-200",
    success: "bg-emerald-500/15 text-emerald-500 border border-emerald-500/25",
    warning: "bg-amber-500/15 text-amber-500 border border-amber-500/25",
    error: "bg-red-500/15 text-red-500 border border-red-500/25",
    info: "bg-blue-500/15 text-blue-500 border border-blue-500/25",
    primary: "bg-cyan-500/15 text-cyan-500 border border-cyan-500/25",
    secondary: "bg-teal-500/15 text-teal-500 border border-teal-500/25",
  };
  
  const dotColors: Record<BadgeVariant, string> = {
    default: isDark ? "bg-slate-400" : "bg-slate-500",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    error: "bg-red-500",
    info: "bg-blue-500",
    primary: "bg-cyan-500",
    secondary: "bg-teal-500",
  };

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 font-medium rounded-full whitespace-nowrap",
      sizeClasses[size],
      variantClasses[variant],
      className
    )}>
      {dot && (
        <span className={cn("w-1.5 h-1.5 rounded-full", dotColors[variant])} />
      )}
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
}

// Status Badge - predefined status mappings
interface StatusBadgeProps {
  status: string;
  size?: BadgeSize;
  className?: string;
}

const statusMappings: Record<string, { variant: BadgeVariant; label?: string }> = {
  // Common statuses
  active: { variant: "success" },
  inactive: { variant: "default" },
  pending: { variant: "warning" },
  approved: { variant: "success" },
  rejected: { variant: "error" },
  expired: { variant: "error" },
  
  // Contract statuses
  "renewal sent": { variant: "primary" },
  "pending review": { variant: "warning" },
  "not started": { variant: "default" },
  
  // Credentialing statuses
  verified: { variant: "success" },
  "in review": { variant: "info" },
  "pending docs": { variant: "warning" },
  new: { variant: "primary" },
  
  // Provider statuses
  credentialed: { variant: "success" },
  suspended: { variant: "error" },
  "on hold": { variant: "warning" },
};

export function StatusBadge({ status, size = "md", className }: StatusBadgeProps) {
  const normalized = status.toLowerCase();
  const mapping = statusMappings[normalized] || { variant: "default" as BadgeVariant };
  
  return (
    <Badge 
      variant={mapping.variant} 
      size={size}
      dot
      className={className}
    >
      {mapping.label || status}
    </Badge>
  );
}
