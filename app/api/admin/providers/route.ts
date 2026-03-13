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
    const contractStatus = searchParams.get('contractStatus');
    const search = searchParams.get('search');
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status && status !== 'all') where.status = status;
    if (contractStatus && contractStatus !== 'all') where.contractStatus = contractStatus;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { npi: { contains: search, mode: 'insensitive' } },
        { specialty: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [providers, total] = await Promise.all([
      prisma.provider.findMany({
        where,
        orderBy: { name: 'asc' },
        skip,
        take: limit,
        include: {
          locations: { take: 1 },
          contracts: { where: { status: 'active' }, take: 1 },
          _count: { select: { claims: true } },
        }
      }),
      prisma.provider.count({ where }),
    ]);

    return NextResponse.json({
      providers: providers.map(p => ({
        id: p.id,
        npi: p.npi,
        name: p.name,
        specialty: p.specialty,
        type: p.type,
        city: p.city,
        state: p.state,
        phone: p.phone,
        status: p.status,
        contractStatus: p.contractStatus,
        credentialStatus: p.credentialStatus,
        credentialExpiry: p.credentialExpiry,
        acceptingPatients: p.acceptingPatients,
        locationCount: p.locations.length,
        claimCount: p._count.claims,
        hasActiveContract: p.contracts.length > 0,
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
