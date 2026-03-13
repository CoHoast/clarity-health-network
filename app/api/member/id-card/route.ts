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
      include: { employer: true }
    });

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    // Generate ID card data
    const idCard = {
      member: {
        id: member.id,
        memberNumber: member.memberNumber,
        firstName: member.firstName,
        lastName: member.lastName,
        dateOfBirth: member.dateOfBirth,
        relationship: member.relationship,
      },
      plan: {
        name: member.planType === 'platinum_ppo' ? 'Platinum PPO' :
              member.planType === 'gold_ppo' ? 'Gold PPO' : 'Silver PPO',
        type: member.planType,
        groupNumber: member.employer?.groupNumber || 'INDIVIDUAL',
        groupName: member.employer?.name || 'Individual Plan',
      },
      coverage: {
        effectiveDate: member.effectiveDate,
        terminationDate: member.terminationDate,
        status: member.status,
      },
      copays: {
        primaryCare: member.planType === 'platinum_ppo' ? 15 : member.planType === 'gold_ppo' ? 25 : 35,
        specialist: member.planType === 'platinum_ppo' ? 25 : member.planType === 'gold_ppo' ? 40 : 50,
        urgentCare: member.planType === 'platinum_ppo' ? 35 : member.planType === 'gold_ppo' ? 50 : 75,
        emergency: member.planType === 'platinum_ppo' ? 100 : member.planType === 'gold_ppo' ? 150 : 250,
      },
      rxBin: '610014',
      rxPcn: 'CLRTY',
      rxGroup: member.employer?.groupNumber || 'IND001',
      network: 'Clarity Health Network',
      customerService: '1-800-CLARITY',
      providerServices: '1-800-555-0100',
    };

    return NextResponse.json(idCard);
  } catch (error) {
    console.error('ID card error:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
