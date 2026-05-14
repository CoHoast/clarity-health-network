/**
 * Session Validation API
 * 
 * Checks if session is valid and hasn't timed out
 * Returns remaining time for timeout warnings
 */

import { NextRequest, NextResponse } from 'next/server';
import { logAuditEvent } from '@/lib/audit';

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const userAgent = req.headers.get('user-agent') || 'unknown';
  
  try {
    // Check admin session cookie first
    let sessionId = req.cookies.get('admin_session')?.value;
    
    // Railway fallback: check Authorization header if no cookie
    if (!sessionId) {
      const authHeader = req.headers.get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        sessionId = authHeader.substring(7);
      }
    }
    
    if (!sessionId) {
      return NextResponse.json(
        { 
          authenticated: false, 
          error: 'No session found' 
        }, 
        { status: 401 }
      );
    }

    // Basic session validation - more lenient for Railway
    if (!sessionId || sessionId.length < 20) {
      await logAuditEvent({
        user: 'unknown',
        userId: 'unknown',
        action: 'Session Check Failed - Invalid Format',
        category: 'security',
        resource: 'SESSION',
        resourceType: 'Authentication',
        details: 'Invalid session ID format',
        ip,
        userAgent,
        sessionId: 'invalid',
        severity: 'warning',
        phiAccessed: false,
        success: false,
      });

      return NextResponse.json(
        { 
          authenticated: false, 
          error: 'Invalid session format' 
        }, 
        { status: 401 }
      );
    }

    // For now, assume session is valid if format is correct
    // In production, this would check against session store (Redis/DB)
    const now = Date.now();
    const createdTime = parseInt(sessionId.split('_')[1], 36) * 1000;
    const sessionAge = now - createdTime;
    
    // Session expires after 8 hours (28800000 ms)
    const SESSION_TIMEOUT = 8 * 60 * 60 * 1000; // 8 hours
    const IDLE_TIMEOUT = 30 * 60 * 1000; // 30 minutes
    
    if (sessionAge > SESSION_TIMEOUT) {
      await logAuditEvent({
        user: 'unknown',
        userId: 'unknown',
        action: 'Session Expired',
        category: 'auth',
        resource: 'SESSION',
        resourceType: 'Authentication',
        details: `Session expired after ${Math.round(sessionAge / (60 * 1000))} minutes`,
        ip,
        userAgent,
        sessionId,
        severity: 'info',
        phiAccessed: false,
        success: false,
      });

      return NextResponse.json(
        { 
          authenticated: false, 
          error: 'Session expired',
          expired: true
        }, 
        { status: 401 }
      );
    }

    // Calculate remaining time
    const remainingMs = SESSION_TIMEOUT - sessionAge;
    const remainingMinutes = Math.floor(remainingMs / (60 * 1000));
    const showWarning = remainingMinutes <= 5;

    return NextResponse.json({
      authenticated: true,
      sessionId,
      remainingMinutes,
      showWarning,
      maxAge: SESSION_TIMEOUT,
      idleTimeout: IDLE_TIMEOUT,
    });

  } catch (error) {
    await logAuditEvent({
      user: 'unknown',
      userId: 'unknown', 
      action: 'Session Check Error',
      category: 'security',
      resource: 'SESSION',
      resourceType: 'Authentication',
      details: error instanceof Error ? error.message : 'Unknown error',
      ip,
      userAgent,
      sessionId: 'error',
      severity: 'critical',
      phiAccessed: false,
      success: false,
    });

    return NextResponse.json(
      { error: 'Session validation error' }, 
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const userAgent = req.headers.get('user-agent') || 'unknown';
  
  try {
    const { token } = await req.json();
    
    // Validate token from localStorage (Railway fallback)
    if (!token || token.length < 20) {
      return NextResponse.json(
        { 
          authenticated: false, 
          error: 'Invalid token' 
        }, 
        { status: 401 }
      );
    }
    
    // For now, accept any properly formatted token
    // In production, this would validate against a session store
    const now = Date.now();
    const tokenTime = parseInt(token.split('_')[1], 36) * 1000;
    const sessionAge = now - tokenTime;
    const SESSION_TIMEOUT = 8 * 60 * 60 * 1000; // 8 hours
    
    if (sessionAge > SESSION_TIMEOUT) {
      return NextResponse.json(
        { 
          authenticated: false, 
          error: 'Session expired',
          expired: true
        }, 
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      sessionId: token,
      remainingMinutes: Math.floor((SESSION_TIMEOUT - sessionAge) / (60 * 1000)),
      showWarning: sessionAge > (SESSION_TIMEOUT - 5 * 60 * 1000),
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Token validation error' }, 
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const userAgent = req.headers.get('user-agent') || 'unknown';
  const sessionCookie = req.cookies.get('admin_session');

  await logAuditEvent({
    user: 'user',
    userId: 'user',
    action: 'Manual Logout',
    category: 'auth',
    resource: 'SESSION',
    resourceType: 'Authentication',
    details: 'User manually logged out',
    ip,
    userAgent,
    sessionId: sessionCookie?.value || 'none',
    severity: 'info',
    phiAccessed: false,
    success: true,
  });

  // Clear session cookie
  const response = NextResponse.json({ success: true });
  response.cookies.delete('admin_session');

  return response;
}