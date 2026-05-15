import { NextRequest, NextResponse } from 'next/server';

// Simple auth check endpoint outside of /api to avoid middleware issues
export async function GET(request: NextRequest) {
  const adminSession = request.cookies.get('admin_session');
  const isValid = !!(adminSession?.value && adminSession.value.startsWith('admin_'));
  
  return NextResponse.json({ 
    authenticated: isValid,
    session: adminSession?.value ? 'present' : 'missing'
  });
}