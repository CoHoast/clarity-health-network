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
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Get unique members from claims for this provider
    const claims = await prisma.claim.findMany({
      where: { providerId: payload.id },
      select: { memberId: true },
      distinct: ['memberId'],
    });

    const memberIds = claims.map(c => c.memberId);

    const where: any = { id: { in: memberIds } };
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { memberNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [patients, total] = await Promise.all([
      prisma.member.findMany({
        where,
        orderBy: { lastName: 'asc' },
        skip,
        take: limit,
        include: {
          claims: {
            where: { providerId: payload.id },
            orderBy: { serviceDate: 'desc' },
            take: 1,
          }
        }
      }),
      prisma.member.count({ where }),
    ]);

    return NextResponse.json({
      patients: patients.map(p => ({
        id: p.id,
        memberNumber: p.memberNumber,
        firstName: p.firstName,
        lastName: p.lastName,
        dateOfBirth: p.dateOfBirth,
        phone: p.phone,
        email: p.email,
        planType: p.planType,
        status: p.status,
        lastVisit: p.claims[0]?.serviceDate || null,
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
