"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { useTheme } from "@/components/admin/ThemeContext";
import { Button } from "@/components/admin/ui/Button";
import { cn } from "@/lib/utils";

interface BulkDeleteConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemCount: number;
  itemType: string; // "providers", "contracts", etc.
  itemNames?: string[]; // Optional list of item names to show
  isLoading?: boolean;
}

/**
 * Bulk Delete Confirmation Modal
 * 
 * Requires user to type "DELETE" to confirm bulk deletions.
 * Shows impact summary and affected items.
 */
export function BulkDeleteConfirm({
  isOpen,
  onClose,
  onConfirm,
  itemCount,
  itemType,
  itemNames,
  isLoading = false,
}: BulkDeleteConfirmProps) {
  const { isDark } = useTheme();
  const [confirmText, setConfirmText] = useState("");
  
  const isConfirmValid = confirmText === "DELETE";
  
  const handleClose = () => {
    setConfirmText("");
    onClose();
  };
  
  const handleConfirm = () => {
    if (!isConfirmValid || isLoading) return;
    onConfirm();
    setConfirmText("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={cn(
              "relative w-full max-w-md rounded-2xl shadow-2xl",
              isDark ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-200"
            )}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className={cn(
                "absolute top-4 right-4 p-1 rounded-lg transition-colors",
                isDark ? "text-slate-400 hover:text-white hover:bg-slate-700" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              )}
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="p-6">
              {/* Warning Icon */}
              <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/30">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              
              {/* Title */}
              <h2 className={cn(
                "text-xl font-semibold text-center mb-2",
                isDark ? "text-white" : "text-slate-900"
              )}>
                Delete {itemCount} {itemType}?
              </h2>
              
              {/* Warning message */}
              <p className={cn(
                "text-center mb-4",
                isDark ? "text-slate-400" : "text-slate-500"
              )}>
                This action cannot be undone. All selected {itemType} and their associated data will be permanently removed.
              </p>
              
              {/* Affected items (if provided) */}
              {itemNames && itemNames.length > 0 && (
                <div className={cn(
                  "mb-4 p-3 rounded-lg max-h-32 overflow-auto",
                  isDark ? "bg-slate-900/50" : "bg-slate-50"
                )}>
                  <p className={cn("text-xs font-medium mb-2", isDark ? "text-slate-500" : "text-slate-400")}>
                    Affected items:
                  </p>
                  <ul className={cn("text-sm space-y-1", isDark ? "text-slate-300" : "text-slate-600")}>
                    {itemNames.slice(0, 5).map((name, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Trash2 className="w-3 h-3 text-red-500" />
                        {name}
                      </li>
                    ))}
                    {itemNames.length > 5 && (
                      <li className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>
                        ...and {itemNames.length - 5} more
                      </li>
                    )}
                  </ul>
                </div>
              )}
              
              {/* Confirmation input */}
              <div className="mb-6">
                <label className={cn(
                  "block text-sm font-medium mb-2",
                  isDark ? "text-slate-300" : "text-slate-700"
                )}>
                  Type <span className="font-mono text-red-500">DELETE</span> to confirm
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                  placeholder="Type DELETE"
                  className={cn(
                    "w-full px-4 py-3 rounded-lg border text-center font-mono text-lg",
                    isDark 
                      ? "bg-slate-900 border-slate-600 text-white placeholder-slate-500 focus:border-red-500" 
                      : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-red-500",
                    "focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  )}
                  autoFocus
                />
              </div>
              
              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  className="flex-1"
                  onClick={handleConfirm}
                  disabled={!isConfirmValid || isLoading}
                  loading={isLoading}
                  icon={<Trash2 className="w-4 h-4" />}
                >
                  Delete {itemCount} {itemType}
                </Button>
              </div>
              
              {/* Helper text */}
              {!isConfirmValid && confirmText.length > 0 && (
                <p className="text-center text-sm text-red-500 mt-3">
                  Please type DELETE exactly to confirm
                </p>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
