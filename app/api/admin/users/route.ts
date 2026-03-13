import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const payload = verifyAuth(req);
    if (payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const [admins, employers] = await Promise.all([
      prisma.adminUser.findMany({
        orderBy: { name: 'asc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          createdAt: true,
        }
      }),
      prisma.employerUser.findMany({
        orderBy: { name: 'asc' },
        include: {
          employer: { select: { name: true } }
        }
      }),
    ]);

    return NextResponse.json({
      admins: admins.map(a => ({
        ...a,
        userType: 'admin',
      })),
      employerUsers: employers.map(e => ({
        id: e.id,
        name: e.name,
        email: e.email,
        role: e.role,
        status: e.status,
        employerName: e.employer.name,
        userType: 'employer',
        createdAt: e.createdAt,
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
