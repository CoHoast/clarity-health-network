import { NextRequest, NextResponse } from 'next/server';
import { logAuditEvent } from '@/lib/audit';
import providersData from '@/data/arizona-providers.json';
import fs from 'fs';
import path from 'path';

// Create new provider
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Validate required fields
    if (!data.npi || !data.firstName || !data.lastName) {
      await logAuditEvent({
        user: 'system',
        userId: 'system',
        action: 'Create Provider',
        category: 'data_change',
        resource: 'PROVIDER',
        resourceType: 'Provider',
        details: 'Failed - Missing required fields: npi, firstName, lastName',
        ip,
        userAgent,
        sessionId: 'api',
        severity: 'warning',
        phiAccessed: false,
        success: false,
      });
      return NextResponse.json(
        { error: 'Missing required fields: npi, firstName, lastName' },
        { status: 400 }
      );
    }
    
    // Check for duplicate NPI
    const providers = [...providersData] as any[];
    const existing = providers.find((p: any) => p.npi === data.npi);
    if (existing) {
      await logAuditEvent({
        user: 'system',
        userId: 'system',
        action: 'Create Provider',
        category: 'data_change',
        resource: data.npi,
        resourceType: 'Provider',
        resourceId: data.npi,
        details: 'Failed - Provider with this NPI already exists',
        ip,
        userAgent,
        sessionId: 'api',
        severity: 'warning',
        phiAccessed: false,
        success: false,
      });
      return NextResponse.json(
        { error: 'Provider with this NPI already exists' },
        { status: 409 }
      );
    }
    
    // Create new provider
    const newProvider = {
      id: `prov-${data.npi}`,
      npi: data.npi,
      firstName: data.firstName,
      lastName: data.lastName,
      middleInitial: data.middleInitial || '',
      credentials: data.credentials || data.title || '',
      gender: data.gender || 'U',
      specialty: data.specialty || 'General Practice',
      specialtyCode: data.specialtyCode || '',
      taxonomyCode: data.taxonomyCode || '',
      secondarySpecialtyCode: data.secondarySpecialtyCode || '',
      secondaryTaxonomyCode: data.secondaryTaxonomyCode || '',
      facilityType: data.facilityType || 'INDIVIDUAL',
      isPrimaryCare: data.isPrimaryCare || false,
      isBehavioralHealth: data.isBehavioralHealth || false,
      acceptingNewPatients: data.acceptingNewPatients ?? true,
      directoryDisplay: data.directoryDisplay ?? true,
      languages: data.languages || ['English'],
      pricingTier: data.pricingTier || '',
      networkOrg: data.networkOrg || '',
      networkId: data.networkId || 'arizona-antidote',
      contractNumber: data.contractNumber || '',
      referenceNumber: data.referenceNumber || '',
      contractStartDate: data.contractStartDate || '',
      contractEndDate: data.contractEndDate || '',
      correspondingAddress: data.correspondingAddress || {
        address1: '', address2: '', city: '', state: '', zip: '', fax: '', contactName: ''
      },
      billing: data.billing || {
        npi: '', taxId: '', name: '', address1: '', address2: '', city: '', state: '', zip: '', phone: '', fax: ''
      },
      locations: data.locations || [{
        id: `loc-${data.npi}-0`,
        address1: data.address1 || '',
        address2: data.address2 || '',
        city: data.city || '',
        state: data.state || 'AZ',
        zip: data.zip || '',
        county: data.county || '',
        phone: data.phone || '',
        fax: data.fax || '',
        email: data.email || '',
        isPrimary: true,
        hours: data.hours || {},
      }],
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Add to array
    providers.push(newProvider);
    
    // Save to JSON file (will be replaced with database)
    const filePath = path.join(process.cwd(), 'data', 'arizona-providers.json');
    fs.writeFileSync(filePath, JSON.stringify(providers, null, 2));
    
    // Log the creation
    await logAuditEvent({
      user: 'admin@truecare.health',
      userId: 'admin',
      action: 'Create Provider',
      category: 'data_change',
      resource: newProvider.npi,
      resourceType: 'Provider',
      resourceId: newProvider.npi,
      details: `Created provider: ${newProvider.firstName} ${newProvider.lastName}, ${newProvider.specialty}`,
      ip,
      userAgent,
      sessionId: 'api',
      severity: 'info',
      phiAccessed: true,
      success: true,
    });
    
    return NextResponse.json({ 
      provider: newProvider,
      message: 'Provider created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Create provider error:', error);
    return NextResponse.json({ error: 'Failed to create provider' }, { status: 500 });
  }
}

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
