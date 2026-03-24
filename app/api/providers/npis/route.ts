import { NextRequest, NextResponse } from 'next/server';
import providersData from '@/data/arizona-providers.json';

// GET all NPIs for duplicate checking (lightweight endpoint)
export async function GET(request: NextRequest) {
  try {
    const providers = providersData as any[];
    
    // Return just NPIs and minimal data needed for duplicate detection
    const npis = providers.map(p => ({
      npi: p.npi,
      firstName: p.firstName || '',
      lastName: p.lastName || '',
      specialty: p.specialty || '',
    }));
    
    return NextResponse.json({
      total: npis.length,
      npis,
    });
  } catch (error) {
    console.error('Error fetching NPIs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch NPIs' },
      { status: 500 }
    );
  }
}
