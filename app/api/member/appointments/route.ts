import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const payload = verifyAuth(req);
    if (payload.role !== 'member') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // For demo, generate mock appointments based on recent claims
    const recentClaims = await prisma.claim.findMany({
      where: { memberId: payload.id },
      orderBy: { serviceDate: 'desc' },
      take: 5,
      include: {
        provider: { select: { name: true, specialty: true, phone: true, address: true, city: true, state: true } }
      }
    });

    // Create upcoming appointment suggestions based on claim history
    const now = new Date();
    const upcomingAppointments = [
      {
        id: 'apt-1',
        type: 'Annual Physical',
        provider: 'Dr. Sarah Johnson',
        specialty: 'Family Medicine',
        date: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        time: '10:00 AM',
        location: '123 Medical Center Dr, Cleveland, OH',
        status: 'confirmed',
      },
      {
        id: 'apt-2',
        type: 'Follow-up Visit',
        provider: 'Dr. Michael Chen',
        specialty: 'Cardiology',
        date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        time: '2:30 PM',
        location: '456 Heart Health Blvd, Cleveland, OH',
        status: 'pending',
      },
    ];

    // Past appointments from claims
    const pastAppointments = recentClaims.map((c, i) => ({
      id: `past-${i}`,
      type: c.placeOfService === '11' ? 'Office Visit' : 'Medical Service',
      provider: c.provider.name,
      specialty: c.provider.specialty,
      date: c.serviceDate.toISOString(),
      location: `${c.provider.address}, ${c.provider.city}, ${c.provider.state}`,
      status: 'completed',
      claimId: c.id,
    }));

    return NextResponse.json({
      upcoming: upcomingAppointments,
      past: pastAppointments,
      reminders: [
        { type: 'Annual Physical', lastDate: null, recommended: 'Schedule your annual wellness visit' },
        { type: 'Flu Shot', lastDate: null, recommended: 'Annual flu vaccination recommended' },
      ],
    });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
