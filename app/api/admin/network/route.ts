import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const payload = verifyAuth(req);
    if (payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get provider distribution by state
    const byState = await prisma.provider.groupBy({
      by: ['state'],
      where: { contractStatus: 'contracted' },
      _count: true,
    });

    // Get provider distribution by specialty
    const bySpecialty = await prisma.provider.groupBy({
      by: ['specialty'],
      where: { contractStatus: 'contracted' },
      _count: true,
      orderBy: { _count: { specialty: 'desc' } },
      take: 10,
    });

    // Get member distribution by state
    const membersByState = await prisma.member.groupBy({
      by: ['state'],
      where: { status: 'active' },
      _count: true,
    });

    // Network adequacy metrics
    const totalProviders = await prisma.provider.count({ where: { contractStatus: 'contracted' } });
    const totalMembers = await prisma.member.count({ where: { status: 'active' } });
    const pcpCount = await prisma.provider.count({ 
      where: { contractStatus: 'contracted', specialty: { in: ['Family Medicine', 'Internal Medicine', 'Pediatrics'] } }
    });

    return NextResponse.json({
      providersByState: byState.map(s => ({ state: s.state, count: s._count })),
      providersBySpecialty: bySpecialty.map(s => ({ specialty: s.specialty, count: s._count })),
      membersByState: membersByState.map(s => ({ state: s.state, count: s._count })),
      metrics: {
        totalProviders,
        totalMembers,
        pcpCount,
        memberToProviderRatio: totalProviders > 0 ? (totalMembers / totalProviders).toFixed(1) : 0,
        memberToPcpRatio: pcpCount > 0 ? (totalMembers / pcpCount).toFixed(1) : 0,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
