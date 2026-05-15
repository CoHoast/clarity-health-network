import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function isValidAdminSession(value: string | undefined): boolean {
  return !!value && value.startsWith('admin_');
}

// Simple middleware for admin auth
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
  
  // Protect the legacy admin app with the server-readable HttpOnly cookie.
  // Client-side JavaScript cannot read this cookie, so validation must happen here.
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    const adminSession = request.cookies.get('admin_session');

    if (!isValidAdminSession(adminSession?.value)) {
      const loginUrl = new URL('/admin-login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  // Check if accessing admin-v2 routes
  if (pathname.startsWith('/admin-v2') || pathname.startsWith('/api/admin-v2')) {
    const sessionCookie = request.cookies.get('session');
    
    if (!isValidAdminSession(sessionCookie?.value)) {
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
