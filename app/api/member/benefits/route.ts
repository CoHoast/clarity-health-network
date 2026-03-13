import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const payload = verifyAuth(req);
    
    if (payload.role !== 'member') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const member = await prisma.member.findUnique({
      where: { id: payload.id },
    });

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    // Get YTD spending
    const currentYear = new Date().getFullYear();
    const ytdSpending = await prisma.claim.aggregate({
      where: {
        memberId: payload.id,
        serviceDate: { gte: new Date(`${currentYear}-01-01`) },
        status: 'paid',
      },
      _sum: { memberResponsibility: true }
    });

    // Plan benefits based on type
    const planBenefits = {
      platinum_ppo: {
        deductible: { individual: 250, family: 500 },
        outOfPocketMax: { individual: 2000, family: 4000 },
        coinsurance: 90,
        copays: { primaryCare: 15, specialist: 25, urgentCare: 35, emergency: 100 },
      },
      gold_ppo: {
        deductible: { individual: 500, family: 1000 },
        outOfPocketMax: { individual: 3000, family: 6000 },
        coinsurance: 80,
        copays: { primaryCare: 25, specialist: 40, urgentCare: 50, emergency: 150 },
      },
      silver_ppo: {
        deductible: { individual: 750, family: 1500 },
        outOfPocketMax: { individual: 5000, family: 10000 },
        coinsurance: 70,
        copays: { primaryCare: 35, specialist: 50, urgentCare: 75, emergency: 250 },
      },
    };

    const benefits = planBenefits[member.planType as keyof typeof planBenefits] || planBenefits.gold_ppo;
    const ytdUsed = Number(ytdSpending._sum.memberResponsibility) || 0;

    return NextResponse.json({
      planName: member.planType === 'platinum_ppo' ? 'Platinum PPO' :
                member.planType === 'gold_ppo' ? 'Gold PPO' : 'Silver PPO',
      planType: member.planType,
      effectiveDate: member.effectiveDate,
      deductible: {
        individual: benefits.deductible.individual,
        family: benefits.deductible.family,
        used: Math.min(ytdUsed, benefits.deductible.individual),
        remaining: Math.max(0, benefits.deductible.individual - ytdUsed),
      },
      outOfPocketMax: {
        individual: benefits.outOfPocketMax.individual,
        family: benefits.outOfPocketMax.family,
        used: ytdUsed,
        remaining: Math.max(0, benefits.outOfPocketMax.individual - ytdUsed),
      },
      coinsurance: {
        planPays: benefits.coinsurance,
        memberPays: 100 - benefits.coinsurance,
      },
      copays: benefits.copays,
      coverage: {
        preventiveCare: { covered: true, copay: 0, notes: 'No cost when using in-network providers' },
        primaryCare: { covered: true, copay: benefits.copays.primaryCare },
        specialist: { covered: true, copay: benefits.copays.specialist, notes: 'Referral not required' },
        urgentCare: { covered: true, copay: benefits.copays.urgentCare },
        emergency: { covered: true, copay: benefits.copays.emergency, notes: 'Waived if admitted' },
        hospitalInpatient: { covered: true, coinsurance: benefits.coinsurance, notes: 'Subject to deductible' },
        hospitalOutpatient: { covered: true, coinsurance: benefits.coinsurance },
        mentalHealth: { covered: true, copay: benefits.copays.specialist },
        prescription: {
          generic: { copay: 10 },
          preferred: { copay: 30 },
          nonPreferred: { copay: 50 },
          specialty: { coinsurance: 20, max: 200 },
        },
        vision: { covered: true, notes: 'Annual exam covered, $150 allowance for frames/lenses' },
        dental: { covered: false, notes: 'Available as add-on' },
      },
    });
  } catch (error) {
    console.error('Benefits error:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
