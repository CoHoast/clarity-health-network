import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const payload = verifyAuth(req);
    if (payload.role !== 'provider') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const provider = await prisma.provider.findUnique({
      where: { id: payload.id },
      include: {
        locations: true,
        contracts: { where: { status: 'active' } },
      }
    });

    if (!provider) {
      return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
    }

    const { passwordHash, ...providerData } = provider;
    return NextResponse.json({ provider: providerData });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const payload = verifyAuth(req);
    if (payload.role !== 'provider') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const data = await req.json();
    const allowedFields = ['phone', 'fax', 'email', 'address', 'city', 'state', 'zip', 'acceptingPatients'];
    
    const updateData: any = {};
    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    }

    const provider = await prisma.provider.update({
      where: { id: payload.id },
      data: updateData,
    });

    const { passwordHash, ...providerData } = provider;
    return NextResponse.json({ provider: providerData, success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
