import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const payload = verifyAuth(req);
    if (payload.role !== 'provider') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const contracts = await prisma.contract.findMany({
      where: { providerId: payload.id },
      orderBy: { effectiveDate: 'desc' },
    });

    return NextResponse.json({
      contracts: contracts.map(c => ({
        id: c.id,
        contractNumber: c.contractNumber,
        type: c.type,
        terms: c.terms,
        effectiveDate: c.effectiveDate,
        terminationDate: c.terminationDate,
        status: c.status,
        autoRenew: c.autoRenew,
        renewalTerms: c.renewalTerms,
      })),
      activeContract: contracts.find(c => c.status === 'active') || null,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
