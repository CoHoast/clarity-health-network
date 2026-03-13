import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    const member = await prisma.member.findFirst({
      where: { id, employerId: employerUser.employerId },
      include: {
        claims: {
          orderBy: { serviceDate: 'desc' },
          take: 10,
          include: {
            provider: { select: { name: true } }
          }
        },
      }
    });

    if (!member) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    const ytdClaims = await prisma.claim.aggregate({
      where: {
        memberId: id,
        serviceDate: { gte: new Date(`${new Date().getFullYear()}-01-01`) },
      },
      _count: true,
      _sum: { paidAmount: true },
    });

    return NextResponse.json({
      employee: {
        id: member.id,
        memberNumber: member.memberNumber,
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        phone: member.phone,
        dateOfBirth: member.dateOfBirth,
        address: member.address,
        city: member.city,
        state: member.state,
        zip: member.zip,
        planType: member.planType,
        relationship: member.relationship,
        status: member.status,
        effectiveDate: member.effectiveDate,
        terminationDate: member.terminationDate,
      },
      dependents: [], // Dependents tracked via relationship field
      claims: member.claims.map(c => ({
        id: c.id,
        claimNumber: c.claimNumber,
        provider: c.provider.name,
        serviceDate: c.serviceDate,
        amount: Number(c.paidAmount || 0),
        status: c.status,
      })),
      ytdStats: {
        claimCount: ytdClaims._count,
        totalPaid: Number(ytdClaims._sum.paidAmount) || 0,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const data = await req.json();

    // Verify employee belongs to this employer
    const existing = await prisma.member.findFirst({
      where: { id, employerId: employerUser.employerId },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    const allowedFields = ['email', 'phone', 'address', 'city', 'state', 'zip', 'status', 'terminationDate'];
    const updateData: any = {};
    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updateData[field] = field === 'terminationDate' && data[field] ? new Date(data[field]) : data[field];
      }
    }

    const member = await prisma.member.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ employee: member, success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
