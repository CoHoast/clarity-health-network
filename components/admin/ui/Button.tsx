"use client";

import { ReactNode, ButtonHTMLAttributes, forwardRef } from "react";
import Link from "next/link";
import { useTheme } from "@/components/admin/ThemeContext";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconRight?: ReactNode;
  loading?: boolean;
  href?: string;
}

const sizeClasses = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2.5",
  icon: "h-10 w-10",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ 
  children,
  variant = "primary",
  size = "md",
  icon,
  iconRight,
  loading = false,
  disabled,
  href,
  className,
  ...props
}, ref) => {
  const { isDark } = useTheme();
  
  const variantClasses: Record<ButtonVariant, string> = {
    primary: "bg-cyan-600 text-white hover:bg-cyan-700 active:bg-cyan-800 shadow-sm",
    secondary: "bg-teal-600 text-white hover:bg-teal-700 active:bg-teal-800 shadow-sm",
    outline: isDark
      ? "border border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-500"
      : "border border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900 hover:border-slate-400",
    ghost: isDark
      ? "text-slate-400 hover:text-white hover:bg-slate-800"
      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
    danger: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm",
  };
  
  const baseClasses = cn(
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150",
    "focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:ring-offset-2",
    isDark ? "focus:ring-offset-slate-900" : "focus:ring-offset-white",
    "disabled:opacity-50 disabled:pointer-events-none",
    sizeClasses[size],
    variantClasses[variant],
    className
  );
  
  const content = (
    <>
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children && <span>{children}</span>}
      {iconRight && <span className="flex-shrink-0">{iconRight}</span>}
    </>
  );
  
  if (href && !disabled && !loading) {
    return (
      <Link href={href} className={baseClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={baseClasses}
      {...props}
    >
      {content}
    </button>
  );
});

Button.displayName = "Button";

// Icon Button variant
interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  tooltip?: string;
}

export function IconButton({ 
  icon, 
  variant = "ghost",
  size = "md",
  tooltip,
  className,
  ...props 
}: IconButtonProps) {
  const { isDark } = useTheme();
  
  const sizeMap = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };
  
  const variantClasses: Record<ButtonVariant, string> = {
    primary: "bg-cyan-600 text-white hover:bg-cyan-700",
    secondary: "bg-teal-600 text-white hover:bg-teal-700",
    outline: isDark
      ? "border border-slate-600 text-slate-400 hover:bg-slate-800 hover:text-white"
      : "border border-slate-300 text-slate-500 hover:bg-slate-100 hover:text-slate-900",
    ghost: isDark
      ? "text-slate-400 hover:text-white hover:bg-slate-800"
      : "text-slate-500 hover:text-slate-900 hover:bg-slate-100",
    danger: "text-red-500 hover:bg-red-500/10",
  };
  
  return (
    <button
      title={tooltip}
      className={cn(
        "inline-flex items-center justify-center rounded-lg transition-all duration-150",
        sizeMap[size],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {icon}
    </button>
  );
}
