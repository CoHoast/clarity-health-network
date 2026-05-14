import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { logAuditEvent } from '@/lib/audit';

// Secure shared login credentials 
const ADMIN_CREDENTIALS = {
  username: 'SHNuser2026',
  password: 'PPO#Net123!',
};

// Alternative secure credentials (backup)
const ALT_CREDENTIALS = {
  username: 'ppo-manager',
  password: 'PPO#Mgr@Secure$2026!',   // 19 chars, complex
};

// Rate limiting for failed attempts (in-memory for now)
const failedAttempts = new Map<string, { count: number, lastAttempt: number, lockedUntil?: number }>();

function checkRateLimit(ip: string): { allowed: boolean, remainingAttempts?: number, lockedUntil?: number } {
  const now = Date.now();
  const attempts = failedAttempts.get(ip) || { count: 0, lastAttempt: now };
  
  // Reset attempts after 15 minutes
  if (now - attempts.lastAttempt > 15 * 60 * 1000) {
    attempts.count = 0;
  }
  
  // Check if locked out (5 failed attempts = 15 minute lockout)
  if (attempts.lockedUntil && now < attempts.lockedUntil) {
    return { 
      allowed: false, 
      lockedUntil: attempts.lockedUntil 
    };
  }
  
  // Allow if under limit
  if (attempts.count < 5) {
    return { 
      allowed: true, 
      remainingAttempts: 5 - attempts.count 
    };
  }
  
  // Lock out after 5 attempts
  attempts.lockedUntil = now + 15 * 60 * 1000; // 15 minutes
  failedAttempts.set(ip, attempts);
  
  return { 
    allowed: false, 
    lockedUntil: attempts.lockedUntil 
  };
}

function recordFailedAttempt(ip: string) {
  const now = Date.now();
  const attempts = failedAttempts.get(ip) || { count: 0, lastAttempt: now };
  attempts.count++;
  attempts.lastAttempt = now;
  failedAttempts.set(ip, attempts);
}

function clearFailedAttempts(ip: string) {
  failedAttempts.delete(ip);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;
    
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Check rate limiting first
    const rateLimitResult = checkRateLimit(ip);
    if (!rateLimitResult.allowed) {
      const lockoutMinutes = rateLimitResult.lockedUntil ? 
        Math.ceil((rateLimitResult.lockedUntil - Date.now()) / (60 * 1000)) : 0;
      
      await logAuditEvent({
        user: username || 'unknown',
        userId: username || 'unknown',
        action: 'Login Blocked - Rate Limited',
        category: 'security',
        resource: 'LOGIN',
        resourceType: 'Authentication',
        details: `Rate limit exceeded from ${ip}. Locked for ${lockoutMinutes} minutes.`,
        ip,
        userAgent,
        sessionId: 'rate-limited',
        severity: 'warning',
        phiAccessed: false,
        success: false,
      });
      
      return NextResponse.json(
        { 
          error: `Too many failed attempts. Account locked for ${lockoutMinutes} minutes.`,
          lockedUntil: rateLimitResult.lockedUntil 
        },
        { status: 429 }
      );
    }
    
    // Validate credentials
    const isValidAdmin = username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password;
    const isValidAlt = username === ALT_CREDENTIALS.username && password === ALT_CREDENTIALS.password;
    
    if (!isValidAdmin && !isValidAlt) {
      // Record failed attempt
      recordFailedAttempt(ip);
      // Log failed login attempt
      await logAuditEvent({
        user: username || 'unknown',
        userId: username || 'unknown',
        action: 'Login Failed',
        category: 'security',
        resource: 'LOGIN',
        resourceType: 'Authentication',
        details: `Failed login attempt from ${ip}. ${rateLimitResult.remainingAttempts || 0} attempts remaining.`,
        ip,
        userAgent,
        sessionId: 'failed-login',
        severity: 'warning',
        phiAccessed: false,
        success: false,
      });
      
      return NextResponse.json(
        { 
          error: 'Invalid username or password',
          remainingAttempts: rateLimitResult.remainingAttempts || 0
        },
        { status: 401 }
      );
    }
    
    // Clear failed attempts on successful login
    clearFailedAttempts(ip);
    
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
      category: 'auth',
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