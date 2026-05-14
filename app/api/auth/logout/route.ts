import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { logAuditEvent } from '@/lib/audit';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const cookieStore = await cookies();
    
    // Get current session info for logging
    const sessionCookie = cookieStore.get('admin_session');
    const userCookie = cookieStore.get('admin_user');
    
    // Clear session cookies
    cookieStore.delete('admin_session');
    cookieStore.delete('admin_user');
    
    // Log logout event
    await logAuditEvent({
      user: userCookie?.value || 'unknown',
      userId: userCookie?.value || 'unknown',
      action: 'Logout',
      category: 'authentication',
      resource: 'LOGOUT',
      resourceType: 'Authentication',
      details: `User logged out from ${ip}`,
      ip,
      userAgent,
      sessionId: sessionCookie?.value || 'unknown',
      severity: 'info',
      phiAccessed: false,
      success: true,
    });
    
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
    
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}