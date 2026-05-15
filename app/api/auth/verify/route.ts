import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const adminSession = request.cookies.get('admin_session');
  const sessionId = request.cookies.get('sessionId');
  const user = request.cookies.get('user');
  
  // Valid if we have admin_session that starts with "admin_"
  const isValid = !!(adminSession?.value && adminSession.value.startsWith('admin_'));
  
  return NextResponse.json({
    authenticated: isValid,
    session: {
      admin_session: adminSession?.value ? 'present' : 'missing',
      sessionId: sessionId?.value ? 'present' : 'missing', 
      user: user?.value ? decodeURIComponent(user.value) : 'missing'
    }
  });
}