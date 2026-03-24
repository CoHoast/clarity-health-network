/**
 * Demo Login API with Full Audit Logging
 * 
 * For demo/testing - accepts any credentials
 * Production will use proper auth (Cognito/Clerk)
 */

import { NextRequest, NextResponse } from 'next/server';
import { logAuditEvent } from '@/lib/audit';
import { checkLoginAttempt, recordFailedAttempt, recordSuccessfulLogin } from '@/lib/security/login-attempts';

// Demo users for testing
const DEMO_USERS = {
  'admin@solidarity.com': { id: 'admin-001', name: 'Admin User', role: 'admin', type: 'admin' },
  'manager@solidarity.com': { id: 'manager-001', name: 'Manager User', role: 'manager', type: 'admin' },
  'staff@solidarity.com': { id: 'staff-001', name: 'Staff User', role: 'staff', type: 'admin' },
  'provider@arizona.com': { id: 'provider-001', name: 'Dr. Smith', role: 'provider', type: 'provider' },
};

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    if (!email) {
      await logAuditEvent({
        user: 'anonymous',
        userId: 'anonymous',
        action: 'Login Failed',
        category: 'security',
        resource: 'AUTH',
        resourceType: 'Authentication',
        details: 'Email is required',
        ip,
        userAgent,
        sessionId: 'N/A',
        severity: 'warning',
        phiAccessed: false,
        success: false,
      });
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if account is locked
    const loginCheck = checkLoginAttempt(email);
    if (!loginCheck.allowed) {
      await logAuditEvent({
        user: email,
        userId: 'N/A',
        action: 'Login Blocked - Account Locked',
        category: 'security',
        resource: 'AUTH',
        resourceType: 'Authentication',
        details: loginCheck.message,
        ip,
        userAgent,
        sessionId: 'N/A',
        severity: 'warning',
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

    // For demo, accept any email with demo users getting special roles
    const demoUser = DEMO_USERS[email as keyof typeof DEMO_USERS];
    
    // Simulate login failure for specific test case
    if (password === 'fail') {
      // Record failed attempt
      const failResult = recordFailedAttempt(email);
      
      await logAuditEvent({
        user: email,
        userId: 'N/A',
        action: 'Login Failed',
        category: 'security',
        resource: 'AUTH',
        resourceType: 'Authentication',
        details: `Invalid password. ${failResult.remainingAttempts} attempts remaining.`,
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

    // Create session
    const sessionId = `sess_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
    const user = demoUser || {
      id: crypto.randomUUID(),
      name: email.split('@')[0],
      role: 'admin',
      type: 'admin',
    };

    // Clear failed login attempts on success
    recordSuccessfulLogin(email);

    // Log successful login
    await logAuditEvent({
      user: email,
      userId: user.id,
      action: 'Login Success',
      category: 'auth',
      resource: 'AUTH',
      resourceType: 'Authentication',
      details: `User logged in successfully - Role: ${user.role}`,
      ip,
      userAgent,
      sessionId,
      severity: 'info',
      phiAccessed: false,
      success: true,
    });

    return NextResponse.json({
      success: true,
      token: sessionId,
      user: {
        ...user,
        email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
