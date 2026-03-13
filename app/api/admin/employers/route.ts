import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const payload = verifyAuth(req);
    if (payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const employers = await prisma.employerGroup.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { members: true, users: true } },
        invoices: {
          where: { status: 'pending' },
          select: { totalAmount: true },
        }
      }
    });

    return NextResponse.json({
      employers: employers.map(e => ({
        id: e.id,
        name: e.name,
        groupNumber: e.groupNumber,
        planType: e.planType,
        status: e.status,
        effectiveDate: e.effectiveDate,
        terminationDate: e.terminationDate,
        memberCount: e._count.members,
        userCount: e._count.users,
        pendingBalance: e.invoices.reduce((sum, i) => sum + Number(i.totalAmount), 0),
        address: e.address,
        city: e.city,
        state: e.state,
        phone: e.phone,
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
