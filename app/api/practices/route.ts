import { NextRequest, NextResponse } from 'next/server';
import practicesData from '@/data/arizona-practices.json';
import fs from 'fs';
import path from 'path';
import { maskPracticePII } from '@/lib/demo-mode';

// Create new practice
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.taxId) {
      return NextResponse.json(
        { error: 'Missing required fields: name, taxId' },
        { status: 400 }
      );
    }
    
    const practices = [...practicesData] as any[];
    
    // Check for duplicate Tax ID
    const existing = practices.find((p: any) => p.taxId === data.taxId);
    if (existing) {
      return NextResponse.json(
        { error: 'Practice with this Tax ID already exists' },
        { status: 409 }
      );
    }
    
    const newPractice = {
      id: `practice-${data.taxId}`,
      name: data.name,
      taxId: data.taxId,
      npi: data.npi || '',
      address1: data.address1 || '',
      address2: data.address2 || '',
      city: data.city || '',
      state: data.state || 'AZ',
      zip: data.zip || '',
      phone: data.phone || '',
      fax: data.fax || '',
      providerCount: data.providerCount || 0,
      providerIds: data.providerIds || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    practices.push(newPractice);
    
    // Save to JSON file
    const filePath = path.join(process.cwd(), 'data', 'arizona-practices.json');
    fs.writeFileSync(filePath, JSON.stringify(practices, null, 2));
    
    
    return NextResponse.json({ 
      practice: newPractice,
      message: 'Practice created successfully',
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create practice' }, { status: 500 });
  }
}

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
      return NextResponse.json({ practice: maskPracticePII(practice) });
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
    practices: paginated.map(maskPracticePII),
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  });
}
