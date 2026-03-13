import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const payload = verifyAuth(req);
    if (payload.role !== 'provider') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { memberNumber, dateOfBirth, serviceDate } = await req.json();

    // Parse date - add time component to match database storage
    const dob = new Date(dateOfBirth + 'T00:00:00.000Z');
    const dobEnd = new Date(dateOfBirth + 'T23:59:59.999Z');

    // Find member with date range to handle timezone issues
    const member = await prisma.member.findFirst({
      where: {
        memberNumber,
        dateOfBirth: {
          gte: dob,
          lte: dobEnd,
        },
      },
      include: { employer: true }
    });

    if (!member) {
      // Log the check
      await prisma.eligibilityCheck.create({
        data: {
          memberNumber,
          requestedBy: payload.id,
          requestType: 'real_time',
          serviceDate: new Date(serviceDate || Date.now()),
          status: 'ineligible',
          response: { error: 'Member not found' },
        }
      });

      return NextResponse.json({
        eligible: false,
        status: 'not_found',
        message: 'Member not found with provided information',
      });
    }

    // Check eligibility
    const isActive = member.status === 'active';
    const effectiveDate = new Date(member.effectiveDate);
    const checkDate = new Date(serviceDate || Date.now());
    const isEffective = checkDate >= effectiveDate;
    const isTerminated = member.terminationDate ? checkDate > new Date(member.terminationDate) : false;

    const eligible = isActive && isEffective && !isTerminated;

    // Get benefits summary
    const planBenefits = {
      platinum_ppo: { deductible: 250, oopMax: 2000, coinsurance: 90 },
      gold_ppo: { deductible: 500, oopMax: 3000, coinsurance: 80 },
      silver_ppo: { deductible: 750, oopMax: 5000, coinsurance: 70 },
    };
    const benefits = planBenefits[member.planType as keyof typeof planBenefits] || planBenefits.gold_ppo;

    // Get YTD accumulators
    const currentYear = new Date().getFullYear();
    const ytd = await prisma.claim.aggregate({
      where: {
        memberId: member.id,
        serviceDate: { gte: new Date(`${currentYear}-01-01`) },
        status: 'paid',
      },
      _sum: { memberResponsibility: true }
    });

    const response = {
      eligible,
      status: eligible ? 'active' : isTerminated ? 'terminated' : !isEffective ? 'not_yet_effective' : 'inactive',
      member: {
        id: member.id,
        memberNumber: member.memberNumber,
        firstName: member.firstName,
        lastName: member.lastName,
        dateOfBirth: member.dateOfBirth,
        relationship: member.relationship,
      },
      coverage: {
        planType: member.planType,
        planName: member.planType === 'platinum_ppo' ? 'Platinum PPO' :
                  member.planType === 'gold_ppo' ? 'Gold PPO' : 'Silver PPO',
        groupNumber: member.employer?.groupNumber,
        groupName: member.employer?.name,
        effectiveDate: member.effectiveDate,
        terminationDate: member.terminationDate,
      },
      benefits: {
        deductible: benefits.deductible,
        deductibleMet: Number(ytd._sum.memberResponsibility) || 0,
        deductibleRemaining: Math.max(0, benefits.deductible - (Number(ytd._sum.memberResponsibility) || 0)),
        outOfPocketMax: benefits.oopMax,
        outOfPocketMet: Number(ytd._sum.memberResponsibility) || 0,
        coinsurance: benefits.coinsurance,
      },
      copays: {
        primaryCare: member.planType === 'platinum_ppo' ? 15 : member.planType === 'gold_ppo' ? 25 : 35,
        specialist: member.planType === 'platinum_ppo' ? 25 : member.planType === 'gold_ppo' ? 40 : 50,
      },
      checkedAt: new Date().toISOString(),
    };

    // Log the check
    await prisma.eligibilityCheck.create({
      data: {
        memberId: member.id,
        memberNumber,
        requestedBy: payload.id,
        requestType: 'real_time',
        serviceDate: new Date(serviceDate || Date.now()),
        status: eligible ? 'eligible' : 'ineligible',
        response,
      }
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Eligibility check error:', error);
    return NextResponse.json({ error: 'Eligibility check failed' }, { status: 500 });
  }
}
