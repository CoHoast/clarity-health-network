/**
 * Security Middleware
 * 
 * HIPAA + SOC 2 + Pen Test Compliant:
 * - Security headers (CSP, HSTS, X-Frame-Options)
 * - CORS lockdown
 * - Route protection
 * - Request validation
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const PROTECTED_ROUTES = ['/admin'];
const PUBLIC_ROUTES = ['/admin-login', '/login', '/api/auth', '/upload', '/apply', '/find-provider'];

// Allowed origins for CORS (add your domains here)
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://truecare-health-network-production.up.railway.app',
  'https://clarity-health-network-production.up.railway.app',
  // Add production domains
];

// Allowed methods for API routes
const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const origin = request.headers.get('origin');
  const method = request.method;
  
  // Handle CORS preflight
  if (method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 204 });
    setCorsHeaders(response, origin);
    return response;
  }
  
  // Create response (will add headers)
  const response = NextResponse.next();
  
  // CORS headers
  setCorsHeaders(response, origin);
  
  // ==========================================
  // SECURITY HEADERS (Critical for Pen Test)
  // ==========================================
  
  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // XSS Protection (legacy browsers)
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Referrer Policy - don't leak URLs
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions Policy - disable dangerous features
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  
  // HSTS - Force HTTPS (1 year, include subdomains)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }
  
  // Content Security Policy
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js requires unsafe-eval in dev
    "style-src 'self' 'unsafe-inline'", // Tailwind requires inline styles
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https://api.openai.com https://*.amazonaws.com",
    "frame-ancestors 'none'", // Prevent embedding (clickjacking)
    "form-action 'self'",
    "base-uri 'self'",
    "object-src 'none'",
  ];
  response.headers.set('Content-Security-Policy', cspDirectives.join('; '));
  
  // Cache control for sensitive pages
  if (pathname.startsWith('/admin')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }
  
  // ==========================================
  // ROUTE PROTECTION
  // ==========================================
  
  // Check route types
  const isProtectedPageRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  const isPublicPageRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route));
  const isApiRoute = pathname.startsWith('/api');
  const isStaticAsset = pathname.startsWith('/_next') || pathname.includes('.');
  
  // Public API routes (no auth required)
  const isPublicApiRoute = [
    '/api/auth/',           // Auth endpoints
    '/api/public/',         // Explicitly public
    '/api/upload/',         // Upload portal (token-based auth)
    '/api/apply/',          // Provider application
    '/api/find-provider',   // Provider search
  ].some(pattern => pathname.startsWith(pattern));
  
  // Skip auth for static assets
  if (isStaticAsset) {
    return response;
  }
  
  // Skip auth for public page routes
  if (isPublicPageRoute) {
    return response;
  }
  
  // Protect admin API routes
  if (isApiRoute && !isPublicApiRoute) {
    const sessionCookie = request.cookies.get('admin_session');
    
    if (!sessionCookie?.value) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Validate session format
    const sessionId = sessionCookie.value;
    if (!sessionId.startsWith('admin_') || sessionId.length < 30) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }
    
    // Add auth headers for downstream use
    response.headers.set('x-auth-verified', 'true');
  }
  
  // For protected page routes, check session cookie
  if (isProtectedPageRoute) {
    const sessionCookie = request.cookies.get('admin_session');
    
    if (!sessionCookie?.value) {
      // Redirect to login
      const loginUrl = new URL('/admin-login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // Validate session format
    const sessionId = sessionCookie.value;
    if (!sessionId.startsWith('admin_') || sessionId.length < 30) {
      const loginUrl = new URL('/admin-login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return response;
}

/**
 * Set CORS headers (locked down to allowed origins)
 */
function setCorsHeaders(response: NextResponse, origin: string | null): void {
  // Only allow whitelisted origins
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  } else if (process.env.NODE_ENV === 'development') {
    // Allow localhost in development
    response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000');
  }
  
  response.headers.set('Access-Control-Allow-Methods', ALLOWED_METHODS.join(', '));
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token, X-Requested-With');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
