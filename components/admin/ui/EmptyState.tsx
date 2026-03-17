"use client";

import { ReactNode } from "react";
import { useTheme } from "@/components/admin/ThemeContext";
import { cn } from "@/lib/utils";
import { Button } from "./Button";
import { Inbox, Search, FileX, Users, Building2, FileSignature, Plus } from "lucide-react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
    icon?: ReactNode;
  };
  secondaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  const { isDark } = useTheme();
  
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center py-16 px-6",
      className
    )}>
      {/* Icon */}
      <div className={cn(
        "w-16 h-16 rounded-2xl flex items-center justify-center mb-6",
        isDark 
          ? "bg-slate-800 border border-slate-700"
          : "bg-slate-100 border border-slate-200"
      )}>
        <div className={isDark ? "text-slate-500" : "text-slate-400"}>
          {icon || <Inbox className="w-8 h-8" />}
        </div>
      </div>
      
      {/* Title */}
      <h3 className={cn(
        "text-lg font-semibold mb-2",
        isDark ? "text-white" : "text-slate-900"
      )}>
        {title}
      </h3>
      
      {/* Description */}
      {description && (
        <p className={cn(
          "text-sm max-w-md mb-6",
          isDark ? "text-slate-400" : "text-slate-500"
        )}>
          {description}
        </p>
      )}
      
      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex items-center gap-3">
          {action && (
            <Button
              variant="primary"
              onClick={action.onClick}
              href={action.href}
              icon={action.icon || <Plus className="w-4 h-4" />}
            >
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="outline"
              onClick={secondaryAction.onClick}
              href={secondaryAction.href}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// Preset empty states for common scenarios
export function NoSearchResults({ query, onClear }: { query?: string; onClear?: () => void }) {
  return (
    <EmptyState
      icon={<Search className="w-8 h-8" />}
      title="No results found"
      description={query 
        ? `No matches for "${query}". Try adjusting your search or filters.`
        : "Try adjusting your search or filters."
      }
      action={onClear ? {
        label: "Clear search",
        onClick: onClear,
      } : undefined}
    />
  );
}

export function NoProviders() {
  return (
    <EmptyState
      icon={<Building2 className="w-8 h-8" />}
      title="No providers yet"
      description="Get started by adding your first provider to the network."
      action={{
        label: "Add Provider",
        href: "/admin/providers/new",
      }}
    />
  );
}

export function NoContracts() {
  return (
    <EmptyState
      icon={<FileSignature className="w-8 h-8" />}
      title="No contracts"
      description="Create a contract to define rates and terms with providers."
      action={{
        label: "Create Contract",
        href: "/admin/contracts/new",
      }}
    />
  );
}

export function NoTeamMembers() {
  return (
    <EmptyState
      icon={<Users className="w-8 h-8" />}
      title="No team members"
      description="Invite team members to collaborate on managing the network."
      action={{
        label: "Invite Member",
        onClick: () => {},
      }}
    />
  );
}

export function NoData() {
  return (
    <EmptyState
      icon={<FileX className="w-8 h-8" />}
      title="No data available"
      description="There's nothing to display at the moment."
    />
  );
}
