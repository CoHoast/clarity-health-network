import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const payload = verifyAuth(req);
    
    if (payload.role !== 'provider') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get provider info
    const provider = await prisma.provider.findUnique({
      where: { id: payload.id },
      include: { 
        locations: true,
        contracts: { where: { status: 'active' } }
      }
    });

    if (!provider) {
      return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
    }

    // Get claims stats
    const currentYear = new Date().getFullYear();
    const [claimsStats, recentClaims, payments] = await Promise.all([
      prisma.claim.aggregate({
        where: {
          providerId: payload.id,
          serviceDate: { gte: new Date(`${currentYear}-01-01`) }
        },
        _count: true,
        _sum: { billedAmount: true, paidAmount: true }
      }),
      prisma.claim.findMany({
        where: { providerId: payload.id },
        orderBy: { receivedDate: 'desc' },
        take: 10,
        include: {
          member: { select: { firstName: true, lastName: true, memberNumber: true } }
        }
      }),
      prisma.paymentBatch.findMany({
        where: { providerId: payload.id },
        orderBy: { paymentDate: 'desc' },
        take: 5,
      })
    ]);

    // Calculate pending claims
    const pendingClaims = await prisma.claim.count({
      where: {
        providerId: payload.id,
        status: { in: ['pending', 'processing', 'pending_review'] }
      }
    });

    return NextResponse.json({
      provider: {
        id: provider.id,
        npi: provider.npi,
        name: provider.name,
        specialty: provider.specialty,
        status: provider.status,
        contractStatus: provider.contractStatus,
        credentialStatus: provider.credentialStatus,
        credentialExpiry: provider.credentialExpiry,
        locations: provider.locations.length,
        activeContract: provider.contracts.length > 0,
      },
      stats: {
        ytdClaims: claimsStats._count,
        ytdBilled: Number(claimsStats._sum.billedAmount) || 0,
        ytdPaid: Number(claimsStats._sum.paidAmount) || 0,
        pendingClaims,
      },
      recentClaims: recentClaims.map(claim => ({
        id: claim.id,
        claimNumber: claim.claimNumber,
        member: `${claim.member.firstName} ${claim.member.lastName}`,
        memberNumber: claim.member.memberNumber,
        serviceDate: claim.serviceDate,
        billedAmount: Number(claim.billedAmount),
        status: claim.status,
      })),
      recentPayments: payments.map(p => ({
        id: p.id,
        batchNumber: p.batchNumber,
        amount: Number(p.totalAmount),
        claimCount: p.claimCount,
        paymentDate: p.paymentDate,
        status: p.status,
      })),
      alerts: {
        credentialExpiring: provider.credentialExpiry 
          ? new Date(provider.credentialExpiry) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
          : false,
        pendingClaims,
      }
    });
  } catch (error) {
    console.error('Provider dashboard error:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
