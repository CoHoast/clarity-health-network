"use client";

import { ReactNode } from "react";
import { X, Trash2, Download, Mail, Tag, UserPlus, Globe } from "lucide-react";
import { useTheme } from "@/components/admin/ThemeContext";
import { Button } from "@/components/admin/ui/Button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export interface BulkAction {
  id: string;
  label: string;
  icon?: ReactNode;
  variant?: "primary" | "secondary" | "destructive";
  onClick: () => void;
}

interface BulkActionBarProps {
  selectedCount: number;
  itemLabel?: string;
  actions: BulkAction[];
  onClear: () => void;
}

export function BulkActionBar({
  selectedCount,
  itemLabel = "item",
  actions,
  onClear,
}: BulkActionBarProps) {
  const { isDark } = useTheme();

  if (selectedCount === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className={cn(
          "fixed bottom-6 left-1/2 -translate-x-1/2 z-40",
          "flex items-center gap-4 px-4 py-3 rounded-xl shadow-lg border",
          isDark
            ? "bg-slate-800 border-slate-700"
            : "bg-white border-slate-200 shadow-xl"
        )}
      >
        {/* Selection Count */}
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "px-3 py-1 rounded-full text-sm font-medium",
              "bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-400"
            )}
          >
            {selectedCount} {itemLabel}{selectedCount !== 1 ? "s" : ""} selected
          </span>
          <button
            onClick={onClear}
            className={cn(
              "p-1.5 rounded-lg transition-colors",
              isDark ? "hover:bg-slate-700" : "hover:bg-slate-100"
            )}
            title="Clear selection"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Divider */}
        <div className={cn("w-px h-6", isDark ? "bg-slate-700" : "bg-slate-200")} />

        {/* Actions */}
        <div className="flex items-center gap-2">
          {actions.map((action) => (
            <Button
              key={action.id}
              variant={
                action.variant === "destructive"
                  ? "secondary"
                  : action.variant || "secondary"
              }
              size="sm"
              onClick={action.onClick}
              className={cn(
                action.variant === "destructive" &&
                  "text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              )}
            >
              {action.icon}
              {action.label}
            </Button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Pre-built action creators
export const bulkActionCreators = {
  delete: (onClick: () => void): BulkAction => ({
    id: "delete",
    label: "Delete",
    icon: <Trash2 className="w-4 h-4 mr-1.5" />,
    variant: "destructive",
    onClick,
  }),
  export: (onClick: () => void): BulkAction => ({
    id: "export",
    label: "Export",
    icon: <Download className="w-4 h-4 mr-1.5" />,
    variant: "secondary",
    onClick,
  }),
  email: (onClick: () => void): BulkAction => ({
    id: "email",
    label: "Send Email",
    icon: <Mail className="w-4 h-4 mr-1.5" />,
    variant: "secondary",
    onClick,
  }),
  assignNetwork: (onClick: () => void): BulkAction => ({
    id: "assign-network",
    label: "Assign to Network",
    icon: <Globe className="w-4 h-4 mr-1.5" />,
    variant: "primary",
    onClick,
  }),
  updateStatus: (onClick: () => void): BulkAction => ({
    id: "update-status",
    label: "Update Status",
    icon: <Tag className="w-4 h-4 mr-1.5" />,
    variant: "secondary",
    onClick,
  }),
};
