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
    const status = searchParams.get('status') || 'open';
    const severity = searchParams.get('severity');

    const where: any = {};
    if (status !== 'all') where.status = status;
    if (severity) where.severity = severity;

    const alerts = await prisma.fraudAlert.findMany({
      where,
      orderBy: [{ severity: 'desc' }, { createdAt: 'desc' }],
      take: 100,
    });

    // Get related entities
    const claimIds = alerts.filter(a => a.entityType === 'claim').map(a => a.entityId);
    const claims = await prisma.claim.findMany({
      where: { id: { in: claimIds } },
      select: { id: true, claimNumber: true, billedAmount: true },
    });

    const claimMap = new Map(claims.map(c => [c.id, c]));

    return NextResponse.json({
      alerts: alerts.map(a => ({
        id: a.id,
        entityType: a.entityType,
        entityId: a.entityId,
        alertType: a.alertType,
        severity: a.severity,
        score: a.score,
        details: a.details,
        status: a.status,
        assignedTo: a.assignedTo,
        resolvedAt: a.resolvedAt,
        resolution: a.resolution,
        createdAt: a.createdAt,
        entity: a.entityType === 'claim' ? claimMap.get(a.entityId) : null,
      })),
      summary: {
        open: alerts.filter(a => a.status === 'open').length,
        investigating: alerts.filter(a => a.status === 'investigating').length,
        critical: alerts.filter(a => a.severity === 'critical').length,
        high: alerts.filter(a => a.severity === 'high').length,
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const payload = verifyAuth(req);
    if (payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { alertId, status, resolution } = await req.json();

    const alert = await prisma.fraudAlert.update({
      where: { id: alertId },
      data: {
        status,
        resolution,
        resolvedAt: status === 'resolved' || status === 'false_positive' ? new Date() : null,
      }
    });

    return NextResponse.json({ alert, success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
