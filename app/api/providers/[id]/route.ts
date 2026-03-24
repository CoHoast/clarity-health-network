import { NextRequest, NextResponse } from 'next/server';
import providersData from '@/data/arizona-providers.json';
import fs from 'fs';
import path from 'path';
import { maskProviderPII } from '@/lib/demo-mode';

// Get single provider
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  // Find provider by ID or NPI
  const npi = id.replace(/^(prov-|PRV-)/i, '');
  const provider = (providersData as any[]).find(
    (p: any) => p.id === id || p.npi === npi || p.npi === id
  );
  
  if (!provider) {
    return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
  }
  
  // Log successful access
  
  return NextResponse.json({ provider: maskProviderPII(provider) });
}

// Update provider
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const updates = await request.json();
    
    // Find provider index
    const npi = id.replace(/^(prov-|PRV-)/i, '');
    const providers = [...providersData] as any[];
    const index = providers.findIndex(
      (p: any) => p.id === id || p.npi === npi || p.npi === id
    );
    
    if (index === -1) {
      return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
    }
    
    const previousValue = { ...providers[index] };
    
    // Apply updates (merge with existing)
    providers[index] = {
      ...providers[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    // Save to JSON file (will be replaced with database)
    const filePath = path.join(process.cwd(), 'data', 'arizona-providers.json');
    fs.writeFileSync(filePath, JSON.stringify(providers, null, 2));
    
    // Log the update with before/after values
    
    return NextResponse.json({ 
      provider: providers[index],
      message: 'Provider updated successfully',
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update provider' }, { status: 500 });
  }
}

// Delete provider
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    // Find provider index
    const npi = id.replace(/^(prov-|PRV-)/i, '');
    const providers = [...providersData] as any[];
    const index = providers.findIndex(
      (p: any) => p.id === id || p.npi === npi || p.npi === id
    );
    
    if (index === -1) {
      return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
    }
    
    const deletedProvider = providers[index];
    
    // Remove from array
    providers.splice(index, 1);
    
    // Save to JSON file (will be replaced with database)
    const filePath = path.join(process.cwd(), 'data', 'arizona-providers.json');
    fs.writeFileSync(filePath, JSON.stringify(providers, null, 2));
    
    // Log the deletion
    
    return NextResponse.json({ 
      message: 'Provider deleted successfully',
      deletedProvider: {
        npi: deletedProvider.npi,
        name: `${deletedProvider.firstName} ${deletedProvider.lastName}`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete provider' }, { status: 500 });
  }
}
