import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const payload = verifyAuth(req);
    if (payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    const [checks, total, todayStats] = await Promise.all([
      prisma.eligibilityCheck.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.eligibilityCheck.count(),
      prisma.eligibilityCheck.groupBy({
        by: ['status'],
        where: {
          createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }
        },
        _count: true,
      })
    ]);

    return NextResponse.json({
      checks: checks.map(c => ({
        id: c.id,
        memberId: c.memberId,
        memberNumber: c.memberNumber,
        requestedBy: c.requestedBy,
        requestType: c.requestType,
        serviceDate: c.serviceDate,
        status: c.status,
        checkedAt: c.createdAt,
      })),
      todayStats: {
        total: todayStats.reduce((sum, s) => sum + s._count, 0),
        eligible: todayStats.find(s => s.status === 'eligible')?._count || 0,
        ineligible: todayStats.find(s => s.status === 'ineligible')?._count || 0,
      },
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
