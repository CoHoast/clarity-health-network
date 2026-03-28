/**
 * Secure Session Management
 * 
 * HIPAA + SOC 2 Requirements:
 * - Session fixation protection (regenerate on auth)
 * - Concurrent session limits
 * - Session binding (IP, User-Agent)
 * - Automatic expiration
 * - Secure session storage
 */

import crypto from 'crypto';

// Session configuration
export const SESSION_SECURITY_CONFIG = {
  maxConcurrentSessions: 3, // Max sessions per user
  sessionTimeout: 8 * 60 * 60 * 1000, // 8 hours
  idleTimeout: 30 * 60 * 1000, // 30 minutes idle
  bindToIp: true, // Validate IP hasn't changed
  bindToUserAgent: true, // Validate User-Agent hasn't changed
  regenerateOnAuth: true, // New session ID after login
};

interface SecureSession {
  id: string;
  userId: string;
  email: string;
  role: string;
  createdAt: number;
  lastActivity: number;
  expiresAt: number;
  ip: string;
  userAgent: string;
  fingerprint: string;
}

// In-memory session store (replace with Redis in production)
const sessions = new Map<string, SecureSession>();
const userSessions = new Map<string, Set<string>>(); // userId -> sessionIds

/**
 * Generate secure session ID
 */
export function generateSessionId(): string {
  return `sess_${Date.now().toString(36)}_${crypto.randomBytes(24).toString('hex')}`;
}

/**
 * Generate session fingerprint (for binding)
 */
function generateFingerprint(ip: string, userAgent: string): string {
  return crypto
    .createHash('sha256')
    .update(`${ip}|${userAgent}`)
    .digest('hex')
    .slice(0, 16);
}

/**
 * Create new secure session
 */
export function createSecureSession(params: {
  userId: string;
  email: string;
  role: string;
  ip: string;
  userAgent: string;
}): SecureSession {
  const now = Date.now();
  const sessionId = generateSessionId();
  
  const session: SecureSession = {
    id: sessionId,
    userId: params.userId,
    email: params.email,
    role: params.role,
    createdAt: now,
    lastActivity: now,
    expiresAt: now + SESSION_SECURITY_CONFIG.sessionTimeout,
    ip: params.ip,
    userAgent: params.userAgent,
    fingerprint: generateFingerprint(params.ip, params.userAgent),
  };
  
  // Enforce concurrent session limit
  enforceConcurrentSessionLimit(params.userId, sessionId);
  
  // Store session
  sessions.set(sessionId, session);
  
  // Track user's sessions
  if (!userSessions.has(params.userId)) {
    userSessions.set(params.userId, new Set());
  }
  userSessions.get(params.userId)!.add(sessionId);
  
  return session;
}

/**
 * Enforce concurrent session limit (logout oldest sessions)
 */
function enforceConcurrentSessionLimit(userId: string, newSessionId: string): void {
  const userSessionIds = userSessions.get(userId);
  if (!userSessionIds) return;
  
  // Get all valid sessions for user
  const validSessions: { id: string; lastActivity: number }[] = [];
  for (const sessionId of userSessionIds) {
    const session = sessions.get(sessionId);
    if (session && session.expiresAt > Date.now()) {
      validSessions.push({ id: sessionId, lastActivity: session.lastActivity });
    } else {
      // Clean up expired session
      userSessionIds.delete(sessionId);
      sessions.delete(sessionId);
    }
  }
  
  // If over limit, remove oldest sessions
  if (validSessions.length >= SESSION_SECURITY_CONFIG.maxConcurrentSessions) {
    validSessions.sort((a, b) => a.lastActivity - b.lastActivity);
    
    const toRemove = validSessions.length - SESSION_SECURITY_CONFIG.maxConcurrentSessions + 1;
    for (let i = 0; i < toRemove; i++) {
      const oldSessionId = validSessions[i].id;
      sessions.delete(oldSessionId);
      userSessionIds.delete(oldSessionId);
    }
  }
}

