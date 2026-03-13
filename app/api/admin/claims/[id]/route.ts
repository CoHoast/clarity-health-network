import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = verifyAuth(req);
    if (payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;

    const claim = await prisma.claim.findUnique({
      where: { id },
      include: {
        member: {
          include: { employer: true }
        },
        provider: {
          include: { locations: true }
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
        claimType: claim.claimType,
        placeOfService: claim.placeOfService,
        serviceDate: claim.serviceDate,
        receivedDate: claim.receivedDate,
        diagnosisCodes: claim.diagnosisCodes,
        billedAmount: Number(claim.billedAmount),
        allowedAmount: claim.allowedAmount ? Number(claim.allowedAmount) : null,
        paidAmount: claim.paidAmount ? Number(claim.paidAmount) : null,
        memberResponsibility: claim.memberResponsibility ? Number(claim.memberResponsibility) : null,
        status: claim.status,
        denialReason: claim.denialReason,
        adjudicatedAt: claim.adjudicatedAt,
        paidAt: claim.paidAt,
        fraudScore: claim.fraudScore,
        fraudFlags: claim.fraudFlags,
        member: {
          id: claim.member.id,
          memberNumber: claim.member.memberNumber,
          name: `${claim.member.firstName} ${claim.member.lastName}`,
          dateOfBirth: claim.member.dateOfBirth,
          planType: claim.member.planType,
          employer: claim.member.employer?.name,
        },
        provider: {
          id: claim.provider.id,
          npi: claim.provider.npi,
          name: claim.provider.name,
          specialty: claim.provider.specialty,
          address: claim.provider.address,
          city: claim.provider.city,
          state: claim.provider.state,
          phone: claim.provider.phone,
        },
        serviceLines: claim.serviceLines.map(sl => ({
          id: sl.id,
          lineNumber: sl.lineNumber,
          procedureCode: sl.procedureCode,
          modifiers: sl.modifiers,
          units: sl.units,
          billedAmount: Number(sl.billedAmount),
          allowedAmount: sl.allowedAmount ? Number(sl.allowedAmount) : null,
          paidAmount: sl.paidAmount ? Number(sl.paidAmount) : null,
          status: sl.status,
          denialReason: sl.denialReason,
        })),
      }
    });
  } catch (error) {
    console.error('Claim detail error:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
