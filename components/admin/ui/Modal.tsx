"use client";

import { ReactNode, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from "lucide-react";
import { useTheme } from "@/components/admin/ThemeContext";
import { cn } from "@/lib/utils";
import { Button, IconButton } from "./Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-[90vw]",
};

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = "md",
  closeOnOverlayClick = true,
  showCloseButton = true,
}: ModalProps) {
  const { isDark } = useTheme();
  
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOnOverlayClick ? onClose : undefined}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={cn(
                "w-full rounded-2xl shadow-2xl overflow-hidden",
                sizeClasses[size],
                isDark 
                  ? "bg-slate-800 border border-slate-700" 
                  : "bg-white border border-slate-200"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <div className={cn(
                  "flex items-start justify-between p-5 border-b",
                  isDark ? "border-slate-700" : "border-slate-200"
                )}>
                  <div>
                    {title && (
                      <h2 className={cn(
                        "text-lg font-semibold",
                        isDark ? "text-white" : "text-slate-900"
                      )}>
                        {title}
                      </h2>
                    )}
                    {subtitle && (
                      <p className={cn(
                        "mt-1 text-sm",
                        isDark ? "text-slate-400" : "text-slate-500"
                      )}>
                        {subtitle}
                      </p>
                    )}
                  </div>
                  {showCloseButton && (
                    <IconButton
                      icon={<X className="w-5 h-5" />}
                      onClick={onClose}
                      variant="ghost"
                    />
                  )}
                </div>
              )}
              
              {/* Content */}
              <div className="p-5 max-h-[calc(100vh-200px)] overflow-y-auto">
                {children}
              </div>
              
              {/* Footer */}
              {footer && (
                <div className={cn(
                  "p-5 border-t",
                  isDark ? "border-slate-700 bg-slate-800/50" : "border-slate-200 bg-slate-50"
                )}>
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// Confirmation Modal
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info";
  loading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  loading = false,
}: ConfirmModalProps) {
  const { isDark } = useTheme();
  
  const icons = {
    danger: <AlertCircle className="w-6 h-6 text-red-500" />,
    warning: <AlertTriangle className="w-6 h-6 text-amber-500" />,
    info: <Info className="w-6 h-6 text-blue-500" />,
  };
  
  const iconBg = {
    danger: isDark ? "bg-red-500/20" : "bg-red-50",
    warning: isDark ? "bg-amber-500/20" : "bg-amber-50",
    info: isDark ? "bg-blue-500/20" : "bg-blue-50",
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={false}>
      <div className="text-center">
        <div className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4",
          iconBg[variant]
        )}>
          {icons[variant]}
        </div>
        <h3 className={cn(
          "text-lg font-semibold mb-2",
          isDark ? "text-white" : "text-slate-900"
        )}>
          {title}
        </h3>
        <p className={cn(
          "text-sm mb-6",
          isDark ? "text-slate-400" : "text-slate-500"
        )}>
          {message}
        </p>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button 
            variant={variant === "danger" ? "danger" : "primary"} 
            className="flex-1" 
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// Success Modal
interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function SuccessModal({
  isOpen,
  onClose,
  title,
  message,
  action,
}: SuccessModalProps) {
  const { isDark } = useTheme();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={false}>
      <div className="text-center py-4">
        <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-8 h-8 text-emerald-500" />
        </div>
        <h3 className={cn(
          "text-xl font-semibold mb-2",
          isDark ? "text-white" : "text-slate-900"
        )}>
          {title}
        </h3>
        {message && (
          <p className={cn(
            "text-sm mb-6",
            isDark ? "text-slate-400" : "text-slate-500"
          )}>
            {message}
          </p>
        )}
        <div className="flex gap-3 justify-center">
          {action ? (
            <>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button variant="primary" onClick={action.onClick}>
                {action.label}
              </Button>
            </>
          ) : (
            <Button variant="primary" onClick={onClose}>
              Done
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
