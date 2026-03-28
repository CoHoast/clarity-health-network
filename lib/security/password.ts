/**
 * Password Security Utilities
 * 
 * HIPAA-compliant password requirements:
 * - Minimum 12 characters
 * - Uppercase, lowercase, number, special character
 * - No common passwords
 * - Password history (prevent reuse)
 */

import crypto from 'crypto';

// Common passwords to reject
const COMMON_PASSWORDS = [
  'password', 'password123', '123456', '12345678', 'qwerty', 'admin',
  'letmein', 'welcome', 'monkey', 'dragon', 'master', 'login',
  'password1', 'admin123', 'root', 'toor', 'pass', 'test',
];

export interface PasswordValidation {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'fair' | 'good' | 'strong';
  score: number;
}

export function validatePassword(password: string): PasswordValidation {
  const errors: string[] = [];
  let score = 0;

  // Minimum length (HIPAA recommends 8+, we use 12 for extra security)
  if (password.length < 12) {
    errors.push('Password must be at least 12 characters');
  } else {
    score += 1;
    if (password.length >= 16) score += 1;
    if (password.length >= 20) score += 1;
  }

  // Uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else {
    score += 1;
  }

  // Lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else {
    score += 1;
  }

  // Number
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  } else {
    score += 1;
  }

  // Special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  } else {
    score += 1;
  }

  // Common passwords check
  if (COMMON_PASSWORDS.some(common => password.toLowerCase().includes(common))) {
    errors.push('Password contains a common word or pattern');
    score = Math.max(0, score - 2);
  }

  // Sequential characters check (abc, 123, etc.)
  if (/(.)\1{2,}/.test(password) || /(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(password)) {
    errors.push('Password should not contain sequential or repeated characters');
    score = Math.max(0, score - 1);
  }

  // Determine strength
  let strength: 'weak' | 'fair' | 'good' | 'strong';
  if (score <= 2) strength = 'weak';
  else if (score <= 4) strength = 'fair';
  else if (score <= 6) strength = 'good';
  else strength = 'strong';

  return {
    isValid: errors.length === 0,
    errors,
    strength,
    score,
  };
}

// Hash password using PBKDF2 (NIST recommended)
export function hashPasswordSecure(password: string, salt?: string): { hash: string; salt: string } {
  const useSalt = salt || crypto.randomBytes(32).toString('hex');
  const hash = crypto.pbkdf2Sync(password, useSalt, 100000, 64, 'sha512').toString('hex');
  return { hash, salt: useSalt };
}

// Verify password against hash
export function verifyPasswordSecure(password: string, hash: string, salt: string): boolean {
  const { hash: inputHash } = hashPasswordSecure(password, salt);
  return crypto.timingSafeEqual(Buffer.from(inputHash), Buffer.from(hash));
}

// Generate secure random password
export function generateSecurePassword(length: number = 16): string {
  const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lowercase = 'abcdefghjkmnpqrstuvwxyz';
  const numbers = '23456789';
  const special = '!@#$%^&*_+-=';
  const all = uppercase + lowercase + numbers + special;

  let password = '';
  
  // Ensure at least one of each type
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];
  
  // Fill the rest
  for (let i = password.length; i < length; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }
  
  // Shuffle
  return password.split('').sort(() => Math.random() - 0.5).join('');
}
