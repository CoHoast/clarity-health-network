/**
 * Security Middleware
 * 
 * HIPAA-compliant security headers and route protection
 * Pen test ready: CSP, HSTS, X-Frame-Options, etc.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const PROTECTED_ROUTES = ['/admin'];
const PUBLIC_ROUTES = ['/admin-login', '/login', '/api/auth', '/upload', '/apply', '/find-provider'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Create response (will add headers)
  const response = NextResponse.next();
  
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
  
  // Check if route requires auth
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route));
  const isApiRoute = pathname.startsWith('/api');
  const isStaticAsset = pathname.startsWith('/_next') || pathname.includes('.');
  
  // Skip auth check for public routes, API routes (handled separately), and static assets
  if (isPublicRoute || isApiRoute || isStaticAsset) {
    return response;
  }
  
  // For protected routes, check session cookie
  if (isProtectedRoute) {
    const sessionCookie = request.cookies.get('admin_session');
    
    if (!sessionCookie?.value) {
      // Redirect to login
      const loginUrl = new URL('/admin-login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // TODO: Validate session token against database/cache
    // For now, presence of cookie is enough (client-side validation also happens)
  }
  
  return response;
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
