/**
 * API Route Authentication
 * 
 * Middleware to protect API routes from unauthorized access
 * All admin API routes MUST use this
 */

import { NextRequest, NextResponse } from 'next/server';
import { logAuditEvent } from '@/lib/audit';

interface AuthResult {
  authenticated: boolean;
  userId?: string;
  email?: string;
  role?: string;
  error?: string;
}

/**
 * Verify admin session from request
 */
export function verifyAdminSession(request: NextRequest): AuthResult {
  // Check for session cookie
  const sessionCookie = request.cookies.get('admin_session');
  
  if (!sessionCookie?.value) {
    return { authenticated: false, error: 'No session' };
  }
  
  // Validate session format (basic check)
  const sessionId = sessionCookie.value;
  if (!sessionId.startsWith('admin_') || sessionId.length < 30) {
    return { authenticated: false, error: 'Invalid session format' };
  }
  
  // TODO: In production, validate against session store/database
  // For now, presence of valid-format cookie is enough
  // (The middleware already checks this, but double-checking here)
  
  return {
    authenticated: true,
    userId: 'admin',
    email: 'admin',
    role: 'admin',
  };
}

/**
 * Require admin authentication for API route
 * Returns error response if not authenticated
 */
export async function requireAdminAuth(
  request: NextRequest
): Promise<{ auth: AuthResult; errorResponse?: NextResponse }> {
  const auth = verifyAdminSession(request);
  
  if (!auth.authenticated) {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    await logAuditEvent({
      user: 'anonymous',
      userId: 'anonymous',
      action: 'API Access Denied',
      category: 'security',
      resource: request.nextUrl.pathname,
      resourceType: 'API',
      details: `Unauthenticated request to ${request.nextUrl.pathname}`,
      ip,
      userAgent,
      sessionId: 'N/A',
      severity: 'warning',
      phiAccessed: false,
      success: false,
    });
    
    return {
      auth,
      errorResponse: NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      ),
    };
  }
  
  return { auth };
}

/**
 * Higher-order function to wrap API handlers with auth
 */
export function withAdminAuth<T extends (request: NextRequest, ...args: any[]) => Promise<NextResponse>>(
  handler: T
): T {
  return (async (request: NextRequest, ...args: any[]) => {
    const { auth, errorResponse } = await requireAdminAuth(request);
    
    if (errorResponse) {
      return errorResponse;
    }
    
    // Add auth info to request headers for downstream use
    request.headers.set('x-auth-user-id', auth.userId || '');
    request.headers.set('x-auth-email', auth.email || '');
    request.headers.set('x-auth-role', auth.role || '');
    
    return handler(request, ...args);
  }) as T;
}

/**
 * Check if route should be public (no auth required)
 */
export function isPublicRoute(pathname: string): boolean {
  const publicPatterns = [
    '/api/auth/',           // Auth endpoints
    '/api/public/',         // Explicitly public endpoints
    '/api/upload/',         // Upload portal (token-based)
    '/api/apply/',          // Provider application (public)
    '/api/find-provider',   // Provider search (public)
  ];
  
  return publicPatterns.some(pattern => pathname.startsWith(pattern));
}

/**
 * API rate limit check with auth context
 */
export function getApiRateLimitKey(request: NextRequest, auth: AuthResult): string {
  if (auth.authenticated) {
    return `api:user:${auth.userId}`;
  }
  
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown';
  return `api:ip:${ip}`;
}
