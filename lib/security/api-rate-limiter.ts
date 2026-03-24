/**
 * Rate Limiting
 * 
 * Prevents API abuse with configurable limits per endpoint.
 * Uses in-memory store (for production, use Redis).
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store (for demo - use Redis in production)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Rate limit configurations by endpoint type
export const RATE_LIMITS = {
  // Authentication endpoints - strict limits
  login: { maxRequests: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts per 15 min
  passwordReset: { maxRequests: 3, windowMs: 60 * 60 * 1000 }, // 3 per hour
  
  // API endpoints - moderate limits
  api: { maxRequests: 100, windowMs: 60 * 1000 }, // 100 per minute
  import: { maxRequests: 10, windowMs: 60 * 60 * 1000 }, // 10 imports per hour
  export: { maxRequests: 20, windowMs: 60 * 60 * 1000 }, // 20 exports per hour
  
  // Bulk operations - strict limits
  bulkDelete: { maxRequests: 5, windowMs: 60 * 60 * 1000 }, // 5 per hour
  bulkUpdate: { maxRequests: 10, windowMs: 60 * 60 * 1000 }, // 10 per hour
  
  // General - permissive
  general: { maxRequests: 1000, windowMs: 60 * 1000 }, // 1000 per minute
};

export type RateLimitType = keyof typeof RATE_LIMITS;

export interface ApiRateLimitResult {
  allowed: boolean;
  remaining: number;
  resetIn: number; // milliseconds until reset
  limit: number;
}

/**
 * Check rate limit for a given key and type
 */
export function checkRateLimit(
  key: string, // Usually IP address or user ID
  type: RateLimitType = 'general'
): ApiRateLimitResult {
  const config = RATE_LIMITS[type];
  const storeKey = `${type}:${key}`;
  const now = Date.now();
  
  // Clean up expired entries periodically
  if (Math.random() < 0.01) { // 1% chance to clean up
    cleanupExpiredEntries();
  }
  
  let entry = rateLimitStore.get(storeKey);
  
  // If no entry or window expired, create new entry
  if (!entry || now > entry.resetAt) {
    entry = {
      count: 1,
      resetAt: now + config.windowMs,
    };
    rateLimitStore.set(storeKey, entry);
    
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetIn: config.windowMs,
      limit: config.maxRequests,
    };
  }
  
  // Increment count
  entry.count++;
  rateLimitStore.set(storeKey, entry);
  
  const allowed = entry.count <= config.maxRequests;
  
  return {
    allowed,
    remaining: Math.max(0, config.maxRequests - entry.count),
    resetIn: entry.resetAt - now,
    limit: config.maxRequests,
  };
}

/**
 * Reset rate limit for a key (e.g., after successful login)
 */
export function resetRateLimit(key: string, type: RateLimitType): void {
  const storeKey = `${type}:${key}`;
  rateLimitStore.delete(storeKey);
}

/**
 * Get current rate limit status without incrementing
 */
export function getRateLimitStatus(key: string, type: RateLimitType): ApiRateLimitResult {
  const config = RATE_LIMITS[type];
  const storeKey = `${type}:${key}`;
  const now = Date.now();
  
  const entry = rateLimitStore.get(storeKey);
  
  if (!entry || now > entry.resetAt) {
    return {
      allowed: true,
      remaining: config.maxRequests,
      resetIn: 0,
      limit: config.maxRequests,
    };
  }
  
  return {
    allowed: entry.count < config.maxRequests,
    remaining: Math.max(0, config.maxRequests - entry.count),
    resetIn: entry.resetAt - now,
    limit: config.maxRequests,
  };
}

/**
 * Clean up expired entries to prevent memory leaks
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Rate limit middleware helper for API routes
 */
export function rateLimitResponse(result: ApiRateLimitResult): Response | null {
  if (result.allowed) return null;
  
  return new Response(
    JSON.stringify({
      error: 'Too many requests',
      message: `Rate limit exceeded. Try again in ${Math.ceil(result.resetIn / 1000)} seconds.`,
      retryAfter: Math.ceil(result.resetIn / 1000),
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Limit': String(result.limit),
        'X-RateLimit-Remaining': String(result.remaining),
        'X-RateLimit-Reset': String(Math.ceil(result.resetIn / 1000)),
        'Retry-After': String(Math.ceil(result.resetIn / 1000)),
      },
    }
  );
}
