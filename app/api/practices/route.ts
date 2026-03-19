import { NextRequest, NextResponse } from 'next/server';
import practicesData from '@/data/arizona-practices.json';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '50');
  const search = searchParams.get('search') || '';
  const id = searchParams.get('id') || '';
  
  let practices = [...practicesData] as any[];
  
  // Get single practice by ID
  if (id) {
    const practice = practices.find((p: any) => p.id === id);
    if (practice) {
      return NextResponse.json({ practice });
    }
    return NextResponse.json({ error: 'Practice not found' }, { status: 404 });
  }
  
  // Apply search filter
  if (search) {
    const searchLower = search.toLowerCase();
    practices = practices.filter((p: any) => 
      p.name?.toLowerCase().includes(searchLower) ||
      p.city?.toLowerCase().includes(searchLower) ||
      p.npi?.includes(search) ||
      p.taxId?.includes(search)
    );
  }
  
  // Sort by name
  practices.sort((a: any, b: any) => (a.name || '').localeCompare(b.name || ''));
  
  // Calculate pagination
  const total = practices.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const paginated = practices.slice(offset, offset + limit);
  
  return NextResponse.json({
    practices: paginated,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  });
}
