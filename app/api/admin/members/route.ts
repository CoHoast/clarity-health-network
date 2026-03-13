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
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { memberNumber: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [members, total] = await Promise.all([
      prisma.member.findMany({
        where,
        orderBy: { lastName: 'asc' },
        skip,
        take: limit,
        include: {
          employer: { select: { name: true, groupNumber: true } },
          _count: { select: { claims: true } },
        }
      }),
      prisma.member.count({ where }),
    ]);

    return NextResponse.json({
      members: members.map(m => ({
        id: m.id,
        memberNumber: m.memberNumber,
        firstName: m.firstName,
        lastName: m.lastName,
        email: m.email,
        dateOfBirth: m.dateOfBirth,
        planType: m.planType,
        status: m.status,
        effectiveDate: m.effectiveDate,
        terminationDate: m.terminationDate,
        employer: m.employer?.name,
        groupNumber: m.employer?.groupNumber,
        claimCount: m._count.claims,
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
