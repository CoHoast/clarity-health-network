import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    
    // Get all cookies
    const allCookies = cookieStore.getAll();
    const cookieData: Record<string, string | undefined> = {};
    
    allCookies.forEach(cookie => {
      cookieData[cookie.name] = cookie.value;
    });
    
    // Specific checks
    const adminSession = cookieStore.get('admin_session');
    const sessionId = cookieStore.get('sessionId');
    const userCookie = cookieStore.get('user');
    
    return NextResponse.json({
      success: true,
      cookies: cookieData,
      checks: {
        hasAdminSession: !!adminSession,
        hasSessionId: !!sessionId,
        hasUserCookie: !!userCookie,
        adminSessionValue: adminSession?.value?.substring(0, 20) + '...', // Truncate for security
        userValue: userCookie?.value
      },
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        railwayEnv: process.env.RAILWAY_ENVIRONMENT_NAME,
        railwayProject: process.env.RAILWAY_PROJECT_NAME
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to check session',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}