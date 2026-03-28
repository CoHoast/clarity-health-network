/**
 * Secure Admin Login API
 * 
 * HIPAA + Pen Test Ready:
 * - Multi-user support with role-based access
 * - Falls back to env vars if no users exist
 * - Rate limiting with lockout
 * - IP allowlisting (optional)
 * - Comprehensive audit logging
 * - Constant-time comparison
 */

import { NextRequest, NextResponse } from 'next/server';
import { logAuditEvent } from '@/lib/audit';
import { checkLoginAttempt, recordFailedAttempt, recordSuccessfulLogin } from '@/lib/security/login-attempts';
import { checkAdminIpAccess } from '@/lib/security/ip-allowlist';
import { verifyCredentials, initializeDefaultAdmin, User } from '@/lib/users';
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
  const userAgent = req.headers.get('user-agent') || 'unknown';
  
  // Check IP allowlist first
  const ipCheck = checkAdminIpAccess(req.headers);
  const ip = ipCheck.ip;
  
  if (!ipCheck.allowed) {
    await logAuditEvent({
      user: 'unknown',
      userId: 'N/A',
      action: 'Admin Login Blocked - IP Not Allowed',
      category: 'security',
      resource: 'ADMIN_AUTH',
      resourceType: 'Authentication',
      details: ipCheck.reason || `IP ${ip} blocked`,
      ip,
      userAgent,
      sessionId: 'N/A',
      severity: 'critical',
      phiAccessed: false,
      success: false,
    });
    return NextResponse.json(
      { error: 'Access denied', message: 'Your IP address is not authorized' },
      { status: 403 }
    );
  }

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

    // Initialize default admin from env vars if no users exist
    initializeDefaultAdmin();
    
    // Try to authenticate against users store first
    let authenticatedUser: User | null = verifyCredentials(email, password);
    
    // If no user found in store, fall back to env vars (legacy support)
    if (!authenticatedUser) {
      const validEmail = process.env.ADMIN_EMAIL;
      const validPasswordHash = process.env.ADMIN_PASSWORD_HASH;
      const validPassword = process.env.ADMIN_PASSWORD;
      
      if (validEmail && (validPasswordHash || validPassword)) {
        const emailMatch = email.toLowerCase() === validEmail.toLowerCase();
        let passwordMatch = false;
        
        if (validPasswordHash) {
          const inputHash = hashPassword(password);
          passwordMatch = constantTimeCompare(inputHash, validPasswordHash);
        } else if (validPassword) {
          passwordMatch = password === validPassword;
        }
        
        if (emailMatch && passwordMatch) {
          // Create a pseudo-user for env-based auth
          authenticatedUser = {
            id: 'env-admin',
            email: validEmail,
            name: 'Administrator',
            role: 'super_admin',
            passwordHash: '',
            passwordSalt: '',
            createdAt: new Date().toISOString(),
            createdBy: 'system',
            mfaEnabled: false,
            active: true,
          };
        }
      }
    }

    if (!authenticatedUser) {
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
      user: authenticatedUser.email,
      userId: authenticatedUser.id,
      action: 'Admin Login Success',
      category: 'auth',
      resource: 'ADMIN_AUTH',
      resourceType: 'Authentication',
      details: `${authenticatedUser.name} (${authenticatedUser.role}) logged in successfully`,
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
        id: authenticatedUser.id,
        email: authenticatedUser.email,
        name: authenticatedUser.name,
        role: authenticatedUser.role,
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
