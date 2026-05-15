import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Get all headers
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });
  
  // Get all cookies
  const cookies: Record<string, string> = {};
  request.cookies.getAll().forEach(cookie => {
    cookies[cookie.name] = cookie.value;
  });
  
  return NextResponse.json({
    url: request.url,
    host: request.headers.get('host'),
    origin: request.headers.get('origin'),
    referer: request.headers.get('referer'),
    forwarded: {
      for: request.headers.get('x-forwarded-for'),
      host: request.headers.get('x-forwarded-host'),
      proto: request.headers.get('x-forwarded-proto'),
    },
    cookies,
    cookieHeader: request.headers.get('cookie'),
    userAgent: request.headers.get('user-agent'),
    // Railway specific headers
    railwayHeaders: {
      'x-railway-request-id': request.headers.get('x-railway-request-id'),
      'x-railway-environment': request.headers.get('x-railway-environment'),
    }
  });
}

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ 
    message: 'Testing cookie setting',
    timestamp: new Date().toISOString() 
  });
  
  // Try different cookie configurations
  response.cookies.set('test_basic', 'value1', {
    maxAge: 60 * 60, // 1 hour
  });
  
  response.cookies.set('test_all_options', 'value2', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 60 * 60,
    path: '/',
  });
  
  response.cookies.set('test_strict', 'value3', {
    httpOnly: false,
    secure: false,
    sameSite: 'strict',
    maxAge: 60 * 60,
    path: '/',
  });
  
  response.cookies.set('test_none', 'value4', {
    httpOnly: false,
    secure: true,
    sameSite: 'none',
    maxAge: 60 * 60,
    path: '/',
  });
  
  return response;
}