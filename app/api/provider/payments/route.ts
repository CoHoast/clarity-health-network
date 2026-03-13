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
    const skip = (page - 1) * limit;

    const [payments, total, ytdTotal] = await Promise.all([
      prisma.paymentBatch.findMany({
        where: { providerId: payload.id },
        orderBy: { paymentDate: 'desc' },
        skip,
        take: limit,
      }),
      prisma.paymentBatch.count({ where: { providerId: payload.id } }),
      prisma.paymentBatch.aggregate({
        where: {
          providerId: payload.id,
          paymentDate: { gte: new Date(`${new Date().getFullYear()}-01-01`) },
          status: 'deposited',
        },
        _sum: { totalAmount: true },
        _count: true,
      })
    ]);

    return NextResponse.json({
      payments: payments.map(p => ({
        id: p.id,
        batchNumber: p.batchNumber,
        amount: Number(p.totalAmount),
        claimCount: p.claimCount,
        paymentDate: p.paymentDate,
        paymentMethod: p.paymentMethod,
        status: p.status,
        checkNumber: p.checkNumber,
        achTraceNumber: p.achTraceNumber,
        eraAvailable: p.eraGenerated,
      })),
      summary: {
        ytdTotal: Number(ytdTotal._sum.totalAmount) || 0,
        ytdPayments: ytdTotal._count,
      },
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
