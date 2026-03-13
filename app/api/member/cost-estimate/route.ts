import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const payload = verifyAuth(req);
    if (payload.role !== 'member') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { procedureCode, providerId, quantity = 1 } = await req.json();

    // Get member's plan
    const member = await prisma.member.findUnique({
      where: { id: payload.id },
    });

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    // Get fee schedule rate
    const feeSchedule = await prisma.feeSchedule.findFirst({
      where: { status: 'active' },
      include: {
        rates: {
          where: { procedureCode },
          take: 1,
        }
      }
    });

    const rate = feeSchedule?.rates[0];
    const allowedAmount = rate ? Number(rate.allowedAmount) * quantity : 150 * quantity; // Default estimate

    // Get YTD accumulator
    const currentYear = new Date().getFullYear();
    const ytd = await prisma.claim.aggregate({
      where: {
        memberId: payload.id,
        serviceDate: { gte: new Date(`${currentYear}-01-01`) },
        status: 'paid',
      },
      _sum: { memberResponsibility: true }
    });

    const ytdUsed = Number(ytd._sum.memberResponsibility) || 0;

    // Plan parameters
    const plans = {
      platinum_ppo: { deductible: 250, oopMax: 2000, coinsurance: 0.10 },
      gold_ppo: { deductible: 500, oopMax: 3000, coinsurance: 0.20 },
      silver_ppo: { deductible: 750, oopMax: 5000, coinsurance: 0.30 },
    };
    const plan = plans[member.planType as keyof typeof plans] || plans.gold_ppo;

    // Calculate member responsibility
    const deductibleRemaining = Math.max(0, plan.deductible - ytdUsed);
    let memberResp = 0;

    if (deductibleRemaining > 0) {
      // Apply to deductible first
      const toDeductible = Math.min(allowedAmount, deductibleRemaining);
      memberResp += toDeductible;
      const afterDeductible = allowedAmount - toDeductible;
      memberResp += afterDeductible * plan.coinsurance;
    } else {
      memberResp = allowedAmount * plan.coinsurance;
    }

    // Cap at OOP max
    const oopRemaining = Math.max(0, plan.oopMax - ytdUsed);
    memberResp = Math.min(memberResp, oopRemaining);

    const planPays = allowedAmount - memberResp;

    return NextResponse.json({
      procedureCode,
      quantity,
      estimate: {
        allowedAmount: Math.round(allowedAmount * 100) / 100,
        planPays: Math.round(planPays * 100) / 100,
        yourResponsibility: Math.round(memberResp * 100) / 100,
      },
      accumulator: {
        deductible: plan.deductible,
        deductibleMet: Math.min(ytdUsed, plan.deductible),
        deductibleRemaining,
        outOfPocketMax: plan.oopMax,
        outOfPocketMet: ytdUsed,
        outOfPocketRemaining: oopRemaining,
      },
      disclaimer: 'This is an estimate only. Actual costs may vary based on final billing and medical necessity.',
    });
  } catch (error) {
    console.error('Cost estimate error:', error);
    return NextResponse.json({ error: 'Estimate failed' }, { status: 500 });
  }
}
