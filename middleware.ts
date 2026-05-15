import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple middleware for v2 auth
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Public routes that don't need auth
  const isPublicRoute = [
    '/login-v2',
    '/api/auth/admin-login-v2',
    '/api/auth/test-cookies',
    '/api/auth/validate-session',
    '/_next',
    '/favicon.ico',
  ].some(path => pathname.startsWith(path));
  
  if (isPublicRoute) {
    return NextResponse.next();
  }
  
  // Check if accessing admin-v2 routes
  if (pathname.startsWith('/admin-v2') || pathname.startsWith('/api/admin-v2')) {
    const sessionCookie = request.cookies.get('session');
    
    if (!sessionCookie?.value || !sessionCookie.value.startsWith('admin_')) {
      // Redirect to login
      const loginUrl = new URL('/login-v2', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  // Add security headers
  const response = NextResponse.next();
  
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};