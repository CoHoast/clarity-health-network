/**
 * User Management API
 * 
 * GET - List all users
 * POST - Create new user
 */

import { NextRequest, NextResponse } from 'next/server';
import { listUsers, createUser, getUserStats, UserRole } from '@/lib/users';
import { logAuditEvent } from '@/lib/audit';
import { validatePassword } from '@/lib/security/password';

// GET - List all users
export async function GET(request: NextRequest) {
  try {
    const users = listUsers();
    const stats = getUserStats();
    
    return NextResponse.json({
      users,
      stats,
    });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST - Create new user
export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  try {
    const body = await request.json();
    const { email, name, password, role } = body;
    
    // Validate required fields
    if (!email || !name || !password || !role) {
      return NextResponse.json(
        { error: 'Email, name, password, and role are required' },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: passwordValidation.errors[0], errors: passwordValidation.errors },
        { status: 400 }
      );
    }
    
    // Validate role
    const validRoles: UserRole[] = ['super_admin', 'admin', 'manager', 'staff', 'viewer'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }
    
    // Get current user from session (for audit)
    const createdBy = request.headers.get('x-auth-email') || 'admin';
    
    // Create user
    const user = createUser({
      email,
      name,
      password,
      role,
      createdBy,
    });
    
    // Audit log
    await logAuditEvent({
      user: createdBy,
      userId: createdBy,
      action: 'User Created',
      category: 'user_management',
      resource: user.id,
      resourceType: 'User',
      details: `Created user ${email} with role ${role}`,
      ip,
      userAgent,
      sessionId: 'N/A',
      severity: 'info',
      phiAccessed: false,
      success: true,
    });
    
    // Return user without sensitive data
    const { passwordHash, passwordSalt, mfaSecret, ...safeUser } = user;
    
    return NextResponse.json({
      success: true,
      user: safeUser,
    });
  } catch (error: any) {
    console.error('Error creating user:', error);
    
    if (error.message === 'Email already exists') {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
