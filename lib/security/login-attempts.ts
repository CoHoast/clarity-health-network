/**
 * Login Attempt Tracking
 * 
 * Features:
 * - Track failed login attempts per IP and email
 * - Lock accounts after X failed attempts
 * - Progressive lockout (increases with each lockout)
 * - Automatic unlock after cooldown period
 */

interface LoginAttempt {
  count: number;
  lastAttempt: number;
  lockedUntil: number | null;
  lockoutCount: number; // How many times this account has been locked
}

// In-memory store (for demo - use Redis in production)
const attemptStore = new Map<string, LoginAttempt>();

// Configuration
export const LOGIN_CONFIG = {
  MAX_ATTEMPTS: 5,                    // Lock after 5 failed attempts
  BASE_LOCKOUT_MINUTES: 15,           // Initial lockout: 15 minutes
  MAX_LOCKOUT_MINUTES: 60 * 24,       // Max lockout: 24 hours
  LOCKOUT_MULTIPLIER: 2,              // Double lockout time each time
  ATTEMPT_WINDOW_MINUTES: 30,         // Reset attempts after 30 min of no activity
};

export interface LoginAttemptResult {
  allowed: boolean;
  remainingAttempts: number;
  lockedUntil: Date | null;
  lockoutMinutes: number;
  message: string;
}

/**
 * Check if login is allowed and record attempt
 */
export function checkLoginAttempt(identifier: string): LoginAttemptResult {
  const now = Date.now();
  let attempt = attemptStore.get(identifier);
  
  // Initialize if new
  if (!attempt) {
    attempt = {
      count: 0,
      lastAttempt: now,
      lockedUntil: null,
      lockoutCount: 0,
    };
  }
  
  // Check if currently locked
  if (attempt.lockedUntil && now < attempt.lockedUntil) {
    const remainingMs = attempt.lockedUntil - now;
    const remainingMinutes = Math.ceil(remainingMs / (60 * 1000));
    
    return {
      allowed: false,
      remainingAttempts: 0,
      lockedUntil: new Date(attempt.lockedUntil),
      lockoutMinutes: remainingMinutes,
      message: `Account locked. Try again in ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}.`,
    };
  }
  
  // Clear lockout if expired
  if (attempt.lockedUntil && now >= attempt.lockedUntil) {
    attempt.lockedUntil = null;
    attempt.count = 0;
  }
  
  // Reset count if attempt window expired
  const windowMs = LOGIN_CONFIG.ATTEMPT_WINDOW_MINUTES * 60 * 1000;
  if (now - attempt.lastAttempt > windowMs) {
    attempt.count = 0;
  }
  
  // Check remaining attempts
  const remainingAttempts = LOGIN_CONFIG.MAX_ATTEMPTS - attempt.count;
  
  return {
    allowed: true,
    remainingAttempts,
    lockedUntil: null,
    lockoutMinutes: 0,
    message: remainingAttempts <= 2 
      ? `Warning: ${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining before lockout.`
      : '',
  };
}

/**
 * Record a failed login attempt
 */
export function recordFailedAttempt(identifier: string): LoginAttemptResult {
  const now = Date.now();
  let attempt = attemptStore.get(identifier) || {
    count: 0,
    lastAttempt: now,
    lockedUntil: null,
    lockoutCount: 0,
  };
  
  // Clear if window expired
  const windowMs = LOGIN_CONFIG.ATTEMPT_WINDOW_MINUTES * 60 * 1000;
  if (now - attempt.lastAttempt > windowMs) {
    attempt.count = 0;
  }
  
  attempt.count++;
  attempt.lastAttempt = now;
  
  // Check if should lock
  if (attempt.count >= LOGIN_CONFIG.MAX_ATTEMPTS) {
    // Calculate lockout duration (progressive)
    const lockoutMinutes = Math.min(
      LOGIN_CONFIG.BASE_LOCKOUT_MINUTES * Math.pow(LOGIN_CONFIG.LOCKOUT_MULTIPLIER, attempt.lockoutCount),
      LOGIN_CONFIG.MAX_LOCKOUT_MINUTES
    );
    
    attempt.lockedUntil = now + (lockoutMinutes * 60 * 1000);
    attempt.lockoutCount++;
    attempt.count = 0;
    
    attemptStore.set(identifier, attempt);
    
    return {
      allowed: false,
      remainingAttempts: 0,
      lockedUntil: new Date(attempt.lockedUntil),
      lockoutMinutes,
      message: `Too many failed attempts. Account locked for ${lockoutMinutes} minute${lockoutMinutes !== 1 ? 's' : ''}.`,
    };
  }
  
  attemptStore.set(identifier, attempt);
  
  const remainingAttempts = LOGIN_CONFIG.MAX_ATTEMPTS - attempt.count;
  
  return {
    allowed: true,
    remainingAttempts,
    lockedUntil: null,
    lockoutMinutes: 0,
    message: `Invalid credentials. ${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining.`,
  };
}

/**
 * Record a successful login (resets attempts)
 */
export function recordSuccessfulLogin(identifier: string): void {
  attemptStore.delete(identifier);
}

/**
 * Manually unlock an account (admin action)
 */
export function unlockAccount(identifier: string): void {
  const attempt = attemptStore.get(identifier);
  if (attempt) {
    attempt.lockedUntil = null;
    attempt.count = 0;
    attemptStore.set(identifier, attempt);
  }
}

/**
 * Get account status without incrementing attempts
 */
export function getAccountStatus(identifier: string): {
  isLocked: boolean;
  failedAttempts: number;
  lockoutCount: number;
  lockedUntil: Date | null;
} {
  const attempt = attemptStore.get(identifier);
  
  if (!attempt) {
    return {
      isLocked: false,
      failedAttempts: 0,
      lockoutCount: 0,
      lockedUntil: null,
    };
  }
  
  const now = Date.now();
  const isLocked = attempt.lockedUntil !== null && now < attempt.lockedUntil;
  
  return {
    isLocked,
    failedAttempts: attempt.count,
    lockoutCount: attempt.lockoutCount,
    lockedUntil: isLocked && attempt.lockedUntil ? new Date(attempt.lockedUntil) : null,
  };
}
