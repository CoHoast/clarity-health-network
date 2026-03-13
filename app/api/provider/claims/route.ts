import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const payload = verifyAuth(req);
    if (payload.role !== 'provider') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const skip = (page - 1) * limit;

    const where: any = { providerId: payload.id };
    if (status && status !== 'all') {
      where.status = status;
    }

    const [claims, total, stats] = await Promise.all([
      prisma.claim.findMany({
        where,
        orderBy: { serviceDate: 'desc' },
        skip,
        take: limit,
        include: {
          member: { select: { firstName: true, lastName: true, memberNumber: true } },
          serviceLines: true,
        }
      }),
      prisma.claim.count({ where }),
      prisma.claim.groupBy({
        by: ['status'],
        where: { providerId: payload.id },
        _count: true,
        _sum: { billedAmount: true },
      })
    ]);

    return NextResponse.json({
      claims: claims.map(c => ({
        id: c.id,
        claimNumber: c.claimNumber,
        member: `${c.member.firstName} ${c.member.lastName}`,
        memberNumber: c.member.memberNumber,
        serviceDate: c.serviceDate,
        receivedDate: c.receivedDate,
        billedAmount: Number(c.billedAmount),
        allowedAmount: c.allowedAmount ? Number(c.allowedAmount) : null,
        paidAmount: c.paidAmount ? Number(c.paidAmount) : null,
        status: c.status,
        serviceLines: c.serviceLines.length,
      })),
      stats: stats.reduce((acc, s) => {
        acc[s.status] = { count: s._count, amount: Number(s._sum.billedAmount) || 0 };
        return acc;
      }, {} as Record<string, { count: number; amount: number }>),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
