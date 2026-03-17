"use client";

import { useTheme } from "@/components/admin/ThemeContext";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

export function Skeleton({
  className,
  variant = "text",
  width,
  height,
  animation = "pulse",
}: SkeletonProps) {
  const { isDark } = useTheme();
  
  const variantClasses = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };
  
  const animationClasses = {
    pulse: "animate-pulse",
    wave: "animate-shimmer",
    none: "",
  };
  
  return (
    <div
      className={cn(
        isDark ? "bg-slate-700" : "bg-slate-200",
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={{
        width: width,
        height: height || (variant === "text" ? "1em" : undefined),
      }}
    />
  );
}

// Table Row Skeleton
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  const { isDark } = useTheme();
  
  return (
    <tr className={isDark ? "bg-slate-800/20" : "bg-white"}>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <Skeleton 
            className="h-4" 
            width={`${Math.random() * 40 + 50}%`} 
          />
        </td>
      ))}
    </tr>
  );
}

// Card Skeleton
export function CardSkeleton({ lines = 3 }: { lines?: number }) {
  const { isDark } = useTheme();
  
  return (
    <div className={cn(
      "rounded-xl p-6",
      isDark 
        ? "bg-slate-800/80 border border-slate-700/50" 
        : "bg-white border border-slate-200"
    )}>
      <div className="flex items-center gap-4 mb-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" height={16} />
          <Skeleton width="40%" height={12} />
        </div>
      </div>
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} width={`${100 - i * 15}%`} height={14} />
        ))}
      </div>
    </div>
  );
}

// Stat Card Skeleton
export function StatCardSkeleton() {
  const { isDark } = useTheme();
  
  return (
    <div className={cn(
      "rounded-xl p-5",
      isDark 
        ? "bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700/50" 
        : "bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/30"
    )}>
      <div className="flex items-start justify-between mb-4">
        <Skeleton variant="rectangular" width={44} height={44} className="rounded-xl" />
        <Skeleton width={80} height={24} className="rounded-full" />
      </div>
      <Skeleton width={100} height={32} className="mb-2" />
      <Skeleton width={120} height={16} />
    </div>
  );
}

// List Skeleton
export function ListSkeleton({ items = 5 }: { items?: number }) {
  const { isDark } = useTheme();
  
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className={cn(
          "flex items-center gap-4 p-4 rounded-xl",
          isDark ? "bg-slate-700/30" : "bg-slate-50"
        )}>
          <Skeleton variant="circular" width={40} height={40} />
          <div className="flex-1 space-y-2">
            <Skeleton width="70%" height={14} />
            <Skeleton width="50%" height={12} />
          </div>
          <Skeleton width={60} height={24} className="rounded-full" />
        </div>
      ))}
    </div>
  );
}

// Page Loading Skeleton
export function PageSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton width={200} height={32} />
          <Skeleton width={300} height={16} />
        </div>
        <div className="flex gap-3">
          <Skeleton width={100} height={40} className="rounded-lg" />
          <Skeleton width={120} height={40} className="rounded-lg" />
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      
      {/* Content */}
      <CardSkeleton lines={5} />
    </div>
  );
}
