import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('admin_session');
    const userCookie = cookieStore.get('admin_user');
    
    const debug = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      headers: {
        host: request.headers.get('host'),
        userAgent: request.headers.get('user-agent'),
        cookie: request.headers.get('cookie'),
      },
      cookies: {
        admin_session: sessionCookie ? {
          value: sessionCookie.value.substring(0, 20) + '...',
          length: sessionCookie.value.length,
          startsWithAdmin: sessionCookie.value.startsWith('admin_'),
        } : null,
        admin_user: userCookie ? {
          value: userCookie.value,
        } : null,
        allCookies: request.cookies.getAll().map(c => ({ name: c.name, hasValue: !!c.value })),
      },
      url: {
        pathname: request.nextUrl.pathname,
        searchParams: request.nextUrl.searchParams.toString(),
      },
    };
    
    return NextResponse.json({
      success: true,
      debug,
      message: 'Session debug info retrieved',
    });
    
  } catch (error) {
    console.error('Debug session error:', error);
    return NextResponse.json({ 
      error: 'Debug failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}