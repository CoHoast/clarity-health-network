import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const payload = verifyAuth(req);
    if (payload.role !== 'provider') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const locations = await prisma.providerLocation.findMany({
      where: { providerId: payload.id },
      orderBy: { isPrimary: 'desc' },
    });

    return NextResponse.json({
      locations: locations.map(l => ({
        id: l.id,
        name: l.name,
        address: l.address,
        city: l.city,
        state: l.state,
        zip: l.zip,
        phone: l.phone,
        fax: l.fax,
        isPrimary: l.isPrimary,
        acceptingPatients: l.acceptingPatients,
        hours: l.hours,
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = verifyAuth(req);
    if (payload.role !== 'provider') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const data = await req.json();

    const location = await prisma.providerLocation.create({
      data: {
        providerId: payload.id,
        name: data.name,
        address: data.address,
        city: data.city,
        state: data.state,
        zip: data.zip,
        phone: data.phone,
        fax: data.fax,
        isPrimary: false,
        acceptingPatients: data.acceptingPatients ?? true,
        hours: data.hours,
      }
    });

    return NextResponse.json({ location, success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add location' }, { status: 500 });
  }
}
