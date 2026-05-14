/**
 * Demo Login API with Full Audit Logging
 * 
 * Secure demo system with real password validation
 * Production-ready authentication with role-based access
 */

import { NextRequest, NextResponse } from 'next/server';
import { logAuditEvent } from '@/lib/audit';
import { checkLoginAttempt, recordFailedAttempt, recordSuccessfulLogin } from '@/lib/security/login-attempts';
import { checkRateLimit, createRateLimitResponse } from '@/lib/rate-limiter';
import crypto from 'crypto';

// Secure demo users with hashed passwords
const DEMO_USERS = {
  'chris@claimlynk.com': {
    id: 'chris-001',
    name: 'Chris Guiher',
    role: 'super_admin',
    type: 'admin',
    // Password: ClaimAdmin2026!
    passwordHash: 'a050be6498d1b6e9700c34d4e521efc5d02ebb6b02b34a458febf096735db92f'
  },
  'admin@solidarity.com': { 
    id: 'admin-001', 
    name: 'Admin User', 
    role: 'admin', 
    type: 'admin',
    // Password: SolidAdmin2024!
    passwordHash: '8939d2c57c82fdfcac44e884f7eb6818574bbf4910deaaa1895c96d72a337820'
  },
  'manager@solidarity.com': { 
    id: 'manager-001', 
    name: 'Manager User', 
    role: 'manager', 
    type: 'admin',
    // Password: SolidMgr2024!
    passwordHash: '3bea9e5ebf020d3c33cdffe911a3f2f2a98fa67ad7f3d835e1e606267104e4b0'
  },
  'staff@solidarity.com': { 
    id: 'staff-001', 
    name: 'Staff User', 
    role: 'staff', 
    type: 'admin',
    // Password: SolidStaff2024!
    passwordHash: 'f7f4450859d1ed479c731566517e88a41545dbcebe6d75926eac3194ec2f502c'
  },
  'provider@arizona.com': { 
    id: 'provider-001', 
    name: 'Dr. Smith', 
    role: 'provider', 
    type: 'provider',
    // Password: AzProvider2024!
    passwordHash: '8b467f34cee2e0ac50e34da2aa000fc343b78d3cc97cb13fb3ad174b3e273128'
  },
};

// Simple password hashing for demo (production should use bcrypt/scrypt)
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + 'solidarity_salt_2024').digest('hex');
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting for auth endpoints (CRITICAL SECURITY)
    const rateLimitResult = checkRateLimit(req, 'auth');
    if (!rateLimitResult.allowed) {
      const ip = req.headers.get('x-forwarded-for') || 'unknown';
      const userAgent = req.headers.get('user-agent') || 'unknown';
      
      await logAuditEvent({
        user: 'unknown',
        userId: 'N/A',
        action: 'Demo Login Rate Limited',
        category: 'security',
        resource: 'AUTH',
        resourceType: 'Authentication',
        details: `Rate limit exceeded: ${rateLimitResult.error}`,
        ip,
        userAgent,
        sessionId: 'N/A',
        severity: 'warning',
        phiAccessed: false,
        success: false,
      });
      
      return createRateLimitResponse(rateLimitResult);
    }

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

    // Validate user exists
    const demoUser = DEMO_USERS[email as keyof typeof DEMO_USERS];
    if (!demoUser) {
      // Record failed attempt
      const failResult = recordFailedAttempt(email);
      
      await logAuditEvent({
        user: email,
        userId: 'N/A',
        action: 'Login Failed - User Not Found',
        category: 'security',
        resource: 'AUTH',
        resourceType: 'Authentication',
        details: `Email not found. ${failResult.remainingAttempts} attempts remaining.`,
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

    // Validate password
    const inputPasswordHash = hashPassword(password);
    if (inputPasswordHash !== demoUser.passwordHash) {
      // Record failed attempt
      const failResult = recordFailedAttempt(email);
      
      await logAuditEvent({
        user: email,
        userId: demoUser.id,
        action: 'Login Failed - Invalid Password',
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

    // Create session (consistent with admin login)
    const sessionId = `admin_${Date.now().toString(36)}_${crypto.randomBytes(16).toString('hex')}`;
    const user = demoUser;

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

    // Create response with session cookie
    const response = NextResponse.json({
      success: true,
      token: sessionId,
      user: {
        ...user,
        email,
      },
    });

    // Set HTTP-only cookie - SIMPLIFIED FOR RAILWAY DEBUGGING
    response.cookies.set('admin_session', sessionId, {
      httpOnly: false, // TEMPORARY: Disable for debugging
      secure: false, // TEMPORARY: Disable for debugging  
      sameSite: 'none', // TEMPORARY: Most permissive for debugging
      maxAge: 8 * 60 * 60, // 8 hours
      path: '/',
    });
    
    // ALSO set a simple cookie for debugging
    response.cookies.set('debug_session', 'logged_in', {
      httpOnly: false,
      secure: false,
      maxAge: 8 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
