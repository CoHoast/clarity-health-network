"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useTheme } from "@/components/admin/ThemeContext";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral" | "warning";
  icon: ReactNode;
  delay?: number;
  className?: string;
}

export function StatCard({ 
  label, 
  value, 
  change, 
  trend = "neutral",
  icon,
  delay = 0,
  className,
}: StatCardProps) {
  const { isDark } = useTheme();
  
  const trendColors = {
    up: isDark 
      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      : "bg-emerald-50 text-emerald-600 border-emerald-200",
    down: isDark
      ? "bg-red-500/20 text-red-400 border-red-500/30"
      : "bg-red-50 text-red-600 border-red-200",
    warning: isDark
      ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
      : "bg-amber-50 text-amber-600 border-amber-200",
    neutral: isDark 
      ? "bg-slate-700/50 text-slate-400 border-slate-600/50"
      : "bg-slate-100 text-slate-500 border-slate-200",
  };
  
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.3 }}
      className={cn(
        "rounded-xl p-5 relative overflow-hidden",
        isDark 
          ? "bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700/50" 
          : "bg-white border border-slate-200 shadow-sm",
        className
      )}
    >
      {/* Subtle gradient overlay */}
      <div className={cn(
        "absolute inset-0 pointer-events-none",
        isDark 
          ? "bg-gradient-to-br from-cyan-500/5 to-teal-500/5"
          : "bg-gradient-to-br from-cyan-500/[0.02] to-teal-500/[0.02]"
      )} />
      
      <div className="relative">
        {/* Top row: Icon and Trend */}
        <div className="flex items-start justify-between mb-4">
          <div className={cn(
            "w-11 h-11 rounded-xl flex items-center justify-center",
            isDark 
              ? "bg-cyan-500/20 border border-cyan-500/30"
              : "bg-cyan-50 border border-cyan-200"
          )}>
            <div className={isDark ? "text-cyan-400" : "text-cyan-600"}>
              {icon}
            </div>
          </div>
          
          {change && (
            <div className={cn(
              "flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-full border",
              trendColors[trend]
            )}>
              <TrendIcon className="w-3 h-3" />
              <span>{change}</span>
            </div>
          )}
        </div>
        
        {/* Value */}
        <p className={cn(
          "text-3xl font-bold tracking-tight",
          isDark ? "text-white" : "text-slate-900"
        )}>{value}</p>
        
        {/* Label */}
        <p className={cn(
          "text-sm mt-1 font-medium",
          isDark ? "text-slate-400" : "text-slate-500"
        )}>{label}</p>
      </div>
    </motion.div>
  );
}

// Compact variant for smaller grids
interface StatCardCompactProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  highlight?: boolean;
  className?: string;
}

export function StatCardCompact({ 
  label, 
  value, 
  icon,
  highlight = false,
  className,
}: StatCardCompactProps) {
  const { isDark } = useTheme();
  
  return (
    <div className={cn(
      "rounded-lg p-4 text-center",
      isDark 
        ? "bg-slate-700/50 border border-slate-600/50"
        : "bg-slate-50 border border-slate-200",
      className
    )}>
      {icon && (
        <div className="flex justify-center mb-2">
          <div className={cn(
            "text-slate-400",
            highlight && "text-cyan-500"
          )}>
            {icon}
          </div>
        </div>
      )}
      <p className={cn(
        "text-2xl font-bold",
        highlight 
          ? "text-cyan-500" 
          : isDark ? "text-white" : "text-slate-900"
      )}>
        {value}
      </p>
      <p className={cn(
        "text-xs mt-1",
        isDark ? "text-slate-400" : "text-slate-500"
      )}>
        {label}
      </p>
    </div>
  );
}
