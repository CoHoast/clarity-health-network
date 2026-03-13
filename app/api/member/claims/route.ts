import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const payload = verifyAuth(req);
    
    if (payload.role !== 'member') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const skip = (page - 1) * limit;

    const where: any = { memberId: payload.id };
    if (status && status !== 'all') {
      where.status = status;
    }

    const [claims, total] = await Promise.all([
      prisma.claim.findMany({
        where,
        orderBy: { serviceDate: 'desc' },
        skip,
        take: limit,
        include: {
          provider: {
            select: { name: true, specialty: true, npi: true }
          },
          serviceLines: true,
        }
      }),
      prisma.claim.count({ where })
    ]);

    return NextResponse.json({
      claims: claims.map(claim => ({
        id: claim.id,
        claimNumber: claim.claimNumber,
        serviceDate: claim.serviceDate,
        receivedDate: claim.receivedDate,
        provider: {
          name: claim.provider.name,
          specialty: claim.provider.specialty,
          npi: claim.provider.npi,
        },
        diagnosisCodes: claim.diagnosisCodes,
        billedAmount: Number(claim.billedAmount),
        allowedAmount: claim.allowedAmount ? Number(claim.allowedAmount) : null,
        paidAmount: claim.paidAmount ? Number(claim.paidAmount) : null,
        memberResponsibility: claim.memberResponsibility ? Number(claim.memberResponsibility) : null,
        status: claim.status,
        denialReason: claim.denialReason,
        serviceLines: claim.serviceLines.map(line => ({
          procedureCode: line.procedureCode,
          units: line.units,
          billedAmount: Number(line.billedAmount),
          allowedAmount: line.allowedAmount ? Number(line.allowedAmount) : null,
          status: line.status,
        })),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    console.error('Claims error:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
