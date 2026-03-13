import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const payload = verifyAuth(req);
    
    if (payload.role !== 'member') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get member with employer
    const member = await prisma.member.findUnique({
      where: { id: payload.id },
      include: { employer: true }
    });

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    // Get deductible status (sum of member responsibility for current year)
    const currentYear = new Date().getFullYear();
    const deductibleUsed = await prisma.claim.aggregate({
      where: {
        memberId: payload.id,
        serviceDate: {
          gte: new Date(`${currentYear}-01-01`),
          lte: new Date(`${currentYear}-12-31`),
        },
        status: 'paid',
      },
      _sum: {
        memberResponsibility: true,
      },
    });

    // Plan deductibles (mock based on plan type)
    const deductibleMax = member.planType === 'platinum_ppo' ? 250 : 
                          member.planType === 'gold_ppo' ? 500 : 750;
    const oopMax = member.planType === 'platinum_ppo' ? 2000 : 
                   member.planType === 'gold_ppo' ? 3000 : 5000;

    // Get recent claims
    const recentClaims = await prisma.claim.findMany({
      where: { memberId: payload.id },
      orderBy: { serviceDate: 'desc' },
      take: 5,
      include: {
        provider: {
          select: { name: true, specialty: true }
        }
      }
    });

    // Get unread messages count
    const unreadMessages = await prisma.message.count({
      where: {
        memberId: payload.id,
        status: 'unread',
        direction: 'outbound'
      }
    });

    // Get upcoming appointments (mock for now)
    const appointments = [
      { date: '2026-03-20', time: '10:00 AM', provider: 'Dr. Johnson', type: 'Annual Physical' },
      { date: '2026-04-05', time: '2:30 PM', provider: 'Dr. Smith', type: 'Follow-up' },
    ];

    return NextResponse.json({
      member: {
        id: member.id,
        memberNumber: member.memberNumber,
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        planType: member.planType,
        status: member.status,
        effectiveDate: member.effectiveDate,
        employer: member.employer?.name,
      },
      benefits: {
        deductible: {
          used: Number(deductibleUsed._sum.memberResponsibility) || 0,
          max: deductibleMax,
        },
        outOfPocket: {
          used: Number(deductibleUsed._sum.memberResponsibility) || 0, // Simplified
          max: oopMax,
        },
        coinsurance: '80%',
      },
      recentClaims: recentClaims.map(claim => ({
        id: claim.id,
        claimNumber: claim.claimNumber,
        serviceDate: claim.serviceDate,
        provider: claim.provider.name,
        billedAmount: Number(claim.billedAmount),
        allowedAmount: claim.allowedAmount ? Number(claim.allowedAmount) : null,
        memberResponsibility: claim.memberResponsibility ? Number(claim.memberResponsibility) : null,
        status: claim.status,
      })),
      alerts: {
        unreadMessages,
        pendingClaims: recentClaims.filter(c => c.status === 'pending' || c.status === 'processing').length,
      },
      appointments,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
