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
    });

    if (!employerUser) {
      return NextResponse.json({ error: 'Employer not found' }, { status: 404 });
    }

    const invoices = await prisma.invoice.findMany({
      where: { employerId: employerUser.employerId },
      orderBy: { dueDate: 'desc' },
    });

    const ytdPaid = invoices
      .filter(i => i.status === 'paid' && i.paidDate && new Date(i.paidDate).getFullYear() === new Date().getFullYear())
      .reduce((sum, i) => sum + Number(i.totalAmount), 0);

    return NextResponse.json({
      invoices: invoices.map(i => ({
        id: i.id,
        invoiceNumber: i.invoiceNumber,
        periodStart: i.periodStart,
        periodEnd: i.periodEnd,
        premiumAmount: Number(i.premiumAmount),
        adminFees: Number(i.adminFees),
        totalAmount: Number(i.totalAmount),
        dueDate: i.dueDate,
        paidDate: i.paidDate,
        status: i.status,
      })),
      summary: {
        pending: invoices.filter(i => i.status === 'pending').length,
        totalDue: invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + Number(i.totalAmount), 0),
        ytdPaid,
        overdue: invoices.filter(i => i.status === 'pending' && new Date(i.dueDate) < new Date()).length,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
