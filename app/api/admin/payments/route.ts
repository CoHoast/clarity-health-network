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
    const skip = (page - 1) * limit;

    const [batches, total, ytdStats] = await Promise.all([
      prisma.paymentBatch.findMany({
        orderBy: { paymentDate: 'desc' },
        skip,
        take: limit,
        include: {
          provider: { select: { name: true, npi: true } }
        }
      }),
      prisma.paymentBatch.count(),
      prisma.paymentBatch.aggregate({
        where: {
          paymentDate: { gte: new Date(`${new Date().getFullYear()}-01-01`) },
          status: 'deposited',
        },
        _sum: { totalAmount: true },
        _count: true,
      })
    ]);

    return NextResponse.json({
      batches: batches.map(b => ({
        id: b.id,
        batchNumber: b.batchNumber,
        provider: {
          name: b.provider.name,
          npi: b.provider.npi,
        },
        amount: Number(b.totalAmount),
        claimCount: b.claimCount,
        paymentDate: b.paymentDate,
        paymentMethod: b.paymentMethod,
        status: b.status,
        checkNumber: b.checkNumber,
        achTraceNumber: b.achTraceNumber,
        eraGenerated: b.eraGenerated,
      })),
      summary: {
        ytdTotal: Number(ytdStats._sum.totalAmount) || 0,
        ytdBatches: ytdStats._count,
      },
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = verifyAuth(req);
    if (payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { providerId, claimIds, paymentMethod } = await req.json();

    // Get claims to pay
    const claims = await prisma.claim.findMany({
      where: { id: { in: claimIds }, status: 'approved' },
    });

    if (claims.length === 0) {
      return NextResponse.json({ error: 'No approved claims to pay' }, { status: 400 });
    }

    const totalAmount = claims.reduce((sum, c) => sum + Number(c.paidAmount || 0), 0);

    // Generate batch number
    const lastBatch = await prisma.paymentBatch.findFirst({
      orderBy: { batchNumber: 'desc' },
    });
    const lastNum = lastBatch ? parseInt(lastBatch.batchNumber.split('-')[2]) : 0;
    const batchNumber = `PAY-${new Date().getFullYear()}-${String(lastNum + 1).padStart(3, '0')}`;

    // Create payment batch
    const batch = await prisma.paymentBatch.create({
      data: {
        batchNumber,
        providerId,
        totalAmount,
        claimCount: claims.length,
        paymentDate: new Date(),
        paymentMethod: paymentMethod || 'ach',
        status: 'pending',
      }
    });

    // Update claims
    await prisma.claim.updateMany({
      where: { id: { in: claimIds } },
      data: { status: 'paid', paidAt: new Date(), paymentBatchId: batch.id }
    });

    return NextResponse.json({ batch, success: true });
  } catch (error) {
    console.error('Payment batch error:', error);
    return NextResponse.json({ error: 'Failed to create payment batch' }, { status: 500 });
  }
}
