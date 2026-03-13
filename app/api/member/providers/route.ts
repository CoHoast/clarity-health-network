import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const payload = verifyAuth(req);
    
    if (payload.role !== 'member') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || '';
    const specialty = searchParams.get('specialty');
    const city = searchParams.get('city');
    const acceptingNew = searchParams.get('acceptingNew') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where: any = {
      status: 'active',
      contractStatus: 'contracted',
    };

    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { specialty: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (specialty) {
      where.specialty = specialty;
    }

    if (city) {
      where.city = { contains: city, mode: 'insensitive' };
    }

    if (acceptingNew) {
      where.acceptingPatients = true;
    }

    const [providers, total] = await Promise.all([
      prisma.provider.findMany({
        where,
        orderBy: { name: 'asc' },
        skip,
        take: limit,
        include: {
          locations: true,
        }
      }),
      prisma.provider.count({ where })
    ]);

    // Get list of specialties for filter
    const specialties = await prisma.provider.findMany({
      where: { status: 'active', contractStatus: 'contracted' },
      select: { specialty: true },
      distinct: ['specialty'],
    });

    return NextResponse.json({
      providers: providers.map(p => ({
        id: p.id,
        npi: p.npi,
        name: p.name,
        specialty: p.specialty,
        address: p.address,
        city: p.city,
        state: p.state,
        zip: p.zip,
        phone: p.phone,
        acceptingPatients: p.acceptingPatients,
        locations: p.locations.map(loc => ({
          id: loc.id,
          name: loc.name,
          address: loc.address,
          city: loc.city,
          state: loc.state,
          zip: loc.zip,
          phone: loc.phone,
          isPrimary: loc.isPrimary,
        })),
      })),
      specialties: specialties.map(s => s.specialty).filter(Boolean).sort(),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    console.error('Provider search error:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
