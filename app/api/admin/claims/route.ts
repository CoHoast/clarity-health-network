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
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status && status !== 'all') where.status = status;
    if (search) {
      where.OR = [
        { claimNumber: { contains: search, mode: 'insensitive' } },
        { member: { firstName: { contains: search, mode: 'insensitive' } } },
        { member: { lastName: { contains: search, mode: 'insensitive' } } },
        { provider: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [claims, total, statusCounts] = await Promise.all([
      prisma.claim.findMany({
        where,
        orderBy: { receivedDate: 'desc' },
        skip,
        take: limit,
        include: {
          member: { select: { firstName: true, lastName: true, memberNumber: true } },
          provider: { select: { name: true, npi: true } },
          serviceLines: true,
        }
      }),
      prisma.claim.count({ where }),
      prisma.claim.groupBy({
        by: ['status'],
        _count: true,
      }),
    ]);

    return NextResponse.json({
      claims: claims.map(c => ({
        id: c.id,
        claimNumber: c.claimNumber,
        member: {
          name: `${c.member.firstName} ${c.member.lastName}`,
          memberNumber: c.member.memberNumber,
        },
        provider: {
          name: c.provider.name,
          npi: c.provider.npi,
        },
        serviceDate: c.serviceDate,
        receivedDate: c.receivedDate,
        billedAmount: Number(c.billedAmount),
        allowedAmount: c.allowedAmount ? Number(c.allowedAmount) : null,
        paidAmount: c.paidAmount ? Number(c.paidAmount) : null,
        memberResponsibility: c.memberResponsibility ? Number(c.memberResponsibility) : null,
        status: c.status,
        fraudScore: c.fraudScore,
        fraudFlags: c.fraudFlags,
        serviceLines: c.serviceLines.length,
      })),
      statusCounts: statusCounts.reduce((acc, s) => {
        acc[s.status] = s._count;
        return acc;
      }, {} as Record<string, number>),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Admin claims error:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
