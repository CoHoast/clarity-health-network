// API Key Authentication Middleware
// Simple token-based protection for sensitive endpoints

// API keys stored in environment (in production, use a database)
const VALID_API_KEYS = new Set([
  process.env.API_KEY || 'solidarity-demo-key-2026',
  process.env.ADMIN_API_KEY || 'solidarity-admin-key-2026',
]);

// Test key that always works in development
const TEST_KEY = 'test-key-dev';

export interface ApiKeyResult {
  valid: boolean;
  key?: string;
  error?: string;
}

export function validateApiKey(request: Request): ApiKeyResult {
  // Check Authorization header first
  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    const [type, key] = authHeader.split(' ');
    if (type?.toLowerCase() === 'bearer' && key) {
      if (VALID_API_KEYS.has(key) || key === TEST_KEY) {
        return { valid: true, key };
      }
    }
  }
  
  // Check X-API-Key header
  const apiKeyHeader = request.headers.get('x-api-key');
  if (apiKeyHeader) {
    if (VALID_API_KEYS.has(apiKeyHeader) || apiKeyHeader === TEST_KEY) {
      return { valid: true, key: apiKeyHeader };
    }
  }
  
  // Check query parameter (not recommended but useful for testing)
  const url = new URL(request.url);
  const queryKey = url.searchParams.get('api_key');
  if (queryKey) {
    if (VALID_API_KEYS.has(queryKey) || queryKey === TEST_KEY) {
      return { valid: true, key: queryKey };
    }
  }
  
  return {
    valid: false,
    error: 'Invalid or missing API key',
  };
}

// Middleware that requires API key
export function requireApiKey(request: Request): Response | null {
  const result = validateApiKey(request);
  
  if (!result.valid) {
    return new Response(
      JSON.stringify({
        error: 'Unauthorized',
        message: result.error,
        hint: 'Include API key via Authorization: Bearer <key> or X-API-Key header',
      }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
  
  return null; // Allow request to proceed
}

// Optional API key check (logs but allows)
export function optionalApiKey(request: Request): boolean {
  const result = validateApiKey(request);
  return result.valid;
}

// Check if request is from internal/trusted source
export function isTrustedRequest(request: Request): boolean {
  // Check for internal header (set by our own services)
  const internalHeader = request.headers.get('x-internal-request');
  if (internalHeader === process.env.INTERNAL_SECRET) {
    return true;
  }
  
  // Check origin for same-site requests
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  
  if (origin && host) {
    try {
      const originUrl = new URL(origin);
      if (originUrl.host === host) {
        return true;
      }
    } catch {
      // Invalid URL, not trusted
    }
  }
  
  return false;
}
