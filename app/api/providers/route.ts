import { NextRequest, NextResponse } from 'next/server';
import providersData from '@/data/arizona-providers.json';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '25');
  const search = searchParams.get('search') || '';
  const specialty = searchParams.get('specialty') || '';
  const city = searchParams.get('city') || '';
  const isPrimaryCare = searchParams.get('isPrimaryCare');
  const isBehavioralHealth = searchParams.get('isBehavioralHealth');
  const acceptingNew = searchParams.get('acceptingNew');
  
  let providers = [...providersData] as any[];
  
  // Apply filters
  if (search) {
    const searchLower = search.toLowerCase();
    providers = providers.filter((p: any) => 
      p.firstName?.toLowerCase().includes(searchLower) ||
      p.lastName?.toLowerCase().includes(searchLower) ||
      p.npi?.includes(search) ||
      p.contractNumber?.includes(search)
    );
  }
  
  if (specialty) {
    providers = providers.filter((p: any) => p.specialty === specialty);
  }
  
  if (city) {
    providers = providers.filter((p: any) => 
      p.locations?.[0]?.city?.toLowerCase() === city.toLowerCase()
    );
  }
  
  if (isPrimaryCare === 'true') {
    providers = providers.filter((p: any) => p.isPrimaryCare);
  }
  
  if (isBehavioralHealth === 'true') {
    providers = providers.filter((p: any) => p.isBehavioralHealth);
  }
  
  if (acceptingNew === 'true') {
    providers = providers.filter((p: any) => p.acceptingNewPatients);
  }
  
  // Calculate pagination
  const total = providers.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const paginated = providers.slice(offset, offset + limit);
  
  return NextResponse.json({
    providers: paginated,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
    filters: {
      search,
      specialty,
      city,
      isPrimaryCare,
      isBehavioralHealth,
      acceptingNew,
    },
  });
}
