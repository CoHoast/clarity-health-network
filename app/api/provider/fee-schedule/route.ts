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
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    // Get provider's contract to determine fee schedule
    const contract = await prisma.contract.findFirst({
      where: { providerId: payload.id, status: 'active' },
    });

    // Get active fee schedule
    const feeSchedule = await prisma.feeSchedule.findFirst({
      where: { status: 'active' },
      orderBy: { effectiveDate: 'desc' },
    });

    if (!feeSchedule) {
      return NextResponse.json({ fees: [], pagination: { page, limit, total: 0, totalPages: 0 } });
    }

    const where: any = { feeScheduleId: feeSchedule.id };
    if (search) {
      where.procedureCode = { contains: search, mode: 'insensitive' };
    }

    const [rates, total] = await Promise.all([
      prisma.feeScheduleRate.findMany({
        where,
        orderBy: { procedureCode: 'asc' },
        skip,
        take: limit,
      }),
      prisma.feeScheduleRate.count({ where }),
    ]);

    // Apply contract terms if applicable
    const rateMultiplier = (contract?.terms as any)?.rateMultiplier || 1;

    return NextResponse.json({
      scheduleName: feeSchedule.name,
      fees: rates.map(r => ({
        procedureCode: r.procedureCode,
        modifier: r.modifier,
        allowedAmount: Number(r.allowedAmount) * rateMultiplier,
        effectiveDate: r.effectiveDate,
      })),
      contractType: contract?.type || 'standard',
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
