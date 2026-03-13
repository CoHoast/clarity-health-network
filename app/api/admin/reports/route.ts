import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const payload = verifyAuth(req);
    if (payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(`${currentYear}-01-01`);

    // Get comprehensive stats
    const [
      totalMembers,
      activeMembers,
      totalProviders,
      contractedProviders,
      claimsStats,
      monthlyClaimTrend,
    ] = await Promise.all([
      prisma.member.count(),
      prisma.member.count({ where: { status: 'active' } }),
      prisma.provider.count(),
      prisma.provider.count({ where: { contractStatus: 'contracted' } }),
      prisma.claim.aggregate({
        where: { serviceDate: { gte: startOfYear } },
        _count: true,
        _sum: { billedAmount: true, allowedAmount: true, paidAmount: true },
      }),
      prisma.claim.groupBy({
        by: ['status'],
        where: { serviceDate: { gte: startOfYear } },
        _count: true,
        _sum: { paidAmount: true },
      }),
    ]);

    // Calculate metrics
    const ytdBilled = Number(claimsStats._sum.billedAmount) || 0;
    const ytdAllowed = Number(claimsStats._sum.allowedAmount) || 0;
    const ytdPaid = Number(claimsStats._sum.paidAmount) || 0;
    const savingsRate = ytdBilled > 0 ? ((ytdBilled - ytdAllowed) / ytdBilled * 100).toFixed(1) : 0;

    return NextResponse.json({
      membership: {
        total: totalMembers,
        active: activeMembers,
        inactive: totalMembers - activeMembers,
      },
      network: {
        totalProviders,
        contracted: contractedProviders,
        participationRate: ((contractedProviders / totalProviders) * 100).toFixed(1),
      },
      claims: {
        ytdCount: claimsStats._count,
        ytdBilled,
        ytdAllowed,
        ytdPaid,
        savingsRate,
        byStatus: monthlyClaimTrend.reduce((acc, s) => {
          acc[s.status] = { count: s._count, paid: Number(s._sum.paidAmount) || 0 };
          return acc;
        }, {} as Record<string, { count: number; paid: number }>),
      },
      kpis: {
        averageClaimAmount: claimsStats._count > 0 ? ytdBilled / claimsStats._count : 0,
        claimSavingsPercent: savingsRate,
        memberToProviderRatio: totalProviders > 0 ? (activeMembers / contractedProviders).toFixed(1) : 0,
      },
    });
  } catch (error) {
    console.error('Reports error:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
