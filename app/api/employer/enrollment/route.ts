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
      include: { employer: true }
    });

    if (!employerUser) {
      return NextResponse.json({ error: 'Employer not found' }, { status: 404 });
    }

    // Get enrollment stats
    const [totalMembers, byPlan, byRelationship, recentEnrollments] = await Promise.all([
      prisma.member.count({ where: { employerId: employerUser.employerId } }),
      prisma.member.groupBy({
        by: ['planType'],
        where: { employerId: employerUser.employerId, status: 'active' },
        _count: true,
      }),
      prisma.member.groupBy({
        by: ['relationship'],
        where: { employerId: employerUser.employerId, status: 'active' },
        _count: true,
      }),
      prisma.member.findMany({
        where: { employerId: employerUser.employerId },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          planType: true,
          effectiveDate: true,
          createdAt: true,
        }
      }),
    ]);

    // Open enrollment period (mock)
    const now = new Date();
    const oeStart = new Date(now.getFullYear(), 10, 1); // Nov 1
    const oeEnd = new Date(now.getFullYear(), 11, 15); // Dec 15
    const isOpenEnrollment = now >= oeStart && now <= oeEnd;

    return NextResponse.json({
      summary: {
        totalEnrolled: totalMembers,
        byPlan: byPlan.reduce((acc, p) => {
          acc[p.planType] = p._count;
          return acc;
        }, {} as Record<string, number>),
        byRelationship: byRelationship.reduce((acc, r) => {
          acc[r.relationship] = r._count;
          return acc;
        }, {} as Record<string, number>),
      },
      recentEnrollments: recentEnrollments.map(m => ({
        id: m.id,
        name: `${m.firstName} ${m.lastName}`,
        planType: m.planType,
        effectiveDate: m.effectiveDate,
        enrolledAt: m.createdAt,
      })),
      openEnrollment: {
        isActive: isOpenEnrollment,
        startDate: oeStart.toISOString(),
        endDate: oeEnd.toISOString(),
        daysRemaining: isOpenEnrollment ? Math.ceil((oeEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 0,
      },
      eligiblePlans: ['Platinum PPO', 'Gold PPO', 'Silver PPO'],
    });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