/**
 * Validate session (returns null if invalid)
 */
export function validateSecureSession(
  sessionId: string,
  ip: string,
  userAgent: string
): SecureSession | null {
  const session = sessions.get(sessionId);
  
  if (!session) {
    return null;
  }
  
  const now = Date.now();
  
  // Check expiration
  if (session.expiresAt < now) {
    destroySecureSession(sessionId);
    return null;
  }
  
  // Check idle timeout
  if (now - session.lastActivity > SESSION_SECURITY_CONFIG.idleTimeout) {
    destroySecureSession(sessionId);
    return null;
  }
  
  // Validate IP binding
  if (SESSION_SECURITY_CONFIG.bindToIp && session.ip !== ip) {
    console.warn(`[Session] IP mismatch for session ${sessionId}: expected ${session.ip}, got ${ip}`);
    // Don't destroy immediately - could be legitimate (VPN, mobile network)
    // But log it for security monitoring
  }
  
  // Validate fingerprint (stricter check)
  const currentFingerprint = generateFingerprint(ip, userAgent);
  if (session.fingerprint !== currentFingerprint) {
    // Significant change - possible session hijacking
    console.warn(`[Session] Fingerprint mismatch for session ${sessionId}`);
    destroySecureSession(sessionId);
    return null;
  }
  
  // Update last activity
  session.lastActivity = now;
  
  return session;
}

/**
 * Destroy session
 */
export function destroySecureSession(sessionId: string): void {
  const session = sessions.get(sessionId);
  if (session) {
    const userSessionIds = userSessions.get(session.userId);
    if (userSessionIds) {
      userSessionIds.delete(sessionId);
      if (userSessionIds.size === 0) {
        userSessions.delete(session.userId);
      }
    }
  }
  sessions.delete(sessionId);
}

/**
 * Destroy all sessions for a user (force logout everywhere)
 */
export function destroyAllUserSessions(userId: string): number {
  const userSessionIds = userSessions.get(userId);
  if (!userSessionIds) return 0;
  
  let count = 0;
  for (const sessionId of userSessionIds) {
    sessions.delete(sessionId);
    count++;
  }
  
  userSessions.delete(userId);
  return count;
}

/**
 * Regenerate session ID (session fixation protection)
 */
export function regenerateSessionId(oldSessionId: string): string | null {
  const session = sessions.get(oldSessionId);
  if (!session) return null;
  
  // Create new session ID
  const newSessionId = generateSessionId();
  
  // Update session with new ID
  session.id = newSessionId;
  
  // Move to new key
  sessions.delete(oldSessionId);
  sessions.set(newSessionId, session);
  
  // Update user's session list
  const userSessionIds = userSessions.get(session.userId);
  if (userSessionIds) {
    userSessionIds.delete(oldSessionId);
    userSessionIds.add(newSessionId);
  }
  
  return newSessionId;
}

/**
 * Get active session count for user
 */
export function getActiveSessionCount(userId: string): number {
  const userSessionIds = userSessions.get(userId);
  if (!userSessionIds) return 0;
  
  let count = 0;
  const now = Date.now();
  
  for (const sessionId of userSessionIds) {
    const session = sessions.get(sessionId);
    if (session && session.expiresAt > now) {
      count++;
    }
  }
  
  return count;
}

/**
 * List all sessions for a user (for "manage sessions" UI)
 */
export function listUserSessions(userId: string): Omit<SecureSession, 'fingerprint'>[] {
  const userSessionIds = userSessions.get(userId);
  if (!userSessionIds) return [];
  
  const result: Omit<SecureSession, 'fingerprint'>[] = [];
  const now = Date.now();
  
  for (const sessionId of userSessionIds) {
    const session = sessions.get(sessionId);
    if (session && session.expiresAt > now) {
      // Don't expose fingerprint
      const { fingerprint, ...safe } = session;
      result.push(safe);
    }
  }
  
  return result.sort((a, b) => b.lastActivity - a.lastActivity);
}
