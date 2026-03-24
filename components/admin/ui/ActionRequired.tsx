"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Clock,
  FileX,
  UserX,
  Shield,
  FileSignature,
  ChevronRight,
  Bell,
  CheckCircle2,
} from "lucide-react";
import { useTheme } from "@/components/admin/ThemeContext";
import { Card, CardHeader } from "@/components/admin/ui/Card";
import { cn } from "@/lib/utils";

export type ActionPriority = "critical" | "high" | "medium" | "low";
export type ActionCategory = 
  | "credential_expiring" 
  | "pending_review" 
  | "document_missing"
  | "contract_expiring"
  | "verification_failed"
  | "application_pending"
  | "oig_alert";

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  category: ActionCategory;
  priority: ActionPriority;
  href: string;
  count?: number;
  dueDate?: string;
  icon?: ReactNode;
}

const categoryConfig: Record<ActionCategory, { icon: ReactNode; color: string; label: string }> = {
  credential_expiring: {
    icon: <Clock className="w-4 h-4" />,
    color: "amber",
    label: "Credential Expiring",
  },
  pending_review: {
    icon: <FileSignature className="w-4 h-4" />,
    color: "blue",
    label: "Pending Review",
  },
  document_missing: {
    icon: <FileX className="w-4 h-4" />,
    color: "orange",
    label: "Missing Document",
  },
  contract_expiring: {
    icon: <FileSignature className="w-4 h-4" />,
    color: "amber",
    label: "Contract Expiring",
  },
  verification_failed: {
    icon: <Shield className="w-4 h-4" />,
    color: "red",
    label: "Verification Failed",
  },
  application_pending: {
    icon: <UserX className="w-4 h-4" />,
    color: "blue",
    label: "Application Pending",
  },
  oig_alert: {
    icon: <AlertTriangle className="w-4 h-4" />,
    color: "red",
    label: "OIG Alert",
  },
};

const priorityConfig: Record<ActionPriority, { bg: string; border: string; text: string; dot: string }> = {
  critical: {
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    text: "text-red-500",
    dot: "bg-red-500",
  },
  high: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-500",
    dot: "bg-amber-500",
  },
  medium: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    text: "text-blue-500",
    dot: "bg-blue-500",
  },
  low: {
    bg: "bg-slate-500/10",
    border: "border-slate-500/30",
    text: "text-slate-400",
    dot: "bg-slate-400",
  },
};

interface ActionRequiredWidgetProps {
  items: ActionItem[];
  maxItems?: number;
  className?: string;
}

export function ActionRequiredWidget({ items, maxItems = 5, className }: ActionRequiredWidgetProps) {
  const { isDark } = useTheme();
  const displayItems = items.slice(0, maxItems);
  const remainingCount = items.length - maxItems;

  // Group by priority for summary
  const criticalCount = items.filter(i => i.priority === "critical").length;
  const highCount = items.filter(i => i.priority === "high").length;
  const mediumCount = items.filter(i => i.priority === "medium").length;

  if (items.length === 0) {
    return (
      <Card className={className}>
        <CardHeader
          title="Action Required"
          icon={<Bell className="w-5 h-5 text-blue-500" />}
        />
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center mb-3",
            isDark ? "bg-emerald-500/10" : "bg-emerald-50"
          )}>
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
          </div>
          <p className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>
            All caught up!
          </p>
          <p className={cn("text-sm mt-1", isDark ? "text-slate-400" : "text-slate-500")}>
            No items require your attention
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader
        title="Action Required"
        icon={<Bell className="w-5 h-5 text-red-500" />}
        action={
          <div className="flex items-center gap-2">
            {criticalCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium bg-red-500/10 text-red-500 rounded-full border border-red-500/30">
                {criticalCount} critical
              </span>
            )}
            {highCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium bg-amber-500/10 text-amber-500 rounded-full border border-amber-500/30">
                {highCount} high
              </span>
            )}
          </div>
        }
      />

      {/* Action Items */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {displayItems.map((item, index) => {
            const category = categoryConfig[item.category];
            const priority = priorityConfig[item.priority];

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl transition-all group",
                    "border",
                    isDark
                      ? "bg-slate-800/50 border-slate-700 hover:bg-slate-700/70 hover:border-slate-600"
                      : "bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300",
                    "shadow-sm hover:shadow"
                  )}
                >
                  {/* Priority indicator */}
                  <div className={cn(
                    "w-2 h-2 rounded-full flex-shrink-0 animate-pulse",
                    priority.dot
                  )} />

                  {/* Icon */}
                  <div className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                    priority.bg,
                    "border",
                    priority.border
                  )}>
                    <span className={priority.text}>
                      {item.icon || category.icon}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={cn(
                        "text-sm font-medium truncate",
                        isDark ? "text-white" : "text-slate-900"
                      )}>
                        {item.title}
                      </p>
                      {item.count && item.count > 1 && (
                        <span className={cn(
                          "px-1.5 py-0.5 text-xs font-medium rounded",
                          isDark ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"
                        )}>
                          {item.count}
                        </span>
                      )}
                    </div>
                    <p className={cn(
                      "text-xs truncate mt-0.5",
                      isDark ? "text-slate-400" : "text-slate-500"
                    )}>
                      {item.description}
                    </p>
                  </div>

                  {/* Due date / time */}
                  {item.dueDate && (
                    <span className={cn(
                      "text-xs font-medium whitespace-nowrap",
                      item.priority === "critical" ? "text-red-500" : (isDark ? "text-slate-500" : "text-slate-400")
                    )}>
                      {item.dueDate}
                    </span>
                  )}

                  {/* Arrow */}
                  <ChevronRight className={cn(
                    "w-4 h-4 flex-shrink-0 transition-transform group-hover:translate-x-0.5",
                    isDark ? "text-slate-600" : "text-slate-400"
                  )} />
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* View all link */}
      {remainingCount > 0 && (
        <Link
          href="/admin/notifications"
          className={cn(
            "mt-4 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors",
            isDark
              ? "text-blue-400 hover:bg-blue-500/10"
              : "text-blue-600 hover:bg-blue-50"
          )}
        >
          View {remainingCount} more items
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </Card>
  );
}

// Helper to create demo action items
export function createDemoActionItems(): ActionItem[] {
  return [
    {
      id: "1",
      title: "License expiring in 30 days",
      description: "Dr. Sarah Chen - Medical License #AZ-12345",
      category: "credential_expiring",
      priority: "high",
      href: "/admin/credentialing/monitoring",
      count: 3,
      dueDate: "Apr 24",
    },
    {
      id: "2",
      title: "Pending credentialing review",
      description: "5 applications awaiting committee review",
      category: "pending_review",
      priority: "high",
      href: "/admin/credentialing/review",
      count: 5,
      dueDate: "Today",
    },
    {
      id: "3",
      title: "Missing malpractice certificate",
      description: "Eastside Family Practice - Document request sent 7 days ago",
      category: "document_missing",
      priority: "medium",
      href: "/admin/credentialing/document-requests",
      dueDate: "Overdue",
    },
    {
      id: "4",
      title: "Contract renewal needed",
      description: "12 contracts expiring within 60 days",
      category: "contract_expiring",
      priority: "medium",
      href: "/admin/contracts/expiring",
      count: 12,
      dueDate: "May 24",
    },
    {
      id: "5",
      title: "OIG exclusion match found",
      description: "Provider NPI 1234567890 - Immediate review required",
      category: "oig_alert",
      priority: "critical",
      href: "/admin/credentialing/verification",
      dueDate: "Urgent",
    },
  ];
}
