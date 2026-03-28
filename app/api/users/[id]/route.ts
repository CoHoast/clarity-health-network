/**
 * Individual User Management API
 * 
 * GET - Get user details
 * PUT - Update user
 * DELETE - Deactivate user
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUserById, updateUser, deleteUser, changePassword, UserRole } from '@/lib/users';
import { logAuditEvent } from '@/lib/audit';
import { validatePassword } from '@/lib/security/password';

// GET - Get user details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = getUserById(id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Return without sensitive data
    const { passwordHash, passwordSalt, mfaSecret, ...safeUser } = user;
    
    return NextResponse.json({ user: safeUser });
  } catch (error: any) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// PUT - Update user
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, role, active, newPassword } = body;
    
    const existingUser = getUserById(id);
    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    const currentUser = request.headers.get('x-auth-email') || 'admin';
    
    // Validate role if provided
    if (role) {
      const validRoles: UserRole[] = ['super_admin', 'admin', 'manager', 'staff', 'viewer'];
      if (!validRoles.includes(role)) {
        return NextResponse.json(
          { error: 'Invalid role' },
          { status: 400 }
        );
      }
    }
    
    // Update password if provided
    if (newPassword) {
      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.isValid) {
        return NextResponse.json(
          { error: passwordValidation.errors[0], errors: passwordValidation.errors },
          { status: 400 }
        );
      }
      
      changePassword(id, newPassword);
      
      await logAuditEvent({
        user: currentUser,
        userId: currentUser,
        action: 'Password Changed',
        category: 'user_management',
        resource: id,
        resourceType: 'User',
        details: `Password changed for ${existingUser.email}`,
        ip,
        userAgent,
        sessionId: 'N/A',
        severity: 'warning',
        phiAccessed: false,
        success: true,
      });
    }
    
    // Update other fields
    const updates: Partial<Pick<typeof existingUser, 'name' | 'role' | 'active'>> = {};
    if (name !== undefined) updates.name = name;
    if (role !== undefined) updates.role = role;
    if (active !== undefined) updates.active = active;
    
    const updatedUser = updateUser(id, updates);
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Failed to update user' },
        { status: 500 }
      );
    }
    
    // Audit log
    await logAuditEvent({
      user: currentUser,
      userId: currentUser,
      action: 'User Updated',
      category: 'user_management',
      resource: id,
      resourceType: 'User',
      details: `Updated user ${existingUser.email}: ${JSON.stringify(updates)}`,
      ip,
      userAgent,
      sessionId: 'N/A',
      severity: 'info',
      phiAccessed: false,
      success: true,
    });
    
    const { passwordHash, passwordSalt, mfaSecret, ...safeUser } = updatedUser;
    
    return NextResponse.json({
      success: true,
      user: safeUser,
    });
  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE - Deactivate user (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  try {
    const { id } = await params;
    
    const existingUser = getUserById(id);
    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    const currentUser = request.headers.get('x-auth-email') || 'admin';
    
    // Prevent self-deletion
    if (existingUser.email === currentUser) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }
    
    const success = deleteUser(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete user' },
        { status: 500 }
      );
    }
    
    // Audit log
    await logAuditEvent({
      user: currentUser,
      userId: currentUser,
      action: 'User Deactivated',
      category: 'user_management',
      resource: id,
      resourceType: 'User',
      details: `Deactivated user ${existingUser.email}`,
      ip,
      userAgent,
      sessionId: 'N/A',
      severity: 'warning',
      phiAccessed: false,
      success: true,
    });
    
    return NextResponse.json({
      success: true,
      message: 'User deactivated',
    });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
