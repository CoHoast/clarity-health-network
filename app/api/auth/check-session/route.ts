import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get all relevant cookies
    const adminSession = request.cookies.get('admin_session');
    const sessionId = request.cookies.get('sessionId');
    const user = request.cookies.get('user');
    
    // Check if we have a valid session
    const isAuthenticated = !!(adminSession?.value && adminSession.value.startsWith('admin_'));
    
    return NextResponse.json({
      authenticated: isAuthenticated,
      cookies: {
        admin_session: adminSession?.value ? 'present' : 'missing',
        sessionId: sessionId?.value ? 'present' : 'missing',
        user: user?.value || 'missing',
      },
      sessionValid: isAuthenticated,
    });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({
      authenticated: false,
      error: 'Session check failed',
    }, { status: 500 });
  }
}