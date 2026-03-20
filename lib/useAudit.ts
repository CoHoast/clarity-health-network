"use client";

// Client-side audit logging hook
// Use this to log actions from any admin page

import { useCallback } from 'react';

type AuditCategory = 'auth' | 'phi_access' | 'data_change' | 'system' | 'security' | 'export' | 'verification' | 'navigation';
type AuditSeverity = 'info' | 'warning' | 'error' | 'critical';

interface AuditEventParams {
  action: string;
  category: AuditCategory;
  resource: string;
  resourceType: string;
  resourceId?: string;
  details?: string;
  severity?: AuditSeverity;
  phiAccessed?: boolean;
  success?: boolean;
  metadata?: Record<string, unknown>;
}

// Get current user from session/localStorage (simplified for demo)
function getCurrentUser(): string {
  if (typeof window === 'undefined') return 'system';
  return localStorage.getItem('audit_user') || 'admin@truecare.health';
}

function getSessionId(): string {
  if (typeof window === 'undefined') return 'server';
  let sessionId = sessionStorage.getItem('audit_session_id');
  if (!sessionId) {
    sessionId = `sess_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
    sessionStorage.setItem('audit_session_id', sessionId);
  }
  return sessionId;
}

export function useAudit() {
  const logEvent = useCallback(async (params: AuditEventParams) => {
    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: getCurrentUser(),
          userId: getCurrentUser(),
          sessionId: getSessionId(),
          severity: 'info',
          phiAccessed: false,
          success: true,
          ...params,
        }),
      });
      
      if (!response.ok) {
        console.error('Failed to log audit event:', await response.text());
      }
    } catch (error) {
      console.error('Failed to log audit event:', error);
    }
  }, []);

  // Convenience methods
  const logPageView = useCallback((page: string) => {
    logEvent({
      action: 'Page View',
      category: 'navigation',
      resource: page,
      resourceType: 'Page',
      details: `Viewed ${page}`,
    });
  }, [logEvent]);

  const logViewProvider = useCallback((providerId: string, providerName: string) => {
    logEvent({
      action: 'View Provider',
      category: 'phi_access',
      resource: providerId,
      resourceType: 'Provider',
      resourceId: providerId,
      details: `Viewed provider: ${providerName}`,
      phiAccessed: true,
    });
  }, [logEvent]);

  const logViewMember = useCallback((memberId: string, memberName: string) => {
    logEvent({
      action: 'View Member',
      category: 'phi_access',
      resource: memberId,
      resourceType: 'Member',
      resourceId: memberId,
      details: `Viewed member: ${memberName}`,
      phiAccessed: true,
    });
  }, [logEvent]);

  const logUpdateProvider = useCallback((providerId: string, providerName: string, field: string) => {
    logEvent({
      action: 'Update Provider',
      category: 'data_change',
      resource: providerId,
      resourceType: 'Provider',
      resourceId: providerId,
      details: `Updated ${field} for provider: ${providerName}`,
      severity: 'warning',
      phiAccessed: true,
    });
  }, [logEvent]);

  const logVerifyProvider = useCallback((providerId: string, providerName: string, result: string) => {
    logEvent({
      action: 'Provider Verification',
      category: 'verification',
      resource: providerId,
      resourceType: 'Provider',
      resourceId: providerId,
      details: `Verified ${providerName}: ${result}`,
    });
  }, [logEvent]);

  const logExport = useCallback((reportType: string, recordCount: number, hasPhi = false) => {
    logEvent({
      action: 'Export Data',
      category: 'export',
      resource: reportType,
      resourceType: 'Report',
      details: `Exported ${recordCount} records as ${reportType}`,
      severity: 'warning',
      phiAccessed: hasPhi,
    });
  }, [logEvent]);

  const logCreateRecord = useCallback((resourceType: string, resourceId: string, name: string) => {
    logEvent({
      action: `Create ${resourceType}`,
      category: 'data_change',
      resource: resourceId,
      resourceType,
      resourceId,
      details: `Created ${resourceType}: ${name}`,
      severity: 'info',
    });
  }, [logEvent]);

  const logDeleteRecord = useCallback((resourceType: string, resourceId: string, name: string) => {
    logEvent({
      action: `Delete ${resourceType}`,
      category: 'data_change',
      resource: resourceId,
      resourceType,
      resourceId,
      details: `Deleted ${resourceType}: ${name}`,
      severity: 'warning',
    });
  }, [logEvent]);

  const logLogin = useCallback((success: boolean, reason?: string) => {
    logEvent({
      action: success ? 'Login Success' : 'Login Failed',
      category: success ? 'auth' : 'security',
      resource: 'AUTH',
      resourceType: 'Authentication',
      details: success ? 'User logged in successfully' : `Login failed: ${reason}`,
      severity: success ? 'info' : 'warning',
      success,
    });
  }, [logEvent]);

  const logLogout = useCallback(() => {
    logEvent({
      action: 'Logout',
      category: 'auth',
      resource: 'AUTH',
      resourceType: 'Authentication',
      details: 'User logged out',
    });
  }, [logEvent]);

  return {
    logEvent,
    logPageView,
    logViewProvider,
    logViewMember,
    logUpdateProvider,
    logVerifyProvider,
    logExport,
    logCreateRecord,
    logDeleteRecord,
    logLogin,
    logLogout,
  };
}

// Standalone function for server-side logging or non-React contexts
export async function logAuditEvent(params: AuditEventParams & { user?: string }) {
  try {
    const response = await fetch('/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: params.user || 'system',
        userId: params.user || 'system',
        sessionId: 'server',
        severity: 'info',
        phiAccessed: false,
        success: true,
        ...params,
      }),
    });
    return response.ok;
  } catch (error) {
    console.error('Failed to log audit event:', error);
    return false;
  }
}
