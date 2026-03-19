/**
 * HIPAA-Compliant Audit Logging System
 * 
 * Tracks all actions for compliance:
 * - Login/logout attempts (success & failure)
 * - All CRUD operations
 * - PHI access
 * - Data exports
 * - Configuration changes
 * 
 * Retention: 6 years per HIPAA requirements
 */

import { headers } from 'next/headers';

export type AuditAction = 
  | 'login_success'
  | 'login_failure'
  | 'logout'
  | 'session_timeout'
  | 'password_change'
  | 'password_reset_request'
  | 'password_reset_complete'
  | 'mfa_enabled'
  | 'mfa_disabled'
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'export'
  | 'import'
  | 'bulk_update'
  | 'bulk_delete'
  | 'phi_access'
  | 'phi_download'
  | 'config_change'
  | 'permission_change'
  | 'api_access';

export type AuditCategory =
  | 'authentication'
  | 'authorization'
  | 'data_access'
  | 'data_change'
  | 'phi_access'
  | 'system'
  | 'configuration';

export type AuditResource =
  | 'user'
  | 'provider'
  | 'practice'
  | 'member'
  | 'claim'
  | 'contract'
  | 'payment'
  | 'document'
  | 'credential'
  | 'network'
  | 'fee_schedule'
  | 'report'
  | 'system_config'
  | 'session';

export type AuditSeverity = 'info' | 'warning' | 'critical';

export interface AuditLogEntry {
  // Core fields
  id?: string;
  timestamp: string;
  
  // Actor
  userId: string | null;
  userEmail: string | null;
  userType: 'admin' | 'provider' | 'member' | 'employer' | 'system' | 'anonymous';
  userRole?: string;
  
  // Action
  action: AuditAction;
  category: AuditCategory;
  resource: AuditResource;
  resourceId?: string;
  resourceName?: string;
  
  // Context
  ipAddress: string | null;
  userAgent: string | null;
  sessionId?: string;
  requestId?: string;
  
  // Details
  details?: Record<string, any>;
  previousValue?: Record<string, any>;
  newValue?: Record<string, any>;
  
  // PHI tracking
  phiAccessed: boolean;
  phiFields?: string[];
  
  // Outcome
  success: boolean;
  errorMessage?: string;
  severity: AuditSeverity;
  
  // Metadata
  source: 'web' | 'api' | 'system' | 'import';
  environment: 'development' | 'staging' | 'production';
}

// In-memory store for demo (will be replaced with database)
const auditStore: AuditLogEntry[] = [];

/**
 * Get request context from headers
 */
async function getRequestContext() {
  try {
    const headersList = await headers();
    return {
      ipAddress: headersList.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                 headersList.get('x-real-ip') || 
                 'unknown',
      userAgent: headersList.get('user-agent') || 'unknown',
      requestId: headersList.get('x-request-id') || crypto.randomUUID(),
    };
  } catch {
    return {
      ipAddress: 'unknown',
      userAgent: 'unknown',
      requestId: crypto.randomUUID(),
    };
  }
}

/**
 * Determine severity based on action and outcome
 */
function determineSeverity(action: AuditAction, success: boolean, phiAccessed: boolean): AuditSeverity {
  // Failed authentication is always critical
  if (action === 'login_failure') return 'critical';
  
  // PHI access is warning if successful, critical if failed
  if (phiAccessed) return success ? 'warning' : 'critical';
  
  // Delete operations are warnings
  if (action === 'delete' || action === 'bulk_delete') return 'warning';
  
  // Permission changes are warnings
  if (action === 'permission_change' || action === 'config_change') return 'warning';
  
  // Everything else is info
  return 'info';
}

/**
 * Log an audit event
 */
export async function logAudit(params: {
  userId?: string | null;
  userEmail?: string | null;
  userType?: AuditLogEntry['userType'];
  userRole?: string;
  action: AuditAction;
  category?: AuditCategory;
  resource: AuditResource;
  resourceId?: string;
  resourceName?: string;
  details?: Record<string, any>;
  previousValue?: Record<string, any>;
  newValue?: Record<string, any>;
  phiAccessed?: boolean;
  phiFields?: string[];
  success?: boolean;
  errorMessage?: string;
  sessionId?: string;
  source?: AuditLogEntry['source'];
  severity?: AuditSeverity;
}): Promise<AuditLogEntry> {
  const context = await getRequestContext();
  
  const category = params.category || inferCategory(params.action);
  const success = params.success ?? true;
  const phiAccessed = params.phiAccessed ?? false;
  
  const entry: AuditLogEntry = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    
    userId: params.userId ?? null,
    userEmail: params.userEmail ?? null,
    userType: params.userType ?? 'anonymous',
    userRole: params.userRole,
    
    action: params.action,
    category,
    resource: params.resource,
    resourceId: params.resourceId,
    resourceName: params.resourceName,
    
    ipAddress: context.ipAddress,
    userAgent: context.userAgent,
    sessionId: params.sessionId,
    requestId: context.requestId,
    
    details: params.details,
    previousValue: params.previousValue,
    newValue: params.newValue,
    
    phiAccessed,
    phiFields: params.phiFields,
    
    success,
    errorMessage: params.errorMessage,
    severity: params.severity ?? determineSeverity(params.action, success, phiAccessed),
    
    source: params.source ?? 'web',
    environment: (process.env.NODE_ENV as any) || 'development',
  };
  
  // Store in memory (replace with database insert)
  auditStore.push(entry);
  
  // Keep only last 10000 entries in memory
  if (auditStore.length > 10000) {
    auditStore.shift();
  }
  
  // Log critical events to console for immediate visibility
  if (entry.severity === 'critical') {
    console.error('[AUDIT CRITICAL]', JSON.stringify(entry, null, 2));
  }
  
  // TODO: When database is connected, insert here:
  // await prisma.auditLog.create({ data: entry });
  
  return entry;
}

