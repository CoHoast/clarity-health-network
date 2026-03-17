"use client";

import { ReactNode, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useTheme } from "@/components/admin/ThemeContext";
import { cn } from "@/lib/utils";
import { Button, IconButton } from "./Button";

interface SlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  width?: "sm" | "md" | "lg" | "xl";
  side?: "left" | "right";
}

const widthClasses = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export function SlideOver({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = "md",
  side = "right",
}: SlideOverProps) {
  const { isDark } = useTheme();
  
  const slideVariants = {
    hidden: { x: side === "right" ? "100%" : "-100%" },
    visible: { x: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          {/* Panel */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={slideVariants}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={cn(
              "fixed top-0 bottom-0 z-50 w-full flex flex-col",
              widthClasses[width],
              side === "right" ? "right-0" : "left-0",
              isDark 
                ? "bg-slate-900 border-l border-slate-700" 
                : "bg-white border-l border-slate-200"
            )}
          >
            {/* Header */}
            <div className={cn(
              "flex items-start justify-between p-6 border-b",
              isDark ? "border-slate-700" : "border-slate-200"
            )}>
              <div>
                <h2 className={cn(
                  "text-xl font-semibold",
                  isDark ? "text-white" : "text-slate-900"
                )}>
                  {title}
                </h2>
                {subtitle && (
                  <p className={cn(
                    "mt-1 text-sm",
                    isDark ? "text-slate-400" : "text-slate-500"
                  )}>
                    {subtitle}
                  </p>
                )}
              </div>
              <IconButton
                icon={<X className="w-5 h-5" />}
                onClick={onClose}
                variant="ghost"
              />
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {children}
            </div>
            
            {/* Footer */}
            {footer && (
              <div className={cn(
                "p-6 border-t",
                isDark ? "border-slate-700 bg-slate-800/50" : "border-slate-200 bg-slate-50"
              )}>
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Form Section within SlideOver
interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
  const { isDark } = useTheme();
  
  return (
    <div className={cn("space-y-4", className)}>
      <div>
        <h3 className={cn(
          "text-sm font-semibold",
          isDark ? "text-white" : "text-slate-900"
        )}>
          {title}
        </h3>
        {description && (
          <p className={cn(
            "mt-1 text-sm",
            isDark ? "text-slate-400" : "text-slate-500"
          )}>
            {description}
          </p>
        )}
      </div>
      <div className={cn(
        "rounded-xl p-4",
        isDark ? "bg-slate-800/50 border border-slate-700/50" : "bg-slate-50 border border-slate-200"
      )}>
        {children}
      </div>
    </div>
  );
}

// Form Field
interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}

export function FormField({ 
  label, 
  required, 
  error, 
  hint, 
  children,
  className,
}: FormFieldProps) {
  const { isDark } = useTheme();
  
  return (
    <div className={className}>
      <label className={cn(
        "block text-sm font-medium mb-2",
        isDark ? "text-slate-300" : "text-slate-700"
      )}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {hint && !error && (
        <p className={cn(
          "mt-1.5 text-xs",
          isDark ? "text-slate-500" : "text-slate-400"
        )}>
          {hint}
        </p>
      )}
      {error && (
        <p className="mt-1.5 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}

// Text Input
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function Input({ error, className, ...props }: InputProps) {
  const { isDark } = useTheme();
  
  return (
    <input
      className={cn(
        "w-full px-4 py-2.5 rounded-lg text-sm transition-all",
        "focus:outline-none focus:ring-2 focus:ring-cyan-500/40",
        isDark
          ? "bg-slate-800 border border-slate-600 text-white placeholder-slate-500"
          : "bg-white border border-slate-300 text-slate-900 placeholder-slate-400",
        error && "border-red-500 focus:ring-red-500/40",
        className
      )}
      {...props}
    />
  );
}

// Textarea
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function Textarea({ error, className, ...props }: TextareaProps) {
  const { isDark } = useTheme();
  
  return (
    <textarea
      className={cn(
        "w-full px-4 py-2.5 rounded-lg text-sm transition-all resize-none",
        "focus:outline-none focus:ring-2 focus:ring-cyan-500/40",
        isDark
          ? "bg-slate-800 border border-slate-600 text-white placeholder-slate-500"
          : "bg-white border border-slate-300 text-slate-900 placeholder-slate-400",
        error && "border-red-500 focus:ring-red-500/40",
        className
      )}
      {...props}
    />
  );
}

// Select
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Array<{ label: string; value: string }>;
  error?: boolean;
}

export function Select({ options, error, className, ...props }: SelectProps) {
  const { isDark } = useTheme();
  
  return (
    <select
      className={cn(
        "w-full px-4 py-2.5 rounded-lg text-sm transition-all appearance-none cursor-pointer",
        "focus:outline-none focus:ring-2 focus:ring-cyan-500/40",
        "bg-[length:16px] bg-[right_12px_center] bg-no-repeat",
        isDark
          ? "bg-slate-800 border border-slate-600 text-white"
          : "bg-white border border-slate-300 text-slate-900",
        error && "border-red-500 focus:ring-red-500/40",
        className
      )}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
        paddingRight: "40px",
      }}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
