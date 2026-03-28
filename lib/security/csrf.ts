/**
 * CSRF (Cross-Site Request Forgery) Protection
 * 
 * Implements double-submit cookie pattern
 * Required for pen test compliance
 */

import crypto from 'crypto';

const CSRF_TOKEN_LENGTH = 32;
const CSRF_COOKIE_NAME = 'csrf_token';
const CSRF_HEADER_NAME = 'x-csrf-token';

// Generate a new CSRF token
export function generateCsrfToken(): string {
  return crypto.randomBytes(CSRF_TOKEN_LENGTH).toString('hex');
}

// Validate CSRF token (header must match cookie)
export function validateCsrfToken(headerToken: string | null, cookieToken: string | null): boolean {
  if (!headerToken || !cookieToken) {
    return false;
  }
  
  // Constant-time comparison to prevent timing attacks
  if (headerToken.length !== cookieToken.length) {
    return false;
  }
  
  return crypto.timingSafeEqual(
    Buffer.from(headerToken),
    Buffer.from(cookieToken)
  );
}

// Get CSRF token from request headers
export function getCsrfHeader(headers: Headers): string | null {
  return headers.get(CSRF_HEADER_NAME);
}

// Cookie options for CSRF token
export const csrfCookieOptions = {
  name: CSRF_COOKIE_NAME,
  httpOnly: false, // Must be readable by JavaScript
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
  maxAge: 60 * 60 * 8, // 8 hours (match session)
};

// Middleware helper to check CSRF on state-changing requests
export function shouldCheckCsrf(method: string, pathname: string): boolean {
  // Only check state-changing methods
  const stateChangingMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
  if (!stateChangingMethods.includes(method.toUpperCase())) {
    return false;
  }
  
  // Skip for API routes that handle their own auth (like login)
  const exemptRoutes = [
    '/api/auth/admin-login',
    '/api/auth/login',
    '/api/auth/demo-login',
    '/api/upload/', // Upload portal uses token-based auth
  ];
  
  return !exemptRoutes.some(route => pathname.startsWith(route));
}
