/**
 * Demo Login API with Full Audit Logging
 * 
 * For demo/testing - accepts any credentials
 * Production will use proper auth (Cognito/Clerk)
 */

import { NextRequest, NextResponse } from 'next/server';
import { logAudit } from '@/lib/audit';

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

    if (!email) {
      await logAudit({
        action: 'login_failure',
        resource: 'session',
        userType: 'anonymous',
        success: false,
        errorMessage: 'Email is required',
        details: { attemptedEmail: null },
      });
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // For demo, accept any email with demo users getting special roles
    const demoUser = DEMO_USERS[email as keyof typeof DEMO_USERS];
    
    // Simulate login failure for specific test case
    if (password === 'fail') {
      await logAudit({
        action: 'login_failure',
        resource: 'session',
        userType: 'anonymous',
        userEmail: email,
        success: false,
        errorMessage: 'Invalid password',
        details: { attemptedEmail: email, reason: 'invalid_password' },
      });
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Create session
    const sessionId = crypto.randomUUID();
    const user = demoUser || {
      id: crypto.randomUUID(),
      name: email.split('@')[0],
      role: 'admin',
      type: 'admin',
    };

    // Log successful login
    await logAudit({
      userId: user.id,
      userEmail: email,
      userType: user.type as any,
      userRole: user.role,
      action: 'login_success',
      resource: 'session',
      resourceId: sessionId,
      details: { 
        email,
        role: user.role,
        isDemoUser: !!demoUser,
      },
    });

    // Create response with session cookie (demo token)
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email,
        name: user.name,
        role: user.role,
      },
      sessionId,
      message: 'Login successful',
    });

    // Set demo session cookie (in production, use proper JWT/session)
    response.cookies.set('demo_session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8, // 8 hour session timeout (HIPAA compliant)
    });

    response.cookies.set('demo_user', JSON.stringify({
      id: user.id,
      email,
      name: user.name,
      role: user.role,
    }), {
      httpOnly: false, // Accessible by client for display
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error) {
    await logAudit({
      action: 'login_failure',
      resource: 'session',
      userType: 'anonymous',
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
    });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
