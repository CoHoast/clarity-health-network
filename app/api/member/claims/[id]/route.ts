import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = verifyAuth(req);
    if (payload.role !== 'member') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;

    const claim = await prisma.claim.findFirst({
      where: { id, memberId: payload.id },
      include: {
        provider: {
          select: { name: true, specialty: true, address: true, city: true, state: true, phone: true }
        },
        serviceLines: true,
      }
    });

    if (!claim) {
      return NextResponse.json({ error: 'Claim not found' }, { status: 404 });
    }

    return NextResponse.json({
      claim: {
        id: claim.id,
        claimNumber: claim.claimNumber,
        status: claim.status,
        serviceDate: claim.serviceDate,
        receivedDate: claim.receivedDate,
        provider: claim.provider,
        diagnosis: claim.diagnosisCodes,
        billedAmount: Number(claim.billedAmount),
        allowedAmount: claim.allowedAmount ? Number(claim.allowedAmount) : null,
        planPaid: claim.paidAmount ? Number(claim.paidAmount) : null,
        yourResponsibility: claim.memberResponsibility ? Number(claim.memberResponsibility) : null,
        denialReason: claim.denialReason,
        serviceLines: claim.serviceLines.map(sl => ({
          procedureCode: sl.procedureCode,
          modifiers: sl.modifiers,
          units: sl.units,
          billedAmount: Number(sl.billedAmount),
          allowedAmount: sl.allowedAmount ? Number(sl.allowedAmount) : null,
          paidAmount: sl.paidAmount ? Number(sl.paidAmount) : null,
          status: sl.status,
        })),
        eobAvailable: claim.status === 'paid',
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
