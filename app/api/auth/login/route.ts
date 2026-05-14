import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { logAuditEvent } from '@/lib/audit';

// Shared login credentials (can be used by multiple people)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'TrueCare2026!',  // Strong password
};

// Alternative credentials for easier access
const ALT_CREDENTIALS = {
  username: 'truecare',
  password: 'network2026',   // Simpler password
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;
    
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Validate credentials
    const isValidAdmin = username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password;
    const isValidAlt = username === ALT_CREDENTIALS.username && password === ALT_CREDENTIALS.password;
    
    if (!isValidAdmin && !isValidAlt) {
      // Log failed login attempt
      await logAuditEvent({
        user: username || 'unknown',
        userId: username || 'unknown',
        action: 'Login Attempt',
        category: 'authentication',
        resource: 'LOGIN',
        resourceType: 'Authentication',
        details: `Failed login attempt from ${ip}`,
        ip,
        userAgent,
        sessionId: 'login-attempt',
        severity: 'warning',
        phiAccessed: false,
        success: false,
      });
      
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }
    
    // Generate session ID
    const sessionId = `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000); // 8 hours
    
    // Set secure session cookie
    const cookieStore = await cookies();
    cookieStore.set('admin_session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: expiresAt,
      path: '/',
    });
    
    // Also set a user info cookie for display purposes
    cookieStore.set('admin_user', username, {
      httpOnly: false, // Allow client-side access for UI
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: expiresAt,
      path: '/',
    });
    
    // Log successful login
    await logAuditEvent({
      user: username,
      userId: username,
      action: 'Login Success',
      category: 'authentication',
      resource: 'LOGIN',
      resourceType: 'Authentication',
      details: `Successful login from ${ip}`,
      ip,
      userAgent,
      sessionId,
      severity: 'info',
      phiAccessed: false,
      success: true,
    });
    
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        username,
        role: 'admin',
        sessionExpires: expiresAt.toISOString(),
      },
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}