/**
 * Infer category from action
 */
function inferCategory(action: AuditAction): AuditCategory {
  if (['login_success', 'login_failure', 'logout', 'session_timeout', 'password_change', 'password_reset_request', 'password_reset_complete', 'mfa_enabled', 'mfa_disabled'].includes(action)) {
    return 'authentication';
  }
  if (action === 'permission_change') return 'authorization';
  if (['phi_access', 'phi_download'].includes(action)) return 'phi_access';
  if (['config_change'].includes(action)) return 'configuration';
  if (['create', 'update', 'delete', 'bulk_update', 'bulk_delete', 'import'].includes(action)) return 'data_change';
  return 'data_access';
}

/**
 * Query audit logs with filters
 */
export async function queryAuditLogs(filters: {
  userId?: string;
  userType?: string;
  action?: AuditAction;
  category?: AuditCategory;
  resource?: AuditResource;
  resourceId?: string;
  severity?: AuditSeverity;
  phiAccessed?: boolean;
  success?: boolean;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}): Promise<{ logs: AuditLogEntry[]; total: number }> {
  let filtered = [...auditStore];
  
  if (filters.userId) filtered = filtered.filter(l => l.userId === filters.userId);
  if (filters.userType) filtered = filtered.filter(l => l.userType === filters.userType);
  if (filters.action) filtered = filtered.filter(l => l.action === filters.action);
  if (filters.category) filtered = filtered.filter(l => l.category === filters.category);
  if (filters.resource) filtered = filtered.filter(l => l.resource === filters.resource);
  if (filters.resourceId) filtered = filtered.filter(l => l.resourceId === filters.resourceId);
  if (filters.severity) filtered = filtered.filter(l => l.severity === filters.severity);
  if (filters.phiAccessed !== undefined) filtered = filtered.filter(l => l.phiAccessed === filters.phiAccessed);
  if (filters.success !== undefined) filtered = filtered.filter(l => l.success === filters.success);
  if (filters.startDate) filtered = filtered.filter(l => l.timestamp >= filters.startDate!);
  if (filters.endDate) filtered = filtered.filter(l => l.timestamp <= filters.endDate!);
  
  // Sort by timestamp descending
  filtered.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  
  const total = filtered.length;
  const limit = filters.limit ?? 100;
  const offset = filters.offset ?? 0;
  
  return {
    logs: filtered.slice(offset, offset + limit),
    total,
  };
}

/**
 * Export audit logs for compliance reporting
 */
export async function exportAuditLogs(filters: {
  startDate: string;
  endDate: string;
  format?: 'json' | 'csv';
}): Promise<{ data: string; filename: string }> {
  const { logs } = await queryAuditLogs({
    startDate: filters.startDate,
    endDate: filters.endDate,
    limit: 100000, // Export up to 100k records
  });
  
  // Log the export itself
  await logAudit({
    action: 'export',
    resource: 'report',
    resourceName: 'Audit Log Export',
    details: {
      startDate: filters.startDate,
      endDate: filters.endDate,
      recordCount: logs.length,
    },
  });
  
  if (filters.format === 'csv') {
    const headers = ['timestamp', 'userId', 'userEmail', 'userType', 'action', 'category', 'resource', 'resourceId', 'ipAddress', 'success', 'severity', 'phiAccessed'];
    const rows = logs.map(l => headers.map(h => JSON.stringify((l as any)[h] ?? '')).join(','));
    return {
      data: [headers.join(','), ...rows].join('\n'),
      filename: `audit-log-${filters.startDate}-${filters.endDate}.csv`,
    };
  }
  
  return {
    data: JSON.stringify(logs, null, 2),
    filename: `audit-log-${filters.startDate}-${filters.endDate}.json`,
  };
}

// Re-export for convenience
export { auditStore as _auditStore }; // For testing only
