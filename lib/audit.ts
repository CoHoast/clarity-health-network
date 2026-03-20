// HIPAA-Compliant Audit Logging System
// Logs all user actions, PHI access, and system events
// Retained for 6 years per HIPAA requirements

import { promises as fs } from 'fs';
import path from 'path';

export type AuditCategory = 
  | 'auth'           // Login, logout, session events
  | 'phi_access'     // Viewing member/patient data
  | 'data_change'    // Create, update, delete operations
  | 'system'         // System configuration changes
  | 'security'       // Failed logins, permission denials
  | 'export'         // Data exports, report downloads
  | 'verification'   // Provider verification checks
  | 'navigation';    // Page views (optional, high volume)

export type AuditSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface AuditEvent {
  id: string;
  timestamp: string;
  user: string;
  userId: string;
  action: string;
  category: AuditCategory;
  resource: string;
  resourceType: string;
  resourceId?: string;
  details: string;
  ip: string;
  userAgent: string;
  sessionId: string;
  severity: AuditSeverity;
  phiAccessed: boolean;
  success: boolean;
  metadata?: Record<string, unknown>;
}

const AUDIT_LOG_PATH = path.join(process.cwd(), 'data', 'audit-log.json');

// Generate unique audit event ID
function generateAuditId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `AUD-${timestamp}-${random}`.toUpperCase();
}

// Get current timestamp in ISO format
function getTimestamp(): string {
  return new Date().toISOString();
}

// Read all audit logs
export async function getAuditLogs(options?: {
  limit?: number;
  offset?: number;
  category?: AuditCategory;
  severity?: AuditSeverity;
  user?: string;
  startDate?: string;
  endDate?: string;
  phiOnly?: boolean;
}): Promise<{ logs: AuditEvent[]; total: number }> {
  try {
    const data = await fs.readFile(AUDIT_LOG_PATH, 'utf-8');
    let logs: AuditEvent[] = JSON.parse(data);
    
    // Sort by timestamp descending (most recent first)
    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    // Apply filters
    if (options?.category) {
      logs = logs.filter(log => log.category === options.category);
    }
    if (options?.severity) {
      logs = logs.filter(log => log.severity === options.severity);
    }
    if (options?.user) {
      logs = logs.filter(log => 
        log.user.toLowerCase().includes(options.user!.toLowerCase())
      );
    }
    if (options?.phiOnly) {
      logs = logs.filter(log => log.phiAccessed);
    }
    if (options?.startDate) {
      logs = logs.filter(log => new Date(log.timestamp) >= new Date(options.startDate!));
    }
    if (options?.endDate) {
      logs = logs.filter(log => new Date(log.timestamp) <= new Date(options.endDate!));
    }
    
    const total = logs.length;
    
    // Apply pagination
    const offset = options?.offset || 0;
    const limit = options?.limit || 100;
    logs = logs.slice(offset, offset + limit);
    
    return { logs, total };
  } catch (error) {
    // If file doesn't exist, return empty array
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return { logs: [], total: 0 };
    }
    throw error;
  }
}

// Log an audit event
export async function logAuditEvent(event: Omit<AuditEvent, 'id' | 'timestamp'>): Promise<AuditEvent> {
  const auditEvent: AuditEvent = {
    ...event,
    id: generateAuditId(),
    timestamp: getTimestamp(),
  };
  
  // Read existing logs
  let logs: AuditEvent[] = [];
  try {
    const data = await fs.readFile(AUDIT_LOG_PATH, 'utf-8');
    logs = JSON.parse(data);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error;
    }
    // Ensure data directory exists
    await fs.mkdir(path.dirname(AUDIT_LOG_PATH), { recursive: true });
  }
  
  // Add new event
  logs.push(auditEvent);
  
  // Write back
  await fs.writeFile(AUDIT_LOG_PATH, JSON.stringify(logs, null, 2));
  
  return auditEvent;
}

// Clear all audit logs (for demo reset only - never in production!)
export async function clearAuditLogs(): Promise<void> {
  await fs.writeFile(AUDIT_LOG_PATH, JSON.stringify([], null, 2));
}

// Get audit statistics
export async function getAuditStats(): Promise<{
  total: number;
  phiAccess: number;
  authEvents: number;
  warnings: number;
  errors: number;
  todayEvents: number;
}> {
  const { logs } = await getAuditLogs({ limit: 10000 });
  const today = new Date().toISOString().split('T')[0];
  
  return {
    total: logs.length,
    phiAccess: logs.filter(l => l.phiAccessed).length,
    authEvents: logs.filter(l => l.category === 'auth').length,
    warnings: logs.filter(l => l.severity === 'warning').length,
    errors: logs.filter(l => l.severity === 'error' || l.severity === 'critical').length,
    todayEvents: logs.filter(l => l.timestamp.startsWith(today)).length,
  };
}

