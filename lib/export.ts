// Export utilities for CSV and PDF generation

interface ExportColumn {
  key: string;
  label: string;
  format?: (value: any) => string;
}

/**
 * Export data to CSV format
 */
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  columns: ExportColumn[],
  filename: string
) {
  // Build header row
  const header = columns.map((col) => `"${col.label}"`).join(",");
  
  // Build data rows
  const rows = data.map((item) => {
    return columns.map((col) => {
      let value = item[col.key];
      if (col.format) {
        value = col.format(value);
      }
      // Escape quotes and wrap in quotes
      if (typeof value === "string") {
        value = value.replace(/"/g, '""');
        return `"${value}"`;
      }
      return value ?? "";
    }).join(",");
  });
  
  // Combine header and rows
  const csv = [header, ...rows].join("\n");
  
  // Create and download blob
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, `${filename}.csv`);
}

/**
 * Export data to JSON format
 */
export function exportToJSON<T>(data: T[], filename: string) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  downloadBlob(blob, `${filename}.json`);
}

/**
 * Download a blob as a file
 */
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Format date for export
 */
export function formatDate(date: string | Date): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

/**
 * Format currency for export
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

/**
 * Format percentage for export
 */
export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

// Pre-defined export configurations for common data types
export const exportConfigs = {
  providers: [
    { key: "name", label: "Provider Name" },
    { key: "npi", label: "NPI" },
    { key: "specialty", label: "Specialty" },
    { key: "status", label: "Status" },
    { key: "address", label: "Address" },
    { key: "city", label: "City" },
    { key: "state", label: "State" },
    { key: "zip", label: "ZIP" },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email" },
  ],
  
  contracts: [
    { key: "id", label: "Contract ID" },
    { key: "provider", label: "Provider" },
    { key: "npi", label: "NPI" },
    { key: "type", label: "Contract Type" },
    { key: "feeSchedule", label: "Fee Schedule" },
    { key: "effective", label: "Effective Date", format: formatDate },
    { key: "expires", label: "Expiration Date", format: formatDate },
    { key: "status", label: "Status" },
    { key: "autoRenew", label: "Auto-Renew" },
  ],
  
  credentialing: [
    { key: "id", label: "Application ID" },
    { key: "provider", label: "Provider" },
    { key: "npi", label: "NPI" },
    { key: "specialty", label: "Specialty" },
    { key: "submitted", label: "Submitted Date", format: formatDate },
    { key: "stage", label: "Stage" },
    { key: "status", label: "Status" },
    { key: "license", label: "License" },
    { key: "licenseExp", label: "License Expiration", format: formatDate },
  ],
};

// Hook for easy export
export function useExport() {
  const exportCSV = <T extends Record<string, any>>(
    data: T[],
    config: ExportColumn[],
    filename: string
  ) => {
    exportToCSV(data, config, filename);
  };

  const exportJSON = <T>(data: T[], filename: string) => {
    exportToJSON(data, filename);
  };

  return { exportCSV, exportJSON, exportConfigs };
}
