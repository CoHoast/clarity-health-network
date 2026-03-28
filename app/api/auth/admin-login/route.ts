/**
 * Secure Admin Login API
 * 
 * Validates credentials against environment variables
 * Implements rate limiting and audit logging
 */

import { NextRequest, NextResponse } from 'next/server';
import { logAuditEvent } from '@/lib/audit';
import { checkLoginAttempt, recordFailedAttempt, recordSuccessfulLogin } from '@/lib/security/login-attempts';
import crypto from 'crypto';

// Hash password for comparison (constant-time comparison to prevent timing attacks)
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  const userAgent = req.headers.get('user-agent') || 'unknown';

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      await logAuditEvent({
        user: email || 'anonymous',
        userId: 'N/A',
        action: 'Admin Login Failed',
        category: 'security',
        resource: 'ADMIN_AUTH',
        resourceType: 'Authentication',
        details: 'Missing email or password',
        ip,
        userAgent,
        sessionId: 'N/A',
        severity: 'warning',
        phiAccessed: false,
        success: false,
      });
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Check if account is locked
    const loginCheck = checkLoginAttempt(email);
    if (!loginCheck.allowed) {
      await logAuditEvent({
        user: email,
        userId: 'N/A',
        action: 'Admin Login Blocked - Account Locked',
        category: 'security',
        resource: 'ADMIN_AUTH',
        resourceType: 'Authentication',
        details: loginCheck.message,
        ip,
        userAgent,
        sessionId: 'N/A',
        severity: 'critical',
        phiAccessed: false,
        success: false,
      });
      return NextResponse.json({ 
        error: 'Account locked',
        message: loginCheck.message,
        locked: true,
        lockedUntil: loginCheck.lockedUntil,
      }, { status: 429 });
    }

    // Get credentials from environment variables
    const validEmail = process.env.ADMIN_EMAIL;
    const validPasswordHash = process.env.ADMIN_PASSWORD_HASH;
    const validPassword = process.env.ADMIN_PASSWORD; // Plain text fallback for initial setup

    if (!validEmail || (!validPasswordHash && !validPassword)) {
      console.error('Admin credentials not configured in environment variables');
      await logAuditEvent({
        user: email,
        userId: 'N/A',
        action: 'Admin Login Failed - Server Misconfigured',
        category: 'security',
        resource: 'ADMIN_AUTH',
        resourceType: 'Authentication',
        details: 'Admin credentials not configured',
        ip,
        userAgent,
        sessionId: 'N/A',
        severity: 'critical',
        phiAccessed: false,
        success: false,
      });
      return NextResponse.json({ error: 'Authentication unavailable' }, { status: 500 });
    }

    // Validate email (case-insensitive)
    const emailMatch = email.toLowerCase() === validEmail.toLowerCase();
    
    // Validate password (check hash first, then plain text)
    let passwordMatch = false;
    if (validPasswordHash) {
      const inputHash = hashPassword(password);
      passwordMatch = constantTimeCompare(inputHash, validPasswordHash);
    } else if (validPassword) {
      // Plain text comparison (only use for initial setup, then switch to hash)
      passwordMatch = password === validPassword;
    }

    if (!emailMatch || !passwordMatch) {
      // Record failed attempt
      const failResult = recordFailedAttempt(email);
      
      await logAuditEvent({
        user: email,
        userId: 'N/A',
        action: 'Admin Login Failed - Invalid Credentials',
        category: 'security',
        resource: 'ADMIN_AUTH',
        resourceType: 'Authentication',
        details: `Invalid credentials. ${failResult.remainingAttempts} attempts remaining.`,
        ip,
        userAgent,
        sessionId: 'N/A',
        severity: 'warning',
        phiAccessed: false,
        success: false,
      });

      return NextResponse.json({ 
        error: 'Invalid credentials',
        remainingAttempts: failResult.remainingAttempts,
        message: failResult.message,
        locked: !failResult.allowed,
        lockedUntil: failResult.lockedUntil,
      }, { status: 401 });
    }

    // Create secure session token
    const sessionId = `admin_${Date.now().toString(36)}_${crypto.randomBytes(16).toString('hex')}`;
    const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000); // 8 hours

    // Clear failed login attempts on success
    recordSuccessfulLogin(email);

    // Log successful login
    await logAuditEvent({
      user: email,
      userId: 'admin',
      action: 'Admin Login Success',
      category: 'auth',
      resource: 'ADMIN_AUTH',
      resourceType: 'Authentication',
      details: 'Administrator logged in successfully',
      ip,
      userAgent,
      sessionId,
      severity: 'info',
      phiAccessed: false,
      success: true,
    });

    // Set secure HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      token: sessionId,
      expiresAt: expiresAt.toISOString(),
      user: {
        id: 'admin',
        email: email,
        name: 'Administrator',
        role: 'admin',
      },
    });

    // Set HTTP-only cookie for added security
    response.cookies.set('admin_session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 8 * 60 * 60, // 8 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    await logAuditEvent({
      user: 'unknown',
      userId: 'N/A',
      action: 'Admin Login Error',
      category: 'security',
      resource: 'ADMIN_AUTH',
      resourceType: 'Authentication',
      details: error instanceof Error ? error.message : 'Unknown error',
      ip,
      userAgent,
      sessionId: 'N/A',
      severity: 'critical',
      phiAccessed: false,
      success: false,
    });
    return NextResponse.json({ error: 'Authentication error' }, { status: 500 });
  }
}
