import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const payload = verifyAuth(req);
    if (payload.role !== 'employer') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get employer user with their employer group
    const employerUser = await prisma.employerUser.findUnique({
      where: { id: payload.id },
      include: { employer: true }
    });

    if (!employerUser) {
      return NextResponse.json({ error: 'Employer not found' }, { status: 404 });
    }

    const employerId = employerUser.employerId;
    const currentYear = new Date().getFullYear();

    // Get all stats
    const [
      totalMembers,
      activeMembers,
      claimsStats,
      recentClaims,
      invoices,
    ] = await Promise.all([
      prisma.member.count({ where: { employerId } }),
      prisma.member.count({ where: { employerId, status: 'active' } }),
      prisma.claim.aggregate({
        where: {
          member: { employerId },
          serviceDate: { gte: new Date(`${currentYear}-01-01`) },
        },
        _count: true,
        _sum: { billedAmount: true, paidAmount: true },
      }),
      prisma.claim.findMany({
        where: { member: { employerId } },
        orderBy: { serviceDate: 'desc' },
        take: 10,
        include: {
          member: { select: { firstName: true, lastName: true } },
          provider: { select: { name: true } },
        }
      }),
      prisma.invoice.findMany({
        where: { employerId },
        orderBy: { dueDate: 'desc' },
        take: 5,
      }),
    ]);

    return NextResponse.json({
      employer: {
        id: employerUser.employer.id,
        name: employerUser.employer.name,
        groupNumber: employerUser.employer.groupNumber,
        planType: employerUser.employer.planType,
        status: employerUser.employer.status,
      },
      user: {
        name: employerUser.name,
        role: employerUser.role,
      },
      kpis: {
        totalMembers,
        activeMembers,
        ytdClaims: claimsStats._count,
        ytdSpend: Number(claimsStats._sum.paidAmount) || 0,
      },
      recentClaims: recentClaims.map(c => ({
        id: c.id,
        claimNumber: c.claimNumber,
        employee: `${c.member.firstName} ${c.member.lastName}`,
        provider: c.provider.name,
        serviceDate: c.serviceDate,
        amount: Number(c.billedAmount),
        status: c.status,
      })),
      billing: {
        pendingInvoices: invoices.filter(i => i.status === 'pending').length,
        totalDue: invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + Number(i.totalAmount), 0),
        nextDueDate: invoices.find(i => i.status === 'pending')?.dueDate,
      },
    });
  } catch (error) {
    console.error('Employer dashboard error:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
