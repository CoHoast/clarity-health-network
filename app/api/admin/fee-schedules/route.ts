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
    const scheduleId = searchParams.get('scheduleId');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    // Get fee schedules
    const schedules = await prisma.feeSchedule.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { rates: true } } }
    });

    // If a schedule is selected, get its rates
    if (scheduleId) {
      const where: any = { feeScheduleId: scheduleId };
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

      return NextResponse.json({
        schedules: schedules.map(s => ({
          id: s.id,
          name: s.name,
          type: s.type,
          effectiveDate: s.effectiveDate,
          status: s.status,
          rateCount: s._count.rates,
        })),
        selectedSchedule: scheduleId,
        rates: rates.map(r => ({
          id: r.id,
          procedureCode: r.procedureCode,
          modifier: r.modifier,
          allowedAmount: Number(r.allowedAmount),
          effectiveDate: r.effectiveDate,
          terminationDate: r.terminationDate,
        })),
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      });
    }

    return NextResponse.json({
      schedules: schedules.map(s => ({
        id: s.id,
        name: s.name,
        type: s.type,
        effectiveDate: s.effectiveDate,
        status: s.status,
        rateCount: s._count.rates,
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
