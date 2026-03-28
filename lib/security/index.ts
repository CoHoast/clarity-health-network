// Security Module Exports

export * from './rate-limit';
export * from './api-key';
export * from './sanitize';
export * from './encryption';
export * from './errors';
export * from './password';
export * from './mfa';
export * from './csrf';
export * from './ip-allowlist';

// Session management
export { 
  SESSION_CONFIG,
  createSession,
  getSession,
  updateActivity,
  clearSession,
  isAuthenticated,
  getRemainingMinutes,
  getTimeUntilExpiry,
  shouldShowTimeoutWarning,
} from './session';

// API rate limiter (separate from request rate limiter)
export {
  RATE_LIMITS,
  checkRateLimit as checkApiRateLimit,
  resetRateLimit as resetApiRateLimit,
  getRateLimitStatus as getApiRateLimitStatus,
  rateLimitResponse as apiRateLimitResponse,
} from './api-rate-limiter';

// Login attempt tracking
export {
  LOGIN_CONFIG,
  checkLoginAttempt,
  recordFailedAttempt,
  recordSuccessfulLogin,
  unlockAccount,
  getAccountStatus,
} from './login-attempts';

// Input sanitization
export {
  sanitizeHtml,
  stripHtml,
  sanitizeObject,
  sanitizeNpi,
  sanitizeTaxId,
  sanitizeEmail,
  sanitizePhone,
  sanitizeZip,
  sanitizeFilename,
  sanitizeSearchQuery,
  validateProviderData,
} from './input-sanitizer';

// Combined security middleware
import { checkRateLimit, getClientIdentifier, rateLimitResponse, RateLimitConfig, STRICT_LIMIT, AUTH_LIMIT } from './rate-limit';
import { validateApiKey, isTrustedRequest } from './api-key';
import { sanitizeRequestBody } from './sanitize';
import { createErrorResponse } from './errors';

export interface SecurityOptions {
  rateLimit?: RateLimitConfig | false;
  requireApiKey?: boolean;
  sanitizeBody?: boolean;
  requireTrustedOrigin?: boolean;
}

export interface SecurityResult {
  allowed: boolean;
  response?: Response;
  sanitizedBody?: Record<string, unknown>;
  clientIp?: string;
  hasApiKey?: boolean;
}

/**
 * Combined security middleware
 * Applies rate limiting, API key validation, and input sanitization
 */
export async function applySecurity(
  request: Request,
  options: SecurityOptions = {}
): Promise<SecurityResult> {
  const {
    rateLimit = { maxRequests: 100, windowMs: 60000 },
    requireApiKey = false,
    sanitizeBody = true,
    requireTrustedOrigin = false,
  } = options;
  
  const result: SecurityResult = {
    allowed: true,
    clientIp: getClientIdentifier(request),
  };
  
  // Check trusted origin if required
  if (requireTrustedOrigin && !isTrustedRequest(request)) {
    result.allowed = false;
    result.response = createErrorResponse('FORBIDDEN', 'Request origin not trusted');
    return result;
  }
  
  // Apply rate limiting
  if (rateLimit !== false) {
    const rateLimitResult = checkRateLimit(result.clientIp!, rateLimit);
    if (!rateLimitResult.allowed) {
      result.allowed = false;
      result.response = rateLimitResponse(rateLimitResult);
      return result;
    }
  }
  
  // Validate API key if required
  if (requireApiKey) {
    const apiKeyResult = validateApiKey(request);
    if (!apiKeyResult.valid) {
      result.allowed = false;
      result.response = createErrorResponse('UNAUTHORIZED', apiKeyResult.error);
      return result;
    }
    result.hasApiKey = true;
  } else {
    // Check if API key is present (optional)
    result.hasApiKey = validateApiKey(request).valid;
  }
  
  // Sanitize request body
  if (sanitizeBody && ['POST', 'PUT', 'PATCH'].includes(request.method)) {
    try {
      result.sanitizedBody = await sanitizeRequestBody(request.clone()) || undefined;
    } catch {
      // Body parsing failed, continue without sanitized body
    }
  }
  
  return result;
}

/**
 * Quick security check for read-only endpoints
 */
export function applyReadSecurity(request: Request): SecurityResult {
  const clientIp = getClientIdentifier(request);
  const rateLimitResult = checkRateLimit(clientIp);
  
  if (!rateLimitResult.allowed) {
    return {
      allowed: false,
      response: rateLimitResponse(rateLimitResult),
      clientIp,
    };
  }
  
  return {
    allowed: true,
    clientIp,
    hasApiKey: validateApiKey(request).valid,
  };
}

/**
 * Strict security check for write operations
 */
export async function applyWriteSecurity(request: Request): Promise<SecurityResult> {
  return applySecurity(request, {
    rateLimit: STRICT_LIMIT,
    requireApiKey: false, // Set to true in production
    sanitizeBody: true,
  });
}

/**
 * Auth endpoint security (very strict rate limiting)
 */
export function applyAuthSecurity(request: Request): SecurityResult {
  const clientIp = getClientIdentifier(request);
  const rateLimitResult = checkRateLimit(`auth:${clientIp}`, AUTH_LIMIT);
  
  if (!rateLimitResult.allowed) {
    return {
      allowed: false,
      response: rateLimitResponse(rateLimitResult),
      clientIp,
    };
  }
  
  return {
    allowed: true,
    clientIp,
  };
}
