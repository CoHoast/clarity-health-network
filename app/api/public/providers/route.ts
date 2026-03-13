import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || '';
    const specialty = searchParams.get('specialty');
    const city = searchParams.get('city');
    const state = searchParams.get('state');
    const zip = searchParams.get('zip');
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

    if (specialty) where.specialty = specialty;
    if (city) where.city = { contains: city, mode: 'insensitive' };
    if (state) where.state = state;
    if (zip) where.zip = { startsWith: zip.substring(0, 3) };
    if (acceptingNew) where.acceptingPatients = true;

    const [providers, total] = await Promise.all([
      prisma.provider.findMany({
        where,
        orderBy: { name: 'asc' },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          specialty: true,
          address: true,
          city: true,
          state: true,
          zip: true,
          phone: true,
          acceptingPatients: true,
          locations: {
            select: {
              name: true,
              address: true,
              city: true,
              state: true,
              zip: true,
              phone: true,
            }
          },
        }
      }),
      prisma.provider.count({ where })
    ]);

    // Get specialties for filter
    const specialties = await prisma.provider.findMany({
      where: { status: 'active', contractStatus: 'contracted' },
      select: { specialty: true },
      distinct: ['specialty'],
    });

    // Get states for filter
    const states = await prisma.provider.findMany({
      where: { status: 'active', contractStatus: 'contracted' },
      select: { state: true },
      distinct: ['state'],
    });

    return NextResponse.json({
      providers,
      filters: {
        specialties: specialties.map(s => s.specialty).filter(Boolean).sort(),
        states: states.map(s => s.state).filter(Boolean).sort(),
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    console.error('Provider search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
