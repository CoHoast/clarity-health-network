import { NextRequest, NextResponse } from 'next/server';
import providersData from '@/data/arizona-providers.json';
import fs from 'fs';
import path from 'path';
import { maskProviderPII } from '@/lib/demo-mode';
import { recordChange } from '@/lib/change-history';
import { logAuditEvent } from '@/lib/audit';
import { sanitizeObject, validateProviderData } from '@/lib/security/input-sanitizer';

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
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  try {
    const rawUpdates = await request.json();
    
    // Sanitize input
    const updates = sanitizeObject(rawUpdates);
    
    // Find provider index
    const npi = id.replace(/^(prov-|PRV-)/i, '');
    const providers = [...providersData] as any[];
    const index = providers.findIndex(
      (p: any) => p.id === id || p.npi === npi || p.npi === id
    );
    
    if (index === -1) {
      return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
    }
    
    // Check for NPI change and prevent duplicates
    if (updates.npi && updates.npi !== providers[index].npi) {
      const existingWithNpi = providers.find(p => p.npi === updates.npi);
      if (existingWithNpi) {
        return NextResponse.json({ 
          error: 'Duplicate NPI',
          message: 'Another provider already has this NPI'
        }, { status: 409 });
      }
    }
    
    const previousValue = { ...providers[index] };
    
    // Apply updates (merge with existing)
    providers[index] = {
      ...providers[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    // Save to JSON file
    const filePath = path.join(process.cwd(), 'data', 'arizona-providers.json');
    fs.writeFileSync(filePath, JSON.stringify(providers, null, 2));
    
    // Record change history
    recordChange({
      userId: 'system',
      userName: 'Admin',
      action: 'update',
      resourceType: 'provider',
      resourceId: providers[index].id || providers[index].npi,
      resourceName: providers[index].name || `${providers[index].firstName} ${providers[index].lastName}`,
      oldData: previousValue,
      newData: providers[index],
    });
    
    // Log audit event
    await logAuditEvent({
      user: 'Admin',
      userId: 'system',
      action: 'Update Provider',
      category: 'data_change',
      resource: providers[index].npi,
      resourceType: 'Provider',
      resourceId: providers[index].id,
      details: `Updated provider ${providers[index].name || providers[index].npi}`,
      ip,
      userAgent,
      sessionId: 'api',
      severity: 'info',
      phiAccessed: true,
      success: true,
    });
    
    return NextResponse.json({ 
      provider: providers[index],
      message: 'Provider updated successfully',
    });
  } catch (error) {
    console.error('Error updating provider:', error);
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
