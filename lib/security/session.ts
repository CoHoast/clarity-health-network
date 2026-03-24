/**
 * Session Management with Timeout
 * 
 * Features:
 * - 30-minute idle timeout
 * - Activity tracking
 * - Secure session storage
 * - Auto-logout on timeout
 */

// Session configuration
export const SESSION_CONFIG = {
  TIMEOUT_MINUTES: 30,
  WARNING_MINUTES: 5, // Show warning 5 minutes before timeout
  STORAGE_KEY: 'ppo_session',
  ACTIVITY_KEY: 'ppo_last_activity',
};

export interface SessionData {
  userId: string;
  email: string;
  role: 'admin' | 'manager' | 'reviewer' | 'readonly';
  loginTime: number;
  lastActivity: number;
  expiresAt: number;
}

// Create a new session
export function createSession(user: { id: string; email: string; role: string }): SessionData {
  const now = Date.now();
  const session: SessionData = {
    userId: user.id,
    email: user.email,
    role: user.role as SessionData['role'],
    loginTime: now,
    lastActivity: now,
    expiresAt: now + (SESSION_CONFIG.TIMEOUT_MINUTES * 60 * 1000),
  };
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_CONFIG.STORAGE_KEY, JSON.stringify(session));
    localStorage.setItem(SESSION_CONFIG.ACTIVITY_KEY, String(now));
  }
  
  return session;
}

// Get current session
export function getSession(): SessionData | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(SESSION_CONFIG.STORAGE_KEY);
    if (!stored) return null;
    
    const session: SessionData = JSON.parse(stored);
    
    // Check if session is expired
    if (Date.now() > session.expiresAt) {
      clearSession();
      return null;
    }
    
    return session;
  } catch {
    return null;
  }
}

// Update last activity (call on user interaction)
export function updateActivity(): void {
  if (typeof window === 'undefined') return;
  
  const session = getSession();
  if (!session) return;
  
  const now = Date.now();
  session.lastActivity = now;
  session.expiresAt = now + (SESSION_CONFIG.TIMEOUT_MINUTES * 60 * 1000);
  
  localStorage.setItem(SESSION_CONFIG.STORAGE_KEY, JSON.stringify(session));
  localStorage.setItem(SESSION_CONFIG.ACTIVITY_KEY, String(now));
}

// Check if session is about to expire
export function getTimeUntilExpiry(): number {
  const session = getSession();
  if (!session) return 0;
  
  return Math.max(0, session.expiresAt - Date.now());
}

// Check if we should show warning
export function shouldShowTimeoutWarning(): boolean {
  const timeLeft = getTimeUntilExpiry();
  const warningThreshold = SESSION_CONFIG.WARNING_MINUTES * 60 * 1000;
  
  return timeLeft > 0 && timeLeft <= warningThreshold;
}

// Clear session (logout)
export function clearSession(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(SESSION_CONFIG.STORAGE_KEY);
  localStorage.removeItem(SESSION_CONFIG.ACTIVITY_KEY);
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return getSession() !== null;
}

// Get session remaining time in minutes
export function getRemainingMinutes(): number {
  return Math.ceil(getTimeUntilExpiry() / (60 * 1000));
}
