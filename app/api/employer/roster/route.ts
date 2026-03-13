import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';

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

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const skip = (page - 1) * limit;

    const where: any = { employerId: employerUser.employerId };
    if (status && status !== 'all') where.status = status;
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { memberNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [members, total] = await Promise.all([
      prisma.member.findMany({
        where,
        orderBy: { lastName: 'asc' },
        skip,
        take: limit,
      }),
      prisma.member.count({ where }),
    ]);

    return NextResponse.json({
      employees: members.map(m => ({
        id: m.id,
        memberNumber: m.memberNumber,
        firstName: m.firstName,
        lastName: m.lastName,
        email: m.email,
        dateOfBirth: m.dateOfBirth,
        planType: m.planType,
        relationship: m.relationship,
        status: m.status,
        effectiveDate: m.effectiveDate,
        terminationDate: m.terminationDate,
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
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

    const data = await req.json();
    
    // Generate member number
    const lastMember = await prisma.member.findFirst({
      orderBy: { memberNumber: 'desc' },
    });
    const lastNum = lastMember ? parseInt(lastMember.memberNumber.split('-')[1]) : 100000;
    const memberNumber = `CLH-${lastNum + 1}`;

    const member = await prisma.member.create({
      data: {
        employerId: employerUser.employerId,
        memberNumber,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        passwordHash: bcrypt.hashSync('welcome123', 10),
        dateOfBirth: new Date(data.dateOfBirth),
        gender: data.gender,
        address: data.address,
        city: data.city,
        state: data.state,
        zip: data.zip,
        phone: data.phone,
        planType: employerUser.employer.planType,
        relationship: data.relationship || 'subscriber',
        status: 'active',
        effectiveDate: new Date(data.effectiveDate || Date.now()),
      }
    });

    return NextResponse.json({ employee: member, success: true });
  } catch (error) {
    console.error('Add employee error:', error);
    return NextResponse.json({ error: 'Failed to add employee' }, { status: 500 });
  }
}
