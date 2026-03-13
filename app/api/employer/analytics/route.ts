import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const payload = verifyAuth(req);
    if (payload.role !== 'employer') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const employerUser = await prisma.employerUser.findUnique({
      where: { id: payload.id },
    });

    if (!employerUser) {
      return NextResponse.json({ error: 'Employer not found' }, { status: 404 });
    }

    const employerId = employerUser.employerId;
    const currentYear = new Date().getFullYear();

    // Get monthly claims data
    const claims = await prisma.claim.findMany({
      where: {
        member: { employerId },
        serviceDate: { gte: new Date(`${currentYear}-01-01`) },
      },
      select: {
        serviceDate: true,
        billedAmount: true,
        paidAmount: true,
        status: true,
      }
    });

    // Group by month
    const monthlyData: { [key: string]: { claims: number; billed: number; paid: number } } = {};
    for (let m = 0; m < 12; m++) {
      const key = `${currentYear}-${String(m + 1).padStart(2, '0')}`;
      monthlyData[key] = { claims: 0, billed: 0, paid: 0 };
    }

    claims.forEach(c => {
      const month = `${c.serviceDate.getFullYear()}-${String(c.serviceDate.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyData[month]) {
        monthlyData[month].claims++;
        monthlyData[month].billed += Number(c.billedAmount);
        monthlyData[month].paid += Number(c.paidAmount || 0);
      }
    });

    // Get claims by status
    const claimsByStatus = await prisma.claim.groupBy({
      by: ['status'],
      where: { member: { employerId } },
      _count: true,
    });

    // Get top providers
    const topProviders = await prisma.claim.groupBy({
      by: ['providerId'],
      where: { member: { employerId } },
      _count: true,
      _sum: { paidAmount: true },
      orderBy: { _sum: { paidAmount: 'desc' } },
      take: 5,
    });

    const providerDetails = await prisma.provider.findMany({
      where: { id: { in: topProviders.map(p => p.providerId) } },
      select: { id: true, name: true, specialty: true },
    });

    return NextResponse.json({
      monthlyTrend: Object.entries(monthlyData).map(([month, data]) => ({
        month,
        ...data,
      })),
      claimsByStatus: claimsByStatus.reduce((acc, s) => {
        acc[s.status] = s._count;
        return acc;
      }, {} as Record<string, number>),
      topProviders: topProviders.map(p => {
        const details = providerDetails.find(d => d.id === p.providerId);
        return {
          id: p.providerId,
          name: details?.name || 'Unknown',
          specialty: details?.specialty,
          claimCount: p._count,
          totalPaid: Number(p._sum.paidAmount) || 0,
        };
      }),
      summary: {
        totalClaims: claims.length,
        totalBilled: claims.reduce((sum, c) => sum + Number(c.billedAmount), 0),
        totalPaid: claims.reduce((sum, c) => sum + Number(c.paidAmount || 0), 0),
        avgClaimAmount: claims.length > 0 
          ? claims.reduce((sum, c) => sum + Number(c.billedAmount), 0) / claims.length 
          : 0,
      },
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
