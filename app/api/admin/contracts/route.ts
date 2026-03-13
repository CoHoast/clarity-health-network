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
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status && status !== 'all') where.status = status;

    const [contracts, total] = await Promise.all([
      prisma.contract.findMany({
        where,
        orderBy: { effectiveDate: 'desc' },
        skip,
        take: limit,
        include: {
          provider: { select: { name: true, npi: true, specialty: true } }
        }
      }),
      prisma.contract.count({ where }),
    ]);

    // Get expiring soon (next 90 days)
    const expiringSoon = await prisma.contract.count({
      where: {
        status: 'active',
        terminationDate: {
          lte: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          gte: new Date(),
        }
      }
    });

    return NextResponse.json({
      contracts: contracts.map(c => ({
        id: c.id,
        contractNumber: c.contractNumber,
        provider: {
          id: c.providerId,
          name: c.provider.name,
          npi: c.provider.npi,
          specialty: c.provider.specialty,
        },
        type: c.type,
        terms: c.terms,
        effectiveDate: c.effectiveDate,
        terminationDate: c.terminationDate,
        status: c.status,
        autoRenew: c.autoRenew,
      })),
      summary: {
        active: await prisma.contract.count({ where: { status: 'active' } }),
        expiringSoon,
        pending: await prisma.contract.count({ where: { status: 'pending' } }),
      },
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
