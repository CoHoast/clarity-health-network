import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = verifyAuth(req);
    if (payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const { action, denialReason, notes } = await req.json();

    const claim = await prisma.claim.findUnique({
      where: { id },
      include: { serviceLines: true }
    });

    if (!claim) {
      return NextResponse.json({ error: 'Claim not found' }, { status: 404 });
    }

    let updateData: any = {
      adjudicatedAt: new Date(),
    };

    if (action === 'approve') {
      // Calculate allowed amounts if not already set
      const allowedAmount = Number(claim.allowedAmount) || Number(claim.billedAmount) * 0.7;
      const memberResp = allowedAmount * 0.2;
      const paidAmount = allowedAmount - memberResp;

      updateData = {
        ...updateData,
        status: 'approved',
        allowedAmount,
        memberResponsibility: memberResp,
        paidAmount,
      };

      // Update service lines
      await prisma.claimServiceLine.updateMany({
        where: { claimId: id },
        data: { status: 'approved' }
      });

    } else if (action === 'deny') {
      updateData = {
        ...updateData,
        status: 'denied',
        denialReason: denialReason || 'Not medically necessary',
        paidAmount: 0,
      };

      await prisma.claimServiceLine.updateMany({
        where: { claimId: id },
        data: { status: 'denied', denialReason }
      });

    } else if (action === 'pend') {
      updateData = {
        ...updateData,
        status: 'pending_review',
      };
    }

    const updatedClaim = await prisma.claim.update({
      where: { id },
      data: updateData,
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId: payload.id,
        userType: 'admin',
        action: `claim_${action}`,
        resource: 'claim',
        resourceId: id,
        details: { action, denialReason, notes },
      }
    });

    return NextResponse.json({
      success: true,
      claim: {
        id: updatedClaim.id,
        claimNumber: updatedClaim.claimNumber,
        status: updatedClaim.status,
        allowedAmount: updatedClaim.allowedAmount ? Number(updatedClaim.allowedAmount) : null,
        paidAmount: updatedClaim.paidAmount ? Number(updatedClaim.paidAmount) : null,
      }
    });
  } catch (error) {
    console.error('Adjudication error:', error);
    return NextResponse.json({ error: 'Adjudication failed' }, { status: 500 });
  }
}
