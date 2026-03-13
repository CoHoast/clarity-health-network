import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const payload = verifyAuth(req);
    if (payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const where: any = {};
    if (status && status !== 'all') where.status = status;

    const applications = await prisma.credentialingApplication.findMany({
      where,
      orderBy: { submittedAt: 'desc' },
      include: {
        provider: { select: { name: true, npi: true, specialty: true } },
        documents: true,
      }
    });

    return NextResponse.json({
      applications: applications.map(a => ({
        id: a.id,
        provider: {
          id: a.providerId,
          name: a.provider.name,
          npi: a.provider.npi,
          specialty: a.provider.specialty,
        },
        status: a.status,
        submittedAt: a.submittedAt,
        reviewedAt: a.reviewedAt,
        approvedAt: a.approvedAt,
        license: {
          number: a.licenseNumber,
          state: a.licenseState,
          expiry: a.licenseExpiry,
        },
        dea: {
          number: a.deaNumber,
          expiry: a.deaExpiry,
        },
        malpractice: {
          carrier: a.malpracticeCarrier,
          expiry: a.malpracticeExpiry,
        },
        documentCount: a.documents.length,
        notes: a.notes,
      })),
      summary: {
        pending: applications.filter(a => a.status === 'submitted' || a.status === 'in_review').length,
        approved: applications.filter(a => a.status === 'approved').length,
        denied: applications.filter(a => a.status === 'denied').length,
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
