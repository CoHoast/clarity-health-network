"use client";

import { ReactNode } from "react";
import { useTheme } from "@/components/admin/ThemeContext";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T, index: number) => ReactNode;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  width?: string;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T, index: number) => string | number;
  onRowClick?: (item: T, index: number) => void;
  sortColumn?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (column: string) => void;
  emptyState?: ReactNode;
  loading?: boolean;
  compact?: boolean;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  sortColumn,
  sortDirection,
  onSort,
  emptyState,
  loading = false,
  compact = false,
  className,
}: DataTableProps<T>) {
  const { isDark } = useTheme();
  
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };
  
  const getSortIcon = (column: Column<T>) => {
    if (!column.sortable) return null;
    
    if (sortColumn === column.key) {
      return sortDirection === "asc" 
        ? <ChevronUp className="w-4 h-4" />
        : <ChevronDown className="w-4 h-4" />;
    }
    return <ChevronsUpDown className="w-4 h-4 opacity-40" />;
  };

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full">
        <thead>
          <tr className={cn(
            "text-left text-xs font-medium uppercase tracking-wider border-b",
            isDark 
              ? "text-slate-400 border-slate-700 bg-slate-800/30" 
              : "text-slate-500 border-slate-200 bg-slate-50"
          )}>
            {columns.map((column) => (
              <th 
                key={column.key}
                style={{ width: column.width }}
                className={cn(
                  compact ? "px-4 py-3" : "px-5 py-4",
                  alignClasses[column.align || "left"],
                  column.sortable && "cursor-pointer select-none hover:text-slate-300",
                  column.className
                )}
                onClick={() => column.sortable && onSort?.(column.key)}
              >
                <div className={cn(
                  "flex items-center gap-1.5",
                  column.align === "right" && "justify-end",
                  column.align === "center" && "justify-center"
                )}>
                  {column.header}
                  {getSortIcon(column)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/30">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className={isDark ? "bg-slate-800/20" : "bg-white"}>
                {columns.map((column) => (
                  <td key={column.key} className={compact ? "px-4 py-3" : "px-5 py-4"}>
                    <div className={cn(
                      "h-4 rounded animate-pulse",
                      isDark ? "bg-slate-700" : "bg-slate-200"
                    )} style={{ width: `${Math.random() * 40 + 60}%` }} />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-5 py-12 text-center">
                {emptyState || (
                  <p className={isDark ? "text-slate-500" : "text-slate-400"}>
                    No data available
                  </p>
                )}
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr 
                key={keyExtractor(item, index)}
                onClick={() => onRowClick?.(item, index)}
                className={cn(
                  "transition-colors",
                  isDark 
                    ? "border-slate-700/30 hover:bg-slate-700/30" 
                    : "border-slate-100 hover:bg-slate-50",
                  onRowClick && "cursor-pointer"
                )}
              >
                {columns.map((column) => (
                  <td 
                    key={column.key}
                    className={cn(
                      compact ? "px-4 py-3" : "px-5 py-4",
                      alignClasses[column.align || "left"],
                      isDark ? "text-slate-300" : "text-slate-700",
                      column.className
                    )}
                  >
                    {column.render 
                      ? column.render(item, index)
                      : item[column.key]
                    }
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// Simple table header cell for manual tables
interface TableHeaderProps {
  children: ReactNode;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  sorted?: "asc" | "desc" | null;
  onSort?: () => void;
  className?: string;
}

export function TableHeader({ 
  children, 
  align = "left", 
  sortable, 
  sorted, 
  onSort,
  className 
}: TableHeaderProps) {
  const { isDark } = useTheme();
  
  return (
    <th 
      className={cn(
        "px-5 py-4 text-xs font-medium uppercase tracking-wider",
        align === "left" && "text-left",
        align === "center" && "text-center",
        align === "right" && "text-right",
        isDark ? "text-slate-400" : "text-slate-500",
        sortable && "cursor-pointer select-none",
        className
      )}
      onClick={sortable ? onSort : undefined}
    >
      <span className="flex items-center gap-1.5">
        {children}
        {sortable && sorted === "asc" && <ChevronUp className="w-4 h-4" />}
        {sortable && sorted === "desc" && <ChevronDown className="w-4 h-4" />}
        {sortable && !sorted && <ChevronsUpDown className="w-4 h-4 opacity-40" />}
      </span>
    </th>
  );
}

// Simple table cell
interface TableCellProps {
  children: ReactNode;
  align?: "left" | "center" | "right";
  mono?: boolean;
  muted?: boolean;
  className?: string;
}

export function TableCell({ 
  children, 
  align = "left",
  mono,
  muted,
  className 
}: TableCellProps) {
  const { isDark } = useTheme();
  
  return (
    <td className={cn(
      "px-5 py-4",
      align === "left" && "text-left",
      align === "center" && "text-center",
      align === "right" && "text-right",
      mono && "font-mono text-xs",
      muted 
        ? (isDark ? "text-slate-500" : "text-slate-400")
        : (isDark ? "text-slate-300" : "text-slate-700"),
      className
    )}>
      {children}
    </td>
  );
}
