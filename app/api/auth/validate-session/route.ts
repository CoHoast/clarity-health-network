import { NextRequest, NextResponse } from 'next/server';
import { sessionStore } from '../session-store';

export async function GET(request: NextRequest) {
  // Get session cookie
  const sessionCookie = request.cookies.get('session');
  
  if (!sessionCookie?.value) {
    return NextResponse.json({ 
      authenticated: false,
      error: 'No session cookie' 
    }, { status: 401 });
  }
  
  // Validate session
  const session = sessionStore.get(sessionCookie.value);
  
  if (!session) {
    return NextResponse.json({ 
      authenticated: false,
      error: 'Invalid or expired session' 
    }, { status: 401 });
  }
  
  return NextResponse.json({
    authenticated: true,
    session: {
      email: session.email,
      name: session.name,
      role: session.role,
      expiresAt: new Date(session.expiresAt).toISOString()
    }
  });
}