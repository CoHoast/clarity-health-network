import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const payload = verifyAuth(req);
    if (payload.role !== 'member') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get member for plan type
    const member = await prisma.member.findUnique({
      where: { id: payload.id },
    });

    // Mock prescription data for demo
    const prescriptions = [
      {
        id: 'rx-1',
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        prescriber: 'Dr. Sarah Johnson',
        pharmacy: 'CVS Pharmacy',
        lastFilled: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        refillsRemaining: 3,
        daysSupply: 30,
        status: 'active',
        tier: 'generic',
        copay: 10,
      },
      {
        id: 'rx-2',
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily',
        prescriber: 'Dr. Sarah Johnson',
        pharmacy: 'CVS Pharmacy',
        lastFilled: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        refillsRemaining: 5,
        daysSupply: 30,
        status: 'active',
        tier: 'generic',
        copay: 10,
      },
      {
        id: 'rx-3',
        name: 'Atorvastatin',
        dosage: '20mg',
        frequency: 'Once daily at bedtime',
        prescriber: 'Dr. Michael Chen',
        pharmacy: 'Walgreens',
        lastFilled: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        refillsRemaining: 2,
        daysSupply: 90,
        status: 'refill_needed',
        tier: 'generic',
        copay: 10,
      },
    ];

    const rxCoverage = {
      generic: { copay: 10, description: 'Generic drugs' },
      preferred: { copay: 30, description: 'Preferred brand drugs' },
      nonPreferred: { copay: 50, description: 'Non-preferred brand drugs' },
      specialty: { coinsurance: 20, maxCopay: 200, description: 'Specialty drugs' },
    };

    return NextResponse.json({
      prescriptions,
      pharmacies: [
        { name: 'CVS Pharmacy', address: '123 Main St', phone: '(216) 555-0100', isPreferred: true },
        { name: 'Walgreens', address: '456 Oak Ave', phone: '(216) 555-0200', isPreferred: true },
        { name: 'Rite Aid', address: '789 Elm St', phone: '(216) 555-0300', isPreferred: false },
      ],
      coverage: rxCoverage,
      summary: {
        active: prescriptions.filter(p => p.status === 'active').length,
        needsRefill: prescriptions.filter(p => p.status === 'refill_needed').length,
        ytdSpend: 180, // Mock YTD prescription spending
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