// Helper to create common audit events
export const AuditHelpers = {
  // Authentication events
  loginSuccess: (user: string, ip: string, userAgent: string) => ({
    user,
    userId: user,
    action: 'Login Success',
    category: 'auth' as AuditCategory,
    resource: 'AUTH',
    resourceType: 'Authentication',
    details: 'User logged in successfully',
    ip,
    userAgent,
    sessionId: `sess_${Date.now().toString(36)}`,
    severity: 'info' as AuditSeverity,
    phiAccessed: false,
    success: true,
  }),
  
  loginFailed: (user: string, ip: string, userAgent: string, reason: string) => ({
    user,
    userId: 'N/A',
    action: 'Login Failed',
    category: 'security' as AuditCategory,
    resource: 'AUTH',
    resourceType: 'Authentication',
    details: `Failed login attempt - ${reason}`,
    ip,
    userAgent,
    sessionId: 'N/A',
    severity: 'warning' as AuditSeverity,
    phiAccessed: false,
    success: false,
  }),
  
  logout: (user: string, sessionId: string, ip: string, userAgent: string) => ({
    user,
    userId: user,
    action: 'Logout',
    category: 'auth' as AuditCategory,
    resource: 'AUTH',
    resourceType: 'Authentication',
    details: 'User logged out',
    ip,
    userAgent,
    sessionId,
    severity: 'info' as AuditSeverity,
    phiAccessed: false,
    success: true,
  }),
  
  // PHI Access
  viewMember: (user: string, memberId: string, memberName: string, ip: string, userAgent: string, sessionId: string) => ({
    user,
    userId: user,
    action: 'View Member Record',
    category: 'phi_access' as AuditCategory,
    resource: memberId,
    resourceType: 'Member',
    resourceId: memberId,
    details: `Accessed member record: ${memberName}`,
    ip,
    userAgent,
    sessionId,
    severity: 'info' as AuditSeverity,
    phiAccessed: true,
    success: true,
  }),
  
  viewProvider: (user: string, providerId: string, providerName: string, ip: string, userAgent: string, sessionId: string) => ({
    user,
    userId: user,
    action: 'View Provider Record',
    category: 'phi_access' as AuditCategory,
    resource: providerId,
    resourceType: 'Provider',
    resourceId: providerId,
    details: `Accessed provider record: ${providerName}`,
    ip,
    userAgent,
    sessionId,
    severity: 'info' as AuditSeverity,
    phiAccessed: true,
    success: true,
  }),
  
  // Data Changes
  createRecord: (user: string, resourceType: string, resourceId: string, details: string, ip: string, userAgent: string, sessionId: string) => ({
    user,
    userId: user,
    action: `Create ${resourceType}`,
    category: 'data_change' as AuditCategory,
    resource: resourceId,
    resourceType,
    resourceId,
    details,
    ip,
    userAgent,
    sessionId,
    severity: 'info' as AuditSeverity,
    phiAccessed: false,
    success: true,
  }),
  
  updateRecord: (user: string, resourceType: string, resourceId: string, details: string, ip: string, userAgent: string, sessionId: string, phiAccessed = false) => ({
    user,
    userId: user,
    action: `Update ${resourceType}`,
    category: 'data_change' as AuditCategory,
    resource: resourceId,
    resourceType,
    resourceId,
    details,
    ip,
    userAgent,
    sessionId,
    severity: 'warning' as AuditSeverity,
    phiAccessed,
    success: true,
  }),
  
  deleteRecord: (user: string, resourceType: string, resourceId: string, details: string, ip: string, userAgent: string, sessionId: string) => ({
    user,
    userId: user,
    action: `Delete ${resourceType}`,
    category: 'data_change' as AuditCategory,
    resource: resourceId,
    resourceType,
    resourceId,
    details,
    ip,
    userAgent,
    sessionId,
    severity: 'warning' as AuditSeverity,
    phiAccessed: false,
    success: true,
  }),
  
  // Export
  exportData: (user: string, reportType: string, details: string, ip: string, userAgent: string, sessionId: string, phiAccessed = false) => ({
    user,
    userId: user,
    action: 'Export Data',
    category: 'export' as AuditCategory,
    resource: reportType,
    resourceType: 'Report',
    details,
    ip,
    userAgent,
    sessionId,
    severity: 'warning' as AuditSeverity,
    phiAccessed,
    success: true,
  }),
  
  // Verification
  verifyProvider: (user: string, providerId: string, providerName: string, verificationResult: string, ip: string, userAgent: string, sessionId: string) => ({
    user,
    userId: user,
    action: 'Provider Verification',
    category: 'verification' as AuditCategory,
    resource: providerId,
    resourceType: 'Provider',
    resourceId: providerId,
    details: `Verified ${providerName}: ${verificationResult}`,
    ip,
    userAgent,
    sessionId,
    severity: 'info' as AuditSeverity,
    phiAccessed: false,
    success: true,
  }),
  
  // Page navigation (use sparingly - high volume)
  pageView: (user: string, page: string, ip: string, userAgent: string, sessionId: string) => ({
    user,
    userId: user,
    action: 'Page View',
    category: 'navigation' as AuditCategory,
    resource: page,
    resourceType: 'Page',
    details: `Viewed ${page}`,
    ip,
    userAgent,
    sessionId,
    severity: 'info' as AuditSeverity,
    phiAccessed: false,
    success: true,
  }),
};
