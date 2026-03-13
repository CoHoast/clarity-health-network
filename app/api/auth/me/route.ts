import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const payload = verifyAuth(req);
    
    let user: any = null;

    switch (payload.role) {
      case 'member':
        user = await prisma.member.findUnique({ 
          where: { id: payload.id },
          include: { employer: true }
        });
        break;
      case 'provider':
        user = await prisma.provider.findUnique({ 
          where: { id: payload.id },
          include: { locations: true, contracts: true }
        });
        break;
      case 'employer':
        user = await prisma.employerUser.findUnique({ 
          where: { id: payload.id },
          include: { employer: true }
        });
        break;
      case 'admin':
        user = await prisma.adminUser.findUnique({ 
          where: { id: payload.id }
        });
        break;
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { passwordHash, ...userData } = user;
    return NextResponse.json({ user: { ...userData, role: payload.role } });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
