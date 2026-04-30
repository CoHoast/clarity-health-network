/**
 * API Rate Limiting Implementation
 * 
 * Protects against brute force attacks and API abuse
 * Uses in-memory store (replace with Redis in production)
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
  firstRequest: number;
}

// In-memory store for rate limits (replace with Redis in production)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Rate limit configurations
export const RATE_LIMIT_CONFIGS = {
  // Auth endpoints (very strict)
  auth: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: 'Too many authentication attempts. Please try again in 15 minutes.',
  },
  
  // API endpoints (moderate)
  api: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minute
    message: 'Too many requests. Please slow down.',
  },
  
  // Write operations (stricter)
  write: {
    maxRequests: 20,
    windowMs: 60 * 1000, // 1 minute
    message: 'Too many write operations. Please slow down.',
  },
  
  // Provider search (lenient for public use)
  search: {
    maxRequests: 200,
    windowMs: 60 * 1000, // 1 minute
    message: 'Too many searches. Please slow down.',
  },
};

export type RateLimitType = keyof typeof RATE_LIMIT_CONFIGS;

/**
 * Get client identifier for rate limiting
 */
function getClientKey(request: Request, type: RateLimitType): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  // Create a hash of IP + User-Agent for fingerprinting
  const crypto = require('crypto');
  const fingerprint = crypto
    .createHash('sha256')
    .update(`${ip}:${userAgent}`)
    .digest('hex')
    .substring(0, 16);
  
  return `${type}:${fingerprint}`;
}

/**
 * Check if request is within rate limits
 */
export function checkRateLimit(
  request: Request, 
  type: RateLimitType = 'api'
): { allowed: boolean; remaining: number; resetTime: number; error?: string } {
  const config = RATE_LIMIT_CONFIGS[type];
  const key = getClientKey(request, type);
  const now = Date.now();
  
  // Clean up expired entries periodically
  if (Math.random() < 0.01) { // 1% chance to clean up
    cleanupExpiredEntries();
  }
  
  let entry = rateLimitStore.get(key);
  
  // Create new entry if doesn't exist or window has reset
  if (!entry || now >= entry.resetTime) {
    entry = {
      count: 1,
      resetTime: now + config.windowMs,
      firstRequest: now,
    };
    rateLimitStore.set(key, entry);
    
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: entry.resetTime,
    };
  }
  
  // Increment counter
  entry.count++;
  
  if (entry.count > config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
      error: config.message,
    };
  }
  
  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Clean up expired rate limit entries
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now >= entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Create rate limit response
 */
export function createRateLimitResponse(result: { 
  remaining: number; 
  resetTime: number; 
  error?: string;
}): Response {
  const resetInSeconds = Math.ceil((result.resetTime - Date.now()) / 1000);
  
  return new Response(
    JSON.stringify({
      error: result.error || 'Rate limit exceeded',
      retryAfter: resetInSeconds,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Remaining': String(result.remaining),
        'X-RateLimit-Reset': String(Math.floor(result.resetTime / 1000)),
        'Retry-After': String(resetInSeconds),
      },
    }
  );
}

/**
 * Rate limiting middleware for API routes
 */
export function withRateLimit(
  handler: (req: Request) => Promise<Response>,
  type: RateLimitType = 'api'
) {
  return async (req: Request): Promise<Response> => {
    const result = checkRateLimit(req, type);
    
    if (!result.allowed) {
      return createRateLimitResponse(result);
    }
    
    // Add rate limit headers to successful responses
    const response = await handler(req);
    
    response.headers.set('X-RateLimit-Remaining', String(result.remaining));
    response.headers.set('X-RateLimit-Reset', String(Math.floor(result.resetTime / 1000)));
    
    return response;
  };
}

/**
 * Get rate limit status for a client
 */
export function getRateLimitStatus(
  request: Request,
  type: RateLimitType = 'api'
): { remaining: number; resetTime: number; total: number } {
  const config = RATE_LIMIT_CONFIGS[type];
  const key = getClientKey(request, type);
  const entry = rateLimitStore.get(key);
  
  if (!entry || Date.now() >= entry.resetTime) {
    return {
      remaining: config.maxRequests,
      resetTime: Date.now() + config.windowMs,
      total: config.maxRequests,
    };
  }
  
  return {
    remaining: Math.max(0, config.maxRequests - entry.count),
    resetTime: entry.resetTime,
    total: config.maxRequests,
  };
}