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

    // Mock document list for demo
    const documents = [
      {
        id: 'doc-1',
        type: 'plan_document',
        title: 'Summary Plan Description (SPD)',
        fileName: 'SPD_2026.pdf',
        uploadedAt: new Date('2026-01-01').toISOString(),
        size: '2.4 MB',
      },
      {
        id: 'doc-2',
        type: 'enrollment',
        title: 'Open Enrollment Guide 2026',
        fileName: 'OE_Guide_2026.pdf',
        uploadedAt: new Date('2025-11-01').toISOString(),
        size: '1.8 MB',
      },
      {
        id: 'doc-3',
        type: 'compliance',
        title: 'HIPAA Notice of Privacy Practices',
        fileName: 'HIPAA_Notice.pdf',
        uploadedAt: new Date('2026-01-01').toISOString(),
        size: '156 KB',
      },
      {
        id: 'doc-4',
        type: 'compliance',
        title: 'COBRA General Notice',
        fileName: 'COBRA_Notice.pdf',
        uploadedAt: new Date('2026-01-01').toISOString(),
        size: '89 KB',
      },
      {
        id: 'doc-5',
        type: 'report',
        title: 'Q1 2026 Utilization Report',
        fileName: 'Q1_2026_Utilization.pdf',
        uploadedAt: new Date('2026-04-01').toISOString(),
        size: '456 KB',
      },
      {
        id: 'doc-6',
        type: 'contract',
        title: 'Administrative Services Agreement',
        fileName: 'ASA_Agreement.pdf',
        uploadedAt: new Date('2025-12-15').toISOString(),
        size: '892 KB',
      },
    ];

    const grouped = {
      plan_document: documents.filter(d => d.type === 'plan_document'),
      enrollment: documents.filter(d => d.type === 'enrollment'),
      compliance: documents.filter(d => d.type === 'compliance'),
      report: documents.filter(d => d.type === 'report'),
      contract: documents.filter(d => d.type === 'contract'),
    };

    return NextResponse.json({
      documents,
      grouped,
      employer: {
        name: employerUser.employer.name,
        groupNumber: employerUser.employer.groupNumber,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
