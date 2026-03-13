import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/db';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password, portalType } = await req.json();

    if (!email || !password || !portalType) {
      return NextResponse.json({ error: 'Email, password, and portal type are required' }, { status: 400 });
    }

    let user: any = null;
    let role: 'member' | 'provider' | 'employer' | 'admin';

    switch (portalType) {
      case 'member':
        user = await prisma.member.findUnique({ where: { email } });
        role = 'member';
        break;
      case 'provider':
        user = await prisma.provider.findUnique({ where: { email } });
        role = 'provider';
        break;
      case 'employer':
        user = await prisma.employerUser.findUnique({ where: { email } });
        role = 'employer';
        break;
      case 'admin':
        user = await prisma.adminUser.findUnique({ where: { email } });
        role = 'admin';
        break;
      default:
        return NextResponse.json({ error: 'Invalid portal type' }, { status: 400 });
    }

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isValidPassword = bcrypt.compareSync(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Log audit entry for login
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userType: portalType,
        action: 'login',
        resource: 'session',
        resourceId: user.id,
        details: { email: user.email },
      }
    }).catch(() => {}); // Non-critical, don't fail login

    // Generate token
    const name = portalType === 'member' 
      ? `${user.firstName} ${user.lastName}` 
      : user.name;

    const token = signToken({
      id: user.id,
      email: user.email,
      role,
      name,
    });

    // Return user data (excluding password hash)
    const { passwordHash, ...userData } = user;

    return NextResponse.json({
      token,
      user: { ...userData, role },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
