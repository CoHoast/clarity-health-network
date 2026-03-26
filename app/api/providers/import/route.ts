import { NextRequest, NextResponse } from 'next/server';
import { logAuditEvent } from '@/lib/audit';
import {
  createImportSession,
  updateImportSession,
  ImportChange,
} from '@/lib/import-session';
import providersData from '@/data/arizona-providers.json';
import fs from 'fs';
import path from 'path';

// For large CSV files - body size is handled by Next.js default (4MB)
// For files over 4MB, use streaming or chunked uploads

interface ImportRow {
  rowNumber?: number;
  entityNumber?: string;
  referenceNumber?: string;
  npi: string;
  firstName: string;
  lastName: string;
  name?: string;
  specialty?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  [key: string]: any;
}

// POST - Execute import with Entity Number as unique key per location
// NPI groups locations under the same provider
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { rows, fileName, createdBy, dryRun } = data as {
      rows: ImportRow[];
      fileName?: string;
      createdBy?: string;
      dryRun?: boolean;
    };
    
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    if (!rows || !Array.isArray(rows)) {
      return NextResponse.json({ error: 'Invalid request - rows array required' }, { status: 400 });
    }
    
    // Load current providers
    const providersFile = path.join(process.cwd(), 'data', 'arizona-providers.json');
    let providers: any[] = [];
    
    try {
      providers = JSON.parse(fs.readFileSync(providersFile, 'utf-8'));
    } catch (error) {
      providers = [...(providersData as any[])];
    }
    
    // Build lookup maps
    const existingByEntityNumber = new Map<string, { provider: any; locationIndex: number; providerIndex: number }>();
    const existingByNpi = new Map<string, { provider: any; providerIndex: number }>();
    
    providers.forEach((p, pIdx) => {
      if (p.npi) {
        existingByNpi.set(p.npi, { provider: p, providerIndex: pIdx });
      }
      // Provider-level entity number (legacy)
      if (p.entityNumber) {
        existingByEntityNumber.set(p.entityNumber, { provider: p, locationIndex: 0, providerIndex: pIdx });
      }
      // Location-level entity numbers
      if (p.locations && Array.isArray(p.locations)) {
        p.locations.forEach((loc: any, idx: number) => {
          if (loc.entityNumber) {
            existingByEntityNumber.set(loc.entityNumber, { provider: p, locationIndex: idx, providerIndex: pIdx });
          }
        });
      }
    });

    // Track entity numbers in this batch to detect duplicates
    const batchEntityNumbers = new Map<string, number>();
    rows.forEach((row, idx) => {
      const entityNum = row.entityNumber || row.referenceNumber;
      if (entityNum) {
        batchEntityNumbers.set(entityNum, (batchEntityNumbers.get(entityNum) || 0) + 1);
      }
    });

    // Process and categorize rows
    let newProvidersCreated = 0;
    let locationsAdded = 0;
    let skippedDuplicates = 0;
    let errors = 0;
    
    const changes: ImportChange[] = [];
    const decisions: { entityNumber: string; npi: string; action: string; reason: string }[] = [];

    // Track which providers we're creating in this batch (by NPI)
    const newProvidersInBatch = new Map<string, any>();

    for (const row of rows) {
      const entityNum = row.entityNumber || row.referenceNumber;
      
      // Validate required fields
      if (!row.npi || !/^\d{10}$/.test(row.npi)) {
        errors++;
        decisions.push({ 
          entityNumber: entityNum || 'N/A', 
          npi: row.npi || 'N/A', 
          action: 'error', 
          reason: 'Invalid or missing NPI' 
        });
        continue;
      }
      
      if (!entityNum) {
        errors++;
        decisions.push({ 
          entityNumber: 'N/A', 
          npi: row.npi, 
          action: 'error', 
          reason: 'Missing Entity Number' 
        });
        continue;
      }

      // Check for duplicate entity number in system
      if (existingByEntityNumber.has(entityNum)) {
        skippedDuplicates++;
        decisions.push({ 
          entityNumber: entityNum, 
          npi: row.npi, 
          action: 'skip', 
          reason: 'Entity Number already exists in system' 
        });
        continue;
      }

      // Check for duplicate entity number in this batch
      if ((batchEntityNumbers.get(entityNum) || 0) > 1) {
        skippedDuplicates++;
        decisions.push({ 
          entityNumber: entityNum, 
          npi: row.npi, 
          action: 'skip', 
          reason: 'Duplicate Entity Number in CSV file' 
        });
        continue;
      }

      // Build the location object from this row
      const newLocation = {
        entityNumber: entityNum,
        contractNumber: row.contractNumber || '',
        name: row.locationName || 'Primary',
        address: row.address || row.address1 || '',
        address2: row.address2 || '',
        city: row.city || '',
        state: row.state || 'AZ',
        zip: row.zip || '',
        county: row.county || '',
        phone: row.phone || '',
        fax: row.fax || '',
        email: row.email || '',
        specialtyAtLocation: row.specialty || '',
        isPrimaryCare: row.isPrimaryCare || false,
        isBehavioralHealth: row.isBehavioralHealth || false,
        acceptingNewPatients: row.acceptingNewPatients ?? true,
        directoryDisplay: row.directoryDisplay ?? true,
        pricingTier: row.pricingTier || '',
        networkOrg: row.networkOrg || '',
        effectiveDate: row.startDate || row.effectiveDate || '',
        terminationDate: row.endDate || row.terminationDate || '',
        hours: {
          monday: row.mondayHours || '',
          tuesday: row.tuesdayHours || '',
          wednesday: row.wednesdayHours || '',
          thursday: row.thursdayHours || '',
          friday: row.fridayHours || '',
          saturday: row.saturdayHours || '',
          sunday: row.sundayHours || '',
        },
        billing: {
          npi: row.billingNpi || '',
          taxId: row.billingTaxId || '',
          name: row.billingName || '',
          address: row.billingAddr1 || row.billingAddress || '',
          address2: row.billingAddr2 || '',
          city: row.billingCity || '',
          state: row.billingState || '',
          zip: row.billingZip || '',
          phone: row.billingPhone || '',
          fax: row.billingFax || '',
        },
      };

      // Check if provider already exists
      const existingProviderInfo = existingByNpi.get(row.npi);
      const batchProvider = newProvidersInBatch.get(row.npi);

      if (existingProviderInfo) {
        // Provider exists - add location to their locations array
        const provider = providers[existingProviderInfo.providerIndex];
        
        if (!provider.locations) {
          // Migrate legacy single-location provider to locations array
          provider.locations = [{
            entityNumber: provider.entityNumber || `legacy-${provider.npi}`,
            name: 'Primary',
            address: provider.address || '',
            address2: provider.address2 || '',
            city: provider.city || '',
            state: provider.state || '',
            zip: provider.zip || '',
            county: provider.county || '',
            phone: provider.phone || '',
            fax: provider.fax || '',
            email: provider.email || '',
          }];
        }
        
        provider.locations.push(newLocation);
        provider.updatedAt = new Date().toISOString();
        
        locationsAdded++;
        decisions.push({ 
          entityNumber: entityNum, 
          npi: row.npi, 
          action: 'add_location', 
          reason: `Added as location ${provider.locations.length} for existing provider` 
        });
        
        changes.push({
          type: 'update',
          npi: row.npi,
          providerId: provider.id,
          afterState: newLocation,
        });

      } else if (batchProvider) {
        // Provider being created in this batch - add location
        batchProvider.locations.push(newLocation);
        
        locationsAdded++;
        decisions.push({ 
          entityNumber: entityNum, 
          npi: row.npi, 
          action: 'add_location', 
          reason: `Added as location ${batchProvider.locations.length} for new provider in batch` 
        });

      } else {
        // New provider - create with this location
        const newProvider = {
          id: `prov-${entityNum}`,
          npi: row.npi,
          firstName: row.firstName || '',
          lastName: row.lastName || '',
          middleInitial: row.middleInitial || '',
          name: row.name || `${row.firstName || ''} ${row.lastName || ''}`.trim(),
          credentials: row.credential || row.credentials || '',
          gender: row.gender || 'U',
          specialty: row.specialty || '',
          specialtyCode: row.specialtyCode || '',
          taxonomyCode: row.primaryTaxonomy || row.taxonomyCode || '',
          secondarySpecialtyCode: row.secondarySpecialtyCode || '',
          secondaryTaxonomyCode: row.secondaryTaxonomy || row.secondaryTaxonomyCode || '',
          facilityType: row.facilityType || 'INDIVIDUAL',
          languages: Array.isArray(row.languages) ? row.languages : (row.languages ? [row.languages] : ['English']),
          // Store correspondence address at provider level
          correspondingAddress: {
            address1: row.correspondingAddr1 || '',
            address2: row.correspondingAddr2 || '',
            city: row.correspondingCity || '',
            state: row.correspondingState || '',
            zip: row.correspondingZip || '',
            contactName: row.contactName || '',
            fax: row.correspondingFax || '',
          },
          locations: [newLocation],
          importedAt: new Date().toISOString(),
          status: 'active',
        };
        
        // Track this new provider in case more locations come in this batch
        newProvidersInBatch.set(row.npi, newProvider);
        
        newProvidersCreated++;
        decisions.push({ 
          entityNumber: entityNum, 
          npi: row.npi, 
          action: 'create_provider', 
          reason: 'New provider created' 
        });
        
        changes.push({
          type: 'add',
          npi: row.npi,
          providerId: newProvider.id,
          afterState: newProvider,
        });
      }
    }

    // Add all new providers to the main array
    newProvidersInBatch.forEach(provider => {
      providers.push(provider);
    });

    // Calculate summary
    const summary = {
      totalRows: rows.length,
      newProvidersCreated,
      locationsAdded,
      skippedDuplicates,
      errors,
      totalProvidersAfter: providers.length,
    };

    // If dry run, return summary without saving
    if (dryRun) {
      return NextResponse.json({
        dryRun: true,
        summary,
        decisions: decisions.slice(0, 100), // Limit for response size
      });
    }

    // Create import session for tracking/rollback
    const session = createImportSession({
      fileName: fileName || 'import.csv',
      fileSize: JSON.stringify(rows).length,
      totalRows: rows.length,
      createdBy: createdBy || 'system',
    });

    // Save updated providers
    fs.writeFileSync(providersFile, JSON.stringify(providers, null, 2));

    // Update session with results
    updateImportSession(session.id, {
      status: 'completed',
      completedAt: new Date().toISOString(),
      changes,
      added: newProvidersCreated,
      updated: locationsAdded,
      skipped: skippedDuplicates,
      errors,
    });

    // Log audit event
    await logAuditEvent({
      category: 'data_change',
      action: 'provider_import',
      resource: fileName || 'import.csv',
      resourceType: 'provider_batch',
      userId: createdBy || 'system',
      user: createdBy || 'System Import',
      details: JSON.stringify(summary),
      ip,
      userAgent,
      severity: 'info',
      sessionId: 'import-session',
      phiAccessed: true,
      success: true,
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      summary,
      decisions: decisions.slice(0, 100), // Limit for response size
    });

  } catch (error) {
    console.error('Error importing providers:', error);
    return NextResponse.json({ error: 'Failed to import providers' }, { status: 500 });
  }
}
