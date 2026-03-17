"use client";

import { ReactNode } from "react";
import { useTheme } from "@/components/admin/ThemeContext";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
  onClick?: () => void;
}

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export function Card({ 
  children, 
  className, 
  padding = "lg",
  hover = false,
  onClick,
}: CardProps) {
  const { isDark } = useTheme();
  
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-xl transition-all duration-200",
        paddingClasses[padding],
        isDark 
          ? "bg-slate-800/80 border border-slate-700/50 backdrop-blur-sm" 
          : "bg-white border border-slate-200 shadow-sm",
        hover && (isDark
          ? "hover:bg-slate-800 hover:border-slate-600 cursor-pointer"
          : "hover:shadow-md hover:border-slate-300 cursor-pointer"),
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function CardHeader({ title, subtitle, icon, action, className }: CardHeaderProps) {
  const { isDark } = useTheme();
  
  return (
    <div className={cn("flex items-center justify-between mb-6", className)}>
      <div className="flex items-center gap-3">
        {icon && (
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            isDark 
              ? "bg-cyan-500/20 border border-cyan-500/30"
              : "bg-cyan-50 border border-cyan-200"
          )}>
            {icon}
          </div>
        )}
        <div>
          <h3 className={cn(
            "text-lg font-semibold",
            isDark ? "text-white" : "text-slate-900"
          )}>
            {title}
          </h3>
          {subtitle && (
            <p className={cn(
              "text-sm mt-0.5",
              isDark ? "text-slate-400" : "text-slate-500"
            )}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  const { isDark } = useTheme();
  
  return (
    <div className={cn(
      "-mx-6 -mb-6 mt-6 px-6 py-4 rounded-b-xl border-t",
      isDark 
        ? "bg-slate-900/50 border-slate-700/50"
        : "bg-slate-50 border-slate-100",
      className
    )}>
      {children}
    </div>
  );
}
