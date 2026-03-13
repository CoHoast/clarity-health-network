import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const payload = verifyAuth(req);
    if (payload.role !== 'provider') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const [provider, application] = await Promise.all([
      prisma.provider.findUnique({
        where: { id: payload.id },
        select: { credentialStatus: true, credentialExpiry: true }
      }),
      prisma.credentialingApplication.findUnique({
        where: { providerId: payload.id },
        include: { documents: true }
      })
    ]);

    return NextResponse.json({
      status: provider?.credentialStatus || 'not_started',
      expiryDate: provider?.credentialExpiry,
      application: application ? {
        id: application.id,
        status: application.status,
        submittedAt: application.submittedAt,
        reviewedAt: application.reviewedAt,
        approvedAt: application.approvedAt,
        license: {
          number: application.licenseNumber,
          state: application.licenseState,
          expiry: application.licenseExpiry,
        },
        dea: {
          number: application.deaNumber,
          expiry: application.deaExpiry,
        },
        malpractice: {
          carrier: application.malpracticeCarrier,
          expiry: application.malpracticeExpiry,
        },
        documents: application.documents.map(d => ({
          id: d.id,
          type: d.type,
          fileName: d.fileName,
          uploadedAt: d.uploadedAt,
          verifiedAt: d.verifiedAt,
        })),
      } : null,
      nextReviewDate: provider?.credentialExpiry,
      alerts: {
        expiringLicense: application?.licenseExpiry 
          ? new Date(application.licenseExpiry) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
          : false,
        expiringDea: application?.deaExpiry
          ? new Date(application.deaExpiry) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
          : false,
        expiringMalpractice: application?.malpracticeExpiry
          ? new Date(application.malpracticeExpiry) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
          : false,
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
