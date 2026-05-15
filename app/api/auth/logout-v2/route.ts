import { NextRequest, NextResponse } from 'next/server';
import { sessionStore } from '../session-store';

export async function GET(request: NextRequest) {
  // Get session cookie
  const sessionCookie = request.cookies.get('session');
  
  if (sessionCookie?.value) {
    // Delete from session store
    sessionStore.delete(sessionCookie.value);
  }
  
  // Redirect to login
  const response = NextResponse.redirect(new URL('/login-v2', request.url));
  
  // Clear session cookie
  response.headers.append(
    'Set-Cookie',
    'session=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax'
  );
  
  return response;
}