/**
 * SOC 2 Compliant Audit Logging
 * 
 * Trust Service Criteria requirements:
 * - Immutable audit logs
 * - Timestamps in UTC
 * - User attribution
 * - Change tracking
 * - Retention (7 years for HIPAA)
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// SOC 2 Audit Event Categories
export type AuditCategory =
  | 'authentication'    // Login/logout events
  | 'authorization'     // Permission checks
  | 'data_access'       // PHI/PII access
  | 'data_modification' // Create/update/delete
  | 'system'            // System events
  | 'security'          // Security events
  | 'configuration'     // Config changes
  | 'user_management';  // User CRUD

export interface Soc2AuditEvent {
  // Required fields
  id: string;
  timestamp: string;          // ISO 8601 UTC
  category: AuditCategory;
  action: string;
  actor: {
    userId: string;
    email: string;
    role: string;
    ip: string;
    userAgent: string;
    sessionId: string;
  };
  resource: {
    type: string;             // e.g., 'provider', 'member', 'claim'
    id: string;
    name?: string;
  };
  outcome: 'success' | 'failure' | 'error';
  
  // Optional fields
  details?: string;
  previousValue?: unknown;    // For modifications
  newValue?: unknown;         // For modifications
  phiAccessed?: boolean;
  errorCode?: string;
  errorMessage?: string;
  
  // Integrity
  hash: string;               // SHA256 of event (tamper detection)
  previousHash?: string;      // Chain to previous event
}

// In-memory buffer for batch writing
let auditBuffer: Soc2AuditEvent[] = [];
let lastEventHash: string = '';
const BUFFER_SIZE = 10;
const FLUSH_INTERVAL = 5000; // 5 seconds

/**
 * Generate event hash for integrity verification
 */
function generateEventHash(event: Omit<Soc2AuditEvent, 'hash'>): string {
  const content = JSON.stringify({
    id: event.id,
    timestamp: event.timestamp,
    category: event.category,
    action: event.action,
    actor: event.actor,
    resource: event.resource,
    outcome: event.outcome,
    previousHash: event.previousHash,
  });
  
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Log SOC 2 compliant audit event
 */
export function logSoc2Event(event: Omit<Soc2AuditEvent, 'id' | 'timestamp' | 'hash' | 'previousHash'>): void {
  const id = `audit_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  const timestamp = new Date().toISOString();
  
  const fullEvent: Soc2AuditEvent = {
    ...event,
    id,
    timestamp,
    previousHash: lastEventHash || undefined,
    hash: '', // Will be calculated
  };
  
  // Calculate hash (without hash field)
  fullEvent.hash = generateEventHash(fullEvent);
  lastEventHash = fullEvent.hash;
  
  // Add to buffer
  auditBuffer.push(fullEvent);
  
  // Flush if buffer is full
  if (auditBuffer.length >= BUFFER_SIZE) {
    flushAuditBuffer();
  }
}

/**
 * Flush audit buffer to storage
 */
async function flushAuditBuffer(): Promise<void> {
  if (auditBuffer.length === 0) return;
  
  const events = [...auditBuffer];
  auditBuffer = [];
  
  try {
    // Write to file (append mode for immutability)
    const logDir = path.join(process.cwd(), 'data', 'audit');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    
    // Daily log files for easier rotation
    const date = new Date().toISOString().split('T')[0];
    const logFile = path.join(logDir, `soc2-audit-${date}.jsonl`);
    
    const lines = events.map(e => JSON.stringify(e)).join('\n') + '\n';
    fs.appendFileSync(logFile, lines);
    
    // Also write to main audit log for compatibility
    const mainLogFile = path.join(process.cwd(), 'data', 'audit-log.json');
    if (fs.existsSync(mainLogFile)) {
      try {
        const existing = JSON.parse(fs.readFileSync(mainLogFile, 'utf-8'));
        // Convert to old format for compatibility
        const oldFormatEvents = events.map(e => ({
          timestamp: e.timestamp,
          user: e.actor.email,
          userId: e.actor.userId,
          action: e.action,
          category: e.category,
          resource: e.resource.id,
          resourceType: e.resource.type,
          details: e.details || '',
          ip: e.actor.ip,
          userAgent: e.actor.userAgent,
          sessionId: e.actor.sessionId,
          severity: e.outcome === 'failure' ? 'warning' : 'info',
          phiAccessed: e.phiAccessed || false,
          success: e.outcome === 'success',
        }));
        existing.push(...oldFormatEvents);
        fs.writeFileSync(mainLogFile, JSON.stringify(existing.slice(-10000), null, 2));
      } catch {
        // Ignore errors with main log
      }
    }
  } catch (error) {
    console.error('[SOC2 Audit] Failed to write audit log:', error);
    // Re-add events to buffer for retry
    auditBuffer.push(...events);
  }
}

// Periodic flush
setInterval(() => {
  flushAuditBuffer();
}, FLUSH_INTERVAL);

// Flush on process exit
if (typeof process !== 'undefined') {
  process.on('beforeExit', () => {
    flushAuditBuffer();
  });
}

/**
 * Verify audit log integrity
 */
export function verifyAuditLogIntegrity(events: Soc2AuditEvent[]): {
  valid: boolean;
  errors: { index: number; eventId: string; error: string }[];
} {
  const errors: { index: number; eventId: string; error: string }[] = [];
  
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    
    // Verify hash
    const calculatedHash = generateEventHash(event);
    if (calculatedHash !== event.hash) {
      errors.push({
        index: i,
        eventId: event.id,
        error: 'Hash mismatch - event may have been tampered with',
      });
    }
    
    // Verify chain (except first event)
    if (i > 0 && event.previousHash !== events[i - 1].hash) {
      errors.push({
        index: i,
        eventId: event.id,
        error: 'Chain broken - previousHash does not match',
      });
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Helper: Log authentication event
 */
export function logAuthEvent(
  action: 'login' | 'logout' | 'login_failed' | 'password_change' | 'mfa_enabled' | 'mfa_disabled',
  actor: Soc2AuditEvent['actor'],
  outcome: 'success' | 'failure',
  details?: string
): void {
  logSoc2Event({
    category: 'authentication',
    action,
    actor,
    resource: { type: 'session', id: actor.sessionId },
    outcome,
    details,
  });
}

/**
 * Helper: Log data access event
 */
export function logDataAccessEvent(
  actor: Soc2AuditEvent['actor'],
  resource: Soc2AuditEvent['resource'],
  phiAccessed: boolean = false,
  details?: string
): void {
  logSoc2Event({
    category: 'data_access',
    action: 'view',
    actor,
    resource,
    outcome: 'success',
    phiAccessed,
    details,
  });
}

/**
 * Helper: Log data modification event
 */
export function logDataModificationEvent(
  action: 'create' | 'update' | 'delete',
  actor: Soc2AuditEvent['actor'],
  resource: Soc2AuditEvent['resource'],
  previousValue?: unknown,
  newValue?: unknown
): void {
  logSoc2Event({
    category: 'data_modification',
    action,
    actor,
    resource,
    outcome: 'success',
    previousValue,
    newValue,
  });
}
